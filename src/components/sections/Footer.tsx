import type { ReactNode } from "react";
import Logo from "@/components/Logo";
import { ArrowUpRight } from "@/components/icons";
import Breathe from "@/components/ui/Breathe";
import { CopyButton } from "@/components/ui/buttons";
import { CONTACT, CONTACT_PAGE, MENU_LINKS, PERSON } from "@/lib/content";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="foot-head">{title}</p>
      <ul className="foot-list">{children}</ul>
    </div>
  );
}

/** Editorial footer: hairline, columns, and a giant cropped wordmark. "#top" works on every page. */
export default function Footer() {
  return (
    <footer className="overflow-hidden px-4 pt-6 md:px-8">
      <div className="foot-rise wrap border-t border-ink/12 pt-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <a href="#top" aria-label={`${PERSON.brand}, back to top`} className="focus-ring inline-block rounded-sm">
              <Logo size={40} className="text-[22px]! tracking-[-0.02em]!" />
            </a>
            <p className="mt-3 text-[14px] text-ink/55">
              {PERSON.name} · {PERSON.title}
            </p>
            <a href={CONTACT_PAGE} className="btn-dark mt-6 h-[42px]! px-5!">
              Start a project <ArrowUpRight className="h-[11px] w-[11px]" />
            </a>
            <Breathe />
          </div>
          <nav aria-label="Footer pages" className="col-span-2 sm:col-span-1">
            <Column title="Pages">
              {MENU_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hero-link">
                    {l.label}
                  </a>
                </li>
              ))}
            </Column>
          </nav>
          <nav aria-label="Footer socials">
            <Column title="Connect">
              <li>
                <a href={PERSON.linkedin} target="_blank" rel="noreferrer" className="hero-link inline-flex items-center gap-1">
                  LinkedIn <ArrowUpRight className="h-[10px] w-[10px]" />
                </a>
              </li>
              <li>
                <a href={CONTACT_PAGE} className="hero-link">
                  Mail Me
                </a>
              </li>
            </Column>
          </nav>
          <Column title="Contact">
            <li>
              <CopyButton text={PERSON.email} className="hero-link">
                {PERSON.email}
              </CopyButton>
            </li>
            <li>
              <a href={`tel:${PERSON.phone.replace(/\s/g, "")}`} className="hero-link">
                {PERSON.phone}
              </a>
            </li>
          </Column>
        </div>

        <div className="mt-14 flex flex-col-reverse gap-3 border-t border-ink/12 py-6 text-[12px] text-ink/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{CONTACT.copyright.replace(/\d{4}/, String(new Date().getFullYear()))}</p>
          <a href="#top" className="hero-link inline-flex items-center gap-1 self-start font-display font-medium sm:self-auto">
            Back to top <ArrowUpRight className="h-[11px] w-[11px] -rotate-45" />
          </a>
        </div>
      </div>

      {/* Giant wordmark, cropped by the page edge. */}
      <p aria-hidden="true" className="foot-mark">
        {PERSON.name}
      </p>
    </footer>
  );
}
