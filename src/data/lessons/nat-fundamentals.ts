import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'nat-fundamentals';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.4',
  domain: 'D4',
  title: 'NAT Fundamentals: Private Addresses and the Four Address Terms',
  description: 'Why private addresses cannot cross the internet, what NAT changes in the packet, and how inside local, inside global, outside local and outside global differ.',
  whyMatters:
    'Halos lahat ng bahay at opisina ay gumagamit ng private IP address, pero iisa lang ang public address na nakikita ng internet. Ang NAT ang tulay. Pinakamalaking hadlang sa mga estudyante ang apat na termino — inside local, inside global, outside local, outside global — at bawat NAT question sa exam ay umaasa roon.',
  objectives: [
    'List the RFC 1918 private ranges and explain why they are not routable on the internet',
    'Explain what NAT changes in a packet and where it happens',
    'Define inside local, inside global, outside local and outside global',
    'Identify the inside and outside interfaces on a NAT router',
    'Read a translation table with show ip nat translations',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['NAT', 'RFC 1918', 'private address', 'inside local', 'inside global', 'outside local', 'outside global', 'ip nat inside', 'ip nat outside', 'show ip nat translations'],
  examObjectives: ['4.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Private addresses such as 192.168.1.10 are reused in millions of networks, so the internet refuses to route them. NAT solves this: when a packet leaves your network, the router swaps your private source address for a public one, and swaps it back for the reply.',
        'The vocabulary is the hard part. "Inside" means your network and "outside" means the other side. "Local" is how an address looks from where it sits, and "global" is how it looks to the rest of the world.',
      ],
      taglish: [
        'Ang mga **private address** (tulad ng 192.168.1.10) ay ginagamit ng **milyon-milyong network**, kaya **hindi ito ni-route ng internet**. Ang **NAT** ang solusyon: kapag lumabas ang packet, **pinapalitan ng router ang private source address** ng **public address**, at **ibinabalik** ito sa sagot.',
        'Ang mga **private range (RFC 1918)**: **10.0.0.0/8**, **172.16.0.0/12** (172.16–172.31), at **192.168.0.0/16**.',
        'Ang mahirap ay ang **apat na termino**. **Inside** = ang **network mo**. **Outside** = ang **kabila** (internet). **Local** = ang address **sa paningin ng loob**. **Global** = ang address **sa paningin ng labas**.',
        'Kaya: **inside local** = tunay na address ng PC mo; **inside global** = ang public address na nakikita ng internet para sa PC mo.',
      ],
      technical: [
        'RFC 1918 reserves 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16 for private use. Internet routers do not route them, and many networks reuse them. NAT, performed on a router or firewall at the network edge, rewrites IP addresses (and, with PAT, port numbers) so private hosts can reach public destinations and conserve scarce IPv4 addresses.',
        'Interfaces are labelled: ip nat inside on the interface facing the private network, ip nat outside on the interface facing the public network. Translation occurs as a packet crosses from inside to outside (source rewritten) and again on the return path (destination rewritten).',
        'Terms: Inside local = the address of an inside host as seen on the inside (usually private). Inside global = the address representing that inside host on the outside (public). Outside global = the address of an outside host as seen on the outside (the real public address). Outside local = the address of an outside host as seen from the inside (usually the same as outside global unless outside NAT is used).',
        'Types of NAT: static (one-to-one, permanent), dynamic (one-to-one from a pool, on demand) and PAT / overload (many-to-one using unique source ports). These are covered in the next two lessons.',
        'NAT breaks end-to-end addressing and complicates some protocols, which is one reason IPv6 removes the need for it. Verification: show ip nat translations, show ip nat statistics, debug ip nat.',
      ],
    },
    {
      type: 'analogy',
      title: 'Receptionist ng opisina',
      body: [
        'Inside an office, everyone uses short extension numbers such as 101 and 102. When they call outside, the switchboard replaces the extension with the company\'s main number. The outside world only ever sees the main number; the switchboard remembers who called so the reply reaches the right desk.',
      ],
      taglish: [
        'Sa loob ng opisina, **maiikling extension** ang gamit (101, 102). Kapag tumawag sa labas, **pinapalitan ng switchboard** ang extension ng **main number ng kompanya**. Ang labas ay **main number lang ang nakikita**; **tinatandaan ng switchboard** kung sino ang tumawag para **tama ang pagbalik ng sagot**.',
      ],
    },
    {
      type: 'hook',
      title: 'Inside Local = Loob ang tingin, Global = Mundo ang tingin',
      trick: '**Local** = sa **paningin ng loob**. **Global** = sa **paningin ng labas**. **Inside** = ang **host mo**. **Outside** = ang **kabila**.',
      taglish: [
        '**Dalawang tanong** lang: (1) **Kaninong host?** Inside (sa iyo) o Outside (sa kabila). (2) **Saan ito nakikita?** Local (sa loob) o Global (sa labas).',
        '**Inside Local** = PC mo, nakikita ng loob = **192.168.1.10**.',
        '**Inside Global** = PC mo, nakikita ng labas = **203.0.113.5**.',
        '**Outside Global** = server sa internet, nakikita ng labas = **198.51.100.7**. **Outside Local** = server na iyon, nakikita ng loob = karaniwang **pareho** (198.51.100.7).',
      ],
      test: {
        question: 'Ang PC na 192.168.1.10 ay lumalabas gamit ang 203.0.113.5. Alin ang inside local at alin ang inside global?',
        answer: 'Inside local = 192.168.1.10 (ang address sa loob). Inside global = 203.0.113.5 (ang address na nakikita ng internet para sa PC).',
      },
    },
    { type: 'diagram', id: 'nat-terms', caption: 'Ang apat na NAT address: inside local/global para sa host mo, outside local/global para sa server.' },
    {
      type: 'terms',
      items: [
        { term: 'NAT', definition: 'Network Address Translation: rewrites IP addresses as packets cross the network edge.' },
        { term: 'RFC 1918', definition: 'Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.' },
        { term: 'Inside local', definition: 'An inside host\'s address as seen from the inside (usually private).' },
        { term: 'Inside global', definition: 'An inside host\'s address as seen from the outside (public).' },
        { term: 'Outside global', definition: 'An outside host\'s real address as seen on the outside.' },
        { term: 'Outside local', definition: 'An outside host\'s address as seen from the inside; normally equals outside global.' },
        { term: 'ip nat inside / outside', definition: 'Interface commands that mark which side is private and which is public.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: PC1 bumibisita sa web server',
      steps: [
        'Ang PC1 (inside local 192.168.1.10) ay nagpapadala ng packet papunta sa 198.51.100.7.',
        'Natatanggap ng R1 ang packet sa inside interface at nakikitang kailangan itong i-translate.',
        'Pinapalitan ng R1 ang source address: 192.168.1.10 → 203.0.113.5 (inside global). Nagdadagdag ito ng entry sa translation table.',
        'Lumalabas ang packet sa outside interface at nakararating sa server na nakakakita lang ng 203.0.113.5.',
        'Sumasagot ang server sa 203.0.113.5. Natatanggap ito ng R1 at hinahanap ang entry sa table.',
        'Pinapalitan ng R1 ang destination pabalik sa 192.168.1.10 at ipinapasa sa PC1.',
      ],
    },
    {
      type: 'cli',
      title: 'Markahan ang inside at outside, at basahin ang table',
      transcript: `R1(config)# interface gi0/0
R1(config-if)# ip nat inside
R1(config-if)# interface gi0/1
R1(config-if)# ip nat outside
R1(config-if)# end
R1# show ip nat translations
Pro Inside global      Inside local       Outside local      Outside global
--- 203.0.113.5        192.168.1.10       ---                ---`,
      copyable: 'show ip nat translations',
      explain: [
        { line: 'ip nat inside (gi0/0)', why: 'Marks the interface facing the private LAN.' },
        { line: 'ip nat outside (gi0/1)', why: 'Marks the interface facing the internet or ISP.' },
        { line: 'Inside global 203.0.113.5', why: 'The public address representing the host on the outside.' },
        { line: 'Inside local 192.168.1.10', why: 'The host\'s real private address.' },
        { line: 'Outside columns ---', why: 'Dashes appear when only inside translation is used.' },
      ],
      note: 'Marking interfaces alone does nothing; a static, dynamic or PAT rule is also required (next lessons).',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show ip nat translations', shows: 'The active entries with all four address columns.' },
        { command: 'show ip nat statistics', shows: 'Inside and outside interfaces, hit and miss counts, and pool usage.' },
        { command: 'debug ip nat', shows: 'Each translation as it happens (lab use only).' },
      ],
      good: 'Entries appear after traffic flows, and the hits counter increases.',
      bad: 'No entries: interfaces not marked inside/outside, no translation rule, or no matching traffic.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **inside local** ay ang **private address** ng host; ang **inside global** ay ang **public address** nito. Madalas ibaligtad ito sa exam. Tandaan: **Local = loob, Global = labas**.' },
    { type: 'callout', kind: 'trap', text: 'Ang pag-label ng **ip nat inside** at **ip nat outside** ay **hindi sapat** — kailangan pa rin ng NAT rule (static, pool, o overload).' },
    { type: 'callout', kind: 'tip', text: 'Ang **172.16.0.0/12** ay **172.16.x.x hanggang 172.31.x.x** lang. Ang **172.32.x.x** ay **public** na.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagpapalit ng inside local at inside global.',
        'Paglagay ng inside/outside sa maling interface.',
        'Paglimot sa translation rule matapos i-mark ang interfaces.',
        'Pag-akalang 172.x.x.x lahat ay private.',
        'Pag-akalang NAT ay security feature; hindi ito firewall.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Walang translation entry"',
      scenario: 'PC1 cannot reach the internet and the NAT table is empty.',
      evidence: `R1# show ip nat translations
R1# show ip nat statistics
Total active translations: 0
Outside interfaces:
  GigabitEthernet0/1
Inside interfaces:
R1# show running-config interface gi0/0
 ip address 192.168.1.1 255.255.255.0`,
      question: 'Ano ang kulang?',
      answer: 'Walang interface na naka-mark bilang inside. Ang Gi0/0 ay walang ip nat inside, kaya hindi tinitingnan ng router ang trapiko mula sa LAN para i-translate.',
      fix: 'Add ip nat inside under interface gi0/0, make sure a translation rule exists, then generate traffic and check show ip nat translations.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Alin sa mga ito ang HINDI puwedeng i-route sa internet: 10.4.4.4, 172.20.1.1, 172.40.1.1, 192.168.200.5?',
      answer: '10.4.4.4, 172.20.1.1 at 192.168.200.5 ay private (RFC 1918). Ang 172.40.1.1 ay public dahil lampas ito sa 172.16–172.31, kaya ito lang ang puwedeng i-route.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Private ranges: 10/8, 172.16/12 (16–31), 192.168/16.',
        'Inside local = private host address; inside global = its public address.',
        'Local = as seen inside; global = as seen outside.',
        'Mark ip nat inside and ip nat outside, then add a translation rule.',
        'show ip nat translations is the main verification command.',
      ],
    },
    {
      type: 'summary',
      points: [
        'NAT rewrites addresses at the edge so private hosts can use the internet.',
        'Inside/outside identifies whose host; local/global identifies who is looking.',
        'Interfaces must be marked and a translation rule must exist.',
        'Susunod: static at dynamic NAT, at pagkatapos ay PAT (overload).',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'easy', type: 'single',
    prompt: 'Which address range is private under RFC 1918?',
    choices: ['172.32.0.0/16', '192.168.0.0/16', '11.0.0.0/8', '169.254.0.0/16'], correct: [1],
    explanation: '192.168.0.0/16 is private. 172.32.x.x is outside 172.16–172.31, 11.0.0.0/8 is public and 169.254 is link-local.',
    wrong: { 0: '172.32 is public.', 2: '11.0.0.0/8 is public.', 3: 'That is APIPA, not RFC 1918.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'easy', type: 'single',
    prompt: 'Why is NAT used?',
    choices: ['To encrypt traffic', 'To let private addresses reach the internet and conserve public IPv4 addresses', 'To speed up routing', 'To replace DHCP'], correct: [1],
    explanation: 'NAT translates private addresses to public ones at the network edge.',
    wrong: { 0: 'NAT does not encrypt.', 2: 'It adds processing, not speed.', 3: 'DHCP assigns addresses; NAT translates them.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'An inside PC uses 192.168.1.10 and appears to the internet as 203.0.113.5. Which is the inside global address?',
    choices: ['192.168.1.10', '203.0.113.5', 'The server address', 'The default gateway'], correct: [1],
    explanation: 'Inside global is the public address that represents the inside host to the outside.',
    wrong: { 0: 'That is the inside local address.', 2: 'The server is an outside host.', 3: 'The gateway is not part of this definition.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'Which command marks the interface facing the private LAN for NAT?',
    choices: ['ip nat outside', 'ip nat inside', 'ip nat private', 'nat enable'], correct: [1],
    explanation: 'ip nat inside is applied on the interface connected to the private network.',
    wrong: { 0: 'That is for the public-facing interface.', 2: 'Not valid IOS syntax.', 3: 'Not valid IOS syntax.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'Which command displays the NAT translation table?',
    choices: ['show nat table', 'show ip nat translations', 'show ip route nat', 'show running-config nat'], correct: [1],
    explanation: 'show ip nat translations lists the entries and their four address columns.',
    wrong: { 0: 'Not valid IOS syntax.', 2: 'Not valid IOS syntax.', 3: 'Not valid IOS syntax.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'hard', type: 'single',
    prompt: 'What does "local" mean in NAT terminology?',
    choices: ['The address as seen from the inside network', 'The address as seen from the internet', 'A link-local address', 'A loopback address'], correct: [0],
    explanation: 'Local means the address viewed from the inside network; global means as seen from the outside.',
    wrong: { 1: 'That describes global.', 2: 'Unrelated to link-local addressing.', 3: 'Unrelated to loopback.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO addresses are private (RFC 1918)?',
    choices: ['10.200.5.1', '172.20.0.9', '172.40.0.9', '100.64.1.1'], correct: [0, 1],
    explanation: '10.0.0.0/8 and 172.16.0.0/12 (16–31) are private. 172.40 is public and 100.64/10 is shared address space.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: marking inside and outside interfaces is enough to make NAT work.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — you still need a static, pool or overload translation rule.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: paano tandaan ang NAT terms?', back: 'Inside = host mo, Outside = kabila. Local = paningin ng loob, Global = paningin ng labas. Inside local = private; inside global = public.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'ipv4', front: 'RFC 1918 private ranges?', back: '10.0.0.0/8, 172.16.0.0/12 (172.16–172.31), 192.168.0.0/16.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Inside local vs inside global?', back: 'Inside local: the host\'s private address. Inside global: the public address representing it on the outside.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Outside local vs outside global?', back: 'Outside global: the real address of the outside host. Outside local: how the inside sees it; usually the same.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'command', front: 'Mark NAT interfaces?', back: 'ip nat inside (LAN interface) and ip nat outside (internet interface).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'command', front: 'View NAT translations?', back: 'show ip nat translations (and show ip nat statistics).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Mark NAT interfaces and read the translation table',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Mark inside and outside interfaces, apply a simple static rule and identify each address column.',
  topology: 'PC1 — R1 — ISP-Server. LAN 192.168.1.0/24; R1 outside address 203.0.113.5/30; server 198.51.100.7.',
  addressing: [
    { device: 'PC1', interface: 'NIC', address: '192.168.1.10/24', note: 'gateway 192.168.1.1' },
    { device: 'R1', interface: 'Gi0/0', address: '192.168.1.1/24', note: 'inside' },
    { device: 'R1', interface: 'Gi0/1', address: '203.0.113.5/30', note: 'outside' },
  ],
  steps: [
    'Configure addresses and a default route on R1 toward the ISP.',
    'Mark Gi0/0 ip nat inside and Gi0/1 ip nat outside.',
    'Add a static rule: ip nat inside source static 192.168.1.10 203.0.113.6.',
    'From PC1 ping 198.51.100.7.',
    'Run show ip nat translations and label each column.',
  ],
  checklist: [
    'Interfaces marked inside and outside',
    'Translation entry visible after a ping',
    'Labelled inside local and inside global correctly',
  ],
  hints: [
    'The ISP side needs a return route to the inside global address.',
    'Generate traffic first; dynamic entries only appear when needed.',
  ],
  solution: [
    'Inside local is 192.168.1.10 and inside global is 203.0.113.6.',
    'Without ip nat inside the table stays empty.',
  ],
  breakIt: 'Remove ip nat outside from Gi0/1 and see the translation stop working.',
};
