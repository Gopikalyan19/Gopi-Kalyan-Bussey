"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import logo from "@/assets/logo.png";
import { ArrowUpRight } from "@/components/icons";
import { useUI } from "@/components/ui/UIProvider";
import { CONTACT_MAX, isValidField, type ContactField } from "@/lib/contact";
import { PERSON, SERVICES } from "@/lib/content";

type Field = ContactField;

const ERRORS: Record<Field, string> = {
  name: "I'd love to know who I'm talking to.",
  email: "Enter a valid email, like you@company.com.",
  message: "Don't leave me hanging. Tell me about your project!",
};

const valid = isValidField;
const MAX = CONTACT_MAX;

/**
 * Mail Me form. Posts to /api/contact, which emails Gopi through Gmail (Reply-To = visitor)
 * and sends the visitor a short confirmation. If email isn't configured on the server (503),
 * it falls back to opening the visitor's email app with the message written.
 */
export default function ContactForm() {
  const { showToast } = useUI();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [topics, setTopics] = useState<string[]>([]);
  const [invalid, setInvalid] = useState<Partial<Record<Field, boolean>>>({});
  /** How it went out: emailed by the server, or handed to the visitor's email app. */
  const [sent, setSent] = useState<false | "email" | "mailto">(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const update = (f: Field, v: string) => {
    setValues((s) => ({ ...s, [f]: v }));
    if (invalid[f]) setInvalid((s) => ({ ...s, [f]: !valid(f, v) }));
  };
  const toggle = (t: string) => setTopics((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    // Honeypot: real people never see or fill the hidden "company" field; bots do.
    if (new FormData(formRef.current!).get("company")) {
      setSent("email");
      return;
    }
    const fields: Field[] = ["name", "email", "message"];
    const bad = Object.fromEntries(fields.map((f) => [f, !valid(f, values[f])])) as Record<Field, boolean>;
    setInvalid(bad);
    const first = fields.find((f) => bad[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const subject = `Project enquiry from ${values.name.trim()}`;
    const body = [
      `Hi ${PERSON.name.split(" ")[0]},`,
      "",
      values.message.trim(),
      ...(topics.length ? ["", `Interested in: ${topics.join(", ")}`] : []),
      "",
      `— ${values.name.trim()} (${values.email.trim()})`,
    ].join("\n");

    const openMailApp = () => {
      window.location.href = `mailto:${PERSON.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setSent("mailto");
      showToast("Opening your email app…");
    };

    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, topics, company: new FormData(formRef.current!).get("company") ?? "" }),
      });
      if (res.status === 503) return openMailApp(); // email not set up on the server yet
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: "" }));
        setError(res.status === 429 ? msg : "Hmm, that didn't go through.");
        return;
      }
      setSent("email");
      showToast("Message sent ♥");
    } catch {
      setError("Hmm, that didn't go through.");
    } finally {
      setSending(false);
    }
  };

  const inputCls = (f: Field) =>
    `mt-2 block w-full rounded-[10px] border bg-page px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:bg-white ${
      invalid[f] ? "border-red bg-white" : "border-transparent focus:border-ink"
    }`;

  if (sent) {
    // "It's a match!": Gopi's doodle and the visitor's initials slide together, a heart pops.
    const initials = values.name
      .replace(/[^\p{L}\s]/gu, "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
    return (
      <div className="flex flex-col items-center py-8 text-center" role="status">
        <div className="match-pair" aria-hidden="true">
          <Image src={logo} alt="" width={84} height={84} className="match-avatar match-left bg-page" />
          <span className="match-heart">♥</span>
          <span className="match-avatar match-right grid place-items-center bg-ink font-display text-[28px] font-medium text-white">{initials || "?"}</span>
        </div>
        <p className="match-title mt-6 font-display text-[40px] font-medium leading-none tracking-[-0.03em] sm:text-[48px]">It&apos;s a match!</p>
        <p className="mt-4 max-w-[380px] text-[15px] leading-[24px] text-ink/65">
          {sent === "email"
            ? `You and ${PERSON.name.split(" ")[0]} both want to build something great. Your message just landed in my inbox, and a little confirmation is on its way to yours.`
            : `You and ${PERSON.name.split(" ")[0]} both want to build something great. Your email app should be open with the message ready, so just hit send.`}
        </p>
        {sent === "mailto" && (
          <p className="mt-2 text-[13px] text-ink/50">
            Nothing opened? Email <span className="font-medium text-ink">{PERSON.email}</span>
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            if (sent === "email") setValues({ name: "", email: "", message: "" });
            setSent(false);
          }}
          className="btn-dark mt-7 h-[44px]! bg-page! px-5! text-ink! hover:bg-ghost!"
        >
          {sent === "email" ? "Send another" : "Edit message"}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-busy={sending} className="space-y-5">
      {/* Honeypot: hidden from people (and screen readers); bots that fill it are dropped. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
      <div className="grid gap-5 sm:grid-cols-2">
        {(["name", "email"] as const).map((f) => (
          <label key={f} className="block">
            <span className="font-display text-[12px] font-medium text-ink/70">{f === "name" ? "Your name" : "Your email"}</span>
            <input
              name={f}
              type={f === "email" ? "email" : "text"}
              autoComplete={f}
              placeholder={f === "name" ? "Jane Doe" : "you@company.com"}
              value={values[f]}
              maxLength={MAX[f]}
              onChange={(e) => update(f, e.target.value)}
              onBlur={() => values[f] && setInvalid((s) => ({ ...s, [f]: !valid(f, values[f]) }))}
              aria-invalid={!!invalid[f]}
              aria-describedby={invalid[f] ? `${f}-err` : undefined}
              className={inputCls(f)}
            />
            {invalid[f] && (
              <span id={`${f}-err`} className="mt-1.5 block text-[12px] text-red">
                {ERRORS[f]}
              </span>
            )}
          </label>
        ))}
      </div>

      <fieldset>
        <legend className="font-display text-[12px] font-medium text-ink/70">I&apos;m interested in</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SERVICES.items.map(({ title }) => {
            const on = topics.includes(title);
            return (
              <button
                key={title}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(title)}
                className={`focus-ring h-[36px] rounded-[9px] px-4 font-display text-[12px] font-medium transition-colors ${
                  on ? "bg-ink text-white" : "bg-page text-ink/75 hover:bg-ghost"
                }`}
              >
                {on && <span aria-hidden="true">✓ </span>}
                {title}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="block">
        <span className="font-display text-[12px] font-medium text-ink/70">Your message</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Spill the tea: what are you building, by when, and why does it matter?"
          value={values.message}
          maxLength={MAX.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={!!invalid.message}
          aria-describedby={invalid.message ? "message-err" : undefined}
          className={`${inputCls("message")} resize-y`}
        />
        {invalid.message && (
          <span id="message-err" className="mt-1.5 block text-[12px] text-red">
            {ERRORS.message}
          </span>
        )}
      </label>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-ink/65">Lands straight in my inbox. You&apos;ll get a confirmation too.</p>
        <button type="submit" disabled={sending} className="btn-dark disabled:cursor-wait disabled:opacity-70">
          {sending ? "Sending…" : "Send it my way"} <ArrowUpRight className="h-[12px] w-[12px]" />
        </button>
      </div>
      {error && (
        <p role="alert" className="rounded-[10px] bg-page px-4 py-3 text-[13px] leading-[20px] text-ink/75">
          {error} Try again in a moment, or{" "}
          <a href={`mailto:${PERSON.email}`} className="font-medium text-ink underline underline-offset-2">
            email me directly
          </a>
          .
        </p>
      )}
    </form>
  );
}
