import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'snmp';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.8',
  domain: 'D4',
  title: 'SNMP: Monitoring Devices from One Place',
  description: 'How a network management system polls devices and receives alerts, what the manager, agent and MIB are, and why SNMPv3 is the secure choice.',
  whyMatters:
    'Walang network engineer na nagbubukas ng bawat switch para tingnan kung may sira — may monitoring system na nagbabantay ng daan-daang device at nagpapadala ng alert. SNMP ang wika nito. Sa exam, ang mga madalas itanong ay ang mga bahagi (manager, agent, MIB), GET vs TRAP, at ang pagkakaiba ng v1, v2c at v3 pagdating sa seguridad.',
  objectives: [
    'Describe the roles of the SNMP manager, agent and MIB',
    'Distinguish polling (GET/SET) from unsolicited notifications (traps and informs)',
    'Compare SNMPv1, SNMPv2c and SNMPv3 security',
    'Name the SNMP UDP ports (161 and 162)',
    'Read a basic SNMP configuration on a Cisco device',
  ],
  estimatedMinutes: 35,
  difficulty: 'intermediate',
  keywords: ['SNMP', 'manager', 'agent', 'MIB', 'OID', 'trap', 'inform', 'GET', 'SET', 'community string', 'SNMPv3', 'UDP 161', 'UDP 162'],
  examObjectives: ['4.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'SNMP lets a central management station ask every device about its health, such as CPU load, interface counters and temperature, and lets devices shout when something goes wrong. It turns hundreds of boxes into one dashboard.',
        'There are two sides. The agent runs on the device and knows its own data. The manager asks the agent questions or listens for alerts. The data is organised in a tree called the MIB.',
      ],
      taglish: [
        'Ang **SNMP** ay nagbibigay-daan sa **isang central na management station** na **magtanong sa bawat device** tungkol sa kalusugan nito: **CPU load, interface counters, temperatura**. At puwede ring **sumigaw ang device** kapag may mali. Ginagawang **isang dashboard** ang daan-daang kahon.',
        'May **dalawang panig**: ang **agent** ay tumatakbo **sa device** at **alam ang sariling data**. Ang **manager** ang **nagtatanong sa agent** o **nakikinig ng alert**.',
        'Ang data ay nakaayos sa **puno na tinatawag na MIB** (Management Information Base). Bawat piraso ng data ay may **OID** — parang **address** sa loob ng puno.',
        'Dalawang paraan ng komunikasyon: **polling** (ang manager ang nagtatanong gamit ang **GET**, at nagbabago ng setting gamit ang **SET**) at **trap/inform** (ang **agent ang kusang nagpapadala** ng alert).',
      ],
      technical: [
        'SNMP uses UDP: the manager sends requests to the agent on port 161, and agents send traps and informs to the manager on port 162. The management station is called the NMS (network management station).',
        'The MIB is a hierarchical database of managed objects, each identified by an Object Identifier (OID) such as 1.3.6.1.2.1.1.5 (sysName). Agents expose the MIB; managers read and, where permitted, write it.',
        'Operations: GET (read one object), GETNEXT / GETBULK (read sequences, bulk is v2c and later), SET (write a value), TRAP (unacknowledged notification from agent to manager), INFORM (acknowledged notification, v2c and v3).',
        'Versions: SNMPv1 and SNMPv2c use a plain-text community string as a password (read-only "public" and read-write "private" are well-known defaults to avoid). SNMPv3 adds authentication (MD5 or SHA), encryption (DES/AES) and user-based access control, giving three security levels: noAuthNoPriv, authNoPriv and authPriv.',
        'Basic IOS configuration: snmp-server community <string> RO|RW [acl], snmp-server host <nms-ip> version 2c <string>, snmp-server enable traps, snmp-server location and snmp-server contact. Verification: show snmp, show snmp community, show snmp host.',
      ],
    },
    {
      type: 'analogy',
      title: 'Doktor at pasyente',
      body: [
        'A hospital monitoring station watches many patients. Every few minutes a nurse asks each patient how they feel (polling, GET). Each patient also has a call button they press the moment something is wrong (a trap). The patient files are organised in a standard chart (the MIB), so any nurse can find "heart rate" in the same place.',
      ],
      taglish: [
        'May **monitoring station sa ospital** na nagbabantay sa maraming pasyente. **Bawat ilang minuto**, **nagtatanong ang nurse** sa bawat pasyente kung kumusta siya (**polling, GET**). May **call button** din ang pasyente na **pinipindot agad kapag may mali** (**trap**). Ang mga record ay nasa **standard na chart** (MIB), kaya **kahit sinong nurse ay alam kung nasaan ang "heart rate"**.',
      ],
    },
    {
      type: 'hook',
      title: '161 Tanong, 162 Sigaw',
      trick: '**161** = **tanong** ng manager (GET/SET). **162** = **sigaw** ng agent (trap). **v3** = **ligtas**.',
      taglish: [
        '**UDP 161** → ang **manager ay nagtatanong** sa agent. **UDP 162** → ang **agent ay sumisigaw** (trap) sa manager.',
        '**Trap** = walang sagot (unacknowledged). **Inform** = may acknowledgement.',
        '**v1 at v2c** = **community string** lang, **plain text** — parang password na nababasa ng lahat. **v3** = may **authentication at encryption**.',
        'Sa exam, kapag tinanong ang **pinakaligtas na bersyon**, **SNMPv3** palagi.',
      ],
      test: {
        question: 'Anong port ang ginagamit kapag ang switch ay kusang nagpapadala ng alert sa NMS, at anong bersyon ang may encryption?',
        answer: 'UDP 162 para sa trap papunta sa manager. Ang SNMPv3 ang may authentication at encryption (authPriv).',
      },
    },
    { type: 'diagram', id: 'snmp-flow', caption: 'Ang manager ay nagtatanong sa UDP 161; ang agent ay nagpapadala ng trap sa UDP 162.' },
    {
      type: 'terms',
      items: [
        { term: 'SNMP', definition: 'Simple Network Management Protocol: monitors and manages network devices. UDP 161/162.' },
        { term: 'Manager (NMS)', definition: 'The central station that polls devices and receives notifications.' },
        { term: 'Agent', definition: 'Software on the managed device that holds its data and answers the manager.' },
        { term: 'MIB', definition: 'Management Information Base: the tree of managed objects on a device.' },
        { term: 'OID', definition: 'Object Identifier: the numeric address of one object in the MIB.' },
        { term: 'Trap', definition: 'An unsolicited, unacknowledged alert sent from agent to manager.' },
        { term: 'Inform', definition: 'Like a trap but acknowledged by the manager (v2c and v3).' },
        { term: 'Community string', definition: 'The plain-text password used by SNMPv1 and v2c.' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: monitoring ng switch',
      steps: [
        'Sa SW1 ay may snmp-server community at snmp-server host na tumuturo sa NMS na 10.0.0.50.',
        'Ang NMS ay nagpapadala ng GET request sa SW1 sa UDP 161 para sa CPU utilisation (isang OID).',
        'Hinahanap ng agent sa SW1 ang value sa MIB nito at sumasagot ng numero.',
        'Itinatala ng NMS ang value at gumagawa ng graph.',
        'Nasira ang isang interface. Kusang nagpapadala ang SW1 ng linkDown trap sa NMS sa UDP 162.',
        'Nagpapadala ang NMS ng alert sa administrator, kahit hindi pa ito nagpo-poll.',
      ],
    },
    {
      type: 'cli',
      title: 'Basic SNMP configuration',
      transcript: `SW1(config)# snmp-server community CCNAlab RO
SW1(config)# snmp-server location Manila-DC1
SW1(config)# snmp-server contact netops@example.com
SW1(config)# snmp-server host 10.0.0.50 version 2c CCNAlab
SW1(config)# snmp-server enable traps
SW1(config)# end
SW1# show snmp
Chassis: FOC1234
Location: Manila-DC1
1520 SNMP packets input
   0 Bad community names
SNMP logging: enabled
    Logging to 10.0.0.50.162, 0/10, 3 sent, 0 dropped.`,
      copyable: 'snmp-server community CCNAlab RO',
      explain: [
        { line: 'snmp-server community CCNAlab RO', why: 'Creates a read-only community string. The manager must present it to read data (v1/v2c).' },
        { line: 'snmp-server location / contact', why: 'Text stored in the MIB so an engineer knows where the device is and who owns it.' },
        { line: 'snmp-server host 10.0.0.50 version 2c CCNAlab', why: 'Tells the device where to send traps and which version and community to use.' },
        { line: 'snmp-server enable traps', why: 'Turns on trap generation; without it the host is never notified.' },
        { line: 'Logging to 10.0.0.50.162', why: 'Confirms traps are being sent to the NMS on UDP 162.' },
      ],
      note: 'Sample output for study. In production, prefer SNMPv3 and avoid well-known community strings.',
    },
    {
      type: 'verify',
      title: 'Verification',
      items: [
        { command: 'show snmp', shows: 'Packet counters, bad community names and where traps are being sent.' },
        { command: 'show snmp community', shows: 'The configured community strings and their access (RO or RW).' },
        { command: 'show snmp host', shows: 'Trap receivers, version and community in use.' },
        { command: 'show running-config | include snmp', shows: 'All SNMP lines in the configuration.' },
      ],
      good: 'Input packets rise when the NMS polls and traps show as sent.',
      bad: 'Bad community names increasing means the NMS uses the wrong string; no traps sent means traps are not enabled.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **v1 at v2c** ay **walang encryption** — ang community string ay nakikita sa network. Kapag **"secure"** ang hinihingi sa exam, **SNMPv3 (authPriv)** ang tamang sagot.' },
    { type: 'callout', kind: 'trap', text: 'Ang **GET/SET ay 161**, at ang **trap ay 162**. Huwag ibaliktad. Ang **trap ay walang acknowledgement**; ang **inform ay mayroon**.' },
    { type: 'callout', kind: 'tip', text: 'Ang **RW community** ay nagbibigay-daan sa **pagbabago** ng config sa device. Iwasan ito kung hindi kailangan, at huwag gamitin ang default na "public" at "private".' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagkalito sa UDP 161 at 162.',
        'Paggamit ng "public" o "private" bilang community string.',
        'Pag-iisip na ang trap ay may acknowledgement.',
        'Paglimot sa snmp-server enable traps.',
        'Paggamit ng SNMPv2c sa labas ng pinagkakatiwalaang network.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Hindi makita ng NMS ang switch"',
      scenario: 'The NMS can ping SW1 but SNMP polling times out, and the switch counts failures.',
      evidence: `SW1# show snmp
1520 SNMP packets input
   1480 Bad community names
SW1# show snmp community
Community name: CCNAlab
Community Index: CCNAlab
Storage-type: nonvolatile  active`,
      question: 'Ano ang nangyayari at paano ito aayusin?',
      answer: 'Ang bilang ng "Bad community names" ay halos lahat ng packet. Maaabot ng NMS ang switch pero maling community string ang ginagamit nito, kaya tinatanggihan ng agent ang mga request.',
      fix: 'Itugma ang community string sa NMS sa naka-configure sa SW1 (CCNAlab), o baguhin ang string sa switch. Mas mabuting lumipat sa SNMPv3 para hindi plain text ang credential. I-verify gamit ang show snmp na bumababa ang Bad community names.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Bakit mas mabilis malaman ng NMS na bumagsak ang isang link kung gagamit ng trap kaysa sa polling lang?',
      answer: 'Sa polling, naghihintay ang NMS ng susunod na poll interval (halimbawa 5 minuto) bago makita ang problema. Ang trap ay kusang ipinapadala ng agent sa sandaling may mangyari, kaya halos agad ang alert. Pinakamainam ang kombinasyon: polling para sa trend at trap para sa agarang alert.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Manager polls on UDP 161; agent sends traps/informs to UDP 162.',
        'MIB is the tree of objects; each is identified by an OID.',
        'Trap is unacknowledged; inform is acknowledged.',
        'v1 and v2c use plain-text community strings; v3 adds authentication and encryption.',
        'snmp-server community <string> RO|RW and snmp-server host are the core commands.',
      ],
    },
    {
      type: 'summary',
      points: [
        'SNMP lets an NMS poll agents and receive traps from them.',
        'Data lives in the MIB, addressed by OIDs.',
        'GET/SET use UDP 161; traps use UDP 162.',
        'SNMPv3 is the secure version; v1/v2c rely on plain-text community strings.',
        'Susunod: Syslog — mga log message at ang kanilang severity levels.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'easy', type: 'single',
    prompt: 'What is the main purpose of SNMP?',
    choices: ['Assign IP addresses', 'Monitor and manage network devices', 'Resolve hostnames', 'Synchronise clocks'], correct: [1],
    explanation: 'SNMP lets a management station monitor and manage network devices.',
    wrong: { 0: 'That is DHCP.', 2: 'That is DNS.', 3: 'That is NTP.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'easy', type: 'single',
    prompt: 'Which UDP port do SNMP traps use when sent to the manager?',
    choices: ['161', '162', '514', '123'], correct: [1],
    explanation: 'Agents send traps and informs to the manager on UDP 162; polling uses 161.',
    wrong: { 0: '161 is used for manager requests.', 2: '514 is syslog.', 3: '123 is NTP.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'medium', type: 'single',
    prompt: 'What is the MIB?',
    choices: ['A password used by SNMPv2c', 'A hierarchical database of managed objects on a device', 'The management station', 'A trap message'], correct: [1],
    explanation: 'The Management Information Base is the tree of managed objects, each identified by an OID.',
    wrong: { 0: 'That is the community string.', 2: 'That is the NMS/manager.', 3: 'Traps are notifications, not the database.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'medium', type: 'single',
    prompt: 'Which SNMP version provides authentication and encryption?',
    choices: ['SNMPv1', 'SNMPv2c', 'SNMPv3', 'All versions'], correct: [2],
    explanation: 'SNMPv3 adds authentication and privacy (encryption); v1 and v2c use plain-text community strings.',
    wrong: { 0: 'v1 uses a plain-text community string.', 1: 'v2c also uses plain text.', 3: 'Only v3 has these.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'medium', type: 'single',
    prompt: 'What is the difference between an SNMP trap and an inform?',
    choices: ['Traps are encrypted; informs are not', 'An inform is acknowledged by the manager; a trap is not', 'Traps are sent by the manager', 'Informs use TCP 161'], correct: [1],
    explanation: 'Informs require acknowledgement from the manager; traps are fire-and-forget.',
    wrong: { 0: 'Encryption is a v3 feature, not trap vs inform.', 2: 'Both are sent by the agent.', 3: 'Informs still use UDP.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'medium', type: 'single',
    prompt: 'Which component runs on the managed device and answers the manager?',
    choices: ['Agent', 'NMS', 'Trap', 'OID'], correct: [0],
    explanation: 'The agent holds the device data and responds to the manager.',
    wrong: { 1: 'The NMS is the manager side.', 2: 'A trap is a message.', 3: 'An OID is an object address.' },
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'hard', type: 'single',
    prompt: 'The NMS can ping a switch but polling fails and "Bad community names" is rising. What is the likely cause?',
    choices: ['A duplex mismatch', 'The NMS is using the wrong community string', 'NTP is unsynchronised', 'The switch has no VLANs'], correct: [1],
    explanation: 'The agent rejects requests that present an incorrect community string.',
    wrong: { 0: 'A duplex issue would not count bad communities.', 2: 'NTP is unrelated.', 3: 'VLANs do not affect SNMP authentication.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are SNMP operations initiated by the manager?',
    choices: ['GET', 'TRAP', 'SET', 'INFORM'], correct: [0, 2],
    explanation: 'GET and SET are requests from the manager. TRAP and INFORM are sent by the agent.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D4', objective: '4.4', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: SNMPv2c sends its community string encrypted.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'False — v2c sends the community string in plain text; use v3 for security.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: paano tandaan ang SNMP?', back: '161 = tanong ng manager (GET/SET), 162 = sigaw ng agent (trap). Trap walang ack, inform may ack. v1/v2c = plain-text community; v3 = authentication + encryption.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'protocol', front: 'SNMP ports?', back: 'UDP 161 for manager requests; UDP 162 for traps and informs.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Manager, agent, MIB?', back: 'Manager (NMS) polls and listens; agent runs on the device; MIB is the tree of managed objects identified by OIDs.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Trap vs inform?', back: 'Both are agent-to-manager notifications; an inform is acknowledged, a trap is not.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'concept', front: 'SNMP versions and security?', back: 'v1 and v2c: plain-text community string. v3: authentication (MD5/SHA) and encryption (DES/AES).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'command', front: 'Basic SNMP config?', back: 'snmp-server community <string> RO; snmp-server host <ip> version 2c <string>; snmp-server enable traps.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Configure SNMP and test with a wrong community',
  tool: 'Packet Tracer',
  minutes: 25,
  objective: 'Configure an SNMP community and trap host on a switch, then observe bad community names.',
  topology: 'SW1 and an NMS/PC on 10.0.0.0/24 (PC = 10.0.0.50, SW1 = 10.0.0.2).',
  steps: [
    'Give SW1 the management address 10.0.0.2 on VLAN 1 and confirm it can ping the PC.',
    'Configure snmp-server community CCNAlab RO.',
    'Configure snmp-server host 10.0.0.50 version 2c CCNAlab and snmp-server enable traps.',
    'Use an SNMP tool or Packet Tracer MIB browser with community CCNAlab and read sysName.',
    'Repeat with a wrong community and run show snmp to see Bad community names rise.',
  ],
  checklist: [
    'SNMP read works with the correct community',
    'Bad community names increased with a wrong one',
    'Traps are configured toward the NMS',
  ],
  hints: [
    'Start by proving IP connectivity before debugging SNMP.',
    'Community strings are case sensitive.',
  ],
  solution: [
    'Correct community returns the value; a wrong one is rejected and counted.',
    'snmp-server enable traps is required for trap generation.',
  ],
  breakIt: 'Change the community on the switch to a different string and watch the NMS lose access.',
};
