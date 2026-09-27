"use client";

import { useEffect, useRef } from "react";

type State = "default" | "link" | "view";

const INTERACTIVE = 'a[href], button, [role="button"], label, summary, [data-cursor]';

/*
 * Pixel-art cursors to match Shiro. X = outline, W = fill, . = empty.
 * Hotspots: arrow tip at (0,0); hand fingertip at (5,0) — offset in CSS.
 */
const ARROW = [
  "X...........",
  "XX..........",
  "XWX.........",
  "XWWX........",
  "XWWWX.......",
  "XWWWWX......",
  "XWWWWWX.....",
  "XWWWWWWX....",
  "XWWWWWWWX...",
  "XWWWWWWWWX..",
  "XWWWWWWWWWX.",
  "XWWWWWWXXXXX",
  "XWWWXWWX....",
  "XWWX.XWWX...",
  "XWX..XWWX...",
  "XX....XWWX..",
  "X.....XWWX..",
  ".......XX...",
];
const HAND = [
  ".....XX.........",
  "....XWWX........",
  "....XWWX........",
  "....XWWX........",
  "....XWWXXX......",
  "....XWWXWWXXX...",
  "....XWWXWWXWWXX.",
  ".XX.XWWXWWXWWXWX",
  "XWWXXWWWWWWWWXWX",
  "XWWWXWWWWWWWWWWX",
  ".XWWXWWWWWWWWWWX",
  "..XWWWWWWWWWWWWX",
  "..XWWWWWWWWWWWX.",
  "...XWWWWWWWWWWX.",
  "...XWWWWWWWWWX..",
  "....XWWWWWWWWX..",
  "....XWWWWWWWWX..",
  "....XXXXXXXXXX..",
];
const PX = 1.5; // screen pixels per art pixel (cursor size)

function PixelArt({ rows, className }: { rows: string[]; className: string }) {
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} width={w * PX} height={h * PX} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].flatMap((ch, x) =>
          ch === "." ? [] : [<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={ch === "X" ? "#1a1a1a" : "#fff"} />],
        ),
      )}
    </svg>
  );
}

/**
 * Custom cursor.
 * - Mouse: a pixel-art arrow that tracks the pointer 1:1; a pixel hand over links/buttons;
 *   a small "View" tag over [data-cursor="view"]; a little press on click.
 * - Touch/pen: a ring appears under the finger with a ripple on every tap, follows while
 *   dragging, then fades (no reduced-motion ripple).
 * - Keyboard use is unaffected: focus styles are separate from the cursor.
 */
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const pointer = pointerRef.current!;
    const ring = ringRef.current!;
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Only hide the native cursor on devices that actually have a mouse.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) html.classList.add("has-cursor");

    let state: State = "default";
    const setState = (next: State, label = "View") => {
      if (labelRef.current) labelRef.current.textContent = label;
      if (next !== state) root.dataset.state = state = next;
    };
    const stateFor = (el: Element | null) => {
      const hit = el?.closest<HTMLElement>(INTERACTIVE);
      if (!hit) return setState("default");
      if (hit.dataset.cursor === "view") setState("view", hit.dataset.cursorLabel ?? "View");
      else setState("link");
    };

    const ripple = (x: number, y: number) => {
      if (reduce) return;
      const r = document.createElement("span");
      r.className = "cursor-ripple";
      r.style.left = `${x}px`;
      r.style.top = `${y}px`;
      root.appendChild(r);
      r.addEventListener("animationend", () => r.remove(), { once: true });
    };
    const placeRing = (x: number, y: number) => {
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    let touchTimer: ReturnType<typeof setTimeout> | undefined;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        root.classList.remove("is-touch");
        root.classList.add("is-active");
        pointer.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      } else if (e.buttons > 0) {
        placeRing(e.clientX, e.clientY);
      }
    };
    const onDown = (e: PointerEvent) => {
      root.classList.add("is-pressed");
      if (e.pointerType === "mouse") return;
      clearTimeout(touchTimer);
      root.classList.add("is-active", "is-touch");
      stateFor(e.target as Element | null);
      placeRing(e.clientX, e.clientY);
      ripple(e.clientX, e.clientY);
    };
    const onUp = (e: PointerEvent) => {
      root.classList.remove("is-pressed");
      if (e.pointerType === "mouse") return;
      clearTimeout(touchTimer);
      // Leave the ring up a moment so the tap reads, then fade out.
      touchTimer = setTimeout(() => root.classList.remove("is-active", "is-touch"), 450);
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "mouse") stateFor(e.target as Element | null);
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") root.classList.remove("is-active");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true }); // touch turned into a scroll
    document.addEventListener("pointerover", onOver, { passive: true });
    html.addEventListener("pointerleave", onLeave);

    return () => {
      clearTimeout(touchTimer);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerover", onOver);
      html.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" data-state="default" aria-hidden="true">
      {/* Mouse: pixel arrow / hand */}
      <div ref={pointerRef} className="cursor-pointer">
        <div className="cursor-press">
          <PixelArt rows={ARROW} className="cursor-arrow" />
          <span className="cursor-hand" style={{ left: -5 * PX }}>
            <PixelArt rows={HAND} className="block" />
          </span>
          <span ref={labelRef} className="cursor-tag" style={{ left: 12 * PX + 6 }}>
            View
          </span>
        </div>
      </div>
      {/* Touch: ring under the finger */}
      <div ref={ringRef} className="cursor-ring">
        <div className="cursor-ring-inner">
          <span className="cursor-label">View</span>
        </div>
      </div>
    </div>
  );
}
