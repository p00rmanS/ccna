import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ospf-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.10',
  domain: 'D3',
  title: 'OSPF Deep Dive: Cost, Path Choice and Tuning',
  description: 'Calculate OSPF cost by hand, predict which path a router chooses, tune the reference bandwidth and read the verification output like an engineer.',
  whyMatters:
    'Alam mo na kung paano mag-configure ng OSPF. Ang tanong sa exam ngayon ay: “anong ruta ang pipiliin ng router at ano ang metric nito?” Para masagot iyan kailangan mong mag-compute ng cost at maintindihan kung bakit ang gigabit at fast Ethernet ay pareho ang cost bilang default.',
  objectives: [
    'Compute interface and path cost from bandwidth',
    'Explain why the default reference bandwidth hides fast links',
    'Predict the best path and read the [110/metric] route entry',
    'Tune cost with ip ospf cost and auto-cost reference-bandwidth',
    'Originate a default route and verify with show commands',
  ],
  estimatedMinutes: 45,
  difficulty: 'exam',
  keywords: ['OSPF', 'cost', 'reference bandwidth', 'auto-cost', 'ip ospf cost', 'default-information originate', 'show ip ospf interface', 'equal-cost', 'router ID'],
  examObjectives: ['3.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'OSPF picks the path with the lowest total cost. Cost for one link is the reference bandwidth divided by the link bandwidth. The total is the sum of the link costs along the path.',
        'The default reference bandwidth is 100 Mb/s, so every link of 100 Mb/s or faster gets cost 1 unless you change it.',
      ],
      taglish: [
        'Pinipili ng OSPF ang daan na may **pinakamababang kabuuang cost**. Ang cost ng isang link ay **reference bandwidth ÷ bandwidth ng link**. Ang kabuuan ay ang **sum** ng cost ng lahat ng link na dadaanan palabas.',
        'Ang default na reference bandwidth ay **100 Mb/s**. Kaya ang FastEthernet (100M), GigabitEthernet at 10G ay **pare-parehong cost 1** — hindi na makita ng OSPF kung alin ang mas mabilis! Kaya karaniwang pinapalitan ito sa mas mataas na value.',
        'Kapag magkapareho ang total cost ng dalawang daan, ginagamit ng router ang **dalawa** (equal-cost load balancing, hanggang 4 bilang default).',
      ],
      technical: [
        'Cost = reference bandwidth / interface bandwidth, rounded down, minimum 1. With the default 100 Mb/s reference: 10 Mb/s = 10, 100 Mb/s = 1, 1 Gb/s = 1, T1 (1.544 Mb/s) = 64, 56 kb/s serial = 1785.',
        'The metric of a route in the routing table is the cumulative cost of the outgoing interfaces to the destination, shown as [110/metric]. The bandwidth value used is the interface bandwidth command, not the actual speed.',
        'auto-cost reference-bandwidth <Mb/s> changes the reference; it must be configured consistently on all routers. ip ospf cost overrides the calculation per interface. Equal-cost paths are installed together (maximum-paths, default 4).',
      ],
    },
    {
      type: 'analogy',
      title: 'Toll sa expressway',
      body: [
        'Imagine paying a toll on each road. A cheap road may be longer but costs less in total. OSPF adds up the toll of every road segment and picks the cheapest trip. If every road has the same toll sign (cost 1) no matter how fast it is, the cheapest trip is just the one with the fewest segments.',
      ],
      taglish: [
        'Parang **toll** sa bawat kalsada: ang mas mabilis na kalsada ay dapat **mas mura** ang toll. Pinag-iipon ng OSPF ang toll ng lahat ng segment at pinipili ang pinakamurang biyahe. Pero kung pareho ang toll ng lahat ng kalsada (cost 1) kahit mabilis o mabagal, ang napipili ay ang may **pinakakaunting segment** — hindi ang pinakamabilis. Kaya pinapataas natin ang reference bandwidth.',
      ],
    },
    {
      type: 'hook',
      title: 'Ref ÷ BW',
      trick: '**COST = REF ÷ BW. Default REF = 100. Gig = 1 = Fast. Pataasin ang REF sa lahat ng router.**',
      taglish: [
        '**COST = REF ÷ BW**: reference bandwidth hinati sa bandwidth ng interface (parehong Mb/s).',
        'Default REF = **100 Mb/s** → 10M = 10, 100M = 1, 1G = 1, T1 = 64.',
        'Gusto mong magkaiba ang Gig at Fast? Pataasin ang REF: `auto-cost reference-bandwidth 1000` → 100M = 10, 1G = 1, 10G = 1 (hindi pa rin tama!). Para sa 10G gamitin ang 10000.',
        'Dapat **pareho ang REF sa lahat ng router**; kung hindi, hindi magkatugma ang cost at pangit ang pagpili ng path.',
      ],
      test: {
        question: 'Bakit sa default ay pareho ang cost ng 100M at 1G na link, at ano ang cost ng T1 na 1.544 Mb/s?',
        answer: '100 ÷ 100 = 1 at 100 ÷ 1000 ay 0.1 na itinataas sa minimum na 1. Ang T1: 100 ÷ 1.544 ≈ 64.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Kuwentahin ang cost ng bawat link',
      paragraphs: [
        'Gamitin ang formula na REF ÷ BW. Ang lahat ng halaga ay nasa Mb/s. Ang resulta ay bini-bilog pababa at ang pinakamababa ay 1.',
        'Default (REF = 100): Ethernet 10M → 10; FastEthernet 100M → 1; GigabitEthernet 1000M → 0.1 → 1; Serial T1 1.544M → 64.',
        'Pagkatapos ng `auto-cost reference-bandwidth 10000` (10 Gb/s): 10M → 1000; 100M → 100; 1G → 10; 10G → 1. Ngayon ay malinaw ang pagkakaiba.',
        'Isa pang paraan ay `ip ospf cost 20` sa isang interface — ang cost ay eksaktong 20 anuman ang bandwidth.',
      ],
      steps: [
        'Isulat ang bandwidth ng bawat interface (show interface o ang bandwidth command).',
        'Hatiin ang REF sa bandwidth; i-round pababa; minimum 1.',
        'Kung may ip ospf cost sa interface, iyon ang gamitin.',
      ],
      tricks: [
        'Ang `bandwidth` command ay hindi nagpapabilis ng link; binabago lang nito ang halaga na ginagamit ng OSPF (at QoS). Isang karaniwang tanong sa exam.',
        'Ang loopback interface ay may cost 1.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Hulaan ang best path at ang metric',
      paragraphs: [
        'Halimbawa: R1 ay may dalawang daan papunta sa network 10.9.0.0/24 sa likod ng R3. Daan A: R1 → R3 direkta sa FastEthernet (cost 1) at R3 ang LAN (cost 1) = **2**. Daan B: R1 → R2 (GigabitEthernet, cost 1) → R3 (GigabitEthernet, cost 1) + LAN (1) = **3**.',
        'Sa default REF, panalo ang daan A dahil mas mababa ang 2 kaysa 3, kahit na mas mabilis ang daan B! Pagkatapos ng `auto-cost reference-bandwidth 1000`, ang FastEthernet ay cost 10: daan A = 10 + 1 = 11; daan B = 1 + 1 + 1 = 3 → ang mas mabilis na daan na ang panalo.',
        'Sa routing table makikita mo ang `O 10.9.0.0/24 [110/3] via ...`. Ang 110 ay admin distance at ang 3 ay ang kabuuang cost.',
      ],
      steps: [
        'Ilista ang lahat ng daan papunta sa destination.',
        'Idagdag ang cost ng **outgoing interface** ng bawat router sa daan, kasama ang cost ng destination network (ang interface ng huling router).',
        'Piliin ang pinakamababa; kung tie, parehong ilalagay sa routing table.',
        'I-verify: show ip route 10.9.0.0 at show ip ospf interface brief.',
      ],
      tricks: [
        'Kapag magkapareho ang cost, makikita mo ang dalawang “via” line sa ilalim ng iisang route — iyon ay equal-cost load balancing.',
        'Huwag kalimutang idagdag ang cost ng huling LAN interface sa total.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 3: Default route at pag-tune ng timers',
      paragraphs: [
        'Ang edge router na may static default route papunta sa ISP ay pwedeng magpakalat nito gamit ang `default-information originate`. Lalabas ito sa ibang router bilang `O*E2 0.0.0.0/0`.',
        'Ang Hello at Dead timers ay maaaring baguhin sa interface (`ip ospf hello-interval 5`, `ip ospf dead-interval 20`). Dapat **magkatugma** sa magkabilang dulo, kaya ibahin lang kung may dahilan (mas mabilis na detection).',
        'Gumamit ng `passive-interface default` at i-`no passive-interface` lang ang mga link na kailangan ng neighbour — mas ligtas.',
      ],
      tricks: [
        'Kung walang default route sa edge router, hindi gagana ang `default-information originate` nang walang `always`. Ito ay madalas na bitag.',
        'E2 (default) ay hindi nagdaragdag ng internal cost; E1 ay oo. Para sa CCNA, sapat na malaman na ang `O*E2` ay ang default route na galing sa OSPF.',
      ],
    },
    {
      type: 'remember',
      title: 'OSPF cost: mabilis na tala',
      items: [
        '**Cost = reference bandwidth ÷ interface bandwidth; default REF = 100 Mb/s; minimum 1.**',
        '**10M = 10, 100M = 1, 1G = 1, T1 = 64.**',
        '**auto-cost reference-bandwidth** — pareho dapat sa lahat ng router. **ip ospf cost** = manu-manong cost.',
        '**[110/metric]**: 110 = AD, metric = kabuuang cost. **Equal-cost = parehong ilalagay (default max 4).**',
        '**default-information originate** ay nagpapakalat ng default route; lalabas bilang **O*E2**.',
      ],
    },
    { type: 'diagram', id: 'ospf-topology', caption: 'Topolohiya na may dalawang daan; kuwentahin ang cost ng bawat isa bago tingnan ang routing table.' },
    {
      type: 'terms',
      items: [
        { term: 'Cost', definition: 'OSPF link metric: reference bandwidth divided by interface bandwidth.' },
        { term: 'Reference bandwidth', definition: 'The numerator in the cost formula; 100 Mb/s by default.' },
        { term: 'Equal-cost multipath', definition: 'Installing several routes with the same total cost and load balancing across them.' },
        { term: 'bandwidth command', definition: 'Sets the bandwidth value used for OSPF cost; it does not change real speed.' },
        { term: 'Passive interface', definition: 'An interface that is advertised but sends no hellos and forms no neighbours.' },
        { term: 'Default-information originate', definition: 'Advertises a default route into OSPF.' },
        { term: 'E2 route', definition: 'External type 2 route, shown as O*E2 for a default route injected into OSPF.' },
      ],
    },
    {
      type: 'flow',
      title: 'Kung paano pumipili ng ruta ang OSPF',
      steps: [
        'Bawat router ay kinukuwenta ang cost ng bawat interface (REF ÷ BW o ip ospf cost).',
        'Ibinabahagi ang cost sa LSAs at nabubuo ang LSDB.',
        'Ang SPF algorithm ay kinukuwenta ang pinakamababang kabuuang cost papunta sa bawat network.',
        'Ang pinakamababa ay inilalagay sa routing table bilang [110/cost].',
        'Kapag magkapareho ang cost, inilalagay ang hanggang 4 na daan nang sabay.',
      ],
    },
    {
      type: 'cli',
      title: 'Tune at i-verify',
      transcript: `R1(config)# router ospf 1
R1(config-router)# auto-cost reference-bandwidth 1000
R1(config-router)# default-information originate
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ip ospf cost 5
R1# show ip ospf interface brief
Interface  PID  Area  IP Address/Mask    Cost  State Nbrs F/C
Gi0/0      1    0     10.0.12.1/30       5     P2P   1/1
R1# show ip route ospf
O     10.9.0.0/24 [110/15] via 10.0.12.2, 00:02:10, GigabitEthernet0/0`,
      copyable: 'router ospf 1\nauto-cost reference-bandwidth 1000\ndefault-information originate\ninterface gigabitEthernet 0/0\nip ospf cost 5\nshow ip ospf interface brief\nshow ip route ospf',
      explain: [
        { line: 'auto-cost reference-bandwidth 1000', why: 'Raises the reference to 1 Gb/s so gigabit links get cost 1 and Fast Ethernet gets 10. Configure it on every router.' },
        { line: 'ip ospf cost 5', why: 'Overrides the calculated cost on this interface.' },
        { line: 'default-information originate', why: 'Advertises the router’s own default route to its OSPF neighbours.' },
        { line: '[110/15]', why: '110 is the OSPF administrative distance and 15 is the total cost to the destination.' },
      ],
      note: 'IOS prints a reminder to change the reference bandwidth on all routers after you configure it.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang `bandwidth 512` sa interface ay **hindi nagpapabagal** ng link — binabago lang nito ang cost na kinukuwenta ng OSPF. Ang tunay na speed ay nananatili.' },
    { type: 'callout', kind: 'trap', text: 'Kapag iba ang `auto-cost reference-bandwidth` ng dalawang router, magkaiba ang cost ng parehong link sa dalawang panig — hindi ito pipigil sa neighbour pero sisira sa path selection.' },
    { type: 'callout', kind: 'tip', text: 'Sa exam, isulat ang cost ng bawat link sa diagram at iangkop ang kabuuan bago tingnan ang mga choice — mabilis na makikita ang tamang sagot.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Assuming gigabit has a lower cost than Fast Ethernet with the default reference bandwidth.',
        'Changing the reference bandwidth on only some routers.',
        'Forgetting to add the cost of the final LAN interface to the route metric.',
        'Using the bandwidth command to “speed up” a link.',
        'Expecting default-information originate to work with no default route and no always keyword.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Mabagal na daan ang pinipili',
      scenario: 'Traffic from R1 to a server network uses the 100 Mb/s link even though a 1 Gb/s path exists through R2.',
      evidence: `R1# show ip ospf interface brief
Interface  PID  Area  IP Address/Mask   Cost  State
Fa0/0      1    0     10.0.13.1/30      1     P2P
Gi0/1      1    0     10.0.12.1/30      1     P2P`,
      question: 'Bakit pareho ang cost, at paano ito aayusin?',
      answer: 'The default reference bandwidth of 100 Mb/s gives both Fast Ethernet and Gigabit Ethernet a cost of 1. OSPF cannot tell they differ, so it prefers the path with fewer hops.',
      fix: 'On every OSPF router configure auto-cost reference-bandwidth 1000 (or 10000 if there are 10 Gb/s links). Verify that Fa0/0 now shows cost 10 and Gi0/1 cost 1.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Sa default na REF, ang R1 ay may daan A: FastEthernet (cost 1) + FastEthernet (1) + LAN (1) at daan B: Serial T1 (64) + LAN (1). Ano ang metric at aling daan ang panalo? Ano ang metric sa routing table?',
      answer: 'Path A total = 1 + 1 + 1 = 3. Path B total = 64 + 1 = 65. Path A wins. The route shows [110/3].',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Cost = reference bandwidth ÷ bandwidth, minimum 1.',
        'Route metric is the sum of outgoing interface costs.',
        'Reference bandwidth must match on all routers.',
        'Equal-cost routes appear together in the routing table.',
        'default-information originate creates an O*E2 default route on neighbours.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Lowest total cost wins.',
        'Cost = REF ÷ BW; default REF is 100 Mb/s.',
        'Raise the reference bandwidth consistently.',
        'ip ospf cost overrides the calculation.',
        'Read routes as [110/total cost].',
        'Susunod: ACL deep dive — wildcard masks at placement.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'easy', type: 'single',
    prompt: 'With the default reference bandwidth, what is the OSPF cost of a GigabitEthernet interface?',
    choices: ['0', '1', '10', '100'], correct: [1],
    explanation: '100 Mb/s ÷ 1000 Mb/s = 0.1, which is raised to the minimum cost of 1.',
    wrong: { 0: 'The minimum cost is 1.', 2: 'That would be the cost of a 10 Mb/s Ethernet link.', 3: 'That would be the cost of a 1 Mb/s link.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'After “auto-cost reference-bandwidth 1000” is configured, what is the cost of a FastEthernet interface?',
    choices: ['1', '10', '100', '64'], correct: [1],
    explanation: '1000 ÷ 100 = 10.',
    wrong: { 0: 'That was the cost with the default reference.', 2: 'That would be a 10 Mb/s link.', 3: 'That is the default cost of a T1.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'A router has a route marked [110/65]. What do 110 and 65 represent?',
    choices: ['Hop count and cost', 'Administrative distance and total cost', 'Cost and administrative distance', 'Bandwidth and delay'], correct: [1],
    explanation: '110 is the OSPF administrative distance and 65 is the total path cost.',
    wrong: { 0: 'OSPF does not use hop count.', 2: 'The first number is the distance.', 3: 'These are EIGRP metric components.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'hard', type: 'single',
    prompt: 'Path A has costs 10 + 10 + 1 and path B has costs 64 + 1. Which path does OSPF install and with what metric?',
    choices: ['A with 21', 'B with 65', 'Both paths', 'A with 20'], correct: [0],
    explanation: 'Path A totals 21 and path B totals 65. The lowest total wins.',
    wrong: { 1: '65 is higher than 21.', 2: 'Equal-cost load balancing needs equal totals.', 3: 'The three costs add up to 21.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: the bandwidth interface command changes the physical speed of the link.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'It only changes the value used by protocols such as OSPF; the physical speed is unchanged.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO commands change the OSPF cost of an interface?',
    choices: ['ip ospf cost 20', 'bandwidth 50000', 'ip ospf priority 20', 'passive-interface gi0/0'], correct: [0, 1],
    explanation: 'ip ospf cost sets the cost directly; the bandwidth command changes the value used in the cost formula. Priority affects DR election and passive-interface stops hellos.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: paano kinukuwenta ang OSPF cost?', back: 'COST = REF ÷ BW. Default REF = 100. Gig = Fast = 1. Pataasin ang REF sa lahat ng router.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Default OSPF cost of 10M, 100M, 1G, T1?', back: '10, 1, 1, 64.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'command', front: 'Which command changes the reference bandwidth?', back: 'auto-cost reference-bandwidth <Mb/s> under router ospf (on all routers).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'command', front: 'Which command sets the cost of one interface?', back: 'ip ospf cost <value>.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What does [110/65] mean?', back: 'Administrative distance 110, total cost 65.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'command', front: 'How do you advertise a default route into OSPF?', back: 'default-information originate (needs a default route, or the always keyword).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What happens with equal-cost paths?', back: 'They are installed together and traffic is load balanced (default maximum 4).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Make OSPF choose the fast path',
  tool: 'Packet Tracer',
  minutes: 40,
  objective: 'Observe how the default reference bandwidth hides link speed, then fix path selection with auto-cost and ip ospf cost.',
  steps: [
    'Build R1, R2 and R3 in a triangle. Make R1–R3 a FastEthernet link and R1–R2–R3 gigabit links. Add a LAN behind R3.',
    'Enable single-area OSPF on all routers and confirm neighbours are FULL.',
    'Run show ip ospf interface brief on R1 and note that FastEthernet and Gigabit have the same cost.',
    'Check show ip route ospf on R1 and note which path to the LAN is installed.',
    'Configure auto-cost reference-bandwidth 1000 on all three routers and compare the new costs and the new path.',
    'Use ip ospf cost on one link to force the other path and verify.',
    'Add a static default route on R3, use default-information originate and confirm R1 learns O*E2.',
  ],
  checklist: [
    'All neighbours FULL',
    'Default cost behaviour observed',
    'Reference bandwidth changed on every router',
    'Path changed as predicted',
    'Default route learned on R1',
  ],
  hints: [
    'Predict the route metric on paper before running the command.',
    'Run clear ip ospf process if the costs do not update.',
  ],
  solution: [
    'Default: both link types are cost 1 so the one-hop FastEthernet path wins.',
    'After auto-cost 1000: Fa = 10, Gi = 1; the two-hop gigabit path totals 3 and beats 11.',
    'R3 default route with default-information originate appears on R1 as O*E2 0.0.0.0/0.',
  ],
  breakIt: 'Change the reference bandwidth on R1 only and describe why the two ends of a link now disagree about its cost.',
};
