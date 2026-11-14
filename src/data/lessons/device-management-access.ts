import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'device-management-access';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.16',
  domain: 'D2',
  title: 'Device Management Access: Console, Telnet, SSH, HTTP(S), AAA and Cloud Managed',
  description: 'Compare in-band and out-of-band management, secure versus insecure protocols, AAA-based login with TACACS+ or RADIUS and cloud-managed devices.',
  whyMatters:
    'Ito ang objective 2.8 ng opisyal na syllabus. Ang tanong ay laging pareho: “aling paraan ng pag-access ang ligtas?” at “aling protocol ang gumagamit ng anong port?” Pagsamahin mo ang console, Telnet, SSH, HTTP, HTTPS, TACACS+/RADIUS at cloud-managed sa isang malinaw na talaan at tapos na.',
  objectives: [
    'Distinguish out-of-band (console) from in-band (Telnet, SSH, HTTP, HTTPS) management',
    'Identify secure and insecure management protocols and their ports',
    'Configure VTY lines for SSH only and secure the HTTP server',
    'Explain how TACACS+ and RADIUS provide centralised login control',
    'Describe cloud-managed devices and how they are accessed',
  ],
  estimatedMinutes: 35,
  difficulty: 'exam',
  keywords: ['console', 'Telnet', 'SSH', 'HTTP', 'HTTPS', 'TACACS+', 'RADIUS', 'cloud managed', 'Meraki', 'out-of-band', 'in-band', 'VTY', 'transport input ssh', 'ip http secure-server', 'AAA'],
  examObjectives: ['2.8'],
  sections: [
    {
      type: 'explain',
      simple: [
        'You can manage a device through the console cable (out-of-band) or over the network (in-band) with Telnet, SSH, HTTP or HTTPS. Telnet and HTTP send everything in clear text; SSH and HTTPS are encrypted.',
        'Large networks add TACACS+ or RADIUS so logins are checked centrally, and some networks use cloud-managed devices controlled from a web dashboard.',
      ],
      taglish: [
        'Pwede mong pamahalaan ang device sa pamamagitan ng **console cable (out-of-band)** o sa **network (in-band)** gamit ang **Telnet, SSH, HTTP o HTTPS**. Ang **Telnet at HTTP** ay **plain text**; ang **SSH at HTTPS** ay **naka-encrypt**.',
        'Sa malaking network, idinadagdag ang **TACACS+ o RADIUS** para sentral ang pagsusuri ng login. May mga network ding gumagamit ng **cloud-managed** na device na kinokontrol sa **web dashboard**.',
        'Mga port: **Telnet TCP 23**, **SSH TCP 22**, **HTTP TCP 80**, **HTTPS TCP 443**, **TACACS+ TCP 49**, **RADIUS UDP 1812/1813**.',
      ],
      technical: [
        'Out-of-band management uses the console (or AUX) port, which does not depend on the network being up; it is used for first configuration and recovery. In-band management uses the network and therefore needs IP reachability: Telnet (TCP 23, clear text), SSH (TCP 22, encrypted, version 2 preferred), HTTP (TCP 80, clear text GUI) and HTTPS (TCP 443, encrypted GUI).',
        'Secure practice: disable Telnet (transport input ssh on the VTY lines), enable SSH with a hostname, domain name and RSA keys, use no ip http server and ip http secure-server for the GUI, and protect lines with ACLs (access-class). Logins can be authenticated locally (username and secret) or centrally through AAA with TACACS+ or RADIUS.',
        'TACACS+ (Cisco, TCP 49) encrypts the whole packet body and separates authentication, authorization and accounting, which makes per-command authorization possible; RADIUS (open standard, UDP 1812 for authentication and 1813 for accounting) encrypts only the password and combines authentication and authorization. Cloud-managed devices (such as Cisco Meraki) connect out to a cloud controller over HTTPS; administrators manage them in a web dashboard, with no need for local controllers.',
      ],
    },
    {
      type: 'analogy',
      title: 'Pinto ng bahay',
      body: [
        'The console port is the key to the front door: you must be physically there, but it always works. SSH is a locked intercom, Telnet is shouting through an open window. A central guard with the guest list (TACACS+/RADIUS) decides who gets in, and a cloud-managed device is like a house whose lock is controlled by the company’s office.',
      ],
      taglish: [
        'Ang **console** ay **susi sa harap ng pinto**: kailangan kang nandoon mismo pero laging gumagana. Ang **SSH** ay **naka-lock na intercom**; ang **Telnet** ay **sumisigaw sa bukas na bintana**. Ang **sentral na guwardiya na may listahan ng bisita (TACACS+/RADIUS)** ang nagpapasya kung sino ang papasok, at ang **cloud-managed** ay parang bahay na ang kandado ay kontrolado ng opisina ng kompanya.',
      ],
    },
    {
      type: 'hook',
      title: '22 safe, 23 hubad, 443 safe, 80 hubad',
      trick: '**SSH 22 ✔ · Telnet 23 ✘ · HTTPS 443 ✔ · HTTP 80 ✘ · Console = out-of-band · TACACS+ 49 (TCP, buong encrypt) · RADIUS 1812/1813 (UDP, password lang).**',
      taglish: [
        '**Ligtas**: SSH (22), HTTPS (443). **Hindi ligtas**: Telnet (23), HTTP (80).',
        '**Console** = **out-of-band**, kahit patay ang network ay gumagana; **Telnet/SSH/HTTP(S)** = **in-band**.',
        '**TACACS+** = TCP 49, buong packet encrypted, hiwalay ang AAA. **RADIUS** = UDP 1812/1813, password lang ang encrypted.',
        '**Cloud-managed** = device na kumokonekta sa cloud dashboard sa HTTPS (hal. Meraki).',
      ],
      test: {
        question: 'Aling dalawang paraan ng pag-access ang naka-encrypt, at anong port ang bawat isa?',
        answer: 'SSH (TCP 22) at HTTPS (TCP 443).',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Out-of-band laban sa in-band',
      paragraphs: [
        '**Out-of-band**: console (RJ-45 o USB, 9600 baud 8N1 bilang default) o AUX para sa modem. Hindi ito umaasa sa network — gamit para sa unang configuration, password recovery at kapag bumagsak ang network. Kailangan ng pisikal na koneksyon o console server.',
        '**In-band**: dumadaan sa network at kailangang may IP connectivity at nakabukas na serbisyo. **Telnet** (TCP 23) ay plain text, kaya mababasa ang username at password sa packet capture. **SSH** (TCP 22) ay naka-encrypt (gamitin ang version 2). **HTTP/HTTPS** ay para sa web GUI.',
        'Panuntunan sa seguridad: **iwasan ang Telnet**, gumamit ng **SSH**, patayin ang HTTP at gumamit ng **HTTPS**, limitahan ang access gamit ang ACL (access-class) at ihiwalay ang management network.',
      ],
      steps: [
        'Unang configuration: console.',
        'Magtakda ng management IP at default gateway.',
        'I-enable ang SSH at isara ang Telnet (transport input ssh).',
        'I-enable ang HTTPS GUI at patayin ang HTTP.',
        'Limitahan ang pinagmumulan gamit ang access-class.',
      ],
      tricks: [
        'Kapag “hindi na maabot ang router sa network”, console (out-of-band) ang daan.',
        'Ang AUX ay para sa modem; bihirang gamit ngayon.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: SSH only, HTTPS at AAA',
      paragraphs: [
        'SSH setup: `hostname R1`, `ip domain-name lab.local`, `crypto key generate rsa modulus 2048`, `username admin secret …`, `ip ssh version 2`, at sa VTY: `line vty 0 4`, `login local`, `transport input ssh`. Ang `transport input ssh` ang nagsasara ng Telnet.',
        'GUI: `no ip http server` (patayin ang HTTP) at `ip http secure-server` (HTTPS). Para sa pagsusuri ng login sa server: `aaa new-model`, `tacacs server TAC1` / `address ipv4 10.0.0.30` / `key …`, at `aaa authentication login default group tacacs+ local` — ang `local` sa dulo ay **fallback** kapag hindi maabot ang server.',
        '**TACACS+ vs RADIUS**: TACACS+ (Cisco) — TCP 49, buong packet encrypted, hiwalay ang authentication, authorization at accounting (kaya may per-command authorization para sa admin). RADIUS (open standard) — UDP 1812/1813, password lang ang encrypted, pinagsasama ang authentication at authorization; karaniwan sa network access (802.1X, Wi-Fi).',
      ],
      steps: [
        'hostname, ip domain-name at crypto key generate rsa.',
        'username/secret at ip ssh version 2.',
        'line vty 0 4 → login local → transport input ssh.',
        'no ip http server; ip http secure-server.',
        'AAA: aaa new-model, server, aaa authentication login default group tacacs+ local.',
      ],
      tricks: [
        'Gumawa muna ng local user bago ang `aaa new-model` para hindi ka ma-lock out.',
        'Sa exam: “per-command authorization” = TACACS+.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 3: Cloud-managed na device',
      paragraphs: [
        'Ang **cloud-managed** na network (hal. **Cisco Meraki**) ay may mga AP, switch at router na **kumokonekta palabas sa cloud** sa pamamagitan ng HTTPS at kinokontrol sa isang **web dashboard**. Hindi kailangan ng lokal na controller; ang configuration ay itinutulak mula sa cloud, at ang software update ay awtomatiko.',
        'Pakinabang: **madaling pamahalaan ang maraming site**, mabilis na deployment (zero-touch) at sentral na visibility. Konsiderasyon: kailangan ng **internet connectivity** para sa management (patuloy ang data forwarding kahit offline, pero hindi mababago ang configuration), at may **subscription/license**.',
        'Ihambing: **on-premises controller** (WLC, Catalyst Center) = sarili mong kagamitan; **cloud-managed** = controller sa cloud; **autonomous** = isa-isang device.',
      ],
      steps: [
        'Ang device ay kumokonekta sa internet at sa cloud service.',
        'Ang administrator ay nagla-login sa web dashboard (HTTPS).',
        'Ang configuration ay itinutulak sa device mula sa cloud.',
        'Ang device ay patuloy na nagpapasa ng trapiko kahit pansamantalang offline sa cloud.',
      ],
      tricks: [
        'Kapag “walang on-site controller at web dashboard” → cloud-managed.',
        'Hindi ito pumapalit sa seguridad ng account: gumamit ng MFA sa dashboard.',
      ],
    },
    {
      type: 'remember',
      title: 'Device management na lumalabas sa exam',
      items: [
        '**Console = out-of-band; Telnet, SSH, HTTP, HTTPS = in-band.**',
        '**Ligtas: SSH (TCP 22), HTTPS (TCP 443). Hindi ligtas: Telnet (TCP 23), HTTP (TCP 80).**',
        '**transport input ssh = isara ang Telnet sa VTY.** **ip http secure-server = HTTPS GUI.**',
        '**TACACS+ = TCP 49, buong packet encrypted, hiwalay ang AAA. RADIUS = UDP 1812/1813, password lang.**',
        '**Cloud-managed = kinokontrol sa web dashboard sa cloud (hal. Meraki).**',
      ],
    },
    { type: 'diagram', id: 'ssh-vs-telnet', caption: 'Telnet (plain text) laban sa SSH (encrypted).' },
    {
      type: 'terms',
      items: [
        { term: 'Out-of-band management', definition: 'Managing a device through a dedicated path such as the console, independent of the data network.' },
        { term: 'In-band management', definition: 'Managing a device over the production network using Telnet, SSH or a web interface.' },
        { term: 'Telnet', definition: 'Clear-text remote CLI on TCP 23.' },
        { term: 'SSH', definition: 'Encrypted remote CLI on TCP 22.' },
        { term: 'TACACS+', definition: 'Cisco AAA protocol on TCP 49 that encrypts the entire payload and separates AAA functions.' },
        { term: 'RADIUS', definition: 'Open-standard AAA protocol on UDP 1812/1813 that encrypts only the password.' },
        { term: 'Cloud-managed', definition: 'Devices configured and monitored from a cloud dashboard.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ligtas na pag-access sa device',
      steps: [
        'Unang configuration sa console.',
        'Magtakda ng hostname, domain, RSA key at lokal na user.',
        'Paganahin ang SSH at isara ang Telnet sa VTY.',
        'Palitan ang HTTP ng HTTPS para sa GUI.',
        'Idagdag ang TACACS+/RADIUS na may local fallback para sa sentral na kontrol.',
      ],
    },
    {
      type: 'cli',
      title: 'SSH-only na VTY at HTTPS GUI',
      transcript: `R1(config)# hostname R1
R1(config)# ip domain-name lab.local
R1(config)# crypto key generate rsa modulus 2048
R1(config)# username admin secret S3cure!Pass
R1(config)# ip ssh version 2
R1(config)# line vty 0 4
R1(config-line)# login local
R1(config-line)# transport input ssh
R1(config)# no ip http server
R1(config)# ip http secure-server
R1# show ip ssh
SSH Enabled - version 2.0`,
      copyable: 'ip domain-name lab.local\ncrypto key generate rsa modulus 2048\nip ssh version 2\nline vty 0 4\nlogin local\ntransport input ssh\nno ip http server\nip http secure-server\nshow ip ssh',
      explain: [
        { line: 'transport input ssh', why: 'Allows only SSH on the VTY lines; Telnet connections are refused.' },
        { line: 'no ip http server', why: 'Turns off the clear-text HTTP GUI.' },
        { line: 'ip http secure-server', why: 'Enables the encrypted HTTPS GUI.' },
        { line: 'show ip ssh', why: 'Confirms that SSH is enabled and shows the version.' },
      ],
      note: 'Use your own strong password; the one above is a placeholder.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **console ay out-of-band**; hindi ito umaasa sa network. Ang **SSH at Telnet ay in-band** at nangangailangan ng IP connectivity.' },
    { type: 'callout', kind: 'trap', text: 'Ang **TACACS+ ay TCP 49**; ang **RADIUS ay UDP 1812/1813**. Madalas silang pagpalitan sa exam.' },
    { type: 'callout', kind: 'tip', text: 'Para sa tanong na “paano mo maaabot ang router na nawalan ng network?”, ang sagot ay console (out-of-band).' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Leaving Telnet enabled on VTY lines.',
        'Using HTTP instead of HTTPS for the device GUI.',
        'Confusing TACACS+ (TCP 49) with RADIUS (UDP 1812/1813).',
        'Enabling AAA without a local fallback user.',
        'Forgetting that cloud-managed devices need internet access for management.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Hindi makapag-SSH',
      scenario: 'An administrator can ping a router but SSH connections are refused, while Telnet works.',
      evidence: `R1# show running-config | section vty
line vty 0 4
 login local
 transport input telnet`,
      question: 'Ano ang mali?',
      answer: 'The VTY lines allow only Telnet (transport input telnet), so SSH is refused.',
      fix: 'Set transport input ssh, make sure the domain name, RSA keys and a local user exist, verify with show ip ssh, then close Telnet access.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Gusto mong pigilan ang Telnet, payagan ang SSH lang, at ang login ay susuriin sa TACACS+ server na may lokal na fallback. Ilista ang mga command.',
      answer: 'line vty 0 4 / transport input ssh; aaa new-model; tacacs server TAC1 with address and key; aaa authentication login default group tacacs+ local (after creating a local user and enabling SSH with RSA keys).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Console is out-of-band; everything else is in-band.',
        'SSH 22 and HTTPS 443 are secure; Telnet 23 and HTTP 80 are not.',
        'transport input ssh disables Telnet.',
        'TACACS+ TCP 49 vs RADIUS UDP 1812/1813.',
        'Cloud-managed devices use a web dashboard.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Out-of-band uses the console; in-band uses the network.',
        'Use SSH and HTTPS; avoid Telnet and HTTP.',
        'AAA with TACACS+ or RADIUS centralises logins.',
        'Cloud-managed devices are controlled from a dashboard.',
        'Always keep a local fallback.',
        'Susunod: host route sa static routing at troubleshooting.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.8', difficulty: 'easy', type: 'single',
    prompt: 'Which management method is out-of-band?',
    choices: ['SSH', 'Telnet', 'Console', 'HTTPS'], correct: [2],
    explanation: 'The console port does not depend on the network, so it is out-of-band.',
    wrong: { 0: 'SSH is in-band.', 1: 'Telnet is in-band.', 3: 'HTTPS is in-band.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.8', difficulty: 'medium', type: 'single',
    prompt: 'Which command allows only SSH on the VTY lines?',
    choices: ['transport input telnet', 'transport input ssh', 'login local', 'access-class 10 in'], correct: [1],
    explanation: 'transport input ssh permits SSH and blocks Telnet.',
    wrong: { 0: 'That permits Telnet only.', 2: 'login local selects local authentication.', 3: 'access-class restricts source addresses.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.8', difficulty: 'medium', type: 'single',
    prompt: 'Which protocol encrypts the entire packet payload and uses TCP port 49?',
    choices: ['RADIUS', 'TACACS+', 'SNMP', 'Telnet'], correct: [1],
    explanation: 'TACACS+ uses TCP 49 and encrypts the full body.',
    wrong: { 0: 'RADIUS uses UDP 1812/1813 and encrypts only the password.', 2: 'SNMP uses UDP 161/162.', 3: 'Telnet is clear text on TCP 23.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.8', difficulty: 'hard', type: 'single',
    prompt: 'What characterises a cloud-managed network device?',
    choices: ['It must be configured only through the console', 'It is managed from a web dashboard hosted in the cloud', 'It does not forward traffic when offline', 'It cannot use HTTPS'], correct: [1],
    explanation: 'Cloud-managed devices connect to a cloud service and are configured through a web dashboard.',
    wrong: { 0: 'Console is not required.', 2: 'Forwarding usually continues during an outage.', 3: 'HTTPS is used for the management connection.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.8', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: Telnet encrypts the session between the administrator and the device.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'Telnet sends everything, including passwords, in clear text.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.8', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO management protocols are secure?',
    choices: ['SSH', 'HTTPS', 'Telnet', 'HTTP'], correct: [0, 1],
    explanation: 'SSH and HTTPS encrypt the session; Telnet and HTTP do not.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'port', front: 'Pro tip: mga port at uri ng management?', back: 'SSH 22 ✔ · Telnet 23 ✘ · HTTPS 443 ✔ · HTTP 80 ✘ · Console = out-of-band · TACACS+ 49 (TCP) · RADIUS 1812/1813 (UDP).' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'In-band vs out-of-band?', back: 'In-band uses the production network; out-of-band uses a separate path such as the console.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'command', front: 'Which command closes Telnet on the VTY lines?', back: 'transport input ssh.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'command', front: 'Which commands give a secure web GUI?', back: 'no ip http server and ip http secure-server.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'protocol', front: 'TACACS+ vs RADIUS?', back: 'TACACS+: TCP 49, full payload encryption, separate AAA. RADIUS: UDP 1812/1813, password only.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What is a cloud-managed device?', back: 'A device managed from a cloud dashboard (for example Meraki).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Why keep a local user with AAA?', back: 'As a fallback when the AAA server cannot be reached.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Lock down management access',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Enable SSH, close Telnet, secure the web GUI and add a local AAA login, then prove each change.',
  steps: [
    'Build a router and a PC. Give both IP addresses on the same subnet and confirm Telnet works with a VTY password.',
    'Configure hostname, domain name, a local user and RSA keys; enable ip ssh version 2.',
    'Set the VTY lines to login local and transport input ssh; test that Telnet is refused and SSH works.',
    'Disable the HTTP server and enable the HTTPS server (if available) and note the difference.',
    'Add aaa new-model with a local login list and test that logins still work.',
    'Add an ACL with access-class that allows only the PC to reach the VTY lines.',
  ],
  checklist: [
    'Telnet refused',
    'SSH working',
    'HTTP replaced by HTTPS',
    'Local AAA login working',
    'access-class restriction tested',
  ],
  hints: [
    'show ip ssh confirms the SSH version.',
    'Create a local user before aaa new-model.',
  ],
  solution: [
    'ip domain-name, crypto key generate rsa, username admin secret …, ip ssh version 2.',
    'line vty 0 4 → login local → transport input ssh.',
    'no ip http server; ip http secure-server; aaa authentication login default local.',
  ],
  breakIt: 'Enable aaa new-model before creating a local user and describe what happens to your next login attempt.',
};
