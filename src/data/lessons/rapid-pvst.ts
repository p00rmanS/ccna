import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'rapid-pvst';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.8',
  domain: 'D2',
  title: 'Rapid PVST+: Faster Convergence',
  description: 'Why classic 802.1D is slow, what RSTP changes, the new port roles and states, and how Rapid PVST+ reaches forwarding in seconds instead of tens of seconds.',
  whyMatters:
    'Ang Rapid PVST+ ang default STP mode sa modernong Cisco switches, at direktang tinatanong ito sa exam (objective 2.5). Kailangan mong malaman kung ano ang bago sa RSTP kumpara sa 802.1D na dati mong natutunan — parehong election rules, pero ibang bilis at ibang pangalan ng mga port at state.',
  objectives: [
    'Explain why classic 802.1D takes up to about 50 seconds to converge',
    'Describe the RSTP port states: discarding, learning, forwarding',
    'Describe the RSTP port roles, including the new alternate and backup roles',
    'Explain edge ports and point-to-point vs shared link types',
    'Describe the proposal/agreement handshake that makes RSTP fast',
    'Configure and verify spanning-tree mode rapid-pvst',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['RSTP', 'Rapid PVST+', '802.1w', 'edge port', 'point-to-point', 'alternate port', 'backup port', 'proposal', 'agreement', 'discarding', 'spanning-tree mode rapid-pvst'],
  examObjectives: ['2.5'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Classic 802.1D elects the same root bridge and the same port roles you already learned, but a port must sit in listening and learning for 15 seconds each before it forwards — even when there is obviously no loop. Rapid PVST+ (RSTP, IEEE 802.1w) keeps the same election, but a port on a point-to-point link can negotiate straight to forwarding with a quick handshake instead of waiting on timers.',
        'RSTP also gives every switch a backup plan: an alternate port (a backup way to the root) and a backup port (a backup way onto a segment this switch already reaches). When the primary port fails, the switch does not wait — it already knows which port takes over.',
      ],
      taglish: [
        'Ang **election ay pareho pa rin** — GOLF (pinakamababang priority, tapos MAC) at ang 1-1-1 na dati mong natutunan sa STP Fundamentals. **Ang binago ng RSTP ay ang bilis at ang mga karagdagang backup role.**',
        'Sa 802.1D, kahit sigurado na ang isang port na walang kalaban, **hihintayin pa rin niya ang 15 segundong listening at 15 segundong learning.** Sayang na oras. Sa RSTP, kung ang link ay **point-to-point** (dalawang switch lang, full-duplex), maaari nilang **pag-usapan agad** kung sino ang mananalo — parang dalawang taong nagkukumustahan agad sa pintuan sa halip na maghintay ng ilang minuto bago mag-usap.',
        'Bago ang RSTP, kapag nasira ang root port, **naghihintay ang switch** (hanggang max age) bago tumingin ng ibang landas. Ngayon, **alam na agad niya ang backup**: ang **alternate port** ay ibang daan papunta sa root, at ang **backup port** ay ibang daan papasok sa parehong segment na kaya na niyang abutin. Kapag nasira ang pangunahing port, **agad lumilipat, walang paghihintay sa mga timer.**',
        'Kaya default na ngayon ang Rapid PVST+ sa mga Cisco switch: `spanning-tree mode rapid-pvst`. Halos hindi mo na makikita ang purong 802.1D sa totoong network.',
      ],
      technical: [
        'RSTP (802.1w) is standardised inside Rapid PVST+ on Cisco switches — one instance per VLAN, same as PVST+. Root election and port-role selection use the identical bridge ID and cost rules as 802.1D; only the state machine and role set change.',
        'Port states collapse from five to three: discarding (covers disabled, blocking and listening — no forwarding, no learning), learning (learns MAC addresses, does not forward), forwarding. There is no separate "blocking" or "listening" state to wait through.',
        'Port roles: root and designated are unchanged. Two roles are added: alternate (a discarding port offering another path to the root — the RSTP equivalent of an 802.1D blocked port with a live backup) and backup (a discarding port offering a redundant path onto a segment the switch already has a designated port on, typically seen on hubs or shared media).',
        'Link type matters: a full-duplex link between two switches is treated as point-to-point and is eligible for the rapid proposal/agreement handshake. A half-duplex/shared link is treated as shared and falls back to timer-based transition. Link type can be forced with spanning-tree link-type point-to-point|shared.',
        'Edge ports (the RSTP name for PortFast-enabled ports facing a single host) go straight to forwarding, because a host cannot form a loop. If an edge port receives a BPDU, RSTP immediately treats it as a normal (non-edge) port and re-runs the state machine.',
        'The proposal/agreement handshake: a switch coming up on a point-to-point link with a better path proposes becoming designated; the neighbour, if it agrees, briefly puts its own non-edge ports into discarding (sync) and sends an agreement, and both ports move to forwarding within about 1–2 seconds — far faster than waiting for max age and forward delay. Configure with spanning-tree mode rapid-pvst; verify with show spanning-tree, which now shows the port role, state and type (P2p, P2p Edge, Shared).',
      ],
    },
    {
      type: 'analogy',
      title: 'Parehong laro ng golf, mas mabilis na signal',
      body: [
        'The election in RSTP is the same golf game (lowest score wins) you already know from classic STP. What changed is how quickly the players tell each other the result. In 802.1D, two players confirm the result by waiting through fixed timers before either one moves. In RSTP, two players standing face to face (a point-to-point link) can just say "you win" out loud and both move immediately.',
      ],
      taglish: [
        'Ang **laro ng golf ay pareho pa rin** (pinakamababang score ang panalo). Ang nagbago ay **kung gaano kabilis inaanunsyo ang resulta**. Sa 802.1D, parang **maghihintay muna ng bell** bago kumilos ang lahat — kahit alam na nila ang sagot. Sa RSTP, kung magkaharap ang dalawang switch sa isang direktang link, **pwede na silang mag-usap agad** ("ikaw na, designated ka") at agad silang kikilos — walang bell na hihintayin.',
      ],
    },
    {
      type: 'hook',
      title: 'D-L-F at ang bagong dalawa: Alternate, Backup',
      trick: '**D-L-F** (Discarding → Learning → Forwarding) sa halip na Bawal-Lingon-Lista-Lakad. Parehong roles: Root, Designated. Bagong dalawa: **Alternate** (backup papunta sa root) at **Backup** (backup papasok sa parehong segment).',
      taglish: [
        'Mga **state**, tatlo na lang: **D-L-F** = **D**iscarding (kasama na dito ang dating blocking at listening), **L**earning, **F**orwarding.',
        'Mga **role**: Root at Designated — **pareho pa rin**. Dalawang bago: **Alternate** (may alam nang ibang daan papunta sa root, kaya agad lilipat kapag namatay ang root port), at **Backup** (may alam nang ibang daan papasok sa parehong segment — bihira, karaniwan sa hub).',
        'Point-to-point + edge = **bilis**. Kung full-duplex at dalawang switch lang ang magkaharap, **point-to-point** — pwedeng mag-negotiate agad (proposal/agreement). Kung nakatapat sa isang PC lang, **edge port** — diretso sa Forwarding.',
      ],
      test: {
        question: 'Ano ang tatlong RSTP port state, at ano ang dalawang bagong port role na wala sa 802.1D?',
        answer: 'States: Discarding, Learning, Forwarding (D-L-F). Bagong roles: Alternate port (backup papunta sa root) at Backup port (backup papasok sa parehong segment).',
      },
    },
    { type: 'diagram', id: 'rstp-convergence', caption: 'Ihambing ang oras ng 802.1D (hanggang ~50 segundo) kontra Rapid PVST+ (1–2 segundo sa isang point-to-point link).' },
    {
      type: 'terms',
      items: [
        { term: 'RSTP (802.1w)', definition: 'Rapid Spanning Tree Protocol, standardised as Rapid PVST+ on Cisco switches (one instance per VLAN).' },
        { term: 'Discarding', definition: 'RSTP state that replaces 802.1D disabled, blocking and listening — no forwarding, no MAC learning.' },
        { term: 'Alternate port', definition: 'A discarding port that offers another path to the root; takes over immediately if the root port fails.' },
        { term: 'Backup port', definition: 'A discarding port offering a redundant path onto a segment this switch already reaches via a designated port.' },
        { term: 'Edge port', definition: 'RSTP name for a PortFast-enabled port facing a single host. Goes straight to forwarding.' },
        { term: 'Point-to-point link', definition: 'A full-duplex link between two switches, eligible for the fast proposal/agreement handshake.' },
        { term: 'Shared link', definition: 'A half-duplex or hub-connected link; falls back to timer-based transitions.' },
        { term: 'Proposal/agreement', definition: 'The handshake on a point-to-point link that lets two switches agree on port roles in about 1–2 seconds.' },
      ],
    },
    {
      type: 'flow',
      title: 'Bakit mabilis: isang bagong link sa pagitan ng dalawang switch',
      steps: [
        'Dalawang switch, parehong may Rapid PVST+, ay nagkonekta gamit ang full-duplex Gigabit link — **point-to-point** ito.',
        'Ang switch na mas malapit sa root ay nagpapadala ng **proposal**: "Ako ang designated dito."',
        'Kung tatanggapin ito ng kabilang switch, isasagawa muna niya ang **sync**: ilalagay muna niya sa discarding ang sarili niyang non-edge, non-root ports (para siguradong walang temporary loop), tapos ipapadala ang **agreement**.',
        'Sa sandaling matanggap ang agreement, **parehong port ay diretso sa Forwarding** — walang paghihintay sa max age o forward delay.',
        'Kung ang link ay papunta lang sa isang PC (edge port), walang kailangang proposal/agreement — diretso na sa Forwarding dahil walang panganib na loop.',
      ],
    },
    {
      type: 'cli',
      title: 'I-set at i-verify ang Rapid PVST+',
      transcript: `SW1(config)# spanning-tree mode rapid-pvst
SW1(config)# interface gi0/3
SW1(config-if)# spanning-tree portfast
SW1(config-if)# end
SW1# show spanning-tree vlan 1

VLAN0001
  Spanning tree enabled protocol rstp
  Root ID    Priority    24576
             Address     00aa.aaaa.0001
             This bridge is the root

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi0/1               Desg FWD 4         128.1    P2p
Gi0/2               Desg FWD 4         128.2    P2p
Gi0/3               Desg FWD 4         128.3    P2p Edge`,
      copyable: 'spanning-tree mode rapid-pvst',
      explain: [
        { line: 'spanning-tree mode rapid-pvst', why: 'Switches from classic 802.1D PVST+ to Rapid PVST+. This is the default on current Cisco IOS, but exam questions may show it being set explicitly.' },
        { line: 'spanning-tree portfast', why: 'Marks Gi0/3 as an edge port for RSTP — it will jump straight to forwarding, and only makes sense on a port facing a single host.' },
        { line: 'protocol rstp', why: 'Confirms the switch is running Rapid PVST+, not classic 802.1D.' },
        { line: 'Gi0/1 Desg FWD … Type P2p', why: 'A designated, forwarding port on a point-to-point (switch-to-switch) link — eligible for the fast handshake.' },
        { line: 'Gi0/3 Desg FWD … Type P2p Edge', why: 'The edge port: point-to-point and facing a host, so it went straight to forwarding.' },
      ],
      note: 'Sample output for study. On most current switches Rapid PVST+ is already the default mode.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **election rules ay hindi nagbabago sa RSTP** — GOLF at 1-1-1 pa rin. Ang mga tanong sa exam tungkol sa **sino ang root o aling cost ang mananalo** ay sinasagot mo pa rin gamit ang parehong paraan sa STP Fundamentals.' },
    { type: 'callout', kind: 'trap', text: 'Huwag ipagpalagay na **edge port** ay kasing-ligtas kahit kailan. Kung may BPDU na dumating sa isang edge port (halimbawa, may switch na nakonekta doon), **agad itong ituturing na normal (non-edge) port** at uulitin ang proseso — kaya pa rin kailangan ng BPDU Guard sa mga host port (susunod na lesson).' },
    { type: 'callout', kind: 'tip', text: 'Kapag nakita mo sa `show spanning-tree` ang **Type P2p Edge**, alam mong ito ay **PortFast port sa isang full-duplex link** — pinaka-mabilis na kumbinasyon.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Isipin na iba ang root election sa RSTP — pareho pa rin ito sa 802.1D.',
        'Malito sa pagitan ng Alternate (backup papunta sa root) at Backup (backup papasok sa parehong segment).',
        'Isipin na ang isang edge port ay hindi na kailanman mag-i-Discarding — pwede, kung may BPDU na darating dito.',
        'Kalimutan na kailangan point-to-point (full-duplex) ang link para gumana ang mabilis na proposal/agreement.',
        'Isipin na kailangan pang i-configure ang RSTP nang manu-mano sa bawat VLAN — isang command lang (spanning-tree mode rapid-pvst) para sa buong switch.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Bakit halos isang minuto bago nag-forward ulit?"',
      scenario: 'After a link failure and recovery, a switch took nearly 50 seconds to start forwarding on the backup path again, even though the team believed the network was running Rapid PVST+.',
      evidence: `SW2# show spanning-tree vlan 1
  Spanning tree enabled protocol ieee
Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi0/2               Root FWD 4         128.2    P2p`,
      question: 'Ano ang malaking clue sa output na nagsasabing hindi talaga Rapid PVST+ ang ginagamit?',
      answer: 'Sinasabi ng "Spanning tree enabled protocol ieee" na tumatakbo pa rin ang switch sa classic 802.1D, hindi RSTP (na dapat "protocol rstp"). Kaya kahit point-to-point ang link, walang proposal/agreement na mangyayari.',
      fix: 'Set spanning-tree mode rapid-pvst on every switch in the domain — mixed modes still interoperate, but only fully-RSTP switches get the fast handshake. Verify with show spanning-tree and check for "protocol rstp".',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isang bagong access switch ay direktang kumonekta sa isang distribution switch gamit ang isang Gigabit full-duplex link, parehong may Rapid PVST+. Ilang segundo (humigit-kumulang) ang aabutin bago mag-forward ang link, at bakit?',
      answer: 'Mga 1–2 segundo lang. Full-duplex switch-to-switch link ay point-to-point, kaya kaya nilang gawin ang proposal/agreement handshake sa halip na maghintay sa mga 802.1D timer.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'RSTP uses the same root election and cost rules as 802.1D — only speed and roles change.',
        'Three states: Discarding, Learning, Forwarding.',
        'New roles: Alternate (backup to the root), Backup (backup onto the same segment).',
        'Point-to-point (full-duplex) links enable the fast proposal/agreement handshake; shared/half-duplex links do not.',
        'Edge port = PortFast port; goes straight to forwarding but reverts instantly if a BPDU arrives.',
        'Command: spanning-tree mode rapid-pvst. Verify with show spanning-tree — look for "protocol rstp" and port Type (P2p, P2p Edge, Shared).',
      ],
    },
    {
      type: 'summary',
      points: [
        'Rapid PVST+ (RSTP, 802.1w) keeps the same root election as 802.1D but converges far faster.',
        'Three port states: Discarding, Learning, Forwarding.',
        'Two new port roles: Alternate (backup to root) and Backup (backup onto the same segment).',
        'Point-to-point links use a proposal/agreement handshake; edge ports (PortFast) go straight to forwarding.',
        'Configure with spanning-tree mode rapid-pvst; verify with show spanning-tree.',
        'Susunod: STP protection — PortFast, BPDU Guard, Root Guard and Loop Guard, para hindi maabuso ang mabilis na convergence na ito.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'Which standard does Rapid PVST+ implement?',
    choices: ['802.1D', '802.1Q', '802.1w', '802.3af'], correct: [2],
    explanation: 'Rapid PVST+ implements IEEE 802.1w (RSTP), one instance per VLAN.',
    wrong: { 0: '802.1D is classic STP.', 1: '802.1Q is trunking/tagging.', 3: '802.3af is Power over Ethernet.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'How many port states does RSTP use?',
    choices: ['Two', 'Three', 'Four', 'Five'], correct: [1],
    explanation: 'RSTP has three states: discarding, learning, forwarding.',
    wrong: { 0: 'Too few.', 2: 'That was closer to a partial count of 802.1D.', 3: '802.1D has five states, not RSTP.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'Which RSTP port role offers a backup path to the root bridge?',
    choices: ['Designated', 'Backup', 'Alternate', 'Edge'], correct: [2],
    explanation: 'The alternate port offers another path to the root and takes over if the root port fails.',
    wrong: { 0: 'Designated forwards on a segment.', 1: 'Backup offers a redundant path onto the same segment, not to the root.', 3: 'Edge is not a port role, it is a port type for PortFast.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'Which RSTP port role offers a redundant path onto a segment the switch already reaches through a designated port?',
    choices: ['Root', 'Alternate', 'Backup', 'Forwarding'], correct: [2],
    explanation: 'The backup port role covers redundancy onto the same segment, typically seen with shared media like a hub.',
    wrong: { 0: 'Root is the best path to the root bridge.', 1: 'Alternate is a backup to the root, not to the same segment.', 3: 'Forwarding is a state, not a role.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'What kind of link is eligible for the RSTP proposal/agreement handshake?',
    choices: ['Half-duplex shared link', 'Point-to-point full-duplex link', 'Any link, regardless of duplex', 'Only links carrying VLAN 1'], correct: [1],
    explanation: 'A full-duplex link between two switches is treated as point-to-point and can use the fast handshake.',
    wrong: { 0: 'Shared/half-duplex links fall back to timers.', 2: 'Duplex and topology matter.', 3: 'VLAN membership is unrelated.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'What is the RSTP name for a PortFast-enabled port facing a single host?',
    choices: ['Root port', 'Edge port', 'Backup port', 'Trunk port'], correct: [1],
    explanation: 'RSTP calls a PortFast port an edge port; it moves straight to forwarding.',
    wrong: { 0: 'A root port is chosen by cost toward the root, unrelated to PortFast.', 2: 'A backup port is a different redundancy role.', 3: 'Trunk is a switchport mode, not an RSTP port type.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'What happens if an edge port receives a BPDU?',
    choices: ['Nothing, edge ports ignore BPDUs', 'It is immediately treated as a normal (non-edge) port', 'The switch reboots', 'The VLAN is deleted'], correct: [1],
    explanation: 'RSTP immediately reclassifies the port as non-edge and runs the normal state machine on it.',
    wrong: { 0: 'It reacts, it does not ignore it.', 2: 'No reboot occurs.', 3: 'Unrelated to VLAN configuration.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'hard', type: 'single',
    prompt: 'How does Rapid PVST+ choose the root bridge compared with classic 802.1D?',
    choices: ['A completely different algorithm based on port speed only', 'The identical bridge ID comparison: lowest priority, then lowest MAC', 'The switch with the most VLANs configured wins', 'Root election is disabled in RSTP'], correct: [1],
    explanation: 'RSTP keeps the same bridge ID election as 802.1D; only convergence speed and roles change.',
    wrong: { 0: 'Election criteria are unchanged.', 2: 'VLAN count plays no role.', 3: 'Root election still happens.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'Which command sets a switch to use Rapid PVST+?',
    choices: ['spanning-tree mode rapid-pvst', 'spanning-tree rstp enable', 'spanning-tree version rapid', 'switchport mode rapid-pvst'], correct: [0],
    explanation: 'spanning-tree mode rapid-pvst switches the whole device from 802.1D PVST+ to Rapid PVST+.',
    wrong: { 1: 'Not a valid IOS command.', 2: 'Not a valid IOS command.', 3: 'switchport mode configures access/trunk, not STP mode.' },
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'hard', type: 'single',
    prompt: 'In show spanning-tree output, a port shows Type "Shared". What does that mean for convergence?',
    choices: ['It still uses the fast proposal/agreement handshake', 'It falls back to timer-based transitions, like classic 802.1D', 'It is automatically an edge port', 'It cannot forward traffic'], correct: [1],
    explanation: 'A shared (typically half-duplex) link is not eligible for the rapid handshake and relies on timers to transition.',
    wrong: { 0: 'Only point-to-point links get the fast handshake.', 2: 'Edge status depends on PortFast configuration, not link type alone.', 3: 'It can still forward, just more slowly after a topology change.' },
  },
  {
    id: `${ID}-q11`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO port roles are new in RSTP and did not exist in classic 802.1D?',
    choices: ['Root', 'Designated', 'Alternate', 'Backup'], correct: [2, 3],
    explanation: 'Alternate and backup are new RSTP roles; root and designated already existed in 802.1D.',
  },
  {
    id: `${ID}-q12`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: Rapid PVST+ runs one spanning-tree instance per VLAN, the same as classic PVST+.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'Both PVST+ and Rapid PVST+ run one instance per VLAN on Cisco switches; only the underlying protocol (802.1D vs 802.1w) differs.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: paano tandaan ang Rapid PVST+?', back: 'D-L-F: Discarding → Learning → Forwarding. Parehong election rules (GOLF) sa 802.1D. Bagong roles: Alternate (backup papunta sa root), Backup (backup papasok sa parehong segment). Point-to-point + edge = bilis.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What standard is Rapid PVST+ based on?', back: 'IEEE 802.1w (RSTP), one instance per VLAN, same as classic PVST+.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'concept', front: 'RSTP port states?', back: 'Discarding, Learning, Forwarding (three, down from five in 802.1D).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What is an alternate port?', back: 'A discarding port offering another path to the root bridge; takes over immediately if the root port fails.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What is a backup port?', back: 'A discarding port offering a redundant path onto a segment the switch already reaches via a designated port.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What is an edge port?', back: 'RSTP name for a PortFast port facing a single host; goes straight to forwarding, reverts instantly if a BPDU arrives.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Which link type gets the fast proposal/agreement handshake?', back: 'Point-to-point, full-duplex switch-to-switch links. Shared/half-duplex links fall back to timers.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D2', category: 'command', front: 'Command to enable Rapid PVST+?', back: 'spanning-tree mode rapid-pvst' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Does RSTP change root election?', back: 'No — same bridge ID comparison as 802.1D (lowest priority, then lowest MAC). Only speed and port roles change.' },
  { id: `${ID}-f9`, lessonId: ID, domain: 'D2', category: 'command', front: 'How to confirm Rapid PVST+ is active?', back: 'show spanning-tree — look for "protocol rstp" and port Type (P2p, P2p Edge, Shared).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Switch to Rapid PVST+ and watch the difference',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Compare classic 802.1D and Rapid PVST+ convergence on the same topology, and identify edge and point-to-point port types.',
  topology: 'Two switches (SW1, SW2) connected by one Gigabit link, each with a PC on an access port.',
  steps: [
    'Build the topology with default settings (classic PVST+ mode) and run show spanning-tree vlan 1 on both switches. Note "protocol ieee".',
    'Time roughly how long it takes for the switch-to-switch link to reach Forwarding after both switches boot.',
    'Enable Rapid PVST+ on both switches: spanning-tree mode rapid-pvst.',
    'Run show spanning-tree vlan 1 again. Confirm "protocol rstp" and check the Type column for the switch-to-switch port.',
    'Enable spanning-tree portfast on the ports facing the PCs and check that their Type shows "P2p Edge".',
    'Shut down and re-enable the switch-to-switch link. Compare how quickly it returns to Forwarding versus your earlier observation in classic mode.',
  ],
  checklist: [
    'Confirmed classic 802.1D mode with "protocol ieee" before the change',
    'Switched both switches to spanning-tree mode rapid-pvst',
    'Verified "protocol rstp" and read the port Type column',
    'Enabled PortFast on host-facing ports and saw "P2p Edge"',
    'Observed faster recovery after a link flap under Rapid PVST+',
  ],
  hints: [
    'Both switches must run Rapid PVST+ for the fast handshake to apply to the link between them; a mismatch still interoperates but falls back to the slower switch\'s behaviour on that link.',
    'PortFast only belongs on ports facing a single host — never on a switch-to-switch link.',
  ],
  solution: [
    'spanning-tree mode rapid-pvst on both SW1 and SW2 switches the whole device to RSTP.',
    'The switch-to-switch Gigabit link is full-duplex, so it is point-to-point (Type P2p) and uses the proposal/agreement handshake.',
    'PortFast ports facing the PCs show Type P2p Edge and go straight to forwarding.',
  ],
  breakIt: 'Leave SW1 in classic mode (spanning-tree mode pvst) while SW2 runs rapid-pvst. Flap the link and observe that convergence on that link is no faster than classic 802.1D, because both ends must run RSTP for the handshake to apply.',
};
