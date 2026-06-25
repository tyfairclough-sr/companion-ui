"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AnimationSettings,
  AVATAR_EXIT_X,
  CANDIDATE_SLIDE,
  JOB_LIST_SLIDE,
  PANEL_HIDE_X,
  easeFor,
} from "@/lib/animation";

gsap.registerPlugin(useGSAP);

interface PanelAnimationRefs {
  avatarRef: React.RefObject<HTMLDivElement | null>;
  notifRef: React.RefObject<SVGSVGElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  jobListLayerRef: React.RefObject<HTMLDivElement | null>;
  candidateAppLayerRef: React.RefObject<HTMLDivElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  menuBtnRef: React.RefObject<HTMLDivElement | null>;
}

export function usePanelAnimations(
  refs: PanelAnimationRefs,
  settings: AnimationSettings,
  onPanelClose?: () => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [jobListOpen, setJobListOpen] = useState(false);
  const [candidateAppOpen, setCandidateAppOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerMode, setHeaderMode] = useState<"default" | "jobList" | "candidate">("default");

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  useGSAP(
    () => {
      const { avatarRef, notifRef, panelRef, jobListLayerRef, candidateAppLayerRef } = refs;
      if (
        !avatarRef.current ||
        !notifRef.current ||
        !panelRef.current ||
        !jobListLayerRef.current ||
        !candidateAppLayerRef.current
      ) {
        return;
      }

      gsap.set(panelRef.current, { x: PANEL_HIDE_X, autoAlpha: 0 });
      gsap.set(avatarRef.current, { x: 0, autoAlpha: 1 });
      gsap.set(notifRef.current, { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" });
      gsap.set(jobListLayerRef.current, { x: JOB_LIST_SLIDE });
      gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
    },
    { dependencies: [] }
  );

  const closeMenu = useCallback(() => {
    const { menuRef, menuBtnRef } = refs;
    if (!menuOpen || !menuRef.current) return;
    setMenuOpen(false);
    menuBtnRef.current?.classList.remove("active");
    gsap.to(menuRef.current, {
      autoAlpha: 0,
      y: -6,
      scale: 0.96,
      duration: 0.12,
      ease: "power2.in",
    });
  }, [menuOpen, refs]);

  const openMenu = useCallback(() => {
    const { menuRef, menuBtnRef } = refs;
    if (!menuRef.current) return;
    setMenuOpen(true);
    menuBtnRef.current?.classList.add("active");
    gsap.fromTo(
      menuRef.current,
      { autoAlpha: 0, y: -6, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out" }
    );
  }, [refs]);

  const toggleMenu = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (menuOpen) closeMenu();
      else openMenu();
    },
    [closeMenu, menuOpen, openMenu]
  );

  const resetLayers = useCallback(() => {
    const { jobListLayerRef, candidateAppLayerRef } = refs;
    setJobListOpen(false);
    setCandidateAppOpen(false);
    setHeaderMode("default");
    if (jobListLayerRef.current) {
      gsap.set(jobListLayerRef.current, { x: JOB_LIST_SLIDE });
    }
    if (candidateAppLayerRef.current) {
      gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
    }
  }, [refs]);

  const toggle = useCallback(() => {
    const { avatarRef, notifRef, panelRef } = refs;
    if (animating || !avatarRef.current || !panelRef.current || !notifRef.current) return;

    setAnimating(true);

    const avDur = settings.avD / 1000;
    const avDelay = settings.avDel / 1000;
    const ntDur = settings.ntD / 1000;
    const ntDelay = settings.ntDel / 1000;
    const pnDur = settings.pnD / 1000;
    const pnDelay = settings.pnDel / 1000;

    const tl = gsap.timeline({
      onComplete: () => setAnimating(false),
    });

    if (!isOpenRef.current) {
      gsap.set(avatarRef.current, { zIndex: 500 });
      tl.to(
        avatarRef.current,
        {
          x: AVATAR_EXIT_X,
          duration: avDur,
          delay: avDelay,
          ease: easeFor(settings.avV, "hide"),
        },
        0
      );

      if (notifVisible) {
        tl.to(
          notifRef.current,
          {
            scale: 0,
            autoAlpha: 0,
            duration: ntDur,
            delay: ntDelay,
            ease: easeFor(settings.ntV, "hide"),
          },
          0
        );
        setNotifVisible(false);
      }

      gsap.set(panelRef.current, { autoAlpha: 1 });
      tl.to(
        panelRef.current,
        {
          x: 0,
          duration: pnDur,
          delay: pnDelay,
          ease: easeFor(settings.pnV, "show"),
        },
        0
      );

      setIsOpen(true);
    } else {
      gsap.set(avatarRef.current, { zIndex: 502 });
      tl.to(
        panelRef.current,
        {
          x: PANEL_HIDE_X,
          duration: pnDur,
          delay: pnDelay,
          ease: easeFor(settings.pnV, "hide"),
          onComplete: () => {
            if (panelRef.current) gsap.set(panelRef.current, { autoAlpha: 0 });
          },
        },
        0
      );

      tl.to(
        avatarRef.current,
        {
          x: 0,
          autoAlpha: 1,
          duration: avDur,
          delay: avDelay,
          ease: easeFor(settings.avV, "show"),
        },
        0
      );

      setIsOpen(false);
      closeMenu();
      resetLayers();
      onPanelClose?.();
    }
  }, [animating, closeMenu, notifVisible, onPanelClose, refs, resetLayers, settings]);

  const triggerNotif = useCallback(() => {
    const { notifRef } = refs;
    if (!notifRef.current) return;

    const ntDur = settings.ntD / 1000;
    const ntDelay = settings.ntDel / 1000;

    if (!notifVisible) {
      gsap.to(notifRef.current, {
        scale: 1,
        autoAlpha: 1,
        duration: ntDur,
        delay: ntDelay,
        ease: easeFor(settings.ntV, "show"),
      });
      setNotifVisible(true);
    } else {
      gsap.to(notifRef.current, {
        scale: 0,
        autoAlpha: 0,
        duration: ntDur,
        delay: ntDelay,
        ease: easeFor(settings.ntV, "hide"),
      });
      setNotifVisible(false);
    }
  }, [notifVisible, refs, settings]);

  const openJobList = useCallback(() => {
    const { jobListLayerRef, candidateAppLayerRef } = refs;
    if (jobListOpen || !jobListLayerRef.current) return;

    if (candidateAppOpen && candidateAppLayerRef.current) {
      gsap.killTweensOf(candidateAppLayerRef.current);
      gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
      setCandidateAppOpen(false);
    }

    setJobListOpen(true);
    setHeaderMode("jobList");

    gsap.killTweensOf(jobListLayerRef.current);
    gsap.set(jobListLayerRef.current, { x: JOB_LIST_SLIDE });
    gsap.to(jobListLayerRef.current, { x: 0, duration: 0.35, ease: "power2.out" });
  }, [candidateAppOpen, jobListOpen, refs]);

  const closeJobList = useCallback(() => {
    const { jobListLayerRef, candidateAppLayerRef } = refs;
    if (!jobListOpen || !jobListLayerRef.current) return;

    if (candidateAppOpen && candidateAppLayerRef.current) {
      gsap.killTweensOf(candidateAppLayerRef.current);
      gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
      setCandidateAppOpen(false);
    }

    setJobListOpen(false);

    gsap.killTweensOf(jobListLayerRef.current);
    gsap.to(jobListLayerRef.current, {
      x: JOB_LIST_SLIDE,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setHeaderMode("default"),
    });
  }, [candidateAppOpen, jobListOpen, refs]);

  const openCandidateApp = useCallback(() => {
    const { jobListLayerRef, candidateAppLayerRef } = refs;
    if (!jobListOpen || candidateAppOpen || !candidateAppLayerRef.current) return;

    setCandidateAppOpen(true);
    setHeaderMode("candidate");

    gsap.killTweensOf(candidateAppLayerRef.current);
    gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
    gsap.to(candidateAppLayerRef.current, { x: 0, duration: 0.35, ease: "power2.out" });
  }, [candidateAppOpen, jobListOpen, refs]);

  const closeCandidateApp = useCallback(
    (instant = false) => {
      const { candidateAppLayerRef } = refs;
      if (!candidateAppOpen || !candidateAppLayerRef.current) return;

      setCandidateAppOpen(false);

      gsap.killTweensOf(candidateAppLayerRef.current);
      if (instant) {
        gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
        if (jobListOpen) setHeaderMode("jobList");
        return;
      }

      gsap.to(candidateAppLayerRef.current, {
        x: CANDIDATE_SLIDE,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          if (jobListOpen) setHeaderMode("jobList");
        },
      });
    },
    [candidateAppOpen, jobListOpen, refs]
  );

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (menuOpen && !target.closest(".menu-anchor")) closeMenu();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu, menuOpen]);

  return {
    isOpen,
    animating,
    notifVisible,
    jobListOpen,
    candidateAppOpen,
    menuOpen,
    headerMode,
    toggle,
    triggerNotif,
    openJobList,
    closeJobList,
    openCandidateApp,
    closeCandidateApp,
    toggleMenu,
    closeMenu,
  };
}
