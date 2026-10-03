/**
 * Chapter 3 English Curriculum Data:
 * Web Applications (تطبيقات الويب)
 * Lessons 3-1, 3-2, 3-3
 */

module.exports = {
  // ==========================================
  // Lesson 3-1: Web Architecture & The 3-Tier Model
  // ==========================================
  'ch3-l1-c1': {
    title: "Client-Server Architecture & The 3-Tier Model",
    lessonTitle: "Web Architecture & The 3-Tier Model",
    summary: "The fundamental web structure: Client-Server model, and the 3 distinct tiers: Presentation (Browser), Application Logic (Server), and Data Tier (Database).",
    narration: "Welcome to Chapter 3 on Web Applications! Modern web platforms rely on the Client-Server model, organized through a 3-Tier Architecture: Tier 1 is the Presentation Tier, running in the user's web browser using HTML, CSS, and JavaScript. Tier 2 is the Application/Logic Tier, running on backend servers using Python, Node.js, or PHP to process business rules. Tier 3 is the Data Tier, using relational or NoSQL database management systems for secure, persistent storage.",
    simplifiedExplanation: "Think of a restaurant: The Presentation tier is the dining table and menu you see. The Application tier is the kitchen chef who cooks the food and checks the recipe. And the Data tier is the pantry refrigerator storing all the raw ingredients!",
    aiPrompt: "Can you name the three tiers in modern web application architecture and their roles?",
    contentCards: [
      {
        type: "concept",
        title: "The 3 Architectural Tiers Explained (Ministry Textbook p. 60):",
        points: [
          "💻 1. Presentation Tier (Frontend): The web browser UI rendered using HTML, CSS, and interactive JavaScript.",
          "⚙️ 2. Application Logic Tier (Backend): The web/app server (Node.js, Python, PHP) executing business algorithms.",
          "🗄️ 3. Data Tier (Database): Persistent storage engines (SQL, MongoDB) securing records, passwords, and catalogs."
        ]
      }
    ],
    keyTerms: [
      {
        term: "3-Tier Architecture",
        en: "3-Tier Architecture",
        definition: "A software architecture that modularizes an enterprise web application into three logical and physical computing tiers: presentation, application processing, and data management.",
        example: "Browser (React/HTML) ← Web Server (Node.js/Express) ← Database (PostgreSQL).",
        examTip: "Exam question: The 3 tiers are Presentation Tier, Application/Logic Tier, and Data Tier."
      },
      {
        term: "Client-Server Model",
        en: "Client-Server Model",
        definition: "A distributed application structure that partitions tasks between service providers (servers) and service requesters (clients).",
        example: "Your web browser sending an HTTP request for a page, and the remote web server returning the HTML response.",
        examTip: "The foundational communication topology of the World Wide Web."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which web tier is responsible for securely storing and querying persistent user data and product catalogs?",
        options: ["Presentation Tier", "Application Logic Tier", "Data Tier (Database)", "Keyboard"],
        correctIndex: 2,
        explanation: "The Data Tier houses database management systems responsible for persistent data storage and retrieval."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "The tier that executes directly inside the end-user's web browser and displays graphical UI elements is the:",
        options: ["Presentation Tier", "Data Tier", "Physical Hard Drive", "Fiber Optic Cable"],
        correctIndex: 0,
        explanation: "The Presentation Tier is the front-end graphical interface rendered by the client browser."
      },
      {
        id: "q2",
        level: "true_false",
        question: "The 3-tier architecture isolates the database tier from direct public browser access to enhance security and maintainability.",
        isTrue: true,
        explanation: "True; Isolating the database behind the logic tier prevents clients from executing unauthorized direct database operations."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "In the client-server model, the client browser is responsible for housing the entire centralized database of the website.",
        isTrue: false,
        explanation: "False; Centralized databases reside on remote servers in the data tier."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Separating a web app into presentation, logic, and database tiers is the 3-_____ Architecture.",
        missingWord: "Tier",
        hint: "3-Tier",
        options: ["Tier", "Bit", "Byte", "Pixel"],
        explanation: "The 3-Tier Architecture divides web software into three distinct operational layers."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The computing paradigm where clients request resources from central providers is the Client-_____ Model.",
        missingWord: "Server",
        hint: "Server",
        options: ["Server", "Printer", "Router", "Switch"],
        explanation: "The Client-Server model orchestrates web requests and responses."
      }
    ]
  },

  'ch3-l1-c2': {
    title: "3-Tier Collaboration Flow: Static vs Dynamic Websites",
    lessonTitle: "Web Architecture & The 3-Tier Model",
    summary: "How requests traverse the three tiers, and comparing pre-built static websites (HTML/CSS) with database-driven dynamic websites.",
    narration: "Web content is either Static or Dynamic: A Static website consists of pre-built HTML, CSS, and image files stored on a server; every visitor receives the exact same identical page. A Dynamic website, however, generates personalized content on the fly: when a user submits an action, the Presentation tier dispatches a request to the Logic tier, which queries the Data tier, constructs an individualized HTML response, and sends it back to the client.",
    simplifiedExplanation: "A Static site is like a printed newspaper: everyone sees the exact same page. A Dynamic site is like your personal social media feed or online shopping cart: it builds a unique custom page tailored specifically to your account!",
    aiPrompt: "Can you distinguish between a static website and a dynamic database-driven website?",
    contentCards: [
      {
        type: "concept",
        title: "Static vs Dynamic Websites (Ministry Textbook p. 64):",
        points: [
          "📄 Static Websites: Pre-built HTML/CSS files served identically to every visitor. Fast, simple, but non-interactive.",
          "⚡ Dynamic Websites: Backend server generates customized HTML in real time by querying databases (e.g. Amazon, Facebook).",
          "🔄 Request Flow: Browser (Tier 1) → Logic Server (Tier 2) → Database query (Tier 3) → Dynamic response."
        ]
      }
    ],
    keyTerms: [
      {
        term: "Dynamic Website",
        en: "Dynamic Website",
        definition: "A website that generates web pages in real-time by executing server-side logic and pulling individualized data from databases.",
        example: "An online store displaying your personalized shopping cart and real-time inventory counts.",
        examTip: "Pages are generated on-the-fly depending on user input and database states."
      },
      {
        term: "Static Website",
        en: "Static Website",
        definition: "A website with fixed content where every page is coded in HTML and displays the exact same information to every visitor.",
        example: "A simple restaurant informational page displaying their address and static food menu.",
        examTip: "Requires no server-side database querying to assemble the page."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which type of website generates custom, personalized web pages in real time based on user interactions and database queries?",
        options: ["Dynamic Website", "Static Website", "Paper Brochure", "Microfilm Archive"],
        correctIndex: 0,
        explanation: "Dynamic websites assemble personalized pages on-the-fly by querying databases."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "A personal portfolio site that displays the exact same unchanging HTML text to every visitor without a database is a:",
        options: ["Static Website", "Dynamic Web Application", "Streaming Server", "Distributed Cluster"],
        correctIndex: 0,
        explanation: "Static websites serve pre-existing, unchanging HTML/CSS files directly to visitors."
      },
      {
        id: "q2",
        level: "true_false",
        question: "In a dynamic web application, the presentation tier communicates directly with the database without going through the logic tier.",
        isTrue: false,
        explanation: "False; Requests must pass through the application logic tier to enforce validation, authentication, and security."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Dynamic websites allow users to interact, log in, submit forms, and view personalized account records.",
        isTrue: true,
        explanation: "True; Real-time server-side processing enables customized user state and interactive functionality."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "A website that generates custom pages on-the-fly by querying databases is a _____ Website.",
        missingWord: "Dynamic",
        hint: "Dynamic / Interactive",
        options: ["Dynamic", "Static", "Dormant", "Binary"],
        explanation: "Dynamic websites assemble content in real time based on backend logic."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Pre-rendered web pages that display identical content to all visitors are _____ Pages.",
        missingWord: "Static",
        hint: "Static / Fixed",
        options: ["Static", "Dynamic", "Fluid", "Reactive"],
        explanation: "Static pages serve fixed HTML files without dynamic server-side modification."
      }
    ]
  },

  'ch3-l1-exam': {
    title: "🏆 Final Challenge: Lesson (3-1) Mastery Exam",
    lessonTitle: "Web Architecture & The 3-Tier Model",
    summary: "Comprehensive exam on client-server architecture, the 3-tier model, and static vs dynamic web systems.",
    narration: "Welcome to the Lesson 3-1 Mastery Exam! Demonstrate your thorough command of multi-tier web architecture and server-side processing to earn your gold trophy!",
    examQuestions: [
      {
        question: "Which tier in the 3-Tier Architecture executes within the user's browser using HTML, CSS, and JavaScript?",
        options: ["Presentation Tier (Frontend)", "Data Tier", "Logic Tier", "Physical Cable Tier"],
        correctIndex: 0,
        explanation: "The Presentation Tier handles user interface rendering and client-side interactions in the browser."
      },
      {
        question: "What is the primary role of the Application/Logic Tier?",
        options: [
          "Executing business logic, calculations, and coordinating data between the presentation and data tiers",
          "Cooling down computer hardware fans",
          "Physically printing web pages on paper",
          "Formatting computer hard drives"
        ],
        correctIndex: 0,
        explanation: "The logic tier processes user input, implements application rules, and mediates database transactions."
      },
      {
        question: "Why do modern web architects isolate the Data Tier behind the Application Tier?",
        options: [
          "To prevent direct, unauthorized browser access to sensitive database records and credentials",
          "To make web pages load only in black and white",
          "To ban search engines from indexing the site",
          "To disable all CSS styling"
        ],
        correctIndex: 0,
        explanation: "Isolating databases ensures client browsers cannot execute direct, unauthenticated queries against backend stores."
      },
      {
        question: "A website that displays different customized content for each logged-in user by querying backend databases is a:",
        options: ["Dynamic Website", "Static Website", "BIOS Firmware", "Read-Only Archive"],
        correctIndex: 0,
        explanation: "Dynamic web apps query backend databases to construct personalized pages tailored to each session."
      },
      {
        question: "In the Client-Server model, what role does the client perform?",
        options: [
          "It initiates requests for web pages and resources and renders the server's response",
          "It permanently stores the company's central database",
          "It powers the regional internet service provider",
          "It runs the electrical power station"
        ],
        correctIndex: 0,
        explanation: "The client (web browser) initiates resource requests to servers and presents the returned payload."
      }
    ]
  },

  // ==========================================
  // Lesson 3-2: Web Communication Protocols & APIs
  // ==========================================
  'ch3-l2-c1': {
    title: "HTTP vs HTTPS Protocols & Request Methods",
    lessonTitle: "Web Communication Protocols & APIs",
    summary: "HyperText Transfer Protocol (HTTP), encrypted HTTPS with SSL/TLS, and primary REST request methods: GET, POST, PUT, DELETE.",
    narration: "Communication between web browsers and servers is governed by the HyperText Transfer Protocol (HTTP). Standard HTTP transmits data in unencrypted plaintext, leaving sensitive information vulnerable to eavesdropping. HTTPS solves this by adding an encryption layer via SSL/TLS. When communicating with web servers, clients use HTTP Request Methods: GET retrieves data from the server, while POST securely sends new data (such as login credentials or payment forms) to be processed.",
    simplifiedExplanation: "HTTP is like sending a postcard through the mail: anyone handling it can read your message. HTTPS is like placing your letter inside a tamper-proof steel lockbox before mailing! GET asks the server 'Please send me the article', while POST tells the server 'Here is my password to log in'.",
    aiPrompt: "Why is HTTPS strictly required for modern websites handling sensitive user information?",
    contentCards: [
      {
        type: "concept",
        title: "HTTP vs HTTPS and Request Methods (Ministry Textbook p. 68):",
        points: [
          "🔓 HTTP (Port 80): Plaintext communication; vulnerable to interception and Man-in-the-Middle eavesdropping.",
          "🔒 HTTPS (Port 443): Encrypted using SSL/TLS protocols; provides confidentiality, integrity, and server authentication.",
          "📤 GET Method: Requests data from a specified resource; parameters visible in the URL query string.",
          "📥 POST Method: Submits data to be processed (e.g. passwords, forms) enclosed securely within the request body."
        ]
      }
    ],
    keyTerms: [
      {
        term: "HTTPS Protocol",
        en: "HTTPS",
        definition: "Hypertext Transfer Protocol Secure; an extension of HTTP encrypted using Transport Layer Security (TLS) to safeguard sensitive data.",
        example: "The padlock icon in your browser when checking online bank accounts or entering passwords.",
        examTip: "Standard port: 443 (HTTP uses port 80). Encrypts all URL parameters, headers, and body payloads."
      },
      {
        term: "GET vs POST Methods",
        en: "HTTP Methods (GET & POST)",
        definition: "Core HTTP request verbs: GET retrieves data without altering server state, while POST sends data in the request body to create or update resources.",
        example: "GET fetches your profile picture; POST submits your registration form.",
        examTip: "GET parameters appear in the URL query string; POST parameters are transmitted securely inside the request body."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which protocol encrypts web traffic using SSL/TLS to protect passwords and credit cards against eavesdropping?",
        options: ["HTTPS (Port 443)", "HTTP (Port 80)", "FTP", "Telnet"],
        correctIndex: 0,
        explanation: "HTTPS encrypts web traffic via SSL/TLS, safeguarding data confidentiality and authenticity."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Which HTTP request method transmits submitted form data securely enclosed inside the request body rather than in the URL?",
        options: ["POST", "GET", "HEAD", "TRACE"],
        correctIndex: 0,
        explanation: "POST packages payload parameters inside the request body, concealing sensitive data from the browser address bar."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Standard HTTP transmits passwords across networks in unencrypted plain text, allowing attackers on public Wi-Fi to intercept them.",
        isTrue: true,
        explanation: "True; Unencrypted HTTP traffic can be intercepted by packet sniffers."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "A GET request should be used to transmit secret user passwords because it displays them clearly in the address bar.",
        isTrue: false,
        explanation: "False; Passwords should never be sent via GET; POST must be used over HTTPS."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The secure encrypted version of the HTTP web protocol is _____.",
        missingWord: "HTTPS",
        hint: "Ends with S (Secure)",
        options: ["HTTPS", "FTP", "SMTP", "DNS"],
        explanation: "HTTPS encrypts web traffic via TLS to safeguard communications."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The HTTP method utilized to retrieve data from a web server without modifying state is _____.",
        missingWord: "GET",
        hint: "GET / Fetch",
        options: ["GET", "POST", "DELETE", "PUT"],
        explanation: "The GET verb retrieves read-only data representations from web endpoints."
      }
    ]
  },

  'ch3-l2-c2': {
    title: "HTTP Status Codes, REST APIs & The JSON Format",
    lessonTitle: "Web Communication Protocols & APIs",
    summary: "Standard HTTP response codes (200 OK, 404 Not Found, 500 Server Error), Application Programming Interfaces (APIs), and lightweight JSON data exchange.",
    narration: "When a web server responds to an HTTP request, it issues an HTTP Status Code: 200 OK signals successful retrieval. 404 Not Found indicates the requested URL does not exist. And 500 Internal Server Error reveals a crash in backend server code. Modern web applications exchange data between frontend and backend via REST APIs using JSON (JavaScript Object Notation)—a lightweight, human-readable key-value text format.",
    simplifiedExplanation: "Status codes are like traffic lights from the server: 200 means 'Green light! Here is your page.' 404 means 'Dead end! That page doesn't exist.' 500 means 'Engine breakdown! The server had an error.' And JSON is the universal language they use to exchange data like: {\"name\": \"Omar\", \"score\": 100}!",
    aiPrompt: "What do HTTP status codes 200, 404, and 500 indicate to a web browser?",
    contentCards: [
      {
        type: "concept",
        title: "Status Codes, APIs and JSON (Ministry Textbook p. 71):",
        points: [
          "🟢 200 OK: Request succeeded; requested resource is returned in the response body.",
          "🟡 404 Not Found: Client error; the requested URL resource does not exist on the server.",
          "🔴 500 Internal Server Error: Backend crash or unhandled exception in server-side script.",
          "📦 JSON (JavaScript Object Notation): Lightweight text format organizing data in key-value pairs ({\"key\": \"value\"}).",
          "🔌 REST API: Structured interface enabling different web systems to exchange data smoothly over HTTP."
        ]
      }
    ],
    keyTerms: [
      {
        term: "HTTP Status Codes",
        en: "HTTP Status Codes",
        definition: "Standardized 3-digit numeric codes issued by a server in response to a client's request, indicating whether the request was fulfilled.",
        example: "200 (Success), 404 (Resource Not Found), 500 (Internal Server Error).",
        examTip: "2xx = Success, 4xx = Client Error, 5xx = Server Error."
      },
      {
        term: "JSON Format",
        en: "JSON Format",
        definition: "JavaScript Object Notation; a lightweight, text-based, language-independent data interchange format utilizing key-value pairs and arrays.",
        example: "{\"student\": \"Ahmed\", \"grade\": 95, \"active\": true}.",
        examTip: "The universal data exchange standard powering modern REST APIs."
      },
      {
        term: "API (Application Programming Interface)",
        en: "API",
        definition: "A set of protocols and tools that enables different software applications to communicate and exchange data programmatically.",
        example: "A weather app fetching live forecasts from a national meteorological server via API.",
        examTip: "Allows frontends and mobile apps to interact with backend databases."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which HTTP status code is returned by a web server when the requested web page URL does not exist?",
        options: ["404 Not Found", "200 OK", "500 Server Error", "301 Redirect"],
        correctIndex: 0,
        explanation: "404 Not Found indicates that the server cannot locate the requested URL endpoint."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "What lightweight, human-readable data format uses key-value pairs and is the global standard for REST APIs?",
        options: ["JSON", "MP3", "PNG", "AVI"],
        correctIndex: 0,
        explanation: "JSON (JavaScript Object Notation) is the lightweight data interchange format used by modern APIs."
      },
      {
        id: "q2",
        level: "true_false",
        question: "An HTTP status code of 200 OK indicates that the server successfully processed the request and delivered the resource.",
        isTrue: true,
        explanation: "True; 200 OK confirms successful request fulfillment."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "An HTTP 500 code signifies an error caused by a typo in the client's web browser URL.",
        isTrue: false,
        explanation: "False; 500 represents an Internal Server Error occurring on the backend host."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The status code returned when a web server fails due to an internal crash is HTTP _____.",
        missingWord: "500",
        hint: "500",
        options: ["500", "200", "404", "100"],
        explanation: "500 signals an Internal Server Error on the backend."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The lightweight data interchange format using key-value pairs is _____.",
        missingWord: "JSON",
        hint: "JSON",
        options: ["JSON", "HTML", "JPEG", "PDF"],
        explanation: "JSON formats structured data for web applications and APIs."
      }
    ]
  },

  'ch3-l2-exam': {
    title: "🏆 Final Challenge: Lesson (3-2) Mastery Exam",
    lessonTitle: "Web Communication Protocols & APIs",
    summary: "Comprehensive exam testing HTTP vs HTTPS, request methods, status codes, and JSON API payloads.",
    narration: "Welcome to the Lesson 3-2 Mastery Challenge! Test your thorough knowledge of web protocols, HTTPS encryption, status codes, and API data payloads to claim your gold trophy!",
    examQuestions: [
      {
        question: "What is the primary operational difference between HTTP and HTTPS?",
        options: [
          "HTTPS encrypts communications using SSL/TLS, preventing eavesdropping and tampering",
          "HTTP can only be used on mobile phones",
          "HTTPS disables all images on websites",
          "HTTP requires biometric fingerprint scanning"
        ],
        correctIndex: 0,
        explanation: "HTTPS establishes an encrypted TLS session, ensuring confidentiality, integrity, and server authentication."
      },
      {
        question: "Why should sensitive login passwords be transmitted using the POST method instead of GET?",
        options: [
          "POST encloses parameters inside the encrypted request body, keeping them out of browser URLs and server logs",
          "POST runs 10 times faster than GET",
          "POST automatically translates passwords into English",
          "POST disables the user's monitor"
        ],
        correctIndex: 0,
        explanation: "GET parameters appear openly in URLs and history logs; POST embeds payload data securely within the request body."
      },
      {
        question: "What does an HTTP status code of 404 indicate to a web client?",
        options: [
          "The server cannot locate the requested resource URL (Not Found)",
          "The request succeeded perfectly (OK)",
          "The database server has overheated",
          "The client computer must be restarted"
        ],
        correctIndex: 0,
        explanation: "404 indicates a client error where the requested target URI could not be found by the server."
      },
      {
        question: "What is the primary role of an Application Programming Interface (API) in modern web development?",
        options: [
          "It allows different software applications to exchange data and invoke functions programmatically",
          "It acts as a physical power switch for servers",
          "It cleans dust from computer hardware",
          "It replaces the need for internet cables"
        ],
        correctIndex: 0,
        explanation: "APIs provide standardized communication contracts enabling diverse software systems to interact seamlessly."
      },
      {
        question: "Which of the following represents valid JSON data syntax?",
        options: [
          '{"name": "Ziad", "score": 98, "passed": true}',
          "name = Ziad, score = 98",
          "<name>Ziad</name><score>98</score>",
          "[name: Ziad; score: 98;]"
        ],
        correctIndex: 0,
        explanation: "JSON structures data using curly braces, double-quoted keys, and standard typed values."
      }
    ]
  },

  // ==========================================
  // Lesson 3-3: Web Technologies: HTML, CSS & JavaScript
  // ==========================================
  'ch3-l3-c1': {
    title: "The Front-End Triad: HTML, CSS & JavaScript Roles",
    lessonTitle: "Web Technologies: HTML, CSS & JavaScript",
    summary: "The foundational triumvirate: HTML provides structural semantic skeleton, CSS handles visual layout and aesthetic styling, while JavaScript orchestrates interactivity.",
    narration: "Every visual web page in the world is constructed using three core front-end languages: HTML (HyperText Markup Language) builds the structural skeleton using semantic tags like headings, paragraphs, and forms. CSS (Cascading Style Sheets) decorates the appearance, controlling color palettes, fonts, grid layouts, and animations. And JavaScript acts as the nervous system, adding dynamic interactivity, handling button clicks, validating forms, and fetching API data asynchronously without refreshing the page.",
    simplifiedExplanation: "Think of a human being: HTML is the skeletal bone structure giving shape. CSS is the clothes, hairstyle, and skin color making it look stylish. And JavaScript is the brain and muscle reflex allowing it to move, talk, and dance!",
    aiPrompt: "How do HTML, CSS, and JavaScript divide responsibilities when rendering a webpage?",
    contentCards: [
      {
        type: "concept",
        title: "The Front-End Triad (Ministry Textbook p. 76):",
        points: [
          "🦴 HTML (Structure): Semantic skeleton (<h1>, <p>, <div>, <button>) defining document architecture.",
          "🎨 CSS (Presentation): Aesthetic styling (colors, Flexbox, Grid, gradients, typography, responsive queries).",
          "⚡ JavaScript (Behavior): Programmatic interactivity (event listeners, DOM manipulation, asynchronous Fetch API)."
        ]
      }
    ],
    keyTerms: [
      {
        term: "HTML (HyperText Markup Language)",
        en: "HTML",
        definition: "The standard markup language used to structure web pages and their content using tags and semantic elements.",
        example: "<header>, <nav>, <article>, and <button> defining the layout components of a web document.",
        examTip: "Provides structure and semantic meaning; does NOT handle programmatic logic."
      },
      {
        term: "CSS (Cascading Style Sheets)",
        en: "CSS",
        definition: "A style sheet language used for describing the visual presentation, styling, and responsive layout of a document written in HTML.",
        example: "Setting background-color: #0f172a, display: flex, and media queries for mobile devices.",
        examTip: "Controls layout, colors, typography, animations, and cross-device responsiveness."
      },
      {
        term: "JavaScript (JS)",
        en: "JavaScript",
        definition: "A dynamic programming language that enables interactive web pages, controls multimedia, animates images, and manages asynchronous server data.",
        example: "A script that updates an interactive quiz score immediately when a user clicks an option without reloading.",
        examTip: "The core programming language of web browsers; operates on the Document Object Model (DOM)."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which web technology is responsible for defining the structural skeleton and semantic content of a webpage?",
        options: ["HTML", "CSS", "Python", "SQL"],
        correctIndex: 0,
        explanation: "HTML (HyperText Markup Language) constructs the structural document skeleton of web pages."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Which language controls visual presentation, color schemes, typography, and responsive screen layouts?",
        options: ["CSS", "HTML", "SQL", "C++"],
        correctIndex: 0,
        explanation: "CSS (Cascading Style Sheets) styles the presentation, layout, and visual aesthetics of web elements."
      },
      {
        id: "q2",
        level: "true_false",
        question: "JavaScript enables web pages to react to user events (like button clicks) and update content dynamically without reloading.",
        isTrue: true,
        explanation: "True; JavaScript provides dynamic DOM manipulation and event-driven interactivity."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "HTML is a complex programming language that performs database queries and complex mathematical calculations directly.",
        isTrue: false,
        explanation: "False; HTML is a markup language defining structure, not a computational programming language."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The markup language defining the semantic document skeleton is _____.",
        missingWord: "HTML",
        hint: "HTML",
        options: ["HTML", "CSS", "SQL", "PHP"],
        explanation: "HTML provides the structural building blocks for web documents."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The dynamic programming language powering browser interactivity is _____.",
        missingWord: "JavaScript",
        hint: "JavaScript",
        options: ["JavaScript", "HTML", "CSS", "SQL"],
        explanation: "JavaScript brings interactivity, asynchronous data fetching, and dynamic logic to the browser."
      }
    ]
  },

  'ch3-l3-c2': {
    title: "Semantic HTML, Responsive Design & Modern Web Frameworks",
    lessonTitle: "Web Technologies: HTML, CSS & JavaScript",
    summary: "Semantic elements (<header>, <main>, <nav>), CSS Media Queries for fluid responsive design across screens, and modern frontend frameworks (React, Vue).",
    narration: "Professional web development emphasizes Semantic HTML: using descriptive tags like <header>, <nav>, <article>, and <footer> instead of generic <div> tags, which dramatically enhances accessibility (for screen readers) and Search Engine Optimization (SEO). Furthermore, Responsive Web Design uses CSS Media Queries and fluid layouts (Flexbox/Grid) to ensure pages adapt seamlessly whether viewed on a 4-inch smartphone or a 32-inch 4K monitor.",
    simplifiedExplanation: "Semantic HTML is like labeling storage boxes clearly ('Shoes', 'Books') instead of putting 'Stuff' on every box. Search engines and blind screen-readers love it! Responsive design is like liquid water: pouring into a tiny smartphone glass or a giant desktop pitcher, fitting perfectly!",
    aiPrompt: "Why is semantic HTML critical for accessibility and search engine optimization (SEO)?",
    contentCards: [
      {
        type: "concept",
        title: "Semantic HTML & Responsive Design (Ministry Textbook p. 80):",
        points: [
          "🏷️ Semantic Elements: Tags that clearly describe their meaning to browser and developer (<header>, <nav>, <main>, <footer>).",
          "📱 Responsive Web Design: Adapts layout smoothly across desktops, tablets, and smartphones using CSS Media Queries (@media).",
          "🚀 Modern Web Frameworks: Component-driven libraries (React, Vue, Angular) enabling high-speed Single Page Applications (SPAs)."
        ]
      },
      {
        type: "teacherTip",
        title: "💡 Exam Tip:",
        text: "Semantic tags improve SEO search rankings and screen-reader accessibility for visually impaired users!"
      }
    ],
    keyTerms: [
      {
        term: "Semantic HTML",
        en: "Semantic HTML",
        definition: "The use of HTML markup to reinforce the meaning and structure of information on webpages, rather than merely defining its visual look.",
        example: "Using <nav> for navigation links and <article> for blog posts instead of generic <div> tags.",
        examTip: "Essential for search engine crawlers (SEO) and assistive accessibility technologies."
      },
      {
        term: "Responsive Web Design (RWD)",
        en: "Responsive Web Design",
        definition: "A web design approach that makes web pages render well on a variety of devices and window or screen sizes using fluid grids and media queries.",
        example: "A multi-column desktop layout that automatically transforms into a single vertical scrolling column on mobile phones.",
        examTip: "Implemented in CSS using @media queries and flexible viewport units."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Why should developers use semantic HTML tags (like <header>, <nav>, <article>) instead of generic <div> tags?",
        options: [
          "Because they clearly communicate structure and meaning to search engines (SEO) and accessibility screen-readers",
          "Because they make the internet connection free",
          "Because they turn off CSS stylesheets",
          "Because they prevent computers from consuming electricity"
        ],
        correctIndex: 0,
        explanation: "Semantic tags describe their contents clearly, empowering search engine crawlers and assistive screen readers."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Which CSS feature allows a web layout to automatically rearrange elements based on the visitor's screen width?",
        options: ["CSS Media Queries (@media)", "Static Pixel Widths", "HTML Tags", "SQL Queries"],
        correctIndex: 0,
        explanation: "Media queries check screen characteristics (like width) and apply tailored styles for mobile and desktop screens."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Responsive Web Design ensures that a website looks aesthetically pleasing and fully usable on both mobile phones and desktop computers.",
        isTrue: true,
        explanation: "True; Responsive design creates fluid layouts adapting to any viewport size."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Modern component-based frameworks like React replace the need for the browser to run HTML or CSS.",
        isTrue: false,
        explanation: "False; Modern frameworks compile down to standard HTML, CSS, and JavaScript that browsers execute."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "HTML tags that clearly convey their structural meaning are called _____ Elements.",
        missingWord: "Semantic",
        hint: "Semantic / Meaningful",
        options: ["Semantic", "Random", "Static", "Binary"],
        explanation: "Semantic elements convey explicit meaning regarding their enclosed content."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Creating web layouts that adapt smoothly across all screen sizes is _____ Web Design.",
        missingWord: "Responsive",
        hint: "Responsive / Adaptive",
        options: ["Responsive", "Rigid", "Fixed", "Linear"],
        explanation: "Responsive Web Design dynamically responds to varying device viewport dimensions."
      }
    ]
  },

  'ch3-l3-exam': {
    title: "🏆 Final Challenge: Lesson (3-3) Mastery Exam",
    lessonTitle: "Web Technologies: HTML, CSS & JavaScript",
    summary: "Comprehensive exam testing the front-end triad, semantic HTML, responsive design, and CSS media queries.",
    narration: "Welcome to the Lesson 3-3 Mastery Challenge! Conclude Chapter 3 by demonstrating your mastery of HTML structure, CSS styling, and JavaScript interactivity to claim your gold trophy!",
    examQuestions: [
      {
        question: "In the front-end web development triumvirate, what is the specific role of CSS?",
        options: [
          "Controlling visual presentation, styling, typography, colors, and responsive layouts",
          "Storing database tables on the hard drive",
          "Executing SQL queries on backend servers",
          "Regulating computer hardware voltage"
        ],
        correctIndex: 0,
        explanation: "CSS styles the presentation, colors, positioning, and visual design of web elements."
      },
      {
        question: "Which language provides dynamic interactivity, button event handling, and asynchronous data fetching in the browser?",
        options: ["JavaScript", "HTML", "SQL", "Plain text"],
        correctIndex: 0,
        explanation: "JavaScript is the browser's dynamic scripting language responsible for user interactions and runtime logic."
      },
      {
        question: "What is the primary benefit of utilizing Semantic HTML tags (such as <nav> and <article>)?",
        options: [
          "It provides clear structural meaning for accessibility screen readers and improves Search Engine Optimization (SEO)",
          "It eliminates the need for a web browser",
          "It doubles the internet speed of the user",
          "It makes the computer keyboard wireless"
        ],
        correctIndex: 0,
        explanation: "Semantic elements communicate clear meaning to assistive devices and search engine crawlers."
      },
      {
        question: "How does Responsive Web Design achieve layout flexibility across mobile phones and desktop displays?",
        options: [
          "By utilizing CSS Media Queries (@media) and flexible grid units to adapt styling dynamically to viewport widths",
          "By creating completely different websites on separate domain names with separate codebases",
          "By banning mobile phone users from visiting the website",
          "By converting all web pages into PDF documents"
        ],
        correctIndex: 0,
        explanation: "Media queries apply conditional CSS rules based on screen resolution and orientation."
      },
      {
        question: "Which of the following elements is a valid Semantic HTML5 structural container?",
        options: ["<header>", "<boldtext>", "<fontcolor>", "<makeitalic>"],
        correctIndex: 0,
        explanation: "<header> is a standardized semantic HTML5 structural element representing introductory navigational content."
      }
    ]
  }
};
