import type { TaglishExtra, TaglishOverlay } from './index';
import { wrongNotes as W } from './helpers';

const basic: Record<string, TaglishOverlay> = {
  'port-security': {
    terms: [
      'Feature ng switch na naglilimita kung aling MAC address ang puwedeng gumamit ng access port.',
      'MAC address na pinapayagang gamitin ng port: static, dynamic o sticky.',
      'Ang natututunang secure addresses ay idinaragdag sa running configuration at puwedeng i-save.',
      'Bilang ng secure MAC address na pinapayagan sa port; default 1.',
      'Frame mula sa MAC na lampas sa maximum o mula sa hindi awtorisadong address.',
      'Mga violation mode: tahimik na ibagsak, ibagsak at i-log, o i-err-disable ang port (default).',
      'Port na isinara ng protection feature; kailangan ng shutdown/no shutdown o timed recovery.',
    ],
    cli: [
      'Gumagana lang ang port security sa static access (o voice) ports, kaya itakda muna ang mode.',
      'Binubuksan ang feature gamit ang defaults (maximum 1, violation shutdown).',
      'Pinapayagan ang hanggang dalawang secure MAC address, halimbawa PC at IP phone.',
      'Kusang natututunan ang mga address at isinusulat sa running config.',
      'Ibinabagsak at ni-lo-log ang mga lumalabag na frame, pero nananatiling up ang port para sa lehitimong device.',
      'Up at protektado ang port; ang Secure-shutdown ay nangangahulugang na-disable ito ng violation.',
    ],
    verify: [
      'Bawat secured na port kasama ang maximum, kasalukuyang bilang, violation count at aksyon.',
      'Status (Secure-up o Secure-shutdown), mode, mga natutunang address at ang huling source MAC.',
      'Ang secure MAC address table na may uri (sticky, static, dynamic).',
      'Kung err-disabled ang port pagkatapos ng violation.',
    ],
    questions: [
      'Ang default na violation mode ay shutdown, na naglalagay sa port sa err-disabled.',
      'Bilang default, isang secure MAC address ang pinapayagan.',
      'Ibinabagsak ng restrict ang mga frame, gumagawa ng logs at nagdaragdag sa violation counter nang hindi dini-disable ang port.',
      'Natututo ang sticky ng secure addresses at isinusulat ang mga ito sa running config.',
      'Kailangan ng port security ng static access (o voice) port.',
      'Ang pag-cycle ng interface (o errdisable recovery) ang nagbubura ng err-disabled state.',
      'Dalawang device ay nangangailangan ng dalawang secure address, kaya itaas ang maximum sa 2.',
      'Binibilang ng restrict at shutdown ang mga violation; ang protect ay tahimik na nagbabagsak at walang counter.',
      'Totoo — ang sticky addresses ay nasa running config at kailangang i-save sa startup-config.',
    ],
  },
  'dhcp-snooping': {
    terms: [
      'Layer 2 security feature na nagfi-filter ng DHCP messages at bumubuo ng binding table.',
      'Port na pinapayagang magpadala ng DHCP server messages: uplinks at ang tunay na DHCP server.',
      'Port, karaniwang para sa hosts, na puwede lang magpadala ng DHCP client messages. Default na state.',
      'Hindi awtorisadong DHCP server na nagbibigay ng maling settings sa clients.',
      'Pag-ubos sa DHCP pool gamit ang pekeng requests.',
      'Mga record ng MAC, IP, VLAN, port at lease ng bawat client, ginagamit ng DAI at IP Source Guard.',
      'Takip sa DHCP packets bawat segundo sa untrusted port; ang sobra ay nag-e-err-disable dito.',
    ],
    cli: [
      'Binubuksan ang feature sa global; walang sinasala hangga’t hindi pinipili ang mga VLAN.',
      'Pinipili ang mga VLAN kung saan sinusuri ang DHCP messages.',
      'Pinapayagan ang DHCP server messages sa uplink papunta sa tunay na server.',
      'Tinatakpan ang DHCP requests sa 15 bawat segundo sa user ports para limitahan ang starvation attacks.',
      'Nagpapakita ng lehitimong client, ang IP address, VLAN at port nito; ginagamit ito ng DAI.',
    ],
    verify: [
      'Kung naka-on ang snooping, aling mga VLAN, aling mga port ang trusted at anumang rate limit.',
      'Ang table ng mga client: MAC, IP, lease, VLAN at port.',
      'Mga counter ng packet na ipinasa at ibinagsak, kasama ang untrusted server messages.',
      'Lahat ng snooping command na naka-configure.',
    ],
    questions: [
      'Hinaharang ng DHCP snooping ang hindi awtorisadong DHCP servers (at nakakatulong laban sa starvation).',
      'I-trust ang port ng DHCP server at ang uplinks; nananatiling untrusted ang user ports.',
      'Hindi pinapayagan ang server messages mula sa untrusted ports at ibinabagsak ang mga ito.',
      'Ang ip dhcp snooping trust ay ini-enter sa interface configuration mode.',
      'Itinatala ng table ang lehitimong leases at ginagamit ng DAI at IP Source Guard.',
      'Kung untrusted ang server port, ibinabagsak ang tunay na DHCP replies.',
      'Ang ip dhcp snooping limit rate <pps> ang tumatakip sa DHCP packets bawat segundo sa port.',
      'Kailangan ang global command at ang listahan ng VLAN.',
      'Totoo — ang mga port lang na minarkahan mo ng ip dhcp snooping trust ang trusted.',
    ],
  },
  dai: {
    terms: [
      'Pagpapadala ng pekeng ARP replies para lasunin ang caches at i-redirect ang trapiko (poisoning).',
      'Dynamic ARP Inspection: sinusuri ang ARP packets sa untrusted ports laban sa binding table.',
      'DHCP snooping database ng MAC, IP, VLAN at port na ginagamit bilang batayan ng katotohanan.',
      'Access list ng IP-to-MAC pairs para sa mga host na hindi gumagamit ng DHCP.',
      'Port na hindi sinusuri ang ARP packets: uplinks at routers.',
      'Hindi hinihinging ARP announcement, tinatanggap ng hosts at inaabuso ng attackers.',
    ],
    cli: [
      'Binubuksan ang DAI para sa VLAN 10; ang ARP sa untrusted ports ay vina-validate na.',
      'Hindi isinasama ang uplink sa inspection para makapasa ang lehitimong ARP mula sa ibang switch at router.',
      'Nagdaragdag ng dagdag na pagsusuri na pare-pareho at valid ang MAC at IP fields sa ARP packet.',
      'Tinatakpan ang ARP packets bawat segundo sa port para limitahan ang floods; ang sobra ay nag-e-err-disable sa port.',
      'Mga ARP packet na ibinagsak dahil hindi tumugma sa DHCP snooping binding table.',
    ],
    verify: [
      'Kung aktibo ang DAI sa VLAN at ang bilang ng forwarded at dropped.',
      'Trust state at rate limit ng bawat port.',
      'Ang mga binding na ginagamit ng DAI bilang batayan ng katotohanan.',
      'Mga log entry para sa ibinagsak na ARP packets.',
    ],
    questions: [
      'Ibinabagsak ng DAI ang pekeng ARP packets, kaya napipigilan ang ARP poisoning.',
      'Sinusuri ng DAI ang sender IP at MAC laban sa DHCP snooping binding table (o ARP ACL).',
      'Ang ip arp inspection vlan <list> ang nag-e-enable ng DAI sa mga VLAN na iyon.',
      'Ang ip arp inspection trust ang nagmamarka sa port bilang trusted para sa DAI.',
      'Wala sa binding table ang mga static host; ang ARP ACL ang nagbibigay ng IP-to-MAC mapping nila.',
      'Ang DHCP snooping ang bumubuo ng binding table na inaasahan ng DAI.',
      'Ang untrusted ports ay default sa 15 ARP packets bawat segundo; ang paglampas dito ay nag-e-err-disable sa port.',
      'Sinusuri ng DAI ang ARP sa untrusted ports gamit ang binding table; hindi sinusuri ang trusted ports.',
      'Mali — walang authentication ang ARP, kaya kailangan ang DAI.',
    ],
  },
  aaa: {
    terms: [
      'Pag-verify kung sino ang user o device.',
      'Pagpapasya kung ano ang puwedeng gawin ng na-authenticate na user.',
      'Pagtatala kung ano ang ginawa ng user at kailan, para sa audit at billing.',
      'Open-standard na AAA protocol sa UDP (1812/1813); password lang ang naka-encrypt; karaniwan sa network access.',
      'AAA protocol sa TCP 49 na ine-encrypt ang buong packet at pinaghihiwalay ang tatlong A; karaniwan sa device administration.',
      'Ang global command na nagbubukas ng AAA sa Cisco device.',
      'Nakaayos na listahan ng authentication methods, tulad ng server muna at local bilang fallback.',
      'Multi-factor authentication: dalawa o higit pa sa alam, hawak at ikaw mismo.',
    ],
    cli: [
      'Gumawa muna ng local account para makapag-login ka pa rin kung hindi maabot ang server.',
      'Binubuksan ang AAA; mula ngayon ay method lists na ang gagamitin ng logins.',
      'Tinutukoy ang address ng TACACS+ server at ang shared secret na ginagamit sa pag-encrypt ng packets.',
      'Subukan muna ang TACACS+ server, saka mag-fall back sa local accounts kung walang sumasagot na server.',
      'Itinatala sa server ang simula at pagtatapos ng bawat exec session.',
      'Naaabot ng router ang TACACS+ server. Ang DEAD ay magti-trigger ng local fallback.',
    ],
    verify: [
      'Bawat AAA server, ang state nito (UP o DEAD) at mga counter ng request.',
      'Ang method lists at mga server definition.',
      'Sino ang naka-login at paano sila nag-authenticate.',
      'Ang AAA na usapan habang nagla-login (sa lab lang gamitin).',
    ],
    questions: [
      'Sinasagot ng authentication ang "sino ka?".',
      'Sinusubaybayan ng accounting ang aktibidad para sa audit at billing.',
      'Ang TACACS+ ay tumatakbo sa TCP 49 at ine-encrypt ang buong packet.',
      'Gumagamit ang RADIUS ng UDP (1812/1813), password lang ang ine-encrypt at pinagsasama ang authentication at authorization.',
      'Pinaghihiwalay ng TACACS+ ang authorization, kaya posible ang per-command na kontrol para sa device administration.',
      'Sinusubukan ang mga method ayon sa pagkakasunod: ang TACACS+ group muna, saka local kung hindi sumasagot ang mga server.',
      'Ang aaa new-model ang nagbubukas ng AAA sa global configuration.',
      'Ang klasikong mga factor ay alam, hawak at ikaw mismo (biometrics).',
      'Totoo — isang server ang namamahala ng users, policy at logs para sa lahat ng device.',
    ],
  },
};

const extra: Record<string, TaglishExtra> = {
  'port-security': {
    cards: [
      'switchport mode access → switchport port-security → (maximum n) → (mac-address sticky) → (violation restrict)',
      'Protect: drop lang. Restrict: drop + log + counter. Shutdown: err-disabled (default).',
      'Maximum 1 secure MAC, violation shutdown, gumagana lang sa static access ports.',
      'show port-security, show port-security interface <if>, show port-security address',
      'interface <if> → shutdown → no shutdown (o errdisable recovery cause psecure-violation).',
    ],
    lab: {
      objective: 'I-configure ang sticky port security, magsaksak ng pangalawang device, obserbahan ang violation at bumawi.',
      steps: [
        'Sa SW1 Fa0/5: switchport mode access, switchport port-security, switchport port-security mac-address sticky.',
        'Mag-ping mula sa PC1 para matutunan ng switch ang MAC nito; patakbuhin ang show port-security interface fa0/5.',
        'Palitan ang PC1 ng PC2 sa Fa0/5 at gumawa ng traffic.',
        'Obserbahan ang port status at patakbuhin ang show interfaces status at show port-security.',
        'Bumawi: ibalik ang PC1, saka shutdown at no shutdown sa Fa0/5.',
        'Palitan ang violation mode sa restrict at ulitin ang test; ihambing ang gawi.',
      ],
      checklist: [
        'Natutunan at nakikita ang sticky MAC',
        'Naging err-disabled ang port pagkatapos kumonekta ang intruder',
        'Nakabawi gamit ang shutdown / no shutdown',
        'Naihambing ang gawi ng shutdown at restrict',
      ],
      hints: [
        'Dapat nasa access mode ang port bago ma-enable ang port security.',
        'Ang unang device na magpapadala ng traffic ang magiging sticky address.',
      ],
      solution: [
        'Lumalampas ang pangalawang MAC sa maximum na 1, kaya ang default na shutdown mode ay nag-e-err-disable sa port.',
        'Sa restrict mode, nananatiling up ang port, ibinabagsak ang intruder at tumataas ang violation counter.',
      ],
      breakIt: 'Itakda ang maximum 2 at ipakitang gumagana na ang dalawang device, saka magsaksak ng pangatlo para ma-trigger ang violation.',
    },
    wrong: W(9, {}),
  },
  'dhcp-snooping': {
    cards: [
      'Nagfi-filter ng DHCP messages ayon sa trust ng port, hinaharang ang rogue servers at bumubuo ng binding table.',
      'ip dhcp snooping · ip dhcp snooping vlan <list> · (interface) ip dhcp snooping trust',
      'Trusted: server at uplinks, puwedeng magpadala ng Offer/ACK. Untrusted (default): hosts, ibinabagsak ang server messages.',
      'show ip dhcp snooping, show ip dhcp snooping binding, show ip dhcp snooping statistics',
      'Atakeng umuubos sa DHCP pool gamit ang pekeng requests; nililimitahan ng rate limiting.',
    ],
    lab: {
      objective: 'I-enable ang DHCP snooping, i-trust ang tamang mga port at ipakitang binabalewala ang rogue DHCP server.',
      steps: [
        'I-configure ang tunay na DHCP server at kumpirmahing nakakakuha ng address ang PC.',
        'Magdagdag ng pangalawang DHCP server sa Fa0/7 na may ibang gateway at obserbahan ang PC na minsan ay kumukuha ng rogue address.',
        'I-enable ang ip dhcp snooping at ip dhcp snooping vlan 10 sa SW1.',
        'I-trust lang ang Gi0/1 gamit ang ip dhcp snooping trust.',
        'I-renew ang PC at kumpirmahing nakakakuha ito ng tunay na address; tingnan ang show ip dhcp snooping binding.',
        'Suriin ang show ip dhcp snooping statistics para sa mga ibinagsak na server message.',
      ],
      checklist: [
        'Tinanggap ang rogue server bago ang snooping',
        'Tunay na server lang ang tinatanggap pagkatapos ng snooping',
        'Ipinapakita ng binding table ang PC',
      ],
      hints: [
        'Kapag nakalimutang i-trust ang port ng tunay na server, haharangan ang lahat.',
        'I-renew ang PC pagkatapos baguhin ang configuration.',
      ],
      solution: [
        'Ibinabagsak ang DHCPOFFER ng untrusted na Fa0/7; trusted ang Gi0/1 kaya gumagana ang tunay na server.',
        'Inililista ng binding table ang MAC ng client, IP, VLAN 10 at Fa0/2.',
      ],
      breakIt: 'Alisin ang trust sa Gi0/1 at panoorin ang lahat ng client na mawalan ng DHCP service.',
    },
    wrong: W(9, {}),
  },
  dai: {
    cards: [
      'Pekeng ARP replies na nilalason ang caches para dumaan ang trapiko sa attacker (man-in-the-middle).',
      'Vina-validate ang ARP sender IP/MAC sa untrusted ports laban sa DHCP snooping binding table; ibinabagsak ang di-valid.',
      'ip arp inspection vlan <list>; uplinks: ip arp inspection trust (pagkatapos ng DHCP snooping).',
      'Gumamit ng ARP access list: arp access-list NAME → permit ip host <ip> mac host <mac>; ip arp inspection filter NAME vlan <n>.',
      'show ip arp inspection vlan <n>, show ip arp inspection interfaces, show ip dhcp snooping binding',
    ],
    lab: {
      objective: 'I-enable ang DHCP snooping at DAI, kumpirmahing gumagana ang mga client, saka magdagdag ng ARP ACL para sa static host.',
      steps: [
        'I-enable ang ip dhcp snooping sa VLAN 10 at i-trust ang Gi0/1; i-renew ang mga client at tingnan ang binding table.',
        'I-enable ang ip arp inspection vlan 10 at i-trust ang Gi0/1 para sa DAI.',
        'Kumpirmahing napi-ping pa rin ng DHCP clients ang gateway; tingnan ang show ip arp inspection vlan 10.',
        'Pansinin na ibinabagsak ang static printer (wala sa binding table).',
        'Gumawa ng ARP ACL para sa printer at ilapat gamit ang ip arp inspection filter.',
        'Kumpirmahing gumagana ang printer at huminto sa pagtaas ang drops.',
      ],
      checklist: [
        'Aktibo ang DAI sa VLAN 10',
        'Hindi apektado ang DHCP clients',
        'Naayos ang printer gamit ang ARP ACL',
      ],
      hints: [
        'Buuin muna ang DHCP snooping binding table sa pamamagitan ng pag-renew ng mga client.',
        'I-trust ang uplink para sa parehong DHCP snooping at DAI.',
      ],
      solution: [
        'Vina-validate ng DAI ang ARP laban sa binding table; nandoon ang DHCP clients, wala ang printer.',
        'Inaayos ito ng arp access-list STATIC-HOSTS permit ip host 192.168.10.50 mac host <MAC ng printer> kasama ang ip arp inspection filter.',
      ],
      breakIt: 'Alisin ang ip arp inspection trust sa Gi0/1 at panoorin ang pagbagsak ng ARP mula sa router.',
    },
    wrong: W(9, {}),
  },
  aaa: {
    cards: [
      'RADIUS: UDP 1812/1813, password lang ang naka-encrypt, pinagsasama ang authN+authZ, network access. TACACS+: TCP 49, naka-encrypt lahat, hiwalay ang AAA, device administration.',
      'Authentication (sino), Authorization (ano ang pinapayagan), Accounting (ano ang ginawa).',
      'aaa new-model · aaa authentication login default group tacacs+ local (gumawa muna ng local user).',
      'Alam, hawak o ikaw mismo; pinagsasama ng MFA ang dalawa o higit pa.',
      'show aaa servers (UP/DEAD) at show running-config | section aaa',
    ],
    lab: {
      objective: 'I-configure ang AAA gamit ang TACACS+/RADIUS server, mag-login gamit ang central user, saka itigil ang server at gamitin ang local fallback.',
      steps: [
        'Sa AAA server, magdagdag ng client para sa R1 na may shared key at gumawa ng user na netadmin.',
        'Sa R1, gumawa ng local user na localadmin, saka aaa new-model.',
        'I-configure ang server (radius-server host o tacacs server) at ang key.',
        'I-configure ang aaa authentication login default group tacacs+ local (o radius) at ilapat sa VTY lines.',
        'Mula sa admin PC, mag-login gamit ang netadmin; kumpirmahing nagtagumpay.',
        'I-off ang AAA server at mag-login gamit ang localadmin para patunayan ang fallback.',
      ],
      checklist: [
        'Nakakapag-login ang central user',
        'Gumagana ang local fallback kapag patay ang server',
        'Ipinapakita ng show aaa servers ang UP saka DEAD',
      ],
      hints: [
        'Gumawa ng local user bago i-enable ang aaa new-model.',
        'Dapat magtugma ang shared key sa server at router.',
      ],
      solution: [
        'Sinusubukan ng method list ang server muna; kung hindi ito sumasagot, local ang gagamitin.',
        'Nagbabago ang show aaa servers mula UP papuntang DEAD kapag itinigil ang server.',
      ],
      breakIt: 'Alisin ang keyword na local sa method list, itigil ang server at obserbahang walang makakapag-login.',
    },
    wrong: W(9, {}),
  },
};

export const BATCH_C = { basic, extra };
