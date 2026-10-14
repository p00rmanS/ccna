import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'etherchannel';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.10',
  domain: 'D2',
  title: 'EtherChannel: LACP, PAgP and Static Bundles',
  description: 'How to combine several physical links into one logical link for more bandwidth and redundancy, without STP blocking the extras.',
  whyMatters:
    'Kapag dalawang switch ang may maraming link sa pagitan nila, babagsak ang STP at isa lang ang gagamitin — sayang ang bandwidth. Ang EtherChannel ang sagot: pinagsasama ang mga link bilang isang lohikal na link. Lumalabas ito sa exam bilang configuration at troubleshooting ("bakit hindi nag-bundle?"), kaya kailangan mong kabisado ang mga mode at kung ano ang dapat magkatugma.',
  objectives: [
    'Explain why a bundle appears to STP as a single link',
    'Compare LACP (open standard), PAgP (Cisco) and a static "on" bundle',
    'Predict whether two modes (active, passive, desirable, auto, on) will form a bundle',
    'Configure a Layer 2 EtherChannel with channel-group and verify it with show etherchannel summary',
    'Identify the settings that must match on every member port',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['EtherChannel', 'LACP', 'PAgP', 'channel-group', 'Port-channel', 'active', 'passive', 'desirable', 'auto', '802.3ad', 'load balancing'],
  examObjectives: ['2.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Two switches joined by four cables would normally have three of them blocked by spanning tree, so you pay for four links and use one. EtherChannel bundles the cables into a single logical link called a Port-channel. STP sees one link, so nothing is blocked, and traffic is spread across all the members.',
        'The bundle can be negotiated by a protocol (LACP or PAgP) or forced on with no protocol at all. The negotiation protocols check that both ends agree, which is why they are safer.',
      ],
      taglish: [
        'Isipin na may **apat na cable** sa pagitan ng dalawang switch. Dahil sa **STP**, **isa lang ang gagana** at ang tatlo ay naka-block para walang loop. Sayang ang bayad sa apat.',
        'Ang **EtherChannel** ay pinagsasama ang apat na cable bilang **isang lohikal na link** na tinatawag na **Port-channel**. Para sa STP, **isang link lang ito**, kaya walang naka-block, at **nahahati ang traffic** sa lahat ng member.',
        'May **dalawang protocol** para mag-negotiate: **LACP** (open standard, IEEE 802.3ad) at **PAgP** (Cisco lang). May ikatlong paraan: **on** — walang negotiation, **pilit** na pinagsasama. Mas delikado ito dahil kapag mali ang kabilang dulo, walang magsasabi sa iyo.',
        'Para mag-bundle, **dapat magkapareho** ang mga member port: speed, duplex, VLAN/trunk settings. Kapag may isang naiba, **hindi sasali** ang port o magiging suspended ito.',
      ],
      technical: [
        'An EtherChannel bundles up to 8 active physical links (LACP also allows standby links) into one logical Port-channel interface. STP runs on the Port-channel, not on the members, so no member is blocked. Load is distributed per flow by a hash of source/destination MAC, IP or port numbers (port-channel load-balance), so one single flow never exceeds one member link speed.',
        'LACP (IEEE 802.3ad / 802.1AX) modes: active (initiates negotiation) and passive (responds only). PAgP (Cisco-proprietary) modes: desirable (initiates) and auto (responds only). Mode on forms a static bundle with no negotiation and only works with another on.',
        'Negotiation outcomes: active–active and active–passive form an LACP bundle; passive–passive does not. desirable–desirable and desirable–auto form a PAgP bundle; auto–auto does not. LACP and PAgP never interoperate with each other, and on only pairs with on.',
        'Configuration: interface range <ports>, channel-group <n> mode active|passive|desirable|auto|on. The Port-channel<n> interface is created automatically; trunk or access settings belong on it (and are normally mirrored on the members). All members must match speed, duplex, switchport mode, native/allowed VLANs and STP settings.',
        'Verification: show etherchannel summary (flags: P = bundled, D = down, s = suspended, I = stand-alone, S = Layer 2, U = in use), show etherchannel port-channel, show interfaces port-channel <n>.',
      ],
    },
    {
      type: 'analogy',
      title: 'Apat na linya ng highway',
      body: [
        'Four single-lane roads between two cities are confusing to manage, so the traffic authority closes three and sends everyone down one. EtherChannel is merging them into one four-lane highway: cars are still assigned to a lane, but nobody is turned away and if one lane closes the highway keeps working with three.',
      ],
      taglish: [
        'Apat na **tig-iisang linya** na kalsada sa pagitan ng dalawang lungsod — **isinara ng awtoridad ang tatlo** para walang gulo. Ang **EtherChannel** ay pagsasama nila bilang **isang apat-na-linyang highway**: may nakatalagang linya ang bawat sasakyan, **walang tinatanggihan**, at kapag may nagsarang linya, **tuloy pa rin** ang highway gamit ang tatlo.',
      ],
    },
    {
      type: 'hook',
      title: 'AP-DA-O: Active/Passive, Desirable/Auto, On',
      trick: '**LACP = Active/Passive (A-P)**, **PAgP = Desirable/Auto (D-A)**. Kailangan ng **kahit isang nag-uumpisa** (Active o Desirable). **On** ay para lang sa **On**.',
      taglish: [
        'Dalawang pares lang ang tandaan: **A-P para sa LACP**, **D-A para sa PAgP**.',
        '**Active at Desirable** = nag-uumpisa ng usapan. **Passive at Auto** = sumasagot lang.',
        'Kaya **dalawang sumasagot lang** (Passive–Passive o Auto–Auto) ay **walang magsisimula** — **hindi mag-bu-bundle**.',
        'Hindi puwedeng pagsamahin ang LACP at PAgP. At ang **On** ay **On lang ang kapares**.',
      ],
      test: {
        question: 'Isang switch ay "channel-group 1 mode passive", ang kabila ay "channel-group 1 mode auto". Mag-bu-bundle ba?',
        answer: 'Hindi. Passive ay LACP at Auto ay PAgP — magkaibang protocol, at pareho pang sumasagot lang.',
      },
    },
    { type: 'diagram', id: 'etherchannel-bundle', caption: 'Apat na physical link ang nagiging isang Port-channel1; nakikita ng STP bilang isang link.' },
    {
      type: 'terms',
      items: [
        { term: 'EtherChannel', definition: 'Cisco name for bundling several physical Ethernet links into one logical link.' },
        { term: 'Port-channel', definition: 'The logical interface that represents the bundle. STP and the trunk/access settings apply here.' },
        { term: 'LACP', definition: 'Link Aggregation Control Protocol, IEEE 802.3ad. Open standard. Modes: active, passive.' },
        { term: 'PAgP', definition: 'Port Aggregation Protocol. Cisco-proprietary. Modes: desirable, auto.' },
        { term: 'on', definition: 'Static bundle with no negotiation protocol; only forms with another "on".' },
        { term: 'channel-group', definition: 'The interface command that puts a physical port into a bundle and chooses the mode.' },
        { term: 'Load balancing', definition: 'Per-flow distribution of frames across members by hashing addresses or ports.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: pagbuo ng LACP bundle',
      steps: [
        'Ang SW1 at SW2 ay may apat na link: Gi0/1 hanggang Gi0/4. Walang EtherChannel pa, kaya STP blocks ang tatlo.',
        'Sa SW1 ay i-configure: interface range gi0/1 - 4 at channel-group 1 mode active. Awtomatikong nalilikha ang Port-channel1.',
        'Sa SW2: channel-group 1 mode passive (o active). Dapat kahit isa ay Active.',
        'Nagpapadala ng LACPDU ang SW1; sumasagot ang SW2. Nagkasundo sila sa mga setting.',
        'Naging bundled ang apat na port (flag P). Isang link na ang nakikita ng STP, kaya walang naka-block.',
        'I-configure ang trunk sa Port-channel1. Magagamit ang buong bandwidth sa pamamagitan ng load balancing.',
      ],
    },
    {
      type: 'cli',
      title: 'Mag-configure ng LACP trunk bundle',
      transcript: `SW1(config)# interface range gi0/1 - 4
SW1(config-if-range)# channel-group 1 mode active
SW1(config-if-range)# exit
SW1(config)# interface port-channel 1
SW1(config-if)# switchport mode trunk
SW1(config-if)# end
SW1# show etherchannel summary
Flags:  D - down   P - bundled in port-channel   s - suspended
        I - stand-alone   S - Layer2   U - in use
Group  Port-channel  Protocol    Ports
------+-------------+-----------+----------------------------
1      Po1(SU)         LACP      Gi0/1(P) Gi0/2(P) Gi0/3(P) Gi0/4(P)`,
      copyable: 'channel-group 1 mode active',
      explain: [
        { line: 'channel-group 1 mode active', why: 'Adds each port to bundle 1 and starts LACP negotiation. The Port-channel1 interface is created automatically.' },
        { line: 'interface port-channel 1', why: 'Trunk and VLAN settings go on the logical interface, so they apply to the whole bundle.' },
        { line: 'Po1(SU)', why: 'S = Layer 2 and U = in use: the bundle is healthy and working.' },
        { line: 'Gi0/1(P)', why: 'P = bundled in the port-channel. A (s) here would mean suspended — usually a mismatched setting.' },
      ],
      note: 'Sample output for study. Group numbers only need to be locally significant, but matching them avoids confusion.',
    },
    {
      type: 'verify',
      title: 'Paano i-verify ang EtherChannel',
      items: [
        { command: 'show etherchannel summary', shows: 'Each group, its protocol and every member with a flag. You want SU for the bundle and P for the members.' },
        { command: 'show etherchannel port-channel', shows: 'Detailed state of each member, including the negotiated mode and the partner.' },
        { command: 'show interfaces trunk', shows: 'The trunk appears on Port-channel1, not on the individual physical ports.' },
        { command: 'show spanning-tree', shows: 'STP runs on the Port-channel; the members are not listed as blocked.' },
      ],
      good: 'Po1(SU) with all members showing (P), and no ports blocked in STP.',
      bad: 'Po1(SD) or members showing (s) or (I) — a configuration mismatch or the wrong mode pairing.',
    },
    { type: 'callout', kind: 'trap', text: '**Passive–Passive** at **Auto–Auto** ay **hindi mag-bu-bundle** dahil walang nag-uumpisa. At ang **LACP ay hindi kailanman makakausap ang PAgP**. Ito ang pinakamadalas na patibong sa exam.' },
    { type: 'callout', kind: 'trap', text: 'Kapag **hindi magkatugma** ang speed, duplex, trunk mode o allowed VLAN ng isang member, **masususpinde** ang port (flag **s**). Kaya laging i-configure ang parehong settings sa lahat ng member bago i-bundle.' },
    { type: 'callout', kind: 'tip', text: 'Kapag nakita mo ang **"open standard"** o **"802.3ad"**, **LACP** iyon. **"Cisco-proprietary"** ay **PAgP**. **"No negotiation"** ay mode **on**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Maglagay ng Passive sa magkabilang dulo (o Auto sa magkabilang dulo) at hindi ito gagana.',
        'Subukang pagsamahin ang LACP at PAgP.',
        'Mag-configure ng trunk sa mga physical port pero hindi sa Port-channel.',
        'Mag-iba ng speed, duplex o native VLAN sa isang member kaya nasususpinde.',
        'Isiping lahat ng traffic ay hahatiin nang pantay — per-flow ang hash, kaya isang flow ay isang link lang.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Bakit isa lang ang gumagana sa apat na link?"',
      scenario: 'Four links between two switches were bundled, but the Port-channel is down and the members are suspended.',
      evidence: `SW1# show etherchannel summary
Group  Port-channel  Protocol    Ports
------+-------------+-----------+----------------------------
1      Po1(SD)         LACP      Gi0/1(s) Gi0/2(s) Gi0/3(s) Gi0/4(s)

SW1# show running-config interface gi0/1 | include channel
 channel-group 1 mode passive
SW2# show running-config interface gi0/1 | include channel
 channel-group 1 mode passive`,
      question: 'Ano ang mali?',
      answer: 'Parehong Passive ang dalawang dulo. Pareho silang naghihintay na magsimula ang kabila, kaya walang LACP negotiation at walang bundle.',
      fix: 'Change at least one side to active: interface range gi0/1 - 4, channel-group 1 mode active. Then check show etherchannel summary shows P on every member.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Hindi ka sigurado kung Cisco o third-party ang kabilang switch. Anong protocol ang pipiliin mo at anong mode, at bakit hindi mo gagamitin ang mode on?',
      answer: 'LACP, dahil open standard ito at gagana sa kahit anong vendor. Mode active para ikaw ang magsimula ng negotiation. Iniiwasan ang on dahil walang negotiation: kung may mali sa kabilang dulo, magbu-bundle pa rin nang pilit at maaaring magdulot ng loop o blackhole nang hindi napapansin.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'LACP = active/passive, PAgP = desirable/auto, static = on.',
        'At least one side must initiate: active or desirable. passive–passive and auto–auto fail.',
        'LACP and PAgP never negotiate with each other; on pairs only with on.',
        'STP sees the Port-channel as one link, so no member is blocked.',
        'Members must match speed, duplex, trunk/access mode, native and allowed VLANs.',
        'show etherchannel summary: SU on the bundle and P on each member is healthy.',
      ],
    },
    {
      type: 'summary',
      points: [
        'EtherChannel bundles multiple links into one Port-channel so STP does not block them.',
        'LACP (open) uses active/passive; PAgP (Cisco) uses desirable/auto; on forces a bundle.',
        'One side must initiate, protocols must match, and member settings must be identical.',
        'Verify with show etherchannel summary; look for SU and P flags.',
        'Susunod: CDP at LLDP — paano nakikilala ng mga device ang kanilang mga kapitbahay.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'easy', type: 'single',
    prompt: 'What is the main benefit of EtherChannel?',
    choices: ['It encrypts traffic between switches', 'It combines several physical links into one logical link', 'It removes the need for VLANs', 'It replaces the routing table'], correct: [1],
    explanation: 'EtherChannel presents multiple physical links as one logical Port-channel for more bandwidth and redundancy.',
    wrong: { 0: 'EtherChannel does not encrypt.', 2: 'VLANs are unrelated and still used on the bundle.', 3: 'Routing is a Layer 3 function.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'easy', type: 'single',
    prompt: 'Which protocol is the open-standard way to negotiate an EtherChannel?',
    choices: ['PAgP', 'LACP', 'DTP', 'CDP'], correct: [1],
    explanation: 'LACP is IEEE 802.3ad / 802.1AX and works between vendors.',
    wrong: { 0: 'PAgP is Cisco-proprietary.', 2: 'DTP negotiates trunking, not bundles.', 3: 'CDP is a discovery protocol.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'medium', type: 'single',
    prompt: 'Which pair of LACP modes WILL form an EtherChannel?',
    choices: ['passive – passive', 'active – passive', 'auto – desirable', 'on – active'], correct: [1],
    explanation: 'Active initiates and passive responds, so the negotiation happens. Passive on both sides has no initiator.',
    wrong: { 0: 'Neither side initiates.', 2: 'Auto and desirable are PAgP modes, not LACP.', 3: 'on does not negotiate and will not pair with active.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'medium', type: 'single',
    prompt: 'Which pair of PAgP modes will NOT form an EtherChannel?',
    choices: ['desirable – desirable', 'desirable – auto', 'auto – auto', 'All of them will form'], correct: [2],
    explanation: 'Auto only responds, so two auto ports never start negotiation.',
    wrong: { 0: 'Both initiate; this works.', 1: 'Desirable initiates and auto responds; this works.', 3: 'auto – auto fails.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'medium', type: 'single',
    prompt: 'Which command displays the Port-channel and the state of each member port?',
    choices: ['show spanning-tree summary', 'show etherchannel summary', 'show vlan brief', 'show cdp neighbors'], correct: [1],
    explanation: 'show etherchannel summary lists each group, protocol and the member flags (P, s, D, I).',
    wrong: { 0: 'That summarises STP, not bundles.', 2: 'That lists VLANs.', 3: 'That lists neighbours.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'medium', type: 'single',
    prompt: 'What does the flag "SU" mean next to a Port-channel in show etherchannel summary?',
    choices: ['Suspended and unused', 'Layer 2 and in use', 'Standby and up', 'Stand-alone and unbundled'], correct: [1],
    explanation: 'S means Layer 2 bundle and U means it is in use — the healthy state.',
    wrong: { 0: 'Suspended is lower-case s on a member.', 2: 'Not a defined combination.', 3: 'Stand-alone is the I flag.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'hard', type: 'single',
    prompt: 'SW1 uses "channel-group 1 mode active" and SW2 uses "channel-group 1 mode desirable". What happens?',
    choices: ['An LACP bundle forms', 'A PAgP bundle forms', 'No bundle forms', 'A static bundle forms'], correct: [2],
    explanation: 'Active is LACP and desirable is PAgP; the two protocols do not interoperate.',
    wrong: { 0: 'SW2 is not speaking LACP.', 1: 'SW1 is not speaking PAgP.', 3: 'Only on–on forms a static bundle.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'medium', type: 'single',
    prompt: 'Why does STP not block members of an EtherChannel?',
    choices: ['STP is disabled on bundled ports', 'STP treats the Port-channel as a single logical link', 'Members use different VLANs', 'Bundles only work on routers'], correct: [1],
    explanation: 'STP runs on the logical Port-channel, so there is no redundant parallel path to block.',
    wrong: { 0: 'STP still runs, on the logical interface.', 2: 'VLANs are unrelated to this.', 3: 'Switches create EtherChannels.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO settings must match on every member port of a bundle?',
    choices: ['Speed', 'Port description', 'Duplex', 'Interface number'], correct: [0, 2],
    explanation: 'Speed and duplex (plus switchport mode and VLAN settings) must match or the port is suspended.',
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a single TCP flow can be spread across all four links of a four-link EtherChannel.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — load balancing is per flow by hash, so one flow uses one member link.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: paano tandaan ang EtherChannel modes?', back: 'LACP = Active/Passive (A-P). PAgP = Desirable/Auto (D-A). Kailangan ng kahit isang nag-uumpisa (Active o Desirable). On = On lang ang kapares. LACP at PAgP ay hindi nagkakasundo.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What is an EtherChannel?', back: 'Several physical links bundled into one logical Port-channel; STP sees one link, so none are blocked.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'protocol', front: 'LACP vs PAgP?', back: 'LACP: IEEE 802.3ad, open standard, active/passive. PAgP: Cisco-proprietary, desirable/auto.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Which mode pairs form a bundle?', back: 'active–active, active–passive (LACP); desirable–desirable, desirable–auto (PAgP); on–on (static). passive–passive and auto–auto never form.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'command', front: 'Command to add a port to an LACP bundle?', back: 'channel-group 1 mode active (on the physical interface or interface range).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'command', front: 'Command to verify EtherChannel?', back: 'show etherchannel summary — look for SU on the Port-channel and P on each member.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What must match on all member ports?', back: 'Speed, duplex, switchport mode, native VLAN and allowed VLANs. A mismatch suspends the port (flag s).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Build, break and fix an LACP EtherChannel',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Bundle two parallel links between two switches with LACP, verify the bundle, then break it with a mode mismatch and repair it.',
  topology: 'SW1 and SW2 joined by two cables: Gi0/1 and Gi0/2 on each switch.',
  steps: [
    'Cable SW1 and SW2 with two links. Run show spanning-tree and note that one link is blocking.',
    'On SW1: interface range gi0/1 - 2, channel-group 1 mode active. Do the same on SW2 with mode passive.',
    'On both switches: interface port-channel 1, switchport mode trunk.',
    'Run show etherchannel summary and confirm Po1(SU) with Gi0/1(P) and Gi0/2(P).',
    'Run show spanning-tree and confirm no link is blocking now.',
    'Break it: change SW1 from active to passive (SW2 is already passive). Watch the bundle fail.',
    'Repair it by returning one side to active.',
  ],
  checklist: [
    'Observed STP blocking one of two parallel links before bundling',
    'Bundle shows SU and both members (P)',
    'No STP-blocked link after bundling',
    'Reproduced and fixed a passive–passive failure',
  ],
  hints: [
    'Configure the physical ports first; the Port-channel interface appears automatically.',
    'If a member shows (s), compare speed, duplex and trunk settings with show running-config on both ends.',
  ],
  solution: [
    'channel-group 1 mode active on one side and passive on the other forms an LACP bundle.',
    'Trunk settings go on the Port-channel interface.',
    'passive–passive has no initiator; switching one side to active fixes it.',
  ],
  breakIt: 'Set Gi0/2 on SW2 to a different speed (speed 10) and watch it become suspended while Gi0/1 stays bundled. Restore speed auto to recover.',
};
