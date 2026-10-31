Build a personal portfolio website for Mohammad Ramiz, a backend software engineer. Use the visual system below, "darkroom editorial": a warm near-black canvas, cream uppercase typography, huge negative space, and one artifact per screen presented like a museum object. Here the artifacts are a backend engineer's work — a terminal session, system architecture diagrams, project screenshots — not 3D products. It must read as calm, precise and senior.

## Hard rules

- Use ONLY the facts in this prompt. Do not invent metrics, user counts, uptime, latency numbers, testimonials, company logos, job titles or dates. If a fact is missing, leave the field out — never make one up.
- No 3D, no WebGL, no particles, no gradients, no glow, no glassmorphism, no drop shadows, no stock imagery, no emoji.
- Text always sits on a solid background and is fully readable. Nothing animated ever sits behind or over text.
- Never pure white text or pure black backgrounds. Never center-align body copy.
- Fast: static site, Lighthouse 95+ on performance and accessibility. Fully responsive (360px, 768px, 1280px, 1600px), no horizontal scroll on phones.
- Accessible: semantic HTML, visible focus states (1px dashed cream outline, 3px offset), AA contrast, respects `prefers-reduced-motion`, keyboard navigable.

## Tech

React + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui (restyled to these tokens — no default shadcn look). Keep all content in typed data files (`src/content/profile.ts`, `projects.ts`, `experience.ts`, `stack.ts`, `achievements.ts`) so components contain no hard-coded facts. React Router for case-study pages. Framer Motion only for small, purposeful transitions.

## Design tokens (use exactly)

```css
@theme {
  --color-cream: #ffedd7;     /* all text, nav, borders of interactive elements */
  --color-canvas: #100904;    /* page background, every section */
  --color-bark: #382416;      /* the only elevated surface: filled pill button, image placeholders, code blocks */
  --color-cork: #40372e;      /* hairline dividers, dashed separators, card outlines */
  --color-driftwood: #6c5f51; /* muted/secondary text and secondary dividers */
  --color-ember: #dc5000;     /* editorial accent ONLY: credit lines, small tags, "status: live" dots. Never buttons. */

  --font-sans: "Inter", "Söhne", "Neue Haas Grotesk", system-ui, sans-serif;  /* with font-feature-settings: "ss01" */
  --font-mono: "JetBrains Mono", ui-monospace, monospace;                     /* only inside the terminal and code */

  --radius-card: 12px;
  --radius-pill: 36px;
  --radius-ghost: 22.5px;
}
```

- **One typeface family** (Inter with `ss01`), two voices only:
  1. **UPPERCASE, weight 500** — everything: nav, headings, labels, links, buttons, metadata. Letter-spacing normal.
  2. **Mixed case, weight 400, 29px / 1.26** — only for descriptive body copy (summaries, about text). This is the site's single conversational voice.
- **Type scale:** display 51px (up to `clamp(51px, 7vw, 120px)` for the hero wordmark) / heading 41px / heading-sm 24px / subheading 18px / body 29px / labels 12–14px / micro 10px. Line-height **0.9** on display and heading so uppercase lines stack like a solid block; 1.09 on heading-sm; 1.26 on body. On phones, body drops to 20px and heading to 32px.
- **Radius vocabulary is only:** 12px cards, 36px filled pill button, 22.5px outlined ghost button, 0px inputs and links, 9999px dots.
- **Elevation:** no shadows at all. Depth = canvas `#100904` → bark `#382416`. That's it.
- **Dividers:** 1px dashed `#40372e` (or `#6c5f51`), only where they carry structure.
- **Spacing:** comfortable; 18px element gap, 24px card padding and page margin, 68px and 204px for big vertical rhythm. Every major section is at least 100vh.
- **Buttons:** at most one filled button per section (bark fill, cream text, 36px radius, 14px × 24px padding, 12–14px uppercase). Everything else is an outlined ghost button (transparent, 1px cream border, 22.5px radius) or an underlined uppercase text link.
- **Inputs:** underline only — 1px cream bottom border, no box.

## Layout system

Full-bleed, no max-width container. Two section modes, alternating:

1. **Context mode** — a full-viewport composition with a large element (terminal, screenshot) and type placed around the edges, like the corners of a poster.
2. **Void mode** — a 100vh canvas section with a three-column grid: a left-aligned uppercase heading (41px) on the left, **one artifact centred** in the middle ~40% (a diagram, a screenshot, a terminal), and left-aligned 29px body copy on the right. 18px gutters. On tablets and phones the columns stack: heading → artifact → body.

Sections flow dark-on-dark; the only breaks are dashed hairlines and small uppercase section labels like `01 — SYSTEMS`.

## Signature elements

1. **Fixed top navigation:** transparent, full width. Left: wordmark `RAMIZ` at 14px weight 500. Right: four items only — `WORK`, `ARCHITECTURE`, `EXPERIENCE`, `CONTACT` — 12px uppercase cream; the active item gets a 1px dashed underline. A small ghost button `⌘K` opens the command palette. On phones: wordmark + `MENU` text button opening a full-screen canvas menu with the items at 41px.

2. **Vertical edge label:** rotated 90°, flush to the right edge, fixed: `RAMIZ — SOFTWARE ENGINEER / BACKEND · AUTOMATION · INFRA`, 10px uppercase cream at 60% opacity. Hidden on phones. It acts like a product serial number.

3. **Hero (context mode, 100vh):**
   - Top-left: small tagline `SOFTWARE ENGINEER AT MOGLIX — GREATER NOIDA, INDIA` (12px), then the massive wordmark `MOHAMMAD RAMIZ` (display, line-height 0.9, two lines).
   - Centre-right: the artifact — a large terminal card (bark `#382416` surface, 12px radius, mono cream text, no window chrome except three small cork dots) that types out once on load:
     ```
     $ whoami
     mohammad-ramiz — software engineer @ moglix
     $ cat focus.txt
     automation · backend apis · infrastructure
     $ ls ~/systems
     buddycode  linkium  backup-engine  confess  confess-web  timefold
     ```
     Caret blinks at the end. The terminal is `aria-hidden`; all of its information also exists as real text on the page.
   - Bottom-left: an info card (12px radius, 1px cork border, transparent fill, 24px padding): uppercase heading `BUILDS AUTOMATION, BACKENDS AND THE INFRASTRUCTURE THEY RUN ON.`, a dashed divider, then the summary in body voice at 18px mixed case.
   - Bottom-right: the one filled pill button `VIEW WORK` and a ghost button `CONTACT`.
   - Tiny ember credit line at the very bottom: `* AVAILABLE FOR ENGINEERING ROLES AND FREELANCE WORK`.

4. **Command palette (⌘K / Ctrl+K):** shadcn `Command` restyled — canvas background, 1px cork border, 12px radius, uppercase items. Jump to sections and projects, copy email, open GitHub/LinkedIn, download résumé.

5. **Architecture diagrams as the centred artifacts:** for BuddyCode, Linkium and Backup Engine, an SVG diagram drawn in cream hairlines on the canvas: nodes are 12px-radius outlined boxes with uppercase labels and a driftwood detail line; edges are 1px cream lines with small uppercase labels; async edges dashed. Layer is shown by a tiny label in each node (`L1 INTERFACE` … `L5 INFRASTRUCTURE`), not by colour. Small cream dots travel along the edges to show data flow (disabled under reduced motion). Hovering a node brightens its connections and dims the rest to driftwood.

6. **Ember is precious:** use `#dc5000` only for status dots (`● LIVE`, `● ON GOOGLE PLAY`, `● HEAD`), the footnote credit lines and the small "built by" line in the footer. Never on buttons or large text.

## Page structure (home)

1. **Hero** — as above.
2. **About (void mode)** — left: `ABOUT` heading. Centre: portrait photo (sharp edges, no rounded mask, warm-graded, slot I will fill). Right: about paragraph in body voice. Below, full width: a key–value list separated by dashed hairlines (`NAME`, `ROLE`, `BASED IN`, `EDUCATION`, `EMAIL`, `PHONE` — labels in driftwood 12px uppercase, values in cream 18px), then `WHAT I WORK ON` as a numbered list (`01`–`06`).
3. **Work** — section label `01 — SYSTEMS`. Filter as uppercase underlined text links (ALL · AI / ML · AUTOMATION · APIS · DEVELOPER TOOLS · APPS). Then one **void-mode screen per public project**: left — project name at 41px and the status line with ember dot; centre — the screenshot slot; right — summary in body voice, then stack and "ships as" as 12px uppercase metadata separated by dashed hairlines, and a ghost button `READ CASE STUDY`. After the public projects, one compact screen titled `INSIDE MOGLIX` listing the three internal systems as rows divided by dashed hairlines, each with an `INTERNAL` label.
4. **Architecture** — label `02 — ARCHITECTURE`. Void mode: left `FIVE LAYERS, ONE SYSTEM.`; centre the diagram; right a short explanation in body voice. Ghost-button tabs `BUDDYCODE` / `LINKIUM` / `BACKUP ENGINE` switch the diagram.
5. **Stack** — label `03 — STACK`. Five full-width rows separated by dashed hairlines, bottom-up (INFRASTRUCTURE at the bottom, INTERFACE on top): layer name at 24px on the left, tools as 14px uppercase text on the right.
6. **Experience** — label `04 — EXPERIENCE`. Styled like a git log in the editorial voice: each entry is a row with period (driftwood, 12px), role at 24px, org, bullets in 18px mixed case, tags as 12px uppercase. Ongoing roles carry `● HEAD` in ember.
7. **Achievements** — label `05 — RECOGNITION`. Four highlights (patent, K.R. Mangalam finalist, Flipkart GRiD, AWS) as large uppercase rows with year and status; ghost button `ALL ACHIEVEMENTS` → `/achievements`.
8. **Contact (void mode, 100vh)** — left: `LET'S BUILD THE SYSTEM.` at display size. Right: body voice "Open to engineering roles and freelance work in automation, backends and infrastructure. Email reaches me fastest." Then the one filled pill button `COPY EMAIL` (copies, shows a small cream "COPIED" toast) and underlined uppercase links GITHUB, LINKEDIN, X, RÉSUMÉ (PDF).
9. **Footer** — a single line: `© <year> MOHAMMAD RAMIZ` left, `BUILT IN GREATER NOIDA` in ember micro-type right, plus a 10px uppercase build-date line generated at build time (not invented).

## Content (use exactly)

### Profile
- Name: Mohammad Ramiz
- Role: Software Engineer at Moglix
- Location: Greater Noida, Uttar Pradesh, India
- Summary: "I build automation, backends and the infrastructure they run on. Python services, REST APIs, Docker on Linux, and the Android and web apps on top."
- About paragraph: "I'm a software engineer at Moglix. I like the parts of software most people never see: the scripts that remove manual work, the APIs that connect systems, and the servers they run on. I build the apps on top too, mostly Android and the web."
- Education: Computer Science (undergraduate; institution and years not provided — do not invent them)
- Email: ramizanas6@gmail.com (primary CTA: click to copy, with a "Copied" toast; also a mailto link)
- Phone: +91 95170 28373
- GitHub: https://github.com/RamizMohammad (RamizMohammad)
- LinkedIn: https://www.linkedin.com/in/mohammad-ramiz-886468217/ (mohammad-ramiz)
- X: https://x.com/Mohammad__Ramiz (@Mohammad__Ramiz)
- Résumé: `/resume.pdf` (download link; I will upload the file)
- Portrait: placeholder slot for a square photo I will upload (`/portrait.webp`), alt "Mohammad Ramiz"
- What I work on:
  1. Python automation and process optimisation
  2. AI/ML, computer vision, OCR and predictive modelling
  3. Backend engineering, REST APIs and system integrations
  4. Docker, Linux, Nginx, networking and self-hosted infrastructure
  5. React, TypeScript, Next.js and experimental products
  6. Android, AR/VR and interactive experiences

### Projects (public — each gets a case study page at `/work/<slug>`)

**BuddyCode** — `buddycode` — status: live — Web app — https://www.buddycode.online
A real-time collaborative code editor with syntax highlighting, multiple languages and live cursor sharing.
Stack: Python, Flask, WebSocket, CodeMirror. Domain: Developer tools.
- Several people edit the same file at once and see each other's cursors.
- Edits travel over WebSocket between the browser editor and a Flask server.
- CodeMirror provides the editor and syntax highlighting for multiple languages.
- An Android companion app runs Python code as an online compiler.
Architecture: Browser editor (Interface) → WebSocket channel "edits" (API); Peer editor (Interface) → WebSocket channel "edits"; WebSocket channel → Flask server (API, sessions and broadcast); Flask server → Python runner (Automation, executes code) "run"; Flask server ⇢ Peer editor "broadcast" (dashed).

**Linkium** — `linkium` — Desktop app — https://www.linkium.space
A cross-platform tool that connects devices for file sharing and communication.
Stack: Python, Tkinter, WebSocket, Networking. Domain: Developer tools.
- Pairs two devices and keeps a live connection between them.
- Moves files and messages over a WebSocket link.
- Desktop interface built with Tkinter.
Architecture: Device A (Interface, Tkinter app) → WebSocket link (API, two-way channel) → File transfer (Automation) and Messages (Automation) → Device B (Interface).

**Backup Engine** — `backup-engine` — status: release v1.0 — Desktop app — https://github.com/RamizMohammad/Backup_Engine/releases/tag/v1.0
A backup automation tool that takes compressed snapshots of important folders and tracks file changes by hashing.
Stack: Python, PyQt, Multithreading, File hashing. Domains: Automation, Developer tools.
- Hashes files to detect what changed since the last run.
- Writes compressed snapshots of the folders you choose.
- Runs work on background threads so the PyQt interface stays responsive.
Architecture: PyQt interface (Interface) → Worker threads (Automation) "start"; Worker threads → Change detection, file hashing (Automation); Change detection → Snapshot writer, compressed archives (Data) "changed files"; Snapshot writer → Backup location, disk or drive (Infrastructure); Worker threads ⇢ PyQt interface "progress" (dashed).

**Confess** — `confess` — status: on Google Play — Android app — https://play.google.com/store/apps/details?id=in.mohammad.ramiz.confess
An anonymous confession platform with real-time feeds and reactions, published on Google Play.
Stack: Java, Firebase, Firestore, Cloud Functions, FCM. Domains: Apps, APIs.
- Real-time Firebase listeners update the feed instantly.
- Cloud Functions handle content moderation.
- Push notifications through Firebase Cloud Messaging.

**Confess Web** — `confess-web` — status: live — Web — https://confess.mohammadramiz.in/
The companion website for the Confess Android app, with community features.
Stack: React, FastAPI, Firebase, Tailwind CSS. Domains: Apps, APIs.

**Time Fold** — `timefold` — status: live — Web app — https://www.timefold.space/
A timeline website showing historical events that happened on today's date.
Stack: Python, FastAPI, Data processing. Domain: APIs.

Each case study page: path label (`~/WORK/BUDDYCODE`), title, status label, summary, "What it does" bullets, stack list, architecture diagram (if provided), links, and previous/next project navigation. Include a full-bleed screenshot slot per project that I will fill later; until then show a Bark Brown frame with the project name centred.

### Internal work at Moglix (listed by name only — no case study, no details beyond these)
- **Supplier Invoice Accuracy** — Accuracy work on supplier invoices at Moglix. Python. AI / ML, Automation.
- **Sourcing Agent** — An agentic AI system for sourcing at Moglix. Python, Agentic AI. AI / ML.
- **OCR Accuracy Report Pipeline** — A reporting pipeline that measures OCR accuracy at Moglix. Python, OCR. AI / ML, Automation.
Show these as plain rows with an `INTERNAL` label and no link.

### Experience (newest first)
1. **Software Engineer — Moglix** · Jan 2026 – Present · Work · ongoing
   - Python backend development, backend APIs and integrations.
   - Analysing operational reports and solving the problems they show through code.
   - Agentic AI support system and chatbot development.
   - Supplier Invoice Accuracy, Sourcing Agent, OCR Accuracy Report Pipeline.
   Tags: Python, FastAPI, Vertex AI, OCR
2. **Software Development Engineer (Intern) — Bluestock Fintech** · May – Jun 2025 · Internship
   - Led the team as project lead.
   - Built the complete admin panel and its frontend architecture.
   Tags: Flask, Python
3. **Android Developer — Freelance** · 2022 – Present · ongoing
   - Published Confess on Google Play.
   - Firebase integration and real-time features.
   - Confess, Share Wheels, BuddyCode.
   Tags: Java, Kotlin, Firebase
4. **Backend and product development — Independent** · 2021 – Present · ongoing
   - Backend systems in Python, Flask and FastAPI for web and mobile apps.
   - Linkium, Backup Engine, Time Fold, Confess Web.
   Tags: Python, Flask, FastAPI
5. **Computer Science — Undergraduate studies** · Education (no dates or institution — leave them out)

### Stack by layer
- **Interface:** React, TypeScript, Next.js, Tailwind CSS, Android (Java), Kotlin, Jetpack Compose, PyQt, Tkinter, AR/VR
- **API:** Python, FastAPI, Flask, REST APIs, WebSocket, System integrations
- **Automation & AI:** Python automation, Agentic AI, Vertex AI, OCR, Computer vision, scikit-learn
- **Data:** Firebase, Firestore, SQL, SQLite, Room, MongoDB
- **Infrastructure:** Docker, Linux, Nginx, Networking, AWS, Self-hosting

### Achievements (separate `/achievements` page plus a 4-item highlight strip on home: patent, KRMU finalist, Flipkart GRiD, AWS)
Each item: kind badge, title, org, year, status, optional detail, and a certificate image slot I will fill (click to open in a lightbox).
- **Patent** — Method and System for Real-Time User Safety During Vehicle Commutes — Indian Patent Office — 2025 — Filed. Application No. 202511053637 A · Published 27 June 2025. Monitors commuter behaviour with sensor fusion and AI to detect anomalies and trigger emergency alerts.
- **Hackathon** — 56-hour hackathon — K.R. Mangalam University — 2024 — Finalist. Reached the final after four judging rounds.
- **Hackathon** — 24-hour hackathon — Sharda University — 2024 — 6th place.
- **Hackathon** — Hack For Impact, E-Summit 2025 — IIIT Delhi — 2025 — Participant.
- **Hackathon** — Infrastructure Innovation — NHAI & HOAI — 2024 — Participant. Proposed AI-assisted highway monitoring for pothole detection and commuter safety.
- **Hackathon** — Build With India — Google India, Gurugram — 2025 — Participant.
- **Competition** — Flipkart GRiD 6.0, Software Development track — Flipkart — 2024 — Level 1 cleared.
- **Internship** — Software Development Engineer intern — Bluestock Fintech — 2025 — Completed.
- **Certification** — Machine Learning A-Z — Udemy — 2024 — Certified.
- **Certification** — Deep Dive on AWS — Amazon Web Services — 2024 — Certified.

## Extra pages
- `/work/:slug` case studies (six public projects), in the same void-mode layout.
- `/achievements`: every achievement as a row divided by dashed hairlines — kind label, title at 24px, org, year, status, optional detail in body voice, and a certificate image slot I will fill (opens in a canvas-coloured lightbox).
- A 404 page: `404 — ROUTE NOT FOUND` at display size and an underlined link `BACK HOME`.
- Redirect old path `/windows-apps` → `/#systems`.

## Motion
Only quiet, editorial motion: sections fade up 12px over 300ms as they enter; display headings reveal line by line with a mask; terminal typing in the hero; dots along diagram edges. No parallax, no scroll-jacking, no cursor effects. Everything is static under `prefers-reduced-motion`.

## SEO and polish
- Title "Mohammad Ramiz — Software Engineer", meta description from the summary, Open Graph image (walnut background, `MOHAMMAD RAMIZ` in cream uppercase, `SOFTWARE ENGINEER — BACKEND · AUTOMATION · INFRA` below), favicon (`R` in cream on walnut), sitemap, robots.txt.
- Smooth anchor scrolling with offset for the fixed nav.
- Every external link opens in a new tab with `rel="noopener noreferrer"`.
