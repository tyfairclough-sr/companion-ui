interface AiReplyProps {
  children: React.ReactNode;
}

export function AiReply({ children }: AiReplyProps) {
  return (
    <div className="ai-reply">
      <div className="ai-reply-bubble">{children}</div>
    </div>
  );
}
