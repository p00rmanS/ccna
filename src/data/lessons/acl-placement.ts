import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'acl-placement';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.7',
  domain: 'D5',
  title: 'ACL Placement and Troubleshooting: Where, Which Direction, Why',
  description: 'Decide where to place standard and extended ACLs, how in and out differ, and how to troubleshoot an ACL that does not behave as intended.',
  whyMatters:
    'Ang placement ang pinakakaraniwang “trick” sa ACL na tanong: tama ang rule pero mali ang lugar kaya hindi gumagana o nagba-block ng sobra. Gagamit tayo ng topolohiya at susundan ang packet para sa bawat desisyon.',
  objectives: [
    'Apply the standard and extended placement guidelines',
    'Choose in or out from the packet’s direction',
    'Trace a packet through two ACLs on a router',
    'Troubleshoot using show ip interface and show access-lists',
    'Explain when the guideline can be broken',
  ],
  estimatedMinutes: 35,
  difficulty: 'exam',
  keywords: ['ACL placement', 'inbound', 'outbound', 'standard ACL', 'extended ACL', 'ip access-group', 'show ip interface', 'show access-lists', 'troubleshooting', 'implicit deny'],
  examObjectives: ['5.6'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Placement answers two questions: on which interface, and in which direction. The usual guideline is extended ACLs close to the source and standard ACLs close to the destination.',
        'Direction is always from the router’s point of view: in means packets arriving on the interface, out means packets leaving it.',
      ],
      taglish: [
        'Ang placement ay sumasagot sa dalawang tanong: **saang interface** at **saang direksyon**. Karaniwang gabay: **extended ACL malapit sa source**, **standard ACL malapit sa destination**.',
        'Ang direksyon ay laging **mula sa pananaw ng router**: **in** = packet na **pumapasok** sa interface; **out** = packet na **lumalabas**.',
        'Ito ay **gabay, hindi batas**. Minsan mas tamang ilagay ang extended ACL na malapit sa destination kung iyon ang paraan para hindi maapektuhan ang ibang trapiko o kung walang kontrol sa router na malapit sa source.',
      ],
      technical: [
        'An extended ACL examines source, destination, protocol and ports, so it can be placed close to the source and drop unwanted traffic before it crosses the network. A standard ACL examines only the source address, so it is placed close to the destination to avoid blocking that source’s traffic to other destinations.',
        'An inbound ACL is processed before the routing decision and saves router work for traffic that would be denied; an outbound ACL is processed after the routing decision when the egress interface is known. Only one ACL per protocol, per direction, per interface is allowed. Traffic originated by the router itself is not filtered by outbound ACLs.',
        'The guideline can be overridden when the administrator controls only one router, when policy is specific to a destination, or when a central choke point is easier to manage.',
      ],
    },
    {
      type: 'analogy',
      title: 'Checkpoint sa kalsada',
      body: [
        'A checkpoint at the town entrance (near the source) stops unwanted vehicles early. A checkpoint outside one building (near the destination) only checks who is entering that building. If you put a blanket “no trucks from this village” checkpoint at the building, trucks heading to other buildings are still allowed.',
      ],
      taglish: [
        'Ang **checkpoint sa pasukan ng bayan (malapit sa source)** ay humihinto agad sa ayaw mong pumasok. Ang **checkpoint sa harap ng isang gusali (malapit sa destination)** ay sinusuri lang ang papasok sa gusaling iyon. Kung ilalagay mo ang “bawal ang trak mula sa baryong ito” sa pinakaharap ng bayan, **hinaharang mo rin ang trak papunta sa ibang gusali** — kaya ang standard ACL (source lang ang alam) ay inilalagay malapit sa destination.',
      ],
    },
    {
      type: 'hook',
      title: 'E-S, S-D',
      trick: '**EXTENDED → SOURCE. STANDARD → DESTINATION. IN = papasok sa router. OUT = palabas.**',
      taglish: [
        '**E-S**: **E**xtended malapit sa **S**ource.',
        '**S-D**: **S**tandard malapit sa **D**estination.',
        '**IN/OUT** ay sa **pananaw ng router**, hindi ng host.',
        '**Isa lang** bawat interface, bawat direksyon, bawat protocol.',
      ],
      test: {
        question: 'Gusto mong pigilan ang 10.1.1.0/24 sa pag-telnet sa server pero payagan ang web. Anong uri at saan?',
        answer: 'Extended ACL (kailangan ng protocol/port), malapit sa source: inbound sa interface ng LAN ng 10.1.1.0/24.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Ang tamang lugar ayon sa uri',
      paragraphs: [
        'Topolohiya: LAN A (10.1.1.0/24) — R1 — R2 — LAN B (10.2.2.0/24) at Server (10.3.3.10) sa likod ng R2. Gusto mong pigilan ang LAN A sa pag-abot sa Server.',
        '**Extended ACL**: `deny ip 10.1.1.0 0.0.0.255 host 10.3.3.10`, inbound sa R1 g0/0 (LAN A interface). Ang trapiko ay bumabagsak bago pa pumasok sa core, at ang LAN A ay maaabot pa rin ang LAN B.',
        '**Standard ACL**: `deny 10.1.1.0 0.0.0.255`. Kung ilalagay sa R1 (malapit sa source), **mawawala rin ang access ng LAN A sa LAN B**, dahil source lang ang tinitingnan. Kaya ilagay ito sa R2, outbound sa interface papunta sa Server — doon lang ito makakaapekto sa Server.',
        'Mahalaga: sundan ang packet. Isulat kung saang interface ito papasok at lalabas sa bawat router.',
      ],
      steps: [
        'Gumuhit ng topolohiya at itala ang source at destination.',
        'Sundan ang packet: saang interface papasok (in) at lalabas (out) sa bawat router.',
        'Extended → source side; standard → destination side.',
        'Piliin ang direksyon batay sa daan ng packet.',
        'I-test ang bawat daan, kasama ang trapikong dapat pinapayagan.',
      ],
      tricks: [
        'Ang “in” sa source-side interface ay madalas na pinakamabisang kombinasyon para sa extended ACL.',
        'Tanungin: “anong ibang trapiko ang masasaktan ng rule na ito?”',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Paghahanap ng sira sa ACL',
      paragraphs: [
        'Checklist: (1) **Naka-apply ba?** `show ip interface g0/0` → “Inbound access list is …”. (2) **Tamang direksyon?** (3) **Tamang pagkakasunod ng linya?** (4) **Tama ang wildcard?** (5) **Nakikita ba ang matches?** `show access-lists` → (n matches). (6) **May return traffic ba na na-block ng implicit deny?**',
        'Karaniwang sira: ang ACL na nakalagay **out** sa interface na dapat **in**, kaya hindi tumutugma; pagkalimot sa `permit ip any any` sa dulo; at ang pagkalimot sa return traffic (hal. permit lang ang outbound web pero walang tugon pabalik — ang `established` keyword ay para sa TCP return traffic).',
        'Tandaan: ang ACL ay hindi nagsasala ng trapikong nagmumula sa router mismo.',
      ],
      steps: [
        'show ip interface <int> → naka-apply ba at saang direksyon?',
        'show access-lists → may matches ba ang inaasahang linya?',
        'Suriin ang pagkakasunod at wildcard.',
        'Subukan mula sa tamang source gamit ang extended ping/traceroute.',
        'Ayusin at ulitin.',
      ],
      tricks: [
        'Zero matches sa dapat na tumutugmang linya = maling direksyon, maling interface o maling wildcard.',
        'Ang `log` keyword sa dulo ng linya ay nagpapakita ng mga match sa log (gamitin nang matipid).',
      ],
    },
    {
      type: 'remember',
      title: 'ACL placement na lumalabas sa exam',
      items: [
        '**Extended → malapit sa SOURCE; standard → malapit sa DESTINATION.**',
        '**IN = papasok sa interface; OUT = palabas — pananaw ng router.**',
        '**Isa lang na ACL bawat interface, direksyon at protocol.**',
        '**show ip interface = nakalapat na ACL; show access-lists = matches.**',
        '**Gabay lang ito: pwedeng ibahin kung may dahilan.**',
      ],
    },
    { type: 'diagram', id: 'acl-placement', caption: 'Standard malapit sa destination, extended malapit sa source.' },
    {
      type: 'terms',
      items: [
        { term: 'Inbound ACL', definition: 'Filters packets as they arrive on an interface, before routing.' },
        { term: 'Outbound ACL', definition: 'Filters packets as they leave an interface, after routing.' },
        { term: 'Source-side placement', definition: 'Applying an ACL close to where the traffic starts.' },
        { term: 'Destination-side placement', definition: 'Applying an ACL close to the protected destination.' },
        { term: 'Hit counter', definition: 'Number of packets matched by an ACL line.' },
        { term: 'established', definition: 'ACL keyword matching TCP segments that belong to an existing session (ACK or RST set).' },
        { term: 'Choke point', definition: 'A single location where traffic can be inspected, such as an edge router.' },
      ],
    },
    {
      type: 'flow',
      title: 'Pagpapasya kung saan ilalagay',
      steps: [
        'Tukuyin kung standard o extended ang kailangan.',
        'Gumuhit ng daan ng packet at itala ang bawat interface.',
        'Ilagay ang extended malapit sa source; ang standard malapit sa destination.',
        'Piliin ang in o out ayon sa daan ng packet.',
        'I-verify gamit ang show commands at pagsubok.',
      ],
    },
    {
      type: 'cli',
      title: 'Pag-apply at pag-verify',
      transcript: `R1(config)# ip access-list extended BLOCK-A-TO-SERVER
R1(config-ext-nacl)# deny ip 10.1.1.0 0.0.0.255 host 10.3.3.10
R1(config-ext-nacl)# permit ip any any
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ip access-group BLOCK-A-TO-SERVER in
R1# show ip interface gigabitEthernet 0/0 | include access list
  Outgoing access list is not set
  Inbound  access list is BLOCK-A-TO-SERVER`,
      copyable: 'ip access-list extended BLOCK-A-TO-SERVER\ndeny ip 10.1.1.0 0.0.0.255 host 10.3.3.10\npermit ip any any\ninterface gigabitEthernet 0/0\nip access-group BLOCK-A-TO-SERVER in\nshow ip interface gigabitEthernet 0/0',
      explain: [
        { line: 'deny ip 10.1.1.0 0.0.0.255 host 10.3.3.10', why: 'Extended rule: it names the source subnet and the exact destination, so it can sit near the source.' },
        { line: 'ip access-group BLOCK-A-TO-SERVER in', why: 'Applies the ACL to packets arriving from LAN A, dropping unwanted traffic as early as possible.' },
        { line: 'Inbound access list is BLOCK-A-TO-SERVER', why: 'Confirms that the ACL is applied on the intended interface and direction.' },
      ],
      note: 'Remember that return traffic from the server is not affected here because the ACL filters only packets arriving from LAN A.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **standard ACL na malapit sa source** ay madalas na nakakasagabal sa **ibang destination**. Iyan ang dahilan ng gabay na ilagay ito malapit sa destination.' },
    { type: 'callout', kind: 'trap', text: 'Hindi pareho ang in at out sa isang interface: ang trapikong **papunta sa host** ay out sa interface na iyon, hindi in.' },
    { type: 'callout', kind: 'tip', text: 'Isulat ang pangalan ng interface at direksyon sa tabi ng bawat ACL sa diagram mo bago sagutin ang tanong.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Placing a standard ACL near the source and blocking unrelated traffic.',
        'Applying the ACL in the wrong direction.',
        'Applying an ACL to the wrong interface of the router.',
        'Forgetting return traffic or the final permit.',
        'Defining an ACL but never applying it.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Hindi gumagana ang ACL',
      scenario: 'An ACL meant to block LAN A (10.1.1.0/24) from the server 10.3.3.10 has no effect; LAN A hosts can still reach the server.',
      evidence: `R1# show ip interface g0/0 | include access list
  Outgoing access list is BLOCK-A-TO-SERVER
  Inbound  access list is not set
R1# show access-lists BLOCK-A-TO-SERVER
    10 deny ip 10.1.1.0 0.0.0.255 host 10.3.3.10 (0 matches)
    20 permit ip any any (212 matches)`,
      question: 'Ano ang mali?',
      answer: 'The ACL is applied outbound on the LAN A interface, but LAN A traffic arrives inbound on it. The deny line never matches (0 matches).',
      fix: 'Remove the outbound application and apply it inbound: interface g0/0 → no ip access-group BLOCK-A-TO-SERVER out → ip access-group BLOCK-A-TO-SERVER in. Confirm that matches increase.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Gusto mong payagan lang ang 10.1.1.5 sa pag-SSH papunta sa router R2 (VTY). Anong uri ng ACL, anong command at saan ilalapat?',
      answer: 'A standard ACL is enough (source only): access-list 10 permit host 10.1.1.5. Apply it on R2’s VTY lines with access-class 10 in (not ip access-group).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Extended near source, standard near destination.',
        'In and out are from the router’s perspective.',
        'One ACL per interface, direction and protocol.',
        'Use show ip interface and show access-lists to verify.',
        'Always check whether return traffic or an explicit permit is needed.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Place extended ACLs near the source, standard near the destination.',
        'Direction is relative to the router.',
        'Trace the packet to choose interface and direction.',
        'Verify with show commands and hit counters.',
        'Guidelines can be overridden with good reason.',
        'Susunod: virtualization at client IP verification.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'easy', type: 'single',
    prompt: 'Where should an extended ACL normally be placed?',
    choices: ['Close to the destination', 'Close to the source', 'On the VTY lines', 'On the switch uplink only'], correct: [1],
    explanation: 'An extended ACL can match source and destination, so placing it near the source drops unwanted traffic early.',
    wrong: { 0: 'That is the guideline for standard ACLs.', 2: 'VTY lines use access-class for management access.', 3: 'ACLs are applied on router interfaces.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Why is a standard ACL placed close to the destination?',
    choices: ['It uses less memory there', 'It filters only on source, so near the source it would block that source’s traffic to other destinations', 'It can match ports', 'It is processed faster'], correct: [1],
    explanation: 'A standard ACL only sees the source address, so placing it near the source blocks that source from reaching every destination.',
    wrong: { 0: 'Memory use is not the reason.', 2: 'Standard ACLs cannot match ports.', 3: 'Speed is not the reason.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Packets from LAN A arrive on R1 interface g0/0 headed for a remote server. In which direction must the ACL be applied on g0/0 to filter them?',
    choices: ['Out', 'In', 'Either direction', 'Neither; ACLs filter only router-generated traffic'], correct: [1],
    explanation: 'Packets arriving on an interface are filtered by an inbound ACL.',
    wrong: { 0: 'Outbound filters traffic leaving the interface.', 2: 'The direction matters.', 3: 'ACLs do not filter router-generated traffic.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'hard', type: 'single',
    prompt: 'show access-lists shows 0 matches on a deny line that should match. Which is the most likely cause?',
    choices: ['The ACL is applied in the wrong direction or on the wrong interface', 'The router has too little memory', 'DNS is misconfigured', 'The switch uses STP'], correct: [0],
    explanation: 'Zero matches usually mean that the traffic never reaches the ACL because of the interface or direction (or a wrong wildcard).',
    wrong: { 1: 'Memory is not related.', 2: 'DNS does not affect ACL matching.', 3: 'STP does not affect it.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: you can apply two inbound IPv4 ACLs to the same interface.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'Only one ACL per protocol, per direction, per interface is allowed.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO commands help verify ACL placement and behaviour?',
    choices: ['show ip interface', 'show access-lists', 'show vlan brief', 'show cdp neighbors'], correct: [0, 1],
    explanation: 'show ip interface shows where an ACL is applied and show access-lists shows lines and hit counters.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: E-S, S-D?', back: 'EXTENDED → SOURCE. STANDARD → DESTINATION. IN = papasok sa router. OUT = palabas.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Where does a standard ACL go and why?', back: 'Near the destination, because it only sees the source and would block that source elsewhere.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Where does an extended ACL go?', back: 'Near the source, to drop unwanted traffic early.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'concept', front: 'In vs out?', back: 'In: packets arriving on the interface. Out: packets leaving it (router’s point of view).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'command', front: 'Which command shows applied ACLs on an interface?', back: 'show ip interface <interface>.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'concept', front: 'How many ACLs per interface?', back: 'One per protocol, per direction.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What does “0 matches” suggest?', back: 'Wrong interface, direction or wildcard so the traffic never matches.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Place the ACL and prove it',
  tool: 'Packet Tracer',
  minutes: 40,
  objective: 'Block LAN A from a server with an extended ACL near the source, then compare with a standard ACL near the destination and observe side effects.',
  steps: [
    'Build LAN A, R1, R2, LAN B and a Server behind R2. Route between everything and confirm all pings work.',
    'Create an extended ACL on R1 denying LAN A to the Server and permitting everything else; apply it inbound on the LAN A interface.',
    'Test LAN A to Server (blocked) and LAN A to LAN B (allowed). Check show access-lists.',
    'Remove it. Create a standard ACL denying LAN A and apply it on R1 inbound; observe that LAN A also loses LAN B.',
    'Move the standard ACL to R2, outbound toward the Server, and test again.',
    'Apply an ACL in the wrong direction and use show ip interface and the 0 matches counter to find the fault.',
  ],
  checklist: [
    'Extended ACL near source works as intended',
    'Standard ACL near the source causes side effects',
    'Standard ACL near the destination works',
    'Wrong-direction fault diagnosed with show commands',
  ],
  hints: [
    'Use extended ping with the source address to test properly.',
    'Remember the implicit deny and add permit ip any any.',
  ],
  solution: [
    'Extended on R1 g0/0 inbound: deny ip <LAN A> host <Server>; permit ip any any.',
    'Standard on R2 outbound toward the Server: access-list 10 deny <LAN A>; access-list 10 permit any.',
    'Wrong direction shows 0 matches and “Outbound access list is …” on the LAN A interface.',
  ],
  breakIt: 'Apply the standard ACL on R1 inbound and list every destination that LAN A can no longer reach.',
};
