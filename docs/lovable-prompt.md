Build a personal portfolio website for Mohammad Ramiz, a backend software engineer. The site itself must feel like it was built by a backend engineer: precise, fast, systems-minded, and honest. Think API documentation, system architecture diagrams and well-designed developer tools (Stripe docs, Vercel, Linear, Railway, Fly.io) — not a designer's portfolio, not a 3D playground, not a template with gradients and glowing blobs.

## Hard rules

- Use ONLY the facts in this prompt. Do not invent metrics, user counts, uptime, latency numbers, testimonials, company logos, job titles or dates. If a fact is missing, leave the field out — never make one up.
- No 3D, no WebGL, no particle backgrounds, no floating blobs, no glassmorphism, no stock illustrations, no emoji in headings.
- Text is always on a solid background and fully readable. Nothing animated ever sits behind or over text.
- Must be fast: static site, no heavy libraries, Lighthouse 95+ on performance and accessibility.
- Fully responsive (test at 360px, 768px, 1280px, 1600px), no horizontal scroll on phones.
- Accessible: semantic HTML, visible focus states, AA contrast, respects `prefers-reduced-motion`, keyboard navigable.

## Tech

React + Vite + TypeScript + Tailwind CSS + shadcn/ui. Keep all content in typed data files (`src/content/profile.ts`, `projects.ts`, `experience.ts`, `stack.ts`, `achievements.ts`) so components contain no hard-coded facts. Use React Router for case-study pages. Framer Motion only for small, purposeful transitions.

## Visual direction: "engineering console, done tastefully"

- Theme: dark by default with a proper light mode toggle. Dark background near `#0B0D10`, surfaces `#12151A`, borders `#1F242C`, text `#E6E8EB`, muted text `#8A93A0`. One accent: signal green `#3DDC97` (used for "live/healthy" states, links and the primary button). Secondary accent amber `#F5B544` used sparingly for warnings/labels.
- Typography: `Inter` (or `Geist`) for UI and body; `JetBrains Mono` (or `Geist Mono`) for labels, metadata, code, paths, HTTP methods and section numbers. Large, tight, confident headings; generous line-height in body copy.
- Layout: a 12-column grid with a visible but very faint 1px grid/rule system; content left-aligned in a readable column (max ~720px for prose), wider for diagrams and project grids. Lots of whitespace. Sharp corners or a small 6px radius — consistent everywhere.
- Details that signal "backend": monospace metadata rows (`stack: python · fastapi`), status dots, HTTP-style labels (`GET /projects`), file-path breadcrumbs (`~/ramiz/projects/buddycode`), keyboard shortcut hints, a command palette.
- Motion: subtle and functional only — fade/slide-in of sections (150–250ms), typing caret in the hero, animated packets flowing along architecture-diagram edges. All disabled under reduced motion.

## Signature features (these make it memorable — build them well)

1. **Hero as a terminal session.** Left: name, role, one-line summary, two buttons (`View systems`, `Contact`). Right: a terminal card that types out, once, on load:
   ```
   $ whoami
   mohammad-ramiz — software engineer @ moglix
   $ cat focus.txt
   automation · backend apis · infrastructure
   $ ls ~/systems
   buddycode  linkium  backup-engine  confess  confess-web  timefold
   ```
   The terminal is decorative (aria-hidden) and duplicates information already in real text. Blinking caret at the end.

2. **Command palette (⌘K / Ctrl+K).** shadcn `Command` dialog to jump to any section or project, copy email, open GitHub/LinkedIn, download résumé, toggle theme. Show the `⌘K` hint in the header.

3. **Projects as API endpoints.** The projects section is styled like API reference docs: each project is a card headed by a method + route, e.g. `GET /systems/buddycode`, with a status pill (`live`, `on google play`, `release v1.0`, `internal`), summary, stack as mono chips, ships-as, and links. Filter tabs by domain (All, AI / ML, Automation, APIs, Developer tools, Apps). Clicking a public project opens its case study page.

4. **Architecture diagrams.** For BuddyCode, Linkium and Backup Engine, render an interactive SVG system diagram (nodes in columns, labelled edges, dashed for async). Nodes are colour-coded by layer (Interface, API, Automation & AI, Data, Infrastructure). Small dots animate along the edges to show data flow; hovering a node highlights its connections. Show these on the home page in an "Architecture" section with tabs per project, and again on each case study.

5. **The five layers.** A section that shows the tech stack grouped by layer, styled like a layered system stack (Infrastructure at the bottom, Interface on top), each layer a row with its tools as mono chips.

6. **Experience as `git log`.** Timeline rendered like a styled git log: each entry has a short hash-style id, period, role, org, bullet points and tags. Ongoing roles get a green pulsing "HEAD" marker.

7. **Footer status bar.** A slim bar like an IDE status bar: `● available for work · Greater Noida, IN · IST (UTC+5:30) · last deploy: <build date>`. The build date is generated at build time — not invented.

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

Each case study page: breadcrumb path, title, status pill, summary, "What it does" bullets, stack chips, architecture diagram (if provided), links, and next/previous project navigation. Include a screenshot slot per project that I will fill later; show a clean placeholder frame (browser chrome or phone frame) until then.

### Internal work at Moglix (listed by name only — no case study, no details beyond these)
- **Supplier Invoice Accuracy** — Accuracy work on supplier invoices at Moglix. Python. AI / ML, Automation.
- **Sourcing Agent** — An agentic AI system for sourcing at Moglix. Python, Agentic AI. AI / ML.
- **OCR Accuracy Report Pipeline** — A reporting pipeline that measures OCR accuracy at Moglix. Python, OCR. AI / ML, Automation.
Show these as endpoint cards with an `internal` status pill and a lock icon, and no link.

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

## Page structure (home)

1. Sticky header: `ramiz` wordmark in mono (`~/ramiz`), nav (About, Systems, Architecture, Experience, Stack, Contact), `⌘K` hint, theme toggle, Résumé button. On mobile: a sheet menu.
2. Hero (terminal session, see above) + location and "available for work" status dot.
3. About: paragraph, portrait, key–value details table in mono (`name`, `role`, `location`, `education`, `email`, `phone`), "What I work on" numbered list.
4. Systems: filterable endpoint cards — public projects first, then the three internal Moglix items.
5. Architecture: tabs for BuddyCode / Linkium / Backup Engine with the animated SVG diagrams and a layer legend.
6. Experience: git-log timeline.
7. Stack: the five layers.
8. Achievements highlight strip → link to `/achievements`.
9. Contact: big heading "Let's build the system.", line "Open to engineering roles and freelance work in automation, backends and infrastructure. Email reaches me fastest.", copy-email button, links grid (GitHub, LinkedIn, X, Résumé PDF).
10. Footer status bar.

Number sections in mono like `01 / systems`. Section headings short and confident; no cute slogans.

## Extra pages
- `/work/:slug` case studies (six public projects).
- `/achievements`.
- A 404 page styled as an HTTP response: `404 Not Found — the route you requested doesn't exist`, with a link home.
- Redirect old path `/windows-apps` → `/#systems`.

## SEO and polish
- Title "Mohammad Ramiz — Software Engineer", meta description from the summary, Open Graph image (dark card with name, role and `GET /ramiz` in mono), favicon (`>_` in green on dark), sitemap, robots.txt.
- Smooth anchor scrolling with offset for the sticky header.
- Copy-to-clipboard toasts via shadcn `Sonner`.
- Every external link opens in a new tab with `rel="noopener noreferrer"`.
