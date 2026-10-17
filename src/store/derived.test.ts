import { describe, expect, it } from 'vitest';
import { DOMAINS } from '../data/domains';
import { FLASHCARDS, LESSONS } from '../data';
import { achievements, cardsDue, domainProgress, newCards, quizAccuracy, recommendPlan, recommendedLesson, subnettingAccuracy, subnettingAverageSeconds } from './derived';
import { defaultState, reduce } from './state';

const NOW = new Date(2026, 5, 1, 12).getTime();

describe('domainProgress', () => {
  it('reports only published lessons and never invents a percentage', () => {
    const s = reduce(defaultState(), { type: 'completeLesson', id: LESSONS[0]!.id }, NOW);
    const rows = domainProgress(s, DOMAINS, LESSONS);
    const d1 = rows.find((r) => r.domain.id === 'D1')!;
    const d1Lessons = LESSONS.filter((l) => l.domain === 'D1').length;
    expect(d1.published).toBe(d1Lessons);
    expect(d1.completed).toBe(1);
    expect(d1.percent).toBe(Math.round((1 / d1Lessons) * 100));
    // D2 has lessons now but none completed: a real 0%, not null. D4 is published now; unpublished domains stay null.
    expect(rows.find((r) => r.domain.id === 'D2')!.percent).toBe(0);
    for (const row of rows.filter((r) => r.published === 0)) expect(row.percent).toBeNull();
  });
});

describe('accuracy helpers', () => {
  it('return null before any data (no fake statistics)', () => {
    const s = defaultState();
    expect(quizAccuracy(s)).toBeNull();
    expect(subnettingAccuracy(s)).toBeNull();
    expect(subnettingAverageSeconds(s)).toBeNull();
  });
  it('weight quiz accuracy by number of questions', () => {
    let s = defaultState();
    s = reduce(s, { type: 'recordQuiz', quizId: 'a', results: [{ questionId: '1', correct: true }, { questionId: '2', correct: true }], seconds: 5 }, NOW);
    s = reduce(s, { type: 'recordQuiz', quizId: 'b', results: [{ questionId: '3', correct: false }, { questionId: '4', correct: false }], seconds: 5 }, NOW);
    expect(quizAccuracy(s)).toBe(50);
  });
  it('computes subnetting accuracy and average time', () => {
    let s = defaultState();
    s = reduce(s, { type: 'recordSubnetting', kind: 'network', prefix: 24, correct: true, seconds: 10 }, NOW);
    s = reduce(s, { type: 'recordSubnetting', kind: 'network', prefix: 24, correct: false, seconds: 5 }, NOW);
    expect(subnettingAccuracy(s)).toBe(50);
    expect(subnettingAverageSeconds(s)).toBe(7.5);
  });
});

describe('flashcard counts', () => {
  it('counts new and due cards', () => {
    let s = defaultState();
    expect(newCards(s, FLASHCARDS)).toBe(FLASHCARDS.length);
    expect(cardsDue(s, FLASHCARDS, NOW)).toBe(0);
    s = reduce(s, { type: 'gradeCard', cardId: FLASHCARDS[0]!.id, grade: 'again' }, NOW);
    expect(newCards(s, FLASHCARDS)).toBe(FLASHCARDS.length - 1);
    expect(cardsDue(s, FLASHCARDS, NOW)).toBe(0);
    expect(cardsDue(s, FLASHCARDS, NOW + 11 * 60_000)).toBe(1);
  });
});

describe('recommendedLesson', () => {
  it('starts at the first lesson and advances as lessons are completed', () => {
    let s = defaultState();
    expect(recommendedLesson(s, LESSONS)?.id).toBe(LESSONS[0]!.id);
    s = reduce(s, { type: 'completeLesson', id: LESSONS[0]!.id }, NOW);
    expect(recommendedLesson(s, LESSONS)?.id).toBe(LESSONS[1]!.id);
    for (const l of LESSONS) s = reduce(s, { type: 'completeLesson', id: l.id }, NOW);
    expect(recommendedLesson(s, LESSONS)).toBeUndefined();
  });
});

describe('achievements', () => {
  it('starts with none earned and earns from real activity', () => {
    let s = defaultState();
    expect(achievements(s, LESSONS, 0).some((a) => a.earned)).toBe(false);
    s = reduce(s, { type: 'completeLesson', id: LESSONS[0]!.id }, NOW);
    s = reduce(s, { type: 'recordQuiz', quizId: 'x', results: Array.from({ length: 5 }, (_, i) => ({ questionId: `q${i}`, correct: true })), seconds: 5 }, NOW);
    const earned = achievements(s, LESSONS, 7).filter((a) => a.earned).map((a) => a.id);
    expect(earned).toEqual(expect.arrayContaining(['first-lesson', 'quiz-pass', 'perfect', 'week-streak']));
    expect(earned).not.toContain('first-ping');
  });
  it('requires accuracy for Subnetting Ninja', () => {
    let s = defaultState();
    s = { ...s, subnetting: { ...s.subnetting, attempted: 200, correct: 100 } };
    expect(achievements(s, LESSONS, 0).find((a) => a.id === 'subnetting-ninja')!.earned).toBe(false);
    s = { ...s, subnetting: { ...s.subnetting, attempted: 105, correct: 100 } };
    expect(achievements(s, LESSONS, 0).find((a) => a.id === 'subnetting-ninja')!.earned).toBe(true);
  });
});

describe('recommendPlan', () => {
  it('derives time from published lesson minutes, not invented figures', () => {
    const plan = recommendPlan({ experience: 'new', goal: 'pass', minutesPerDay: 60 }, LESSONS);
    const minutes = LESSONS.reduce((n, l) => n + l.estimatedMinutes, 0);
    expect(plan.publishedMinutes).toBe(minutes);
    expect(plan.daysForPublished).toBe(Math.ceil(minutes / 60));
    expect(plan.startAt).toMatch(/Module 0\.1/);
  });
  it('sends experienced learners to the trainer and quizzes first', () => {
    expect(recommendPlan({ experience: 'professional', goal: 'job', minutesPerDay: 30 }, LESSONS).startAt).toMatch(/Subnetting/);
  });
});

describe('CLI and exam achievements', () => {
  it('awards CLI Warrior only when every task is done', () => {
    let s = defaultState();
    s = reduce(s, { type: 'completeCliTask', id: 'a' }, NOW);
    expect(achievements(s, LESSONS, 0, 2).find((a) => a.id === 'cli-warrior')!.earned).toBe(false);
    s = reduce(s, { type: 'completeCliTask', id: 'b' }, NOW);
    expect(achievements(s, LESSONS, 0, 2).find((a) => a.id === 'cli-warrior')!.earned).toBe(true);
    expect(achievements(s, LESSONS, 0).find((a) => a.id === 'cli-warrior')!.earned).toBe(false);
  });
  it('awards exam achievements from real results, and requires 20+ questions for Strong Showing', () => {
    let s = reduce(defaultState(), { type: 'recordExam', label: 'x', seconds: 1, timed: false, results: Array.from({ length: 10 }, (_, i) => ({ questionId: `q${i}`, correct: true })), byDomain: {} }, NOW);
    const get = (id: string) => achievements(s, LESSONS, 0).find((a) => a.id === id)!.earned;
    expect(get('first-exam')).toBe(true);
    expect(get('exam-strong')).toBe(false);
    s = reduce(s, { type: 'recordExam', label: 'y', seconds: 1, timed: false, results: Array.from({ length: 20 }, (_, i) => ({ questionId: `p${i}`, correct: i < 18 })), byDomain: {} }, NOW);
    expect(get('exam-strong')).toBe(true);
  });
});
