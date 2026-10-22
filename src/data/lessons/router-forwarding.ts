import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'router-forwarding';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.1',
  domain: 'D3',
  title: 'What a Router Actually Does: The Forwarding Decision',
  description: 'How a router receives a frame, strips the Layer 2 header, looks up the destination in its routing table and sends the packet out a new frame.',
  whyMatters:
    'Ang routing ang pinakamalaking bahagi ng CCNA (mga 25%). Lahat ng susunod — static routes, OSPF, ACL, NAT — ay nakabatay sa iisang tanong: ano ang ginagawa ng router sa isang packet? Kapag malinaw ito, madali nang intindihin kung bakit may "no route to host", bakit nagbabago ang MAC address sa bawat hop, at paano pinipili ang daan.',
  objectives: [
    'Describe the steps a router takes to forward a packet',
    'Explain why Layer 2 addresses change at every hop while Layer 3 addresses stay the same',
    'Distinguish the roles of the default gateway, the router interface and the next hop',
    'Explain what a router does when no route matches',
    'Follow a packet across two routers and name the source and destination MAC and IP at each stage',
  ],
  estimatedMinutes: 35,
  difficulty: 'beginner',
  keywords: ['router', 'forwarding', 'routing table', 'default gateway', 'next hop', 'ARP', 'decapsulation', 'TTL', 'longest prefix match', 'ICMP unreachable', 'hop'],
  examObjectives: ['3.2'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A router connects different networks and moves packets between them. When a frame arrives, the router opens it, reads the destination IP address, looks that address up in its routing table, and sends the packet out the interface that leads toward the destination, wrapped in a brand-new frame.',
        'The IP addresses in the packet stay the same from the source to the destination. The MAC addresses in the frame change at every router, because each hop is a different local link.',
      ],
      taglish: [
        'Ang **router** ay **nagkokonekta ng magkakaibang network** at **naglilipat ng packets sa pagitan nila**. Kapag dumating ang frame, **binubuksan ito ng router**, **binabasa ang destination IP**, **hinahanap ito sa routing table**, at **ipinapadala ang packet sa interface na papunta sa destination**, nakabalot sa **bagong frame**.',
        'Ang **IP address ay hindi nagbabago** mula source hanggang destination. Ang **MAC address ay nagbabago sa bawat router**, dahil **bawat hop ay ibang lokal na link**.',
        'Kapag **ang destination ay nasa labas ng sarili mong network**, **ipinapadala ng host ang packet sa default gateway** (ang router). Kapag **walang tugmang route** ang router, **ibinabagsak nito ang packet** at nagpapadala ng **ICMP "destination unreachable"**.',
        'Tandaan: **Layer 3 (IP) = end to end; Layer 2 (MAC) = hop to hop**.',
      ],
      technical: [
        'Forwarding process: (1) the router receives a frame on an interface and checks the destination MAC (its own interface or broadcast/multicast) and the FCS; (2) it decapsulates the frame and reads the packet header; (3) it decrements the TTL (and discards the packet with ICMP time exceeded if TTL reaches 0) and recomputes the header checksum; (4) it looks up the destination IP in the routing table using the longest prefix match; (5) it identifies the exit interface and next hop; (6) it resolves the next-hop (or destination, if directly connected) Layer 2 address using ARP (IPv4) or NDP (IPv6) and builds a new frame with its own interface MAC as source; (7) it sends the frame.',
        'The default gateway is a host setting: the address of a router interface on the host\'s own subnet. A host decides if a destination is local using its own mask (AND of its address and mask versus destination and mask). If remote, it ARPs for the gateway and sends the frame to the gateway MAC, while the packet destination remains the final IP address.',
        'If no route matches, and no default route exists, the router drops the packet and sends an ICMP destination unreachable message to the source. A route that exists but whose next hop cannot be resolved also results in a drop. Routers do not forward broadcasts, so each interface is a separate broadcast domain.',
        'Switching paths (process, fast, CEF) describe how routers speed this up; the CCNA focus is the logic. Verification: show ip route, show ip route <address> (the route used), show ip cef, show arp, ping and traceroute to follow the hops, debug ip packet (lab only).',
      ],
    },
    {
      type: 'analogy',
      title: 'Koreo at ang mga sorting center',
      body: [
        'A parcel travels through several sorting centres. The address on the parcel (IP) never changes, but at each centre it goes into a new delivery truck with a new label showing only the next stop (MAC). Each centre reads the destination, checks its list of routes, and picks the next truck. If the list has no entry for the address, the parcel is returned as undeliverable.',
      ],
      taglish: [
        'Dumadaan ang **parcel sa ilang sorting center**. Ang **address sa parcel (IP)** ay **hindi nagbabago**, pero **sa bawat center ay inilalagay ito sa bagong trak na may bagong label ng susunod na hintuan (MAC)**. Binabasa ng bawat center ang destination, **tinitingnan ang listahan ng ruta**, at **pumipili ng susunod na trak**. Kapag **walang entry sa listahan**, **ibinabalik** ang parcel bilang hindi maihatid.',
      ],
    },
    {
      type: 'hook',
      title: 'IP ay End-to-End, MAC ay Hop-by-Hop',
      trick: '**L3 (IP) = end to end**, **L2 (MAC) = hop by hop**. Router: **buksan → basahin IP → tingnan ang table → bagong frame**. Walang route = **drop + ICMP unreachable**.',
      taglish: [
        '**IP address**: **pareho** sa buong biyahe. **MAC address**: **nagbabago bawat hop**.',
        'Hakbang ng router: **buksan ang frame**, **basahin ang IP**, **hanapin sa routing table**, **bagong frame** palabas.',
        '**TTL** ay **bumababa ng 1** bawat router; kapag **0**, **bagsak** (ICMP time exceeded).',
        '**Walang route** = **ibagsak + ICMP destination unreachable**.',
      ],
      test: {
        question: 'Nagpadala ang PC1 (192.168.1.10) ng packet sa server 10.0.0.5 sa kabilang router. Ano ang source/destination IP at ang destination MAC sa unang frame?',
        answer: 'Source IP 192.168.1.10, destination IP 10.0.0.5 (hindi nagbabago). Ang destination MAC ng unang frame ay ang MAC ng default gateway (interface ng router), hindi ang server.',
      },
    },
    { type: 'diagram', id: 'router-hops', caption: 'Nananatili ang IP address sa buong biyahe; ang MAC address ay nagbabago sa bawat hop.' },
    {
      type: 'terms',
      items: [
        { term: 'Router', definition: 'A Layer 3 device that forwards packets between networks using a routing table.' },
        { term: 'Default gateway', definition: 'The router address on a host\'s own subnet that the host uses to reach other networks.' },
        { term: 'Next hop', definition: 'The address of the next router on the path to a destination.' },
        { term: 'Hop', definition: 'One router crossed by a packet. TTL decreases by 1 at each hop.' },
        { term: 'TTL', definition: 'Time to live: an IP header field decremented at each router; the packet is dropped at 0.' },
        { term: 'ARP', definition: 'Resolves a next-hop or destination IPv4 address to a MAC address on the local link.' },
        { term: 'Decapsulation / re-encapsulation', definition: 'The router removes the old Layer 2 header and builds a new one for the outgoing link.' },
        { term: 'Destination unreachable', definition: 'An ICMP message sent when a router has no route or cannot deliver the packet.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: PC1 papunta sa server na dalawang router ang layo',
      steps: [
        'Nakita ng PC1 na remote ang 10.0.0.5 (labas sa sarili nitong subnet), kaya ARP ito para sa MAC ng default gateway na R1.',
        'Nagpapadala ang PC1 ng frame: src MAC PC1, dst MAC R1; packet: src 192.168.1.10, dst 10.0.0.5.',
        'Binubuksan ng R1 ang frame, binabawasan ang TTL, hinahanap ang 10.0.0.5 sa routing table at nakitang ang next hop ay R2.',
        'Gumagawa ang R1 ng bagong frame: src MAC R1, dst MAC R2. Hindi nagbago ang IP.',
        'Inuulit ito ng R2; direkta nang konektado ang server, kaya ARP ang R2 para sa MAC ng server at ipinapadala ang frame na dst MAC server.',
        'Natanggap ng server ang packet na ang IP addresses ay pareho pa rin sa simula.',
      ],
    },
    {
      type: 'verify',
      title: 'Paano ito makikita',
      items: [
        { command: 'show ip route 10.0.0.5', shows: 'The route the router will use for that destination, with next hop and exit interface.' },
        { command: 'show arp', shows: 'IP-to-MAC mappings the router has learned for next hops and hosts.' },
        { command: 'traceroute 10.0.0.5', shows: 'Each router (hop) on the path and the response time.' },
        { command: 'ping 10.0.0.5', shows: 'Whether the destination answers; a "U" means a router replied unreachable.' },
      ],
      good: 'A matching route, an ARP entry for the next hop, and a successful ping.',
      bad: 'No route (unreachable), no ARP entry for the next hop, or TTL expiring in a loop.',
    },
    { type: 'callout', kind: 'trap', text: 'Sa bawat hop, **MAC ang nagbabago**, hindi IP (maliban kung may NAT). Kapag tinanong kung **ano ang destination MAC** ng frame mula sa PC papunta sa remote server, ang sagot ay **MAC ng default gateway**.' },
    { type: 'callout', kind: 'trap', text: 'Hindi **ino-ARP ng host ang remote destination**; **ang gateway ang inaARP**. Kung **mali o wala ang default gateway**, **hindi makakalabas** ang host sa sarili nitong subnet.' },
    { type: 'callout', kind: 'tip', text: 'Ang **traceroute ay gumagamit ng TTL**: nagpapadala ng packet na TTL 1, 2, 3… at **bawat router na nagbalik ng "time exceeded"** ay lumilitaw bilang hop.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pag-iisip na nagbabago ang IP address sa bawat router.',
        'Pag-iisip na MAC ng remote server ang destination MAC ng frame ng host.',
        'Paglimot sa default gateway ng host.',
        'Pag-iisip na nagpapasa ang router ng broadcast.',
        'Pagkalimot na mag-ARP ang router para sa susunod na hop.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Nakaka-ping ang PC sa gateway pero hindi sa labas"',
      scenario: 'PC1 pings its gateway but cannot reach any remote network.',
      evidence: `C:\\> ipconfig
   IPv4 Address. . . . . . . . . . . : 192.168.1.10
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.10.1
C:\\> ping 10.0.0.5
Destination host unreachable.`,
      question: 'Ano ang mali?',
      answer: 'Maling default gateway ang naka-set: 192.168.10.1 ay wala sa subnet ng PC (192.168.1.0/24). Hindi maabot ng PC ang gateway, kaya hindi ito makalabas sa labas ng sarili nitong network.',
      fix: 'Itakda ang default gateway sa address ng router interface na nasa 192.168.1.0/24 (halimbawa 192.168.1.1). Pagkatapos ay ulitin ang ping at traceroute.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang packet ay dumaan sa tatlong router bago nakarating sa destination. Ilang beses nabawasan ang TTL, at ilang beses nagbago ang frame header?',
      answer: 'Nabawasan ang TTL ng 3 (isa sa bawat router). Nagbago ang frame header ng 4 na beses: PC→R1, R1→R2, R2→R3, R3→destination (bawat link ay bagong frame).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Router steps: decapsulate, read destination IP, route lookup, re-encapsulate and send.',
        'IP addresses stay the same end to end (without NAT); MAC addresses change every hop.',
        'A host sends remote traffic to its default gateway MAC.',
        'No matching route and no default route: drop and ICMP destination unreachable.',
        'TTL decreases by 1 per hop; at 0 the packet is dropped.',
      ],
    },
    {
      type: 'summary',
      points: [
        'A router forwards packets by looking up the destination IP in its routing table.',
        'Layer 3 addresses are end to end; Layer 2 addresses change at every hop.',
        'Hosts use the default gateway for remote destinations.',
        'No route means drop and ICMP unreachable; TTL prevents endless loops.',
        'Susunod: Ang routing table — kung paano ito basahin.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'easy', type: 'single',
    prompt: 'What does a router use to decide where to forward a packet?',
    choices: ['The destination MAC address', 'The destination IP address and the routing table', 'The source port', 'The VLAN ID'], correct: [1],
    explanation: 'A router looks up the destination IP address in its routing table.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'easy', type: 'single',
    prompt: 'What happens to the MAC addresses as a packet crosses a router?',
    choices: ['They stay the same', 'They are replaced with new Layer 2 addresses for the next link', 'They become IP addresses', 'They are removed permanently'], correct: [1],
    explanation: 'The router builds a new frame with new source and destination MACs for the outgoing link.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'medium', type: 'single',
    prompt: 'PC1 sends a packet to a remote server. What is the destination MAC address of the frame leaving PC1?',
    choices: ['The server MAC', 'The default gateway MAC', 'The broadcast MAC', 'The switch MAC'], correct: [1],
    explanation: 'For a remote destination the host sends the frame to its default gateway MAC; the destination IP stays that of the server.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'medium', type: 'single',
    prompt: 'What does a router do with a packet when no route matches and there is no default route?',
    choices: ['Floods it out all interfaces', 'Drops it and may send an ICMP destination unreachable', 'Sends it to the switch', 'Queues it forever'], correct: [1],
    explanation: 'With no matching route the packet is discarded and an ICMP unreachable is typically returned.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'medium', type: 'single',
    prompt: 'What happens to the TTL as a packet passes through a router?',
    choices: ['It increases by 1', 'It decreases by 1', 'It is reset to 255', 'It is unchanged'], correct: [1],
    explanation: 'Each router decrements the TTL; the packet is dropped when it reaches 0.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'hard', type: 'single',
    prompt: 'A packet crosses three routers. How many different Layer 2 frames carry it from source to destination?',
    choices: ['1', '3', '4', '6'], correct: [2],
    explanation: 'Each link (source to R1, R1 to R2, R2 to R3, R3 to destination) uses a new frame: four links, four frames.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'medium', type: 'single',
    prompt: 'Which tool uses increasing TTL values to discover the routers along a path?',
    choices: ['ping', 'traceroute', 'nslookup', 'netstat'], correct: [1],
    explanation: 'Traceroute sends packets with TTL 1, 2, 3 and so on and records each router that replies time exceeded.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO values stay the same from source to destination in a routed path without NAT?',
    choices: ['Source IP address', 'Source MAC address', 'Destination IP address', 'Destination MAC address'], correct: [0, 2],
    explanation: 'IP addresses are end to end; MAC addresses change at every hop.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D3', objective: '3.2', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: routers forward broadcast frames to all connected networks.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — routers do not forward broadcasts; each interface is its own broadcast domain.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: IP vs MAC sa router?', back: 'IP = end to end, MAC = hop by hop. Router: buksan, basahin ang IP, tingnan ang table, bagong frame. Walang route = drop + ICMP unreachable. TTL -1 bawat hop.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Steps of the forwarding decision?', back: 'Receive frame, decapsulate, check TTL, route lookup (longest match), resolve next-hop MAC with ARP, build a new frame and send.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What changes and what stays across a router?', back: 'MAC addresses change at each hop; IP addresses stay the same end to end (absent NAT).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What does a host do for a remote destination?', back: 'Sends the frame to the default gateway MAC; the packet keeps the remote destination IP.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'concept', front: 'No matching route?', back: 'The router drops the packet and may return an ICMP destination unreachable.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'command', front: 'Find the route used for an address?', back: 'show ip route <address>  (and traceroute <address> to see each hop).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Watch addresses change hop by hop',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Follow one ping across two routers in simulation mode and record the MAC and IP addresses at each hop.',
  topology: 'PC1 (192.168.1.10) — R1 — R2 — Server (10.0.0.5); R1–R2 link 172.16.0.0/30.',
  steps: [
    'Configure addresses, default gateways and static routes so PC1 can ping the server.',
    'Switch to Simulation mode and filter to ICMP and ARP only.',
    'Send one ping from PC1 to the server and step through every event.',
    'At each device, open the PDU details and record source and destination MAC and IP.',
    'Fill a table with columns: link, src MAC, dst MAC, src IP, dst IP, TTL.',
    'Mark which columns changed between links and which stayed the same.',
  ],
  checklist: [
    'Ping succeeds end to end',
    'Table completed for all three links',
    'Identified that MAC changes and IP stays the same',
    'Observed TTL decreasing',
  ],
  hints: [
    'The first frame is an ARP for the default gateway.',
    'Routers need a route in both directions for the reply to return.',
  ],
  solution: [
    'Link 1: dst MAC = R1; link 2: dst MAC = R2; link 3: dst MAC = server; IP addresses unchanged.',
    'TTL starts at 128 on the PC and is reduced by 1 at each router.',
  ],
  breakIt: 'Remove the return route on R2 and watch the ping fail even though the request reaches the server.',
};
