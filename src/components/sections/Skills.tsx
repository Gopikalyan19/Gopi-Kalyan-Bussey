"use client";

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

function Tile({ i, icon, name }: { i: number; icon: ReactNode; name: string }) {
  return (
    <li className="skill-card tech-card flex items-center gap-4 rounded-[14px] bg-white px-5 py-4" style={{ "--i": i } as CSSProperties}>
      <span className="skill-icon grid h-[44px] w-[44px] shrink-0 place-items-center rounded-[10px] bg-page">{icon}</span>
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
      <SectionHead id="skills-title" title={`${SKILLS.label} ${SKILLS.heading}`} />

      <p className="mx-auto mt-12 max-w-[1128px] font-display text-[12px] font-medium text-red">Design Tools</p>
      {/* Design tools: a compact "dock" of app icons — one row of six on desktop. */}
      <ul className="mx-auto mt-4 grid max-w-[1128px] grid-cols-3 gap-3 lg:grid-cols-6">
        {SKILLS.items.map((s, i) => (
          <li
            key={s.name}
            className="skill-card tech-card flex flex-col items-center gap-4 rounded-[14px] bg-white px-4 pb-5 pt-6 text-center"
            style={{ "--i": i } as CSSProperties}
          >
            <span className="skill-icon grid h-[64px] w-[64px] place-items-center rounded-[16px] bg-page">
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
              i={SKILLS.items.length + j}
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
    </section>
  );
}
