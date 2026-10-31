/** Sections of the home page, in order. The header shows the first four. */
export const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "architecture", label: "Architecture" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
  { id: "about", label: "About" },
  { id: "moments", label: "Moments" },
  { id: "stack", label: "Stack" },
  { id: "awards", label: "Awards" },
  { id: "publications", label: "Publications" },
] as const;

export const NAV = SECTIONS.slice(0, 4);

/** Opens the command palette from anywhere (the header button, the mobile menu). */
export const openPalette = () => window.dispatchEvent(new Event("open-palette"));
