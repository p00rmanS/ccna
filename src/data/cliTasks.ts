import { canPing, newDevice, type Device, type Switchport } from '../utils/ios';

export interface CliObjective {
  text: string;
  check: (d: Device) => boolean;
}

export interface CliTask {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate';
  lessonId: string;
  briefing: string[];
  build: () => Device;
  objectives: CliObjective[];
  hints: string[];
  /** The commands that solve the task, in order (verified by a unit test). */
  solution: string[];
}

/** Did the learner run a command (abbreviations allowed, e.g. "sh ip int br")? */
export const ran = (d: Device, ...words: string[]): boolean =>
  d.history.some((h) => {
    const t = h.toLowerCase().split(/\s+/);
    return t.length >= words.length && words.every((w, i) => t[i]!.length > 0 && w.startsWith(t[i]!));
  });

const ranPing = (d: Device, ip: string) => d.history.some((h) => /^p(i(ng?)?)?\s/i.test(h) && h.includes(ip)) && canPing(d, ip);
const iface = (d: Device, name: string) => d.interfaces[name]!;

const gi = (n: number, extra: object = {}) => ({ name: `GigabitEthernet0/${n}`, connected: n !== 2, ...extra });
const fa = (n: number, extra: object = {}) => ({ name: `FastEthernet0/${n}`, connected: true, ...extra });
const sp = (patch: Partial<Switchport>): Switchport => ({ mode: 'dynamic', accessVlan: 1, nativeVlan: 1, allowed: 'all', ...patch });
const port = (d: Device, n: number) => d.interfaces[`FastEthernet0/${n}`]!.switchport!;
const sub = (d: Device, vlan: number, ip: string) => {
  const s = d.interfaces[`GigabitEthernet0/0.${vlan}`];
  return !!s && s.dot1q === vlan && s.ip === ip && s.mask === '255.255.255.0';
};

export const CLI_TASKS: CliTask[] = [
  {
    id: 'first-steps',
    title: 'Get oriented',
    level: 'Beginner',
    lessonId: 'ios-fundamentals',
    briefing: [
      'You have just connected to a brand-new router by console. The prompt is Router> — you are the “Bisita”.',
      'Work your way through the modes, give the router a proper name and stop it from hanging on mistyped commands.',
    ],
    build: () => newDevice({ mode: 'user' }),
    objectives: [
      { text: 'Reach privileged EXEC (the # prompt)', check: (d) => d.visited.includes('priv') },
      { text: 'Enter global configuration mode', check: (d) => d.visited.includes('config') },
      { text: 'Rename the router to R1', check: (d) => d.hostname === 'R1' },
      { text: 'Disable DNS lookup of mistyped commands', check: (d) => !d.domainLookup },
      { text: 'Finish back in privileged EXEC using a single command', check: (d) => d.mode === 'priv' && d.visited.includes('config') },
    ],
    hints: [
      'Bisita → may-ari: the command that turns on privileged commands is “enable”.',
      'From # you need “configure terminal” (or “conf t”) to renovate.',
      'hostname R1 and no ip domain-lookup are both global configuration commands.',
      '“end” takes you straight back to # from any configuration mode.',
    ],
    solution: ['enable', 'configure terminal', 'hostname R1', 'no ip domain-lookup', 'end'],
  },
  {
    id: 'first-interface',
    title: 'Configure and verify an interface',
    level: 'Beginner',
    lessonId: 'ipv4-fundamentals',
    briefing: [
      'R1 connects to a switch on GigabitEthernet0/0. The LAN is 192.168.10.0/24 and the router takes the first address, 192.168.10.1. A PC at 192.168.10.11 is already configured.',
      'Bring the interface up, document it, verify it with a show command, and prove it works with a ping.',
    ],
    build: () => newDevice({ hostname: 'R1', mode: 'priv', interfaces: [gi(0), gi(1), gi(2)], reachable: ['192.168.10.11'] }),
    objectives: [
      { text: 'Give GigabitEthernet0/0 a description that mentions LAN', check: (d) => /lan/i.test(iface(d, 'GigabitEthernet0/0').description) },
      { text: 'Set the address to 192.168.10.1 with mask 255.255.255.0', check: (d) => iface(d, 'GigabitEthernet0/0').ip === '192.168.10.1' && iface(d, 'GigabitEthernet0/0').mask === '255.255.255.0' },
      { text: 'Enable the interface (it must not be administratively down)', check: (d) => !iface(d, 'GigabitEthernet0/0').shutdown },
      { text: 'Verify with show ip interface brief', check: (d) => ran(d, 'show', 'ip', 'interface', 'brief') },
      { text: 'Ping 192.168.10.11 successfully', check: (d) => ranPing(d, '192.168.10.11') },
    ],
    hints: [
      'Enter global configuration first, then select the interface: interface gigabitEthernet 0/0.',
      'ip address needs the dotted mask, not /24.',
      'Router interfaces start shut down — what command undoes “shutdown”?',
      'Leave configuration mode with end before you use show and ping.',
    ],
    solution: ['configure terminal', 'interface gigabitEthernet 0/0', 'description LAN to SW1', 'ip address 192.168.10.1 255.255.255.0', 'no shutdown', 'end', 'show ip interface brief', 'ping 192.168.10.11'],
  },
  {
    id: 'save-config',
    title: 'Save your work (and prove why)',
    level: 'Beginner',
    lessonId: 'ios-fundamentals',
    briefing: [
      'R1 is already configured but the configuration only exists in RAM. If the router reboots now, it is lost.',
      'Save it, check the saved copy, then prove that unsaved changes really are lost on a reload.',
    ],
    build: () => {
      const d = newDevice({
        hostname: 'R1', mode: 'priv', interfaces: [gi(0, { ip: '192.168.10.1', mask: '255.255.255.0', shutdown: false, description: 'LAN' }), gi(1), gi(2)],
      });
      return d;
    },
    objectives: [
      { text: 'Save the running configuration to NVRAM', check: (d) => d.startup !== null },
      { text: 'Check it with show startup-config', check: (d) => ran(d, 'show', 'startup-config') },
      { text: 'Change the hostname to TEMP, do NOT save, run reload, and come back as R1', check: (d) => d.history.some((h) => /^hostname\s+temp$/i.test(h)) && ran(d, 'reload') && d.hostname === 'R1' },
    ],
    hints: [
      'The command to save is copy running-config startup-config (copy run start works too).',
      'For the third goal: save first, then configure terminal, hostname TEMP, end, then reload.',
      'After the reload you are back at Router> — R1’s saved name returns.',
    ],
    solution: ['copy running-config startup-config', 'show startup-config', 'configure terminal', 'hostname TEMP', 'end', 'reload'],
  },
  {
    id: 'vlsm-config',
    title: 'Turn a VLSM plan into configuration',
    level: 'Intermediate',
    lessonId: 'vlsm',
    briefing: [
      'From the VLSM lesson: HQ LAN is 192.168.100.0/25 and Sales LAN is 192.168.100.128/26. R1 uses the first usable address of each.',
      'HQ is on GigabitEthernet0/0 (PC at 192.168.100.10) and Sales on GigabitEthernet0/1 (PC at 192.168.100.140). Configure both, describe them, test both, and save.',
    ],
    build: () => newDevice({ hostname: 'R1', mode: 'priv', interfaces: [gi(0), gi(1), gi(2)], reachable: ['192.168.100.10', '192.168.100.140'] }),
    objectives: [
      { text: 'Gi0/0 = 192.168.100.1 with the /25 mask, enabled', check: (d) => iface(d, 'GigabitEthernet0/0').ip === '192.168.100.1' && iface(d, 'GigabitEthernet0/0').mask === '255.255.255.128' && !iface(d, 'GigabitEthernet0/0').shutdown },
      { text: 'Gi0/1 = 192.168.100.129 with the /26 mask, enabled', check: (d) => iface(d, 'GigabitEthernet0/1').ip === '192.168.100.129' && iface(d, 'GigabitEthernet0/1').mask === '255.255.255.192' && !iface(d, 'GigabitEthernet0/1').shutdown },
      { text: 'Both interfaces have a description', check: (d) => iface(d, 'GigabitEthernet0/0').description !== '' && iface(d, 'GigabitEthernet0/1').description !== '' },
      { text: 'Ping the HQ PC (192.168.100.10) successfully', check: (d) => ranPing(d, '192.168.100.10') },
      { text: 'Ping the Sales PC (192.168.100.140) successfully', check: (d) => ranPing(d, '192.168.100.140') },
      { text: 'Save the configuration', check: (d) => d.startup !== null },
    ],
    hints: [
      '/25 = 255.255.255.128 and /26 = 255.255.255.192.',
      'You can move from one interface straight to another with the interface command — no need to exit first.',
      'Try configuring 192.168.100.65 255.255.255.192 on Gi0/1 first: read the overlap error, and see why largest-first matters.',
    ],
    solution: [
      'configure terminal', 'interface g0/0', 'description HQ LAN', 'ip address 192.168.100.1 255.255.255.128', 'no shutdown',
      'interface g0/1', 'description Sales LAN', 'ip address 192.168.100.129 255.255.255.192', 'no shutdown', 'end',
      'ping 192.168.100.10', 'ping 192.168.100.140', 'copy running-config startup-config',
    ],
  },
  {
    id: 'fix-it',
    title: 'Troubleshoot: nothing can ping',
    level: 'Intermediate',
    lessonId: 'ipv4-fundamentals',
    briefing: [
      'Users on 192.168.10.0/24 (PC at 192.168.10.11) cannot reach anything, and the link to the neighbour router at 10.0.0.2 (a /30 link) is down too.',
      'Use show ip interface brief and show running-config to find the two faults, fix them, prove it with pings and save.',
    ],
    build: () =>
      newDevice({
        hostname: 'R1', mode: 'priv', saved: true, reachable: ['192.168.10.11', '10.0.0.2'],
        interfaces: [
          gi(0, { ip: '192.168.10.1', mask: '255.255.255.0', shutdown: true, description: 'LAN' }),
          gi(1, { ip: '10.0.0.5', mask: '255.255.255.252', shutdown: false, description: 'Link to R2' }),
          gi(2),
        ],
      }),
    objectives: [
      { text: 'Find and fix the interface that is administratively down', check: (d) => !iface(d, 'GigabitEthernet0/0').shutdown },
      { text: 'Fix the address on the R2 link (it must be able to reach 10.0.0.2 in the same /30)', check: (d) => iface(d, 'GigabitEthernet0/1').ip === '10.0.0.1' && iface(d, 'GigabitEthernet0/1').mask === '255.255.255.252' },
      { text: 'Ping 192.168.10.11 successfully', check: (d) => ranPing(d, '192.168.10.11') },
      { text: 'Ping 10.0.0.2 successfully', check: (d) => ranPing(d, '10.0.0.2') },
      { text: 'Save the fix', check: (d) => d.startup !== null && d.startup.interfaces['GigabitEthernet0/0']!.shutdown === false },
    ],
    hints: [
      'Read the Status column of show ip interface brief: “administratively down” is a shutdown.',
      'A /30 has four addresses. 10.0.0.2 lives in 10.0.0.0/30 (usable .1 and .2). Which /30 is 10.0.0.5 in?',
      'Fix the address with ip address 10.0.0.1 255.255.255.252 on GigabitEthernet0/1.',
      'Do not forget to save at the end.',
    ],
    solution: [
      'show ip interface brief', 'configure terminal', 'interface g0/0', 'no shutdown', 'interface g0/1', 'ip address 10.0.0.1 255.255.255.252', 'end',
      'ping 192.168.10.11', 'ping 10.0.0.2', 'copy running-config startup-config',
    ],
  },
  {
    id: 'vlans-access',
    title: 'Create VLANs and assign access ports',
    level: 'Beginner',
    lessonId: 'vlans',
    briefing: [
      'SW1 is a brand-new switch. Sales PCs plug into Fa0/1–Fa0/2 and Engineering PCs into Fa0/3–Fa0/4. Right now every port is in VLAN 1.',
      'Create VLAN 10 (SALES) and VLAN 20 (ENG), hard-set the four ports as access ports in the right VLANs, verify with show vlan brief, and save.',
    ],
    build: () => newDevice({ kind: 'switch', hostname: 'SW1', mode: 'priv' }),
    objectives: [
      { text: 'VLAN 10 exists and is named SALES', check: (d) => d.vlans[10] === 'SALES' },
      { text: 'VLAN 20 exists and is named ENG', check: (d) => d.vlans[20] === 'ENG' },
      { text: 'Fa0/1 and Fa0/2 are access ports in VLAN 10', check: (d) => [1, 2].every((n) => port(d, n).mode === 'access' && port(d, n).accessVlan === 10) },
      { text: 'Fa0/3 and Fa0/4 are access ports in VLAN 20', check: (d) => [3, 4].every((n) => port(d, n).mode === 'access' && port(d, n).accessVlan === 20) },
      { text: 'Verify with show vlan brief', check: (d) => ran(d, 'show', 'vlan', 'brief') },
      { text: 'Save the configuration', check: (d) => d.startup !== null && d.startup.vlans[10] === 'SALES' },
    ],
    hints: [
      'A VLAN is created in global configuration: vlan 10, then name SALES inside (config-vlan)#.',
      'interface range fa0/1 - 2 lets you configure both ports at once (the prompt shows config-if-range).',
      'Two commands per port group: switchport mode access, then switchport access vlan 10.',
      'show vlan brief lists each VLAN with its access ports. Trunk ports never appear there.',
    ],
    solution: [
      'configure terminal', 'vlan 10', 'name SALES', 'vlan 20', 'name ENG',
      'interface range fa0/1 - 2', 'switchport mode access', 'switchport access vlan 10',
      'interface range fa0/3 - 4', 'switchport mode access', 'switchport access vlan 20',
      'end', 'show vlan brief', 'copy running-config startup-config',
    ],
  },
  {
    id: 'trunk-config',
    title: 'Build a trunk to the next switch',
    level: 'Intermediate',
    lessonId: 'trunking',
    briefing: [
      'SW1 connects to SW2 on GigabitEthernet0/1. VLANs 10, 20 and 99 already exist. VLAN 99 is the unused “parking” VLAN you will use as the native VLAN.',
      'Turn Gi0/1 into a static 802.1Q trunk, change the native VLAN to 99, allow only VLANs 10, 20 and 99, verify it, and save.',
    ],
    build: () =>
      newDevice({ kind: 'switch', hostname: 'SW1', mode: 'priv', vlans: { 10: 'SALES', 20: 'ENG', 99: 'PARKING' } }),
    objectives: [
      { text: 'Gi0/1 is a trunk (switchport mode trunk)', check: (d) => iface(d, 'GigabitEthernet0/1').switchport?.mode === 'trunk' },
      { text: 'The native VLAN on Gi0/1 is 99', check: (d) => iface(d, 'GigabitEthernet0/1').switchport?.nativeVlan === 99 },
      { text: 'Only VLANs 10, 20 and 99 are allowed on the trunk', check: (d) => { const a = iface(d, 'GigabitEthernet0/1').switchport?.allowed; return Array.isArray(a) && a.join() === '10,20,99'; } },
      { text: 'Verify with show interfaces trunk', check: (d) => ran(d, 'show', 'interfaces', 'trunk') },
      { text: 'Save the configuration', check: (d) => d.startup?.interfaces['GigabitEthernet0/1']?.switchport?.mode === 'trunk' },
    ],
    hints: [
      'Select the uplink: interface gigabitEthernet 0/1. It is a switchport, not a routed port.',
      'switchport mode trunk makes the trunk unconditional. It is not the same as switchport mode access.',
      'switchport trunk native vlan 99 and switchport trunk allowed vlan 10,20,99 — note that a list replaces the previous list.',
      'show interfaces trunk shows four tables: mode/native, allowed, allowed-and-active, and forwarding.',
    ],
    solution: [
      'configure terminal', 'interface g0/1', 'switchport mode trunk', 'switchport trunk native vlan 99', 'switchport trunk allowed vlan 10,20,99',
      'end', 'show interfaces trunk', 'copy running-config startup-config',
    ],
  },
  {
    id: 'router-on-a-stick',
    title: 'Router-on-a-stick',
    level: 'Intermediate',
    lessonId: 'inter-vlan-routing',
    briefing: [
      'R1 Gi0/0 connects to a switch trunk carrying VLAN 10 (192.168.10.0/24, PC at 192.168.10.11) and VLAN 20 (192.168.20.0/24, PC at 192.168.20.11).',
      'Bring up the physical interface, create one subinterface per VLAN with the right 802.1Q tag and gateway address (.1 in each subnet), check the routing table, ping both PCs, and save.',
    ],
    build: () => newDevice({ hostname: 'R1', mode: 'priv', interfaces: [gi(0), gi(1), gi(2)], reachable: ['192.168.10.11', '192.168.20.11'] }),
    objectives: [
      { text: 'Enable the physical interface Gi0/0', check: (d) => !iface(d, 'GigabitEthernet0/0').shutdown },
      { text: 'Gi0/0.10 uses dot1Q 10 with 192.168.10.1/24', check: (d) => sub(d, 10, '192.168.10.1') },
      { text: 'Gi0/0.20 uses dot1Q 20 with 192.168.20.1/24', check: (d) => sub(d, 20, '192.168.20.1') },
      { text: 'Verify with show ip route', check: (d) => ran(d, 'show', 'ip', 'route') },
      { text: 'Ping 192.168.10.11 and 192.168.20.11 successfully', check: (d) => ranPing(d, '192.168.10.11') && ranPing(d, '192.168.20.11') },
      { text: 'Save the configuration', check: (d) => d.startup !== null && d.startup.interfaces['GigabitEthernet0/0.20'] !== undefined },
    ],
    hints: [
      'The physical interface carries no IP address here, but it must not be shut down. If it is down, every subinterface is down.',
      'Type interface g0/0.10 to create a subinterface. The prompt becomes (config-subif)#.',
      'Order matters: encapsulation dot1q 10 first, then ip address. IOS refuses the IP before the tag is set.',
      'Do the same again for .20. Then show ip route should list two connected /24 networks.',
    ],
    solution: [
      'configure terminal', 'interface g0/0', 'no shutdown',
      'interface g0/0.10', 'encapsulation dot1q 10', 'ip address 192.168.10.1 255.255.255.0',
      'interface g0/0.20', 'encapsulation dot1q 20', 'ip address 192.168.20.1 255.255.255.0',
      'end', 'show ip route', 'ping 192.168.10.11', 'ping 192.168.20.11', 'copy running-config startup-config',
    ],
  },
  {
    id: 'fix-vlan',
    title: 'Troubleshoot: one PC cannot reach its team',
    level: 'Intermediate',
    lessonId: 'vlans',
    briefing: [
      'On SW1, the Sales PC on Fa0/2 cannot reach the other Sales PCs, and Engineering users (VLAN 20) cannot reach the server on SW2 through the trunk on Gi0/1.',
      'Use show vlan brief and show interfaces trunk to find both faults. Fix them without breaking anything else, then save.',
    ],
    build: () =>
      newDevice({
        kind: 'switch', hostname: 'SW1', mode: 'priv', saved: true, vlans: { 10: 'SALES', 20: 'ENG', 99: 'PARKING' },
        interfaces: [
          fa(1, { switchport: sp({ mode: 'access', accessVlan: 10 }) }),
          fa(2, { switchport: sp({ mode: 'access', accessVlan: 1 }) }),
          fa(3, { switchport: sp({ mode: 'access', accessVlan: 20 }) }),
          { name: 'GigabitEthernet0/1', connected: true, switchport: sp({ mode: 'trunk', nativeVlan: 99, allowed: [10, 99] }) },
        ],
      }),
    objectives: [
      { text: 'Put Fa0/2 into VLAN 10 (it must stay an access port)', check: (d) => port(d, 2).mode === 'access' && port(d, 2).accessVlan === 10 },
      { text: 'Allow VLAN 20 on the Gi0/1 trunk while keeping VLANs 10 and 99', check: (d) => { const a = iface(d, 'GigabitEthernet0/1').switchport?.allowed; return Array.isArray(a) && [10, 20, 99].every((v) => a.includes(v)); } },
      { text: 'Investigate with show vlan brief and show interfaces trunk', check: (d) => ran(d, 'show', 'vlan', 'brief') && ran(d, 'show', 'interfaces', 'trunk') },
      { text: 'Save the fix', check: (d) => d.startup?.interfaces['FastEthernet0/2']?.switchport?.accessVlan === 10 },
    ],
    hints: [
      'In show vlan brief, which VLAN is Fa0/2 listed under? Sales should be in VLAN 10.',
      'In show interfaces trunk, compare the “allowed” table with the VLANs you need.',
      'Use switchport trunk allowed vlan add 20. Without the word add, you would replace the whole list.',
      'Save with copy running-config startup-config when both faults are fixed.',
    ],
    solution: [
      'show vlan brief', 'show interfaces trunk', 'configure terminal', 'interface fa0/2', 'switchport access vlan 10',
      'interface g0/1', 'switchport trunk allowed vlan add 20', 'end', 'show interfaces trunk', 'copy running-config startup-config',
    ],
  },
];

export const cliTaskById = (id: string) => CLI_TASKS.find((t) => t.id === id);
