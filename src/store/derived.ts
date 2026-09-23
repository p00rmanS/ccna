import type { Domain, Flashcard, Lesson } from '../types';
import { isDue } from '../utils/srs';
import { PASS_MARK } from '../utils/quiz';
import type { AppState, Onboarding } from './state';

export interface DomainProgress {
  domain: Domain;
  published: number;
  completed: number;
  /** 0–100, or null when the domain has no published lessons yet. */
  percent: number | null;
}

export function domainProgress(state: AppState, domains: readonly Domain[], lessons: readonly Lesson[]): DomainProgress[] {
  return domains.map((domain) => {
    const inDomain = lessons.filter((l) => l.domain === domain.id);
    const completed = inDomain.filter((l) => state.completedLessons[l.id]).length;
    return {
      domain,
      published: inDomain.length,
      completed,
      percent: inDomain.length === 0 ? null : Math.round((completed / inDomain.length) * 100),
    };
  });
}

/** Weighted accuracy over all recorded quiz answers, or null if none. */
export function quizAccuracy(state: AppState): number | null {
  const total = state.quizAttempts.reduce((n, a) => n + a.total, 0);
  if (total === 0) return null;
  const correct = state.quizAttempts.reduce((n, a) => n + a.correct, 0);
  return Math.round((correct / total) * 100);
}

export function subnettingAccuracy(state: AppState): number | null {
  const s = state.subnetting;
  return s.attempted === 0 ? null : Math.round((s.correct / s.attempted) * 100);
}

export function subnettingAverageSeconds(state: AppState): number | null {
  const s = state.subnetting;
  return s.attempted === 0 ? null : Math.round((s.totalSeconds / s.attempted) * 10) / 10;
}

export const cardsDue = (state: AppState, cards: readonly Flashcard[], now: number): number =>
  cards.filter((c) => state.flashcards[c.id] !== undefined && isDue(state.flashcards[c.id], now)).length;

export const newCards = (state: AppState, cards: readonly Flashcard[]): number =>
  cards.filter((c) => state.flashcards[c.id] === undefined).length;

/** First lesson, in curriculum order, that has not been completed. */
export const recommendedLesson = (state: AppState, lessons: readonly Lesson[]): Lesson | undefined =>
  lessons.find((l) => !state.completedLessons[l.id]);

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

export function achievements(state: AppState, lessons: readonly Lesson[], streakLongest: number, cliTaskTotal = 0): Achievement[] {
  const passed = state.quizAttempts.some((a) => a.total > 0 && (a.correct / a.total) * 100 >= PASS_MARK);
  const perfect = state.quizAttempts.some((a) => a.total >= 5 && a.correct === a.total);
  const s = state.subnetting;
  const reviewed = Object.values(state.flashcards).filter((c) => c.reps > 0).length;
  const allDone = lessons.length > 0 && lessons.every((l) => state.completedLessons[l.id]);
  return [
    { id: 'first-lesson', name: 'First Lesson', description: 'Complete your first lesson.', earned: Object.keys(state.completedLessons).length >= 1 },
    { id: 'first-ping', name: 'First Ping', description: 'Complete your first lab.', earned: Object.keys(state.completedLabs).length >= 1 },
    { id: 'quiz-pass', name: 'Quiz Passer', description: `Score ${PASS_MARK}% or better on a quiz.`, earned: passed },
    { id: 'perfect', name: 'Flawless', description: 'Get every question right on a quiz of 5 or more questions.', earned: perfect },
    { id: 'subnetting-rookie', name: 'Subnetting Rookie', description: 'Answer 20 subnetting questions correctly.', earned: s.correct >= 20 },
    { id: 'subnetting-ninja', name: 'Subnetting Ninja', description: 'Answer 100 subnetting questions correctly with at least 90% accuracy.', earned: s.correct >= 100 && s.correct / Math.max(1, s.attempted) >= 0.9 },
    { id: 'card-collector', name: 'Card Collector', description: 'Review 25 different flashcards.', earned: reviewed >= 25 },
    { id: 'week-streak', name: 'Seven in a Row', description: 'Study on seven days in a row.', earned: streakLongest >= 7 },
    { id: 'cli-warrior', name: 'CLI Warrior', description: 'Complete every CLI practice task.', earned: cliTaskTotal > 0 && Object.keys(state.cliTasks).length >= cliTaskTotal },
    { id: 'first-exam', name: 'Exam Day', description: 'Finish a practice exam.', earned: state.examHistory.length >= 1 },
    { id: 'exam-strong', name: 'Strong Showing', description: 'Score 85% or better on a practice exam of 20+ questions.', earned: state.examHistory.some((e) => e.total >= 20 && e.correct / e.total >= 0.85) },
    { id: 'all-published', name: 'Up to Date', description: 'Complete every lesson published so far.', earned: allDone },
  ];
}

export interface StudyPlan {
  startAt: string;
  headline: string;
  detail: string;
  publishedMinutes: number;
  daysForPublished: number;
}

export function recommendPlan(onb: Onboarding, lessons: readonly Lesson[]): StudyPlan {
  const publishedMinutes = lessons.reduce((n, l) => n + l.estimatedMinutes, 0);
  const daysForPublished = Math.max(1, Math.ceil(publishedMinutes / onb.minutesPerDay));
  const startAt = onb.experience === 'new' || onb.experience === 'some-it' ? 'Module 0.1 — What Is a Network?' : 'The Subnetting trainer, then the lesson quizzes';
  const headline =
    onb.experience === 'new' ? 'Start at the beginning — nothing is assumed.'
    : onb.experience === 'some-it' ? 'Start at Module 0.1 and skim what you already know.'
    : 'Test yourself first, then fill the gaps.';
  const goal = { learn: 'building real understanding', pass: 'preparing for the CCNA 200-301 exam', school: 'preparing for school', job: 'improving your job skills' }[onb.goal];
  const detail =
    onb.experience === 'student' || onb.experience === 'professional'
      ? `You are ${goal}. Try the lesson quizzes and the Subnetting trainer; the weakness list on your dashboard will point to what to revisit. Your published lessons total about ${Math.round(publishedMinutes / 60)} hours.`
      : `You are ${goal}. The published lessons total about ${Math.round(publishedMinutes / 60)} hours — around ${daysForPublished} days at ${onb.minutesPerDay} minutes a day. More modules are planned; the Learn page shows what is next.`;
  return { startAt, headline, detail, publishedMinutes, daysForPublished };
}
