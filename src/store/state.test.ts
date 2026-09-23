import { describe, expect, it } from 'vitest';
import {
  computeStreaks, dayKey, defaultState, missedQuestionIds, reduce, sanitizeState, topicAccuracy, weakTopics, MAX_ATTEMPTS,
} from './state';

const t = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).getTime();
const NOW = t(2026, 3, 10);

describe('sanitizeState (corrupted storage)', () => {
  it('returns defaults for non-objects', () => {
    for (const bad of [null, undefined, 42, 'x', [], true]) expect(sanitizeState(bad)).toEqual(defaultState());
  });
  it('drops malformed fields but keeps valid ones', () => {
    const s = sanitizeState({
      settings: { theme: 'neon', style: 'taglish' },
      completedLessons: { good: 123, bad: 'yesterday' },
      flashcards: { ok: { reps: 1, ease: 2.5, intervalDays: 1, due: 5, lapses: 0, last: 1 }, broken: { reps: 'x' } },
      quizAttempts: [{ nope: true }],
      studyDays: ['2026-01-02', 'not-a-date', '2026-01-02'],
      notes: { a: 'hello', b: 5 },
      bookmarks: ['lesson:a', 7, 'lesson:a'],
    });
    expect(s.settings.theme).toBe('system');
    expect(s.settings.style).toBe('taglish');
    expect(s.completedLessons).toEqual({ good: 123 });
    expect(Object.keys(s.flashcards)).toEqual(['ok']);
    expect(s.quizAttempts).toEqual([]);
    expect(s.studyDays).toEqual(['2026-01-02']);
    expect(s.notes).toEqual({ a: 'hello' });
    expect(s.bookmarks).toEqual(['lesson:a']);
  });
  it('defaults to Taglish and migrates the old auto-assigned "simple" style', () => {
    expect(defaultState().settings.style).toBe('taglish');
    expect(sanitizeState({ version: 1, settings: { style: 'simple' } }).settings.style).toBe('taglish');
    // A choice made under the current version is respected.
    expect(sanitizeState({ version: 2, settings: { style: 'simple' } }).settings.style).toBe('simple');
    expect(sanitizeState({ version: 2, settings: { style: 'english' } }).settings.style).toBe('english');
  });
  it('round-trips a valid state unchanged', () => {
    let s = defaultState();
    s = reduce(s, { type: 'completeLesson', id: 'a' }, NOW);
    s = reduce(s, { type: 'gradeCard', cardId: 'c1', grade: 'good' }, NOW);
    s = reduce(s, { type: 'recordQuiz', quizId: 'q', results: [{ questionId: 'x', correct: true }], seconds: 5 }, NOW);
    expect(sanitizeState(JSON.parse(JSON.stringify(s)))).toEqual(s);
  });
});

describe('streaks', () => {
  it('is zero without activity', () => {
    expect(computeStreaks([], '2026-03-10')).toEqual({ current: 0, longest: 0 });
  });
  it('counts consecutive days ending today', () => {
    expect(computeStreaks(['2026-03-08', '2026-03-09', '2026-03-10'], '2026-03-10')).toEqual({ current: 3, longest: 3 });
  });
  it('keeps the streak alive if the learner has not studied yet today', () => {
    expect(computeStreaks(['2026-03-08', '2026-03-09'], '2026-03-10').current).toBe(2);
  });
  it('breaks after a missed day but remembers the longest run', () => {
    const r = computeStreaks(['2026-03-01', '2026-03-02', '2026-03-03', '2026-03-08'], '2026-03-10');
    expect(r).toEqual({ current: 0, longest: 3 });
  });
  it('works across month boundaries and DST changes', () => {
    expect(computeStreaks(['2026-03-28', '2026-03-29', '2026-03-30', '2026-03-31', '2026-04-01'], '2026-04-01').current).toBe(5);
  });
});

describe('reducer', () => {
  it('completes lessons once and records the study day', () => {
    let s = reduce(defaultState(), { type: 'completeLesson', id: 'a' }, NOW);
    expect(s.completedLessons.a).toBe(NOW);
    expect(s.studyDays).toEqual([dayKey(NOW)]);
    const again = reduce(s, { type: 'completeLesson', id: 'a' }, NOW + 1000);
    expect(again).toBe(s);
    s = reduce(s, { type: 'uncompleteLesson', id: 'a' }, NOW);
    expect(s.completedLessons).toEqual({});
  });
  it('tracks quiz attempts and per-question statistics', () => {
    let s = defaultState();
    s = reduce(s, { type: 'recordQuiz', quizId: 'z', results: [{ questionId: 'q1', correct: true }, { questionId: 'q2', correct: false }], seconds: 30 }, NOW);
    s = reduce(s, { type: 'recordQuiz', quizId: 'z', results: [{ questionId: 'q2', correct: true }], seconds: 10 }, NOW + 1);
    expect(s.quizAttempts).toHaveLength(2);
    expect(s.quizAttempts[0]).toMatchObject({ correct: 1, total: 2 });
    expect(s.questionStats.q2).toMatchObject({ seen: 2, correct: 1, lastCorrect: true });
    expect(missedQuestionIds(s)).toEqual([]);
  });
  it('caps stored attempts', () => {
    let s = defaultState();
    for (let i = 0; i < MAX_ATTEMPTS + 25; i++) s = reduce(s, { type: 'recordQuiz', quizId: 'z', results: [{ questionId: 'q', correct: true }], seconds: 1 }, NOW + i);
    expect(s.quizAttempts).toHaveLength(MAX_ATTEMPTS);
  });
  it('schedules flashcards through SM-2', () => {
    let s = reduce(defaultState(), { type: 'gradeCard', cardId: 'c', grade: 'good' }, NOW);
    expect(s.flashcards.c!.intervalDays).toBe(1);
    s = reduce(s, { type: 'gradeCard', cardId: 'c', grade: 'again' }, NOW);
    expect(s.flashcards.c!.lapses).toBe(1);
  });
  it('tracks subnetting accuracy, streaks and weak buckets', () => {
    let s = defaultState();
    const rec = (correct: boolean, prefix = 26) => (s = reduce(s, { type: 'recordSubnetting', kind: 'network', prefix, correct, seconds: 10 }, NOW));
    rec(true); rec(true); rec(false); rec(true, 12);
    expect(s.subnetting).toMatchObject({ attempted: 4, correct: 3, totalSeconds: 40, currentStreak: 1, bestStreak: 2 });
    expect(s.subnetting.byBucket['/25–/30']).toEqual({ attempted: 3, correct: 2 });
    expect(s.subnetting.byBucket['/8–/15']).toEqual({ attempted: 1, correct: 1 });
    expect(s.subnetting.byKind.network).toEqual({ attempted: 4, correct: 3 });
  });
  it('toggles lab checklist items and resets a lab', () => {
    let s = reduce(defaultState(), { type: 'toggleLabCheck', labId: 'l', index: 2 }, NOW);
    s = reduce(s, { type: 'toggleLabCheck', labId: 'l', index: 0 }, NOW);
    expect(s.labChecks.l).toEqual([0, 2]);
    s = reduce(s, { type: 'toggleLabCheck', labId: 'l', index: 2 }, NOW);
    expect(s.labChecks.l).toEqual([0]);
    s = reduce(s, { type: 'completeLab', id: 'l' }, NOW);
    s = reduce(s, { type: 'resetLab', id: 'l' }, NOW);
    expect(s.labChecks.l).toBeUndefined();
    expect(s.completedLabs.l).toBeUndefined();
  });
  it('saves and deletes notes, toggles bookmarks', () => {
    let s = reduce(defaultState(), { type: 'setNote', lessonId: 'a', text: '# hi' }, NOW);
    expect(s.notes.a).toBe('# hi');
    s = reduce(s, { type: 'setNote', lessonId: 'a', text: '   ' }, NOW);
    expect(s.notes).toEqual({});
    s = reduce(s, { type: 'toggleBookmark', key: 'lesson:a' }, NOW);
    expect(s.bookmarks).toEqual(['lesson:a']);
    s = reduce(s, { type: 'toggleBookmark', key: 'lesson:a' }, NOW);
    expect(s.bookmarks).toEqual([]);
  });
  it('imports through sanitizeState and resets', () => {
    const imported = reduce(defaultState(), { type: 'import', state: { completedLessons: { x: 1 }, garbage: true } }, NOW);
    expect(imported.completedLessons).toEqual({ x: 1 });
    expect(reduce(imported, { type: 'reset' }, NOW)).toEqual(defaultState());
  });
  it('does not mutate previous state', () => {
    const before = defaultState();
    const frozen = JSON.stringify(before);
    reduce(before, { type: 'completeLesson', id: 'a' }, NOW);
    reduce(before, { type: 'recordSubnetting', kind: 'network', prefix: 24, correct: true, seconds: 1 }, NOW);
    expect(JSON.stringify(before)).toBe(frozen);
  });
});

describe('weakness engine', () => {
  const questions = [
    { id: 'a1', lessonIds: ['osi'] }, { id: 'a2', lessonIds: ['osi'] }, { id: 'b1', lessonIds: ['ipv4'] },
  ];
  it('flags topics below 70% once enough answers exist', () => {
    let s = defaultState();
    for (let i = 0; i < 3; i++) s = reduce(s, { type: 'recordQuiz', quizId: 'x', results: [{ questionId: 'a1', correct: false }, { questionId: 'b1', correct: true }], seconds: 1 }, NOW);
    const acc = topicAccuracy(s, questions);
    expect(acc[0]).toMatchObject({ lessonId: 'osi', seen: 3, correct: 0 });
    expect(weakTopics(acc).map((a) => a.lessonId)).toEqual(['osi']);
  });
  it('does not flag topics with too few answers', () => {
    const s = reduce(defaultState(), { type: 'recordQuiz', quizId: 'x', results: [{ questionId: 'a1', correct: false }], seconds: 1 }, NOW);
    expect(weakTopics(topicAccuracy(s, questions))).toEqual([]);
  });
});

describe('practice exams and CLI tasks', () => {
  it('records an exam, updates per-question stats and the study day', () => {
    const s = reduce(defaultState(), {
      type: 'recordExam', label: '20-question practice exam', seconds: 900, timed: true,
      results: [{ questionId: 'a', correct: true }, { questionId: 'b', correct: false }],
      byDomain: { D1: { attempted: 2, correct: 1 } },
    }, NOW);
    expect(s.examHistory).toHaveLength(1);
    expect(s.examHistory[0]).toMatchObject({ label: '20-question practice exam', total: 2, correct: 1, seconds: 900, timed: true, byDomain: { D1: { attempted: 2, correct: 1 } } });
    expect(s.questionStats.b).toMatchObject({ seen: 1, correct: 0, lastCorrect: false });
    expect(s.studyDays).toEqual([dayKey(NOW)]);
    expect(missedQuestionIds(s)).toEqual(['b']);
  });
  it('caps exam history', () => {
    let s = defaultState();
    for (let i = 0; i < 60; i++) s = reduce(s, { type: 'recordExam', label: 'x', seconds: 1, timed: false, results: [{ questionId: 'q', correct: true }], byDomain: {} }, NOW + i);
    expect(s.examHistory).toHaveLength(50);
  });
  it('remembers completed CLI tasks once', () => {
    let s = reduce(defaultState(), { type: 'completeCliTask', id: 'first-steps' }, NOW);
    expect(s.cliTasks['first-steps']).toBe(NOW);
    expect(reduce(s, { type: 'completeCliTask', id: 'first-steps' }, NOW + 5000)).toBe(s);
    s = reduce(s, { type: 'completeCliTask', id: 'fix-it' }, NOW + 1);
    expect(Object.keys(s.cliTasks)).toEqual(['first-steps', 'fix-it']);
  });
  it('survives corrupted exam and CLI data', () => {
    const s = sanitizeState({
      examHistory: [{ at: 1 }, { at: 1, label: 'ok', total: 5, correct: 3, seconds: 9, timed: false, byDomain: { D1: { attempted: 5, correct: 3 } } }, 'junk'],
      cliTasks: { good: 5, bad: 'yes' },
    });
    expect(s.examHistory).toHaveLength(1);
    expect(s.cliTasks).toEqual({ good: 5 });
    expect(sanitizeState(JSON.parse(JSON.stringify(s)))).toEqual(s);
  });
});
