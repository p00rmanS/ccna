import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'cdp-lldp';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.11',
  domain: 'D2',
  title: 'CDP and LLDP: Layer 2 Neighbour Discovery',
  description: 'How directly connected devices announce themselves, how to read the neighbour table, and when to turn discovery off.',
  whyMatters:
    'Kapag minana mo ang isang network na walang diagram, ang CDP at LLDP ang pinakamabilis na paraan para malaman kung ano ang nakakabit sa bawat port. Pero ang parehong feature na ito ay nagbibigay ng impormasyon sa sinumang makakonekta, kaya kailangan mong malaman kung kailan ito papatayin. Madalas itong lumabas sa exam bilang "alin ang Cisco-only?" at "paano ito i-disable?".',
  objectives: [
    'Explain what CDP and LLDP advertise and how far the information travels',
    'Contrast CDP (Cisco-proprietary) with LLDP (open standard, IEEE 802.1AB)',
    'Read show cdp neighbors and show lldp neighbors output',
    'Enable and disable each protocol globally and per interface',
    'Describe the security reasons for limiting discovery protocols',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['CDP', 'LLDP', 'neighbour discovery', 'show cdp neighbors', 'show lldp neighbors', 'no cdp run', 'lldp run', '802.1AB', 'holdtime'],
  examObjectives: ['2.3'],
  sections: [
    {
      type: 'explain',
      simple: [
        'CDP and LLDP let a device say "I am here, this is my name, and this is the port you reached me on" to whatever is plugged into it. Each device collects those announcements into a neighbour table, so you can map a network just by asking each switch who its neighbours are.',
        'CDP is Cisco-only and on by default. LLDP is the open standard that works across vendors but must be switched on. Both only travel one hop, because they are Layer 2 and never routed.',
      ],
      taglish: [
        'Ang **CDP** at **LLDP** ay parang **pagpapakilala sa kapitbahay**: bawat device ay nagsasabi sa katabi niya ng **pangalan niya, uri ng device, at kung anong port ang ginamit**.',
        'Dahil dito, puwede mong **i-mapa ang buong network** sa pamamagitan ng pagtanong sa bawat switch kung sino ang mga kapitbahay niya — **hindi na kailangan ng diagram**.',
        'Ang **CDP** ay **Cisco lang** at **naka-on na by default**. Ang **LLDP** ay **open standard** (IEEE 802.1AB) kaya gumagana sa ibang vendor, pero **kailangan mong i-on**.',
        'Parehong **isang hop lang** ang abot nito: **Layer 2** ito at **hindi nire-route**. Ang nakikita mo lang ay ang **direktang nakakabit**.',
      ],
      technical: [
        'CDP is a Cisco-proprietary Layer 2 protocol that sends advertisements to the multicast MAC 0100.0CCC.CCCC every 60 seconds with a 180-second holdtime. It is enabled by default on Cisco devices. It carries device ID, local and remote interface, platform, capabilities, IP address, native VLAN and software version.',
        'LLDP (IEEE 802.1AB) is the vendor-neutral equivalent. It sends to 0180.C200.000E every 30 seconds with a 120-second holdtime. It is disabled by default on most Cisco IOS devices and is enabled with lldp run. Interfaces transmit and receive separately (lldp transmit / lldp receive).',
        'Neither protocol crosses a router and neither is forwarded by a switch; they are consumed by the directly connected neighbour. LLDP-MED extends LLDP for voice endpoints, supplying VLAN and power information to IP phones.',
        'Configuration: CDP — cdp run / no cdp run globally, cdp enable / no cdp enable per interface. LLDP — lldp run / no lldp run globally, lldp transmit and lldp receive per interface.',
        'Verification: show cdp neighbors [detail], show cdp interface, show lldp neighbors [detail], show lldp interface. The detail forms include the neighbour IP address and software version, which is the reason many hardened designs disable discovery on user-facing ports.',
      ],
    },
    {
      type: 'analogy',
      title: 'Name tag sa pintuan',
      body: [
        'Every apartment door has a name tag listing who lives there, which unit it is and what floor you are on. A visitor in the hallway learns about the neighbouring doors but not about the next building. CDP and LLDP are those name tags: useful for you, and just as readable by a stranger.',
      ],
      taglish: [
        'Bawat pinto ng apartment ay may **name tag**: pangalan, unit at palapag. Ang bisita sa hallway ay **malalaman ang mga katabing pinto** pero **hindi ang kabilang gusali**. Ganyan ang CDP at LLDP: **mahalaga sa iyo**, pero **nababasa rin ng kahit sinong estranghero** na nasa hallway.',
      ],
    },
    {
      type: 'hook',
      title: 'CDP = Cisco, LLDP = Lahat',
      trick: '**C**DP = **C**isco. **L**LDP = **L**ahat ng vendor. CDP **naka-on**, LLDP **kailangang i-on**.',
      taglish: [
        '**CDP = Cisco** lang. **LLDP = Lahat** ng vendor (open standard).',
        'Default: **CDP naka-ON**. **LLDP naka-OFF** — kaya kailangan ng **lldp run**.',
        'Parehong **isang hop lang**, parehong Layer 2.',
        'Kapag nagtanong ang exam ng **"vendor-neutral"** o **"802.1AB"**, **LLDP** ang sagot.',
      ],
      test: {
        question: 'Naglagay ka ng Cisco switch na konektado sa isang third-party switch. Hindi mo makita ang kapitbahay sa show cdp neighbors. Ano ang gagawin mo?',
        answer: 'Gamitin ang LLDP: lldp run sa Cisco switch (at tiyaking naka-on din ito sa kabila), saka show lldp neighbors. Hindi nakikipag-usap ang third-party device sa CDP.',
      },
    },
    { type: 'diagram', id: 'discovery-neighbors', caption: 'Ang CDP/LLDP ay isang hop lang — nakikita ng SW1 ang SW2 at R1, hindi ang nasa kabila nila.' },
    {
      type: 'terms',
      items: [
        { term: 'CDP', definition: 'Cisco Discovery Protocol. Proprietary, Layer 2, on by default. Timer 60s, holdtime 180s.' },
        { term: 'LLDP', definition: 'Link Layer Discovery Protocol, IEEE 802.1AB. Open standard, off by default on Cisco. Timer 30s, holdtime 120s.' },
        { term: 'Neighbour table', definition: 'The list of directly connected devices learned from advertisements.' },
        { term: 'Holdtime', definition: 'How long a neighbour entry is kept without hearing a fresh advertisement.' },
        { term: 'LLDP-MED', definition: 'LLDP extension for endpoints such as IP phones (voice VLAN, PoE).' },
        { term: 'Local / remote interface', definition: 'Your port and the neighbour\'s port. Shown as "Local Intrfce" and "Port ID" in the output.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: paano natututo ang SW1 tungkol sa SW2',
      steps: [
        'Naka-on ang CDP sa SW1 at SW2 bilang default.',
        'Bawat 60 segundo, nagpapadala ang SW2 ng CDP advertisement sa multicast address sa port Gi0/1.',
        'Natatanggap ito ng SW1 sa Gi0/1; hindi ito ipinapasa sa ibang port o sa router.',
        'Itinatala ng SW1 sa neighbour table: Device ID SW2, local port Gi0/1, remote port Gi0/24, platform, capability.',
        'Kapag huminto ang advertisement nang mahigit 180 segundo, tatanggalin ang entry.',
        'Sa show cdp neighbors, makikita mo ang listahan; sa show cdp neighbors detail, makikita pati ang IP address.',
      ],
    },
    {
      type: 'cli',
      title: 'Basahin ang neighbour table at i-control ang discovery',
      transcript: `SW1# show cdp neighbors
Capability Codes: R - Router, S - Switch, H - Host, I - IGMP, r - Repeater
Device ID   Local Intrfce   Holdtme   Capability   Platform    Port ID
SW2         Gig 0/1         158       S I          WS-C2960    Gig 0/24
R1          Gig 0/2         170       R S I        ISR4331     Gig 0/0/0

SW1(config)# lldp run
SW1(config)# interface gi0/10
SW1(config-if)# no cdp enable
SW1(config-if)# no lldp transmit
SW1(config-if)# end
SW1# show lldp neighbors
Device ID    Local Intf    Hold-time    Capability    Port ID
SW3          Gi0/3         120          B             Gi0/1`,
      copyable: 'show cdp neighbors detail',
      explain: [
        { line: 'Local Intrfce Gig 0/1', why: 'The port on SW1 where the neighbour was heard.' },
        { line: 'Port ID Gig 0/24', why: 'The port on the neighbour that sent the advertisement. Together these two columns map the cable.' },
        { line: 'Holdtme 158', why: 'Seconds left before the entry expires (counts down from 180 for CDP).' },
        { line: 'lldp run', why: 'Turns LLDP on globally; it is off by default on Cisco IOS.' },
        { line: 'no cdp enable (gi0/10)', why: 'Stops CDP on one port, such as one facing users or an untrusted network.' },
      ],
      note: 'Sample output for study; platforms and port names vary.',
    },
    {
      type: 'verify',
      title: 'Mga command sa verification',
      items: [
        { command: 'show cdp neighbors', shows: 'Summary: neighbour name, local and remote port, platform, capability, holdtime.' },
        { command: 'show cdp neighbors detail', shows: 'Everything above plus neighbour IP address, software version and native VLAN.' },
        { command: 'show cdp interface', shows: 'Which interfaces are sending CDP and the timers in use.' },
        { command: 'show lldp neighbors', shows: 'The same idea for LLDP; empty unless lldp run is enabled at both ends.' },
      ],
      good: 'Every expected cable shows a neighbour with matching local and remote ports.',
      bad: 'Missing neighbour: protocol disabled on one end, port down, or a vendor mismatch (CDP vs LLDP).',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **CDP ay naka-ON by default** at ang **LLDP ay naka-OFF by default** sa Cisco. Kapag may tanong na "bakit hindi nakikita ang third-party switch?", ang tamang sagot ay **i-enable ang LLDP**, hindi ayusin ang CDP.' },
    { type: 'callout', kind: 'trap', text: 'Ang **show cdp neighbors** ay **direktang kapitbahay lang** ang ipinapakita. **Hindi** ka makakakita ng device na dalawang hop ang layo, at **hindi** dumadaan ang CDP sa router.' },
    { type: 'callout', kind: 'tip', text: 'Para sa **seguridad**, patayin ang CDP/LLDP sa mga port na papunta sa **user o hindi mapagkakatiwalaang network**. Ang **detail** output ay nagbibigay ng **IP address at software version** — gagamitin ito ng attacker.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Isiping makikita ng CDP ang buong network; isang hop lang ito.',
        'Pagkalimutang i-enable ang LLDP sa magkabilang dulo.',
        'Pagpapatay ng CDP sa buong switch (no cdp run) nang hindi nalalaman na ginagamit pala ito ng IP phone.',
        'Paghalo ng "local interface" at "port ID" sa pagbasa ng output.',
        'Pag-iwan ng discovery protocols sa mga port na papunta sa internet o sa mga user.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Hindi ko makita ang kabilang switch"',
      scenario: 'A Cisco switch is cabled to a Juniper switch on Gi0/5. The link is up, but the Cisco switch shows no neighbours.',
      evidence: `SW1# show cdp neighbors
Device ID   Local Intrfce   Holdtme   Capability   Platform    Port ID

SW1# show lldp neighbors
% LLDP is not enabled
SW1# show interfaces gi0/5 status
Port      Name   Status       Vlan   Duplex  Speed Type
Gi0/5            connected    1      a-full  a-1000 10/100/1000BaseTX`,
      question: 'Bakit walang neighbour, at paano ito aayusin?',
      answer: 'Ang link ay up, kaya hindi problema ang cable. Ang Juniper switch ay hindi nagsasalita ng CDP (Cisco-only), at ang LLDP ay hindi pa naka-on sa Cisco switch.',
      fix: 'Enable LLDP globally with lldp run on SW1 (and confirm LLDP is enabled on the Juniper). Then verify with show lldp neighbors.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Kailangan mong i-secure ang switch: patayin ang CDP sa lahat ng user port pero panatilihin ito sa mga uplink. Paano mo gagawin, at bakit hindi mo gagamitin ang no cdp run?',
      answer: 'Gumamit ng interface range sa mga user port at ilagay ang no cdp enable (at no lldp transmit/receive kung naka-on ang LLDP). Hindi ginagamit ang no cdp run dahil papatayin nito ang CDP sa buong switch, kasama ang mga uplink at ang mga IP phone na umaasa rito.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'CDP is Cisco-proprietary and enabled by default; LLDP is the IEEE 802.1AB standard and disabled by default on Cisco.',
        'Both are Layer 2 and reach only directly connected neighbours.',
        'CDP timers 60/180; LLDP timers 30/120.',
        'show cdp neighbors detail reveals neighbour IP addresses — a security concern.',
        'no cdp run is global; no cdp enable is per interface. lldp run is global; lldp transmit/receive is per interface.',
      ],
    },
    {
      type: 'summary',
      points: [
        'CDP (Cisco, on) and LLDP (open, off) share neighbour information with directly connected devices.',
        'Read the neighbour table by matching local interface with the neighbour\'s Port ID.',
        'Limit discovery on untrusted or user-facing ports because the detail output leaks information.',
        'Susunod: DHCP — paano awtomatikong nakakakuha ng IP address ang mga device.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.3', difficulty: 'easy', type: 'single',
    prompt: 'Which discovery protocol is Cisco-proprietary?',
    choices: ['LLDP', 'CDP', 'SNMP', 'NTP'], correct: [1],
    explanation: 'CDP is the Cisco Discovery Protocol and only works between Cisco devices.',
    wrong: { 0: 'LLDP is the open standard.', 2: 'SNMP is a management protocol.', 3: 'NTP synchronises time.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.3', difficulty: 'easy', type: 'single',
    prompt: 'Which IEEE standard defines LLDP?',
    choices: ['802.1Q', '802.1D', '802.1AB', '802.3ad'], correct: [2],
    explanation: 'LLDP is defined by IEEE 802.1AB.',
    wrong: { 0: '802.1Q is VLAN tagging.', 1: '802.1D is spanning tree.', 3: '802.3ad is link aggregation (LACP).' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.3', difficulty: 'medium', type: 'single',
    prompt: 'Which command enables LLDP globally on a Cisco switch?',
    choices: ['lldp enable', 'lldp run', 'cdp run', 'enable lldp'], correct: [1],
    explanation: 'lldp run turns LLDP on globally; it is off by default.',
    wrong: { 0: 'Not valid IOS syntax.', 2: 'cdp run controls CDP.', 3: 'Not valid IOS syntax.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.3', difficulty: 'medium', type: 'single',
    prompt: 'Which command stops CDP on a single interface only?',
    choices: ['no cdp run', 'no cdp enable', 'cdp disable', 'shutdown'], correct: [1],
    explanation: 'no cdp enable is applied under the interface; no cdp run turns CDP off for the whole device.',
    wrong: { 0: 'That is global.', 2: 'Not valid IOS syntax.', 3: 'That shuts the port entirely.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.3', difficulty: 'medium', type: 'single',
    prompt: 'How far can CDP and LLDP information travel?',
    choices: ['Across the whole VLAN', 'Across routers to the internet', 'Only to directly connected neighbours', 'To every device in the OSPF area'], correct: [2],
    explanation: 'They are Layer 2 advertisements consumed by the neighbour; they are not forwarded.',
    wrong: { 0: 'They are not flooded through switches.', 1: 'Routers do not forward them.', 3: 'They are unrelated to routing protocols.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.3', difficulty: 'medium', type: 'single',
    prompt: 'A Cisco switch is connected to a non-Cisco switch and show cdp neighbors is empty. What is the best next step?',
    choices: ['Replace the cable', 'Enable LLDP on both devices', 'Change the VLAN', 'Reboot the router'], correct: [1],
    explanation: 'The non-Cisco switch does not speak CDP, so use the open standard, LLDP.',
    wrong: { 0: 'The link is up; the cable is fine.', 2: 'VLANs do not affect discovery.', 3: 'Irrelevant to the problem.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D2', objective: '2.3', difficulty: 'hard', type: 'single',
    prompt: 'Which output field tells you the neighbour\'s port that your cable is plugged into?',
    choices: ['Local Intrfce', 'Holdtme', 'Port ID', 'Capability'], correct: [2],
    explanation: 'Local Intrfce is your port; Port ID is the neighbour\'s port.',
    wrong: { 0: 'That is your own port.', 1: 'That is the remaining entry lifetime.', 3: 'That lists the neighbour type (router, switch...).' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D2', objective: '2.3', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO statements about CDP and LLDP are true?',
    choices: ['Both operate at Layer 2', 'Both are forwarded across routers', 'LLDP is vendor-neutral', 'CDP is disabled by default on Cisco'], correct: [0, 2],
    explanation: 'Both are Layer 2 and LLDP is the open standard. CDP is enabled by default and neither crosses a router.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D2', objective: '2.3', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: leaving CDP enabled on user-facing ports is a potential security concern.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — CDP leaks device names, IP addresses and software versions to anyone connected.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: CDP vs LLDP?', back: 'CDP = Cisco (naka-on by default). LLDP = Lahat ng vendor (802.1AB, kailangang i-on gamit ang lldp run). Parehong Layer 2 at isang hop lang.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'protocol', front: 'What is CDP?', back: 'Cisco Discovery Protocol: Layer 2, Cisco-only, enabled by default. Updates every 60s, holdtime 180s.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'protocol', front: 'What is LLDP?', back: 'IEEE 802.1AB open-standard discovery protocol. Disabled by default on Cisco; updates every 30s, holdtime 120s.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'command', front: 'Commands to view neighbours?', back: 'show cdp neighbors [detail] and show lldp neighbors [detail].' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'command', front: 'Disable CDP: globally vs per interface?', back: 'Global: no cdp run. Interface: no cdp enable.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'command', front: 'Enable LLDP globally?', back: 'lldp run. Per interface, control it with lldp transmit and lldp receive.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Why limit CDP/LLDP on user ports?', back: 'They reveal device names, IP addresses and software versions to anyone plugged in.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Map a network with CDP, then restrict it',
  tool: 'Packet Tracer',
  minutes: 20,
  objective: 'Discover a three-device topology using only neighbour tables, then disable discovery on one port and observe the result.',
  topology: 'R1 — SW1 — SW2, with a PC on SW2. Start with no diagram and rely on show cdp neighbors.',
  steps: [
    'On SW1 run show cdp neighbors and write down each neighbour with the local and remote ports.',
    'Run show cdp neighbors detail and find the IP address of each neighbour.',
    'Draw the topology from only that information, then compare it with the real cabling.',
    'Enable LLDP: lldp run on SW1 and SW2, then compare show lldp neighbors with the CDP result.',
    'On the SW1 port facing SW2 run no cdp enable. Run clear cdp table and show cdp neighbors; SW2 disappears.',
    'Restore with cdp enable.',
  ],
  checklist: [
    'Mapped the topology from neighbour tables only',
    'Found a neighbour IP address in the detail output',
    'Enabled LLDP and viewed its neighbour table',
    'Disabled CDP on one interface and saw the neighbour vanish',
  ],
  hints: [
    'Match your Local Intrfce with the neighbour\'s Port ID to find the other end of each cable.',
    'After no cdp enable, the existing entry stays until the holdtime expires unless you clear the table.',
  ],
  solution: [
    'Each cable appears as a pair: local interface here, Port ID there.',
    'lldp run turns LLDP on; both ends must have it enabled.',
    'no cdp enable on an interface stops transmit and receive on that interface.',
  ],
  breakIt: 'Run no cdp run on SW2 only and observe SW1 lose SW2 after the holdtime expires, while SW2 still sees nothing at all.',
};
