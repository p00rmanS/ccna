import type { Lesson } from '../types';

/**
 * "Tandaan sa exam" cards: the short facts that most often turn up in 200-301 questions, one block per lesson.
 * They are inserted just before the lesson's Exam tips list when the data loads.
 */
export const REMEMBER: Record<string, string[]> = {
  'what-is-a-network': [
    'Ang **end device** ay **pinanggagalingan o pupuntahan** ng data; ang **intermediate device** ay **nagpapasa** lang.',
    '**Client at server ay papel**, hindi hardware: **isang PC ay puwedeng pareho**.',
    '**Physical topology** = cabling; **logical topology** = daloy ng data.',
  ],
  'network-devices': [
    '**Router = Layer 3** (IP); **Layer 2 switch = MAC**; **Layer 3 switch = pareho**.',
    '**Firewall** = policy; **IPS** = **inline** na humaharang ng atake; **IDS** = nag-aalerto lang.',
    '**PoE** = kuryente at data sa **iisang cable**. **WLC** = namamahala ng maraming **lightweight AP**.',
    '**show ip interface brief** = pinakamabilis na buod ng bawat interface.',
  ],
  'lan-vs-wan': [
    '**LAN** = isang site, isang may-ari. **WAN** = malayong distansya, gamit ang **provider**.',
    '**WLAN ay LAN na wireless** — hindi WAN.',
    '**Intranet** = pribado; **internet** = pandaigdigan.',
  ],
  'ios-fundamentals': [
    '**> = user EXEC**, **# = privileged EXEC**, **(config)# = global config**, **(config-if)# = interface**.',
    '**running-config sa RAM**, **startup-config sa NVRAM**; **copy run start** para i-save.',
    '**end / Ctrl+Z** = diretso pabalik sa privileged EXEC; **exit** = isang level lang.',
    '**do show** = patakbuhin ang show command mula sa config mode.',
    'Console default: **9600 8N1**, walang flow control.',
  ],
  'osi-model': [
    '**7 layers pababa: All People Seem To Need Data Processing** (Application → Physical).',
    '**PDU**: Layer 4 **segment**, Layer 3 **packet**, Layer 2 **frame**, Layer 1 **bits**.',
    '**Router = L3, Switch = L2, Hub = L1.** **MAC = L2, IP = L3, Port = L4.**',
    '**Bottom-up troubleshooting** = Layer 1 muna (cable, port, power).',
  ],
  'tcpip-model': [
    '**TCP/IP: Application (5-7), Transport, Internet, Network Access (1-2).**',
    '**TCP** = reliable (SYN, SYN-ACK, ACK); **UDP** = mabilis, walang garantiya.',
    '**Ports**: HTTP 80, HTTPS 443, SSH 22, Telnet 23, DNS 53, **DHCP 67/68**, TFTP 69, NTP 123, SNMP 161/162, syslog 514.',
    'Ang **DNS** ay karamihan **UDP 53** (TCP 53 para sa malalaking sagot).',
  ],
  ethernet: [
    '**Ethernet II frame**: dst MAC, src MAC, **EtherType**, data, **FCS**. Laki: **64-1518 bytes**.',
    '**EtherType**: IPv4 **0x0800**, ARP **0x0806**, IPv6 **0x86DD**.',
    '**Switch port = sariling collision domain**; **VLAN/router = hangganan ng broadcast domain**.',
    '**Duplex mismatch** = late collisions + CRC errors habang gumagana pa ang ping.',
  ],
  'mac-addresses': [
    '**MAC = 48 bits = 12 hex digits**; **OUI = unang 24 bits**.',
    '**FF:FF:FF:FF:FF:FF** = broadcast; **01:00:5E** = IPv4 multicast; **33:33** = IPv6 multicast.',
    '**Cisco format: 0000.0c12.3456** (3 grupo ng 4).',
    'Sa bawat router hop, **nagbabago ang MAC pero hindi ang IP**.',
  ],
  'switch-mac-learning': [
    '**Natututo sa SOURCE MAC, nagpapasya gamit ang DESTINATION MAC.**',
    '**Unknown unicast at broadcast = flood** sa lahat ng port sa VLAN maliban sa pinanggalingan.',
    '**Aging time = 300 segundo**.',
    '**show mac address-table** at **clear mac address-table dynamic**.',
  ],
  'cabling-physical': [
    '**UTP max = 100 m**. **Magkaibang device = straight-through; magkatulad = crossover.**',
    '**Single-mode** = laser, kilometro; **multimode** = LED, daan-daang metro.',
    '**Auto-MDIX** ay kusang nag-aayos ng pares ng cable.',
    '**Runt < 64 B**, **giant > 1518 B**; **CRC** = sirang frame.',
    '**err-disabled** = isinara ng protection feature; **shutdown/no shutdown** para bumawi.',
  ],
  'binary-basics': [
    '**128 64 32 16 8 4 2 1** — kabisaduhin.',
    '**Valid mask octets**: 0, 128, 192, 224, 240, 248, 252, 254, 255.',
    '**2^8 = 256, 2^10 = 1024, 2^16 = 65,536.**',
    'Ang **AND** ng address at mask = **network address**.',
  ],
  'ipv4-fundamentals': [
    '**Usable hosts = 2^h − 2.** **Network = host bits 0; broadcast = host bits 1.**',
    '**Private**: 10/8, 172.16/12 (172.16-172.31), 192.168/16. **APIPA = 169.254/16**.',
    '**Loopback 127.0.0.0/8.** **Router interface ay nagsisimulang shutdown.**',
    'Ang **host ay nagpapadala ng remote traffic sa default gateway** (MAC ng gateway, IP ng destination).',
  ],
  'subnetting-from-zero': [
    '**Block size = 256 − mask value** sa interesting octet.',
    '**Broadcast = susunod na network − 1.**',
    '**Gateway ay dapat nasa loob ng subnet ng host.**',
    '**/25 128, /26 64, /27 32, /28 16, /29 8, /30 4** (block size).',
  ],
  vlsm: [
    '**Pinakamalaking requirement muna.** **Bawat block ay nagsisimula sa multiple ng sarili nitong laki.**',
    '**Requirement + 2, i-round up sa power of two.**',
    '**/30 = dalawang usable host** — ginagamit sa router-to-router link.',
    '**Overlap = pagkakamali sa plano**; sinasabi ng router: "overlaps with".',
  ],
  'ipv6-fundamentals': [
    '**IPv6 = 128 bits = 8 grupo ng 16 bits.** **"::" isang beses lang**.',
    '**Alisin ang leading zeros muna, saka palitan ang pinakamahabang hanay ng zero ng ::.**',
    '**Walang broadcast** sa IPv6 — **multicast**. **NDP (ICMPv6) ang pamalit sa ARP.**',
    '**/64 = 64 network + 64 interface ID.** **2001:db8::/32** = documentation.',
  ],
  'ipv6-address-types': [
    '**Global unicast 2000::/3; link-local FE80::/10; unique local FC00::/7; multicast FF00::/8.**',
    '**::1 = loopback; :: = unspecified.** **ff02::1 all nodes, ff02::2 all routers.**',
    '**EUI-64**: ipasok ang **FFFE** sa gitna ng MAC at **baligtarin ang ika-7 bit** (00 → 02).',
    'Ang interface ay may **link-local** at **global/ULA** nang sabay.',
  ],
  vlans: [
    '**VLAN = broadcast domain.** **Default VLAN = 1**; **hindi mabubura ang 1 at 1002-1005**.',
    '**Normal range 1-1005**; **extended 1006-4094**. Nasa **vlan.dat** sa flash.',
    '**switchport mode access + switchport access vlan N.**',
    '**Kapag nabura ang VLAN, nananatili ang port dito at nagiging inactive** (hindi lumilipat sa VLAN 1).',
    '**Hindi nagro-route ang Layer 2 switch** sa pagitan ng VLAN.',
  ],
  trunking: [
    '**802.1Q tag = 4 bytes**; **native VLAN = untagged** (default 1).',
    '**Native VLAN mismatch**: up pa rin ang trunk pero **tumatagas** ang trapiko; may CDP message.',
    '**switchport trunk allowed vlan add N** (hindi papalitan ang listahan); **walang "add" = palitan lahat**.',
    '**DTP**: auto + auto = access; **desirable + auto = trunk**. **show interfaces trunk** ang verification.',
  ],
  'inter-vlan-routing': [
    '**Router-on-a-stick**: trunk papunta sa router; **subinterface kada VLAN**; **encapsulation dot1q N bago ang ip address**.',
    '**Gateway ng PC = IP ng subinterface/SVI ng sarili niyang VLAN.**',
    '**Layer 3 switch**: **ip routing + interface vlan N** (SVI).',
    '**Hindi puwedeng up ang subinterface kapag down ang physical interface.**',
  ],
  'why-stp': [
    '**Walang TTL ang Ethernet**, kaya **walang katapusan ang loop**.',
    '**Loop = broadcast storm + MAC flapping + duplicate frames.**',
    '**Cisco default = PVST+** (isang STP instance kada VLAN).',
  ],
  'stp-fundamentals': [
    '**Root bridge = pinakamababang bridge ID** (priority muna, saka MAC). **Default priority 32768.**',
    '**Cost**: 10M=100, 100M=19, 1G=4, 10G=2. **Lahat ng port ng root ay designated.**',
    '**PVST+ priority = priority + VLAN ID** (32768 + 10 = 32778).',
    '**Blocking → Listening → Learning → Forwarding** (~50 segundo).',
    '**Tie-breakers sa root port**: cost, sender bridge ID, sender port priority, sender port number.',
  ],
  'rapid-pvst': [
    '**Rapid PVST+ = 802.1w (RSTP)**; **states: Discarding, Learning, Forwarding**.',
    '**Bagong roles: Alternate at Backup**. **Edge port = PortFast**.',
    '**spanning-tree mode rapid-pvst** — **pareho dapat sa dalawang switch** para sa mabilis na handshake.',
    '**Point-to-point (full-duplex)** lang ang kwalipikado sa mabilis na proposal/agreement.',
  ],
  'stp-protection': [
    '**PortFast + BPDU Guard** sa host port; **Root Guard + Loop Guard** sa uplink.',
    '**BPDU Guard → err-disabled**; **Root Guard → root-inconsistent**; **Loop Guard → loop-inconsistent**.',
    '**BPDU Filter = tinatago ang BPDU** (delikado), hindi pareho ng Guard.',
    '**Hindi kailanman PortFast sa trunk o switch-to-switch uplink.**',
  ],
  etherchannel: [
    '**LACP = active/passive (802.3ad, open)**; **PAgP = desirable/auto (Cisco)**; **on = static**.',
    '**passive-passive at auto-auto = hindi mag-bu-bundle**. **LACP at PAgP ay hindi magkasundo.**',
    '**Dapat magkapareho**: speed, duplex, trunk mode, native/allowed VLAN.',
    '**show etherchannel summary: SU = Layer 2 in use, P = bundled, s = suspended**.',
  ],
  'cdp-lldp': [
    '**CDP = Cisco, naka-ON; LLDP = IEEE 802.1AB, naka-OFF** bilang default.',
    '**CDP 60s/180s; LLDP 30s/120s.** **Isang hop lang** ang abot.',
    '**no cdp run (global) vs no cdp enable (interface)**; **lldp run**.',
    '**show cdp neighbors detail** = nagbibigay ng **IP address ng kapitbahay** (security concern).',
  ],
  'dhcp-fundamentals': [
    '**DORA**: Discover, Offer, Request, Acknowledge. **UDP 67 server, 68 client.**',
    '**169.254.x.x = APIPA = walang DHCP na sumagot.**',
    '**Renew sa 50% (T1) unicast; 87.5% (T2) broadcast.**',
    '**ip address dhcp** = router interface bilang DHCP client.',
  ],
  'dhcp-server-relay': [
    '**ip dhcp excluded-address** ay **global command**; **network, default-router, dns-server** ay nasa pool.',
    '**Hindi nagpapasa ng broadcast ang router** → **ip helper-address** sa **client-facing interface**, na nakaturo sa **server**.',
    '**show ip dhcp binding** = mga lease.',
  ],
  dns: [
    '**A = IPv4, AAAA = IPv6, CNAME = alias, MX = mail, NS = name server, PTR = reverse.**',
    '**Ping IP gumagana pero pangalan hindi = DNS problem.**',
    '**ip name-server, ip domain-lookup, ip domain-name** sa router.',
  ],
  'nat-fundamentals': [
    '**Inside local = private na address ng host; inside global = public na address niya.**',
    '**Local = sa paningin ng loob; Global = sa paningin ng labas.**',
    '**ip nat inside** (LAN) at **ip nat outside** (internet) — **hindi sapat nang mag-isa**.',
    '**172.16.0.0/12 = 172.16 hanggang 172.31 lang.**',
  ],
  'nat-static-dynamic': [
    '**Static = isa-sa-isa, permanente, para sa server.** **Dynamic = pool, isa-sa-isa din.**',
    '**Dynamic NAT = ACL + pool + ip nat inside source list N pool NAME.**',
    '**Ang ACL sa NAT ay pumipili lang kung sino ang ita-translate** (hindi firewall).',
    '**Pool exhaustion** = lahat ng address ay nagamit na.',
  ],
  'pat-overload': [
    '**PAT = NAT overload = maraming host, isang address, magkaibang port.**',
    '**ip nat inside source list 1 interface gi0/1 overload.**',
    '**Kapag walang "overload", dynamic NAT na iyon.**',
    'Sa **show ip nat translations**, ang inside global ay may **address:port**.',
  ],
  ntp: [
    '**NTP = UDP 123.** **Stratum: mas mababa = mas malapit sa totoong orasan.**',
    '**ntp server = client; ntp master = pinagmulan** (default stratum 8).',
    '**Stratum 16 = unsynchronised.** **show ntp status / associations.**',
  ],
  snmp: [
    '**UDP 161 = tanong ng manager (GET/SET); UDP 162 = trap ng agent.**',
    '**Trap = walang ack; inform = may ack.**',
    '**v1/v2c = plain-text community; v3 = authentication + encryption (authPriv).**',
    '**MIB = puno ng objects; OID = address ng isang object.**',
  ],
  syslog: [
    '**0 Emergencies, 1 Alerts, 2 Critical, 3 Errors, 4 Warnings, 5 Notifications, 6 Informational, 7 Debugging.**',
    '**Threshold N = levels 0 hanggang N.** **UDP 514.**',
    'Sa **%LINK-3-UPDOWN**, ang **gitnang numero (3)** ang severity.',
    '**logging host <ip>** at **logging trap <level>**.',
  ],
  ssh: [
    '**SSH = TCP 22; Telnet = TCP 23 (plain text).**',
    '**HD-KUV**: Hostname, Domain name, Key (crypto key generate rsa), User, VTY.',
    '**login local + transport input ssh**; **ip ssh version 2**.',
    '**SSHv2 ay nangangailangan ng RSA modulus na hindi bababa sa 768.**',
  ],
  'tftp-ftp': [
    '**TFTP = UDP 69, walang authentication.** **FTP = TCP 21 control + TCP 20 data.**',
    '**Pareho plain text** — ligtas na bersyon: **SFTP/SCP (SSH)**.',
    '**copy running-config tftp:** = backup.',
  ],
  'security-concepts': [
    '**Vulnerability = kahinaan; threat = sino/ano ang aatake; exploit = paraan; mitigation = ayos.**',
    '**CIA**: Confidentiality (encryption), Integrity (hash/signature), Availability (redundancy).',
    '**Controls: technical, administrative, physical.** **Defence in depth = maraming layer.**',
  ],
  'common-threats': [
    '**Worm = kumakalat mag-isa; virus = kailangan ng user; trojan = nagpapanggap.**',
    '**Phishing = tao ang target** (depensa: training + MFA).',
    '**DoS = isang pinagmulan; DDoS = maraming pinagmulan (botnet).**',
    '**MITM = humaharang; spoofing = nagpapanggap.**',
  ],
  'device-hardening': [
    '**enable secret (hash) ang panalo laban sa enable password.**',
    '**service password-encryption = type 7, mahina, reversible.**',
    '**login local** = username-based; **login** lang = line password.',
    '**Banner = legal na babala**, hindi "Welcome".',
    '**Unused ports: shutdown + unused VLAN.**',
  ],
  'acl-fundamentals': [
    '**Top-down, unang tugma ang panalo, implicit deny any sa dulo.**',
    '**Wildcard = baliktad ng subnet mask** (/24 → 0.0.0.255; /27 → 0.0.0.31).',
    '**Walang epekto ang ACL hangga\'t hindi nilalapat: ip access-group N in|out.**',
    '**host = 0.0.0.0 wildcard; any = 255.255.255.255 wildcard.**',
    '**Hindi sinasala ng ACL ang trapikong nagmumula sa router mismo.**',
  ],
  'standard-acls': [
    '**Standard = 1-99 at 1300-1999, source lang, malapit sa DESTINATION.**',
    '**access-class** = para sa **VTY**; **ip access-group** = para sa **interface**.',
    '**Named ACL**: sequence numbers para sa insert/delete.',
  ],
  'extended-acls': [
    '**Extended = 100-199 at 2000-2699, protocol/source/destination/port, malapit sa SOURCE.**',
    '**PSDP**: Protocol, Source, Destination, Port. **eq, neq, gt, lt, range.**',
    '**Kapag pinayagan ang web, huwag kalimutan ang DNS (UDP 53).**',
    '**Ang "ip" na protocol ay walang port.** **Mas tiyak na rule sa itaas.**',
  ],
  'port-security': [
    '**Default: maximum 1 MAC, violation SHUTDOWN.** **Gumagana lang sa access port.**',
    '**protect = drop lang; restrict = drop + log + counter; shutdown = err-disabled.**',
    '**Sticky = natututunan at nasa running-config; i-save para tumagal.**',
    '**Recovery: shutdown → no shutdown.**',
  ],
  'dhcp-snooping': [
    '**Trusted = uplink at DHCP server port; lahat ng iba untrusted (default).**',
    '**Offer/ACK galing sa untrusted port = ibinabagsak.**',
    '**Kailangan ang ip dhcp snooping AT ip dhcp snooping vlan N.**',
    '**May binding table** (MAC, IP, VLAN, port) — ginagamit ng **DAI**.',
  ],
  dai: [
    '**DAI = sinusuri ang ARP gamit ang DHCP snooping binding table.**',
    '**Kailangan muna ang DHCP snooping.** **ip arp inspection vlan N; trust sa uplink.**',
    '**Static host = ARP ACL.** **Default rate limit 15 pps** sa untrusted.',
  ],
  aaa: [
    '**Authentication = sino ka; Authorization = ano ang puwede; Accounting = ano ang ginawa.**',
    '**RADIUS = UDP 1812/1813, password lang ang encrypted.** **TACACS+ = TCP 49, buong packet encrypted, hiwalay ang AAA.**',
    '**Gumawa ng local user bago ang aaa new-model; maglagay ng "local" fallback.**',
  ],
  'vpn-architecture': [
    '**IPsec = Confidentiality, Integrity, Authentication, Anti-replay.**',
    '**ESP encrypts (protocol 50); AH hindi (protocol 51).** **Tunnel mode = buong packet.**',
    '**Site-to-site = gateway sa gateway; remote-access = user + client.**',
    '**IDS = nag-aalerto; IPS = inline, humaharang.** **Public server = DMZ.**',
  ],
  'router-forwarding': [
    '**IP = end to end; MAC = hop by hop.**',
    '**Host → remote destination: frame papunta sa MAC ng default gateway.**',
    '**TTL -1 bawat router; 0 = drop (ICMP time exceeded).** **Walang route = drop + ICMP unreachable.**',
    '**Hindi nagpapasa ng broadcast ang router.**',
  ],
  'routing-table': [
    '**Pagpili: longest prefix → pinakamababang AD → pinakamababang metric.**',
    '**AD: Connected 0, Static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120, iBGP 200.**',
    '**[110/2] = AD 110, metric 2.** **C connected, L local /32, S static, S* default, O OSPF.**',
    '**Magkaibang protocol = AD ang pinaghahambing; iisang protocol = metric.**',
  ],
  'static-routes': [
    '**ip route <network> <mask> <next-hop | interface>.** **Static AD = 1.**',
    '**Laging return route** — request dumarating pero walang reply = kulang ang return route.',
    '**Floating static = mas mataas na AD (hal. 130) = backup lang.**',
    '**Sa Ethernet: next hop o fully specified**, hindi exit-interface lang.',
  ],
  'default-routes': [
    '**ip route 0.0.0.0 0.0.0.0 <next-hop>** = **S***; **IPv6 = ::/0**.',
    '**Huling gagamitin dahil /0 ang pinakamaikling prefix.**',
    '**Stub network = isang default route + return route sa provider.**',
    '**default-information originate** = ipinapakalat ng OSPF ang default.',
  ],
  'dynamic-routing': [
    '**RIP = hops (max 15, AD 120); EIGRP = bandwidth+delay (AD 90); OSPF = cost (AD 110).**',
    '**OSPF at IS-IS = link-state; RIP at EIGRP = distance-vector.** **BGP = EGP.**',
    '**Link-state = buong mapa + SPF = mabilis mag-converge.**',
  ],
  'ospf-fundamentals': [
    '**Router ID: manual → pinakamataas na loopback → pinakamataas na physical IP.**',
    '**Hello 10s, Dead 40s; 224.0.0.5 (lahat), 224.0.0.6 (DR/BDR); IP protocol 89.**',
    '**Cost = 100 Mb/s ÷ bandwidth (minimum 1).** **Dapat tugma: area, timers, subnet.**',
    '**States: Down, Init, 2-Way, ExStart, Exchange, Loading, Full.**',
  ],
  'ospf-config': [
    '**network <address> <WILDCARD> area 0** — **hindi subnet mask**.',
    '**passive-interface** = walang hello pero ina-advertise pa rin ang network; **huwag sa neighbour link**.',
    '**Process ID = lokal lang.** **clear ip ospf process** pagkatapos magpalit ng router ID.',
    '**Verify: show ip ospf neighbor (FULL), show ip route ospf, show ip protocols.**',
  ],
  'ospf-neighbors': [
    '**ATSAM — Area, Timers, Subnet, Auth, MTU = tugma; Router ID = magkaiba.**',
    '**INIT = one-way; 2-WAY sa DROTHER = normal; EXSTART nakabitin = MTU.**',
    '**Passive interface = hindi bubuo ng neighbour.**',
  ],
  'ospf-dr-bdr': [
    '**DR election: pinakamataas na priority, saka router ID.** **Priority 0 = hindi sasali.**',
    '**Non-pre-emptive.** **DROTHER: FULL sa DR/BDR, 2-WAY sa isa\'t isa.**',
    '**Walang DR/BDR sa point-to-point**; **ip ospf network point-to-point**.',
  ],
  fhrp: [
    '**HSRP = Cisco active/standby; VRRP = open standard; GLBP = Cisco load balancing.**',
    '**HSRP default priority 100, preempt OFF, hello 3s / hold 10s.**',
    '**Gateway ng host = VIRTUAL IP.**',
  ],
  qos: [
    '**Voice = DSCP EF (46)**, **LLQ**. **Best effort = 0.**',
    '**Policing = drop/re-mark; shaping = buffer/delay (outbound lang).**',
    '**Voice: delay <150 ms, jitter <30 ms, loss <1%.**',
    '**QoS = prayoridad, hindi dagdag na bandwidth.**',
  ],
  'wireless-fundamentals': [
    '**2.4 GHz non-overlapping channels = 1, 6, 11.**',
    '**2.4 = malayo/siksikan; 5 = mabilis/maikli ang abot.**',
    '**SSID = pangalan; BSSID = MAC ng AP radio.** **CSMA/CA** ang paraan ng Wi-Fi.',
  ],
  'wireless-security': [
    '**WPA2 = AES-CCMP; WPA3 = SAE; WEP = sira.**',
    '**Personal = PSK (shared); Enterprise = 802.1X + RADIUS.**',
    '**Evil twin = pekeng AP na kapangalan; rogue AP = hindi awtorisadong AP.**',
  ],
};

/** Inserts the lesson's "Tandaan sa exam" card just before its Exam tips list. */
export function applyRemember(lesson: Lesson): void {
  const items = REMEMBER[lesson.id];
  if (!items || lesson.sections.some((s) => s.type === 'remember')) return;
  const at = lesson.sections.findIndex((s) => s.type === 'list' && s.variant === 'tips');
  const section = { type: 'remember' as const, title: 'Mga lumalabas sa exam', items };
  if (at === -1) lesson.sections.push(section);
  else lesson.sections.splice(at, 0, section);
}
