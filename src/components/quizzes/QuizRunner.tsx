import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '../../types';
import { lessonById } from '../../data';
import { objectiveLabel } from '../../data/domains';
import { PASS_MARK, choiceOrder, isCorrect, scoreQuiz } from '../../utils/quiz';
import { dispatch } from '../../store/store';
import { ProgressBar } from '../common/Common';

interface Props {
  quizId: string;
  title: string;
  questions: Question[];
  onExit: () => void;
  onRetry: () => void;
}

export function QuizRunner({ quizId, title, questions, onExit, onRetry }: Props) {
  const orders = useMemo(() => questions.map((q) => choiceOrder(q)), [questions]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const startedAt = useRef(Date.now());
  const recorded = useRef(false);

  const finished = index >= questions.length;
  const q = questions[index];
  const score = useMemo(() => scoreQuiz(questions, answers), [questions, answers]);

  useEffect(() => {
    if (finished && !recorded.current) {
      recorded.current = true;
      dispatch({ type: 'recordQuiz', quizId, results: score.results, seconds: Math.round((Date.now() - startedAt.current) / 1000) });
    }
  }, [finished, quizId, score.results]);

  if (finished) {
    const missed = questions.filter((question) => !isCorrect(question, answers[question.id] ?? []));
    const passed = score.percent >= PASS_MARK;
    return (
      <div className="stack">
        <div className="card" role="status">
          <h2>{title} — results</h2>
          <p style={{ fontSize: '2rem', fontWeight: 750, margin: '4px 0' }}>{score.correct} / {score.total} <span className="muted" style={{ fontSize: '1.1rem' }}>({score.percent}%)</span></p>
          <p><span className={`badge ${passed ? 'badge-success' : 'badge-warning'}`}>{passed ? `Passed (${PASS_MARK}% mark)` : `Below the ${PASS_MARK}% study mark`}</span></p>
          <p className="muted">{passed ? 'Good. Review anything you missed below so it sticks.' : 'That is useful information, not a verdict. Re-read the linked lessons, then try again.'}</p>
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={onRetry}>Retry quiz</button>
            <button type="button" className="btn" onClick={onExit}>All quizzes</button>
          </div>
        </div>
        {missed.length > 0 && (
          <section className="card" aria-labelledby="missed-h">
            <h2 id="missed-h">Review what you missed ({missed.length})</h2>
            {missed.map((m) => (
              <div key={m.id} className="callout" style={{ marginTop: 12 }}>
                <p><strong>{m.prompt}</strong></p>
                <p>Correct: {m.correct.map((c) => m.choices[c]).join(' · ')}</p>
                <p className="small">{m.explanation}</p>
                <p className="small muted" style={{ margin: 0 }}>{objectiveLabel(m.objective)} · Review: {m.lessonIds.map((id) => <Link key={id} to={`/learn/${id}`}>{lessonById(id)?.title}</Link>).reduce<React.ReactNode[]>((acc, el, i) => (i ? [...acc, ', ', el] : [el]), [])}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    );
  }

  const order = orders[index]!;
  const selected = answers[q!.id] ?? [];
  const isChecked = checked[q!.id] === true;
  const needed = q!.correct.length;
  const multi = q!.type === 'multiple';
  const correct = isCorrect(q!, selected);

  const toggle = (choice: number) => {
    if (isChecked) return;
    setAnswers((a) => {
      const cur = a[q!.id] ?? [];
      if (multi) return { ...a, [q!.id]: cur.includes(choice) ? cur.filter((c) => c !== choice) : [...cur, choice] };
      return { ...a, [q!.id]: [choice] };
    });
  };

  const stateOf = (choice: number): string | undefined => {
    const sel = selected.includes(choice);
    if (!isChecked) return sel ? 'selected' : undefined;
    const isRight = q!.correct.includes(choice);
    if (isRight && sel) return 'correct';
    if (!isRight && sel) return 'wrong';
    if (isRight && !sel) return 'missed';
    return undefined;
  };

  return (
    <div className="stack" style={{ maxWidth: 780 }}>
      <div className="row row-between">
        <button type="button" className="btn btn-sm btn-ghost" onClick={onExit}>← Quit quiz</button>
        <span className="small muted">Question {index + 1} of {questions.length}</span>
      </div>
      <ProgressBar value={(index / questions.length) * 100} label="Quiz progress" />
      <div className="card">
        <div className="row" style={{ marginBottom: 8 }}>
          <span className="badge">{q!.difficulty}</span>
          <span className="badge">Objective {q!.objective}</span>
        </div>
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ fontSize: '1.15rem', fontWeight: 650, marginBottom: 6 }}>{q!.prompt}</legend>
          <p className="small muted">{multi ? `Choose ${needed}. There is no partial credit.` : q!.type === 'true-false' ? 'Choose true or false.' : 'Choose one answer.'}</p>
          {order.map((choice) => {
            const st = stateOf(choice);
            const wrongNote = isChecked && !q!.correct.includes(choice) ? q!.wrong?.[choice] : undefined;
            const id = `${q!.id}-c${choice}`;
            return (
              <label key={choice} className="choice" data-state={st} htmlFor={id}>
                <input id={id} type={multi ? 'checkbox' : 'radio'} name={q!.id} checked={selected.includes(choice)} disabled={isChecked} onChange={() => toggle(choice)} />
                <span>
                  {q!.choices[choice]}
                  {isChecked && st === 'correct' && <small>✓ Correct</small>}
                  {isChecked && st === 'missed' && <small>✓ This was also correct</small>}
                  {isChecked && st === 'wrong' && <small>✗ Not correct{wrongNote ? ` — ${wrongNote}` : ''}</small>}
                  {isChecked && !st && wrongNote && <small>{wrongNote}</small>}
                </span>
              </label>
            );
          })}
        </fieldset>
        <div aria-live="polite">
          {isChecked && (
            <div className={`feedback ${correct ? 'feedback-ok' : 'feedback-bad'}`}>
              <strong>{correct ? 'Correct!' : 'Not quite.'}</strong>
              {q!.explanation}
              <div className="small muted" style={{ marginTop: 6 }}>Related lesson: {q!.lessonIds.map((id) => <Link key={id} to={`/learn/${id}`}>{lessonById(id)?.title}</Link>)}</div>
            </div>
          )}
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          {!isChecked ? (
            <button type="button" className="btn btn-primary" disabled={selected.length === 0 || (multi && selected.length !== needed)} onClick={() => setChecked({ ...checked, [q!.id]: true })}>Check answer</button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setIndex(index + 1)}>{index === questions.length - 1 ? 'See results' : 'Next question'}</button>
          )}
          {multi && !isChecked && selected.length !== needed && <span className="small muted">Select exactly {needed} answers.</span>}
        </div>
      </div>
    </div>
  );
}
