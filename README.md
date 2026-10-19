<div align="center">

<img src="src/assets/logo.png" alt="Specs & Pixels doodle logo" width="96" />

# Specs & Pixels

**The portfolio of Gopi Kalyan, UI/UX & Product Designer.**
_I design digital experiences you'll want to swipe right on._

[**View the live site →**](https://gopi-kalyan-bussey.vercel.app) &nbsp;·&nbsp; [LinkedIn](https://www.linkedin.com/in/gopi-kalyan-bb139731a) &nbsp;·&nbsp; [Email](mailto:gopibussey@gmail.com)

</div>

---

## About

A personal portfolio built to feel like a design piece in its own right: an editorial, monochrome
layout with a playful, flirty voice, scroll-driven storytelling, and a few small delights along the way.

## Highlights

- **Editorial design system:** one consistent language of hairlines, large type and soft greys, from the hero to the case studies.
- **Scroll-stop storytelling:** _About_ and _What I Do_ pin to the screen and animate with your scroll.
- **Scroll-driven entrances:** sections rise into place as they enter view, with native CSS scroll timelines and no animation library.
- **Case-study pages** for each project: overview, features, stack, a live site preview where there is one, and a "next match" hand-off.
- **Shiro 🐹:** a pixel-art hamster that follows the cursor, reacts to each section, cheers on the contact buttons and can be petted (gently).
- **Pixel-art cursor** that matches Shiro, plus a short branded intro on load.
- **Accessible by default:** keyboard focus states, screen-reader text, and every animation turned off for visitors who prefer reduced motion.
- **Fast:** statically generated pages, optimised images and self-hosted fonts.

## Built with

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, static generation) |
| UI | [React 19](https://react.dev), TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Type | Bricolage Grotesque, Geist; handwritten Nanum Pen Script, Sriracha and Zhi Mang Xing for the language tiles |
| Icons | [Simple Icons](https://simpleicons.org) |
| Hosting | [Vercel](https://vercel.com) |

## Run it locally

You'll need [Node.js](https://nodejs.org) 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To preview on your phone, open `http://<your-computer's-IP>:3000` on the same Wi-Fi. Local network addresses are already allowed in `next.config.ts`.

## Editing the content

Almost everything you read on the site lives in one file: **`src/lib/content.ts`**.

| To change… | Edit |
|---|---|
| Name, brand, email, phone, LinkedIn | `PERSON` |
| Hero headline and intro | `HERO` |
| About, services, process, experience | `ABOUT`, `SERVICES`, `PROCESS`, `EXPERIENCE` |
| Projects and case studies | `PROJECTS` (one entry per project; each gets its own page at `/work/<slug>`) |
| Tools, tech and spoken languages | `SKILLS` |
| Navigation links | `MENU_LINKS` |
| What Shiro says | `LINES` at the top of `src/components/ui/HamsterPet.tsx` |

Images live in `public/projects/` and `public/skills/`. The portrait and logo are in `src/assets/`.

## Project structure

```
src/
├── app/                 Pages: home, /contact, /work/[slug], icons and share image
├── components/
│   ├── sections/        Home page sections (Hero, About, Services, Process…)
│   ├── work/            Portfolio grid and project media
│   ├── contact/         Contact form
│   └── ui/              Header menu, cursor, Shiro, intro, toasts
└── lib/
    ├── content.ts       All site copy and data
    └── useScrollStop.ts Scroll-pinning helper
```

## Build and deploy

```bash
npm run build   # production build
npm start       # serve the build locally
```

Every push to `main` deploys to Vercel automatically. The site URL and the link-preview image are picked up with no extra setup.

---

<div align="center">

Designed and built by **Gopi Kalyan**, with ♥ (and a little too much coffee).

</div>
