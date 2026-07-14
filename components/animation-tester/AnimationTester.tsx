"use client";

import { forwardRef, useEffect, useState } from "react";
import { AnimationSettings } from "@/lib/animation";
import { useAccordionCards } from "@/hooks/useAnimationSettings";

const EASE_OPTIONS = [
  { value: "power2", label: "Power2 (smooth)" },
  { value: "power4", label: "Power4 (sharp)" },
  { value: "back", label: "Back (overshoot)" },
  { value: "elastic", label: "Elastic (springy)" },
  { value: "bounce", label: "Bounce" },
  { value: "expo", label: "Expo (snappy)" },
  { value: "circ", label: "Circ" },
  { value: "sine", label: "Sine (gentle)" },
  { value: "easein", label: "Ease-in (simple)" },
  { value: "none", label: "None (linear)" },
];

interface AnimationTesterProps {
  isOpen: boolean;
  notifVisible: boolean;
  backOfficeOpen: boolean;
  settings: AnimationSettings;
  codeSnippets: { avatar: string; notif: string; panel: string; actionPanel: string };
  onTogglePanel: () => void;
  onTriggerNotif: () => void;
  onToggleBackOffice: () => void;
  onSettingsChange: (patch: Partial<AnimationSettings>) => void;
  onSaveDefault: () => void;
  formatDuration: (ms: number) => string;
}

export const AnimationTester = forwardRef<HTMLDivElement, AnimationTesterProps>(
  function AnimationTester(
    {
      isOpen,
      notifVisible,
      backOfficeOpen,
      settings,
      codeSnippets,
      onTogglePanel,
      onTriggerNotif,
      onToggleBackOffice,
      onSettingsChange,
      onSaveDefault,
      formatDuration,
    },
    ref
  ) {
    const { openCards, toggleCard } = useAccordionCards();
    const [savedConfirm, setSavedConfirm] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
      if (!savedConfirm) return;
      const t = setTimeout(() => setSavedConfirm(false), 1800);
      return () => clearTimeout(t);
    }, [savedConfirm]);

    const handleSaveDefault = () => {
      onSaveDefault();
      setSavedConfirm(true);
    };

    const slider = (
      key: keyof AnimationSettings,
      label: string,
      min: number,
      max: number,
      step: number
    ) => {
      const value = settings[key] as number;
      return (
        <div className="field">
          <label>{label}</label>
          <div className="slider-row">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onSettingsChange({ [key]: parseInt(e.target.value, 10) })}
            />
            <span className="slider-val">{formatDuration(value)}</span>
          </div>
        </div>
      );
    };

    const variantSelect = (
      key: keyof AnimationSettings,
      label: string
    ) => (
      <div className="field">
        <label>{label}</label>
        <select
          value={settings[key] as string}
          onChange={(e) => onSettingsChange({ [key]: e.target.value })}
        >
          {EASE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );

    const card = (
      id: string,
      title: string,
      dotColor: string,
      body: React.ReactNode
    ) => (
      <div className={`el-card${openCards[id] ? " open" : ""}`} id={`card-${id}`}>
        <div className="el-card-header" onClick={() => toggleCard(id)}>
          <div className="el-card-title">
            <span className="el-dot" style={{ background: dotColor }} />
            {title}
          </div>
          <span className="chevron">▼</span>
        </div>
        <div className="el-card-body">{body}</div>
      </div>
    );

    if (collapsed) {
      return (
        <button
          className="controls-reopen"
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Open animation tester"
          title="Open animation tester"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7h10M18 7h2M4 17h2M10 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="7" r="2.4" stroke="currentColor" strokeWidth="2" />
            <circle cx="8" cy="17" r="2.4" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      );
    }

    return (
      <div className="controls" ref={ref}>
        <div className="controls-header">
          <div className="controls-title">Animation tester</div>
          <button
            className="controls-close"
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Close animation tester"
            title="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <button
          className={`toggle-btn${isOpen ? " is-open" : ""}`}
          type="button"
          onClick={onTogglePanel}
        >
          {isOpen ? "Close panel" : "Open panel"}
        </button>

        <button
          className={`toggle-btn toggle-btn--secondary${backOfficeOpen ? " is-open" : ""}`}
          type="button"
          onClick={onToggleBackOffice}
        >
          {backOfficeOpen ? "Hide back-office slideout" : "Back-office slideout"}
        </button>

        {card(
          "avatar",
          "Avatar",
          "#4BD675",
          <>
            {variantSelect("avV", "Variant")}
            {slider("avD", "Duration", 100, 2000, 50)}
            {slider("avDel", "Delay", 0, 1500, 50)}
          </>
        )}

        {card(
          "notif",
          "Notification",
          "#B61200",
          <>
            <div className="field notif-trigger-row">
              <div className="notif-toggle-wrap">
                <span className="notif-toggle-label">{notifVisible ? "On" : "Off"}</span>
                <button
                  className={`notif-toggle-btn${notifVisible ? " visible" : ""}`}
                  type="button"
                  onClick={onTriggerNotif}
                >
                  {notifVisible ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {variantSelect("ntV", "Variant")}
            {slider("ntD", "Duration", 100, 2000, 50)}
            {slider("ntDel", "Delay", 0, 1500, 50)}
          </>
        )}

        {card(
          "panel",
          "Panel",
          "#4a86e8",
          <>
            {variantSelect("pnV", "Variant")}
            {slider("pnD", "Duration", 100, 2000, 50)}
            {slider("pnDel", "Delay", 0, 1500, 50)}
          </>
        )}

        {card(
          "action",
          "Action panel",
          "#9b59b6",
          <>
            {variantSelect("apV", "Variant")}
            {slider("apD", "Duration", 100, 2000, 50)}
            {slider("apDel", "Delay", 0, 1500, 50)}
          </>
        )}

        {card(
          "css",
          "CSS — last animation",
          "#aaa",
          <>
            <div className="css-block-label">Avatar</div>
            <div className="css-block">{codeSnippets.avatar}</div>
            <div className="css-block-label">Notification</div>
            <div className="css-block">{codeSnippets.notif}</div>
            <div className="css-block-label">Panel</div>
            <div className="css-block">{codeSnippets.panel}</div>
            <div className="css-block-label">Action panel</div>
            <div className="css-block">{codeSnippets.actionPanel}</div>
          </>
        )}

        <button
          className={`save-default-btn${savedConfirm ? " is-saved" : ""}`}
          type="button"
          onClick={handleSaveDefault}
        >
          {savedConfirm ? "Saved as default ✓" : "Save as default"}
        </button>
      </div>
    );
  }
);
