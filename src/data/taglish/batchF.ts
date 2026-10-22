import type { TaglishExtra, TaglishOverlay } from './index';
import { wrongNotes as W } from './helpers';

const basic: Record<string, TaglishOverlay> = {
  'dynamic-routing': {
    terms: [
      'Hanay ng mga patakaran na ginagamit ng routers para magbahagi ng routes at bumuo ng routing tables nang awtomatiko.',
      'Ang estado kung saan pare-pareho at tama ang routing information ng lahat ng router pagkatapos ng pagbabago.',
      'Ang interior gateway protocols ay tumatakbo sa loob ng autonomous system (OSPF, EIGRP, RIP); ang exterior ay sa pagitan nila (BGP).',
      'Nagbabahagi lang ng routes at distansya ang routers sa mga kapitbahay (RIP, EIGRP).',
      'Nagbabahagi ang routers ng link information para bawat isa ay makabuo ng buong mapa at magpatakbo ng SPF (OSPF).',
      'Ang value na ginagamit ng protocol sa pagraranggo ng routes: hops (RIP), bandwidth/delay (EIGRP), cost (OSPF).',
      'Hanay ng mga network sa ilalim ng iisang administrasyon na may karaniwang routing policy.',
    ],
    cli: [],
    verify: [],
    questions: [
      'Natutukoy ng routing protocols ang pagkabigo at muling kinukuwenta ang routes nang walang manu-manong pagbabago.',
      'Ang OSPF ay link-state protocol; ang RIP at EIGRP ay distance-vector na uri.',
      'Ang RIP ay gumagamit ng hop count, na may maximum na 15; ang 16 ay unreachable.',
      'Ang convergence ay ang estado kung saan nagkakasundo ang routers sa topology at routes.',
      'Magkaibang protocol ay inihahambing sa administrative distance; tinatalo ng OSPF 110 ang RIP 120.',
      'Bumubuo ang bawat router ng parehong link-state database at nagpapatakbo ng SPF dito.',
      'Ang BGP ay nagro-route sa pagitan ng autonomous systems; ang OSPF, RIP at EIGRP ay IGP.',
      'Ang RIP at EIGRP ay distance-vector (ang EIGRP ay advanced); ang OSPF at IS-IS ay link-state.',
      'Totoo — ang iisang default route ay simple at sapat para sa stub.',
    ],
  },
  'ospf-fundamentals': {
    terms: [
      '32-bit na identifier ng OSPF router: manual, kung wala ang pinakamataas na loopback IP, kung wala ang pinakamataas na aktibong interface IP.',
      'Hello packets kada 10 s; idineklarang down ang kapitbahay pagkatapos ng 40 s na walang hello.',
      'Ang routers na nagkakasundo sa parameters ay nagiging neighbours; ang nagpapalitan ng database ay umaabot sa Full adjacency.',
      'Inilalarawan ng link-state advertisements ang mga link; hawak ng database ang lahat ng ito para sa area.',
      'Ang algorithm ni Dijkstra na bumubuo ng shortest-path tree mula sa LSDB.',
      'OSPF metric: reference bandwidth na hinati sa interface bandwidth (default na 100 Mb/s na reference).',
      'Ang gitnang OSPF area; bawat ibang area ay kumokonekta rito.',
      'Mga multicast address para sa lahat ng OSPF routers at para sa DR/BDR.',
    ],
    cli: [],
    verify: [],
    questions: [
      'Ang default na hello ay 10 segundo, na may dead interval na 40 segundo.',
      'Ang 224.0.0.5 ay AllSPFRouters address; ang 224.0.0.6 ay para sa DR/BDR.',
      'Ang loopback address ay mas gusto kaysa sa physical interfaces.',
      'Cost = 100 Mb/s / 10 Mb/s = 10.',
      'Dapat natatangi ang router IDs; ang iba ay dapat magtugma.',
      'Ang Full ay nangangahulugang naitatag na ang adjacency at naka-synchronise ang mga LSDB.',
      'Pinapatakbo ng OSPF ang shortest path first algorithm ni Dijkstra sa LSDB.',
      'Ang hello/dead intervals at area ID ay dapat magtugma; ang router IDs ay dapat magkaiba.',
      'Totoo — nagbabahagi ang isang area ng pare-parehong LSDB.',
    ],
  },
  'ospf-config': {
    terms: [
      'Nagsisimula ng OSPF process; lokal lang ang kahulugan ng process ID.',
      'Binubuksan ang OSPF sa mga interface na tumutugma sa address at wildcard, sa ibinigay na area.',
      'Kabaligtaran ng subnet mask: 0 = dapat tumugma, 1 = huwag pansinin (ang /24 ay 0.0.0.255).',
      'Pinipigilan ang hellos sa interface habang ina-advertise pa rin ang network nito.',
      'Command na tahasang nagtatakda ng OSPF router ID.',
      'Naglilista ng mga kapitbahay at ang state nila; ang FULL ay nangangahulugang naitatag ang adjacency.',
      'Itinatakda ang reference bandwidth na ginagamit sa pagkuwenta ng cost; dapat magtugma sa lahat ng router.',
    ],
    cli: [
      'Sinisimulan ang process 1 (lokal na numero) at inaayos ang router ID para hindi ito magbago nang hindi inaasahan.',
      'Binubuksan ang OSPF para sa anumang interface sa 10.0.12.0/30 (wildcard 0.0.0.3 para sa /30).',
      'Ina-advertise pa rin ang LAN interface pero walang hello na ipinapadala, kaya walang rogue neighbour na makakabuo.',
      'Ginagawang sumasalamin sa Gigabit speeds ang costs; itakda ang parehong value sa bawat router.',
      'Ganap nang naitatag ang adjacency; ang DR ay nagpapahiwatig na ang kapitbahay ang designated router sa segment na iyon.',
      'Isang route na natutunan sa OSPF: AD 110, kabuuang cost 11, next hop 10.0.12.2.',
    ],
    verify: [
      'Bawat kapitbahay at ang state nito; ang FULL (o 2WAY sa multi-access network) ay malusog.',
      'Mga route na natutunan ng OSPF na may [110/cost], next hop at interface.',
      'Ang OSPF process, router ID, mga ina-advertise na network, passive interfaces at AD.',
      'Aling interface ang nagpapatakbo ng OSPF, ang area, cost, state at bilang ng kapitbahay.',
    ],
    questions: [
      'Ang router ospf <process-id> ay pumapasok sa router configuration mode para sa OSPF.',
      'Ang network command ay gumagamit ng wildcard mask: 0.0.0.255 para sa /24.',
      'Ina-advertise pa rin ang network, pero walang hello na ipinapadala kaya walang adjacency na nabubuo.',
      'Inililista ng show ip ospf neighbor ang mga kapitbahay at states tulad ng FULL.',
      'Walang hello na ipinapadala ang passive interface, kaya walang kapitbahay na mabubuo.',
      'Ang process ID ay lokal sa router; hindi kailangang tumugma sa mga kapitbahay.',
      'Ang 255.255.255.252 na binaligtad ay 0.0.0.3.',
      'Ipinapakita ng mga kapitbahay at ng O routes kung gumagana ang OSPF.',
      'Totoo — ang clear ip ospf process ang naglalapat ng bagong router ID.',
    ],
  },
};

const extra: Record<string, TaglishExtra> = {
  'dynamic-routing': {
    cards: [
      'Static: manu-mano, walang overhead, mainam sa stub/default/backup. Dynamic: awtomatiko, scalable, umaangkop sa pagbabago pero gumagamit ng resources.',
      'Ang distance-vector ay nagbabahagi ng routes sa kapitbahay (RIP, EIGRP). Ang link-state ay nagpapalaganap ng topology para bawat router ay bumuo ng mapa at magpatakbo ng SPF (OSPF).',
      'Ang IGP ay tumatakbo sa loob ng autonomous system (OSPF, EIGRP, RIP); ang EGP ay sa pagitan nila (BGP).',
      'RIP hops/120, EIGRP bandwidth+delay/90, OSPF cost/110.',
      'Pare-pareho at tama ang routes ng lahat ng router pagkatapos ng pagbabago sa topology; mas mabilis ay mas mabuti.',
    ],
    lab: {
      objective: 'Magpasya kung saan bagay ang static o dynamic routing at pumili ng protocol para sa ilang senaryo.',
      steps: [
        'Gumawa ng table na may mga column: senaryo, static o dynamic, protocol, dahilan.',
        'Senaryo 1: branch na may isang link sa HQ. Senaryo 2: sampung router na may redundant links. Senaryo 3: backup na daan para sa umiiral na OSPF route. Senaryo 4: ISP link papunta sa internet. Senaryo 5: maliit na Cisco-only na network na nangangailangan ng mabilis na convergence.',
        'Punan ang mga desisyon at dahilan mo.',
        'Ilista ang metric at AD ng bawat protocol na pinili mo.',
        'Suriin ang mga sagot mo gamit ang solution.',
      ],
      checklist: [
        'Nagpasya sa limang senaryo na may dahilan',
        'Nailista ang metric at AD ng mga protocol na pinili',
        'Naipaliwanag kung bakit mas mabilis mag-converge ang link-state',
      ],
      hints: [
        'Ang iisang labasan ay karaniwang nangangahulugang default route.',
        'Ang maraming router at maraming daan ay nangangailangan ng dynamic protocol.',
      ],
      solution: [
        '1 static default; 2 dynamic (OSPF); 3 floating static (AD 130); 4 static default o BGP para sa multihoming; 5 OSPF o EIGRP.',
        'OSPF cost/110; EIGRP bandwidth+delay/90; RIP hops/120.',
      ],
    },
    wrong: W(9, {}),
  },
  'ospf-fundamentals': {
    cards: [
      '1) manual router-id; 2) pinakamataas na aktibong loopback IP; 3) pinakamataas na aktibong physical interface IP.',
      'Parehong area ID, hello/dead timers at subnet (at authentication); natatanging router IDs.',
      'Reference bandwidth (default 100 Mb/s) ÷ interface bandwidth; minimum 1.',
      'Down, Init, 2-Way, ExStart, Exchange, Loading, Full.',
      'IP protocol 89; hello sa 224.0.0.5; DR/BDR ay gumagamit ng 224.0.0.6; AD 110.',
    ],
    lab: {
      objective: 'Ilapat ang mga patakaran ng router ID at formula ng cost sa ilang router at tukuyin kung alin ang magiging neighbour.',
      steps: [
        'Router A: loopback 1.1.1.1, Gi0/0 10.0.0.1. Router B: walang loopback, Gi0/0 10.0.0.2, Gi0/1 192.168.5.1. Router C: manual na router-id 9.9.9.9, loopback 1.1.1.1. Isulat ang router ID ng bawat isa.',
        'Kuwentahin ang cost ng mga link na 10 Mb/s, 100 Mb/s at 1 Gb/s sa default na reference bandwidth.',
        'Kuwentahin ang kabuuang cost ng daan na may 100 Mb/s at dalawang 1 Gb/s na link.',
        'Para sa dalawang router na may hello 10/dead 40 at hello 30/dead 120, magpasya kung magiging neighbour sila at bakit.',
        'Ilista ang mga neighbour state ayon sa pagkakasunod at sabihin kung ano ang nangyayari sa bawat isa.',
      ],
      checklist: [
        'Tama ang router ID ng A, B at C',
        'Tama ang pagkuwenta ng costs',
        'Naipaliwanag ang desisyon sa neighbour',
        'Nailista ang states ayon sa pagkakasunod',
      ],
      hints: [
        'Laging panalo ang manual na router-id; saka loopbacks; saka physical interfaces.',
        'Ang minimum na OSPF cost ay 1.',
      ],
      solution: [
        'A = 1.1.1.1, B = 192.168.5.1, C = 9.9.9.9.',
        'Costs: 10, 1, 1. Kabuuan ng daan 1 + 1 + 1 = 3. Magkaiba ang timers kaya hindi sila magiging neighbour.',
      ],
    },
    wrong: W(9, {}),
  },
  'ospf-config': {
    cards: [
      'router ospf 1 → router-id 1.1.1.1 → network <address> <wildcard> area 0 → passive-interface <LAN>',
      '/24 = 0.0.0.255; /30 = 0.0.0.3 (kabaligtaran ng mask).',
      'show ip ospf neighbor, show ip route ospf, show ip protocols, show ip ospf interface brief',
      'Pinipigilan ang hellos sa interface pero ina-advertise pa rin ang network nito; huwag gamitin sa neighbour links.',
      'default-information originate; auto-cost reference-bandwidth <Mb/s> (pareho sa lahat ng router).',
    ],
    lab: {
      objective: 'I-configure ang OSPF sa area 0 sa tatlong router, i-verify ang mga kapitbahay at routes, at sirain at ayusin ang isang adjacency.',
      steps: [
        'I-address ang lahat ng interface at buksan ang mga ito.',
        'Sa bawat router: router ospf 1, router-id x.x.x.x, magdagdag ng network statements para sa LAN at mga link network.',
        'Gawing passive ang bawat LAN interface.',
        'Patakbuhin ang show ip ospf neighbor sa R2 at kumpirmahin ang dalawang FULL na kapitbahay.',
        'Patakbuhin ang show ip route ospf sa R1 at kumpirmahin ang routes papunta sa ibang LAN; mag-ping end to end.',
        'Sirain: gawing passive ang interface ng R1–R2 sa R1 at panoorin ang pagbagsak ng kapitbahay, saka ibalik.',
      ],
      checklist: [
        'FULL ang mga kapitbahay sa lahat ng link',
        'May O routes ang bawat router papunta sa ibang LAN',
        'Gumagana ang end-to-end ping',
        'Naobserbahan at naayos ang passive-interface na pagpalya',
      ],
      hints: [
        'Gumamit ng wildcard masks: 0.0.0.255 para sa /24 at 0.0.0.3 para sa /30.',
        'Suriin ang show ip protocols kung may nawawalang routes.',
      ],
      solution: [
        'Ina-advertise ng bawat router ang LAN at link networks nito sa area 0, na passive ang mga LAN.',
        'Ang R2 ay nagpapakita ng dalawang FULL na kapitbahay; ang R1 at R3 ay tig-isa.',
      ],
      breakIt: 'Palitan ang hello interval sa R2 lang at panoorin ang pagbagsak ng kapitbahay pagkatapos ng dead interval.',
    },
    wrong: W(9, {}),
  },
};

export const BATCH_F = { basic, extra };
