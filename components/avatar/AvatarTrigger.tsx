"use client";

import { forwardRef, useRef } from "react";
import { useBlink } from "@/hooks/useBlink";

interface AvatarTriggerProps {
  isOpen: boolean;
  animating: boolean;
  onToggle: () => void;
  notifRef: React.RefObject<SVGSVGElement | null>;
}

export const AvatarTrigger = forwardRef<HTMLDivElement, AvatarTriggerProps>(
  function AvatarTrigger({ isOpen, animating, onToggle, notifRef }, ref) {
    const eyeLidRef = useRef<SVGPathElement>(null);
    const { blink } = useBlink(eyeLidRef, isOpen, animating);

    return (
      <div
        className="avatar-wrap"
        ref={ref}
        onClick={onToggle}
        onMouseEnter={blink}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-label="Toggle Winston panel"
      >
        <svg
          className="avatar"
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <clipPath id="eyeClip" clipPathUnits="userSpaceOnUse">
              <use href="#eyeLid" xlinkHref="#eyeLid" />
            </clipPath>
          </defs>
          <rect width="64" height="64" rx="32" fill="white" />
          <path
            d="M4 32C4 16.536 16.536 4 32 4V4C47.464 4 60 16.536 60 32V32C60 47.464 47.464 60 32 60V60C16.536 60 4 47.464 4 32V32Z"
            fill="#4BD675"
          />
          <path
            id="eyeLid"
            ref={eyeLidRef}
            d="M42.5607 45.0578C44.3384 45.0578 45.9986 44.0654 46.911 42.4172C48.5523 39.4528 49.5 35.9646 49.5 32.2272C49.5 21.4707 41.6647 12.7501 32 12.7501C22.3353 12.7501 14.5 21.4707 14.5 32.2272C14.5 35.9646 15.4477 39.4528 17.089 42.4172C18.0014 44.0654 19.6616 45.0578 21.4393 45.0578C21.4393 45.0578 27.8749 45.0578 32 45.0578C36.1251 45.0578 42.5654 45.0578 42.5654 45.0578H42.5607Z"
            fill="white"
          />
          <path
            id="avatarEye"
            clipPath="url(#eyeClip)"
            d="M38.8899 39.4732C40.0498 39.4732 41.1329 38.9096 41.7282 37.9735C42.799 36.2901 43.4173 34.3091 43.4173 32.1866C43.4173 26.078 38.3054 21.1256 31.9999 21.1256C25.6944 21.1256 20.5825 26.078 20.5825 32.1866C20.5825 34.3091 21.2008 36.2901 22.2717 37.9735C22.8669 38.9096 23.9501 39.4732 25.1099 39.4732C25.1099 39.4732 29.3028 38.9997 31.9999 38.9996C34.6969 38.9995 38.893 39.4732 38.893 39.4732H38.8899Z"
            fill="#0F2333"
          />
        </svg>
        <svg
          className="notif-dot"
          ref={notifRef}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1Z"
            fill="#B61200"
          />
          <path
            d="M8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1Z"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }
);
