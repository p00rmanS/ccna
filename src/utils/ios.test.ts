import { describe, expect, it } from 'vitest';
import { CLI_TASKS } from '../data/cliTasks';
import { canPing, complete, help, newDevice, promptOf, run, type Device } from './ios';

const go = (d: Device, ...lines: string[]) => {
  let device = d;
  let output: string[] = [];
  for (const l of lines) ({ device, output } = run(device, l));
  return { device, output };
};
const fresh = () => newDevice({ hostname: 'R1', mode: 'user' });

describe('modes and prompts', () => {
  it('walks user → privileged → global → interface and back', () => {
    let d = fresh();
    expect(promptOf(d)).toBe('R1>');
    d = go(d, 'enable').device; expect(promptOf(d)).toBe('R1#');
    d = go(d, 'configure terminal').device; expect(promptOf(d)).toBe('R1(config)#');
    d = go(d, 'interface gigabitEthernet 0/0').device; expect(promptOf(d)).toBe('R1(config-if)#');
    d = go(d, 'exit').device; expect(promptOf(d)).toBe('R1(config)#');
    d = go(d, 'interface g0/1', 'end').device; expect(promptOf(d)).toBe('R1#');
    d = go(d, 'disable').device; expect(promptOf(d)).toBe('R1>');
  });
  it('records visited modes', () => {
    const d = go(fresh(), 'enable', 'conf t', 'end').device;
    expect(d.visited).toEqual(['user', 'priv', 'config']);
  });
  it('hostname changes the prompt at once', () => {
    expect(promptOf(go(fresh(), 'en', 'conf t', 'hostname EDGE1').device)).toBe('EDGE1(config)#');
  });
});

describe('abbreviations and errors', () => {
  it('accepts unique abbreviations', () => {
    const d = go(fresh(), 'en', 'conf t', 'int g0/0', 'no sh', 'ex', 'end').device;
    expect(promptOf(d)).toBe('R1#');
    expect(d.interfaces['GigabitEthernet0/0']!.shutdown).toBe(false);
  });
  it('reports ambiguous abbreviations', () => {
    const d = go(fresh(), 'enable', 'configure terminal').device;
    expect(run(d, 'i').output).toEqual(['% Ambiguous command:  "i"']);
    expect(run(d, 'en').output[0]).toMatch(/Ambiguous/);
  });
  it('reports incomplete commands', () => {
    const d = go(fresh(), 'enable').device;
    expect(run(d, 'configure').output).toEqual(['% Incomplete command.']);
    expect(run(d, 'show ip').output).toEqual(['% Incomplete command.']);
  });
  it('places the caret under the offending word', () => {
    const d = go(fresh(), 'enable', 'configure terminal').device;
    const out = run(d, 'ip address 1.1.1.1 255.255.255.0').output;
    expect(out[1]).toBe("% Invalid input detected at '^' marker.");
    // "ip" is valid in global config (ip domain-lookup), so IOS points at "address": 11-char prompt + space + 3
    expect(out[0]).toBe(`${' '.repeat(15)}^`);
    const bad = run(d, 'hostnam').output; // valid abbreviation but missing argument
    expect(bad).toEqual(['% Incomplete command.']);
    expect(run(d, 'foo bar').output[0]).toBe(`${' '.repeat(12)}^`);
  });
  it('rejects commands from the wrong mode with an invalid-input error', () => {
    expect(run(fresh(), 'show running-config').output[1]).toMatch(/Invalid input/);
    expect(run(go(fresh(), 'enable').device, 'ip address 1.1.1.1 255.0.0.0').output[1]).toMatch(/Invalid input/);
  });
  it('ignores blank lines', () => {
    expect(run(fresh(), '   ').output).toEqual([]);
  });
});

describe('interface configuration', () => {
  const inIf = () => go(newDevice({ hostname: 'R1', mode: 'priv', interfaces: [{ name: 'GigabitEthernet0/0', connected: true }, { name: 'GigabitEthernet0/1', connected: true }] }), 'conf t', 'interface g0/0').device;
  it('accepts several spellings of an interface name and rejects unknown ones', () => {
    for (const name of ['g0/0', 'gi0/0', 'gigabitEthernet0/0', 'gigabitethernet 0/0', 'GigabitEthernet 0/0']) {
      expect(promptOf(go(newDevice({ mode: 'config', interfaces: [{ name: 'GigabitEthernet0/0' }] }), `interface ${name}`).device)).toMatch(/config-if/);
    }
    const out = go(newDevice({ mode: 'config', interfaces: [{ name: 'GigabitEthernet0/0' }] }), 'interface g9/9').output;
    expect(out[1]).toMatch(/Invalid input/);
  });
  it('configures an address and lists it as up/up', () => {
    const { device, output } = go(inIf(), 'ip address 192.168.1.1 255.255.255.0', 'no shutdown');
    expect(output.join('\n')).toMatch(/changed state to up/);
    const brief = run(go(device, 'end').device, 'show ip interface brief').output.join('\n');
    expect(brief).toMatch(/GigabitEthernet0\/0\s+192\.168\.1\.1\s+YES manual up\s+up/);
    expect(brief).toMatch(/GigabitEthernet0\/1\s+unassigned\s+YES unset\s+administratively down\s+down/);
  });
  it('shows down/down for an enabled interface with nothing connected', () => {
    const d = go(newDevice({ mode: 'priv', interfaces: [{ name: 'GigabitEthernet0/2', connected: false }] }), 'conf t', 'int g0/2', 'no shutdown', 'end').device;
    expect(run(d, 'show ip interface brief').output.join('\n')).toMatch(/GigabitEthernet0\/2\s+unassigned\s+YES unset\s+down\s+down/);
  });
  it('validates the address and mask', () => {
    expect(run(inIf(), 'ip address 999.1.1.1 255.255.255.0').output[1]).toMatch(/Invalid input/);
    const badMask = run(inIf(), 'ip address 10.0.0.1 255.0.255.0').output;
    expect(badMask[0]).toBe(`${' '.repeat('R1(config-if)#'.length + 1 + 'ip address 10.0.0.1 '.length)}^`);
    expect(run(inIf(), 'ip address 192.168.1.0 255.255.255.0').output).toEqual(['Bad mask /24 for address 192.168.1.0']);
    expect(run(inIf(), 'ip address 192.168.1.255 255.255.255.0').output[0]).toMatch(/Bad mask/);
  });
  it('detects overlapping subnets exactly like the VLSM lesson describes', () => {
    let d = go(inIf(), 'ip address 192.168.100.1 255.255.255.128', 'interface g0/1').device;
    const out = run(d, 'ip address 192.168.100.65 255.255.255.192').output;
    expect(out).toEqual(['% 192.168.100.64 overlaps with GigabitEthernet0/0']);
    d = go(d, 'ip address 192.168.100.129 255.255.255.192').device;
    expect(d.interfaces['GigabitEthernet0/1']!.ip).toBe('192.168.100.129');
  });
  it('allows re-addressing the same interface without a false overlap', () => {
    const d = go(inIf(), 'ip address 10.0.0.5 255.255.255.252', 'ip address 10.0.0.1 255.255.255.252').device;
    expect(d.interfaces['GigabitEthernet0/0']!.ip).toBe('10.0.0.1');
  });
  it('shutdown and description', () => {
    const d = go(inIf(), 'no shutdown', 'description Link to SW1', 'shutdown').device;
    expect(d.interfaces['GigabitEthernet0/0']).toMatchObject({ shutdown: true, description: 'Link to SW1' });
  });
});

describe('configuration files, filters and reload', () => {
  const configured = () => go(newDevice({ hostname: 'R1', mode: 'priv', interfaces: [{ name: 'GigabitEthernet0/0', connected: true }] }),
    'conf t', 'no ip domain-lookup', 'banner motd #Authorized Access Only#', 'interface g0/0', 'description LAN', 'ip address 192.168.1.1 255.255.255.0', 'no shutdown', 'end').device;
  it('renders the running-config', () => {
    const cfg = run(configured(), 'show running-config').output.join('\n');
    expect(cfg).toMatch(/hostname R1/);
    expect(cfg).toMatch(/no ip domain lookup/);
    expect(cfg).toMatch(/banner motd \^CAuthorized Access Only\^C/);
    expect(cfg).toMatch(/interface GigabitEthernet0\/0\n description LAN\n ip address 192\.168\.1\.1 255\.255\.255\.0\n!/);
    expect(cfg).not.toMatch(/ shutdown/);
  });
  it('supports include, exclude, begin and section filters', () => {
    const d = configured();
    expect(run(d, 'show running-config | include hostname').output).toEqual(['hostname R1']);
    expect(run(d, 'sh run | section interface').output).toEqual(['interface GigabitEthernet0/0', ' description LAN', ' ip address 192.168.1.1 255.255.255.0']);
    expect(run(d, 'show run | begin interface').output[0]).toBe('interface GigabitEthernet0/0');
    expect(run(d, 'show run | exclude !').output).not.toContain('!');
    expect(run(d, 'show run | inc').output[1]).toMatch(/Invalid/);
    expect(run(d, 'reload | include x').output[1]).toMatch(/Invalid/);
  });
  it('keeps running and startup config separate until saved', () => {
    const d = configured();
    expect(run(d, 'show startup-config').output).toEqual(['startup-config is not present']);
    const saved = go(d, 'copy running-config startup-config').device;
    expect(run(saved, 'show startup-config').output.join('\n')).toMatch(/hostname R1/);
  });
  it('reload discards unsaved changes and restores the saved configuration', () => {
    const saved = go(configured(), 'copy run start', 'conf t', 'hostname TEMP', 'end').device;
    expect(saved.hostname).toBe('TEMP');
    const after = go(saved, 'reload');
    expect(after.device.hostname).toBe('R1');
    expect(after.device.mode).toBe('user');
    expect(after.output.join(' ')).toMatch(/SAVED configuration/);
  });
  it('reload with nothing saved returns to factory defaults', () => {
    const after = go(configured(), 'reload').device;
    expect(after.hostname).toBe('Router');
    expect(after.interfaces['GigabitEthernet0/0']!.ip).toBeNull();
    expect(after.interfaces['GigabitEthernet0/0']!.shutdown).toBe(true);
  });
  it('do runs an EXEC command from configuration mode without changing mode', () => {
    const d = go(configured(), 'conf t', 'interface g0/0').device;
    const r = run(d, 'do show ip interface brief');
    expect(r.output[0]).toMatch(/^Interface/);
    expect(promptOf(r.device)).toBe('R1(config-if)#');
  });
  it('erase startup-config removes the saved copy', () => {
    const d = go(configured(), 'copy run start', 'erase startup-config').device;
    expect(d.startup).toBeNull();
  });
});

describe('ping', () => {
  const lan = () => go(newDevice({ hostname: 'R1', mode: 'priv', reachable: ['192.168.10.11'], interfaces: [{ name: 'GigabitEthernet0/0', connected: true }] }),
    'conf t', 'int g0/0', 'ip address 192.168.10.1 255.255.255.0').device;
  it('fails while the interface is shut down, succeeds once enabled', () => {
    expect(canPing(lan(), '192.168.10.11')).toBe(false);
    const up = go(lan(), 'no shutdown', 'end').device;
    expect(canPing(up, '192.168.10.11')).toBe(true);
    expect(canPing(up, '192.168.10.1')).toBe(true);
    expect(canPing(up, '192.168.99.9')).toBe(false);
    expect(run(up, 'ping 192.168.10.11').output.join('\n')).toMatch(/!!!!!\nSuccess rate is 100 percent/);
    expect(run(up, 'ping 192.168.99.9').output.join('\n')).toMatch(/\.\.\.\.\.\nSuccess rate is 0 percent/);
  });
  it('rejects a malformed address', () => {
    expect(run(go(lan(), 'end').device, 'ping banana').output).toEqual(['% Unrecognized host or address, or protocol not running.']);
  });
});

describe('help and completion', () => {
  it('lists next options and <cr>', () => {
    const d = go(fresh(), 'enable').device;
    const top = help(d, '').join('\n');
    expect(top).toMatch(/configure/);
    expect(top).toMatch(/show/);
    const cfg = help(d, 'configure ').join('\n');
    expect(cfg).toMatch(/terminal/);
    expect(help(d, 'configure terminal ').join('\n')).toMatch(/<cr>/);
  });
  it('completes a partial word', () => {
    expect(help(go(fresh(), 'enable').device, 'sh')).toEqual(['show']);
    expect(help(go(fresh(), 'enable').device, 'zzz')).toEqual(['% Unrecognized command']);
  });
  it('tab-completes only when the completion is unique', () => {
    const d = go(fresh(), 'enable').device;
    expect(complete(d, 'conf')).toBe('configure ');
    expect(complete(d, 'configure ter')).toBe('configure terminal ');
    expect(complete(d, 'e')).toBeNull();
    expect(complete(d, 'show ip ')).toBeNull();
  });
});

describe('practice tasks', () => {
  for (const task of CLI_TASKS) {
    it(`"${task.title}" starts unfinished and is solved by its own solution`, () => {
      const start = task.build();
      const before = task.objectives.filter((o) => o.check(start)).length;
      expect(before).toBeLessThan(task.objectives.length);
      let device = start;
      for (const line of task.solution) {
        const r = run(device, line);
        device = r.device;
        expect(r.output.join('\n'), `“${line}” should not error`).not.toMatch(/Invalid input|Incomplete|Ambiguous|overlaps|Bad mask/);
      }
      for (const o of task.objectives) expect(o.check(device), o.text).toBe(true);
    });
  }
  it('has unique ids and non-empty hints', () => {
    expect(new Set(CLI_TASKS.map((t) => t.id)).size).toBe(CLI_TASKS.length);
    for (const t of CLI_TASKS) expect(t.hints.length).toBeGreaterThanOrEqual(3);
  });
  it('the VLSM task teaches the overlap error when the plan is done smallest-first', () => {
    const t = CLI_TASKS.find((x) => x.id === 'vlsm-config')!;
    const d = go(t.build(), 'conf t', 'int g0/0', 'ip address 192.168.100.1 255.255.255.128', 'int g0/1').device;
    expect(run(d, 'ip address 192.168.100.65 255.255.255.192').output[0]).toMatch(/overlaps with GigabitEthernet0\/0/);
  });
});
