import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ipv6-address-types';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.15',
  domain: 'D1',
  title: 'IPv6 Address Types',
  description: 'Global unicast, link-local, unique local, multicast, anycast, loopback and modified EUI-64 — and how to tell them apart at a glance.',
  whyMatters:
    'Sa IPv6, iisang interface ay may maraming address na magkakaiba ang gamit. Ang exam ay laging nagtatanong: “anong uri ito?” at “paano nabuo ang interface ID?” Kapag alam mo ang unang digits, alam mo na agad ang sagot.',
  objectives: [
    'Identify an IPv6 address type from its first digits',
    'Explain global unicast, link-local, unique local, multicast and anycast',
    'Recognise loopback and unspecified addresses',
    'Name the well-known multicast addresses',
    'Build a modified EUI-64 interface ID from a MAC address',
    'Explain why an interface has several IPv6 addresses',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['global unicast', 'link-local', 'unique local', 'multicast', 'anycast', 'loopback', 'EUI-64', 'FE80', 'ff02'],
  examObjectives: ['1.9'],
  sections: [
    {
      type: 'explain',
      simple: [
        'An IPv6 interface usually has several addresses at once, and each kind has a different job. You can tell the kind from the first few digits.',
        'A global address works on the internet. A link-local address works only on the local link. A unique local address is private. A multicast address talks to a group.',
      ],
      taglish: [
        'Sa IPv6, ang isang interface ay kadalasang may **higit sa isang address** at bawat isa ay may iba’t ibang trabaho. Ang magandang balita: **makikilala mo ang uri sa unang mga digit lang**.',
        '**Global unicast** (`2000::/3`, nagsisimula sa 2 o 3) = pang-internet, parang public IPv4. **Link-local** (`FE80::/10`) = sa iisang link lang, awtomatikong nabubuo, hindi nagra-route. **Unique local** (`FC00::/7`, karaniwang `FD..`) = private, tulad ng 192.168.x.x. **Multicast** (`FF00::/8`) = para sa grupo ng mga device. Wala nang broadcast.',
        'Mayroon ding **anycast** (parehong address sa maraming device; ang pinakamalapit ang sumasagot), **loopback** `::1` (sarili mo), at **unspecified** `::` (wala pang address).',
        'Ang **interface ID** ay pwedeng buuin mula sa MAC address gamit ang **modified EUI-64**: hatiin ang MAC sa gitna, ilagay ang `FFFE`, at i-flip ang ika-7 bit ng unang byte.',
      ],
      technical: [
        'Global unicast (GUA): 2000::/3 — publicly routable. Link-local unicast: FE80::/10 (fe80–febf) — valid only on one link, never forwarded by routers, created automatically on every IPv6-enabled interface, and used for neighbour discovery and often as the next hop. Unique local (ULA): FC00::/7 (in practice FD00::/8) — private, routable inside an organisation. Multicast: FF00::/8; the fourth hex digit gives scope (ff02 = link-local; ff05 = site; ff0e = global). Loopback ::1/128; unspecified ::/128. Anycast addresses are unicast addresses assigned to more than one device; routing delivers to the nearest.',
        'Well-known link-local multicast: ff02::1 all nodes, ff02::2 all routers, ff02::5 OSPFv3 routers, ff02::6 OSPFv3 DR/BDR, ff02::a EIGRP routers, and solicited-node multicast ff02::1:ffXX:XXXX (used by NDP instead of ARP broadcasts).',
        'Modified EUI-64 builds a 64-bit interface ID from a 48-bit MAC: split the MAC into two halves, insert FFFE between them, and invert the universal/local bit (the 7th bit of the first byte, value 0x02). Example: MAC 00:1A:2B:3C:4D:5E → 021A:2BFF:FE3C:4D5E. Cisco routers use EUI-64 for auto-generated link-local addresses; many PCs use randomised interface IDs for privacy.',
      ],
    },
    {
      type: 'analogy',
      title: 'Mundo, kapitbahay, pamilya at group chat',
      body: [
        'A global address is your full postal address that anyone in the world can use. A link-local address is calling out to your next-door neighbour — it only works on your street. A unique local address is a family nickname used only inside the household. A multicast address is a group chat: one message reaches everyone in the group.',
      ],
      taglish: [
        'Ang **global** ay parang buong postal address mo na pwedeng gamitin ng kahit sino sa mundo. Ang **link-local** ay parang pagtawag sa **kapitbahay** — gumagana lang sa kalye ninyo. Ang **unique local** ay parang palayaw sa **pamilya** — gamit lang sa loob ng bahay. Ang **multicast** ay parang **group chat** — isang mensahe, lahat ng miyembro ang nakakatanggap.',
      ],
    },
    {
      type: 'hook',
      title: 'Mundo · Kapitbahay · Pamilya · Grupo',
      trick: '**2 = MUNDO** · **FE80 = KAPITBAHAY** · **FC/FD = PAMILYA** · **FF = GRUPO**',
      taglish: [
        'Tingnan lang ang **una** na digits: **2 (o 3)** = **Mundo** (global, pang-internet). **FE80** = **Kapitbahay** (link-local, sa isang link lang). **FC o FD** = **Pamilya** (unique local, private). **FF** = **Grupo** (multicast).',
        'Dagdag: `::1` = **sarili mo** (loopback) at `::` = **wala pang address**.',
        'Para sa EUI-64, tatlong salita: **Hati — FFFE — Baligtad**. **Hati** ang MAC sa gitna, ilagay ang **FFFE**, at **baligtarin** ang ika-7 bit (00 → 02).',
      ],
      test: {
        question: 'Anong uri ang bawat isa: `fd12:3456:789a::1`, `ff02::5`, `2001:db8::1`, `fe80::1`?',
        answer: '`fd12:…` = Pamilya (unique local/private). `ff02::5` = Grupo (multicast — OSPFv3 routers). `2001:db8::1` = Mundo (global unicast; documentation prefix). `fe80::1` = Kapitbahay (link-local).',
      },
    },
    { type: 'diagram', id: 'ipv6-types', caption: 'Anim na uri ng IPv6 address, kilalanin sa unang digits.' },
    { type: 'interactive', id: 'ipv6-classify', caption: 'Ilagay ang address para makita ang uri nito, at ilagay ang MAC para makabuo ng EUI-64.' },
    {
      type: 'terms',
      items: [
        { term: 'Global unicast (GUA)', definition: '2000::/3 — publicly routable, like a public IPv4 address.' },
        { term: 'Link-local (LLA)', definition: 'FE80::/10 — valid only on the local link; never routed.' },
        { term: 'Unique local (ULA)', definition: 'FC00::/7 (FD00::/8 in practice) — private addressing inside an organisation.' },
        { term: 'Multicast', definition: 'FF00::/8 — one-to-many; replaces broadcast.' },
        { term: 'Anycast', definition: 'One address on several devices; the nearest answers.' },
        { term: 'Loopback', definition: '::1/128 — this device.' },
        { term: 'Unspecified', definition: '::/128 — “no address yet”.' },
        { term: 'Modified EUI-64', definition: 'Interface ID built from the MAC by inserting FFFE and flipping the U/L bit.' },
        { term: 'Solicited-node multicast', definition: 'ff02::1:ffXX:XXXX — used by NDP to find a neighbour instead of ARP.' },
      ],
    },
    {
      type: 'flow',
      title: 'EUI-64, hakbang-hakbang: MAC 00:1A:2B:3C:4D:5E',
      steps: [
        '**Hati**: hatiin sa gitna → `00:1A:2B` at `3C:4D:5E`.',
        '**FFFE**: ilagay sa gitna → `00:1A:2B:FF:FE:3C:4D:5E`.',
        '**Baligtad**: i-flip ang ika-7 bit ng unang byte. `00` = `0000 0000` → `0000 0010` = `02`.',
        'Ayusin sa 4 na kahon: `021A:2BFF:FE3C:4D5E`.',
        'Idagdag ang prefix: link-local = `FE80::021A:2BFF:FE3C:4D5E` → pinaikli `fe80::21a:2bff:fe3c:4d5e`.',
      ],
    },
    {
      type: 'list',
      variant: 'remember',
      title: 'Mga multicast na dapat mong makilala',
      items: [
        '`ff02::1` — all nodes (halos katumbas ng broadcast)',
        '`ff02::2` — all routers',
        '`ff02::5` — OSPFv3 routers · `ff02::6` — OSPFv3 DR/BDR',
        '`ff02::a` — EIGRP routers',
        '`ff02::1:ffXX:XXXX` — solicited-node (para sa NDP)',
      ],
    },
    {
      type: 'cli',
      title: 'Maraming address sa isang interface',
      transcript: `R1# show ipv6 interface brief
GigabitEthernet0/0     [up/up]
    FE80::1
    2001:DB8:ACAD:1::1
GigabitEthernet0/1     [up/up]
    FE80::1
    2001:DB8:ACAD:2::1`,
      copyable: 'show ipv6 interface brief',
      explain: [
        { line: 'FE80::1', why: 'The link-local address. Both interfaces can use the same one because a link-local address only needs to be unique on its own link.' },
        { line: '2001:DB8:ACAD:1::1', why: 'A global unicast address on the first network.' },
        { line: '[up/up]', why: 'Status and protocol, exactly as for IPv4.' },
        { line: 'Two addresses per interface', why: 'Normal in IPv6: link-local for local control traffic and a global (or unique local) address for routing.' },
      ],
      note: 'Cisco prints IPv6 in upper case. The commands to configure these addresses come in the IPv6 configuration module.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **link-local ay hindi na-route**. Ang router ay hindi magpapasa ng packet na may FE80 source/destination sa ibang network. Kaya kapag nag-ping ka ng link-local address, kailangang sabihin sa router kung anong interface ang gagamitin.' },
    { type: 'callout', kind: 'trap', text: 'Sa EUI-64, ang binabaligtad ay ang **ika-7 bit** ng unang byte (halaga 0x02), hindi ang unang bit. `00` → `02`, `02` → `00`, `5C` → `5E`.' },
    { type: 'callout', kind: 'tip', text: 'Ang anycast ay walang sariling prefix — kinukuha ito sa unicast range. Kaya ang anycast ay hindi mo makikilala sa unang digits; ang exam ay tinatanong ang konsepto, hindi ang pormat.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Thinking FE80 addresses can cross a router.',
        'Believing an interface can only have one IPv6 address.',
        'Forgetting to flip the 7th bit in EUI-64 (or flipping the wrong bit).',
        'Calling FF02::1 “broadcast”. It is all-nodes multicast.',
        'Assuming every FC/FD address is public. They are private.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: “Bakit humihingi ng interface ang ping?”',
      scenario: 'From R1 an engineer pings the neighbour’s link-local address. IOS asks for an output interface before it will send anything.',
      evidence: `R1# ping fe80::2
Output Interface: `,
      question: 'Bakit kailangan ng router na malaman ang interface?',
      answer: 'A link-local address is only unique on its own link, and R1 has FE80 addresses on several interfaces. The same fe80::2 could exist on any of them, so the router must be told which link to send the packet out.',
      fix: 'Enter the interface (for example GigabitEthernet0/0) at the prompt, or ping the neighbour’s global address instead: ping 2001:db8:acad:1::2.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Uriin: (a) fe81::1 (b) fc00::5 (c) 3001::1 (d) ff02::2 (e) ::. Tapos gumawa ng EUI-64 link-local para sa MAC 5C:26:0A:12:34:56.',
      answer: '(a) Link-local (FE80::/10 includes fe80–febf). (b) Unique local. (c) Global unicast. (d) Multicast — all routers. (e) Unspecified. EUI-64: 5C → 5E, insert FFFE → 5e26:0aff:fe12:3456; link-local fe80::5e26:aff:fe12:3456.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Know the four prefixes: 2000::/3, FE80::/10, FC00::/7, FF00::/8.',
        'Every IPv6 interface has a link-local address.',
        'EUI-64: split, insert FFFE, flip the 7th bit.',
        'ff02::1 all nodes, ff02::2 all routers, ff02::5/6 OSPFv3.',
      ],
    },
    {
      type: 'summary',
      points: [
        'First digits tell the type: 2/3 global, FE80 link-local, FC/FD unique local, FF multicast.',
        'An interface normally has a link-local plus one or more global/unique-local addresses.',
        'Link-local addresses are never routed.',
        'IPv6 uses multicast instead of broadcast; anycast delivers to the nearest.',
        'Modified EUI-64: Hati — FFFE — Baligtad.',
        'Susunod: ang mga kasunod na module — VLANs at switching.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.9', difficulty: 'easy', type: 'single',
    prompt: 'Which prefix is used for IPv6 global unicast addresses?',
    choices: ['FE80::/10', '2000::/3', 'FC00::/7', 'FF00::/8'], correct: [1],
    explanation: 'Global unicast addresses come from 2000::/3 (they start with 2 or 3).',
    wrong: { 0: 'FE80::/10 is link-local.', 2: 'FC00::/7 is unique local.', 3: 'FF00::/8 is multicast.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.9', difficulty: 'easy', type: 'single',
    prompt: 'Which type of address starts with FE80?',
    choices: ['Global unicast', 'Link-local', 'Unique local', 'Multicast'], correct: [1],
    explanation: 'FE80::/10 is the link-local range.',
    wrong: { 0: 'Global starts with 2 or 3.', 2: 'Unique local starts with FC or FD.', 3: 'Multicast starts with FF.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.9', difficulty: 'medium', type: 'single',
    prompt: 'What type of address is fd12:3456:789a::1?',
    choices: ['Global unicast', 'Link-local', 'Unique local', 'Multicast'], correct: [2],
    explanation: 'FC00::/7 (FC and FD) is the unique local (private) range.',
    wrong: { 0: 'Global unicast starts with 2 or 3.', 1: 'Link-local starts with FE80.', 3: 'Multicast starts with FF.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.9', difficulty: 'easy', type: 'single',
    prompt: 'What does ff02::2 represent?',
    choices: ['All nodes on the link', 'All routers on the link', 'All OSPFv3 routers', 'The loopback address'], correct: [1],
    explanation: 'ff02::2 is the all-routers link-local multicast group.',
    wrong: { 0: 'All nodes is ff02::1.', 2: 'OSPFv3 routers are ff02::5.', 3: 'Loopback is ::1.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.9', difficulty: 'medium', type: 'single',
    prompt: 'Which statement about link-local addresses is true?',
    choices: ['They are routed across the internet', 'They are unique across the whole internet', 'They are valid only on the local link and are not forwarded by routers', 'They are only created when configured by an administrator'], correct: [2],
    explanation: 'Link-local addresses work only on their own link and routers do not forward them.',
    wrong: { 0: 'They are never routed.', 1: 'They only need to be unique on the link.', 3: 'They are created automatically on IPv6-enabled interfaces.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.9', difficulty: 'hard', type: 'single',
    prompt: 'What is the modified EUI-64 interface ID for MAC address 00:1A:2B:3C:4D:5E?',
    choices: ['001A:2BFF:FE3C:4D5E', '021A:2BFF:FE3C:4D5E', '021A:2BFE:FF3C:4D5E', '001A:2B3C:4D5E:FFFE'], correct: [1],
    explanation: 'Insert FFFE in the middle (00:1A:2B:FF:FE:3C:4D:5E) and flip the 7th bit of the first byte: 00 → 02.',
    wrong: { 0: 'The 7th bit was not flipped.', 2: 'FFFE was inserted as FE FF (wrong order).', 3: 'FFFE goes in the middle, not at the end.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.9', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO statements about link-local addresses are true?',
    choices: ['They begin with FE80', 'They are created automatically on IPv6-enabled interfaces', 'Routers forward them to other networks', 'They must be unique across all networks'], correct: [0, 1],
    explanation: 'They begin with FE80::/10 and exist automatically on every IPv6 interface, but they never leave the link.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.9', difficulty: 'easy', type: 'single',
    prompt: 'Which address is the IPv6 loopback address?',
    choices: ['::', '::1', 'fe80::1', 'ff02::1'], correct: [1],
    explanation: '::1/128 is loopback. “::” is the unspecified address.',
    wrong: { 0: '“::” is unspecified.', 2: 'fe80::1 is a link-local address.', 3: 'ff02::1 is all-nodes multicast.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.9', difficulty: 'medium', type: 'single',
    prompt: 'Which best describes an anycast address?',
    choices: ['One address delivered to every device in a group', 'One address assigned to several devices, delivered to the nearest', 'An address valid only on one link', 'The IPv6 equivalent of a broadcast'], correct: [1],
    explanation: 'Anycast is a unicast address configured on more than one device; routing sends traffic to the nearest one.',
    wrong: { 0: 'That is multicast.', 2: 'That is link-local.', 3: 'IPv6 has no broadcast.' },
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D1', objective: '1.9', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: an IPv6 interface can have both a link-local and a global unicast address at the same time.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'Interfaces normally have a link-local address plus one or more global or unique local addresses.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: paano tandaan ang uri ng IPv6 address?', back: '2 = MUNDO (global) · FE80 = KAPITBAHAY (link-local) · FC/FD = PAMILYA (unique local) · FF = GRUPO (multicast). ::1 = sarili, :: = wala pang address. EUI-64: Hati — FFFE — Baligtad.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Global unicast prefix?', back: '2000::/3 (starts with 2 or 3).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Link-local prefix?', back: 'FE80::/10 — valid on one link only, never routed.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Unique local prefix?', back: 'FC00::/7 (FD00::/8 in practice) — private.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Multicast prefix?', back: 'FF00::/8. ff02::1 all nodes, ff02::2 all routers, ff02::5/6 OSPFv3.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Loopback and unspecified addresses?', back: '::1/128 loopback; ::/128 unspecified.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Modified EUI-64 steps?', back: 'Split the MAC, insert FFFE in the middle, flip the 7th bit of the first byte (00 → 02).' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What is anycast?', back: 'One address on several devices; delivered to the nearest.' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'command', front: 'Command to see IPv6 addresses on a router?', back: 'show ipv6 interface brief' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Classify addresses and build EUI-64',
  tool: 'Paper',
  minutes: 30,
  objective: 'Identify the type of ten IPv6 addresses by their first digits and build EUI-64 interface IDs by hand.',
  steps: [
    'Uriin ang bawat address gamit ang “Mundo, Kapitbahay, Pamilya, Grupo”: (1) 2001:db8:acad::1 (2) fe80::a00:27ff:fe4e:66a1 (3) fd00:1234::10 (4) ff02::1 (5) ::1 (6) 3001::1 (7) fc00::5 (8) ff02::5 (9) :: (10) fe81::1.',
    'Write the prefix (for example 2000::/3) that each address belongs to.',
    'Build the EUI-64 interface ID for MAC 00:1A:2B:3C:4D:5E and for MAC 5C:26:0A:12:34:56. Show the three steps: split, insert FFFE, flip the 7th bit.',
    'Write the resulting link-local addresses in shortened form.',
    'Check all your answers in the IPv6 type finder above.',
    'On your own PC, compare your MAC address to your link-local address. Does it match EUI-64? Explain what you see (many PCs use random interface IDs).',
  ],
  checklist: [
    'All ten addresses classified correctly',
    'Two EUI-64 interface IDs correct',
    'Link-local addresses written in shortened form',
    'Explained why your PC’s link-local may not match EUI-64',
  ],
  hints: [
    'Read only the first hex digits. fe80–febf is link-local; fc and fd are unique local.',
    'For the 7th bit: 00 becomes 02, 5C becomes 5E.',
  ],
  solution: [
    '(1) global (2) link-local (3) unique local (4) multicast all nodes (5) loopback (6) global (7) unique local (8) multicast OSPFv3 routers (9) unspecified (10) link-local.',
    'MAC 00:1A:2B:3C:4D:5E → 021a:2bff:fe3c:4d5e → fe80::21a:2bff:fe3c:4d5e.',
    'MAC 5C:26:0A:12:34:56 → 5e26:0aff:fe12:3456 → fe80::5e26:aff:fe12:3456.',
  ],
  breakIt: 'Change one bit wrongly (use 00 instead of 02 in your EUI-64) and compare with the tool to see how one flipped bit changes the address.',
};
