import { useEffect, useState } from "react";

const ANDROID_CHROME_FALLBACK_INSET_PX = 48;

function isAndroidChrome(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /Android/i.test(ua) &&
    /Chrome/i.test(ua) &&
    !/Edg|OPR|SamsungBrowser|Firefox/i.test(ua)
  );
}

function measureBottomInset(): number {
  const vv = window.visualViewport;
  if (!vv) return ANDROID_CHROME_FALLBACK_INSET_PX;
  const obscured = window.innerHeight - (vv.height + vv.offsetTop);
  return Math.max(0, Math.round(obscured));
}

export function useAndroidChromeInset() {
  const [isAndroidChromeBrowser, setIsAndroidChromeBrowser] = useState(false);
  const [bottomInsetPx, setBottomInsetPx] = useState(0);

  useEffect(() => {
    const androidChrome = isAndroidChrome();
    setIsAndroidChromeBrowser(androidChrome);
    if (!androidChrome) return;

    const update = () => {
      const measured = measureBottomInset();
      setBottomInsetPx(measured > 0 ? measured : ANDROID_CHROME_FALLBACK_INSET_PX);
    };

    update();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { isAndroidChromeBrowser, bottomInsetPx };
}
