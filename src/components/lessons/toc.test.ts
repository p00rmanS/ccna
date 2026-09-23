import { describe, expect, it } from 'vitest';
import { LESSONS } from '../../data';
import { sectionAnchor, tocEntries } from './toc';

describe('tocEntries', () => {
  it('gives every lesson an outline that starts with the explanation and ends with practice', () => {
    for (const l of LESSONS) {
      const toc = tocEntries(l);
      expect(toc.length, l.id).toBeGreaterThanOrEqual(8);
      expect(toc[0]!.label).toBe('Understand it');
      expect(toc[toc.length - 1]).toEqual({ anchor: 'practice-h', label: 'Practise it' });
      expect(new Set(toc.map((t) => t.anchor)).size).toBe(toc.length);
    }
  });
  it('points anchors at the real section indexes', () => {
    const l = LESSONS[0]!;
    const explainIndex = l.sections.findIndex((s) => s.type === 'explain');
    expect(tocEntries(l)[0]!.anchor).toBe(sectionAnchor(explainIndex));
  });
  it('includes the pro-tip hook in every lesson', () => {
    for (const l of LESSONS) expect(tocEntries(l).some((t) => t.label.startsWith('Pro tip')), l.id).toBe(true);
  });
});
