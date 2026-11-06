/**
 * The "Hiring for" lens. A visitor picks the role they are hiring for and the whole site leans
 * towards it: matching projects, tools and experience stay bright, the rest dims, and the résumé
 * reorders itself. Everything is tagged here, from the words already on the page, so a new project
 * or tool joins the right lenses without anyone tagging it by hand.
 *
 * The lens itself is one attribute on <html> (data-lens); CSS does the dimming, so server-rendered
 * sections work without any client code.
 */
export type Lens = "genai" | "backend" | "android" | "ml";

export const LENSES: { id: Lens; label: string; short: string; pitch: string }[] = [
  { id: "genai", label: "GenAI / LLM", short: "GenAI", pitch: "LLM agents, RAG and the APIs that ship them." },
  { id: "backend", label: "Python backend", short: "Backend", pitch: "Python backends, data pipelines and the servers they run on." },
  { id: "android", label: "Android", short: "Android", pitch: "Android apps, from Java and Kotlin to the backend behind them." },
  { id: "ml", label: "ML / Data science", short: "ML", pitch: "Forecasting, OCR and models that land in production." },
];

export const isLens = (v: unknown): v is Lens => LENSES.some((l) => l.id === v);

// What each role looks for. Matched against tool names, project stacks and experience bullets.
const MATCH: Record<Lens, RegExp> = {
  genai: /\b(LLMs?|VLLMs?|RAG|Gemini|Vertex|Agentic|agents?|Qdrant|Sentence-Transformers|OpenAI|Anthropic|prompt|embeddings?|GenAI|text-to-SQL|conversational)\b/i,
  backend: /\b(FastAPI|Flask|Django|Spring|Hibernate|REST|WebSocket|Kafka|APIs?|PostgreSQL|MySQL|MongoDB|SQLite|BigQuery|Docker|Nginx|Linux|CI\/CD|AWS|Redis|Celery|Self-hosting|backend|pipelines?|microservices?)\b/i,
  android: /\b(Android|Kotlin|Jetpack Compose|Jetpack|Room DB|MVVM|XML|Firebase|Firestore|FCM|ADB|Play Store|Google Play)\b/i,
  ml: /\b(ML|machine learning|Prophet|LightGBM|scikit-learn|Pandas|OCR|Textract|forecast(ing)?|time-series|PyTorch|TensorFlow|Sentence-Transformers|computer vision|predictive|models?|Power BI|Dash|safety stock)\b/i,
};

// Single tools every one of these roles uses day to day, so their lens never dims them. Only an
// exact tool name counts: a project isn't GenAI just because it is written in Python.
const SHARED: Record<string, Lens[]> = {
  Python: ["genai", "backend", "ml"],
  "Git and GitHub": ["genai", "backend", "android", "ml"],
};

/** The lenses a set of words belongs to, as a space-separated list for data-lens-tags. */
export function lensTags(...texts: (string | undefined | null | false)[]): string {
  const text = texts.filter(Boolean).join(" · ");
  const shared = SHARED[text.trim()] ?? [];
  return LENSES.filter((l) => MATCH[l.id].test(text) || shared.includes(l.id))
    .map((l) => l.id)
    .join(" ");
}

export const LENS_KEY = "lens";

/**
 * Runs before the page paints, so a returning visitor (or a ?for= link) never sees the page flash
 * un-lensed: ?for= wins and is remembered, otherwise the last choice is restored.
 */
export const lensScript = `try{var q=new URLSearchParams(location.search).get('for'),ok=${JSON.stringify(LENSES.map((l) => l.id))};var v=ok.indexOf(q)>-1?q:(q==='any'?null:localStorage.getItem('${LENS_KEY}'));if(q==='any')localStorage.removeItem('${LENS_KEY}');if(q&&ok.indexOf(q)>-1)localStorage.setItem('${LENS_KEY}',q);if(ok.indexOf(v)>-1)document.documentElement.dataset.lens=v}catch(e){}`;
