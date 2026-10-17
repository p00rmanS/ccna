import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FLASHCARDS, LESSONS, lessonById } from '../data';
import { EmptyState, PageHead, ProgressBar } from '../components/common/Common';
import { cardsDue, newCards } from '../store/derived';
import { dispatch, getState, useAppState } from '../store/store';
import { shuffle } from '../utils/quiz';
import { isDue, previewLabel, type Grade } from '../utils/srs';

const NEW_PER_SESSION = 20;
const GRADES: Array<{ grade: Grade; label: string; key: string }> = [
  { grade: 'again', label: 'Again', key: '1' },
  { grade: 'hard', label: 'Hard', key: '2' },
  { grade: 'good', label: 'Good', key: '3' },
  { grade: 'easy', label: 'Easy', key: '4' },
];

type Source = 'schedule' | 'all';

interface Session {
  queue: string[];
  index: number;
  reviewed: number;
  again: number;
}

export default function Flashcards() {
  const state = useAppState();
  const tl = state.settings.style === 'taglish';
  const [params] = useSearchParams();
  const [lessonId, setLessonId] = useState(params.get('lesson') ?? 'all');
  const [source, setSource] = useState<Source>('schedule');
  const [randomOrder, setRandomOrder] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [flipped, setFlipped] = useState(false);
  const now = Date.now();

  const pool = useMemo(() => FLASHCARDS.filter((c) => lessonId === 'all' || c.lessonId === lessonId), [lessonId]);
  const due = cardsDue(state, pool, now);
  const fresh = newCards(state, pool);

  const start = () => {
    const s = getState();
    let ids: string[];
    if (source === 'all') ids = pool.map((c) => c.id);
    else {
      const dueIds = pool.filter((c) => s.flashcards[c.id] && isDue(s.flashcards[c.id], Date.now())).sort((a, b) => s.flashcards[a.id]!.due - s.flashcards[b.id]!.due).map((c) => c.id);
      const newIds = pool.filter((c) => !s.flashcards[c.id]).slice(0, NEW_PER_SESSION).map((c) => c.id);
      ids = [...dueIds, ...newIds];
    }
    if (randomOrder || source === 'all') ids = shuffle(ids);
    setSession({ queue: ids, index: 0, reviewed: 0, again: 0 });
    setFlipped(false);
  };

  const card = session ? FLASHCARDS.find((c) => c.id === session.queue[session.index]) : undefined;
  const finished = session !== null && session.index >= session.queue.length;

  const grade = (g: Grade) => {
    if (!session || !card) return;
    dispatch({ type: 'gradeCard', cardId: card.id, grade: g });
    const queue = g === 'again' ? [...session.queue, card.id] : session.queue;
    setSession({ queue, index: session.index + 1, reviewed: session.reviewed + 1, again: session.again + (g === 'again' ? 1 : 0) });
    setFlipped(false);
  };

  useEffect(() => {
    if (!session || finished) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === ' ' && e.target instanceof HTMLElement && e.target.tagName === 'BUTTON') return;
      if (e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); }
      const g = GRADES.find((x) => x.key === e.key);
      if (g && flipped) grade(g.grade);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (session && !finished && card) {
    const st = state.flashcards[card.id];
    const lesson = lessonById(card.lessonId);
    return (
      <div className="stack" style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="row row-between">
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setSession(null)}>← End session</button>
          <span className="small muted">Card {session.index + 1} of {session.queue.length}</span>
        </div>
        <ProgressBar value={(session.index / session.queue.length) * 100} label="Session progress" />
        <button type="button" className="flash" data-side={flipped ? 'back' : 'front'} onClick={() => setFlipped(!flipped)} aria-label={flipped ? 'Answer shown. Activate to see the question again' : 'Question. Activate to reveal the answer'}>
          <span>
            <small>{flipped ? 'Answer' : 'Question'} · {lesson?.title}</small>
            {flipped ? (tl && card.backTl ? card.backTl : card.back) : card.front}
          </span>
        </button>
        {!flipped ? (
          <button type="button" className="btn btn-primary btn-block" onClick={() => setFlipped(true)}>Show answer <span className="muted small">(Space)</span></button>
        ) : (
          <div className="grades" role="group" aria-label="How well did you know this?">
            {GRADES.map((g) => (
              <button key={g.grade} type="button" className="btn grade" onClick={() => grade(g.grade)}>
                <span>{g.label} <span className="muted small">({g.key})</span></span>
                <small>{previewLabel(st, g.grade, Date.now())}</small>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <PageHead title="Flashcards" eyebrow="Practice">
        Spaced repetition: cards you find hard come back sooner, cards you know come back later. Short daily reviews beat long cram sessions.
      </PageHead>
      {finished && session && (
        <div className="card" role="status" style={{ marginBottom: 18 }}>
          <h2>Session complete</h2>
          <p>You reviewed {session.reviewed} card{session.reviewed === 1 ? '' : 's'}{session.again ? `, and ${session.again} needed another look` : ''}. Well done.</p>
        </div>
      )}
      <div className="card">
        <h2>Start a review</h2>
        <div className="grid grid-3">
          <div className="field">
            <label htmlFor="fc-lesson">Lesson</label>
            <select id="fc-lesson" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
              <option value="all">All lessons ({FLASHCARDS.length} cards)</option>
              {LESSONS.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ fontWeight: 600, marginBottom: 6 }}>Cards to include</legend>
            <div className="chips">
              <button type="button" className="chip" aria-pressed={source === 'schedule'} onClick={() => setSource('schedule')}>Due + new</button>
              <button type="button" className="chip" aria-pressed={source === 'all'} onClick={() => setSource('all')}>Everything (shuffled)</button>
            </div>
          </fieldset>
          <label className="row" style={{ fontWeight: 500, alignSelf: 'flex-end' }}>
            <input type="checkbox" checked={randomOrder} onChange={(e) => setRandomOrder(e.target.checked)} disabled={source === 'all'} /> Shuffle order
          </label>
        </div>
        <p className="muted">
          {source === 'schedule'
            ? `${due} due · ${fresh} new (up to ${NEW_PER_SESSION} per session)`
            : `${pool.length} cards will be reviewed. Grades still update your schedule.`}
        </p>
        {source === 'schedule' && due + Math.min(fresh, NEW_PER_SESSION) === 0 ? (
          <EmptyState title="You are all caught up">Nothing is due right now. Come back later, or review everything for extra practice.</EmptyState>
        ) : (
          <button type="button" className="btn btn-primary" onClick={start}>Start review</button>
        )}
      </div>
      <p className="muted small" style={{ marginTop: 16 }}>New here? Cards are written to accompany each lesson — <Link to="/learn">start with a lesson</Link> first for the best results.</p>
    </div>
  );
}
