import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'subnetting-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.12',
  domain: 'D1',
  title: 'Subnetting Deep Dive: The Magic Number Method',
  description: 'Answer every exam-style subnetting question in under a minute: network, broadcast, range, same-subnet checks and choosing a mask.',
  whyMatters:
    'Subnetting ang pinakamalaking “time sink” sa CCNA exam. Kung mabagal ka rito, mauubos ang oras mo para sa ibang tanong. Sa lesson na ito, isang paraan lang ang gagamitin natin — ang magic number — at ilalapat natin sa limang uri ng tanong na lumalabas sa exam, hakbang-hakbang.',
  objectives: [
    'Find the network, broadcast and usable range of any host address',
    'Use the magic number (block size) in any octet',
    'Decide whether two hosts share a subnet',
    'Choose a mask for a required number of subnets or hosts',
    'Spot a gateway that sits outside the host’s subnet',
  ],
  estimatedMinutes: 45,
  difficulty: 'intermediate',
  keywords: ['subnetting', 'magic number', 'block size', 'network address', 'broadcast address', 'usable range', 'same subnet', 'CIDR', 'interesting octet'],
  examObjectives: ['1.6'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Every subnetting question is the same puzzle: find the block that your address falls into. Blocks are equal-sized slices of the address space, and the slice size is called the magic number.',
        'Once you know the block, the first address is the network, the last is the broadcast, and everything between them is usable.',
      ],
      taglish: [
        'Lahat ng subnetting na tanong ay **iisang puzzle**: saang “bloke” nahuhulog ang address? Ang mga bloke ay magkakapantay na hiwa ng address space, at ang laki ng hiwa ay ang **magic number**.',
        'Kapag alam mo na ang bloke: **unang address = network**, **huling address = broadcast**, at ang nasa pagitan ay **usable hosts**.',
        'Ang magic number ay **256 − (mask value sa “interesting octet”)**. Ang interesting octet ay ang octet na may mask na hindi 255 at hindi 0 — doon nangyayari ang lahat ng aksyon.',
      ],
      technical: [
        'The interesting octet is the first octet whose mask value is neither 255 nor 0. The block size (magic number) is 256 minus that mask value. Network addresses in that octet are multiples of the block size.',
        'To find the network: take the host’s value in the interesting octet, divide by the block size, drop the remainder and multiply back. Octets before the interesting octet are copied; octets after it become 0.',
        'The broadcast address is the next network minus one: in the interesting octet, network + block − 1; every later octet becomes 255. Usable hosts run from network + 1 to broadcast − 1.',
      ],
    },
    {
      type: 'analogy',
      title: 'Hagdan at palapag',
      body: [
        'Think of floors in a building where each floor has the same number of rooms. Given a room number, you find your floor by finding the biggest multiple of the floor size that does not exceed it. The first room on the floor is the network, the last is the broadcast.',
      ],
      taglish: [
        'Isipin ang gusali na may **pare-parehong dami ng kwarto** bawat palapag (ito ang magic number). Kung ang kwarto mo ay #77 at 32 kwarto bawat palapag, ang palapag mo ay nagsisimula sa **64** (64–95). Ang kwartong #64 ay ang **network**, ang #95 ay ang **broadcast**, at ang #65–#94 ay mga pwedeng tirahan.',
      ],
    },
    {
      type: 'hook',
      title: 'Hanapin ang palapag',
      trick: '**256 − MASK = MAGIC. Bilangin hanggang malampasan ka. Network = bago lumampas. Broadcast = susunod − 1.**',
      taglish: [
        '**256 − mask** = magic number. Halimbawa /27 → mask 224 → 256 − 224 = **32**.',
        '**Bilangin** ang multiples ng magic number (0, 32, 64, 96…) hanggang **malampasan** ka ng host value. Ang huling multiple na hindi lumampas ay ang **network**.',
        '**Broadcast = susunod na multiple − 1.** Ang usable range ay network + 1 hanggang broadcast − 1.',
        'Memory aid ng mask octets: **128, 192, 224, 240, 248, 252, 254, 255** → magic numbers na **128, 64, 32, 16, 8, 4, 2, 1**.',
      ],
      test: {
        question: 'Host 10.1.1.77/27: ano ang network at broadcast?',
        answer: '/27 → magic number 32. Multiples: 0, 32, 64, 96. Ang 77 ay nasa pagitan ng 64 at 96 → network 10.1.1.64, broadcast 10.1.1.95, usable .65–.94.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Hanapin ang interesting octet at magic number',
      paragraphs: [
        'Bago ang lahat, isulat ang mask sa dotted decimal. Para sa /21: 21 bits = 8 + 8 + 5, kaya ang mask ay 255.255.**248**.0. Ang 248 ang unang octet na hindi 255 at hindi 0, kaya ito ang interesting octet — ang **ikatlong octet**.',
        'Ang magic number ay 256 − 248 = **8**. Ibig sabihin, sa ikatlong octet, ang mga network ay nasa 0, 8, 16, 24, 32, 40, 48… Ang ikaapat na octet ay hindi na mahalaga sa pagpili ng network: ito ay nagiging 0 sa network address at 255 sa broadcast address.',
        'Shortcut para sa prefix: tingnan kung ilang bits ang “sobra” pagkatapos ng huling buong 8. /21 → 21 − 16 = 5 bits sa ikatlong octet → ang mask value ay 128+64+32+16+8 = 248.',
      ],
      steps: [
        'Isulat ang prefix, hal. /21.',
        'Hatiin sa walong-walo: 8 + 8 + 5 + 0. Ang octet na may bahagyang bits (5) ay ang interesting octet.',
        'Mask value = kabuuan ng pinakamalalaking bit values: 5 bits → 128+64+32+16+8 = 248.',
        'Magic number = 256 − 248 = 8.',
      ],
      tricks: [
        'Kung ang prefix ay multiple ng 8 (/8, /16, /24), walang interesting octet — ang network ay simpleng pagputol ng address.',
        'Mga prefix → magic number sa interesting octet: /25 128 · /26 64 · /27 32 · /28 16 · /29 8 · /30 4. Para sa /17 hanggang /23, pareho ang pattern pero sa ikatlong octet (/17 128, /18 64, /19 32, /20 16, /21 8, /22 4, /23 2).',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Network, broadcast at range (buong halimbawa)',
      paragraphs: [
        'Halimbawa: **172.16.45.200/21**. Alam na natin: interesting octet = ikatlo, magic number = 8.',
        'Hanapin ang network: sa ikatlong octet ang host value ay 45. Ang multiples ng 8 ay … 32, 40, 48. Ang 45 ay nasa pagitan ng 40 at 48, kaya ang network ay **172.16.40.0**. Tandaan: ang ikaapat na octet ay nagiging 0.',
        'Hanapin ang broadcast: ang susunod na network ay 172.16.48.0, kaya ang broadcast ay isang address bago iyon: **172.16.47.255**. Ang ikaapat na octet ay nagiging 255 at ang ikatlo ay 48 − 1 = 47.',
        'Usable range: **172.16.40.1 hanggang 172.16.47.254**. Bilang ng usable hosts: 2^11 − 2 = 2046 (11 host bits: 3 sa ikatlong octet at 8 sa ikaapat).',
      ],
      steps: [
        'Kopyahin ang mga octet bago ang interesting octet: 172.16.',
        'Sa interesting octet, hanapin ang pinakamalaking multiple ng magic number na ≤ host value: 45 → 40.',
        'Gawing 0 ang lahat ng octet pagkatapos: network = 172.16.40.0.',
        'Susunod na network = 40 + 8 = 48 → broadcast = 172.16.47.255 (ibawas ang 1, ang mga huling octet ay 255).',
        'Usable = network + 1 hanggang broadcast − 1.',
      ],
      tricks: [
        'Kapag ang interesting octet ay ang ikaapat (hal. /27), ang broadcast ay simple: susunod − 1 sa ikaapat na octet. Walang “carry” sa iba pang octet.',
        'Kapag ang susunod na network ay umabot sa 256 (hal. 192 + 64), ang broadcast ay 255 sa octet na iyon — huwag mag-isip ng 256.',
      ],
    },
    {
      type: 'remember',
      title: 'Subnetting: mabilis na sagot sa exam',
      items: [
        '**Magic number = 256 − mask value** sa interesting octet.',
        '**Network = pinakamalaking multiple ng magic number na ≤ host value.** **Broadcast = susunod na network − 1.**',
        '**Usable hosts = 2^h − 2**; **subnets = 2^s** (s = bits na hiniram).',
        '**Ang unang address ng bloke ay HINDI host; ang huli ay HINDI host.**',
        '**/30 = 2 hosts, /29 = 6, /28 = 14, /27 = 30, /26 = 62, /25 = 126, /24 = 254.**',
      ],
    },
    { type: 'interactive', id: 'subnet-lister', caption: 'Subukan ang sarili mo: ilagay ang address at prefix, hulaan muna ang network at broadcast, saka ikumpara.' },
    {
      type: 'deepdive',
      title: 'Hakbang 3: “Magkasama ba sila sa iisang subnet?”',
      paragraphs: [
        'Ito ay paboritong tanong ng exam at ng totoong troubleshooting. Dalawang host ay magkasama sa subnet kung **pareho ang kanilang network address** kapag ginamit ang iisang mask.',
        'Halimbawa: 192.168.10.62/26 at 192.168.10.66/26. Magic number = 64. Ang 62 ay nasa 0–63; ang 66 ay nasa 64–127. Magkaiba ang bloke, kaya **magkaibang subnet** — hindi sila magkakausap nang walang router kahit magkalapit ang numero.',
        'Ganoon din ang default gateway: dapat nasa **parehong subnet** ng host. Kung ang PC ay 192.168.1.200/25 (bloke 128–255) at ang gateway ay 192.168.1.1 (bloke 0–127), hindi maabot ng PC ang gateway — kaya hindi ito makalabas ng network.',
      ],
      tricks: [
        'Huwag ikumpara ang mga address nang paisa-isang bit; hanapin ang network ng pareho at tingnan kung pareho.',
        'Kapag isa lang ang ibinigay na mask, gamitin ito sa dalawa — iyon ang tanong ng exam. Kapag magkaiba ang mask ng dalawang host, may configuration error na.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 4: Pumili ng mask para sa kailangan mong subnet o host',
      paragraphs: [
        'Dalawang direksyon ang tanong: (a) “Kailangan ko ng X subnets” at (b) “Kailangan ko ng Y hosts bawat subnet.” Parehong gumagamit ng powers of two.',
        '(a) Subnets: hanapin ang pinakamaliit na s na 2^s ≥ X. Idagdag ang s sa orihinal na prefix. Halimbawa: 6 na subnet mula 192.168.1.0/24 → 2^3 = 8 ≥ 6 → /27.',
        '(b) Hosts: hanapin ang pinakamaliit na h na 2^h − 2 ≥ Y. Prefix = 32 − h. Halimbawa: 50 hosts → 2^6 − 2 = 62 ≥ 50 → h = 6 → /26.',
        'Kapag pareho ang kailangan (subnets AT hosts), tingnan kung kasya: s + h ≤ 32 − orihinal na prefix. Kung hindi, kailangan mo ng mas malaking address block.',
      ],
      steps: [
        'Isulat ang kailangan: bilang ng subnets o hosts.',
        'Bilugin pataas sa power of two (para sa hosts, idagdag muna ang 2).',
        'Bilangin ang bits: 8 → 3 bits, 64 → 6 bits, atbp.',
        'Subnets: bagong prefix = lumang prefix + s. Hosts: bagong prefix = 32 − h.',
        'I-check ang kabaligtaran: ilang hosts/subnets ang nakukuha mo? Dapat ≥ kailangan.',
      ],
      tricks: [
        'Kapag may salitang “at least”, ang sagot ay ang pinakamaliit na prefix na kasya. Kapag may salitang “maximum hosts”, ang sagot ay mas kaunting subnet bits.',
        'Para sa exam: kabisaduhin na 2^1…2^10 ay 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024.',
      ],
    },
    {
      type: 'terms',
      items: [
        { term: 'Magic number', definition: 'Block size in the interesting octet: 256 minus the mask value.' },
        { term: 'Interesting octet', definition: 'The octet whose mask value is neither 255 nor 0.' },
        { term: 'Network address', definition: 'First address of a block; host bits all 0; not assignable to a host.' },
        { term: 'Broadcast address', definition: 'Last address of a block; host bits all 1; not assignable to a host.' },
        { term: 'Usable range', definition: 'Every address from network + 1 to broadcast − 1.' },
        { term: 'Borrowed bits', definition: 'Host bits taken to make subnets; each one doubles the subnet count.' },
        { term: 'Same subnet', definition: 'Two addresses that give the same network address under the same mask.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ang 6-hakbang na proseso (gamitin sa bawat tanong)',
      steps: [
        'Isulat ang address at prefix. I-convert ang prefix sa mask kung kailangan.',
        'Hanapin ang interesting octet at ang magic number (256 − mask value).',
        'Kopyahin ang mga octet bago ang interesting octet.',
        'Sa interesting octet: bilangin ang multiples ng magic number hanggang malampasan ang host. Ang huling hindi lumampas = network.',
        'Susunod na multiple − 1 = broadcast (mga huling octet ay 255).',
        'Usable range = network + 1 hanggang broadcast − 1. I-check kung ang sagot ay tugma sa tanong (network? broadcast? range? bilang ng host?).',
      ],
    },
    {
      type: 'cli',
      title: 'Patunayan sa router',
      transcript: `R1# show ip interface gigabitEthernet 0/0
GigabitEthernet0/0 is up, line protocol is up
  Internet address is 172.16.45.200/21
  Broadcast address is 255.255.255.255
R1# show ip route connected
C        172.16.40.0/21 is directly connected, GigabitEthernet0/0
L        172.16.45.200/32 is directly connected, GigabitEthernet0/0`,
      copyable: 'show ip interface gigabitEthernet 0/0\nshow ip route connected',
      explain: [
        { line: 'Internet address is 172.16.45.200/21', why: 'The interface address and prefix you configured; the router derives the network from it.' },
        { line: 'C 172.16.40.0/21 is directly connected', why: 'The connected route shows the network address the router calculated: 172.16.40.0/21 — the same answer as the magic-number method.' },
        { line: 'L 172.16.45.200/32', why: 'The local route for the interface address itself, always a /32.' },
      ],
      note: 'Use show ip route connected as an answer key: the C entry is the network address of the interface.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang network at broadcast address ay **hindi** pwedeng ibigay sa host. Kapag may tanong na “valid host address?”, i-check muna kung ang address ay ang una o huli ng bloke.' },
    { type: 'callout', kind: 'trap', text: 'Ang 10.0.0.255 ay **host address** kung /16 pero **broadcast** kung /24. Ang pagiging broadcast ay depende sa mask, hindi sa numerong 255.' },
    { type: 'callout', kind: 'tip', text: 'Sa exam, isulat sa papel ang listahan ng multiples ng magic number (hal. 0, 32, 64, 96, 128, 160, 192, 224) bago sagutin. Mas mabilis at walang mali sa pagbibilang.' },
    {
      type: 'remember',
      title: 'Mga bitag sa subnetting',
      items: [
        '**Magkalapit na numero ≠ magkasama sa subnet** (62 at 66 sa /26 ay magkaiba).',
        '**Gateway ay dapat nasa subnet ng host.**',
        '**Bagong prefix para sa “at least N subnets” = lumang prefix + s** kung saan 2^s ≥ N.',
        '**Walang “-2” sa subnets** sa modernong CCNA; ang “-2” ay para sa hosts lang.',
      ],
    },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Using the wrong octet: the magic number only applies in the interesting octet.',
        'Forgetting that the octets after the interesting octet become 0 (network) or 255 (broadcast).',
        'Calling the first or last address of the block a usable host.',
        'Comparing two addresses numerically instead of comparing their network addresses.',
        'Subtracting 2 from the subnet count instead of the host count.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: PC na hindi makalabas',
      scenario: 'A PC is configured with 192.168.1.200 / 255.255.255.128 and default gateway 192.168.1.1. It can ping other hosts on its own switch but nothing outside.',
      evidence: `C:\\> ipconfig
   IPv4 Address. . . . . : 192.168.1.200
   Subnet Mask . . . . . : 255.255.255.128
   Default Gateway . . . : 192.168.1.1
C:\\> ping 192.168.1.1
Reply from 192.168.1.200: Destination host unreachable.`,
      question: 'Bakit hindi maabot ng PC ang gateway?',
      answer: 'With mask 255.255.255.128 (/25) the magic number is 128. 192.168.1.200 is in the block 128–255 (network 192.168.1.128). The gateway 192.168.1.1 is in the block 0–127. They are in different subnets, so the PC treats the gateway as off-link and cannot reach it.',
      fix: 'Give the PC a gateway inside its own subnet (for example 192.168.1.129 if the router interface is configured there) or correct the address or mask so that the host and gateway share a subnet. Verify with ipconfig and ping.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Para sa host 192.168.5.130/26: (1) network, (2) broadcast, (3) usable range, (4) ilang usable hosts. Pagkatapos: magkasama ba ang 10.4.4.30/28 at 10.4.4.17/28?',
      answer: '/26 → magic number 64. Multiples: 0, 64, 128, 192. 130 → network 192.168.5.128, broadcast 192.168.5.191, usable .129–.190, 62 hosts. For /28 (magic 16): 30 is in 16–31 and 17 is in 16–31, so both are in network 10.4.4.16 — yes, same subnet.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Write the multiples of the magic number first; then the answer is a lookup.',
        'Identify what is being asked (network, broadcast, range, count) before calculating.',
        'Always check the answer choices: eliminate any that are not multiples of the magic number.',
        'A valid host is never the first or last address of its block.',
        'Practise in the Subnetting trainer until each question takes under 45 seconds.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Magic number = 256 − mask value in the interesting octet.',
        'Network = largest multiple ≤ host value; broadcast = next network − 1.',
        'Same subnet means same network address under the same mask.',
        'Pick a mask with powers of two: subnets 2^s, hosts 2^h − 2.',
        'The gateway must sit in the host’s own subnet.',
        'Susunod: VLSM — gamitin ang mga kasanayang ito para hatiin ang isang block sa iba-ibang laki.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'What is the network address of the host 172.16.45.200/21?',
    choices: ['172.16.32.0', '172.16.40.0', '172.16.44.0', '172.16.45.0'], correct: [1],
    explanation: '/21 gives mask 255.255.248.0, so the magic number in the third octet is 8. The multiples are …, 32, 40, 48. The value 45 falls in 40–47, so the network is 172.16.40.0.',
    wrong: { 0: '32 is a multiple of 8 but 45 is past 40, so the block is 40–47.', 2: '44 is not a multiple of 8.', 3: '45 is the host value, not a block start.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'What is the broadcast address of the host 10.1.1.77/27?',
    choices: ['10.1.1.64', '10.1.1.95', '10.1.1.96', '10.1.1.127'], correct: [1],
    explanation: '/27 → block size 32. 77 lies in 64–95, so the network is 10.1.1.64 and the broadcast is the next network (96) minus one = 10.1.1.95.',
    wrong: { 0: '10.1.1.64 is the network address.', 2: '10.1.1.96 is the next network address.', 3: '127 is the broadcast of a /25 block, not a /27.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'What is the usable host range of the subnet that contains 192.168.5.130/26?',
    choices: ['192.168.5.128 – 192.168.5.191', '192.168.5.129 – 192.168.5.190', '192.168.5.130 – 192.168.5.191', '192.168.5.129 – 192.168.5.191'], correct: [1],
    explanation: 'Block size 64 gives 128–191. The network is .128 and the broadcast is .191, so the usable range is .129–.190.',
    wrong: { 0: 'That includes the network and broadcast addresses.', 2: 'That starts at the host value and includes the broadcast.', 3: 'The broadcast .191 is not usable.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: 192.168.10.62/26 and 192.168.10.66/26 are in the same subnet.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'With a /26 the blocks are 0–63 and 64–127. The address .62 is in the first and .66 is in the second, so they are in different subnets.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'You must create at least 6 subnets from 192.168.1.0/24 while keeping as many hosts per subnet as possible. Which mask do you use?',
    choices: ['/25', '/26', '/27', '/28'], correct: [2],
    explanation: '2^2 = 4 is not enough but 2^3 = 8 ≥ 6, so borrow 3 bits: /24 + 3 = /27 (30 hosts per subnet).',
    wrong: { 0: '/25 gives only 2 subnets.', 1: '/26 gives only 4 subnets.', 3: '/28 gives 16 subnets but leaves fewer hosts than necessary.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'How many usable host addresses does a /27 subnet provide?',
    choices: ['14', '30', '32', '62'], correct: [1],
    explanation: 'A /27 leaves 5 host bits: 2^5 − 2 = 30.',
    wrong: { 0: '14 is the /28 count.', 2: '32 is the total including network and broadcast.', 3: '62 is the /26 count.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'How many subnets are created when a /16 network is divided using /20 masks?',
    choices: ['4', '8', '16', '32'], correct: [2],
    explanation: '/20 borrows 4 bits from /16, and 2^4 = 16 subnets.',
    wrong: { 0: '4 would need 2 borrowed bits (/18).', 1: '8 would need 3 borrowed bits (/19).', 3: '32 would need 5 borrowed bits (/21).' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'hard', type: 'multiple',
    prompt: 'Which TWO addresses are valid host addresses in the subnet 192.168.1.64/26?',
    choices: ['192.168.1.64', '192.168.1.65', '192.168.1.126', '192.168.1.127'], correct: [1, 2],
    explanation: 'The block is 64–127. .64 is the network address and .127 is the broadcast address, so only .65 and .126 can be assigned to hosts.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'hard', type: 'true-false',
    prompt: 'True or false: with the mask 255.255.254.0, the address 10.0.1.255 is the broadcast address of its subnet.',
    choices: ['True', 'False'], correct: [0],
    explanation: '255.255.254.0 is a /23: the magic number is 2 in the third octet. 10.0.1.x falls in 10.0.0.0–10.0.1.255, so 10.0.1.255 is the last address and is the broadcast.',
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'hard', type: 'single',
    prompt: 'A PC is configured as 192.168.1.200/25 with default gateway 192.168.1.1. It cannot reach the gateway. Why?',
    choices: ['The gateway is in a different subnet than the host', 'The mask is wrong for a private address', 'The host is using the broadcast address', 'The gateway must end in .254'], correct: [0],
    explanation: 'A /25 splits the last octet into 0–127 and 128–255. The host is in 128–255 and the gateway is in 0–127, so they do not share a subnet.',
    wrong: { 1: 'Private addresses can use any valid mask.', 2: '.200 is not the broadcast of the 128–255 block (that is .255).', 3: 'No rule requires the gateway to end in .254.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Pro tip: paano mabilis sagutin ang subnetting?', back: '256 − MASK = MAGIC. Bilangin ang multiples hanggang malampasan ka. Network = bago lumampas. Broadcast = susunod − 1.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'How do you get the magic number?', back: '256 minus the mask value in the interesting octet.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'What is the interesting octet?', back: 'The first octet whose mask value is not 255 and not 0.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'How do you find the broadcast address?', back: 'Next network address minus one (later octets become 255).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Block sizes for /25 to /30?', back: '/25 128, /26 64, /27 32, /28 16, /29 8, /30 4.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'How do you test whether two hosts share a subnet?', back: 'Find the network address of each using the same mask; they must be equal.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'How do you choose a mask for N subnets?', back: 'Smallest s with 2^s ≥ N; add s to the original prefix.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'What must be true about a default gateway?', back: 'It must be in the same subnet as the host.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Twelve subnetting questions, no calculator',
  tool: 'Paper',
  minutes: 40,
  objective: 'Solve a set of mixed subnetting questions using only the magic number method and check them with the Subnet lister.',
  addressing: [
    { device: 'Host A', interface: 'address', address: '172.20.77.130/20' },
    { device: 'Host B', interface: 'address', address: '10.8.8.100/29' },
    { device: 'Host C', interface: 'address', address: '192.168.99.45/27' },
  ],
  steps: [
    'For each host, write the mask in dotted decimal and find the interesting octet and magic number.',
    'Write the first ten multiples of the magic number for each host.',
    'Find the network address, broadcast address and usable range of Host A, B and C.',
    'State how many usable hosts each subnet holds.',
    'Check whether Host B (10.8.8.100/29) and 10.8.8.104/29 share a subnet, and explain.',
    'Verify every answer in the Subnet lister above and correct any difference.',
    'Time yourself: repeat three new random hosts and aim for under 45 seconds each.',
  ],
  checklist: [
    'Magic number found for each prefix',
    'Network, broadcast and range written for all three hosts',
    'Same-subnet question answered with the networks shown',
    'All answers verified with the Subnet lister',
  ],
  hints: [
    '/20 puts the interesting octet in the third octet with a magic number of 16.',
    'For /29 the magic number is 8 in the fourth octet: 96, 104, 112…',
  ],
  solution: [
    'Host A /20: magic 16 in the third octet; 77 is in 64–79 → network 172.20.64.0, broadcast 172.20.79.255, usable 172.20.64.1–172.20.79.254, 4094 hosts.',
    'Host B /29: magic 8; 100 is in 96–103 → network 10.8.8.96, broadcast 10.8.8.103, usable .97–.102, 6 hosts. Host C /27: magic 32; 45 is in 32–63 → network 192.168.99.32, broadcast .63, usable .33–.62, 30 hosts.',
    '10.8.8.104/29 is in the block 104–111, whereas Host B is in 96–103. They are in different subnets.',
  ],
  breakIt: 'Deliberately use the wrong octet for the magic number on Host A (use the fourth octet instead of the third) and see how the network address becomes wrong. Explain why the third octet is the interesting one.',
};
