# 🎙 InfroSpeak — Infographic to Speech AI Agent

**Stack:** Next.js frontend + Python FastAPI backend + Google Gemini 2.5 Flash (free)

---

## 🔑 Step 1 — Get FREE Gemini API Key
1. Go to → https://aistudio.google.com
2. Click **Get API Key** → **Create API Key**
3. Copy it (looks like `AIzaSy...`)
4. No credit card. Free: 1500 requests/day.

---

## ▶ Step 2 — Run Backend (Terminal 1)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Now open `backend/.env` and replace `AIzaSy-PASTE_YOUR_KEY_HERE` with your real key.

```bash
python main.py
```

You should see:
```
✅  Backend running  →  http://localhost:4000
```

---

## ▶ Step 3 — Run Frontend (Terminal 2)

Open a NEW terminal (click + in VS Code terminal):

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
Local: http://localhost:3000
```

---

## ✅ Step 4 — Use the App

Open browser → **http://localhost:3000**

The UI shows a green dot when backend is connected.
Upload any infographic image → click **Generate Speech**.

---

## 📁 Files

```
introspeak/
├── backend/
│   ├── main.py                  FastAPI server
│   ├── requirements.txt         Python packages
│   ├── .env.example             Copy to .env and add your key
│   └── agents/
│       ├── ocr_agent.py         Gemini Vision reads image
│       ├── insight_agent.py     Extracts key insights
│       ├── speech_agent.py      Generates speech
│       ├── validator_agent.py   Fixes and scores quality
│       └── pipeline.py          Runs all 4 agents
└── frontend/
    ├── package.json
    └── src/
        ├── app/
        │   ├── layout.js
        │   └── page.js          Full UI
        ├── lib/
        │   └── api.js           Calls Python backend
        └── styles/
            ├── globals.css
            └── Home.module.css
```
