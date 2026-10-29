import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ospf-neighbors';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.11',
  domain: 'D3',
  title: 'OSPF Neighbour Relationships: Why Adjacencies Fail',
  description: 'The checklist of settings that must match for two OSPF routers to become neighbours, and how to read the stuck states INIT, 2-WAY and EXSTART.',
  whyMatters:
    'Sa totoong trabaho at sa exam, ang pinakamadalas na problema sa OSPF ay "bakit hindi nagiging neighbour ang dalawang router?" Kapag alam mo ang checklist — area, timers, subnet, authentication, router ID, MTU — kaya mong hanapin ang sanhi sa loob ng ilang minuto.',
  objectives: [
    'List the parameters that must match for an OSPF adjacency to form',
    'Interpret the neighbour states INIT, 2-WAY, EXSTART and FULL in show ip ospf neighbor',
    'Use show ip ospf interface and debug output to find a mismatch',
    'Explain why duplicate router IDs and MTU mismatches break adjacencies',
    'Apply a step-by-step troubleshooting order for a missing neighbour',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['OSPF neighbor', 'adjacency', 'INIT', '2-WAY', 'EXSTART', 'hello interval', 'dead interval', 'MTU mismatch', 'duplicate router ID', 'show ip ospf interface', 'debug ip ospf adj', 'authentication'],
  examObjectives: ['3.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Two OSPF routers will only become neighbours if a handful of settings agree. Think of it as a handshake: if either side has a different area, timer, subnet or password, the handshake fails and the neighbour never reaches FULL.',
        'The state shown in show ip ospf neighbor is a clue. A neighbour stuck in INIT means hellos are arriving one way only. Stuck in EXSTART usually means a problem exchanging the database, often an MTU mismatch.',
      ],
      taglish: [
        'Dalawang OSPF router ay **magiging neighbour lang kung magkatugma ang ilang setting**. Isipin ito bilang **kamayan**: kapag **may isang panig na iba ang area, timer, subnet o password**, **pumapalya ang kamayan** at **hindi kailanman nagiging FULL**.',
        'Ang **state sa show ip ospf neighbor** ay **palatandaan**. **INIT** = **isang direksyon lang ang hello**. **2-WAY** = **nagkakakilala na** (normal sa DROTHER). **EXSTART/EXCHANGE na nakabitin** = **problema sa pagpapalitan ng database**, madalas **MTU mismatch**.',
        'Checklist na dapat magtugma: **area ID**, **hello at dead interval**, **subnet at mask** (sa broadcast link), **authentication**, **stub flag**. Dapat **magkaiba**: **router ID**.',
        'Ayusin sa **pagkakasunod**: **Layer 1/2 up?** → **IP at subnet tama?** → **OSPF naka-enable sa interface (hindi passive)?** → **timers/area/auth tugma?** → **router ID natatangi?** → **MTU tugma?**',
      ],
      technical: [
        'Parameters that must match to form an adjacency: area ID, subnet and mask on broadcast/NBMA networks, hello and dead intervals, authentication type and key, the stub-area flag (E-bit) and MTU (to leave EXSTART). Router IDs must be unique, and the interface must not be passive. Network type affects timers: broadcast and point-to-point default to 10/40, NBMA and point-to-multipoint to 30/120.',
        'Neighbour states and clues: Down (no hellos); Init (a hello received but the router\'s own ID is not in the neighbour\'s hello list, so reception is one-way, often due to an ACL or a one-sided passive-interface); 2-Way (bidirectional; on multi-access networks DROTHERs stay 2-Way with each other, which is normal); ExStart/Exchange (master/slave negotiation and database description exchange; stuck here usually means an MTU mismatch); Loading (LSRs outstanding, may indicate corrupt LSAs); Full.',
        'Troubleshooting commands: show ip ospf neighbor (state and dead timer), show ip ospf interface <if> (area, timers, network type, DR/BDR, whether passive), show ip protocols (networks and passive interfaces), show running-config | section router ospf, show ip interface brief and ping the neighbour. Lab debugging: debug ip ospf hello and debug ip ospf adj (messages such as "mismatched hello parameters", "mismatched area ID" and "invalid authentication").',
        'Duplicate router IDs prevent adjacencies or cause LSDB inconsistencies: set router-id explicitly and clear the process (clear ip ospf process). An MTU mismatch (ip mtu differs) leaves the neighbour in EXSTART or EXCHANGE; fix the MTU or, as a last resort, ip ospf mtu-ignore. Authentication must match the type (null, plain text or MD5/SHA) and key.',
        'A neighbour that was FULL and drops after the dead interval indicates lost hellos: check the link, congestion, CPU, and ACLs permitting IP protocol 89 and 224.0.0.5/224.0.0.6. Remember that passive-interface suppresses hellos, so an adjacency can never form on a passive interface.',
      ],
    },
    {
      type: 'story',
      title: 'Ang Dalawang Router na Hindi Nagkakaintindihan',
      paragraphs: [
        'Biyernes ng hapon sa opisina ni Kuya Jun. Kakabit lang ng bagong branch router na **BR1**, pero **walang koneksyon** sa head office router na **HQ1**. Sabi ni Ate Mica, "Kuya, naka-on na ang OSPF sa dalawa, bakit walang route?"',
        'Pumunta si Kuya Jun sa console. **show ip ospf neighbor** sa HQ1: **walang laman**. Sa BR1: **INIT**. "Isang direksyon lang ang naririnig," bulong niya. Tiningnan niya ang **show ip ospf interface** sa dalawa. Sa HQ1: **Hello 10, Dead 40**. Sa BR1: **Hello 30, Dead 120**. Doon niya nakita: **magkaiba ang timer**.',
        'Dahil dumating ang Hello ni HQ1 pero hindi tugma ang parameters, hindi tinanggap ng BR1 ang kamayan. **Inayos niya ang hello-interval at dead-interval** para magtugma, at sa loob ng ilang segundo: **FULL**.',
        'Pagkatapos ay may bagong problema: ang pangalawang branch **BR2** ay **nakabitin sa EXSTART**. Maayos ang timers, area at subnet. "Hmm… MTU?" Tama: **1400 ang MTU ng tunnel** at **1500 ang isa**. Pagkatapos itugma ang MTU, nag-**FULL** na rin ito.',
      ],
      moral: 'Basahin ang **state** bilang palatandaan: **INIT = isang direksyon / hindi tugma ang hello**, **EXSTART na nakabitin = MTU**. At laging ihambing ang **area, timers, subnet, authentication at router ID** sa magkabilang panig.',
    },
    {
      type: 'analogy',
      title: 'Kamayan na may tatlong hakbang',
      body: [
        'Two people meeting must agree on the language, the greeting and who speaks first. If one greets in Tagalog and the other waits for English, nothing happens. OSPF neighbours must agree on the same language (area, timers) before they will share the map.',
      ],
      taglish: [
        'Dalawang taong nagkikita ay dapat **magkasundo sa wika, sa pagbati at kung sino ang unang magsasalita**. Kung **Tagalog ang bati ng isa** at **Ingles ang hinihintay ng isa**, **walang mangyayari**. Ang **OSPF neighbours ay dapat magkasundo sa parehong "wika"** (area, timers) bago nila ibahagi ang mapa.',
      ],
    },
    {
      type: 'hook',
      title: 'ATSAM: Area, Timers, Subnet, Auth, MTU (+ unique ID)',
      trick: '**ATSAM**: **A**rea, **T**imers, **S**ubnet, **A**uth, **M**TU ay dapat **tugma**; **Router ID** dapat **magkaiba**. **INIT** = one-way, **EXSTART stuck** = MTU.',
      taglish: [
        '**A**rea ID, **T**imers (hello/dead), **S**ubnet/mask, **A**uthentication, **M**TU = **dapat tugma**.',
        '**Router ID** = **dapat natatangi**; **hindi dapat passive** ang interface.',
        '**INIT** = isang direksyon; **2-WAY** = normal sa DROTHER; **EXSTART/EXCHANGE nakabitin** = MTU.',
        'Debug (sa lab): **debug ip ospf hello** / **adj**.',
      ],
      test: {
        question: 'Nakabitin sa EXSTART ang neighbour kahit tama ang area, timers at subnet. Ano ang unang titingnan mo?',
        answer: 'MTU mismatch sa interface ng dalawang router (show interfaces / show ip ospf interface). Itugma ang MTU o gamitin ang ip ospf mtu-ignore bilang huling paraan.',
      },
    },
    { type: 'diagram', id: 'ospf-adjacency-checklist', caption: 'Checklist: ano ang dapat magtugma at ano ang dapat magkaiba.' },
    {
      type: 'terms',
      items: [
        { term: 'Adjacency', definition: 'A relationship in which two OSPF routers have exchanged databases and are in the FULL state.' },
        { term: 'INIT', definition: 'A hello was received but the neighbour has not yet seen this router in its own hello: one-way communication.' },
        { term: '2-WAY', definition: 'Bidirectional communication established; normal between two DROTHERs on a multi-access network.' },
        { term: 'EXSTART / EXCHANGE', definition: 'Master/slave selection and database description exchange; stuck here often means an MTU mismatch.' },
        { term: 'MTU mismatch', definition: 'Different maximum packet sizes on the two interfaces; prevents completing database exchange.' },
        { term: 'Duplicate router ID', definition: 'Two routers using the same ID; breaks adjacency and LSDB consistency.' },
        { term: 'debug ip ospf adj', definition: 'A lab command that prints adjacency events and mismatch reasons.' },
      ],
    },
    {
      type: 'cli',
      title: 'Hanapin ang mismatch',
      transcript: `R1# show ip ospf neighbor
Neighbor ID     Pri   State        Dead Time   Address      Interface
2.2.2.2           0   INIT/  -     00:00:33    10.0.12.2    GigabitEthernet0/1
R1# show ip ospf interface gi0/1
GigabitEthernet0/1 is up, line protocol is up
  Internet Address 10.0.12.1/30, Area 0
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
R2# show ip ospf interface gi0/1
  Internet Address 10.0.12.2/30, Area 0
  Timer intervals configured, Hello 30, Dead 120, Wait 120, Retransmit 5
R1# debug ip ospf hello
OSPF-1 HELLO Gi0/1: Rcv hello from 2.2.2.2 area 0 10.0.12.2
OSPF-1 HELLO Gi0/1: Mismatched hello parameters from 10.0.12.2
OSPF-1 HELLO Gi0/1: Dead R 120 C 40, Hello R 30 C 10`,
      copyable: 'show ip ospf interface gi0/1',
      explain: [
        { line: 'State INIT', why: 'A hello was received from 2.2.2.2 but the relationship is not bidirectional; check the parameters.' },
        { line: 'show ip ospf interface gi0/1', why: 'Shows the area, network type and timers actually in use on that interface.' },
        { line: 'Hello 10, Dead 40 vs Hello 30, Dead 120', why: 'The two ends use different timers, so they will not become neighbours.' },
        { line: 'Mismatched hello parameters', why: 'The debug message names the exact problem: R is the received value and C is the configured value.' },
      ],
      note: 'Sample output for study. Use debug commands only briefly in a lab.',
    },
    {
      type: 'flow',
      title: 'Sundan: paano hinahanap ang sira na adjacency',
      steps: [
        'Tingnan ang show ip ospf neighbor: walang laman, INIT o nakabitin ba sa EXSTART?',
        'Kumpirmahing up/up ang link at tama ang IP at subnet; i-ping ang kapitbahay.',
        'Tiyaking naka-enable ang OSPF sa interface at hindi ito passive (show ip protocols).',
        'Ihambing ang area, hello/dead timers at authentication sa show ip ospf interface sa magkabilang router.',
        'Suriin kung natatangi ang router ID at tugma ang MTU.',
        'Ayusin ang mismatch at hintayin ang FULL; i-verify gamit ang show ip route ospf.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **2-WAY ay hindi laging problema**: sa **multi-access network**, **normal** na **2-WAY ang dalawang DROTHER**; **FULL lang sila sa DR at BDR**. Huwag ituring na sira.' },
    { type: 'callout', kind: 'trap', text: 'Ang **router ID ay dapat magkaiba**, pero **ang process ID ay hindi kailangang magtugma**. Madalas itong pinagpapalit sa tanong na "ano ang dapat magtugma?"' },
    { type: 'callout', kind: 'tip', text: 'Isulat ang **troubleshooting order**: **Layer 1/2 → IP/subnet → OSPF enabled at hindi passive → timers/area/auth → router ID → MTU**. Mas mabilis kaysa manghula.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pag-aakalang sira ang 2-WAY sa pagitan ng dalawang DROTHER.',
        'Hindi pag-check ng MTU kapag nakabitin sa EXSTART.',
        'Paggamit ng parehong router ID sa dalawang router.',
        'Paglimot na hindi bumubuo ng neighbour ang passive interface.',
        'Pag-iisip na kailangang magkapareho ang process ID.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Nakabitin sa EXSTART"',
      scenario: 'A new tunnel between R1 and R2 never leaves EXSTART although area, timers and subnet match.',
      evidence: `R1# show ip ospf neighbor
Neighbor ID     Pri   State              Dead Time   Address      Interface
2.2.2.2           1   EXSTART/BDR        00:00:38    10.0.12.2    Tunnel0
R1# show interfaces tunnel0 | include MTU
  MTU 1476 bytes
R2# show interfaces tunnel0 | include MTU
  MTU 1400 bytes`,
      question: 'Ano ang sanhi, at paano ito aayusin?',
      answer: 'MTU mismatch: 1476 sa R1 at 1400 sa R2. Hindi makumpleto ang database exchange kaya nakabitin sa EXSTART.',
      fix: 'Itugma ang MTU sa magkabilang dulo (ip mtu 1400 sa R1 Tunnel0), saka i-verify na umabot sa FULL. Bilang huling paraan lang gamitin ang ip ospf mtu-ignore.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang show ip ospf neighbor ay walang laman sa isang link na up/up at tama ang IP. Ilista ang limang bagay na iche-check mo, sa pagkakasunod.',
      answer: '1) Naka-enable ba ang OSPF sa interface (network statement/ip ospf area) at hindi passive. 2) Area ID tugma. 3) Hello/dead timers tugma. 4) Authentication at subnet/mask tugma. 5) Natatangi ang router ID at tugma ang MTU; at tiyaking walang ACL na humaharang sa protocol 89.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Must match: area, hello/dead timers, subnet/mask, authentication, stub flags, MTU. Must differ: router ID.',
        'INIT = one-way hellos; 2-WAY is normal between DROTHERs; EXSTART/EXCHANGE stuck = MTU mismatch.',
        'Passive interfaces never form adjacencies.',
        'show ip ospf interface shows the actual timers, area and network type.',
        'The process ID is locally significant.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Adjacencies need matching area, timers, subnet, authentication and MTU, and unique router IDs.',
        'Read the neighbour state as a clue to where the handshake fails.',
        'Use show ip ospf interface and debug output to compare both ends.',
        'Follow a fixed troubleshooting order.',
        'Susunod: OSPF DR at BDR sa multi-access network.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'easy', type: 'single',
    prompt: 'Which value must be DIFFERENT on two OSPF neighbours?',
    choices: ['Area ID', 'Hello interval', 'Router ID', 'Subnet mask'], correct: [2],
    explanation: 'Router IDs must be unique; the others must match.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'A neighbour is stuck in EXSTART although area and timers match. What is the most likely cause?',
    choices: ['An MTU mismatch', 'A different process ID', 'A different hostname', 'Wrong VLAN name'], correct: [0],
    explanation: 'MTU mismatches commonly stop the database exchange in EXSTART/EXCHANGE.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'Which command shows the hello and dead timers actually configured on an interface?',
    choices: ['show ip ospf interface', 'show ip route', 'show cdp neighbors', 'show running-config | include ospf'], correct: [0],
    explanation: 'show ip ospf interface lists the area, network type and timers.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'What does a neighbour in the INIT state typically indicate?',
    choices: ['The adjacency is FULL', 'Hellos are received but communication is not yet bidirectional', 'The router has no OSPF', 'The cost is too high'], correct: [1],
    explanation: 'INIT means a hello was heard but the neighbour has not listed this router, often due to a mismatch or one-way path.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'hard', type: 'single',
    prompt: 'Two DROTHER routers on an Ethernet segment show each other as 2-WAY. What does this mean?',
    choices: ['A fault', 'Normal behaviour; they are FULL only with the DR and BDR', 'They have different areas', 'Authentication has failed'], correct: [1],
    explanation: 'On multi-access networks DROTHERs remain 2-WAY with each other.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'Which statement about OSPF process IDs is true?',
    choices: ['They must match between neighbours', 'They are locally significant', 'They must be unique per area', 'They must equal the router ID'], correct: [1],
    explanation: 'Process IDs have only local meaning.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'Why can an interface configured as passive never form an adjacency?',
    choices: ['It has no IP address', 'No hello packets are sent or accepted on it', 'It has the wrong MTU', 'It uses a different area'], correct: [1],
    explanation: 'Passive interfaces suppress hellos, so neighbours cannot discover each other.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO parameters must match for an adjacency?',
    choices: ['Area ID', 'Router ID', 'Hello and dead intervals', 'Hostname'], correct: [0, 2],
    explanation: 'Area ID and the timers must match; router IDs must differ.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: two routers with the same router ID can form a healthy OSPF adjacency.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — duplicate router IDs break adjacencies and LSDB consistency.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: OSPF neighbour checklist?', back: 'ATSAM: Area, Timers, Subnet, Auth, MTU tugma; Router ID magkaiba. INIT = one-way; 2-WAY normal sa DROTHER; EXSTART nakabitin = MTU.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What must match for OSPF neighbours?', back: 'Area ID, hello/dead timers, subnet/mask, authentication, stub flags and MTU (and unique router IDs).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'INIT vs 2-WAY vs EXSTART?', back: 'INIT: one-way hello. 2-WAY: bidirectional (normal for DROTHERs). EXSTART stuck: database exchange problem, often MTU.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'command', front: 'See OSPF timers and area on an interface?', back: 'show ip ospf interface <if>' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'command', front: 'Lab debug for mismatches?', back: 'debug ip ospf hello and debug ip ospf adj' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Why does a passive interface not form neighbours?', back: 'It sends and accepts no hellos.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Break and fix three OSPF adjacencies',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Cause timer, area and passive failures between two routers and use the show commands to find each one.',
  topology: 'R1 — R2 on 10.0.12.0/30, OSPF area 0, router IDs 1.1.1.1 and 2.2.2.2.',
  steps: [
    'Configure OSPF on both routers and confirm FULL.',
    'On R2 change ip ospf hello-interval 30 and dead-interval 120; find the failure with show ip ospf interface.',
    'Restore the timers. On R2 change the network statement to area 1 and find the failure.',
    'Restore the area. Make the R2 link passive and find the failure with show ip protocols.',
    'Restore everything and confirm FULL again.',
    'Write a one-line symptom and fix for each failure.',
  ],
  checklist: [
    'FULL before breaking',
    'Each failure identified with a show command',
    'All three fixed and FULL restored',
  ],
  hints: [
    'Compare the same show command on both routers.',
    'A passive interface shows in show ip protocols.',
  ],
  solution: [
    'Timers: mismatched hello/dead; area: mismatched area ID; passive: no hellos sent.',
    'After restoring each setting the neighbour returns to FULL.',
  ],
  breakIt: 'Change the MTU on one interface (ip mtu 1400) and watch the neighbour stick in EXSTART.',
};
