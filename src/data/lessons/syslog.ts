import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'syslog';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.9',
  domain: 'D4',
  title: 'Syslog: Reading and Collecting Device Logs',
  description: 'What a syslog message looks like, the eight severity levels from 0 to 7, and where devices send their logs.',
  whyMatters:
    'Kapag may sira, ang log ang unang tinitingnan ng engineer — "may nag-down na interface, may nag-login, may nag-reload". Kailangan mong mabasa ang isang log message at malaman ang severity nito. Sa exam, siguradong may tanong tungkol sa levels 0 hanggang 7 at sa epekto ng "logging trap" — at madalas itong ibaliktad ng mga estudyante.',
  objectives: [
    'Read the parts of a Cisco syslog message (facility, severity, mnemonic, text)',
    'Memorise the eight severity levels 0 (emergencies) to 7 (debugging)',
    'Explain how a severity threshold filters which messages are sent',
    'Configure logging to the console, buffer and a remote syslog server',
    'Use timestamps so log lines can be correlated',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['syslog', 'severity', 'logging host', 'logging trap', 'logging buffered', 'service timestamps', 'UDP 514', 'emergencies', 'debugging', 'facility', 'mnemonic'],
  examObjectives: ['4.5'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Cisco devices write a short message every time something notable happens: a link goes up or down, someone logs in, the configuration changes. Syslog is how those messages are shown, stored and sent to a central server.',
        'Each message has a severity from 0 (the worst) to 7 (the chattiest). You can choose a level and the device will show everything at that level and more serious.',
      ],
      taglish: [
        'Ang bawat Cisco device ay **sumusulat ng maikling mensahe** kapag may **mahalagang nangyari**: nag-up o nag-down ang link, may nag-login, nagbago ang config. Ang **syslog** ang paraan para **ipakita, i-save, at ipadala** ang mga mensaheng iyon sa **central server**.',
        'Bawat mensahe ay may **severity na 0 hanggang 7**. Ang **0 ang pinakamalubha**, ang **7 ang pinakamadaldal** (debugging). Ang **mas mababang numero = mas seryoso**.',
        'Kapag nagtakda ka ng level, ipapakita ng device ang **level na iyon at lahat ng mas seryoso**. Halimbawa, **level 4 (warnings)** = ipinapakita ang **0, 1, 2, 3 at 4**, pero hindi ang 5, 6, 7.',
        'Ang syslog server ay nakikinig sa **UDP 514**. Mahalaga na may **tamang oras (NTP)** ang bawat device para maihanay ang mga log.',
      ],
      technical: [
        'A Cisco syslog message has the format: %FACILITY-SEVERITY-MNEMONIC: description, for example %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down. The optional timestamp and sequence number precede the percent sign.',
        'Severity levels: 0 emergencies (system unusable), 1 alerts (act immediately), 2 critical, 3 errors, 4 warnings, 5 notifications (normal but significant), 6 informational, 7 debugging. A threshold of level N logs messages of severity 0 through N.',
        'Destinations: console (logging console [level], on by default at level 7), terminal lines (terminal monitor for Telnet/SSH sessions), local RAM buffer (logging buffered [size] [level]; show logging), and a remote server (logging host <ip> with logging trap [level]). Remote syslog uses UDP port 514 by default.',
        'Timestamps are added with service timestamps log datetime msec (and service sequence-numbers). Pair this with NTP so timestamps agree across devices.',
        'Verification: show logging (shows destinations, thresholds, counters and the buffer), show running-config | include logging, and terminal monitor to see messages in an SSH session. Debug output is severity 7 and can overload a device, so use it briefly.',
      ],
    },
    {
      type: 'analogy',
      title: 'Logbook ng guwardiya',
      body: [
        'A building guard writes every event in a logbook: "8:02 front door opened", "8:15 alarm in lobby". Each line is marked with how urgent it was, from "fire!" down to "routine delivery". The manager can ask the guard to report only the serious events, or all of them. At night, the guard also radios the serious ones to head office.',
      ],
      taglish: [
        'Ang **guwardiya ng gusali** ay **nagsusulat sa logbook** ng bawat pangyayari: "8:02 bumukas ang pinto", "8:15 may alarm sa lobby". Bawat linya ay may **marka kung gaano ito kaapura**, mula **"sunog!"** hanggang **"karaniwang delivery"**. Puwedeng sabihin ng manager na **seryoso lang** ang i-report, o **lahat**. At **ni-radyo** ng guwardiya sa head office ang mga seryoso.',
      ],
    },
    {
      type: 'hook',
      title: 'Every Awesome Cisco Engineer Will Need Ice cream Daily',
      trick: '**E**very **A**wesome **C**isco **E**ngineer **W**ill **N**eed **I**ce cream **D**aily = **0 E**mergencies, **1 A**lerts, **2 C**ritical, **3 E**rrors, **4 W**arnings, **5 N**otifications, **6 I**nformational, **7 D**ebugging.',
      taglish: [
        'Kabisaduhin ang **pangungusap**: **E**very **A**wesome **C**isco **E**ngineer **W**ill **N**eed **I**ce cream **D**aily.',
        'Ang **unang letra ng bawat salita** ay ang level: **0 E**mergencies, **1 A**lerts, **2 C**ritical, **3 E**rrors, **4 W**arnings, **5 N**otifications, **6 I**nformational, **7 D**ebugging.',
        '**Mababang numero = seryoso**. Ang threshold na **N** ay nagpapakita ng **0 hanggang N**.',
        'Port: **UDP 514**. Command: **logging host** para sa server at **logging trap <level>** para sa threshold.',
      ],
      test: {
        question: 'Ano ang makikita kung ang device ay may "logging trap warnings" (level 4)? Ano ang level ng "errors" at "informational"?',
        answer: 'Makikita ang levels 0 hanggang 4: emergencies, alerts, critical, errors at warnings. Errors = 3 (kasama), informational = 6 (hindi kasama).',
      },
    },
    { type: 'diagram', id: 'syslog-levels', caption: 'Ang severity 0 hanggang 7: mas mababang numero, mas seryoso. Ang threshold ay nagpapakita ng 0 hanggang N.' },
    {
      type: 'terms',
      items: [
        { term: 'Syslog', definition: 'Standard for generating, storing and forwarding log messages. UDP port 514.' },
        { term: 'Severity level', definition: 'A number from 0 (emergencies) to 7 (debugging) marking how serious a message is.' },
        { term: 'Facility', definition: 'The part of the system that produced the message, such as LINK, SYS or OSPF.' },
        { term: 'Mnemonic', definition: 'A short code naming the event, for example UPDOWN or CONFIG_I.' },
        { term: 'logging host', definition: 'Global command that sends messages to a remote syslog server.' },
        { term: 'logging trap', definition: 'Sets the severity threshold for messages sent to the remote server.' },
        { term: 'Buffer', definition: 'Log storage in the device\'s RAM, viewed with show logging.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: nag-down ang isang interface',
      steps: [
        'Naputol ang cable sa Gi0/1 ng SW1. Natutukoy ng software na nag-down ang link.',
        'Bumubuo ang SW1 ng mensahe: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down.',
        'Nakikita ang severity 3 (errors). Ipinapakita ito sa console dahil ang console ay nasa level 7.',
        'Sine-save ang kopya sa RAM buffer kung naka-enable ang logging buffered.',
        'Dahil ang logging trap ay level 4 at ang 3 ay mas seryoso, ipinapadala rin ito sa syslog server na 10.0.0.60 sa UDP 514.',
        'Nababasa ng engineer sa server ang oras (mula sa NTP) at ang interface, at nalalaman agad kung alin ang bumagsak.',
      ],
    },
    {
      type: 'cli',
      title: 'Mag-configure ng logging at basahin ang message',
      transcript: `R1(config)# service timestamps log datetime msec
R1(config)# logging buffered 16384 informational
R1(config)# logging host 10.0.0.60
R1(config)# logging trap warnings
R1(config)# logging console errors
R1(config)# end
R1# show logging
Syslog logging: enabled
    Console logging: level errors, 12 messages logged
    Buffer logging: level informational, 31 messages logged
    Trap logging: level warnings, 28 message lines logged
        Logging to 10.0.0.60  (udp port 514, ...)
Log Buffer (16384 bytes):
*Mar  1 00:05:12.481: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down`,
      copyable: 'logging host 10.0.0.60',
      explain: [
        { line: 'service timestamps log datetime msec', why: 'Adds the date and time (to the millisecond) to every log message.' },
        { line: 'logging buffered 16384 informational', why: 'Keeps messages in a 16 KB RAM buffer, severity 0 to 6.' },
        { line: 'logging host 10.0.0.60', why: 'Sends log messages to the syslog server at that address (UDP 514).' },
        { line: 'logging trap warnings', why: 'Sets the threshold for the remote server to level 4: only 0 to 4 are sent.' },
        { line: '%LINK-3-UPDOWN', why: 'Facility LINK, severity 3 (errors), mnemonic UPDOWN. The number between the dashes is the severity.' },
      ],
      note: 'Sample output for study. A leading * on the timestamp means the clock is not synchronised.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show logging', shows: 'Which destinations are on, their severity thresholds, message counts and the buffer contents.' },
        { command: 'show running-config | include logging', shows: 'The logging commands in the configuration.' },
        { command: 'terminal monitor', shows: 'Turns on log display for your current Telnet/SSH session.' },
        { command: 'show clock', shows: 'The time used in timestamps; check it matches NTP.' },
      ],
      good: 'Destinations show the expected level and message counters increase.',
      bad: 'Zero messages to the server: logging host missing, level too low or UDP 514 blocked.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **mas mababang numero ay mas seryoso**: **0 = emergencies**, **7 = debugging**. Ang "level 4" ay nagpapakita ng **0 hanggang 4**, hindi 4 hanggang 7. Ito ang pinakamadalas na ibinabaliktad sa exam.' },
    { type: 'callout', kind: 'trap', text: 'Ang **%LINK-3-UPDOWN** ay **severity 3**, hindi ang bilang ng mensahe. Ang numero **sa pagitan ng dalawang gitling** ang level.' },
    { type: 'callout', kind: 'tip', text: 'Ang **debugging (7)** ay maaaring **magpabagal o magpabagsak** ng device sa production. Gamitin lang nang saglit, at gamitin ang **undebug all** pagkatapos.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagbaligtad sa 0 at 7 bilang pinakaseryoso.',
        'Pag-iisip na ang "logging trap 4" ay para sa level 4 lang.',
        'Hindi pagtatakda ng timestamps o NTP, kaya hindi maihanay ang logs.',
        'Pag-iwan ng debug na naka-on sa production.',
        'Pagharang sa UDP 514 papunta sa syslog server.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Walang dumarating na log sa server"',
      scenario: 'The syslog server receives nothing from R1, even though interfaces were flapping.',
      evidence: `R1# show logging
Syslog logging: enabled
    Console logging: level debugging
    Trap logging: level emergencies, 0 message lines logged
        Logging to 10.0.0.60 (udp port 514)`,
      question: 'Bakit walang dumarating na mensahe sa server?',
      answer: 'Ang trap logging ay level 0 (emergencies) lang, kaya ang tanging ipinapadala ay ang pinakamalubha. Ang link flaps (level 3 at 5) ay hindi pasok sa threshold.',
      fix: 'Itaas ang threshold gamit ang logging trap informational (o warnings kung sapat), saka suriin ang show logging na tumataas ang message lines logged. Kung wala pa rin, tingnan kung naharang ang UDP 514 sa pagitan.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Gusto mong ipadala sa server ang errors at mas seryoso lang. Anong command, at aling mga severity ang isasama?',
      answer: 'logging trap errors (o logging trap 3). Isasama ang 0 emergencies, 1 alerts, 2 critical at 3 errors. Hindi isasama ang 4 warnings pataas.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Levels: 0 emergencies, 1 alerts, 2 critical, 3 errors, 4 warnings, 5 notifications, 6 informational, 7 debugging.',
        'A threshold of N includes levels 0 through N.',
        'Syslog uses UDP 514; logging host sets the server, logging trap sets its threshold.',
        'In %LINK-3-UPDOWN the middle number is the severity.',
        'Use NTP and timestamps so logs from several devices line up.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Syslog records device events with a severity from 0 (worst) to 7 (debugging).',
        'A threshold shows its level and everything more serious.',
        'Send logs to a server with logging host and set the level with logging trap.',
        'Accurate time through NTP makes logs useful.',
        'Susunod: SSH — ligtas na remote access sa mga device.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.5', difficulty: 'easy', type: 'single',
    prompt: 'Which syslog severity level is the most serious?',
    choices: ['7', '0', '3', '5'], correct: [1],
    explanation: 'Level 0 (emergencies) is the most severe; 7 (debugging) is the least.',
    wrong: { 0: '7 is debugging, the least severe.', 2: '3 is errors.', 3: '5 is notifications.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.5', difficulty: 'easy', type: 'single',
    prompt: 'Which UDP port does a syslog server listen on by default?',
    choices: ['161', '514', '123', '67'], correct: [1],
    explanation: 'Syslog uses UDP port 514.',
    wrong: { 0: '161 is SNMP.', 2: '123 is NTP.', 3: '67 is the DHCP server.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.5', difficulty: 'medium', type: 'single',
    prompt: 'What is the severity level of "warnings"?',
    choices: ['2', '3', '4', '5'], correct: [2],
    explanation: '0 emergencies, 1 alerts, 2 critical, 3 errors, 4 warnings, 5 notifications, 6 informational, 7 debugging.',
    wrong: { 0: '2 is critical.', 1: '3 is errors.', 3: '5 is notifications.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.5', difficulty: 'medium', type: 'single',
    prompt: 'A router is configured with "logging trap 4". Which messages are sent to the syslog server?',
    choices: ['Only level 4', 'Levels 0 through 4', 'Levels 4 through 7', 'All levels'], correct: [1],
    explanation: 'A threshold of N sends severity 0 through N.',
    wrong: { 0: 'The threshold is inclusive of all more serious levels.', 2: 'That reverses the scale.', 3: 'Level 7 would be needed for all levels.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.5', difficulty: 'medium', type: 'single',
    prompt: 'In the message %LINK-3-UPDOWN, what does the 3 represent?',
    choices: ['The interface number', 'The severity level', 'The VLAN', 'The message count'], correct: [1],
    explanation: 'The number between the dashes is the severity: 3 is errors.',
    wrong: { 0: 'The interface is named in the text.', 2: 'VLANs are unrelated.', 3: 'The count is not in the code.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.5', difficulty: 'medium', type: 'single',
    prompt: 'Which command sends log messages to a remote syslog server?',
    choices: ['logging host 10.0.0.60', 'syslog server 10.0.0.60', 'logging remote 10.0.0.60', 'snmp-server host 10.0.0.60'], correct: [0],
    explanation: 'logging host <ip> configures the remote syslog destination.',
    wrong: { 1: 'Not valid IOS syntax.', 2: 'Not valid IOS syntax.', 3: 'That configures an SNMP trap receiver.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.5', difficulty: 'medium', type: 'single',
    prompt: 'Which command shows the logging destinations, thresholds and the buffer contents?',
    choices: ['show logging', 'show syslog', 'show log buffer', 'show history'], correct: [0],
    explanation: 'show logging displays all logging settings and the stored messages.',
    wrong: { 1: 'Not valid IOS syntax.', 2: 'Not valid IOS syntax.', 3: 'That shows command history.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.5', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO severity levels are included when the threshold is set to "errors" (level 3)?',
    choices: ['Level 1 (alerts)', 'Level 3 (errors)', 'Level 5 (notifications)', 'Level 7 (debugging)'], correct: [0, 1],
    explanation: 'A threshold of 3 includes levels 0 to 3, so alerts and errors are included but not 5 or 7.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D4', objective: '4.5', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: severity level 7 (debugging) is more serious than level 0 (emergencies).',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — lower numbers are more serious; 0 is the most severe.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: paano tandaan ang syslog levels?', back: 'Every Awesome Cisco Engineer Will Need Ice cream Daily = 0 Emergencies, 1 Alerts, 2 Critical, 3 Errors, 4 Warnings, 5 Notifications, 6 Informational, 7 Debugging. Mababang numero = seryoso.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'port', front: 'Syslog port?', back: 'UDP 514.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'concept', front: 'The eight syslog severity levels?', back: '0 emergencies, 1 alerts, 2 critical, 3 errors, 4 warnings, 5 notifications, 6 informational, 7 debugging.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'concept', front: 'What does a threshold of N mean?', back: 'The device logs messages of severity 0 through N.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'command', front: 'Send logs to a server and set its level?', back: 'logging host <ip>, then logging trap <level>.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Read %LINK-3-UPDOWN?', back: 'Facility LINK, severity 3 (errors), mnemonic UPDOWN.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Trigger log messages and filter them by severity',
  tool: 'Packet Tracer',
  minutes: 20,
  objective: 'Generate link up/down messages, read their severity and change the logging threshold.',
  topology: 'R1 with a link to SW1 and a syslog server on 10.0.0.60.',
  steps: [
    'Enable timestamps: service timestamps log datetime msec.',
    'Configure logging buffered 8192 informational and logging host 10.0.0.60.',
    'Shut down and re-enable an interface to generate messages.',
    'Run show logging and find the severity number in %LINK-3-UPDOWN.',
    'Set logging trap errors and repeat; note which messages still reach the server.',
    'Change to logging trap debugging and note the extra messages.',
  ],
  checklist: [
    'Read facility, severity and mnemonic from a message',
    'Saw messages stored in the buffer',
    'Observed the effect of changing logging trap',
  ],
  hints: [
    'Interface state changes show as severity 3 (updown) and 5 (line protocol).',
    'The lower the threshold number, the fewer messages.',
  ],
  solution: [
    '%LINK-3-UPDOWN is facility LINK, severity 3, mnemonic UPDOWN.',
    'A trap threshold of errors sends severity 0 to 3 only.',
  ],
  breakIt: 'Set logging trap emergencies and notice the server stops receiving the link messages.',
};
