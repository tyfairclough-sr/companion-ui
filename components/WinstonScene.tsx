"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimationTester } from "@/components/animation-tester/AnimationTester";
import { AvatarTrigger } from "@/components/avatar/AvatarTrigger";
import { WinstonPanel } from "@/components/winston/WinstonPanel";
import { useAnimationSettings, computeCodeSnippets } from "@/hooks/useAnimationSettings";
import { usePanelAnimations } from "@/hooks/usePanelAnimations";
import {
  fetchCandidate,
  fetchCandidates,
  fetchJobPosting,
  toggleCandidateSelection,
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

export function WinstonScene() {
  const avatarRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<SVGSVGElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const jobListLayerRef = useRef<HTMLDivElement>(null);
  const candidateAppLayerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLDivElement>(null);

  const [job, setJob] = useState<JobPostingResponse | null>(null);
  const [allCandidates, setAllCandidates] = useState<JobPostingCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateDetailResponse | null>(null);

  const animationRefs = useMemo(
    () => ({
      avatarRef,
      notifRef,
      panelRef,
      jobListLayerRef,
      candidateAppLayerRef,
      menuRef,
      menuBtnRef,
    }),
    []
  );

  const { settings, updateSettings, formatDuration } = useAnimationSettings(false, false);

  const animations = usePanelAnimations(animationRefs, settings, () => {
    setSelectedCandidate(null);
  });

  const codeSnippets = useMemo(
    () => computeCodeSnippets(settings, animations.isOpen, animations.notifVisible),
    [settings, animations.isOpen, animations.notifVisible]
  );

  useEffect(() => {
    Promise.all([fetchJobPosting(), fetchCandidates()])
      .then(([jobData, listData]: [JobPostingResponse, CandidatesListResponse]) => {
        setJob(jobData);
        setAllCandidates(listData.candidates);
      })
      .catch(console.error);
  }, []);

  const handleToggleSelect = useCallback(async (id: string, selected: boolean) => {
    setJob((prev) =>
      prev
        ? {
            ...prev,
            candidates: updateCandidateSelection(prev.candidates, id, selected),
          }
        : prev
    );
    setAllCandidates((prev) => updateCandidateSelection(prev, id, selected));

    try {
      await toggleCandidateSelection(id, selected);
    } catch (error) {
      console.error(error);
      const [jobData, listData] = await Promise.all([fetchJobPosting(), fetchCandidates()]);
      setJob(jobData);
      setAllCandidates(listData.candidates);
    }
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

  return (
    <>
      <AnimationTester
        isOpen={animations.isOpen}
        notifVisible={animations.notifVisible}
        settings={settings}
        codeSnippets={codeSnippets}
        onTogglePanel={animations.toggle}
        onTriggerNotif={animations.triggerNotif}
        onSettingsChange={updateSettings}
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
        job={job}
        allCandidates={allCandidates}
        selectedCandidate={selectedCandidate}
        jobListOpen={animations.jobListOpen}
        candidateAppOpen={animations.candidateAppOpen}
        headerMode={animations.headerMode}
        onToggle={animations.toggle}
        onToggleMenu={animations.toggleMenu}
        onMenuAction={handleMenuAction}
        onOpenJobList={animations.openJobList}
        onCloseJobList={animations.closeJobList}
        onCloseCandidateApp={() => animations.closeCandidateApp()}
        onToggleSelect={handleToggleSelect}
        onOpenCandidate={handleOpenCandidate}
        menuRef={menuRef}
        menuBtnRef={menuBtnRef}
        jobListLayerRef={jobListLayerRef}
        candidateAppLayerRef={candidateAppLayerRef}
      />
    </>
  );
}
