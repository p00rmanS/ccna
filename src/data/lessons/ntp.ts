import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ntp';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.7',
  domain: 'D4',
  title: 'NTP: Keeping Every Device on the Same Clock',
  description: 'Why accurate time matters for logs and security, how NTP client/server mode and stratum work, and how to configure and verify it on Cisco devices.',
  whyMatters:
    'Kapag magkakaiba ang oras ng bawat router at switch, imposibleng pagsunud-sunurin ang mga log kapag may insidente — hindi mo malalaman kung alin ang unang nangyari. Pati ang certificates at authentication ay umaasa sa tamang oras. Ang NTP ang nag-aayos nito, at madalas itong lumabas sa exam bilang config ("anong command ang ilalagay?") at stratum.',
  objectives: [
    'Explain why synchronised time matters for logging, certificates and troubleshooting',
    'Describe the NTP stratum hierarchy and what a lower stratum number means',
    'Configure a Cisco router or switch as an NTP client with ntp server',
    'Configure a device as an NTP server using ntp master',
    'Verify synchronisation with show ntp status and show ntp associations',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['NTP', 'stratum', 'ntp server', 'ntp master', 'show ntp status', 'show ntp associations', 'UDP 123', 'clock', 'synchronised'],
  examObjectives: ['4.2'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Every device has its own clock, and clocks drift. NTP keeps them all in step by letting devices ask a more accurate time source what time it is and adjust themselves.',
        'Time sources are arranged in layers called strata. A stratum 1 server is directly attached to a precise clock (such as GPS). Each layer below it adds one to the number, so a lower number means closer to the real source and more trustworthy.',
      ],
      taglish: [
        'Bawat device ay may **sariling orasan**, at **nagkakaiba-iba ito** habang tumatagal. Ang **NTP** ang nagpapantay: **nagtatanong ang device sa mas tumpak na time source** kung anong oras na, saka inaayos ang sarili.',
        'Bakit mahalaga? Kapag may **security incident**, **log ang pagbabasehan**. Kung **magkakaiba ang oras ng router at switch**, hindi mo masusunod ang **pagkakasunod-sunod** ng pangyayari. Kailangan din ng **certificates** at **authentication** ang tamang oras.',
        'Ang mga source ay nakaayos sa **layer na tinatawag na stratum**. Ang **stratum 1** ay direktang nakakabit sa tumpak na orasan (tulad ng **GPS** o atomic clock). Bawat layer sa ibaba ay **dagdag na isa**, kaya **mas mababang numero = mas malapit sa totoong source = mas mapagkakatiwalaan**.',
        'Sa Cisco: ang **client** ay gumagamit ng **ntp server <address>**. Kung gusto mong **ikaw mismo ang pagmulan ng oras** (sa lab, walang internet), **ntp master <stratum>**.',
      ],
      technical: [
        'NTP (Network Time Protocol, RFC 5905) uses UDP port 123. A client polls one or more servers, estimates round-trip delay and offset, and slews its clock gradually rather than jumping. Accuracy is typically within milliseconds on a LAN.',
        'Stratum describes distance from a reference clock: stratum 0 is the clock itself (GPS, atomic), stratum 1 servers are directly connected to it, stratum 2 servers sync from stratum 1, and so on up to 15. Stratum 16 means unsynchronised.',
        'Client configuration: ntp server <ip-or-hostname> (global configuration). A device can list several servers. For lab use, ntp master [stratum] makes the device authoritative using its own clock, default stratum 8. A client then syncs to that master.',
        'Authentication is optional but recommended: ntp authenticate, ntp authentication-key <n> md5 <key>, ntp trusted-key <n>, and ntp server <ip> key <n>. Without it a rogue server could mislead devices about the time.',
        'Verification: show ntp status (synchronised or unsynchronised, stratum, reference), show ntp associations (peers, the * marks the selected source), show clock (current time), and show clock detail (time source). The clock timezone and clock summer-time commands set the local display; NTP itself carries UTC.',
      ],
    },
    {
      type: 'analogy',
      title: 'Orasan ng barangay',
      body: [
        'A town keeps one master clock in the plaza that is checked against the official observatory. Every shop sets its own clock by looking at the plaza clock, and a street vendor sets his by looking at the shop. The further from the observatory you are, the less exact you are, so everyone prefers the nearest accurate clock.',
      ],
      taglish: [
        'May **isang master na orasan sa plaza** na **tinitingnan laban sa opisyal na observatory**. Ang bawat tindahan ay **nagse-set ng orasan nila** sa orasan ng plaza, at ang **tindero sa kalye** ay sa tindahan tumitingin. Habang **malayo sa observatory**, **mas hindi eksakto**, kaya **ang pinakamalapit na tumpak na orasan** ang pinipili ng lahat.',
      ],
    },
    {
      type: 'hook',
      title: 'Stratum: Mababa = Malapit sa Totoong Oras',
      trick: '**Stratum** = **layo** sa totoong orasan. **Mababa ang numero = mas malapit = mas tiwala**. **UDP 123**.',
      taglish: [
        '**Stratum 0** = ang orasan mismo (GPS/atomic). **Stratum 1** = direktang nakakabit dito.',
        '**Dagdag isa** sa bawat layer pababa. Ang **16** ay **hindi synchronised**.',
        'Kapag may dalawang pagpipilian na source, **piliin ang mas mababang stratum**.',
        'Cisco: **ntp server** = ako ang client. **ntp master** = ako ang pinagmulan. Port: **UDP 123**.',
      ],
      test: {
        question: 'May dalawang NTP server: stratum 2 at stratum 5. Alin ang mas mapagkakatiwalaan, at anong command ang gagamitin para maging client ka?',
        answer: 'Ang stratum 2 dahil mas malapit ito sa totoong orasan. Gamitin ang ntp server <ip address> sa global configuration.',
      },
    },
    { type: 'diagram', id: 'ntp-strata', caption: 'Ang stratum ay nadaragdagan ng isa sa bawat layer papalayo sa totoong orasan.' },
    {
      type: 'terms',
      items: [
        { term: 'NTP', definition: 'Network Time Protocol: synchronises device clocks. UDP port 123.' },
        { term: 'Stratum', definition: 'Distance from the reference clock. Lower is closer and preferred; 16 means unsynchronised.' },
        { term: 'ntp server', definition: 'Global command that makes the device an NTP client of the given server.' },
        { term: 'ntp master', definition: 'Makes the device an authoritative time source using its own clock (default stratum 8).' },
        { term: 'Synchronised', definition: 'The device has chosen a source and its clock agrees with it.' },
        { term: 'Association', definition: 'A relationship between the device and one NTP peer or server.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: paano nagsi-sync ang R2 sa R1',
      steps: [
        'Ang R1 ay may ntp master 3 at nagsisilbing time source para sa lab network.',
        'Sa R2 ay itinakda ang ntp server 10.0.0.1, ang address ng R1.',
        'Nagpapadala ang R2 ng NTP request (UDP 123) sa R1 at itinatala ang oras ng pagpapadala at pagtanggap.',
        'Sumasagot ang R1 ng oras nito at stratum 3.',
        'Kinukuwenta ng R2 ang delay at offset, saka dahan-dahang inaayos ang sarili nitong orasan.',
        'Nagiging synchronised ang R2 na may stratum 4 (isa pa sa source). Makikita ito sa show ntp status.',
      ],
    },
    {
      type: 'cli',
      title: 'NTP master at client, at pag-verify',
      transcript: `R1(config)# ntp master 3

R2(config)# ntp server 10.0.0.1
R2(config)# clock timezone PHT 8
R2(config)# end
R2# show ntp status
Clock is synchronized, stratum 4, reference is 10.0.0.1
nominal freq is 250.0000 Hz, actual freq is 250.0000 Hz
R2# show ntp associations
      address         ref clock       st   when   poll reach  delay  offset
*~10.0.0.1           127.127.1.1      3     12     64   377   1.2     0.4
 * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured`,
      copyable: 'ntp server 10.0.0.1',
      explain: [
        { line: 'ntp master 3', why: 'R1 becomes an authoritative source at stratum 3 using its own clock. Mainly for labs without internet.' },
        { line: 'ntp server 10.0.0.1', why: 'R2 becomes a client of R1 and will sync its clock to it.' },
        { line: 'clock timezone PHT 8', why: 'Sets how local time is displayed (UTC+8). NTP itself works in UTC.' },
        { line: 'Clock is synchronized, stratum 4', why: 'Success: R2 is synchronised and one stratum below its source (3 + 1).' },
        { line: '*~10.0.0.1', why: 'The asterisk marks the chosen source; the tilde means it is statically configured.' },
      ],
      note: 'Sample output for study. Synchronisation can take a few minutes in a lab.',
    },
    {
      type: 'verify',
      title: 'Paano i-verify ang NTP',
      items: [
        { command: 'show ntp status', shows: 'Whether the clock is synchronised, its stratum and the reference source.' },
        { command: 'show ntp associations', shows: 'All configured peers; the * marks the source in use, with delay and offset.' },
        { command: 'show clock detail', shows: 'The current time and where it came from (NTP or manual).' },
        { command: 'show running-config | include ntp', shows: 'The NTP commands configured on the device.' },
      ],
      good: 'Clock is synchronized, a source marked with *, and a small offset.',
      bad: 'Clock is unsynchronized, stratum 16 or no * on any association.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **mas mababang stratum ang mas maganda**, hindi mas mataas. Ang **stratum 16 ay hindi synchronised**. Madalas itong ibaliktad sa exam.' },
    { type: 'callout', kind: 'trap', text: 'Ang **ntp server** ay gumagawa sa device na **client**. Ang **ntp master** ay gumagawa dito na **pinagmulan ng oras**. Huwag silang paghaluin — mali ang pag-master sa production device na may tunay na source.' },
    { type: 'callout', kind: 'tip', text: 'Kapag **hindi nagsi-sync** ang NTP, tingnan muna kung **naaabot ang server** (ping) at kung **bukas ang UDP 123** sa pagitan. Madalas ang sanhi ay ACL o routing.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagkalito sa ntp server at ntp master.',
        'Pag-iisip na mas mataas ang stratum, mas maganda.',
        'Hindi pagtingin kung naaabot ang NTP server bago mag-troubleshoot ng config.',
        'Pagharang sa UDP 123 gamit ang ACL o firewall.',
        'Paglimot na ang NTP ay UTC; kailangan pa ring itakda ang clock timezone para sa lokal na display.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Hindi nagsi-sync ang oras"',
      scenario: 'A switch was configured as an NTP client, but its logs still show the wrong time.',
      evidence: `SW1# show ntp status
Clock is unsynchronized, stratum 16, no reference clock
SW1# show ntp associations
      address         ref clock       st   when   poll reach  delay  offset
 ~10.0.0.1           .INIT.          16      -     64     0    0.0    0.0
SW1# ping 10.0.0.1
.....
Success rate is 0 percent (0/5)`,
      question: 'Ano ang problema at saan ka magsisimula?',
      answer: 'Naka-configure nang tama ang NTP server (may association), pero hindi maabot ang 10.0.0.1 — 0 percent ang ping at 0 ang reach. Problema ito sa koneksyon o routing, hindi sa NTP.',
      fix: 'Ayusin muna ang reachability sa 10.0.0.1: tingnan ang default gateway ng switch, routing, at kung may ACL na humaharang sa UDP 123. Kapag nagpa-ping na, maghintay ng ilang minuto at i-check ulit ang show ntp status.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Sa lab na walang internet, kailangan ng R1 na maging time source para sa dalawang router. Anong command ang ilalagay sa R1, at ano sa dalawa pa? Ano ang magiging stratum nila kung stratum 5 ang R1?',
      answer: 'Sa R1: ntp master 5. Sa dalawa: ntp server <address ng R1>. Magiging stratum 6 ang dalawang router dahil isa pang layer ito mula sa R1.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'NTP uses UDP port 123.',
        'Lower stratum is closer to the reference clock and preferred; stratum 16 is unsynchronised.',
        'ntp server <ip> makes a device a client; ntp master [stratum] makes it a source.',
        'Verify with show ntp status and show ntp associations (the * marks the selected source).',
        'Accurate time matters for logs, certificates and authentication.',
      ],
    },
    {
      type: 'summary',
      points: [
        'NTP keeps device clocks synchronised, which makes logs and security trustworthy.',
        'Stratum measures distance from the real clock; lower is better.',
        'Configure clients with ntp server and use ntp master only where a device must be the source.',
        'Verify with show ntp status and show ntp associations.',
        'Susunod: SNMP — paano mino-monitor ng network management system ang mga device.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.2', difficulty: 'easy', type: 'single',
    prompt: 'Which transport protocol and port does NTP use?',
    choices: ['TCP 123', 'UDP 123', 'UDP 161', 'TCP 22'], correct: [1],
    explanation: 'NTP uses UDP port 123.',
    wrong: { 0: 'NTP is not TCP.', 2: 'UDP 161 is SNMP.', 3: 'TCP 22 is SSH.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.2', difficulty: 'easy', type: 'single',
    prompt: 'Why is synchronised time important on network devices?',
    choices: ['It increases link speed', 'It lets log events from different devices be correlated accurately', 'It replaces DNS', 'It assigns IP addresses'], correct: [1],
    explanation: 'Accurate, consistent timestamps allow logs from many devices to be put in order.',
    wrong: { 0: 'Time has no effect on link speed.', 2: 'DNS is unrelated.', 3: 'That is DHCP.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.2', difficulty: 'medium', type: 'single',
    prompt: 'Which NTP server is preferred?',
    choices: ['The one with stratum 5', 'The one with the lowest stratum number', 'The one with the highest stratum number', 'The one with stratum 16'], correct: [1],
    explanation: 'A lower stratum is closer to the reference clock and is preferred.',
    wrong: { 0: 'Higher than a better option.', 2: 'Higher stratum is further from the source.', 3: 'Stratum 16 means unsynchronised.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.2', difficulty: 'easy', type: 'single',
    prompt: 'Which command configures a Cisco router as an NTP client of 10.0.0.1?',
    choices: ['ntp master 10.0.0.1', 'ntp server 10.0.0.1', 'ntp client 10.0.0.1', 'clock set 10.0.0.1'], correct: [1],
    explanation: 'ntp server <address> in global configuration makes the device an NTP client of that server.',
    wrong: { 0: 'ntp master takes a stratum number, not an address.', 2: 'Not valid IOS syntax.', 3: 'That sets the clock manually.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.2', difficulty: 'medium', type: 'single',
    prompt: 'What does the ntp master command do?',
    choices: ['Makes the device an NTP client', 'Makes the device an authoritative time source using its own clock', 'Disables NTP', 'Sets the timezone'], correct: [1],
    explanation: 'ntp master makes the device an authoritative source (default stratum 8), commonly used in labs.',
    wrong: { 0: 'That is ntp server.', 2: 'It enables, not disables.', 3: 'That is clock timezone.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.2', difficulty: 'medium', type: 'single',
    prompt: 'A router syncs from a stratum 3 server. What stratum does the router have?',
    choices: ['2', '3', '4', '16'], correct: [2],
    explanation: 'A client is one stratum below its source: 3 + 1 = 4.',
    wrong: { 0: 'Stratum numbers go up, not down, away from the source.', 1: 'It cannot equal its source.', 3: 'Stratum 16 is unsynchronised.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.2', difficulty: 'medium', type: 'single',
    prompt: 'Which command confirms whether a device is synchronised to an NTP source?',
    choices: ['show ntp status', 'show ip route', 'show vlan brief', 'show ntp ping'], correct: [0],
    explanation: 'show ntp status reports synchronised or unsynchronised, the stratum and the reference.',
    wrong: { 1: 'That shows routes.', 2: 'That shows VLANs.', 3: 'Not valid IOS syntax.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.2', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO statements about NTP stratum are true?',
    choices: ['Stratum 1 servers connect directly to a reference clock', 'Higher stratum means more accurate', 'Stratum 16 means unsynchronised', 'Stratum is the number of VLANs'], correct: [0, 2],
    explanation: 'Stratum 1 is directly attached to the reference clock and 16 means unsynchronised; lower is better.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D4', objective: '4.2', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a router showing "Clock is unsynchronized, stratum 16" has a working NTP source.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — stratum 16 means the device has no valid time source.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: paano tandaan ang NTP stratum?', back: 'Stratum = layo sa totoong orasan. Mababa ang numero = mas malapit = mas mapagkakatiwalaan. 16 = hindi synchronised. UDP 123. ntp server = client; ntp master = pinagmulan.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'protocol', front: 'What does NTP do and what port does it use?', back: 'Synchronises device clocks. UDP port 123.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'concept', front: 'What is NTP stratum?', back: 'Distance from the reference clock. Lower is closer and preferred; 16 means unsynchronised.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'command', front: 'Configure an NTP client?', back: 'ntp server <ip address> (global configuration)' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'command', front: 'Make a device an NTP source?', back: 'ntp master [stratum] (default stratum 8)' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'command', front: 'Verify NTP?', back: 'show ntp status and show ntp associations (the * marks the chosen source).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Build an NTP master and two clients',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Make R1 an NTP source, synchronise two clients and read the stratum numbers.',
  topology: 'R1 — SW1 — R2 and R3, all on 10.0.0.0/24.',
  addressing: [
    { device: 'R1', interface: 'Gi0/0', address: '10.0.0.1/24', note: 'NTP master' },
    { device: 'R2', interface: 'Gi0/0', address: '10.0.0.2/24' },
    { device: 'R3', interface: 'Gi0/0', address: '10.0.0.3/24' },
  ],
  steps: [
    'Address all routers and confirm they can ping each other.',
    'On R1 run ntp master 3.',
    'On R2 and R3 run ntp server 10.0.0.1.',
    'Wait a few minutes, then run show ntp status on R2 and R3.',
    'Run show ntp associations and find the asterisk.',
    'Note the stratum of R2 and R3 and explain why it is 4.',
  ],
  checklist: [
    'Clients show Clock is synchronized',
    'Stratum 4 on both clients',
    'Identified the * source in the associations table',
  ],
  hints: [
    'Synchronisation is not instant; wait a few minutes.',
    'If it stays unsynchronised, ping the master first.',
  ],
  solution: [
    'R1 is the source at stratum 3; clients are one layer below at stratum 4.',
    'The * marks the selected server.',
  ],
  breakIt: 'Shut down R1 Gi0/0 and watch the clients eventually become unsynchronised, then bring it back.',
};
