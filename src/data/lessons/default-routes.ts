import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'default-routes';

export const lesson: Lesson = {
  id: ID,
  moduleId: '3.5',
  domain: 'D3',
  title: 'Default Routes: The Gateway of Last Resort',
  description: 'How a default route 0.0.0.0/0 sends everything unknown toward the internet or a hub, and how to configure and verify it on IPv4 routers.',
  whyMatters:
    'Walang router sa opisina na may ruta para sa buong internet. Ang default route ang sagot: "kung hindi ko alam, ipadala mo diyan". Madalas itong lumabas sa exam: ang command, ang S*, ang gateway of last resort, at ang paggamit nito sa stub network. Isa rin ito sa pinakamabilis na paraan para ayusin ang "walang internet".',
  objectives: [
    'Explain the purpose of a default route and the 0.0.0.0/0 prefix',
    'Configure an IPv4 default route with next hop or exit interface',
    'Read "Gateway of last resort" and the S* code in show ip route',
    'Explain why a default route matches only after more specific routes fail',
    'Describe how a default route can be propagated by OSPF (default-information originate)',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['default route', '0.0.0.0/0', 'gateway of last resort', 'S*', 'ip route 0.0.0.0 0.0.0.0', 'stub network', 'default-information originate', 'quad zero'],
  examObjectives: ['3.3'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A default route matches every destination. It is the route of last resort: the router only uses it when no more specific route matches. Edge routers use one to send all internet-bound traffic to the ISP, and branch routers use one to send everything to headquarters.',
        'The route is written 0.0.0.0 with mask 0.0.0.0, often called "quad zero". Because its prefix length is /0, it is the shortest possible match, so every other route wins over it first.',
      ],
      taglish: [
        'Ang **default route** ay **tumutugma sa lahat ng destination**. Ito ang **"huling pag-asa"**: **ginagamit lang ng router kapag walang mas tiyak na route**. Ginagamit ito ng **edge router** para **ipadala sa ISP ang lahat ng papuntang internet**, at ng **branch router** para **ipadala ang lahat sa headquarters**.',
        'Isinusulat ito bilang **0.0.0.0 na mask 0.0.0.0** ("quad zero"). Dahil **/0** ang prefix, **pinakamaikling tugma** ito, kaya **natatalo ito ng lahat ng ibang route**.',
        'Sa show ip route: **S*** = static default route, at **"Gateway of last resort is ... to network 0.0.0.0"**.',
        'Mainam ito sa **stub network**: **isang labasan lang**, kaya **isang default route ay sapat** at **hindi na kailangan ng maraming route**.',
      ],
      technical: [
        'Syntax: ip route 0.0.0.0 0.0.0.0 {<next-hop> | <exit-interface>} [<AD>]. The route is a candidate default (shown S*) and sets the gateway of last resort. IPv6 equivalent: ipv6 route ::/0 <next-hop>.',
        'Because 0.0.0.0/0 has prefix length 0, it matches every address but loses the longest prefix match to anything more specific. If no route at all matches and there is no default route, the packet is dropped with an ICMP destination unreachable.',
        'Stub networks (a single exit) typically need only a connected route plus a default route. The other side (the ISP or hub) must have a route back to the stub, for example a static route for the customer prefix; otherwise replies never return.',
        'A default route can also be learned dynamically: in OSPF, the router that has the default route configures default-information originate to advertise it to neighbours as an O*E2 route (AD 110). Alternatively an ISP DHCP lease can install a default via DHCP (ip address dhcp creates a default route with AD 254).',
        'Verification: show ip route (look for the Gateway of last resort line and S* 0.0.0.0/0), show ip route 0.0.0.0, ping a public address such as 8.8.8.8 and traceroute to see the first hop. A missing gateway of last resort line means no default route is installed.',
      ],
    },
    {
      type: 'analogy',
      title: 'Sagot ng information desk',
      body: [
        'If you ask a clerk for directions to a small street and she does not know it, she says "go to the main terminal, they will know". The main terminal is the default route: it handles everything the clerk cannot. But if she knows the street, she gives specific directions first.',
      ],
      taglish: [
        'Kapag **nagtanong ka sa clerk** kung paano pumunta sa **maliit na kalye** at **hindi niya alam**, sasabihin niya: **"pumunta ka sa main terminal, sila ang may alam"**. Ang **main terminal** ang **default route**: **hinahawakan ang lahat ng hindi alam ng clerk**. Pero kung **alam niya ang kalye**, **tiyak na direksyon ang ibibigay muna**.',
      ],
    },
    {
      type: 'hook',
      title: 'Quad-Zero: 0.0.0.0 0.0.0.0 = Huling Pag-asa',
      trick: '**ip route 0.0.0.0 0.0.0.0 <hop>** = **S***, **gateway of last resort**. **/0** = pinakamaikling tugma kaya **huling gagamitin**.',
      taglish: [
        '**Quad-zero**: **0.0.0.0 0.0.0.0**.',
        '**S*** sa routing table = **static default**.',
        '**Gateway of last resort** = ang next hop ng default route.',
        '**Pinakamaikling prefix (/0)** = **huling pipiliin** ng router.',
      ],
      test: {
        question: 'Anong command ang nagpapadala ng lahat ng hindi kilalang trapiko sa ISP router 203.0.113.2, at ano ang itatawag sa linya sa routing table?',
        answer: 'ip route 0.0.0.0 0.0.0.0 203.0.113.2. Lilitaw ito bilang S* 0.0.0.0/0 at gateway of last resort.',
      },
    },
    { type: 'diagram', id: 'default-route-stub', caption: 'Stub network: isang default route papunta sa ISP; may return route ang ISP papunta sa customer.' },
    {
      type: 'terms',
      items: [
        { term: 'Default route', definition: 'The route 0.0.0.0/0 that matches every destination not covered by a more specific route.' },
        { term: 'Gateway of last resort', definition: 'The next hop used by the default route.' },
        { term: 'S*', definition: 'Route code for a static route that is a candidate default.' },
        { term: 'Stub network', definition: 'A network with only one connection to the rest of the topology.' },
        { term: 'Quad zero', definition: 'Nickname for 0.0.0.0 0.0.0.0, the IPv4 default route.' },
        { term: 'default-information originate', definition: 'OSPF command that advertises the router\'s default route to its neighbours.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: papunta sa 8.8.8.8 ang packet ng PC',
      steps: [
        'Ipinapadala ng PC ang packet papunta sa 8.8.8.8 sa default gateway nito, R1.',
        'Hinahanap ng R1 ang 8.8.8.8 sa routing table; walang tugma sa connected o OSPF routes.',
        'Ang tanging tumutugma ay 0.0.0.0/0 (S*), kaya ito ang gagamitin.',
        'Ipinapadala ng R1 ang packet sa next hop na 203.0.113.2 (ISP).',
        'Itinutuloy ng ISP ang packet sa internet at bumabalik ang reply sa ruta ng ISP papunta sa customer.',
        'Kung wala ang default route, ibabagsak ng R1 ang packet at magpapadala ng destination unreachable.',
      ],
    },
    {
      type: 'cli',
      title: 'Mag-configure at magbasa ng default route',
      transcript: `R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.2
R1(config)# end
R1# show ip route
Gateway of last resort is 203.0.113.2 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.2
C     192.168.1.0/24 is directly connected, GigabitEthernet0/0
L     192.168.1.1/32 is directly connected, GigabitEthernet0/0
R1# ping 8.8.8.8
!!!!!

ISP(config)# ip route 192.168.1.0 255.255.255.0 203.0.113.1

R1(config-router)# default-information originate`,
      copyable: 'ip route 0.0.0.0 0.0.0.0 203.0.113.2',
      explain: [
        { line: 'ip route 0.0.0.0 0.0.0.0 203.0.113.2', why: 'Sends all traffic with no more specific route to the ISP at 203.0.113.2.' },
        { line: 'Gateway of last resort is 203.0.113.2', why: 'Confirms the default route is installed and shows its next hop.' },
        { line: 'S*  0.0.0.0/0 [1/0]', why: 'The static candidate default route with AD 1.' },
        { line: 'ip route 192.168.1.0 ... (on the ISP)', why: 'The return route to the customer; without it replies are lost.' },
        { line: 'default-information originate', why: 'Under router ospf, advertises this router\'s default route to its OSPF neighbours.' },
      ],
      note: 'Sample output for study.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show ip route', shows: 'The Gateway of last resort line and the S* 0.0.0.0/0 entry.' },
        { command: 'show ip route 0.0.0.0', shows: 'The default route entry and how it was learned.' },
        { command: 'ping 8.8.8.8 / traceroute 8.8.8.8', shows: 'Whether traffic leaves through the default route and where it stops.' },
        { command: 'show running-config | include ip route', shows: 'The configured default route.' },
      ],
      good: 'Gateway of last resort is set and a ping to an external address succeeds.',
      bad: 'Gateway of last resort is not set, or the next hop is unreachable so the route is not installed.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **default route ay huling gagamitin**, hindi una. Kung may **mas tiyak na route**, iyon ang panalo — dahil sa **longest prefix match**, ang **/0 ang pinakamaikli**.' },
    { type: 'callout', kind: 'trap', text: 'Hindi sapat ang default route sa **customer**: kailangan ding may **return route ang ISP** papunta sa network ng customer, kung hindi ay **mawawala ang reply**.' },
    { type: 'callout', kind: 'tip', text: 'Para sa **IPv6**, ang default route ay **::/0** (**ipv6 route ::/0 <next-hop>**). At sa **OSPF**, **default-information originate** ang nagpapakalat ng default.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Paglimot sa return route papunta sa customer network.',
        'Maling next hop kaya hindi nai-install ang default route.',
        'Pag-iisip na mas mataas ang prayoridad ng default route kaysa sa iba.',
        'Paggamit ng default route sa router na may maraming labasan nang walang plano.',
        'Pagkalito sa 0.0.0.0/0 at 0.0.0.0/32.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Walang internet kahit may default route"',
      scenario: 'Users cannot reach the internet. R1 was given a default route to the ISP, but show ip route does not list it.',
      evidence: `R1# show running-config | include ip route
ip route 0.0.0.0 0.0.0.0 203.0.113.9
R1# show ip route
Gateway of last resort is not set
C     203.0.113.0/30 is directly connected, GigabitEthernet0/1
R1# show ip interface brief | include Gi0/1
GigabitEthernet0/1  203.0.113.1  YES manual up up`,
      question: 'Bakit hindi naka-install ang default route?',
      answer: 'Ang next hop na 203.0.113.9 ay wala sa nakakonektang subnet (203.0.113.0/30), kaya hindi ito maaabot. Hindi naka-install ang static route kung walang route papunta sa next hop nito.',
      fix: 'Itama ang next hop sa tunay na address ng ISP sa link: no ip route 0.0.0.0 0.0.0.0 203.0.113.9, saka ip route 0.0.0.0 0.0.0.0 203.0.113.2. I-verify ang Gateway of last resort at ping 8.8.8.8.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang branch router R2 ay may isang link lang papunta sa headquarters (10.0.0.1). Isulat ang minimum na routing configuration ng R2, at sabihin kung ano ang kailangan ng headquarters.',
      answer: 'Sa R2: ip route 0.0.0.0 0.0.0.0 10.0.0.1. Sa headquarters: static route papunta sa LAN ng branch (halimbawa ip route 192.168.20.0 255.255.255.0 10.0.0.2) o OSPF para matuto nito, para may return route.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'IPv4 default route: ip route 0.0.0.0 0.0.0.0 <next-hop>; IPv6: ipv6 route ::/0 <next-hop>.',
        'S* is a static candidate default; "Gateway of last resort" shows its next hop.',
        'It is used only when no more specific route matches.',
        'Stub networks need one default route plus a return route on the other side.',
        'OSPF can advertise a default with default-information originate.',
      ],
    },
    {
      type: 'summary',
      points: [
        'The default route 0.0.0.0/0 sends everything unknown toward a single exit.',
        'It is the least specific route and is used last.',
        'Verify the Gateway of last resort and ping an external address.',
        'Always provide the return route on the provider or hub side.',
        'Susunod: Dynamic routing — kung bakit hindi sapat ang static.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'easy', type: 'single',
    prompt: 'Which command configures an IPv4 default route to 203.0.113.2?',
    choices: ['ip route 0.0.0.0 0.0.0.0 203.0.113.2', 'ip default-gateway 203.0.113.2', 'ip route default 203.0.113.2', 'route 0/0 203.0.113.2'], correct: [0],
    explanation: 'The default route uses network 0.0.0.0 and mask 0.0.0.0.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'easy', type: 'single',
    prompt: 'What does S* mean in the routing table?',
    choices: ['A summary route', 'A static route that is a candidate default', 'A secure route', 'A system route'], correct: [1],
    explanation: 'S* marks a static route that is a candidate default route.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'single',
    prompt: 'When is the default route used?',
    choices: ['Always, before other routes', 'Only when no more specific route matches', 'Only for IPv6', 'Only on switches'], correct: [1],
    explanation: 'The /0 prefix is the shortest match, so it is used only when nothing more specific matches.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'single',
    prompt: 'Which command advertises a default route to OSPF neighbours?',
    choices: ['default-information originate', 'network 0.0.0.0', 'ip default-network', 'redistribute default'], correct: [0],
    explanation: 'default-information originate under router ospf advertises the default route.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'hard', type: 'single',
    prompt: 'A router shows "Gateway of last resort is not set". What is the likely reason?',
    choices: ['No default route is installed', 'OSPF is disabled', 'The interface is shut down only', 'NAT is configured'], correct: [0],
    explanation: 'The line means no default route is installed, often because it is missing or its next hop is unreachable.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'single',
    prompt: 'What must an ISP router have so that replies reach a customer using a default route?',
    choices: ['A route to the customer network', 'A VLAN', 'A DHCP pool', 'An ACL'], correct: [0],
    explanation: 'A return route to the customer prefix is required.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'single',
    prompt: 'What is the IPv6 default route prefix?',
    choices: ['::1/128', '::/0', 'fe80::/10', '2000::/3'], correct: [1],
    explanation: 'The IPv6 default route is ::/0.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO describe a stub network?',
    choices: ['It has one connection to the rest of the network', 'It usually needs only a default route', 'It must run OSPF', 'It has many exits'], correct: [0, 1],
    explanation: 'A stub has a single exit, so a default route is usually enough.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D3', objective: '3.3', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a default route has priority over more specific routes.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — more specific routes win by longest prefix match.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D3', category: 'concept', front: 'Pro tip: default route?', back: 'Quad-zero 0.0.0.0 0.0.0.0 = huling pag-asa, S*, gateway of last resort. Pinakamaikling prefix (/0) kaya huling gagamitin. Kailangan ng return route sa ISP.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D3', category: 'command', front: 'Configure a default route?', back: 'ip route 0.0.0.0 0.0.0.0 <next-hop>   (IPv6: ipv6 route ::/0 <next-hop>)' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What does S* mean?', back: 'A static route that is a candidate default route; sets the gateway of last resort.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D3', category: 'concept', front: 'When is the default route used?', back: 'Only when no more specific route matches (longest prefix match).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D3', category: 'command', front: 'Advertise a default route in OSPF?', back: 'router ospf 1 → default-information originate' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D3', category: 'concept', front: 'What is a stub network?', back: 'A network with a single exit; it needs just a default route (and a return route at the provider).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Send everything to the ISP with a default route',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Configure a default route on a customer router and the matching return route on an ISP router.',
  topology: 'PC1 — R1 (Gi0/0 192.168.1.1/24, Gi0/1 203.0.113.1/30) — ISP (203.0.113.2/30) — Web (198.51.100.10).',
  steps: [
    'Configure all interface addresses and the PC default gateway.',
    'Ping 198.51.100.10 from PC1 and observe the failure.',
    'Add ip route 0.0.0.0 0.0.0.0 203.0.113.2 on R1.',
    'Run show ip route and find the Gateway of last resort and S*.',
    'Ping again; if it still fails, add ip route 192.168.1.0 255.255.255.0 203.0.113.1 on the ISP.',
    'Run traceroute to see the path through the default route.',
  ],
  checklist: [
    'Default route installed with S*',
    'Ping succeeds after adding the return route',
    'Traceroute shows R1 then the ISP',
  ],
  hints: [
    'The next hop must be on a directly connected subnet.',
    'If the request works but no reply returns, check the ISP return route.',
  ],
  solution: [
    'R1 has S* 0.0.0.0/0 via 203.0.113.2; the ISP has a static route back to 192.168.1.0/24.',
    'Traceroute shows 192.168.1.1, 203.0.113.2, then the destination.',
  ],
  breakIt: 'Change the default route next hop to an unused address on the link and see Gateway of last resort disappear if it is unreachable.',
};
