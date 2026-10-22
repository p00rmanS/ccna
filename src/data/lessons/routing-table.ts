import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'routing-table';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.2',
  domain: 'D3',
  title: 'The Routing Table: Codes, Metric, Administrative Distance and Longest Prefix Match',
  description: 'How to read show ip route, how a router chooses between several matching routes, and what administrative distance and metric decide.',
  whyMatters:
    'Ang show ip route ang pinakamadalas na output sa CCNA. Kailangan mong mabasa ang bawat linya: ang code (C, L, S, O), ang prefix, ang [AD/metric], ang next hop at ang interface. At kailangan mong malaman ang tatlong patakaran ng pagpili: longest prefix match, pinakamababang administrative distance, at pinakamababang metric.',
  objectives: [
    'Read each part of a route entry in show ip route',
    'Identify route codes: C, L, S, O, D, and S* for the default route',
    'Apply the longest prefix match rule to choose a route',
    'Compare administrative distances for common route sources',
    'Explain the difference between administrative distance and metric',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['routing table', 'show ip route', 'administrative distance', 'metric', 'longest prefix match', 'connected', 'local', 'static', 'OSPF', 'gateway of last resort', 'next hop'],
  examObjectives: ['3.1', '3.2'],
  sections: [
    {
      type: 'explain',
      simple: [
        'The routing table is the router\'s map. Each line says: to reach this network, send the packet this way. A line records where the information came from (a letter code), the destination network, how trustworthy and how costly the route is, the next hop and the exit interface.',
        'When several lines could match a destination, the router follows three rules in order: the most specific prefix wins, then the most trusted source (lowest administrative distance), then the lowest metric.',
      ],
      taglish: [
        'Ang **routing table** ay **mapa ng router**. Bawat linya ay nagsasabing: **para maabot ang network na ito, ipadala ang packet sa ganitong daan**. Nakatala kung **saan galing ang impormasyon** (letter code), **ang destination network**, **gaano ito mapagkakatiwalaan at kamahal**, **ang next hop** at **ang exit interface**.',
        'Kapag **maraming linya ang puwedeng tumugma**, **tatlong patakaran** ang sinusunod ng router **ayon sa pagkakasunod**: **(1) pinakatiyak na prefix (longest match)**, **(2) pinakamapagkakatiwalaang source (pinakamababang administrative distance)**, **(3) pinakamababang metric**.',
        'Mga code: **C** = connected, **L** = local (ang sariling address ng interface, /32), **S** = static, **O** = OSPF, **D** = EIGRP, **S*** = static default route.',
        'Ang **administrative distance (AD)** ay **tiwala sa source**; ang **metric** ay **gastos ng daan sa loob ng parehong protocol**.',
      ],
      technical: [
        'A routing table entry has the form: <code> <prefix>/<length> [<AD>/<metric>] via <next-hop>, <age>, <interface>. For example O 10.2.0.0/24 [110/2] via 10.1.1.2, 00:01:10, GigabitEthernet0/1. Connected routes (C) and local routes (L, /32 for the interface address) appear automatically when an interface is up with an address; the local route is installed in modern IOS for IPv4 and IPv6.',
        'Selection process: (1) longest prefix match: among all routes whose prefix contains the destination address, the one with the longest mask is chosen, regardless of AD or metric. (2) If routes of the same prefix come from different sources, the lowest administrative distance wins. (3) If they come from the same protocol, the lowest metric wins; equal metrics allow equal-cost load balancing (ECMP).',
        'Common administrative distances: connected 0, static 1, EIGRP summary 5, eBGP 20, internal EIGRP 90, IGRP 100, OSPF 110, IS-IS 115, RIP 120, external EIGRP 170, iBGP 200, unknown 255 (never used). A floating static route has an AD higher than the dynamic protocol so it is used only as a backup.',
        'Metric is protocol-specific: OSPF uses cost (based on bandwidth), RIP uses hop count, EIGRP uses a composite of bandwidth and delay. Metrics from different protocols are not comparable, which is why AD exists.',
        'The default route appears as 0.0.0.0/0 with code S* (static) or O*E2 (OSPF-learned); the line "Gateway of last resort is ... to network 0.0.0.0" shows it. Verification: show ip route, show ip route <network>, show ip route static|ospf|connected, show ip route summary.',
      ],
    },
    {
      type: 'analogy',
      title: 'GPS na may tatlong tuntunin',
      body: [
        'A GPS has several saved routes that include your destination. First it prefers the route that names your exact street (longest match). If two sources describe the same street, it trusts the official map over a rumour (administrative distance). If both are official, it picks the shorter trip (metric).',
      ],
      taglish: [
        'Ang **GPS** ay may **ilang naka-save na ruta** na kasama ang destination mo. **Una**, mas gusto nito ang rutang **pinangalanan ang eksaktong kalye** (longest match). Kung **dalawang source ang naglalarawan ng parehong kalye**, **mas pinagkakatiwalaan ang opisyal na mapa kaysa tsismis** (administrative distance). Kung **parehong opisyal**, **pipiliin ang mas maikling biyahe** (metric).',
      ],
    },
    {
      type: 'hook',
      title: 'LAM: Longest match, Admin distance, Metric',
      trick: '**LAM**: **L**ongest prefix → **A**dmin distance (mababa) → **M**etric (mababa). AD: **C 0, S 1, O 110, R 120**.',
      taglish: [
        'Pagkakasunod ng pagpili: **L**ongest prefix, **A**dministrative distance, **M**etric.',
        '**Mas mababa = mas mabuti** sa AD at metric.',
        'AD na dapat kabisado: **Connected 0, Static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120**.',
        '**Longest prefix** ang pinakamataas na prayoridad — kahit **mataas ang AD o metric**, ang **mas tiyak na prefix** ang panalo.',
      ],
      test: {
        question: 'May routes: O 10.1.1.0/24 [110/20] at S 10.1.0.0/16 [1/0]. Alin ang gagamitin para sa 10.1.1.50, at bakit?',
        answer: 'Ang OSPF route na /24, dahil ang longest prefix match ang unang pamantayan; mas tiyak ito kahit mas mataas ang AD (110) kaysa static (1).',
      },
    },
    { type: 'diagram', id: 'route-entry', caption: 'Mga bahagi ng isang route entry sa show ip route.' },
    {
      type: 'terms',
      items: [
        { term: 'Routing table', definition: 'The list of networks a router knows and how to reach each one.' },
        { term: 'Prefix', definition: 'The destination network and mask, for example 10.2.0.0/24.' },
        { term: 'Administrative distance (AD)', definition: 'A trustworthiness rating of a route source; lower is preferred.' },
        { term: 'Metric', definition: 'A protocol-specific cost used to compare routes learned by the same protocol.' },
        { term: 'Longest prefix match', definition: 'The most specific matching route (longest mask) is chosen first.' },
        { term: 'Connected / Local route', definition: 'C: directly attached network. L: the router\'s own interface address (/32).' },
        { term: 'Gateway of last resort', definition: 'The default route used when nothing more specific matches.' },
        { term: 'Floating static route', definition: 'A static route with a higher AD used only as a backup.' },
      ],
    },
    {
      type: 'cli',
      title: 'Basahin ang show ip route',
      transcript: `R1# show ip route
Codes: L - local, C - connected, S - static, O - OSPF, * - candidate default

Gateway of last resort is 203.0.113.2 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.2
      10.0.0.0/8 is variably subnetted, 4 subnets, 3 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0
O        10.2.0.0/16 [110/2] via 10.1.1.2, 00:01:10, GigabitEthernet0/0
S        10.2.5.0/24 [1/0] via 10.1.1.3
R1# show ip route 10.2.5.9
Routing entry for 10.2.5.0/24
  Known via "static", distance 1, metric 0
  Routing Descriptor Blocks:
  * 10.1.1.3`,
      copyable: 'show ip route 10.2.5.9',
      explain: [
        { line: 'S*  0.0.0.0/0 [1/0] via 203.0.113.2', why: 'The default route (static candidate default), AD 1. Used only when nothing more specific matches.' },
        { line: 'C  10.1.1.0/24 ... GigabitEthernet0/0', why: 'A directly connected network. AD 0, no next hop needed.' },
        { line: 'L  10.1.1.1/32', why: 'The router\'s own address on that interface; traffic to it is processed by the router itself.' },
        { line: 'O  10.2.0.0/16 [110/2] via 10.1.1.2', why: 'An OSPF route: AD 110, metric (cost) 2, next hop 10.1.1.2, learned 1 minute 10 seconds ago.' },
        { line: 'S  10.2.5.0/24 [1/0] via 10.1.1.3', why: 'A more specific static route. For 10.2.5.9 this /24 beats the OSPF /16 by longest prefix match.' },
      ],
      note: 'Sample output for study.',
    },
    {
      type: 'flow',
      title: 'Sundan: pagpili ng route para sa 10.2.5.9',
      steps: [
        'Hinahanap ng R1 ang lahat ng route na kasama ang 10.2.5.9: 0.0.0.0/0, 10.0.0.0/8 (kung may), 10.2.0.0/16 at 10.2.5.0/24.',
        'Inihahambing ang haba ng prefix: /24 ang pinakamahaba (pinakatiyak).',
        'Panalo ang 10.2.5.0/24 anuman ang AD at metric ng iba.',
        'Kung may dalawang source para sa mismong 10.2.5.0/24, ang mas mababang AD ang pipiliin.',
        'Kung parehong OSPF at magkaiba ang metric, ang mas mababang metric ang panalo.',
        'Ipinapadala ang packet sa next hop 10.1.1.3 palabas sa Gi0/0.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **longest prefix match ay nauuna sa AD at metric**. Ang route na /24 ay tinatalo ang /16 kahit **mas mataas ang AD o metric** nito. Ang AD ay ginagamit lang kapag **pareho ang prefix**.' },
    { type: 'callout', kind: 'trap', text: 'Ang **mga metric ng magkaibang protocol ay hindi maikukumpara** (OSPF cost vs RIP hops). Iyon ang dahilan kung bakit may **administrative distance**.' },
    { type: 'callout', kind: 'tip', text: 'Kabisaduhin: **Connected 0 · Static 1 · eBGP 20 · EIGRP 90 · OSPF 110 · RIP 120**. Ang **floating static** ay static na may **AD na mas mataas** sa dynamic (halimbawa 130) para **backup lang**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagpili ng route batay sa AD o metric bago ang prefix length.',
        'Pagkalito sa AD at metric.',
        'Pag-iisip na ang L route ay isang network na maaabot.',
        'Pagbasa ng [110/2] bilang metric/AD sa maling pagkakasunod.',
        'Paglimot na ang S* ay default route.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Maling daan ang ginagamit ng router"',
      scenario: 'Traffic to 10.2.5.9 goes to the wrong next hop even though OSPF has the correct route.',
      evidence: `R1# show ip route 10.2.5.9
Routing entry for 10.2.5.0/24
  Known via "static", distance 1, metric 0
  * 10.1.1.99
R1# show ip route ospf
O  10.2.5.0/24 [110/2] via 10.1.1.2`,
      question: 'Bakit mali ang next hop?',
      answer: 'May static route para sa parehong 10.2.5.0/24 na AD 1 (mas mababa kaysa OSPF 110), kaya ang static ang ginagamit kahit mali ang next hop (10.1.1.99).',
      fix: 'Burahin ang maling static route: no ip route 10.2.5.0 255.255.255.0 10.1.1.99. Pagkatapos ay lalabas ang OSPF route sa table; i-verify gamit ang show ip route 10.2.5.9.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'May tatlong route para sa 172.16.5.20: S 172.16.0.0/16 [1/0], O 172.16.5.0/24 [110/10], O 172.16.5.16/28 [110/50]. Alin ang gagamitin?',
      answer: 'Ang 172.16.5.16/28, dahil kasama nito ang 172.16.5.20 at ang /28 ang pinakamahaba (longest prefix match), kahit ang metric ay 50 at AD 110.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Selection order: longest prefix, then lowest AD, then lowest metric.',
        'Route codes: C connected, L local /32, S static, S* static default, O OSPF, D EIGRP.',
        'AD: connected 0, static 1, EIGRP 90, OSPF 110, RIP 120.',
        '[110/2] means AD 110 and metric 2.',
        'Gateway of last resort shows the default route.',
      ],
    },
    {
      type: 'summary',
      points: [
        'show ip route lists each network with code, [AD/metric], next hop and interface.',
        'Choose by longest prefix, then lowest AD, then lowest metric.',
        'Connected and local routes appear automatically for up interfaces.',
        'The default route is the gateway of last resort.',
        'Susunod: Static routes — mano-manong paglalagay ng ruta.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'easy', type: 'single',
    prompt: 'What does the route code "C" mean in show ip route?',
    choices: ['Configured manually', 'Directly connected network', 'Cisco proprietary', 'Candidate default'], correct: [1],
    explanation: 'C marks a directly connected network.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'easy', type: 'single',
    prompt: 'In "O 10.2.0.0/16 [110/2] via 10.1.1.2", what is 110?',
    choices: ['The metric', 'The administrative distance', 'The prefix length', 'The interface number'], correct: [1],
    explanation: 'The first number in brackets is the administrative distance and the second is the metric.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'medium', type: 'single',
    prompt: 'Which route is chosen first when several routes match a destination?',
    choices: ['The lowest metric', 'The longest prefix match', 'The lowest AD', 'The newest route'], correct: [1],
    explanation: 'Longest prefix match is applied before AD and metric.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'medium', type: 'single',
    prompt: 'Which source has the lowest administrative distance?',
    choices: ['OSPF', 'RIP', 'A static route', 'EIGRP internal'], correct: [2],
    explanation: 'Static routes have AD 1; connected has 0; EIGRP 90, OSPF 110, RIP 120.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'hard', type: 'single',
    prompt: 'A router has S 10.0.0.0/8 [1/0] and O 10.5.5.0/24 [110/20]. Which is used for 10.5.5.9?',
    choices: ['The static /8 because its AD is lower', 'The OSPF /24 because it is more specific', 'Both are load balanced', 'Neither'], correct: [1],
    explanation: 'The /24 is the longest prefix match, which is decided before AD.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'medium', type: 'single',
    prompt: 'What does the "L" code represent?',
    choices: ['A learned route', 'The router\'s own interface address as a /32', 'A link-state route', 'A default route'], correct: [1],
    explanation: 'L entries are the local /32 addresses of the router\'s interfaces.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'medium', type: 'single',
    prompt: 'Which command shows the route a router would use for a specific destination address?',
    choices: ['show ip route 10.2.5.9', 'show ip interface brief', 'show arp', 'show version'], correct: [0],
    explanation: 'show ip route <address> displays the matching routing entry.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO statements about metric and AD are true?',
    choices: ['AD compares route sources', 'Metrics from different protocols are directly comparable', 'Metric compares routes learned by the same protocol', 'A higher AD is preferred'], correct: [0, 2],
    explanation: 'AD ranks sources; metrics rank routes within a protocol. Lower values are preferred.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: S* in the routing table indicates a static default route.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — S* is a static route that is a candidate default.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: paano pinipili ang route?', back: 'LAM: Longest prefix → Admin distance (mababa) → Metric (mababa). AD: C 0, S 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Route selection order?', back: '1) longest prefix match; 2) lowest administrative distance; 3) lowest metric.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Administrative distances?', back: 'Connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120, iBGP 200.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Route codes?', back: 'C connected, L local /32, S static, S* static default, O OSPF, D EIGRP.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Read [110/2]?', back: 'Administrative distance 110, metric 2.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'command', front: 'Show the route for one address?', back: 'show ip route <address>' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Predict the route, then verify',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Read a routing table, predict which route is used for several destinations and confirm with show ip route.',
  topology: 'R1 with one connected LAN, a static route, a more specific static route and a default route.',
  steps: [
    'On R1 configure: ip route 10.0.0.0 255.0.0.0 172.16.0.2, ip route 10.5.5.0 255.255.255.0 172.16.0.3 and ip route 0.0.0.0 0.0.0.0 172.16.0.9.',
    'Run show ip route and identify each code and [AD/metric].',
    'Predict the next hop for 10.9.9.9, 10.5.5.20 and 8.8.8.8 before testing.',
    'Verify each with show ip route <address>.',
    'Add a floating static to 10.5.5.0/24 with AD 130 via 172.16.0.4 and confirm it is not installed.',
    'Shut the interface to 172.16.0.3 and observe the floating route appear.',
  ],
  checklist: [
    'Predictions made before verifying',
    'All three predictions correct',
    'Floating static installed only after the failure',
  ],
  hints: [
    'Longest prefix first, then AD, then metric.',
    'A route with an unreachable next hop is removed from the table.',
  ],
  solution: [
    '10.9.9.9 uses 10.0.0.0/8; 10.5.5.20 uses 10.5.5.0/24; 8.8.8.8 uses the default route.',
    'The floating static (AD 130) appears only when the preferred AD 1 route disappears.',
  ],
  breakIt: 'Give the floating static an AD of 1 as well and observe both being used or the first one winning depending on order.',
};
