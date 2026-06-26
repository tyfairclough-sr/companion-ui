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
  { value: "none", label: "None (linear)" },
];

interface AnimationTesterProps {
  isOpen: boolean;
  notifVisible: boolean;
  settings: AnimationSettings;
  codeSnippets: { avatar: string; notif: string; panel: string };
  onTogglePanel: () => void;
  onTriggerNotif: () => void;
  onSettingsChange: (patch: Partial<AnimationSettings>) => void;
  onSaveDefault: () => void;
  formatDuration: (ms: number) => string;
}

export const AnimationTester = forwardRef<HTMLDivElement, AnimationTesterProps>(
  function AnimationTester(
    {
      isOpen,
      notifVisible,
      settings,
      codeSnippets,
      onTogglePanel,
      onTriggerNotif,
      onSettingsChange,
      onSaveDefault,
      formatDuration,
    },
    ref
  ) {
    const { openCards, toggleCard } = useAccordionCards();
    const [savedConfirm, setSavedConfirm] = useState(false);

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

    return (
      <div className="controls" ref={ref}>
        <div className="controls-title">Animation tester</div>

        <button
          className={`toggle-btn${isOpen ? " is-open" : ""}`}
          type="button"
          onClick={onTogglePanel}
        >
          {isOpen ? "Close panel" : "Open panel"}
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
