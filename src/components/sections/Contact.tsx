import { ArrowUpRight, Copy } from "@/components/icons";
import { CopyButton } from "@/components/ui/buttons";
import { CONTACT, CONTACT_PAGE, PERSON } from "@/lib/content";

/** Closing CTA: dark grid card; the heading's last two words drop to a light grey (like the hero). */
export default function Contact() {
  const words = CONTACT.heading.split(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-[72px] px-4 pb-3 md:px-8">
      <div className="keep-dark wrap monogram-tile relative overflow-hidden rounded-[24px] bg-ink">
        {/* Soft glow behind the heading. */}
        <span className="pointer-events-none absolute left-1/2 top-[-30%] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-white/[0.07] blur-[90px]" aria-hidden="true" />
        <div className="relative flex min-h-[480px] flex-col items-center justify-center px-6 py-20 text-center text-white">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 py-[6px] pl-[11px] pr-[14px] font-display text-[12px] text-white/75">
            <span className="hero-live" aria-hidden="true" />
            {CONTACT.label}
          </p>
          <h2 id="contact-title" className="mt-6 max-w-[820px] font-display text-[40px] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[64px]">
            {head} <span className="font-light text-white/55">{tail}</span>
          </h2>
          <p className="mt-5 max-w-[460px] text-[15px] leading-[24px] text-white/65 sm:text-[16px] sm:leading-[26px]">{CONTACT.sub}</p>
          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a href={CONTACT_PAGE} className="btn-light h-[48px]! px-6!">
              Mail Me <ArrowUpRight className="h-[12px] w-[12px]" />
            </a>
            <CopyButton text={PERSON.email} className="btn-glass h-[48px]! px-6!">
              <Copy className="h-[14px] w-[14px]" />
              {PERSON.email}
            </CopyButton>
          </div>
        </div>
      </div>
    </section>
  );
}
