import type { Flashcard, Lab, LabTaglish, Lesson, Question } from '../../types';
import { PART1 } from './part1';
import { PART2 } from './part2';
import { PART3 } from './part3';
import { PART4 } from './part4';
import { PART5 } from './part5';
import { PART6 } from './part6';
import { EXTRA1 } from './extra1';
import { EXTRA2 } from './extra2';
import { EXTRA3 } from './extra3';
import { EXTRA4 } from './extra4';
import { EXTRA5 } from './extra5';
import { EXTRA6 } from './extra6';
import { EXTRA7 } from './extra7';
import { BATCH_A } from './batchA';
import { BATCH_B } from './batchB';
import { BATCH_C } from './batchC';
import { BATCH_D } from './batchD';
import { BATCH_E } from './batchE';
import { BATCH_F } from './batchF';
import { BATCH_G } from './batchG';
import { BATCH_H } from './batchH';
import { BATCH_I } from './batchI';

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

/** Taglish for flashcard answers (every card except the Pro tip hook, in order), the lab text and the wrong-answer notes. */
export interface TaglishExtra {
  cards: string[];
  lab: LabTaglish;
  /** One entry per question, in order: the Taglish note for each wrong choice index. */
  wrong: Array<Record<number, string>>;
}

export const TAGLISH: Record<string, TaglishOverlay> = { ...PART1, ...PART2, ...PART3, ...PART4, ...PART5, ...PART6, ...BATCH_A.basic, ...BATCH_B.basic, ...BATCH_C.basic, ...BATCH_D.basic, ...BATCH_E.basic, ...BATCH_F.basic, ...BATCH_G.basic, ...BATCH_H.basic, ...BATCH_I.basic };

/** Mismatches between the overlay and the lesson content; the data validation test requires this to be empty. */
export const TAGLISH_EXTRA: Record<string, TaglishExtra> = { ...EXTRA1, ...EXTRA2, ...EXTRA3, ...EXTRA4, ...EXTRA5, ...EXTRA6, ...EXTRA7, ...BATCH_A.extra, ...BATCH_B.extra, ...BATCH_C.extra, ...BATCH_D.extra, ...BATCH_E.extra, ...BATCH_F.extra, ...BATCH_G.extra, ...BATCH_H.extra, ...BATCH_I.extra };

export const TAGLISH_PROBLEMS: string[] = [];

export function applyTaglish(lesson: Lesson, questions: Question[], flashcards: Flashcard[], lab: Lab | undefined): void {
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
  applyExtra(lesson, qs, flashcards, lab);
}

function applyExtra(lesson: Lesson, qs: Question[], flashcards: Flashcard[], lab: Lab | undefined): void {
  const x = TAGLISH_EXTRA[lesson.id];
  if (!x) { TAGLISH_PROBLEMS.push(`${lesson.id}: no Taglish extras (cards, lab, wrong notes)`); return; }
  const cards = flashcards.filter((f) => f.lessonId === lesson.id && !f.id.endsWith('-hook'));
  cards.forEach((f, i) => { f.backTl = x.cards[i]; });
  if (cards.length !== x.cards.length) TAGLISH_PROBLEMS.push(`${lesson.id}: ${cards.length} flashcards but ${x.cards.length} translations`);
  if (lab) {
    lab.tl = x.lab;
    const same = (a: unknown[], b: unknown[]) => a.length === b.length;
    if (!same(lab.steps, x.lab.steps) || !same(lab.checklist, x.lab.checklist) || !same(lab.hints, x.lab.hints) || !same(lab.solution, x.lab.solution)) TAGLISH_PROBLEMS.push(`${lesson.id}: lab Taglish lists do not match the English lists`);
    if (Boolean(lab.breakIt) !== Boolean(x.lab.breakIt)) TAGLISH_PROBLEMS.push(`${lesson.id}: lab breakIt Taglish mismatch`);
  }
  qs.forEach((q, i) => {
    const wrong = x.wrong[i] ?? {};
    q.wrongTl = wrong;
    for (const k of Object.keys(q.wrong ?? {})) if (!wrong[Number(k)]) TAGLISH_PROBLEMS.push(`${q.id}: wrong-answer note ${k} has no Taglish`);
  });
  if (qs.length !== x.wrong.length) TAGLISH_PROBLEMS.push(`${lesson.id}: ${qs.length} questions but ${x.wrong.length} wrong-note entries`);
}
