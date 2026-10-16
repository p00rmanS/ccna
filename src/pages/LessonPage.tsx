import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { labForLesson, lessonById, moduleOfLesson, nextLesson, previousLesson, questionsForLesson, flashcardsForLesson } from '../data';
import { objectiveLabel } from '../data/domains';
import { SectionView } from '../components/lessons/SectionView';
import { sectionAnchor } from '../components/lessons/toc';
import { LessonTools } from '../components/lessons/LessonTools';
import { EmptyState } from '../components/common/Common';
import { dispatch, useAppState } from '../store/store';

export default function LessonPage() {
  const { lessonId = '' } = useParams();
  const lesson = lessonById(lessonId);
  const state = useAppState();

  // Reading progress in whole percent, so the page only re-renders when the number actually changes.
  const [read, setRead] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setRead(max > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100))) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [lessonId]);

  // Left/right arrow keys move to the previous/next lesson (ignored while typing or with modifier keys).
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      const target = e.key === 'ArrowRight' ? nextLesson(lessonId) : previousLesson(lessonId);
      if (target) navigate(`/learn/${target.id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lessonId, navigate]);

  useEffect(() => {
    document.title = lesson ? `${lesson.title} · CCNA Mastery` : 'Lesson not found · CCNA Mastery';
    window.scrollTo({ top: 0 });
  }, [lesson]);

  if (!lesson) {
    return (
      <>
        <h1 className="sr-only">Lesson not found</h1>
        <EmptyState title="Lesson not found" action={<Link className="btn btn-primary" to="/learn">Back to the course</Link>}>That lesson does not exist yet. The course page lists what is published and what is planned.</EmptyState>
      </>
    );
  }
  const module = moduleOfLesson(lesson.id);
  const next = nextLesson(lesson.id);
  const prev = previousLesson(lesson.id);
  const lab = labForLesson(lesson.id);
  const questionCount = questionsForLesson(lesson.id).length;
  const cardCount = flashcardsForLesson(lesson.id).length;
  const done = Boolean(state.completedLessons[lesson.id]);

  return (
    <div className="lesson-layout">
      <div className="read-progress" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={read}><span style={{ transform: `scaleX(${read / 100})` }} /></div>
      <article>
        <nav aria-label="Breadcrumb" className="small muted">
          <Link to="/learn">Learn</Link> › Module {module?.id} · {module?.title}
        </nav>
        <header className="lesson-head">
          <h1>{lesson.title}</h1>
          <div className="row">
            <span className="badge">⏱ {lesson.estimatedMinutes} min</span>
            <span className="badge">{lesson.difficulty === 'beginner' ? 'Beginner' : lesson.difficulty === 'intermediate' ? 'Intermediate' : 'Exam level'}</span>
            {done && <span className="badge badge-success">✓ Completed</span>}
          </div>
          <p className="muted" style={{ marginTop: 10 }}>{lesson.description}</p>
        </header>

        <section className="callout callout-relax" aria-labelledby="why-h" style={{ marginTop: 0 }}>
          <div className="callout-title" id="why-h">Why this matters</div>
          <p>{lesson.whyMatters}</p>
        </section>

        <section className="lesson-block" aria-labelledby="obj-h">
          <h2 id="obj-h">Learning objectives</h2>
          <p className="muted small" style={{ marginBottom: 6 }}>After this lesson you will be able to:</p>
          <ul className="objective-list">{lesson.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
        </section>

        {lesson.sections.map((s, i) => <div key={i} id={sectionAnchor(i)} className="anchor"><SectionView section={s} /></div>)}

        <section className="lesson-block" aria-labelledby="practice-h">
          <h2 id="practice-h">Practise it</h2>
          <div className="grid grid-3">
            <div className="card">
              <h3>Quiz</h3>
              <p className="muted small">{questionCount} original questions with explanations.</p>
              <Link className="btn btn-primary" to={`/quizzes?lesson=${lesson.id}`}>Start quiz</Link>
            </div>
            <div className="card">
              <h3>Flashcards</h3>
              <p className="muted small">{cardCount} cards, scheduled with spaced repetition.</p>
              <Link className="btn" to={`/flashcards?lesson=${lesson.id}`}>Review cards</Link>
            </div>
            {lab && (
              <div className="card">
                <h3>Lab</h3>
                <p className="muted small">{lab.title} · {lab.tool} · {lab.minutes} min</p>
                <Link className="btn" to={`/labs/${lab.id}`}>Open lab</Link>
              </div>
            )}
          </div>
        </section>

        <section className="lesson-block" aria-labelledby="objs-h">
          <h2 id="objs-h">Exam objectives covered</h2>
          <ul>{lesson.examObjectives.map((c) => <li key={c}>{objectiveLabel(c)}</li>)}</ul>
          <p className="small muted">Objective wording is paraphrased. Always check Cisco’s current 200-301 exam topics.</p>
        </section>

        <div className="row row-between" style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          {prev ? <Link className="btn" to={`/learn/${prev.id}`} title="Previous lesson (← key)" aria-keyshortcuts="ArrowLeft">← {prev.title}</Link> : <span />}
          <button type="button" className={`btn ${done ? '' : 'btn-primary'}`} onClick={() => dispatch({ type: done ? 'uncompleteLesson' : 'completeLesson', id: lesson.id })}>{done ? '✓ Completed' : 'Mark complete'}</button>
          {next ? <Link className="btn btn-primary" to={`/learn/${next.id}`} title="Next lesson (→ key)" aria-keyshortcuts="ArrowRight">Next: {next.title} →</Link> : <Link className="btn" to="/learn">Back to course</Link>}
        </div>
        <p className="small muted" style={{ textAlign: 'center', marginTop: 12 }}>Tip: press <kbd>←</kbd> or <kbd>→</kbd> to move between lessons.</p>
      </article>
      <LessonTools lesson={lesson} />
    </div>
  );
}
