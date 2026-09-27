"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight } from "@/components/icons";
import { useUI } from "@/components/ui/UIProvider";
import { PERSON, SERVICES } from "@/lib/content";

type Field = "name" | "email" | "message";

const ERRORS: Record<Field, string> = {
  name: "I'd love to know who I'm talking to.",
  email: "Enter a valid email, like you@company.com.",
  message: "Don't leave me hanging. Tell me about your project!",
};

const valid = (f: Field, v: string) => (f === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) : v.trim().length > 0);

/**
 * Mail Me form. No backend: on send it opens the visitor's email app with a message to
 * Gopi already written (subject, body, chosen services). To send from the page instead,
 * post `values` to a form service (Resend, Formspree…) in `submit`.
 */
export default function ContactForm() {
  const { showToast } = useUI();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [topics, setTopics] = useState<string[]>([]);
  const [invalid, setInvalid] = useState<Partial<Record<Field, boolean>>>({});
  const [sent, setSent] = useState(false);

  const update = (f: Field, v: string) => {
    setValues((s) => ({ ...s, [f]: v }));
    if (invalid[f]) setInvalid((s) => ({ ...s, [f]: !valid(f, v) }));
  };
  const toggle = (t: string) => setTopics((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
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
    window.location.href = `mailto:${PERSON.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    showToast("Opening your email app…");
  };

  const inputCls = (f: Field) =>
    `mt-2 block w-full rounded-[10px] border bg-page px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:bg-white ${
      invalid[f] ? "border-red bg-white" : "border-transparent focus:border-ink"
    }`;

  if (sent) {
    return (
      <div className="flex h-full flex-col items-start justify-center py-10" role="status">
        <span className="pill-dark bg-red">Almost there</span>
        <p className="mt-5 font-display text-[28px] font-medium leading-[34px] tracking-[-0.02em]">Your email app should be open with the message ready.</p>
        <p className="mt-3 max-w-[420px] text-[14px] leading-[22px] text-ink/65">
          Just press send. If nothing opened, email me directly at <span className="kw kw-red">{PERSON.email}</span>.
        </p>
        <button type="button" onClick={() => setSent(false)} className="btn-dark mt-7 bg-page! text-ink! hover:bg-[#e2e2e2]!">
          Edit message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="space-y-5">
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
                  on ? "bg-ink text-white" : "bg-page text-ink/75 hover:bg-[#e2e2e2]"
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
        <p className="text-[12px] text-ink/65">Opens your email app with everything filled in.</p>
        <button type="submit" className="btn-dark">
          Send it my way <ArrowUpRight className="h-[12px] w-[12px]" />
        </button>
      </div>
    </form>
  );
}
