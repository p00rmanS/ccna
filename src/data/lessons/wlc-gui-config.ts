import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'wlc-gui-config';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.15',
  domain: 'D2',
  title: 'WLC GUI Walkthrough: Creating a WLAN with WPA2-PSK',
  description: 'Follow the Cisco WLC GUI to create a WLAN, map it to a VLAN interface, set WPA2 PSK security and QoS, and understand what each setting does.',
  whyMatters:
    'Ang CCNA ay may mga tanong na may screenshot ng WLC GUI: “aling tab ang kailangang baguhin para mag-WPA2-PSK?” o “anong setting ang nagmamapa ng WLAN sa VLAN?” Kapag alam mo ang daloy ng pagbuo ng WLAN, masasagot mo ito sa isang tingin.',
  objectives: [
    'Create a WLAN with a profile name, SSID and ID',
    'Map a WLAN to an interface/VLAN on the General tab',
    'Configure WPA2 with AES and a pre-shared key in the Security tab',
    'Choose a QoS profile and understand the Advanced tab',
    'Verify client connectivity from the WLC monitor view',
  ],
  estimatedMinutes: 35,
  difficulty: 'exam',
  keywords: ['WLC GUI', 'WLAN', 'SSID', 'profile name', 'WPA2', 'PSK', 'AES', 'interface group', 'VLAN mapping', 'QoS profile', 'Platinum', 'Gold', 'Silver', 'Bronze'],
  examObjectives: ['2.9', '5.10'],
  sections: [
    {
      type: 'explain',
      simple: [
        'In a controller-based network you create WLANs on the WLC, not on each AP. A WLAN has a profile name, an SSID, a status, a mapped interface (VLAN), a security method and a QoS profile.',
        'For a home-style secure network you choose WPA2 with AES and a pre-shared key (PSK).',
      ],
      taglish: [
        'Sa controller-based network, **sa WLC ginagawa ang WLAN**, hindi sa bawat AP. May **profile name, SSID, status, interface (VLAN), security method at QoS profile** ang WLAN.',
        'Para sa ligtas na network na parang pambahay: **WPA2 na may AES at PSK (pre-shared key)**.',
        'Mga tab sa GUI ng WLC: **General, Security, QoS, Policy-Mapping, Advanced**. Karamihan ng tanong sa exam ay nasa unang tatlo.',
      ],
      technical: [
        'In the Cisco WLC GUI the path is WLANs → Create New → type WLAN → Profile Name, SSID and ID → Apply. On the General tab, set Status to Enabled, choose the Interface/Interface Group (the VLAN where clients will be placed) and optionally disable Broadcast SSID.',
        'On the Security tab, Layer 2: choose WPA+WPA2, tick WPA2 Policy and AES encryption, and under Authentication Key Management enable PSK with an ASCII or hex key (8–63 characters) — or 802.1X for enterprise. On the QoS tab choose Platinum (voice), Gold (video), Silver (best effort, default) or Bronze (background). Apply and save the configuration.',
        'The WLC places client traffic on the dynamic interface mapped to the WLAN. The management VLAN of the APs is separate from the client VLANs. Clients are visible under Monitor → Clients.',
      ],
    },
    {
      type: 'analogy',
      title: 'Menu ng restaurant',
      body: [
        'Creating a WLAN is like adding a new dish to a restaurant menu: you give it a name (SSID), say which kitchen prepares it (VLAN interface), choose how it is secured and priced (security and QoS) and then switch it on.',
      ],
      taglish: [
        'Ang paggawa ng WLAN ay parang **pagdaragdag ng bagong ulam sa menu**: bibigyan mo ng **pangalan (SSID)**, sasabihin kung **saang kusina ito ihahanda (VLAN interface)**, pipili ka ng **seguridad at presyo (security at QoS)**, saka mo **bubuksan (Enabled)**.',
      ],
    },
    {
      type: 'hook',
      title: 'G-S-Q: General, Security, QoS',
      trick: '**WLAN = Profile + SSID. GENERAL = Enable + VLAN interface. SECURITY = WPA2 + AES + PSK. QoS = Platinum voice, Gold video, Silver default, Bronze background.**',
      taglish: [
        '**General**: Status **Enabled**, **Interface/VLAN**, broadcast SSID.',
        '**Security → Layer 2**: **WPA+WPA2 → WPA2 Policy + AES → PSK** (ilagay ang key).',
        '**QoS**: **Platinum = voice**, **Gold = video**, **Silver = best effort (default)**, **Bronze = background**.',
        '**Apply** at **Save Configuration**.',
      ],
      test: {
        question: 'Aling tab at anong setting ang nagmamapa ng WLAN sa VLAN?',
        answer: 'General tab → Interface/Interface Group (ang interface na naka-map sa VLAN).',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Gumawa ng WLAN at i-map sa VLAN',
      paragraphs: [
        'Pumunta sa **WLANs** → **Create New** → piliin ang type na **WLAN** → **Go**. Ilagay ang **Profile Name** (panloob na pangalan), **SSID** (pangalang nakikita ng clients) at **ID** (numero ng WLAN) → **Apply**.',
        'Sa **General** tab: itakda ang **Status** sa **Enabled** (kung hindi, hindi gagana), piliin ang **Interface/Interface Group** — ito ang **dynamic interface** na naka-map sa VLAN ng mga client (hal. VLAN 20 “STAFF”). Pwedeng alisin ang tsek sa **Broadcast SSID** para itago ang SSID (hindi tunay na seguridad).',
        'Tandaan: ang **management interface** ng WLC at ng AP ay hindi ang VLAN ng mga client. Ang mga client ay nasa VLAN ng interface na pinili sa WLAN.',
      ],
      steps: [
        'WLANs → Create New → WLAN → Go.',
        'Ilagay ang Profile Name, SSID at ID → Apply.',
        'General tab → Status Enabled.',
        'Interface/Interface Group → piliin ang VLAN interface ng mga client.',
        'Apply.',
      ],
      tricks: [
        'Kapag hindi nakikita ang SSID, tingnan ang Status Enabled at ang Broadcast SSID.',
        'Kapag may SSID pero walang IP ang client, tingnan ang VLAN interface mapping at ang DHCP.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Security at QoS',
      paragraphs: [
        '**Security tab → Layer 2 Security**: piliin ang **WPA+WPA2**. Sa **WPA2 Policy** i-tsek ang **AES** (CCMP). Sa **Authentication Key Management**, i-enable ang **PSK** at ilagay ang **passphrase (8–63 karakter)** sa napiling format (ASCII). Para sa enterprise: **802.1X** na kumakausap sa RADIUS server.',
        '**QoS tab**: **Platinum** para sa voice, **Gold** para sa video, **Silver** (default) para sa best effort, **Bronze** para sa background. Para sa guest WLAN, madalas ay Bronze.',
        '**Advanced tab**: mga setting tulad ng client load limit, DHCP required, at pagpapahintulot ng AAA override. Hindi ito madalas sa exam. Pagkatapos, **Apply** at **Save Configuration**.',
      ],
      steps: [
        'Security tab → Layer 2 → WPA+WPA2.',
        'WPA2 Policy ✔, AES ✔.',
        'Auth Key Mgmt → PSK ✔ → ilagay ang key.',
        'QoS tab → pumili ng profile.',
        'Apply → Save Configuration.',
      ],
      tricks: [
        'WPA2 Personal = PSK; Enterprise = 802.1X.',
        'Ang WPA3 ay may SAE sa halip na PSK; tandaan ang pagkakaiba sa Auth Key Management.',
      ],
    },
    {
      type: 'remember',
      title: 'WLC GUI na lumalabas sa exam',
      items: [
        '**WLAN = Profile Name + SSID + ID; General tab: Status Enabled + Interface (VLAN).**',
        '**Security → Layer 2 → WPA+WPA2 → WPA2 Policy + AES → PSK.**',
        '**QoS: Platinum voice, Gold video, Silver best effort (default), Bronze background.**',
        '**Ang VLAN ng client ay galing sa interface na naka-map sa WLAN, hindi sa management VLAN.**',
        '**Apply at Save Configuration.**',
      ],
    },
    { type: 'diagram', id: 'wireless-security-ladder', caption: 'Mga antas ng Wi-Fi security; WPA2/AES ang piniling setting sa lesson na ito.' },
    {
      type: 'terms',
      items: [
        { term: 'Profile name', definition: 'The internal name of a WLAN on the controller.' },
        { term: 'SSID', definition: 'The network name that clients see and join.' },
        { term: 'Interface / interface group', definition: 'The WLC logical interface (VLAN) that carries the WLAN’s client traffic.' },
        { term: 'PSK', definition: 'Pre-shared key: the passphrase used for WPA2 Personal.' },
        { term: 'AES (CCMP)', definition: 'The encryption algorithm used by WPA2.' },
        { term: 'QoS profile', definition: 'Platinum, Gold, Silver or Bronze marking for the WLAN’s traffic.' },
        { term: '802.1X', definition: 'Port-based authentication that uses a RADIUS server for WPA2 Enterprise.' },
      ],
    },
    {
      type: 'flow',
      title: 'Pagbuo ng WLAN sa GUI',
      steps: [
        'WLANs → Create New → WLAN; ilagay ang profile, SSID at ID.',
        'General: Enabled at piliin ang VLAN interface.',
        'Security: WPA+WPA2, WPA2 Policy, AES at PSK.',
        'QoS: pumili ng profile.',
        'Apply, Save at subukan ang isang client; tingnan sa Monitor → Clients.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **WLAN na hindi Enabled** ay hindi gagana kahit tama ang lahat ng iba. Ito ang madalas na pagkakamali sa GUI na tanong.' },
    { type: 'callout', kind: 'trap', text: 'Ang **PSK ay nasa Layer 2 Security → Authentication Key Management**, hindi sa General tab.' },
    { type: 'callout', kind: 'tip', text: 'Isipin ang tatlong tab sa pagkakasunod: General (buksan at VLAN), Security (proteksyon), QoS (prayoridad).' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Forgetting to enable the WLAN.',
        'Mapping the WLAN to the management interface instead of a client VLAN.',
        'Selecting WPA2 but leaving AES unticked or PSK not enabled.',
        'Using a passphrase shorter than 8 characters.',
        'Not saving the configuration after Apply.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Nakakakonekta pero walang IP',
      scenario: 'Clients join the new STAFF WLAN with the correct passphrase but receive 169.254.x.x addresses.',
      evidence: `WLAN ID: 2  SSID: STAFF  Status: Enabled
Security: WPA2 (AES) PSK
Interface/Interface Group: management`,
      question: 'Ano ang malamang na mali?',
      answer: 'The WLAN is mapped to the management interface, so clients are placed in the management VLAN, where no DHCP scope exists for them.',
      fix: 'On the General tab select the dynamic interface for the STAFF VLAN (with a DHCP scope), click Apply, save the configuration and renew a client address.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Gusto mong gumawa ng guest WLAN na may WPA2-PSK, naka-map sa VLAN 30 at may pinakamababang priyoridad. Ilista ang mga hakbang at piliin ang QoS profile.',
      answer: 'WLANs → Create New (profile GUEST, SSID GUEST, ID 3). General: Enabled and Interface for VLAN 30. Security: Layer 2 WPA+WPA2, WPA2 Policy with AES, PSK with the passphrase. QoS: Bronze (background). Apply and save.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'General tab: Enabled and the VLAN interface.',
        'Security tab: WPA2, AES and PSK.',
        'QoS: Platinum voice, Gold video, Silver default, Bronze background.',
        'Client VLAN comes from the WLAN’s interface.',
        '802.1X means WPA2 Enterprise with RADIUS.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Create WLANs on the controller.',
        'General: enable and map the VLAN interface.',
        'Security: WPA2, AES and PSK.',
        'QoS chooses traffic priority.',
        'Apply and save.',
        'Susunod: mas maraming practice exam at troubleshooting scenarios.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.9', difficulty: 'easy', type: 'single',
    prompt: 'In the WLC GUI, which tab is used to map a WLAN to a VLAN interface?',
    choices: ['Security', 'General', 'QoS', 'Advanced only'], correct: [1],
    explanation: 'The General tab holds the status and the Interface/Interface Group mapping.',
    wrong: { 0: 'Security holds authentication and encryption.', 2: 'QoS sets the traffic priority.', 3: 'The mapping is on the General tab.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '5.10', difficulty: 'medium', type: 'single',
    prompt: 'Which settings configure a WLAN for WPA2 with a pre-shared key?',
    choices: ['Layer 2 Security WPA+WPA2, WPA2 Policy AES, Auth Key Management PSK', 'Layer 2 Security None with a MAC filter', 'WEP with 40-bit key', 'Layer 3 Security web pass-through only'], correct: [0],
    explanation: 'WPA2-PSK is configured with WPA+WPA2, the WPA2 policy with AES and PSK key management.',
    wrong: { 1: 'None provides no encryption.', 2: 'WEP is obsolete and weak.', 3: 'Web pass-through is for guest access, not WPA2.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.9', difficulty: 'medium', type: 'single',
    prompt: 'Which QoS profile is intended for voice traffic?',
    choices: ['Bronze', 'Silver', 'Gold', 'Platinum'], correct: [3],
    explanation: 'Platinum is for voice, Gold for video, Silver for best effort and Bronze for background.',
    wrong: { 0: 'Bronze is background traffic.', 1: 'Silver is best effort (default).', 2: 'Gold is for video.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.9', difficulty: 'hard', type: 'single',
    prompt: 'Clients join a new WLAN with the correct key but get 169.254.x.x addresses. The WLAN is mapped to the management interface. What should change?',
    choices: ['Change the WLAN to a client VLAN interface that has a DHCP scope', 'Increase the PSK length', 'Switch the QoS profile to Platinum', 'Disable AES'], correct: [0],
    explanation: 'Clients must be placed in a VLAN with DHCP service, so the WLAN must map to the proper dynamic interface.',
    wrong: { 1: 'The key is already accepted.', 2: 'QoS does not provide addressing.', 3: 'Disabling AES weakens security and does not fix DHCP.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.9', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a WLAN must have its status set to Enabled before clients can use it.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'A disabled WLAN is not broadcast and cannot be used.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '5.10', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are required to configure WPA2 Personal on the WLC?',
    choices: ['AES encryption', 'A pre-shared key', 'A RADIUS server', 'A digital certificate on each client'], correct: [0, 1],
    explanation: 'WPA2 Personal needs AES and a PSK; RADIUS and certificates belong to enterprise authentication.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: G-S-Q sa WLC GUI?', back: 'General = Enable + VLAN interface. Security = WPA2 + AES + PSK. QoS = Platinum voice, Gold video, Silver default, Bronze background.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Which WLC tab maps the WLAN to a VLAN?', back: 'General: Interface/Interface Group.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'concept', front: 'How do you set WPA2-PSK?', back: 'Security, Layer 2: WPA+WPA2, WPA2 Policy AES, Auth Key Management PSK.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'QoS profiles?', back: 'Platinum voice, Gold video, Silver best effort, Bronze background.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What is the difference between profile name and SSID?', back: 'Profile name is the internal WLAN name; SSID is what clients see.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'concept', front: 'WPA2 Personal vs Enterprise?', back: 'Personal uses a PSK; Enterprise uses 802.1X with RADIUS.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Why would clients get 169.254 addresses on a new WLAN?', back: 'The WLAN is mapped to a VLAN interface with no DHCP service.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Create a WPA2-PSK WLAN on the WLC',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Use the WLC GUI to create a WLAN with WPA2-PSK, map it to a client VLAN and verify a wireless client.',
  steps: [
    'In Packet Tracer add a WLC, a switch, a DHCP server and a lightweight AP. Place the AP on the switch and the WLC on the management network.',
    'Open the WLC GUI. Create a WLAN with Profile STAFF, SSID STAFF and ID 1.',
    'On General set Status Enabled and choose the interface mapped to the staff VLAN.',
    'On Security choose WPA+WPA2, WPA2 Policy AES and PSK, and enter a passphrase of at least 8 characters.',
    'On QoS choose Silver, Apply and save the configuration.',
    'Connect a wireless laptop to STAFF with the passphrase and verify the IP address and ping.',
    'Create a second WLAN GUEST on another VLAN with Bronze QoS and compare the two.',
  ],
  checklist: [
    'WLAN enabled and mapped to the right VLAN',
    'WPA2 with AES and PSK configured',
    'Client connected with a valid IP address',
    'QoS profiles compared',
  ],
  hints: [
    'If the client gets 169.254.x.x, check the interface mapping and the DHCP scope.',
    'Apply the changes on each tab before moving to the next.',
  ],
  solution: [
    'General: Enabled, Interface = staff VLAN interface.',
    'Security: WPA+WPA2, AES, PSK passphrase.',
    'QoS: Silver for staff, Bronze for guests.',
  ],
  breakIt: 'Map the WLAN to the management interface and observe the client’s address; then fix it.',
};
