import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'l2-security-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.9',
  domain: 'D5',
  title: 'Layer 2 Security Deep Dive: Port Security, DHCP Snooping and DAI Together',
  description: 'Combine port security, DHCP snooping and Dynamic ARP Inspection into one access-layer design and diagnose err-disabled ports and dropped DHCP or ARP.',
  whyMatters:
    'Sa exam, ang tatlong feature na ito ay madalas pinagsasama sa isang scenario: “may rogue DHCP server”, “may naka-err-disabled na port”, “may ARP spoofing”. Kailangan mong malaman kung alin ang tutugon sa ano at paano sila nag-uugnay (halimbawa, ang DAI ay umaasa sa DHCP snooping binding table).',
  objectives: [
    'Match each attack to the Layer 2 feature that stops it',
    'Configure port security with sticky MACs and the right violation mode',
    'Configure DHCP snooping trusted ports and verify the binding table',
    'Configure DAI and explain its dependency on snooping',
    'Recover an err-disabled port and read the verification output',
  ],
  estimatedMinutes: 45,
  difficulty: 'exam',
  keywords: ['port security', 'sticky', 'violation', 'err-disabled', 'DHCP snooping', 'trusted port', 'binding table', 'DAI', 'ARP spoofing', 'rogue DHCP', 'MAC flooding', 'errdisable recovery'],
  examObjectives: ['5.7'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Port security limits which MAC addresses may use a port. DHCP snooping blocks rogue DHCP servers and records who got which address. Dynamic ARP Inspection uses that record to drop forged ARP replies.',
        'Used together they protect the access layer against MAC flooding, rogue DHCP and ARP spoofing.',
      ],
      taglish: [
        'Ang **port security** ay naglilimita kung **aling MAC** ang puwede sa isang port. Ang **DHCP snooping** ay humaharang sa **pekeng DHCP server** at nagtatala kung sino ang nakakuha ng anong address. Ang **DAI (Dynamic ARP Inspection)** ay gumagamit ng talaang iyon para **ibagsak ang pekeng ARP reply**.',
        'Kapag pinagsama, protektado ang access layer laban sa **MAC flooding, rogue DHCP at ARP spoofing**.',
        'Mahalagang ugnayan: **walang DHCP snooping binding table, walang mapagkukumparahan ang DAI** (maliban sa static ARP ACL para sa mga host na may static IP).',
      ],
      technical: [
        'Port security applies to access ports. It limits the number of secure MAC addresses (default 1) and acts on violation: protect (drop silently), restrict (drop, log, increment counter) or shutdown (default; err-disabled). Sticky learning stores learned MACs in the running configuration; save the configuration to keep them.',
        'DHCP snooping classifies ports as trusted (uplinks, DHCP server) or untrusted (default). DHCP server messages (OFFER, ACK) arriving on untrusted ports are dropped. The snooping binding table records MAC, IP, VLAN, interface and lease time. It must be enabled globally and per VLAN.',
        'DAI inspects ARP packets on untrusted ports in enabled VLANs and compares the sender MAC and IP with the snooping binding table (or an ARP ACL); mismatches are dropped and logged. Uplinks are trusted. DAI rate-limits ARP (default 15 packets/s on untrusted ports) and the port is err-disabled if the limit is exceeded.',
      ],
    },
    {
      type: 'analogy',
      title: 'Guwardiya, listahan at pagsusuri',
      body: [
        'Port security is a guard at one door who knows which ID is allowed in. DHCP snooping is the front desk list of who was given which room. DAI is the inspector who checks that someone claiming a room number really holds that room on the list.',
      ],
      taglish: [
        'Ang **port security** ay **guwardiya sa isang pinto** na alam kung aling ID ang puwedeng pumasok. Ang **DHCP snooping** ay **listahan ng front desk**: sino ang binigyan ng anong kwarto. Ang **DAI** ay **inspektor** na tumitingin kung ang nagsasabing “akin ang kwartong ito” ay talagang nasa listahan.',
      ],
    },
    {
      type: 'hook',
      title: 'PDA',
      trick: '**PDA = Port security, DHCP snooping, Arp inspection. Trusted = uplink + server. DAI umaasa sa DHCP snooping. Shutdown = err-disabled.**',
      taglish: [
        '**P**ort security: limitado ang **MAC** bawat port (default 1, violation = shutdown).',
        '**D**HCP snooping: **untrusted** ang lahat maliban sa **uplink at DHCP server port**.',
        '**A**RP inspection: sinusuri ang ARP laban sa **snooping binding table**.',
        '**Recovery**: `shutdown` → `no shutdown` (o `errdisable recovery cause psecure-violation`).',
      ],
      test: {
        question: 'Anong feature ang tutugon sa (a) isang laptop na nag-aalok ng pekeng DHCP, (b) isang laptop na nagpapanggap bilang gateway sa ARP, (c) hub na may sampung MAC sa isang port?',
        answer: '(a) DHCP snooping, (b) DAI, (c) port security.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Port security at ang tatlong violation mode',
      paragraphs: [
        'I-configure muna ang port bilang access: `switchport mode access`, saka `switchport port-security`. Default: **maximum 1 MAC**, **violation shutdown**. Ang `switchport port-security maximum 2` ay pinapayagan ang dalawa (hal. PC + IP phone). Ang `switchport port-security mac-address sticky` ay natututo at isinasama sa running-config.',
        'Violation: **protect** = tahimik na ibinabagsak ang labis na frame (walang log, walang counter); **restrict** = ibinabagsak, nagla-log at nagdadagdag ng counter; **shutdown** = ang port ay **err-disabled** at nagla-log. Para bumawi: `shutdown` pagkatapos `no shutdown`, o `errdisable recovery cause psecure-violation` para kusang bumalik.',
        'Pagsusuri: `show port-security interface fa0/5` (status, violation count, last source MAC) at `show port-security address`.',
      ],
      steps: [
        'switchport mode access.',
        'switchport port-security.',
        'switchport port-security maximum <n>.',
        'switchport port-security mac-address sticky.',
        'switchport port-security violation shutdown | restrict | protect.',
        'show port-security interface <int>.',
      ],
      tricks: [
        'Ang port security ay hindi gumagana sa dynamic port; dapat access (o trunk na tahasang naka-configure).',
        'Isulat sa notes: protect = walang log, restrict = may log, shutdown = err-disabled.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: DHCP snooping at DAI nang magkasama',
      paragraphs: [
        '**DHCP snooping**: `ip dhcp snooping`, `ip dhcp snooping vlan 10,20`, at sa uplink/server port `ip dhcp snooping trust`. Ang mga untrusted port ay maaari lang magpadala ng DHCP client messages (DISCOVER, REQUEST); ang OFFER/ACK mula sa untrusted ay ibinabagsak. May **rate limit** din: `ip dhcp snooping limit rate 15`. Binabantayan din na ang source MAC sa DHCP packet ay tugma sa frame.',
        '**DAI**: `ip arp inspection vlan 10,20`, at sa uplink `ip arp inspection trust`. Para sa host na may static IP (walang DHCP binding), gumawa ng **ARP ACL** at gamitin sa DAI, kung hindi ay mabibigo ito.',
        '**Pagkakasunod**: i-enable muna ang DHCP snooping at tiyaking lumilitaw ang binding table, saka ang DAI. Pagsusuri: `show ip dhcp snooping binding`, `show ip arp inspection`, at `show ip arp inspection statistics`.',
      ],
      steps: [
        'ip dhcp snooping (global) → ip dhcp snooping vlan <list>.',
        'Uplink at server port: ip dhcp snooping trust.',
        'Suriin ang show ip dhcp snooping binding (may laman ba?).',
        'ip arp inspection vlan <list>; uplink: ip arp inspection trust.',
        'Static host: ARP ACL.',
      ],
      tricks: [
        'Ang “trusted” ay uplink papunta sa router/server at papunta sa ibang switch; ang host ports ay laging untrusted.',
        'Kapag may host na static ang IP at nawala ang koneksyon matapos i-enable ang DAI, ARP ACL ang kulang.',
      ],
    },
    {
      type: 'remember',
      title: 'Layer 2 security na lumalabas sa exam',
      items: [
        '**Port security default: maximum 1 MAC, violation shutdown (err-disabled).** **protect: walang log; restrict: log + counter.**',
        '**Sticky MAC = natututunan at nasa running-config; i-save para manatili.**',
        '**DHCP snooping: lahat untrusted maliban sa uplink at DHCP server port.** **OFFER/ACK mula sa untrusted = drop.**',
        '**DAI = ARP vs snooping binding table (o ARP ACL).** **Trusted sa uplink.**',
        '**Recovery: shutdown, no shutdown (o errdisable recovery).**',
      ],
    },
    { type: 'diagram', id: 'dhcp-snooping-ports', caption: 'Trusted at untrusted na port sa DHCP snooping.' },
    {
      type: 'terms',
      items: [
        { term: 'Secure MAC address', definition: 'A MAC address that port security allows on a port.' },
        { term: 'Sticky MAC', definition: 'A MAC address learned dynamically and stored in the running configuration.' },
        { term: 'Violation mode', definition: 'The action taken when port security is breached: protect, restrict or shutdown.' },
        { term: 'err-disabled', definition: 'A port shut down by a protection feature; it needs administrative recovery.' },
        { term: 'Trusted port', definition: 'A port allowed to carry DHCP server messages (uplink or DHCP server).' },
        { term: 'Binding table', definition: 'DHCP snooping record of MAC, IP, VLAN, interface and lease.' },
        { term: 'ARP ACL', definition: 'A list of static IP-to-MAC mappings used by DAI for hosts without DHCP bindings.' },
      ],
    },
    {
      type: 'flow',
      title: 'Pagbuo ng access-layer security',
      steps: [
        'Gawing access ang user ports at i-enable ang port security na may sticky at tamang violation mode.',
        'I-enable ang DHCP snooping sa mga VLAN at i-trust ang uplink at server port.',
        'Suriin ang binding table.',
        'I-enable ang DAI sa parehong VLAN at i-trust ang uplink.',
        'Gumawa ng ARP ACL para sa mga static host at i-verify gamit ang show commands.',
      ],
    },
    {
      type: 'cli',
      title: 'Tatlong feature sa isang switch',
      transcript: `SW1(config)# interface fastEthernet 0/5
SW1(config-if)# switchport mode access
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security maximum 2
SW1(config-if)# switchport port-security mac-address sticky
SW1(config-if)# switchport port-security violation restrict
SW1(config)# ip dhcp snooping
SW1(config)# ip dhcp snooping vlan 10
SW1(config)# ip arp inspection vlan 10
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# ip dhcp snooping trust
SW1(config-if)# ip arp inspection trust
SW1# show port-security interface fastEthernet 0/5
Port Security              : Enabled
Violation Mode             : Restrict
Maximum MAC Addresses      : 2`,
      copyable: 'interface fastEthernet 0/5\nswitchport mode access\nswitchport port-security\nswitchport port-security maximum 2\nswitchport port-security mac-address sticky\nswitchport port-security violation restrict\nip dhcp snooping\nip dhcp snooping vlan 10\nip arp inspection vlan 10\ninterface gigabitEthernet 0/1\nip dhcp snooping trust\nip arp inspection trust\nshow port-security interface fastEthernet 0/5',
      explain: [
        { line: 'switchport port-security violation restrict', why: 'Drops traffic from unknown MACs, logs and counts violations, but keeps the port up.' },
        { line: 'ip dhcp snooping vlan 10', why: 'Turns snooping on for VLAN 10; without a per-VLAN statement the global command does nothing.' },
        { line: 'ip dhcp snooping trust', why: 'Allows DHCP server messages on the uplink; all other ports stay untrusted.' },
        { line: 'ip arp inspection trust', why: 'Skips ARP validation on the uplink so legitimate replies from the gateway are not dropped.' },
      ],
      note: 'DAI relies on the DHCP snooping binding table, so enable and verify snooping first.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **protect** mode ay walang log at walang counter; ang **restrict** ay mayroon. Ang **shutdown** lang ang naglalagay sa port sa err-disabled.' },
    { type: 'callout', kind: 'trap', text: 'Kung nakalimutang **i-trust ang uplink** sa DHCP snooping, ibabagsak ang lehitimong OFFER/ACK mula sa server at walang mabibigyan ng address.' },
    { type: 'callout', kind: 'tip', text: 'Kapag nawala ang koneksyon ng host pagkatapos mag-enable ng DAI, tingnan ang show ip dhcp snooping binding: kung wala ang host doon (static IP), kailangan ng ARP ACL.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Enabling DHCP snooping globally but not on any VLAN.',
        'Forgetting to trust the uplink and the DHCP server port.',
        'Enabling DAI before snooping has built a binding table.',
        'Leaving port security on a port that is not an access port.',
        'Assuming restrict shuts the port down.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Err-disabled port',
      scenario: 'A user’s port goes down after an unfamiliar laptop is plugged in. The user says the cable is fine.',
      evidence: `%PM-4-ERR_DISABLE: psecure-violation error detected on Fa0/5, putting Fa0/5 in err-disable state
SW1# show port-security interface fa0/5
Port Status                : Secure-shutdown
Violation Mode             : Shutdown
Last Source Address:Vlan   : 0050.7966.6801:10`,
      question: 'Ano ang nangyari at paano ito aayusin?',
      answer: 'A second MAC address appeared on a port limited to one secure MAC, triggering the shutdown violation mode and putting the port in err-disabled.',
      fix: 'Remove the unknown device, then recover the port with shutdown followed by no shutdown (or enable errdisable recovery cause psecure-violation). If two devices are legitimate, raise the maximum to 2.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ikategorya: (a) rogue DHCP server, (b) ARP spoofing ng gateway, (c) MAC address table flooding gamit ang libo-libong pekeng MAC. Anong feature ang tutugon sa bawat isa?',
      answer: '(a) DHCP snooping. (b) Dynamic ARP Inspection. (c) Port security (limit the number of MACs per port).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Port security default: 1 MAC and shutdown.',
        'Trusted ports: uplinks and the DHCP server port.',
        'DAI depends on the snooping binding table.',
        'Know protect vs restrict vs shutdown.',
        'Recovery uses shutdown then no shutdown.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Port security limits MACs per port.',
        'DHCP snooping blocks rogue servers and builds a binding table.',
        'DAI uses that table to drop spoofed ARP.',
        'Trust the uplinks only.',
        'Recover err-disabled ports administratively.',
        'Susunod: EtherChannel deep dive.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'easy', type: 'single',
    prompt: 'What is the default violation mode of port security?',
    choices: ['Protect', 'Restrict', 'Shutdown', 'Log'], correct: [2],
    explanation: 'The default is shutdown, which puts the port in err-disabled state.',
    wrong: { 0: 'Protect is configurable, not default.', 1: 'Restrict is configurable, not default.', 3: 'There is no log mode.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'Which feature drops DHCP OFFER and ACK messages received on untrusted ports?',
    choices: ['Port security', 'DHCP snooping', 'Dynamic ARP Inspection', 'BPDU Guard'], correct: [1],
    explanation: 'DHCP snooping blocks server messages from untrusted ports, stopping rogue DHCP servers.',
    wrong: { 0: 'Port security limits MAC addresses.', 2: 'DAI inspects ARP packets.', 3: 'BPDU Guard protects STP.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'single',
    prompt: 'Dynamic ARP Inspection validates ARP packets against which data source?',
    choices: ['The MAC address table', 'The DHCP snooping binding table or ARP ACLs', 'The routing table', 'The spanning tree'], correct: [1],
    explanation: 'DAI compares sender MAC and IP with the snooping binding table (or an ARP ACL).',
    wrong: { 0: 'The MAC table maps MACs to ports, not IP to MAC.', 2: 'The routing table is for IP forwarding.', 3: 'STP is unrelated.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'hard', type: 'single',
    prompt: 'A violation mode drops offending frames, logs the event and increments a counter, but keeps the port up. Which mode is it?',
    choices: ['Protect', 'Restrict', 'Shutdown', 'Sticky'], correct: [1],
    explanation: 'Restrict drops, logs and counts while the port remains up.',
    wrong: { 0: 'Protect drops silently without logging.', 2: 'Shutdown err-disables the port.', 3: 'Sticky is a learning method, not a violation mode.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: uplink ports toward the DHCP server should be configured as trusted for DHCP snooping.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'Trusted ports may carry DHCP server messages.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.7', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO commands bring an err-disabled port back after the cause is removed?',
    choices: ['shutdown then no shutdown on the interface', 'errdisable recovery cause psecure-violation', 'spanning-tree portfast', 'switchport mode trunk'], correct: [0, 1],
    explanation: 'A manual shutdown/no shutdown or errdisable recovery restores the port.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: ano ang PDA?', back: 'Port security, DHCP snooping, Arp inspection. Trusted = uplink + server. DAI umaasa sa DHCP snooping. Shutdown = err-disabled.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Port security defaults?', back: 'Maximum 1 MAC; violation shutdown.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Protect vs restrict vs shutdown?', back: 'Protect drops silently; restrict drops, logs and counts; shutdown err-disables the port.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Which ports are trusted in DHCP snooping?', back: 'Uplinks and the DHCP server port; all others are untrusted.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What does DAI depend on?', back: 'The DHCP snooping binding table (or ARP ACLs).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'command', front: 'How do you recover an err-disabled port?', back: 'shutdown then no shutdown (or errdisable recovery).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D5', category: 'command', front: 'How are learned MACs kept in the configuration?', back: 'switchport port-security mac-address sticky (then save the configuration).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Secure an access switch',
  tool: 'Packet Tracer',
  minutes: 45,
  objective: 'Enable port security, DHCP snooping and DAI on an access switch, then trigger and recover each protection.',
  steps: [
    'Build a switch with an uplink to a router (DHCP server), two PCs and one extra laptop. Verify that DHCP works.',
    'Enable port security with maximum 1, sticky and shutdown on a PC port. Plug in the laptop and observe err-disabled.',
    'Recover the port with shutdown and no shutdown. Change the mode to restrict and repeat; compare the logs.',
    'Enable DHCP snooping on the VLAN and trust only the uplink. Connect a second DHCP server on an untrusted port and show that clients still get addresses from the real server.',
    'Check show ip dhcp snooping binding.',
    'Enable DAI on the VLAN, trust the uplink and confirm that normal traffic works.',
    'Give one PC a static IP and show that it fails under DAI until an ARP ACL is added.',
  ],
  checklist: [
    'Err-disabled triggered and recovered',
    'Restrict mode compared with shutdown',
    'Rogue DHCP server blocked',
    'Binding table populated',
    'Static host fixed with an ARP ACL',
  ],
  hints: [
    'Use show port-security interface to see the violation count.',
    'show ip arp inspection statistics shows dropped ARP packets.',
  ],
  solution: [
    'Port security: switchport port-security, maximum 1, sticky, violation shutdown.',
    'Snooping: ip dhcp snooping, ip dhcp snooping vlan 10, ip dhcp snooping trust on the uplink.',
    'DAI: ip arp inspection vlan 10, trust on the uplink; ARP ACL for static hosts.',
  ],
  breakIt: 'Remove ip dhcp snooping trust from the uplink and explain why no client receives an address.',
};
