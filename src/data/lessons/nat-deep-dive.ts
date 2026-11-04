import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'nat-deep-dive';

export const lesson: Lesson = {
  id: ID,
  moduleId: '4.6',
  domain: 'D4',
  title: 'NAT Deep Dive: Four Addresses, Port Forwarding and Troubleshooting',
  description: 'Follow a packet through NAT step by step, read the translation table with confidence, add port forwarding and fix the classic NAT faults.',
  whyMatters:
    'Ang NAT ay nakakalito dahil may apat na pangalan ng address (inside local, inside global, outside local, outside global). Kapag naintindihan mo kung sino ang tumitingin, magiging madali. Madalas din itong lumabas bilang troubleshooting: “bakit hindi nagta-translate?”',
  objectives: [
    'Name the four NAT address types from the right viewpoint',
    'Trace a packet before and after translation',
    'Read show ip nat translations and statistics',
    'Configure static NAT with port forwarding',
    'Troubleshoot inside/outside, ACL and pool faults',
  ],
  estimatedMinutes: 45,
  difficulty: 'exam',
  keywords: ['NAT', 'PAT', 'inside local', 'inside global', 'outside local', 'outside global', 'port forwarding', 'show ip nat translations', 'overload', 'ip nat inside'],
  examObjectives: ['4.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'NAT rewrites addresses as packets cross the router. Four names describe the same two hosts from two viewpoints: local means “as seen from the inside network” and global means “as seen from the outside”.',
        'Inside means the hosts you own; outside means the hosts on the internet.',
      ],
      taglish: [
        'Ang NAT ay **nagpapalit ng address** habang tumatawid ang packet sa router. May apat na pangalan para sa dalawang host na tinitingnan mula sa dalawang pananaw: **local** = kung paano nakikita ng **loob** ng network, **global** = kung paano nakikita ng **labas**.',
        '**Inside** = mga host na pag-aari mo. **Outside** = mga host sa internet. Kaya: **inside local** ang private address ng PC mo, **inside global** ang public address na nakikita ng internet para sa PC mo.',
        'Para sa outside host (hal. web server): **outside global** ang tunay niyang public address; **outside local** ang address na nakikita ng loob — karaniwang pareho ito kapag walang outside translation.',
      ],
      technical: [
        'Inside local: the address assigned to an inside host, as seen on the inside. Inside global: the address that represents the inside host on the outside. Outside global: the real address of an outside host. Outside local: the address of the outside host as seen on the inside.',
        'With PAT (overload), many inside locals share one inside global, distinguished by unique source port numbers kept in the translation table. Static NAT with ports (port forwarding) maps a fixed inside server and port to an inside global address and port.',
        'ip nat inside and ip nat outside must be set on the interfaces, and a translation rule (static, or an ACL with a pool or interface) must exist. Translation happens when an inside source packet reaches the outside interface; the reply is translated back using the table.',
      ],
    },
    {
      type: 'analogy',
      title: 'Receptionist at extension',
      body: [
        'A company switchboard has one public phone number. Employees have private extensions. When an employee calls out, the receptionist notes “extension 204 called this person” and uses the company number. When the reply comes in, the note tells the receptionist which extension to ring. The note is the NAT table.',
      ],
      taglish: [
        'Parang **switchboard ng kompanya**: isa lang ang public na numero, pero may **private extension** ang bawat empleyado. Kapag may tumawag palabas, isinusulat ng receptionist: “Extension 204 ang tumawag kay Mr. X” at ginagamit ang numero ng kompanya. Kapag sumagot, **binabasa niya ang tala** para malaman kung aling extension ang tatawagan. Ang tala ay ang **NAT table**.',
      ],
    },
    {
      type: 'hook',
      title: 'Local = loob, Global = labas',
      trick: '**LOCAL = tingin ng LOOB. GLOBAL = tingin ng LABAS. INSIDE = sa akin. OUTSIDE = sa kanila.**',
      taglish: [
        '**Inside local** = private address ng PC ko (hal. 192.168.1.10).',
        '**Inside global** = public address ng PC ko sa paningin ng internet (hal. 203.0.113.5).',
        '**Outside global** = tunay na address ng web server (hal. 198.51.100.7).',
        '**Outside local** = address ng web server sa paningin ng loob; kadalasan pareho sa outside global.',
        'Tandaan: ang **inside** na pares ang nagbabago sa karaniwang NAT/PAT; ang outside na pares ay kadalasang pareho.',
      ],
      test: {
        question: 'Ang PC 192.168.1.10 ay pumapasok sa 198.51.100.7 gamit ang router na may 203.0.113.5. Ano ang apat na address?',
        answer: 'Inside local 192.168.1.10; inside global 203.0.113.5; outside global 198.51.100.7; outside local 198.51.100.7 (pareho dahil walang outside NAT).',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Sundan ang isang packet',
      paragraphs: [
        'Ang PC1 (192.168.1.10) ay nagpapadala ng web request sa 198.51.100.7. Ang packet ay may source 192.168.1.10:51000 at destination 198.51.100.7:80.',
        'Pagdating sa router sa **inside interface**, hinahanap ng router ang rule. Dahil tumutugma ito sa ACL at nakatalaga ang overload sa interface na may 203.0.113.5, pinapalitan ng router ang source: **203.0.113.5:51000** (o ibang port kung nagbabanggaan). Isinusulat sa NAT table.',
        'Ang server ay sumasagot sa 203.0.113.5:51000. Pagdating sa router sa **outside interface**, hinahanap ang entry sa table, ibinabalik ang destination sa **192.168.1.10:51000** at ipinapasa sa LAN.',
      ],
      steps: [
        'PC1 sends: 192.168.1.10:51000 → 198.51.100.7:80.',
        'Router matches the inside-source rule and rewrites the source to 203.0.113.5:51000; entry saved.',
        'Server replies: 198.51.100.7:80 → 203.0.113.5:51000.',
        'Router finds the entry, rewrites the destination to 192.168.1.10:51000 and forwards inside.',
      ],
      tricks: [
        'Ang translation ay nangyayari kapag ang packet ay pumapasok sa **inside** at lumalabas sa **outside** (para sa inside source NAT); ang reply ay kabaligtaran.',
        'Walang entry sa table para sa trapikong nagsimula sa labas (maliban sa static NAT) — kaya hindi maabot ng internet ang PC mo.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Basahin ang translation table',
      paragraphs: [
        'Ang `show ip nat translations` ay may apat na column: Pro, Inside global, Inside local, Outside local, Outside global (sa ilang bersyon). Hanapin ang entry para sa PC mo: ang **Inside global** ay may public address at port, ang **Inside local** ay may private.',
        'Ang `show ip nat statistics` ay nagpapakita ng bilang ng active translations, hits at misses, aling interface ang inside at outside, at ang pool/ACL na ginagamit. Ang pagtaas ng **misses** ay palatandaan na hindi nagtutugma ang rule.',
        'Gamitin ang `clear ip nat translation *` para burahin ang dynamic entries habang nagte-test (huwag sa production na may active users).',
      ],
      steps: [
        'Magpadala ng trapiko mula sa PC papunta sa labas.',
        'show ip nat translations: hanapin ang inside local ng PC.',
        'show ip nat statistics: tiyaking tama ang inside/outside interfaces at tumataas ang hits.',
        'Kung walang entry: i-check ang ACL, ang inside/outside at ang route papunta sa labas.',
      ],
      tricks: [
        'Ang entry na may mga port (hal. 203.0.113.5:51000) ay PAT; ang entry na walang port ay one-to-one NAT.',
        'Dynamic entries ay may timeout (default 24 oras para sa TCP/UDP na hindi na ginagamit); static ay permanente.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 3: Port forwarding at mga karaniwang sira',
      paragraphs: [
        'Para maabot ng internet ang web server sa loob (192.168.1.50:80) gamit ang public IP, gumamit ng static NAT na may port: `ip nat inside source static tcp 192.168.1.50 80 203.0.113.5 80`.',
        'Mga karaniwang sira: (1) nakalimutan ang `ip nat inside` o `ip nat outside` sa interface; (2) pinagpalit ang inside at outside; (3) ang ACL ay hindi tumutugma sa private subnet (maling wildcard); (4) ubos ang pool (pool exhaustion) — kaya gamitin ang overload; (5) walang `overload` kaya isa-sa-isa lang ang translation.',
        'Tandaan: ang NAT ACL ay **pumipili lang kung ano ang ita-translate**, hindi ito firewall at hindi nagba-block.',
      ],
      steps: [
        'I-set ang ip nat inside / ip nat outside sa tamang interfaces.',
        'Gumawa ng ACL para sa private subnet (permit 192.168.1.0 0.0.0.255).',
        'ip nat inside source list 1 interface gi0/1 overload.',
        'Para sa server: ip nat inside source static tcp 192.168.1.50 80 203.0.113.5 80.',
        'I-verify gamit ang show ip nat translations at statistics.',
      ],
      tricks: [
        'Kapag ping papunta sa labas ay gumagana pero hindi ang web, tingnan ang ACL at ang return route.',
        'Pagkatapos magpalit ng configuration, i-clear ang translations bago mag-test para hindi manlinlang ang lumang entries.',
      ],
    },
    {
      type: 'remember',
      title: 'NAT na lumalabas sa exam',
      items: [
        '**Inside local = private ng host; inside global = public ng host; outside global = tunay na public ng server.**',
        '**Local = tingin ng loob; global = tingin ng labas.**',
        '**PAT = overload = maraming host, isang public IP, iba’t ibang port.**',
        '**Kailangan ang ip nat inside AT ip nat outside sa mga interface, kasama ang translation rule.**',
        '**NAT ACL = pumipili lang ng ita-translate, hindi firewall.** **Port forwarding = static NAT na may protocol at port.**',
      ],
    },
    { type: 'diagram', id: 'pat-ports', caption: 'Maraming PC, iisang public address; ang port number ang nagpapaiba sa mga translation.' },
    {
      type: 'terms',
      items: [
        { term: 'Inside local', definition: 'The private address of an inside host as seen on the inside network.' },
        { term: 'Inside global', definition: 'The public address that represents an inside host to the outside.' },
        { term: 'Outside global', definition: 'The real address of an outside host.' },
        { term: 'Outside local', definition: 'The address of an outside host as seen on the inside network.' },
        { term: 'Port forwarding', definition: 'Static NAT that maps an outside address and port to an inside server and port.' },
        { term: 'Translation table', definition: 'The list of active NAT mappings kept by the router.' },
        { term: 'Pool exhaustion', definition: 'All addresses in a dynamic NAT pool are in use, so new hosts cannot be translated.' },
      ],
    },
    {
      type: 'flow',
      title: 'Pagkakasunod ng pag-troubleshoot sa NAT',
      steps: [
        'Gumagana ba ang routing papunta sa labas at pabalik? Ping muna mula sa router.',
        'Tama ba ang ip nat inside at ip nat outside sa mga interface?',
        'Tumutugma ba ang ACL (wildcard) sa private subnet?',
        'May overload ba, o may sapat na pool?',
        'Tingnan ang show ip nat translations at show ip nat statistics para sa hits at misses.',
      ],
    },
    {
      type: 'cli',
      title: 'PAT at port forwarding',
      transcript: `R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ip nat inside
R1(config)# interface gigabitEthernet 0/1
R1(config-if)# ip nat outside
R1(config)# ip nat inside source list 1 interface gigabitEthernet 0/1 overload
R1(config)# ip nat inside source static tcp 192.168.1.50 80 203.0.113.5 80
R1# show ip nat translations
Pro Inside global      Inside local       Outside local      Outside global
tcp 203.0.113.5:51000  192.168.1.10:51000 198.51.100.7:80    198.51.100.7:80
tcp 203.0.113.5:80     192.168.1.50:80    ---                ---`,
      copyable: 'access-list 1 permit 192.168.1.0 0.0.0.255\ninterface gigabitEthernet 0/0\nip nat inside\ninterface gigabitEthernet 0/1\nip nat outside\nip nat inside source list 1 interface gigabitEthernet 0/1 overload\nip nat inside source static tcp 192.168.1.50 80 203.0.113.5 80\nshow ip nat translations',
      explain: [
        { line: 'ip nat inside source list 1 interface gigabitEthernet 0/1 overload', why: 'Translates inside hosts matched by ACL 1 to the address of Gi0/1, using ports to share it (PAT).' },
        { line: 'ip nat inside source static tcp 192.168.1.50 80 203.0.113.5 80', why: 'Port forwarding: outside requests to 203.0.113.5:80 go to the inside web server.' },
        { line: 'tcp 203.0.113.5:51000 192.168.1.10:51000', why: 'A dynamic PAT entry: inside local on the right, inside global on the left, with ports.' },
      ],
      note: 'The ACL in the NAT rule only selects which inside hosts are translated; it does not block anything.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **inside global** ay hindi laging pareho ng address ng outside interface. Sa dynamic NAT na may pool, ang inside global ay mula sa **pool** — at maaaring iba sa interface address.' },
    { type: 'callout', kind: 'trap', text: 'Ang `ip nat inside` at `ip nat outside` ay hindi sapat — kailangan din ng translation rule. At ang rule ay hindi sapat nang walang tamang interface assignments.' },
    { type: 'callout', kind: 'tip', text: 'Gumuhit ng packet bago at pagkatapos ng router: isulat ang source at destination sa bawat hakbang. Nagiging halata kung aling address ang local at alin ang global.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Marking both interfaces inside, or swapping inside and outside.',
        'Using a wildcard in the NAT ACL that does not match the private subnet.',
        'Forgetting overload and exhausting a small pool.',
        'Believing the NAT ACL works as a firewall.',
        'Confusing inside local with inside global.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Walang translation',
      scenario: 'Hosts on 192.168.1.0/24 can reach the router but nothing is translated. show ip nat translations is empty and statistics show misses.',
      evidence: `R1# show ip nat statistics
Total active translations: 0
Outside interfaces: GigabitEthernet0/0
Inside interfaces: GigabitEthernet0/1
Hits: 0  Misses: 112`,
      question: 'Ano ang malamang na mali?',
      answer: 'The inside and outside roles are swapped: the LAN-facing interface Gi0/0 is marked outside and the internet-facing Gi0/1 is marked inside, so inside-source traffic never matches the rule.',
      fix: 'Set ip nat inside on the LAN interface and ip nat outside on the internet interface, clear ip nat translation *, retest and confirm that hits increase.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Isulat ang command para i-forward ang HTTPS (TCP 443) mula 203.0.113.5 papunta sa server 192.168.1.60, at sabihin kung anong address ang makikita ng internet para sa server.',
      answer: 'ip nat inside source static tcp 192.168.1.60 443 203.0.113.5 443. The internet sees 203.0.113.5 port 443 (the inside global); the server’s inside local 192.168.1.60 is hidden.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Local = inside network view; global = outside view.',
        'Translations are created for inside source traffic crossing from inside to outside.',
        'PAT uses ports; static NAT with ports is port forwarding.',
        'The NAT ACL selects traffic; it does not filter it.',
        'Use show ip nat translations and statistics first.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Four addresses: inside local/global and outside local/global.',
        'Local = loob, global = labas.',
        'PAT shares one address using ports.',
        'Static NAT with ports forwards outside requests to a server.',
        'Inside/outside must be assigned and a rule must exist.',
        'Susunod: dagdag na lesson sa wireless architectures at IPv6 routing.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'easy', type: 'single',
    prompt: 'What is an inside local address?',
    choices: ['The public address of an inside host', 'The private address of an inside host as seen on the inside network', 'The public address of an outside server', 'The router’s loopback address'], correct: [1],
    explanation: 'Inside local is the address configured on the inside host, normally private.',
    wrong: { 0: 'That is the inside global address.', 2: 'That is the outside global address.', 3: 'Loopbacks are not NAT terms.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'Which command forwards TCP port 80 on 203.0.113.5 to the inside server 192.168.1.50?',
    choices: ['ip nat inside source static tcp 192.168.1.50 80 203.0.113.5 80', 'ip nat outside source static tcp 192.168.1.50 80 203.0.113.5 80', 'ip nat inside source list 1 overload', 'ip nat pool WEB 192.168.1.50 192.168.1.50 netmask 255.255.255.0'], correct: [0],
    explanation: 'Static NAT with a protocol and port maps the inside server (inside local) to the inside global address and port.',
    wrong: { 1: 'That translates outside sources, not inside servers.', 2: 'That is dynamic PAT for outbound traffic.', 3: 'A pool defines addresses; it does not forward a port.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'single',
    prompt: 'show ip nat statistics shows many misses and no active translations. What is a likely cause?',
    choices: ['The inside and outside interfaces are swapped', 'The router has too many routes', 'DNS is slow', 'The switch uses PortFast'], correct: [0],
    explanation: 'If the inside and outside roles are wrong, traffic never matches the NAT rule, so there are misses and no translations.',
    wrong: { 1: 'Route count is not related.', 2: 'DNS does not create NAT misses.', 3: 'PortFast is a switching feature.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'hard', type: 'single',
    prompt: 'A PAT entry reads “tcp 203.0.113.5:51000 192.168.1.10:51000 …”. Which column is the inside global?',
    choices: ['192.168.1.10:51000', '203.0.113.5:51000', 'The outside local column', 'None of them'], correct: [1],
    explanation: 'The Inside global column (left) holds the public address and port; Inside local holds the private address.',
    wrong: { 0: 'That is the inside local address.', 2: 'The outside local column shows the outside host.', 3: 'The left address is the inside global.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: the access list used in an ip nat inside source rule blocks traffic that it denies.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'In NAT the ACL only selects which addresses are translated; it is not a filter.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D4', objective: '4.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are required for inside source NAT to work?',
    choices: ['ip nat inside and ip nat outside on the interfaces', 'A translation rule such as an ACL with overload or a static mapping', 'A DHCP server', 'An IPv6 address'], correct: [0, 1],
    explanation: 'Interfaces must be marked and a rule must define what to translate. DHCP and IPv6 are not required.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Pro tip: local vs global sa NAT?', back: 'LOCAL = tingin ng LOOB. GLOBAL = tingin ng LABAS. INSIDE = sa akin. OUTSIDE = sa kanila.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Inside local vs inside global?', back: 'Inside local = host’s private address; inside global = the public address representing it.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D4', category: 'command', front: 'Command for port forwarding?', back: 'ip nat inside source static tcp <inside ip> <port> <global ip> <port>.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D4', category: 'command', front: 'Which commands inspect NAT?', back: 'show ip nat translations and show ip nat statistics.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D4', category: 'concept', front: 'Does the NAT ACL filter traffic?', back: 'No, it only selects traffic to translate.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D4', category: 'concept', front: 'What does overload do?', back: 'Lets many inside hosts share one address using port numbers (PAT).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D4', category: 'command', front: 'How do you clear dynamic NAT entries?', back: 'clear ip nat translation *.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'PAT, port forwarding and three NAT faults',
  tool: 'Packet Tracer',
  minutes: 40,
  objective: 'Configure PAT and port forwarding, read the translation table, then break and repair inside/outside, ACL and overload faults.',
  steps: [
    'Build a router with an inside LAN 192.168.1.0/24, an outside link to an ISP router and a web server inside at 192.168.1.50.',
    'Configure ip nat inside/outside and PAT with ACL 1 and overload on the outside interface. Ping the ISP from a PC.',
    'Read show ip nat translations and identify inside local and inside global for the PC.',
    'Add port forwarding for the web server and browse to it from an outside host.',
    'Break 1: swap inside and outside. Observe misses and repair.',
    'Break 2: change the ACL wildcard to 0.0.0.0. Observe and repair.',
    'Break 3: remove overload and use a pool of one address with two PCs. Observe exhaustion and repair.',
  ],
  checklist: [
    'PCs reach the outside through one shared address',
    'Translation table read correctly',
    'Port forwarding works from outside',
    'All three faults found with show commands',
  ],
  hints: [
    'show ip nat statistics lists inside and outside interfaces.',
    'Run clear ip nat translation * between tests.',
  ],
  solution: [
    'Correct config: ip nat inside on the LAN, ip nat outside on the WAN, ip nat inside source list 1 interface <wan> overload.',
    'Port forwarding: ip nat inside source static tcp 192.168.1.50 80 <wan ip> 80.',
    'Faults: swapped roles, bad ACL wildcard and missing overload; fix each and verify hits increase.',
  ],
  breakIt: 'Mark both interfaces as ip nat inside and explain why no translation is created.',
};
