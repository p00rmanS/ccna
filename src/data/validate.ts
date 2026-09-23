import type { Flashcard, Lab, Lesson, Question, Section } from '../types';
import { CURRICULUM } from './curriculum';
import { COMMANDS, COMMAND_CATEGORIES } from './commands';
import { OBJECTIVES } from './domains';

export interface ContentData {
  lessons: Lesson[];
  questions: Question[];
  flashcards: Flashcard[];
  labs: Lab[];
}

/** Returns a list of human-readable problems. An empty list means the content is internally consistent. */
export function validateContent({ lessons, questions, flashcards, labs }: ContentData): string[] {
  const problems: string[] = [];
  const dup = (kind: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) problems.push(`Duplicate ${kind} id: ${id}`);
      seen.add(id);
    }
  };
  dup('lesson', lessons.map((l) => l.id));
  dup('question', questions.map((q) => q.id));
  dup('flashcard', flashcards.map((f) => f.id));
  dup('lab', labs.map((l) => l.id));
  dup('command', COMMANDS.map((c) => c.id));

  const lessonIds = new Set(lessons.map((l) => l.id));

  // Curriculum and lessons must agree.
  const published = CURRICULUM.flatMap((p) => p.modules.flatMap((m) => m.lessonIds));
  for (const id of published) if (!lessonIds.has(id)) problems.push(`Curriculum lists lesson "${id}" but no lesson data exists`);
  for (const id of lessonIds) if (!published.includes(id)) problems.push(`Lesson "${id}" is not placed in any curriculum module`);

  for (const l of lessons) {
    const where = `Lesson ${l.id}`;
    if (l.objectives.length < 3) problems.push(`${where}: fewer than 3 objectives`);
    if (l.whyMatters.trim().length < 40) problems.push(`${where}: whyMatters too short`);
    for (const code of l.examObjectives) if (!OBJECTIVES[code]) problems.push(`${where}: unknown exam objective ${code}`);
    const has = (t: Section['type']) => l.sections.some((s) => s.type === t);
    for (const required of ['explain', 'analogy', 'terms', 'flow', 'troubleshoot', 'challenge', 'summary'] as const) {
      if (!has(required)) problems.push(`${where}: missing "${required}" section`);
    }
    if (!has('diagram') && !has('interactive')) problems.push(`${where}: needs a diagram or interactive`);
    const hook = l.sections.find((s) => s.type === 'hook');
    if (!hook) problems.push(`${where}: missing the "Pro tip — madaling tandaan" hook`);
    else if (hook.type === 'hook' && (hook.taglish.length === 0 || !hook.test.question.trim() || !hook.test.answer.trim())) problems.push(`${where}: hook needs Taglish text and a self-test`);
    if (!flashcards.some((f) => f.id === `${l.id}-hook`)) problems.push(`${where}: missing hook flashcard "${l.id}-hook"`);
    if (!l.sections.some((s) => s.type === 'analogy' && (s.taglish?.length ?? 0) > 0)) problems.push(`${where}: analogy needs a Taglish version`);
    if (!l.sections.some((s) => s.type === 'callout' && s.kind === 'trap')) problems.push(`${where}: needs an exam-trap callout`);
    if (!l.sections.some((s) => s.type === 'list' && s.variant === 'tips')) problems.push(`${where}: needs exam tips`);
    if (!l.sections.some((s) => s.type === 'list' && s.variant === 'mistakes')) problems.push(`${where}: needs common mistakes`);
    for (const s of l.sections) {
      if (s.type === 'explain' && (!s.simple.length || !s.taglish.length || !s.technical.length)) problems.push(`${where}: explain section missing a style`);
      if (s.type === 'cli' && s.explain.length === 0) problems.push(`${where}: cli "${s.title}" has no explanations`);
    }
    if (questions.filter((q) => q.lessonIds.includes(l.id)).length < 5) problems.push(`${where}: fewer than 5 quiz questions`);
    if (flashcards.filter((f) => f.lessonId === l.id).length < 5) problems.push(`${where}: fewer than 5 flashcards`);
    if (!labs.some((lab) => lab.lessonId === l.id)) problems.push(`${where}: no lab`);
  }

  for (const q of questions) {
    const where = `Question ${q.id}`;
    if (q.choices.length < 2) problems.push(`${where}: needs at least two choices`);
    if (new Set(q.choices).size !== q.choices.length) problems.push(`${where}: duplicate choices`);
    if (q.correct.length === 0) problems.push(`${where}: no correct answer`);
    for (const c of q.correct) if (!Number.isInteger(c) || c < 0 || c >= q.choices.length) problems.push(`${where}: correct index ${c} out of range`);
    if (new Set(q.correct).size !== q.correct.length) problems.push(`${where}: repeated correct index`);
    if (q.type === 'single' && q.correct.length !== 1) problems.push(`${where}: single-choice must have exactly one answer`);
    if (q.type === 'single' && q.choices.length !== 4) problems.push(`${where}: single-choice should have four choices`);
    if (q.type === 'multiple' && q.correct.length < 2) problems.push(`${where}: multiple-response needs at least two answers`);
    if (q.type === 'multiple' && q.correct.length >= q.choices.length) problems.push(`${where}: every choice is correct`);
    if (q.type === 'true-false' && (q.choices.join('|') !== 'True|False' || q.correct.length !== 1)) problems.push(`${where}: malformed true/false`);
    if (!q.explanation.trim()) problems.push(`${where}: missing explanation`);
    if (!OBJECTIVES[q.objective]) problems.push(`${where}: unknown objective ${q.objective}`);
    if (q.lessonIds.length === 0) problems.push(`${where}: no related lesson`);
    for (const id of q.lessonIds) if (!lessonIds.has(id)) problems.push(`${where}: unknown lesson ${id}`);
    for (const [k, text] of Object.entries(q.wrong ?? {})) {
      const idx = Number(k);
      if (!Number.isInteger(idx) || idx < 0 || idx >= q.choices.length) problems.push(`${where}: wrong-answer note for invalid index ${k}`);
      if (q.correct.includes(idx)) problems.push(`${where}: wrong-answer note attached to a correct choice`);
      if (!text.trim()) problems.push(`${where}: empty wrong-answer note`);
    }
  }

  for (const f of flashcards) {
    if (!f.front.trim() || !f.back.trim()) problems.push(`Flashcard ${f.id}: empty side`);
    if (!lessonIds.has(f.lessonId)) problems.push(`Flashcard ${f.id}: unknown lesson ${f.lessonId}`);
  }

  for (const lab of labs) {
    const where = `Lab ${lab.id}`;
    if (!lessonIds.has(lab.lessonId)) problems.push(`${where}: unknown lesson`);
    if (lab.steps.length < 3) problems.push(`${where}: too few steps`);
    if (lab.checklist.length < 2) problems.push(`${where}: too few checklist items`);
    if (lab.hints.length < 1) problems.push(`${where}: needs a hint`);
    if (lab.solution.length < 1) problems.push(`${where}: needs a solution`);
  }

  for (const c of COMMANDS) {
    if (!(COMMAND_CATEGORIES as readonly string[]).includes(c.category)) problems.push(`Command ${c.id}: unknown category ${c.category}`);
    if (c.lessonId && !lessonIds.has(c.lessonId)) problems.push(`Command ${c.id}: unknown lesson ${c.lessonId}`);
    for (const field of ['purpose', 'syntax', 'mode', 'example', 'mistake'] as const) {
      if (!c[field].trim()) problems.push(`Command ${c.id}: empty ${field}`);
    }
  }

  return problems;
}
