import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'vlan-trunk-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.4',
  domain: 'D2',
  title: 'VLAN and Trunk Deep Dive: Build It, Break It, Fix It',
  description: 'Configure access and trunk ports end to end, add a voice VLAN, understand DTP and native VLAN behaviour and troubleshoot the classic failures.',
  whyMatters:
    'Karamihan ng VLAN na tanong sa exam ay troubleshooting: “bakit hindi nagkakausap ang dalawang PC sa iisang VLAN?” Ang sagot ay halos laging isa sa limang dahilan na tatalakayin natin dito. Kapag kabisado mo ang checklist, mabilis mo itong mahahanap.',
  objectives: [
    'Configure access ports, a voice VLAN and an 802.1Q trunk',
    'Use switchport trunk allowed vlan add safely',
    'Explain native VLAN mismatch and its symptoms',
    'Explain DTP modes and why to disable negotiation',
    'Follow a five-step checklist to find a broken VLAN path',
  ],
  estimatedMinutes: 45,
  difficulty: 'intermediate',
  keywords: ['VLAN', 'trunk', '802.1Q', 'native VLAN', 'allowed VLAN', 'DTP', 'voice VLAN', 'switchport nonegotiate', 'show interfaces trunk'],
  examObjectives: ['2.1', '2.2'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A VLAN problem is almost always one of five things: the port is in the wrong VLAN, the VLAN does not exist, the trunk is not up, the VLAN is not allowed on the trunk, or the native VLANs do not match.',
        'Learn the five-step check and you can solve any VLAN fault the exam shows you.',
      ],
      taglish: [
        'Halos lahat ng VLAN problem ay isa sa **limang dahilan**: (1) maling VLAN ang port, (2) **wala** ang VLAN sa switch, (3) hindi up ang **trunk**, (4) **hindi allowed** ang VLAN sa trunk, (5) **native VLAN mismatch**.',
        'Kapag sinunod mo ang limang hakbang na ito nang pa-order, hindi ka na manghuhula. Bawat hakbang ay may isang show command.',
        'May bonus: ang **voice VLAN** — pinapayagan ang IP phone at PC na magbahagi ng isang switch port pero magkahiwalay ang VLAN.',
      ],
      technical: [
        'An access port carries one untagged VLAN. A trunk carries many VLANs using 802.1Q tags (4 bytes) except the native VLAN, which is sent untagged (default VLAN 1).',
        'With switchport voice vlan, an access port also accepts tagged frames from an IP phone in the voice VLAN; the PC behind the phone stays in the access VLAN.',
        'DTP can negotiate trunks (dynamic desirable/auto). Best practice is to configure static modes and disable negotiation with switchport nonegotiate on trunks.',
      ],
    },
    {
      type: 'analogy',
      title: 'Mga kalsada at tollgate',
      body: [
        'An access port is a private driveway to one house. A trunk is a highway with a toll lane for every VLAN. A VLAN that is not allowed on the trunk has its lane closed, and a native VLAN mismatch means the two ends disagree about which lane has no toll sticker.',
      ],
      taglish: [
        'Ang **access port** ay pribadong daan papunta sa isang bahay. Ang **trunk** ay highway na may **sariling lane bawat VLAN** (ang tag ang “sticker”). Kapag hindi allowed ang VLAN sa trunk, **sarado ang lane**. Kapag native VLAN mismatch, magkaiba ang paniniwala ng dalawang dulo kung aling lane ang walang sticker kaya napupunta ang sasakyan sa maling lane.',
      ],
    },
    {
      type: 'hook',
      title: 'EVTAN: limang tsek',
      trick: '**EVTAN = Existence, VLAN assignment, Trunk up, Allowed list, Native match.** Isa-isang i-check ang lima.',
      taglish: [
        '**E**xistence: nandiyan ba ang VLAN? `show vlan brief`.',
        '**V**LAN assignment: tamang VLAN ba ang port? `show vlan brief` o `show interfaces switchport`.',
        '**T**runk up: trunk ba talaga? `show interfaces trunk`.',
        '**A**llowed list: kasama ba ang VLAN sa allowed list? `show interfaces trunk`.',
        '**N**ative match: pareho ba ang native VLAN sa dalawang dulo? Hanapin ang CDP/STP mismatch log.',
      ],
      test: {
        question: 'Nagawa mo ang VLAN 30 at inilagay ang PC sa port, pero hindi pa rin nagkakausap sa kabilang switch. Anong dalawang bagay ang unang titingnan?',
        answer: 'Allowed list ng trunk (kasama ba ang VLAN 30?) at kung ang VLAN 30 ay umiiral din sa kabilang switch.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Access ports at voice VLAN',
      paragraphs: [
        'Para sa access port, dalawa lang ang utos: `switchport mode access` at `switchport access vlan N`. Kapag ang VLAN ay wala pa, awtomatiko itong gagawin ng switch (sa ilang bersyon), pero huwag umasa — gawin muna ang VLAN.',
        'Para sa IP phone, idagdag ang `switchport voice vlan 150`. Ang phone ay nagpapadala ng tagged frames sa VLAN 150 habang ang PC na nakakabit sa phone ay untagged sa access VLAN (hal. 10). Isang cable, dalawang VLAN, magkahiwalay na broadcast domain.',
        'Kapag may `switchport mode access`, hindi na ito magiging trunk kahit may kausap na DTP.',
      ],
      steps: [
        'vlan 10 → name USERS; vlan 150 → name VOICE.',
        'interface fa0/5 → switchport mode access → switchport access vlan 10.',
        'switchport voice vlan 150 (para sa IP phone).',
        'show interfaces fa0/5 switchport → tingnan ang Access Mode VLAN at Voice VLAN.',
      ],
      tricks: [
        'Ang `show vlan brief` ay hindi nagpapakita ng trunk ports — ang mga port na nasa trunk ay wala sa listahan. Huwag mag-panic kung nawawala ang uplink.',
        'Isama ang `spanning-tree portfast` sa access port para mabilis mag-forwarding (at `bpduguard enable` para sa seguridad).',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Trunk at ang allowed list',
      paragraphs: [
        'Ang pinakamadalas na pagkakamali ay ang `switchport trunk allowed vlan 20` — ito ay **papalit** sa buong listahan, hindi nagdaragdag. Sa isang iglap, nawala ang lahat ng ibang VLAN sa trunk.',
        'Ang tamang paraan para magdagdag: `switchport trunk allowed vlan add 20`. Para magbawas: `switchport trunk allowed vlan remove 20`. Ang default ay `all` (1–4094).',
        'Kung ang switch ay sumusuporta sa parehong 802.1Q at ISL, kailangan mo ng `switchport trunk encapsulation dot1q` bago ang `switchport mode trunk`. Sa modernong switch, 802.1Q lang ang available.',
      ],
      steps: [
        'switchport trunk encapsulation dot1q (kung kailangan).',
        'switchport mode trunk.',
        'switchport trunk native vlan 99 (pareho sa dalawang dulo).',
        'switchport trunk allowed vlan 10,20,99 (isang beses lang sa simula) o add/remove pagkatapos.',
        'switchport nonegotiate para tanggalin ang DTP.',
        'show interfaces trunk → i-check ang mode, encapsulation, status, native VLAN at allowed list.',
      ],
      tricks: [
        'Ang tatlong listahan sa `show interfaces trunk`: allowed, allowed and active, at forwarding (STP). Ang VLAN ay dumadaan lang kung nasa lahat ng tatlo.',
        'Gumamit ng hindi ginagamit na VLAN (hal. 99) bilang native VLAN at huwag kailanman maglagay ng user dito — mas ligtas laban sa VLAN hopping.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 3: Native VLAN mismatch at DTP',
      paragraphs: [
        'Kung ang native VLAN ay 1 sa kaliwang switch at 99 sa kanan, up pa rin ang trunk. Pero ang untagged frames mula sa VLAN 1 ay ituturing ng kanan bilang VLAN 99 — **tumatagas ang trapiko** sa maling VLAN. Magpapakita ang CDP ng “Native VLAN mismatch” at STP ng PVID inconsistent.',
        'Ang DTP naman ay may apat na mode: `access`, `trunk`, `dynamic auto` (naghihintay), `dynamic desirable` (aktibong nag-aalok). Trunk ang resulta kung ang isang dulo ay `trunk` o `desirable` at ang kabila ay `trunk`, `desirable` o `auto`. Ang `auto + auto` ay nananatiling access.',
        'Mas ligtas ang static: `switchport mode trunk` + `switchport nonegotiate` sa trunk, at `switchport mode access` sa lahat ng user port.',
      ],
      tricks: [
        'Kapag up ang trunk pero may VLAN na hindi nagkakausap, isipin muna ang allowed list bago ang native VLAN.',
        'Sa exam, ang “trunk is up pero may kakaibang CDP message” ay halos laging native VLAN mismatch.',
      ],
    },
    {
      type: 'remember',
      title: 'VLAN at trunk na lumalabas sa exam',
      items: [
        '**802.1Q tag = 4 bytes; native VLAN = untagged (default 1).**',
        '**allowed vlan N = PALIT; allowed vlan add N = DAGDAG.**',
        '**auto + auto = access; desirable + auto = trunk; trunk + auto = trunk.**',
        '**Voice VLAN: phone = tagged; PC = untagged sa access VLAN.**',
        '**Native VLAN mismatch: up pa rin ang trunk pero may CDP/STP message at tumatagas na trapiko.**',
      ],
    },
    { type: 'diagram', id: 'vlan-segments', caption: 'Dalawang VLAN sa isang switch; ang trunk ang magdadala ng parehong VLAN sa kabilang switch.' },
    {
      type: 'terms',
      items: [
        { term: 'Access port', definition: 'A switch port that belongs to exactly one VLAN and sends untagged frames.' },
        { term: 'Trunk port', definition: 'A port that carries several VLANs using 802.1Q tags.' },
        { term: 'Native VLAN', definition: 'The VLAN whose frames cross an 802.1Q trunk untagged (default 1).' },
        { term: 'Allowed VLAN list', definition: 'The set of VLANs permitted on a trunk (default all).' },
        { term: 'DTP', definition: 'Dynamic Trunking Protocol: Cisco negotiation of trunk or access mode.' },
        { term: 'Voice VLAN', definition: 'A separate VLAN for IP phone traffic that shares the access port with a PC.' },
        { term: 'VLAN hopping', definition: 'An attack that sends traffic into a VLAN the attacker should not reach, often via DTP or double tagging.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ang EVTAN checklist',
      steps: [
        'E: Umiiral ba ang VLAN? show vlan brief.',
        'V: Nasa tamang VLAN ba ang port ng host? show interfaces switchport.',
        'T: Trunk ba ang uplink at up? show interfaces trunk.',
        'A: Nasa allowed list at active list ang VLAN? show interfaces trunk.',
        'N: Pareho ba ang native VLAN sa dalawang dulo? Basahin ang CDP/STP logs.',
      ],
    },
    {
      type: 'cli',
      title: 'Kumpletong configuration',
      transcript: `SW1(config)# vlan 10
SW1(config-vlan)# name USERS
SW1(config)# interface fastEthernet 0/5
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# switchport voice vlan 150
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 99
SW1(config-if)# switchport trunk allowed vlan 10,150,99
SW1(config-if)# switchport nonegotiate`,
      copyable: 'vlan 10\nname USERS\ninterface fastEthernet 0/5\nswitchport mode access\nswitchport access vlan 10\nswitchport voice vlan 150\ninterface gigabitEthernet 0/1\nswitchport mode trunk\nswitchport trunk native vlan 99\nswitchport trunk allowed vlan 10,150,99\nswitchport nonegotiate',
      explain: [
        { line: 'switchport voice vlan 150', why: 'Lets the IP phone send tagged voice frames while the PC behind it stays in VLAN 10.' },
        { line: 'switchport trunk native vlan 99', why: 'Sets an unused VLAN as native; configure the same value on the other end.' },
        { line: 'switchport trunk allowed vlan 10,150,99', why: 'Replaces the allowed list with exactly these VLANs; use add or remove to change it later.' },
        { line: 'switchport nonegotiate', why: 'Stops DTP frames so the trunk cannot be negotiated by an attacker.' },
      ],
      note: 'Verify with show interfaces trunk and show interfaces fa0/5 switchport.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang `switchport trunk allowed vlan 20` ay **hindi nagdaragdag** — pinapalitan nito ang buong listahan. Gamitin ang `add` para hindi mawala ang ibang VLAN.' },
    { type: 'callout', kind: 'trap', text: 'Kapag nabura ang VLAN, ang mga port nito ay hindi lumilipat sa VLAN 1; nananatili sila sa VLAN na wala na at **inactive**.' },
    { type: 'callout', kind: 'tip', text: 'Sa Packet Tracer o exam simulation, laging patakbuhin ang `show interfaces trunk` pagkatapos ng bawat pagbabago sa trunk — nakikita mo agad kung nawala ang isang VLAN.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Using allowed vlan without add, which wipes the previous list.',
        'Configuring different native VLANs on the two ends.',
        'Leaving ports in dynamic auto or desirable and trusting DTP.',
        'Creating the VLAN on one switch only.',
        'Expecting show vlan brief to list trunk ports.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: VLAN 20 hindi tumatawid',
      scenario: 'PC1 and PC2 are in VLAN 20 on different switches. PC1 can reach hosts on its own switch but not PC2. The trunk is up.',
      evidence: `SW1# show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gi0/1       on           802.1q         trunking      1
Port        Vlans allowed on trunk
Gi0/1       10,30`,
      question: 'Ano ang kulang?',
      answer: 'The allowed VLAN list is 10,30. VLAN 20 is not allowed on the trunk, so its frames never cross even though the trunk is up.',
      fix: 'Add the VLAN without wiping the list: interface gi0/1 → switchport trunk allowed vlan add 20. Verify with show interfaces trunk on both switches.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang trunk ay may allowed vlan 10,20,30. Gusto mong idagdag ang VLAN 40. Anong command ang tama, at ano ang mangyayari kung `switchport trunk allowed vlan 40` ang ginamit?',
      answer: 'Correct: switchport trunk allowed vlan add 40. Using allowed vlan 40 replaces the list, leaving only VLAN 40 on the trunk and breaking VLANs 10, 20 and 30.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Use the EVTAN checklist in order; do not guess.',
        'Trunk up does not mean every VLAN is passing.',
        'allowed vlan replaces; add appends.',
        'Native VLAN mismatch leaves the trunk up but leaks traffic.',
        'Disable DTP with nonegotiate on trunks and use mode access on user ports.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Five checks solve most VLAN faults: exist, assigned, trunk up, allowed, native.',
        'Voice VLAN lets a phone and PC share one port.',
        'allowed vlan replaces; use add and remove.',
        'Native VLAN must match on both ends.',
        'Use static modes and nonegotiate.',
        'Susunod: palalimin ang OSPF.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'easy', type: 'single',
    prompt: 'An administrator enters “switchport trunk allowed vlan 20” on a trunk that previously allowed VLANs 10, 20 and 30. What is the result?',
    choices: ['VLAN 20 is added to the list', 'Only VLAN 20 is allowed on the trunk', 'VLAN 20 is removed', 'The trunk becomes an access port'], correct: [1],
    explanation: 'Without add, the command replaces the entire allowed list, so only VLAN 20 remains.',
    wrong: { 0: 'You would need the add keyword.', 2: 'remove is the keyword for removal.', 3: 'The port mode does not change.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'Two switches are connected by a trunk. One uses native VLAN 1 and the other native VLAN 99. What is the most likely symptom?',
    choices: ['The trunk goes down', 'The trunk stays up but a native VLAN mismatch is logged', 'DTP disables the port', 'All VLANs are blocked'], correct: [1],
    explanation: 'A native VLAN mismatch does not bring the trunk down; CDP and STP report the inconsistency and untagged traffic leaks between VLANs.',
    wrong: { 0: 'The trunk remains up.', 2: 'DTP is not involved in this.', 3: 'Only untagged traffic is affected.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'Both ends of a link are set to “dynamic auto”. What is the resulting port mode?',
    choices: ['Trunk', 'Access', 'Blocked', 'Err-disabled'], correct: [1],
    explanation: 'Auto waits to be asked. With auto on both sides nobody proposes a trunk, so the link stays access.',
    wrong: { 0: 'One side must be desirable or trunk.', 2: 'STP, not DTP, blocks ports.', 3: 'This does not cause err-disable.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'How does a PC connected through an IP phone stay in a different VLAN from the phone?',
    choices: ['The phone sends tagged frames in the voice VLAN while PC frames are untagged in the access VLAN', 'The PC uses the native VLAN on a trunk', 'The phone is routed by a Layer 3 switch', 'DTP assigns each device a VLAN'], correct: [0],
    explanation: 'With switchport voice vlan, the phone tags its frames and the PC’s untagged frames use the access VLAN.',
    wrong: { 1: 'The port is an access port, not a trunk.', 2: 'This is Layer 2 separation on the port.', 3: 'DTP negotiates trunking only.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: show vlan brief lists the ports that are operating as trunks.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'Trunk ports are not assigned to a single VLAN, so they do not appear in show vlan brief. Use show interfaces trunk.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'hard', type: 'multiple',
    prompt: 'A trunk is up but VLAN 20 hosts on different switches cannot communicate. Which TWO checks are most relevant?',
    choices: ['VLAN 20 is in the trunk’s allowed list', 'VLAN 20 exists on both switches', 'The default gateway is .254', 'The switch hostname is unique'], correct: [0, 1],
    explanation: 'Two common causes: VLAN 20 not allowed on the trunk, or VLAN 20 not created on one of the switches.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'switching', front: 'Pro tip: ano ang EVTAN?', back: 'Existence, VLAN assignment, Trunk up, Allowed list, Native match — limang tsek para sa VLAN problem.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'switching', front: 'allowed vlan vs allowed vlan add?', back: 'Without add the list is replaced; add appends to it.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'switching', front: 'What happens on a native VLAN mismatch?', back: 'The trunk stays up, CDP/STP log a mismatch and untagged traffic leaks into the wrong VLAN.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'switching', front: 'Which DTP combinations make a trunk?', back: 'trunk or desirable on one side with trunk, desirable or auto on the other. auto + auto stays access.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'switching', front: 'How do phone and PC share a port?', back: 'switchport voice vlan: phone tagged in the voice VLAN, PC untagged in the access VLAN.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'switching', front: 'Which command verifies trunks?', back: 'show interfaces trunk (mode, native, allowed, active, forwarding).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'switching', front: 'How do you stop DTP on a trunk?', back: 'switchport nonegotiate (with switchport mode trunk).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Build, break and fix a two-switch VLAN network',
  tool: 'Packet Tracer',
  minutes: 40,
  objective: 'Configure VLANs 10 and 20 across a trunk, then create and repair each of the five EVTAN faults.',
  steps: [
    'Build two switches with a trunk and one PC in VLAN 10 and VLAN 20 on each switch. Use addresses in 192.168.10.0/24 and 192.168.20.0/24.',
    'Create both VLANs on both switches and assign the PC ports.',
    'Configure the trunk with native VLAN 99, allowed vlan 10,20,99 and nonegotiate. Test that same-VLAN PCs can ping across the trunk.',
    'Break 1: remove VLAN 20 from the allowed list (allowed vlan remove 20). Find it with show interfaces trunk and repair with add.',
    'Break 2: change the native VLAN on one side only. Find the CDP message and repair it.',
    'Break 3: delete VLAN 10 on one switch and observe the inactive port in show vlan brief. Recreate it.',
    'Add an IP phone port with switchport voice vlan 150 and read the output of show interfaces switchport.',
  ],
  checklist: [
    'Same-VLAN pings work across the trunk',
    'Each fault was identified with a specific show command',
    'Native VLAN matches again',
    'Inactive port recovered after recreating the VLAN',
    'Voice VLAN visible in switchport output',
  ],
  hints: [
    'Compare show interfaces trunk on both switches.',
    'show vlan brief marks an orphaned port as inactive.',
  ],
  solution: [
    'Fix 1: switchport trunk allowed vlan add 20.',
    'Fix 2: switchport trunk native vlan 99 on the mismatched end.',
    'Fix 3: vlan 10 on the switch that lost it; the port returns to active.',
  ],
  breakIt: 'Set one end to dynamic auto and the other to access and explain why no trunk forms.',
};
