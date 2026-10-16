import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'pat-overload';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.6',
  domain: 'D4',
  title: 'PAT (NAT Overload): Many Hosts, One Address',
  description: 'How port numbers let hundreds of private hosts share a single public IP address, and how to configure and verify it.',
  whyMatters:
    'Ito ang NAT na ginagamit ng bawat home router at halos lahat ng opisina: isang public address lang para sa lahat ng device. Kailangan mong maintindihan kung paano nakikilala ng router kung kaninong sagot ang dumating — sa pamamagitan ng port number. Ito ang pinakamadalas na NAT configuration at tanong sa exam.',
  objectives: [
    'Explain how PAT uses port numbers to tell translations apart',
    'Configure PAT on an interface address using the overload keyword',
    'Configure PAT using a pool with overload',
    'Read inside global addresses that include port numbers',
    'Compare static NAT, dynamic NAT and PAT',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['PAT', 'overload', 'NAT overload', 'port translation', 'ip nat inside source list interface overload', 'show ip nat translations'],
  examObjectives: ['4.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Dynamic NAT runs out of addresses quickly because each host needs its own. PAT fixes that by letting many hosts share one public address. The router tells them apart by giving each connection a different source port number.',
        'It is the NAT used by every home router: all your phones and laptops appear to the internet as one address.',
      ],
      taglish: [
        'Mabilis maubos ang address sa dynamic NAT dahil **bawat host ay may sariling address**. Ang **PAT** ang solusyon: **maraming host, isang public address**. Paano nalalaman ng router kung kaninong sagot? Gamit ang **port number**.',
        'Halimbawa, ang PC1 at PC2 ay parehong lumalabas bilang **203.0.113.5**, pero **PC1 = port 1024**, **PC2 = port 1025**. Kapag bumalik ang sagot sa **203.0.113.5:1025**, alam ng router na **para sa PC2** iyon.',
        'Ito ang **NAT ng bawat home router**: lahat ng phone at laptop mo ay **isang address lang ang nakikita ng internet**.',
        'Sa Cisco, ang keyword ay **overload**. Kaya ang PAT ay tinatawag ding **NAT overload**.',
      ],
      technical: [
        'PAT (Port Address Translation), also called NAT overload, maps many inside local addresses to one (or a few) inside global addresses, using unique Layer 4 source ports to distinguish flows. The translation table stores address and port, so one public IP can support tens of thousands of simultaneous sessions.',
        'Interface form: access-list 1 permit <inside network> <wildcard>, then ip nat inside source list 1 interface <outside interface> overload. The router uses whatever address the outside interface has, including a DHCP-assigned one, which is how home routers work.',
        'Pool form: ip nat pool <NAME> <start> <end> netmask <mask>, then ip nat inside source list 1 pool <NAME> overload. When one pool address runs out of ports, the next is used.',
        'The router normally keeps the original source port if it is free and otherwise chooses another. In show ip nat translations, inside global shows address:port, and the protocol column lists tcp, udp or icmp.',
        'Verification: show ip nat translations, show ip nat statistics. Without the overload keyword the same command would be dynamic NAT and exhaust quickly.',
      ],
    },
    {
      type: 'analogy',
      title: 'Isang main number, maraming extension',
      body: [
        'A company publishes one phone number. Each employee call goes out with a different line number, and when the reply arrives the switchboard reads the line number to know which desk to ring. The outside world only knows the main number, but nobody gets the wrong call.',
      ],
      taglish: [
        'Ang kompanya ay may **isang main number lang**. Bawat tawag ng empleyado ay may **ibang line number**, at pagbalik ng sagot, **binabasa ng switchboard ang line number** para malaman kung **aling mesa ang tutunog**. Ang labas ay **main number lang ang alam**, pero **walang nagkakamali ng tawag**.',
      ],
    },
    {
      type: 'hook',
      title: 'PAT = Port + Overload',
      trick: '**PAT** = **P**ort ang nagpapakilala; keyword ay **overload**. **Isang address, maraming host**.',
      taglish: [
        '**Port** ang pagkakaiba ng bawat host sa iisang address.',
        'Ang keyword sa Cisco: **overload**.',
        'Dalawang paraan: **interface overload** (gamit ang address ng interface) o **pool overload**.',
        'Kapag **walang overload** ang command, **dynamic NAT** iyon at mauubos ang pool.',
      ],
      test: {
        question: 'Anong isang salita ang nagpapalit ng dynamic NAT sa PAT?',
        answer: 'overload. Halimbawa: ip nat inside source list 1 interface gi0/1 overload.',
      },
    },
    { type: 'diagram', id: 'pat-ports', caption: 'Dalawang PC, iisang public address — nagkakaiba ang port number.' },
    {
      type: 'terms',
      items: [
        { term: 'PAT', definition: 'Port Address Translation: many inside hosts share one inside global address using port numbers.' },
        { term: 'overload', definition: 'The Cisco keyword that turns NAT into PAT.' },
        { term: 'Source port', definition: 'The Layer 4 port the router rewrites to keep each flow unique.' },
        { term: 'Interface overload', definition: 'PAT that uses the outside interface\'s own IP address.' },
        { term: 'Pool overload', definition: 'PAT that shares each pool address among many hosts.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: dalawang PC, isang address',
      steps: [
        'Ang PC1 (192.168.1.10:51000) at PC2 (192.168.1.11:51000) ay parehong nagbubukas ng web page.',
        'Natatanggap ng R1 ang unang packet at nilikha ang translation: 192.168.1.10:51000 → 203.0.113.5:51000.',
        'Natatanggap ng R1 ang ikalawa. Sinasakop na ang port 51000, kaya 192.168.1.11:51000 → 203.0.113.5:51001.',
        'Nakikita ng web server ang dalawang koneksyon mula sa iisang address, magkaibang port.',
        'Bumabalik ang sagot sa 203.0.113.5:51001. Hinahanap ng R1 ang entry at ibinabalik sa PC2.',
        'Ang bawat bagong koneksyon ay nakakakuha ng bagong port, kaya libu-libong session ang kasya sa isang address.',
      ],
    },
    {
      type: 'cli',
      title: 'PAT gamit ang interface address',
      transcript: `R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255
R1(config)# ip nat inside source list 1 interface gi0/1 overload
R1(config)# interface gi0/0
R1(config-if)# ip nat inside
R1(config-if)# interface gi0/1
R1(config-if)# ip nat outside
R1(config-if)# end
R1# show ip nat translations
Pro Inside global         Inside local          Outside local        Outside global
tcp 203.0.113.5:51000     192.168.1.10:51000    198.51.100.7:80      198.51.100.7:80
tcp 203.0.113.5:51001     192.168.1.11:51000    198.51.100.7:80      198.51.100.7:80`,
      copyable: 'ip nat inside source list 1 interface gi0/1 overload',
      explain: [
        { line: 'access-list 1 permit 192.168.1.0 0.0.0.255', why: 'Selects the inside hosts that may use PAT. Uses a wildcard mask.' },
        { line: 'ip nat inside source list 1 interface gi0/1 overload', why: 'Translates matching hosts to the address on Gi0/1, sharing it by port.' },
        { line: '203.0.113.5:51000 and :51001', why: 'Same inside global address, different ports: this is what makes it PAT.' },
        { line: 'tcp column', why: 'The table tracks the protocol, because ports belong to TCP or UDP.' },
      ],
      note: 'Sample output for study; ports are chosen by the router.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show ip nat translations', shows: 'Entries with address:port in the inside global column.' },
        { command: 'show ip nat statistics', shows: 'Totals, hits, misses and the interface used for overload.' },
        { command: 'show access-lists', shows: 'Match counters on the ACL that selects PAT hosts.' },
      ],
      good: 'Many inside local addresses map to the same inside global address with different ports.',
      bad: 'No entries: missing ip nat inside/outside, ACL mismatch or no matching traffic.',
    },
    { type: 'callout', kind: 'trap', text: 'Kapag **nawala ang salitang overload**, hindi na PAT ang command kundi **dynamic NAT** na mauubusan ng address. Ito ang pinakamadalas na patibong.' },
    { type: 'callout', kind: 'trap', text: 'Ang **inside global sa PAT ay may port** (203.0.113.5:51001). Kapag may nakitang magkaparehong address pero magkaibang port, **PAT** iyon.' },
    { type: 'callout', kind: 'tip', text: 'Para sa home o small-office na may **isang public address lang** (lalo na kung DHCP mula sa ISP), **interface overload** ang karaniwang sagot.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagkalimot sa overload.',
        'Maling interface sa command (inside sa halip na outside).',
        'ACL na hindi tumutugma sa LAN network.',
        'Pagkalimot sa ip nat inside/outside.',
        'Pag-akalang ang PAT ay "mas ligtas" bilang firewall.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Isang PC lang ang nakalalabas"',
      scenario: 'After configuring NAT, one PC reaches the internet and others fail once the pool address is in use.',
      evidence: `R1# show running-config | include nat
ip nat pool PUBLIC 203.0.113.10 203.0.113.10 netmask 255.255.255.248
ip nat inside source list 1 pool PUBLIC`,
      question: 'Ano ang mali?',
      answer: 'Walang overload. Ang isang address na pool ay ginamit sa dynamic NAT na isa-sa-isa, kaya isang host lang ang sabay na naka-translate.',
      fix: 'Add the overload keyword: ip nat inside source list 1 pool PUBLIC overload. Then clear ip nat translation * and verify that several hosts share 203.0.113.10 with different ports.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang ISP mo ay nagbibigay ng address sa Gi0/1 gamit ang DHCP at nagbabago ito paminsan-minsan. Aling PAT form ang pipiliin mo at bakit?',
      answer: 'Interface overload: ip nat inside source list 1 interface gi0/1 overload. Sinusunod nito kung ano man ang kasalukuyang address ng interface, kaya hindi mo kailangang baguhin ang configuration kapag nagbago ang address. Hindi ito magagawa ng pool na may nakapirming range.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'PAT = NAT overload; many-to-one using port numbers.',
        'Interface form: ip nat inside source list N interface <if> overload.',
        'Pool form: ip nat inside source list N pool NAME overload.',
        'Missing overload turns it into dynamic NAT.',
        'Inside global shows address:port when PAT is in use.',
      ],
    },
    {
      type: 'summary',
      points: [
        'PAT lets many inside hosts share one public address by translating port numbers.',
        'The overload keyword makes the difference between dynamic NAT and PAT.',
        'Use the interface form when the public address is the router interface address.',
        'Susunod sa roadmap: NTP — pagsabay ng oras sa buong network.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'easy', type: 'single',
    prompt: 'What does PAT use to distinguish translations that share one inside global address?',
    choices: ['MAC addresses', 'Port numbers', 'VLAN IDs', 'TTL values'], correct: [1],
    explanation: 'PAT uses Layer 4 source port numbers to tell flows apart.',
    wrong: { 0: 'MAC addresses are not used for NAT.', 2: 'VLAN IDs are Layer 2.', 3: 'TTL is unrelated.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'easy', type: 'single',
    prompt: 'Which keyword turns NAT into PAT on a Cisco router?',
    choices: ['overload', 'pool', 'static', 'extended'], correct: [0],
    explanation: 'The overload keyword enables many-to-one translation using ports.',
    wrong: { 1: 'pool defines addresses.', 2: 'static creates fixed one-to-one mappings.', 3: 'Not a NAT keyword here.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'Which command configures PAT using the address of GigabitEthernet0/1?',
    choices: ['ip nat inside source list 1 interface gi0/1 overload', 'ip nat inside source static gi0/1', 'ip nat pool gi0/1 overload', 'ip nat outside source list 1 gi0/1'], correct: [0],
    explanation: 'The interface form shares the interface address with overload.',
    wrong: { 1: 'That is static NAT syntax.', 2: 'That defines a pool incorrectly.', 3: 'That is outside source NAT.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'A single-address pool is configured without the overload keyword and only one host can reach the internet at a time. What is the fix?',
    choices: ['Add the overload keyword', 'Change to a static route', 'Reduce the ACL', 'Change the mask to /32'], correct: [0],
    explanation: 'Without overload it is one-to-one dynamic NAT. Adding overload allows port sharing.',
    wrong: { 1: 'Routing is not the issue.', 2: 'The ACL is not limiting a single host.', 3: 'The mask does not enable sharing.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'In show ip nat translations, which output indicates PAT is working?',
    choices: ['Different inside global addresses per host', 'The same inside global address with different port numbers', 'Only static entries', 'No inside local column'], correct: [1],
    explanation: 'PAT shares one address and varies the port.',
    wrong: { 0: 'That describes one-to-one NAT.', 2: 'Static entries are not PAT.', 3: 'The column always exists.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'hard', type: 'single',
    prompt: 'Why is interface overload preferred when the ISP assigns the router a changing DHCP address?',
    choices: ['It follows the interface\'s current address', 'It encrypts the address', 'It avoids the need for ACLs', 'It uses IPv6'], correct: [0],
    explanation: 'The translation uses whichever address the interface currently has.',
    wrong: { 1: 'NAT does not encrypt.', 2: 'An ACL is still needed.', 3: 'Unrelated to IPv6.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO statements describe PAT?',
    choices: ['Many hosts can share one public address', 'It uses the overload keyword', 'It maps each host to its own public address', 'It requires a static route per host'], correct: [0, 1],
    explanation: 'PAT is many-to-one and uses overload.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: PAT is the type of NAT used by most home routers.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — home routers share one public address among all devices using PAT.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: PAT?', back: 'PAT = Port + Overload. Maraming host, isang public address; port number ang pagkakaiba. Kapag walang overload, dynamic NAT na iyon.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'concept', front: 'What is PAT?', back: 'Many inside hosts share one inside global address, distinguished by port numbers (NAT overload).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'command', front: 'PAT with the interface address?', back: 'ip nat inside source list 1 interface gi0/1 overload' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'command', front: 'PAT with a pool?', back: 'ip nat inside source list 1 pool NAME overload' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Static vs dynamic vs PAT?', back: 'Static: permanent one-to-one. Dynamic: pool, one-to-one. PAT: many-to-one using ports.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'concept', front: 'How does show ip nat translations reveal PAT?', back: 'Several inside local hosts share one inside global address with different port numbers.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Configure PAT for a small office',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Let four PCs share one public address using interface overload.',
  topology: 'Four PCs — SW1 — R1 (Gi0/0 inside, Gi0/1 outside 203.0.113.5/30) — ISP — web server.',
  steps: [
    'Mark Gi0/0 ip nat inside and Gi0/1 ip nat outside; add a default route to the ISP.',
    'Create ACL 1 permitting 192.168.1.0 0.0.0.255.',
    'Configure ip nat inside source list 1 interface gi0/1 overload.',
    'Browse to the web server from all four PCs.',
    'Run show ip nat translations and confirm one inside global address with several ports.',
    'Remove overload, repeat, and note that the translation fails.',
  ],
  checklist: [
    'All PCs reach the server through a single public address',
    'Translations show different port numbers',
    'Observed failure without overload',
  ],
  hints: [
    'Use a wildcard mask in the ACL.',
    'Generate traffic before checking the table.',
  ],
  solution: [
    'Interface overload shares 203.0.113.5 among all hosts.',
    'Port numbers differ per connection.',
  ],
  breakIt: 'Swap the inside and outside interface labels and watch translation stop completely.',
};
