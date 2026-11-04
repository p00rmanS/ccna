import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'stp-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.7',
  domain: 'D2',
  title: 'STP Deep Dive: Predict Every Election and Port Role',
  description: 'Work through root bridge, root port, designated port and blocked port decisions step by step, including every tie-breaker.',
  whyMatters:
    'Sa exam, hindi lang “ano ang STP” ang tinatanong — binibigyan ka ng diagram na may MAC addresses, priorities at costs, tapos hahanapin mo kung aling port ang naka-block. Kapag may sistema ka, ilang segundo lang ito. Sa lesson na ito, gagawa tayo ng sistema.',
  objectives: [
    'Pick the root bridge from priority, VLAN ID and MAC',
    'Choose each switch’s root port using cost and every tie-breaker',
    'Choose the designated port on every segment',
    'Identify the blocked (alternate) port',
    'Influence the result with priority and cost commands',
  ],
  estimatedMinutes: 45,
  difficulty: 'exam',
  keywords: ['STP', 'root bridge', 'root port', 'designated port', 'alternate port', 'bridge ID', 'path cost', 'PVST+', 'tie-breaker', 'spanning-tree vlan'],
  examObjectives: ['2.5'],
  sections: [
    {
      type: 'explain',
      simple: [
        'STP makes three decisions in a fixed order: who is the root bridge, which port on each non-root switch is closest to the root, and which port on each segment is allowed to forward.',
        'Every decision is a comparison with clear tie-breakers, so you can predict the result on paper.',
      ],
      taglish: [
        'Tatlong desisyon lang ang ginagawa ng STP, **sa ganitong pagkakasunod**: (1) sino ang **root bridge**, (2) alin ang **root port** ng bawat non-root switch, (3) alin ang **designated port** ng bawat segment. Ang matitira ay **naka-block**.',
        'Bawat desisyon ay paghahambing na may malinaw na tie-breaker. Kapag alam mo ang pagkakasunod, kaya mong hulaan ang resulta sa papel — kahit hindi mo pa nakikita ang switch.',
        'Laging **mas mababa ang panalo**: mas mababang bridge ID, mas mababang cost, mas mababang port ID.',
      ],
      technical: [
        'Root bridge election: the lowest bridge ID wins. In PVST+ the bridge ID is priority (default 32768) plus the VLAN ID as the extended system ID, followed by the MAC address. Priority is compared first; the MAC breaks ties.',
        'Root port selection on each non-root switch: the lowest total path cost to the root. Ties are broken by the lowest sender bridge ID, then the lowest sender port priority, then the lowest sender port number.',
        'Designated port selection per segment: the port on the switch with the lowest root path cost advertised onto that segment; ties go to the lowest bridge ID. All ports on the root bridge are designated. Any port that is neither root nor designated is alternate (blocking).',
      ],
    },
    {
      type: 'analogy',
      title: 'Halalan sa barangay',
      body: [
        'Think of a barangay election. The captain (root) is the one with the lowest number on the ballot. Every other household finds the shortest road to the barangay hall (root port). On every street shared by two houses, the house closer to the hall gets the right to speak (designated port). The one that loses on that street stays silent (blocked).',
      ],
      taglish: [
        'Parang halalan sa barangay: ang **kapitan (root bridge)** ay may pinakamababang numero sa balota. Bawat bahay ay naghahanap ng **pinakamaikling daan papunta sa barangay hall** (root port). Sa bawat kalye na pinaghahatian ng dalawang bahay, ang **mas malapit sa hall** ang may karapatang magsalita (designated port). Ang natalo sa kalyeng iyon ay **tahimik** (blocked) para walang ikot-ikot na usapan.',
      ],
    },
    {
      type: 'hook',
      title: 'Root, Root port, Designated',
      trick: '**BRD: Bridge ID → Root port (cost) → Designated (lowest bridge ID sa segment). Lahat ng port ng root = designated. Ang matitira = blocked.**',
      taglish: [
        '**B** = Bridge ID: pinakamababang priority, tapos pinakamababang MAC = root.',
        '**R** = Root port: bawat non-root switch ay may **isa lang**, ang pinakamababang cost papunta sa root.',
        '**D** = Designated port: bawat **segment** ay may isa, ang mas mababa ang cost papunta sa root (tie → mas mababang bridge ID).',
        'Ang lahat ng port ng root bridge ay **designated**. Sa pinakadulo, ang port na hindi R at hindi D ay **blocked**.',
      ],
      test: {
        question: 'Ilang root port ang meron ang root bridge, at ilan ang bawat non-root switch?',
        answer: 'Root bridge: zero root ports (lahat ay designated). Bawat non-root switch: eksaktong isang root port.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Ang bridge ID at ang halalan ng root',
      paragraphs: [
        'Ang bridge ID ay may tatlong bahagi: **priority**, **VLAN ID (extended system ID)** at **MAC address**. Sa PVST+, ang priority na nakikita mo ay 32768 + VLAN ID. Kaya sa VLAN 1 ang default ay **32769**, sa VLAN 10 ay **32778**.',
        'Ihambing ang buong priority number muna. Kung pareho, ang pinakamababang MAC ang panalo. Dahil ang MAC ay madalas na pinakamaliit sa pinakamatandang switch, ang **pinakamatandang switch ang kusang nagiging root** — kadalasan ay hindi ang gusto mo.',
        'Dahil dito, laging magtakda ng root nang sadya: ang priority ay pwede lang sa multiples ng 4096 (0, 4096, 8192 …).',
      ],
      steps: [
        'Isulat ang priority + VLAN ID ng bawat switch.',
        'Piliin ang pinakamababa. Kung may tie, ihambing ang MAC (mas mababa ang panalo).',
        'Markahan ang root. Lahat ng port nito ay designated.',
      ],
      tricks: [
        'Sa exam, kung dalawang switch ay may 32769 at magkaibang MAC, ang mas maliit na MAC ay root. Basahin ang MAC mula kaliwa pakanan, hex digit-by-digit.',
        '`spanning-tree vlan 10 root primary` ay ginagawang priority 24576 (o mas mababa ng 4096 kaysa sa kasalukuyang root); `root secondary` ay 28672.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Root port — lumakad sa tatlong switch',
      paragraphs: [
        'Halimbawa: SW1, SW2, SW3, lahat ay default sa VLAN 1 (priority 32769). MAC ng SW1 ay 0000.0c00.0001, SW2 ay …0002, SW3 ay …0003. Ang SW1 ang pinakamababang MAC kaya **SW1 ang root**.',
        'Ang SW1 ay may gigabit link papunta sa SW2 at sa SW3, at may gigabit link din ang SW2 at SW3 sa isa’t isa. Ang cost ng gigabit ay 4.',
        'Root port ng SW3: direktang daan papunta sa SW1 = cost 4. Daan na dumadaan sa SW2 = 4 (SW2 papunta sa SW1) + 4 (SW3 papunta sa SW2) = 8. Panalo ang direkta, kaya ang port nito papunta sa SW1 ay **root port**. Ganoon din sa SW2.',
        'Tandaan: ang cost ay naiipon kapag **pumapasok** sa isang port (papunta sa root), hindi kapag lumalabas.',
      ],
      steps: [
        'Para sa bawat non-root switch, ilista ang lahat ng daan papunta sa root.',
        'Kuwentahin ang kabuuang cost (idagdag ang cost ng bawat link na dadaanan).',
        'Piliin ang pinakamababa. Iyon ang root port.',
        'Tie? Ihambing: sender bridge ID → sender port priority → sender port number.',
      ],
      tricks: [
        'Cost: 10 Mb/s = 100, 100 Mb/s = 19, 1 Gb/s = 4, 10 Gb/s = 2. Kabisaduhin.',
        'Hindi bawal ang magpalit ng cost: `spanning-tree cost 10` sa interface (o `spanning-tree vlan 10 cost 10`) para ibahin ang desisyon.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 3: Designated port at kung bakit may naka-block',
      paragraphs: [
        'May tatlong segment sa halimbawa: SW1–SW2, SW1–SW3 at SW2–SW3. Ang dalawang segment na may root ay madali: ang port ng root ay designated.',
        'Segment SW2–SW3: parehong may root path cost na 4. **Tie!** Ang tie-breaker ay ang **mas mababang bridge ID**. Ang SW2 (…0002) ay mas mababa sa SW3 (…0003), kaya ang SW2 port ay **designated** at ang SW3 port ay **alternate (blocking)**.',
        'Resulta: sa segment na iyon, trapiko ay dumadaan sa SW2 lang; ang SW3 port ay hindi nagpapadala ng data kaya walang loop. Kapag nawala ang link ng SW3 papunta sa SW1, awtomatikong magiging root port ang naka-block na port.',
      ],
      steps: [
        'Gumuhit ng lahat ng segment (bawat cable ay isang segment).',
        'Para sa bawat segment, ihambing ang root path cost ng dalawang dulo. Ang mas mababa = designated.',
        'Tie? Ang mas mababang bridge ID ang designated.',
        'Ang port na hindi root at hindi designated = alternate/blocked.',
      ],
      tricks: [
        'Bawat segment ay may eksaktong isang designated port. Kung mabibilang mo ang mga segment, alam mo na ang bilang ng designated ports.',
        'Kung ang isang switch ay may 2 daan na magkapareho sa lahat ng bagay, ang pinakamababang port number ang root port.',
      ],
    },
    {
      type: 'remember',
      title: 'STP na paulit-ulit sa exam',
      items: [
        '**Bridge ID = priority + VLAN ID + MAC.** **Default priority 32768; PVST+ VLAN 1 = 32769.**',
        '**Priority sa multiples ng 4096.** **root primary = 24576, root secondary = 28672.**',
        '**Cost: 10M = 100, 100M = 19, 1G = 4, 10G = 2.**',
        '**Root bridge walang root port; bawat non-root switch ay may isa.**',
        '**Bawat segment may isang designated port.** **Hindi root at hindi designated = blocked.**',
      ],
    },
    { type: 'interactive', id: 'stp-election', caption: 'Subukan ang iba’t ibang priority at tingnan kung sino ang magiging root bridge.' },
    {
      type: 'terms',
      items: [
        { term: 'Bridge ID', definition: 'Priority + extended system ID (VLAN) + MAC address; the lowest wins the root election.' },
        { term: 'Root path cost', definition: 'Total of the port costs along the best path to the root bridge.' },
        { term: 'Root port', definition: 'The one port on a non-root switch with the best path to the root.' },
        { term: 'Designated port', definition: 'The forwarding port that represents a segment, chosen by lowest root path cost.' },
        { term: 'Alternate port', definition: 'A blocked port that offers a backup path to the root.' },
        { term: 'Extended system ID', definition: 'The VLAN ID added to the priority in PVST+.' },
        { term: 'Sender port ID', definition: 'Port priority plus port number of the neighbour that sent the BPDU; used as the last tie-breaker.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ang buong proseso',
      steps: [
        'Hanapin ang root: pinakamababang priority (+VLAN), tie → pinakamababang MAC.',
        'Para sa bawat non-root switch: root port = pinakamababang total cost; tie → sender bridge ID → sender port priority → sender port number.',
        'Para sa bawat segment: designated port = mas mababang root path cost; tie → mas mababang bridge ID.',
        'Ang port na hindi root at hindi designated ay naka-block (alternate).',
        'Pagkatapos ng changes sa topology, muling kinakalkula ng STP at nagbabago ang mga port state.',
      ],
    },
    {
      type: 'cli',
      title: 'Itakda at i-verify ang root',
      transcript: `SW2(config)# spanning-tree vlan 10 root primary
SW2(config)# interface gigabitEthernet 0/1
SW2(config-if)# spanning-tree vlan 10 cost 10
SW2# show spanning-tree vlan 10
VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    24586
             Address     0000.0c00.0002
             This bridge is the root`,
      copyable: 'spanning-tree vlan 10 root primary\ninterface gigabitEthernet 0/1\nspanning-tree vlan 10 cost 10\nshow spanning-tree vlan 10',
      explain: [
        { line: 'spanning-tree vlan 10 root primary', why: 'Sets the priority low enough (24576 + 10) to win the election for VLAN 10.' },
        { line: 'spanning-tree vlan 10 cost 10', why: 'Overrides the default port cost so this path becomes more or less attractive.' },
        { line: 'This bridge is the root', why: 'show spanning-tree confirms the election result; Root ID and Bridge ID are identical on the root.' },
      ],
      note: 'In show spanning-tree look at the Role (Root, Desg, Altn) and Sts (FWD, BLK) columns for every interface.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang priority ay hindi “32768” sa show output ng VLAN 10 — makikita mo ang **32778** (32768 + 10). Huwag magulat; ang idinagdag na numero ay ang VLAN ID.' },
    { type: 'callout', kind: 'trap', text: 'Ang tie-breaker sa designated port ay **bridge ID**, hindi MAC lang at hindi port number. Ang port number ay para lang sa sender tie-breaker ng root port.' },
    { type: 'callout', kind: 'tip', text: 'Gumuhit ng maliit na diagram sa papel at sulatan ng cost ang bawat link. Kapag nakasulat, kitang-kita ang pinakamababang daan.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Choosing the highest priority or MAC instead of the lowest as root.',
        'Adding cost on the outgoing port instead of accumulating it as BPDUs arrive.',
        'Giving the root bridge a root port; all its ports are designated.',
        'Forgetting that priority changes in steps of 4096.',
        'Leaving the root election to the default, so the oldest switch becomes root.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Maling switch ang root',
      scenario: 'Traffic for VLAN 10 takes a long path through an access-layer switch. show spanning-tree shows that an old access switch (priority 32778) is the root.',
      evidence: `ACC1# show spanning-tree vlan 10
VLAN0010
  Root ID    Priority    32778
             Address     0000.0c00.0001
             This bridge is the root`,
      question: 'Bakit ang access switch ang root at paano ito aayusin?',
      answer: 'All switches kept the default priority, so the one with the lowest MAC address won. That was an old access switch rather than the core.',
      fix: 'On the intended core switch set spanning-tree vlan 10 root primary (and root secondary on the backup core). Verify that the core now shows “This bridge is the root”.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Tatlong switch sa VLAN 1: SW1 priority 32769 MAC 0000.0c00.00bb, SW2 priority 32769 MAC 0000.0c00.00aa, SW3 priority 4097 MAC 0000.0c00.00cc. Sino ang root? Kung ang SW1 ay konektado sa SW2 at SW3 gamit ang 1 Gb/s lang, ano ang root path cost ng SW1?',
      answer: 'SW3 is root: priority 4097 is lowest (MAC only matters on a tie). SW1 reaches SW3 directly with one gigabit link: root path cost 4. The SW1 port toward SW3 is the root port.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Always write each switch’s priority + VLAN first, then compare the MACs only on ties.',
        'Cost accumulates toward the root; the lowest total wins.',
        'Count segments: each has exactly one designated port.',
        'Know the show spanning-tree output: Role and Sts columns.',
        'A port that is neither root nor designated is blocked.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Three ordered decisions: root bridge, root port, designated port.',
        'Lowest wins every comparison.',
        'Bridge ID = priority + VLAN ID + MAC.',
        'Costs: 100, 19, 4, 2 for 10M, 100M, 1G, 10G.',
        'Use root primary/secondary instead of leaving it to chance.',
        'Susunod: palawakin ang kaalaman sa VLAN at trunk configuration.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'What is the PVST+ bridge priority of a switch with default settings in VLAN 10?',
    choices: ['32768', '32769', '32778', '4106'], correct: [2],
    explanation: 'The default priority 32768 is added to the VLAN ID as the extended system ID: 32768 + 10 = 32778.',
    wrong: { 0: 'That is the base priority; the VLAN ID is added.', 1: 'That would be VLAN 1.', 3: 'That would need priority 4096 configured.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'Three switches all use priority 32769 in VLAN 1 with MACs 0000.0c00.00bb, 0000.0c00.00aa and 0000.0c00.00cc. Which is the root bridge?',
    choices: ['…00bb', '…00aa', '…00cc', 'The one with the most links'], correct: [1],
    explanation: 'Priorities tie, so the lowest MAC address wins. …00aa is lower than …00bb and …00cc.',
    wrong: { 0: '…00bb is not the lowest MAC.', 2: '…00cc is the highest MAC.', 3: 'Link count plays no part in the election.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'A non-root switch has a direct 1 Gb/s link to the root and a path of two 1 Gb/s links through another switch. Which port becomes its root port?',
    choices: ['The port on the two-hop path', 'The port on the direct link, with cost 4', 'Both ports', 'Neither; it is the root'], correct: [1],
    explanation: 'The direct path costs 4. The two-hop path costs 8. The lowest total cost wins.',
    wrong: { 0: 'That path costs 8.', 2: 'A non-root switch has only one root port.', 3: 'It is not the root; the root has the lowest bridge ID.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'Two switches have the same root path cost on a shared segment. Which port is designated?',
    choices: ['The one on the switch with the lower bridge ID', 'The one with the higher MAC', 'The one with more VLANs', 'Both ports'], correct: [0],
    explanation: 'The tie-breaker for designated ports is the lower bridge ID.',
    wrong: { 1: 'Lower, not higher, wins.', 2: 'VLAN count is not a tie-breaker.', 3: 'A segment has exactly one designated port.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: every port on the root bridge is a designated port.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'The root bridge has the lowest root path cost (0), so all its ports are designated and forwarding.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO of these are valid STP bridge priority values?',
    choices: ['4096', '5000', '28672', '30000'], correct: [0, 2],
    explanation: 'Priority must be a multiple of 4096: 4096 and 28672 are valid; 5000 and 30000 are not.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'switching', front: 'Pro tip: ano ang BRD sa STP?', back: 'Bridge ID → Root port (cost) → Designated (lowest bridge ID sa segment). Lahat ng port ng root ay designated; ang matitira ay blocked.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'switching', front: 'What is in a PVST+ bridge ID?', back: 'Priority + VLAN ID (extended system ID) + MAC address.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'switching', front: 'Root port tie-breakers, in order?', back: 'Lowest cost, lowest sender bridge ID, lowest sender port priority, lowest sender port number.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'switching', front: 'Default STP path costs?', back: '10M 100, 100M 19, 1G 4, 10G 2.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'switching', front: 'How many designated ports per segment?', back: 'Exactly one.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'switching', front: 'What do root primary and secondary set?', back: 'Priority 24576 (or lower than current root) and 28672.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'switching', front: 'What is an alternate port?', back: 'A blocked port with a backup path to the root.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Predict, then prove: STP on three switches',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Predict the root, root ports, designated ports and the blocked port on a triangle of switches, then confirm with show spanning-tree.',
  steps: [
    'Build three switches in a triangle with 1 Gb/s links. Note each switch’s MAC (show version or show spanning-tree).',
    'On paper, predict the root bridge, each root port, each designated port and the blocked port for VLAN 1.',
    'Run show spanning-tree on each switch and compare with your prediction.',
    'Make a different switch the root with spanning-tree vlan 1 root primary. Predict the new roles first, then verify.',
    'Change the cost on one link (spanning-tree cost 100) and predict which port blocks now.',
    'Shut down the link between the root and one switch and watch the alternate port take over.',
  ],
  checklist: [
    'Prediction written before running show commands',
    'Root bridge confirmed',
    'All port roles match the prediction',
    'Root primary changed the root as expected',
    'Failover observed after shutdown',
  ],
  hints: [
    'Role is shown as Root, Desg or Altn; Sts is FWD or BLK.',
    'After a cost change, run show spanning-tree again; it can take a few seconds to converge.',
  ],
  solution: [
    'With default priorities the switch with the lowest MAC is the root; its ports are all Desg.',
    'On the triangle the non-root switch with the higher bridge ID blocks its port toward the other non-root switch.',
    'After root primary on another switch, the roles recompute from that new root.',
  ],
  breakIt: 'Set the priority of an edge switch to 0 and observe that it becomes the root, then explain why this is a risk and how Root Guard prevents it.',
};
