import type { TaglishExtra, TaglishOverlay } from './index';
import { wrongNotes as W } from './helpers';

const basic: Record<string, TaglishOverlay> = {
  'tftp-ftp': {
    terms: [
      'Trivial File Transfer Protocol: simpleng file transfer na walang authentication sa UDP port 69.',
      'File Transfer Protocol: file transfer na may login sa TCP; control sa 21, data sa 20 (active mode).',
      'Ang FTP channel sa port 21 na nagdadala ng mga utos at sagot.',
      'Ang hiwalay na FTP channel na nagdadala ng file o ng listahan ng folder.',
      'FTP mode kung saan ang client ang nagbubukas ng data connection; mas angkop sa firewall at NAT.',
      'Mga ligtas na alternatibo: file transfer sa SSH, o FTP na may TLS.',
      'Ang operating system file ng Cisco device, nakatago sa flash.',
    ],
    cli: [
      'Palaging patunayan na naaabot ang server bago ka mag-copy ng kahit ano.',
      'Sinisimulan ang backup ng aktibong configuration papunta sa TFTP server; tatanungin ng IOS ang server at filename.',
      'Ang pangalan ng file sa server; pindutin ang Enter para tanggapin ang default.',
      'Inililista ang IOS image at libreng espasyo, para alam mo kung ano ang puwedeng i-backup o palitan.',
      'Kailangan ng FTP ng credentials; sinasabi nito sa IOS kung ano ang ipapadala. Naka-save ang mga ito sa config, kaya protektahan ito.',
    ],
    verify: [],
    questions: [
      'Gumagamit ang TFTP ng UDP port 69 at walang authentication.',
      'Ang mga utos ng FTP ay dumadaan sa TCP port 21; ang data ay gumagamit ng port 20 sa active mode.',
      'Ang copy running-config tftp: ang nagpapadala ng aktibong configuration sa server.',
      'Ina-authenticate ng FTP ang users; ang TFTP ay walang authentication o directory listing.',
      'Ang karaniwang FTP ay hindi naka-encrypt; ang SFTP o FTPS ang ligtas na opsyon.',
      'Kung walang IP reachability, walang transfer na magtatagumpay, kaya ayusin muna ang koneksyon.',
      'Parehong tumatakbo sa SSH ang SFTP at SCP at naka-encrypt.',
      'Totoo — simple at malawak itong sinusuportahan sa pagkopya ng configs at images sa labs at recovery.',
    ],
  },
  'security-concepts': {
    terms: [
      'Anumang mahalagang bagay na dapat protektahan: data, device, serbisyo, reputasyon.',
      'Kahinaang puwedeng gamitin para makapinsala, tulad ng hindi na-patch na software o mahinang password.',
      'Posibleng sanhi ng pinsala: attacker, malware, insider o natural na pangyayari.',
      'Ang code o teknik na sumasamantala sa isang vulnerability.',
      'Aksyon o control na nagpapababa ng panganib, tinatawag ding countermeasure.',
      'Confidentiality, integrity at availability: ang tatlong pangunahing layunin ng seguridad.',
      'Pag-layer ng ilang controls para hindi malantad ang asset kapag may isang pumalya.',
      'Vulnerability na ginagamit bago pa maglabas ng ayos ang vendor.',
    ],
    cli: [],
    verify: [],
    questions: [
      'Ang vulnerability ay kahinaan sa isang sistema, tulad ng hindi na-patch na software o mahinang password.',
      'Ang exploit ang paraan na sumasamantala sa isang vulnerability.',
      'Pinananatiling pribado ng encryption ang data mula sa mga hindi awtorisadong magbasa.',
      'Ang pagtukoy sa hindi awtorisadong pagbabago ay integrity.',
      'Ang mga policy at training ay administrative controls; ang kandado ay physical at ang firewall/IPS ay technical.',
      'Ang defence in depth ay nagla-layer ng controls para walang iisang pagkabigo ang maglalantad sa asset.',
      'Ang triad ay confidentiality, integrity at availability.',
      'Totoo — zero araw ang nagkaroon ang vendor para gumawa ng patch.',
    ],
  },
  'common-threats': {
    terms: [
      'Ang virus ay nangangailangan ng host file at aksyon ng user; ang worm ay kumakalat mag-isa sa network.',
      'Mapaminsalang software na nagpapanggap na kapaki-pakinabang.',
      'Malware na ine-encrypt ang data at humihingi ng bayad para sa key.',
      'Mapanlinlang na mensahe na nanloloko sa biktima para ibigay ang credentials o magpatakbo ng malware.',
      'Pagpeke ng address o pagkakakilanlan (IP, MAC, ARP, DHCP) para magpanggap na ibang device.',
      'Attacker na palihim na humaharang at maaaring bumago ng komunikasyon sa pagitan ng dalawang panig.',
      'Mga atakeng ginagawang hindi available ang serbisyo sa sobrang karga; ang DDoS ay maraming pinagmulan.',
      'Pagkalap ng impormasyon tungkol sa target bago umatake: scans, sweeps, lookups.',
    ],
    cli: [],
    verify: [],
    questions: [
      'Ang worm ay nag-uulit at kumakalat sa pamamagitan ng network vulnerabilities.',
      'Ni-lo-lock ng ransomware ang data at humihingi ng ransom para sa decryption key.',
      'Ang mapanlinlang na mensahe na nanloloko sa user para ibigay ang credentials ay phishing.',
      'Ang distributed DoS ay gumagamit ng maraming sirang pinagmulan, madalas botnet.',
      'Ang man-in-the-middle ay humaharang at puwedeng bumago ng komunikasyon sa pagitan ng dalawang panig.',
      'Ang tailgating ay physical na social-engineering na teknik.',
      'Ang phishing ay tumututok sa tao, kaya ang training at multi-factor authentication ang pinakamalakas na depensa.',
      'Parehong nagpe-peke ng pagkakakilanlan ang ARP at MAC spoofing; ang SYN flood ay DoS at ang ransomware ay malware.',
      'Mali — nagpapanggap lang ang trojan bilang lehitimong software at hindi ito nag-uulit.',
    ],
  },
};

const extra: Record<string, TaglishExtra> = {
  'tftp-ftp': {
    cards: [
      'TFTP: UDP 69. FTP: TCP 21 (control) at TCP 20 (data, active mode).',
      'TFTP: walang authentication, walang listing, UDP. FTP: username at password, directory listing, TCP.',
      'copy running-config tftp: at copy tftp: running-config',
      'SFTP at SCP (sa SSH, TCP 22) o FTPS (FTP sa TLS).',
      'dir flash: (at verify /md5 flash:<image> para tiyakin ang integridad).',
    ],
    lab: {
      objective: 'Kopyahin ang running configuration sa TFTP server, baguhin ang router, saka ibalik ang naka-save na file.',
      steps: [
        'I-address ang R1 (10.0.0.1/24) at ang server (10.0.0.50/24); i-enable ang TFTP service sa server.',
        'I-ping ang server mula sa R1 para kumpirmahin ang reachability.',
        'Patakbuhin ang copy running-config tftp: at ilagay ang 10.0.0.50 at ang filename na R1-backup.cfg.',
        'Tingnan ang listahan ng file ng TFTP server at kumpirmahing nandoon ang R1-backup.cfg.',
        'Palitan ang hostname ng R1 sa TEMP, saka patakbuhin ang copy tftp: running-config at i-load ang R1-backup.cfg.',
        'Patakbuhin ang show running-config | include hostname at itala ang resulta.',
      ],
      checklist: [
        'Nakikita ang backup file sa server',
        'Natapos ang restore mula sa TFTP',
        'Naipaliwanag kung bakit bumalik ang hostname sa R1',
      ],
      hints: [
        'Kung pumalya ang copy, patakbuhin muna ang ping.',
        'Ang restore ay nagme-merge ng mga linya sa running config; hindi nito binubura ang sobrang linya.',
      ],
      solution: [
        'Lumilitaw ang file na R1-backup.cfg sa folder ng server pagkatapos ng copy.',
        'Pinapalitan ng restore ang hostname line ng naka-save na R1 na value.',
      ],
      breakIt: 'I-off ang TFTP service sa server at ulitin ang copy para makita ang timeout, saka i-on ulit.',
    },
    wrong: W(8, {}),
  },
  'security-concepts': {
    cards: [
      'Threat: posibleng sanhi ng pinsala. Vulnerability: ang kahinaan. Exploit: ang paraang gumagamit sa kahinaan.',
      'Aksyon o control na nagpapababa ng posibilidad o epekto ng atake (countermeasure).',
      'Confidentiality (pribado), integrity (hindi binago), availability (naaabot kapag kailangan).',
      'Technical (firewall, ACL), administrative (policy, training), physical (kandado, camera).',
      'Vulnerability na ginagamit bago pa magkaroon ng patch ang vendor.',
    ],
    lab: {
      objective: 'Tukuyin ang mga asset, vulnerability, threat at mitigation para sa maliit na network at uriin ang bawat control.',
      steps: [
        'Ilista ang limang asset sa bahay o opisina mong network (halimbawa laptop, router, NAS, litrato, accounts).',
        'Sa bawat asset, magsulat ng isang makatotohanang vulnerability (halimbawa default na password ng router, walang update).',
        'Isulat ang threat at ang exploit na maaaring gumamit sa vulnerability na iyon.',
        'Magsulat ng mitigation para sa bawat isa at markahang technical, administrative o physical.',
        'Markahan kung aling CIA goal ang pinakakailangan ng bawat asset.',
        'Bilugan ang dalawang asset na isang layer lang ang proteksyon at magdagdag ng pangalawang layer.',
      ],
      checklist: [
        'Nakalista ang limang asset na may vulnerability',
        'Bawat hilera ay may threat, exploit at mitigation',
        'Naiuri ang bawat control',
        'Nagdagdag ng pangalawang layer sa dalawang asset',
      ],
      hints: [
        'Magsimula sa router: pinoprotektahan nito ang lahat ng iba.',
        'Ang password manager at iskedyul ng update ay mura at malakas na mitigation.',
      ],
      solution: [
        'Halimbawa: asset router, vulnerability default na password, threat remote attacker, exploit pag-login gamit ang defaults, mitigation malakas na password (technical).',
        'Halimbawa: asset litrato, kailangan ng availability, mitigation backup sa pangalawang lokasyon.',
      ],
    },
    wrong: W(8, {}),
  },
  'common-threats': {
    cards: [
      'Ang virus ay kumakapit sa file at kailangan ng aksyon ng user; ang worm ay kumakalat mag-isa; ang trojan ay nagpapanggap at hindi nag-uulit.',
      'Ang phishing ay malawak na mapanlinlang na mensahe; ang spear phishing ay tumututok sa isang tao o grupo.',
      'Ang spoofing ay nagpapanggap na pagkakakilanlan; ang MITM ay humaharang o bumabago ng traffic sa pagitan ng dalawang panig.',
      'Parehong umuubos sa target para hindi ito available; ang DDoS ay gumagamit ng maraming pinagmulan (botnet).',
      'Offline/immutable na backup, patching, endpoint protection, email filtering at segmentation.',
    ],
    lab: {
      objective: 'Basahin ang maiikling senaryo, pangalanan ang atake at piliin ang pinakamahusay na mitigation.',
      steps: [
        'Isulat ang mga numerong 1 hanggang 8 sa isang pahina.',
        'Sa bawat senaryo sa ibaba, isulat ang uri ng atake: (1) mensaheng "Hawak ang parcel mo, i-click dito" sa maraming user; (2) programang kumokopya sa sarili sa bawat host sa pamamagitan ng hindi na-patch na serbisyo; (3) libreng laro na nag-i-install ng nakatagong remote tool; (4) libu-libong bot na bumabaha sa isang website; (5) rogue DHCP server na nagbibigay ng pekeng gateway; (6) taong sumusunod sa staff papasok sa server room; (7) software na nag-e-encrypt ng file share at nagpapakita ng paalala ng bayad; (8) pekeng access point na kapangalan ng Wi-Fi ng cafe.',
        'Sa bawat isa, magsulat ng isang mitigation.',
        'Suriin ang mga sagot mo gamit ang solution.',
      ],
      checklist: [
        'Napangalanan ang lahat ng walong senaryo',
        'May makatwirang mitigation ang bawat isa',
        'Kaya mong ipaliwanag ang pagkakaiba ng virus at worm',
      ],
      hints: [
        'Itanong: tinututukan ba nito ang tao, pagkakakilanlan, gitna ng usapan, o availability?',
        'Hanapin ang mga salitang tulad ng "kumokopya sa sarili" (worm) at "nagpapanggap" (trojan).',
      ],
      solution: [
        '1 phishing; 2 worm; 3 trojan; 4 DDoS; 5 DHCP spoofing (rogue server, man-in-the-middle); 6 tailgating; 7 ransomware; 8 evil twin MITM.',
        'Mga mitigation: training at MFA; patching at segmentation; application control; DDoS scrubbing; DHCP snooping; badge access at mantrap; offline backup; WPA3 at VPN.',
      ],
    },
    wrong: W(9, {}),
  },
};

export const BATCH_A = { basic, extra };
