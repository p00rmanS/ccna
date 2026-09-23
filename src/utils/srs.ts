/** Spaced repetition based on SM-2 with four grades (Again / Hard / Good / Easy). */

export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface CardState {
  reps: number;
  ease: number;
  intervalDays: number;
  /** Epoch ms when the card is next due. */
  due: number;
  lapses: number;
  last: number;
}

const MINUTE = 60_000;
const DAY = 86_400_000;
const MIN_EASE = 1.3;
const GRADE_QUALITY: Record<Exclude<Grade, 'again'>, number> = { hard: 3, good: 4, easy: 5 };

export function schedule(prev: CardState | undefined, grade: Grade, now: number): CardState {
  const s: CardState = prev ?? { reps: 0, ease: 2.5, intervalDays: 0, due: now, lapses: 0, last: now };
  if (grade === 'again') {
    return { reps: 0, ease: Math.max(MIN_EASE, s.ease - 0.2), intervalDays: 0, due: now + 10 * MINUTE, lapses: s.lapses + 1, last: now };
  }
  const q = GRADE_QUALITY[grade];
  const ease = Math.max(MIN_EASE, s.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  let interval: number;
  if (s.reps === 0) interval = grade === 'easy' ? 4 : 1;
  else if (s.reps === 1) interval = grade === 'hard' ? 3 : grade === 'good' ? 6 : 8;
  else interval = s.intervalDays * (grade === 'hard' ? 1.2 : grade === 'good' ? ease : ease * 1.3);
  interval = Math.max(1, Math.round(interval));
  return { reps: s.reps + 1, ease, intervalDays: interval, due: now + interval * DAY, lapses: s.lapses, last: now };
}

export function isDue(card: CardState | undefined, now: number): boolean {
  return !card || card.due <= now;
}

/** Human label for the button under each grade, e.g. "10 min" or "6 d". */
export function previewLabel(prev: CardState | undefined, grade: Grade, now: number): string {
  const next = schedule(prev, grade, now);
  if (grade === 'again') return '10 min';
  return `${next.intervalDays} d`;
}
