import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'extended-acls';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.6',
  domain: 'D5',
  title: 'Extended and Named ACLs: Protocol, Ports and Placement',
  description: 'How extended ACLs filter by protocol, source, destination and port, how to read and write them, and why they belong close to the source.',
  whyMatters:
    'Ang extended ACL ang gamit sa totoong buhay: "payagan ang web pero harangan ang Telnet", "bawal ang guest VLAN sa server". Sa exam, bibigyan ka ng ACL at tatanungin kung ano ang epekto, o kung anong linya ang kulang. Kailangan mong mabasa nang tama ang protocol, source, destination at port — at mailagay ito sa tamang lugar.',
  objectives: [
    'Write an extended ACL with protocol, source, destination and port operators',
    'Use eq, gt, lt, neq and range with TCP and UDP port numbers or names',
    'Place extended ACLs close to the source and apply the correct direction',
    'Create and edit a named extended ACL using sequence numbers',
    'Read an ACL and predict which traffic is permitted or denied',
  ],
  estimatedMinutes: 45,
  difficulty: 'intermediate',
  keywords: ['extended ACL', 'access-list 100', 'ip access-list extended', 'tcp', 'udp', 'icmp', 'eq', 'range', 'established', 'log', 'permit ip any any', 'placement'],
  examObjectives: ['5.6'],
  sections: [
    {
      type: 'explain',
      simple: [
        'An extended ACL is a precise filter. Each rule says which protocol (IP, TCP, UDP, ICMP), which source, which destination and, for TCP and UDP, which port. That lets you say "allow this PC to browse the web servers, but nothing else".',
        'Because it can name the destination, an extended ACL goes close to the source: unwanted traffic is dropped early, before it crosses the network. The implicit deny still waits at the end.',
      ],
      taglish: [
        'Ang **extended ACL** ay **tumpak na filter**. Bawat patakaran ay nagsasabi ng **protocol** (IP, TCP, UDP, ICMP), **source**, **destination** at, para sa TCP/UDP, **port**. Kaya mong sabihing **"puwedeng mag-web ang PC na ito sa mga web server, pero wala nang iba"**.',
        'Dahil kaya nitong **pangalanan ang destination**, **ilalagay ito malapit sa SOURCE**: **ibinabagsak agad ang hindi gustong trapiko** bago pa tumawid sa network. **Nandoon pa rin ang implicit deny** sa dulo.',
        'Format: **access-list 100 permit tcp <source> <wildcard> <destination> <wildcard> eq 80**. Ang **eq** ay "katumbas ng port", **gt** = mas malaki, **lt** = mas maliit, **range** = saklaw.',
        'Ang **named extended ACL** (ip access-list extended NAME) ay may **sequence numbers**, kaya madaling i-edit. Ang mga **numerong 100–199 at 2000–2699** ay extended.',
      ],
      technical: [
        'Syntax: access-list <100–199|2000–2699> permit|deny <protocol> <source> <src-wildcard> [src-port-operator] <destination> <dst-wildcard> [dst-port-operator] [established] [log]. Protocols include ip (all IP), tcp, udp and icmp. Port operators: eq, neq, gt, lt, range <low> <high>; ports may be numbers or names (www, 443, ssh, domain).',
        'Matching order: protocol, source, destination, then ports. A rule such as permit tcp 192.168.10.0 0.0.0.255 host 10.0.0.50 eq 443 allows the LAN to reach one server over HTTPS. A rule with ip matches every protocol and cannot specify ports. Use any and host as in standard ACLs.',
        'Return traffic: an ACL applied inbound on the LAN side does not need to consider replies. If an ACL is applied where replies pass, allow them explicitly (permit tcp any any established lets TCP segments with ACK/RST pass, a rudimentary stateful check) or allow the required ICMP echo-reply.',
        'Placement: extended ACLs go as close to the source as possible so denied traffic never crosses the network. Direction is relative to the router: inbound on the interface where traffic enters, or outbound where it leaves. One ACL per interface, per direction, per protocol.',
        'Named ACLs: ip access-list extended NAME, then entries with optional sequence numbers; delete a rule with no <sequence>; add remark lines for documentation. Verify with show access-lists, show ip interface <if>, and match counters. log adds a syslog message on matches (severity 6) but should be used sparingly on busy rules.',
      ],
    },
    {
      type: 'analogy',
      title: 'Guwardiya na may detalyadong listahan',
      body: [
        'This guard checks who you are, where you are going and what you are bringing. "Delivery rider with a parcel for the front office: allowed. Anyone going to the server room: not allowed." He stands at the entrance where the visitor starts, so unwanted visitors never get deeper into the building.',
      ],
      taglish: [
        'Ang **guwardiyang ito ay tinitingnan kung sino ka, saan ka pupunta, at ano ang dala mo**. **"Rider na may parcel para sa front office: puwede. Sinumang papunta sa server room: bawal."** **Nakatayo siya sa pasukan kung saan nagsisimula ang bisita**, kaya **ang hindi gustong bisita ay hindi na lumalalim** sa gusali.',
      ],
    },
    {
      type: 'hook',
      title: 'PSDP: Protocol, Source, Destination, Port',
      trick: '**PSDP**: **P**rotocol → **S**ource → **D**estination → **P**ort. Extended = **100–199**, malapit sa **S**ource. Operators: **eq, neq, gt, lt, range**.',
      taglish: [
        'Basahin ang extended ACL sa ganitong pagkakasunod: **P**rotocol, **S**ource, **D**estination, **P**ort.',
        '**eq 80** = port 80. **range 20 21** = mula 20 hanggang 21. **gt 1023** = mas malaki sa 1023.',
        '**Malapit sa source** ang extended ACL, **malapit sa destination** ang standard.',
        'Huwag kalimutan ang **permit ip any any** sa dulo kung gusto mong payagan ang iba.',
      ],
      test: {
        question: 'Anong rule ang pumapayag sa LAN 192.168.10.0/24 na mag-HTTPS lang papunta sa server 10.0.0.50?',
        answer: 'access-list 100 permit tcp 192.168.10.0 0.0.0.255 host 10.0.0.50 eq 443. Ang lahat ng iba ay haharangan ng implicit deny maliban kung may ibang permit.',
      },
    },
    { type: 'diagram', id: 'acl-extended-read', caption: 'Pagbasa ng extended ACL: protocol, source, destination, port.' },
    {
      type: 'terms',
      items: [
        { term: 'Extended ACL', definition: 'ACL (100–199, 2000–2699 or named) matching protocol, source, destination and ports.' },
        { term: 'eq / neq / gt / lt / range', definition: 'Port operators: equal, not equal, greater than, less than, a range.' },
        { term: 'established', definition: 'TCP keyword that matches segments with ACK or RST set, i.e. part of an existing connection.' },
        { term: 'log', definition: 'Option that records a syslog message when the rule is matched.' },
        { term: 'Well-known ports', definition: 'Common service ports: 80 HTTP, 443 HTTPS, 22 SSH, 23 Telnet, 53 DNS, 21 FTP, 25 SMTP.' },
        { term: 'Placement', definition: 'Extended ACLs go as close to the source as possible.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: guest VLAN, web lang',
      steps: [
        'Ang guest VLAN (172.16.50.0/24) ay dapat makapag-web pero hindi makapasok sa internal network 10.0.0.0/8.',
        'Gagawa ng ACL na deny ip sa 10.0.0.0/8, permit tcp sa port 80 at 443, permit udp port 53 (DNS).',
        'Ilalagay ang ACL inbound sa router interface ng guest VLAN (malapit sa source).',
        'Ang packet papunta sa 10.0.5.5 ay tatamaan ng unang deny at ibabagsak agad.',
        'Ang HTTPS papunta sa internet ay tatamaan ng permit tcp eq 443 at papasa.',
        'Ang telnet ng guest ay walang tumutugmang permit kaya tatamaan ng implicit deny.',
      ],
    },
    {
      type: 'cli',
      title: 'Extended at named extended ACL',
      transcript: `R1(config)# ip access-list extended GUEST-IN
R1(config-ext-nacl)# remark Guests: no internal access
R1(config-ext-nacl)# 10 deny ip 172.16.50.0 0.0.0.255 10.0.0.0 0.255.255.255
R1(config-ext-nacl)# 20 permit udp 172.16.50.0 0.0.0.255 any eq 53
R1(config-ext-nacl)# 30 permit tcp 172.16.50.0 0.0.0.255 any eq 80
R1(config-ext-nacl)# 40 permit tcp 172.16.50.0 0.0.0.255 any eq 443
R1(config-ext-nacl)# exit
R1(config)# interface gi0/2
R1(config-if)# ip access-group GUEST-IN in
R1(config-if)# end
R1# show ip access-lists GUEST-IN
Extended IP access list GUEST-IN
    10 deny ip 172.16.50.0 0.0.0.255 10.0.0.0 0.255.255.255 (9 matches)
    20 permit udp 172.16.50.0 0.0.0.255 any eq domain (31 matches)
    30 permit tcp 172.16.50.0 0.0.0.255 any eq www (118 matches)
    40 permit tcp 172.16.50.0 0.0.0.255 any eq 443 (240 matches)`,
      copyable: 'ip access-group GUEST-IN in',
      explain: [
        { line: '10 deny ip 172.16.50.0 0.0.0.255 10.0.0.0 0.255.255.255', why: 'Blocks guests from reaching any internal 10.x address. This rule must come first.' },
        { line: '20 permit udp ... any eq 53', why: 'Lets guests resolve names with DNS; without it web browsing would fail.' },
        { line: '30 / 40 permit tcp ... eq 80 / 443', why: 'Allows only web browsing (HTTP and HTTPS).' },
        { line: 'ip access-group GUEST-IN in', why: 'Applied inbound on the guest interface, close to the source.' },
        { line: '(9 matches)', why: 'Counters prove which rule is dropping or allowing traffic.' },
      ],
      note: 'Sample output for study. IOS may show names (www, domain) instead of numbers.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show access-lists', shows: 'All ACLs, rules in order and match counters.' },
        { command: 'show ip interface gi0/2', shows: 'The ACL and direction applied on the interface.' },
        { command: 'show ip access-lists GUEST-IN', shows: 'A single named ACL.' },
        { command: 'ping / telnet test from a guest PC', shows: 'Whether traffic is permitted or blocked according to the rules.' },
      ],
      good: 'Web and DNS counters rise; internal access attempts hit the deny rule.',
      bad: 'DNS or web blocked (missing permit), or internal access allowed (deny placed below a broad permit).',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **extended ACL ay malapit sa SOURCE**, ang **standard ay malapit sa DESTINATION**. At **tcp/udp lang ang puwedeng gumamit ng port**; ang **"ip" ay para sa lahat ng protocol** at hindi puwedeng may port.' },
    { type: 'callout', kind: 'trap', text: 'Kapag **hinarangan mo ang web**, huwag kalimutang **payagan ang DNS (UDP 53)** — kung hindi, **hindi makakapag-resolve ng pangalan** ang user kahit bukas ang port 80.' },
    { type: 'callout', kind: 'tip', text: 'Ang **mas tiyak na rule ay dapat nasa itaas**. Kapag **permit ip any any** ang nauna, **walang halaga** ang mga deny sa ibaba.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Paglalagay ng permit ip any any sa itaas ng mga deny.',
        'Pagkalimot sa DNS kapag pinapayagan ang web.',
        'Paggamit ng port number sa rule na protocol ip.',
        'Paglalagay ng extended ACL malapit sa destination.',
        'Maling direksyon (in/out) sa interface.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Walang gumagana sa guest Wi-Fi"',
      scenario: 'Guests can ping but cannot open any website. The guest ACL was recently changed.',
      evidence: `R1# show ip access-lists GUEST-IN
Extended IP access list GUEST-IN
    10 deny ip 172.16.50.0 0.0.0.255 10.0.0.0 0.255.255.255 (4 matches)
    30 permit tcp 172.16.50.0 0.0.0.255 any eq www (0 matches)
    40 permit tcp 172.16.50.0 0.0.0.255 any eq 443 (0 matches)`,
      question: 'Bakit walang web kahit may permit sa port 80 at 443?',
      answer: 'Walang permit para sa DNS (UDP 53). Hindi makapag-resolve ng pangalan ang mga guest, kaya walang TCP traffic na dumarating sa 80/443 (0 matches); hinaharang ng implicit deny ang DNS.',
      fix: 'Magdagdag ng rule bago ang implicit deny: 20 permit udp 172.16.50.0 0.0.0.255 any eq 53. Pagkatapos ay i-verify na tumataas ang counters ng rule 20, 30 at 40.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang rule na humaharang sa lahat ng Telnet mula 10.1.1.0/24 papunta sa kahit saan, at pumapayag sa lahat ng iba. Saan ito ilalagay?',
      answer: 'access-list 101 deny tcp 10.1.1.0 0.0.0.255 any eq 23, saka access-list 101 permit ip any any. Ilalagay ito inbound sa interface ng 10.1.1.0/24 sa router — malapit sa source.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Extended ACLs: 100–199 and 2000–2699, or named; match protocol, source, destination, ports.',
        'Place extended ACLs close to the source; standard ACLs close to the destination.',
        'Port operators: eq, neq, gt, lt, range; only TCP and UDP use ports.',
        'Specific rules first; end with permit ip any any if other traffic must pass.',
        'Allow DNS (UDP 53) when permitting web access.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Extended ACLs filter by protocol, source, destination and port.',
        'Read them in the order protocol, source, destination, port.',
        'Place them close to the source and order rules from specific to general.',
        'Use named ACLs with sequence numbers to edit safely.',
        'Susunod: Port security — proteksyon sa switch port.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'easy', type: 'single',
    prompt: 'Which ACL type can filter on destination port numbers?',
    choices: ['Standard', 'Extended', 'Both', 'Neither'], correct: [1],
    explanation: 'Only extended ACLs can match protocols and port numbers.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Where should an extended ACL generally be placed?',
    choices: ['Close to the destination', 'Close to the source', 'On the core switch only', 'It does not matter'], correct: [1],
    explanation: 'Extended ACLs go close to the source so denied traffic does not cross the network.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Which rule permits HTTPS from 192.168.10.0/24 to host 10.0.0.50?',
    choices: ['permit tcp 192.168.10.0 0.0.0.255 host 10.0.0.50 eq 443', 'permit ip 192.168.10.0 0.0.0.255 host 10.0.0.50 eq 443', 'permit udp 192.168.10.0 0.0.0.255 host 10.0.0.50 eq 443', 'permit tcp host 10.0.0.50 192.168.10.0 0.0.0.255 eq 443'], correct: [0],
    explanation: 'HTTPS is TCP 443; the source is the LAN and the destination is the host.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Which keyword matches ports 20 through 21?',
    choices: ['eq 20 21', 'range 20 21', 'gt 20', 'between 20 21'], correct: [1],
    explanation: 'range <low> <high> matches an inclusive range of ports.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'hard', type: 'single',
    prompt: 'An ACL permits TCP 80 and 443 for guests but websites do not load by name. What is most likely missing?',
    choices: ['permit icmp', 'permit udp any any eq 53 (DNS)', 'permit tcp eq 25', 'permit ospf'], correct: [1],
    explanation: 'Name resolution uses DNS over UDP 53; without it, browsing by name fails.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Which is true when a rule uses the "ip" protocol keyword?',
    choices: ['It can specify TCP ports', 'It matches all IP protocols and cannot specify ports', 'It only matches ICMP', 'It matches only UDP'], correct: [1],
    explanation: 'The ip keyword matches any IP traffic; ports are only available for tcp and udp.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'single',
    prompt: 'Which command creates a named extended ACL?',
    choices: ['access-list extended NAME', 'ip access-list extended NAME', 'ip access-group extended NAME', 'extended-acl NAME'], correct: [1],
    explanation: 'ip access-list extended NAME enters named extended ACL configuration.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are valid port operators in an extended ACL?',
    choices: ['eq', 'between', 'range', 'near'], correct: [0, 2],
    explanation: 'eq, neq, gt, lt and range are the valid operators.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D5', objective: '5.6', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a permit ip any any at the top of an ACL makes the later deny rules ineffective.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — the first match wins, and permit ip any any matches everything.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: paano basahin ang extended ACL?', back: 'PSDP: Protocol, Source, Destination, Port. 100–199, malapit sa Source. Operators: eq, neq, gt, lt, range. Huwag kalimutan ang DNS (UDP 53).' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What does an extended ACL match?', back: 'Protocol, source, destination and (for TCP/UDP) ports. Numbers 100–199 and 2000–2699.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Extended ACL placement?', back: 'Close to the source, so denied traffic is dropped early.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'command', front: 'Permit HTTPS from LAN to one server?', back: 'permit tcp 192.168.10.0 0.0.0.255 host 10.0.0.50 eq 443' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'port', front: 'Common ports for ACLs?', back: 'HTTP 80, HTTPS 443, SSH 22, Telnet 23, DNS 53, FTP 21, SMTP 25.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'command', front: 'Named extended ACL?', back: 'ip access-list extended NAME → 10 deny ... → 20 permit ... → apply with ip access-group NAME in|out' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Guest VLAN: web only, no internal access',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Build a named extended ACL that lets guests browse but keeps them out of the internal network.',
  topology: 'Guest PC (172.16.50.10) — R1 Gi0/2 — R1 Gi0/0 — internal server 10.0.0.50 and web/DNS server 203.0.113.80.',
  steps: [
    'Confirm the guest PC can reach both servers before any ACL.',
    'Create ip access-list extended GUEST-IN with a deny to 10.0.0.0 0.255.255.255 first.',
    'Add permits for udp 53, tcp 80 and tcp 443.',
    'Apply GUEST-IN inbound on R1 Gi0/2.',
    'Test: browse the external web server (works), ping the internal server (blocked), telnet (blocked).',
    'Review show ip access-lists GUEST-IN counters and add a remark.',
  ],
  checklist: [
    'Internal server unreachable from the guest PC',
    'External web browsing works',
    'Counters show hits on deny and permit rules',
  ],
  hints: [
    'Apply the ACL on the interface nearest the guest PC, inbound.',
    'Put the specific deny above the broad permits.',
  ],
  solution: [
    'Rules 10 (deny ip to 10/8), 20 (permit udp 53), 30 (permit tcp 80), 40 (permit tcp 443) applied inbound on Gi0/2.',
    'Anything else, such as Telnet, is blocked by the implicit deny.',
  ],
  breakIt: 'Remove the DNS permit and watch web browsing by name fail while access by IP address still works.',
};
