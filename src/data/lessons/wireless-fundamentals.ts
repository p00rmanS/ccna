import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'wireless-fundamentals';

export const lesson: Lesson = {
  id: ID,
  moduleId: '2.12',
  domain: 'D2',
  title: 'Wireless Fundamentals: SSID, BSSID, Channels and Bands',
  description: 'How Wi-Fi works at a basic level: access points, SSID and BSSID, the 2.4 GHz and 5 GHz bands, non-overlapping channels and why signals interfere.',
  whyMatters:
    'Halos lahat ng device ngayon ay naka-Wi-Fi, kaya hindi maiiwasan ang wireless sa CCNA at sa trabaho. Ang mga pangunahing tanong: ano ang SSID at BSSID, bakit 1, 6 at 11 ang channel sa 2.4 GHz, at bakit mas mabilis pero mas maikli ang abot ng 5 GHz. Kapag alam mo ito, madali mong maaayos ang "mabagal ang Wi-Fi".',
  objectives: [
    'Explain the roles of the access point, SSID, BSSID and BSS',
    'Compare the 2.4 GHz and 5 GHz bands in range, speed and interference',
    'Identify the non-overlapping channels 1, 6 and 11 in the 2.4 GHz band',
    'Describe half-duplex wireless access with CSMA/CA',
    'Name the common 802.11 standards and their bands',
  ],
  estimatedMinutes: 35,
  difficulty: 'beginner',
  keywords: ['wireless', 'WLAN', 'SSID', 'BSSID', 'BSS', 'ESS', 'access point', '2.4 GHz', '5 GHz', 'channel', '1 6 11', 'CSMA/CA', '802.11', 'interference', 'roaming'],
  examObjectives: ['2.7'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A wireless access point (AP) is like a switch without cables: it connects Wi-Fi clients to the wired network using radio. The network name you see on your phone is the SSID. Every AP radio also has a unique identifier, the BSSID, which is its MAC address.',
        'Wi-Fi uses shared radio channels in two main bands. 2.4 GHz travels farther and goes through walls better but is crowded and has few clean channels. 5 GHz is faster and cleaner but has shorter range.',
      ],
      taglish: [
        'Ang **wireless access point (AP)** ay parang **switch na walang kable**: **ikinokonekta nito ang Wi-Fi clients sa wired network** gamit ang **radyo**. Ang **pangalan ng network** na nakikita sa phone mo ay **SSID**. Ang **radyo ng bawat AP** ay may **natatanging identifier, ang BSSID** (**MAC address** nito).',
        'Ang **Wi-Fi ay gumagamit ng shared na radio channel** sa **dalawang pangunahing band**. Ang **2.4 GHz** ay **mas malayo ang abot at mas mahusay tumagos sa pader** pero **siksikan at kaunti ang malinis na channel**. Ang **5 GHz** ay **mas mabilis at mas malinis** pero **mas maikli ang abot**.',
        'Sa **2.4 GHz**, **tatlong channel lang ang hindi nag-ooverlap: 1, 6 at 11**. Kaya **sa mga katabing AP, gamitin ang 1, 6, 11**.',
        'Dahil **shared ang hangin**, **isa lang ang puwedeng magsalita sa isang oras** (**half-duplex**), at **CSMA/CA** ang paraan para **iwasan ang banggaan** (**makinig muna, saka magpadala**).',
      ],
      technical: [
        'Terminology: a BSS (basic service set) is one AP and its associated clients; the BSSID is the AP radio MAC address. The SSID is the human-readable network name (up to 32 characters) and may be shared by several APs forming an ESS (extended service set) that supports roaming. An IBSS is an ad hoc network without an AP. A WLAN is the wireless network; clients associate and authenticate to an AP.',
        'Bands: 2.4 GHz (802.11b/g/n/ax) has 11 channels in the US (13 in much of the world), each 22 MHz wide and spaced 5 MHz apart, so only channels 1, 6 and 11 do not overlap; it suffers interference from Bluetooth, microwaves and neighbouring networks. 5 GHz (802.11a/n/ac/ax) offers many more non-overlapping 20 MHz channels (and 40, 80, 160 MHz bonded channels), higher throughput and less interference, with shorter range and weaker wall penetration. 6 GHz arrives with Wi-Fi 6E and 7.',
        'Standards: 802.11b (2.4 GHz, 11 Mb/s), 802.11a (5 GHz, 54 Mb/s), 802.11g (2.4 GHz, 54 Mb/s), 802.11n / Wi-Fi 4 (2.4 and 5 GHz, MIMO, up to 600 Mb/s), 802.11ac / Wi-Fi 5 (5 GHz, up to several Gb/s, MU-MIMO), 802.11ax / Wi-Fi 6 (2.4 and 5 GHz, OFDMA, efficiency in dense areas) and 6E adds 6 GHz.',
        'Medium access: wireless is half-duplex and shared. CSMA/CA (carrier sense multiple access with collision avoidance) has stations listen before transmitting, wait a random backoff, and acknowledge each frame; collisions cannot be detected as in wired CSMA/CD. RTS/CTS may reserve the medium to deal with hidden nodes. More clients on a channel means less throughput for each.',
        'Design points: place APs with about 10–15 percent cell overlap for roaming, use different channels on neighbouring APs (1, 6, 11 at 2.4 GHz), prefer 5 GHz for capacity, and keep APs away from microwaves and metal. Signal strength is measured in dBm (for example −67 dBm is a typical minimum for voice), and signal-to-noise ratio matters for speed.',
      ],
    },
    {
      type: 'story',
      title: 'Ang Mabagal na Wi-Fi sa Condo',
      paragraphs: [
        'Si **Mang Tonyo** ay nakatira sa **condo** kung saan **mabagal ang Wi-Fi tuwing gabi**. "**Lima ang bar pero parang pagong ang bilis!**" reklamo niya kay **Kuya Jun**.',
        'Binuksan ni Kuya Jun ang **Wi-Fi analyzer sa phone**. **Dose-dosenang network** ang nakita sa **2.4 GHz**, at **halos lahat ay nasa channel 6**, pati ang router ni Mang Tonyo. "**Para kayong maraming tao sa iisang kuwarto na sabay-sabay nagsasalita**," sabi ni Kuya Jun. **Malakas ang signal pero siksikan ang channel**, kaya **maraming banggaan at paghihintay**.',
        'Ang ginawa niya: **inilipat ang router sa 5 GHz** na may **malinis na channel** at **hiwalay na SSID** para sa 5 GHz. **Pinalitan din ang 2.4 GHz channel sa 1** dahil **kaunti ang gumagamit doon**. Sa isang iglap, **bumilis ang Wi-Fi**.',
        '"Pero bakit mahina sa kuwarto?" tanong ni Mang Tonyo. "**Ang 5 GHz po ay mas mabilis pero mas mahirap tumagos sa pader**," paliwanag ni Kuya Jun. "Kaya **sa kuwarto, 2.4 GHz pa rin**; **sa sala, 5 GHz**."',
      ],
      moral: '**Malakas na signal ≠ mabilis na Wi-Fi.** **2.4 GHz**: **malayo pero siksikan** (channel **1, 6, 11**). **5 GHz**: **mabilis at malinis pero maikli ang abot**. **Shared ang hangin**.',
    },
    {
      type: 'analogy',
      title: 'Kuwarto na maraming nag-uusap',
      body: [
        'Imagine a room where everyone must share one conversation at a time. Only one person can talk while others listen. A good Wi-Fi channel is like a quiet room; a busy channel is like a crowded party where everybody waits for a gap before speaking.',
      ],
      taglish: [
        'Isipin ang **kuwartong iisa lang ang puwedeng magsalita sa isang oras** habang **nakikinig ang iba**. Ang **magandang Wi-Fi channel** ay **tahimik na kuwarto**; ang **siksikang channel** ay **parang handaan** na **bawat isa ay naghihintay ng puwang** bago magsalita.',
      ],
    },
    {
      type: 'hook',
      title: '1-6-11 at 2.4 malayo, 5 mabilis',
      trick: '**2.4 GHz** = **malayo, siksikan**, channel **1, 6, 11**. **5 GHz** = **mabilis, malinis, maikli ang abot**. **SSID** = pangalan; **BSSID** = **MAC ng AP**. **CSMA/CA** = **makinig muna**.',
      taglish: [
        '**SSID** = **pangalan ng network**. **BSSID** = **MAC address ng AP radio**.',
        '**2.4 GHz**: **malayo ang abot**, **siksikan**, **non-overlapping channels: 1, 6, 11**.',
        '**5 GHz**: **mas mabilis, mas malinis, mas maikli ang abot**.',
        '**CSMA/CA**: **makinig, maghintay ng random, magpadala, hintayin ang ACK**.',
      ],
      test: {
        question: 'Aling mga channel sa 2.4 GHz ang hindi nag-ooverlap, at alin ang may mas mabilis na speed ngunit mas maikling abot?',
        answer: 'Channels 1, 6 at 11 ang hindi nag-ooverlap. Ang 5 GHz ang mas mabilis pero mas maikli ang abot.',
      },
    },
    { type: 'diagram', id: 'wlan-channels', caption: 'Non-overlapping channels sa 2.4 GHz: 1, 6 at 11; at ang paghahambing ng 2.4 at 5 GHz.' },
    {
      type: 'terms',
      items: [
        { term: 'Access point (AP)', definition: 'A device that connects wireless clients to the wired network.' },
        { term: 'SSID', definition: 'The human-readable name of a wireless network (up to 32 characters).' },
        { term: 'BSSID', definition: 'The MAC address of an AP radio that identifies a BSS.' },
        { term: 'BSS / ESS', definition: 'One AP with its clients; several APs sharing an SSID to allow roaming.' },
        { term: '2.4 GHz / 5 GHz', definition: 'The main Wi-Fi bands: 2.4 has longer range and more interference, 5 is faster and cleaner with shorter range.' },
        { term: 'Channels 1, 6, 11', definition: 'The three non-overlapping 20 MHz channels in the 2.4 GHz band.' },
        { term: 'CSMA/CA', definition: 'Wireless access method: listen, back off randomly, transmit and wait for acknowledgement.' },
        { term: 'dBm', definition: 'Unit of signal strength; closer to 0 is stronger (−50 dBm is strong, −80 dBm is weak).' },
      ],
    },
    {
      type: 'flow',
      title: 'Sundan: pagkonekta ng phone sa Wi-Fi',
      steps: [
        'Nag-scan ang phone at nakita ang SSID na "OFFICE" mula sa isang AP (BSSID 00:1A:...).',
        'Pinili ng phone ang SSID at nagpadala ng authentication request sa AP.',
        'Kinumpirma ng AP ang authentication (halimbawa WPA2) at tinanggap ang association.',
        'Humingi ang phone ng IP address gamit ang DHCP sa pamamagitan ng AP papunta sa wired network.',
        'Bago magpadala ng data, nakikinig muna ang phone (CSMA/CA); kapag tahimik, nagpapadala at naghihintay ng ACK.',
        'Habang naglalakad, kumokonekta ang phone sa mas malakas na AP na may parehong SSID (roaming).',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang **SSID ay pangalan** at **puwedeng pareho sa maraming AP**; ang **BSSID ay MAC address** at **natatangi sa bawat AP radio**. Madalas itong pagpalitin.' },
    { type: 'callout', kind: 'trap', text: 'Ang **5 GHz ay mas mabilis pero mas maikli ang abot**; ang **2.4 GHz ay mas malayo pero mas siksikan**. Kapag tinanong kung **alin ang mas tumatagos sa pader**, **2.4 GHz**.' },
    { type: 'callout', kind: 'tip', text: 'Sa **2.4 GHz**, **huwag gumamit ng channel 2–5 o 7–10** kung may kalapit na AP — **nag-ooverlap**. **1, 6, 11 lang**.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Pagpalit ng SSID at BSSID.',
        'Paggamit ng overlapping channels sa 2.4 GHz.',
        'Pag-iisip na mas mabilis ang Wi-Fi dahil lang malakas ang signal.',
        'Paglimot na shared at half-duplex ang wireless medium.',
        'Paglalagay ng AP malapit sa microwave o metal.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: "Mabagal ang Wi-Fi kahit malakas ang signal"',
      scenario: 'An office has strong Wi-Fi signal but slow speeds in the evening. Three neighbouring APs all use 2.4 GHz channel 6.',
      evidence: `AP1  2.4 GHz  channel 6   -45 dBm
AP2  2.4 GHz  channel 6   -52 dBm
AP3  2.4 GHz  channel 6   -58 dBm
Clients per AP: 38, 41, 35`,
      question: 'Ano ang problema at ano ang ayos?',
      answer: 'Co-channel interference: parehong channel 6 ang tatlong AP, kaya nagbabahagi sila ng hangin at naghihintay ang mga client. Malakas ang signal pero siksikan ang channel.',
      fix: 'Magtakda ng channel 1, 6 at 11 sa tatlong AP, at ilipat ang mga kliyenteng kaya sa 5 GHz (band steering). Bawasan ang bilang ng client kada AP kung kinakailangan.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'May apat na AP sa isang palapag. Anong mga channel ang ilalagay mo sa 2.4 GHz at bakit hindi sapat ang tatlong channel lang? Ano ang mas mahusay na solusyon?',
      answer: 'Gamitin ang 1, 6, 11 at ulitin ang isa nang malayo sa isa\'t isa. Tatlo lang ang non-overlapping kaya may magbabahagi ng channel (co-channel). Mas mahusay: ilipat ang karamihan ng client sa 5 GHz na maraming non-overlapping channel.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'SSID is the network name; BSSID is the AP radio MAC; an ESS is several APs with one SSID.',
        '2.4 GHz: longer range, more interference, channels 1/6/11 non-overlapping. 5 GHz: faster, cleaner, shorter range.',
        'Wireless is half-duplex and shared; CSMA/CA avoids collisions.',
        '802.11n is 2.4 and 5 GHz; 802.11ac is 5 GHz; 802.11ax (Wi-Fi 6) is 2.4 and 5 GHz.',
        'Signal strength in dBm: closer to 0 is stronger.',
      ],
    },
    {
      type: 'summary',
      points: [
        'APs connect Wi-Fi clients to the wired network; SSID names the network and BSSID identifies the AP.',
        'Use channels 1, 6 and 11 in 2.4 GHz; prefer 5 GHz for capacity.',
        'Wireless is shared and half-duplex using CSMA/CA.',
        'Interference and channel planning explain most slow Wi-Fi.',
        'Susunod: Wireless security — WPA2 at WPA3.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D2', objective: '2.7', difficulty: 'easy', type: 'single',
    prompt: 'What is an SSID?',
    choices: ['The MAC address of an AP', 'The name of a wireless network', 'A channel number', 'An encryption key'], correct: [1],
    explanation: 'The SSID is the human-readable name of the wireless network.',
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D2', objective: '2.7', difficulty: 'easy', type: 'single',
    prompt: 'Which 2.4 GHz channels do not overlap?',
    choices: ['1, 2, 3', '1, 6, 11', '2, 5, 8', '3, 7, 12'], correct: [1],
    explanation: 'Channels 1, 6 and 11 are the non-overlapping set in the 2.4 GHz band.',
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D2', objective: '2.7', difficulty: 'medium', type: 'single',
    prompt: 'How does 5 GHz compare with 2.4 GHz?',
    choices: ['Longer range, slower', 'Faster and less crowded but shorter range', 'Identical', 'Only for older devices'], correct: [1],
    explanation: '5 GHz offers higher speed and more channels but shorter range.',
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D2', objective: '2.7', difficulty: 'medium', type: 'single',
    prompt: 'What is the BSSID?',
    choices: ['The network name', 'The MAC address of the AP radio', 'The IP address of the AP', 'The WPA key'], correct: [1],
    explanation: 'The BSSID identifies a BSS and is the MAC address of the AP radio.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D2', objective: '2.7', difficulty: 'medium', type: 'single',
    prompt: 'Which access method does Wi-Fi use?',
    choices: ['CSMA/CD', 'CSMA/CA', 'Token passing', 'Polling only'], correct: [1],
    explanation: 'Wireless uses carrier sense multiple access with collision avoidance.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D2', objective: '2.7', difficulty: 'hard', type: 'single',
    prompt: 'Neighbouring APs all use channel 6 in 2.4 GHz and speeds are low despite strong signal. What is the problem?',
    choices: ['Co-channel interference', 'A wrong SSID', 'Duplex mismatch', 'DHCP failure'], correct: [0],
    explanation: 'APs on the same channel share airtime, reducing throughput.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D2', objective: '2.7', difficulty: 'medium', type: 'single',
    prompt: 'Which standard operates only in the 5 GHz band?',
    choices: ['802.11b', '802.11g', '802.11ac', '802.11n'], correct: [2],
    explanation: '802.11ac (Wi-Fi 5) is 5 GHz; 802.11n supports both bands.',
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D2', objective: '2.7', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO statements about 2.4 GHz are true?',
    choices: ['It has longer range than 5 GHz', 'It has more non-overlapping channels than 5 GHz', 'It suffers more from interference', 'It is faster than 5 GHz'], correct: [0, 2],
    explanation: '2.4 GHz travels farther but is more congested and has fewer clean channels.',
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D2', objective: '2.7', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: several APs can share the same SSID to form an extended service set.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'True — an ESS lets clients roam between APs with one SSID.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Pro tip: Wi-Fi basics?', back: 'SSID = pangalan; BSSID = MAC ng AP. 2.4 GHz = malayo, siksikan, channel 1/6/11. 5 GHz = mabilis, malinis, maikli ang abot. CSMA/CA: makinig muna.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D2', category: 'concept', front: 'SSID vs BSSID?', back: 'SSID is the network name; BSSID is the MAC address of the AP radio.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D2', category: 'concept', front: '2.4 GHz vs 5 GHz?', back: '2.4: longer range, more interference, channels 1/6/11. 5: faster, more channels, shorter range.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D2', category: 'concept', front: 'Wi-Fi access method?', back: 'CSMA/CA: listen, random backoff, transmit, wait for ACK; half-duplex shared medium.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D2', category: 'concept', front: '802.11 standards and bands?', back: 'b/g 2.4; a 5; n 2.4+5; ac 5; ax (Wi-Fi 6) 2.4+5 (6E adds 6 GHz).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D2', category: 'concept', front: 'BSS vs ESS?', back: 'BSS: one AP and its clients. ESS: several APs with one SSID for roaming.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Plan channels for a small office',
  tool: 'Paper',
  minutes: 20,
  objective: 'Assign channels to APs and decide which clients belong on 2.4 GHz and 5 GHz.',
  steps: [
    'Draw a floor plan with four APs (AP1 to AP4) in a row.',
    'Assign 2.4 GHz channels using only 1, 6 and 11 so neighbouring APs do not share a channel.',
    'Assign 5 GHz channels (36, 40, 44, 48 are different 20 MHz channels).',
    'List which devices should use 2.4 GHz (IoT, far rooms) and which should use 5 GHz (laptops, video).',
    'Write SSID and BSSID for each AP and mark which are shared.',
    'Compare with the solution.',
  ],
  checklist: [
    'No two neighbouring APs share a 2.4 GHz channel where avoidable',
    '5 GHz channels assigned',
    'Devices placed on suitable bands',
  ],
  hints: [
    'With four APs and three channels, reuse a channel on APs that are far apart.',
    'The SSID can be the same on all APs; the BSSID is unique.',
  ],
  solution: [
    'AP1 ch1, AP2 ch6, AP3 ch11, AP4 ch1; 5 GHz 36, 40, 44, 48.',
    'One SSID, four BSSIDs; IoT on 2.4 GHz, laptops on 5 GHz.',
  ],
};
