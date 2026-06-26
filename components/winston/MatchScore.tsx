const sparkleSvg = (
  <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
    <path d="M6 0.5L6.75 4.75L11 5.5L6.75 6.25L6 10.5L5.25 6.25L1 5.5L5.25 4.75L6 0.5Z" />
  </svg>
);

interface MatchScoreProps {
  score: number;
}

export function MatchScore({ score }: MatchScoreProps) {
  const variant = score >= 1 && score <= 4 ? score : 2;

  return (
    <span className={`cc-match cc-match--${variant}`}>
      {sparkleSvg}
      <span className="cc-match-value">{variant}</span>
    </span>
  );
}
