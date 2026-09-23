import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'cabling-physical';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.8',
  domain: 'D1',
  title: 'Cabling and Physical Interfaces',
  description: 'Copper and fibre, straight-through and crossover, speed and duplex, and how to read interface errors.',
  whyMatters:
    'Kapag walang link, walang network. The exam expects you to pick the right cable, compare copper and fibre, and read “show interfaces” errors. It is also the fastest place to find real-world faults: most “network problems” are Layer 1.',
  objectives: [
    'Compare UTP copper, multimode fibre and single-mode fibre',
    'Choose straight-through or crossover for a pair of devices',
    'Explain auto-negotiation, speed, duplex and Auto-MDIX',
    'Distinguish shared media from point-to-point links',
    'Read interface states and error counters (CRC, runts, giants, collisions)',
  ],
  estimatedMinutes: 35,
  difficulty: 'beginner',
  keywords: ['UTP', 'RJ-45', 'straight-through', 'crossover', 'fibre', 'multimode', 'single-mode', 'SFP', 'duplex', 'CRC', 'runts', 'giants', 'Auto-MDIX'],
  examObjectives: ['1.3', '1.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Devices need a path to send signals. That path is a cable (or radio). The most common wired choices are copper cables that carry electricity and fibre-optic cables that carry light.',
        'Copper is cheap but only works for about 100 metres. Fibre is more expensive but goes much farther and is not bothered by electrical noise.',
      ],
      taglish: [
        'Kailangan ng daan ng signal. Ang pinakakaraniwang “daan” ay cable: ang **copper** (UTP, may RJ-45 na dulo) ay nagdadala ng kuryente, at ang **fibre** ay nagdadala ng ilaw.',
        'Ang copper ay mura pero hanggang **100 metro** lang ang abot. Ang fibre ay mas mahal pero mas malayo ang abot at hindi naaapektuhan ng electrical noise. May dalawang klase ng fibre: **multimode** (maikli, sa loob ng building) at **single-mode** (napakalayo, kilometro).',
        'Sa copper, kailangan mo ring alamin kung **straight-through** o **crossover**. Ang lumang panuntunan: kapag **magkaiba ang uri** ng device, straight-through; kapag **magkapareho**, crossover. Sa panahon ngayon, ang **Auto-MDIX** ang bahala rito — pero tinatanong pa rin ito sa exam.',
      ],
      technical: [
        'UTP (unshielded twisted pair) copper uses four twisted pairs and RJ-45 connectors; the maximum segment length is 100 m. Cat5e supports 1000BASE-T; Cat6 supports 1 Gb/s (10 Gb/s over short runs); Cat6a supports 10 Gb/s to 100 m. 10/100 Mb/s Ethernet uses two pairs (pins 1,2 transmit and 3,6 receive); 1000BASE-T uses all four pairs.',
        'PCs, servers, routers and APs are MDI devices (transmit on pins 1,2). Switches and hubs are MDI-X (transmit on 3,6). Connecting unlike types needs a straight-through cable (same standard, typically T568B, at both ends); connecting like types needs a crossover (T568A at one end, T568B at the other). Auto-MDIX lets a port detect and swap the pairs automatically.',
        'Fibre carries light. Multimode (MMF) has a wide core (50/62.5 µm), uses LED/VCSEL sources and reaches hundreds of metres (for example 1000BASE-SX ≈ 550 m). Single-mode (SMF) has a ~9 µm core, uses lasers and reaches kilometres (1000BASE-LX ≈ 10 km). Fibre needs two strands (transmit and receive), commonly with LC or SC connectors and SFP/SFP+ transceivers, and is immune to electromagnetic interference. Modern Ethernet is point-to-point (a switch port to one device, full duplex); shared-media Ethernet (hubs, half duplex, CSMA/CD) is legacy.',
      ],
    },
    {
      type: 'analogy',
      title: 'Kalsada',
      body: [
        'Copper is a narrow local street: cheap, everywhere, but it only reaches so far and traffic noise (interference) bothers it. Multimode fibre is a wide highway inside one city. Single-mode fibre is a long expressway between cities.',
      ],
      taglish: [
        'Ang copper ay parang eskinita: mura, nasa lahat ng lugar, pero maikli lang ang abot at naiistorbo ng ingay (interference). Ang multimode fibre ay parang malawak na highway sa loob ng lungsod. Ang single-mode fibre ay parang expressway papunta sa ibang probinsya.',
      ],
    },
    {
      type: 'hook',
      title: 'Sino ang kakaiba?',
      trick: '**Switch at Hub ang “kakaibang team.”** Magkaiba ang team = **Straight**. Magkapareho ang team = **Cross**.',
      taglish: [
        'Dalawang team lang ang kailangan mong tandaan: **Team Dulo** (PC, Server, Router, AP) at **Team Kakaiba** (Switch, Hub). Kapag magkaiba ang team, straight-through. Kapag magkapareho, crossover.',
        'Kaya: PC–Switch = straight. Switch–Switch = **cross**. Router–Switch = straight. **PC–Router = cross** (parehong Team Dulo!). PC–PC = cross.',
        'Para sa fibre: **Multi = Malapit** (multimode, maikli, loob ng building). **Single = Sobrang layo** (single-mode, kilometro).',
      ],
      test: {
        question: 'Router ↔ PC: straight-through o crossover? At bakit?',
        answer: 'Crossover — parehong Team Dulo (parehong MDI). Kapag magkapareho, cross. (Sa modern devices, ang Auto-MDIX ang nag-aayos, pero iyan ang sagot sa exam.)',
      },
    },
    { type: 'diagram', id: 'media-compare', caption: 'Copper, multimode at single-mode fibre: signal, abot, connector, gastos at gamit.' },
    { type: 'interactive', id: 'cable-picker', caption: 'Piliin ang tamang cable para sa bawat pares ng device.' },
    {
      type: 'terms',
      items: [
        { term: 'UTP', definition: 'Unshielded twisted pair copper cable with RJ-45 connectors; max 100 m per segment.' },
        { term: 'Straight-through', definition: 'Same wiring standard at both ends; connects unlike devices (PC↔switch, router↔switch).' },
        { term: 'Crossover', definition: 'Transmit and receive pairs swapped; connects like devices (switch↔switch, PC↔router).' },
        { term: 'Auto-MDIX', definition: 'A port feature that detects the cable type and swaps pairs automatically.' },
        { term: 'Multimode fibre (MMF)', definition: 'Wide core, LED/VCSEL light, hundreds of metres.' },
        { term: 'Single-mode fibre (SMF)', definition: 'Thin core, laser light, kilometres.' },
        { term: 'SFP / SFP+', definition: 'Hot-swappable transceiver modules (1 Gb/s and 10 Gb/s) that accept fibre or copper.' },
        { term: 'Auto-negotiation', definition: 'Two ends agree on the best common speed and duplex.' },
        { term: 'Point-to-point vs shared media', definition: 'A switch port and its device have a private link; a hub shares one medium among many.' },
      ],
    },
    {
      type: 'flow',
      title: 'Paano pumili ng media at cable, hakbang-hakbang',
      steps: [
        '**Gaano kalayo?** Kung **100 metro o mas maikli**, copper (UTP) ang default. Kung mas malayo, fibre na ang pag-usapan.',
        '**Anong klase ng fibre?** Sa loob ng building o campus (hanggang daan-daang metro) → **multimode**. Sa pagitan ng mga building o siyudad (kilometro) → **single-mode**.',
        '**Kung copper, anong cable?** Alamin ang team ng bawat dulo: **Switch/Hub ang kakaiba**. Magkaiba ang team → **straight-through**; magkapareho → **crossover**.',
        '**Isaksak at tingnan ang link light.** Berde/up = maayos. Walang ilaw = balikan ang cable, port, o cable type.',
        '**Basahin ang status:** `show interfaces status` (connected / notconnect / err-disabled) at ang duplex/speed (a-full / a-100).',
        '**Basahin ang error counters:** kung tumataas ang CRC, runts o late collisions, suspetsahan ang cable, haba, o duplex mismatch.',
      ],
    },
    {
      type: 'cli',
      title: 'Nakikita ang problema sa cable sa switch',
      transcript: `SW1# show interfaces status
Port      Name   Status       Vlan  Duplex  Speed Type
Fa0/1            connected    1     a-full  a-100 10/100BaseTX
Fa0/2            notconnect   1       auto   auto 10/100BaseTX
Fa0/3            err-disabled 1       auto   auto 10/100BaseTX

SW1# show interfaces counters errors
Port    Align-Err  FCS-Err  Xmit-Err  Rcv-Err  UnderSize  OutDiscards
Fa0/1           0        0         0        0          0            0
Fa0/5           0      402         0      418          0            0`,
      copyable: 'show interfaces status\nshow interfaces counters errors',
      explain: [
        { line: 'connected', why: 'Link is up and working.' },
        { line: 'notconnect', why: 'No link: cable unplugged/faulty, far end off, or wrong cable type on an older port.' },
        { line: 'err-disabled', why: 'A feature (such as port security or BPDU guard) shut the port down. Fix the cause, then shutdown / no shutdown.' },
        { line: 'a-full / a-100', why: 'The “a-” means auto-negotiated: full duplex at 100 Mb/s.' },
        { line: 'FCS-Err / Rcv-Err (Fa0/5)', why: 'Frames arriving damaged (CRC failures). Suspect a bad cable, interference, a too-long run or a duplex mismatch.' },
      ],
      note: 'In “show interfaces”, also watch: runts (frames under 64 bytes, often collisions or a duplex mismatch), giants (over 1518 bytes), collisions and late collisions (duplex mismatch or a cable that is too long), and input/output drops. Illustrative output only.',
    },
    { type: 'callout', kind: 'trap', text: 'PC ↔ Router needs a crossover (both are “Team Dulo”). Router ↔ Switch is straight-through. The exam uses the classic rule even though Auto-MDIX makes either cable work on modern gear.' },
    { type: 'callout', kind: 'trap', text: 'If one end is hard-coded to a speed/duplex and the other is on auto, the auto end can detect the speed but not the duplex — on 10/100 it falls back to half duplex. That causes a duplex mismatch. Set both to auto, or hard-code BOTH ends the same.' },
    { type: 'callout', kind: 'tip', text: 'Status “administratively down” = someone typed shutdown. “notconnect” / “down/down” = a physical problem. Don’t chase IP settings until the link is up.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Assuming a longer copper run “should be fine”. Beyond 100 m you get CRC errors and flapping links.',
        'Mixing up multimode and single-mode. They are not interchangeable — the light source and core size differ.',
        'Forgetting that fibre needs BOTH strands (transmit and receive) connected the right way round.',
        'Reading only the “Status” of an interface and ignoring its error counters.',
        'Treating a hub as a switch. A hub shares one collision domain and only works half duplex.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: “Paputol-putol ang koneksyon”',
      scenario: 'A new desk was cabled with a single copper run measured at about 130 metres from the wiring closet. The link keeps flapping and the port shows rising CRC errors. A short patch cable in the same port works perfectly.',
      question: 'Ano ang diagnosis at paano ito aayusin?',
      answer: 'The run is longer than the 100 m UTP limit, so the signal degrades and arrives corrupted (CRC errors, intermittent link). The switch and port are fine because a short cable works.',
      fix: 'Shorten the run, add a switch or media converter in between, or use fibre for the long segment. Then confirm with show interfaces status (connected) and show interfaces counters errors (no growth).',
    },
    {
      type: 'challenge',
      title: 'Mini challenge: pumili ng cable',
      prompt: 'Which cable (or media) would you choose for: (a) PC to switch, (b) switch to switch in the same closet, (c) router to PC (direct), (d) two buildings 3 km apart, (e) two switches 200 m apart inside one building?',
      answer: '(a) Straight-through. (b) Crossover (classic rule; Auto-MDIX usually makes either work). (c) Crossover. (d) Single-mode fibre. (e) Multimode fibre (copper is too long at 200 m).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'UTP maximum: 100 m. Multimode: shorter distances, LED/VCSEL. Single-mode: long distances, laser.',
        'Unlike devices → straight-through. Like devices → crossover.',
        'CRC errors point to a bad cable, interference, over-length or duplex mismatch. Late collisions point to duplex mismatch or over-length.',
        'Runts are under 64 bytes; giants are over 1518 bytes.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Copper: cheap, ≤100 m. Multimode fibre: hundreds of metres. Single-mode fibre: kilometres.',
        'Switch/Hub are the odd team: unlike = straight, like = cross.',
        'Auto-MDIX and auto-negotiation remove most manual choices on modern devices.',
        'Modern Ethernet is point-to-point and full duplex.',
        'Read status first, then the error counters.',
        'Susunod: binary — ang kasanayang kailangan sa IPv4.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.3', difficulty: 'easy', type: 'single',
    prompt: 'What is the maximum length of a UTP Ethernet copper segment?',
    choices: ['55 metres', '100 metres', '300 metres', '1 kilometre'], correct: [1],
    explanation: 'The standard limit for UTP is 100 m per segment.',
    wrong: { 0: '55 m is a limit for 10 Gb/s over Cat6 only.', 2: 'That is closer to multimode fibre at 10 Gb/s.', 3: 'Copper cannot reach that far.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.3', difficulty: 'easy', type: 'single',
    prompt: 'Which cable is used (by the classic rule) to connect a PC to a switch?',
    choices: ['Crossover', 'Straight-through', 'Rollover', 'Coaxial'], correct: [1],
    explanation: 'Unlike device types (PC and switch) use a straight-through cable.',
    wrong: { 0: 'Crossover is for like devices.', 2: 'A rollover cable is for console access.', 3: 'Not used for Ethernet LANs today.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.3', difficulty: 'medium', type: 'single',
    prompt: 'Which cable does the classic rule call for between two switches?',
    choices: ['Straight-through', 'Crossover', 'Console', 'Serial'], correct: [1],
    explanation: 'Two switches are like devices (both MDI-X), so a crossover is used. Auto-MDIX makes either work on modern switches.',
    wrong: { 0: 'That is for unlike devices.', 2: 'Console cables are for management access.', 3: 'Serial is a WAN link type.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.3', difficulty: 'medium', type: 'single',
    prompt: 'Which media type uses a laser light source and can span many kilometres?',
    choices: ['UTP copper', 'Multimode fibre', 'Single-mode fibre', 'Coaxial cable'], correct: [2],
    explanation: 'Single-mode fibre has a very thin core and laser source, giving the longest reach.',
    wrong: { 0: 'Copper carries electrical signals and is limited to 100 m.', 1: 'Multimode uses LED/VCSEL and reaches hundreds of metres.', 3: 'Coax is not a modern LAN choice.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.3', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are advantages of fibre over copper?',
    choices: ['Immunity to electromagnetic interference', 'Lower cost', 'Longer distances', 'Uses RJ-45 connectors'], correct: [0, 2],
    explanation: 'Fibre is immune to EMI and can span longer distances. It usually costs more and uses LC/SC connectors.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.4', difficulty: 'medium', type: 'single',
    prompt: 'What is a “runt”?',
    choices: ['A frame smaller than 64 bytes', 'A frame larger than 1518 bytes', 'A frame that failed the CRC only', 'A frame dropped because the queue was full'], correct: [0],
    explanation: 'Runts are frames under the 64-byte Ethernet minimum, often caused by collisions or a duplex mismatch.',
    wrong: { 1: 'Those are giants.', 2: 'A CRC error is separate.', 3: 'That is an output/input drop.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.4', difficulty: 'hard', type: 'single',
    prompt: 'A port shows late collisions and CRC errors, and bulk file copies are slow while ping works. What is the most likely cause?',
    choices: ['Duplex mismatch', 'Wrong VLAN', 'Missing default gateway', 'Full ARP table'], correct: [0],
    explanation: 'A duplex mismatch produces late collisions, CRC errors and poor bulk throughput.',
    wrong: { 1: 'A wrong VLAN gives no connectivity at all.', 2: 'A missing gateway blocks remote traffic entirely.', 3: 'Not a real cause of these counters.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.4', difficulty: 'easy', type: 'single',
    prompt: '“show interfaces status” lists a port as “notconnect”. What does that mean?',
    choices: ['The port is administratively shut down', 'No link is detected on the port', 'The port has a duplex mismatch', 'The port is in err-disabled state'], correct: [1],
    explanation: '“notconnect” means the switch sees no link — check the cable and the far end.',
    wrong: { 0: 'That shows as “disabled”.', 2: 'A mismatch usually still shows connected, with errors.', 3: 'That has its own status: err-disabled.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.3', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: Auto-MDIX lets a switch port adapt to either a straight-through or a crossover cable.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'Auto-MDIX detects the cable type and swaps the transmit/receive pairs automatically.',
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D1', objective: '1.4', difficulty: 'medium', type: 'single',
    prompt: 'A copper cable run is 130 m long. The link flaps and shows CRC errors. What is the best fix?',
    choices: ['Change the VLAN', 'Shorten the run or use fibre for the long segment', 'Change the IP address', 'Enable spanning tree'], correct: [1],
    explanation: '130 m exceeds the 100 m UTP limit. Shorten the run, add an intermediate device, or use fibre.',
    wrong: { 0: 'VLANs do not fix Layer 1 length limits.', 2: 'Addressing is not the problem.', 3: 'STP does not repair cabling problems.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: paano tandaan kung straight o crossover?', back: 'Switch at Hub ang “kakaibang team”. Magkaiba ang team = Straight. Magkapareho = Cross. PC–Router = Cross (parehong Team Dulo). Multi = Malapit, Single = Sobrang layo.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Max UTP segment length?', back: '100 metres.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Straight-through vs crossover (classic rule)?', back: 'Unlike devices → straight-through. Like devices → crossover.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Multimode vs single-mode fibre?', back: 'Multimode: wide core, LED/VCSEL, hundreds of metres. Single-mode: ~9 µm core, laser, kilometres.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What does Auto-MDIX do?', back: 'Detects the cable type and swaps the pairs so either straight-through or crossover works.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What is a runt? A giant?', back: 'Runt: frame under 64 bytes. Giant: frame over 1518 bytes.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Late collisions and CRC errors usually mean…?', back: 'A duplex mismatch (or a cable that is too long).' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'command', front: 'Commands to read link state and errors on a switch?', back: 'show interfaces status · show interfaces counters errors · show interfaces <type> <number>' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What does “err-disabled” mean?', back: 'A feature (port security, BPDU guard…) shut the port down. Fix the cause, then shutdown / no shutdown.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Pick the right cable and read the link',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Connect device pairs with the correct cable type, read link status, and see how speed/duplex settings affect the link.',
  topology: `PC1 ─ SW1 ─ SW2 ─ PC2
       │
       R1 ─ PC3`,
  steps: [
    'Place PC1, PC2, PC3, SW1, SW2 (2960) and R1 (2911). Give each a name.',
    'Connect PC1–SW1 with copper straight-through. Connect SW1–SW2 with copper crossover. Connect SW1–R1 Gi0/0 with straight-through. Connect PC3–R1 Gi0/1 with copper crossover. Connect PC2–SW2 with straight-through.',
    'Wait for the link lights. Write down the colour for each link (green = up, amber/red = a problem).',
    'On R1 run no shutdown on Gi0/0 and Gi0/1 so those links can come up.',
    'On SW1 run show interfaces status. Record status, duplex and speed for each port.',
    'Swap one cable for the “wrong” type (for example PC1–SW1 with crossover) and note what the link does. In Packet Tracer some ports auto-adjust — if yours does, that is Auto-MDIX.',
    'On SW1 Fa0/1 set duplex half and speed 10, leaving PC1 on auto. Compare show interfaces status before and after, then restore with duplex auto and speed auto.',
  ],
  checklist: [
    'All links are up with the correct cable types',
    'You noted which unlike/like pairs used which cable',
    'You observed the effect of a wrong cable (or Auto-MDIX)',
    'You captured show interfaces status before and after a manual speed/duplex change',
  ],
  hints: [
    'Router interfaces stay down until you run no shutdown.',
    'If a “wrong” cable still works, your device supports Auto-MDIX; on the exam, still answer with the classic rule.',
  ],
  solution: [
    'Straight-through: PC1–SW1, SW1–R1, PC2–SW2. Crossover: SW1–SW2, PC3–R1.',
    'After hard-coding half/10 on one end only, status shows a fixed duplex/speed that no longer matches the auto side — the beginning of a mismatch.',
    'Restoring duplex auto and speed auto returns to a-full / a-100.',
  ],
  breakIt: 'Make a deliberate duplex mismatch (one side full, other half) and send a big ping: ping <ip> repeat 1000 size 1400. Compare error counters, then fix it.',
};
