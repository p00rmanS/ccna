import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'dhcp-dns-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.2',
  domain: 'D4',
  title: 'DHCP and DNS Deep Dive: Leases, Relay and Name Resolution',
  description: 'Follow DHCP from discover to renewal, configure server, exclusions and relay, then trace how DNS resolves a name and diagnose the classic faults.',
  whyMatters:
    'Ang DHCP at DNS ang dalawang serbisyong pinaka-ginagamit ng bawat PC. Sa exam, tinatanong kung anong packet ang broadcast, ano ang ginagawa ng ip helper-address, ano ang 169.254, at bakit gumagana ang ping IP pero hindi ang pangalan. Dito natin sila pag-uugnayin.',
  objectives: [
    'Trace DORA, lease renewal at rebinding with the right addresses and ports',
    'Configure a DHCP pool, excluded addresses and a relay',
    'Explain why a relay is needed and what it changes in the packet',
    'Trace recursive DNS resolution and name the record types',
    'Separate DHCP faults from DNS faults using ping and nslookup',
  ],
  estimatedMinutes: 45,
  difficulty: 'exam',
  keywords: ['DHCP', 'DORA', 'lease', 'ip helper-address', 'relay', 'excluded-address', 'DNS', 'A record', 'AAAA', 'recursive resolver', 'nslookup', 'APIPA', 'giaddr'],
  examObjectives: ['4.6', '4.3'],
  sections: [
    {
      type: 'explain',
      simple: [
        'DHCP gives a host its address, mask, gateway and DNS server. DNS then turns names into addresses. If DHCP fails the host has no usable address; if DNS fails the host works by IP but not by name.',
        'DHCP uses broadcasts, and routers do not forward broadcasts, so a relay agent on the router forwards them to a remote server.',
      ],
      taglish: [
        'Ang **DHCP** ang nagbibigay sa host ng **address, mask, gateway at DNS server**. Ang **DNS** naman ang nagsasalin ng **pangalan → IP address**. Kapag bumagsak ang DHCP, walang magagamit na address ang host; kapag bumagsak ang DNS, **gumagana sa IP pero hindi sa pangalan**.',
        'Ang DHCP ay gumagamit ng **broadcast**, at **hindi nagpapasa ng broadcast ang router**. Kaya kung nasa ibang subnet ang server, kailangan ng **relay agent** (`ip helper-address`) na magpapasa nito bilang unicast.',
        'Mga port: **UDP 67 (server)** at **UDP 68 (client)**. DNS: **UDP 53** (at TCP 53 para sa malalaking sagot).',
      ],
      technical: [
        'DHCP DORA: the client broadcasts DISCOVER (source 0.0.0.0, destination 255.255.255.255), servers answer with OFFER, the client broadcasts REQUEST for the chosen offer, and the server confirms with ACK. The lease carries address, mask, gateway, DNS and lease time. The client attempts renewal at 50% of the lease (T1, unicast to the server) and rebinding at 87.5% (T2, broadcast).',
        'A relay agent (ip helper-address on the client-facing interface) converts the broadcast into a unicast to the server and inserts its own interface address in the giaddr field so the server can select the right pool and reply. By default ip helper-address also forwards other UDP services (TFTP, DNS, NetBIOS, TACACS, time).',
        'DNS resolution: the host asks its configured resolver (recursive). The resolver queries root, TLD and authoritative servers if it has no cached answer and returns the result with a TTL. Records: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (name server), PTR (reverse), TXT.',
      ],
    },
    {
      type: 'analogy',
      title: 'Hotel at phonebook',
      body: [
        'DHCP is the hotel front desk that hands you a room number and key for a limited stay (lease). DNS is the directory in the lobby that tells you which room a guest is in. If the front desk is on another floor, a bellhop (relay agent) carries your request to it.',
      ],
      taglish: [
        'Ang **DHCP** ay **front desk ng hotel**: binibigyan ka ng numero ng kwarto at susi para sa limitadong pananatili (**lease**). Ang **DNS** ay **directory sa lobby** na nagsasabi kung saang kwarto naroon ang isang bisita. Kung nasa ibang palapag ang front desk, dadalhin ng **bellhop (relay agent)** ang hiling mo.',
      ],
    },
    {
      type: 'hook',
      title: 'DORA at 67/68',
      trick: '**DORA = Discover, Offer, Request, Ack. Server 67, Client 68. Relay = ip helper-address sa client-facing interface. 169.254 = walang DHCP.**',
      taglish: [
        '**D**iscover (broadcast) → **O**ffer → **R**equest (broadcast) → **A**ck.',
        '**UDP 67 = server, UDP 68 = client.**',
        '**ip helper-address <server>** sa interface na **nakaharap sa clients**, hindi sa server.',
        '**Renew sa 50%** (unicast), **rebind sa 87.5%** (broadcast). **169.254.x.x** = APIPA, walang sumagot.',
      ],
      test: {
        question: 'Sa aling interface ilalagay ang ip helper-address at ano ang itinuturo nito?',
        answer: 'Sa interface na nakaharap sa mga client (LAN ng mga PC), at itinuturo nito ang IP address ng DHCP server.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: DORA at ang buhay ng lease',
      paragraphs: [
        'Ang PC na bagong bukas ay walang address. **Discover**: nagpapadala ng broadcast mula 0.0.0.0 papunta sa 255.255.255.255 (UDP 68 → 67). Maaaring maraming server ang sumagot ng **Offer** na may iminumungkahing address. Pipili ang client at magpapadala ng **Request** (broadcast pa rin, para malaman ng ibang server na tinanggihan sila). Kukumpirmahin ng server ang **Ack** at nagsisimula ang lease.',
        'Sa kalagitnaan ng lease (**50%, T1**) susubukan ng client na mag-renew sa server (unicast). Kung bigo, sa **87.5% (T2)** magba-broadcast ito sa kahit anong server (rebinding). Kapag natapos ang lease nang walang tugon, babalik ito sa simula (Discover).',
        'Kung walang sumagot sa Discover, ang Windows ay magtatalaga ng **APIPA 169.254.0.0/16** sa sarili — walang gateway, kaya lokal lang ang usapan.',
      ],
      steps: [
        'Client: Discover (broadcast).',
        'Server: Offer (address, mask, gateway, DNS, lease).',
        'Client: Request (pumipili ng isang offer).',
        'Server: Ack — ang client ay may address.',
        '50%: renew (unicast). 87.5%: rebind (broadcast). Wala: restart o APIPA.',
      ],
      tricks: [
        'Ang Offer at Ack ay maaaring unicast o broadcast; ang Discover at Request ng client ay broadcast.',
        'Pagkatapos makita ang 169.254, tingnan muna ang cable, VLAN at ang DHCP server bago ang kahit ano pa.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Server, exclusions at relay',
      paragraphs: [
        'Sa router bilang DHCP server: **exclude muna** ang mga address na ililaan mo nang static (gateway, printer), saka gumawa ng pool: `ip dhcp excluded-address 192.168.10.1 192.168.10.20`, `ip dhcp pool USERS`, `network 192.168.10.0 255.255.255.0`, `default-router 192.168.10.1`, `dns-server 8.8.8.8`, `lease 7`.',
        'Kapag ang server ay nasa ibang subnet, ilagay sa client-facing interface ng router: `ip helper-address 10.0.0.5`. Idinadagdag ng router ang sariling interface address sa **giaddr** para alam ng server kung aling pool ang gagamitin. Ang server ay dapat may pool para sa subnet ng giaddr.',
        'Verification: `show ip dhcp binding` (mga lease), `show ip dhcp pool` (gamit), `show ip dhcp conflict` (nagbanggaan na address).',
      ],
      steps: [
        'ip dhcp excluded-address (global) para sa mga static na address.',
        'ip dhcp pool NAME → network, default-router, dns-server, lease.',
        'Para sa remote server: ip helper-address sa client-facing interface.',
        'show ip dhcp binding at show ip dhcp pool para i-verify.',
      ],
      tricks: [
        'Ang `ip dhcp excluded-address` ay global command, hindi nasa loob ng pool.',
        'Ang helper-address ay para sa ibang UDP service din (hindi lang DHCP) — gumagamit ng `no ip forward-protocol` para limitahan kung kailangan.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 3: Paano nire-resolve ng DNS ang pangalan',
      paragraphs: [
        'Ang PC ay may DNS server (galing sa DHCP). Tanong: “ano ang IP ng www.example.com?” Kung nasa cache ng resolver, sasagot agad. Kung wala, magtatanong ang **recursive resolver** sa **root**, tapos sa **TLD (.com)**, tapos sa **authoritative server** ng example.com, at ibabalik ang sagot sa PC kasama ang **TTL** (gaano katagal itong i-cache).',
        'Mga record: **A** = IPv4, **AAAA** = IPv6, **CNAME** = alias, **MX** = mail server, **NS** = name server ng zone, **PTR** = reverse lookup (IP → pangalan).',
        'Troubleshooting: `ping 8.8.8.8` ✔ pero `ping www.example.com` ✘ → DNS. `nslookup www.example.com` ay nagpapakita kung aling server ang sumagot. Sa router: `ip name-server 8.8.8.8`, `ip domain-lookup`, `ip domain-name lab.local`.',
      ],
      steps: [
        'PC → resolver (UDP 53): “A www.example.com?”',
        'Resolver: cache? Kung wala, root → TLD → authoritative.',
        'Resolver → PC: sagot at TTL.',
        'PC ay kumokonekta sa IP na natanggap.',
      ],
      tricks: [
        'Ang tamang pagkakasunod ng pagsisiyasat: IP muna (ping), saka pangalan (nslookup).',
        'Ang “Unknown command or computer name” sa router pagkatapos mag-typo ay dahil sinusubukan ng router na i-resolve ito — `no ip domain-lookup` para huwag maghintay.',
      ],
    },
    {
      type: 'remember',
      title: 'DHCP at DNS na lumalabas sa exam',
      items: [
        '**DORA: Discover, Offer, Request, Acknowledge. UDP 67 server, UDP 68 client.**',
        '**Renew sa 50% (unicast); rebind sa 87.5% (broadcast).** **169.254.x.x = APIPA.**',
        '**ip helper-address sa client-facing interface; itinuturo ang DHCP server.** **giaddr = sariling interface ng relay.**',
        '**ip dhcp excluded-address ay global; network/default-router/dns-server ay nasa pool.**',
        '**DNS: A = IPv4, AAAA = IPv6, CNAME = alias, MX = mail, NS, PTR. Ping IP ✔ pero pangalan ✘ = DNS.**',
      ],
    },
    { type: 'diagram', id: 'dhcp-dora', caption: 'DORA: Discover, Offer, Request, Acknowledge.' },
    {
      type: 'terms',
      items: [
        { term: 'Lease', definition: 'The time a DHCP client may use an address before it must renew.' },
        { term: 'Relay agent', definition: 'A router interface with ip helper-address that forwards DHCP broadcasts to a remote server as unicast.' },
        { term: 'giaddr', definition: 'Gateway IP address field set by the relay so the server picks the right pool and replies.' },
        { term: 'Excluded address', definition: 'An address that the DHCP server must not hand out.' },
        { term: 'Recursive resolver', definition: 'A DNS server that does the full lookup on behalf of clients and caches answers.' },
        { term: 'TTL', definition: 'How long a DNS answer may be cached.' },
        { term: 'A / AAAA record', definition: 'DNS records that map a name to an IPv4 or IPv6 address.' },
      ],
    },
    {
      type: 'flow',
      title: 'Mula power-on hanggang makapag-browse',
      steps: [
        'DHCP: DORA; natatanggap ang address, mask, gateway at DNS.',
        'ARP para sa gateway (o NDP sa IPv6).',
        'DNS: tanong ng A record sa resolver.',
        'TCP handshake papunta sa IP ng server.',
        'HTTP/HTTPS request at response.',
      ],
    },
    {
      type: 'cli',
      title: 'DHCP server na may relay',
      transcript: `R1(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.20
R1(config)# ip dhcp pool USERS
R1(dhcp-config)# network 192.168.10.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.10.1
R1(dhcp-config)# dns-server 8.8.8.8
R1(dhcp-config)# lease 7
R2(config)# interface gigabitEthernet 0/0
R2(config-if)# ip helper-address 10.0.0.5
R1# show ip dhcp binding
192.168.10.21   0100.5056.a1b2.c3   Nov 20 2026 09:00 AM   Automatic`,
      copyable: 'ip dhcp excluded-address 192.168.10.1 192.168.10.20\nip dhcp pool USERS\nnetwork 192.168.10.0 255.255.255.0\ndefault-router 192.168.10.1\ndns-server 8.8.8.8\nlease 7\ninterface gigabitEthernet 0/0\nip helper-address 10.0.0.5\nshow ip dhcp binding',
      explain: [
        { line: 'ip dhcp excluded-address 192.168.10.1 192.168.10.20', why: 'Keeps the first 20 addresses out of the pool so they can be used for static devices such as the gateway and printers.' },
        { line: 'ip helper-address 10.0.0.5', why: 'On the client-facing interface: forwards DHCP broadcasts to the server at 10.0.0.5 as unicast.' },
        { line: 'show ip dhcp binding', why: 'Lists every lease: address, client ID (MAC) and expiry.' },
      ],
      note: 'The helper-address belongs on the interface where the clients are, not on the interface toward the server.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **ip helper-address** ay inilalagay sa interface na **nakaharap sa clients**, hindi sa interface papunta sa server. Madalas itong mali sa exam.' },
    { type: 'callout', kind: 'trap', text: 'Ang **169.254.x.x** ay hindi galing sa DHCP server — ito ay address na ibinigay ng host sa sarili dahil **walang sumagot**.' },
    { type: 'callout', kind: 'tip', text: 'Kapag nagte-troubleshoot: ping 127.0.0.1 → sariling IP → gateway → 8.8.8.8 → pangalan. Doon mo makikita kung nasa DHCP, routing o DNS ang problema.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Putting ip helper-address on the server-facing interface.',
        'Forgetting to exclude the gateway and static addresses from the pool.',
        'Treating a 169.254 address as a DHCP-assigned address.',
        'Blaming DNS when the host has no IP at all.',
        'Missing a pool on the server for the relay’s giaddr subnet.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Walang IP ang PCs sa remote VLAN',
      scenario: 'PCs in VLAN 20 get 169.254.x.x. The DHCP server is at 10.0.0.5 behind R1. PCs in VLAN 10 on the same router work.',
      evidence: `R1# show running-config interface g0/1.20
interface GigabitEthernet0/1.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
R1# show running-config interface g0/1.10 | include helper
 ip helper-address 10.0.0.5`,
      question: 'Ano ang kulang?',
      answer: 'The VLAN 20 subinterface has no ip helper-address, so its DHCP broadcasts are not forwarded to the server.',
      fix: 'Add ip helper-address 10.0.0.5 to g0/1.20 and make sure the server has a pool for 192.168.20.0/24. Renew a client with ipconfig /renew and check show ip dhcp binding on the server.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang lease ay 8 oras. Kailan magsisimulang mag-renew ang client (unicast) at kailan mag-rebind (broadcast)?',
      answer: 'Renew at 50% = 4 hours (unicast to the server). Rebind at 87.5% = 7 hours (broadcast to any server).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'DORA, UDP 67/68.',
        'Relay command on the client-facing interface.',
        'Renew 50%, rebind 87.5%.',
        'Ping IP works but name fails = DNS.',
        'Know A, AAAA, CNAME, MX, NS, PTR.',
      ],
    },
    {
      type: 'summary',
      points: [
        'DHCP gives address, mask, gateway and DNS through DORA.',
        'A relay forwards broadcasts to a remote server.',
        'Leases renew at 50% and rebind at 87.5%.',
        'DNS resolves names recursively with caching and TTL.',
        'Test IP first, then names.',
        'Susunod: Layer 2 security deep dive.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'easy', type: 'single',
    prompt: 'On which interface should ip helper-address be configured?',
    choices: ['The interface facing the DHCP server', 'The interface facing the DHCP clients', 'Any loopback interface', 'The console line'], correct: [1],
    explanation: 'The relay is configured on the client-facing interface where the broadcasts arrive.',
    wrong: { 0: 'The broadcasts never arrive there.', 2: 'Loopbacks do not receive client broadcasts.', 3: 'The console line is not an interface for DHCP.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'medium', type: 'single',
    prompt: 'A client has a lease of 24 hours. When does it first try to renew?',
    choices: ['After 6 hours', 'After 12 hours', 'After 21 hours', 'After 24 hours'], correct: [1],
    explanation: 'The renewal timer T1 is 50% of the lease, which is 12 hours.',
    wrong: { 0: '25% is not a DHCP timer.', 2: '87.5% (21 hours) is the rebinding time.', 3: 'The lease would already have expired.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'medium', type: 'single',
    prompt: 'Which DHCP message does the client send after it receives one or more offers?',
    choices: ['Discover', 'Request', 'Acknowledge', 'Release'], correct: [1],
    explanation: 'The client sends a Request for the chosen offer; the server then confirms with an Acknowledge.',
    wrong: { 0: 'Discover is the first message.', 2: 'The server sends Acknowledge.', 3: 'Release is sent when giving up an address.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'medium', type: 'single',
    prompt: 'A host can ping 8.8.8.8 but not www.example.com. What is the most likely problem?',
    choices: ['Wrong default gateway', 'DNS resolution failure', 'Duplex mismatch', 'Native VLAN mismatch'], correct: [1],
    explanation: 'Reaching an IP but not a name points to DNS.',
    wrong: { 0: 'Pinging the remote IP shows the gateway works.', 2: 'A duplex mismatch causes errors, not name-only failures.', 3: 'A native VLAN mismatch is a Layer 2 trunk issue.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: an AAAA record maps a name to an IPv6 address.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'A maps to IPv4; AAAA maps to IPv6.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO statements about DHCP are correct?',
    choices: ['The server uses UDP port 67', 'The client uses UDP port 68', 'Discover is unicast to the server', 'DHCP uses TCP port 53'], correct: [0, 1],
    explanation: 'DHCP uses UDP 67 for the server and UDP 68 for the client. Discover is a broadcast and TCP 53 is DNS.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'protocol', front: 'Pro tip: DORA at ports?', back: 'DORA = Discover, Offer, Request, Ack. Server 67, Client 68. Relay = ip helper-address sa client-facing interface. 169.254 = walang DHCP.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'protocol', front: 'DHCP renew and rebind timers?', back: 'Renew at 50% (unicast); rebind at 87.5% (broadcast).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'command', front: 'Which command forwards DHCP broadcasts to a remote server?', back: 'ip helper-address <server> on the client-facing interface.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'protocol', front: 'What does the relay put in giaddr?', back: 'Its own interface address so the server can choose the pool.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'protocol', front: 'DNS record types?', back: 'A, AAAA, CNAME, MX, NS, PTR, TXT.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'concept', front: 'What does 169.254.x.x mean?', back: 'APIPA: no DHCP server replied.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D4', category: 'command', front: 'How do you keep addresses out of a DHCP pool?', back: 'ip dhcp excluded-address <low> <high> (global command).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'DHCP with a relay, then break DNS',
  tool: 'Packet Tracer',
  minutes: 40,
  objective: 'Build a DHCP server on one router, relay requests from a second subnet and distinguish a DHCP fault from a DNS fault.',
  steps: [
    'Build R1 (DHCP server, 10.0.0.1/24 toward R2) and R2 with a LAN 192.168.10.0/24. Route between them.',
    'On R1 create a pool for 192.168.10.0/24 with excluded addresses, default router and DNS server.',
    'Set a PC on the LAN to DHCP and observe that it gets 169.254 without the relay.',
    'Add ip helper-address 10.0.0.1 on R2’s LAN interface and renew the PC; check show ip dhcp binding.',
    'Add a DNS server with an A record for www.lab.local and test ping by name.',
    'Break DNS by removing the DNS address from the pool. Show that ping by IP works and by name fails; restore it.',
  ],
  checklist: [
    'PC receives a lease through the relay',
    'Binding visible on the server',
    'Name resolution works',
    'DNS fault separated from DHCP fault',
  ],
  hints: [
    'Use ipconfig /renew after each change.',
    'The helper-address goes on R2’s LAN interface.',
  ],
  solution: [
    'Without the relay the broadcast stops at R2, so the PC self-assigns 169.254.x.x.',
    'With ip helper-address on the LAN interface the PC receives 192.168.10.x.',
    'No DNS server in the lease means ping by IP works but ping by name fails.',
  ],
  breakIt: 'Put the helper-address on the interface toward R1 instead and explain why no lease is received.',
};
