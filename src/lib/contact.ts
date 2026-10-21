/** Contact form rules, shared by the form (instant feedback) and the API route (enforcement). */

export type ContactField = "name" | "email" | "message";

/** Max lengths, so nobody can push huge payloads through the form. */
export const CONTACT_MAX: Record<ContactField, number> = { name: 80, email: 120, message: 2000 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isValidField = (f: ContactField, v: string) => {
  const t = v.trim();
  if (!t || t.length > CONTACT_MAX[f]) return false;
  return f === "email" ? EMAIL_RE.test(t) : true;
};

/** Letters-only first name: the only visitor text that goes into the confirmation email. */
export const safeFirstName = (name: string) =>
  name
    .replace(/[^\p{L}\p{M}\s'-]/gu, "")
    .trim()
    .split(/\s+/)[0]
    ?.slice(0, 30) || "there";
