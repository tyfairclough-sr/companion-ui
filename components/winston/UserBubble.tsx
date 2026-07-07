interface UserBubbleProps {
  children: React.ReactNode;
  isFirstInGroup?: boolean;
}

export function UserBubble({ children, isFirstInGroup = true }: UserBubbleProps) {
  return (
    <div
      className={[
        "suggestion-chip",
        isFirstInGroup ? "suggestion-chip--first" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
