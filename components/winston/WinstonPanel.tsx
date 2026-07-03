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
import { ActionPanelHeader } from "./ActionPanelHeader";
import { WelcomeView } from "./WelcomeView";
import { CompanionCardSkeleton, SuggestionChipSkeleton, QuickRepliesSkeleton } from "./skeletons/LayerSkeletons";

interface WinstonPanelProps {
  isOpen: boolean;
  job: JobPostingResponse | null;
  allCandidates: JobPostingCandidate[];
  selectedCandidate: CandidateDetailResponse | null;
  jobListOpen: boolean;
  candidateAppOpen: boolean;
  contactCardOpen: boolean;
  actionPanelOpen: boolean;
  headerMode: "default" | "jobList" | "candidate" | "contact";
  isDesktop: boolean;
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
  actionColRef: React.RefObject<HTMLDivElement | null>;
  jobListLayerRef: React.RefObject<HTMLDivElement | null>;
  candidateAppLayerRef: React.RefObject<HTMLDivElement | null>;
  contactCardLayerRef: React.RefObject<HTMLDivElement | null>;
}

export const WinstonPanel = forwardRef<HTMLDivElement, WinstonPanelProps>(
  function WinstonPanel(
    {
      isOpen,
      job,
      allCandidates,
      selectedCandidate,
      jobListOpen,
      candidateAppOpen,
      contactCardOpen,
      actionPanelOpen,
      headerMode,
      isDesktop,
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
      actionColRef,
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
    const [selectionDisabled, setSelectionDisabled] = useState(false);

    // Welcome screen: shown once per browser session (resets on refresh) and
    // dismissed when the user enters their first prompt.
    const [welcomeDismissed, setWelcomeDismissed] = useState(false);
    const [welcomeExited, setWelcomeExited] = useState(false);
    const welcomeInverted = isOpen && !welcomeDismissed && !welcomeExited;
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
      setWelcomeDismissed(true);
    };

    const handleQuickReply = (label: string) => {
      if (quickRepliesUsed) return;
      setSentMessages((prev) => [...prev, label]);
      setQuickRepliesUsed(true);
      setWelcomeDismissed(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleScheduleSelected = () => {
      const keepActionPanelOpen = isDesktop && actionPanelOpen && jobListOpen;
      setSentMessages((prev) => [...prev, "Schedule selected"]);
      if (jobListOpen && !keepActionPanelOpen) {
        onCloseJobList();
      } else if (candidateAppOpen) {
        onCloseCandidateApp();
      }
      if (keepActionPanelOpen) {
        setSelectionDisabled(true);
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
      if (!jobListOpen) setSelectionDisabled(false);
    }, [jobListOpen]);

    useEffect(() => {
      const el = bodyRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, [sentMessages, scheduling]);

    // #region agent log
    useEffect(() => {
      const t = setTimeout(() => {
        const body = bodyRef.current;
        const actionCol = actionColRef.current;
        const chatCol = (ref as React.RefObject<HTMLDivElement>)?.current?.querySelector(".panel-chat-col") as HTMLElement | null;
        const cs = (el: Element | null) => (el ? getComputedStyle(el) : null);
        const r = (el: Element | null) => (el ? el.getBoundingClientRect() : null);
        const bodyCs = cs(body);
        const acCs = cs(actionCol);
        const chatCs = cs(chatCol);
        const payload = {
          isDesktop,
          actionPanelOpen,
          jobListOpen,
          candidateAppOpen,
          contactCardOpen,
          chatStreamLoading,
          jobPresent: !!job,
          innerWidth: typeof window !== "undefined" ? window.innerWidth : null,
          actionCol: actionCol ? { opacity: acCs?.opacity, visibility: acCs?.visibility, position: acCs?.position, background: acCs?.backgroundColor, zIndex: acCs?.zIndex, pointerEvents: acCs?.pointerEvents, rect: r(actionCol) } : null,
          panelBody: body ? { childCount: body.childElementCount, opacity: bodyCs?.opacity, visibility: bodyCs?.visibility, zIndex: bodyCs?.zIndex, rect: r(body) } : null,
          chatCol: chatCol ? { opacity: chatCs?.opacity, visibility: chatCs?.visibility, rect: r(chatCol) } : null,
        };
        fetch('http://127.0.0.1:7893/ingest/3d4f6f99-f80c-42e6-b46f-ea06df6e0712',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7ba003'},body:JSON.stringify({sessionId:'7ba003',runId:'post-fix',hypothesisId:'A,B,C',location:'WinstonPanel.tsx:measure',message:'panel mobile layout snapshot',data:payload,timestamp:Date.now()})}).catch(()=>{});
      }, 600);
      return () => clearTimeout(t);
    }, [isDesktop, actionPanelOpen, jobListOpen, candidateAppOpen, contactCardOpen, chatStreamLoading, job, ref, actionColRef]);
    // #endregion

    const canReturnToChat =
      [jobListOpen, candidateAppOpen, contactCardOpen].filter(Boolean).length > 1;

    const showActionColumn = actionPanelOpen;

    return (
      <div className={`panel${isDesktop ? " panel--desktop" : ""}${actionPanelOpen && isDesktop ? " panel--extended" : ""}`} ref={ref}>
        <div className="panel-columns">
          <div className="panel-chat-col">
            <PanelHeader
              headerMode={headerMode}
              canReturnToChat={canReturnToChat}
              inverted={welcomeInverted}
              isDesktop={isDesktop}
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
            </div>

            {!welcomeExited ? (
              <WelcomeView
                isOpen={isOpen}
                dismissed={welcomeDismissed}
                onExited={() => setWelcomeExited(true)}
              />
            ) : null}
          </div>

          <div className={`panel-action-col${showActionColumn ? " panel-action-col--visible" : ""}`} ref={actionColRef}>
            {isDesktop ? (
              <ActionPanelHeader
                headerMode={headerMode}
                visible={actionPanelOpen}
                canReturnToChat={canReturnToChat}
                onCloseJobList={onCloseJobList}
                onCloseCandidateApp={onCloseCandidateApp}
                onCloseContactCard={onCloseContactCard}
                onReturnToChat={onReturnToChat}
              />
            ) : null}

            <div className="panel-action-body">
              <JobListLayer
                ref={jobListLayerRef}
                candidates={allCandidates}
                isOpen={jobListOpen}
                selectionDisabled={selectionDisabled}
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
          </div>
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
