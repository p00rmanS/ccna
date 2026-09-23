import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'stp-fundamentals';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.7',
  domain: 'D2',
  title: 'STP Fundamentals: Root Bridge and Port Roles',
  description: 'How STP elects the root bridge, chooses root, designated and alternate ports using cost and bridge ID, and moves through port states.',
  whyMatters:
    'Ang STP ay isa sa mga pinaka-“puntos” na paksa sa CCNA. Ang exam ay magbibigay ng diagram na may priority, MAC at cost at itatanong kung sino ang root at aling port ang naka-block. Kapag alam mo ang tatlong hakbang, kaya mo ito sa isang minuto.',
  objectives: [
    'Describe the bridge ID and how the root bridge is elected',
    'Explain root path cost and the standard STP port costs',
    'Choose the root port, designated ports and alternate (blocked) ports',
    'Apply the tie-breakers in the right order',
    'Name the 802.1D port states and their order',
    'Read show spanning-tree and set a bridge priority or root primary',
  ],
  estimatedMinutes: 55,
  difficulty: 'intermediate',
  keywords: ['STP', 'root bridge', 'bridge ID', 'root port', 'designated port', 'alternate port', 'path cost', 'BPDU', 'blocking', 'listening', 'learning', 'forwarding', 'show spanning-tree'],
  examObjectives: ['2.5'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Switches exchange small messages called BPDUs. First they elect one root bridge, the switch with the lowest bridge ID. Every other switch then finds its best path to the root.',
        'On each switch the port with the best path to the root becomes the root port. On each link one side becomes the designated port. Any port that is neither is blocked, which breaks the loop.',
      ],
      taglish: [
        'Ang mga switch ay nagpapalitan ng **BPDU** (maliit na mensahe) tuwing **2 segundo**. Tatlong bagay ang napagpapasyahan nila, **sunod-sunod**:',
        '**Hakbang 1 — Piliin ang ROOT BRIDGE.** Ang panalo ay ang switch na may **pinakamababang Bridge ID** = **priority** (default **32768**) at kapag tabla, **pinakamababang MAC address**. Sa STP, **mababa ang panalo — parang golf.**',
        '**Hakbang 2 — Bawat non-root switch ay pumipili ng ISANG ROOT PORT:** ang port na may **pinakamababang root path cost** papunta sa root. (Costs: 10 Mbps = **100**, 100 Mbps = **19**, 1 Gbps = **4**, 10 Gbps = **2**.) Kapag tabla: mas mababang bridge ID ng nagpapadala, tapos mas mababang port ID.',
        '**Hakbang 3 — Bawat LINK ay may ISANG DESIGNATED PORT:** ang panig na may **mas mababang root path cost** (kapag tabla, ang **mas mababang bridge ID**). Ang **lahat ng port ng root bridge** ay designated. **Ang natitirang port ay ALTERNATE — naka-BLOCK.**',
        'Bago mag-forward ang isang port sa 802.1D, dumadaan ito sa **Blocking → Listening → Learning → Forwarding**. Kaya ang classic STP ay inaabot ng hanggang **~50 segundo** para mag-converge (kaya may Rapid PVST+ sa susunod).',
      ],
      technical: [
        'Bridge ID (8 bytes) = 16-bit priority field + 48-bit MAC. In PVST+ the priority field is a 4-bit priority (multiples of 4096, default 32768) plus the 12-bit VLAN ID as the extended system ID, so VLAN 10 with priority 32768 advertises 32778. The switch with the numerically lowest bridge ID is the root; the priority is compared first, then the MAC address.',
        'Switches send configuration BPDUs from the root every hello time (2 s). Timers: hello 2 s, forward delay 15 s, max age 20 s. Classic 802.1D reconverges after a topology change in up to max age + 2 × forward delay = 50 s.',
        'Root path cost is the sum of port costs on the path to the root. Default short path costs: 10 Mbps = 100, 100 Mbps = 19, 1 Gbps = 4, 10 Gbps = 2 (the long method used by RSTP-capable modes uses larger values such as 20,000 for 1 Gbps).',
        'Port role selection: (1) One root bridge per VLAN; all its ports are designated. (2) Each non-root bridge selects one root port, lowest root path cost; ties broken by lowest sender bridge ID, then lowest sender port priority, then lowest sender port number. (3) On each segment the port with the lowest root path cost (then lowest bridge ID) is the designated port. (4) Remaining ports are non-designated (alternate) and block.',
        '802.1D states: Disabled, Blocking (receives BPDUs only, 20 s max age), Listening (15 s, sends and receives BPDUs, no MAC learning), Learning (15 s, learns MAC addresses, no user traffic), Forwarding (normal operation). Commands: show spanning-tree [vlan N], spanning-tree vlan N priority VALUE, spanning-tree vlan N root primary|secondary (macro that sets 24576 / 28672 or lower than the current root as needed).',
      ],
    },
    {
      type: 'analogy',
      title: 'Halalan at paligsahan ng golf',
      body: [
        'STP is an election where the lowest score wins, like golf. First the whole network picks a leader (root). Then every other switch picks its shortest road to the leader. Finally each link gets one gatekeeper. Any door with no gatekeeper is locked.',
      ],
      taglish: [
        'Ang STP ay **halalan kung saan ang pinakamababang score ang panalo — parang golf**. Una, pipili ang buong network ng **lider (root)**. Pangalawa, ang bawat switch ay pipili ng **pinakamaikling daan papunta sa lider**. Pangatlo, bawat link ay may **isang bantay (designated)**. Ang pinto na walang bantay ay **isinasara (block)**.',
      ],
    },
    {
      type: 'hook',
      title: 'GOLF at 1-1-1',
      trick: '**GOLF: pinakamababa ang panalo. 1 root bridge · 1 root port bawat non-root switch · 1 designated port bawat link · ang sobra = BLOCK.**',
      taglish: [
        'Sa **root election**, **GOLF** ang rule: **pinakamababang priority**, tapos **pinakamababang MAC**. Kahit mataas ang MAC, kung mas mababa ang priority — panalo.',
        'Bilangin: **1-1-1**. **1 root bridge** sa buong network. **1 root port** sa bawat non-root switch. **1 designated port** sa bawat link. **Ang natitirang port ay naka-block.**',
        'Mga role: **Root = daan papunta sa Root.** **Designated = Dinadaanan ng lahat (nagpapasa).** **Alternate = Ayaw padaanin (block).**',
        'Mga state: **Bawal → Lingon → Lista → Lakad** = **Blocking → Listening → Learning → Forwarding.** Bawal (nakikinig lang), Lingon (nakikinig at nagpapadala ng BPDU), Lista (nagtatala ng MAC), Lakad (nagpapasa ng frame).',
        'Costs: **100 — 19 — 4 — 2** = 10M — 100M — 1G — 10G. Tandaan na “**mas mabilis, mas mababa ang cost**”.',
      ],
      test: {
        question: 'SW-A: priority 32768, MAC …0001. SW-B: priority 24576, MAC …0009. SW-C: priority 32768, MAC …0000. Sino ang root? Ilan ang root port sa buong triangle at ilan ang naka-block?',
        answer: 'SW-B ang root (GOLF: pinakamababang priority 24576, kahit mataas ang MAC niya). 1-1-1: dalawang non-root switch = 2 root port; sa triangle may 3 link at 2 ang papunta sa root, kaya ang ikatlong link ay may 1 designated at 1 alternate = 1 naka-block port.',
      },
    },
    { type: 'diagram', id: 'stp-roles', caption: 'Triangle ng tatlong switch: si SW1 ang root, RP = root port, DP = designated, ALT = naka-block.' },
    { type: 'interactive', id: 'stp-election', caption: 'Baguhin ang priority at speed. Tingnan kung sino ang nagiging root at aling port ang nagba-block. Si SW3 ang may pinakamababang MAC.' },
    {
      type: 'terms',
      items: [
        { term: 'BPDU', definition: 'Bridge Protocol Data Unit, the STP message switches exchange (hello every 2 s).' },
        { term: 'Bridge ID', definition: 'Priority (plus VLAN ID) followed by the MAC address. Lowest wins.' },
        { term: 'Root bridge', definition: 'The switch with the lowest bridge ID. All its ports are designated.' },
        { term: 'Root port', definition: 'On a non-root switch, the port with the lowest root path cost. Forwards.' },
        { term: 'Designated port', definition: 'The forwarding port that owns a segment. One per link.' },
        { term: 'Alternate port', definition: 'A non-designated port that blocks user traffic.' },
        { term: 'Root path cost', definition: 'Sum of the port costs on the path to the root.' },
        { term: 'Port cost', definition: 'Default: 100 (10M), 19 (100M), 4 (1G), 2 (10G).' },
        { term: 'Extended system ID', definition: 'The VLAN ID added to the priority in PVST+ (32768 + 10 = 32778).' },
        { term: 'Blocking / Listening / Learning / Forwarding', definition: 'The 802.1D port states, in order.' },
      ],
    },
    {
      type: 'flow',
      title: 'Hulaan ang resulta: triangle na may parehong cost 4',
      steps: [
        'Priority ng tatlo ay 32768 (tabla). **Ihambing ang MAC**: SW3 = `…0001` ang pinakamababa, kaya **SW3 ang ROOT**.',
        'Ang lahat ng port ng SW3 ay **designated** (root bridge).',
        'Ang SW1 at SW2 ay **non-root**: bawat isa ay pipili ng **root port** — ang direktang link papunta sa SW3 (cost 4 ang pinakamura).',
        'Ang natitirang link ay **SW1–SW2**. Parehong may root path cost na 4 ang dalawa, kaya **tabla sa cost**.',
        'Tie-break: **mas mababang bridge ID** — ang SW2 (MAC …0002) ang panalo laban sa SW1 (MAC …0003), kaya ang **SW2 ay designated** sa link na iyon.',
        'Ang natitirang port ay ang **SW1 papunta sa SW2 = ALTERNATE (BLOCK)**. Buo na ang loop-free na topology.',
      ],
    },
    {
      type: 'cli',
      title: 'Basahin ang show spanning-tree',
      transcript: `SW2# show spanning-tree vlan 1
VLAN0001
  Spanning tree enabled protocol ieee
  Root ID    Priority    32769
             Address     00aa.aaaa.0001
             Cost        4
             Port        25(GigabitEthernet0/1)
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32769  (priority 32768 sys-id-ext 1)
             Address     00aa.aaaa.0002
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  300 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi0/1               Root FWD 4         128.25   P2p
Gi0/2               Desg FWD 4         128.26   P2p

SW2(config)# spanning-tree vlan 1 priority 4096
SW2(config)# spanning-tree vlan 10 root primary`,
      copyable: 'show spanning-tree vlan 1',
      explain: [
        { line: 'Root ID … Address 00aa.aaaa.0001', why: 'This is the root bridge, not this switch. The bridge ID of the root is shown in the Root ID block.' },
        { line: 'Cost 4 · Port 25(GigabitEthernet0/1)', why: 'This switch’s root path cost is 4 and its root port is Gi0/1. If this switch were the root, the output would say “This bridge is the root”.' },
        { line: 'Bridge ID Priority 32769 (priority 32768 sys-id-ext 1)', why: 'This switch’s own ID: the default 32768 plus the VLAN number 1.' },
        { line: 'Gi0/1 Root FWD', why: 'Root port, forwarding.' },
        { line: 'Gi0/2 Desg FWD', why: 'Designated port, forwarding. A blocked port would show Altn BLK.' },
        { line: 'spanning-tree vlan 1 priority 4096', why: 'Lowers this switch’s priority so it wins the election. Values must be multiples of 4096.' },
        { line: 'spanning-tree vlan 10 root primary', why: 'A macro that sets the priority low enough (24576, or lower than the current root) to become root for VLAN 10.' },
      ],
      note: 'Sample output for study. Real port numbers depend on the switch model.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **lowest priority ang inuuna, hindi ang lowest MAC.** Kapag may switch na mas mababa ang priority, panalo siya kahit mas mataas ang MAC. Ang MAC ay tie-breaker lang.' },
    { type: 'callout', kind: 'trap', text: 'Ang **root bridge ay walang root port**, at **lahat ng port niya ay designated**. Ang bawat **non-root** switch ay may **eksaktong isang root port**.' },
    { type: 'callout', kind: 'trap', text: 'Ang **priority ay kailangang multiple ng 4096** (0–61440). At sa PVST+ idinadagdag ang **VLAN ID**: 32768 sa VLAN 10 = **32778**. Kaya kapag nakita mo ang 32778, iyon ay default priority ng VLAN 10.' },
    { type: 'callout', kind: 'tip', text: 'Kapag hinahanap ang naka-block na port sa diagram: hanapin muna ang **root**, markahan ang **root port** ng bawat switch, saka ang **designated** sa bawat link. Ang **walang marka** ay **naka-block**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Choosing the root by lowest MAC when the priorities differ.',
        'Forgetting that a lower cost means a faster link (Gigabit is 4, FastEthernet is 19).',
        'Giving the root bridge a root port. It has none.',
        'Setting a priority that is not a multiple of 4096.',
        'Comparing bridge IDs without adding the VLAN ID in PVST+.',
        'Assuming the port role is chosen only by cost. Ties go to bridge ID, then port ID.',
        'Expecting instant convergence with classic STP. It can take up to about 50 seconds.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: “Bakit ang luma at mabagal na switch ang root?”',
      scenario: 'The company’s oldest access switch, in a closet, became the root bridge for VLAN 1. Traffic between two core switches now takes a slow path through it.',
      evidence: `CORE1# show spanning-tree vlan 1 | include Root|Address
  Root ID    Priority    32769
             Address     0001.4200.00aa`,
      question: 'Bakit siya ang nanalo at paano mo ito aayusin?',
      answer: 'All switches kept the default priority 32768, so the election fell to the lowest MAC address, which is an old switch with a very low MAC. Nobody planned the root, so an unintended switch won.',
      fix: 'Choose the root deliberately: on the core switch enter spanning-tree vlan 1 root primary (or priority 4096) and on a backup core switch spanning-tree vlan 1 root secondary. Verify with show spanning-tree.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Triangle: SW-A (priority 32768, MAC …aa), SW-B (32768, …bb), SW-C (32768, …cc). Lahat ng link ay FastEthernet (cost 19). Sino ang root? Ano ang role ng bawat port sa link B–C?',
      answer: 'SW-A is root (lowest MAC on a priority tie). SW-B and SW-C each have a root port toward A (cost 19). On the B–C link both offer a root path cost of 19, so the tie goes to the lower bridge ID: B has the designated port and C has the alternate (blocked) port.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Lowest bridge ID wins: priority first, then MAC. Default priority 32768; step 4096.',
        'One root bridge; one root port per non-root switch; one designated port per link; the rest block.',
        'Costs: 10M = 100, 100M = 19, 1G = 4, 10G = 2.',
        'Tie-breakers for root port: lowest sender bridge ID, then lowest port priority, then lowest port number.',
        '802.1D states: blocking, listening, learning, forwarding. Up to about 50 s to converge.',
        'PVST+ adds the VLAN ID to the priority (extended system ID).',
      ],
    },
    {
      type: 'summary',
      points: [
        'STP elects a root bridge: lowest priority, then lowest MAC (GOLF).',
        'Each non-root switch keeps one root port; each link keeps one designated port; the rest block.',
        'Costs: 100, 19, 4, 2 for 10M, 100M, 1G, 10G.',
        'States in order: Blocking, Listening, Learning, Forwarding.',
        'Verify with show spanning-tree; choose the root with priority or root primary.',
        'Susunod: Rapid PVST+ para sa mas mabilis na convergence at ang mga proteksyon gaya ng PortFast at BPDU Guard.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'How is the STP root bridge chosen?',
    choices: ['The switch with the highest MAC address', 'The switch with the lowest bridge ID', 'The switch with the most ports', 'The switch that booted first'], correct: [1],
    explanation: 'The lowest bridge ID (priority, then MAC address) wins the election.',
    wrong: { 0: 'Lower is better in STP.', 2: 'Port count is irrelevant.', 3: 'Boot order is irrelevant.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'What is the default STP bridge priority on a Cisco switch?',
    choices: ['0', '4096', '32768', '61440'], correct: [2],
    explanation: 'The default priority is 32768 (increments of 4096).',
    wrong: { 0: '0 is the best possible value, not the default.', 1: '4096 is a common manual choice for a root.', 3: '61440 is the highest configurable value.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'SW-A has priority 32768 and MAC 00aa.0000.0001. SW-B has priority 24576 and MAC 00aa.0000.0009. SW-C has priority 32768 and MAC 00aa.0000.0000. Which is the root bridge?',
    choices: ['SW-A', 'SW-B', 'SW-C', 'They tie'], correct: [1],
    explanation: 'Priority is compared first. SW-B has the lowest priority (24576), so it wins despite having the highest MAC.',
    wrong: { 0: 'SW-A has neither the lowest priority nor the lowest MAC.', 2: 'SW-C has the lowest MAC, but MAC only matters when priorities tie.', 3: 'The priorities differ.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'What is the default STP path cost of a 1 Gbps link?',
    choices: ['100', '19', '4', '2'], correct: [2],
    explanation: 'Classic STP costs: 10 Mbps = 100, 100 Mbps = 19, 1 Gbps = 4, 10 Gbps = 2.',
    wrong: { 0: '100 is for 10 Mbps.', 1: '19 is for 100 Mbps.', 3: '2 is for 10 Gbps.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'What is the role of every port on the root bridge?',
    choices: ['Root port', 'Designated port', 'Alternate port', 'Disabled'], correct: [1],
    explanation: 'All ports on the root bridge are designated ports and forward traffic.',
    wrong: { 0: 'The root bridge has no root port.', 2: 'It blocks nothing.', 3: 'Only administratively shut ports are disabled.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'A non-root switch reaches the root through a FastEthernet link (19) directly, or through two Gigabit links (4 + 4). Which port becomes its root port?',
    choices: ['The FastEthernet port, because it is one hop', 'The port toward the Gigabit path, because 8 is lower than 19', 'Whichever port came up first', 'Both become root ports'], correct: [1],
    explanation: 'STP compares total root path cost, not hop count. 4 + 4 = 8 is lower than 19.',
    wrong: { 0: 'Hop count is not used.', 2: 'Order of coming up is not a criterion.', 3: 'Exactly one root port per non-root switch.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'Which sequence lists the classic 802.1D port states in the order a port passes through them?',
    choices: ['Blocking, listening, learning, forwarding', 'Listening, blocking, forwarding, learning', 'Learning, listening, blocking, forwarding', 'Disabled, forwarding, learning, blocking'], correct: [0],
    explanation: 'Blocking → Listening → Learning → Forwarding.',
    wrong: { 1: 'Listening does not come before blocking.', 2: 'Learning comes after listening.', 3: 'Forwarding is the last state.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'Which command makes a switch the root bridge for VLAN 10 by using a macro?',
    choices: ['spanning-tree vlan 10 root primary', 'spanning-tree vlan 10 root', 'spanning-tree root vlan 10', 'switchport root vlan 10'], correct: [0],
    explanation: 'spanning-tree vlan 10 root primary lowers the priority enough to become the root for VLAN 10.',
    wrong: { 1: 'The keyword primary or secondary is required.', 2: 'The word order is wrong.', 3: 'Not a valid command.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'hard', type: 'single',
    prompt: 'A switch has default priority 32768 and is in VLAN 10. What priority value does it advertise in its bridge ID under PVST+?',
    choices: ['32768', '32778', '32770', '4106'], correct: [1],
    explanation: 'PVST+ adds the VLAN ID (extended system ID) to the priority: 32768 + 10 = 32778.',
    wrong: { 0: 'That ignores the extended system ID.', 2: 'That would be VLAN 2.', 3: 'Not related.' },
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'hard', type: 'single',
    prompt: 'Two paths from a non-root switch to the root have the same total cost. Which criterion is applied first to choose the root port?',
    choices: ['Lowest port number on the local switch', 'Lowest bridge ID of the sending (upstream) switch', 'Highest MAC address', 'Highest port priority'], correct: [1],
    explanation: 'Ties in root path cost are broken by the lowest sender bridge ID, then the lowest sender port priority and number.',
    wrong: { 0: 'The local port number is not the first tie-breaker.', 2: 'Lower values win, not higher.', 3: 'Lower priority values win, and it is the sender’s port priority.' },
  },
  {
    id: `${ID}-q11`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO values make up the bridge ID used in the root election?',
    choices: ['Bridge priority (with the VLAN ID)', 'Switch MAC address', 'IP address', 'Number of ports'], correct: [0, 1],
    explanation: 'The bridge ID is the priority (plus VLAN ID in PVST+) followed by the switch MAC address.',
  },
  {
    id: `${ID}-q12`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: every non-root switch has exactly one root port.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'Each non-root switch chooses one port with the best path to the root as its root port.',
  },
  {
    id: `${ID}-q13`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'hard', type: 'single',
    prompt: 'What is the maximum time classic 802.1D STP can take for a blocked port to start forwarding after a failure?',
    choices: ['About 2 seconds', 'About 15 seconds', 'About 50 seconds', 'About 5 minutes'], correct: [2],
    explanation: 'Max age (20 s) plus listening (15 s) and learning (15 s) gives up to about 50 seconds.',
    wrong: { 0: '2 seconds is the hello interval.', 1: '15 seconds is one forward-delay period.', 3: 'Far longer than 802.1D takes.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: paano tandaan ang STP?', back: 'GOLF: pinakamababa ang panalo (priority muna, MAC pangalawa). 1-1-1: 1 root bridge · 1 root port bawat non-root switch · 1 designated bawat link · ang sobra = block. States: Bawal → Lingon → Lista → Lakad (Blocking, Listening, Learning, Forwarding). Cost 100·19·4·2.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'How is the root bridge elected?', back: 'Lowest bridge ID: priority first (default 32768), then MAC address.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'concept', front: 'STP path costs?', back: '10 Mbps 100 · 100 Mbps 19 · 1 Gbps 4 · 10 Gbps 2.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Port roles and how many of each?', back: 'One root bridge; one root port per non-root switch; one designated port per link; other ports are alternate (blocked).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Root port tie-breakers?', back: 'Lowest root path cost, then lowest sender bridge ID, then lowest sender port priority, then lowest sender port number.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'concept', front: '802.1D port states in order?', back: 'Blocking → Listening → Learning → Forwarding (up to ~50 s).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'concept', front: 'STP timers?', back: 'Hello 2 s · Forward delay 15 s · Max age 20 s.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D2', category: 'command', front: 'Make a switch the root for VLAN 10?', back: 'spanning-tree vlan 10 root primary (or spanning-tree vlan 10 priority 4096)' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D2', category: 'command', front: 'Command to inspect STP?', back: 'show spanning-tree [vlan N] — Root ID vs Bridge ID, and Role/Sts per interface.' },
  { id: `${ID}-f9`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Priority values and VLAN ID?', back: 'Multiples of 4096 (0–61440). PVST+ adds the VLAN ID: 32768 + 10 = 32778.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Predict, verify and steer the root bridge',
  tool: 'Packet Tracer',
  minutes: 45,
  objective: 'Predict the root bridge and port roles on a switch triangle, verify with show spanning-tree, then move the root and watch a port change state.',
  topology: 'Three 2960 switches (SW1, SW2, SW3) in a triangle with Gigabit links: SW1 Gi0/1–SW2 Gi0/1, SW2 Gi0/2–SW3 Gi0/1, SW3 Gi0/2–SW1 Gi0/2. No hosts needed.',
  steps: [
    'Build the triangle. Wait for the ports to turn from amber to green.',
    'On each switch run show spanning-tree vlan 1. Write down each switch’s Bridge ID (priority and MAC).',
    'Predict: which switch is the root, which port is the root port on each other switch, and which single port is blocked. Use GOLF and 1-1-1.',
    'Verify your prediction with show spanning-tree on all three switches (look for “This bridge is the root”, Root/Desg/Altn).',
    'Use the STP election interactive above to model your lab and compare.',
    'Make SW1 the root: spanning-tree vlan 1 priority 4096. Re-run show spanning-tree everywhere and note what changed.',
    'Shut down the active root port on the switch that has a blocked port, and watch the blocked port move from blocking through listening and learning to forwarding (in Packet Tracer the light turns amber, then green).',
    'Restore the link and note which port blocks again.',
  ],
  checklist: [
    'Predicted the root and blocked port before checking',
    'Read Root ID vs Bridge ID correctly',
    'Moved the root with priority 4096',
    'Observed a blocked port take over after a link failure',
  ],
  hints: [
    'If priorities are default, compare MAC addresses: the lowest wins.',
    'The blocked port is on the non-root switch that lost the tie on the link between the two non-root switches.',
  ],
  solution: [
    'Default priorities: the switch with the lowest MAC is root; every other switch has a root port toward it; the link between the two non-root switches has one designated and one alternate port.',
    'spanning-tree vlan 1 priority 4096 on SW1 makes SW1 the root regardless of MAC.',
    'After shutting the active path, the alternate port passes through blocking, listening and learning before it forwards (about 30–50 s in classic STP).',
  ],
  breakIt: 'Set SW2 priority to 4096 as well as SW1. Now the tie goes to the lower MAC. Use show spanning-tree to prove which switch won and why.',
};
