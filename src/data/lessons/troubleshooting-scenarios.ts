import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'troubleshooting-scenarios';

export const lesson: Lesson = {
  id: ID,
  moduleId: '7.2',
  domain: 'D3',
  title: 'Troubleshooting Scenarios: Six Faults You Will See in the Exam',
  description: 'Work through six realistic faults: wrong gateway, VLAN not on the trunk, OSPF neighbour missing, DHCP relay missing, ACL blocking traffic and NAT not translating.',
  whyMatters:
    'Ito ang pagsasanay na pinagsasama ang lahat ng natutunan mo. Bawat scenario ay may sintomas, ebidensya (output ng show command) at tanong. Subukang sagutin muna bago basahin ang sagot. Ito ang pinakamalapit sa tunay na exam at sa trabaho.',
  objectives: [
    'Diagnose a wrong default gateway from client output',
    'Find a VLAN missing from the allowed list of a trunk',
    'Diagnose an OSPF neighbour failure from mismatched parameters',
    'Diagnose a DHCP failure caused by a missing relay',
    'Diagnose an ACL and a NAT fault with show commands',
  ],
  estimatedMinutes: 50,
  difficulty: 'exam',
  keywords: ['troubleshooting', 'default gateway', 'trunk', 'allowed vlan', 'OSPF', 'hello interval', 'ip helper-address', 'ACL', 'NAT', 'show ip nat translations', 'scenario'],
  examObjectives: ['1.10', '2.1', '3.4', '4.6', '5.6', '4.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Each scenario below follows the same pattern: symptom, evidence, diagnosis, fix. Read the symptom and the evidence, decide which layer is at fault, then check your reasoning against the answer.',
        'The same few faults cause most real and exam problems: wrong address or gateway, VLAN or trunk mistakes, mismatched routing parameters, missing relay or helper, and filtering or translation errors.',
      ],
      taglish: [
        'Bawat scenario ay may parehong pattern: **sintomas → ebidensya → diagnosis → ayos**. Basahin ang sintomas at ebidensya, **tukuyin ang layer na may problema**, saka suriin ang sagot mo.',
        'Iilang sira lang ang nagdudulot ng karamihan ng problema sa totoong buhay at sa exam: **maling address o gateway, VLAN/trunk, hindi magkatugmang routing parameter, kulang na relay, at ACL o NAT error**.',
        'Gamitin ang **ping ladder** at **show commands** mula sa nakaraang lesson. **Subukang sagutin muna** bago buksan ang sagot.',
      ],
      technical: [
        'Troubleshooting questions give a symptom and one or two outputs. Identify the layer from the evidence: client IP configuration (Layer 3 addressing), show vlan brief and show interfaces trunk (Layer 2), show ip ospf neighbor and show ip ospf interface (routing), show ip dhcp binding and the interface configuration (services), show access-lists and show ip interface (filtering), and show ip nat translations and statistics (translation).',
        'The answer is almost always a single misconfiguration visible in the evidence: a gateway outside the subnet, a VLAN missing from the trunk’s allowed list, a hello or dead interval or area mismatch, a missing ip helper-address, an ACL applied in the wrong direction or interface, or inside and outside swapped for NAT.',
      ],
    },
    {
      type: 'analogy',
      title: 'Imbestigasyon',
      body: [
        'Each scenario is a small investigation: the symptom is the report, the show command is the evidence, and the misconfiguration is the culprit. A detective works from evidence, not hunches.',
      ],
      taglish: [
        'Bawat scenario ay **maliit na imbestigasyon**: ang **sintomas** ang ulat, ang **show command** ang ebidensya, at ang **misconfiguration** ang salarin. Ang detective ay gumagana batay sa **ebidensya**, hindi hinala.',
      ],
    },
    {
      type: 'hook',
      title: 'SEDA',
      trick: '**SEDA = Sintomas, Ebidensya, Diagnosis, Ayos. Isang sanhi lang ang hanapin, nasa ebidensya.**',
      taglish: [
        '**S**intomas: ano ang hindi gumagana at kanino?',
        '**E**bidensya: aling show command ang magpapatunay?',
        '**D**iagnosis: aling layer at aling setting?',
        '**A**yos: isang pagbabago at i-verify.',
      ],
      test: {
        question: 'Ano ang unang gagawin mo kapag may ulat na “hindi makapag-internet ang isang PC”?',
        answer: 'Ping ladder mula sa PC: loopback, sariling IP, gateway, remote IP, pangalan; saka ipakita ang ipconfig at ang show command sa lugar ng unang bigo.',
      },
    },
    {
      type: 'troubleshoot',
      title: 'Scenario 1: Hindi maabot ang gateway',
      scenario: 'A new PC cannot reach anything outside its network. It can ping its own address but not the gateway. The router interface is 192.168.1.1/24.',
      evidence: `C:\\> ipconfig
   IPv4 Address. . . . . : 192.168.10.20
   Subnet Mask . . . . . : 255.255.255.0
   Default Gateway . . . : 192.168.1.1`,
      question: 'Ano ang mali?',
      answer: 'The PC address (192.168.10.20/24) and its gateway (192.168.1.1) are in different subnets. The PC treats the gateway as unreachable.',
      fix: 'Give the PC an address in 192.168.1.0/24 (for example 192.168.1.20) or the correct gateway for its subnet; verify with ipconfig and ping the gateway.',
    },
    {
      type: 'troubleshoot',
      title: 'Scenario 2: Hindi nagkakausap ang VLAN 20 sa dalawang switch',
      scenario: 'PC1 and PC2 are both in VLAN 20 but on different switches. They cannot ping each other. Hosts in VLAN 10 across the same link work.',
      evidence: `SW1# show interfaces trunk
Port   Vlans allowed on trunk
Gi0/1  10,30
SW1# show vlan brief
20  USERS  active  Fa0/5`,
      question: 'Bakit pumapalya ang VLAN 20?',
      answer: 'The trunk Gi0/1 allows only VLANs 10 and 30. VLAN 20 is not in the allowed list, so its frames never cross the link.',
      fix: 'On both ends: switchport trunk allowed vlan add 20. Verify with show interfaces trunk and ping again.',
    },
    {
      type: 'troubleshoot',
      title: 'Scenario 3: Walang OSPF neighbour',
      scenario: 'R1 and R2 are directly connected and both have network statements in area 0, but show ip ospf neighbor is empty on both.',
      evidence: `R1# show ip ospf interface g0/0
  Hello 10, Dead 40, Area 0
R2# show ip ospf interface g0/0
  Hello 5, Dead 20, Area 0`,
      question: 'Ano ang pumipigil sa adjacency?',
      answer: 'Hello and dead intervals do not match (10/40 on R1 and 5/20 on R2). OSPF neighbours must agree on timers.',
      fix: 'Make both routers use the same timers (for example remove ip ospf hello-interval 5 on R2 or set both to 10/40). Verify that the state reaches FULL.',
    },
    {
      type: 'troubleshoot',
      title: 'Scenario 4: Walang IP ang mga PC sa remote VLAN',
      scenario: 'PCs in VLAN 20 receive 169.254.x.x addresses. The DHCP server (10.0.0.5) is behind the router. VLAN 10 clients work.',
      evidence: `R1# show running-config interface g0/1.10 | include helper
 ip helper-address 10.0.0.5
R1# show running-config interface g0/1.20 | include helper
R1#`,
      question: 'Ano ang kulang?',
      answer: 'The VLAN 20 subinterface has no ip helper-address, so DHCP broadcasts are not forwarded to the server.',
      fix: 'Add ip helper-address 10.0.0.5 to g0/1.20 and make sure the server has a pool for the VLAN 20 subnet; renew a client.',
    },
    {
      type: 'troubleshoot',
      title: 'Scenario 5: Hinaharang ng ACL ang web',
      scenario: 'Guests should be blocked from the web but staff must keep access. Now nobody can browse. The ACL is applied inbound on the LAN interface.',
      evidence: `R1# show access-lists
Extended IP access list WEB-FILTER
    10 deny tcp any any eq 80 (1204 matches)
    20 permit ip 10.1.10.0 0.0.0.255 any (0 matches)`,
      question: 'Ano ang problema sa ACL?',
      answer: 'The deny line for all web traffic is first, so it matches everyone before the staff permit is reached (first match wins). The permit line has 0 matches.',
      fix: 'Reorder so that the specific permit for the staff subnet comes first (or deny only the guest subnet), then end with permit ip any any; verify the counters.',
    },
    {
      type: 'troubleshoot',
      title: 'Scenario 6: Walang NAT translation',
      scenario: 'Inside hosts can reach the router but nothing reaches the internet. show ip nat translations is empty.',
      evidence: `R1# show ip nat statistics
Outside interfaces: GigabitEthernet0/0
Inside interfaces: GigabitEthernet0/1
Hits: 0  Misses: 56
R1# show ip interface brief
Gi0/0   192.168.1.1   up   up   (LAN)
Gi0/1   203.0.113.2   up   up   (ISP)`,
      question: 'Ano ang mali?',
      answer: 'Inside and outside are swapped: Gi0/0 (LAN) is marked outside and Gi0/1 (ISP) is marked inside, so inside traffic never matches the NAT rule.',
      fix: 'Set ip nat inside on the LAN interface Gi0/0 and ip nat outside on the ISP interface Gi0/1; clear ip nat translation * and check that hits increase.',
    },
    {
      type: 'remember',
      title: 'Mga sira na paulit-ulit sa exam',
      items: [
        '**Gateway na wala sa subnet ng host = hindi makalabas sa network.**',
        '**VLAN na wala sa allowed list ng trunk = hindi tumatawid; ayos: allowed vlan add.**',
        '**OSPF: dapat magtugma ang hello/dead, area at subnet; magkakaiba ang router ID.**',
        '**169.254 sa isang VLAN lang = kulang ang ip helper-address sa interface ng VLAN na iyon.**',
        '**ACL: ang unang tugma ang panalo; tingnan ang hit counters. NAT: ayusin ang inside/outside.**',
      ],
    },
    { type: 'diagram', id: 'troubleshoot-ladder', caption: 'Gamitin ang mga layer para hanapin ang lugar ng bawat scenario.' },
    {
      type: 'terms',
      items: [
        { term: 'Symptom', definition: 'What the user or monitoring reports as not working.' },
        { term: 'Evidence', definition: 'Command output or configuration that supports or rejects a hypothesis.' },
        { term: 'Root cause', definition: 'The single underlying misconfiguration or failure that produces the symptom.' },
        { term: 'Allowed VLAN list', definition: 'The VLANs permitted on a trunk.' },
        { term: 'Hello and dead interval', definition: 'OSPF timers that must match between neighbours.' },
        { term: 'ip helper-address', definition: 'Command that relays DHCP broadcasts to a remote server.' },
        { term: 'Inside and outside', definition: 'NAT interface roles; both must be assigned correctly.' },
      ],
    },
    {
      type: 'flow',
      title: 'SEDA sa bawat scenario',
      steps: [
        'Sintomas: sino at ano ang apektado.',
        'Ebidensya: piliin ang tamang show command.',
        'Diagnosis: tukuyin ang layer at ang setting.',
        'Ayos: isang pagbabago.',
        'I-verify gamit ang parehong show command.',
      ],
    },
    {
      type: 'cli',
      title: 'Mabilis na tsek bawat uri ng problema',
      transcript: `show interfaces trunk              (VLAN sa trunk)
show ip ospf neighbor              (OSPF adjacency)
show ip dhcp binding               (DHCP lease)
show access-lists                  (ACL matches)
show ip nat translations           (NAT table)`,
      copyable: 'show interfaces trunk\nshow ip ospf neighbor\nshow ip dhcp binding\nshow access-lists\nshow ip nat translations',
      explain: [
        { line: 'show interfaces trunk', why: 'Shows mode, native VLAN and the allowed and active VLAN lists of every trunk.' },
        { line: 'show ip ospf neighbor', why: 'Lists neighbours and their state; an empty table or a state stuck before FULL signals a mismatch.' },
        { line: 'show access-lists', why: 'Shows each ACL line with hit counters, which prove which rule is matching.' },
      ],
      note: 'Pick the show command that matches the symptom; do not run everything.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **sintomas ay hindi ang sanhi**. Ang “hindi makapag-internet” ay maaaring gateway, DNS, NAT o ACL. Gamitin ang ebidensya.' },
    { type: 'callout', kind: 'trap', text: 'Sa ACL, **ang pagkakasunod ang problema** sa maraming tanong: ang unang tugma ang panalo.' },
    { type: 'callout', kind: 'tip', text: 'Bago basahin ang sagot, isulat ang sarili mong diagnosis at command ng pag-verify. Iyan ang tunay na pagsasanay.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Jumping to a fix before reading the evidence.',
        'Fixing one end of a mismatch and forgetting the other end.',
        'Ignoring hit counters on ACLs.',
        'Forgetting the return path, relay or inside/outside assignment.',
        'Not verifying after the fix.',
      ],
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang PC ay may tamang IP at gateway. Ping sa gateway ✔, sa 8.8.8.8 ✔, pero hindi bumubukas ang www.example.com. Anong layer at anong command ang susunod?',
      answer: 'The IP path works, so the fault is name resolution (DNS): run nslookup www.example.com and check the DNS server address in ipconfig /all (or the DHCP scope) and that UDP 53 is allowed.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Identify the layer from the evidence before choosing a fix.',
        'Mismatches (timers, trunk lists, native VLANs) are the usual cause.',
        'A missing relay produces 169.254 addresses on the remote VLAN.',
        'ACL order and direction matter; check the counters.',
        'NAT needs inside and outside set correctly.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Follow Sintomas, Ebidensya, Diagnosis, Ayos.',
        'Match the show command to the symptom.',
        'Most faults are single misconfigurations.',
        'Verify after fixing.',
        'Gamitin ang mga practice exam para sa mas maraming scenario.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.10', difficulty: 'medium', type: 'single',
    prompt: 'A PC with 192.168.10.20/24 has the default gateway 192.168.1.1. What is wrong?',
    choices: ['The gateway is in a different subnet than the host', 'The mask is too long', 'DNS is missing', 'The PC needs a static route'], correct: [0],
    explanation: 'The host and the gateway are in different subnets, so the host cannot reach the gateway.',
    wrong: { 1: 'A /24 mask is normal here.', 2: 'DNS does not affect gateway reachability.', 3: 'A host uses its default gateway, not a static route.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'A trunk allows VLANs 10 and 30. Hosts in VLAN 20 on different switches cannot communicate. What is the fix?',
    choices: ['switchport trunk allowed vlan add 20', 'switchport trunk allowed vlan 20', 'no switchport', 'spanning-tree portfast'], correct: [0],
    explanation: 'Add VLAN 20 to the allowed list without replacing the existing list.',
    wrong: { 1: 'That would replace the list and remove VLANs 10 and 30.', 2: 'That makes the port a routed port.', 3: 'PortFast is unrelated.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'single',
    prompt: 'Two directly connected routers show no OSPF neighbours. One has hello 10 and dead 40; the other has hello 5 and dead 20. What is the cause?',
    choices: ['Timer mismatch', 'Different process IDs', 'Different router IDs', 'An ACL on the link'], correct: [0],
    explanation: 'OSPF neighbours must have matching hello and dead intervals.',
    wrong: { 1: 'Process IDs are only locally significant.', 2: 'Router IDs must be different anyway.', 3: 'Nothing in the evidence suggests an ACL.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'medium', type: 'single',
    prompt: 'Clients in one VLAN get 169.254.x.x addresses while another VLAN on the same router works. The server is on another network. What is missing?',
    choices: ['ip helper-address on that VLAN’s interface', 'ip routing', 'A second DHCP pool on the router only', 'A trunk native VLAN'], correct: [0],
    explanation: 'The relay is configured per client-facing interface; the failing VLAN lacks it.',
    wrong: { 1: 'Routing is working for the other VLAN.', 2: 'The server needs a pool; the missing piece is the relay.', 3: 'The native VLAN is not the cause.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'hard', type: 'single',
    prompt: 'An ACL has “10 deny tcp any any eq 80” followed by “20 permit ip 10.1.10.0 0.0.0.255 any”. Staff in 10.1.10.0/24 cannot browse. Why?',
    choices: ['Line 10 matches staff web traffic first', 'Line 20 is syntactically invalid', 'The ACL is applied to the wrong router', 'Staff need an implicit permit'], correct: [0],
    explanation: 'The first matching line wins; line 10 denies all web traffic before the staff permit is reached.',
    wrong: { 1: 'The syntax is valid.', 2: 'Hit counters show it is matching.', 3: 'The implicit rule is a deny.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'hard', type: 'single',
    prompt: 'show ip nat statistics shows the LAN interface as outside and the ISP interface as inside, with many misses. What is the fix?',
    choices: ['Swap ip nat inside and ip nat outside on the interfaces', 'Add more addresses to the pool', 'Enable OSPF', 'Change the NAT ACL to deny'], correct: [0],
    explanation: 'The inside and outside roles are swapped, so traffic never matches the translation rule.',
    wrong: { 1: 'The problem is not pool size.', 2: 'OSPF does not affect NAT roles.', 3: 'A deny entry would translate nothing.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.10', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a symptom such as “no internet” points to a single cause.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'Several faults can cause the same symptom; use evidence to identify the actual cause.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D3', objective: '3.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO values must match for two OSPF routers to become neighbours on a link?',
    choices: ['Hello and dead intervals', 'Area ID', 'Router ID', 'Hostname'], correct: [0, 1],
    explanation: 'Timers and area ID must match; router IDs must be unique and hostnames do not matter.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: SEDA?', back: 'Sintomas, Ebidensya, Diagnosis, Ayos. Isang sanhi lang ang hanapin, nasa ebidensya.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Gateway in a different subnet than the host?', back: 'The host cannot reach the gateway and cannot leave its network.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'command', front: 'Add a VLAN to a trunk safely?', back: 'switchport trunk allowed vlan add <id>.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'concept', front: 'OSPF neighbours with timer mismatch?', back: 'No adjacency; hello and dead intervals must match.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'concept', front: '169.254 only on one VLAN?', back: 'That VLAN’s interface is missing ip helper-address (or the server lacks its pool).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'concept', front: 'ACL denies the wrong people?', back: 'Check line order and the hit counters; first match wins.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D4', category: 'concept', front: 'NAT misses with no translations?', back: 'Inside and outside interfaces are wrong or missing.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Break it and fix it: six faults',
  tool: 'Packet Tracer',
  minutes: 60,
  objective: 'Build a working network, introduce each of the six scenario faults one at a time and fix them using only show commands.',
  steps: [
    'Build a two-switch, two-router network with VLANs 10 and 20, OSPF between the routers, DHCP via relay, an ACL and NAT to an ISP router; verify that everything works.',
    'Fault 1: set a PC gateway outside its subnet. Diagnose and fix.',
    'Fault 2: remove VLAN 20 from the trunk’s allowed list. Diagnose and fix.',
    'Fault 3: change the OSPF hello interval on one router. Diagnose and fix.',
    'Fault 4: remove the ip helper-address on one VLAN. Diagnose and fix.',
    'Fault 5: put a broad deny above a permit in the ACL, then fix the order.',
    'Fault 6: swap ip nat inside and outside. Diagnose and fix.',
    'Record the symptom, evidence, diagnosis and fix for each fault.',
  ],
  checklist: [
    'All six faults introduced and repaired',
    'Each fault found with a show command',
    'Network fully working at the end',
    'Fault log completed',
  ],
  hints: [
    'Use the ping ladder first, then the show command for the failing layer.',
    'Fix one fault before introducing the next.',
  ],
  solution: [
    'Gateway: correct address. Trunk: allowed vlan add 20. OSPF: matching timers.',
    'DHCP: ip helper-address on the VLAN interface. ACL: specific permit first.',
    'NAT: ip nat inside on the LAN and outside on the ISP link.',
  ],
  breakIt: 'Introduce two of the faults together and describe the order in which you would find them.',
};
