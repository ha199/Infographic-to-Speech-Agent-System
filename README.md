# 🎙 InfroSpeak — Infographic to Speech AI Agent

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Free](https://img.shields.io/badge/API-100%25_Free-00C853?style=for-the-badge)

**Upload any infographic → 4-Agent AI Pipeline → Presentation-ready speech**

*Built as part of the AI Engineer Assessment — Full Stack AI, 72-hour Take-Home*

</div>

---

## 📌 What is InfroSpeak?

InfroSpeak is a full-stack AI system that takes an infographic image as input and automatically generates a polished, presentation-ready speech. It uses a **multi-agent pipeline** powered entirely by **Google Gemini 2.5 Flash** — completely free, no credit card required.

### How it works

```
User uploads infographic (JPG / PNG / WebP)
            │
            ▼
┌───────────────────────────────────────────┐
│             4-AGENT PIPELINE              │
│                                           │
│  1. OCR Agent                             │
│     Gemini Vision reads the image         │
│     Extracts all text, stats, layout      │
│                    │                      │
│  2. Insight Agent                         │
│     Finds central idea & hook             │
│     Identifies key points & narrative     │
│                    │                      │
│  3. Speech LLM Agent                      │
│     Generates full speech draft           │
│     Tuned to tone & target audience       │
│                    │                      │
│  4. Validator Agent                       │
│     Fixes weak openers & repetition       │
│     Scores quality — Flow/Clarity/Hook    │
└────────────────────┬──────────────────────┘
                     │
                     ▼
          Final Speech Output ✓
```

---

## ✨ Features

- 📸 **Image Upload** — Drag & drop or click to upload JPG, PNG, WebP infographics
- 👁 **OCR Agent** — Gemini Vision extracts every piece of text and data from the image
- 🧠 **Insight Agent** — Identifies central idea, hook, key points, and narrative angle
- ✍ **Speech LLM Agent** — Generates a full, flowing speech (~130 words/minute)
- ✅ **Validator Agent** — Fixes weak openers, repetition, bad flow, and generic closings
- 🎛 **6 Tone Modes** — Professional, Inspiring, Academic, Conversational, Executive, Storytelling
- 👥 **5 Audience Types** — General, Technical, Executive, Investors, Students
- ⏱ **Duration Control** — 1 to 10 minute speech target
- 📊 **Quality Scores** — Flow, Clarity, Hook, Structure scored 0–100
- 📋 **4 Output Tabs** — Speech, Insights, Raw OCR text, Agent Logs
- 💾 **Copy & Download** — Copy to clipboard or download as `.txt`
- 🟢 **Backend Status Indicator** — Live dot shows if backend is connected

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, React 18, CSS Modules |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI Model** | Google Gemini 2.5 Flash (Vision + Text) |
| **Image Processing** | Pillow (PIL) |
| **API Communication** | REST — multipart/form-data |

---

## 📁 Project Structure

```
introspeak/
│
├── backend/                     ← Python FastAPI server
│   ├── main.py                  ← Entry point, CORS, API routes
│   ├── requirements.txt         ← Python dependencies
│   ├── .env.example             ← Copy to .env and add Gemini key
│   └── agents/
│       ├── __init__.py
│       ├── ocr_agent.py         ← Agent 1: Gemini Vision reads image
│       ├── insight_agent.py     ← Agent 2: Extracts insights & hook
│       ├── speech_agent.py      ← Agent 3: Generates speech draft
│       ├── validator_agent.py   ← Agent 4: Fixes quality & scores
│       └── pipeline.py          ← Orchestrator: runs all 4 agents
│
└── frontend/                    ← Next.js React app
    ├── package.json
    ├── next.config.js
    └── src/
        ├── app/
        │   ├── layout.js        ← Root layout
        │   └── page.js          ← Full UI page
        ├── lib/
        │   └── api.js           ← Calls Python backend
        └── styles/
            ├── globals.css      ← CSS variables & global styles
            └── Home.module.css  ← Component styles
```

---

## 🚀 Getting Started

### Prerequisites

Make sure these are installed on your machine:

- **Python 3.8+** → https://python.org/downloads
- **Node.js 18+** → https://nodejs.org
- **Git** → https://git-scm.com

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/introspeak.git
cd introspeak
```

---

### Step 2 — Get a Free Gemini API Key

1. Go to → **https://aistudio.google.com**
2. Click **Get API Key** → **Create API Key**
3. Copy the key — it looks like `AIzaSy...`

> ✅ No credit card needed. Free tier gives you **1500 requests/day**.

---

### Step 3 — Run the Backend

Open **Terminal 1** and run:

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Open `backend/.env` in VS Code and paste your key:

```env
GEMINI_API_KEY=AIzaSyYourActualKeyHere
```

Start the server:

```bash
python main.py
```

You should see:
```
✅  Backend running  →  http://localhost:4000
📖  API docs        →  http://localhost:4000/docs
```

---

### Step 4 — Run the Frontend

Open **Terminal 2** — keep Terminal 1 running:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
▲ Next.js 14.2.0
- Local: http://localhost:3000
```
Test the backned on swagger whihc was working fine 

<img width="1919" height="931" alt="image" src="https://github.com/user-attachments/assets/087fff6c-9182-410c-9f1a-a32b5a13570d" />

---

### Step 5 — Open the App

Go to → **http://localhost:3000** in your browser.

The UI will show a **🟢 green dot** when the backend is connected and ready to use.

The frontend UI test involves processing a JPG image to extract information, display results, and ensure that all required options are available as specified in the requirements.
<img width="1763" height="2587" alt="image" src="https://github.com/user-attachments/assets/09e384b8-648c-4391-a162-983f9ecb8115" />

Insights 

<img width="1396" height="889" alt="image" src="https://github.com/user-attachments/assets/0054e379-0a9d-48cf-999c-dc6d575846c1" />

Extracted

<img width="1382" height="647" alt="image" src="https://github.com/user-attachments/assets/702c6b0b-1e21-4bc5-9694-d55f678e7599" />

---

## 🖥 How to Use

1. **Upload** — Click the upload area or drag & drop any infographic image
2. **Configure** — Select tone, audience, duration, and focus area
3. **Generate** — Click ⚡ Generate Speech and wait ~15–20 seconds
4. **View** — Switch between **Speech**, **Insights**, **Extracted**, and **Logs** tabs
5. **Export** — Copy to clipboard or download as a `.txt` file

---

## 🤖 Agent Details

### Agent 1 — OCR Agent (`ocr_agent.py`)
Uses **Gemini 2.5 Flash Vision** to analyze the uploaded image and extract:
- All visible text organized by layout hierarchy
- Key statistics, percentages, and data points
- Main topics and themes
- Description of visual elements (charts, icons, diagrams)

### Agent 2 — Insight Agent (`insight_agent.py`)
Analyzes OCR output to identify:
- **Central idea** — the single most important message
- **Hook** — a compelling opening statement
- **Key points** — top 3 most important points
- **Supporting data** — specific facts to weave into the speech
- **Narrative angle** — recommended storytelling approach
- **Closing message** — the most powerful final takeaway

### Agent 3 — Speech LLM Agent (`speech_agent.py`)
Generates a complete polished speech:
- Word count calculated from duration (~130 words/minute)
- Tone and audience applied precisely to the prompt
- Statistics woven naturally — never listed as bullets
- Only uses facts from the brief — no hallucination
- Structure enforced: Hook → Context → Body → Transition → Closing

### Agent 4 — Validator Agent (`validator_agent.py`)
Quality control pass that fixes:
1. **Weak openers** — rewrites if starts with "Today I will..." or "Let me..."
2. **Repetition** — removes repeated phrases and data points
3. **Bad transitions** — adds smooth bridges between abrupt paragraphs
4. **Generic closings** — replaces "In conclusion..." with punchy final line
5. **Tone inconsistency** — ensures consistent tone throughout

Then scores the result: **Flow**, **Clarity**, **Hook**, **Structure** (each 0–100)

---

## 📡 API Reference

### Health Check
```http
GET http://localhost:4000/health
```
```json
{ "status": "ok", "model": "gemini-2.5-flash" }
```

### Generate Speech
```http
POST http://localhost:4000/api/speech/generate
Content-Type: multipart/form-data
```

| Field | Type | Required | Default | Options |
|---|---|---|---|---|
| `file` | image | ✅ | — | JPG, PNG, WebP |
| `tone` | string | No | `professional` | professional, inspiring, academic, conversational, executive, storytelling |
| `audience` | string | No | `general` | general, technical, executive, investors, students |
| `duration` | integer | No | `3` | 1–10 (minutes) |
| `focus` | string | No | `auto` | auto, data, narrative, trends, comparison, solution |

**Response:**
```json
{
  "success": true,
  "speech": "Full speech text here...",
  "scores": [
    { "label": "Flow",      "value": 91 },
    { "label": "Clarity",   "value": 88 },
    { "label": "Hook",      "value": 94 },
    { "label": "Structure", "value": 89 }
  ],
  "ocr_data": {
    "title": "Infographic title",
    "extracted_text": "All extracted text...",
    "key_stats": ["72%", "3x growth"],
    "main_topics": ["AI", "Productivity"]
  },
  "insight_data": {
    "central_idea": "...",
    "hook": "...",
    "key_points": ["point 1", "point 2"]
  },
  "word_count": 390
}
```

> 📖 Interactive API docs available at → **http://localhost:4000/docs**

---

## 🛠 Troubleshooting

| Error | Fix |
|---|---|
| `ModuleNotFoundError: google.generativeai` | Run `pip install -r requirements.txt` inside `backend/` |
| `Failed to fetch` in UI | Backend not running — run `python main.py` in `backend/` folder |
| 🔴 Red dot in UI | Backend is offline — check Terminal 1 is still running |
| `GEMINI_API_KEY missing` | Copy `.env.example` to `.env` and paste your API key |
| `npm: command not found` | Install Node.js from https://nodejs.org |
| `pip: command not found` | Try `python -m pip install -r requirements.txt` |
| Port 4000 already in use | Close other terminal sessions or restart VS Code |

---

## 📋 Assessment Criteria Coverage

| Criteria | Implementation | Status |
|---|---|---|
| Backend API — upload, OCR, insights, speech | `backend/main.py` + `agents/` | ✅ |
| Frontend UI — upload, display, tone selection | `frontend/src/app/page.js` | ✅ |
| Architecture diagram | Pipeline diagram in this README | ✅ |
| Component explanation | Agent Details section | ✅ |
| Data flow clarity | Pipeline diagram + API docs | ✅ |
| Working backend APIs | FastAPI `/health` + `/api/speech/generate` | ✅ |
| Functional frontend UI | Next.js with live backend status indicator | ✅ |
| End-to-end flow | Upload → OCR → Insight → Speech → Validate → Output | ✅ |
| Clean speech generation | 4-agent pipeline with structured prompts | ✅ |
| Central idea extraction | Dedicated Insight Agent | ✅ |
| Tone control | 6 tone modes applied in Speech Agent | ✅ |
| Avoid hallucination | Speech Agent restricted to brief content only | ✅ |
| Structured speech output | Hook → Context → Body → Close enforced | ✅ |
| Scenario — weak openings | Validator Agent Fix #1 | ✅ |
| Scenario — repetition | Validator Agent Fix #2 | ✅ |
| Scenario — bad flow | Validator Agent Fix #3 | ✅ |
| Agent-based architecture ⭐ Bonus | 4 dedicated agents + pipeline orchestrator | ✅ |
| Multi-step pipeline ⭐ Bonus | Sequential 4-step processing | ✅ |
| Error handling ⭐ Bonus | Try/except in all agents + HTTP error responses | ✅ |

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">
Built with ❤️ using Google Gemini 2.5 Flash · Python FastAPI · Next.js 14
</div>
