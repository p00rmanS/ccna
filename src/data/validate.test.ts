import { describe, expect, it } from 'vitest';
import { FLASHCARDS, LABS, LESSONS, QUESTIONS, nextLesson, previousLesson } from './index';
import { validateContent } from './validate';
import { CURRICULUM } from './curriculum';
import { DOMAINS } from './domains';

describe('content integrity', () => {
  it('has no structural problems', () => {
    const problems = validateContent({ lessons: LESSONS, questions: QUESTIONS, flashcards: FLASHCARDS, labs: LABS });
    expect(problems).toEqual([]);
  });

  it('publishes the twenty-seven lessons in curriculum order', () => {
    expect(LESSONS.map((l) => l.id)).toEqual([
      'what-is-a-network', 'network-devices', 'lan-vs-wan', 'ios-fundamentals', 'osi-model', 'tcpip-model',
      'ethernet', 'mac-addresses', 'switch-mac-learning', 'cabling-physical', 'binary-basics', 'ipv4-fundamentals',
      'subnetting-from-zero', 'vlsm', 'ipv6-fundamentals', 'ipv6-address-types',
      'vlans', 'trunking', 'inter-vlan-routing', 'why-stp', 'stp-fundamentals', 'rapid-pvst', 'stp-protection',
      'etherchannel', 'cdp-lldp', 'dhcp-fundamentals', 'dhcp-server-relay',
    ]);
  });

  it('links lessons into a previous/next chain', () => {
    expect(previousLesson(LESSONS[0]!.id)).toBeUndefined();
    expect(nextLesson(LESSONS[LESSONS.length - 1]!.id)).toBeUndefined();
    expect(nextLesson('osi-model')?.id).toBe('tcpip-model');
    expect(previousLesson('osi-model')?.id).toBe('ios-fundamentals');
  });

  it('uses the six official domains with weights that total 100', () => {
    expect(DOMAINS.map((d) => d.weight).reduce((a, b) => a + b, 0)).toBe(100);
    expect(DOMAINS.map((d) => d.weight)).toEqual([20, 20, 25, 10, 15, 10]);
  });

  it('has unique module ids and never lists a lesson twice', () => {
    const modules = CURRICULUM.flatMap((p) => p.modules);
    expect(new Set(modules.map((m) => m.id)).size).toBe(modules.length);
    const lessonIds = modules.flatMap((m) => m.lessonIds);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
  });

  it('meets the current content floor and does not pretend to be bigger than it is', () => {
    expect(LESSONS.length).toBeGreaterThanOrEqual(21);
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(200);
    expect(FLASHCARDS.length).toBeGreaterThanOrEqual(180);
    expect(LABS.length).toBeGreaterThanOrEqual(21);
  });
});

describe('validator', () => {
  it('reports problems it should catch', () => {
    const q = { ...QUESTIONS[0]!, id: 'bad', correct: [9], lessonIds: ['nope'] };
    const problems = validateContent({ lessons: LESSONS, questions: [...QUESTIONS, q, { ...QUESTIONS[0]! }], flashcards: FLASHCARDS, labs: LABS });
    expect(problems.some((p) => p.includes('out of range'))).toBe(true);
    expect(problems.some((p) => p.includes('unknown lesson nope'))).toBe(true);
    expect(problems.some((p) => p.startsWith('Duplicate question id'))).toBe(true);
  });
});
