import type { Lesson, Question } from '../../types';
import { PART1 } from './part1';
import { PART2 } from './part2';
import { PART3 } from './part3';
import { PART4 } from './part4';
import { PART5 } from './part5';

/**
 * Taglish translations of the lesson content that is English by default. Entries are positional, in the order the
 * items appear in the lesson: key terms, CLI line explanations, verify rows (each across all sections of that kind),
 * then quiz explanations in question order. Commands, output and technical terms stay in English on purpose.
 */
export interface TaglishOverlay {
  terms: string[];
  cli: string[];
  verify: string[];
  questions: string[];
}

export const TAGLISH: Record<string, TaglishOverlay> = { ...PART1, ...PART2, ...PART3, ...PART4, ...PART5 };

/** Mismatches between the overlay and the lesson content; the data validation test requires this to be empty. */
export const TAGLISH_PROBLEMS: string[] = [];

export function applyTaglish(lesson: Lesson, questions: Question[]): void {
  const o = TAGLISH[lesson.id];
  if (!o) { TAGLISH_PROBLEMS.push(`${lesson.id}: no Taglish overlay`); return; }
  let t = 0, c = 0, v = 0;
  for (const s of lesson.sections) {
    if (s.type === 'terms') for (const item of s.items) item.taglish = o.terms[t++];
    if (s.type === 'cli') for (const item of s.explain) item.taglish = o.cli[c++];
    if (s.type === 'verify') for (const item of s.items) item.taglish = o.verify[v++];
  }
  const qs = questions.filter((q) => q.lessonIds[0] === lesson.id);
  qs.forEach((q, i) => { q.explanationTl = o.questions[i]; });
  if (t !== o.terms.length) TAGLISH_PROBLEMS.push(`${lesson.id}: ${t} terms but ${o.terms.length} translations`);
  if (c !== o.cli.length) TAGLISH_PROBLEMS.push(`${lesson.id}: ${c} cli lines but ${o.cli.length} translations`);
  if (v !== o.verify.length) TAGLISH_PROBLEMS.push(`${lesson.id}: ${v} verify rows but ${o.verify.length} translations`);
  if (qs.length !== o.questions.length) TAGLISH_PROBLEMS.push(`${lesson.id}: ${qs.length} questions but ${o.questions.length} translations`);
}
