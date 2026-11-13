import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'hsrp-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.13',
  domain: 'D3',
  title: 'HSRP Deep Dive: Configuration, Priority, Preempt and Load Sharing',
  description: 'Configure HSRP, predict which router is active, tune priority, preemption and tracking, and read show standby output.',
  whyMatters:
    'Ang FHRP ay tungkol sa gateway na hindi bumabagsak. Sa exam, bibigyan ka ng configuration o show standby output at tatanungin kung sino ang active, ano ang virtual IP, at bakit hindi bumalik ang primary router. Ang mga sagot ay nasa priority, preempt at ang tamang virtual IP.',
  objectives: [
    'Configure HSRP version 1 and 2 with a virtual IP',
    'Predict the active router from priority and IP address',
    'Explain preempt and why it is off by default',
    'Use interface tracking to lower priority on uplink failure',
    'Read show standby and compare HSRP, VRRP and GLBP',
  ],
  estimatedMinutes: 40,
  difficulty: 'exam',
  keywords: ['HSRP', 'standby', 'virtual IP', 'priority', 'preempt', 'track', 'active', 'standby router', 'VRRP', 'GLBP', 'show standby', 'virtual MAC', 'default gateway'],
  examObjectives: ['3.5'],
  sections: [
    {
      type: 'explain',
      simple: [
        'HSRP gives hosts one virtual gateway address shared by two routers. One router is active and answers for the virtual IP; the other is standby and takes over if the active fails.',
        'Hosts never change their configuration during a failure, because the virtual IP and virtual MAC stay the same.',
      ],
      taglish: [
        'Ang **HSRP** ay nagbibigay sa mga host ng **isang virtual na gateway address** na pinagsasaluhan ng dalawang router. Ang **active** router ang sumasagot para sa virtual IP; ang **standby** ang pumapalit kapag bumagsak ang active.',
        'Hindi kailangang baguhin ng host ang configuration nila: **pareho pa rin ang virtual IP at virtual MAC** kahit magpalit ng active.',
        'Ang HSRP ay **Cisco proprietary**. Ang **VRRP** ay open standard; ang **GLBP** ay Cisco rin pero may **load balancing**.',
      ],
      technical: [
        'HSRP routers in a group exchange hellos (default 3 s, hold 10 s) to multicast 224.0.0.2 (v1) or 224.0.0.102 (v2) on UDP port 1985. The router with the highest priority (default 100) becomes active; ties are broken by the highest interface IP address. The virtual MAC is 0000.0C07.ACxx (v1) or 0000.0C9F.Fxxx (v2), where the last digits are the group number.',
        'Preemption is disabled by default: a router that recovers with a higher priority does not take over unless standby preempt is configured. Tracking (standby track) lowers the priority when a tracked interface goes down so that the other router becomes active.',
        'Compared with other protocols: VRRP (RFC 5798) uses master/backup, preempt is on by default and the virtual IP can be the physical address of the master; GLBP elects an AVG and shares traffic across several AVFs using multiple virtual MACs.',
      ],
    },
    {
      type: 'analogy',
      title: 'Hotline ng barangay',
      body: [
        'A barangay hotline number is answered by whichever officer is on duty. Residents always dial the same number. If the officer on duty falls ill, the standby takes over the phone and nobody changes the number they dial.',
      ],
      taglish: [
        'Ang **hotline ng barangay** ay sinasagot ng **opisyal na naka-duty**. Iisang numero ang tinatawagan ng lahat. Kapag nagkasakit ang naka-duty, ang **standby ang sasagot sa parehong numero** — walang binabago ang mga residente. Ang numero ay ang **virtual IP**.',
      ],
    },
    {
      type: 'hook',
      title: '100, mataas panalo, preempt OFF',
      trick: '**HSRP: default priority 100, pinakamataas ang active, tie = pinakamataas na IP. PREEMPT = OFF bilang default. Host gateway = VIRTUAL IP.**',
      taglish: [
        '**Priority**: default **100**; **pinakamataas ang active**; tie → **pinakamataas na interface IP**.',
        '**Preempt off** bilang default: kapag nakabalik ang dating active, hindi niya babawiin hangga’t hindi naka-`preempt`.',
        '**Hello 3s / hold 10s.** **Virtual MAC: 0000.0C07.ACxx** (v1).',
        '**Gateway ng host = virtual IP**, hindi ang IP ng alinmang router.',
      ],
      test: {
        question: 'Ang R1 (priority 110) ay nag-reload at bumalik. Bakit hindi na siya active ulit kahit mas mataas ang priority niya?',
        answer: 'Dahil naka-off ang preempt bilang default. Kailangang i-configure ang `standby 1 preempt` sa R1.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Configuration at halalan ng active',
      paragraphs: [
        'Sa R1: `interface g0/0`, `ip address 192.168.1.2 255.255.255.0`, `standby version 2`, `standby 1 ip 192.168.1.1`, `standby 1 priority 110`, `standby 1 preempt`. Sa R2: `ip address 192.168.1.3 255.255.255.0`, `standby version 2`, `standby 1 ip 192.168.1.1` (default priority 100).',
        'Resulta: R1 ang **active** (110 > 100); R2 ang **standby**. Ang mga host ay gumagamit ng **192.168.1.1** bilang gateway. Kapag nagkapareho ng priority, ang router na may **mas mataas na IP address** ang panalo (R2 sa halimbawa kung parehong 100).',
        'Ang group number ay dapat **pareho** sa magkabilang router, at pareho ang virtual IP. Ang bersyon ay dapat ding magkatugma (v1 at v2 ay hindi nakakapag-usap).',
      ],
      steps: [
        'Ibigay sa bawat router ang sariling IP sa LAN.',
        'standby version 2 (opsyonal pero inirerekomenda).',
        'standby <group> ip <virtual IP> sa parehong router.',
        'standby <group> priority <n> at standby <group> preempt sa router na dapat maging active.',
        'show standby brief para i-verify.',
      ],
      tricks: [
        'Ang virtual IP ay dapat nasa parehong subnet ng mga interface ng router pero hindi pareho ng alinman.',
        'Isulat ang table: Router | Priority | IP | Active? para hulaan ang resulta sa exam.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Preempt, tracking at failover',
      paragraphs: [
        'Kapag bumagsak ang active, ang standby ay magiging active pagkalipas ng hold time (10 s default) — maaaring paikliin gamit ang `standby 1 timers msec 200 msec 750`. Ang bumalik na R1 ay hindi babawi ng active kung walang `preempt`.',
        'Para sa uplink failure: `standby 1 track gigabitEthernet 0/1 20` ay ibinababa ang priority ng 20 kapag bumagsak ang uplink interface, kaya ang R1 (110 → 90) ay matatalo ng R2 (100) at magiging active ang R2. Kailangan ang `preempt` sa R2 para kusang kunin ang pagiging active.',
        'Para sa load sharing: gumawa ng dalawang group (VLAN 10: R1 active; VLAN 20: R2 active) para magamit ang parehong router.',
      ],
      steps: [
        'Bumagsak ang active → walang hello sa hold time.',
        'Ang standby ay nagiging active at sumasagot sa virtual IP/MAC.',
        'Bumalik ang dating active → walang preempt = nananatili ang bago.',
        'Sa tracking: bumaba ang priority kapag bumagsak ang uplink.',
        'Preempt sa router na may mas mataas na priority para bumalik ito.',
      ],
      tricks: [
        'Ang tracking ay walang epekto kung hindi naka-on ang preempt sa router na dapat pumalit.',
        'Kapag may dalawang VLAN, gumamit ng dalawang group para ma-load share.',
      ],
    },
    {
      type: 'remember',
      title: 'HSRP na lumalabas sa exam',
      items: [
        '**HSRP default priority 100; pinakamataas ang active; tie = pinakamataas na IP.**',
        '**Preempt ay OFF bilang default.** **Hello 3s, hold 10s.**',
        '**Host gateway = virtual IP.** **Pareho dapat ang group number at version sa dalawang router.**',
        '**HSRP = Cisco proprietary; VRRP = open standard (master/backup); GLBP = Cisco, may load balancing.**',
        '**standby track = ibinababa ang priority kapag bumagsak ang tracked interface.**',
      ],
    },
    { type: 'diagram', id: 'fhrp-virtual-gateway', caption: 'Dalawang router, isang virtual gateway.' },
    {
      type: 'terms',
      items: [
        { term: 'Active router', definition: 'The HSRP router that currently answers for the virtual IP and forwards the traffic.' },
        { term: 'Standby router', definition: 'The backup that takes over if the active router fails.' },
        { term: 'Virtual IP', definition: 'The shared gateway address that hosts use.' },
        { term: 'Priority', definition: 'Value 0–255 (default 100) used to elect the active router.' },
        { term: 'Preempt', definition: 'Lets a higher-priority router take over the active role.' },
        { term: 'Tracking', definition: 'Lowering priority when a monitored interface goes down.' },
        { term: 'Virtual MAC', definition: 'MAC address associated with the virtual IP, based on the group number.' },
      ],
    },
    {
      type: 'flow',
      title: 'Failover sa HSRP',
      steps: [
        'Pumili ng active (priority, tie = IP) at standby; nagpapalitan ng hello.',
        'Ang mga host ay gumagamit ng virtual IP bilang gateway.',
        'Bumagsak ang active: wala nang hello sa loob ng hold time.',
        'Ang standby ay nagiging active at sumasagot para sa virtual IP at MAC.',
        'Sa preempt, ang mas mataas na priority ay babawi kapag bumalik.',
      ],
    },
    {
      type: 'cli',
      title: 'HSRP sa dalawang router',
      transcript: `R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ip address 192.168.1.2 255.255.255.0
R1(config-if)# standby version 2
R1(config-if)# standby 1 ip 192.168.1.1
R1(config-if)# standby 1 priority 110
R1(config-if)# standby 1 preempt
R1(config-if)# standby 1 track gigabitEthernet 0/1 20
R1# show standby brief
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Gi0/0       1    110 P Active  local           192.168.1.3     192.168.1.1`,
      copyable: 'interface gigabitEthernet 0/0\nip address 192.168.1.2 255.255.255.0\nstandby version 2\nstandby 1 ip 192.168.1.1\nstandby 1 priority 110\nstandby 1 preempt\nstandby 1 track gigabitEthernet 0/1 20\nshow standby brief',
      explain: [
        { line: 'standby 1 ip 192.168.1.1', why: 'Defines the virtual gateway address for group 1; hosts use this as their default gateway.' },
        { line: 'standby 1 priority 110', why: 'Makes R1 win the active election over a default-priority router (100).' },
        { line: 'standby 1 preempt', why: 'Allows R1 to take back the active role when it recovers.' },
        { line: 'standby 1 track gigabitEthernet 0/1 20', why: 'Lowers R1’s priority by 20 if the uplink goes down so R2 becomes active.' },
      ],
      note: 'In show standby brief, a P in the Pri column means preempt is configured.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **preempt ay hindi naka-on** bilang default sa HSRP. Kaya ang router na may mas mataas na priority ay hindi awtomatikong babalik na active.' },
    { type: 'callout', kind: 'trap', text: 'Ang **gateway ng host ay ang virtual IP**, hindi ang IP ng R1 o R2. Kapag ginamit ang IP ng isang router, mawawala ang pakinabang ng HSRP.' },
    { type: 'callout', kind: 'tip', text: 'Isulat ang priority ng bawat router sa tabi ng diagram at idagdag/ibawas ang tracking bago hulaan ang active.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pointing hosts at a router’s real IP instead of the virtual IP.',
        'Expecting preemption without configuring it.',
        'Using different group numbers or versions on the two routers.',
        'Tracking an interface without preempt on the router that should take over.',
        'Choosing a virtual IP that duplicates a real interface address.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Hindi bumalik ang R1',
      scenario: 'R1 (priority 110) failed over to R2. After R1 recovered, R2 is still active and R1 is standby.',
      evidence: `R1# show standby brief
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Gi0/0       1    110   Standby 192.168.1.3     local           192.168.1.1`,
      question: 'Bakit hindi bumalik ang R1?',
      answer: 'The Pri column has no P: preempt is not configured, so R1 does not take back the active role even though its priority is higher.',
      fix: 'Configure standby 1 preempt on R1 (and optionally a delay with standby 1 preempt delay minimum 60), then verify that it becomes Active.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang R1 ay priority 100, IP 192.168.1.2. Ang R2 ay priority 100, IP 192.168.1.3. Sino ang active? Pagkatapos, ang R1 ay gawing priority 110 na may preempt at track na 20 sa uplink; sino ang active kapag bumagsak ang uplink ng R1 (may preempt sa R2)?',
      answer: 'With equal priority the higher IP wins, so R2 (192.168.1.3) is active. With R1 at 110 and preempt, R1 becomes active. If its tracked uplink fails, R1 drops to 90; R2 (100) with preempt becomes active.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Priority default 100; higher wins; tie uses the higher IP.',
        'Preempt is off by default.',
        'Hosts point at the virtual IP.',
        'HSRP is Cisco; VRRP is open; GLBP load balances.',
        'standby track lowers priority on failure.',
      ],
    },
    {
      type: 'summary',
      points: [
        'HSRP shares one virtual gateway between routers.',
        'Highest priority (then IP) is active.',
        'Preempt is off by default; configure it.',
        'Track uplinks to fail over on upstream failure.',
        'Compare HSRP, VRRP and GLBP.',
        'Susunod: SNMP, syslog at NTP deep dive.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'easy', type: 'single',
    prompt: 'What is the default HSRP priority?',
    choices: ['0', '50', '100', '255'], correct: [2],
    explanation: 'The default priority is 100.',
    wrong: { 0: '0 is the lowest value.', 1: '50 is not the default.', 3: '255 is the maximum value.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'medium', type: 'single',
    prompt: 'Two HSRP routers have priority 100. R1 is 10.0.0.2 and R2 is 10.0.0.3. Which becomes active?',
    choices: ['R1, the lower IP', 'R2, the higher IP', 'Neither', 'The one that booted last'], correct: [1],
    explanation: 'With equal priority the higher interface IP address wins.',
    wrong: { 0: 'Lower IP does not win.', 2: 'One router will be elected.', 3: 'Boot order is not a tie-breaker.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'medium', type: 'single',
    prompt: 'The original active router recovers with a higher priority but does not regain the active role. Which command is missing?',
    choices: ['standby 1 preempt', 'standby 1 track', 'standby version 2', 'standby 1 timers'], correct: [0],
    explanation: 'Preempt is disabled by default; it must be configured for a higher-priority router to take over.',
    wrong: { 1: 'Tracking changes priority when an interface fails.', 2: 'The version does not cause this.', 3: 'Timers change failover speed.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'hard', type: 'single',
    prompt: 'Which default gateway should hosts be configured with in an HSRP setup?',
    choices: ['The active router’s real IP', 'The standby router’s real IP', 'The virtual IP address', 'The broadcast address'], correct: [2],
    explanation: 'Hosts use the virtual IP so the gateway survives a router failure.',
    wrong: { 0: 'It would fail if that router fails.', 1: 'It would fail if that router fails.', 3: 'The broadcast address is not a gateway.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: HSRP is an open standard defined by the IETF.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'HSRP is Cisco proprietary. VRRP is the open standard.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.5', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO FHRPs are Cisco proprietary?',
    choices: ['HSRP', 'GLBP', 'VRRP', 'STP'], correct: [0, 1],
    explanation: 'HSRP and GLBP are Cisco proprietary; VRRP is open standard and STP is not an FHRP.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: HSRP priority at preempt?', back: 'Default priority 100, pinakamataas ang active, tie = pinakamataas na IP. PREEMPT = OFF bilang default. Host gateway = VIRTUAL IP.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'concept', front: 'HSRP hello and hold timers?', back: 'Hello 3 s, hold 10 s.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'command', front: 'Which command enables preemption?', back: 'standby <group> preempt.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'command', front: 'Which command lowers priority when an uplink fails?', back: 'standby <group> track <interface> <decrement>.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'concept', front: 'HSRP vs VRRP vs GLBP?', back: 'HSRP Cisco active/standby; VRRP open master/backup; GLBP Cisco with load balancing.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'command', front: 'Which command summarises HSRP state?', back: 'show standby brief.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Who is active when priorities tie?', back: 'The router with the highest interface IP address.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'HSRP failover and preemption',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Configure HSRP on two routers, test failover, observe the missing preempt and add tracking.',
  steps: [
    'Build R1 and R2 on one LAN switch with a PC, and an uplink from each to a server router. Use 192.168.1.0/24 on the LAN.',
    'Configure HSRP group 1 with virtual IP 192.168.1.1, R1 priority 110 and R2 default.',
    'Set the PC gateway to 192.168.1.1 and ping the server. Check show standby brief on both.',
    'Shut down R1’s LAN interface; confirm that R2 becomes active and the ping continues.',
    'Bring R1 back and observe that R2 stays active; add standby 1 preempt on R1 and observe the change.',
    'Add tracking of R1’s uplink with a decrement of 20 and test by shutting the uplink down.',
    'Test with traceroute to see which router forwards the traffic.',
  ],
  checklist: [
    'Virtual IP used as the PC gateway',
    'Failover works',
    'Missing preempt observed and fixed',
    'Tracking changes the active router',
  ],
  hints: [
    'show standby brief shows the state, priority and active address.',
    'Preempt and tracking both matter for a failback test.',
  ],
  solution: [
    'R1: standby 1 ip 192.168.1.1, priority 110, preempt; R2: standby 1 ip 192.168.1.1.',
    'Without preempt, R2 stays active after R1 returns.',
    'standby 1 track <uplink> 20 lowers R1 to 90 on uplink failure; R2 (100) becomes active.',
  ],
  breakIt: 'Use different group numbers on the two routers and describe the symptoms in show standby.',
};
