import type { TaglishExtra, TaglishOverlay } from './index';
import { wrongNotes as W } from './helpers';

const basic: Record<string, TaglishOverlay> = {
  'router-forwarding': {
    terms: [
      'Layer 3 device na nagpapasa ng packets sa pagitan ng mga network gamit ang routing table.',
      'Ang address ng router sa sariling subnet ng host na ginagamit nito para maabot ang ibang network.',
      'Ang address ng susunod na router sa daan papunta sa destination.',
      'Isang router na tinawid ng packet. Bumababa ng 1 ang TTL sa bawat hop.',
      'Time to live: field sa IP header na binabawasan sa bawat router; ibinabagsak ang packet kapag 0.',
      'Nagre-resolve ng IPv4 address ng next hop o destination papunta sa MAC address sa lokal na link.',
      'Inaalis ng router ang lumang Layer 2 header at gumagawa ng bago para sa palabas na link.',
      'ICMP message na ipinapadala kapag walang route ang router o hindi maihatid ang packet.',
    ],
    cli: [],
    verify: [
      'Ang route na gagamitin ng router para sa destination na iyon, kasama ang next hop at exit interface.',
      'Mga IP-to-MAC mapping na natutunan ng router para sa next hops at hosts.',
      'Bawat router (hop) sa daan at ang response time.',
      'Kung sumasagot ang destination; ang "U" ay nangangahulugang may router na sumagot ng unreachable.',
    ],
    questions: [
      'Hinahanap ng router ang destination IP address sa routing table nito.',
      'Gumagawa ang router ng bagong frame na may bagong source at destination MAC para sa palabas na link.',
      'Para sa remote na destination, ipinapadala ng host ang frame sa MAC ng default gateway; nananatili ang destination IP ng server.',
      'Kapag walang tugmang route ang packet, itinatapon ito at karaniwang ibinabalik ang ICMP unreachable.',
      'Binabawasan ng bawat router ang TTL; ibinabagsak ang packet kapag 0.',
      'Bawat link (source papuntang R1, R1 papuntang R2, R2 papuntang R3, R3 papuntang destination) ay gumagamit ng bagong frame: apat na link, apat na frame.',
      'Nagpapadala ang traceroute ng packets na TTL 1, 2, 3 at iba pa at itinatala ang bawat router na sumasagot ng time exceeded.',
      'Ang IP addresses ay end to end; ang MAC addresses ay nagbabago sa bawat hop.',
      'Mali — hindi nagpapasa ng broadcast ang routers; bawat interface ay sariling broadcast domain.',
    ],
  },
  'routing-table': {
    terms: [
      'Listahan ng mga network na alam ng router at kung paano maabot ang bawat isa.',
      'Ang destination network at mask, halimbawa 10.2.0.0/24.',
      'Rating ng pagkakatiwalaan sa source ng route; mas mababa ay mas gusto.',
      'Gastos na tukoy sa protocol na ginagamit para ihambing ang mga route na natutunan ng iisang protocol.',
      'Ang pinakatiyak na tugmang route (pinakamahabang mask) ang pinipili muna.',
      'C: direktang nakakabit na network. L: ang sariling interface address ng router (/32).',
      'Ang default route na ginagamit kapag walang mas tiyak na tugma.',
      'Static route na may mas mataas na AD na ginagamit lang bilang backup.',
    ],
    cli: [
      'Ang default route (static candidate default), AD 1. Ginagamit lang kapag walang mas tiyak na tugma.',
      'Isang direktang nakakabit na network. AD 0, hindi kailangan ng next hop.',
      'Ang sariling address ng router sa interface na iyon; ang trapikong papunta rito ay pinoproseso mismo ng router.',
      'Isang OSPF route: AD 110, metric (cost) 2, next hop 10.1.1.2, natutunan 1 minuto at 10 segundo ang nakalipas.',
      'Mas tiyak na static route. Para sa 10.2.5.9, tinatalo ng /24 na ito ang OSPF /16 sa longest prefix match.',
    ],
    verify: [],
    questions: [
      'Ang C ay nagmamarka ng direktang nakakabit na network.',
      'Ang unang numero sa bracket ay administrative distance at ang pangalawa ay metric.',
      'Ang longest prefix match ay inilalapat bago ang AD at metric.',
      'Ang static routes ay may AD 1; connected ay 0; EIGRP 90, OSPF 110, RIP 120.',
      'Ang /24 ang longest prefix match, na napagpapasyahan bago ang AD.',
      'Ang mga L entry ay ang local /32 address ng interfaces ng router.',
      'Ipinapakita ng show ip route <address> ang tugmang routing entry.',
      'Ang AD ay nagraranggo ng sources; ang metrics ay nagraranggo ng routes sa loob ng protocol. Mas mababa ang gusto.',
      'Totoo — ang S* ay static route na candidate default.',
    ],
  },
  'static-routes': {
    terms: [
      'Mano-manong naka-configure na route na may default administrative distance 1.',
      'Static route na pinangalanan ang IP address ng kapitbahay bilang daan papunta sa network.',
      'Static route na pinangalanan ang palabas na interface sa halip na next-hop address.',
      'Static route na pinangalanan ang exit interface at ang next-hop IP.',
      'Ang pabalik na route papunta sa source network, kailangan para sa mga reply.',
      'Static route na may mas mataas na AD na kumikilos bilang backup.',
      'Hinahanap ng router ang next hop sa routing table para malaman ang exit interface.',
    ],
    cli: [
      'Next-hop static route: para maabot ang 192.168.2.0/24, ipadala sa 172.16.0.2.',
      'Fully specified route: pinangalanan ang exit interface at next hop; inirerekomenda sa Ethernet links.',
      'Floating static route: ang AD 130 ay mas mataas kaysa OSPF 110, kaya backup lang.',
      'Inililista lang ang static routes para makumpirma kung ano ang na-install.',
      'Ang return route. Kung wala ito, hindi makararating ang mga reply sa source network.',
    ],
    verify: [
      'Mga static route na naka-install sa table na may [AD/metric] at next hop.',
      'Lahat ng naka-configure na static route, kasama ang mga hindi kasalukuyang naka-install.',
      'Kung gumagana ang forward at return na daan at kung saan ito pumapalya.',
      'Ang eksaktong route entry na ginagamit para sa destination.',
    ],
    questions: [
      'Ang ip route <network> <mask> <next-hop> ang syntax.',
      'Ang static routes ay may AD 1; ang connected routes ay 0.',
      'Kailangan ng mga reply ng route pabalik sa source network.',
      'Dapat mas mataas ang AD kaysa OSPF (110); karaniwang pagpipilian ang 130.',
      'Sa Ethernet, ang pagpangalan sa next hop ay iniiwasan ang ARP para sa bawat destination.',
      'Ini-install lang ang floating static kung bawiin ang piniling route.',
      'Ang show ip route static ay nagfi-filter ng table sa static routes.',
      'Gumamit ng next-hop address, exit interface, o pareho.',
      'Mali — one-way ang static routes; bawat router ay nangangailangan ng sarili nitong routes.',
    ],
  },
  'default-routes': {
    terms: [
      'Ang route na 0.0.0.0/0 na tumutugma sa bawat destination na hindi sakop ng mas tiyak na route.',
      'Ang next hop na ginagamit ng default route.',
      'Route code para sa static route na candidate default.',
      'Network na iisa lang ang koneksyon sa natitirang topology.',
      'Palayaw ng 0.0.0.0 0.0.0.0, ang IPv4 default route.',
      'OSPF command na nag-a-advertise ng default route ng router sa mga kapitbahay nito.',
    ],
    cli: [
      'Ipinapadala sa ISP na 203.0.113.2 ang lahat ng trapikong walang mas tiyak na route.',
      'Kinukumpirmang naka-install ang default route at ipinapakita ang next hop nito.',
      'Ang static candidate default route na AD 1.',
      'Ang return route papunta sa customer; kung wala ito, mawawala ang mga reply.',
      'Sa ilalim ng router ospf, nag-a-advertise ng default route ng router na ito sa mga OSPF neighbour.',
    ],
    verify: [
      'Ang Gateway of last resort na linya at ang S* 0.0.0.0/0 na entry.',
      'Ang default route entry at kung paano ito natutunan.',
      'Kung lumalabas ang trapiko sa default route at kung saan ito humihinto.',
      'Ang naka-configure na default route.',
    ],
    questions: [
      'Ang default route ay gumagamit ng network 0.0.0.0 at mask 0.0.0.0.',
      'Ang S* ay nagmamarka ng static route na candidate default.',
      'Ang /0 ang pinakamaikling tugma, kaya ginagamit lang ito kapag walang mas tiyak na tugma.',
      'Ang default-information originate sa ilalim ng router ospf ang nag-a-advertise ng default route.',
      'Ang linya ay nangangahulugang walang default route na naka-install, madalas dahil nawawala ito o hindi maabot ang next hop.',
      'Kailangan ng return route papunta sa customer prefix.',
      'Ang IPv6 default route ay ::/0.',
      'Ang stub ay may iisang labasan, kaya karaniwang sapat na ang default route.',
      'Mali — ang mas tiyak na routes ang panalo sa longest prefix match.',
    ],
  },
};

const extra: Record<string, TaglishExtra> = {
  'router-forwarding': {
    cards: [
      'Tumanggap ng frame, decapsulate, suriin ang TTL, route lookup (longest match), i-resolve ang next-hop MAC gamit ang ARP, gumawa ng bagong frame at ipadala.',
      'Nagbabago ang MAC addresses sa bawat hop; ang IP addresses ay nananatiling pareho end to end (kung walang NAT).',
      'Ipinapadala ang frame sa MAC ng default gateway; nananatili sa packet ang remote destination IP.',
      'Itinatapon ng router ang packet at maaaring magbalik ng ICMP destination unreachable.',
      'show ip route <address>  (at traceroute <address> para makita ang bawat hop).',
    ],
    lab: {
      objective: 'Sundan ang isang ping sa dalawang router sa simulation mode at itala ang MAC at IP addresses sa bawat hop.',
      steps: [
        'I-configure ang addresses, default gateways at static routes para makapag-ping ang PC1 sa server.',
        'Lumipat sa Simulation mode at i-filter sa ICMP at ARP lang.',
        'Magpadala ng isang ping mula PC1 papunta sa server at daanan ang bawat event.',
        'Sa bawat device, buksan ang PDU details at itala ang source at destination MAC at IP.',
        'Punan ang table na may mga column: link, src MAC, dst MAC, src IP, dst IP, TTL.',
        'Markahan kung aling mga column ang nagbago sa pagitan ng mga link at alin ang nanatili.',
      ],
      checklist: [
        'Nagtagumpay ang ping end to end',
        'Kumpleto ang table para sa tatlong link',
        'Natukoy na nagbabago ang MAC at nananatili ang IP',
        'Naobserbahan ang pagbaba ng TTL',
      ],
      hints: [
        'Ang unang frame ay ARP para sa default gateway.',
        'Kailangan ng routers ng route sa parehong direksyon para makabalik ang reply.',
      ],
      solution: [
        'Link 1: dst MAC = R1; link 2: dst MAC = R2; link 3: dst MAC = server; hindi nagbago ang IP addresses.',
        'Ang TTL ay nagsisimula sa 128 sa PC at binabawasan ng 1 sa bawat router.',
      ],
      breakIt: 'Alisin ang return route sa R2 at panoorin ang pagpalya ng ping kahit umaabot ang request sa server.',
    },
    wrong: W(9, {}),
  },
  'routing-table': {
    cards: [
      '1) longest prefix match; 2) pinakamababang administrative distance; 3) pinakamababang metric.',
      'Connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120, iBGP 200.',
      'C connected, L local /32, S static, S* static default, O OSPF, D EIGRP.',
      'Administrative distance 110, metric 2.',
      'show ip route <address>',
    ],
    lab: {
      objective: 'Basahin ang routing table, hulaan kung aling route ang gagamitin para sa ilang destination at kumpirmahin gamit ang show ip route.',
      steps: [
        'Sa R1, i-configure: ip route 10.0.0.0 255.0.0.0 172.16.0.2, ip route 10.5.5.0 255.255.255.0 172.16.0.3 at ip route 0.0.0.0 0.0.0.0 172.16.0.9.',
        'Patakbuhin ang show ip route at tukuyin ang bawat code at [AD/metric].',
        'Hulaan ang next hop para sa 10.9.9.9, 10.5.5.20 at 8.8.8.8 bago subukan.',
        'I-verify ang bawat isa gamit ang show ip route <address>.',
        'Magdagdag ng floating static sa 10.5.5.0/24 na AD 130 via 172.16.0.4 at kumpirmahing hindi ito naka-install.',
        'I-shutdown ang interface papunta sa 172.16.0.3 at obserbahan ang paglitaw ng floating route.',
      ],
      checklist: [
        'Nagawa ang mga hula bago mag-verify',
        'Tama ang lahat ng tatlong hula',
        'Na-install lang ang floating static pagkatapos ng pagkabigo',
      ],
      hints: [
        'Longest prefix muna, saka AD, saka metric.',
        'Ang route na may hindi maabot na next hop ay inaalis sa table.',
      ],
      solution: [
        'Ang 10.9.9.9 ay gumagamit ng 10.0.0.0/8; ang 10.5.5.20 ay gumagamit ng 10.5.5.0/24; ang 8.8.8.8 ay gumagamit ng default route.',
        'Lumilitaw lang ang floating static (AD 130) kapag nawala ang piniling AD 1 na route.',
      ],
      breakIt: 'Bigyan din ng AD na 1 ang floating static at obserbahan kung pareho silang gamitin o mananalo ang una depende sa pagkakasunod.',
    },
    wrong: W(9, {}),
  },
  'static-routes': {
    cards: [
      'ip route <network> <mask> <next-hop | exit-interface> [AD]',
      'Kailangan ng mga reply ng route pabalik sa source network, kung hindi ay pumapalya ang ping sa isang direksyon.',
      'Static route na may mas mataas na AD (tulad ng 130) na ginagamit lang bilang backup.',
      'Next hop o fully specified (interface + next hop); iwasan ang exit interface lang.',
      'show ip route static; ping at traceroute mula sa magkabilang dulo.',
    ],
    lab: {
      objective: 'Ikonekta ang dalawang LAN gamit ang static routes, saka magdagdag ng backup na daan bilang floating static route.',
      steps: [
        'I-address ang lahat ng interface at itakda ang default gateway ng mga PC.',
        'Kumpirmahing hindi pa maabot ng PC1 ang LAN2.',
        'Idagdag ang forward static route sa R1 gamit ang next hop ng pangunahing link.',
        'Mag-ping mula PC1; pansinin na dumarating ang request pero walang reply na bumabalik.',
        'Idagdag ang return static route sa R2 at mag-ping ulit.',
        'Magdagdag ng floating static route (AD 130) sa parehong router sa backup link at subukan sa pag-shutdown ng pangunahing link.',
      ],
      checklist: [
        'Naobserbahan ang one-way na pagpalya kapag walang return route',
        'Gumagana ang end-to-end ping gamit ang parehong route',
        'Ginamit lang ang floating route pagkatapos mabigo ang pangunahing link',
      ],
      hints: [
        'Gamitin ang show ip route para makita kung naka-install ang bawat route.',
        'Nakatago ang floating route hangga’t wala na ang pangunahing route.',
      ],
      solution: [
        'R1: ip route 192.168.2.0 255.255.255.0 172.16.0.2 at R2: ip route 192.168.1.0 255.255.255.0 172.16.0.1.',
        'Backup: parehong network via 172.16.9.x na address na may AD 130.',
      ],
      breakIt: 'Magkamali sa mask ng return route (255.255.0.0) at tingnan kung aling mga network ang naaapektuhan.',
    },
    wrong: W(9, {}),
  },
  'default-routes': {
    cards: [
      'ip route 0.0.0.0 0.0.0.0 <next-hop>   (IPv6: ipv6 route ::/0 <next-hop>)',
      'Static route na candidate default; itinatakda ang gateway of last resort.',
      'Kapag walang mas tiyak na route na tumutugma (longest prefix match).',
      'router ospf 1 → default-information originate',
      'Network na iisa ang labasan; kailangan lang nito ng default route (at return route sa provider).',
    ],
    lab: {
      objective: 'I-configure ang default route sa customer router at ang katugmang return route sa ISP router.',
      steps: [
        'I-configure ang lahat ng interface address at ang default gateway ng PC.',
        'I-ping ang 198.51.100.10 mula sa PC1 at obserbahan ang pagpalya.',
        'Idagdag ang ip route 0.0.0.0 0.0.0.0 203.0.113.2 sa R1.',
        'Patakbuhin ang show ip route at hanapin ang Gateway of last resort at S*.',
        'Mag-ping ulit; kung pumapalya pa rin, idagdag ang ip route 192.168.1.0 255.255.255.0 203.0.113.1 sa ISP.',
        'Patakbuhin ang traceroute para makita ang daan sa default route.',
      ],
      checklist: [
        'Naka-install ang default route na may S*',
        'Nagtatagumpay ang ping pagkatapos idagdag ang return route',
        'Ipinapakita ng traceroute ang R1 at saka ang ISP',
      ],
      hints: [
        'Dapat nasa direktang nakakonektang subnet ang next hop.',
        'Kung gumagana ang request pero walang reply, suriin ang return route ng ISP.',
      ],
      solution: [
        'Ang R1 ay may S* 0.0.0.0/0 via 203.0.113.2; ang ISP ay may static route pabalik sa 192.168.1.0/24.',
        'Ipinapakita ng traceroute ang 192.168.1.1, 203.0.113.2, saka ang destination.',
      ],
      breakIt: 'Palitan ang next hop ng default route sa hindi nagagamit na address sa link at tingnan ang paglaho ng Gateway of last resort kung hindi ito maabot.',
    },
    wrong: W(9, {}),
  },
};

export const BATCH_E = { basic, extra };
