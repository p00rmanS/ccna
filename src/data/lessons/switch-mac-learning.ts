import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'switch-mac-learning';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.7',
  domain: 'D1',
  title: 'How a Switch Learns MAC Addresses',
  description: 'Learn, flood, forward, filter and age: the five behaviours behind every Layer 2 switch.',
  whyMatters:
    'This is the exam objective about switching concepts, and the foundation for VLANs, STP and port security. Once you can predict what a switch does with any frame, Layer 2 troubleshooting becomes logic instead of guessing.',
  objectives: [
    'Explain how a switch builds its MAC address table',
    'Predict whether a frame is forwarded, flooded or filtered',
    'Explain why the switch learns the SOURCE address',
    'Explain aging and read “show mac address-table”',
    'Explain why the first frame between two hosts is flooded',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['MAC address table', 'CAM', 'flooding', 'forwarding', 'filtering', 'aging', 'unknown unicast', 'show mac address-table'],
  examObjectives: ['1.13'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A new switch knows nothing. Each time a frame arrives, the switch notes which port it arrived on and who sent it. Over time it builds a list: “this device is on that port”.',
        'When a frame needs delivering, the switch looks up the destination. If it knows the port, it sends the frame only there. If it does not know, it sends the frame out every other port and lets the right device answer.',
      ],
      taglish: [
        'Ang bagong switch, walang alam. Kada may dumating na frame, isinusulat niya kung sino ang nagpadala at sa anong port ito dumating — parang receptionist na nagtatala kung sino ang nakaupo sa aling desk.',
        'Kapag may ihahatid, titingnan niya ang listahan. Kung alam na kung saang port ang tatanggap, doon lang niya ipapadala. Kung hindi pa alam, ipapadala niya sa lahat ng port maliban sa pinanggalingan, at sasagot ang tamang device. Kapag sumagot na, matututunan na rin ng switch ang port niya.',
      ],
      technical: [
        'A switch maintains a MAC address table (in CAM) mapping MAC address, VLAN and port. For every frame it receives it performs two actions: learning — record the SOURCE MAC against the ingress port and VLAN — and forwarding — use the DESTINATION MAC to decide what to do.',
        'Decisions: known unicast → forward out the single port in the table; unknown unicast → flood out every port in the VLAN except the ingress port; broadcast (and, without multicast snooping, multicast) → flood; destination on the same port it arrived on → filter (drop). Dynamic entries age out after inactivity, by default 300 seconds on Catalyst switches, and are refreshed when the host sends again.',
        'A port can have many MAC addresses (for example an uplink to another switch). A group address (broadcast/multicast) can never be a source, so it is never learned. The frame itself is not changed by the switch, and a switch does not divide a broadcast domain.',
      ],
    },
    {
      type: 'analogy',
      title: 'A receptionist with a blank seating chart',
      taglish: ['Ang bagong receptionist ay walang seating chart. Kapag may memo, isinusulat niya kung sino ang nagpadala at saang desk galing (learn). Kapag may memo para sa taong alam na niya ang desk, dadalhin niya nang diretso (forward). Kapag hindi niya alam, isisigaw niya sa buong palapag (flood). Kapag nasa parehong desk lang, wala siyang gagawin (filter). At buburahin niya ang tala ng taong matagal nang hindi nagpapadala (aging).'],
      body: [
        'A new receptionist has no seating chart. Every time someone sends a memo she notes the sender’s name and the desk it came from — that is learning. When a memo arrives for someone whose desk she has already noted, she carries it straight there (forward). If she does not know the desk, she shouts the memo across the whole floor and the right person picks it up (flood). If the recipient turns out to sit at the desk the memo came from, she does nothing (filter). If someone has not sent a memo for a long time, she rubs out their entry (aging).',
      ],
    },
    {
      type: 'hook',
      title: 'Ang tsismosang switch',
      trick: '**Sino nagsalita? ISULAT (Source → LEARN).** **Sino kinakausap? HANAPIN (Destination → FORWARD).** **Di mahanap? ISIGAW (FLOOD).**',
      taglish: [
        'Ang switch ay parang **tsismosa**: nakikinig siya sa **nagsasalita** (SOURCE MAC) at isinusulat kung sino ang nasaan — iyan ang **LEARN**.',
        'Kapag may ipapadala, hinahanap niya ang **kinakausap** (DESTINATION MAC) sa listahan niya. Kung alam na: **FORWARD** sa iisang port lang. Kung hindi pa alam (unknown unicast) o broadcast: **FLOOD** — isinisigaw sa lahat ng port maliban sa pinanggalingan. Kung nasa parehong port lang: **FILTER** — huwag na.',
        '**Source = LEARN, Destination = FORWARD.** Iyan lang. At ang tala ay nabubura sa **300 segundo** kapag hindi na nagsasalita ang device (aging).',
      ],
      test: {
        question: 'Table: A sa Fa0/1, B sa Fa0/2. Si C (Fa0/3) ay nagpadala kay A. Ano ang gagawin ng switch?',
        answer: 'LEARN: isusulat si C sa Fa0/3 (source). FORWARD: dahil kilala si A, ipapadala lang sa Fa0/1.',
      },
    },
    { type: 'interactive', id: 'mac-learning', caption: 'Send frames between four PCs and watch the switch learn, flood, forward and filter. Step through each frame.' },
    {
      type: 'flow',
      title: 'PC-A pings PC-B for the first time (real behaviour)',
      steps: [
        'Both MAC tables are empty. PC-A knows PC-B’s IP address but not its MAC, so PC-A first broadcasts an ARP request (destination FFFF.FFFF.FFFF).',
        'The switch LEARNS PC-A’s MAC on its port from the ARP’s source address, then FLOODS the broadcast out every other port.',
        'PC-B replies with a unicast ARP reply to PC-A. The switch LEARNS PC-B’s MAC and FORWARDS the reply out PC-A’s port only.',
        'PC-A now sends the ICMP echo request to PC-B’s MAC. Both are known, so the switch FORWARDS it out PC-B’s port only.',
        'Entries stay for 300 seconds after the last frame from that host, then age out.',
      ],
    },
    {
      type: 'terms',
      items: [
        { term: 'MAC address table', definition: 'The switch’s list of MAC address → port (per VLAN). Also called the CAM table.' },
        { term: 'Learning', definition: 'Recording the source MAC and ingress port of each incoming frame.' },
        { term: 'Forwarding', definition: 'Sending a frame out only the port where the destination was learned.' },
        { term: 'Flooding', definition: 'Sending a frame out all ports in the VLAN except the one it arrived on.' },
        { term: 'Unknown unicast', definition: 'A unicast frame whose destination MAC is not in the table; it is flooded.' },
        { term: 'Filtering', definition: 'Dropping a frame whose destination is on the port it arrived on.' },
        { term: 'Aging', definition: 'Removing dynamic entries after inactivity (default 300 s).' },
        { term: 'Static entry', definition: 'An entry configured by an administrator that never ages out.' },
      ],
    },
    {
      type: 'cli',
      title: 'Reading and managing the MAC address table',
      transcript: `SW1# show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0000.0000.000a    DYNAMIC     Fa0/1
   1    0000.0000.000b    DYNAMIC     Fa0/2
Total Mac Addresses for this criterion: 2

SW1# show mac address-table aging-time
Global Aging Time:  300

SW1# clear mac address-table dynamic
SW1# show mac address-table dynamic
Total Mac Addresses for this criterion: 0`,
      copyable: 'show mac address-table\nshow mac address-table aging-time\nclear mac address-table dynamic',
      explain: [
        { line: 'show mac address-table', why: 'Lists learned addresses: VLAN, MAC, type and the port each is on.' },
        { line: 'DYNAMIC', why: 'Learned automatically and subject to aging. Manually configured entries show as STATIC.' },
        { line: 'aging-time  300', why: 'Seconds of inactivity before a dynamic entry is removed.' },
        { line: 'clear mac address-table dynamic', why: 'Empties learned entries; the switch relearns as traffic flows. Handy in labs, rarely used on a live network.' },
      ],
      note: 'Older IOS releases and Packet Tracer also accept “show mac-address-table” (with a hyphen). A static entry looks like: mac address-table static 0000.0000.000c vlan 1 interface fastEthernet 0/3.',
    },
    { type: 'callout', kind: 'trap', text: 'A switch learns from the SOURCE MAC of incoming frames and forwards using the DESTINATION MAC. It never learns a destination address from a frame it is forwarding.' },
    { type: 'callout', kind: 'trap', text: 'Flooding is normal, not a fault: unknown unicast and broadcast frames are flooded by design. It only becomes a problem if it never stops (a sign of missing entries or a loop).' },
    { type: 'callout', kind: 'relax', text: 'Do not worry about CAM sizes, hashing or hardware detail. For CCNA you need the behaviour: learn, flood, forward, filter, age.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Common mistakes',
      items: [
        'Saying the switch learns the destination address. It learns the source.',
        'Believing a switch forwards a known unicast frame to all ports. It uses one port.',
        'Forgetting the ingress port is excluded when flooding.',
        'Thinking a switch stops broadcasts. It floods them to the whole VLAN.',
        'Expecting one MAC per port. An uplink port can have dozens.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting scenario: “Someone is seeing traffic for someone else”',
      scenario: 'Right after “clear mac address-table dynamic”, a packet capture on PC-C shows frames addressed to PC-B’s MAC. PC-C is not involved in the conversation.',
      question: 'Is something wrong?',
      answer: 'No. PC-B’s MAC is currently unknown, so the switch floods frames addressed to it out every port, including PC-C’s. As soon as PC-B sends a frame (for example an ARP reply), the switch relearns it and unicast traffic to PC-B stops reaching PC-C. Persistent flooding, however, would suggest that the switch never sees traffic from PC-B — for example a one-way path — or that entries keep aging out because the host is silent for more than 300 seconds.',
      fix: 'Observe with “show mac address-table” after PC-B talks. If the entry appears and stays, behaviour is normal. If it never appears, check PC-B’s link, VLAN and cabling.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge: predict the action',
      prompt: 'The table is: A on Fa0/1, B on Fa0/2. A frame from C (arriving on Fa0/3) is addressed to A. Then a frame from A is addressed to FFFF.FFFF.FFFF. What does the switch do each time?',
      answer: 'Frame 1: learn C on Fa0/3, then forward out Fa0/1 only (A is known). Frame 2: refresh A on Fa0/1, then flood out every other port (Fa0/2, Fa0/3 and the rest) because it is a broadcast.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Learn = source MAC. Forward/flood/filter = destination MAC.',
        'Unknown unicast, broadcast and (by default) multicast are flooded.',
        'Default aging time is 300 seconds.',
        '“show mac address-table” is the command to remember.',
      ],
    },
    {
      type: 'summary',
      points: [
        'A switch starts empty and learns source MACs per port.',
        'Known unicast is forwarded to one port; unknown unicast and broadcasts are flooded.',
        'A frame whose destination is behind the ingress port is filtered.',
        'Dynamic entries age out after 300 seconds by default.',
        'Switches do not divide broadcast domains.',
        'Next: binary — the skill that makes IPv4 subnetting possible.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'From which field does a switch learn MAC addresses?',
    choices: ['The destination MAC of incoming frames', 'The source MAC of incoming frames', 'The IP header', 'The EtherType'], correct: [1],
    explanation: 'The source MAC tells the switch who sent the frame and which port leads to that device.',
    wrong: { 0: 'The destination is used to decide where to send the frame.', 2: 'Layer 2 switches do not use IP addresses to learn.', 3: 'EtherType describes the payload.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'A frame arrives with a destination MAC that is NOT in the MAC address table. What does the switch do?',
    choices: ['Drops the frame', 'Floods it out all ports except the ingress port', 'Sends it back out the ingress port', 'Sends it to the default gateway'], correct: [1],
    explanation: 'Unknown unicast is flooded out every port in the VLAN except the port it arrived on.',
    wrong: { 0: 'Dropping would prevent the first frame from ever reaching its destination.', 2: 'A switch never returns a frame out its ingress port.', 3: 'A Layer 2 switch does not consult a gateway.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'A frame arrives whose destination MAC is in the table on Fa0/2 (the frame arrived on Fa0/1). What does the switch do?',
    choices: ['Floods it', 'Forwards it out Fa0/2 only', 'Drops it', 'Forwards it out every port except Fa0/1'], correct: [1],
    explanation: 'Known unicast is forwarded only out the port where the destination was learned.',
    wrong: { 0: 'Flooding is for unknown unicast and broadcasts.', 2: 'It is only dropped (filtered) if the destination is on the ingress port.', 3: 'That is flooding.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'What does a switch do with a frame addressed to FFFF.FFFF.FFFF?',
    choices: ['Forwards it to the router only', 'Floods it out all ports in the VLAN except the ingress port', 'Learns the address and drops the frame', 'Sends it only to the uplink'], correct: [1],
    explanation: 'Broadcasts go to every device in the VLAN, so the switch floods them.',
    wrong: { 0: 'Broadcasts go to all hosts, not just the router.', 2: 'FFFF.FFFF.FFFF is never learned, and the frame is not dropped.', 3: 'The uplink is just one of the ports.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'What is the default MAC address aging time on a Cisco Catalyst switch?',
    choices: ['30 seconds', '60 seconds', '300 seconds', '3600 seconds'], correct: [2],
    explanation: 'The default dynamic aging time is 300 seconds.',
    wrong: { 0: 'Too short.', 1: 'Too short.', 3: 'Too long.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'medium', type: 'single',
    prompt: 'The table has A on Fa0/1 and B on Fa0/2. C, on Fa0/3, sends a frame to A. What is the outcome?',
    choices: ['Learn C on Fa0/3, forward out Fa0/1 only', 'Learn A on Fa0/3, forward out Fa0/1 only', 'Learn C on Fa0/3, flood out all ports', 'Do not learn C, forward out Fa0/1'], correct: [0],
    explanation: 'The source (C) is learned on the ingress port; the destination (A) is known, so the frame is forwarded out Fa0/1 only.',
    wrong: { 1: 'The source is C, not A.', 2: 'A is known, so there is no flooding.', 3: 'The switch always learns the source.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO statements about a switch MAC address table are true?',
    choices: ['One port can have many MAC addresses associated with it', 'The switch learns the destination MAC of frames it forwards', 'A broadcast address is never learned as a source', 'Dynamic entries never expire'], correct: [0, 2],
    explanation: 'An uplink to another switch can have many MACs behind it, and group addresses are never valid sources. The switch learns sources, and dynamic entries age out.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'easy', type: 'single',
    prompt: 'Which command displays the learned MAC addresses on a modern Cisco switch?',
    choices: ['show arp', 'show mac address-table', 'show ip route', 'show vlan brief'], correct: [1],
    explanation: '“show mac address-table” lists VLAN, MAC, type and port.',
    wrong: { 0: 'ARP maps IP to MAC on hosts and routers.', 2: 'The routing table lists networks.', 3: 'This lists VLANs and their ports.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: a Layer 2 switch separates broadcast domains, so broadcasts never leave a switch.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'A switch floods broadcasts to every port in the VLAN. Only a router (or VLAN boundaries) separates broadcast domains.',
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D1', objective: '1.13', difficulty: 'hard', type: 'single',
    prompt: 'After “clear mac address-table dynamic”, PC-C sees frames addressed to PC-B. What is the best explanation?',
    choices: ['The switch is broken', 'Unknown unicast frames are flooded until PC-B’s MAC is relearned', 'PC-C is in promiscuous mode and the switch is hubbing all traffic', 'A loop has formed'], correct: [1],
    explanation: 'With no entry for PC-B, the switch floods frames addressed to it. Once PC-B transmits, the switch relearns its port and stops flooding.',
    wrong: { 0: 'This is designed behaviour.', 2: 'The switch is not acting as a hub; flooding stops once the address is learned.', 3: 'A loop would cause continuous flooding, not brief flooding after a clear.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: paano tandaan ang ginagawa ng switch?', back: 'Tsismosa: SOURCE = LEARN (isulat), DESTINATION = FORWARD (hanapin), hindi alam/broadcast = FLOOD (isigaw), parehong port = FILTER. Aging 300 s.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'switching', front: 'Which MAC does a switch learn from a frame?', back: 'The SOURCE MAC, associated with the ingress port and VLAN.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'switching', front: 'Which MAC does a switch use to choose the output port?', back: 'The DESTINATION MAC.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'switching', front: 'What happens to unknown unicast?', back: 'It is flooded out every port in the VLAN except the ingress port.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'switching', front: 'What happens to a broadcast frame?', back: 'It is flooded out every port in the VLAN except the ingress port.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'switching', front: 'What is filtering?', back: 'Dropping a frame whose destination is on the same port it arrived on.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'switching', front: 'Default MAC aging time on Catalyst?', back: '300 seconds.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'command', front: 'Command to view the MAC address table?', back: 'show mac address-table' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'command', front: 'Command to clear learned MAC entries?', back: 'clear mac address-table dynamic' },
  { id: `${ID}-f9`, lessonId: ID, domain: 'D1', category: 'switching', front: 'Why is the first frame between two hosts often flooded?', back: 'The switch has not yet learned the destination MAC; the ARP broadcast and reply teach it.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Watch a switch learn',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Start with an empty MAC table, generate traffic, and prove which frames are learned, flooded and forwarded.',
  topology: `PC1 (Fa0/1) ─┐
PC2 (Fa0/2) ─┼─ SW1
PC3 (Fa0/3) ─┘`,
  addressing: [
    { device: 'PC1', interface: 'FastEthernet0', address: '192.168.1.11/24' },
    { device: 'PC2', interface: 'FastEthernet0', address: '192.168.1.12/24' },
    { device: 'PC3', interface: 'FastEthernet0', address: '192.168.1.13/24' },
  ],
  steps: [
    'Connect PC1 to Fa0/1, PC2 to Fa0/2 and PC3 to Fa0/3 of SW1. Set the static addresses. Leave the switch on its defaults.',
    'On SW1 run “enable”, then “clear mac address-table dynamic”, then “show mac address-table”. Confirm no dynamic entries.',
    'On PC1 open Command Prompt and run “ping 192.168.1.12”. Wait for replies (the first attempt may time out while ARP completes).',
    'On SW1 run “show mac address-table” again. Record which MACs appear and on which ports.',
    'Now run “clear mac address-table dynamic” again and switch to Simulation mode. Send one ICMP PDU from PC1 to PC2 and step through it.',
    'Watch where the ARP request goes (all ports) and where the ARP reply goes (one port). Note whether PC3 receives the ICMP echo itself.',
    'Finish by pinging PC3 from PC2 and observing which new entry appears in the table.',
  ],
  checklist: [
    'The table was empty before the first ping',
    'After PC1 → PC2, PC1 and PC2 MACs are learned on Fa0/1 and Fa0/2',
    'The ARP request was flooded; the ARP reply was forwarded to PC1 only',
    'PC3 did NOT receive the unicast ICMP once the entries were learned',
    'PC3’s MAC appeared only after PC3 sent a frame',
  ],
  hints: [
    'The switch never learns a host until that host is the SOURCE of a frame. PC3 stays out of the table until it sends something.',
    'Packet Tracer accepts “show mac-address-table”; modern IOS uses “show mac address-table”.',
  ],
  solution: [
    'After the PC1 → PC2 ping, the table shows PC1 on Fa0/1 and PC2 on Fa0/2 (both learned as sources).',
    'The ARP request (broadcast) is flooded to Fa0/2 and Fa0/3; the ARP reply (unicast to PC1) goes out Fa0/1 only.',
    'The ICMP echo goes only to PC2, so PC3 never sees it. PC3 is learned later, when it transmits.',
  ],
  breakIt: 'Move PC2’s cable from Fa0/2 to Fa0/4 without clearing the table and ping PC2 from PC1. Watch what happens to the stale Fa0/2 entry and how the table changes after PC2 sends a frame from Fa0/4.',
};
