import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'stp-protection';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.9',
  domain: 'D2',
  title: 'STP Protection: PortFast, BPDU Guard, Root Guard, Loop Guard',
  description: 'How to make convergence fast on host ports without letting a user, a rogue switch or a broken link quietly damage the spanning tree.',
  whyMatters:
    'Ang bilis ng Rapid PVST+ ay may kapalit na panganib: kung may magkonekta ng switch o hub sa isang PortFast port, o may mag-plug ng maling switch na may mas mababang priority, maaaring masira ang buong topology. Ang mga proteksyon na ito ang sagot kung bakit hindi lang basta binubuksan ng mga network engineer ang PortFast sa lahat ng port — at palagi itong lumalabas sa exam bilang "ano ang gagawin mo dito?" na tanong.',
  objectives: [
    'Explain why PortFast is needed and where it is safe to enable',
    'Describe what BPDU Guard does and why it pairs with PortFast',
    'Distinguish BPDU Guard from BPDU Filter',
    'Explain what Root Guard protects against and where to enable it',
    'Explain what Loop Guard protects against and where to enable it',
    'Read the interface states these protections cause: err-disabled and root-inconsistent',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['PortFast', 'BPDU Guard', 'BPDU Filter', 'Root Guard', 'Loop Guard', 'err-disabled', 'root-inconsistent', 'edge port'],
  examObjectives: ['2.5'],
  sections: [
    {
      type: 'explain',
      simple: [
        'PortFast lets a host-facing port skip straight to forwarding, because a PC cannot form a loop. But nothing stops someone from plugging a switch or an unmanaged hub into that same port later, and now it can form a loop. BPDU Guard closes that hole: if a PortFast port ever receives a BPDU, it is shut down immediately.',
        'Root Guard and Loop Guard protect the rest of the topology from bad information. Root Guard stops a port from ever becoming a root port — useful on links toward switches that should never become the root. Loop Guard stops a port from mistakenly moving to forwarding when it stops receiving BPDUs, which would otherwise open a loop.',
      ],
      taglish: [
        'Ang **PortFast** ay ginagawa lang ang isang bagay: **laktawan ang paghihintay** sa isang port na alam mong papunta lang sa isang PC. Pero paano kung may **magpalit ng koneksyon** doon at maglagay ng switch o hub? Ngayon may panganib ng loop dahil forwarding na agad ang port na iyon.',
        'Dito pumapasok ang **BPDU Guard**: kapag may **BPDU** na dumating sa isang PortFast port, ibig sabihin **may switch doon**, hindi PC. Agad **inisara ng BPDU Guard ang port** (err-disabled) — kailangan pang manu-manong i-`shutdown` at `no shutdown` para buksan ulit.',
        'May kapatid ang BPDU Guard na **BPDU Filter** — pero magkaiba sila. Ang **Guard ay nagsasara ng port** kapag may BPDU (proteksyon). Ang **Filter ay tinatago lang ang BPDU** — hindi nagpapadala at hindi tumatanggap. **Mas mapanganib ang Filter kung mali ang gamit** dahil pwedeng magkaroon ng loop nang hindi mo alam, kaya bihira itong ginagamit sa totoong network kumpara sa Guard.',
        '**Root Guard** naman ay para sa ibang usapin: hindi tungkol sa PC port kundi sa **uplink patungo sa ibang switch**. Kung sa isang port na inilagyan mo ng Root Guard ay biglang may dumating na **mas magandang BPDU** (mas mababang priority), **hindi papayagan** ang port na maging root port — sa halip, pupunta ito sa **root-inconsistent** (parang blocking) hanggang tumigil ang mas magandang BPDU.',
        '**Loop Guard** ay ang kabaligtaran ng problema: kapag bigla nawalan ng BPDU ang isang blocked/alternate port (dahil sira ang unidirectional na link, halimbawa), **normal na aakalain ng STP na wala nang kalaban** at magiging forwarding — pero maaaring loop pala ito. Pinipigilan ito ng Loop Guard sa pamamagitan ng paglalagay sa port sa **loop-inconsistent** state sa halip na basta pumunta sa forwarding.',
      ],
      technical: [
        'PortFast (edge port in RSTP terms) is configured with spanning-tree portfast on an access port facing a single host or server, or spanning-tree portfast default globally on all access ports. It skips the listening/learning wait and, under 802.1D, avoids sending a topology-change notification when the port flaps.',
        'BPDU Guard (spanning-tree bpduguard enable on the interface, or spanning-tree portfast bpduguard default globally for all PortFast ports) puts the port into an err-disabled state the instant it receives any BPDU. Recovery is manual (shutdown / no shutdown) unless errdisable recovery cause bpduguard is configured with a timeout.',
        'BPDU Filter (spanning-tree bpdufilter enable, or the global default) suppresses BPDU transmission and processing on the port entirely. Used carelessly it can create an undetected loop, because the port never learns about a topology problem; it is far less commonly recommended than BPDU Guard.',
        'Root Guard (spanning-tree guard root) is applied on a designated port facing a switch that must never become the root — typically a distribution-to-access uplink. If a superior BPDU is received, the port moves to a root-inconsistent (blocking-like) state instead of becoming a root port; it recovers automatically once superior BPDUs stop.',
        'Loop Guard (spanning-tree guard loop, or spanning-tree loopguard default globally) applies to non-designated (root or alternate) ports. If BPDUs stop arriving — often from a unidirectional link failure — the port is moved to a loop-inconsistent state instead of transitioning to forwarding, preventing a loop; it too recovers automatically once BPDUs resume.',
        'Verification: show spanning-tree interface <if> detail shows guard status; show interfaces status or show interfaces <if> shows err-disabled; show errdisable recovery shows automatic-recovery configuration.',
      ],
    },
    {
      type: 'analogy',
      title: 'Bantay sa pinto ng bahay',
      body: [
        'PortFast is like leaving the front door unlocked because you trust it is only ever a family member walking in. BPDU Guard is the alarm that locks the door the moment it detects someone who is not family. Root Guard is a rule that a certain visitor is never allowed to become the head of the house, no matter what they claim. Loop Guard is noticing that a normally-talkative doorbell has gone silent and treating that as suspicious instead of assuming it is safe.',
      ],
      taglish: [
        'Ang **PortFast** ay parang **iniwan mong nakabukas ang pintuan** dahil pamilya lang naman ang dumadaan doon. Ang **BPDU Guard** ay ang **alarm** na agad nag-lo-lock kapag may dumaan na hindi pamilya. Ang **Root Guard** ay isang patakaran na **hindi puwedeng maging pinuno ng bahay** ang isang tao, kahit ano pa ang sabihin niya. Ang **Loop Guard** ay ang pagpansin mo na **natahimik bigla ang doorbell** na dating palaging tumutunog — at itinuturing mo itong kahina-hinala sa halip na basta ipagpalagay na ligtas.',
      ],
    },
    {
      type: 'hook',
      title: 'PBRL: PortFast-BPDU Guard sa PC, Root-Loop Guard sa uplink',
      trick: '**PBRL**: sa PC port, **P**ortFast + **B**PDU Guard. Sa uplink, **R**oot Guard + **L**oop Guard.',
      taglish: [
        'Tandaan sa **apat na letra: PBRL**.',
        '**P + B sa PC port**: PortFast (bilis) laging kasama ng BPDU Guard (proteksyon) — kapag may BPDU dumating, **err-disabled agad**.',
        '**R sa uplink**: Root Guard — pinipigilan ang isang port na **maging root port** kapag may mas magandang BPDU. Napupunta sa **root-inconsistent**.',
        '**L sa uplink**: Loop Guard — kapag **biglang nawalan ng BPDU** ang isang blocked/root port, huwag agad maging forwarding. Napupunta sa **loop-inconsistent**.',
        'Guard = **nagsasara/humaharang**. Filter = **nagtatago** ng BPDU (mas mapanganib kung mali ang gamit, kaya bihira).',
      ],
      test: {
        question: 'Isang access port na may PortFast at BPDU Guard ay bigla nakatanggap ng BPDU. Ano ang mangyayari? At isang uplink port na may Root Guard ay nakatanggap ng mas magandang (mas mababang priority) na BPDU — ano ang mangyayari?',
        answer: 'Ang PortFast + BPDU Guard port ay agad mapupunta sa err-disabled state (kailangang shutdown/no shutdown para buksan ulit). Ang Root Guard port ay hindi papayagang maging root port — pupunta ito sa root-inconsistent state hanggang tumigil ang mas magandang BPDU.',
      },
    },
    { type: 'diagram', id: 'stp-guards', caption: 'PortFast + BPDU Guard sa PC port; Root Guard sa uplink patungo sa distribution switch.' },
    {
      type: 'terms',
      items: [
        { term: 'PortFast', definition: 'Skips listening/learning on a host-facing port so it goes straight to forwarding. The RSTP name is edge port.' },
        { term: 'BPDU Guard', definition: 'Puts a PortFast port into err-disabled the instant it receives a BPDU.' },
        { term: 'BPDU Filter', definition: 'Suppresses BPDU transmission and processing on a port entirely; can hide a real loop if misused.' },
        { term: 'Root Guard', definition: 'Stops a port from becoming a root port; moves it to root-inconsistent if a superior BPDU arrives.' },
        { term: 'Loop Guard', definition: 'Stops a non-designated port from moving to forwarding when BPDUs stop arriving; moves it to loop-inconsistent instead.' },
        { term: 'err-disabled', definition: 'A port administratively shut down by a protection feature; needs manual or timed recovery.' },
        { term: 'root-inconsistent', definition: 'A blocking-like state caused by Root Guard detecting a superior BPDU where one should not exist.' },
        { term: 'loop-inconsistent', definition: 'A blocking-like state caused by Loop Guard detecting missing BPDUs on a non-designated port.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: may nag-plug ng hub sa isang PortFast + BPDU Guard port',
      steps: [
        'Normal na kalagayan: PC lang ang nakakonekta sa Gi0/5, na may spanning-tree portfast at spanning-tree bpduguard enable. Forwarding agad ito, walang problema.',
        'May tao na nag-alis ng PC at naglagay ng maliit na unmanaged switch, at ikinonekta ang isa pang switch dito — nagkaroon ng aksidenteng loop.',
        'Ang bagong nakonektang switch ay nagpapadala ng BPDU papunta sa Gi0/5.',
        'Nakikita ng SW1 ang BPDU sa isang PortFast port — bawal ito.',
        'Agad ina-err-disable ng BPDU Guard ang Gi0/5. Ang port ay hindi na magpapasa ng traffic, kahit anong mangyari sa kabilang dulo.',
        'Makikita sa show interfaces status ang "err-disabled" sa Gi0/5, at may log message. Kailangang ayusin ang koneksyon at manu-manong i-shutdown / no shutdown (o hintayin ang errdisable recovery kung naka-configure).',
      ],
    },
    {
      type: 'cli',
      title: 'I-configure ang apat na proteksyon',
      transcript: `SW1(config)# interface range gi0/5 - 8
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# spanning-tree portfast
SW1(config-if-range)# spanning-tree bpduguard enable
SW1(config-if-range)# exit
SW1(config)# interface gi0/1
SW1(config-if)# spanning-tree guard root
SW1(config-if)# exit
SW1(config)# interface gi0/2
SW1(config-if)# spanning-tree guard loop
SW1(config-if)# end
SW1# show interfaces status | include err-disabled
Gi0/6                       err-disabled  1    auto   auto 10/100/1000BaseTX`,
      copyable: 'spanning-tree bpduguard enable',
      explain: [
        { line: 'spanning-tree portfast (gi0/5–8)', why: 'These are access ports facing hosts; skip the wait and go straight to forwarding.' },
        { line: 'spanning-tree bpduguard enable', why: 'Pairs with PortFast: if any of these ports receives a BPDU, it is err-disabled immediately.' },
        { line: 'spanning-tree guard root (gi0/1)', why: 'This uplink must never become a root port. A superior BPDU here puts the port in root-inconsistent instead.' },
        { line: 'spanning-tree guard loop (gi0/2)', why: 'This non-designated port stays safely blocking if BPDUs stop arriving, instead of moving to forwarding.' },
        { line: 'Gi0/6 err-disabled', why: 'BPDU Guard already fired on this port — something sent a BPDU where only a host was expected.' },
      ],
      note: 'Sample output for study; exact interface numbers vary by switch model.',
    },
    { type: 'callout', kind: 'trap', text: 'Huwag ilagay ang **PortFast sa isang uplink o trunk port**. Ito ay para lang sa mga port na direktang papunta sa isang host. Kung nilagyan mo ito ng PortFast at may aksidenteng loop, mas mabilis pa itong makakasira dahil forwarding agad ito.' },
    { type: 'callout', kind: 'trap', text: '**BPDU Guard at BPDU Filter ay hindi pareho.** Ang Guard ay **nagsasara** ng port (proteksyon). Ang Filter ay **nagtatago** lang ng BPDU — kung may loop, hindi ito makikita. Kapag tinanong ka kung alin ang mas ligtas na default, ang **BPDU Guard** ang tamang sagot.' },
    { type: 'callout', kind: 'tip', text: 'Kapag nakita mo sa exam ang salitang **"prevent this port from becoming the root port"**, iyon ay **Root Guard**. Kapag **"prevent this port from incorrectly transitioning to forwarding when BPDUs stop"**, iyon ay **Loop Guard**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Maglagay ng PortFast sa isang trunk o uplink port.',
        'Isipin na pareho ang BPDU Guard at BPDU Filter.',
        'Maglagay ng Root Guard sa maling port — dapat ito ay nasa designated port patungo sa switch na hindi dapat maging root.',
        'Isipin na kailangan pa ring manu-manong buksan ang isang err-disabled port kahit naka-configure na ang errdisable recovery cause bpduguard.',
        'Malito sa root-inconsistent (Root Guard) at loop-inconsistent (Loop Guard) — magkaibang sanhi ang mga ito.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Bakit biglang walang internet ang isang cubicle?"',
      scenario: 'A user reports their network port suddenly stopped working after they connected a small consumer switch under their desk to plug in two devices.',
      evidence: `SW1# show interfaces gi0/12 status
Port      Name    Status       Vlan   Duplex  Speed Type
Gi0/12            err-disabled 20     auto    auto  10/100/1000BaseTX
SW1# show logging | include BPDUGUARD
%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port Gi0/12 with BPDU Guard enabled. Disabling port.`,
      question: 'Ano ang nangyari, at ano ang tamang ayos?',
      answer: 'Ang port ay may PortFast + BPDU Guard, at ang consumer switch na ikinonekta ng user ay nagpadala ng BPDU (o may aksidenteng loop). Nakita ito ng BPDU Guard at agad ina-err-disable ang port — gumagana ito nang tama.',
      fix: 'Explain to the user that a switch or hub may not be connected to that port, remove it, then recover the port: interface gi0/12, shutdown, no shutdown. For a longer-term fix, consider errdisable recovery cause bpduguard with a timeout so the port recovers automatically once the offending device is removed.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isang distribution switch ay may Root Guard sa lahat ng uplink papunta sa mga access switch. Isang araw, may na-configure na access switch na aksidenteng may priority na 0 (pinakamababa posible). Ano ang mangyayari sa link papunta rito?',
      answer: 'Ang access switch na iyon ay magpapadala ng mas magandang (superior) BPDU dahil priority 0. Sa distribution switch, ang port papunta rito ay hindi papayagang maging root port dahil sa Root Guard — mapupunta ito sa root-inconsistent state, mananatiling root bridge ang distribution switch.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'PortFast + BPDU Guard belong together, on access ports facing a single host.',
        'BPDU Guard shuts the port (err-disabled). BPDU Filter hides BPDUs — riskier, rarely the right default answer.',
        'Root Guard prevents a port from becoming root port; result state is root-inconsistent.',
        'Loop Guard prevents a false move to forwarding when BPDUs stop; result state is loop-inconsistent.',
        'err-disabled ports need shutdown / no shutdown, or errdisable recovery with a timeout.',
        'Never enable PortFast on a trunk or switch-to-switch uplink.',
      ],
    },
    {
      type: 'summary',
      points: [
        'PortFast skips the wait on host-facing ports; pair it with BPDU Guard so a rogue switch cannot exploit it.',
        'BPDU Guard err-disables the port on any BPDU; BPDU Filter hides BPDUs instead and is riskier.',
        'Root Guard stops a port from becoming root port (root-inconsistent state).',
        'Loop Guard stops a false transition to forwarding when BPDUs stop arriving (loop-inconsistent state).',
        'Verify with show interfaces status, show spanning-tree interface detail and show logging.',
        'Susunod: EtherChannel — pagsasama-sama ng maraming physical link bilang isang lohikal na link.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'Which feature should always be paired with PortFast on an access port?',
    choices: ['Root Guard', 'BPDU Guard', 'Loop Guard', 'EtherChannel'], correct: [1],
    explanation: 'BPDU Guard protects a PortFast port by shutting it down if it ever receives a BPDU.',
    wrong: { 0: 'Root Guard belongs on uplinks, not host ports.', 2: 'Loop Guard belongs on non-designated ports, not typically PortFast host ports.', 3: 'EtherChannel is unrelated to PortFast safety.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'What happens to a BPDU Guard-enabled port when it receives a BPDU?',
    choices: ['It becomes the root port', 'It is placed in err-disabled state', 'It ignores the BPDU', 'It becomes a trunk automatically'], correct: [1],
    explanation: 'BPDU Guard immediately err-disables the port on receiving any BPDU.',
    wrong: { 0: 'The opposite happens; the port is shut down.', 2: 'BPDU Filter ignores BPDUs, not BPDU Guard.', 3: 'Trunking is unrelated.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'How does BPDU Filter differ from BPDU Guard?',
    choices: ['They are identical features with different names', 'BPDU Filter suppresses BPDUs instead of shutting the port down', 'BPDU Filter only works on trunk ports', 'BPDU Filter is stronger protection than BPDU Guard'], correct: [1],
    explanation: 'BPDU Filter suppresses BPDU transmission/processing entirely, which can hide a real loop; it does not shut the port down.',
    wrong: { 0: 'They behave differently.', 2: 'Not restricted to trunk ports.', 3: 'BPDU Filter is generally considered riskier, not stronger.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'What does Root Guard prevent?',
    choices: ['A port from learning MAC addresses', 'A port from becoming a root port after receiving a superior BPDU', 'A port from forwarding broadcast traffic', 'A port from joining a VLAN'], correct: [1],
    explanation: 'Root Guard stops a port from becoming root port; it moves to root-inconsistent instead if a superior BPDU arrives.',
    wrong: { 0: 'Unrelated to MAC learning.', 2: 'Unrelated to broadcast handling specifically.', 3: 'Unrelated to VLAN membership.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'What state does a Root Guard-enabled port enter when it receives a superior BPDU?',
    choices: ['Forwarding', 'Root-inconsistent', 'Learning', 'Err-disabled'], correct: [1],
    explanation: 'Root Guard blocks the port in a root-inconsistent state and recovers automatically once superior BPDUs stop.',
    wrong: { 0: 'It is prevented from forwarding, not allowed to.', 2: 'Learning is a normal transitional state, not the Root Guard result.', 3: 'Err-disabled is the BPDU Guard result, not Root Guard.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'What does Loop Guard protect against?',
    choices: ['A port incorrectly moving to forwarding when BPDUs stop arriving', 'A rogue switch on a host port', 'An IP address conflict', 'A duplex mismatch'], correct: [0],
    explanation: 'Loop Guard prevents a non-designated port from moving to forwarding when it stops hearing BPDUs, often from a unidirectional link failure.',
    wrong: { 1: 'That scenario is what BPDU Guard addresses.', 2: 'Unrelated to Layer 3 addressing.', 3: 'Unrelated to duplex settings directly.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'What state does Loop Guard place a port in when BPDUs stop arriving?',
    choices: ['Root-inconsistent', 'Err-disabled', 'Loop-inconsistent', 'Learning'], correct: [2],
    explanation: 'Loop Guard uses a loop-inconsistent (blocking-like) state instead of allowing a false move to forwarding.',
    wrong: { 0: 'That is the Root Guard result.', 1: 'That is the BPDU Guard result.', 3: 'Learning is a normal STP transition state.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'single',
    prompt: 'Which command recovers a port that BPDU Guard has err-disabled?',
    choices: ['spanning-tree portfast', 'shutdown then no shutdown', 'spanning-tree guard root', 'switchport mode trunk'], correct: [1],
    explanation: 'Manually cycling the interface with shutdown / no shutdown clears the err-disabled state (unless errdisable recovery is configured to do it automatically).',
    wrong: { 0: 'That re-enables PortFast, not recovery from err-disabled.', 2: 'That configures Root Guard, unrelated to recovery.', 3: 'Changing trunk mode does not clear err-disabled.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'single',
    prompt: 'Where should PortFast be enabled?',
    choices: ['On every trunk port', 'On access ports facing a single host', 'On the root bridge\'s uplinks', 'On EtherChannel bundles only'], correct: [1],
    explanation: 'PortFast belongs only on access ports connected to a single end device, which cannot create a loop.',
    wrong: { 0: 'Trunks connect switches and can be part of a loop.', 2: 'Uplinks between switches should not use PortFast.', 3: 'Not specific to EtherChannel.' },
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'hard', type: 'single',
    prompt: 'A distribution switch has Root Guard on all access-layer uplinks. An access switch is misconfigured with priority 0. What happens?',
    choices: ['The access switch becomes the new root bridge', 'The uplink to the misconfigured switch goes root-inconsistent and the distribution switch stays root', 'The distribution switch shuts down', 'Nothing, priority 0 is ignored'], correct: [1],
    explanation: 'Root Guard refuses to let that port become a root port despite the superior BPDU, protecting the intended root.',
    wrong: { 0: 'Root Guard specifically prevents this outcome.', 2: 'The switch does not shut down; only the port is affected.', 3: 'Priority 0 is a valid, superior value and is not ignored — Root Guard is what blocks its effect.' },
  },
  {
    id: `${ID}-q11`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO of these are STP protection features (as opposed to plain PortFast)?',
    choices: ['BPDU Guard', 'Trunk negotiation', 'Root Guard', 'VLAN pruning'], correct: [0, 2],
    explanation: 'BPDU Guard and Root Guard are STP protection features. Trunk negotiation and VLAN pruning are unrelated topics.',
  },
  {
    id: `${ID}-q12`, lessonIds: [ID], domain: 'D2', objective: '2.5', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: BPDU Filter is generally recommended over BPDU Guard because it is safer.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — BPDU Filter hides BPDUs and can allow an undetected loop; BPDU Guard is the safer, more commonly recommended default.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: paano tandaan ang STP protection?', back: 'PBRL: sa PC port, PortFast + BPDU Guard (nagsasara ng port kapag may BPDU). Sa uplink, Root Guard (root-inconsistent kapag superior BPDU) + Loop Guard (loop-inconsistent kapag nawalan ng BPDU). Guard = nagsasara. Filter = nagtatago (mas mapanganib).' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What does BPDU Guard do?', back: 'Puts a PortFast port into err-disabled immediately if it receives any BPDU.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'concept', front: 'BPDU Guard vs BPDU Filter?', back: 'Guard shuts the port down (safer, recommended). Filter just suppresses BPDUs on the port, which can hide a real loop.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What does Root Guard do?', back: 'Prevents a port from becoming a root port; moves it to root-inconsistent if a superior BPDU arrives. Used on uplinks that must never become root.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What does Loop Guard do?', back: 'Prevents a non-designated port from falsely moving to forwarding when BPDUs stop arriving; moves it to loop-inconsistent instead.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What is err-disabled?', back: 'A port administratively shut down by a protection feature (like BPDU Guard). Needs shutdown/no shutdown or errdisable recovery to clear.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'command', front: 'Commands to enable PortFast + BPDU Guard on an interface?', back: 'spanning-tree portfast\nspanning-tree bpduguard enable' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D2', category: 'command', front: 'Commands for Root Guard and Loop Guard?', back: 'spanning-tree guard root\nspanning-tree guard loop' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Where should PortFast never be enabled?', back: 'On a trunk port or a switch-to-switch uplink — only on ports facing a single host.' },
  { id: `${ID}-f9`, lessonId: ID, domain: 'D2', category: 'command', front: 'How to check for err-disabled ports?', back: 'show interfaces status | include err-disabled, and show logging for the triggering message.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Trigger and recover from BPDU Guard, then configure Root Guard',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Configure PortFast and BPDU Guard on a host port, deliberately trigger err-disabled by connecting a switch, recover the port, then configure Root Guard on an uplink.',
  topology: 'SW1 (access switch) with a PC on Gi0/5 and an uplink to SW2 (distribution) on Gi0/1. A spare switch (SW3) available to simulate a rogue device.',
  steps: [
    'On SW1 Gi0/5: switchport mode access, spanning-tree portfast, spanning-tree bpduguard enable. Confirm the PC connects and the port shows connected/forwarding.',
    'Replace the PC on Gi0/5 with SW3 (a switch). Watch show interfaces gi0/5 status change to err-disabled within a few seconds.',
    'Check show logging for the %SPANTREE-2-BLOCK_BPDUGUARD message naming the port.',
    'Disconnect SW3, then recover the port: interface gi0/5, shutdown, no shutdown. Reconnect the PC and confirm it forwards again.',
    'On SW1 Gi0/1 (the uplink to SW2): spanning-tree guard root.',
    'On SW3, temporarily set an aggressively low priority (spanning-tree vlan 1 priority 0) and connect it to SW1 on a spare port to simulate a rogue root. Confirm the affected port on SW1 goes root-inconsistent rather than becoming a root port.',
  ],
  checklist: [
    'PortFast + BPDU Guard configured on the host port',
    'Observed err-disabled after connecting a switch to that port',
    'Found the triggering message in show logging',
    'Recovered the port with shutdown / no shutdown',
    'Configured Root Guard on the uplink and observed root-inconsistent behaviour',
  ],
  hints: [
    'err-disabled will not clear on its own unless errdisable recovery is configured with a cause and timeout.',
    'Root Guard only reacts when a superior (numerically lower) BPDU arrives — a normal or inferior BPDU has no effect.',
  ],
  solution: [
    'BPDU Guard triggers the instant a BPDU is seen on the PortFast port, regardless of what device sent it.',
    'shutdown / no shutdown on the interface clears err-disabled.',
    'Root Guard blocks the port from becoming root port and shows root-inconsistent in show spanning-tree interface detail until the superior BPDUs stop.',
  ],
  breakIt: 'Configure errdisable recovery cause bpduguard and errdisable recovery interval 30, then trigger BPDU Guard again. Watch the port recover automatically after 30 seconds instead of needing a manual shutdown/no shutdown.',
};
