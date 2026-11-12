import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ai-ml-network-ops';

export const lesson: Lesson = {
  id: ID,
  moduleId: '6.8',
  domain: 'D6',
  title: 'AI and Machine Learning in Network Operations',
  description: 'Distinguish predictive and generative AI, understand how machine learning uses network data, and know the limits and the need for human verification.',
  whyMatters:
    'Bago ang topic na ito sa CCNA. Ang tanong ay halos laging konsepto: ano ang predictive AI, ano ang generative AI, at ano ang panganib. Madaling puntos kapag alam mo ang dalawang kategorya at ang kahalagahan ng pag-verify.',
  objectives: [
    'Define AI and machine learning in a networking context',
    'Distinguish predictive from generative AI with examples',
    'Describe how telemetry and data feed models',
    'List benefits and limits, including hallucination and bias',
    'Explain why human verification is required',
  ],
  estimatedMinutes: 25,
  difficulty: 'beginner',
  keywords: ['AI', 'machine learning', 'predictive AI', 'generative AI', 'telemetry', 'anomaly detection', 'hallucination', 'training data', 'assurance', 'closed loop'],
  examObjectives: ['6.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Machine learning (ML) finds patterns in data and uses them to make predictions. In networking, the data is telemetry, logs and flow records. Predictive AI forecasts or classifies; generative AI creates new content such as text, summaries or configuration.',
        'AI can speed up operations but its output must be checked by a person before it changes a production network.',
      ],
      taglish: [
        'Ang **machine learning (ML)** ay naghahanap ng **pattern sa data** at gumagamit nito para humula. Sa networking, ang data ay **telemetry, logs at flow records**. Ang **predictive AI** ay **humuhula o nag-uuri** (hal. “babagsak ang link na ito”); ang **generative AI** ay **gumagawa ng bagong nilalaman** (text, buod, config).',
        'Makakatulong ang AI na pabilisin ang operasyon, pero ang **resulta ay dapat i-verify ng tao** bago ilapat sa production network.',
        'Mga halimbawa: **anomaly detection**, **predictive maintenance**, **natural-language na paghahanap ng problema**, **awtomatikong buod ng incident**, **pagbuo ng draft configuration**.',
      ],
      technical: [
        'Predictive AI uses historical and live data (telemetry, syslog, NetFlow) to forecast events or classify behaviour, for example predicting a link failure, detecting an anomalous traffic pattern or recommending capacity changes. Generative AI uses models trained on large data sets to produce new content such as configuration drafts, explanations and incident summaries from prompts.',
        'The quality of an AI result depends on the quality, quantity and relevance of the training data. Limits include hallucination (confident but wrong output), bias from unrepresentative data, lack of transparency, and security or privacy risk when sensitive network data is shared with external models.',
        'Network assurance platforms use ML to baseline normal behaviour and flag deviations. Closed-loop automation can act on insights automatically, but changes should be validated, tested and approved to avoid propagating errors.',
      ],
    },
    {
      type: 'analogy',
      title: 'Panahon vs kuwentista',
      body: [
        'Predictive AI is like a weather forecaster using past data to say tomorrow’s likelihood of rain. Generative AI is like a storyteller who writes a new story from your request. The forecaster can be wrong, and the storyteller can invent facts, so both need checking.',
      ],
      taglish: [
        'Ang **predictive AI** ay parang **weather forecaster**: gumagamit ng lumang data para sabihin ang posibilidad ng ulan bukas. Ang **generative AI** ay parang **kuwentista** na gumagawa ng bagong kuwento mula sa hiling mo. Ang forecaster ay pwedeng magkamali at ang kuwentista ay pwedeng **mag-imbento ng totoo** (hallucination) — kaya **kailangan pa ring i-verify** ang dalawa.',
      ],
    },
    {
      type: 'hook',
      title: 'HULA vs GAWA',
      trick: '**PREDICTIVE = HULA (forecast/uri). GENERATIVE = GAWA (bagong content). Lahat: I-VERIFY bago ilapat.**',
      taglish: [
        '**Predictive = hula/uri**: anomaly detection, hula sa pagkasira, capacity planning.',
        '**Generative = gawa**: draft config, buod ng incident, paliwanag sa wika ng tao.',
        '**Data** ang gasolina: telemetry, logs, flow. Kapag mali o kulang ang data, mali ang resulta.',
        '**Hallucination** = tiwala pero maling sagot. Kaya **human verification** palagi.',
      ],
      test: {
        question: 'Alin ang predictive at alin ang generative: (a) hinuhulaan na babagsak ang uplink, (b) sumusulat ng draft ng ACL mula sa paglalarawan?',
        answer: '(a) Predictive AI. (b) Generative AI.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Saan ginagamit ang AI/ML sa network',
      paragraphs: [
        '**Assurance at anomaly detection**: kinukuha ng platform ang telemetry (latency, packet loss, client onboarding time) at ina-aral ang “normal”. Kapag may paglihis, nagbababala at nagmumungkahi ng sanhi.',
        '**Predictive maintenance at capacity planning**: ang trend ng paggamit ng link ay ginagamit para hulaan kung kailan mauubusan ng bandwidth, o kung aling device ang malamang masira.',
        '**Generative AI**: ginagamit bilang katulong — nagpapaliwanag ng error log, gumagawa ng buod ng incident, nagmumungkahi ng configuration batay sa paglalarawan. Ang panuntunan: **draft lang ito**, hindi final.',
        '**Seguridad**: ML sa threat detection (hindi karaniwang trapiko) at sa pagsala ng phishing.',
      ],
      steps: [
        'Kolektahin ang telemetry at logs.',
        'Sanayin ang model gamit ang makasaysayang data.',
        'Gamitin ang model sa live data para humula o mag-flag.',
        'Isang tao ang nagsusuri ng resulta.',
        'Ilapat ang pagbabago sa kontroladong paraan at i-verify.',
      ],
      tricks: [
        'Kung ang tanong ay “nakabatay sa nakaraang data para hulaan”, predictive ang sagot.',
        'Kung ang tanong ay “lumilikha ng bagong text/config”, generative ang sagot.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Mga limitasyon at ang tungkulin ng tao',
      paragraphs: [
        '**Hallucination**: ang generative model ay maaaring magbigay ng maayos pakinggan pero maling command o maling paliwanag. **Bias**: kung ang training data ay hindi kumakatawan sa totoong network mo, mali ang konklusyon. **Privacy at seguridad**: huwag ipasok ang sensitibong data (password, buong config) sa external na AI service nang walang pahintulot.',
        '**Black box**: minsan hindi malinaw kung bakit nagbigay ng ganoong resulta, kaya mahirap ipaliwanag sa audit.',
        'Kaya: gamitin ang AI bilang **katulong**, ipa-review sa engineer, subukan muna sa lab o maliit na bahagi, at panatilihin ang kakayahang mag-rollback. Ang pananagutan ay nasa tao.',
      ],
      steps: [
        'Humingi ng draft mula sa AI tool.',
        'Suriin ito laban sa dokumentasyon at sa sariling kaalaman.',
        'Subukan sa lab o staging.',
        'Ilapat nang unti-unti at i-monitor.',
      ],
      tricks: [
        'Sa exam: “Ano ang panganib ng generative AI?” → hallucination, bias, privacy.',
        'Ang tamang pag-iingat ay “verify before apply”.',
      ],
    },
    {
      type: 'remember',
      title: 'AI/ML na lumalabas sa exam',
      items: [
        '**Predictive AI = hula/uri mula sa data (anomaly, failure, capacity).**',
        '**Generative AI = lumilikha ng bagong content (text, config, buod).**',
        '**Data ang pundasyon: kalidad ng training data = kalidad ng resulta.**',
        '**Mga panganib: hallucination, bias, privacy, kawalan ng transparency.**',
        '**Laging i-verify ng tao bago ilapat ang AI output.**',
      ],
    },
    { type: 'diagram', id: 'ai-ops-loop', caption: 'Data, model, insight at pagsusuri ng tao.' },
    {
      type: 'terms',
      items: [
        { term: 'Machine learning', definition: 'Algorithms that learn patterns from data to make predictions or decisions.' },
        { term: 'Predictive AI', definition: 'AI that forecasts events or classifies data based on patterns.' },
        { term: 'Generative AI', definition: 'AI that creates new content such as text or configuration from prompts.' },
        { term: 'Telemetry', definition: 'Streaming operational data from devices used for monitoring and analytics.' },
        { term: 'Anomaly detection', definition: 'Identifying behaviour that deviates from a learned normal baseline.' },
        { term: 'Hallucination', definition: 'Confident-sounding but incorrect output from a generative model.' },
        { term: 'Training data', definition: 'The data used to teach a model; its quality shapes the results.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ligtas na paggamit ng AI sa network',
      steps: [
        'Tukuyin ang gawain (hula o paglikha).',
        'Ihanda ang malinis at angkop na data.',
        'Kunin ang resulta ng AI bilang draft o mungkahi.',
        'Suriin at subukan sa lab o staging.',
        'Ilapat nang kontrolado at i-monitor; may rollback.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang AI output ay hindi awtomatikong tama. Ang pagtitiwala nang walang **verification** ay ang pinakamalaking pagkakamali sa tanong na ito.' },
    { type: 'callout', kind: 'trap', text: 'Hindi pareho ang predictive at generative: ang una ay **humuhula/nag-uuri**, ang ikalawa ay **lumilikha**.' },
    { type: 'callout', kind: 'tip', text: 'Maghanap ng salitang “forecast”, “detect”, “classify” → predictive; “create”, “write”, “summarise” → generative.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Applying AI-generated configuration without review.',
        'Mixing up predictive and generative AI.',
        'Sharing sensitive network data with external AI tools.',
        'Assuming more data automatically means better data.',
        'Believing AI removes the need for engineers.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Maling AI-generated ACL',
      scenario: 'An engineer asks a generative AI assistant for an ACL to block guest web access and pastes it straight into production. Guests are blocked but so is all staff DNS.',
      evidence: `ip access-list extended GUEST
 deny udp any any eq 53
 deny tcp any any eq 80
 permit ip any any`,
      question: 'Ano ang nangyari at ano ang tamang proseso?',
      answer: 'The generated draft was applied without review. The first line denies DNS for everyone matched by the ACL, which was not the intent. This is the risk of hallucinated or over-broad output.',
      fix: 'Treat AI output as a draft: review each line, restrict it to the guest subnet, test in a lab or staging, apply in a controlled way and keep a rollback plan.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Uriin: (a) tool na nagsasabing “malamang mapuno ang link na ito sa loob ng 30 araw”, (b) tool na gumagawa ng buod ng 500 log lines, (c) tool na nagtatakda ng “normal” na baseline at nagba-flag ng kakaiba. Predictive o generative?',
      answer: '(a) Predictive. (b) Generative. (c) Predictive (anomaly detection).',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Predictive = forecast or classify; generative = create new content.',
        'Quality of data determines quality of the result.',
        'Risks: hallucination, bias, privacy.',
        'A human must verify before applying.',
        'AI supports engineers; it does not replace them.',
      ],
    },
    {
      type: 'summary',
      points: [
        'ML learns patterns from network data.',
        'Predictive AI forecasts or classifies; generative AI creates.',
        'Data quality matters.',
        'Limits: hallucination, bias, privacy.',
        'Always verify before applying.',
        'Susunod: security programs at password policy.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D6', objective: '6.4', difficulty: 'easy', type: 'single',
    prompt: 'Which type of AI uses historical network data to forecast a link failure?',
    choices: ['Generative AI', 'Predictive AI', 'Rule-based filtering only', 'Edge computing'], correct: [1],
    explanation: 'Predictive AI analyses past and current data to forecast events.',
    wrong: { 0: 'Generative AI creates new content.', 2: 'Static rules do not learn from data.', 3: 'Edge computing is a deployment location, not an AI type.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D6', objective: '6.4', difficulty: 'medium', type: 'single',
    prompt: 'An AI assistant writes a draft device configuration from a text description. What type of AI is this?',
    choices: ['Predictive', 'Generative', 'Supervised classification only', 'Anomaly detection'], correct: [1],
    explanation: 'Creating new content such as configuration from a prompt is generative AI.',
    wrong: { 0: 'Predictive AI forecasts or classifies.', 2: 'Classification does not generate configuration.', 3: 'Anomaly detection flags unusual behaviour.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D6', objective: '6.4', difficulty: 'medium', type: 'single',
    prompt: 'What is an AI hallucination?',
    choices: ['A very slow response', 'Confident but incorrect or invented output', 'Encrypted output', 'A network loop'], correct: [1],
    explanation: 'A hallucination is output that sounds plausible but is false or made up.',
    wrong: { 0: 'Speed is unrelated.', 2: 'Encryption is unrelated.', 3: 'A loop is a Layer 2 problem.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D6', objective: '6.4', difficulty: 'hard', type: 'single',
    prompt: 'What is the best practice before applying AI-generated configuration to a production network?',
    choices: ['Apply immediately to save time', 'Review and test it, then apply in a controlled way', 'Delete the existing configuration first', 'Disable logging'], correct: [1],
    explanation: 'Treat AI output as a draft: review, test, then apply with a rollback plan.',
    wrong: { 0: 'This risks outages.', 2: 'This is dangerous and unnecessary.', 3: 'Logging helps verify and troubleshoot.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D6', objective: '6.4', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: the quality of a machine learning result depends on the quality of its training data.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'Poor or biased data produces poor or biased results.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D6', objective: '6.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are limitations or risks of using generative AI in network operations?',
    choices: ['Hallucinated or incorrect output', 'Privacy risk when sharing sensitive data', 'It cannot read text', 'It always produces the same answer'], correct: [0, 1],
    explanation: 'Generative AI can invent incorrect output and can expose sensitive data if it is shared with external services.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Pro tip: predictive vs generative?', back: 'PREDICTIVE = HULA (forecast/uri). GENERATIVE = GAWA (bagong content). Lahat: i-verify bago ilapat.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What is predictive AI?', back: 'AI that forecasts events or classifies data from patterns.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What is generative AI?', back: 'AI that creates new content such as text or configuration.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What is a hallucination?', back: 'Confident but wrong or invented output.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What data feeds network ML?', back: 'Telemetry, logs and flow records.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Risks of AI in operations?', back: 'Hallucination, bias, privacy leaks and lack of transparency.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Best practice for AI output?', back: 'Human review and testing before applying; keep rollback.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Classify AI use cases and review a draft',
  tool: 'Paper',
  minutes: 20,
  objective: 'Classify network AI use cases as predictive or generative and review a generated configuration for errors.',
  steps: [
    'List eight AI features a network platform might offer (for example anomaly alerts, incident summary, config draft, capacity forecast).',
    'Classify each as predictive or generative.',
    'Write down which data each feature needs.',
    'Review the generated ACL from the troubleshooting example and mark each risky line.',
    'Write a short checklist of five steps to take before applying AI-generated configuration.',
    'List two types of data you should never paste into an external AI tool.',
  ],
  checklist: [
    'Eight use cases classified',
    'Data sources listed',
    'Risky lines identified',
    'Verification checklist written',
  ],
  hints: [
    'Forecasts and anomaly detection are predictive.',
    'Anything that writes new text is generative.',
  ],
  solution: [
    'Predictive: anomaly alerts, capacity forecast, failure prediction. Generative: incident summary, config draft, log explanation.',
    'Risky: deny udp any any eq 53 (blocks DNS for everyone).',
    'Never paste passwords, SNMP communities, keys or full production configs into external tools.',
  ],
  breakIt: 'Imagine the training data comes only from a small lab network and describe how its predictions could mislead you in production.',
};
