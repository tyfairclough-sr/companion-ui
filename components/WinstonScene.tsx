"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { AnimationTester } from "@/components/animation-tester/AnimationTester";
import { AvatarTrigger } from "@/components/avatar/AvatarTrigger";
import { BackOfficeSlideout } from "@/components/shell/BackOfficeSlideout";
import { WinstonPanel } from "@/components/winston/WinstonPanel";
import { useAnimationSettings, computeCodeSnippets } from "@/hooks/useAnimationSettings";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { usePanelAnimations } from "@/hooks/usePanelAnimations";
import { ACTION_PANEL_WIDTH } from "@/lib/animation";

const BACK_OFFICE_HIDE_X = ACTION_PANEL_WIDTH + 20;
import {
  fetchCandidate,
  fetchCandidates,
  fetchJobPosting,
} from "@/lib/api";
import {
  CandidateDetailResponse,
  CandidatesListResponse,
  JobPostingCandidate,
  JobPostingResponse,
} from "@/lib/types";

function updateCandidateSelection(
  list: JobPostingCandidate[],
  id: string,
  selected: boolean
): JobPostingCandidate[] {
  return list.map((c) => (c.id === id ? { ...c, selected } : c));
}

// Selection is intentionally session-only: clear any persisted selection so the
// lists always start unselected on a fresh page load / refresh.
function clearSelection(list: JobPostingCandidate[]): JobPostingCandidate[] {
  return list.map((c) => ({ ...c, selected: false }));
}

// Randomly allocate a match score (1–4) to each candidate, keeping the score
// stable per-id so the same person shows the same score everywhere.
function makeScoreAllocator() {
  const scoreById = new Map<string, number>();
  return (id: string) => {
    let score = scoreById.get(id);
    if (score === undefined) {
      score = Math.floor(Math.random() * 4) + 1;
      scoreById.set(id, score);
    }
    return score;
  };
}

function withRandomScores(
  list: JobPostingCandidate[],
  scoreFor: (id: string) => number
): JobPostingCandidate[] {
  return list.map((c) => ({ ...c, matchScore: scoreFor(c.id) }));
}

export function WinstonScene() {
  const avatarRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<SVGSVGElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const actionColRef = useRef<HTMLDivElement>(null);
  const jobListLayerRef = useRef<HTMLDivElement>(null);
  const candidateAppLayerRef = useRef<HTMLDivElement>(null);
  const contactCardLayerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLDivElement>(null);

  const [job, setJob] = useState<JobPostingResponse | null>(null);
  const [allCandidates, setAllCandidates] = useState<JobPostingCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateDetailResponse | null>(null);
  const [backOfficeOpen, setBackOfficeOpen] = useState(false);
  const backOfficeRef = useRef<HTMLDivElement>(null);

  const animationRefs = useMemo(
    () => ({
      avatarRef,
      notifRef,
      panelRef,
      actionColRef,
      jobListLayerRef,
      candidateAppLayerRef,
      contactCardLayerRef,
      menuRef,
      menuBtnRef,
    }),
    []
  );

  const { settings, updateSettings, saveAsDefault, formatDuration } =
    useAnimationSettings(false, false);

  const isDesktop = useIsDesktop();

  const animations = usePanelAnimations(animationRefs, settings, isDesktop, () => {
    setSelectedCandidate(null);
  });

  const codeSnippets = useMemo(
    () =>
      computeCodeSnippets(
        settings,
        animations.isOpen,
        animations.notifVisible,
        animations.actionPanelOpen
      ),
    [settings, animations.isOpen, animations.notifVisible, animations.actionPanelOpen]
  );

  useEffect(() => {
    Promise.all([fetchJobPosting(), fetchCandidates()])
      .then(([jobData, listData]: [JobPostingResponse, CandidatesListResponse]) => {
        const scoreFor = makeScoreAllocator();
        setJob({
          ...jobData,
          candidates: clearSelection(withRandomScores(jobData.candidates, scoreFor)),
        });
        setAllCandidates(clearSelection(withRandomScores(listData.candidates, scoreFor)));
      })
      .catch(console.error);
  }, []);

  const handleToggleSelect = useCallback((id: string, selected: boolean) => {
    setJob((prev) =>
      prev
        ? {
            ...prev,
            candidates: updateCandidateSelection(prev.candidates, id, selected),
          }
        : prev
    );
    setAllCandidates((prev) => updateCandidateSelection(prev, id, selected));
  }, []);

  const handleOpenCandidate = useCallback(
    async (id: string) => {
      try {
        const detail: CandidateDetailResponse = await fetchCandidate(id);
        setSelectedCandidate(detail);
        animations.openCandidateApp();
      } catch (error) {
        console.error(error);
      }
    },
    [animations]
  );

  const handleMenuAction = useCallback(
    (action: "reset" | "history") => {
      if (action === "reset") console.log("Context menu: Reset conversation");
      if (action === "history") console.log("Context menu: Load chat history");
      animations.closeMenu();
    },
    [animations]
  );

  // Independent of avatar/chat panel animations — never touches usePanelAnimations.
  const backOfficeInitialized = useRef(false);

  useEffect(() => {
    if (!backOfficeRef.current) return;

    if (!backOfficeInitialized.current) {
      backOfficeInitialized.current = true;
      gsap.set(backOfficeRef.current, {
        x: backOfficeOpen ? 0 : BACK_OFFICE_HIDE_X,
        autoAlpha: backOfficeOpen ? 1 : 0,
      });
      return;
    }

    if (backOfficeOpen) {
      gsap.to(backOfficeRef.current, {
        x: 0,
        autoAlpha: 1,
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
      });
    } else {
      gsap.to(backOfficeRef.current, {
        x: BACK_OFFICE_HIDE_X,
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.in",
        overwrite: true,
      });
    }
  }, [backOfficeOpen]);

  return (
    <>
      <BackOfficeSlideout ref={backOfficeRef} />

      <AnimationTester
        isOpen={animations.isOpen}
        notifVisible={animations.notifVisible}
        backOfficeOpen={backOfficeOpen}
        settings={settings}
        codeSnippets={codeSnippets}
        onTogglePanel={animations.toggle}
        onTriggerNotif={animations.triggerNotif}
        onToggleBackOffice={() => setBackOfficeOpen((v) => !v)}
        onSettingsChange={updateSettings}
        onSaveDefault={saveAsDefault}
        formatDuration={formatDuration}
      />

      <AvatarTrigger
        ref={avatarRef}
        notifRef={notifRef}
        isOpen={animations.isOpen}
        animating={animations.animating}
        onToggle={animations.toggle}
      />

      <WinstonPanel
        ref={panelRef}
        isOpen={animations.isOpen}
        job={job}
        allCandidates={allCandidates}
        selectedCandidate={selectedCandidate}
        jobListOpen={animations.jobListOpen}
        candidateAppOpen={animations.candidateAppOpen}
        contactCardOpen={animations.contactCardOpen}
        actionPanelOpen={animations.actionPanelOpen}
        headerMode={animations.headerMode}
        isDesktop={isDesktop}
        onToggle={animations.toggle}
        onToggleMenu={animations.toggleMenu}
        onMenuAction={handleMenuAction}
        onOpenJobList={animations.openJobList}
        onCloseJobList={animations.closeJobList}
        onCloseCandidateApp={() => animations.closeCandidateApp()}
        onOpenContactCard={animations.openContactCard}
        onCloseContactCard={() => animations.closeContactCard()}
        onReturnToChat={animations.returnToChat}
        onToggleSelect={handleToggleSelect}
        onOpenCandidate={handleOpenCandidate}
        menuRef={menuRef}
        menuBtnRef={menuBtnRef}
        actionColRef={actionColRef}
        jobListLayerRef={jobListLayerRef}
        candidateAppLayerRef={candidateAppLayerRef}
        contactCardLayerRef={contactCardLayerRef}
      />
    </>
  );
}
