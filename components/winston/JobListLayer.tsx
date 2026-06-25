import { forwardRef } from "react";
import { JobPostingCandidate } from "@/lib/types";
import { CandidateRow } from "./CandidateRow";

interface JobListLayerProps {
  candidates: JobPostingCandidate[];
  onToggleSelect: (id: string, selected: boolean) => void;
  onOpenCandidate: (id: string) => void;
}

export const JobListLayer = forwardRef<HTMLDivElement, JobListLayerProps>(
  function JobListLayer({ candidates, onToggleSelect, onOpenCandidate }, ref) {
    return (
      <div className="job-list-layer" ref={ref}>
        <div className="job-list-scroll">
          {candidates.map((candidate) => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              rowClassName="job-list-row"
              onToggleSelect={onToggleSelect}
              onOpen={onOpenCandidate}
            />
          ))}
        </div>
        <div className="job-list-floating-actions">
          <button className="job-list-action-btn" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
            Label
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button className="job-list-action-btn" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
            Label
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);
