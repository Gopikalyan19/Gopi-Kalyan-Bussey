/**
 * All site copy lives here. The voice is playful and a little sassy; the facts (roles,
 * skills, projects) come from the existing Gopikalyan-main site and earlier portfolio.
 * Highlighted phrases must match KEYWORDS (bottom of this file) word for word.
 */

export const PERSON = {
  name: "Gopi Kalyan",
  title: "UI/UX & Product Designer",
  email: "gopibussey@gmail.com",
  phone: "+91 63014 62658",
  linkedin:
    "https://www.linkedin.com/in/gopi-kalyan-bb139731a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
};

/** The Mail Me page (contact form). */
export const CONTACT_PAGE = "/contact";

export const MAILTO = {
  hero: `mailto:${PERSON.email}?subject=Let’s%20Work%20Together!&body=Hi%20Gopi,%20I'd%20love%20to%20collaborate%20with%20you%20on%20a%20project.`,
  nav: `mailto:${PERSON.email}?subject=Let’s%20Create%20Magic!&body=Hey%20[Your%20Name],%20I%20love%20your%20work!%20Let’s%20talk%20about%20something%20amazing.%20🔥`,
  plain: `mailto:${PERSON.email}`,
};

export const HERO = {
  eyebrow: "Gopi Kalyan — UI/UX & Product Designer",
  headline: "I design digital experiences you'll want to swipe right on.",
  intro:
    "Hey, I'm Gopi Kalyan, a UI/UX and product designer who turns messy, complicated problems into simple, intuitive, and meaningful experiences. The kind people don't just use, they get attached to.",
  support:
    "Design, tech, and a healthy obsession with human-centered thinking. I make products that look good, work even better, and never leave users on read.",
  primaryCta: "Check Out My Work",
  secondaryCta: "Slide Into My Inbox",
};

export const ABOUT = {
  label: "About Me",
  heading: "Good design is my love language.",
  paragraphs: [
    "I'm a UI/UX and product designer with a serious soft spot for the place where creativity, technology, and human behavior meet. That's where all the fun happens.",
    "I don't believe in love at first sight. My approach starts with understanding the problem before designing the solution, then I research, experiment, prototype, test, and refine until it feels effortless.",
    "I don't hand off pretty screens and ghost. I love to collaborate closely with developers and watch a design go from an idea on a screen to a real, living product.",
    "Things that make my heart skip a beat: digital products, emerging tech, mental wellbeing, and the tiny details that make everyday moments a little better.",
  ],
};

export const SERVICES = {
  label: "What I Do",
  heading: "Here's what I bring to the table (besides charm).",
  items: [
    { title: "UI/UX Design", description: "Interfaces so intuitive your users won't need a manual. Usable, beautiful, and right on brand." },
    { title: "Product Design", description: "From \"what if\" to \"wow\". Research, ideation, prototyping, and iteration until your product is ready for its close-up." },
    { title: "Web Design", description: "Responsive websites that make a great first impression, and an even better second one." },
    { title: "Design Systems", description: "Consistent, scalable visual systems. Because your buttons deserve a committed relationship." },
    { title: "Prototyping", description: "Clickable prototypes that let you test the chemistry before you commit to development." },
    { title: "Frontend Development", description: "I don't just design it, I build it. Modern web tech, with every pixel exactly where it belongs." },
  ],
};

export type Project = {
  slug: string;
  title: string;
  monogram: string;
  tagline: string;
  description: string;
  role: string;
  focus: string;
  stack?: string[];
  /** Detail page: a longer intro paragraph. */
  overview?: string;
  /** Detail page: key features / what's inside. */
  features?: { title: string; description: string }[];
  /** Detail page: extra facts shown beside Role / Focus (e.g. Market: India). */
  facts?: { label: string; value: string }[];
  /** Detail page: external links (live site, GitHub, Figma…). */
  links?: { label: string; href: string }[];
  /** Card colour, shown behind the image or monogram. */
  bg: string;
  /** Optional screenshot in /public/projects — falls back to a monogram tile. */
  image?: string;
  /** "contain" shows the whole image (e.g. a logo) instead of cropping it to fill. */
  imageFit?: "cover" | "contain";
  /** Space around a "contain" image (CSS padding, e.g. "16%"); defaults to 6%. */
  imageInset?: string;
  /** Which part of a cropped ("cover") image stays in view, e.g. "left top" for app screenshots. */
  imagePosition?: string;
  /** Project page: live website preview (mini browser). `poster` is a screenshot shown while it loads. */
  preview?: { url: string; poster: string };
  /** Copy written as a placeholder because no existing source described this project. Replace before launch. */
  draft?: boolean;
};

/** True when a hex colour is light (dark text / no dark overlay reads better on it). */
export function isLightColor(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

export const WORK = {
  label: "Selected Work",
  heading: "My proudest little creations. Go on, take a peek.",
};

export const PROJECTS: Project[] = [
  {
    slug: "innerwhispers",
    bg: "#E9EBF7",
    image: "/projects/innerwhispers-logo.png",
    imageFit: "contain",
    imageInset: "16%",
    title: "InnerWhispers",
    monogram: "IW",
    tagline: "Mental Wellness Platform",
    description:
      "A digital mental wellness platform designed to make emotional support, self-care, assessments, and professional guidance more accessible.",
    role: "Product Design, UI/UX, UX Strategy",
    focus: "Mental Wellness · Product Design · User Experience",
    // Detail content below comes from the earlier case-study page (project-innerwhispers.html).
    overview:
      "InnerWhispers exists for the moment a student doesn't know who to talk to. Assessments that don't feel clinical, an AI knowledge center that surfaces the right resources, and a clinical suite that gives real psychiatrists a workspace built for two to three minute consultations, not paperwork. Every design decision runs through one filter: does this feel human, or does it feel like a form.",
    features: [
      { title: "Admin Portal", description: "A user-management dashboard with sidebar navigation and in-page + real routing working in tandem." },
      { title: "AI Knowledge Center", description: "Interactive charts, a semantic vector map, and a live similarity search lab over the platform's content." },
      { title: "Assessments", description: "Animated stat counters, live search/filter, and an interactive PHQ-9 gauge backed by Chart.js." },
      { title: "Doctor Dashboard", description: "A calm, offline-capable psychiatrist workspace — the \"InnerWhispers Clinical Suite.\"" },
      { title: "Prescription System", description: "Print-first, A4-optimized prescriptions built for a 2–3 minute consultation, with QR + PDF export." },
      { title: "Brand & Content", description: "A full library of branded Instagram/LinkedIn carousels and reels on mental health awareness." },
    ],
    stack: ["Node.js", "Supabase", "HTML / CSS / JS", "Chart.js", "jsPDF", "html2canvas", "QRCode.js", "IndexedDB", "Service Worker"],
    facts: [{ label: "Market", value: "India" }],
  },
  {
    // Content from the café brief + the live site. Stack read from the live site's source.
    // TODO(content): confirm the role.
    slug: "draksharamam-cafe",
    bg: "#000000",
    image: "/projects/draksharamam-cafe.png",
    imageFit: "contain",
    title: "The Draksharamam Cafe",
    monogram: "DC",
    tagline: "South Indian Tiffin Café",
    description:
      "A website for a South Indian tiffin café: authentic tiffins from Tamil Nadu, Andhra Pradesh, and Karnataka, crafted with tradition and served with love.",
    role: "UI/UX Design, Web Development",
    focus: "Restaurant Website · Branding · Responsive Web",
    overview:
      "Experience the true taste of South India! Where tradition meets taste, one tiffin at a time. The site brings the café's warmth online: authentic flavors, fresh ingredients, and a menu that takes you on a culinary journey through South India, with easy ways to explore the menu and order.",
    features: [
      { title: "Live Kitchen Experience", description: "Watch your favorite dishes being freshly prepared right before your eyes." },
      { title: "Cozy & Welcoming Ambiance", description: "A space that reflects true South Indian culture." },
      { title: "Fast & Hygienic Service", description: "Quick service with top-notch cleanliness standards." },
      { title: "Takeaway & Delivery Options", description: "Enjoy our flavors wherever you are." },
      { title: "Andhra Specials", description: "Spicy pesarattu, tangy pulihora, and rich ghee karam dosa, packed with bold flavors." },
      { title: "Tamil Nadu Delights", description: "Soft idlis, crispy dosas, and flavorful pongal, served with traditional chutneys and sambar." },
      { title: "Karnataka Classics", description: "Buttery benne dosa, delicate neer dosa, and wholesome ragi rotti, bringing the essence of Karnataka." },
      { title: "Filter Coffee", description: "End your meal with a cup of strong, aromatic South Indian filter coffee." },
    ],
    stack: ["HTML", "Tailwind CSS", "Alpine.js", "Render"],
    facts: [{ label: "Cuisine", value: "South Indian" }],
    links: [{ label: "Visit Live Site", href: "https://the-draksharamam-cafe.onrender.com/" }],
    preview: { url: "https://the-draksharamam-cafe.onrender.com/", poster: "/projects/draksharamam-cafe-preview.jpg" },
  },
  {
    // Content from the brief + the live site (fern.innerwhispers.in); stack read from its source.
    // TODO(content): confirm the role.
    slug: "fern-ai",
    bg: "#0E1D17",
    image: "/projects/fern-ai-preview.jpg",
    title: "Fern.ai",
    monogram: "FA",
    tagline: "AI Wellness Companion",
    description:
      "Your private space to reflect and grow. An AI wellness companion that helps you unwind, with AI chat, journaling, and AI-assisted mental health assessments.",
    role: "Product Design, UI/UX",
    focus: "AI Wellness · Journaling · Mental Health",
    overview:
      "A private space to journal, track your mood, and talk things through, with an AI companion that's with you every step of the way. Share in your own words, reflect as Fern listens and responds with care, and grow as your patterns emerge, one conversation at a time.",
    features: [
      { title: "Supportive Conversations", description: "Talk it through with an AI companion that listens without judgment. No scripts, no waiting rooms, just a conversation when you need one." },
      { title: "Guided Journaling", description: "Write freely or follow gentle prompts. Fern helps you put feelings into words, so reflection never feels like a blank page." },
      { title: "Mood Tracking", description: "Log how you feel in seconds. Over time, see patterns in your mood, habits, and triggers you might otherwise miss." },
      { title: "Mental Health Assessments", description: "Quick, research-informed assessments for mood, stress, sleep, and more, with instant results you can retake to track how you change." },
      { title: "Fern Personas", description: "Fern adapts to how you want to talk, from calm and grounded to playful and chaotic. Switch personas anytime, mid-conversation." },
      { title: "Grounded in Research", description: "Responses draw on a growing library of wellness research and resources, so every conversation is thoughtful, not generic." },
      { title: "Track Over Time", description: "Retake assessments and revisit your journal to see how you're progressing and build small, healthier routines." },
      { title: "Private & Secure", description: "Entries stay encrypted and confidential, with full control over your data and nothing shared without your consent." },
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    facts: [{ label: "Part of", value: "InnerWhispers" }],
    links: [{ label: "Visit Live Site", href: "https://fern.innerwhispers.in/" }],
    preview: { url: "https://fern.innerwhispers.in/", poster: "/projects/fern-ai-preview.jpg" },
  },
  {
    // Content written from the dashboard screenshot only. TODO(content): confirm the role; add stack + link if any.
    slug: "innerwhispers-admin-console",
    bg: "#E7E9EE",
    image: "/projects/innerwhispers-admin-console.png",
    imagePosition: "left top",
    title: "InnerWhispers Admin Console",
    monogram: "AC",
    tagline: "Operations & Care Dashboard",
    description:
      "The admin console behind InnerWhispers: live platform metrics, a risk and escalation queue for flagged students, clinical management, and content publishing, all in one calm dashboard.",
    role: "Product Design, UI/UX",
    focus: "Dashboard Design · Data Visualization · Admin UX",
    overview:
      "One place for the team to see what's happening across InnerWhispers today. The dashboard surfaces what needs attention first, like students flagged in the risk queue, then gives the wider picture: activity, wellbeing and engagement trends, assessments, and consultations, with clinical and content tools a click away.",
    features: [
      { title: "At-a-glance Metrics", description: "Active users, new signups, assessments, open risk flags, consultations, and published content, each with its trend." },
      { title: "Risk & Escalation Queue", description: "Students flagged for review surface instantly, with open queue, monitoring, and at-risk views so nobody slips through." },
      { title: "Wellbeing & Engagement Trends", description: "30-day mood and engagement charts, compared against the previous month." },
      { title: "Risk Status Snapshot", description: "A live breakdown of students across normal, monitoring, and at-risk states." },
      { title: "Clinical Management", description: "Patients, doctors, assessments, consultations, and prescriptions, managed in one place." },
      { title: "Assessment Volume", description: "Weekly assessment submissions to spot trends and plan the team's capacity." },
      { title: "Users & Roles", description: "Manage students and staff with global search and role-based access, up to Super Admin." },
      { title: "Content & Notifications", description: "Publish wellness articles and keep the team in the loop with in-app notifications." },
    ],
    facts: [{ label: "Part of", value: "InnerWhispers" }],
  },
  {
    // TODO(content): description is from the earlier HTML portfolio; role + focus were inferred from it.
    slug: "nau-care-connect",
    bg: "#5C6B73",
    title: "NAU Care Connect",
    monogram: "CC",
    tagline: "Student Wellbeing",
    description:
      "A full-stack student wellbeing platform with role-based access across admin, peer, faculty, specialist, and student roles — built to give every person on campus the right amount of visibility, and no more.",
    role: "Full-Stack Development, UI/UX",
    focus: "Campus Platforms · Access Design · Full-Stack",
    stack: ["Express", "Supabase", "Tailwind CSS", "RBAC"],
  },
  {
    // Written from the dashboard screenshot + the earlier InnerWhispers case study (Doctor Dashboard /
    // Prescription System). Patient details in the image are blurred on purpose.
    // TODO(content): confirm the role; add stack + link if any.
    slug: "innerwhispers-clinical-suite",
    bg: "#EDEFF2",
    image: "/projects/innerwhispers-clinical-suite.png",
    imagePosition: "left top",
    title: "InnerWhispers Clinical Suite",
    monogram: "CS",
    tagline: "Psychiatrist's Daily Workspace",
    description:
      "A calm daily workspace for psychiatrists on InnerWhispers: today's consultation queue, the patients who need attention, follow-ups, and assessment reviews, all at a glance.",
    role: "Product Design, UI/UX",
    focus: "Clinical UX · Healthcare · Dashboard Design",
    overview:
      "Built for two to three minute consultations, not paperwork. The day starts with what matters: how many consultations are ahead, who needs attention and why, and one click to start, resume, or review each visit. Safety flags, rising assessment scores, and due check-ups surface on their own, so nothing important gets buried.",
    features: [
      { title: "Today at a Glance", description: "Patients seen this week, average consultation time, follow-ups due, and assessments awaiting review." },
      { title: "Consultation Queue", description: "The day's appointments with visit type and live status: completed, in session, waiting, or scheduled." },
      { title: "One-click Actions", description: "Start, resume, or review a consultation straight from the queue, and open notes for finished visits." },
      { title: "Needs Your Attention", description: "Safety reviews, rising scores, and due monitoring surface together, with when you're seeing each patient." },
      { title: "Assessment Insights", description: "Changes in PHQ-9 and GAD-7 scores are flagged, with the trend a click away." },
      { title: "Monitoring Reminders", description: "Lab checks like lithium levels are tracked with when they were last done, plus a quick way to record results." },
      { title: "Prescription System", description: "Print-first, A4-optimized prescriptions built for a 2–3 minute consultation, with QR + PDF export." },
      { title: "Keyboard Shortcuts", description: "Quick actions for speed: press / to search, or N to start a new consultation." },
    ],
    facts: [{ label: "Part of", value: "InnerWhispers" }],
  },
];

export const PROCESS = {
  label: "My Design Process",
  heading: "How I win you over, step by step.",
  steps: [
    { name: "Understand", description: "First-date energy: I ask a lot of questions about your users, their needs, your business, and the real problem we're solving." },
    { name: "Explore", description: "I research, snoop around existing experiences, spot opportunities, and flirt with a few different directions." },
    { name: "Define", description: "Research turns into clear user flows, information architecture, requirements, and priorities. No mixed signals." },
    { name: "Design", description: "Wireframes, visual systems, interfaces, and interactive prototypes, refined until they're simply irresistible." },
    { name: "Validate", description: "I test ideas, gather honest feedback, find the friction points, and iterate. I can take criticism, promise." },
    { name: "Build", description: "I work hand in hand with developers to turn designs into real, working products. Not just a pretty face." },
  ],
};

export const EXPERIENCE = {
  label: "Experience",
  heading: "Where I've been making things (and making an impression).",
  cta: "Let's Connect on LinkedIn",
  items: [
    {
      company: "Tech Mahindra — Makers Lab",
      role: "UI/UX Design Intern",
      description:
        "Working on product and experience design within an innovation-focused environment, exploring emerging technologies and translating ideas into meaningful digital experiences.",
    },
    {
      company: "InnerWhispers",
      role: "Product / UI/UX Designer",
      description: "Contributing to the design and development of digital products focused on mental wellbeing, accessibility, and human-centered experiences.",
    },
    {
      company: "Institution's Innovation Council",
      role: "Design & Innovation",
      description: "Working around student innovation, entrepreneurship, ideation, and technology-driven initiatives.",
    },
  ],
};

/** Milestones: events and advocacy (facts as provided by Gopi + the InnerWhispers MENTIS page). */
export const MILESTONES = {
  label: "Milestones",
  heading: "A few moments I'm proud of.",
  mentis: {
    role: "Lead Organiser",
    date: "January 30–31, 2026",
    title: "MENTIS 24",
    subtitle: "National-Level Mental Health Hackathon",
    /** Claims as provided by Gopi. */
    highlights: ["India's biggest mental health hackathon", "First of its kind", "Telangana's first"],
    image: "/milestones/mentis-24-winners.png",
    imageAlt: "MENTIS 24 prize presentation with the winning team, jury, and organisers",
    description:
      "India's biggest mental health themed hackathon, the first of its kind, and a first for Telangana. For 24 hours, teams from institutions across the country built ethical, tech-driven solutions for real-world mental health challenges, from anxiety and academic stress to peer support, early screening, and digital wellbeing.",
    stats: [
      { value: "24", label: "hours, non-stop" },
      { value: "55", label: "competing teams" },
      { value: "National", label: "level hackathon" },
    ],
    venue: "Vaagdevi College of Engineering, Warangal, Telangana",
    organisers: "NAU (Now As You Are), under InnerWhispers Wellness LLP",
    focus: "Building ethical, impactful, tech-driven solutions for real-world mental health challenges and well-being.",
    winners: [
      { place: "1st", team: "Team Tech-pulse", project: "AI Autism Recovery System" },
      { place: "3rd", team: "CMR College of Engineering & Technology (CMRCET)", project: "BEYOND SIGHT" },
    ],
  },
  advocate: {
    label: "Mental Health Advocate",
    title: "Awareness workshops",
    description:
      "Beyond building products, I've organized multiple mental health awareness workshops, bringing conversations about wellbeing out into the open.",
    points: ["Multiple awareness workshops organised", "Lead organiser of MENTIS 24", "Building mental wellness tech with InnerWhispers"],
  },
};

export const SKILLS = {
  label: "My",
  heading: "Superpowers",
  items: [
    { name: "Figma", icon: "/skills/figma.svg", level: 75 },
    { name: "Sketch", icon: "/skills/sketch.svg", level: 95 },
    { name: "Photoshop", icon: "/skills/photoshop.svg", level: 65 },
    { name: "XD", icon: "/skills/xd.svg", level: 35 },
    { name: "Illustrator", icon: "/skills/illustrator.svg", level: 98 },
    { name: "Indesign", icon: "/skills/indesign.svg", level: 45 },
  ],
  /** Development stack, shown as icon tiles (logos come from simple-icons, keyed by name in Skills.tsx). */
  tech: ["HTML", "Tailwind CSS", "React", "Next.js", "Python", "TypeScript", "Node.js", "MySQL"],
};

export const CONTACT = {
  heading: "So… are we doing this or what?",
  sub: "Tell me about your big idea. I'm a great listener, and an even better designer.",
  // U+2764 without the emoji variation selector renders as a monochrome glyph.
  copyright: "© Gopi Kalyan 2025 | Designed with ❤︎ (and a little too much coffee) | All Rights Reserved.",
};

/** Section links. Root-relative so they also work from project pages. */
export const MENU_LINKS = [
  { label: "About", href: "/#about" },
  { label: "My Portfolio", href: "/#portfolio" },
  { label: "My Experience", href: "/#experience" },
  { label: "My Skills", href: "/#skills" },
];

/**
 * Keywords highlighted wherever they appear in highlighted text (see <Highlight>).
 * Tones: red (brand) · orange (Shiro) · blue · green. Keep it to about one per paragraph.
 */
export type HighlightTone = "red" | "orange" | "blue" | "green";
export const KEYWORDS: [string, HighlightTone][] = [
  ["Gopi Kalyan", "red"],
  ["UI/UX and product designer", "orange"],
  ["simple, intuitive, and meaningful", "blue"],
  ["creativity, technology, and human behavior", "green"],
  ["understanding the problem", "orange"],
  ["collaborate closely with developers", "blue"],
  ["mental wellbeing", "red"],
  ["human-centered thinking", "green"],
];
