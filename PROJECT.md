# CCNA MASTER TRAINING PLATFORM — PROJECT.md

> **Project Type:** Full-stack interactive learning platform  
> **Primary Goal:** Teach a complete beginner networking from zero through Cisco CCNA exam readiness  
> **Certification Target:** Cisco Certified Network Associate — **200-301 CCNA v1.1**  
> **Experience Goal:** Coursera + Udemy + Cisco Networking Academy + Packet Tracer lab coach + exam simulator  
> **Primary Stack:** HTML, CSS, JavaScript or React/Vite  
> **Audience:** Beginner → Intermediate → CCNA-ready  
> **Teaching Style:** Simple English + Taglish + analogies + diagrams + CLI labs + repetition + troubleshooting  
> **Core Principle:** Do not just help the learner memorize commands. Teach them to understand what the network is doing and why.

---

# 1. PROJECT VISION

Build a premium interactive CCNA training website that can take someone who knows almost nothing about networking and gradually turn them into a confident CCNA-level learner.

The platform must feel like a real online course, not a collection of notes.

It should combine:

- Structured learning paths
- Beginner-friendly lessons
- Taglish explanations
- English exam terminology
- Real-world analogies
- Cisco IOS CLI demonstrations
- Packet Tracer labs
- Interactive subnetting exercises
- Network diagrams
- Flashcards
- Mini quizzes
- Troubleshooting scenarios
- Configuration challenges
- Command reference sheets
- Progress tracking
- Weak-topic tracking
- Practice exams
- Exam-readiness analytics
- Daily study plans
- Review mode
- Light and dark themes
- Responsive mobile/desktop design

The learner should move through this path:

**Zero knowledge → Networking basics → Switching → Routing → Services → Security → Automation → Labs → Troubleshooting → Practice Exams → CCNA Ready**

---

# 2. OFFICIAL CERTIFICATION TARGET

## Cisco Certified Network Associate

Target exam:

**200-301 CCNA v1.1**

The platform must organize the curriculum around the six official CCNA domains:

| Domain | Approx. Weight |
|---|---:|
| 1.0 Network Fundamentals | 20% |
| 2.0 Network Access | 20% |
| 3.0 IP Connectivity | 25% |
| 4.0 IP Services | 10% |
| 5.0 Security Fundamentals | 15% |
| 6.0 Automation and Programmability | 10% |

The learning experience should reflect exam weighting. IP Connectivity should receive more practice and assessment coverage than lower-weight sections.

Current v1.1 material must include modern topics such as:

- AI and machine learning concepts in network operations
- REST API authentication concepts
- Terraform awareness
- Ansible awareness
- STP protection mechanisms
- Cloud-managed network device access
- IPv4 and IPv6
- Wireless networking
- Network security fundamentals
- Network automation

---

# 3. TARGET LEARNER

Assume the student may initially not understand:

- What an IP address is
- What a router does
- What a switch does
- What a subnet mask means
- What a VLAN is
- Why networks need routing
- What a MAC address is
- What a port number is
- What TCP and UDP are
- What DNS and DHCP do
- What the Cisco CLI is

Never assume prior knowledge.

Every advanced topic must be built on previously learned concepts.

---

# 4. TEACHING PHILOSOPHY

Every lesson should explain a topic using multiple layers.

## Layer 1 — Baby Explanation

Explain it as if teaching someone seeing networking for the first time.

Example:

> A switch is like the receptionist inside one office. It learns where people are sitting and sends messages to the correct desk.

## Layer 2 — Taglish Explanation

Use natural Taglish when it makes a difficult concept easier.

Example:

> Ang switch, parang taga-direct sa loob ng isang building. Tinitingnan niya ang MAC address para malaman kung saang port niya ipapadala ang frame.

## Layer 3 — Technical Explanation

Introduce the correct CCNA terminology.

Example:

> A Layer 2 switch learns source MAC addresses and associates them with interfaces in its MAC address table.

## Layer 4 — Real-World Example

Relate the topic to:

- Houses
- Streets
- Postal systems
- Hotels
- Restaurants
- Airports
- Offices
- School campuses
- Delivery services

## Layer 5 — Packet Walkthrough

Explain what happens to the packet/frame step-by-step.

## Layer 6 — Cisco CLI

Show the commands.

## Layer 7 — Verification

Teach the appropriate `show` commands.

## Layer 8 — Troubleshooting

Introduce a realistic broken configuration.

## Layer 9 — Exam Trap

Explain common CCNA misunderstandings.

## Layer 10 — Quick Recall

Finish with a few facts worth memorizing.

---

# 5. STANDARD LESSON TEMPLATE

Every lesson page should contain:

1. **Lesson title**
2. **Why this matters**
3. **Learning objectives**
4. **Simple explanation**
5. **Taglish explanation**
6. **Technical explanation**
7. **Analogy**
8. **Network diagram**
9. **Key terminology**
10. **How traffic flows**
11. **Cisco IOS commands**
12. **Command-by-command explanation**
13. **Example configuration**
14. **Verification commands**
15. **Common mistakes**
16. **Troubleshooting scenario**
17. **Packet Tracer lab**
18. **Mini challenge**
19. **5–10 question quiz**
20. **Flashcards**
21. **Exam tips**
22. **Lesson summary**
23. **What to remember**
24. **Next lesson**

---

# 6. COURSE STRUCTURE

The course should be divided into phases.

---

# PHASE 0 — START HERE

## Module 0.1 — Welcome to Networking

Lessons:

- What is a computer network?
- Why networks exist
- LAN vs WAN
- Internet vs intranet
- Client and server
- Peer-to-peer
- Network topology basics
- Network devices overview
- Introduction to Cisco
- What CCNA tests
- How to study for CCNA

### Beginner Lab

Have the learner identify:

- PC
- Switch
- Router
- Server
- Wireless AP
- Firewall
- Internet cloud

---

## Module 0.2 — Packet Tracer Bootcamp

Teach:

- Installing Cisco Packet Tracer
- Packet Tracer interface
- Selecting devices
- Connecting devices
- Copper straight-through
- Crossover concepts
- Console cable
- Device CLI
- Realtime mode
- Simulation mode
- PDU tool
- Saving `.pkt` labs

### Lab

Build:

```text
PC1 ---- SW1 ---- PC2
```

Assign IP addresses and test with `ping`.

---

## Module 0.3 — Cisco IOS Fundamentals

Teach:

- User EXEC mode
- Privileged EXEC mode
- Global configuration mode
- Interface configuration mode
- Console access
- Command abbreviation
- Context-sensitive help
- Command history

Commands:

```text
enable
configure terminal
hostname
interface
ip address
no shutdown
exit
end
show running-config
show startup-config
copy running-config startup-config
reload
```

Explain the prompt differences:

```text
Router>
Router#
Router(config)#
Router(config-if)#
```

### Lab

Perform the first complete router configuration.

---

# PHASE 1 — NETWORK FUNDAMENTALS

> Exam domain emphasis: approximately 20%.

---

## Module 1.1 — Network Components

Teach:

- Routers
- Layer 2 switches
- Layer 3 switches
- Firewalls
- IPS
- Access points
- Wireless LAN controllers
- Controllers
- Endpoints
- Servers
- PoE

Explain:

- What each device does
- What layer it commonly operates at
- Where it sits in a topology
- Common business uses

### Interactive Feature

“Guess the device” scenarios.

Example:

> You need to connect two different IP networks. Which device should you use?

---

## Module 1.2 — Network Architectures

Teach:

- Two-tier
- Three-tier
- Access layer
- Distribution layer
- Core layer
- Spine-leaf
- WAN
- SOHO
- On-premises
- Cloud

Include visual comparisons.

---

## Module 1.3 — OSI Model

Teach all seven layers:

1. Physical
2. Data Link
3. Network
4. Transport
5. Session
6. Presentation
7. Application

For each layer include:

- Purpose
- Example protocols
- Device examples
- PDU
- Addressing information

Teach encapsulation:

```text
Application Data
      ↓
Segment
      ↓
Packet
      ↓
Frame
      ↓
Bits
```

### Memorization Tools

Provide several mnemonics, but make understanding more important than memorization.

---

## Module 1.4 — TCP/IP Model

Teach:

- Application
- Transport
- Internet
- Network Access

Compare TCP/IP and OSI.

---

## Module 1.5 — Ethernet Fundamentals

Teach:

- Ethernet
- Frames
- Source MAC
- Destination MAC
- EtherType
- FCS
- Unicast
- Broadcast
- Multicast
- Broadcast domains
- Collision domains

---

## Module 1.6 — MAC Addresses

Teach:

- 48-bit MAC addresses
- Hexadecimal
- OUI
- NIC-specific portion
- Unicast MAC
- Broadcast MAC

Example:

```text
00:1A:2B:3C:4D:5E
```

Explain why switches care about MAC addresses.

---

## Module 1.7 — How a Switch Learns MAC Addresses

Teach:

- Source MAC learning
- MAC address table
- Known unicast forwarding
- Unknown unicast flooding
- Broadcast flooding

Commands:

```text
show mac address-table
clear mac address-table dynamic
```

### Animation Requirement

Animate a frame moving:

```text
PC-A → SW1 → PC-B
```

and visibly update the switch MAC table.

---

## Module 1.8 — Cabling and Physical Interfaces

Teach:

- Copper
- UTP
- Fiber
- Single-mode fiber
- Multimode fiber
- RJ-45
- SFP
- Duplex
- Speed
- Auto-negotiation
- Straight-through concepts
- Crossover concepts

Troubleshooting:

- Duplex mismatch
- Speed mismatch
- CRC errors
- Interface down
- Administratively down

Commands:

```text
show interfaces
show interfaces status
show controllers
```

---

## Module 1.9 — Binary Fundamentals

Teach from zero:

- Decimal
- Binary
- Bits
- Bytes
- Powers of 2
- Converting decimal → binary
- Converting binary → decimal

Interactive drills must exist.

---

## Module 1.10 — IPv4 Addressing

Teach:

- IPv4 structure
- Network portion
- Host portion
- Subnet masks
- Prefix notation
- Public vs private IP addresses
- Loopback
- APIPA
- Broadcast address
- Network address
- Host range

Private ranges:

```text
10.0.0.0/8
172.16.0.0/12
192.168.0.0/16
```

---

# 7. SUBNETTING MASTERCLASS

Subnetting must be one of the strongest parts of the platform.

Build a dedicated `/subnetting` learning environment.

---

## Module 1.11 — Subnetting From Zero

Start with:

- Why subnetting exists
- Network bits
- Host bits
- CIDR
- Prefix length
- Subnet mask

Teach common prefixes:

| CIDR | Mask | Addresses | Usable Hosts |
|---|---|---:|---:|
| /24 | 255.255.255.0 | 256 | 254 |
| /25 | 255.255.255.128 | 128 | 126 |
| /26 | 255.255.255.192 | 64 | 62 |
| /27 | 255.255.255.224 | 32 | 30 |
| /28 | 255.255.255.240 | 16 | 14 |
| /29 | 255.255.255.248 | 8 | 6 |
| /30 | 255.255.255.252 | 4 | 2 |

Teach:

```text
block size = 256 - interesting octet
```

But explain why the shortcut works.

---

## Module 1.12 — Subnetting Drills

Generate unlimited random questions:

### Question Types

- Find network address
- Find broadcast address
- Find first host
- Find last host
- Find number of hosts
- Find subnet mask
- Find prefix
- Determine whether two hosts share a subnet
- Determine correct default gateway range
- VLSM planning

### Modes

- Learn
- Guided
- Timed
- Exam
- Speed Run

Track:

- Accuracy
- Average time
- Weak prefix ranges
- Longest correct streak

---

## Module 1.13 — VLSM

Teach Variable Length Subnet Masking.

Scenario:

```text
HQ LAN:        100 hosts
Sales LAN:      50 hosts
IT LAN:         20 hosts
WAN Link 1:      2 hosts
WAN Link 2:      2 hosts
```

Learner must allocate networks efficiently.

---

# 8. IPv6

## Module 1.14 — IPv6 Fundamentals

Teach:

- 128-bit addressing
- Hexadecimal
- IPv6 notation
- Zero compression
- Leading zero removal
- Prefix length

Example:

```text
2001:0db8:0000:0000:0000:ff00:0042:8329
```

Compress to:

```text
2001:db8::ff00:42:8329
```

---

## Module 1.15 — IPv6 Address Types

Teach:

- Global unicast
- Link-local
- Unique local
- Multicast
- Anycast
- Loopback
- Unspecified address

Important examples:

```text
::1
::
FE80::/10
FC00::/7
2000::/3
```

---

## Module 1.16 — IPv6 Configuration

Commands:

```text
ipv6 unicast-routing
interface g0/0
 ipv6 address 2001:db8:1::1/64
 ipv6 address fe80::1 link-local
 no shutdown
```

Verification:

```text
show ipv6 interface brief
show ipv6 route
ping ipv6
```

---

# PHASE 2 — NETWORK ACCESS

> Exam domain emphasis: approximately 20%.

---

# 9. SWITCHING

## Module 2.1 — Basic Switch Configuration

Teach:

- Hostname
- Passwords
- Console
- VTY
- Management IP
- Default gateway
- SSH basics

---

## Module 2.2 — VLAN Fundamentals

Explain:

> VLAN = logically creating separate networks inside the same physical switch infrastructure.

Teach:

- VLAN purpose
- Access ports
- VLAN membership
- Broadcast domains

Commands:

```text
vlan 10
 name SALES

interface f0/1
 switchport mode access
 switchport access vlan 10
```

Verification:

```text
show vlan brief
show interfaces switchport
```

---

## Module 2.3 — VLAN Lab

Topology:

```text
PC1 ---\
        SW1
PC2 ---/
```

Create:

```text
VLAN 10 SALES
VLAN 20 HR
```

Have learner prove that VLAN-separated PCs cannot communicate without routing.

---

## Module 2.4 — Trunking

Teach:

- 802.1Q
- Tagged frames
- Untagged frames
- Native VLAN
- Access vs trunk
- Allowed VLANs

Commands:

```text
switchport mode trunk
switchport trunk native vlan 99
switchport trunk allowed vlan 10,20,30,99
```

Verification:

```text
show interfaces trunk
```

---

## Module 2.5 — Inter-VLAN Routing

Teach:

### Router-on-a-Stick

```text
interface g0/0.10
 encapsulation dot1q 10
 ip address 192.168.10.1 255.255.255.0
```

### Layer 3 Switch

```text
ip routing

interface vlan 10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
```

Explain differences.

---

# 10. SPANNING TREE

## Module 2.6 — Why STP Exists

Demonstrate a Layer 2 loop.

Explain:

- Broadcast storms
- Duplicate frames
- MAC address table instability

Then introduce STP.

---

## Module 2.7 — STP Fundamentals

Teach:

- Root bridge
- Bridge ID
- Root port
- Designated port
- Alternate port
- Port roles
- Port states
- Path cost

Walk through a topology manually.

---

## Module 2.8 — Rapid PVST+

Teach:

- Rapid convergence
- Per-VLAN operation
- Root selection

Commands:

```text
show spanning-tree
spanning-tree vlan 10 root primary
spanning-tree vlan 10 root secondary
```

---

## Module 2.9 — STP Protection

Include current v1.1 topics:

- PortFast
- BPDU Guard
- BPDU Filter
- Root Guard
- Loop Guard

Commands and explanation:

```text
spanning-tree portfast
spanning-tree bpduguard enable
spanning-tree guard root
spanning-tree guard loop
```

Emphasize when each should and should not be used.

---

# 11. ETHERCHANNEL

## Module 2.10 — EtherChannel Fundamentals

Teach:

- Link aggregation
- Logical interfaces
- Redundancy
- Increased bandwidth

Protocols:

- LACP
- PAgP
- Static

LACP modes:

```text
active
passive
```

PAgP modes:

```text
desirable
auto
```

Commands:

```text
interface range g0/1-2
 channel-group 1 mode active
```

Verification:

```text
show etherchannel summary
show interfaces port-channel
```

Include common mismatch troubleshooting.

---

# 12. DISCOVERY PROTOCOLS

## Module 2.11 — CDP and LLDP

Teach:

- Cisco Discovery Protocol
- Link Layer Discovery Protocol

Commands:

```text
show cdp neighbors
show cdp neighbors detail
show lldp neighbors
show lldp neighbors detail
```

---

# 13. WIRELESS

## Module 2.12 — Wireless Fundamentals

Teach:

- RF basics
- SSID
- BSSID
- Channels
- 2.4 GHz
- 5 GHz
- Interference
- Non-overlapping channels
- AP
- WLC
- WLAN

---

## Module 2.13 — Wireless Architectures

Teach:

- Autonomous AP
- Lightweight AP
- WLC
- CAPWAP
- Controller-based networking

---

## Module 2.14 — Wireless Security

Teach:

- WPA2
- WPA3
- PSK
- Enterprise authentication
- RADIUS

---

## Module 2.15 — WLC GUI Walkthrough

Simulate or provide screenshots/mock UI explaining:

- WLAN creation
- SSID
- Security
- VLAN mapping
- QoS
- Client monitoring

---

# PHASE 3 — IP CONNECTIVITY

> Highest exam emphasis: approximately 25%.

---

# 14. ROUTING FUNDAMENTALS

## Module 3.1 — What a Router Actually Does

Teach:

1. Receive frame
2. Remove Layer 2 header
3. Examine destination IP
4. Check routing table
5. Choose longest-prefix match
6. Resolve next-hop Layer 2 address
7. Build new Layer 2 frame
8. Forward packet

This packet walkthrough is critical.

---

## Module 3.2 — Routing Table

Teach route codes:

```text
C
L
S
O
```

Teach:

- Prefix
- Next hop
- Exit interface
- Metric
- Administrative distance
- Gateway of last resort

Command:

```text
show ip route
```

---

## Module 3.3 — Longest Prefix Match

Create visual interactive exercises.

Example routes:

```text
10.0.0.0/8
10.1.0.0/16
10.1.1.0/24
```

Destination:

```text
10.1.1.50
```

Learner must select `/24`.

---

# 15. STATIC ROUTING

## Module 3.4 — IPv4 Static Routes

Commands:

```text
ip route 192.168.20.0 255.255.255.0 10.0.0.2
```

Teach:

- Next-hop route
- Exit-interface route
- Fully specified route

---

## Module 3.5 — Default Routes

```text
ip route 0.0.0.0 0.0.0.0 10.0.0.1
```

Teach:

> “If no more specific route exists, send it here.”

---

## Module 3.6 — Floating Static Routes

Explain backup routes and administrative distance.

---

## Module 3.7 — IPv6 Static Routing

Teach:

```text
ipv6 route 2001:db8:20::/64 2001:db8:12::2
ipv6 route ::/0 2001:db8:12::1
```

---

# 16. OSPF

## Module 3.8 — Dynamic Routing

Explain:

- Static vs dynamic routing
- IGP
- OSPF
- Link-state routing

---

## Module 3.9 — OSPF Fundamentals

Teach:

- Router ID
- Neighbor adjacency
- Hello packets
- LSDB
- SPF
- Cost
- Areas

---

## Module 3.10 — Single-Area OSPF Configuration

Example:

```text
router ospf 1
 router-id 1.1.1.1
 network 10.0.12.0 0.0.0.3 area 0
 network 192.168.1.0 0.0.0.255 area 0
```

Also teach interface configuration style:

```text
interface g0/0
 ip ospf 1 area 0
```

---

## Module 3.11 — OSPF Neighbor Relationships

Teach why neighbors fail:

- Different area
- Different subnet
- Interface down
- Passive interface
- Authentication mismatch when relevant
- Timer mismatch concepts
- Duplicate router IDs

Verification:

```text
show ip ospf neighbor
show ip ospf interface
show ip protocols
show ip route ospf
```

---

## Module 3.12 — OSPF DR and BDR

Teach:

- Broadcast network behavior
- DR
- BDR
- DROTHER
- Priority
- Router ID

---

# PHASE 4 — IP SERVICES

> Exam domain emphasis: approximately 10%.

---

# 17. DHCP

## Module 4.1 — DHCP Fundamentals

Teach DORA:

```text
Discover
Offer
Request
Acknowledge
```

Animate the process.

---

## Module 4.2 — DHCP Server Configuration

```text
ip dhcp excluded-address 192.168.10.1 192.168.10.10

ip dhcp pool SALES
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 8.8.8.8
```

---

## Module 4.3 — DHCP Relay

Teach why broadcasts do not cross routers.

Command:

```text
ip helper-address 10.1.1.10
```

---

# 18. DNS

Teach:

- DNS purpose
- Hostnames
- A records
- AAAA records
- Recursive resolution concept
- DNS server configuration awareness

Use analogy:

> DNS is the contact list of the internet.

---

# 19. NAT

## Module 4.4 — NAT Fundamentals

Teach:

- Inside local
- Inside global
- Outside local
- Outside global

---

## Module 4.5 — Static NAT

```text
ip nat inside source static 192.168.1.10 203.0.113.10
```

---

## Module 4.6 — Dynamic NAT

Teach address pools.

---

## Module 4.7 — PAT / NAT Overload

Teach many private hosts sharing one public address.

Example configuration:

```text
access-list 1 permit 192.168.1.0 0.0.0.255

ip nat inside source list 1 interface g0/1 overload
```

Verification:

```text
show ip nat translations
show ip nat statistics
```

---

# 20. NTP

Teach:

- Why synchronized time matters
- NTP client
- NTP server concepts

Commands:

```text
ntp server 10.0.0.10
show clock
show ntp associations
show ntp status
```

---

# 21. SNMP

Teach:

- Manager
- Agent
- MIB
- OID
- Traps
- Polling
- SNMPv2c vs SNMPv3 at a conceptual level

---

# 22. SYSLOG

Teach severity levels:

```text
0 Emergency
1 Alert
2 Critical
3 Error
4 Warning
5 Notification
6 Informational
7 Debugging
```

Give memory aids.

---

# 23. QoS

Teach:

- Classification
- Marking
- Queuing
- Congestion
- Policing
- Shaping
- Voice/video sensitivity

Explain DSCP conceptually.

---

# 24. SSH

Teach secure remote administration.

Configuration example:

```text
hostname R1
ip domain-name lab.local
username admin privilege 15 secret Cisco123!

crypto key generate rsa

line vty 0 4
 login local
 transport input ssh
```

Verification:

```text
show ip ssh
```

---

# PHASE 5 — SECURITY FUNDAMENTALS

> Exam domain emphasis: approximately 15%.

---

# 25. SECURITY FOUNDATIONS

## Module 5.1 — Security Concepts

Teach:

- Threat
- Vulnerability
- Exploit
- Risk
- Attack surface
- Mitigation

---

## Module 5.2 — Common Threats

Cover:

- Malware
- Phishing
- Social engineering
- Password attacks
- Man-in-the-middle
- DoS
- DDoS
- Spoofing
- Rogue AP
- Insider threats

---

# 26. DEVICE HARDENING

Teach:

- Strong passwords
- Enable secret
- Local users
- SSH
- Disable unused ports
- Secure management access
- Banner
- Password encryption awareness

Example:

```text
enable secret StrongPassword
service password-encryption
banner motd #Authorized Access Only#
```

---

# 27. ACCESS CONTROL LISTS

## Module 5.3 — ACL Fundamentals

Teach:

> ACL = a list of rules that determines which traffic is permitted or denied.

---

## Module 5.4 — Standard ACLs

```text
access-list 10 permit 192.168.10.0 0.0.0.255
```

Teach wildcard masks carefully.

---

## Module 5.5 — Extended ACLs

```text
access-list 100 permit tcp 192.168.10.0 0.0.0.255 host 10.0.0.10 eq 80
```

Teach:

- Source
- Destination
- Protocol
- Port

---

## Module 5.6 — Named ACLs

```text
ip access-list extended WEB_ACCESS
 permit tcp 192.168.10.0 0.0.0.255 host 10.0.0.10 eq 443
 deny ip any any
```

---

## Module 5.7 — ACL Placement

Teach:

- Standard ACL → close to destination
- Extended ACL → close to source

Explain this as a guideline, not a magical rule.

---

# 28. PORT SECURITY

Teach:

- Maximum MAC addresses
- Sticky learning
- Violation modes

Commands:

```text
switchport port-security
switchport port-security maximum 2
switchport port-security mac-address sticky
switchport port-security violation restrict
```

Verification:

```text
show port-security
show port-security interface f0/1
```

---

# 29. DHCP SNOOPING

Teach:

- Trusted ports
- Untrusted ports
- Rogue DHCP prevention
- Binding table

Commands:

```text
ip dhcp snooping
ip dhcp snooping vlan 10,20

interface g0/1
 ip dhcp snooping trust
```

---

# 30. DYNAMIC ARP INSPECTION

Teach:

- ARP spoofing
- DHCP snooping binding dependency
- Trusted ports

Commands:

```text
ip arp inspection vlan 10,20
```

---

# 31. AAA

Teach:

- Authentication
- Authorization
- Accounting
- RADIUS
- TACACS+

Compare RADIUS and TACACS+ conceptually.

---

# 32. VPN AND SECURITY ARCHITECTURE

Teach concepts:

- Site-to-site VPN
- Remote-access VPN
- IPsec
- Encryption
- Authentication
- Firewalls
- IDS
- IPS

No excessive deep-dive beyond CCNA level.

---

# PHASE 6 — AUTOMATION AND PROGRAMMABILITY

> Exam domain emphasis: approximately 10%.

---

# 33. WHY NETWORK AUTOMATION?

Explain traditional CLI management vs automated management.

Scenario:

> Configuring 3 switches manually is easy. Configuring 3,000 switches manually creates inconsistency and human error.

---

# 34. CONTROLLER-BASED NETWORKING

Teach:

- Control plane
- Data plane
- Management plane
- Traditional distributed control
- Controller-based architecture
- Northbound APIs
- Southbound APIs
- Underlay
- Overlay
- Fabric

---

# 35. SOFTWARE-DEFINED NETWORKING

Explain:

- Centralized policy
- Abstraction
- Automation
- Intent-based concepts

Keep vendor-specific material aligned with exam scope.

---

# 36. REST APIs

Teach:

- API
- REST
- Endpoint
- URI
- Request
- Response
- HTTP
- HTTPS

HTTP methods:

```text
GET
POST
PUT
PATCH
DELETE
```

Explain CRUD:

```text
Create
Read
Update
Delete
```

Teach authentication concepts such as:

- Basic authentication
- Tokens
- API keys
- OAuth awareness where appropriate

---

# 37. HTTP STATUS CODES

Teach common status codes:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

Interactive matching quiz required.

---

# 38. DATA FORMATS

## JSON

Example:

```json
{
  "hostname": "R1",
  "interface": "GigabitEthernet0/0",
  "status": "up"
}
```

Teach:

- Objects
- Arrays
- Keys
- Values

## XML

Teach only CCNA-level familiarity.

---

# 39. CONFIGURATION MANAGEMENT

Teach conceptually:

## Ansible

- Agentless
- YAML playbooks
- Automation

## Terraform

- Infrastructure as Code
- Desired infrastructure state
- Providers
- Declarative configuration

Show simple examples but do not turn this into a DevOps course.

---

# 40. AI AND MACHINE LEARNING IN NETWORK OPERATIONS

Include current CCNA v1.1 awareness.

Teach:

## Predictive AI

Possible uses:

- Capacity forecasting
- Anomaly detection
- Failure prediction
- Performance trends

## Generative AI

Possible uses:

- Natural-language troubleshooting assistance
- Configuration explanations
- Documentation
- Log summarization

Discuss benefits and limitations:

- Hallucinations
- Incorrect configurations
- Security/privacy concerns
- Human verification

---

# PHASE 7 — TROUBLESHOOTING MASTERCLASS

Create a dedicated troubleshooting area.

---

# 41. TROUBLESHOOTING METHOD

Teach a repeatable process:

1. Define the problem
2. Gather information
3. Identify likely layer
4. Form a hypothesis
5. Test one thing at a time
6. Fix the root cause
7. Verify
8. Document

---

# 42. TROUBLESHOOTING TOOLBOX

Commands must include:

```text
ping
traceroute
show ip interface brief
show interfaces
show vlan brief
show interfaces trunk
show mac address-table
show spanning-tree
show etherchannel summary
show cdp neighbors
show lldp neighbors
show ip route
show ip protocols
show ip ospf neighbor
show access-lists
show ip nat translations
show port-security
show running-config
show startup-config
```

For every command explain:

- What it reveals
- When to use it
- What normal output looks like
- What broken output might look like

---

# 43. TROUBLESHOOTING SCENARIOS

Generate many scenarios.

Examples:

### Scenario 1 — PC Cannot Reach Gateway

Potential causes:

- Wrong IP
- Wrong subnet mask
- Wrong gateway
- Switchport in wrong VLAN
- Interface shut down

### Scenario 2 — VLANs Cannot Communicate

Potential causes:

- Missing SVI
- Router subinterface missing
- Wrong dot1q VLAN
- Trunk not configured
- `ip routing` missing

### Scenario 3 — OSPF Neighbor Missing

Potential causes:

- Wrong network
- Wrong area
- Interface down
- Passive interface

### Scenario 4 — EtherChannel Down

Potential causes:

- Trunk mismatch
- Channel protocol mismatch
- Speed mismatch
- Duplex mismatch

### Scenario 5 — DHCP Clients Get No Address

Potential causes:

- Pool missing
- Wrong network
- No helper address
- VLAN issue
- DHCP server unreachable

---

# PHASE 8 — HANDS-ON LAB TRACK

Labs should progressively become harder.

---

# 44. LAB LEVEL 1 — BEGINNER

Labs:

1. Connect two PCs
2. Configure IPv4 addresses
3. Basic switch configuration
4. Basic router configuration
5. Ping troubleshooting
6. Save configurations

---

# 45. LAB LEVEL 2 — SWITCHING

Labs:

1. VLAN creation
2. Access ports
3. Trunk links
4. Native VLAN
5. Inter-VLAN routing
6. STP root selection
7. PortFast + BPDU Guard
8. EtherChannel
9. Port security

---

# 46. LAB LEVEL 3 — ROUTING

Labs:

1. Static routing
2. Default routing
3. Floating static route
4. IPv6 routing
5. Single-area OSPF
6. OSPF troubleshooting

---

# 47. LAB LEVEL 4 — SERVICES

Labs:

1. DHCP server
2. DHCP relay
3. Static NAT
4. PAT
5. NTP
6. SSH
7. Syslog concepts
8. SNMP concepts

---

# 48. LAB LEVEL 5 — SECURITY

Labs:

1. Standard ACL
2. Extended ACL
3. Named ACL
4. Port security
5. DHCP snooping
6. DAI
7. Secure management
8. Wireless security

---

# 49. LAB LEVEL 6 — CAPSTONE

Build a fictional company:

# Pacific Tech Solutions

Locations:

```text
HQ
Branch-A
Branch-B
```

Departments:

```text
Management
IT
Sales
HR
Guest
Servers
```

Required VLANs:

```text
VLAN 10 MANAGEMENT
VLAN 20 IT
VLAN 30 SALES
VLAN 40 HR
VLAN 50 GUEST
VLAN 60 SERVERS
VLAN 99 MANAGEMENT
VLAN 999 UNUSED
```

Requirements:

- IPv4 addressing
- IPv6 addressing
- VLSM
- VLANs
- Trunks
- Inter-VLAN routing
- STP root placement
- EtherChannel
- OSPF
- Static default route
- DHCP
- DHCP relay
- NAT/PAT
- ACLs
- SSH
- Port security
- DHCP snooping
- DAI
- NTP
- Wireless guest network
- Device verification
- Full troubleshooting checklist

Learner should receive only the business requirements first.

Do not immediately show the solution.

Provide:

- Hint 1
- Hint 2
- Partial solution
- Full solution

only when requested.

---

# 50. PACKET TRACER LAB PAGE DESIGN

Each lab page should show:

### Left Panel

- Topology
- Objectives
- IP addressing table
- Requirements

### Center

- Step-by-step instructions

### Right Panel

- Commands
- Hints
- Validation checklist

### Bottom

- “I completed this lab”
- “Show Hint”
- “Show Solution”
- “Reset Lab Progress”
- Notes field

Allow learner to upload or link a `.pkt` filename for their own tracking if direct parsing is unavailable.

---

# 51. NETWORK DIAGRAM SYSTEM

Use SVG whenever possible.

Required diagrams include:

- LAN
- WAN
- Router forwarding
- Switch forwarding
- ARP process
- DHCP DORA
- DNS query
- NAT translation
- VLAN
- Trunk
- Router-on-a-stick
- Layer 3 switch
- STP topology
- EtherChannel
- OSPF topology
- Wireless topology
- Controller architecture
- REST API flow

Diagrams should support:

- Hover labels
- Packet animation
- Interface labels
- IP labels
- VLAN labels
- Highlight current path

---

# 52. PACKET WALKTHROUGH ENGINE

Create interactive packet journeys.

Example scenario:

```text
PC-A
192.168.10.10
      |
      |
SW1
      |
      |
R1
      |
      |
R2
      |
      |
SW2
      |
      |
Server
192.168.20.10
```

At each hop show:

- Source MAC
- Destination MAC
- Source IP
- Destination IP
- TTL
- Routing decision
- ARP action if needed

Critical concept:

**IP source/destination generally stay end-to-end while Layer 2 MAC addresses change at routed hops.**

This needs to be visually obvious.

---

# 53. COMMAND LAB

Create `/cli-lab`.

Learner sees a simulated Cisco prompt.

Example:

```text
Switch>
```

Prompt:

> Configure the hostname as SW1.

Expected:

```text
enable
configure terminal
hostname SW1
```

The simulator should:

- Accept command abbreviations
- Track configuration mode
- Provide CLI help
- Mark incorrect commands
- Explain syntax
- Support a limited command tree

---

# 54. COMMAND LIBRARY

Create searchable command reference.

Categories:

- Basics
- Interfaces
- VLANs
- Trunks
- STP
- EtherChannel
- Routing
- OSPF
- DHCP
- NAT
- ACL
- SSH
- Security
- Verification
- Troubleshooting

Each command card includes:

```text
Command
Purpose
Syntax
Configuration mode
Example
Verification
Common mistake
```

---

# 55. FLASHCARD SYSTEM

Flashcards should support:

- Flip card
- Know it
- Review again
- Hard
- Easy
- Shuffle
- Filter by domain

Examples:

Front:

> What does ARP resolve?

Back:

> An IPv4 address to a Layer 2 MAC address on the local network.

Front:

> What is the default OSPF administrative distance?

Back:

> 110

Use spaced repetition logic.

---

# 56. QUIZ ENGINE

Question types:

- Multiple choice
- Multiple response
- True/false
- Matching
- Drag and drop
- Fill in the blank
- Command ordering
- CLI configuration
- Subnetting calculation
- Diagram analysis
- Routing table analysis
- Troubleshooting scenario

After each question provide:

- Correct answer
- Explanation
- Why other answers are wrong
- Exam objective
- Difficulty
- Related lesson

---

# 57. EXAM SIMULATOR

Create realistic full practice exams.

Settings:

- 30-question quick exam
- 50-question exam
- 65-question simulation
- Domain-specific exam
- Weak-topic exam
- Custom exam

Timer options:

- Timed
- Untimed

Practice exam screen must hide answers until submitted.

After submission show:

```text
Score
Accuracy
Time
Performance by domain
Weakest topics
Strongest topics
Questions flagged
Incorrect answers
Recommended lessons
Recommended labs
```

Do not present a fake guaranteed passing score.

Use language such as:

```text
Exam Readiness Estimate
Needs Review
Developing
Nearly Ready
Strong
```

---

# 58. QUESTION QUALITY RULES

Questions must test understanding rather than trivia.

Bad:

> What does VLAN stand for?

Useful occasionally, but insufficient.

Better:

> PC1 and PC2 are connected to the same switch but belong to different VLANs. Both have valid IP addresses. Why can they not communicate directly?

Best:

> Given a topology, switch configuration, IP addressing table, and trunk output, identify the single configuration error preventing VLAN 20 connectivity.

---

# 59. DAILY STUDY SYSTEM

Allow plans such as:

- 30 minutes/day
- 60 minutes/day
- 90 minutes/day
- 2 hours/day

Allow target durations:

- 4 weeks
- 6 weeks
- 8 weeks
- 12 weeks
- Custom date

Example 8-week path:

```text
Week 1  Fundamentals + Binary + IPv4
Week 2  Subnetting + IPv6
Week 3  VLANs + Trunks + STP
Week 4  EtherChannel + Wireless + Routing
Week 5  Static Routes + OSPF
Week 6  IP Services + ACLs
Week 7  Security + Automation
Week 8  Labs + Troubleshooting + Practice Exams
```

---

# 60. DASHBOARD

Dashboard cards:

- Overall progress
- Current streak
- Lessons completed
- Labs completed
- Quiz average
- Practice exam average
- Subnetting accuracy
- Subnetting speed
- Weak topics
- Strong topics
- Recommended next lesson
- Study time this week

---

# 61. DOMAIN PROGRESS

Display:

```text
Network Fundamentals           74%
Network Access                 61%
IP Connectivity                57%
IP Services                    68%
Security Fundamentals          50%
Automation & Programmability   42%
```

Clicking a domain opens:

- Lessons
- Quizzes
- Labs
- Weak objectives
- Review cards

---

# 62. WEAKNESS ENGINE

Track missed questions.

Example:

If the learner repeatedly misses:

- OSPF DR/BDR
- IPv6 link-local
- STP roles
- ACL wildcard masks

Automatically create:

# Your Review Queue

```text
1. STP Root Port Selection
2. IPv6 Address Types
3. OSPF DR/BDR Election
4. ACL Wildcard Mask Practice
```

---

# 63. STUDY STREAKS

Track:

- Current streak
- Longest streak
- Weekly goal
- Lessons this week
- Labs this week

Do not make gamification distracting.

---

# 64. ACHIEVEMENTS

Examples:

```text
First Ping
Subnetting Rookie
Subnetting Ninja
VLAN Builder
STP Survivor
OSPF Neighbor
ACL Defender
Packet Detective
CLI Warrior
Lab Master
CCNA Practice Champion
```

---

# 65. NOTES SYSTEM

Allow notes per lesson.

Features:

- Markdown support
- Autosave
- Highlight command
- Mark important
- Search notes
- Export notes

---

# 66. BOOKMARKS

Allow bookmark of:

- Lessons
- Commands
- Quiz questions
- Labs
- Flashcards

---

# 67. SEARCH

Global search should find:

- Topic names
- Commands
- Protocols
- Ports
- Definitions
- Labs
- Quiz topics

Example:

Search:

```text
OSPF
```

Return:

```text
Lesson: OSPF Fundamentals
Lesson: OSPF Neighbors
Lab: Configure Single-Area OSPF
Command: show ip ospf neighbor
Flashcards: 24
Quiz: OSPF Practice
```

---

# 68. PORT NUMBER TRAINER

Include common network ports relevant to foundational networking.

Examples:

```text
FTP       20/21
SSH       22
Telnet    23
SMTP      25
DNS       53
DHCP      67/68
HTTP      80
POP3      110
NTP       123
IMAP      143
SNMP      161/162
HTTPS     443
```

Games:

- Port → Protocol
- Protocol → Port
- Timed mode
- Matching

---

# 69. PROTOCOL COMPARISON CARDS

Examples:

## TCP vs UDP

| TCP | UDP |
|---|---|
| Connection-oriented | Connectionless |
| Reliable | Best effort |
| Sequencing | No sequencing |
| More overhead | Lower overhead |

## SSH vs Telnet

## Static vs Dynamic Routing

## IPv4 vs IPv6

## Access Port vs Trunk

## RADIUS vs TACACS+

## Layer 2 vs Layer 3 Switch

---

# 70. “WHAT HAPPENS NEXT?” TRAINER

Ask packet-flow questions.

Example:

> PC-A wants to send traffic to 192.168.20.10, which is on another subnet. PC-A has no ARP cache entry. What does it ARP for?

Correct conceptual answer:

> The MAC address of its default gateway, not the remote server.

These conceptual questions should appear frequently.

---

# 71. EXAM TRAPS SECTION

Create a reusable callout:

> ⚠️ **CCNA Exam Trap**

Examples:

- A switch learns MAC addresses from the **source** MAC, not destination MAC.
- Hosts send remote-subnet traffic to the **default gateway**.
- Routing uses the **longest prefix match**.
- VLANs create separate Layer 2 broadcast domains.
- Trunks carry multiple VLANs.
- `no shutdown` may be required on router interfaces.
- Extended ACLs are generally placed near the source.
- OSPF uses cost, not hop count.
- STP chooses a root bridge using Bridge ID.
- MAC addresses change across routed hops; IP addresses usually do not.

---

# 72. “PRO TIP” CALLOUT

Examples:

> 💡 **Pro Tip:** Before changing configuration, check the current state with `show` commands.

> 💡 **Pro Tip:** In troubleshooting, verify Layer 1 before assuming you have a routing problem.

> 💡 **Pro Tip:** If an interface shows `administratively down`, look for `shutdown`.

---

# 73. “TAGLISH MODE”

Add a toggle:

```text
Explanation Style:
[ English ]
[ Simple English ]
[ Taglish ]
```

Example technical statement:

English:

> ARP resolves an IPv4 address to a MAC address on the local broadcast domain.

Taglish:

> Kapag alam mo ang IP pero kailangan ng Ethernet frame ang MAC address, ARP ang nagtatanong: “Sino ang may IP na ito? Pakibigay MAC address mo.”

Do not translate commands.

---

# 74. “TEACH ME LIKE I’M 10” BUTTON

For difficult sections, provide a simplified alternate explanation.

Topics especially suited:

- ARP
- VLAN
- Trunk
- STP
- Routing
- OSPF
- NAT
- ACL
- Subnetting
- APIs

---

# 75. UI / UX DESIGN

Style:

- Modern
- Professional
- Clean
- Cisco/network-inspired
- Not visually copied from Cisco
- Comfortable for long study sessions

Layout:

```text
Sidebar
 ├─ Dashboard
 ├─ Learn
 ├─ Labs
 ├─ Subnetting
 ├─ CLI Practice
 ├─ Flashcards
 ├─ Quizzes
 ├─ Practice Exams
 ├─ Commands
 ├─ Notes
 └─ Progress
```

---

# 76. COURSE PAGE UI

Each course section card should show:

```text
Module number
Module title
Lessons
Estimated time
Completion %
Quiz score
Lab status
```

Example:

```text
Module 3 — VLANs & Trunking
8 Lessons
2 Labs
1 Quiz
2h 40m
████████░░ 80%
```

---

# 77. LESSON PAGE UI

Desktop:

```text
┌───────────────────────┬──────────────────────────────┬────────────────────┐
│ Course Navigation     │ Main Lesson                  │ Lesson Tools       │
│                       │                              │                    │
│ Previous lessons      │ Explanation                  │ Progress           │
│ Current lesson        │ Diagram                      │ Notes              │
│ Next lessons          │ Commands                     │ Flashcards         │
│                       │ Lab                          │ Bookmark           │
└───────────────────────┴──────────────────────────────┴────────────────────┘
```

Mobile:

- Collapsible navigation
- Sticky lesson progress
- Large command blocks
- Comfortable touch controls

---

# 78. ACCESSIBILITY

Include:

- Keyboard navigation
- ARIA labels
- Proper semantic HTML
- High-contrast support
- Visible focus states
- Screen-reader-friendly controls
- Reduced-motion option
- Diagram text alternatives

---

# 79. RESPONSIVE DESIGN

Support:

```text
Desktop
Laptop
Tablet
Mobile
```

Minimum targets:

```text
320px mobile
768px tablet
1024px desktop
1440px wide desktop
```

---

# 80. THEME SUPPORT

Add:

```text
Light
Dark
System
```

Code blocks and network diagrams must remain readable in all modes.

---

# 81. TECH STACK

Recommended:

## Frontend

```text
React
Vite
TypeScript preferred
React Router
CSS Modules / Tailwind CSS
Lucide icons
```

Alternative:

```text
HTML
CSS
Vanilla JavaScript
```

React is preferred because of:

- Course routing
- Interactive quiz state
- Dynamic subnetting
- Progress dashboard
- Lab state
- Flashcards
- Exam simulator

---

# 82. OPTIONAL BACKEND

Start local-first.

Phase 1:

```text
localStorage
IndexedDB
```

Store:

- Progress
- Quiz scores
- Exam history
- Notes
- Flashcard state
- Bookmarks
- Settings

Later optional backend:

```text
Supabase
Firebase
```

Possible features:

- Authentication
- Cloud sync
- Multi-device progress
- Leaderboards
- Instructor dashboards

The app must still be useful without a backend.

---

# 83. RECOMMENDED PROJECT STRUCTURE

```text
ccna-mastery/
│
├── public/
│   ├── diagrams/
│   ├── icons/
│   └── labs/
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── lessons/
│   │   ├── quizzes/
│   │   ├── labs/
│   │   ├── subnetting/
│   │   ├── cli/
│   │   ├── flashcards/
│   │   └── charts/
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Learn.tsx
│   │   ├── Lesson.tsx
│   │   ├── Labs.tsx
│   │   ├── Subnetting.tsx
│   │   ├── CLIPractice.tsx
│   │   ├── Flashcards.tsx
│   │   ├── Quizzes.tsx
│   │   ├── Exams.tsx
│   │   ├── Commands.tsx
│   │   ├── Notes.tsx
│   │   └── Progress.tsx
│   │
│   ├── data/
│   │   ├── curriculum/
│   │   ├── lessons/
│   │   ├── questions/
│   │   ├── flashcards/
│   │   ├── commands/
│   │   └── labs/
│   │
│   ├── hooks/
│   ├── utils/
│   ├── store/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── PROJECT.md
├── README.md
└── package.json
```

---

# 84. LESSON DATA MODEL

Example:

```ts
type Lesson = {
  id: string;
  moduleId: string;
  domain: string;
  title: string;
  description: string;
  objectives: string[];
  estimatedMinutes: number;
  difficulty: "beginner" | "intermediate" | "exam";
  sections: LessonSection[];
  commands?: CiscoCommand[];
  quizIds: string[];
  labIds?: string[];
  flashcardIds: string[];
  examObjectives: string[];
};
```

---

# 85. QUESTION DATA MODEL

```ts
type Question = {
  id: string;
  domain: string;
  objective: string;
  difficulty: "easy" | "medium" | "hard";
  type:
    | "single"
    | "multiple"
    | "true-false"
    | "matching"
    | "ordering"
    | "subnetting"
    | "cli"
    | "troubleshooting";
  prompt: string;
  choices?: string[];
  correctAnswer: unknown;
  explanation: string;
  wrongAnswerExplanations?: Record<string, string>;
  relatedLessonIds: string[];
};
```

---

# 86. PROGRESS DATA MODEL

```ts
type LearnerProgress = {
  completedLessons: string[];
  completedLabs: string[];
  quizScores: Record<string, number[]>;
  examHistory: ExamResult[];
  flashcardState: Record<string, FlashcardProgress>;
  weakObjectives: Record<string, number>;
  subnettingStats: {
    attempted: number;
    correct: number;
    averageSeconds: number;
    bestStreak: number;
  };
  studyStreak: number;
  totalStudyMinutes: number;
};
```

---

# 87. SUBNETTING GENERATOR LOGIC

The generator must create mathematically correct questions.

Functions should include concepts similar to:

```text
ipToInt()
intToIp()
prefixToMask()
maskToPrefix()
networkAddress()
broadcastAddress()
firstHost()
lastHost()
usableHostCount()
sameSubnet()
randomSubnetQuestion()
```

Automated tests are required.

Never rely on hardcoded answers for generated subnet problems.

---

# 88. ROUTING TABLE TRAINER

Generate routing tables.

Example:

```text
C 192.168.10.0/24 is directly connected, G0/0
S 10.0.0.0/8 via 172.16.0.2
O 10.10.0.0/16 [110/20] via 172.16.0.6
S* 0.0.0.0/0 via 203.0.113.1
```

Ask:

- Which route matches?
- What next hop is used?
- Which route has the longest prefix?
- Which route is the default?
- What does `[110/20]` mean?

---

# 89. ACL TRAINER

Generate scenarios.

Example:

Goal:

> Permit VLAN 10 to access HTTPS on Server1 but deny all other traffic from VLAN 10 to Server1.

Student builds ACL from pieces.

Evaluate:

- Correct protocol
- Correct source
- Correct destination
- Correct wildcard
- Correct port
- Correct sequence
- Correct placement

---

# 90. STP TRAINER

Generate switch topologies.

Learner must identify:

- Root bridge
- Root ports
- Designated ports
- Alternate ports
- Blocked/discarding path

Allow step-by-step reasoning.

---

# 91. OSPF TRAINER

Generate:

- Router IDs
- Interface costs
- Neighbor topologies
- Routing tables

Ask:

- Which router becomes DR?
- Which router becomes BDR?
- Why is adjacency failing?
- Which path has lowest OSPF cost?
- Which networks are being advertised?

---

# 92. COMMAND MEMORY MODE

Prompt:

> Configure interface G0/1 with IP 10.1.1.1/24 and enable it.

Learner types:

```text
enable
configure terminal
interface g0/1
ip address 10.1.1.1 255.255.255.0
no shutdown
```

Provide progressively weaker hints.

---

# 93. CONFIGURATION DIFF CHALLENGES

Show:

### Expected

```text
interface g0/1
 switchport mode access
 switchport access vlan 20
```

### Current

```text
interface g0/1
 switchport mode access
 switchport access vlan 10
```

Question:

> Why can PC2 not reach its VLAN 20 gateway?

Learner identifies the mismatch.

---

# 94. PRACTICE EXAM CONTENT RULES

Create a large original question bank.

Minimum long-term targets:

```text
Network Fundamentals          250+
Network Access                250+
IP Connectivity               300+
IP Services                   150+
Security Fundamentals         200+
Automation & Programmability  150+
```

Total long-term target:

**1,300+ original questions**

Initial MVP can contain fewer questions, but data architecture must support expansion.

Do not copy copyrighted exam dumps.

Do not claim that questions are actual Cisco exam questions.

---

# 95. LAB CONTENT TARGETS

Long-term:

```text
Beginner Labs          10+
Switching Labs         20+
Routing Labs           20+
Services Labs          15+
Security Labs          15+
Troubleshooting Labs   20+
Capstone Labs           5+
```

Target:

**100+ guided/challenge labs**

---

# 96. FLASHCARD TARGETS

Long-term:

**500+ flashcards**

Categories:

- Definitions
- Commands
- Ports
- Protocols
- IPv4
- IPv6
- Switching
- Routing
- Security
- Automation

---

# 97. HOME PAGE

Hero:

```text
MASTER THE CCNA
From Zero Networking Knowledge to Exam-Ready

Learn networking visually.
Build real Cisco configurations.
Master subnetting.
Troubleshoot real scenarios.
Prepare for 200-301 CCNA.
```

Buttons:

```text
Start Learning
Continue Course
Take Diagnostic Test
Practice Subnetting
```

Sections:

- Six CCNA domains
- How the platform works
- Hands-on labs
- Interactive subnetting
- CLI practice
- Practice exams
- Progress analytics

---

# 98. FIRST-TIME ONBOARDING

Ask:

### Experience

```text
Brand new
Some IT knowledge
Networking student
Working IT professional
```

### Goal

```text
Learn networking
Pass CCNA
Prepare for school
Improve job skills
```

### Study Time

```text
30 min/day
1 hr/day
90 min/day
2 hr/day
```

Then generate a recommended learning path.

---

# 99. DIAGNOSTIC ASSESSMENT

Optional 30–40 questions.

Test:

- Networking basics
- IPv4
- Subnetting
- Switching
- Routing
- Services
- Security
- Automation

Use results to customize the starting point.

Do not block beginners from starting at Module 0.

---

# 100. PROGRESSIVE DIFFICULTY

Use three levels.

## Beginner

Question:

> What device forwards packets between different IP networks?

## Intermediate

Question:

> R1 has routes to 10.0.0.0/8 and 10.1.0.0/16. Which route is used for 10.1.5.10?

## Exam-Level

Give:

- Routing table
- Topology
- Interface statuses
- Configuration snippets

Ask learner to determine the forwarding path or failure.

---

# 101. LAB PHILOSOPHY

Every major configuration topic should follow:

```text
Learn
↓
Watch
↓
Configure
↓
Verify
↓
Break
↓
Troubleshoot
↓
Rebuild from memory
```

The learner must not stay dependent on copy/paste.

---

# 102. CONFIGURATION STYLE

Whenever showing IOS configuration:

```text
R1# configure terminal
R1(config)# interface g0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
```

Then explain each line.

Also provide a clean copyable version:

```text
configure terminal
interface g0/0
ip address 192.168.1.1 255.255.255.0
no shutdown
end
```

---

# 103. VERIFICATION-FIRST HABIT

Every configuration lesson must explicitly teach verification.

Example VLAN lesson:

Configuration:

```text
vlan 10
name SALES
```

Verification:

```text
show vlan brief
```

Example OSPF lesson:

```text
show ip ospf neighbor
show ip route ospf
show ip protocols
```

Example NAT lesson:

```text
show ip nat translations
show ip nat statistics
```

---

# 104. “DON’T MEMORIZE THIS YET” CALLOUT

Some lessons should reassure beginners.

Example:

> You do not need to memorize every STP detail on the first pass. First understand why loops are dangerous and why a redundant link may need to stop forwarding.

This reduces cognitive overload.

---

# 105. “MEMORIZE THIS” CALLOUT

Use selectively.

Example:

> **Memorize:** OSPF administrative distance = **110**.

> **Memorize:** IPv6 link-local addresses use **FE80::/10**.

> **Memorize:** SSH uses TCP port **22**.

---

# 106. REVIEW CYCLES

After every 3–5 modules:

- 10-question review
- Flashcard review
- 1 mini lab
- 1 troubleshooting scenario

After each domain:

- Domain summary
- Domain quiz
- Domain lab
- Domain exam

---

# 107. DOMAIN CHECKPOINTS

Example:

# Network Access Checkpoint

Learner should be able to:

- Configure VLANs
- Configure access ports
- Configure trunks
- Explain native VLAN
- Explain STP
- Identify STP roles
- Configure PortFast/BPDU Guard
- Configure EtherChannel
- Interpret CDP/LLDP
- Explain wireless architecture

If any section is weak, recommend review.

---

# 108. FINAL EXAM READINESS CHECKLIST

The learner should confidently be able to:

## Network Fundamentals

- Explain switches and routers
- Interpret Ethernet behavior
- Configure IPv4
- Subnet quickly
- Configure basic IPv6
- Explain TCP vs UDP

## Network Access

- Configure VLANs
- Configure trunks
- Configure inter-VLAN routing
- Analyze STP
- Configure EtherChannel
- Explain wireless

## IP Connectivity

- Read routing tables
- Apply longest-prefix match
- Configure static routes
- Configure default routes
- Configure single-area OSPF
- Troubleshoot OSPF

## IP Services

- Explain/configure DHCP
- Configure relay
- Explain DNS
- Configure NAT/PAT
- Explain NTP/SNMP/Syslog
- Configure SSH

## Security

- Configure ACLs
- Configure port security
- Explain DHCP snooping
- Explain DAI
- Explain AAA
- Harden devices

## Automation

- Explain controller-based networking
- Understand REST APIs
- Understand JSON
- Understand Ansible
- Understand Terraform
- Explain AI/ML use in network operations

---

# 109. FINAL 7-DAY REVIEW MODE

## Day 1

Network Fundamentals + subnetting

## Day 2

VLANs + trunks + STP + EtherChannel

## Day 3

Routing + static routes

## Day 4

OSPF + routing table drills

## Day 5

IP Services + Security

## Day 6

Automation + troubleshooting

## Day 7

Full practice exam + light review

The platform should automatically generate this based on weak areas.

---

# 110. EXAM-DAY PAGE

Provide a calm checklist:

```text
Review identification requirements
Confirm exam appointment
Sleep adequately
Do not cram late
Read every question carefully
Watch words such as BEST / FIRST / MOST LIKELY
Eliminate clearly wrong answers
Manage time
Flag difficult questions if the testing system permits
Stay calm on simulations
Verify configuration logic
```

Avoid pretending to know undisclosed Cisco scoring methods.

---

# 111. CONTENT ACCURACY RULES

All networking content must be technically accurate.

When uncertainty exists:

1. Prefer official Cisco documentation.
2. Match current 200-301 CCNA exam objectives.
3. Do not teach obsolete commands unless clearly labeled.
4. Distinguish conceptual exam knowledge from actual production best practices.
5. Never use braindumps or stolen exam questions.
6. Explain when Packet Tracer behavior differs from real IOS behavior.
7. Mark vendor-specific behavior clearly.

---

# 112. CODE QUALITY RULES

Codex must:

- Use reusable components
- Avoid giant page components
- Keep lesson data outside presentation components
- Use TypeScript when possible
- Validate quiz data
- Unit-test subnetting utilities
- Persist learner progress safely
- Handle corrupted local storage gracefully
- Avoid unnecessary dependencies
- Use semantic HTML
- Avoid console errors
- Keep responsive behavior consistent
- Lazy-load heavy content where practical

---

# 113. PERFORMANCE REQUIREMENTS

Target:

- Fast initial load
- Route-based code splitting
- Lazy-loaded diagrams
- Minimal layout shift
- Offline-friendly lessons if feasible
- PWA support optional but recommended

---

# 114. PWA MODE

Optional:

- Installable
- Offline lessons
- Offline flashcards
- Offline subnetting
- Offline command reference
- Sync progress when online if backend is later added

---

# 115. TESTING REQUIREMENTS

Automated tests should cover at least:

## Subnetting

- Network address
- Broadcast address
- Host count
- CIDR conversion
- Mask conversion
- Same subnet

## Quiz Engine

- Correct scoring
- Multiple-response scoring
- Exam submission
- Flagged questions

## Progress

- Lesson completion
- Quiz persistence
- Flashcard scheduling
- Weakness calculations

## UI

- Core navigation
- Mobile behavior
- Theme switching

---

# 116. DEVELOPMENT PHASES

Do not try to build the entire vision in one giant pass.

## Phase 1 — Foundation

Build:

- App shell
- Sidebar
- Dashboard
- Routing
- Theme
- Curriculum data model
- Progress persistence

## Phase 2 — Learning Engine

Build:

- Lesson renderer
- Lesson navigation
- Completion system
- Notes
- Bookmarks

## Phase 3 — Fundamentals Content

Build high-quality lessons for:

- Networking basics
- OSI
- Ethernet
- IPv4
- Binary
- Subnetting

## Phase 4 — Practice Engine

Build:

- Quizzes
- Flashcards
- Subnetting generator

## Phase 5 — Switching

Add:

- VLAN
- Trunk
- STP
- EtherChannel
- Wireless

## Phase 6 — Routing

Add:

- Routing tables
- Static routes
- OSPF
- Trainers

## Phase 7 — Services + Security

Add full domain content and labs.

## Phase 8 — Automation

Add:

- APIs
- JSON
- Ansible
- Terraform
- AI/ML concepts

## Phase 9 — Exam Simulator

Add:

- Timed exams
- Analytics
- Weak-topic recommendations

## Phase 10 — Polish

Add:

- Animations
- Better diagrams
- Accessibility
- PWA
- Performance optimization

---

# 117. MVP REQUIREMENTS

The first usable version must include:

- Dashboard
- Course navigation
- At least 20 polished lessons
- Basic notes
- Progress saving
- Subnetting trainer
- 150+ original quiz questions
- 100+ flashcards
- 10+ labs
- Command library
- Dark mode
- Responsive design

Prioritize quality over massive empty content.

---

# 118. DEFINITION OF DONE

The project is not “done” simply because pages exist.

A strong release should allow a learner to:

1. Start with zero networking knowledge.
2. Learn concepts in the correct order.
3. Understand packet flow.
4. Configure Cisco devices.
5. Verify configurations.
6. Troubleshoot broken networks.
7. Perform subnetting without guessing.
8. Complete realistic labs.
9. Practice CCNA-style reasoning.
10. Track strengths and weaknesses.
11. Complete timed exams.
12. Know exactly what to review next.

---

# 119. CODEX WORKING RULES

When implementing this project:

1. Read this entire `PROJECT.md`.
2. Inspect the existing project before changing files.
3. Preserve working features.
4. Build one logical feature at a time.
5. Test after meaningful changes.
6. Never replace good content with placeholders.
7. Avoid “Lorem ipsum”.
8. Do not create fake statistics.
9. Do not claim official Cisco affiliation.
10. Do not copy Cisco copyrighted training content.
11. Use original explanations and questions.
12. Keep exam objective mappings in structured data.
13. Ensure commands shown are syntactically appropriate.
14. Keep beginner explanations simple but technically correct.
15. Use diagrams whenever they materially improve understanding.
16. Provide useful empty/loading/error states.
17. Make the app genuinely usable, not just visually impressive.

---

# 120. STARTING IMPLEMENTATION PROMPT FOR CODEX

Use the following instruction after placing this file in the project root:

```text
Read PROJECT.md completely before making any changes.

Build the CCNA Master Training Platform described in the document.

Start with Phase 1 and create a polished production-quality foundation using React, Vite, and TypeScript.

Requirements for the first implementation:
- Responsive application shell
- Sidebar navigation
- Dashboard
- Course curriculum page
- Lesson page architecture
- Dark/light theme
- Local progress persistence
- Reusable components
- Structured TypeScript lesson data
- Clean professional networking-themed UI
- No placeholder Lorem ipsum
- No fake Cisco branding
- Accessible semantic UI

Then implement the first beginner modules:
1. What Is a Network?
2. Network Devices
3. LAN vs WAN
4. OSI Model
5. TCP/IP Model
6. Ethernet
7. MAC Addresses
8. How a Switch Learns MAC Addresses
9. Binary Basics
10. IPv4 Fundamentals

Each lesson must follow the teaching template from PROJECT.md:
simple explanation, Taglish explanation, technical explanation, analogy, diagram, terminology, exam tip, mini quiz, summary, and next lesson.

After the foundation works, continue incrementally through the development phases in PROJECT.md.

Do not attempt to generate the entire 100+ lesson course in one uncontrolled pass.
Build the platform architecture correctly first, then expand content module-by-module.
```

---

# 121. SAMPLE LESSON CONTENT STYLE

## Topic: Default Gateway

### Simple Explanation

A default gateway is the device your computer sends traffic to when the destination is outside its own local network.

### Taglish

Parang gate palabas ng subdivision.

Kung ang pupuntahan ng packet ay nasa same subdivision/subnet, kaya niyang puntahan directly.

Pero kung nasa ibang subdivision/network, ipapadala muna niya sa gate — ang router.

### Technical Explanation

A host compares the destination IPv4 address with its own address and subnet mask.

If the destination is local, the host attempts to reach the destination directly.

If the destination is remote, the host forwards the packet toward its configured default gateway.

### Example

PC:

```text
IP:       192.168.10.50
Mask:     255.255.255.0
Gateway:  192.168.10.1
```

Destination:

```text
8.8.8.8
```

Because `8.8.8.8` is not in `192.168.10.0/24`, the PC sends the Ethernet frame toward the MAC address of `192.168.10.1`.

### CCNA Exam Trap

The PC does **not** ARP for the MAC address of `8.8.8.8`.

It ARPs for the MAC address of the default gateway.

### Quick Check

> PC1 is `192.168.1.10/24`. It wants to contact `192.168.2.10`. Which Layer 2 destination should PC1 use for the first Ethernet frame?

Answer:

**The MAC address of PC1's default gateway.**

---

# 122. SAMPLE TROUBLESHOOTING LESSON

## Problem

PC1 cannot ping its gateway.

Configuration:

```text
PC1
IP: 192.168.10.25
Mask: 255.255.255.0
Gateway: 192.168.10.1
```

Switch:

```text
interface f0/1
 switchport mode access
 switchport access vlan 20
```

Router/SVI:

```text
interface vlan 10
 ip address 192.168.10.1 255.255.255.0
```

### Question

What is wrong?

### Reasoning

PC1 belongs logically to subnet/VLAN 10, but the switchport is assigned to VLAN 20.

### Fix

```text
interface f0/1
 switchport access vlan 10
```

### Verification

```text
show vlan brief
```

Then test:

```text
ping 192.168.10.1
```

---

# 123. SAMPLE ROUTING REASONING

Routing table:

```text
10.0.0.0/8 via 192.168.1.1
10.10.0.0/16 via 192.168.1.2
10.10.10.0/24 via 192.168.1.3
0.0.0.0/0 via 192.168.1.254
```

Destination:

```text
10.10.10.55
```

Matching routes:

```text
10.0.0.0/8
10.10.0.0/16
10.10.10.0/24
0.0.0.0/0
```

Winner:

```text
10.10.10.0/24
```

because it is the **longest prefix match**.

Next hop:

```text
192.168.1.3
```

---

# 124. END GOAL

The finished platform should make the learner feel:

> “I don't just know the CCNA commands. I understand how the network works.”

The learner should be capable of looking at a topology and reasoning through:

```text
Where will this packet go?
Which MAC address is used?
Which VLAN is this port in?
Which route wins?
Why is OSPF down?
Why is this trunk failing?
Why can this client not get DHCP?
Which ACL entry matches?
What does this show command prove?
```

That reasoning ability is the real goal of the course.

---

# 125. OFFICIAL REFERENCE NOTES

The course structure should remain aligned with the current Cisco **200-301 CCNA v1.1** objectives.

Before a major future content refresh, verify the current Cisco exam page and exam-topic blueprint because certification objectives can change.

Primary reference:

- Cisco — 200-301 CCNA certification/exam page
- Cisco — CCNA exam topics / certification guide
- Cisco — Implementing and Administering Cisco Solutions (CCNA) training overview

---

# FINAL DEVELOPMENT PRIORITY

Build in this order:

```text
UNDERSTANDING
→ VISUALIZATION
→ CONFIGURATION
→ VERIFICATION
→ TROUBLESHOOTING
→ REPETITION
→ EXAM READINESS
```

Never reverse that order by turning the platform into a memorization dump.

**Build a networking engineer's way of thinking first. The certification should follow.**
