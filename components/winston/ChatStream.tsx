import type { JobPostingResponse } from "@/lib/types";
import { isFirstBubbleInGroup, type BubbleRole } from "@/lib/chatBubbleGrouping";
import { AiReply } from "./AiReply";
import { ChatLoading } from "./ChatLoading";
import { CompanionCard } from "./CompanionCard";
import { QuickReplies } from "./QuickReplies";
import { UserBubble } from "./UserBubble";
import {
  CompanionCardSkeleton,
  QuickRepliesSkeleton,
  SuggestionChipSkeleton,
} from "./skeletons/LayerSkeletons";

type ChatStreamItem =
  | { type: "user"; text: string; key: string }
  | { type: "agent"; text: string; key: string }
  | { type: "loading"; key: string }
  | { type: "companion"; key: string }
  | { type: "quick-replies"; key: string }
  | { type: "skeleton-chip"; key: string }
  | { type: "skeleton-companion"; key: string }
  | { type: "skeleton-replies"; key: string };

interface ChatStreamProps {
  items: ChatStreamItem[];
  job: JobPostingResponse | null;
  quickRepliesUsed: boolean;
  onToggleSelect: (id: string, selected: boolean) => void;
  onOpenMore: () => void;
  onOpenCandidate: (id: string) => void;
  onScheduleSelected: () => void;
  onQuickReply: (label: string) => void;
}

export function ChatStream({
  items,
  job,
  quickRepliesUsed,
  onToggleSelect,
  onOpenMore,
  onOpenCandidate,
  onScheduleSelected,
  onQuickReply,
}: ChatStreamProps) {
  let lastBubbleRole: BubbleRole | null = null;

  return (
    <>
      {items.map((item) => {
        switch (item.type) {
          case "user": {
            const isFirstInGroup = isFirstBubbleInGroup("user", lastBubbleRole);
            lastBubbleRole = "user";
            return (
              <UserBubble key={item.key} isFirstInGroup={isFirstInGroup}>
                {item.text}
              </UserBubble>
            );
          }
          case "agent": {
            const isFirstInGroup = isFirstBubbleInGroup("agent", lastBubbleRole);
            lastBubbleRole = "agent";
            return (
              <AiReply key={item.key} isFirstInGroup={isFirstInGroup}>
                {item.text}
              </AiReply>
            );
          }
          case "loading":
            return <ChatLoading key={item.key} />;
          case "companion":
            lastBubbleRole = null;
            return job ? (
              <CompanionCard
                key={item.key}
                job={job}
                onToggleSelect={onToggleSelect}
                onOpenMore={onOpenMore}
                onOpenCandidate={onOpenCandidate}
                onScheduleSelected={onScheduleSelected}
              />
            ) : null;
          case "quick-replies":
            lastBubbleRole = null;
            return (
              <QuickReplies
                key={item.key}
                onSelect={onQuickReply}
                disabled={quickRepliesUsed}
              />
            );
          case "skeleton-chip":
            return <SuggestionChipSkeleton key={item.key} />;
          case "skeleton-companion":
            return <CompanionCardSkeleton key={item.key} />;
          case "skeleton-replies":
            return <QuickRepliesSkeleton key={item.key} />;
          default:
            return null;
        }
      })}
    </>
  );
}

export function buildMainChatStreamItems(options: {
  chatStreamLoading: boolean;
  sentMessages: string[];
  scheduling: boolean;
}): ChatStreamItem[] {
  const { chatStreamLoading, sentMessages, scheduling } = options;
  const items: ChatStreamItem[] = [];

  if (chatStreamLoading) {
    items.push({ type: "skeleton-chip", key: "skeleton-chip" });
  } else {
    items.push({
      type: "user",
      text: "show my Sales Executive job",
      key: "seed-user",
    });
    items.push({
      type: "agent",
      text: "Sure thing Ali, you have this job that is currently in the hiring stage.",
      key: "seed-agent",
    });
  }

  if (chatStreamLoading) {
    items.push({ type: "skeleton-companion", key: "skeleton-companion" });
    items.push({ type: "skeleton-replies", key: "skeleton-replies" });
  } else {
    items.push({ type: "companion", key: "companion" });
    items.push({ type: "quick-replies", key: "quick-replies" });
  }

  sentMessages.forEach((message, index) => {
    items.push({ type: "user", text: message, key: `user-${index}` });
  });

  if (scheduling) {
    items.push({ type: "loading", key: "scheduling-loading" });
  }

  return items;
}

export function buildSheetPeekStreamItems(
  latestExchange: { prompt: string; reply: string | null }
): ChatStreamItem[] {
  const items: ChatStreamItem[] = [
    { type: "user", text: latestExchange.prompt, key: "sheet-prompt" },
  ];

  if (latestExchange.reply === null) {
    items.push({ type: "loading", key: "sheet-loading" });
  } else {
    items.push({ type: "agent", text: latestExchange.reply, key: "sheet-reply" });
  }

  return items;
}

export function buildSheetFullHistoryItems(options: {
  chatStreamLoading: boolean;
  sentMessages: string[];
  latestExchange: { prompt: string; reply: string | null } | null;
  scheduling: boolean;
}): ChatStreamItem[] {
  const { chatStreamLoading, sentMessages, latestExchange, scheduling } = options;
  const items: ChatStreamItem[] = [];

  if (!chatStreamLoading) {
    items.push({
      type: "user",
      text: "show my Sales Executive job",
      key: "seed-user",
    });
    items.push({
      type: "agent",
      text: "Sure thing Ali, you have this job that is currently in the hiring stage.",
      key: "seed-agent",
    });
  }

  sentMessages.forEach((message, index) => {
    items.push({ type: "user", text: message, key: `user-${index}` });
  });

  if (latestExchange?.reply === null) {
    items.push({ type: "loading", key: "sheet-loading" });
  } else if (latestExchange?.reply) {
    items.push({ type: "agent", text: latestExchange.reply, key: "sheet-reply" });
  }

  if (scheduling) {
    items.push({ type: "loading", key: "scheduling-loading" });
  }

  return items;
}
