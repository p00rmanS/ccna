import type { TaglishExtra, TaglishOverlay } from './index';
import { wrongNotes as W } from './helpers';

const basic: Record<string, TaglishOverlay> = {
  'longest-prefix-match': {
    terms: [
      'Pagpili, sa mga tumutugmang ruta, ng may pinakamahabang mask.',
      'Tiwala sa pinagmulan ng ruta; mas mababa ang mas gusto sa pagitan ng magkaparehong prefix.',
      'Gastos ng routing protocol papunta sa prefix; mas mababa ang mas mabuti sa loob ng iisang protocol.',
      'Ruta na /32 (IPv4) o /128 (IPv6) para sa isang address.',
      '0.0.0.0/0 (o ::/0): tumutugma sa lahat na may prefix length na 0.',
      'Equal-cost multipath: ilang ruta na magkapareho ang gastos na sabay na ginagamit.',
      'Ang next hop ng default route na ipinapakita sa itaas ng show ip route.',
    ],
    cli: [
      'Tinatanong ang router kung aling ruta ang gagamitin para sa destination na iyon: ipinapakita ang longest-prefix match.',
      'Static na /25 na ruta; ito ang pinaka-tiyak na tugma para sa 10.1.1.200.',
      'Ang default route; ginagamit lang kapag walang ibang ruta na tumutugma.',
    ],
    verify: [],
    questions: [
      'Parehong tumutugma pero ang /16 ang may mas mahabang prefix.',
      'Inihahambing muna ang prefix length bago ang administrative distance.',
      'Kapag magkapareho ang prefix, ang pinakamababang administrative distance ang panalo: static 1 ang tumatalo sa OSPF 110.',
      'Ang 10.1.1.0/25 ay sumasaklaw sa 10.1.1.0–127 na may .50. Ang /25 sa .128 ay nagsisimula sa 128, ang /26 sa .64 ay sumasaklaw sa 64–127 at ang /32 ay ibang host.',
      'Ibinabagsak ang packet at ibinabalik ang ICMP destination unreachable sa source.',
      'Ang pinakamababang administrative distance ang panalo sa pagitan ng pinagmulan; ang pinakamababang metric sa loob ng iisang protocol.',
    ],
  },
  'basic-switch-config': {
    terms: [
      'Switch virtual interface: VLAN interface na may management IP address ng switch.',
      'Naka-hash na privileged EXEC password na nananaig sa enable password.',
      'Global command na nagsasabi sa Layer 2 switch kung saan ipapadala ang management traffic na labas sa subnet.',
      'Mensaheng ipinapakita sa sinumang kumokonekta, karaniwang legal na babala.',
      'Ang configuration na naka-save sa NVRAM at nilo-load sa boot.',
      'Ang aktibong configuration na nasa RAM.',
      'Text label sa interface na nagdodokumento kung saan ito nakakonekta.',
    ],
    cli: [
      'Itinatakda ang privileged EXEC password bilang hash; nananaig ito sa anumang enable password.',
      'Pinipigilan ang log messages na maputol ang command na tina-type mo sa console.',
      'Ang management address ng switch sa VLAN 1 SVI; tandaan ang no shutdown.',
      'Pinapahintulutan ang switch na sumagot sa management traffic mula sa ibang subnet.',
      'Sine-save ang configuration mula RAM papunta sa NVRAM para manatili pagkatapos ng reload.',
    ],
    verify: [],
    questions: [
      'Ang enable secret ay nag-iimbak ng naka-hash na password at nananaig sa enable password.',
      'Sinasabi ng ip default-gateway sa switch kung saan ipapadala ang trapiko papunta sa ibang subnet.',
      'Ang running-config ay nasa RAM; ang startup-config ay nasa NVRAM.',
      'Gumagamit ang login local ng username database; ang login lang ay gumagamit ng line password.',
      'Ang startup-config sa NVRAM lang ang nananatili pagkatapos ng reload.',
      'Parehong nagse-save ng configuration ang copy running-config startup-config at write memory.',
    ],
  },
  'troubleshooting-method': {
    terms: [
      'Pag-troubleshoot mula Layer 1 pataas.',
      'Pag-troubleshoot mula application layer pababa.',
      'Pagsisimula sa gitnang layer, tulad ng ping, at paglipat pataas o pababa ayon sa resulta.',
      'Pag-ping ng loopback, sariling IP, gateway, remote IP at pangalan ayon sa pagkakasunod para mahanap ang sira.',
      'Tool na naglilista ng bawat router hop papunta sa destination.',
      'Talaan ng normal na gawi na ginagamit sa paghahambing.',
      'Pagkabigo ng frame check sequence na madalas nagpapahiwatig ng problema sa cabling o duplex.',
    ],
    cli: [
      'Isinara ng administrator ang port; ang ayos ay no shutdown.',
      'Ang malusog na interface ay walang errors at full duplex.',
      'Tipikal na sintomas ng duplex mismatch: errors at late collisions habang nananatiling up ang link.',
    ],
    verify: [],
    questions: [
      'Lumilitaw ang pagbigo sa pagitan ng PC at gateway, kaya suriin muna ang lokal na segment.',
      'Ang CRC errors at late collisions ay klasikong sintomas ng duplex mismatch.',
      'Ang administratively down ay nangangahulugang naka-configure ang shutdown command; gamitin ang no shutdown.',
      'Nagsisimula ang divide and conquer sa gitnang layer at gumagalaw ayon sa itinuturo ng resulta.',
      'Magbago ng isang bagay lang bawat beses para malaman mo kung ano ang nag-ayos o nagpalala.',
      'Itinutugma ng MAC address table ang MAC sa port at ang ARP table ang IP sa MAC.',
    ],
  },
  'troubleshooting-scenarios': {
    terms: [
      'Ang iniuulat ng user o monitoring na hindi gumagana.',
      'Output ng command o configuration na sumusuporta o tumatanggi sa hypothesis.',
      'Ang nag-iisang pinagbabatayang misconfiguration o pagkasira na nagdudulot ng sintomas.',
      'Ang mga VLAN na pinapayagan sa trunk.',
      'OSPF timers na dapat magtugma sa pagitan ng magkapitbahay.',
      'Command na nagre-relay ng DHCP broadcast sa remote server.',
      'Mga papel ng interface sa NAT; parehong dapat tama ang pagkakatalaga.',
    ],
    cli: [
      'Ipinapakita ang mode, native VLAN at ang allowed at active VLAN lists ng bawat trunk.',
      'Inililista ang mga kapitbahay at ang estado nila; ang walang laman o ang estadong hindi umaabot sa FULL ay senyales ng mismatch.',
      'Ipinapakita ang bawat linya ng ACL kasama ang hit counters na nagpapatunay kung aling rule ang tumutugma.',
    ],
    verify: [],
    questions: [
      'Magkaiba ang subnet ng host at ng gateway, kaya hindi maabot ng host ang gateway.',
      'Idagdag ang VLAN 20 sa allowed list nang hindi pinapalitan ang umiiral na listahan.',
      'Dapat magtugma ang hello at dead intervals ng OSPF neighbours.',
      'Ang relay ay naka-configure sa bawat client-facing interface; ang pumapalyang VLAN ay walang nito.',
      'Ang unang tumutugmang linya ang panalo; ang linya 10 ay dine-deny ang lahat ng web traffic bago maabot ang staff permit.',
      'Magkapalit ang inside at outside na papel, kaya hindi tumutugma ang trapiko sa translation rule.',
      'Maaaring magdulot ng parehong sintomas ang ilang sira; gamitin ang ebidensya para matukoy ang tunay na sanhi.',
      'Dapat magtugma ang timers at area ID; kailangang magkakaiba ang router ID at hindi mahalaga ang hostname.',
    ],
  },
};

const extra: Record<string, TaglishExtra> = {
  'longest-prefix-match': {
    cards: [
      'Pagpili ng tumutugmang ruta na may pinakamahabang mask.',
      'Sa pagitan lang ng mga ruta na magkaparehong prefix mula sa magkaibang pinagmulan.',
      'Sa pagitan ng mga ruta na magkaparehong prefix mula sa iisang routing protocol.',
      'Equal-cost load balancing sa mga ruta.',
      'Gamitin ang default route; kung wala, ibagsak at magpadala ng ICMP unreachable.',
      'show ip route <address>.',
    ],
    lab: {
      objective: 'Hulaan ang napiling ruta para sa ilang destination mula sa routing table at i-verify gamit ang show ip route.',
      steps: [
        'Gumawa ng router na may limang static route: 10.0.0.0/8, 10.1.0.0/16, 10.1.1.0/24, 10.1.1.128/25 at default, bawat isa ay may ibang next hop (gumamit ng loopback routers o anumang maaabot na address).',
        'Isulat ang range ng bawat ruta.',
        'Hulaan ang napiling ruta para sa 10.1.1.200, 10.1.1.50, 10.1.2.5, 10.9.9.9 at 172.16.1.1.',
        'I-verify ang bawat isa gamit ang show ip route <address>.',
        'Magdagdag ng pangalawang ruta sa 10.1.1.0/24 na may mas mataas na administrative distance (floating) at tingnan na nakatago ito.',
        'Alisin ang default route at mag-ping ng hindi kilalang address; basahin ang ICMP na resulta.',
      ],
      checklist: [
        'Naisulat ang limang hula bago suriin',
        'Na-verify ang mga hula',
        'Naobserbahang nakatago ang floating route',
        'Naobserbahan ang drop kapag walang default',
      ],
      hints: [
        'Isulat ang bawat ruta bilang range.',
        'Ipinapakita ng show ip route <address> ang napiling ruta.',
      ],
      solution: [
        '10.1.1.200 → /25; 10.1.1.50 → /24; 10.1.2.5 → /16; 10.9.9.9 → /8; 172.16.1.1 → default.',
        'Nakatago ang floating route habang umiiral ang AD 1 na ruta.',
        'Kapag walang default route, pumapalya ang ping na may destination unreachable.',
      ],
      breakIt: 'Magdagdag ng /32 host route para sa 10.1.1.50 at obserbahan na ino-override nito ang /24 para sa address na iyon.',
    },
    wrong: W(6, {
      0: { 0: 'Mas hindi tiyak ang /8.', 2: 'Prefix length ang nagpapasya sa tie.', 3: 'May mas tiyak na ruta.' },
      1: { 0: 'Ang AD ay ginagamit lang sa magkaparehong prefix.', 2: 'Hindi nilo-load balance ang magkaibang prefix.', 3: 'Parehong tumutugma.' },
      2: { 0: 'Mas mataas ang AD ng OSPF.', 2: 'Ang pinakamababang AD lang ang nai-install.', 3: 'Ang metric ay sa loob ng iisang protocol.' },
      3: { 0: 'Sumasaklaw ang 10.1.1.128/25 sa .128–.255.', 2: 'Sumasaklaw ang 10.1.1.64/26 sa .64–.127.', 3: 'Tumutugma lang ang /32 sa .200.' },
    }),
  },
  'basic-switch-config': {
    cards: [
      'interface vlan N, ip address, no shutdown; kasama ang ip default-gateway.',
      'copy running-config startup-config (o write memory).',
      'Ang running ay nasa RAM; ang startup ay nasa NVRAM.',
      'enable secret.',
      'show ip interface brief at show interfaces status.',
      'Pinipigilan ang log messages na maputol ang tina-type na command.',
    ],
    lab: {
      objective: 'Ilapat ang basic configuration, abutin ang switch mula sa ibang subnet at patunayang nananatili ang configuration sa reload.',
      steps: [
        'Maglagay ng switch, router at dalawang PC. Ilagay ang PC1 at ang switch sa 192.168.1.0/24 at ang PC2 sa likod ng router sa 10.0.0.0/24.',
        'I-configure ang hostname, enable secret, console at VTY passwords, service password-encryption at banner.',
        'I-configure ang management SVI na may IP address at no shutdown; i-ping ang switch mula sa PC1.',
        'Subukang i-ping ang switch mula sa PC2; saka idagdag ang ip default-gateway at ulitin.',
        'Magdagdag ng interface descriptions at i-shutdown ang mga hindi ginagamit na port.',
        'I-save, i-reload ang switch at kumpirmahing nananatili ang configuration; saka ulitin nang hindi nagse-save para makitang nawawala ito.',
      ],
      checklist: [
        'Gumagana ang passwords at banner',
        'Naaabot ang switch mula sa dalawang subnet',
        'Naidagdag ang descriptions',
        'Nananatili ang configuration pagkatapos ng reload kapag na-save',
      ],
      hints: [
        'Dapat naka-no shutdown ang SVI.',
        'Dapat nasa subnet ng switch ang gateway.',
      ],
      solution: [
        'interface vlan 1; ip address 192.168.1.2 255.255.255.0; no shutdown; ip default-gateway 192.168.1.1.',
        'Kung walang gateway, lokal na subnet lang ang makakapag-ping sa switch.',
        'Pinapanatili ng copy running-config startup-config ang configuration.',
      ],
      breakIt: 'Laktawan ang no shutdown sa SVI at ilarawan ang iniuulat ng show ip interface brief.',
    },
    wrong: W(6, {
      0: { 0: 'Ang enable password ay plain text maliban kung ine-encode.', 2: 'Naglalagay ito ng mahinang reversible encoding sa line passwords.', 3: 'Pumipili ang login local ng local usernames para sa line.' },
      1: { 0: 'Ang ip routing ay para sa Layer 3 switch na nagro-route.', 2: 'Hindi kailangan ang pangalawang VLAN.', 3: 'Nagre-relay ng DHCP ang helper-address.' },
      2: { 0: 'Hawak ng NVRAM ang startup-config.', 1: 'Hawak ng Flash ang IOS image.', 3: 'Hawak ng ROM ang bootstrap code.' },
      3: { 0: 'Gumagamit ito ng line password.', 2: 'Hindi iyon valid na command.', 3: 'Nililimitahan nito ang protocol, hindi ang paraan ng authentication.' },
    }),
  },
  'troubleshooting-method': {
    cards: [
      'Layer 1 pataas; application pababa; magsimula sa gitna at lumipat pataas o pababa.',
      'Naka-shutdown ang interface sa configuration.',
      'Duplex mismatch o sirang cable.',
      'show ip interface brief.',
      'traceroute (tracert sa Windows).',
      'Magbago ng isang bagay lang at i-verify.',
    ],
    lab: {
      objective: 'Gamitin ang ping ladder at show commands para hanapin at ayusin ang tatlong sirang itinanim.',
      steps: [
        'Gumawa ng PC – switch – router – server na may mga address sa dalawang subnet at i-verify ang buong koneksyon.',
        'Magpapasok ang kapareha mo (o ikaw, mamaya) ng sira 1: i-shutdown ang LAN interface ng router.',
        'Patakbuhin ang ping ladder, itala kung saan ito bumibigo at aling show command ang nagpapakita ng sanhi; ayusin.',
        'Magpasok ng sira 2: maglagay ng maling default gateway sa PC; ulitin ang proseso.',
        'Magpasok ng sira 3: magtakda ng duplex mismatch sa switch port; hanapin ito mula sa error counters.',
        'Sumulat ng talaan ng sintomas, hypothesis, test, resulta at ayos para sa bawat sira.',
      ],
      checklist: [
        'Nagamit ang ping ladder sa bawat sira',
        'Nahanap ang tamang show command sa bawat isa',
        'Naayos at na-verify ang lahat ng sira',
        'Naisulat ang talaan ng sintomas at ayos',
      ],
      hints: [
        'Mabilis ipinapakita ng show ip interface brief ang mga naka-shutdown na interface.',
        'Ipinapakita ng show interfaces ang errors at duplex.',
      ],
      solution: [
        'Sira 1: administratively down, inayos gamit ang no shutdown.',
        'Sira 2: gateway na wala sa subnet ng PC o mali, inayos sa ipconfig.',
        'Sira 3: half laban sa full duplex, inayos gamit ang auto-negotiation sa magkabilang dulo.',
      ],
      breakIt: 'Magpasok ng dalawang sira nang sabay at ilarawan kung paano ka tinutulungan ng ping ladder na paghiwalayin ang mga ito.',
    },
    wrong: W(6, {
      0: { 0: 'Sinusubok ang DNS sa pamamagitan ng name resolution, na susunod pa.', 2: 'Ang remote server ay lampas sa gateway.', 3: 'Ang ISP ay lampas sa gateway.' },
      1: { 1: 'Ang maling VLAN ay hindi nagdudulot ng CRC errors.', 2: 'Ang routing ay hindi nagdudulot ng CRC errors.', 3: 'Walang kaugnayan ang DNS sa Layer 1/2 errors.' },
      2: { 0: 'Magpapakita iyon ng down/down na walang “administratively”.', 2: 'Magpapakita iyon ng down/down.', 3: 'Hindi nagdudulot ng ganitong status ang kawalan ng address.' },
      3: { 0: 'Nagsisimula ang bottom-up sa Layer 1.', 1: 'Nagsisimula ang top-down sa application.', 3: 'Hiwalay na teknik ang pagsunod sa path.' },
    }),
  },
  'troubleshooting-scenarios': {
    cards: [
      'Hindi maabot ng host ang gateway at hindi makalabas sa network nito.',
      'switchport trunk allowed vlan add <id>.',
      'Walang adjacency; dapat magtugma ang hello at dead intervals.',
      'Ang interface ng VLAN na iyon ay walang ip helper-address (o walang pool ang server).',
      'Suriin ang pagkakasunod ng linya at ang hit counters; ang unang tugma ang panalo.',
      'Mali o kulang ang inside at outside na interface.',
    ],
    lab: {
      objective: 'Bumuo ng gumaganang network, magpasok ng bawat isa sa anim na sirang scenario nang isa-isa at ayusin ang mga ito gamit lang ang show commands.',
      steps: [
        'Bumuo ng network na may dalawang switch at dalawang router na may VLAN 10 at 20, OSPF sa pagitan ng mga router, DHCP sa relay, isang ACL at NAT papunta sa ISP router; i-verify na gumagana ang lahat.',
        'Sira 1: magtakda ng PC gateway na wala sa subnet nito. I-diagnose at ayusin.',
        'Sira 2: alisin ang VLAN 20 sa allowed list ng trunk. I-diagnose at ayusin.',
        'Sira 3: palitan ang OSPF hello interval sa isang router. I-diagnose at ayusin.',
        'Sira 4: alisin ang ip helper-address sa isang VLAN. I-diagnose at ayusin.',
        'Sira 5: maglagay ng malawak na deny sa itaas ng permit sa ACL, saka ayusin ang pagkakasunod.',
        'Sira 6: ipagpalit ang ip nat inside at outside. I-diagnose at ayusin.',
        'Itala ang sintomas, ebidensya, diagnosis at ayos para sa bawat sira.',
      ],
      checklist: [
        'Naipasok at naayos ang anim na sira',
        'Nahanap ang bawat sira gamit ang show command',
        'Ganap na gumagana ang network sa dulo',
        'Kumpleto ang log ng mga sira',
      ],
      hints: [
        'Gamitin muna ang ping ladder, saka ang show command para sa layer na bumibigo.',
        'Ayusin ang isang sira bago magpasok ng susunod.',
      ],
      solution: [
        'Gateway: tamang address. Trunk: allowed vlan add 20. OSPF: magkatugmang timers.',
        'DHCP: ip helper-address sa VLAN interface. ACL: tiyak na permit muna.',
        'NAT: ip nat inside sa LAN at outside sa ISP link.',
      ],
      breakIt: 'Magpasok ng dalawa sa mga sira nang sabay at ilarawan ang pagkakasunod kung paano mo ito mahahanap.',
    },
    wrong: W(8, {
      0: { 1: 'Normal ang /24 na mask dito.', 2: 'Hindi apektado ng DNS ang abot sa gateway.', 3: 'Ang host ay gumagamit ng default gateway, hindi static route.' },
      1: { 1: 'Papalitan niyon ang listahan at aalisin ang VLAN 10 at 30.', 2: 'Ginagawa niyong routed port ang port.', 3: 'Walang kaugnayan ang PortFast.' },
      2: { 1: 'Lokal lang ang kahulugan ng process ID.', 2: 'Dapat naman magkakaiba ang router ID.', 3: 'Walang ebidensya ng ACL.' },
      3: { 1: 'Gumagana ang routing para sa kabilang VLAN.', 2: 'Kailangan ng pool ng server; ang kulang ay ang relay.', 3: 'Hindi ang native VLAN ang sanhi.' },
      4: { 1: 'Valid ang syntax.', 2: 'Ipinapakita ng hit counters na tumutugma ito.', 3: 'Deny ang implicit na rule.' },
      5: { 1: 'Hindi laki ng pool ang problema.', 2: 'Hindi apektado ng OSPF ang NAT roles.', 3: 'Walang ita-translate ang deny.' },
    }),
  },
};

export const BATCH_M = { basic, extra };
