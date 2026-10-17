import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'port-security';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.8',
  domain: 'D5',
  title: 'Port Security: Controlling Which Devices Can Use a Switch Port',
  description: 'How to limit the MAC addresses on an access port, learn them with sticky, and choose between protect, restrict and shutdown violation modes.',
  whyMatters:
    'Kahit sino ay puwedeng magsaksak ng laptop sa pader ng opisina. Ang port security ang pumipigil dito: sinasabi mo sa switch kung aling MAC address lang ang puwede sa isang port. Sa exam, tatanungin ka kung ano ang mangyayari sa violation (shutdown, restrict o protect) at kung paano mag-recover sa err-disabled.',
  objectives: [
    'Enable port security on an access port with switchport port-security',
    'Set the maximum number of MAC addresses and add static or sticky addresses',
    'Compare the violation modes protect, restrict and shutdown',
    'Recover a port that is err-disabled by a port-security violation',
    'Verify with show port-security and show port-security interface',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['port security', 'switchport port-security', 'sticky', 'maximum', 'violation', 'shutdown', 'restrict', 'protect', 'err-disabled', 'show port-security', 'secure MAC'],
  examObjectives: ['5.7'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Port security lets a switch remember which devices are allowed on a port. If a different device appears, the switch reacts. It stops someone from plugging a rogue laptop, or a small switch with many hosts, into your wall socket.',
        'You choose how many MAC addresses a port may learn, whether they are typed in or learned automatically (sticky), and what happens on a violation: ignore quietly, drop and log, or shut the port down.',
      ],
      taglish: [
        'Ang **port security** ay nagpapahintulot sa switch na **tandaan kung aling device ang pinapayagan sa isang port**. Kapag **may ibang device na lumabas**, **kumikilos ang switch**. Napipigilan nito ang **rogue laptop** o **maliit na switch na may maraming host** na isinaksak sa pader.',
        'Pipiliin mo: **ilang MAC address ang puwede** sa port (default 1), **paano ito matututunan** (nai-type, o **sticky** = kusang natututunan at isinasave), at **ano ang mangyayari sa violation**.',
        'Tatlong **violation mode**: **protect** (**tahimik na itinatapon** ang frame, **walang log**), **restrict** (**itinatapon + log + counter**), **shutdown** (**err-disabled** ang port — **default**).',
        'Para makabawi sa **err-disabled**: **shutdown** saka **no shutdown** sa interface (o **errdisable recovery**).',
      ],
      technical: [
        'Port security applies only to static access (or voice) ports, not dynamic or trunk ports. Enable with switchport mode access, switchport port-security. Defaults: maximum 1 secure MAC address, violation mode shutdown, and no addresses are learned until traffic arrives.',
        'Secure MAC address types: static (switchport port-security mac-address <mac>), dynamic (learned and removed on reload) and sticky (switchport port-security mac-address sticky; learned addresses are added to the running config and survive a reload if saved). Set the limit with switchport port-security maximum <n>.',
        'A violation occurs when a MAC address beyond the maximum appears, or a secure address is seen on another secure port in the same VLAN. Modes: protect drops the offending frames with no notification and no counter; restrict drops them, sends a syslog and SNMP trap and increments the violation counter; shutdown (default) puts the port into err-disabled, logs and sends a trap.',
        'Recovery: shutdown then no shutdown on the interface clears err-disabled, or configure errdisable recovery cause psecure-violation and errdisable recovery interval <seconds>. Aging can remove dynamic secure addresses (switchport port-security aging time, aging type inactivity).',
        'Verification: show port-security (summary of all ports with max, current and violation counts), show port-security interface <if> (status Secure-up, Secure-shutdown, violation mode, last source address), show port-security address (the secure MAC table), show interfaces status (err-disabled).',
      ],
    },
    {
      type: 'analogy',
      title: 'Guest list sa pinto ng kuwarto',
      body: [
        'A hotel room door has a list of the people allowed to enter, and a guard. Protect mode is a guard who quietly turns strangers away, restrict mode turns them away and writes it in the logbook, and shutdown mode locks the whole door until the manager unlocks it.',
      ],
      taglish: [
        'May **listahan ng pinapayagang pumasok** at **guwardiya** ang pinto ng kuwarto sa hotel. Ang **protect** ay guwardiyang **tahimik na pinapaalis ang estranghero**. Ang **restrict** ay **pinapaalis at isinusulat sa logbook**. Ang **shutdown** ay **ni-lo-lock ang buong pinto hanggang buksan ng manager**.',
      ],
    },
    {
      type: 'hook',
      title: 'PRS: Protect, Restrict, Shutdown — pataas ang higpit',
      trick: '**PRS**: **P**rotect (tahimik) → **R**estrict (log) → **S**hutdown (patay ang port, **default**). Default max **1** MAC. **Sticky** = natututunan at isinasave.',
      taglish: [
        '**P**rotect = **drop lang**, walang log. **R**estrict = **drop + log + counter**. **S**hutdown = **err-disabled** (**default**).',
        'Default **maximum = 1** MAC address, mode **shutdown**.',
        '**Sticky** = **kusang natututunan** at **nasa running-config**; **i-save** para tumagal sa reload.',
        'Recover: **shutdown** → **no shutdown**.',
      ],
      test: {
        question: 'Naka-configure ang port security na may default settings at may nagsaksak ng pangalawang laptop sa port. Ano ang mangyayari at paano mababawi?',
        answer: 'Lalampas sa maximum na 1 MAC, kaya mag-vi-violation sa default mode na shutdown at magiging err-disabled ang port. Bawi: alisin ang sobrang device, saka shutdown at no shutdown sa interface.',
      },
    },
    { type: 'diagram', id: 'port-security-modes', caption: 'Tatlong violation mode: protect (drop), restrict (drop + log), shutdown (err-disabled).' },
    {
      type: 'terms',
      items: [
        { term: 'Port security', definition: 'A switch feature that limits which MAC addresses may use an access port.' },
        { term: 'Secure MAC address', definition: 'A MAC address the port is allowed to use: static, dynamic or sticky.' },
        { term: 'Sticky', definition: 'Learned secure addresses are added to the running configuration and can be saved.' },
        { term: 'Maximum', definition: 'The number of secure MAC addresses allowed on the port; default 1.' },
        { term: 'Violation', definition: 'A frame from a MAC beyond the maximum or from an unauthorised address.' },
        { term: 'Protect / restrict / shutdown', definition: 'Violation modes: drop silently, drop and log, or err-disable the port (default).' },
        { term: 'err-disabled', definition: 'A port shut down by a protection feature; needs shutdown/no shutdown or timed recovery.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: pag-secure ng Fa0/5 gamit ang sticky',
      steps: [
        'Itinakda ang Fa0/5 sa access mode: switchport mode access.',
        'I-enable ang port security: switchport port-security.',
        'Itakda ang sticky: switchport port-security mac-address sticky. Natututunan ang MAC ng unang device.',
        'Itakda ang violation mode (opsyonal): switchport port-security violation restrict.',
        'Nagsaksak ang attacker ng ibang laptop: lumalampas sa maximum ang MAC count.',
        'Itinatapon ang frame ng attacker at nagla-log (restrict), o nagiging err-disabled ang port (shutdown).',
      ],
    },
    {
      type: 'cli',
      title: 'I-configure ang port security',
      transcript: `SW1(config)# interface fa0/5
SW1(config-if)# switchport mode access
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security maximum 2
SW1(config-if)# switchport port-security mac-address sticky
SW1(config-if)# switchport port-security violation restrict
SW1(config-if)# end
SW1# show port-security interface fa0/5
Port Security              : Enabled
Port Status                : Secure-up
Violation Mode             : Restrict
Maximum MAC Addresses      : 2
Total MAC Addresses        : 1
Sticky MAC Addresses       : 1
Last Source Address:Vlan   : 0050.7966.6801:1
Security Violation Count   : 0
SW1# show running-config interface fa0/5 | include sticky
 switchport port-security mac-address sticky 0050.7966.6801`,
      copyable: 'switchport port-security mac-address sticky',
      explain: [
        { line: 'switchport mode access', why: 'Port security only works on static access (or voice) ports, so set the mode first.' },
        { line: 'switchport port-security', why: 'Turns the feature on with defaults (maximum 1, violation shutdown).' },
        { line: 'switchport port-security maximum 2', why: 'Allows up to two secure MAC addresses, for example a PC and an IP phone.' },
        { line: 'mac-address sticky', why: 'Learns addresses automatically and writes them into the running config.' },
        { line: 'violation restrict', why: 'Drops violating frames and logs them, but keeps the port up for legitimate devices.' },
        { line: 'Port Status: Secure-up', why: 'The port is up and protected; Secure-shutdown would mean a violation disabled it.' },
      ],
      note: 'Sample output for study; MAC addresses will differ.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show port-security', shows: 'Each secured port with its maximum, current count, violation count and action.' },
        { command: 'show port-security interface fa0/5', shows: 'Status (Secure-up or Secure-shutdown), mode, learned addresses and the last source MAC.' },
        { command: 'show port-security address', shows: 'The secure MAC address table with type (sticky, static, dynamic).' },
        { command: 'show interfaces status', shows: 'Whether a port is err-disabled after a violation.' },
      ],
      good: 'Secure-up with the expected MAC learned and a violation count of 0.',
      bad: 'Secure-shutdown / err-disabled after a violation, or a rising violation count in restrict mode.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **default violation mode ay SHUTDOWN**, at ang **default maximum ay 1**. Kapag may nagsaksak ng IP phone at PC sa port na default, **mag-vi-violation agad** — kailangan **maximum 2**.' },
    { type: 'callout', kind: 'trap', text: 'Ang **protect ay walang log at walang counter**; ang **restrict ay may log at counter**. Madalas ito itinatanong: alin ang nagpapataas ng **violation counter**? **Restrict at shutdown**.' },
    { type: 'callout', kind: 'tip', text: 'Gumagana lang ang port security sa **access ports** (hindi dynamic o trunk). Kapag nagkamali ng mode, **hindi ito mag-e-enable**. At para tumagal ang **sticky** sa reload, **copy running-config startup-config**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pag-enable ng port security sa dynamic o trunk port.',
        'Pag-iwan ng maximum 1 sa port na may IP phone at PC.',
        'Hindi pag-save ng config kaya nawala ang sticky addresses.',
        'Pag-akalang may log ang protect.',
        'Pagkalimot sa shutdown/no shutdown pagkatapos ng err-disabled.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Patay ang network port ng accountant"',
      scenario: 'An accountant reports the wall port is dead after bringing a personal laptop to the desk.',
      evidence: `SW1# show interfaces fa0/12 status
Port      Name   Status       Vlan   Duplex  Speed Type
Fa0/12           err-disabled 20     auto    auto  10/100BaseTX
SW1# show port-security interface fa0/12
Port Status                : Secure-shutdown
Violation Mode             : Shutdown
Security Violation Count   : 1`,
      question: 'Ano ang nangyari at paano mo ito aayusin?',
      answer: 'Lumampas ang bagong laptop sa maximum na 1 secure MAC, at sa default na shutdown mode ay na-err-disable ang port (Secure-shutdown).',
      fix: 'Alisin ang personal na laptop, saka interface fa0/12 → shutdown → no shutdown. Kung kailangan ng dalawang device, itaas ang maximum o gumamit ng restrict mode. Pag-isipan ang errdisable recovery cause psecure-violation.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang isang port ay may PC at IP phone. Anong mga command ang ilalagay para sa port security na may sticky learning, at hindi mag-shutdown sa violation?',
      answer: 'switchport mode access, switchport port-security, switchport port-security maximum 2, switchport port-security mac-address sticky, switchport port-security violation restrict. Ang restrict ay nagla-log pero hindi nag-s-shutdown ng port.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Port security works on static access ports; default max 1 and violation mode shutdown.',
        'Sticky learns MACs into the running-config; save to keep them.',
        'protect = drop only; restrict = drop + log + counter; shutdown = err-disabled.',
        'Recover with shutdown then no shutdown (or errdisable recovery).',
        'Verify with show port-security [interface <if>] and show port-security address.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Port security limits which MAC addresses can use an access port.',
        'Choose static or sticky learning and set the maximum.',
        'Pick protect, restrict or shutdown for violations; shutdown is default.',
        'Recover err-disabled ports manually or with timed recovery.',
        'Susunod: DHCP snooping — proteksyon laban sa rogue DHCP servers.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'easy', type: 'single',
    prompt: 'What is the default violation mode for port security?',
    choices: ['Protect', 'Restrict', 'Shutdown', 'Log'], correct: [2],
    explanation: 'The default violation mode is shutdown, which puts the port in err-disabled.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'easy', type: 'single',
    prompt: 'What is the default maximum number of secure MAC addresses on a port?',
    choices: ['0', '1', '2', '8'], correct: [1],
    explanation: 'By default one secure MAC address is allowed.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'Which violation mode drops offending frames and logs them while keeping the port up?',
    choices: ['Protect', 'Restrict', 'Shutdown', 'Sticky'], correct: [1],
    explanation: 'Restrict drops the frames, generates logs and increments the violation counter without disabling the port.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'What does "switchport port-security mac-address sticky" do?',
    choices: ['Blocks all MAC addresses', 'Learns MAC addresses dynamically and adds them to the running configuration', 'Disables learning', 'Enables PortFast'], correct: [1],
    explanation: 'Sticky learns secure addresses and writes them into the running config.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'On which type of port can port security be enabled?',
    choices: ['Dynamic desirable ports', 'Static access ports', 'Trunk ports', 'Routed ports on a router'], correct: [1],
    explanation: 'Port security requires a static access (or voice) port.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'How do you recover a port that port security has err-disabled?',
    choices: ['clear mac address-table', 'shutdown then no shutdown on the interface', 'no switchport', 'reload the router'], correct: [1],
    explanation: 'Cycling the interface (or errdisable recovery) clears the err-disabled state.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'hard', type: 'single',
    prompt: 'A port connects a PC and an IP phone. What is the minimum change from the default to avoid violations?',
    choices: ['switchport port-security maximum 2', 'switchport port-security violation protect', 'switchport mode trunk', 'spanning-tree portfast'], correct: [0],
    explanation: 'Two devices need two secure addresses, so raise the maximum to 2.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO violation modes increment the violation counter?',
    choices: ['Protect', 'Restrict', 'Shutdown', 'None of them'], correct: [1, 2],
    explanation: 'Restrict and shutdown count violations; protect drops silently with no counter.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: sticky MAC addresses survive a reload only if the configuration is saved.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — sticky addresses are in the running config and must be saved to startup-config.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: paano tandaan ang violation modes?', back: 'PRS: Protect (tahimik drop), Restrict (drop + log + counter), Shutdown (err-disabled, default). Default max 1 MAC. Sticky = kusang natututunan.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'command', front: 'Basic port-security config?', back: 'switchport mode access → switchport port-security → (maximum n) → (mac-address sticky) → (violation restrict)' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Violation modes compared?', back: 'Protect: drop only. Restrict: drop + log + counter. Shutdown: err-disabled (default).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Defaults for port security?', back: 'Maximum 1 secure MAC, violation shutdown, works only on static access ports.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'command', front: 'Verify port security?', back: 'show port-security, show port-security interface <if>, show port-security address' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'command', front: 'Recover from a violation err-disable?', back: 'interface <if> → shutdown → no shutdown (or errdisable recovery cause psecure-violation).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Secure an access port and trigger a violation',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Configure sticky port security, plug in a second device, observe the violation and recover.',
  topology: 'PC1 on Fa0/5 of SW1, with a spare PC2 to simulate an intruder.',
  steps: [
    'On SW1 Fa0/5: switchport mode access, switchport port-security, switchport port-security mac-address sticky.',
    'Ping from PC1 to let the switch learn its MAC; run show port-security interface fa0/5.',
    'Replace PC1 with PC2 on Fa0/5 and generate traffic.',
    'Observe the port status and run show interfaces status and show port-security.',
    'Recover: restore PC1, then shutdown and no shutdown on Fa0/5.',
    'Change the violation mode to restrict and repeat the test; compare the behaviour.',
  ],
  checklist: [
    'Sticky MAC learned and visible',
    'Port err-disabled after the intruder connected',
    'Recovered with shutdown / no shutdown',
    'Compared shutdown with restrict behaviour',
  ],
  hints: [
    'The port must be in access mode before port security can be enabled.',
    'The first device that sends traffic becomes the sticky address.',
  ],
  solution: [
    'The second MAC exceeds the maximum of 1, so the default shutdown mode err-disables the port.',
    'In restrict mode the port stays up, the intruder is dropped and the violation counter rises.',
  ],
  breakIt: 'Set maximum 2 and show that two devices now work, then plug in a third to trigger a violation.',
};
