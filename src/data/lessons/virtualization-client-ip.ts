import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'virtualization-client-ip';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.17',
  domain: 'D1',
  title: 'Virtualization and Verifying Client IP Settings',
  description: 'Understand virtual machines, hypervisors, containers and VRFs, and verify IP parameters on Windows, macOS and Linux clients.',
  whyMatters:
    'Dalawang maliit pero madaling puntos ito sa exam: (1) alam mo ba ang pagkakaiba ng VM at container, at (2) alam mo ba ang command para makita ang IP, mask, gateway at DNS ng PC. Hindi mo kailangang i-memorize ang lahat, kailangan lang ang tamang pares ng OS at command.',
  objectives: [
    'Define virtual machines, hypervisors and containers and compare them',
    'Distinguish Type 1 and Type 2 hypervisors',
    'Explain VRFs as virtualised routing tables',
    'Verify IP address, mask, gateway and DNS on Windows, macOS and Linux',
    'Troubleshoot a client with a wrong or missing IP configuration',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['virtual machine', 'hypervisor', 'container', 'VRF', 'Type 1', 'Type 2', 'ipconfig', 'ifconfig', 'ip addr', 'ip route', 'DNS', 'default gateway', 'APIPA'],
  examObjectives: ['1.10', '1.12'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Virtualisation lets one physical machine run several isolated systems. Virtual machines each have their own guest operating system on a hypervisor. Containers share the host kernel and are lighter. A VRF gives a router several separate routing tables.',
        'To check a client’s network settings use ipconfig on Windows, ifconfig or ip on Linux and macOS.',
      ],
      taglish: [
        'Ang **virtualization** ay nagpapahintulot na ang **isang pisikal na makina ay magpatakbo ng maraming hiwalay na sistema**. Ang **VM (virtual machine)** ay may sariling **guest OS** sa ibabaw ng **hypervisor**. Ang **container** ay **nagbabahagi ng kernel** ng host kaya mas magaan. Ang **VRF** ay nagbibigay sa router ng **maraming hiwalay na routing table**.',
        'Para tingnan ang network settings ng client: **`ipconfig /all`** sa Windows; **`ifconfig`** o **`ip addr`** sa Linux/macOS (modernong Linux ay `ip`). Dapat mong makita ang **IP, mask, default gateway at DNS**.',
        'Kung may **169.254.x.x** (APIPA), walang DHCP na sumagot.',
      ],
      technical: [
        'A hypervisor creates and runs virtual machines. Type 1 hypervisors (bare metal, for example VMware ESXi, KVM, Hyper-V) run directly on hardware; Type 2 hypervisors (hosted, for example VirtualBox, VMware Workstation) run on top of a host operating system. Each VM has virtual NICs connected to virtual switches.',
        'Containers (for example Docker) package an application with its dependencies and share the host kernel through a container engine, so they start fast and use fewer resources than VMs but provide weaker isolation. VRF (Virtual Routing and Forwarding) creates independent routing tables on one router so overlapping address spaces can coexist.',
        'Client verification: Windows ipconfig /all (address, mask, gateway, DNS, DHCP server, MAC); Linux ip addr show, ip route and resolvectl or /etc/resolv.conf; macOS ifconfig and networksetup. ping tests reachability; nslookup or dig tests DNS.',
      ],
    },
    {
      type: 'analogy',
      title: 'Apartment vs bahay',
      body: [
        'A VM is like a separate house with its own foundation and utilities on a shared plot (hypervisor). A container is like an apartment room sharing the building’s foundation and utilities: lighter and faster to build, but with a bit less separation.',
      ],
      taglish: [
        'Ang **VM** ay parang **hiwalay na bahay na may sariling pundasyon at tubig-kuryente** sa iisang lote (hypervisor). Ang **container** ay parang **kwarto sa apartment** na **nagbabahagi ng pundasyon** (kernel): mas mabilis at mas mura itayo, pero mas manipis ang paghihiwalay.',
      ],
    },
    {
      type: 'hook',
      title: 'VM = buong OS, Container = shared kernel',
      trick: '**VM = may sariling OS (mabigat). CONTAINER = shared kernel (magaan). TYPE 1 = diretso sa hardware. TYPE 2 = nasa ibabaw ng OS. VRF = maraming routing table.**',
      taglish: [
        '**VM** = guest OS bawat isa; hypervisor sa ibaba; **mas mabigat, mas hiwalay**.',
        '**Container** = shared host kernel; container engine; **mas magaan, mas mabilis**.',
        '**Type 1** hypervisor: **bare metal** (ESXi, KVM). **Type 2**: **hosted** (VirtualBox).',
        '**Client IP check**: `ipconfig /all` (Windows), `ifconfig`/`ip addr` (Linux, macOS).',
      ],
      test: {
        question: 'Anong command ang gagamitin sa Windows at sa Linux para makita ang IP configuration ng PC?',
        answer: 'Windows: ipconfig /all. Linux: ip addr (o ifconfig). macOS: ifconfig.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: VM, container, hypervisor at VRF',
      paragraphs: [
        'Ang **hypervisor** ay software na gumagawa at nagpapatakbo ng mga VM. **Type 1** ay tumatakbo diretso sa hardware (server-grade: ESXi, KVM, Hyper-V). **Type 2** ay tumatakbo bilang application sa ibabaw ng OS (VirtualBox, VMware Workstation). Ang mga VM ay may **virtual NIC** na nakakabit sa **virtual switch**, kaya may network na mismo sa loob ng host.',
        'Ang **container** ay nagpapatakbo ng application kasama ang dependencies nito pero **gumagamit ng kernel ng host**. Mas mabilis mag-start at mas kaunti ang resources, pero ang paghihiwalay ay mas mahina kaysa VM. Madalas gamitin sa microservices.',
        'Ang **VRF** ay hindi VM; ito ay **virtualization ng routing table** sa isang router. Bawat VRF ay may sariling routing table, kaya ang dalawang customer na parehong gumagamit ng 10.0.0.0/8 ay maaaring umiral nang hindi nagsasalubong.',
      ],
      steps: [
        'Hardware → hypervisor (Type 1) o host OS → hypervisor (Type 2).',
        'Gumawa ng VM na may sariling guest OS at virtual NIC.',
        'Ikabit ang virtual NIC sa virtual switch at, kung kailangan, sa pisikal na network.',
        'Para sa container: container engine sa host OS; mga container ay nagbabahagi ng kernel.',
        'Para sa routing: gumawa ng VRF at ilagay ang interface dito.',
      ],
      tricks: [
        'Ang tanong na “mas mabilis mag-start at mas magaan” = container.',
        'Ang tanong na “buong guest operating system” = VM.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Pag-verify ng IP sa client',
      paragraphs: [
        '**Windows**: `ipconfig` (buod) at `ipconfig /all` (kasama ang MAC, DHCP server, DNS, lease). `ipconfig /release` at `/renew` para sa DHCP; `ipconfig /flushdns` para sa DNS cache.',
        '**Linux**: `ip addr show` (address at mask sa CIDR, hal. 192.168.1.20/24), `ip route` (default gateway: “default via 192.168.1.1”), at `/etc/resolv.conf` o `resolvectl status` para sa DNS. Ang `ifconfig` ay luma pero lumalabas pa rin sa exam. **macOS**: `ifconfig`, `networksetup -getinfo Wi-Fi`.',
        'Mga tamang tanong: Tama ba ang IP sa subnet? Tama ba ang gateway (nasa parehong subnet)? May DNS ba? Kung 169.254.x.x → APIPA (walang DHCP). Subukan: `ping` gateway, `ping` 8.8.8.8, `nslookup` pangalan.',
      ],
      steps: [
        'Tingnan ang IP, mask, gateway at DNS (ipconfig /all o ip addr, ip route).',
        'I-ping ang loopback, ang sariling IP, ang gateway, ang remote IP, at ang pangalan.',
        'Kung mali ang address, i-renew ang DHCP o ayusin ang static.',
        'Kung gumagana ang IP pero hindi ang pangalan → DNS.',
      ],
      tricks: [
        'Ang pag-ping ng IP na gumagana pero ng pangalan ay hindi = DNS problem.',
        'Ang gateway na wala sa subnet ng host = mali ang configuration.',
      ],
    },
    {
      type: 'remember',
      title: 'Virtualization at client IP na lumalabas sa exam',
      items: [
        '**VM = guest OS sa hypervisor; container = shared kernel, magaan.**',
        '**Type 1 = bare metal; Type 2 = hosted sa OS.**',
        '**VRF = hiwalay na routing table sa isang router.**',
        '**Windows: ipconfig /all; Linux: ip addr / ifconfig; macOS: ifconfig.**',
        '**169.254.x.x = APIPA = walang DHCP na sumagot.**',
      ],
    },
    { type: 'diagram', id: 'virt-stack', caption: 'Virtual machines vs containers.' },
    {
      type: 'terms',
      items: [
        { term: 'Hypervisor', definition: 'Software that creates and runs virtual machines.' },
        { term: 'Type 1 hypervisor', definition: 'Runs directly on hardware (bare metal).' },
        { term: 'Type 2 hypervisor', definition: 'Runs as an application on a host operating system.' },
        { term: 'Container', definition: 'A packaged application that shares the host kernel with other containers.' },
        { term: 'VRF', definition: 'Virtual Routing and Forwarding: several independent routing tables on one router.' },
        { term: 'ipconfig /all', definition: 'Windows command that shows full IP configuration including MAC and DNS.' },
        { term: 'APIPA', definition: 'Automatic private address 169.254.0.0/16 used when no DHCP server answers.' },
      ],
    },
    {
      type: 'flow',
      title: 'Pag-troubleshoot ng client IP',
      steps: [
        'Tingnan ang IP, mask, gateway at DNS gamit ang tamang command.',
        'I-ping ang gateway; kung bigo, tingnan ang subnet, cable at VLAN.',
        'I-ping ang remote IP; kung bigo, may problema sa routing o gateway.',
        'I-test ang pangalan gamit ang nslookup; kung bigo, DNS.',
        'Ayusin at i-verify.',
      ],
    },
    {
      type: 'cli',
      title: 'Pagbasa ng output ng client',
      transcript: `C:\\> ipconfig /all
   IPv4 Address. . . . . . . . . . . : 192.168.1.20
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 192.168.1.1
$ ip addr show eth0
    inet 192.168.1.20/24 brd 192.168.1.255 scope global eth0
$ ip route
default via 192.168.1.1 dev eth0`,
      copyable: 'ipconfig /all\nip addr show\nip route',
      explain: [
        { line: 'Default Gateway . . . : 192.168.1.1', why: 'The router the PC uses for any destination outside 192.168.1.0/24; it must be in the same subnet.' },
        { line: 'inet 192.168.1.20/24', why: 'Linux shows the address and mask in CIDR form; /24 is 255.255.255.0.' },
        { line: 'default via 192.168.1.1', why: 'The Linux equivalent of the default gateway shown in the routing table.' },
      ],
      note: 'macOS uses ifconfig for addresses and netstat -rn or route -n get default for the gateway.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **VRF** ay **hindi** virtual machine at hindi container. Ito ay virtualization ng **routing table**.' },
    { type: 'callout', kind: 'trap', text: 'Ang **container ay hindi may sariling OS**; nagbabahagi ito ng kernel ng host. Ang VM ang may buong guest OS.' },
    { type: 'callout', kind: 'tip', text: 'Isulat ang tatlong command sa bawat OS: Windows ipconfig /all; Linux ip addr / ip route; macOS ifconfig. Madali itong tanong sa exam.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Confusing containers with virtual machines.',
        'Calling a VRF a virtual machine.',
        'Using ipconfig on Linux or ifconfig on Windows.',
        'Ignoring that the gateway must be in the host’s subnet.',
        'Forgetting that 169.254.x.x means no DHCP answer.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: May IP pero walang internet',
      scenario: 'A Windows PC shows an address but cannot reach websites. It can ping other local PCs.',
      evidence: `C:\\> ipconfig
   IPv4 Address. . . . . . . : 192.168.1.20
   Subnet Mask . . . . . . . : 255.255.255.0
   Default Gateway . . . . . : 192.168.2.1`,
      question: 'Ano ang mali?',
      answer: 'The default gateway 192.168.2.1 is in a different subnet than the host 192.168.1.20/24, so the PC cannot reach it and cannot leave its own network.',
      fix: 'Correct the gateway to an address in 192.168.1.0/24 (for example 192.168.1.1) or fix the DHCP scope, then renew with ipconfig /renew and ping the gateway.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang PC ay may 169.254.33.7. Ano ang ibig sabihin, at ano ang dalawang unang tsek?',
      answer: 'It is an APIPA address: the PC did not get a DHCP reply. Check the cable/port and VLAN, then that the DHCP server (or relay) is reachable; then run ipconfig /renew.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'VM has its own OS; container shares the kernel.',
        'Type 1 is bare metal; Type 2 is hosted.',
        'VRF = multiple routing tables.',
        'Know ipconfig /all, ip addr and ifconfig.',
        '169.254.x.x means no DHCP.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Virtualisation: VMs with hypervisors, containers with shared kernels.',
        'VRF virtualises the routing table.',
        'Check clients with ipconfig, ip addr and ifconfig.',
        'Gateway must be in the host’s subnet.',
        'APIPA means no DHCP reply.',
        'Susunod: higit pang deep dives at practice exams.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.12', difficulty: 'easy', type: 'single',
    prompt: 'What is the main difference between a virtual machine and a container?',
    choices: ['A container includes its own guest operating system', 'A VM includes a guest operating system; containers share the host kernel', 'A VM cannot use a network', 'Containers need a hypervisor on bare metal only'], correct: [1],
    explanation: 'VMs run a full guest OS on a hypervisor, while containers share the host operating system kernel.',
    wrong: { 0: 'That describes a VM.', 2: 'VMs use virtual NICs and switches.', 3: 'Containers run on a container engine and do not require a hypervisor.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.12', difficulty: 'medium', type: 'single',
    prompt: 'Which hypervisor type runs directly on the server hardware?',
    choices: ['Type 1', 'Type 2', 'Container engine', 'VRF'], correct: [0],
    explanation: 'Type 1 (bare-metal) hypervisors run directly on hardware.',
    wrong: { 1: 'Type 2 runs on a host operating system.', 2: 'A container engine runs on a host OS.', 3: 'A VRF is a routing feature, not a hypervisor.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.12', difficulty: 'medium', type: 'single',
    prompt: 'What does a VRF provide?',
    choices: ['Multiple virtual machines', 'Multiple independent routing tables on one router', 'A faster CPU', 'Encrypted tunnels'], correct: [1],
    explanation: 'VRF virtualises routing so one router can hold several separate routing tables.',
    wrong: { 0: 'That is a hypervisor.', 2: 'VRF does not change performance.', 3: 'Tunnels are a separate feature.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.10', difficulty: 'easy', type: 'single',
    prompt: 'Which Windows command displays the IP address, mask, gateway, DNS and MAC address?',
    choices: ['ipconfig /all', 'ifconfig -a', 'show ip interface brief', 'ip route'], correct: [0],
    explanation: 'ipconfig /all prints the full IP configuration on Windows.',
    wrong: { 1: 'ifconfig is for Linux and macOS.', 2: 'That is a Cisco IOS command.', 3: 'ip route is for Linux and shows routes only.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.10', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: an address such as 169.254.10.5 on a client usually means that no DHCP server replied.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'The client assigned itself an APIPA address in 169.254.0.0/16.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.10', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO commands show IP address information on a Linux client?',
    choices: ['ip addr show', 'ifconfig', 'ipconfig /all', 'show version'], correct: [0, 1],
    explanation: 'ip addr and ifconfig are Linux commands. ipconfig is Windows and show version is Cisco IOS.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: VM vs container?', back: 'VM = may sariling OS (mabigat). CONTAINER = shared kernel (magaan). TYPE 1 = bare metal. TYPE 2 = hosted. VRF = maraming routing table.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Type 1 vs Type 2 hypervisor?', back: 'Type 1 runs on hardware (bare metal); Type 2 runs on a host operating system.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What is a VRF?', back: 'Independent routing tables on one router.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'command', front: 'Windows command for full IP settings?', back: 'ipconfig /all.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'command', front: 'Linux commands for IP and gateway?', back: 'ip addr show and ip route (or ifconfig).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What does 169.254.x.x mean?', back: 'APIPA: the client got no DHCP reply.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'concept', front: 'What must be true about the default gateway?', back: 'It must be in the same subnet as the host.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Inspect your own computer’s network settings',
  tool: 'Your computer',
  minutes: 20,
  objective: 'Read the IP configuration of your computer, test the path to the gateway and the internet, and relate virtualisation terms to software you may already use.',
  steps: [
    'Open a terminal or command prompt. Run ipconfig /all (Windows) or ip addr and ip route (Linux), or ifconfig (macOS).',
    'Write down your IP address, mask, default gateway and DNS server. Convert the mask to a prefix length.',
    'Ping your gateway, then 8.8.8.8, then a domain name. Note which succeed.',
    'Confirm that the gateway is in your subnet by calculating the network and broadcast addresses.',
    'Write which virtualisation software you or a classmate could use (VirtualBox, VMware, Hyper-V, Docker) and classify each as Type 1, Type 2 or container engine.',
    'Explain in two sentences why a VRF is not a VM.',
  ],
  checklist: [
    'IP, mask, gateway and DNS recorded',
    'Pings tested in order',
    'Gateway subnet check completed',
    'Virtualisation software classified',
  ],
  hints: [
    'If the IP ping works but the name fails, DNS is the problem.',
    'Docker is a container engine, not a hypervisor.',
  ],
  solution: [
    'Example: 192.168.1.20/24, gateway 192.168.1.1, DNS 192.168.1.1; network 192.168.1.0, broadcast 192.168.1.255.',
    'VirtualBox: Type 2; ESXi or KVM: Type 1; Docker: container engine.',
    'A VRF only separates routing tables on one router; it does not run an operating system.',
  ],
  breakIt: 'Set a static gateway outside your subnet and describe how the ping results change; then restore the correct value.',
};
