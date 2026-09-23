/**
 * Pure application state: shape, defaults, defensive loading and the reducer.
 * Nothing here touches the DOM or localStorage, so it is fully unit-testable.
 */
import type { CardState, Grade } from '../utils/srs';
import { schedule } from '../utils/srs';
import type { QuestionResult } from '../utils/quiz';
import type { QuestionKind } from '../utils/subnet';
import { prefixBucket } from '../utils/subnet';

export const STATE_VERSION = 2;
export const MAX_ATTEMPTS = 200;
export const MAX_EXAMS = 50;

export type ThemeSetting = 'light' | 'dark' | 'system';
export type ExplainStyle = 'english' | 'simple' | 'taglish';

export interface Onboarding {
  experience: 'new' | 'some-it' | 'student' | 'professional';
  goal: 'learn' | 'pass' | 'school' | 'job';
  minutesPerDay: 30 | 60 | 90 | 120;
}

export interface Settings {
  theme: ThemeSetting;
  style: ExplainStyle;
  onboarding: Onboarding | null;
}

export interface QuizAttempt {
  quizId: string;
  at: number;
  correct: number;
  total: number;
  seconds: number;
  results: QuestionResult[];
}

export interface QuestionStat {
  seen: number;
  correct: number;
  lastCorrect: boolean;
  lastAt: number;
}

export interface ExamResult {
  at: number;
  label: string;
  total: number;
  correct: number;
  seconds: number;
  timed: boolean;
  /** Attempted/correct per exam domain id (D1…D6). */
  byDomain: Record<string, Tally>;
}

export interface Tally {
  attempted: number;
  correct: number;
}

export interface SubnettingStats {
  attempted: number;
  correct: number;
  totalSeconds: number;
  currentStreak: number;
  bestStreak: number;
  byKind: Partial<Record<QuestionKind, Tally>>;
  byBucket: Record<string, Tally>;
}

export interface AppState {
  version: number;
  settings: Settings;
  completedLessons: Record<string, number>;
  completedLabs: Record<string, number>;
  labChecks: Record<string, number[]>;
  labFiles: Record<string, string>;
  quizAttempts: QuizAttempt[];
  examHistory: ExamResult[];
  /** CLI practice tasks the learner has completed, by task id → completion time. */
  cliTasks: Record<string, number>;
  questionStats: Record<string, QuestionStat>;
  flashcards: Record<string, CardState>;
  subnetting: SubnettingStats;
  /** Local calendar days (YYYY-MM-DD) on which the learner did something. */
  studyDays: string[];
  notes: Record<string, string>;
  bookmarks: string[];
}

export const defaultState = (): AppState => ({
  version: STATE_VERSION,
  settings: { theme: 'system', style: 'taglish', onboarding: null },
  completedLessons: {},
  completedLabs: {},
  labChecks: {},
  labFiles: {},
  quizAttempts: [],
  examHistory: [],
  cliTasks: {},
  questionStats: {},
  flashcards: {},
  subnetting: { attempted: 0, correct: 0, totalSeconds: 0, currentStreak: 0, bestStreak: 0, byKind: {}, byBucket: {} },
  studyDays: [],
  notes: {},
  bookmarks: [],
});

// ---------------------------------------------------------------------------
// Defensive loading: anything malformed falls back to defaults for that field.
// ---------------------------------------------------------------------------

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const oneOf = <T extends string | number>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;

function recordOf<T>(v: unknown, guard: (x: unknown) => x is T): Record<string, T> {
  const out: Record<string, T> = {};
  if (!isRecord(v)) return out;
  for (const [k, x] of Object.entries(v)) if (guard(x)) out[k] = x;
  return out;
}

const isCardState = (x: unknown): x is CardState =>
  isRecord(x) && isNum(x.reps) && isNum(x.ease) && isNum(x.intervalDays) && isNum(x.due) && isNum(x.lapses) && isNum(x.last);
const isQuestionStat = (x: unknown): x is QuestionStat =>
  isRecord(x) && isNum(x.seen) && isNum(x.correct) && typeof x.lastCorrect === 'boolean' && isNum(x.lastAt);
const isTally = (x: unknown): x is Tally => isRecord(x) && isNum(x.attempted) && isNum(x.correct);
const isString = (x: unknown): x is string => typeof x === 'string';
const isNumArray = (x: unknown): x is number[] => Array.isArray(x) && x.every(isNum);
const isExam = (x: unknown): x is ExamResult =>
  isRecord(x) && isNum(x.at) && isString(x.label) && isNum(x.total) && isNum(x.correct) && isNum(x.seconds) && typeof x.timed === 'boolean' &&
  isRecord(x.byDomain) && Object.values(x.byDomain).every(isTally);
const isAttempt = (x: unknown): x is QuizAttempt =>
  isRecord(x) && isString(x.quizId) && isNum(x.at) && isNum(x.correct) && isNum(x.total) && isNum(x.seconds) &&
  Array.isArray(x.results) && x.results.every((r) => isRecord(r) && isString(r.questionId) && typeof r.correct === 'boolean');

/** Turns arbitrary parsed JSON into a valid AppState. Never throws. */
export function sanitizeState(raw: unknown): AppState {
  const base = defaultState();
  if (!isRecord(raw)) return base;

  const s = isRecord(raw.settings) ? raw.settings : {};
  const ob = isRecord(s.onboarding) ? s.onboarding : null;
  const onboarding: Onboarding | null = ob
    ? {
        experience: oneOf(ob.experience, ['new', 'some-it', 'student', 'professional'] as const, 'new'),
        goal: oneOf(ob.goal, ['learn', 'pass', 'school', 'job'] as const, 'pass'),
        minutesPerDay: oneOf(ob.minutesPerDay as 30 | 60 | 90 | 120, [30, 60, 90, 120] as const, 60),
      }
    : null;

  const sub = isRecord(raw.subnetting) ? raw.subnetting : {};
  // Version 1 assigned 'simple' as a default rather than a choice; Taglish is now the default explanation style.
  const savedVersion = isNum(raw.version) ? raw.version : 1;
  const style = savedVersion < 2 ? 'taglish' : oneOf(s.style, ['english', 'simple', 'taglish'] as const, 'taglish');
  return {
    version: STATE_VERSION,
    settings: {
      theme: oneOf(s.theme, ['light', 'dark', 'system'] as const, 'system'),
      style,
      onboarding,
    },
    completedLessons: recordOf(raw.completedLessons, isNum),
    completedLabs: recordOf(raw.completedLabs, isNum),
    labChecks: recordOf(raw.labChecks, isNumArray),
    labFiles: recordOf(raw.labFiles, isString),
    quizAttempts: Array.isArray(raw.quizAttempts) ? raw.quizAttempts.filter(isAttempt).slice(-MAX_ATTEMPTS) : [],
    examHistory: Array.isArray(raw.examHistory) ? raw.examHistory.filter(isExam).slice(-MAX_EXAMS) : [],
    cliTasks: recordOf(raw.cliTasks, isNum),
    questionStats: recordOf(raw.questionStats, isQuestionStat),
    flashcards: recordOf(raw.flashcards, isCardState),
    subnetting: {
      attempted: isNum(sub.attempted) ? sub.attempted : 0,
      correct: isNum(sub.correct) ? sub.correct : 0,
      totalSeconds: isNum(sub.totalSeconds) ? sub.totalSeconds : 0,
      currentStreak: isNum(sub.currentStreak) ? sub.currentStreak : 0,
      bestStreak: isNum(sub.bestStreak) ? sub.bestStreak : 0,
      byKind: recordOf(sub.byKind, isTally) as SubnettingStats['byKind'],
      byBucket: recordOf(sub.byBucket, isTally),
    },
    studyDays: Array.isArray(raw.studyDays) ? [...new Set(raw.studyDays.filter((d): d is string => isString(d) && /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort() : [],
    notes: recordOf(raw.notes, isString),
    bookmarks: Array.isArray(raw.bookmarks) ? [...new Set(raw.bookmarks.filter(isString))] : [],
  };
}

// ---------------------------------------------------------------------------
// Dates and streaks
// ---------------------------------------------------------------------------

export function dayKey(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dayNumber(key: string): number {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

export interface Streaks {
  current: number;
  longest: number;
}

/** A streak survives until the end of "tomorrow": studying yesterday still counts as current today. */
export function computeStreaks(days: readonly string[], today: string): Streaks {
  const nums = [...new Set(days.map(dayNumber))].sort((a, b) => a - b);
  if (nums.length === 0) return { current: 0, longest: 0 };
  let longest = 1;
  let run = 1;
  for (let i = 1; i < nums.length; i++) {
    run = nums[i]! - nums[i - 1]! === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  const last = nums[nums.length - 1]!;
  const gap = dayNumber(today) - last;
  return { current: gap <= 1 ? run : 0, longest };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export type Action =
  | { type: 'completeLesson'; id: string }
  | { type: 'uncompleteLesson'; id: string }
  | { type: 'completeLab'; id: string }
  | { type: 'uncompleteLab'; id: string }
  | { type: 'toggleLabCheck'; labId: string; index: number }
  | { type: 'resetLab'; id: string }
  | { type: 'setLabFile'; id: string; file: string }
  | { type: 'recordQuiz'; quizId: string; results: QuestionResult[]; seconds: number }
  | { type: 'recordExam'; label: string; results: QuestionResult[]; byDomain: Record<string, Tally>; seconds: number; timed: boolean }
  | { type: 'completeCliTask'; id: string }
  | { type: 'gradeCard'; cardId: string; grade: Grade }
  | { type: 'recordSubnetting'; kind: QuestionKind; prefix: number; correct: boolean; seconds: number }
  | { type: 'setNote'; lessonId: string; text: string }
  | { type: 'toggleBookmark'; key: string }
  | { type: 'setSettings'; settings: Partial<Settings> }
  | { type: 'import'; state: unknown }
  | { type: 'reset' };

function withToday(state: AppState, now: number): AppState {
  const key = dayKey(now);
  return state.studyDays.includes(key) ? state : { ...state, studyDays: [...state.studyDays, key].sort() };
}

const bump = (t: Tally | undefined, correct: boolean): Tally => ({
  attempted: (t?.attempted ?? 0) + 1,
  correct: (t?.correct ?? 0) + (correct ? 1 : 0),
});

export function reduce(state: AppState, action: Action, now: number): AppState {
  switch (action.type) {
    case 'completeLesson':
      if (state.completedLessons[action.id]) return state;
      return withToday({ ...state, completedLessons: { ...state.completedLessons, [action.id]: now } }, now);
    case 'uncompleteLesson': {
      const { [action.id]: _removed, ...rest } = state.completedLessons;
      return { ...state, completedLessons: rest };
    }
    case 'completeLab':
      if (state.completedLabs[action.id]) return state;
      return withToday({ ...state, completedLabs: { ...state.completedLabs, [action.id]: now } }, now);
    case 'uncompleteLab': {
      const { [action.id]: _removed, ...rest } = state.completedLabs;
      return { ...state, completedLabs: rest };
    }
    case 'toggleLabCheck': {
      const current = state.labChecks[action.labId] ?? [];
      const next = current.includes(action.index) ? current.filter((i) => i !== action.index) : [...current, action.index].sort((a, b) => a - b);
      return withToday({ ...state, labChecks: { ...state.labChecks, [action.labId]: next } }, now);
    }
    case 'resetLab': {
      const { [action.id]: _c, ...checks } = state.labChecks;
      const { [action.id]: _d, ...done } = state.completedLabs;
      return { ...state, labChecks: checks, completedLabs: done };
    }
    case 'setLabFile':
      return { ...state, labFiles: { ...state.labFiles, [action.id]: action.file } };
    case 'recordQuiz': {
      const stats = { ...state.questionStats };
      for (const r of action.results) {
        const prev = stats[r.questionId];
        stats[r.questionId] = { seen: (prev?.seen ?? 0) + 1, correct: (prev?.correct ?? 0) + (r.correct ? 1 : 0), lastCorrect: r.correct, lastAt: now };
      }
      const attempt: QuizAttempt = {
        quizId: action.quizId, at: now, seconds: action.seconds, results: action.results,
        correct: action.results.filter((r) => r.correct).length, total: action.results.length,
      };
      return withToday({ ...state, questionStats: stats, quizAttempts: [...state.quizAttempts, attempt].slice(-MAX_ATTEMPTS) }, now);
    }
    case 'recordExam': {
      const stats = { ...state.questionStats };
      for (const r of action.results) {
        const prev = stats[r.questionId];
        stats[r.questionId] = { seen: (prev?.seen ?? 0) + 1, correct: (prev?.correct ?? 0) + (r.correct ? 1 : 0), lastCorrect: r.correct, lastAt: now };
      }
      const exam: ExamResult = {
        at: now, label: action.label, total: action.results.length, correct: action.results.filter((r) => r.correct).length,
        seconds: action.seconds, timed: action.timed, byDomain: action.byDomain,
      };
      return withToday({ ...state, questionStats: stats, examHistory: [...state.examHistory, exam].slice(-MAX_EXAMS) }, now);
    }
    case 'completeCliTask':
      if (state.cliTasks[action.id]) return state;
      return withToday({ ...state, cliTasks: { ...state.cliTasks, [action.id]: now } }, now);
    case 'gradeCard':
      return withToday({ ...state, flashcards: { ...state.flashcards, [action.cardId]: schedule(state.flashcards[action.cardId], action.grade, now) } }, now);
    case 'recordSubnetting': {
      const s = state.subnetting;
      const streak = action.correct ? s.currentStreak + 1 : 0;
      const bucket = prefixBucket(action.prefix);
      return withToday({
        ...state,
        subnetting: {
          attempted: s.attempted + 1,
          correct: s.correct + (action.correct ? 1 : 0),
          totalSeconds: s.totalSeconds + Math.max(0, action.seconds),
          currentStreak: streak,
          bestStreak: Math.max(s.bestStreak, streak),
          byKind: { ...s.byKind, [action.kind]: bump(s.byKind[action.kind], action.correct) },
          byBucket: { ...s.byBucket, [bucket]: bump(s.byBucket[bucket], action.correct) },
        },
      }, now);
    }
    case 'setNote': {
      const notes = { ...state.notes };
      if (action.text.trim() === '') delete notes[action.lessonId];
      else notes[action.lessonId] = action.text;
      return { ...state, notes };
    }
    case 'toggleBookmark':
      return { ...state, bookmarks: state.bookmarks.includes(action.key) ? state.bookmarks.filter((b) => b !== action.key) : [...state.bookmarks, action.key] };
    case 'setSettings':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'import':
      return sanitizeState(action.state);
    case 'reset':
      return defaultState();
  }
}

// ---------------------------------------------------------------------------
// Derived data
// ---------------------------------------------------------------------------

export interface TopicAccuracy {
  lessonId: string;
  seen: number;
  correct: number;
  accuracy: number;
}

/** Accuracy per lesson from the questions related to it. A topic is "weak" below 70% after at least 3 answers. */
export function topicAccuracy(
  state: AppState,
  questions: ReadonlyArray<{ id: string; lessonIds: string[] }>,
): TopicAccuracy[] {
  const byLesson = new Map<string, { seen: number; correct: number }>();
  for (const q of questions) {
    const stat = state.questionStats[q.id];
    if (!stat) continue;
    for (const lessonId of q.lessonIds) {
      const cur = byLesson.get(lessonId) ?? { seen: 0, correct: 0 };
      cur.seen += stat.seen;
      cur.correct += stat.correct;
      byLesson.set(lessonId, cur);
    }
  }
  return [...byLesson.entries()]
    .map(([lessonId, v]) => ({ lessonId, seen: v.seen, correct: v.correct, accuracy: v.seen ? v.correct / v.seen : 0 }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

export const WEAK_THRESHOLD = 0.7;
export const WEAK_MIN_SEEN = 3;

export const weakTopics = (acc: TopicAccuracy[]) => acc.filter((a) => a.seen >= WEAK_MIN_SEEN && a.accuracy < WEAK_THRESHOLD);
export const strongTopics = (acc: TopicAccuracy[]) => [...acc].reverse().filter((a) => a.seen >= WEAK_MIN_SEEN && a.accuracy >= 0.9);

/** Question ids whose most recent answer was wrong. */
export const missedQuestionIds = (state: AppState): string[] =>
  Object.entries(state.questionStats).filter(([, s]) => !s.lastCorrect).map(([id]) => id);
