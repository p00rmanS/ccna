import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'security-programs';

export const lesson: Lesson = {
  id: ID,
  moduleId: '5.13',
  domain: 'D5',
  title: 'Security Programs and Password Policy: Awareness, MFA and Access Control',
  description: 'Describe security awareness, training and education, physical access control, password policy elements and multifactor authentication.',
  whyMatters:
    'Ang seguridad ay hindi lang firewall at ACL. Sa exam, may mga tanong tungkol sa user awareness, training, physical access control, password policy at MFA. Madaling puntos ang mga ito kapag alam mo ang tamang kategorya ng bawat isa.',
  objectives: [
    'Distinguish user awareness, training and education',
    'Describe physical access control',
    'List password policy elements',
    'Explain multifactor authentication, certificates and biometrics',
    'Choose the right control for a scenario',
  ],
  estimatedMinutes: 30,
  difficulty: 'beginner',
  keywords: ['security awareness', 'training', 'education', 'physical access control', 'password policy', 'MFA', 'multifactor authentication', 'biometrics', 'certificate', 'password complexity', 'password manager', 'least privilege'],
  examObjectives: ['5.2', '5.4'],
  sections: [
    {
      type: 'explain',
      simple: [
        'A security program combines people, policy and technology. Awareness, training and education build good habits. Physical access control keeps unauthorised people away from equipment. A password policy and multifactor authentication protect accounts.',
        'Most successful attacks involve people, so these non-technical controls matter as much as firewalls.',
      ],
      taglish: [
        'Ang **security program** ay kombinasyon ng **tao, polisiya at teknolohiya**. Ang **awareness, training at education** ay bumubuo ng mabuting gawi. Ang **physical access control** ay pumipigil sa walang pahintulot na makalapit sa kagamitan. Ang **password policy at MFA** ay nagpoprotekta sa account.',
        'Halos lahat ng matagumpay na atake ay may kasamang **tao** (phishing, mahinang password), kaya kasinghalaga ng firewall ang mga **non-technical** na kontrol na ito.',
        'Tatlong antas ng pag-aaral: **Awareness** = pangkalahatang kamalayan (poster, email). **Training** = tiyak na kasanayan (paano mag-report ng phishing). **Education** = malalim na kaalaman (degree, sertipikasyon).',
      ],
      technical: [
        'Security awareness informs all users about threats and expected behaviour; training teaches specific skills for a role; education builds deeper knowledge for security professionals. Programs are measured through exercises such as simulated phishing.',
        'Physical access control includes locks, badge readers, mantraps, security guards, cameras (CCTV), biometric locks and locked network closets. Access should follow least privilege and be logged.',
        'Password policy elements: minimum length, complexity (mix of character types), rotation/expiry, history, lockout after failed attempts, and prohibition of reuse and of common or breached passwords. Modern guidance favours long passphrases and password managers. MFA requires two or more factors: something you know (password, PIN), something you have (token, phone, smart card, certificate), something you are (biometric).',
      ],
    },
    {
      type: 'analogy',
      title: 'Bahay na may tatlong kandado',
      body: [
        'A house is safer with a gate (physical access control), a lock (password) and a guard who recognises you (MFA). Teaching the family not to open the door to strangers (awareness) matters as much as the locks.',
      ],
      taglish: [
        'Mas ligtas ang bahay kung may **gate (physical access control)**, **kandado (password)** at **guwardiya na kilala ka (MFA)**. At kasinghalaga ng kandado ang **pagtuturo sa pamilya na huwag magbukas ng pinto sa estranghero (awareness)**.',
      ],
    },
    {
      type: 'hook',
      title: 'ATE at KHA',
      trick: '**ATE = Awareness, Training, Education (tao). KHA = Know, Have, Are (MFA): alam mo, hawak mo, ikaw mismo.**',
      taglish: [
        '**A**wareness → **T**raining → **E**ducation: pangkalahatan → tiyak → malalim.',
        '**MFA = hindi bababa sa dalawang magkaibang uri ng factor**: **K**now (password/PIN), **H**ave (token/phone/smart card/certificate), **A**re (fingerprint, mukha).',
        '**Dalawang password ay HINDI MFA** dahil parehong “know”.',
        'Password policy: **haba, complexity, expiry, history, lockout**.',
      ],
      test: {
        question: 'Password at fingerprint: MFA ba? Password at PIN?',
        answer: 'Password + fingerprint = MFA (know + are). Password + PIN = hindi MFA (parehong know).',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Awareness, training, education at physical security',
      paragraphs: [
        '**Awareness**: pangkalahatang mensahe sa lahat — halimbawa, poster at email tungkol sa phishing. **Training**: tiyak na gawain — halimbawa, hands-on na pag-reklamo ng phishing o tamang paghawak ng data. **Education**: pormal at malalim — kurso, degree o sertipikasyon para sa security staff.',
        '**Physical access control**: locks at badge reader sa pinto, **mantrap** (dalawang pinto na isa lang ang bukas), guwardiya, CCTV at logs. Para sa network: naka-lock ang wiring closet at server room, may log ng pumapasok, at naka-disable ang mga hindi ginagamit na port.',
        'Prinsipyo: **least privilege** — ibigay lang ang access na kailangan para sa trabaho — at **defense in depth** — maraming patong ng proteksyon.',
      ],
      steps: [
        'Tukuyin ang mga banta at madla (lahat ng staff o IT lang).',
        'Awareness: regular na paalala at simulated phishing.',
        'Training: tiyak na kasanayan para sa tungkulin.',
        'Physical: ikandado at i-log ang access sa kagamitan.',
        'Suriin at i-update ang program.',
      ],
      tricks: [
        'Pagkakaiba ng tatlo: lawak (awareness) → kasanayan (training) → lalim (education).',
        'Ang “mantrap” ay physical control, hindi network control.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Password policy at MFA',
      paragraphs: [
        'Mga elemento ng password policy: **minimum na haba**, **complexity** (halo ng uri ng karakter), **expiry/rotation**, **history** (bawal gamitin muli ang lumang password), **lockout** pagkatapos ng ilang maling subok, at pagbabawal sa karaniwan o na-leak na password. Mas inirerekomenda ngayon ang mahabang **passphrase** at **password manager** kaysa sa madalas na sapilitang pagpapalit.',
        '**MFA** ay nangangailangan ng dalawa o higit pang **magkaibang factor**: something you **know**, something you **have**, something you **are**. Halimbawa: password + authenticator app code, o smart card + PIN + fingerprint. Ang **certificate** (digital) ay “something you have”. Ang **biometrics** ay “something you are” — maaaring magkamali (false accept/reject) kaya kadalasang pinagsasama sa ibang factor.',
        'Sa Cisco device: `enable secret` (hash) at `login local` na may username/password, o AAA para sa mas sentralisadong kontrol; may `security passwords min-length 10` para sa minimum na haba.',
      ],
      steps: [
        'Magtakda ng minimum na haba at complexity.',
        'I-enable ang lockout at history.',
        'Hikayatin ang password manager at passphrase.',
        'Idagdag ang MFA para sa admin at remote access.',
        'Regular na suriin ang mga account at karapatan.',
      ],
      tricks: [
        'Sa exam, alamin kung aling factor ang bawat isa: PIN = know, token = have, fingerprint = are.',
        'Ang `security passwords min-length` ay tunay na IOS command para sa minimum na haba.',
      ],
    },
    {
      type: 'remember',
      title: 'Security program na lumalabas sa exam',
      items: [
        '**Awareness = pangkalahatan; training = tiyak na kasanayan; education = malalim na kaalaman.**',
        '**Physical access: locks, badge, mantrap, guwardiya, CCTV, naka-lock na wiring closet.**',
        '**Password policy: haba, complexity, expiry, history, lockout.**',
        '**MFA = dalawa o higit pang magkaibang factor: know, have, are.**',
        '**Least privilege at defense in depth.**',
      ],
    },
    { type: 'diagram', id: 'security-chain', caption: 'Mga patong ng seguridad: tao, polisiya at teknolohiya.' },
    {
      type: 'terms',
      items: [
        { term: 'Security awareness', definition: 'General communication that makes all users alert to threats.' },
        { term: 'Training', definition: 'Teaching specific skills needed to perform security tasks.' },
        { term: 'Education', definition: 'In-depth knowledge, usually for security professionals.' },
        { term: 'Physical access control', definition: 'Locks, badges, guards and cameras that restrict physical entry.' },
        { term: 'Password policy', definition: 'Rules for password length, complexity, expiry, history and lockout.' },
        { term: 'MFA', definition: 'Authentication using two or more different factor types.' },
        { term: 'Biometrics', definition: 'Authentication using physical characteristics such as fingerprints or faces.' },
      ],
    },
    {
      type: 'flow',
      title: 'Pagbuo ng security program',
      steps: [
        'Tukuyin ang mga asset at banta.',
        'Magsulat ng polisiya (password, access, paggamit).',
        'Magsagawa ng awareness at training.',
        'Maglapat ng physical at technical na kontrol.',
        'Subukan, sukatin at pagbutihin.',
      ],
    },
    {
      type: 'cli',
      title: 'Pagpapatupad ng password policy sa IOS',
      transcript: `R1(config)# security passwords min-length 10
R1(config)# enable secret S7r0ng!Pass1
R1(config)# username admin secret An0ther!Pass2
R1(config)# line vty 0 4
R1(config-line)# login local
R1(config-line)# exec-timeout 5 0`,
      copyable: 'security passwords min-length 10\nenable secret <password>\nusername admin secret <password>\nline vty 0 4\nlogin local\nexec-timeout 5 0',
      explain: [
        { line: 'security passwords min-length 10', why: 'Rejects passwords shorter than 10 characters when they are configured.' },
        { line: 'username admin secret …', why: 'Stores the local account with a hashed secret rather than a reversible password.' },
        { line: 'exec-timeout 5 0', why: 'Logs out idle sessions after 5 minutes, reducing the exposure of unattended terminals.' },
      ],
      note: 'Use your own strong passwords; the examples above are placeholders.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **dalawang password** ay hindi MFA. Kailangan ang **magkaibang uri** ng factor (know + have, o know + are).' },
    { type: 'callout', kind: 'trap', text: 'Hindi pareho ang awareness at training: ang una ay **pangkalahatan**, ang ikalawa ay **tiyak na kasanayan**.' },
    { type: 'callout', kind: 'tip', text: 'Kapag may scenario na “empleyadong binuksan ang phishing email”, ang tamang long-term na kontrol ay **awareness/training**, hindi bagong firewall.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Calling two knowledge factors multifactor authentication.',
        'Relying only on technical controls and ignoring user training.',
        'Leaving wiring closets unlocked.',
        'Using short, reusable passwords.',
        'Granting more access than a role needs.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: Paulit-ulit na phishing',
      scenario: 'Several employees clicked a phishing link this quarter even though the email filter is up to date.',
      evidence: `Phishing simulation results: 38% clicked
Incident log: 3 accounts compromised, no MFA on email`,
      question: 'Anong dalawang kontrol ang dapat idagdag?',
      answer: 'Security awareness and training for users (including simulated phishing), and multifactor authentication so that a stolen password alone is not enough.',
      fix: 'Run regular awareness and phishing training, enable MFA on email and remote access, and review account privileges using least privilege.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ikategorya ang bawat isa bilang know, have o are: PIN, smart card, fingerprint, authenticator app code, security question answer.',
      answer: 'PIN = know. Smart card = have. Fingerprint = are. Authenticator app code = have (the phone). Security question answer = know.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'Awareness is general; training is specific; education is deep.',
        'MFA needs different factor types.',
        'Mantraps and badge readers are physical controls.',
        'Know the password policy elements.',
        'Least privilege limits damage.',
      ],
    },
    {
      type: 'summary',
      points: [
        'Security programs combine awareness, training and education.',
        'Physical access control protects equipment.',
        'Password policy: length, complexity, expiry, history, lockout.',
        'MFA uses different factors: know, have, are.',
        'People are a key part of security.',
        'Susunod: ACL placement at virtualization.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D5', objective: '5.2', difficulty: 'easy', type: 'single',
    prompt: 'Which element of a security program informs all users about threats in a general way?',
    choices: ['User awareness', 'Education for specialists', 'Penetration testing', 'Network segmentation'], correct: [0],
    explanation: 'Awareness is the general communication that keeps all users alert to threats.',
    wrong: { 1: 'Education is deeper and aimed at professionals.', 2: 'Penetration testing is a technical assessment.', 3: 'Segmentation is a technical control.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D5', objective: '5.4', difficulty: 'medium', type: 'single',
    prompt: 'Which pair provides multifactor authentication?',
    choices: ['Password and PIN', 'Password and fingerprint', 'Two different passwords', 'Username and password'], correct: [1],
    explanation: 'A password (know) combined with a fingerprint (are) uses two different factor types.',
    wrong: { 0: 'Both are things you know.', 2: 'Both are things you know.', 3: 'A username is an identifier, and the password is a single factor.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D5', objective: '5.2', difficulty: 'medium', type: 'single',
    prompt: 'Which is an example of physical access control?',
    choices: ['A mantrap at a data centre entrance', 'A VLAN', 'An ACL', 'WPA3'], correct: [0],
    explanation: 'A mantrap is a physical access control that restricts entry.',
    wrong: { 1: 'VLANs are logical segmentation.', 2: 'ACLs are technical network controls.', 3: 'WPA3 is a wireless security protocol.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D5', objective: '5.4', difficulty: 'medium', type: 'single',
    prompt: 'Which element of a password policy blocks reuse of earlier passwords?',
    choices: ['Complexity', 'Password history', 'Lockout', 'Minimum length'], correct: [1],
    explanation: 'Password history remembers previous passwords and prevents their reuse.',
    wrong: { 0: 'Complexity controls the character types.', 2: 'Lockout limits failed attempts.', 3: 'Minimum length sets the number of characters.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D5', objective: '5.4', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: a smart card is an example of “something you have”.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'A smart card is a possession factor.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D5', objective: '5.4', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO are elements of a password policy?',
    choices: ['Minimum length', 'Account lockout after failed attempts', 'Duplex setting', 'Native VLAN'], correct: [0, 1],
    explanation: 'Length and lockout are password policy elements. Duplex and native VLAN are network settings.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Pro tip: ATE at KHA?', back: 'ATE = Awareness, Training, Education (tao). KHA = Know, Have, Are (MFA).' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Awareness vs training vs education?', back: 'General alertness; specific skills; deep knowledge.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What are the MFA factor types?', back: 'Something you know, have and are.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Examples of physical access control?', back: 'Locks, badge readers, mantraps, guards, cameras, locked closets.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D5', category: 'concept', front: 'Password policy elements?', back: 'Length, complexity, expiry, history, lockout.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D5', category: 'command', front: 'Which IOS command sets a minimum password length?', back: 'security passwords min-length <n>.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D5', category: 'concept', front: 'What is least privilege?', back: 'Give only the access needed for the role.' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Draft a mini security program',
  tool: 'Paper',
  minutes: 25,
  objective: 'Write a short security program for a small office covering awareness, physical access, password policy and MFA.',
  steps: [
    'List the assets of a small office (router, switch, file server, staff laptops).',
    'Write one awareness message, one training topic and one education path.',
    'List five physical controls for the network closet and rank them by cost.',
    'Write a password policy with length, complexity, history and lockout values.',
    'Decide which accounts need MFA and which factors to use.',
    'Write the IOS lines that enforce the minimum password length and idle timeout.',
  ],
  checklist: [
    'Awareness, training and education distinguished',
    'Physical controls listed',
    'Password policy values written',
    'MFA factors chosen',
    'IOS commands written',
  ],
  hints: [
    'Admin and remote-access accounts need MFA first.',
    'Pair a policy with a technical enforcement where possible.',
  ],
  solution: [
    'Awareness: poster and phishing email. Training: how to report phishing. Education: a networking security certification.',
    'Policy example: 12+ characters, history of 5, lockout after 5 attempts, MFA on admin and remote access.',
    'IOS: security passwords min-length 12 and exec-timeout 5 0 on VTY.',
  ],
  breakIt: 'Remove MFA from the admin account in your plan and describe how a phished password leads to compromise.',
};
