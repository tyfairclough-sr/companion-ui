"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface WelcomeViewProps {
  /** Panel is open — drives the staggered entrance. */
  isOpen: boolean;
  /** Welcome has been dismissed (first prompt sent) — drives the exit. */
  dismissed: boolean;
  /** First name shown in the greeting. */
  name?: string;
  /** Fired once the exit (slide-up + fade) animation finishes. */
  onExited?: () => void;
}

const ENTER_DURATION = 0.25;
const ENTER_STAGGER = 0.06;
const EXIT_DURATION = 0.25;

export function WelcomeView({ isOpen, dismissed, name = "Candice", onExited }: WelcomeViewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const dismissedRef = useRef(false);

  // Staggered entrance: replays each time the slideout opens (while not dismissed).
  useEffect(() => {
    const root = rootRef.current;
    const items = itemsRef.current;
    if (!root || !items) return;
    if (dismissedRef.current) return;

    const children = Array.from(items.children) as HTMLElement[];

    if (!isOpen) {
      // Reset to the pre-entrance state so the next open re-animates.
      gsap.set(root, { autoAlpha: 1, y: 0 });
      gsap.set(children, { autoAlpha: 0, y: -12 });
      return;
    }

    gsap.set(root, { autoAlpha: 1, y: 0 });
    const tween = gsap.fromTo(
      children,
      { autoAlpha: 0, y: -12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: ENTER_DURATION,
        stagger: ENTER_STAGGER,
        ease: "power2.out",
      }
    );
    return () => {
      tween.kill();
    };
  }, [isOpen]);

  // Exit: quick slide-up + fade when the first prompt is sent.
  useEffect(() => {
    if (!dismissed || dismissedRef.current) return;
    dismissedRef.current = true;

    const root = rootRef.current;
    if (!root) {
      onExited?.();
      return;
    }

    const tween = gsap.to(root, {
      autoAlpha: 0,
      y: -16,
      duration: EXIT_DURATION,
      ease: "power2.in",
      onComplete: () => onExited?.(),
    });
    return () => {
      tween.kill();
    };
  }, [dismissed, onExited]);

  return (
    <div className="winston-welcome" ref={rootRef} aria-hidden="true">
      <div className="winston-welcome-hero">
        <div className="winston-welcome-items" ref={itemsRef}>
          <img
            className="winston-welcome-mascot"
            src="/winston-welcome-illustration.png"
            alt=""
            draggable={false}
          />
          <div className="winston-welcome-greeting">
            Hey {name} <span className="winston-welcome-wave">👋</span>
          </div>
          <h2 className="winston-welcome-heading">How can I help you?</h2>
          <div className="winston-welcome-example">
            Talk to me naturally. For example, &ldquo;what are my tasks for today?&rdquo;
          </div>
        </div>
      </div>
    </div>
  );
}
