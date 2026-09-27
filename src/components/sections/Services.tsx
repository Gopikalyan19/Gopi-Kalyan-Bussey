"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import { CONTACT_PAGE, HERO, SERVICES } from "@/lib/content";
import { scrollTrackTo, useScrollStop } from "@/lib/useScrollStop";
import SectionHead from "./SectionHead";

const N = SERVICES.items.length;
/** Share of the pinned scroll spent stepping through services; the rest is a short hold on the last one. */
const STEP_SPAN = 0.92;

/**
 * What I Do. On desktop the stage pins and scrolling walks through the six services one
 * by one: the active service opens, the others dim, and the side card swaps in its number
 * and title while a segmented bar fills. Clicking a service scrolls to its step.
 * Elsewhere (small screens, reduced motion) it's a regular click-to-open accordion.
 */
export default function Services() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  const pinned = useScrollStop(trackRef, undefined, (p) => setOpen(Math.min(N - 1, Math.floor((p / STEP_SPAN) * N))));
  const current = open ?? 0;

  const select = (i: number) => {
    if (pinned && trackRef.current) scrollTrackTo(trackRef.current, ((i + 0.5) / N) * STEP_SPAN);
    else setOpen(open === i ? null : i);
  };

  return (
    <section id="services" aria-labelledby="services-title" className="sec">
      <SectionHead id="services-title" label={SERVICES.label} title={SERVICES.heading} />

      <div ref={trackRef} data-pinned={pinned || undefined} className="svc-track mt-12">
        <div className="svc-stage">
          <div className="wrap grid gap-3 lg:grid-cols-[372px_1fr]">
            {/* Phones, while pinned: compact counter + progress instead of the big side card. */}
            {pinned && (
              <div className="svc-mobile-head lg:hidden" aria-hidden="true">
                <div className="flex items-baseline justify-between font-display">
                  <span className="text-[12px] font-medium text-red">{SERVICES.label}</span>
                  <span className="text-[12px] font-medium tabular-nums text-ink/65">
                    {String(current + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-3 flex gap-1">
                  {SERVICES.items.map((_, i) => (
                    <span key={i} className={`h-[4px] flex-1 rounded-full transition-colors duration-500 ${i <= current ? "bg-ink" : "bg-ink/10"}`} />
                  ))}
                </div>
              </div>
            )}
            {/* Side card: shows the service in focus. */}
            <aside className="monogram-tile relative flex h-[360px] flex-col overflow-hidden rounded-[14px] bg-[#25262B] p-6 text-white lg:h-auto lg:min-h-[500px]">
              <span className="absolute inset-0 bg-linear-to-b from-black/0 via-black/10 to-black/60" aria-hidden="true" />
              <p className="relative font-display text-[12px] font-medium text-white/80">{SERVICES.label}</p>

              <div className="relative mt-auto">
                <span key={`n${current}`} aria-hidden="true" className="svc-swap block font-display text-[120px] font-medium leading-[0.9] tracking-[-0.06em] text-white/15 lg:text-[150px]">
                  {String(current + 1).padStart(2, "0")}
                </span>
                <p key={`t${current}`} className="svc-swap mt-3 font-display text-[28px] font-medium leading-[34px] tracking-[-0.02em]" style={{ animationDelay: "60ms" }}>
                  {SERVICES.items[current].title}
                </p>

                <div className="mt-5 flex gap-1" aria-hidden="true">
                  {SERVICES.items.map((_, i) => (
                    <span key={i} className={`h-[4px] flex-1 rounded-full transition-colors duration-500 ${i <= current ? "bg-white" : "bg-white/20"}`} />
                  ))}
                </div>

                <a href={CONTACT_PAGE} className="btn-light mt-6">
                  {HERO.secondaryCta} <ArrowUpRight className="h-[12px] w-[12px]" />
                </a>
              </div>
            </aside>

            {/* Service list */}
            <ol className="space-y-3">
              {SERVICES.items.map((s, i) => {
                const isOpen = open === i;
                const id = `svc-${i + 1}`;
                return (
                  <li key={s.title} className={`acc svc-item ${isOpen ? "is-open" : ""}`}>
                    <h3>
                      <button type="button" id={`${id}-btn`} aria-expanded={isOpen} aria-controls={id} onClick={() => select(i)} className="acc-btn svc-btn">
                        <span className="flex items-baseline gap-4">
                          <span className="w-6 font-display text-[12px] font-medium tabular-nums text-ink">{String(i + 1).padStart(2, "0")}</span>
                          <span className="acc-title">{s.title}</span>
                        </span>
                        <span className="acc-icon" aria-hidden="true" />
                      </button>
                    </h3>
                    <div className="acc-panel" id={id} role="region" aria-labelledby={`${id}-btn`} inert={!isOpen}>
                      <div className="acc-inner">
                        <p className="acc-body pl-[64px]">{s.description}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
