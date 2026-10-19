import { ArrowUpRight } from "@/components/icons";
import { EXPERIENCE, PERSON } from "@/lib/content";
import SectionHead from "./SectionHead";

/** Hairline rows, like the process steps: company + role, what I did, and when. */
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="sec">
      <SectionHead id="experience-title" label={EXPERIENCE.label} title={EXPERIENCE.heading} />
      <ol className="wrap mt-14 border-b border-ink/12">
        {EXPERIENCE.items.map((x) => (
          <li key={x.company} className="xp-row">
            <div>
              <h3 className="xp-role">{x.company}</h3>
              <p className="mt-1 font-display text-[13px] text-ink/55">{x.role}</p>
            </div>
            <p className="xp-desc">{x.description}</p>
            {x.period && <p className="font-display text-[13px] tabular-nums text-ink/55 sm:text-right">{x.period}</p>}
          </li>
        ))}
      </ol>
      <div className="wrap mt-8">
        <a href={PERSON.linkedin} target="_blank" rel="noreferrer" className="hero-link inline-flex items-center gap-2 font-display text-[13px] font-medium">
          {EXPERIENCE.cta} <ArrowUpRight className="h-[11px] w-[11px]" />
        </a>
      </div>
    </section>
  );
}
