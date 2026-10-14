import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'dhcp-server-relay';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.2',
  domain: 'D4',
  title: 'DHCP Server and Relay on a Cisco Router',
  description: 'How to build a DHCP pool with exclusions, and how ip helper-address carries broadcasts to a server on another subnet.',
  whyMatters:
    'Hindi lahat ng network ay may DHCP server sa bawat VLAN. Karaniwan, isang server lang ang nasa gitna at ang router ang nagre-relay ng mga request mula sa ibang subnet. Kapag nakalimutan ang ip helper-address, walang makukuhang address ang mga client sa VLAN na iyon — isa ito sa pinakamadalas na troubleshooting scenario sa exam at sa totoong trabaho.',
  objectives: [
    'Configure a DHCP pool with network, default-router and dns-server',
    'Exclude addresses from the pool before the pool is used',
    'Explain why a router does not forward DHCP broadcasts by default',
    'Configure ip helper-address on the client-facing interface',
    'Verify bindings with show ip dhcp binding and show ip dhcp pool',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['ip dhcp pool', 'ip dhcp excluded-address', 'default-router', 'dns-server', 'ip helper-address', 'DHCP relay', 'show ip dhcp binding', 'lease'],
  examObjectives: ['4.6'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A Cisco router can act as a DHCP server: you give it a range of addresses, tell it which ones to keep for static devices, and list the gateway and DNS server to hand out.',
        'But clients find a server by broadcasting, and routers do not forward broadcasts. If the server is in a different subnet, the router on the client side has to catch the broadcast and forward it to the server as a unicast. That job is called DHCP relay, configured with ip helper-address.',
      ],
      taglish: [
        'Puwedeng gawing **DHCP server** ang isang Cisco router: ibibigay mo ang **range ng address**, sasabihin kung **alin ang hindi ipamimigay** (para sa mga static device), at ilalagay ang **default gateway** at **DNS**.',
        'Pero **broadcast ang paraan ng client** sa paghahanap ng server, at **hindi pinapasa ng router ang broadcast**. Kung **nasa ibang subnet ang server**, kailangang may sasalo ng broadcast at **ipapasa bilang unicast** sa server.',
        'Iyon ang **DHCP relay**, at ang command ay **ip helper-address** sa **interface na nakaharap sa mga client** (hindi sa server).',
        'Importante: **i-exclude muna ang mga address** bago i-activate ang pool, kung hindi ay baka ipamigay ng server ang address ng gateway o ng printer.',
      ],
      technical: [
        'Server configuration: ip dhcp excluded-address <low> [high] (global; do this first), then ip dhcp pool <NAME>, network <network> <mask>, default-router <gateway>, dns-server <ip>, optionally lease <days hours minutes> and domain-name. Each pool serves clients arriving on the interface whose address falls within the pool\'s network.',
        'A router does not forward broadcasts, so a DHCPDISCOVER from a client never leaves the subnet. DHCP relay is configured on the Layer 3 interface facing the clients: ip helper-address <server IP>. The router converts the broadcast into a unicast to the server and inserts the giaddr field set to the receiving interface address, so the server selects the right pool and replies to the relay.',
        'ip helper-address also forwards a set of other UDP broadcasts by default (TFTP 69, DNS 53, NetBIOS 137/138, TACACS 49, time 37) unless disabled with no ip forward-protocol udp <port>.',
        'The same relay logic applies to a Layer 3 switch SVI used as the gateway of a VLAN, and to router-on-a-stick subinterfaces.',
        'Verification: show ip dhcp binding (addresses leased and to which MAC), show ip dhcp pool (utilisation), show ip dhcp conflict, show running-config | section dhcp, and debug ip dhcp server packet in the lab.',
      ],
    },
    {
      type: 'analogy',
      title: 'Receptionist na nagpapasa ng tanong',
      body: [
        'A guest on the third floor shouts "Who can give me a room key?" That shout never leaves the floor. The floor receptionist (the relay) hears it and phones the main desk (the DHCP server) directly, then passes the key back down. The guest never knew the main desk existed.',
      ],
      taglish: [
        'Isang bisita sa **ikatlong palapag** ang sumigaw ng **"Sino ang makakapagbigay ng susi?"** Hindi iyon aabot sa ibang palapag. Ang **receptionist ng palapag** (relay) ay **tumawag nang direkta sa main desk** (DHCP server), saka ibinaba ang susi. Hindi alam ng bisita na may main desk pala.',
      ],
    },
    {
      type: 'hook',
      title: 'EPDN: Exclude, Pool, Default-router, Network',
      trick: '**Server**: **E**xclude muna, saka **P**ool, **N**etwork, **D**efault-router, **D**NS. **Relay**: **helper** sa **client side**.',
      taglish: [
        'Sa **server**: una ang **excluded-address**, saka ang **pool**, tapos **network**, **default-router**, **dns-server**.',
        'Sa **relay**: ang **ip helper-address** ay inilalagay sa **interface na nakaharap sa client**, at ang address na ilalagay ay ang **server**.',
        'Madaling tandaan: **"Helper sa harap ng Client, tinuturo ang Server."**',
      ],
      test: {
        question: 'Ang DHCP server ay nasa 10.0.0.5 at ang mga client ay nasa VLAN 20 na ang gateway ay interface Gi0/0.20 ng R1. Saan at anong command ang ilalagay?',
        answer: 'Sa R1: interface gi0/0.20, saka ip helper-address 10.0.0.5. Nasa interface na nakaharap sa client, at tinuturo ang server.',
      },
    },
    { type: 'diagram', id: 'dhcp-relay', caption: 'Ang router ay nagpapasa ng broadcast bilang unicast sa DHCP server sa ibang subnet.' },
    {
      type: 'terms',
      items: [
        { term: 'DHCP pool', definition: 'A named range of addresses a router hands out, with its options.' },
        { term: 'Excluded address', definition: 'An address in the pool range that the server must never lease (gateways, printers, servers).' },
        { term: 'default-router', definition: 'The pool command that sets the default gateway handed to clients.' },
        { term: 'dns-server', definition: 'The pool command that sets the DNS server handed to clients.' },
        { term: 'DHCP relay', definition: 'Forwarding client DHCP broadcasts to a server in another subnet as unicast.' },
        { term: 'ip helper-address', definition: 'Interface command that enables relay toward a given server address.' },
        { term: 'giaddr', definition: 'The relay agent address in the DHCP packet; tells the server which subnet/pool to use.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: relay mula sa VLAN 20 papunta sa server',
      steps: [
        'Naka-VLAN 20 ang PC1 at walang IP. Nagpapadala ito ng DHCPDISCOVER sa broadcast.',
        'Natatanggap ng R1 (gateway ng VLAN 20) ang broadcast sa interface Gi0/0.20.',
        'Dahil may ip helper-address 10.0.0.5, binabago ng R1 ang broadcast sa unicast papunta sa 10.0.0.5 at inilalagay ang giaddr na 192.168.20.1.',
        'Natatanggap ito ng DHCP server at pinipili ang pool na tumutugma sa 192.168.20.0/24, saka nagbabalik ng Offer sa R1.',
        'Ipinapasa ng R1 ang Offer sa PC1. Magpapatuloy ang Request at Acknowledge sa parehong paraan.',
        'Nakakuha ang PC1 ng address, gateway at DNS mula sa server na nasa ibang subnet.',
      ],
    },
    {
      type: 'cli',
      title: 'Router bilang DHCP server, at relay para sa ibang VLAN',
      transcript: `R1(config)# ip dhcp excluded-address 192.168.10.1 192.168.10.20
R1(config)# ip dhcp pool LAN10
R1(dhcp-config)# network 192.168.10.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.10.1
R1(dhcp-config)# dns-server 8.8.8.8
R1(dhcp-config)# lease 3
R1(dhcp-config)# exit
R1(config)# interface gi0/0.20
R1(config-subif)# ip helper-address 10.0.0.5
R1(config-subif)# end
R1# show ip dhcp binding
IP address       Client-ID/Hardware address   Lease expiration     Type
192.168.10.21    0100.5056.a1b2.c3            Oct 16 2026 09:00    Automatic`,
      copyable: 'ip helper-address 10.0.0.5',
      explain: [
        { line: 'ip dhcp excluded-address 192.168.10.1 192.168.10.20', why: 'Reserves .1 to .20 for the gateway and static devices so the pool never hands them out. Do this before the pool is used.' },
        { line: 'network 192.168.10.0 255.255.255.0', why: 'Sets the range of addresses the pool can lease.' },
        { line: 'default-router 192.168.10.1', why: 'Gives clients their default gateway.' },
        { line: 'lease 3', why: 'Lease is 3 days (the default is 1 day).' },
        { line: 'ip helper-address 10.0.0.5', why: 'On the client-facing subinterface, relays DHCP broadcasts to the server at 10.0.0.5.' },
        { line: 'show ip dhcp binding', why: 'Lists leases: the address, the client MAC and when it expires.' },
      ],
      note: 'Sample output for study; dates and MAC addresses will differ.',
    },
    {
      type: 'verify',
      title: 'Verification sa DHCP server',
      items: [
        { command: 'show ip dhcp binding', shows: 'Each active lease with the client MAC address and expiry.' },
        { command: 'show ip dhcp pool', shows: 'Pool name, network, total and leased addresses.' },
        { command: 'show ip dhcp conflict', shows: 'Addresses the server skipped because another host already used them.' },
        { command: 'show running-config | section dhcp', shows: 'The pools and exclusions as configured.' },
      ],
      good: 'Clients appear in the binding table with addresses outside the excluded range.',
      bad: 'Empty binding table: no Discover is reaching the server (missing relay, wrong VLAN, interface down).',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **ip helper-address ay inilalagay sa interface na nakaharap sa CLIENT**, hindi sa interface papunta sa server. At ang address ay **ang address ng server**. Ito ang pinakamadalas na mali sa exam.' },
    { type: 'callout', kind: 'trap', text: '**Excluded-address** ay dapat i-configure **bago** o kasabay ng pool. Kung hindi, maaaring maibigay ng server ang address ng gateway sa isang PC at magkakaroon ng **IP conflict**.' },
    { type: 'callout', kind: 'tip', text: 'Kapag may **DHCP server sa mismong subnet** ng client, **hindi kailangan ng relay**. Kailangan lang ito kapag **ibang subnet** ang server.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Ilagay ang ip helper-address sa interface na papunta sa server.',
        'Hindi mag-exclude ng gateway at static address.',
        'Maling mask sa network command ng pool.',
        'Kalimutan ang default-router, kaya may IP ang client pero walang internet.',
        'Kalimutan ang helper-address sa bawat VLAN interface; isa-isa ito sa bawat subnet.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Ang VLAN 20 lang ang walang address"',
      scenario: 'VLAN 10 clients get addresses normally, but VLAN 20 clients all show 169.254.x.x. The DHCP server is at 10.0.0.5, reachable from R1.',
      evidence: `R1# show running-config interface gi0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
 ip helper-address 10.0.0.5
R1# show running-config interface gi0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0`,
      question: 'Ano ang kulang?',
      answer: 'Walang ip helper-address ang Gi0/0.20. Ang broadcast ng VLAN 20 ay hindi naipapasa sa server, kaya APIPA ang lahat ng client.',
      fix: 'Add ip helper-address 10.0.0.5 under interface gi0/0.20, then confirm the server has a pool for 192.168.20.0/24. Verify with show ip dhcp binding on the server and ipconfig /renew on a client.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Gusto mong ibigay ng router ang 192.168.30.0/24 maliban sa .1 hanggang .10 at .250 hanggang .254. Isulat ang mga exclusion at ang pool.',
      answer: 'ip dhcp excluded-address 192.168.30.1 192.168.30.10 at ip dhcp excluded-address 192.168.30.250 192.168.30.254. Pagkatapos: ip dhcp pool VLAN30, network 192.168.30.0 255.255.255.0, default-router 192.168.30.1, dns-server 8.8.8.8.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Pool commands: network, default-router, dns-server (optionally lease).',
        'ip dhcp excluded-address is a global command, and a range uses low then high.',
        'Routers do not forward broadcasts; ip helper-address relays them as unicast.',
        'Place the helper on the client-facing interface and point it at the server.',
        'Check show ip dhcp binding to prove leases are being granted.',
      ],
    },
    {
      type: 'summary',
      points: [
        'A router DHCP server needs excluded addresses and a pool with network, default-router and dns-server.',
        'Routers block broadcasts, so a server in another subnet needs a relay.',
        'ip helper-address goes on the client-facing interface and names the server.',
        'Verify with show ip dhcp binding and show ip dhcp pool.',
        'Susunod: DNS — paano nagiging IP address ang mga pangalan.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'easy', type: 'single',
    prompt: 'Which command reserves addresses so the router DHCP server will not hand them out?',
    choices: ['ip dhcp reserved', 'ip dhcp excluded-address', 'ip dhcp exclude', 'no ip dhcp pool'], correct: [1],
    explanation: 'ip dhcp excluded-address <low> [high] removes addresses from the leasable range.',
    wrong: { 0: 'Not valid IOS syntax.', 2: 'Not valid IOS syntax.', 3: 'That would remove the pool.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'easy', type: 'single',
    prompt: 'Which DHCP pool command sets the default gateway given to clients?',
    choices: ['gateway', 'default-router', 'default-gateway', 'ip route'], correct: [1],
    explanation: 'default-router in DHCP pool configuration mode sets the gateway option.',
    wrong: { 0: 'Not valid in pool mode.', 2: 'Not valid in pool mode.', 3: 'That configures a static route.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'medium', type: 'single',
    prompt: 'Why do clients in a different subnet from the DHCP server fail to get an address without a relay?',
    choices: ['DHCP only works over TCP', 'Routers do not forward broadcasts', 'DNS is missing', 'The lease is too short'], correct: [1],
    explanation: 'The Discover is a broadcast and never leaves its subnet unless a relay forwards it.',
    wrong: { 0: 'DHCP uses UDP.', 2: 'DNS is separate.', 3: 'Lease length is irrelevant to initial discovery.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'medium', type: 'single',
    prompt: 'Where is ip helper-address configured?',
    choices: ['On the interface facing the DHCP server', 'On the interface facing the clients', 'In the DHCP pool', 'On the DHCP server only'], correct: [1],
    explanation: 'The relay must hear the client broadcast, so it is applied on the client-facing Layer 3 interface.',
    wrong: { 0: 'The broadcast is not heard there.', 2: 'It is an interface command, not a pool command.', 3: 'It is on the router or Layer 3 switch.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'medium', type: 'single',
    prompt: 'What address do you enter after ip helper-address?',
    choices: ['The client IP address', 'The default gateway', 'The DHCP server address', 'The broadcast address'], correct: [2],
    explanation: 'The command points to the DHCP server so the relay knows where to send the unicast.',
    wrong: { 0: 'The client has none yet.', 1: 'That is the router itself.', 3: 'The relay turns broadcast into unicast.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'medium', type: 'single',
    prompt: 'Which command lists the addresses currently leased by a Cisco router DHCP server?',
    choices: ['show ip dhcp binding', 'show dhcp lease', 'show ip interface brief', 'show ip route'], correct: [0],
    explanation: 'show ip dhcp binding lists each leased address, the client identifier and expiry.',
    wrong: { 1: 'That is a client-side command on some platforms, not the server table.', 2: 'That lists interface addresses.', 3: 'That lists routes.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'hard', type: 'single',
    prompt: 'VLAN 10 clients get addresses, but VLAN 20 clients get 169.254.x.x. The server is in another subnet. What is the most likely cause?',
    choices: ['The server pool is full of VLAN 10 addresses', 'ip helper-address is missing on the VLAN 20 interface', 'The trunk is native VLAN 1', 'DNS is misconfigured'], correct: [1],
    explanation: 'Each client-facing interface needs its own helper-address; VLAN 10 working proves the server is reachable.',
    wrong: { 0: 'Separate pools exist per subnet.', 2: 'The native VLAN would not affect only VLAN 20 DHCP.', 3: 'DNS does not affect getting an address.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO commands are entered in DHCP pool configuration mode?',
    choices: ['network 192.168.10.0 255.255.255.0', 'ip helper-address 10.0.0.5', 'dns-server 8.8.8.8', 'ip dhcp excluded-address 192.168.10.1'], correct: [0, 2],
    explanation: 'network and dns-server belong to the pool. ip helper-address is an interface command and excluded-address is global.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D4', objective: '4.6', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a DHCP relay is required when the DHCP server is on the same subnet as the clients.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — the broadcast reaches the server directly on the same subnet.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'command', front: 'Pro tip: DHCP server at relay?', back: 'Server: excluded-address muna, saka ip dhcp pool + network + default-router + dns-server. Relay: ip helper-address sa interface na nakaharap sa client, tinuturo ang server.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'command', front: 'Create a DHCP pool?', back: 'ip dhcp pool NAME → network <net> <mask> → default-router <gw> → dns-server <ip>.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'command', front: 'Exclude addresses from a pool?', back: 'ip dhcp excluded-address <low> [high] (global configuration).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Why is DHCP relay needed?', back: 'Routers do not forward broadcasts, so clients cannot reach a server in another subnet without a relay.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'command', front: 'Configure relay?', back: 'On the client-facing interface: ip helper-address <server IP>.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'command', front: 'Verify DHCP leases?', back: 'show ip dhcp binding, show ip dhcp pool, show ip dhcp conflict.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D4', category: 'concept', front: 'What is giaddr?', back: 'The relay agent\'s interface address placed in the DHCP packet so the server picks the correct pool.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Router DHCP pool, then relay to a remote server',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Configure a DHCP pool on R1 for a local LAN, then move the server behind another router and add a relay.',
  topology: 'PC1 — SW1 — R1 — R2 — Server. R1 LAN is 192.168.10.0/24; R1–R2 link is 10.0.0.0/30.',
  addressing: [
    { device: 'R1', interface: 'Gi0/0', address: '192.168.10.1/24', note: 'LAN gateway' },
    { device: 'R1', interface: 'Gi0/1', address: '10.0.0.1/30' },
    { device: 'R2', interface: 'Gi0/1', address: '10.0.0.2/30' },
    { device: 'Server', interface: 'NIC', address: '172.16.0.5/24', note: 'DHCP server behind R2' },
  ],
  steps: [
    'Configure R1 as a DHCP server: exclude .1–.20, create pool LAN10 with network, default-router and dns-server.',
    'Set PC1 to DHCP and confirm it receives 192.168.10.21 or higher. Check show ip dhcp binding.',
    'Remove the pool on R1 and enable a DHCP service on the remote server with a pool for 192.168.10.0/24.',
    'Without a relay, run ipconfig /renew on PC1 and observe 169.254.x.x.',
    'Add ip helper-address 172.16.0.5 on R1 Gi0/0 and renew again.',
    'Confirm PC1 receives an address from the remote server.',
  ],
  checklist: [
    'Router DHCP pool hands out addresses outside the excluded range',
    'Binding visible in show ip dhcp binding',
    'Demonstrated failure without relay',
    'Fixed it with ip helper-address on the client-facing interface',
  ],
  hints: [
    'The route to the server network must exist on R1 and the return route to the client network on R2.',
    'The helper goes on Gi0/0 (client side), not Gi0/1.',
  ],
  solution: [
    'Exclude the gateway and static range first, then create the pool.',
    'Without relay the broadcast stays on the LAN, giving APIPA.',
    'ip helper-address 172.16.0.5 under interface gi0/0 makes R1 forward the request as unicast.',
  ],
  breakIt: 'Move the ip helper-address to R1 Gi0/1 (the server-facing port) and watch DHCP break again.',
};
