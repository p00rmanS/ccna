import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'fhrp';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.13',
  domain: 'D3',
  title: 'First-Hop Redundancy: HSRP, VRRP and GLBP',
  description: 'How a pair of routers share one virtual gateway address so hosts keep working when the primary gateway fails.',
  whyMatters:
    'Ang default gateway ay iisang address sa bawat PC. Kung mamatay ang router na iyon, mawawalan ng labasan ang buong LAN — kahit may pangalawang router. Ang FHRP ang sagot: isang virtual IP na ibinabahagi ng dalawang router. Sa exam, tinatanong ang konsepto, ang pagkakaiba ng HSRP, VRRP at GLBP, at ang mga termino tulad ng active/standby.',
  objectives: [
    'Explain the default gateway single point of failure and how a virtual IP solves it',
    'Describe how active and standby routers share a virtual IP and virtual MAC',
    'Compare HSRP (Cisco), VRRP (open standard) and GLBP (Cisco, load balancing)',
    'Explain priority, preemption and failover behaviour',
    'Read a basic HSRP configuration and verify it with show standby',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['FHRP', 'HSRP', 'VRRP', 'GLBP', 'virtual IP', 'active', 'standby', 'priority', 'preempt', 'show standby', 'default gateway', 'failover'],
  examObjectives: ['3.5'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Every PC has one default gateway address. If that router dies, the PCs have nowhere to send traffic even if a second router is sitting right there. First-hop redundancy protocols fix this: two routers share one virtual IP address, and the PCs use that virtual address as their gateway.',
        'One router is active and answers for the virtual IP. The other is on standby and listens. If the active router stops sending hellos, the standby takes over the same virtual IP and MAC, and the PCs notice nothing.',
      ],
      taglish: [
        'Bawat PC ay may **isang default gateway address**. Kapag **namatay ang router na iyon**, **walang mapupuntahan ang trapiko** kahit **may pangalawang router sa tabi**. Ang **FHRP** ang ayos: **dalawang router ang nagbabahagi ng iisang virtual IP**, at **ang virtual IP na iyon ang gateway ng mga PC**.',
        '**Isang router ang active** at **sumasagot para sa virtual IP**. Ang **isa ay standby** at **nakikinig**. Kapag **huminto ang hello ng active**, **kinukuha ng standby ang parehong virtual IP at MAC**, at **walang napapansin ang mga PC**.',
        'Tatlong protocol: **HSRP** (**Cisco**, active/standby), **VRRP** (**open standard**, master/backup), **GLBP** (**Cisco**, **may load balancing** sa maraming router).',
        'Mahalagang salita: **virtual IP**, **virtual MAC**, **priority** (mataas ang panalo, default 100), **preempt** (aagawin ang active kapag mas mataas ang priority).',
      ],
      technical: [
        'The default gateway is a single point of failure. An FHRP presents a virtual router made of two or more physical routers. Hosts are configured with the virtual IP as their gateway and ARP for it; the active router replies with the virtual MAC, so failover does not change what hosts have cached.',
        'HSRP (Cisco): active and standby routers (plus listening routers); hellos every 3 seconds, hold time 10 seconds; virtual MAC 0000.0C07.ACxx (xx = group number) for HSRPv1, 0000.0C9F.Fxxx for v2; default priority 100; preempt is off by default; groups 0–255 (v1) or 0–4095 (v2); multicast 224.0.0.2 (v1) or 224.0.0.102 (v2). VRRP (RFC 5798): master and backup; virtual MAC 0000.5E00.01xx; multicast 224.0.0.18; preemption on by default; the master may own the virtual IP.',
        'GLBP (Cisco): one Active Virtual Gateway (AVG) answers ARP requests with different virtual MACs of Active Virtual Forwarders (AVFs), so several routers forward traffic at once, giving load balancing as well as redundancy. HSRP and VRRP use only one forwarding router per group (load sharing needs multiple groups, for example one per VLAN).',
        'Election and tracking: the router with the highest priority becomes active (ties: highest IP address). With standby preempt, a recovering higher-priority router takes the active role back. Interface tracking (standby <group> track <interface> decrement <n>) lowers the priority when an uplink fails so the other router takes over, avoiding a black hole when the LAN side is up but the WAN is down.',
        'Configuration (HSRP): interface <if> → ip address <real IP> → standby version 2 → standby 1 ip <virtual IP> → standby 1 priority 110 → standby 1 preempt. Verification: show standby (state, active/standby routers, virtual IP and MAC, priority, preempt) and show standby brief. Hosts use the virtual IP as the default gateway.',
      ],
    },
    {
      type: 'story',
      title: 'Ang Gabing Namatay ang Router',
      paragraphs: [
        'Alas-onse ng gabi, **nawalan ng kuryente ang isang closet** sa opisina nina Aling Nena. Doon nakalagay ang **R1**, ang **gateway ng buong LAN**. Pagkatapos ng ilang segundo, **hindi pa rin nawala ang internet** ng cashier. Nagulat si Aling Nena. "Anong nangyari? Hindi ba namatay ang router?"',
        'Ngumiti si Kuya Jun. "Meron po kasing **dalawang router, R1 at R2**, at **iisa ang pinapakilala nilang gateway: 192.168.1.254**. Hindi po iyon totoong router, **virtual IP po iyon**. Si **R1 ang active**, si **R2 ang standby**. Bawat **3 segundo**, **nagpapadala sila ng hello sa isa\'t isa**."',
        'Nang **mawalan ng kuryente ang R1**, **huminto ang hello nito**. Pagkatapos ng **10 segundo (hold time)**, **sinabi ni R2: "Ako na muna ang active."** **Kinuha niya ang virtual IP at virtual MAC**. **Hindi nagbago ang gateway ng mga PC**, kaya **tuloy ang trabaho**.',
        'Kinaumagahan, **bumalik ang R1**. Dahil **naka-preempt** at **mas mataas ang priority nito (110 vs 100)**, **kinuha niya ulit ang active role**. "Parang **bantay na pumalit saglit**, saka bumalik ang tunay na bantay," sabi ni Kuya Jun.',
      ],
      moral: '**FHRP = iisang virtual gateway, dalawang router.** **Active** ang sumasagot, **standby** ang kapalit. **Priority** ang nagpapasya, at **preempt** ang nagbabalik ng mas mataas na priority.',
    },
    {
      type: 'analogy',
      title: 'Dalawang guwardiya, iisang pangalan',
      body: [
        'Two guards work the same gate under the same name tag. Visitors ask for "Gate Keeper" and never need to know which guard is on duty. If the one on duty collapses, the other puts on the same name tag and carries on.',
      ],
      taglish: [
        'Dalawang guwardiya ang **nagtatrabaho sa iisang gate sa ilalim ng iisang name tag**. Ang mga bisita ay **humahanap ng "Gate Keeper"** at **hindi na kailangang malaman kung sino ang naka-duty**. Kapag **bumagsak ang naka-duty**, **isinusuot ng isa ang parehong name tag** at **nagpapatuloy**.',
      ],
    },
    {
      type: 'hook',
      title: 'VPA: Virtual IP, Priority, Active/Standby',
      trick: '**HSRP** = Cisco, **active/standby**, priority **100**, hello **3s**/hold **10s**. **VRRP** = open standard, **master/backup**. **GLBP** = **load balance**. Gateway ng PC = **virtual IP**.',
      taglish: [
        '**HSRP**: Cisco, **active/standby**, default **priority 100**, **hello 3s, hold 10s**, preempt **off** bilang default.',
        '**VRRP**: **open standard**, **master/backup**, preempt **on**.',
        '**GLBP**: Cisco, **may load balancing** (AVG at AVF).',
        'Ang **gateway ng PC** ay ang **virtual IP**, hindi ang totoong IP ng router.',
      ],
      test: {
        question: 'Aling FHRP ang open standard, at alin ang Cisco na kayang mag-load balance? Anong IP ang ilalagay sa default gateway ng PC?',
        answer: 'VRRP ang open standard; GLBP ang Cisco na may load balancing. Ang default gateway ng PC ay ang virtual IP ng FHRP group.',
      },
    },
    { type: 'diagram', id: 'fhrp-virtual-gateway', caption: 'Dalawang router ang bumubuo ng isang virtual gateway; ang PC ay gumagamit ng virtual IP.' },
    {
      type: 'terms',
      items: [
        { term: 'FHRP', definition: 'First-hop redundancy protocol: lets routers share a virtual gateway so hosts survive a router failure.' },
        { term: 'Virtual IP / MAC', definition: 'The shared gateway address and its MAC that hosts use; answered by the active router.' },
        { term: 'HSRP', definition: 'Cisco proprietary; active and standby routers; default priority 100.' },
        { term: 'VRRP', definition: 'Open-standard FHRP with master and backup routers.' },
        { term: 'GLBP', definition: 'Cisco FHRP that also load balances across several routers.' },
        { term: 'Priority', definition: 'Value that decides which router is active (higher wins).' },
        { term: 'Preempt', definition: 'Lets a higher-priority router take over the active role when it returns.' },
        { term: 'Interface tracking', definition: 'Lowers the priority when a tracked interface fails, so another router takes over.' },
      ],
    },
    {
      type: 'cli',
      title: 'Basic HSRP sa dalawang router',
      transcript: `R1(config)# interface gi0/0
R1(config-if)# ip address 192.168.1.2 255.255.255.0
R1(config-if)# standby version 2
R1(config-if)# standby 1 ip 192.168.1.254
R1(config-if)# standby 1 priority 110
R1(config-if)# standby 1 preempt
R2(config-if)# ip address 192.168.1.3 255.255.255.0
R2(config-if)# standby version 2
R2(config-if)# standby 1 ip 192.168.1.254
R1# show standby brief
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Gi0/0       1    110 P Active  local           192.168.1.3     192.168.1.254`,
      copyable: 'standby 1 ip 192.168.1.254',
      explain: [
        { line: 'standby 1 ip 192.168.1.254', why: 'Defines HSRP group 1 and the shared virtual gateway IP. Hosts use 192.168.1.254.' },
        { line: 'standby 1 priority 110', why: 'R1 outranks R2 (default 100), so R1 becomes active.' },
        { line: 'standby 1 preempt', why: 'If R1 fails and returns, it takes the active role back.' },
        { line: 'standby version 2', why: 'Selects HSRP version 2 (more groups, IPv6 support).' },
        { line: 'Active local / Standby 192.168.1.3', why: 'R1 is active; R2 at 192.168.1.3 is the standby.' },
      ],
      note: 'Sample output for study.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show standby brief', shows: 'Group, priority, preempt flag, state, active and standby routers and the virtual IP.' },
        { command: 'show standby', shows: 'Detailed state, timers, virtual MAC, and tracking.' },
        { command: 'ping 192.168.1.254 (from a PC)', shows: 'Whether the virtual gateway answers.' },
        { command: 'show ip interface brief', shows: 'The real interface addresses used alongside the virtual IP.' },
      ],
      good: 'One router Active, the other Standby, and the PC reaches the virtual IP.',
      bad: 'Both routers Active (hello path broken) or no router Active, or hosts using a real IP instead of the virtual IP.',
    },
    {
      type: 'flow',
      title: 'Sundan: failover ng virtual gateway',
      steps: [
        'Naka-set ang PC na gateway = virtual IP 192.168.1.254.',
        'Ang R1 (active) ang sumasagot sa ARP gamit ang virtual MAC.',
        'Nagpapadala ng hello ang R1 at R2 bawat 3 segundo.',
        'Nabigo ang R1; humihinto ang hello nito.',
        'Pagkatapos ng hold time (10 segundo), nagiging active ang R2 at kinukuha ang virtual IP at MAC.',
        'Tuloy ang trapiko ng PC nang hindi nagbabago ang gateway; kung may preempt, babawiin ito ng R1 pagbalik.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **gateway ng PC ay ang VIRTUAL IP**, hindi ang totoong IP ng R1 o R2. Kapag **real IP ang inilagay**, **walang saysay ang redundancy**.' },
    { type: 'callout', kind: 'trap', text: '**HSRP = Cisco**; **VRRP = open standard**; **GLBP = Cisco na may load balancing**. At ang **preempt ay naka-off bilang default sa HSRP**, kaya **hindi agad bumabalik** ang mas mataas na priority.' },
    { type: 'callout', kind: 'tip', text: 'Para sa **load sharing sa HSRP**, gumamit ng **dalawang group**: R1 active sa VLAN 10 at R2 active sa VLAN 20. Ang **GLBP** ay **awtomatikong nagbabahagi**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Paglalagay ng totoong IP bilang gateway ng host.',
        'Paglimot sa preempt kaya hindi bumabalik ang mas mataas na priority.',
        'Pagkalito sa HSRP, VRRP at GLBP.',
        'Magkaibang group number o virtual IP sa dalawang router.',
        'Hindi pag-track ng uplink kaya nagiging black hole ang trapiko.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Parehong Active ang dalawang router"',
      scenario: 'Both routers claim to be Active for the same HSRP group and users get intermittent connectivity.',
      evidence: `R1# show standby brief
Gi0/0  1  110 P Active  local   unknown         192.168.1.254
R2# show standby brief
Gi0/0  1  100   Active  local   unknown         192.168.1.254`,
      question: 'Bakit parehong Active, at paano ito aayusin?',
      answer: 'Hindi nakikita ng dalawang router ang hello ng isa\'t isa (Standby = unknown): sira ang L2 path sa pagitan nila (switch/VLAN/ACL blocking 224.0.0.102 o mali ang VLAN).',
      fix: 'Ayusin ang L2 connectivity sa pagitan ng dalawang interface (parehong VLAN, trunk allowed, walang ACL na humaharang sa HSRP multicast). Pagkatapos ay dapat lumabas ang isa bilang Standby sa show standby brief.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Gusto mong si R1 ang active para sa VLAN 10 at si R2 para sa VLAN 20, para hindi nasasayang ang isang router. Paano gamit ang HSRP?',
      answer: 'Gumawa ng dalawang HSRP group: group 10 (VLAN 10) na priority 110 sa R1 at group 20 (VLAN 20) na priority 110 sa R2, may preempt. Bawat VLAN ay may sariling virtual IP; ang bawat router ay active sa isa at standby sa isa pa.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'FHRPs give hosts a virtual default gateway so a router failure is transparent.',
        'HSRP: Cisco, active/standby, priority 100, hello 3s hold 10s, preempt off by default.',
        'VRRP: open standard, master/backup. GLBP: Cisco, load balances.',
        'Hosts use the virtual IP as their gateway.',
        'Use tracking to lower priority when an uplink fails.',
      ],
    },
    {
      type: 'summary',
      points: [
        'The default gateway is a single point of failure that FHRPs remove.',
        'A virtual IP/MAC is owned by the active (or master) router.',
        'Priority and preempt decide who is active.',
        'HSRP and GLBP are Cisco; VRRP is the open standard.',
        'Susunod sa roadmap: QoS at wireless.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'easy', type: 'single',
    prompt: 'What problem does an FHRP solve?',
    choices: ['Slow switches', 'The default gateway as a single point of failure', 'IP address shortage', 'VLAN hopping'], correct: [1],
    explanation: 'An FHRP lets a second router take over the gateway role automatically.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'easy', type: 'single',
    prompt: 'Which FHRP is an open standard?',
    choices: ['HSRP', 'VRRP', 'GLBP', 'DTP'], correct: [1],
    explanation: 'VRRP is the open-standard FHRP; HSRP and GLBP are Cisco proprietary.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'medium', type: 'single',
    prompt: 'Which IP address should hosts use as their default gateway when HSRP is deployed?',
    choices: ['The active router interface IP', 'The standby router interface IP', 'The virtual IP of the HSRP group', 'The DNS server'], correct: [2],
    explanation: 'Hosts use the virtual IP so the gateway stays the same after failover.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'medium', type: 'single',
    prompt: 'What is the default HSRP priority?',
    choices: ['0', '1', '100', '255'], correct: [2],
    explanation: 'The default HSRP priority is 100; the higher priority becomes active.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'medium', type: 'single',
    prompt: 'Which FHRP provides load balancing across multiple routers within one group?',
    choices: ['HSRP', 'VRRP', 'GLBP', 'STP'], correct: [2],
    explanation: 'GLBP uses multiple virtual MACs so several routers forward traffic.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'hard', type: 'single',
    prompt: 'The higher-priority HSRP router fails and later recovers but does not become active again. What is the likely cause?',
    choices: ['Preempt is not configured', 'The wrong VLAN', 'The virtual IP is invalid', 'The standby router has no IP'], correct: [0],
    explanation: 'Without standby preempt, the current active router keeps the role.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'medium', type: 'single',
    prompt: 'Which command displays HSRP state, active and standby routers?',
    choices: ['show standby brief', 'show ip route', 'show vlan', 'show ip ospf'], correct: [0],
    explanation: 'show standby (brief) shows the HSRP state and roles.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are Cisco proprietary FHRPs?',
    choices: ['HSRP', 'VRRP', 'GLBP', 'LACP'], correct: [0, 2],
    explanation: 'HSRP and GLBP are Cisco proprietary; VRRP is open.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: with an FHRP, hosts must be reconfigured with a new gateway after a failover.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — the virtual IP and MAC stay the same, so hosts are unaffected.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: FHRP?', back: 'Virtual IP ang gateway ng PC. HSRP = Cisco active/standby (priority 100, hello 3s/hold 10s). VRRP = open standard master/backup. GLBP = load balancing. Preempt para bumalik ang mas mataas.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What is an FHRP?', back: 'Routers share a virtual gateway IP/MAC so hosts survive a gateway failure.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'HSRP vs VRRP vs GLBP?', back: 'HSRP: Cisco active/standby. VRRP: open standard master/backup. GLBP: Cisco with load balancing.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'command', front: 'Basic HSRP config?', back: 'standby version 2 · standby 1 ip <virtual IP> · standby 1 priority 110 · standby 1 preempt' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'concept', front: 'HSRP defaults?', back: 'Priority 100, preempt off, hello 3 s, hold 10 s.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'command', front: 'Verify HSRP?', back: 'show standby brief and show standby' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'HSRP failover',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Configure HSRP on two routers, test the virtual gateway and watch failover and preemption.',
  topology: 'PC1 — SW1 — R1 (192.168.1.2) and R2 (192.168.1.3); virtual gateway 192.168.1.254.',
  steps: [
    'Address the routers and configure HSRP group 1 with virtual IP 192.168.1.254.',
    'Give R1 priority 110 and preempt; leave R2 at the default.',
    'Set PC1 default gateway to 192.168.1.254 and ping beyond the LAN.',
    'Run show standby brief on both routers.',
    'Shut down R1 Gi0/0 and run a continuous ping from PC1; note the failover.',
    'Bring R1 back and observe it taking the active role back because of preempt.',
  ],
  checklist: [
    'R1 active and R2 standby before failure',
    'Ping recovers after failover',
    'R1 regains active with preempt',
  ],
  hints: [
    'Use the virtual IP as the PC gateway.',
    'Without preempt the old active router stays standby.',
  ],
  solution: [
    'R1 active (priority 110); R2 takes over on failure and R1 preempts on return.',
    'The PC never changes its gateway address.',
  ],
  breakIt: 'Remove standby preempt from R1 and repeat to see R2 stay active after R1 recovers.',
};
