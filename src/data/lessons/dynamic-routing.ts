import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'dynamic-routing';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.8',
  domain: 'D3',
  title: 'Dynamic Routing: Why Routers Learn Routes Automatically',
  description: 'How routing protocols share routes, how static and dynamic routing compare, and the differences between distance-vector and link-state protocols.',
  whyMatters:
    'Sa maliit na network, sapat ang static routes. Pero sa network na may dose-dosenang router, imposibleng mano-manong i-update ang bawat isa tuwing may nagbago. Ang dynamic routing ang sagot. Sa exam, tinatanong ang pagkakaiba ng distance-vector at link-state, at kung bakit mas mabilis mag-converge ang OSPF.',
  objectives: [
    'Compare static and dynamic routing and state when each is appropriate',
    'Explain the role of a routing protocol and the idea of convergence',
    'Distinguish interior (IGP) from exterior (EGP) protocols with examples',
    'Compare distance-vector and link-state behaviour and examples (RIP, EIGRP, OSPF)',
    'Name the metric each common protocol uses',
  ],
  estimatedMinutes: 35,
  difficulty: 'beginner',
  keywords: ['dynamic routing', 'routing protocol', 'convergence', 'IGP', 'EGP', 'distance vector', 'link state', 'RIP', 'EIGRP', 'OSPF', 'BGP', 'metric', 'hop count', 'cost'],
  examObjectives: ['3.1', '3.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'With static routing you type every route yourself. With dynamic routing, routers talk to each other with a routing protocol, share what they know and build their own tables. When a link fails, they notice and find another path without anyone typing anything.',
        'The price is some extra CPU and bandwidth and more to learn. The benefit is that big networks stay manageable and recover from failures on their own.',
      ],
      taglish: [
        'Sa **static routing**, **ikaw ang nagta-type ng bawat route**. Sa **dynamic routing**, **nag-uusap ang mga router gamit ang routing protocol**, **nagbabahagi ng alam nila** at **binubuo ang sarili nilang table**. Kapag **may nasirang link**, **napapansin nila ito** at **naghahanap ng ibang daan nang walang nagta-type**.',
        'Ang kapalit: **dagdag na CPU at bandwidth**, at **mas maraming dapat matutunan**. Ang pakinabang: **madaling i-manage ang malalaking network** at **kusang bumabawi sa pagkasira**.',
        'Ang **convergence** ay **ang oras bago magkasundo ang lahat ng router sa tamang daan** pagkatapos ng pagbabago. **Mas mabilis = mas mabuti**.',
        'Dalawang pamilya: **distance-vector** (**RIP, EIGRP**: nagbabahagi ng **route at distansya** sa mga kapitbahay) at **link-state** (**OSPF**: bawat router ay may **buong mapa ng topology** at kinukuwenta ang pinakamaikling daan).',
      ],
      technical: [
        'Static routes: no protocol overhead, predictable, secure (no advertisements), suited to small or stub networks and backup (floating) routes. Drawbacks: no automatic adaptation, configuration grows with network size and errors are likely. Dynamic routing: scalable, adapts to topology changes, but uses CPU, memory and bandwidth and requires careful configuration and security (authentication).',
        'Routing protocols are IGPs (interior gateway protocols) used inside one organisation or autonomous system: RIP, EIGRP, OSPF, IS-IS; or EGPs (exterior gateway protocols) used between autonomous systems: BGP. The CCNA focuses on OSPF with RIP and EIGRP for comparison.',
        'Distance-vector protocols (RIP, EIGRP as an advanced distance-vector or hybrid) advertise their routing tables (destination and metric) to directly connected neighbours, so a router knows only the direction and distance to each network ("routing by rumour"). RIP uses hop count (maximum 15; 16 is unreachable) and sends full updates every 30 seconds; EIGRP uses a composite metric (bandwidth and delay) and sends partial triggered updates with the DUAL algorithm.',
        'Link-state protocols (OSPF, IS-IS) flood link-state advertisements so every router builds an identical link-state database (a map of the topology) and runs Dijkstra\'s shortest path first (SPF) algorithm to compute its own routes. OSPF uses cost (derived from interface bandwidth). Link-state protocols converge faster and scale better with areas, at the cost of more memory and CPU.',
        'Convergence time depends on how quickly a failure is detected (hello and dead timers or interface state), how information propagates, and how fast routes are recomputed. Administrative distance decides between protocols (OSPF 110, RIP 120, EIGRP 90). Verification: show ip protocols, show ip route (codes O, D, R), show ip ospf neighbor.',
      ],
    },
    {
      type: 'analogy',
      title: 'Tsismis vs mapa',
      body: [
        'Distance-vector is neighbours passing along directions: "I heard from Juan that the market is 3 streets away". You only know what your neighbour tells you. Link-state is everyone sharing an actual street map, so each person can work out the shortest route themselves and quickly see when a road closes.',
      ],
      taglish: [
        'Ang **distance-vector** ay **mga kapitbahay na nagpapasa ng direksyon**: **"narinig ko kay Juan na 3 kalye ang layo ng palengke"**. **Ang alam mo lang ay ang sinabi ng kapitbahay mo**. Ang **link-state** ay **lahat nagbabahagi ng totoong mapa ng kalye**, kaya **bawat isa ay kayang kuwentahin ang pinakamaikling daan** at **mabilis makita kapag may saradong kalsada**.',
      ],
    },
    {
      type: 'hook',
      title: 'RED: RIP = hop, EIGRP = bandwidth+delay, OSPF = cost',
      trick: '**RIP** = **hop count** (max 15, AD 120). **EIGRP** = bandwidth + delay (AD 90). **OSPF** = **cost** (AD 110, link-state). **Link-state = buong mapa, mabilis mag-converge**.',
      taglish: [
        '**RIP**: **hop count**, hanggang **15**, **AD 120**, **distance-vector**.',
        '**EIGRP**: **bandwidth + delay**, **AD 90**, advanced distance-vector.',
        '**OSPF**: **cost** mula sa bandwidth, **AD 110**, **link-state**.',
        '**Link-state** = **buong mapa + SPF**, **mas mabilis mag-converge**. **Distance-vector** = **tsismis ng kapitbahay**.',
      ],
      test: {
        question: 'Aling protocol ang link-state at anong metric ang gamit nito? Ano ang maximum hop count ng RIP?',
        answer: 'OSPF ang link-state at cost ang metric nito. Ang RIP ay hanggang 15 hops; ang 16 ay unreachable.',
      },
    },
    { type: 'diagram', id: 'routing-protocol-types', caption: 'Static vs dynamic, IGP vs EGP, at distance-vector vs link-state.' },
    {
      type: 'terms',
      items: [
        { term: 'Routing protocol', definition: 'A set of rules routers use to share routes and build routing tables automatically.' },
        { term: 'Convergence', definition: 'The state in which all routers have consistent, correct routing information after a change.' },
        { term: 'IGP / EGP', definition: 'Interior gateway protocols run inside an autonomous system (OSPF, EIGRP, RIP); exterior protocols run between them (BGP).' },
        { term: 'Distance vector', definition: 'Routers share their routes and distance with neighbours only (RIP, EIGRP).' },
        { term: 'Link state', definition: 'Routers share link information so each builds a full topology map and runs SPF (OSPF).' },
        { term: 'Metric', definition: 'The value a protocol uses to rank routes: hops (RIP), bandwidth/delay (EIGRP), cost (OSPF).' },
        { term: 'Autonomous system', definition: 'A set of networks under one administration with a common routing policy.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: paano bumabawi ang network pagkatapos masira ang isang link',
      steps: [
        'Ang R1 ay may dalawang daan papunta sa LAN ng R3: sa pamamagitan ng R2 (cost 20) at ng R4 (cost 40). Ginagamit ang R2.',
        'Nasira ang link sa pagitan ng R1 at R2.',
        'Natutukoy ng R1 at R2 ang pagkawala (interface down o dead timer).',
        'Ipinapaalam nila sa iba ang pagbabago, at ina-update ang topology o routing tables.',
        'Kinukuwenta ng R1 ang bagong pinakamahusay na daan sa pamamagitan ng R4.',
        'Bumalik ang koneksyon nang walang nag-type ng command. Ang oras na ginugol ay ang convergence time.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **OSPF ay link-state**; ang **RIP ay distance-vector** na **hop count** lang ang metric. At ang **EIGRP ay hindi OSPF**: ibang protocol (Cisco-originated) na may **AD 90**. Madalas pinaghahalo ang tatlo.' },
    { type: 'callout', kind: 'trap', text: 'Ang **mas mababang AD ang mas pinagkakatiwalaan**: EIGRP 90 < OSPF 110 < RIP 120. Kapag **parehong protocol ang natuto ng route**, **mas mababang metric** ang panalo; kapag **magkaibang protocol**, **AD** ang panalo.' },
    { type: 'callout', kind: 'tip', text: 'Gamitin ang **static route** para sa **stub network, default route at backup**; **dynamic routing** para sa **maraming router at maraming daan**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagkalito sa distance-vector at link-state.',
        'Pagturing sa EIGRP o RIP bilang link-state.',
        'Paghahambing ng metric ng magkaibang protocol.',
        'Pag-asang walang overhead ang dynamic routing.',
        'Paggamit ng dynamic routing sa isang stub network na isang default route lang ang kailangan.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Pag-aralan: "Alin ang ginagamit kapag parehong may RIP at OSPF?"',
      scenario: 'A router learns the network 10.5.0.0/16 from both RIP and OSPF. Network staff expected the RIP route because it has fewer hops.',
      evidence: `R1# show ip route 10.5.0.0
Routing entry for 10.5.0.0/16
  Known via "ospf 1", distance 110, metric 30
R1# show ip route rip
R    10.5.0.0/16 [120/2] via 10.1.1.9   (not installed)`,
      question: 'Bakit OSPF ang ginagamit at hindi RIP?',
      answer: 'Magkaibang protocol, kaya AD ang pinaghahambing, hindi metric: OSPF AD 110 ay mas mababa kaysa RIP 120. Hindi maihahambing ang hop count (2) sa OSPF cost (30).',
      fix: 'Walang aayusin: normal ang gawi. Kung gusto talagang gamitin ang RIP, baguhin ang AD (distance command) o tanggalin ang OSPF para sa prefix na iyon; karaniwan ay iisang IGP lang ang pinapatakbo.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang kompanya ay may 3 router at 6 na network, at madalas nagbabago ang topology. Dapat bang static o dynamic ang piliin, at anong protocol ang mainam sa Cisco-only na kapaligiran at sa multi-vendor?',
      answer: 'Dynamic, dahil kusang aangkop ang routing sa pagbabago. OSPF ang pamantayang open protocol na gumagana sa multi-vendor; ang EIGRP ay maaaring piliin sa Cisco-only (bagama’t ang CCNA ay nakatuon sa OSPF).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Static: simple, no overhead, manual; dynamic: scalable, automatic, more overhead.',
        'IGP: OSPF, EIGRP, RIP; EGP: BGP.',
        'RIP = hop count (max 15, AD 120); EIGRP = bandwidth/delay (AD 90); OSPF = cost (AD 110).',
        'Link-state builds a full topology map and runs SPF; distance-vector shares routes with neighbours.',
        'Different protocols: AD decides; same protocol: metric decides.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Dynamic routing protocols share routes automatically and adapt to failures.',
        'Link-state protocols (OSPF) share the topology and converge fast; distance-vector protocols share routes by neighbour.',
        'Know each protocol\'s metric and AD.',
        'Use static routes for stubs, defaults and backups.',
        'Susunod: OSPF fundamentals — router ID, hello, LSDB, SPF at cost.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'easy', type: 'single',
    prompt: 'What is a key advantage of dynamic routing over static routing?',
    choices: ['It uses no CPU', 'It adapts automatically to topology changes', 'It needs no configuration', 'It is always more secure'], correct: [1],
    explanation: 'Routing protocols detect failures and recalculate routes without manual changes.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'easy', type: 'single',
    prompt: 'Which routing protocol is link-state?',
    choices: ['RIP', 'OSPF', 'EIGRP', 'Static'], correct: [1],
    explanation: 'OSPF is a link-state protocol; RIP and EIGRP are distance-vector types.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'medium', type: 'single',
    prompt: 'What metric does RIP use?',
    choices: ['Bandwidth', 'Hop count', 'Cost', 'Delay and load'], correct: [1],
    explanation: 'RIP uses hop count, with a maximum of 15; 16 means unreachable.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'medium', type: 'single',
    prompt: 'Which statement describes convergence?',
    choices: ['All routers share the same VLANs', 'All routers have consistent and correct routing information after a change', 'The speed of a link', 'A route being removed'], correct: [1],
    explanation: 'Convergence is the state where routers agree on the topology and routes.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'medium', type: 'single',
    prompt: 'A router learns the same prefix from RIP and OSPF. Which is installed?',
    choices: ['RIP, because of fewer hops', 'OSPF, because AD 110 is lower than RIP 120', 'Both', 'Neither'], correct: [1],
    explanation: 'Different protocols are compared by administrative distance; OSPF 110 beats RIP 120.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'hard', type: 'single',
    prompt: 'What do link-state routers build before calculating routes?',
    choices: ['A list of neighbours only', 'An identical link-state database of the topology', 'A MAC table', 'An ARP cache'], correct: [1],
    explanation: 'Each router builds the same link-state database and runs SPF on it.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'medium', type: 'single',
    prompt: 'Which is an exterior gateway protocol?',
    choices: ['OSPF', 'RIP', 'BGP', 'EIGRP'], correct: [2],
    explanation: 'BGP routes between autonomous systems; OSPF, RIP and EIGRP are IGPs.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are distance-vector protocols?',
    choices: ['RIP', 'OSPF', 'EIGRP', 'IS-IS'], correct: [0, 2],
    explanation: 'RIP and EIGRP are distance-vector (EIGRP an advanced one); OSPF and IS-IS are link-state.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D3', objective: '3.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a static route is more appropriate than a routing protocol for a stub network with one exit.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — a single default route is simple and sufficient for a stub.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: routing protocols?', back: 'RIP = hop count (max 15, AD 120). EIGRP = bandwidth+delay (AD 90). OSPF = cost (AD 110), link-state. Link-state = buong mapa + SPF, mabilis mag-converge.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Static vs dynamic routing?', back: 'Static: manual, no overhead, good for stubs/defaults/backup. Dynamic: automatic, scalable, adapts to change but uses resources.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Distance-vector vs link-state?', back: 'Distance-vector shares routes with neighbours (RIP, EIGRP). Link-state floods topology so each router builds a map and runs SPF (OSPF).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'concept', front: 'IGP vs EGP?', back: 'IGPs run inside an autonomous system (OSPF, EIGRP, RIP); EGP runs between them (BGP).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Metrics and ADs?', back: 'RIP hops/120, EIGRP bandwidth+delay/90, OSPF cost/110.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What is convergence?', back: 'All routers have consistent, correct routes after a topology change; faster is better.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Compare static and dynamic routing on paper',
  tool: 'Paper',
  minutes: 20,
  objective: 'Decide where static or dynamic routing fits and choose a protocol for several scenarios.',
  steps: [
    'Make a table with columns: scenario, static or dynamic, protocol, reason.',
    'Scenario 1: a branch with one link to HQ. Scenario 2: ten routers with redundant links. Scenario 3: a backup path for an existing OSPF route. Scenario 4: an ISP link to the internet. Scenario 5: a small Cisco-only network with fast convergence needs.',
    'Fill in your decisions and reasons.',
    'List the metric and AD for each protocol you chose.',
    'Check your answers with the solution.',
  ],
  checklist: [
    'Five scenarios decided with reasons',
    'Metric and AD listed for protocols chosen',
    'Explained why link-state converges faster',
  ],
  hints: [
    'A single exit usually means a default route.',
    'Many routers and multiple paths call for a dynamic protocol.',
  ],
  solution: [
    '1 static default; 2 dynamic (OSPF); 3 floating static (AD 130); 4 static default or BGP for multihoming; 5 OSPF or EIGRP.',
    'OSPF cost/110; EIGRP bandwidth+delay/90; RIP hops/120.',
  ],
};
