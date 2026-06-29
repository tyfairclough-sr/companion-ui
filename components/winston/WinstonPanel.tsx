"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { JobPostingResponse, CandidateDetailResponse, JobPostingCandidate } from "@/lib/types";
import { useSkeletonReveal } from "@/hooks/useSkeletonReveal";
import { CompanionCard } from "./CompanionCard";
import { AiReply } from "./AiReply";
import { ChatLoading } from "./ChatLoading";
import { QuickReplies } from "./QuickReplies";
import { JobListLayer } from "./JobListLayer";
import { CandidateAppLayer } from "./CandidateAppLayer";
import { ContactCardLayer } from "./ContactCardLayer";
import { PanelHeader } from "./PanelHeader";
import { CompanionCardSkeleton, SuggestionChipSkeleton, QuickRepliesSkeleton } from "./skeletons/LayerSkeletons";

interface WinstonPanelProps {
  job: JobPostingResponse | null;
  allCandidates: JobPostingCandidate[];
  selectedCandidate: CandidateDetailResponse | null;
  jobListOpen: boolean;
  candidateAppOpen: boolean;
  contactCardOpen: boolean;
  headerMode: "default" | "jobList" | "candidate" | "contact";
  onToggle: () => void;
  onToggleMenu: (e?: React.MouseEvent) => void;
  onMenuAction: (action: "reset" | "history") => void;
  onOpenJobList: () => void;
  onCloseJobList: () => void;
  onCloseCandidateApp: () => void;
  onOpenContactCard: () => void;
  onCloseContactCard: () => void;
  onReturnToChat: () => void;
  onToggleSelect: (id: string, selected: boolean) => void;
  onOpenCandidate: (id: string) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  menuBtnRef: React.RefObject<HTMLDivElement | null>;
  jobListLayerRef: React.RefObject<HTMLDivElement | null>;
  candidateAppLayerRef: React.RefObject<HTMLDivElement | null>;
  contactCardLayerRef: React.RefObject<HTMLDivElement | null>;
}

export const WinstonPanel = forwardRef<HTMLDivElement, WinstonPanelProps>(
  function WinstonPanel(
    {
      job,
      allCandidates,
      selectedCandidate,
      jobListOpen,
      candidateAppOpen,
      contactCardOpen,
      headerMode,
      onToggle,
      onToggleMenu,
      onMenuAction,
      onOpenJobList,
      onCloseJobList,
      onCloseCandidateApp,
      onOpenContactCard,
      onCloseContactCard,
      onReturnToChat,
      onToggleSelect,
      onOpenCandidate,
      menuRef,
      menuBtnRef,
      jobListLayerRef,
      candidateAppLayerRef,
      contactCardLayerRef,
    },
    ref
  ) {
    const chatStreamLoading = useSkeletonReveal({ ready: !!job });

    const [inputValue, setInputValue] = useState("");
    const [sentMessages, setSentMessages] = useState<string[]>([]);
    const [quickRepliesUsed, setQuickRepliesUsed] = useState(false);
    const [scheduling, setScheduling] = useState(false);
    const bodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const scheduleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleInputRowFocus = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === inputRef.current) return;
      inputRef.current?.focus();
    };

    const handleSend = () => {
      const text = inputValue.trim();
      if (!text) return;
      setSentMessages((prev) => [...prev, text]);
      setInputValue("");
    };

    const handleQuickReply = (label: string) => {
      if (quickRepliesUsed) return;
      setSentMessages((prev) => [...prev, label]);
      setQuickRepliesUsed(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleScheduleSelected = () => {
      setSentMessages((prev) => [...prev, "Schedule selected"]);
      if (jobListOpen) {
        onCloseJobList();
      } else if (candidateAppOpen) {
        onCloseCandidateApp();
      }
      if (scheduleTimerRef.current) clearTimeout(scheduleTimerRef.current);
      setScheduling(false);
      scheduleTimerRef.current = setTimeout(() => setScheduling(true), 400);
    };

    useEffect(() => {
      return () => {
        if (scheduleTimerRef.current) clearTimeout(scheduleTimerRef.current);
      };
    }, []);

    useEffect(() => {
      const el = bodyRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, [sentMessages, scheduling]);

    const canReturnToChat =
      [jobListOpen, candidateAppOpen, contactCardOpen].filter(Boolean).length > 1;

    return (
      <div className="panel" ref={ref}>
        <PanelHeader
          headerMode={headerMode}
          canReturnToChat={canReturnToChat}
          onToggle={onToggle}
          onToggleMenu={onToggleMenu}
          onMenuAction={onMenuAction}
          onCloseJobList={onCloseJobList}
          onCloseCandidateApp={onCloseCandidateApp}
          onCloseContactCard={onCloseContactCard}
          onReturnToChat={onReturnToChat}
          menuRef={menuRef}
          menuBtnRef={menuBtnRef}
        />

        <div className="panel-body-wrap">
          <div className="panel-body" ref={bodyRef}>
            {chatStreamLoading ? (
              <SuggestionChipSkeleton />
            ) : (
              <div className="suggestion-chip">show my Sales Executive job</div>
            )}
            {chatStreamLoading ? null : (
              <AiReply>
                Sure thing Ali, you have this job that is currently in the hiring stage.
              </AiReply>
            )}
            {chatStreamLoading ? (
              <CompanionCardSkeleton />
            ) : job ? (
              <CompanionCard
                job={job}
                onToggleSelect={onToggleSelect}
                onOpenMore={onOpenJobList}
                onOpenCandidate={onOpenCandidate}
                onScheduleSelected={handleScheduleSelected}
              />
            ) : null}
            {chatStreamLoading ? (
              <QuickRepliesSkeleton />
            ) : (
              <QuickReplies onSelect={handleQuickReply} disabled={quickRepliesUsed} />
            )}
            {sentMessages.map((message, index) => (
              <div className="suggestion-chip" key={index}>
                {message}
              </div>
            ))}
            {scheduling ? <ChatLoading /> : null}
          </div>

          <JobListLayer
            ref={jobListLayerRef}
            candidates={allCandidates}
            isOpen={jobListOpen}
            onToggleSelect={onToggleSelect}
            onOpenCandidate={onOpenCandidate}
            onScheduleSelected={handleScheduleSelected}
          />

          <CandidateAppLayer
            ref={candidateAppLayerRef}
            candidate={selectedCandidate}
            isOpen={candidateAppOpen}
            onContact={onOpenContactCard}
          />

          <ContactCardLayer
            ref={contactCardLayerRef}
            candidate={selectedCandidate}
            isOpen={contactCardOpen}
          />
        </div>

        <div className="panel-footer">
          <div className="panel-input-row" onMouseDown={handleInputRowFocus}>
            <input
              ref={inputRef}
              className="panel-input"
              type="text"
              placeholder="Message Winston..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="panel-send-btn" type="button" aria-label="Send message" onClick={handleSend} disabled={!inputValue.trim()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="#383C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#383C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="panel-footer-caption">Winston uses AI, verify results.</div>
        </div>
      </div>
    );
  }
);
