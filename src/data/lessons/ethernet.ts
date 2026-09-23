import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ethernet';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.5',
  domain: 'D1',
  title: 'Ethernet Fundamentals',
  description: 'The Ethernet frame, address types, and the difference between collision domains and broadcast domains.',
  whyMatters:
    'Ethernet is the Layer 2 technology inside nearly every wired LAN, and the frame it uses is what switches read. Understanding the frame and the two kinds of “domain” explains switch behaviour, VLANs and many troubleshooting symptoms.',
  objectives: [
    'Identify every field of an Ethernet II frame',
    'Distinguish unicast, broadcast and multicast frames',
    'Explain minimum and maximum frame size and the role of the FCS',
    'Explain collision domains vs broadcast domains',
    'Recognise the symptoms of a duplex mismatch',
  ],
  estimatedMinutes: 35,
  difficulty: 'beginner',
  keywords: ['Ethernet', 'frame', 'EtherType', 'FCS', 'broadcast domain', 'collision domain', 'duplex', 'CSMA/CD', 'MTU'],
  examObjectives: ['1.1', '1.4', '1.13'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Ethernet is the set of rules for sending data on a wired local network. Data is packed into a small package called a frame with a “to” address, a “from” address, the actual contents, and a check number at the end.',
        'Switches read the “to” address to decide where the frame goes. The check number lets the receiver notice if the frame was damaged on the way.',
      ],
      taglish: [
        'Ang Ethernet ang pamantayan para sa wired na local network. Ang data ay nakalagay sa isang “frame” na may address ng tatanggap, address ng nagpadala, ang laman mismo, at check number sa dulo.',
        'Binabasa ng switch ang address ng tatanggap para malaman kung saang port ipapadala. Ang check number naman (FCS) ang nagsasabi kung nasira ang frame habang bumibiyahe. Kapag sira, itatapon ito — hindi aayusin.',
      ],
      technical: [
        'The Ethernet II frame is: preamble (7 bytes) and start-frame delimiter (1 byte) for synchronisation; destination MAC (6); source MAC (6); EtherType (2) identifying the payload protocol; data/payload (46–1500 bytes); and the frame check sequence, FCS (4), a CRC used to detect errors.',
        'The frame is 64 to 1518 bytes counted from destination MAC through FCS (1522 with an 802.1Q VLAN tag). The 1500-byte payload limit is the MTU. A frame that fails the FCS check is discarded; Ethernet does not retransmit — higher layers such as TCP do.',
        'Destination MAC types: unicast (one device), broadcast (FF:FF:FF:FF:FF:FF — every device in the broadcast domain) and multicast (a group). A collision domain is the set of devices whose transmissions can collide; on a full-duplex switch port there are no collisions. A broadcast domain is the set of devices that receive each other’s broadcasts.',
      ],
    },
    {
      type: 'hook',
      title: 'Saan, Sino, Ano, Laman, Selyo',
      trick: 'Frame ng Ethernet: **SAAN** (Dest MAC) → **SINO** (Source MAC) → **ANO** (Type) → **LAMAN** (Data) → **SELYO** (FCS).',
      taglish: [
        'Isipin ang frame bilang sobre. Sa harap: **Saan** ito pupunta? (Destination MAC). **Sino** ang nagpadala? (Source MAC). **Ano** ang laman? (EtherType — IPv4, ARP, IPv6). Tapos ang **Laman** mismo (Data, 46–1500 bytes). At sa likod, ang **Selyo** (FCS) — kapag sira ang selyo, **tinatapon** ang sobre (hindi inaayos).',
        'Para sa domains: **Switch = bawat port may sariling “kalsada”** (collision domain), pero **iisa pa ring “barangay”** (broadcast domain). **Router = bawat interface may sariling barangay.**',
        'Tandaan ang mga numero: **6 + 6 + 2 + (46–1500) + 4**. Ang MTU na 1500 ay ang **laman lang**; ang buong frame ay hanggang 1518.',
      ],
      test: {
        question: 'Ano ang tamang pagkakasunod ng fields ng Ethernet frame, sa limang salita?',
        answer: 'Saan (Dest MAC), Sino (Source MAC), Ano (Type), Laman (Data), Selyo (FCS).',
      },
    },
    { type: 'diagram', id: 'ethernet-frame', caption: 'Ethernet II frame. The Layer 2 trailer (FCS) is added at the end — Layer 2 is the only layer that adds one.' },
    {
      type: 'terms',
      items: [
        { term: 'Destination / source MAC', definition: '6-byte Layer 2 addresses of the receiver and sender.' },
        { term: 'EtherType', definition: '2-byte field naming the payload: 0x0800 = IPv4, 0x0806 = ARP, 0x86DD = IPv6.' },
        { term: 'Payload / MTU', definition: 'The data carried; the maximum standard payload (MTU) is 1500 bytes.' },
        { term: 'FCS', definition: 'Frame Check Sequence: a 4-byte CRC that lets the receiver detect corruption.' },
        { term: 'Unicast / broadcast / multicast', definition: 'One receiver / everyone in the broadcast domain / a group.' },
        { term: 'Collision domain', definition: 'Devices whose frames can collide. A hub is one domain; each switch port is its own.' },
        { term: 'Broadcast domain', definition: 'All devices that receive a broadcast. Switches (within a VLAN) do not split it; routers do.' },
        { term: 'CSMA/CD', definition: 'Carrier sense multiple access with collision detection — how half-duplex Ethernet handles collisions.' },
        { term: 'Full duplex', definition: 'Send and receive at the same time on separate paths; no collisions.' },
      ],
    },
    {
      type: 'analogy',
      title: 'An envelope, a corridor and a loudspeaker',
      taglish: ['Ang frame ay sobre: “to” at “from” sa harap, paglalarawan ng laman (EtherType), ang liham mismo (payload), at selyo sa likod (FCS). Ang collision domain ay makitid na hallway kung saan nag-uumpugan ang dalawang taong sabay nagsasalita — binibigyan ng switch ang bawat isa ng sariling hallway. Ang broadcast domain naman ay abot ng megaphone; router lang ang nagsasara ng pinto.'],
      body: [
        'The frame is an envelope: “to” and “from” on the front, a contents description (EtherType), the letter (payload), and a tamper seal (FCS) on the back.',
        'A collision domain is a narrow corridor where two people trying to speak at once clash. A switch gives every person their own private corridor. A broadcast domain is the range of a loudspeaker: everyone in the building hears an announcement, and only a router closes the door.',
      ],
    },
    {
      type: 'flow',
      title: 'Domains: who hears what',
      steps: [
        'Hub: all ports share one collision domain and one broadcast domain.',
        'Switch, one VLAN: every port is its own collision domain, but all ports share one broadcast domain.',
        'Router: every interface is its own broadcast domain, so broadcasts stop at the router.',
        'Example: one switch with six PCs in one VLAN = six collision domains, one broadcast domain.',
      ],
    },
    {
      type: 'cli',
      title: 'Checking Ethernet links on a switch',
      transcript: `SW1# show interfaces status
Port      Name               Status       Vlan       Duplex  Speed Type
Fa0/1                        connected    1          a-full  a-100 10/100BaseTX
Fa0/2                        notconnect   1            auto   auto 10/100BaseTX
Fa0/3                        disabled     1            auto   auto 10/100BaseTX

SW1# show interfaces fastEthernet 0/1
FastEthernet0/1 is up, line protocol is up (connected)
  Hardware is Fast Ethernet, address is 0011.2233.4401 (bia 0011.2233.4401)
  MTU 1500 bytes, BW 100000 Kbit/sec, DLY 100 usec,
  Full-duplex, 100Mb/s, media type is 10/100BaseTX
  ...
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored`,
      copyable: 'show interfaces status\nshow interfaces fastEthernet 0/1',
      explain: [
        { line: 'show interfaces status', why: 'A switch-only one-line-per-port view of status, VLAN, duplex, speed and media.' },
        { line: 'a-full / a-100', why: 'The “a-” prefix means the value was auto-negotiated (here full duplex, 100 Mb/s).' },
        { line: 'connected / notconnect / disabled', why: 'connected = link up. notconnect = no link (cable or far end). disabled = administratively shut down.' },
        { line: 'MTU 1500 bytes', why: 'The maximum payload — not the maximum frame size.' },
        { line: 'input errors, CRC', why: 'Rising CRC errors mean frames are arriving damaged (bad cable, interference or a duplex mismatch).' },
      ],
      note: 'Illustrative output for a Catalyst-style switch; details vary by model.',
    },
    { type: 'callout', kind: 'trap', text: 'A switch splits COLLISION domains but not BROADCAST domains. A router splits broadcast domains. Expect at least one question that counts both.' },
    { type: 'callout', kind: 'trap', text: 'MTU 1500 is the payload size. The full frame is up to 1518 bytes (1522 with a VLAN tag). The 8-byte preamble/SFD is not counted in the frame size.' },
    { type: 'callout', kind: 'tip', text: 'Leave speed and duplex on auto on both ends unless there is a reason not to. If you must set them manually, set BOTH ends the same.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Common mistakes',
      items: [
        'Thinking the FCS is a header. It is a trailer at the end of the frame.',
        'Believing Ethernet fixes corrupted frames. It only detects them; the frame is dropped.',
        'Assuming a switch stops broadcasts. It floods them to every port in the VLAN.',
        'Hard-coding speed/duplex on one end and leaving the other on auto — the auto side can fall back to half duplex.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting scenario: slow link with errors',
      scenario: 'Users on port Fa0/5 complain that file copies are painfully slow, though pings work. The switch port shows rising CRC errors. The router on the far end reports late collisions.',
      evidence: `SW1# show interfaces fa0/5
  Half-duplex, 100Mb/s
     418 input errors, 402 CRC, 0 frame`,
      question: 'What is the most likely cause?',
      answer: 'A duplex mismatch. One end runs half duplex while the other is full duplex, so the full-duplex side sends whenever it likes and the half-duplex side sees late collisions and corrupted frames (CRC errors). Low-volume traffic like ping still works; bulk transfers collapse.',
      fix: 'Set both ends to auto (“speed auto”, “duplex auto”) or configure both ends to the same fixed values, then clear counters and confirm with “show interfaces status”.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge: count the domains',
      prompt: 'Two switches are joined by a trunk. Each has 4 PCs, all in VLAN 10. A router with one interface in VLAN 10 and one in VLAN 20 hangs off one switch. How many broadcast domains involve VLAN 10, and how many collision domains do the 8 PCs’ access ports create?',
      answer: 'VLAN 10 is a single broadcast domain across both switches. Each of the 8 PC access ports is its own collision domain (plus the trunk and router links, which are separate too).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Know the fields in order: destination MAC, source MAC, EtherType, data, FCS.',
        'FCS detects errors; it does not correct them.',
        'Broadcast MAC is FF:FF:FF:FF:FF:FF.',
        'Full duplex means no collisions; CSMA/CD only matters in half duplex.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Ethernet frames carry destination MAC, source MAC, EtherType, payload and FCS.',
        'The FCS detects damage; damaged frames are dropped.',
        'Switch ports are separate collision domains; a VLAN is one broadcast domain.',
        'Routers separate broadcast domains.',
        'Duplex mismatches cause CRC errors, late collisions and slow transfers.',
        'Next: the 48-bit addresses inside those frames — MAC addresses.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'Which field in an Ethernet II frame identifies the upper-layer protocol carried in the payload?',
    choices: ['Preamble', 'EtherType', 'FCS', 'Source MAC'], correct: [1],
    explanation: 'EtherType says what the payload contains, for example 0x0800 for IPv4.',
    wrong: { 0: 'The preamble is for synchronisation.', 2: 'The FCS is an error check.', 3: 'The source MAC identifies the sender.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'What is the purpose of the FCS?',
    choices: ['To correct errors in the frame', 'To detect corrupted frames', 'To encrypt the payload', 'To identify the VLAN'], correct: [1],
    explanation: 'The FCS is a CRC. A frame that fails the check is discarded; retransmission is left to higher layers.',
    wrong: { 0: 'Ethernet does not correct errors.', 2: 'The FCS does not encrypt anything.', 3: 'VLANs are identified by the 802.1Q tag.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'What is the Layer 2 broadcast address?',
    choices: ['00:00:00:00:00:00', 'FF:FF:FF:FF:FF:FF', '255.255.255.255', '01:00:5E:00:00:01'], correct: [1],
    explanation: 'A frame sent to FF:FF:FF:FF:FF:FF is delivered to every device in the broadcast domain.',
    wrong: { 0: 'All zeros is not a normal destination.', 2: 'That is the IPv4 limited broadcast, a Layer 3 address.', 3: 'That is an IPv4 multicast MAC.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'medium', type: 'single',
    prompt: 'A switch connects 6 PCs, all in one VLAN. How many collision domains and broadcast domains exist on it?',
    choices: ['6 collision domains, 1 broadcast domain', '1 collision domain, 6 broadcast domains', '1 collision domain, 1 broadcast domain', '6 collision domains, 6 broadcast domains'], correct: [0],
    explanation: 'Each switch port is its own collision domain, but all ports in one VLAN share a broadcast domain.',
    wrong: { 1: 'That describes the opposite.', 2: 'That is a hub, not a switch.', 3: 'A switch does not create a broadcast domain per port.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'medium', type: 'single',
    prompt: 'Which device separates broadcast domains?',
    choices: ['Hub', 'Layer 2 switch (single VLAN)', 'Router', 'Repeater'], correct: [2],
    explanation: 'Routers do not forward broadcasts, so each router interface is its own broadcast domain.',
    wrong: { 0: 'Hubs repeat everything.', 1: 'A switch floods broadcasts to all ports in the VLAN.', 3: 'Repeaters just regenerate signals.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.4', difficulty: 'medium', type: 'single',
    prompt: 'Which duplex mode makes CSMA/CD necessary?',
    choices: ['Full duplex', 'Half duplex', 'Auto duplex on gigabit only', 'PoE'], correct: [1],
    explanation: 'In half duplex, a device cannot send and receive at once, so collisions can occur and CSMA/CD manages them. Full duplex avoids collisions.',
    wrong: { 0: 'Full duplex has separate send and receive paths.', 2: 'Auto is a negotiation setting, not a mode.', 3: 'PoE is about power.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.4', difficulty: 'hard', type: 'single',
    prompt: 'A switch port shows rising CRC errors and the far end reports late collisions. Ping works but large file copies are very slow. What is the most likely cause?',
    choices: ['Duplex mismatch', 'Wrong default gateway', 'A missing VLAN', 'An ACL blocking TCP'], correct: [0],
    explanation: 'A duplex mismatch causes late collisions and CRC errors that hurt bulk transfers while light traffic still gets through.',
    wrong: { 1: 'A gateway problem would stop remote traffic entirely.', 2: 'A missing VLAN would break connectivity completely.', 3: 'An ACL would not cause CRC errors.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'medium', type: 'single',
    prompt: 'What is the maximum standard Ethernet frame size (destination MAC through FCS, no VLAN tag)?',
    choices: ['1500 bytes', '1518 bytes', '1522 bytes', '9000 bytes'], correct: [1],
    explanation: '1500 bytes of payload plus 14 bytes of header and 4 bytes of FCS = 1518 bytes.',
    wrong: { 0: '1500 is the MTU (payload), not the frame size.', 2: '1522 is the size with an 802.1Q tag.', 3: 'Jumbo frames are non-standard.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.4', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: on a full-duplex switch port, collisions cannot occur.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'Full duplex uses separate paths for sending and receiving, so there are no collisions.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: paano tandaan ang fields ng Ethernet frame?', back: 'SAAN (Dest MAC) · SINO (Source MAC) · ANO (Type) · LAMAN (Data 46–1500) · SELYO (FCS, 4 bytes). Switch = bawat port sariling collision domain; router = bawat interface sariling broadcast domain.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Ethernet II frame fields in order?', back: 'Preamble/SFD, destination MAC, source MAC, EtherType, data (46–1500 B), FCS.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Minimum and maximum Ethernet frame size?', back: '64 to 1518 bytes (1522 with an 802.1Q tag).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What is the MTU?', back: 'The maximum payload: 1500 bytes for standard Ethernet.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What does the FCS do?', back: 'Detects damaged frames (CRC). Bad frames are dropped, not fixed.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'concept', front: 'EtherType values for IPv4, ARP, IPv6?', back: '0x0800, 0x0806, 0x86DD.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'switching', front: 'Switch: collision domains vs broadcast domains?', back: 'Each port is its own collision domain; all ports in one VLAN share one broadcast domain.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'switching', front: 'What splits broadcast domains?', back: 'A router (and VLANs on a switch).' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Symptoms of a duplex mismatch?', back: 'Late collisions, CRC errors, slow bulk transfers while ping still works.' },
  { id: `${ID}-f9`, lessonId: ID, domain: 'D1', category: 'command', front: 'Command for per-port status, duplex and speed on a switch?', back: 'show interfaces status' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Build the link and read the frame',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Bring up an Ethernet link, check speed and duplex, and inspect an Ethernet II frame in Simulation mode.',
  topology: 'PC1 ─── SW1 ─── PC2',
  addressing: [
    { device: 'PC1', interface: 'FastEthernet0', address: '192.168.1.11/24' },
    { device: 'PC2', interface: 'FastEthernet0', address: '192.168.1.12/24' },
  ],
  steps: [
    'Place PC1, PC2 and SW1 (2960). Connect PC1 to Fa0/1 and PC2 to Fa0/2 with copper straight-through cables.',
    'Wait for green link triangles. Set the PC addresses from the table.',
    'Open SW1 CLI: enable, then “show interfaces status”. Record the status, duplex and speed of Fa0/1 and Fa0/2.',
    'Run “show interfaces fa0/1” and find the hardware (MAC) address, MTU, duplex and the input error counters.',
    'Send a ping from PC1 to PC2. Then in Simulation mode add a simple PDU from PC1 to PC2 and step through it.',
    'Click the PDU at PC1 and open Outbound PDU Details. Identify the Ethernet II fields: destination address, source address, and type.',
    'Write down the EtherType value you see for the ICMP echo and for the ARP request that comes first.',
  ],
  checklist: [
    'Both links are up (connected) and negotiated the same duplex',
    'You located the MTU (1500) and the MAC address on Fa0/1',
    'You found the Ethernet II source and destination fields in Simulation mode',
    'You noted that the ARP frame’s destination is the broadcast address',
  ],
  hints: [
    'Packet Tracer labels the frame as “Ethernet II” with DEST ADDR, SRC ADDR and TYPE.',
    'The very first frame from PC1 is usually ARP, addressed to FFFF.FFFF.FFFF.',
  ],
  solution: [
    'Fa0/1 and Fa0/2 normally show a-full / a-100 (auto-negotiated full duplex at 100 Mb/s).',
    'The ARP frame’s EtherType is 0x0806 and its destination is FFFF.FFFF.FFFF (broadcast); the ICMP frame’s EtherType is 0x0800 (IPv4).',
    'MTU is 1500 bytes; error counters should be zero in a healthy lab.',
  ],
  breakIt: 'On SW1 Fa0/1 enter “duplex half” and “speed 10”, leaving PC1 on auto. Compare “show interfaces status” before and after, then restore with “duplex auto” and “speed auto”.',
};
