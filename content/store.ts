import data from "./data.json";

type File = { label: string; file: string; href: string };

/** An app or extension on the /winstore page. Add one by adding a row to portfolio.store_apps. */
export type StoreApp = {
  slug: string;
  name: string;
  kind: "app" | "extension";
  /** e.g. "Backup", "Browser extension". */
  category: string;
  /** When it ships under a company, e.g. "Loopax Technologies". */
  publisher?: string;
  tagline: string;
  about: string;
  version?: string;
  /** As shown, e.g. "21 Sep 2026". */
  released?: string;
  /** Size of the main download, e.g. "39.2 MB". */
  size?: string;
  /** The system requirements line. */
  requires: string;
  tone: "pink" | "lime" | "blue" | "sun" | "violet" | "mint";
  logo?: { src: string; width: number; height: number; alt: string };
  /** The main Get button. */
  download: File;
  /** A one-line install command, shown with a copy button. */
  install?: string;
  /** Manual install steps, e.g. for an unpacked browser extension. */
  steps?: string[];
  /** Other packages of the same release. */
  downloads?: File[];
  links?: { label: string; href: string }[];
  features?: string[];
  /** The project's case study at /work/<slug>. */
  system?: string;
};

// Rows of portfolio.store_apps, pulled from the database at build time (see db/README.md).
export const storeApps = ((data as { store?: StoreApp[] }).store ?? []) as StoreApp[];
