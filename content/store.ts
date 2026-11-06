import data from "./data.json";

type File = { label: string; file: string; href: string; /** e.g. "2.1 MB" */ size?: string };

export type OS = "windows" | "macos" | "linux";
export const OS_LABEL: Record<OS, string> = { windows: "Windows", macos: "macOS", linux: "Linux" };

/** An app or extension on the /winstore page. Add one by adding a row to portfolio.store_apps. */
export type StoreApp = {
  slug: string;
  name: string;
  /** app = desktop app, vscode = VS Code extension, pip = Python library on PyPI, chrome = Chrome extension. */
  kind: "app" | "vscode" | "pip" | "chrome";
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
  /** The main Get button (the Windows build, for apps). */
  download: File;
  /** Operating systems an app runs on; defaults to Windows only. */
  platforms?: OS[];
  /** The Get button on the macOS and Linux tabs, when that build differs from `download`. */
  osDownloads?: Partial<Record<OS, File>>;
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

/** The operating systems an app runs on (Windows when not set). */
export const platformsOf = (a: StoreApp): OS[] => a.platforms ?? ["windows"];
