"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/** Saved theme is applied before first paint by the inline script in layout.tsx (no flash). */
const THEME_KEY = "theme";

// The source of truth is html[data-theme]; components re-read it on `themechange`.
const subscribe = (cb: () => void) => {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
};
const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const getServerTheme = (): Theme | null => null; // unknown on the server

/**
 * Night-mode switch (moon / sun). Sets html[data-theme], remembers the choice, and fires a
 * `themechange` event so Shiro can go to sleep (or wake up).
 */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    window.dispatchEvent(new CustomEvent("themechange", { detail: next }));
  };

  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to day mode" : "Switch to night mode"}
      aria-pressed={dark}
      className="focus-ring grid h-[36px] w-[36px] place-items-center rounded-[7px] border border-ink/15 text-ink transition-colors hover:bg-white"
    >
      <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`theme-icon ${theme ? "opacity-100" : "opacity-0"}`}>
        {dark ? (
          // Sun
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          // Moon
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        )}
      </svg>
    </button>
  );
}
