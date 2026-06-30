"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const TITLES = {
  default: "Winston",
  jobList: "Applicant List",
  candidate: "Candidate application",
  contact: "Contact",
} as const;

type HeaderMode = keyof typeof TITLES;

const backBtnSvg = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const returnBtnSvg = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h11a5 5 0 0 1 0 10H9" />
  </svg>
);

interface ActionPanelHeaderProps {
  headerMode: HeaderMode;
  visible: boolean;
  canReturnToChat: boolean;
  onCloseJobList: () => void;
  onCloseCandidateApp: () => void;
  onCloseContactCard: () => void;
  onReturnToChat: () => void;
}

const HEADER_DURATION = 0.28;
const RETURN_WRAP_WIDTH = 30;
const RETURN_WRAP_GAP = 6;

export function ActionPanelHeader({
  headerMode,
  visible,
  canReturnToChat,
  onCloseJobList,
  onCloseCandidateApp,
  onCloseContactCard,
  onReturnToChat,
}: ActionPanelHeaderProps) {
  const returnWrapRef = useRef<HTMLDivElement>(null);
  const returnRef = useRef<HTMLButtonElement>(null);
  const backWrapRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const defaultTitleRef = useRef<HTMLSpanElement>(null);
  const jobListTitleRef = useRef<HTMLSpanElement>(null);
  const candidateTitleRef = useRef<HTMLSpanElement>(null);
  const contactTitleRef = useRef<HTMLSpanElement>(null);
  const titleRefByMode: Record<Exclude<HeaderMode, "default">, React.RefObject<HTMLSpanElement | null>> = {
    jobList: jobListTitleRef,
    candidate: candidateTitleRef,
    contact: contactTitleRef,
  };
  const prevModeRef = useRef<HeaderMode>(headerMode);
  const initializedRef = useRef(false);
  const returnInitializedRef = useRef(false);

  const showBack = headerMode !== "default";

  // The header is unmounted from the DOM while hidden (returns null below), but
  // this component instance persists, so its DOM elements are recreated on each
  // reopen. Reset the init flags when hidden so the fresh elements get their
  // initial GSAP state applied again instead of keeping CSS defaults.
  useEffect(() => {
    if (!visible) {
      initializedRef.current = false;
      returnInitializedRef.current = false;
    }
  }, [visible]);

  useEffect(() => {
    const backWrap = backWrapRef.current;
    const back = backRef.current;
    if (!backWrap || !back) return;

    if (!initializedRef.current) {
      initializedRef.current = true;
      gsap.set(backWrap, {
        width: showBack ? 30 : 0,
        marginRight: showBack ? 10 : 0,
      });
      gsap.set(back, { autoAlpha: showBack ? 1 : 0, x: showBack ? 0 : -10 });
      (["jobList", "candidate", "contact"] as const).forEach((mode) => {
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

    const outTitle =
      from !== "default" ? titleRefByMode[from as Exclude<HeaderMode, "default">]?.current : null;
    const inTitle =
      to !== "default" ? titleRefByMode[to as Exclude<HeaderMode, "default">]?.current : null;

    if (to === "default") {
      tl.to(back, { autoAlpha: 0, x: -10, duration: HEADER_DURATION * 0.75, ease: "power2.in" }, 0);
      tl.to(backWrap, { width: 0, marginRight: 0, duration: HEADER_DURATION, ease: "power2.inOut" }, 0);
    } else if (from === "default") {
      gsap.set(back, { autoAlpha: 0, x: -10 });
      tl.to(backWrap, { width: 30, marginRight: 10, duration: HEADER_DURATION, ease: "power2.out" }, 0);
      tl.to(back, { autoAlpha: 1, x: 0, duration: HEADER_DURATION, ease: "power2.out" }, 0.04);
    }

    if (outTitle && inTitle) {
      tl.to(outTitle, { autoAlpha: 0, duration: HEADER_DURATION * 0.7, ease: "power2.in" }, 0);
      gsap.set(inTitle, { autoAlpha: 0 });
      tl.to(inTitle, { autoAlpha: 1, duration: HEADER_DURATION, ease: "power2.out" }, HEADER_DURATION * 0.25);
    }

    prevModeRef.current = headerMode;
  }, [headerMode, showBack]);

  useEffect(() => {
    const returnWrap = returnWrapRef.current;
    const returnBtn = returnRef.current;
    if (!returnWrap || !returnBtn) return;

    if (!returnInitializedRef.current) {
      returnInitializedRef.current = true;
      gsap.set(returnWrap, {
        width: canReturnToChat ? RETURN_WRAP_WIDTH : 0,
        marginRight: canReturnToChat ? RETURN_WRAP_GAP : 0,
      });
      gsap.set(returnBtn, { autoAlpha: canReturnToChat ? 1 : 0, x: canReturnToChat ? 0 : -10 });
      return;
    }

    const tl = gsap.timeline();
    if (canReturnToChat) {
      gsap.set(returnBtn, { autoAlpha: 0, x: -10 });
      tl.to(
        returnWrap,
        { width: RETURN_WRAP_WIDTH, marginRight: RETURN_WRAP_GAP, duration: HEADER_DURATION, ease: "power2.out" },
        0
      );
      tl.to(
        returnBtn,
        { autoAlpha: 1, x: 0, duration: HEADER_DURATION, ease: "power2.out" },
        0.04
      );
    } else {
      tl.to(
        returnBtn,
        { autoAlpha: 0, x: -10, duration: HEADER_DURATION * 0.75, ease: "power2.in" },
        0
      );
      tl.to(
        returnWrap,
        { width: 0, marginRight: 0, duration: HEADER_DURATION, ease: "power2.inOut" },
        0
      );
    }
  }, [canReturnToChat]);

  if (!visible) return null;

  return (
    <div className="panel-header panel-action-header">
      <div className="panel-header-left">
        <div className="panel-header-return-wrap" ref={returnWrapRef}>
          <button
            ref={returnRef}
            className="panel-header-return"
            type="button"
            aria-label="Back to chat"
            aria-hidden={!canReturnToChat}
            tabIndex={canReturnToChat ? 0 : -1}
            onClick={onReturnToChat}
          >
            {returnBtnSvg}
          </button>
        </div>
        <div className="panel-header-back-wrap" ref={backWrapRef}>
          <button
            ref={backRef}
            className="panel-header-back"
            type="button"
            aria-label="Back"
            aria-hidden={!showBack}
            tabIndex={showBack ? 0 : -1}
            onClick={
              headerMode === "contact"
                ? onCloseContactCard
                : headerMode === "candidate"
                ? onCloseCandidateApp
                : onCloseJobList
            }
          >
            {backBtnSvg}
          </button>
        </div>
        <div className="panel-title-track">
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
          <span
            ref={contactTitleRef}
            className="panel-title panel-title-item"
            aria-hidden={headerMode !== "contact"}
          >
            {TITLES.contact}
          </span>
        </div>
      </div>
      <div className="panel-header-actions">
        <div
          className="panel-icon-btn"
          onClick={onReturnToChat}
          role="button"
          tabIndex={0}
          aria-label="Close action panel"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onReturnToChat();
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
