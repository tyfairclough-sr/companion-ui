"use client";

import { useCallback, useRef, useState } from "react";

export type SheetSnap = 0 | 1 | 2;

const PEEK_BODY_HEIGHT = 320;
const FULL_VIEWPORT_RATIO = 0.8;
const VELOCITY_THRESHOLD = 0.35;
const DRAG_THRESHOLD = 6;

export function useSheetSnap() {
  const [snap, setSnap] = useState<SheetSnap>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);

  const footerRef = useRef<HTMLDivElement>(null);
  const snapRef = useRef(snap);
  const isDraggingRef = useRef(false);
  snapRef.current = snap;
  isDraggingRef.current = isDragging;

  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const hasDragged = useRef(false);

  const getSnapHeights = useCallback(() => {
    const footer = footerRef.current;
    const bodyEl = footer?.querySelector(".panel-sheet-body") as HTMLElement | null;
    const footerHeight = footer?.offsetHeight ?? 0;
    const bodyClientHeight = bodyEl?.clientHeight ?? 0;
    const chrome = Math.max(footerHeight - bodyClientHeight, 120);
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    const full = Math.max(viewportHeight * FULL_VIEWPORT_RATIO - chrome, PEEK_BODY_HEIGHT + 48);

    return { peek: PEEK_BODY_HEIGHT, full, chrome };
  }, []);

  const heightForSnap = useCallback(
    (target: SheetSnap) => {
      if (target === 0) return 0;
      if (target === 1) return PEEK_BODY_HEIGHT;
      const { full } = getSnapHeights();
      return full;
    },
    [getSnapHeights]
  );

  const resolveSnap = useCallback((height: number, vel: number, fromSnap: SheetSnap) => {
    const { peek, full } = getSnapHeights();

    if (vel > VELOCITY_THRESHOLD) {
      if (fromSnap === 0) return 1 as SheetSnap;
      if (fromSnap === 1) return 2 as SheetSnap;
      return 2 as SheetSnap;
    }
    if (vel < -VELOCITY_THRESHOLD) {
      if (fromSnap === 2) return 1 as SheetSnap;
      if (fromSnap === 1) return 0 as SheetSnap;
      return 0 as SheetSnap;
    }

    const distances: { snap: SheetSnap; dist: number }[] = [
      { snap: 0, dist: Math.abs(height - 0) },
      { snap: 1, dist: Math.abs(height - peek) },
      { snap: 2, dist: Math.abs(height - full) },
    ];
    distances.sort((a, b) => a.dist - b.dist);
    return distances[0].snap;
  }, [getSnapHeights]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragStartY.current = e.clientY;
      dragStartHeight.current = heightForSnap(snapRef.current);
      lastY.current = e.clientY;
      lastTime.current = e.timeStamp;
      velocity.current = 0;
      hasDragged.current = false;
      isDraggingRef.current = true;
      setIsDragging(true);
      setBodyHeight(dragStartHeight.current);
    },
    [heightForSnap]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!isDraggingRef.current) return;

      const delta = dragStartY.current - e.clientY;
      if (Math.abs(delta) > DRAG_THRESHOLD) hasDragged.current = true;

      const dt = e.timeStamp - lastTime.current;
      if (dt > 0) velocity.current = (lastY.current - e.clientY) / dt;
      lastY.current = e.clientY;
      lastTime.current = e.timeStamp;

      const { full } = getSnapHeights();
      setBodyHeight(Math.max(0, Math.min(full, dragStartHeight.current + delta)));
    },
    [getSnapHeights]
  );

  const finishDrag = useCallback(
    (clientY: number) => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      setIsDragging(false);

      if (!hasDragged.current) {
        const next = ((snapRef.current + 1) % 3) as SheetSnap;
        setSnap(next);
        setBodyHeight(heightForSnap(next));
        return;
      }

      const currentHeight = dragStartHeight.current + (dragStartY.current - clientY);
      const target = resolveSnap(currentHeight, velocity.current, snapRef.current);
      setSnap(target);
      setBodyHeight(heightForSnap(target));
    },
    [heightForSnap, resolveSnap]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      finishDrag(e.clientY);
    },
    [finishDrag]
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      finishDrag(e.clientY);
    },
    [finishDrag]
  );

  const resetSnap = useCallback(() => {
    isDraggingRef.current = false;
    setSnap(0);
    setBodyHeight(0);
    setIsDragging(false);
  }, []);

  const expandToPeek = useCallback(() => {
    setSnap(1);
    setBodyHeight(heightForSnap(1));
  }, [heightForSnap]);

  const expandedBodyHeight = isDragging ? bodyHeight : heightForSnap(snap);
  const isExpanded = snap > 0 || (isDragging && bodyHeight > 0);

  return {
    snap,
    setSnap,
    isDragging,
    isExpanded,
    expandedBodyHeight,
    footerRef,
    resetSnap,
    expandToPeek,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  };
}
