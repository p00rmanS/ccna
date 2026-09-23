import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'mac-addresses';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.6',
  domain: 'D1',
  title: 'MAC Addresses',
  description: 'The 48-bit hardware addresses switches use, how to read them, and how they differ from IP addresses.',
  whyMatters:
    'Switches forward on MAC addresses, ARP resolves to them, and port security and troubleshooting depend on reading them. You also need hexadecimal here, which returns in IPv6.',
  objectives: [
    'Explain the size and structure of a MAC address',
    'Read hexadecimal and convert a hex digit to four bits',
    'Identify the OUI and the vendor-assigned portion',
    'Recognise unicast, multicast and broadcast MAC addresses',
    'Write a MAC in colon, hyphen and Cisco dotted formats',
    'Explain why MAC addresses change at each routed hop while IP addresses do not',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['MAC address', 'OUI', 'hexadecimal', 'unicast', 'multicast', 'broadcast', 'NIC', 'burned-in address', 'Layer 2'],
  examObjectives: ['1.13', '1.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A MAC address is the hardware name of a network card. Every card in an Ethernet or Wi-Fi network needs one so frames can be delivered to the right device on the local network.',
        'It is written as 12 characters using the digits 0–9 and the letters A–F, like 00:1A:2B:3C:4D:5E. The first half tells you the manufacturer; the second half is that manufacturer’s serial-style number.',
      ],
      taglish: [
        'Ang MAC address ay parang pangalan ng network card mo — para malaman ng switch kung kanino ihahatid ang frame sa loob ng LAN.',
        'Labindalawang character ito na gumagamit ng 0–9 at A–F, halimbawa 00:1A:2B:3C:4D:5E. Ang unang kalahati ay para sa manufacturer, ang pangalawa ay numero ng card mula sa manufacturer. Hindi mo ito isinusulat sa kamay — nakalagay na sa card. Pero tandaan: para lang ito sa loob ng local network.',
      ],
      technical: [
        'A MAC address is a 48-bit (6-byte) Layer 2 address written as 12 hexadecimal digits. The first 24 bits are the Organisationally Unique Identifier (OUI) assigned by the IEEE to the manufacturer; the last 24 bits are assigned by the manufacturer to make the address unique. The address burned into a NIC is its burned-in address (BIA).',
        'Two bits in the first byte have meaning. The least significant bit is the Individual/Group bit: 0 = unicast, 1 = group (multicast or broadcast). The next bit is the Universal/Local bit: 0 = globally unique (assigned), 1 = locally administered (for example randomised or configured).',
        'FF:FF:FF:FF:FF:FF is the broadcast address. IPv4 multicast maps to 01:00:5E:xx:xx:xx and IPv6 multicast to 33:33:xx:xx:xx:xx. Formats vary by platform: 00:1A:2B:3C:4D:5E (colons), 00-1A-2B-3C-4D-5E (Windows) and 001a.2b3c.4d5e (Cisco IOS).',
      ],
    },
    {
      type: 'analogy',
      title: 'Your name and your home address',
      taglish: ['Ang pangalan mo ay sumusunod sa’yo saan ka man pumunta; ang tirahan mo ay nagbabago kapag lumipat ka. Ang MAC ay parang pangalan — nakabit sa network card. Ang IP ay parang tirahan — depende kung saan ka nakakonekta. Sa sariling kalye, sapat na ang tawagin ang pangalan; sa ibang lungsod, tirahan ang susundan ng parcel, at ang huling lokal na courier lang ang tatawag ulit ng pangalan.'],
      body: [
        'Your name goes wherever you go. Your home address changes when you move. A MAC address is like your name: fixed to the network card, used to point at the right person inside one room or street. An IP address is like your home address: it depends on where you are connected.',
        'A courier on your own street can simply call your name. Once a parcel leaves your city it travels by address, and only the last local courier switches back to calling out your name.',
      ],
    },
    {
      type: 'hook',
      title: 'Pangalan vs Tirahan',
      trick: '**MAC = PANGALAN mo (sumusunod sa’yo).** **IP = TIRAHAN mo (nagbabago).** **Unang kalahati = Owner (OUI). Puro F = Fiesta — imbitado ang lahat.**',
      taglish: [
        'Ang **MAC** ay parang **pangalan**: nakalagay sa network card, kasama mo saan man. Ang **IP** ay parang **tirahan**: nagbabago kapag lumipat ka ng network. Sa loob ng kalye (LAN), pangalan ang tinatawag; sa ibang lungsod, tirahan ang ginagamit.',
        'Sa 12 hex digits: **unang 6 = O**wner/manufacturer (**OUI**), **huling 6 = N**umber (serial ng card). **O-N: Owner, Number.**',
        '**FF:FF:FF:FF:FF:FF** — puro F = **“Fiesta!”** imbitado ang lahat = **broadcast**. At sa pagtawid ng router, **nagbabago ang MAC pero hindi ang IP**.',
      ],
      test: {
        question: 'Sa 00:1A:2B:3C:4D:5E, ano ang OUI? At ano ang tawag sa FF:FF:FF:FF:FF:FF?',
        answer: 'OUI = 00:1A:2B (Owner, unang 3 bytes). FF:FF:FF:FF:FF:FF = broadcast (“Fiesta”, lahat imbitado).',
      },
    },
    { type: 'diagram', id: 'mac-anatomy', caption: 'A MAC address split into OUI and NIC-specific halves, with the two special bits in the first byte.' },
    {
      type: 'terms',
      items: [
        { term: 'MAC address', definition: 'A 48-bit Layer 2 address used to deliver frames on a local network.' },
        { term: 'Hexadecimal', definition: 'Base 16: digits 0–9 and A–F. One hex digit = 4 bits; two digits = 1 byte.' },
        { term: 'OUI', definition: 'The first 24 bits, identifying the manufacturer (assigned by the IEEE).' },
        { term: 'BIA', definition: 'Burned-in address: the MAC stored in the network card.' },
        { term: 'Unicast MAC', definition: 'Identifies one device; the first byte’s lowest bit is 0.' },
        { term: 'Multicast MAC', definition: 'Identifies a group; the first byte’s lowest bit is 1 (for example 01:00:5E:…).' },
        { term: 'Broadcast MAC', definition: 'FF:FF:FF:FF:FF:FF — all devices in the broadcast domain.' },
        { term: 'Locally administered', definition: 'A MAC set by software rather than assigned by the manufacturer (second-lowest bit of the first byte = 1).' },
      ],
    },
    {
      type: 'callout',
      kind: 'tip',
      text: 'Hex in ten seconds: A=10, B=11, C=12, D=13, E=14, F=15. Each hex digit is four bits, so 0x1A = 0001 1010 and 0xFF = 1111 1111 = 255. You will use the same skill for IPv6.',
    },
    { type: 'interactive', id: 'mac-decoder', caption: 'Paste any MAC address in any format and see it decoded.' },
    {
      type: 'flow',
      title: 'MAC vs IP on the way from PC-A to a remote server',
      steps: [
        'PC-A builds a packet: source IP = PC-A, destination IP = the server. These stay the same end to end (unless NAT rewrites them).',
        'The server is on another network, so PC-A puts the default gateway’s MAC address in the frame’s destination MAC field. (ARP, covered later, is how it learns that MAC.)',
        'The router removes the Layer 2 header, looks at the destination IP, and builds a NEW frame for the next hop with new source and destination MACs.',
        'At each router hop the MAC addresses change; the IP addresses do not.',
        'On the final network the frame carries the server’s MAC as its destination.',
      ],
    },
    {
      type: 'cli',
      title: 'Finding MAC addresses',
      transcript: `C:\\> ipconfig /all
Ethernet adapter Ethernet:
   Physical Address. . . . . . . . . : 00-1A-2B-3C-4D-5E
   IPv4 Address. . . . . . . . . . . : 192.168.1.23

C:\\> arp -a
  Internet Address      Physical Address      Type
  192.168.1.1           00-11-22-33-44-55     dynamic

R1# show interfaces gigabitEthernet 0/0
GigabitEthernet0/0 is up, line protocol is up
  Hardware is Gigabit Ethernet, address is 0000.0c12.3456 (bia 0000.0c12.3456)`,
      copyable: 'ipconfig /all\narp -a\nshow interfaces gigabitEthernet 0/0',
      explain: [
        { line: 'ipconfig /all → Physical Address', why: 'Windows calls the MAC address the “Physical Address”, written with hyphens.' },
        { line: 'arp -a', why: 'Shows the MAC addresses your PC has learned for IP addresses on the local network — here the gateway.' },
        { line: 'address is 0000.0c12.3456', why: 'Cisco IOS shows three groups of four hex digits. Its 0000.0c prefix is a Cisco OUI; the rest of this example is made up.' },
        { line: '(bia …)', why: 'The burned-in address. It equals the active address unless someone has changed it.' },
      ],
      note: 'Illustrative output. Real addresses will differ.',
    },
    { type: 'callout', kind: 'trap', text: 'MAC addresses are used only within a single local network. When a packet crosses a router, the source and destination MAC addresses are replaced; the IP addresses normally stay the same. Confusing the two is the most common Layer 2/Layer 3 exam mistake.' },
    { type: 'callout', kind: 'trap', text: 'A MAC address is not a security identity. It can be changed (spoofed) in software, and modern phones randomise it per network.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Common mistakes',
      items: [
        'Counting the wrong length: 48 bits = 6 bytes = 12 hex digits.',
        'Forgetting Cisco’s dotted format has three groups of four digits, not six groups of two.',
        'Assuming the OUI is the whole first byte. It is the first three bytes.',
        'Mixing up Layer 2 broadcast (FF:FF:FF:FF:FF:FF) with the IPv4 broadcast (255.255.255.255).',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting scenario: a MAC that keeps moving',
      scenario: 'A cloned virtual machine and the original both use the same MAC address on the same VLAN. Users of both machines report random disconnects. The switch log fills with warnings.',
      evidence: `%SW_MATM-4-MACFLAP_NOTIF: Host 0050.5600.0001 in vlan 10 is flapping between port Fa0/1 and port Fa0/2`,
      question: 'What is the switch telling you, and what is the likely cause?',
      answer: 'The same MAC address is appearing as a source on two different ports, so the switch keeps updating its table back and forth. Duplicate MAC addresses on one VLAN — such as cloned VMs — cause exactly this.',
      fix: 'Give one machine a unique MAC (regenerate the VM’s adapter address), then clear the entries with “clear mac address-table dynamic” and confirm with “show mac address-table”.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge: decode by hand',
      prompt: 'For 02:1A:2B:3C:4D:5E, answer: (a) the OUI, (b) unicast or group, (c) universal or locally administered, (d) the Cisco-format spelling.',
      answer: '(a) 02:1A:2B. (b) Unicast — 0x02 = 0000 0010, the lowest bit is 0. (c) Locally administered — the second-lowest bit is 1. (d) 021a.2b3c.4d5e.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Remember: 48 bits, 12 hex digits, first 24 bits = OUI.',
        'Broadcast MAC: FF:FF:FF:FF:FF:FF. IPv4 multicast MACs start 01:00:5E.',
        'MACs change hop by hop; IPs stay end to end.',
      ],
    },
    {
      type: 'summary',
      points: [
        'A MAC address is 48 bits written as 12 hex digits.',
        'The OUI (first 24 bits) identifies the manufacturer.',
        'The lowest bit of the first byte marks unicast (0) vs group (1).',
        'Broadcast is all Fs; multicast has the group bit set.',
        'MAC addresses are local; IP addresses are end to end.',
        'Next: how a switch builds its MAC address table by learning these addresses.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'How many bits are in a MAC address?',
    choices: ['32', '48', '64', '128'], correct: [1],
    explanation: 'A MAC address is 48 bits: 6 bytes, or 12 hexadecimal digits.',
    wrong: { 0: '32 bits is an IPv4 address.', 2: '64 bits is the size of an EUI-64 identifier.', 3: '128 bits is an IPv6 address.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'In the MAC address 00:1A:2B:3C:4D:5E, which part is the OUI?',
    choices: ['00:1A:2B', '3C:4D:5E', '00:1A', '4D:5E'], correct: [0],
    explanation: 'The OUI is the first 24 bits, which is the first three bytes.',
    wrong: { 1: 'That is the manufacturer-assigned NIC portion.', 2: 'The OUI is three bytes, not two.', 3: 'These are the last two bytes of the NIC portion.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'Which value is the Layer 2 broadcast address?',
    choices: ['FF:FF:FF:FF:FF:FF', '255.255.255.255', '00:00:00:00:00:00', '01:00:5E:FF:FF:FF'], correct: [0],
    explanation: 'All 48 bits set to 1 is the Ethernet broadcast address.',
    wrong: { 1: 'This is the IPv4 broadcast address (Layer 3).', 2: 'All zeros is not a broadcast.', 3: 'This is an IPv4 multicast MAC pattern.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'medium', type: 'single',
    prompt: 'Which is the Cisco IOS format for the MAC address 00-1A-2B-3C-4D-5E?',
    choices: ['00:1A:2B:3C:4D:5E', '001a.2b3c.4d5e', '00-1a-2b-3c-4d-5e', '001A2B.3C4D5E'], correct: [1],
    explanation: 'Cisco IOS groups the 12 hex digits into three groups of four separated by dots, in lower case.',
    wrong: { 0: 'Colon format is common on Linux and macOS.', 2: 'Hyphen format is common on Windows.', 3: 'Wrong grouping; Cisco uses 4-4-4.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'medium', type: 'single',
    prompt: 'Which of these is NOT a valid MAC address?',
    choices: ['00:1A:2B:3C:4D:5E', '001a.2b3c.4d5e', '00-1A-2B-3C-4D-5G', 'FF:FF:FF:FF:FF:FF'], correct: [2],
    explanation: 'Hexadecimal only uses 0–9 and A–F. “G” is not a hex digit.',
    wrong: { 0: 'Valid colon-format address.', 1: 'Valid Cisco format.', 3: 'Valid — the broadcast address.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'hard', type: 'single',
    prompt: 'The address 01:00:5E:00:00:05 is which kind of MAC address?',
    choices: ['Unicast', 'Broadcast', 'Multicast', 'Locally administered unicast'], correct: [2],
    explanation: 'The first byte 0x01 = 0000 0001, so the group bit is 1 and it is not all Fs: it is multicast (the IPv4 multicast range).',
    wrong: { 0: 'The group bit is set, so it is not unicast.', 1: 'Only FF:FF:FF:FF:FF:FF is broadcast.', 3: 'The second-lowest bit is 0, and the group bit is set anyway.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: when a packet crosses a router, the source and destination MAC addresses are replaced but the IP addresses normally stay the same.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'The router builds a new Layer 2 frame for each hop; the Layer 3 addresses stay end to end (unless NAT changes them).',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'How many bits does one hexadecimal digit represent?',
    choices: ['2', '4', '8', '16'], correct: [1],
    explanation: 'One hex digit is a nibble (4 bits); two hex digits make a byte.',
    wrong: { 0: 'Two bits would give only 4 values.', 2: 'Eight bits is two hex digits.', 3: '16 is the number of values, not bits.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'medium', type: 'single',
    prompt: 'Which organisation assigns OUIs to manufacturers?',
    choices: ['IANA', 'The IEEE', 'ICANN', 'Each ISP'], correct: [1],
    explanation: 'The IEEE Registration Authority assigns OUIs.',
    wrong: { 0: 'IANA manages IP address blocks and protocol numbers.', 2: 'ICANN manages domain names.', 3: 'ISPs do not assign OUIs.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: paano tandaan ang MAC address?', back: 'MAC = pangalan (sumusunod sa’yo); IP = tirahan (nagbabago). O-N: Owner (OUI, unang 24 bits) + Number (huling 24 bits). Puro F = Fiesta = broadcast. Sa router hop, nagbabago ang MAC, hindi ang IP.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'How long is a MAC address?', back: '48 bits = 6 bytes = 12 hex digits.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What is the OUI?', back: 'The first 24 bits of a MAC address; it identifies the manufacturer and is assigned by the IEEE.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Layer 2 broadcast address?', back: 'FF:FF:FF:FF:FF:FF (Cisco: ffff.ffff.ffff).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'concept', front: 'How do you tell unicast from multicast in a MAC?', back: 'The lowest bit of the first byte: 0 = unicast, 1 = group (multicast/broadcast).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Cisco MAC address format?', back: 'Three groups of four hex digits, e.g. 001a.2b3c.4d5e.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'concept', front: 'IPv4 and IPv6 multicast MAC prefixes?', back: '01:00:5E (IPv4) and 33:33 (IPv6).' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Do MAC or IP addresses change at each routed hop?', back: 'MAC addresses change each hop; IP addresses normally stay end to end.' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'concept', front: 'How many bits in one hex digit?', back: '4 bits (a nibble). Two hex digits = 1 byte.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Match the addresses to the frames',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Find MAC addresses on hosts and a router, then match them to the source and destination fields you see in Simulation mode.',
  topology: 'PC1 ─── SW1 ─── R1 ─── SW2 ─── PC2',
  addressing: [
    { device: 'PC1', interface: 'FastEthernet0', address: '192.168.1.11/24', note: 'Gateway 192.168.1.1' },
    { device: 'R1', interface: 'Gi0/0', address: '192.168.1.1/24' },
    { device: 'R1', interface: 'Gi0/1', address: '192.168.2.1/24' },
    { device: 'PC2', interface: 'FastEthernet0', address: '192.168.2.11/24', note: 'Gateway 192.168.2.1' },
  ],
  steps: [
    'Build the topology. On R1, configure both interfaces with the addresses above and run “no shutdown” on each.',
    'On PC1 open Command Prompt and run “ipconfig /all”. Record its MAC (Physical Address). Do the same on PC2.',
    'On R1 run “show interfaces gigabitEthernet 0/0” and “show interfaces gigabitEthernet 0/1”. Record both MAC addresses.',
    'From PC1, ping 192.168.2.11 until it succeeds (the first attempt may time out while ARP completes).',
    'Switch to Simulation mode and send one ICMP PDU from PC1 to PC2. Step through and open the Outbound PDU Details at PC1, then at R1, then at PC2.',
    'At each place write the Ethernet source and destination MAC and the IP source and destination.',
    'Complete a table with three rows: PC1 → R1, R1 → PC2, and note which fields changed.',
  ],
  checklist: [
    'You recorded all four MAC addresses',
    'PC1’s frame destination MAC is R1 Gi0/0, not PC2',
    'R1’s outgoing frame has R1 Gi0/1 as source and PC2 as destination',
    'The IP addresses are identical in both frames',
  ],
  hints: [
    'If the ping never succeeds, check that both router interfaces are up/up and that each PC’s default gateway is set.',
    'Simulation mode filters can hide ARP; leave ARP and ICMP visible.',
  ],
  solution: [
    'Frame 1 (PC1 → R1): src MAC = PC1, dst MAC = R1 Gi0/0; src IP = 192.168.1.11, dst IP = 192.168.2.11.',
    'Frame 2 (R1 → PC2): src MAC = R1 Gi0/1, dst MAC = PC2; the IP addresses are unchanged.',
    'Only the Layer 2 fields changed — exactly what the exam expects you to know.',
  ],
  breakIt: 'Delete PC1’s default gateway and ping PC2 again. Note what PC1 does differently (it will not send the packet toward R1) and what the failure looks like.',
};
