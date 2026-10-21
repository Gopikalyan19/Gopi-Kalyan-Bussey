import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";
import Footer from "@/components/sections/Footer";
import StickyNav from "@/components/sections/StickyNav";
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
  return { title: `${p.title} · ${PERSON.brand}`, description: p.description };
}

/** Load-in delay for `.reveal` pieces. */
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");

/** Case-study block: label on the left, content on the right, under a hairline. */
function Block({ label, id, children }: { label: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} aria-label={label} className="case-block wrap grid scroll-mt-24 gap-4 border-t border-ink/12 pt-8 lg:grid-cols-[220px_1fr] lg:gap-10">
      <p className="sec-label">{label}</p>
      <div>{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = PROJECTS.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const p = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const stack = p.stack ?? [];
  const nextLight = isLightColor(next.bg);
  const nextLogo = next.imageFit === "contain";
  const nextLong = Math.max(...next.title.split(" ").map((w) => w.length)) > 10;
  const features = p.features ?? [];
  const longTitle = Math.max(...p.title.split(" ").map((w) => w.length)) > 10;

  // Info bar: role, focus, any project facts, and the size of the stack.
  const info = [
    { label: "Role", value: p.role },
    { label: "Focus", value: p.focus.split(" · ").join(", ") },
    ...(p.facts ?? []),
    ...(stack.length ? [{ label: "Tools", value: `${stack.length} in the build` }] : []),
  ];

  return (
    <UIProvider>
      <StickyNav back={{ href: "/#portfolio", label: "All projects" }} />

      <main id="main" className="space-y-20 px-4 pb-[120px] pt-[62px] md:px-8 sm:space-y-24">
        {/* ---------- Hero: centred, like the home page ---------- */}
        <header className="wrap">
          <div className="mx-auto flex max-w-[860px] flex-col items-center pt-14 text-center sm:pt-20">
            <p className="reveal inline-flex items-center gap-2 rounded-full bg-white py-[7px] pl-[12px] pr-[14px] font-display text-[12px] text-ink/70" style={d(0.05)}>
              <span className="font-medium tabular-nums text-ink">
                {pad(index + 1)} / {pad(PROJECTS.length)}
              </span>
              <span className="h-[3px] w-[3px] rounded-full bg-ink/30" aria-hidden="true" />
              {p.tagline}
            </p>

            <h1
              className={`reveal mt-6 font-display font-medium leading-[1.02] tracking-[-0.03em] ${longTitle ? "text-[clamp(34px,8vw,64px)]" : "text-[clamp(44px,9vw,88px)]"}`}
              style={d(0.12)}
            >
              {p.title}
              <span className="hl-dot" aria-hidden="true" />
            </h1>

            <p className="reveal mt-6 max-w-[540px] text-[16px] leading-[26px] text-ink/60 sm:text-[17px] sm:leading-[28px]" style={d(0.2)}>
              {p.description}
            </p>

            <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row" style={d(0.28)}>
              {p.links?.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn-dark h-[48px]! px-6!">
                  {l.label} <ArrowUpRight className="h-[12px] w-[12px]" />
                </a>
              ))}
              <a href={CONTACT_PAGE} className={`btn-dark h-[48px]! px-6! ${p.links?.length ? "bg-white! text-ink! hover:bg-white/70!" : ""}`}>
                {HERO.secondaryCta} <ArrowUpRight className="h-[12px] w-[12px]" />
              </a>
            </div>
          </div>

          {/* Visual: live site preview when there is one, otherwise the project artwork. */}
          <div className="reveal mt-14 sm:mt-16" style={d(0.36)}>
            {p.preview ? (
              <div className="h-[clamp(420px,56vw,680px)]">
                <SitePreview url={p.preview.url} poster={p.preview.poster} title={p.title} />
              </div>
            ) : (
              <div className={`relative overflow-hidden rounded-[20px] ${p.imageFit === "contain" ? "h-[clamp(260px,36vw,460px)]" : "h-[clamp(300px,46vw,600px)]"}`} style={{ background: p.bg }}>
                <ProjectMedia project={p} sizes="(min-width: 1128px) 1128px, 100vw" priority large />
              </div>
            )}
          </div>

          {/* Info bar */}
          <dl className={`mt-6 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ink/12 pt-6 ${info.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {info.map((f) => (
              <div key={f.label}>
                <dt className="font-display text-[12px] font-medium text-ink/50">{f.label}</dt>
                <dd className="mt-1 font-display text-[15px] font-medium leading-[22px]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        {p.overview && (
          <Block label="The Meet-Cute">
            <p className="max-w-[760px] font-display text-[20px] leading-[32px] tracking-[-0.01em] sm:text-[24px] sm:leading-[36px]">{p.overview}</p>
          </Block>
        )}

        {features.length > 0 && (
          <Block label="Best Qualities">
            <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 sm:gap-y-12 xl:grid-cols-3">
              {features.map((f, i) => (
                <li key={f.title} className="step">
                  <span className="step-num" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <h3 className="mt-4 font-display text-[20px] font-medium tracking-[-0.02em]">{f.title}</h3>
                  <p className="mt-2 max-w-[34ch] text-[14px] leading-[22px] text-ink/65">{f.description}</p>
                </li>
              ))}
            </ol>
          </Block>
        )}

        {stack.length > 0 && (
          <Block label="My Wingmen" id="stack">
            <ul className="flex flex-wrap gap-2">
              {stack.map((t) => (
                <li key={t} className="inline-flex h-[38px] items-center rounded-full border border-ink/15 px-4 font-display text-[14px] font-medium">
                  {t}
                </li>
              ))}
            </ul>
          </Block>
        )}

        {/* ---------- Next project ---------- */}
        <Link
          href={`/work/${next.slug}`}
          data-cursor="view"
          className={`theme-light wrap card focus-ring group relative block overflow-hidden rounded-[20px] sm:min-h-[380px] ${nextLogo ? "min-h-[420px]" : "min-h-[300px]"}`}
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
            <span className={nextLight ? "pill-dark" : "chip-glass"}>Your next match · {pad(((index + 1) % PROJECTS.length) + 1)}</span>
            <span
              className={`mt-4 block font-display font-semibold leading-[1] tracking-[-0.025em] ${nextLong ? "text-[clamp(30px,9vw,40px)] sm:text-[56px]" : "text-[44px] sm:text-[72px]"}`}
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
