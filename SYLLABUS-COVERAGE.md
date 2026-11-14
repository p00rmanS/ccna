# CCNA 200-301 v1.1 syllabus coverage

Generated from the lesson data: each lesson declares the exam objectives it covers. Objective wording is a paraphrase of Cisco's published v1.1 exam topics; verify against Cisco's official page before relying on it.

**Version note:** Cisco lists the last date to test for v1.1 as 2 February 2027, with v2.0 starting 3 February 2027. This app targets v1.1. If you sit the exam on or after 3 February 2027, compare the v2.0 topics before you study.


## 1. Network Fundamentals (20%)

| Objective | Topic | Lessons |
|---|---|---|
| 1.1 | Explain the role and function of network components (routers, L2/L3 switches, NGFW/IPS, APs, controllers, endpoints, servers, PoE) | Ethernet Fundamentals; MAC Addresses; Network Components Deep Dive: Switches, Firewalls, IPS, Controllers and PoE; Network Devices; The OSI Model; The TCP/IP Model, TCP and UDP; What Is a Network? |
| 1.2 | Describe characteristics of network topology architectures (two-tier, three-tier, spine-leaf, WAN, SOHO, on-premises and cloud) | LAN vs WAN; Network Architectures: Two-Tier, Three-Tier, Spine-Leaf, WAN, SOHO and Cloud; What Is a Network? |
| 1.3 | Compare physical interface and cabling types (single-mode, multimode, copper; shared media and point-to-point) | Cabling and Physical Interfaces |
| 1.4 | Identify interface and cable issues (collisions, errors, duplex and speed mismatch) | Cabling and Physical Interfaces; Ethernet Fundamentals; Troubleshooting Method: Layers, the Ping Ladder and the Show-Command Toolbox |
| 1.5 | Compare TCP to UDP | The TCP/IP Model, TCP and UDP |
| 1.6 | Configure and verify IPv4 addressing and subnetting | Binary Basics; Cisco IOS Fundamentals; IPv4 Fundamentals; Subnetting Deep Dive: The Magic Number Method; Subnetting From Zero; VLSM: Right-Sizing Your Subnets |
| 1.7 | Describe private IPv4 addressing | IPv4 Fundamentals |
| 1.8 | Configure and verify IPv6 addressing and prefix | IPv6 Configuration: Addresses, SLAAC and Verification; IPv6 Fundamentals |
| 1.9 | Describe IPv6 address types (unicast, anycast, multicast, modified EUI-64) | IPv6 Address Types; IPv6 Configuration: Addresses, SLAAC and Verification |
| 1.10 | Verify IP parameters for client OS (Windows, macOS, Linux) | IPv4 Fundamentals; IPv6 Fundamentals; Troubleshooting Method: Layers, the Ping Ladder and the Show-Command Toolbox; Troubleshooting Scenarios: Six Faults You Will See in the Exam; Virtualization and Verifying Client IP Settings |
| 1.11 | Describe wireless principles (non-overlapping channels, SSID, RF, encryption) | Wireless Fundamentals: SSID, BSSID, Channels and Bands |
| 1.12 | Explain virtualization fundamentals (server virtualization, containers, VRFs) | Virtualization and Verifying Client IP Settings |
| 1.13 | Describe switching concepts (MAC learning and aging, frame switching, flooding, MAC address table) | Ethernet Fundamentals; MAC Addresses; The OSI Model; How a Switch Learns MAC Addresses |

## 2. Network Access (20%)

| Objective | Topic | Lessons |
|---|---|---|
| 2.1 | Configure and verify VLANs (normal range) spanning multiple switches (access ports data/voice, default VLAN, inter-VLAN connectivity) | Basic Switch Configuration: Passwords, Management IP and Verification; Inter-VLAN Routing; Troubleshooting Scenarios: Six Faults You Will See in the Exam; VLAN and Trunk Deep Dive: Build It, Break It, Fix It; VLAN Fundamentals |
| 2.2 | Configure and verify interswitch connectivity (trunk ports, 802.1Q, native VLAN) | Inter-VLAN Routing; Trunking and 802.1Q; VLAN and Trunk Deep Dive: Build It, Break It, Fix It |
| 2.3 | Configure and verify Layer 2 discovery protocols (CDP and LLDP) | CDP and LLDP: Layer 2 Neighbour Discovery |
| 2.4 | Configure and verify (Layer 2/Layer 3) EtherChannel (LACP) | EtherChannel: LACP, PAgP and Static Bundles; EtherChannel Deep Dive: LACP, PAgP, Load Balancing and Troubleshooting |
| 2.5 | Interpret basic operations of Rapid PVST+ (roles, root bridge primary/secondary, states, PortFast, root guard, loop guard, BPDU filter, BPDU guard) | Rapid PVST+: Faster Convergence; STP Deep Dive: Predict Every Election and Port Role; STP Fundamentals: Root Bridge and Port Roles; STP Protection: PortFast, BPDU Guard, Root Guard, Loop Guard; Why Spanning Tree Exists |
| 2.6 | Describe Cisco wireless architectures and AP modes | Wireless Architectures: Autonomous, Lightweight, CAPWAP and the WLC |
| 2.7 | Describe physical infrastructure connections of WLAN components (AP, WLC, access/trunk ports, LAG) | Wireless Architectures: Autonomous, Lightweight, CAPWAP and the WLC |
| 2.8 | Describe network device management access (Telnet, SSH, HTTP, HTTPS, console, TACACS+/RADIUS, cloud managed) | Device Management Access: Console, Telnet, SSH, HTTP(S), AAA and Cloud Managed; Wireless Architectures: Autonomous, Lightweight, CAPWAP and the WLC |
| 2.9 | Interpret the wireless LAN GUI configuration for client connectivity (WLAN creation, security, QoS profiles, advanced settings) | WLC GUI Walkthrough: Creating a WLAN with WPA2-PSK |

## 3. IP Connectivity (25%)

| Objective | Topic | Lessons |
|---|---|---|
| 3.1 | Interpret the components of a routing table (code, prefix, mask, next hop, AD, metric, gateway of last resort) | Dynamic Routing: Why Routers Learn Routes Automatically; The Routing Table: Codes, Metric, Administrative Distance and Longest Prefix Match |
| 3.2 | Determine how a router makes a forwarding decision by default (longest prefix match, AD, metric) | Longest Prefix Match: Pick the Route Like a Router; What a Router Actually Does: The Forwarding Decision; The Routing Table: Codes, Metric, Administrative Distance and Longest Prefix Match |
| 3.3 | Configure and verify IPv4 and IPv6 static routing (default, network, host, floating static) | Default Routes: The Gateway of Last Resort; IPv6 Static and Floating Static Routing; IPv4 Static Routes: Next Hop, Exit Interface and Floating Routes |
| 3.4 | Configure and verify single-area OSPFv2 (neighbour adjacencies, point-to-point, broadcast DR/BDR, router ID) | Dynamic Routing: Why Routers Learn Routes Automatically; Single-Area OSPF Configuration and Verification; OSPF Deep Dive: Cost, Path Choice and Tuning; OSPF DR and BDR: Elections on Multi-Access Networks; OSPF Fundamentals: Router ID, Hello, LSDB, SPF and Cost; OSPF Neighbour Relationships: Why Adjacencies Fail; Troubleshooting Scenarios: Six Faults You Will See in the Exam |
| 3.5 | Describe the purpose, functions and concepts of first-hop redundancy protocols | First-Hop Redundancy: HSRP, VRRP and GLBP; HSRP Deep Dive: Configuration, Priority, Preempt and Load Sharing |

## 4. IP Services (10%)

| Objective | Topic | Lessons |
|---|---|---|
| 4.1 | Configure and verify inside source NAT using static and pools | NAT Deep Dive: Four Addresses, Port Forwarding and Troubleshooting; NAT Fundamentals: Private Addresses and the Four Address Terms; Static and Dynamic NAT; PAT (NAT Overload): Many Hosts, One Address; Troubleshooting Scenarios: Six Faults You Will See in the Exam |
| 4.2 | Configure and verify NTP in client and server mode | Network Management Deep Dive: NTP, SNMP and Syslog Working Together; NTP: Keeping Every Device on the Same Clock |
| 4.3 | Explain the role of DHCP and DNS within the network | DHCP and DNS Deep Dive: Leases, Relay and Name Resolution; DHCP Fundamentals: DORA, Leases and Options; DNS: Turning Names into IP Addresses |
| 4.4 | Explain the function of SNMP in network operations | Network Management Deep Dive: NTP, SNMP and Syslog Working Together; SNMP: Monitoring Devices from One Place |
| 4.5 | Describe the use of syslog features including facilities and levels | Network Management Deep Dive: NTP, SNMP and Syslog Working Together; Syslog: Reading and Collecting Device Logs |
| 4.6 | Configure and verify DHCP client and relay | DHCP and DNS Deep Dive: Leases, Relay and Name Resolution; DHCP Server and Relay on a Cisco Router; Troubleshooting Scenarios: Six Faults You Will See in the Exam |
| 4.7 | Explain QoS per-hop behaviour (classification, marking, queuing, congestion, policing, shaping) | QoS: Classification, Marking, Queuing, Policing and Shaping |
| 4.8 | Configure network devices for remote access using SSH | SSH: Secure Remote Access to Cisco Devices |
| 4.9 | Describe the capabilities and functions of TFTP/FTP in the network | TFTP and FTP: Moving Files to and from Devices |

## 5. Security Fundamentals (15%)

| Objective | Topic | Lessons |
|---|---|---|
| 5.1 | Define key security concepts (threats, vulnerabilities, exploits, mitigation techniques) | Common Threats: Malware, Phishing, MITM, DoS and Spoofing; Security Concepts: Threats, Vulnerabilities, Exploits and Mitigation |
| 5.2 | Describe security program elements (user awareness, training, physical access control) | Security Programs and Password Policy: Awareness, MFA and Access Control |
| 5.3 | Configure and verify device access control using local passwords | Basic Switch Configuration: Passwords, Management IP and Verification; Device Hardening: Passwords, Banners and Unused Ports; Cisco IOS Fundamentals |
| 5.4 | Describe security password policy elements (management, complexity, MFA, certificates, biometrics) | Device Hardening: Passwords, Banners and Unused Ports; Security Programs and Password Policy: Awareness, MFA and Access Control |
| 5.5 | Describe IPsec remote-access and site-to-site VPNs | VPN and Security Architecture: IPsec, Firewalls and IPS |
| 5.6 | Configure and verify access control lists | ACL Deep Dive: Wildcards, Placement and Editing; ACL Fundamentals: How a Router Permits and Denies Traffic; ACL Placement and Troubleshooting: Where, Which Direction, Why; Extended and Named ACLs: Protocol, Ports and Placement; Standard ACLs: Filtering by Source Address; Troubleshooting Scenarios: Six Faults You Will See in the Exam |
| 5.7 | Configure and verify Layer 2 security features (DHCP snooping, DAI, port security) | Dynamic ARP Inspection: Stopping ARP Spoofing; DHCP Snooping: Trusted and Untrusted Ports; Layer 2 Security Deep Dive: Port Security, DHCP Snooping and DAI Together; Port Security: Controlling Which Devices Can Use a Switch Port |
| 5.8 | Compare authentication, authorization and accounting concepts | AAA: Authentication, Authorization and Accounting |
| 5.9 | Describe wireless security protocols (WPA, WPA2, WPA3) | Wireless Security: WPA2, WPA3, PSK and 802.1X |
| 5.10 | Configure and verify a WLAN in the GUI using WPA2 PSK | WLC GUI Walkthrough: Creating a WLAN with WPA2-PSK |

## 6. Automation and Programmability (10%)

| Objective | Topic | Lessons |
|---|---|---|
| 6.1 | Explain how automation impacts network management | Why Network Automation? Traditional vs Automated Management |
| 6.2 | Compare traditional networks with controller-based networking | Controller-Based Networking and SDN: Planes, APIs, Underlay and Overlay |
| 6.3 | Describe controller-based, software-defined architecture (overlay, underlay, fabric; control/data plane separation; northbound/southbound APIs) | Controller-Based Networking and SDN: Planes, APIs, Underlay and Overlay |
| 6.4 | Explain AI (generative and predictive) and machine learning in network operations | AI and Machine Learning in Network Operations |
| 6.5 | Describe characteristics of REST-based APIs (authentication, CRUD, HTTP verbs, data encoding) | REST APIs: Verbs, CRUD, Status Codes and Authentication |
| 6.6 | Recognize the capabilities of Ansible and Terraform | Ansible and Terraform: Configuration Management and Infrastructure as Code |
| 6.7 | Recognize components of JSON-encoded data | JSON, XML and YAML: Reading Data Formats |

**Objectives with no lesson:** none

Total lessons: 91.
