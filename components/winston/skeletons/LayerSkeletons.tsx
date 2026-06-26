function SkeletonRow({ index }: { index: number }) {
  return (
    <div className="stream-skeleton-row">
      <div className="stream-skeleton-block stream-skeleton-checkbox" />
      <div className="stream-skeleton-stack">
        <div className="stream-skeleton-block stream-skeleton-line medium" style={{ animationDelay: `${index * 0.08}s` }} />
        <div className="stream-skeleton-block stream-skeleton-line short" style={{ animationDelay: `${index * 0.08 + 0.05}s` }} />
      </div>
      <div className="stream-skeleton-block stream-skeleton-badge" style={{ animationDelay: `${index * 0.08 + 0.1}s` }} />
    </div>
  );
}

export function CompanionCardSkeleton() {
  return (
    <div className="companion-card stream-skeleton-card" aria-hidden="true">
      <div className="stream-skeleton-header">
        <div className="stream-skeleton-block stream-skeleton-avatar" />
        <div className="stream-skeleton-stack">
          <div className="stream-skeleton-block stream-skeleton-line title" />
          <div className="stream-skeleton-block stream-skeleton-line medium" />
        </div>
        <div className="stream-skeleton-block stream-skeleton-btn" />
      </div>
      <div className="stream-skeleton-rows">
        {[0, 1, 2].map((i) => (
          <SkeletonRow key={i} index={i} />
        ))}
      </div>
      <div className="stream-skeleton-footer">
        <div className="stream-skeleton-block stream-skeleton-line short" />
        <div className="stream-skeleton-block stream-skeleton-line short" />
      </div>
    </div>
  );
}

export function SuggestionChipSkeleton() {
  return (
    <div className="stream-skeleton-chip" aria-hidden="true">
      <div className="stream-skeleton-block stream-skeleton-chip-line" />
    </div>
  );
}

export function QuickRepliesSkeleton() {
  return (
    <div className="quick-replies stream-skeleton-quick-replies" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="stream-skeleton-block stream-skeleton-quick-reply"
          style={{ animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}

export function JobListSkeleton({ rowCount = 6 }: { rowCount?: number }) {
  return (
    <div className="stream-skeleton-job-list" aria-hidden="true">
      {Array.from({ length: rowCount }, (_, i) => (
        <div className="job-list-row stream-skeleton-job-row" key={i}>
          <div className="stream-skeleton-block stream-skeleton-checkbox" />
          <div className="stream-skeleton-stack">
            <div className="stream-skeleton-block stream-skeleton-line medium" style={{ animationDelay: `${i * 0.06}s` }} />
            <div className="stream-skeleton-block stream-skeleton-line short" style={{ animationDelay: `${i * 0.06 + 0.04}s` }} />
          </div>
          <div className="stream-skeleton-block stream-skeleton-badge" />
        </div>
      ))}
    </div>
  );
}

export function CandidateAppSkeleton() {
  return (
    <div className="ca-card stream-skeleton-candidate" aria-hidden="true">
      <div className="stream-skeleton-header">
        <div className="stream-skeleton-block stream-skeleton-avatar" />
        <div className="stream-skeleton-stack">
          <div className="stream-skeleton-block stream-skeleton-line title" />
          <div className="stream-skeleton-block stream-skeleton-line long" />
        </div>
        <div className="stream-skeleton-block stream-skeleton-btn" />
      </div>
      <div className="stream-skeleton-tabs">
        <div className="stream-skeleton-block stream-skeleton-tab" />
        <div className="stream-skeleton-block stream-skeleton-tab" />
        <div className="stream-skeleton-block stream-skeleton-tab wide" />
      </div>
      <div className="stream-skeleton-controls">
        <div className="stream-skeleton-block stream-skeleton-segment" />
        <div className="stream-skeleton-block stream-skeleton-line short" />
      </div>
      <div className="stream-skeleton-body">
        <div className="stream-skeleton-block stream-skeleton-line title" />
        {[0, 1].map((i) => (
          <div className="stream-skeleton-entry" key={i}>
            <div className="stream-skeleton-block stream-skeleton-line short" />
            <div className="stream-skeleton-block stream-skeleton-line medium" />
            <div className="stream-skeleton-block stream-skeleton-line long" />
            <div className="stream-skeleton-block stream-skeleton-line full" />
          </div>
        ))}
        <div className="stream-skeleton-block stream-skeleton-line title" style={{ marginTop: 16 }} />
        <div className="stream-skeleton-entry">
          <div className="stream-skeleton-block stream-skeleton-line short" />
          <div className="stream-skeleton-block stream-skeleton-line medium" />
        </div>
      </div>
    </div>
  );
}
