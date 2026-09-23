import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Lesson } from '../../types';
import { LESSONS, moduleOfLesson } from '../../data';
import { dispatch, getState, useAppState } from '../../store/store';
import { Markdown } from '../common/Common';
import { tocEntries } from './toc';

function NotesEditor({ lessonId }: { lessonId: string }) {
  const { notes } = useAppState();
  const stored = notes[lessonId] ?? '';
  const [text, setText] = useState(stored);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(true);
  const latest = useRef(text);
  latest.current = text;

  useEffect(() => {
    if (text === stored) { setSaved(true); return; }
    setSaved(false);
    const t = window.setTimeout(() => { dispatch({ type: 'setNote', lessonId, text }); setSaved(true); }, 500);
    return () => window.clearTimeout(t);
  }, [text, stored, lessonId]);

  // Flush any pending edit when the learner leaves the lesson.
  useEffect(() => () => { if (latest.current !== (getState().notes[lessonId] ?? '')) dispatch({ type: 'setNote', lessonId, text: latest.current }); }, [lessonId]);

  return (
    <div>
      <div className="row row-between" style={{ marginBottom: 6 }}>
        <label htmlFor={`note-${lessonId}`}>My notes</label>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setPreview(!preview)} aria-pressed={preview}>{preview ? 'Edit' : 'Preview'}</button>
      </div>
      {preview ? (
        <div className="card card-flat" style={{ padding: 12, minHeight: 100 }}>{text.trim() ? <Markdown text={text} /> : <p className="muted small">Nothing to preview yet.</p>}</div>
      ) : (
        <textarea id={`note-${lessonId}`} value={text} onChange={(e) => setText(e.target.value)} placeholder={'Write in Markdown:\n# Heading\n- bullet\n`show ip interface brief`'} style={{ minHeight: 140 }} />
      )}
      <p className="small muted" aria-live="polite" style={{ margin: '4px 0 0' }}>{saved ? 'Saved on this device' : 'Saving…'}</p>
    </div>
  );
}

function Toc({ lesson }: { lesson: Lesson }) {
  const entries = tocEntries(lesson);
  const [active, setActive] = useState(entries[0]?.anchor ?? '');
  // Scroll-spy: the current section is the last one whose top has passed a line a quarter of the way down the screen.
  useEffect(() => {
    let timer = 0;
    const update = () => {
      timer = 0;
      const line = window.innerHeight * 0.25;
      let current = entries[0]?.anchor ?? '';
      for (const e of entries) {
        const el = document.getElementById(e.anchor);
        if (el && el.getBoundingClientRect().top <= line) current = e.anchor;
      }
      setActive(current);
    };
    const onScroll = () => { if (!timer) timer = window.setTimeout(update, 60); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.clearTimeout(timer); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [lesson.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <nav className="card toc" aria-label="On this page">
      <h3>On this page</h3>
      <ol>
        {entries.map((e) => (
          <li key={e.anchor}>
            <a href={`#${e.anchor}`} aria-current={active === e.anchor ? 'location' : undefined} onClick={(ev) => { ev.preventDefault(); document.getElementById(e.anchor)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); setActive(e.anchor); }}>{e.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function LessonTools({ lesson }: { lesson: Lesson }) {
  const state = useAppState();
  const done = Boolean(state.completedLessons[lesson.id]);
  const key = `lesson:${lesson.id}`;
  const bookmarked = state.bookmarks.includes(key);
  const module = moduleOfLesson(lesson.id);
  const siblings = module ? LESSONS.filter((l) => module.lessonIds.includes(l.id)) : [];
  return (
    <aside className="lesson-side" aria-label="Lesson tools">
      <Toc lesson={lesson} />
      <div className="card">
        <h3>Progress</h3>
        <p className="small muted">{done ? 'You have marked this lesson complete.' : 'Mark the lesson complete when you can explain it without looking.'}</p>
        <div className="stack">
          <button type="button" className={`btn btn-block ${done ? '' : 'btn-primary'}`} aria-pressed={done} onClick={() => dispatch({ type: done ? 'uncompleteLesson' : 'completeLesson', id: lesson.id })}>
            {done ? '✓ Completed — undo' : 'Mark lesson complete'}
          </button>
          <button type="button" className="btn btn-block" aria-pressed={bookmarked} onClick={() => dispatch({ type: 'toggleBookmark', key })}>
            {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
          </button>
        </div>
      </div>
      <div className="card"><NotesEditor key={lesson.id} lessonId={lesson.id} /></div>
      {siblings.length > 1 && module && (
        <div className="card">
          <h3>Module {module.id}</h3>
          <ul className="module-lessons">
            {siblings.map((l) => (
              <li key={l.id}>
                <Link to={`/learn/${l.id}`} aria-current={l.id === lesson.id ? 'page' : undefined} style={l.id === lesson.id ? { fontWeight: 700 } : undefined}>
                  <span className="check" data-done={Boolean(state.completedLessons[l.id])} aria-hidden="true">✓</span>
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
