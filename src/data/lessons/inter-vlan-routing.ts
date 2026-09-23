import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'inter-vlan-routing';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.5',
  domain: 'D2',
  title: 'Inter-VLAN Routing',
  description: 'How devices in different VLANs communicate: router-on-a-stick with subinterfaces, and a Layer 3 switch with SVIs.',
  whyMatters:
    'Ang VLAN ay naghihiwalay; ang routing ang nagdudugtong ulit — kontrolado. Halos bawat network ay may inter-VLAN routing, at paborito ng exam ang router-on-a-stick config at ang mga karaniwang mali dito.',
  objectives: [
    'Explain why hosts in different VLANs need a Layer 3 device',
    'Configure router-on-a-stick with dot1Q subinterfaces',
    'Explain why the switch port must be a trunk and the physical interface must be up',
    'Compare router-on-a-stick with a Layer 3 switch using SVIs',
    'Configure a basic SVI and enable ip routing',
    'Verify with show ip route and show ip interface brief and set the correct default gateway',
  ],
  estimatedMinutes: 45,
  difficulty: 'intermediate',
  keywords: ['inter-VLAN routing', 'router-on-a-stick', 'subinterface', 'encapsulation dot1q', 'SVI', 'ip routing', 'Layer 3 switch', 'default gateway'],
  examObjectives: ['2.1', '2.2'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Different VLANs are different networks. A host cannot send traffic straight to another VLAN. It sends the packet to its default gateway, and a router or Layer 3 switch routes it into the other VLAN.',
        'Two common designs: router-on-a-stick (one router, one trunk, one subinterface per VLAN) and a Layer 3 switch with a switch virtual interface (SVI) per VLAN.',
      ],
      taglish: [
        'Ang bawat VLAN ay **hiwalay na network (subnet)**. Kaya ang PC sa VLAN 10 ay **hindi direktang makakapagpadala** sa PC sa VLAN 20. Ipapadala niya ang packet sa **default gateway** niya, at ang **router (o Layer 3 switch)** ang maglilipat nito sa ibang VLAN.',
        '**Router-on-a-stick (ROAS):** **isang** cable (trunk) mula sa switch papunta sa router. Hinahati ang **isang physical interface** sa **maraming subinterface** — isa bawat VLAN, gaya ng `Gi0/0.10` at `Gi0/0.20`. Bawat subinterface ang **gateway ng VLAN niya** (`192.168.10.1`, `192.168.20.1`).',
        '**Layer 3 switch + SVI:** ang switch mismo ang nagra-route. Gagawa ka ng **SVI** (`interface vlan 10`) na may IP address, at bubuksan ang `ip routing`. Mas mabilis, dahil hardware ang nagra-route at walang single-cable na bottleneck.',
        'Sa ROAS, ang **PC ay may default gateway na IP ng subinterface ng sarili niyang VLAN**. Ang **unang** command sa subinterface ay `encapsulation dot1q <vlan>`; **saka** pa lang ang `ip address`.',
      ],
      technical: [
        'Router-on-a-stick uses one physical router interface connected to a switch trunk. Each VLAN gets a logical subinterface (for example GigabitEthernet0/0.10) configured with encapsulation dot1Q VLAN-ID and an IP address that serves as the default gateway for that VLAN. The router receives a tagged frame on one subinterface, routes the packet, and sends it back out the same physical link with the destination VLAN’s tag. The physical interface needs no IP address but must not be shut down; if it is down, every subinterface is down.',
        'IOS refuses an IP address on a subinterface until the encapsulation is set. The subinterface number is only a label; matching it to the VLAN ID is a convention. For untagged traffic use encapsulation dot1Q VLAN-ID native, or leave the native VLAN on the physical interface. The single link is a bandwidth and single-point-of-failure limit shared by all VLANs.',
        'A Layer 3 switch routes in hardware. Enable it with ip routing, create an SVI per VLAN with interface vlan N, assign an IP and no shutdown. An SVI is up/up only when the VLAN exists and at least one port in that VLAN is up (access port or trunk carrying it). Routed ports (no switchport) are an alternative for point-to-point links.',
        'Verify with show ip route (connected C and local L routes appear for each up subinterface or SVI), show ip interface brief, and by pinging from hosts using the correct default gateway.',
      ],
    },
    {
      type: 'analogy',
      title: 'Isang pinto, maraming karatula',
      body: [
        'Router-on-a-stick is one physical door with several numbered signs. Every VLAN uses the same door, but each has its own sign (subinterface) and its own gatekeeper address (gateway). A visitor from VLAN 10 walks in, gets redirected, and walks out with a VLAN 20 badge.',
      ],
      taglish: [
        'Ang **router-on-a-stick** ay **isang pinto** na may **maraming karatula (subinterface)**. Iisang pinto ang gamit ng lahat ng VLAN, pero bawat isa may sariling **karatula at gateway**. Ang bisita mula sa VLAN 10 ay papasok, ililipat, at lalabas na may **badge ng VLAN 20**.',
      ],
    },
    {
      type: 'hook',
      title: 'Isang cable, maraming subinterface',
      trick: '**Trunk sa switch. TAG muna, IP pagkatapos. Ang GATEWAY ay ang .1 ng sarili mong VLAN.**',
      taglish: [
        '**ROAS = isang cable (trunk), isang subinterface bawat VLAN.** Sa switch: **trunk**. Sa router: **`no shutdown` sa physical**, walang IP doon.',
        'Sa bawat subinterface: **T-I-P** = **T**ag muna (`encapsulation dot1q 10`), **I**P pangalawa, **P**ing para subukan. Kapag baligtad (IP muna), tatanggihan ka ng IOS.',
        '**Gateway ng PC = IP ng subinterface ng sarili niyang VLAN.** VLAN 10 → `192.168.10.1`. VLAN 20 → `192.168.20.1`.',
        'Layer 3 switch: **SVI** = **S**witch **V**irtual **I**nterface = “virtual na router port ng VLAN”. Huwag kalimutan ang **`ip routing`**.',
      ],
      test: {
        question: 'Nag-type ka ng `ip address 192.168.10.1 255.255.255.0` sa `Gi0/0.10` at may error. Ano ang kulang? At ano ang gateway ng PC sa VLAN 10?',
        answer: 'Kulang ang `encapsulation dot1q 10` — TAG muna bago IP. Ang gateway ng PC ay 192.168.10.1, ang IP ng subinterface ng VLAN 10.',
      },
    },
    { type: 'diagram', id: 'router-on-a-stick', caption: 'Router-on-a-stick: isang trunk, isang subinterface bawat VLAN, at bawat subinterface ay gateway ng VLAN niya.' },
    {
      type: 'terms',
      items: [
        { term: 'Inter-VLAN routing', definition: 'Routing packets between VLANs (different subnets) with a Layer 3 device.' },
        { term: 'Router-on-a-stick', definition: 'One router link to a switch trunk, with one subinterface per VLAN.' },
        { term: 'Subinterface', definition: 'A logical interface on a physical interface, such as Gi0/0.10.' },
        { term: 'encapsulation dot1Q', definition: 'Tells a subinterface which 802.1Q VLAN ID it serves.' },
        { term: 'Default gateway', definition: 'The router address a host uses to reach other networks.' },
        { term: 'SVI', definition: 'Switch Virtual Interface (interface vlan N): the Layer 3 interface of a VLAN on a switch.' },
        { term: 'Layer 3 switch', definition: 'A switch that can also route between VLANs in hardware.' },
        { term: 'Routed port', definition: 'A switch port configured with no switchport so it acts like a router interface.' },
        { term: 'Connected route (C)', definition: 'A route to the network directly attached to an up interface.' },
        { term: 'Local route (L)', definition: 'A /32 route for the interface’s own address.' },
      ],
    },
    {
      type: 'flow',
      title: 'PC-A (VLAN 10) → PC-B (VLAN 20) gamit ang ROAS',
      steps: [
        'Nakita ng **PC-A** na **iba ang subnet** ng PC-B, kaya ipapadala niya ang frame sa **default gateway 192.168.10.1** (ARP muna para sa MAC nito).',
        'Nakarating ang frame sa **SW1** sa access port ng VLAN 10. Idinagdag ng SW1 ang **tag 10** at ipinasa sa **trunk** papunta sa router.',
        'Natanggap ito ng router sa **Gi0/0.10**, tinanggal ang tag, at **tiningnan ang routing table**: ang 192.168.20.0/24 ay connected sa Gi0/0.20.',
        'Ipinadala ng router ang packet palabas ng **Gi0/0.20** na may bagong frame at **tag 20** — sa **parehong physical cable** pabalik sa switch.',
        'Natanggap ito ng SW1, tinanggal ang tag 20 at inihatid sa **PC-B** sa access port ng VLAN 20.',
      ],
    },
    {
      type: 'cli',
      title: 'Router-on-a-stick at Layer 3 switch (SVI)',
      transcript: `R1(config)# interface gigabitEthernet 0/0
R1(config-if)# no shutdown
R1(config-if)# interface gigabitEthernet 0/0.10
R1(config-subif)# encapsulation dot1q 10
R1(config-subif)# ip address 192.168.10.1 255.255.255.0
R1(config-subif)# interface gigabitEthernet 0/0.20
R1(config-subif)# encapsulation dot1q 20
R1(config-subif)# ip address 192.168.20.1 255.255.255.0
R1(config-subif)# end
R1# show ip route
Gateway of last resort is not set

      192.168.10.0/24 is variably subnetted, 2 subnets, 2 masks
C        192.168.10.0/24 is directly connected, GigabitEthernet0/0.10
L        192.168.10.1/32 is directly connected, GigabitEthernet0/0.10
      192.168.20.0/24 is variably subnetted, 2 subnets, 2 masks
C        192.168.20.0/24 is directly connected, GigabitEthernet0/0.20
L        192.168.20.1/32 is directly connected, GigabitEthernet0/0.20

! --- The same idea on a Layer 3 switch ---
SW1(config)# ip routing
SW1(config)# interface vlan 10
SW1(config-if)# ip address 192.168.10.1 255.255.255.0
SW1(config-if)# no shutdown
SW1(config-if)# interface vlan 20
SW1(config-if)# ip address 192.168.20.1 255.255.255.0
SW1(config-if)# no shutdown`,
      copyable: 'show ip route',
      explain: [
        { line: 'interface g0/0 → no shutdown', why: 'The physical interface must be up or every subinterface stays down. It has no IP address in this design.' },
        { line: 'interface g0/0.10', why: 'Creates a subinterface. The prompt becomes (config-subif)#.' },
        { line: 'encapsulation dot1q 10', why: 'Says this subinterface handles tagged frames from VLAN 10. Must come before ip address.' },
        { line: 'ip address 192.168.10.1 255.255.255.0', why: 'The default gateway for every host in VLAN 10.' },
        { line: 'C … GigabitEthernet0/0.10', why: 'A connected route: the router knows the VLAN 10 subnet directly. L is the router’s own address.' },
        { line: 'ip routing (Layer 3 switch)', why: 'Turns on Layer 3 forwarding. Without it, SVIs exist but the switch does not route between them.' },
        { line: 'interface vlan 10', why: 'Creates the SVI for VLAN 10. It comes up only when the VLAN exists and has an active port.' },
      ],
      note: 'In CLI practice → “Router-on-a-stick” you can try the router side. The simulator does not model Layer 3 switches, so the SVI part is shown here for study only.',
    },
    { type: 'callout', kind: 'trap', text: '**TAG muna, IP pagkatapos.** Kung mag-`ip address` ka sa subinterface bago ang `encapsulation dot1q`, tatanggihan ito ng IOS. Ito ang pinakamadalas na mali sa lab.' },
    { type: 'callout', kind: 'trap', text: 'Ang **switch port papunta sa router ay dapat trunk** (hindi access) sa ROAS. At ang **physical interface ng router ay dapat naka-`no shutdown`**. Kung down ito, **lahat ng subinterface ay down**.' },
    { type: 'callout', kind: 'trap', text: 'Sa Layer 3 switch, **kalimutan ang `ip routing`** at hindi magra-route ang switch kahit tama ang mga SVI. Ang SVI naman ay **down/down** kung **walang VLAN** o **walang active na port** sa VLAN na iyon.' },
    { type: 'callout', kind: 'tip', text: 'Ang **subinterface number ay label lang** (`Gi0/0.10`). Ang totoong VLAN ay nasa **`encapsulation dot1q`**. Ang pag-match nito sa VLAN ID ay kaugalian para madaling basahin, hindi requirement.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Setting the IP address before encapsulation dot1q on the subinterface.',
        'Leaving the router’s physical interface shut down.',
        'Connecting the router to an access port instead of a trunk.',
        'Giving PCs the wrong default gateway (for example a gateway from another VLAN).',
        'Forgetting ip routing on a Layer 3 switch.',
        'Assuming ROAS scales forever. All VLANs share one link.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: “Hindi maka-ping ang VLAN 20 mula sa VLAN 10”',
      scenario: 'A ROAS lab is configured. PCs can reach their own gateway in VLAN 10 but not VLAN 20. A ping from the router to 192.168.20.11 fails.',
      evidence: `R1# show ip interface brief
GigabitEthernet0/0     unassigned      YES unset  up      up
GigabitEthernet0/0.10  192.168.10.1    YES manual up      up
GigabitEthernet0/0.20  192.168.20.1    YES manual up      up

SW1# show vlan brief
20   ENG          active`,
      question: 'Ano ang susunod mong titingnan?',
      answer: 'The router side is fine. Check the switch: is VLAN 20 allowed on the trunk toward R1, and is PC-B in VLAN 20 as an access port? An allowed list of 10,99 would drop VLAN 20 before it reaches the router.',
      fix: 'Run show interfaces trunk on SW1. If VLAN 20 is missing from the allowed list, enter switchport trunk allowed vlan add 20 on the router-facing trunk, then retest.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang config ng subinterface para sa VLAN 30 (192.168.30.0/24, gateway .1) sa Gi0/0. Anong dalawang bagay ang dapat totoo sa switch side?',
      answer: 'interface g0/0.30 → encapsulation dot1q 30 → ip address 192.168.30.1 255.255.255.0. On the switch: the router-facing port must be a trunk, and VLAN 30 must exist and be allowed on that trunk (so also created on the switch).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Different VLAN = different subnet = needs routing.',
        'ROAS: encapsulation dot1q N first, then ip address. The switch port is a trunk.',
        'The PC’s default gateway is the subinterface (or SVI) IP for its own VLAN.',
        'Layer 3 switch: ip routing plus one SVI per VLAN.',
        'ROAS is limited by one link; a Layer 3 switch routes at hardware speed.',
        'show ip route shows C for the subnet and L for the router’s own address.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Different VLANs are different subnets and need a Layer 3 device to talk.',
        'Router-on-a-stick: trunk + one subinterface per VLAN, each the gateway of its VLAN.',
        'Subinterface order: encapsulation dot1q first, then ip address.',
        'Layer 3 switch: ip routing and an SVI per VLAN.',
        'Verify with show ip route and show ip interface brief.',
        'Susunod: bakit kailangan ng Spanning Tree kapag may redundant links.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'easy', type: 'single',
    prompt: 'Why can a PC in VLAN 10 not communicate with a PC in VLAN 20 through a Layer 2 switch alone?',
    choices: ['The VLANs are different broadcast domains and subnets, so a Layer 3 device is needed', 'The switch has no MAC table', 'VLAN 20 is always blocked', 'The PCs need the same MAC address'], correct: [0],
    explanation: 'Different VLANs are separate broadcast domains, normally separate subnets. Routing needs a Layer 3 device.',
    wrong: { 1: 'Every switch has a MAC table.', 2: 'No VLAN is blocked by default.', 3: 'MAC addresses are unique.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'easy', type: 'single',
    prompt: 'Which subinterface command tells the router to handle VLAN 20 traffic?',
    choices: ['switchport access vlan 20', 'encapsulation dot1q 20', 'vlan 20', 'ip vlan 20'], correct: [1],
    explanation: 'encapsulation dot1q 20 binds the subinterface to VLAN 20.',
    wrong: { 0: 'That is a switch access-port command.', 2: 'That creates a VLAN on a switch.', 3: 'Not a valid command.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'In router-on-a-stick, how should the switch port that connects to the router be configured?',
    choices: ['As an access port in VLAN 1', 'As an 802.1Q trunk', 'As a routed port', 'Shut down'], correct: [1],
    explanation: 'The router needs all VLANs over one link, so the switch port must be a trunk.',
    wrong: { 0: 'An access port carries one VLAN only.', 2: 'A routed port is a Layer 3 port and would not tag frames.', 3: 'A shut down port carries nothing.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'What should be the default gateway of a PC in VLAN 20 when router-on-a-stick uses Gi0/0.20 with 192.168.20.1/24?',
    choices: ['192.168.10.1', '192.168.20.1', '192.168.20.0', 'The switch management IP'], correct: [1],
    explanation: 'The PC’s gateway is the IP address of the subinterface for its own VLAN.',
    wrong: { 0: 'That is the gateway for VLAN 10.', 2: '192.168.20.0 is the network address.', 3: 'A management IP is not a router for the VLAN.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'An engineer enters an IP address on GigabitEthernet0/0.10 and IOS rejects it. What is the most likely missing step?',
    choices: ['no shutdown on the switch', 'encapsulation dot1q 10 on the subinterface', 'ip routing on the router', 'switchport mode access'], correct: [1],
    explanation: 'A subinterface needs its dot1Q encapsulation before it accepts an IP address.',
    wrong: { 0: 'That is unrelated to the router error.', 2: 'Routers route by default.', 3: 'That is a switch port command.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are needed on a Layer 3 switch to route between VLAN 10 and VLAN 20 using SVIs?',
    choices: ['ip routing enabled', 'An IP address on interface vlan 10 and interface vlan 20', 'A subinterface with encapsulation dot1q', 'A crossover cable to each PC'], correct: [0, 1],
    explanation: 'Enable ip routing and give each VLAN’s SVI an IP address (and no shutdown).',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'What is a disadvantage of router-on-a-stick?',
    choices: ['It cannot route between VLANs', 'All inter-VLAN traffic shares a single link to the router', 'It requires an SVI', 'It needs one router interface per VLAN'], correct: [1],
    explanation: 'The single trunk becomes a shared bottleneck and single point of failure.',
    wrong: { 0: 'It routes between VLANs perfectly well.', 2: 'SVIs belong to Layer 3 switches.', 3: 'That is the older one-interface-per-VLAN design; ROAS avoids it.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'hard', type: 'true-false',
    prompt: 'True or false: the physical router interface used for router-on-a-stick must have an IP address for the subinterfaces to work.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'The physical interface needs no IP address, but it must be enabled with no shutdown.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'hard', type: 'single',
    prompt: 'The router’s Gi0/0 is administratively down while Gi0/0.10 and Gi0/0.20 are configured correctly. What state do the subinterfaces show?',
    choices: ['up/up', 'down/down', 'up/down', 'They are removed'], correct: [1],
    explanation: 'A subinterface cannot be up when its physical interface is down.',
    wrong: { 0: 'They depend on the physical interface.', 2: 'Both status and protocol are down.', 3: 'They remain configured.' },
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'Which two routes appear in show ip route for an up subinterface Gi0/0.10 with 192.168.10.1/24?',
    choices: ['S and O', 'C 192.168.10.0/24 and L 192.168.10.1/32', 'B and D', 'Only a default route'], correct: [1],
    explanation: 'IOS installs a connected (C) route for the subnet and a local (L) /32 route for the interface address.',
    wrong: { 0: 'S is static and O is OSPF; neither is created automatically.', 2: 'B is BGP and D is EIGRP.', 3: 'No default route is created.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: paano tandaan ang router-on-a-stick?', back: 'Isang cable (trunk), isang subinterface bawat VLAN. TAG muna (encapsulation dot1q), IP pagkatapos, Ping para subukan. Gateway ng PC = .1 ng sarili niyang VLAN. Sa L3 switch: SVI + ip routing.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Why is a router needed between VLANs?', back: 'Different VLANs are different broadcast domains and subnets; a Layer 3 device must route between them.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'command', front: 'Router-on-a-stick subinterface for VLAN 10?', back: 'interface g0/0.10 · encapsulation dot1q 10 · ip address 192.168.10.1 255.255.255.0' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Config order on a subinterface?', back: 'encapsulation dot1q first, then ip address. IOS rejects the IP otherwise.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Switch port toward the router in ROAS?', back: 'An 802.1Q trunk. The router’s physical interface must be no shutdown.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Disadvantage of router-on-a-stick?', back: 'All inter-VLAN traffic shares one link (bottleneck, single point of failure).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'command', front: 'Layer 3 switch inter-VLAN routing?', back: 'ip routing · interface vlan 10 · ip address … · no shutdown (one SVI per VLAN)' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D2', category: 'concept', front: 'When is an SVI up/up?', back: 'When the VLAN exists and at least one port in that VLAN (access or trunk) is up.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Router-on-a-stick',
  tool: 'Packet Tracer',
  minutes: 45,
  objective: 'Route between VLAN 10 and VLAN 20 using one router interface with two subinterfaces and a switch trunk.',
  topology: 'R1 Gi0/0 ↔ SW1 Fa0/24 (or Gi0/1). PC1 on SW1 Fa0/1 (VLAN 10), PC2 on SW1 Fa0/2 (VLAN 20).',
  addressing: [
    { device: 'R1', interface: 'Gi0/0.10', address: '192.168.10.1/24', note: 'gateway VLAN 10' },
    { device: 'R1', interface: 'Gi0/0.20', address: '192.168.20.1/24', note: 'gateway VLAN 20' },
    { device: 'PC1', interface: 'NIC', address: '192.168.10.11/24', note: 'gateway 192.168.10.1' },
    { device: 'PC2', interface: 'NIC', address: '192.168.20.11/24', note: 'gateway 192.168.20.1' },
  ],
  steps: [
    'On SW1 create VLAN 10 and VLAN 20; put Fa0/1 in VLAN 10 and Fa0/2 in VLAN 20 as access ports.',
    'Make the switch port to the router a trunk (switchport mode trunk).',
    'On R1, enter interface g0/0 and no shutdown (no IP address).',
    'Create g0/0.10: encapsulation dot1q 10, then ip address 192.168.10.1 255.255.255.0.',
    'Create g0/0.20 the same way for VLAN 20.',
    'Set each PC’s default gateway to its own VLAN’s subinterface address.',
    'Check show ip route on R1: two connected networks and two local routes.',
    'Ping PC1 → PC2, then use Simulation mode to watch the packet enter the router and leave with a different VLAN tag.',
  ],
  checklist: [
    'Trunk on the switch port to R1',
    'Two subinterfaces with correct encapsulation and IPs',
    'PCs use correct default gateways',
    'show ip route shows two C and two L routes',
    'Cross-VLAN ping succeeds',
  ],
  hints: [
    'If the subinterface rejects the IP address, you forgot encapsulation dot1q.',
    'If pings fail, check show interfaces trunk for the allowed VLANs.',
  ],
  solution: [
    'SW1: vlan 10, vlan 20; fa0/1 access vlan 10; fa0/2 access vlan 20; the router port: switchport mode trunk.',
    'R1: interface g0/0 → no shutdown; g0/0.10 → encapsulation dot1q 10 → ip address 192.168.10.1 255.255.255.0; g0/0.20 → encapsulation dot1q 20 → ip address 192.168.20.1 255.255.255.0.',
    'show ip route lists C 192.168.10.0/24 via Gi0/0.10 and C 192.168.20.0/24 via Gi0/0.20.',
  ],
  breakIt: 'Set the PC2 gateway to 192.168.10.1 and retest; explain what happens. Then shut down R1 Gi0/0 and check the state of both subinterfaces.',
};
