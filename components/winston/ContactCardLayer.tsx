"use client";

import { forwardRef, useEffect, useState } from "react";
import { CandidateDetailResponse } from "@/lib/types";
import { candidateInitials } from "@/lib/animation";

interface ContactCardLayerProps {
  candidate: CandidateDetailResponse | null;
  isOpen: boolean;
}

function emailFromName(name: string): string {
  const first = name.trim().split(/\s+/)[0]?.toLowerCase() ?? "contact";
  return `${first}97@gmail.com`;
}

export const ContactCardLayer = forwardRef<HTMLDivElement, ContactCardLayerProps>(
  function ContactCardLayer({ candidate, isOpen }, ref) {
    const [otherOpen, setOtherOpen] = useState(false);

    useEffect(() => {
      setOtherOpen(false);
    }, [candidate?.id]);

    if (!candidate && !isOpen) {
      return <div className="contact-card-layer" ref={ref} />;
    }

    return (
      <div className="contact-card-layer" ref={ref}>
        <div className="contact-card-scroll">
          {candidate ? (
            <div className="contact-card">
              <div className="contact-card-head">
                <div className="contact-avatar">{candidateInitials(candidate.name)}</div>
                <div className="contact-head-main">
                  <div className="contact-name">{candidate.name}</div>
                  {candidate.subtitle ? (
                    <div className="contact-subtitle">{candidate.subtitle}</div>
                  ) : null}
                </div>
                <div className="contact-badges">
                  <span className="contact-badge contact-badge-grey">{candidate.badgeType}</span>
                  <span className="contact-badge contact-badge-link">Referral</span>
                </div>
              </div>

              <div className="contact-socials">
                <a className="contact-social-btn" href="#" aria-label="X (Twitter)" onClick={(e) => e.preventDefault()}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                  </svg>
                </a>
                <a className="contact-social-btn" href="#" aria-label="Facebook" onClick={(e) => e.preventDefault()}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
                  </svg>
                </a>
                <a className="contact-social-btn" href="#" aria-label="LinkedIn" onClick={(e) => e.preventDefault()}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 4.126 0 2.063 2.063 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a className="contact-social-btn" href="#" aria-label="Website" onClick={(e) => e.preventDefault()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </a>
              </div>

              <div className="contact-meta">
                <div className="contact-meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{candidate.address}</span>
                </div>
                <div className="contact-meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>(123) 123-1234</span>
                </div>
              </div>

              <div className="contact-links">
                <a className="contact-link" href={`mailto:${emailFromName(candidate.name)}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                  {emailFromName(candidate.name)}
                </a>
                <a className="contact-link" href="#" onClick={(e) => e.preventDefault()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  Latest Resume
                </a>
              </div>

              <div className="contact-other">
                <button
                  className="contact-other-toggle"
                  type="button"
                  aria-expanded={otherOpen}
                  onClick={() => setOtherOpen((prev) => !prev)}
                >
                  <svg className="contact-other-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  Other applications
                  <svg className={`contact-other-chevron${otherOpen ? " open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {otherOpen ? (
                  <div className="contact-other-list">
                    <div className="contact-other-empty">No other applications yet.</div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);
