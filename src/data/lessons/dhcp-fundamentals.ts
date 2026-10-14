import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'dhcp-fundamentals';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.1',
  domain: 'D4',
  title: 'DHCP Fundamentals: DORA, Leases and Options',
  description: 'How a host with no IP address at all gets an address, mask, gateway and DNS server automatically.',
  whyMatters:
    'Walang nagta-type ng IP address sa bawat laptop at phone sa isang opisina — DHCP ang gumagawa nito. Kapag sira ang DHCP, "walang internet" ang reklamo ng lahat, kaya kailangan mong makilala ang 169.254.x.x at malaman ang apat na hakbang ng DORA. Palaging lumalabas ito sa exam, lalo na ang pagkakasunod-sunod at kung unicast o broadcast ang bawat mensahe.',
  objectives: [
    'Explain what DHCP provides and why it is used',
    'List the four DORA messages in order and say which are broadcast or unicast',
    'Describe a lease, its renewal points (T1/T2) and what happens on expiry',
    'Recognise an APIPA address (169.254.0.0/16) and what it means',
    'Name the common DHCP options (default gateway, DNS server) and UDP ports 67 and 68',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['DHCP', 'DORA', 'Discover', 'Offer', 'Request', 'Acknowledge', 'lease', 'APIPA', '169.254', 'UDP 67', 'UDP 68'],
  examObjectives: ['4.3'],
  sections: [
    {
      type: 'explain',
      simple: [
        'When a laptop joins a network it has no IP address, so it cannot talk to anyone yet. DHCP solves this chicken-and-egg problem: the laptop shouts to everyone asking for a server, a DHCP server answers with an address to borrow, and the laptop confirms it will use it.',
        'The address is only leased for a set time. Halfway through, the laptop quietly asks to renew. If it can never reach a DHCP server, it gives itself a 169.254.x.x address, which is a clear sign that DHCP has failed.',
      ],
      taglish: [
        'Pagpasok mo sa isang network, **wala ka pang IP address**. Hindi ka makakausap ng kahit sino — **chicken-and-egg** na problema. Ang **DHCP** ang sagot: **sumisigaw ka sa lahat** ng "may DHCP server ba?", may sasagot ng **iaalok na address**, at **kukumpirmahin** mo.',
        'Apat na mensahe ito: **DORA** — **D**iscover, **O**ffer, **R**equest, **A**cknowledge.',
        '**Hiram lang** ang address — may **lease time**. Sa kalahati ng lease, **kusang magre-renew** ang client. Kapag **hindi maabot ang DHCP server**, ang client ay mag-a-assign sa sarili ng **169.254.x.x** (APIPA) — ito ang **palatandaan** na sira ang DHCP.',
        'Bukod sa IP address at mask, nagbibigay din ang DHCP ng **default gateway** at **DNS server** — kaya "kumpleto" ang makukuha mo.',
      ],
      technical: [
        'DHCP (RFC 2131) runs over UDP: servers listen on port 67 and clients use port 68. A client without an address sends from 0.0.0.0 to the limited broadcast 255.255.255.255 (and Layer 2 broadcast ffff.ffff.ffff).',
        'DORA: (1) DHCPDISCOVER — client broadcast looking for servers. (2) DHCPOFFER — a server proposes an address, mask, lease time and options (often unicast to the client MAC, depending on the broadcast flag). (3) DHCPREQUEST — client broadcast accepting one offer; because it is broadcast, other servers learn their offers were declined. (4) DHCPACK — server confirms the lease and the client may use the address.',
        'A lease has a duration. At 50% (T1) the client unicasts a DHCPREQUEST to the original server to renew; at 87.5% (T2) it broadcasts to any server (rebinding). On expiry with no renewal the address is released and the process restarts. A client can release early with DHCPRELEASE. DHCPNAK refuses a request.',
        'Common options: 3 default gateway, 6 DNS servers, 15 domain name, 51 lease time, 66/150 TFTP server (used by IP phones). Clients that cannot find a server fall back to APIPA 169.254.0.0/16 in Windows and many other systems.',
        'Client verification: ipconfig /all, ipconfig /release, ipconfig /renew on Windows; ip addr or dhclient on Linux. On a Cisco router interface: ip address dhcp, then show ip interface brief.',
      ],
    },
    {
      type: 'analogy',
      title: 'Hotel front desk',
      body: [
        'You arrive at a hotel and ask the lobby, "Is there a room for me?" The front desk offers room 412, you say "I\'ll take 412", and they confirm and hand over the key card, valid until check-out. Halfway through your stay you might extend it. If the front desk is closed, you sleep on the lobby sofa — a temporary arrangement that tells everybody something is wrong.',
      ],
      taglish: [
        'Dumating ka sa hotel at sumigaw sa lobby, **"May kuwarto ba para sa akin?"** (**Discover**). Nag-alok ang front desk ng **kuwarto 412** (**Offer**). Sinabi mo, **"Kukunin ko ang 412"** (**Request**). Kinumpirma nila at ibinigay ang **key card** (**Acknowledge**) — valid hanggang **check-out** (lease). Kapag **sarado ang front desk**, sa **sofa** ka matutulog — pansamantala at **halatang may mali** (APIPA 169.254).',
      ],
    },
    {
      type: 'hook',
      title: 'DORA: Discover, Offer, Request, Acknowledge',
      trick: '**DORA**: **D**iscover, **O**ffer, **R**equest, **A**cknowledge. **Client**: D at R. **Server**: O at A.',
      taglish: [
        '**D-O-R-A** — parang si Dora the Explorer: **naghahanap ng address**.',
        '**Client ang nagsasalita sa D at R**; **Server ang sumasagot sa O at A**.',
        'Ang **Discover at Request** ay **broadcast** (dahil wala pang IP ang client).',
        '**UDP**: server **67**, client **68**. Kapag **169.254.x.x** ang nakita mo — **wala talagang DHCP server na nasagot**.',
      ],
      test: {
        question: 'Ano ang apat na mensahe ng DHCP sa pagkakasunod-sunod, at alin ang galing sa server?',
        answer: 'Discover (client), Offer (server), Request (client), Acknowledge (server). Server ang nagpapadala ng Offer at Acknowledge.',
      },
    },
    { type: 'diagram', id: 'dhcp-dora', caption: 'Ang DORA: Discover at Request ay broadcast; Offer at Acknowledge ay galing sa server.' },
    {
      type: 'terms',
      items: [
        { term: 'DHCP', definition: 'Dynamic Host Configuration Protocol: automatically assigns IP address, mask, gateway and DNS to clients.' },
        { term: 'DORA', definition: 'Discover, Offer, Request, Acknowledge: the four-message exchange to obtain a lease.' },
        { term: 'Lease', definition: 'The time a client is allowed to use an assigned address before it must renew.' },
        { term: 'APIPA', definition: 'Automatic Private IP Addressing: a self-assigned 169.254.0.0/16 address used when no DHCP server answers.' },
        { term: 'Scope / pool', definition: 'The range of addresses a server may hand out.' },
        { term: 'DHCP option', definition: 'Extra settings sent with a lease, such as default gateway (3) and DNS server (6).' },
        { term: 'UDP 67 / 68', definition: 'Server port and client port used by DHCP.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: unang beses na pagkuha ng address',
      steps: [
        'Walang IP address ang PC1 (0.0.0.0). Nagpapadala ito ng DHCPDISCOVER sa broadcast 255.255.255.255.',
        'Natatanggap ng DHCP server ang broadcast at pumipili ng libreng address sa pool.',
        'Nagpapadala ang server ng DHCPOFFER: address, mask, gateway, DNS at lease time.',
        'Pinipili ng PC1 ang offer at nagpapadala ng DHCPREQUEST (broadcast) para humingi ng address na iyon.',
        'Kinukumpirma ng server ng DHCPACK. Opisyal na itong na-lease.',
        'Gumagamit na ng address ang PC1. Sa 50% ng lease, magre-renew ito nang unicast sa server.',
      ],
    },
    {
      type: 'cli',
      title: 'Tingnan ang DHCP lease sa Windows at sa router',
      transcript: `C:\\> ipconfig /all
   DHCP Enabled. . . . . . . . : Yes
   IPv4 Address. . . . . . . . : 192.168.10.25
   Subnet Mask . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . : 192.168.10.1
   DHCP Server . . . . . . . . : 192.168.10.1
   DNS Servers . . . . . . . . : 192.168.10.1
   Lease Obtained. . . . . . . : Monday, 9:00:12 AM
   Lease Expires . . . . . . . : Tuesday, 9:00:12 AM

R2(config)# interface gi0/1
R2(config-if)# ip address dhcp
R2(config-if)# no shutdown
R2# show ip interface brief
Interface        IP-Address       OK? Method Status    Protocol
GigabitEthernet0/1 203.0.113.50   YES DHCP   up        up`,
      copyable: 'ipconfig /all',
      explain: [
        { line: 'DHCP Enabled: Yes', why: 'This host is configured to ask for its address automatically.' },
        { line: 'DHCP Server: 192.168.10.1', why: 'The server that granted the lease — the one it will renew with.' },
        { line: 'Lease Expires', why: 'The time after which the client must have renewed or lose the address.' },
        { line: 'ip address dhcp', why: 'Makes a router interface act as a DHCP client, as ISP-facing interfaces often do.' },
        { line: 'Method DHCP', why: 'show ip interface brief shows how the address was learned: manual, DHCP, or unset.' },
      ],
      note: 'Sample output for study; addresses will differ in your lab.',
    },
    { type: 'callout', kind: 'trap', text: 'Kapag **169.254.x.x** ang IP ng isang PC, **hindi ito galing sa DHCP server** — ito ay **APIPA**, ang sariling-bigay ng PC dahil **walang sumagot**. Ang problema ay nasa DHCP (server, relay, o cable), hindi sa PC mismo.' },
    { type: 'callout', kind: 'trap', text: 'Ang **Discover** ay **broadcast**, pero ang **Offer** ay maaaring **unicast** pabalik sa client. At ang **Request** ay **broadcast** din, para malaman ng ibang server na hindi napili ang kanilang offer.' },
    { type: 'callout', kind: 'tip', text: '**UDP 67 = server, UDP 68 = client.** Kung may tanong na "aling port ang ginagamit ng DHCP server?", **67**. Pareho silang **UDP**, hindi TCP.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Maling pagkakasunod-sunod ng DORA (halimbawa, Offer bago Discover).',
        'Isiping TCP ang DHCP; UDP ito.',
        'Isiping ang 169.254.x.x ay galing sa DHCP server.',
        'Pagsasama sa DHCP server at DHCP client ports (67 at 68).',
        'Hindi pagsama ng default gateway sa pool, kaya may IP pero walang internet.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "May network pero hindi makalabas"',
      scenario: 'A new laptop joined the Wi-Fi but the user can open nothing, not even internal sites.',
      evidence: `C:\\> ipconfig
   IPv4 Address. . . . . . . . : 169.254.88.17
   Subnet Mask . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . :`,
      question: 'Ano ang ipinapakita ng 169.254.88.17, at ano ang susunod mong titingnan?',
      answer: 'Ito ay APIPA: hindi nakakuha ng sagot ang laptop sa DHCP Discover. Walang DHCP server na naabot, o hindi nakakarating ang broadcast.',
      fix: 'Check the Layer 1/2 path first (link up, correct VLAN or SSID), then verify a DHCP server or relay exists for that VLAN and that its pool is not exhausted. Finally run ipconfig /release and ipconfig /renew.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Bakit broadcast ang DHCPDISCOVER, at bakit broadcast pa rin ang DHCPREQUEST kahit pumili na ang client ng isang server?',
      answer: 'Walang IP address ang client at hindi nito alam ang address ng server, kaya broadcast ang Discover. Broadcast din ang Request para malaman ng lahat ng server na nag-alok na isa lang ang tinanggap, at puwedeng ilabas ang iba pa nilang inalok na address.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'DORA = Discover, Offer, Request, Acknowledge, in that order.',
        'Server listens on UDP 67; client uses UDP 68.',
        '169.254.0.0/16 means APIPA: DHCP failed.',
        'Lease renewals: T1 at 50% (unicast), T2 at 87.5% (broadcast).',
        'DHCP typically provides address, mask, default gateway and DNS server.',
      ],
    },
    {
      type: 'summary',
      points: [
        'DHCP automatically gives hosts an address, mask, gateway and DNS server.',
        'DORA: Discover (client), Offer (server), Request (client), Acknowledge (server), over UDP 67/68.',
        'Leases expire and are renewed at 50% of their time.',
        'A 169.254.x.x address means DHCP did not answer.',
        'Susunod: DHCP server at relay — paano mag-configure at paano maabot ang server sa ibang network.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'easy', type: 'single',
    prompt: 'What is the correct order of DHCP messages?',
    choices: ['Offer, Discover, Request, Acknowledge', 'Discover, Offer, Request, Acknowledge', 'Request, Offer, Discover, Acknowledge', 'Discover, Request, Offer, Acknowledge'], correct: [1],
    explanation: 'DORA: Discover, Offer, Request, Acknowledge.',
    wrong: { 0: 'The client must start with Discover.', 2: 'Request follows the Offer.', 3: 'The server Offers before the client Requests.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'easy', type: 'single',
    prompt: 'Which transport protocol and server port does DHCP use?',
    choices: ['TCP 67', 'UDP 67', 'UDP 53', 'TCP 80'], correct: [1],
    explanation: 'DHCP uses UDP; the server listens on 67 and the client uses 68.',
    wrong: { 0: 'DHCP is not TCP.', 2: 'UDP 53 is DNS.', 3: 'TCP 80 is HTTP.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'easy', type: 'single',
    prompt: 'A PC shows the IP address 169.254.20.5. What does this indicate?',
    choices: ['It received a valid lease', 'No DHCP server answered and it used APIPA', 'It is using a static address', 'It is on the internet'], correct: [1],
    explanation: '169.254.0.0/16 is the APIPA range, self-assigned when DHCP fails.',
    wrong: { 0: 'A valid lease would be from the configured pool.', 2: 'A static address would be chosen by an admin.', 3: 'APIPA addresses are not routable.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'medium', type: 'single',
    prompt: 'Which DHCP message is sent by the server to propose an address?',
    choices: ['DHCPDISCOVER', 'DHCPOFFER', 'DHCPREQUEST', 'DHCPRELEASE'], correct: [1],
    explanation: 'The server answers a Discover with an Offer.',
    wrong: { 0: 'Sent by the client.', 2: 'Sent by the client.', 3: 'Sent by the client to give up a lease.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'medium', type: 'single',
    prompt: 'Why is the DHCPDISCOVER sent as a broadcast?',
    choices: ['To encrypt the message', 'The client has no IP address and does not know the server', 'Because UDP only supports broadcast', 'To reach the internet'], correct: [1],
    explanation: 'The client has no address yet and cannot know where a server is.',
    wrong: { 0: 'Broadcasts are not encrypted.', 2: 'UDP supports unicast too.', 3: 'DHCP is local-scope.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'medium', type: 'single',
    prompt: 'When does a DHCP client first try to renew its lease?',
    choices: ['At 25% of the lease', 'At 50% of the lease', 'At 100% of the lease', 'Only on reboot'], correct: [1],
    explanation: 'T1 is at 50% of the lease time, when the client unicasts a renewal to the original server.',
    wrong: { 0: 'Too early.', 2: 'By then the lease is expiring.', 3: 'Renewal is timer-based.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are messages sent by the DHCP client?',
    choices: ['DHCPDISCOVER', 'DHCPOFFER', 'DHCPREQUEST', 'DHCPACK'], correct: [0, 2],
    explanation: 'The client sends Discover and Request; the server sends Offer and Acknowledge.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.3', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: DHCP can supply the default gateway and DNS server in addition to the IP address.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — these are delivered as DHCP options along with the lease.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'medium', type: 'single',
    prompt: 'Which router interface command makes it obtain its address from an ISP DHCP server?',
    choices: ['ip dhcp client', 'ip address dhcp', 'ip helper-address', 'dhcp enable'], correct: [1],
    explanation: 'ip address dhcp configures the interface as a DHCP client.',
    wrong: { 0: 'Not a valid IOS command.', 2: 'That forwards broadcasts to a server (relay).', 3: 'Not a valid IOS command.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: paano tandaan ang DHCP?', back: 'DORA: Discover, Offer, Request, Acknowledge. Client = D at R; Server = O at A. UDP server 67, client 68. 169.254.x.x = APIPA, walang sumagot.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'protocol', front: 'What does DHCP provide?', back: 'IP address, subnet mask, default gateway, DNS server and a lease time.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'port', front: 'DHCP ports?', back: 'UDP 67 (server) and UDP 68 (client).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'concept', front: 'What is APIPA?', back: 'Self-assigned 169.254.0.0/16 address when no DHCP server answers — a sign DHCP failed.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'concept', front: 'When does a client renew its lease?', back: 'At 50% (T1) by unicast to the original server; at 87.5% (T2) by broadcast to any server.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'command', front: 'Windows commands to refresh DHCP?', back: 'ipconfig /release then ipconfig /renew; ipconfig /all shows the lease details.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D4', category: 'command', front: 'Make a router interface a DHCP client?', back: 'interface gi0/1 → ip address dhcp → no shutdown.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Watch DORA happen in Packet Tracer simulation mode',
  tool: 'Packet Tracer',
  minutes: 20,
  objective: 'Observe the four DHCP messages in simulation mode and read a client lease.',
  topology: 'PC1 — SW1 — R1 (R1 acts as the DHCP server for 192.168.10.0/24).',
  steps: [
    'On R1 Gi0/0: ip address 192.168.10.1 255.255.255.0, no shutdown. Configure a pool (see the next lesson) or use the Packet Tracer server.',
    'On PC1 set IP Configuration to DHCP.',
    'Switch to Simulation mode, filter to DHCP only, and request an address.',
    'Step through each packet and note its type: Discover, Offer, Request, ACK.',
    'In PC1 Command Prompt run ipconfig /all and record the lease information.',
    'Disconnect the server and run ipconfig /renew; notice PC1 falls back to 169.254.x.x.',
  ],
  checklist: [
    'Saw all four DORA packets in order',
    'Identified which packets were broadcast',
    'Read the DHCP server and lease from ipconfig /all',
    'Reproduced an APIPA address by removing the server',
  ],
  hints: [
    'Use the event list filter so only DHCP traffic is shown.',
    'APIPA appears after the client times out waiting for an Offer.',
  ],
  solution: [
    'Discover (client broadcast), Offer (server), Request (client broadcast), ACK (server).',
    'ipconfig /all shows the DHCP server address and lease times.',
    'Without a server, the client assigns itself 169.254.x.x.',
  ],
  breakIt: 'Place PC1 in a different VLAN from the DHCP server and observe the Discover never reaching the server.',
};
