import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'aaa';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.11',
  domain: 'D5',
  title: 'AAA: Authentication, Authorization and Accounting',
  description: 'What each of the three As means, how RADIUS and TACACS+ differ, and how a Cisco device uses a central server or local accounts for login.',
  whyMatters:
    'Hindi puwedeng may sariling password ang bawat router sa isang malaking network — imposibleng i-manage. Ang AAA ang sagot: isang central na sistema na sumasagot sa "sino ka?", "ano ang puwede mong gawin?" at "ano ang ginawa mo?". Madalas na tanong sa exam ang pagkakaiba ng RADIUS at TACACS+.',
  objectives: [
    'Define authentication, authorization and accounting with an example of each',
    'Compare RADIUS and TACACS+ (transport, encryption, separation of functions, typical use)',
    'Explain why central AAA is better than local accounts at scale',
    'Read a basic aaa new-model configuration with a fallback to local',
    'Name common authentication factors and the idea of multi-factor authentication',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['AAA', 'authentication', 'authorization', 'accounting', 'RADIUS', 'TACACS+', 'aaa new-model', 'UDP 1812', 'TCP 49', 'MFA', 'local fallback', 'ISE'],
  examObjectives: ['5.8'],
  sections: [
    {
      type: 'explain',
      simple: [
        'AAA is three questions a network asks about every user. Authentication: who are you? Authorization: what are you allowed to do? Accounting: what did you do and when?',
        'Instead of keeping separate accounts on every router, the devices ask a central AAA server. That one server holds the users, the rules and the logs. The two common protocols are RADIUS and TACACS+.',
      ],
      taglish: [
        'Ang **AAA** ay **tatlong tanong na itinatanong ng network sa bawat user**: **Authentication** — **sino ka?** **Authorization** — **ano ang puwede mong gawin?** **Accounting** — **ano ang ginawa mo at kailan?**',
        'Sa halip na **magkahiwalay na account sa bawat router**, **tinatanong ng mga device ang isang central AAA server**. Nandoon **ang mga user, ang patakaran at ang log**. Dalawang karaniwang protocol: **RADIUS** at **TACACS+**.',
        '**RADIUS**: **UDP**, **password lang ang naka-encrypt**, pinagsasama ang authentication at authorization — karaniwan sa **network access** (Wi-Fi, VPN). **TACACS+**: **TCP 49**, **buong packet naka-encrypt**, **hiwalay ang tatlong A** — karaniwan sa **device administration**.',
        'Kapag **hindi maabot ang server**, puwedeng **mag-fall back sa local account** (**local**) para hindi ka ma-lock out.',
      ],
      technical: [
        'Authentication verifies identity (password, certificate, token, biometrics). Authorization determines permitted actions after login (for example privilege level or allowed commands). Accounting records activity (login times, commands, session duration) for auditing and billing. Authentication factors: something you know, something you have, something you are; combining two or more is multi-factor authentication (MFA).',
        'RADIUS (RFC 2865/2866): UDP ports 1812/1813 (legacy 1645/1646); encrypts only the password in the Access-Request; combines authentication and authorization in one exchange; accounting is separate. Open standard, widely used for network access (802.1X, VPN, wireless). TACACS+ (Cisco-originated): TCP port 49; encrypts the entire packet body; separates authentication, authorization and accounting, enabling per-command authorization, which suits device administration.',
        'Cisco IOS configuration: aaa new-model enables AAA; radius server NAME or tacacs server NAME (address, key); aaa group server if needed; aaa authentication login default group tacacs+ local (try the server, fall back to local if it is unreachable); aaa authorization exec default group tacacs+ local; aaa accounting exec default start-stop group tacacs+. Always create a local username before enabling AAA to avoid being locked out.',
        'Local AAA uses the device user database (username <u> secret <p>) and works with login local; it does not scale and gives no central accounting. Central AAA servers (Cisco ISE, ACS, FreeRADIUS) provide one place for policy, MFA integration and audit logs. Method lists define the order of methods and the fallback.',
        'Verification: show aaa servers, show running-config | section aaa, debug aaa authentication (lab only), test aaa group tacacs+ <user> <pass> legacy. A failed server shows as DEAD; with a local fallback the login still succeeds with the local account.',
      ],
    },
    {
      type: 'analogy',
      title: 'Bangko: ID, limit at resibo',
      body: [
        'At a bank, the guard checks your ID (authentication). The teller then decides what you may do: withdraw from your own account but not open the vault (authorization). Afterwards the bank keeps a receipt of each transaction (accounting). RADIUS is a clerk who whispers only your PIN, TACACS+ is one who sits in a sealed booth.',
      ],
      taglish: [
        'Sa **bangko**, **sinusuri ng guwardiya ang ID mo** (**authentication**). Saka **nagpapasya ang teller kung ano ang puwede mong gawin**: **mag-withdraw sa sarili mong account pero hindi mabuksan ang vault** (**authorization**). Pagkatapos, **may resibo ang bangko ng bawat transaksyon** (**accounting**). Ang **RADIUS** ay **kahera na pabulong lang ang PIN mo**, ang **TACACS+** ay **nasa selyadong booth**.',
      ],
    },
    {
      type: 'hook',
      title: 'AAA = Sino? Ano? Ano ang ginawa?',
      trick: '**A**uthentication = **sino ka**. **A**uthorization = **ano ang puwede**. **A**ccounting = **ano ang ginawa**. **RADIUS** = UDP, password lang encrypted. **TACACS+** = TCP 49, lahat encrypted, hiwalay ang A.',
      taglish: [
        '**1st A** = **Sino ka?** (login). **2nd A** = **Ano ang puwede mo?** (privilege/commands). **3rd A** = **Ano ang ginawa mo?** (log).',
        '**RADIUS** = **UDP 1812/1813**, **password lang encrypted**, pinagsasama ang authN+authZ, para sa **network access**.',
        '**TACACS+** = **TCP 49**, **buong packet encrypted**, **hiwalay** ang AAA, para sa **device admin (per-command)**.',
        'Laging **local fallback** para hindi ma-lock out.',
      ],
      test: {
        question: 'Aling protocol ang gumagamit ng TCP 49 at naka-encrypt ang buong packet, at alin ang UDP na password lang ang naka-encrypt?',
        answer: 'TACACS+ ang TCP 49 na buong packet ang naka-encrypt. RADIUS ang UDP (1812/1813) na password lang ang naka-encrypt.',
      },
    },
    { type: 'diagram', id: 'aaa-radius-tacacs', caption: 'Ang device ay nagtatanong sa central AAA server gamit ang RADIUS o TACACS+; may local fallback.' },
    {
      type: 'terms',
      items: [
        { term: 'Authentication', definition: 'Verifying who a user or device is.' },
        { term: 'Authorization', definition: 'Deciding what an authenticated user may do.' },
        { term: 'Accounting', definition: 'Recording what a user did and when, for audit and billing.' },
        { term: 'RADIUS', definition: 'Open-standard AAA protocol over UDP (1812/1813); encrypts only the password; common for network access.' },
        { term: 'TACACS+', definition: 'AAA protocol over TCP 49 that encrypts the whole packet and separates the three As; common for device administration.' },
        { term: 'aaa new-model', definition: 'The global command that turns on AAA on a Cisco device.' },
        { term: 'Method list', definition: 'An ordered list of authentication methods, such as the server first and local as fallback.' },
        { term: 'MFA', definition: 'Multi-factor authentication: two or more of know, have and are.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: pag-login ng admin sa router gamit ang TACACS+',
      steps: [
        'Nag-SSH ang admin sa R1 at ibinigay ang username at password.',
        'Dahil naka-enable ang aaa new-model, itinuturo ng method list ang TACACS+ server.',
        'Ipinapadala ng R1 ang kahilingan sa server sa TCP 49 (naka-encrypt ang buong packet).',
        'Sinusuri ng server ang credentials (authentication) at ibinabalik ang privilege level 15 at pinapayagang commands (authorization).',
        'Pinapayagan ng R1 ang admin at itinatala ng server ang bawat command (accounting).',
        'Kung hindi maabot ang server, ang local username ang gagamitin bilang fallback.',
      ],
    },
    {
      type: 'cli',
      title: 'Basic AAA na may TACACS+ at local fallback',
      transcript: `R1(config)# username admin privilege 15 secret L0calFallback!
R1(config)# aaa new-model
R1(config)# tacacs server TAC1
R1(config-server-tacacs)# address ipv4 10.0.0.60
R1(config-server-tacacs)# key Sh4redKey
R1(config-server-tacacs)# exit
R1(config)# aaa authentication login default group tacacs+ local
R1(config)# aaa authorization exec default group tacacs+ local
R1(config)# aaa accounting exec default start-stop group tacacs+
R1(config)# line vty 0 4
R1(config-line)# login authentication default
R1(config-line)# end
R1# show aaa servers
TACACS+: id 1, host 10.0.0.60, port 49, state UP`,
      copyable: 'aaa authentication login default group tacacs+ local',
      explain: [
        { line: 'username admin ... secret ...', why: 'Create a local account first so you can still log in if the server is unreachable.' },
        { line: 'aaa new-model', why: 'Enables AAA; from now on logins use AAA method lists.' },
        { line: 'tacacs server TAC1 / key', why: 'Defines the TACACS+ server address and the shared secret used to encrypt packets.' },
        { line: 'aaa authentication login default group tacacs+ local', why: 'Try the TACACS+ server first, then fall back to local accounts if no server answers.' },
        { line: 'aaa accounting exec default start-stop', why: 'Records the start and stop of every exec session on the server.' },
        { line: 'state UP', why: 'The router can reach the TACACS+ server. DEAD would trigger the local fallback.' },
      ],
      note: 'Sample output for study; keys and addresses are examples.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show aaa servers', shows: 'Each AAA server, its state (UP or DEAD) and request counters.' },
        { command: 'show running-config | section aaa', shows: 'The method lists and server definitions.' },
        { command: 'show users', shows: 'Who is logged in and how they authenticated.' },
        { command: 'debug aaa authentication', shows: 'The AAA conversation during a login (lab use only).' },
      ],
      good: 'Server state UP and logins succeed with the central user; local fallback works when the server is stopped.',
      bad: 'Locked out because no local user exists, or server DEAD with no fallback method.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **RADIUS ay UDP at password lang ang naka-encrypt**; ang **TACACS+ ay TCP 49 at buong packet ang naka-encrypt, at hiwalay ang authentication, authorization at accounting**. Ito ang pinakaitinatanong sa AAA.' },
    { type: 'callout', kind: 'trap', text: 'Bago i-enable ang **aaa new-model**, **gumawa muna ng local username** at **maglagay ng "local" bilang fallback** — kung hindi, **puwede kang ma-lock out** sa sarili mong router.' },
    { type: 'callout', kind: 'tip', text: 'Para sa **per-command authorization** (kontrolin kung aling command ang puwedeng i-type ng bawat admin), **TACACS+** ang sagot. Para sa **Wi-Fi at VPN user**, **RADIUS**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagpalit ng RADIUS at TACACS+ (UDP vs TCP, encryption).',
        'Pag-enable ng aaa new-model nang walang local user at fallback.',
        'Pagkalito sa authentication at authorization.',
        'Paggamit ng parehong shared key sa lahat ng device nang hindi pinoprotektahan.',
        'Pag-iisip na ang accounting ay naghaharang ng user.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Hindi makapag-login ang admin pagkatapos ng AAA"',
      scenario: 'After enabling AAA, no administrator can log in over SSH; the TACACS+ server is down for maintenance.',
      evidence: `R1# show running-config | section aaa
aaa new-model
aaa authentication login default group tacacs+
R1# show aaa servers
TACACS+: id 1, host 10.0.0.60, port 49, state DEAD`,
      question: 'Bakit hindi makapag-login ang lahat?',
      answer: 'Walang local fallback sa method list (group tacacs+ lang), at DEAD ang server, kaya walang paraan para mag-authenticate.',
      fix: 'Pumasok sa pamamagitan ng console, saka idagdag ang local fallback: aaa authentication login default group tacacs+ local, at tiyaking may local username na naka-configure. Pag-isipan din ang hiwalay na console method na local lang para laging may daan papasok.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Aling protocol ang pipiliin mo para sa (a) Wi-Fi 802.1X login ng mga empleyado at (b) per-command na kontrol sa mga network admin, at bakit?',
      answer: '(a) RADIUS — pamantayan ito para sa network access (802.1X, VPN). (b) TACACS+ — hiwalay ang authorization kaya kayang kontrolin kada command, at naka-encrypt ang buong packet.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'AAA: authentication = who, authorization = what, accounting = what they did.',
        'RADIUS: UDP 1812/1813, encrypts password only, combines authN and authZ, network access.',
        'TACACS+: TCP 49, encrypts the whole packet, separates the three As, device administration.',
        'Use method lists with a local fallback; create a local user before aaa new-model.',
        'MFA combines two or more factors: know, have, are.',
      ],
    },
    {
      type: 'summary',
      points: [
        'AAA answers who you are, what you may do and what you did.',
        'RADIUS suits network access; TACACS+ suits device administration.',
        'Central AAA scales better than local accounts; keep a local fallback.',
        'MFA strengthens authentication.',
        'Susunod sa roadmap: VPN at security architecture.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.8', difficulty: 'easy', type: 'single',
    prompt: 'Which AAA function verifies a user\'s identity?',
    choices: ['Authorization', 'Authentication', 'Accounting', 'Auditing'], correct: [1],
    explanation: 'Authentication answers "who are you?".',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.8', difficulty: 'easy', type: 'single',
    prompt: 'Which AAA function records what a user did and when?',
    choices: ['Authentication', 'Authorization', 'Accounting', 'Encryption'], correct: [2],
    explanation: 'Accounting tracks activity for audit and billing.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.8', difficulty: 'medium', type: 'single',
    prompt: 'Which protocol uses TCP port 49 and encrypts the entire packet body?',
    choices: ['RADIUS', 'TACACS+', 'LDAP', 'Kerberos'], correct: [1],
    explanation: 'TACACS+ runs over TCP 49 and encrypts the whole packet.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.8', difficulty: 'medium', type: 'single',
    prompt: 'Which statement about RADIUS is correct?',
    choices: ['It uses TCP 49', 'It encrypts only the password and uses UDP', 'It separates all three As completely', 'It is Cisco-proprietary only'], correct: [1],
    explanation: 'RADIUS uses UDP (1812/1813), encrypts only the password and combines authentication and authorization.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.8', difficulty: 'medium', type: 'single',
    prompt: 'Which protocol is generally preferred for per-command authorization on network devices?',
    choices: ['RADIUS', 'TACACS+', 'SNMP', 'NTP'], correct: [1],
    explanation: 'TACACS+ separates authorization, enabling per-command control for device administration.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.8', difficulty: 'hard', type: 'single',
    prompt: 'What does "aaa authentication login default group tacacs+ local" do?',
    choices: ['Uses only local accounts', 'Tries the TACACS+ servers first and falls back to local accounts', 'Uses TACACS+ for accounting only', 'Disables login'], correct: [1],
    explanation: 'Methods are tried in order: the TACACS+ group first, then local if the servers do not respond.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D5', objective: '5.8', difficulty: 'medium', type: 'single',
    prompt: 'Which command enables AAA on a Cisco device?',
    choices: ['aaa new-model', 'enable aaa', 'ip aaa', 'aaa enable'], correct: [0],
    explanation: 'aaa new-model turns on AAA in global configuration.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D5', objective: '5.8', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are authentication factors?',
    choices: ['Something you know', 'Something you earn', 'Something you have', 'Something you wear'], correct: [0, 2],
    explanation: 'The classic factors are know, have and are (biometrics).',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D5', objective: '5.8', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: central AAA scales better than local user accounts on every device.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — one server manages users, policy and logs for all devices.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: paano tandaan ang AAA?', back: 'Authentication = sino ka; Authorization = ano ang puwede; Accounting = ano ang ginawa. RADIUS = UDP, password lang encrypted. TACACS+ = TCP 49, lahat encrypted, hiwalay ang A. May local fallback.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'RADIUS vs TACACS+?', back: 'RADIUS: UDP 1812/1813, encrypts password only, combines authN+authZ, network access. TACACS+: TCP 49, encrypts all, separates AAA, device administration.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'The three As?', back: 'Authentication (who), Authorization (what allowed), Accounting (what done).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'command', front: 'Basic AAA login with local fallback?', back: 'aaa new-model · aaa authentication login default group tacacs+ local (create a local user first).' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Authentication factors?', back: 'Something you know, have or are; MFA combines two or more.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'command', front: 'Verify AAA servers?', back: 'show aaa servers (UP/DEAD) and show running-config | section aaa' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'AAA with a server and a local fallback',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Configure AAA with a TACACS+/RADIUS server, log in with a central user, then stop the server and use the local fallback.',
  topology: 'R1 — SW1 — AAA server (10.0.0.60) and an admin PC (10.0.0.10).',
  steps: [
    'On the AAA server add a client for R1 with a shared key and create user netadmin.',
    'On R1 create a local user localadmin, then aaa new-model.',
    'Configure the server (radius-server host or tacacs server) and the key.',
    'Configure aaa authentication login default group tacacs+ local (or radius) and apply to the VTY lines.',
    'From the admin PC, log in with netadmin; confirm success.',
    'Turn off the AAA server and log in with localadmin to prove the fallback.',
  ],
  checklist: [
    'Central user logs in',
    'Local fallback works with the server down',
    'show aaa servers shows UP then DEAD',
  ],
  hints: [
    'Create the local user before enabling aaa new-model.',
    'The shared key must match on the server and the router.',
  ],
  solution: [
    'The method list tries the server first; if it does not answer, local is used.',
    'show aaa servers changes from UP to DEAD when the server is stopped.',
  ],
  breakIt: 'Remove the local keyword from the method list, stop the server and observe that nobody can log in.',
};
