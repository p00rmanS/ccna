import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'osi-model';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.3',
  domain: 'D1',
  title: 'The OSI Model',
  description: 'Seven layers that give networking a shared vocabulary, and how data is wrapped as it travels.',
  whyMatters:
    'The OSI model is how everyone — exam writers and engineers — talks about where a problem lives or what a device does. “That is a Layer 2 issue” only helps if you know what Layer 2 means.',
  objectives: [
    'Name the seven OSI layers in order',
    'State each layer’s purpose, PDU, addressing and example protocols',
    'Explain encapsulation and decapsulation',
    'Match common devices and protocols to layers',
    'Use the layers to structure troubleshooting',
  ],
  estimatedMinutes: 35,
  difficulty: 'beginner',
  keywords: ['OSI', 'layers', 'encapsulation', 'PDU', 'segment', 'packet', 'frame', 'bits', 'troubleshooting'],
  examObjectives: ['1.1', '1.13'],
  sections: [
    {
      type: 'explain',
      simple: [
        'The OSI model splits “sending data across a network” into seven smaller jobs, stacked like floors in a building. Each floor does one job and only talks to the floors directly above and below it.',
        'When you send something, it goes down the floors and picks up a labelled wrapper at each one. On the other side it goes up, and each floor removes its own wrapper.',
      ],
      taglish: [
        'Ang OSI model ay hinahati ang buong proseso ng pagpapadala ng data sa pitong maliliit na trabaho, parang pitong palapag ng building.',
        'Pagpapadala: bababa ang data sa bawat palapag at dadagdagan ng sariling “balot” (header). Pagdating sa kabila, aakyat naman ito at aalisin ng bawat palapag ang balot na para sa kanya. Parang padala sa LBC: nilalagyan ng kahon, tape, at address label bago ibiyahe.',
      ],
      technical: [
        'OSI (Open Systems Interconnection) is a seven-layer reference model. Layers 7–5 (application, presentation, session) deal with the data an application works with. Layer 4 provides end-to-end transport and port numbers. Layer 3 provides logical addressing and routing. Layer 2 provides local delivery with physical (MAC) addresses. Layer 1 transmits raw bits.',
        'Encapsulation adds a header at each layer as data moves down: application data → segment (Layer 4 header with ports) → packet (Layer 3 header with IP addresses) → frame (Layer 2 header plus a trailer with the FCS) → bits. Decapsulation reverses the process on the receiving device.',
        'The model is a reference. Real networks follow the TCP/IP protocol suite, but OSI terminology is the shared language for describing behaviour and troubleshooting.',
      ],
    },
    {
      type: 'analogy',
      title: 'Sending a gift overseas',
      taglish: ['Parang pagpapadala ng regalo abroad: sinulat mo ang sulat (application data); nilagay ito ng sekretarya sa sobre na may numero ng departamento (port); nilagyan ng mail room ng buong address ng opisina (IP); at ang lokal na courier ay naglagay ng label para sa susunod na depot lang (MAC — nagbabago bawat depot). Sa dulo, binubuksan ito nang pabaligtad, isang balot bawat layer.'],
      body: [
        'You write a letter (application data). Your assistant puts it in an envelope marked with the department number it is for (transport: the port). The mail room adds the full street address of the recipient’s office (network: the IP address). The local courier adds a pickup label for the next depot only (data link: the MAC address, which changes at every depot). Finally the truck, ship or plane carries the parcel (physical: the bits).',
        'On arrival the parcel is unwrapped in reverse order, one layer at a time, until the letter reaches the person it was written for.',
      ],
    },
    {
      type: 'hook',
      title: 'Big Fat Pizza Slices + MIP',
      trick: 'Pataas 1→4: **B**ig **F**at **P**izza **S**lices = **B**its · **F**rame · **P**acket · **S**egment. Address: **MIP** = **M**AC (2) · **I**P (3) · **P**ort (4).',
      taglish: [
        'Ang pinaka-tinatanong sa exam ay ang mababang layers (1–4). Bilangin mula sa ilalim: Layer 1 = **Bits**, 2 = **Frame**, 3 = **Packet**, 4 = **Segment**. Isipin: **“Big Fat Pizza Slices”** — B-F-P-S.',
        'Sunod, ang address bawat layer: **MIP** — **M**AC sa Layer 2, **I**P sa Layer 3, **P**ort sa Layer 4. Pataas ang pagbilang: 2 → 3 → 4 = M → I → P.',
        'Device: **Switch = 2**, **Router = 3**. At sa troubleshooting: **umpisahan sa ilalim (Layer 1)** — walang link, walang network.',
      ],
      test: {
        question: 'Ilagay ang PDU at address ng Layer 2, 3, at 4.',
        answer: 'Layer 2 = Frame + MAC. Layer 3 = Packet + IP. Layer 4 = Segment + Port. (Big Fat Pizza Slices + MIP.)',
      },
    },
    { type: 'diagram', id: 'osi-encapsulation', caption: 'The seven layers, with the PDU and addressing at each layer. Data is wrapped as it moves down the stack.' },
    { type: 'interactive', id: 'encapsulation', caption: 'Step through encapsulation and watch the headers being added.' },
    {
      type: 'terms',
      items: [
        { term: 'Layer 7 — Application', definition: 'Network services to applications. Examples: HTTP, HTTPS, DNS, DHCP, SSH, SMTP.' },
        { term: 'Layer 6 — Presentation', definition: 'Data formats, encoding, compression and encryption (for example JSON, JPEG, TLS as a concept).' },
        { term: 'Layer 5 — Session', definition: 'Starts, maintains and ends conversations between applications.' },
        { term: 'Layer 4 — Transport', definition: 'End-to-end delivery between applications using port numbers: TCP and UDP. PDU: segment (TCP) or datagram (UDP).' },
        { term: 'Layer 3 — Network', definition: 'Logical (IP) addressing and routing between networks. PDU: packet. Device: router.' },
        { term: 'Layer 2 — Data Link', definition: 'Local delivery using MAC addresses; Ethernet and Wi-Fi. PDU: frame. Device: switch.' },
        { term: 'Layer 1 — Physical', definition: 'Signals on the medium: bits over copper, fibre or radio. Devices: cables, hubs, repeaters.' },
        { term: 'PDU', definition: 'Protocol data unit: the name for data at a given layer.' },
        { term: 'Encapsulation', definition: 'Adding headers (and a trailer at Layer 2) as data moves down the stack.' },
      ],
    },
    {
      type: 'flow',
      title: 'A message moving from PC1 to a web server',
      steps: [
        'Layers 7–5: the browser creates HTTP data.',
        'Layer 4: TCP adds a header with source and destination ports (for example destination port 443). The result is a segment.',
        'Layer 3: IP adds a header with source and destination IP addresses. The result is a packet.',
        'Layer 2: Ethernet adds a header with source and destination MAC addresses and a trailer (FCS). The result is a frame.',
        'Layer 1: the frame is turned into bits and sent as electrical, light or radio signals.',
        'Each receiving device removes headers up to the layer it needs. A switch stops at Layer 2; a router looks at Layer 3; the server unwraps everything.',
      ],
    },
    {
      type: 'callout',
      kind: 'memorize',
      text: 'Bottom to top (1→7): “Please Do Not Throw Sausage Pizza Away” = Physical, Data Link, Network, Transport, Session, Presentation, Application. Top to bottom (7→1): “All People Seem To Need Data Processing”. Understand the layers first — mnemonics just help recall.',
    },
    {
      type: 'cli',
      title: 'Layer 1 and Layer 2 in one command',
      transcript: `R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.1.1     YES manual up                    up
GigabitEthernet0/1     10.0.0.1        YES manual up                    down
GigabitEthernet0/2     unassigned      YES unset  administratively down down`,
      copyable: 'show ip interface brief',
      explain: [
        { line: 'Status column', why: 'Roughly Layer 1: is the interface enabled and is there a signal? “administratively down” means someone entered “shutdown”.' },
        { line: 'Protocol column', why: 'Roughly Layer 2: is the data-link protocol working? up/up is healthy.' },
        { line: 'Gi0/1 up/down', why: 'The physical layer looks fine but the data link is not working (for example an encapsulation or keepalive mismatch, or the far end is not running properly). Look at Layer 2.' },
        { line: 'Gi0/2 admin down/down', why: 'Fix at Layer 1 by administrator action: “no shutdown”.' },
      ],
      note: 'This mapping is a useful working rule, not a formal definition. Also useful: ping tests Layer 3 (ICMP); SSH and telnet test Layer 7.',
    },
    { type: 'callout', kind: 'trap', text: 'PDU names are an easy exam trap: Layer 4 = segment (TCP) / datagram (UDP), Layer 3 = packet, Layer 2 = frame, Layer 1 = bits. And addressing changes by layer: ports at 4, IP at 3, MAC at 2.' },
    { type: 'callout', kind: 'trap', text: 'A switch is a Layer 2 device, a router is Layer 3. A Layer 3 switch works at both, which is why it can route between VLANs.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Common mistakes',
      items: [
        'Mixing up layer numbers and names: Transport is 4, Network is 3, Data Link is 2.',
        'Calling every chunk of data a “packet”. On the exam, “packet” means Layer 3.',
        'Believing real protocols map neatly onto all seven layers. In practice the top three are handled by the application together.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting scenario: work from the bottom up',
      scenario: 'PC1 cannot reach a server. PC1’s link light is off and “show interfaces” on the switch port reports “down”.',
      question: 'Which layer should you investigate first, and why?',
      answer: 'Layer 1. If there is no physical link, nothing above it can work — no IP settings, ACLs or routing changes will help. Bottom-up troubleshooting starts with cables, ports, power and speed/duplex.',
      fix: 'Reseat or replace the cable, test another port, and confirm the interface is not administratively shut down. Only when the link is up/up move to Layer 2, then Layer 3.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge: assign the layer',
      prompt: 'Name the OSI layer for each: (a) a MAC address, (b) TCP port 443, (c) an IP address, (d) a fibre-optic cable, (e) HTTP.',
      answer: '(a) Layer 2 Data Link, (b) Layer 4 Transport, (c) Layer 3 Network, (d) Layer 1 Physical, (e) Layer 7 Application.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Know PDU + address type per layer: L4 segment/port, L3 packet/IP, L2 frame/MAC, L1 bits.',
        'Encapsulation goes down the stack on the sender; decapsulation goes up on the receiver.',
        'The Layer 2 header carries source and destination MAC addresses; the trailer carries the FCS.',
      ],
    },
    {
      type: 'summary',
      points: [
        'OSI has seven layers that split networking into separate jobs.',
        'Data is encapsulated on the way down: segment → packet → frame → bits.',
        'Each layer has its own PDU and address type.',
        'Switches work at Layer 2, routers at Layer 3.',
        'Troubleshoot layer by layer, usually from the bottom up.',
        'Next: the TCP/IP model — the version used in real networks — and TCP versus UDP.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'single',
    prompt: 'Which OSI layer is responsible for logical (IP) addressing and routing?',
    choices: ['Layer 2 — Data Link', 'Layer 3 — Network', 'Layer 4 — Transport', 'Layer 1 — Physical'], correct: [1],
    explanation: 'The Network layer uses IP addresses and is where routing happens.',
    wrong: { 0: 'Layer 2 uses MAC addresses for local delivery.', 2: 'Layer 4 uses port numbers.', 3: 'Layer 1 transmits bits.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'single',
    prompt: 'What is the PDU at Layer 2?',
    choices: ['Bits', 'Packet', 'Segment', 'Frame'], correct: [3],
    explanation: 'Layer 2 encapsulates a packet into a frame.',
    wrong: { 0: 'Bits are Layer 1.', 1: 'Packets are Layer 3.', 2: 'Segments are Layer 4.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'single',
    prompt: 'Which addressing information is used at Layer 4?',
    choices: ['MAC addresses', 'IP addresses', 'Port numbers', 'VLAN IDs'], correct: [2],
    explanation: 'Transport-layer headers carry source and destination port numbers that identify applications.',
    wrong: { 0: 'MAC addresses are Layer 2.', 1: 'IP addresses are Layer 3.', 3: 'VLAN IDs are in the 802.1Q tag at Layer 2.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'single',
    prompt: 'Put the encapsulation steps in the correct order from the application down to the wire.',
    choices: ['Data → segment → packet → frame → bits', 'Data → packet → segment → frame → bits', 'Data → frame → packet → segment → bits', 'Bits → frame → packet → segment → data'], correct: [0],
    explanation: 'Layer 4 makes a segment, Layer 3 a packet, Layer 2 a frame, and Layer 1 sends bits.',
    wrong: { 1: 'Transport comes before Network when moving down.', 2: 'The frame is the last wrapper, not the first.', 3: 'This is the decapsulation (receiving) order.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'single',
    prompt: 'At which layer does a router make forwarding decisions?',
    choices: ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 7'], correct: [2],
    explanation: 'Routers read the Layer 3 destination IP address and consult the routing table.',
    wrong: { 0: 'Layer 1 devices repeat signals.', 1: 'Switches decide at Layer 2.', 3: 'Application-layer devices inspect content, but routers forward at Layer 3.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO of these are Layer 7 (Application) protocols?',
    choices: ['HTTP', 'Ethernet', 'DNS', 'IP'], correct: [0, 2],
    explanation: 'HTTP and DNS are application-layer protocols. Ethernet is Layer 2 and IP is Layer 3.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'single',
    prompt: 'The link light on a switch port is off and “show interfaces” says the interface is down. Which layer do you check first?',
    choices: ['Layer 7', 'Layer 4', 'Layer 3', 'Layer 1'], correct: [3],
    explanation: 'No link means a physical-layer problem: cable, port, power or shutdown. Nothing above Layer 1 can work until it is fixed.',
    wrong: { 0: 'Applications cannot run over a dead link.', 1: 'Port numbers are irrelevant without a link.', 2: 'IP settings cannot help if there is no link.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: encapsulation adds a trailer (the FCS) at Layer 2 as well as a header.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'The Ethernet frame has a header (MACs, EtherType) and a trailer containing the FCS for error detection.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'medium', type: 'single',
    prompt: 'Which layer does a Layer 2 switch use to make forwarding decisions?',
    choices: ['Network layer', 'Transport layer', 'Data Link layer', 'Physical layer'], correct: [2],
    explanation: 'Switches read the destination MAC address in the Layer 2 header.',
    wrong: { 0: 'That is a router’s job.', 1: 'Only firewalls and some devices look at ports.', 3: 'Bits alone carry no addressing.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: paano tandaan ang PDU at address ng OSI Layers 1–4?', back: 'Big Fat Pizza Slices = Bits, Frame, Packet, Segment (Layer 1→4). MIP = MAC (L2), IP (L3), Port (L4).' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'The seven OSI layers, 7 → 1?', back: 'Application, Presentation, Session, Transport, Network, Data Link, Physical.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'concept', front: 'PDU at layers 4, 3, 2, 1?', back: 'Segment (TCP) / datagram (UDP), packet, frame, bits.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Address type at layers 4, 3, 2?', back: 'Port numbers, IP addresses, MAC addresses.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Which layer does a router work at?', back: 'Layer 3 (Network).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Which layer does a switch work at?', back: 'Layer 2 (Data Link).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What is encapsulation?', back: 'Adding headers (and a Layer 2 trailer) as data moves down the layers.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What does the FCS do?', back: 'It is a trailer value used to detect errors in a frame; a frame that fails the check is discarded.' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Bottom-up troubleshooting starts where?', back: 'Layer 1: cables, ports, power, link lights.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Watch the OSI layers in Simulation mode',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Send one ping and inspect the OSI layers on the PDU as it leaves and arrives.',
  topology: 'PC1 ─── SW1 ─── PC2',
  addressing: [
    { device: 'PC1', interface: 'FastEthernet0', address: '192.168.1.11/24' },
    { device: 'PC2', interface: 'FastEthernet0', address: '192.168.1.12/24' },
  ],
  steps: [
    'Build PC1 ─ SW1 ─ PC2 with straight-through copper cables. Set the static IPs from the table (mask 255.255.255.0).',
    'Switch to Simulation mode (bottom right). Click “Edit Filters” and leave ICMP and ARP selected.',
    'Use the Add Simple PDU tool (closed envelope) and click PC1 then PC2.',
    'Press Capture/Forward until the PDU is on PC1 (or press play). Click the envelope on PC1.',
    'In the PDU Information window open the “OSI Model” tab. Read what PC1 does at each layer for the outbound PDU.',
    'Keep stepping. Click the envelope when it sits on SW1 and note which layers the switch uses. Repeat on PC2.',
    'Record: which layers did SW1 process? Which addresses were used at each layer?',
  ],
  checklist: [
    'PC1 and PC2 have the correct static addresses',
    'Simulation mode is capturing ICMP and ARP',
    'You inspected the OSI Model tab on PC1 and PC2',
    'You noted that the switch works at Layer 2',
  ],
  hints: [
    'The first ping often triggers an ARP exchange before the ICMP echo. That is normal.',
    'The OSI Model tab shows layers 1–7 with a short note for each on that device.',
  ],
  solution: [
    'PC1 builds ICMP at Layer 3 (with IP addresses), wraps it in an Ethernet frame at Layer 2 (with MAC addresses), and sends bits at Layer 1.',
    'SW1 only inspects Layers 1–2: it reads the destination MAC and forwards the frame.',
    'PC2 decapsulates all the way up and answers the echo.',
  ],
  breakIt: 'Change PC2’s address to 192.168.2.12 without changing the mask. Repeat the simulation and note where the process changes (hint: PC1 no longer treats PC2 as local).',
};
