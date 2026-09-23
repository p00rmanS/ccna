import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'binary-basics';

export const lesson: Lesson = {
  id: ID,
  moduleId: '1.9',
  domain: 'D1',
  title: 'Binary Basics',
  description: 'Bits, bytes and octets; converting between decimal and binary; and the AND operation that subnet masks rely on.',
  whyMatters:
    'Computers, switches and routers work in binary. Subnetting, wildcard masks and IPv6 all become mechanical once you can move between binary and decimal quickly. This lesson starts from zero.',
  objectives: [
    'Explain bits, bytes, octets and nibbles',
    'Use the place values 128, 64, 32, 16, 8, 4, 2, 1',
    'Convert decimal 0–255 to binary and back',
    'Recite powers of two and the mask octet values',
    'Apply the binary AND operation',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['binary', 'bit', 'byte', 'octet', 'nibble', 'place value', 'powers of 2', 'AND', 'hexadecimal'],
  examObjectives: ['1.6'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Binary is counting with only two symbols, 0 and 1. Each symbol is a bit — like a light switch that is either off (0) or on (1).',
        'Eight bits together make an octet (one byte). The eight switches have fixed values, from left to right: 128, 64, 32, 16, 8, 4, 2, 1. Add up the values of the switches that are ON and you get the decimal number.',
      ],
      taglish: [
        'Ang binary ay pagbibilang gamit lang ang dalawang simbolo: 0 at 1. Ang bawat isa ay isang bit — parang ilaw na patay (0) o bukas (1).',
        'Ang walong bit ay isang octet (isang byte). May fixed na halaga ang bawat ilaw mula kaliwa pakanan: 128, 64, 32, 16, 8, 4, 2, 1. Idagdag mo lang ang mga halaga ng ilaw na bukas at makukuha mo ang decimal na numero. Halimbawa: 10101100 = 128 + 32 + 8 + 4 = 172.',
      ],
      technical: [
        'A bit is a binary digit. A byte or octet is 8 bits and can represent 2^8 = 256 values, 0 through 255. A nibble is 4 bits (one hexadecimal digit). Each bit position has a place value of 2^n, counting from 2^0 on the right to 2^7 = 128 on the left.',
        'Decimal to binary: for each place value from 128 down to 1, if the remaining number is at least the place value write 1 and subtract it; otherwise write 0. Binary to decimal: add the place values that contain a 1.',
        'The bitwise AND of two bits is 1 only if both are 1. A subnet mask is ANDed with an IP address: where the mask has 1s the address bits are kept (network portion), where it has 0s they become 0. This is exactly how a host or router finds a network address.',
      ],
    },
    {
      type: 'analogy',
      title: 'Eight coins, each used once or not at all',
      taglish: ['Isipin ang walong barya na may halagang 128, 64, 32, 16, 8, 4, 2, at 1 piso. Sa kahit anong halaga mula 0 hanggang 255, may isang kombinasyon lang ng barya ang makakabuo nito. Ang binary ay listahan lang kung aling barya ang ginamit (1) at hindi (0). Para bayaran ang 172: 128 + 32 + 8 + 4 = 10101100.'],
      body: [
        'Imagine eight coins worth 128, 64, 32, 16, 8, 4, 2 and 1 pesos. For any amount from 0 to 255 there is exactly one combination of those coins that makes it. Binary just records which coins you use: 1 for “used”, 0 for “not used”. To pay 172 you use the 128, 32, 8 and 4 coins: 10101100.',
      ],
    },
    {
      type: 'hook',
      title: 'Doble mula kanan',
      trick: 'Mula **kanan**, **doble** lang: **1 · 2 · 4 · 8 · 16 · 32 · 64 · 128**. Ang mask: **idagdag ang barya** mula kaliwa: 128 → 192 → 224 → 240 → 248 → 252 → 254 → 255.',
      taglish: [
        'Hindi mo kailangang kabisaduhin ang walong numero — simulan sa **1** sa kanan at **i-doble** paakyat: 1, 2, 4, 8, 16, 32, 64, 128. Parang barya na bawat isa ay doble ng nauna.',
        'Para sa **mask**: mula **kaliwa**, dagdagan ang bawat susunod na barya: 128, **+64 = 192**, **+32 = 224**, **+16 = 240**, **+8 = 248**, **+4 = 252**, **+2 = 254**, **+1 = 255**. Iyan ang lahat ng pwedeng maging mask octet.',
        'Para i-convert: tanungin bawat barya, “**kasya ba?**” Kung oo, **1** at ibawas; kung hindi, **0**. Halimbawa 172: 128 kasya (1) → 44 na lang; 64 hindi (0); 32 kasya (1) → 12; 16 hindi (0); 8 kasya (1) → 4; 4 kasya (1) → 0. = 10101100.',
      ],
      test: {
        question: 'I-convert ang 200 sa binary gamit ang “kasya ba?”',
        answer: '128 kasya → 1 (72 na lang); 64 kasya → 1 (8); 32 hindi → 0; 16 hindi → 0; 8 kasya → 1 (0); 4, 2, 1 → 0, 0, 0. = 11001000. Check: 128 + 64 + 8 = 200.',
      },
    },
    { type: 'diagram', id: 'binary-places', caption: 'One octet: eight place values. 172 = 128 + 32 + 8 + 4 = 10101100.' },
    { type: 'interactive', id: 'binary-lab', caption: 'Flip the bits to explore, or switch to Drill mode for timed practice.' },
    {
      type: 'terms',
      items: [
        { term: 'Bit', definition: 'A binary digit: 0 or 1.' },
        { term: 'Nibble', definition: '4 bits; exactly one hexadecimal digit.' },
        { term: 'Byte / octet', definition: '8 bits; 256 possible values (0–255).' },
        { term: 'Place value', definition: 'The value of a bit position: 128, 64, 32, 16, 8, 4, 2, 1 in an octet.' },
        { term: 'Decimal', definition: 'Base 10: digits 0–9.' },
        { term: 'Binary', definition: 'Base 2: digits 0 and 1.' },
        { term: 'Hexadecimal', definition: 'Base 16: digits 0–9 and A–F; one digit = 4 bits.' },
        { term: 'AND', definition: 'A bitwise operation: the result bit is 1 only if both input bits are 1.' },
      ],
    },
    {
      type: 'flow',
      title: 'Converting 172 to binary, one place value at a time',
      steps: [
        '128: 172 ≥ 128, so write 1. Remaining 172 − 128 = 44.',
        '64: 44 < 64, so write 0.',
        '32: 44 ≥ 32, so write 1. Remaining 44 − 32 = 12.',
        '16: 12 < 16, so write 0.',
        '8: 12 ≥ 8, so write 1. Remaining 12 − 8 = 4.',
        '4: 4 ≥ 4, so write 1. Remaining 0.',
        '2 and 1: nothing left, so write 0 and 0.',
        'Result: 10101100. Check: 128 + 32 + 8 + 4 = 172. ✓',
      ],
    },
    {
      type: 'list',
      variant: 'remember',
      title: 'Numbers worth knowing by heart',
      items: [
        'Powers of two: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 (2^0 to 2^10). Also 2^16 = 65,536.',
        'The only octet values a subnet mask can use: 0, 128, 192, 224, 240, 248, 252, 254, 255.',
        'They are “leftmost ones”: 128 = 10000000, 192 = 11000000, 224 = 11100000, 240 = 11110000, 248 = 11111000, 252 = 11111100, 254 = 11111110, 255 = 11111111.',
        'Hex: A=10, B=11, C=12, D=13, E=14, F=15. One hex digit = 4 bits.',
      ],
    },
    {
      type: 'flow',
      title: 'The AND operation as a network finder (a preview of subnetting)',
      steps: [
        'Address octet 130 = 10000010. Mask octet 128 = 10000000.',
        'AND each column: 1 AND 1 = 1; every other column has a 0 in the mask, so the result is 0.',
        'Result = 10000000 = 128. So the network portion of 130 with mask 128 is 128.',
        'That is exactly what a router does with a whole address and mask to find the network address.',
      ],
    },
    { type: 'callout', kind: 'tip', text: 'Check your work with your computer’s calculator: on Windows, Calculator → Programmer mode shows decimal, hex and binary side by side.' },
    { type: 'callout', kind: 'relax', text: 'You do not need to be fast yet. Speed comes from repetition in the drill mode above and the Subnetting trainer. First make sure you understand why each bit has its value.' },
    { type: 'callout', kind: 'trap', text: 'Read from the correct end: the LEFT bit is 128 and the RIGHT bit is 1. Also, a full octet is 255 (not 256): 2^8 = 256 values means 0 through 255.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Common mistakes',
      items: [
        'Reading the bits backwards (treating the left bit as 1).',
        'Forgetting leading zeros: 5 is 00000101 as an octet, not 101.',
        'Believing an octet can be 256. The maximum is 255.',
        'Adding place values that are off. If your sum does not match, recheck each 1.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Find the error: a wrong conversion',
      scenario: 'A student writes: “172 in binary is 10101110.”',
      question: 'Is that correct? If not, find the mistake.',
      answer: '10101110 = 128 + 32 + 8 + 4 + 2 = 174, not 172. The student turned on the “2” bit by mistake. 172 = 128 + 32 + 8 + 4, which is 10101100.',
      fix: 'Always check a conversion by adding the place values of the 1s.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Convert 192, 168 and 10 to binary. Then convert 11111000 and 00100100 back to decimal.',
      answer: '192 = 11000000, 168 = 10101000, 10 = 00001010. 11111000 = 248, 00100100 = 36.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'You must be able to convert without a calculator, and quickly.',
        'Memorise the mask octet values (128, 192, 224, 240, 248, 252, 254, 255).',
        'Powers of two up to 2^10 appear constantly in host-count calculations (2^h − 2).',
      ],
    },
    {
      type: 'summary',
      points: [
        'A bit is 0 or 1; an octet is 8 bits with values 0–255.',
        'Place values are 128, 64, 32, 16, 8, 4, 2, 1.',
        'Decimal → binary: subtract place values from left to right. Binary → decimal: add the place values of the 1s.',
        'Mask octets are runs of leftmost 1s: 128, 192, 224, 240, 248, 252, 254, 255.',
        'AND with a mask keeps the network bits and zeroes the host bits.',
        'Next: IPv4 addresses, which are simply four of these octets.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'What is 192 in binary (as one octet)?',
    choices: ['10101000', '11000000', '11100000', '11000001'], correct: [1],
    explanation: '192 = 128 + 64, so the first two bits are 1: 11000000.',
    wrong: { 0: '10101000 = 168.', 2: '11100000 = 224.', 3: '11000001 = 193.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'What is 10101100 in decimal?',
    choices: ['168', '172', '174', '176'], correct: [1],
    explanation: '128 + 32 + 8 + 4 = 172.',
    wrong: { 0: '168 = 10101000.', 2: '174 = 10101110.', 3: '176 = 10110000.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'How many different values can one octet represent?',
    choices: ['8', '255', '256', '512'], correct: [2],
    explanation: '2^8 = 256 values, from 0 to 255.',
    wrong: { 0: '8 is the number of bits.', 1: '255 is the largest value, not the count.', 3: '512 would need 9 bits.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'What is 2^10?',
    choices: ['100', '512', '1024', '2048'], correct: [2],
    explanation: '2^10 = 1024. This value appears constantly in host-count calculations.',
    wrong: { 0: 'That is 10^2.', 1: '512 = 2^9.', 3: '2048 = 2^11.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'What is 11111000 in decimal?',
    choices: ['240', '248', '252', '224'], correct: [1],
    explanation: '128 + 64 + 32 + 16 + 8 = 248.',
    wrong: { 0: '240 = 11110000.', 2: '252 = 11111100.', 3: '224 = 11100000.' },
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO values can appear as an octet in a valid subnet mask?',
    choices: ['255', '250', '224', '100'], correct: [0, 2],
    explanation: 'Mask octets are runs of leftmost 1s: 0, 128, 192, 224, 240, 248, 252, 254, 255. 250 and 100 are not.',
  },
  {
    id: `${ID}-q7`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'What is 130 AND 128 (bitwise)?',
    choices: ['0', '2', '128', '130'], correct: [2],
    explanation: '130 = 10000010 and 128 = 10000000. Only the leftmost bit is 1 in both, so the result is 10000000 = 128.',
    wrong: { 0: 'The leftmost bits are both 1, so the result is not 0.', 1: 'The mask has a 0 in the 2s column, so that bit is cleared.', 3: 'AND with a mask clears the host bits; it does not return the original.' },
  },
  {
    id: `${ID}-q8`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'medium', type: 'single',
    prompt: 'What is hexadecimal C0 in decimal?',
    choices: ['160', '176', '192', '208'], correct: [2],
    explanation: 'C = 12, so 0xC0 = 12 × 16 + 0 = 192, which is 11000000 in binary.',
    wrong: { 0: '160 = 0xA0.', 1: '176 = 0xB0.', 3: '208 = 0xD0.' },
  },
  {
    id: `${ID}-q9`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: the decimal number 5 written as a full octet is 00000101.',
    choices: ['True', 'False'], correct: [0],
    explanation: '4 + 1 = 5, so the bits for 4 and 1 are on: 00000101.',
  },
  {
    id: `${ID}-q10`, lessonIds: [ID], domain: 'D1', objective: '1.6', difficulty: 'easy', type: 'single',
    prompt: 'What is the largest decimal value one octet can hold?',
    choices: ['128', '254', '255', '256'], correct: [2],
    explanation: 'All eight bits on = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255.',
    wrong: { 0: '128 is the largest single place value.', 1: '254 is one less than the maximum.', 3: 'An octet cannot hold 256.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D1', category: 'concept', front: 'Pro tip: paano tandaan ang binary place values at mask octets?', back: 'Mula kanan, doble: 1, 2, 4, 8, 16, 32, 64, 128. Mask octets: idagdag ang barya mula kaliwa: 128, 192, 224, 240, 248, 252, 254, 255. Convert: tanungin bawat barya “kasya ba?”.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Place values of an octet?', back: '128, 64, 32, 16, 8, 4, 2, 1.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'How many values can an octet hold and what is the range?', back: '256 values, 0 to 255.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Valid mask octet values?', back: '0, 128, 192, 224, 240, 248, 252, 254, 255.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D1', category: 'ipv4', front: '2^8, 2^10, 2^16?', back: '256, 1024, 65,536.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Binary for 192, 224, 240?', back: '11000000, 11100000, 11110000.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'Binary for 248, 252, 254?', back: '11111000, 11111100, 11111110.' },
  { id: `${ID}-f7`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'What is a nibble?', back: '4 bits — exactly one hexadecimal digit.' },
  { id: `${ID}-f8`, lessonId: ID, domain: 'D1', category: 'ipv4', front: 'What does bitwise AND do with a subnet mask?', back: 'Keeps address bits where the mask has 1s (network) and zeroes them where it has 0s (host).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Binary by hand',
  tool: 'Paper',
  minutes: 20,
  objective: 'Convert between decimal and binary without a calculator, then check yourself.',
  steps: [
    'Write the place values 128 64 32 16 8 4 2 1 across the top of a page.',
    'Convert these to binary: 10, 25, 64, 100, 130, 172, 200, 224, 248, 255.',
    'Convert these back to decimal: 00001111, 10000001, 01100100, 11000000, 11111110.',
    'Write the address 192.168.10.1 as four binary octets.',
    'Check every answer with the Binary lab above (Explore mode) or your calculator’s Programmer mode.',
    'Then start Drill mode and score at least 8 out of 10.',
  ],
  checklist: [
    'All ten conversions to binary are correct',
    'All five conversions back to decimal are correct',
    '192.168.10.1 written in binary',
    'Drill mode score of 8/10 or better',
  ],
  hints: [
    'For each number, subtract the largest place value that fits, mark a 1, and continue with the remainder.',
    'Multiples of 32 or 16 have long strings of zeros — they are quick.',
  ],
  solution: [
    '10 = 00001010, 25 = 00011001, 64 = 01000000, 100 = 01100100, 130 = 10000010, 172 = 10101100, 200 = 11001000, 224 = 11100000, 248 = 11111000, 255 = 11111111.',
    '00001111 = 15, 10000001 = 129, 01100100 = 100, 11000000 = 192, 11111110 = 254.',
    '192.168.10.1 = 11000000.10101000.00001010.00000001.',
  ],
  breakIt: 'Convert 300 to binary. What happens, and what does that tell you about the largest value an octet can hold?',
};
