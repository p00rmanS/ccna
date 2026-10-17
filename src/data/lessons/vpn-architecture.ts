import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'vpn-architecture';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.12',
  domain: 'D5',
  title: 'VPN and Security Architecture: IPsec, Firewalls and IPS',
  description: 'How IPsec site-to-site and remote-access VPNs protect traffic across the internet, and where firewalls, IDS and IPS sit in a secure design.',
  whyMatters:
    'Ang mga opisina at remote worker ay kumokonekta sa pamamagitan ng internet — pampublikong network. Ang VPN ang gumagawa ng pribadong tunnel; ang firewall at IPS ang nagbabantay sa gilid ng network. Sa exam, ang mga tanong ay nasa pagkakaiba ng site-to-site at remote-access VPN, ang mga bahagi ng IPsec, at ang firewall laban sa IPS.',
  objectives: [
    'Explain what a VPN does and compare site-to-site and remote-access VPNs',
    'Describe IPsec goals: confidentiality, integrity, authentication and anti-replay',
    'Distinguish IPsec transport and tunnel modes and AH from ESP at a high level',
    'Compare IPsec VPNs with SSL/TLS VPNs',
    'Describe firewalls, IDS and IPS and where each sits in the network',
  ],
  estimatedMinutes: 40,
  difficulty: 'intermediate',
  keywords: ['VPN', 'IPsec', 'site-to-site', 'remote access', 'ESP', 'AH', 'IKE', 'tunnel mode', 'SSL VPN', 'firewall', 'IDS', 'IPS', 'DMZ', 'NGFW'],
  examObjectives: ['5.5'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A VPN builds a private, encrypted tunnel across a public network such as the internet. A site-to-site VPN joins two offices, so users in both behave as if they were on one network. A remote-access VPN lets one laptop connect securely to the office from anywhere.',
        'IPsec is the standard toolkit for network-layer VPNs. It encrypts the data, checks that it has not been altered, proves who is on the other end and rejects replayed packets. Around the VPN, firewalls and intrusion prevention systems control and inspect traffic at the edge.',
      ],
      taglish: [
        'Ang **VPN** ay **gumagawa ng pribado at naka-encrypt na tunnel sa pampublikong network** tulad ng internet. Ang **site-to-site VPN** ay **nag-uugnay ng dalawang opisina**, kaya **parang iisang network** ang dalawa. Ang **remote-access VPN** ay **nagpapahintulot sa isang laptop na ligtas na kumonekta sa opisina mula sa kahit saan**.',
        'Ang **IPsec** ang **karaniwang toolkit** para sa VPN sa network layer. **Ine-encrypt nito ang data** (**confidentiality**), **tinitiyak na hindi binago** (**integrity**), **pinatutunayan kung sino ang kausap** (**authentication**), at **tinatanggihan ang mga nire-replay na packet** (**anti-replay**).',
        'Sa gilid ng network: ang **firewall** ay **nagpapasya kung ano ang pasok at labas** ayon sa patakaran; ang **IPS** ay **sinusuri ang laman ng trapiko** at **humaharang ng mga atake** nang inline; ang **IDS** ay **nakikinig at nag-aalerto lang**.',
        'Dalawang uri ng remote VPN: **IPsec** (kailangan ng client software) at **SSL/TLS VPN** (karaniwang browser o light client).',
      ],
      technical: [
        'A VPN extends a private network across an untrusted one using tunnelling and encryption. Site-to-site VPNs connect fixed gateways (routers, firewalls) and are transparent to hosts; remote-access VPNs authenticate an individual user and device with a client and assign a virtual address. GRE can tunnel multicast/routing but has no encryption; GRE over IPsec combines them, and DMVPN/FlexVPN scale hub-and-spoke designs.',
        'IPsec provides confidentiality (encryption such as AES), integrity (hashing such as SHA via HMAC), origin authentication (pre-shared keys or certificates) and anti-replay. Protocols: ESP (IP protocol 50) provides encryption and integrity; AH (protocol 51) provides integrity and authentication only, without encryption. Tunnel mode encrypts the entire original packet and adds a new IP header (typical for site-to-site); transport mode encrypts only the payload (host-to-host).',
        'IPsec operation: IKE phase 1 authenticates the peers and builds a secure management channel (IKE SA, UDP 500, or 4500 with NAT-T); phase 2 negotiates the IPsec SAs that protect the data (ESP). Interesting traffic defined by an ACL or policy triggers the tunnel. Both peers must agree on parameters: encryption, hash, Diffie-Hellman group, authentication and lifetime.',
        'SSL/TLS VPNs use HTTPS (TCP 443) and can offer clientless access to web applications or a full-tunnel client (such as AnyConnect). They traverse firewalls easily and need less client management than IPsec, which operates at Layer 3 and supports all IP traffic.',
        'Security architecture: a firewall enforces policy between zones (inside, outside, DMZ); a next-generation firewall (NGFW) adds application awareness, user identity and IPS. An IDS passively copies and analyses traffic and alerts; an IPS sits inline and can drop malicious packets. A DMZ hosts public servers separately from the internal network. Defence in depth combines these with ACLs, segmentation, AAA and monitoring.',
      ],
    },
    {
      type: 'analogy',
      title: 'Selyadong daanan sa kalsada',
      body: [
        'Imagine a private armoured tunnel built under a busy public highway between two offices. Cars (packets) inside cannot be seen or tampered with by traffic above. A site-to-site VPN is a permanent tunnel between two buildings; a remote-access VPN is a drawbridge opened for one authorised visitor at a time. The firewall is the gate guard and the IPS is the inspector who opens the boot.',
      ],
      taglish: [
        'Isipin ang **pribadong tunnel na may baluti sa ilalim ng abalang pampublikong highway** sa pagitan ng dalawang opisina. Ang mga **sasakyan (packets) sa loob ay hindi nakikita o nagagalaw ng trapiko sa itaas**. Ang **site-to-site VPN** ay **permanenteng tunnel sa pagitan ng dalawang gusali**; ang **remote-access VPN** ay **tulay na binubuksan para sa isang awtorisadong bisita**. Ang **firewall** ay **guwardiya sa tarangkahan**; ang **IPS** ay **inspektor na binubuksan ang kotse para tingnan ang laman**.',
      ],
    },
    {
      type: 'hook',
      title: 'CIAA ng IPsec at ang 3 bantay',
      trick: '**IPsec** = **C**onfidentiality, **I**ntegrity, **A**uthentication, **A**nti-replay. **Firewall** = patakaran, **IPS** = harang (inline), **IDS** = alerto lang.',
      taglish: [
        '**IPsec CIAA**: **C**onfidentiality (encrypt), **I**ntegrity (hash), **A**uthentication (sino), **A**nti-replay.',
        '**ESP** = encrypt + integrity (**protocol 50**). **AH** = integrity lang, **walang encryption**. **Tunnel mode** = buong packet naka-encrypt (site-to-site).',
        '**Site-to-site** = dalawang gateway; **remote-access** = isang user na may client.',
        '**Firewall** = patakaran; **IPS** = inline at humaharang; **IDS** = nakikinig at nag-aalerto lang.',
      ],
      test: {
        question: 'Alin ang may encryption: AH o ESP? At alin ang nasa inline at kayang humarang ng atake: IDS o IPS?',
        answer: 'ESP ang may encryption (AH ay integrity at authentication lang). IPS ang inline at kayang humarang; IDS ay nakikinig at nag-aalerto lang.',
      },
    },
    { type: 'diagram', id: 'vpn-site-remote', caption: 'Site-to-site VPN sa pagitan ng dalawang router at remote-access VPN para sa isang laptop; firewall at IPS sa gilid.' },
    {
      type: 'terms',
      items: [
        { term: 'VPN', definition: 'A private, encrypted tunnel across an untrusted network such as the internet.' },
        { term: 'Site-to-site VPN', definition: 'A permanent tunnel between two gateways that joins two networks.' },
        { term: 'Remote-access VPN', definition: 'A tunnel from one user\'s device to the corporate network, usually with a client.' },
        { term: 'IPsec', definition: 'A suite providing confidentiality, integrity, authentication and anti-replay at Layer 3.' },
        { term: 'ESP / AH', definition: 'ESP encrypts and authenticates (protocol 50); AH authenticates only (protocol 51).' },
        { term: 'IKE', definition: 'Internet Key Exchange: authenticates peers and negotiates the IPsec parameters.' },
        { term: 'Firewall', definition: 'A device that permits or denies traffic between zones according to policy.' },
        { term: 'IDS / IPS', definition: 'IDS detects and alerts; IPS sits inline and can block malicious traffic.' },
        { term: 'DMZ', definition: 'A separate zone for public-facing servers, isolated from the inside network.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: pagbuo ng site-to-site IPsec tunnel',
      steps: [
        'May trapiko mula sa LAN ng Manila papunta sa LAN ng Cebu na tugma sa "interesting traffic" ACL.',
        'Sinisimulan ng R1 ang IKE phase 1 sa R2 (UDP 500) at pinapatunayan ang isa’t isa gamit ang pre-shared key o certificate.',
        'Nagkasundo sila sa encryption, hash at Diffie-Hellman group, at nabuo ang secure na IKE channel.',
        'Sa IKE phase 2, ipinag-uusapan nila ang IPsec SAs (karaniwang ESP sa tunnel mode).',
        'Ang trapiko ng LAN ay ine-encrypt at binabalot sa bagong IP header at ipinapadala sa internet.',
        'Dina-decrypt ng R2 ang packet at ipinapasa sa Cebu LAN; hindi nababasa ng sinuman sa gitna.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **ESP ang nag-e-encrypt**; ang **AH ay hindi** (integrity at authentication lang). At ang **IDS ay hindi humaharang** — **IPS lang** ang inline na kayang mag-drop ng packet.' },
    { type: 'callout', kind: 'trap', text: 'Ang **site-to-site VPN ay transparent sa mga host** (gateway ang gumagawa ng tunnel); ang **remote-access VPN ay gumagamit ng client** sa device ng user. Huwag ibaliktad.' },
    { type: 'callout', kind: 'tip', text: 'Ang **firewall na may application awareness at IPS ay tinatawag na NGFW** (next-generation firewall). Ang **DMZ** ang tamang lugar para sa **public web server**, hindi sa loob ng LAN.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagpalit ng AH at ESP (alin ang may encryption).',
        'Pag-iisip na hinaharang ng IDS ang atake.',
        'Paglalagay ng public server sa internal LAN sa halip na DMZ.',
        'Pagkalito sa site-to-site at remote-access VPN.',
        'Pag-aakalang sapat na ang VPN kahit walang firewall.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Hindi bumubukas ang site-to-site tunnel"',
      scenario: 'A new IPsec tunnel between R1 and R2 never comes up. Phase 1 fails at the negotiation step.',
      evidence: `R1# show crypto isakmp sa
dst             src             state          conn-id status
203.0.113.2     203.0.113.1     MM_NO_STATE       0 ACTIVE (deleted)
R1# debug crypto isakmp
ISAKMP: (0): no offers accepted!
ISAKMP: (0): phase 1 SA policy not acceptable`,
      question: 'Ano ang karaniwang dahilan ng "no offers accepted"?',
      answer: 'Hindi magkatugma ang phase 1 policy ng dalawang peer: magkaibang encryption, hash, Diffie-Hellman group, authentication method o lifetime. Dapat magkapareho ang mga parameter sa magkabilang dulo.',
      fix: 'Ihambing ang crypto isakmp policy (o IKEv2 proposal) sa R1 at R2 at itugma ang encryption, hash, DH group at authentication; tiyakin ding magkapareho ang pre-shared key. Pagkatapos ay i-trigger ang interesting traffic at i-verify gamit ang show crypto isakmp sa at show crypto ipsec sa.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang kompanya ay may tatlong sangay na dapat laging konektado, at 200 empleyadong nagtatrabaho mula sa bahay. Anong uri ng VPN ang gagamitin para sa bawat isa, at saan ilalagay ang public web server?',
      answer: 'Site-to-site IPsec VPN sa pagitan ng mga gateway ng sangay (permanente at transparent sa host). Remote-access VPN (IPsec o SSL/TLS) na may client para sa mga empleyado sa bahay. Ang public web server ay sa DMZ, na pinoprotektahan ng firewall at IPS.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'IPsec provides confidentiality, integrity, authentication and anti-replay.',
        'ESP encrypts (protocol 50); AH does not (protocol 51). Tunnel mode encrypts the whole original packet.',
        'Site-to-site joins networks via gateways; remote-access connects a user with a client.',
        'IDS passively alerts; IPS is inline and blocks; NGFW adds application awareness and IPS.',
        'Put public servers in a DMZ; layer firewalls, IPS, ACLs and AAA.',
      ],
    },
    {
      type: 'summary',
      points: [
        'VPNs create encrypted tunnels across untrusted networks.',
        'IPsec offers confidentiality, integrity, authentication and anti-replay via ESP/AH and IKE.',
        'Site-to-site VPNs join networks; remote-access VPNs connect users.',
        'Firewalls control, IDS alerts, IPS blocks inline; use a DMZ for public servers.',
        'Susunod sa roadmap: Automation at programmability.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.5', difficulty: 'easy', type: 'single',
    prompt: 'Which VPN type connects two offices permanently through their gateways?',
    choices: ['Remote-access VPN', 'Site-to-site VPN', 'Clientless SSL VPN', 'Dial-up'], correct: [1],
    explanation: 'A site-to-site VPN joins two networks via gateway devices.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.5', difficulty: 'easy', type: 'single',
    prompt: 'Which IPsec protocol provides encryption?',
    choices: ['AH', 'ESP', 'GRE', 'IKE'], correct: [1],
    explanation: 'ESP provides confidentiality and integrity; AH provides integrity and authentication only.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.5', difficulty: 'medium', type: 'single',
    prompt: 'What is the role of IKE in IPsec?',
    choices: ['Encrypting the payload', 'Authenticating peers and negotiating security parameters', 'Filtering traffic', 'Assigning IP addresses'], correct: [1],
    explanation: 'IKE authenticates the peers and negotiates the keys and parameters for the IPsec tunnel.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.5', difficulty: 'medium', type: 'single',
    prompt: 'Which statement describes IPsec tunnel mode?',
    choices: ['Only the payload is encrypted', 'The entire original IP packet is encrypted and a new IP header is added', 'No encryption is used', 'It is used only for wireless'], correct: [1],
    explanation: 'Tunnel mode encrypts the whole original packet and adds a new header, typical for site-to-site VPNs.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.5', difficulty: 'medium', type: 'single',
    prompt: 'What is the main difference between an IDS and an IPS?',
    choices: ['An IPS is inline and can block traffic; an IDS only detects and alerts', 'An IDS encrypts traffic', 'They are the same', 'An IPS only works on wireless'], correct: [0],
    explanation: 'An IPS sits inline and can drop malicious packets; an IDS observes and alerts.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.5', difficulty: 'medium', type: 'single',
    prompt: 'Where should a public web server be placed?',
    choices: ['Inside the internal LAN', 'In a DMZ', 'On the management VLAN', 'Directly on the internet with no protection'], correct: [1],
    explanation: 'A DMZ isolates public-facing servers from the internal network.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.5', difficulty: 'hard', type: 'single',
    prompt: 'Which feature of IPsec protects against an attacker capturing and resending packets?',
    choices: ['Encryption', 'Anti-replay protection', 'Tunnel mode', 'GRE'], correct: [1],
    explanation: 'Sequence numbers provide anti-replay protection.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.5', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are goals of IPsec?',
    choices: ['Confidentiality', 'Faster routing', 'Data integrity', 'Address translation'], correct: [0, 2],
    explanation: 'IPsec provides confidentiality, integrity, authentication and anti-replay.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D5', objective: '5.5', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a remote-access VPN usually requires client software or a browser on the user device.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — the user device builds the tunnel using a VPN client or browser (SSL/TLS).',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: paano tandaan ang IPsec at mga bantay?', back: 'IPsec CIAA: Confidentiality, Integrity, Authentication, Anti-replay. ESP encrypt (protocol 50); AH hindi. Firewall = patakaran, IPS = inline harang, IDS = alerto lang.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Site-to-site vs remote-access VPN?', back: 'Site-to-site joins two networks via gateways (transparent). Remote-access connects one user device with a client.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'ESP vs AH?', back: 'ESP: encryption + integrity (protocol 50). AH: integrity + authentication only (protocol 51).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'concept', front: 'IKE phases?', back: 'Phase 1 authenticates peers and builds a secure channel; phase 2 negotiates the IPsec SAs.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Firewall vs IDS vs IPS?', back: 'Firewall enforces policy; IDS detects and alerts; IPS is inline and blocks. NGFW adds application awareness and IPS.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What is a DMZ?', back: 'A separate zone for public-facing servers, isolated from the internal network.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Design a secure network for a small company on paper',
  tool: 'Paper',
  minutes: 30,
  objective: 'Draw a network with two sites, remote workers and a public web server, and place VPNs, a firewall, a DMZ and an IPS.',
  steps: [
    'Draw Head Office, a Branch, the internet cloud and a remote worker laptop.',
    'Connect Head Office and the Branch with a site-to-site IPsec VPN and label ESP tunnel mode.',
    'Connect the remote worker to Head Office with a remote-access VPN.',
    'Place a firewall at the Head Office edge with inside, outside and DMZ zones.',
    'Put the public web server in the DMZ and add an IPS inline behind the firewall.',
    'Write one control for each CIA goal and list which device provides it.',
  ],
  checklist: [
    'Both VPN types drawn and labelled',
    'Public server in the DMZ',
    'Firewall and IPS positioned correctly',
    'Each CIA goal has a control',
  ],
  hints: [
    'The DMZ is a third firewall zone, not part of the inside LAN.',
    'Place the IPS inline in the path, not on a monitor port, if it should block.',
  ],
  solution: [
    'Site-to-site tunnel between the two edge gateways; remote-access client to the head office gateway.',
    'Confidentiality: IPsec encryption; integrity: IPsec hashing; availability: redundant links and the firewall/IPS.',
  ],
};
