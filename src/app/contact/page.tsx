import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import ContactForm from "@/components/contact/ContactForm";
import { ArrowUpRight, Copy, LinkedIn, Mail, Phone } from "@/components/icons";
import Footer from "@/components/sections/Footer";
import { CopyButton, MenuButton } from "@/components/ui/buttons";
import UIProvider from "@/components/ui/UIProvider";
import { CONTACT, PERSON } from "@/lib/content";

export const metadata: Metadata = {
  title: `Mail Me — ${PERSON.name}`,
  description: `Get in touch with ${PERSON.name}, ${PERSON.title}.`,
};

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** Mail Me page: intro + contact tiles on the left, the message form on the right. */
export default function ContactPage() {
  const tile = "card focus-ring flex items-center gap-4 rounded-[14px] bg-page p-4 text-left";
  const icon = "grid h-[44px] w-[44px] shrink-0 place-items-center rounded-[10px] bg-white [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:fill-current";

  return (
    <UIProvider>
      <div id="home" className="px-3 pt-3 md:px-4 md:pt-4">
        <nav aria-label="Contact" className="reveal flex h-[58px] items-center justify-between rounded-[14px] bg-white pl-4 pr-[6px] sm:pl-5">
          <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-sm font-display text-[13px] font-medium text-ink/70 transition-colors hover:text-ink">
            <ArrowUpRight className="h-[12px] w-[12px] -rotate-135" /> Home
          </Link>
          <Link href="/" className="focus-ring hidden rounded-sm font-display text-[16px] font-semibold tracking-[-0.01em] sm:block">
            {PERSON.name}
          </Link>
          <MenuButton />
        </nav>
      </div>

      <main id="main" className="px-3 pb-[100px] pt-3 md:px-4">
        <div className="grid gap-3 lg:min-h-[calc(100svh-104px)] lg:grid-cols-[1fr_1.1fr] lg:gap-4">
          {/* Left: intro + ways to reach me */}
          <section aria-labelledby="contact-title" className="flex flex-col rounded-[20px] bg-white px-6 pb-8 pt-10 sm:px-10 lg:px-14">
            <div className="flex flex-1 flex-col justify-center py-8">
              <span className="reveal inline-flex h-[32px] items-center gap-[7px] self-start rounded-[8px] bg-page px-[12px] font-display text-[12px] font-medium" style={d(0.05)}>
                <span className="h-[7px] w-[7px] rounded-full bg-red" aria-hidden="true" />
                Mail Me
              </span>
              <h1
                id="contact-title"
                className="reveal mt-6 max-w-[13ch] font-display text-[clamp(38px,9vw,48px)] font-semibold leading-[1.04] tracking-[-0.045em] sm:text-[60px] xl:text-[68px]"
                style={d(0.12)}
              >
                {CONTACT.heading.replace(/\?$/, "")}
                <span className="text-red">?</span>
              </h1>
              <p className="reveal mt-6 max-w-[440px] text-[16px] leading-[26px] text-ink/65" style={d(0.2)}>
                {CONTACT.sub}
              </p>
            </div>

            <ul className="reveal grid gap-2 border-t border-page pt-6" style={d(0.28)}>
              <li>
                <CopyButton text={PERSON.email} className={`${tile} w-full`}>
                  <span className={icon}>
                    <Mail />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] text-ink/65">Email · click to copy</span>
                    <span className="block truncate font-display text-[15px] font-medium">{PERSON.email}</span>
                  </span>
                  <Copy className="h-[15px] w-[15px] shrink-0 text-ink/45" />
                </CopyButton>
              </li>
              <li className="grid gap-2 sm:grid-cols-2">
                <a href={`tel:${PERSON.phone.replace(/\s/g, "")}`} className={tile}>
                  <span className={icon}>
                    <Phone />
                  </span>
                  <span>
                    <span className="block text-[11px] text-ink/65">Phone</span>
                    <span className="block font-display text-[15px] font-medium">{PERSON.phone}</span>
                  </span>
                </a>
                <a href={PERSON.linkedin} target="_blank" rel="noreferrer" className={tile}>
                  <span className={icon}>
                    <LinkedIn />
                  </span>
                  <span>
                    <span className="block text-[11px] text-ink/65">LinkedIn</span>
                    <span className="block font-display text-[15px] font-medium">Connect ↗</span>
                  </span>
                </a>
              </li>
            </ul>
          </section>

          {/* Right: the form */}
          <section aria-label="Send a message" className="reveal flex flex-col rounded-[20px] bg-white px-6 py-8 sm:px-10 sm:py-10 lg:justify-center lg:px-14" style={d(0.18)}>
            <p className="sec-label">Send a message</p>
            <p className="mt-3 font-display text-[26px] font-medium leading-[32px] tracking-[-0.02em] sm:text-[30px] sm:leading-[36px]">Tell me everything. Don&apos;t be shy.</p>
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
