import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'dhcp-snooping';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.9',
  domain: 'D5',
  title: 'DHCP Snooping: Trusted and Untrusted Ports',
  description: 'How a switch stops rogue DHCP servers and DHCP starvation by trusting only the ports toward the real server, and how it builds a binding table.',
  whyMatters:
    'Kapag may nagsaksak ng sariling router sa opisina at nagsimulang magbigay ng maling gateway sa mga PC, ang buong network ay maaaring ma-hijack — man-in-the-middle sa pamamagitan ng DHCP. Ang DHCP snooping ang depensa, at siya ring nagbibigay ng datos sa Dynamic ARP Inspection. Madalas ang tanong: aling port ang trusted?',
  objectives: [
    'Explain the rogue DHCP server and DHCP starvation attacks',
    'Describe trusted and untrusted ports and which DHCP messages each may send',
    'Enable DHCP snooping globally and per VLAN with ip dhcp snooping',
    'Mark uplinks and the server port as trusted with ip dhcp snooping trust',
    'Read the DHCP snooping binding table and use rate limiting',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['DHCP snooping', 'ip dhcp snooping', 'trust', 'untrusted', 'binding table', 'rogue DHCP', 'starvation', 'ip dhcp snooping vlan', 'limit rate', 'option 82'],
  examObjectives: ['5.7'],
  sections: [
    {
      type: 'explain',
      simple: [
        'DHCP has no built-in trust: a client takes the first offer it hears. An attacker can plug in a device that answers faster and hands out a false default gateway, so every victim sends their traffic through the attacker. Another attack, starvation, requests all the addresses in the pool.',
        'DHCP snooping fixes this on the switch. You mark the few ports that lead to the real DHCP server as trusted, and every other port is untrusted. Untrusted ports may send DHCP requests but may not send server replies; if they do, the frame is dropped.',
      ],
      taglish: [
        'Walang **built-in na tiwala** ang DHCP: **kinukuha ng client ang unang offer na marinig**. Puwedeng magsaksak ang attacker ng device na **mas mabilis sumagot** at **nagbibigay ng pekeng default gateway**, kaya **dumadaan sa attacker ang trapiko ng lahat**. May isa pang atake, ang **starvation**: **hinihingi ang lahat ng address sa pool**.',
        'Inaayos ito ng **DHCP snooping** sa switch. **Minamarkahan mo ng trusted ang ilang port** na papunta sa **totoong DHCP server**, at **ang lahat ng iba ay untrusted**. Ang **untrusted port** ay **puwedeng magpadala ng DHCP request** pero **hindi ng server reply**; kapag ginawa niya, **ibinabagsak ang frame**.',
        'Nagtatayo rin ang switch ng **binding table**: **MAC, IP address, VLAN, port at lease time** ng bawat lehitimong client. **Ginagamit ito ng Dynamic ARP Inspection**.',
        'Dapat **trusted** ang mga **uplink papunta sa ibang switch** at ang **port ng DHCP server**. Lahat ng **port ng user ay untrusted**.',
      ],
      technical: [
        'Rogue DHCP server: an unauthorised server on the segment answers DHCPDISCOVER with malicious settings (gateway, DNS), enabling man-in-the-middle or denial of service. DHCP starvation: an attacker floods DHCPDISCOVER with spoofed MAC addresses until the legitimate pool is exhausted, often to follow with a rogue server.',
        'DHCP snooping classifies ports. Trusted ports (uplinks, the DHCP server port, relay) may forward server messages (DHCPOFFER, DHCPACK, DHCPNAK). Untrusted ports (hosts) may only send client messages; any server message received on an untrusted port is dropped. Enable with ip dhcp snooping (global) and ip dhcp snooping vlan <list>; mark trusted ports with ip dhcp snooping trust.',
        'Binding database: for each lease observed on an untrusted port, the switch records MAC address, IP address, lease time, VLAN and interface. It is stored in memory (and optionally a file with ip dhcp snooping database). The binding table is used by DHCP snooping itself, by Dynamic ARP Inspection and by IP Source Guard.',
        'Additional protections: ip dhcp snooping limit rate <pps> on untrusted ports reduces starvation floods (the port goes err-disabled if exceeded); ip dhcp snooping verify mac-address checks that the DHCP client hardware address matches the frame source MAC. Option 82 relay information may be inserted; if a relay is behind the snooping switch use ip dhcp snooping information option allow-untrusted or trust the port.',
        'Verification: show ip dhcp snooping (status, VLANs, trusted interfaces and rate limits), show ip dhcp snooping binding (the table), show ip dhcp snooping statistics (dropped packets). Tip: after enabling, existing clients should renew (ipconfig /renew) to appear in the binding table.',
      ],
    },
    {
      type: 'analogy',
      title: 'Opisyal na tagabigay ng ID',
      body: [
        'In an office, only the front desk is allowed to issue visitor badges. If a stranger in the hallway starts handing out badges, security takes them away, because badges may only come from the desk. DHCP snooping is that rule: offers are only accepted from trusted ports.',
      ],
      taglish: [
        'Sa opisina, **ang front desk lang ang puwedeng magbigay ng visitor badge**. Kung may **estrangherong nagbibigay ng badge sa hallway**, **kukunin ito ng security**, dahil **galing lang sa desk dapat ang badge**. Ganyan ang DHCP snooping: **tinatanggap lang ang offer galing sa trusted port**.',
      ],
    },
    {
      type: 'hook',
      title: 'Trusted = Server/Uplink, Untrusted = User',
      trick: '**Trusted** = papunta sa **server** o **uplink**. **Untrusted** = lahat ng **user port** (default). Ang **offer galing sa untrusted = bagsak**.',
      taglish: [
        '**Trusted**: port papunta sa **DHCP server** at **mga uplink** sa ibang switch.',
        '**Untrusted** (default): **lahat ng user port**. **Hindi puwedeng magpadala ng Offer/ACK**.',
        'May **binding table**: MAC, IP, VLAN, port, lease — para sa **DAI** din.',
        'Command: **ip dhcp snooping** + **ip dhcp snooping vlan N** + **ip dhcp snooping trust** (sa trusted port).',
      ],
      test: {
        question: 'Aling mga port ang dapat markahan ng trust, at ano ang mangyayari sa DHCPOFFER na dumating sa untrusted port?',
        answer: 'Trust sa port papunta sa DHCP server at sa mga uplink papunta sa ibang switch. Ang DHCPOFFER na dumating sa untrusted port ay ibinabagsak.',
      },
    },
    { type: 'diagram', id: 'dhcp-snooping-ports', caption: 'Trusted na port papunta sa totoong DHCP server; untrusted ang user ports kaya naharang ang rogue server.' },
    {
      type: 'terms',
      items: [
        { term: 'DHCP snooping', definition: 'A Layer 2 security feature that filters DHCP messages and builds a binding table.' },
        { term: 'Trusted port', definition: 'A port allowed to send DHCP server messages: uplinks and the real DHCP server.' },
        { term: 'Untrusted port', definition: 'A port, normally for hosts, that may send only DHCP client messages. Default state.' },
        { term: 'Rogue DHCP server', definition: 'An unauthorised DHCP server that gives clients false settings.' },
        { term: 'DHCP starvation', definition: 'Exhausting the DHCP pool with spoofed requests.' },
        { term: 'Binding table', definition: 'Records of MAC, IP, VLAN, port and lease for each client, used by DAI and IP Source Guard.' },
        { term: 'Rate limit', definition: 'A cap on DHCP packets per second on an untrusted port; excess err-disables it.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: naharang ang rogue DHCP server',
      steps: [
        'Naka-enable ang DHCP snooping sa VLAN 10; trusted ang Gi0/1 (uplink papunta sa totoong server).',
        'Nagsaksak ang attacker ng router sa Fa0/7 (untrusted) na nagpapatakbo ng DHCP server.',
        'Nagpadala ng DHCPDISCOVER ang bagong PC; sumagot ang rogue server mula Fa0/7 ng DHCPOFFER.',
        'Natanggap ng switch ang DHCPOFFER sa untrusted port at ibinagsak ito.',
        'Dumating ang tunay na DHCPOFFER mula sa trusted na Gi0/1 at ipinasa sa PC.',
        'Itinala ng switch ang MAC, IP, VLAN, port at lease ng PC sa binding table.',
      ],
    },
    {
      type: 'cli',
      title: 'I-enable ang DHCP snooping',
      transcript: `SW1(config)# ip dhcp snooping
SW1(config)# ip dhcp snooping vlan 10,20
SW1(config)# interface gi0/1
SW1(config-if)# ip dhcp snooping trust
SW1(config-if)# exit
SW1(config)# interface range fa0/2 - 24
SW1(config-if-range)# ip dhcp snooping limit rate 15
SW1(config-if-range)# end
SW1# show ip dhcp snooping
Switch DHCP snooping is enabled
DHCP snooping is configured on following VLANs: 10,20
Interface        Trusted    Rate limit (pps)
Gi0/1            yes        unlimited
Fa0/2            no         15
SW1# show ip dhcp snooping binding
MacAddress          IpAddress       Lease(sec)  Type           VLAN  Interface
00:50:79:66:68:01   192.168.10.25   86000       dhcp-snooping  10    FastEthernet0/2`,
      copyable: 'ip dhcp snooping trust',
      explain: [
        { line: 'ip dhcp snooping', why: 'Turns the feature on globally; nothing is filtered until VLANs are also selected.' },
        { line: 'ip dhcp snooping vlan 10,20', why: 'Chooses the VLANs where DHCP messages are inspected.' },
        { line: 'ip dhcp snooping trust (Gi0/1)', why: 'Allows DHCP server messages on the uplink toward the real server.' },
        { line: 'limit rate 15', why: 'Caps DHCP requests at 15 per second on user ports to limit starvation attacks.' },
        { line: 'binding table entry', why: 'Shows a legitimate client, its IP address, VLAN and port; DAI uses it.' },
      ],
      note: 'Sample output for study.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show ip dhcp snooping', shows: 'Whether snooping is on, which VLANs, which ports are trusted and any rate limits.' },
        { command: 'show ip dhcp snooping binding', shows: 'The table of clients: MAC, IP, lease, VLAN and port.' },
        { command: 'show ip dhcp snooping statistics', shows: 'Counters of packets forwarded and dropped, including untrusted server messages.' },
        { command: 'show running-config | include snooping', shows: 'All snooping commands configured.' },
      ],
      good: 'Trusted ports are the uplink and server port; clients appear in the binding table.',
      bad: 'No clients get addresses (the server port is untrusted), or the binding table stays empty.',
    },
    { type: 'callout', kind: 'trap', text: 'Kapag **naka-enable ang snooping at nakalimutan mong i-trust ang uplink o ang port ng DHCP server**, **walang client na makakakuha ng address** — dahil ibinabagsak ang tunay na DHCPOFFER. Ito ang pinakakaraniwang pagkakamali.' },
    { type: 'callout', kind: 'trap', text: 'Ang **default ng lahat ng port ay UNTRUSTED**. At kailangan ng **ip dhcp snooping vlan** — kung walang VLAN na nakalista, **walang sinusuri** kahit naka-enable sa global.' },
    { type: 'callout', kind: 'tip', text: 'Pagkatapos i-enable, ang mga **dating client ay hindi pa nasa binding table**. Mag-**ipconfig /release** at **/renew** para **lumitaw** sila — mahalaga ito para sa DAI.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Hindi pag-trust sa uplink o sa DHCP server port.',
        'Pag-enable lang sa global at hindi pagtatakda ng VLAN.',
        'Paglalagay ng trust sa user port.',
        'Hindi pag-renew ng clients para mabuo ang binding table.',
        'Sobrang higpit na rate limit na nag-e-err-disable sa lehitimong port.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Walang makakuha ng IP pagkatapos i-enable ang snooping"',
      scenario: 'After DHCP snooping was enabled on VLAN 10, no PC in that VLAN can get an address. The DHCP server is reached through Gi0/1.',
      evidence: `SW1# show ip dhcp snooping
DHCP snooping is configured on following VLANs: 10
Interface        Trusted    Rate limit (pps)
Gi0/1            no         unlimited
Fa0/2            no         unlimited
SW1# show ip dhcp snooping statistics
 Packets dropped: DHCP server message on untrusted port: 214`,
      question: 'Bakit hindi nakakakuha ng IP ang mga PC?',
      answer: 'Hindi trusted ang Gi0/1, ang uplink papunta sa DHCP server. Ibinabagsak ang DHCPOFFER at DHCPACK dahil galing sa untrusted port (214 dropped).',
      fix: 'interface gi0/1 → ip dhcp snooping trust. Pagkatapos ay mag-ipconfig /renew sa isang PC at i-verify na lumabas sa show ip dhcp snooping binding.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang access switch ay may uplink Gi0/1 papunta sa distribution, kung saan nandoon ang DHCP server. Ang mga user ay nasa Fa0/1 - 20 sa VLAN 30. Isulat ang minimum na configuration.',
      answer: 'ip dhcp snooping, ip dhcp snooping vlan 30, at sa Gi0/1: ip dhcp snooping trust. Opsyonal: ip dhcp snooping limit rate 15 sa Fa0/1 - 20. Ang mga user port ay nananatiling untrusted bilang default.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Trusted = uplinks and DHCP server ports; untrusted (default) = host ports.',
        'Server messages (Offer, ACK) on untrusted ports are dropped.',
        'ip dhcp snooping plus ip dhcp snooping vlan are both required.',
        'The binding table (MAC, IP, VLAN, port, lease) feeds Dynamic ARP Inspection.',
        'Rate limiting on untrusted ports reduces starvation.',
      ],
    },
    {
      type: 'summary',
      points: [
        'DHCP snooping blocks rogue DHCP servers using trusted and untrusted ports.',
        'It builds a binding table used by DAI.',
        'Trust the uplinks and the server port, nothing else.',
        'Rate limit user ports and renew clients after enabling.',
        'Susunod: Dynamic ARP Inspection — laban sa ARP spoofing.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'easy', type: 'single',
    prompt: 'What attack does DHCP snooping primarily defend against?',
    choices: ['Rogue DHCP servers', 'Port scanning', 'VLAN hopping only', 'Password cracking'], correct: [0],
    explanation: 'DHCP snooping blocks unauthorised DHCP servers (and helps against starvation).',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'easy', type: 'single',
    prompt: 'Which ports should be configured as trusted?',
    choices: ['All user access ports', 'Ports toward the DHCP server and uplinks to other switches', 'Only unused ports', 'No ports'], correct: [1],
    explanation: 'Trust the DHCP server port and uplinks; user ports stay untrusted.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'What happens to a DHCPOFFER received on an untrusted port?',
    choices: ['It is forwarded', 'It is dropped', 'It is logged and forwarded', 'It is converted to a DHCPACK'], correct: [1],
    explanation: 'Server messages are not allowed from untrusted ports and are dropped.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'Which command marks an interface as trusted for DHCP snooping?',
    choices: ['ip dhcp snooping trust', 'ip dhcp trust', 'dhcp snooping enable', 'ip dhcp snooping vlan 10'], correct: [0],
    explanation: 'ip dhcp snooping trust is entered in interface configuration mode.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'What does the DHCP snooping binding table contain?',
    choices: ['Routes and metrics', 'MAC, IP address, lease, VLAN and interface of clients', 'ACL rules', 'VLAN names'], correct: [1],
    explanation: 'The table records legitimate leases and is used by DAI and IP Source Guard.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'hard', type: 'single',
    prompt: 'After enabling snooping on VLAN 10, no client gets an address. What is most likely?',
    choices: ['The DHCP server port or uplink is not trusted', 'The VLAN does not exist', 'DNS is down', 'Spanning tree is disabled'], correct: [0],
    explanation: 'If the server port is untrusted, the real DHCP replies are dropped.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'Which command limits DHCP packets on an untrusted port?',
    choices: ['ip dhcp snooping limit rate 15', 'ip dhcp limit 15', 'rate-limit dhcp 15', 'ip dhcp snooping trust 15'], correct: [0],
    explanation: 'ip dhcp snooping limit rate <pps> caps DHCP packets per second on the port.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO commands are required to start DHCP snooping on VLAN 10?',
    choices: ['ip dhcp snooping', 'ip dhcp snooping vlan 10', 'ip dhcp pool VLAN10', 'ip helper-address'], correct: [0, 1],
    explanation: 'The global command and the VLAN list are both needed.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: by default every port is untrusted for DHCP snooping.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — only ports you mark with ip dhcp snooping trust are trusted.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: paano tandaan ang DHCP snooping?', back: 'Trusted = papunta sa server at uplinks. Untrusted = user ports (default); Offer/ACK galing doon ay bagsak. May binding table para sa DAI.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What does DHCP snooping do?', back: 'Filters DHCP messages by port trust, blocks rogue servers and builds a binding table.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'command', front: 'Enable DHCP snooping?', back: 'ip dhcp snooping · ip dhcp snooping vlan <list> · (interface) ip dhcp snooping trust' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Trusted vs untrusted ports?', back: 'Trusted: server and uplinks, may send Offer/ACK. Untrusted (default): hosts, server messages are dropped.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'command', front: 'Verify DHCP snooping?', back: 'show ip dhcp snooping, show ip dhcp snooping binding, show ip dhcp snooping statistics' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What is DHCP starvation?', back: 'An attack that exhausts the DHCP pool with spoofed requests; limited with rate limiting.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Block a rogue DHCP server',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Enable DHCP snooping, trust the correct ports and show that a rogue DHCP server is ignored.',
  topology: 'SW1 with the real DHCP server on Gi0/1, a rogue router/server on Fa0/7 and a client PC on Fa0/2 (VLAN 10).',
  steps: [
    'Configure the real DHCP server and confirm the PC receives an address.',
    'Add a second DHCP server on Fa0/7 with a different gateway and observe the PC sometimes taking the rogue address.',
    'Enable ip dhcp snooping and ip dhcp snooping vlan 10 on SW1.',
    'Trust only Gi0/1 with ip dhcp snooping trust.',
    'Renew the PC and confirm it receives the real address; check show ip dhcp snooping binding.',
    'Review show ip dhcp snooping statistics for dropped server messages.',
  ],
  checklist: [
    'Rogue server accepted before snooping',
    'Only real server accepted after snooping',
    'Binding table shows the PC',
  ],
  hints: [
    'Forgetting to trust the real server port blocks everyone.',
    'Renew the PC after changing the configuration.',
  ],
  solution: [
    'Untrusted Fa0/7 DHCPOFFERs are dropped; Gi0/1 is trusted so the real server works.',
    'The binding table lists the client MAC, IP, VLAN 10 and Fa0/2.',
  ],
  breakIt: 'Remove the trust from Gi0/1 and watch every client lose DHCP service.',
};
