import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'network-automation';

export const lesson: Lesson = {
  id: ID,
  moduleId: '6.1',
  domain: 'D6',
  title: 'Why Network Automation? Traditional vs Automated Management',
  description: 'See why per-device CLI does not scale, what automation improves, and the difference between traditional and automated network management.',
  whyMatters:
    'Ang exam ay hindi nagtatanong kung marunong kang mag-code. Nagtatanong ito kung alam mo ang benepisyo ng automation, ang kaibahan sa traditional management, at ang mga salita tulad ng consistency, scalability at configuration drift. Madaling puntos kapag naintindihan.',
  objectives: [
    'Explain the problems of manual, device-by-device configuration',
    'List the benefits of network automation',
    'Define configuration drift, idempotence and source of truth',
    'Compare traditional and automated management',
    'Describe what automation does not replace',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['network automation', 'configuration drift', 'source of truth', 'idempotent', 'scalability', 'consistency', 'manual configuration', 'CLI', 'API'],
  examObjectives: ['6.1'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Configuring 3 switches by hand is fine. Configuring 3,000 by hand is slow, error-prone and impossible to keep consistent. Automation uses software to apply the same intended configuration to many devices.',
        'The goal is not to remove engineers but to remove repetitive, error-prone work so engineers can focus on design and troubleshooting.',
      ],
      taglish: [
        'Kung 3 switch lang ang iko-configure, okay lang ang manual na CLI. Pero kung **3,000 switch**, mabagal, **madaling magkamali** at imposibleng mapanatiling pare-pareho. Ang **automation** ay gumagamit ng software para ilapat ang **iisang intended configuration** sa maraming device.',
        'Layunin: bawasan ang paulit-ulit at error-prone na trabaho para ang engineer ay makapag-focus sa **design at troubleshooting**, hindi sa pag-type ng parehong command nang libo-libong beses.',
        'Mga benepisyo: **bilis, consistency, scalability, mas kaunting human error, at mas mabilis na pag-audit at pagbawi** (rollback).',
      ],
      technical: [
        'Manual CLI management is per device, procedural and error-prone, and leads to configuration drift: devices gradually differ from the intended standard. Automation tools push configuration or collect data using APIs, SSH, NETCONF or REST, driven from templates and a single source of truth (an inventory or database of intended state).',
        'Declarative tools describe the desired end state and calculate the changes; imperative scripts list the steps. Idempotent operations can be repeated without changing the result once the desired state is reached.',
        'Automation improves speed, consistency and auditability and enables closed-loop operations (monitor, decide, act). It does not remove the need for design, security review and verification.',
      ],
    },
    {
      type: 'analogy',
      title: 'Photocopy vs sulat-kamay',
      body: [
        'Copying a form by hand 3,000 times causes mistakes and each copy looks different. A photocopier makes every copy identical and quick. Automation is the photocopier; the template is the original form.',
      ],
      taglish: [
        'Isipin mong **sinusulat-kamay** ang parehong form ng 3,000 beses: magkakamali ka at magkakaiba ang bawat kopya. Ang **photocopier** ay mabilis at pare-pareho ang bawat kopya. Ang automation ang photocopier; ang **template** ang orihinal na form; at ang **source of truth** ang opisyal na bersyon na kinokopya.',
      ],
    },
    {
      type: 'hook',
      title: 'BCS-E',
      trick: '**BCS-E: Bilis, Consistency, Scale, bawas Error.** Kapag “benefit ng automation”, isa sa apat na iyan.',
      taglish: [
        '**B**ilis: libo-libong device sa ilang minuto.',
        '**C**onsistency: pare-pareho ang config; walang configuration drift.',
        '**S**cale: kayang pamahalaan ang paglaki ng network.',
        '**E**rror reduction: mas kaunting typo at pagkakamali ng tao.',
      ],
      test: {
        question: 'Ano ang configuration drift at paano ito nilalabanan ng automation?',
        answer: 'Unti-unting pagkakaiba ng mga device sa intended config dahil sa manual na pagbabago. Nilalabanan ito ng automation sa pamamagitan ng template at source of truth na paulit-ulit na inilalapat.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Traditional vs automated management',
      paragraphs: [
        '**Traditional**: engineer ay nagka-CLI sa bawat device (SSH), kopya-paste ang commands, nagre-record sa spreadsheet. Bawat device ay iba ang kasaysayan; mahirap malaman ang tunay na estado.',
        '**Automated**: isang script/tool ang nagbabasa ng inventory at template, kumokonekta sa mga device sa pamamagitan ng API/SSH, naglalapat ng configuration at nagsa-save ng resulta. Ang parehong template ay nagagamit muli at nasa version control (hal. Git) kaya may kasaysayan at rollback.',
        'Pagkakaiba sa antas ng operasyon: traditional ay **reactive** (hintayin ang problema), automated ay pwedeng **proactive** at **closed-loop** (nagmo-monitor, nagpapasya, kumikilos).',
      ],
      steps: [
        'Itakda ang intended state (template + variables) sa isang source of truth.',
        'Patakbuhin ang tool laban sa inventory ng mga device.',
        'Ilapat ang pagbabago (sa pamamagitan ng API, NETCONF o SSH).',
        'I-verify ang resulta at itala ito.',
        'Itago ang pagbabago sa version control para sa audit at rollback.',
      ],
      tricks: [
        'Ang isang script na tumatakbo ng sampung beses nang walang pagbabago sa resulta ay idempotent — mahalaga para sa ligtas na pag-ulit.',
        'Maliit na pagsubok muna (lab o isang device) bago ang buong network.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Ano ang HINDI napapalitan ng automation',
      paragraphs: [
        'Hindi pinapalitan ng automation ang **network design**, **security review** at **troubleshooting skill**. Kung ang template ay may mali, **pare-parehong mali** ang mapupunta sa 3,000 device — mabilis ang pagkalat ng error.',
        'Kaya mahalaga ang **testing, staging at peer review**, at ang kakayahang mag-**rollback**. Kailangan pa rin ang malalim na kaalaman sa networking para sumulat ng tamang template.',
        'Sa exam: tamang sagot ay “binabawasan ang human error at nagpapabilis”, hindi “inaalis ang pangangailangan sa engineer”.',
      ],
      tricks: [
        'Ang automation ay multiplier: pinapalaki nito ang tama at ang mali.',
        'Kapag may tanong na “alin ang hindi benepisyo?”, hanapin ang sagot na nagsasabing walang kailangang validation.',
      ],
    },
    {
      type: 'remember',
      title: 'Automation na lumalabas sa exam',
      items: [
        '**Benepisyo: bilis, consistency, scalability, mas kaunting human error.**',
        '**Configuration drift = unti-unting pagkakaiba ng device sa intended config.**',
        '**Idempotent = ulitin nang ulitin, pareho ang resulta.**',
        '**Source of truth = opisyal na intended state; template + variables ang inilalapat.**',
        '**Hindi napapalitan ng automation ang design, security review at troubleshooting.**',
      ],
    },
    { type: 'diagram', id: 'iac-flow', caption: 'Pangkalahatang daloy: code, plan, apply, verify.' },
    {
      type: 'terms',
      items: [
        { term: 'Network automation', definition: 'Using software to configure, manage and verify network devices with little manual work.' },
        { term: 'Configuration drift', definition: 'Devices slowly diverging from the intended configuration.' },
        { term: 'Source of truth', definition: 'The authoritative record of the intended network state.' },
        { term: 'Idempotent', definition: 'An operation that gives the same result however many times it is applied.' },
        { term: 'Template', definition: 'A reusable configuration pattern with variables for each device.' },
        { term: 'Closed-loop automation', definition: 'Monitoring, deciding and acting automatically in a cycle.' },
        { term: 'Version control', definition: 'A system such as Git that records every change and allows rollback.' },
      ],
    },
    {
      type: 'flow',
      title: 'Ang ikot ng automation',
      steps: [
        'Isulat ang intended state at variables.',
        'Piliin ang mga device mula sa inventory.',
        'Ilapat gamit ang tool sa pamamagitan ng API o SSH.',
        'I-verify ang resulta; ihambing sa intended state.',
        'Itala ang pagbabago sa version control at ulitin kung may drift.',
      ],
    },
    { type: 'callout', kind: 'trap', text: 'Ang “automation ay ginagawang hindi na kailangan ang network engineer” ay **mali**. Binabawasan nito ang manual na trabaho pero kailangan pa rin ang design at pag-verify.' },
    { type: 'callout', kind: 'tip', text: 'Kapag nakakita ka ng salitang “consistent”, “repeatable” o “scalable”, malamang automation ang kaugnay na sagot.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Believing that automation removes the need for network engineers.',
        'Applying a new template to the whole network without testing.',
        'Keeping the intended state only in people’s heads instead of a source of truth.',
        'Confusing declarative (desired end state) with imperative (ordered steps).',
        'Ignoring verification after automated changes.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Iba-iba ang config',
      scenario: 'After a year of manual changes, 40 of 200 branch routers have a different NTP server and ACL. Troubleshooting takes long because no one knows what “normal” is.',
      evidence: `R-BR17# show running-config | include ntp
ntp server 10.0.0.9
R-BR18# show running-config | include ntp
ntp server 192.0.2.50`,
      question: 'Anong problema ito at ano ang solusyon?',
      answer: 'Configuration drift caused by manual, device-by-device changes with no source of truth.',
      fix: 'Define the intended configuration in templates and a source of truth, apply it with an automation tool to every router, verify, and keep it in version control so any change is recorded and drift can be detected.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ang kompanya ay may 500 switch at kailangang palitan ang NTP server sa lahat. Ilarawan ang dalawang pagkakaiba ng manual at automated na paraan.',
      answer: 'Manual: log in to 500 devices one by one, slow and error-prone, risk of drift. Automated: change one template variable, apply to all devices through an API/SSH tool, verify automatically, consistent and recorded in version control.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Benefits: speed, consistency, scalability, fewer errors.',
        'Automation does not replace engineers or verification.',
        'Idempotent means repeatable without changing the result.',
        'A source of truth defines the intended state.',
        'Declarative = what; imperative = how.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Manual CLI does not scale and causes drift.',
        'Automation applies templates with consistent results.',
        'Source of truth and version control support auditing and rollback.',
        'Verification is still required.',
        'Susunod: controller-based networking at SDN.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D6', objective: '6.1', difficulty: 'easy', type: 'single',
    prompt: 'Which is a benefit of network automation?',
    choices: ['Eliminates the need for network design', 'Consistent configuration across many devices', 'Removes the need for testing', 'Makes every device the same hardware'], correct: [1],
    explanation: 'Automation applies the same template to many devices, giving consistent configuration.',
    wrong: { 0: 'Design is still needed.', 2: 'Testing remains essential.', 3: 'Automation does not change hardware.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D6', objective: '6.1', difficulty: 'medium', type: 'single',
    prompt: 'What is configuration drift?',
    choices: ['Slow routing convergence', 'Devices gradually differing from the intended configuration', 'Packet loss on a link', 'An encrypted tunnel failing'], correct: [1],
    explanation: 'Drift is the gradual divergence of devices from the intended standard, typically through manual changes.',
    wrong: { 0: 'That describes convergence, not drift.', 2: 'That is a link problem.', 3: 'That is a VPN issue.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D6', objective: '6.1', difficulty: 'medium', type: 'single',
    prompt: 'An operation is run ten times and the device ends in the same state as after the first run. What is this property called?',
    choices: ['Idempotence', 'Latency', 'Redundancy', 'Encapsulation'], correct: [0],
    explanation: 'Idempotent operations can be repeated safely with no further change once the desired state is reached.',
    wrong: { 1: 'Latency is delay.', 2: 'Redundancy is backup capacity.', 3: 'Encapsulation wraps data in headers.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D6', objective: '6.1', difficulty: 'medium', type: 'true-false',
    prompt: 'True or false: a faulty template can quickly spread an error to every device in the network.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'Automation multiplies both correct and incorrect configuration, so testing and review are essential.',
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D6', objective: '6.1', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are advantages of automated over manual network management?',
    choices: ['Fewer human configuration errors', 'Faster rollout across many devices', 'No need for verification', 'Hardware is cheaper'], correct: [0, 1],
    explanation: 'Automation lowers error rates and speeds rollout; verification is still needed and hardware cost is unaffected.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D6', objective: '6.1', difficulty: 'hard', type: 'single',
    prompt: 'Which statement best describes a source of truth in network automation?',
    choices: ['The device that has the most traffic', 'The authoritative record of intended configuration and inventory', 'The router with the lowest ID', 'A backup of the running configuration only'], correct: [1],
    explanation: 'A source of truth holds the intended state from which templates and variables are generated.',
    wrong: { 0: 'Traffic volume is unrelated.', 2: 'Router IDs are routing-protocol identifiers.', 3: 'A backup records actual state, not the intended state.' },
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Pro tip: benepisyo ng automation?', back: 'BCS-E: Bilis, Consistency, Scale, bawas Error.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What is configuration drift?', back: 'Devices slowly diverging from the intended configuration.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What does idempotent mean?', back: 'Repeating the operation gives the same result.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What is a source of truth?', back: 'The authoritative record of intended state and inventory.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Declarative vs imperative?', back: 'Declarative states the desired end result; imperative lists the steps.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What does automation not replace?', back: 'Network design, security review, testing and troubleshooting skill.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Why use version control?', back: 'It records every change, enabling audit and rollback.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Template a configuration by hand, then script it',
  tool: 'Your computer',
  minutes: 30,
  objective: 'Build a configuration template with variables, fill it for three devices and compare to the manual approach.',
  steps: [
    'Write a router interface template with variables {{hostname}}, {{loopback_ip}} and {{ntp_server}}.',
    'Create a small table for three devices (R1, R2, R3) with values for each variable.',
    'Fill the template manually for each device and note how long it takes and any mistakes.',
    'Write down how the same task would run for 300 devices using a tool.',
    'List three checks you would run after pushing the configuration (show commands).',
    'Describe how you would detect configuration drift next month.',
  ],
  checklist: [
    'Template with variables written',
    'Three device configs generated',
    'Verification commands listed',
    'Drift detection described',
  ],
  hints: [
    'Use any text editor or a spreadsheet mail-merge to practise the idea.',
    'Think about what changes per device and what stays the same.',
  ],
  solution: [
    'Variables hold hostname, loopback and NTP; the structure is fixed.',
    'Verification: show running-config | include ntp, show ip interface brief, ping the NTP server.',
    'Drift detection: compare device configurations with the template output on a schedule.',
  ],
  breakIt: 'Introduce a typo into the template and describe how many devices would receive it if applied to the whole network.',
};
