import data from "./data.json";

/** Who I am. Lives in the portfolio.profile table; see db/README.md. */
export type Profile = {
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  location: string;
  /** One line under the name: how the résumé introduces me. */
  headline: string;
  summary: string;
  interests: string[];
  education: string;
  /** Newest first, as on the résumé. */
  schooling: { degree: string; school: string; score: string; period: string }[];
  phone: { display: string; href: string };
  portrait: { src: string; width: number; height: number; alt: string };
  email: string;
  resume: string;
  links: { label: string; href: string; handle: string }[];
  siteUrl: string;
};

export const profile: Profile = data.profile;
