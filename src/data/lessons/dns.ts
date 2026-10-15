import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'dns';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.3',
  domain: 'D4',
  title: 'DNS: Turning Names into IP Addresses',
  description: 'How a hostname like www.example.com becomes an IP address, which record types exist, and how to test name resolution.',
  whyMatters:
    'Walang tumatandang IP address ng website — pangalan ang tina-type ng lahat. Kapag sira ang DNS, "walang internet" ang reklamo kahit gumagana ang koneksyon. Kailangan mong malaman kung paano ito i-troubleshoot: ping sa IP, ping sa pangalan, at nslookup. Madalas din itong lumabas sa exam bilang A vs AAAA records at ang papel ng DNS server sa DHCP.',
  objectives: [
    'Explain why DNS exists and what a DNS server does',
    'Describe recursive resolution from client to resolver to root, TLD and authoritative servers',
    'Distinguish A, AAAA, CNAME, MX, NS and PTR records',
    'Configure a router as a DNS client with ip name-server and ip domain-lookup',
    'Use nslookup and ping to tell a DNS problem from a connectivity problem',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['DNS', 'A record', 'AAAA record', 'CNAME', 'MX', 'NS', 'PTR', 'resolver', 'recursive', 'nslookup', 'UDP 53', 'ip name-server'],
  examObjectives: ['4.3'],
  sections: [
    {
      type: 'explain',
      simple: [
        'People remember names; networks route numbers. DNS is the phone book that converts a name such as www.example.com into the IP address your computer needs. Without it you would have to type addresses for every site.',
        'Your computer asks its configured DNS server (usually handed out by DHCP). If that server does not know the answer, it asks other servers on your behalf and returns the result, then remembers it for a while so the next lookup is instant.',
      ],
      taglish: [
        'Ang tao ay **nakakaalala ng pangalan**, pero ang network ay **numero ang ginagamit**. Ang **DNS** ay parang **phone book**: ginagawang **IP address** ang pangalan tulad ng www.example.com.',
        'Kapag nag-type ka ng pangalan, tinatanong ng computer mo ang **DNS server** (kadalasan ibinigay ng **DHCP**). Kung hindi nito alam, **siya na ang magtatanong sa iba** at ibabalik ang sagot sa iyo — tinatawag itong **recursive** query.',
        'Itinatago (**cache**) ang sagot nang ilang sandali, kaya **mas mabilis** ang susunod na tanong.',
        'Mga uri ng record: **A** = IPv4, **AAAA** = IPv6, **CNAME** = alias, **MX** = mail, **NS** = name server, **PTR** = baligtad (IP papuntang pangalan).',
      ],
      technical: [
        'DNS is a hierarchical, distributed database. Clients send queries over UDP port 53 (TCP 53 for large responses and zone transfers). The client\'s stub resolver asks a recursive resolver, which walks the hierarchy if its cache misses: root servers return the TLD (.com) servers, TLD servers return the authoritative servers for the domain, and the authoritative server returns the record.',
        'Common records: A (name to IPv4), AAAA (name to IPv6), CNAME (alias to another name), MX (mail exchanger, with priority), NS (authoritative name servers for a zone), PTR (IP to name, in in-addr.arpa / ip6.arpa), SOA (zone parameters), TXT (free text such as SPF).',
        'Every record carries a TTL; resolvers cache the answer until it expires. Clients usually receive DNS server addresses from DHCP, or have them set statically.',
        'Cisco IOS as a client: ip domain-lookup (on by default), ip name-server <ip>, and ip domain-name <name> to complete unqualified names. A router mistyped command may pause while it tries to resolve the text as a hostname — disable with no ip domain-lookup in the lab.',
        'Verification: nslookup <name> and ipconfig /displaydns (Windows), dig <name> (Linux), show hosts (IOS). Rule of thumb: if ping to an IP works but ping to the name fails, the problem is DNS, not connectivity.',
      ],
    },
    {
      type: 'analogy',
      title: 'Phone book at tanungan',
      body: [
        'You want to call "Maria\'s Bakery" but only know the name. You ask the neighbourhood information desk (your resolver). If it does not know, it calls the city directory, which points to the district list, which finally gives the number. The desk writes the number on a sticky note so the next person who asks gets it immediately.',
      ],
      taglish: [
        'Gusto mong tawagan ang **"Panaderia ni Maria"** pero **pangalan lang ang alam mo**. Nagtanong ka sa **information desk** (resolver). Kung hindi niya alam, **tatawag siya sa city directory**, na magtuturo sa **district list**, hanggang makuha ang numero. **Isinulat niya sa sticky note** ang numero para **mabilis** na ang susunod na magtanong.',
      ],
    },
    {
      type: 'hook',
      title: 'A = IPv4, AAAA = IPv6 (apat na A)',
      trick: '**A** = **IPv4** (32 bit). **AAAA** = **IPv6** (apat na beses na mas malaki: 128 bit). Port: **UDP 53**.',
      taglish: [
        'Ang **AAAA** ay **apat na A** dahil **apat na beses ang laki** ng IPv6 (128 bit) kumpara sa IPv4 (32 bit).',
        'Ang **MX** = **M**ail. Ang **NS** = **N**ame **S**erver. Ang **CNAME** = **C**anonical **NAME** (alias). Ang **PTR** = **P**oin**T**e**R** pabalik: IP → pangalan.',
        'Port: **UDP 53**.',
        'Troubleshooting trick: **ping sa IP gumagana, ping sa pangalan hindi** = **DNS** ang sira.',
      ],
      test: {
        question: 'Gumagana ang ping 8.8.8.8 pero hindi ang ping www.example.com. Ano ang problema?',
        answer: 'DNS. Maayos ang koneksyon (nakararating sa IP), pero hindi nata-translate ang pangalan — maling DNS server, hindi maabot ang DNS server, o walang DNS na ibinigay ng DHCP.',
      },
    },
    { type: 'diagram', id: 'dns-resolution', caption: 'Recursive lookup: ang resolver ang nagtatanong sa root, TLD at authoritative server para sa client.' },
    {
      type: 'terms',
      items: [
        { term: 'DNS', definition: 'Domain Name System: maps names to IP addresses. UDP/TCP port 53.' },
        { term: 'Resolver', definition: 'The server (often your ISP or router) that performs lookups for clients and caches answers.' },
        { term: 'Authoritative server', definition: 'The server that holds the real records for a domain.' },
        { term: 'A / AAAA record', definition: 'Maps a name to an IPv4 / IPv6 address.' },
        { term: 'CNAME', definition: 'An alias pointing one name to another name.' },
        { term: 'MX / NS / PTR', definition: 'Mail exchanger / authoritative name server / reverse (IP to name) record.' },
        { term: 'TTL', definition: 'How long an answer may be cached before it must be looked up again.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: pag-type ng www.example.com',
      steps: [
        'Tina-type ng user ang www.example.com. Tinitingnan ng PC ang sarili nitong cache; wala pa.',
        'Nagpapadala ang PC ng DNS query (UDP 53) sa DNS server na ibinigay ng DHCP.',
        'Wala rin sa cache ang resolver, kaya tinatanong nito ang isang root server, na nagtuturo sa .com TLD servers.',
        'Tinatanong ng resolver ang .com server, na nagtuturo sa authoritative server ng example.com.',
        'Ibinabalik ng authoritative server ang A record: 93.184.216.34 (may TTL).',
        'Itinatago ng resolver ang sagot sa cache at ibinabalik sa PC. Doon na kumokonekta ang browser sa IP address.',
      ],
    },
    {
      type: 'cli',
      title: 'Router bilang DNS client, at mga test command',
      transcript: `R1(config)# ip domain-lookup
R1(config)# ip name-server 8.8.8.8
R1(config)# ip domain-name lab.local
R1(config)# ip host WEB1 192.168.10.50
R1(config)# end
R1# ping www.example.com
Translating "www.example.com"...domain server (8.8.8.8) [OK]
Sending 5, 100-byte ICMP Echos to 93.184.216.34 ...
!!!!!

C:\\> nslookup www.example.com
Server:  dns.lab.local
Address:  192.168.10.1
Name:    www.example.com
Address: 93.184.216.34`,
      copyable: 'ip name-server 8.8.8.8',
      explain: [
        { line: 'ip name-server 8.8.8.8', why: 'Tells the router which DNS server to ask. Up to six may be listed.' },
        { line: 'ip domain-name lab.local', why: 'Appended to unqualified names, so "WEB1" becomes WEB1.lab.local.' },
        { line: 'ip host WEB1 192.168.10.50', why: 'A static local entry that works without any DNS server.' },
        { line: 'Translating ... [OK]', why: 'Proves name resolution worked before the ping even started.' },
        { line: 'nslookup', why: 'Shows which server answered and the address it returned.' },
      ],
      note: 'Sample output for study; addresses will differ.',
    },
    { type: 'callout', kind: 'trap', text: 'Kapag **ping sa IP ay gumagana pero sa pangalan ay hindi**, **DNS ang problema**, hindi ang cable o routing. Huwag nang magpalit ng cable o mag-reboot ng router.' },
    { type: 'callout', kind: 'trap', text: '**A = IPv4**, **AAAA = IPv6**. Ang **PTR** ay **baligtad** (IP papunta sa pangalan), hindi pangalan papunta sa IP.' },
    { type: 'callout', kind: 'tip', text: 'Ang DNS ay gumagamit ng **UDP 53** para sa karaniwang query at **TCP 53** para sa malalaking sagot at **zone transfer**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagsisisi sa cable o routing kapag DNS ang totoong sira.',
        'Paghalo ng A at AAAA records.',
        'Paglimot sa ip name-server kaya hindi makapag-resolve ang router.',
        'Pag-iwan ng ip domain-lookup na naka-on sa lab, kaya tumitigil ang router sa maling command.',
        'Pagsasama ng DNS at DHCP: hindi nagbibigay ng pangalan ang DHCP, nagbibigay ito ng address ng DNS server.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Bukas ang Wi-Fi pero walang website"',
      scenario: 'A user can ping 8.8.8.8 but cannot browse to any site by name.',
      evidence: `C:\\> ping 8.8.8.8
Reply from 8.8.8.8: bytes=32 time=18ms TTL=117
C:\\> ping www.example.com
Ping request could not find host www.example.com.
C:\\> ipconfig /all
   DNS Servers . . . . . . . . : 192.168.10.99`,
      question: 'Ano ang problema at saan ka titingin?',
      answer: 'Gumagana ang koneksyon (nakarating ang ping sa IP), pero hindi sumasagot ang DNS server na 192.168.10.99. Mali o patay ang DNS server na nakalagay.',
      fix: 'Verify the DNS server address handed out by DHCP (the pool dns-server setting). Test with nslookup www.example.com 8.8.8.8 to prove another server works, correct the DHCP option, then ipconfig /release and /renew.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Bakit may TTL ang DNS record, at ano ang mangyayari kung masyadong mataas ang TTL kapag nagpalit ka ng IP ng server?',
      answer: 'Ang TTL ay nagsasabi kung gaano katagal puwedeng i-cache ang sagot, para mabawasan ang dami ng query. Kung mataas ang TTL at nagpalit ka ng IP, ang mga resolver at client ay patuloy na gagamit ng lumang IP hanggang mag-expire ang cache, kaya bababaan muna ang TTL bago ang paglipat.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'DNS translates names to IP addresses; it uses UDP 53 (TCP 53 for large responses).',
        'A = IPv4, AAAA = IPv6, CNAME = alias, MX = mail, NS = name server, PTR = reverse.',
        'DHCP typically supplies the DNS server address to clients.',
        'Ping works by IP but not by name: DNS problem.',
        'Router client config: ip name-server and ip domain-lookup.',
      ],
    },
    {
      type: 'summary',
      points: [
        'DNS maps names to IP addresses using a hierarchy and cached answers.',
        'The resolver does the recursive work; records include A, AAAA, CNAME, MX, NS and PTR.',
        'Use ping by IP versus by name to separate DNS faults from connectivity faults.',
        'Susunod: NAT — paano nagagamit ang private address para makalabas sa internet.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'easy', type: 'single',
    prompt: 'What is the main function of DNS?',
    choices: ['Assign IP addresses to hosts', 'Translate hostnames to IP addresses', 'Encrypt web traffic', 'Synchronise clocks'], correct: [1],
    explanation: 'DNS resolves names such as www.example.com to IP addresses.',
    wrong: { 0: 'That is DHCP.', 2: 'That is TLS.', 3: 'That is NTP.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'easy', type: 'single',
    prompt: 'Which DNS record maps a name to an IPv6 address?',
    choices: ['A', 'AAAA', 'MX', 'PTR'], correct: [1],
    explanation: 'AAAA records hold IPv6 addresses; A records hold IPv4.',
    wrong: { 0: 'A is for IPv4.', 2: 'MX is for mail servers.', 3: 'PTR maps an IP back to a name.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'easy', type: 'single',
    prompt: 'Which transport protocol and port does a standard DNS query use?',
    choices: ['TCP 80', 'UDP 53', 'UDP 67', 'TCP 443'], correct: [1],
    explanation: 'Normal DNS queries use UDP port 53.',
    wrong: { 0: 'TCP 80 is HTTP.', 2: 'UDP 67 is the DHCP server.', 3: 'TCP 443 is HTTPS.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'medium', type: 'single',
    prompt: 'A host can ping 8.8.8.8 but not www.example.com. What is the most likely issue?',
    choices: ['A broken cable', 'DNS resolution failure', 'An OSPF neighbour is down', 'A duplex mismatch'], correct: [1],
    explanation: 'Reaching the IP proves connectivity; failing by name points to DNS.',
    wrong: { 0: 'The cable works since ping to the IP succeeds.', 2: 'Routing clearly works.', 3: 'A duplex issue would degrade all traffic.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'medium', type: 'single',
    prompt: 'Which record type is an alias that points one name to another name?',
    choices: ['NS', 'MX', 'CNAME', 'AAAA'], correct: [2],
    explanation: 'A CNAME makes one name an alias of another.',
    wrong: { 0: 'NS lists authoritative servers.', 1: 'MX identifies mail servers.', 3: 'AAAA maps to an IPv6 address.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'medium', type: 'single',
    prompt: 'Which router command specifies the DNS server to use?',
    choices: ['ip dns 8.8.8.8', 'ip name-server 8.8.8.8', 'dns-server 8.8.8.8', 'ip resolver 8.8.8.8'], correct: [1],
    explanation: 'ip name-server in global configuration sets the DNS server used by the router.',
    wrong: { 0: 'Not valid IOS syntax.', 2: 'That is a DHCP pool command.', 3: 'Not valid IOS syntax.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO statements about DNS are true?',
    choices: ['Resolvers cache answers according to the TTL', 'DNS only uses TCP', 'A records hold IPv4 addresses', 'DNS assigns IP addresses to clients'], correct: [0, 2],
    explanation: 'Resolvers cache using TTL and A records hold IPv4. DNS mainly uses UDP and does not assign addresses.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: DHCP commonly tells clients which DNS server to use.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — the DNS server is delivered as a DHCP option.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: paano tandaan ang DNS records?', back: 'A = IPv4, AAAA = IPv6 (apat na A, apat na beses ang laki). MX = mail, NS = name server, CNAME = alias, PTR = baligtad. UDP 53. Ping IP okay pero pangalan hindi = DNS.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'protocol', front: 'What does DNS do?', back: 'Translates hostnames into IP addresses using a distributed hierarchy; UDP/TCP port 53.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'concept', front: 'A vs AAAA record?', back: 'A maps a name to IPv4; AAAA maps a name to IPv6.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'concept', front: 'CNAME, MX, NS, PTR?', back: 'CNAME alias; MX mail exchanger; NS authoritative name server; PTR reverse lookup (IP to name).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'command', front: 'Router DNS client commands?', back: 'ip name-server <ip>, ip domain-lookup, ip domain-name <name>.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Ping IP works, ping name fails?', back: 'DNS problem: check the DNS server setting (often from DHCP) and test with nslookup.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D4', category: 'concept', front: 'What is TTL on a DNS record?', back: 'How long resolvers may cache the answer before querying again.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Add a DNS server and prove name resolution',
  tool: 'Packet Tracer',
  minutes: 20,
  objective: 'Create an A record on a DNS server, point a client at it and confirm resolution with nslookup and ping.',
  topology: 'PC1 — SW1 — Server (DNS + web) on 192.168.10.0/24.',
  steps: [
    'Give the server 192.168.10.50/24 and enable the DNS service.',
    'Add an A record: www.lab.local pointing to 192.168.10.50.',
    'Set PC1 to 192.168.10.10/24 with DNS server 192.168.10.50.',
    'On PC1 run ping 192.168.10.50 and then ping www.lab.local; both should succeed.',
    'Run nslookup www.lab.local and note the server that answered.',
    'Change the PC DNS server to a wrong address and repeat; ping by IP works, by name fails.',
  ],
  checklist: [
    'A record created and resolves to the server',
    'Ping works by IP and by name',
    'Reproduced a DNS-only failure with a wrong DNS server',
  ],
  hints: [
    'The DNS service must be switched on in the server Services tab.',
    'Test by IP first so you know the network itself is healthy.',
  ],
  solution: [
    'The A record maps www.lab.local to 192.168.10.50.',
    'A wrong DNS server breaks name lookups but not ping by IP.',
  ],
  breakIt: 'Delete the A record and observe that nslookup returns no answer while ping by IP still succeeds.',
};
