type QuickReplyStatus = "idle" | "thinking" | "complete";

interface QuickReplyItem {
  label: string;
  status?: QuickReplyStatus;
}

interface QuickRepliesProps {
  replies?: (string | QuickReplyItem)[];
  onSelect?: (reply: string) => void;
}

const DEFAULT_REPLIES: QuickReplyItem[] = [
  { label: "Show job pipeline health" },
  { label: "Who are the top candidates?" },
  { label: "Shortlist Zackary and Margaret" },
];

function normalize(reply: string | QuickReplyItem): QuickReplyItem {
  return typeof reply === "string" ? { label: reply } : reply;
}

function PlusIcon() {
  return (
    <svg className="quick-reply-plus" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="quick-reply-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12a9 9 0 1 1-2.64-6.36M21 3v5h-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="quick-reply-icon quick-reply-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12a9 9 0 1 1-2.64-6.36"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="quick-reply-icon quick-reply-check" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function QuickReplies({ replies = DEFAULT_REPLIES, onSelect }: QuickRepliesProps) {
  if (replies.length === 0) return null;

  return (
    <div className="quick-replies" role="group" aria-label="Quick replies">
      {replies.map((raw) => {
        const { label, status = "idle" } = normalize(raw);
        const isBusy = status !== "idle";

        return (
          <button
            key={label}
            type="button"
            className={`quick-reply quick-reply--${status}`}
            onClick={() => onSelect?.(label)}
            disabled={isBusy}
          >
            <PlusIcon />
            <span className="quick-reply-label">{label}</span>
            {status === "idle" && <RefreshIcon />}
            {status === "thinking" && <SpinnerIcon />}
            {status === "complete" && <CheckIcon />}
          </button>
        );
      })}
    </div>
  );
}
