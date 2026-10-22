import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ospf-fundamentals';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.9',
  domain: 'D3',
  title: 'OSPF Fundamentals: Router ID, Hello, LSDB, SPF and Cost',
  description: 'How OSPF routers discover neighbours, exchange link-state information, build the same database and calculate the shortest path using cost.',
  whyMatters:
    'Ang single-area OSPF ang pinakamalaking routing topic sa CCNA. Kailangan mong maintindihan ang mga bahagi bago ang configuration: router ID, hello, neighbour states, LSDB, SPF at cost. Kapag malinaw ito, madali mong malalaman kung bakit hindi nagiging neighbour ang dalawang router at kung paano pinipili ng OSPF ang daan.',
  objectives: [
    'Describe how OSPF routers become neighbours using hello packets',
    'Explain the router ID and how it is chosen',
    'Describe the link-state database, LSAs and the SPF algorithm at a high level',
    'Calculate OSPF cost from reference bandwidth and interface bandwidth',
    'Describe the OSPF neighbour states from Down to Full and the multicast addresses used',
  ],
  estimatedMinutes: 45,
  difficulty: 'intermediate',
  keywords: ['OSPF', 'router ID', 'hello', 'dead interval', 'LSDB', 'LSA', 'SPF', 'cost', 'reference bandwidth', 'area 0', 'neighbour', 'adjacency', '224.0.0.5', 'Dijkstra'],
  examObjectives: ['3.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'OSPF routers start by saying hello to the routers next to them. When two routers agree on a few basic settings, they become neighbours. Each router then describes its own links, and these descriptions are shared until every router in the area has the same map.',
        'With the map in hand, each router calculates the shortest path to every network using a cost number based on link speed, and installs the best routes in its routing table. If a link fails, the news is flooded and every router recalculates.',
      ],
      taglish: [
        'Nagsisimula ang **OSPF router sa pagbati ng "hello" sa katabing router**. Kapag **nagkasundo ang dalawa sa ilang batayang setting**, **nagiging neighbour** sila. **Inilalarawan ng bawat router ang sarili nitong mga link**, at **ibinabahagi ito hanggang pare-pareho ang mapa ng lahat ng router sa area**.',
        'Kapag **hawak na ang mapa**, **kinukuwenta ng bawat router ang pinakamaikling daan** papunta sa bawat network gamit ang **cost batay sa bilis ng link**, at **ini-install ang pinakamahusay na routes**. Kapag **may nasirang link**, **ipinapalaganap ang balita** at **nagkukuwenta muli ang lahat**.',
        'Mga mahalagang salita: **router ID** (pangalan ng router, parang IP), **hello** (pagbati), **LSA** (paglalarawan ng link), **LSDB** (database ng mapa), **SPF** (algorithm ng pinakamaikling daan), **cost** (metric).',
        'Ang **area 0** ay ang **backbone**. Sa CCNA, **single-area OSPF** ang pokus: **lahat ng router sa area 0**.',
      ],
      technical: [
        'OSPFv2 (RFC 2328) is a link-state IGP for IPv4 running directly over IP protocol 89. Routers send hello packets to the multicast 224.0.0.5 (AllSPFRouters) every 10 seconds on broadcast and point-to-point links (30 on NBMA) with a dead interval of four times the hello (40 seconds). To become neighbours, routers must agree on: area ID, hello and dead intervals, subnet (on broadcast networks), authentication, and the stub flags; the router IDs must be unique.',
        'Router ID: a 32-bit value written like an IPv4 address. It is chosen in order: (1) the manually configured router-id command; (2) the highest IPv4 address on an active loopback interface; (3) the highest IPv4 address on an active physical interface. Configure it explicitly for stability; changing it requires clearing the OSPF process.',
        'Neighbour states: Down, Init (a hello was heard but the router does not yet see itself in it), 2-Way (bidirectional communication; on multi-access networks DR/BDR election occurs here), ExStart (master/slave selection), Exchange (database descriptions exchanged), Loading (LSRs and LSUs request missing LSAs) and Full (databases synchronised, adjacency formed). Packet types: Hello, DBD, LSR, LSU, LSAck.',
        'Each router originates Link State Advertisements describing its links; LSAs are flooded within the area and stored in the link-state database. All routers in an area hold an identical LSDB. Each router then runs the SPF (Dijkstra) algorithm with itself as the root to build a shortest-path tree and installs the best routes (AD 110) in the routing table. Changes trigger partial recalculation.',
        'Cost = reference bandwidth / interface bandwidth, where the default reference bandwidth is 100 Mb/s, so FastEthernet is 1, Gigabit and faster are also 1 (the minimum cost is 1), and a 10 Mb/s link is 10. Set auto-cost reference-bandwidth (for example 10000 for 10 Gb/s) consistently on all routers, or set ip ospf cost on an interface. The path cost is the sum of the outgoing interface costs along the path.',
      ],
    },
    {
      type: 'analogy',
      title: 'Pagpupulong ng mga tagapag-guhit ng mapa',
      body: [
        'Each neighbour introduces themselves, then draws the roads around their own house on a card and passes it around. When everyone has all the cards they combine them into the same big map. Each person then finds the cheapest route from their house to everywhere, taking the road speeds into account.',
      ],
      taglish: [
        'Bawat kapitbahay ay **nagpapakilala**, saka **iginuguhit sa card ang mga kalsada sa paligid ng bahay nila** at **ipinapasa**. Kapag **hawak na ng lahat ang lahat ng card**, **pinagsasama nila ito sa iisang malaking mapa**. Saka **hinahanap ng bawat isa ang pinakamurang daan mula sa bahay nila** papunta sa lahat, **isinasaalang-alang ang bilis ng kalsada**.',
      ],
    },
    {
      type: 'hook',
      title: 'HELLO-LSA-SPF: Magkakilala, Magbahagi, Magkuwenta',
      trick: '**HLS**: **H**ello (neighbours) → **L**SDB/LSA (iisang mapa) → **S**PF (kuwenta). **Router ID**: manual → loopback → physical (pinakamataas). **Cost = 100M / bandwidth**.',
      taglish: [
        '**H**ello (**224.0.0.5**, kada **10s**, dead **40s**) → **L**SA/LSDB (pare-parehong mapa) → **S**PF (kuwenta ng pinakamaikling daan).',
        '**Router ID**: **manual** muna, kung wala **pinakamataas na loopback**, kung wala **pinakamataas na physical IP**.',
        '**Cost = reference bandwidth (100 Mb/s) ÷ bandwidth ng interface**. **FastEthernet = 1, 10 Mb/s = 10**.',
        '**Neighbour states**: **Down, Init, 2-Way, ExStart, Exchange, Loading, Full**.',
      ],
      test: {
        question: 'Ang router ay may loopback 1.1.1.1 at Gi0/0 10.0.0.1 at Gi0/1 192.168.1.1 at walang router-id command. Ano ang router ID nito, at ano ang cost ng 10 Mb/s link sa default?',
        answer: 'Router ID 1.1.1.1 (ang loopback ay inuuna kaysa physical kahit mas mababa ang numero). Cost ng 10 Mb/s link = 100 / 10 = 10.',
      },
    },
    { type: 'diagram', id: 'ospf-states', caption: 'Mula Hello hanggang Full: ang mga neighbour state ng OSPF.' },
    {
      type: 'terms',
      items: [
        { term: 'Router ID', definition: 'A 32-bit identifier for an OSPF router: manual, else highest loopback IP, else highest active interface IP.' },
        { term: 'Hello / dead interval', definition: 'Hello packets every 10 s; a neighbour is declared down after 40 s without one.' },
        { term: 'Neighbour / adjacency', definition: 'Routers that agree on parameters become neighbours; those that exchange databases reach Full adjacency.' },
        { term: 'LSA / LSDB', definition: 'Link-state advertisements describe links; the database holds all of them for the area.' },
        { term: 'SPF algorithm', definition: 'Dijkstra\'s algorithm that builds the shortest-path tree from the LSDB.' },
        { term: 'Cost', definition: 'OSPF metric: reference bandwidth divided by interface bandwidth (default 100 Mb/s reference).' },
        { term: 'Area 0 (backbone)', definition: 'The central OSPF area; every other area connects to it.' },
        { term: '224.0.0.5 / 224.0.0.6', definition: 'Multicast addresses for all OSPF routers and for DR/BDR.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: paano naging Full ang R1 at R2',
      steps: [
        'Parehong nagpapadala ng Hello sa 224.0.0.5 ang R1 at R2 sa kanilang konektadong link (state: Down → Init).',
        'Nakita ng R2 ang router ID ng R1 sa hello nito at ibinalik ang router ID ng R1 sa sarili nitong hello (2-Way).',
        'Nagkasundo sila kung sino ang master (ExStart) at ipinagpalitan ang mga database description (Exchange).',
        'Hiniling ang mga nawawalang LSA gamit ang LSR at ipinadala gamit ang LSU (Loading).',
        'Pareho na ang LSDB ng dalawa: Full ang adjacency.',
        'Pinatatakbo ng bawat isa ang SPF at ini-install ang mga ruta (O) sa routing table.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **loopback ay inuuna kaysa physical interface** sa router ID, **kahit mas mababa ang IP nito**. At ang **manual router-id ay laging panalo**. Madalas itong itinatanong na may maliit na kalkulasyon.' },
    { type: 'callout', kind: 'trap', text: 'Para maging neighbour: **dapat magkapareho ang area ID, hello/dead timers, at subnet**; at **magkaiba ang router ID**. Kapag **magkaiba ang hello/dead**, **hindi magiging neighbour** — pinakakaraniwang dahilan ng pagkabigo.' },
    { type: 'callout', kind: 'tip', text: '**Cost = 100 ÷ bandwidth (Mb/s)**. **Gigabit at mas mabilis ay cost 1** din dahil minimum ang 1 — kaya i-set ang **auto-cost reference-bandwidth** (halimbawa 10000) sa **lahat ng router** para makilala ang bilis.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagkalimot na loopback ang inuuna sa router ID.',
        'Magkaibang hello/dead interval o area ID sa dalawang router.',
        'Paggamit ng parehong router ID sa dalawang router.',
        'Pag-iisip na magkapareho ang cost ng 100 Mb/s at 1 Gb/s sa lahat ng kaso (default: parehong 1 sa Gig at Fast).',
        'Pagkalito sa 224.0.0.5 (lahat ng OSPF router) at 224.0.0.6 (DR/BDR).',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Pag-aralan: "Bakit hindi Full ang neighbour?"',
      scenario: 'Two routers on a link are stuck in the Init state and never reach Full.',
      evidence: `R1# show ip ospf interface gi0/0
  Hello 10, Dead 40, Wait 40, Retransmit 5
R2# show ip ospf interface gi0/0
  Hello 30, Dead 120, Wait 120, Retransmit 5
R1# show ip ospf neighbor
Neighbor ID     Pri   State      Dead Time   Address        Interface
2.2.2.2           1   INIT/DROTHER   00:00:35   10.0.0.2   GigabitEthernet0/0`,
      question: 'Bakit hindi magkasundo ang R1 at R2?',
      answer: 'Magkaiba ang hello/dead interval: 10/40 sa R1 at 30/120 sa R2. Hindi magiging neighbour ang mga router kapag hindi magkatugma ang timers.',
      fix: 'Itugma ang timers sa magkabilang dulo, halimbawa ip ospf hello-interval 10 at ip ospf dead-interval 40 sa R2 Gi0/0. Pagkatapos ay i-verify na umabot sa FULL ang show ip ospf neighbor.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang path ay may dalawang link: isang FastEthernet (100 Mb/s) at isang 10 Mb/s Ethernet, sa default na reference bandwidth. Ano ang kabuuang cost?',
      answer: 'FastEthernet cost = 100/100 = 1; 10 Mb/s cost = 100/10 = 10. Kabuuan = 11 (ang kabuuan ay sum ng cost ng mga palabas na interface sa daan).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Router ID order: manual router-id, highest loopback, highest active interface IP.',
        'Hello 10 s, dead 40 s on broadcast/point-to-point; multicast 224.0.0.5 (all OSPF), 224.0.0.6 (DR/BDR).',
        'Neighbour requirements: same area, timers, subnet; unique router IDs.',
        'Cost = reference bandwidth / bandwidth (default reference 100 Mb/s; minimum cost 1).',
        'LSDB is identical in an area; SPF builds the routes; OSPF AD is 110.',
      ],
    },
    {
      type: 'summary',
      points: [
        'OSPF routers become neighbours with hello packets, then exchange LSAs to build identical LSDBs.',
        'SPF calculates the best paths using cost; routes carry AD 110.',
        'Router ID order is manual, loopback, then highest interface IP.',
        'Timers, area ID and subnet must match to form an adjacency.',
        'Susunod: Single-area OSPF configuration at verification.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'easy', type: 'single',
    prompt: 'What is the default OSPF hello interval on a broadcast network?',
    choices: ['5 seconds', '10 seconds', '30 seconds', '40 seconds'], correct: [1],
    explanation: 'The default hello is 10 seconds, with a dead interval of 40 seconds.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'easy', type: 'single',
    prompt: 'Which multicast address do OSPF routers use for hellos?',
    choices: ['224.0.0.5', '224.0.0.9', '224.0.0.10', '239.0.0.1'], correct: [0],
    explanation: '224.0.0.5 is the AllSPFRouters address; 224.0.0.6 is for DR/BDR.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'A router has loopback 10.9.9.9 and interfaces 192.168.1.1 and 172.16.5.1 with no router-id configured. What is its router ID?',
    choices: ['192.168.1.1', '172.16.5.1', '10.9.9.9', '0.0.0.0'], correct: [2],
    explanation: 'A loopback address is preferred over physical interfaces.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'What is the OSPF cost of a 10 Mb/s link with the default reference bandwidth?',
    choices: ['1', '10', '100', '1000'], correct: [1],
    explanation: 'Cost = 100 Mb/s / 10 Mb/s = 10.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'Which parameter does NOT have to match for two OSPF routers to become neighbours?',
    choices: ['Area ID', 'Hello and dead intervals', 'Router ID', 'Subnet on the shared link'], correct: [2],
    explanation: 'Router IDs must be unique; the others must match.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'hard', type: 'single',
    prompt: 'Which OSPF neighbour state indicates the databases are fully synchronised?',
    choices: ['2-Way', 'Exchange', 'Loading', 'Full'], correct: [3],
    explanation: 'Full means the adjacency is established and the LSDBs are synchronised.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'Which algorithm does OSPF use to calculate best paths?',
    choices: ['Bellman-Ford', 'Dijkstra SPF', 'DUAL', 'Spanning tree'], correct: [1],
    explanation: 'OSPF runs Dijkstra\'s shortest path first algorithm on the LSDB.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO values must be identical on two OSPF neighbours?',
    choices: ['Hello interval', 'Router ID', 'Area ID', 'Interface description'], correct: [0, 2],
    explanation: 'Hello/dead intervals and area ID must match; router IDs must differ.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: all routers in the same OSPF area hold the same link-state database.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — an area shares an identical LSDB.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: OSPF?', back: 'HLS: Hello → LSDB → SPF. Router ID: manual, loopback, highest interface. Cost = 100M ÷ bandwidth. Hello 10s, dead 40s, 224.0.0.5. States: Down, Init, 2-Way, ExStart, Exchange, Loading, Full.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Router ID selection order?', back: '1) manual router-id; 2) highest active loopback IP; 3) highest active physical interface IP.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Requirements to form a neighbour?', back: 'Same area ID, hello/dead timers and subnet (and authentication); unique router IDs.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'concept', front: 'OSPF cost formula?', back: 'Reference bandwidth (default 100 Mb/s) ÷ interface bandwidth; minimum 1.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'concept', front: 'OSPF neighbour states in order?', back: 'Down, Init, 2-Way, ExStart, Exchange, Loading, Full.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'port', front: 'OSPF addressing facts?', back: 'IP protocol 89; hello to 224.0.0.5; DR/BDR use 224.0.0.6; AD 110.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Predict router IDs, costs and neighbour behaviour',
  tool: 'Paper',
  minutes: 25,
  objective: 'Apply the router ID rules and cost formula to several routers and decide which will form neighbours.',
  steps: [
    'Router A: loopback 1.1.1.1, Gi0/0 10.0.0.1. Router B: no loopback, Gi0/0 10.0.0.2, Gi0/1 192.168.5.1. Router C: manual router-id 9.9.9.9, loopback 1.1.1.1. Write each router ID.',
    'Compute the cost of links at 10 Mb/s, 100 Mb/s and 1 Gb/s with the default reference bandwidth.',
    'Compute the total cost of a path with a 100 Mb/s and two 1 Gb/s links.',
    'For two routers with hello 10/dead 40 and hello 30/dead 120, decide whether they become neighbours and why.',
    'List the neighbour states in order and say what happens at each.',
  ],
  checklist: [
    'Router IDs correct for A, B and C',
    'Costs computed correctly',
    'Neighbour decision explained',
    'States listed in order',
  ],
  hints: [
    'A manual router-id always wins; then loopbacks; then physical interfaces.',
    'The minimum OSPF cost is 1.',
  ],
  solution: [
    'A = 1.1.1.1, B = 192.168.5.1, C = 9.9.9.9.',
    'Costs: 10, 1, 1. Path total 1 + 1 + 1 = 3. The timers differ so they will not form neighbours.',
  ],
};
