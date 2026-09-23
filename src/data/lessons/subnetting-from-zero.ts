import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'subnetting-from-zero';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.11',
  domain: 'D1',
  title: 'Subnetting From Zero',
  description: 'Why we split networks, the block-size method that finds any network and broadcast address in seconds, and why it works.',
  whyMatters:
    'Subnetting ang pinakamahalagang kasanayan sa Network Fundamentals. Kapag kaya mo itong gawin sa isip o sa papel nang mabilis, halos lahat ng IP question — routing, VLANs, ACLs, NAT — ay gumagaan.',
  objectives: [
    'Explain why networks are divided into subnets',
    'Find the interesting octet and the block size for any prefix',
    'Find the network, broadcast, first and last host of any address',
    'Calculate how many subnets and hosts you get by borrowing bits',
    'Explain why the block-size shortcut works',
    'Spot a host whose gateway is outside its own subnet',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['subnetting', 'block size', 'magic number', 'interesting octet', 'borrowing bits', 'CIDR', 'network address', 'broadcast address'],
  examObjectives: ['1.6'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Subnetting means cutting one big block of addresses into smaller, equal blocks. Each block is its own network. The prefix (like /26) tells you how big each block is.',
        'The trick that makes it fast: every block has the same size, and blocks always start at multiples of that size. So to find where an address lives, you just count in steps.',
      ],
      taglish: [
        'Ang subnetting ay paghahati ng isang malaking bloke ng addresses sa mas maliliit at **pantay-pantay** na bloke. Bawat bloke ay isang sariling network. Ang prefix (halimbawa /26) ang nagsasabi kung gaano kalaki ang bawat bloke.',
        'Bakit natin ito ginagawa? Para (1) hindi nagkakagulo ang broadcast ng lahat ng device, (2) mas madaling i-secure at i-manage ang mga grupo (Sales, HR, Guest), at (3) hindi masayang ang mga IP address.',
        'Ang sikreto para bumilis: **laging pantay ang laki ng bloke**, at **laging nagsisimula sa multiple ng laki nito**. Kapag alam mo ang laki (block size), parang nagbibilang ka lang ng hakbang sa hagdan para malaman kung saan bumagsak ang address mo.',
      ],
      technical: [
        'Subnetting borrows host bits to create extra network bits. Borrowing s bits from a network creates 2^s subnets, and each subnet keeps h = 32 − prefix host bits, giving 2^h − 2 usable hosts. Subnets exist to limit broadcast domains, group devices for policy and security, and use address space efficiently.',
        'Block-size method: (1) find the “interesting” octet — the first octet whose mask value is not 255 (or 0); (2) block size = 256 − the mask value in that octet; (3) the network address is the largest multiple of the block size that is less than or equal to the address’s value in that octet, with all later octets 0; (4) the next network starts one block later, so the broadcast address is that next network minus 1; (5) usable hosts lie between the network and broadcast addresses.',
        'Why it works: if k host bits sit in the interesting octet, the mask value there is 256 − 2^k, so 256 − mask = 2^k. That is exactly the number of addresses one subnet spans in that octet, and binary counting guarantees subnets start at multiples of 2^k.',
      ],
    },
    {
      type: 'analogy',
      title: 'Hinating pizza',
      body: [
        'A network is a pizza. Subnetting is cutting it into equal slices. Each slice is the same size, and slices are always a power of two: 2, 4, 8, 16, 32… To find which slice a topping (an IP address) sits on, count slices from the start.',
      ],
      taglish: [
        'Ang network ay isang buong pizza. Ang subnetting ay paghiwa nito sa pantay-pantay na slice. Laging power of two ang bilang ng slice: 2, 4, 8, 16, 32… Para malaman kung anong slice ang kinaroroonan ng paborito mong topping (ang IP address mo), bilangin mo lang ang mga slice mula sa simula.',
      ],
    },
    {
      type: 'hook',
      title: 'Hakbang — Tayo — Bago',
      trick: '**256 − mask = HAKBANG.** Tumayo sa hakbang na kinabagsakan ng IP mo = **network**. **Isang hakbang bago ang susunod** = **broadcast**.',
      taglish: [
        'Isipin ang 0–255 na parang hagdan. **HAKBANG** = ang laki ng bawat baitang = 256 minus ang mask. Halimbawa, /26 → mask 192 → 256 − 192 = **64**. Ang hagdan: 0, 64, 128, 192.',
        '**TAYO**: kung ang IP mo ay .130, saan ka nakatayo? Sa baitang na **128** (dahil nasa pagitan ka ng 128 at 192). Ang 128 ang **network**.',
        '**BAGO**: ang susunod na baitang ay 192, kaya ang isang hakbang **bago** nito — 191 — ang **broadcast**. Ang mga host ay nasa gitna: .129 hanggang .190.',
        'Tatlong salita lang: **HAKBANG → TAYO → BAGO**.',
      ],
      test: {
        question: 'Gamitin ang Hakbang–Tayo–Bago: para sa 10.0.0.77/28, ano ang network, broadcast at hosts?',
        answer: '/28 → mask 240 → hakbang = 256 − 240 = 16 (0, 16, 32, 48, 64, 80…). Tayo: 77 ay nasa pagitan ng 64 at 80 → network 10.0.0.64. Bago: 80 − 1 = 79 → broadcast 10.0.0.79. Hosts: .65 hanggang .78 (14 hosts).',
      },
    },
    { type: 'diagram', id: 'subnet-blocks', caption: 'Ang /26 sa huling octet: apat na bloke na tig-64. Ang .130 ay nasa block na nagsisimula sa .128.' },
    {
      type: 'terms',
      items: [
        { term: 'Subnet', definition: 'A smaller network created by dividing a larger one.' },
        { term: 'Borrowing bits', definition: 'Turning host bits into network bits. Each borrowed bit doubles the number of subnets.' },
        { term: 'Interesting octet', definition: 'The octet where the mask is neither 255 nor 0 — where the network/host boundary falls.' },
        { term: 'Block size (magic number)', definition: '256 − the mask value in the interesting octet: how many addresses one subnet spans there.' },
        { term: 'Network address', definition: 'The first address of the block (all host bits 0).' },
        { term: 'Broadcast address', definition: 'The last address of the block (all host bits 1).' },
        { term: 'CIDR', definition: 'Classless notation with a prefix length, like /26.' },
        { term: 'Default gateway rule', definition: 'A host’s gateway must be inside the host’s own subnet.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ang 5 hakbang na paraan (block-size method)',
      steps: [
        '**Mask**: isulat ang mask ng prefix (halimbawa /26 = 255.255.255.192).',
        '**Interesting octet**: hanapin ang unang octet na hindi 255 (dito, ang ikaapat; mask value 192).',
        '**Hakbang**: block size = 256 − 192 = 64. Ang mga network sa octet na iyon ay 0, 64, 128, 192.',
        '**Tayo**: para sa 192.168.1.130, ang 130 ay nasa pagitan ng 128 at 192 → network 192.168.1.128.',
        '**Bago**: susunod na network 192 → broadcast 192.168.1.191. Hosts: .129 hanggang .190 (62 hosts = 2^6 − 2).',
      ],
    },
    {
      type: 'flow',
      title: 'Dalawa pang halimbawa (kapag ang boundary ay nasa gitnang octet)',
      steps: [
        '**10.45.200.7/21** → mask 255.255.248.0. Interesting octet = ikatlo, mask 248. Hakbang = 256 − 248 = 8. Ang 200 = 25 × 8 → network 10.45.200.0. Susunod na network = 10.45.208.0 → broadcast **10.45.207.255**. Hosts: 10.45.200.1 – 10.45.207.254 (2^11 − 2 = 2046).',
        '**172.16.100.50/18** → mask 255.255.192.0. Ikatlong octet, hakbang = 64. Ang 100 ay nasa pagitan ng 64 at 128 → network **172.16.64.0**, broadcast **172.16.127.255**. Hosts: 172.16.64.1 – 172.16.127.254 (2^14 − 2 = 16,382).',
        'Pansinin: kapag nasa ikatlong octet ang boundary, ang **ikaapat na octet ay 0 sa network at 255 sa broadcast**.',
      ],
    },
    { type: 'interactive', id: 'subnet-lister', caption: 'Hatiin ang isang network at makita ang lahat ng subnets, ranges at broadcast — para makita mo ang “hagdan”.' },
    {
      type: 'list',
      variant: 'remember',
      title: 'Talaan ng borrowed bits (mula sa /24)',
      items: [
        'Humiram ng 1 bit → /25 → 2 subnets → 126 hosts bawat isa → hakbang 128',
        'Humiram ng 2 bits → /26 → 4 subnets → 62 hosts → hakbang 64',
        'Humiram ng 3 bits → /27 → 8 subnets → 30 hosts → hakbang 32',
        'Humiram ng 4 bits → /28 → 16 subnets → 14 hosts → hakbang 16',
        'Humiram ng 5 bits → /29 → 32 subnets → 6 hosts → hakbang 8',
        'Humiram ng 6 bits → /30 → 64 subnets → 2 hosts → hakbang 4',
        'Pattern: bawat hiram na bit, **doble ang subnets** at **kalahati ang hosts**.',
      ],
    },
    { type: 'callout', kind: 'tip', text: 'Gamitin ang Subnetting trainer araw-araw ng 10 minuto. Ang goal: makasagot ng network at broadcast sa loob ng 10–15 segundo. Speed ay galing sa repetition, hindi sa talino.' },
    { type: 'callout', kind: 'trap', text: 'Ang HOST ay hindi kailanman nasa network address o broadcast address. At kapag ang hakbang ay nasa ikatlong octet, huwag kalimutang: broadcast = ikaapat na octet na 255, network = ikaapat na octet na 0.' },
    { type: 'callout', kind: 'relax', text: 'Huwag mong kabisaduhin ang binary sa bawat problema. Sa block-size method, hindi mo kailangan mag-binary — kailangan mo lang ng mask at ng pagbabawas mula 256.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Using the wrong octet as “interesting”. Check where the mask stops being 255.',
        'Using the mask value as the block size instead of 256 − mask.',
        'Counting the network or broadcast address as a usable host.',
        'Forgetting that the next octets are 0 (network) and 255 (broadcast) when the boundary is in the 2nd or 3rd octet.',
        'Setting a gateway outside the host’s subnet.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: “Hindi maka-labas ang PC”',
      scenario: 'A Sales PC is configured with an address and gateway. It can ping other Sales PCs but nothing outside.',
      evidence: `PC:  192.168.1.130   mask 255.255.255.192   gateway 192.168.1.1
Router interface facing Sales: 192.168.1.1 255.255.255.192`,
      question: 'Ano ang mali sa configuration?',
      answer: 'With /26, .130 belongs to the block 192.168.1.128/26 (hosts .129–.190), but the gateway .1 belongs to a different block, 192.168.1.0/26. A host can only reach its gateway directly if the gateway is in the same subnet, so the PC cannot send traffic to the router.',
      fix: 'Give the router interface an address inside 192.168.1.128/26 (for example 192.168.1.129) and set the PCs’ gateway to that address. Verify with ping 192.168.1.129 from the PC.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Para sa 172.16.100.50/18: (a) mask, (b) block size at interesting octet, (c) network, (d) broadcast, (e) usable hosts. Sunod, gamitin ang subnet lister para i-check ang 192.168.10.0/24 na hinati sa /27: ilan ang subnets at hosts bawat isa?',
      answer: '(a) 255.255.192.0. (b) Ikatlong octet; hakbang = 64. (c) 172.16.64.0. (d) 172.16.127.255. (e) 2^14 − 2 = 16,382. Para sa /27 sa isang /24: 3 bits ang hiniram → 8 subnets, tig-30 hosts.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Subnets = 2^(borrowed bits). Hosts = 2^(host bits) − 2.',
        'Block size = 256 − mask octet. Networks start at multiples of it.',
        'Always sanity-check: network < your host < broadcast.',
        'Gateway must be in the same subnet as the host.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Subnetting divides a network into equal power-of-two blocks.',
        'Block size = 256 − mask octet, in the interesting octet.',
        'Network = the step you stand on; broadcast = one before the next step.',
        'Borrowing n bits gives 2^n subnets; each has 2^h − 2 hosts.',
        'The gateway must live inside the host’s subnet.',
        'Susunod: VLSM — paghahati ng network sa magkakaibang laki.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'What is the block size of a /27 in the last octet?',
    choices: ['16', '32', '64', '224'], correct: [1],
    explanation: '/27 → mask 224 → 256 − 224 = 32.',
    wrong: { 0: '16 is the block size of a /28.', 2: '64 is the block size of a /26.', 3: '224 is the mask value, not the block size.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'What is the network address of 192.168.1.130/26?',
    choices: ['192.168.1.0', '192.168.1.64', '192.168.1.128', '192.168.1.192'], correct: [2],
    explanation: 'Block size 64: the steps are 0, 64, 128, 192. 130 stands on the 128 step.',
    wrong: { 0: '0–63 is the first block.', 1: '64–127 is the second block.', 3: '192 is the next network after the block containing .130.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'What is the broadcast address of 192.168.1.130/26?',
    choices: ['192.168.1.129', '192.168.1.190', '192.168.1.191', '192.168.1.255'], correct: [2],
    explanation: 'The next network is .192, so the broadcast is one before it: .191.',
    wrong: { 0: '.129 is the first host.', 1: '.190 is the last usable host.', 3: '.255 would be the broadcast for a /24.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'You borrow 3 bits from a /24. How many subnets do you get?',
    choices: ['3', '6', '8', '16'], correct: [2],
    explanation: 'Subnets = 2^borrowed bits = 2^3 = 8 (a /27 for each).',
    wrong: { 0: 'The number of subnets is a power of two, not the number of bits.', 1: 'Not a power of two.', 3: '16 subnets would need 4 borrowed bits.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'How many usable hosts are in each subnet after borrowing 3 bits from a /24?',
    choices: ['14', '30', '32', '62'], correct: [1],
    explanation: '/27 leaves 5 host bits: 2^5 − 2 = 30.',
    wrong: { 0: '14 is for a /28.', 2: '32 is the total addresses, not usable.', 3: '62 is for a /26.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'Which is a valid host address in 172.16.32.0/20?',
    choices: ['172.16.32.0', '172.16.40.10', '172.16.47.255', '172.16.48.1'], correct: [1],
    explanation: '/20 → third-octet block size 16, so this subnet is 172.16.32.0–172.16.47.255. .32.0 is the network, .47.255 is the broadcast, and .48.1 is in the next subnet.',
    wrong: { 0: 'That is the network address.', 2: 'That is the broadcast address.', 3: 'That lies in the next subnet, 172.16.48.0/20.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'hard', type: 'single',
    prompt: 'A PC is 192.168.1.130/26 with default gateway 192.168.1.1. It can reach local hosts but nothing else. Why?',
    choices: ['The mask is wrong', 'The gateway is not in the PC’s subnet', 'The PC needs a public address', 'A /26 cannot have a gateway'], correct: [1],
    explanation: '.130 is in 192.168.1.128/26 but the gateway .1 is in 192.168.1.0/26. A host can only reach a gateway inside its own subnet.',
    wrong: { 0: '255.255.255.192 is a valid /26 mask.', 2: 'Private addresses work with NAT.', 3: 'Any subnet can have a gateway.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO statements about block size are true?',
    choices: ['Block size = 256 − the mask value in the interesting octet', 'Subnets start at multiples of the block size', 'Block size equals the number of host bits', 'A longer prefix always means a bigger block'], correct: [0, 1],
    explanation: 'Block size is 256 minus the interesting mask octet, and subnets begin at multiples of it. A longer prefix means a smaller block.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'hard', type: 'single',
    prompt: 'What is the network address of 10.45.200.7/21?',
    choices: ['10.45.192.0', '10.45.200.0', '10.45.200.7', '10.45.208.0'], correct: [1],
    explanation: '/21 → third-octet mask 248 → block size 8. 200 = 25 × 8, so the network is 10.45.200.0 (broadcast 10.45.207.255).',
    wrong: { 0: '192 is a multiple of 8 but not the one that fits 200.', 2: 'That is the host address.', 3: '208 is the next network.' },
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'Are 192.168.5.62/26 and 192.168.5.65/26 in the same subnet?',
    choices: ['Yes — same first three octets', 'No — 62 is in 0–63 and 65 is in 64–127', 'Yes — both are private', 'Only if they share a gateway'], correct: [1],
    explanation: 'The /26 blocks are 0–63, 64–127… .62 and .65 sit in different blocks.',
    wrong: { 0: 'Matching octets is not the test; the prefix is.', 2: 'Being private does not group them.', 3: 'The gateway does not define the subnet.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Pro tip: paano hanapin ang network at broadcast nang mabilis?', back: 'HAKBANG–TAYO–BAGO. Hakbang = 256 − mask. Tayo sa hakbang na kinabagsakan ng IP = network. Isang hakbang bago ang susunod = broadcast.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Block size formula?', back: '256 − the mask value in the interesting octet.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'What is the interesting octet?', back: 'The first octet whose mask is not 255 (where the network/host boundary falls).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'How do you find the broadcast address?', back: 'Next network address − 1 (all host bits set to 1).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Subnets after borrowing n bits?', back: '2^n subnets.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Usable hosts per subnet?', back: '2^h − 2 (h = host bits).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Block sizes for /25 through /30?', back: '128, 64, 32, 16, 8, 4.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Where must a host’s default gateway be?', back: 'Inside the host’s own subnet.' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Why subnet?', back: 'Smaller broadcast domains, easier policy/security grouping, and efficient use of addresses.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Subnetting by hand: 10 problems',
  tool: 'Paper',
  minutes: 40,
  objective: 'Use Hakbang–Tayo–Bago to solve ten problems on paper, then check every answer with the calculator and score at least 15/20 in the trainer.',
  steps: [
    'For each problem write the mask, the block size and the interesting octet before you calculate anything.',
    '1) Network, broadcast and hosts of 192.168.1.77/26.',
    '2) Network, broadcast and hosts of 10.1.1.200/27.',
    '3) Network, broadcast and hosts of 172.20.5.9/29.',
    '4) Network, broadcast and hosts of 192.168.10.100/28.',
    '5) Network, broadcast and usable hosts of 10.20.130.5/17.',
    '6) Network, broadcast and usable hosts of 172.16.75.20/19.',
    '7) Network, broadcast and hosts of 192.168.4.200/30.',
    '8) Network, broadcast and usable hosts of 10.0.77.1/22.',
    '9) Same subnet? 192.168.5.62/26 and 192.168.5.65/26.',
    '10) Same subnet? 10.5.9.200/21 and 10.5.14.3/21.',
    'Check each answer in the Subnetting → Calculator tab, then play Level 2 and Level 3 in the trainer until you reach 15 correct out of 20.',
  ],
  checklist: [
    'All ten problems attempted on paper before using the calculator',
    'You wrote the block size for each problem',
    'You corrected every mistake and understood why',
    'Trainer: at least 15 of 20 correct',
  ],
  hints: [
    'Write the steps (0, 64, 128, 192…) down the side of the page and circle where you land.',
    'If the boundary is in the third octet, the fourth octet is 0 in the network and 255 in the broadcast.',
  ],
  solution: [
    '1) 192.168.1.64 / .127 / .65–.126. 2) 10.1.1.192 / .223 / .193–.222. 3) 172.20.5.8 / .15 / .9–.14. 4) 192.168.10.96 / .111 / .97–.110.',
    '5) 10.20.128.0 / 10.20.255.255 / 32,766 hosts. 6) 172.16.64.0 / 172.16.95.255 / 8,190 hosts. 7) 192.168.4.200 / .203 / .201–.202. 8) 10.0.76.0 / 10.0.79.255 / 1,022 hosts.',
    '9) No: .62 is in 0–63 and .65 is in 64–127. 10) Yes: with a /21 the third-octet block is 8, and both 9 and 14 fall in 8–15 (network 10.5.8.0).',
  ],
  breakIt: 'Give a PC 192.168.1.130/26 with gateway 192.168.1.1 in Packet Tracer and try to ping outside. Then fix the gateway so it is inside the PC’s subnet.',
};
