"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** Where scroll-stop sections pin: any screen tall enough (phones included), motion allowed. */
export const PIN_QUERY = "(min-height: 560px) and (prefers-reduced-motion: no-preference)";

/**
 * Scroll-stop driver. While `query` matches, the track element is flagged `data-pinned`
 * (CSS makes it tall and its stage sticky) and its scroll progress, 0 → 1, is written to
 * the `--p` custom property on every frame the page scrolls. `onProgress` gets the same
 * value. When the query doesn't match, `--p` is 1 so everything renders in its end state.
 */
export function useScrollStop(trackRef: RefObject<HTMLElement | null>, query = PIN_QUERY, onProgress?: (p: number) => void) {
  const [pinned, setPinned] = useState(false);
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (!pinned) {
      el.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const p = Math.min(Math.max(-r.top / Math.max(travel, 1), 0), 1);
      el.style.setProperty("--p", p.toFixed(4));
      cb.current?.(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned, trackRef]);

  return pinned;
}

/** Scroll the window so the given track sits at progress `p` (0 → 1). */
export function scrollTrackTo(track: HTMLElement, p: number) {
  const r = track.getBoundingClientRect();
  const travel = r.height - window.innerHeight;
  window.scrollTo({ top: window.scrollY + r.top + travel * p, behavior: "smooth" });
}
