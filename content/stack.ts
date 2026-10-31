import type { Layer } from "./types";

export const stack: Record<Layer, string[]> = {
  interface: ["Android (Java, Kotlin)", "Jetpack Compose", "MVVM", "XML", "React", "TypeScript", "HTML · CSS · JS", "Django templating", "PySide6 / Qt", "PyQt", "Tkinter", "Dash"],
  api: ["Python", "FastAPI", "Flask", "Django", "Spring Boot", "Hibernate", "REST APIs", "WebSocket", "Kafka", "WhatsApp Business API", "Microsoft Graph API"],
  automation: ["Gemini", "Vertex AI", "Agentic AI (ReAct)", "RAG", "LLMs and VLLMs", "OCR", "AWS Textract", "Prophet", "LightGBM", "Pandas", "Sentence-Transformers", "scikit-learn"],
  data: ["MySQL", "PostgreSQL", "MongoDB", "SQLite", "BigQuery", "Qdrant", "Firebase", "Room DB", "Power BI"],
  infra: ["Docker", "Docker Compose", "AWS", "Git and GitHub", "CI/CD pipelines", "Linux", "Nginx", "Self-hosting"],
};
