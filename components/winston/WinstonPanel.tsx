"use client";

import { forwardRef } from "react";
import { JobPostingResponse, CandidateDetailResponse, JobPostingCandidate } from "@/lib/types";
import { CompanionCard } from "./CompanionCard";
import { JobListLayer } from "./JobListLayer";
import { CandidateAppLayer } from "./CandidateAppLayer";

const backBtnSvg = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

interface WinstonPanelProps {
  job: JobPostingResponse | null;
  allCandidates: JobPostingCandidate[];
  selectedCandidate: CandidateDetailResponse | null;
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
    const headerTitle =
      headerMode === "jobList"
        ? "Job List"
        : headerMode === "candidate"
          ? "Candidate application"
          : "Winston";

    return (
      <div className="panel" ref={ref}>
        <div className="panel-header">
          <div className="panel-header-left">
            {headerMode !== "default" ? (
              <button
                className="panel-header-back"
                type="button"
                aria-label="Back"
                onClick={headerMode === "candidate" ? onCloseCandidateApp : onCloseJobList}
              >
                {backBtnSvg}
              </button>
            ) : null}
            <span className="panel-title">{headerTitle}</span>
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

        <div className="panel-body-wrap">
          <div className="panel-body">
            {job ? (
              <CompanionCard
                job={job}
                onToggleSelect={onToggleSelect}
                onOpenMore={onOpenJobList}
              />
            ) : null}
            <div className="suggestion-chip">user utterances</div>
          </div>

          <JobListLayer
            ref={jobListLayerRef}
            candidates={allCandidates}
            onToggleSelect={onToggleSelect}
            onOpenCandidate={onOpenCandidate}
          />

          <CandidateAppLayer ref={candidateAppLayerRef} candidate={selectedCandidate} />
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
