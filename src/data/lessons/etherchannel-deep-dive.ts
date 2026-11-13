import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'etherchannel-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.10',
  domain: 'D2',
  title: 'EtherChannel Deep Dive: LACP, PAgP, Load Balancing and Troubleshooting',
  description: 'Build and verify Layer 2 EtherChannels with LACP and PAgP, predict negotiation results, read show etherchannel summary and fix mismatches.',
  whyMatters:
    'Karaniwan sa exam ang tanong na “aling mode combination ang bubuo ng EtherChannel?” at “bakit hindi nagbu-bundle?”. May malinaw na talaan ng mode at malinaw na listahan ng kailangang magkatugma. Kapag kabisado mo ang dalawa, pag-iisip na lang ang natitira.',
  objectives: [
    'Explain why EtherChannel avoids STP blocking and adds bandwidth',
    'Predict the result of LACP, PAgP and static mode pairs',
    'Configure a Layer 2 EtherChannel with channel-group',
    'Read the flags in show etherchannel summary',
    'Fix common mismatches: speed, duplex, VLANs, trunk mode and protocol',
  ],
  estimatedMinutes: 40,
  difficulty: 'exam',
  keywords: ['EtherChannel', 'LACP', 'PAgP', 'channel-group', 'port-channel', 'active', 'passive', 'desirable', 'auto', 'show etherchannel summary', 'load balancing', 'link aggregation'],
  examObjectives: ['2.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'EtherChannel bundles several physical links between two switches into one logical link. STP sees one link, so no member is blocked, and the traffic is shared across the members.',
        'The bundle can be built statically (on) or negotiated with LACP (open standard) or PAgP (Cisco).',
      ],
      taglish: [
        'Pinagsasama ng **EtherChannel** ang **ilang pisikal na link** sa pagitan ng dalawang switch bilang **isang logical link**. Isa lang ang nakikita ng STP, kaya **walang member na naka-block** at **pinaghahati-hati** ang trapiko sa mga link.',
        'Pwedeng **static (`on`)** o **na-negotiate**: **LACP** (open standard, IEEE 802.3ad) o **PAgP** (Cisco).',
        'Dalawang bagay lang ang kailangan: **magkatugmang mode** at **magkaparehong setting ng lahat ng member port**.',
      ],
      technical: [
        'LACP modes: active (initiates negotiation) and passive (responds only). PAgP modes: desirable (initiates) and auto (responds only). Static mode on forms the channel unconditionally and only works with on on the other side. LACP and PAgP cannot negotiate with each other.',
        'Bundles form when at least one side is active or desirable (or both are on). passive/passive and auto/auto never form a channel. Member ports must have identical speed, duplex, VLAN/trunk configuration, native VLAN and allowed VLANs; otherwise the port is suspended (s flag) or not bundled.',
        'Traffic is distributed per flow with a hash of source or destination MAC, IP and/or ports (port-channel load-balance). A single flow uses a single member link, so one large transfer will not exceed one link’s bandwidth. A maximum of 8 active links (LACP can hold 16 with 8 standby).',
      ],
    },
    {
      type: 'analogy',
      title: 'Maraming lane, iisang kalsada',
      body: [
        'Think of several lanes joined into one wide road. Cars (flows) pick a lane by a rule (hash), so a single car still uses one lane. If a lane closes, traffic continues on the rest.',
      ],
      taglish: [
        'Parang **ilang lane na pinagsama bilang isang malapad na kalsada**. Ang bawat sasakyan (flow) ay pumipili ng lane sa pamamagitan ng **panuntunan (hash)**, kaya ang isang sasakyan ay iisang lane pa rin. Kapag nagsara ang isang lane, **tuloy ang trapiko** sa iba.',
      ],
    },
    {
      type: 'hook',
      title: 'AP at DA',
      trick: '**LACP = Active/Passive. PAgP = Desirable/Auto. ON = static. Isang panig ay dapat ACTIVE o DESIRABLE. Passive-passive at auto-auto = WALA.**',
      taglish: [
        '**LACP**: **A**ctive o **P**assive. **PAgP**: **D**esirable o **A**uto. **On** = static.',
        '**Dapat may nagsisimula**: active/active, active/passive, desirable/desirable, desirable/auto, on/on.',
        '**Walang channel**: passive/passive, auto/auto, on na may negotiated, LACP na may PAgP.',
        '**Magkapareho** ang speed, duplex, VLAN/trunk setting sa lahat ng member.',
      ],
      test: {
        question: 'Bubuo ba ng EtherChannel ang active/passive? auto/auto? desirable/auto?',
        answer: 'Active/passive = oo. Auto/auto = hindi. Desirable/auto = oo.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Aling mode ang bubuo',
      paragraphs: [
        'Isipin ang bawat protocol nang hiwalay. **LACP**: active nagsisimula, passive naghihintay. Kailangan ng hindi bababa sa isang active. **PAgP**: desirable nagsisimula, auto naghihintay. Kailangan ng hindi bababa sa isang desirable. **Static `on`**: walang negosasyon; pareho dapat na `on`.',
        'Hindi pwedeng pagsamahin ang protocol: ang active ng LACP ay hindi makakausap ng desirable ng PAgP. Hindi rin pwedeng ang `on` ay makipagkasundo sa LACP/PAgP.',
        'Rekomendasyon: gamitin ang **LACP active/active** (open standard, interoperable at ligtas) — o active/passive kung gusto mong may isa lang na nagsisimula.',
      ],
      steps: [
        'Pumili ng protocol (LACP para sa multi-vendor).',
        'Tiyaking may nagsisimula sa isang panig (active/desirable).',
        'Ihanay ang speed, duplex at VLAN/trunk configuration ng mga member.',
        'channel-group <n> mode <mode> sa bawat member interface.',
        'show etherchannel summary para i-verify.',
      ],
      tricks: [
        'Kabisaduhin ang talaan: A-A ✔, A-P ✔, P-P ✘; D-D ✔, D-A ✔, A-A(auto) ✘; ON-ON ✔.',
        'Gamitin ang `interface range` para ilapat ang parehong config sa lahat ng member.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Configuration, flags at load balancing',
      paragraphs: [
        'Config: `interface range g0/1 - 2`, `channel-group 1 mode active`. Awtomatikong gagawa ng `interface Port-channel1`; ilagay ang trunk/access config sa **port-channel**, hindi sa mga member. Pagkatapos: `show etherchannel summary`.',
        'Mga flag: **SU** = Layer 2, in use (maganda), **P** = bundled sa port-channel, **s** = suspended (mismatch), **D** = down, **I** = stand-alone, **H** = hot-standby (LACP). Karaniwang nakikita: `Po1(SU)  LACP  Gi0/1(P) Gi0/2(P)`.',
        'Load balancing: `port-channel load-balance src-dst-ip` (karaniwan). Per-flow ang paghahati, kaya iisang link ang gagamitin ng isang session; para sa mas pantay na paghahati, gumamit ng hash na may mas maraming variable (hal. src-dst-ip). Tingnan gamit ang `show etherchannel load-balance`.',
      ],
      steps: [
        'interface range ... → channel-group <n> mode active.',
        'interface port-channel <n> → switchport mode trunk (at allowed VLANs).',
        'show etherchannel summary → hanapin ang SU at P.',
        'show interfaces port-channel <n> → bandwidth ay kabuuan ng mga member.',
      ],
      tricks: [
        'Ang pagbabago sa port-channel interface ay kumakalat sa mga member; ang pagbabago sa isang member lang ay nagdudulot ng mismatch.',
        'Ang “s” ay madalas senyales ng hindi pantay na VLAN/trunk/speed/duplex setting.',
      ],
    },
    {
      type: 'remember',
      title: 'EtherChannel na lumalabas sa exam',
      items: [
        '**LACP: active/passive (IEEE 802.3ad). PAgP: desirable/auto (Cisco). on = static.**',
        '**Passive-passive at auto-auto = hindi bubuo. LACP at PAgP ay hindi nagkakasundo.**',
        '**Kailangang magkapareho: speed, duplex, VLAN/trunk mode, native VLAN, allowed VLANs.**',
        '**show etherchannel summary: SU = Layer 2 in use; P = bundled; s = suspended; D = down.**',
        '**Max 8 active links; per-flow load balancing; isang flow = isang link.**',
      ],
    },
    { type: 'diagram', id: 'etherchannel-bundle', caption: 'Ilang pisikal na link bilang iisang logical port-channel.' },
    {
      type: 'terms',
      items: [
        { term: 'Port-channel', definition: 'The logical interface that represents the bundled links.' },
        { term: 'LACP', definition: 'Link Aggregation Control Protocol (IEEE 802.3ad), open standard negotiation.' },
        { term: 'PAgP', definition: 'Port Aggregation Protocol, Cisco proprietary negotiation.' },
        { term: 'channel-group', definition: 'Interface command that assigns a port to a port-channel and sets its mode.' },
        { term: 'Hash', definition: 'The calculation that chooses which member link carries a flow.' },
        { term: 'Suspended (s)', definition: 'A port that is excluded from the bundle because of a mismatch.' },
        { term: 'Active / passive', definition: 'LACP initiating and responding modes.' },
      ],
    },
    {
      type: 'flow',
      title: 'Paano nabubuo ang channel',
      steps: [
        'Naka-configure ang mga member port na may parehong speed, duplex at VLAN/trunk settings.',
        'channel-group <n> mode <mode> sa bawat member.',
        'Nagpapalitan ang switch ng LACP/PAgP frames (maliban kung on).',
        'Kapag magkatugma ang mga mode at settings, nabubuo ang port-channel.',
        'Ang STP ay nakakakita ng iisang logical link at hinahati ang trapiko ayon sa hash.',
      ],
    },
    {
      type: 'cli',
      title: 'LACP trunk EtherChannel',
      transcript: `SW1(config)# interface range gigabitEthernet 0/1 - 2
SW1(config-if-range)# channel-group 1 mode active
SW1(config)# interface port-channel 1
SW1(config-if)# switchport mode trunk
SW1(config)# port-channel load-balance src-dst-ip
SW1# show etherchannel summary
Group  Port-channel  Protocol    Ports
1      Po1(SU)       LACP        Gi0/1(P)  Gi0/2(P)`,
      copyable: 'interface range gigabitEthernet 0/1 - 2\nchannel-group 1 mode active\ninterface port-channel 1\nswitchport mode trunk\nport-channel load-balance src-dst-ip\nshow etherchannel summary',
      explain: [
        { line: 'channel-group 1 mode active', why: 'Adds both ports to port-channel 1 and starts LACP negotiation.' },
        { line: 'interface port-channel 1 → switchport mode trunk', why: 'Trunk settings are applied once on the logical interface and inherited by the members.' },
        { line: 'Po1(SU)', why: 'S = Layer 2 and U = in use: the bundle is working.' },
        { line: 'Gi0/1(P)', why: 'P = the port is bundled in the port-channel.' },
      ],
      note: 'Use show etherchannel port-channel and show interfaces trunk for more detail.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **passive/passive** (LACP) at **auto/auto** (PAgP) ay **hindi bubuo** ng channel dahil walang nagsisimula.' },
    { type: 'callout', kind: 'trap', text: 'Ang **LACP at PAgP ay hindi makakapagkasundo**. Kapag magkaiba ang protocol sa dalawang dulo, wala ang channel.' },
    { type: 'callout', kind: 'tip', text: 'Kapag may “s” sa summary, hanapin ang pagkakaiba ng member config gamit ang `show running-config interface …` sa bawat port at ihambing.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Using passive/passive or auto/auto.',
        'Mixing LACP on one side with PAgP on the other.',
        'Different speed, duplex or VLAN settings on member ports.',
        'Configuring trunk settings on one member instead of the port-channel.',
        'Expecting one flow to use the bandwidth of all links.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Suspended ang isang port',
      scenario: 'Two switches should have a 2-link EtherChannel, but only one member is bundled and the other is suspended.',
      evidence: `SW1# show etherchannel summary
Group  Port-channel  Protocol    Ports
1      Po1(SU)       LACP        Gi0/1(P)  Gi0/2(s)
SW1# show running-config interface gi0/2
 switchport mode access`,
      question: 'Ano ang mali?',
      answer: 'Gi0/2 has switchport mode access while the port-channel and Gi0/1 are trunks. A member with a different mode is suspended (s).',
      fix: 'Make the member match the port-channel: remove the individual configuration or set the same trunk configuration on Gi0/2, then confirm that show etherchannel summary shows (P) for both ports.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Aling mga pares ang bubuo ng channel? (a) LACP active–passive, (b) PAgP auto–auto, (c) PAgP desirable–auto, (d) LACP passive–passive, (e) on–active.',
      answer: '(a) Yes. (b) No. (c) Yes. (d) No. (e) No: static on does not negotiate with LACP.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'One side must be active or desirable (or both on).',
        'LACP and PAgP cannot interoperate.',
        'Members must match in speed, duplex and VLAN config.',
        'Read the flags SU, P, s and D.',
        'Load balancing is per flow.',
      ],
    },
    {
      type: 'summary',
      points: [
        'EtherChannel bundles links into one logical link.',
        'LACP active/passive, PAgP desirable/auto, on = static.',
        'Settings must match on all members.',
        'show etherchannel summary reveals the state.',
        'Per-flow load balancing.',
        'Susunod: HSRP deep dive.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'easy', type: 'single',
    prompt: 'Which pair of modes forms an EtherChannel?',
    choices: ['LACP passive and passive', 'PAgP auto and auto', 'LACP active and passive', 'LACP active and PAgP desirable'], correct: [2],
    explanation: 'One side must initiate: active initiates and passive responds.',
    wrong: { 0: 'Neither side initiates.', 1: 'Neither side initiates.', 3: 'LACP and PAgP cannot negotiate with each other.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'medium', type: 'single',
    prompt: 'Which is the open-standard EtherChannel negotiation protocol?',
    choices: ['PAgP', 'LACP', 'DTP', 'CDP'], correct: [1],
    explanation: 'LACP is the IEEE 802.3ad standard; PAgP is Cisco proprietary.',
    wrong: { 0: 'PAgP is Cisco proprietary.', 2: 'DTP negotiates trunking.', 3: 'CDP discovers neighbours.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'medium', type: 'single',
    prompt: 'In show etherchannel summary, what does the flag “s” next to a port mean?',
    choices: ['The port is bundled', 'The port is suspended', 'The port is Layer 2', 'The port is standby'], correct: [1],
    explanation: 'The lowercase s means the port is suspended, commonly due to a configuration mismatch.',
    wrong: { 0: 'Bundled is P.', 2: 'Layer 2 is the capital S on the port-channel.', 3: 'Hot standby is H.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'hard', type: 'single',
    prompt: 'A single large file transfer between two hosts over a 4 × 1 Gb/s EtherChannel can reach at most which throughput?',
    choices: ['4 Gb/s', '1 Gb/s', '2 Gb/s', '8 Gb/s'], correct: [1],
    explanation: 'Load balancing is per flow, so a single flow uses one member link (1 Gb/s).',
    wrong: { 0: 'Only many flows together can use the whole bundle.', 2: 'Per-flow hashing assigns one link.', 3: 'The bundle total is 4 Gb/s.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: all member ports of an EtherChannel must have matching speed and duplex settings.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'Mismatched members are suspended or excluded.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO benefits does EtherChannel provide?',
    choices: ['More bandwidth between switches', 'Redundancy without STP blocking a member', 'Faster CPU', 'Encryption of frames'], correct: [0, 1],
    explanation: 'EtherChannel adds aggregate bandwidth and treats the bundle as one link so STP does not block a member.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: mga mode ng EtherChannel?', back: 'LACP = Active/Passive. PAgP = Desirable/Auto. ON = static. Isang panig ay dapat ACTIVE o DESIRABLE. Passive-passive at auto-auto = WALA.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Which modes never form a channel?', back: 'Passive/passive, auto/auto, and mixing LACP with PAgP.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'command', front: 'Command that adds a port to a bundle?', back: 'channel-group <n> mode <active|passive|desirable|auto|on>.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What must match on members?', back: 'Speed, duplex, VLAN/trunk mode, native VLAN and allowed VLANs.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What do SU, P and s mean?', back: 'SU = Layer 2 in use; P = bundled; s = suspended.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'concept', front: 'How is traffic shared?', back: 'Per flow by a hash; one flow uses one link.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'command', front: 'Which command verifies EtherChannel?', back: 'show etherchannel summary.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Build, test and break an EtherChannel',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Create LACP and PAgP EtherChannels, test mode combinations and fix a mismatched member.',
  steps: [
    'Connect two switches with two links. Check that STP blocks one of them.',
    'Configure channel-group 1 mode active on both switches and confirm Po1(SU) with (P) members; note that STP now sees one link.',
    'Change one side to passive and verify; then both to passive and observe that the channel fails.',
    'Reconfigure with PAgP desirable/auto and verify; then mix LACP with PAgP and observe the result.',
    'Make one member mode access and note the s flag in show etherchannel summary; fix it.',
    'Apply the trunk configuration on the port-channel and verify with show interfaces trunk.',
  ],
  checklist: [
    'STP blocking removed by the bundle',
    'Mode combinations tested',
    'Suspended port diagnosed and fixed',
    'Trunk over the port-channel verified',
  ],
  hints: [
    'Shut down and re-enable ports after changing the mode.',
    'Compare show running-config interface for each member.',
  ],
  solution: [
    'Active/active or active/passive forms a bundle; passive/passive does not.',
    'The s flag indicates that a member does not match the port-channel.',
    'Configure trunking on interface port-channel 1.',
  ],
  breakIt: 'Set different speeds on the two members and describe the show etherchannel summary output.',
};
