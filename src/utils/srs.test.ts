import { describe, expect, it } from 'vitest';
import { isDue, previewLabel, schedule } from './srs';

const NOW = 1_700_000_000_000;
const DAY = 86_400_000;

describe('schedule', () => {
  it('treats a new card as due', () => {
    expect(isDue(undefined, NOW)).toBe(true);
  });
  it('grows the interval on repeated Good answers: 1, 6, then ease-scaled', () => {
    let s = schedule(undefined, 'good', NOW);
    expect(s.intervalDays).toBe(1);
    expect(s.due).toBe(NOW + DAY);
    s = schedule(s, 'good', NOW + DAY);
    expect(s.intervalDays).toBe(6);
    s = schedule(s, 'good', NOW + 7 * DAY);
    expect(s.intervalDays).toBe(15); // 6 * 2.5
    expect(s.reps).toBe(3);
  });
  it('Again resets progress, counts a lapse and returns the card within the session', () => {
    let s = schedule(undefined, 'good', NOW);
    s = schedule(s, 'good', NOW);
    const failed = schedule(s, 'again', NOW);
    expect(failed.reps).toBe(0);
    expect(failed.lapses).toBe(1);
    expect(failed.due).toBe(NOW + 10 * 60_000);
    expect(failed.ease).toBeLessThan(s.ease);
  });
  it('never lets ease fall below 1.3', () => {
    let s = schedule(undefined, 'good', NOW);
    for (let i = 0; i < 30; i++) s = schedule(s, 'again', NOW);
    expect(s.ease).toBeGreaterThanOrEqual(1.3);
    for (let i = 0; i < 30; i++) s = schedule(s, 'hard', NOW);
    expect(s.ease).toBeGreaterThanOrEqual(1.3);
  });
  it('Easy rewards more than Good, Hard less', () => {
    const base = schedule(schedule(undefined, 'good', NOW), 'good', NOW);
    const hard = schedule(base, 'hard', NOW).intervalDays;
    const good = schedule(base, 'good', NOW).intervalDays;
    const easy = schedule(base, 'easy', NOW).intervalDays;
    expect(hard).toBeLessThan(good);
    expect(good).toBeLessThan(easy);
  });
  it('detects due cards', () => {
    const s = schedule(undefined, 'good', NOW);
    expect(isDue(s, NOW)).toBe(false);
    expect(isDue(s, NOW + DAY)).toBe(true);
  });
  it('previews intervals for the buttons', () => {
    expect(previewLabel(undefined, 'again', NOW)).toBe('10 min');
    expect(previewLabel(undefined, 'good', NOW)).toBe('1 d');
    expect(previewLabel(undefined, 'easy', NOW)).toBe('4 d');
  });
});
