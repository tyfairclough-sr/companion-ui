interface QuickRepliesProps {
  replies?: string[];
  onSelect?: (reply: string) => void;
}

const DEFAULT_REPLIES = [
  "Show top candidates",
  "Schedule interviews",
  "Summarize this role",
  "Draft outreach",
];

export function QuickReplies({ replies = DEFAULT_REPLIES, onSelect }: QuickRepliesProps) {
  if (replies.length === 0) return null;

  return (
    <div className="quick-replies" role="group" aria-label="Quick replies">
      {replies.map((reply) => (
        <button
          key={reply}
          type="button"
          className="quick-reply"
          onClick={() => onSelect?.(reply)}
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
