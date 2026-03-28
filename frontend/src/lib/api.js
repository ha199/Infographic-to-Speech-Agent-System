// lib/api.js
// Sends image + config to Python FastAPI backend at localhost:4000

const BACKEND = "http://localhost:4000";

// Check if backend is alive
export async function checkBackend() {
  try {
    const res = await fetch(`${BACKEND}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function generateSpeech({ file, tone, audience, duration, focus, onLog }) {
  onLog("System", "system", "Checking backend connection...");

  // First check if backend is running
  const alive = await checkBackend();
  if (!alive) {
    throw new Error(
      "Cannot reach backend at localhost:4000. " +
      "Make sure you ran: cd backend && python main.py"
    );
  }

  onLog("System",     "system", "Backend connected ✓");
  onLog("OCR-Agent",  "ocr",    "Sending image to Gemini Vision...");

  const formData = new FormData();
  formData.append("file",     file);
  formData.append("tone",     tone);
  formData.append("audience", audience);
  formData.append("duration", String(duration));
  formData.append("focus",    focus);

  const res = await fetch(`${BACKEND}/api/speech/generate`, {
    method: "POST",
    body:   formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Server error ${res.status}`);
  }

  const data = await res.json();

  onLog("OCR-Agent",     "ocr",       `OCR complete — "${data.ocr_data?.title}" ✓`);
  onLog("Insight-Agent", "insight",   `Insights extracted ✓`);
  onLog("Speech-LLM",    "llm",       `Speech drafted — ${data.word_count} words ✓`);
  onLog("Validator",     "validator", `Quality validated ✓`);
  onLog("System",        "system",    `Pipeline complete 🎙`);

  return data;
}
