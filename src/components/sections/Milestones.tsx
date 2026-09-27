import Image from "next/image";
import { MILESTONES } from "@/lib/content";
import SectionHead from "./SectionHead";

/**
 * Milestones: MENTIS 24 as the featured card (photo, stats, details, winners), with
 * mental health advocacy and the hackathon's theme alongside.
 */
export default function Milestones() {
  const m = MILESTONES.mentis;
  const a = MILESTONES.advocate;

  return (
    <section id="milestones" aria-labelledby="milestones-title" className="sec">
      <SectionHead id="milestones-title" label={MILESTONES.label} title={MILESTONES.heading} />

      <div className="wrap mt-12 grid gap-3 lg:grid-cols-[1.45fr_1fr]">
        {/* Featured: MENTIS 24 */}
        <article aria-labelledby="mentis-title" className="flex flex-col rounded-[20px] bg-white p-3">
          <div className="relative aspect-[620/303] overflow-hidden rounded-[14px] bg-page">
            <Image src={m.image} alt={m.imageAlt} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
            <span className="chip-glass absolute left-4 top-4">{m.date}</span>
          </div>

          <div className="flex flex-1 flex-col px-3 pb-4 pt-6 sm:px-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill-dark bg-red">{m.role}</span>
              <span className="inline-flex h-[28px] items-center rounded-[8px] bg-page px-3 font-display text-[11px] font-medium">{m.subtitle}</span>
            </div>
            <h3 id="mentis-title" className="mt-4 font-display text-[40px] font-semibold leading-[1] tracking-[-0.04em] sm:text-[52px]">
              {m.title}
              <span className="hl-dot" aria-hidden="true" />
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Highlights">
              {m.highlights.map((h, i) => (
                <li
                  key={h}
                  className={`inline-flex h-[34px] items-center gap-2 rounded-[9px] px-3 font-display text-[12px] font-semibold ${
                    i === 0 ? "bg-ink text-white" : "bg-[#fff4d6] text-[#7a5200]"
                  }`}
                >
                  <span aria-hidden="true" className={i === 0 ? "text-[#f5c542]" : "text-[#d4a017]"}>
                    {i === 0 ? "★" : "✦"}
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-[60ch] text-[15px] leading-[24px] text-ink/70">{m.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {m.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse rounded-[12px] bg-page px-4 py-4 last:col-span-2 sm:last:col-span-1">
                  <dt className="mt-2 text-[12px] leading-[16px] text-ink/65">{s.label}</dt>
                  <dd className="font-display text-[26px] font-semibold leading-none tracking-[-0.03em] sm:text-[32px]">{s.value}</dd>
                </div>
              ))}
            </dl>

            <dl className="mt-6 grid gap-4 border-t border-page pt-6 text-[14px] leading-[22px] sm:grid-cols-2">
              <div>
                <dt className="font-display text-[12px] font-medium text-red">Venue</dt>
                <dd className="mt-1 text-ink/80">{m.venue}</dd>
              </div>
              <div>
                <dt className="font-display text-[12px] font-medium text-red">Organised by</dt>
                <dd className="mt-1 text-ink/80">{m.organisers}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-page pt-6">
              <p className="font-display text-[12px] font-medium text-red">Winners</p>
              <ul className="mt-3 space-y-2">
                {m.winners.map((w) => (
                  <li key={w.place} className="flex items-center gap-4 rounded-[12px] bg-page px-4 py-3">
                    <span className={`grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full font-display text-[13px] font-semibold text-white ${w.place === "1st" ? "bg-[#d4a017]" : "bg-[#b0703c]"}`}>
                      {w.place}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[15px] font-medium leading-[20px]">{w.project}</span>
                      <span className="block text-[12px] leading-[18px] text-ink/65">{w.team}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* Side column */}
        <div className="grid gap-3 lg:grid-rows-[auto_1fr]">
          <article aria-labelledby="advocate-title" className="flex flex-col rounded-[20px] bg-red p-7 text-white sm:p-9">
            <div>
              <span className="pill-light">{a.label}</span>
              <h3 id="advocate-title" className="mt-8 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[40px]">
                {a.title}
              </h3>
              <p className="mt-4 max-w-[40ch] text-[15px] leading-[24px] text-white/90">{a.description}</p>
            </div>
            <ul className="mt-8 grid gap-2">
              {a.points.map((pt) => (
                <li key={pt} className="flex items-center gap-3 rounded-[12px] bg-white/10 px-4 py-3 text-[14px] font-medium">
                  <span aria-hidden="true" className="text-white/80">♥</span>
                  {pt}
                </li>
              ))}
            </ul>
          </article>

          <figure className="monogram-tile relative flex flex-col justify-between gap-8 overflow-hidden rounded-[20px] bg-[#25262B] p-7 text-white sm:p-9">
            <span className="absolute inset-0 bg-linear-to-b from-black/0 to-black/40" aria-hidden="true" />
            <p className="relative font-display text-[12px] font-medium text-white/80">The MENTIS 24 theme</p>
            <blockquote className="relative mt-4 font-display text-[22px] font-medium leading-[30px] tracking-[-0.02em]">“{m.focus}”</blockquote>
          </figure>
        </div>
      </div>
    </section>
  );
}
