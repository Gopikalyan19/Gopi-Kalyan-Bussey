"use client";

import { Nanum_Pen_Script, Sriracha, Zhi_Mang_Xing } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { siHtml5, siMysql, siNextdotjs, siNodedotjs, siPython, siReact, siTailwindcss, siTypescript, type SimpleIcon } from "simple-icons";
import { SKILLS } from "@/lib/content";
import SectionHead from "./SectionHead";

/** Official logos (simple-icons, CC0) for the development stack, keyed by display name. */
const TECH_ICONS: Record<string, SimpleIcon> = {
  HTML: siHtml5,
  "Tailwind CSS": siTailwindcss,
  React: siReact,
  "Next.js": siNextdotjs,
  Python: siPython,
  TypeScript: siTypescript,
  "Node.js": siNodedotjs,
  MySQL: siMysql,
};

/** Language level → filled steps on the 3-step meter. */
const LEVEL_STEPS = { Beginner: 1, Intermediate: 2, Fluent: 3 } as const;
/** BCP-47 codes so screen readers pronounce the native names correctly. */
const LANG_CODES: Record<string, string> = { Korean: "ko", Thai: "th", Chinese: "zh" };

// Handwritten fonts for the native names, one per script. Not preloaded: only this section
// uses them, and the browser fetches just the glyph slices it needs.
const nanumPen = Nanum_Pen_Script({ weight: "400", subsets: ["latin"], preload: false, display: "swap" });
const sriracha = Sriracha({ weight: "400", subsets: ["thai"], preload: false, display: "swap" });
const zhiMangXing = Zhi_Mang_Xing({ weight: "400", subsets: ["latin"], preload: false, display: "swap" });
/** Font + size per script (handwriting fonts run small or large, so each gets its own size). */
const HANDWRITING: Record<string, string> = {
  Korean: `${nanumPen.className} text-[40px]`,
  Thai: `${sriracha.className} text-[30px]`,
  Chinese: `${zhiMangXing.className} text-[38px]`,
};

/** Five-point star path centred on (cx, cy). */
const star = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, n) => {
    const a = (n * Math.PI) / 5 - Math.PI / 2;
    const rr = n % 2 ? r * 0.4 : r;
    return `${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`;
  }).join(" ");

/** Korean trigram: three bars, perpendicular to the flag's diagonal. */
const Trigram = ({ x, y, angle }: { x: number; y: number; angle: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} fill="#000">
    {[-1.4, 0, 1.4].map((o) => (
      <rect key={o} x={-2.5} y={o - 0.45} width={5} height={0.9} />
    ))}
  </g>
);

/**
 * Small hand-drawn-simple flags as SVG (emoji flags don't render on Windows).
 * Simplified for a ~30px size; decorative, since the language name is right beside it.
 */
const FLAGS: Record<string, ReactNode> = {
  Korean: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="5" fill="#0047A0" />
      <path d="M10 10a5 5 0 0 1 10 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 0-5 0z" fill="#CD2E3A" transform="rotate(33.7 15 10)" />
      <Trigram x={6} y={4.4} angle={-56.3} />
      <Trigram x={24} y={15.6} angle={-56.3} />
      <Trigram x={24} y={4.4} angle={56.3} />
      <Trigram x={6} y={15.6} angle={56.3} />
    </>
  ),
  Thai: (
    <>
      <rect width="30" height="20" fill="#A51931" />
      <rect y="3.33" width="30" height="13.34" fill="#F4F5F8" />
      <rect y="6.67" width="30" height="6.66" fill="#2D2A4A" />
    </>
  ),
  Chinese: (
    <>
      <rect width="30" height="20" fill="#EE1C25" />
      <polygon points={star(5, 5, 3)} fill="#FFDE00" />
      {[
        [10, 2],
        [12, 4],
        [12, 7],
        [10, 9],
      ].map(([x, y]) => (
        <polygon key={`${x}-${y}`} points={star(x, y, 1)} fill="#FFDE00" />
      ))}
    </>
  ),
};

function Tile({ i, icon, name }: { i: number; icon: ReactNode; name: string }) {
  return (
    <li className="skill-card tech-card skill-tile flex items-center gap-4 px-5 py-4" style={{ "--i": i } as CSSProperties}>
      <span className="skill-icon grid h-[44px] w-[44px] shrink-0 place-items-center rounded-[10px] bg-snow">{icon}</span>
      <span className="font-display text-[15px] font-medium tracking-[-0.01em]">{name}</span>
    </li>
  );
}

/**
 * My Superpowers: design tools and development stack as logo tiles. The tiles pop in one
 * after another the first time the section comes into view; icons wiggle on hover.
 * Reduced motion (or no JS) shows everything straight away.
 */
export default function Skills() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // "Arm" the section: hides the tiles until it's in view (see .skills-armed in CSS).
    section.classList.add("skills-armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        section.classList.add("skills-in");
      },
      { rootMargin: "0px 0px -30% 0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="skills" aria-labelledby="skills-title" className="sec skills">
      <SectionHead id="skills-title" label={SKILLS.label} title={SKILLS.heading} />

      <p className="mx-auto mt-12 max-w-[1128px] font-display text-[12px] font-medium text-red">Design Tools</p>
      {/* Design tools: a compact "dock" of app icons — one row of six on desktop. */}
      <ul className="mx-auto mt-4 grid max-w-[1128px] grid-cols-3 gap-3 lg:grid-cols-6">
        {SKILLS.items.map((s, i) => (
          <li
            key={s.name}
            className="skill-card tech-card skill-tile flex flex-col items-center gap-4 px-4 pb-5 pt-6 text-center"
            style={{ "--i": i } as CSSProperties}
          >
            <span className="skill-icon grid h-[64px] w-[64px] place-items-center rounded-[16px] bg-snow">
              <Image src={s.icon} alt="" width={36} height={36} className="h-[36px] w-[36px]" />
            </span>
            <span className="font-display text-[15px] font-medium tracking-[-0.01em]">{s.name}</span>
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-10 max-w-[1128px] font-display text-[12px] font-medium text-red">Development</p>
      <ul className="mx-auto mt-4 grid max-w-[1128px] grid-cols-2 gap-3 sm:grid-cols-4">
        {SKILLS.tech.map((name, j) => {
          const icon = TECH_ICONS[name];
          return (
            <Tile
              key={name}
              i={2 + j}
              name={name}
              icon={
                icon && (
                  <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true" fill={`#${icon.hex}`}>
                    <path d={icon.path} />
                  </svg>
                )
              }
            />
          );
        })}
      </ul>

      <p className="mx-auto mt-10 max-w-[1128px] font-display text-[12px] font-medium text-red">{SKILLS.languagesLabel}</p>
      <ul className="mx-auto mt-4 grid max-w-[1128px] gap-3 sm:grid-cols-3">
        {SKILLS.languages.map((l, k) => {
          const steps = LEVEL_STEPS[l.level];
          return (
            <li
              key={l.name}
              className="skill-card tech-card skill-tile flex items-stretch justify-between gap-4 px-5 py-5"
              style={{ "--i": 4 + k } as CSSProperties}
            >
              <span className="flex flex-col justify-end">
                <span lang={LANG_CODES[l.name]} className={`block leading-none ${HANDWRITING[l.name] ?? "text-[30px] font-medium"}`}>
                  {l.native}
                </span>
                <span className="mt-3 block font-display text-[15px] font-medium tracking-[-0.01em]">{l.name}</span>
              </span>
              <span className="flex flex-col items-end text-right">
                {FLAGS[l.name] && (
                  <svg viewBox="0 0 30 20" width={30} height={20} aria-hidden="true" className="skill-icon mb-auto rounded-[4px] shadow-[0_0_0_1px_rgb(14_14_14/0.1)]">
                    {FLAGS[l.name]}
                  </svg>
                )}
                <span className="mt-4 block font-display text-[12px] text-ink/55">{l.level}</span>
                <span className="mt-2 flex justify-end gap-1" aria-hidden="true">
                  {[1, 2, 3].map((s) => (
                    <i key={s} className={`h-[4px] w-[18px] rounded-full ${s <= steps ? "bg-ink" : "bg-ink/12"}`} />
                  ))}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
