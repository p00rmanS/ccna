import { describe, expect, it } from 'vitest';
import { formatVlanList, newDevice, parseVlanList, promptOf, run, type Device } from './ios';

const go = (d: Device, ...lines: string[]) => {
  let device = d;
  let output: string[] = [];
  for (const l of lines) ({ device, output } = run(device, l));
  return { device, output };
};
const sw = () => newDevice({ kind: 'switch', hostname: 'SW1', mode: 'priv' });
const router = () => newDevice({ hostname: 'R1', mode: 'priv' });

describe('VLAN list helpers', () => {
  it('parses lists and ranges', () => {
    expect(parseVlanList('10,20,30-32')).toEqual([10, 20, 30, 31, 32]);
    expect(parseVlanList('5')).toEqual([5]);
  });
  it('rejects nonsense', () => {
    for (const bad of ['', 'a', '0', '4095', '20-10', '10,,20', '10-']) expect(parseVlanList(bad), bad).toBeNull();
  });
  it('formats back into compact ranges', () => {
    expect(formatVlanList([1, 2, 3, 7, 9, 10])).toBe('1-3,7,9-10');
    expect(formatVlanList([20, 10, 10])).toBe('10,20');
    expect(formatVlanList([])).toBe('');
  });
});

describe('VLAN creation', () => {
  it('creates a VLAN, names it and enters config-vlan', () => {
    const { device } = go(sw(), 'conf t', 'vlan 10');
    expect(promptOf(device)).toBe('SW1(config-vlan)#');
    expect(device.vlans[10]).toBe('VLAN0010');
    expect(go(device, 'name SALES').device.vlans[10]).toBe('SALES');
    expect(promptOf(go(device, 'exit').device)).toBe('SW1(config)#');
  });
  it('rejects out-of-range VLAN ids', () => {
    expect(go(sw(), 'conf t', 'vlan 5000').output[1]).toMatch(/Invalid input/);
    expect(go(sw(), 'conf t', 'vlan 0').output[1]).toMatch(/Invalid input/);
  });
  it('is not offered on a router', () => {
    expect(go(router(), 'conf t', 'vlan 10').output[1]).toMatch(/Invalid input/);
  });
  it('lists the built-in VLAN 1 and the four legacy VLANs in show vlan brief', () => {
    const out = run(sw(), 'show vlan brief').output.join('\n');
    expect(out).toMatch(/^VLAN Name\s+Status\s+Ports/);
    expect(out).toMatch(/1\s+default\s+active\s+Fa0\/1, Fa0\/2, Fa0\/3, Fa0\/4/);
    for (const id of ['1002', '1003', '1004', '1005']) expect(out).toContain(id);
  });
  it('VLANs survive a reload even when the config was not saved (vlan.dat)', () => {
    const d = go(sw(), 'conf t', 'vlan 10', 'name SALES', 'end', 'reload').device;
    expect(d.vlans[10]).toBe('SALES');
  });
});

describe('access ports', () => {
  it('assigns ports to a VLAN and shows them under it', () => {
    const { device } = go(sw(), 'conf t', 'vlan 10', 'name SALES', 'interface range fa0/1 - 2', 'switchport mode access', 'switchport access vlan 10', 'end');
    const out = run(device, 'show vlan brief').output.join('\n');
    expect(out).toMatch(/10\s+SALES\s+active\s+Fa0\/1, Fa0\/2/);
    expect(out).toMatch(/1\s+default\s+active\s+Fa0\/3, Fa0\/4/);
  });
  it('the interface range prompt says range and config applies to every port', () => {
    const { device } = go(sw(), 'conf t', 'interface range fa0/1-3');
    expect(promptOf(device)).toBe('SW1(config-if-range)#');
    const after = go(device, 'description user ports').device;
    for (const n of [1, 2, 3]) expect(after.interfaces[`FastEthernet0/${n}`]!.description).toBe('user ports');
    expect(after.interfaces['FastEthernet0/4']!.description).toBe('');
  });
  it('creates the VLAN automatically, like IOS does, and says so', () => {
    const { device, output } = go(sw(), 'conf t', 'interface fa0/1', 'switchport access vlan 30');
    expect(output.join(' ')).toMatch(/Creating vlan 30/);
    expect(device.vlans[30]).toBeDefined();
  });
  it('rejects unknown interfaces and bad ranges', () => {
    expect(go(sw(), 'conf t', 'interface range fa0/1 - 99').output[1]).toMatch(/Invalid input/);
    expect(go(sw(), 'conf t', 'interface range fa0/4 - 1').output[1]).toMatch(/Invalid input/);
  });
  it('switchport commands are refused on a router and outside interface mode', () => {
    expect(go(router(), 'conf t', 'interface g0/0', 'switchport mode access').output[1]).toMatch(/Invalid input/);
    expect(go(sw(), 'conf t', 'switchport mode access').output[1]).toMatch(/Invalid input/);
  });
  it('shows a full switchport report', () => {
    const d = go(sw(), 'conf t', 'interface fa0/1', 'switchport mode access', 'switchport access vlan 10', 'end').device;
    const out = run(d, 'show interfaces fa0/1 switchport').output.join('\n');
    expect(out).toMatch(/Administrative Mode: static access/);
    expect(out).toMatch(/Operational Mode: static access/);
    expect(out).toMatch(/Access Mode VLAN: 10 \(VLAN0010\)/);
    expect(run(d, 'show interfaces fastethernet 0/1 switchport').output.join('\n')).toMatch(/Access Mode VLAN: 10/);
  });
  it('a default port is dynamic auto until it is hard-set', () => {
    expect(run(sw(), 'show interfaces fa0/1 switchport').output.join('\n')).toMatch(/Administrative Mode: dynamic auto/);
  });
});

describe('trunks', () => {
  const trunked = () => go(sw(), 'conf t', 'vlan 10', 'vlan 20', 'vlan 99', 'interface g0/1', 'switchport mode trunk', 'switchport trunk native vlan 99', 'switchport trunk allowed vlan 10,20,99', 'end').device;
  it('shows nothing when no trunk is up, then the four tables', () => {
    expect(run(sw(), 'show interfaces trunk').output).toEqual([]);
    const out = run(trunked(), 'show interfaces trunk').output.join('\n');
    expect(out).toMatch(/Gi0\/1\s+on\s+802\.1q\s+trunking\s+99/);
    expect(out).toMatch(/Vlans allowed on trunk\nGi0\/1\s+10,20,99/);
    expect(out).toMatch(/allowed and active in management domain\nGi0\/1\s+10,20,99/);
  });
  it('lists all VLANs as 1-4094 by default and only active ones in the active table', () => {
    const d = go(sw(), 'conf t', 'vlan 10', 'interface g0/1', 'switchport mode trunk', 'end').device;
    const out = run(d, 'show interfaces trunk').output.join('\n');
    expect(out).toMatch(/Vlans allowed on trunk\nGi0\/1\s+1-4094/);
    expect(out).toMatch(/allowed and active in management domain\nGi0\/1\s+1,10\n/);
  });
  it('a trunk port is not listed in show vlan brief', () => {
    const out = run(trunked(), 'show vlan brief').output.join('\n');
    expect(out).not.toMatch(/Gi0\/1/);
  });
  it('add, remove, except, all and none change the allowed list', () => {
    const base = go(trunked(), 'conf t', 'interface g0/1').device;
    expect(go(base, 'switchport trunk allowed vlan add 30').device.interfaces['GigabitEthernet0/1']!.switchport!.allowed).toEqual([10, 20, 30, 99]);
    expect(go(base, 'switchport trunk allowed vlan remove 20').device.interfaces['GigabitEthernet0/1']!.switchport!.allowed).toEqual([10, 99]);
    expect(go(base, 'switchport trunk allowed vlan none').device.interfaces['GigabitEthernet0/1']!.switchport!.allowed).toEqual([]);
    expect(go(base, 'switchport trunk allowed vlan all').device.interfaces['GigabitEthernet0/1']!.switchport!.allowed).toBe('all');
    const except = go(base, 'switchport trunk allowed vlan except 5').device.interfaces['GigabitEthernet0/1']!.switchport!.allowed;
    expect(Array.isArray(except) && except.length === 4093 && !except.includes(5)).toBe(true);
    expect(go(base, 'switchport trunk allowed vlan add 10,x').output[1]).toMatch(/Invalid input/);
  });
  it('a plain list replaces the old list (the classic outage)', () => {
    const d = go(trunked(), 'conf t', 'interface g0/1', 'switchport trunk allowed vlan 30').device;
    expect(d.interfaces['GigabitEthernet0/1']!.switchport!.allowed).toEqual([30]);
  });
  it('appears in the running-config with only non-default lines', () => {
    const cfg = run(trunked(), 'show running-config').output.join('\n');
    expect(cfg).toMatch(/interface GigabitEthernet0\/1\n switchport trunk native vlan 99\n switchport trunk allowed vlan 10,20,99\n switchport mode trunk\n!/);
    expect(cfg).not.toMatch(/interface FastEthernet0\/1\n switchport/);
  });
  it('a shutdown trunk is not listed as trunking', () => {
    const d = go(trunked(), 'conf t', 'interface g0/1', 'shutdown', 'end').device;
    expect(run(d, 'show interfaces trunk').output).toEqual([]);
  });
});

describe('router subinterfaces', () => {
  const sub = () => go(router(), 'conf t', 'interface g0/0', 'no shutdown', 'interface g0/0.10').device;
  it('creates a subinterface with its own prompt', () => {
    expect(promptOf(sub())).toBe('R1(config-subif)#');
  });
  it('refuses an IP address before encapsulation is set', () => {
    expect(run(sub(), 'ip address 192.168.10.1 255.255.255.0').output[0]).toMatch(/only allowed if that subinterface is already configured/);
  });
  it('accepts the IP after encapsulation dot1q and shows it in the routing table', () => {
    const d = go(sub(), 'encapsulation dot1q 10', 'ip address 192.168.10.1 255.255.255.0', 'end').device;
    const brief = run(d, 'show ip interface brief').output.join('\n');
    expect(brief).toMatch(/GigabitEthernet0\/0\.10\s+192\.168\.10\.1\s+YES manual up\s+up/);
    const route = run(d, 'show ip route').output.join('\n');
    expect(route).toMatch(/C\s+192\.168\.10\.0\/24 is directly connected, GigabitEthernet0\/0\.10/);
    expect(route).toMatch(/L\s+192\.168\.10\.1\/32 is directly connected, GigabitEthernet0\/0\.10/);
    expect(run(d, 'show running-config').output.join('\n')).toMatch(/interface GigabitEthernet0\/0\.10\n encapsulation dot1Q 10\n ip address 192\.168\.10\.1 255\.255\.255\.0/);
  });
  it('subinterfaces go down when the physical interface is shut down', () => {
    const d = go(sub(), 'encapsulation dot1q 10', 'ip address 192.168.10.1 255.255.255.0', 'interface g0/0', 'shutdown', 'end').device;
    expect(run(d, 'show ip interface brief').output.join('\n')).toMatch(/GigabitEthernet0\/0\.10\s+192\.168\.10\.1\s+YES manual down\s+down/);
    expect(run(d, 'show ip route').output.join('\n')).not.toMatch(/192\.168\.10\.0/);
  });
  it('overlap detection also covers subinterfaces', () => {
    const d = go(sub(), 'encapsulation dot1q 10', 'ip address 192.168.10.1 255.255.255.0', 'interface g0/0.20', 'encapsulation dot1q 20').device;
    expect(run(d, 'ip address 192.168.10.5 255.255.255.0').output[0]).toMatch(/overlaps with GigabitEthernet0\/0\.10/);
  });
  it('a switch cannot have subinterfaces', () => {
    expect(go(sw(), 'conf t', 'interface g0/1.10').output[1]).toMatch(/Invalid input/);
  });
  it('show ip route is not a switch command here', () => {
    expect(run(sw(), 'show ip route').output[1]).toMatch(/Invalid input/);
  });
  it('an empty routing table prints only the legend', () => {
    expect(run(router(), 'show ip route').output.join('\n')).toMatch(/Gateway of last resort is not set/);
  });
});

describe('switch help and completion', () => {
  it('help offers switchport options in interface mode', () => {
    // imported lazily to keep the import list short
    return import('./ios').then(({ help }) => {
      const d = go(sw(), 'conf t', 'interface fa0/1').device;
      expect(help(d, 'switchport ').join('\n')).toMatch(/mode/);
      expect(help(d, 'switchport mode ').join('\n')).toMatch(/access[\s\S]*trunk/);
      expect(help(go(router(), 'conf t', 'interface g0/0').device, 'switchport ')).toEqual(['% Unrecognized command']);
    });
  });
});
