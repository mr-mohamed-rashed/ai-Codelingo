/**
 * Chapter 1 English Curriculum Data:
 * IT & Society (تكنولوجيا المعلومات والمجتمع)
 * Lessons 1-1, 1-2, 1-3, 1-4
 */

module.exports = {
  // ==========================================
  // Lesson 1-1: IT Evolution & Emerging Technologies
  // ==========================================
  'ch1-l1-c1': {
    title: "The 5 Historical Eras of Computing Evolution",
    lessonTitle: "IT Evolution & Emerging Technologies",
    summary: "The 5 major milestones: from vacuum-tube computers (ENIAC) to personal computers, commercial internet, mobile smartphones, and cloud computing.",
    narration: "Welcome champion! Information technology evolved through five major historical eras: first, the 1940s brought giant vacuum-tube electronic computers like ENIAC for military and scientific calculations. Second, the 1970s and 80s witnessed the personal computer revolution entering homes and offices. Third, the 1990s introduced commercial internet and the World Wide Web. Fourth, the 2000s ushered in mobile smartphones. And fifth, from 2010 onward, cloud computing and big data transformed IT into on-demand services.",
    simplifiedExplanation: "Computers began as room-sized giants that were very slow. Over decades, they shrank to desktop PCs, connected globally via the internet, fit into your pocket as smartphones, and now operate as vast global cloud supercomputers!",
    aiPrompt: "Great job! Did you grasp the 5 historical computing eras from ENIAC to the cloud, or would you like a quick review example?",
    contentCards: [
      {
        type: "concept",
        title: "The 5 Milestones of IT Evolution (Ministry Textbook p. 7):",
        points: [
          "1️⃣ 1940s–1960s: First electronic computers (ENIAC) using vacuum tubes for military & scientific calculations.",
          "2️⃣ 1970s–1980s: Proliferation of Personal Computers (PCs) in homes and business offices.",
          "3️⃣ 1990s: Commercialization of the Internet, the World Wide Web (WWW), and global email communication.",
          "4️⃣ 2000s: Emergence of mobile smartphones and ubiquitous wireless internet access.",
          "5️⃣ 2010s Onward: Big Data, Cloud Computing, and AI operating as IT as a Service (ITaaS)."
        ]
      },
      {
        type: "teacherTip",
        title: "💡 Exam Memorization Key:",
        text: "Memorize chronologically: ENIAC in 40s → Personal PC in 70s → Internet in 90s → Smartphones in 2000s → Cloud & AI today!"
      }
    ],
    keyTerms: [
      {
        term: "ENIAC Computer",
        en: "ENIAC",
        definition: "The first general-purpose digital electronic computer built in the 1940s, utilizing vacuum tubes for military ballistics and scientific calculations.",
        example: "It weighed 30 tons and consumed enough electricity to power an entire village!",
        examTip: "Frequent exam question: The core hardware component of the 1st generation was Vacuum Tubes."
      },
      {
        term: "Cloud Computing",
        en: "Cloud Computing",
        definition: "Delivering IT resources (servers, storage, processing power) on demand over the Internet with pay-as-you-go pricing.",
        example: "Storing files on Google Drive or training AI models without buying expensive hardware.",
        examTip: "The 5th milestone began in the 2010s and enabled the Big Data revolution."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "What is the correct chronological sequence of Information Technology milestones?",
        options: [
          "Electronic Computers → Smartphones → Commercial Internet → Cloud Computing",
          "Electronic Computers → Commercial Internet → Smartphones → Cloud Computing",
          "Commercial Internet → Early Computers → Cloud Computing → Smartphones",
          "Early Computers → Cloud Computing → Commercial Internet → Smartphones"
        ],
        correctIndex: 1,
        explanation: "Chronological order: Vacuum-tube computers (40s) → Internet (90s) → Smartphones (2000s) → Cloud Computing (2010s)."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Which era witnessed computers entering ordinary households and personal office desks?",
        options: [
          "1940s and 1950s",
          "1970s and 1980s (Personal Computer Revolution)",
          "1990s Internet Bubble",
          "2010s Cloud Era"
        ],
        correctIndex: 1,
        explanation: "The 1970s and 80s marked the birth and mass adoption of Personal Computers (PCs)."
      },
      {
        id: "q2",
        level: "true_false",
        question: "First-generation computers like ENIAC were primarily restricted to military and massive scientific computations.",
        isTrue: true,
        explanation: "True; Due to their enormous size, high cost, and reliance on thousands of delicate vacuum tubes."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Cloud computing and Big Data became the dominant IT paradigm in the 1970s.",
        isTrue: false,
        explanation: "False; Cloud computing and Big Data proliferated from the 2010s onward."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term before time expires:",
        questionTemplate: "The historic first general-purpose electronic digital computer in the 1940s was _____.",
        missingWord: "ENIAC",
        hint: "Starts with E and has 5 letters",
        options: ["ENIAC", "UNIVAC", "APPLE", "INTEL"],
        explanation: "ENIAC is the historical milestone that launched electronic digital computing."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the statement before time expires:",
        questionTemplate: "Delivering IT resources as on-demand services over the internet is known as _____ Computing.",
        missingWord: "Cloud",
        hint: "Pertains to cloud-hosted infrastructure",
        options: ["Cloud", "Grid", "Edge", "Local"],
        explanation: "Cloud computing provides scalable compute and storage as on-demand utilities."
      }
    ]
  },

  'ch1-l1-c2': {
    title: "Moore's Law, Silicon Physical Limits & Alternatives",
    lessonTitle: "IT Evolution & Emerging Technologies",
    summary: "Doubling of transistors every two years, quantum tunneling, leakage currents, thermal heat dissipation, and multi-core parallel processing solutions.",
    narration: "Moore's Law is an empirical observation stating that the number of transistors on a microchip doubles approximately every two years. Today, it encounters physical barriers: when transistors shrink to nanometer scales, quantum tunneling occurs, electrical leakage increases, and heat dissipation becomes overwhelming. Engineers solve this using multi-core processors and parallel computing architectures.",
    simplifiedExplanation: "Imagine cramming millions of tiny switches into a thumbnail. If you make them too tiny, electricity leaks like water through thin paper! That's why chipmakers now put multiple brains (multi-core processors) onto a single chip.",
    aiPrompt: "Do you understand why we cannot shrink transistors infinitely due to quantum tunneling and heat limits?",
    contentCards: [
      {
        type: "concept",
        title: "Moore's Law and Its Physical Boundaries:",
        points: [
          "📈 Moore's Law: Formulated by Gordon Moore; transistor count doubles roughly every two years.",
          "⚛️ Quantum Tunneling: Electrons leak through ultra-thin silicon gates, causing erratic switching.",
          "🔥 Thermal Dissipation: High transistor density produces excessive heat that cannot be cooled efficiently.",
          "🧩 Contemporary Solution: Transitioning from single-core clock speeds to Multi-Core parallel architectures."
        ]
      },
      {
        type: "teacherTip",
        title: "💡 Exam Tip:",
        text: "Moore's Law is an empirical observation, NOT a physical law of nature. Its physical limits are leakage current and heat!"
      }
    ],
    keyTerms: [
      {
        term: "Moore's Law",
        en: "Moore's Law",
        definition: "An empirical rule stating that the number of transistors packed onto a microchip doubles approximately every two years.",
        example: "A microchip with 10 million transistors today will accommodate roughly 20 million two years later.",
        examTip: "Formulated by Gordon Moore, co-founder of Intel."
      },
      {
        term: "Quantum Tunneling",
        en: "Quantum Tunneling",
        definition: "A quantum phenomenon where subatomic particles penetrate through thin barriers, causing electric current leakage in nanoscale transistors.",
        example: "Electricity leaping across silicon gates even when the switch is nominally turned OFF.",
        examTip: "It is one of the fundamental physical limits ending traditional Moore's Law scaling."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "According to Moore's Law, how often does the number of transistors on an integrated circuit double?",
        options: ["Every 6 months", "Approximately every two years", "Every 5 years", "Every 10 years"],
        correctIndex: 1,
        explanation: "Gordon Moore observed that transistor density doubles approximately every 2 years."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Which of the following represents a primary physical obstacle halting single-core processor scaling?",
        options: ["Lack of software", "Quantum tunneling and excessive heat dissipation", "Shortage of computer mice", "Slow internet speeds"],
        correctIndex: 1,
        explanation: "Atomic barriers, electron leakage (quantum tunneling), and extreme thermal dissipation limit silicon miniaturization."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Moore's Law is a strict, immutable physical law of nature like Newton's laws.",
        isTrue: false,
        explanation: "False; Moore's Law is an empirical observation and industrial projection, not a physical law."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Multi-core processors allow parallel task execution to increase overall performance without excessive clock speeds.",
        isTrue: true,
        explanation: "True; Multi-core architecture bypasses single-core thermal limits by distributing work across cores."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The empirical rule describing microchip transistor doubling is _____'s Law.",
        missingWord: "Moore",
        hint: "Gordon ...",
        options: ["Moore", "Ohm", "Newton", "Boyle"],
        explanation: "Moore's Law describes the exponential historical progression of semiconductor density."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Subatomic electron leakage across nanoscale silicon barriers is known as Quantum _____.",
        missingWord: "Tunneling",
        hint: "Tunneling phenomenon",
        options: ["Tunneling", "Processing", "Computing", "Routing"],
        explanation: "Quantum tunneling causes current to leak across ultra-thin insulator gates."
      }
    ]
  },

  'ch1-l1-c3': {
    title: "The 5 Societal Shifts of Information Technology",
    lessonTitle: "IT Evolution & Emerging Technologies",
    summary: "E-Commerce, Remote Work, Cashless Digital Payments, E-Learning, and Social Networking Services (SNS).",
    narration: "Information technology profoundly revolutionized human society across five fundamental pillars: first, E-Commerce enabling global retail shopping from home. Second, Remote Work allowing collaborative telecommuting across continents. Third, Cashless Digital Payments eliminating physical cash. Fourth, E-Learning providing customized digital instruction. And fifth, Social Networking Services connecting billions of people worldwide.",
    simplifiedExplanation: "Think about how your daily routine changed: you buy clothes online, parents work from home, you pay with digital cards or mobile wallets, study lessons on your laptop, and message friends on social apps!",
    aiPrompt: "Can you name the 5 pillars that transformed modern society through information technology?",
    contentCards: [
      {
        type: "concept",
        title: "The 5 Societal Pillars of IT Transformation:",
        points: [
          "🛒 E-Commerce: Global 24/7 digital retail, reducing logistical costs.",
          "💼 Remote Work (Telecommuting): Cloud collaboration tools eliminating geographical barriers.",
          "💳 Cashless Society: Digital mobile wallets and contactless NFC transactions.",
          "🎓 E-Learning: Interactive platforms, MOOCs, and personalized self-paced education.",
          "📱 Social Media (SNS): Instantaneous global human communication and information exchange."
        ]
      },
      {
        type: "teacherTip",
        title: "💡 Exam Tip:",
        text: "Focus on matching each term with its primary societal advantage: Cashless = financial speed and security; Remote work = location independence!"
      }
    ],
    keyTerms: [
      {
        term: "E-Commerce",
        en: "E-Commerce",
        definition: "The buying and selling of goods, services, and digital products through electronic networks such as the internet.",
        example: "Purchasing books from Amazon or ordering food via delivery mobile applications.",
        examTip: "Reduces overhead expenses and grants consumers round-the-clock commercial access."
      },
      {
        term: "Telecommuting (Remote Work)",
        en: "Remote Work",
        definition: "A flexible work arrangement where employees perform professional tasks outside traditional offices using telecommunications.",
        example: "A software engineer in Cairo collaborating with an engineering team in London via cloud tools.",
        examTip: "Significantly cuts commuter traffic and enables access to global talent pools."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which societal shift enables employees to work productively from home using cloud collaboration software?",
        options: ["Remote Work (Telecommuting)", "E-Commerce", "Cashless Payments", "Social Networking"],
        correctIndex: 0,
        explanation: "Remote work allows employees to perform duties outside traditional workplaces using IT infrastructure."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Digital wallets, NFC cards, and instant online transfers are examples of:",
        options: ["Cashless Society", "Hardware manufacturing", "Vacuum-tube computing", "Paper billing"],
        correctIndex: 0,
        explanation: "A cashless society relies on electronic and digital transaction mechanisms rather than physical banknotes."
      },
      {
        id: "q2",
        level: "true_false",
        question: "E-Learning limits educational access to students residing in the same geographic city as the instructor.",
        isTrue: false,
        explanation: "False; E-Learning democratizes global access, allowing learners anywhere in the world to participate."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "E-Commerce enables commercial transactions 24 hours a day, 7 days a week.",
        isTrue: true,
        explanation: "True; Online storefronts operate continuously without traditional store closing hours."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Conducting commercial retail transactions over the internet is termed E-_____.",
        missingWord: "Commerce",
        hint: "Electronic Commerce",
        options: ["Commerce", "Mail", "Learning", "Banking"],
        explanation: "E-Commerce represents electronic business transactions and online retail."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Financial systems operating through digital transfers without paper currency constitute a _____ society.",
        missingWord: "Cashless",
        hint: "Without physical cash",
        options: ["Cashless", "Coinless", "Costless", "Cardless"],
        explanation: "A cashless society minimizes physical currency in favor of digital payment rails."
      }
    ]
  },

  'ch1-l1-c4': {
    title: "Emerging Technologies: Autonomous Vehicles, AR/VR & Quantum",
    lessonTitle: "IT Evolution & Emerging Technologies",
    summary: "Autonomous driving with LiDAR sensors, Augmented Reality (AR) and Virtual Reality (VR), and Quantum Computing with superposition and entanglement.",
    narration: "Emerging technologies represent the frontier of modern computing: Autonomous vehicles use AI, computer vision, and LiDAR sensors to navigate safely without human drivers. Augmented Reality overlays synthetic digital information onto the real physical world, whereas Virtual Reality immerses users into completely simulated 3D environments. Quantum computing utilizes qubits, superposition, and quantum entanglement to solve calculations that classical computers cannot solve in millennia.",
    simplifiedExplanation: "AR adds digital graphics to your real world (like Pokémon GO filters), VR puts you inside a totally fake computer world with goggles, self-driving cars use lasers (LiDAR) to see traffic, and Quantum computers use atomic magic to calculate at mind-bending speeds!",
    aiPrompt: "Can you distinguish between Augmented Reality (AR) and Virtual Reality (VR)?",
    contentCards: [
      {
        type: "concept",
        title: "Core Emerging Technologies (Ministry Textbook p. 11):",
        points: [
          "🚗 Autonomous Vehicles: Use LiDAR, radar, cameras, and AI to navigate without human drivers.",
          "👓 Augmented Reality (AR): Overlays digital 3D models or data onto the user's real physical surroundings.",
          "🥽 Virtual Reality (VR): Creates a 100% immersive, isolated synthetic digital environment.",
          "⚛️ Quantum Computing: Replaces classical binary bits (0 or 1) with Qubits capable of Superposition and Entanglement."
        ]
      },
      {
        type: "teacherTip",
        title: "💡 Exam Distinction:",
        text: "AR = Real World + Digital Overlay (e.g. HUD navigation). VR = Fully Simulated Virtual World (e.g. VR headset)!"
      }
    ],
    keyTerms: [
      {
        term: "Augmented Reality (AR)",
        en: "Augmented Reality",
        definition: "An interactive experience where computer-generated perceptual information enhances real-world physical environments in real time.",
        example: "Using your smartphone camera to see how an IKEA sofa looks in your actual living room.",
        examTip: "AR enhances the physical world; it does not replace it."
      },
      {
        term: "Quantum Superposition",
        en: "Superposition",
        definition: "A quantum mechanics property allowing a qubit to exist in a state of 0, 1, or both simultaneously until measured.",
        example: "A spinning coin that is both heads and tails until it settles, enabling exponential parallel calculations.",
        examTip: "Superposition and Entanglement are the dual cornerstones of quantum computing advantage."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which technology overlays digital graphics and interactive data onto the user's actual physical environment?",
        options: ["Augmented Reality (AR)", "Virtual Reality (VR)", "Batch Processing", "Quantum Tunneling"],
        correctIndex: 0,
        explanation: "Augmented Reality (AR) overlays virtual graphics onto the real physical view."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "What is the primary sensor used by autonomous self-driving cars to construct 3D point-cloud maps of surrounding obstacles?",
        options: ["LiDAR", "Microphone", "Printer head", "Audio cable"],
        correctIndex: 0,
        explanation: "LiDAR uses laser pulses to measure exact distances and build 3D spatial maps around autonomous vehicles."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Virtual Reality (VR) replaces the user's entire visual field with a completely computer-generated 3D environment.",
        isTrue: true,
        explanation: "True; VR provides full digital immersion, isolating the user from the physical environment."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "In quantum computing, a qubit can only ever hold the state 0 or the state 1, exactly like a classical bit.",
        isTrue: false,
        explanation: "False; Through superposition, a qubit can represent 0, 1, or a combination of both simultaneously."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Laser-based light detection sensors used in self-driving cars are called _____.",
        missingWord: "LiDAR",
        hint: "Light Detection and Ranging",
        options: ["LiDAR", "Sonar", "Wi-Fi", "Bluetooth"],
        explanation: "LiDAR provides high-resolution 3D environmental mapping for autonomous vehicles."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The fundamental unit of information in quantum computing is the _____.",
        missingWord: "Qubit",
        hint: "Quantum Bit",
        options: ["Qubit", "Byte", "Pixel", "Voxel"],
        explanation: "A Qubit is the quantum mechanical equivalent of a classical computing bit."
      }
    ]
  },

  'ch1-l1-exam': {
    title: "🏆 Final Challenge: Lesson (1-1) Mastery Exam",
    lessonTitle: "IT Evolution & Emerging Technologies",
    summary: "Comprehensive exam testing computing history, Moore's Law, societal shifts, and emerging technologies.",
    narration: "You have arrived at the Final Mastery Challenge of Lesson 1-1! Answer all five comprehensive questions correctly to claim your Golden Trophy and unlock the next lesson!",
    examQuestions: [
      {
        question: "Which of the following describes the first generation of electronic computing in the 1940s?",
        options: [
          "Smartphones with touch screens",
          "Giant vacuum-tube computers like ENIAC for military computations",
          "Personal home laptops",
          "Decentralized cloud networks"
        ],
        correctIndex: 1,
        explanation: "First-generation computers relied on thousands of vacuum tubes and occupied entire rooms for military calculations."
      },
      {
        question: "Gordon Moore observed that the number of transistors on a microchip doubles roughly every:",
        options: ["6 months", "Two years", "10 years", "25 years"],
        correctIndex: 1,
        explanation: "Moore's Law estimates that microchip transistor count doubles approximately every two years."
      },
      {
        question: "What physical barrier causes electric current to leak across ultra-thin silicon gates in nanoscale processors?",
        options: ["Quantum Tunneling", "Electromagnetic radiation", "Software bugs", "Screen glare"],
        correctIndex: 0,
        explanation: "Quantum tunneling occurs when the gate oxide becomes so thin that electrons tunnel through, causing unwanted leakage."
      },
      {
        question: "Which technology combines real physical video feeds with real-time digital 3D overlays?",
        options: ["Augmented Reality (AR)", "Virtual Reality (VR)", "Punch cards", "Mainframe computing"],
        correctIndex: 0,
        explanation: "Augmented Reality augments the real physical environment with digital elements."
      },
      {
        question: "What unique quantum property allows a qubit to represent multiple states simultaneously?",
        options: ["Superposition", "Binary conduction", "Thermal leakage", "Clock speed"],
        correctIndex: 0,
        explanation: "Quantum superposition allows qubits to represent 0 and 1 simultaneously until observed."
      }
    ]
  },

  // ==========================================
  // Lesson 1-2: How Artificial Intelligence Works
  // ==========================================
  'ch1-l2-c1': {
    title: "Artificial Intelligence: Machine Learning, Deep Learning & Generative AI",
    lessonTitle: "How Artificial Intelligence Works",
    summary: "The hierarchy of AI: Machine Learning (ML) learning from data, Deep Learning (DL) with artificial neural networks, and Generative AI (GenAI).",
    narration: "Artificial Intelligence is the broad umbrella science of creating machines that simulate human cognitive intelligence. Inside AI sits Machine Learning, where systems learn mathematical patterns from training data rather than following hardcoded rules. Within ML lies Deep Learning, which uses deep multi-layered Artificial Neural Networks. And inside Deep Learning sits Generative AI, capable of producing entirely new text, images, and audio from user prompts.",
    simplifiedExplanation: "Think of Russian nesting dolls: The biggest outer doll is AI (smart machines). Inside it is Machine Learning (learning from data). Inside that is Deep Learning (brain-like neural layers). And in the very center is Generative AI (creating new poems, code, and art)!",
    aiPrompt: "Do you clearly see the nested hierarchy between AI, Machine Learning, Deep Learning, and Generative AI?",
    contentCards: [
      {
        type: "concept",
        title: "The AI Conceptual Hierarchy (Ministry Textbook p. 14):",
        points: [
          "🌐 Artificial Intelligence (AI): The broad field of machines mimicking human cognitive abilities.",
          "📊 Machine Learning (ML): Algorithms that optimize performance by discovering patterns in data without explicit programming.",
          "🧠 Deep Learning (DL): Multi-layered Artificial Neural Networks capable of feature extraction from complex raw data.",
          "✨ Generative AI (GenAI): Models trained on vast data that synthesize original text, images, code, and media."
        ]
      },
      {
        type: "teacherTip",
        title: "💡 Exam Tip:",
        text: "Hierarchy relationship: Every Deep Learning model is Machine Learning, and every Machine Learning model is AI, but NOT vice versa!"
      }
    ],
    keyTerms: [
      {
        term: "Machine Learning (ML)",
        en: "Machine Learning",
        definition: "A subset of AI focused on building systems that learn and improve performance from data experience without explicit programming.",
        example: "An email filter learning to classify incoming spam messages based on historical user marking.",
        examTip: "Differs from traditional computing: learns rules from data rather than executing hardcoded rules."
      },
      {
        term: "Generative AI",
        en: "Generative AI",
        definition: "Artificial intelligence systems capable of generating novel synthetic content (text, imagery, audio, code) in response to prompts.",
        example: "ChatGPT generating an essay or Midjourney generating photorealistic artwork.",
        examTip: "Relies on foundational transformer models and probability distributions over tokens."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which statement accurately describes the relationship between AI, Machine Learning, and Deep Learning?",
        options: [
          "Deep Learning is a specialized subset within Machine Learning, which is a subset within Artificial Intelligence",
          "Machine Learning and Deep Learning are completely independent and unrelated fields",
          "Artificial Intelligence is a small subset inside Generative AI",
          "Deep Learning is older than traditional Machine Learning"
        ],
        correctIndex: 0,
        explanation: "AI is the broad field, ML is a subset of AI, and DL is a specialized subset of ML using deep neural networks."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "AI models that synthesize completely new text, images, and audio based on user prompts are categorized as:",
        options: ["Generative AI (GenAI)", "Static Databases", "Legacy Word Processors", "Analog Computing"],
        correctIndex: 0,
        explanation: "Generative AI generates new, novel creative content based on statistical patterns learned during training."
      },
      {
        id: "q2",
        level: "true_false",
        question: "In Machine Learning, programmers must manually hardcode an explicit 'if-else' rule for every single possible scenario.",
        isTrue: false,
        explanation: "False; ML algorithms infer and learn patterns automatically from data rather than relying on exhaustive hardcoded rules."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Deep Learning utilizes artificial neural networks composed of multiple layers to process unstructured data like images and voice.",
        isTrue: true,
        explanation: "True; Deep Learning uses multiple hidden layers to extract hierarchical abstractions from complex raw inputs."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Systems that improve automatically through data experience without explicit programming constitute Machine _____.",
        missingWord: "Learning",
        hint: "Machine ...",
        options: ["Learning", "Printing", "Routing", "Storage"],
        explanation: "Machine Learning empowers computers to extract predictive patterns directly from data."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The subfield of ML using multi-layered neural networks inspired by the human brain is _____ Learning.",
        missingWord: "Deep",
        hint: "Deep neural networks",
        options: ["Deep", "Fast", "Light", "Shallow"],
        explanation: "Deep Learning refers to neural networks with deep stacks of hidden representation layers."
      }
    ]
  },

  'ch1-l2-c2': {
    title: "Artificial Neural Networks (ANN): Input, Hidden & Output Layers",
    lessonTitle: "How Artificial Intelligence Works",
    summary: "Structure of neural networks, interconnected nodes, weights, activation functions, and backpropagation optimization.",
    narration: "Artificial Neural Networks are computational architectures inspired by biological brain neurons. An ANN consists of three principal layers: first, the Input Layer which ingests raw data features. Second, one or more Hidden Layers that calculate weighted sums, apply non-linear mathematical activation functions, and extract deep features. Third, the Output Layer which produces final classifications or predictions. During training, the network adjusts its connection weights using an algorithm called Backpropagation.",
    simplifiedExplanation: "Imagine a team of detectives: the Input layer receives clues (pixels). The Hidden layers discover patterns (edges, eyes, noses). And the Output layer makes the final decision: 'This is a picture of a cat!'",
    aiPrompt: "Can you name the three basic layers found in an Artificial Neural Network?",
    contentCards: [
      {
        type: "concept",
        title: "Architecture of Artificial Neural Networks (Ministry Textbook p. 16):",
        points: [
          "📥 Input Layer: Receives raw numeric inputs (e.g. image pixels, sensor values).",
          "⚙️ Hidden Layers: Interconnected nodes calculate weighted sums (W · X + b) and apply non-linear Activation Functions.",
          "📤 Output Layer: Produces final probability distributions or classification outputs.",
          "🔄 Backpropagation: The mathematical mechanism that calculates errors and updates weights backward to optimize accuracy."
        ]
      },
      {
        type: "teacherTip",
        title: "💡 Exam Tip:",
        text: "Weights (W) and Biases (b) are the parameters adjusted during training. Activation functions introduce non-linearity so networks can learn complex curves!"
      }
    ],
    keyTerms: [
      {
        term: "Artificial Neural Network (ANN)",
        en: "Artificial Neural Network",
        definition: "A computing system constructed of interconnected nodes arranged in layers, designed to recognize complex patterns by mimicking biological neurons.",
        example: "A convolutional neural network recognizing whether a medical scan contains pneumonia.",
        examTip: "Composed of Input, Hidden, and Output layers."
      },
      {
        term: "Backpropagation",
        en: "Backpropagation",
        definition: "A gradient descent training algorithm that propagates error backwards from the output to update network weights and minimize loss.",
        example: "Adjusting dial knobs backwards when an audio system sounds distorted until the sound is crisp.",
        examTip: "The primary learning algorithm enabling deep neural network optimization."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which layer in an Artificial Neural Network receives raw external data without performing feature transformations?",
        options: ["Input Layer", "Hidden Layer", "Output Layer", "Loss Function Layer"],
        correctIndex: 0,
        explanation: "The Input Layer ingests raw incoming features into the network."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "What mathematical component enables artificial neural networks to learn non-linear, complex real-world relationships?",
        options: ["Activation Functions", "Cooling Fans", "Power cords", "Standard printers"],
        correctIndex: 0,
        explanation: "Activation functions (such as ReLU, Sigmoid) introduce non-linearity into node computations."
      },
      {
        id: "q2",
        level: "true_false",
        question: "In an ANN, the Hidden Layers are responsible for intermediate feature extraction and pattern recognition.",
        isTrue: true,
        explanation: "True; Hidden layers transform raw inputs into higher-level abstract feature representations."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Weights in a neural network remain permanently fixed from the moment the network is initialized and never change.",
        isTrue: false,
        explanation: "False; Weights are iteratively updated during training via backpropagation to minimize prediction errors."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The intermediate processing layers situated between input and output are called _____ Layers.",
        missingWord: "Hidden",
        hint: "Hidden from direct outside view",
        options: ["Hidden", "Static", "Terminal", "Physical"],
        explanation: "Hidden layers perform internal mathematical feature transformations."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The algorithm that calculates error gradients backward to adjust weights is _____.",
        missingWord: "Backpropagation",
        hint: "Propagates backward",
        options: ["Backpropagation", "Forwarding", "Duplication", "Compression"],
        explanation: "Backpropagation adjusts synaptic weights in reverse to minimize total network loss."
      }
    ]
  },

  'ch1-l2-c3': {
    title: "Generative AI, Hallucinations, and Verification",
    lessonTitle: "How Artificial Intelligence Works",
    summary: "Foundation models, probability-based text generation, AI hallucinations, and the necessity of human fact-checking.",
    narration: "Generative AI models, such as Large Language Models, generate responses by predicting the statistically most probable next word or token. Because they predict probabilities rather than verifying truth, they are prone to AI Hallucinations—producing fabricated statements that sound convincingly authoritative. Students must therefore always apply critical thinking and human fact-checking to any AI-generated output.",
    simplifiedExplanation: "AI is like a super-smart parrot: it sounds extremely confident and polite, but it doesn't actually understand what it says! If it doesn't know an answer, it might make up fake books or historical dates. You must always check facts yourself!",
    aiPrompt: "Why can Generative AI models generate false information with high confidence?",
    contentCards: [
      {
        type: "concept",
        title: "AI Hallucinations and Critical Verification (Ministry Textbook p. 19):",
        points: [
          "🎲 Probabilistic Nature: LLMs select words based on mathematical token probabilities, NOT real-world understanding.",
          "⚠️ AI Hallucination: Generating false, fabricated, or inaccurate facts with a confident, convincing tone.",
          "🔍 Human-in-the-Loop: The critical requirement that human experts review and verify AI outputs in medical, legal, and academic contexts.",
          "🛡️ Verification Habit: Always cross-reference AI factual claims against certified scientific textbooks and official databases."
        ]
      }
    ],
    keyTerms: [
      {
        term: "AI Hallucination",
        en: "AI Hallucination",
        definition: "A phenomenon where a generative AI model produces output that sounds fluent and plausible but is factually incorrect, nonsensical, or entirely fabricated.",
        example: "An AI model confidently inventing non-existent legal case precedents or false scientific citations.",
        examTip: "Caused because models optimize for plausible statistical text continuation rather than factual veracity."
      },
      {
        term: "Human-in-the-Loop",
        en: "Human-in-the-Loop",
        definition: "An operational model requiring human supervision and validation of automated AI outputs before decisions take effect.",
        example: "A human doctor reviewing an AI diagnosis before prescribing chemotherapy to a patient.",
        examTip: "Essential in high-stakes domains including medicine, criminal justice, and financial transactions."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "What term describes a generative AI system producing plausible-sounding but factually fabricated information?",
        options: ["AI Hallucination", "Computer Overclocking", "Hardware Bottleneck", "Quantum Superposition"],
        correctIndex: 0,
        explanation: "AI Hallucination refers to models generating confident falsehoods due to probabilistic token generation."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Why do Large Language Models (LLMs) occasionally hallucinate inaccurate facts?",
        options: [
          "Because they predict statistically probable word sequences rather than querying a verified truth database",
          "Because their internet cables are disconnected",
          "Because the computer monitor is turned off",
          "Because transistors double every two years"
        ],
        correctIndex: 0,
        explanation: "LLMs predict the most statistically probable next token, which can lead to plausible-sounding false statements."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Students can safely accept all AI-generated factual statements without needing to cross-check them against reliable sources.",
        isTrue: false,
        explanation: "False; AI outputs must always be critically audited and verified against trustworthy textbooks and authoritative sources."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Human-in-the-Loop ensures human specialists audit AI determinations in high-risk sectors like healthcare.",
        isTrue: true,
        explanation: "True; Human oversight safeguards against algorithmic errors, hallucinations, and harmful decisions."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "When an AI fabricates false facts with confident phrasing, it is experiencing an AI _____.",
        missingWord: "Hallucination",
        hint: "Pertains to synthetic delusion",
        options: ["Hallucination", "Acceleration", "Encryption", "Fragmentation"],
        explanation: "AI Hallucination denotes confident, plausible-sounding factual errors produced by LLMs."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Requiring human supervision before deploying AI decisions is called Human-in-the-_____.",
        missingWord: "Loop",
        hint: "Loop (cycle)",
        options: ["Loop", "Screen", "Box", "Cloud"],
        explanation: "Human-in-the-Loop ensures meaningful human governance over algorithmic workflows."
      }
    ]
  },

  'ch1-l2-exam': {
    title: "🏆 Final Challenge: Lesson (1-2) Mastery Exam",
    lessonTitle: "How Artificial Intelligence Works",
    summary: "Comprehensive exam on machine learning, neural networks, and generative models.",
    narration: "Welcome to the Lesson 1-2 Mastery Challenge! Test your deep understanding of neural networks, machine learning paradigms, and generative AI to claim your trophy!",
    examQuestions: [
      {
        question: "Which of the following represents the correct nested hierarchy from broadest to most specific?",
        options: [
          "Artificial Intelligence → Machine Learning → Deep Learning → Generative AI",
          "Generative AI → Deep Learning → Machine Learning → Artificial Intelligence",
          "Machine Learning → Artificial Intelligence → Generative AI → Deep Learning",
          "Deep Learning → Machine Learning → Artificial Intelligence → Algorithms"
        ],
        correctIndex: 0,
        explanation: "AI is the parent discipline, ML is its data-driven subset, DL uses deep neural nets, and GenAI is a generative application."
      },
      {
        question: "In an Artificial Neural Network, which layer is responsible for calculating weighted sums and feature transformations?",
        options: ["Input Layer", "Hidden Layer(s)", "Power Supply", "Operating System"],
        correctIndex: 1,
        explanation: "Hidden layers extract abstract hierarchical representations using weighted connections and activation functions."
      },
      {
        question: "What algorithm updates connection weights backwards to minimize prediction errors during training?",
        options: ["Backpropagation", "Bubble Sort", "Data Hashing", "Video Rendering"],
        correctIndex: 0,
        explanation: "Backpropagation calculates loss gradients and updates neural weights in reverse order."
      },
      {
        question: "What causes Generative AI to produce 'hallucinations'?",
        options: [
          "It generates outputs by predicting statistically likely word tokens rather than understanding factual truth",
          "The computer processor runs too cold",
          "The user types too quickly",
          "The computer memory is completely full"
        ],
        correctIndex: 0,
        explanation: "Statistical token probability optimization does not inherently guarantee real-world factual correctness."
      },
      {
        question: "What is the role of an Activation Function in an artificial neuron?",
        options: [
          "To introduce mathematical non-linearity so the network can learn complex patterns",
          "To physically turn off the computer",
          "To speed up internet broadband connections",
          "To compress PDF documents"
        ],
        correctIndex: 0,
        explanation: "Activation functions introduce non-linear mapping, enabling neural networks to approximate complex real-world functions."
      }
    ]
  },

  // ==========================================
  // Lesson 1-3: AI in Daily Life and Industry
  // ==========================================
  'ch1-l3-c1': {
    title: "AI in Healthcare, Personalized Medicine & Adaptive Learning",
    lessonTitle: "AI in Daily Life and Industry",
    summary: "Medical image diagnostics, drug discovery, and adaptive learning platforms tailoring education to student pace.",
    narration: "Artificial intelligence has transformed healthcare and education: In medicine, AI models analyze radiographic imagery (X-rays, MRIs, and CT scans) to detect early-stage oncological tumors with remarkable diagnostic accuracy, and accelerate drug discovery from decades to months. In education, intelligent adaptive learning platforms track individual student progress and dynamically calibrate lesson difficulty.",
    simplifiedExplanation: "In hospitals, AI acts like a super-radiologist spotting tiny tumors doctors might miss, and invents new medicines. In school, AI platforms act like a private tutor that explains concepts slower or faster depending on what you need!",
    aiPrompt: "How does AI support physicians in medical image diagnosis?",
    contentCards: [
      {
        type: "concept",
        title: "AI in Healthcare and Education (Ministry Textbook p. 22):",
        points: [
          "🩺 Medical Imaging: Computer vision algorithms detect tumors, fractures, and retinal diseases at early stages.",
          "💊 Accelerated Drug Discovery: AI analyzes protein folding and molecular bonding, reducing pharmaceutical trial timelines.",
          "🎓 Adaptive Learning: Algorithms evaluate learner strengths/weaknesses and deliver customized educational pathways.",
          "🤖 24/7 Educational Guidance: Intelligent tutoring systems that provide immediate formative feedback on homework."
        ]
      }
    ],
    keyTerms: [
      {
        term: "Adaptive Learning",
        en: "Adaptive Learning",
        definition: "An educational method that uses computer algorithms and AI to orchestrate interactive learning experiences tailored to unique student needs.",
        example: "A learning platform that automatically serves easier practice questions if a student struggles, or advances to boss challenges if they master the topic.",
        examTip: "Personalizes instructional pace, path, and practice based on continuous formative evaluation."
      },
      {
        term: "Computer-Aided Diagnosis (CAD)",
        en: "Computer-Aided Diagnosis",
        definition: "The application of AI and machine learning to assist healthcare professionals in interpreting medical diagnostic imagery.",
        example: "AI detecting micro-calcifications in mammography scans to alert radiologists to potential early breast cancer.",
        examTip: "Acts as a supportive decision tool; it assists rather than entirely replaces human doctors."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "How does AI primarily assist radiologists in hospital imaging departments?",
        options: [
          "By analyzing radiographic images (X-rays and MRIs) to identify anomalies and tumors with high precision",
          "By manufacturing hospital beds",
          "By driving ambulances through traffic",
          "By printing prescription receipts"
        ],
        correctIndex: 0,
        explanation: "Computer vision systems analyze medical scans to flag anomalies, assisting doctors in rapid and accurate diagnosis."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "An educational platform that adjusts lesson difficulty dynamically according to each student's mastery level utilizes:",
        options: ["Adaptive Learning", "Static Printing", "Manual Filing", "Audio Amplification"],
        correctIndex: 0,
        explanation: "Adaptive learning uses AI algorithms to personalize educational trajectories based on individual learner performance."
      },
      {
        id: "q2",
        level: "true_false",
        question: "AI algorithms in drug discovery can simulate molecular interactions, significantly reducing development timelines.",
        isTrue: true,
        explanation: "True; AI predicts molecular bonding and protein structures, expediting pharmaceutical research."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "AI diagnostic systems are intended to operate completely autonomously without any final medical review by licensed doctors.",
        isTrue: false,
        explanation: "False; Medical AI systems serve as diagnostic assistive aids under the ultimate clinical supervision of physicians."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Education systems that dynamically adjust instruction to individual learner pace are called _____ Learning.",
        missingWord: "Adaptive",
        hint: "Adapts dynamically",
        options: ["Adaptive", "Static", "Linear", "Passive"],
        explanation: "Adaptive learning tailors educational pacing and content based on student data."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Using AI to assist physicians in reading medical radiology scans is Computer-Aided _____.",
        missingWord: "Diagnosis",
        hint: "Diagnosis / CAD",
        options: ["Diagnosis", "Surgery", "Billing", "Shipping"],
        explanation: "Computer-Aided Diagnosis aids radiologists in spotting pathological abnormalities."
      }
    ]
  },

  'ch1-l3-c2': {
    title: "Predictive Maintenance, Smart Manufacturing & Smart Cities",
    lessonTitle: "AI in Daily Life and Industry",
    summary: "Industrial IoT sensors, predictive equipment maintenance, intelligent traffic grid management, and energy efficiency in smart cities.",
    narration: "In industrial and urban domains, AI enables Predictive Maintenance: IoT sensors continuously monitor vibration, temperature, and wear on industrial machines, allowing AI to forecast component failures before breakdowns occur. In Smart Cities, AI optimizes dynamic traffic light signaling to alleviate urban congestion, and manages power grids to minimize carbon emissions.",
    simplifiedExplanation: "Imagine your car's engine having an AI doctor listening to its vibrations: it tells you 'Your water pump will break down in 3 weeks, replace it now!' That's Predictive Maintenance. In smart cities, AI watches traffic cameras and turns green lights on where cars are waiting!",
    aiPrompt: "Why is predictive maintenance more cost-effective than reactive breakdown repairs?",
    contentCards: [
      {
        type: "concept",
        title: "AI in Industry and Smart Cities (Ministry Textbook p. 25):",
        points: [
          "🏭 Predictive Maintenance: Machine learning analyzes vibration/thermal sensor streams to anticipate equipment failure.",
          "🚦 Intelligent Traffic Management: Real-time computer vision balances traffic light durations to reduce urban gridlock.",
          "⚡ Smart Energy Grids: AI forecasts peak electricity demands and balances distribution from renewable sources.",
          "📦 Supply Chain Optimization: Autonomous automated inventory management and predictive delivery logistics."
        ]
      }
    ],
    keyTerms: [
      {
        term: "Predictive Maintenance",
        en: "Predictive Maintenance",
        definition: "A proactive maintenance strategy using data analytics, IoT sensors, and machine learning to predict when mechanical assets require servicing before failures occur.",
        example: "A factory robot arm equipped with vibration sensors that alerts engineers 10 days before a bearing fails.",
        examTip: "Contrasts with reactive maintenance (fixing after failure) and preventive maintenance (fixed calendar schedules)."
      },
      {
        term: "Smart City",
        en: "Smart City",
        definition: "An urban municipality that leverages IoT sensors, communications networks, and AI to optimize municipal services, transportation, and utility consumption.",
        example: "Dynamic street lighting that dims when streets are empty and brightens when pedestrians approach.",
        examTip: "Aims to enhance urban quality of life, environmental sustainability, and operational efficiency."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "What maintenance strategy monitors IoT sensor data to repair machinery right before a failure occurs rather than after it breaks down?",
        options: ["Predictive Maintenance", "Reactive Emergency Repair", "Manual Inspection", "System Decommissioning"],
        correctIndex: 0,
        explanation: "Predictive maintenance anticipates machinery failures based on real-time sensor metrics."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "How do Smart Cities utilize AI to optimize urban traffic flow?",
        options: [
          "By analyzing camera feeds in real time to adjust traffic light durations dynamically",
          "By closing all city bridges permanently",
          "By banning all commercial vehicles",
          "By replacing paved roads with dirt trails"
        ],
        correctIndex: 0,
        explanation: "Smart traffic management systems analyze congestion levels in real time to dynamically adjust traffic light cycles."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Predictive maintenance results in higher unexpected downtime compared to traditional reactive repair methods.",
        isTrue: false,
        explanation: "False; Predictive maintenance drastically reduces unexpected operational downtime by fixing issues before failures occur."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Smart power grids use machine learning to forecast electricity consumption and balance renewable energy distribution.",
        isTrue: true,
        explanation: "True; AI balances power generation and grid loads to prevent blackouts and optimize renewable integration."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Analyzing vibration and temperature sensor data to service machines prior to failure is _____ Maintenance.",
        missingWord: "Predictive",
        hint: "Predicts failures",
        options: ["Predictive", "Reactive", "Random", "Delayed"],
        explanation: "Predictive maintenance leverages data-driven forecasts to schedule servicing proactively."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "An urban area using connected sensors and AI algorithms to manage utilities and traffic is a _____ City.",
        missingWord: "Smart",
        hint: "Smart ...",
        options: ["Smart", "Dormant", "Rural", "Isolated"],
        explanation: "A Smart City leverages digital connectivity and AI to optimize urban life."
      }
    ]
  },

  'ch1-l3-exam': {
    title: "🏆 Final Challenge: Lesson (1-3) Mastery Exam",
    lessonTitle: "AI in Daily Life and Industry",
    summary: "Comprehensive exam covering AI in healthcare, education, smart manufacturing, and smart cities.",
    narration: "You have reached the Lesson 1-3 Mastery Exam! Show your expertise in industrial AI applications, healthcare technologies, and smart city infrastructure to earn your gold trophy!",
    examQuestions: [
      {
        question: "What is the primary operational advantage of Predictive Maintenance over reactive breakdown repair?",
        options: [
          "It predicts equipment failures ahead of time, preventing costly unexpected downtime",
          "It guarantees machines will never consume electricity",
          "It eliminates the need for software updates",
          "It relies entirely on paper records"
        ],
        correctIndex: 0,
        explanation: "Predictive maintenance uses IoT sensors and machine learning to service parts before catastrophic failures occur."
      },
      {
        question: "How does an Adaptive Learning platform improve educational outcomes?",
        options: [
          "By adjusting lesson difficulty and pacing dynamically based on each student's demonstrated mastery",
          "By forcing all students to read at the exact same fixed speed",
          "By turning off the computer after 10 minutes",
          "By removing all quizzes and assessments"
        ],
        correctIndex: 0,
        explanation: "Adaptive learning tailors content, remediation, and challenges to individual learner comprehension."
      },
      {
        question: "Which of the following illustrates AI implementation in smart municipal infrastructure?",
        options: [
          "Real-time computer vision adjusting traffic signals to clear traffic bottlenecks",
          "Replacing street lights with candles",
          "Closing subway stations during rush hour",
          "Sending paper letters to announce weather forecasts"
        ],
        correctIndex: 0,
        explanation: "Smart traffic signal orchestration dynamically responds to congestion data collected across city intersections."
      },
      {
        question: "In pharmaceutical medicine, how does AI accelerate drug discovery?",
        options: [
          "By predicting molecular bonding and simulating protein structures at massive scale",
          "By physically delivering medicine packages to patients' homes",
          "By manufacturing glass bottles for pills",
          "By printing paper advertisements for pharmacies"
        ],
        correctIndex: 0,
        explanation: "AI models predict bio-molecular affinity and candidate effectiveness, compressing research timelines from years to months."
      },
      {
        question: "What hardware component feeds real-time vibration and temperature data into industrial predictive maintenance models?",
        options: ["IoT Sensors", "Laser printers", "Sound cards", "Floppy disks"],
        correctIndex: 0,
        explanation: "Internet of Things (IoT) sensors continuously capture operational vibration and thermal metrics from industrial assets."
      }
    ]
  },

  // ==========================================
  // Lesson 1-4: AI Ethics and Governance
  // ==========================================
  'ch1-l4-c1': {
    title: "Algorithmic Bias, Fairness & Accountability",
    lessonTitle: "AI Ethics and Governance",
    summary: "Historical training data biases, algorithmic discrimination, model explainability (XAI), and algorithmic accountability.",
    narration: "Because artificial intelligence learns from human-generated historical data, it can absorb, amplify, and perpetuate systemic social prejudices—a dilemma known as Algorithmic Bias. If a loan assessment or hiring algorithm is trained on biased historical records, it will discriminate against certain demographic groups. Ethical AI mandates Fairness, Accountability, and Explainability (XAI) so human stakeholders understand how decisions are reached.",
    simplifiedExplanation: "If an AI learns who gets hired by reading 50-year-old old-fashioned resumes, it might wrongly assume only certain people can be engineers! That is Algorithmic Bias. We must teach AI to be fair, unbiased, and transparent!",
    aiPrompt: "Why does an AI model become biased if its training data contains historical human prejudices?",
    contentCards: [
      {
        type: "concept",
        title: "Ethical AI Pillars (Ministry Textbook p. 28):",
        points: [
          "⚖️ Algorithmic Bias: Systematic discrimination occurring when models train on skewed or non-representative historical datasets.",
          "🔍 Explainability (XAI): The ability to explain the internal mathematical reasoning of an AI model in human-understandable terms.",
          "🛡️ Accountability: Identifying which individuals or corporate entities bear legal and ethical responsibility for AI harms.",
          "🔒 Privacy: Protecting personal training data against unauthorized extraction and surveillance."
        ]
      }
    ],
    keyTerms: [
      {
        term: "Algorithmic Bias",
        en: "Algorithmic Bias",
        definition: "Systematic, repeatable errors in a computer system that generate unfair outcomes, such as privileging one demographic category over others.",
        example: "A facial recognition model with high error rates on dark-skinned faces because training images mostly contained fair-skinned faces.",
        examTip: "Originates primarily from unrepresentative, skewed, or historically prejudiced training data."
      },
      {
        term: "Explainable AI (XAI)",
        en: "Explainable AI",
        definition: "Artificial intelligence systems whose actions and decision-making processes can be easily understood and interpreted by human experts.",
        example: "A banking AI explaining: 'Loan denied because debt-to-income ratio exceeds 45%', rather than functioning as an opaque black box.",
        examTip: "Essential for regulatory compliance, transparency, and building institutional trust."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "What is the primary root cause of algorithmic bias appearing in trained AI systems?",
        options: [
          "Training the model on historical datasets that contain human prejudices or unrepresentative demographic samples",
          "Computer processors overheating during training",
          "Using fiber optic cables",
          "Writing code in modern programming languages"
        ],
        correctIndex: 0,
        explanation: "AI learns patterns from data; if the historical training data reflects social disparities or bias, the model reproduces them."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "The field of AI focused on making complex model decisions transparent and understandable to human operators is called:",
        options: ["Explainable AI (XAI)", "Black-Box Computing", "Unsupervised Cryptography", "Quantum Entanglement"],
        correctIndex: 0,
        explanation: "Explainable AI (XAI) ensures algorithmic reasoning can be interpreted and inspected by humans."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Because AI relies on mathematics, computer algorithms are automatically guaranteed to be 100% immune to human prejudices.",
        isTrue: false,
        explanation: "False; Algorithms inherit and frequently amplify the prejudices embedded in their training data."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Explainability in AI helps identify algorithmic errors and gives citizens the right to understand automated decisions affecting their lives.",
        isTrue: true,
        explanation: "True; Explainability fosters accountability and allows individuals to contest arbitrary automated rulings."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Systematic unfair discrimination generated by an AI model is Algorithmic _____.",
        missingWord: "Bias",
        hint: "Bias / Prejudice",
        options: ["Bias", "Speed", "Depth", "Power"],
        explanation: "Algorithmic bias produces unfair, discriminatory outputs across demographic groups."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "AI systems whose inner reasoning can be explained to humans are called _____ AI.",
        missingWord: "Explainable",
        hint: "Explainable / XAI",
        options: ["Explainable", "Invisible", "Obscure", "Encrypted"],
        explanation: "Explainable AI (XAI) provides human-interpretable rationales for machine decisions."
      }
    ]
  },

  'ch1-l4-c2': {
    title: "AI Governance, Regulations & The AI Act",
    lessonTitle: "AI Ethics and Governance",
    summary: "Risk-based regulatory frameworks, prohibited AI practices, high-risk categories, and international data governance.",
    narration: "To prevent technological abuses, global governments and international institutions have enacted rigorous AI Governance frameworks, such as the European Union's Artificial Intelligence Act (AI Act). These regulations categorize AI deployments into distinct risk tiers: Unacceptable Risk systems (like biometric social scoring) which are strictly outlawed, High-Risk systems (in healthcare, policing, and employment) requiring strict audits and data controls, and Low-Risk systems requiring basic transparency.",
    simplifiedExplanation: "Just like traffic laws have red lights and speed limits to prevent car crashes, AI laws have rules: Dangerous AI (like mass government spying) is banned completely, while sensitive AI (like hospital robots) must pass rigorous safety inspections before use!",
    aiPrompt: "Can you name the risk tiers established by modern AI regulatory frameworks like the EU AI Act?",
    contentCards: [
      {
        type: "concept",
        title: "Risk-Based AI Governance (Ministry Textbook p. 31):",
        points: [
          "🚫 Unacceptable Risk: Strictly banned applications, including cognitive behavioral manipulation and mass biometric social scoring.",
          "⚠️ High Risk: Permitted under strict audits, transparency, and human oversight (e.g. CV screening, credit evaluation, medical robots).",
          "ℹ️ Limited/Low Risk: Subject to basic transparency obligations (e.g. informing users they are interacting with a chatbot).",
          "🌐 Global Compliance: Requires companies to perform risk impact assessments and adhere to data protection mandates."
        ]
      }
    ],
    keyTerms: [
      {
        term: "AI Governance",
        en: "AI Governance",
        definition: "The framework of legal regulations, institutional policies, and technical standards that guide the ethical development and deployment of AI.",
        example: "The European Union AI Act establishing strict compliance criteria for high-risk machine learning systems.",
        examTip: "Categorizes systems into risk tiers: Unacceptable (banned), High Risk (audited), and Low Risk."
      },
      {
        term: "Social Scoring",
        en: "Social Scoring",
        definition: "The mass governmental or corporate surveillance and ranking of citizens' behavior to grant or revoke social rights.",
        example: "Deducting civic points for minor infractions and barring low-score citizens from train travel.",
        examTip: "Classified under modern AI regulatory acts as an 'Unacceptable Risk' and prohibited."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "In modern AI regulatory legislation (such as the EU AI Act), biometric social credit scoring by governments is classified as:",
        options: ["Unacceptable Risk (Strictly Prohibited)", "Low Risk", "Mandatory practice", "Open Source Hobby"],
        correctIndex: 0,
        explanation: "Social scoring violates fundamental human rights and is strictly outlawed as an Unacceptable Risk."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "AI applications in medical diagnostics, employment candidate screening, and critical infrastructure fall under which regulatory tier?",
        options: ["High-Risk Systems (Requiring audits & oversight)", "Unacceptable Risk (Banned)", "Zero-Risk Toys", "Non-digital tools"],
        correctIndex: 0,
        explanation: "High-risk AI applications are permitted only under strict algorithmic auditing, bias checks, and human oversight."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Chatbots and synthetic voice generators must inform human users that they are conversing with an AI system.",
        isTrue: true,
        explanation: "True; Transparency obligations require disclosing synthetic AI interactions to users."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "AI governance laws completely ban all development of artificial intelligence worldwide.",
        isTrue: false,
        explanation: "False; Regulations balance innovation with safety, placing strict controls only where high human harm exists."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Mass evaluation and ranking of citizens by governments using AI is termed Social _____.",
        missingWord: "Scoring",
        hint: "Scoring / Ranking",
        options: ["Scoring", "Sharing", "Networking", "Browsing"],
        explanation: "Social scoring classifies citizens by behavior and is banned under modern ethical AI frameworks."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The comprehensive European legal framework regulating artificial intelligence is the AI _____.",
        missingWord: "Act",
        hint: "Act / Regulation",
        options: ["Act", "Card", "Link", "Chip"],
        explanation: "The EU AI Act is the landmark global regulatory framework for artificial intelligence."
      }
    ]
  },

  'ch1-l4-exam': {
    title: "🏆 Final Challenge: Lesson (1-4) Mastery Exam",
    lessonTitle: "AI Ethics and Governance",
    summary: "Comprehensive exam testing AI ethics, algorithmic bias, explainability, and regulatory governance.",
    narration: "Welcome to the Lesson 1-4 Mastery Challenge! Conclude Chapter 1 by proving your knowledge of AI ethics, fairness, and global governance regulations!",
    examQuestions: [
      {
        question: "Why do AI algorithms exhibit algorithmic bias?",
        options: [
          "Because they are trained on historical data containing unrepresentative demographic distributions and human prejudices",
          "Because the computer monitor has low resolution",
          "Because the keyboard was manufactured overseas",
          "Because the algorithm uses too much RAM"
        ],
        correctIndex: 0,
        explanation: "Biased, skewed, or historically discriminatory training data causes algorithms to reproduce those inequities."
      },
      {
        question: "Explainable AI (XAI) is vital in automated banking loan decisions because:",
        options: [
          "It allows human reviewers and applicants to understand the factual reasoning behind an approval or rejection",
          "It makes the computer run 10 times faster",
          "It replaces the need for internet connectivity",
          "It allows anyone to modify the bank's database"
        ],
        correctIndex: 0,
        explanation: "Explainability guarantees transparency, accountability, and the ability to audit automated decisions."
      },
      {
        question: "Under risk-based AI regulatory frameworks, mass social scoring of citizens by governments is classified as:",
        options: ["Unacceptable Risk (Prohibited)", "Low Risk", "Mandatory standard", "Encouraged innovation"],
        correctIndex: 0,
        explanation: "Mass social scoring severely infringes on human liberties and is banned as an Unacceptable Risk."
      },
      {
        question: "What does the 'Human-in-the-Loop' ethical principle require in high-stakes clinical AI deployments?",
        options: [
          "Qualified human healthcare professionals must review and approve diagnostic recommendations before treatment",
          "Patients must build their own computer hardware",
          "Doctors must never consult computers under any circumstances",
          "Hospitals must eliminate all electronic databases"
        ],
        correctIndex: 0,
        explanation: "Human-in-the-loop ensures ultimate professional responsibility and safety oversight remain with human experts."
      },
      {
        question: "What transparency obligation applies to commercial generative chatbots?",
        options: [
          "Users must be clearly informed that they are communicating with an artificial intelligence system",
          "Users must pay cash for every single word generated",
          "Chatbots must conceal their artificial nature at all costs",
          "Chatbots can only operate during daytime hours"
        ],
        correctIndex: 0,
        explanation: "Transparency mandates ensure citizens are never deceived into believing an AI bot is a biological human."
      }
    ]
  }
};
