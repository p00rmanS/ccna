import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'network-devices';

export const lesson: Lesson = {
  id: ID,
  moduleId: '0.1',
  domain: 'D1',
  title: 'Network Devices',
  description: 'Routers, switches, firewalls, access points, controllers and servers: what each does and where it sits.',
  whyMatters:
    'CCNA questions constantly ask “which device solves this problem?” Knowing what each device actually does — and at which layer — is the fastest way to eliminate wrong answers.',
  objectives: [
    'Explain what a router, Layer 2 switch and Layer 3 switch do',
    'Describe firewalls, IPS, access points, WLCs and controllers',
    'State which layer each device mainly works at',
    'Explain Power over Ethernet (PoE)',
    'Choose the right device for a scenario',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['router', 'switch', 'layer 3 switch', 'firewall', 'IPS', 'access point', 'WLC', 'controller', 'PoE', 'endpoint'],
  examObjectives: ['1.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A switch connects devices inside one network. A router connects different networks together. A firewall decides what traffic is allowed in or out. An access point lets wireless devices join the wired network.',
        'Think of a switch as the receptionist inside one office, and a router as the front door that leads to other buildings.',
      ],
      taglish: [
        'Ang switch, parang taga-direct sa loob ng isang opisina: tinitingnan niya kung sino ang kausap at ipinapadala sa tamang desk.',
        'Ang router naman, parang gate palabas ng subdivision — siya ang nagdurugtong sa ibang network. Ang firewall ang guwardiya na nagsasabi kung sino ang pwedeng pumasok o lumabas. Ang access point ang nagpapasok sa mga Wi-Fi device sa wired network.',
      ],
      technical: [
        'A Layer 2 switch forwards Ethernet frames within a LAN using destination MAC addresses. A router forwards IP packets between different IP networks using its routing table. A Layer 3 switch does both: it switches within VLANs and routes between them in hardware.',
        'A next-generation firewall (NGFW) filters traffic by policy, tracks connection state, and can inspect applications. An intrusion prevention system (IPS) inspects traffic for known attack patterns and can block it inline. An access point (AP) bridges 802.11 wireless clients onto the wired LAN.',
        'A wireless LAN controller (WLC) centrally configures and manages many lightweight APs. A network controller such as Cisco DNA Center (now branded Catalyst Center) manages and automates many wired and wireless devices from one place.',
      ],
    },
    {
      type: 'analogy',
      title: 'An office building',
      taglish: ['Parang opisina: ang switch ay receptionist sa isang palapag — alam niya kung sino ang nakaupo saan. Ang router ay main entrance at courier desk — lahat ng papuntang ibang building ay dumadaan doon. Ang firewall ay guwardiya na nagche-check ng ID, at ang access point ay wireless na intercom para sa mga walang cable.'],
      body: [
        'The switch is the receptionist on one floor: she knows which desk each person sits at and walks each memo to the right desk. The router is the building’s main entrance and courier desk: anything addressed to another building goes through it. The firewall is the security guard checking IDs at the door. The access point is a wireless intercom that lets people without a cable talk to the same floor.',
      ],
    },
    {
      type: 'hook',
      title: 'Switch = Same, Router = Route palabas',
      trick: '**SWitch = SAme network.** **ROuter = Other network** (Route palabas).',
      taglish: [
        'Kapag magkasama sa iisang network (parehong LAN) → **Switch** (S = Same). Kapag kailangan mong lumabas sa **ibang** network → **Router** (R = Route papunta sa Other).',
        'Kasama sa pamilya: **Firewall = guwardiya** (nagsasabi kung sino ang pwedeng pumasok/lumabas), **Access Point = Wi-Fi na pinto** (para sa walang cable), **WLC = boss ng maraming AP**.',
        'Ang **Layer 3 switch** ay “switch na marunong mag-route” — parang guwardiya na kayang maghatid din sa ibang barangay.',
      ],
      test: {
        question: 'Dalawang PC sa iisang switch, magkaiba ang IP network (192.168.10.x at 192.168.20.x), hindi mag-ping. Ano ang kulang?',
        answer: 'Router (o Layer 3 switch). Ang switch ay pang-“Same” network lang; kailangan mo ng “Route” para makarating sa Other network.',
      },
    },
    { type: 'diagram', id: 'device-gallery', caption: 'The device family. The layer labels are where each device does most of its work.' },
    {
      type: 'terms',
      items: [
        { term: 'Router', definition: 'Layer 3 device that forwards packets between different IP networks.' },
        { term: 'Layer 2 switch', definition: 'Forwards frames inside a LAN using MAC addresses.' },
        { term: 'Layer 3 switch', definition: 'A switch that can also route between VLANs/subnets.' },
        { term: 'Firewall (NGFW)', definition: 'Permits or blocks traffic by policy; next-generation models understand applications and users.' },
        { term: 'IPS', definition: 'Intrusion Prevention System: detects and blocks malicious traffic patterns inline.' },
        { term: 'Access point (AP)', definition: 'Connects wireless clients to the wired network.' },
        { term: 'WLC', definition: 'Wireless LAN Controller: central management for many lightweight APs.' },
        { term: 'Endpoint', definition: 'Any device that connects to the network to use it: PC, phone, IP camera, IP phone.' },
        { term: 'PoE', definition: 'Power over Ethernet: a switch supplies power to a device through the same cable that carries its data.' },
      ],
    },
    { type: 'interactive', id: 'guess-device', caption: 'Guess the device: pick the best device for each situation.' },
    {
      type: 'flow',
      title: 'Where each device sits on the path to the internet',
      steps: [
        'A laptop connects wirelessly to an access point (AP).',
        'The AP is plugged into an access switch, which also serves wired PCs and phones. The switch may power the AP with PoE.',
        'The switch connects to a router (or a Layer 3 switch) that links the LAN to other networks.',
        'A firewall sits between the inside network and the internet, filtering what may cross.',
        'The traffic leaves through the internet provider’s link.',
      ],
    },
    {
      type: 'cli',
      title: 'Seeing a device’s ports',
      transcript: `SW1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
Vlan1                  192.168.1.2     YES manual up                    up
FastEthernet0/1        unassigned      YES unset  up                    up
FastEthernet0/2        unassigned      YES unset  down                  down
FastEthernet0/3        unassigned      YES unset  administratively down down`,
      copyable: 'show ip interface brief',
      explain: [
        { line: 'show ip interface brief', why: 'One-line-per-interface summary of address and state. It works on routers and Layer 3-capable switches.' },
        { line: 'Vlan1 192.168.1.2', why: 'A switch’s management address lives on a virtual interface (SVI), because a Layer 2 switch has no addresses on its physical ports.' },
        { line: 'up / up', why: 'Fa0/1 is working: the cable is connected (Status) and the data link is running (Protocol).' },
        { line: 'down / down', why: 'Fa0/2 has no working link — usually nothing plugged in or a cable problem.' },
        { line: 'administratively down', why: 'Someone typed “shutdown” on Fa0/3. The fix is “no shutdown”.' },
      ],
      note: 'Sample output for illustration; exact columns vary by platform and IOS version.',
    },
    { type: 'callout', kind: 'trap', text: 'A switch does not connect different IP networks; a router (or Layer 3 switch) does. A home “Wi-Fi router” is really several devices in one box: router + switch + access point (+ modem).' },
    { type: 'callout', kind: 'relax', text: 'Do not memorise PoE wattages yet. Just remember the idea: the switch powers the device through the data cable. Standards are 802.3af (PoE), 802.3at (PoE+) and 802.3bt (higher power).' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Common mistakes',
      items: [
        'Choosing “switch” when a question asks how to connect two different IP networks — that needs routing.',
        'Thinking an access point is a router. An AP bridges wireless to wired inside the same network.',
        'Assuming a hub is still a sensible answer. Hubs repeat every signal out every port and are obsolete.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting scenario: two PCs, one switch, no ping',
      scenario: 'PC1 (192.168.10.10/24) and PC2 (192.168.20.10/24) are plugged into the same switch. Both link lights are green, but ping fails.',
      question: 'Both have valid addresses and working links. What is missing?',
      answer: 'The two PCs are in different IP networks. A Layer 2 switch only forwards inside one network, so something must route between 192.168.10.0/24 and 192.168.20.0/24.',
      fix: 'Add a router (or use a Layer 3 switch) with an interface in each network, and point each PC’s default gateway at it. (Routing between VLANs comes in Phase 2.)',
    },
    {
      type: 'challenge',
      title: 'Mini challenge: pick the device',
      prompt: 'A branch office needs (a) to give 40 laptops wireless access, (b) to block unwanted inbound traffic from the internet, and (c) to link to headquarters. Name one device type for each.',
      answer: '(a) Access point(s), managed by a WLC if there are many. (b) A firewall. (c) A router, which also provides the WAN connection.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Router = Layer 3, switch = Layer 2, Layer 3 switch = both, firewall = filters, AP = wireless access, WLC = manages APs.',
        'PoE removes the need for a power outlet at APs, IP phones and cameras.',
        'Know that controllers (DNA Center/Catalyst Center, WLC) centralise management — a theme that returns in Automation.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Switches connect devices within a network; routers connect networks.',
        'Layer 3 switches combine switching and routing.',
        'Firewalls and IPS enforce security policy; APs and WLCs provide and manage wireless.',
        'PoE delivers power and data over one cable.',
        'Next: how LANs and WANs differ.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'single',
    prompt: 'You need to connect two different IP networks. Which device should you use?',
    choices: ['Layer 2 switch', 'Router', 'Hub', 'Wireless access point'], correct: [1],
    explanation: 'Routers forward packets between IP networks using a routing table.',
    wrong: { 0: 'A Layer 2 switch forwards inside one network only.', 2: 'A hub just repeats signals; it has no idea about networks.', 3: 'An AP bridges wireless to wired within the same network.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'single',
    prompt: 'Which device connects wireless clients to the wired LAN?',
    choices: ['Router', 'Firewall', 'Access point', 'Layer 3 switch'], correct: [2],
    explanation: 'An access point bridges 802.11 wireless clients onto the wired network.',
    wrong: { 0: 'A router joins networks; it is not the wireless bridge.', 1: 'A firewall filters traffic.', 3: 'A Layer 3 switch switches and routes wired traffic.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'single',
    prompt: 'What does a wireless LAN controller (WLC) do?',
    choices: ['Encrypts traffic between two branch offices', 'Centrally configures and manages many lightweight access points', 'Assigns IP addresses to wired hosts', 'Converts copper signals to fibre'], correct: [1],
    explanation: 'A WLC gives one place to configure, monitor and manage many lightweight APs.',
    wrong: { 0: 'That describes a VPN.', 2: 'That is the job of DHCP.', 3: 'That is a media converter or transceiver.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'single',
    prompt: 'PC1 (192.168.10.10/24) and PC2 (192.168.20.10/24) are on the same Layer 2 switch and cannot ping each other. What is the most likely reason?',
    choices: ['The switch has too few ports', 'They are in different IP networks and nothing routes between them', 'The cables are the wrong colour', 'Switches cannot forward pings'], correct: [1],
    explanation: 'A Layer 2 switch does not route between IP networks. A router or Layer 3 switch is needed.',
    wrong: { 0: 'Port count is irrelevant here.', 2: 'Cable colour has no effect.', 3: 'Switches forward ICMP frames within a network without any problem.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: Power over Ethernet lets a switch supply power to a device over the same cable that carries its data.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'PoE powers access points, IP phones and cameras through the Ethernet cable.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO devices can make forwarding decisions based on IP addresses?',
    choices: ['Router', 'Layer 2 switch', 'Layer 3 switch', 'Hub'], correct: [0, 2],
    explanation: 'Routers and Layer 3 switches route based on destination IP addresses. Layer 2 switches use MAC addresses, and hubs do not make decisions.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'single',
    prompt: 'Which device inspects traffic for known attack patterns and can block matching traffic inline?',
    choices: ['IPS', 'Layer 2 switch', 'Access point', 'DHCP server'], correct: [0],
    explanation: 'An intrusion prevention system sits in the traffic path, detects malicious patterns and blocks them.',
    wrong: { 1: 'A Layer 2 switch forwards frames without inspecting for attacks.', 2: 'An AP provides wireless access.', 3: 'DHCP hands out addresses.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'single',
    prompt: 'A home “Wi-Fi router” typically combines which functions?',
    choices: ['Router, switch and access point', 'Firewall, IPS and WLC only', 'Hub and repeater only', 'DNS server and web server only'], correct: [0],
    explanation: 'Consumer routers bundle routing, a small Ethernet switch and a wireless access point (often with a modem too).',
    wrong: { 1: 'Enterprise features, not the basic bundle.', 2: 'Hubs and repeaters are obsolete building blocks.', 3: 'These are server roles, not the box’s core functions.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: switch o router?', back: 'SWitch = SAme network. ROuter = Other network (Route palabas). Firewall = guwardiya, AP = Wi-Fi na pinto, WLC = boss ng maraming AP.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'definition', front: 'Which device connects different IP networks?', back: 'A router (or a Layer 3 switch).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'switching', front: 'What does a Layer 2 switch use to forward frames?', back: 'Destination MAC addresses.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'definition', front: 'What is a Layer 3 switch?', back: 'A switch that can also route between VLANs/subnets.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'definition', front: 'Firewall vs IPS?', back: 'Firewall permits or blocks by policy. IPS inspects traffic for attack patterns and blocks them inline.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'definition', front: 'What does an access point do?', back: 'Bridges wireless clients onto the wired LAN.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'definition', front: 'What does a WLC do?', back: 'Centrally manages many lightweight access points.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'definition', front: 'What is PoE?', back: 'Power over Ethernet: power and data over one cable (802.3af / at / bt).' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'command', front: 'Which command gives a quick per-interface summary of address and state?', back: 'show ip interface brief' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Build a device inventory in Packet Tracer',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Place, connect and label the main device types, then confirm each link comes up.',
  topology: `  PC1 ──┐
        ├── SW1 ── R1 ── Cloud
  PC2 ──┘     │
            AP1  (Server1 on SW1)`,
  steps: [
    'Open Packet Tracer and place: 2 PCs, 1 Server, 1 switch (2960), 1 router (2911), 1 wireless access point, and 1 Cloud.',
    'Rename each device to match the topology (PC1, PC2, Server1, SW1, R1, AP1).',
    'Use copper straight-through cables to connect PC1, PC2, Server1 and AP1 to SW1, then SW1 to R1 (GigabitEthernet0/0), then R1 to the cloud.',
    'Wait for the link lights to turn green. Any that stay amber or red need a closer look (wrong port, or a router port that is shut down).',
    'On R1 open the CLI, enter “enable”, then “show ip interface brief”. Note which interfaces are up/up and which are administratively down.',
    'Write a one-line description of what each device does on the diagram.',
  ],
  checklist: [
    'All seven devices are placed and renamed',
    'SW1 links to PC1, PC2, Server1, AP1 and R1',
    'You know why the R1 link is still down (router interfaces start shut down)',
    'You can state each device’s job in one sentence',
  ],
  hints: [
    'Routers start with interfaces administratively down. You will fix that with “no shutdown” in the IOS lessons.',
    'Straight-through copper is correct for switch-to-PC, switch-to-router and switch-to-AP links.',
  ],
  solution: [
    'Links to R1 stay red until you run “no shutdown” on the interface — this is expected in this lab.',
    'Example job lines: SW1 forwards frames inside the LAN; R1 connects the LAN to other networks; AP1 gives wireless clients access; Server1 provides services.',
  ],
  breakIt: 'Replace the SW1–PC2 straight-through cable with a different cable type or a different port and note what the link lights do. Then restore it.',
};
