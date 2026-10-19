import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import SectionHead from "@/components/sections/SectionHead";
import { PROJECTS, WORK, type Project } from "@/lib/content";
import ProjectMedia from "./ProjectMedia";

/** Short tag list for a card: the tech stack if known, otherwise the focus areas. */
const tagsFor = (p: Project) => (p.stack?.length ? p.stack : p.focus.split(" · ")).slice(0, 3);

function ProjectCard({ project: p, index, wide = false, flip = false }: { project: Project; index: number; wide?: boolean; flip?: boolean }) {
  return (
    <Link
      href={`/work/${p.slug}`}
      data-cursor="view"
      className={`work-card focus-ring group grid h-full gap-5 rounded-[20px] ${wide ? "md:grid-cols-[1.35fr_1fr] md:items-center md:gap-12" : ""}`}
    >
      <span className={`relative block aspect-[16/10] overflow-hidden rounded-[20px] ${wide ? "md:aspect-auto md:min-h-[400px]" : ""} ${flip ? "md:order-2" : ""}`}>
        <ProjectMedia project={p} sizes={wide ? "(min-width: 768px) 700px, 100vw" : "(min-width: 768px) 560px, 100vw"} priority={index === 0} />
        <span className="arrow-btn absolute right-[14px] top-[14px]">
          <ArrowUpRight className="h-[13px] w-[13px]" />
        </span>
      </span>

      <span className="flex flex-col">
        <span className="flex items-baseline gap-3 font-display text-[13px]">
          <span className="font-light tabular-nums text-ink/40">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-ink/60">{p.tagline}</span>
        </span>
        <span className={`work-title mt-2 block font-display font-medium tracking-[-0.025em] ${wide ? "text-[30px] leading-[1.1] md:text-[44px]" : "text-[26px] leading-[1.15]"}`}>
          {p.title}
        </span>
        <span className={`mt-3 block max-w-[52ch] text-[14px] leading-[22px] text-ink/60 ${wide ? "" : "line-clamp-2"}`}>{p.description}</span>
        <span className="mt-4 font-display text-[12px] text-ink/45">{tagsFor(p).join("  ·  ")}</span>
        {wide && (
          <span className="mt-7 inline-flex items-center gap-1 font-display text-[13px] font-medium">
            View project <ArrowUpRight className="h-[11px] w-[11px] transition-transform duration-300 group-hover:rotate-45" />
          </span>
        )}
      </span>
    </Link>
  );
}

/**
 * Selected Work: the first and last projects as wide feature cards (image beside the text),
 * the ones in between two per row. Every card opens the project's own page.
 */
export default function Work() {
  const last = PROJECTS.length - 1;
  return (
    <section id="portfolio" aria-labelledby="work-title" className="sec">
      <SectionHead id="work-title" label={WORK.label} title={WORK.heading} />

      <ul className="wrap mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2">
        {PROJECTS.map((p, i) => {
          const wide = i === 0 || i === last;
          return (
            <li key={p.slug} className={wide ? "md:col-span-2" : undefined}>
              <ProjectCard project={p} index={i} wide={wide} flip={i === last} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
