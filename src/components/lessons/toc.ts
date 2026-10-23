import type { Lesson, Section } from '../../types';

export interface TocEntry {
  /** DOM id of the section wrapper. */
  anchor: string;
  label: string;
}

export const sectionAnchor = (index: number): string => `s-${index}`;

function labelOf(s: Section): string | null {
  switch (s.type) {
    case 'explain': return 'Understand it';
    case 'story': return `Kuwento: ${s.title}`;
    case 'analogy': return 'Analogy';
    case 'hook': return 'Pro tip — madaling tandaan';
    case 'interactive': return 'Try it';
    case 'terms': return 'Key terminology';
    case 'flow': return s.title;
    case 'cli': return s.title;
    case 'verify': return s.title;
    case 'list': return s.title;
    case 'troubleshoot': return s.title;
    case 'challenge': return s.title;
    case 'summary': return 'Summary';
    default: return null; // diagrams and callouts are not worth a table-of-contents line
  }
}

/** The lesson's outline, in reading order, ending with the practice block. */
export function tocEntries(lesson: Lesson): TocEntry[] {
  const entries: TocEntry[] = [];
  lesson.sections.forEach((s, i) => {
    const label = labelOf(s);
    if (label) entries.push({ anchor: sectionAnchor(i), label });
  });
  entries.push({ anchor: 'practice-h', label: 'Practise it' });
  return entries;
}
