import { ArrowUpRight, Copy } from "@/components/icons";
import { CopyButton } from "@/components/ui/buttons";
import { CONTACT, CONTACT_PAGE, PERSON } from "@/lib/content";

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-[72px] px-4 pb-3 md:px-8">
      <div className="wrap monogram-tile relative overflow-hidden rounded-[20px] bg-ink">
        <span className="absolute inset-0 bg-linear-to-b from-white/0 via-white/0 to-white/5" />
        <div className="relative flex min-h-[460px] flex-col items-center justify-center px-6 py-16 text-center text-white">
          <h2 id="contact-title" className="max-w-[760px] font-display text-[40px] font-medium leading-[46px] tracking-[-0.03em] sm:text-[64px] sm:leading-[70px]">
            {CONTACT.heading}
          </h2>
          <p className="mt-5 max-w-[460px] text-[15px] leading-[23px] text-white/80">{CONTACT.sub}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={CONTACT_PAGE} className="btn-light">
              Mail Me <ArrowUpRight className="h-[12px] w-[12px]" />
            </a>
            <CopyButton text={PERSON.email} className="btn-glass">
              <Copy className="h-[14px] w-[14px]" />
              {PERSON.email}
            </CopyButton>
          </div>
        </div>
      </div>
    </section>
  );
}
