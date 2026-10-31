export const profile = {
  name: "Mohammad Ramiz",
  firstName: "Mohammad",
  lastName: "Ramiz",
  role: "Software Engineer",
  company: "Moglix",
  location: "Greater Noida, Uttar Pradesh, India",
  summary:
    "I build automation, backends and the infrastructure they run on. Python services, REST APIs, Docker on Linux, and the Android and web apps on top.",
  interests: [
    "Python automation and process optimisation",
    "AI/ML, computer vision, OCR and predictive modelling",
    "Backend engineering, REST APIs and system integrations",
    "Docker, Linux, Nginx, networking and self-hosted infrastructure",
    "React, TypeScript, Next.js and experimental products",
    "Android, AR/VR and interactive experiences",
  ],
  education: "Computer Science",
  phone: { display: "+91 95170 28373", href: "tel:+919517028373" },
  portrait: { src: "/images/mascot-full.webp", width: 900, height: 1600, alt: "3D cartoon of Mohammad Ramiz holding a stylus beside a glowing Portfolio sign" },
  email: "ramizanas6@gmail.com",
  resume: "/resume.pdf",
  links: [
    { label: "GitHub", href: "https://github.com/RamizMohammad", handle: "RamizMohammad" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mohammad-ramiz-886468217/", handle: "mohammad-ramiz" },
    { label: "X", href: "https://x.com/Mohammad__Ramiz", handle: "@Mohammad__Ramiz" },
  ],
  siteUrl: "https://www.mohammadramiz.in",
} as const;
