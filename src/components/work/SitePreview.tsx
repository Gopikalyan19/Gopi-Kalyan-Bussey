"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@/components/icons";

/** Width the live site is rendered at before being scaled down to fit (a desktop view). */
const SITE_WIDTH = 1440;

/**
 * Mini browser window showing a project's live website.
 * - A screenshot (`poster`) shows instantly, so there's never an empty frame
 *   (free hosting like Render can take a few seconds to wake up).
 * - Once the page is idle, the real site loads in an iframe rendered at desktop width
 *   and scaled down to fit, then fades in over the screenshot.
 * - The preview is view-only (no scrolling trapped inside it); clicking it, or the
 *   button in the bar, opens the live site in a new tab.
 */
export default function SitePreview({ url, poster, title }: { url: string; poster: string; title: string }) {
  const viewportRef = useRef<HTMLAnchorElement>(null);
  const [size, setSize] = useState({ scale: 0, height: 0 });
  const [mount, setMount] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const host = new URL(url).host;

  // Keep the iframe scaled to the viewport's width.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const fit = () => {
      const scale = el.clientWidth / SITE_WIDTH;
      setSize({ scale, height: el.clientHeight / scale });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Load the live site only after the page itself is ready.
  useEffect(() => {
    const go = () => setMount(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(go, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(go, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex h-full min-h-[360px] min-w-0 flex-col rounded-[20px] bg-white p-3 sm:min-h-[480px]">
      {/* Browser bar */}
      <div className="flex h-[44px] shrink-0 items-center gap-3 px-2">
        <span className="flex gap-[6px]" aria-hidden="true">
          <i className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
          <i className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
          <i className="h-[10px] w-[10px] rounded-full bg-[#28c840]" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2 rounded-[8px] bg-page px-3 py-[6px] font-display text-[12px] text-ink/70">
          <svg viewBox="0 0 24 24" className="h-[12px] w-[12px] shrink-0 fill-current" aria-hidden="true">
            <path d="M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v3h6V7a3 3 0 0 0-3-3z" />
          </svg>
          <span className="truncate">{host}</span>
          <span className={`ml-auto h-[7px] w-[7px] shrink-0 rounded-full ${loaded ? "bg-[#28c840]" : "bg-[#febc2e] motion-safe:animate-pulse"}`} aria-hidden="true" />
        </span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="focus-ring hidden h-[32px] shrink-0 items-center gap-1 rounded-[8px] bg-ink px-3 font-display text-[12px] font-medium text-white transition-colors hover:bg-[#2b2b2b] sm:inline-flex"
        >
          Visit Live Site <ArrowUpRight className="h-[11px] w-[11px]" />
        </a>
      </div>

      {/* Viewport */}
      <a
        ref={viewportRef}
        href={url}
        target="_blank"
        rel="noreferrer"
        data-cursor="view"
        data-cursor-label="Visit"
        aria-label={`Open the live ${title} website in a new tab`}
        className="focus-ring relative mt-2 block flex-1 overflow-hidden rounded-[12px] bg-black"
      >
        <Image src={poster} alt={`Preview of the ${title} website`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top" priority />
        {mount && size.scale > 0 && (
          <iframe
            src={url}
            title={`${title} (live preview)`}
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            sandbox="allow-scripts allow-same-origin"
            onLoad={() => setLoaded(true)}
            className={`pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-white transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ width: SITE_WIDTH, height: size.height, transform: `scale(${size.scale})` }}
          />
        )}
        <span className="chip-glass pointer-events-none absolute bottom-4 left-4">{loaded ? "Live preview" : "Preview"}</span>
      </a>
    </div>
  );
}
