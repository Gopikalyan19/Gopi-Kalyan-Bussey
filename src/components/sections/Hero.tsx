import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import portrait from "@/assets/gopi-portrait.jpeg";
import Highlight from "@/components/Highlight";
import { ArrowUpRight, LinkedIn, Mail } from "@/components/icons";
import { CONTACT_PAGE, HERO, MENU_LINKS, PERSON } from "@/lib/content";
import HeroHeadline from "./HeroHeadline";

/** One-time staggered load-in. */
function Reveal({ i, className = "", children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <div className={`reveal ${className}`} style={{ "--d": `${0.05 + i * 0.08}s` } as CSSProperties}>
      {children}
    </div>
  );
}

/** Hero: text card on the left, full-height photo card on the right. */
export default function Hero() {
  return (
    <header id="home" className="p-3 md:p-4">
      <div className="grid gap-3 lg:min-h-[calc(100svh-32px)] lg:grid-cols-2 lg:gap-4">
        {/* Left: copy */}
        <div className="flex flex-col rounded-[20px] bg-white px-6 pb-8 pt-10 sm:px-10 sm:pb-10 lg:px-14 lg:pt-12">
          <div className="flex flex-1 flex-col justify-center py-16 lg:py-10">
            <Reveal i={1}>
              <span className="inline-flex h-[32px] items-center gap-[7px] rounded-[8px] bg-page px-[12px] font-display text-[12px] font-medium text-ink">
                <span className="h-[7px] w-[7px] rounded-full bg-red" aria-hidden="true" />
                {PERSON.title}
              </span>
            </Reveal>

            <HeroHeadline className="mt-6 max-w-[14ch] font-display text-[44px] font-semibold leading-[1.04] tracking-[-0.045em] sm:text-[60px] xl:text-[74px]" />

            <Reveal i={3}>
              <p className="mt-7 max-w-[460px] text-[15px] leading-[25px] text-ink/65">
                <Highlight text={HERO.intro} />
              </p>
            </Reveal>

            <Reveal i={4}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#portfolio" className="btn-dark">
                  {HERO.primaryCta} <ArrowUpRight className="h-[12px] w-[12px] rotate-90" />
                </a>
                <a href={CONTACT_PAGE} className="btn-dark bg-page! text-ink! hover:bg-[#e2e2e2]!">
                  {HERO.secondaryCta} <ArrowUpRight className="h-[12px] w-[12px]" />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Footer row: socials + quiet section links. */}
          <Reveal i={5}>
            <div className="flex items-center justify-between gap-6 border-t border-page pt-5">
              <ul className="flex items-center gap-[18px]" aria-label="Social links">
                <li>
                  <a href={PERSON.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social">
                    <LinkedIn />
                  </a>
                </li>
                <li>
                  <a href={CONTACT_PAGE} aria-label="Mail Me" className="social">
                    <Mail />
                  </a>
                </li>
              </ul>
              <nav aria-label="Sections">
                <ul className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 font-display text-[12px] font-medium">
                  {MENU_LINKS.map((l, i) => (
                    <li key={l.href} className={i > 0 ? "hidden sm:block" : undefined}>
                      <a href={l.href} className="hero-link">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </Reveal>
        </div>

        {/* Right: full photo — black & white, colour on hover. */}
        <Reveal i={2} className="hero-photo-card relative min-h-[440px] overflow-hidden rounded-[20px] bg-ink sm:min-h-[560px] lg:min-h-0">
          <Image
            src={portrait}
            alt={`Portrait of ${PERSON.name}`}
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="hero-photo-img object-cover object-[50%_35%]"
          />
        </Reveal>
      </div>
    </header>
  );
}
