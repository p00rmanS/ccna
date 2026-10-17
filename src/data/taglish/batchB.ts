import type { TaglishExtra, TaglishOverlay } from './index';
import { wrongNotes as W } from './helpers';

const basic: Record<string, TaglishOverlay> = {
  'device-hardening': {
    terms: [
      'Hashed na password para sa privileged EXEC; mas matimbang kaysa enable password.',
      'Lumang privileged EXEC password na naka-store sa clear text; iwasan.',
      'Naglalapat ng mahina at reversible na type 7 encryption sa mga clear-text password sa config.',
      'Ang type 5 ay one-way hash (secret); ang type 7 ay reversible na pagtatago.',
      'Virtual terminal lines para sa remote Telnet/SSH access.',
      'Mensaheng ipinapakita sa login, ginagamit para sa legal na babala.',
      'Nagla-logout ng idle na session pagkatapos ng itinakdang oras.',
      'Switch port na walang device; dapat i-shutdown at ilagay sa unused VLAN.',
    ],
    cli: [
      'Pinoprotektahan ang privileged EXEC gamit ang hashed na password (lumalabas bilang type 5 sa config).',
      'Gumagawa ng local account na naka-hash ang password.',
      'Tinatago ang natitirang clear-text na password gamit ang mahinang type 7 encoding.',
      'Nagpapakita ng legal na babala sa lahat ng kumokonekta; ang # ay delimiter.',
      'Nagla-logout ng idle na console session pagkatapos ng 5 minuto.',
      'Dini-disable ang unused ports at inilalagay sa VLAN 999 para hindi makasali ang rogue device sa network.',
    ],
    verify: [
      'Kung may enable secret at naka-store bilang hash (type 5/8/9).',
      'Mga setting ng console at VTY: login local, exec-timeout at transport input.',
      'Aling mga port ang disabled at anong VLAN ang bawat isa.',
      'Sino ang kasalukuyang naka-login at mula saan.',
    ],
    questions: [
      'Ang enable secret ay nag-iimbak ng password bilang one-way hash at ito ang inirerekomendang command.',
      'Mas matimbang ang enable secret kaysa enable password.',
      'Naglalapat ito ng reversible na type 7 obfuscation, na hindi malakas na proteksyon.',
      'Ginagamit ng login local ang local user database at nililimitahan ng transport input ssh sa SSH.',
      'Ang pag-disable ng unused ports at paglalagay sa unused VLAN ay nagpapaliit ng attack surface.',
      'Dapat magbabala ang banner na restricted at minomonitor ang access, nang hindi naglalantad ng detalye ng device.',
      'Ang lockout (at mahaba, komplikadong password na may MFA) ay nagpapabagal o humihinto sa brute-force.',
      'Binabawasan ng SSH-only na transport at idle timeout ang panganib; ang Telnet at no login ay hindi ligtas.',
      'Mali — ang type 7 ay reversible at madaling i-decode; ang type 5 ay one-way hash.',
    ],
  },
  'acl-fundamentals': {
    terms: [
      'Nakaayos na listahan ng permit at deny na patakaran para mag-filter ng trapiko.',
      'Access control entry: isang linya sa ACL.',
      'Ang nakatagong deny ip any any sa dulo ng bawat ACL.',
      'Kabaligtaran ng subnet mask: 0 ang dapat tumugma, 1 ay binabalewala.',
      'Mga keyword para sa iisang address (0.0.0.0 wildcard) at para sa lahat ng address (255.255.255.255 wildcard).',
      'Direksyon kung saan sinusuri ng ACL ang trapiko sa interface: papasok sa router o palabas.',
      'Ang standard ay source lang; ang extended ay protocol, source, destination at ports.',
      'Numerong nag-aayos at kumikilala sa patakaran, tulad ng 10, 20, 30.',
    ],
    cli: [
      'Unang patakaran: hinaharang ang isang partikular na host. Ang host ay wildcard na 0.0.0.0.',
      'Ikalawang patakaran: pinapayagan ang natitirang /24. Ang wildcard na 0.0.0.255 ay binabalewala ang huling octet.',
      'Inilalapat ang ACL 10 sa Gi0/1 para sa papasok na trapiko. Kung wala ito, walang ginagawa ang ACL.',
      'Ipinapakita ng hit counters kung ilang packet ang tumugma sa bawat patakaran, na tumutulong sa troubleshooting.',
      'Kinukumpirma kung saan at anong direksyon inilapat ang ACL.',
    ],
    verify: [
      'Bawat ACL kasama ang mga patakaran, sequence numbers at match counters.',
      'Aling ACL ang naka-apply na inbound at outbound sa interface.',
      'Ang mga ACL line at ang mga ip access-group command.',
      'Isang ACL lang, kapaki-pakinabang sa named lists.',
    ],
    questions: [
      'Sinusuri ang ACL mula itaas pababa at humihinto sa unang tugma.',
      'Bawat ACL ay may nakatagong implicit deny ng lahat ng trapikong hindi tumugma sa patakaran.',
      'Ang wildcard ay kabaligtaran ng subnet mask: ang 255.255.255.0 ay nagiging 0.0.0.255.',
      'Ang ip access-group <acl> in|out ang naglalapat ng ACL sa interface.',
      'Tumutugma ang any sa bawat address at shorthand ito para sa 0.0.0.0 255.255.255.255.',
      'Walang tumugmang patakaran, kaya hinaharang ito ng implicit deny any.',
      '255 − 192 = 63, kaya ang wildcard ay 0.0.0.63.',
      'Ang una at tumugmang patakaran ang ginagamit at may implicit deny sa dulo; kailangang i-apply ang ACL, at binabalewala ang wildcard 1 bits.',
      'Mali — sinasala ng ACL ang trapikong dumadaan sa router, hindi ang trapikong nagmumula rito.',
    ],
  },
  'standard-acls': {
    terms: [
      'ACL (1–99, 1300–1999 o named) na tumutugma lang sa source IPv4 address.',
      'ACL na ginawa gamit ang ip access-list standard|extended NAME; nae-edit sa pamamagitan ng sequence number.',
      'Ang numero (10, 20, 30...) na nag-aayos ng patakaran at nagpapahintulot na ipasok o burahin ito.',
      'Inilalapat ang ACL sa VTY lines para kontrolin kung sino ang puwedeng magbukas ng remote sessions.',
      'Linya ng komento na nagdodokumento sa ACL.',
      'Standard ACL malapit sa destination; extended ACL malapit sa source.',
    ],
    cli: [
      'Hinaharang ang isang source host. Ang permit any ay nagpapasa sa iba; kung wala, haharangan ng implicit deny ang lahat.',
      'Inilalapat ang ACL 5 outbound sa interface papunta sa mga server: malapit sa destination.',
      'Nagsisimula ng named standard ACL kung saan ang mga entry ay may sequence numbers.',
      'Tahasang huling deny na nagla-log din ng mga hinarang na subok; kapaki-pakinabang para makita kung sino ang sumubok kumonekta.',
      'Nililimitahan ang SSH/Telnet logins sa admin subnet sa pamamagitan ng paglalapat ng ACL sa VTY lines.',
    ],
    verify: [
      'Mga patakaran na may sequence numbers at match counters.',
      'Ang ACL na naka-apply at ang direksyon nito sa interface.',
      'Kung naka-configure ang access-class sa ilalim ng VTY lines.',
      'Ang named list lang.',
    ],
    questions: [
      'Sinasala ng standard ACL ang source IPv4 address lang.',
      'Ang standard ACL ay gumagamit ng 1–99 (at 1300–1999).',
      'Dahil source lang ang tinitingnan, dapat itong malapit sa destination para hindi mahadlangan ang source na iyon sa ibang lugar.',
      'Ang access-class sa ilalim ng VTY lines ang naglalapat ng ACL sa remote sessions.',
      'Ang ip access-list standard NAME ay pumapasok sa named standard ACL configuration mode.',
      'Kapag walang wildcard, ang default ay 0.0.0.0, na kapareho ng host.',
      'Sinusuportahan ng named ACLs ang sequence numbers, kaya ang patakarang may numerong 20 ay maipapasok sa pagitan ng 10 at 30.',
      'Ang standard ACLs ay tumutugma sa source address lang at inilalagay malapit sa destination.',
      'Mali — ang access-class ay para sa VTY lines; ang interfaces ay gumagamit ng ip access-group.',
    ],
  },
  'extended-acls': {
    terms: [
      'ACL (100–199, 2000–2699 o named) na tumutugma sa protocol, source, destination at ports.',
      'Mga port operator: equal, not equal, greater than, less than, range.',
      'TCP keyword na tumutugma sa segments na may ACK o RST, ibig sabihin bahagi ng umiiral na connection.',
      'Opsyon na nagtatala ng syslog message kapag tumugma ang patakaran.',
      'Karaniwang service ports: 80 HTTP, 443 HTTPS, 22 SSH, 23 Telnet, 53 DNS, 21 FTP, 25 SMTP.',
      'Ang extended ACL ay inilalagay hangga’t maaari malapit sa source.',
    ],
    cli: [
      'Hinaharang ang guests mula sa anumang internal na 10.x address. Dapat nauuna ang patakarang ito.',
      'Pinapayagan ang guests na mag-resolve ng pangalan gamit ang DNS; kung wala ito, hindi gagana ang pag-browse.',
      'Pinapayagan ang web browsing lang (HTTP at HTTPS).',
      'Inilapat nang inbound sa guest interface, malapit sa source.',
      'Pinapatunayan ng counters kung aling patakaran ang nagbabagsak o nagpapasa ng trapiko.',
    ],
    verify: [
      'Lahat ng ACL, ang mga patakaran ayon sa ayos at match counters.',
      'Ang ACL at direksyon na naka-apply sa interface.',
      'Isang named ACL lang.',
      'Kung pinapayagan o hinaharang ang trapiko ayon sa mga patakaran.',
    ],
    questions: [
      'Extended ACLs lang ang kayang tumugma sa protocols at port numbers.',
      'Inilalagay ang extended ACLs malapit sa source para hindi tumawid sa network ang mga hinarang na trapiko.',
      'Ang HTTPS ay TCP 443; ang source ay ang LAN at ang destination ay ang host.',
      'Ang range <low> <high> ay tumutugma sa saklaw ng ports, kasama ang magkabilang dulo.',
      'Ang name resolution ay gumagamit ng DNS sa UDP 53; kung wala ito, pumapalya ang pag-browse sa pamamagitan ng pangalan.',
      'Tumutugma ang keyword na ip sa anumang IP traffic; ang ports ay available lang sa tcp at udp.',
      'Ang ip access-list extended NAME ay pumapasok sa named extended ACL configuration.',
      'Ang eq, neq, gt, lt at range ang mga valid na operator.',
      'Totoo — ang unang tugma ang panalo, at ang permit ip any any ay tumutugma sa lahat.',
    ],
  },
};

const extra: Record<string, TaglishExtra> = {
  'device-hardening': {
    cards: [
      'enable secret <password> (mas gusto kaysa enable password).',
      'line vty 0 15 → login local → transport input ssh → exec-timeout 5 0',
      'Naglalapat ng mahina at reversible na type 7 encryption sa clear-text passwords; hindi malakas na seguridad.',
      'banner motd # mensahe #  (legal na babala, walang welcome text)',
      'I-shutdown, itakda sa access mode at ilipat sa unused VLAN.',
    ],
    lab: {
      objective: 'Ilapat ang baseline na hardening checklist sa isang switch at i-verify ang bawat item.',
      steps: [
        'Itakda ang hostname at enable secret sa SW1.',
        'Gumawa ng local user gamit ang username admin secret <password>.',
        'I-configure ang line console 0 na may login local at exec-timeout 5 0.',
        'I-configure ang line vty 0 4 na may login local at transport input ssh (pagkatapos gumawa ng RSA keys).',
        'Idagdag ang service password-encryption at legal-warning na banner motd.',
        'I-shutdown ang Fa0/10 - 24 at ilipat sa VLAN 999, saka patakbuhin ang mga verification command.',
      ],
      checklist: [
        'Lumalabas bilang hash ang enable secret',
        'Kailangan ng login local ang console at VTY',
        'Lumalabas ang banner sa login',
        'Naka-shutdown ang unused ports sa VLAN 999',
      ],
      hints: [
        'Gumawa muna ng RSA key bago subukan ang SSH.',
        'Gamitin ang show running-config | section line para mabilis na suriin ang mga linya.',
      ],
      solution: [
        'Ipinapakita ng show running-config ang enable secret 5, username admin secret 5, at ang mga line settings.',
        'Inililista ng show interfaces status ang Fa0/10 - 24 bilang disabled sa VLAN 999.',
      ],
      breakIt: 'Idagdag din ang enable password cisco at ipakitang matimbang pa rin ang secret, saka alisin.',
    },
    wrong: W(9, {}),
  },
  'acl-fundamentals': {
    cards: [
      'Top-down; ang unang tugma ang panalo; implicit deny any sa dulo.',
      '0 = dapat tumugma, 1 = huwag pansinin. Kabaligtaran ng subnet mask (255.255.255.0 → 0.0.0.255).',
      'interface gi0/1 → ip access-group <acl> in|out',
      'host = iisang address (0.0.0.0 wildcard); any = lahat ng address (0.0.0.0 255.255.255.255).',
      'show access-lists at show ip interface <if>',
    ],
    lab: {
      objective: 'Sumulat ng simpleng ACL, ilapat ito, obserbahan ang implicit deny at ayusin gamit ang permit.',
      steps: [
        'Kumpirmahing napi-ping ng parehong PC ang server.',
        'Gumawa ng access-list 10 deny host 192.168.1.10 at ilapat ito inbound sa R1 Gi0/0.',
        'I-ping ang server mula sa parehong PC; dapat parehong pumalya na (implicit deny).',
        'Patakbuhin ang show access-lists at basahin ang match counters.',
        'Idagdag ang access-list 10 permit any at subukan ulit.',
        'Tiyaking ang PC1 lang ang naharang at nagpapakita ang counters ng deny at permit hits.',
      ],
      checklist: [
        'Naobserbahan ang lahat na naharang pagkatapos ng nag-iisang deny',
        'Naayos gamit ang permit rule',
        'Ang PC1 lang ang naharang sa huli',
      ],
      hints: [
        'Ang mga bagong linya ay idinadagdag sa dulo ng numbered ACL.',
        'Ilapat ang ACL sa interface na pinakamalapit sa trapikong gusto mong i-filter.',
      ],
      solution: [
        'Ang isang deny rule at ang implicit deny ay humaharang sa lahat ng trapiko.',
        'Ang pagdagdag ng permit any pagkatapos ng deny ay nagpapapasok sa PC2 habang nananatiling naharang ang PC1.',
      ],
      breakIt: 'Ilipat ang permit any sa itaas ng deny at makikitang hindi na naharang ang PC1 dahil ang unang tugma ang panalo.',
    },
    wrong: W(9, {}),
  },
  'standard-acls': {
    cards: [
      'Source IPv4 address lang; numero 1–99 at 1300–1999.',
      'Malapit sa destination (ang extended ACL ay malapit sa source).',
      'ip access-list standard NAME → 10 permit ... → 20 deny any',
      'line vty 0 4 → access-class <acl> in',
      'Magdagdag gamit ang sequence number sa pagitan ng umiiral; magbura gamit ang no <sequence number>.',
    ],
    lab: {
      objective: 'Harangan ang isang host mula sa server network gamit ang standard ACL, saka limitahan ang SSH sa admin subnet gamit ang access-class.',
      steps: [
        'Kumpirmahing napi-ping ng PC1 at PC2 ang server network.',
        'Gumawa ng access-list 5 deny host 192.168.10.25 at permit any.',
        'Ilapat ito outbound sa R1 interface papunta sa server network.',
        'Subukan mula sa PC1 (naharang) at PC2 (pinayagan); basahin ang show access-lists.',
        'Gumawa ng named ACL na ADMIN-ONLY na pumapayag sa 192.168.99.0 0.0.0.255.',
        'Ilapat ito gamit ang access-class ADMIN-ONLY in sa ilalim ng line vty 0 4 at subukan ang SSH mula sa PC1 at admin PC.',
      ],
      checklist: [
        'Naharang ang PC1, pinayagan ang PC2 papunta sa mga server',
        'Ipinapakita ng counters ang deny at permit hits',
        'Pinapayagan lang ang SSH mula sa admin subnet',
      ],
      hints: [
        'Ilagay ang ACL sa interface na pinakamalapit sa destination.',
        'Tandaan ang permit any pagkatapos ng deny, kung hindi ay haharangan ang lahat.',
      ],
      solution: [
        'Ang ACL 5 outbound papunta sa mga server ay humaharang lang sa PC1 papunta sa network na iyon.',
        'Inilalapat ng access-class ang named ACL sa VTY lines, kaya ang admin subnet lang ang makakapag-SSH.',
      ],
      breakIt: 'Ilipat ang ACL 5 sa inbound ng PC LAN interface at obserbahang nawawalan ng access ang PC1 sa bawat network, hindi lang sa mga server.',
    },
    wrong: W(9, {}),
  },
  'extended-acls': {
    cards: [
      'Protocol, source, destination at (para sa TCP/UDP) ports. Mga numerong 100–199 at 2000–2699.',
      'Malapit sa source, para agad na ibagsak ang hinarang na trapiko.',
      'permit tcp 192.168.10.0 0.0.0.255 host 10.0.0.50 eq 443',
      'HTTP 80, HTTPS 443, SSH 22, Telnet 23, DNS 53, FTP 21, SMTP 25.',
      'ip access-list extended NAME → 10 deny ... → 20 permit ... → ilapat gamit ang ip access-group NAME in|out',
    ],
    lab: {
      objective: 'Bumuo ng named extended ACL na nagpapahintulot sa guests na mag-browse pero hindi makapasok sa internal network.',
      steps: [
        'Kumpirmahing naaabot ng guest PC ang parehong server bago ang anumang ACL.',
        'Gumawa ng ip access-list extended GUEST-IN na may deny papuntang 10.0.0.0 0.255.255.255 muna.',
        'Magdagdag ng permits para sa udp 53, tcp 80 at tcp 443.',
        'Ilapat ang GUEST-IN inbound sa R1 Gi0/2.',
        'Subukan: mag-browse sa external web server (gumagana), i-ping ang internal server (naharang), telnet (naharang).',
        'Suriin ang counters ng show ip access-lists GUEST-IN at magdagdag ng remark.',
      ],
      checklist: [
        'Hindi maabot ng guest PC ang internal server',
        'Gumagana ang external web browsing',
        'Ipinapakita ng counters ang hits sa deny at permit rules',
      ],
      hints: [
        'Ilapat ang ACL sa interface na pinakamalapit sa guest PC, inbound.',
        'Ilagay ang tiyak na deny sa itaas ng malalawak na permit.',
      ],
      solution: [
        'Mga patakarang 10 (deny ip papuntang 10/8), 20 (permit udp 53), 30 (permit tcp 80), 40 (permit tcp 443) na inilapat inbound sa Gi0/2.',
        'Anumang iba, tulad ng Telnet, ay hinaharang ng implicit deny.',
      ],
      breakIt: 'Alisin ang DNS permit at panoorin ang pagpalya ng web browsing sa pamamagitan ng pangalan habang gumagana pa rin ang access gamit ang IP address.',
    },
    wrong: W(9, {}),
  },
};

export const BATCH_B = { basic, extra };
