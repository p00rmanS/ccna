import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'wireless-security';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.14',
  domain: 'D2',
  title: 'Wireless Security: WPA2, WPA3, PSK and 802.1X',
  description: 'How Wi-Fi is protected: open networks, WEP, WPA, WPA2 and WPA3, personal (PSK) versus enterprise (802.1X with RADIUS), and common wireless threats.',
  whyMatters:
    'Ang radyo ay naririnig ng sinumang nasa abot nito — kaya ang Wi-Fi ay kailangang naka-encrypt at may authentication. Sa exam, tinatanong ang pagkakaiba ng WPA, WPA2 at WPA3, ang PSK laban sa enterprise, at kung aling encryption ang ginagamit (AES-CCMP, GCMP). Sa totoong buhay, ito rin ang pinakamadalas na butas ng mga bahay at opisina.',
  objectives: [
    'Explain why wireless needs authentication and encryption',
    'Compare open, WEP, WPA, WPA2 and WPA3 and their encryption',
    'Distinguish personal (PSK) from enterprise (802.1X with RADIUS) authentication',
    'Describe common wireless threats: rogue AP, evil twin, deauthentication and eavesdropping',
    'Recommend a secure configuration for a home and for a company',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['WPA2', 'WPA3', 'WEP', 'PSK', 'WPA2-Enterprise', '802.1X', 'RADIUS', 'AES', 'CCMP', 'SAE', 'rogue AP', 'evil twin', 'TKIP', 'EAP', 'PMF'],
  examObjectives: ['5.9'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Radio signals can be heard by anyone nearby, so Wi-Fi needs two protections: authentication (who may join) and encryption (nobody can read the traffic). Early methods were weak. Today the standards are WPA2 and the newer WPA3, both using strong AES encryption.',
        'There are two ways to authenticate. Personal mode uses one shared password (PSK) for everybody, suitable for homes. Enterprise mode makes each user log in with their own credentials checked by a RADIUS server through 802.1X, suitable for companies.',
      ],
      taglish: [
        'Ang **radio signal ay naririnig ng sinumang malapit**, kaya ang Wi-Fi ay nangangailangan ng **dalawang proteksyon**: **authentication** (**sino ang puwedeng sumali**) at **encryption** (**walang makakabasa ng trapiko**). **Mahina ang mga unang paraan**. Ngayon, ang pamantayan ay **WPA2** at ang mas bagong **WPA3**, parehong **AES** ang encryption.',
        'Dalawang paraan ng authentication: **Personal (PSK)** — **iisang shared na password para sa lahat**, **para sa bahay**. **Enterprise (802.1X)** — **bawat user ay may sariling login** na **sinusuri ng RADIUS server**, **para sa kompanya**.',
        'Pagkakasunod ng seguridad: **Open** (walang proteksyon) → **WEP** (**sira**, huwag gamitin) → **WPA** (TKIP, luma) → **WPA2** (**AES-CCMP**) → **WPA3** (**mas malakas**, SAE, mas ligtas kahit mahina ang password).',
        'Mga banta: **rogue AP**, **evil twin** (pekeng AP na kapangalan), **deauthentication attack** (pinapaalis ang client), at **pakikinig** sa open Wi-Fi.',
      ],
      technical: [
        'Open authentication provides no authentication or encryption. WEP (RC4, 40/104-bit keys with a 24-bit IV) is broken and obsolete. WPA (2003) used TKIP as an interim fix. WPA2 (802.11i, 2004) mandates AES in CCMP mode (confidentiality and integrity) and is the baseline today. WPA3 (2018) uses SAE (Simultaneous Authentication of Equals, a Dragonfly handshake) for personal mode, mandatory Protected Management Frames, forward secrecy, stronger ciphers (GCMP-256 in WPA3-Enterprise 192-bit mode) and Enhanced Open (OWE) for encryption on open networks.',
        'Personal mode (PSK): a passphrase of 8–63 characters is combined with the SSID to derive the pairwise master key; all users share it, so a leaked password exposes everyone and it cannot be revoked per user. WPA2-PSK is vulnerable to offline dictionary attacks on a captured handshake; WPA3-SAE resists these. Enterprise mode: the client (supplicant) authenticates through the AP or controller (authenticator) to a RADIUS server (authentication server) using 802.1X and an EAP method (PEAP, EAP-TLS, EAP-FAST); each user or device has unique credentials or certificates and keys.',
        'Encryption algorithms: TKIP (WPA, RC4-based, deprecated), AES-CCMP (WPA2), AES-GCMP (WPA3). The CCNA expects: WPA2 = AES/CCMP with PSK or 802.1X; WPA3 = SAE and stronger encryption.',
        'Threats and mitigations: rogue AP (unauthorised AP attached to the network; detect with WLC/IPS and port security), evil twin (fake AP copying an SSID; use 802.1X with certificate validation and a VPN on public Wi-Fi), deauthentication/disassociation attacks (use Protected Management Frames, mandatory in WPA3), eavesdropping on open networks (use OWE or a VPN), weak PSK (use long random passphrases). Additional controls: disable WPS, hide nothing relying on SSID hiding, segment guests into a separate VLAN/SSID with limited access, and keep AP firmware updated.',
      ],
    },
    {
      type: 'story',
      title: 'Ang Pekeng "Cafe Wi-Fi"',
      paragraphs: [
        'Si **Ate Mica** ay nasa **coffee shop** at kailangang mag-check ng **bank account**. Dalawang network ang lumabas: **"KapeKo_WiFi"** at **"KapeKo_WiFi"** — **parehong pangalan**! Ang isa ay may **mas malakas na signal**, kaya iyon ang pinili niya.',
        'Napansin ni **Kuya Jun**, na nasa kabilang mesa, na **walang password** ang network at **biglang humingi ng "login" page** na nagtanong ng **email at password**. "**Ate, huwag mong ibigay!**" sabi niya. "**Evil twin** po iyan. **Pekeng AP na kapangalan ng totoo**, at **lahat ng ipinapadala mo ay nababasa ng may-ari nito**."',
        'Pumunta sila sa counter. Ang **totoong Wi-Fi ay may password sa resibo** at **WPA2**. **Nag-connect si Ate Mica sa tunay**, at **gumamit pa rin ng VPN** para sa bank app. Sa opisina nila, **WPA2-Enterprise** ang gamit: **bawat empleyado ay may sariling login** at **sinusuri ng RADIUS server**, kaya **hindi puwedeng basta magpanggap ang pekeng AP**.',
        'Nang maglaon, **na-upgrade ang opisina sa WPA3**. "**Mas ligtas po ito kahit hindi masyadong komplikado ang password**, at **hindi na puwedeng basta paalisin ang client sa pamamagitan ng pekeng deauth**," paliwanag ni Kuya Jun.',
      ],
      moral: '**Open Wi-Fi = nababasa ng lahat.** Gumamit ng **WPA2/WPA3**; **PSK para sa bahay, 802.1X + RADIUS para sa kompanya**. **Mag-ingat sa evil twin** at **gumamit ng VPN** sa pampublikong Wi-Fi.',
    },
    {
      type: 'analogy',
      title: 'Bahay na may susi o may guwardiya',
      body: [
        'Personal mode is a house with one key copied for the whole family: easy, but if the key leaks, everyone is exposed and you cannot cancel just one copy. Enterprise mode is a building where each person has their own ID card checked at the door, and one card can be cancelled without affecting others.',
      ],
      taglish: [
        'Ang **Personal (PSK)** ay **bahay na may iisang susi na kinopya para sa buong pamilya**: **madali**, pero **kapag nakalat ang susi, lahat ay nalalantad** at **hindi mo maaaring kanselahin ang isang kopya lang**. Ang **Enterprise** ay **gusaling bawat tao ay may sariling ID na sinusuri sa pinto**, at **puwedeng kanselahin ang isang ID nang hindi naaapektuhan ang iba**.',
      ],
    },
    {
      type: 'hook',
      title: 'OWWW: Open, WEP (sira), WPA, WPA2 (AES), WPA3 (SAE)',
      trick: '**Open → WEP (sira) → WPA (TKIP) → WPA2 (AES-CCMP) → WPA3 (SAE)**. **PSK = bahay**, **802.1X + RADIUS = kompanya**. **Evil twin = pekeng AP**.',
      taglish: [
        '**WEP** = **sira**; **WPA** = **TKIP**; **WPA2** = **AES-CCMP**; **WPA3** = **SAE + mas malakas**.',
        '**Personal (PSK)** = **shared na password** (bahay). **Enterprise** = **802.1X + RADIUS**, **bawat user may sariling login**.',
        '**Evil twin** = **pekeng AP na kapangalan**. **Rogue AP** = **hindi awtorisadong AP** sa network.',
        '**WPA3** = **Protected Management Frames** (laban sa deauth) at **SAE** (laban sa offline guessing).',
      ],
      test: {
        question: 'Anong encryption ang ginagamit ng WPA2, at anong authentication ang para sa kompanya na may sariling login ang bawat user?',
        answer: 'AES (CCMP) ang encryption ng WPA2. Ang enterprise authentication ay 802.1X gamit ang RADIUS server (WPA2-Enterprise).',
      },
    },
    { type: 'diagram', id: 'wireless-security-ladder', caption: 'Mula Open hanggang WPA3, at ang pagkakaiba ng Personal at Enterprise.' },
    {
      type: 'terms',
      items: [
        { term: 'WPA2', definition: 'Wi-Fi security standard using AES-CCMP encryption with PSK or 802.1X authentication.' },
        { term: 'WPA3', definition: 'Newer standard using SAE for personal mode, mandatory protected management frames and stronger encryption.' },
        { term: 'PSK (Personal)', definition: 'A shared passphrase used by all users to join the network.' },
        { term: 'Enterprise / 802.1X', definition: 'Per-user authentication via an EAP method and a RADIUS server.' },
        { term: 'RADIUS', definition: 'The authentication server that validates enterprise Wi-Fi logins.' },
        { term: 'AES-CCMP', definition: 'The strong encryption and integrity mechanism required by WPA2.' },
        { term: 'Evil twin', definition: 'A fake AP that copies a legitimate SSID to trick users.' },
        { term: 'Rogue AP', definition: 'An unauthorised access point connected to the network.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: pag-login sa WPA2-Enterprise',
      steps: [
        'Kumonekta ang laptop (supplicant) sa SSID ng opisina; sinabi ng AP na kailangan ng 802.1X.',
        'Ipinadala ng laptop ang identity ng user sa AP (authenticator) gamit ang EAP.',
        'Ipinasa ng AP ang mensahe sa RADIUS server (authentication server).',
        'Sinuri ng RADIUS ang credentials o certificate at sumagot ng Accept.',
        'Nagbuo ang laptop at AP ng natatanging encryption keys para sa session na iyon (AES-CCMP).',
        'Pinayagan na ang laptop sa network, at maaaring italaga sa tamang VLAN batay sa user.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **WPA2 ay AES-CCMP**; ang **TKIP ay luma na (WPA)**; ang **WEP ay sira**. At ang **PSK ay shared**, kaya **hindi mo maaaring bawiin ang access ng isang user lang**.' },
    { type: 'callout', kind: 'trap', text: 'Ang **802.1X ay nangangailangan ng RADIUS server**; ang **WPA2-Personal ay hindi**. At ang **pagtatago ng SSID ay hindi seguridad**.' },
    { type: 'callout', kind: 'tip', text: 'Para sa **pampublikong Wi-Fi**, gumamit ng **VPN** at **HTTPS**. Para sa **guest**, **hiwalay na SSID at VLAN** na may limitadong access.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Paggamit ng WEP o open network sa opisina.',
        'Pag-asang ligtas ang nakatagong SSID.',
        'Paggamit ng iisang PSK para sa buong kompanya.',
        'Pagkalito sa PSK (shared) at 802.1X (per-user).',
        'Hindi pag-disable ng WPS at hindi pag-update ng AP firmware.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Hindi maka-connect ang isang empleyado sa WPA2-Enterprise"',
      scenario: 'A user cannot join the corporate WPA2-Enterprise Wi-Fi, but other users can. The user\'s password was changed this morning.',
      evidence: `RADIUS log:
  User jdoe  Access-Reject  reason: invalid credentials (cached password on laptop)
  User mcruz Access-Accept`,
      question: 'Ano ang malamang na dahilan, at ano ang ayos?',
      answer: 'Naka-save sa laptop ang lumang password kaya tumatanggi ang RADIUS (Access-Reject, invalid credentials). Hindi problema ng AP o encryption.',
      fix: 'Burahin ang naka-save na Wi-Fi profile sa laptop at mag-login ulit gamit ang bagong credentials. Kung ginagamit ang certificate, tiyaking valid at hindi expired.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Magrekomenda ng Wi-Fi security para sa (a) bahay, (b) opisina na may 100 empleyado, at (c) guest network ng cafe.',
      answer: '(a) WPA3-Personal (o WPA2-PSK na mahaba ang passphrase). (b) WPA2/WPA3-Enterprise na 802.1X at RADIUS. (c) Hiwalay na guest SSID/VLAN na may limitadong access, WPA3-Personal/OWE, at paalalang gumamit ng VPN.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'WEP is broken; WPA used TKIP; WPA2 uses AES-CCMP; WPA3 uses SAE and stronger encryption.',
        'Personal uses a shared PSK; Enterprise uses 802.1X with a RADIUS server.',
        'Evil twin copies an SSID; a rogue AP is unauthorised on the wired network.',
        'WPA3 adds protected management frames and resists offline guessing.',
        'Guest access belongs in a separate SSID/VLAN.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Wi-Fi needs authentication and encryption because radio is shared.',
        'WPA2 (AES-CCMP) is the baseline; WPA3 improves it.',
        'Use PSK for homes and 802.1X with RADIUS for companies.',
        'Watch for evil twins and rogue APs.',
        'Susunod sa roadmap: Wireless architectures at ang WLC.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.9', difficulty: 'easy', type: 'single',
    prompt: 'Which encryption does WPA2 use?',
    choices: ['RC4 with WEP', 'TKIP only', 'AES-CCMP', 'None'], correct: [2],
    explanation: 'WPA2 uses AES in CCMP mode.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.9', difficulty: 'easy', type: 'single',
    prompt: 'Which Wi-Fi security protocol is considered broken and obsolete?',
    choices: ['WPA3', 'WPA2', 'WEP', 'WPA2-Enterprise'], correct: [2],
    explanation: 'WEP can be broken in minutes and should not be used.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.9', difficulty: 'medium', type: 'single',
    prompt: 'What does WPA2-Enterprise add compared with WPA2-Personal?',
    choices: ['A shared password', 'Per-user authentication using 802.1X and a RADIUS server', 'No encryption', 'A hidden SSID'], correct: [1],
    explanation: 'Enterprise mode authenticates each user through 802.1X and RADIUS.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.9', difficulty: 'medium', type: 'single',
    prompt: 'Which WPA3 feature replaces the PSK handshake in personal mode and resists offline guessing?',
    choices: ['TKIP', 'SAE', 'WEP', 'MD5'], correct: [1],
    explanation: 'Simultaneous Authentication of Equals protects against offline dictionary attacks.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.9', difficulty: 'medium', type: 'single',
    prompt: 'A fake AP broadcasts the same SSID as a cafe network to capture traffic. What is it called?',
    choices: ['Rogue switch', 'Evil twin', 'Wardriving', 'Roaming'], correct: [1],
    explanation: 'An evil twin impersonates a legitimate SSID.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.9', difficulty: 'hard', type: 'single',
    prompt: 'Why is a single shared PSK a weakness for a large company?',
    choices: ['It uses no encryption', 'It cannot be revoked for one user and a leak exposes everyone', 'It is too fast', 'It needs RADIUS'], correct: [1],
    explanation: 'All users share the same secret, so access cannot be removed individually.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.9', difficulty: 'medium', type: 'single',
    prompt: 'Which server authenticates users in 802.1X Wi-Fi?',
    choices: ['DHCP', 'RADIUS', 'DNS', 'NTP'], correct: [1],
    explanation: 'A RADIUS server acts as the authentication server.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.9', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are good practices for wireless security?',
    choices: ['Use WPA2 or WPA3', 'Rely on hiding the SSID', 'Put guests on a separate SSID/VLAN', 'Keep the default PSK'], correct: [0, 2],
    explanation: 'Strong encryption and guest segmentation help; SSID hiding and default keys do not.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D5', objective: '5.9', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: hiding the SSID is an effective security control.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — the SSID is still visible in management frames; it is not security.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: Wi-Fi security?', back: 'WEP sira → WPA TKIP → WPA2 AES-CCMP → WPA3 SAE. PSK = shared (bahay); 802.1X + RADIUS = per-user (kompanya). Evil twin = pekeng AP.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'WPA2 vs WPA3?', back: 'WPA2: AES-CCMP with PSK or 802.1X. WPA3: SAE for personal, protected management frames, stronger encryption.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Personal vs Enterprise?', back: 'Personal: one shared PSK. Enterprise: 802.1X with a RADIUS server and per-user credentials.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Evil twin vs rogue AP?', back: 'Evil twin: fake AP copying a legitimate SSID. Rogue AP: unauthorised AP on the network.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Which wireless protocol is broken?', back: 'WEP (RC4); TKIP is deprecated.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'concept', front: '802.1X roles?', back: 'Supplicant (client), authenticator (AP/WLC), authentication server (RADIUS).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Secure a home and a guest Wi-Fi on paper',
  tool: 'Paper',
  minutes: 20,
  objective: 'Choose security settings for a home network and a guest network and justify each.',
  steps: [
    'List the settings of your own router: security mode, encryption, WPS and guest network.',
    'Decide the best security mode (WPA3/WPA2) and passphrase policy.',
    'Disable WPS and write down why.',
    'Design a guest SSID/VLAN with limited access to the internal network.',
    'Write the three threats you protected against and the control for each.',
  ],
  checklist: [
    'Security mode chosen',
    'WPS disabled',
    'Guest network separated',
    'Threats mapped to controls',
  ],
  hints: [
    'Use a long random passphrase for PSK.',
    'A guest network should not reach your internal devices.',
  ],
  solution: [
    'WPA3-Personal or WPA2-AES with a long passphrase; WPS off; guest SSID on its own VLAN.',
    'Evil twin: VPN/HTTPS; weak PSK: long passphrase; rogue AP: monitor and port security.',
  ],
};
