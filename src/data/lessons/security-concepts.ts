import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'security-concepts';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.1',
  domain: 'D5',
  title: 'Security Concepts: Threats, Vulnerabilities, Exploits and Mitigation',
  description: 'The vocabulary of network security: what an asset is, how a threat uses a vulnerability through an exploit, and how mitigation reduces risk.',
  whyMatters:
    'Ang seguridad ay may sariling wika, at madalas na ang exam ay nagtatanong lang kung alam mo ang pagkakaiba ng threat, vulnerability, exploit at mitigation. Kapag malinaw ito sa iyo, mas madali nang intindihin ang lahat ng susunod na paksa — ACL, port security, AAA, VPN — dahil lahat sila ay paraan ng mitigation.',
  objectives: [
    'Define asset, threat, vulnerability, exploit and mitigation and tell them apart',
    'Explain the CIA triad: confidentiality, integrity and availability',
    'Describe risk as a combination of threat, vulnerability and impact',
    'Give examples of technical, administrative and physical controls',
    'Describe defence in depth and why one control is never enough',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['threat', 'vulnerability', 'exploit', 'mitigation', 'asset', 'risk', 'CIA triad', 'confidentiality', 'integrity', 'availability', 'defence in depth', 'zero-day'],
  examObjectives: ['5.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Security starts with four simple ideas. An asset is something worth protecting. A vulnerability is a weakness. A threat is something or someone that could take advantage of it. An exploit is the actual method used. Mitigation is what you do to reduce the danger.',
        'Good security protects three goals: keeping data private (confidentiality), keeping it correct (integrity) and keeping it available when needed (availability). No single tool does everything, so networks stack several layers of protection.',
      ],
      taglish: [
        'Apat na simpleng ideya ang simula ng seguridad: **asset** = **bagay na dapat protektahan** (data, server, device). **Vulnerability** = **kahinaan** (lumang software, mahinang password). **Threat** = **ang posibleng sumamantala** nito (hacker, malware). **Exploit** = **ang aktwal na paraan** ng pagsamantala. **Mitigation** = **ginagawa mo para mabawasan ang panganib**.',
        'Isipin ang **bahay**: ang **alahas** ay asset, ang **sirang kandado** ay vulnerability, ang **magnanakaw** ay threat, ang **pagbukas ng kandado gamit ang bakal** ay exploit, at ang **pagpapalit ng kandado** ay mitigation.',
        'Tatlong layunin ng seguridad — ang **CIA triad**: **Confidentiality** (**pribado** — ang awtorisado lang ang nakakakita), **Integrity** (**tama at hindi binago**), **Availability** (**available** kapag kailangan).',
        'Walang iisang tool na sumasagot sa lahat, kaya may **defence in depth**: **maraming patong** ng proteksyon — kung bumagsak ang isa, may susunod pa.',
      ],
      technical: [
        'Asset: anything of value to the organisation (data, systems, reputation). Vulnerability: a weakness in design, implementation or configuration. Threat: a potential cause of harm, from an actor (attacker, insider) or an event. Exploit: code or technique that takes advantage of a vulnerability. Mitigation (countermeasure): a control that reduces the likelihood or impact of an attack.',
        'Risk is the likelihood that a threat exploits a vulnerability multiplied by the impact on an asset. It can be mitigated, transferred (insurance), avoided or accepted. A zero-day is a vulnerability that is exploited before a fix exists.',
        'The CIA triad: confidentiality (prevent unauthorised disclosure, via encryption and access control), integrity (prevent unauthorised modification, via hashing and digital signatures) and availability (keep systems reachable, via redundancy, backups and DoS protection). Related goals include authentication, authorisation and non-repudiation.',
        'Controls are categorised as technical (firewalls, ACLs, encryption, IPS), administrative (policies, training, background checks) and physical (locks, badges, cameras, rack cages). They may be preventive, detective (logs, IDS) or corrective (patching, restoring from backup).',
        'Defence in depth layers controls so no single failure exposes assets: for example physical access control, network segmentation with VLANs and ACLs, device hardening, authentication, encryption and monitoring. The principle of least privilege gives users and devices only the access they need.',
      ],
    },
    {
      type: 'analogy',
      title: 'Bahay, kandado at magnanakaw',
      body: [
        'Your valuables are the assets. A weak lock is the vulnerability. A burglar is the threat. Picking that lock is the exploit. Fitting a strong lock, a camera and a dog are the mitigations, and you use all three together because any one can fail.',
      ],
      taglish: [
        'Ang **alahas mo** ang **asset**. Ang **mahinang kandado** ang **vulnerability**. Ang **magnanakaw** ang **threat**. Ang **pag-pick ng kandado** ang **exploit**. Ang **matibay na kandado, camera at aso** ang **mitigation** — at **sabay-sabay** mong ginagamit dahil **puwedeng pumalya ang isa**.',
      ],
    },
    {
      type: 'hook',
      title: 'AVTEM: Asset, Vulnerability, Threat, Exploit, Mitigation',
      trick: '**AVTEM**: **A**sset (kayamanan) → **V**ulnerability (butas) → **T**hreat (magnanakaw) → **E**xploit (pamamaraan) → **M**itigation (kandado). At **CIA** = Confidentiality, Integrity, Availability.',
      taglish: [
        '**A-V-T-E-M**: **A**sset (ano ang pinoprotektahan), **V**ulnerability (anong butas), **T**hreat (sino/ano ang puwedeng sumamantala), **E**xploit (paano), **M**itigation (ano ang gagawin).',
        '**CIA**: **C**onfidentiality = **pribado**, **I**ntegrity = **tama/hindi binago**, **A**vailability = **available**.',
        'Sa exam: **kahinaan = vulnerability**; **gumagamit ng kahinaan = exploit**; **posibleng umatake = threat**.',
        'At ang **defence in depth** ay **maraming layer**, hindi isang malaking pader.',
      ],
      test: {
        question: 'Isang lumang router ang may kilalang butas. May hacker na gumamit ng script para pasukin ito. Alin ang vulnerability, threat at exploit?',
        answer: 'Vulnerability = ang kilalang butas sa lumang router. Threat = ang hacker. Exploit = ang script na ginamit sa pagsamantala. Mitigation ay mag-update ng firmware.',
      },
    },
    { type: 'diagram', id: 'security-chain', caption: 'Ang threat ay gumagamit ng exploit sa isang vulnerability para maapektuhan ang asset; pinapababa ito ng mitigation.' },
    {
      type: 'terms',
      items: [
        { term: 'Asset', definition: 'Anything of value that must be protected: data, devices, services, reputation.' },
        { term: 'Vulnerability', definition: 'A weakness that could be used to cause harm, such as unpatched software or a weak password.' },
        { term: 'Threat', definition: 'A potential cause of harm: an attacker, malware, an insider or a natural event.' },
        { term: 'Exploit', definition: 'The code or technique that takes advantage of a vulnerability.' },
        { term: 'Mitigation', definition: 'An action or control that reduces risk, also called a countermeasure.' },
        { term: 'CIA triad', definition: 'Confidentiality, integrity and availability: the three core goals of security.' },
        { term: 'Defence in depth', definition: 'Layering several controls so that one failure does not expose the asset.' },
        { term: 'Zero-day', definition: 'A vulnerability exploited before the vendor has released a fix.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: mula butas hanggang depensa',
      steps: [
        'Ang opisina ay may file server (asset) na may mahalagang data ng mga customer.',
        'Natuklasang ang server ay hindi pa na-patch at may kilalang butas (vulnerability).',
        'May attacker (threat) na nakakita ng publikong exploit para sa butas na iyon.',
        'Ginamit ng attacker ang exploit at nakapasok sa server — nasira ang confidentiality.',
        'Ina-apply ng admin ang mitigation: patch, firewall rule at monitoring.',
        'Dahil may defence in depth, kahit may isang layer na bumagsak, napigilan pa rin ang pinakamalaking pinsala.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **vulnerability ay kahinaan**, ang **exploit ay ang paraan ng pagsamantala**, at ang **threat ay ang posibleng sumamantala**. Madalas na pinagpapalit ang tatlong ito sa exam.' },
    { type: 'callout', kind: 'trap', text: 'Ang **encryption** ay para sa **confidentiality**; ang **hashing/digital signature** ay para sa **integrity**; ang **redundancy/backup** ay para sa **availability**. Huwag ihalo.' },
    { type: 'callout', kind: 'tip', text: 'Kapag tinanong ang **"anong control ang nakatuon sa tao at proseso"**, ang sagot ay **administrative** (policy, training). **Technical** = firewall/ACL/encryption. **Physical** = kandado/camera.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagpapalit ng threat at vulnerability.',
        'Pag-aakalang ang isang firewall ay sapat na seguridad.',
        'Pagkalimot sa physical at administrative controls.',
        'Pagturing sa availability na hindi parte ng seguridad.',
        'Pagbibigay ng sobrang access sa user (labag sa least privilege).',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Pag-aralan: "Ano ang nagkamali sa insidenteng ito?"',
      scenario: 'A branch router still used the default password "cisco". An attacker scanned the internet, found it, logged in over Telnet and changed the routing. Users lost connectivity for two hours.',
      question: 'Tukuyin ang vulnerability, threat, exploit, apektadong CIA goal at mga mitigation.',
      answer: 'Vulnerability: default password at Telnet na naka-enable. Threat: ang attacker. Exploit: ang pag-login gamit ang default credentials. Apektado: availability (nawalan ng koneksyon) at integrity (binago ang routing).',
      fix: 'Palitan ang password ng malakas at gumamit ng enable secret, i-disable ang Telnet at gamitin ang SSH, limitahan ang access gamit ang ACL sa VTY, at mag-monitor gamit ang syslog. Ang mga ito ay layer ng defence in depth.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Para sa bawat isa, sabihin kung confidentiality, integrity o availability ang pangunahing layunin: (a) VPN encryption, (b) digital signature sa software update, (c) dalawang ISP link.',
      answer: '(a) Confidentiality — itinatago ng encryption ang data. (b) Integrity — nagpapatunay na hindi binago ang update. (c) Availability — kapag bumagsak ang isang ISP, may isa pa.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Vulnerability = weakness; threat = potential attacker or event; exploit = the method; mitigation = the fix or control.',
        'CIA: confidentiality (encryption), integrity (hashing, signatures), availability (redundancy).',
        'Risk = likelihood of a threat exploiting a vulnerability × impact.',
        'Controls: technical, administrative and physical.',
        'Defence in depth means layered controls; least privilege means minimum access.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Assets are protected from threats that exploit vulnerabilities, using mitigation.',
        'The CIA triad is the goal: confidentiality, integrity and availability.',
        'Use technical, administrative and physical controls together (defence in depth).',
        'Least privilege limits damage when something goes wrong.',
        'Susunod: Common threats — malware, phishing, MITM, DoS at spoofing.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'easy', type: 'single',
    prompt: 'What is a vulnerability?',
    choices: ['An attacker', 'A weakness that could be exploited', 'A firewall rule', 'A backup copy'], correct: [1],
    explanation: 'A vulnerability is a weakness in a system, such as unpatched software or a weak password.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'easy', type: 'single',
    prompt: 'Which term describes the code or technique used to take advantage of a vulnerability?',
    choices: ['Threat', 'Asset', 'Exploit', 'Mitigation'], correct: [2],
    explanation: 'An exploit is the method that takes advantage of a vulnerability.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'medium', type: 'single',
    prompt: 'Which CIA goal does encryption mainly support?',
    choices: ['Availability', 'Integrity', 'Confidentiality', 'Accountability'], correct: [2],
    explanation: 'Encryption keeps data private from people who are not authorised to read it.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'medium', type: 'single',
    prompt: 'A hash and digital signature are used to show that a file has not been altered. Which goal is this?',
    choices: ['Confidentiality', 'Integrity', 'Availability', 'Authorisation'], correct: [1],
    explanation: 'Detecting unauthorised modification is integrity.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'medium', type: 'single',
    prompt: 'Which is an example of an administrative control?',
    choices: ['A door lock', 'A firewall', 'A security awareness training policy', 'An IPS'], correct: [2],
    explanation: 'Policies and training are administrative controls; locks are physical and firewalls/IPS are technical.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'hard', type: 'single',
    prompt: 'What does defence in depth mean?',
    choices: ['Using one very strong firewall', 'Using multiple layers of controls so one failure does not expose the asset', 'Encrypting everything', 'Hiding the network from the internet'], correct: [1],
    explanation: 'Defence in depth layers controls so no single point of failure exposes the asset.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are parts of the CIA triad?',
    choices: ['Confidentiality', 'Authentication', 'Availability', 'Accounting'], correct: [0, 2],
    explanation: 'The triad is confidentiality, integrity and availability.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a zero-day is a vulnerability that is exploited before a fix is available.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — the vendor has had zero days to produce a patch.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: paano tandaan ang security terms?', back: 'AVTEM: Asset, Vulnerability (butas), Threat (sino), Exploit (paano), Mitigation (ayos). CIA = Confidentiality, Integrity, Availability. Defence in depth = maraming layer.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Threat vs vulnerability vs exploit?', back: 'Threat: potential cause of harm. Vulnerability: the weakness. Exploit: the method that uses the weakness.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What is mitigation?', back: 'A control or action that reduces the likelihood or impact of an attack (a countermeasure).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'concept', front: 'The CIA triad?', back: 'Confidentiality (private), integrity (unchanged), availability (reachable when needed).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Three control categories?', back: 'Technical (firewall, ACL), administrative (policy, training), physical (locks, cameras).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What is a zero-day?', back: 'A vulnerability exploited before the vendor has a patch.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Map a home network to threats, vulnerabilities and controls',
  tool: 'Paper',
  minutes: 25,
  objective: 'Identify assets, vulnerabilities, threats and mitigations for a small network and classify each control.',
  steps: [
    'List five assets on your home or office network (for example laptop, router, NAS, photos, accounts).',
    'For each asset write one realistic vulnerability (for example default router password, no updates).',
    'Write the threat and the exploit that could use that vulnerability.',
    'Write a mitigation for each and mark it technical, administrative or physical.',
    'Mark which CIA goal each asset most needs.',
    'Circle the two assets where you only have one layer of protection and add a second layer.',
  ],
  checklist: [
    'Five assets listed with vulnerabilities',
    'Every row has a threat, exploit and mitigation',
    'Each control is classified',
    'You added a second layer for two assets',
  ],
  hints: [
    'Start with the router: it protects everything else.',
    'A password manager and an update schedule are cheap, strong mitigations.',
  ],
  solution: [
    'Example: asset router, vulnerability default password, threat remote attacker, exploit login with defaults, mitigation strong password (technical).',
    'Example: asset photos, need availability, mitigation backup to a second location.',
  ],
};
