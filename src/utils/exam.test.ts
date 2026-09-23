import { describe, expect, it } from 'vitest';
import { QUESTIONS } from '../data';
import { domainBreakdown, examSeconds, formatDuration, lessonBreakdown, readiness, selectExamQuestions, SECONDS_PER_QUESTION } from './exam';
import { mulberry32 } from './subnet';

describe('selectExamQuestions', () => {
  it('returns the requested number of distinct questions', () => {
    const picked = selectExamQuestions(QUESTIONS, { size: 30 }, mulberry32(1));
    expect(picked).toHaveLength(30);
    expect(new Set(picked.map((q) => q.id)).size).toBe(30);
  });
  it('returns everything when asked for more than exist', () => {
    expect(selectExamQuestions(QUESTIONS, { size: 9999 }, mulberry32(1))).toHaveLength(QUESTIONS.length);
  });
  it('can be limited to one lesson', () => {
    const picked = selectExamQuestions(QUESTIONS, { size: 50, lessonId: 'vlsm' }, mulberry32(2));
    expect(picked.length).toBeGreaterThan(0);
    expect(picked.every((q) => q.lessonIds.includes('vlsm'))).toBe(true);
  });
  it('focus mode uses weak lessons and missed questions only', () => {
    const missed = [QUESTIONS.find((q) => q.lessonIds[0] === 'osi-model')!.id];
    const picked = selectExamQuestions(QUESTIONS, { size: 500, focus: { lessonIds: ['vlsm'], missedIds: missed } }, mulberry32(3));
    expect(picked.every((q) => q.lessonIds.includes('vlsm') || missed.includes(q.id))).toBe(true);
    expect(picked.some((q) => q.id === missed[0])).toBe(true);
  });
  it('is deterministic for a seed and handles a zero size', () => {
    expect(selectExamQuestions(QUESTIONS, { size: 5 }, mulberry32(9)).map((q) => q.id)).toEqual(selectExamQuestions(QUESTIONS, { size: 5 }, mulberry32(9)).map((q) => q.id));
    expect(selectExamQuestions(QUESTIONS, { size: 0 })).toEqual([]);
  });
});

describe('domainBreakdown', () => {
  it('tallies attempted and correct answers per domain', () => {
    const qs = QUESTIONS.slice(0, 4);
    const res = qs.map((q, i) => ({ questionId: q.id, correct: i < 3 }));
    expect(domainBreakdown(qs, res)).toEqual({ D1: { attempted: 4, correct: 3 } });
    expect(domainBreakdown(qs, [{ questionId: 'unknown', correct: true }])).toEqual({});
  });
});

describe('readiness', () => {
  it('refuses to estimate from a small set', () => {
    expect(readiness(100, 10).band).toBe('Not enough data');
  });
  it('maps score bands', () => {
    const b = (p: number) => readiness(p, 30).band;
    expect([b(0), b(49), b(50), b(69), b(70), b(84), b(85), b(100)]).toEqual(
      ['Needs Review', 'Needs Review', 'Developing', 'Developing', 'Nearly Ready', 'Nearly Ready', 'Strong', 'Strong'],
    );
  });
  it('never promises a pass', () => {
    for (const p of [10, 60, 80, 99]) expect(readiness(p, 40).message).not.toMatch(/pass|guarantee/i);
  });
});

describe('timing helpers', () => {
  it('computes exam length and formats durations', () => {
    expect(examSeconds(20)).toBe(20 * SECONDS_PER_QUESTION);
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(75)).toBe('1:15');
    expect(formatDuration(3599.6)).toBe('60:00');
    expect(formatDuration(-5)).toBe('0:00');
  });
});

describe('lessonBreakdown', () => {
  it('sorts lessons weakest first and counts each question once per lesson', () => {
    const a = QUESTIONS.filter((q) => q.lessonIds[0] === 'osi-model').slice(0, 2);
    const b = QUESTIONS.filter((q) => q.lessonIds[0] === 'vlsm').slice(0, 2);
    const res = [
      { questionId: a[0]!.id, correct: false }, { questionId: a[1]!.id, correct: true },
      { questionId: b[0]!.id, correct: true }, { questionId: b[1]!.id, correct: true },
    ];
    const out = lessonBreakdown([...a, ...b], res);
    expect(out[0]).toEqual({ lessonId: 'osi-model', seen: 2, correct: 1 });
    expect(out[1]).toEqual({ lessonId: 'vlsm', seen: 2, correct: 2 });
  });
});
