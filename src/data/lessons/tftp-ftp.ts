import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'tftp-ftp';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.12',
  domain: 'D4',
  title: 'TFTP and FTP: Moving Files to and from Devices',
  description: 'How network engineers back up configurations and upgrade IOS images with TFTP and FTP, and how the two protocols differ.',
  whyMatters:
    'Bago mag-upgrade ng IOS o mag-reset ng router, kailangan mong i-backup ang config at magkaroon ng kopya ng image — at ginagawa ito sa pamamagitan ng file transfer. Sa exam, ang tanong ay madalas "alin ang gumagamit ng UDP 69?" o "alin ang may authentication?" — kaya kailangan mong malinaw ang pagkakaiba ng TFTP at FTP.',
  objectives: [
    'Explain what TFTP and FTP are used for on network devices',
    'Compare TFTP (UDP 69, no authentication) with FTP (TCP 20/21, with login)',
    'Describe FTP control and data connections (active and passive)',
    'Use copy commands to back up and restore a configuration with TFTP',
    'Explain why neither protocol encrypts data and what to use instead',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['TFTP', 'FTP', 'UDP 69', 'TCP 21', 'TCP 20', 'copy running-config tftp', 'IOS image', 'backup', 'SFTP', 'FTPS'],
  examObjectives: ['4.9'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Sooner or later you must copy a file to or from a router or switch: a configuration backup, or a new IOS image. TFTP and FTP are the two classic ways to do it.',
        'TFTP is tiny and has no login, so it is quick and easy but not secure. FTP is bigger, asks for a username and password and can list folders, but still sends everything in clear text.',
      ],
      taglish: [
        'Darating ang araw na kailangan mong **mag-kopya ng file papunta o galing sa router o switch**: **backup ng configuration** o **bagong IOS image**. Ang **TFTP** at **FTP** ang dalawang klasikong paraan.',
        'Ang **TFTP** ay **maliit at walang login**, kaya **mabilis at madali** pero **hindi ligtas**. Ang **FTP** ay mas malaki, **humihingi ng username at password** at kayang magpakita ng listahan ng folder — pero **plain text** pa rin ang lahat.',
        'Mga port: **TFTP = UDP 69**. **FTP = TCP 21** (control) at **TCP 20** (data, sa active mode).',
        'Parehong **hindi naka-encrypt**. Kapag kailangan ng seguridad, gamitin ang **SFTP** (sa ibabaw ng SSH) o **FTPS** (FTP na may TLS).',
      ],
      technical: [
        'TFTP (Trivial FTP, RFC 1350) uses UDP port 69 for the initial request, then a random UDP port for the transfer. It has no authentication, no directory listing and transfers fixed 512-byte blocks, each acknowledged. It is simple enough to run from a boot loader, which is why it is used for network booting and IOS recovery (ROMMON).',
        'FTP (RFC 959) uses TCP. A control connection on port 21 carries commands and replies; a separate data connection carries files. In active mode the server opens the data connection from port 20 to the client; in passive mode the client opens a second connection to a port the server announces, which suits firewalls and NAT.',
        'FTP requires a username and password, supports directory listing and ASCII/binary modes, but credentials and data cross the network in clear text. Secure alternatives are SFTP (SSH File Transfer Protocol, TCP 22) and FTPS (FTP over TLS). Cisco also supports SCP (copy over SSH).',
        'Cisco IOS commands: copy running-config tftp: (back up), copy tftp: running-config (restore; merges into the running config), copy startup-config tftp:, copy flash: tftp: (save the IOS image), copy tftp: flash: (upgrade). The router prompts for the server address and filename. For FTP, set ip ftp username <user> and ip ftp password <pass> first, then copy running-config ftp:.',
        'Verification: dir flash: (images and free space), verify /md5 flash:<image> to check integrity, show flash:, and show version for the running image. Always confirm the server is reachable with ping before copying.',
      ],
    },
    {
      type: 'analogy',
      title: 'Paluwagan ng sulat: postcard vs rehistradong sulat',
      body: [
        'TFTP is dropping a postcard in the mailbox: no questions, fast, anyone can read it. FTP is a registered letter at the post office: you show an ID, the clerk can tell you what is in the box, but the letter itself is still not sealed. SFTP is a sealed, locked parcel.',
      ],
      taglish: [
        'Ang **TFTP** ay **postcard na inihulog sa mailbox**: **walang tanong, mabilis, nababasa ng kahit sino**. Ang **FTP** ay **rehistradong sulat sa post office**: **magpapakita ka ng ID**, masasabi ng clerk kung ano ang nasa kahon, pero **hindi pa rin selyado** ang sulat. Ang **SFTP** ay **selyado at naka-lock na pakete**.',
      ],
    },
    {
      type: 'hook',
      title: 'TFTP 69 walang login, FTP 21 may login',
      trick: '**TFTP** = **T**iny, **UDP 69**, **walang login**. **FTP** = **TCP 21 (control) + 20 (data)**, **may login**. Pareho **plain text**.',
      taglish: [
        '**TFTP**: **T**iny, **UDP 69**, **walang authentication**, walang listahan ng folder.',
        '**FTP**: **TCP 21** para sa utos, **TCP 20** para sa data (active mode), **may username/password**.',
        'Pareho **hindi naka-encrypt**. Ligtas na bersyon: **SFTP** (SSH, TCP 22) o **FTPS**.',
        'Sa Cisco: **copy running-config tftp:** = backup. **copy tftp: running-config** = restore.',
      ],
      test: {
        question: 'Aling file transfer protocol ang gumagamit ng UDP 69 at walang authentication, at alin ang may login pero plain text pa rin?',
        answer: 'Ang TFTP ay UDP 69 na walang authentication. Ang FTP ay may username at password (TCP 21 control, 20 data) pero plain text pa rin ang lahat.',
      },
    },
    { type: 'diagram', id: 'tftp-vs-ftp', caption: 'TFTP: isang UDP 69 na transfer, walang login. FTP: control sa TCP 21 at data sa TCP 20, may login.' },
    {
      type: 'terms',
      items: [
        { term: 'TFTP', definition: 'Trivial File Transfer Protocol: simple, unauthenticated file transfer over UDP port 69.' },
        { term: 'FTP', definition: 'File Transfer Protocol: login-based file transfer over TCP; control on 21, data on 20 (active mode).' },
        { term: 'Control connection', definition: 'The FTP channel on port 21 that carries commands and replies.' },
        { term: 'Data connection', definition: 'The separate FTP channel that carries the file or a directory listing.' },
        { term: 'Passive mode', definition: 'FTP mode where the client opens the data connection, friendlier to firewalls and NAT.' },
        { term: 'SFTP / FTPS', definition: 'Secure alternatives: file transfer over SSH, or FTP protected by TLS.' },
        { term: 'IOS image', definition: 'The operating system file for a Cisco device, stored in flash.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: pag-backup ng config gamit ang TFTP',
      steps: [
        'Pinapatakbo ang TFTP server sa PC na 10.0.0.50 at tinitiyak na maaabot ito ng router (ping).',
        'Sa R1, ina-enter ang copy running-config tftp:.',
        'Tinatanong ng router ang address ng remote host: 10.0.0.50, at ang filename: R1-confg.',
        'Nagpapadala ang R1 ng write request sa UDP 69 ng server.',
        'Inililipat ang config sa mga bloke na 512 bytes, at ina-acknowledge ang bawat isa.',
        'Lumalabas ang “bytes copied” at nakikita ang R1-confg sa folder ng TFTP server.',
      ],
    },
    {
      type: 'cli',
      title: 'Backup at restore gamit ang TFTP at FTP',
      transcript: `R1# ping 10.0.0.50
!!!!!
R1# copy running-config tftp:
Address or name of remote host []? 10.0.0.50
Destination filename [r1-confg]? R1-backup.cfg
!!
1021 bytes copied in 0.9 secs
R1# dir flash:
-rw-  67685116  c2900-universalk9-mz.SPA.156-3.M.bin
R1(config)# ip ftp username admin
R1(config)# ip ftp password Str0ngPass!
R1(config)# end
R1# copy flash:c2900-universalk9-mz.SPA.156-3.M.bin ftp:`,
      copyable: 'copy running-config tftp:',
      explain: [
        { line: 'ping 10.0.0.50', why: 'Always prove the server is reachable before you copy anything.' },
        { line: 'copy running-config tftp:', why: 'Starts a backup of the active configuration to a TFTP server; IOS then asks for the server and filename.' },
        { line: 'Destination filename [r1-confg]?', why: 'The name of the file on the server; press Enter to accept the default.' },
        { line: 'dir flash:', why: 'Lists the IOS image and free space, so you know what you can back up or replace.' },
        { line: 'ip ftp username / password', why: 'FTP needs credentials; these tell IOS what to send. They are stored in the config, so protect it.' },
      ],
      note: 'Sample output for study. File names and sizes will differ.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **TFTP ay UDP 69**, hindi TCP. Ang **FTP ay TCP**. Kapag may tanong na **"alin ang walang authentication?"**, **TFTP** iyon. Huwag ding sabihing **ligtas** ang FTP — **plain text** ito.' },
    { type: 'callout', kind: 'tip', text: 'Ang **copy tftp: running-config** ay **nagme-merge** sa umiiral na config, hindi pumapalit nang buo. Para sa buong pagpalit, **copy sa startup-config at mag-reload**.' },
    { type: 'callout', kind: 'tip', text: 'Bago mag-upgrade ng IOS, tingnan ang **dir flash:** para sa **free space** at gamitin ang **verify /md5** para matiyak na **hindi sira ang file**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagkalito sa UDP 69 (TFTP) at TCP 21 (FTP).',
        'Pag-akalang naka-encrypt ang FTP.',
        'Hindi pag-ping sa server bago mag-copy.',
        'Pag-upgrade ng IOS nang walang sapat na espasyo sa flash.',
        'Paglimot sa pag-allow ng TFTP traffic sa firewall o ACL.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Hindi makopya ang config sa TFTP"',
      scenario: 'An engineer tries to back up R1 to a TFTP server but the copy keeps timing out.',
      evidence: `R1# copy running-config tftp:
Address or name of remote host []? 10.0.0.50
Destination filename [r1-confg]?
%Error opening tftp://10.0.0.50/r1-confg (Timed out)
R1# ping 10.0.0.50
.....
Success rate is 0 percent (0/5)`,
      question: 'Saan ang problema at paano ito aayusin?',
      answer: 'Hindi naaabot ang server: 0 percent ang ping. Hindi problema ng TFTP mismo kundi ng koneksyon — maling IP, routing, o naharang ng firewall/ACL.',
      fix: 'Ayusin muna ang reachability: tingnan ang IP ng server, default gateway ng router, routing at kung may ACL na humaharang sa UDP 69. Tiyaking tumatakbo ang TFTP server at may write permission ang folder. Kapag nagpa-ping na, ulitin ang copy.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Kailangan mong ilipat ang IOS image sa isang switch sa labas ng opisina sa internet. Bakit hindi mo gagamitin ang TFTP o FTP, at ano ang alternatibo?',
      answer: 'Parehong hindi naka-encrypt ang TFTP at FTP, kaya mababasa ng sinumang nakikinig ang credentials at file. Gamitin ang SCP o SFTP (sa ibabaw ng SSH, TCP 22) para naka-encrypt ang transfer.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'TFTP = UDP 69, no authentication, no directory listing.',
        'FTP = TCP 21 (control) and TCP 20 (data in active mode), username and password required.',
        'Neither TFTP nor FTP is encrypted; SFTP and FTPS are secure alternatives.',
        'copy running-config tftp: backs up; copy tftp: running-config restores (merges).',
        'Use dir flash: and verify /md5 before and after an IOS upgrade.',
      ],
    },
    {
      type: 'summary',
      points: [
        'TFTP and FTP copy configs and IOS images to and from devices.',
        'TFTP is UDP 69 and unauthenticated; FTP is TCP 21/20 and needs a login.',
        'Both are clear text; use SFTP/SCP when security matters.',
        'Use copy commands and always confirm reachability first.',
        'Susunod: Security concepts — mga banta, kahinaan at depensa.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.9', difficulty: 'easy', type: 'single',
    prompt: 'Which protocol uses UDP port 69 and has no authentication?',
    choices: ['FTP', 'TFTP', 'SFTP', 'SSH'], correct: [1],
    explanation: 'TFTP uses UDP port 69 and offers no authentication.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.9', difficulty: 'easy', type: 'single',
    prompt: 'Which TCP port is used for the FTP control connection?',
    choices: ['20', '21', '22', '69'], correct: [1],
    explanation: 'FTP commands travel on TCP port 21; data uses port 20 in active mode.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.9', difficulty: 'medium', type: 'single',
    prompt: 'Which command backs up the running configuration to a TFTP server?',
    choices: ['copy tftp: running-config', 'copy running-config tftp:', 'backup running-config', 'tftp put running-config'], correct: [1],
    explanation: 'copy running-config tftp: sends the active configuration to the server.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.9', difficulty: 'medium', type: 'single',
    prompt: 'What is a key difference between FTP and TFTP?',
    choices: ['FTP uses UDP and TFTP uses TCP', 'FTP requires a username and password; TFTP does not', 'TFTP is encrypted; FTP is not', 'TFTP supports directory listing; FTP does not'], correct: [1],
    explanation: 'FTP authenticates users; TFTP has no authentication or directory listing.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.9', difficulty: 'medium', type: 'single',
    prompt: 'Which statement about FTP security is correct?',
    choices: ['FTP encrypts data by default', 'FTP sends credentials and data in clear text', 'FTP uses SSH', 'FTP needs no password'], correct: [1],
    explanation: 'Standard FTP is not encrypted; SFTP or FTPS are the secure options.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.9', difficulty: 'hard', type: 'single',
    prompt: 'A TFTP copy times out and a ping to the server fails. What should you fix first?',
    choices: ['The TFTP filename', 'Reachability between the device and the server', 'The IOS version', 'The VLAN name'], correct: [1],
    explanation: 'Without IP reachability no transfer can succeed, so fix connectivity first.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.9', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are secure alternatives for transferring files?',
    choices: ['SFTP', 'TFTP', 'SCP', 'Telnet'], correct: [0, 2],
    explanation: 'SFTP and SCP both run over SSH and are encrypted.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.9', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: TFTP is commonly used to back up Cisco configurations and IOS images.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — it is simple and widely supported for copying configs and images in labs and recovery.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: TFTP vs FTP?', back: 'TFTP = Tiny, UDP 69, walang login. FTP = TCP 21 control + 20 data, may login. Pareho plain text; ligtas na bersyon ay SFTP/SCP.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'port', front: 'TFTP and FTP ports?', back: 'TFTP: UDP 69. FTP: TCP 21 (control) and TCP 20 (data, active mode).' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'concept', front: 'TFTP vs FTP differences?', back: 'TFTP: no authentication, no listing, UDP. FTP: username and password, directory listing, TCP.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'command', front: 'Back up and restore config with TFTP?', back: 'copy running-config tftp: and copy tftp: running-config' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Secure alternatives to FTP/TFTP?', back: 'SFTP and SCP (over SSH, TCP 22) or FTPS (FTP over TLS).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'command', front: 'Check IOS image and free space?', back: 'dir flash: (and verify /md5 flash:<image> to check integrity).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Back up and restore a router configuration with TFTP',
  tool: 'Packet Tracer',
  minutes: 20,
  objective: 'Copy the running configuration to a TFTP server, change the router, then restore the saved file.',
  topology: 'R1 — SW1 — TFTP Server (10.0.0.50) on 10.0.0.0/24; R1 = 10.0.0.1.',
  steps: [
    'Address R1 (10.0.0.1/24) and the server (10.0.0.50/24); enable the TFTP service on the server.',
    'Ping the server from R1 to confirm reachability.',
    'Run copy running-config tftp: and enter 10.0.0.50 and the filename R1-backup.cfg.',
    'Check the TFTP server file list and confirm R1-backup.cfg exists.',
    'Change the hostname on R1 to TEMP, then run copy tftp: running-config and load R1-backup.cfg.',
    'Run show running-config | include hostname and note the result.',
  ],
  checklist: [
    'Backup file visible on the server',
    'Restore completed from TFTP',
    'You explained why the hostname returned to R1',
  ],
  hints: [
    'If the copy fails, run ping first.',
    'Restore merges lines into the running config; it does not erase extra lines.',
  ],
  solution: [
    'The file R1-backup.cfg appears in the server folder after the copy.',
    'Restoring overwrites the hostname line with the saved R1 value.',
  ],
  breakIt: 'Turn off the TFTP service on the server and repeat the copy to see the timeout, then turn it back on.',
};
