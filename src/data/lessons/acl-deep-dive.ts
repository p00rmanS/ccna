import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'acl-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.6',
  domain: 'D5',
  title: 'ACL Deep Dive: Wildcards, Placement and Editing',
  description: 'Master wildcard masks for any range, choose the right interface and direction, edit named ACLs with sequence numbers and read hit counters.',
  whyMatters:
    'Ang ACL ang isa sa pinakamadalas lumabas sa exam at sa totoong trabaho. Ang karamihan ng mali ay nasa tatlong bagay: maling wildcard, maling lugar o direksyon, at maling pagkakasunod ng rules. Aayusin natin ang tatlong iyan dito.',
  objectives: [
    'Write a wildcard mask for any host, subnet or range',
    'Place standard and extended ACLs correctly and pick in or out',
    'Edit a named ACL with sequence numbers',
    'Read show access-lists hit counters to prove behaviour',
    'Protect VTY lines with access-class',
  ],
  estimatedMinutes: 45,
  difficulty: 'exam',
  keywords: ['ACL', 'wildcard mask', 'named ACL', 'sequence number', 'ip access-group', 'access-class', 'implicit deny', 'show access-lists', 'placement'],
  examObjectives: ['5.6'],
  sections: [
    {
      type: 'explain',
      simple: [
        'An ACL is read from the top, the first match decides, and an implicit deny waits at the bottom. Wildcard masks say which bits must match: 0 means match, 1 means ignore.',
        'Where you apply the ACL (which interface, which direction) is as important as what it says.',
      ],
      taglish: [
        'Ang ACL ay binabasa mula taas, **ang unang tugma ang panalo**, at may **implicit deny** sa dulo. Ang wildcard mask ay nagsasabi kung aling bits ang dapat tumugma: **0 = dapat tumugma**, **1 = huwag pansinin**.',
        'Kasinghalaga ng laman ang **lugar**: aling interface at aling direksyon (in o out). Ang tamang rule na nasa maling lugar ay sira pa rin.',
        'Pwede mong i-edit ang named ACL nang hindi ito binubura — gamit ang **sequence numbers**.',
      ],
      technical: [
        'A wildcard mask is compared bit by bit with the address in the rule. Zero bits must match; one bits are ignored. For a subnet the wildcard is the inverse of the mask: 255.255.255.0 → 0.0.0.255. host x is the same as x 0.0.0.0, and any is 0.0.0.0 255.255.255.255.',
        'For a range that is a power-of-two block aligned on its size, the wildcard is block size − 1 in the interesting octet. 192.168.8.0 – 192.168.11.255 is 192.168.8.0 with wildcard 0.0.3.255.',
        'Standard ACLs filter on source only and are placed close to the destination. Extended ACLs filter on protocol, source, destination and ports and are placed close to the source. Inbound ACLs are checked before routing and outbound ACLs after routing; ACLs never filter traffic the router itself generates.',
      ],
    },
    {
      type: 'analogy',
      title: 'Guwardiya sa gate',
      body: [
        'A guard reads a list from the top for every visitor. The first line that matches decides whether to let them in. If nothing matches, the last unwritten rule says “no”. Put the guard at the right gate (placement) and watching the right direction (in or out).',
      ],
      taglish: [
        'Isipin ang **guwardiya sa gate** na may listahan. Binabasa niya mula taas para sa bawat bisita; ang **unang tugma** ang masusunod. Kapag walang tugma, ang **di-nakasulat na huling linya** ay “bawal”. Mahalaga rin kung **saang gate** siya nakatayo (interface) at kung **papasok o palabas** ang binabantayan niya (in/out).',
      ],
    },
    {
      type: 'hook',
      title: 'Wildcard = 255 minus mask',
      trick: '**WILDCARD = 255 − MASK (bawat octet). Standard malapit sa DESTINATION, extended malapit sa SOURCE. Tiyak muna, pangkalahatan huli.**',
      taglish: [
        '**255 − mask**: /24 → 0.0.0.255; /27 → 0.0.0.31; /22 → 0.0.3.255; /30 → 0.0.0.3.',
        '**Standard** = source lang → ilagay **malapit sa destination**. **Extended** = source at destination → ilagay **malapit sa source** para maaga ang pagbagsak ng trapiko.',
        '**Tiyak muna**: ang mas tiyak na rule ay nasa itaas. Ang `permit any` ay dapat huli.',
        'May **implicit deny any** sa dulo; kapag puro deny lang ang ACL, lahat ay bawal.',
      ],
      test: {
        question: 'Wildcard para sa 10.4.8.0/22?',
        answer: '/22 = mask 255.255.252.0 → 255 − 252 = 3 sa ikatlong octet → wildcard 0.0.3.255. Rule: 10.4.8.0 0.0.3.255 (sakop ang 10.4.8.0–10.4.11.255).',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Wildcard para sa kahit anong range',
      paragraphs: [
        'Kung ang gusto mong sakupin ay isang subnet, kunin ang inverse ng mask: 255 − bawat octet. /27 ay 255.255.255.224 → wildcard 0.0.0.31.',
        'Kung ang range ay bloke na power of two (hal. 4 na /24 na magkakasunod), ang wildcard sa octet na iyon ay laki ng bloke − 1. Ang 192.168.8.0 hanggang 192.168.11.255 ay 4 na /24 → wildcard 0.0.3.255, simula sa 192.168.8.0 (ang simula ay dapat multiple ng laki ng bloke).',
        'Para sa isang host: `host 10.1.1.5` ay kapareho ng `10.1.1.5 0.0.0.0`. Para sa lahat: `any`.',
        'Para sa mga odd/even na address (bihira): wildcard 0.0.0.254 ay tumutugma sa mga address na may parehong huling bit — para sa CCNA, sapat nang malaman na ang 1 bits ay “don’t care”.',
      ],
      steps: [
        'Tukuyin ang range (network at laki).',
        'Kung subnet: wildcard = 255 − mask sa bawat octet.',
        'Kung bloke: wildcard = laki − 1 sa octet na iyon, 255 sa mga sumunod, 0 sa mga nauna.',
        'I-check: ang network address ay dapat multiple ng laki ng bloke.',
      ],
      tricks: [
        'Hindi ito pareho ng mask: huwag isulat ang 255.255.255.0 sa ACL.',
        'Para sa /30: wildcard 0.0.0.3. Para sa /31: 0.0.0.1.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Placement at direksyon',
      paragraphs: [
        'Standard ACL (1–99, 1300–1999) ay tumitingin sa source lang. Kung ilalagay mo ito malapit sa source, haharangin mo rin ang trapikong papunta sa **ibang** destination na gusto mong payagan. Kaya ilagay malapit sa **destination**.',
        'Extended ACL (100–199, 2000–2699) ay tumitingin sa protocol, source, destination at port, kaya ligtas ilagay malapit sa **source** — bumabagsak agad ang di-kailangang trapiko at hindi nag-aaksaya ng bandwidth.',
        '**In** ay sinusuri ang packet bago mag-route (papasok sa interface); **out** ay pagkatapos mag-route (palabas). Para sa host-facing interface, in ang karaniwan para sa extended ACL. Isang ACL lang bawat interface, bawat direksyon, bawat protocol.',
      ],
      steps: [
        'Ano ang sinasala? Source lang → standard; protocol/port/destination → extended.',
        'Pumili ng interface: standard malapit sa destination, extended malapit sa source.',
        'Pumili ng direksyon mula sa pananaw ng router: in = papasok, out = palabas.',
        'Ilapat: ip access-group NAME in|out.',
      ],
      tricks: [
        'Ang ACL na nasa interface pero walang laman ay walang ginagawa; ang ACL na hindi nailapat ay walang epekto kahit tama ang mga rule.',
        'Hindi sinasala ng ACL ang trapikong nagmumula sa router mismo (hal. ping mula sa router).',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 3: Pag-edit ng named ACL at pagbasa ng counters',
      paragraphs: [
        'Ang numbered ACL ay hindi maayos i-edit; ang **named ACL** ay may sequence numbers (10, 20, 30…) kaya pwede kang magpasok sa pagitan: `15 deny tcp host 10.1.1.9 any eq 80`. Para magbura: `no 20`.',
        'Ang `show access-lists` ay nagpapakita ng bilang ng matches sa bawat linya: `(23 matches)`. Kung ang rule na inaasahan mong magtugma ay 0 matches, may mali sa wildcard o sa pagkakasunod. Ang `show ip interface gi0/1` ay nagsasabi kung aling ACL ang nakalapat at saang direksyon.',
        'Para sa remote access, gumamit ng `access-class NAME in` sa `line vty 0 4` — hindi `ip access-group`.',
      ],
      steps: [
        'ip access-list extended BLOCK-WEB → ilagay ang mga rule.',
        'Mag-test, tingnan ang show access-lists para sa matches.',
        'Magpasok ng bagong rule sa tamang sequence number kung kailangan.',
        'Isulat ang ACL sa interface at i-verify gamit ang show ip interface.',
      ],
      tricks: [
        'Gamitin ang `remark` para ilarawan ang rule; nakakatulong sa maintenance.',
        'Kapag ang rule sa dulo ay `permit ip any any`, malinaw ang intensyon — mas mabuti kaysa umasa sa implicit na pagkakaintindi.',
      ],
    },
    {
      type: 'remember',
      title: 'ACL na lumalabas sa exam',
      items: [
        '**Wildcard: 0 = tugma, 1 = huwag pansinin; /24 → 0.0.0.255; host = 0.0.0.0; any = 255.255.255.255.**',
        '**Standard = malapit sa destination; extended = malapit sa source.**',
        '**Implicit deny any sa dulo; tiyak muna sa itaas.**',
        '**Isang ACL bawat interface, bawat direksyon, bawat protocol.**',
        '**VTY = access-class; interface = ip access-group.** **Hindi sinasala ang trapikong galing sa router.**',
      ],
    },
    { type: 'diagram', id: 'acl-flow', caption: 'Daloy ng ACL: unang tugma ang masusunod; implicit deny sa dulo.' },
    {
      type: 'terms',
      items: [
        { term: 'Wildcard mask', definition: 'Bit pattern where 0 means match and 1 means ignore.' },
        { term: 'Implicit deny', definition: 'The unwritten deny any at the end of every ACL.' },
        { term: 'Sequence number', definition: 'The line number of an ACL entry; lets you insert and delete lines in a named ACL.' },
        { term: 'access-class', definition: 'Applies an ACL to VTY lines to restrict remote management.' },
        { term: 'ip access-group', definition: 'Applies an ACL to an interface in the in or out direction.' },
        { term: 'Hit counter', definition: 'The number of packets that matched an ACL line; shown by show access-lists.' },
        { term: 'remark', definition: 'A comment line inside an ACL.' },
      ],
    },
    {
      type: 'flow',
      title: 'Disenyo ng isang ACL',
      steps: [
        'Isulat sa Taglish ang gusto mo: sino, saan, anong serbisyo, payag o bawal.',
        'Piliin ang uri: standard (source lang) o extended.',
        'Isulat ang mga rule: tiyak muna, pangkalahatan huli; tapos isaalang-alang ang implicit deny.',
        'Ilapat sa tamang interface at direksyon.',
        'I-test at tingnan ang show access-lists para sa hit counts.',
      ],
    },
    {
      type: 'cli',
      title: 'Named extended ACL na may edit',
      transcript: `R1(config)# ip access-list extended BLOCK-WEB
R1(config-ext-nacl)# remark Block guests from web
R1(config-ext-nacl)# 10 deny tcp 10.1.20.0 0.0.0.255 any eq 80
R1(config-ext-nacl)# 20 permit ip any any
R1(config-ext-nacl)# interface gigabitEthernet 0/1
R1(config-if)# ip access-group BLOCK-WEB in
R1# show access-lists
Extended IP access list BLOCK-WEB
    10 deny tcp 10.1.20.0 0.0.0.255 any eq www (14 matches)
    20 permit ip any any (230 matches)`,
      copyable: 'ip access-list extended BLOCK-WEB\n10 deny tcp 10.1.20.0 0.0.0.255 any eq 80\n20 permit ip any any\ninterface gigabitEthernet 0/1\nip access-group BLOCK-WEB in\nshow access-lists',
      explain: [
        { line: '10 deny tcp 10.1.20.0 0.0.0.255 any eq 80', why: 'Denies web traffic from the 10.1.20.0/24 subnet to anywhere; the wildcard 0.0.0.255 matches the whole subnet.' },
        { line: '20 permit ip any any', why: 'Explicit permit for everything else so the implicit deny does not block all other traffic.' },
        { line: 'ip access-group BLOCK-WEB in', why: 'Applies the ACL to traffic entering this interface, close to the source.' },
        { line: '(14 matches)', why: 'The counter proves that the rule is matching real packets.' },
      ],
      note: 'To insert a line later use a sequence number such as 15 deny tcp host 10.1.20.9 any eq 443.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang ACL na tama pero **hindi nailapat** sa interface ay walang epekto. Laging i-check ang `show ip interface` para sa “Inbound access list is …”.' },
    { type: 'callout', kind: 'trap', text: 'Ang `permit tcp any any` ay hindi kasama ang UDP (DNS). Kapag pinayagan mo ang web, huwag kalimutan ang **DNS (UDP 53)** kung kailangan.' },
    { type: 'callout', kind: 'tip', text: 'Sa pagbuo ng ACL, laging magsimula sa `permit` na kailangan, saka `deny`, pero tandaan ang pagkakasunod: kung ang isang pangkalahatang permit ay nasa itaas, hindi na maaabot ng mas tiyak na deny sa ibaba.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Writing the subnet mask instead of the wildcard mask.',
        'Placing a broad permit above a more specific deny.',
        'Forgetting the explicit permit ip any any after a deny.',
        'Applying the ACL in the wrong direction or on the wrong interface.',
        'Using ip access-group on VTY lines instead of access-class.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Ang rule ay hindi tumutugma',
      scenario: 'An ACL was meant to block the 10.1.20.0/24 guests from the web, but guests still browse freely. The administrator wrote the ACL and the counters show 0 matches on the deny line.',
      evidence: `R1# show access-lists BLOCK-WEB
Extended IP access list BLOCK-WEB
    10 deny tcp 10.1.20.0 255.255.255.0 any eq www (0 matches)
    20 permit ip any any (480 matches)`,
      question: 'Ano ang mali?',
      answer: 'The deny line uses the subnet mask 255.255.255.0 where a wildcard is required. As a wildcard it ignores the first three octets, so it matches almost nothing as intended; real guest traffic falls through to line 20, the permit.',
      fix: 'Replace line 10 with deny tcp 10.1.20.0 0.0.0.255 any eq 80 (remove the old line with no 10 and re-add it). Test again and watch the counter increase.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang wildcard para sa 192.168.16.0 hanggang 192.168.19.255, at sabihin kung saan ilalagay ang isang standard ACL na pumipigil sa 192.168.16.0/22 papunta sa server LAN 172.16.5.0/24.',
      answer: 'Four consecutive /24 blocks starting at a multiple of 4: 192.168.16.0 0.0.3.255. A standard ACL filters on source only, so apply it close to the destination: on the router interface facing 172.16.5.0/24, outbound (or inbound on the interface where traffic arrives, as long as it is near the destination).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Wildcard = 255 − mask in every octet.',
        'Standard near the destination, extended near the source.',
        'Check the order of lines: first match wins.',
        'show access-lists counters prove which line is matching.',
        'Remember the implicit deny at the end.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Wildcard: 0 matches, 1 ignores.',
        'Range wildcard = block size − 1 in the interesting octet.',
        'Standard near destination, extended near source.',
        'Named ACLs can be edited with sequence numbers.',
        'Use access-class on VTY lines.',
        'Susunod: NAT deep dive.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'easy', type: 'single',
    prompt: 'Which wildcard mask matches the subnet 172.16.8.0/22?',
    choices: ['0.0.0.255', '0.0.3.255', '0.0.7.255', '0.0.252.0'], correct: [1],
    explanation: '/22 is mask 255.255.252.0. 255 − 252 = 3, so the wildcard is 0.0.3.255.',
    wrong: { 0: 'That matches a /24.', 2: 'That matches a /21.', 3: 'That is not the inverse of the mask.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Where should a standard ACL be placed?',
    choices: ['Close to the source', 'Close to the destination', 'On the VTY lines only', 'On any switch port'], correct: [1],
    explanation: 'A standard ACL filters on source only, so it is placed close to the destination to avoid blocking legitimate traffic to other destinations.',
    wrong: { 0: 'That placement belongs to extended ACLs.', 2: 'VTY lines use access-class for management access.', 3: 'ACLs are applied on router or Layer 3 interfaces.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Which command applies an ACL named MGMT to the VTY lines?',
    choices: ['ip access-group MGMT in', 'access-class MGMT in', 'ip access-list MGMT in', 'access-group MGMT vty'], correct: [1],
    explanation: 'access-class under line vty restricts who can connect remotely.',
    wrong: { 0: 'That is for interfaces.', 2: 'That defines an ACL, not applies it.', 3: 'That is not valid IOS syntax.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'hard', type: 'single',
    prompt: 'A named ACL has lines 10 and 20. What allows you to add a new rule between them?',
    choices: ['Delete and recreate the ACL', 'Enter a line with sequence number 15', 'Use the insert keyword', 'It is impossible with named ACLs'], correct: [1],
    explanation: 'Named ACL entries have sequence numbers, so a line numbered 15 is placed between 10 and 20.',
    wrong: { 0: 'Not necessary with sequence numbers.', 2: 'There is no insert keyword.', 3: 'This is exactly what named ACLs support.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: an ACL filters traffic that is generated by the router itself.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'ACLs do not filter traffic originated by the router, such as its own pings.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'hard', type: 'multiple',
    prompt: 'Which TWO statements about ACLs are correct?',
    choices: ['Lines are evaluated top to bottom', 'There is an implicit deny at the end', 'The last matching line wins', 'A wildcard bit of 1 means the bit must match'], correct: [0, 1],
    explanation: 'ACLs are processed in order, the first match decides, and an implicit deny closes the list. A wildcard 1 bit means “ignore”.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: wildcard at placement?', back: 'WILDCARD = 255 − MASK. Standard malapit sa DESTINATION, extended malapit sa SOURCE. Tiyak muna, pangkalahatan huli.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Wildcard for a /27?', back: '0.0.0.31.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What do wildcard 0 and 1 mean?', back: '0 = must match, 1 = ignore.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'command', front: 'How do you protect VTY lines with an ACL?', back: 'access-class <name> in under line vty.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'command', front: 'How do you insert a line in a named ACL?', back: 'Enter it with a sequence number between the existing ones.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'command', front: 'How do you check ACL matches?', back: 'show access-lists (hit counters) and show ip interface.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Does an ACL filter router-originated traffic?', back: 'No.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Build, test and edit a named ACL',
  tool: 'Packet Tracer',
  minutes: 40,
  objective: 'Block a guest subnet from web access with a named extended ACL, prove it with counters and then edit it using sequence numbers.',
  steps: [
    'Build a router with a guest LAN 10.1.20.0/24, a staff LAN 10.1.10.0/24 and a server LAN with a web server. Confirm everyone can reach the server.',
    'Create ip access-list extended BLOCK-WEB denying tcp from the guest subnet to any on port 80, then permit ip any any.',
    'Apply it inbound on the guest-facing interface and verify the guests are blocked but staff are not.',
    'Run show access-lists and note the hit counters; generate more traffic and watch them increase.',
    'Insert a line (sequence 5) permitting host 10.1.20.9 to the web server and verify that host works while the others are blocked.',
    'Restrict VTY access to the staff subnet with a standard ACL and access-class.',
    'Add remarks to each rule.',
  ],
  checklist: [
    'Guests blocked from the web, others unaffected',
    'Counters increase on the deny line',
    'Sequence 5 exception works',
    'VTY restricted with access-class',
    'Remarks added',
  ],
  hints: [
    'The exception must have a lower sequence number than the deny it overrides.',
    'Use show ip interface to confirm the ACL is applied.',
  ],
  solution: [
    '10 deny tcp 10.1.20.0 0.0.0.255 any eq 80 and 20 permit ip any any on the guest interface, inbound.',
    '5 permit tcp host 10.1.20.9 any eq 80 placed above the deny.',
    'access-list 10 permit 10.1.10.0 0.0.0.255 and line vty 0 4 → access-class 10 in.',
  ],
  breakIt: 'Swap the order so the permit ip any any is line 10 and see that the deny never matches (0 matches).',
};
