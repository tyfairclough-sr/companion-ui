"use client";

import { forwardRef } from "react";

export const BackOfficeSlideout = forwardRef<HTMLDivElement>(
  function BackOfficeSlideout(_props, ref) {
    return (
      <div className="back-office-panel" ref={ref} aria-hidden="true">
        <header className="back-office-header">
          <div className="skeleton-block back-office-header-title" />
          <div className="back-office-header-actions">
            <div className="skeleton-block back-office-header-icon" />
            <div className="skeleton-block back-office-header-icon" />
          </div>
        </header>

        <div className="back-office-body">
          <div className="skeleton-card">
            <div className="skeleton-line title" />
            <div className="skeleton-line long" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line short" />
          </div>

          <div className="skeleton-card fill">
            {Array.from({ length: 5 }).map((_, i) => (
              <div className="skeleton-row" key={i}>
                <div className="skeleton-circle sm" />
                <div className="skeleton-stack">
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            ))}
          </div>

          <div className="skeleton-card">
            <div className="skeleton-line title" />
            <div className="skeleton-grid back-office-tiles">
              <div className="skeleton-tile" />
              <div className="skeleton-tile" />
            </div>
          </div>

          <div className="skeleton-card">
            <div className="skeleton-line title" />
            <div className="skeleton-line full" />
            <div className="skeleton-line long" />
            <div className="skeleton-line medium" />
            <div className="skeleton-line full" />
            <div className="skeleton-line short" />
          </div>
        </div>
      </div>
    );
  }
);
