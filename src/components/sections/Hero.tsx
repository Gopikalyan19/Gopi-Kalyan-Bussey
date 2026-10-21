import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import portrait from "@/assets/gopi-portrait.jpeg";
import { ArrowUpRight, LinkedIn, Mail } from "@/components/icons";
import { CONTACT_PAGE, EXPERIENCE, HERO, MENU_LINKS, PERSON } from "@/lib/content";
import HeroHeadline from "./HeroHeadline";
import HeroStatus from "./HeroStatus";

/** One-time staggered load-in. */
function Reveal({ i, className = "", children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <div className={`reveal ${className}`} style={{ "--d": `${0.05 + i * 0.08}s` } as CSSProperties}>
      {children}
    </div>
  );
}

const current = EXPERIENCE.items[0];
const [company, team] = current.company.split(" — ");

/** Hero: centred intro (like the section heads), then a bento row of cards. */
export default function Hero() {
  return (
    <header id="home" className="px-4 pb-[120px] pt-[62px] md:px-8">
      <div className="wrap">
        {/* Intro */}
        <div className="mx-auto flex max-w-[860px] flex-col items-center pt-16 text-center sm:pt-24">
          <Reveal i={1}>
            <p className="inline-flex items-center gap-2 rounded-full bg-white py-[7px] pl-[11px] pr-[14px] font-display text-[12px] text-ink/70">
              <span className="hero-live" aria-hidden="true" />
              {PERSON.title}
            </p>
          </Reveal>

          <HeroHeadline className="mt-6 max-w-[17ch] font-display text-[40px] font-medium leading-[1.06] tracking-[-0.025em] sm:text-[60px] lg:text-[72px]" />

          <Reveal i={3}>
            <p className="mx-auto mt-6 max-w-[480px] text-[15px] leading-[25px] text-ink/60 sm:text-[16px] sm:leading-[26px]">{HERO.intro}</p>
          </Reveal>

          <Reveal i={4}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#portfolio" className="btn-dark group h-[48px]! px-6!">
                {HERO.primaryCta}
                <ArrowUpRight className="h-[12px] w-[12px] rotate-90 transition-transform group-hover:translate-y-[2px]" />
              </a>
              <a href={CONTACT_PAGE} className="btn-dark group h-[48px]! bg-white! px-6! text-ink! hover:bg-white/70!">
                {HERO.secondaryCta}
                <ArrowUpRight className="h-[12px] w-[12px] transition-transform group-hover:-translate-y-[2px] group-hover:translate-x-[2px]" />
              </a>
            </div>
          </Reveal>
          <Reveal i={5}>
            <HeroStatus className="mt-6" />
          </Reveal>
        </div>

        {/* Bento: currently · portrait · explore */}
        <div className="mt-16 grid gap-3 sm:mt-20 md:grid-cols-2 md:gap-4 lg:grid-cols-[1fr_1.35fr_1fr]">
          {/* Currently (dark grid tile, like the contact card) */}
          <Reveal i={5} className="keep-dark monogram-tile flex min-h-[220px] md:min-h-[300px] flex-col rounded-[20px] bg-ink p-6 text-white">
            <p className="font-display text-[12px] font-medium text-white/55">Currently committed to</p>
            <p className="mt-3 font-display text-[24px] font-medium leading-[30px] tracking-[-0.02em]">{current.role}</p>
            <p className="mt-1 font-display text-[13px] text-white/65">
              {company}
              {team && <span className="text-white/40"> · {team}</span>}
            </p>
            <div className="mt-auto flex items-center justify-between gap-4 pt-8">
              <span className="font-display text-[12px] text-white/55">Slide into my DMs</span>
              <ul className="flex items-center gap-2" aria-label="Social links">
                <li>
                  <a href={PERSON.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hero-social hero-social--dark">
                    <LinkedIn />
                  </a>
                </li>
                <li>
                  <a href={CONTACT_PAGE} aria-label="Mail Me" className="hero-social hero-social--dark">
                    <Mail />
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Portrait — black & white, colour on hover. */}
          <Reveal i={6} className="hero-photo-card relative min-h-[380px] overflow-hidden rounded-[20px] bg-ink order-first md:col-span-2 lg:order-none lg:col-span-1 lg:min-h-[300px]">
            <Image
              src={portrait}
              alt={`Portrait of ${PERSON.name}`}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 480px, 100vw"
              className="hero-photo-img object-cover object-[50%_35%]"
            />
          </Reveal>

          {/* Explore: section links */}
          <Reveal i={7} className="flex flex-col rounded-[20px] bg-white p-6 md:min-h-[300px]">
            <p className="font-display text-[12px] font-medium text-ink/55">Get to know me</p>
            <nav aria-label="Sections" className="mt-4 lg:mt-auto">
              <ul>
                {MENU_LINKS.map((l) => (
                  <li key={l.href} className="border-b border-page last:border-b-0">
                    <a href={l.href} className="group flex items-center justify-between rounded-sm py-[8px] font-display text-[16px] font-medium tracking-[-0.01em] outline-none focus-visible:ring-2 focus-visible:ring-ink">
                      {l.label}
                      <ArrowUpRight className="h-[11px] w-[11px] text-ink/40 transition-transform group-hover:rotate-45 group-hover:text-ink" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>
      </div>
    </header>
  );
}
