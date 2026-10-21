import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import DeferredExtras from "@/components/ui/DeferredExtras";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], axes: ["opsz"], display: "swap" });

/** Absolute base for share links and the OG image. Vercel sets this env var in production. */
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Tab title: brand first (it's what fits in a Chrome tab), then the name for search.
  title: "Specs & Pixels · Gopi Kalyan",
  description:
    "Gopi Kalyan is a UI/UX and product designer creating intuitive digital experiences, thoughtful interfaces, and meaningful products. Explore his work, case studies, and design process.",
  keywords: [
    "UI/UX Designer",
    "Product Designer",
    "UI Designer",
    "UX Designer",
    "Product Design Portfolio",
    "UI/UX Portfolio",
    "UX Design Portfolio",
    "Web Designer",
    "Digital Product Designer",
    "UI Designer India",
  ],
  authors: [{ name: "Gopi Kalyan" }],
  openGraph: {
    title: "Specs & Pixels · Gopi Kalyan, UI/UX & Product Designer",
    description: "Exploring the intersection of design, technology, and human experiences through thoughtful digital products.",
    type: "website",
    locale: "en_US",
    siteName: "Specs & Pixels",
  },
  twitter: {
    card: "summary_large_image",
    title: "Specs & Pixels · Gopi Kalyan, Designing Digital Experiences",
    description: "UI/UX & Product Designer creating simple, meaningful, and engaging digital experiences.",
  },
};

export const viewport: Viewport = { themeColor: "#ededed" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme script below sets data-theme on <html> before React loads.
    <html lang="en" className={`${bricolage.variable} ${geist.variable}`} suppressHydrationWarning>
      <body className="bg-page font-body text-ink antialiased">
        {/* Apply the saved night/day choice before first paint, so there's no flash. */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}` }} />
        <a href="#main" className="focus-ring fixed left-4 top-4 z-[130] -translate-y-24 rounded-[9px] bg-ink px-4 py-3 font-display text-[13px] font-medium text-white focus:translate-y-0">
          Skip to content
        </a>
        {children}
        <DeferredExtras />
      </body>
    </html>
  );
}
