import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'json-data';

export const lesson: Lesson = {
  id: ID,
  moduleId: '6.6',
  domain: 'D6',
  title: 'JSON, XML and YAML: Reading Data Formats',
  description: 'Read and interpret JSON objects, arrays and nested data, and recognise how XML and YAML express the same information.',
  whyMatters:
    'Sa exam, bibigyan ka ng JSON at tatanungin kung ano ang value ng isang key, ilang item sa array, o anong uri ng data ang isang value. Madali ito kapag alam mo ang mga bracket at quote. Ito rin ang format na ginagamit ng halos lahat ng modernong network API.',
  objectives: [
    'Identify JSON objects, arrays, keys and values',
    'Recognise the six JSON value types',
    'Read nested JSON to extract a value',
    'Spot JSON syntax errors',
    'Recognise the same data in XML and YAML',
  ],
  estimatedMinutes: 35,
  difficulty: 'exam',
  keywords: ['JSON', 'XML', 'YAML', 'key value', 'object', 'array', 'nested', 'data format', 'curly braces', 'square brackets', 'serialization'],
  examObjectives: ['6.7'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Data formats are how programs exchange information. JSON is the most common for APIs: it is text made of objects (curly braces), arrays (square brackets), keys and values.',
        'XML and YAML carry the same kind of data with different syntax.',
      ],
      taglish: [
        'Ang **data format** ay paraan ng mga program para magpalitan ng impormasyon. Ang **JSON** ang pinakakaraniwan sa API: text na binubuo ng **object `{ }`**, **array `[ ]`**, **key at value**.',
        'Ang **XML** (may tags `<tag>`) at **YAML** (indentation, walang bracket) ay nagdadala ng parehong uri ng data pero magkaiba ang syntax.',
        'Sa JSON: **key ay laging string na nasa double quote**; ang **value** ay string, number, boolean (`true`/`false`), null, array o object. Ang mga item ay hinihiwalay ng **comma**, ang key at value ng **colon**.',
      ],
      technical: [
        'JSON (JavaScript Object Notation) is language-independent text. An object is an unordered set of key/value pairs in { }. An array is an ordered list in [ ]. Keys are strings in double quotes. Values are string, number, true, false, null, object or array. Values can nest to any depth.',
        'XML uses start and end tags and attributes (<interface name="Gi0/0">…</interface>) and is more verbose; YAML uses indentation and hyphens for lists and is common in Ansible playbooks and configuration files. NETCONF uses XML; REST APIs use JSON mostly.',
        'Converting data structures into a text format for transfer is serialisation; parsing text back is deserialisation. Syntax errors in JSON usually come from missing commas, missing quotes, single quotes or a trailing comma.',
      ],
    },
    {
      type: 'analogy',
      title: 'Aparador at kahon',
      body: [
        'A JSON object is a labelled cabinet: each drawer has a label (key) and something inside (value). An array is a numbered row of boxes. A drawer can hold another cabinet, which is nesting.',
      ],
      taglish: [
        'Ang **JSON object** ay parang **aparador na may label ang bawat drawer** (key) at may laman (value). Ang **array** ay **hilera ng may-numerong kahon**. Ang isang drawer ay maaaring maglaman ng **isa pang aparador** — iyon ang **nesting**.',
      ],
    },
    {
      type: 'hook',
      title: 'Kulot = object, Kuwadrado = array',
      trick: '**{ } = OBJECT (key:value) · [ ] = ARRAY (listahan) · "key" laging quote · comma sa pagitan, walang comma sa dulo.**',
      taglish: [
        '**{ }** = object: mga pares ng key at value.',
        '**[ ]** = array: listahan ng value (nagsisimula ang bilang sa 0 kapag ina-access sa code).',
        '**"key"** = laging double quote. Ang value na string ay quote din; ang number at true/false/null ay hindi.',
        '**Comma** sa pagitan ng mga item; **walang trailing comma** sa JSON.',
      ],
      test: {
        question: 'Sa {"interfaces":["Gi0/0","Gi0/1"]}, ano ang uri ng value ng "interfaces" at ilan ang item?',
        answer: 'Array (nasa [ ]), may 2 item: "Gi0/0" at "Gi0/1".',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Basahin ang JSON nang bahagi-bahagi',
      paragraphs: [
        'Tingnan ang halimbawa sa CLI box sa ibaba. Ang pinakalabas na `{ }` ay isang object. Ang key na `"hostname"` ay may string na `"R1"`. Ang `"uptime"` ay number (walang quote). Ang `"up"` ay boolean. Ang `"interfaces"` ay array ng string. Ang `"location"` ay nested object na may key na `"site"`.',
        'Para makuha ang value: sundan ang landas. Ang site ay nasa `location` → `site` = `"HQ"`. Ang unang interface ay `interfaces[0]` = `"Gi0/0"`. Sa array, ang bilang ay nagsisimula sa 0.',
        'Kapag may array ng object (karaniwan sa API): `"devices":[{"id":1},{"id":2}]` — bawat item ay object; ang ikalawang id ay `devices[1].id` = 2.',
      ],
      steps: [
        'Tingnan ang pinakalabas na bracket: { } o [ ].',
        'Basahin ang bawat key at tukuyin ang uri ng value.',
        'Para sa nested, sundan ang mga key isa-isa.',
        'Para sa array, bilangin mula 0.',
      ],
      tricks: [
        'Ang value na `"3600"` (may quote) ay string, hindi number — madalas itong tanong.',
        'Isulat ang landas bilang `location.site` o `interfaces[0]` para hindi malito.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Syntax errors at ang XML at YAML na bersyon',
      paragraphs: [
        'Karaniwang error sa JSON: (1) single quote (`\'R1\'`), (2) walang quote sa key, (3) kulang na comma sa pagitan ng item, (4) sobrang comma sa dulo, (5) hindi nakasarang bracket. Ang isang error ay sisira sa buong dokumento.',
        '**XML**: `<device><hostname>R1</hostname><up>true</up></device>` — may start at end tag; mas mahaba. **YAML**: `hostname: R1` at sa susunod na linya `interfaces:` na may `- Gi0/0` at `- Gi0/1` — indentation (spaces, hindi tab) ang nagpapakita ng istruktura. Ang Ansible playbooks ay YAML.',
        'Sa exam, bibigyan ka ng parehong data sa magkaibang format; ang kaya mong gawin ay kilalanin ang key at value sa bawat isa.',
      ],
      steps: [
        'Tingnan ang mga bracket at quote para sa syntax error.',
        'Sa XML, hanapin ang pares ng tags.',
        'Sa YAML, sundan ang indentation at ang hyphen na simbolo ng list item.',
      ],
      tricks: [
        'Hindi pinapayagan ang komento sa JSON.',
        'YAML: gumamit ng spaces; ang tab ay error.',
      ],
    },
    {
      type: 'remember',
      title: 'Data format na lumalabas sa exam',
      items: [
        '**{ } = object (key:value); [ ] = array (listahan).**',
        '**Key = string na nasa double quote; value = string, number, true/false, null, array o object.**',
        '**Comma sa pagitan ng mga item; walang trailing comma.**',
        '**JSON: karaniwan sa REST; XML: tags, NETCONF; YAML: indentation, Ansible.**',
        '**"3600" (may quote) = string; 3600 = number.**',
      ],
    },
    { type: 'diagram', id: 'json-anatomy', caption: 'Mga bahagi ng isang JSON object.' },
    {
      type: 'terms',
      items: [
        { term: 'JSON', definition: 'A lightweight text data format of key/value pairs, objects and arrays.' },
        { term: 'Object', definition: 'An unordered set of key/value pairs written inside curly braces.' },
        { term: 'Array', definition: 'An ordered list of values written inside square brackets.' },
        { term: 'Key', definition: 'The name of a value; a string in double quotes in JSON.' },
        { term: 'Nesting', definition: 'Placing objects or arrays inside other objects or arrays.' },
        { term: 'XML', definition: 'A tag-based markup format used by NETCONF and many older APIs.' },
        { term: 'YAML', definition: 'An indentation-based format widely used for configuration and Ansible playbooks.' },
      ],
    },
    {
      type: 'flow',
      title: 'Paano basahin ang JSON',
      steps: [
        'Hanapin ang pinakalabas na { } o [ ].',
        'Basahin ang bawat key at kilalanin ang uri ng value.',
        'Sundan ang nested na landas hanggang sa hinahanap na value.',
        'Sa array, bilangin ang index mula 0.',
        'Suriin ang quote, comma at bracket kung may error.',
      ],
    },
    {
      type: 'cli',
      title: 'Halimbawang JSON',
      transcript: `{
  "hostname": "R1",
  "uptime": 3600,
  "up": true,
  "interfaces": ["Gi0/0", "Gi0/1"],
  "location": { "site": "HQ" }
}`,
      copyable: '{"hostname":"R1","uptime":3600,"up":true,"interfaces":["Gi0/0","Gi0/1"],"location":{"site":"HQ"}}',
      explain: [
        { line: '"uptime": 3600', why: 'A number: no quotes. With quotes ("3600") it would be a string.' },
        { line: '"interfaces": ["Gi0/0", "Gi0/1"]', why: 'An array of two strings; the first item is index 0.' },
        { line: '"location": { "site": "HQ" }', why: 'A nested object; the value of site is reached through location.' },
      ],
      note: 'Strict JSON has no comments and no trailing commas.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang `"3600"` na may quote ay **string**, hindi number. Ang `true` na walang quote ay boolean; ang `"true"` ay string.' },
    { type: 'callout', kind: 'trap', text: 'Ang JSON ay **hindi** pumapayag ng single quotes at trailing comma. Ang ganoong “JSON” ay may syntax error.' },
    { type: 'callout', kind: 'tip', text: 'Isulat ang landas gamit ang tuldok at bracket (`location.site`, `interfaces[0]`) para madaling sundan ang nested data.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Counting array positions from 1 instead of 0.',
        'Treating a quoted number as a number.',
        'Using single quotes or leaving a trailing comma.',
        'Confusing an object with an array.',
        'Using tabs for indentation in YAML.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Hindi ma-parse ang JSON',
      scenario: 'A script that sends configuration data to a controller receives a 400 Bad Request.',
      evidence: `{
  "hostname": "R1",
  "interfaces": ["Gi0/0", "Gi0/1",],
  'site': "HQ"
}`,
      question: 'Ano ang mga mali sa JSON?',
      answer: 'There is a trailing comma after "Gi0/1" in the array, and the key \'site\' uses single quotes. Both are syntax errors, so the parser rejects the whole body.',
      fix: 'Remove the trailing comma and change the key to "site" in double quotes. Validate the JSON with a linter before sending the request.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Sa {"devices":[{"name":"SW1","vlans":[10,20]},{"name":"SW2","vlans":[30]}]}: ano ang value ng devices[1].name, at ilan ang VLAN ni SW1?',
      answer: 'devices[1].name = "SW2" (index 1 is the second item). SW1 has 2 VLANs: 10 and 20.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Curly braces are objects; square brackets are arrays.',
        'Keys are quoted strings.',
        'Array indexes start at 0 in programs.',
        'Look for missing commas and quotes.',
        'JSON is the common REST format; XML for NETCONF; YAML for Ansible.',
      ],
    },
    {
      type: 'summary',
      points: [
        'JSON has objects, arrays, keys and values.',
        'Value types: string, number, boolean, null, array, object.',
        'Nesting lets data hold other data.',
        'XML and YAML carry the same data differently.',
        'Susunod: Ansible at Terraform.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D6', objective: '6.7', difficulty: 'easy', type: 'single',
    prompt: 'In JSON, which characters enclose an object?',
    choices: ['[ ]', '{ }', '< >', '( )'], correct: [1],
    explanation: 'Objects are enclosed in curly braces; arrays use square brackets.',
    wrong: { 0: 'Square brackets enclose an array.', 2: 'Angle brackets are XML tags.', 3: 'Parentheses are not JSON delimiters.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D6', objective: '6.7', difficulty: 'medium', type: 'single',
    prompt: 'Given {"hostname":"R1","interfaces":["Gi0/0","Gi0/1"]}, what is the value type of "interfaces"?',
    choices: ['String', 'Object', 'Array', 'Boolean'], correct: [2],
    explanation: 'The value is enclosed in square brackets, so it is an array of two strings.',
    wrong: { 0: 'A string is a single quoted value.', 1: 'An object would use curly braces.', 3: 'A boolean is true or false.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D6', objective: '6.7', difficulty: 'medium', type: 'single',
    prompt: 'What is the value of devices[1].name in {"devices":[{"name":"SW1"},{"name":"SW2"}]}?',
    choices: ['SW1', 'SW2', 'devices', 'null'], correct: [1],
    explanation: 'Array indexes start at 0, so index 1 is the second object, whose name is SW2.',
    wrong: { 0: 'That is index 0.', 2: 'That is the key of the array.', 3: 'The key exists and has a value.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D6', objective: '6.7', difficulty: 'hard', type: 'single',
    prompt: 'Which of the following is valid JSON?',
    choices: ['{"a": 1, "b": 2,}', '{\'a\': 1}', '{"a": 1, "b": [1, 2]}', '{a: 1}'], correct: [2],
    explanation: 'Keys must be double-quoted and there must be no trailing comma. Only the third example follows the rules.',
    wrong: { 0: 'It has a trailing comma.', 1: 'It uses single quotes.', 3: 'The key is not quoted.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D6', objective: '6.7', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: in JSON, the value "3600" (with quotes) is a number.',
    choices: ['True', 'False'], correct: [1],
    explanation: 'A value in quotes is a string, even if it contains digits.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D6', objective: '6.7', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are valid JSON value types?',
    choices: ['Array', 'Boolean', 'Function', 'Comment'], correct: [0, 1],
    explanation: 'JSON values are string, number, boolean, null, array or object. Functions and comments are not part of JSON.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Pro tip: JSON brackets?', back: '{ } = object (key:value) · [ ] = array (listahan) · "key" laging quote · comma sa pagitan, walang comma sa dulo.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D6', category: 'concept', front: 'JSON value types?', back: 'String, number, boolean, null, array, object.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D6', category: 'concept', front: 'How do you reach a nested value?', back: 'Follow the keys: location.site; arrays by index: interfaces[0].' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Where does an array index start?', back: 'At 0.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Common JSON syntax errors?', back: 'Single quotes, unquoted keys, missing or trailing commas, unclosed brackets.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D6', category: 'concept', front: 'XML vs YAML?', back: 'XML uses tags; YAML uses indentation and hyphens (used by Ansible).' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D6', category: 'concept', front: 'String or number: "3600" vs 3600?', back: '"3600" is a string; 3600 is a number.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Write, break and read JSON',
  tool: 'Your computer',
  minutes: 25,
  objective: 'Write JSON for a small network inventory, introduce errors, and extract values by path.',
  steps: [
    'In a text editor write a JSON object for a switch: hostname, model, up (boolean), vlans (array of numbers) and location (nested object with building and floor).',
    'Validate it by pasting it into a JSON validator or running python -m json.tool file.json.',
    'Write the path to the floor and to the second VLAN.',
    'Introduce three errors (single quote, trailing comma, unquoted key) and note the validator’s messages.',
    'Rewrite the same data in YAML and as XML.',
    'Write a JSON array of two switches and the path to the second switch’s hostname.',
  ],
  checklist: [
    'Valid JSON written',
    'Paths to nested values correct',
    'Errors identified',
    'YAML and XML versions written',
  ],
  hints: [
    'vlans[1] is the second VLAN.',
    'Use spaces, not tabs, in YAML.',
  ],
  solution: [
    '{"hostname":"SW1","model":"C9200","up":true,"vlans":[10,20,30],"location":{"building":"A","floor":2}}',
    'Paths: location.floor and vlans[1].',
    'YAML: hostname: SW1 with vlans listed using hyphens; XML: <device><hostname>SW1</hostname>…</device>.',
  ],
  breakIt: 'Quote the number 2 in floor and describe how a program treating floor as a number would react.',
};
