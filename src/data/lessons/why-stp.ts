import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'why-stp';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.6',
  domain: 'D2',
  title: 'Why Spanning Tree Exists',
  description: 'Why redundant Layer 2 links create loops, what a broadcast storm and MAC table instability look like, and why STP is needed.',
  whyMatters:
    'Gusto natin ng redundancy (dalawang daan), pero sa Layer 2 ang dalawang daan ay puwedeng maging loop na magpapabagsak sa buong network sa loob ng ilang segundo. Kapag naintindihan mo ang problema, madaling maintindihan ang solusyon — ang Spanning Tree.',
  objectives: [
    'Explain why redundant links are built in a switched network',
    'Explain why Layer 2 loops never end (no TTL in the Ethernet header)',
    'Describe a broadcast storm, MAC table instability and duplicate frames',
    'Recognise the symptoms of a Layer 2 loop',
    'State what STP does at a high level: blocks redundant links logically',
  ],
  estimatedMinutes: 30,
  difficulty: 'intermediate',
  keywords: ['loop', 'broadcast storm', 'MAC flapping', 'redundancy', 'STP', 'TTL', 'Layer 2'],
  examObjectives: ['2.5'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Networks add redundant links between switches so that one cable failure does not take a site offline. But a switched network with two paths between the same switches forms a loop.',
        'Ethernet frames have no time-to-live. A broadcast frame in a loop is copied and forwarded again and again forever. Spanning Tree Protocol (STP) prevents this by logically blocking some ports so there is only one active path.',
      ],
      taglish: [
        'Gusto ng mga network engineer ang **redundancy**: kung maputol ang isang cable, may **pangalawang daan**. Kaya kumokonekta ang mga switch sa **higit sa isang link**.',
        'Ang problema: sa **Layer 2**, ang dalawang daan ay puwedeng maging **loop**. At ang Ethernet frame ay **walang TTL** (walang “expiry”), kaya ang broadcast na napunta sa loop ay **umiikot nang walang katapusan**, at **dumadami** pa dahil bawat switch ay nagko-copy nito sa lahat ng port.',
        'Tatlong sakit ng loop: **(1) Broadcast storm** — ubos ang bandwidth at CPU. **(2) MAC table instability** — paiba-iba ang port ng isang MAC. **(3) Duplicate frames** — dumadating ang parehong frame nang maraming beses.',
        'Ang solusyon ay **STP (Spanning Tree Protocol)**: **hindi tinatanggal ang cable**, kundi **hinaharangan (block) ang isang port** para iisa lang ang aktibong daan. Kapag bumagsak ang aktibong link, **binubuksan** ang naka-block.',
      ],
      technical: [
        'Layer 3 packets carry a TTL that routers decrement, so an IP routing loop eventually discards the packet. Ethernet frames have no equivalent field. A switch floods broadcast, multicast and unknown-unicast frames out every port except the ingress port, so in a physical loop the flooded copies are received and flooded again indefinitely, and the number of copies grows.',
        'Three effects: (1) Broadcast storm: flooded frames consume link bandwidth and switch CPU until legitimate traffic cannot pass, and hosts also spend CPU processing the broadcasts. (2) MAC table instability (MAC flapping): a frame with the same source MAC arrives on different ports as it circulates, so the switch keeps rewriting the port for that address; unicast forwarding becomes unreliable. (3) Multiple frame copies: a unicast to a host whose MAC is not yet learned is flooded along both paths and the destination receives duplicates.',
        'IEEE 802.1D Spanning Tree Protocol builds a loop-free logical topology by electing one root bridge and placing redundant ports into a blocking (discarding) state. Cisco switches run a per-VLAN version (PVST+) by default. The physical redundancy is preserved: if an active link fails, STP unblocks an alternate port.',
        'Typical symptoms: sudden very high CPU on several switches, link LEDs blinking rapidly and in step, users losing connectivity across the whole VLAN, and MAC flapping log messages such as %SW_MATM-4-MACFLAP_NOTIF.',
      ],
    },
    {
      type: 'analogy',
      title: 'Rotonda na walang labasan',
      body: [
        'A loop is a roundabout with no exit. Cars (frames) that enter keep circling, and every entrance keeps feeding more cars in. Soon nothing else can move. STP closes one of the roads so the roundabout becomes a straight road with a spare route on standby.',
      ],
      taglish: [
        'Ang **loop** ay **rotonda na walang labasan**. Ang mga sasakyan (frame) na pumasok ay **umiikot lang**, at bawat pasukan ay **nagdadagdag pa** ng sasakyan. Wala nang makagalaw. Ang **STP** ay **isinasara ang isang kalsada** para maging diretsong daan, at ang isinara ay **nakahanda bilang reserba**.',
      ],
    },
    {
      type: 'hook',
      title: 'B-M-D: Bagyo, Mali-mali, Doble',
      trick: '**Loop = BAGYO (storm) + MALI-MALI (MAC flap) + DOBLE (duplicate). STP = isara ang isang kalsada, may reserba.**',
      taglish: [
        'Tatlong sakit ng Layer 2 loop, tandaan ang **B-M-D**: **B**agyo = broadcast storm, **M**ali-mali = MAC table instability, **D**oble = duplicate frames.',
        '**Bakit walang katapusan?** Dahil **walang TTL ang Ethernet**. Ang router ay may TTL, ang switch ay wala.',
        '**STP sa isang pangungusap:** “Iisang daan lang ang bukas; ang iba ay naka-block pero naghihintay bilang reserba.”',
      ],
      test: {
        question: 'Bakit hindi humihinto ang broadcast sa loop, at ano ang tatlong epekto (B-M-D)?',
        answer: 'Dahil walang TTL sa Ethernet header, kaya walang nagtatapon ng frame. B = Bagyo (broadcast storm), M = Mali-mali (MAC table instability / flapping), D = Doble (duplicate frames).',
      },
    },
    { type: 'diagram', id: 'loop-storm', caption: 'Tatlong switch sa triangle na walang STP: ang broadcast ay umiikot at dumadami.' },
    {
      type: 'terms',
      items: [
        { term: 'Redundancy', definition: 'Extra links or devices so one failure does not stop the network.' },
        { term: 'Layer 2 loop', definition: 'A closed path of switches so frames can circle forever.' },
        { term: 'Broadcast storm', definition: 'Broadcast traffic multiplying in a loop until it consumes all bandwidth and CPU.' },
        { term: 'MAC flapping', definition: 'A MAC address is learned on different ports repeatedly because frames arrive from more than one direction.' },
        { term: 'TTL', definition: 'Time to live in the IP header. Ethernet has no equivalent, so loops do not expire.' },
        { term: 'Flooding', definition: 'Sending a frame out every port except the one it arrived on.' },
        { term: 'STP', definition: 'Spanning Tree Protocol (IEEE 802.1D). Blocks redundant ports to keep the topology loop-free.' },
        { term: 'Blocked port', definition: 'A port that does not forward user frames but listens for STP messages.' },
      ],
    },
    {
      type: 'flow',
      title: 'Paano nagiging bagyo ang isang broadcast (walang STP)',
      steps: [
        'Nagpadala ang PC ng **broadcast** sa **SW2**.',
        'Ipinasa ito ng SW2 sa **lahat ng port** maliban sa pinanggalingan: papunta sa SW1 **at** SW3.',
        'Ipinasa ng SW1 ang kopya sa SW3, at ipinasa naman ng SW3 ang kopya niya sa SW1, at pareho silang **nagfa-flood** ulit.',
        'Bumalik ang mga kopya sa SW2 mula sa **dalawang direksyon**, at **ipapasa ulit** ng SW2.',
        'Sa bawat ikot **dumadami ang kopya**. Ang **MAC table** ay paiba-iba ang port ng source MAC.',
        'Sa loob ng segundo, **ubos ang bandwidth at CPU** at ang buong VLAN ay hindi na magamit.',
      ],
    },
    {
      type: 'list',
      variant: 'remember',
      title: 'Mga sintomas ng Layer 2 loop',
      items: [
        'Napakataas na CPU sa maraming switch nang sabay',
        'Ang link LED ay sabay-sabay na mabilis na kumikislap',
        'Nawalan ng connectivity ang buong VLAN o site',
        'Mga log na %SW_MATM-4-MACFLAP_NOTIF (MAC flapping)',
        'Ang traffic counters ay mabilis na tumataas sa lahat ng port',
      ],
    },
    {
      type: 'cli',
      title: 'Ano ang hitsura ng MAC flapping',
      transcript: `%SW_MATM-4-MACFLAP_NOTIF: Host 00aa.aaaa.0001 in vlan 1 is flapping between port Fa0/1 and port Fa0/2
%SW_MATM-4-MACFLAP_NOTIF: Host 00aa.aaaa.0001 in vlan 1 is flapping between port Fa0/2 and port Fa0/1

SW2# show spanning-tree summary
Switch is in pvst mode`,
      copyable: 'show spanning-tree summary',
      explain: [
        { line: '%SW_MATM-4-MACFLAP_NOTIF', why: 'The switch reports the same MAC address appearing on two different ports, a classic sign of a loop.' },
        { line: 'flapping between port Fa0/1 and port Fa0/2', why: 'The frame arrives from two directions because it is circulating through a loop.' },
        { line: 'show spanning-tree summary', why: 'Confirms the STP mode. Cisco switches run PVST+ by default, which normally stops these loops.' },
      ],
      note: 'This is sample output for study, not from the simulator. Loops usually happen when someone disables STP or adds an extra cable with STP protection off.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **IP packet ay may TTL, ang Ethernet frame ay wala.** Kaya ang routing loop ay natatapos (TTL umabot sa 0), pero ang **switching loop ay hindi**. Ito ang paborito ng exam.' },
    { type: 'callout', kind: 'trap', text: 'Hindi **tinatanggal** ng STP ang redundant link. **Hinaharangan lang ito sa software (logical block)** — naghihintay bilang backup. Kapag bumagsak ang active link, ang STP ang magbubukas nito.' },
    { type: 'callout', kind: 'tip', text: 'Ang mga Cisco switch ay may **STP na naka-on bilang default** (PVST+). Kaya ang loop ay madalas nangyayari lang kapag may nag-**disable ng STP** o may maling config sa isang port.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Saying an Ethernet frame is dropped after a set number of hops. There is no TTL on Layer 2.',
        'Thinking STP physically disables cables. It blocks ports logically.',
        'Believing a loop only wastes bandwidth. It also destabilises MAC tables and duplicates frames.',
        'Blaming a “bad switch” when the actual cause is a redundant path with STP disabled.',
        'Assuming routers are affected the same way as switches. IP TTL limits router loops.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: “Biglang bumagsak ang buong LAN”',
      scenario: 'At 9:05 a technician plugs a patch cable between two wall jacks that both lead to the same switch stack. Within seconds the whole VLAN loses connectivity, every switch shows very high CPU and link LEDs blink together.',
      evidence: `%SW_MATM-4-MACFLAP_NOTIF: Host 00aa.aaaa.0001 in vlan 1 is flapping between port Fa0/5 and port Fa0/6`,
      question: 'Ano ang nangyari at ano ang unang gagawin mo?',
      answer: 'The patch cable created a Layer 2 loop. Broadcasts circulate forever (no TTL) causing a broadcast storm and MAC flapping. This means STP did not block the loop, for example because it is disabled or the port has a misconfiguration.',
      fix: 'Unplug the extra cable (or shut down one of the looped ports) to stop the storm. Then verify STP is enabled with show spanning-tree, and add protections later (PortFast with BPDU Guard on access ports).',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Bakit hindi puwedeng “tanggalin na lang ang redundant cable” bilang solusyon? At bakit hindi rin ito problema sa router network?',
      answer: 'Because redundancy is the reason the extra cable exists: if the active link fails, the standby keeps the network running. STP keeps both cables but blocks one port logically. Routers do not suffer the same way because IP packets have a TTL that is decremented at each hop, so a routed loop eventually discards the packet.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Ethernet has no TTL. A Layer 2 loop never ends by itself.',
        'Three effects: broadcast storm, MAC table instability, multiple frame copies.',
        'STP blocks ports logically; it does not remove cables.',
        'Cisco switches run PVST+ by default.',
        'Symptoms: high CPU everywhere, blinking LEDs, MAC flapping messages.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Redundant switch links are good but form Layer 2 loops.',
        'No TTL in Ethernet means frames circle forever.',
        'B-M-D: Bagyo (storm), Mali-mali (MAC flapping), Doble (duplicates).',
        'STP keeps redundancy but blocks ports logically to remove the loop.',
        'Susunod: paano pumipili ang STP kung anong port ang iba-block — root bridge at port roles.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'Why can a broadcast frame circulate forever in a Layer 2 loop?',
    choices: ['Switches do not have a MAC table', 'Ethernet frames have no time-to-live field', 'Broadcasts are not forwarded by switches', 'STP forwards them in a loop'], correct: [1],
    explanation: 'Ethernet has no TTL, so no device discards a frame after a number of hops.',
    wrong: { 0: 'Switches have MAC tables, but they flood broadcasts anyway.', 2: 'Switches flood broadcasts on all ports except the ingress port.', 3: 'STP prevents loops.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'What is the primary purpose of Spanning Tree Protocol?',
    choices: ['Increase link speed', 'Prevent Layer 2 loops in a redundant switched network', 'Route between VLANs', 'Assign IP addresses'], correct: [1],
    explanation: 'STP prevents Layer 2 loops by logically blocking redundant ports.',
    wrong: { 0: 'STP does not add speed.', 2: 'That is inter-VLAN routing.', 3: 'That is DHCP.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'What is a broadcast storm?',
    choices: ['A very large broadcast domain', 'Broadcast traffic multiplying in a loop until bandwidth and CPU are exhausted', 'A DHCP scope running out of addresses', 'A wireless interference event'], correct: [1],
    explanation: 'In a loop, broadcasts are flooded again and again and grow in number, consuming all bandwidth and switch CPU.',
    wrong: { 0: 'Size of the domain alone is not a storm.', 2: 'That is DHCP exhaustion.', 3: 'That is RF interference.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'A switch log shows a MAC address flapping between two ports. What does this most likely indicate?',
    choices: ['A failed power supply', 'A Layer 2 loop', 'A DHCP conflict', 'A native VLAN match'], correct: [1],
    explanation: 'The same source MAC arriving on different ports is typical of frames circulating through a loop.',
    wrong: { 0: 'A power fault would not generate MAC flapping.', 2: 'DHCP conflicts concern IP addresses.', 3: 'A native VLAN match is not an error.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are consequences of a Layer 2 switching loop?',
    choices: ['Broadcast storm', 'MAC address table instability', 'Lower CPU utilisation', 'Frames are discarded after 15 hops'], correct: [0, 1],
    explanation: 'Loops cause broadcast storms and MAC table instability (and duplicate frames). CPU rises, and there is no hop limit.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'Why is a routing loop less catastrophic than a switching loop?',
    choices: ['Routers are faster than switches', 'IP packets have a TTL that is decremented until the packet is discarded', 'Routers do not forward broadcasts and multicasts', 'Routers have larger tables'], correct: [1],
    explanation: 'The TTL in the IP header limits how long a packet can loop. Ethernet has no such field.',
    wrong: { 0: 'Speed is not the reason.', 2: 'Routers do not forward broadcasts, but the difference is the TTL for looping packets.', 3: 'Table size is irrelevant.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: STP removes the redundant cable so that only one path physically exists.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'STP blocks redundant ports logically. The cables remain and are used if the active path fails.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'Which STP version do Cisco Catalyst switches run by default?',
    choices: ['PVST+ (per-VLAN spanning tree)', 'No spanning tree', 'MSTP only', 'VTP'], correct: [0],
    explanation: 'Catalyst switches run PVST+ by default, one spanning tree instance per VLAN.',
    wrong: { 1: 'STP is on by default.', 2: 'MST must be configured.', 3: 'VTP is unrelated to loop prevention.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'hard', type: 'single',
    prompt: 'A host sends a unicast frame to a MAC address that no switch has learned yet, in a loop without STP. What happens?',
    choices: ['The frame is dropped', 'The frame is flooded and the destination can receive multiple copies', 'The frame is sent only to the root bridge', 'The frame is converted to a broadcast and discarded'], correct: [1],
    explanation: 'Unknown unicast frames are flooded. In a loop, copies travel both ways and can reach the destination more than once.',
    wrong: { 0: 'Switches flood unknown unicast frames rather than drop them.', 2: 'There is no root bridge without STP.', 3: 'The frame is not converted.' },
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'Why do network designers add redundant links between switches?',
    choices: ['To provide a backup path if a link or switch fails', 'To make MAC tables larger', 'To remove the need for VLANs', 'To increase the TTL'], correct: [0],
    explanation: 'Redundant links provide fault tolerance. STP is used to keep them loop-free.',
    wrong: { 1: 'MAC table size is unaffected.', 2: 'VLANs and redundancy are separate topics.', 3: 'Ethernet has no TTL.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: paano tandaan ang problema ng Layer 2 loop?', back: 'B-M-D: BAGYO (broadcast storm), MALI-MALI (MAC table instability), DOBLE (duplicate frames). Walang TTL sa Ethernet kaya walang katapusan. STP = isara ang isang kalsada, may reserba.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Why do Layer 2 loops never end?', back: 'Ethernet frames have no TTL, so nothing discards them.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Three effects of a switching loop?', back: 'Broadcast storm, MAC table instability (flapping), duplicate frames.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What does STP do?', back: 'Logically blocks redundant ports to create a loop-free topology while keeping backup links.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Default STP on Cisco switches?', back: 'PVST+ (one STP instance per VLAN), enabled by default.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Symptoms of a Layer 2 loop?', back: 'High CPU on many switches, blinking LEDs, VLAN-wide outage, MAC flapping log messages.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Why are IP routing loops less harmful?', back: 'The IP TTL decrements at every hop and the packet is discarded at 0.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Trace a broadcast around a loop',
  tool: 'Paper',
  minutes: 25,
  objective: 'Trace a broadcast through three looped switches by hand, count the copies, and explain MAC flapping.',
  topology: 'SW1, SW2 and SW3 connected in a triangle (SW1–SW2, SW2–SW3, SW3–SW1). PC-A hangs off SW2. No STP.',
  steps: [
    'Draw the triangle and PC-A attached to SW2.',
    'PC-A sends one broadcast. Mark on your drawing every port SW2 floods it out of (two ports). That is 2 copies after step 1.',
    'For each copy, write which switch receives it and which ports that switch floods it out of (all except the port it arrived on).',
    'Continue for three rounds. Record the number of copies after each round in a table. Notice the count never falls to zero.',
    'On SW1, write down which port it learns PC-A’s MAC on for each copy that arrives. Explain why the entry keeps changing.',
    'Now draw the same triangle with one port on SW3 blocked (toward SW2). Trace the same broadcast. How many copies exist now, and does the flood stop?',
    'Write one sentence about why the TTL in an IP packet would have stopped the loop but Ethernet has no equivalent.',
  ],
  checklist: [
    'Traced three rounds of flooding',
    'Recorded that the copy count grows or never ends',
    'Explained MAC flapping',
    'Showed the loop is broken when one port is blocked',
  ],
  hints: [
    'A switch never sends a frame back out of the port it arrived on, but it does send it out of all the others.',
    'With one blocked port, the triangle becomes a straight line and flooding ends at the last switch.',
  ],
  solution: [
    'Round 1: SW2 floods to SW1 and SW3 (2 copies). Round 2: SW1 floods to SW3 and SW3 floods to SW1 (2 more), and so on; the traffic never ends.',
    'SW1 sees PC-A’s MAC arrive on the port toward SW2 and then again on the port toward SW3, so it keeps flapping between them.',
    'With SW3’s port toward SW2 blocked, the broadcast reaches SW1 and SW3 once each and stops: no loop.',
  ],
  breakIt: 'Add a fourth switch connected to two others and predict how many blocked ports STP would need. (Answer: one blocked port per independent loop.)',
};
