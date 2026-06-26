"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const backBtnSvg = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const TITLES = {
  default: "Winston",
  jobList: "Applicant List",
  candidate: "Candidate application",
} as const;

type HeaderMode = keyof typeof TITLES;

interface PanelHeaderProps {
  headerMode: HeaderMode;
  onToggle: () => void;
  onToggleMenu: (e?: React.MouseEvent) => void;
  onMenuAction: (action: "reset" | "history") => void;
  onCloseJobList: () => void;
  onCloseCandidateApp: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  menuBtnRef: React.RefObject<HTMLDivElement | null>;
}

const BACK_WRAP_WIDTH = 30;
const BACK_WRAP_GAP = 10;
const HEADER_DURATION = 0.28;

export function PanelHeader({
  headerMode,
  onToggle,
  onToggleMenu,
  onMenuAction,
  onCloseJobList,
  onCloseCandidateApp,
  menuRef,
  menuBtnRef,
}: PanelHeaderProps) {
  const backWrapRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const defaultTitleRef = useRef<HTMLSpanElement>(null);
  const jobListTitleRef = useRef<HTMLSpanElement>(null);
  const candidateTitleRef = useRef<HTMLSpanElement>(null);
  const titleRefByMode: Record<HeaderMode, React.RefObject<HTMLSpanElement | null>> = {
    default: defaultTitleRef,
    jobList: jobListTitleRef,
    candidate: candidateTitleRef,
  };
  const prevModeRef = useRef<HeaderMode>(headerMode);
  const initializedRef = useRef(false);

  useEffect(() => {
    const backWrap = backWrapRef.current;
    const back = backRef.current;
    if (!backWrap || !back) return;

    const showBack = headerMode !== "default";

    if (!initializedRef.current) {
      initializedRef.current = true;
      gsap.set(backWrap, {
        width: showBack ? BACK_WRAP_WIDTH : 0,
        marginRight: showBack ? BACK_WRAP_GAP : 0,
      });
      gsap.set(back, { autoAlpha: showBack ? 1 : 0, x: showBack ? 0 : -10 });
      (Object.keys(TITLES) as HeaderMode[]).forEach((mode) => {
        const el = titleRefByMode[mode].current;
        if (el) {
          gsap.set(el, { autoAlpha: mode === headerMode ? 1 : 0 });
        }
      });
      prevModeRef.current = headerMode;
      return;
    }

    if (prevModeRef.current === headerMode) return;

    const from = prevModeRef.current;
    const to = headerMode;
    const tl = gsap.timeline();

    const outTitle = titleRefByMode[from].current;
    const inTitle = titleRefByMode[to].current;

    if (to === "default") {
      tl.to(
        back,
        { autoAlpha: 0, x: -10, duration: HEADER_DURATION * 0.75, ease: "power2.in" },
        0
      );
      tl.to(
        backWrap,
        { width: 0, marginRight: 0, duration: HEADER_DURATION, ease: "power2.inOut" },
        0
      );
    } else if (from === "default") {
      gsap.set(back, { autoAlpha: 0, x: -10 });
      tl.to(
        backWrap,
        { width: BACK_WRAP_WIDTH, marginRight: BACK_WRAP_GAP, duration: HEADER_DURATION, ease: "power2.out" },
        0
      );
      tl.to(
        back,
        { autoAlpha: 1, x: 0, duration: HEADER_DURATION, ease: "power2.out" },
        0.04
      );
    }

    if (outTitle && inTitle) {
      tl.to(
        outTitle,
        { autoAlpha: 0, duration: HEADER_DURATION * 0.7, ease: "power2.in" },
        0
      );
      gsap.set(inTitle, { autoAlpha: 0 });
      tl.to(
        inTitle,
        { autoAlpha: 1, duration: HEADER_DURATION, ease: "power2.out" },
        HEADER_DURATION * 0.25
      );
    }

    prevModeRef.current = headerMode;
  }, [headerMode]);

  return (
    <div className="panel-header">
      <div className="panel-header-left">
        <div className="panel-header-back-wrap" ref={backWrapRef}>
          <button
            ref={backRef}
            className="panel-header-back"
            type="button"
            aria-label="Back"
            aria-hidden={headerMode === "default"}
            tabIndex={headerMode === "default" ? -1 : 0}
            onClick={headerMode === "candidate" ? onCloseCandidateApp : onCloseJobList}
          >
            {backBtnSvg}
          </button>
        </div>
        <div className="panel-title-track">
          <span
            ref={defaultTitleRef}
            className="panel-title panel-title-item"
            aria-hidden={headerMode !== "default"}
          >
            {TITLES.default}
          </span>
          <span
            ref={jobListTitleRef}
            className="panel-title panel-title-item"
            aria-hidden={headerMode !== "jobList"}
          >
            {TITLES.jobList}
          </span>
          <span
            ref={candidateTitleRef}
            className="panel-title panel-title-item"
            aria-hidden={headerMode !== "candidate"}
          >
            {TITLES.candidate}
          </span>
        </div>
      </div>
      <div className="panel-header-actions">
        <div className="menu-anchor">
          <div
            className="panel-icon-btn"
            ref={menuBtnRef}
            onClick={onToggleMenu}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onToggleMenu();
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </div>
          <div className="context-menu" ref={menuRef} role="menu">
            <div
              className="context-menu-item"
              role="menuitem"
              onClick={() => onMenuAction("reset")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#383C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <path d="M21 4v5h-5" />
              </svg>
              Reset conversation
            </div>
            <div
              className="context-menu-item"
              role="menuitem"
              onClick={() => onMenuAction("history")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#383C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v5h5" />
                <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
                <path d="M12 7v5l3 2" />
              </svg>
              Load chat history
            </div>
          </div>
        </div>
        <div
          className="panel-icon-btn"
          onClick={onToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onToggle();
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </div>
    </div>
  );
}
