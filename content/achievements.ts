export type Achievement = {
  kind: "Award" | "Patent" | "Hackathon" | "Competition" | "Certification" | "Internship";
  title: string;
  org: string;
  year: string;
  status: string;
  detail?: string;
  image?: { src: string; width: number; height: number; alt: string };
};

export const achievements: Achievement[] = [
  {
    kind: "Award",
    title: "Jungle Torchbearer Award",
    org: "Moglix",
    year: "2026",
    status: "Won",
    detail: "For excellence in demand planning for Tata Steel (TSL): independent research and ownership that lifted OTIF (On-Time, In-Full) from below 50% to over 70%.",
  },
  {
    kind: "Patent",
    title: "Method and System for Real-Time User Safety During Vehicle Commutes",
    org: "Indian Patent Office",
    year: "2025",
    status: "Published",
    detail: "Application No. 202511053637 · Published 27 June 2025. A system for passenger safety during vehicle commutes: real-time safety monitoring, risk identification and proactive intervention against potential threats.",
    image: { src: "/images/certificates/patent.webp", width: 1000, height: 773, alt: "Patent publication document" },
  },
  {
    kind: "Hackathon", title: "Hack KRMU 4.0", org: "K.R. Mangalam University, Gurugram", year: "2024", status: "Finalist",
    detail: "Reached the final after four judging rounds.",
    image: { src: "/images/certificates/krmu.webp", width: 1000, height: 729, alt: "K.R. Mangalam University hackathon certificate" },
  },
  {
    kind: "Hackathon", title: "6th Technovation Hackathon", org: "Sharda University, Greater Noida", year: "2024", status: "6th place",
    image: { src: "/images/certificates/sharda.webp", width: 1000, height: 725, alt: "Sharda University hackathon certificate" },
  },
  {
    kind: "Hackathon", title: "Hack For Impact, E-Summit 2025", org: "IIIT Delhi", year: "2025", status: "Participant",
    image: { src: "/images/certificates/iiitd.webp", width: 1000, height: 706, alt: "IIIT Delhi Hack For Impact certificate" },
  },
  {
    kind: "Hackathon", title: "Road Safety Hackathon", org: "NHAI & HOAI, Delhi", year: "2024", status: "Semi-finalist",
    detail: "Proposed AI-assisted highway monitoring for pothole detection and commuter safety.",
    image: { src: "/images/certificates/nhai.webp", width: 1000, height: 684, alt: "NHAI and HOAI hackathon certificate" },
  },
  {
    kind: "Hackathon", title: "Build with India Hackathon", org: "Google Office, Gurugram", year: "2024", status: "8th place",
    image: { src: "/images/certificates/build-with-india.webp", width: 1000, height: 707, alt: "Build With India certificate" },
  },
  {
    kind: "Competition", title: "Flipkart GRiD 6.0, Software Development track", org: "Flipkart", year: "2024", status: "Level 1 cleared",
    image: { src: "/images/certificates/flipkart.webp", width: 1000, height: 684, alt: "Flipkart GRiD 6.0 certificate" },
  },
  {
    kind: "Internship", title: "Software Development Engineer intern", org: "Bluestock Fintech", year: "2025", status: "Completed",
    image: { src: "/images/certificates/bluestock.webp", width: 1000, height: 707, alt: "Bluestock Fintech internship certificate" },
  },
  {
    kind: "Certification", title: "Machine Learning A-Z: AI, Python & R", org: "Udemy", year: "2023", status: "Certified",
    image: { src: "/images/certificates/udemy.webp", width: 1000, height: 744, alt: "Udemy Machine Learning A-Z certificate" },
  },
  {
    kind: "Certification", title: "AWS Deep Dive", org: "Amazon Web Services", year: "2023", status: "Certified",
    image: { src: "/images/certificates/aws.webp", width: 1000, height: 551, alt: "AWS certificate" },
  },
  {
    kind: "Certification", title: "Android Application Development", org: "Udemy", year: "2023", status: "Certified",
  },
];
