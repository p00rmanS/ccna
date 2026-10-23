export type DomainId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';
export type Difficulty = 'beginner' | 'intermediate' | 'exam';

export interface Domain {
  id: DomainId;
  /** Cisco's numbering, e.g. "1.0". */
  number: string;
  name: string;
  /** Approximate exam weight, percent (from the 200-301 v1.1 blueprint). */
  weight: number;
}

export type DiagramId =
  | 'network-overview'
  | 'device-gallery'
  | 'lan-wan'
  | 'osi-encapsulation'
  | 'tcpip-osi-map'
  | 'ethernet-frame'
  | 'mac-anatomy'
  | 'binary-places'
  | 'ipv4-structure'
  | 'ios-modes'
  | 'media-compare'
  | 'subnet-blocks'
  | 'ipv6-structure'
  | 'ipv6-types'
  | 'vlan-segments'
  | 'dot1q-trunk'
  | 'router-on-a-stick'
  | 'loop-storm'
  | 'stp-roles'
  | 'rstp-convergence'
  | 'stp-guards'
  | 'etherchannel-bundle'
  | 'discovery-neighbors'
  | 'dhcp-dora'
  | 'dhcp-relay'
  | 'dns-resolution'
  | 'nat-terms'
  | 'nat-static-dynamic'
  | 'pat-ports'
  | 'ntp-strata'
  | 'snmp-flow'
  | 'syslog-levels'
  | 'ssh-vs-telnet'
  | 'tftp-vs-ftp'
  | 'security-chain'
  | 'threat-map'
  | 'hardening-layers'
  | 'acl-flow'
  | 'acl-placement'
  | 'acl-extended-read'
  | 'port-security-modes'
  | 'dhcp-snooping-ports'
  | 'dai-check'
  | 'aaa-radius-tacacs'
  | 'vpn-site-remote'
  | 'router-hops'
  | 'route-entry'
  | 'static-route-pair'
  | 'default-route-stub'
  | 'routing-protocol-types'
  | 'ospf-states'
  | 'ospf-topology';

export type InteractiveId =
  | 'guess-device'
  | 'encapsulation'
  | 'mac-decoder'
  | 'mac-learning'
  | 'binary-lab'
  | 'ipv4-split'
  | 'cable-picker'
  | 'subnet-lister'
  | 'vlsm-planner'
  | 'ipv6-compress'
  | 'ipv6-classify'
  | 'stp-election';

export interface Term {
  term: string;
  definition: string;
  /** Taglish version, attached from data/taglish at load time. */
  taglish?: string;
}

export type CalloutKind = 'trap' | 'tip' | 'memorize' | 'relax';

export type Section =
  | { type: 'explain'; simple: string[]; taglish: string[]; technical: string[] }
  | { type: 'analogy'; title: string; body: string[]; taglish?: string[] }
  /** The single easiest memory trick for the lesson, explained in Taglish, with a self-test. */
  /** A short Taglish narrative with recurring characters that ties the concept to a real situation. */
  | { type: 'story'; title: string; paragraphs: string[]; moral: string }
  | { type: 'hook'; title: string; trick: string; taglish: string[]; test: { question: string; answer: string } }
  | { type: 'diagram'; id: DiagramId; caption: string }
  | { type: 'interactive'; id: InteractiveId; caption?: string }
  | { type: 'terms'; items: Term[] }
  | { type: 'flow'; title: string; steps: string[] }
  | { type: 'cli'; title: string; transcript: string; copyable?: string; explain: Array<{ line: string; why: string; taglish?: string }>; note?: string }
  | { type: 'verify'; title: string; items: Array<{ command: string; shows: string; taglish?: string }>; good?: string; bad?: string }
  | { type: 'callout'; kind: CalloutKind; text: string }
  | { type: 'list'; title: string; items: string[]; variant?: 'mistakes' | 'tips' | 'remember' }
  | { type: 'troubleshoot'; title: string; scenario: string; evidence?: string; question: string; answer: string; fix?: string }
  | { type: 'challenge'; title: string; prompt: string; answer: string }
  | { type: 'summary'; points: string[] };

export interface Lesson {
  id: string;
  moduleId: string;
  domain: DomainId;
  title: string;
  description: string;
  whyMatters: string;
  objectives: string[];
  estimatedMinutes: number;
  difficulty: Difficulty;
  keywords: string[];
  /** Cisco 200-301 v1.1 objective codes, e.g. "1.13". Foundational lessons list the closest objectives. */
  examObjectives: string[];
  sections: Section[];
}

export type QuestionType = 'single' | 'multiple' | 'true-false';

export interface Question {
  id: string;
  lessonIds: string[];
  domain: DomainId;
  objective: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: QuestionType;
  prompt: string;
  choices: string[];
  /** Indexes into `choices`. */
  correct: number[];
  explanation: string;
  /** Taglish explanation, attached from data/taglish at load time. */
  explanationTl?: string;
  /** Taglish versions of the per-choice wrong-answer notes. */
  wrongTl?: Record<number, string>;
  /** Why a specific wrong choice is wrong, keyed by choice index. */
  wrong?: Record<number, string>;
}

export interface Flashcard {
  id: string;
  lessonId: string;
  domain: DomainId;
  category: 'definition' | 'command' | 'port' | 'protocol' | 'ipv4' | 'switching' | 'concept';
  front: string;
  back: string;
  /** Taglish answer, attached from data/taglish at load time. */
  backTl?: string;
}

export interface Lab {
  id: string;
  lessonId: string;
  title: string;
  tool: 'Packet Tracer' | 'Paper' | 'Your computer';
  minutes: number;
  objective: string;
  topology?: string;
  addressing?: Array<{ device: string; interface: string; address: string; note?: string }>;
  steps: string[];
  checklist: string[];
  hints: string[];
  solution: string[];
  /** After the lab: how to break it on purpose and practise fixing it (PROJECT.md §101). */
  breakIt?: string;
  /** Taglish version of the text fields, attached from data/taglish at load time. */
  tl?: LabTaglish;
}

export interface LabTaglish {
  objective: string;
  steps: string[];
  checklist: string[];
  hints: string[];
  solution: string[];
  breakIt?: string;
}

export interface CommandCard {
  id: string;
  command: string;
  category: string;
  purpose: string;
  syntax: string;
  mode: string;
  example: string;
  verification?: string;
  mistake: string;
  lessonId?: string;
}

export interface ModuleOutline {
  id: string;
  title: string;
  domain: DomainId | 'foundation' | 'practice';
  /** Authored lessons in this module, in order. Empty means planned. */
  lessonIds: string[];
  /** Topics the module will cover (shown for planned modules). */
  topics: string[];
  note?: string;
}

export interface PhaseOutline {
  id: string;
  title: string;
  blurb: string;
  modules: ModuleOutline[];
}
