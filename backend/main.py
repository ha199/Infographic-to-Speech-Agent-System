# main.py
import os
import google.generativeai as genai
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from agents.pipeline import run_full_pipeline

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing — open backend/.env and paste your key")

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="InfroSpeak API")

# ✅ Allow ALL origins so frontend never gets blocked
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "model": "gemini-2.5-flash"}


@app.post("/api/speech/generate")
async def generate_speech(
    file:     UploadFile = File(...),
    tone:     str = Form("professional"),
    audience: str = Form("general"),
    duration: int = Form(3),
    focus:    str = Form("auto"),
):
    allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed:
        raise HTTPException(400, "Unsupported file. Use JPEG, PNG or WebP.")

    image_bytes = await file.read()
    if len(image_bytes) > 20 * 1024 * 1024:
        raise HTTPException(413, "File too large — max 20MB.")

    config = {"tone": tone, "audience": audience, "duration": duration, "focus": focus}

    try:
        result = run_full_pipeline(image_bytes, file.content_type, config)
        return {"success": True, **result}
    except Exception as e:
        print(f"[ERROR] {e}")
        raise HTTPException(500, str(e))


if __name__ == "__main__":
    import uvicorn
    print("\n✅  Backend running  →  http://localhost:4000")
    print("📖  API docs        →  http://localhost:4000/docs\n")
    uvicorn.run("main:app", host="0.0.0.0", port=4000, reload=True)
