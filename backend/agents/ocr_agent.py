# agents/ocr_agent.py
# Agent 1 — Gemini Vision reads the infographic image

import json
import re
import io
import google.generativeai as genai
from PIL import Image


def run_ocr_agent(image_bytes: bytes, mime_type: str) -> dict:
    print("[OCR-Agent] Reading image with Gemini Vision...")

    model = genai.GenerativeModel("gemini-2.5-flash")
    image = Image.open(io.BytesIO(image_bytes))

    prompt = """You are an OCR agent. Extract ALL visible text and data from this infographic.

Return ONLY this JSON — no markdown, no code block, no explanation:
{
  "title": "main title of the infographic",
  "extracted_text": "ALL text found organized top to bottom",
  "key_stats": ["every number or percentage visible"],
  "main_topics": ["3 to 6 key themes"],
  "data_type": "statistical or process or comparison or timeline or informational",
  "visual_elements": "description of charts icons or diagrams"
}"""

    response = model.generate_content([prompt, image])
    raw = response.text.strip()

    # Strip markdown code blocks if model wraps in them
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)

    try:
        match = re.search(r'\{[\s\S]*\}', raw)
        data = json.loads(match.group()) if match else {}
    except Exception:
        data = {}

    if not data.get("title"):
        data = {
            "title": "Infographic",
            "extracted_text": raw,
            "key_stats": [],
            "main_topics": [],
            "data_type": "informational",
            "visual_elements": "Not determined"
        }

    print(f"[OCR-Agent] Done ✓ — '{data.get('title')}' | {len(data.get('key_stats', []))} stats")
    return data
