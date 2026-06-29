interface ChatLoadingProps {
  text?: string;
}

export function ChatLoading({ text = "This will take a moment..." }: ChatLoadingProps) {
  return (
    <div className="chat-loading" role="status" aria-live="polite">
      <span className="chat-loading-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="chat-loading-text">{text}</span>
    </div>
  );
}
