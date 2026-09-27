"use client";

import { useRef, type CSSProperties } from "react";
import Highlight from "@/components/Highlight";
import { ABOUT, HERO } from "@/lib/content";
import { useScrollStop } from "@/lib/useScrollStop";

/**
 * About section with a scroll-stop on desktop: the stage sticks to the screen while the
 * section scrolls past (~3 screens), and that scroll progress (--p, 0 → 1) drives the
 * animation — heading words brighten one by one, then the four paragraph cards arrive
 * in turn. Everywhere else it renders as a normal static section.
 */
export default function About() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinned = useScrollStop(trackRef);
  const words = ABOUT.heading.split(" ");

  return (
    <section id="about" aria-labelledby="about-title" className="relative scroll-mt-[72px] px-4 md:px-8">
      {/* Track: ~3 screens tall while pinned, so the sticky stage holds while you scroll. */}
      <div ref={trackRef} data-pinned={pinned || undefined} className="about-track" style={{ "--p": 1, "--words": words.length } as CSSProperties}>
        <div className="about-stage pt-[72px] lg:pt-[96px]">
          <div className="mx-auto grid w-full max-w-[1128px] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14">
            <div>
              <p className="sec-label">{ABOUT.label}</p>
              <h2
                id="about-title"
                aria-label={ABOUT.heading}
                className="mt-4 font-display text-[44px] font-medium leading-[1.08] tracking-[-0.035em] sm:text-[60px] lg:text-[clamp(52px,4.6vw,72px)]"
              >
                {words.map((w, i) => (
                  <span key={i} aria-hidden="true" className="about-word" style={{ "--i": i } as CSSProperties}>
                    {w}{" "}
                  </span>
                ))}
              </h2>
            </div>

            <ol className="grid gap-3 sm:grid-cols-2">
              {ABOUT.paragraphs.map((p, j) => (
                <li key={j} className="about-para flex flex-col rounded-[14px] bg-white p-6" style={{ "--j": j } as CSSProperties}>
                  <span className={`self-start ${j === ABOUT.paragraphs.length - 1 ? "pill-dark bg-red" : "pill-dark"}`}>{String(j + 1).padStart(2, "0")}</span>
                  <p className="mt-5 text-[14px] leading-[22px] text-ink/70">
                    <Highlight text={p} />
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {pinned && (
            <div className="about-progress mx-auto mt-10 h-[3px] w-full max-w-[1128px] overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
              <span className="block h-full origin-left rounded-full bg-ink" />
            </div>
          )}
        </div>
      </div>

      <p className="mx-auto max-w-[620px] pb-[120px] pt-[64px] text-center font-display text-[18px] leading-[28px] text-ink sm:text-[22px] sm:leading-[32px] lg:pt-[80px]">
        <Highlight text={HERO.support} />
      </p>
    </section>
  );
}
