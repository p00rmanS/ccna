import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'what-is-a-network';

export const lesson: Lesson = {
  id: ID,
  moduleId: '0.1',
  domain: 'D1',
  title: 'What Is a Network?',
  description: 'The four things every network needs, who plays which role, and how devices are arranged.',
  whyMatters:
    'Every CCNA topic — VLANs, routing, NAT, ACLs — is a way of making a network behave. If you can picture the basic parts (devices, links, messages, rules), later topics stop feeling like magic words to memorise and start feeling like logical answers.',
  objectives: [
    'Define a computer network and name its four basic elements',
    'Tell end devices from intermediate devices',
    'Explain client, server and peer-to-peer roles',
    'Recognise star, mesh and point-to-point topologies',
    'Read your own computer’s basic network settings',
  ],
  estimatedMinutes: 25,
  difficulty: 'beginner',
  keywords: ['network', 'host', 'client', 'server', 'topology', 'protocol', 'end device'],
  examObjectives: ['1.1', '1.2'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A network is two or more devices connected so they can share information. Your phone and your home Wi-Fi router already make a tiny network.',
        'For that sharing to work you need four things: the devices themselves, something connecting them, the information being sent, and a set of rules so everyone understands each other.',
      ],
      taglish: [
        'Ang network ay grupo ng mga device — laptop, cellphone, printer — na magkakakonekta para makapagpalitan ng data.',
        'Kailangan nito ng apat na bagay: ang mga device, ang koneksyon (cable o Wi-Fi), ang mismong mensahe, at ang mga patakaran (protocols) para magkaintindihan ang lahat. Parang barangay: may mga bahay, may mga kalsada, may mga padala, at may mga batas para hindi magkagulo.',
      ],
      technical: [
        'A computer network is a set of end devices and intermediate devices interconnected by transmission media that exchange data by following agreed protocols.',
        'Four elements: (1) sources and destinations of messages, (2) the medium that carries them (copper, fibre, radio), (3) the messages themselves, and (4) the protocols — the rules for formatting, addressing, delivery and error handling.',
        'End devices (hosts) create or consume data. Intermediate devices — switches, routers, wireless access points, firewalls — connect end devices and forward data between them.',
      ],
    },
    {
      type: 'analogy',
      title: 'A neighbourhood and its postal service',
      taglish: ['Isipin ang barangay: ang mga bahay ay end devices, ang mga kalsada ay media, ang mga terminal na nagpapasa ng pasahero ay intermediate devices, at ang mga patakaran sa trapiko at address ay protocols. Hindi mo kailangang kilalanin ang bawat kalsada sa buong bansa — ang kailangan mo lang ay tamang address sa sobre.'],
      body: [
        'Houses are the end devices: they send and receive letters. Roads are the media. The post office sorting centres are the intermediate devices: they never write or read the letters, they just send each one onward. The rules of addressing and delivery are the protocols.',
        'Nobody needs to understand every road in the country. They only need to put the right address on the envelope — and the same idea will carry you through IP addressing later.',
      ],
    },
    {
      type: 'hook',
      title: 'Ang jeepney ng data',
      trick: '**Pasahero = Message · Jeep = Device · Kalsada = Media · Batas-trapiko = Protocol**',
      taglish: [
        'Apat lang ang kailangan ng kahit anong network — parang biyahe ng jeepney: **pasahero** (ang message/data), **jeep** (ang device), **kalsada** (ang media: cable o Wi-Fi), at **batas-trapiko** (ang protocols — para hindi magkabanggaan).',
        'Ang **end device** ay ang **dulo ng biyahe** (dito nagsisimula o nagtatapos ang data). Ang **intermediate device** ay ang **hintuan** (switch, router): nagpapasa lang, hindi sila ang destinasyon.',
        'At tandaan: ang **client** at **server** ay **trabaho**, hindi klase ng makina. Ang isang tao ay pwedeng pasahero ngayon at tsuper mamaya.',
      ],
      test: {
        question: 'Sa jeepney trick: ano ang “kalsada” at ano ang “batas-trapiko”?',
        answer: '“Kalsada” = media (cable, fibre, Wi-Fi). “Batas-trapiko” = protocols (Ethernet, IP, TCP, HTTP…).',
      },
    },
    { type: 'diagram', id: 'network-overview', caption: 'End devices (blue) sit at the edges; intermediate devices (switch, router) connect them to each other and to the internet.' },
    {
      type: 'terms',
      items: [
        { term: 'Host / end device', definition: 'A device that is the source or destination of data: PC, phone, server, printer, IP camera.' },
        { term: 'Intermediate device', definition: 'A device that forwards data between end devices: switch, router, wireless AP, firewall.' },
        { term: 'Medium', definition: 'What carries the signal: copper cable, fibre-optic cable, or radio waves.' },
        { term: 'Protocol', definition: 'An agreed set of rules for communication (for example Ethernet, IP, TCP, HTTP).' },
        { term: 'Client', definition: 'A role: the device that asks for a service (your browser asking for a web page).' },
        { term: 'Server', definition: 'A role: the device that provides a service (the machine that holds the web page).' },
        { term: 'Peer-to-peer', definition: 'A design where devices share resources directly, with no dedicated server.' },
        { term: 'Topology', definition: 'How devices are arranged. Physical topology is the real cabling; logical topology is how data flows.' },
      ],
    },
    {
      type: 'flow',
      title: 'What happens when you open a web page (big picture)',
      steps: [
        'Your laptop (the client) builds a request for the page.',
        'The request crosses your local network through a switch or wireless access point.',
        'Your router forwards it toward the internet through your internet provider.',
        'Routers along the way pass it on until it reaches the web server.',
        'The server (the server role) builds a reply and sends it back along a path to you.',
        'Your browser assembles the reply and shows the page.',
      ],
    },
    {
      type: 'cli',
      title: 'See your own computer’s network settings',
      transcript: `C:\\> ipconfig

Wireless LAN adapter Wi-Fi:

   IPv4 Address. . . . . . . . . . . : 192.168.1.23
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1

C:\\> ping 127.0.0.1

Reply from 127.0.0.1: bytes=32 time<1ms TTL=128`,
      copyable: 'ipconfig\nping 127.0.0.1',
      explain: [
        { line: 'ipconfig', why: 'Windows command that lists your adapters and their addresses. On Linux use “ip addr”; on macOS use “ifconfig”.' },
        { line: 'IPv4 Address', why: 'Your computer’s address on this network. You will learn to read it in the IPv4 lesson.' },
        { line: 'Default Gateway', why: 'The router your computer sends traffic to when the destination is outside the local network.' },
        { line: 'ping 127.0.0.1', why: '127.0.0.1 always means “this computer”. A reply proves your own network software works; it says nothing about the outside world.' },
      ],
      note: 'The output above is an illustration — your addresses will differ.',
    },
    { type: 'callout', kind: 'relax', text: 'You do not need to understand the addresses in that output yet. Just notice that your computer has settings that identify it on a network. Every one of them gets its own lesson.' },
    { type: 'callout', kind: 'trap', text: '“Client” and “server” are roles, not kinds of hardware. One computer can be a client for one task and a server for another at the same moment. Do not assume a “server” must be a special machine.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Common mistakes',
      items: [
        'Saying “the internet” when you mean “the web”. The web is one service that runs over the internet; email, video calls and games are others.',
        'Treating Wi-Fi as “the network”. Wi-Fi is one way to connect a device; the network is everything that carries the traffic.',
        'Calling a home “router” a single device with a single job. It usually bundles a router, a small switch, a wireless access point, and often a modem.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting scenario: one device offline',
      scenario: 'A laptop shows “connected to Wi-Fi” but no websites open. Two phones on the same Wi-Fi work normally.',
      question: 'The phones work. What does that tell you about where the problem is NOT, and what would you check first?',
      answer:
        'The shared parts — the access point, the router, and the internet connection — are clearly working, because the phones use them. The fault is specific to the laptop: its address settings, its DNS setting, a VPN or proxy, or its adapter.',
      fix: 'Run ipconfig on the laptop. If the IPv4 address starts with 169.254 the laptop failed to get an address automatically (you will learn why in the IPv4 lesson). Otherwise check the default gateway and DNS entries.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge: sort the devices',
      prompt: 'A small office has: 3 laptops, 1 network printer, 1 wireless access point, 1 switch, 1 router, and 1 file server. Which are end devices and which are intermediate devices?',
      answer: 'End devices: 3 laptops, the printer, the file server. Intermediate devices: the access point, the switch, the router.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Expect questions that ask you to classify a device as end or intermediate.',
        'Star (or extended star) is the normal wired LAN topology: every device connects to a central switch.',
        'The exam cares about roles: a device is a “client” only in relation to a service it requests.',
      ],
    },
    {
      type: 'summary',
      points: [
        'A network needs devices, media, messages and protocols.',
        'End devices send and receive data; intermediate devices forward it.',
        'Client and server are roles; peer-to-peer has no dedicated server.',
        'Modern wired LANs use a star topology built around a switch.',
        'Next: the specific devices you will meet again and again in CCNA.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'single',
    prompt: 'Which set lists the four basic elements of any network?',
    choices: ['Devices, media, messages and protocols', 'Routers, switches, servers and clients', 'Cables, Wi-Fi, fibre and radio', 'Hardware, software, firmware and drivers'],
    correct: [0],
    explanation: 'A network needs something to send and receive data (devices), something to carry it (media), the data itself (messages) and rules (protocols).',
    wrong: { 1: 'These are examples of devices and roles, not the four elements.', 2: 'These are all types of medium — only one of the four elements.', 3: 'These describe how a computer is built, not what a network needs.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'single',
    prompt: 'Which device is an intermediate device?',
    choices: ['Laptop', 'Smartphone', 'Switch', 'Network printer'],
    correct: [2],
    explanation: 'A switch forwards data between other devices. The others create or consume data, so they are end devices.',
    wrong: { 0: 'A laptop is a host: it is the source or destination of data.', 1: 'A phone is an end device.', 3: 'A printer receives print jobs, so it is an end device.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a computer that serves a web page can never act as a client at the same time.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'Client and server are roles. The same computer can serve pages while also requesting a file from another server.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'multiple',
    prompt: 'Which TWO of these are end devices?',
    choices: ['Laptop', 'Router', 'Network printer', 'Switch'], correct: [0, 2],
    explanation: 'Laptops and printers are sources or destinations of data. Routers and switches sit in the middle and forward it.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'single',
    prompt: 'A web browser requests a page from a web server. Which model describes this?',
    choices: ['Peer-to-peer', 'Client-server', 'Ring topology', 'Point-to-point WAN'], correct: [1],
    explanation: 'The browser is the client asking for a service and the web server is the server providing it.',
    wrong: { 0: 'Peer-to-peer has no dedicated server.', 2: 'A ring is a physical topology, not a service model.', 3: 'A WAN link type says nothing about who asks and who answers.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'easy', type: 'single',
    prompt: 'Two coworkers share files directly between their laptops with no central server. What is this called?',
    choices: ['Client-server', 'Peer-to-peer', 'Star topology', 'Intranet'], correct: [1],
    explanation: 'When devices share resources directly with each other and no dedicated server is involved, it is peer-to-peer.',
    wrong: { 0: 'Client-server needs a device dedicated to providing the service.', 2: 'Star describes cabling around a central device, not how sharing works.', 3: 'An intranet is a private network of an organisation.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'easy', type: 'single',
    prompt: 'Which physical topology do most modern wired LANs use?',
    choices: ['Bus', 'Ring', 'Star', 'Full mesh'], correct: [2],
    explanation: 'Each device connects to a central switch. Larger networks extend this into an “extended star”.',
    wrong: { 0: 'Shared-bus Ethernet is historical.', 1: 'Ring topologies are rare in modern Ethernet LANs.', 3: 'Full mesh needs a link between every pair and is only used where the redundancy is worth the cost.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: paano tandaan ang 4 na elemento ng network?', back: 'Jeepney: Pasahero = Message · Jeep = Device · Kalsada = Media · Batas-trapiko = Protocol. End device = dulo ng biyahe; intermediate = hintuan.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'definition', front: 'What four elements does every network need?', back: 'Devices (sources/destinations), media, messages, and protocols (rules).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'definition', front: 'End device vs intermediate device?', back: 'End devices create or consume data (PC, phone, server). Intermediate devices forward it (switch, router, AP, firewall).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'definition', front: 'Are “client” and “server” kinds of hardware?', back: 'No — they are roles. One device can be both at once.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'definition', front: 'What is peer-to-peer?', back: 'Devices share resources directly, with no dedicated server.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'definition', front: 'What is a protocol?', back: 'An agreed set of rules for communication, such as Ethernet, IP, TCP or HTTP.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'definition', front: 'Physical vs logical topology?', back: 'Physical = how devices are actually cabled. Logical = how data actually flows between them.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Which topology do most wired LANs use?', back: 'Star (extended star): every device connects to a central switch.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Map your own network',
  tool: 'Your computer',
  minutes: 20,
  objective: 'Identify the end devices, intermediate devices and media on a network you actually use, and read your computer’s network settings.',
  steps: [
    'On paper, list every device that connects to your home or workplace network (phones, laptops, TVs, printers, consoles).',
    'Mark each one E for end device. Then find the intermediate devices (router, switch, access point, mesh nodes) and mark them I.',
    'Next to each device write how it connects: Wi-Fi, Ethernet cable, or unknown.',
    'Draw the devices on one page, with lines showing what connects to what. Put the internet as a cloud at the top.',
    'On a Windows PC open Command Prompt and run ipconfig. On macOS or Linux open a terminal and run ifconfig or ip addr.',
    'Write down your IPv4 address, subnet mask and default gateway beside your PC on the drawing.',
    'Run ping 127.0.0.1 and confirm you get replies.',
  ],
  checklist: [
    'Every device is labelled E or I',
    'Every device shows how it connects (Wi-Fi/cable)',
    'The internet cloud is drawn and connected to the router',
    'The PC’s IPv4 address, mask and gateway are written on the drawing',
    'ping 127.0.0.1 succeeded',
  ],
  hints: [
    'Your router’s admin page (often 192.168.1.1) usually lists connected devices. Only look — do not change settings you do not understand.',
    'The default gateway from ipconfig is almost always your router.',
  ],
  solution: [
    'A typical home result: phones, laptops, TV, console = end devices; router (which contains a switch and access point) = intermediate.',
    'Gateway = the router’s LAN address. The mask is usually 255.255.255.0.',
    'A missing reply from 127.0.0.1 would point at a problem with the computer’s own network stack, not the network.',
  ],
  breakIt: 'Unplug your router’s internet cable (or disable Wi-Fi on one device). Which drawings’ lines “break”, and which devices can still talk to each other locally?',
};
