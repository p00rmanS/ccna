import { describe, expect, it } from 'vitest';
import { COMMANDS } from '../data/commands';
import { CURRICULUM } from '../data/curriculum';
import { FLASHCARDS, LABS, LESSONS, QUESTIONS } from '../data';
import { buildIndex, search, snippet, tokenize } from './search';

const index = buildIndex({ lessons: LESSONS, commands: COMMANDS, labs: LABS, flashcards: FLASHCARDS, questions: QUESTIONS, curriculum: CURRICULUM });

describe('index', () => {
  it('contains every kind of content with unique ids', () => {
    expect(new Set(index.map((d) => d.id)).size).toBe(index.length);
    const kinds = new Set(index.map((d) => d.kind));
    for (const k of ['Lesson', 'Term', 'Command', 'Lab', 'Flashcard', 'Question', 'Planned module']) expect(kinds.has(k as never)).toBe(true);
    expect(index.filter((d) => d.kind === 'Lesson')).toHaveLength(LESSONS.length);
  });
});

describe('search', () => {
  it('ranks a lesson whose title matches above incidental mentions', () => {
    const hits = search(index, 'vlsm');
    expect(hits[0]!.doc.to).toBe('/learn/vlsm');
    expect(hits[0]!.doc.kind).toBe('Lesson');
  });
  it('finds commands by name and by purpose', () => {
    expect(search(index, 'show ip interface brief').some((h) => h.doc.kind === 'Command')).toBe(true);
    expect(search(index, 'hashed privileged password').some((h) => h.doc.id === 'cmd:enable-secret')).toBe(true);
  });
  it('requires every word to match', () => {
    expect(search(index, 'switch zzzznotaword')).toEqual([]);
    expect(search(index, '')).toEqual([]);
    expect(search(index, '   ')).toEqual([]);
  });
  it('finds glossary terms and points at the lesson that defines them', () => {
    const hit = search(index, 'OUI').find((h) => h.doc.kind === 'Term');
    expect(hit?.doc.to).toBe('/learn/mac-addresses');
  });
  it('is case-insensitive and finds Taglish memory tricks', () => {
    expect(search(index, 'JEEPNEY').some((h) => h.doc.to === '/learn/what-is-a-network')).toBe(true);
  });
  it('surfaces planned modules honestly instead of returning nothing', () => {
    const hits = search(index, 'Terraform');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => h.doc.kind === 'Planned module')).toBe(true);
    expect(hits.every((h) => h.doc.kind !== 'Lesson')).toBe(true);
  });
  it('honours the limit', () => {
    expect(search(index, 'the', 5).length).toBeLessThanOrEqual(5);
  });
});

describe('helpers', () => {
  it('tokenizes on spaces and punctuation but keeps address-like tokens', () => {
    expect(tokenize('Show IP-interface, brief!')).toEqual(['show', 'ip-interface', 'brief']);
    expect(tokenize('192.168.1.0/24')).toEqual(['192.168.1.0/24']);
    expect(tokenize('  ')).toEqual([]);
  });
  it('snippets around the first match and truncates long text', () => {
    const long = `${'lorem '.repeat(60)}needle ${'ipsum '.repeat(60)}`;
    const s = snippet(long, 'needle', 80);
    expect(s).toContain('needle');
    expect(s.length).toBeLessThanOrEqual(84);
    expect(snippet('short text', 'text')).toBe('short text');
  });
});
