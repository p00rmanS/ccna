import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'ansible-terraform';

export const lesson: Lesson = {
  id: ID,
  moduleId: '6.7',
  domain: 'D6',
  title: 'Ansible and Terraform: Configuration Management and Infrastructure as Code',
  description: 'Recognise what Ansible and Terraform do, how they differ, and key terms such as playbook, inventory, module, state and idempotence.',
  whyMatters:
    'Hindi kailangang marunong kang mag-code ng Ansible o Terraform sa CCNA. Kailangan mong makilala kung alin ang alin: agentless ba, push o pull, YAML o HCL, configuration management o provisioning. Ito ay puntos na nakukuha sa pag-alam ng ilang katangian.',
  objectives: [
    'Describe what Ansible does and its main components',
    'Describe what Terraform does and its main components',
    'Compare agentless and agent-based, push and pull, declarative and procedural',
    'Read a simple playbook',
    'Choose the right tool for a given scenario',
  ],
  estimatedMinutes: 35,
  difficulty: 'exam',
  keywords: ['Ansible', 'Terraform', 'playbook', 'inventory', 'module', 'HCL', 'YAML', 'state file', 'infrastructure as code', 'agentless', 'push', 'declarative', 'Puppet', 'Chef'],
  examObjectives: ['6.6'],
  sections: [
    {
      type: 'explain',
      simple: [
        'Ansible and Terraform are tools that automate infrastructure. Ansible mainly configures existing devices using YAML playbooks over SSH with no agent. Terraform mainly provisions infrastructure (cloud networks, VMs) from declarative HCL files and tracks it in a state file.',
        'Both support infrastructure as code: the desired state is written in text files you can review and store in version control.',
      ],
      taglish: [
        'Ang **Ansible** at **Terraform** ay mga tool na nag-a-automate ng infrastructure. **Ansible**: pangunahing nagko-**configure ng mga umiiral na device** gamit ang **YAML playbook** sa SSH, **walang agent**. **Terraform**: pangunahing **nagpo-provision** (gumagawa ng cloud network, VM) mula sa **HCL** files at sinusubaybayan sa **state file**.',
        'Pareho silang **infrastructure as code**: ang gustong estado ay nakasulat sa text file na pwedeng i-review at itago sa **version control**.',
        'Ibang tool: **Puppet** at **Chef** ay agent-based at pull (ang device ang humihingi ng config); ang Ansible ay **agentless at push**.',
      ],
      technical: [
        'Ansible is agentless: the control node connects to managed nodes over SSH (or an API) and runs modules. Its inventory lists hosts and groups; a playbook (YAML) contains plays made of tasks that call modules. Tasks are designed to be idempotent. It is push-based and uses a procedural-leaning, task-ordered approach, although most modules describe desired state.',
        'Terraform is declarative: configuration in HCL describes the desired resources. terraform init, plan and apply compare the configuration with the recorded state file and make only the required changes. It uses providers (cloud, network platforms) and is typically used for provisioning infrastructure rather than detailed device configuration.',
        'Puppet and Chef use agents on managed nodes, which pull their configuration from a master server on a schedule. They are declarative (Puppet) or procedural recipes (Chef).',
      ],
    },
    {
      type: 'analogy',
      title: 'Utos ng manager at plano ng arkitekto',
      body: [
        'Ansible is a supervisor who walks to each machine and applies a checklist of tasks. Terraform is an architect’s blueprint: you describe the building you want, and the tool works out what to build or change by comparing with what already exists.',
      ],
      taglish: [
        'Ang **Ansible** ay parang **supervisor** na pumupunta sa bawat makina at sumusunod sa **checklist ng gawain** (push). Ang **Terraform** ay parang **blueprint ng arkitekto**: inilalarawan mo ang gusali na gusto mo at siya ang **kumukuwenta kung ano ang itatayo o babaguhin** sa pamamagitan ng paghahambing sa kasalukuyang estado (state file).',
      ],
    },
    {
      type: 'hook',
      title: 'A-Y-S, T-H-S',
      trick: '**ANSIBLE = Agentless, YAML, SSH (push). TERRAFORM = Terraform, HCL, State file (declarative).**',
      taglish: [
        '**Ansible**: **A**gentless, **Y**AML playbooks, **S**SH/push. Mga salita: inventory, playbook, task, module.',
        '**Terraform**: **H**CL, **S**tate file, declarative, **provider**. Mga utos: init, plan, apply.',
        '**Puppet/Chef**: may **agent**, **pull** mula sa master.',
        '**Idempotent** sa lahat: ulitin, pareho ang resulta.',
      ],
      test: {
        question: 'Alin ang agentless at gumagamit ng YAML playbook, at alin ang gumagamit ng HCL at state file?',
        answer: 'Ansible = agentless + YAML playbook. Terraform = HCL + state file.',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Ang mga bahagi ng Ansible',
      paragraphs: [
        '**Control node**: ang computer kung saan tinatakbo ang Ansible. **Managed nodes**: ang mga device na kino-configure; walang kailangang i-install na agent. **Inventory**: listahan ng mga host (at grupo). **Playbook**: YAML file na may isa o higit pang **play**. Ang bawat play ay may mga **task**; ang bawat task ay tumatawag ng **module** (hal. `ios_config`, `ios_command`) para gawin ang aktwal na trabaho. **Variables** at **templates (Jinja2)** ay nagbibigay ng pagkakaiba kada device.',
        'Ang playbook ay binabasa tuwing patakbuhin: `ansible-playbook -i inventory site.yml`. Dahil idempotent ang mga module, ligtas ulitin ang playbook.',
        'Mga salitang madalas lumabas: **push model** (ang control node ang nagtutulak), **agentless** (SSH lang), **YAML**.',
      ],
      steps: [
        'Isulat ang inventory ng mga device.',
        'Isulat ang playbook (plays at tasks).',
        'Patakbuhin ang ansible-playbook mula sa control node.',
        'Ang Ansible ay kumokonekta sa SSH at tumatakbo ang mga module.',
        'Basahin ang resulta (ok, changed, failed).',
      ],
      tricks: [
        'Ang “changed” sa output ay nagpapakita na may ginawang pagbabago; ang “ok” ay walang pagbabago (idempotent).',
        'Ang Ansible ay pwedeng gumamit ng API kung sinusuportahan ng platform, hindi lang SSH.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Terraform workflow at paghahambing',
      paragraphs: [
        '**Terraform** workflow: **init** (i-download ang provider), **plan** (ipakita ang magiging pagbabago), **apply** (gawin ang pagbabago). Ang **state file** ang talaan ng tunay na kasalukuyang infrastructure; mahalaga ito sa pagkuwenta ng pagkakaiba. Ang configuration ay nasa **HCL** at **declarative**: sinasabi mo kung ano ang gusto, hindi kung paano.',
        'Paghahambing: Ansible = configuration management (software at settings sa umiiral na device), agentless, push, YAML. Terraform = provisioning (paggawa ng infrastructure), declarative, HCL, state file, kadalasan para sa cloud. Puppet/Chef = agent-based, pull. Maaaring gamitin ang Terraform para gumawa ng network sa cloud at Ansible para i-configure ang mga device dito.',
        'Pareho ay infrastructure as code: nasa version control, nare-review, nauulit.',
      ],
      steps: [
        'terraform init → download ng provider.',
        'terraform plan → preview ng pagbabago.',
        'terraform apply → gawin ang pagbabago at i-update ang state.',
        'terraform destroy → alisin ang mga resource (kung kailangan).',
      ],
      tricks: [
        'Kapag ang tanong ay “gumawa ng bagong cloud resources”, Terraform ang kandidato; kapag “i-configure ang mga umiiral na switch”, Ansible.',
        'Ang “state file” ay malakas na palatandaan ng Terraform.',
      ],
    },
    {
      type: 'remember',
      title: 'Ansible at Terraform na lumalabas sa exam',
      items: [
        '**Ansible: agentless, push, YAML playbooks, SSH; inventory, playbook, task, module.**',
        '**Terraform: declarative, HCL, state file, providers; init/plan/apply.**',
        '**Puppet/Chef: agent-based, pull model.**',
        '**Ansible = configuration management; Terraform = provisioning (infrastructure as code).**',
        '**Idempotent = ulitin nang ulitin, parehong resulta.**',
      ],
    },
    { type: 'diagram', id: 'iac-flow', caption: 'Code, plan, apply, verify: ang karaniwang daloy ng infrastructure as code.' },
    {
      type: 'terms',
      items: [
        { term: 'Ansible', definition: 'Agentless automation tool that applies YAML playbooks to managed devices over SSH or APIs.' },
        { term: 'Playbook', definition: 'A YAML file that lists plays and tasks to run on hosts.' },
        { term: 'Inventory', definition: 'The list of hosts and groups that Ansible manages.' },
        { term: 'Module', definition: 'A unit of work that a task calls, such as ios_config.' },
        { term: 'Terraform', definition: 'Declarative infrastructure as code tool that provisions resources from HCL files.' },
        { term: 'State file', definition: 'Terraform’s record of the real infrastructure, used to calculate changes.' },
        { term: 'Declarative', definition: 'Describing the desired end state rather than the steps to reach it.' },
      ],
    },
    {
      type: 'flow',
      title: 'Kung paano tumatakbo ang bawat tool',
      steps: [
        'Ansible: inventory + playbook → control node → SSH → modules sa device.',
        'Terraform: HCL → terraform plan → paghahambing sa state → terraform apply.',
        'Parehong ini-store ang code sa version control.',
        'I-verify ang resulta at ulitin kung kinakailangan (idempotent).',
      ],
    },
    {
      type: 'cli',
      title: 'Maikling playbook',
      transcript: `---
- name: Set NTP on switches
  hosts: switches
  gather_facts: no
  tasks:
    - name: Configure NTP server
      cisco.ios.ios_config:
        lines:
          - ntp server 10.0.0.9`,
      copyable: '---\n- name: Set NTP on switches\n  hosts: switches\n  gather_facts: no\n  tasks:\n    - name: Configure NTP server\n      cisco.ios.ios_config:\n        lines:\n          - ntp server 10.0.0.9',
      explain: [
        { line: 'hosts: switches', why: 'Selects the inventory group that the play runs against.' },
        { line: 'cisco.ios.ios_config', why: 'The module that sends configuration lines to a Cisco IOS device.' },
        { line: 'lines: - ntp server 10.0.0.9', why: 'The configuration to apply; running it again changes nothing once it is present (idempotent).' },
      ],
      note: 'The exam asks you to recognise playbooks, not write them from memory.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **Ansible ay agentless** — walang software na ini-install sa device. Ang Puppet at Chef ang may agent.' },
    { type: 'callout', kind: 'trap', text: 'Hindi “procedural lang” ang Ansible at hindi “configuration lang” ang Terraform; pero para sa exam, tandaan ang kanilang pangunahing papel at mga katangian.' },
    { type: 'callout', kind: 'tip', text: 'Maghanap ng mga keyword sa tanong: “YAML”, “playbook” → Ansible; “HCL”, “state file”, “provider” → Terraform; “agent”, “pull” → Puppet/Chef.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Saying Ansible needs an agent on each device.',
        'Mixing up YAML (Ansible) and HCL (Terraform).',
        'Forgetting that Terraform tracks a state file.',
        'Thinking declarative means listing every step.',
        'Applying a playbook to production without a test run.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Iba ang resulta ng ikalawang takbo',
      scenario: 'A script appends the same ACL line every time it runs, so the ACL grows with duplicates. The team wants a tool that is safe to run repeatedly.',
      evidence: `Run 1: ip access-list extended WEB -> 1 line
Run 2: ip access-list extended WEB -> 2 identical lines
Run 3: ip access-list extended WEB -> 3 identical lines`,
      question: 'Anong katangian ang kulang at paano ito aayusin?',
      answer: 'The script is not idempotent: each run changes the device even when the desired state exists.',
      fix: 'Use an idempotent, declarative tool or module (for example Ansible’s ios_config or ios_acls modules) that checks the current state and changes only what is different.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Aling tool ang pipiliin mo para (a) gumawa ng bagong virtual network sa cloud at subaybayan ang estado nito, (b) magtulak ng NTP configuration sa 100 umiiral na switch na walang agent?',
      answer: '(a) Terraform: declarative provisioning with a state file. (b) Ansible: agentless, push configuration over SSH using a playbook.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Ansible: agentless, push, YAML, playbook, inventory.',
        'Terraform: HCL, state file, declarative, init/plan/apply.',
        'Puppet and Chef use agents and pull.',
        'Both support infrastructure as code.',
        'Idempotence makes repeated runs safe.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Ansible configures devices agentlessly with YAML playbooks.',
        'Terraform provisions infrastructure declaratively using HCL and state.',
        'Puppet and Chef are agent-based and pull.',
        'Idempotence makes automation safe to repeat.',
        'Susunod: AI at ML sa network operations.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D6', objective: '6.6', difficulty: 'easy', type: 'single',
    prompt: 'Which configuration management tool is agentless and uses YAML playbooks?',
    choices: ['Puppet', 'Chef', 'Ansible', 'Terraform'], correct: [2],
    explanation: 'Ansible is agentless and uses YAML playbooks over SSH or APIs.',
    wrong: { 0: 'Puppet uses an agent.', 1: 'Chef uses an agent.', 3: 'Terraform uses HCL and is mainly a provisioning tool.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D6', objective: '6.6', difficulty: 'medium', type: 'single',
    prompt: 'What does Terraform use to track the real state of the infrastructure it manages?',
    choices: ['An inventory file', 'A state file', 'A playbook', 'A MIB'], correct: [1],
    explanation: 'Terraform stores the known state of resources in a state file and compares it with the configuration.',
    wrong: { 0: 'Inventories belong to Ansible.', 2: 'Playbooks belong to Ansible.', 3: 'MIBs are used by SNMP.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D6', objective: '6.6', difficulty: 'medium', type: 'single',
    prompt: 'Which statement describes Puppet and Chef compared with Ansible?',
    choices: ['They are agentless', 'They use agents that pull configuration from a master', 'They only configure cloud networks', 'They use HCL'], correct: [1],
    explanation: 'Puppet and Chef place agents on managed nodes, which pull their configuration from a master server.',
    wrong: { 0: 'Ansible is the agentless tool.', 2: 'They are not limited to the cloud.', 3: 'HCL is Terraform’s language.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D6', objective: '6.6', difficulty: 'medium', type: 'single',
    prompt: 'What does the terraform plan command do?',
    choices: ['Applies the changes immediately', 'Shows what changes would be made without applying them', 'Deletes all resources', 'Installs an agent'], correct: [1],
    explanation: 'plan previews the changes by comparing the configuration with the state.',
    wrong: { 0: 'apply performs the changes.', 2: 'destroy removes resources.', 3: 'Terraform does not use agents.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D6', objective: '6.6', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: an idempotent automation task produces the same result when it is run repeatedly.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'Idempotence means that repeated runs do not change the outcome once the desired state is reached.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D6', objective: '6.6', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO terms are associated with Ansible?',
    choices: ['Playbook', 'Inventory', 'State file', 'HCL'], correct: [0, 1],
    explanation: 'Playbooks and inventories are Ansible components. State files and HCL belong to Terraform.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Pro tip: Ansible vs Terraform?', back: 'ANSIBLE = Agentless, YAML, SSH (push). TERRAFORM = HCL, State file, declarative.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What is a playbook?', back: 'A YAML file listing plays and tasks that Ansible runs on hosts.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What is Terraform’s state file?', back: 'A record of the real infrastructure used to calculate changes.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Which tools use agents and pull?', back: 'Puppet and Chef.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Terraform workflow?', back: 'init, plan, apply (destroy to remove).' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What does idempotent mean?', back: 'Running it again does not change the result.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Ansible vs Terraform main role?', back: 'Ansible: configuration management. Terraform: provisioning infrastructure.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Read a playbook and a Terraform file',
  tool: 'Paper',
  minutes: 25,
  objective: 'Identify the parts of a playbook and a Terraform configuration and decide which tool fits each task.',
  steps: [
    'Write a short inventory with two groups (switches and routers) and two hosts each.',
    'Label the parts of the playbook shown in the lesson: play, hosts, tasks, module and parameters.',
    'Write a Terraform-style block for a network resource (name and address range) and label the provider, resource and arguments.',
    'List what terraform init, plan and apply each do.',
    'For five tasks decide Ansible, Terraform, or Puppet/Chef and justify each.',
    'Explain why running the playbook twice should not change anything the second time.',
  ],
  checklist: [
    'Playbook parts labelled',
    'Terraform workflow described',
    'Five tasks classified',
    'Idempotence explained',
  ],
  hints: [
    'Provisioning new infrastructure leans toward Terraform.',
    'Agent plus pull points to Puppet or Chef.',
  ],
  solution: [
    'Play = the - name block; hosts selects a group; tasks list modules such as ios_config.',
    'init downloads providers; plan previews changes; apply makes them and updates state.',
    'Second run: the module sees the line already exists and reports ok, not changed.',
  ],
  breakIt: 'Delete the state file in your sketch and explain what Terraform would think about the existing infrastructure.',
};
