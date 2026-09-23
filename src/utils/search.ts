import type { CommandCard, Flashcard, Lab, Lesson, PhaseOutline, Question } from '../types';

export type SearchKind = 'Lesson' | 'Term' | 'Command' | 'Lab' | 'Flashcard' | 'Question' | 'Planned module';

export interface SearchDoc {
  id: string;
  kind: SearchKind;
  title: string;
  /** Extra searchable text (keywords, definitions, answers…). */
  text: string;
  to: string;
  context?: string;
}

export interface SearchSources {
  lessons: readonly Lesson[];
  commands: readonly CommandCard[];
  labs: readonly Lab[];
  flashcards: readonly Flashcard[];
  questions: readonly Question[];
  curriculum: readonly PhaseOutline[];
}

const plain = (s: string) => s.replace(/[`*]/g, '');

export function buildIndex(src: SearchSources): SearchDoc[] {
  const docs: SearchDoc[] = [];
  const lessonTitle = new Map(src.lessons.map((l) => [l.id, l.title]));

  for (const l of src.lessons) {
    const hook = l.sections.find((s) => s.type === 'hook');
    docs.push({
      id: `lesson:${l.id}`, kind: 'Lesson', title: l.title, to: `/learn/${l.id}`,
      text: plain([l.description, l.whyMatters, l.keywords.join(' '), l.objectives.join(' '), hook && hook.type === 'hook' ? `${hook.title} ${hook.trick}` : ''].join(' ')),
    });
    for (const s of l.sections) {
      if (s.type !== 'terms') continue;
      for (const t of s.items) {
        docs.push({ id: `term:${l.id}:${t.term}`, kind: 'Term', title: t.term, text: plain(t.definition), to: `/learn/${l.id}`, context: l.title });
      }
    }
  }
  for (const c of src.commands) {
    docs.push({ id: `cmd:${c.id}`, kind: 'Command', title: c.command, text: plain(`${c.purpose} ${c.syntax} ${c.category} ${c.mistake}`), to: '/commands', context: c.category });
  }
  for (const lab of src.labs) {
    docs.push({ id: `lab:${lab.id}`, kind: 'Lab', title: lab.title, text: plain(`${lab.objective} ${lab.tool}`), to: `/labs/${lab.id}`, context: lab.tool });
  }
  for (const f of src.flashcards) {
    docs.push({ id: `card:${f.id}`, kind: 'Flashcard', title: f.front, text: plain(f.back), to: `/flashcards?lesson=${f.lessonId}`, context: lessonTitle.get(f.lessonId) });
  }
  for (const q of src.questions) {
    docs.push({ id: `q:${q.id}`, kind: 'Question', title: q.prompt, text: plain(q.explanation), to: `/learn/${q.lessonIds[0]}`, context: lessonTitle.get(q.lessonIds[0]!) });
  }
  for (const phase of src.curriculum) {
    for (const m of phase.modules) {
      if (m.lessonIds.length > 0) continue;
      docs.push({ id: `mod:${m.id}`, kind: 'Planned module', title: `Module ${m.id} — ${m.title}`, text: `${m.topics.join(' ')} ${m.note ?? ''}`, to: '/learn', context: 'On the roadmap, not published yet' });
    }
  }
  return docs;
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
}

const KIND_WEIGHT: Record<SearchKind, number> = { Lesson: 10, Term: 4, Command: 4, Lab: 3, Flashcard: 1, Question: 0, 'Planned module': 1 };

export const tokenize = (query: string): string[] => query.toLowerCase().split(/[^a-z0-9/.+\-:]+/).filter((t) => t.length > 0);

/** Every word must match somewhere; title matches rank above body matches. */
export function search(index: readonly SearchDoc[], query: string, limit = 60): SearchHit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const hits: SearchHit[] = [];
  for (const doc of index) {
    const title = doc.title.toLowerCase();
    const text = doc.text.toLowerCase();
    let score = KIND_WEIGHT[doc.kind];
    let ok = true;
    for (const t of tokens) {
      if (title === t) score += 12;
      else if (title.startsWith(t)) score += 8;
      else if (title.includes(t)) score += 5;
      else if (text.includes(t)) score += 1;
      else { ok = false; break; }
    }
    if (ok) hits.push({ doc, score });
  }
  return hits.sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title)).slice(0, limit);
}

/** A short excerpt of `text` around the first matching word. */
export function snippet(text: string, query: string, width = 150): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  const lower = clean.toLowerCase();
  const pos = tokenize(query).map((t) => lower.indexOf(t)).filter((p) => p >= 0).sort((a, b) => a - b)[0];
  if (pos === undefined || clean.length <= width) return clean.slice(0, width) + (clean.length > width ? '…' : '');
  const start = Math.max(0, pos - Math.floor(width / 3));
  return `${start > 0 ? '…' : ''}${clean.slice(start, start + width)}${start + width < clean.length ? '…' : ''}`;
}
