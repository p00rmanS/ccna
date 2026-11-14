import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'longest-prefix-match';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.3',
  domain: 'D3',
  title: 'Longest Prefix Match: Pick the Route Like a Router',
  description: 'Practise the router forwarding decision step by step: match the destination, choose the longest prefix, then break ties with administrative distance and metric.',
  whyMatters:
    'Ito ang objective 3.2 at isa sa pinakamadalas na tanong sa exam: bibigyan ka ng routing table at isang destination IP, tapos tatanungin kung aling ruta ang gagamitin. May tatlong hakbang lang at paulit-ulit ang parehong paraan, kaya puwedeng maging sigurado ang sagot.',
  objectives: [
    'List all routes that match a destination address',
    'Select the longest prefix among the matches',
    'Break ties with administrative distance and then metric',
    'Recognise equal-cost load balancing',
    'Explain why a /32 host route and a default route behave as they do',
  ],
  estimatedMinutes: 35,
  difficulty: 'exam',
  keywords: ['longest prefix match', 'forwarding decision', 'administrative distance', 'metric', 'routing table', 'host route', 'default route', 'ECMP', 'most specific route'],
  examObjectives: ['3.2'],
  sections: [
    {
      type: 'explain',
      simple: [
        'When a packet arrives, the router finds every route whose network contains the destination address. From those matches it picks the one with the longest prefix length (the most specific). Administrative distance and metric are used only when the prefix length ties.',
        'So the order is: prefix length first, then administrative distance, then metric.',
      ],
      taglish: [
        'Pagdating ng packet, hinahanap ng router **lahat ng ruta na sumasaklaw sa destination address**. Sa mga iyon, pinipili ang may **pinakamahabang prefix (pinaka-tiyak)**. Ang **administrative distance at metric** ay ginagamit lang kapag **magkapareho ang haba ng prefix**.',
        'Kaya ang pagkakasunod: **(1) pinakamahabang prefix → (2) pinakamababang AD → (3) pinakamababang metric**.',
        'Mahalagang tandaan: **hindi ang metric ang unang tinitingnan**. Ang /24 na may malaking metric ay mananalo pa rin laban sa /16 na may maliit na metric kung ang destination ay tumutugma sa dalawa.',
      ],
      technical: [
        'The forwarding decision compares the destination IP with each route’s prefix and mask. A route matches if the destination falls inside the prefix. The router selects the matching route with the longest mask. If several routes have the same prefix and mask (for example learned from OSPF and RIP), the lowest administrative distance wins; if the same routing protocol offers several paths to the same prefix, the lowest metric wins; equal metrics produce equal-cost multipath (up to the configured maximum).',
        'Administrative distance only compares routes to the identical prefix from different sources. A less specific route is never chosen over a more specific matching one, regardless of AD or metric. The default route 0.0.0.0/0 matches every destination with a prefix length of 0, so it is used only when nothing else matches.',
        'A host route (/32 for IPv4, /128 for IPv6) is the most specific possible route and wins for that single address.',
      ],
    },
    {
      type: 'analogy',
      title: 'Hanapin ang address sa mapa',
      body: [
        'Searching an address on a map: “Philippines” matches, “Luzon” matches better, “Quezon City” better still, and “12 Rizal St, Quezon City” is the best. You go with the most specific match, regardless of how big the broader area is.',
      ],
      taglish: [
        'Parang paghahanap ng address sa mapa: “Pilipinas” ay tumutugma, “Luzon” mas tumutugma, “Quezon City” mas tumutugma pa, at “12 Rizal St, Quezon City” ang pinaka-tumutugma. **Pinipili mo ang pinaka-tiyak**, gaano man kalaki ang mas malawak na lugar.',
      ],
    },
    {
      type: 'hook',
      title: 'TIYAK muna, AD, metric',
      trick: '**1) TUGMA (listahan) → 2) PINAKAMAHABANG PREFIX → 3) tie? mas mababang AD → 4) tie? mas mababang metric → 5) tie pa? ECMP. Walang tugma = default; walang default = drop.**',
      taglish: [
        '**Tugma**: ilista lahat ng ruta na sumasaklaw sa destination.',
        '**Pinakamahabang prefix** ang panalo: /32 > /30 > /24 > /16 > /8 > /0.',
        '**Tie sa prefix?** pinakamababang **AD**; **tie pa?** pinakamababang **metric**.',
        '**Walang tugma** = default route (0.0.0.0/0); **walang default** = **drop** at ICMP unreachable.',
      ],
      test: {
        question: 'Mga ruta: 10.0.0.0/8, 10.1.0.0/16, 10.1.1.0/24. Anong ruta ang gagamitin para sa 10.1.1.5?',
        answer: 'Ang 10.1.1.0/24. Ang tatlo ay tumutugma pero ang /24 ang pinakamahaba.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Isang buong halimbawa',
      paragraphs: [
        'Routing table: **10.0.0.0/8** (OSPF), **10.1.0.0/16** (static), **10.1.1.0/24** (RIP), **10.1.1.128/25** (static), **0.0.0.0/0** (static default).',
        '**Destination 10.1.1.200**: tumutugma ang /8, /16, /24 at /25 (ang /25 ay sumasaklaw sa 10.1.1.128–255) at ang default. Pinakamahaba ang **/25** → gamitin ang 10.1.1.128/25.',
        '**Destination 10.1.1.50**: tumutugma ang /8, /16, /24 (hindi ang /25 dahil nasa 128–255 lang iyon) at default. Panalo ang **/24 (RIP)**. **10.1.2.5**: /8, /16 → panalo ang **/16**. **10.9.9.9**: /8 lang → **/8**. **172.16.1.1**: wala maliban sa default → **0.0.0.0/0**.',
        'Pansinin: ang RIP route na /24 ay panalo laban sa OSPF /8 kahit mas mataas ang AD ng RIP (120) kaysa OSPF (110): **prefix muna, hindi AD**.',
      ],
      steps: [
        'Isulat ang destination address.',
        'Para sa bawat ruta, tingnan kung nasa loob ng prefix ang destination.',
        'Ilista ang mga tugma at piliin ang pinakamahabang prefix.',
        'Kung may tie sa prefix, ihambing ang AD; saka metric.',
        'Walang tugma? Default route; walang default? Drop.',
      ],
      tricks: [
        'Para sa /25 sa ikaapat na octet: 0–127 o 128–255. Gamitin ang magic number na natutunan mo sa subnetting.',
        'Isulat ang range ng bawat ruta (network–broadcast) para madaling makita kung tumutugma.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Kapag magkapareho ang prefix',
      paragraphs: [
        'Kung may dalawang ruta sa **parehong prefix at mask** mula sa magkaibang pinagmulan, ang **mas mababang AD** ang panalo: Connected 0, Static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120. Halimbawa, 192.168.5.0/24 mula sa static (1) at OSPF (110) → static ang gagamitin; ang OSPF ay hindi lilitaw sa table (naka-backup).',
        'Kung ang parehong routing protocol ay may dalawang daan sa parehong prefix, ang **mas mababang metric** ang panalo (OSPF cost, RIP hop count). Kung **pantay** ang metric, **dalawa ang ilalagay** at hahatiin ang trapiko (equal-cost load balancing, hanggang 4 bilang default sa OSPF).',
        'Ang **floating static** ay static na may mas mataas na AD kaysa sa dynamic na ruta, kaya nakatago hanggang mawala ang dynamic. Dito nagagamit ang AD sa totoong buhay.',
      ],
      steps: [
        'Magkaparehong prefix at mask? Ihambing ang AD.',
        'Pareho ang AD at protocol? Ihambing ang metric.',
        'Pareho ang metric? Equal-cost load balancing.',
        'Ang natalong ruta ay maaaring manatiling nakatago bilang backup.',
      ],
      tricks: [
        'Ang AD ay hindi nagpapasya sa pagitan ng /16 at /24 — iba ang prefix kaya prefix ang nagpapasya.',
        'Sa [110/20], ang 110 ay AD at 20 ay metric.',
      ],
    },
    {
      type: 'remember',
      title: 'Longest prefix match na lumalabas sa exam',
      items: [
        '**Pagkakasunod: pinakamahabang prefix → pinakamababang AD → pinakamababang metric.**',
        '**Ang AD ay para sa magkaparehong prefix lang.** **Ang /24 ay tatalo sa /16 anuman ang AD o metric.**',
        '**Default route 0.0.0.0/0 = huling opsyon; host route /32 = pinaka-tiyak.**',
        '**AD: Connected 0, Static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120.**',
        '**Walang tugma at walang default = drop at ICMP destination unreachable.**',
      ],
    },
    { type: 'diagram', id: 'route-entry', caption: 'Pagbasa ng isang entry sa routing table: code, prefix, AD/metric, next hop.' },
    {
      type: 'terms',
      items: [
        { term: 'Longest prefix match', definition: 'Selecting, among matching routes, the one with the longest mask.' },
        { term: 'Administrative distance', definition: 'Trustworthiness of a route source; lower is preferred between identical prefixes.' },
        { term: 'Metric', definition: 'The routing protocol’s cost to reach a prefix; lower is better within one protocol.' },
        { term: 'Host route', definition: 'A /32 (IPv4) or /128 (IPv6) route for a single address.' },
        { term: 'Default route', definition: '0.0.0.0/0 (or ::/0): matches everything with prefix length 0.' },
        { term: 'ECMP', definition: 'Equal-cost multipath: several routes of equal cost installed and used together.' },
        { term: 'Gateway of last resort', definition: 'The next hop of the default route shown at the top of show ip route.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ang desisyon ng router',
      steps: [
        'Kunin ang destination IP ng packet.',
        'Ilista ang lahat ng ruta na sumasaklaw sa destination.',
        'Piliin ang pinakamahabang prefix.',
        'Tie? Mas mababang AD, saka mas mababang metric; tie pa, ECMP.',
        'Walang tugma: default route; kung wala, drop at ICMP unreachable.',
      ],
    },
    {
      type: 'cli',
      title: 'Basahin ang routing table',
      transcript: `R1# show ip route
Gateway of last resort is 10.0.99.1 to network 0.0.0.0
O     10.0.0.0/8 [110/30] via 10.0.12.2, Gi0/0
S     10.1.0.0/16 [1/0] via 10.0.13.2
R     10.1.1.0/24 [120/2] via 10.0.14.2, Gi0/2
S     10.1.1.128/25 [1/0] via 10.0.15.2
S*    0.0.0.0/0 [1/0] via 10.0.99.1
R1# show ip route 10.1.1.200
Routing entry for 10.1.1.128/25
  Known via "static", distance 1, metric 0
  * 10.0.15.2`,
      copyable: 'show ip route\nshow ip route 10.1.1.200',
      explain: [
        { line: 'show ip route 10.1.1.200', why: 'Asks the router which route it would use for that destination: it prints the longest-prefix match.' },
        { line: 'S 10.1.1.128/25 [1/0]', why: 'A static /25 route; it is the most specific match for 10.1.1.200.' },
        { line: 'S* 0.0.0.0/0', why: 'The default route; it is used only when no other route matches.' },
      ],
      note: 'show ip route <address> is the quickest way to confirm which route the router chooses.',
    },
    { type: 'callout', kind: 'trap', text: 'Hindi **AD ang unang tinitingnan**. Kung magkaiba ang prefix length, **prefix ang nagpapasya**. Ang AD ay para lang sa magkaparehong prefix.' },
    { type: 'callout', kind: 'trap', text: 'Suriin kung **talagang sumasaklaw** ang /25 sa destination. Ang 10.1.1.128/25 ay hindi sumasaklaw sa 10.1.1.50 (ang saklaw niya ay .128–.255).' },
    { type: 'callout', kind: 'tip', text: 'Isulat ang bawat ruta bilang range (network hanggang broadcast) sa gilid, saka tingnan kung nasa loob ang destination.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Comparing administrative distance before prefix length.',
        'Assuming a /25 matches an address outside its range.',
        'Choosing the lowest metric among routes of different prefix lengths.',
        'Forgetting that the default route is only the last resort.',
        'Thinking that no match falls back to flooding instead of drop.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Maling daan ang tinatahak',
      scenario: 'Traffic to the server 10.1.1.200 goes toward 10.0.15.2, but the team expected it to go via OSPF toward 10.0.12.2.',
      evidence: `R1# show ip route 10.1.1.200
Routing entry for 10.1.1.128/25
  Known via "static", distance 1, metric 0
  * 10.0.15.2
R1# show ip route | include 10.1.1.
R     10.1.1.0/24 [120/2] via 10.0.14.2
S     10.1.1.128/25 [1/0] via 10.0.15.2`,
      question: 'Bakit static route ang ginamit?',
      answer: 'A leftover static /25 is more specific than any other matching route (the /24 and the OSPF /8), so longest prefix match selects it before AD or metric are considered.',
      fix: 'Remove or correct the static route (no ip route 10.1.1.128 255.255.255.128 10.0.15.2) if it is not wanted, or advertise a matching /25 via OSPF; then check with show ip route 10.1.1.200.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Mga ruta: 192.168.0.0/16 (OSPF, [110/10]), 192.168.4.0/22 (static, [1/0]), 192.168.5.0/24 (RIP, [120/3]), 0.0.0.0/0. Anong ruta ang pipiliin para sa (a) 192.168.5.9, (b) 192.168.7.1, (c) 192.168.9.1, (d) 10.9.9.9?',
      answer: '(a) /24 RIP: 192.168.5.0/24 is the longest match (it lies inside the /22 and /16 too). (b) 192.168.4.0/22 covers 192.168.4.0–192.168.7.255, so /22 static. (c) Only the /16 matches (outside the /22): OSPF. (d) Default route 0.0.0.0/0.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Prefix length first, then AD, then metric.',
        'Write each route as a range and test the destination.',
        'A /32 host route beats everything for that address.',
        'The default route is last.',
        'show ip route <ip> shows the chosen route.',
      ],
    },
    {
      type: 'summary',
      points: [
        'List the matches, pick the longest prefix.',
        'Use AD only between equal prefixes, then metric.',
        'Equal cost means load balancing.',
        'No match: default; no default: drop.',
        'Susunod: basic switch configuration.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'easy', type: 'single',
    prompt: 'A router has routes to 10.0.0.0/8 and 10.1.0.0/16. Which route is used for 10.1.5.5?',
    choices: ['10.0.0.0/8', '10.1.0.0/16', 'Both equally', 'The default route'], correct: [1],
    explanation: 'Both match, but the /16 has the longer prefix.',
    wrong: { 0: 'The /8 is less specific.', 2: 'Prefix length breaks the tie.', 3: 'A more specific route exists.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'medium', type: 'single',
    prompt: '10.1.1.0/24 is learned from RIP (AD 120) and 10.1.0.0/16 from OSPF (AD 110). Which is used for 10.1.1.5?',
    choices: ['The OSPF /16 because of the lower AD', 'The RIP /24 because it has the longer prefix', 'Both are used', 'Neither'], correct: [1],
    explanation: 'Prefix length is compared before administrative distance.',
    wrong: { 0: 'AD is only used between identical prefixes.', 2: 'Different prefixes are not load balanced.', 3: 'Both match.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'medium', type: 'single',
    prompt: 'The same prefix 192.168.5.0/24 is learned from OSPF and from a static route. Which one is installed?',
    choices: ['OSPF (AD 110)', 'Static (AD 1)', 'Both', 'The one with the higher metric'], correct: [1],
    explanation: 'With identical prefixes the lowest administrative distance wins: static 1 beats OSPF 110.',
    wrong: { 0: 'OSPF has the higher AD.', 2: 'Only the lowest AD is installed.', 3: 'Metric applies within one protocol.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'hard', type: 'single',
    prompt: 'Which route matches the destination 10.1.1.50?',
    choices: ['10.1.1.128/25', '10.1.1.0/25', '10.1.1.64/26', '10.1.1.200/32'], correct: [1],
    explanation: '10.1.1.0/25 covers 10.1.1.0–127, which contains .50. The /25 at .128 starts at 128, the /26 at .64 covers 64–127 and the /32 is a different host.',
    wrong: { 0: '10.1.1.128/25 covers .128–.255.', 2: '10.1.1.64/26 covers .64–.127.', 3: 'The /32 matches only .200.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: if no route matches and there is no default route, the router drops the packet.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'The packet is dropped and an ICMP destination unreachable message is returned to the source.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are used to choose between routes to the same prefix?',
    choices: ['Administrative distance', 'Metric', 'Alphabetical order of the interface', 'The packet size'], correct: [0, 1],
    explanation: 'The lowest administrative distance wins between sources; the lowest metric wins within one protocol.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: ang desisyon ng router?', back: 'Tugma → pinakamahabang prefix → mababang AD → mababang metric → ECMP. Walang tugma = default; walang default = drop.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What is longest prefix match?', back: 'Choosing the matching route with the longest mask.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'When is AD used?', back: 'Only between routes to the identical prefix from different sources.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'concept', front: 'When is metric used?', back: 'Between routes to the same prefix from the same routing protocol.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What happens with equal costs?', back: 'Equal-cost load balancing across the routes.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What if no route matches?', back: 'Use the default route; if none, drop and send ICMP unreachable.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D3', category: 'command', front: 'Which command shows the route for one address?', back: 'show ip route <address>.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Predict the route, then prove it',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Predict the chosen route for several destinations from a routing table and verify with show ip route.',
  steps: [
    'Build a router with five static routes: 10.0.0.0/8, 10.1.0.0/16, 10.1.1.0/24, 10.1.1.128/25 and a default, each pointing to a different next hop (use loopback routers or any reachable addresses).',
    'Write down the range of each route.',
    'Predict the chosen route for 10.1.1.200, 10.1.1.50, 10.1.2.5, 10.9.9.9 and 172.16.1.1.',
    'Verify each with show ip route <address>.',
    'Add a second route to 10.1.1.0/24 with a higher administrative distance (floating) and check that it is hidden.',
    'Remove the default route and ping an unknown address; read the ICMP result.',
  ],
  checklist: [
    'All five predictions written before checking',
    'Predictions verified',
    'Floating route observed hidden',
    'Drop without default observed',
  ],
  hints: [
    'Write each route as a range.',
    'show ip route <address> prints the chosen route.',
  ],
  solution: [
    '10.1.1.200 → /25; 10.1.1.50 → /24; 10.1.2.5 → /16; 10.9.9.9 → /8; 172.16.1.1 → default.',
    'The floating route is hidden while the AD 1 route exists.',
    'Without a default route the ping fails with destination unreachable.',
  ],
  breakIt: 'Add a /32 host route for 10.1.1.50 and observe that it overrides the /24 for that address.',
};
