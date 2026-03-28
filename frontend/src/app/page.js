'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { generateSpeech, checkBackend } from '../lib/api';
import s from '../styles/Home.module.css';

const TONES = [
  { id: 'professional',   label: '🏢 Professional' },
  { id: 'inspiring',      label: '🔥 Inspiring' },
  { id: 'academic',       label: '📚 Academic' },
  { id: 'conversational', label: '💬 Conversational' },
  { id: 'executive',      label: '🎯 Executive' },
  { id: 'storytelling',   label: '✨ Storytelling' },
];

const STEPS = [
  { id: 'upload',   emoji: '📎', label: 'Upload' },
  { id: 'ocr',      emoji: '👁',  label: 'OCR Agent' },
  { id: 'insight',  emoji: '🧠', label: 'Insight Agent' },
  { id: 'llm',      emoji: '✍',  label: 'Speech LLM' },
  { id: 'validate', emoji: '✅', label: 'Validator' },
  { id: 'output',   emoji: '🎙', label: 'Output' },
];

const SCORE_COLORS = {
  Flow: 'var(--accent)', Clarity: 'var(--accent3)',
  Hook: 'var(--gold)',   Structure: 'var(--accent2)'
};

function fmtBytes(b) {
  return b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
}

export default function Home() {
  // Backend status
  const [backendStatus, setBackendStatus] = useState('checking'); // checking | ok | error

  // File
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  // Config
  const [tone,     setTone]     = useState('professional');
  const [audience, setAudience] = useState('general');
  const [duration, setDuration] = useState(3);
  const [focus,    setFocus]    = useState('auto');

  // Pipeline
  const [steps,     setSteps]     = useState({});
  const [running,   setRunning]   = useState(false);
  const [logs,      setLogs]      = useState([]);
  const [activeTab, setActiveTab] = useState('speech');

  // Results
  const [speech,      setSpeech]      = useState('');
  const [scores,      setScores]      = useState([]);
  const [ocrData,     setOcrData]     = useState(null);
  const [insightData, setInsightData] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);

  // ── Check backend on load and every 5s ──
  useEffect(() => {
    async function ping() {
      const alive = await checkBackend();
      setBackendStatus(alive ? 'ok' : 'error');
    }
    ping();
    const interval = setInterval(ping, 5000);
    return () => clearInterval(interval);
  }, []);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 4000);
  }

  // ── File handling ──
  const handleFile = useCallback((f) => {
    if (!f) return;
    const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ok.includes(f.type)) { showToast('Use JPG, PNG or WebP images only', 'error'); return; }
    if (f.size > 20 * 1024 * 1024) { showToast('File too large — max 20MB', 'error'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setSteps(p => ({ ...p, upload: 'done' }));
    showToast('File ready ✓');
  }, []);

  function clearFile() {
    setFile(null); setPreview(null); setSteps({});
    if (fileRef.current) fileRef.current.value = '';
  }

  // ── Logs ──
  const addLog = useCallback((agent, cls, msg) => {
    setLogs(prev => [...prev, { agent, cls, msg, time: new Date().toTimeString().slice(0, 8) }]);
  }, []);

  // ── Generate ──
  async function generate() {
    if (running || !file) return;

    setRunning(true);
    setSpeech(''); setScores([]); setOcrData(null); setInsightData(null);
    setLogs([]); setActiveTab('logs');
    setSteps({ upload: 'done' });

    // Animate steps while backend processes
    const stepOrder = ['ocr', 'insight', 'llm', 'validate'];
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < stepOrder.length) {
        setSteps(p => ({ ...p, [stepOrder[idx]]: 'active' }));
        idx++;
      } else clearInterval(timer);
    }, 3000);

    try {
      const result = await generateSpeech({ file, tone, audience, duration, focus, onLog: addLog });

      clearInterval(timer);
      setSteps({ upload: 'done', ocr: 'done', insight: 'done', llm: 'done', validate: 'done', output: 'done' });

      setSpeech(result.speech);
      setScores(result.scores || []);
      setOcrData(result.ocr_data);
      setInsightData(result.insight_data);
      setActiveTab('speech');
      showToast('Speech generated successfully ✓');
    } catch (err) {
      clearInterval(timer);
      setSteps(p => ({ ...p, llm: 'error' }));
      addLog('System', 'system', '❌ ' + err.message);
      showToast(err.message, 'error');
    }

    setRunning(false);
  }

  const wordCount = speech.split(/\s+/).filter(Boolean).length;
  const readMins  = (wordCount / 130).toFixed(1);

  function copyText()    { navigator.clipboard.writeText(speech); showToast('Copied to clipboard!'); }
  function downloadTxt() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([speech], { type: 'text/plain' }));
    a.download = `speech_${Date.now()}.txt`; a.click();
    showToast('Downloaded!');
  }

  return (
    <div className={s.app}>
      <div className={`${s.blob} ${s.blob1}`} />
      <div className={`${s.blob} ${s.blob2}`} />
      <div className={`${s.blob} ${s.blob3}`} />

      {/* Header */}
      <header className={s.header}>
        <div className={s.logo}>
          <div className={s.logoIcon}>🎙</div>
          <div className={s.logoName}>Infro<span>Speak</span></div>
        </div>
        <div className={s.badge}>AI Agent System</div>
      </header>

      {/* Backend status bar */}
      <div className={s.statusBar}>
        <div className={`${s.statusDot} ${backendStatus === 'ok' ? s.statusOk : backendStatus === 'error' ? s.statusErr : s.statusChk}`} />
        <div className={s.statusText}>
          {backendStatus === 'checking' && <span>Checking backend connection...</span>}
          {backendStatus === 'ok'       && <span><strong>Backend connected</strong> — Python FastAPI running on localhost:4000 ✓</span>}
          {backendStatus === 'error'    && <span><strong>Backend not running!</strong> — Open a terminal and run: <code>cd backend &amp;&amp; python main.py</code></span>}
        </div>
      </div>

      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroEyebrow}>▸ Infographic → Insight → Speech</div>
        <h1 className={s.heroTitle}>
          Turn any visual into<br /><em>presentation-ready</em> speech
        </h1>
        <p className={s.heroDesc}>
          Upload an infographic. The 4-agent pipeline reads it with Gemini Vision,
          extracts insights, and writes a polished speech — completely free.
        </p>
      </div>

      {/* Pipeline */}
      <div className={s.pipeline}>
        {STEPS.map((step, i) => {
          const state = steps[step.id] || 'idle';
          const cls = state === 'active' ? s.pipeActive : state === 'done' ? s.pipeDone : state === 'error' ? s.pipeError : '';
          return (
            <div key={step.id} className={s.pipeGroup}>
              <div className={`${s.pipeStep} ${cls}`}>
                <div className={s.pipeDot}>{step.emoji}</div>
                <div className={s.pipeLabel}>{step.label}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${s.pipeConn} ${running ? s.pipeConnFlowing : ''}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className={s.mainGrid}>

        {/* Upload */}
        <div className={s.panel}>
          <div className={s.panelHeader}>
            <div className={s.panelTitle}><div className={s.dot} />Input</div>
          </div>
          <div className={s.panelBody}>
            {!file ? (
              <div
                className={`${s.uploadZone} ${dragging ? s.dragOver : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              >
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
                <div className={s.uploadIcon}>🖼️</div>
                <h3>Drop your infographic here</h3>
                <p>JPEG · PNG · WebP · Max 20MB</p>
                <div className={s.fileTags}>
                  {['JPG', 'PNG', 'WebP'].map(t => <span key={t} className={s.fileTag}>{t}</span>)}
                </div>
              </div>
            ) : (
              <div className={s.previewArea}>
                {preview && <img src={preview} alt="preview" className={s.previewImg} />}
                <div className={s.fileInfo}>
                  <span>📎</span>
                  <span className={s.fileName}>{file.name}</span>
                  <span className={s.fileSize}>{fmtBytes(file.size)}</span>
                </div>
                <button className={s.actionBtn} onClick={clearFile}>✕ Clear file</button>
              </div>
            )}
          </div>
        </div>

        {/* Config */}
        <div className={s.panel}>
          <div className={s.panelHeader}>
            <div className={s.panelTitle}><div className={`${s.dot} ${s.dotGreen}`} />Configuration</div>
          </div>
          <div className={s.panelBody}>
            <div className={s.controls}>

              <div>
                <label className={s.fieldLabel}>Tone</label>
                <div className={s.toneGrid}>
                  {TONES.map(t => (
                    <button key={t.id}
                      className={`${s.toneBtn} ${tone === t.id ? s.toneBtnOn : ''}`}
                      onClick={() => setTone(t.id)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={s.fieldLabel}>Target Audience</label>
                <select className={s.select} value={audience} onChange={e => setAudience(e.target.value)}>
                  <option value="general">General Audience</option>
                  <option value="technical">Technical / Engineering</option>
                  <option value="executive">C-Suite / Leadership</option>
                  <option value="investors">Investors</option>
                  <option value="students">Students / Academic</option>
                </select>
              </div>

              <div>
                <label className={s.fieldLabel}>Duration — {duration} min (~{duration * 130} words)</label>
                <input type="range" className={s.slider} min={1} max={10} value={duration}
                  onChange={e => setDuration(Number(e.target.value))} />
                <div className={s.sliderLabels}><span>1 min</span><span>5 min</span><span>10 min</span></div>
              </div>

              <div>
                <label className={s.fieldLabel}>Focus Area</label>
                <select className={s.select} value={focus} onChange={e => setFocus(e.target.value)}>
                  <option value="auto">Auto Detect</option>
                  <option value="data">Data &amp; Statistics</option>
                  <option value="narrative">Narrative &amp; Story</option>
                  <option value="trends">Trends &amp; Insights</option>
                  <option value="comparison">Comparison &amp; Contrast</option>
                  <option value="solution">Problem → Solution</option>
                </select>
              </div>

              <button className={s.generateBtn}
                onClick={generate}
                disabled={!file || running || backendStatus !== 'ok'}>
                {running
                  ? <><span className={s.spinner} /> Processing…</>
                  : backendStatus !== 'ok'
                  ? '⚠ Start backend first'
                  : '⚡ Generate Speech'}
              </button>

            </div>
          </div>
        </div>

        {/* Output — full width */}
        <div className={`${s.panel} ${s.colFull}`}>
          <div className={s.panelHeader}>
            <div className={s.panelTitle}><div className={`${s.dot} ${s.dotGold}`} />Output</div>
            <div className={s.tabs}>
              {['speech', 'insights', 'extracted', 'logs'].map(tab => (
                <button key={tab}
                  className={`${s.tabBtn} ${activeTab === tab ? s.tabBtnOn : ''}`}
                  onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className={s.panelBody}>

            {speech && (
              <div className={s.metricsBar}>
                {[
                  { val: wordCount, lbl: 'Words' },
                  { val: readMins + ' min', lbl: 'Read Time' },
                  { val: (insightData?.key_points || []).length, lbl: 'Key Points' },
                  { val: scores.length ? Math.round(scores.reduce((a, sc) => a + sc.value, 0) / scores.length) + '%' : '—', lbl: 'Quality' },
                ].map(m => (
                  <div key={m.lbl} className={s.metric}>
                    <span className={s.metricVal}>{m.val}</span>
                    <span className={s.metricLbl}>{m.lbl}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Speech */}
            {activeTab === 'speech' && (
              speech ? (
                <>
                  <div className={s.speechDisplay}>
                    {speech.split(/\n+/).filter(Boolean).map((p, i, arr) => (
                      <p key={i} className={i === 0 ? s.speechHook : i === arr.length - 1 ? s.speechClosing : ''}>{p}</p>
                    ))}
                  </div>
                  {scores.length > 0 && (
                    <div className={s.scoresGrid}>
                      {scores.map(sc => (
                        <div key={sc.label} className={s.scoreCard}>
                          <span className={s.scoreNum} style={{ color: SCORE_COLORS[sc.label] || 'var(--accent)' }}>{sc.value}</span>
                          <div className={s.scoreLbl}>{sc.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={s.actionBar}>
                    <button className={`${s.actionBtn} ${s.actionBtnPrimary}`} onClick={copyText}>📋 Copy</button>
                    <button className={s.actionBtn} onClick={downloadTxt}>⬇ Download .txt</button>
                    <button className={s.actionBtn} onClick={generate} disabled={running}>🔄 Regenerate</button>
                    <span className={s.wordCount}>{wordCount} words · ~{readMins} min</span>
                  </div>
                </>
              ) : (
                <div className={s.emptyState}>
                  <span className={s.emptyIcon}>🎙️</span>
                  <p>Upload an infographic and click Generate Speech</p>
                </div>
              )
            )}

            {/* Insights */}
            {activeTab === 'insights' && (
              insightData ? (
                <div className={s.insightsGrid}>
                  {insightData.central_idea && (
                    <div className={`${s.insightCard} ${s.insightCardFull}`}>
                      <div className={s.insightLbl}>Central Idea</div>
                      <div className={s.insightVal} style={{ fontSize: 15, color: 'var(--text)' }}>{insightData.central_idea}</div>
                    </div>
                  )}
                  {(insightData.insights_summary || []).map((ins, i) => (
                    <div key={i} className={s.insightCard}>
                      <div className={s.insightLbl}>{ins.label}</div>
                      <div className={ins.type === 'number' ? s.insightNum : s.insightVal}>{ins.value}</div>
                    </div>
                  ))}
                  {insightData.hook && (
                    <div className={s.insightCard}>
                      <div className={s.insightLbl}>Opening Hook</div>
                      <div className={s.insightVal} style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{insightData.hook}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={s.emptyState}><span className={s.emptyIcon}>🧠</span><p>Insights appear after generation</p></div>
              )
            )}

            {/* Extracted */}
            {activeTab === 'extracted' && (
              ocrData ? (
                <pre className={s.extractedText}>{[
                  `TITLE: ${ocrData.title}`,
                  '', 'EXTRACTED TEXT:', ocrData.extracted_text,
                  '', `KEY STATS: ${(ocrData.key_stats || []).join(', ') || 'none'}`,
                  '', `TOPICS: ${(ocrData.main_topics || []).join(', ') || 'none'}`,
                  '', `DATA TYPE: ${ocrData.data_type}`,
                  '', `VISUAL ELEMENTS: ${ocrData.visual_elements}`,
                ].join('\n')}</pre>
              ) : (
                <div className={s.emptyState}><span className={s.emptyIcon}>📄</span><p>OCR extracted text appears here</p></div>
              )
            )}

            {/* Logs */}
            {activeTab === 'logs' && (
              logs.length > 0 ? (
                <div className={s.logStream}>
                  {logs.map((log, i) => {
                    const cls = log.cls === 'ocr' ? s.agentOcr : log.cls === 'insight' ? s.agentInsight : log.cls === 'llm' ? s.agentLlm : log.cls === 'validator' ? s.agentValidator : s.agentSystem;
                    return (
                      <div key={i} className={s.logEntry}>
                        <span className={s.logTime}>{log.time}</span>
                        <span className={`${s.logAgent} ${cls}`}>{log.agent}</span>
                        <span className={s.logMsg}>{log.msg}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={s.emptyState}><span className={s.emptyIcon}>⚙️</span><p>Agent logs stream here during processing</p></div>
              )
            )}

          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`${s.toast} ${toast.type === 'error' ? s.toastError : s.toastSuccess}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  );
}
