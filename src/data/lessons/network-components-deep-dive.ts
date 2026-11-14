import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'network-components-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.1',
  domain: 'D1',
  title: 'Network Components Deep Dive: Switches, Firewalls, IPS, Controllers and PoE',
  description: 'Compare routers, Layer 2 and Layer 3 switches, NGFW and IPS, access points, controllers, endpoints, servers and the PoE standards, with where each sits in the network.',
  whyMatters:
    'Ito ang objective 1.1 ng opisyal na syllabus: ano ang ginagawa ng bawat device at saan ito inilalagay. Madalas itong lumabas bilang scenario (“aling device ang magfi-filter ng application traffic?”) at pagtutugma ng PoE standard sa wattage. Kabisaduhin ang ilang pagkakaiba at tapos na.',
  objectives: [
    'Compare router, Layer 2 switch and Layer 3 switch',
    'Describe NGFW and IPS functions and where they are placed',
    'Describe access points, WLCs and Cisco Catalyst Center (DNA Center)',
    'Identify endpoints and servers',
    'Match PoE standards to power levels and terms (PSE and PD)',
  ],
  estimatedMinutes: 35,
  difficulty: 'beginner',
  keywords: ['router', 'Layer 2 switch', 'Layer 3 switch', 'NGFW', 'IPS', 'access point', 'WLC', 'Catalyst Center', 'DNA Center', 'endpoint', 'server', 'PoE', '802.3af', '802.3at', '802.3bt', 'PSE', 'PD'],
  examObjectives: ['1.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Every device has a role. Routers connect networks. Layer 2 switches connect devices inside a network. Layer 3 switches also route between VLANs. Firewalls and IPS protect the network. Access points provide wireless access, controllers manage many devices from one place, and PoE supplies power over the data cable.',
      ],
      taglish: [
        'Bawat device ay may papel. **Router** = nag-uugnay ng magkakaibang network. **Layer 2 switch** = nag-uugnay ng device sa loob ng iisang network (MAC). **Layer 3 switch** = switch na nagro-route din sa pagitan ng VLAN. **Firewall at IPS** = nagpoprotekta. **Access point** = wireless na access. **Controller** = namamahala ng maraming device mula sa isang lugar. **PoE** = kuryente sa mismong data cable.',
        'Mga **endpoint** (PC, phone, printer, IoT) ang pinanggagalingan o pupuntahan ng data; ang **server** ang nagbibigay ng serbisyo (web, DHCP, DNS, file).',
        'Ang **NGFW (next-generation firewall)** ay firewall na may **application awareness, IPS, URL filtering at malware protection**. Ang **IPS** ay **nasa daan (inline)** at **humaharang** ng atake — iba sa IDS na nag-aalerto lang.',
      ],
      technical: [
        'A router forwards packets between IP networks using the routing table (Layer 3). A Layer 2 switch forwards frames using the MAC address table within a VLAN. A Layer 3 switch combines both: it switches within VLANs and routes between SVIs or routed ports in hardware, which is faster than a traditional router for inter-VLAN traffic.',
        'A next-generation firewall adds application visibility and control, user identity, integrated intrusion prevention, URL filtering and malware inspection to stateful filtering. An IPS is placed inline, inspects traffic against signatures and behaviour and can drop malicious packets; an IDS observes a copy of the traffic and only alerts. Firewalls are typically placed at the network edge and between zones; IPS functions may be in an NGFW or a dedicated sensor.',
        'Access points bridge wireless clients to the wired network; lightweight APs are managed by a WLC, while a controller such as Cisco Catalyst Center (formerly DNA Center) provides automation and assurance for wired and wireless networks. PoE standards: 802.3af (PoE, up to 15.4 W at the PSE, 12.95 W at the PD), 802.3at (PoE+, up to 30 W), 802.3bt (PoE++, Type 3 up to 60 W and Type 4 up to 90 W). The power source is the PSE (switch) and the powered device is the PD (phone, AP, camera).',
      ],
    },
    {
      type: 'analogy',
      title: 'Lungsod at checkpoint',
      body: [
        'A Layer 2 switch is a street within one village; a router is the road between villages; a Layer 3 switch is a street that also has a small junction for nearby villages. A firewall is a checkpoint that checks IDs, and an NGFW also checks what is inside the vehicle. An IPS is the guard who actually stops a suspicious vehicle.',
      ],
      taglish: [
        'Ang **Layer 2 switch** ay **kalye sa loob ng isang baryo**; ang **router** ay **daan sa pagitan ng mga baryo**; ang **Layer 3 switch** ay kalyeng may **maliit na sangandaan** para sa kalapit na baryo. Ang **firewall** ay **checkpoint na tumitingin ng ID**; ang **NGFW** ay sumisilip din **kung ano ang laman ng sasakyan**. Ang **IPS** ang guwardiyang **talagang humihinto** sa kahina-hinalang sasakyan.',
      ],
    },
    {
      type: 'hook',
      title: 'L2 MAC, L3 IP, NGFW app, IPS inline',
      trick: '**L2 switch = MAC. Router = IP. L3 switch = dalawa. NGFW = firewall + app + IPS. IPS = INLINE, humaharang (IDS = alerto lang). PoE: af 15.4W, at 30W, bt 60/90W.**',
      taglish: [
        '**L2 switch** = MAC table; **router** = routing table; **L3 switch** = pareho.',
        '**NGFW** = stateful firewall + **application control** + **IPS** + URL/malware.',
        '**IPS** = inline, **humaharang**; **IDS** = kopya lang, **nag-aalerto**.',
        '**PoE**: **af = 15.4 W**, **at (PoE+) = 30 W**, **bt = 60 W (Type 3) / 90 W (Type 4)**. **PSE** = nagbibigay (switch); **PD** = tumatanggap (phone/AP).',
      ],
      test: {
        question: 'Anong device ang kailangan mo para magpatupad ng application-aware policy at humarang ng atake sa gitna ng daan?',
        answer: 'NGFW (may IPS) na naka-inline. Ang IDS ay hindi sapat dahil nag-aalerto lang ito.',
      },
    },
    { type: 'interactive', id: 'guess-device', caption: 'Subukan: alin sa mga device ang magagawa ang gawain? Router, switch, firewall o AP?' },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Router, Layer 2 switch at Layer 3 switch',
      paragraphs: [
        'Ang **Layer 2 switch** ay nagpapasa ng frame batay sa **MAC address table** at limitado sa loob ng VLAN. Hindi ito nagro-route; kailangan ng router o Layer 3 switch para sa pagitan ng VLAN.',
        'Ang **router** ay nagpapasa ng packet batay sa **routing table** (Layer 3), nag-uugnay ng iba’t ibang network (LAN–WAN) at humaharang ng broadcast. Ang **Layer 3 switch** ay may **SVI** (`interface vlan 10`) at `ip routing`, kaya nagro-route sa pagitan ng VLAN sa hardware — mas mabilis at karaniwan sa campus.',
        'Panuntunan: sa loob ng VLAN = switching; sa pagitan ng VLAN/network = routing. Ang router ay mas maraming WAN feature (NAT, VPN, WAN interface); ang Layer 3 switch ay mas maraming port at bilis sa LAN.',
      ],
      steps: [
        'Kung nasa parehong VLAN/subnet: switch gamit ang MAC.',
        'Kung ibang subnet: ipasa sa default gateway (router o L3 switch).',
        'Ang router/L3 switch ay maghahanap sa routing table at ipapasa sa susunod na hop.',
      ],
      tricks: [
        'Kapag “inter-VLAN routing sa mabilis na paraan” → Layer 3 switch.',
        'Kapag “nag-uugnay sa ISP/WAN” → router.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: NGFW, IPS, AP at controllers',
      paragraphs: [
        'Ang **tradisyonal na firewall** ay nagfi-filter batay sa address at port (stateful). Ang **NGFW** ay nagdadagdag ng **application visibility** (alam kung ito ay Facebook o Webex), **user identity**, **integrated IPS**, URL filtering at malware protection. Ang **IPS** ay inilalagay **inline** para makahadlang ng atake gamit ang signature at behavior; ang **IDS** ay tumitingin lang sa kopya ng trapiko (SPAN) at nag-aalerto. Karaniwang lugar: sa **edge** (internet), sa pagitan ng **zones** (hal. DMZ) at sa data center.',
        'Ang **access point (AP)** ay nag-uugnay ng wireless client sa wired network. Ang **WLC (Wireless LAN Controller)** ay namamahala ng maraming lightweight AP. Ang **Cisco Catalyst Center (dating DNA Center)** ay **controller para sa buong campus** (wired at wireless): automation, policy at assurance.',
        'Ang **endpoint** ay anumang device ng user o IoT (laptop, phone, printer, camera). Ang **server** ay nagbibigay ng serbisyo (web, file, DNS, DHCP, email). Sa diagram, ang server ay madalas nasa data center o DMZ.',
      ],
      steps: [
        'Edge: NGFW/IPS sa pagitan ng internet at LAN.',
        'DMZ: mga public server sa hiwalay na zone.',
        'Access: AP at endpoint.',
        'Management: WLC at Catalyst Center para sa sentral na kontrol.',
      ],
      tricks: [
        'IPS = inline (humaharang); IDS = out-of-band (nag-aalerto).',
        'Catalyst Center at DNA Center ay iisang produkto (bagong pangalan).',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 3: PoE',
      paragraphs: [
        'Ang **PoE (Power over Ethernet)** ay nagpapadala ng kuryente at data sa iisang UTP cable. Ang **PSE (Power Sourcing Equipment)** ay ang nagbibigay (PoE switch o injector); ang **PD (Powered Device)** ay ang tumatanggap (IP phone, AP, camera).',
        'Mga standard: **802.3af (PoE)** hanggang **15.4 W** sa PSE (12.95 W sa PD); **802.3at (PoE+)** hanggang **30 W**; **802.3bt (PoE++)** hanggang **60 W (Type 3)** at **90 W (Type 4)**. Ang power budget ng switch ay may hangganan: ang kabuuang wattage ng lahat ng port ay hindi dapat lampas dito.',
        'Pag-verify: `show power inline` (power budget at nagagamit na power bawat port). Ang LLDP/CDP ay maaaring magbahagi ng power requirement ng PD. Kapag kulang ang power budget, ang ibang PD ay hindi makakakuha ng kuryente.',
      ],
      steps: [
        'Ikonekta ang PD sa PoE-capable na port.',
        'Nagde-detect ang PSE at nagbibigay ng kuryente ayon sa klase.',
        'show power inline para makita ang budget at gamit.',
        'Pumili ng switch na may sapat na power budget para sa lahat ng PD.',
      ],
      tricks: [
        'Para matandaan: af = 15, at = 30, bt = 60 at 90.',
        'Mas mataas na wattage = mas mabigat na device (PTZ camera, AP na maraming radio).',
      ],
    },
    {
      type: 'remember',
      title: 'Network components na lumalabas sa exam',
      items: [
        '**L2 switch = MAC at VLAN; router = IP; L3 switch = pareho (SVI + ip routing).**',
        '**NGFW = stateful firewall + application control + IPS + URL/malware.** **IPS = inline at humaharang; IDS = alerto lang.**',
        '**WLC = namamahala ng lightweight AP; Catalyst Center (DNA Center) = campus controller para sa automation at assurance.**',
        '**PoE: 802.3af 15.4 W, 802.3at 30 W, 802.3bt 60 W at 90 W.** **PSE = nagbibigay; PD = tumatanggap.**',
        '**Endpoint = user/IoT device; server = nagbibigay ng serbisyo.**',
      ],
    },
    {
      type: 'terms',
      items: [
        { term: 'Layer 3 switch', definition: 'A switch that also routes between VLANs in hardware using SVIs.' },
        { term: 'NGFW', definition: 'Next-generation firewall with application control, integrated IPS and malware protection.' },
        { term: 'IPS', definition: 'Intrusion prevention system placed inline that can block malicious traffic.' },
        { term: 'WLC', definition: 'Wireless LAN controller that manages lightweight access points.' },
        { term: 'Catalyst Center', definition: 'Cisco controller (formerly DNA Center) for campus automation and assurance.' },
        { term: 'PSE', definition: 'Power sourcing equipment: the device that supplies PoE.' },
        { term: 'PD', definition: 'Powered device: the device that receives PoE.' },
      ],
    },
    {
      type: 'flow',
      title: 'Saan napupunta ang bawat device',
      steps: [
        'Access: endpoint, AP at PoE switch.',
        'Distribution/core: Layer 3 switches para sa routing.',
        'Edge: router at NGFW/IPS papunta sa internet.',
        'DMZ: mga server na naa-access sa publiko.',
        'Management: WLC at Catalyst Center na namamahala sa lahat.',
      ],
    },
    {
      type: 'cli',
      title: 'PoE at Layer 3 switching',
      transcript: `SW1# show power inline
Available:370.0(w)  Used:15.4(w)  Remaining:354.6(w)
Interface  Admin  Oper   Power(W)  Device
Gi1/0/5    auto   on     15.4      IP Phone
SW1(config)# ip routing
SW1(config)# interface vlan 10
SW1(config-if)# ip address 192.168.10.1 255.255.255.0`,
      copyable: 'show power inline\nip routing\ninterface vlan 10\nip address 192.168.10.1 255.255.255.0',
      explain: [
        { line: 'show power inline', why: 'Shows the PoE budget and the power delivered to each port.' },
        { line: 'ip routing', why: 'Turns a Layer 3 switch into a router for IP so that it routes between its SVIs.' },
        { line: 'interface vlan 10', why: 'Creates the SVI that acts as the default gateway for VLAN 10.' },
      ],
      note: 'The exact power values depend on the switch model.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **IDS** ay hindi humaharang; **IPS** lang ang humaharang dahil nasa inline ito. Madalas itong palitan sa tanong.' },
    { type: 'callout', kind: 'trap', text: 'Ang **Layer 2 switch** ay hindi nagro-route sa pagitan ng VLAN kahit gaano pa kabilis; kailangan ng Layer 3 switch o router.' },
    { type: 'callout', kind: 'tip', text: 'Isulat ang apat na PoE standard sa papel sa simula ng exam: af 15.4, at 30, bt 60 / 90.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Confusing IDS (alerts) with IPS (blocks).',
        'Expecting a Layer 2 switch to route between VLANs.',
        'Mixing up PSE and PD.',
        'Forgetting the PoE power budget of the switch.',
        'Treating Catalyst Center and a WLC as the same device.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Hindi bumubukas ang ikalimang AP',
      scenario: 'A 24-port PoE switch powers cameras and access points. A newly connected AP does not power on, although the port is up and the cable is good.',
      evidence: `SW1# show power inline
Available:370.0(w)  Used:368.0(w)  Remaining:2.0(w)`,
      question: 'Ano ang malamang na dahilan?',
      answer: 'The switch has used almost its whole PoE budget (368 of 370 W). The new AP needs more than the remaining 2 W, so it cannot be powered.',
      fix: 'Free power budget (remove or power a device by another means), use a switch with a larger PoE budget, or add a PoE injector. Verify with show power inline.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Itugma: (a) 90 W na camera na may heater, (b) karaniwang IP phone na 7 W, (c) AP na nangangailangan ng 25 W. Anong PoE standard ang kailangan ng bawat isa (minimum)?',
      answer: '(a) 802.3bt Type 4 (up to 90 W). (b) 802.3af (up to 15.4 W). (c) 802.3at PoE+ (up to 30 W).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'IPS is inline and blocks; IDS only alerts.',
        'Layer 3 switch = switching + routing with SVIs.',
        'NGFW adds application control and IPS to stateful filtering.',
        'PoE: af 15.4 W, at 30 W, bt 60/90 W.',
        'Catalyst Center (DNA Center) is the campus controller.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Routers route, Layer 2 switches switch, Layer 3 switches do both.',
        'NGFW and IPS protect the network inline.',
        'WLC manages APs; Catalyst Center manages the campus.',
        'Endpoints consume services provided by servers.',
        'PoE powers PDs from PSEs with defined wattages.',
        'Susunod: device management access.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'single',
    prompt: 'Which device can route between VLANs in hardware using SVIs?',
    choices: ['Layer 2 switch', 'Layer 3 switch', 'Hub', 'Access point'], correct: [1],
    explanation: 'A Layer 3 switch switches and routes between VLANs using SVIs.',
    wrong: { 0: 'A Layer 2 switch does not route.', 2: 'A hub is a Layer 1 repeater.', 3: 'An AP bridges wireless to wired.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'single',
    prompt: 'What distinguishes an IPS from an IDS?',
    choices: ['An IPS is placed inline and can block traffic', 'An IDS blocks traffic and an IPS only alerts', 'They are identical', 'An IPS works only on wireless'], correct: [0],
    explanation: 'An IPS sits inline and can drop malicious traffic; an IDS only monitors and alerts.',
    wrong: { 1: 'It is the reverse.', 2: 'They differ in placement and action.', 3: 'IPS is not limited to wireless.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'single',
    prompt: 'Which PoE standard supports up to 30 W?',
    choices: ['802.3af', '802.3at', '802.3bt Type 4', '802.1Q'], correct: [1],
    explanation: '802.3at (PoE+) supports up to 30 W.',
    wrong: { 0: '802.3af provides up to 15.4 W.', 2: 'Type 4 provides up to 90 W.', 3: '802.1Q is VLAN tagging.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'hard', type: 'single',
    prompt: 'Which statement describes a next-generation firewall?',
    choices: ['It filters only on MAC addresses', 'It combines stateful filtering with application control and integrated IPS', 'It is a Layer 1 repeater', 'It replaces every switch'], correct: [1],
    explanation: 'An NGFW adds application visibility, user identity, IPS and malware protection to stateful filtering.',
    wrong: { 0: 'That is Layer 2 filtering.', 2: 'A repeater has no inspection.', 3: 'It does not replace switching.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: the PSE is the device that supplies power in PoE.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'The power sourcing equipment (a PoE switch or injector) supplies power to the powered device.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are controllers in Cisco networks?',
    choices: ['Wireless LAN Controller (WLC)', 'Cisco Catalyst Center (DNA Center)', 'Layer 2 switch', 'Hub'], correct: [0, 1],
    explanation: 'The WLC manages APs and Catalyst Center manages the campus. Switches and hubs are not controllers.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: L2, L3, NGFW, IPS, PoE?', back: 'L2 switch = MAC. Router = IP. L3 switch = dalawa. NGFW = firewall + app + IPS. IPS = inline, humaharang. PoE: af 15.4W, at 30W, bt 60/90W.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Layer 2 vs Layer 3 switch?', back: 'Layer 2 switches frames by MAC; Layer 3 also routes between VLANs.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'concept', front: 'IPS vs IDS?', back: 'IPS is inline and blocks; IDS monitors and alerts.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What does an NGFW add?', back: 'Application control, user identity, integrated IPS, URL filtering and malware protection.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'concept', front: 'PoE standards and power?', back: '802.3af 15.4 W; 802.3at 30 W; 802.3bt 60 W and 90 W.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'concept', front: 'PSE vs PD?', back: 'PSE supplies power; PD receives it.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'concept', front: 'WLC vs Catalyst Center?', back: 'WLC manages APs; Catalyst Center (DNA Center) manages the campus with automation and assurance.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Place the right device',
  tool: 'Paper',
  minutes: 25,
  objective: 'Choose and place network components in a small campus and calculate a PoE budget.',
  steps: [
    'Draw a small campus with 30 users, 10 IP phones, 6 APs, 4 cameras, a server farm and an internet link.',
    'Place an access switch, a Layer 3 switch, an edge router and an NGFW/IPS and explain each placement.',
    'Decide where the WLC and Catalyst Center would be placed.',
    'List each PoE device with its standard and wattage (phones 7 W, APs 25 W, cameras 15 W).',
    'Calculate the total PoE load and choose a switch budget that leaves 20% headroom.',
    'Explain in two sentences why an IPS must be inline and an IDS need not be.',
  ],
  checklist: [
    'Devices placed with reasons',
    'Controllers positioned',
    'PoE total calculated',
    'IPS vs IDS explained',
  ],
  hints: [
    'Total PoE = sum of all powered devices.',
    'Layer 3 switches route between VLANs; the edge router connects to the ISP.',
  ],
  solution: [
    'Load: 10×7 + 6×25 + 4×15 = 70 + 150 + 60 = 280 W; with 20% headroom about 336 W.',
    'An NGFW/IPS sits at the edge between the router and the internal network.',
    'An IPS must be in the traffic path to block it; an IDS only needs a copy.',
  ],
  breakIt: 'Add 10 more APs to your design and recalculate whether the switch budget is still enough.',
};
