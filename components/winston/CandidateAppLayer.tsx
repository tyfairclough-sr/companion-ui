"use client";

import { forwardRef, useEffect, useState } from "react";
import { CandidateDetailResponse } from "@/lib/types";
import { candidateInitials } from "@/lib/animation";
import { useSkeletonReveal } from "@/hooks/useSkeletonReveal";
import { CandidateAppSkeleton } from "./skeletons/LayerSkeletons";
import { MatchPanel } from "./MatchPanel";
import { ScreeningPanel } from "./ScreeningPanel";

type CandidateTab = "Overview" | "Screening" | "Match";

interface CandidateAppLayerProps {
  candidate: CandidateDetailResponse | null;
  isOpen: boolean;
  onContact: () => void;
}

export const CandidateAppLayer = forwardRef<HTMLDivElement, CandidateAppLayerProps>(
  function CandidateAppLayer({ candidate, isOpen, onContact }, ref) {
    const [profileView, setProfileView] = useState<"Profile" | "Resume">("Profile");
    const [activeTab, setActiveTab] = useState<CandidateTab>("Overview");
    const isLoading = useSkeletonReveal({
      enabled: isOpen,
      ready: !!candidate,
      resetKey: candidate?.id ?? null,
    });

    useEffect(() => {
      setActiveTab("Overview");
    }, [candidate?.id]);

    if (!candidate && !isOpen) {
      return <div className="candidate-app-layer" ref={ref} />;
    }

    return (
      <div className="candidate-app-layer" ref={ref}>
        <div className="candidate-app-scroll">
          {isLoading ? (
            <CandidateAppSkeleton />
          ) : candidate ? (
          <div className="ca-card">
            <div className="cc-header">
              <div className="cc-avatar">{candidateInitials(candidate.name)}</div>
              <div className="cc-header-main">
                <div className="cc-title">{candidate.name}</div>
                <div className="cc-subline">
                  <span className="cc-subtitle">{candidate.subtitle}</span>
                  <span className="cc-badge cc-badge-grey">{candidate.badgeType}</span>
                  <span className="cc-secondary-text">Secondary text</span>
                </div>
              </div>
              <div className="cc-header-actions">
                <button className="cc-contact-btn" type="button" onClick={onContact}>
                  Contact
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                    <path d="M3 21v-1a6 6 0 0 1 6-6h2" />
                    <path d="M19 14v6M22 17h-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="ca-tabs" role="tablist" aria-label="Application sections">
              <button
                className={`ca-tab${activeTab === "Overview" ? " active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeTab === "Overview"}
                onClick={() => setActiveTab("Overview")}
              >
                Overview
              </button>
              <button
                className={`ca-tab${activeTab === "Screening" ? " active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeTab === "Screening"}
                onClick={() => setActiveTab("Screening")}
              >
                Screening
              </button>
              <button
                className={`ca-tab${activeTab === "Match" ? " active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeTab === "Match"}
                onClick={() => setActiveTab("Match")}
              >
                Match
                <span className="ca-tab-icon" aria-label="AI">
                  <svg className="ca-tab-icon-spark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  </svg>
                  <span className="ca-tab-icon-label">AI</span>
                </span>
              </button>
            </div>

            {activeTab === "Overview" ? (
            <>
            <div className="ca-controls">
              <div className="ca-segment" role="group" aria-label="Profile view">
                <button
                  className={`ca-segment-btn${profileView === "Profile" ? " active" : ""}`}
                  type="button"
                  onClick={() => setProfileView("Profile")}
                >
                  Profile
                </button>
                <button
                  className={`ca-segment-btn${profileView === "Resume" ? " active" : ""}`}
                  type="button"
                  onClick={() => setProfileView("Resume")}
                >
                  Resume
                </button>
              </div>
              <a className="ca-linkedin" href="#" onClick={(e) => e.preventDefault()}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 4.126 0 2.063 2.063 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>

            {profileView === "Resume" ? (
            <div className="ca-resume">
              <img className="ca-resume-img" src="/candidate-resume.png" alt={`${candidate.name} resume`} />
            </div>
            ) : (
            <div className="ca-body">
              <section className="ca-section">
                <h2 className="ca-section-title">Experience</h2>
                {candidate.experience.map((entry) => (
                  <article className="ca-entry" key={entry.id}>
                    <div className="ca-entry-date">{entry.dateRange}</div>
                    <div className="ca-entry-title">{entry.title}</div>
                    <div className="ca-entry-sub">{entry.company}</div>
                    <p className="ca-entry-desc">
                      {entry.description}
                      <button className="ca-show-more" type="button">
                        Show more
                      </button>
                    </p>
                  </article>
                ))}
              </section>

              <section className="ca-section">
                <h2 className="ca-section-title">Education</h2>
                {candidate.education.map((entry) => (
                  <article className="ca-entry" key={entry.id}>
                    <div className="ca-entry-date">{entry.dateRange}</div>
                    <div className="ca-entry-title">{entry.degree}</div>
                    <div className="ca-entry-sub">{entry.school}</div>
                  </article>
                ))}
              </section>
            </div>
            )}
            </>
            ) : activeTab === "Match" ? (
              <MatchPanel position="Senior Sales Engineer" />
            ) : (
              <ScreeningPanel />
            )}
          </div>
          ) : null}
        </div>
        {!isLoading && candidate ? (
          <div className="ca-floating-actions">
            <button className="ca-action-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6M22 11h-6" />
              </svg>
              Label
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <button className="ca-action-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6M22 11h-6" />
              </svg>
              Label
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    );
  }
);
