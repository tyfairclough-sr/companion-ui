import { JobPostingCandidate } from "@/lib/types";

const starSvg = (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
    <path d="M12 2l1.6 5.1L19 8.2l-4.2 3.3 1.5 5.2L12 13.8 7.7 16.7l1.5-5.2L5 8.2l5.4-1.1L12 2z" />
  </svg>
);

const chevronSvg = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 16, height: 16 }}
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

interface CandidateRowProps {
  candidate: JobPostingCandidate;
  rowClassName?: string;
  onToggleSelect?: (id: string, selected: boolean) => void;
  onOpen?: (id: string) => void;
  showChevron?: boolean;
}

export function CandidateRow({
  candidate,
  rowClassName = "cc-row",
  onToggleSelect,
  onOpen,
  showChevron = true,
}: CandidateRowProps) {
  return (
    <div
      className={rowClassName}
      onClick={() => onOpen?.(candidate.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen?.(candidate.id);
      }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <span
        className="cc-checkbox"
        role="checkbox"
        aria-checked={candidate.selected}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect?.(candidate.id, !candidate.selected);
        }}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            onToggleSelect?.(candidate.id, !candidate.selected);
          }
        }}
        tabIndex={0}
      />
      <div className="cc-row-main">
        <div className="cc-row-top">
          <span className="cc-name">{candidate.name}</span>
          <span className="cc-badge cc-badge-grey">{candidate.badgeType}</span>
        </div>
        <div className="cc-address">{candidate.address}</div>
      </div>
      <span className="cc-match">
        {starSvg} {candidate.matchScore}
      </span>
      {showChevron && (
        <button
          className="cc-row-chevron"
          aria-label="Open"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.(candidate.id);
          }}
        >
          {chevronSvg}
        </button>
      )}
    </div>
  );
}
