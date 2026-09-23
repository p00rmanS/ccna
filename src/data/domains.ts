import type { Domain, DomainId } from '../types';

/**
 * Exam domains and weights for Cisco 200-301 CCNA v1.1.
 * Objective titles below are paraphrased, not copied. Before a content refresh, check
 * Cisco's current exam-topic blueprint (PROJECT.md §125) — Cisco can change it.
 */
export const DOMAINS: Domain[] = [
  { id: 'D1', number: '1.0', name: 'Network Fundamentals', weight: 20 },
  { id: 'D2', number: '2.0', name: 'Network Access', weight: 20 },
  { id: 'D3', number: '3.0', name: 'IP Connectivity', weight: 25 },
  { id: 'D4', number: '4.0', name: 'IP Services', weight: 10 },
  { id: 'D5', number: '5.0', name: 'Security Fundamentals', weight: 15 },
  { id: 'D6', number: '6.0', name: 'Automation and Programmability', weight: 10 },
];

export const domainById = (id: DomainId): Domain => DOMAINS.find((d) => d.id === id)!;

export const OBJECTIVES: Record<string, string> = {
  '1.1': 'Role and function of network components (routers, switches, firewalls/IPS, APs, controllers, endpoints, servers)',
  '1.2': 'Characteristics of network topology architectures (two-tier, three-tier, spine-leaf, WAN, SOHO, on-prem, cloud)',
  '1.3': 'Compare physical interface and cabling types',
  '1.4': 'Identify interface and cable issues (collisions, errors, duplex and speed mismatch)',
  '1.5': 'Compare TCP to UDP',
  '1.6': 'Configure and verify IPv4 addressing and subnetting',
  '1.7': 'Describe the need for private IPv4 addressing',
  '1.8': 'Configure and verify IPv6 addressing and prefix',
  '1.9': 'Compare IPv6 address types',
  '1.10': 'Verify IP parameters for a client operating system',
  '1.11': 'Describe wireless principles',
  '1.12': 'Explain virtualization fundamentals',
  '1.13': 'Describe switching concepts (MAC learning and aging, frame switching, flooding, MAC address table)',
  '2.1': 'Configure and verify VLANs (access ports)',
  '2.2': 'Configure and verify interswitch connectivity (trunks, 802.1Q, native VLAN)',
  '2.3': 'Configure and verify Layer 2 discovery protocols (CDP, LLDP)',
  '2.4': 'Configure and verify EtherChannel (LACP)',
  '2.5': 'Interpret basic operations of Rapid PVST+',
  '2.6': 'Compare Cisco wireless architectures and AP modes',
  '2.7': 'Describe physical infrastructure connections of WLAN components',
  '2.8': 'Describe AP and WLC management access connections',
  '2.9': 'Interpret the wireless LAN GUI configuration for client connectivity',
  '3.1': 'Interpret the components of a routing table',
  '3.2': 'Determine how a router makes a forwarding decision by default',
  '3.3': 'Configure and verify IPv4 and IPv6 static routing',
  '3.4': 'Configure and verify single-area OSPFv2',
  '3.5': 'Describe the purpose, functions and concepts of first-hop redundancy protocols',
  '4.1': 'Configure and verify inside source NAT',
  '4.2': 'Configure and verify NTP in client/server mode',
  '4.3': 'Explain the role of DHCP and DNS',
  '4.4': 'Explain the function of SNMP',
  '4.5': 'Describe syslog facilities and severity levels',
  '4.6': 'Configure and verify DHCP client and relay',
  '4.7': 'Explain QoS per-hop behaviour (classification, marking, queuing, congestion, policing, shaping)',
  '4.8': 'Configure network devices for remote access using SSH',
  '4.9': 'Describe the capabilities and functions of TFTP/FTP',
  '5.1': 'Define key security concepts (threats, vulnerabilities, exploits, mitigation)',
  '5.2': 'Describe security program elements (awareness, training, physical access control)',
  '5.3': 'Configure and verify device access control using local passwords',
  '5.4': 'Describe security password policy elements',
  '5.5': 'Describe IPsec remote-access and site-to-site VPNs',
  '5.6': 'Configure and verify access control lists',
  '5.7': 'Configure and verify Layer 2 security (DHCP snooping, DAI, port security)',
  '5.8': 'Compare authentication, authorization and accounting concepts',
  '5.9': 'Describe wireless security protocols (WPA, WPA2, WPA3)',
  '5.10': 'Configure and verify a WLAN in the GUI using WPA2 PSK',
  '6.1': 'Explain how automation impacts network management',
  '6.2': 'Compare traditional networks with controller-based networking',
  '6.3': 'Describe controller-based and software-defined architecture (overlay, underlay, fabric, planes, APIs)',
  '6.4': 'Explain AI (generative and predictive) and machine learning in network operations',
  '6.5': 'Describe characteristics of REST-based APIs',
  '6.6': 'Recognize the capabilities of Ansible and Terraform',
  '6.7': 'Interpret JSON-encoded data',
};

export const objectiveLabel = (code: string): string => `${code} — ${OBJECTIVES[code] ?? 'Unknown objective'}`;
