"use client";

import { forwardRef } from "react";
import { JobPostingCandidate } from "@/lib/types";
import { useSkeletonReveal } from "@/hooks/useSkeletonReveal";
import { CandidateRow } from "./CandidateRow";
import { JobListSkeleton } from "./skeletons/LayerSkeletons";

interface JobListLayerProps {
  candidates: JobPostingCandidate[];
  isOpen: boolean;
  onToggleSelect: (id: string, selected: boolean) => void;
  onOpenCandidate: (id: string) => void;
}

export const JobListLayer = forwardRef<HTMLDivElement, JobListLayerProps>(
  function JobListLayer({ candidates, isOpen, onToggleSelect, onOpenCandidate }, ref) {
    const isLoading = useSkeletonReveal({
      enabled: isOpen,
      ready: candidates.length > 0,
    });

    const hasSelection = candidates.some((candidate) => candidate.selected);

    return (
      <div className="job-list-layer" ref={ref}>
        <div className="job-list-scroll">
          {isLoading ? (
            <JobListSkeleton rowCount={Math.max(candidates.length, 6)} />
          ) : (
            candidates.map((candidate) => (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                rowClassName="job-list-row"
                onToggleSelect={onToggleSelect}
                onOpen={onOpenCandidate}
              />
            ))
          )}
        </div>
        <div className="job-list-floating-actions">
          <button className="job-list-action-btn" type="button" disabled={!hasSelection}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M8 12l3 3 5-6" />
            </svg>
            Schedule selected
          </button>
        </div>
      </div>
    );
  }
);
