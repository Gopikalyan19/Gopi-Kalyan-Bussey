import { readFileSync } from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import { PERSON } from "@/lib/content";
import { CONTACT_MAX, isValidField, safeFirstName } from "@/lib/contact";

/**
 * POST /api/contact: sends the contact form through Gmail SMTP with an App Password.
 *   1. the message to Gopi (Reply-To = the visitor)
 *   2. a fixed-text confirmation to the visitor (only their letters-only first name goes in it,
 *      so this endpoint can't be used to relay spam to strangers)
 * Secrets live in env vars only (GMAIL_USER, GMAIL_APP_PASSWORD, optional CONTACT_TO).
 * Responds 503 when they aren't set, and the form then falls back to the visitor's email app.
 */

// ponytail: in-memory per-IP rate limit; each serverless instance has its own map, so it's
// best-effort. Move to a shared store (e.g. Upstash Redis) if the form ever gets abused.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();
const rateLimited = (ip: string) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
};

/** Doodle logo for the email signature, embedded inline (cid:) so it shows without loading anything. */
const LOGO_CID = "logo@specsandpixels";
const logo = (() => {
  try {
    return readFileSync(path.join(process.cwd(), "src/assets/logo-email.png"));
  } catch {
    return null; // the email still sends, just without the logo
  }
})();
const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "specsandpixels.vercel.app";

/** Signature: the doodle beside name, title and site. A table, so every email client lays it out the same. */
const signature = () => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e5e5;width:100%">
    <tr>
      ${logo ? `<td style="padding:16px 14px 0 0;vertical-align:middle;width:56px"><img src="cid:${LOGO_CID}" width="56" height="56" alt="${PERSON.brand}" style="display:block;border:0"></td>` : ""}
      <td style="padding-top:16px;vertical-align:middle;font-size:14px;line-height:1.5">
        <b style="font-size:15px">${PERSON.name}</b><br>
        <span style="color:#777">${PERSON.title}</span><br>
        <a href="https://${SITE}" style="color:#0e0e0e;font-weight:600;text-decoration:underline">${SITE}</a>
      </td>
    </tr>
  </table>`;

/** Confirmation email body (one paragraph per line): professional, with a light wink. No emojis. */
const CONFIRMATION = [
  "Thank you for reaching out. Your message landed safely in my inbox, and I'll admit, it already has my attention.",
  "I read every message personally and usually reply within one to two working days. Until then, feel free to take another look around my work.",
  "Looking forward to seeing where this goes.",
];

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return Response.json({ error: "Email isn't configured." }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: people never see the "company" field; bots fill it. Pretend it worked.
  if (body.company) return Response.json({ ok: true });

  const name = String(body.name ?? "").replace(/\s+/g, " ").trim(); // single line: it goes in the subject
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const topics = (Array.isArray(body.topics) ? body.topics : [])
    .map(String)
    .slice(0, 10)
    .map((t) => t.slice(0, 40));
  if (!isValidField("name", name) || !isValidField("email", email) || !isValidField("message", message)) {
    return Response.json({ error: "Please check the form fields." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ error: "Too many messages. Try again in a few minutes." }, { status: 429 });

  const transport = nodemailer.createTransport({ service: "gmail", auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } });
  const from = `"${PERSON.brand}" <${GMAIL_USER}>`;
  const interests = topics.join(", ") || "Not specified";

  try {
    // 1. The message, to Gopi.
    await transport.sendMail({
      from,
      to: CONTACT_TO || GMAIL_USER,
      replyTo: { name, address: email },
      subject: `New enquiry from ${name.slice(0, CONTACT_MAX.name)}`,
      text: [
        "You've caught someone's eye.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Interested in: ${interests}`,
        "",
        message,
        "",
        `Reply to this email to respond to ${name} directly.`,
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#0e0e0e;max-width:560px">
          <p style="margin:0 0 4px;font-size:12px;color:#777">New enquiry via ${escapeHtml(PERSON.brand)}</p>
          <h2 style="margin:0 0 20px;font-size:22px;font-weight:600">You've caught someone's eye.</h2>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;margin:0 0 20px">
            <tr><td style="padding:6px 16px 6px 0;color:#777;width:110px;vertical-align:top">Name</td><td style="padding:6px 0">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#777;vertical-align:top">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(email)}" style="color:#0e0e0e">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#777;vertical-align:top">Interested in</td><td style="padding:6px 0">${escapeHtml(interests)}</td></tr>
          </table>
          <div style="padding:16px 18px;background:#f4f4f4;border-radius:10px;white-space:pre-wrap">${escapeHtml(message)}</div>
          <p style="margin:20px 0 0;font-size:13px;color:#777">Reply to this email to respond to ${escapeHtml(name)} directly.</p>
        </div>`,
    });

    // 2. The confirmation, to the visitor. Nice-to-have: if it fails, the message still went out.
    const to = safeFirstName(name);
    await transport
      .sendMail({
        from,
        to: email,
        subject: `It's a match, ${to}`,
        text: [
          `Hi ${to},`,
          "",
          ...CONFIRMATION,
          "",
          "Warm regards,",
          PERSON.name,
          PERSON.title,
          `https://${SITE}`,
        ].join("\n"),
        html: `
          <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.65;color:#0e0e0e;max-width:520px">
            <p style="margin:0 0 16px">Hi ${escapeHtml(to)},</p>
            ${CONFIRMATION.map((p) => `<p style="margin:0 0 16px">${escapeHtml(p)}</p>`).join("")}
            <p style="margin:24px 0 0">Warm regards,</p>
            ${signature()}
          </div>`,
        attachments: logo ? [{ filename: "logo.png", content: logo, cid: LOGO_CID }] : [],
      })
      .catch((err) => console.error("Contact confirmation failed:", err));

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact email failed:", err);
    return Response.json({ error: "Couldn't send right now." }, { status: 502 });
  }
}
