import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ipv6-static-routing';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.7',
  domain: 'D3',
  title: 'IPv6 Static and Floating Static Routing',
  description: 'Write IPv6 static, default and floating static routes, choose the right next-hop form and read the IPv6 routing table.',
  whyMatters:
    'Pareho ang lohika ng IPv4 at IPv6 static routing, pero may mga bitag sa IPv6: ang link-local next hop ay nangangailangan ng interface, at ang ruta ay hindi gagana nang walang ipv6 unicast-routing. Kasama rin dito ang floating static route para sa backup, na madalas itanong sa exam.',
  objectives: [
    'Write IPv6 static routes with next-hop, exit interface and fully specified forms',
    'Configure an IPv6 default route',
    'Create a floating static route using administrative distance',
    'Read S, C and L entries in show ipv6 route',
    'Troubleshoot a missing return route',
  ],
  estimatedMinutes: 40,
  difficulty: 'exam',
  keywords: ['ipv6 route', 'IPv6 static route', 'default route', '::/0', 'floating static route', 'administrative distance', 'next hop', 'link-local next hop', 'show ipv6 route'],
  examObjectives: ['3.3'],
  sections: [
    {
      type: 'explain',
      simple: [
        'An IPv6 static route is configured with ipv6 route <prefix>/<length> <next hop or exit interface> [distance]. The default route is ::/0.',
        'A floating static route is an ordinary static route with a higher administrative distance, so it stays hidden until the preferred route disappears.',
      ],
      taglish: [
        'Ang IPv6 static route ay: **`ipv6 route <prefix>/<length> <next hop o exit interface> [distance]`**. Ang default route ay **`::/0`** (katumbas ng 0.0.0.0/0 sa IPv4).',
        'Ang **floating static route** ay ordinaryong static route na may **mas mataas na administrative distance**. Nakatago ito habang buhay ang pangunahing ruta; lilitaw lang kapag nawala ang mas magandang ruta. Perpekto para sa backup link.',
        'Tatlong anyo ng next hop: **next-hop address lang**, **exit interface lang**, o **parehong interface at next hop (fully specified)**. Kapag ang next hop ay **link-local address**, **kailangang** may interface.',
      ],
      technical: [
        'ipv6 route 2001:db8:2::/64 2001:db8:12::2 uses a recursive next hop. ipv6 route 2001:db8:2::/64 g0/1 uses a directly attached form. ipv6 route 2001:db8:2::/64 g0/1 fe80::2 is fully specified and is required when the next hop is a link-local address, because a link-local address is only unique per link.',
        'The default static route is ipv6 route ::/0 <next hop>. Static routes have an administrative distance of 1 (directly connected exit interface routes appear as 1 too); a floating route sets a higher AD, for example ipv6 route ::/0 2001:db8:99::1 150 against an OSPF default (110).',
        'Entries in show ipv6 route: C connected, L local (/128), S static, O OSPF; S ::/0 [1/0] is a default static route. ipv6 unicast-routing must be enabled for the router to forward.',
      ],
    },
    {
      type: 'analogy',
      title: 'Pangunahing daan at alternatibong daan',
      body: [
        'The main road is your usual route to the city. A floating static route is a rarely used back road marked as “only if the main road is closed”. Drivers (packets) take the back road only when the main road disappears from the map.',
      ],
      taglish: [
        'Ang **pangunahing highway** ang karaniwang daan mo papuntang siyudad. Ang **floating static route** ay **likurang kalsada** na may markang “gamitin lang kapag sarado ang highway”. Kapag nawala ang highway sa mapa (bumagsak ang link), saka lang dadaan ang mga sasakyan sa likurang kalsada. Ang “marka” ay ang mas mataas na administrative distance.',
      ],
    },
    {
      type: 'hook',
      title: 'Mas mataas = mas huli',
      trick: '**ipv6 route PREFIX/LEN NEXT-HOP [AD]. Default = ::/0. Floating = dagdagan ang AD (mas mataas sa pangunahing). Link-local next hop = dapat may INTERFACE.**',
      taglish: [
        '**Prefix at haba**: `ipv6 route 2001:db8:2::/64 …`.',
        '**Default** = `::/0`. Katumbas ng 0.0.0.0/0.',
        '**Floating** = idagdag ang AD sa dulo: `… 150`. Ang mas mababang AD ay mas pinipili, kaya ang 150 ay talo laban sa OSPF (110) hanggang mawala ang OSPF.',
        '**Link-local next hop** = isama ang interface: `ipv6 route 2001:db8:2::/64 g0/1 fe80::2`.',
      ],
      test: {
        question: 'Gusto mong ang static default route ay backup lang ng OSPF default (AD 110). Anong AD ang ilalagay?',
        answer: 'Anumang mas mataas sa 110, halimbawa 150: `ipv6 route ::/0 2001:db8:99::1 150`.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Ang tatlong anyo ng IPv6 static route',
      paragraphs: [
        '**Recursive (next-hop address lang)**: `ipv6 route 2001:db8:2::/64 2001:db8:12::2`. Hahanapin ng router kung paano maaabot ang 2001:db8:12::2 (recursive lookup). Gumagana ito sa mga global na address.',
        '**Directly attached (exit interface lang)**: `ipv6 route 2001:db8:2::/64 g0/1`. Sa point-to-point link (serial) ayos ito. Sa Ethernet, hindi ito laging gumagana dahil kailangang mag-NDP ang router para sa destination mismo.',
        '**Fully specified (interface at next hop)**: `ipv6 route 2001:db8:2::/64 g0/1 fe80::2`. Ito ang **kailangan** kapag ang next hop ay link-local, dahil ang FE80::2 ay maaaring umiral sa maraming link.',
        'Para sa lahat ng tatlo, kailangan din ng **return route** ang kabilang router — kung hindi, makakarating ang request pero hindi babalik ang reply.',
      ],
      steps: [
        'Tukuyin ang destination prefix at haba.',
        'Piliin ang next hop (global o link-local) at ang exit interface.',
        'Isulat ang command; kung link-local, isama ang interface.',
        'I-verify ang show ipv6 route static at mag-ping.',
      ],
      tricks: [
        'Ang link-local next hop ay madaling gamitin kung palagi mong tinatakda ang fe80::1 at fe80::2 sa magkabilang dulo.',
        'Hindi sapat ang pagkakaroon ng ruta sa isang router lang — laging isipin ang return path.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Default at floating static route',
      paragraphs: [
        'Ang stub router na may iisang labasan ay nangangailangan lang ng `ipv6 route ::/0 2001:db8:99::1`. Lalabas ito sa routing table bilang `S ::/0 [1/0]`.',
        'Para sa backup: dalawang default route — isa na may AD 1 (default) papunta sa pangunahing ISP, at isa pang `… 150` papunta sa backup ISP. Ang routing table ay mayroon lang ang pangunahing; kapag bumagsak ang link at nawala ang ruta, ang floating ang papalit.',
        'Mag-ingat: kung ang next hop ay “up” pa ang interface (hal. ang switch ay hindi nagpapakita ng pagbagsak), ang pangunahing ruta ay mananatili. Gumamit ng **IP SLA** o routing protocol para sa mas tumpak na detection (labas sa CCNA, pero magandang malaman).',
      ],
      steps: [
        'ipv6 route ::/0 2001:db8:99::1 — pangunahin (AD 1).',
        'ipv6 route ::/0 2001:db8:98::1 150 — floating backup.',
        'show ipv6 route static — dapat isa lang ang nakikita.',
        'Patayin ang pangunahing link at tingnan na lumabas ang backup.',
      ],
      tricks: [
        'Ang floating route ay hindi nagpapakita sa table hangga’t ang mas magandang AD ay buhay — hindi ito bug.',
        'Gumamit ng AD na mas mataas sa routing protocol na gusto mong talunin (OSPF 110, RIP 120, iBGP 200).',
      ],
    },
    {
      type: 'remember',
      title: 'IPv6 static routing na lumalabas sa exam',
      items: [
        '**ipv6 route <prefix>/<len> <next hop | interface | interface + next hop> [AD].**',
        '**Default route = ::/0.** **Static AD = 1.**',
        '**Link-local next hop = kailangan ng exit interface (fully specified).**',
        '**Floating static = mas mataas na AD kaysa sa pangunahing ruta.**',
        '**Kailangan ang ipv6 unicast-routing.** **Kailangan ng return route sa kabilang dulo.**',
      ],
    },
    { type: 'diagram', id: 'static-route-pair', caption: 'Dalawang router: kailangan ng ruta at return route.' },
    {
      type: 'terms',
      items: [
        { term: 'ipv6 route', definition: 'Command that creates an IPv6 static route.' },
        { term: '::/0', definition: 'The IPv6 default route prefix, matching every destination.' },
        { term: 'Fully specified route', definition: 'A static route with both exit interface and next hop; required for a link-local next hop.' },
        { term: 'Floating static route', definition: 'A static route with a higher administrative distance used only when a better route is missing.' },
        { term: 'Recursive lookup', definition: 'The router looks up the next hop address in the routing table to find the exit interface.' },
        { term: 'Return route', definition: 'The route on the far router that lets replies come back to the source network.' },
        { term: 'Link-local next hop', definition: 'An FE80:: next hop address, valid only on one link.' },
      ],
    },
    {
      type: 'flow',
      title: 'Paano magdagdag ng IPv6 static route',
      steps: [
        'Siguraduhing may ipv6 unicast-routing at may address ang mga interface.',
        'Isulat ang ipv6 route na may tamang prefix, next hop at interface.',
        'Magdagdag ng return route sa kabilang router.',
        'Opsyonal: magdagdag ng floating route na may mas mataas na AD.',
        'show ipv6 route at ping para i-verify.',
      ],
    },
    {
      type: 'cli',
      title: 'Mga halimbawa',
      transcript: `R1(config)# ipv6 unicast-routing
R1(config)# ipv6 route 2001:db8:2::/64 2001:db8:12::2
R1(config)# ipv6 route 2001:db8:3::/64 gigabitEthernet 0/1 fe80::2
R1(config)# ipv6 route ::/0 2001:db8:99::1
R1(config)# ipv6 route ::/0 2001:db8:98::1 150
R1# show ipv6 route static
S   ::/0 [1/0]
     via 2001:DB8:99::1
S   2001:DB8:2::/64 [1/0]
     via 2001:DB8:12::2
S   2001:DB8:3::/64 [1/0]
     via FE80::2, GigabitEthernet0/1`,
      copyable: 'ipv6 unicast-routing\nipv6 route 2001:db8:2::/64 2001:db8:12::2\nipv6 route 2001:db8:3::/64 gigabitEthernet 0/1 fe80::2\nipv6 route ::/0 2001:db8:99::1\nipv6 route ::/0 2001:db8:98::1 150\nshow ipv6 route static',
      explain: [
        { line: 'ipv6 route 2001:db8:3::/64 gigabitEthernet 0/1 fe80::2', why: 'Fully specified route: the link-local next hop is only meaningful on a specific interface.' },
        { line: 'ipv6 route ::/0 2001:db8:99::1', why: 'Default route for everything with no better match; shows as S ::/0 [1/0].' },
        { line: 'ipv6 route ::/0 2001:db8:98::1 150', why: 'Floating default route; hidden while the AD 1 default exists.' },
        { line: '[1/0]', why: 'Administrative distance 1 and metric 0 for a static route.' },
      ],
      note: 'The floating route is not displayed while the primary default route is installed.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **link-local next hop** ay hindi gagana kung walang exit interface. Makakakita ka ng error na “Interface has to be specified for a link-local nexthop”.' },
    { type: 'callout', kind: 'trap', text: 'Ang floating static route ay hindi “mali” kapag hindi ito nakikita sa `show ipv6 route` — normal iyon habang gumagana ang pangunahing ruta.' },
    { type: 'callout', kind: 'tip', text: 'Isulat ang return route habang isinusulat ang forward route. Sa exam, halos lahat ng “request pass, reply fail” ay kulang na return route.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Using a link-local next hop without the exit interface.',
        'Forgetting ipv6 unicast-routing.',
        'Giving the floating route an AD lower than or equal to the primary.',
        'Forgetting the return route.',
        'Writing ::0 or ::/128 instead of ::/0 for the default route.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Dumating ang request pero walang reply',
      scenario: 'R1 has a static route to 2001:db8:2::/64 via R2. Pings from R1’s LAN reach the 2001:db8:2::/64 server but get no reply.',
      evidence: `R2# show ipv6 route
C   2001:DB8:2::/64 [0/0] via GigabitEthernet0/1, directly connected
C   2001:DB8:12::/64 [0/0] via GigabitEthernet0/0, directly connected
L   2001:DB8:12::2/128 [0/0] via GigabitEthernet0/0, receive`,
      question: 'Ano ang kulang sa R2?',
      answer: 'R2 has no route to R1’s LAN (for example 2001:db8:1::/64). Packets arrive, but the replies have nowhere to go.',
      fix: 'On R2 add ipv6 route 2001:db8:1::/64 2001:db8:12::1, or a default route ::/0 2001:db8:12::1. Verify with show ipv6 route and repeat the ping.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang command para sa backup default route papunta sa 2001:db8:98::1 na gagana lang kung mawala ang OSPF default (AD 110). Anong AD ang pipiliin mo?',
      answer: 'ipv6 route ::/0 2001:db8:98::1 150. Any AD above 110 works (150 is common); the OSPF default (110) is preferred while it exists.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'The default route is ::/0.',
        'Link-local next hop needs an interface.',
        'Floating = higher administrative distance than the primary.',
        'Always check the return route.',
        'ipv6 unicast-routing must be on.',
      ],
    },
    {
      type: 'summary',
      points: [
        'ipv6 route <prefix>/<len> <next hop | interface> [AD].',
        'Default route is ::/0.',
        'Link-local next hop requires an exit interface.',
        'Floating static route = higher AD, used as backup.',
        'Return routes are required.',
        'Susunod: wireless architectures at WLC.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'easy', type: 'single',
    prompt: 'Which command creates an IPv6 default route toward 2001:db8:99::1?',
    choices: ['ipv6 route 0.0.0.0/0 2001:db8:99::1', 'ipv6 route ::/0 2001:db8:99::1', 'ip route ::/0 2001:db8:99::1', 'ipv6 default-gateway 2001:db8:99::1'], correct: [1],
    explanation: 'The IPv6 default route prefix is ::/0 configured with ipv6 route.',
    wrong: { 0: '0.0.0.0/0 is an IPv4 prefix.', 2: 'ip route is the IPv4 command.', 3: 'ipv6 default-gateway is not the way routers get a default route.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'single',
    prompt: 'A static route uses a link-local next hop. What must the command include?',
    choices: ['An administrative distance', 'The exit interface', 'The router ID', 'A metric'], correct: [1],
    explanation: 'A link-local address is only unique on one link, so the exit interface must be specified.',
    wrong: { 0: 'AD is optional.', 2: 'Router IDs are for OSPF.', 3: 'Static routes do not require a metric.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'single',
    prompt: 'A router has an OSPF-learned default route (AD 110). Which static default route acts as a backup that is used only if OSPF fails?',
    choices: ['ipv6 route ::/0 2001:db8:98::1 1', 'ipv6 route ::/0 2001:db8:98::1 90', 'ipv6 route ::/0 2001:db8:98::1 150', 'ipv6 route ::/0 2001:db8:98::1 110'], correct: [2],
    explanation: 'The backup needs a higher AD than 110, so 150 loses to OSPF until OSPF’s route disappears.',
    wrong: { 0: 'AD 1 would beat OSPF and be used first.', 1: 'AD 90 is lower than 110, so it would be preferred.', 3: 'Equal AD does not make it a clear backup.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'single',
    prompt: 'How does a default static IPv6 route appear in show ipv6 route?',
    choices: ['C ::/0', 'S ::/0 [1/0]', 'L ::/0', 'O ::/0 [110/1]'], correct: [1],
    explanation: 'A static route is marked S, with administrative distance 1 and metric 0.',
    wrong: { 0: 'C is for connected networks.', 2: 'L is for local addresses.', 3: 'O means OSPF.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: IPv6 routing is enabled by default on a Cisco router.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'ipv6 unicast-routing must be configured globally.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'hard', type: 'multiple',
    prompt: 'Pings from R1 reach a server behind R2, but no replies return. Which TWO fixes should you consider on R2?',
    choices: ['Add a route to R1’s LAN', 'Add a default route toward R1', 'Change the AD on R1’s route', 'Disable ipv6 unicast-routing on R2'], correct: [0, 1],
    explanation: 'R2 needs a path back to the source: a specific route or a default route toward R1.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'command', front: 'Pro tip: IPv6 static route formula?', back: 'ipv6 route PREFIX/LEN NEXT-HOP [AD]. Default = ::/0. Floating = mas mataas na AD. Link-local next hop = may interface.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'command', front: 'IPv6 default route command?', back: 'ipv6 route ::/0 <next hop>.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'When is the exit interface required?', back: 'When the next hop is a link-local address.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What is a floating static route?', back: 'A static route with a higher AD, used only when a better route is missing.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Static route AD?', back: '1.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'command', front: 'Command to enable IPv6 forwarding?', back: 'ipv6 unicast-routing.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Symptoms of a missing return route?', back: 'Requests arrive but no replies come back; pings time out.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'IPv6 static, default and floating routes',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Connect three LANs with IPv6 static routes, add a default route and a floating backup and test failover.',
  steps: [
    'Build R1–R2–R3 in a line with a LAN on R1 and R3. Enable ipv6 unicast-routing on all routers and address every interface.',
    'On R1 add a static route to R3’s LAN via R2 and on R3 add the return route. Ping across.',
    'Replace the static routes with a default route on R1 and R3 pointing at R2. Verify S ::/0.',
    'Add a second link R1–R3 and a floating default route (AD 150) over it.',
    'Check that show ipv6 route static shows only the primary route.',
    'Shut down the R1–R2 link and watch the floating route install; restore the link and watch it disappear.',
    'Use a link-local next hop with an interface on one route to confirm the syntax.',
  ],
  checklist: [
    'End-to-end IPv6 ping works',
    'Default routes verified',
    'Floating route hidden while the primary exists',
    'Failover observed',
    'Link-local next hop route accepted with an interface',
  ],
  hints: [
    'Use fe80::1 and fe80::2 as link-local addresses to keep next hops readable.',
    'show ipv6 route static filters the table.',
  ],
  solution: [
    'R1: ipv6 route ::/0 <R2 address>; R2: specific routes to both LANs; R3: ipv6 route ::/0 <R2 address>.',
    'Floating: ipv6 route ::/0 <R3 address> 150 on R1.',
    'Link-local: ipv6 route <prefix> g0/0 fe80::2.',
  ],
  breakIt: 'Remove the return route on R3 and describe what the ping output looks like and why.',
};
