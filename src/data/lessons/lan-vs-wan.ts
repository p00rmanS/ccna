import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'lan-vs-wan';

export const lesson: Lesson = {
  id: ID,
  moduleId: '0.1',
  domain: 'D1',
  title: 'LAN vs WAN',
  description: 'How local networks differ from wide-area networks, and how the internet, intranets and branch offices fit in.',
  whyMatters:
    'Almost every design question boils down to “what stays inside the local network, and what has to cross a provider’s link?” Knowing the boundary tells you which devices to configure and where problems can hide.',
  objectives: [
    'Define LAN, WLAN, WAN, SOHO and campus',
    'Explain who owns and controls each',
    'Distinguish the internet from an intranet',
    'Identify where the LAN ends and the WAN begins in a diagram',
    'Use traceroute to see the path leaving your LAN',
  ],
  estimatedMinutes: 25,
  difficulty: 'beginner',
  keywords: ['LAN', 'WAN', 'WLAN', 'SOHO', 'campus', 'intranet', 'internet', 'ISP', 'branch', 'traceroute'],
  examObjectives: ['1.2'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A LAN (local area network) covers one place: a home, one office floor, one school building. The organisation that uses it owns and manages it.',
        'A WAN (wide area network) connects places that are far apart, like a head office and a branch in another city. Usually you rent that connection from a service provider.',
      ],
      taglish: [
        'Ang LAN ay network sa iisang lugar — bahay, opisina, o isang building — at ikaw o ang kumpanya mo ang may hawak nito.',
        'Ang WAN naman ay nag-uugnay ng malalayong lugar, halimbawa Makati at Cebu. Kadalasan, inuupahan mo ang linya mula sa provider, kaya hindi mo hawak ang buong daan. Parang barangay roads (LAN) versus expressway na pag-aari ng iba (WAN).',
      ],
      technical: [
        'A LAN provides high-speed connectivity to devices in a limited geographic area under a single administrative control. A wireless LAN (WLAN) is a LAN that uses radio (802.11) instead of cables.',
        'A WAN interconnects LANs across a wide geographic area and generally relies on a service provider’s infrastructure: leased lines, Metro Ethernet, MPLS services, or the internet with a VPN. The router is normally the boundary device between LAN and WAN.',
        'The internet is a global collection of interconnected networks. An intranet is a private network for one organisation using the same technologies; an extranet extends limited access to trusted outside parties.',
      ],
    },
    {
      type: 'hook',
      title: 'W = Wala sa loob',
      trick: '**LAN = LOOB ng bahay mo.** **WAN = WALA sa loob — Wide, malayo, inuupahan.**',
      taglish: [
        '**LAN** = **L**oob — sa iisang lugar (bahay, opisina, isang building), ikaw ang may hawak. **WAN** = **W**ala sa loob — malayo (Manila ↔ Cebu) at kadalasang **inuupahan** sa provider, kaya hindi mo hawak ang buong daan.',
        'Ang **router** ang “gate” — ang hangganan ng LAN at WAN. Sa traceroute, ang **hop 1 ang gate mo**; lahat ng pagkatapos nito ay labas na ng bahay.',
        'Ingat: ang **WLAN** ay **LAN pa rin** (wireless lang). Ang “W” doon ay Wireless, hindi Wide!',
      ],
      test: {
        question: 'Ano ang WLAN — LAN o WAN? At sa traceroute, ano ang hop 1?',
        answer: 'LAN pa rin (Wireless LAN). Hop 1 = default gateway mo (ang router, ang gate ng LAN).',
      },
    },
    { type: 'diagram', id: 'lan-wan', caption: 'Two LANs (HQ and branch) joined across a service provider’s WAN. Routers sit at the LAN/WAN boundary.' },
    {
      type: 'analogy',
      title: 'Subdivision and highway',
      taglish: ['Ang kalsada sa loob ng subdivision ay hawak ng homeowners’ association — LAN. Ang expressway papunta sa ibang siyudad ay gawa at hawak ng iba, at nagbabayad ka ng toll para gamitin — WAN. Hindi mo kontrolado ang kondisyon nito.'],
      body: [
        'Your subdivision’s streets belong to the homeowners’ association: you decide who enters and how it is maintained — that is the LAN. The expressway that links your subdivision to another city is built and operated by someone else — that is the WAN. You pay to use it, and you do not control its condition.',
      ],
    },
    {
      type: 'terms',
      items: [
        { term: 'LAN', definition: 'Local area network: one site, one owner, high speed.' },
        { term: 'WLAN', definition: 'A LAN that uses Wi-Fi (802.11) instead of cables.' },
        { term: 'WAN', definition: 'Connects LANs across wide distances, typically over a provider’s network.' },
        { term: 'SOHO', definition: 'Small office / home office: a small network, often one bundled router.' },
        { term: 'Campus', definition: 'A large LAN spanning several buildings in one area.' },
        { term: 'ISP', definition: 'Internet service provider: supplies WAN and internet connectivity.' },
        { term: 'Intranet', definition: 'A private network for one organisation.' },
        { term: 'Internet', definition: 'The global network of interconnected networks.' },
      ],
    },
    {
      type: 'flow',
      title: 'Following one request from a branch office',
      steps: [
        'A branch PC asks for a file on the head-office server.',
        'The PC sends the traffic to its default gateway — the branch router — because the server is not on the local LAN.',
        'The branch router forwards it onto the WAN link supplied by the provider.',
        'The provider’s network carries it to the head-office router.',
        'The head-office router forwards it onto the head-office LAN to the server.',
        'The reply retraces the trip. If the WAN link fails, the branch loses the server but local printers and PCs still talk to each other.',
      ],
    },
    {
      type: 'cli',
      title: 'Seeing the path out of your LAN',
      transcript: `C:\\> tracert 8.8.8.8

  1    <1 ms    <1 ms    <1 ms  192.168.1.1
  2     8 ms     7 ms     8 ms  100.64.0.1
  3    12 ms    11 ms    12 ms  203.0.113.5
  4    14 ms    13 ms    14 ms  dns.google [8.8.8.8]`,
      copyable: 'tracert 8.8.8.8',
      explain: [
        { line: 'tracert 8.8.8.8', why: 'Windows traceroute. On Cisco devices, macOS and Linux the command is “traceroute”.' },
        { line: 'Hop 1: 192.168.1.1', why: 'Your default gateway — the last device on your LAN. Everything after this is outside it.' },
        { line: 'Hops 2–3', why: 'Devices in your provider’s network: the WAN side.' },
        { line: 'Final hop', why: 'The destination. Hops that show “* * *” are usually devices that do not answer, not necessarily failures.' },
      ],
      note: 'Illustrative output. Your hops, addresses and timings will differ.',
    },
    { type: 'callout', kind: 'trap', text: 'WLAN and WAN sound alike but are different things. The “W” in WLAN means wireless (still a LAN). The “W” in WAN means wide.' },
    { type: 'callout', kind: 'trap', text: 'The internet is a WAN-style network, but “WAN” does not always mean the internet. A private leased line between two offices is a WAN that never touches the public internet.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Common mistakes',
      items: [
        'Defining a LAN purely by size. What matters is one site under one administrative control.',
        'Assuming you control the WAN. You control your equipment; the provider controls the path in between.',
        'Confusing intranet with internet: an intranet is private to one organisation.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting scenario: branch can print but cannot reach HQ',
      scenario: 'Users at a branch can use the local printer and each other’s shared folders, but every attempt to reach the head-office file server times out.',
      question: 'Which part of the design is the prime suspect?',
      answer: 'Local (LAN) traffic works, so the branch LAN is healthy. The failing traffic is the only traffic that must cross the WAN, so suspect the WAN link or the branch router’s WAN interface.',
      fix: 'On the branch router run “show ip interface brief” and check the WAN interface status. If it is down/down, escalate to the provider or check the cable and demarcation equipment.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge: label the boundary',
      prompt: 'A company has HQ in Manila, a branch in Davao, and staff working from home over VPN. Which links are LAN, which are WAN, and which device marks the boundary at each office?',
      answer: 'Each office’s internal network is a LAN. The Manila–Davao connection and each VPN tunnel run over WAN/internet infrastructure. The router (or firewall) at each site marks the LAN/WAN boundary.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'A router is the classic LAN/WAN boundary device.',
        'WAN links are typically provided by a service provider; LANs are owned by the organisation.',
        'SOHO networks use a single small device to do routing, switching and Wi-Fi.',
      ],
    },
    {
      type: 'summary',
      points: [
        'LAN = one site, one owner. WAN = distant sites, provider infrastructure.',
        'WLAN is still a LAN; it just uses radio.',
        'Intranet is private to one organisation; the internet is the global network of networks.',
        'The first hop in traceroute is the edge of your LAN.',
        'Next: the OSI model — a common language for what each part of the process does.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'easy', type: 'single',
    prompt: 'Which best describes a LAN?',
    choices: ['A network spanning several countries owned by a provider', 'A high-speed network in a limited area under one administration', 'The global public network of networks', 'A network that only uses wireless'], correct: [1],
    explanation: 'A LAN covers a limited area — such as one building — and is managed by one organisation.',
    wrong: { 0: 'That describes a WAN.', 2: 'That is the internet.', 3: 'A WLAN is wireless, but a LAN can be wired.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'easy', type: 'single',
    prompt: 'A company connects its Manila and Cebu offices using a service provider’s network. What type of network is the link between them?',
    choices: ['LAN', 'WLAN', 'WAN', 'PAN'], correct: [2],
    explanation: 'Connecting geographically separate LANs through a provider is a WAN.',
    wrong: { 0: 'Each office is a LAN; the connection between them is not.', 1: 'WLAN means wireless LAN.', 3: 'A PAN is a personal-area network like Bluetooth.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'easy', type: 'single',
    prompt: 'What is an intranet?',
    choices: ['The public internet', 'A private network for one organisation', 'A wireless network', 'A connection between two ISPs'], correct: [1],
    explanation: 'An intranet uses internet technologies but is private to one organisation.',
    wrong: { 0: 'The public internet is open to everyone.', 2: 'Wireless is a medium, not an access model.', 3: 'ISP interconnection is an internet-exchange concept.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'medium', type: 'single',
    prompt: 'Which device normally marks the boundary between a LAN and a WAN?',
    choices: ['Layer 2 switch', 'Router', 'Hub', 'Patch panel'], correct: [1],
    explanation: 'The router connects the local network to the WAN link.',
    wrong: { 0: 'A Layer 2 switch works entirely inside one LAN.', 2: 'A hub is a repeater inside a LAN.', 3: 'A patch panel is passive cabling.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: a WLAN is a type of WAN because it uses radio.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'A WLAN is a LAN that uses wireless. “Wide” in WAN refers to distance and provider infrastructure, not to radio.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'medium', type: 'single',
    prompt: 'A branch’s local printer works but the HQ file server times out. Which is the best first suspect?',
    choices: ['The branch printer', 'The WAN link or WAN interface', 'A switch port used by a single PC', 'The keyboard on the server'], correct: [1],
    explanation: 'Only the traffic that must cross the WAN is failing, so the WAN link or the router’s WAN interface is the best first suspect.',
    wrong: { 0: 'The printer works.', 2: 'One PC’s port would not explain all users failing.', 3: 'Irrelevant to network reachability.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'easy', type: 'single',
    prompt: 'What does SOHO stand for?',
    choices: ['Secure Office Host Operations', 'Small Office / Home Office', 'Switched Optical Hub Output', 'Service Oriented Hosting'], correct: [1],
    explanation: 'SOHO networks are small and often use one device that combines routing, switching and Wi-Fi.',
    wrong: { 0: 'Not a networking term.', 2: 'Not a networking term.', 3: 'Not a networking term.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: LAN vs WAN?', back: 'LAN = Loob (isang lugar, ikaw ang may-hawak). WAN = Wala sa loob (malayo, inuupahan, Wide). Router = gate. WLAN = LAN pa rin.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'definition', front: 'What is a LAN?', back: 'A high-speed network in a limited area, such as one building, under one administrative control.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'definition', front: 'What is a WAN?', back: 'A network that connects LANs across wide distances, typically using a service provider’s infrastructure.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'definition', front: 'WLAN vs WAN?', back: 'WLAN = wireless LAN (still local). WAN = wide-area network (distance/provider).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'definition', front: 'Intranet vs internet?', back: 'An intranet is private to one organisation; the internet is the global network of networks.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'definition', front: 'What device usually sits at the LAN/WAN boundary?', back: 'A router.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'definition', front: 'What is SOHO?', back: 'Small office / home office — a small network, often built around one combined device.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'command', front: 'Which command shows the hops a packet takes to a destination?', back: 'traceroute (tracert on Windows).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Trace the path out of your LAN',
  tool: 'Your computer',
  minutes: 15,
  objective: 'Use traceroute to find where your LAN ends and your provider’s network begins.',
  steps: [
    'Open Command Prompt (Windows) or a terminal (macOS/Linux).',
    'Run ipconfig (or ip route / netstat -rn) and note your default gateway address.',
    'Run tracert 8.8.8.8 (Windows) or traceroute 8.8.8.8 (macOS/Linux).',
    'Compare hop 1 with your default gateway. They should match.',
    'Circle the hops that belong to your LAN and the hops that belong to your provider or beyond.',
    'Look at the first address that is not private (not 10.x, 172.16–31.x or 192.168.x). That is usually the first device on the public side.',
  ],
  checklist: [
    'Default gateway recorded',
    'Hop 1 matches the default gateway',
    'LAN hops and WAN hops are marked separately',
    'You can name the boundary device',
  ],
  hints: [
    'If every hop after the first says “Request timed out”, some providers do not answer traceroute. Try a different destination like 1.1.1.1.',
    'Some home connections show a provider address in the private-looking 100.64.0.0/10 range (carrier-grade NAT). That is still the provider’s side.',
  ],
  solution: [
    'Hop 1 is your router: the LAN/WAN boundary device.',
    'Hop 2 onwards is provider or internet infrastructure (WAN side).',
    'If hop 1 is not your gateway, you may be behind an extra router, VPN or virtual adapter.',
  ],
  breakIt: 'Turn off your Wi-Fi, connect to a phone hotspot, and run the same trace. The first hop and provider hops change — but the idea (LAN edge, then provider) does not.',
};
