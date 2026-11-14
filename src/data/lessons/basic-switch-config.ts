import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'basic-switch-config';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.1',
  domain: 'D2',
  title: 'Basic Switch Configuration: Passwords, Management IP and Verification',
  description: 'Configure a new switch from scratch: hostname, local passwords, banner, management SVI and default gateway, interface settings, saving and verifying.',
  whyMatters:
    'Bawat lab at bawat simulation sa exam ay nagsisimula sa batayang configuration. Kapag mabilis at tama mo itong magawa, makakatipid ka ng oras at hindi ka magkakamali sa mga simpleng bagay tulad ng nakalimutang no shutdown o default gateway. Ito rin ang sumasaklaw sa objective 5.3 (local passwords).',
  objectives: [
    'Configure hostname, enable secret, console and VTY passwords',
    'Set a banner and encrypt passwords with service password-encryption',
    'Assign a management IP address to the VLAN interface and set the default gateway',
    'Configure interface description, speed, duplex and shutdown state',
    'Save the configuration and verify with show commands',
  ],
  estimatedMinutes: 40,
  difficulty: 'beginner',
  keywords: ['hostname', 'enable secret', 'line console', 'line vty', 'service password-encryption', 'banner motd', 'interface vlan 1', 'ip default-gateway', 'description', 'copy running-config startup-config', 'show running-config', 'show ip interface brief'],
  examObjectives: ['2.1', '5.3'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A new switch works with no configuration, but it has no password, no name and no management address. Basic configuration gives it a name, protects access, gives it an IP address for remote management and saves the result.',
        'A Layer 2 switch gets its management address on a VLAN interface (SVI) and needs ip default-gateway to be reachable from other networks.',
      ],
      taglish: [
        'Ang bagong switch ay gumagana kahit walang configuration, pero **walang pangalan, walang password at walang management address**. Ang basic configuration ay nagbibigay ng **pangalan**, **proteksyon sa access**, **IP address para sa remote management** at **sine-save** ang resulta.',
        'Ang Layer 2 switch ay nagkakaroon ng management address sa **VLAN interface (SVI)** at kailangan ng **`ip default-gateway`** para maabot mula sa ibang network.',
        'Pagkakasunod na madaling tandaan: **(1) pangalan, (2) password, (3) banner, (4) management IP + gateway, (5) interface, (6) SAVE, (7) verify**.',
      ],
      technical: [
        'The hostname appears in the prompt and in logs. enable secret stores a hashed privileged password and takes precedence over enable password. line console 0 and line vty 0 15 each take login (a line password) or login local (username-based). service password-encryption applies weak type 7 reversible encoding to line passwords; it does not replace enable secret. A banner motd shows a legal warning before login.',
        'A Layer 2 switch has no routing; its management address is configured on a switch virtual interface, for example interface vlan 1 with ip address 192.168.1.2 255.255.255.0 and no shutdown, plus ip default-gateway 192.168.1.1 so that management traffic can leave the subnet. Interfaces can be documented with description and set with speed and duplex (default auto-negotiation). Unused ports should be shut down.',
        'The running-config in RAM must be saved with copy running-config startup-config (or write memory) to survive a reload. Verification uses show running-config, show interfaces status, show ip interface brief, show vlan brief and show version.',
      ],
    },
    {
      type: 'analogy',
      title: 'Bagong apartment',
      body: [
        'Moving into a new apartment: put your name on the door (hostname), change the locks (passwords), hang a “private property” sign (banner), get a street address so people can find you (management IP and gateway), label the rooms (descriptions) and write everything down in the logbook (save).',
      ],
      taglish: [
        'Parang paglipat sa **bagong apartment**: ilagay ang **pangalan sa pinto (hostname)**, palitan ang **kandado (password)**, magsabit ng **karatulang “pribadong ari-arian” (banner)**, kumuha ng **address para mahanap ka (management IP at gateway)**, lagyan ng **label ang bawat kwarto (description)** at isulat ang lahat sa **logbook (save)**.',
      ],
    },
    {
      type: 'hook',
      title: 'HPB-MIS',
      trick: '**HPB-MIS = Hostname, Password, Banner, Management IP, Interfaces, SAVE. Pagkatapos: show.**',
      taglish: [
        '**H**ostname → **P**assword (enable secret, console, VTY) → **B**anner → **M**anagement IP + gateway → **I**nterfaces (description, shutdown) → **S**AVE.',
        '**enable secret** (hashed) ang gamitin, hindi enable password.',
        '**SVI**: `interface vlan 1` + `ip address` + **`no shutdown`**; **`ip default-gateway`** sa global config.',
        '**copy running-config startup-config** — kung hindi, mawawala ang lahat sa reload.',
      ],
      test: {
        question: 'Bakit hindi mo maabot ang switch mula sa ibang network kahit may IP at no shutdown ang SVI?',
        answer: 'Malamang kulang ang `ip default-gateway`. Kung wala ito, hindi alam ng switch kung saan ipapadala ang reply papunta sa ibang subnet.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Pangalan, password at banner',
      paragraphs: [
        'Mula sa user EXEC (>), pumasok sa privileged EXEC gamit ang `enable`, tapos `configure terminal`. Una: `hostname SW1`. Pangalawa: `enable secret <password>` — naka-hash (type 5/8/9) at nananaig sa `enable password`.',
        'Console: `line console 0`, `password <pw>`, `login`, `logging synchronous` (para hindi maputol ng log ang tina-type mo) at `exec-timeout 5 0`. VTY: `line vty 0 15`, `password <pw>`, `login` (o `login local` na may `username admin secret <pw>`) at `transport input ssh` kung ise-SSH.',
        '`service password-encryption` ay nag-e-encode ng mga line password (type 7, mahina at madaling i-decode) — hindi ito kapalit ng enable secret. `banner motd #Authorized access only#` ay nagpapakita ng legal na babala bago mag-login.',
      ],
      steps: [
        'enable → configure terminal.',
        'hostname SW1.',
        'enable secret <password>.',
        'line console 0 → password → login → logging synchronous.',
        'line vty 0 15 → password → login (o login local + username).',
        'service password-encryption.',
        'banner motd #...#.',
      ],
      tricks: [
        'Ang `login` na walang password ay hindi papayagan ang remote access.',
        'Kapag na-type mo ang maling command, mapagkakamalan itong hostname lookup at maghihintay — gamitin ang `no ip domain-lookup` sa lab.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Management IP, gateway at interface',
      paragraphs: [
        'Ang Layer 2 switch ay walang routed port sa default, kaya ang management address ay nasa SVI: `interface vlan 1`, `ip address 192.168.1.2 255.255.255.0`, `no shutdown`. Mas ligtas na gumamit ng hiwalay na management VLAN (hal. VLAN 99) kaysa VLAN 1.',
        'Para maabot mula sa ibang network: global command na `ip default-gateway 192.168.1.1`. (Hindi ito ang `ip route`; para lang ito sa Layer 2 switch.)',
        'Interface: `interface fastEthernet 0/5`, `description PC-Accounting`, `switchport mode access`, `switchport access vlan 10`; `speed 100` at `duplex full` kung kailangan (kadalasan auto); `shutdown` para sa hindi ginagamit. Gamitin ang `interface range fa0/1 - 24` para sa maraming port.',
        'Huling hakbang: `copy running-config startup-config` (o `write memory`). I-verify: `show running-config`, `show interfaces status`, `show ip interface brief`, `show vlan brief`.',
      ],
      steps: [
        'interface vlan 99 → ip address → no shutdown.',
        'ip default-gateway <router>.',
        'interface <int> → description → switchport mode access → access vlan.',
        'shutdown ang mga hindi ginagamit na port.',
        'copy running-config startup-config.',
        'show ip interface brief at show interfaces status.',
      ],
      tricks: [
        'Ang SVI ay “up/up” lang kung may kahit isang aktibong port sa VLAN na iyon.',
        'Ang `ip default-gateway` ay para sa switch na walang `ip routing`; sa Layer 3 switch na may routing, gumamit ng `ip route`.',
      ],
    },
    {
      type: 'remember',
      title: 'Basic switch config na lumalabas sa exam',
      items: [
        '**enable secret = hashed at nananaig sa enable password.** **service password-encryption = type 7, mahina.**',
        '**line console 0 at line vty 0 15 → password + login (o login local).**',
        '**Management IP sa SVI (interface vlan N) + no shutdown; ip default-gateway para sa ibang network.**',
        '**copy running-config startup-config para ma-save.** **running-config = RAM; startup-config = NVRAM.**',
        '**show running-config, show ip interface brief, show interfaces status, show vlan brief.**',
      ],
    },
    { type: 'diagram', id: 'ios-modes', caption: 'Mga mode ng IOS: user EXEC, privileged EXEC at configuration.' },
    {
      type: 'terms',
      items: [
        { term: 'SVI', definition: 'Switch virtual interface: a VLAN interface that holds the switch’s management IP address.' },
        { term: 'enable secret', definition: 'A hashed privileged EXEC password that overrides enable password.' },
        { term: 'ip default-gateway', definition: 'Global command that tells a Layer 2 switch where to send off-subnet management traffic.' },
        { term: 'Banner motd', definition: 'A message displayed to anyone connecting, usually a legal warning.' },
        { term: 'startup-config', definition: 'The configuration saved in NVRAM and loaded at boot.' },
        { term: 'running-config', definition: 'The active configuration held in RAM.' },
        { term: 'Interface description', definition: 'Text label on an interface that documents what it connects to.' },
      ],
    },
    {
      type: 'flow',
      title: 'Pagkakasunod ng bagong switch',
      steps: [
        'Kumonekta gamit ang console at pumasok sa configuration mode.',
        'Itakda ang hostname, enable secret, console at VTY passwords, banner.',
        'Itakda ang management SVI, no shutdown at default gateway.',
        'I-configure ang mga interface: description, VLAN, shutdown ng hindi ginagamit.',
        'I-save at i-verify.',
      ],
    },
    {
      type: 'cli',
      title: 'Kumpletong basic configuration',
      transcript: `Switch> enable
Switch# configure terminal
Switch(config)# hostname SW1
SW1(config)# enable secret Cisco!2026
SW1(config)# line console 0
SW1(config-line)# password C0nsole!2026
SW1(config-line)# login
SW1(config-line)# logging synchronous
SW1(config)# line vty 0 15
SW1(config-line)# password Vty!2026
SW1(config-line)# login
SW1(config)# service password-encryption
SW1(config)# banner motd #Authorized access only#
SW1(config)# interface vlan 1
SW1(config-if)# ip address 192.168.1.2 255.255.255.0
SW1(config-if)# no shutdown
SW1(config)# ip default-gateway 192.168.1.1
SW1(config)# interface fastEthernet 0/5
SW1(config-if)# description PC-Accounting
SW1# copy running-config startup-config`,
      copyable: 'enable\nconfigure terminal\nhostname SW1\nenable secret <password>\nline console 0\npassword <password>\nlogin\nlogging synchronous\nline vty 0 15\npassword <password>\nlogin\nservice password-encryption\nbanner motd #Authorized access only#\ninterface vlan 1\nip address 192.168.1.2 255.255.255.0\nno shutdown\nip default-gateway 192.168.1.1\ninterface fastEthernet 0/5\ndescription PC-Accounting\ncopy running-config startup-config',
      explain: [
        { line: 'enable secret …', why: 'Sets the privileged EXEC password as a hash; it overrides any enable password.' },
        { line: 'logging synchronous', why: 'Stops log messages from interrupting the command you are typing on the console.' },
        { line: 'ip address 192.168.1.2 255.255.255.0', why: 'The switch’s management address on the VLAN 1 SVI; remember no shutdown.' },
        { line: 'ip default-gateway 192.168.1.1', why: 'Lets the switch reply to management traffic from other subnets.' },
        { line: 'copy running-config startup-config', why: 'Saves the configuration from RAM to NVRAM so it survives a reload.' },
      ],
      note: 'Use your own strong passwords; those shown are placeholders.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **nakalimutang `no shutdown`** sa SVI ang pinakakaraniwang dahilan kung bakit hindi maabot ang switch. Ang SVI ay naka-shutdown hanggang buksan mo ito (depende sa modelo).' },
    { type: 'callout', kind: 'trap', text: 'Kapag hindi mo **na-save**, **mawawala ang configuration** sa reload. Ang running-config ay nasa RAM.' },
    { type: 'callout', kind: 'tip', text: 'Gumawa ng routine: pagkatapos ng bawat bahagi ng configuration, `end`, `show running-config | section <bahagi>` para i-check, saka `copy run start`.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Using enable password instead of enable secret.',
        'Forgetting no shutdown on the management SVI.',
        'Forgetting ip default-gateway, so the switch is unreachable from other subnets.',
        'Not saving the configuration.',
        'Using login without setting a line password.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Hindi maabot ang switch mula sa ibang network',
      scenario: 'An administrator can reach SW1 (192.168.1.2) from a PC in 192.168.1.0/24, but not from 10.0.0.0/24 through the router.',
      evidence: `SW1# show ip interface brief
Vlan1        192.168.1.2   YES manual up   up
SW1# show running-config | include default-gateway
SW1#`,
      question: 'Ano ang kulang?',
      answer: 'The switch has no default gateway. It can answer hosts in its own subnet but has no route back to 10.0.0.0/24.',
      fix: 'Configure ip default-gateway 192.168.1.1 (the router interface in the same subnet) in global configuration, then test from the remote network and save the configuration.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang mga command para sa SW2: management address 10.0.99.5/24 sa VLAN 99, gateway 10.0.99.1, at i-save.',
      answer: 'interface vlan 99 / ip address 10.0.99.5 255.255.255.0 / no shutdown; ip default-gateway 10.0.99.1 (global); end; copy running-config startup-config. VLAN 99 must exist and have an active port for the SVI to be up/up.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'enable secret overrides enable password.',
        'A Layer 2 switch needs ip default-gateway to be managed remotely.',
        'running-config is RAM; startup-config is NVRAM.',
        'Always no shutdown the SVI.',
        'Verify with show ip interface brief.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Name, protect, address, configure interfaces, save, verify.',
        'Use enable secret and login on lines.',
        'Management IP lives on an SVI with a default gateway.',
        'Save with copy running-config startup-config.',
        'Susunod: troubleshooting method.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '5.3', difficulty: 'easy', type: 'single',
    prompt: 'Which command stores the privileged EXEC password as a hash?',
    choices: ['enable password', 'enable secret', 'service password-encryption', 'login local'], correct: [1],
    explanation: 'enable secret stores a hashed password and overrides enable password.',
    wrong: { 0: 'enable password is stored in plain text unless encoded.', 2: 'It applies weak reversible encoding to line passwords.', 3: 'login local selects local usernames for a line.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'A Layer 2 switch has an IP address on interface vlan 1 and the SVI is up. What is required to manage it from another subnet?',
    choices: ['ip routing', 'ip default-gateway', 'A second VLAN', 'ip helper-address'], correct: [1],
    explanation: 'ip default-gateway tells the switch where to send traffic for other subnets.',
    wrong: { 0: 'ip routing is for a Layer 3 switch that routes.', 2: 'A second VLAN is not needed.', 3: 'Helper-address relays DHCP.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'single',
    prompt: 'Where is the active configuration of a switch stored?',
    choices: ['NVRAM', 'Flash', 'RAM', 'ROM'], correct: [2],
    explanation: 'The running-config is held in RAM; the startup-config is in NVRAM.',
    wrong: { 0: 'NVRAM holds the startup-config.', 1: 'Flash holds the IOS image.', 3: 'ROM holds the bootstrap code.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '5.3', difficulty: 'hard', type: 'single',
    prompt: 'Which command makes the VTY lines authenticate with local usernames?',
    choices: ['login', 'login local', 'password local', 'transport input ssh'], correct: [1],
    explanation: 'login local uses the username database; login alone uses the line password.',
    wrong: { 0: 'It uses the line password.', 2: 'That is not a valid command.', 3: 'It restricts the protocol, not the authentication method.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: the configuration is kept after a reload even if it is not saved to startup-config.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'Only the startup-config in NVRAM survives a reload.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO commands save the running configuration?',
    choices: ['copy running-config startup-config', 'write memory', 'reload', 'erase startup-config'], correct: [0, 1],
    explanation: 'Both copy running-config startup-config and write memory save the configuration.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'command', front: 'Pro tip: HPB-MIS?', back: 'Hostname, Password, Banner, Management IP, Interfaces, SAVE. Pagkatapos: show.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'command', front: 'How do you give a switch a management IP?', back: 'interface vlan N, ip address, no shutdown; plus ip default-gateway.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'command', front: 'How do you save the configuration?', back: 'copy running-config startup-config (or write memory).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'running-config vs startup-config?', back: 'Running in RAM; startup in NVRAM.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'command', front: 'Hashed privileged password?', back: 'enable secret.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'command', front: 'Which commands verify interfaces?', back: 'show ip interface brief and show interfaces status.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'command', front: 'What does logging synchronous do?', back: 'Prevents log messages from interrupting typed commands.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Configure a new switch from scratch',
  tool: 'Packet Tracer',
  minutes: 30,
  objective: 'Apply the basic configuration, reach the switch from another subnet and prove the configuration survives a reload.',
  steps: [
    'Place a switch, a router and two PCs. Put PC1 and the switch in 192.168.1.0/24 and PC2 behind the router in 10.0.0.0/24.',
    'Configure hostname, enable secret, console and VTY passwords, service password-encryption and a banner.',
    'Configure the management SVI with an IP address and no shutdown; ping the switch from PC1.',
    'Try pinging the switch from PC2; then add ip default-gateway and retry.',
    'Add interface descriptions and shut down unused ports.',
    'Save, reload the switch and confirm that the configuration persists; then repeat without saving to see it lost.',
  ],
  checklist: [
    'Passwords and banner working',
    'Switch reachable from both subnets',
    'Descriptions added',
    'Configuration survives a reload after saving',
  ],
  hints: [
    'The SVI must be no shutdown.',
    'The gateway must be in the switch’s subnet.',
  ],
  solution: [
    'interface vlan 1; ip address 192.168.1.2 255.255.255.0; no shutdown; ip default-gateway 192.168.1.1.',
    'Without the gateway only the local subnet can ping the switch.',
    'copy running-config startup-config preserves the configuration.',
  ],
  breakIt: 'Skip no shutdown on the SVI and describe what show ip interface brief reports.',
};
