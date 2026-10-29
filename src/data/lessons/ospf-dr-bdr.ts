import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ospf-dr-bdr';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.12',
  domain: 'D3',
  title: 'OSPF DR and BDR: Elections on Multi-Access Networks',
  description: 'Why OSPF elects a Designated Router and Backup Designated Router on Ethernet segments, how the election works, and how to control it.',
  whyMatters:
    'Kapag maraming router sa iisang Ethernet segment, kung bawat isa ay makikipag-FULL sa lahat ng iba, sasabog ang dami ng adjacency at LSA. Ang DR at BDR ang solusyon. Madalas itong itanong sa exam: sino ang mananalo sa election, anong multicast ang gamit, at bakit 2-WAY ang dalawang DROTHER.',
  objectives: [
    'Explain why DR and BDR exist on broadcast multi-access networks',
    'Describe the election using OSPF priority and router ID',
    'Identify DR, BDR and DROTHER roles in show ip ospf neighbor',
    'State which multicast addresses are used (224.0.0.5 and 224.0.0.6)',
    'Change priority and network type (point-to-point) to influence or avoid the election',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['DR', 'BDR', 'DROTHER', 'election', 'priority', 'ip ospf priority', 'network type', 'point-to-point', '224.0.0.6', 'broadcast', 'non-preemptive'],
  examObjectives: ['3.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'On a shared Ethernet segment with many OSPF routers, having every router become fully adjacent with every other router would create too many conversations. OSPF solves this by electing one router as the Designated Router (DR) and another as the Backup (BDR). Every other router only becomes fully adjacent with those two and sends its updates to them.',
        'The router with the highest priority wins the election. If priorities tie, the highest router ID wins. The election is not pre-emptive: a router that joins later, even with a better priority, does not take over.',
      ],
      taglish: [
        'Sa **iisang Ethernet segment na maraming OSPF router**, kung **bawat router ay makikipag-FULL sa lahat ng iba**, **sobrang dami ng usapan**. Ang solusyon ng OSPF: **maghahalal ng isang Designated Router (DR)** at **isang Backup (BDR)**. Ang **iba pang router (DROTHER)** ay **FULL lang sa DR at BDR**, at **sa kanila ipinapadala ang updates**.',
        '**Sino ang mananalo?** Ang **pinakamataas na OSPF priority** (default **1**). Kung **tabla**, ang **pinakamataas na router ID**. At **hindi pre-emptive**: kung **may sumali pagkatapos**, kahit **mas mataas ang priority**, **hindi nito aagawin** ang DR.',
        '**Priority 0** = **hindi kailanman sasali sa halalan**.',
        'Mga multicast: **224.0.0.5** = **lahat ng OSPF router**; **224.0.0.6** = **DR at BDR lang** (doon ipinapadala ng DROTHER ang update).',
      ],
      technical: [
        'On broadcast and NBMA networks, n routers would need n(n-1)/2 adjacencies and flood each LSA n times. A DR (and BDR as hot standby) reduces this: every router forms Full adjacency only with the DR and BDR, sends LSUs to 224.0.0.6 (AllDRouters), and the DR floods them to everyone via 224.0.0.5 (AllSPFRouters). DROTHER routers stay in 2-Way with each other.',
        'Election: during the Wait interval (equal to the dead interval) after the interface comes up, routers examine the DR/BDR fields of received hellos. The router with the highest OSPF interface priority becomes DR; ties are broken by highest router ID. The runner-up becomes BDR. A priority of 0 makes the router ineligible. The process is non-pre-emptive: an elected DR keeps the role until it fails, and then the BDR is promoted and a new BDR is elected.',
        'Configuration: ip ospf priority <0-255> under the interface (default 1). To influence the election, set the priority before the neighbours come up, or restart the process (clear ip ospf process) on the routers. A loopback router ID also matters as the tiebreaker; use a higher router ID on the router you prefer as DR.',
        'No DR/BDR is elected on point-to-point networks (such as serial links or Ethernet links configured with ip ospf network point-to-point). For routed links between two routers over Ethernet, configuring ip ospf network point-to-point on both ends removes the election and speeds up adjacency formation.',
        'Verification: show ip ospf neighbor (state shown as FULL/DR, FULL/BDR, FULL/DROTHER or 2WAY/DROTHER), show ip ospf interface <if> (shows the DR and BDR IDs, priority and network type). Note that the DR role is per segment, not per router.',
      ],
    },
    {
      type: 'story',
      title: 'Ang Halalan sa Barangay ng mga Router',
      paragraphs: [
        'Sa isang opisina, may **limang router** sa iisang switch: **R1, R2, R3, R4 at R5**. Si Kuya Jun ay nagtataka kung bakit **FULL lang ang dalawa** sa bawat router at **2-WAY** ang karamihan. "Sira ba ito?" tanong ni Ate Mica.',
        'Ipinaliwanag ni Kuya Jun: "Parang **halalan sa barangay**. Kung **bawat tao makikipag-usap sa lahat ng 4 na iba**, kaguluhan. Kaya naghalal ang mga router ng **kapitan (DR)** at **kagawad (BDR)**. Ang **iba**, sa kanila lang nagsusumbong."',
        'Ang **R3** ang nanalong **DR** dahil **priority 100** ang itinakda niya. Ang **R2** ang **BDR**, dahil **pinakamataas na router ID** (2.2.2.2) sa mga natitirang pantay ang priority. Ang **R1, R4 at R5** ay **DROTHER**: **FULL** sa R3 at R2, pero **2-WAY** sa isa\'t isa.',
        'Isang araw, **nag-reload ang R3**. Mabilis na **na-promote ang R2 bilang DR**, at **nahalal na BDR ang R5**. Nang **bumalik ang R3 na priority 100**, **hindi niya inagaw ang pwesto**: **non-pre-emptive** ang OSPF. Para maibalik siya, kailangang **i-clear ang OSPF process** sa mga router.',
      ],
      moral: '**DR/BDR = para bawasan ang adjacency sa multi-access.** **Priority muna, router ID kung tabla.** **Hindi pre-emptive.** At **2-WAY sa pagitan ng DROTHER ay normal**.',
    },
    {
      type: 'analogy',
      title: 'Kapitan at kagawad',
      body: [
        'A barangay of many families does not have every family report to every other family. Instead, there is a captain and a deputy, and everyone sends news to them, and they spread it around. DR and BDR do exactly that for OSPF updates.',
      ],
      taglish: [
        'Ang **barangay na maraming pamilya** ay **hindi nag-uulat ang bawat pamilya sa lahat ng ibang pamilya**. Mayroon lang **kapitan at kagawad**, **sa kanila nagpapadala ng balita ang lahat**, at **sila ang nagpapalaganap**. Iyan ang ginagawa ng **DR at BDR** para sa OSPF updates.',
      ],
    },
    {
      type: 'hook',
      title: 'PRI-RID: Priority muna, saka Router ID; hindi pre-emptive',
      trick: '**Mananalo**: **mas mataas na PRIORITY**, kung tabla **mas mataas na ROUTER ID**. **Priority 0** = hindi sasali. **224.0.0.5** lahat, **224.0.0.6** DR/BDR. **Hindi pre-emptive**.',
      taglish: [
        '**1. Priority** (default 1, pinakamataas ang panalo).',
        '**2. Router ID** (pinakamataas ang panalo kung tabla).',
        '**Priority 0** = **hindi eligible**.',
        '**Non-pre-emptive**: ang nakaupo na, hindi basta aagawin. **Point-to-point** = **walang election**.',
      ],
      test: {
        question: 'Tatlong router ay pare-parehong priority 1; ang router ID nila ay 1.1.1.1, 2.2.2.2, 3.3.3.3. Sino ang DR at BDR? Anong multicast ang ginagamit ng DROTHER para ipadala ang update?',
        answer: 'DR = 3.3.3.3 (pinakamataas na router ID), BDR = 2.2.2.2, DROTHER = 1.1.1.1. Ipinapadala ng DROTHER ang update sa 224.0.0.6 (DR/BDR).',
      },
    },
    { type: 'diagram', id: 'ospf-dr-election', caption: 'DR at BDR sa isang segment; ang DROTHER ay FULL lang sa DR/BDR at 2-WAY sa isa\'t isa.' },
    {
      type: 'terms',
      items: [
        { term: 'DR', definition: 'Designated Router: the router that all others on a multi-access segment form adjacencies with and that floods LSAs.' },
        { term: 'BDR', definition: 'Backup Designated Router: takes over if the DR fails.' },
        { term: 'DROTHER', definition: 'A router that is neither DR nor BDR; Full only with the DR and BDR.' },
        { term: 'OSPF priority', definition: 'Interface value 0–255 (default 1) used in the election; 0 means ineligible.' },
        { term: '224.0.0.5 / 224.0.0.6', definition: 'AllSPFRouters and AllDRouters multicast addresses.' },
        { term: 'Non-pre-emptive', definition: 'An existing DR is not replaced by a router that later has a better priority.' },
        { term: 'Point-to-point network type', definition: 'A link type with no DR/BDR election, configured with ip ospf network point-to-point.' },
      ],
    },
    {
      type: 'cli',
      title: 'Basahin at kontrolin ang halalan',
      transcript: `R1# show ip ospf neighbor
Neighbor ID     Pri   State        Dead Time   Address      Interface
3.3.3.3         100   FULL/DR      00:00:33    10.0.0.3     GigabitEthernet0/0
2.2.2.2           1   FULL/BDR     00:00:36    10.0.0.2     GigabitEthernet0/0
4.4.4.4           1   2WAY/DROTHER 00:00:31    10.0.0.4     GigabitEthernet0/0
R3(config)# interface gi0/0
R3(config-if)# ip ospf priority 100
R9(config-if)# ip ospf priority 0
R1(config)# interface gi0/1
R1(config-if)# ip ospf network point-to-point
R1# show ip ospf interface gi0/0
  Network Type BROADCAST, Cost: 1
  Designated Router (ID) 3.3.3.3, Interface address 10.0.0.3
  Backup Designated Router (ID) 2.2.2.2, Interface address 10.0.0.2`,
      copyable: 'ip ospf priority 100',
      explain: [
        { line: 'FULL/DR  FULL/BDR  2WAY/DROTHER', why: 'R1 is Full with the DR and BDR but only 2-Way with another DROTHER, which is normal.' },
        { line: 'ip ospf priority 100', why: 'Raises the router\'s chance to win the election (set before neighbours come up, or clear the process).' },
        { line: 'ip ospf priority 0', why: 'Makes the router ineligible, so it can never be DR or BDR.' },
        { line: 'ip ospf network point-to-point', why: 'Removes the DR/BDR election on a two-router link and speeds up adjacency.' },
        { line: 'Designated Router (ID) 3.3.3.3', why: 'Shows who the DR and BDR are for that segment.' },
      ],
      note: 'Sample output for study.',
    },
    {
      type: 'flow',
      title: 'Sundan: paano nahalal ang DR at BDR',
      steps: [
        'Nag-up ang apat na router sa iisang segment at nagpapadala ng hello na may priority at router ID.',
        'Naghihintay sila ng Wait interval habang inoobserbahan ang hello ng iba.',
        'Pinakamataas na priority ang panalo; ang tabla ay nalulutas ng pinakamataas na router ID.',
        'Ang panalo ay DR; ang pangalawa ay BDR; ang iba ay DROTHER.',
        'Ang DROTHER ay nagiging FULL lang sa DR at BDR at 2-WAY sa isa-isa.',
        'Kapag bumagsak ang DR, mapo-promote ang BDR at maghahalal ng bagong BDR.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **DR ay para sa SEGMENT**, hindi sa buong router. Isang router ay puwedeng **DR sa isang segment** at **DROTHER sa iba**. At **walang DR sa point-to-point link**.' },
    { type: 'callout', kind: 'trap', text: 'Ang **mas mataas na priority na sumali pagkatapos** ay **hindi mananalo agad** — **non-pre-emptive**. Kailangang **i-clear ang OSPF process** (o mag-reload) para **ma-reelect**.' },
    { type: 'callout', kind: 'tip', text: 'Para sa **dalawang router lang sa Ethernet link**, **ip ospf network point-to-point** sa **magkabilang dulo** — **walang election**, **mas mabilis mag-FULL**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pag-iisip na sira ang 2-WAY sa pagitan ng DROTHER.',
        'Pag-akalang aagawin agad ng mas mataas na priority ang DR.',
        'Pagkalito sa 224.0.0.5 at 224.0.0.6.',
        'Pagturing sa DR bilang pangkalahatang katangian ng router.',
        'Paglimot na ang priority 0 ay hindi sasali.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Gusto kong si R1 ang DR pero ibang router ang nanalo"',
      scenario: 'The core router R1 was meant to be DR, but a branch router is DR. R1\'s priority was raised after the network was already up.',
      evidence: `R1# show ip ospf interface gi0/0
  Priority 200
  Designated Router (ID) 5.5.5.5
  Backup Designated Router (ID) 4.4.4.4`,
      question: 'Bakit hindi R1 ang DR kahit mas mataas ang priority nito?',
      answer: 'Non-pre-emptive ang halalan: ang DR na umiiral na (5.5.5.5) ay hindi pinapalitan kapag nagpalit ng priority pagkatapos.',
      fix: 'Pagkatapos itakda ang ip ospf priority 200 sa R1, i-clear ang OSPF process sa mga router (clear ip ospf process) o i-bounce ang interface para magsimula ng bagong halalan. I-verify gamit ang show ip ospf interface.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Limang router sa isang segment, lahat priority 1. Router IDs: 1.1.1.1 hanggang 5.5.5.5. Idinagdag ang bagong router 9.9.9.9 pagkatapos. Sino ang DR at BDR bago at pagkatapos?',
      answer: 'Bago: DR 5.5.5.5, BDR 4.4.4.4. Pagkatapos idagdag ang 9.9.9.9: hindi nagbabago (non-pre-emptive), at ang 9.9.9.9 ay DROTHER hanggang sa magkaroon ng bagong halalan.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'DR/BDR reduce adjacencies on broadcast multi-access segments; DROTHERs stay 2-Way with each other.',
        'Election: highest priority, then highest router ID; priority 0 is ineligible; non-pre-emptive.',
        'DROTHER sends updates to 224.0.0.6; the DR floods to 224.0.0.5.',
        'No election on point-to-point links; use ip ospf network point-to-point on two-router Ethernet links.',
        'ip ospf priority is configured under the interface; the default is 1.',
      ],
    },
    {
      type: 'summary',
      points: [
        'DR and BDR keep OSPF efficient on multi-access segments.',
        'Priority wins first, router ID breaks ties, and the result is not pre-emptive.',
        'Know 224.0.0.5 and 224.0.0.6.',
        'Point-to-point network type avoids the election.',
        'Susunod: First-hop redundancy protocols — backup ng default gateway.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'easy', type: 'single',
    prompt: 'What is the purpose of the DR on a multi-access network?',
    choices: ['To encrypt OSPF', 'To reduce the number of adjacencies and LSA flooding', 'To assign IP addresses', 'To block loops'], correct: [1],
    explanation: 'The DR centralises adjacencies and flooding so routers need not be Full with each other.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'How is the DR chosen?',
    choices: ['Lowest router ID', 'Highest OSPF priority, then highest router ID', 'Lowest cost', 'The first router powered on'], correct: [1],
    explanation: 'The highest priority wins; a tie is broken by the highest router ID.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'Which multicast address do DROTHERs use to send updates to the DR and BDR?',
    choices: ['224.0.0.5', '224.0.0.6', '224.0.0.9', '224.0.0.10'], correct: [1],
    explanation: '224.0.0.6 (AllDRouters) is used to reach the DR and BDR.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'What does an OSPF priority of 0 mean?',
    choices: ['The router always wins', 'The router can never become DR or BDR', 'The router is the BDR', 'OSPF is disabled'], correct: [1],
    explanation: 'Priority 0 makes the router ineligible for the election.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'hard', type: 'single',
    prompt: 'A router with a higher priority joins a segment that already has a DR. What happens?',
    choices: ['It becomes DR immediately', 'Nothing; the election is non-pre-emptive', 'The DR is shut down', 'The segment is split'], correct: [1],
    explanation: 'OSPF DR election is non-pre-emptive; the new router waits for the next election.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'On which type of link is no DR/BDR elected?',
    choices: ['Broadcast Ethernet', 'Point-to-point', 'Any multi-access', 'Every link'], correct: [1],
    explanation: 'Point-to-point networks have only two routers, so there is no election.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'Two DROTHER routers on the same segment show each other as 2WAY. What does this mean?',
    choices: ['A fault', 'Normal behaviour', 'An area mismatch', 'An authentication error'], correct: [1],
    explanation: 'DROTHERs only become Full with the DR and BDR.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO commands influence or remove the DR election on an interface?',
    choices: ['ip ospf priority 0', 'ip ospf network point-to-point', 'ip ospf cost 10', 'passive-interface default'], correct: [0, 1],
    explanation: 'Priority 0 makes the router ineligible; point-to-point removes the election.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: the DR role belongs to the whole router, not to a segment.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — DR and BDR are elected per multi-access segment.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: DR/BDR election?', back: 'Priority muna (default 1), router ID kung tabla. Priority 0 = hindi sasali. Non-pre-emptive. 224.0.0.5 lahat, 224.0.0.6 DR/BDR. Walang election sa point-to-point.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Why DR and BDR?', back: 'To cut the number of adjacencies and LSA floods on a multi-access segment.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'How is the DR elected?', back: 'Highest OSPF priority, then highest router ID; priority 0 is ineligible; non-pre-emptive.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'port', front: 'OSPF multicast addresses?', back: '224.0.0.5 AllSPFRouters; 224.0.0.6 AllDRouters (DR/BDR).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'command', front: 'Control the election?', back: 'ip ospf priority <0-255> (interface); ip ospf network point-to-point to avoid it.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'concept', front: 'DROTHER relationships?', back: 'FULL with the DR and BDR; 2-WAY with other DROTHERs.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Run an OSPF election on a switch',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Connect four routers to one switch, observe the DR/BDR election, then change priority and network type.',
  topology: 'R1–R4 on one switch, 10.0.0.0/24, OSPF area 0, router IDs 1.1.1.1 to 4.4.4.4.',
  steps: [
    'Configure OSPF on all four routers and wait for FULL.',
    'Run show ip ospf neighbor and identify the DR, BDR and DROTHER relationships.',
    'Predict the DR and BDR from the router IDs before checking.',
    'Set ip ospf priority 200 on R1, then clear ip ospf process on all routers and observe the new DR.',
    'Set priority 0 on R4 and confirm it is never DR/BDR.',
    'Remove the switch and connect R1 and R2 directly with ip ospf network point-to-point on both ends.',
  ],
  checklist: [
    'DR/BDR predicted correctly',
    'Priority change took effect after clearing',
    'Priority 0 router ineligible',
    'Point-to-point link shows no DR/BDR',
  ],
  hints: [
    'All priorities default to 1, so router IDs decide.',
    'Changing priority alone does not pre-empt an existing DR.',
  ],
  solution: [
    'By router ID: DR 4.4.4.4, BDR 3.3.3.3. After priority 200 and clearing: R1 DR.',
    'On a point-to-point link the neighbour shows FULL/ - with no DR or BDR.',
  ],
  breakIt: 'Reload the DR and watch the BDR promoted; when the old DR returns it does not take over.',
};
