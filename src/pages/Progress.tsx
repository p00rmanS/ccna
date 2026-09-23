import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DOMAINS } from '../data/domains';
import { LESSONS, QUESTIONS, lessonById } from '../data';
import { CLI_TASKS } from '../data/cliTasks';
import { PageHead, ProgressBar } from '../components/common/Common';
import { achievements, domainProgress, quizAccuracy } from '../store/derived';
import { computeStreaks, dayKey, strongTopics, topicAccuracy, weakTopics } from '../store/state';
import { dispatch, exportJson, useAppState } from '../store/store';
import { downloadText } from '../utils/download';

function quizName(quizId: string): string {
  if (quizId === 'mixed') return 'Mixed review';
  if (quizId === 'missed') return 'Missed questions';
  return lessonById(quizId.replace(/^lesson:/, ''))?.title ?? quizId;
}

export default function Progress() {
  const state = useAppState();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const now = Date.now();
  const streaks = useMemo(() => computeStreaks(state.studyDays, dayKey(now)), [state.studyDays, now]);
  const rows = useMemo(() => domainProgress(state, DOMAINS, LESSONS), [state]);
  const acc = useMemo(() => topicAccuracy(state, QUESTIONS), [state]);
  const weak = weakTopics(acc);
  const strong = strongTopics(acc);
  const badges = achievements(state, LESSONS, streaks.longest, CLI_TASKS.length);
  const qa = quizAccuracy(state);
  const recent = [...state.quizAttempts].reverse().slice(0, 10);

  const last28 = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (27 - i));
    return dayKey(d.getTime());
  });
  const studied = last28.filter((d) => state.studyDays.includes(d)).length;

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed) || !('completedLessons' in parsed || 'quizAttempts' in parsed || 'flashcards' in parsed)) {
        setMessage({ ok: false, text: 'That file does not look like a CCNA Mastery export, so nothing was changed.' });
        return;
      }
      if (!window.confirm('Importing replaces your current progress on this device. Continue?')) return;
      dispatch({ type: 'import', state: parsed });
      setMessage({ ok: true, text: 'Progress imported.' });
    } catch {
      setMessage({ ok: false, text: 'That file could not be read as JSON, so nothing was changed.' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="stack">
      <PageHead title="Progress" eyebrow="Your data">
        Everything here is computed from what you have actually done on this device. Nothing is estimated or made up.
      </PageHead>

      <section className="card" aria-labelledby="streak-h">
        <h2 id="streak-h">Study streak</h2>
        <p><strong>{streaks.current}</strong> day{streaks.current === 1 ? '' : 's'} current · <strong>{streaks.longest}</strong> longest · studied on <strong>{studied}</strong> of the last 28 days</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 4, maxWidth: 420 }} aria-hidden="true">
          {last28.map((d) => <span key={d} title={d} style={{ aspectRatio: '1', borderRadius: 4, background: state.studyDays.includes(d) ? 'var(--success)' : 'var(--surface-2)', border: '1px solid var(--border)' }} />)}
        </div>
        <p className="small muted" style={{ marginTop: 8 }}>A day counts when you complete a lesson or lab, answer a quiz, review flashcards or practise subnetting.</p>
      </section>

      <section className="card" aria-labelledby="dom-h">
        <h2 id="dom-h">Domains</h2>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Domain</th><th>Exam weight</th><th>Published lessons</th><th>Completed</th><th style={{ minWidth: 140 }}>Progress</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.domain.id}>
                  <td>{r.domain.number} {r.domain.name}</td><td>{r.domain.weight}%</td><td>{r.published}</td><td>{r.completed}</td>
                  <td>{r.percent === null ? <span className="muted small">not published yet</span> : <ProgressBar value={r.percent} label={`${r.domain.name} progress`} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-2">
        <section className="card" aria-labelledby="weak-h">
          <h2 id="weak-h">Weak topics</h2>
          {weak.length === 0 ? <p className="muted">{acc.length === 0 ? 'Take a quiz to see where you are strong and where to review.' : 'None flagged. A topic is flagged after 3+ answers below 70%.'}</p> : (
            <ul>{weak.map((w) => <li key={w.lessonId}><Link to={`/learn/${w.lessonId}`}>{lessonById(w.lessonId)?.title}</Link> — {Math.round(w.accuracy * 100)}% over {w.seen} answers</li>)}</ul>
          )}
        </section>
        <section className="card" aria-labelledby="strong-h">
          <h2 id="strong-h">Strong topics</h2>
          {strong.length === 0 ? <p className="muted">Topics with 90%+ over at least 3 answers appear here.</p> : (
            <ul>{strong.map((w) => <li key={w.lessonId}>{lessonById(w.lessonId)?.title} — {Math.round(w.accuracy * 100)}%</li>)}</ul>
          )}
        </section>
      </div>

      <section className="card" aria-labelledby="hist-h">
        <h2 id="hist-h">Recent quizzes {qa !== null && <span className="badge">{qa}% overall</span>}</h2>
        {recent.length === 0 ? <p className="muted">No quiz attempts yet.</p> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>When</th><th>Quiz</th><th>Score</th><th>Time</th></tr></thead>
              <tbody>{recent.map((a, i) => <tr key={i}><td>{new Date(a.at).toLocaleString()}</td><td>{quizName(a.quizId)}</td><td>{a.correct}/{a.total} ({Math.round((a.correct / Math.max(1, a.total)) * 100)}%)</td><td>{a.seconds}s</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card" aria-labelledby="ach-h">
        <h2 id="ach-h">Achievements</h2>
        <ul style={{ listStyle: 'none', padding: 0 }} className="grid grid-auto">
          {badges.map((b) => (
            <li key={b.id} className="card card-flat" style={{ opacity: b.earned ? 1 : 0.7 }}>
              <span className={`badge ${b.earned ? 'badge-success' : ''}`}>{b.earned ? '✓ Earned' : 'Locked'}</span>
              <h3 style={{ margin: '6px 0 2px' }}>{b.name}</h3>
              <p className="small muted" style={{ margin: 0 }}>{b.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="data-h">
        <h2 id="data-h">Your data</h2>
        <p className="muted">Progress is stored only in this browser. Export a backup before clearing site data or switching devices.</p>
        <div className="row">
          <button type="button" className="btn" onClick={() => setMessage(downloadText('ccna-mastery-progress.json', exportJson(), 'application/json') ? { ok: true, text: 'Progress exported.' } : { ok: false, text: 'Your browser blocked the download.' })}>Export progress (JSON)</button>
          <label className="btn" htmlFor="import-file" style={{ cursor: 'pointer' }}>Import progress…</label>
          <input id="import-file" ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => onImport(e.target.files?.[0])} />
          <button type="button" className="btn btn-danger" onClick={() => { if (window.confirm('Delete all progress, notes and settings on this device? This cannot be undone.')) { dispatch({ type: 'reset' }); setMessage({ ok: true, text: 'Everything was reset.' }); } }}>Reset everything</button>
        </div>
        <div aria-live="polite">{message && <div className={`feedback ${message.ok ? 'feedback-ok' : 'feedback-bad'}`} style={{ marginTop: 12 }}>{message.text}</div>}</div>
      </section>
    </div>
  );
}
