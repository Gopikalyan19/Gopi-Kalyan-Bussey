import type { Metadata } from "next";
import type { CSSProperties } from "react";
import ContactForm from "@/components/contact/ContactForm";
import { ArrowUpRight, Copy } from "@/components/icons";
import Footer from "@/components/sections/Footer";
import StickyNav from "@/components/sections/StickyNav";
import { CopyButton } from "@/components/ui/buttons";
import UIProvider from "@/components/ui/UIProvider";
import { CONTACT, PERSON } from "@/lib/content";

export const metadata: Metadata = {
  title: `Mail Me · ${PERSON.brand}`,
  description: `Get in touch with ${PERSON.name}, ${PERSON.title}.`,
};

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** Mail Me page: centred intro (like the home CTA), then other ways to reach me beside the form. */
export default function ContactPage() {
  const words = CONTACT.heading.split(" ");
  const head = words.slice(0, -2).join(" ");
  const tail = words.slice(-2).join(" ");
  // One hairline row per contact method: label on the left, value + icon on the right.
  const row = "group flex w-full items-center justify-between gap-4 border-t border-ink/12 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ink";
  const value = "flex items-center gap-2 font-display text-[16px] font-medium sm:text-[18px]";

  return (
    <UIProvider>
      <StickyNav back={{ href: "/", label: "Home" }} />

      <main id="main" className="px-4 pb-[120px] pt-[62px] md:px-8">
        <header className="wrap">
          <div className="mx-auto flex max-w-[960px] flex-col items-center pt-14 text-center sm:pt-20">
            <p className="reveal inline-flex items-center gap-2 rounded-full bg-white py-[7px] pl-[11px] pr-[14px] font-display text-[12px] text-ink/70" style={d(0.05)}>
              <span className="hero-live" aria-hidden="true" />
              {CONTACT.label}
            </p>
            <h1 className="reveal mt-6 font-display text-[clamp(40px,7vw,64px)] font-medium leading-[1.04] tracking-[-0.03em]" style={d(0.12)}>
              {head} <span className="font-light text-ink/45">{tail}</span>
            </h1>
            <p className="reveal mt-6 max-w-[480px] text-[16px] leading-[26px] text-ink/60 sm:text-[17px] sm:leading-[28px]" style={d(0.2)}>
              {CONTACT.sub}
            </p>
          </div>
        </header>

        <div className="wrap mt-16 grid gap-12 sm:mt-20 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          {/* Other ways to reach me */}
          <section aria-labelledby="reach-title" className="reveal" style={d(0.28)}>
            <h2 id="reach-title" className="sec-label">
              Other ways to reach me
            </h2>
            <ul className="mt-5 border-b border-ink/12">
              <li>
                <CopyButton text={PERSON.email} className={row}>
                  <span className="text-[13px] text-ink/55">Email · click to copy</span>
                  <span className={value}>
                    <span className="truncate">{PERSON.email}</span>
                    <Copy className="h-[14px] w-[14px] shrink-0 text-ink/40 transition-colors group-hover:text-ink" />
                  </span>
                </CopyButton>
              </li>
              <li>
                <a href={`tel:${PERSON.phone.replace(/\s/g, "")}`} className={row}>
                  <span className="text-[13px] text-ink/55">Phone</span>
                  <span className={value}>
                    {PERSON.phone}
                    <ArrowUpRight className="h-[12px] w-[12px] text-ink/40 transition-transform group-hover:rotate-45 group-hover:text-ink" />
                  </span>
                </a>
              </li>
              <li>
                <a href={PERSON.linkedin} target="_blank" rel="noreferrer" className={row}>
                  <span className="text-[13px] text-ink/55">LinkedIn</span>
                  <span className={value}>
                    Let&apos;s connect
                    <ArrowUpRight className="h-[12px] w-[12px] text-ink/40 transition-transform group-hover:rotate-45 group-hover:text-ink" />
                  </span>
                </a>
              </li>
            </ul>
          </section>

          {/* The form */}
          <section aria-labelledby="form-title" className="reveal rounded-[24px] bg-white p-6 sm:p-10" style={d(0.34)}>
            <p className="sec-label">Send a message</p>
            <h2 id="form-title" className="mt-3 font-display text-[26px] font-medium leading-[1.2] tracking-[-0.02em] sm:text-[30px]">
              Tell me everything. Don&apos;t be shy.
            </h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </UIProvider>
  );
}
