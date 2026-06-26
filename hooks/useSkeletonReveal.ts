"use client";

import { useEffect, useState } from "react";

const MIN_DELAY_MS = 250;
const MAX_DELAY_MS = 3000;

export function randomSkeletonDelay(
  min = MIN_DELAY_MS,
  max = MAX_DELAY_MS
): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface UseSkeletonRevealOptions {
  /** Layer is visible and should participate in skeleton timing. */
  enabled?: boolean;
  /** Underlying content is available to reveal. */
  ready: boolean;
  /** Changing this restarts the random delay (e.g. new candidate id). */
  resetKey?: string | number | null;
}

/** Returns true while the skeleton placeholder should remain visible. */
export function useSkeletonReveal({
  enabled = true,
  ready,
  resetKey,
}: UseSkeletonRevealOptions): boolean {
  const [delayComplete, setDelayComplete] = useState(false);

  useEffect(() => {
    setDelayComplete(false);

    if (!enabled || !ready) return;

    const delay = randomSkeletonDelay();
    const timer = window.setTimeout(() => setDelayComplete(true), delay);
    return () => window.clearTimeout(timer);
  }, [enabled, ready, resetKey]);

  if (!enabled) return false;
  return !ready || !delayComplete;
}
