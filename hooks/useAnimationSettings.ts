"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  AnimationSettings,
  DEFAULT_ANIMATION_SETTINGS,
  formatDuration,
  tweenSnippet,
  easeFor,
  AVATAR_EXIT_X,
  PANEL_HIDE_X,
  loadStoredDefaults,
  saveStoredDefaults,
} from "@/lib/animation";

function parseSettings(
  searchParams: URLSearchParams,
  defaults: AnimationSettings
): AnimationSettings {
  const num = (key: string, fallback: number) => {
    const v = searchParams.get(key);
    return v ? parseInt(v, 10) : fallback;
  };
  const str = (key: string, fallback: string) => searchParams.get(key) ?? fallback;

  return {
    avV: str("avV", defaults.avV),
    avD: num("avD", defaults.avD),
    avDel: num("avDel", defaults.avDel),
    ntV: str("ntV", defaults.ntV),
    ntD: num("ntD", defaults.ntD),
    ntDel: num("ntDel", defaults.ntDel),
    pnV: str("pnV", defaults.pnV),
    pnD: num("pnD", defaults.pnD),
    pnDel: num("pnDel", defaults.pnDel),
  };
}

export function computeCodeSnippets(
  settings: AnimationSettings,
  isOpen: boolean,
  notifVisible: boolean
) {
  const avDur = settings.avD / 1000;
  const avDelay = settings.avDel / 1000;
  const ntDur = settings.ntD / 1000;
  const ntDelay = settings.ntDel / 1000;
  const pnDur = settings.pnD / 1000;
  const pnDelay = settings.pnDel / 1000;

  const avProps = isOpen ? { x: 0, autoAlpha: 1 } : { x: AVATAR_EXIT_X, autoAlpha: 0 };
  const avEase = isOpen ? easeFor(settings.avV, "show") : easeFor(settings.avV, "hide");

  const pnProps = isOpen ? { x: PANEL_HIDE_X, autoAlpha: 0 } : { x: 0, autoAlpha: 1 };
  const pnEase = isOpen ? easeFor(settings.pnV, "hide") : easeFor(settings.pnV, "show");

  const ntProps = notifVisible ? { scale: 0, autoAlpha: 0 } : { scale: 1, autoAlpha: 1 };
  const ntEase = notifVisible ? easeFor(settings.ntV, "hide") : easeFor(settings.ntV, "show");

  return {
    avatar: tweenSnippet(".avatar-wrap", avProps, avDur, avEase, avDelay),
    notif: tweenSnippet(".notif-dot", ntProps, ntDur, ntEase, ntDelay),
    panel: tweenSnippet(".panel", pnProps, pnDur, pnEase, pnDelay),
  };
}

export function useAnimationSettings(isOpen: boolean, notifVisible: boolean) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Defaults loaded from localStorage; start with built-ins so the first
  // (server-matching) render is stable, then hydrate from storage on mount.
  const [storedDefaults, setStoredDefaults] = useState<AnimationSettings>(
    DEFAULT_ANIMATION_SETTINGS
  );

  useEffect(() => {
    setStoredDefaults(loadStoredDefaults());
  }, []);

  const settings = useMemo(
    () => parseSettings(searchParams, storedDefaults),
    [searchParams, storedDefaults]
  );

  const saveAsDefault = useCallback(() => {
    saveStoredDefaults(settings);
    setStoredDefaults(settings);
  }, [settings]);

  const updateSettings = useCallback(
    (patch: Partial<AnimationSettings>) => {
      const next = { ...settings, ...patch };
      const params = new URLSearchParams({
        avV: next.avV,
        avD: String(next.avD),
        avDel: String(next.avDel),
        ntV: next.ntV,
        ntD: String(next.ntD),
        ntDel: String(next.ntDel),
        pnV: next.pnV,
        pnD: String(next.pnD),
        pnDel: String(next.pnDel),
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, settings]
  );

  const codeSnippets = useMemo(
    () => computeCodeSnippets(settings, isOpen, notifVisible),
    [isOpen, notifVisible, settings]
  );

  return { settings, updateSettings, saveAsDefault, formatDuration, codeSnippets };
}

export function useAccordionCards() {
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  const toggleCard = useCallback((name: string) => {
    setOpenCards((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  return { openCards, toggleCard };
}
