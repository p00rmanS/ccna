import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'acl-fundamentals';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.4',
  domain: 'D5',
  title: 'ACL Fundamentals: How a Router Permits and Denies Traffic',
  description: 'What an access control list is, how top-down matching and the implicit deny work, and how to read wildcard masks.',
  whyMatters:
    'Ang ACL ang pinakamadalas na paksa sa CCNA configuration questions. Ang mahirap ay hindi ang syntax kundi ang lohika: top-down, ang unang tugma ang panalo, at may nakatagong "deny any" sa dulo. Kapag malinaw ito at kabisado mo ang wildcard mask, kaya mo na ang standard at extended ACLs.',
  objectives: [
    'Explain what an ACL does and where it is applied (inbound or outbound on an interface)',
    'Describe top-down processing and the implicit deny any at the end',
    'Convert a subnet mask into a wildcard mask',
    'Use the host and any keywords',
    'Compare standard and extended ACLs and numbered and named ACLs',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['ACL', 'access-list', 'permit', 'deny', 'wildcard mask', 'implicit deny', 'inbound', 'outbound', 'ip access-group', 'host', 'any', 'standard ACL', 'extended ACL'],
  examObjectives: ['5.6'],
  sections: [
    {
      type: 'explain',
      simple: [
        'An access control list is a list of permit and deny rules that a router checks against each packet. Think of a guard with a checklist: he reads the rules from the top, and the first rule that matches decides what happens to the packet.',
        'If no rule matches, the packet is denied by an invisible rule at the end, the implicit deny. That is why a list with only deny rules blocks everything, and why you must almost always add a permit.',
      ],
      taglish: [
        'Ang **ACL** ay **listahan ng permit at deny na patakaran** na **sinusuri ng router laban sa bawat packet**. Isipin ang **guwardiya na may checklist**: **binabasa niya mula sa itaas**, at **ang unang tumugmang patakaran ang nagpapasya** sa packet.',
        'Kung **walang tumugma**, **tinatanggihan** ito ng **nakatagong patakaran sa dulo**: ang **implicit deny any**. Kaya ang listahang puro deny ay **humaharang sa lahat**, at kailangan mo halos palaging magdagdag ng **permit**.',
        'Inilalapat ang ACL sa **interface**, sa **inbound** (pagpasok sa router) o **outbound** (paglabas). **Isang ACL lang bawat interface, bawat direksyon, bawat protocol**.',
        'Ang **wildcard mask** ay **kabaligtaran ng subnet mask**: **0 = dapat tumugma**, **1 = hindi mahalaga**. Halimbawa, ang /24 ay wildcard na **0.0.0.255**.',
      ],
      technical: [
        'An ACL is an ordered list of access control entries (ACEs). The router evaluates a packet against the entries sequentially and acts on the first match (permit or deny); processing stops there. If nothing matches, an implicit deny ip any any applies. An ACL has no effect until it is applied to an interface with ip access-group <acl> in|out.',
        'An ACL filters traffic passing through the router. It does not filter traffic originated by the router itself (for example its own pings). Applied inbound, packets are checked before routing; outbound, after the routing decision. Only one ACL per protocol, per interface, per direction is allowed.',
        'Wildcard masks are the inverse of subnet masks: 0 bits must match, 1 bits are ignored. 192.168.1.0 0.0.0.255 matches the whole /24; 10.0.0.0 0.255.255.255 matches 10/8. A /26 (255.255.255.192) is 0.0.0.63. Shortcuts: host 192.168.1.5 equals 192.168.1.5 0.0.0.0, and any equals 0.0.0.0 255.255.255.255.',
        'Standard ACLs (numbers 1–99 and 1300–1999) match only the source IPv4 address. Extended ACLs (100–199 and 2000–2699) match protocol, source, destination and ports. Named ACLs (ip access-list standard|extended NAME) can be edited by sequence number; numbered ACLs can also be edited in modern IOS using the same sequence mechanism in named-style configuration.',
        'Verification: show access-lists (rules with hit counters), show ip interface <if> (shows the ACL applied and its direction), show running-config | section access. Sequence numbers (10, 20, 30...) leave room to insert rules, and remark documents a rule.',
      ],
    },
    {
      type: 'analogy',
      title: 'Guwardiya at listahan ng bisita',
      body: [
        'A building guard checks each visitor against a list from top to bottom. The first line that fits decides: "Maria Cruz, allowed" or "salesmen, not allowed". If your name is nowhere on the list, the building rule at the bottom applies: nobody not listed gets in.',
      ],
      taglish: [
        'Ang **guwardiya ng gusali** ay **tinitingnan ang bawat bisita laban sa listahan mula itaas pababa**. **Ang unang linyang bagay ang nagpapasya**: "Maria Cruz, pwede" o "mga nagbebenta, bawal". Kung **wala ang pangalan mo sa listahan**, **ang patakaran sa ibaba** ang gagamitin: **walang hindi nakalista ang makapapasok**.',
      ],
    },
    {
      type: 'hook',
      title: 'TUD: Top-down, Unang tugma panalo, Deny sa dulo',
      trick: '**TUD**: **T**op-down, **U**nang tugma ang panalo, **D**eny any sa dulo (nakatago). **Wildcard** = baliktad ng subnet mask: **0 tugma, 1 huwag pansinin**.',
      taglish: [
        '**Top-down**: binabasa mula sa unang linya.',
        '**Unang tugma ang panalo**: humihinto na ang pagsusuri.',
        '**Deny sa dulo (implicit)**: kapag walang tumugma, bawal.',
        '**Wildcard**: **255.255.255.0 → 0.0.0.255**. Kung **255 ang mask, 0 ang wildcard**.',
      ],
      test: {
        question: 'May ACL na may isang linya lang: deny 192.168.1.10. Ano ang mangyayari sa trapiko ng ibang host?',
        answer: 'Haharangan din ang lahat ng iba dahil sa implicit deny any sa dulo. Kailangang magdagdag ng permit any para payagan ang iba.',
      },
    },
    { type: 'diagram', id: 'acl-flow', caption: 'Top-down na pagsusuri: ang unang tugma ang nagpapasya; kung wala, implicit deny.' },
    {
      type: 'terms',
      items: [
        { term: 'ACL', definition: 'An ordered list of permit and deny rules used to filter traffic.' },
        { term: 'ACE', definition: 'Access control entry: one line in an ACL.' },
        { term: 'Implicit deny', definition: 'The invisible deny ip any any at the end of every ACL.' },
        { term: 'Wildcard mask', definition: 'The inverse of a subnet mask: 0 must match, 1 is ignored.' },
        { term: 'host / any', definition: 'Keywords for a single address (0.0.0.0 wildcard) and for all addresses (255.255.255.255 wildcard).' },
        { term: 'Inbound / outbound', definition: 'Direction in which an ACL checks traffic on an interface: into the router or out of it.' },
        { term: 'Standard / extended', definition: 'Standard matches source only; extended matches protocol, source, destination and ports.' },
        { term: 'Sequence number', definition: 'The number that orders and identifies a rule, such as 10, 20, 30.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: paano sinusuri ng R1 ang isang packet',
      steps: [
        'Dumating ang packet mula 192.168.1.50 sa inbound interface na may ACL 10.',
        'Sinusuri ang unang linya: deny 192.168.1.10. Hindi tumutugma (iba ang address).',
        'Sinusuri ang ikalawang linya: permit 192.168.1.0 0.0.0.255. Tumutugma ito.',
        'Pinapayagan ang packet at humihinto na ang pagsusuri.',
        'Ang packet mula 10.9.9.9 ay hindi tutugma sa alinman kaya tatamaan ng implicit deny.',
        'Ang router na ang bahala sa pag-forward ng pinayagang packet.',
      ],
    },
    {
      type: 'cli',
      title: 'Wildcard masks at pagbasa ng ACL',
      transcript: `R1(config)# access-list 10 deny host 192.168.1.10
R1(config)# access-list 10 permit 192.168.1.0 0.0.0.255
R1(config)# interface gi0/1
R1(config-if)# ip access-group 10 in
R1(config-if)# end
R1# show access-lists
Standard IP access list 10
    10 deny   192.168.1.10 (4 matches)
    20 permit 192.168.1.0, wildcard bits 0.0.0.255 (122 matches)
R1# show ip interface gi0/1 | include access list
  Inbound  access list is 10`,
      copyable: 'ip access-group 10 in',
      explain: [
        { line: 'access-list 10 deny host 192.168.1.10', why: 'First rule: blocks one specific host. host means wildcard 0.0.0.0.' },
        { line: 'access-list 10 permit 192.168.1.0 0.0.0.255', why: 'Second rule: allows the rest of the /24. The wildcard 0.0.0.255 ignores the last octet.' },
        { line: 'ip access-group 10 in', why: 'Applies ACL 10 to Gi0/1 for incoming traffic. Without this the ACL does nothing.' },
        { line: '(4 matches)', why: 'Hit counters show how many packets matched each rule, which helps troubleshooting.' },
        { line: 'Inbound access list is 10', why: 'Confirms where and in which direction the ACL is applied.' },
      ],
      note: 'Sample output for study. Hit counts will differ.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show access-lists', shows: 'Every ACL with its rules, sequence numbers and match counters.' },
        { command: 'show ip interface <if>', shows: 'Which ACL is applied inbound and outbound on the interface.' },
        { command: 'show running-config | section access', shows: 'The ACL lines and the ip access-group commands.' },
        { command: 'show ip access-lists <name>', shows: 'Only one ACL, useful for named lists.' },
      ],
      good: 'The ACL is applied in the intended direction and the permit rule counters increase.',
      bad: 'No ip access-group line (the ACL does nothing), or the deny counter rising on traffic that should be allowed.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang ACL ay **walang epekto hangga’t hindi inilalapat** sa interface gamit ang **ip access-group**. Ito ang pinakakaraniwang dahilan kung bakit "hindi gumagana" ang ACL.' },
    { type: 'callout', kind: 'trap', text: 'Ang **implicit deny any** ay **hindi nakikita sa config**. Kapag isang deny lang ang inilagay mo, **lahat ng iba ay haharangan** din. At **ang order ay mahalaga**: ang mas tiyak na rule ay dapat nasa itaas.' },
    { type: 'callout', kind: 'tip', text: 'Para sa wildcard: **subtract the subnet mask mula 255.255.255.255**. Halimbawa, /27 = 255.255.255.224 → wildcard **0.0.0.31**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Paglimot sa ip access-group (hindi nailapat ang ACL).',
        'Paggamit ng subnet mask sa halip na wildcard mask.',
        'Maling pagkakasunod: general rule sa itaas ng specific rule.',
        'Paglimot sa permit any pagkatapos ng deny.',
        'Maling direksyon (in vs out).',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Nawalan ng internet ang buong LAN"',
      scenario: 'After an ACL was added to block one host, nobody on the LAN can reach the internet.',
      evidence: `R1# show access-lists
Standard IP access list 10
    10 deny   192.168.1.10 (212 matches)
R1# show ip interface gi0/1 | include access list
  Outgoing access list is not set
  Inbound  access list is 10`,
      question: 'Bakit nawalan ng internet ang lahat?',
      answer: 'Isang deny lang ang ACL, at ang implicit deny any sa dulo ang humaharang sa lahat ng iba. Walang permit para sa mga normal na host.',
      fix: 'Idagdag ang permit pagkatapos ng deny: access-list 10 permit any (o ang network ng LAN). Pagkatapos, i-check ang show access-lists na tumataas ang counters ng permit.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang wildcard mask para sa 172.16.32.0/20 at 10.1.1.64/26, at sabihin kung anong keyword ang katumbas ng 0.0.0.0 255.255.255.255.',
      answer: '/20 = 255.255.240.0 → wildcard 0.0.15.255. /26 = 255.255.255.192 → wildcard 0.0.0.63. Ang any ay katumbas ng 0.0.0.0 255.255.255.255.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'ACLs are processed top-down; the first match wins; there is an implicit deny any at the end.',
        'An ACL does nothing until applied with ip access-group in|out.',
        'Wildcard is the inverse of the subnet mask: 0 = match, 1 = ignore.',
        'host = /32 (0.0.0.0 wildcard); any = 0.0.0.0 255.255.255.255.',
        'Standard ACLs match source only; extended match protocol, source, destination and ports.',
      ],
    },
    {
      type: 'summary',
      points: [
        'An ACL is a top-down list; the first match decides; implicit deny any ends every list.',
        'Apply it to an interface and choose the direction carefully.',
        'Wildcard masks invert the subnet mask; use host and any as shortcuts.',
        'Standard ACLs filter by source; extended ACLs filter by much more.',
        'Susunod: Standard ACLs — configuration at placement.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'easy', type: 'single',
    prompt: 'How does a router process an ACL?',
    choices: ['Bottom-up, last match wins', 'Top-down, first match wins', 'All lines are checked and the average is used', 'Randomly'], correct: [1],
    explanation: 'ACLs are evaluated top-down and processing stops at the first match.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'easy', type: 'single',
    prompt: 'What is at the end of every ACL even though it is not shown?',
    choices: ['permit any', 'implicit deny any', 'A log entry', 'A remark'], correct: [1],
    explanation: 'Every ACL ends with an implicit deny of all traffic that did not match a rule.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'What is the wildcard mask for a /24 network?',
    choices: ['255.255.255.0', '0.0.0.255', '0.0.255.255', '255.0.0.0'], correct: [1],
    explanation: 'A wildcard is the inverse of the subnet mask: 255.255.255.0 becomes 0.0.0.255.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Which command applies ACL 10 to incoming traffic on an interface?',
    choices: ['access-list 10 in', 'ip access-group 10 in', 'ip access-class 10 in', 'apply acl 10'], correct: [1],
    explanation: 'ip access-group <acl> in|out applies an ACL to an interface.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'What does the "any" keyword represent?',
    choices: ['0.0.0.0', 'All addresses (0.0.0.0 255.255.255.255)', 'Only the default gateway', 'Only private addresses'], correct: [1],
    explanation: 'any matches every address and is shorthand for 0.0.0.0 255.255.255.255.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'hard', type: 'single',
    prompt: 'An ACL contains only "deny 192.168.1.10". What happens to traffic from 192.168.1.20?',
    choices: ['It is permitted', 'It is denied by the implicit deny', 'It is logged only', 'It depends on the interface speed'], correct: [1],
    explanation: 'No rule matches, so the implicit deny any blocks it.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'What is the wildcard mask for 255.255.255.192?',
    choices: ['0.0.0.31', '0.0.0.63', '0.0.0.127', '0.0.0.192'], correct: [1],
    explanation: '255 − 192 = 63, so the wildcard is 0.0.0.63.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO statements about ACLs are true?',
    choices: ['The first matching rule is applied', 'An ACL works without being applied to an interface', 'There is an implicit deny at the end', 'Wildcard bits of 1 must match'], correct: [0, 2],
    explanation: 'First match wins and an implicit deny ends the list; an ACL must be applied, and wildcard 1 bits are ignored.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: ACLs filter traffic that the router itself originates.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — ACLs filter traffic passing through the router, not traffic it originates.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: paano tandaan ang ACL?', back: 'TUD: Top-down, Unang tugma panalo, Deny any sa dulo (nakatago). Wildcard = baliktad ng mask: 0 tugma, 1 huwag pansinin. Dapat i-apply sa interface.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'How is an ACL processed?', back: 'Top-down; first match wins; implicit deny any at the end.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Wildcard mask rule?', back: '0 = must match, 1 = ignore. Inverse of the subnet mask (255.255.255.0 → 0.0.0.255).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'command', front: 'Apply an ACL to an interface?', back: 'interface gi0/1 → ip access-group <acl> in|out' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'concept', front: 'host and any?', back: 'host = single address (0.0.0.0 wildcard); any = all addresses (0.0.0.0 255.255.255.255).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'command', front: 'View ACLs and where they are applied?', back: 'show access-lists and show ip interface <if>' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Block one host and prove the implicit deny',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Write a simple ACL, apply it, observe the implicit deny and fix it with a permit.',
  topology: 'PC1 (192.168.1.10) and PC2 (192.168.1.20) — SW1 — R1 (Gi0/0 = 192.168.1.1) — Server (10.0.0.50).',
  steps: [
    'Confirm both PCs can ping the server.',
    'Create access-list 10 deny host 192.168.1.10 and apply it inbound on R1 Gi0/0.',
    'Ping the server from both PCs; both should now fail (implicit deny).',
    'Run show access-lists and read the match counters.',
    'Add access-list 10 permit any and test again.',
    'Check that only PC1 is blocked and the counters show deny and permit hits.',
  ],
  checklist: [
    'Observed everything blocked after the lone deny',
    'Fixed it with a permit rule',
    'Only PC1 is blocked at the end',
  ],
  hints: [
    'New lines are added to the end of a numbered ACL.',
    'Apply the ACL on the interface nearest the traffic you want to filter.',
  ],
  solution: [
    'A single deny rule plus the implicit deny blocks all traffic.',
    'Adding permit any after the deny lets PC2 through while PC1 stays blocked.',
  ],
  breakIt: 'Move the permit any above the deny and see that PC1 is no longer blocked because the first match wins.',
};
