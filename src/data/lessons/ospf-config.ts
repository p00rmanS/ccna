import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ospf-config';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.10',
  domain: 'D3',
  title: 'Single-Area OSPF Configuration and Verification',
  description: 'How to enable OSPFv2 with network statements or interface commands, set the router ID, make interfaces passive, and verify neighbours and routes.',
  whyMatters:
    'Ito ang bahaging lagi mong gagawin sa exam at sa lab: i-configure ang OSPF sa ilang router at tiyaking gumagana. Kailangan mong alam ang network statement at wildcard mask, ang passive-interface, at ang mga verification command. At mahalaga ang troubleshooting: bakit walang neighbour, o bakit walang route.',
  objectives: [
    'Configure OSPF with router ospf, router-id and network ... area 0 statements using wildcard masks',
    'Enable OSPF directly on an interface with ip ospf <process> area <id>',
    'Configure passive-interface on LAN-facing interfaces',
    'Verify with show ip ospf neighbor, show ip route ospf, show ip protocols and show ip ospf interface brief',
    'Troubleshoot common failures: mismatched timers, wrong network statement, passive on the wrong interface',
  ],
  estimatedMinutes: 45,
  difficulty: 'intermediate',
  keywords: ['router ospf', 'network area', 'wildcard mask', 'router-id', 'passive-interface', 'ip ospf area', 'show ip ospf neighbor', 'show ip protocols', 'default-information originate', 'auto-cost reference-bandwidth', 'clear ip ospf process'],
  examObjectives: ['3.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'To run OSPF you start a process with router ospf, give the router an ID, and tell it which interfaces take part. The classic way is a network statement: any interface whose address falls inside that network is switched on for OSPF in the given area. You use a wildcard mask, like in ACLs.',
        'LAN interfaces that have only PCs should be made passive: the router still advertises that network but does not send hellos there, which saves resources and stops anyone from forming a rogue neighbour.',
      ],
      taglish: [
        'Para patakbuhin ang OSPF, **magsisimula ka ng process** gamit ang **router ospf**, **bibigyan ng ID ang router**, at **sasabihin kung aling interface ang sasali**. Ang klasikong paraan ay **network statement**: **anumang interface na ang address ay nasa loob ng network na iyon ay bubuksan para sa OSPF** sa ibinigay na area. **Wildcard mask** ang gamit, tulad sa ACL.',
        'Ang mga **LAN interface na may PC lang** ay dapat gawing **passive**: **ina-advertise pa rin ng router ang network** pero **hindi nagpapadala ng hello doon**, kaya **nakakatipid at napipigilang makabuo ng rogue neighbour**.',
        'Ang **process ID** ay **lokal lang** (hindi kailangang magtugma sa ibang router). Ang **area ID ay dapat magtugma** (area 0).',
        'Pagkatapos: **show ip ospf neighbor** (tingnan ang FULL), **show ip route ospf** (mga O routes), at **show ip protocols**.',
      ],
      technical: [
        'Configuration: router ospf <process-id> (locally significant, 1–65535), router-id <a.b.c.d> (preferably set explicitly), network <address> <wildcard> area <id>, passive-interface <if> (or passive-interface default then no passive-interface <uplink>), auto-cost reference-bandwidth <Mb/s> (same value on all routers), default-information originate (advertise a default route).',
        'The network command does not advertise the network directly: it enables OSPF on every interface whose primary IP address matches the address/wildcard; the interface\'s connected network (with its actual mask) is then advertised. The simplest approach is to use the interface address with wildcard 0.0.0.0: network 10.1.1.1 0.0.0.0 area 0. Interface-level alternative: ip ospf <process> area <area> under the interface.',
        'Passive interfaces: the network on a passive interface is still advertised in the LSDB, but no hello packets are sent or accepted, so no adjacency forms. Make all user-facing interfaces passive; never make a link to a neighbour router passive or the adjacency will drop.',
        'Verification: show ip ospf neighbor (neighbour ID, priority, state FULL/DR, dead time, address, interface), show ip route ospf (O routes with [110/cost]), show ip protocols (OSPF process, router ID, networks, passive interfaces, AD), show ip ospf interface brief (process, area, cost, state, neighbours), show ip ospf database (the LSDB), and clear ip ospf process after changing the router ID.',
        'Common failures: network statement with the wrong wildcard so the interface is not enabled; mismatched hello/dead timers or area ID; duplicate router IDs; passive-interface on the neighbour-facing link; mismatched subnet mask on the link; an ACL blocking protocol 89; a missing network for a LAN so it is not advertised.',
      ],
    },
    {
      type: 'analogy',
      title: 'Pagpaparehistro ng kalye sa mapa',
      body: [
        'The network statement is like telling the mapmaker "every street whose address starts with 10.1.1 belongs to Area 0". The streets with only houses (LANs) are put on the map but marked "no traffic from other mappers here" (passive), so no unexpected mapmakers join in.',
      ],
      taglish: [
        'Ang **network statement** ay parang sinasabi sa tagagawa ng mapa: **"bawat kalyeng nagsisimula sa 10.1.1 ay kabilang sa Area 0"**. Ang mga **kalyeng bahay lang ang laman (LAN)** ay **inilalagay sa mapa** pero **may tatak na "bawal ang ibang tagagawa ng mapa dito" (passive)**, kaya **walang hindi inaasahang sumasali**.',
      ],
    },
    {
      type: 'hook',
      title: 'RNP: Router-id, Network, Passive',
      trick: '**RNP**: **R**outer ospf + router-id → **N**etwork <ip> <wildcard> area 0 → **P**assive-interface sa LAN. Verify: **neighbor FULL**, **O routes**.',
      taglish: [
        '**R**: **router ospf 1** at **router-id 1.1.1.1**.',
        '**N**: **network <address> <wildcard> area 0** (wildcard = baliktad ng mask: /24 → 0.0.0.255).',
        '**P**: **passive-interface** sa LAN na walang router.',
        'Verify: **show ip ospf neighbor** (FULL), **show ip route ospf**, **show ip protocols**.',
      ],
      test: {
        question: 'Anong network statement ang magbubukas ng OSPF sa interface na 192.168.10.1/24 sa area 0, at paano mo gagawing passive ang Gi0/0 (LAN)?',
        answer: 'network 192.168.10.0 0.0.0.255 area 0 (o network 192.168.10.1 0.0.0.0 area 0), at passive-interface gi0/0 sa ilalim ng router ospf 1.',
      },
    },
    { type: 'diagram', id: 'ospf-topology', caption: 'Tatlong router sa area 0; LAN interfaces ay passive.' },
    {
      type: 'terms',
      items: [
        { term: 'router ospf <id>', definition: 'Starts an OSPF process; the process ID is locally significant.' },
        { term: 'network ... area', definition: 'Enables OSPF on interfaces matching the address and wildcard, in the given area.' },
        { term: 'Wildcard mask', definition: 'Inverse of the subnet mask: 0 = must match, 1 = ignore (/24 is 0.0.0.255).' },
        { term: 'passive-interface', definition: 'Stops hellos on an interface while its network is still advertised.' },
        { term: 'router-id', definition: 'Command that sets the OSPF router ID explicitly.' },
        { term: 'show ip ospf neighbor', definition: 'Lists neighbours with their state; FULL means the adjacency is established.' },
        { term: 'auto-cost reference-bandwidth', definition: 'Sets the reference bandwidth used to compute cost; must match on all routers.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: pag-configure ng R1',
      steps: [
        'Itakda ang router ID: router ospf 1 → router-id 1.1.1.1.',
        'I-enable ang OSPF sa link papunta sa R2 (10.0.12.0/30): network 10.0.12.0 0.0.0.3 area 0.',
        'I-enable ang OSPF sa LAN (192.168.1.0/24): network 192.168.1.0 0.0.0.255 area 0.',
        'Gawing passive ang LAN: passive-interface gi0/0.',
        'Hintaying mag-form ang adjacency kay R2: show ip ospf neighbor → FULL.',
        'Tingnan ang mga natutunang routes: show ip route ospf at subukan ang ping papunta sa LAN ng R2.',
      ],
    },
    {
      type: 'cli',
      title: 'Single-area OSPF at verification',
      transcript: `R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 10.0.12.0 0.0.0.3 area 0
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# passive-interface gi0/0
R1(config-router)# auto-cost reference-bandwidth 1000
R1(config-router)# end
R1# show ip ospf neighbor
Neighbor ID     Pri   State           Dead Time   Address       Interface
2.2.2.2           1   FULL/DR         00:00:36    10.0.12.2     GigabitEthernet0/1
R1# show ip route ospf
O     192.168.2.0/24 [110/11] via 10.0.12.2, 00:02:11, GigabitEthernet0/1
R1# show ip protocols
Routing Protocol is "ospf 1"
  Router ID 1.1.1.1
  Passive Interface(s): GigabitEthernet0/0
  Routing for Networks: 10.0.12.0 0.0.0.3 area 0  192.168.1.0 0.0.0.255 area 0`,
      copyable: 'network 192.168.1.0 0.0.0.255 area 0',
      explain: [
        { line: 'router ospf 1 / router-id 1.1.1.1', why: 'Starts process 1 (local number) and fixes the router ID so it does not change unexpectedly.' },
        { line: 'network 10.0.12.0 0.0.0.3 area 0', why: 'Turns OSPF on for any interface in 10.0.12.0/30 (wildcard 0.0.0.3 for a /30).' },
        { line: 'passive-interface gi0/0', why: 'The LAN interface is still advertised but sends no hellos, so no rogue neighbour can form.' },
        { line: 'auto-cost reference-bandwidth 1000', why: 'Makes costs reflect Gigabit speeds; set the same value on every router.' },
        { line: 'FULL/DR', why: 'The adjacency is fully established; DR indicates the neighbour is the designated router on that segment.' },
        { line: 'O 192.168.2.0/24 [110/11]', why: 'A route learned via OSPF: AD 110, total cost 11, next hop 10.0.12.2.' },
      ],
      note: 'Sample output for study.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show ip ospf neighbor', shows: 'Each neighbour with its state; FULL (or 2WAY on a multi-access network) is healthy.' },
        { command: 'show ip route ospf', shows: 'Routes learned by OSPF with [110/cost], next hop and interface.' },
        { command: 'show ip protocols', shows: 'The OSPF process, router ID, advertised networks, passive interfaces and AD.' },
        { command: 'show ip ospf interface brief', shows: 'Which interfaces run OSPF, their area, cost, state and neighbour count.' },
      ],
      good: 'Neighbours are FULL and remote networks appear as O routes.',
      bad: 'No neighbours (timers/area/passive), neighbour stuck in INIT or EXSTART, or missing O routes (network statement missing).',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **network command ay gumagamit ng WILDCARD mask**, hindi subnet mask: **/24 = 0.0.0.255**, **/30 = 0.0.0.3**. Kapag **maling wildcard**, **hindi mabubuksan ang OSPF** sa interface.' },
    { type: 'callout', kind: 'trap', text: 'Huwag gawing **passive ang interface papunta sa kapitbahay na router** — **mawawala ang neighbour**. **LAN na walang router lang** ang gagawing passive. At ang **process ID ay lokal lang** — hindi kailangang magtugma.' },
    { type: 'callout', kind: 'tip', text: 'Pagkatapos baguhin ang **router ID**, kailangang **clear ip ospf process** (o mag-reload) para **magamit ang bago**. At ang **auto-cost reference-bandwidth** ay dapat **pareho sa lahat ng router**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Paggamit ng subnet mask sa halip na wildcard sa network statement.',
        'Paggawang passive sa interface papunta sa ibang router.',
        'Paglimot sa area (area 0) sa network statement.',
        'Pag-iisip na kailangang magkapareho ang process ID ng magkakapitbahay.',
        'Pagkalimot na i-clear ang process pagkatapos magpalit ng router ID.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Walang OSPF neighbour at walang O routes"',
      scenario: 'R1 and R2 are connected on 10.0.12.0/30 but show ip ospf neighbor is empty on both.',
      evidence: `R1# show ip protocols
Routing Protocol is "ospf 1"
  Router ID 1.1.1.1
  Routing for Networks:
    10.0.12.0 0.0.0.255 area 0
  Passive Interface(s): GigabitEthernet0/1
R1# show ip ospf interface brief
Interface  PID  Area  IP Address/Mask  Cost  State  Nbrs F/C
Gi0/1      1    0     10.0.12.1/30     1     DR     0/0`,
      question: 'Ano ang nagbabawal na mag-form ang neighbour?',
      answer: 'Passive ang Gi0/1, ang interface papunta sa R2. Walang hello na ipinapadala kaya walang neighbour (Nbrs 0/0).',
      fix: 'Alisin ang passive sa neighbour-facing interface: router ospf 1 → no passive-interface gi0/1. Ang wildcard 0.0.0.255 sa network statement ay gumagana pa rin ngunit mas mainam ang 0.0.0.3. I-verify na lumitaw ang FULL.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang OSPF configuration para sa router na may Gi0/0 = 172.16.10.1/24 (LAN) at Gi0/1 = 10.0.0.1/30 (papunta sa neighbour), router ID 3.3.3.3, lahat sa area 0, at LAN na passive.',
      answer: 'router ospf 1 → router-id 3.3.3.3 → network 172.16.10.0 0.0.0.255 area 0 → network 10.0.0.0 0.0.0.3 area 0 → passive-interface gi0/0.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'router ospf <id>, router-id, network <address> <wildcard> area 0.',
        'Wildcard is the inverse of the mask: /24 = 0.0.0.255, /30 = 0.0.0.3.',
        'passive-interface stops hellos but still advertises the network; do not use it on neighbour links.',
        'Verify with show ip ospf neighbor, show ip route ospf, show ip protocols.',
        'Process ID is locally significant; area and timers must match.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Start OSPF with router ospf, set router-id and add network statements with wildcards.',
        'Make LAN-facing interfaces passive.',
        'Verify FULL neighbours and O routes.',
        'Troubleshoot timers, area, wildcards and passive interfaces first.',
        'Susunod sa roadmap: OSPF neighbour relationships at DR/BDR.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'easy', type: 'single',
    prompt: 'Which command starts an OSPF process?',
    choices: ['router ospf 1', 'ospf enable', 'ip ospf 1', 'network ospf'], correct: [0],
    explanation: 'router ospf <process-id> enters router configuration mode for OSPF.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'Which network statement enables OSPF on an interface with 192.168.10.1/24 in area 0?',
    choices: ['network 192.168.10.0 255.255.255.0 area 0', 'network 192.168.10.0 0.0.0.255 area 0', 'network 192.168.10.0 area 0', 'network 192.168.10.1/24 area 0'], correct: [1],
    explanation: 'The network command uses a wildcard mask: 0.0.0.255 for a /24.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'What does passive-interface do in OSPF?',
    choices: ['Shuts the interface', 'Stops sending hellos while still advertising the network', 'Removes the network from OSPF', 'Changes the cost'], correct: [1],
    explanation: 'The network is still advertised, but no hellos are sent so no adjacency forms.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'Which command shows OSPF neighbours and their states?',
    choices: ['show ip ospf neighbor', 'show ospf peers', 'show ip route ospf', 'show ip ospf rib'], correct: [0],
    explanation: 'show ip ospf neighbor lists neighbours and states such as FULL.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'hard', type: 'single',
    prompt: 'Two routers are directly connected but will not form an adjacency. One has the neighbour-facing interface configured as passive. What is the fix?',
    choices: ['Change the process ID', 'Remove passive-interface from that interface', 'Add a static route', 'Change the AD'], correct: [1],
    explanation: 'A passive interface sends no hellos, so no neighbour can form.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'Which statement about the OSPF process ID is true?',
    choices: ['It must match on neighbouring routers', 'It is locally significant', 'It must be 0', 'It equals the area number'], correct: [1],
    explanation: 'The process ID is local to the router; it need not match neighbours.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'What is the wildcard mask for a /30 network?',
    choices: ['0.0.0.1', '0.0.0.3', '0.0.0.7', '0.0.0.255'], correct: [1],
    explanation: '255.255.255.252 inverted is 0.0.0.3.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO commands help verify OSPF operation?',
    choices: ['show ip ospf neighbor', 'show ip route ospf', 'show vlan brief', 'show cdp'], correct: [0, 1],
    explanation: 'Neighbours and the O routes show whether OSPF is working.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: after changing the router ID, the process must be cleared (or the router reloaded) for it to take effect.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — clear ip ospf process applies the new router ID.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'command', front: 'Pro tip: OSPF config?', back: 'RNP: Router-id → Network <ip> <wildcard> area 0 → Passive-interface sa LAN. Verify: neighbor FULL, O routes.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'command', front: 'Basic OSPF config?', back: 'router ospf 1 → router-id 1.1.1.1 → network <address> <wildcard> area 0 → passive-interface <LAN>' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Wildcard for /24 and /30?', back: '/24 = 0.0.0.255; /30 = 0.0.0.3 (inverse of the mask).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'command', front: 'Verify OSPF?', back: 'show ip ospf neighbor, show ip route ospf, show ip protocols, show ip ospf interface brief' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What does passive-interface do?', back: 'Stops hellos on the interface but still advertises its network; do not use on neighbour links.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'command', front: 'Advertise a default route and fix cost scale?', back: 'default-information originate; auto-cost reference-bandwidth <Mb/s> (same on all routers).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Three routers, single-area OSPF',
  tool: 'Packet Tracer',
  minutes: 40,
  objective: 'Configure OSPF in area 0 on three routers, verify neighbours and routes, and break and fix an adjacency.',
  topology: 'R1 — R2 — R3 in a line; LANs 192.168.1.0/24 (R1), 192.168.2.0/24 (R2), 192.168.3.0/24 (R3); links 10.0.12.0/30 and 10.0.23.0/30.',
  steps: [
    'Address all interfaces and bring them up.',
    'On each router: router ospf 1, router-id x.x.x.x, add network statements for the LAN and link networks.',
    'Make each LAN interface passive.',
    'Run show ip ospf neighbor on R2 and confirm two FULL neighbours.',
    'Run show ip route ospf on R1 and confirm routes to the other LANs; ping end to end.',
    'Break it: make the R1–R2 interface passive on R1 and watch the neighbour drop, then restore.',
  ],
  checklist: [
    'Neighbours FULL on all links',
    'Each router has O routes to the other LANs',
    'End-to-end ping works',
    'Observed and fixed a passive-interface failure',
  ],
  hints: [
    'Use wildcard masks: 0.0.0.255 for /24 and 0.0.0.3 for /30.',
    'Check show ip protocols if routes are missing.',
  ],
  solution: [
    'Each router advertises its LAN and link networks in area 0, with LANs passive.',
    'R2 shows two FULL neighbours; R1 and R3 each show one.',
  ],
  breakIt: 'Change the hello interval on R2 only and watch the neighbour drop after the dead interval.',
};
