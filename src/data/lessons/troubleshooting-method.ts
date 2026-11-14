import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'troubleshooting-method';

export const lesson: Lesson = {
  id: ID,
  moduleId: '7.1',
  domain: 'D1',
  title: 'Troubleshooting Method: Layers, the Ping Ladder and the Show-Command Toolbox',
  description: 'Learn a repeatable way to find faults: choose an approach (bottom-up, top-down, divide and conquer), climb the ping ladder and read show commands as normal versus broken.',
  whyMatters:
    'Ang troubleshooting ang tunay na kasanayan ng network engineer, at maraming tanong sa exam ay troubleshooting na nakabalot sa configuration. Ang sikreto ay hindi manghula: sundin ang parehong hakbang sa bawat problema. Dito natin bubuuin ang sistemang iyon.',
  objectives: [
    'Follow a structured troubleshooting process from symptom to documentation',
    'Choose between bottom-up, top-down and divide-and-conquer approaches',
    'Use the ping ladder to locate the failing layer',
    'Read key show commands and recognise normal and broken output',
    'Use traceroute and the ARP and MAC tables to follow the path',
  ],
  estimatedMinutes: 40,
  difficulty: 'exam',
  keywords: ['troubleshooting', 'bottom-up', 'top-down', 'divide and conquer', 'ping', 'traceroute', 'show ip interface brief', 'show interfaces', 'show ip route', 'ARP', 'MAC address table', 'CRC errors'],
  examObjectives: ['1.4', '1.10'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Good troubleshooting is a process: define the problem, collect facts, narrow down the layer, form one hypothesis, test it, fix it and document it. Randomly changing settings makes things worse.',
        'The ping ladder is the fastest way to narrow down: loopback, own IP, gateway, remote IP, then name.',
      ],
      taglish: [
        'Ang magandang troubleshooting ay **proseso**: **(1) ilarawan ang problema, (2) mangalap ng datos, (3) paliitin ang layer, (4) bumuo ng isang hypothesis, (5) subukan, (6) ayusin, (7) idokumento**. Ang **paghula at pagpapalit-palit ng setting** ay nagpapalala lang.',
        'Ang pinakamabilis na paraan para paliitin ang problema ay ang **ping ladder**: **loopback → sariling IP → gateway → remote IP → pangalan**.',
        'Tatlong approach: **bottom-up** (Layer 1 pataas), **top-down** (application pababa) at **divide and conquer** (magsimula sa gitna, hal. ping sa Layer 3, tapos pataas o pababa).',
      ],
      technical: [
        'A structured method (for example Cisco’s troubleshooting model) is: define the problem, gather facts, consider possibilities, create an action plan, implement it, observe the result and document. Compare with a known-good baseline, change one thing at a time and keep a way to roll back.',
        'Approaches: bottom-up (physical → application) is thorough and suits unknown faults; top-down (application → physical) suits a problem that affects one application; divide and conquer starts at the layer you suspect (often a ping at Layer 3) and moves up if the test succeeds or down if it fails. Other techniques: follow the path with traceroute, compare configurations, swap a component.',
        'The ping ladder: 127.0.0.1 tests the local TCP/IP stack; the host’s own IP tests the NIC configuration; the default gateway tests the local segment (Layers 1–3 to the router); a remote IP tests routing beyond the gateway; a hostname tests DNS. The first failing step identifies the fault zone.',
      ],
    },
    {
      type: 'analogy',
      title: 'Doktor at pasyente',
      body: [
        'A doctor does not guess: they ask for symptoms, run tests, rule out causes one at a time, treat, and write it in the chart. The ping ladder is the series of quick tests that rules out whole areas in seconds.',
      ],
      taglish: [
        'Ang **doktor** ay hindi nanghuhula: tinatanong ang **sintomas**, nagpapa-**test**, **inaalis ang posibleng sanhi isa-isa**, ginagamot at isinusulat sa **chart**. Ang ping ladder ay serye ng mabibilis na test na nag-aalis ng buong lugar ng problema sa ilang segundo.',
      ],
    },
    {
      type: 'hook',
      title: 'LOGGR-N',
      trick: '**PING LADDER: Loopback → Own IP → Gateway → Remote IP → Name. Ang unang bumigo = ang lugar ng problema.**',
      taglish: [
        '**L**oopback (127.0.0.1): ayos ba ang TCP/IP stack?',
        '**O**wn IP: tama ba ang NIC at address?',
        '**G**ateway: abot ba ang router (Layer 1–3 sa lokal na segment)?',
        '**R**emote IP (hal. 8.8.8.8): gumagana ba ang routing at internet?',
        '**N**ame: gumagana ba ang DNS? **Ang unang bumigo** ang lugar na hahanapin.',
      ],
      test: {
        question: 'Gumagana ang ping sa gateway pero bumibigo ang ping sa 8.8.8.8. Saan ka maghahanap?',
        answer: 'Lampas sa gateway: default route, ISP link, NAT, ACL o routing sa router. Hindi na kailangang tingnan ang cable ng PC.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Piliin ang approach',
      paragraphs: [
        '**Bottom-up**: simulan sa Layer 1 (cable, ilaw ng port, power, duplex), Layer 2 (VLAN, trunk, MAC), Layer 3 (IP, ruta), pataas. Pinakamasinsin; gamit kapag hindi mo alam kung saan ang problema o may hinala sa hardware.',
        '**Top-down**: simulan sa application (browser, DNS) pababa. Gamit kapag **isang application lang** ang may problema at gumagana ang iba.',
        '**Divide and conquer**: magsimula sa gitna (karaniwang ping sa Layer 3). Kung gumagana, ang problema ay mas mataas (Layer 4–7); kung hindi, mas mababa. Pinakamabilis sa karaniwang kaso at ang ginagawa ng karamihan ng eksperto.',
        'Iba pa: **follow the path** (traceroute), **compare configs** (gumagana laban sa hindi), **swap** (palitan ang kable o port para ihiwalay ang hardware).',
      ],
      steps: [
        'Ilarawan ang sintomas: sino, ano, saan, kailan, may nagbago ba?',
        'Piliin ang approach batay sa sintomas.',
        'Gamitin ang ping ladder para mahanap ang lugar.',
        'Kumuha ng datos gamit ang show commands sa lugar na iyon.',
        'Gumawa ng isang pagbabago, subukan at i-verify.',
        'Idokumento ang sanhi at ang ayos.',
      ],
      tricks: [
        'Magbago ng **isang bagay lang** bawat pagkakataon para alam mo kung ano ang nag-ayos.',
        'Magtanong muna: “ano ang huling nagbago?” Madalas doon ang sanhi.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Ang show-command toolbox (normal vs sira)',
      paragraphs: [
        '**`show ip interface brief`**: Normal: `up/up` na may IP. Sira: `administratively down/down` (nakalimutang no shutdown), `down/down` (cable/ibang dulo), `up/down` (Layer 2: encapsulation, clocking, keepalive).',
        '**`show interfaces`**: hanapin ang **input errors, CRC, runts, giants, collisions** at **duplex/speed**. Ang CRC at late collisions ay madalas senyales ng duplex mismatch o sirang cable.',
        '**`show ip route`** (o `show ip route <ip>`): may ruta ba papunta sa destination? Nasa gateway of last resort ba? **`show vlan brief`** at **`show interfaces trunk`**: nasa tamang VLAN ba ang port at dumadaan ba ang VLAN sa trunk? **`show cdp neighbors`**: sino ang kapitbahay at saang port.',
        '**`show arp`** (IP → MAC) at **`show mac address-table`** (MAC → port): sinusundan ang frame. **`traceroute`**: aling hop ang huling sumagot. **`show running-config | section ...`**: configuration. **`show logging`**: mga mensahe. Babala: ang `debug` ay mabigat; gamitin nang maingat at i-off (`undebug all`).',
      ],
      steps: [
        'show ip interface brief → Layer 1–3 sa isang tingin.',
        'show interfaces <int> → errors at duplex.',
        'show ip route → mayroon bang ruta?',
        'show vlan brief / show interfaces trunk → Layer 2.',
        'show arp / show mac address-table → sundan ang frame.',
        'traceroute → hanapin ang hop na bumibigo.',
      ],
      tricks: [
        'Kapag ang “line protocol is down” at “interface is up”: Layer 2 problem.',
        'Ang `show ip interface brief` ang unang command ng halos lahat ng troubleshooting.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 3: Sundan ang packet',
      paragraphs: [
        'Para sa host sa VLAN 10 na hindi nakakaabot sa remote server: (1) sa PC, `ipconfig` — tama ba ang IP, mask, gateway? (2) Ping gateway. Kung bigo, tingnan ang `show vlan brief` (nasa VLAN 10 ba ang port?), ang trunk, at ang SVI/subinterface ng gateway. (3) Kung abot ang gateway, `traceroute` sa server — ang huling hop na sumagot ay malapit sa problema. (4) Sa router na iyon, `show ip route <server>`: may ruta ba, at may return route ba ang kabilang router?',
        'Tandaan na may dalawang direksyon: ang request ay maaaring dumating pero ang **reply** ay walang ruta pabalik. Kapag “nakarating pero walang sagot”, suriin ang return path.',
      ],
      steps: [
        'Host: ipconfig/ip addr.',
        'Gateway: ping, show vlan, show interfaces trunk.',
        'Path: traceroute at ang huling hop.',
        'Router: show ip route at return route.',
        'Services: ACL, NAT, DNS kung gumagana ang IP.',
      ],
      tricks: [
        'Ang `*` sa traceroute ay timeout (walang sagot) — maaaring ACL o walang ruta.',
        'Ihambing ang gumaganang host at hindi gumaganang host: ang pagkakaiba ang sagot.',
      ],
    },
    {
      type: 'remember',
      title: 'Troubleshooting na lumalabas sa exam',
      items: [
        '**Ping ladder: loopback → sariling IP → gateway → remote IP → pangalan.** **Ang unang bumigo ang lugar ng problema.**',
        '**Approach: bottom-up (Layer 1 pataas), top-down (application pababa), divide and conquer (magsimula sa gitna).**',
        '**administratively down = shutdown; down/down = cable/kabilang dulo; up/down = Layer 2 issue.**',
        '**Duplex mismatch: late collisions at CRC errors.**',
        '**Isang pagbabago bawat pagsubok; idokumento ang ayos.**',
      ],
    },
    { type: 'diagram', id: 'troubleshoot-ladder', caption: 'Mga layer at ang tatlong approach sa troubleshooting.' },
    {
      type: 'terms',
      items: [
        { term: 'Bottom-up', definition: 'Troubleshooting from Layer 1 upward.' },
        { term: 'Top-down', definition: 'Troubleshooting from the application layer downward.' },
        { term: 'Divide and conquer', definition: 'Starting at a middle layer, such as a ping, and moving up or down depending on the result.' },
        { term: 'Ping ladder', definition: 'Pinging loopback, own IP, gateway, remote IP and name in order to locate a fault.' },
        { term: 'traceroute', definition: 'A tool that lists each router hop on the path to a destination.' },
        { term: 'Baseline', definition: 'A record of normal behaviour used for comparison.' },
        { term: 'CRC error', definition: 'A frame check sequence failure that often indicates cabling or duplex problems.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ang proseso',
      steps: [
        'Ilarawan ang sintomas at ang huling nagbago.',
        'Patakbuhin ang ping ladder at hanapin ang unang bumigo.',
        'Kumuha ng datos gamit ang show commands sa lugar na iyon.',
        'Bumuo ng isang hypothesis at gumawa ng isang pagbabago.',
        'I-verify ang resulta at idokumento.',
      ],
    },
    {
      type: 'cli',
      title: 'Normal laban sa sira',
      transcript: `SW1# show ip interface brief
Interface    IP-Address     OK? Method Status                Protocol
Vlan1        192.168.1.2    YES manual up                    up
Fa0/5        unassigned     YES unset  administratively down down
SW1# show interfaces fa0/1
  Full-duplex, 100Mb/s
  0 input errors, 0 CRC, 0 collisions
SW1# show interfaces fa0/2
  Half-duplex, 100Mb/s
  412 input errors, 380 CRC, 57 late collision`,
      copyable: 'show ip interface brief\nshow interfaces fa0/1\nshow interfaces fa0/2',
      explain: [
        { line: 'administratively down down', why: 'The port was shut down by an administrator; the fix is no shutdown.' },
        { line: '0 input errors, 0 CRC, 0 collisions', why: 'A healthy interface shows no errors and full duplex.' },
        { line: '380 CRC, 57 late collision', why: 'Typical duplex mismatch symptoms: errors and late collisions while the link stays up.' },
      ],
      note: 'Compare counters over time; clear counters and recheck to see whether errors are still increasing.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **“up/up”** ay hindi nangangahulugang tama ang lahat: pwedeng may **duplex mismatch** o maling VLAN. Tingnan ang errors at ang configuration.' },
    { type: 'callout', kind: 'trap', text: 'Ang **ping na bumigo** ay hindi laging sira ang ruta: pwedeng **ACL o firewall** ang humaharang sa ICMP. Gamitin din ang traceroute at ang ibang serbisyo.' },
    { type: 'callout', kind: 'tip', text: 'Gumawa ng maliit na talaan: Sintomas → Hinala → Test → Resulta → Ayos. Nagpapabilis ito at nagiging dokumentasyon.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Changing several settings at once.',
        'Skipping the ping ladder and guessing.',
        'Ignoring the error counters on an interface that is up/up.',
        'Assuming a failed ping always means a routing problem.',
        'Not documenting the cause and the fix.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Mabagal na link na may errors',
      scenario: 'Users on one switch port complain of slow file transfers. The port is up/up and pings work, but throughput is poor.',
      evidence: `SW1# show interfaces fa0/2
  Half-duplex, 100Mb/s, media type is 10/100BaseTX
  380 CRC, 57 late collision
Router# show interfaces g0/1 | include duplex
  Full-duplex, 100Mb/s`,
      question: 'Ano ang diagnosis at ano ang ayos?',
      answer: 'A duplex mismatch: the switch port is half-duplex while the far end is full-duplex, which produces CRC errors and late collisions and poor throughput.',
      fix: 'Set both ends to auto-negotiate (or both to the same fixed speed and duplex), clear the counters and confirm that the errors stop increasing.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang PC ay may 192.168.1.20/24, gateway 192.168.1.1. Ping sa 127.0.0.1 ✔, sa 192.168.1.20 ✔, sa 192.168.1.1 ✘. Anong layer at anong show command ang susunod?',
      answer: 'The fault is between the PC and the gateway (Layers 1–3 on the local segment): check the cable and port, show ip interface brief and show vlan brief on the switch, and the router interface state and address.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Use the ping ladder to find the failing zone first.',
        'Know the three approaches and when each is best.',
        'Read the Status and Protocol columns correctly.',
        'CRC and late collisions suggest duplex or cable issues.',
        'Change one thing at a time.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Troubleshoot with a process, not guesses.',
        'Choose bottom-up, top-down or divide and conquer.',
        'The ping ladder finds the failing zone.',
        'Show commands reveal normal versus broken state.',
        'Susunod: mga troubleshooting scenario.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.10', difficulty: 'easy', type: 'single',
    prompt: 'A PC can ping its own IP address but not its default gateway. Which area should be examined first?',
    choices: ['DNS configuration', 'The local segment: cable, switch port, VLAN and gateway interface', 'The remote server', 'The ISP'], correct: [1],
    explanation: 'The failure appears between the PC and the gateway, so check the local segment first.',
    wrong: { 0: 'DNS is tested by name resolution, which comes later.', 2: 'The remote server is beyond the gateway.', 3: 'The ISP is beyond the gateway.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.4', difficulty: 'medium', type: 'single',
    prompt: 'show interfaces reports many CRC errors and late collisions on a port that is up/up. What is the most likely cause?',
    choices: ['Duplex mismatch', 'Wrong VLAN', 'Missing default route', 'DNS failure'], correct: [0],
    explanation: 'CRC errors and late collisions are classic duplex-mismatch symptoms.',
    wrong: { 1: 'A wrong VLAN does not cause CRC errors.', 2: 'Routing does not cause CRC errors.', 3: 'DNS is unrelated to Layer 1/2 errors.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.4', difficulty: 'medium', type: 'single',
    prompt: 'A router interface shows “administratively down / down”. What does this mean?',
    choices: ['The cable is unplugged', 'An administrator shut the interface down', 'The far end is down', 'The interface has no IP address'], correct: [1],
    explanation: 'Administratively down means that the shutdown command is configured; use no shutdown.',
    wrong: { 0: 'That would show down/down without “administratively”.', 2: 'That would show down/down.', 3: 'A missing address does not cause this status.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.10', difficulty: 'hard', type: 'single',
    prompt: 'Which approach starts by pinging a remote address and then moves up or down depending on the result?',
    choices: ['Bottom-up', 'Top-down', 'Divide and conquer', 'Follow the path only'], correct: [2],
    explanation: 'Divide and conquer starts at a middle layer and moves in the direction the result indicates.',
    wrong: { 0: 'Bottom-up starts at Layer 1.', 1: 'Top-down starts at the application.', 3: 'Following the path is a separate technique.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.10', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: you should change several settings at once to fix a fault faster.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'Change one thing at a time so that you know what fixed or worsened the problem.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.10', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO commands help you follow a frame through the network at Layers 2 and 3?',
    choices: ['show mac address-table', 'show arp', 'show version', 'show clock'], correct: [0, 1],
    explanation: 'The MAC address table maps MAC to port and the ARP table maps IP to MAC.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: ping ladder?', back: 'Loopback → Own IP → Gateway → Remote IP → Name. Ang unang bumigo = lugar ng problema.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Bottom-up vs top-down vs divide and conquer?', back: 'Layer 1 up; application down; start in the middle and move up or down.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What does administratively down mean?', back: 'The interface is shut down by configuration.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What do CRC errors with late collisions suggest?', back: 'A duplex mismatch or a faulty cable.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'command', front: 'First command for most faults?', back: 'show ip interface brief.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'command', front: 'Which command follows the path hop by hop?', back: 'traceroute (tracert on Windows).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Golden rule when changing settings?', back: 'Change one thing at a time and verify.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Climb the ping ladder on a broken network',
  tool: 'Packet Tracer',
  minutes: 40,
  objective: 'Use the ping ladder and show commands to find and fix three planted faults.',
  steps: [
    'Build PC – switch – router – server with addresses in two subnets and verify full connectivity.',
    'Have a partner (or yourself, later) introduce fault 1: shut down the router’s LAN interface.',
    'Run the ping ladder, note where it fails and which show command reveals the cause; fix it.',
    'Introduce fault 2: set a wrong default gateway on the PC; repeat the process.',
    'Introduce fault 3: set a duplex mismatch on the switch port; find it from the error counters.',
    'Write a symptom, hypothesis, test, result and fix table for each fault.',
  ],
  checklist: [
    'Ping ladder used for each fault',
    'Correct show command found for each',
    'All faults fixed and verified',
    'Table of symptoms and fixes written',
  ],
  hints: [
    'show ip interface brief reveals shutdown interfaces quickly.',
    'show interfaces shows errors and duplex.',
  ],
  solution: [
    'Fault 1: administratively down, fixed with no shutdown.',
    'Fault 2: gateway outside the PC’s subnet or wrong, fixed in ipconfig.',
    'Fault 3: half versus full duplex, fixed with auto-negotiation on both ends.',
  ],
  breakIt: 'Introduce two faults at once and describe how the ping ladder helps you separate them.',
};
