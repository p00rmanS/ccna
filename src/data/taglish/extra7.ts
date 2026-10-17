import type { TaglishExtra } from './index';
import { wrongNotes as W } from './helpers';

export const EXTRA7: Record<string, TaglishExtra> = {
  'nat-fundamentals': {
    cards: [
      '10.0.0.0/8, 172.16.0.0/12 (172.16–172.31), 192.168.0.0/16.',
      'Inside local: ang private address ng host. Inside global: ang public address na kumakatawan dito sa labas.',
      'Outside global: ang totoong address ng outside host. Outside local: kung paano ito nakikita ng loob; karaniwang pareho.',
      'ip nat inside (LAN interface) at ip nat outside (internet interface).',
      'show ip nat translations (at show ip nat statistics).',
    ],
    lab: {
      objective: 'Markahan ang inside at outside interfaces, maglapat ng simpleng static rule at tukuyin ang bawat address column.',
      steps: [
        'I-configure ang addresses at default route sa R1 papunta sa ISP.',
        'Markahan ang Gi0/0 ng ip nat inside at ang Gi0/1 ng ip nat outside.',
        'Magdagdag ng static rule: ip nat inside source static 192.168.1.10 203.0.113.6.',
        'Mula sa PC1, i-ping ang 198.51.100.7.',
        'Patakbuhin ang show ip nat translations at lagyan ng label ang bawat column.',
      ],
      checklist: [
        'Namarkahan ang interfaces bilang inside at outside',
        'Nakikita ang translation entry pagkatapos ng ping',
        'Tama ang label ng inside local at inside global',
      ],
      hints: [
        'Kailangan ng ISP side ng pabalik na route papunta sa inside global address.',
        'Gumawa muna ng traffic; lumilitaw lang ang dynamic entries kapag kailangan.',
      ],
      solution: [
        'Ang inside local ay 192.168.1.10 at ang inside global ay 203.0.113.6.',
        'Kung walang ip nat inside, nananatiling walang laman ang table.',
      ],
      breakIt: 'Alisin ang ip nat outside sa Gi0/1 at tingnan ang pagtigil ng translation.',
    },
    wrong: W(8, {
      0: { 0: 'Public ang 172.32.', 2: 'Public ang 11.0.0.0/8.', 3: 'Iyon ay APIPA, hindi RFC 1918.' },
      1: { 0: 'Hindi nag-eencrypt ang NAT.', 2: 'Nagdaragdag ito ng processing, hindi bilis.', 3: 'Ang DHCP ang nag-a-assign ng address; ang NAT ay nagta-translate.' },
      2: { 0: 'Iyon ang inside local address.', 2: 'Ang server ay outside host.', 3: 'Hindi bahagi ng depinisyong ito ang gateway.' },
      3: { 0: 'Iyon ay para sa interface na nakaharap sa public.', 2: 'Hindi valid na IOS syntax.', 3: 'Hindi valid na IOS syntax.' },
      4: { 0: 'Hindi valid na IOS syntax.', 2: 'Hindi valid na IOS syntax.', 3: 'Hindi valid na IOS syntax.' },
      5: { 1: 'Iyan ang naglalarawan sa global.', 2: 'Walang kaugnayan sa link-local addressing.', 3: 'Walang kaugnayan sa loopback.' },
    }),
  },
  'nat-static-dynamic': {
    cards: [
      'ip nat inside source static <inside local> <inside global>',
      '1) access-list na pumapayag sa inside hosts; 2) ip nat pool NAME start end netmask; 3) ip nat inside source list N pool NAME.',
      'Nagamit na ang lahat ng public address sa pool, kaya hindi na matatranslate ang mga karagdagang inside host.',
      'clear ip nat translation *',
      'Static NAT, dahil kailangan ng outside hosts ng permanenteng address para makapagsimula ng koneksyon.',
    ],
    lab: {
      objective: 'I-publish ang inside server gamit ang static NAT, bigyan ang users ng dynamic pool na tatlong address at panoorin itong maubos.',
      steps: [
        'Markahan ang LAN interface ng R1 ng ip nat inside at ang ISP interface ng ip nat outside.',
        'Magdagdag ng static NAT para sa inside server papuntang 203.0.113.9 at subukan mula sa outside host.',
        'Gumawa ng ACL 1 na pumapayag sa LAN, isang pool na tatlong address at ip nat inside source list 1 pool PUBLIC.',
        'I-ping ang outside server mula sa PC1, PC2 at PC3 at tingnan ang show ip nat translations.',
        'Mag-ping mula sa PC4 at obserbahan ang pagpalya; tingnan ang show ip nat statistics para sa misses.',
        'Patakbuhin ang clear ip nat translation * at subukan ulit ang PC4.',
      ],
      checklist: [
        'Nakikita ang static entry at naaabot mula sa labas',
        'Nalikha ang tatlong dynamic entry',
        'Nagawang muli ang pool exhaustion',
        'Nakabawi gamit ang clear ip nat translation *',
      ],
      hints: [
        'Kailangan ng ISP ng routes papunta sa pool at static addresses.',
        'Gumamit ng wildcard masks sa ACL.',
      ],
      solution: [
        'Nananatili ang static mapping pagkatapos mag-clear; inaalis ang dynamic entries.',
        'Pumapalya ang PC4 dahil tatlong address na ang nakalaan.',
      ],
      breakIt: 'Palitan ang ACL para payagan ang ibang subnet at panoorin ang pagtigil ng dynamic translation habang gumagana pa rin ang static.',
    },
    wrong: W(8, {
      0: { 0: 'Pansamantala ang dynamic mappings.', 2: 'Ang PAT ay nagbabahagi ng isang address sa maraming host.', 3: 'Ang NAT64 ay nagta-translate sa pagitan ng IPv6 at IPv4.' },
      1: { 1: 'Kulang ang "inside source".', 2: 'Hindi valid na IOS syntax.', 3: 'Ang pool ay nagtatakda ng range, hindi static mapping.' },
      2: { 1: 'Hindi valid na IOS syntax.', 2: 'Hindi valid na IOS syntax.', 3: 'Hindi nagtatakda ang ACL ng mga address na pagta-translate-an.' },
      3: { 0: 'Hindi nagfi-filter ng traffic ang NAT ACLs.', 2: 'Ang pool ang gumagawa niyan.', 3: 'Ang ip nat outside ang gumagawa niyan.' },
      4: { 0: 'Gawi iyon ng PAT ang pagbabahagi.', 2: 'Hindi nag-iimbento ng address ang routers.', 3: 'Walang awtomatikong paglipat.' },
      5: { 1: 'Hindi valid na IOS syntax.', 2: 'Inaalis niyan ang configuration, hindi ang entries.', 3: 'Hindi valid na IOS syntax.' },
    }),
  },
  'pat-overload': {
    cards: [
      'Maraming inside host ang nagbabahagi ng isang inside global address, pinagkakaiba ng port numbers (NAT overload).',
      'ip nat inside source list 1 interface gi0/1 overload',
      'ip nat inside source list 1 pool NAME overload',
      'Static: permanenteng isa-sa-isa. Dynamic: pool, isa-sa-isa. PAT: maraming-sa-isa gamit ang ports.',
      'Nagbabahagi ng isang inside global address ang ilang inside local host na magkakaiba ang port numbers.',
    ],
    lab: {
      objective: 'Papagbahagiin ng isang public address ang apat na PC gamit ang interface overload.',
      steps: [
        'Markahan ang Gi0/0 ng ip nat inside at ang Gi0/1 ng ip nat outside; magdagdag ng default route papuntang ISP.',
        'Gumawa ng ACL 1 na pumapayag sa 192.168.1.0 0.0.0.255.',
        'I-configure ang ip nat inside source list 1 interface gi0/1 overload.',
        'Mag-browse sa web server mula sa lahat ng apat na PC.',
        'Patakbuhin ang show ip nat translations at kumpirmahin ang isang inside global address na may ilang port.',
        'Alisin ang overload, ulitin, at pansinin na pumapalya ang translation.',
      ],
      checklist: [
        'Naaabot ng lahat ng PC ang server sa pamamagitan ng iisang public address',
        'Nagpapakita ang translations ng magkakaibang port numbers',
        'Naobserbahan ang pagpalya kapag walang overload',
      ],
      hints: [
        'Gumamit ng wildcard mask sa ACL.',
        'Gumawa ng traffic bago tingnan ang table.',
      ],
      solution: [
        'Ibinabahagi ng interface overload ang 203.0.113.5 sa lahat ng host.',
        'Nag-iiba ang port numbers sa bawat connection.',
      ],
      breakIt: 'Ipagpalit ang inside at outside na label ng interface at panoorin ang tuluyang paghinto ng translation.',
    },
    wrong: W(8, {
      0: { 0: 'Hindi ginagamit ang MAC addresses sa NAT.', 2: 'Layer 2 ang VLAN IDs.', 3: 'Walang kaugnayan ang TTL.' },
      1: { 1: 'Ang pool ay nagtatakda ng mga address.', 2: 'Ang static ay lumilikha ng nakapirming isa-sa-isang mappings.', 3: 'Hindi NAT keyword dito.' },
      2: { 1: 'Syntax iyan ng static NAT.', 2: 'Mali ang pagtatakda niyan ng pool.', 3: 'Iyan ay outside source NAT.' },
      3: { 1: 'Hindi routing ang isyu.', 2: 'Hindi nililimitahan ng ACL ang iisang host.', 3: 'Hindi nagpapahintulot ng sharing ang mask.' },
      4: { 0: 'Inilalarawan niyan ang isa-sa-isang NAT.', 2: 'Hindi PAT ang static entries.', 3: 'Palaging umiiral ang column.' },
      5: { 1: 'Hindi nag-eencrypt ang NAT.', 2: 'Kailangan pa rin ng ACL.', 3: 'Walang kaugnayan sa IPv6.' },
    }),
  },
  ntp: {
    cards: [
      'Nagsi-synchronise ng orasan ng mga device. UDP port 123.',
      'Layo mula sa reference clock. Mas mababa ay mas malapit at mas gusto; ang 16 ay unsynchronised.',
      'ntp server <ip address> (global configuration)',
      'ntp master [stratum] (default stratum 8)',
      'show ntp status at show ntp associations (minamarkahan ng * ang napiling source).',
    ],
    lab: {
      objective: 'Gawing NTP source ang R1, i-synchronise ang dalawang client at basahin ang stratum numbers.',
      steps: [
        'I-address ang lahat ng router at kumpirmahing napi-ping nila ang isa’t isa.',
        'Sa R1, patakbuhin ang ntp master 3.',
        'Sa R2 at R3, patakbuhin ang ntp server 10.0.0.1.',
        'Maghintay ng ilang minuto, saka patakbuhin ang show ntp status sa R2 at R3.',
        'Patakbuhin ang show ntp associations at hanapin ang asterisk.',
        'Itala ang stratum ng R2 at R3 at ipaliwanag kung bakit 4 ito.',
      ],
      checklist: [
        'Nagpapakita ang mga client ng Clock is synchronized',
        'Stratum 4 sa parehong client',
        'Natukoy ang * source sa associations table',
      ],
      hints: [
        'Hindi agad ang synchronisation; maghintay ng ilang minuto.',
        'Kung nananatiling unsynchronised, i-ping muna ang master.',
      ],
      solution: [
        'Ang R1 ang source sa stratum 3; ang mga client ay isang layer sa ibaba sa stratum 4.',
        'Minamarkahan ng * ang napiling server.',
      ],
      breakIt: 'I-shutdown ang R1 Gi0/0 at panoorin ang mga client na unti-unting maging unsynchronised, saka ibalik.',
    },
    wrong: W(9, {
      0: { 0: 'Hindi TCP ang NTP.', 2: 'Ang UDP 161 ay SNMP.', 3: 'Ang TCP 22 ay SSH.' },
      1: { 0: 'Walang epekto ang oras sa bilis ng link.', 2: 'Walang kaugnayan ang DNS.', 3: 'Iyon ay DHCP.' },
      2: { 0: 'Mas mataas kaysa sa mas magandang opsyon.', 2: 'Ang mas mataas na stratum ay mas malayo sa source.', 3: 'Ang stratum 16 ay unsynchronised.' },
      3: { 0: 'Ang ntp master ay kumukuha ng stratum number, hindi address.', 2: 'Hindi valid na IOS syntax.', 3: 'Iyon ay nagtatakda ng orasan nang manu-mano.' },
      4: { 0: 'Iyon ang ntp server.', 2: 'Nag-e-enable ito, hindi nagda-disable.', 3: 'Iyon ang clock timezone.' },
      5: { 0: 'Tumataas ang stratum numbers, hindi bumababa, habang lumalayo sa source.', 1: 'Hindi ito puwedeng magkapareho sa source nito.', 3: 'Ang stratum 16 ay unsynchronised.' },
      6: { 1: 'Nagpapakita iyon ng routes.', 2: 'Nagpapakita iyon ng VLANs.', 3: 'Hindi valid na IOS syntax.' },
    }),
  },
  snmp: {
    cards: [
      'UDP 161 para sa requests ng manager; UDP 162 para sa traps at informs.',
      'Ang Manager (NMS) ay nagpo-poll at nakikinig; ang agent ay tumatakbo sa device; ang MIB ay puno ng managed objects na kinikilala ng OIDs.',
      'Parehong notification mula agent papuntang manager; ang inform ay may acknowledgement, ang trap ay wala.',
      'v1 at v2c: plain-text na community string. v3: authentication (MD5/SHA) at encryption (DES/AES).',
      'snmp-server community <string> RO; snmp-server host <ip> version 2c <string>; snmp-server enable traps.',
    ],
    lab: {
      objective: 'Mag-configure ng SNMP community at trap host sa switch, saka obserbahan ang bad community names.',
      steps: [
        'Bigyan ang SW1 ng management address na 10.0.0.2 sa VLAN 1 at kumpirmahing napi-ping nito ang PC.',
        'I-configure ang snmp-server community CCNAlab RO.',
        'I-configure ang snmp-server host 10.0.0.50 version 2c CCNAlab at snmp-server enable traps.',
        'Gumamit ng SNMP tool o MIB browser ng Packet Tracer na may community na CCNAlab at basahin ang sysName.',
        'Ulitin gamit ang maling community at patakbuhin ang show snmp para makita ang pagtaas ng Bad community names.',
      ],
      checklist: [
        'Gumagana ang SNMP read gamit ang tamang community',
        'Tumaas ang bad community names gamit ang mali',
        'Naka-configure ang traps papunta sa NMS',
      ],
      hints: [
        'Simulan sa pagpapatunay ng IP connectivity bago i-debug ang SNMP.',
        'Case sensitive ang community strings.',
      ],
      solution: [
        'Ibinabalik ng tamang community ang value; ang mali ay tinatanggihan at binibilang.',
        'Kailangan ang snmp-server enable traps para makagawa ng trap.',
      ],
      breakIt: 'Palitan ang community sa switch ng ibang string at panoorin ang NMS na mawalan ng access.',
    },
    wrong: W(9, {
      0: { 0: 'Iyon ay DHCP.', 2: 'Iyon ay DNS.', 3: 'Iyon ay NTP.' },
      1: { 0: 'Ginagamit ang 161 para sa requests ng manager.', 2: 'Ang 514 ay syslog.', 3: 'Ang 123 ay NTP.' },
      2: { 0: 'Iyon ang community string.', 2: 'Iyon ang NMS/manager.', 3: 'Ang traps ay notifications, hindi ang database.' },
      3: { 0: 'Gumagamit ang v1 ng plain-text na community string.', 1: 'Plain text din ang v2c.', 3: 'Ang v3 lang ang may mga ito.' },
      4: { 0: 'Feature ng v3 ang encryption, hindi ang trap vs inform.', 2: 'Parehong ipinapadala ng agent.', 3: 'UDP pa rin ang gamit ng informs.' },
      5: { 1: 'Ang NMS ay panig ng manager.', 2: 'Ang trap ay mensahe.', 3: 'Ang OID ay address ng object.' },
      6: { 0: 'Hindi binibilang ng duplex issue ang bad communities.', 2: 'Walang kaugnayan ang NTP.', 3: 'Hindi nakakaapekto ang VLANs sa SNMP authentication.' },
    }),
  },
  syslog: {
    cards: [
      'UDP 514.',
      '0 emergencies, 1 alerts, 2 critical, 3 errors, 4 warnings, 5 notifications, 6 informational, 7 debugging.',
      'Nagla-log ang device ng mga mensaheng may severity na 0 hanggang N.',
      'logging host <ip>, saka logging trap <level>.',
      'Facility LINK, severity 3 (errors), mnemonic UPDOWN.',
    ],
    lab: {
      objective: 'Gumawa ng link up/down na mensahe, basahin ang severity nila at palitan ang logging threshold.',
      steps: [
        'I-enable ang timestamps: service timestamps log datetime msec.',
        'I-configure ang logging buffered 8192 informational at logging host 10.0.0.60.',
        'I-shutdown at i-enable ulit ang isang interface para makagawa ng mga mensahe.',
        'Patakbuhin ang show logging at hanapin ang severity number sa %LINK-3-UPDOWN.',
        'Itakda ang logging trap errors at ulitin; itala kung aling mensahe ang nakararating pa rin sa server.',
        'Palitan sa logging trap debugging at itala ang karagdagang mensahe.',
      ],
      checklist: [
        'Nabasa ang facility, severity at mnemonic mula sa mensahe',
        'Nakita ang mga mensaheng nakaimbak sa buffer',
        'Naobserbahan ang epekto ng pagbabago ng logging trap',
      ],
      hints: [
        'Ang pagbabago ng interface state ay lumalabas bilang severity 3 (updown) at 5 (line protocol).',
        'Habang mas mababa ang threshold number, mas kaunti ang mensahe.',
      ],
      solution: [
        'Ang %LINK-3-UPDOWN ay facility LINK, severity 3, mnemonic UPDOWN.',
        'Ang trap threshold na errors ay nagpapadala lang ng severity 0 hanggang 3.',
      ],
      breakIt: 'Itakda ang logging trap emergencies at pansinin na huminto ang server sa pagtanggap ng link messages.',
    },
    wrong: W(9, {
      0: { 0: 'Ang 7 ay debugging, ang pinakamagaan.', 2: 'Ang 3 ay errors.', 3: 'Ang 5 ay notifications.' },
      1: { 0: 'Ang 161 ay SNMP.', 2: 'Ang 123 ay NTP.', 3: 'Ang 67 ay DHCP server.' },
      2: { 0: 'Ang 2 ay critical.', 1: 'Ang 3 ay errors.', 3: 'Ang 5 ay notifications.' },
      3: { 0: 'Kasama sa threshold ang lahat ng mas seryosong level.', 2: 'Binabaligtad niyan ang scale.', 3: 'Kailangan ng level 7 para sa lahat ng level.' },
      4: { 0: 'Pinangalanan ang interface sa teksto.', 2: 'Walang kaugnayan ang VLANs.', 3: 'Wala ang bilang sa code.' },
      5: { 1: 'Hindi valid na IOS syntax.', 2: 'Hindi valid na IOS syntax.', 3: 'Kino-configure niyan ang SNMP trap receiver.' },
      6: { 1: 'Hindi valid na IOS syntax.', 2: 'Hindi valid na IOS syntax.', 3: 'Ipinapakita niyan ang command history.' },
    }),
  },
  ssh: {
    cards: [
      'SSH TCP 22 (naka-encrypt); Telnet TCP 23 (clear text).',
      'crypto key generate rsa modulus 2048 (kailangan muna ng hostname at ip domain-name).',
      'line vty 0 4 → login local → transport input ssh',
      'ip ssh version 2',
      'show ip ssh (naka-enable at version) at show ssh (mga aktibong session).',
    ],
    lab: {
      objective: 'I-enable ang SSH kasama ng mga kinakailangan, kumonekta mula sa PC at kumpirmahing naharang ang Telnet.',
      steps: [
        'I-address ang R1 at PC1 at kumpirmahing gumagana ang ping.',
        'Itakda ang hostname R1 at ip domain-name lab.local, saka crypto key generate rsa modulus 2048.',
        'Gumawa ng username admin secret <password> at itakda ang ip ssh version 2.',
        'I-configure ang line vty 0 4 na may login local at transport input telnet ssh; subukan ang Telnet at SSH mula sa PC1.',
        'Palitan sa transport input ssh at kumpirmahing tinatanggihan na ang Telnet.',
        'Patakbuhin ang show ip ssh at show ssh.',
      ],
      checklist: [
        'Nagtatagumpay ang SSH connection mula sa PC1',
        'Tinanggihan ang Telnet pagkatapos ng transport input ssh',
        'Nag-uulat ang show ip ssh ng version 2.0',
      ],
      hints: [
        'Kung pumalya ang key generation, suriin ang hostname at domain name.',
        'Sa Packet Tracer, gamitin ang command prompt ng PC: ssh -l admin 10.0.0.1.',
      ],
      solution: [
        'Kailangan ng key ang hostname at domain name.',
        'Kinukumpleto ng login local at transport input ssh ang VTY setup.',
      ],
      breakIt: 'Palitan ang login local ng login at panoorin ang paghinto ng SSH username prompt.',
    },
    wrong: W(9, {
      0: { 0: 'Hindi naka-encrypt ang Telnet.', 2: 'Ang HTTP ay web traffic na hindi naka-encrypt.', 3: 'Naglilipat ng file ang TFTP nang walang encryption.' },
      1: { 0: 'Ang 21 ay FTP.', 2: 'Ang 23 ay Telnet.', 3: 'Ang 443 ay HTTPS.' },
      2: { 1: 'Hindi valid na IOS syntax.', 2: 'Hindi valid na IOS syntax.', 3: 'Hindi valid na IOS syntax.' },
      3: { 0: 'Walang kaugnayan ang routes sa paglikha ng key.', 2: 'Walang kaugnayan ang VLANs.', 3: 'Walang kaugnayan ang NTP sa paglikha ng key.' },
      4: { 1: 'Kinokontrol niyan ang palabas na session.', 2: 'Hindi valid na IOS syntax.', 3: 'Naglalapat ang access-class ng ACL.' },
      5: { 1: 'Ang encryption ay nanggagaling sa RSA keys.', 2: 'Nakapirmi ang port sa 22.', 3: 'Iyon ang ginagawa ng transport input ssh.' },
      6: { 1: 'Hindi gagawing disabled ng routing ang SSH.', 2: 'Walang kaugnayan ang VLANs.', 3: 'Walang kaugnayan ang NAT.' },
    }),
  },
};
