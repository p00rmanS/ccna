import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ipv6-fundamentals';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.14',
  domain: 'D1',
  title: 'IPv6 Fundamentals',
  description: 'Why IPv6 exists, how a 128-bit address is written, and the two rules for shortening it.',
  whyMatters:
    'Naubusan na ng IPv4 addresses, at lahat ng modernong network ay gumagamit na ng IPv6. Sa CCNA, tinatanong ka kung paano basahin, paikliin at palawakin ang IPv6 address — mga simpleng patakaran lang, pero madaling magkamali kapag hindi mo alam.',
  objectives: [
    'Explain why IPv6 was created',
    'Write and read a 128-bit IPv6 address in hexadecimal',
    'Shorten an address using the two compression rules',
    'Expand a compressed address back to full form',
    'Explain the /64 prefix and the interface ID',
    'Compare IPv4 and IPv6',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['IPv6', '128-bit', 'hexadecimal', 'compression', '::', 'prefix', '/64', 'interface ID', 'NDP'],
  examObjectives: ['1.8', '1.10'],
  sections: [
    {
      type: 'explain',
      simple: [
        'IPv4 has about 4.3 billion addresses, and they have run out. IPv6 is the replacement. An IPv6 address is 128 bits long, which gives an almost unlimited number of addresses.',
        'Because it is so long, it is written in hexadecimal as eight groups separated by colons. Two shortening rules make it easier to write.',
      ],
      taglish: [
        'Ang IPv4 ay may mga 4.3 bilyong address lang, at **naubos na**. Ang solusyon ay **IPv6**: 128 bits ang haba, kaya halos hindi na mauubos (mga 3.4 × 10^38).',
        'Dahil mahaba, isinusulat ito sa hexadecimal: **8 kahon (groups)** na may **4 hex digits** bawat isa, pinaghihiwalay ng colon. Halimbawa: `2001:0db8:0000:0000:0000:ff00:0042:8329`.',
        'Para hindi nakakapagod isulat, may **dalawang patakaran sa pag-ikli**: (1) alisin ang mga zero sa **harap** ng bawat kahon, (2) palitan ng `::` ang **isang** pinakamahabang tuloy-tuloy na kahong puro zero. Kaya ang halimbawa sa itaas ay nagiging `2001:db8::ff00:42:8329`.',
        'Kadalasan, ang IPv6 network ay `/64`: ang unang 64 bits ay para sa **network**, at ang huling 64 bits ay para sa **interface ID** (ang host).',
      ],
      technical: [
        'IPv6 addresses are 128 bits, written as eight 16-bit groups of up to four hexadecimal digits separated by colons. IPv6 provides about 3.4 × 10^38 addresses, restores end-to-end addressing (NAT is not required for address conservation), has no broadcast (multicast is used instead), uses a fixed 40-byte header, and replaces ARP with the Neighbor Discovery Protocol (NDP, which runs over ICMPv6).',
        'Compression rules: (1) leading zeros in any group may be omitted (0db8 → db8, 0000 → 0); trailing zeros may not. (2) One contiguous run of two or more all-zero groups may be replaced by “::” — only once per address, and by convention the longest run (the first if tied) and never a single 0 group. To expand, count the groups that are present; “::” stands for 8 minus that many all-zero groups.',
        'Prefix notation is address/prefix-length. Most LANs use /64: the first 64 bits are the network prefix (a routing prefix plus a subnet ID) and the last 64 bits are the interface ID. Sites usually receive a /48 or /56 from their provider. 2001:db8::/32 is reserved for documentation and lab examples.',
      ],
    },
    {
      type: 'analogy',
      title: 'Plaka ng sasakyan',
      body: [
        'Imagine a licence-plate system that ran out of combinations. Instead of adding one letter, the country invents a new format so long that it will never run out again. IPv6 is that new format — and the shortening rules are like reading “ABC-0001” as “ABC-1”.',
      ],
      taglish: [
        'Isipin mo na naubos na ang lahat ng kombinasyon ng plaka ng sasakyan. Sa halip na dagdagan ng isang letra, gumawa ang gobyerno ng **bagong format na sobrang haba** para hindi na maubos kailanman. Ganyan ang IPv6. At ang pag-ikli ay parang pagbasa ng “ABC-0001” bilang “ABC-1”.',
      ],
    },
    {
      type: 'hook',
      title: 'HARAP at ISA',
      trick: '**HARAP** = tanggalin ang zeros sa harap ng kahon. **ISA** = isang `::` lang bawat address.',
      taglish: [
        '**HARAP**: sa bawat kahon, ang mga zero sa **harap** lang ang pwedeng alisin. `0db8` → `db8`, `0000` → `0`, `0042` → `42`. Pero ang zero sa **hulihan** ay hindi pwedeng galawin: `db80` ay hindi `db8`!',
        '**ISA**: gamitin ang `::` nang **isang beses lang**, at sa pinakamahabang tuloy-tuloy na zero. Kung dalawa ang `::`, hindi mo na alam kung ilang zero ang nawala sa bawat isa.',
        'Pagpapalawak: bilangin ang mga kahong nakikita mo. **8 − nakikita = ilang kahong 0 ang nasa `::`**. Halimbawa `fe80::1` → 2 kahon ang nakikita, kaya 6 na zero ang nasa `::`.',
      ],
      test: {
        question: 'Paikliin: `2001:0db8:0000:0000:0000:0000:0000:0001`. At palawakin: `fe80::a:b:c`.',
        answer: '`2001:db8::1`. At `fe80::a:b:c` → apat ang nakikita (fe80, a, b, c), kaya 4 na zero ang nasa `::` → `fe80:0000:0000:0000:0000:000a:000b:000c`.',
      },
    },
    { type: 'diagram', id: 'ipv6-structure', caption: '8 kahon × 16 bits = 128 bits. Ang unang 64 bits ay ang network prefix at ang huling 64 ay ang interface ID.' },
    { type: 'interactive', id: 'ipv6-compress', caption: 'Subukan ang kahit anong IPv6 address at makita ang buo at pinaikling anyo.' },
    {
      type: 'terms',
      items: [
        { term: 'IPv6 address', definition: '128 bits written as eight hexadecimal groups separated by colons.' },
        { term: 'Group (hextet)', definition: 'One 16-bit block of an IPv6 address: up to four hex digits.' },
        { term: '::', definition: 'Stands for one contiguous run of all-zero groups. Usable once per address.' },
        { term: 'Prefix length', definition: 'How many leading bits identify the network, e.g. /64.' },
        { term: 'Interface ID', definition: 'The last 64 bits in a /64: identifies the host on the link.' },
        { term: 'NDP', definition: 'Neighbor Discovery Protocol (ICMPv6): the IPv6 replacement for ARP.' },
        { term: 'Documentation prefix', definition: '2001:db8::/32 — reserved for examples and labs.' },
        { term: 'Dual stack', definition: 'Running IPv4 and IPv6 at the same time.' },
      ],
    },
    {
      type: 'flow',
      title: 'Paano paikliin ang isang address (hakbang-hakbang)',
      steps: [
        'Simulan sa buo: `2001:0db8:0000:0000:0000:ff00:0042:8329`.',
        '**Harap**: alisin ang leading zeros sa bawat kahon → `2001:db8:0:0:0:ff00:42:8329`.',
        'Hanapin ang pinakamahabang tuloy-tuloy na kahong `0`: ang tatlong `0:0:0` sa gitna.',
        '**Isa**: palitan ng `::` → `2001:db8::ff00:42:8329`.',
        'Kung may dalawang pantay na haba ng zero run, unahin ang **una**. Kung iisang `0` lang, huwag palitan ng `::`.',
      ],
    },
    {
      type: 'list',
      variant: 'remember',
      title: 'IPv4 vs IPv6 — pagkukumpara',
      items: [
        'Address size: 32 bits (IPv4) vs 128 bits (IPv6).',
        'Written as: dotted decimal vs colon-separated hexadecimal.',
        'Broadcast: IPv4 has it; IPv6 uses multicast instead.',
        'Address resolution: ARP (IPv4) vs NDP over ICMPv6 (IPv6).',
        'Header: IPv4 20–60 bytes (variable); IPv6 fixed 40 bytes.',
        'Configuration: IPv4 mask (255.255.255.0) vs IPv6 prefix length (/64).',
      ],
    },
    {
      type: 'cli',
      title: 'Nakikita ang IPv6 sa sarili mong PC',
      transcript: `C:\\> ipconfig
Ethernet adapter Ethernet:
   IPv6 Address. . . . . . . . . . . : 2001:db8:acad:1::23
   Link-local IPv6 Address . . . . . : fe80::21a:2bff:fe3c:4d5e%12
   IPv4 Address. . . . . . . . . . . : 192.168.1.23
   Default Gateway . . . . . . . . . : fe80::1%12
                                       192.168.1.1`,
      copyable: 'ipconfig',
      explain: [
        { line: 'IPv6 Address 2001:db8:acad:1::23', why: 'A global address (starts with 2). The “::” hides a run of zero groups.' },
        { line: 'Link-local IPv6 Address fe80::…%12', why: 'Automatic address that works only on the local link. The %12 is the local interface number (zone ID), not part of the address.' },
        { line: 'Default Gateway fe80::1%12', why: 'IPv6 gateways are often the router’s link-local address.' },
        { line: 'IPv4 and IPv6 together', why: 'This PC is running dual stack.' },
      ],
      note: 'Sample output only. On Linux use “ip -6 addr”; on macOS use “ifconfig”.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang `::` ay pwede lang **isang beses**. At ang zero sa **hulihan** ng isang kahon ay hindi pwedeng tanggalin: `2001:db80::1` ay hindi `2001:db8::1`. Ito ang dalawang pinaka-madalas na exam trap.' },
    { type: 'callout', kind: 'trap', text: 'Ang isang solong `0` na kahon ay karaniwang hindi pinapalitan ng `::` (RFC 5952). Ang standard na ikli ng `2001:0db8:0000:0001:0001:0001:0001:0001` ay `2001:db8:0:1:1:1:1:1`. Tinatanggap ng mga device ang `2001:db8::1:1:1:1:1`, pero hindi iyon ang standard na pagsulat.' },
    { type: 'callout', kind: 'relax', text: 'Huwag matakot sa hex. Ang kailangan mo lang ay 0–9 at A–F. Ang isang hex digit ay 4 bits — pareho sa natutunan mo sa MAC address.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Using “::” twice in one address.',
        'Removing trailing zeros in a group (db80 → db8).',
        'Miscounting the hidden zero groups when expanding.',
        'Thinking IPv6 still has a broadcast address.',
        'Treating the %12 zone ID as part of the address.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: “Invalid input” sa IPv6 address',
      scenario: 'An engineer wants to configure 2001:db8:0:0:1:0:0:1/64 and types a shortened form, but IOS rejects it.',
      evidence: `R1(config-if)# ipv6 address 2001:db8::1::1/64
                                ^
% Invalid input detected at '^' marker.`,
      question: 'Ano ang mali sa pinaikling address?',
      answer: 'The address contains “::” twice. IOS cannot tell how many zero groups each “::” stands for, so it is invalid.',
      fix: 'Use one “::” for the longest zero run (first one on a tie): 2001:db8::1:0:0:1/64. Then check with show ipv6 interface brief.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Paikliin: (a) 2001:0db8:00a0:0000:0000:0000:0000:0001, (b) fe80:0000:0000:0000:0202:b3ff:fe1e:8329. Palawakin: (c) 2001:db8::a:1, (d) ::1.',
      answer: '(a) 2001:db8:a0::1. (b) fe80::202:b3ff:fe1e:8329. (c) 2001:0db8:0000:0000:0000:0000:000a:0001. (d) 0000:0000:0000:0000:0000:0000:0000:0001.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        '128 bits = 8 groups × 16 bits. Each group is up to 4 hex digits.',
        'Leading zeros may be dropped; “::” may be used once.',
        'A /64 splits the address 64 bits network + 64 bits interface ID.',
        'IPv6 has no broadcast and uses NDP instead of ARP.',
      ],
    },
    {
      type: 'summary',
      points: [
        'IPv6 was created because IPv4 ran out; it is 128 bits.',
        'Written as 8 hex groups; shorten with HARAP (leading zeros) and ISA (one ::).',
        'A LAN uses a /64: 64 bits of network, 64 bits of interface ID.',
        'IPv6 uses multicast (no broadcast) and NDP (no ARP).',
        'Susunod: ang iba’t ibang uri ng IPv6 address.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'easy', type: 'single',
    prompt: 'How many bits are in an IPv6 address?',
    choices: ['32', '64', '128', '256'], correct: [2],
    explanation: 'IPv6 addresses are 128 bits, written as eight 16-bit groups.',
    wrong: { 0: '32 bits is IPv4.', 1: '64 bits is the interface ID half of a /64.', 3: 'Too large.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'easy', type: 'single',
    prompt: 'Which is the shortened form of 2001:0db8:0000:0000:0000:ff00:0042:8329?',
    choices: ['2001:db8::ff00:42:8329', '2001:db8:ff00:42:8329', '2001:db8::ff::8329', '2001:db80::ff00:42:8329'], correct: [0],
    explanation: 'Drop the leading zeros, then replace the run of three zero groups with a single “::”.',
    wrong: { 1: 'It has only five groups and no “::”, so it is not equivalent.', 2: 'Two “::” are not allowed.', 3: 'db80 is not db8; trailing zeros must be kept.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'medium', type: 'single',
    prompt: 'Which of these is NOT a valid IPv6 address?',
    choices: ['2001:db8::1', 'fe80::1', '2001:db8::1::5', '::1'], correct: [2],
    explanation: '“::” may appear only once. With two, the number of zeros represented by each is ambiguous.',
    wrong: { 0: 'Valid.', 1: 'Valid link-local address.', 3: 'Valid loopback address.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'medium', type: 'single',
    prompt: 'How many all-zero groups does “::” represent in fe80::1?',
    choices: ['5', '6', '7', '8'], correct: [1],
    explanation: 'Two groups are visible (fe80 and 1), so the “::” stands for 8 − 2 = 6 zero groups.',
    wrong: { 0: 'Five hidden groups would mean three groups are visible, not two.', 2: 'Seven hidden groups would mean only one group is visible.', 3: '“::” on its own is all eight groups.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'easy', type: 'single',
    prompt: 'What prefix length do most IPv6 LANs use?',
    choices: ['/24', '/48', '/64', '/128'], correct: [2],
    explanation: 'A /64 leaves 64 bits for the interface ID.',
    wrong: { 0: 'That is a common IPv4 prefix.', 1: 'A /48 is a typical site allocation.', 3: 'A /128 is a single host address.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'medium', type: 'single',
    prompt: 'What replaces broadcast in IPv6?',
    choices: ['Unicast only', 'Multicast', 'Anycast only', 'Nothing — IPv6 needs no such function'], correct: [1],
    explanation: 'IPv6 has no broadcast. Functions that used broadcast use multicast groups.',
    wrong: { 0: 'Unicast cannot reach a group.', 2: 'Anycast reaches the nearest member, not all.', 3: 'The function is still needed.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'medium', type: 'single',
    prompt: 'Which protocol replaces ARP in IPv6?',
    choices: ['DHCPv6', 'NDP (Neighbor Discovery Protocol)', 'ICMPv4', 'RARP'], correct: [1],
    explanation: 'NDP, carried in ICMPv6 messages, resolves addresses on the link.',
    wrong: { 0: 'DHCPv6 assigns configuration.', 2: 'ICMPv4 belongs to IPv4.', 3: 'RARP is obsolete.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'hard', type: 'multiple',
    prompt: 'Which TWO rules apply when shortening an IPv6 address?',
    choices: ['Leading zeros in a group may be omitted', '“::” may be used only once', 'Trailing zeros in a group may be omitted', '“::” may replace any single 0 group'], correct: [0, 1],
    explanation: 'Only leading zeros can be dropped and “::” may appear once. Trailing zeros are significant and single 0 groups are not compressed by convention.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'medium', type: 'single',
    prompt: 'Expand 2001:db8::a:1 to full form.',
    choices: ['2001:0db8:0000:0000:0000:0000:000a:0001', '2001:0db8:0000:0000:0000:000a:0001:0000', '2001:0db8:a000:1000:0000:0000:0000:0000', '2001:db80:0000:0000:0000:0000:000a:0001'], correct: [0],
    explanation: 'Four groups are visible, so “::” hides four zero groups; the last groups are 000a and 0001.',
    wrong: { 1: 'The visible groups are out of order.', 2: 'Groups are being right-padded instead of left-padded.', 3: 'db8 becomes 0db8, not db80.' },
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: in an IPv6 /64 network, the last 64 bits are the interface ID.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'A /64 means the first 64 bits identify the network and the remaining 64 identify the interface.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: paano tandaan ang pag-ikli ng IPv6?', back: 'HARAP at ISA. Tanggalin ang zeros sa HARAP ng kahon (hindi sa hulihan). ISA lang ang :: — at sa pinakamahabang tuloy-tuloy na zero.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'How long is an IPv6 address?', back: '128 bits = 8 groups × 16 bits (4 hex digits each).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Two IPv6 compression rules?', back: '1) Drop leading zeros in each group. 2) Replace one longest run of all-zero groups with “::” (once only).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'concept', front: 'How do you count zeros hidden by “::”?', back: '8 minus the number of groups that are visible.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What is a typical IPv6 LAN prefix length?', back: '/64 — 64 bits network, 64 bits interface ID.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Does IPv6 have broadcast?', back: 'No. It uses multicast.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'protocol', front: 'What replaces ARP in IPv6?', back: 'NDP (Neighbor Discovery Protocol) over ICMPv6.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Which prefix is reserved for documentation examples?', back: '2001:db8::/32.' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'concept', front: 'IPv6 header size?', back: 'Fixed 40 bytes (IPv4 is 20–60 bytes, variable).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Read and write IPv6',
  tool: 'Your computer',
  minutes: 25,
  objective: 'Find the IPv6 addresses on your own computer and practise shortening and expanding addresses by hand.',
  steps: [
    'On Windows run ipconfig; on Linux run ip -6 addr; on macOS run ifconfig. Find any IPv6 addresses (many networks only show a link-local one).',
    'Write down the link-local address you find. Remove the %zone ID. Then write its full, expanded form.',
    'Paikliin: (1) 2001:0db8:0000:0000:0000:0000:0000:0001 (2) fe80:0000:0000:0000:0202:b3ff:fe1e:8329 (3) 2001:0db8:00a0:0000:0000:0000:0000:0001 (4) 0000:0000:0000:0000:0000:0000:0000:0001 (5) 2001:0db8:0000:0001:0000:0000:0000:0001 (6) FF02:0000:0000:0000:0000:0000:0000:0005.',
    'Palawakin: (7) 2001:db8::a:1 (8) ::1 (9) fe80::1.',
    'Check every answer in the IPv6 compress/expand tool above and correct mistakes.',
    'For each address in the list, write how many bits of it are usually network and how many are interface ID in a /64 LAN.',
  ],
  checklist: [
    'Found and recorded at least one IPv6 address on your machine',
    'All six shortening exercises correct',
    'All three expansions correct',
    'Stated the 64/64 split',
  ],
  hints: [
    'Circle the longest run of zero groups before you replace it.',
    'When you expand, count visible groups first: 8 minus that number is how many zero groups “::” hides.',
  ],
  solution: [
    '(1) 2001:db8::1 (2) fe80::202:b3ff:fe1e:8329 (3) 2001:db8:a0::1 (4) ::1 (5) 2001:db8:0:1::1 (6) ff02::5.',
    '(7) 2001:0db8:0000:0000:0000:0000:000a:0001 (8) 0000:0000:0000:0000:0000:0000:0000:0001 (9) fe80:0000:0000:0000:0000:0000:0000:0001.',
    'A /64 LAN: 64 bits network prefix, 64 bits interface ID.',
  ],
  breakIt: 'Try writing 2001:db8::1::1 in the tool and read the error. Then explain to yourself, in Taglish, why two :: are ambiguous.',
};
