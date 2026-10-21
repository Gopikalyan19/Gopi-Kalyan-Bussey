import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones on the same Wi-Fi use the dev server (e.g. http://192.168.1.6:3000).
  // Dev-only: production builds ignore this.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  // The contact email embeds the doodle logo in its signature; make sure Vercel ships the file.
  outputFileTracingIncludes: {
    "/api/contact": ["./src/assets/logo-email.png"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
