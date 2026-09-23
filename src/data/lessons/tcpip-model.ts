import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'tcpip-model';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.4',
  domain: 'D1',
  title: 'The TCP/IP Model, TCP and UDP',
  description: 'The four-layer model used in real networks, how it maps to OSI, and the two transport protocols you must be able to compare.',
  whyMatters:
    'TCP/IP is the model that real networks actually run on. And “TCP or UDP?” questions appear again and again — in application design, firewall rules, ACLs and troubleshooting.',
  objectives: [
    'Name the four TCP/IP layers and map them to OSI',
    'Compare TCP and UDP',
    'Describe the TCP three-way handshake',
    'Explain what a port number identifies',
    'Match common protocols to TCP or UDP',
  ],
  estimatedMinutes: 35,
  difficulty: 'beginner',
  keywords: ['TCP/IP', 'TCP', 'UDP', 'port', 'handshake', 'segment', 'datagram', 'reliable', 'connection-oriented'],
  examObjectives: ['1.5', '1.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'The TCP/IP model is the OSI model squeezed into four layers, and it matches the protocols we really use: Application, Transport, Internet and Network Access.',
        'At the Transport layer you choose between two styles: TCP is like a phone call (set it up, make sure everything arrives, in order) and UDP is like posting a postcard (fast, no guarantee).',
      ],
      taglish: [
        'Ang TCP/IP model ay apat na layer lang: Application, Transport, Internet, at Network Access. Ito ang ginagamit talaga ng mga network ngayon.',
        'Sa Transport layer, may dalawang pagpipilian: ang TCP ay parang tawag sa telepono — magkakausap muna kayo, sisiguraduhin na dumating lahat, at nasa tamang pagkakasunod-sunod. Ang UDP naman ay parang postcard — mabilis, pero walang kasiguraduhan na dumating.',
      ],
      technical: [
        'TCP/IP layers: Application (OSI 5–7), Transport (OSI 4), Internet (OSI 3) and Network Access (OSI 1–2). Some texts split Network Access into Data Link and Physical for a five-layer model; both views are common.',
        'TCP is connection-oriented and reliable: it establishes a session with a three-way handshake (SYN, SYN-ACK, ACK), numbers segments, acknowledges receipt, retransmits lost data and controls flow with windowing. UDP is connectionless: it sends datagrams with minimal overhead and provides no delivery guarantee, sequencing or retransmission.',
        'A port number identifies an application at the transport layer. Well-known ports are 0–1023, registered ports 1024–49151, and dynamic (ephemeral) ports 49152–65535. A client picks an ephemeral source port and connects to the server’s well-known destination port.',
      ],
    },
    {
      type: 'analogy',
      title: 'Registered delivery vs flyers',
      taglish: ['Ang TCP ay registered courier: tatawag muna, may numero at pirma ang bawat parcel, at ipapadala ulit ang nawala. Ang UDP ay pamimigay ng flyer sa mailbox — mabilis at mura, walang pipirma, at walang hahabol kung may nawala. Ang port ay ang numero ng departamento sa loob ng gusali.'],
      body: [
        'TCP is registered courier delivery: the courier phones ahead first (handshake), numbers every parcel, collects a signature for each one (acknowledgement), and re-sends anything that goes missing. UDP is dropping flyers into mailboxes: it is quick and cheap, nobody signs for anything, and if one flyer is lost nobody chases it.',
        'A port number is the department or desk within the building that the parcel is for — the address gets it to the building, the port gets it to the right person.',
      ],
    },
    {
      type: 'hook',
      title: 'May pirma ba o wala?',
      trick: '**TCP = Talagang may pirma (may resibo).** **UDP = Uy, Di Pirmado!** (walang resibo).',
      taglish: [
        '**TCP** ay parang **registered mail**: may kausapan muna (handshake), may **pirma** ng tumanggap (ACK), at kung may nawala, ipapadala ulit. Ang handshake ay tatlong linya: **“Hello?” — “Hello!” — “Sige, usap tayo.”** = **SYN — SYN-ACK — ACK**.',
        '**UDP** = **U**y, **D**i **P**irmado — parang namimigay ng flyer: mabilis, walang resibo, bahala na kung dumating. Kaya ito ang gamit ng video call, DNS, DHCP, NTP, at SNMP — mas mahalaga ang bilis kaysa sa pagiging perpekto.',
        'Ang **port** ay parang **numero ng departamento** sa loob ng building: ang address ang nagdadala sa building, ang port ang nagdadala sa tamang tao. At ang TCP/IP “Internet” layer ay ang **Layer 3** — hindi ang internet!',
      ],
      test: {
        question: 'Bakit UDP ang gamit ng video call, at ano ang tatlong hakbang ng TCP handshake?',
        answer: 'Mas mahalaga ang bilis: ang na-late na frame ay walang silbi kaya hindi na kailangan ng resibo/retransmit. Handshake: SYN — SYN-ACK — ACK (“Hello? — Hello! — Sige usap tayo”).',
      },
    },
    { type: 'diagram', id: 'tcpip-osi-map', caption: 'How the four TCP/IP layers line up with the seven OSI layers.' },
    {
      type: 'terms',
      items: [
        { term: 'Application (TCP/IP)', definition: 'Everything the application deals with: OSI layers 5, 6 and 7.' },
        { term: 'Transport', definition: 'End-to-end delivery and port numbers: TCP and UDP.' },
        { term: 'Internet', definition: 'IP addressing and routing (OSI Network layer). Not “the Internet” itself.' },
        { term: 'Network Access', definition: 'Local delivery and signalling: Ethernet, Wi-Fi (OSI layers 1–2).' },
        { term: 'TCP', definition: 'Connection-oriented, reliable, sequenced, flow-controlled transport.' },
        { term: 'UDP', definition: 'Connectionless, best-effort, low-overhead transport.' },
        { term: 'Three-way handshake', definition: 'SYN → SYN-ACK → ACK: how TCP opens a connection.' },
        { term: 'Port number', definition: 'A 16-bit value that identifies the application or service on a host.' },
        { term: 'Socket', definition: 'The combination of an IP address and a port, such as 203.0.113.10:443.' },
      ],
    },
    {
      type: 'flow',
      title: 'TCP three-way handshake, then data',
      steps: [
        'Client → server: SYN — “I would like to talk. My starting sequence number is X.”',
        'Server → client: SYN-ACK — “I agree. Here is my starting sequence number Y, and I acknowledge X.”',
        'Client → server: ACK — “Acknowledged.” The connection is established.',
        'Data segments flow. Each is numbered and the receiver acknowledges what it got; missing segments are retransmitted.',
        'When finished, the session is closed (FIN/ACK exchange).',
      ],
    },
    {
      type: 'list',
      variant: 'remember',
      title: 'Which one do they use? (memorise these pairs)',
      items: [
        'TCP: HTTP 80, HTTPS 443, SSH 22, Telnet 23, SMTP 25, FTP 20/21.',
        'UDP: DHCP 67/68, TFTP 69, SNMP 161/162, NTP 123, Syslog 514.',
        'DNS 53 uses UDP for normal queries and TCP for large responses and zone transfers.',
        'Real-time voice and video usually run over UDP (RTP), because a late packet is worse than a lost one.',
      ],
    },
    {
      type: 'cli',
      title: 'Seeing TCP and UDP on your own computer',
      transcript: `C:\\> netstat -an

  Proto  Local Address          Foreign Address        State
  TCP    192.168.1.23:52344     93.184.216.34:443      ESTABLISHED
  TCP    192.168.1.23:52351     142.250.190.14:443     ESTABLISHED
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING
  UDP    192.168.1.23:5353      *:*`,
      copyable: 'netstat -an',
      explain: [
        { line: 'netstat -an', why: 'Lists open connections and listening ports, showing addresses and ports numerically.' },
        { line: '192.168.1.23:52344 → …:443', why: 'A browser connection: an ephemeral source port (52344) talking to well-known destination port 443 (HTTPS).' },
        { line: 'ESTABLISHED', why: 'The TCP handshake completed and the session is open.' },
        { line: 'LISTENING', why: 'A service is waiting for incoming connections on that port.' },
        { line: 'UDP … *:*', why: 'UDP has no state column: it is connectionless, so there is no “established”.' },
      ],
      note: 'Sample output only. Cisco IOS has similar tools, but netstat is the quickest way to see ports on a PC.',
    },
    { type: 'callout', kind: 'trap', text: 'The TCP/IP “Internet” layer is the OSI Network layer (IP) — not “the Internet”. The exam will test that mapping: Network Access = OSI 1–2, Internet = OSI 3, Transport = OSI 4, Application = OSI 5–7.' },
    { type: 'callout', kind: 'trap', text: 'UDP is not “broken” — it is a deliberate choice. DHCP, DNS queries, NTP, SNMP and voice/video use it because low overhead or speed matters more than guaranteed delivery.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Common mistakes',
      items: [
        'Saying TCP is “always better”. It is more reliable, but slower and heavier.',
        'Thinking UDP applications have no reliability at all. The application can add its own checks on top.',
        'Forgetting that the source port is random. Only the destination port identifies the service.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting scenario: names fail, addresses work',
      scenario: 'After a firewall change, users can open https://203.0.113.10 but not https://example.com. The firewall now permits only TCP 80 and TCP 443 outbound.',
      question: 'What is missing from the rules?',
      answer: 'DNS. Resolving example.com needs DNS queries, which use UDP port 53 (and TCP 53 for large responses). Without them, names cannot be resolved even though the web ports are open.',
      fix: 'Permit UDP 53 and TCP 53 to the DNS server, then test with nslookup example.com.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge: TCP or UDP?',
      prompt: 'For each, decide TCP or UDP and give the port: (a) a secure web page, (b) a laptop obtaining an address automatically, (c) remote administration with encryption, (d) network time synchronisation.',
      answer: '(a) TCP 443. (b) UDP 67/68 (DHCP). (c) TCP 22 (SSH). (d) UDP 123 (NTP).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'TCP = connection-oriented, reliable, sequencing, acknowledgements, flow control, more overhead.',
        'UDP = connectionless, best effort, no sequencing, lower overhead.',
        'Know the handshake: SYN, SYN-ACK, ACK.',
        'DNS mostly uses UDP 53. If a question offers only one, pick UDP.',
      ],
    },
    {
      type: 'summary',
      points: [
        'TCP/IP has four layers: Application, Transport, Internet, Network Access.',
        'TCP is reliable and connection-oriented; UDP is fast and connectionless.',
        'Ports identify applications; clients use ephemeral source ports.',
        'Match protocols to TCP or UDP by what they need: reliability or speed.',
        'Next: Ethernet, the Network Access technology inside almost every LAN.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.5', difficulty: 'easy', type: 'single',
    prompt: 'Which TCP/IP layer corresponds to the OSI Network layer?',
    choices: ['Application', 'Transport', 'Internet', 'Network Access'], correct: [2],
    explanation: 'The TCP/IP Internet layer handles IP addressing and routing, matching OSI Layer 3.',
    wrong: { 0: 'Application covers OSI layers 5–7.', 1: 'Transport matches OSI Layer 4.', 3: 'Network Access covers OSI layers 1–2.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.5', difficulty: 'easy', type: 'single',
    prompt: 'Which statement is true about TCP but NOT about UDP?',
    choices: ['It uses port numbers', 'It provides sequencing and acknowledgements', 'It runs above IP', 'It carries application data'], correct: [1],
    explanation: 'TCP numbers segments and acknowledges them for reliable delivery. UDP does not.',
    wrong: { 0: 'Both use ports.', 2: 'Both run over IP.', 3: 'Both carry application data.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.5', difficulty: 'easy', type: 'single',
    prompt: 'What is the correct order of the TCP three-way handshake?',
    choices: ['ACK, SYN, SYN-ACK', 'SYN, SYN-ACK, ACK', 'SYN, ACK, FIN', 'SYN-ACK, SYN, ACK'], correct: [1],
    explanation: 'The client sends SYN, the server replies SYN-ACK, and the client confirms with ACK.',
    wrong: { 0: 'The connection is opened by SYN, not ACK.', 2: 'FIN closes a connection.', 3: 'SYN-ACK is the reply, not the opening.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.5', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO protocols normally use UDP?',
    choices: ['DHCP', 'SSH', 'NTP', 'HTTPS'], correct: [0, 2],
    explanation: 'DHCP (67/68) and NTP (123) use UDP. SSH (22) and HTTPS (443) use TCP.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.5', difficulty: 'easy', type: 'single',
    prompt: 'Which transport protocol and port does HTTPS use by default?',
    choices: ['UDP 443', 'TCP 80', 'TCP 443', 'UDP 80'], correct: [2],
    explanation: 'HTTPS uses TCP port 443. TCP 80 is plain HTTP.',
    wrong: { 0: 'HTTPS is TCP-based (HTTP/3 uses QUIC over UDP, but the standard exam answer is TCP 443).', 1: 'Port 80 is plain HTTP.', 3: 'HTTP is not UDP-based in the standard model.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.5', difficulty: 'medium', type: 'single',
    prompt: 'A client connects to a web server. Which port does the CLIENT typically use as its source port?',
    choices: ['80', '443', 'A random port from the dynamic range', '53'], correct: [2],
    explanation: 'Clients choose an ephemeral (dynamic) source port; only the server’s destination port is fixed.',
    wrong: { 0: '80 is the server’s destination port for HTTP.', 1: '443 is the server’s destination port for HTTPS.', 3: '53 is DNS.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.5', difficulty: 'medium', type: 'single',
    prompt: 'Why do real-time voice and video usually run over UDP?',
    choices: ['UDP is encrypted', 'A late packet is worse than a lost one, and UDP has less overhead', 'UDP guarantees delivery', 'TCP cannot carry audio'], correct: [1],
    explanation: 'Real-time media prefers speed over retransmission. Retransmitted audio arrives too late to be useful.',
    wrong: { 0: 'UDP is not inherently encrypted.', 2: 'UDP does not guarantee delivery.', 3: 'TCP can carry audio but with delay from retransmissions.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.5', difficulty: 'hard', type: 'single',
    prompt: 'Users can browse to https://203.0.113.10 but not to https://example.com. TCP 443 is permitted. What is the most likely missing rule?',
    choices: ['UDP/TCP 53 to the DNS server', 'TCP 22 to the web server', 'UDP 123 to the gateway', 'TCP 25 to the mail server'], correct: [0],
    explanation: 'Names need DNS to resolve. DNS uses port 53 (UDP for normal queries, TCP for large responses).',
    wrong: { 1: 'SSH is unrelated to browsing.', 2: 'NTP is time, not name resolution.', 3: 'SMTP is mail.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.5', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: in the TCP/IP model, the Transport layer provides end-to-end delivery and port numbers.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'TCP and UDP operate at the Transport layer and use port numbers to identify applications.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: TCP o UDP?', back: 'TCP = Talagang may pirma (resibo/ACK, reliable). UDP = Uy, Di Pirmado (walang resibo, mabilis). Handshake = “Hello? — Hello! — Sige usap tayo” = SYN, SYN-ACK, ACK.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'TCP/IP layers and their OSI equivalents?', back: 'Application (OSI 5–7), Transport (4), Internet (3), Network Access (1–2).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'protocol', front: 'TCP: five key characteristics?', back: 'Connection-oriented, reliable, sequencing, acknowledgements, flow control (windowing).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'protocol', front: 'UDP: key characteristics?', back: 'Connectionless, best effort, no sequencing or retransmission, low overhead.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'protocol', front: 'TCP three-way handshake?', back: 'SYN → SYN-ACK → ACK.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'port', front: 'Port ranges?', back: 'Well-known 0–1023, registered 1024–49151, dynamic/ephemeral 49152–65535.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'port', front: 'HTTP / HTTPS / SSH / Telnet ports?', back: 'TCP 80 / 443 / 22 / 23.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'port', front: 'DHCP, TFTP, NTP, SNMP, syslog ports?', back: 'UDP 67/68, 69, 123, 161/162, 514.' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'port', front: 'Which transport does DNS use?', back: 'Mostly UDP 53; TCP 53 for large responses and zone transfers.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Follow an HTTP request in Simulation mode',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Watch TCP and HTTP traffic between a PC and a web server, and identify the ports involved.',
  topology: 'PC1 ─── SW1 ─── Server1',
  addressing: [
    { device: 'PC1', interface: 'FastEthernet0', address: '192.168.1.11/24' },
    { device: 'Server1', interface: 'FastEthernet0', address: '192.168.1.10/24' },
  ],
  steps: [
    'Build PC1 ─ SW1 ─ Server1 and set the static addresses from the table.',
    'Click Server1 → Services → HTTP and make sure HTTP is On.',
    'On PC1 open Desktop → Web Browser. Browse to http://192.168.1.10 in Realtime mode and confirm the default page loads.',
    'Switch to Simulation mode. Edit Filters: show only HTTP, TCP, ARP and ICMP.',
    'Reload the page in the browser and press Capture/Forward repeatedly to step through the events.',
    'Click each envelope and read the PDU details. Find the events for the TCP handshake and for the HTTP request.',
    'Write down the source and destination ports on the request, and identify which one is the server’s well-known port.',
  ],
  checklist: [
    'Server1 HTTP service is on and the page loads',
    'You saw TCP events before the HTTP request',
    'You identified the destination port as 80',
    'You noticed the client’s source port is not 80',
  ],
  hints: [
    'If the page will not load, check both IP addresses and confirm the link lights are green.',
    'Packet Tracer’s event list names the protocol in each row — use it to filter.',
  ],
  solution: [
    'The destination port on the client-to-server segments is TCP 80 (HTTP).',
    'The source port on the client’s segments is a high, dynamically chosen port.',
    'The handshake (SYN, SYN-ACK, ACK) appears before the HTTP GET.',
  ],
  breakIt: 'Turn HTTP off on Server1 and reload. Observe what the browser reports, and which layer’s service is missing.',
};
