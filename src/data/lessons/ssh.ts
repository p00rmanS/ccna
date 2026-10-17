import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ssh';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.11',
  domain: 'D4',
  title: 'SSH: Secure Remote Access to Cisco Devices',
  description: 'Why Telnet is unsafe, what SSH needs before it will work, and how to configure and verify SSH on the VTY lines.',
  whyMatters:
    'Ang Telnet ay nagpapadala ng username at password sa plain text — sinumang nakikinig sa network ay nababasa ito. Kaya SSH ang ginagamit ng bawat tunay na network. Sa exam, may mga tanong na "anong mga command ang kulang para gumana ang SSH?" — at ang sagot ay laging may hostname, domain name, RSA keys, user, at transport input ssh.',
  objectives: [
    'Explain why Telnet is insecure and SSH is preferred',
    'List the prerequisites for SSH on a Cisco device (hostname, domain name, RSA keys, local user)',
    'Configure the VTY lines to allow SSH only',
    'Enable SSH version 2 and generate an RSA key pair',
    'Verify SSH with show ip ssh and show ssh',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['SSH', 'Telnet', 'crypto key generate rsa', 'ip domain-name', 'transport input ssh', 'login local', 'ip ssh version 2', 'username', 'VTY', 'TCP 22'],
  examObjectives: ['4.8'],
  sections: [
    {
      type: 'explain',
      simple: [
        'To manage a router over the network you open a remote session. Telnet does this but sends everything, including passwords, as readable text. SSH does the same job but encrypts the whole session.',
        'SSH will not work on a fresh Cisco device. It needs a hostname, a domain name, an RSA key pair, a local user account, and the VTY lines set to accept SSH.',
      ],
      taglish: [
        'Para i-manage ang router **sa network**, nagbubukas ka ng **remote session**. Ginagawa rin ito ng **Telnet**, pero **ipinapadala nito ang lahat, pati password, bilang nababasang text**. Ang **SSH** ay pareho ang trabaho pero **naka-encrypt ang buong session**.',
        'Hindi gagana ang SSH sa bagong Cisco device nang walang **paghahanda**. Kailangan ng **hostname**, **domain name**, **RSA key pair**, **local user account**, at ang **VTY lines** ay kailangang **tumanggap ng SSH**.',
        'Bakit domain name? Dahil ang **RSA key ay binubuo mula sa hostname + domain name**. Kapag wala ang isa, **hindi ka makakagawa ng key**.',
        '**TCP 22** ang SSH; **TCP 23** ang Telnet. Para sa seguridad, **SSH version 2** at **transport input ssh** lang.',
      ],
      technical: [
        'Telnet (TCP 23) transmits all data, including credentials, in clear text. SSH (TCP 22) provides encrypted sessions, host authentication and integrity. SSHv2 is the secure version; SSHv1 has known weaknesses.',
        'Prerequisites: a hostname other than the default; an ip domain-name; an RSA key pair (crypto key generate rsa modulus 2048; 768 bits or more is required for SSHv2); a user account (username <name> secret <password>, or AAA); and VTY lines set to login local with transport input ssh.',
        'Typical order: hostname R1; ip domain-name lab.local; crypto key generate rsa modulus 2048; ip ssh version 2; username admin secret <password>; line vty 0 4; login local; transport input ssh. Optionally add ip ssh time-out and ip ssh authentication-retries, and an access-class to limit which hosts may connect.',
        'login local tells the line to authenticate against the local username database. login without local uses the line password, which does not work with SSH because SSH needs a username.',
        'Verification: show ip ssh (version, timeouts), show ssh (active sessions), show crypto key mypubkey rsa (generated keys), show running-config | section line vty. Connect from a client with ssh -l admin 10.0.0.1.',
      ],
    },
    {
      type: 'analogy',
      title: 'Postcard vs selyadong sobre',
      body: [
        'Telnet is a postcard: everyone who handles it along the way can read the message, including the password you wrote. SSH is a sealed, signed envelope: only the recipient can open it, and you can be sure it really came from the right sender.',
      ],
      taglish: [
        'Ang **Telnet** ay **postcard**: **bawat humahawak nito sa daan ay nababasa ang mensahe**, pati ang **password na isinulat mo**. Ang **SSH** ay **selyado at pirmadong sobre**: **ang tatanggap lang ang makakabuksan**, at sigurado kang **galing talaga sa tamang nagpadala**.',
      ],
    },
    {
      type: 'hook',
      title: 'HD-KUV: Hostname, Domain, Key, User, VTY',
      trick: '**HD-KUV**: **H**ostname, **D**omain name, **K**ey (RSA), **U**ser, **V**TY (transport input ssh).',
      taglish: [
        'Limang bagay bago gumana ang SSH: **HD-KUV**.',
        '**H**ostname (hindi default), **D**omain name (**ip domain-name**), **K**ey (**crypto key generate rsa**), **U**ser (**username ... secret ...**), **V**TY (**login local** at **transport input ssh**).',
        '**TCP 22** = SSH. **TCP 23** = Telnet.',
        'Kapag **kulang ang isa**, hindi gagana. Madalas na nakakalimutan: **domain name**.',
      ],
      test: {
        question: 'Hindi makagawa ng RSA key ang router na may default na hostname na "Router" at walang domain name. Ano ang dalawang command na kulang?',
        answer: 'hostname <pangalan> (hindi default) at ip domain-name <domain>. Pagkatapos ay crypto key generate rsa modulus 2048.',
      },
    },
    { type: 'diagram', id: 'ssh-vs-telnet', caption: 'Ang Telnet ay plain text sa TCP 23; ang SSH ay naka-encrypt sa TCP 22.' },
    {
      type: 'terms',
      items: [
        { term: 'SSH', definition: 'Secure Shell: encrypted remote access. TCP port 22.' },
        { term: 'Telnet', definition: 'Unencrypted remote access. TCP port 23. Avoid it.' },
        { term: 'VTY lines', definition: 'The virtual terminal lines (line vty 0 4) used for remote sessions.' },
        { term: 'RSA key pair', definition: 'The public/private keys the device generates so it can encrypt SSH sessions.' },
        { term: 'login local', definition: 'Tells a line to check a username and password in the local database.' },
        { term: 'transport input ssh', definition: 'Allows only SSH on the VTY lines and blocks Telnet.' },
        { term: 'Modulus', definition: 'RSA key size in bits; use 2048. At least 768 is needed for SSHv2.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: paghahanda ng R1 para sa SSH',
      steps: [
        'Itakda ang hostname R1 at domain name lab.local. Ito ang batayan ng RSA key.',
        'Patakbuhin ang crypto key generate rsa modulus 2048. Awtomatikong lilitaw na naka-enable ang SSH.',
        'I-enable ang ip ssh version 2 para sa mas ligtas na bersyon.',
        'Gumawa ng user: username admin secret <password>.',
        'Sa line vty 0 4: login local at transport input ssh para maging SSH lang.',
        'Mula sa PC: ssh -l admin 10.0.0.1. Nagbubukas ang naka-encrypt na session at tinatanong ang password.',
      ],
    },
    {
      type: 'cli',
      title: 'I-configure ang SSH sa router',
      transcript: `Router(config)# hostname R1
R1(config)# ip domain-name lab.local
R1(config)# crypto key generate rsa modulus 2048
The name for the keys will be: R1.lab.local
% The key modulus size is 2048 bits
% Generating 2048 bit RSA keys, keys will be non-exportable...[OK]
R1(config)# ip ssh version 2
R1(config)# username admin secret Str0ngPass!
R1(config)# line vty 0 4
R1(config-line)# login local
R1(config-line)# transport input ssh
R1(config-line)# end
R1# show ip ssh
SSH Enabled - version 2.0
Authentication timeout: 120 secs; Authentication retries: 3`,
      copyable: 'transport input ssh',
      explain: [
        { line: 'hostname R1 / ip domain-name lab.local', why: 'Together they make the key name R1.lab.local. Without both, key generation fails.' },
        { line: 'crypto key generate rsa modulus 2048', why: 'Creates the key pair. This is also what switches SSH on.' },
        { line: 'ip ssh version 2', why: 'Restricts the device to SSHv2, the secure version.' },
        { line: 'username admin secret ...', why: 'The local account SSH will check. secret stores it hashed.' },
        { line: 'login local', why: 'Makes the VTY lines use the local username database; SSH needs a username.' },
        { line: 'transport input ssh', why: 'Allows SSH only; Telnet connections are refused.' },
      ],
      note: 'Sample output for study; use a strong password of your own.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show ip ssh', shows: 'Whether SSH is enabled, the version, timeouts and retries.' },
        { command: 'show ssh', shows: 'Current SSH sessions, their direction and encryption.' },
        { command: 'show crypto key mypubkey rsa', shows: 'The generated RSA key pair and its name.' },
        { command: 'show running-config | section line vty', shows: 'The VTY lines: login local and transport input ssh.' },
      ],
      good: 'SSH Enabled - version 2.0, and the client connects with an encrypted session.',
      bad: 'SSH Disabled - no RSA keys generated, or a refused connection because transport input does not include ssh.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **crypto key generate rsa** ay **hindi gagana** kung **default ang hostname** o **walang domain name**. Ito ang pinakakaraniwang tanong na "ano ang kulang".' },
    { type: 'callout', kind: 'trap', text: 'Ang **login** (na walang local) ay gumagamit ng **line password**; ang **SSH ay nangangailangan ng username**, kaya **login local** ang kailangan. Kapag nagkamali rito, **hindi ka makakapasok** kahit tama ang password.' },
    { type: 'callout', kind: 'tip', text: 'Ang **transport input ssh** ay **nagba-block ng Telnet**. Kung **transport input telnet ssh** ang nakalagay, **bukas pa rin ang Telnet** — hindi ito ligtas.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Paggawa ng RSA key nang hindi nagtatakda ng hostname at domain name.',
        'Paggamit ng login sa halip na login local.',
        'Pag-iwan ng Telnet na bukas sa VTY lines.',
        'Paglimot sa paggawa ng username.',
        'Paggamit ng maliit na modulus (halimbawa 512) na hindi sapat para sa SSHv2.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Hindi makapag-SSH ang admin"',
      scenario: 'An administrator cannot connect to R1 over SSH, although the router answers ping.',
      evidence: `C:\\> ssh -l admin 10.0.0.1
ssh: connect to host 10.0.0.1 port 22: Connection refused
R1# show ip ssh
SSH Disabled - version 2.0
Please create RSA keys to enable SSH.`,
      question: 'Ano ang kulang at paano ito aayusin?',
      answer: 'Ang ping ay gumagana, kaya maaabot ang router. Pero "SSH Disabled" dahil wala pang RSA keys na nabuo, kaya tinatanggihan ang koneksyon sa port 22.',
      fix: 'Itakda ang hostname at ip domain-name kung wala pa, saka crypto key generate rsa modulus 2048. Tiyakin ang line vty 0 4 ay may login local at transport input ssh, at may username. I-verify gamit ang show ip ssh.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang kumpletong listahan ng command para ma-enable ang SSH sa isang bagong switch na ang pangalan ay "Switch", at ipaliwanag kung bakit hindi sapat ang "line vty 0 15 / password cisco / login".',
      answer: 'hostname SW1; ip domain-name lab.local; crypto key generate rsa modulus 2048; ip ssh version 2; username admin secret <password>; line vty 0 15; login local; transport input ssh. Hindi sapat ang password at login dahil ang SSH ay nangangailangan ng username at RSA key; ang line password lang ay para sa Telnet-style na authentication na walang username.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'SSH is TCP 22; Telnet is TCP 23 and sends clear text.',
        'SSH prerequisites: hostname, domain name, RSA keys, local user, VTY with login local and transport input ssh.',
        'crypto key generate rsa modulus 2048 creates the key; SSHv2 needs at least 768 bits.',
        'transport input ssh blocks Telnet; ip ssh version 2 forces SSHv2.',
        'show ip ssh shows whether SSH is enabled; show ssh lists sessions.',
      ],
    },
    {
      type: 'summary',
      points: [
        'SSH encrypts remote sessions; Telnet does not and should be disabled.',
        'Prepare with hostname, domain name, RSA keys, a local user and VTY settings.',
        'Use login local and transport input ssh on the VTY lines.',
        'Verify with show ip ssh and show ssh.',
        'Susunod sa roadmap: TFTP at FTP — paglilipat ng file sa mga device.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.8', difficulty: 'easy', type: 'single',
    prompt: 'Which protocol provides encrypted remote access to a Cisco device?',
    choices: ['Telnet', 'SSH', 'HTTP', 'TFTP'], correct: [1],
    explanation: 'SSH encrypts the whole session; Telnet sends clear text.',
    wrong: { 0: 'Telnet is unencrypted.', 2: 'HTTP is unencrypted web traffic.', 3: 'TFTP transfers files without encryption.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.8', difficulty: 'easy', type: 'single',
    prompt: 'Which TCP port does SSH use?',
    choices: ['21', '22', '23', '443'], correct: [1],
    explanation: 'SSH uses TCP port 22.',
    wrong: { 0: '21 is FTP.', 2: '23 is Telnet.', 3: '443 is HTTPS.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.8', difficulty: 'medium', type: 'single',
    prompt: 'Which command generates the RSA keys that enable SSH?',
    choices: ['crypto key generate rsa', 'ssh generate keys', 'ip ssh rsa enable', 'enable ssh'], correct: [0],
    explanation: 'crypto key generate rsa creates the key pair and enables SSH, provided hostname and domain name are set.',
    wrong: { 1: 'Not valid IOS syntax.', 2: 'Not valid IOS syntax.', 3: 'Not valid IOS syntax.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.8', difficulty: 'medium', type: 'single',
    prompt: 'Key generation fails on a router with the default hostname and no domain name. What must be configured?',
    choices: ['An IP route', 'A non-default hostname and ip domain-name', 'A VLAN', 'An NTP server'], correct: [1],
    explanation: 'The RSA key name is built from the hostname and domain name, so both are required.',
    wrong: { 0: 'Routes are unrelated to key creation.', 2: 'VLANs are unrelated.', 3: 'NTP is unrelated to key creation.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.8', difficulty: 'medium', type: 'single',
    prompt: 'Which VTY command allows only SSH and blocks Telnet?',
    choices: ['transport input ssh', 'transport output ssh', 'login ssh', 'access-class ssh'], correct: [0],
    explanation: 'transport input ssh restricts incoming connections to SSH.',
    wrong: { 1: 'That controls outgoing sessions.', 2: 'Not valid IOS syntax.', 3: 'access-class applies an ACL.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.8', difficulty: 'medium', type: 'single',
    prompt: 'Why is "login local" used with SSH?',
    choices: ['SSH needs a username, which comes from the local user database', 'It enables encryption', 'It sets the SSH port', 'It disables Telnet'], correct: [0],
    explanation: 'SSH authenticates users by username, so the VTY lines must check the local database.',
    wrong: { 1: 'Encryption comes from the RSA keys.', 2: 'The port is fixed at 22.', 3: 'transport input ssh does that.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.8', difficulty: 'hard', type: 'single',
    prompt: 'show ip ssh reports "SSH Disabled". What is the most likely missing step?',
    choices: ['RSA keys have not been generated', 'A default route is missing', 'The VLAN is not created', 'NAT is not configured'], correct: [0],
    explanation: 'SSH is enabled only after an RSA key pair exists.',
    wrong: { 1: 'Routing would not make SSH show as disabled.', 2: 'VLANs are unrelated.', 3: 'NAT is unrelated.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.8', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are required before SSH will work on a new router?',
    choices: ['An ip domain-name', 'An OSPF process', 'RSA keys', 'A DHCP pool'], correct: [0, 2],
    explanation: 'The domain name and the RSA keys are required, along with a hostname, a user and VTY configuration.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D4', objective: '4.8', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: Telnet encrypts the username and password.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — Telnet sends everything in clear text.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: paano tandaan ang SSH setup?', back: 'HD-KUV: Hostname, Domain name, Key (crypto key generate rsa), User (username ... secret), VTY (login local + transport input ssh). TCP 22; Telnet ay 23.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'port', front: 'SSH vs Telnet ports?', back: 'SSH TCP 22 (encrypted); Telnet TCP 23 (clear text).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'command', front: 'Generate the SSH keys?', back: 'crypto key generate rsa modulus 2048 (needs hostname and ip domain-name first).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'command', front: 'VTY lines for SSH only?', back: 'line vty 0 4 → login local → transport input ssh' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'command', front: 'Force SSH version 2?', back: 'ip ssh version 2' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'command', front: 'Verify SSH?', back: 'show ip ssh (enabled and version) and show ssh (active sessions).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Replace Telnet with SSH on a router',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Enable SSH with the required prerequisites, connect from a PC and confirm Telnet is blocked.',
  topology: 'PC1 — SW1 — R1 on 10.0.0.0/24 (R1 = 10.0.0.1, PC1 = 10.0.0.10).',
  steps: [
    'Address R1 and PC1 and confirm ping works.',
    'Set hostname R1 and ip domain-name lab.local, then crypto key generate rsa modulus 2048.',
    'Create username admin secret <password> and set ip ssh version 2.',
    'Configure line vty 0 4 with login local and transport input telnet ssh; test Telnet and SSH from PC1.',
    'Change to transport input ssh and confirm Telnet is now refused.',
    'Run show ip ssh and show ssh.',
  ],
  checklist: [
    'SSH connection from PC1 succeeds',
    'Telnet refused after transport input ssh',
    'show ip ssh reports version 2.0',
  ],
  hints: [
    'If key generation fails, check the hostname and domain name.',
    'In Packet Tracer use the PC command prompt: ssh -l admin 10.0.0.1.',
  ],
  solution: [
    'The key requires hostname and domain name.',
    'login local and transport input ssh complete the VTY setup.',
  ],
  breakIt: 'Change login local to login and watch the SSH username prompt stop working.',
};
