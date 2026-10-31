/**
 * The photo timeline after About. Add a moment by dropping an image in public/images/moments/
 * and adding an entry here; they are shown oldest first, sorted by `when`.
 *
 * The first entries use the certificates already on the site, so every moment is real. Replace
 * them with your own photos from each place whenever you like.
 */
export type Moment = {
  /** Sort key: a decimal year, e.g. 2025.5 for mid-2025. Only used for ordering. */
  when: number;
  /** What the card shows as the date, e.g. "June 2025" or just "2024". */
  date: string;
  place: string;
  title: string;
  caption?: string;
  image: { src: string; width: number; height: number; alt: string };
  /** "contain" shows the whole image on white (documents, certificates); "cover" fills the frame (photos). */
  fit?: "cover" | "contain";
};

export const moments: Moment[] = [
  {
    when: 2024.1,
    date: "2024",
    place: "K.R. Mangalam University, Gurugram",
    title: "56-hour hackathon — finalist",
    caption: "Reached the final after four judging rounds.",
    image: { src: "/images/certificates/krmu.webp", width: 1000, height: 729, alt: "K.R. Mangalam University hackathon certificate" },
    fit: "contain",
  },
  {
    when: 2024.2,
    date: "2024",
    place: "Sharda University, Greater Noida",
    title: "24-hour hackathon — 6th place",
    image: { src: "/images/certificates/sharda.webp", width: 1000, height: 725, alt: "Sharda University hackathon certificate" },
    fit: "contain",
  },
  {
    when: 2024.3,
    date: "2024",
    place: "NHAI & HOAI",
    title: "Infrastructure Innovation hackathon",
    caption: "Proposed AI-assisted highway monitoring for pothole detection and commuter safety.",
    image: { src: "/images/certificates/nhai.webp", width: 1000, height: 684, alt: "NHAI and HOAI hackathon certificate" },
    fit: "contain",
  },
  {
    when: 2025.1,
    date: "2025",
    place: "IIIT Delhi, New Delhi",
    title: "Hack For Impact, E-Summit 2025",
    image: { src: "/images/certificates/iiitd.webp", width: 1000, height: 706, alt: "IIIT Delhi Hack For Impact certificate" },
    fit: "contain",
  },
  {
    when: 2025.2,
    date: "2025",
    place: "Google India, Gurugram",
    title: "Build With India",
    image: { src: "/images/certificates/build-with-india.webp", width: 1000, height: 707, alt: "Build With India certificate" },
    fit: "contain",
  },
  {
    when: 2025.4,
    date: "May – Jun 2025",
    place: "Bluestock Fintech",
    title: "SDE internship, project lead",
    caption: "Built the complete admin panel and its frontend architecture.",
    image: { src: "/images/certificates/bluestock.webp", width: 1000, height: 707, alt: "Bluestock Fintech internship certificate" },
    fit: "contain",
  },
  {
    when: 2025.48,
    date: "27 June 2025",
    place: "Indian Patent Office",
    title: "Patent published",
    caption: "Method and System for Real-Time User Safety During Vehicle Commutes.",
    image: { src: "/images/certificates/patent.webp", width: 1000, height: 773, alt: "Patent publication document" },
    fit: "contain",
  },
];
