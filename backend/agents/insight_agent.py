# agents/insight_agent.py
# Agent 2 — Extracts central idea, hook, key points, narrative angle

import json
import re
import google.generativeai as genai


def run_insight_agent(ocr_data: dict, config: dict) -> dict:
    audience = config.get("audience", "general")
    focus = config.get("focus", "auto")
    print("[Insight-Agent] Extracting insights...")

    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""You are a strategic insight analyst. Analyze this infographic content.

CONTENT:
Title: {ocr_data.get('title')}
Text: {ocr_data.get('extracted_text')}
Stats: {'; '.join(ocr_data.get('key_stats', []))}
Topics: {', '.join(ocr_data.get('main_topics', []))}
Type: {ocr_data.get('data_type')}

AUDIENCE: {audience}
FOCUS: {"determine best focus from the content" if focus == "auto" else focus}

Return ONLY this JSON — no markdown, no code block, no explanation:
{{
  "central_idea": "the single most important message in one sentence",
  "hook": "a compelling opener — surprising stat or bold claim or question",
  "key_points": ["most important point", "second point", "third point"],
  "supporting_data": ["specific fact to use", "another fact"],
  "narrative_angle": "recommended storytelling approach",
  "audience_relevance": "why this matters to this audience",
  "closing_message": "most powerful single takeaway",
  "insights_summary": [
    {{"label": "short label", "value": "concise insight", "type": "number or text or trend"}}
  ]
}}"""

    response = model.generate_content(prompt)
    raw = response.text.strip()
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)

    try:
        match = re.search(r'\{[\s\S]*\}', raw)
        data = json.loads(match.group()) if match else {}
    except Exception:
        data = {}

    if not data.get("central_idea"):
        data = {
            "central_idea": "Key insights from this infographic",
            "hook": "What if one image could change how you see this topic?",
            "key_points": [],
            "supporting_data": [],
            "narrative_angle": "informational",
            "audience_relevance": "Relevant to the target audience",
            "closing_message": "These insights demand action.",
            "insights_summary": []
        }

    print(f"[Insight-Agent] Done ✓")
    return data
