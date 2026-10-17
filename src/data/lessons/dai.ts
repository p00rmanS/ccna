import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'dai';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.10',
  domain: 'D5',
  title: 'Dynamic ARP Inspection: Stopping ARP Spoofing',
  description: 'How ARP poisoning enables man-in-the-middle attacks and how DAI validates ARP packets against the DHCP snooping binding table.',
  whyMatters:
    'Ang ARP ay walang authentication: kahit sino ay puwedeng magsabing "ako ang gateway". Ginagamit ito ng mga attacker para ma-hijack ang trapiko sa LAN. Ang Dynamic ARP Inspection ay ang depensa sa switch, at umaasa ito sa DHCP snooping — kaya madalas silang tinatanong nang magkasama sa exam.',
  objectives: [
    'Explain how ARP works and why ARP spoofing (poisoning) succeeds',
    'Describe how Dynamic ARP Inspection validates ARP packets using the binding table',
    'Enable DAI with ip arp inspection vlan and trust uplinks with ip arp inspection trust',
    'Use ARP access lists for hosts with static addresses',
    'Apply rate limiting and read show ip arp inspection output',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['DAI', 'ARP spoofing', 'ARP poisoning', 'ip arp inspection', 'ip arp inspection trust', 'binding table', 'gratuitous ARP', 'man-in-the-middle', 'validate', 'rate limit'],
  examObjectives: ['5.7'],
  sections: [
    {
      type: 'explain',
      simple: [
        'ARP maps an IP address to a MAC address, but it trusts anyone. An attacker can send fake ARP replies saying "the gateway 192.168.1.1 is at MY MAC address". Victims update their tables and send traffic to the attacker, who reads it and passes it on. This is ARP spoofing and gives a man-in-the-middle position.',
        'Dynamic ARP Inspection (DAI) checks every ARP packet on untrusted ports against the DHCP snooping binding table, which lists the real IP-to-MAC pairs. If the claim does not match, the packet is dropped.',
      ],
      taglish: [
        'Ang **ARP** ay **nagma-map ng IP papuntang MAC**, pero **nagtitiwala sa kahit sino**. Puwedeng magpadala ang attacker ng **pekeng ARP reply**: **"ang gateway 192.168.1.1 ay nasa MAC KO"**. **Ina-update ng biktima ang table nila** at **ipinapadala ang trapiko sa attacker**, na **nagbabasa at nagpapasa nito**. Iyan ang **ARP spoofing** at nagbibigay ng **man-in-the-middle**.',
        'Ang **Dynamic ARP Inspection (DAI)** ay **sinusuri ang bawat ARP packet sa untrusted ports** laban sa **DHCP snooping binding table**, na nagtatala ng **tunay na pares ng IP at MAC**. Kapag **hindi tugma ang sinasabi**, **ibinabagsak** ang packet.',
        '**Umaasa ang DAI sa DHCP snooping** para sa binding table. Para sa mga host na **static ang address**, gagamit ka ng **ARP access list**.',
        'Tulad ng snooping: **trusted ang uplinks**, **untrusted ang user ports**.',
      ],
      technical: [
        'ARP has no authentication. Gratuitous or unsolicited ARP replies are accepted and overwrite cache entries, so an attacker can poison the caches of a host and its gateway and relay traffic between them (man-in-the-middle) or black-hole it.',
        'DAI intercepts ARP requests and replies on untrusted ports in the VLANs where it is enabled. It validates the sender IP and sender MAC in the ARP packet against the DHCP snooping binding table (or a configured ARP ACL). Packets with invalid bindings are dropped and logged; valid ones are forwarded. ARP packets on trusted ports are not inspected.',
        'Configuration: ip dhcp snooping (and its VLANs) must be enabled first so the binding table exists; ip arp inspection vlan <list>; ip arp inspection trust on uplinks and ports toward other switches or routers. For static hosts: arp access-list NAME, permit ip host <ip> mac host <mac>, and ip arp inspection filter NAME vlan <list>.',
        'Optional validation: ip arp inspection validate src-mac dst-mac ip checks that the Ethernet source MAC matches the ARP sender MAC, the destination MAC matches the target MAC in replies, and that IP addresses are valid. Rate limiting: ip arp inspection limit rate <pps> (default 15 pps on untrusted ports); exceeding it puts the port in err-disabled.',
        'Verification: show ip arp inspection (per VLAN status and forwarded/dropped counts), show ip arp inspection interfaces (trust and rate limit), show ip arp inspection statistics, and show ip dhcp snooping binding (the source of truth). Logs show DAI drops such as %SW_DAI-4-DHCP_SNOOPING_DENY.',
      ],
    },
    {
      type: 'analogy',
      title: 'Pekeng pahayag sa palengke',
      body: [
        'Someone shouts in the market "I am the cashier, give me your money." Because everyone believes any announcement, they pay the impostor. DAI is a manager who checks every announcement against the official staff list before letting people act on it.',
      ],
      taglish: [
        'May sumigaw sa palengke na **"Ako ang kahera, ibigay ang pera niyo!"** Dahil **naniniwala ang lahat sa kahit anong pahayag**, **binayaran ang impostor**. Ang **DAI ay manager** na **sinusuri ang bawat pahayag laban sa opisyal na listahan ng staff** bago payagang kumilos ang mga tao.',
      ],
    },
    {
      type: 'hook',
      title: 'DAI = ARP + DHCP snooping table',
      trick: '**DAI** sinusuri ang **ARP** gamit ang **DHCP snooping binding table**. **Trusted** = uplinks; **untrusted** = users. Kailangan **muna ang snooping**.',
      taglish: [
        '**DAI** = **ARP checker** na gumagamit ng **binding table ng DHCP snooping**.',
        '**Kailangan muna ang DHCP snooping** — walang table, walang batayan.',
        '**Trusted** = uplinks; **untrusted** = user ports. **ip arp inspection vlan N** at **ip arp inspection trust**.',
        'Mga **static host**: **ARP ACL**. Mga **limit rate** ay default 15 pps.',
      ],
      test: {
        question: 'Nag-enable ka ng ip arp inspection vlan 10 pero walang gumagana na PC. Ano ang posibleng kulang?',
        answer: 'Walang DHCP snooping binding table (walang snooping o hindi nag-renew ang mga PC), kaya lahat ng ARP ay nabibigong ma-validate. Kailangan ding i-trust ang uplink gamit ang ip arp inspection trust.',
      },
    },
    { type: 'diagram', id: 'dai-check', caption: 'Sinusuri ng DAI ang sender IP/MAC ng ARP laban sa binding table; bagsak ang hindi tugma.' },
    {
      type: 'terms',
      items: [
        { term: 'ARP spoofing', definition: 'Sending forged ARP replies to poison caches and redirect traffic (poisoning).' },
        { term: 'DAI', definition: 'Dynamic ARP Inspection: validates ARP packets on untrusted ports against the binding table.' },
        { term: 'Binding table', definition: 'DHCP snooping database of MAC, IP, VLAN and port used as the source of truth.' },
        { term: 'ARP ACL', definition: 'An access list of IP-to-MAC pairs for hosts that do not use DHCP.' },
        { term: 'Trusted port', definition: 'A port whose ARP packets are not inspected: uplinks and routers.' },
        { term: 'Gratuitous ARP', definition: 'An unsolicited ARP announcement, accepted by hosts and abused by attackers.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: naharang ang ARP spoofing',
      steps: [
        'Nasa binding table ang gateway at mga client: PC1 192.168.10.25 = MAC A, nasa Fa0/2.',
        'Nagpadala ang attacker sa Fa0/9 ng ARP reply: "192.168.10.1 ay nasa MAC X".',
        'Natanggap ng switch ang ARP sa untrusted na Fa0/9 at tiningnan ang binding table.',
        'Walang binding ang MAC X para sa 192.168.10.1 kaya hindi valid.',
        'Ibinagsak ng switch ang packet at nag-log ng DAI violation.',
        'Hindi nabago ang ARP table ng PC1, kaya hindi nakuha ng attacker ang trapiko.',
      ],
    },
    {
      type: 'cli',
      title: 'I-enable ang DAI (pagkatapos ng DHCP snooping)',
      transcript: `SW1(config)# ip dhcp snooping
SW1(config)# ip dhcp snooping vlan 10
SW1(config)# interface gi0/1
SW1(config-if)# ip dhcp snooping trust
SW1(config-if)# ip arp inspection trust
SW1(config-if)# exit
SW1(config)# ip arp inspection vlan 10
SW1(config)# ip arp inspection validate src-mac dst-mac ip
SW1(config)# interface fa0/2
SW1(config-if)# ip arp inspection limit rate 15
SW1(config-if)# end
SW1# show ip arp inspection vlan 10
Vlan  Configuration  Operation  ACL Match  Static ACL
10    Enabled        Active
Vlan  Forwarded  Dropped  DHCP Drops  ACL Drops
10    1204       37       37          0`,
      copyable: 'ip arp inspection vlan 10',
      explain: [
        { line: 'ip arp inspection vlan 10', why: 'Turns DAI on for VLAN 10; ARP on untrusted ports is now validated.' },
        { line: 'ip arp inspection trust (Gi0/1)', why: 'Exempts the uplink from inspection so legitimate ARP from other switches and the router passes.' },
        { line: 'validate src-mac dst-mac ip', why: 'Adds extra checks that MAC and IP fields in the ARP packet are consistent and valid.' },
        { line: 'limit rate 15', why: 'Caps ARP packets per second on the port to limit floods; excess err-disables the port.' },
        { line: 'DHCP Drops 37', why: 'ARP packets dropped because they did not match the DHCP snooping binding table.' },
      ],
      note: 'Sample output for study.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show ip arp inspection vlan 10', shows: 'Whether DAI is active on the VLAN and the forwarded and dropped counts.' },
        { command: 'show ip arp inspection interfaces', shows: 'Trust state and rate limit of each port.' },
        { command: 'show ip dhcp snooping binding', shows: 'The bindings DAI uses as the source of truth.' },
        { command: 'show logging | include DAI', shows: 'Log entries for dropped ARP packets.' },
      ],
      good: 'DAI active, uplinks trusted, and drops appear only for spoofed ARP.',
      bad: 'Legitimate hosts dropped (empty binding table or an untrusted uplink).',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **DAI ay umaasa sa DHCP snooping binding table**. Kung **hindi naka-enable ang snooping** (o ang mga host ay may **static IP** na wala sa table), **lahat ng ARP nila ay mabibigo** — kailangan ng **ARP ACL** para sa mga static host.' },
    { type: 'callout', kind: 'trap', text: 'Ang **uplinks ay dapat trusted sa DAI at sa snooping — dalawang magkaibang command**: **ip arp inspection trust** at **ip dhcp snooping trust**. Madalas nakakalimutan ang isa.' },
    { type: 'callout', kind: 'tip', text: 'Kapag **err-disabled ang port dahil sa DAI rate limit**, tulad ng ibang protection: **shutdown / no shutdown**. Ang **default ay 15 pps** sa untrusted port.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pag-enable ng DAI na walang DHCP snooping.',
        'Hindi pag-trust sa uplink gamit ang ip arp inspection trust.',
        'Pagkalimot sa ARP ACL para sa static hosts.',
        'Pagkalito sa ip dhcp snooping trust at ip arp inspection trust.',
        'Mababang rate limit na nagse-shutdown ng port.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Nawalan ng network ang printer pagkatapos i-enable ang DAI"',
      scenario: 'DAI was enabled on VLAN 10. All DHCP clients work, but the printer with a static IP of 192.168.10.50 cannot be reached.',
      evidence: `SW1# show ip arp inspection vlan 10
Vlan  Forwarded  Dropped  DHCP Drops  ACL Drops
10    4210       96       96          0
SW1# show ip dhcp snooping binding | include 192.168.10.50
(no output)`,
      question: 'Bakit nabibigo ang printer?',
      answer: 'Static IP ang printer, kaya wala sa DHCP snooping binding table. Ibinabagsak ng DAI ang ARP nito (DHCP Drops tumataas).',
      fix: 'Gumawa ng ARP ACL: arp access-list STATIC-HOSTS → permit ip host 192.168.10.50 mac host <printer MAC>, at ip arp inspection filter STATIC-HOSTS vlan 10. Pagkatapos ay i-verify na bumaba ang drops.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ilista ang minimum na pagkakasunod ng configuration para ma-protektahan ang VLAN 20 mula sa ARP spoofing sa isang access switch na may uplink sa Gi0/1.',
      answer: '1) ip dhcp snooping, 2) ip dhcp snooping vlan 20, 3) sa Gi0/1: ip dhcp snooping trust at ip arp inspection trust, 4) ip arp inspection vlan 20. Mag-renew ang mga client para mabuo ang binding table.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'DAI validates ARP against the DHCP snooping binding table.',
        'Enable DHCP snooping first; then ip arp inspection vlan <list>.',
        'Trust uplinks with ip arp inspection trust; user ports stay untrusted.',
        'Static hosts need an ARP ACL; default rate limit is 15 pps on untrusted ports.',
        'DAI defends against ARP spoofing / poisoning and man-in-the-middle.',
      ],
    },
    {
      type: 'summary',
      points: [
        'ARP has no authentication, so attackers can poison caches.',
        'DAI drops ARP packets whose IP-MAC pair is not in the binding table.',
        'It depends on DHCP snooping; trust uplinks.',
        'Use ARP ACLs for static hosts and rate limits to stop floods.',
        'Susunod sa roadmap: AAA — authentication, authorization at accounting.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'easy', type: 'single',
    prompt: 'What attack does Dynamic ARP Inspection mitigate?',
    choices: ['ARP spoofing / poisoning', 'DHCP starvation', 'MAC flooding only', 'Port scanning'], correct: [0],
    explanation: 'DAI drops forged ARP packets, preventing ARP poisoning.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'What does DAI use to validate ARP packets?',
    choices: ['The routing table', 'The DHCP snooping binding table', 'The CAM table only', 'The VLAN database'], correct: [1],
    explanation: 'DAI checks the sender IP and MAC against the DHCP snooping binding table (or an ARP ACL).',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'Which command enables DAI for VLAN 10?',
    choices: ['ip arp inspection vlan 10', 'ip dhcp snooping vlan 10', 'arp inspection enable', 'ip arp vlan 10'], correct: [0],
    explanation: 'ip arp inspection vlan <list> enables DAI on those VLANs.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'Which command exempts an uplink from ARP inspection?',
    choices: ['ip arp inspection trust', 'ip dhcp snooping trust', 'ip arp trust', 'no ip arp inspection'], correct: [0],
    explanation: 'ip arp inspection trust marks the port as trusted for DAI.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'hard', type: 'single',
    prompt: 'A host with a static IP loses connectivity after DAI is enabled. What is the best fix?',
    choices: ['Disable DAI', 'Create an ARP ACL for the host and apply it to the VLAN', 'Trust all user ports', 'Change the VLAN'], correct: [1],
    explanation: 'Static hosts are not in the binding table; an ARP ACL provides their IP-to-MAC mapping.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'Which feature must be enabled first so DAI has data to check?',
    choices: ['Port security', 'DHCP snooping', 'PortFast', 'EtherChannel'], correct: [1],
    explanation: 'DHCP snooping builds the binding table that DAI relies on.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'What is the default ARP rate limit on an untrusted DAI port?',
    choices: ['5 pps', '15 pps', '100 pps', 'Unlimited'], correct: [1],
    explanation: 'Untrusted ports default to 15 ARP packets per second; exceeding it err-disables the port.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are true about DAI?',
    choices: ['It uses the DHCP snooping binding table', 'It inspects ARP on trusted ports', 'Untrusted ports are inspected', 'It replaces ARP with DNS'], correct: [0, 2],
    explanation: 'DAI inspects ARP on untrusted ports using the binding table; trusted ports are not inspected.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: ARP has built-in authentication that prevents spoofing.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — ARP is unauthenticated, which is why DAI is needed.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: paano tandaan ang DAI?', back: 'DAI = ARP checker gamit ang DHCP snooping binding table. Kailangan muna ang snooping. Trusted = uplinks; untrusted = users. Static hosts = ARP ACL.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What is ARP spoofing?', back: 'Forged ARP replies that poison caches to redirect traffic through the attacker (man-in-the-middle).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'How does DAI work?', back: 'Validates ARP sender IP/MAC on untrusted ports against the DHCP snooping binding table; drops invalid packets.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'command', front: 'Enable DAI?', back: 'ip arp inspection vlan <list>; uplinks: ip arp inspection trust (after DHCP snooping).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'concept', front: 'DAI for static hosts?', back: 'Use an ARP access list: arp access-list NAME → permit ip host <ip> mac host <mac>; ip arp inspection filter NAME vlan <n>.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'command', front: 'Verify DAI?', back: 'show ip arp inspection vlan <n>, show ip arp inspection interfaces, show ip dhcp snooping binding' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Enable DAI and handle a static host',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Enable DHCP snooping and DAI, confirm clients work, then add an ARP ACL for a static host.',
  topology: 'SW1 with uplink Gi0/1 to the router/DHCP server, DHCP clients on Fa0/2-3 and a static-IP printer on Fa0/10 (VLAN 10).',
  steps: [
    'Enable ip dhcp snooping on VLAN 10 and trust Gi0/1; renew clients and check the binding table.',
    'Enable ip arp inspection vlan 10 and trust Gi0/1 for DAI.',
    'Confirm DHCP clients still ping the gateway; check show ip arp inspection vlan 10.',
    'Note that the static printer is dropped (not in the binding table).',
    'Create an ARP ACL for the printer and apply it with ip arp inspection filter.',
    'Confirm the printer works and the drops stop increasing.',
  ],
  checklist: [
    'DAI active on VLAN 10',
    'DHCP clients unaffected',
    'Printer fixed with an ARP ACL',
  ],
  hints: [
    'Build the DHCP snooping binding table first by renewing clients.',
    'Trust the uplink for both DHCP snooping and DAI.',
  ],
  solution: [
    'DAI validates ARP against the binding table; DHCP clients are present, the printer is not.',
    'arp access-list STATIC-HOSTS permit ip host 192.168.10.50 mac host <printer MAC> plus ip arp inspection filter fixes it.',
  ],
  breakIt: 'Remove ip arp inspection trust from Gi0/1 and watch ARP from the router get dropped.',
};
