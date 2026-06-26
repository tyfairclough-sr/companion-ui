import { JobPostingCandidate, JobPostingResponse } from "@/lib/types";
import { CandidateRow } from "./CandidateRow";

interface CompanionCardProps {
  job: JobPostingResponse;
  onToggleSelect: (id: string, selected: boolean) => void;
  onOpenMore: () => void;
  onOpenCandidate: (id: string) => void;
}

export function CompanionCard({ job, onToggleSelect, onOpenMore, onOpenCandidate }: CompanionCardProps) {
  const hasSelection = job.candidates.some((candidate) => candidate.selected);

  return (
    <div className="companion-card">
      <div className="cc-header">
        <div className="cc-header-main">
          <div className="cc-title">{job.title}</div>
          <div className="cc-subline">
            <span className="cc-jobref">({job.subtitle})</span>
            <span className="cc-status">
              <span className="cc-status-dot" aria-hidden="true" />
              {job.badge}
            </span>
          </div>
        </div>
      </div>

      <div className="cc-rows">
        {job.candidates.map((candidate: JobPostingCandidate) => (
          <CandidateRow
            key={candidate.id}
            candidate={candidate}
            onToggleSelect={onToggleSelect}
            onOpen={onOpenCandidate}
          />
        ))}
      </div>

      <div className="cc-footer">
        <button className="cc-footer-btn" type="button" disabled={!hasSelection}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M8 12l3 3 5-6" />
          </svg>
          Schedule selected
        </button>
        <button className="cc-footer-btn" type="button" onClick={onOpenMore}>
          More
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
