import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '../types';
import { LESSONS, QUESTIONS, lessonById } from '../data';
import { DOMAINS, objectiveLabel } from '../data/domains';
import { EmptyState, PageHead } from '../components/common/Common';
import { missedQuestionIds, topicAccuracy, weakTopics } from '../store/state';
import { dispatch, useAppState } from '../store/store';
import { MIN_QUESTIONS_FOR_ESTIMATE, SECONDS_PER_QUESTION, domainBreakdown, examSeconds, formatDuration, lessonBreakdown, readiness, selectExamQuestions } from '../utils/exam';
import { choiceOrder, isCorrect, scoreQuiz } from '../utils/quiz';

interface ExamRun {
  label: string;
  questions: Question[];
  orders: number[][];
  timed: boolean;
  startedAt: number;
}

interface Finished {
  run: ExamRun;
  answers: Record<string, number[]>;
  flagged: string[];
  seconds: number;
  timedOut: boolean;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

function Runner({ run, onFinish, onQuit }: { run: ExamRun; onFinish: (f: Finished) => void; onQuit: () => void }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [now, setNow] = useState(Date.now());
  const done = useRef(false);
  const total = examSeconds(run.questions.length);
  const remaining = run.timed ? Math.max(0, total - Math.floor((now - run.startedAt) / 1000)) : null;

  const finish = (timedOut: boolean) => {
    if (done.current) return;
    done.current = true;
    const score = scoreQuiz(run.questions, answers);
    const byDomain = domainBreakdown(run.questions, score.results);
    const seconds = Math.round((Date.now() - run.startedAt) / 1000);
    dispatch({ type: 'recordExam', label: run.label, results: score.results, byDomain, seconds, timed: run.timed });
    onFinish({ run, answers, flagged, seconds, timedOut });
  };

  useEffect(() => {
    if (!run.timed) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [run.timed]);
  useEffect(() => { if (remaining === 0) finish(true); }); // eslint-disable-line react-hooks/exhaustive-deps

  const q = run.questions[idx]!;
  const selected = answers[q.id] ?? [];
  const multi = q.type === 'multiple';
  const unanswered = run.questions.filter((x) => (answers[x.id] ?? []).length === 0).length;

  const choose = (choice: number) =>
    setAnswers((a) => {
      const cur = a[q.id] ?? [];
      if (multi) return { ...a, [q.id]: cur.includes(choice) ? cur.filter((c) => c !== choice) : [...cur, choice] };
      return { ...a, [q.id]: [choice] };
    });

  return (
    <div className="exam-layout">
      <div className="stack">
        <div className="row row-between">
          <span className="badge badge-primary">{run.label}</span>
          {remaining !== null && <span className={`badge ${remaining < 120 ? 'badge-danger' : ''}`} role="timer" aria-label={`Time remaining ${formatDuration(remaining)}`}>⏱ {formatDuration(remaining)}</span>}
          {remaining === null && <span className="badge">Untimed</span>}
        </div>
        <div className="card">
          <div className="row row-between" style={{ marginBottom: 8 }}>
            <span className="small muted">Question {idx + 1} of {run.questions.length}</span>
            <button type="button" className="btn btn-sm" aria-pressed={flagged.includes(q.id)} onClick={() => setFlagged((f) => (f.includes(q.id) ? f.filter((x) => x !== q.id) : [...f, q.id]))}>
              {flagged.includes(q.id) ? '⚑ Flagged for review' : '⚐ Flag for review'}
            </button>
          </div>
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ fontSize: '1.15rem', fontWeight: 650, marginBottom: 6 }}>{q.prompt}</legend>
            <p className="small muted">{multi ? `Choose ${q.correct.length}.` : q.type === 'true-false' ? 'Choose true or false.' : 'Choose one answer.'} Answers are hidden until you submit the exam.</p>
            {run.orders[idx]!.map((choice) => (
              <label key={choice} className="choice" data-state={selected.includes(choice) ? 'selected' : undefined} htmlFor={`ex-${q.id}-${choice}`}>
                <input id={`ex-${q.id}-${choice}`} type={multi ? 'checkbox' : 'radio'} name={q.id} checked={selected.includes(choice)} onChange={() => choose(choice)} />
                <span>{q.choices[choice]}</span>
              </label>
            ))}
          </fieldset>
          <div className="row" style={{ marginTop: 14 }}>
            <button type="button" className="btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>← Previous</button>
            <button type="button" className="btn" disabled={idx === run.questions.length - 1} onClick={() => setIdx(idx + 1)}>Next →</button>
            <button type="button" className="btn btn-primary" onClick={() => setConfirming(true)} style={{ marginLeft: 'auto' }}>Submit exam</button>
          </div>
        </div>
        {confirming && (
          <div className="feedback feedback-bad" role="alertdialog" aria-label="Confirm submission">
            <strong>Submit the exam now?</strong>
            {unanswered > 0 ? `${unanswered} question${unanswered === 1 ? ' is' : 's are'} unanswered` : 'All questions are answered'}{flagged.length > 0 ? ` and ${flagged.length} flagged for review.` : '.'} You cannot change answers after submitting.
            <div className="row" style={{ marginTop: 8 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => finish(false)}>Submit</button>
              <button type="button" className="btn btn-sm" onClick={() => setConfirming(false)}>Keep working</button>
            </div>
          </div>
        )}
      </div>
      <aside className="card" aria-label="Question navigator">
        <h3>Questions</h3>
        <div className="palette">
          {run.questions.map((x, i) => {
            const answered = (answers[x.id] ?? []).length > 0;
            return (
              <button key={x.id} type="button" className="palette-btn" data-current={i === idx} data-answered={answered} data-flagged={flagged.includes(x.id)} onClick={() => setIdx(i)} aria-label={`Question ${i + 1}${answered ? ', answered' : ', not answered'}${flagged.includes(x.id) ? ', flagged' : ''}`}>
                {i + 1}
              </button>
            );
          })}
        </div>
        <p className="small muted" style={{ marginTop: 10 }}>Blue = current · filled = answered · ⚑ = flagged</p>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => { if (window.confirm('Quit without submitting? This attempt will not be saved.')) onQuit(); }}>Quit exam</button>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

function Results({ f, onNew }: { f: Finished; onNew: () => void }) {
  const score = useMemo(() => scoreQuiz(f.run.questions, f.answers), [f]);
  const byDomain = useMemo(() => domainBreakdown(f.run.questions, score.results), [f, score]);
  const est = readiness(score.percent, score.total);
  const missed = f.run.questions.filter((q) => !isCorrect(q, f.answers[q.id] ?? []));
  const flaggedQs = f.run.questions.filter((q) => f.flagged.includes(q.id));
  const byLesson = useMemo(() => lessonBreakdown(f.run.questions, score.results), [f, score]);

  return (
    <div className="stack">
      <section className="card" role="status" aria-labelledby="res-h">
        <h2 id="res-h">{f.run.label} — results</h2>
        {f.timedOut && <div className="feedback feedback-bad"><strong>Time ran out.</strong>Your answers so far were submitted.</div>}
        <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: '6px 0' }}>{score.correct} / {score.total} <span className="muted" style={{ fontSize: '1.2rem' }}>({score.percent}%)</span></p>
        <div className="row">
          <span className="badge">⏱ {formatDuration(f.seconds)}{f.run.timed ? ` of ${formatDuration(examSeconds(score.total))}` : ''}</span>
          <span className={`badge ${est.band === 'Strong' || est.band === 'Nearly Ready' ? 'badge-success' : est.band === 'Not enough data' ? '' : 'badge-warning'}`}>Exam readiness estimate: {est.band}</span>
        </div>
        <p style={{ marginTop: 10 }}>{est.message}</p>
        <p className="small muted">This is a study indicator for this question set only. It is not a prediction of your real exam result; Cisco does not publish its scoring method.</p>
        <div className="row"><button type="button" className="btn btn-primary" onClick={onNew}>New exam</button></div>
      </section>

      <div className="grid grid-2">
        <section className="card" aria-labelledby="dom-h">
          <h2 id="dom-h">Performance by domain</h2>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Domain</th><th>Correct</th><th>%</th></tr></thead>
              <tbody>
                {DOMAINS.map((d) => {
                  const t = byDomain[d.id];
                  return <tr key={d.id}><td>{d.number} {d.name}</td><td>{t ? `${t.correct}/${t.attempted}` : '—'}</td><td>{t ? `${Math.round((t.correct / t.attempted) * 100)}%` : <span className="muted small">no questions yet</span>}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card" aria-labelledby="top-h">
          <h2 id="top-h">Weakest and strongest topics</h2>
          {byLesson.length === 0 ? <p className="muted">No data.</p> : (
            <ul>{byLesson.map((t) => <li key={t.lessonId}><Link to={`/learn/${t.lessonId}`}>{lessonById(t.lessonId)?.title}</Link> — {t.correct}/{t.seen}</li>)}</ul>
          )}
        </section>
      </div>

      {flaggedQs.length > 0 && (
        <section className="card" aria-labelledby="flag-h">
          <h2 id="flag-h">Questions you flagged ({flaggedQs.length})</h2>
          <ul>{flaggedQs.map((q) => <li key={q.id}>{q.prompt} — <strong>{isCorrect(q, f.answers[q.id] ?? []) ? 'correct' : 'incorrect'}</strong></li>)}</ul>
        </section>
      )}

      <section className="card" aria-labelledby="miss-h">
        <h2 id="miss-h">Review incorrect answers ({missed.length})</h2>
        {missed.length === 0 ? <p className="muted">Nothing to review — every answer was correct.</p> : missed.map((q) => {
          const mine = f.answers[q.id] ?? [];
          return (
            <div key={q.id} className="callout" style={{ marginTop: 12 }}>
              <p><strong>{q.prompt}</strong></p>
              <p className="small">Your answer: {mine.length ? mine.map((c) => q.choices[c]).join(' · ') : <em>no answer</em>}</p>
              <p className="small">Correct: {q.correct.map((c) => q.choices[c]).join(' · ')}</p>
              <p className="small">{q.explanation}</p>
              {mine.filter((c) => q.wrong?.[c]).map((c) => <p key={c} className="small muted">Why “{q.choices[c]}” is wrong: {q.wrong![c]}</p>)}
              <p className="small muted" style={{ margin: 0 }}>{objectiveLabel(q.objective)} · Review: {q.lessonIds.map((id, k) => <span key={id}>{k > 0 && ', '}<Link to={`/learn/${id}`}>{lessonById(id)?.title}</Link></span>)}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

export default function Exams() {
  const state = useAppState();
  const [size, setSize] = useState<number>(20);
  const [source, setSource] = useState<string>('all');
  const [timed, setTimed] = useState(true);
  const [run, setRun] = useState<ExamRun | null>(null);
  const [finished, setFinished] = useState<Finished | null>(null);

  const acc = useMemo(() => topicAccuracy(state, QUESTIONS), [state]);
  const weakLessons = weakTopics(acc).map((w) => w.lessonId);
  const missed = missedQuestionIds(state);
  const focus = { lessonIds: weakLessons, missedIds: missed };
  const pool = useMemo(
    () => selectExamQuestions(QUESTIONS, { size: 9999, lessonId: source !== 'all' && source !== 'focus' ? source : undefined, focus: source === 'focus' ? focus : undefined }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [source, weakLessons.join(','), missed.join(',')],
  );
  const count = Math.min(size, pool.length);

  const start = () => {
    const questions = selectExamQuestions(QUESTIONS, { size, lessonId: source !== 'all' && source !== 'focus' ? source : undefined, focus: source === 'focus' ? focus : undefined });
    if (questions.length === 0) return;
    const label = source === 'focus' ? 'Weak-topic exam' : source !== 'all' ? `${lessonById(source)?.title ?? 'Lesson'} exam` : `${questions.length}-question practice exam`;
    setFinished(null);
    setRun({ label, questions, orders: questions.map((q) => choiceOrder(q)), timed, startedAt: Date.now() });
  };

  if (run && !finished) {
    return <Runner run={run} onFinish={(f) => setFinished(f)} onQuit={() => setRun(null)} />;
  }
  if (run && finished) {
    return <Results f={finished} onNew={() => { setRun(null); setFinished(null); }} />;
  }

  const history = [...state.examHistory].reverse().slice(0, 6);
  return (
    <div>
      <PageHead title="Practice exams" eyebrow="Practice">
        Timed sets with answers hidden until you submit, question flagging, and a breakdown by domain. Use them to find gaps — they are original questions and do not predict your real result.
      </PageHead>
      <div className="grid grid-2">
        <section className="card" aria-labelledby="setup-h">
          <h2 id="setup-h">Build an exam</h2>
          <div className="stack">
            <div className="field">
              <label htmlFor="ex-size">Number of questions</label>
              <select id="ex-size" value={size} onChange={(e) => setSize(Number(e.target.value))}>
                {[10, 20, 30, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                <option value={9999}>All available ({QUESTIONS.length})</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="ex-src">Questions from</label>
              <select id="ex-src" value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="all">All published lessons</option>
                <option value="focus">My weak topics and missed questions ({weakLessons.length} topics, {missed.length} missed)</option>
                {LESSONS.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
              </select>
            </div>
            <label className="row" style={{ fontWeight: 500 }}>
              <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} /> Timed — about {SECONDS_PER_QUESTION} seconds per question ({formatDuration(examSeconds(count))} for this exam)
            </label>
            {pool.length === 0 ? (
              <EmptyState title="No questions match">{source === 'focus' ? 'You have no weak topics or missed questions yet. Take a quiz first.' : 'Choose a different source.'}</EmptyState>
            ) : (
              <div>
                <p className="muted small">This exam will have {count} question{count === 1 ? '' : 's'}.{count < MIN_QUESTIONS_FOR_ESTIMATE ? ` Sets under ${MIN_QUESTIONS_FOR_ESTIMATE} questions do not get a readiness estimate.` : ''}</p>
                <button type="button" className="btn btn-primary" onClick={start}>Start exam</button>
              </div>
            )}
          </div>
        </section>
        <section className="card" aria-labelledby="hist-h">
          <h2 id="hist-h">Recent exams</h2>
          {history.length === 0 ? <p className="muted">No exams yet. Your scores and times will appear here.</p> : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>When</th><th>Exam</th><th>Score</th><th>Time</th></tr></thead>
                <tbody>{history.map((h, i) => <tr key={i}><td>{new Date(h.at).toLocaleDateString()}</td><td>{h.label}</td><td>{h.correct}/{h.total} ({Math.round((h.correct / Math.max(1, h.total)) * 100)}%)</td><td>{formatDuration(h.seconds)}{h.timed ? '' : ' (untimed)'}</td></tr>)}</tbody>
              </table>
            </div>
          )}
          <p className="small muted" style={{ marginTop: 10 }}>Practice-exam content grows with the course. Right now every question is from Network Fundamentals.</p>
        </section>
      </div>
    </div>
  );
}
