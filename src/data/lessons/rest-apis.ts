import type { Flashcard, Lab, Lesson, Question } from '../../types';

const ID = 'rest-apis';

export const lesson: Lesson = {
  id: ID,
  moduleId: '6.4',
  domain: 'D6',
  title: 'REST APIs: Verbs, CRUD, Status Codes and Authentication',
  description: 'Understand REST characteristics, map HTTP verbs to CRUD, read URLs and status codes and know how API calls are authenticated.',
  whyMatters:
    'Ang REST ang pinakamadalas lumabas sa automation domain ng exam: aling verb ang gagamitin, ano ang ibig sabihin ng 404, at ano ang pagkakaiba ng PUT at PATCH. Sa lesson na ito, magiging pamilyar ka sa lahat ng iyon gamit ang tunay na halimbawa.',
  objectives: [
    'Describe the characteristics of REST APIs',
    'Map HTTP verbs to CRUD operations',
    'Read the parts of a URI',
    'Interpret HTTP status code families and common codes',
    'Describe common API authentication methods',
  ],
  estimatedMinutes: 40,
  difficulty: 'exam',
  keywords: ['REST', 'API', 'HTTP', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'CRUD', 'status code', 'URI', 'token', 'API key', 'basic authentication', 'stateless'],
  examObjectives: ['6.5'],
  sections: [
    {
      type: 'explain',
      simple: [
        'REST is a way of building APIs on top of HTTP. A client sends a request (a verb plus a URI) to a server and receives a response (a status code plus data, usually JSON).',
        'The server does not remember the client between requests (stateless), so every request must carry what is needed, including authentication.',
      ],
      taglish: [
        'Ang **REST** ay istilo ng pagbuo ng API sa ibabaw ng **HTTP**. Ang **client** ay nagpapadala ng **request (verb + URI)** at ang **server** ay sumasagot ng **status code + data** (karaniwang JSON).',
        'Ang REST ay **stateless**: hindi naaalala ng server ang client sa pagitan ng mga request, kaya **bawat request ay dapat dala ang lahat ng kailangan**, kasama ang authentication (token o key).',
        'Mga pangunahing katangian: **client-server, stateless, cacheable, uniform interface (URI at verbs), layered system**. Ang data ay madalas JSON, minsan XML.',
      ],
      technical: [
        'REST (Representational State Transfer) APIs expose resources identified by URIs and manipulate them with the standard HTTP methods. A URI has a scheme (https), a host, an optional port, a path to the resource and an optional query string: https://api.example.com:443/v1/devices?status=up.',
        'Methods map to CRUD: POST creates, GET reads, PUT replaces (or updates) a whole resource, PATCH updates part of a resource, DELETE removes. Responses carry a status code and often a JSON body. GET and DELETE are usually idempotent; POST is not.',
        'Authentication methods include basic authentication (username and password encoded in Base64 – use only over HTTPS), API keys, bearer tokens (such as OAuth 2.0) and token-based sessions obtained by an initial login call.',
      ],
    },
    {
      type: 'analogy',
      title: 'Order sa restaurant',
      body: [
        'Ordering at a restaurant: you ask the waiter (API) for a dish from the menu (URI). The waiter brings you the dish or tells you it is not available. The waiter does not remember your previous orders unless you repeat your table number each time (stateless, with a token).',
      ],
      taglish: [
        'Parang **umorder sa restaurant**: sinasabi mo sa **waiter (API)** ang ulam sa **menu (URI)**. Dadalhin niya ang ulam o sasabihin niyang **“wala po” (404)**. Hindi naaalala ng waiter ang naunang order mo maliban kung uulitin mo ang **numero ng mesa (token)** sa bawat order — iyan ang **stateless**.',
      ],
    },
    {
      type: 'hook',
      title: 'PGPD = CRUD',
      trick: '**POST = Create · GET = Read · PUT/PATCH = Update · DELETE = Delete. 2xx OK, 4xx mali mo, 5xx mali ng server.**',
      taglish: [
        '**C**reate = **POST**. **R**ead = **GET**. **U**pdate = **PUT** (buong palit) o **PATCH** (bahagi lang). **D**elete = **DELETE**.',
        '**2xx** = tagumpay (200 OK, 201 Created, 204 No Content).',
        '**4xx** = mali ng client (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found).',
        '**5xx** = mali ng server (500 Internal Server Error, 503 Service Unavailable).',
      ],
      test: {
        question: 'Anong verb at status code ang inaasahan mo kapag matagumpay na gumawa ng bagong device sa API?',
        answer: 'POST, at status code na 201 Created (o 200 OK sa ilang API).',
      },
    },
    {
      type: 'deepdive',
      title: 'Hakbang 1: Bahagi ng URI at ang bawat verb',
      paragraphs: [
        'Halimbawa: `https://api.example.com/v1/devices/R1?fields=name`. **https** = scheme, **api.example.com** = host, **/v1/devices/R1** = path ng resource, **?fields=name** = query parameter. Ang path ay kadalasang pangngalan (devices), hindi pandiwa.',
        '**GET /v1/devices** = listahan. **GET /v1/devices/R1** = isang device. **POST /v1/devices** (may JSON body) = gumawa ng bago. **PUT /v1/devices/R1** = palitan ang buong R1. **PATCH /v1/devices/R1** = baguhin ang isang field lang. **DELETE /v1/devices/R1** = burahin.',
        'Idempotent: GET, PUT at DELETE ay pwedeng ulitin nang pareho ang resulta. Ang **POST** ay hindi idempotent — ang pag-ulit ay gagawa ng pangalawang resource.',
      ],
      steps: [
        'Tukuyin ang resource (pangngalan) sa URI.',
        'Piliin ang verb batay sa kilos (CRUD).',
        'Ilagay ang JSON body kung gagawa o magbabago.',
        'Basahin ang status code sa sagot.',
      ],
      tricks: [
        'PUT = buong palit; PATCH = bahagyang pagbabago. Madalas itong itanong.',
        'Header na `Content-Type: application/json` ay nagsasabi ng format ng body; `Accept` ay nagsasabi ng gustong format ng sagot.',
      ],
    },
    {
      type: 'deepdive',
      title: 'Hakbang 2: Status codes at authentication',
      paragraphs: [
        'Mga pamilya: **1xx** informational, **2xx** success, **3xx** redirection, **4xx** client error, **5xx** server error. Mga karaniwan: **200 OK**, **201 Created**, **204 No Content** (tagumpay pero walang body, madalas sa DELETE), **400 Bad Request** (maling JSON/parameter), **401 Unauthorized** (walang valid na credentials), **403 Forbidden** (kilala ka pero bawal), **404 Not Found**, **500 Internal Server Error**, **503 Service Unavailable**.',
        '**Authentication**: **Basic** (username:password na naka-Base64, ligtas lang sa HTTPS), **API key** (susi sa header o query), **Bearer/OAuth token** (`Authorization: Bearer <token>`), at **token-based session** (mag-login muna at gamitin ang ibinalik na token). Laging **HTTPS** para hindi mabasa ang credentials.',
        'Sa Cisco platforms, madalas ang flow: POST ng credentials para kumuha ng token, tapos isinasama ang token sa header ng bawat susunod na request.',
      ],
      steps: [
        'POST /auth/token na may credentials.',
        'Tanggapin ang token (200 OK).',
        'Isama ang Authorization: Bearer <token> sa bawat request.',
        'Basahin ang status: 401 = token mali/expired; 403 = walang karapatan.',
      ],
      tricks: [
        '401 = “sino ka?” (authentication); 403 = “alam kita pero bawal” (authorization).',
        'Ang 404 ay maaaring mangahulugan ng maling URI, hindi lang kawalan ng resource.',
      ],
    },
    {
      type: 'remember',
      title: 'REST na lumalabas sa exam',
      items: [
        '**POST = Create, GET = Read, PUT/PATCH = Update, DELETE = Delete.**',
        '**PUT = buong palit; PATCH = bahagi lang.**',
        '**200 OK, 201 Created, 204 No Content; 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found; 500 Internal Server Error.**',
        '**REST = stateless; kailangan ng token/credentials sa bawat request; HTTPS.**',
        '**401 = hindi authenticated; 403 = authenticated pero bawal.**',
      ],
    },
    { type: 'diagram', id: 'rest-crud', caption: 'Verbs, CRUD at mga pamilya ng status code.' },
    {
      type: 'terms',
      items: [
        { term: 'REST', definition: 'Architectural style for APIs using HTTP methods on resources identified by URIs.' },
        { term: 'CRUD', definition: 'Create, Read, Update, Delete: the four basic data operations.' },
        { term: 'URI', definition: 'Identifier of a resource: scheme, host, path and optional query string.' },
        { term: 'Stateless', definition: 'The server keeps no client state between requests; each request is self-contained.' },
        { term: 'Status code', definition: 'Three-digit number in a response that tells the result of the request.' },
        { term: 'Bearer token', definition: 'A token sent in the Authorization header to prove identity or permission.' },
        { term: 'Idempotent', definition: 'Repeating the request leaves the resource in the same state.' },
      ],
    },
    {
      type: 'flow',
      title: 'Isang kumpletong API call',
      steps: [
        'Kumuha ng token mula sa auth endpoint.',
        'Buuin ang request: verb + URI + headers + (opsyonal) JSON body.',
        'Ipadala sa server sa pamamagitan ng HTTPS.',
        'Tanggapin ang status code at data.',
        'Iproseso ang JSON at humawak ng error (4xx/5xx).',
      ],
    },
    {
      type: 'cli',
      title: 'Halimbawa gamit ang curl',
      transcript: `$ curl -s -X GET https://controller.example.com/api/v1/devices \\
    -H "Authorization: Bearer eyJhbGciOi..." \\
    -H "Accept: application/json"
{"response":[{"hostname":"R1","reachable":true}]}
$ curl -s -o /dev/null -w "%{http_code}" -X DELETE https://controller.example.com/api/v1/devices/R9
404`,
      copyable: 'curl -s -X GET https://controller.example.com/api/v1/devices -H "Authorization: Bearer <token>" -H "Accept: application/json"',
      explain: [
        { line: '-X GET', why: 'Selects the HTTP verb; GET reads a collection of devices.' },
        { line: 'Authorization: Bearer …', why: 'Sends the token that proves who is calling; without it the server answers 401.' },
        { line: '404', why: 'The DELETE targeted a device that does not exist at that URI.' },
      ],
      note: 'This is a generic example. Real endpoints and token formats depend on the platform’s documentation.',
    },
    { type: 'callout', kind: 'trap', text: 'Ang **PUT** ay nagpapalit ng **buong** resource; ang **PATCH** ay bahagi lang. Kapag nag-PUT ka ng isang field lang, maaaring mawala ang iba.' },
    { type: 'callout', kind: 'trap', text: 'Ang **401** ay problema sa **pagkakakilanlan** (walang valid na credentials). Ang **403** ay problema sa **pahintulot**. Huwag palitan sa exam.' },
    { type: 'callout', kind: 'tip', text: 'Kabisaduhin ang pamilya: 2xx okay, 4xx ikaw ang mali, 5xx ang server ang mali. Kahit hindi mo alam ang eksaktong numero, madalas masasagot mo na.' },
    {
      type: 'list',
      variant: 'mistakes',
      title: 'Karaniwang pagkakamali',
      items: [
        'Using GET to create something that should be POST.',
        'Mixing up 401 and 403.',
        'Sending credentials over plain HTTP.',
        'Forgetting the Content-Type header with a JSON body.',
        'Assuming POST is idempotent.',
      ],
    },
    {
      type: 'troubleshoot',
      title: 'Troubleshooting: 401 sa API',
      scenario: 'A script that worked yesterday now receives an error from the controller API on every call.',
      evidence: `HTTP/1.1 401 Unauthorized
{"error":"token expired"}`,
      question: 'Ano ang ibig sabihin at paano ito aayusin?',
      answer: '401 means the request was not properly authenticated. The bearer token has expired.',
      fix: 'Request a new token from the authentication endpoint and include it in the Authorization header. Add token refresh to the script so it does not fail when tokens expire.',
    },
    {
      type: 'challenge',
      title: 'Mini challenge',
      prompt: 'Ipares: (a) gumawa ng bagong VLAN, (b) basahin ang listahan ng VLAN, (c) palitan lang ang pangalan ng VLAN 10, (d) burahin ang VLAN 20. Anong verb ang bawat isa?',
      answer: '(a) POST, (b) GET, (c) PATCH (or PUT if replacing the whole VLAN object), (d) DELETE.',
    },
    {
      type: 'list',
      variant: 'tips',
      title: 'Exam tips',
      items: [
        'POST create, GET read, PUT/PATCH update, DELETE delete.',
        'PUT replaces; PATCH modifies part.',
        '401 vs 403: authentication vs authorization.',
        'REST is stateless and uses HTTP(S).',
        'The response body is usually JSON.',
      ],
    },
    {
      type: 'summary',
      points: [
        'REST uses HTTP verbs on URI resources.',
        'Verbs map to CRUD.',
        'Status code families: 2xx, 4xx, 5xx.',
        'Requests are stateless and carry credentials.',
        'Always use HTTPS.',
        'Susunod: JSON at XML.',
      ],
    },
  ],
};

export const questions: Question[] = [
  {
    id: `${ID}-q1`, lessonIds: [ID], domain: 'D6', objective: '6.5', difficulty: 'easy', type: 'single',
    prompt: 'Which HTTP method is used to create a new resource through a REST API?',
    choices: ['GET', 'POST', 'DELETE', 'HEAD'], correct: [1],
    explanation: 'POST creates a new resource.',
    wrong: { 0: 'GET reads.', 2: 'DELETE removes.', 3: 'HEAD retrieves headers only.' },
  },
  {
    id: `${ID}-q2`, lessonIds: [ID], domain: 'D6', objective: '6.5', difficulty: 'medium', type: 'single',
    prompt: 'A REST client receives HTTP 404. What does this mean?',
    choices: ['The request was successful', 'The server could not find the requested resource', 'The credentials are invalid', 'The server crashed'], correct: [1],
    explanation: '404 Not Found means the resource at that URI does not exist (or the URI is wrong).',
    wrong: { 0: 'Success codes begin with 2.', 2: 'That is typically 401.', 3: 'Server errors begin with 5.' },
  },
  {
    id: `${ID}-q3`, lessonIds: [ID], domain: 'D6', objective: '6.5', difficulty: 'medium', type: 'single',
    prompt: 'Which status code family indicates that the client made an error?',
    choices: ['2xx', '3xx', '4xx', '5xx'], correct: [2],
    explanation: '4xx codes indicate client errors.',
    wrong: { 0: '2xx is success.', 1: '3xx is redirection.', 3: '5xx is server error.' },
  },
  {
    id: `${ID}-q4`, lessonIds: [ID], domain: 'D6', objective: '6.5', difficulty: 'hard', type: 'single',
    prompt: 'What is the difference between PUT and PATCH?',
    choices: ['PUT deletes; PATCH creates', 'PUT replaces the whole resource; PATCH modifies part of it', 'They are identical', 'PUT reads; PATCH writes'], correct: [1],
    explanation: 'PUT replaces the entire resource representation, while PATCH applies a partial change.',
    wrong: { 0: 'Delete is DELETE; create is POST.', 2: 'They differ in how much of the resource they change.', 3: 'GET reads.' },
  },
  {
    id: `${ID}-q5`, lessonIds: [ID], domain: 'D6', objective: '6.5', difficulty: 'easy', type: 'true-false',
    prompt: 'True or false: REST APIs are stateless, so each request must carry the information needed to authenticate it.',
    choices: ['True', 'False'], correct: [0],
    explanation: 'The server stores no client state between requests, so credentials or tokens accompany each request.',
  },
  {
    id: `${ID}-q6`, lessonIds: [ID], domain: 'D6', objective: '6.5', difficulty: 'medium', type: 'multiple',
    prompt: 'Which TWO status codes indicate success?',
    choices: ['200 OK', '201 Created', '401 Unauthorized', '503 Service Unavailable'], correct: [0, 1],
    explanation: '200 and 201 are 2xx success codes. 401 is a client error and 503 is a server error.',
  },
];

export const flashcards: Flashcard[] = [
  { id: `${ID}-hook`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Pro tip: verb at CRUD?', back: 'POST = Create · GET = Read · PUT/PATCH = Update · DELETE = Delete. 2xx OK, 4xx mali mo, 5xx mali ng server.' },
  { id: `${ID}-f1`, lessonId: ID, domain: 'D6', category: 'concept', front: 'What does stateless mean in REST?', back: 'The server keeps no client state; each request is self-contained.' },
  { id: `${ID}-f2`, lessonId: ID, domain: 'D6', category: 'concept', front: 'PUT vs PATCH?', back: 'PUT replaces the entire resource; PATCH changes part of it.' },
  { id: `${ID}-f3`, lessonId: ID, domain: 'D6', category: 'concept', front: '401 vs 403?', back: '401: not authenticated. 403: authenticated but not permitted.' },
  { id: `${ID}-f4`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Common success codes?', back: '200 OK, 201 Created, 204 No Content.' },
  { id: `${ID}-f5`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Parts of a URI?', back: 'Scheme, host, optional port, path, optional query string.' },
  { id: `${ID}-f6`, lessonId: ID, domain: 'D6', category: 'concept', front: 'Ways to authenticate an API call?', back: 'Basic auth, API key, bearer/OAuth token (always over HTTPS).' },
];

export const lab: Lab = {
  id: `${ID}-lab`,
  lessonId: ID,
  title: 'Call a public REST API from the command line',
  tool: 'Your computer',
  minutes: 30,
  objective: 'Practise GET requests and read status codes using curl against a public test API, and map verbs to CRUD.',
  steps: [
    'Open a terminal and run curl -i https://httpbin.org/get. Read the status line and the JSON body.',
    'Run curl -i https://httpbin.org/status/404 and then /status/401 and /status/500. Note each code and its family.',
    'Run curl -i -X POST https://httpbin.org/post -H "Content-Type: application/json" -d "{\\"name\\":\\"R1\\"}". Find your JSON in the response.',
    'Run the same request with -X PUT, -X PATCH and -X DELETE on the matching /put, /patch and /delete endpoints.',
    'Write a table mapping each verb to its CRUD action.',
    'Write down which of your requests would be idempotent.',
  ],
  checklist: [
    'Status codes read correctly',
    'JSON echoed back in the POST',
    'Verb to CRUD table completed',
    'Idempotent requests identified',
  ],
  hints: [
    'curl -i shows headers including the status line.',
    'On Windows PowerShell use curl.exe to avoid the alias.',
  ],
  solution: [
    '404 and 401 are 4xx client errors; 500 is a 5xx server error.',
    'POST create, GET read, PUT/PATCH update, DELETE delete.',
    'GET, PUT and DELETE are idempotent; POST is not.',
  ],
  breakIt: 'Send the POST without the Content-Type header and describe how the server’s view of your data changes.',
};
