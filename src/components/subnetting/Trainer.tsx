import { useEffect, useRef, useState } from 'react';
import { LEVEL_LABELS, checkAnswer, generateQuestion, type Level, type SubnetQuestion } from '../../utils/subnet';
import { dispatch } from '../../store/store';

type Mode = 'learn' | 'timed' | 'speed';
const MODE_INFO: Record<Mode, { label: string; blurb: string }> = {
  learn: { label: 'Learn', blurb: 'Untimed. Every answer shows the worked solution.' },
  timed: { label: 'Timed', blurb: '30 seconds per question. Build speed and accuracy.' },
  speed: { label: 'Speed run', blurb: '60 seconds in total — answer as many as you can.' },
};
const QUESTION_SECONDS = 30;
const SPEED_SECONDS = 60;

interface Session {
  attempted: number;
  correct: number;
  streak: number;
}

export function Trainer() {
  const [level, setLevel] = useState<Level>(1);
  const [mode, setMode] = useState<Mode>('learn');
  const [phase, setPhase] = useState<'setup' | 'running' | 'summary'>('setup');
  const [q, setQ] = useState<SubnetQuestion | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<null | { ok: boolean; timedOut?: boolean }>(null);
  const [session, setSession] = useState<Session>({ attempted: 0, correct: 0, streak: 0 });
  const [questionLeft, setQuestionLeft] = useState(QUESTION_SECONDS);
  const [speedLeft, setSpeedLeft] = useState(SPEED_SECONDS);
  const startedAt = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const newQuestion = () => {
    setQ(generateQuestion(level, Math.random));
    setInput('');
    setResult(null);
    setQuestionLeft(QUESTION_SECONDS);
    startedAt.current = Date.now();
  };

  const start = () => {
    setSession({ attempted: 0, correct: 0, streak: 0 });
    setSpeedLeft(SPEED_SECONDS);
    setPhase('running');
    newQuestion();
  };

  const record = (question: SubnetQuestion, ok: boolean, timedOut = false) => {
    const seconds = timedOut ? QUESTION_SECONDS : (Date.now() - startedAt.current) / 1000;
    dispatch({ type: 'recordSubnetting', kind: question.kind, prefix: question.prefix, correct: ok, seconds });
    setSession((s) => ({ attempted: s.attempted + 1, correct: s.correct + (ok ? 1 : 0), streak: ok ? s.streak + 1 : 0 }));
    setResult({ ok, timedOut });
  };

  const submit = (answer: string) => {
    if (!q || result) return;
    const ok = checkAnswer(q, answer);
    record(q, ok);
    if (mode === 'speed') window.setTimeout(newQuestion, ok ? 250 : 900);
  };

  // Per-question countdown (timed mode).
  useEffect(() => {
    if (phase !== 'running' || mode !== 'timed' || result || !q) return;
    if (questionLeft <= 0) { record(q, false, true); return; }
    const t = window.setTimeout(() => setQuestionLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, mode, result, q, questionLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  // Whole-run countdown (speed mode).
  useEffect(() => {
    if (phase !== 'running' || mode !== 'speed') return;
    if (speedLeft <= 0) { setPhase('summary'); return; }
    const t = window.setTimeout(() => setSpeedLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, mode, speedLeft]);

  useEffect(() => { if (phase === 'running' && !result) inputRef.current?.focus(); }, [phase, q, result]);

  if (phase === 'setup') {
    return (
      <div className="card">
        <h2>Practice setup</h2>
        <div className="grid grid-2">
          <div className="field">
            <label htmlFor="level">Difficulty</label>
            <select id="level" value={level} onChange={(e) => setLevel(Number(e.target.value) as Level)}>
              {([1, 2, 3, 4] as Level[]).map((l) => <option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}
            </select>
          </div>
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ fontWeight: 600, marginBottom: 6 }}>Mode</legend>
            <div className="chips">
              {(Object.keys(MODE_INFO) as Mode[]).map((m) => <button key={m} type="button" className="chip" aria-pressed={mode === m} onClick={() => setMode(m)}>{MODE_INFO[m].label}</button>)}
            </div>
            <p className="small muted" style={{ marginTop: 8 }}>{MODE_INFO[mode].blurb}</p>
          </fieldset>
        </div>
        <button type="button" className="btn btn-primary" onClick={start}>Start</button>
      </div>
    );
  }

  if (phase === 'summary') {
    return (
      <div className="card">
        <h2>Speed run complete</h2>
        <p><strong>{session.correct}</strong> correct out of {session.attempted} answered in {SPEED_SECONDS} seconds{session.attempted ? ` (${Math.round((session.correct / session.attempted) * 100)}% accuracy)` : ''}.</p>
        <div className="row"><button type="button" className="btn btn-primary" onClick={start}>Go again</button><button type="button" className="btn" onClick={() => setPhase('setup')}>Change settings</button></div>
      </div>
    );
  }

  const showSteps = result && mode !== 'speed';
  return (
    <div className="card">
      <div className="row row-between">
        <div className="row">
          <span className="badge badge-primary">{MODE_INFO[mode].label}</span>
          <span className="badge">Level {level}</span>
          <span className="badge badge-success">{session.correct}/{session.attempted} correct</span>
          <span className="badge">Streak {session.streak}</span>
        </div>
        {mode === 'timed' && <span className={`badge ${questionLeft <= 10 ? 'badge-danger' : ''}`} role="timer" aria-live="off">⏱ {questionLeft}s</span>}
        {mode === 'speed' && <span className={`badge ${speedLeft <= 10 ? 'badge-danger' : ''}`} role="timer" aria-live="off">⏱ {speedLeft}s left</span>}
      </div>
      {q && (
        <form onSubmit={(e) => { e.preventDefault(); if (result) { if (mode !== 'speed') newQuestion(); } else if (input.trim()) submit(input); }} style={{ marginTop: 16 }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 650 }}>{q.prompt}</p>
          {q.answerType === 'yesno' ? (
            <div className="row" role="group" aria-label="Answer">
              <button type="button" className="btn" disabled={result !== null} onClick={() => submit('yes')}>Yes — same subnet</button>
              <button type="button" className="btn" disabled={result !== null} onClick={() => submit('no')}>No — different subnets</button>
            </div>
          ) : (
            <div className="row">
              <label htmlFor="sn-answer" className="sr-only">Your answer</label>
              <input ref={inputRef} id="sn-answer" type="text" className="answer-input" value={input} onChange={(e) => setInput(e.target.value)} disabled={result !== null} autoComplete="off" spellCheck={false} placeholder={q.answerType === 'ip' ? 'e.g. 192.168.1.64' : q.answerType === 'prefix' ? 'e.g. /26' : 'e.g. 62'} />
              {!result && <button type="submit" className="btn btn-primary" disabled={!input.trim()}>Check</button>}
            </div>
          )}
        </form>
      )}
      <div aria-live="polite">
        {result && q && (
          <div className={`feedback ${result.ok ? 'feedback-ok' : 'feedback-bad'}`} style={{ marginTop: 14 }}>
            <strong>{result.ok ? 'Correct!' : result.timedOut ? 'Time is up.' : 'Not quite.'} {!result.ok && <>Answer: <code>{q.expected}</code></>}</strong>
            {showSteps && <ol style={{ marginBottom: 0, marginTop: 8 }}>{q.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>}
          </div>
        )}
      </div>
      <div className="row" style={{ marginTop: 14 }}>
        {result && mode !== 'speed' && <button type="button" className="btn btn-primary" onClick={newQuestion}>Next question</button>}
        <button type="button" className="btn btn-ghost" onClick={() => setPhase(mode === 'speed' ? 'summary' : 'setup')}>{mode === 'speed' ? 'End run' : 'Stop and change settings'}</button>
      </div>
    </div>
  );
}
