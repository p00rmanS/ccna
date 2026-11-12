import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'controller-sdn';

export const lesson: Lesson = {
  id: ID,
  moduleId: '6.2',
  domain: 'D6',
  title: 'Controller-Based Networking and SDN: Planes, APIs, Underlay and Overlay',
  description: 'Compare traditional and controller-based networks, separate the control, data and management planes, and describe northbound and southbound APIs, underlay, overlay and fabric.',
  whyMatters:
    'Ang SDN ay puno ng mga salitang kailangang tamang-tama ang kahulugan: plane, northbound, southbound, underlay, overlay, fabric. Sa exam, ang mga tanong ay halos laging pagtutugma ng salita sa kahulugan. Dito natin sila gagawing malinaw.',
  objectives: [
    'Define the data, control and management planes',
    'Compare traditional and controller-based networks',
    'Distinguish northbound and southbound APIs',
    'Explain underlay, overlay and fabric',
    'Describe the role of a network controller such as Cisco Catalyst Center',
  ],
  estimatedMinutes: 40,
  difficulty: 'exam',
  keywords: ['SDN', 'control plane', 'data plane', 'management plane', 'northbound API', 'southbound API', 'underlay', 'overlay', 'fabric', 'controller', 'Catalyst Center', 'DNA Center', 'OpenFlow', 'NETCONF', 'RESTCONF'],
  examObjectives: ['6.2', '6.3'],
  sections: [
    {
      type: 'explain',
      simple: [
        'In a traditional network every device has its own control plane and is configured one by one. In a controller-based network a central controller holds the intelligence and pushes policy to the devices.',
        'The devices still forward traffic (the data plane). The controller decides and configures.',
      ],
      taglish: [
        'Sa **traditional network**, bawat device ay may **sariling control plane** at isa-isang kino-configure. Sa **controller-based network**, may **sentral na controller** na may “utak” at ito ang nagtutulak ng polisiya sa mga device.',
        'Ang mga device ay **nagpapasa pa rin ng trapiko** (data plane). Ang controller ang **nagpapasya at nagko-configure**.',
        'Tatlong plane: **Data plane** = pagpapasa ng packet. **Control plane** = pagpapasya kung saan ipapasa (routing, MAC table, ARP). **Management plane** = pag-configure at pagmo-monitor (SSH, SNMP, syslog).',
      ],
      technical: [
        'The data plane forwards frames and packets using tables built by the control plane. The control plane builds those tables (routing protocols, STP, ARP/NDP). The management plane covers configuration and monitoring access such as SSH, SNMP, NETCONF and syslog.',
        'In SDN the control plane is centralised in a controller. Applications use the northbound API (typically REST) to request services from the controller; the controller uses southbound APIs (OpenFlow, NETCONF, RESTCONF, SNMP, CLI) to program the devices.',
        'An underlay is the physical network and its routing that provides IP reachability. An overlay is a virtual network built on top of the underlay using tunnels (for example VXLAN). A fabric is the combined underlay and overlay treated as one logical network. Cisco Catalyst Center (formerly DNA Center) is a controller for campus automation and assurance.',
      ],
    },
    {
      type: 'analogy',
      title: 'Airport control tower',
      body: [
        'Planes (packets) fly on their own (data plane), but a control tower (controller) tells each of them where to go. Airlines (applications) talk to the tower through a service window (northbound API), and the tower talks to each aircraft by radio (southbound API).',
      ],
      taglish: [
        'Ang mga **eroplano (packets)** ay lumilipad nang mag-isa (**data plane**), pero ang **control tower (controller)** ang nagsasabi kung saan sila pupunta. Ang mga **airline (applications)** ay kumakausap sa tower sa **bintana ng serbisyo (northbound API)**, at ang tower ay kumakausap sa bawat eroplano sa **radyo (southbound API)**.',
      ],
    },
    {
      type: 'hook',
      title: 'Taas = North, Baba = South',
      trick: '**NORTH = pataas sa apps (REST). SOUTH = pababa sa devices (NETCONF, OpenFlow). Data = pasa, Control = desisyon, Management = config.**',
      taglish: [
        '**Northbound API**: controller ↔ **applications** (pataas). Karaniwang **REST**.',
        '**Southbound API**: controller ↔ **network devices** (pababa). Halimbawa: **NETCONF, RESTCONF, OpenFlow, CLI/SNMP**.',
        '**Data / Control / Management**: pasa, desisyon, config.',
        '**Underlay** = pisikal na network. **Overlay** = virtual na network sa ibabaw (tunnel). **Fabric** = ang dalawa bilang isa.',
      ],
      test: {
        question: 'Alin ang northbound at alin ang southbound: ang REST API na ginagamit ng script, at ang NETCONF papunta sa switch?',
        answer: 'Ang REST na ginagamit ng script ay northbound (controller ↔ app). Ang NETCONF papunta sa switch ay southbound (controller ↔ device).',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Ang tatlong plane sa totoong halimbawa',
      paragraphs: [
        'Kapag may frame na dumating sa switch at inihanap nito ang MAC sa table at ipinasa sa tamang port — iyon ay **data plane**. Kapag natutunan ng switch ang MAC o kapag nagpalitan ang mga router ng OSPF LSA para buuin ang routing table — iyon ay **control plane**. Kapag nag-SSH ka para mag-configure o nag-SNMP poll — iyon ay **management plane**.',
        'Sa traditional na device, ang tatlo ay nasa iisang kahon. Sa SDN, ang control plane (at karamihan ng management) ay inilipat sa controller; ang device ay nagiging mas “simple forwarder” na sumusunod sa mga rule na ibinigay.',
        'Ang malaking benepisyo ay ang **sentralisadong pananaw** at **programmability**: isang policy, maraming device, na may API para sa automation.',
      ],
      steps: [
        'Frame o packet dumating sa device.',
        'Data plane: hanapin sa forwarding table at ipasa.',
        'Control plane: gumagawa/nag-a-update ng table (OSPF, STP, ARP).',
        'Management plane: configuration at monitoring (SSH, SNMP, NETCONF, syslog).',
        'Sa SDN: ang controller ang nagtutulak ng mga table o policy.',
      ],
      tricks: [
        'Para makilala: tanungin “ito ba ay pagpapasa, pagpapasya o pag-configure?”',
        'Hindi mawawala ang data plane sa device kahit may controller — bumabagsak ang forwarding kung mawala ang device, hindi ang controller.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Underlay, overlay at fabric',
      paragraphs: [
        'Ang **underlay** ay ang pisikal na imprastraktura at ang IP routing nito (hal. OSPF sa mga link). Ang trabaho nito ay magbigay ng simpleng IP reachability sa pagitan ng mga device.',
        'Ang **overlay** ay virtual na network na itinatayo sa ibabaw ng underlay gamit ang **tunnel** (hal. VXLAN, GRE). Nagbibigay ito ng segmentation at flexibility na hindi nakadepende sa pisikal na topolohiya.',
        'Ang **fabric** ay ang buong sistema: underlay + overlay na pinamamahalaan bilang isang logical network. Halimbawa: Cisco SD-Access (campus fabric) na kinokontrol ng Catalyst Center. Ang **Catalyst Center** ay nagbibigay ng automation (pag-configure) at **assurance** (monitoring at analytics) mula sa isang dashboard at REST API.',
      ],
      steps: [
        'Underlay: pisikal na link + IP routing.',
        'Overlay: tunnel (hal. VXLAN) na nagdadala ng virtual networks.',
        'Fabric: underlay at overlay na pinamamahalaan ng controller.',
        'Controller: automation, policy at assurance.',
      ],
      tricks: [
        'Overlay = “sa ibabaw”, underlay = “sa ilalim” — literal na tulong sa memorya.',
        'Ang Cisco DNA Center ay ang dating pangalan ng Catalyst Center; maaaring lumabas ang alinman sa materyales.',
      ],
    },
    {
      type: 'remember',
      title: 'SDN na lumalabas sa exam',
      items: [
        '**Data plane = pagpapasa; control plane = pagpapasya; management plane = configuration/monitoring.**',
        '**Northbound = controller ↔ apps (REST); southbound = controller ↔ devices (NETCONF, RESTCONF, OpenFlow).**',
        '**Underlay = pisikal + IP routing; overlay = virtual tunnel; fabric = underlay + overlay.**',
        '**Controller-based = sentralisadong polisiya at automation.**',
        '**Cisco Catalyst Center (dating DNA Center) = controller para sa campus automation at assurance.**',
      ],
    },
    { type: 'diagram', id: 'sdn-planes', caption: 'Applications → northbound API → controller → southbound API → mga device.' },
    {
      type: 'terms',
      items: [
        { term: 'Data plane', definition: 'The part of a device that forwards traffic using its forwarding tables.' },
        { term: 'Control plane', definition: 'The part that builds the tables used for forwarding (routing protocols, STP, ARP).' },
        { term: 'Management plane', definition: 'Configuration and monitoring access to a device (SSH, SNMP, NETCONF).' },
        { term: 'Northbound API', definition: 'API between the controller and applications, usually REST.' },
        { term: 'Southbound API', definition: 'API between the controller and network devices (NETCONF, RESTCONF, OpenFlow).' },
        { term: 'Underlay', definition: 'The physical network and IP routing that provides reachability.' },
        { term: 'Overlay / fabric', definition: 'A virtual network built with tunnels over the underlay; the fabric is the managed combination.' },
      ],
    },
    {
      type: 'flow',
      title: 'Paano gumagana ang controller-based network',
      steps: [
        'Magsusumite ng intent ang administrator o application sa controller (northbound API).',
        'Isinasalin ng controller ang intent sa device configuration.',
        'Ipinapadala ng controller ang configuration gamit ang southbound API.',
        'Nagpapasa ng trapiko ang mga device ayon sa bagong policy (data plane).',
        'Nangongolekta ang controller ng telemetry para sa assurance.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Hindi ang **REST** ang southbound API; ito ang karaniwang **northbound**. Ang southbound ay NETCONF, RESTCONF, OpenFlow o CLI/SNMP.' },
    { type: 'callout', kind: 'trap', text: 'Ang controller ay hindi nagpapasa ng packets ng user. **Ang mga device pa rin** ang nagpapasa sa data plane.' },
    { type: 'callout', kind: 'tip', text: 'Gumuhit ng tatlong patong: apps (taas), controller (gitna), devices (baba), at lagyan ng “north” at “south” sa pagitan. Madali nang masagot.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Mixing up northbound and southbound APIs.',
        'Thinking the controller forwards user traffic.',
        'Confusing the underlay (physical) with the overlay (virtual).',
        'Believing the control plane and the management plane are the same.',
        'Assuming SDN removes the need for network devices.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Nawala ang controller',
      scenario: 'The SDN controller crashes. Users on the campus network can still browse, but no one can push new policy.',
      evidence: `Controller: unreachable
Switch: forwarding table populated, traffic flowing
New VLAN request: failed (controller offline)`,
      question: 'Bakit patuloy ang trapiko pero hindi makapagbago ng policy?',
      answer: 'The data plane lives on the devices and keeps forwarding with the existing tables. Only the controller (control and management functions) is gone, so new policy cannot be pushed.',
      fix: 'Restore or fail over the controller (use a clustered or redundant controller design). Existing traffic continues meanwhile; verify the devices re-synchronise when the controller returns.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Uriin ang tatlo: (a) isang script na tumatawag sa REST API ng controller, (b) controller na gumagamit ng NETCONF papunta sa switch, (c) OSPF na nag-uusap sa pagitan ng dalawang router. Anong API o plane ang bawat isa?',
      answer: '(a) Northbound API. (b) Southbound API. (c) Control plane (routing protocol exchange).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Northbound = apps; southbound = devices.',
        'REST is usually northbound.',
        'Underlay is physical/IP; overlay is virtual/tunnel.',
        'Data plane forwards, control plane decides, management plane configures.',
        'A controller centralises policy but does not forward user traffic.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Three planes: data, control, management.',
        'SDN centralises control in a controller.',
        'Northbound (apps) and southbound (devices) APIs.',
        'Underlay, overlay and fabric.',
        'Catalyst Center provides automation and assurance.',
        'Susunod: REST APIs at JSON.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D6', objective: '6.2', difficulty: 'easy', type: 'single',
    prompt: 'Which plane is responsible for forwarding frames and packets?',
    choices: ['Management plane', 'Control plane', 'Data plane', 'Application plane'], correct: [2],
    explanation: 'The data plane forwards traffic using the forwarding tables.',
    wrong: { 0: 'It handles configuration and monitoring.', 1: 'It builds the tables, not forward traffic.', 3: 'There is no application plane in this model.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D6', objective: '6.3', difficulty: 'medium', type: 'single',
    prompt: 'Which API connects a controller to applications, typically using REST?',
    choices: ['Southbound API', 'Northbound API', 'Eastbound API', 'Management API only'], correct: [1],
    explanation: 'Northbound APIs link the controller with applications and are usually REST-based.',
    wrong: { 0: 'Southbound connects to devices.', 2: 'Eastbound/westbound link controllers to each other.', 3: 'That is not the standard term for this link.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D6', objective: '6.3', difficulty: 'medium', type: 'single',
    prompt: 'Which of the following is a southbound protocol?',
    choices: ['REST', 'NETCONF', 'HTTP GET from a script', 'JSON'], correct: [1],
    explanation: 'NETCONF (with RESTCONF, OpenFlow, SNMP and CLI) is used between the controller and devices.',
    wrong: { 0: 'REST is typically northbound.', 2: 'A script calling the controller uses the northbound API.', 3: 'JSON is a data format, not an API direction.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D6', objective: '6.3', difficulty: 'medium', type: 'single',
    prompt: 'What is an overlay network?',
    choices: ['The physical cabling', 'A virtual network built over the underlay using tunnels', 'A routing protocol', 'A management VLAN'], correct: [1],
    explanation: 'An overlay uses tunnels such as VXLAN on top of the underlay to create virtual networks.',
    wrong: { 0: 'That describes the underlay.', 2: 'It is not a routing protocol.', 3: 'A management VLAN is a Layer 2 construct.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D6', objective: '6.2', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: in a controller-based network the controller forwards the user traffic.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'Devices still forward user traffic on the data plane; the controller configures and manages them.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D6', objective: '6.2', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO activities belong to the control plane?',
    choices: ['OSPF exchanging LSAs', 'Building the MAC address table', 'Forwarding a packet out an interface', 'An administrator logging in through SSH'], correct: [0, 1],
    explanation: 'Control plane functions build the tables (routing protocols, MAC learning). Forwarding is the data plane and SSH is the management plane.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Pro tip: north vs south sa SDN?', back: 'NORTH = pataas sa apps (REST). SOUTH = pababa sa devices (NETCONF, OpenFlow). Data = pasa, Control = desisyon, Management = config.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What are the three planes?', back: 'Data (forwarding), control (builds tables), management (configuration and monitoring).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Northbound API?', back: 'Controller to applications; typically REST.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Southbound API examples?', back: 'NETCONF, RESTCONF, OpenFlow, SNMP, CLI.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Underlay vs overlay?', back: 'Underlay: physical network and IP routing. Overlay: virtual network built with tunnels on top.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What is a fabric?', back: 'The underlay and overlay managed together as one logical network.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What is Cisco Catalyst Center?', back: 'A controller (formerly DNA Center) for campus automation and assurance.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Sort the planes and APIs',
  tool: 'Paper',
  minutes: 25,
  objective: 'Classify real network activities by plane and API direction and draw a controller-based architecture.',
  steps: [
    'Draw three boxes: Applications, Controller, Network devices. Label the arrow between the first two “northbound” and the arrow between the last two “southbound”.',
    'Write ten activities (OSPF hello, ARP, SSH login, forwarding a packet, SNMP poll, REST call from a script, NETCONF edit, STP BPDU, ACL match, syslog message).',
    'Classify each activity as data, control or management plane.',
    'Mark which API direction each programmable activity would use.',
    'Add an underlay and overlay sketch: physical links below, VXLAN tunnels above.',
    'Describe what continues to work if the controller fails.',
  ],
  checklist: [
    'Diagram labelled northbound and southbound',
    'Ten activities classified',
    'Underlay and overlay drawn',
    'Controller failure behaviour described',
  ],
  hints: [
    'Ask: does it forward, decide or configure?',
    'REST calls from applications use the northbound API.',
  ],
  solution: [
    'Data: forwarding a packet, ACL match. Control: OSPF hello, ARP, STP BPDU. Management: SSH login, SNMP poll, syslog, NETCONF edit.',
    'REST call from a script = northbound; NETCONF edit = southbound.',
    'When the controller fails, devices keep forwarding; only new policy changes stop.',
  ],
  breakIt: 'Describe how a flat network would behave if the controller were also the only forwarding element, and why SDN avoids that.',
};
