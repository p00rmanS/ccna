import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'common-threats';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.2',
  domain: 'D5',
  title: 'Common Threats: Malware, Phishing, MITM, DoS and Spoofing',
  description: 'The attacks you are expected to recognise on the CCNA, what each one does and the control that stops it.',
  whyMatters:
    'Halos lahat ng exam question sa seguridad ay nagbibigay ng scenario ("may nagpadala ng pekeng email", "binaha ang server ng traffic") at hinihingi kung anong uri ng atake ito. Kapag kilala mo ang mga pangalan at ang katangian, madali ang sagot — at alam mo rin kung anong depensa ang itutugma.',
  objectives: [
    'Describe malware types: virus, worm, trojan, ransomware and spyware',
    'Explain phishing, spear phishing and other social engineering',
    'Describe man-in-the-middle, spoofing and reconnaissance attacks',
    'Distinguish DoS from DDoS and describe amplification',
    'Match each threat to a typical mitigation',
  ],
  estimatedMinutes: 35,
  difficulty: 'beginner',
  keywords: ['malware', 'virus', 'worm', 'trojan', 'ransomware', 'phishing', 'spoofing', 'man-in-the-middle', 'DoS', 'DDoS', 'social engineering', 'reconnaissance', 'brute force'],
  examObjectives: ['5.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Attackers use a small set of familiar techniques. Malware is harmful software. Social engineering tricks people instead of machines. Spoofing pretends to be someone else. A man-in-the-middle secretly sits between two parties. Denial of service floods a target so real users cannot get in.',
        'Each attack has a standard defence: updates and antivirus for malware, training for phishing, encryption and authentication against eavesdropping, and filtering or rate limiting against floods.',
      ],
      taglish: [
        'Ilang kilalang **teknik** lang ang ginagamit ng mga attacker. Ang **malware** ay **mapaminsalang software**. Ang **social engineering** ay **niloloko ang tao**, hindi ang makina. Ang **spoofing** ay **nagpapanggap na iba**. Ang **man-in-the-middle** ay **palihim na nasa gitna** ng dalawang nag-uusap. Ang **DoS** ay **binabaha ang target** para hindi makapasok ang tunay na user.',
        'Mga uri ng malware: **virus** (kumakapit sa file at nangangailangan ng user), **worm** (**kumakalat nang mag-isa** sa network), **trojan** (**nagpapanggap na kapaki-pakinabang**), **ransomware** (**ine-encrypt ang data at humihingi ng bayad**), **spyware** (**nagmamanman**).',
        'Ang **phishing** ay **pekeng email/mensahe** para nakawin ang credentials; ang **spear phishing** ay **nakatutok sa isang tao o grupo**. Ang **DDoS** ay DoS na **galing sa maraming sirang device** (botnet).',
        'Bawat atake ay may **karaniwang depensa**: **update + antivirus** (malware), **training** (phishing), **encryption/authentication** (MITM), **filtering/rate limiting** (DoS).',
      ],
      technical: [
        'Malware: a virus attaches to a host file and needs user action to spread; a worm self-replicates across networks by exploiting vulnerabilities; a trojan masquerades as legitimate software; ransomware encrypts data and demands payment; spyware and keyloggers collect information covertly; a rootkit hides its presence; a botnet is a group of compromised hosts under remote control.',
        'Social engineering exploits human trust: phishing (email), spear phishing (targeted), whaling (executives), vishing (voice), smishing (SMS), pretexting, baiting and tailgating (following someone through a secured door).',
        'Spoofing forges an identity: IP spoofing, MAC spoofing, ARP spoofing/poisoning and DHCP spoofing (rogue server). A man-in-the-middle (MITM) intercepts or alters traffic between two parties, often through ARP poisoning, a rogue access point (evil twin) or a compromised router.',
        'DoS makes a service unavailable by exhausting bandwidth, connection tables or CPU (for example a SYN flood). DDoS uses many sources, often a botnet. Amplification and reflection use third-party servers (such as DNS or NTP) to multiply attack traffic toward a spoofed victim address.',
        'Reconnaissance gathers information before an attack: ping sweeps, port scans, DNS lookups and packet sniffing. Password attacks include brute force, dictionary attacks and credential stuffing. Mitigations: patching, endpoint protection, MFA, security training, ACLs and firewalls, port security, DHCP snooping, DAI, encryption (TLS/IPsec), rate limiting and DDoS scrubbing.',
      ],
    },
    {
      type: 'analogy',
      title: 'Magnanakaw sa palengke',
      body: [
        'A pickpocket in the market uses different tricks: a fake "free gift" (phishing), a friend who suddenly asks for your wallet (spoofing), someone who stands between you and the seller and rewrites the price (man-in-the-middle), and a crowd that blocks the shop door so real customers cannot enter (DoS).',
      ],
      taglish: [
        'Sa **palengke**, iba-iba ang **panlilinlang ng magnanakaw**: **pekeng "libreng regalo"** (phishing), **kunwaring kaibigan** na humihingi ng pitaka mo (spoofing), **taong nakatayo sa gitna ninyo ng tindera** at **binabago ang presyo** (man-in-the-middle), at **maraming taong humaharang sa pinto ng tindahan** para hindi makapasok ang tunay na mamimili (DoS).',
      ],
    },
    {
      type: 'hook',
      title: 'VWTRS: Virus, Worm, Trojan, Ransomware, Spyware',
      trick: '**Worm** = **kumakalat mag-isa**. **Trojan** = **nagpapanggap**. **Ransomware** = **hostage ang data**. **DDoS** = **maraming pinagmulan**.',
      taglish: [
        '**Virus** = **kailangan ng user** para kumalat (kumakapit sa file).',
        '**Worm** = **mag-isang kumakalat** sa network. **Trojan** = **nagpapanggap** na maganda. **Ransomware** = **ine-encrypt ang data, may hinihinging bayad**. **Spyware** = **nagmamanman**.',
        '**Phishing** = pekeng mensahe; **spear phishing** = nakatutok sa isang tao.',
        '**DoS** = isang pinagmulan; **DDoS** = **maraming pinagmulan (botnet)**.',
      ],
      test: {
        question: 'Isang malware ang kusang kumalat sa buong network nang walang kinakailangang gawin ang user. Anong uri ito, at paano naiiba sa virus?',
        answer: 'Worm. Ang virus ay kumakapit sa file at kailangan ng aksyon ng user para kumalat; ang worm ay nag-uulit at kumakalat mag-isa sa pamamagitan ng network vulnerabilities.',
      },
    },
    { type: 'diagram', id: 'threat-map', caption: 'Mapa ng mga banta at ang karaniwang depensa laban sa bawat isa.' },
    {
      type: 'terms',
      items: [
        { term: 'Virus / Worm', definition: 'Virus needs a host file and user action; a worm spreads by itself across networks.' },
        { term: 'Trojan', definition: 'Malicious software disguised as something useful.' },
        { term: 'Ransomware', definition: 'Malware that encrypts data and demands payment for the key.' },
        { term: 'Phishing', definition: 'A fraudulent message that tricks the victim into revealing credentials or running malware.' },
        { term: 'Spoofing', definition: 'Forging an address or identity (IP, MAC, ARP, DHCP) to impersonate another device.' },
        { term: 'Man-in-the-middle', definition: 'An attacker secretly intercepts and possibly alters communication between two parties.' },
        { term: 'DoS / DDoS', definition: 'Attacks that make a service unavailable by overload; DDoS uses many sources.' },
        { term: 'Reconnaissance', definition: 'Gathering information about a target before attacking: scans, sweeps, lookups.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: isang phishing na humantong sa ransomware',
      steps: [
        'Natanggap ng empleyado ang email na mukhang galing sa HR na may attachment na "Payroll.xlsm".',
        'Binuksan niya ang attachment at pinagana ang macro (social engineering).',
        'Nag-download ang macro ng trojan na nagbigay ng remote access sa attacker.',
        'Nag-scan ang attacker sa network (reconnaissance) at kumalat sa mga file server.',
        'Ine-encrypt ng ransomware ang mga file at lumabas ang hinihinging bayad.',
        'Ang mitigation: training, email filtering, endpoint protection, segmentation at offline backup.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **worm ay kumakalat mag-isa**; ang **virus ay nangangailangan ng user**. Ang **trojan ay hindi nag-uulit** — nagpapanggap lang. Madalas itong pagpalitin sa exam.' },
    { type: 'callout', kind: 'trap', text: 'Ang **DDoS ay maraming pinagmulan**; ang **DoS ay isa**. At ang **spoofing ay pagpapanggap**, samantalang ang **MITM ay pakikinig/pagbabago sa gitna** — magkaiba ang dalawa kahit madalas magkasama.' },
    { type: 'callout', kind: 'tip', text: 'Ang **pinakamabisang depensa sa phishing** ay **training at MFA** — dahil **tao ang target**, hindi makina. Ang **backup na hindi nakakonekta sa network** ang sagot sa **ransomware**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagpapalit ng virus at worm.',
        'Pag-aakalang sapat ang antivirus laban sa phishing.',
        'Pagturing sa DDoS bilang isang pinagmulan lang.',
        'Pag-iwan ng backup na nakakonekta sa network na kayang i-encrypt ng ransomware.',
        'Hindi pagtuturo sa mga empleyado kung paano makikilala ang pekeng email.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Pag-aralan: "Anong atake ito?"',
      scenario: 'A company web server suddenly becomes unreachable. Monitoring shows 800,000 SYN packets per second from thousands of different addresses, and the server runs out of connection table space.',
      evidence: `Server# show tcp statistics
  Half-open connections: 65,535 (table full)
  Sources: 14,203 unique IP addresses
  Legitimate users: unable to connect`,
      question: 'Anong uri ng atake ito at ano ang mga posibleng depensa?',
      answer: 'DDoS (SYN flood): maraming pinagmulan at inuubos ang connection table. Ang availability ang naapektuhan.',
      fix: 'I-enable ang SYN cookies o rate limiting, gumamit ng upstream DDoS scrubbing service o ISP filtering, at ilagay ang server sa likod ng firewall/load balancer na kayang humawak ng malaking connection count.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Nagtayo ang attacker ng pekeng Wi-Fi na may parehong pangalan ng coffee shop at nakikita niya ang lahat ng traffic. Anong dalawang atake ang pinagsama rito, at ano ang depensa ng user?',
      answer: 'Evil twin (rogue access point) na nagbibigay-daan sa man-in-the-middle, at spoofing ng SSID. Ang depensa ng user ay gumamit ng VPN o HTTPS lang at iwasan ang hindi kilalang Wi-Fi; ang depensa ng network ay WPA3/enterprise authentication at pagtuklas ng rogue AP.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Worm spreads by itself; virus needs a host and user action; trojan is disguised.',
        'Ransomware encrypts data for payment; spyware and keyloggers collect information.',
        'Phishing targets people; spear phishing targets specific people.',
        'MITM intercepts or alters; spoofing impersonates; DoS floods; DDoS uses many sources.',
        'Match threat to control: updates/AV, training/MFA, encryption, rate limiting.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Know the malware types and which ones spread by themselves.',
        'Social engineering attacks people; phishing is the most common form.',
        'Spoofing impersonates and MITM intercepts; DoS and DDoS attack availability.',
        'Each threat has a standard mitigation; layer them together.',
        'Susunod: Device hardening — pagpapatibay ng sarili mong router at switch.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'easy', type: 'single',
    prompt: 'Which malware spreads across a network by itself without user action?',
    choices: ['Virus', 'Worm', 'Trojan', 'Spyware'], correct: [1],
    explanation: 'A worm self-replicates and spreads through network vulnerabilities.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'easy', type: 'single',
    prompt: 'Malware that encrypts files and demands payment is called?',
    choices: ['Spyware', 'Adware', 'Ransomware', 'A rootkit'], correct: [2],
    explanation: 'Ransomware locks data and demands a ransom for the decryption key.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'medium', type: 'single',
    prompt: 'An email appearing to come from IT asks users to log in at a fake page. What is this attack?',
    choices: ['DoS', 'Phishing', 'Port scanning', 'ARP poisoning'], correct: [1],
    explanation: 'A fraudulent message that tricks users into revealing credentials is phishing.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'medium', type: 'single',
    prompt: 'What is the difference between DoS and DDoS?',
    choices: ['DDoS uses many sources, DoS uses one', 'DoS is encrypted', 'DDoS only affects wireless', 'There is no difference'], correct: [0],
    explanation: 'A distributed DoS uses many compromised sources, often a botnet.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'medium', type: 'single',
    prompt: 'An attacker secretly sits between two hosts, reading and altering their traffic. What is this?',
    choices: ['Ransomware', 'Man-in-the-middle', 'Brute force', 'Tailgating'], correct: [1],
    explanation: 'A man-in-the-middle intercepts and may modify communication between two parties.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'medium', type: 'single',
    prompt: 'Following an employee through a secured door without a badge is called?',
    choices: ['Phishing', 'Tailgating', 'Spoofing', 'Sniffing'], correct: [1],
    explanation: 'Tailgating is a physical social-engineering technique.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'hard', type: 'single',
    prompt: 'Which is the best defence against a phishing attack?',
    choices: ['A larger bandwidth link', 'Security awareness training and MFA', 'More VLANs', 'A faster switch'], correct: [1],
    explanation: 'Phishing targets people, so training and multi-factor authentication are the strongest defences.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are forms of spoofing?',
    choices: ['ARP spoofing', 'SYN flood', 'MAC spoofing', 'Ransomware'], correct: [0, 2],
    explanation: 'ARP and MAC spoofing both forge an identity; a SYN flood is DoS and ransomware is malware.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a trojan replicates itself across the network like a worm.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — a trojan disguises itself as legitimate software and does not self-replicate.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: paano tandaan ang malware?', back: 'Virus = kailangan ng user. Worm = kumakalat mag-isa. Trojan = nagpapanggap. Ransomware = hostage ang data. DDoS = maraming pinagmulan.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Virus vs worm vs trojan?', back: 'Virus attaches to a file and needs user action; worm self-spreads; trojan is disguised and does not replicate.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Phishing vs spear phishing?', back: 'Phishing is a broad fraudulent message; spear phishing targets a specific person or group.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Spoofing vs MITM?', back: 'Spoofing impersonates an identity; MITM intercepts or alters traffic between two parties.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'concept', front: 'DoS vs DDoS?', back: 'Both exhaust a target to cause unavailability; DDoS uses many distributed sources (botnet).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Best defence against ransomware?', back: 'Offline/immutable backups, patching, endpoint protection, email filtering and segmentation.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Classify ten attack scenarios',
  tool: 'Paper',
  minutes: 20,
  objective: 'Read short scenarios, name the attack and choose the best mitigation.',
  steps: [
    'Write the numbers 1 to 8 down a page.',
    'For each scenario below, write the attack type: (1) a message "Your parcel is held, click here" to many users; (2) a program that copies itself to every host through an unpatched service; (3) a free game that installs a hidden remote tool; (4) thousands of bots flooding a website; (5) a rogue DHCP server handing out a false gateway; (6) a person following staff into the server room; (7) software that encrypts a file share and shows a payment note; (8) a fake access point named like the cafe Wi-Fi.',
    'For each, write one mitigation.',
    'Check your answers with the solution.',
  ],
  checklist: [
    'All eight scenarios named',
    'Each has a sensible mitigation',
    'You can explain the difference between virus and worm',
  ],
  hints: [
    'Ask: does it target people, identity, the middle of a conversation, or availability?',
    'Look for words like "copies itself" (worm) and "disguised" (trojan).',
  ],
  solution: [
    '1 phishing; 2 worm; 3 trojan; 4 DDoS; 5 DHCP spoofing (rogue server, man-in-the-middle); 6 tailgating; 7 ransomware; 8 evil twin MITM.',
    'Mitigations: training and MFA; patching and segmentation; application control; DDoS scrubbing; DHCP snooping; badge access and mantraps; offline backup; WPA3 and VPN.',
  ],
};
