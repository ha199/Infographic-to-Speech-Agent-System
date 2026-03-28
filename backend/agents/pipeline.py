# agents/pipeline.py
from agents.ocr_agent       import run_ocr_agent
from agents.insight_agent   import run_insight_agent
from agents.speech_agent    import run_speech_agent
from agents.validator_agent import run_validator_agent


def run_full_pipeline(image_bytes: bytes, mime_type: str, config: dict) -> dict:
    print("\n━━━ Pipeline Start ━━━")

    ocr_data     = run_ocr_agent(image_bytes, mime_type)
    insight_data = run_insight_agent(ocr_data, config)
    speech_draft = run_speech_agent(ocr_data, insight_data, config)
    validated    = run_validator_agent(speech_draft)

    final_speech = validated.get("speech") or speech_draft

    print("━━━ Pipeline Complete ━━━\n")

    return {
        "speech":       final_speech,
        "scores":       validated.get("scores", []),
        "ocr_data":     ocr_data,
        "insight_data": insight_data,
        "word_count":   len(final_speech.split())
    }
