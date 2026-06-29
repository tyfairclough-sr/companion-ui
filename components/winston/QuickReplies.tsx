"use client";

import { useState } from "react";

type QuickReplyStatus = "idle" | "thinking" | "complete";

interface QuickReplyItem {
  label: string;
  status?: QuickReplyStatus;
  /** Alternate labels the refresh icon cycles through (after the base label). */
  alternates?: string[];
}

interface QuickRepliesProps {
  replies?: (string | QuickReplyItem)[];
  onSelect?: (reply: string) => void;
  /** Disables the entire group (e.g. after one reply has been chosen). */
  disabled?: boolean;
}

const DEFAULT_REPLIES: QuickReplyItem[] = [
  { label: "Show job pipeline health" },
  { label: "Who are the top candidates?" },
  { label: "Shortlist Zackary and Margaret", alternates: ["Shortlist Oliver and Priya"] },
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

export function QuickReplies({ replies = DEFAULT_REPLIES, onSelect, disabled = false }: QuickRepliesProps) {
  const [labelIndices, setLabelIndices] = useState<Record<string, number>>({});

  if (replies.length === 0) return null;

  return (
    <div
      className={`quick-replies${disabled ? " quick-replies--disabled" : ""}`}
      role="group"
      aria-label="Quick replies"
    >
      {replies.map((raw) => {
        const { label: baseLabel, status = "idle", alternates = [] } = normalize(raw);
        const isBusy = status !== "idle";
        const labelCycle = [baseLabel, ...alternates];
        const currentIndex = labelIndices[baseLabel] ?? 0;
        const label = labelCycle[currentIndex] ?? baseLabel;
        const canRefresh = status === "idle" && alternates.length > 0;

        const handleRefresh = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (disabled) return;
          setLabelIndices((prev) => ({
            ...prev,
            [baseLabel]: ((prev[baseLabel] ?? 0) + 1) % labelCycle.length,
          }));
        };

        return (
          <button
            key={baseLabel}
            type="button"
            className={`quick-reply quick-reply--${status}`}
            onClick={() => onSelect?.(label)}
            disabled={isBusy || disabled}
          >
            <PlusIcon />
            <span className="quick-reply-label">{label}</span>
            {status === "idle" &&
              (canRefresh ? (
                <span
                  className="quick-reply-refresh"
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-label="Show a different suggestion"
                  onClick={handleRefresh}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRefresh(e as unknown as React.MouseEvent);
                    }
                  }}
                >
                  <RefreshIcon />
                </span>
              ) : (
                <RefreshIcon />
              ))}
            {status === "thinking" && <SpinnerIcon />}
            {status === "complete" && <CheckIcon />}
          </button>
        );
      })}
    </div>
  );
}
