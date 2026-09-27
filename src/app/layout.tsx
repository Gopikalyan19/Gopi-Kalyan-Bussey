import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import DeferredExtras from "@/components/ui/DeferredExtras";
import "./globals.css";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["300", "400", "500", "600"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Gopi Kalyan — UI/UX & Product Designer",
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
    title: "Gopi Kalyan — UI/UX & Product Designer",
    description: "Exploring the intersection of design, technology, and human experiences through thoughtful digital products.",
    type: "website",
    locale: "en_US",
    siteName: "Gopi Kalyan Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gopi Kalyan — Designing Digital Experiences",
    description: "UI/UX & Product Designer creating simple, meaningful, and engaging digital experiences.",
  },
};

export const viewport: Viewport = { themeColor: "#ededed" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="bg-page font-body text-ink antialiased">
        <a href="#main" className="focus-ring fixed left-4 top-4 z-[130] -translate-y-24 rounded-[9px] bg-ink px-4 py-3 font-display text-[13px] font-medium text-white focus:translate-y-0">
          Skip to content
        </a>
        {children}
        <DeferredExtras />
      </body>
    </html>
  );
}
