import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'standard-acls';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.5',
  domain: 'D5',
  title: 'Standard ACLs: Filtering by Source Address',
  description: 'How to write, apply and place numbered and named standard ACLs, and how to restrict VTY access with an access-class.',
  whyMatters:
    'Ang standard ACL ang pinakasimpleng filter: tinitingnan lang nito ang source address. Madalas itong lumabas sa exam na may maliit na topology at tanong na "saan mo ilalagay ang ACL?" — at ang sagot ay laging malapit sa destination. Gamit din ito para limitahan kung sino ang puwedeng mag-SSH sa router.',
  objectives: [
    'Write a numbered standard ACL (1–99) with wildcard masks',
    'Create a named standard ACL and edit it using sequence numbers',
    'Apply a standard ACL with ip access-group, choosing the correct direction',
    'State the placement rule: standard ACLs go close to the destination',
    'Restrict remote access with access-class on the VTY lines',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['standard ACL', 'access-list 1', 'ip access-list standard', 'access-class', 'ip access-group', 'remark', 'sequence number', 'wildcard', 'placement', 'VTY'],
  examObjectives: ['5.6'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A standard ACL looks at only one thing: where the packet came from. It cannot see where the packet is going or which service it uses, so it is blunt. That is why it should be placed close to the destination: placed near the source it would block that host from everything, not just from one target.',
        'Standard ACLs have two jobs: filtering traffic through a router interface, and controlling who may log in to the device itself by applying an ACL to the VTY lines with access-class.',
      ],
      taglish: [
        'Ang **standard ACL** ay **isang bagay lang ang tinitingnan**: **kung saan galing ang packet (source)**. **Hindi nito nakikita ang destination o ang serbisyo**, kaya **mapurol** ito. Kaya **ilalagay ito malapit sa destination**: kung ilalagay malapit sa source, **haharangan ang host sa lahat ng lugar**, hindi lang sa isang target.',
        'Dalawang gamit: **(1) mag-filter ng trapiko** na dumadaan sa interface, at **(2) kontrolin kung sino ang puwedeng mag-login sa device** gamit ang **access-class** sa **VTY lines**.',
        'Dalawang istilo: **numbered** (access-list 1–99) at **named** (ip access-list standard NAME). Ang **named** ay mas madaling **i-edit** gamit ang **sequence numbers**.',
        'Tandaan: **standard = malapit sa destination; extended = malapit sa source**.',
      ],
      technical: [
        'Numbered standard ACLs use numbers 1–99 and 1300–1999: access-list <n> permit|deny <source> [wildcard]. The default wildcard is 0.0.0.0 when only an address is given, so access-list 1 permit 192.168.1.5 means that host. Remember the implicit deny any at the end.',
        'Named standard ACLs: ip access-list standard NAME, then permit|deny entries with optional sequence numbers (10, 20, 30...). To insert a rule, give it a sequence number lower than the one to follow; to delete one, use no <sequence>. remark adds a comment. Named ACLs avoid rebuilding the list to change one line.',
        'Placement: because a standard ACL only matches the source, apply it as close to the destination as possible so that legitimate traffic from that source to other destinations is not blocked. Extended ACLs, which can match the destination, go close to the source to drop unwanted traffic early.',
        'Applying: ip access-group <acl> in|out on a router interface. To protect management access, apply an ACL to the VTY lines with access-class <acl> in (for example permit only the admin subnet). This is separate from ip access-group because VTY lines are not interfaces.',
        'Verification: show access-lists, show ip access-lists NAME, show ip interface <if>, and show running-config | section line vty for access-class. Hit counters show which rule is matching.',
      ],
    },
    {
      type: 'analogy',
      title: 'Guwardiya sa tarangkahan ng subdivision',
      body: [
        'A subdivision guard who only checks which street a visitor came from can only say "everyone from Mabini Street is not allowed". He cannot say "not allowed at house 5 but allowed at house 8", so you put him at the gate of the specific house you want to protect, not at the subdivision entrance, otherwise you ban those visitors everywhere.',
      ],
      taglish: [
        'Ang **guwardiya na tinitingnan lang kung saang kalye galing ang bisita** ay **"lahat ng galing sa Kalye Mabini, bawal"** lang ang masasabi. **Hindi niya masasabing "bawal sa bahay 5 pero puwede sa bahay 8"**. Kaya **ilalagay mo siya sa tarangkahan ng mismong bahay na poprotektahan**, hindi sa pasukan ng subdivision — kung hindi, **mababawalan sila sa lahat ng lugar**.',
      ],
    },
    {
      type: 'hook',
      title: 'Standard = Source lang, malapit sa Destination',
      trick: '**S**tandard = **S**ource lang, **1–99**, ilagay **malapit sa D**estination. **E**xtended = **E**verything (protocol/ports), **100–199**, malapit sa **S**ource.',
      taglish: [
        '**Standard**: **source lang** ang tinitingnan, **numero 1–99**, ilagay **malapit sa destination**.',
        '**Extended**: **lahat** (protocol, source, destination, port), **numero 100–199**, ilagay **malapit sa source**.',
        'Para sa **VTY**, gamitin ang **access-class**, hindi ip access-group.',
        'Palaging tandaan ang **implicit deny** sa dulo.',
      ],
      test: {
        question: 'Gusto mong harangan ang PC1 papunta sa isang server lang, gamit ang standard ACL. Saan mo ito ilalagay, at bakit hindi malapit sa PC1?',
        answer: 'Malapit sa destination (interface papunta sa server). Kung malapit sa PC1, maba-block din ang PC1 papunta sa lahat ng ibang network dahil ang standard ACL ay source lang ang tinitingnan.',
      },
    },
    { type: 'diagram', id: 'acl-placement', caption: 'Standard ACL malapit sa destination; extended ACL malapit sa source.' },
    {
      type: 'terms',
      items: [
        { term: 'Standard ACL', definition: 'ACL (1–99, 1300–1999 or named) that matches only the source IPv4 address.' },
        { term: 'Named ACL', definition: 'ACL created with ip access-list standard|extended NAME; editable by sequence number.' },
        { term: 'Sequence number', definition: 'The number (10, 20, 30...) that orders a rule and lets you insert or delete it.' },
        { term: 'access-class', definition: 'Applies an ACL to VTY lines to control who may open remote sessions.' },
        { term: 'remark', definition: 'A comment line that documents an ACL.' },
        { term: 'Placement rule', definition: 'Standard ACLs near the destination; extended ACLs near the source.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: harangan ang HR PC pero payagan ang iba',
      steps: [
        'Gusto mong ipagbawal sa HR PC (192.168.10.25) ang pag-access sa server network na 10.0.0.0/24.',
        'Gagawa ng standard ACL na deny host 192.168.10.25, saka permit any.',
        'Ilalagay ito sa R1 interface papunta sa server network, outbound (malapit sa destination).',
        'Ang packet ng HR PC papunta sa server ay tatama sa deny at ibabagsak.',
        'Ang ibang host ay tatama sa permit any at papasa.',
        'Ang trapiko ng HR PC papunta sa ibang network ay hindi apektado dahil nasa malayo ang ACL.',
      ],
    },
    {
      type: 'cli',
      title: 'Numbered, named at access-class',
      transcript: `R1(config)# access-list 5 remark Block HR PC to servers
R1(config)# access-list 5 deny host 192.168.10.25
R1(config)# access-list 5 permit any
R1(config)# interface gi0/1
R1(config-if)# ip access-group 5 out
R1(config-if)# exit
R1(config)# ip access-list standard ADMIN-ONLY
R1(config-std-nacl)# 10 permit 192.168.99.0 0.0.0.255
R1(config-std-nacl)# 20 deny any log
R1(config-std-nacl)# exit
R1(config)# line vty 0 4
R1(config-line)# access-class ADMIN-ONLY in
R1(config-line)# end
R1# show access-lists
Standard IP access list 5
    10 deny   192.168.10.25
    20 permit any
Standard IP access list ADMIN-ONLY
    10 permit 192.168.99.0, wildcard bits 0.0.0.255
    20 deny   any log`,
      copyable: 'access-class ADMIN-ONLY in',
      explain: [
        { line: 'access-list 5 deny host 192.168.10.25', why: 'Blocks one source host. Then permit any lets everyone else through; otherwise the implicit deny would block all.' },
        { line: 'ip access-group 5 out', why: 'Applies ACL 5 outbound on the interface toward the servers: close to the destination.' },
        { line: 'ip access-list standard ADMIN-ONLY', why: 'Starts a named standard ACL where entries can carry sequence numbers.' },
        { line: '20 deny any log', why: 'Explicit final deny that also logs blocked attempts; useful for seeing who tried to connect.' },
        { line: 'access-class ADMIN-ONLY in', why: 'Limits SSH/Telnet logins to the admin subnet by applying the ACL to the VTY lines.' },
      ],
      note: 'Sample output for study.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show access-lists', shows: 'Rules with sequence numbers and match counters.' },
        { command: 'show ip interface gi0/1', shows: 'The ACL applied and its direction on the interface.' },
        { command: 'show running-config | section line vty', shows: 'Whether access-class is configured under the VTY lines.' },
        { command: 'show ip access-lists ADMIN-ONLY', shows: 'Just the named list.' },
      ],
      good: 'The expected host is blocked, others are permitted, and counters match the tests.',
      bad: 'Everything blocked (missing permit) or nothing blocked (ACL not applied or wrong direction).',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **standard ACL ay ilalagay malapit sa DESTINATION**. Kung ilalagay malapit sa source, **maba-block ang source sa lahat ng destination**. Madalas itong ibaliktad sa exam.' },
    { type: 'callout', kind: 'trap', text: 'Para sa **remote access (VTY)**, **access-class** ang gamit; **hindi** ang ip access-group. Ang **ip access-group** ay para sa **interface**.' },
    { type: 'callout', kind: 'tip', text: 'Kapag **nag-edit ng numbered ACL** sa lumang paraan, **idinadagdag lang ang linya sa dulo**. Mas madali ang **named ACL na may sequence numbers** para sa pagpasok sa gitna.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Paglalagay ng standard ACL malapit sa source.',
        'Paglimot ng permit any pagkatapos ng deny.',
        'Paggamit ng ip access-group sa VTY lines.',
        'Pag-edit ng ACL sa maling pagkakasunod, kaya hindi tumutugma ang tinutukoy na rule.',
        'Pagkalito sa in at out sa interface.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Hindi pa rin nakakapag-SSH ang admin PC"',
      scenario: 'Only the admin subnet 192.168.99.0/24 should reach the router by SSH. The admin PC at 192.168.99.10 is refused.',
      evidence: `R1# show running-config | section line vty
line vty 0 4
 access-class ADMIN-ONLY in
 transport input ssh
R1# show ip access-lists ADMIN-ONLY
Standard IP access list ADMIN-ONLY
    10 permit 192.168.9.0, wildcard bits 0.0.0.255 (0 matches)
    20 deny   any log (14 matches)`,
      question: 'Ano ang mali sa ACL?',
      answer: 'Maling network ang nasa rule 10: 192.168.9.0 sa halip na 192.168.99.0. Kaya hindi tumutugma ang admin PC (0 matches) at tinatamaan ito ng deny any.',
      fix: 'Burahin at palitan ang rule: ip access-list standard ADMIN-ONLY → no 10 → 10 permit 192.168.99.0 0.0.0.255. Pagkatapos ay subukan ulit at tingnan ang match counter ng rule 10.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang named standard ACL na pumapayag lang sa 10.1.1.0/24 at 10.1.2.5, at ilapat ito sa VTY lines.',
      answer: 'ip access-list standard MGMT → 10 permit 10.1.1.0 0.0.0.255 → 20 permit host 10.1.2.5. Sa line vty 0 15: access-class MGMT in. Ang implicit deny ang haharang sa iba.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Standard ACLs: numbers 1–99 and 1300–1999; source address only.',
        'Place standard ACLs close to the destination; extended ACLs close to the source.',
        'ip access-group for interfaces; access-class for VTY lines.',
        'Named ACLs allow sequence numbers for insert/delete; remember the implicit deny.',
        'access-list 5 permit host 10.1.1.1 equals permit 10.1.1.1 0.0.0.0.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Standard ACLs match only the source address.',
        'Place them close to the destination.',
        'Use named ACLs with sequence numbers for easy editing.',
        'Protect remote access with access-class on the VTY lines.',
        'Susunod: Extended at named ACLs — protocol, port at destination.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'easy', type: 'single',
    prompt: 'What does a standard ACL match?',
    choices: ['Source and destination address', 'Source IPv4 address only', 'Protocol and port', 'MAC addresses'], correct: [1],
    explanation: 'Standard ACLs filter on the source IPv4 address only.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'easy', type: 'single',
    prompt: 'Which range of numbers is used for standard numbered ACLs?',
    choices: ['100–199', '1–99', '200–299', '1000–1099'], correct: [1],
    explanation: 'Standard ACLs use 1–99 (and 1300–1999).',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Where should a standard ACL be placed?',
    choices: ['Close to the source', 'Close to the destination', 'On every interface', 'Only on the WAN'], correct: [1],
    explanation: 'Because it only checks the source, it should be close to the destination to avoid blocking that source elsewhere.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Which command applies an ACL to restrict who can open a remote session to the router?',
    choices: ['ip access-group 10 in', 'access-class 10 in (under line vty)', 'access-list 10 vty', 'ip vty 10'], correct: [1],
    explanation: 'access-class under the VTY lines applies an ACL to remote sessions.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Which command creates a named standard ACL?',
    choices: ['access-list standard NAME', 'ip access-list standard NAME', 'ip access-group NAME', 'named-acl NAME'], correct: [1],
    explanation: 'ip access-list standard NAME enters named standard ACL configuration mode.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'What is equivalent to "access-list 1 permit 192.168.1.5"?',
    choices: ['permit 192.168.1.5 255.255.255.255', 'permit host 192.168.1.5', 'permit 192.168.1.0 0.0.0.255', 'permit any'], correct: [1],
    explanation: 'With no wildcard, the default is 0.0.0.0, which is the same as host.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'hard', type: 'single',
    prompt: 'A named ACL has rules 10 and 30. How can you insert a new rule between them?',
    choices: ['Delete the ACL and rebuild it', 'Add a rule with sequence number 20', 'It is not possible', 'Reload the router'], correct: [1],
    explanation: 'Named ACLs support sequence numbers, so a rule numbered 20 is inserted between 10 and 30.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are true about standard ACLs?',
    choices: ['They are placed close to the destination', 'They match destination ports', 'They match only the source address', 'They use numbers 100–199'], correct: [0, 2],
    explanation: 'Standard ACLs match the source address only and are placed near the destination.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: access-class is used to apply an ACL to router interfaces.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — access-class applies to VTY lines; interfaces use ip access-group.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: standard vs extended ACL?', back: 'Standard = Source lang, 1–99, malapit sa Destination. Extended = Everything (protocol/ports), 100–199, malapit sa Source. VTY = access-class.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What does a standard ACL match?', back: 'Only the source IPv4 address; numbers 1–99 and 1300–1999.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Standard ACL placement?', back: 'Close to the destination (extended ACLs go close to the source).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'command', front: 'Named standard ACL with sequence numbers?', back: 'ip access-list standard NAME → 10 permit ... → 20 deny any' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'command', front: 'Restrict VTY access with an ACL?', back: 'line vty 0 4 → access-class <acl> in' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'command', front: 'Insert or delete a named ACL rule?', back: 'Add with a sequence number between existing ones; delete with no <sequence number>.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Standard ACL on an interface and on the VTY lines',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Block one host from a server network with a standard ACL, then restrict SSH to an admin subnet using access-class.',
  topology: 'LAN 192.168.10.0/24 (PC1 .25, PC2 .26) — R1 — server network 10.0.0.0/24; admin PC 192.168.99.10.',
  steps: [
    'Confirm PC1 and PC2 can ping the server network.',
    'Create access-list 5 deny host 192.168.10.25 and permit any.',
    'Apply it outbound on the R1 interface toward the server network.',
    'Test from PC1 (blocked) and PC2 (allowed); read show access-lists.',
    'Create the named ACL ADMIN-ONLY permitting 192.168.99.0 0.0.0.255.',
    'Apply it with access-class ADMIN-ONLY in under line vty 0 4 and test SSH from PC1 and the admin PC.',
  ],
  checklist: [
    'PC1 blocked, PC2 allowed to the servers',
    'Counters show deny and permit hits',
    'SSH allowed only from the admin subnet',
  ],
  hints: [
    'Put the ACL on the interface closest to the destination.',
    'Remember permit any after the deny, otherwise everything is blocked.',
  ],
  solution: [
    'ACL 5 outbound toward the servers blocks only PC1 to that network.',
    'access-class applies the named ACL to the VTY lines, so only the admin subnet can SSH.',
  ],
  breakIt: 'Move ACL 5 to the PC LAN interface inbound and observe PC1 losing access to every network, not just the servers.',
};
