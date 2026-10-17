import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'device-hardening';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.3',
  domain: 'D5',
  title: 'Device Hardening: Passwords, Banners and Unused Ports',
  description: 'The basic steps that lock down a new Cisco router or switch: enable secret, console and VTY passwords, password encryption, banners and shutting down unused ports.',
  whyMatters:
    'Ang bagong router ay halos bukas: walang password, lahat ng port ay naka-on. Ang device hardening ang unang depensa — at ang pinakamurang paraan ng seguridad. Sa exam, madalas ang tanong ay "anong command ang naglalagay ng password sa console?" o "bakit mas ligtas ang enable secret kaysa enable password?".',
  objectives: [
    'Configure enable secret and explain why it is preferred over enable password',
    'Protect console and VTY lines with passwords or local users',
    'Use service password-encryption and know its limits',
    'Configure login banners and explain their purpose',
    'Shut down unused switch ports and place them in an unused VLAN',
  ],
  estimatedMinutes: 35,
  difficulty: 'beginner',
  keywords: ['enable secret', 'enable password', 'service password-encryption', 'line console 0', 'line vty', 'login local', 'banner motd', 'exec-timeout', 'shutdown', 'password policy', 'type 5', 'type 7'],
  examObjectives: ['5.3', '5.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A new router or switch is wide open. Hardening means closing the obvious doors: set strong passwords, protect every way into the device, hide the passwords in the config, show a warning banner and turn off ports you do not use.',
        'The most important detail is how passwords are stored. enable secret is stored as a strong one-way hash. enable password and line passwords are stored in plain text unless you also run service password-encryption, which only applies weak, reversible scrambling.',
      ],
      taglish: [
        'Ang **bagong router o switch ay halos bukas**. Ang **hardening** ay **pagsasara ng mga halatang pinto**: **malakas na password**, **protektahan ang bawat daan papasok**, **itago ang password sa config**, **maglagay ng babalang banner**, at **patayin ang mga port na hindi ginagamit**.',
        'Pinakamahalagang detalye: **paano iniimbak ang password**. Ang **enable secret** ay naka-store bilang **malakas na one-way hash**. Ang **enable password** at ang **line password** ay **plain text** maliban kung gagamitin mo ang **service password-encryption**, na **mahinang pagtatago lang** (kayang i-reverse).',
        'Tatlong daan papasok na dapat protektahan: **console** (pisikal), **VTY** (remote, Telnet/SSH) at **privileged EXEC** (enable). Ang **banner** ay **legal na babala** na bawal ang hindi awtorisado.',
        'Sa switch, ang **mga port na walang gamit** ay dapat **i-shutdown** at ilagay sa **VLAN na walang gamit** — para hindi basta makasaksak ang attacker.',
      ],
      technical: [
        'enable secret <password> stores a salted hash (type 5 MD5, or type 8/9 with algorithm-type scrypt/sha256 on newer IOS) and overrides enable password when both exist. enable password is stored in clear text (type 0). Always use enable secret.',
        'Console: line console 0, password <pw>, login (or login local with username/secret). VTY: line vty 0 15, login local, transport input ssh. A line password with login uses a single shared password; login local checks the local username database. Add exec-timeout <min> <sec> to log out idle sessions and logging synchronous to keep output from interrupting typing.',
        'service password-encryption applies reversible type 7 obfuscation to line passwords and others that are otherwise clear text. It protects against shoulder-surfing, not an attacker who has the config, because type 7 can be decoded instantly. Use secret for anything important: username <user> secret <pw>.',
        'Banners: banner motd # text # (before login, for all connections), banner login (before the username prompt) and banner exec. Banners should state that access is restricted and monitored; never include a welcome message or device details.',
        'Port hygiene on switches: shutdown unused interfaces, assign them to an unused VLAN (not VLAN 1), set switchport mode access to prevent DTP trunk negotiation, and disable unneeded services such as CDP/LLDP on edge ports. A security password policy also sets minimum length, complexity, expiry and lockout, and is enforced with AAA or security password min-length.',
      ],
    },
    {
      type: 'analogy',
      title: 'Bahay na may maraming pinto',
      body: [
        'A house has a front door, a back door and a window. Hardening is locking all of them, not just the front door, using a deadbolt (enable secret) instead of a simple latch (enable password), putting up a "private property" sign (banner) and nailing shut the rooms nobody uses (shutdown unused ports).',
      ],
      taglish: [
        'May **harap na pinto, likod na pinto at bintana** ang bahay. Ang **hardening** ay **pag-lock ng lahat**, hindi lang ng harap; **deadbolt (enable secret)** sa halip na simpleng **trangka (enable password)**; **karatulang "pribadong pag-aari" (banner)**; at **pagsasara ng mga kuwartong walang gamit (shutdown ng unused ports)**.',
      ],
    },
    {
      type: 'hook',
      title: 'SECRET sa enable, LOCAL sa VTY, SHUT sa walang gamit',
      trick: '**enable SECRET** (hash), **login LOCAL** sa VTY, **shutdown** ang unused port, **banner** para sa babala. **Type 7 ay mahina**.',
      taglish: [
        '**Enable**: palaging **enable secret**, hindi enable password.',
        '**VTY/console**: **login local** + **username ... secret ...**, at **transport input ssh**.',
        '**service password-encryption** = **type 7**, **mahina**, nade-decode agad. Hindi ito kapalit ng secret.',
        '**Unused port**: **shutdown** + ilipat sa **unused VLAN**. At maglagay ng **banner** na babala, hindi welcome message.',
      ],
      test: {
        question: 'May enable password cisco at enable secret C0mpl3x! ang router. Alin ang gagamitin pagpasok sa privileged EXEC, at bakit?',
        answer: 'Ang enable secret, dahil mas mataas ang prayoridad nito sa enable password at naka-store bilang hash. Hindi gagana ang cisco.',
      },
    },
    { type: 'diagram', id: 'hardening-layers', caption: 'Mga daan papasok sa device: console, VTY at enable — bawat isa ay may sariling proteksyon.' },
    {
      type: 'terms',
      items: [
        { term: 'enable secret', definition: 'Hashed password for privileged EXEC; takes priority over enable password.' },
        { term: 'enable password', definition: 'Legacy privileged EXEC password stored in clear text; avoid it.' },
        { term: 'service password-encryption', definition: 'Applies weak, reversible type 7 encryption to clear-text passwords in the config.' },
        { term: 'Type 5 / Type 7', definition: 'Type 5 is a one-way hash (secret); type 7 is reversible obfuscation.' },
        { term: 'VTY lines', definition: 'Virtual terminal lines for remote Telnet/SSH access.' },
        { term: 'Banner', definition: 'A text message shown at login, used for legal warnings.' },
        { term: 'exec-timeout', definition: 'Logs out an idle session after a set time.' },
        { term: 'Unused port', definition: 'A switch port with no device; should be shut down and parked in an unused VLAN.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: pag-harden ng bagong switch',
      steps: [
        'Itakda ang hostname at ang enable secret gamit ang malakas na password.',
        'Gumawa ng local user: username admin secret <password>.',
        'Protektahan ang console: line console 0 → login local → exec-timeout 5 0.',
        'Protektahan ang remote access: line vty 0 15 → login local → transport input ssh.',
        'Ilagay ang service password-encryption at ang banner motd na may legal na babala.',
        'I-shutdown ang mga unused port (halimbawa fa0/10 - 24), ilagay sa VLAN 999 at i-save ang config.',
      ],
    },
    {
      type: 'cli',
      title: 'Mga pangunahing hardening command',
      transcript: `SW1(config)# enable secret Str0ng!Pass
SW1(config)# username admin secret Adm1n!Pass
SW1(config)# service password-encryption
SW1(config)# banner motd # Authorized access only. Activity is monitored. #
SW1(config)# line console 0
SW1(config-line)# login local
SW1(config-line)# exec-timeout 5 0
SW1(config-line)# line vty 0 15
SW1(config-line)# login local
SW1(config-line)# transport input ssh
SW1(config-line)# exit
SW1(config)# interface range fa0/10 - 24
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 999
SW1(config-if-range)# shutdown
SW1(config-if-range)# end
SW1# show running-config | include enable
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0`,
      copyable: 'enable secret Str0ng!Pass',
      explain: [
        { line: 'enable secret Str0ng!Pass', why: 'Protects privileged EXEC with a hashed password (shows as type 5 in the config).' },
        { line: 'username admin secret ...', why: 'Creates a local account whose password is stored hashed.' },
        { line: 'service password-encryption', why: 'Hides remaining clear-text passwords with weak type 7 encoding.' },
        { line: 'banner motd # ... #', why: 'Shows a legal warning to everyone who connects; the # is a delimiter.' },
        { line: 'exec-timeout 5 0', why: 'Logs out an idle console session after 5 minutes.' },
        { line: 'interface range fa0/10 - 24 → shutdown', why: 'Disables unused ports and parks them in VLAN 999 so a rogue device cannot join the network.' },
      ],
      note: 'Sample output for study; use your own strong passwords.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show running-config | include enable', shows: 'Whether enable secret is present and stored as a hash (type 5/8/9).' },
        { command: 'show running-config | section line', shows: 'Console and VTY settings: login local, exec-timeout and transport input.' },
        { command: 'show interfaces status', shows: 'Which ports are disabled and which VLAN each is in.' },
        { command: 'show users', shows: 'Who is currently logged in and from where.' },
      ],
      good: 'Secrets are hashed, every line requires login and unused ports are disabled.',
      bad: 'enable password in clear text, login with no password, or open unused ports in VLAN 1.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **enable secret** ay laging **mas matimbang** kaysa sa enable password kapag parehong naka-configure. At ang **service password-encryption (type 7) ay hindi tunay na proteksyon** — nade-decode ito agad.' },
    { type: 'callout', kind: 'trap', text: 'Ang **line password na may "login"** ay **isang shared na password** lang at **walang username**. Para sa username-based access (at SSH), gamitin ang **login local**.' },
    { type: 'callout', kind: 'tip', text: 'Ang **banner** ay para sa **legal na babala**: ipinagbabawal ang hindi awtorisadong access. Huwag maglagay ng **"Welcome"** — puwede itong gamitin laban sa iyo sa korte.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Paggamit ng enable password sa halip na enable secret.',
        'Pag-asang protektado na ng service password-encryption ang mga password.',
        'Pag-iwan ng VTY lines na walang login o gumagamit ng Telnet.',
        'Pag-iwan ng unused ports na naka-on sa VLAN 1.',
        'Paglagay ng "Welcome" sa banner.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Tumatanggap pa rin ang router ng lumang password"',
      scenario: 'An engineer set a new enable password, but people can still enter privileged mode with the old one.',
      evidence: `R1# show running-config | include enable
enable secret 5 $1$abcd$XyzXyzXyzXyz
enable password NewPass123`,
      question: 'Bakit hindi gumagana ang bagong password?',
      answer: 'May enable secret na naka-configure, at mas mataas ang prayoridad nito kaysa sa enable password. Ang password na ginagamit ng mga tao ay ang secret (luma), kaya hindi gumagana ang bagong enable password.',
      fix: 'Palitan ang enable secret ng bagong malakas na password (enable secret <new>) at burahin ang enable password gamit ang no enable password. I-verify gamit ang show running-config | include enable.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang mga command para mag-secure ng VTY lines sa 0 hanggang 4: SSH lang, local user login, at logout pagkatapos ng 3 minuto ng walang aktibidad.',
      answer: 'line vty 0 4 → login local → transport input ssh → exec-timeout 3 0. Kailangan din ng username <name> secret <password>, at ang RSA keys para gumana ang SSH.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'enable secret (hashed) overrides enable password (clear text).',
        'service password-encryption uses weak reversible type 7; it is not strong security.',
        'login local uses the local username database; login alone uses the line password.',
        'transport input ssh blocks Telnet; exec-timeout logs out idle sessions.',
        'Shut down unused ports and move them to an unused VLAN; use a legal-warning banner.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Set enable secret and protect console and VTY lines.',
        'Use login local with SSH and local users stored with secret.',
        'Type 7 encryption is weak; use hashing for anything important.',
        'Banner for legal warning; shutdown unused ports.',
        'Susunod: ACL fundamentals — kung paano sinasala ng router ang trapiko.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.3', difficulty: 'easy', type: 'single',
    prompt: 'Which command secures privileged EXEC with a hashed password?',
    choices: ['enable password', 'enable secret', 'line password', 'service password-encryption'], correct: [1],
    explanation: 'enable secret stores the password as a one-way hash and is the recommended command.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.3', difficulty: 'medium', type: 'single',
    prompt: 'Both enable password and enable secret are configured. Which is used?',
    choices: ['enable password', 'enable secret', 'Both must be entered', 'Neither'], correct: [1],
    explanation: 'enable secret has priority over enable password.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.3', difficulty: 'medium', type: 'single',
    prompt: 'What does service password-encryption do?',
    choices: ['Applies strong hashing to all passwords', 'Applies weak reversible encryption to clear-text passwords', 'Encrypts all traffic', 'Disables Telnet'], correct: [1],
    explanation: 'It applies reversible type 7 obfuscation, which is not strong protection.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.3', difficulty: 'medium', type: 'single',
    prompt: 'Which VTY configuration allows only SSH and authenticates against local users?',
    choices: ['login / transport input telnet', 'login local / transport input ssh', 'no login / transport input all', 'password cisco / transport input none'], correct: [1],
    explanation: 'login local uses the local user database and transport input ssh restricts to SSH.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.3', difficulty: 'medium', type: 'single',
    prompt: 'Which is the best practice for unused switch ports?',
    choices: ['Leave them in VLAN 1 and enabled', 'Shut them down and place them in an unused VLAN', 'Enable PortFast on all of them', 'Make them trunks'], correct: [1],
    explanation: 'Disabling unused ports and parking them in an unused VLAN reduces the attack surface.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.3', difficulty: 'easy', type: 'single',
    prompt: 'What should a login banner contain?',
    choices: ['A friendly welcome message', 'A legal warning that unauthorised access is prohibited', 'The device model and IOS version', 'The enable password'], correct: [1],
    explanation: 'A banner should warn that access is restricted and monitored, without revealing device details.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.4', difficulty: 'hard', type: 'single',
    prompt: 'Which password policy element helps limit brute-force attacks?',
    choices: ['Short passwords', 'Account lockout after repeated failures', 'Sharing one password', 'Never changing passwords'], correct: [1],
    explanation: 'Lockout (and long, complex passwords with MFA) slows or stops brute-force attempts.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.3', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO commands improve the security of remote access?',
    choices: ['transport input ssh', 'transport input telnet', 'exec-timeout 5 0', 'no login'], correct: [0, 2],
    explanation: 'SSH-only transport and an idle timeout both reduce risk; Telnet and no login are insecure.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D5', objective: '5.3', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: type 7 passwords are as secure as type 5 hashes.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — type 7 is reversible and can be decoded easily; type 5 is a one-way hash.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: paano tandaan ang hardening?', back: 'enable SECRET (hash), login LOCAL sa VTY + transport input ssh, SHUTDOWN ang unused port, banner = legal na babala. Type 7 ay mahina.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'command', front: 'Hashed privileged EXEC password?', back: 'enable secret <password> (preferred over enable password).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'command', front: 'Secure VTY lines?', back: 'line vty 0 15 → login local → transport input ssh → exec-timeout 5 0' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What does service password-encryption do?', back: 'Applies weak, reversible type 7 encryption to clear-text passwords; not strong security.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'command', front: 'Banner command?', back: 'banner motd # message #  (legal warning, no welcome text)' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What to do with unused switch ports?', back: 'Shut them down, set access mode and move them to an unused VLAN.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Harden a new switch',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Apply the baseline hardening checklist to a switch and verify each item.',
  steps: [
    'Set the hostname and enable secret on SW1.',
    'Create a local user with username admin secret <password>.',
    'Configure line console 0 with login local and exec-timeout 5 0.',
    'Configure line vty 0 4 with login local and transport input ssh (after generating RSA keys).',
    'Add service password-encryption and a legal-warning banner motd.',
    'Shut down Fa0/10 - 24 and move them to VLAN 999, then run the verification commands.',
  ],
  checklist: [
    'enable secret shows as a hash',
    'Console and VTY require login local',
    'Banner appears on login',
    'Unused ports are shut down in VLAN 999',
  ],
  hints: [
    'Generate the RSA key before testing SSH.',
    'Use show running-config | section line to review the lines quickly.',
  ],
  solution: [
    'show running-config shows enable secret 5, username admin secret 5, and the line settings.',
    'show interfaces status lists Fa0/10 - 24 as disabled in VLAN 999.',
  ],
  breakIt: 'Add enable password cisco as well and show that the secret still takes priority, then remove it.',
};
