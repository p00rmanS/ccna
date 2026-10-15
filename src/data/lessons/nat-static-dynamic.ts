import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'nat-static-dynamic';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.5',
  domain: 'D4',
  title: 'Static and Dynamic NAT',
  description: 'One-to-one translation: a permanent mapping for servers and a pool of public addresses handed out on demand.',
  whyMatters:
    'Kapag may web server ka sa loob na kailangang maabot mula sa internet, static NAT ang gagamitin mo. Kapag maraming user na kailangang lumabas pero kaunti lang ang public address, may dynamic NAT. Ang exam ay nagbibigay ng configuration at hinihingi mong tukuyin ang uri, ang kulang na command, o kung bakit naubusan ng address.',
  objectives: [
    'Describe static NAT and when it is needed',
    'Describe dynamic NAT and how an address pool is used',
    'Configure static NAT with ip nat inside source static',
    'Configure dynamic NAT with an ACL, a pool and ip nat inside source list',
    'Explain pool exhaustion and clear translations',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['static NAT', 'dynamic NAT', 'ip nat pool', 'ip nat inside source static', 'ip nat inside source list', 'pool exhaustion', 'clear ip nat translation'],
  examObjectives: ['4.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Static NAT is a permanent one-to-one mapping: private 192.168.1.50 is always 203.0.113.10. Use it for a server that outsiders must reach, because the outside needs a fixed address to connect to.',
        'Dynamic NAT is also one-to-one, but the public address is borrowed from a pool when an inside host needs it and returned later. If the pool has five addresses, only five hosts can be online at once.',
      ],
      taglish: [
        'Ang **static NAT** ay **permanenteng isa-sa-isa**: ang private na 192.168.1.50 ay **laging** 203.0.113.10. Ginagamit ito sa **server na kailangang maabot ng labas**, dahil kailangan ng **tiyak na address**.',
        'Ang **dynamic NAT** ay **isa-sa-isa** din, pero ang public address ay **hinihiram mula sa pool** kapag kailangan at **ibinabalik** pagkatapos. Kapag **limang address** lang ang pool, **limang host lang** ang makalalabas nang sabay.',
        'Kapag **naubos ang pool**, ang susunod na host ay **hindi makalalabas** — tinatawag itong **pool exhaustion**.',
        'Para sa dynamic: kailangan mo ng **ACL** (sino ang puwedeng i-translate), **pool** (anong public address), at **rule** na nag-uugnay sa kanila.',
      ],
      technical: [
        'Static NAT: ip nat inside source static <inside local> <inside global>. Bidirectional and permanent, so outside hosts can initiate connections to the inside host through the inside global address. Typical for servers.',
        'Dynamic NAT: define a pool with ip nat pool <NAME> <start> <end> netmask <mask> (or prefix-length), an ACL permitting the inside local addresses to translate, then ip nat inside source list <ACL> pool <NAME>. The router allocates one pool address per inside host and removes it after the translation times out (default 24 hours) or is cleared.',
        'Both are one-to-one: the number of simultaneous inside hosts is limited by the pool size. Once the pool is exhausted, new flows from additional hosts are dropped until an entry expires.',
        'The ACL used with NAT identifies which addresses to translate, not which traffic to permit through the network. Inside and outside interfaces must still be marked with ip nat inside / ip nat outside.',
        'Verification and maintenance: show ip nat translations, show ip nat statistics (hits, misses, pool usage), clear ip nat translation * to drop dynamic entries.',
      ],
    },
    {
      type: 'analogy',
      title: 'Naka-reserve vs hiram na parking',
      body: [
        'Static NAT is a reserved parking space with a name on it: it is always yours, and visitors know exactly where to find you. Dynamic NAT is a visitor lot with ten spaces: you take whichever is free and give it back when you leave. When the lot is full, the eleventh car waits outside.',
      ],
      taglish: [
        'Ang **static NAT** ay **naka-reserve na parking** na may **pangalan mo** — **laging sa iyo**, at alam ng bisita kung saan ka hahanapin. Ang **dynamic NAT** ay **visitor lot na sampung puwesto**: **kukuha ka ng bakante** at **ibabalik** kapag umalis. Kapag **puno**, **ang ika-labing-isang kotse ay maghihintay sa labas**.',
      ],
    },
    {
      type: 'hook',
      title: 'Static = Server, Dynamic = Pool',
      trick: '**Static** = **S**erver, permanente, **isa-sa-isa**. **Dynamic** = **P**ool, hiram, **isa-sa-isa** din.',
      taglish: [
        '**Static = Server**: permanente at puwedeng simulan ng labas.',
        '**Dynamic = Pool**: hiram mula sa listahan; **ACL + pool + rule** ang kailangan.',
        'Parehong **isa-sa-isa** — hindi nakakatipid ng address (iyon ang gawa ng **PAT**).',
        '**Pool ubos** = hindi na makalabas ang susunod na host.',
      ],
      test: {
        question: 'Ang pool ay may 3 public address at 5 PC ang sabay na nag-ping sa internet gamit ang dynamic NAT. Ano ang mangyayari?',
        answer: 'Tatlong PC lang ang magkakaroon ng translation. Ang natitirang dalawa ay hindi makalalabas hanggang mag-expire o ma-clear ang isang entry (pool exhaustion).',
      },
    },
    { type: 'diagram', id: 'nat-static-dynamic', caption: 'Static: permanenteng pares. Dynamic: public address mula sa pool; ang labis na host ay naghihintay.' },
    {
      type: 'terms',
      items: [
        { term: 'Static NAT', definition: 'Permanent one-to-one mapping between an inside local and an inside global address.' },
        { term: 'Dynamic NAT', definition: 'One-to-one mapping created on demand from a pool of inside global addresses.' },
        { term: 'NAT pool', definition: 'A range of public addresses defined with ip nat pool.' },
        { term: 'NAT ACL', definition: 'Selects which inside local addresses are eligible for translation.' },
        { term: 'Pool exhaustion', definition: 'All pool addresses are in use; further hosts cannot be translated.' },
        { term: 'Translation timeout', definition: 'How long an idle dynamic entry is kept (24 hours by default).' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: dynamic NAT para sa PC2',
      steps: [
        'Naka-configure ang pool na 203.0.113.10–203.0.113.12 at ang ACL 1 na pumapayag sa 192.168.1.0/24.',
        'Nagpapadala ang PC2 (192.168.1.11) ng packet papunta sa internet.',
        'Tinitingnan ng R1 ang ACL; tugma ang source address, kaya kwalipikado ito.',
        'Kumukuha ang R1 ng libreng address mula sa pool (halimbawa 203.0.113.10) at nagtatala ng entry.',
        'Lumalabas ang packet na may bagong source; bumabalik ang sagot at isinasalin pabalik.',
        'Kapag tumagal na walang gumagamit, nag-expire ang entry at bumabalik ang address sa pool.',
      ],
    },
    {
      type: 'cli',
      title: 'Static NAT at dynamic NAT',
      transcript: `R1(config)# ip nat inside source static 192.168.1.50 203.0.113.9
R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255
R1(config)# ip nat pool PUBLIC 203.0.113.10 203.0.113.12 netmask 255.255.255.248
R1(config)# ip nat inside source list 1 pool PUBLIC
R1(config)# interface gi0/0
R1(config-if)# ip nat inside
R1(config-if)# interface gi0/1
R1(config-if)# ip nat outside
R1(config-if)# end
R1# show ip nat translations
Pro Inside global      Inside local       Outside local   Outside global
--- 203.0.113.9        192.168.1.50       ---             ---
--- 203.0.113.10       192.168.1.11       ---             ---`,
      copyable: 'ip nat inside source list 1 pool PUBLIC',
      explain: [
        { line: 'ip nat inside source static 192.168.1.50 203.0.113.9', why: 'Permanent mapping for the server; outside hosts can reach 203.0.113.9.' },
        { line: 'access-list 1 permit 192.168.1.0 0.0.0.255', why: 'Selects which inside hosts may be translated. It is not a firewall rule.' },
        { line: 'ip nat pool PUBLIC ... netmask', why: 'Defines the three public addresses available for dynamic translation.' },
        { line: 'ip nat inside source list 1 pool PUBLIC', why: 'Ties the ACL to the pool, enabling dynamic NAT.' },
        { line: 'Static entry stays', why: 'The static line appears even without traffic; dynamic entries only appear after traffic.' },
      ],
      note: 'Sample for study. The pool and static address must be reachable from the ISP.',
    },
    {
      type: 'verify',
      title: 'Verification at maintenance',
      items: [
        { command: 'show ip nat translations', shows: 'Static entries always, dynamic entries only while in use.' },
        { command: 'show ip nat statistics', shows: 'Pool name, total and allocated addresses, hits and misses.' },
        { command: 'clear ip nat translation *', shows: 'Removes all dynamic entries; use it to recover from exhaustion in a lab.' },
      ],
      good: 'Misses are low, and allocated addresses stay below the pool size.',
      bad: 'Rising misses with the pool fully allocated indicates exhaustion.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **ACL sa NAT** ay **pumipili kung sino ang ita-translate**, hindi kung sino ang papayagan o haharangin. Huwag itong ituring na firewall.' },
    { type: 'callout', kind: 'trap', text: 'Parehong **isa-sa-isa** ang static at dynamic NAT. Ang **pagtitipid ng public address** (maraming host, isang address) ay **PAT**, hindi dynamic NAT.' },
    { type: 'callout', kind: 'tip', text: 'Ang **netmask** ng pool ay dapat tugma sa public subnet; mali ang mask = maling pool. Ang ACL ay **wildcard mask** (0.0.0.255), hindi subnet mask.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Paggamit ng subnet mask sa ACL sa halip na wildcard mask.',
        'Paglimot sa pag-link ng ACL sa pool gamit ang ip nat inside source list.',
        'Pag-asang makapagpapatipid ng address ang dynamic NAT.',
        'Hindi pag-clear ng lumang entry habang nagte-test.',
        'Maling pool range na hindi nakaabot sa ISP.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Ang ika-apat na PC ay hindi makalabas"',
      scenario: 'Three users reach the internet but a fourth cannot. The pool has three addresses.',
      evidence: `R1# show ip nat statistics
Total active translations: 3 (0 static, 3 dynamic; 0 extended)
Pool PUBLIC: netmask 255.255.255.248
  start 203.0.113.10 end 203.0.113.12
  total addresses 3, allocated 3 (100%), misses 7`,
      question: 'Ano ang nangyayari at paano ito aayusin?',
      answer: 'Pool exhaustion: 3 sa 3 address ay nagamit na, at 7 ang miss. Dynamic NAT ay isa-sa-isa kaya hindi na kasya ang ika-apat na host.',
      fix: 'Enlarge the pool, or better, convert to PAT (ip nat inside source list 1 interface gi0/1 overload) so many hosts share one address. Use clear ip nat translation * to free entries during testing.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Kailangan ng web server na 192.168.1.80 ng permanenteng public address 203.0.113.20. Isulat ang command at sabihin kung bakit hindi dynamic ang tamang uri.',
      answer: 'ip nat inside source static 192.168.1.80 203.0.113.20. Hindi dynamic dahil nagbabago ang address mula sa pool; kailangan ng labas ng permanenteng address para makapag-umpisa ng koneksyon sa server.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Static: ip nat inside source static <local> <global>.',
        'Dynamic needs three pieces: ACL, pool and ip nat inside source list <acl> pool <name>.',
        'Both are one-to-one; only PAT shares one address among many hosts.',
        'NAT ACLs use wildcard masks and select hosts to translate.',
        'Pool exhaustion shows as 100% allocated with rising misses.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Static NAT is permanent and suits servers; dynamic NAT borrows from a pool.',
        'Dynamic NAT needs an ACL, a pool and a rule linking them.',
        'One-to-one translation can run out of addresses.',
        'Susunod: PAT — maraming host, isang public address.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'easy', type: 'single',
    prompt: 'Which NAT type creates a permanent one-to-one mapping?',
    choices: ['Dynamic NAT', 'Static NAT', 'PAT', 'NAT64'], correct: [1],
    explanation: 'Static NAT maps one inside local address to one inside global address permanently.',
    wrong: { 0: 'Dynamic mappings are temporary.', 2: 'PAT shares one address among many hosts.', 3: 'NAT64 translates between IPv6 and IPv4.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'easy', type: 'single',
    prompt: 'Which command creates a static NAT entry?',
    choices: ['ip nat inside source static 192.168.1.50 203.0.113.9', 'ip nat static 192.168.1.50 203.0.113.9', 'nat inside static 192.168.1.50', 'ip nat pool STATIC 192.168.1.50'], correct: [0],
    explanation: 'ip nat inside source static <inside local> <inside global> is the syntax.',
    wrong: { 1: 'Missing "inside source".', 2: 'Not valid IOS syntax.', 3: 'A pool defines a range, not a static mapping.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'Which command defines the public addresses for dynamic NAT?',
    choices: ['ip nat pool', 'ip nat range', 'ip address pool', 'access-list pool'], correct: [0],
    explanation: 'ip nat pool <name> <start> <end> netmask <mask> defines the pool.',
    wrong: { 1: 'Not valid IOS syntax.', 2: 'Not valid IOS syntax.', 3: 'An ACL does not define addresses to translate into.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'What is the role of the ACL in a dynamic NAT configuration?',
    choices: ['Blocks malicious traffic', 'Identifies which inside addresses are translated', 'Defines the public pool', 'Marks the outside interface'], correct: [1],
    explanation: 'The ACL selects eligible inside local addresses; it is not a firewall.',
    wrong: { 0: 'NAT ACLs do not filter traffic.', 2: 'The pool does that.', 3: 'ip nat outside does that.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'A dynamic NAT pool has four addresses and a fifth host tries to leave. What happens?',
    choices: ['The fifth host shares an address', 'The fifth host cannot be translated until an entry frees up', 'The router adds addresses', 'The router switches to static NAT'], correct: [1],
    explanation: 'Dynamic NAT is one-to-one, so an exhausted pool blocks additional hosts.',
    wrong: { 0: 'Sharing is PAT behaviour.', 2: 'Routers do not invent addresses.', 3: 'No automatic switch occurs.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'Which command clears all dynamic NAT translations?',
    choices: ['clear ip nat translation *', 'reset nat', 'no ip nat', 'clear nat table all'], correct: [0],
    explanation: 'clear ip nat translation * removes dynamic entries.',
    wrong: { 1: 'Not valid IOS syntax.', 2: 'That removes configuration, not entries.', 3: 'Not valid IOS syntax.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO items are required for dynamic NAT?',
    choices: ['An ACL selecting inside addresses', 'A NAT pool', 'A static route to every host', 'An IPv6 address'], correct: [0, 1],
    explanation: 'Dynamic NAT needs an ACL and a pool, tied together by ip nat inside source list.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: dynamic NAT allows many hosts to share a single public address.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — dynamic NAT is one-to-one; sharing one address is PAT.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: static vs dynamic NAT?', back: 'Static = Server: permanente, isa-sa-isa, puwedeng simulan ng labas. Dynamic = Pool: hiram, isa-sa-isa din; ACL + pool + rule. Pool ubos = hindi makalabas ang susunod.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'command', front: 'Static NAT command?', back: 'ip nat inside source static <inside local> <inside global>' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'command', front: 'Dynamic NAT three steps?', back: '1) access-list permit inside hosts; 2) ip nat pool NAME start end netmask; 3) ip nat inside source list N pool NAME.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'concept', front: 'What is pool exhaustion?', back: 'All public addresses in the pool are in use, so additional inside hosts cannot be translated.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'command', front: 'Clear NAT entries?', back: 'clear ip nat translation *' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Which NAT type for a public web server?', back: 'Static NAT, because outside hosts need a permanent address to initiate connections.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Configure static and dynamic NAT, then exhaust the pool',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Publish an inside server with static NAT, give users a three-address dynamic pool and watch it run out.',
  topology: 'LAN switch with a server and four PCs behind R1; R1 connects to an ISP router and an outside web server.',
  steps: [
    'Mark R1 LAN interface ip nat inside and the ISP interface ip nat outside.',
    'Add static NAT for the inside server to 203.0.113.9 and test from the outside host.',
    'Create ACL 1 permitting the LAN, a pool of three addresses and ip nat inside source list 1 pool PUBLIC.',
    'Ping the outside server from PC1, PC2 and PC3 and check show ip nat translations.',
    'Ping from PC4 and observe failure; check show ip nat statistics for misses.',
    'Run clear ip nat translation * and retry PC4.',
  ],
  checklist: [
    'Static entry visible and reachable from outside',
    'Three dynamic entries created',
    'Pool exhaustion reproduced',
    'Recovered with clear ip nat translation *',
  ],
  hints: [
    'The ISP needs routes to the pool and static addresses.',
    'Use wildcard masks in the ACL.',
  ],
  solution: [
    'The static mapping remains after clearing; dynamic entries are removed.',
    'PC4 fails because three addresses are allocated.',
  ],
  breakIt: 'Change the ACL to permit a different subnet and watch dynamic translation stop while static still works.',
};
