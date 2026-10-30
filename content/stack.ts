import type { Layer } from "./types";

export const stack: Record<Layer, string[]> = {
  interface: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Android · Java", "Kotlin", "Jetpack Compose", "PyQt", "Tkinter", "AR/VR"],
  api: ["Python", "FastAPI", "Flask", "REST APIs", "WebSocket", "System integrations"],
  automation: ["Python automation", "Agentic AI", "Vertex AI", "OCR", "Computer vision", "scikit-learn"],
  data: ["Firebase", "Firestore", "SQL", "SQLite", "Room", "MongoDB"],
  infra: ["Docker", "Linux", "Nginx", "Networking", "AWS", "Self-hosting"],
};
