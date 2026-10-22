import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'static-routes';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.4',
  domain: 'D3',
  title: 'IPv4 Static Routes: Next Hop, Exit Interface and Floating Routes',
  description: 'How to write static routes with a next-hop address or an exit interface, why return routes matter, and how a floating static route provides a backup.',
  whyMatters:
    'Ang static route ang pinakasimpleng paraan para turuan ang router ng daan. Madalas itong lumabas sa exam bilang config at troubleshooting: "bakit hindi makabalik ang ping?" — kadalasan ay kulang ang return route. Mahalaga rin ang floating static route bilang backup at ang pagkakaiba ng next-hop at exit-interface.',
  objectives: [
    'Write a static route using the ip route command with a next hop',
    'Explain when to use an exit interface and a fully specified route',
    'Explain why a return route is required for two-way communication',
    'Configure a floating static route using administrative distance',
    'Verify static routes with show ip route and test with ping and traceroute',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['static route', 'ip route', 'next hop', 'exit interface', 'floating static', 'administrative distance', 'return route', 'recursive lookup', 'fully specified', 'show ip route static'],
  examObjectives: ['3.3'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A router only knows its directly connected networks. To reach any other network you must teach it: either by hand with a static route, or automatically with a routing protocol. A static route says "to reach this network, send packets to this neighbour".',
        'Routing works in both directions. If R1 knows how to reach the server network but R2 has no route back to the PC network, the ping request arrives but the reply is lost. Always add the return route.',
      ],
      taglish: [
        'Ang **router ay kilala lang ang mga direktang nakakonektang network**. Para maabot ang iba, **tuturuan mo ito**: **mano-mano gamit ang static route**, o **awtomatiko gamit ang routing protocol**. Sinasabi ng static route: **"para maabot ang network na ito, ipadala sa kapitbahay na ito"**.',
        'Dalawang direksyon ang routing. Kung **alam ng R1 ang daan papunta sa server network** pero **walang pabalik na route ang R2 papunta sa PC network**, **darating ang ping request pero mawawala ang reply**. **Laging idagdag ang return route**.',
        'Tatlong anyo ng command: **next hop** (ip route 10.0.0.0 255.0.0.0 172.16.0.2), **exit interface** (ip route 10.0.0.0 255.0.0.0 s0/0/0) at **fully specified** (pareho).',
        'Ang **floating static route** ay **static na may mas mataas na AD** (halimbawa 130) para **backup lang** kapag nawala ang dynamic route.',
      ],
      technical: [
        'Syntax: ip route <network> <mask> {<next-hop-ip> | <exit-interface> | <exit-interface> <next-hop-ip>} [<administrative-distance>]. A static route has a default AD of 1 and is installed only if the next hop is reachable via a route in the table (for a next-hop route) or the exit interface is up (for an interface route).',
        'Next-hop route: the router performs a recursive lookup to find the interface that reaches the next hop, then resolves the next-hop MAC with ARP. Exit-interface route on a point-to-point serial link works well; on Ethernet it makes the router ARP for the final destination address (proxy ARP dependence) and is discouraged. A fully specified route names both the interface and the next hop, which is best on multi-access Ethernet.',
        'Return routes: every router on the path needs a route to the source network. Use a static route on the far router, or use a default route toward the near router in a stub design. Summarise where possible: one static route for 192.168.0.0/22 can replace four /24 routes if the next hop is the same.',
        'Floating static route: give the backup an administrative distance greater than the primary protocol, for example ip route 10.0.0.0 255.0.0.0 172.16.9.2 130 to back up an OSPF (110) route. The floating route is not in the routing table until the primary route is withdrawn, then it is installed automatically.',
        'Verification: show ip route static (only static routes), show ip route <network>, show running-config | include ip route, ping and traceroute from both ends. A static route disappears from the table if its exit interface goes down or the next hop becomes unreachable. Use permanent only where appropriate.',
      ],
    },
    {
      type: 'analogy',
      title: 'Direksyon ng barangay',
      body: [
        'A static route is a signpost you plant yourself: "to reach Barangay Maligaya, turn right at the next junction". If a road collapses, the signpost still points there. A floating static route is a second signpost that only becomes visible when the first road is closed.',
      ],
      taglish: [
        'Ang **static route** ay **karatulang itinanim mo mismo**: **"para sa Barangay Maligaya, kumanan sa susunod na kanto"**. Kapag **gumuho ang kalsada**, **nakaturo pa rin ang karatula**. Ang **floating static route** ay **pangalawang karatula na lilitaw lang kapag sarado ang una**.',
      ],
    },
    {
      type: 'hook',
      title: 'NIH: Network, mask, hop — at laging may PABALIK',
      trick: '**ip route** + **N**etwork + **M**ask + **H**op (o interface). Laging **return route**. **Floating** = **AD mas mataas** (130).',
      taglish: [
        '**ip route <network> <mask> <next-hop>**: **network, mask, hop**.',
        '**Laging ilagay ang pabalik na route** sa kabilang router.',
        '**Floating static** = **dagdag na AD** (hal. 130, higit sa OSPF 110), para **backup lang**.',
        '**Static AD = 1**. **Kapag nawala ang next hop**, **mawawala rin ang route**.',
      ],
      test: {
        question: 'Nagagawa ng R1 na i-ping ang server pero walang reply. Ano ang pinakamalamang na kulang?',
        answer: 'Return route: walang route ang router malapit sa server papunta sa network ng PC (o ang gateway ng server), kaya hindi makabalik ang reply.',
      },
    },
    { type: 'diagram', id: 'static-route-pair', caption: 'Kailangan ng route sa magkabilang direksyon: forward at return.' },
    {
      type: 'terms',
      items: [
        { term: 'Static route', definition: 'A manually configured route with default administrative distance 1.' },
        { term: 'Next-hop route', definition: 'A static route that names the neighbour\'s IP address as the way to the network.' },
        { term: 'Exit-interface route', definition: 'A static route that names the outgoing interface instead of a next-hop address.' },
        { term: 'Fully specified route', definition: 'A static route naming both the exit interface and the next-hop IP.' },
        { term: 'Return route', definition: 'The route back to the source network, needed for replies.' },
        { term: 'Floating static route', definition: 'A static route with a higher AD that acts as a backup.' },
        { term: 'Recursive lookup', definition: 'The router looks up the next hop in the routing table to find the exit interface.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: mag-ping mula LAN1 papunta sa LAN2 sa pamamagitan ng dalawang router',
      steps: [
        'Ang PC1 (192.168.1.10) ay nagpapadala papunta sa server 192.168.2.10; ang gateway ay R1.',
        'May static route ang R1: ip route 192.168.2.0 255.255.255.0 172.16.0.2, kaya ipinapasa ang packet sa R2.',
        'Ang R2 ay direktang konektado sa 192.168.2.0/24 kaya naihahatid ang packet sa server.',
        'Sumasagot ang server sa 192.168.1.10 at ipinapadala ang reply sa gateway nito, R2.',
        'May static route ang R2: ip route 192.168.1.0 255.255.255.0 172.16.0.1, kaya naipapasa ang reply sa R1.',
        'Natatanggap ng PC1 ang reply. Kung kulang ang alinman sa dalawang static route, mabibigo ang ping.',
      ],
    },
    {
      type: 'cli',
      title: 'Next hop, exit interface at floating static',
      transcript: `R1(config)# ip route 192.168.2.0 255.255.255.0 172.16.0.2
R1(config)# ip route 192.168.3.0 255.255.255.0 gi0/1 172.16.0.2
R1(config)# ip route 10.0.0.0 255.0.0.0 172.16.9.2 130
R1(config)# end
R1# show ip route static
S    192.168.2.0/24 [1/0] via 172.16.0.2
S    192.168.3.0/24 [1/0] via 172.16.0.2, GigabitEthernet0/1
R1# ping 192.168.2.10
!!!!!

R2(config)# ip route 192.168.1.0 255.255.255.0 172.16.0.1`,
      copyable: 'ip route 192.168.2.0 255.255.255.0 172.16.0.2',
      explain: [
        { line: 'ip route 192.168.2.0 255.255.255.0 172.16.0.2', why: 'Next-hop static route: to reach 192.168.2.0/24, send to 172.16.0.2.' },
        { line: 'ip route 192.168.3.0 255.255.255.0 gi0/1 172.16.0.2', why: 'Fully specified route: names the exit interface and next hop; recommended on Ethernet links.' },
        { line: 'ip route 10.0.0.0 255.0.0.0 172.16.9.2 130', why: 'Floating static route: AD 130 is higher than OSPF 110, so it is only a backup.' },
        { line: 'show ip route static', why: 'Lists only static routes so you can confirm what was installed.' },
        { line: 'ip route 192.168.1.0 ... (on R2)', why: 'The return route. Without it replies cannot reach the source network.' },
      ],
      note: 'Sample output for study. The floating route is not shown until the preferred route disappears.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show ip route static', shows: 'Static routes installed in the table with [AD/metric] and next hop.' },
        { command: 'show running-config | include ip route', shows: 'All static routes configured, including those not currently installed.' },
        { command: 'ping and traceroute from both ends', shows: 'Whether the forward and return paths both work and where it fails.' },
        { command: 'show ip route <network>', shows: 'The exact route entry used for a destination.' },
      ],
      good: 'Pings succeed in both directions and the static routes appear with S.',
      bad: 'Request arrives but no reply (missing return route), or a route missing from the table (next hop unreachable or interface down).',
    },
    { type: 'callout', kind: 'trap', text: 'Kung **nagtagumpay ang request pero walang reply**, **kulang ang return route**. Hindi problema ang forward route. Ito ang pinakamadalas na dahilan ng "hindi mag-ping" sa mga lab.' },
    { type: 'callout', kind: 'trap', text: 'Ang **floating static route ay hindi lalabas sa routing table** habang **gumagana ang mas mababang-AD na route**. Normal ito — **hindi ito sira**.' },
    { type: 'callout', kind: 'tip', text: 'Sa **Ethernet**, gamitin ang **next hop** o **fully specified**. Ang **exit-interface lang** sa Ethernet ay nagpapa-ARP sa router para sa **bawat destination** — hindi mainam.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Paglimot sa return route.',
        'Maling mask o network address sa ip route.',
        'Paggamit ng exit interface lang sa Ethernet.',
        'Pagtatakda ng floating static na may AD na mas mababa sa primary.',
        'Pag-akalang bagsak ang floating route dahil wala ito sa table.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Walang reply sa ping mula sa server"',
      scenario: 'PC1 pings the server at 192.168.2.10 and gets "Request timed out", yet a traceroute shows the request reaches R2.',
      evidence: `R1# show ip route static
S    192.168.2.0/24 [1/0] via 172.16.0.2
R2# show ip route
C    192.168.2.0/24 is directly connected, GigabitEthernet0/0
C    172.16.0.0/30 is directly connected, GigabitEthernet0/1`,
      question: 'Ano ang kulang?',
      answer: 'Walang route ang R2 papunta sa 192.168.1.0/24 (network ng PC1). Dumarating ang request pero hindi makabalik ang reply.',
      fix: 'Sa R2: ip route 192.168.1.0 255.255.255.0 172.16.0.1. Pagkatapos ay ulitin ang ping at i-verify ang show ip route sa R2.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang static route sa R1 para sa 10.20.0.0/16 gamit ang next hop 172.16.0.2, at floating static backup na gumagamit ng 172.16.9.2 na hindi kailanman lumalagpas sa AD ng OSPF.',
      answer: 'ip route 10.20.0.0 255.255.0.0 172.16.0.2 at ip route 10.20.0.0 255.255.0.0 172.16.9.2 130. Ang AD 130 ay mas mataas sa OSPF (110) kaya backup lang ito.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'ip route <network> <mask> <next-hop | exit-interface> [AD].',
        'Static route default AD is 1; a floating static uses a higher AD.',
        'Every path needs a route in both directions.',
        'On Ethernet use a next hop or a fully specified route.',
        'show ip route static and ping from both ends verify the result.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Static routes are manually configured with ip route; AD is 1 by default.',
        'Add return routes so replies can get back.',
        'Use next hop or fully specified routes on Ethernet.',
        'Floating static routes use a higher AD for backup.',
        'Susunod: Default routes — ang "gateway of last resort".',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'easy', type: 'single',
    prompt: 'Which command creates a static route to 192.168.2.0/24 via 172.16.0.2?',
    choices: ['ip route 192.168.2.0 255.255.255.0 172.16.0.2', 'route 192.168.2.0/24 172.16.0.2', 'ip static 192.168.2.0 172.16.0.2', 'network 192.168.2.0 172.16.0.2'], correct: [0],
    explanation: 'ip route <network> <mask> <next-hop> is the syntax.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'easy', type: 'single',
    prompt: 'What is the default administrative distance of a static route?',
    choices: ['0', '1', '90', '110'], correct: [1],
    explanation: 'Static routes have AD 1; connected routes have 0.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'single',
    prompt: 'A ping request reaches the server but no reply returns. What is the most likely cause?',
    choices: ['A missing return route', 'A wrong VLAN', 'A duplex mismatch', 'DNS failure'], correct: [0],
    explanation: 'Replies need a route back to the source network.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'single',
    prompt: 'Which AD makes a static route a floating backup for OSPF?',
    choices: ['1', '90', '110', '130'], correct: [3],
    explanation: 'The AD must be higher than OSPF (110); 130 is a common choice.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'single',
    prompt: 'Which static route form is best on a multi-access Ethernet link?',
    choices: ['Exit interface only', 'Next hop or fully specified', 'No next hop', 'A default AD of 255'], correct: [1],
    explanation: 'On Ethernet, naming the next hop avoids ARP for every destination.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'hard', type: 'single',
    prompt: 'A floating static route does not appear in show ip route. What does this indicate?',
    choices: ['It is broken', 'A route with a lower AD to the same network is installed', 'The mask is wrong', 'The router must reload'], correct: [1],
    explanation: 'A floating static is installed only if the preferred route is withdrawn.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'single',
    prompt: 'Which command displays only static routes?',
    choices: ['show ip route static', 'show static', 'show ip static', 'show routes ip'], correct: [0],
    explanation: 'show ip route static filters the table to static routes.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are valid ways to specify where to send traffic in a static route?',
    choices: ['A next-hop IP address', 'A VLAN ID', 'An exit interface', 'A MAC address'], correct: [0, 2],
    explanation: 'Use a next-hop address, an exit interface, or both.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: if R1 can reach a network, R2 automatically knows the way back.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — static routes are one-way; each router needs its own routes.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: static route?', back: 'ip route + network + mask + hop (o interface). Laging return route. Floating = AD mas mataas (130). Static AD = 1.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'command', front: 'Static route syntax?', back: 'ip route <network> <mask> <next-hop | exit-interface> [AD]' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Why a return route?', back: 'Replies need a route back to the source network, or the ping fails one way.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Floating static route?', back: 'A static route with higher AD (such as 130) used only as a backup.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Which form on Ethernet?', back: 'Next hop or fully specified (interface + next hop); avoid exit interface only.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'command', front: 'Verify static routes?', back: 'show ip route static; ping and traceroute from both ends.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Two routers, static routes and a floating backup',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Connect two LANs with static routes, then add a backup path as a floating static route.',
  topology: 'LAN1 (192.168.1.0/24) — R1 — R2 — LAN2 (192.168.2.0/24); main link 172.16.0.0/30 and backup link 172.16.9.0/30.',
  steps: [
    'Address all interfaces and set PC default gateways.',
    'Confirm PC1 cannot reach LAN2 yet.',
    'Add the forward static route on R1 using the main link next hop.',
    'Ping from PC1; note the request arrives but no reply returns.',
    'Add the return static route on R2 and ping again.',
    'Add a floating static route (AD 130) on both routers via the backup link and test by shutting down the main link.',
  ],
  checklist: [
    'Observed one-way failure without a return route',
    'End-to-end ping works with both routes',
    'Floating route used only after the main link fails',
  ],
  hints: [
    'Use show ip route to see whether each route is installed.',
    'A floating route is hidden until the main route is gone.',
  ],
  solution: [
    'R1: ip route 192.168.2.0 255.255.255.0 172.16.0.2 and R2: ip route 192.168.1.0 255.255.255.0 172.16.0.1.',
    'Backup: same networks via the 172.16.9.x addresses with AD 130.',
  ],
  breakIt: 'Mistype the mask on the return route (255.255.0.0) and see which networks are affected.',
};
