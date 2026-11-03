import type { TaglishExtra, TaglishOverlay } from './index';
import { wrongNotes as W } from './helpers';

const basic: Record<string, TaglishOverlay> = {
  'subnetting-deep-dive': {
    terms: [
      'Laki ng bloke sa interesting octet: 256 bawas ang mask value.',
      'Ang octet na ang mask value ay hindi 255 at hindi 0.',
      'Unang address ng bloke; lahat ng host bits ay 0; hindi pwedeng ibigay sa host.',
      'Huling address ng bloke; lahat ng host bits ay 1; hindi pwedeng ibigay sa host.',
      'Lahat ng address mula network + 1 hanggang broadcast − 1.',
      'Mga host bit na hiniram para gumawa ng subnets; bawat isa ay nagdodoble ng bilang ng subnet.',
      'Dalawang address na pareho ang network address kapag iisang mask ang ginamit.',
    ],
    cli: [
      'Ang interface address at prefix na ini-configure mo; kinukuwenta ng router ang network mula rito.',
      'Ipinapakita ng connected route ang network address na kinuwenta ng router: 172.16.40.0/21 — kapareho ng sagot ng magic number method.',
      'Ang local route ng mismong interface address, laging /32.',
    ],
    verify: [],
    questions: [
      'Ang /21 ay mask 255.255.248.0, kaya ang magic number sa ikatlong octet ay 8. Ang multiples ay …, 32, 40, 48. Ang 45 ay nasa 40–47, kaya ang network ay 172.16.40.0.',
      'Ang /27 ay block size 32. Ang 77 ay nasa 64–95, kaya ang network ay 10.1.1.64 at ang broadcast ay susunod na network (96) − 1 = 10.1.1.95.',
      'Ang block size 64 ay nagbibigay ng 128–191. Ang network ay .128 at ang broadcast ay .191, kaya ang usable range ay .129–.190.',
      'Sa /26 ang mga bloke ay 0–63 at 64–127. Ang .62 ay nasa una at ang .66 ay nasa pangalawa, kaya magkaibang subnet sila.',
      'Ang 2^2 = 4 ay kulang pero ang 2^3 = 8 ≥ 6, kaya manghiram ng 3 bits: /24 + 3 = /27 (30 hosts bawat subnet).',
      'Ang /27 ay may 5 host bits: 2^5 − 2 = 30.',
      'Ang /20 ay humihiram ng 4 bits mula sa /16, at 2^4 = 16 subnets.',
      'Ang block ay 64–127. Ang .64 ay network at ang .127 ay broadcast, kaya .65 at .126 lang ang pwedeng ibigay sa host.',
      'Ang 255.255.254.0 ay /23: ang magic number ay 2 sa ikatlong octet. Ang 10.0.1.x ay nasa 10.0.0.0–10.0.1.255, kaya ang 10.0.1.255 ay ang huling address at ito ang broadcast.',
      'Hinahati ng /25 ang huling octet sa 0–127 at 128–255. Ang host ay nasa 128–255 at ang gateway ay nasa 0–127, kaya hindi sila magkasama sa subnet.',
    ],
  },
};

const extra: Record<string, TaglishExtra> = {
  'subnetting-deep-dive': {
    cards: [
      '256 bawas ang mask value sa interesting octet.',
      'Ang unang octet na ang mask value ay hindi 255 at hindi 0.',
      'Susunod na network address bawas isa (ang mga huling octet ay nagiging 255).',
      '/25 128, /26 64, /27 32, /28 16, /29 8, /30 4.',
      'Hanapin ang network address ng bawat isa gamit ang iisang mask; dapat pareho ang resulta.',
      'Pinakamaliit na s na 2^s ≥ N; idagdag ang s sa orihinal na prefix.',
      'Dapat nasa parehong subnet ng host.',
    ],
    lab: {
      objective: 'Lutasin ang halo-halong subnetting na tanong gamit lang ang magic number method at suriin gamit ang Subnet lister.',
      steps: [
        'Para sa bawat host, isulat ang mask sa dotted decimal at hanapin ang interesting octet at magic number.',
        'Isulat ang unang sampung multiples ng magic number para sa bawat host.',
        'Hanapin ang network address, broadcast address at usable range ng Host A, B at C.',
        'Sabihin kung ilang usable host ang laman ng bawat subnet.',
        'Suriin kung magkasama sa subnet ang Host B (10.8.8.100/29) at 10.8.8.104/29, at ipaliwanag.',
        'I-verify ang bawat sagot sa Subnet lister sa itaas at itama ang anumang pagkakaiba.',
        'Orasan ang sarili: gumawa ng tatlong bagong random na host at tumutok sa wala pang 45 segundo bawat isa.',
      ],
      checklist: [
        'Nahanap ang magic number para sa bawat prefix',
        'Naisulat ang network, broadcast at range ng tatlong host',
        'Nasagot ang same-subnet na tanong na may ipinakitang networks',
        'Na-verify ang lahat ng sagot gamit ang Subnet lister',
      ],
      hints: [
        'Ang /20 ay naglalagay ng interesting octet sa ikatlong octet na may magic number na 16.',
        'Para sa /29 ang magic number ay 8 sa ikaapat na octet: 96, 104, 112…',
      ],
      solution: [
        'Host A /20: magic 16 sa ikatlong octet; ang 77 ay nasa 64–79 → network 172.20.64.0, broadcast 172.20.79.255, usable 172.20.64.1–172.20.79.254, 4094 hosts.',
        'Host B /29: magic 8; ang 100 ay nasa 96–103 → network 10.8.8.96, broadcast 10.8.8.103, usable .97–.102, 6 hosts. Host C /27: magic 32; ang 45 ay nasa 32–63 → network 192.168.99.32, broadcast .63, usable .33–.62, 30 hosts.',
        'Ang 10.8.8.104/29 ay nasa bloke 104–111, samantalang ang Host B ay nasa 96–103. Magkaibang subnet sila.',
      ],
      breakIt: 'Sadyang gamitin ang maling octet sa magic number ng Host A (ikaapat sa halip na ikatlo) at tingnan kung paano nagiging mali ang network address. Ipaliwanag kung bakit ang ikatlong octet ang interesting octet.',
    },
    wrong: W(10, {
      0: { 0: 'Ang 32 ay multiple ng 8 pero ang 45 ay lampas na sa 40, kaya ang bloke ay 40–47.', 2: 'Ang 44 ay hindi multiple ng 8.', 3: 'Ang 45 ay host value, hindi simula ng bloke.' },
      1: { 0: 'Ang 10.1.1.64 ay network address.', 2: 'Ang 10.1.1.96 ay susunod na network address.', 3: 'Ang 127 ay broadcast ng /25 na bloke, hindi /27.' },
      2: { 0: 'Kasama rito ang network at broadcast address.', 2: 'Nagsisimula ito sa host value at kasama ang broadcast.', 3: 'Hindi usable ang broadcast na .191.' },
      4: { 0: 'Ang /25 ay 2 subnets lang.', 1: 'Ang /26 ay 4 subnets lang.', 3: 'Ang /28 ay 16 subnets pero mas kaunti ang hosts kaysa kailangan.' },
      5: { 0: 'Ang 14 ay bilang ng /28.', 2: 'Ang 32 ay kabuuan kasama ang network at broadcast.', 3: 'Ang 62 ay bilang ng /26.' },
      6: { 0: 'Ang 4 ay mangangailangan ng 2 hiniram na bits (/18).', 1: 'Ang 8 ay mangangailangan ng 3 hiniram na bits (/19).', 3: 'Ang 32 ay mangangailangan ng 5 hiniram na bits (/21).' },
      9: { 1: 'Ang private address ay pwedeng gumamit ng anumang valid na mask.', 2: 'Ang .200 ay hindi broadcast ng 128–255 na bloke (iyon ay .255).', 3: 'Walang patakaran na dapat nagtatapos sa .254 ang gateway.' },
    }),
  },
};

export const BATCH_H = { basic, extra };
