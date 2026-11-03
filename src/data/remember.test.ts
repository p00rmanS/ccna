import { describe, it, expect } from 'vitest';
import { LESSONS } from './index';
import { REMEMBER } from './remember';

describe('remember cards', () => {
  it('every key matches a lesson and every lesson has a card', () => {
    const ids = new Set(LESSONS.map((l) => l.id));
    expect(Object.keys(REMEMBER).filter((k) => !ids.has(k))).toEqual([]);
    expect(LESSONS.filter((l) => !l.sections.some((s) => s.type === 'remember')).map((l) => l.id)).toEqual([]);
  });
});
