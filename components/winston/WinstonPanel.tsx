"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { JobPostingResponse, CandidateDetailResponse, JobPostingCandidate } from "@/lib/types";
import { useSkeletonReveal } from "@/hooks/useSkeletonReveal";
import { useSheetSnap } from "@/hooks/useSheetSnap";
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

    // Mobile-only slide-up sheet: three snap states (collapsed, peek, full history).
    const [latestExchange, setLatestExchange] = useState<
      { prompt: string; reply: string | null } | null
    >(null);
    const sheetReplyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sheetBodyRef = useRef<HTMLDivElement>(null);
    const {
      snap: sheetSnap,
      isDragging: sheetDragging,
      isExpanded: sheetExpanded,
      expandedBodyHeight,
      footerRef: sheetFooterRef,
      resetSnap: resetSheetSnap,
      expandToPeek,
      handlePointerDown: handleSheetPointerDown,
      handlePointerMove: handleSheetPointerMove,
      handlePointerUp: handleSheetPointerUp,
      handlePointerCancel: handleSheetPointerCancel,
    } = useSheetSnap();

    const layerOpen = jobListOpen || candidateAppOpen || contactCardOpen;
    const sheetMode = !isDesktop && layerOpen;

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

    const openSheet = (prompt: string) => {
      // Keep the real chat history intact behind the layer, then surface just
      // this exchange in the sheet (loading first, then a static reply).
      setSentMessages((prev) => [...prev, prompt]);
      setLatestExchange({ prompt, reply: null });
      expandToPeek();
      if (sheetReplyTimerRef.current) clearTimeout(sheetReplyTimerRef.current);
      sheetReplyTimerRef.current = setTimeout(() => {
        setLatestExchange((prev) =>
          prev ? { ...prev, reply: "Here's what I found based on that." } : prev
        );
      }, 900);
    };

    const handleLayerAction = (label: string) => {
      if (sheetMode) openSheet(label);
    };

    const handleSend = () => {
      const text = inputValue.trim();
      if (!text) return;
      if (sheetMode) {
        openSheet(text);
        setInputValue("");
        return;
      }
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
      if (sheetMode) {
        openSheet("Schedule selected");
        return;
      }
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
        if (sheetReplyTimerRef.current) clearTimeout(sheetReplyTimerRef.current);
      };
    }, []);

    // Collapse and clear the sheet when it no longer applies (layer closed or
    // switched to desktop where the chat stream is always visible).
    useEffect(() => {
      if (!sheetMode) {
        resetSheetSnap();
        setLatestExchange(null);
        if (sheetReplyTimerRef.current) clearTimeout(sheetReplyTimerRef.current);
      }
    }, [sheetMode, resetSheetSnap]);

    useEffect(() => {
      const el = sheetBodyRef.current;
      if (el && sheetSnap > 0) el.scrollTop = el.scrollHeight;
    }, [sentMessages, latestExchange, scheduling, sheetSnap]);

    useEffect(() => {
      if (!jobListOpen) setSelectionDisabled(false);
    }, [jobListOpen]);

    useEffect(() => {
      const el = bodyRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, [sentMessages, scheduling]);

    // #region agent log
    useEffect(() => {
      if (!isOpen || isDesktop) return;

      const logViewport = (trigger: string) => {
        const panel = (ref as React.RefObject<HTMLDivElement>)?.current;
        const footer = sheetFooterRef.current;
        const inputRow = footer?.querySelector(".panel-input-row") as HTMLElement | null;
        const vv = window.visualViewport;
        const footerRect = footer?.getBoundingClientRect();
        const inputRect = inputRow?.getBoundingClientRect();
        const panelRect = panel?.getBoundingClientRect();
        const panelCs = panel ? getComputedStyle(panel) : null;
        const footerCs = footer ? getComputedStyle(footer) : null;

        const probe = document.createElement("div");
        probe.style.cssText = "position:fixed;visibility:hidden;padding-bottom:env(safe-area-inset-bottom)";
        document.body.appendChild(probe);
        const safeAreaBottom = getComputedStyle(probe).paddingBottom;
        document.body.removeChild(probe);

        const visibleBottom = vv ? vv.height + vv.offsetTop : window.innerHeight;
        const footerBottom = footerRect?.bottom ?? 0;
        const inputBottom = inputRect?.bottom ?? 0;

        fetch("/api/debug-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "8f4e86",
            runId: "initial",
            hypothesisId: "A,B,C,D,E",
            location: "WinstonPanel.tsx:viewport",
            message: "mobile footer viewport metrics",
            data: {
              trigger,
              innerHeight: window.innerHeight,
              screenHeight: window.screen.height,
              vvHeight: vv?.height ?? null,
              vvOffsetTop: vv?.offsetTop ?? null,
              visibleBottom,
              panelHeight: panelCs?.height ?? null,
              panelBottom: panelRect?.bottom ?? null,
              footerBottom,
              inputBottom,
              footerObscuredPx: Math.round((footerBottom - visibleBottom) * 10) / 10,
              inputObscuredPx: Math.round((inputBottom - visibleBottom) * 10) / 10,
              footerPaddingBottom: footerCs?.paddingBottom ?? null,
              safeAreaInsetBottom: safeAreaBottom,
              sheetMode,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
      };

      logViewport("mount");
      const t = setTimeout(() => logViewport("delayed-600ms"), 600);
      const onVvChange = () => logViewport("visualViewport-change");
      window.visualViewport?.addEventListener("resize", onVvChange);
      window.visualViewport?.addEventListener("scroll", onVvChange);
      return () => {
        clearTimeout(t);
        window.visualViewport?.removeEventListener("resize", onVvChange);
        window.visualViewport?.removeEventListener("scroll", onVvChange);
      };
    }, [isOpen, isDesktop, ref, sheetFooterRef, sheetMode]);
    // #endregion

    const canReturnToChat =
      [jobListOpen, candidateAppOpen, contactCardOpen].filter(Boolean).length > 1;

    const showActionColumn = actionPanelOpen;

    const sheetAriaLabel =
      sheetSnap === 0
        ? "Expand recent reply"
        : sheetSnap === 1
          ? "Expand full chat history"
          : "Collapse chat sheet";

    const renderSheetPeekContent = () => {
      if (!latestExchange) return null;
      return (
        <>
          <div className="suggestion-chip">{latestExchange.prompt}</div>
          {latestExchange.reply === null ? (
            <ChatLoading />
          ) : (
            <AiReply>{latestExchange.reply}</AiReply>
          )}
        </>
      );
    };

    const renderSheetFullHistory = () => (
      <>
        {!chatStreamLoading ? (
          <>
            <div className="suggestion-chip">show my Sales Executive job</div>
            <AiReply>
              Sure thing Ali, you have this job that is currently in the hiring stage.
            </AiReply>
          </>
        ) : null}
        {sentMessages.map((message, index) => (
          <div className="suggestion-chip" key={index}>
            {message}
          </div>
        ))}
        {latestExchange?.reply === null ? <ChatLoading /> : null}
        {latestExchange?.reply ? <AiReply>{latestExchange.reply}</AiReply> : null}
        {scheduling ? <ChatLoading /> : null}
      </>
    );

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
                onAction={handleLayerAction}
              />

              <ContactCardLayer
                ref={contactCardLayerRef}
                candidate={selectedCandidate}
                isOpen={contactCardOpen}
              />
            </div>
          </div>
        </div>

        <div
          ref={sheetFooterRef}
          className={[
            "panel-footer",
            sheetMode ? "panel-footer--sheet" : "",
            sheetMode && sheetExpanded ? "is-expanded" : "",
            sheetMode && sheetSnap === 1 ? "is-peek" : "",
            sheetMode && sheetSnap === 2 ? "is-full" : "",
            sheetMode && sheetDragging ? "is-dragging" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {sheetMode ? (
            <button
              className="panel-sheet-handle"
              type="button"
              aria-label={sheetAriaLabel}
              aria-expanded={sheetSnap > 0}
              onPointerDown={handleSheetPointerDown}
              onPointerMove={handleSheetPointerMove}
              onPointerUp={handleSheetPointerUp}
              onPointerCancel={handleSheetPointerCancel}
            />
          ) : null}
          {sheetMode ? (
            <div
              ref={sheetBodyRef}
              className="panel-sheet-body"
              style={
                sheetExpanded && (sheetDragging || sheetSnap < 2)
                  ? { height: expandedBodyHeight, maxHeight: expandedBodyHeight }
                  : undefined
              }
            >
              {sheetSnap === 2 || (sheetDragging && expandedBodyHeight > 360)
                ? renderSheetFullHistory()
                : renderSheetPeekContent()}
            </div>
          ) : null}
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
