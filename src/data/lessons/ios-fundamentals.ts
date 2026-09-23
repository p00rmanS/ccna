import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ios-fundamentals';

export const lesson: Lesson = {
  id: ID,
  moduleId: '0.3',
  domain: 'D1',
  title: 'Cisco IOS Fundamentals',
  description: 'How to talk to a Cisco router or switch: the command modes, the prompts, help, shortcuts and saving your work.',
  whyMatters:
    'Every hands-on CCNA lab — and every simulation question on the exam — happens in the IOS command line. Kapag alam mo kung anong mode ka at paano gumalaw doon, mawawala ang 90% ng “bakit hindi gumagana ang command ko?”',
  objectives: [
    'Name the IOS modes and recognise each one by its prompt',
    'Move between modes with enable, configure terminal, exit and end',
    'Use ?, Tab, abbreviations and command history',
    'Read the three common IOS error messages',
    'Explain running-config vs startup-config and save your work',
    'Describe how you connect through the console port',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['IOS', 'CLI', 'user EXEC', 'privileged EXEC', 'global configuration', 'prompt', 'running-config', 'startup-config', 'console'],
  examObjectives: ['1.6', '5.3'],
  sections: [
    {
      type: 'explain',
      simple: [
        'IOS is the operating system inside Cisco routers and switches. You talk to it by typing commands. It has different “rooms” called modes, and the prompt (the text before your cursor) tells you which room you are in.',
        'You start in a room where you can only look. You move to the next room to see everything, and then to another room to make changes.',
      ],
      taglish: [
        'Ang IOS ay ang “utak” ng Cisco router at switch. Kinakausap mo ito sa pamamagitan ng pag-type ng commands sa command line (CLI). May iba’t ibang “kwarto” o modes ito, at ang prompt — yung text bago ang cursor mo — ang nagsasabi kung nasaan ka.',
        'Pagpasok mo, nasa pinaka-labas ka: `Router>`. Bisita ka lang, pwede kang tumingin pero hindi pwedeng galawin. Kapag nag-`enable`, may-ari ka na: `Router#`. Kapag nag-`configure terminal`, nagre-renovate ka na: `Router(config)#`.',
        'Mahalagang tandaan: ang binago mo ay nasa RAM (running-config). Kapag nag-reload ang device na hindi mo na-save, mawawala lahat. Kaya laging `copy running-config startup-config` bago umalis.',
      ],
      technical: [
        'Cisco IOS is a command-line interface organised into hierarchical modes. User EXEC (Router>) offers a limited set of monitoring commands. Privileged EXEC (Router#) unlocks all show and debug commands, file operations (copy, erase) and reload, and is the gateway to configuration. Global configuration (Router(config)#) changes device-wide settings and leads to sub-modes: interface (config-if), line (config-line), router (config-router), VLAN (config-vlan) and others.',
        'IOS provides context-sensitive help (?), Tab completion, unique-abbreviation matching (conf t), and a per-session command history (Up/Down arrows or Ctrl+P/Ctrl+N; show history). Errors: “% Incomplete command.” (arguments missing), “% Invalid input detected at ‘^’ marker.” (typo, or the command is not valid in this mode) and “% Ambiguous command” (the abbreviation matches several commands).',
        'The running-config lives in RAM and is the active configuration; the startup-config lives in NVRAM and is loaded at boot. “copy running-config startup-config” saves changes. Physical first access is normally through the console port with a rollover/USB console cable and terminal software set to 9600 baud, 8 data bits, no parity, 1 stop bit, no flow control.',
      ],
    },
    {
      type: 'analogy',
      title: 'A hotel',
      body: [
        'At the hotel lobby you are a guest: you can look around and ask questions (user EXEC). With a staff key you enter the back office (privileged EXEC) and see everything. From the back office you can start renovating the whole hotel (global configuration), or one specific room (interface configuration). Nothing you renovate is permanent until you write it into the hotel’s official records (copy running-config startup-config).',
      ],
      taglish: [
        'Parang hotel: sa lobby, bisita ka lang — pwede kang magtanong at tumingin (`>`). Kapag may susi ka ng staff, nakapasok ka sa opisina sa likod at nakikita mo lahat (`#`). Mula doon, pwede mong ipa-renovate ang buong hotel (`(config)#`) o isang kwarto lang (`(config-if)#`). At hindi pa “opisyal” ang renovation hangga’t hindi mo naisusulat sa record book (`copy running-config startup-config`).',
      ],
    },
    {
      type: 'hook',
      title: 'Anong prompt ang suot mo?',
      trick: '`>` = Bisita 🚪 · `#` = May-ari 🔑 · `(config)#` = Renovation 🔨 · `(config-if)#` = Kwarto 🛏️',
      taglish: [
        'Tandaan lang ang **simbolo sa dulo**: ang `>` ay parang arrow na “papasok pa lang” — bisita ka. Ang `#` ay parang susi/padlock — may-ari ka na. Kapag may `(config)` sa loob ng prompt, ibig sabihin nagre-renovate ka na.',
        'Pabalik: `exit` = **isang hakbang** palabas ng kwarto. `end` (o Ctrl+Z) = **diretso labas** ng construction site, balik sa `#`.',
        'At bago matulog: **“I-save mo bago ka matulog”** = `copy running-config startup-config`.',
      ],
      test: {
        question: 'Nasa `R1(config-if)#` ka. Gusto mong patakbuhin ang `show ip interface brief`. Ano ang dalawang paraan?',
        answer: '1) `end` para bumalik sa `R1#`, tapos `show ip interface brief`. 2) `do show ip interface brief` nang hindi umaalis sa config mode.',
      },
    },
    { type: 'diagram', id: 'ios-modes', caption: 'Ang mga mode ng IOS mula bisita hanggang kwarto. Ang bawat mas malalim na mode ay may sariling prompt.' },
    {
      type: 'terms',
      items: [
        { term: 'CLI', definition: 'Command-line interface: you type commands instead of clicking.' },
        { term: 'User EXEC', definition: 'Router> — limited monitoring commands only.' },
        { term: 'Privileged EXEC', definition: 'Router# — all show/debug commands, copy, reload; the way into configuration.' },
        { term: 'Global configuration', definition: 'Router(config)# — device-wide changes such as hostname.' },
        { term: 'Sub-mode', definition: 'A configuration mode inside global config: config-if, config-line, config-router, config-vlan…' },
        { term: 'running-config', definition: 'The active configuration in RAM. Lost on reload if unsaved.' },
        { term: 'startup-config', definition: 'The saved configuration in NVRAM, loaded at boot.' },
        { term: 'Console port', definition: 'The physical management port for first-time and out-of-band access.' },
        { term: 'Context-sensitive help', definition: 'Typing ? shows the commands or arguments valid right now.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ang unang configuration mo, hakbang-hakbang',
      steps: [
        'Kumonekta sa console port gamit ang console cable at terminal software (9600 baud, 8 data bits, no parity, 1 stop bit, no flow control).',
        'Nasa `Router>` ka. I-type ang `enable` para pumasok sa `Router#`.',
        'I-type ang `configure terminal` para pumasok sa `Router(config)#`.',
        'Baguhin ang pangalan: `hostname R1`. Agad magbabago ang prompt sa `R1(config)#`.',
        'Pumasok sa isang interface: `interface gigabitEthernet 0/0` → `R1(config-if)#`. I-set ang mga kailangan mo doon.',
        'Bumalik gamit ang `end`, i-verify gamit ang `show running-config`, at i-save gamit ang `copy running-config startup-config`.',
      ],
    },
    {
      type: 'cli',
      title: 'Isang buong session, mula bisita hanggang naka-save',
      transcript: `Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# no ip domain-lookup
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# description Link to SW1
R1(config-if)# exit
R1(config)# end
R1# show running-config | section interface
R1# copy running-config startup-config
Destination filename [startup-config]?
Building configuration...
[OK]`,
      copyable: 'enable\nconfigure terminal\nhostname R1\nno ip domain-lookup\ninterface gigabitEthernet 0/0\ndescription Link to SW1\nexit\nend\nshow running-config | section interface\ncopy running-config startup-config',
      explain: [
        { line: 'enable', why: 'Bisita → may-ari: from Router> to Router#.' },
        { line: 'configure terminal', why: 'Enter global configuration (conf t works too).' },
        { line: 'hostname R1', why: 'Sets the device name; the prompt changes at once.' },
        { line: 'no ip domain-lookup', why: 'Stops the router trying to resolve a mistyped command as a hostname (saves you long pauses in labs).' },
        { line: 'interface gigabitEthernet 0/0', why: 'Enters the interface sub-mode. The prompt shows (config-if).' },
        { line: 'exit', why: 'One step back: from config-if to global config.' },
        { line: 'end', why: 'Straight back to privileged EXEC from any config mode (Ctrl+Z does the same).' },
        { line: '| section interface', why: 'A filter: show only the parts of the output that belong to the “interface” sections.' },
        { line: 'copy running-config startup-config', why: 'Saves RAM → NVRAM. Press Enter to accept the default filename.' },
      ],
      note: 'Other useful filters: | include word, | exclude word, | begin word. The “no” prefix undoes a command, e.g. “no shutdown” undoes “shutdown”.',
    },
    {
      type: 'list',
      variant: 'remember',
      title: 'Mga shortcut na magpapabilis sa iyo',
      items: [
        '`?` after a partial word completes it (`sh?`); with a space it lists what comes next (`show ?`).',
        '`Tab` completes a command as soon as it is unique. `conf t`, `sh run`, `int g0/0` work because each abbreviation is unique.',
        '`Up arrow` (Ctrl+P) repeats the previous command; `Down arrow` (Ctrl+N) goes forward. `show history` lists them.',
        '`Ctrl+A` jumps to the start of the line, `Ctrl+E` to the end.',
        '`do <command>` runs an EXEC command from a config mode without leaving it.',
      ],
    },
    { type: 'callout', kind: 'trap', text: '“Invalid input detected at ‘^’ marker” does NOT always mean you mistyped. Often the command is right but you are in the wrong mode — for example typing “ip address …” in global config instead of interface config. Check the prompt first.' },
    { type: 'callout', kind: 'trap', text: 'Running-config is not saved automatically. If you configure, test and then reload the device without copying to startup-config, everything is gone. On the exam a “config disappeared after reboot” question is almost always this.' },
    { type: 'callout', kind: 'relax', text: 'Huwag mong kabisaduhin lahat ng modes ngayon. Ang kailangan mo lang ay ang apat: `>`, `#`, `(config)#` at `(config-if)#`. Ang iba ay makikilala mo habang tumatagal.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Typing configuration commands at the “#” prompt without entering configure terminal first.',
        'Using “exit” repeatedly when “end” gets you out in one step.',
        'Forgetting to save, then reloading.',
        'Leaving a space before “?” when you meant to complete a word (“show ip int ?” vs “show ip int?”).',
        'Blaming the command when the real issue is the current mode.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: “Ayaw tanggapin ng router ang command ko”',
      scenario: 'A student is trying to give an interface an address. The router keeps rejecting the command.',
      evidence: `R1(config)# ip address 192.168.1.1 255.255.255.0
                ^
% Invalid input detected at '^' marker.`,
      question: 'Tama ang spelling. Bakit hindi gumagana?',
      answer: 'The prompt is R1(config)# — global configuration. “ip address” only exists inside an interface sub-mode (config-if). The ^ marker points at where IOS stopped understanding the line, because that command does not exist at this level.',
      fix: 'Enter the interface first: “interface gigabitEthernet 0/0”, then “ip address 192.168.1.1 255.255.255.0” and “no shutdown”. Always check the prompt when you see an invalid-input error.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge: hulaan ang mode',
      prompt: 'Anong mode ang bawat prompt: (a) SW1>, (b) SW1#, (c) SW1(config)#, (d) SW1(config-if)#, (e) SW1(config-vlan)#? At anong command ang magbabalik sa iyo sa SW1# mula sa (d)?',
      answer: '(a) User EXEC, (b) Privileged EXEC, (c) Global configuration, (d) Interface configuration, (e) VLAN configuration. From (d): “end” (or Ctrl+Z) goes straight to SW1#; “exit” only goes back one step, to (c).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Recognise the mode from the prompt in every simulation question.',
        'Running-config = RAM, startup-config = NVRAM.',
        'Learn the three error messages: Incomplete, Invalid input, Ambiguous.',
        'Console defaults: 9600, 8, none, 1, none.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Prompts tell you the mode: > user, # privileged, (config)# global, (config-if)# interface.',
        'enable → configure terminal → interface … goes deeper; exit goes back one step; end goes back to #.',
        '? and Tab are your built-in help.',
        'Running-config is in RAM; save it with copy running-config startup-config.',
        'Errors usually mean wrong mode or incomplete command — read the prompt first.',
        'Susunod: ang OSI model — ang “wika” ng networking.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'Which prompt indicates privileged EXEC mode?',
    choices: ['Router>', 'Router#', 'Router(config)#', 'Router(config-if)#'], correct: [1],
    explanation: 'The # after the hostname means privileged EXEC.',
    wrong: { 0: '> is user EXEC.', 2: '(config) is global configuration.', 3: '(config-if) is interface configuration.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'Which command moves you from user EXEC to privileged EXEC?',
    choices: ['configure terminal', 'enable', 'login', 'privilege'], correct: [1],
    explanation: '“enable” raises your access level to privileged EXEC.',
    wrong: { 0: 'That enters global configuration from privileged EXEC.', 2: 'Not an IOS mode-change command here.', 3: 'Not the command for this.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'Which command enters global configuration mode?',
    choices: ['enable', 'global config', 'configure terminal', 'set terminal'], correct: [2],
    explanation: '“configure terminal” (or “conf t”) enters global configuration from privileged EXEC.',
    wrong: { 0: 'enable enters privileged EXEC.', 1: 'Not an IOS command.', 3: 'Not an IOS command.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'What does “% Incomplete command.” mean?',
    choices: ['The command does not exist', 'You are in the wrong mode', 'The command needs more keywords or arguments', 'The abbreviation matches several commands'], correct: [2],
    explanation: 'IOS recognised the command but it needs more input. Use ? to see what comes next.',
    wrong: { 0: 'That would be “Invalid input detected”.', 1: 'Wrong mode also gives “Invalid input detected”.', 3: 'That is “% Ambiguous command”.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'You are at R1(config-if)# and need to run “show ip interface brief” without leaving configuration mode. What should you type?',
    choices: ['show ip interface brief', 'do show ip interface brief', 'exec show ip interface brief', 'run show ip interface brief'], correct: [1],
    explanation: '“do” runs an EXEC-mode command from any configuration mode.',
    wrong: { 0: 'This gives “Invalid input” because show is an EXEC command.', 2: 'Not an IOS keyword.', 3: 'Not an IOS keyword.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'Where is the running-config stored?',
    choices: ['NVRAM', 'Flash', 'RAM', 'ROM'], correct: [2],
    explanation: 'The active configuration lives in RAM. The startup-config is in NVRAM.',
    wrong: { 0: 'NVRAM stores the startup-config.', 1: 'Flash holds the IOS image.', 3: 'ROM holds the boot code.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO actions return you directly to privileged EXEC from interface configuration mode?',
    choices: ['end', 'exit', 'Ctrl+Z', 'disable'], correct: [0, 2],
    explanation: '“end” and Ctrl+Z jump straight back to privileged EXEC. “exit” only goes back one level, to global configuration.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '5.3', difficulty: 'medium', type: 'single',
    prompt: 'What are the default console connection settings for a Cisco device?',
    choices: ['9600 baud, 8 data bits, no parity, 1 stop bit', '115200 baud, 8 data bits, no parity, 1 stop bit', '9600 baud, 7 data bits, even parity, 1 stop bit', '19200 baud, 8 data bits, odd parity, 2 stop bits'], correct: [0],
    explanation: 'The classic Cisco console setting is 9600 8N1 with no flow control.',
    wrong: { 1: 'Some newer platforms allow it, but it is not the standard default.', 2: 'Wrong data bits and parity.', 3: 'Wrong speed, parity and stop bits.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: changes made in global configuration are automatically saved to the startup-config.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'Changes take effect immediately in the running-config only. Save them with “copy running-config startup-config”.',
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'hard', type: 'single',
    prompt: 'You type “ip address 10.0.0.1 255.255.255.0” at the R1(config)# prompt and get “% Invalid input detected at ‘^’ marker.” What is the most likely reason?',
    choices: ['The mask is wrong', 'The command must be entered in interface configuration mode', 'The router has no IP feature', 'You must first run “enable”'], correct: [1],
    explanation: '“ip address” is an interface sub-mode command. You need “interface <type> <number>” first.',
    wrong: { 0: '255.255.255.0 is a valid mask.', 2: 'Routers support IP addressing.', 3: 'You are already in global configuration, so you have already used enable.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: paano tandaan ang mga IOS prompt?', back: '> = Bisita · # = May-ari (susi) · (config)# = Renovation · (config-if)# = Kwarto. exit = isang hakbang palabas; end = diretso labas.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'command', front: 'Which command goes from Router> to Router#?', back: 'enable' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'command', front: 'Command to enter global configuration?', back: 'configure terminal (conf t)' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'command', front: 'exit vs end?', back: 'exit = back one level. end (or Ctrl+Z) = straight back to privileged EXEC.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Where are running-config and startup-config stored?', back: 'running-config = RAM. startup-config = NVRAM.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'command', front: 'Command to save the configuration?', back: 'copy running-config startup-config (older habit: write memory / wr)' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Three common IOS error messages?', back: '% Incomplete command · % Invalid input detected at ‘^’ marker · % Ambiguous command.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'command', front: 'How do you run a show command from config mode?', back: 'do show …  (for example: do show ip interface brief)' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Default console settings?', back: '9600 baud, 8 data bits, no parity, 1 stop bit, no flow control.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Your first router configuration',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Connect by console, walk through every IOS mode, make a configuration change, save it, and prove that unsaved changes are lost.',
  topology: 'PC1 ──(console cable)── R1',
  steps: [
    'Place a PC and a 2911 router. Use the light-blue Console cable: PC1 RS-232 to R1 Console.',
    'On PC1 open Desktop → Terminal. Keep the defaults (9600 baud, 8 data bits, no parity, 1 stop bit, no flow control) and click OK. Press Enter at the boot prompt.',
    'Note the prompt. Type enable, then configure terminal, then interface gigabitEthernet 0/0. Write down the prompt at each step.',
    'Use end to jump back to privileged EXEC. Then type ? and read the list, and try “show ru” followed by Tab.',
    'Enter configure terminal and set: hostname R1, no ip domain-lookup, banner motd #Authorized Access Only#.',
    'Run show running-config. Then run show startup-config (it will be empty or show an older config).',
    'Run copy running-config startup-config and check show startup-config again.',
    'Now change the hostname to TEMP but do NOT save. Run reload (answer “no” to saving) and observe which hostname the router boots with.',
  ],
  checklist: [
    'You recorded the four prompts: >, #, (config)# and (config-if)#',
    'hostname R1 and the banner are in show running-config',
    'startup-config matched running-config after you saved',
    'After the unsaved change and reload the old hostname came back',
  ],
  hints: [
    'If a command says “Invalid input”, look at your prompt before you look at your spelling.',
    'In Packet Tracer you may need to press Enter a couple of times before the first prompt appears.',
  ],
  solution: [
    'Prompts: Router> → Router# → Router(config)# → Router(config-if)#.',
    'After copy running-config startup-config the two configs match; the TEMP hostname was only in RAM, so the reload discarded it.',
    'Use show running-config | include hostname to check quickly.',
  ],
  breakIt: 'Type ip address 10.1.1.1 255.255.255.0 at the (config)# prompt, read the error, and fix it by entering the interface first. Then type conf and see “% Ambiguous command” (or expand to conf t) to see that error too.',
};
