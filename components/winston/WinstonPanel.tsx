"use client";

import { forwardRef } from "react";
import { JobPostingResponse, CandidateDetailResponse, JobPostingCandidate } from "@/lib/types";
import { useSkeletonReveal } from "@/hooks/useSkeletonReveal";
import { CompanionCard } from "./CompanionCard";
import { QuickReplies } from "./QuickReplies";
import { JobListLayer } from "./JobListLayer";
import { CandidateAppLayer } from "./CandidateAppLayer";
import { PanelHeader } from "./PanelHeader";
import { CompanionCardSkeleton, SuggestionChipSkeleton, QuickRepliesSkeleton } from "./skeletons/LayerSkeletons";

interface WinstonPanelProps {
  job: JobPostingResponse | null;
  allCandidates: JobPostingCandidate[];
  selectedCandidate: CandidateDetailResponse | null;
  jobListOpen: boolean;
  candidateAppOpen: boolean;
  headerMode: "default" | "jobList" | "candidate";
  onToggle: () => void;
  onToggleMenu: (e?: React.MouseEvent) => void;
  onMenuAction: (action: "reset" | "history") => void;
  onOpenJobList: () => void;
  onCloseJobList: () => void;
  onCloseCandidateApp: () => void;
  onToggleSelect: (id: string, selected: boolean) => void;
  onOpenCandidate: (id: string) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  menuBtnRef: React.RefObject<HTMLDivElement | null>;
  jobListLayerRef: React.RefObject<HTMLDivElement | null>;
  candidateAppLayerRef: React.RefObject<HTMLDivElement | null>;
}

export const WinstonPanel = forwardRef<HTMLDivElement, WinstonPanelProps>(
  function WinstonPanel(
    {
      job,
      allCandidates,
      selectedCandidate,
      jobListOpen,
      candidateAppOpen,
      headerMode,
      onToggle,
      onToggleMenu,
      onMenuAction,
      onOpenJobList,
      onCloseJobList,
      onCloseCandidateApp,
      onToggleSelect,
      onOpenCandidate,
      menuRef,
      menuBtnRef,
      jobListLayerRef,
      candidateAppLayerRef,
    },
    ref
  ) {
    const chatStreamLoading = useSkeletonReveal({ ready: !!job });

    return (
      <div className="panel" ref={ref}>
        <PanelHeader
          headerMode={headerMode}
          onToggle={onToggle}
          onToggleMenu={onToggleMenu}
          onMenuAction={onMenuAction}
          onCloseJobList={onCloseJobList}
          onCloseCandidateApp={onCloseCandidateApp}
          menuRef={menuRef}
          menuBtnRef={menuBtnRef}
        />

        <div className="panel-body-wrap">
          <div className="panel-body">
            {chatStreamLoading ? (
              <SuggestionChipSkeleton />
            ) : (
              <div className="suggestion-chip">user utterances</div>
            )}
            {chatStreamLoading ? (
              <CompanionCardSkeleton />
            ) : job ? (
              <CompanionCard
                job={job}
                onToggleSelect={onToggleSelect}
                onOpenMore={onOpenJobList}
                onOpenCandidate={onOpenCandidate}
              />
            ) : null}
            {chatStreamLoading ? <QuickRepliesSkeleton /> : <QuickReplies />}
          </div>

          <JobListLayer
            ref={jobListLayerRef}
            candidates={allCandidates}
            isOpen={jobListOpen}
            onToggleSelect={onToggleSelect}
            onOpenCandidate={onOpenCandidate}
          />

          <CandidateAppLayer
            ref={candidateAppLayerRef}
            candidate={selectedCandidate}
            isOpen={candidateAppOpen}
          />
        </div>

        <div className="panel-footer">
          <div className="panel-input-row">
            <input className="panel-input" type="text" placeholder="Message Winston..." />
            <button className="panel-send-btn" type="button" aria-label="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="#383C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#383C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="panel-footer-caption">Winston uses AI, verify results.</div>
        </div>
      </div>
    );
  }
);
