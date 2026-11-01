/** Sections of the home page, in page order. */
export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "moments", label: "Moments" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "architecture", label: "Architecture" },
  { id: "stack", label: "Stack" },
  { id: "awards", label: "Awards" },
  { id: "patents", label: "Patents" },
  { id: "papers", label: "Papers" },
  { id: "companies", label: "Companies" },
  { id: "contact", label: "Contact" },
] as const;

/** The ones the header shows; the menu and ⌘K list them all. */
export const NAV = SECTIONS.filter((s) => ["about", "moments", "experience", "work", "awards", "patents", "papers", "companies", "contact"].includes(s.id));

/** Opens the command palette from anywhere (the header button, the mobile menu). */
export const openPalette = () => window.dispatchEvent(new Event("open-palette"));
