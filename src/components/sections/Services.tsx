"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import { CONTACT_PAGE, HERO, SERVICES } from "@/lib/content";
import { scrollTrackTo, useScrollStop } from "@/lib/useScrollStop";
import SectionHead from "./SectionHead";

const N = SERVICES.items.length;
/** Share of the pinned scroll spent stepping through services; the rest is a short hold on the last one. */
const STEP_SPAN = 0.92;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * What I Do: a typographic index. Big service titles stack up as ghosts; the one in focus
 * turns solid and its description shows in the side panel. While pinned, scrolling walks
 * through them (clicking jumps to that step); otherwise clicking a title focuses it.
 */
export default function Services() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const pinned = useScrollStop(trackRef, undefined, (p) => setCurrent(Math.min(N - 1, Math.floor((p / STEP_SPAN) * N))));

  const select = (i: number) => {
    if (pinned && trackRef.current) scrollTrackTo(trackRef.current, ((i + 0.5) / N) * STEP_SPAN);
    else setCurrent(i);
  };

  return (
    <section id="services" aria-labelledby="services-title" className="sec">
      <SectionHead id="services-title" label={SERVICES.label} title={SERVICES.heading} />

      <div ref={trackRef} data-pinned={pinned || undefined} className="svc-track mt-12">
        <div className="svc-stage">
          <div className="wrap grid gap-10 lg:grid-cols-[1fr_300px] lg:items-end lg:gap-16">
            {/* Index of titles */}
            <ol className="svc-list">
              {SERVICES.items.map((s, i) => (
                <li key={s.title}>
                  <button type="button" onClick={() => select(i)} aria-pressed={current === i} className={`svc-title ${current === i ? "is-on" : ""}`}>
                    <span className="svc-num" aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                    {s.title}
                    <span className="sr-only">: {s.description}</span>
                  </button>
                </li>
              ))}
            </ol>

            {/* Panel: counter, description, progress, CTA (visual only; the list carries the text for screen readers). */}
            <div className="border-t border-ink/15 pt-5 lg:pb-3" aria-hidden="true">
              <p className="flex items-baseline justify-between font-display text-[12px] font-medium tabular-nums text-ink/55">
                <span>{SERVICES.label}</span>
                <span>
                  <span className="text-ink">{pad(current + 1)}</span> / {pad(N)}
                </span>
              </p>
              <p key={current} className="svc-swap mt-5 min-h-[72px] text-[15px] leading-[24px] text-ink/70">
                {SERVICES.items[current].description}
              </p>
              <div className="mt-6 h-px bg-ink/10">
                <span className="block h-full origin-left bg-ink transition-transform duration-500" style={{ transform: `scaleX(${(current + 1) / N})` }} />
              </div>
            </div>
          </div>

          <div className="wrap mt-8 lg:mt-10">
            <a href={CONTACT_PAGE} className="hero-link inline-flex items-center gap-2 font-display text-[13px] font-medium">
              {HERO.secondaryCta} <ArrowUpRight className="h-[11px] w-[11px]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
