import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'trunking';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.4',
  domain: 'D2',
  title: 'Trunking and 802.1Q',
  description: 'How one cable carries many VLANs: 802.1Q tagging, the native VLAN, allowed VLANs and DTP, with configuration and verification.',
  whyMatters:
    'Sa totoong network, hindi mo kayang magpatakbo ng isang cable para sa bawat VLAN. Ang trunk ang dahilan kung bakit gumagana ang VLAN sa maraming switch. Paborito ito ng exam: native VLAN mismatch, allowed VLAN list at `show interfaces trunk`.',
  objectives: [
    'Explain why trunks exist and what 802.1Q adds to a frame',
    'Describe the native VLAN and why a mismatch is a problem',
    'Configure a static trunk with a native VLAN and an allowed VLAN list',
    'Use add, remove and the plain list correctly',
    'Explain DTP modes (dynamic auto, dynamic desirable) and what they negotiate',
    'Verify with show interfaces trunk and show interfaces switchport',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['trunk', '802.1Q', 'native VLAN', 'allowed VLANs', 'DTP', 'dynamic auto', 'dynamic desirable', 'show interfaces trunk', 'switchport mode trunk'],
  examObjectives: ['2.2'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A trunk is a link between switches (or a switch and a router) that carries traffic for many VLANs at once. To keep the VLANs apart, each frame gets a small 802.1Q tag that names its VLAN.',
        'One VLAN, the native VLAN, is sent without a tag. Both ends of the trunk must agree on which VLAN that is.',
      ],
      taglish: [
        'Ang **trunk** ay link sa pagitan ng dalawang switch (o switch at router) na **nagdadala ng maraming VLAN sa iisang cable**. Kung walang trunk, kailangan mo ng isang cable **bawat VLAN** — hindi praktikal.',
        'Paano hindi maghalo-halo ang mga VLAN? Nilalagyan ng **802.1Q tag** ang bawat frame. Ang tag ay **4 bytes** na nagsasabi kung **anong VLAN** ang frame (VLAN ID na 1–4094). Tinatanggal ito ng kabilang switch bago ihatid sa access port.',
        'Ang **native VLAN** ay ang **nag-iisang VLAN na walang tag** sa trunk. Default ay **VLAN 1**. Dapat **pareho ang native VLAN sa dalawang dulo** — kapag hindi, may leak at may error message. Best practice: gumamit ng **hindi ginagamit na VLAN** (halimbawa 99) bilang native.',
        'Pwede mo ring limitahan kung **aling VLAN ang pinapayagan** sa trunk (`allowed vlan`). At may **DTP** na nag-uusap ng trunk automatically — pero mas ligtas ang **static trunk** (`switchport mode trunk`).',
      ],
      technical: [
        'IEEE 802.1Q inserts a 4-byte tag between the source MAC address and the EtherType/length field: a 16-bit TPID (0x8100), 3-bit priority code point (PCP, used for 802.1p CoS), 1-bit drop eligible indicator (DEI) and a 12-bit VLAN ID (1–4094). Because the frame grows by 4 bytes, the FCS is recalculated; the maximum frame size becomes 1522 bytes.',
        'The native VLAN is sent and received untagged on an 802.1Q trunk. It defaults to VLAN 1 and is configured per port with switchport trunk native vlan N. If the two ends disagree, untagged frames are placed into different VLANs on each side (VLAN leakage) and CDP or STP logs a native VLAN mismatch. Best practice is a dedicated, unused native VLAN and not using VLAN 1 for user traffic.',
        'By default a trunk carries VLANs 1–4094. switchport trunk allowed vlan LIST replaces the entire list; add, remove, all, none and except modify or reset it. A VLAN is carried only if it exists on the switch, is allowed on the trunk and is not blocked by STP.',
        'Dynamic Trunking Protocol (DTP) negotiates the trunk state between two Cisco ports. dynamic auto (default on many Catalyst models) waits to be asked; dynamic desirable actively asks. Trunk forms if either side is on or desirable and the other is on, auto or desirable. auto + auto stays an access link. switchport nonegotiate stops DTP frames. On switches that support both ISL and 802.1Q you must first set switchport trunk encapsulation dot1q; 2960-class switches support only 802.1Q.',
      ],
    },
    {
      type: 'analogy',
      title: 'Isang tren, maraming pasahero',
      body: [
        'A trunk is a train that carries passengers from many VLANs. Each passenger wears a ticket (the 802.1Q tag) that shows which VLAN they belong to. One passenger, the native VLAN, rides free with no ticket, so both stations must agree who that passenger is.',
      ],
      taglish: [
        'Ang **trunk** ay **isang tren** na may sakay na pasahero mula sa **maraming VLAN**. Bawat pasahero ay may **tiket (tag)** na nagsasabi kung saang VLAN siya. May **isang pasahero na libre — walang tiket — ang native VLAN**, kaya kailangang **magkasundo ang dalawang istasyon** kung sino ito.',
      ],
    },
    {
      type: 'hook',
      title: 'Tren, tiket, at libreng pasahero',
      trick: '**TRUNK = TREN. Lahat may TIKET (tag), maliban sa NATIVE — libre siya. Pareho dapat ang libreng pasahero sa dalawang istasyon.**',
      taglish: [
        'Kapag tinanong ang **802.1Q**: **tiket = 4 bytes**, naglalaman ng **VLAN ID**.',
        'Kapag tinanong ang **native VLAN**: **walang tiket**, default **VLAN 1**, at **dapat magkapareho** sa dalawang dulo.',
        'Para sa `show interfaces trunk`, tandaan ang **4 na talaan**: **Mode/Native — Allowed — Active — Forwarding**. Mula malawak hanggang makitid: ang bawat talaan ay **mas kaunti o pareho** sa nauna.',
        'Sa allowed list: **walang salita = PALITAN. `add` = DAGDAG.** Kapag nag-type ka ng `allowed vlan 30`, **30 na lang ang matitira**. Gamitin ang `add 30` kung idadagdag lang.',
      ],
      test: {
        question: 'Ang trunk ay may allowed VLAN 10,20,99. Nag-type ka ng `switchport trunk allowed vlan 30`. Anong VLAN ang pinapayagan ngayon? Ano ang dapat mong tinype?',
        answer: 'Tanging VLAN 30 na lang. Walang salitang “add” = pinalitan ang buong listahan. Dapat `switchport trunk allowed vlan add 30` para maging 10,20,30,99.',
      },
    },
    { type: 'diagram', id: 'dot1q-trunk', caption: 'Isang trunk cable, maraming VLAN. Ang 802.1Q tag ay 4 bytes na idinadagdag pagkatapos ng source MAC.' },
    {
      type: 'terms',
      items: [
        { term: 'Trunk', definition: 'A link that carries frames for multiple VLANs.' },
        { term: '802.1Q', definition: 'IEEE standard for VLAN tagging on Ethernet trunks. Adds a 4-byte tag.' },
        { term: 'VLAN tag', definition: 'TPID 0x8100, 3-bit priority, 1-bit DEI, 12-bit VLAN ID.' },
        { term: 'Native VLAN', definition: 'The one VLAN sent untagged on an 802.1Q trunk. Default VLAN 1.' },
        { term: 'Allowed VLAN list', definition: 'The VLANs a trunk is permitted to carry. Default 1–4094.' },
        { term: 'DTP', definition: 'Cisco Dynamic Trunking Protocol. Negotiates whether a link becomes a trunk.' },
        { term: 'Dynamic auto', definition: 'Becomes a trunk only if the other side asks. Common default.' },
        { term: 'Dynamic desirable', definition: 'Actively asks the other side to become a trunk.' },
        { term: 'ISL', definition: 'Older Cisco-proprietary trunk encapsulation. Not on 2960-class switches.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ang biyahe ng frame ng VLAN 10 sa trunk',
      steps: [
        'Ang **PC1** (VLAN 10, access port sa SW1) ay nagpapadala ng **normal na frame** — walang tag.',
        'Nakita ng **SW1** na nasa VLAN 10 ang ingress port, kaya kapag palabas sa trunk, **nagdadagdag siya ng 802.1Q tag na “10”**.',
        'Ang tagged na frame ay dumadaan sa **trunk** papunta sa SW2.',
        'Binasa ng **SW2** ang tag, alam na VLAN 10 ito, at **gagamitin ang MAC table ng VLAN 10 lang**.',
        '**Tinanggal** ng SW2 ang tag at inilabas ang frame sa **access port na nasa VLAN 10**. Ang PC2 ay walang alam sa tag.',
        'Kung ang frame ay galing sa **native VLAN**, walang tag ang dumaan at ang kabilang dulo ang nagdesisyon ng VLAN gamit ang sarili niyang native VLAN.',
      ],
    },
    {
      type: 'cli',
      title: 'Static trunk na may native VLAN at allowed list',
      transcript: `SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 99
SW1(config-if)# switchport trunk allowed vlan 10,20,99
SW1(config-if)# end
SW1# show interfaces trunk

Port        Mode         Encapsulation  Status        Native vlan
Gi0/1       on           802.1q         trunking      99

Port        Vlans allowed on trunk
Gi0/1       10,20,99

Port        Vlans allowed and active in management domain
Gi0/1       10,20,99

Port        Vlans in spanning tree forwarding state and not pruned
Gi0/1       10,20,99`,
      copyable: 'show interfaces trunk',
      explain: [
        { line: 'switchport mode trunk', why: 'Makes the port a trunk unconditionally (Mode “on”). It still sends DTP frames unless you add switchport nonegotiate.' },
        { line: 'switchport trunk native vlan 99', why: 'Changes the untagged VLAN from 1 to 99. The other switch must use 99 as well.' },
        { line: 'switchport trunk allowed vlan 10,20,99', why: 'Replaces the allowed list. Only these VLANs cross the trunk.' },
        { line: 'Mode on, 802.1q, trunking', why: 'The trunk is up, using 802.1Q, and its native VLAN is 99.' },
        { line: 'Four tables', why: 'Mode/native, then allowed, then allowed-and-active (VLANs that exist on this switch), then forwarding (not blocked by STP).' },
      ],
      note: 'Practise it in CLI practice → “Build a trunk to the next switch”. On multilayer switches that also support ISL, run switchport trunk encapsulation dot1q before switchport mode trunk.',
    },
    { type: 'callout', kind: 'trap', text: '**`switchport trunk allowed vlan 30` ay PALIT, hindi dagdag.** Kapag may 10,20,99 na at nag-type ka nito, 30 na lang ang matitira at **babagsak ang VLAN 10, 20 at 99** sa trunk. Gamitin ang `add`.' },
    { type: 'callout', kind: 'trap', text: '**Native VLAN mismatch:** kapag VLAN 1 ang native sa isang dulo at VLAN 99 sa kabila, ang mga untagged na frame ay mapupunta sa **magkaibang VLAN**. Lalabas ang `%CDP-4-NATIVE_VLAN_MISMATCH` at may STP inconsistency. Ang trunk ay “up” pa rin, kaya madaling makaligtaan.' },
    { type: 'callout', kind: 'trap', text: '**Dynamic auto + dynamic auto = HINDI trunk.** Parehong naghihintay na hilingin. Ang link ay nagiging access. Kailangan ng kahit isang dulo na `trunk` o `dynamic desirable`.' },
    { type: 'callout', kind: 'tip', text: 'Best practice: **static trunk** (`switchport mode trunk`) + **`switchport nonegotiate`** at **native VLAN na hindi ginagamit**. Mas kaunting sorpresa kaysa sa DTP.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Typing allowed vlan LIST when you meant add, wiping out the VLANs already carried.',
        'Leaving the two ends with different native VLANs.',
        'Expecting dynamic auto on both ends to form a trunk.',
        'Forgetting that a VLAN must exist on the switch as well as be allowed on the trunk.',
        'Using a trunk port as an access port for a PC, or the reverse.',
        'Searching for the trunk in show vlan brief instead of show interfaces trunk.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: “Hindi umaabot ang VLAN 20 sa kabilang switch”',
      scenario: 'PCs in VLAN 10 work across the trunk between SW1 and SW2, but PCs in VLAN 20 on SW2 cannot reach the server on SW1. The trunk shows as up.',
      evidence: `SW1# show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gi0/1       on           802.1q         trunking      99

Port        Vlans allowed on trunk
Gi0/1       10,99`,
      question: 'Bakit hindi dumadaan ang VLAN 20?',
      answer: 'VLAN 20 is not in the trunk’s allowed list (10,99). The trunk is healthy but it will not carry VLAN 20 frames.',
      fix: 'Add it without wiping the others: interface g0/1 → switchport trunk allowed vlan add 20. Then confirm with show interfaces trunk that 10,20,99 appear in every table.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'SW1 Gi0/1 ay trunk na may native VLAN 99. Sa SW2, walang naka-configure na native VLAN sa trunk port. Anong mangyayari sa mga untagged frame? Paano mo aayusin?',
      answer: 'SW1 sends untagged frames for VLAN 99, but SW2 treats untagged frames as its native VLAN (1), so traffic leaks between VLAN 99 and VLAN 1 and CDP logs a native VLAN mismatch. Fix: configure switchport trunk native vlan 99 on SW2’s trunk port and verify both ends with show interfaces trunk.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        '802.1Q tag = 4 bytes; VLAN ID is 12 bits.',
        'Native VLAN is untagged and must match on both ends. Default is VLAN 1.',
        'allowed vlan LIST replaces; add, remove, except modify.',
        'auto + auto = access. desirable + auto = trunk. on + anything dynamic = trunk.',
        'show interfaces trunk has four tables; show interfaces g0/1 switchport shows the admin and operational mode.',
      ],
    },
    {
      type: 'summary',
      points: [
        'A trunk carries many VLANs over one link using 802.1Q tags (4 bytes).',
        'The native VLAN is untagged, default VLAN 1, and must match on both ends.',
        'The allowed list controls which VLANs cross. A plain list replaces, add appends.',
        'Static trunk beats negotiation: switchport mode trunk (+ nonegotiate).',
        'Verify with show interfaces trunk (four tables).',
        'Susunod: paano magkausap ang dalawang VLAN — inter-VLAN routing.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.2', difficulty: 'easy', type: 'single',
    prompt: 'How large is the 802.1Q tag that is added to an Ethernet frame?',
    choices: ['2 bytes', '4 bytes', '8 bytes', '12 bytes'], correct: [1],
    explanation: 'The 802.1Q tag is 4 bytes: a 2-byte TPID and a 2-byte field holding priority, DEI and the 12-bit VLAN ID.',
    wrong: { 0: 'The TPID alone is 2 bytes; the whole tag is 4.', 2: 'The tag is smaller than 8 bytes.', 3: 'That is far too large; 12 is the number of VLAN ID bits.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.2', difficulty: 'easy', type: 'single',
    prompt: 'What is the default native VLAN on an 802.1Q trunk?',
    choices: ['VLAN 0', 'VLAN 1', 'VLAN 99', 'VLAN 1002'], correct: [1],
    explanation: 'The native VLAN defaults to VLAN 1.',
    wrong: { 0: 'VLAN 0 is not used for this.', 2: '99 is a common custom choice but is not the default.', 3: '1002 is a reserved legacy VLAN.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.2', difficulty: 'medium', type: 'single',
    prompt: 'How are frames of the native VLAN sent across an 802.1Q trunk?',
    choices: ['Tagged with VLAN ID 1', 'Untagged', 'Encrypted', 'Tagged with priority 0 and VLAN ID 0'], correct: [1],
    explanation: 'Native VLAN frames are sent without an 802.1Q tag. The receiving side assigns them to its own native VLAN.',
    wrong: { 0: 'Native VLAN frames carry no tag.', 2: '802.1Q does not encrypt.', 3: 'A priority-tagged frame with VLAN 0 is a special case, not the native VLAN behaviour.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.2', difficulty: 'medium', type: 'single',
    prompt: 'A trunk currently allows VLANs 10, 20 and 99. An engineer enters switchport trunk allowed vlan 30 on it. Which VLANs are allowed afterwards?',
    choices: ['10, 20, 30 and 99', 'Only 30', '30 and 99', 'All VLANs'], correct: [1],
    explanation: 'Without add, the command replaces the list. Only VLAN 30 remains allowed.',
    wrong: { 0: 'That would need switchport trunk allowed vlan add 30.', 2: 'Nothing is kept from the old list.', 3: 'Only switchport trunk allowed vlan all would do that.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.2', difficulty: 'medium', type: 'single',
    prompt: 'Two directly connected Catalyst ports are both set to dynamic auto. What is the result?',
    choices: ['A trunk forms', 'The link operates as an access link', 'The link goes err-disabled', 'One port becomes a trunk and the other an access port'], correct: [1],
    explanation: 'Neither side initiates negotiation, so the link stays an access link.',
    wrong: { 0: 'At least one side must be trunk or dynamic desirable.', 2: 'Nothing about auto + auto causes err-disable.', 3: 'Trunking is a property of the link; both ends agree.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.2', difficulty: 'easy', type: 'single',
    prompt: 'Which command displays trunk ports, their native VLAN and the VLANs allowed on them?',
    choices: ['show vlan brief', 'show interfaces trunk', 'show trunk vlan', 'show ip interface brief'], correct: [1],
    explanation: 'show interfaces trunk lists trunking ports, the native VLAN and the allowed, active and forwarding VLANs.',
    wrong: { 0: 'That lists access ports only.', 2: 'That is not a valid IOS command.', 3: 'That shows IP status, not trunking.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D2', objective: '2.2', difficulty: 'hard', type: 'multiple',
    prompt: 'SW1 uses native VLAN 99 and SW2 uses native VLAN 1 on the same trunk. Which TWO statements are true?',
    choices: ['Untagged frames may be placed in a different VLAN at the far end', 'CDP can log a native VLAN mismatch message', 'The trunk immediately goes down', 'All tagged VLANs stop working'], correct: [0, 1],
    explanation: 'The trunk stays up, but untagged traffic leaks between VLANs and CDP reports the mismatch.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D2', objective: '2.2', difficulty: 'medium', type: 'single',
    prompt: 'Which command adds VLAN 40 to a trunk without removing the VLANs that are already allowed?',
    choices: ['switchport trunk allowed vlan 40', 'switchport trunk allowed vlan add 40', 'switchport trunk native vlan 40', 'switchport access vlan 40'], correct: [1],
    explanation: 'The add keyword appends VLANs to the existing allowed list.',
    wrong: { 0: 'That replaces the list.', 2: 'That changes the native VLAN.', 3: 'That is an access port command.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D2', objective: '2.2', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: one trunk link can carry traffic for many VLANs at the same time.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'That is the purpose of a trunk: many VLANs, one link, separated by 802.1Q tags.',
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D2', objective: '2.2', difficulty: 'medium', type: 'single',
    prompt: 'Which best-practice choice reduces the risk of VLAN hopping and mismatches on a trunk?',
    choices: ['Keep VLAN 1 as native and carry user traffic in it', 'Use an unused VLAN as the native VLAN and configure it identically on both ends', 'Allow every VLAN on every trunk', 'Set both ends to dynamic auto'], correct: [1],
    explanation: 'A dedicated, unused native VLAN configured on both ends is the recommended practice.',
    wrong: { 0: 'User traffic in the native VLAN is the risky setup.', 2: 'Limiting allowed VLANs is safer.', 3: 'Static trunks are preferred over negotiation.' },
  },
  {
    id: `${ID}-q11`, lessonIds: [ID], domain: 'D2', objective: '2.2', difficulty: 'hard', type: 'single',
    prompt: 'Which pair of DTP modes results in a working trunk?',
    choices: ['dynamic auto and dynamic auto', 'dynamic desirable and dynamic auto', 'access and dynamic desirable', 'access and trunk'], correct: [1],
    explanation: 'Desirable actively asks and auto accepts, so a trunk forms.',
    wrong: { 0: 'Neither side asks.', 2: 'An access port does not negotiate a trunk.', 3: 'An access port and a trunk port do not agree on a mode; the link does not work as a trunk.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: paano tandaan ang trunk at native VLAN?', back: 'TRUNK = TREN. Lahat ng pasahero may TIKET (802.1Q tag, 4 bytes) maliban sa NATIVE — libre siya (walang tag). Pareho dapat ang native sa dalawang dulo. Allowed list: walang salita = PALIT, add = DAGDAG.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What does 802.1Q add to a frame?', back: 'A 4-byte tag (TPID 0x8100, 3-bit priority, 1-bit DEI, 12-bit VLAN ID).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Native VLAN behaviour and default?', back: 'Sent untagged. Default VLAN 1. Must match on both ends.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'command', front: 'Make Gi0/1 a static trunk?', back: 'interface g0/1 · switchport mode trunk' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'command', front: 'Change the trunk native VLAN to 99?', back: 'switchport trunk native vlan 99 (on both ends)' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'command', front: 'Add VLAN 40 to a trunk without wiping the list?', back: 'switchport trunk allowed vlan add 40' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'command', front: 'Verify trunks?', back: 'show interfaces trunk (mode/native, allowed, active, forwarding) · show interfaces g0/1 switchport' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Which DTP modes form a trunk?', back: 'trunk or desirable on at least one side (with auto, desirable or trunk on the other). auto + auto = access.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Trunk two switches together',
  tool: 'Packet Tracer',
  minutes: 40,
  objective: 'Extend two VLANs across two switches with a trunk, change the native VLAN, restrict allowed VLANs, and observe a native VLAN mismatch.',
  topology: 'Two 2960 switches (SW1, SW2) joined on Gi0/1 (crossover or auto-MDIX). PC1 and PC3 on SW1 (Fa0/1 in VLAN 10, Fa0/2 in VLAN 20). PC2 and PC4 on SW2 with the same port/VLAN layout.',
  addressing: [
    { device: 'PC1', interface: 'NIC', address: '192.168.10.11/24' },
    { device: 'PC2', interface: 'NIC', address: '192.168.10.12/24' },
    { device: 'PC3', interface: 'NIC', address: '192.168.20.11/24' },
    { device: 'PC4', interface: 'NIC', address: '192.168.20.12/24' },
  ],
  steps: [
    'On both switches create VLAN 10, 20 and 99 (PARKING). Put Fa0/1 in VLAN 10 and Fa0/2 in VLAN 20 as access ports.',
    'Before creating the trunk, ping PC1 → PC2. It should fail because the switches are not trunked and VLANs are per switch.',
    'On SW1 and SW2 configure Gi0/1 as switchport mode trunk.',
    'Ping again: PC1 → PC2 and PC3 → PC4 now succeed. PC1 → PC3 still fails (no router yet).',
    'Set the native VLAN to 99 on both ends and verify with show interfaces trunk.',
    'Restrict the trunk on both ends to VLANs 10,20,99. Verify the four tables.',
    'Break it: change the native VLAN only on SW1 to 1 again. Look for the CDP native VLAN mismatch message and explain why the trunk is still up.',
    'Fix it by restoring 99 on SW1, then use add to allow VLAN 30 and confirm with show interfaces trunk.',
  ],
  checklist: [
    'Trunk between SW1 and SW2 works for VLAN 10 and 20',
    'Native VLAN 99 on both ends',
    'Allowed list is 10,20,99',
    'Observed and explained a native VLAN mismatch',
    'Used add instead of replacing the list',
  ],
  hints: [
    'If pings fail after trunking, run show interfaces trunk on both switches and compare the allowed lists.',
    'The VLANs must exist on both switches, not just one.',
  ],
  solution: [
    'Both: vlan 10 / vlan 20 / vlan 99; interface fa0/1 → switchport mode access → switchport access vlan 10; interface fa0/2 → … vlan 20.',
    'Both: interface g0/1 → switchport mode trunk → switchport trunk native vlan 99 → switchport trunk allowed vlan 10,20,99.',
    'show interfaces trunk on both switches shows 802.1q, trunking, native vlan 99 and allowed 10,20,99.',
    'A native VLAN mismatch keeps the trunk up but leaks untagged frames, and CDP logs a mismatch message.',
  ],
  breakIt: 'On SW2 enter switchport trunk allowed vlan 10 (without add) and see VLAN 20 traffic stop. Then repair it with add 20 and 99.',
};
