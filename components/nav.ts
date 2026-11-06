import { hasActivity } from "@/content/github";

/** Sections of the home page, in page order. */
export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "moments", label: "Moments" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "architecture", label: "Architecture" },
  { id: "stack", label: "Stack" },
  ...(hasActivity ? [{ id: "activity", label: "Activity" }] : []),
  { id: "awards", label: "Awards" },
  { id: "patents", label: "Patents" },
  { id: "papers", label: "Papers" },
  { id: "companies", label: "Companies" },
  { id: "contact", label: "Contact" },
] as { id: string; label: string }[];

/** A link in the header: a home-page section (by id) or a page of its own (by path). */
export type NavLink = { label: string; hint: string; section?: string; page?: string };
/** A header entry: a group that opens a menu of links, or a single section. */
export type NavGroup = { id: string; label: string; links?: NavLink[]; section?: string; pages?: string[] };

/** The header, grouped. The mobile menu shows the same groups; ⌘K lists every section and page. */
export const GROUPS: NavGroup[] = [
  {
    id: "me",
    label: "About",
    links: [
      { section: "about", label: "About", hint: "Who I am and what I build" },
      { section: "moments", label: "Moments", hint: "Places I’ve been, on a timeline" },
      { section: "experience", label: "Experience", hint: "Where I’ve worked" },
    ],
  },
  {
    id: "build",
    label: "Work",
    links: [
      { section: "work", label: "Systems", hint: "Every project, opened in its editor" },
      { section: "architecture", label: "Architecture", hint: "How the bigger systems fit together" },
      { section: "stack", label: "Stack", hint: "Tools, layer by layer" },
      ...(hasActivity ? [{ section: "activity", label: "Activity", hint: "A year of commits on GitHub" }] : []),
      { page: "/shipyard", label: "Shipyard", hint: "Apps, extensions and libraries to install" },
      // Live infra is switched off until the status endpoint is online; see app/_infra/page.tsx.
      // { page: "/infra", label: "Live infra", hint: "My own server, in real time" },
    ],
    pages: ["/shipyard", "/work"], // add "/infra" back with the link above
  },
  {
    id: "recognition",
    label: "Recognition",
    links: [
      { section: "awards", label: "Awards", hint: "Wins, medals and hackathons" },
      { section: "patents", label: "Patents", hint: "Published patent applications" },
      { section: "papers", label: "Papers", hint: "Research I’ve published" },
      { page: "/achievements", label: "All achievements", hint: "Everything, with certificates" },
    ],
    pages: ["/achievements"],
  },
  { id: "companies", label: "Companies", section: "companies" },
  { id: "contact", label: "Contact", section: "contact" },
];

/** The header group to highlight: the one holding the section in view, or the current page. */
export function activeGroup(section: string | null, pathname: string): string | null {
  for (const g of GROUPS) {
    if (section && (g.section === section || g.links?.some((l) => l.section === section))) return g.id;
    if (g.pages?.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return g.id;
  }
  return null;
}

/** Opens the command palette from anywhere (the header button, the mobile menu). */
export const openPalette = () => window.dispatchEvent(new Event("open-palette"));
