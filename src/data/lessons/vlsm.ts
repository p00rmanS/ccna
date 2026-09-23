import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'vlsm';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.13',
  domain: 'D1',
  title: 'VLSM: Right-Sizing Your Subnets',
  description: 'Variable Length Subnet Masking: give each network exactly the size it needs, largest first, with no overlap.',
  whyMatters:
    'Sa totoong network, hindi pare-pareho ang laki ng LAN: may 100 users sa HQ pero 2 device lang sa WAN link. Kung pare-pareho ang laki ng subnet, sayang ang addresses. Ang VLSM ang solusyon — at madalas itong lumalabas sa exam at sa capstone lab.',
  objectives: [
    'Explain the problem VLSM solves',
    'Choose the smallest prefix that fits a host requirement',
    'Allocate networks largest first without overlap',
    'Turn a VLSM plan into interface configuration',
    'Detect an overlapping subnet plan',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['VLSM', 'variable length subnet mask', 'subnet plan', 'address allocation', 'overlap', 'WAN link', '/30'],
  examObjectives: ['1.6'],
  sections: [
    {
      type: 'explain',
      simple: [
        'With plain subnetting every subnet is the same size. But real networks are not: one office may need 100 addresses while a link between two routers needs only 2.',
        'VLSM lets you use a different prefix length for each network, so each one gets just enough addresses and very little is wasted.',
      ],
      taglish: [
        'Sa ordinaryong subnetting, **pare-pareho** ang laki ng bawat subnet. Pero sa totoong buhay, iba-iba ang pangangailangan: ang HQ ay may 100 users, ang Sales ay 50, at ang link sa pagitan ng dalawang router ay **dalawa lang** ang kailangan.',
        'Kung /25 (126 hosts) ang ibibigay mo sa WAN link na dalawa lang ang device, **sayang ang 124 addresses**. Ang **VLSM** ay nagbibigay ng **iba-ibang laki** ng subnet — tama lang para sa bawat network.',
        'Ang proseso: (1) isulat ang hosts na kailangan ng bawat network, (2) dagdagan ng **+2** (network at broadcast), (3) **bilugin pataas** sa pinakamalapit na 2, 4, 8, 16, 32, 64, 128… (4) simulan sa **pinakamalaki**, (5) ang susunod na network ay magsisimula kung saan natapos ang nauna.',
      ],
      technical: [
        'VLSM allocates subnets of different prefix lengths from one address block. For each requirement of H hosts, choose the smallest h such that 2^h − 2 ≥ H and use prefix 32 − h. Point-to-point router links need only 2 hosts, so /30 (or /31 where supported) is used.',
        'Allocate in descending order of size. Every block is a power of two and must start at a multiple of its own size, so placing the largest first keeps all later blocks aligned automatically, prevents overlap and leaves the free space in one contiguous piece at the end. The next block starts immediately after the previous one ends.',
        'Overlap occurs when two subnets share addresses. A router will refuse it (“% 192.168.100.64 overlaps with GigabitEthernet0/0”), and summarisation and troubleshooting become far harder.',
      ],
    },
    {
      type: 'analogy',
      title: 'Pag-iimpake ng maleta',
      body: [
        'Packing a suitcase: put the big items in first, then fill the gaps with small ones. If you start with socks, the big bag no longer fits. In VLSM the biggest network goes first, and the tiny link networks slot in after.',
      ],
      taglish: [
        'Parang pag-iimpake ng maleta: ilagay muna ang **malalaking gamit** (jacket, sapatos), tapos ang **maliliit** (medyas, charger) sa mga siwang. Kapag inuna mo ang medyas, hindi na kasya ang malaking bag. Sa VLSM, ang pinakamalaking network ang una, at ang maliliit na link ay isusunod.',
      ],
    },
    {
      type: 'hook',
      title: 'Malaki muna, maliit mamaya',
      trick: '**+2, BILOG, MALAKI MUNA.** Idagdag ang 2 → bilugin pataas sa 2·4·8·16·32·64·128 → simulan sa pinakamalaki.',
      taglish: [
        '**+2** = sinasama mo ang network at broadcast address (hindi sila pwedeng tirahan).',
        '**BILOG** = ang laki ng bloke ay laging power of two, kaya bilugin pataas: 100+2 = 102 → **128**; 50+2 = 52 → **64**; 20+2 = 22 → **32**; 2+2 = 4 → **4**.',
        '**MALAKI MUNA** = tulad ng maleta — ang pinakamalaking network ang unang lalagay para pantay ang hanay at walang overlap.',
        'Ang laki ng bloke ay direkta ang prefix: 128 → /25, 64 → /26, 32 → /27, 16 → /28, 8 → /29, 4 → /30.',
      ],
      test: {
        question: 'Kailangan ng 60 hosts. Anong prefix, at bakit hindi /27?',
        answer: '60 + 2 = 62 → bilog pataas sa 64 → /26 (64 addresses, 62 usable). Ang /27 ay 32 addresses lang (30 usable), kaya hindi kasya.',
      },
    },
    { type: 'interactive', id: 'vlsm-planner', caption: 'Ilagay ang mga network at hosts. Awtomatikong ilalagay ang bawat isa — malaki muna.' },
    {
      type: 'terms',
      items: [
        { term: 'VLSM', definition: 'Using different prefix lengths inside one address block.' },
        { term: 'Host requirement', definition: 'The number of usable host addresses a network needs.' },
        { term: 'Block', definition: 'The address range of one subnet (a power of two in size).' },
        { term: 'Alignment', definition: 'A block must start at a multiple of its own size.' },
        { term: 'Overlap', definition: 'Two subnets sharing addresses — always a planning error.' },
        { term: 'Point-to-point link', definition: 'A link between exactly two routers; a /30 (2 usable hosts) is typical.' },
        { term: 'Free space', definition: 'Addresses left unallocated for future growth.' },
      ],
    },
    {
      type: 'flow',
      title: 'Halimbawa: 192.168.100.0/24',
      steps: [
        'Mga kailangan: HQ 100, Sales 50, IT 20, WAN Link 1 = 2, WAN Link 2 = 2.',
        'HQ: 100 + 2 = 102 → 128 → **/25**. Ilagay sa 192.168.100.0/25 (0–127).',
        'Sales: 50 + 2 = 52 → 64 → **/26**. Susunod sa 128: 192.168.100.128/26 (128–191).',
        'IT: 20 + 2 = 22 → 32 → **/27**. Susunod sa 192: 192.168.100.192/27 (192–223).',
        'WAN 1: 2 + 2 = 4 → **/30**. Susunod sa 224: 192.168.100.224/30 (224–227). WAN 2: 192.168.100.228/30 (228–231).',
        'Ginamit: 128 + 64 + 32 + 4 + 4 = 232 addresses. Libre: 232–255 = **24 addresses** para sa paglaki.',
      ],
    },
    {
      type: 'list',
      variant: 'remember',
      title: 'Hosts → prefix (kabisaduhin ang mga hangganan)',
      items: [
        '2 hosts → /30 (4 addresses, 2 usable)',
        '3–6 hosts → /29 (8, 6 usable)',
        '7–14 hosts → /28 (16, 14 usable)',
        '15–30 hosts → /27 (32, 30 usable)',
        '31–62 hosts → /26 (64, 62 usable)',
        '63–126 hosts → /25 (128, 126 usable)',
        '127–254 hosts → /24 (256, 254 usable)',
      ],
    },
    {
      type: 'cli',
      title: 'Gawing configuration ang plano',
      transcript: `R1(config)# interface gigabitEthernet 0/0
R1(config-if)# description HQ LAN 192.168.100.0/25
R1(config-if)# ip address 192.168.100.1 255.255.255.128
R1(config-if)# no shutdown
R1(config-if)# interface gigabitEthernet 0/1
R1(config-if)# description Sales LAN 192.168.100.128/26
R1(config-if)# ip address 192.168.100.129 255.255.255.192
R1(config-if)# no shutdown
R1(config-if)# interface gigabitEthernet 0/2
R1(config-if)# description WAN to R2 192.168.100.224/30
R1(config-if)# ip address 192.168.100.225 255.255.255.252
R1(config-if)# no shutdown`,
      copyable: 'interface gigabitEthernet 0/0\ndescription HQ LAN 192.168.100.0/25\nip address 192.168.100.1 255.255.255.128\nno shutdown\ninterface gigabitEthernet 0/1\ndescription Sales LAN 192.168.100.128/26\nip address 192.168.100.129 255.255.255.192\nno shutdown\ninterface gigabitEthernet 0/2\ndescription WAN to R2 192.168.100.224/30\nip address 192.168.100.225 255.255.255.252\nno shutdown',
      explain: [
        { line: 'ip address 192.168.100.1 255.255.255.128', why: 'First usable host of the /25 becomes the router’s address — it will be the gateway for HQ hosts.' },
        { line: '255.255.255.192', why: 'A /26 mask. Different interfaces now have different masks: that is VLSM in action.' },
        { line: '192.168.100.225 255.255.255.252', why: 'A /30 for the router-to-router link. Its two usable addresses are .225 and .226 — one per router.' },
        { line: 'description …', why: 'Document the subnet on the interface so you can read the plan from show running-config.' },
      ],
      note: 'Verify with show ip interface brief and show ip route connected. Routing between these networks comes in the routing module.',
    },
    { type: 'callout', kind: 'trap', text: 'Huwag kalimutan ang **+2**: 30 hosts sa isang /27 ay OK (30 usable), pero 31 hosts ay kailangan na ng /26. Ang exam ay laging naglalagay ng bilang na nasa hangganan (30, 62, 126).' },
    { type: 'callout', kind: 'trap', text: 'Ang isang block ay dapat magsimula sa multiple ng sarili nitong laki. Ang /26 ay hindi pwedeng magsimula sa .32 — ang valid na simula ay .0, .64, .128, .192 lang.' },
    { type: 'callout', kind: 'tip', text: 'Isulat ang plano bilang talaan: pangalan | hosts | prefix | network | range | broadcast. Kapag nasa talaan, kitang-kita agad kung may overlap.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Forgetting the +2 for network and broadcast.',
        'Placing small networks first, which breaks alignment and wastes space.',
        'Giving a WAN link a /24. A router-to-router link needs only a /30.',
        'Creating overlapping subnets by starting a block in the middle of another.',
        'Using the mask of one network on an interface that belongs to another.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: “Overlap” sa router',
      scenario: 'A junior engineer planned 192.168.100.0/25 for HQ and 192.168.100.64/26 for Sales, then tried to configure both on the router.',
      evidence: `R1(config-if)# ip address 192.168.100.65 255.255.255.192
% 192.168.100.64 overlaps with GigabitEthernet0/0`,
      question: 'Bakit tumatanggi ang router, at paano ito aayusin?',
      answer: '192.168.100.0/25 covers 192.168.100.0–127. The /26 starting at .64 covers .64–127, which is inside the /25. The two subnets share addresses, so the router refuses the second one.',
      fix: 'Re-plan largest first: HQ 192.168.100.0/25, Sales 192.168.100.128/26. Then re-enter the interface address and verify with show ip interface brief.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Plan 172.16.0.0/24 for: Servers 60 hosts, Users 30 hosts, Printers 10 hosts, one WAN link. Isulat ang network/prefix ng bawat isa at ilan ang libre.',
      answer: 'Servers 60 → 62 → 64 → /26 = 172.16.0.0/26 (0–63). Users 30 → 32 → /27 = 172.16.0.64/27 (64–95). Printers 10 → 12 → 16 → /28 = 172.16.0.96/28 (96–111). WAN → /30 = 172.16.0.112/30 (112–115). Free: 116–255 = 140 addresses.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Sort by size, largest first, before you assign anything.',
        'Router-to-router links use /30 (two usable hosts).',
        'Check each result: usable hosts ≥ requirement.',
        'Overlapping ranges are always wrong.',
      ],
    },
    {
      type: 'summary',
      points: [
        'VLSM gives each network the smallest block that fits its hosts.',
        'Formula: hosts + 2, round up to a power of two, prefix = 32 − host bits.',
        'Allocate largest first; each block starts where the last ended.',
        'WAN links between two routers use /30.',
        'Never overlap subnets.',
        'Susunod: IPv6 — ang address system na hindi mauubusan.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'Which prefix is the smallest that fits a LAN of 100 hosts?',
    choices: ['/24', '/25', '/26', '/27'], correct: [1],
    explanation: '100 + 2 = 102, which rounds up to 128 addresses = /25 (126 usable).',
    wrong: { 0: '/24 works but wastes addresses.', 2: '/26 has only 62 usable hosts.', 3: '/27 has only 30 usable hosts.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'Which prefix is best for a link between two routers?',
    choices: ['/24', '/28', '/29', '/30'], correct: [3],
    explanation: 'A /30 has exactly two usable addresses — one for each router.',
    wrong: { 0: 'Wastes 252 addresses.', 1: 'Wastes 12 addresses.', 2: 'Wastes 4 addresses.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'A department needs 50 hosts. Which network fits with the least waste?',
    choices: ['/27', '/26', '/25', '/24'], correct: [1],
    explanation: '50 + 2 = 52 → 64 addresses = /26 (62 usable). /27 holds only 30.',
    wrong: { 0: 'Only 30 usable hosts.', 2: 'Works but wastes 76 addresses.', 3: 'Works but wastes far more.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'Why do you allocate the largest network first in VLSM?',
    choices: ['Routers require it', 'It keeps blocks aligned and avoids overlap and fragmentation', 'It uses fewer IP addresses in total', 'It makes the mask longer'], correct: [1],
    explanation: 'Blocks must start at multiples of their own size. Largest-first keeps everything aligned and leaves the free space in one piece.',
    wrong: { 0: 'No router requires it; it is a planning best practice.', 2: 'The total used is the same; only alignment and waste differ.', 3: 'The mask length depends on each network’s size.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'hard', type: 'single',
    prompt: 'Using 192.168.100.0/24 with requirements HQ 100, Sales 50, IT 20, WAN 2 and WAN 2 (largest first), what is the IT network?',
    choices: ['192.168.100.128/27', '192.168.100.192/27', '192.168.100.192/28', '192.168.100.224/27'], correct: [1],
    explanation: 'HQ takes 0–127 (/25), Sales 128–191 (/26), so IT (20 → /27) starts at 192: 192.168.100.192/27.',
    wrong: { 0: '.128 is already used by Sales.', 2: '/28 holds only 14 hosts.', 3: '.224 is where the WAN links start.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'hard', type: 'single',
    prompt: 'After allocating 100, 50, 20, 2 and 2 hosts from a /24 (largest first), how many addresses are left unused?',
    choices: ['0', '24', '32', '56'], correct: [1],
    explanation: 'Used: 128 + 64 + 32 + 4 + 4 = 232. 256 − 232 = 24 free.',
    wrong: { 0: 'There is spare capacity.', 2: 'That would be one more /27.', 3: 'That is not the remaining count.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: 192.168.100.0/25 and 192.168.100.64/26 overlap.',
    choices: ['True', 'False'], correct: [0],
    explanation: '/25 covers .0–.127 and the /26 covers .64–.127, so the /26 is entirely inside the /25.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are good reasons to use a /30 on a router-to-router link?',
    choices: ['Only two addresses are needed', 'It conserves address space', 'It supports 30 hosts', 'It is required by OSPF'], correct: [0, 1],
    explanation: 'The link needs two addresses, and a /30 provides exactly two usable ones with no waste. It does not hold 30 hosts and OSPF does not require it.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'A LAN needs 500 hosts. What is the smallest prefix that fits?',
    choices: ['/22', '/23', '/24', '/25'], correct: [1],
    explanation: '500 + 2 = 502 → 512 addresses = /23 (510 usable).',
    wrong: { 0: '/22 (1022) works but wastes more.', 2: '/24 has only 254 usable.', 3: '/25 has only 126 usable.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Pro tip: paano tandaan ang VLSM?', back: '+2, BILOG, MALAKI MUNA. Idagdag ang 2, bilugin pataas sa power of two, simulan sa pinakamalaking network (parang maleta: malalaki muna).' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'What is VLSM?', back: 'Using different prefix lengths for different subnets inside one address block.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'How do you pick the prefix for H hosts?', back: 'Smallest h with 2^h − 2 ≥ H; prefix = 32 − h.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Which prefix for a router-to-router link?', back: '/30 (two usable hosts).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Prefixes for 126, 62, 30, 14, 6, 2 usable hosts?', back: '/25, /26, /27, /28, /29, /30.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Why largest-first?', back: 'Keeps blocks aligned, prevents overlap and leaves free space contiguous.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'What does an overlap look like on a router?', back: '“% <network> overlaps with <interface>” when you configure the second address.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Rule for where a block may start?', back: 'At a multiple of its own size (e.g. a /26 starts at .0, .64, .128 or .192).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Design a VLSM plan for a small company',
  tool: 'Paper',
  minutes: 35,
  objective: 'Plan the addressing for a company from a single block, check it with the planner and turn part of it into router configuration.',
  addressing: [
    { device: 'HQ LAN', interface: 'needs 200 hosts', address: '?' },
    { device: 'Branch A LAN', interface: 'needs 60 hosts', address: '?' },
    { device: 'Branch B LAN', interface: 'needs 28 hosts', address: '?' },
    { device: 'WAN link HQ–A', interface: '2 hosts', address: '?' },
    { device: 'WAN link HQ–B', interface: '2 hosts', address: '?' },
  ],
  steps: [
    'You have been given 10.10.0.0/23 (512 addresses).',
    'Write each requirement, add 2, round up to a power of two, and note the prefix.',
    'Sort largest first and allocate each block starting where the previous one ended. Write network, range and broadcast for every block.',
    'Check that no blocks overlap and that each starts at a multiple of its own size.',
    'Type your requirements into the VLSM planner above and compare with your answer. Fix any difference.',
    'Write the interface commands (ip address with the correct mask) for the HQ LAN and the WAN link to Branch A, using the first usable address on each.',
    'State how many addresses are left free.',
  ],
  checklist: [
    'Every requirement converted to a prefix',
    'Blocks allocated largest first with no overlap',
    'Planner output matches your paper plan',
    'Interface configuration written with correct masks',
    'Free address count stated',
  ],
  hints: [
    '200 hosts + 2 = 202 → 256 addresses, which is a /24 — half of your /23.',
    'The two /30 WAN links come last, after the /27.',
  ],
  solution: [
    'HQ 200 → /24: 10.10.0.0/24. Branch A 60 → /26: 10.10.1.0/26. Branch B 28 → /27: 10.10.1.64/27. WAN HQ–A → /30: 10.10.1.96/30. WAN HQ–B → /30: 10.10.1.100/30.',
    'Free: 10.10.1.104 – 10.10.1.255 = 152 addresses (512 − 360).',
    'HQ interface: ip address 10.10.0.1 255.255.255.0. WAN to A: ip address 10.10.1.97 255.255.255.252.',
  ],
  breakIt: 'Re-do the plan smallest-first (WAN links, then Branch B, A, HQ) and observe the alignment problems and how much space is wasted or how the plan fails.',
};
