"use client";

import { forwardRef, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { JobPostingCandidate } from "@/lib/types";
import {
  JOB_LIST_REVEAL_STAGGER,
  JOB_LIST_ROW_REVEAL_DURATION,
} from "@/lib/animation";
import { useSkeletonReveal } from "@/hooks/useSkeletonReveal";
import { CandidateRow } from "./CandidateRow";
import { JobListSkeleton } from "./skeletons/LayerSkeletons";

gsap.registerPlugin(useGSAP);

interface JobListLayerProps {
  candidates: JobPostingCandidate[];
  isOpen: boolean;
  onToggleSelect: (id: string, selected: boolean) => void;
  onOpenCandidate: (id: string) => void;
  onScheduleSelected: () => void;
}

export const JobListLayer = forwardRef<HTMLDivElement, JobListLayerProps>(
  function JobListLayer({ candidates, isOpen, onToggleSelect, onOpenCandidate, onScheduleSelected }, ref) {
    const isLoading = useSkeletonReveal({
      enabled: isOpen,
      ready: candidates.length > 0,
    });

    const hasSelection = candidates.some((candidate) => candidate.selected);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    // When the skeleton clears, cascade the real rows in one after another so
    // they appear to replace the skeleton placeholders from top to bottom.
    // The whole list reveals within JOB_LIST_REVEAL_STAGGER seconds (~250ms).
    useGSAP(
      () => {
        if (isLoading) return;
        const rows = scrollRef.current?.querySelectorAll<HTMLElement>(".job-list-row");
        if (!rows || rows.length === 0) return;

        gsap.killTweensOf(rows);
        gsap.fromTo(
          rows,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: JOB_LIST_ROW_REVEAL_DURATION,
            ease: "power2.out",
            stagger: { amount: JOB_LIST_REVEAL_STAGGER, from: "start" },
            clearProps: "transform,opacity,visibility",
          }
        );
      },
      { scope: scrollRef, dependencies: [isLoading] }
    );

    return (
      <div className="job-list-layer" ref={ref}>
        <div className="job-list-scroll" ref={scrollRef}>
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
          <button className="job-list-action-btn" type="button" disabled={!hasSelection} onClick={onScheduleSelected}>
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
