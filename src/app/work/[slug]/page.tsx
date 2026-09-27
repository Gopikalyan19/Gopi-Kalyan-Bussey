import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import Highlight from "@/components/Highlight";
import { ArrowUpRight } from "@/components/icons";
import Footer from "@/components/sections/Footer";
import { MenuButton } from "@/components/ui/buttons";
import UIProvider from "@/components/ui/UIProvider";
import ProjectMedia from "@/components/work/ProjectMedia";
import SitePreview from "@/components/work/SitePreview";
import { CONTACT_PAGE, HERO, isLightColor, PERSON, PROJECTS } from "@/lib/content";

type Params = { slug: string };

// One static page per project; any other slug is a 404.
export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `${p.title} — ${PERSON.name}`, description: p.description };
}

/** Load-in delay for `.reveal` pieces. */
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");

/** Small label used at the top of tiles and sections (matches the site's red section labels). */
function Label({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`font-display text-[12px] font-medium ${light ? "text-white" : "text-red"}`}>{children}</p>;
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const p = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const stack = p.stack ?? [];
  const light = isLightColor(p.bg);
  const nextLight = isLightColor(next.bg);
  const nextLogo = next.imageFit === "contain";
  const nextLong = Math.max(...next.title.split(" ").map((w) => w.length)) > 10;
  const features = p.features ?? [];

  const words = p.title.split(" ");
  // Long single words (e.g. "Draksharamam") get a smaller title so they never overflow.
  const longTitle = Math.max(...words.map((w) => w.length)) > 10;
  const titleSize = longTitle
    ? "text-[clamp(30px,9vw,44px)] sm:text-[56px] lg:text-[44px] xl:text-[60px]"
    : "text-[clamp(34px,10.5vw,48px)] sm:text-[68px] xl:text-[84px]";
  const titleLast = words.pop()!;
  const titleHead = words.length ? words.join(" ") + " " : "";

  // Bento: the red CTA tile stretches across whatever is left of its row.
  // Cells used before it = overview (2 on sm, 2×2 on lg) + one per small tile.
  const smallTiles = 2 + (p.facts?.length ?? 0) + (stack.length ? 1 : 0);
  const usedSm = (p.overview ? 2 : 0) + smallTiles;
  const usedLg = (p.overview ? 4 : 0) + smallTiles;
  const ctaSpan = [
    ["", "sm:col-span-2"][usedSm % 2 === 0 ? 1 : 0],
    ["lg:col-span-4", "lg:col-span-3", "lg:col-span-2", "lg:col-span-1"][usedLg % 4],
  ].join(" ");

  return (
    <UIProvider>
      <div id="home" className="px-3 pt-3 md:px-4 md:pt-4">
        {/* ---------- Top bar ---------- */}
        <nav aria-label="Project" className="reveal flex h-[58px] items-center justify-between rounded-[14px] bg-white pl-4 pr-[6px] sm:pl-5">
          <Link href="/#portfolio" className="focus-ring inline-flex items-center gap-2 rounded-sm font-display text-[13px] font-medium text-ink/70 transition-colors hover:text-ink">
            <ArrowUpRight className="h-[12px] w-[12px] -rotate-135" /> All projects
          </Link>
          <Link href="/" className="focus-ring hidden rounded-sm font-display text-[16px] font-semibold tracking-[-0.01em] sm:block">
            {PERSON.name}
          </Link>
          <MenuButton />
        </nav>
      </div>

      <main id="main" className="space-y-3 px-3 pb-[100px] pt-3 md:px-4">
        {/* ---------- Hero: text card + project card (mirrors the home hero) ---------- */}
        <header className="grid grid-cols-1 gap-3 lg:min-h-[calc(100svh-104px)] lg:grid-cols-2 lg:gap-4">
          <div className="flex flex-col rounded-[20px] bg-white px-6 pb-8 pt-10 sm:px-10 sm:pb-10 lg:px-14">
            <div className="flex flex-1 flex-col justify-center py-10">
              <div className="reveal flex flex-wrap items-center gap-2" style={d(0.05)}>
                <span className="pill-dark">
                  {pad(index + 1)} / {pad(PROJECTS.length)}
                </span>
                <span className="inline-flex h-[28px] items-center gap-[7px] rounded-[8px] bg-page px-3 font-display text-[11px] font-medium">
                  <span className="h-[6px] w-[6px] rounded-full bg-red" aria-hidden="true" />
                  {p.tagline}
                </span>
              </div>

              <h1 className={`reveal mt-6 font-display font-semibold leading-[1] tracking-[-0.045em] ${titleSize}`} style={d(0.12)}>
                {titleHead}
                <span className="whitespace-nowrap">
                  {titleLast}
                  <span className="hl-dot" aria-hidden="true" />
                </span>
              </h1>

              <p className="reveal mt-6 max-w-[480px] text-[16px] leading-[26px] text-ink/65 sm:text-[17px] sm:leading-[28px]" style={d(0.2)}>
                <Highlight text={p.description} />
              </p>

              <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={d(0.28)}>
                <a href={CONTACT_PAGE} className="btn-dark">
                  {HERO.secondaryCta} <ArrowUpRight className="h-[12px] w-[12px]" />
                </a>
                {p.links?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn-dark bg-page! text-ink! hover:bg-[#e2e2e2]!">
                    {l.label} <ArrowUpRight className="h-[12px] w-[12px]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="reveal flex items-center justify-between border-t border-page pt-5 font-display text-[12px] font-medium text-ink/65" style={d(0.34)}>
              <span>{p.focus}</span>
              <a href="#details" className="hero-link hidden sm:inline">
                Details ↓
              </a>
            </div>
          </div>

          {p.preview ? (
            <div className="reveal" style={d(0.15)}>
              <SitePreview url={p.preview.url} poster={p.preview.poster} title={p.title} />
            </div>
          ) : (
            <div className="reveal card relative min-h-[360px] overflow-hidden rounded-[20px] sm:min-h-[480px]" style={{ ...d(0.15), background: p.bg }}>
              <ProjectMedia
                project={p}
                // Wide screenshots are cropped to fill this tall card, so they need a larger download to stay sharp.
                sizes={p.imagePosition ? "(min-width: 1024px) 100vw, 200vw" : "(min-width: 1024px) 50vw, 100vw"}
                priority
                large
              />
              {!light && <span className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />}
              <span className={`absolute bottom-5 left-5 ${light ? "pill-dark" : "chip-glass"}`}>{p.title}</span>
            </div>
          )}
        </header>

        {/* ---------- Details bento ---------- */}
        <section id="details" aria-label="Project details" className="scroll-mt-4 grid grid-flow-dense gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {p.overview && (
            <div className="flex flex-col rounded-[20px] bg-white p-7 sm:col-span-2 sm:p-9 lg:row-span-2">
              <Label>Overview</Label>
              <p className="mt-5 font-display text-[19px] leading-[31px] tracking-[-0.01em] sm:text-[22px] sm:leading-[34px]">
                <Highlight text={p.overview} />
              </p>
            </div>
          )}

          <div className="rounded-[20px] bg-white p-7">
            <Label>My Role</Label>
            <p className="mt-4 font-display text-[18px] font-medium leading-[26px] tracking-[-0.01em]">{p.role}</p>
          </div>

          <div className="rounded-[20px] bg-white p-7">
            <Label>Focus Areas</Label>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.focus.split(" · ").map((f) => (
                <li key={f} className="inline-flex h-[28px] items-center rounded-[8px] bg-page px-3 font-display text-[12px] font-medium">
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {p.facts?.map((f) => (
            <div key={f.label} className="rounded-[20px] bg-white p-7">
              <Label>{f.label}</Label>
              <p className="mt-4 font-display text-[30px] font-semibold leading-none tracking-[-0.03em]">{f.value}</p>
            </div>
          ))}

          {stack.length > 0 && (
            <a href="#stack" className="card focus-ring monogram-tile flex flex-col justify-between rounded-[20px] bg-[#25262B] p-7 text-white">
              <Label light>Tech stack</Label>
              <span className="mt-6 flex items-end justify-between">
                <span>
                  <span className="block font-display text-[56px] font-semibold leading-none tracking-[-0.04em]">{pad(stack.length)}</span>
                  <span className="mt-2 block font-display text-[13px] text-white/70">{stack.length === 1 ? "tool" : "tools"} in the build</span>
                </span>
                <span className="arrow-btn">
                  <ArrowUpRight className="h-[13px] w-[13px] rotate-90" />
                </span>
              </span>
            </a>
          )}

          <a href={CONTACT_PAGE} className={`card focus-ring flex flex-col justify-between rounded-[20px] bg-red p-7 text-white ${ctaSpan}`}>
            <Label light>Like what you see?</Label>
            <span className="mt-6 flex items-end justify-between gap-4">
              <span className="font-display text-[22px] font-medium leading-[28px] tracking-[-0.02em]">{HERO.secondaryCta}</span>
              <span className="arrow-btn shrink-0">
                <ArrowUpRight className="h-[13px] w-[13px]" />
              </span>
            </span>
          </a>
        </section>

        {/* ---------- What's inside ---------- */}
        {features.length > 0 && (
          <section aria-labelledby="features-title" className="rounded-[20px] bg-white/60 px-5 py-10 sm:px-10 sm:py-14">
            <div className="max-w-[560px]">
              <p className="sec-label">Features</p>
              <h2 id="features-title" className="sec-title mt-3">
                What&apos;s inside
              </h2>
            </div>
            <ol className={`mt-10 grid gap-3 sm:grid-cols-2 ${features.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
              {features.map((f, i) => {
                const last = i === features.length - 1;
                return (
                  <li key={f.title} className={`process-card min-h-[220px] ${last ? "process-card--red" : ""}`}>
                    <span className={`${last ? "pill-light" : "pill-dark"} self-start`}>{pad(i + 1)}</span>
                    <h3 className="card-title mt-8">{f.title}</h3>
                    <p className={`card-copy ${last ? "text-white/95" : ""}`}>{f.description}</p>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* ---------- Tech stack ---------- */}
        {stack.length > 0 && (
          <section id="stack" aria-labelledby="stack-title" className="grid scroll-mt-4 gap-3 lg:grid-cols-[372px_1fr]">
            <div className="monogram-tile relative flex min-h-[260px] flex-col overflow-hidden rounded-[20px] bg-[#25262B] p-7 text-white sm:p-9">
              <span className="absolute inset-0 bg-linear-to-b from-black/0 via-black/10 to-black/50" aria-hidden="true" />
              <Label light>Built with</Label>
              <div className="relative mt-auto">
                <span aria-hidden="true" className="block font-display text-[120px] font-medium leading-[0.9] tracking-[-0.06em] text-white/15">
                  {pad(stack.length)}
                </span>
                <h2 id="stack-title" className="mt-3 font-display text-[28px] font-medium leading-[34px] tracking-[-0.02em]">
                  Tech stack
                </h2>
              </div>
            </div>
            <ul className="grid content-start gap-2 rounded-[20px] bg-white p-5 sm:grid-cols-2 sm:p-7 xl:grid-cols-3">
              {stack.map((s, i) => (
                <li key={s} className="flex h-[56px] items-center gap-4 rounded-[12px] bg-page px-5 font-display text-[15px] font-medium">
                  <span className="text-[11px] tabular-nums text-ink/65">{pad(i + 1)}</span>
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---------- Next project ---------- */}
        <Link
          href={`/work/${next.slug}`}
          data-cursor="view"
          className={`card focus-ring group relative block overflow-hidden rounded-[20px] sm:min-h-[380px] ${nextLogo ? "min-h-[420px]" : "min-h-[300px]"}`}
          style={{ background: next.bg }}
        >
          {next.imageFit === "contain" ? (
            // Logos: keep them clear of the title — right half on desktop, top area on phones.
            <span className="absolute inset-x-0 top-0 h-[42%] sm:left-auto sm:right-0 sm:h-[62%] sm:w-1/2">
              <ProjectMedia project={next} sizes="(min-width: 640px) 50vw, 100vw" />
            </span>
          ) : (
            <ProjectMedia project={next} sizes="100vw" large />
          )}
          <span
            className={`absolute inset-0 bg-linear-to-t ${nextLight ? "from-white/85 via-white/20 to-transparent" : "from-black/70 via-black/20 to-transparent"}`}
            aria-hidden="true"
          />
          <span className={`arrow-btn absolute right-5 top-5 h-[44px]! w-[44px]! ${nextLight ? "bg-ink! text-white!" : ""}`}>
            <ArrowUpRight className="h-[16px] w-[16px]" />
          </span>
          <span className={`absolute inset-x-6 bottom-6 sm:inset-x-10 sm:bottom-9 ${nextLight ? "text-ink" : "text-white"}`}>
            <span className={nextLight ? "pill-dark" : "chip-glass"}>Next project · {pad(((index + 1) % PROJECTS.length) + 1)}</span>
            <span
              className={`mt-4 block font-display font-semibold leading-[1] tracking-[-0.045em] ${nextLong ? "text-[clamp(30px,9vw,40px)] sm:text-[56px]" : "text-[44px] sm:text-[72px]"}`}
            >
              {next.title}
            </span>
            <span className={`mt-3 block font-display text-[14px] ${nextLight ? "text-ink/70" : "text-white/80"}`}>{next.tagline}</span>
          </span>
        </Link>
      </main>

      <Footer />
    </UIProvider>
  );
}
