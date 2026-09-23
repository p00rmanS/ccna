import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'vlans';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.2',
  domain: 'D2',
  title: 'VLAN Fundamentals',
  description: 'What a VLAN is, why it splits a broadcast domain, and how to create VLANs and assign access ports on a Cisco switch.',
  whyMatters:
    'Ang VLAN ang unang “talagang switch skill” sa CCNA. Halos lahat ng susunod — trunking, inter-VLAN routing, STP — ay nakasandal dito. Kapag naintindihan mo na ang isang VLAN ay isang broadcast domain, madali na ang natitira.',
  objectives: [
    'Explain what a VLAN is and why networks use them',
    'State that each VLAN is its own broadcast domain (and normally its own subnet)',
    'Create and name a VLAN and assign an access port to it',
    'Use interface range to configure several ports at once',
    'Verify with show vlan brief and show interfaces switchport',
    'Explain why hosts in different VLANs cannot talk without a router',
  ],
  estimatedMinutes: 40,
  difficulty: 'beginner',
  keywords: ['VLAN', 'access port', 'broadcast domain', 'show vlan brief', 'switchport access vlan', 'vlan.dat', 'default VLAN'],
  examObjectives: ['2.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A VLAN (virtual LAN) splits one physical switch into several separate logical switches. Ports in VLAN 10 only talk to other ports in VLAN 10. Ports in VLAN 20 only talk to VLAN 20.',
        'Every VLAN is its own broadcast domain. A broadcast sent in VLAN 10 never reaches VLAN 20. To move traffic between VLANs you need a router (Layer 3).',
      ],
      taglish: [
        'Ang **VLAN** ay parang paghahati ng **isang switch** sa **maraming hiwalay na “virtual” switch**. Ang mga port sa VLAN 10 ay nag-uusap lang sa ibang port ng VLAN 10. Ang VLAN 20 ay sa VLAN 20 lang.',
        'Bawat VLAN ay **sariling broadcast domain**. Kapag may nag-broadcast sa VLAN 10 (halimbawa ARP), **hindi ito naririnig ng VLAN 20**. Kaya kapag gusto mong magkausap ang dalawang VLAN, kailangan ng **router (Layer 3)**.',
        'Bakit gagawin ito? (1) **Mas maliit na broadcast domain** = mas kaunting ingay. (2) **Security** — hiwalay ang Sales sa Engineering. (3) **Flexible** — pwedeng iisang VLAN ang mga user kahit magkakalayo ang mga floor. Sa praktika, **isang VLAN = isang subnet** (VLAN 10 = 192.168.10.0/24, VLAN 20 = 192.168.20.0/24).',
        'Ang **access port** ay port na para sa **isang** VLAN lang, karaniwan para sa PC, printer o server. Hindi nagtatag ng VLAN ang device — ang **switch port** ang nagsasabi kung anong VLAN siya. Sa bagong switch, **lahat ng port ay nasa VLAN 1** (default VLAN).',
      ],
      technical: [
        'A VLAN is a logical Layer 2 broadcast domain configured on one or more switches. A switch forwards unicast, multicast and broadcast frames only between ports in the same VLAN. Each VLAN normally maps to one IP subnet, and inter-VLAN traffic must be routed.',
        'Normal-range VLANs are 1–1005; extended-range VLANs are 1006–4094 (12-bit VLAN ID). VLAN 1 is the default VLAN and cannot be deleted or renamed; 1002–1005 are reserved for legacy FDDI and Token Ring and cannot be deleted either. On Catalyst switches the normal-range VLAN database is stored in flash as vlan.dat, separate from the startup-config, so VLANs survive a reload even when the startup-config is erased.',
        'An access port carries traffic for exactly one data VLAN (plus, optionally, one voice VLAN) and sends and receives untagged Ethernet frames. Assign it with switchport mode access and switchport access vlan N. Many Catalyst switches create the VLAN automatically if you assign a port to one that does not exist, but you should create VLANs deliberately. Deleting a VLAN does not move its ports to VLAN 1; the ports become inactive until they are reassigned.',
      ],
    },
    {
      type: 'analogy',
      title: 'Isang gusali, maraming palapag',
      body: [
        'A switch is a building. Each VLAN is a separate floor with its own office and its own public-address system. Announcements on floor 10 are only heard on floor 10. To send a message to floor 20 you have to go through the reception desk — the router.',
      ],
      taglish: [
        'Ang **switch** ay **isang gusali**. Ang bawat **VLAN** ay **isang palapag** na may sariling opisina at sariling **PA system (broadcast)**. Ang anunsyo sa 10th floor ay sa 10th floor lang naririnig. Kung gusto mong magpadala ng mensahe sa 20th floor, kailangan mong dumaan sa **reception (router)**.',
      ],
    },
    {
      type: 'hook',
      title: 'VLAN = Barangay',
      trick: '**Isang switch, maraming BARANGAY. Bawat barangay may sariling SIGAW (broadcast). Para lumipat ng barangay — kailangan ng TANOD (router).**',
      taglish: [
        'Isipin ang **VLAN bilang barangay**. Sa loob ng barangay, nagkakarinigan ang lahat (broadcast domain). Hindi naririnig ang sigaw ng kabilang barangay. Para makapunta sa ibang barangay, dadaan ka sa **tanod / checkpoint = router**.',
        'Tatlong hakbang sa config: **Gumawa — Pangalanan — Ilagay.** `vlan 10` (gumawa) → `name SALES` (pangalanan) → `switchport access vlan 10` (ilagay ang port).',
        'Bilang: **ilang VLAN = ilang broadcast domain.** 4 na VLAN = 4 na barangay = 4 na broadcast domain.',
      ],
      test: {
        question: 'May isang switch na may VLAN 10, 20 at 30. Ilang broadcast domain meron? At bakit hindi makapag-ping ang PC sa VLAN 10 sa PC sa VLAN 20?',
        answer: '3 broadcast domain (isa bawat VLAN = isa bawat barangay). Hindi sila makapag-ping dahil magkaibang barangay: hindi umaabot ang ARP broadcast, at walang router (tanod) para ilipat ang traffic.',
      },
    },
    { type: 'diagram', id: 'vlan-segments', caption: 'Isang switch, dalawang VLAN. Sa loob ng VLAN direkta ang usapan; sa pagitan ng VLAN kailangan ng router.' },
    {
      type: 'terms',
      items: [
        { term: 'VLAN', definition: 'A logical Layer 2 broadcast domain configured on a switch.' },
        { term: 'Broadcast domain', definition: 'All devices that receive a Layer 2 broadcast sent by any one of them.' },
        { term: 'Access port', definition: 'A switch port that belongs to a single data VLAN and sends untagged frames.' },
        { term: 'Default VLAN', definition: 'VLAN 1. Every port starts in it. It cannot be deleted.' },
        { term: 'Normal-range VLAN', definition: 'VLAN IDs 1–1005. Stored in vlan.dat.' },
        { term: 'Extended-range VLAN', definition: 'VLAN IDs 1006–4094.' },
        { term: 'vlan.dat', definition: 'File in flash that holds the normal-range VLAN database. Survives a reload.' },
        { term: 'Voice VLAN', definition: 'An extra VLAN on an access port so an IP phone’s voice traffic is separate from the PC behind it.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ano ang mangyayari kapag nag-ARP ang PC1 (VLAN 10)?',
      steps: [
        'Nag-broadcast ang **PC1** ng ARP request (`ff:ff:ff:ff:ff:ff`) papunta sa switch.',
        'Tiningnan ng switch ang **VLAN ng port** na pinanggalingan: VLAN 10.',
        'Ipinapasa ng switch ang broadcast **sa lahat ng port na nasa VLAN 10 lang** (PC2).',
        '**Hindi** ito ipinapasa sa mga port ng VLAN 20 (PC3, PC4). Nasa ibang barangay sila.',
        'Kung ang hinahanap ay PC3 (VLAN 20), walang sasagot. Kailangan ng router para sa ibang subnet.',
      ],
    },
    {
      type: 'cli',
      title: 'Gumawa, magpangalan, maglagay',
      transcript: `SW1(config)# vlan 10
SW1(config-vlan)# name SALES
SW1(config-vlan)# vlan 20
SW1(config-vlan)# name ENG
SW1(config-vlan)# exit
SW1(config)# interface range fastEthernet 0/1 - 2
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 10
SW1(config-if-range)# interface range fastEthernet 0/3 - 4
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 20
SW1(config-if-range)# end
SW1# show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/5, Fa0/6, Fa0/7, Fa0/8
                                                Gi0/1, Gi0/2
10   SALES                            active    Fa0/1, Fa0/2
20   ENG                              active    Fa0/3, Fa0/4
1002 fddi-default                     act/unsup
1003 token-ring-default               act/unsup
1004 fddinet-default                  act/unsup
1005 trnet-default                    act/unsup`,
      copyable: 'show vlan brief',
      explain: [
        { line: 'vlan 10', why: 'Creates VLAN 10 (or opens it if it exists) and enters VLAN configuration mode, shown as (config-vlan)#.' },
        { line: 'name SALES', why: 'Gives the VLAN a friendly name. If you skip it IOS names it VLAN0010.' },
        { line: 'interface range fastEthernet 0/1 - 2', why: 'Selects several ports at once. The prompt changes to (config-if-range)#.' },
        { line: 'switchport mode access', why: 'Hard-sets the port as an access port so it will not try to become a trunk.' },
        { line: 'switchport access vlan 10', why: 'Puts the port in VLAN 10.' },
        { line: 'show vlan brief', why: 'Lists every VLAN and its access ports. Trunk ports never appear here. VLAN 1 keeps the ports you did not move.' },
      ],
      note: 'You can practise exactly this in CLI practice → “Create VLANs and assign access ports”.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **trunk port ay hindi lalabas sa `show vlan brief`**. Kapag hindi mo makita ang uplink port mo doon, normal iyon. Gamitin ang `show interfaces trunk` para makita ito.' },
    { type: 'callout', kind: 'trap', text: 'Kapag **binura mo ang VLAN** (`no vlan 10`), **hindi lilipat sa VLAN 1** ang mga port nito. Magiging **inactive** sila at walang traffic hanggang i-assign mo sila ulit. Madalas itong lumalabas sa troubleshooting.' },
    { type: 'callout', kind: 'tip', text: 'Ang VLAN database (**vlan.dat**) ay hiwalay sa startup-config. Kapag nag-`erase startup-config` at nag-reload ka, **naiiwan pa rin ang mga VLAN**. Para tuluyang burahin, burahin din ang `vlan.dat` sa flash.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Assuming two PCs in different VLANs can ping just because they plug into the same switch.',
        'Putting hosts of two VLANs in the same IP subnet, and wondering why nothing works.',
        'Forgetting switchport mode access, so a port negotiates instead of staying a plain access port.',
        'Assigning a port to a VLAN and never creating or naming the VLAN deliberately.',
        'Deleting a VLAN and leaving its ports orphaned and inactive.',
        'Looking for a trunk port in show vlan brief.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: “Hindi maka-ping ang PC ko sa katabing PC”',
      scenario: 'PC1 (192.168.10.11) is on Fa0/1 and PC2 (192.168.10.12) is on Fa0/2. Both are in the same subnet, but PC1 cannot ping PC2.',
      evidence: `SW1# show vlan brief
10   SALES        active    Fa0/1
20   ENG          active    Fa0/2`,
      question: 'Ano ang mali?',
      answer: 'The two ports are in different VLANs. Even though the IP addresses are in the same subnet, PC1’s ARP broadcast stays inside VLAN 10, so PC2 (VLAN 20) never sees it. Different VLAN means different broadcast domain.',
      fix: 'Put Fa0/2 in VLAN 10: interface fa0/2, then switchport access vlan 10. Verify with show vlan brief and ping again.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Sa SW1, gumawa ng VLAN 30 na “GUEST”. Ilagay ang Fa0/6 hanggang Fa0/8 dito bilang access port. Anong tatlong bagay ang makikita mo sa `show vlan brief`?',
      answer: 'vlan 30 → name GUEST → interface range fa0/6 - 8 → switchport mode access → switchport access vlan 30. In show vlan brief: VLAN 30 named GUEST, status active, ports Fa0/6, Fa0/7, Fa0/8; and those three ports are gone from the VLAN 1 row.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'One VLAN = one broadcast domain = normally one subnet.',
        'All ports start in VLAN 1. VLAN 1 and 1002–1005 cannot be deleted.',
        'Normal range is 1–1005; extended is 1006–4094.',
        'Create, name, assign: vlan N → name X → switchport access vlan N.',
        'Trunk ports are not shown in show vlan brief.',
        'Traffic between VLANs needs a Layer 3 device.',
      ],
    },
    {
      type: 'summary',
      points: [
        'A VLAN is a logical broadcast domain: one switch, many separate barangay.',
        'Devices in different VLANs cannot talk without a router.',
        'Access ports belong to one VLAN; all ports start in VLAN 1.',
        'Config recipe: Gumawa — Pangalanan — Ilagay.',
        'Verify with show vlan brief and show interfaces <port> switchport.',
        'Susunod: paano dalhin ang maraming VLAN sa isang cable — trunking.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'easy', type: 'single',
    prompt: 'Which VLAN contains every port of a new Cisco switch by default?',
    choices: ['VLAN 0', 'VLAN 1', 'VLAN 10', 'VLAN 1002'], correct: [1],
    explanation: 'VLAN 1 is the default VLAN. All ports start in it.',
    wrong: { 0: 'VLAN 0 is not a usable VLAN ID.', 2: 'VLAN 10 must be created by an administrator.', 3: 'VLAN 1002 is a reserved legacy VLAN.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'easy', type: 'single',
    prompt: 'A switch has ports in VLAN 10, VLAN 20 and VLAN 30 and nothing else configured. How many broadcast domains does it have?',
    choices: ['1', '2', '3', '4'], correct: [2],
    explanation: 'Each VLAN is a separate broadcast domain, so three VLANs give three broadcast domains.',
    wrong: { 0: 'One broadcast domain would mean no VLANs.', 1: 'There are three VLANs, so three domains.', 3: 'Count only VLANs that have been created.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'easy', type: 'single',
    prompt: 'Which interface command places a port in VLAN 20 as an access port member?',
    choices: ['switchport trunk allowed vlan 20', 'switchport access vlan 20', 'vlan 20', 'switchport native vlan 20'], correct: [1],
    explanation: 'switchport access vlan 20 (in interface configuration mode) assigns the access port to VLAN 20.',
    wrong: { 0: 'That command changes the allowed list of a trunk.', 2: 'vlan 20 creates the VLAN in global configuration mode; it does not assign a port.', 3: 'That is not a valid IOS command; the trunk version is switchport trunk native vlan.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'PC1 is in VLAN 10 and PC2 is in VLAN 20. Both use addresses in 192.168.1.0/24 and plug into the same switch. What happens when PC1 pings PC2?',
    choices: ['The ping succeeds because they share a subnet', 'The ping fails because they are in different broadcast domains', 'The switch routes the ping between VLANs', 'The ping succeeds after ten seconds'], correct: [1],
    explanation: 'PC1’s ARP request is a broadcast that stays inside VLAN 10, so PC2 never receives it. A Layer 2 switch does not route between VLANs.',
    wrong: { 0: 'Sharing an IP subnet does not help when the VLANs separate the broadcast domains.', 2: 'A Layer 2 switch does not route.', 3: 'There is no delay-based fix.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'easy', type: 'single',
    prompt: 'Which command lists the VLANs on a switch together with their access ports?',
    choices: ['show vlan brief', 'show ip interface brief', 'show interfaces trunk', 'show mac address-table'], correct: [0],
    explanation: 'show vlan brief shows each VLAN, its name, status and the access ports assigned to it.',
    wrong: { 1: 'That shows IP addresses and interface status.', 2: 'That shows trunk ports only.', 3: 'That shows learned MAC addresses.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are benefits of using VLANs?',
    choices: ['Smaller broadcast domains', 'Users can be grouped by function instead of location', 'Traffic can travel between VLANs without a router', 'Each port gets more bandwidth automatically'], correct: [0, 1],
    explanation: 'VLANs shrink broadcast domains and let you group users logically. They do not remove the need for Layer 3 routing between VLANs and do not add bandwidth.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'Which range contains the normal-range VLANs?',
    choices: ['1–1005', '1–4094', '1006–4094', '2–1001 only'], correct: [0],
    explanation: 'Normal-range VLANs are 1–1005. Extended-range VLANs are 1006–4094.',
    wrong: { 1: '1–4094 is the whole VLAN ID space, including the extended range.', 2: 'That is the extended range.', 3: 'VLAN 1 and 1002–1005 are part of the normal range even though they cannot be deleted.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'hard', type: 'single',
    prompt: 'An engineer runs erase startup-config and reloads a Catalyst switch. VLAN 10 named SALES is still there. Why?',
    choices: ['The erase command failed silently', 'Normal-range VLANs are stored in vlan.dat in flash, not in the startup-config', 'VLANs are stored only in RAM and were restored by a backup', 'The switch created the VLAN again from CDP'], correct: [1],
    explanation: 'The normal-range VLAN database lives in flash as vlan.dat. Erasing the startup-config does not delete it.',
    wrong: { 0: 'The command works; it just does not touch vlan.dat.', 2: 'RAM would be cleared by a reload.', 3: 'CDP does not create VLANs.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: a trunk port appears in the port list of show vlan brief under the VLANs it carries.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'show vlan brief lists access ports only. Trunks are shown by show interfaces trunk.',
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'hard', type: 'single',
    prompt: 'What happens to the access ports of VLAN 30 when an administrator deletes VLAN 30?',
    choices: ['They move to VLAN 1', 'They stay in VLAN 30 but become inactive', 'They become trunk ports', 'They are shut down and removed from the configuration'], correct: [1],
    explanation: 'Deleting a VLAN does not reassign its ports. They remain assigned to the missing VLAN and are inactive until reassigned.',
    wrong: { 0: 'IOS does not move them automatically.', 2: 'Nothing turns an access port into a trunk.', 3: 'The ports and their configuration remain.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: paano tandaan ang VLAN?', back: 'VLAN = BARANGAY. Bawat barangay may sariling sigaw (broadcast). Para lumipat ng barangay, kailangan ng tanod (router). Config: Gumawa — Pangalanan — Ilagay. 4 VLAN = 4 broadcast domain.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What is a VLAN?', back: 'A logical Layer 2 broadcast domain on a switch. Each VLAN is normally its own IP subnet.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Default VLAN and which VLANs cannot be deleted?', back: 'VLAN 1 is the default. VLANs 1 and 1002–1005 cannot be deleted.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Normal-range and extended-range VLAN IDs?', back: 'Normal 1–1005. Extended 1006–4094.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'command', front: 'Commands to create VLAN 10 named SALES?', back: 'vlan 10  then  name SALES  (global configuration → config-vlan)' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'command', front: 'Commands to make Fa0/1 an access port in VLAN 10?', back: 'interface fa0/1 · switchport mode access · switchport access vlan 10' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'command', front: 'Command to list VLANs and their access ports?', back: 'show vlan brief (trunk ports are not listed)' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Where is the normal-range VLAN database stored?', back: 'In flash as vlan.dat — separate from startup-config, so it survives erase startup-config and reload.' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What happens to ports when their VLAN is deleted?', back: 'They stay assigned to it and become inactive. They do not move to VLAN 1.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Two VLANs on one switch',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Create VLAN 10 and VLAN 20 on one switch, place four PCs in them, and prove that VLANs separate broadcast domains.',
  topology: 'One 2960 switch (SW1) with four PCs: PC1 and PC2 on Fa0/1 and Fa0/2, PC3 and PC4 on Fa0/3 and Fa0/4. Straight-through cables.',
  addressing: [
    { device: 'PC1', interface: 'NIC', address: '192.168.10.11/24' },
    { device: 'PC2', interface: 'NIC', address: '192.168.10.12/24' },
    { device: 'PC3', interface: 'NIC', address: '192.168.20.11/24' },
    { device: 'PC4', interface: 'NIC', address: '192.168.20.12/24' },
  ],
  steps: [
    'Build the topology and set the PC addresses. Before any VLAN config, give all four PCs addresses in the same 192.168.10.0/24 range temporarily and ping between them. All work, because everything is in VLAN 1.',
    'Set the final addresses from the table (PC3 and PC4 in 192.168.20.0/24).',
    'On SW1 create VLAN 10 (SALES) and VLAN 20 (ENG).',
    'Use interface range fa0/1 - 2 and put the ports in VLAN 10; use fa0/3 - 4 for VLAN 20. Set each range to switchport mode access first.',
    'Run show vlan brief. Check that the ports are under the right VLANs.',
    'Ping PC1 → PC2 and PC3 → PC4. Both should succeed.',
    'Ping PC1 → PC3. It should fail. Explain why in one sentence using “barangay”.',
    'In Simulation mode, send a ping from PC1 to PC3 and watch where the ARP broadcast stops.',
  ],
  checklist: [
    'VLAN 10 and VLAN 20 exist and are named',
    'Fa0/1–2 in VLAN 10, Fa0/3–4 in VLAN 20 as access ports',
    'show vlan brief output reviewed',
    'Same-VLAN pings succeed; cross-VLAN ping fails',
    'Wrote why cross-VLAN fails',
  ],
  hints: [
    'If a same-VLAN ping fails, check the PC IP addresses and masks first, then confirm with show vlan brief that both ports are in the same VLAN and that the link lights are green.',
    'The first ping may time out while ARP resolves; run it again.',
  ],
  solution: [
    'configure terminal → vlan 10 → name SALES → vlan 20 → name ENG → exit',
    'interface range fa0/1 - 2 → switchport mode access → switchport access vlan 10',
    'interface range fa0/3 - 4 → switchport mode access → switchport access vlan 20 → end',
    'show vlan brief → copy running-config startup-config',
    'PC1 cannot reach PC3 because the ARP broadcast stays in VLAN 10 and no router connects the VLANs.',
  ],
  breakIt: 'Move Fa0/2 into VLAN 20 without changing PC2’s IP address, then ping PC1 → PC2. Use show vlan brief to find the cause.',
};
