import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ipv6-configuration';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.16',
  domain: 'D1',
  title: 'IPv6 Configuration: Addresses, SLAAC and Verification',
  description: 'Configure IPv6 on routers and hosts, understand neighbour discovery and SLAAC, and verify every address with the right show commands.',
  whyMatters:
    'Alam mo na ang IPv6 address types. Ngayon ay kailangan mong mag-configure nito at basahin ang output. Sa exam, may tanong tungkol sa tamang command, sa EUI-64, sa SLAAC at sa show ipv6 interface brief. Madali ito kapag may sistema.',
  objectives: [
    'Enable IPv6 routing and configure global, EUI-64 and link-local addresses',
    'Explain RS/RA, NS/NA and duplicate address detection',
    'Compare SLAAC, stateless DHCPv6 and stateful DHCPv6',
    'Verify with show ipv6 interface brief, show ipv6 route and ping',
    'Troubleshoot a missing ipv6 unicast-routing',
  ],
  estimatedMinutes: 45,
  difficulty: 'exam',
  keywords: ['IPv6', 'ipv6 unicast-routing', 'ipv6 address', 'EUI-64', 'SLAAC', 'DHCPv6', 'neighbour discovery', 'router advertisement', 'show ipv6 interface brief', 'link-local'],
  examObjectives: ['1.8', '1.9'],
  sections: [
    {
      type: 'explain',
      simple: [
        'On a router, IPv6 needs two things: an address on each interface and the global command ipv6 unicast-routing so the router actually forwards IPv6 packets.',
        'Hosts do not need to be configured by hand. They listen for the router’s announcement and build their own address (SLAAC).',
      ],
      taglish: [
        'Sa router, dalawa ang kailangan: **IPv6 address sa interface** at ang global command na **`ipv6 unicast-routing`** para talagang mag-forward ito ng IPv6 packets. Kung wala ang command na iyon, ang router ay parang host lang — hindi magro-route.',
        'Ang host ay **hindi kailangang manu-manong i-configure**. Naririnig nito ang **Router Advertisement (RA)** na may prefix, tapos siya mismo ang bumubuo ng address niya — ito ang **SLAAC** (Stateless Address Autoconfiguration).',
        'Bawat IPv6 interface ay may **link-local address (FE80::/10)** kahit walang global address. Ito ang ginagamit ng NDP at ng routing protocols para sa kapitbahay.',
      ],
      technical: [
        'ipv6 unicast-routing enables forwarding and makes the router send Router Advertisements. An interface address is configured with ipv6 address <prefix>/<length>, with the eui-64 keyword to build the interface ID from the MAC, or with link-local to set FE80:: manually.',
        'Neighbour Discovery (ICMPv6) replaces ARP: Neighbour Solicitation and Advertisement resolve addresses (solicited-node multicast ff02::1:ffXX:XXXX), Router Solicitation (to ff02::2) and Advertisement (to ff02::1) deliver prefix and gateway information, and Duplicate Address Detection sends an NS for the host’s own address before using it.',
        'SLAAC uses the RA prefix plus a self-generated interface ID (EUI-64 or random) and gets the default gateway from the RA source. Stateless DHCPv6 adds options such as DNS (RA with the O flag); stateful DHCPv6 assigns the address (M flag). The ICMPv6 RA is sent every 200 seconds by default and on request.',
      ],
    },
    {
      type: 'analogy',
      title: 'Bagong lipat na bahay',
      body: [
        'A new neighbour asks the street “is anyone using this house number?” (DAD). When nobody objects, they use it. The barangay announcement board (the router advertisement) tells everyone the street name (prefix) so each household builds its own full address.',
      ],
      taglish: [
        'Parang bagong lipat sa kalye. Una, sumisigaw ka: “May gumagamit ba ng numerong ito?” (**DAD**). Kapag walang sumagot, gagamitin mo na. Ang **announcement board ng barangay (RA)** ang nagsasabi ng **pangalan ng kalye (prefix)**, tapos ikaw na ang bumubuo ng buong address mo: pangalan ng kalye + numero ng bahay (interface ID).',
      ],
    },
    {
      type: 'hook',
      title: 'UNICAST-ROUTING muna',
      trick: '**ipv6 unicast-routing = PANGGISING NG ROUTER. EUI-64 = MAC + FFFE sa gitna + baligtad ang ika-7 bit. SLAAC = prefix galing RA + sariling ID.**',
      taglish: [
        '**ipv6 unicast-routing** — global command; kung wala ito, hindi magro-route at hindi magpapadala ng RA ang router.',
        '**EUI-64**: kunin ang MAC (48 bits), ipasok ang **FFFE** sa gitna, **baligtarin ang ika-7 bit** (00 → 02). Halimbawa 0000.0c12.3456 → 0200:0cff:fe12:3456.',
        '**SLAAC** = prefix mula sa RA + interface ID na sarili mong ginawa; gateway = source ng RA.',
        '**DAD** = bago gamitin ang address, tinatanong sa sarili: may kapareho ba? (NS sa sariling address).',
      ],
      test: {
        question: 'Bakit hindi nagbibigay ng RA ang router kahit may IPv6 address ang interface?',
        answer: 'Malamang kulang ang `ipv6 unicast-routing`. Kung wala ito, hindi ito kumikilos bilang IPv6 router at hindi nagpapadala ng RA.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Mag-configure ng address sa router',
      paragraphs: [
        'Ang pinakasimple: `ipv6 address 2001:db8:acad:1::1/64`. Ito ay static, buong address na manu-manong inilagay. Awtomatikong gagawa ang router ng link-local mula sa EUI-64 kung wala kang itinakda.',
        'Para sa EUI-64: `ipv6 address 2001:db8:acad:1::/64 eui-64` — ilagay lang ang prefix; ang interface ID ay kukunin sa MAC ng interface.',
        'Para sa link-local na madaling tandaan: `ipv6 address fe80::1 link-local`. Ang bentahe: pare-pareho at madaling basahin sa routing table (hal. next hop FE80::2). Ang link-local ay kailangang unique lang sa **link**, hindi sa buong network.',
        'Pwede ring i-enable ang IPv6 sa interface na walang global address gamit ang `ipv6 enable` — gagawa lang ito ng link-local.',
      ],
      steps: [
        'ipv6 unicast-routing (global config).',
        'interface g0/0 → ipv6 address 2001:db8:acad:1::1/64.',
        'ipv6 address fe80::1 link-local (opsyonal pero inirerekomenda).',
        'no shutdown.',
        'show ipv6 interface brief at ping para i-verify.',
      ],
      tricks: [
        'Ang mga IPv6 address ay hindi case-sensitive, at ang `::` ay isang beses lang puwede.',
        'Kung may /64 prefix ka na 2001:db8:acad:1::/64, ang ::1 ay madaling gamitin para sa gateway (hal. 2001:db8:acad:1::1).',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Kung paano ang host ay nagkakaroon ng address',
      paragraphs: [
        'Tatlong paraan: (1) **SLAAC lang** — RA na may prefix at A flag; host ang gumagawa ng interface ID. Walang server. (2) **Stateless DHCPv6** — SLAAC para sa address pero DHCPv6 para sa DNS at iba pang opsyon (O flag). (3) **Stateful DHCPv6** — DHCPv6 server ang nagbibigay ng address (M flag), katulad ng DHCPv4.',
        'Ang default gateway ay hindi galing sa DHCPv6. Ito ay ang **link-local address ng router** na nagpadala ng RA. Kaya ang `show ipv6 route` sa host ay may `::/0 via fe80::…`.',
        'Sa router: `ipv6 nd other-config-flag` (stateless DHCPv6), `ipv6 nd managed-config-flag` (stateful). Ang `ipv6 dhcp relay destination` ay para sa relay.',
      ],
      steps: [
        'Router na may ipv6 unicast-routing ay nagpapadala ng RA sa ff02::1.',
        'Host: tatanggapin ang prefix, bubuo ng address (EUI-64 o random).',
        'DAD: NS para sa sariling address; kung walang NA = unique.',
        'Host: gateway = link-local ng router. DNS = RA option (RDNSS) o DHCPv6.',
      ],
      tricks: [
        'Sa exam: “Which flag means the host should use DHCPv6 for addresses?” → M (managed). “For other information only” → O.',
        'Ang Windows ay random na interface ID bilang default; ang router ay nasa EUI-64 kapag sinabi mo.',
      ],
    },
    {
      type: 'remember',
      title: 'IPv6 configuration na lumalabas sa exam',
      items: [
        '**ipv6 unicast-routing** ay kailangan para mag-route at magpadala ng RA.',
        '**EUI-64: ipasok ang FFFE sa gitna ng MAC at baligtarin ang ika-7 bit (00 → 02).**',
        '**SLAAC = prefix mula sa RA; gateway = link-local ng router.** **M flag = stateful DHCPv6; O flag = stateless.**',
        '**NDP: NS/NA = pamalit sa ARP; RS = ff02::2; RA = ff02::1.** **DAD = tinitiyak na unique ang address.**',
        '**show ipv6 interface brief** — nakikita ang link-local at global ng bawat interface.',
      ],
    },
    { type: 'diagram', id: 'ipv6-nd-flow', caption: 'Pagkakasunod ng RS, RA, SLAAC at DAD.' },
    {
      type: 'terms',
      items: [
        { term: 'ipv6 unicast-routing', definition: 'Global command that enables IPv6 forwarding and Router Advertisements.' },
        { term: 'EUI-64', definition: 'Method that builds a 64-bit interface ID from a 48-bit MAC by inserting FFFE and flipping the 7th bit.' },
        { term: 'SLAAC', definition: 'Stateless Address Autoconfiguration: a host builds its address from the RA prefix.' },
        { term: 'Router Advertisement', definition: 'ICMPv6 message from a router announcing the prefix and acting as gateway.' },
        { term: 'Neighbour Solicitation', definition: 'ICMPv6 message that resolves a neighbour’s link-layer address; replaces ARP.' },
        { term: 'DAD', definition: 'Duplicate Address Detection: checking that a new address is unique before using it.' },
        { term: 'Stateful DHCPv6', definition: 'A DHCPv6 server assigns the address (M flag) and tracks leases.' },
      ],
    },
    {
      type: 'flow',
      title: 'Mula sa configuration hanggang ping',
      steps: [
        'ipv6 unicast-routing sa router.',
        'I-configure ang global address (o EUI-64) at link-local sa bawat interface.',
        'Host: tatanggap ng RA, bubuo ng address, magsasagawa ng DAD.',
        'Host: ang default gateway ay link-local ng router.',
        'Mag-ping mula host papunta sa gateway, tapos papunta sa remote network.',
      ],
    },
    {
      type: 'cli',
      title: 'Configuration at verification',
      transcript: `R1(config)# ipv6 unicast-routing
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ipv6 address 2001:db8:acad:1::/64 eui-64
R1(config-if)# ipv6 address fe80::1 link-local
R1(config-if)# no shutdown
R1# show ipv6 interface brief
GigabitEthernet0/0   [up/up]
    FE80::1
    2001:DB8:ACAD:1:2D0:97FF:FE12:3456
R1# show ipv6 route connected
C   2001:DB8:ACAD:1::/64 [0/0]
     via GigabitEthernet0/0, directly connected
L   2001:DB8:ACAD:1:2D0:97FF:FE12:3456/128 [0/0]
     via GigabitEthernet0/0, receive`,
      copyable: 'ipv6 unicast-routing\ninterface gigabitEthernet 0/0\nipv6 address 2001:db8:acad:1::/64 eui-64\nipv6 address fe80::1 link-local\nno shutdown\nshow ipv6 interface brief\nshow ipv6 route connected',
      explain: [
        { line: 'ipv6 unicast-routing', why: 'Turns the router into an IPv6 router so it forwards packets and sends RAs.' },
        { line: 'ipv6 address 2001:db8:acad:1::/64 eui-64', why: 'Supplies only the prefix; the interface ID is built from the interface MAC with FFFE inserted.' },
        { line: 'ipv6 address fe80::1 link-local', why: 'Overrides the automatic link-local with an easy-to-read one.' },
        { line: 'L … /128 … receive', why: 'The local route for the router’s own address, always a /128.' },
      ],
      note: 'Verify hosts with ipconfig (Windows) or ip -6 addr (Linux) and ping the gateway’s link-local with the interface scope.',
    },
    { type: 'callout', kind: 'trap', text: 'Kung walang `ipv6 unicast-routing`, **hindi mag-ro-route** ang router at hindi magpapadala ng RA — kahit may address ang interface. Ito ang numero unong bitag.' },
    { type: 'callout', kind: 'trap', text: 'Ang default gateway ng IPv6 host ay **link-local address** ng router (FE80::…), hindi ang global address, kapag galing sa RA.' },
    { type: 'callout', kind: 'tip', text: 'Gumamit ng pare-parehong link-local (fe80::1, fe80::2) sa lab at sa exam notes — madaling basahin ang routing table at ang show commands.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Forgetting ipv6 unicast-routing.',
        'Using a full address with eui-64; only the prefix belongs there.',
        'Forgetting to flip the 7th bit when computing EUI-64 by hand.',
        'Using the router’s global address as a host default gateway when SLAAC provides the link-local.',
        'Pinging a link-local address without specifying the interface.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Walang IPv6 address ang host',
      scenario: 'PCs on the LAN get no IPv6 global address. The router interface has 2001:db8:acad:1::1/64 and is up/up.',
      evidence: `R1# show ipv6 interface g0/0
GigabitEthernet0/0 is up, line protocol is up
  IPv6 is enabled, link-local address is FE80::1
  Global unicast address(es): 2001:DB8:ACAD:1::1, subnet is 2001:DB8:ACAD:1::/64
  Hosts use stateless autoconfig for addresses.
R1# show running-config | include unicast
R1#`,
      question: 'Ano ang kulang?',
      answer: 'ipv6 unicast-routing is not configured, so the router does not send Router Advertisements. Without RAs, hosts have no prefix to build their SLAAC address from.',
      fix: 'Enter ipv6 unicast-routing in global configuration. Then check on a host that a 2001:db8:acad:1::/64 address appears and that the default gateway is fe80::1.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang MAC ng interface ay 00:1A:2B:3C:4D:5E. Ano ang EUI-64 interface ID, at ano ang buong address kung ang prefix ay 2001:db8:10:5::/64?',
      answer: 'Split the MAC: 001A2B | 3C4D5E. Insert FFFE: 001A:2BFF:FE3C:4D5E. Flip the 7th bit of the first byte (00 → 02): 021A:2BFF:FE3C:4D5E. Full address: 2001:db8:10:5:21a:2bff:fe3c:4d5e.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'ipv6 unicast-routing is required for routing and RAs.',
        'EUI-64 inserts FFFE and flips the 7th bit.',
        'M flag = stateful DHCPv6, O flag = stateless.',
        'The IPv6 gateway on a host is the router’s link-local address.',
        'Use show ipv6 interface brief first.',
      ],
    },
    {
      type: 'summary',
      points: [
        'ipv6 unicast-routing + address on each interface.',
        'EUI-64 builds the interface ID from the MAC.',
        'SLAAC: prefix from RA, ID from the host.',
        'DAD checks uniqueness; NS/NA replace ARP.',
        'Verify with show ipv6 interface brief and show ipv6 route.',
        'Susunod: IPv6 static routing.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'easy', type: 'single',
    prompt: 'Which global command allows a Cisco router to forward IPv6 packets?',
    choices: ['ipv6 enable', 'ipv6 unicast-routing', 'ipv6 routing', 'ip routing ipv6'], correct: [1],
    explanation: 'ipv6 unicast-routing enables IPv6 forwarding and RA transmission on the router.',
    wrong: { 0: 'ipv6 enable only creates a link-local address on an interface.', 2: 'That is not a valid command.', 3: 'That is not a valid command.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'medium', type: 'single',
    prompt: 'What is the EUI-64 interface ID for MAC address 0000.0C12.3456?',
    choices: ['0000:0CFF:FE12:3456', '0200:0CFF:FE12:3456', '0200:0C12:3456:FFFE', '0000:0C12:FFFE:3456'], correct: [1],
    explanation: 'Insert FFFE in the middle (0000:0CFF:FE12:3456) and flip the 7th bit of the first byte: 00 becomes 02.',
    wrong: { 0: 'The 7th bit was not flipped.', 2: 'FFFE goes in the middle of the MAC, not at the end.', 3: 'FFFE was inserted in the wrong position and the bit was not flipped.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'medium', type: 'single',
    prompt: 'A host builds its own global address from a prefix in a Router Advertisement and a self-generated interface ID. What is this called?',
    choices: ['Stateful DHCPv6', 'SLAAC', 'Static addressing', 'APIPA'], correct: [1],
    explanation: 'Stateless Address Autoconfiguration uses the RA prefix and a host-generated interface ID.',
    wrong: { 0: 'Stateful DHCPv6 assigns the address from a server.', 2: 'The host is not configured by hand.', 3: 'APIPA is an IPv4 feature.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'hard', type: 'single',
    prompt: 'What does the M flag set in a Router Advertisement tell hosts to do?',
    choices: ['Use SLAAC only', 'Obtain addresses from a DHCPv6 server', 'Use DHCPv6 only for DNS information', 'Disable IPv6'], correct: [1],
    explanation: 'The Managed address configuration flag tells hosts to use stateful DHCPv6 for addresses. The O flag is for other information only.',
    wrong: { 0: 'That is the default with neither flag.', 2: 'That is the O flag (stateless DHCPv6).', 3: 'No flag disables IPv6.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: IPv6 hosts normally use the router’s link-local address as the default gateway.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'The RA source is the router’s link-local address, which the host uses as default gateway.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.8', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO functions does ICMPv6 Neighbour Discovery perform?',
    choices: ['Resolve a neighbour’s MAC address', 'Duplicate address detection', 'Assign DNS names', 'Translate private addresses'], correct: [0, 1],
    explanation: 'NS/NA replace ARP and DAD checks uniqueness. DNS and NAT are different functions.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'command', front: 'Pro tip: ano ang unang command sa IPv6 router?', back: 'ipv6 unicast-routing — panggising ng router. EUI-64 = MAC + FFFE sa gitna + baligtad ang ika-7 bit. SLAAC = prefix galing RA + sariling ID.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'command', front: 'Which command enables IPv6 routing?', back: 'ipv6 unicast-routing (global configuration).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'concept', front: 'How is EUI-64 built?', back: 'Insert FFFE in the middle of the MAC and flip the 7th bit.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What are RS and RA?', back: 'Router Solicitation (to ff02::2) and Router Advertisement (to ff02::1) carrying prefix and gateway.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'concept', front: 'M flag vs O flag?', back: 'M = use stateful DHCPv6 for addresses; O = use DHCPv6 for other info (stateless).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What does DAD do?', back: 'Checks that an address is unique by sending an NS for it before use.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'command', front: 'Which command lists IPv6 interface addresses?', back: 'show ipv6 interface brief.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'IPv6 on a router and two hosts',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Enable IPv6 routing, configure EUI-64 and link-local addresses and verify that SLAAC gives the hosts addresses and a gateway.',
  steps: [
    'Connect a router to a switch and two PCs. Set the PCs to automatic IPv6 configuration.',
    'On the router, enter ipv6 unicast-routing, then configure 2001:db8:acad:1::/64 eui-64 and fe80::1 link-local on the LAN interface.',
    'Run show ipv6 interface brief and write down the EUI-64 address; check it against the MAC by hand.',
    'On a PC, check the global address and default gateway (ipconfig).',
    'Ping the router’s link-local and global address from the PC.',
    'Remove ipv6 unicast-routing, clear the PC address and observe that no address is obtained. Restore it.',
  ],
  checklist: [
    'Router addresses verified',
    'EUI-64 matches the manual calculation',
    'Hosts have a SLAAC address and gateway',
    'Pings succeed',
    'Missing unicast-routing fault reproduced and fixed',
  ],
  hints: [
    'The link-local of the router appears as the PC’s default gateway.',
    'Release/renew or disable and enable the PC interface after changes.',
  ],
  solution: [
    'Router: ipv6 unicast-routing; interface config with the prefix and eui-64; link-local fe80::1.',
    'PCs show a 2001:db8:acad:1::/64 address and gateway fe80::1.',
    'Without unicast-routing there are no RAs, so hosts keep only a link-local address.',
  ],
  breakIt: 'Configure a full host address together with the eui-64 keyword and see what IOS accepts; then explain why the keyword belongs with a prefix only.',
};
