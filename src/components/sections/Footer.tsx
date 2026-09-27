import { ArrowUpRight } from "@/components/icons";
import { CopyButton } from "@/components/ui/buttons";
import { CONTACT, CONTACT_PAGE, MENU_LINKS, PERSON } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="px-4 pb-6 pt-3 md:px-8">
      <div className="wrap grid gap-10 rounded-[14px] bg-white p-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <a href="#home" className="focus-ring rounded-sm font-display text-[20px] font-semibold tracking-[-0.01em]">
            {PERSON.name}
          </a>
          <p className="mt-3 max-w-[260px] text-[13px] leading-[19px] text-ink/65">{PERSON.title}</p>
        </div>
        <nav aria-label="Footer pages">
          <p className="foot-head">Pages</p>
          <ul className="foot-list">
            {MENU_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer socials">
          <p className="foot-head">Socials</p>
          <ul className="foot-list">
            <li>
              <a href={PERSON.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={CONTACT_PAGE}>Mail Me</a>
            </li>
          </ul>
        </nav>
        <div>
          <p className="foot-head">Contact</p>
          <ul className="foot-list">
            <li>
              <CopyButton text={PERSON.email}>{PERSON.email}</CopyButton>
            </li>
            <li>
              <a href={`tel:${PERSON.phone.replace(/\s/g, "")}`}>{PERSON.phone}</a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-page pt-6 text-[11px] text-ink/60 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between lg:col-span-4">
          <p>{CONTACT.copyright.replace(/\d{4}/, String(new Date().getFullYear()))}</p>
          <a href="#home" className="focus-ring inline-flex items-center gap-1 rounded-sm font-display font-medium text-ink">
            Back to top
            <ArrowUpRight className="h-[11px] w-[11px] -rotate-45" />
          </a>
        </div>
      </div>
      <p aria-hidden="true" className="pointer-events-none mt-4 select-none overflow-hidden whitespace-nowrap text-center font-display text-[15vw] font-medium leading-[1.08] tracking-[-0.04em] text-ghost">
        {PERSON.name}
      </p>
    </footer>
  );
}
