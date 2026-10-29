import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'qos';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.10',
  domain: 'D4',
  title: 'QoS: Classification, Marking, Queuing, Policing and Shaping',
  description: 'Why networks need quality of service and how the per-hop behaviours (classify, mark, queue, police, shape) protect voice and video.',
  whyMatters:
    'Kapag sabay-sabay ang video call, download at backup sa iisang WAN link, ang unang nasisira ay ang boses — putol-putol at may delay. Ang QoS ang nagbibigay ng prayoridad sa mahalagang trapiko. Sa exam, kailangan mong malaman ang mga hakbang (classification, marking, queuing, congestion avoidance, policing, shaping) at ang mga numero tulad ng DSCP EF.',
  objectives: [
    'Describe the quality problems QoS addresses: bandwidth, delay, jitter and loss',
    'Explain classification and marking with CoS, IP precedence and DSCP',
    'Describe queuing methods and congestion avoidance (WRED)',
    'Differentiate policing from shaping',
    'Recognise common DSCP values such as EF (46), AF and best effort (0)',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['QoS', 'DSCP', 'EF', 'AF', 'CoS', 'IP precedence', 'classification', 'marking', 'queuing', 'LLQ', 'CBWFQ', 'policing', 'shaping', 'jitter', 'delay', 'WRED', 'trust boundary'],
  examObjectives: ['4.7'],
  sections: [
    {
      type: 'explain',
      simple: [
        'When a link is busy, packets wait in queues, and some are dropped. Email can tolerate waiting, but a voice call cannot. QoS lets the network treat traffic differently: it recognises what a packet is, labels it, and then gives important traffic priority.',
        'The main tools are: classification (what is this packet?), marking (stick a label on it), queuing (who goes first), congestion avoidance (drop the least important early), and policing or shaping (limit a traffic rate).',
      ],
      taglish: [
        'Kapag **puno ang link**, **naghihintay sa pila ang packets** at **may ibinabagsak**. Ang **email** ay **kayang maghintay**, pero **ang voice call ay hindi**. Pinapayagan ng **QoS** ang network na **magkaiba ang trato sa bawat uri ng trapiko**: **kinikilala** kung ano ang packet, **nilalagyan ng label**, saka **binibigyan ng prayoridad ang mahalaga**.',
        'Mga kasangkapan: **Classification** (**ano ang packet na ito?**), **Marking** (**lagyan ng label**), **Queuing** (**sino ang mauuna**), **Congestion avoidance** (**ibagsak nang maaga ang hindi mahalaga**), at **Policing/Shaping** (**limitahan ang bilis**).',
        'Apat na problema ng kalidad: **bandwidth**, **delay**, **jitter** (hindi pantay na delay), at **packet loss**. **Voice**: delay < 150 ms one-way, jitter < 30 ms, loss < 1%.',
        '**Policing** = **ibinabagsak ang sobra**; **shaping** = **iniipit sa buffer at ipinapadala mamaya** (mas banayad).',
      ],
      technical: [
        'Quality issues: limited bandwidth, delay (serialisation, propagation, queuing, processing), jitter (variation in delay) and packet loss (drops from full queues). Real-time voice needs under 150 ms one-way delay, under 30 ms jitter and under 1 percent loss; interactive video is similar with more bandwidth; bulk data (email, backups) is delay tolerant.',
        'Classification identifies traffic by ACL, port, protocol, or by existing markings (CoS, IP precedence, DSCP) or application recognition (NBAR). Marking writes the class into a header field: CoS in the 802.1Q tag (3 bits, Layer 2) and IP precedence (3 bits) or DSCP (6 bits, in the ToS/Traffic Class byte) at Layer 3. DSCP values: EF (46) for voice, AF classes (AF11, AF21, AF31, AF41) with drop precedence for business data and video, CS values, and default/best effort (0). Mark close to the source at a trust boundary (for example at the IP phone or access switch).',
        'Queuing: FIFO (no QoS), weighted fair queuing, CBWFQ (class-based guaranteed bandwidth) and LLQ (CBWFQ plus a strict-priority queue for voice, with a limit to avoid starving others). Congestion avoidance such as WRED randomly drops lower-priority packets early as queues fill to prevent global TCP synchronisation.',
        'Policing measures traffic against a committed rate and drops (or re-marks) packets that exceed it; it can be applied inbound or outbound and causes retransmissions but no delay. Shaping buffers excess traffic to smooth it to the committed rate, adding delay but fewer drops; it is applied outbound only. Typical use: shape toward a service provider with a lower contracted rate than the physical port speed.',
        'QoS is applied hop by hop (per-hop behaviour, PHB) using a policy-map (class-map matches, actions) attached to an interface with service-policy. Verification: show policy-map interface, show mls qos (switches), show interfaces for drops. The CCNA expects concepts, not full MQC configuration.',
      ],
    },
    {
      type: 'story',
      title: 'Ang Tawag na Putol-putol sa Araw ng Backup',
      paragraphs: [
        'Tuwing **Biyernes ng alas-dos**, **nagrereklamo ang accounting**: **putol-putol ang boses** sa video call nila sa head office. Si **Ate Mica** ay naiinis. "Bakit **tuwing Biyernes lang**?"',
        'Nag-imbestiga si **Kuya Jun**. Tuwing Biyernes, **nagsisimula ang malaking backup** (**ilang GB**) sa parehong **10 Mb/s WAN link**. **Napupuno ang pila** (**queue**), at **ang mga voice packet ay naghihintay** sa likod ng **malalaking data packet**. **Tumataas ang delay at jitter**, at **may mga nawawalang packet**.',
        'Ang ginawa ni Kuya Jun: **in-mark ang voice bilang DSCP EF (46)** sa **IP phone** at **ipinagkatiwala (trust boundary)** ang marka sa access switch. Sa router, **gumawa siya ng policy**: **LLQ para sa EF**, **CBWFQ para sa video**, at **default na best effort para sa backup**.',
        'Kinabukasan, **tuloy ang backup pero malinaw ang tawag**. "**Hindi dinagdagan ang bandwidth**," sabi ni Kuya Jun. "**Inayos lang natin kung sino ang mauuna sa pila.**"',
      ],
      moral: 'Ang **QoS ay hindi nagdadagdag ng bandwidth** — **pinipili nito kung sino ang unang dadaan**. **Mark nang malapit sa source**, **LLQ para sa voice**, **best effort para sa bulk data**.',
    },
    {
      type: 'analogy',
      title: 'Pila sa ospital',
      body: [
        'In a hospital, patients are triaged: emergencies are marked red and go first, routine check-ups wait. Classification is the triage nurse recognising the case, marking is the colour wristband, and queuing is the order in which patients are seen. Shaping is the clinic spacing out walk-ins; policing is turning away patients beyond today\'s quota.',
      ],
      taglish: [
        'Sa **ospital**, **may triage**: **pula ang emergency at una**, **ang karaniwang check-up ay naghihintay**. **Classification** = **kinikilala ng nurse ang kaso**, **marking** = **kulay ng wristband**, **queuing** = **pagkakasunod ng tingin ng doktor**. **Shaping** = **pinaghahati-hati ang pagdating ng walk-in**; **policing** = **tinatanggihan ang lampas sa quota ngayong araw**.',
      ],
    },
    {
      type: 'hook',
      title: 'CMQ-PS: Classify, Mark, Queue — Police o Shape',
      trick: '**CMQ**: **C**lassify → **M**ark → **Q**ueue; **P**olice = **drop**, **S**hape = **delay/buffer**. **Voice = DSCP EF (46)**, LLQ. **Best effort = 0**.',
      taglish: [
        '**Classify** (kilalanin) → **Mark** (lagyan ng label) → **Queue** (pila).',
        '**Voice**: **DSCP EF = 46**, sa **LLQ** (strict priority).',
        '**Policing** = **ibinabagsak ang sobra** (inbound/outbound). **Shaping** = **iniipit at pinapakinis** (outbound lang).',
        'Voice target: **delay < 150 ms**, **jitter < 30 ms**, **loss < 1%**.',
      ],
      test: {
        question: 'Alin ang nagbabagsak ng sobrang trapiko at alin ang nagbu-buffer nito? Anong DSCP ang karaniwan para sa voice?',
        answer: 'Policing ang nagbabagsak ng sobra; shaping ang nagbu-buffer at nagpapakinis. Ang voice ay DSCP EF (46).',
      },
    },
    { type: 'diagram', id: 'qos-pipeline', caption: 'Classify at mark sa source, pagkatapos queuing at congestion avoidance sa bawat hop.' },
    {
      type: 'terms',
      items: [
        { term: 'QoS', definition: 'Quality of service: mechanisms that give different treatment to different traffic.' },
        { term: 'Delay / jitter / loss', definition: 'Time to deliver, variation in that time, and dropped packets: the quality metrics for voice and video.' },
        { term: 'Classification / marking', definition: 'Identifying traffic and writing its class into a header field (CoS, IP precedence, DSCP).' },
        { term: 'DSCP', definition: '6-bit marking in the IP header; EF (46) for voice, AFxy for assured forwarding, 0 for best effort.' },
        { term: 'LLQ', definition: 'Low-latency queuing: a strict-priority queue for voice combined with CBWFQ classes.' },
        { term: 'Policing', definition: 'Drops or re-marks traffic that exceeds a configured rate.' },
        { term: 'Shaping', definition: 'Buffers excess traffic to smooth it to a configured rate, adding delay.' },
        { term: 'Trust boundary', definition: 'The point where markings are trusted; devices beyond it are re-marked.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: boses at backup sa iisang link',
      steps: [
        'Nagpapadala ang IP phone ng voice packet na may DSCP EF (46); trusted ito ng access switch.',
        'Dumarating ang packet sa R1 at tinutugma ng class-map sa EF: ito ay klase ng voice.',
        'Inilalagay ito ng R1 sa LLQ (strict priority, limitado sa 30% ng link).',
        'Ang backup traffic (DSCP 0) ay nasa default queue at naghihintay.',
        'Kapag napuno ang link, ibinabagsak ng WRED ang ilang packet ng bulk data bago ang voice.',
        'Ipinapadala ng R1 ang voice nang walang pagkaantala, kaya malinaw ang tawag.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **QoS ay hindi gumagawa ng dagdag na bandwidth**; **nagpapasya lang ito ng prayoridad** kapag **puno ang link**. Kapag **hindi congested**, **walang epekto**. At **hindi** ginagamit ang **policing** para magpakinis — **shaping** iyon.' },
    { type: 'callout', kind: 'trap', text: 'Ang **shaping ay outbound lang**; ang **policing ay puwedeng inbound o outbound**. At ang **policing ay hindi nagdadagdag ng delay** (nagbabagsak o nagre-re-mark), samantalang **ang shaping ay nagdadagdag ng delay**.' },
    { type: 'callout', kind: 'tip', text: 'Tandaan ang mga numero: **EF = 46 (voice)**, **CoS 5 = voice sa 802.1Q**, **DSCP 0 = best effort**. **Mark sa pinakamalapit sa source** at **i-trust lang ang mga device na pinagkakatiwalaan**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pag-iisip na nagdaragdag ng bandwidth ang QoS.',
        'Pagkalito sa policing at shaping.',
        'Pag-i-mark sa gitna ng network sa halip na malapit sa source.',
        'Pagtitiwala sa marka ng anumang device (walang trust boundary).',
        'Paglalagay ng sobrang malaking bahagi ng link sa priority queue.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Pag-aralan: "Putol-putol pa rin ang boses kahit may QoS"',
      scenario: 'Voice calls still break up at busy times even though an LLQ policy exists on the WAN router.',
      evidence: `R1# show policy-map interface gi0/1 output
  Class-map: VOICE (match-all)
    Match: dscp ef (46)
    Priority: 30% (3000 kbps)
    0 packets, 0 bytes
  Class-map: class-default
    Match: any   19284 packets`,
      question: 'Bakit 0 packets ang VOICE class?',
      answer: 'Walang packet na may DSCP EF na dumarating sa R1: hindi nama-mark ang voice sa source o nawawala ang marka (access switch ay hindi nagtitiwala sa phone kaya nire-reset sa 0).',
      fix: 'I-mark ang voice sa IP phone/access switch (mls qos trust device cisco-phone, trust dscp) at tiyaking hindi nare-reset ang marka bago umabot sa WAN router. Pagkatapos ay dapat tumaas ang packets ng VOICE class.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang contracted rate mula sa ISP ay 20 Mb/s pero 100 Mb/s ang port ng router. Aling teknik ang gagamitin mo bago ang ISP para hindi mabagsak ang packets, at bakit hindi policing?',
      answer: 'Traffic shaping sa outbound papunta sa ISP: ibinu-buffer ang sobra para pakinisin sa 20 Mb/s sa halip na ibagsak. Ang policing ay magbabagsak ng sobra at magdudulot ng retransmissions.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'QoS addresses bandwidth, delay, jitter and packet loss; it prioritises but does not create bandwidth.',
        'Classify, mark, queue; DSCP EF (46) for voice; default 0.',
        'LLQ = strict priority for voice plus CBWFQ; WRED avoids congestion.',
        'Policing drops or re-marks excess; shaping buffers it (outbound only).',
        'Voice: delay under 150 ms, jitter under 30 ms, loss under 1 percent.',
      ],
    },
    {
      type: 'summary',
      points: [
        'QoS gives important traffic better treatment during congestion.',
        'Classify and mark near the source at a trust boundary.',
        'Use LLQ for voice and WRED to manage congestion.',
        'Policing drops; shaping delays.',
        'Susunod: Wireless — mga pangunahing konsepto.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.7', difficulty: 'easy', type: 'single',
    prompt: 'Which DSCP value is typically used for voice traffic?',
    choices: ['0', '26', '46 (EF)', '10'], correct: [2],
    explanation: 'Expedited Forwarding (46) is used for voice.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.7', difficulty: 'easy', type: 'single',
    prompt: 'What is jitter?',
    choices: ['Total bandwidth', 'Variation in packet delay', 'Packet loss', 'Link speed'], correct: [1],
    explanation: 'Jitter is the variation in delay between packets.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.7', difficulty: 'medium', type: 'single',
    prompt: 'What is the difference between policing and shaping?',
    choices: ['Policing buffers excess traffic; shaping drops it', 'Policing drops or re-marks excess traffic; shaping buffers it', 'They are identical', 'Shaping is only inbound'], correct: [1],
    explanation: 'Policing discards or re-marks excess; shaping delays it in a buffer.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.7', difficulty: 'medium', type: 'single',
    prompt: 'Which queuing method gives voice a strict priority queue?',
    choices: ['FIFO', 'LLQ', 'WRED', 'Tail drop'], correct: [1],
    explanation: 'Low-latency queuing adds a strict-priority queue for voice to CBWFQ.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.7', difficulty: 'medium', type: 'single',
    prompt: 'Where should traffic be marked?',
    choices: ['As close to the source as possible, at a trust boundary', 'Only on the core', 'Only at the ISP', 'Never'], correct: [0],
    explanation: 'Marking near the source lets every hop apply the right treatment.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.7', difficulty: 'hard', type: 'single',
    prompt: 'What does WRED do?',
    choices: ['Shapes traffic to a rate', 'Randomly drops lower-priority packets early to avoid congestion', 'Encrypts voice', 'Marks DSCP'], correct: [1],
    explanation: 'Weighted Random Early Detection drops packets before queues fill, favouring higher priorities.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.7', difficulty: 'medium', type: 'single',
    prompt: 'QoS has the greatest effect when:',
    choices: ['The network is idle', 'A link is congested', 'Only one host is active', 'DNS is slow'], correct: [1],
    explanation: 'QoS only matters when packets must compete for limited resources.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.7', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are quality metrics important for voice?',
    choices: ['Delay', 'Jitter', 'VLAN count', 'Cable colour'], correct: [0, 1],
    explanation: 'Delay, jitter and loss determine voice quality.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D4', objective: '4.7', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: QoS increases the total bandwidth of a link.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — it only decides which traffic gets priority.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: QoS?', back: 'Classify → Mark → Queue. Voice = DSCP EF (46) sa LLQ. Policing = drop sobra; shaping = buffer/delay (outbound). Hindi nagdadagdag ng bandwidth.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'concept', front: 'QoS metrics?', back: 'Bandwidth, delay, jitter and packet loss. Voice: <150 ms delay, <30 ms jitter, <1% loss.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Classification vs marking?', back: 'Classification identifies traffic; marking writes the class into CoS, IP precedence or DSCP.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Policing vs shaping?', back: 'Policing drops/re-marks excess (no delay); shaping buffers excess (adds delay, outbound only).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'concept', front: 'DSCP values to know?', back: 'EF 46 voice; AF classes for assured data/video; 0 best effort.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'concept', front: 'What are LLQ and WRED?', back: 'LLQ: strict-priority queue plus CBWFQ. WRED: early random drops of lower priority packets to avoid congestion.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Plan a QoS policy on paper',
  tool: 'Paper',
  minutes: 25,
  objective: 'Classify five traffic types, choose markings and queues, and decide between policing and shaping.',
  steps: [
    'List five traffic types: VoIP, video conference, business web app, email and bulk backup.',
    'Next to each write the DSCP marking you would use and the queue (LLQ, CBWFQ, default).',
    'Decide the maximum percent of the link for the priority queue.',
    'For a link where the ISP contract is lower than the port speed, choose policing or shaping and explain why.',
    'Decide where the trust boundary sits and which device marks.',
    'Compare with the solution.',
  ],
  checklist: [
    'Five traffic types classified',
    'Voice in LLQ with EF',
    'Shaping chosen toward the ISP',
    'Trust boundary identified',
  ],
  hints: [
    'Voice is small but delay sensitive; backups are large and tolerant.',
    'Shape toward the ISP to avoid drops at the provider.',
  ],
  solution: [
    'VoIP EF/LLQ; video AF41/CBWFQ; business app AF21/CBWFQ; email default; backup lowest or scavenger.',
    'Shape outbound to the contracted rate; mark at the phone or access switch.',
  ],
};
