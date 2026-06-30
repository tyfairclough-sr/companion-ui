"use client";

import { useState } from "react";

type ScreeningView = "Initial" | "Follow-up";

type Tone = "positive" | "negative" | "neutral" | "smiley" | "dot";

interface ScreenQuestion {
  question: string;
  answer: string;
  tone: Tone;
  ai?: boolean;
}

/* ── Static placeholder content (mirrors the Figma design) ── */

const SCREENING_QUESTIONS: { question: string; answer: string }[] = [
  { question: "Are you eligible to work in the USA?", answer: "Yes" },
  { question: "If yes, select your visa type", answer: "US Citizen" },
  { question: "Have you previously been employed by Knotz?", answer: "No" },
  { question: "Do you have Veteran status?", answer: "No" },
];

const WINSTON_SCREEN: ScreenQuestion[] = [
  {
    question: "What are your preferred work hours?",
    answer: "From 09:00AM to 06:00PM; From 12:00AM to 06:00 AM",
    tone: "positive",
    ai: true,
  },
  {
    question: "When is the soonest you can start?",
    answer: "From tomorrow",
    tone: "smiley",
    ai: true,
  },
  {
    question: "How many years experience do you have in sales?",
    answer: "2 years and 8 months",
    tone: "negative",
    ai: true,
  },
  {
    question: "Where are you based?",
    answer: "-",
    tone: "neutral",
  },
  {
    question: "Can you tell me if you carry a US driving license that permits you to commute to the store?",
    answer: "Yes",
    tone: "positive",
  },
];

const FOLLOW_UP_QUESTIONS: ScreenQuestion[] = [
  {
    question: "What are your preferred work hours?",
    answer: "From 09:00AM to 06:00PM; From 12:00AM to 06:00 AM",
    tone: "positive",
  },
  {
    question: "When is the soonest you can start?",
    answer: "3 months time",
    tone: "negative",
  },
  {
    question: "How many years experience do you have in sales?",
    answer: "220 years and 8 months",
    tone: "positive",
  },
  {
    question: "Where are you based?",
    answer: "-",
    tone: "neutral",
  },
  {
    question: "What is your favourite pizza topping",
    answer: "Pineapple",
    tone: "dot",
  },
  {
    question: "Can you tell me if you carry a US driving license that permits you to commute to the store?",
    answer: "Yes",
    tone: "positive",
  },
];

const CONVERSATION_SUMMARY =
  "Izmet demonstrated a strong command of product strategy, using clear data and ethical frameworks to guide roadmap decisions and mitigate risks. She shows collaborative leadership in taking products from discovery to launch, effectively managing cross-functional teams and balancing competing stakeholder priorities while keeping a clear product vision throughout.";

/* ── Icons ── */

function ToneIcon({ tone }: { tone: Tone }) {
  if (tone === "dot") {
    return (
      <svg className="scr-tone scr-tone--dot" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="5" fill="currentColor" />
      </svg>
    );
  }
  if (tone === "neutral") {
    return (
      <svg className="scr-tone scr-tone--neutral" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12h8" />
      </svg>
    );
  }
  if (tone === "smiley") {
    return (
      <svg className="scr-tone scr-tone--smiley" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <path d="M9 9.5h.01M15 9.5h.01" />
      </svg>
    );
  }
  if (tone === "negative") {
    return (
      <svg className="scr-tone scr-tone--negative" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    );
  }
  return (
    <svg className="scr-tone scr-tone--positive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function AiBadge() {
  return <span className="scr-ai">AI</span>;
}

function PaperPlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5L16 9" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function JumpToIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4l11 8-11 8V4z" />
      <path d="M19 5v14" />
    </svg>
  );
}

/* ── Shared question row ── */

function QuestionRow({ item, showAction }: { item: ScreenQuestion; showAction?: boolean }) {
  return (
    <li className="scr-question">
      <span className="scr-q-icon">
        <ToneIcon tone={item.tone} />
      </span>
      <div className="scr-q-main">
        <div className="scr-q-text">
          <span>{item.question}</span>
          {item.ai ? <AiBadge /> : null}
        </div>
        <div className="scr-q-answer">{item.answer}</div>
      </div>
      {showAction ? (
        <button className="scr-q-action" type="button" aria-label="View in conversation">
          <JumpToIcon />
        </button>
      ) : null}
    </li>
  );
}

/* ── Views ── */

function InitialView() {
  return (
    <>
      <section className="scr-section">
        <h2 className="scr-heading">Screening questions</h2>
        <dl className="scr-qa-list">
          {SCREENING_QUESTIONS.map((qa) => (
            <div className="scr-qa" key={qa.question}>
              <dt className="scr-qa-q">{qa.question}</dt>
              <dd className="scr-qa-a">{qa.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <hr className="scr-divider" />

      <section className="scr-section">
        <h2 className="scr-heading">Winston Screen</h2>
        <ul className="scr-questions">
          {WINSTON_SCREEN.map((item) => (
            <QuestionRow item={item} key={item.question} />
          ))}
        </ul>
      </section>
    </>
  );
}

function FollowUpView() {
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  return (
    <>
      <div className="scr-assistant-head">
        <div className="scr-assistant-title">
          Interview Assistant
          <span className="scr-plus-ai">+AI</span>
        </div>
        <button className="scr-view-convo" type="button">
          <PaperPlaneIcon />
          View conversation
        </button>
      </div>

      <section className="scr-summary">
        <h3 className="scr-subheading">Conversation summary</h3>
        <p className={`scr-summary-text${summaryExpanded ? " expanded" : ""}`}>{CONVERSATION_SUMMARY}</p>
        <button className="scr-show-more" type="button" onClick={() => setSummaryExpanded((v) => !v)} aria-expanded={summaryExpanded}>
          <PlusIcon />
          {summaryExpanded ? "Show less" : "Show more"}
        </button>
      </section>

      <div className="scr-status-row">
        <span className="scr-status-label">Status</span>
        <span className="scr-status-value">
          <CheckCircleIcon />
          Answered
        </span>
      </div>

      <div className="scr-meta-row">
        <span className="scr-meta">Last edit was made on Nov 14, 2023 1:03 AM</span>
        <button className="scr-versions" type="button">
          See versions
          <ChevronIcon />
        </button>
      </div>

      <ul className="scr-questions">
        {FOLLOW_UP_QUESTIONS.map((item) => (
          <QuestionRow item={item} showAction key={item.question} />
        ))}
      </ul>
    </>
  );
}

export function ScreeningPanel() {
  const [view, setView] = useState<ScreeningView>("Initial");

  return (
    <div className="scr" role="tabpanel">
      <div className="scr-segment" role="group" aria-label="Screening view">
        <button
          className={`scr-segment-btn${view === "Initial" ? " active" : ""}`}
          type="button"
          aria-pressed={view === "Initial"}
          onClick={() => setView("Initial")}
        >
          Initial screen
        </button>
        <button
          className={`scr-segment-btn${view === "Follow-up" ? " active" : ""}`}
          type="button"
          aria-pressed={view === "Follow-up"}
          onClick={() => setView("Follow-up")}
        >
          Follow-up screen
          <span className="scr-seg-ai">AI</span>
        </button>
      </div>

      {view === "Initial" ? <InitialView /> : <FollowUpView />}
    </div>
  );
}
