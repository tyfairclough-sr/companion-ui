export const EASE = {
  power2: { show: "power2.out", hide: "power2.in" },
  power4: { show: "power4.out", hide: "power4.in" },
  back: { show: "back.out(1.7)", hide: "back.in(1.7)" },
  elastic: { show: "elastic.out(1,0.5)", hide: "power3.in" },
  bounce: { show: "bounce.out", hide: "power2.in" },
  expo: { show: "expo.out", hide: "expo.in" },
  circ: { show: "circ.out", hide: "circ.in" },
  sine: { show: "sine.out", hide: "sine.in" },
  none: { show: "none", hide: "none" },
} as const;

export type EaseVariant = keyof typeof EASE;

export function easeFor(variant: string, dir: "show" | "hide"): string {
  const e = EASE[variant as EaseVariant] ?? EASE.power2;
  return dir === "show" ? e.show : e.hide;
}

export const PANEL_HIDE_X = 500;
export const AVATAR_EXIT_X = 144;
export const JOB_LIST_SLIDE = 420;
export const CANDIDATE_SLIDE = 420;

export function candidateInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function formatDuration(ms: number): string {
  return (ms / 1000).toFixed(2) + "s";
}

export interface AnimationSettings {
  avV: string;
  avD: number;
  avDel: number;
  ntV: string;
  ntD: number;
  ntDel: number;
  pnV: string;
  pnD: number;
  pnDel: number;
}

export const DEFAULT_ANIMATION_SETTINGS: AnimationSettings = {
  avV: "power2",
  avD: 400,
  avDel: 0,
  ntV: "power2",
  ntD: 300,
  ntDel: 0,
  pnV: "power2",
  pnD: 450,
  pnDel: 0,
};

const DEFAULT_SETTINGS_STORAGE_KEY = "winston-animation-defaults";

// User-saved defaults persist in localStorage so they survive reloads/app runs.
// Falls back to the built-in defaults when nothing is stored or storage is
// unavailable (e.g. during server-side rendering).
export function loadStoredDefaults(): AnimationSettings {
  if (typeof window === "undefined") return DEFAULT_ANIMATION_SETTINGS;
  try {
    const raw = window.localStorage.getItem(DEFAULT_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_ANIMATION_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AnimationSettings>;
    return { ...DEFAULT_ANIMATION_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_ANIMATION_SETTINGS;
  }
}

export function saveStoredDefaults(settings: AnimationSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DEFAULT_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore write failures (e.g. storage disabled or quota exceeded).
  }
}

export function tweenSnippet(
  target: string,
  props: Record<string, string | number>,
  dur: number,
  ease: string,
  delay: number
): string {
  const parts = Object.entries(props).map(([k, v]) => `${k}: ${v}`);
  parts.push(`duration: ${dur.toFixed(2)}`);
  if (delay > 0) parts.push(`delay: ${delay.toFixed(2)}`);
  parts.push(`ease: "${ease}"`);
  return `gsap.to("${target}", {\n  ${parts.join(",\n  ")}\n});`;
}
