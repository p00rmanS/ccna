import { describe, expect, it } from 'vitest';
import type { Question } from '../types';
import { choiceOrder, isCorrect, pickMixed, scoreQuiz, shuffle } from './quiz';
import { mulberry32 } from './subnet';

const base = { lessonIds: ['x'], domain: 'D1' as const, objective: '1.1', difficulty: 'easy' as const, explanation: '' };
const single: Question = { ...base, id: 's', type: 'single', prompt: 'p', choices: ['a', 'b', 'c'], correct: [1] };
const multi: Question = { ...base, id: 'm', type: 'multiple', prompt: 'p', choices: ['a', 'b', 'c', 'd'], correct: [0, 2] };
const tf: Question = { ...base, id: 't', type: 'true-false', prompt: 'p', choices: ['True', 'False'], correct: [1] };

describe('isCorrect', () => {
  it('scores single-choice questions', () => {
    expect(isCorrect(single, [1])).toBe(true);
    expect(isCorrect(single, [0])).toBe(false);
    expect(isCorrect(single, [])).toBe(false);
  });
  it('requires the exact set for multiple response', () => {
    expect(isCorrect(multi, [0, 2])).toBe(true);
    expect(isCorrect(multi, [2, 0])).toBe(true);
    expect(isCorrect(multi, [0])).toBe(false);
    expect(isCorrect(multi, [0, 1, 2])).toBe(false);
    expect(isCorrect(multi, [0, 3])).toBe(false);
  });
  it('scores true/false', () => {
    expect(isCorrect(tf, [1])).toBe(true);
    expect(isCorrect(tf, [0])).toBe(false);
  });
});

describe('scoreQuiz', () => {
  it('counts correct answers and treats unanswered as wrong', () => {
    const score = scoreQuiz([single, multi, tf], { s: [1], m: [0, 2] });
    expect(score.correct).toBe(2);
    expect(score.total).toBe(3);
    expect(score.percent).toBe(67);
    expect(score.results.map((r) => r.correct)).toEqual([true, true, false]);
  });
  it('handles an empty quiz', () => {
    expect(scoreQuiz([], {})).toEqual({ correct: 0, total: 0, percent: 0, results: [] });
  });
});

describe('shuffling', () => {
  it('keeps every element and does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const out = shuffle(input, mulberry32(3));
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it('keeps true/false order and permutes other types', () => {
    expect(choiceOrder(tf, mulberry32(1))).toEqual([0, 1]);
    expect([...choiceOrder(multi, mulberry32(1))].sort()).toEqual([0, 1, 2, 3]);
  });
  it('picks at most the requested number of distinct questions', () => {
    const picked = pickMixed([single, multi, tf], 2, mulberry32(4));
    expect(picked).toHaveLength(2);
    expect(new Set(picked.map((q) => q.id)).size).toBe(2);
  });
});
