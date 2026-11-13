import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'mgmt-protocols-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.9',
  domain: 'D4',
  title: 'Network Management Deep Dive: NTP, SNMP and Syslog Working Together',
  description: 'Configure and verify NTP, SNMPv2c/v3 and syslog, read severity levels and timestamps and see why accurate time makes logs useful.',
  whyMatters:
    'Tatlong maliliit na serbisyo ito pero madalas silang pinagsasama sa exam: “bakit magkaiba ang oras ng log?”, “anong level ang %LINK-3-UPDOWN?”, “anong SNMP version ang may encryption?”. Kapag naiintindihan mo kung paano sila nagtutulungan, madali ang mga tanong na ito.',
  objectives: [
    'Configure an NTP client and verify synchronisation and stratum',
    'Explain SNMP manager, agent, MIB, OID, get, set, trap and inform',
    'Compare SNMPv1, v2c and v3 security',
    'Read syslog message format and severity levels',
    'Configure logging with timestamps and a syslog server',
  ],
  estimatedMinutes: 45,
  difficulty: 'exam',
  keywords: ['NTP', 'stratum', 'SNMP', 'MIB', 'OID', 'trap', 'inform', 'community', 'SNMPv3', 'syslog', 'severity', 'logging host', 'service timestamps', 'show ntp status'],
  examObjectives: ['4.2', '4.4', '4.5'],
  sections: [
    {
      type: 'explain',
      simple: [
        'NTP keeps every device’s clock accurate. SNMP lets a manager poll devices and receive alerts. Syslog sends log messages to a central server. Accurate time makes the logs and traps from different devices line up.',
        'Together they form the basic monitoring toolkit of a network.',
      ],
      taglish: [
        'Ang **NTP** ay nagpapanatiling tama ang **orasan ng bawat device**. Ang **SNMP** ay nagpapahintulot sa **manager** na magtanong sa mga device at tumanggap ng alerto. Ang **syslog** ay nagpapadala ng **log message sa sentral na server**. Kapag tama ang oras, **nagtutugma ang mga log at trap** mula sa magkakaibang device.',
        'Kapag pinagsama, ito ang pangunahing monitoring toolkit ng network.',
        'Mga port: **NTP UDP 123**, **SNMP UDP 161 (poll/set)** at **UDP 162 (trap)**, **syslog UDP 514**.',
      ],
      technical: [
        'NTP uses stratum numbers: stratum 0 is a reference clock, stratum 1 is directly attached, each hop adds 1; stratum 16 means unsynchronised. A client uses ntp server <address>; a router can be a source with ntp master <stratum> (default 8). Verify with show ntp status (Clock is synchronized, stratum, reference) and show ntp associations (an asterisk marks the selected peer).',
        'SNMP: the manager polls agents with GET/GETNEXT/GETBULK and changes values with SET (UDP 161); agents send unsolicited TRAP (unacknowledged) or INFORM (acknowledged) messages to UDP 162. Data is organised in a MIB tree and each variable is identified by an OID. SNMPv1/v2c authenticate with a plain-text community string; SNMPv3 adds users, authentication (MD5/SHA) and encryption (DES/AES): noAuthNoPriv, authNoPriv, authPriv.',
        'Syslog messages have the form %FACILITY-SEVERITY-MNEMONIC: text. Severity 0–7: Emergencies, Alerts, Critical, Errors, Warnings, Notifications, Informational, Debugging. Setting a logging level sends that level and every lower number (more severe). Default console and buffer logging is level 7 (debugging); service timestamps datetime msec adds the time to messages.',
      ],
    },
    {
      type: 'analogy',
      title: 'Orasan, sensor at logbook',
      body: [
        'NTP is the wall clock everyone checks. SNMP is the security guard who can be asked “how are you?” (poll) or who shouts when something is wrong (trap). Syslog is the logbook that records everything with the time. If clocks disagree, the logbook is useless.',
      ],
      taglish: [
        'Ang **NTP** ay ang **orasan sa dingding** na sinusunod ng lahat. Ang **SNMP** ay ang **guwardiya** na pwedeng tanungin ng “kumusta?” (poll) o sumisigaw kapag may problema (**trap**). Ang **syslog** ay ang **logbook** na nagtatala ng lahat kasama ang oras. Kapag magkaiba ang orasan, **walang silbi ang logbook**.',
      ],
    },
    {
      type: 'hook',
      title: '123, 161/162, 514 at 0–7',
      trick: '**NTP 123 · SNMP 161 (tanong) / 162 (trap) · Syslog 514 · Severity 0–7 (Emergency→Debug), mas mababa = mas malala · SNMPv3 lang ang may encryption.**',
      taglish: [
        '**NTP UDP 123**; **stratum** mas mababa = mas malapit sa tunay na orasan; **16 = unsynchronised**.',
        '**SNMP 161** = manager nagtatanong; **162** = agent nagpapadala ng trap. **Trap = walang ack; inform = may ack**.',
        '**Syslog UDP 514**; **0 Emergency, 1 Alert, 2 Critical, 3 Error, 4 Warning, 5 Notice, 6 Info, 7 Debug**.',
        '**SNMPv1/v2c = community string (plain text); SNMPv3 = auth + encryption (authPriv)**.',
      ],
      test: {
        question: 'Sa %LINK-3-UPDOWN, anong severity at anong pangalan? Ano ang makukuha kung itakda ang logging sa level 4?',
        answer: 'Severity 3 = Errors. Level 4 ay magpapadala ng 0, 1, 2, 3 at 4 (Emergencies hanggang Warnings).',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: NTP at bakit mahalaga ang oras',
      paragraphs: [
        'Kung 10:05 sa isang router at 09:58 sa isa pa, imposibleng buuin ang pagkakasunod ng pangyayari sa mga log. Kaya kailangan ang NTP. Isang router o server ang may maaasahang source (hal. stratum 2) at ang iba ay `ntp server 10.0.0.9`. Ang bawat hop ay nagdaragdag ng 1 sa stratum.',
        '`ntp master 3` ay ginagawang source ang router mismo (kapag walang external na orasan) — ginagamit sa lab. Ang `show ntp status` ay nagsasabi ng “Clock is synchronized, stratum 3, reference is 10.0.0.9”. Kung “unsynchronized”, hintayin ang ilang minuto at tingnan ang `show ntp associations` (may * sa napiling peer).',
        'Para sa seguridad, may NTP authentication (`ntp authenticate`, `ntp authentication-key`), pero para sa CCNA ay sapat na malaman na nandiyan ito.',
      ],
      steps: [
        'Itakda ang timezone (clock timezone PST 8) at tiyaking tama ang initial clock.',
        'ntp server <address> sa mga client.',
        'show ntp status at show ntp associations.',
        'service timestamps log datetime msec para sa mga log.',
      ],
      tricks: [
        'Hindi agad nagsi-synchronise ang NTP; maaaring ilang minuto.',
        'Ang router ay maaaring maging client at server nang sabay.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: SNMP at ang tatlong bersyon',
      paragraphs: [
        'Ang **manager (NMS)** ay nagpapadala ng **GET** (basahin ang value), **SET** (palitan) at tumatanggap ng **TRAP/INFORM** mula sa **agent** sa device. Ang data ay nasa **MIB** (puno ng mga variable) at bawat variable ay may **OID** (hal. 1.3.6.1.2.1.1.5.0 = sysName).',
        '**v1/v2c**: community string (halos parang password, nakikita sa packet). Mga configuration: `snmp-server community READONLY ro`, `snmp-server community PRIVATE rw`. **v3**: users, authentication (MD5/SHA) at encryption (AES): `authPriv` ang pinakaligtas. Para sa exam: v3 ang tanging ligtas.',
        'Trap config: `snmp-server host 10.0.0.9 version 2c READONLY` at `snmp-server enable traps`. Ang trap ay hindi inaaksyunan ng sagot (walang ack); ang inform ay may ack kaya mas maaasahan.',
      ],
      steps: [
        'snmp-server community <string> ro|rw (v2c).',
        'snmp-server host <manager> version 2c <string> para sa traps.',
        'snmp-server enable traps.',
        'Para sa v3: group, user at security level (authPriv).',
        'show snmp para sa mga counter.',
      ],
      tricks: [
        'Ang “rw” community ay mapanganib; gamitin ang “ro” at ACL kung kailangan.',
        'Poll = port 161; trap = port 162 (papunta sa manager).',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 3: Syslog — format at level',
      paragraphs: [
        'Halimbawa ng log: `*Mar 1 00:01:02.345: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down`. Ang `%LINK-3-UPDOWN` ay **facility LINK, severity 3 (Error), mnemonic UPDOWN**. Ang timestamp ay nagmumula sa `service timestamps log datetime msec`.',
        'Mga destinasyon: console (`logging console`), buffer (`logging buffered`), terminal (`terminal monitor`) at server (`logging host 10.0.0.9`). Ang `logging trap warnings` ay nagpapadala ng level 0–4 sa server. **Mas mababa ang numero, mas malala**.',
        'Pagsasama: kapag tama ang NTP at naka-send ang logs sa iisang server, mabubuo mo ang buong kuwento ng insidente mula sa maraming device.',
      ],
      steps: [
        'service timestamps log datetime msec.',
        'logging host <server>.',
        'logging trap <level>.',
        'logging buffered <size> <level> para sa lokal na kopya.',
        'show logging para i-verify.',
      ],
      tricks: [
        'Kabisaduhin: “Every Awesome Cisco Engineer Will Need Icecream Daily”: Emergency, Alert, Critical, Error, Warning, Notice, Info, Debug.',
        'Ang debug (7) ay mabigat sa CPU; huwag iwan sa production.',
      ],
    },
    {
      type: 'remember',
      title: 'NTP, SNMP at syslog na lumalabas sa exam',
      items: [
        '**NTP UDP 123; stratum mas mababa = mas malapit; stratum 16 = unsynchronised; ntp master = source.**',
        '**SNMP UDP 161 (get/set) at 162 (trap). Trap = walang ack; inform = may ack.**',
        '**SNMPv1/v2c = community (plain text); SNMPv3 = authentication + encryption.** **MIB = puno; OID = address ng variable.**',
        '**Syslog UDP 514; %FAC-SEV-MNEMONIC; 0 Emergency … 7 Debug.** **Level N = 0 hanggang N.**',
        '**Tama ang oras (NTP) = magagamit ang logs at traps.**',
      ],
    },
    { type: 'diagram', id: 'syslog-levels', caption: 'Mga syslog severity level 0 hanggang 7.' },
    {
      type: 'terms',
      items: [
        { term: 'Stratum', definition: 'Distance in hops from the reference clock; 16 means unsynchronised.' },
        { term: 'MIB', definition: 'Management Information Base: the tree of variables an SNMP agent exposes.' },
        { term: 'OID', definition: 'Object identifier: the numeric address of a variable in the MIB.' },
        { term: 'Trap', definition: 'Unsolicited SNMP notification sent without acknowledgement.' },
        { term: 'Inform', definition: 'SNMP notification that the manager acknowledges.' },
        { term: 'Community string', definition: 'Plain-text shared secret used by SNMPv1 and v2c.' },
        { term: 'Severity level', definition: 'Syslog urgency from 0 (emergency) to 7 (debugging).' },
      ],
    },
    {
      type: 'flow',
      title: 'Pagbuo ng monitoring',
      steps: [
        'I-synchronise ang oras ng lahat ng device gamit ang NTP.',
        'I-enable ang timestamps sa log at ipadala ang logs sa syslog server.',
        'I-configure ang SNMP (v3 kung maaari) para sa polling at traps.',
        'Itakda ang threshold ng severity para hindi mapuno ng ingay.',
        'Gamitin ang timestamps para ihambing ang pangyayari sa maraming device.',
      ],
    },
    {
      type: 'cli',
      title: 'Kumpletong monitoring config',
      transcript: `R1(config)# ntp server 10.0.0.9
R1(config)# service timestamps log datetime msec
R1(config)# logging host 10.0.0.20
R1(config)# logging trap warnings
R1(config)# snmp-server community READONLY ro
R1(config)# snmp-server host 10.0.0.20 version 2c READONLY
R1# show ntp status
Clock is synchronized, stratum 3, reference is 10.0.0.9
R1# show logging | include LINK
*Nov 13 08:01:02.345: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down`,
      copyable: 'ntp server 10.0.0.9\nservice timestamps log datetime msec\nlogging host 10.0.0.20\nlogging trap warnings\nsnmp-server community READONLY ro\nsnmp-server host 10.0.0.20 version 2c READONLY\nshow ntp status\nshow logging',
      explain: [
        { line: 'ntp server 10.0.0.9', why: 'Makes R1 an NTP client of the server at 10.0.0.9.' },
        { line: 'logging trap warnings', why: 'Sends severity 0 to 4 (emergencies to warnings) to the syslog server.' },
        { line: 'snmp-server community READONLY ro', why: 'Creates a read-only SNMPv2c community; any manager that knows the string can read data, so protect it.' },
        { line: '%LINK-3-UPDOWN', why: 'Facility LINK, severity 3 (Errors), mnemonic UPDOWN: an interface changed state.' },
      ],
      note: 'Use SNMPv3 with authentication and encryption wherever the platform supports it.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **mas mababang numero ng severity ay mas malala**. Ang level 7 (debugging) ay hindi “pinakamahalaga” — pinaka-detalyado ito.' },
    { type: 'callout', kind: 'trap', text: 'Ang **SNMPv2c ay walang encryption**; ang community string ay nakikita sa packet. Ang **v3** lang ang may authentication at encryption.' },
    { type: 'callout', kind: 'tip', text: 'Kapag magkakaiba ang oras sa logs ng dalawang device, hanapin muna ang NTP bago ang kahit ano pa.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Thinking that higher syslog numbers are more severe.',
        'Using SNMPv2c with a default or guessable community and read-write access.',
        'Forgetting service timestamps, so log lines have no useful time.',
        'Expecting immediate NTP synchronisation.',
        'Confusing the SNMP poll port (161) with the trap port (162).',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Hindi mapagtugma ang mga log',
      scenario: 'During an outage the logs from two routers show events 7 minutes apart for what must have been simultaneous failures.',
      evidence: `R1# show ntp status
Clock is unsynchronized, stratum 16
R2# show ntp status
Clock is synchronized, stratum 3, reference is 10.0.0.9`,
      question: 'Ano ang problema at ano ang unang gagawin?',
      answer: 'R1 is not synchronised (stratum 16), so its timestamps differ from R2’s.',
      fix: 'Configure ntp server 10.0.0.9 on R1 (check that the server is reachable and UDP 123 is allowed), wait for synchronisation and confirm with show ntp status and show ntp associations.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Itakda ang logging trap sa level 5. Alin sa mga ito ang ipapadala: (a) %SYS-2-MALLOCFAIL, (b) %LINK-3-UPDOWN, (c) %SYS-5-CONFIG_I, (d) %SYS-6-LOGGINGHOST_STARTSTOP?',
      answer: 'Level 5 sends severities 0 to 5: (a) yes (2), (b) yes (3), (c) yes (5), (d) no (6).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'NTP 123; SNMP 161/162; syslog 514.',
        'Lower severity number = more severe; level N includes 0 to N.',
        'SNMPv3 is the secure version.',
        'Trap is unacknowledged; inform is acknowledged.',
        'Accurate time is required for useful logs.',
      ],
    },
    {
      type: 'summary',
      points: [
        'NTP, SNMP and syslog form the monitoring base.',
        'Stratum describes NTP distance; 16 is unsynchronised.',
        'SNMP uses MIB and OIDs; v3 secures it.',
        'Syslog severity 0–7 with timestamps.',
        'Synchronised time ties logs together.',
        'Susunod: WLC GUI at wireless configuration.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.5', difficulty: 'easy', type: 'single',
    prompt: 'What does the 3 mean in the message %LINK-3-UPDOWN?',
    choices: ['Facility number', 'Severity level (Errors)', 'Interface number', 'Message count'], correct: [1],
    explanation: 'The middle number is the severity; 3 is Errors.',
    wrong: { 0: 'LINK is the facility.', 2: 'The interface is named in the message text.', 3: 'Syslog messages do not include a count in that field.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.5', difficulty: 'medium', type: 'single',
    prompt: 'Which messages are sent to a syslog server when logging trap is set to level 4 (warnings)?',
    choices: ['Level 4 only', 'Levels 0 through 4', 'Levels 4 through 7', 'All levels'], correct: [1],
    explanation: 'A threshold includes that level and every more severe (lower-numbered) level.',
    wrong: { 0: 'The threshold is cumulative.', 2: 'That would include less severe messages.', 3: 'Only up to the threshold are sent.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'medium', type: 'single',
    prompt: 'Which SNMP version provides both authentication and encryption?',
    choices: ['SNMPv1', 'SNMPv2c', 'SNMPv3', 'None'], correct: [2],
    explanation: 'SNMPv3 supports authentication and encryption (authPriv).',
    wrong: { 0: 'v1 uses a plain-text community string.', 1: 'v2c uses a plain-text community string.', 3: 'SNMPv3 provides these protections.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.2', difficulty: 'medium', type: 'single',
    prompt: 'show ntp status displays “Clock is unsynchronized, stratum 16”. What does this indicate?',
    choices: ['The router is a stratum 16 reference clock', 'The router has not synchronised with an NTP source', 'NTP is working normally', 'The router is a stratum 1 server'], correct: [1],
    explanation: 'Stratum 16 means the device is not synchronised.',
    wrong: { 0: 'Stratum 16 is invalid, not a source.', 2: 'The clock is not synchronised.', 3: 'Stratum 1 would be a direct reference.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: an SNMP trap is acknowledged by the manager.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'Traps are unacknowledged; informs are acknowledged.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO UDP ports are used by SNMP?',
    choices: ['161', '162', '123', '514'], correct: [0, 1],
    explanation: 'SNMP polls use UDP 161 and traps use UDP 162. 123 is NTP and 514 is syslog.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'port', front: 'Pro tip: mga port at severity?', back: 'NTP 123 · SNMP 161 (tanong) / 162 (trap) · Syslog 514 · Severity 0–7 (mas mababa = mas malala) · SNMPv3 lang ang may encryption.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'concept', front: 'What does stratum 16 mean?', back: 'The device is unsynchronised.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Trap vs inform?', back: 'Trap has no acknowledgement; inform is acknowledged.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'concept', front: 'SNMP versions and security?', back: 'v1 and v2c use a plain-text community; v3 adds authentication and encryption.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Syslog severity names 0–7?', back: 'Emergencies, Alerts, Critical, Errors, Warnings, Notifications, Informational, Debugging.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'command', front: 'Command to send logs to a server?', back: 'logging host <ip> (with logging trap <level>).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D4', category: 'command', front: 'Command to verify NTP?', back: 'show ntp status and show ntp associations.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Monitor a router with NTP, syslog and SNMP',
  tool: 'Packet Tracer',
  minutes: 35,
  objective: 'Synchronise time, send logs to a syslog server and configure SNMP traps, then cause an event and trace it.',
  steps: [
    'Build a router, a switch and a server that runs NTP, syslog and SNMP services.',
    'Configure ntp server on the router and verify with show ntp status (or set the clock manually in the simulator).',
    'Enable service timestamps log datetime msec and logging host to the server with logging trap informational.',
    'Configure snmp-server community and snmp-server host for traps.',
    'Shut down and bring up an interface; read show logging and the syslog server messages.',
    'Change the logging level to errors and repeat to see what is no longer sent.',
    'Write the severity name and number of each message you saw.',
  ],
  checklist: [
    'Clock synchronised',
    'Logs received on the server with timestamps',
    'SNMP trap configured',
    'Severity levels mapped to messages',
  ],
  hints: [
    'show logging shows the buffer and the logging destinations.',
    'Link up/down messages are severity 3 and 5 respectively (changed state to up is %LINEPROTO-5-UPDOWN).',
  ],
  solution: [
    'ntp server <ip>, service timestamps log datetime msec, logging host <ip>, logging trap informational.',
    'snmp-server community <string> ro; snmp-server host <ip> version 2c <string>.',
    'With logging trap errors, severity 5 and 6 messages are no longer sent.',
  ],
  breakIt: 'Leave one router unsynchronised and compare its timestamps with another router’s for the same event.',
};
