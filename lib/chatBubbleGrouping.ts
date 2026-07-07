export type BubbleRole = "user" | "agent";

export function isFirstBubbleInGroup(
  role: BubbleRole,
  lastBubbleRole: BubbleRole | null
): boolean {
  return lastBubbleRole !== role;
}
