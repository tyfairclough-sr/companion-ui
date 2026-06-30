"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AnimationSettings,
  AVATAR_EXIT_X,
  CANDIDATE_SLIDE,
  CONTACT_CARD_SLIDE,
  JOB_LIST_SLIDE,
  PANEL_EXTENDED_WIDTH,
  PANEL_HIDE_X,
  PANEL_WIDTH,
  easeFor,
} from "@/lib/animation";

gsap.registerPlugin(useGSAP);

// Content layers (job list / candidate / contact) keep their original slide
// timing; only the action-panel container is driven by the tester settings.
const LAYER_OPEN_DURATION = 0.35;
const LAYER_CLOSE_DURATION = 0.3;

interface PanelAnimationRefs {
  avatarRef: React.RefObject<HTMLDivElement | null>;
  notifRef: React.RefObject<SVGSVGElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  actionColRef: React.RefObject<HTMLDivElement | null>;
  jobListLayerRef: React.RefObject<HTMLDivElement | null>;
  candidateAppLayerRef: React.RefObject<HTMLDivElement | null>;
  contactCardLayerRef: React.RefObject<HTMLDivElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  menuBtnRef: React.RefObject<HTMLDivElement | null>;
}

export function usePanelAnimations(
  refs: PanelAnimationRefs,
  settings: AnimationSettings,
  isDesktop: boolean,
  onPanelClose?: () => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const [jobListOpen, setJobListOpen] = useState(false);
  const [candidateAppOpen, setCandidateAppOpen] = useState(false);
  const [contactCardOpen, setContactCardOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerMode, setHeaderMode] = useState<"default" | "jobList" | "candidate" | "contact">("default");

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const isDesktopRef = useRef(isDesktop);
  isDesktopRef.current = isDesktop;

  // Mirror the latest settings into a ref so the memoized animation callbacks
  // can read current action-panel timing/easing without changing identity.
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  // Action-panel open/close timing and easing, driven by the tester settings.
  const actionPanelTween = useCallback((dir: "show" | "hide") => {
    const s = settingsRef.current;
    return {
      duration: s.apD / 1000,
      delay: dir === "show" ? s.apDel / 1000 : 0,
      ease: easeFor(s.apV, dir),
    };
  }, []);

  const actionPanelOpen = jobListOpen || candidateAppOpen || contactCardOpen;

  const getPanelHideX = useCallback(() => {
    const { panelRef } = refs;
    if (panelRef.current) {
      return Math.max(PANEL_HIDE_X, panelRef.current.offsetWidth + 20);
    }
    return PANEL_HIDE_X;
  }, [refs]);

  const expandActionPanel = useCallback(() => {
    const { panelRef, actionColRef } = refs;
    if (!isDesktopRef.current || !panelRef.current) return;
    const { duration, delay, ease } = actionPanelTween("show");
    gsap.killTweensOf(panelRef.current, "width");
    gsap.to(panelRef.current, {
      width: PANEL_EXTENDED_WIDTH,
      duration,
      delay,
      ease,
    });
    if (actionColRef.current) {
      gsap.killTweensOf(actionColRef.current);
      gsap.to(actionColRef.current, { autoAlpha: 1, duration, delay, ease });
    }
  }, [actionPanelTween, refs]);

  const collapseActionPanel = useCallback(
    (instant = false) => {
      const { panelRef, actionColRef } = refs;
      if (!isDesktopRef.current || !panelRef.current) return;
      gsap.killTweensOf(panelRef.current, "width");
      if (actionColRef.current) gsap.killTweensOf(actionColRef.current);
      if (instant) {
        gsap.set(panelRef.current, { width: PANEL_WIDTH });
        if (actionColRef.current) gsap.set(actionColRef.current, { autoAlpha: 0 });
        return;
      }
      const { duration, ease } = actionPanelTween("hide");
      gsap.to(panelRef.current, {
        width: PANEL_WIDTH,
        duration,
        ease,
      });
      if (actionColRef.current) {
        gsap.to(actionColRef.current, { autoAlpha: 0, duration, ease });
      }
    },
    [actionPanelTween, refs]
  );

  useGSAP(
    () => {
      const { avatarRef, notifRef, panelRef, jobListLayerRef, candidateAppLayerRef, contactCardLayerRef } = refs;
      if (
        !avatarRef.current ||
        !notifRef.current ||
        !panelRef.current ||
        !jobListLayerRef.current ||
        !candidateAppLayerRef.current ||
        !contactCardLayerRef.current
      ) {
        return;
      }

      gsap.set(panelRef.current, { x: PANEL_HIDE_X, autoAlpha: 0 });
      // On desktop the width is animated by the action-panel expand/collapse, so
      // pin it explicitly. On mobile the width is owned by CSS (full-width), so
      // leave it unset to avoid an inline style overriding the stylesheet.
      if (isDesktopRef.current) {
        gsap.set(panelRef.current, { width: PANEL_WIDTH });
      }
      gsap.set(avatarRef.current, { x: 0, autoAlpha: 1 });
      gsap.set(notifRef.current, { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" });
      if (isDesktopRef.current && refs.actionColRef.current) {
        gsap.set(refs.actionColRef.current, { autoAlpha: 0 });
      }
      gsap.set(jobListLayerRef.current, { x: JOB_LIST_SLIDE });
      gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
      gsap.set(contactCardLayerRef.current, { x: CONTACT_CARD_SLIDE });
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
    const { jobListLayerRef, candidateAppLayerRef, contactCardLayerRef } = refs;
    setJobListOpen(false);
    setCandidateAppOpen(false);
    setContactCardOpen(false);
    setHeaderMode("default");
    if (jobListLayerRef.current) {
      gsap.set(jobListLayerRef.current, { x: JOB_LIST_SLIDE });
    }
    if (candidateAppLayerRef.current) {
      gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
    }
    if (contactCardLayerRef.current) {
      gsap.set(contactCardLayerRef.current, { x: CONTACT_CARD_SLIDE });
    }
    collapseActionPanel(true);
  }, [collapseActionPanel, refs]);

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
    const hideX = getPanelHideX();

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

      gsap.set(panelRef.current, { autoAlpha: 1, width: PANEL_WIDTH });
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
          x: hideX,
          duration: pnDur,
          delay: pnDelay,
          ease: easeFor(settings.pnV, "hide"),
          onComplete: () => {
            if (panelRef.current) {
              gsap.set(panelRef.current, { autoAlpha: 0, width: PANEL_WIDTH });
            }
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
  }, [animating, closeMenu, getPanelHideX, notifVisible, onPanelClose, refs, resetLayers, settings]);

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

    const wasActionPanelOpen = candidateAppOpen || contactCardOpen;

    if (candidateAppOpen && candidateAppLayerRef.current) {
      gsap.killTweensOf(candidateAppLayerRef.current);
      gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
      setCandidateAppOpen(false);
    }

    setJobListOpen(true);
    setHeaderMode("jobList");

    if (isDesktopRef.current && !wasActionPanelOpen) {
      expandActionPanel();
    }

    gsap.killTweensOf(jobListLayerRef.current);
    gsap.set(jobListLayerRef.current, { x: JOB_LIST_SLIDE });
    gsap.to(jobListLayerRef.current, { x: 0, duration: LAYER_OPEN_DURATION, ease: "power2.out" });
  }, [candidateAppOpen, contactCardOpen, expandActionPanel, jobListOpen, refs]);

  const closeJobList = useCallback(() => {
    const { jobListLayerRef, candidateAppLayerRef } = refs;
    if (!jobListOpen || !jobListLayerRef.current) return;

    if (candidateAppOpen && candidateAppLayerRef.current) {
      gsap.killTweensOf(candidateAppLayerRef.current);
      gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
      setCandidateAppOpen(false);
    }

    setJobListOpen(false);
    setHeaderMode("default");

    if (isDesktopRef.current && !contactCardOpen) {
      collapseActionPanel();
    }

    gsap.killTweensOf(jobListLayerRef.current);
    gsap.to(jobListLayerRef.current, {
      x: JOB_LIST_SLIDE,
      duration: LAYER_CLOSE_DURATION,
      ease: "power2.in",
    });
  }, [candidateAppOpen, collapseActionPanel, contactCardOpen, jobListOpen, refs]);

  const openCandidateApp = useCallback(() => {
    const { candidateAppLayerRef } = refs;
    if (candidateAppOpen || !candidateAppLayerRef.current) return;

    const wasActionPanelOpen = jobListOpen || contactCardOpen;

    setCandidateAppOpen(true);
    setHeaderMode("candidate");

    if (isDesktopRef.current && !wasActionPanelOpen) {
      expandActionPanel();
    }

    gsap.killTweensOf(candidateAppLayerRef.current);
    gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
    gsap.to(candidateAppLayerRef.current, { x: 0, duration: LAYER_OPEN_DURATION, ease: "power2.out" });
  }, [candidateAppOpen, contactCardOpen, expandActionPanel, jobListOpen, refs]);

  const closeCandidateApp = useCallback(
    (instant = false) => {
      const { candidateAppLayerRef } = refs;
      if (!candidateAppOpen || !candidateAppLayerRef.current) return;

      setCandidateAppOpen(false);
      setHeaderMode(jobListOpen ? "jobList" : "default");

      if (isDesktopRef.current && !jobListOpen && !contactCardOpen) {
        collapseActionPanel(instant);
      }

      gsap.killTweensOf(candidateAppLayerRef.current);
      if (instant) {
        gsap.set(candidateAppLayerRef.current, { x: CANDIDATE_SLIDE });
        return;
      }

      gsap.to(candidateAppLayerRef.current, {
        x: CANDIDATE_SLIDE,
        duration: LAYER_CLOSE_DURATION,
        ease: "power2.in",
      });
    },
    [candidateAppOpen, collapseActionPanel, contactCardOpen, jobListOpen, refs]
  );

  const openContactCard = useCallback(() => {
    const { contactCardLayerRef } = refs;
    if (contactCardOpen || !contactCardLayerRef.current) return;

    const wasActionPanelOpen = jobListOpen || candidateAppOpen;

    setContactCardOpen(true);
    setHeaderMode("contact");

    if (isDesktopRef.current && !wasActionPanelOpen) {
      expandActionPanel();
    }

    gsap.killTweensOf(contactCardLayerRef.current);
    gsap.set(contactCardLayerRef.current, { x: CONTACT_CARD_SLIDE });
    gsap.to(contactCardLayerRef.current, { x: 0, duration: LAYER_OPEN_DURATION, ease: "power2.out" });
  }, [candidateAppOpen, contactCardOpen, expandActionPanel, jobListOpen, refs]);

  const closeContactCard = useCallback(
    (instant = false) => {
      const { contactCardLayerRef } = refs;
      if (!contactCardOpen || !contactCardLayerRef.current) return;

      setContactCardOpen(false);
      setHeaderMode(candidateAppOpen ? "candidate" : jobListOpen ? "jobList" : "default");

      if (isDesktopRef.current && !jobListOpen && !candidateAppOpen) {
        collapseActionPanel(instant);
      }

      gsap.killTweensOf(contactCardLayerRef.current);
      if (instant) {
        gsap.set(contactCardLayerRef.current, { x: CONTACT_CARD_SLIDE });
        return;
      }

      gsap.to(contactCardLayerRef.current, {
        x: CONTACT_CARD_SLIDE,
        duration: LAYER_CLOSE_DURATION,
        ease: "power2.in",
      });
    },
    [candidateAppOpen, collapseActionPanel, contactCardOpen, jobListOpen, refs]
  );

  const returnToChat = useCallback(() => {
    const { jobListLayerRef, candidateAppLayerRef, contactCardLayerRef } = refs;

    if (contactCardOpen && contactCardLayerRef.current) {
      gsap.killTweensOf(contactCardLayerRef.current);
      gsap.to(contactCardLayerRef.current, {
        x: CONTACT_CARD_SLIDE,
        duration: LAYER_CLOSE_DURATION,
        ease: "power2.in",
      });
      setContactCardOpen(false);
    }

    if (candidateAppOpen && candidateAppLayerRef.current) {
      gsap.killTweensOf(candidateAppLayerRef.current);
      gsap.to(candidateAppLayerRef.current, {
        x: CANDIDATE_SLIDE,
        duration: LAYER_CLOSE_DURATION,
        ease: "power2.in",
      });
      setCandidateAppOpen(false);
    }

    if (jobListOpen && jobListLayerRef.current) {
      gsap.killTweensOf(jobListLayerRef.current);
      gsap.to(jobListLayerRef.current, {
        x: JOB_LIST_SLIDE,
        duration: LAYER_CLOSE_DURATION,
        ease: "power2.in",
      });
      setJobListOpen(false);
    }

    setHeaderMode("default");
    collapseActionPanel();
  }, [candidateAppOpen, collapseActionPanel, contactCardOpen, jobListOpen, refs]);

  // Snap the panel width and container visibility to the correct resting state
  // only when the breakpoint changes (e.g. resize). Layer open/close is owned by
  // the expand/collapse animations, so we must not instantly set state then —
  // doing so would clobber the in-flight container transition.
  const prevIsDesktopRef = useRef<boolean | null>(null);
  useEffect(() => {
    const { panelRef, actionColRef } = refs;
    if (!panelRef.current) return;

    const breakpointChanged = prevIsDesktopRef.current !== isDesktop;
    prevIsDesktopRef.current = isDesktop;
    if (!breakpointChanged) return;

    const hasOpenLayer = jobListOpen || candidateAppOpen || contactCardOpen;

    if (isDesktop) {
      gsap.set(panelRef.current, {
        width: hasOpenLayer ? PANEL_EXTENDED_WIDTH : PANEL_WIDTH,
      });
      if (actionColRef.current) {
        gsap.set(actionColRef.current, { autoAlpha: hasOpenLayer ? 1 : 0 });
      }
    } else {
      // On mobile the width is owned by CSS (full-width), so clear any inline
      // width GSAP set while on desktop and let the stylesheet take over.
      gsap.set(panelRef.current, { clearProps: "width" });
      // The container visibility is also handled by CSS on mobile, so release the
      // inline opacity/visibility GSAP may have set while on desktop.
      if (actionColRef.current) {
        gsap.set(actionColRef.current, { clearProps: "opacity,visibility" });
      }
    }
  }, [isDesktop, jobListOpen, candidateAppOpen, contactCardOpen, refs]);

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
    contactCardOpen,
    actionPanelOpen,
    menuOpen,
    headerMode,
    toggle,
    triggerNotif,
    openJobList,
    closeJobList,
    openCandidateApp,
    closeCandidateApp,
    openContactCard,
    closeContactCard,
    returnToChat,
    toggleMenu,
    closeMenu,
  };
}
