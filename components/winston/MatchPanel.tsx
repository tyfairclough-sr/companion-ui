"use client";

import { useState } from "react";

interface MatchPanelProps {
  position: string;
}

type RatingLevel = "high" | "medium" | "low";

interface SkillRow {
  name: string;
  jobAd: boolean;
  applicant: boolean;
  confidence: number; // 0–CONFIDENCE_SEGMENTS
}

const CONFIDENCE_SEGMENTS = 8;

const TECHNICAL_SKILLS: SkillRow[] = Array.from({ length: 15 }, (_, i) => ({
  name: "skillName",
  jobAd: true,
  applicant: i < 7,
  confidence: Math.max(0, CONFIDENCE_SEGMENTS - i),
}));

const TRANSFERABLE_SKILLS: SkillRow[] = Array.from({ length: 5 }, (_, i) => ({
  name: "skillName",
  jobAd: true,
  applicant: true,
  confidence: Math.max(1, CONFIDENCE_SEGMENTS - i),
}));

function CheckIcon() {
  return (
    <svg className="mp-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="mp-cross" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="mp-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="mp-confidence" aria-label={`Confidence ${value} of ${CONFIDENCE_SEGMENTS}`}>
      {Array.from({ length: CONFIDENCE_SEGMENTS }, (_, i) => (
        <span key={i} className={`mp-confidence-seg${i < value ? " filled" : ""}`} />
      ))}
    </div>
  );
}

function RatingBadge({ level, label }: { level: RatingLevel; label: string }) {
  return <span className={`mp-rating mp-rating--${level}`}>{label}</span>;
}

function SkillsTable({ rows }: { rows: SkillRow[] }) {
  return (
    <div className="mp-table">
      <div className="mp-table-head">
        <span className="mp-col-rank" />
        <span className="mp-col-skill">Skill</span>
        <span className="mp-col-mark">
          Job Ad <InfoIcon />
        </span>
        <span className="mp-col-mark">
          Applicant <InfoIcon />
        </span>
        <span className="mp-col-conf">
          Confidence <InfoIcon />
        </span>
      </div>
      {rows.map((row, i) => (
        <div className="mp-table-row" key={i}>
          <span className="mp-col-rank">#{i + 1}</span>
          <span className="mp-col-skill">{row.name}</span>
          <span className="mp-col-mark">{row.jobAd ? <CheckIcon /> : <CrossIcon />}</span>
          <span className="mp-col-mark">{row.applicant ? <CheckIcon /> : <CrossIcon />}</span>
          <span className="mp-col-conf">
            <ConfidenceBar value={row.confidence} />
          </span>
        </div>
      ))}
    </div>
  );
}

function Collapsible({
  title,
  description,
  defaultOpen = true,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`mp-collapsible${open ? " open" : ""}`}>
      <button className="mp-collapsible-head" type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="mp-collapsible-title">{title}</span>
        <svg className="mp-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div className="mp-collapsible-body">
          {description ? <p className="mp-muted">{description}</p> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function MatchPanel({ position }: MatchPanelProps) {
  return (
    <div className="mp" role="tabpanel">
      {/* ── Shortlist recommendation ── */}
      <section className="mp-reco">
        <h2 className="mp-reco-title">Shortlist Recommendation</h2>
        <p className="mp-reco-summary">
          <span className="mp-rank-pill">
            <CheckIcon />3
          </span>
          The candidate ranks <strong>high</strong> compared to typical applicants for the {position} position.
        </p>

        <div className="mp-reco-cards">
          <article className="mp-reco-card">
            <div className="mp-reco-card-head">
              <span className="mp-reco-card-title">Skills</span>
              <RatingBadge level="high" label="High" />
            </div>
            <p className="mp-reco-card-text">
              They demonstrate very high proficiency in Data Analysis, Biostatistics, Data Visualization, Statistical
              Analysis and Project Management. There are no significant skills gaps noted.
            </p>
          </article>

          <article className="mp-reco-card">
            <div className="mp-reco-card-head">
              <span className="mp-reco-card-title">Experience</span>
              <RatingBadge level="high" label="High" />
            </div>
            <p className="mp-reco-card-text">
              Their work experience, including positions as a meteorologist at the Environmental Protection Agency for
              over 6 years and as a hydrologist at Stantec for nearly 3 years, is a medium fit for this role.
            </p>
          </article>

          <article className="mp-reco-card">
            <div className="mp-reco-card-head">
              <span className="mp-reco-card-title">
                <svg className="mp-reco-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                  <path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" />
                </svg>
                Education
              </span>
              <RatingBadge level="medium" label="Medium" />
            </div>
            <p className="mp-reco-card-text">
              Their education is very similar to that of individuals in this type of role.
            </p>
          </article>
        </div>

        <div className="mp-reco-updated">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          Updated at: 03 Jun 2025
        </div>
      </section>

      {/* ── Skills: High ── */}
      <section className="mp-section">
        <div className="mp-section-head">
          <span className="mp-section-dot" />
          <h3 className="mp-section-title">
            Skills: <span className="mp-section-rating">High</span>
          </h3>
        </div>
        <p className="mp-muted">Winston&apos;s evaluation of thousands of skills prioritised by the default Job Ad</p>

        <div className="mp-stats">
          <div className="mp-stat">
            <div className="mp-stat-value">7 of 15</div>
            <div className="mp-stat-label">Technical skills</div>
            <p className="mp-stat-desc">Very high matches in top 15 ranked technical skills</p>
          </div>
          <div className="mp-stat">
            <div className="mp-stat-value">5 of 5</div>
            <div className="mp-stat-label">Transferable skills</div>
            <p className="mp-stat-desc">High or better matches for 5 ranked personal characteristics</p>
          </div>
        </div>

        <Collapsible
          title="Technical skills"
          description="Winston's evaluation of thousands of skills prioritised by the default Job Ad"
        >
          <SkillsTable rows={TECHNICAL_SKILLS} />
        </Collapsible>

        <Collapsible
          title="Additional transferable skills"
          description="In addition to technical skills Winston also evaluates personal characteristics prioritised by the default Job Ad"
        >
          <SkillsTable rows={TRANSFERABLE_SKILLS} />
        </Collapsible>
      </section>

      {/* ── Experience: Very high ── */}
      <section className="mp-section">
        <div className="mp-section-head">
          <span className="mp-section-dot" />
          <h3 className="mp-section-title">
            Experience: <span className="mp-section-rating">Very high</span>
          </h3>
        </div>
        <p className="mp-muted">
          Their work history closely matches the seniority and responsibilities expected for this role.
        </p>
      </section>

      {/* ── Education: Medium ── */}
      <section className="mp-section">
        <div className="mp-section-head">
          <span className="mp-section-dot" />
          <h3 className="mp-section-title">
            Education: <span className="mp-section-rating">Medium</span>
          </h3>
        </div>

        <div className="mp-edu">
          <div className="mp-edu-gauge">
            <span className="mp-edu-chip">WS</span>
            <div className="mp-edu-track">
              <span className="mp-edu-marker" />
            </div>
            <svg className="mp-edu-cap" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 10 12 5 2 10l10 5 10-5Z" />
              <path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" />
            </svg>
          </div>
          <div className="mp-edu-meets">Meets job requirement</div>
          <div className="mp-edu-labels">
            <div className="mp-edu-label">
              <span className="mp-edu-label-title">Highest level of education</span>
              <span className="mp-edu-label-value">High school</span>
            </div>
            <div className="mp-edu-label mp-edu-label--right">
              <span className="mp-edu-label-title">Job requirement</span>
              <span className="mp-edu-label-value">High school</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
