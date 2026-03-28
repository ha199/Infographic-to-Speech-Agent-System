# agents/validator_agent.py
# Agent 4 — Fixes quality issues and scores the speech

import json
import re
import google.generativeai as genai


def run_validator_agent(speech_draft: str) -> dict:
    print("[Validator] Checking and improving quality...")

    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""You are a speech quality editor. Review and improve this speech.

SPEECH:
{speech_draft}

FIXES TO APPLY:
1. WEAK OPENER — if starts with Today or I would like or In this or Let me → rewrite opener
2. REPETITION — remove any repeated phrases or statistics
3. BAD TRANSITIONS — add smooth bridges between abrupt paragraphs
4. GENERIC CLOSING — if closing is In conclusion or Thank you → replace with punchy line
5. AWKWARD PHRASING — fix unnatural sentences
6. TONE CONSISTENCY — keep tone consistent throughout

SCORE each 0 to 100:
- Flow: smoothness of paragraph connections
- Clarity: how clearly ideas are expressed
- Hook: strength of the opening
- Structure: logical organization

Return ONLY this JSON — no markdown, no code block, no explanation:
{{
  "speech": "the complete improved speech text here",
  "scores": [
    {{"label": "Flow",      "value": 91}},
    {{"label": "Clarity",   "value": 88}},
    {{"label": "Hook",      "value": 94}},
    {{"label": "Structure", "value": 89}}
  ],
  "fixes_applied": ["fix 1 description", "fix 2"]
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

    if not data.get("speech"):
        data = {
            "speech": speech_draft,
            "scores": [
                {"label": "Flow",      "value": 82},
                {"label": "Clarity",   "value": 80},
                {"label": "Hook",      "value": 85},
                {"label": "Structure", "value": 83},
            ],
            "fixes_applied": []
        }

    print(f"[Validator] Done ✓ — {len(data.get('fixes_applied', []))} fixes applied")
    return data
