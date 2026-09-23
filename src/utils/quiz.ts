import type { Question } from '../types';
import type { Rng } from './subnet';

export interface QuestionResult {
  questionId: string;
  correct: boolean;
}

export interface QuizScore {
  correct: number;
  total: number;
  percent: number;
  results: QuestionResult[];
}

/** Cisco exams give no partial credit on multiple-response items, so neither do we. */
export function isCorrect(q: Question, selected: readonly number[]): boolean {
  const want = new Set(q.correct);
  const got = new Set(selected);
  if (want.size !== got.size) return false;
  for (const c of want) if (!got.has(c)) return false;
  return true;
}

export function scoreQuiz(questions: readonly Question[], answers: Readonly<Record<string, readonly number[]>>): QuizScore {
  const results = questions.map((q) => ({ questionId: q.id, correct: isCorrect(q, answers[q.id] ?? []) }));
  const correct = results.filter((r) => r.correct).length;
  const total = questions.length;
  return { correct, total, percent: total === 0 ? 0 : Math.round((correct / total) * 100), results };
}

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Order in which to show a question's choices. True/false keeps its natural order. */
export function choiceOrder(q: Question, rng: Rng = Math.random): number[] {
  const order = q.choices.map((_, i) => i);
  return q.type === 'true-false' ? order : shuffle(order, rng);
}

export function pickMixed(questions: readonly Question[], count: number, rng: Rng = Math.random): Question[] {
  return shuffle(questions, rng).slice(0, count);
}

export const PASS_MARK = 70;
