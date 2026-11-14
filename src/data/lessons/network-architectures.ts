import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'network-architectures';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.2',
  domain: 'D1',
  title: 'Network Architectures: Two-Tier, Three-Tier, Spine-Leaf, WAN, SOHO and Cloud',
  description: 'Compare campus and data centre designs, WAN options, SOHO networks and on-premises versus cloud deployment, and know when each is used.',
  whyMatters:
    'Ito ang objective 1.2 ng opisyal na syllabus at madalas itong lumabas bilang pagkilala sa diagram: “anong architecture ito?” Walang configuration dito; pagkilala at paghahambing lang. Madali kapag alam mo ang hugis ng bawat isa.',
  objectives: [
    'Describe the access, distribution and core layers',
    'Compare two-tier (collapsed core) with three-tier campus designs',
    'Describe the spine-leaf data centre topology and why it is used',
    'Compare WAN connection types and describe a SOHO network',
    'Compare on-premises and cloud deployment (IaaS, PaaS, SaaS, hybrid)',
  ],
  estimatedMinutes: 35,
  difficulty: 'beginner',
  keywords: ['two-tier', 'three-tier', 'collapsed core', 'spine-leaf', 'access layer', 'distribution layer', 'core layer', 'WAN', 'MPLS', 'SOHO', 'cloud', 'on-premises', 'IaaS', 'PaaS', 'SaaS', 'east-west'],
  examObjectives: ['1.2'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A campus network is usually built in layers: access (where users plug in), distribution (policy and routing between VLANs) and core (fast backbone). Small campuses merge distribution and core into one layer, called two-tier or collapsed core.',
        'A data centre uses spine-leaf, where every leaf switch connects to every spine switch. Branches connect over a WAN, and applications may run on-premises or in the cloud.',
      ],
      taglish: [
        'Ang **campus network** ay karaniwang may mga layer: **access** (saan nagsasaksak ang user), **distribution** (policy at routing sa pagitan ng VLAN) at **core** (mabilis na backbone). Ang maliit na campus ay pinagsasama ang distribution at core: **two-tier o collapsed core**. Ang buong anyo ay **three-tier**.',
        'Ang **data center** ay gumagamit ng **spine-leaf**: **bawat leaf ay konektado sa bawat spine**. Ang mga branch ay kumokonekta sa pamamagitan ng **WAN**, at ang application ay pwedeng nasa **on-premises** o sa **cloud**.',
        'Dalawang direksyon ng trapiko: **north-south** (papasok o palabas ng data center) at **east-west** (server papunta sa server sa loob). Ang spine-leaf ay para sa dami ng **east-west**.',
      ],
      technical: [
        'Three-tier hierarchy: the access layer connects endpoints and applies port-level features (VLANs, port security, PoE); the distribution layer aggregates access switches, applies policy (ACLs, QoS) and routes between VLANs; the core layer provides high-speed, highly available transport between distribution blocks. A two-tier design (collapsed core) combines distribution and core, which reduces cost and cabling for small and medium sites.',
        'Spine-leaf: every leaf switch connects to every spine switch, leaf switches never connect to each other and spines never connect to each other. Servers attach to leaves. Any server-to-server path crosses exactly one spine (leaf–spine–leaf), giving predictable latency and equal-cost multipath for east-west traffic. Layer 3 routing to the leaf removes the need for STP blocking.',
        'WAN options include leased lines, MPLS/Metro Ethernet from a provider, broadband internet with VPN, and cellular as backup; SD-WAN adds centralised policy over several transports. A SOHO network often uses one device that combines router, switch, firewall and AP. Cloud service models: IaaS (virtual infrastructure), PaaS (platform for apps) and SaaS (finished application); hybrid mixes on-premises and cloud.',
      ],
    },
    {
      type: 'analogy',
      title: 'Gusali at siyudad',
      body: [
        'A three-tier campus is like a company building: each floor has its own office switchboard (access), each wing has a supervisor (distribution) and a main highway connects the wings (core). Spine-leaf is like a data centre where every aisle connects directly to every main corridor, so any two racks are the same distance apart.',
      ],
      taglish: [
        'Ang **three-tier campus** ay parang **gusali ng kompanya**: bawat palapag ay may sariling **switchboard (access)**, bawat pakpak ay may **supervisor (distribution)** at may **highway (core)** na nag-uugnay sa mga pakpak. Ang **spine-leaf** ay parang data center na **bawat pasilyo ay diretsong nakakabit sa bawat pangunahing koridor**, kaya pareho ang layo ng alinmang dalawang rack.',
      ],
    },
    {
      type: 'hook',
      title: 'ADC at LS',
      trick: '**ADC = Access, Distribution, Core (3-tier). Two-tier = Access + Collapsed Core. SPINE-LEAF = bawat leaf sa bawat spine, walang leaf-leaf.**',
      taglish: [
        '**ADC**: **A**ccess (user), **D**istribution (policy, inter-VLAN), **C**ore (bilis).',
        '**Two-tier** = **walang hiwalay na core**: ang distribution at core ay isa.',
        '**Spine-leaf**: **leaf ↔ spine** lang; **walang leaf-leaf, walang spine-spine**.',
        '**SaaS = tapos na app; PaaS = platform; IaaS = imprastraktura**.',
      ],
      test: {
        question: 'Ilang spine ang daraanan ng trapiko mula server sa Leaf 1 papunta sa server sa Leaf 2?',
        answer: 'Isang spine lang: Leaf 1 → Spine → Leaf 2. Pareho ang bilang ng hops para sa lahat ng pares ng leaf.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Three-tier at two-tier na campus',
      paragraphs: [
        '**Access layer**: dito kumokonekta ang PC, phone, AP at printer. Mga feature: VLAN, port security, PoE, PortFast. **Distribution layer**: pinagsasama ang maraming access switch, nagpapatupad ng **policy (ACL, QoS)** at nagro-route sa pagitan ng VLAN (inter-VLAN routing) at nagbibigay ng redundancy. **Core layer**: napakabilis na backbone na nag-uugnay sa mga distribution block; ang prayoridad ay bilis at availability, **hindi** policy.',
        'Sa **two-tier (collapsed core)**, ang distribution at core ay nasa iisang pares ng switch. Mas mura at mas simple, bagay sa maliit hanggang katamtamang site. Kapag lumaki ang campus at dumami ang gusali, lumilipat sa three-tier.',
        'Redundancy: bawat access switch ay karaniwang may dalawang uplink papunta sa dalawang distribution/core switch. Kaya mahalaga ang STP/EtherChannel (o routed access) para iwasan ang loop at gamitin ang parehong link.',
      ],
      steps: [
        'Access: kumukonekta ang mga endpoint (VLAN, PoE, port security).',
        'Distribution: aggregation, policy at inter-VLAN routing.',
        'Core: mabilis na transport sa pagitan ng mga distribution block.',
        'Two-tier: pagsamahin ang distribution at core sa iisang layer.',
        'Idagdag ang redundant uplinks at FHRP para sa gateway.',
      ],
      tricks: [
        'Kapag ang tanong ay “aling layer ang nagpapatupad ng ACL at QoS?”, distribution ang sagot.',
        'Kapag may “collapsed core”, two-tier iyon.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Spine-leaf at ang pagkakaiba sa campus',
      paragraphs: [
        'Ang mga server sa data center ay madalas nag-uusap sa isa’t isa (**east-west**). Sa three-tier, ang trapiko ay umaakyat at bumababa sa mga layer, at ang bilang ng hops ay nag-iiba. Sa **spine-leaf**, ang bawat server-to-server path ay dumadaan sa **isang spine lang**, kaya **pareho at predictable ang latency**.',
        'Mga katangian: **bawat leaf ay konektado sa bawat spine**; ang mga server ay nasa leaf; ang **spine ay hindi konektado sa ibang spine**; ang leaf ay hindi konektado sa ibang leaf. Madaling palakihin: dagdag na leaf = dagdag na server port; dagdag na spine = dagdag na bandwidth. Karaniwang **Layer 3 (ECMP)** ang paggamit kaya walang naka-block na link tulad ng STP.',
        'Paghahambing: **campus** = para sa user at mga endpoint (north-south, access/distribution/core); **data center spine-leaf** = para sa server at east-west.',
      ],
      steps: [
        'Maglagay ng mga leaf switch na may mga server.',
        'Ikonekta ang bawat leaf sa bawat spine.',
        'Huwag ikonekta ang leaf sa leaf o spine sa spine.',
        'Gumamit ng Layer 3 routing at ECMP para magamit ang lahat ng link.',
      ],
      tricks: [
        'Palatandaan ng spine-leaf sa diagram: parang “parihabang lambat” ng crossing links.',
        'Dagdag na spine = mas maraming bandwidth; dagdag na leaf = mas maraming port.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 3: WAN, SOHO at on-premises vs cloud',
      paragraphs: [
        '**WAN**: **leased line** (pribadong punto-sa-punto, mahal pero maaasahan), **MPLS/Metro Ethernet** (provider network para sa maraming site), **broadband internet + VPN** (mura, gamit ang public internet), **cellular** (backup). Ang **SD-WAN** ay central na pamamahala ng policy sa ilang uri ng link.',
        '**SOHO**: maliit na opisina o bahay; kadalasan **isang device** na router + switch + firewall + AP na nakakonekta sa ISP. Walang core/distribution; isa lang ang “layer”.',
        '**On-premises**: sarili mong kagamitan at data center; kontrolado mo ang lahat, ikaw rin ang gumastos at nagmementena. **Cloud**: nirerentahan: **IaaS** (virtual na server/network), **PaaS** (platform para sa app), **SaaS** (tapos na application, hal. email). **Hybrid** = pinaghalo. Ang cloud ay nagdadala ng flexibility at mas kaunting pamumuhunan sa hardware pero may mga isyu sa seguridad, gastos at koneksyon.',
      ],
      steps: [
        'Tukuyin ang pangangailangan: laki ng site, budget at availability.',
        'Pumili ng WAN: leased line, MPLS/Metro Ethernet o broadband + VPN.',
        'Para sa SOHO: iisang integrated na router/switch/AP.',
        'Pumili ng deployment: on-premises, cloud (IaaS/PaaS/SaaS) o hybrid.',
      ],
      tricks: [
        'IaaS = ikaw ang bahala sa OS at app; SaaS = gagamitin mo lang.',
        'Kapag “maliit na opisina, isang device”, SOHO ang sagot.',
      ],
    },
    {
      type: 'remember',
      title: 'Network architecture na lumalabas sa exam',
      items: [
        '**Three-tier: access (endpoint), distribution (policy, inter-VLAN), core (mabilis na backbone).** **Two-tier = collapsed core.**',
        '**Spine-leaf: bawat leaf sa bawat spine; walang leaf-leaf o spine-spine; isang spine lang sa pagitan ng dalawang leaf.**',
        '**Spine-leaf = data center / east-west; campus = north-south, tatlong layer.**',
        '**WAN: leased line, MPLS/Metro Ethernet, broadband + VPN, SD-WAN.** **SOHO = isang integrated na device.**',
        '**IaaS, PaaS, SaaS; hybrid = on-premises + cloud.**',
      ],
    },
    { type: 'diagram', id: 'network-tiers', caption: 'Three-tier, two-tier at spine-leaf.' },
    {
      type: 'terms',
      items: [
        { term: 'Access layer', definition: 'The layer where endpoints connect to the network.' },
        { term: 'Distribution layer', definition: 'The layer that aggregates access switches and applies policy and inter-VLAN routing.' },
        { term: 'Core layer', definition: 'The high-speed backbone that connects distribution blocks.' },
        { term: 'Collapsed core', definition: 'A two-tier design that merges the distribution and core layers.' },
        { term: 'Spine-leaf', definition: 'A data centre design in which every leaf connects to every spine and nothing else.' },
        { term: 'East-west traffic', definition: 'Server-to-server traffic inside a data centre.' },
        { term: 'SOHO', definition: 'Small office/home office network, usually built around one integrated device.' },
      ],
    },
    {
      type: 'flow',
      title: 'Pagpili ng architecture',
      steps: [
        'Maliit na site o bahay: SOHO na may isang integrated device.',
        'Maliit hanggang katamtamang campus: two-tier (collapsed core).',
        'Malaking campus na maraming gusali: three-tier.',
        'Data center na maraming east-west traffic: spine-leaf.',
        'Mga malalayong site: pumili ng WAN (leased line, MPLS, broadband + VPN).',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Sa **spine-leaf**, **walang link sa pagitan ng dalawang leaf** at **walang link sa pagitan ng dalawang spine**. Ang mga ito ay madalas na pagkakamali sa diagram na tanong.' },
    { type: 'callout', kind: 'trap', text: 'Ang **core layer ay hindi para sa policy** (ACL, QoS); mas bagay ang distribution. Ang core ay para sa bilis at availability.' },
    { type: 'callout', kind: 'tip', text: 'Kapag nakakita ng diagram, bilangin ang layer at tingnan kung may crossing links: tatlong patong = three-tier; dalawa = two-tier; crossing mesh = spine-leaf.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Connecting leaf switches to each other in a spine-leaf design.',
        'Putting policy enforcement in the core instead of distribution.',
        'Thinking a two-tier design has no redundancy.',
        'Confusing IaaS, PaaS and SaaS.',
        'Assuming a SOHO network needs separate router, switch and firewall boxes.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Maling pagkaka-draw ng spine-leaf',
      scenario: 'A junior engineer drew a data centre design where Leaf 1 connects to Spine 1 only, Leaf 2 connects to Spine 2 only, and the two spines are connected to each other.',
      evidence: `Leaf1 -- Spine1 -- Spine2 -- Leaf2
(no Leaf1-Spine2 link, no Leaf2-Spine1 link)`,
      question: 'Ano ang mali kumpara sa spine-leaf?',
      answer: 'Each leaf must connect to every spine, and spines must not connect to each other. The drawing creates a chain with extra hops and a single point of failure.',
      fix: 'Connect Leaf 1 and Leaf 2 to both spines and remove the spine-to-spine link. Every leaf-to-leaf path then crosses exactly one spine.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang kompanya ay may 4 leaf at 2 spine sa data center. Ilang link ang kailangan sa pagitan ng leaf at spine, at ilang spine ang daraanan ng server-to-server na trapiko sa magkaibang leaf?',
      answer: '4 leaves × 2 spines = 8 links. Server-to-server traffic between different leaves crosses exactly one spine.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Access, distribution, core are the three tiers.',
        'Two-tier means collapsed core.',
        'Spine-leaf: full mesh between leaves and spines only.',
        'IaaS, PaaS, SaaS describe cloud service models.',
        'SOHO usually uses one integrated device.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Three-tier campus: access, distribution, core.',
        'Two-tier merges distribution and core.',
        'Spine-leaf suits east-west data centre traffic.',
        'WAN options include leased line, MPLS/Metro Ethernet and broadband with VPN.',
        'Cloud models: IaaS, PaaS, SaaS, with hybrid combinations.',
        'Susunod: network components at device management access.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'easy', type: 'single',
    prompt: 'Which layer of the three-tier campus model connects end-user devices?',
    choices: ['Core', 'Distribution', 'Access', 'Spine'], correct: [2],
    explanation: 'The access layer is where endpoints connect to the network.',
    wrong: { 0: 'The core is the backbone.', 1: 'The distribution layer aggregates access switches.', 3: 'Spine belongs to spine-leaf.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'medium', type: 'single',
    prompt: 'What is a collapsed core (two-tier) design?',
    choices: ['Access and distribution merged', 'Distribution and core merged', 'Core and access merged', 'A design with no switches'], correct: [1],
    explanation: 'A collapsed core combines the distribution and core layers.',
    wrong: { 0: 'Access normally remains separate.', 2: 'The access layer connects endpoints.', 3: 'Switches are still used.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'medium', type: 'single',
    prompt: 'In a spine-leaf topology, which statement is correct?',
    choices: ['Leaf switches connect to each other', 'Every leaf connects to every spine', 'Spines connect to each other', 'Servers connect to spines'], correct: [1],
    explanation: 'Each leaf has a link to every spine; there are no leaf-leaf or spine-spine links.',
    wrong: { 0: 'There are no leaf-to-leaf links.', 2: 'There are no spine-to-spine links.', 3: 'Servers connect to leaf switches.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'hard', type: 'single',
    prompt: 'Why is spine-leaf well suited to data centres with heavy server-to-server traffic?',
    choices: ['It has a single path for all traffic', 'Each leaf-to-leaf path has the same number of hops and multiple equal paths', 'It uses only Layer 1 devices', 'It removes the need for servers'], correct: [1],
    explanation: 'Every path crosses one spine, giving predictable latency and equal-cost multipath.',
    wrong: { 0: 'It has many equal paths.', 2: 'It uses Layer 2/3 switches.', 3: 'Servers are still required.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a SOHO network typically uses one integrated device that acts as router, switch, firewall and access point.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'SOHO networks commonly use a single multifunction device supplied by or connected to the ISP.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.2', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are cloud service models?',
    choices: ['IaaS', 'SaaS', 'WLAN', 'VRF'], correct: [0, 1],
    explanation: 'IaaS and SaaS (and PaaS) are cloud service models. WLAN and VRF are not.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: ADC at spine-leaf?', back: 'ADC = Access, Distribution, Core. Two-tier = collapsed core. Spine-leaf = bawat leaf sa bawat spine, walang leaf-leaf.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What does each campus layer do?', back: 'Access: endpoints. Distribution: aggregation, policy, inter-VLAN. Core: fast backbone.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What is a collapsed core?', back: 'A two-tier design that merges distribution and core.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Spine-leaf rules?', back: 'Every leaf connects to every spine; no leaf-leaf or spine-spine links.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What is east-west traffic?', back: 'Server-to-server traffic inside a data centre.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'concept', front: 'IaaS vs PaaS vs SaaS?', back: 'Infrastructure, platform, finished application as a service.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Common WAN options?', back: 'Leased line, MPLS/Metro Ethernet, broadband internet with VPN, cellular backup, SD-WAN.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Draw and classify network designs',
  tool: 'Paper',
  minutes: 25,
  objective: 'Draw three-tier, two-tier and spine-leaf designs, count links and choose a design for given scenarios.',
  steps: [
    'Draw a three-tier campus with 2 core, 2 distribution and 4 access switches; connect each access switch to both distribution switches.',
    'Redraw it as a two-tier collapsed core with the same access switches.',
    'Draw a spine-leaf design with 2 spines and 4 leaves and count the links.',
    'For each of five scenarios (home office, 20-person office, university with many buildings, data centre, branch with 5 users) choose a design.',
    'Write which WAN option you would choose for each branch and why.',
    'Classify five services as on-premises, IaaS, PaaS or SaaS.',
  ],
  checklist: [
    'Three designs drawn correctly',
    'Spine-leaf link count correct',
    'Scenarios matched to designs',
    'Cloud models classified',
  ],
  hints: [
    'Spine-leaf links = leaves × spines.',
    'A single integrated device suggests a SOHO design.',
  ],
  solution: [
    'Spine-leaf with 2 spines and 4 leaves has 8 links.',
    'Home office: SOHO; 20-person office: two-tier; university: three-tier; data centre: spine-leaf.',
    'Email = SaaS; virtual servers = IaaS; app hosting platform = PaaS.',
  ],
  breakIt: 'Add a leaf-to-leaf link to your spine-leaf drawing and explain what it does to the equal-hop property.',
};
