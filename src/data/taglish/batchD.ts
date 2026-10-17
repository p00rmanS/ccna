import type { TaglishExtra, TaglishOverlay } from './index';
import { wrongNotes as W } from './helpers';

const basic: Record<string, TaglishOverlay> = {
  'vpn-architecture': {
    terms: [
      'Pribado at naka-encrypt na tunnel sa isang hindi pinagkakatiwalaang network tulad ng internet.',
      'Permanenteng tunnel sa pagitan ng dalawang gateway na nag-uugnay ng dalawang network.',
      'Tunnel mula sa device ng isang user papunta sa network ng kompanya, karaniwang may client.',
      'Suite na nagbibigay ng confidentiality, integrity, authentication at anti-replay sa Layer 3.',
      'Ang ESP ay nag-e-encrypt at nag-a-authenticate (protocol 50); ang AH ay authentication lang (protocol 51).',
      'Internet Key Exchange: nag-a-authenticate ng peers at nagne-negotiate ng IPsec parameters.',
      'Device na pumapayag o tumatanggi ng trapiko sa pagitan ng mga zone ayon sa patakaran.',
      'Ang IDS ay nakakakita at nag-aalerto; ang IPS ay inline at kayang humarang ng mapaminsalang trapiko.',
      'Hiwalay na zone para sa mga server na nakaharap sa publiko, nakahiwalay sa inside network.',
    ],
    cli: [],
    verify: [],
    questions: [
      'Ang site-to-site VPN ay nag-uugnay ng dalawang network sa pamamagitan ng gateway devices.',
      'Ang ESP ay nagbibigay ng confidentiality at integrity; ang AH ay integrity at authentication lang.',
      'Ina-authenticate ng IKE ang peers at nagne-negotiate ng keys at parameters para sa IPsec tunnel.',
      'Ine-encrypt ng tunnel mode ang buong orihinal na packet at nagdaragdag ng bagong header, karaniwan sa site-to-site VPN.',
      'Ang IPS ay inline at kayang magbagsak ng mapaminsalang packet; ang IDS ay nagmamasid at nag-aalerto.',
      'Ang DMZ ang naghihiwalay sa mga server na nakaharap sa publiko mula sa internal network.',
      'Ang sequence numbers ang nagbibigay ng anti-replay protection.',
      'Nagbibigay ang IPsec ng confidentiality, integrity, authentication at anti-replay.',
      'Totoo — ang device ng user ang gumagawa ng tunnel gamit ang VPN client o browser (SSL/TLS).',
    ],
  },
};

const extra: Record<string, TaglishExtra> = {
  'vpn-architecture': {
    cards: [
      'Ang site-to-site ay nag-uugnay ng dalawang network sa pamamagitan ng gateways (transparent). Ang remote-access ay nag-uugnay ng isang user device gamit ang client.',
      'ESP: encryption + integrity (protocol 50). AH: integrity + authentication lang (protocol 51).',
      'Phase 1: ina-authenticate ang peers at bumubuo ng secure channel; phase 2: nagne-negotiate ng IPsec SAs.',
      'Ang firewall ay nagpapatupad ng policy; ang IDS ay nakakakita at nag-aalerto; ang IPS ay inline at humaharang. Dinadagdagan ng NGFW ng application awareness at IPS.',
      'Hiwalay na zone para sa mga server na nakaharap sa publiko, nakahiwalay sa internal network.',
    ],
    lab: {
      objective: 'Gumuhit ng network na may dalawang site, remote workers at public web server, at ilagay ang mga VPN, firewall, DMZ at IPS.',
      steps: [
        'Iguhit ang Head Office, isang Branch, ang ulap ng internet at ang laptop ng remote worker.',
        'Ikonekta ang Head Office at Branch gamit ang site-to-site IPsec VPN at lagyan ng label na ESP tunnel mode.',
        'Ikonekta ang remote worker sa Head Office gamit ang remote-access VPN.',
        'Maglagay ng firewall sa gilid ng Head Office na may inside, outside at DMZ zones.',
        'Ilagay ang public web server sa DMZ at magdagdag ng IPS na inline sa likod ng firewall.',
        'Sumulat ng isang control para sa bawat CIA goal at ilista kung aling device ang nagbibigay nito.',
      ],
      checklist: [
        'Iginuhit at nilagyan ng label ang parehong uri ng VPN',
        'Nasa DMZ ang public server',
        'Tama ang posisyon ng firewall at IPS',
        'May control ang bawat CIA goal',
      ],
      hints: [
        'Ang DMZ ay pangatlong firewall zone, hindi bahagi ng inside LAN.',
        'Ilagay ang IPS na inline sa daan, hindi sa monitor port, kung dapat itong humarang.',
      ],
      solution: [
        'Site-to-site na tunnel sa pagitan ng dalawang edge gateway; remote-access client papunta sa head office gateway.',
        'Confidentiality: IPsec encryption; integrity: IPsec hashing; availability: redundant links at ang firewall/IPS.',
      ],
    },
    wrong: W(9, {}),
  },
};

export const BATCH_D = { basic, extra };
