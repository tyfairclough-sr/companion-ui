"use client";

import { useCallback, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function useBlink(
  eyeLidRef: React.RefObject<SVGPathElement | null>,
  isOpen: boolean,
  animating: boolean
) {
  const blinkTlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const eyeLidEl = eyeLidRef.current;
      if (!eyeLidEl) return;

      blinkTlRef.current = gsap
        .timeline({
          paused: true,
          onComplete: () => {
            gsap.set(eyeLidEl, { scaleY: 1, rotation: 0 });
          },
        })
        .to(eyeLidEl, {
          scaleY: 0.05,
          rotation: 0.01,
          duration: 0.15,
          ease: "power2.in",
          svgOrigin: "32 28.9",
          overwrite: "auto",
        })
        .to(eyeLidEl, {
          scaleY: 1,
          rotation: 0.01,
          duration: 0.28,
          ease: "power2.out",
          svgOrigin: "32 28.9",
          overwrite: "auto",
        });
    },
    { dependencies: [eyeLidRef] }
  );

  const blink = useCallback(() => {
    if (isOpen || animating) return;
    blinkTlRef.current?.restart(true);
  }, [animating, isOpen]);

  return { blink };
}
