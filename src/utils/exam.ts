import type { Question } from '../types';
import type { QuestionResult } from './quiz';
import { shuffle } from './quiz';
import type { Rng } from './subnet';

/** Cisco does not publish exact question counts or timing rules, so these are practice settings, not a replica of the real exam. */
export const SECONDS_PER_QUESTION = 75;
export const MIN_QUESTIONS_FOR_ESTIMATE = 20;

export interface ExamPick {
  size: number;
  lessonId?: string;
  /** When set, only questions from these lessons or in `missedIds` are used. */
  focus?: { lessonIds: readonly string[]; missedIds: readonly string[] };
}

/** Chooses distinct questions. Returns fewer than `size` if the pool is smaller. */
export function selectExamQuestions(all: readonly Question[], pick: ExamPick, rng: Rng = Math.random): Question[] {
  let pool = all.filter((q) => (pick.lessonId ? q.lessonIds.includes(pick.lessonId) : true));
  if (pick.focus) {
    const lessons = new Set(pick.focus.lessonIds);
    const missed = new Set(pick.focus.missedIds);
    pool = pool.filter((q) => missed.has(q.id) || q.lessonIds.some((l) => lessons.has(l)));
  }
  return shuffle(pool, rng).slice(0, Math.max(0, pick.size));
}

export const examSeconds = (questionCount: number): number => questionCount * SECONDS_PER_QUESTION;

export interface DomainTally {
  attempted: number;
  correct: number;
}

export function domainBreakdown(questions: readonly Question[], results: readonly QuestionResult[]): Record<string, DomainTally> {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const out: Record<string, DomainTally> = {};
  for (const r of results) {
    const q = byId.get(r.questionId);
    if (!q) continue;
    const t = out[q.domain] ?? { attempted: 0, correct: 0 };
    t.attempted += 1;
    if (r.correct) t.correct += 1;
    out[q.domain] = t;
  }
  return out;
}

export type ReadinessBand = 'Not enough data' | 'Needs Review' | 'Developing' | 'Nearly Ready' | 'Strong';

export interface Readiness {
  band: ReadinessBand;
  message: string;
}

/**
 * A study-progress indicator, deliberately not a pass prediction: it only describes how this set of questions went.
 * It needs enough questions to mean anything.
 */
export function readiness(percent: number, total: number): Readiness {
  if (total < MIN_QUESTIONS_FOR_ESTIMATE) {
    return { band: 'Not enough data', message: `Take at least ${MIN_QUESTIONS_FOR_ESTIMATE} questions for a meaningful estimate. Short sets are for practice, not measurement.` };
  }
  if (percent < 50) return { band: 'Needs Review', message: 'Re-read the lessons for the topics below, redo their quizzes, then try again.' };
  if (percent < 70) return { band: 'Developing', message: 'You have the basics. Focus on your weakest topics and review the explanations for every miss.' };
  if (percent < 85) return { band: 'Nearly Ready', message: 'Solid. Close the remaining gaps and practise under time pressure.' };
  return { band: 'Strong', message: 'Strong on this material. Keep it fresh with spaced flashcards and keep practising subnetting.' };
}

export const formatDuration = (seconds: number): string => {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
};

export interface LessonTally {
  lessonId: string;
  seen: number;
  correct: number;
}

/** How each lesson's questions went in one exam, weakest first. */
export function lessonBreakdown(questions: readonly Question[], results: readonly QuestionResult[]): LessonTally[] {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const tally = new Map<string, LessonTally>();
  for (const r of results) {
    const q = byId.get(r.questionId);
    if (!q) continue;
    for (const lessonId of q.lessonIds) {
      const t = tally.get(lessonId) ?? { lessonId, seen: 0, correct: 0 };
      t.seen += 1;
      if (r.correct) t.correct += 1;
      tally.set(lessonId, t);
    }
  }
  return [...tally.values()].sort((a, b) => a.correct / a.seen - b.correct / b.seen || a.lessonId.localeCompare(b.lessonId));
}
