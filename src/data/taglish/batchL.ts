import type { TaglishExtra, TaglishOverlay } from './index';
import { wrongNotes as W } from './helpers';

const basic: Record<string, TaglishOverlay> = {
  'network-architectures': {
    terms: [
      'Ang layer kung saan kumokonekta ang mga endpoint sa network.',
      'Ang layer na nag-aaggregate ng access switches at nagpapatupad ng policy at inter-VLAN routing.',
      'Ang mabilis na backbone na nag-uugnay sa mga distribution block.',
      'Two-tier na disenyo na pinagsasama ang distribution at core layer.',
      'Disenyo ng data center kung saan bawat leaf ay konektado sa bawat spine at wala nang iba.',
      'Trapiko mula server papunta sa server sa loob ng data center.',
      'Small office/home office network, karaniwang binuo sa paligid ng isang integrated na device.',
    ],
    cli: [],
    verify: [],
    questions: [
      'Ang access layer ang kinokonektahan ng mga endpoint sa network.',
      'Pinagsasama ng collapsed core ang distribution at core layer.',
      'Bawat leaf ay may link sa bawat spine; walang leaf-leaf o spine-spine na link.',
      'Bawat path ay dumadaan sa isang spine, kaya predictable ang latency at may equal-cost multipath.',
      'Karaniwang gumagamit ang SOHO ng isang multifunction na device na galing o nakakonekta sa ISP.',
      'Ang IaaS at SaaS (at PaaS) ay cloud service models. Hindi ang WLAN at VRF.',
    ],
  },
  'network-components-deep-dive': {
    terms: [
      'Switch na nagro-route din sa pagitan ng VLAN sa hardware gamit ang SVI.',
      'Next-generation firewall na may application control, integrated IPS at malware protection.',
      'Intrusion prevention system na nasa inline at kayang humarang ng mapaminsalang trapiko.',
      'Wireless LAN controller na namamahala sa lightweight access points.',
      'Cisco controller (dating DNA Center) para sa campus automation at assurance.',
      'Power sourcing equipment: ang device na nagbibigay ng PoE.',
      'Powered device: ang device na tumatanggap ng PoE.',
    ],
    cli: [
      'Ipinapakita ang PoE budget at ang kuryenteng ibinibigay sa bawat port.',
      'Ginagawang router para sa IP ang Layer 3 switch para makapag-route sa pagitan ng mga SVI nito.',
      'Gumagawa ng SVI na nagsisilbing default gateway ng VLAN 10.',
    ],
    verify: [],
    questions: [
      'Ang Layer 3 switch ay nag-i-switch at nagro-route sa pagitan ng VLAN gamit ang SVI.',
      'Ang IPS ay inline at kayang magbagsak ng mapaminsalang trapiko; ang IDS ay nagmo-monitor at nag-aalerto lang.',
      'Ang 802.3at (PoE+) ay sumusuporta hanggang 30 W.',
      'Nagdaragdag ang NGFW ng application visibility, user identity, IPS at malware protection sa stateful filtering.',
      'Ang power sourcing equipment (PoE switch o injector) ang nagbibigay ng kuryente sa powered device.',
      'Ang WLC ang namamahala sa mga AP at ang Catalyst Center ang namamahala sa campus. Hindi controller ang switch at hub.',
    ],
  },
  'device-management-access': {
    terms: [
      'Pamamahala sa device sa pamamagitan ng nakalaang daan tulad ng console, hiwalay sa data network.',
      'Pamamahala sa device sa production network gamit ang Telnet, SSH o web interface.',
      'Plain-text na remote CLI sa TCP 23.',
      'Naka-encrypt na remote CLI sa TCP 22.',
      'Cisco AAA protocol sa TCP 49 na nag-e-encrypt ng buong payload at naghihiwalay ng AAA functions.',
      'Open-standard na AAA protocol sa UDP 1812/1813 na password lang ang ine-encrypt.',
      'Mga device na kino-configure at minomonitor mula sa cloud dashboard.',
    ],
    cli: [
      'Pinapahintulutan lang ang SSH sa VTY lines; tinatanggihan ang Telnet connections.',
      'Pinapatay ang plain-text na HTTP GUI.',
      'Ina-enable ang naka-encrypt na HTTPS GUI.',
      'Kinukumpirma na naka-enable ang SSH at ipinapakita ang version.',
    ],
    verify: [],
    questions: [
      'Hindi umaasa sa network ang console port, kaya out-of-band ito.',
      'Ang transport input ssh ay nagpapahintulot ng SSH at humaharang sa Telnet.',
      'Ang TACACS+ ay gumagamit ng TCP 49 at ine-encrypt ang buong body.',
      'Ang cloud-managed na device ay kumokonekta sa cloud service at kino-configure sa web dashboard.',
      'Pinapadala ng Telnet ang lahat, kasama ang password, bilang plain text.',
      'Ine-encrypt ng SSH at HTTPS ang session; hindi ng Telnet at HTTP.',
    ],
  },
};

const extra: Record<string, TaglishExtra> = {
  'network-architectures': {
    cards: [
      'Access: endpoint. Distribution: aggregation, policy, inter-VLAN. Core: mabilis na backbone.',
      'Two-tier na pinagsasama ang distribution at core.',
      'Bawat leaf ay konektado sa bawat spine; walang leaf-leaf o spine-spine na link.',
      'Trapiko mula server papunta sa server sa loob ng data center.',
      'Imprastraktura, platform at tapos na application bilang serbisyo.',
      'Leased line, MPLS/Metro Ethernet, broadband internet na may VPN, cellular backup, SD-WAN.',
    ],
    lab: {
      objective: 'Gumuhit ng three-tier, two-tier at spine-leaf na disenyo, bilangin ang mga link at pumili ng disenyo para sa mga scenario.',
      steps: [
        'Gumuhit ng three-tier campus na may 2 core, 2 distribution at 4 access switch; ikonekta ang bawat access switch sa parehong distribution switch.',
        'Iguhit muli ito bilang two-tier na collapsed core gamit ang parehong access switch.',
        'Gumuhit ng spine-leaf na may 2 spine at 4 leaf at bilangin ang mga link.',
        'Para sa bawat isa sa limang scenario (home office, 20-taong opisina, unibersidad na maraming gusali, data center, branch na may 5 user) pumili ng disenyo.',
        'Isulat kung anong WAN option ang pipiliin mo para sa bawat branch at bakit.',
        'Uriin ang limang serbisyo bilang on-premises, IaaS, PaaS o SaaS.',
      ],
      checklist: [
        'Tama ang pagkaguhit ng tatlong disenyo',
        'Tama ang bilang ng link sa spine-leaf',
        'Naitugma ang mga scenario sa disenyo',
        'Nauri ang cloud models',
      ],
      hints: [
        'Mga link sa spine-leaf = leaves × spines.',
        'Ang isang integrated na device ay nagpapahiwatig ng SOHO na disenyo.',
      ],
      solution: [
        'Ang spine-leaf na may 2 spine at 4 leaf ay may 8 link.',
        'Home office: SOHO; 20-taong opisina: two-tier; unibersidad: three-tier; data center: spine-leaf.',
        'Email = SaaS; virtual servers = IaaS; app hosting platform = PaaS.',
      ],
      breakIt: 'Magdagdag ng leaf-to-leaf na link sa guhit mo ng spine-leaf at ipaliwanag kung ano ang epekto nito sa pantay na bilang ng hops.',
    },
    wrong: W(6, {
      0: { 0: 'Ang core ay ang backbone.', 1: 'Ang distribution layer ang nag-aaggregate ng access switches.', 3: 'Ang spine ay sa spine-leaf.' },
      1: { 0: 'Hiwalay pa rin ang access.', 2: 'Ang access layer ang kinokonektahan ng endpoint.', 3: 'Ginagamit pa rin ang mga switch.' },
      2: { 0: 'Walang leaf-to-leaf na link.', 2: 'Walang spine-to-spine na link.', 3: 'Sa leaf switches kumokonekta ang servers.' },
      3: { 0: 'Maraming equal path ito.', 2: 'Gumagamit ito ng Layer 2/3 switches.', 3: 'Kailangan pa rin ang servers.' },
    }),
  },
  'network-components-deep-dive': {
    cards: [
      'Ang Layer 2 ay nag-i-switch ng frames ayon sa MAC; ang Layer 3 ay nagro-route din sa pagitan ng VLAN.',
      'Ang IPS ay inline at humaharang; ang IDS ay nagmo-monitor at nag-aalerto.',
      'Application control, user identity, integrated IPS, URL filtering at malware protection.',
      '802.3af 15.4 W; 802.3at 30 W; 802.3bt 60 W at 90 W.',
      'Ang PSE ang nagbibigay ng kuryente; ang PD ang tumatanggap.',
      'Ang WLC ang namamahala sa mga AP; ang Catalyst Center (DNA Center) ang namamahala sa campus na may automation at assurance.',
    ],
    lab: {
      objective: 'Pumili at maglagay ng network components sa maliit na campus at kuwentahin ang PoE budget.',
      steps: [
        'Gumuhit ng maliit na campus na may 30 user, 10 IP phone, 6 AP, 4 camera, server farm at internet link.',
        'Maglagay ng access switch, Layer 3 switch, edge router at NGFW/IPS at ipaliwanag ang bawat paglalagay.',
        'Magpasya kung saan ilalagay ang WLC at Catalyst Center.',
        'Ilista ang bawat PoE device kasama ang standard at wattage (phones 7 W, APs 25 W, cameras 15 W).',
        'Kuwentahin ang kabuuang PoE load at pumili ng switch budget na may 20% na sobra.',
        'Ipaliwanag sa dalawang pangungusap kung bakit kailangang inline ang IPS at hindi ang IDS.',
      ],
      checklist: [
        'Nailagay ang mga device na may dahilan',
        'Nailagay ang mga controller',
        'Nakuwenta ang kabuuang PoE',
        'Naipaliwanag ang IPS vs IDS',
      ],
      hints: [
        'Kabuuang PoE = kabuuan ng lahat ng powered device.',
        'Ang Layer 3 switch ay nagro-route sa pagitan ng VLAN; ang edge router ay kumokonekta sa ISP.',
      ],
      solution: [
        'Load: 10×7 + 6×25 + 4×15 = 70 + 150 + 60 = 280 W; may 20% na sobra ay mga 336 W.',
        'Ang NGFW/IPS ay nasa edge sa pagitan ng router at ng panloob na network.',
        'Kailangang nasa daan ng trapiko ang IPS para makaharang; ang IDS ay nangangailangan lang ng kopya.',
      ],
      breakIt: 'Magdagdag ng 10 pang AP sa disenyo mo at kuwentahin muli kung sapat pa ang switch budget.',
    },
    wrong: W(6, {
      0: { 0: 'Hindi nagro-route ang Layer 2 switch.', 2: 'Ang hub ay Layer 1 repeater.', 3: 'Ang AP ay nagbi-bridge ng wireless sa wired.' },
      1: { 1: 'Baligtad iyon.', 2: 'Magkaiba sila sa lugar at aksyon.', 3: 'Hindi limitado sa wireless ang IPS.' },
      2: { 0: 'Ang 802.3af ay nagbibigay ng hanggang 15.4 W.', 2: 'Ang Type 4 ay nagbibigay ng hanggang 90 W.', 3: 'Ang 802.1Q ay VLAN tagging.' },
      3: { 0: 'Iyon ay Layer 2 filtering.', 2: 'Walang inspeksyon ang repeater.', 3: 'Hindi nito pinapalitan ang switching.' },
    }),
  },
  'device-management-access': {
    cards: [
      'Ang in-band ay gumagamit ng production network; ang out-of-band ay gumagamit ng hiwalay na daan tulad ng console.',
      'transport input ssh.',
      'no ip http server at ip http secure-server.',
      'TACACS+: TCP 49, buong payload encrypted, hiwalay na AAA. RADIUS: UDP 1812/1813, password lang.',
      'Device na pinamamahalaan mula sa cloud dashboard (halimbawa Meraki).',
      'Bilang fallback kapag hindi maabot ang AAA server.',
    ],
    lab: {
      objective: 'I-enable ang SSH, isara ang Telnet, i-secure ang web GUI at magdagdag ng local AAA login, saka patunayan ang bawat pagbabago.',
      steps: [
        'Gumawa ng router at PC. Bigyan ng IP address sa parehong subnet at kumpirmahing gumagana ang Telnet na may VTY password.',
        'I-configure ang hostname, domain name, local user at RSA keys; i-enable ang ip ssh version 2.',
        'Itakda ang VTY lines sa login local at transport input ssh; subukan na tinatanggihan ang Telnet at gumagana ang SSH.',
        'I-disable ang HTTP server at i-enable ang HTTPS server (kung available) at pansinin ang pagkakaiba.',
        'Idagdag ang aaa new-model na may local login list at subukan na gumagana pa rin ang mga login.',
        'Magdagdag ng ACL na may access-class na nagpapahintulot lang sa PC na maabot ang VTY lines.',
      ],
      checklist: [
        'Tinanggihan ang Telnet',
        'Gumagana ang SSH',
        'Napalitan ng HTTPS ang HTTP',
        'Gumagana ang local AAA login',
        'Nasubukan ang access-class na paghihigpit',
      ],
      hints: [
        'Kinukumpirma ng show ip ssh ang SSH version.',
        'Gumawa ng local user bago ang aaa new-model.',
      ],
      solution: [
        'ip domain-name, crypto key generate rsa, username admin secret …, ip ssh version 2.',
        'line vty 0 4 → login local → transport input ssh.',
        'no ip http server; ip http secure-server; aaa authentication login default local.',
      ],
      breakIt: 'I-enable ang aaa new-model bago gumawa ng local user at ilarawan kung ano ang mangyayari sa susunod mong login.',
    },
    wrong: W(6, {
      0: { 0: 'In-band ang SSH.', 1: 'In-band ang Telnet.', 3: 'In-band ang HTTPS.' },
      1: { 0: 'Telnet lang ang pinapayagan niyan.', 2: 'Pumipili ang login local ng local authentication.', 3: 'Hinihigpitan ng access-class ang source addresses.' },
      2: { 0: 'Ang RADIUS ay UDP 1812/1813 at password lang ang ine-encrypt.', 2: 'Ang SNMP ay UDP 161/162.', 3: 'Ang Telnet ay plain text sa TCP 23.' },
      3: { 0: 'Hindi kailangan ang console.', 2: 'Karaniwang nagpapatuloy ang forwarding sa outage.', 3: 'Ginagamit ang HTTPS para sa management connection.' },
    }),
  },
};

export const BATCH_L = { basic, extra };
