export const profile = {
  name: "Mohammad Ramiz",
  firstName: "Mohammad",
  lastName: "Ramiz",
  role: "Software Engineer",
  company: "Moglix",
  location: "Greater Noida, Uttar Pradesh, India",
  /** One line under the name: how the résumé introduces me. */
  headline: "Python AI / LLM, backend and Android developer",
  summary:
    "I build AI systems, backends and the infrastructure they run on: LLM agents, REST APIs and data pipelines in Python, Dockerised services, and the Android and web apps on top.",
  interests: [
    "LLM agents, RAG and conversational analytics",
    "Python automation and process optimisation",
    "AI/ML, computer vision, OCR and predictive modelling",
    "Demand forecasting and time-series models",
    "Backend engineering, REST APIs and system integrations",
    "Docker, Linux, Nginx, networking and self-hosted infrastructure",
    "React, TypeScript, Next.js and experimental products",
    "Android, AR/VR and interactive experiences",
  ],
  education: "B.Tech CSE (AI & ML), Sharda University",
  /** Newest first, as on the résumé. */
  schooling: [
    { degree: "B.Tech CSE, AI & ML", school: "Sharda University", score: "CGPA 8.3", period: "2022 – 2026" },
    { degree: "Intermediate (PCM)", school: "Springdale's Children's School", score: "70%", period: "2021" },
    { degree: "High School", school: "St Paul's Inter College", score: "80%", period: "2019" },
  ],
  phone: { display: "+91 95170 28373", href: "tel:+919517028373" },
  portrait: { src: "/images/mascot-full.webp", width: 900, height: 1600, alt: "3D cartoon of Mohammad Ramiz holding a stylus beside a glowing Portfolio sign" },
  email: "ramizanas6@gmail.com",
  resume: "/resume.pdf",
  links: [
    { label: "GitHub", href: "https://github.com/RamizMohammad", handle: "RamizMohammad" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ramizmohammad/", handle: "ramizmohammad" },
    { label: "X", href: "https://x.com/Mohammad__Ramiz", handle: "@Mohammad__Ramiz" },
  ],
  siteUrl: "https://www.mohammadramiz.in",
} as const;
