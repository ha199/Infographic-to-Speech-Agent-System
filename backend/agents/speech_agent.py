# agents/speech_agent.py
# Agent 3 — Generates the full speech draft

import google.generativeai as genai

TONE_GUIDE = {
    "professional":    "formal, authoritative, evidence-based",
    "inspiring":       "energetic, motivational, emotionally resonant",
    "academic":        "scholarly, precise, analytical",
    "conversational":  "warm, direct, relatable — uses you and we",
    "executive":       "concise, strategic, outcome-focused, decisive",
    "storytelling":    "narrative-driven, vivid, arc-based",
}


def run_speech_agent(ocr_data: dict, insight_data: dict, config: dict) -> str:
    tone = config.get("tone", "professional")
    audience = config.get("audience", "general")
    duration = int(config.get("duration", 3))
    target_words = duration * 130

    print(f"[Speech-LLM] Writing {duration}min {tone} speech (~{target_words} words)...")

    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""You are an expert speechwriter. Write a complete polished speech.

BRIEF:
Topic: {ocr_data.get('title')}
Central Idea: {insight_data.get('central_idea')}
Hook: {insight_data.get('hook')}
Key Points: {' | '.join(insight_data.get('key_points', []))}
Supporting Data: {' | '.join(insight_data.get('supporting_data', []))}
Narrative Angle: {insight_data.get('narrative_angle')}
Audience Relevance: {insight_data.get('audience_relevance')}
Closing Message: {insight_data.get('closing_message')}
All Source Text: {ocr_data.get('extracted_text')}

TONE: {tone} — {TONE_GUIDE.get(tone, 'professional')}
AUDIENCE: {audience}
TARGET LENGTH: ~{target_words} words ({duration} minutes)

STRICT RULES:
1. START with the hook directly — NEVER open with Today I will or I would like to or Let me
2. Do NOT repeat any data point or idea more than once
3. Weave statistics naturally into sentences — never list them
4. Each paragraph must serve one clear purpose
5. Use smooth transition phrases between paragraphs
6. End ONLY with the closing message — brief and memorable
7. Use ONLY facts from this brief — do not invent any data

STRUCTURE — flowing prose no headings:
Hook → Context → Body 2 or 3 paragraphs → Transition → Closing

Return ONLY the speech text. No labels, no headings, no JSON."""

    response = model.generate_content(prompt)
    speech = response.text.strip()

    print(f"[Speech-LLM] Done ✓ — {len(speech.split())} words")
    return speech
