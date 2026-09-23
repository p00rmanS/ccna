import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ipv4-fundamentals';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.10',
  domain: 'D1',
  title: 'IPv4 Fundamentals',
  description: 'Address structure, subnet masks and prefix lengths, network and broadcast addresses, private and special ranges, and configuring an interface.',
  whyMatters:
    'IPv4 addressing and subnetting run through the whole exam and every real network you will touch. Routing, VLANs, NAT and ACLs all assume you can look at an address and mask and know which network it belongs to.',
  objectives: [
    'Describe the structure of an IPv4 address and subnet mask',
    'Convert between a mask and a prefix length',
    'Find the network, broadcast, first and last host addresses',
    'Recognise private, loopback, APIPA and multicast ranges',
    'Explain how a host decides between local and remote delivery',
    'Configure and verify an IPv4 address on a Cisco interface',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['IPv4', 'subnet mask', 'prefix', 'CIDR', 'network address', 'broadcast', 'private IP', 'RFC 1918', 'APIPA', 'loopback', 'default gateway'],
  examObjectives: ['1.6', '1.7', '1.10'],
  sections: [
    {
      type: 'explain',
      simple: [
        'An IPv4 address is a number that identifies a device on a network, written as four numbers separated by dots, like 192.168.1.50. It works like a home address: part says which street (the network), part says which house (the host).',
        'A second number, the subnet mask (or the shorter /24 form), tells devices exactly where the street ends and the house number begins.',
      ],
      taglish: [
        'Ang IP address ay parang address ng bahay mo sa Makati. May dalawang bahagi: ang “kalye” (network) at ang “numero ng bahay” (host).',
        'Sa 192.168.1.50 na may /24, ang 192.168.1 ang kalye at ang 50 ang bahay. Ang subnet mask ang nagsasabi kung hanggang saan ang kalye. Kung magpapadala ka sa address na nasa ibang kalye, hindi mo direktang ihahatid — ibibigay mo muna sa gate ng subdivision, ang default gateway (router).',
      ],
      technical: [
        'An IPv4 address is 32 bits, written as four 8-bit octets in dotted-decimal. A subnet mask is also 32 bits: contiguous 1s mark the network portion and 0s mark the host portion. The prefix length (CIDR notation) counts the 1s, so 255.255.255.0 is /24.',
        'Within any subnet: the network address has all host bits 0; the broadcast address has all host bits 1; the addresses in between are usable hosts. With h host bits there are 2^h addresses and 2^h − 2 usable hosts (network and broadcast excluded).',
        'A host ANDs its own address and the destination with its mask. If the network portions match, the destination is local and the host delivers directly (it needs the destination’s MAC address). If not, the host sends the frame to its default gateway.',
        'Special ranges: private (RFC 1918) 10.0.0.0/8, 172.16.0.0/12 (172.16–172.31) and 192.168.0.0/16; loopback 127.0.0.0/8; link-local/APIPA 169.254.0.0/16; multicast 224.0.0.0/4. The historical classes were A (1–126, /8), B (128–191, /16), C (192–223, /24); modern networks are classless.',
      ],
    },
    {
      type: 'analogy',
      title: 'A subdivision address',
      taglish: ['Sa isang village, ang unang “address” ay ang pangalan ng village mismo (network) at ang huli ay ang megaphone ng barangay hall (broadcast) — walang nakatira doon. Ang prefix ay patakaran kung saan hinihiwalay ang pangalan ng village sa numero ng bahay. Kapag magkapareho ang village, pwedeng maglakad; kapag magkaiba, dadaan sa gate — ang default gateway.'],
      body: [
        'An address like “Block 5, Lot 12, Sampaguita Village” has a part that identifies the neighbourhood (block and village) and a part that identifies the house (lot). The prefix length is a rule that says where one ends and the other begins — for example “the first 24 bits name the village, the last 8 bits name the house”.',
        'Two houses in the same village can walk to each other. A house in another village must go through the village gate — the default gateway.',
      ],
    },
    {
      type: 'hook',
      title: 'Dalawang bawal tumira',
      trick: '**2^h − 2**: dalawang **bawal tumira** — ang **Network** (unang address, “pangalan ng barangay”) at ang **Broadcast** (huling address, “megaphone”).',
      taglish: [
        'Sa bawat subnet, **dalawang address ang hindi pwedeng ibigay sa host**: ang **una** (Network address — pangalan ng barangay) at ang **huli** (Broadcast — megaphone para sa lahat). Kaya ang formula ay **2^h − 2**.',
        'Halimbawa /24: 8 host bits → 256 addresses − 2 = **254**. Ang **/24 ay hindi “24 addresses”** — ang 24 ay bilang ng **network bits**.',
        'Private ranges: **10.x.x.x**, **172.16 hanggang 172.31**, at **192.168.x.x**. At ang **169.254.x.x** ay ang bulong ng PC na “**hindi ako nakakuha ng DHCP**”.',
      ],
      test: {
        question: 'Ilan ang usable hosts sa /26, at anong mga address ang bawal tumira sa 192.168.1.64/26?',
        answer: '/26 → 6 host bits → 2^6 − 2 = 62 hosts. Bawal tumira: 192.168.1.64 (network) at 192.168.1.127 (broadcast).',
      },
    },
    { type: 'diagram', id: 'ipv4-structure', caption: 'A 32-bit IPv4 address, its four octets, and how the prefix length divides network bits from host bits.' },
    { type: 'interactive', id: 'ipv4-split', caption: 'Type any address and prefix and see the network/host split, network, broadcast and host range.' },
    {
      type: 'terms',
      items: [
        { term: 'IPv4 address', definition: '32 bits, written as four dotted-decimal octets.' },
        { term: 'Subnet mask', definition: '32-bit value with 1s for the network portion and 0s for the host portion.' },
        { term: 'Prefix length (CIDR)', definition: 'The number of 1 bits in the mask, written /24 etc.' },
        { term: 'Network address', definition: 'The first address of a subnet — all host bits 0. Identifies the subnet; not assignable to a host.' },
        { term: 'Broadcast address', definition: 'The last address — all host bits 1. Reaches every host in the subnet; not assignable.' },
        { term: 'Usable hosts', definition: '2^h − 2, where h is the number of host bits.' },
        { term: 'Default gateway', definition: 'The router address a host uses to reach other networks.' },
        { term: 'Private address', definition: 'RFC 1918 addresses not routed on the public internet.' },
        { term: 'Loopback', definition: '127.0.0.0/8; 127.0.0.1 means “this device”.' },
        { term: 'APIPA', definition: '169.254.0.0/16: an address a host gives itself when DHCP fails.' },
      ],
    },
    {
      type: 'list',
      variant: 'remember',
      title: 'Common prefixes',
      items: [
        '/24 = 255.255.255.0 → 256 addresses, 254 usable',
        '/25 = 255.255.255.128 → 128, 126 usable',
        '/26 = 255.255.255.192 → 64, 62 usable',
        '/27 = 255.255.255.224 → 32, 30 usable',
        '/28 = 255.255.255.240 → 16, 14 usable',
        '/29 = 255.255.255.248 → 8, 6 usable',
        '/30 = 255.255.255.252 → 4, 2 usable',
        'Each additional prefix bit halves the subnet size; each bit removed doubles it.',
      ],
    },
    {
      type: 'flow',
      title: 'Local or remote? PC1 (192.168.1.50/24) sends to 192.168.2.100',
      steps: [
        'PC1 ANDs its own address with its mask: 192.168.1.50 AND 255.255.255.0 = 192.168.1.0.',
        'PC1 ANDs the destination with the same mask: 192.168.2.100 AND 255.255.255.0 = 192.168.2.0.',
        'The network portions differ, so the destination is remote.',
        'PC1 sends the frame to its default gateway — it uses the gateway’s MAC as the frame destination, while the packet keeps 192.168.2.100 as the destination IP.',
        'The router looks up 192.168.2.0/24 in its routing table and forwards the packet out the right interface.',
      ],
    },
    {
      type: 'flow',
      title: 'Worked example: 192.168.50.130/25',
      steps: [
        '/25 = 25 network bits, 7 host bits. Mask 255.255.255.128.',
        'The boundary is in the last octet. Block size = 256 − 128 = 128, so subnets start at 0 and 128.',
        '130 falls in the block 128–255. Network = 192.168.50.128.',
        'Broadcast = network + block size − 1 = 192.168.50.255.',
        'Usable hosts = 192.168.50.129 to 192.168.50.254, which is 2^7 − 2 = 126 hosts.',
      ],
    },
    {
      type: 'cli',
      title: 'Configuring and verifying IPv4 on a router interface',
      transcript: `R1> enable
R1# configure terminal
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# end
R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.1.1     YES manual up                    up
GigabitEthernet0/1     unassigned      YES unset  administratively down down
R1# copy running-config startup-config`,
      copyable: 'enable\nconfigure terminal\ninterface gigabitEthernet 0/0\nip address 192.168.1.1 255.255.255.0\nno shutdown\nend\nshow ip interface brief\ncopy running-config startup-config',
      explain: [
        { line: 'enable', why: 'Moves from user EXEC (Router>) to privileged EXEC (Router#).' },
        { line: 'configure terminal', why: 'Enters global configuration mode, where you can change the device.' },
        { line: 'interface gigabitEthernet 0/0', why: 'Selects the interface to configure; the prompt changes to (config-if).' },
        { line: 'ip address 192.168.1.1 255.255.255.0', why: 'Assigns the IPv4 address and mask. IOS wants the dotted-decimal mask here, not /24.' },
        { line: 'no shutdown', why: 'Turns the interface on. Router interfaces start administratively down.' },
        { line: 'end', why: 'Returns straight to privileged EXEC (Ctrl+Z does the same).' },
        { line: 'show ip interface brief', why: 'Verifies the address and that Status/Protocol are up/up.' },
        { line: 'copy running-config startup-config', why: 'Saves the configuration. Without this, a reload loses your changes.' },
      ],
      note: 'The interface must also be connected to a live device to reach up/up. A switch connected to a powered-on device is enough in a lab.',
    },
    {
      type: 'verify',
      title: 'Verification checklist',
      items: [
        { command: 'show ip interface brief', shows: 'Address and up/up state for every interface.' },
        { command: 'show interfaces gigabitEthernet 0/0', shows: '“Internet address is 192.168.1.1/24” plus MTU, duplex and error counters.' },
        { command: 'show running-config interface gigabitEthernet 0/0', shows: 'Exactly what you configured on that interface.' },
        { command: 'ping 192.168.1.10', shows: 'Whether a device on that network answers.' },
        { command: 'ipconfig (on a PC)', shows: 'The PC’s own address, mask and default gateway.' },
      ],
      good: 'Status up, Protocol up, the address you expect, and pings that succeed.',
      bad: 'administratively down (missing no shutdown), down/down (no link), up/down (a Layer 2 problem), or “unassigned” (no address configured).',
    },
    { type: 'callout', kind: 'trap', text: '/24 does not mean “24 addresses”. It means 24 network bits. That leaves 8 host bits: 256 addresses, of which 254 are usable.' },
    { type: 'callout', kind: 'trap', text: 'The private range 172.16.0.0/12 covers only 172.16.0.0 – 172.31.255.255. 172.32.x.x is public. And a 169.254.x.x address means the host failed to get one from DHCP — not that the network is healthy.' },
    { type: 'callout', kind: 'trap', text: 'A host sends remote traffic to its default gateway’s MAC address, not the destination’s. The destination IP stays the same; only the frame’s MAC destination is the gateway.' },
    { type: 'callout', kind: 'relax', text: 'Classful ranges (A, B, C) are history. CCNA works with classless prefixes. Know the ranges and default masks only as background.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Common mistakes',
      items: [
        'Configuring an address and forgetting “no shutdown” — the interface stays administratively down.',
        'Assigning the network or broadcast address to a host.',
        'Typing “ip address 192.168.1.1/24” — IOS expects the dotted-decimal mask for IPv4.',
        'Setting a default gateway that is outside the host’s own subnet.',
        'Forgetting to save with “copy running-config startup-config”.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting scenario: PC cannot reach its gateway',
      scenario: 'PC1 is 192.168.10.25/24 with gateway 192.168.10.1. The router interface has been given ip address 192.168.10.1 255.255.255.0, but PC1 cannot ping 192.168.10.1.',
      evidence: `R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.10.1    YES manual administratively down down`,
      question: 'What is wrong and how do you fix it?',
      answer: 'The address is correct, but the interface is administratively down because “no shutdown” was never entered. Nothing on that interface — including the gateway address — is reachable.',
      fix: 'On R1: interface gigabitEthernet 0/0, then no shutdown. Verify up/up with show ip interface brief, then ping 192.168.10.1 from PC1.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge: work it out on paper',
      prompt: 'For 172.16.35.77/20 find the mask, network address, broadcast address and the number of usable hosts. Then decide whether 172.16.47.200 is on the same subnet.',
      answer: 'Mask 255.255.240.0. Block size in the third octet = 256 − 240 = 16; 35 is in the block 32–47, so network 172.16.32.0 and broadcast 172.16.47.255. Host bits = 12, usable = 2^12 − 2 = 4094. 172.16.47.200 is inside 172.16.32.0–172.16.47.255, so yes, it is on the same subnet.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Usable hosts = 2^h − 2. Know it by heart.',
        'Memorise the three RFC 1918 ranges exactly, including that 172.16.0.0/12 stops at 172.31.',
        'Loopback is 127.0.0.0/8; APIPA is 169.254.0.0/16; multicast is 224.0.0.0/4.',
        'Verify with show ip interface brief and ping — always verify after you configure.',
        'Drill it: the Subnetting trainer generates unlimited problems with worked answers.',
      ],
    },
    {
      type: 'summary',
      points: [
        'An IPv4 address is 32 bits; the mask or prefix decides the network/host split.',
        'Network = all host bits 0; broadcast = all host bits 1; usable = 2^h − 2.',
        'Hosts send remote traffic to their default gateway.',
        'Know the private, loopback, APIPA and multicast ranges.',
        'Configure with ip address + no shutdown, verify with show ip interface brief and ping, then save.',
        'Next: practise subnetting until the calculation feels automatic.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'How many bits are in an IPv4 address?',
    choices: ['16', '32', '48', '128'], correct: [1],
    explanation: 'IPv4 addresses are 32 bits, written as four 8-bit octets.',
    wrong: { 0: '16 bits is too small.', 2: '48 bits is a MAC address.', 3: '128 bits is IPv6.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.7', difficulty: 'easy', type: 'single',
    prompt: 'Which of these is a private (RFC 1918) IPv4 address?',
    choices: ['8.8.8.8', '172.32.5.5', '192.168.50.5', '169.254.10.10'], correct: [2],
    explanation: '192.168.0.0/16 is private. 172.32.x.x is outside 172.16.0.0/12, 8.8.8.8 is public, and 169.254.x.x is link-local (APIPA).',
    wrong: { 0: '8.8.8.8 is a public address.', 1: 'The private 172 range ends at 172.31.255.255.', 3: 'APIPA is link-local, not RFC 1918.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.10', difficulty: 'easy', type: 'single',
    prompt: 'A PC shows the address 169.254.12.7. What does this most likely mean?',
    choices: ['It has a static address', 'It failed to obtain an address from DHCP', 'It is on the internet directly', 'It is configured as a router'], correct: [1],
    explanation: '169.254.0.0/16 is APIPA: a host assigns itself an address when it cannot reach a DHCP server.',
    wrong: { 0: 'A static address would be chosen by an administrator.', 2: 'APIPA addresses are not routable.', 3: 'Nothing about the address suggests routing.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'What is the network address of 192.168.50.130/25?',
    choices: ['192.168.50.0', '192.168.50.128', '192.168.50.255', '192.168.50.130'], correct: [1],
    explanation: '/25 splits the last octet into blocks of 128. 130 lies in the block 128–255, so the network address is 192.168.50.128.',
    wrong: { 0: 'That is the network for the lower /25 (hosts 0–127).', 2: 'That is the broadcast address.', 3: 'That is the host address itself, not the network.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'How many usable host addresses are in 10.0.0.0/22?',
    choices: ['254', '510', '1022', '1024'], correct: [2],
    explanation: '/22 leaves 10 host bits: 2^10 = 1024 addresses. Subtract network and broadcast: 1022 usable.',
    wrong: { 0: '254 is for a /24.', 1: '510 is for a /23.', 3: '1024 is the total, not the usable count.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'What is the subnet mask for a /27 prefix?',
    choices: ['255.255.255.192', '255.255.255.224', '255.255.255.240', '255.255.255.248'], correct: [1],
    explanation: '/27 = 24 + 3 bits in the last octet: 11100000 = 224.',
    wrong: { 0: '/26 is 192.', 2: '/28 is 240.', 3: '/29 is 248.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'What is the broadcast address of 192.168.1.100/26?',
    choices: ['192.168.1.63', '192.168.1.127', '192.168.1.128', '192.168.1.255'], correct: [1],
    explanation: '/26 gives blocks of 64. 100 is in 64–127, so the network is .64 and the broadcast is .127.',
    wrong: { 0: '.63 is the broadcast of the previous block.', 2: '.128 is the next network address.', 3: '.255 would be the broadcast of a /24.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'Are 10.1.1.200/25 and 10.1.1.100/25 in the same subnet?',
    choices: ['Yes — same first three octets', 'No — 100 is in 0–127 and 200 is in 128–255', 'Yes — both are private', 'Only if the gateway is the same'], correct: [1],
    explanation: 'A /25 splits the last octet at 128. The two addresses fall in different halves, so they are different subnets.',
    wrong: { 0: 'Matching octets is not enough; the prefix decides.', 2: 'Being private does not put them in the same subnet.', 3: 'The gateway does not define the subnet.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are valid host addresses in the subnet 192.168.10.64/26?',
    choices: ['192.168.10.64', '192.168.10.65', '192.168.10.126', '192.168.10.127'], correct: [1, 2],
    explanation: '.64 is the network address and .127 is the broadcast address. .65 to .126 are usable.',
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'Which command assigns an IPv4 address to a router interface?',
    choices: ['address 192.168.1.1', 'ip address 192.168.1.1 255.255.255.0', 'ip 192.168.1.1/24', 'set ip 192.168.1.1'], correct: [1],
    explanation: 'In interface configuration mode: ip address <address> <mask>.',
    wrong: { 0: 'Not valid IOS syntax.', 2: 'IOS does not accept a prefix for the IPv4 ip address command.', 3: 'Not valid IOS syntax.' },
  },
  {
    id: `${ID}-q11`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'PC1 is 192.168.1.10/24 and wants to reach 192.168.2.10. Which Layer 2 destination address does PC1 use in its first frame?',
    choices: ['The MAC address of 192.168.2.10', 'The MAC address of its default gateway', 'The broadcast address FFFF.FFFF.FFFF only', 'The MAC of the switch'], correct: [1],
    explanation: 'The destination is remote, so PC1 addresses the frame to its default gateway. The packet keeps 192.168.2.10 as its destination IP.',
    wrong: { 0: 'PC1 cannot ARP for a device on another network.', 2: 'It may broadcast an ARP to find the gateway, but the data frame goes to the gateway’s MAC.', 3: 'Switches are not addressed as frame destinations for transit traffic.' },
  },
  {
    id: `${ID}-q12`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: a /24 network has only 24 usable host addresses.',
    choices: ['True', 'False'], correct: [1],
    explanation: '/24 leaves 8 host bits: 256 addresses, 254 usable. The 24 is the count of network bits.',
  },
  {
    id: `${ID}-q13`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'An interface shows “administratively down / down” in show ip interface brief. What should you do first?',
    choices: ['Replace the cable', 'Enter “no shutdown” on the interface', 'Change the IP address', 'Reload the router'], correct: [1],
    explanation: '“Administratively down” means someone entered shutdown (or it is a router default). “no shutdown” brings it up.',
    wrong: { 0: 'A cable fault would show down/down, not administratively down.', 2: 'The address is not the problem.', 3: 'A reload is unnecessary and may lose unsaved changes.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: paano tandaan ang usable hosts at private ranges?', back: '2^h − 2 = dalawang bawal tumira (Network = una, Broadcast = huli). Private: 10.x, 172.16–31.x, 192.168.x. 169.254.x.x = hindi nakakuha ng DHCP. /24 ay 24 network bits, hindi 24 addresses.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'What does /24 mean?', back: '24 network bits and 8 host bits: 256 addresses, 254 usable.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Formula for usable hosts?', back: '2^h − 2 (h = number of host bits).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'The three private IPv4 ranges?', back: '10.0.0.0/8, 172.16.0.0/12 (172.16–172.31), 192.168.0.0/16.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'What is 169.254.0.0/16?', back: 'APIPA / link-local: a host that could not get a DHCP address.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Loopback range?', back: '127.0.0.0/8 (127.0.0.1 = this device).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Network address vs broadcast address?', back: 'Network: all host bits 0. Broadcast: all host bits 1. Neither is assignable to a host.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'ipv4', front: '/25, /26, /27, /28, /29, /30 masks?', back: '128, 192, 224, 240, 248, 252 in the last octet.' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'command', front: 'Command to assign an IPv4 address to an interface?', back: 'ip address <address> <mask> (interface configuration mode), then no shutdown.' },
  { id: `${ID}-f9`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Who does a host send remote traffic to?', back: 'Its default gateway (the frame’s destination MAC is the gateway; the IP destination is unchanged).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Configure IPv4 on a router and test',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Assign IPv4 addresses to a router interface and two PCs, verify the configuration, and prove connectivity.',
  topology: `PC1 ──┐
     ├── SW1 ── R1 (Gi0/0)
PC2 ──┘`,
  addressing: [
    { device: 'R1', interface: 'Gi0/0', address: '192.168.10.1/24' },
    { device: 'PC1', interface: 'FastEthernet0', address: '192.168.10.11/24', note: 'Gateway 192.168.10.1' },
    { device: 'PC2', interface: 'FastEthernet0', address: '192.168.10.12/24', note: 'Gateway 192.168.10.1' },
  ],
  steps: [
    'Build the topology with copper straight-through cables: PC1 and PC2 to SW1, and SW1 to R1 GigabitEthernet0/0.',
    'On PC1 and PC2 open Desktop → IP Configuration and enter the address, mask 255.255.255.0 and default gateway from the table.',
    'On R1 open the CLI: enable, configure terminal, interface gigabitEthernet 0/0, ip address 192.168.10.1 255.255.255.0, no shutdown, end.',
    'Run “show ip interface brief” and confirm Gi0/0 is up/up with the right address. Wait for the link lights on the switch to go green.',
    'From PC1 ping 192.168.10.1 (the router), then 192.168.10.12 (PC2).',
    'Save with “copy running-config startup-config”.',
    'For each address in the table, write its network address and broadcast address, and mark the valid host range.',
  ],
  checklist: [
    'Gi0/0 shows up/up with 192.168.10.1',
    'PC1 can ping the router',
    'PC1 can ping PC2',
    'Configuration is saved',
    'You wrote the network address (192.168.10.0) and broadcast address (192.168.10.255)',
  ],
  hints: [
    'Link lights stay red until the router interface is enabled with no shutdown.',
    'If PC1 cannot ping PC2 but can ping the router, recheck PC2’s mask and address.',
    'The first ping in Packet Tracer often times out while ARP completes; try again.',
  ],
  solution: [
    'R1: interface gigabitEthernet 0/0 / ip address 192.168.10.1 255.255.255.0 / no shutdown.',
    'Network address 192.168.10.0, broadcast 192.168.10.255, usable hosts .1 – .254 (254 hosts).',
    'Successful pings prove the addresses, masks and links are consistent.',
  ],
  breakIt: 'On R1 enter “shutdown” under Gi0/0 and ping again. Then change PC2’s mask to 255.255.255.128 and its address to 192.168.10.200 and observe the effect on PC1 → PC2. Fix both problems and verify.',
};
