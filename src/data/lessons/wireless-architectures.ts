import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'wireless-architectures';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.13',
  domain: 'D2',
  title: 'Wireless Architectures: Autonomous, Lightweight, CAPWAP and the WLC',
  description: 'Compare autonomous, cloud-based and split-MAC architectures, understand CAPWAP and AP modes, and know the WLC ports, interfaces and management access.',
  whyMatters:
    'Sa exam, may buong bahagi tungkol sa wireless infrastructure: anong uri ng AP, anong mode, anong port ng WLC, paano ito ina-access. Madaling puntos ito kapag naintindihan mo ang pagkakaiba ng autonomous at lightweight at ang papel ng CAPWAP.',
  objectives: [
    'Compare autonomous, lightweight (controller-based) and cloud-based architectures',
    'Explain CAPWAP, split MAC and the AP join process',
    'Identify AP modes: local, FlexConnect, monitor, sniffer, bridge and flex+bridge',
    'Describe WLC ports and interfaces (service, distribution system, LAG, management, dynamic)',
    'Describe how APs and WLCs are managed (SSH, HTTPS, console, Telnet)',
  ],
  estimatedMinutes: 45,
  difficulty: 'exam',
  keywords: ['autonomous AP', 'lightweight AP', 'CAPWAP', 'WLC', 'split MAC', 'FlexConnect', 'AP modes', 'cloud-based AP', 'LAG', 'service port', 'distribution system port'],
  examObjectives: ['2.6', '2.7', '2.8'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A small network can use autonomous access points, each configured on its own. A larger network uses lightweight access points that are managed centrally by a wireless LAN controller (WLC).',
        'Lightweight APs build CAPWAP tunnels to the WLC. The AP does the radio work and the WLC does the policy and management work.',
      ],
      taglish: [
        'Sa maliit na network, pwedeng **autonomous AP** — bawat AP ay **sariling i-configure**, parang maliit na router. Sa malaki, mas gamit ang **lightweight AP** na **pinamamahalaan ng WLC (Wireless LAN Controller)** mula sa gitna.',
        'Ang lightweight AP ay gumagawa ng **CAPWAP tunnel** papunta sa WLC. Hati ang trabaho (**split MAC**): ang **AP** ang humahawak sa radyo (beacon, pagtanggap ng frame), ang **WLC** naman sa **polisiya, seguridad, roaming at RRM** (radio resource management).',
        'May ikatlong uri: **cloud-based AP** (hal. Meraki) — ang management ay nasa cloud, ang data ay lokal.',
      ],
      technical: [
        'Autonomous APs contain the full control and data function and are configured individually (or with management software). They scale poorly because every AP needs its own configuration for SSIDs, security and channels.',
        'Lightweight APs use the CAPWAP protocol (RFC 5415) to tunnel to a WLC: UDP 5246 for control and UDP 5247 for data, with DTLS protecting the control channel (data tunnel optional). The split-MAC design puts real-time functions on the AP and management functions on the WLC.',
        'AP modes include local (default; serves clients and scans channels), FlexConnect (switches client traffic locally at a branch when the WLC is unreachable), monitor (no clients; scans for threats), sniffer (captures packets for an analyser), bridge/mesh (connects networks wirelessly) and Flex+Bridge. Cloud-based APs are managed from a cloud dashboard.',
      ],
    },
    {
      type: 'analogy',
      title: 'Kompanya at sangay',
      body: [
        'Autonomous APs are like independent small shops, each with its own manager and rulebook. Lightweight APs are like branches of a chain: the head office (WLC) sets the rules, handles complaints and plans coverage, while the branch (AP) just serves customers at the counter (radio).',
      ],
      taglish: [
        'Ang **autonomous AP** ay parang **tindahan na sariling may-ari at sariling patakaran**. Ang **lightweight AP** ay parang **sangay ng malaking kadena**: ang **head office (WLC)** ang gumagawa ng patakaran at nagpaplano ng coverage, habang ang **sangay (AP)** ay nagseserbisyo lang sa counter (radyo). Ang CAPWAP ang “hotline” ng sangay at head office.',
      ],
    },
    {
      type: 'hook',
      title: '5246 control, 5247 data',
      trick: '**AP = RADYO. WLC = UTAK. CAPWAP: 5246 CONTROL, 5247 DATA (isa pa ng isa). Local = default na mode.**',
      taglish: [
        '**AP = radyo, WLC = utak**: split MAC.',
        '**CAPWAP**: UDP **5246** = control, UDP **5247** = data. Tandaan: control ay mas mababa ang numero.',
        '**Local mode** = default; nagse-serve ng clients at nag-i-scan ng channel paminsan-minsan.',
        '**FlexConnect** = para sa branch: kapag nawala ang WLC, nagpapatuloy ang local switching ng client traffic.',
      ],
      test: {
        question: 'Anong UDP ports ang ginagamit ng CAPWAP at para saan ang bawat isa?',
        answer: 'UDP 5246 para sa control messages at UDP 5247 para sa data tunnel.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Paano nagjo-join ang AP sa WLC',
      paragraphs: [
        'Pagbukas ng lightweight AP: (1) kumukuha ito ng IP address sa DHCP, (2) hinahanap ang WLC (sa pamamagitan ng DHCP option 43, DNS na CISCO-CAPWAP-CONTROLLER, o broadcast), (3) nagpapadala ng discovery request, (4) pumipili ng WLC, (5) bumubuo ng DTLS/CAPWAP tunnel at nagpa-join.',
        'Pagkatapos mag-join, ang AP ay maaaring mag-download ng bagong software image at configuration mula sa WLC. Mula roon, kinokontrol na ng WLC ang SSID, security, channel at power ng AP.',
        'Sa troubleshooting: kung ang AP ay hindi nagjo-join, tingnan ang DHCP (nakakuha ba ng IP?), ang connectivity papunta sa WLC (UDP 5246/5247 sa firewall?) at ang oras/certificate (DTLS).',
      ],
      steps: [
        'AP boots at kumukuha ng IP address (DHCP).',
        'AP discover ng WLC: DHCP option 43, DNS o broadcast.',
        'AP pumipili ng WLC at nagpapadala ng join request.',
        'Nabubuo ang CAPWAP tunnel (control sa DTLS).',
        'Nagda-download ng image/config at nagiging operational.',
      ],
      tricks: [
        'Ang DHCP option 43 ay “GPS” ng AP papunta sa WLC. Tandaan ang numerong 43.',
        'Ang AP at WLC ay maaaring nasa magkaibang subnet basta may route at bukas ang CAPWAP ports.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Mga AP mode at WLC port',
      paragraphs: [
        '**Local**: default; nag-bu-bridge ng client traffic sa WLC sa pamamagitan ng CAPWAP tunnel. **FlexConnect**: puwedeng mag-switch ng traffic nang lokal sa branch; kapaki-pakinabang kung malayo ang WLC. **Monitor**: walang clients; tumitingin lang ng rogue AP at atake. **Sniffer**: kumukuha ng packets para sa analyser. **Bridge/Mesh**: nag-uugnay ng dalawang network nang wireless. **Flex+Bridge**: kombinasyon.',
        'Mga port ng WLC: **Service port** — para sa out-of-band management/recovery; **Distribution system port** — nagdadala ng trapiko ng client at management (data plane, kadalasang 802.1Q trunk); **Console port** — CLI; **Redundancy port** — para sa HA pair. Maraming distribution system port ay maaaring pagsamahin bilang **LAG (Link Aggregation Group)** — isang logical port; hindi ito gumagamit ng LACP sa WLC sa karaniwang kaso (LAG on, “on” mode sa switch).',
        'Mga interface (logical): **Management interface** (komunikasyon sa AP at admin), **Virtual interface** (para sa guest redirect/DHCP relay), **Service port interface**, at **Dynamic interfaces** (ina-assign sa VLAN para sa mga WLAN; bawat WLAN ay mamamapa sa isang dynamic interface/VLAN).',
      ],
      steps: [
        'Tukuyin ang AP mode: kailangan ba ng client service, monitoring o bridging?',
        'Ikabit ang mga WLC port: service para sa recovery, distribution system sa trunk (o LAG).',
        'Gumawa ng dynamic interface para sa VLAN ng bawat WLAN.',
        'Itakda ang management access (HTTPS/SSH) at i-disable ang Telnet.',
      ],
      tricks: [
        'LAG sa WLC = “bundle ng distribution ports”; ang switch ay naka-configure sa `channel-group … mode on`.',
        'Para sa exam: Monitor mode = walang service sa clients; Sniffer = packet capture; FlexConnect = lokal na switching sa branch.',
      ],
    },
    {
      type: 'remember',
      title: 'Wireless architecture na lumalabas sa exam',
      items: [
        '**Autonomous = sariling configuration; lightweight = pinamamahalaan ng WLC; cloud-based = management sa cloud.**',
        '**CAPWAP: UDP 5246 control, UDP 5247 data.** **Split MAC: AP = real-time, WLC = management.**',
        '**AP modes: local (default), FlexConnect, monitor, sniffer, bridge, flex+bridge.**',
        '**WLC: service port (out-of-band), distribution system port (trunk), LAG = bundle ng distribution ports.**',
        '**DHCP option 43 = paraan para malaman ng AP ang WLC.**',
      ],
    },
    { type: 'diagram', id: 'wlc-capwap', caption: 'Mga lightweight AP na may CAPWAP tunnel papunta sa WLC.' },
    {
      type: 'terms',
      items: [
        { term: 'Autonomous AP', definition: 'An AP that is configured and managed on its own.' },
        { term: 'Lightweight AP', definition: 'An AP that joins a WLC and is configured centrally.' },
        { term: 'CAPWAP', definition: 'Protocol that tunnels control (UDP 5246) and data (UDP 5247) between an AP and a WLC.' },
        { term: 'Split MAC', definition: 'Architecture where real-time functions run on the AP and management functions run on the WLC.' },
        { term: 'FlexConnect', definition: 'AP mode that switches client traffic locally at a branch if the WLC is unreachable.' },
        { term: 'LAG', definition: 'Link Aggregation Group: several WLC distribution system ports bundled as one logical port.' },
        { term: 'Distribution system port', definition: 'WLC port that carries client and management traffic, usually an 802.1Q trunk.' },
      ],
    },
    {
      type: 'flow',
      title: 'Paano gumagana ang lightweight WLAN',
      steps: [
        'Ang AP ay nakakuha ng IP at nakahanap ng WLC.',
        'Nagjo-join ang AP at bumubuo ng CAPWAP tunnel.',
        'Pinapadala ng WLC ang SSID, security at radio configuration.',
        'Kumokonekta ang client sa AP; ang AP ay nag-tunnel o lokal na nag-switch ng traffic ayon sa mode.',
        'Pinamamahalaan ng WLC ang roaming, RRM at polisiya.',
      ],
    },
    {
      type: 'cli',
      title: 'Pagpapatunay mula sa switch at AP',
      transcript: `SW1# show running-config interface gigabitEthernet 1/0/10
interface GigabitEthernet1/0/10
 description AP-LOBBY
 switchport trunk allowed vlan 10,20
 switchport mode trunk
SW1# show interfaces trunk
Gi1/0/10   on   802.1q   trunking   10`,
      copyable: 'show running-config interface gigabitEthernet 1/0/10\nshow interfaces trunk',
      explain: [
        { line: 'switchport mode trunk', why: 'A FlexConnect or local-mode AP often needs a trunk; the native VLAN carries the AP’s own management IP.' },
        { line: 'switchport trunk allowed vlan 10,20', why: 'Only the VLANs that the AP needs are carried to it.' },
        { line: 'description AP-LOBBY', why: 'Documents which AP is on the port, which helps when the AP fails to join.' },
      ],
      note: 'Join status is checked on the WLC itself (its AP list); the exam focuses on concepts rather than WLC command output.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **local mode ay default**, hindi FlexConnect. Ang **monitor mode** ay hindi nagse-serve ng clients; hindi ito ang “normal” na mode.' },
    { type: 'callout', kind: 'trap', text: 'Hindi ang AP ang “nag-iisip” sa lightweight design — ang WLC. Kapag nawala ang WLC, ang local-mode AP ay hindi na makapagbibigay ng serbisyo (maliban sa FlexConnect).' },
    { type: 'callout', kind: 'tip', text: 'Para sa mga tanong na “anong port?”, kabisaduhin: service = out-of-band, distribution = data/management trunk, console = CLI, redundancy = HA.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Confusing the CAPWAP control (5246) and data (5247) ports.',
        'Assuming FlexConnect is the default mode.',
        'Thinking a monitor-mode AP serves clients.',
        'Forgetting that a lightweight AP cannot work without a WLC (except FlexConnect local switching).',
        'Using Telnet for management access instead of SSH or HTTPS.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Hindi nagjo-join ang AP',
      scenario: 'A new lightweight AP gets an IP address but never appears on the WLC. The firewall between the AP VLAN and the WLC was recently changed.',
      evidence: `FW# show access-list WLC-IN
 10 permit udp 10.10.10.0 0.0.0.255 host 10.0.0.5 eq 5246 (0 matches)
 20 deny ip any any (84 matches)`,
      question: 'Ano ang kulang sa firewall rule?',
      answer: 'Only the CAPWAP control port (UDP 5246) is permitted. The data tunnel uses UDP 5247, and DHCP/DNS discovery traffic may also be blocked. The AP cannot complete the join.',
      fix: 'Permit UDP 5246 and UDP 5247 between the AP subnet and the WLC (and allow the DHCP option 43/DNS discovery path). Verify that the AP shows as joined on the WLC.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang branch office ay may 5 AP at ang WLC ay nasa HQ, malayo. Gusto mong magpatuloy ang local access kahit bumagsak ang WAN. Anong AP mode ang pipiliin, at bakit?',
      answer: 'FlexConnect. It lets the AP switch client traffic locally at the branch when the WLC is unreachable, so clients keep working during a WAN outage. Local mode would depend on the WLC.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'CAPWAP: 5246 control, 5247 data.',
        'Local mode is the default AP mode.',
        'LAG bundles WLC distribution system ports.',
        'Service port is out-of-band management.',
        'Cloud-based AP = management in the cloud.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Autonomous: standalone; lightweight: controller managed; cloud-based: cloud managed.',
        'Split MAC: AP radio, WLC management.',
        'CAPWAP uses UDP 5246 and 5247.',
        'AP modes: local, FlexConnect, monitor, sniffer, bridge.',
        'WLC ports: service, distribution system, console, redundancy.',
        'Susunod: WLC GUI configuration ng WLAN.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.6', difficulty: 'easy', type: 'single',
    prompt: 'Which UDP ports does CAPWAP use for control and data?',
    choices: ['5246 control, 5247 data', '5247 control, 5246 data', '161 and 162', '67 and 68'], correct: [0],
    explanation: 'CAPWAP uses UDP 5246 for control messages and UDP 5247 for the data tunnel.',
    wrong: { 1: 'Control and data are swapped.', 2: 'Those are SNMP ports.', 3: 'Those are DHCP ports.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.6', difficulty: 'medium', type: 'single',
    prompt: 'Which AP mode lets a branch AP keep switching client traffic locally when the WLC is unreachable?',
    choices: ['Local', 'Monitor', 'FlexConnect', 'Sniffer'], correct: [2],
    explanation: 'FlexConnect supports local switching at a remote site even if the WLC link is down.',
    wrong: { 0: 'Local mode depends on the WLC tunnel.', 1: 'Monitor mode serves no clients.', 3: 'Sniffer mode captures packets only.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.6', difficulty: 'medium', type: 'single',
    prompt: 'In a split-MAC architecture, which functions does the WLC handle?',
    choices: ['Beacon transmission', 'Frame acknowledgements', 'Management such as security policy and roaming', 'Radio frequency transmission'], correct: [2],
    explanation: 'The AP handles real-time radio functions; the WLC handles management functions.',
    wrong: { 0: 'Beacons are sent by the AP.', 1: 'ACKs are real-time and done on the AP.', 3: 'The AP’s radio transmits.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.7', difficulty: 'medium', type: 'single',
    prompt: 'Which WLC port is intended for out-of-band management and recovery?',
    choices: ['Distribution system port', 'Service port', 'Redundancy port', 'LAG'], correct: [1],
    explanation: 'The service port is the dedicated out-of-band management port.',
    wrong: { 0: 'It carries client and management traffic in-band.', 2: 'It connects an HA pair.', 3: 'LAG bundles distribution ports.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.6', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: the default mode of a lightweight AP is monitor mode.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'The default is local mode.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.6', difficulty: 'hard', type: 'multiple',
    prompt: 'Which TWO methods can an AP use to learn the address of a WLC?',
    choices: ['DHCP option 43', 'DNS name CISCO-CAPWAP-CONTROLLER', 'ARP', 'STP'], correct: [0, 1],
    explanation: 'APs commonly learn the controller from DHCP option 43 or DNS. ARP and STP are not WLC discovery methods.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: AP vs WLC at CAPWAP ports?', back: 'AP = radyo, WLC = utak. CAPWAP: UDP 5246 control, 5247 data. Local = default na mode.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Autonomous vs lightweight AP?', back: 'Autonomous: configured individually. Lightweight: joins a WLC and is managed centrally.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'port', front: 'CAPWAP ports?', back: 'UDP 5246 (control) and UDP 5247 (data).' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What does FlexConnect do?', back: 'Switches client traffic locally at a branch when the WLC is unreachable.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What does LAG do on a WLC?', back: 'Bundles distribution system ports into one logical port.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'concept', front: 'What does a monitor-mode AP do?', back: 'Scans for rogue APs and attacks; does not serve clients.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D2', category: 'concept', front: 'How does an AP discover a WLC?', back: 'DHCP option 43, DNS (CISCO-CAPWAP-CONTROLLER) or broadcast.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Plan a controller-based wireless network',
  tool: 'Paper',
  minutes: 30,
  objective: 'Design the switch, WLC and AP connections for a two-floor office and a branch, choosing AP modes and WLC ports.',
  steps: [
    'Draw a HQ with a WLC, a core switch and 10 APs and a branch with 4 APs and a WAN link to HQ.',
    'Choose AP modes for HQ and for the branch and justify the choice.',
    'Decide how the WLC connects to the switch: distribution system ports as a LAG, plus the service port on an out-of-band network.',
    'Write which switch ports are access and which are trunks, and list the VLANs on each.',
    'Write the DHCP option 43 or DNS entry the APs will use to find the WLC.',
    'List the UDP ports that must be allowed through the firewall between the branch and HQ.',
  ],
  checklist: [
    'AP modes selected and justified',
    'LAG and service port planned',
    'VLANs and trunks listed',
    'WLC discovery method written',
    'Firewall ports listed',
  ],
  hints: [
    'The branch AP needs local switching if the WAN fails.',
    'CAPWAP uses two UDP ports.',
  ],
  solution: [
    'HQ APs: local mode. Branch APs: FlexConnect.',
    'WLC: two distribution system ports in a LAG to the core switch trunk; service port on the management network.',
    'Allow UDP 5246 and 5247 (and DHCP/DNS for discovery) between the branch and HQ.',
  ],
  breakIt: 'Remove the CAPWAP data port from the firewall and predict what happens to a branch FlexConnect AP versus a local-mode AP.',
};
