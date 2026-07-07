interface AiReplyProps {
  children: React.ReactNode;
  isFirstInGroup?: boolean;
}

export function AiReply({ children, isFirstInGroup = true }: AiReplyProps) {
  return (
    <div className="ai-reply">
      <div
        className={[
          "ai-reply-bubble",
          isFirstInGroup ? "ai-reply-bubble--first" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
