import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LESSONS, QUESTIONS, lessonById, questionById, questionsForLesson } from '../data';
import { EmptyState, PageHead } from '../components/common/Common';
import { QuizRunner } from '../components/quizzes/QuizRunner';
import { missedQuestionIds } from '../store/state';
import { useAppState } from '../store/store';
import { pickMixed, shuffle } from '../utils/quiz';
import type { Question } from '../types';

interface Active {
  quizId: string;
  title: string;
  questions: Question[];
  key: number;
}

export default function Quizzes() {
  const state = useAppState();
  const [params, setParams] = useSearchParams();
  const [active, setActive] = useState<Active | null>(null);

  const missedIds = useMemo(() => missedQuestionIds(state), [state]);
  const missed = missedIds.map(questionById).filter((q): q is Question => q !== undefined);

  const start = (quizId: string, title: string, questions: Question[]) => setActive({ quizId, title, questions: shuffle(questions), key: Date.now() });
  const startLesson = (id: string) => start(`lesson:${id}`, lessonById(id)?.title ?? id, questionsForLesson(id));

  // Deep link from a lesson: /quizzes?lesson=<id>
  useEffect(() => {
    const id = params.get('lesson');
    if (id && lessonById(id) && !active) {
      startLesson(id);
      setParams({}, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (active) {
    return (
      <QuizRunner
        key={active.key}
        quizId={active.quizId}
        title={active.title}
        questions={active.questions}
        onExit={() => setActive(null)}
        onRetry={() => setActive({ ...active, questions: shuffle(active.questions), key: Date.now() })}
      />
    );
  }

  const lastScore = (quizId: string) => {
    const last = [...state.quizAttempts].reverse().find((a) => a.quizId === quizId);
    return last ? Math.round((last.correct / last.total) * 100) : null;
  };

  return (
    <div>
      <PageHead title="Quizzes" eyebrow="Practice">
        Original questions that test understanding, with an explanation for every answer. Missed questions feed your review queue.
      </PageHead>
      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h2>Mixed review</h2>
          <p className="muted">Ten random questions from every published lesson.</p>
          <button type="button" className="btn btn-primary" onClick={() => start('mixed', 'Mixed review', pickMixed(QUESTIONS, 10))}>Start mixed review</button>
        </div>
        <div className="card">
          <h2>Review missed questions</h2>
          {missed.length === 0 ? (
            <p className="muted">Nothing missed right now. Questions you answer incorrectly appear here until you get them right.</p>
          ) : (
            <>
              <p className="muted">{missed.length} question{missed.length === 1 ? '' : 's'} where your latest answer was wrong.</p>
              <button type="button" className="btn btn-primary" onClick={() => start('missed', 'Missed questions', missed)}>Practise missed questions</button>
            </>
          )}
        </div>
      </div>
      <h2>Lesson quizzes</h2>
      {LESSONS.length === 0 ? <EmptyState title="No lessons yet" /> : (
        <div className="grid grid-auto">
          {LESSONS.map((l) => {
            const n = questionsForLesson(l.id).length;
            const last = lastScore(`lesson:${l.id}`);
            return (
              <article key={l.id} className="card">
                <h3>{l.title}</h3>
                <p className="muted small">{n} questions{last !== null ? ` · last score ${last}%` : ' · not attempted'}</p>
                <button type="button" className="btn" onClick={() => startLesson(l.id)}>{last === null ? 'Start quiz' : 'Retake quiz'}</button>
              </article>
            );
          })}
        </div>
      )}
      <p className="muted small" style={{ marginTop: 20 }}>The full-length timed practice exam simulator with domain analytics is planned for a later phase; these quizzes are for learning, not score prediction.</p>
    </div>
  );
}
