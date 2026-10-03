/**
 * Chapter 4 English Curriculum Data:
 * Web Design & Media (تصميم الويب والوسائط)
 * Lessons 4-1, 4-2, 4-3, 4-4
 */

module.exports = {
  // ==========================================
  // Lesson 4-1: Media Characteristics & Digital Optimization
  // ==========================================
  'ch4-l1-c1': {
    title: "Media Characteristics: One-Way vs Two-Way Communication",
    lessonTitle: "Media Characteristics & Digital Optimization",
    summary: "Sensory affordances of digital media (Text, Audio, Images, Video) and distinguishing traditional one-way broadcast from interactive two-way web communication.",
    narration: "Welcome to Chapter 4 on Web Design and Media! Digital communication uses distinct media types: Text is lightweight and precise for official documentation. Images convey immediate emotional impact. Audio conveys tone without visual distraction. And Video is the richest and most engaging medium, combining imagery, motion, and sound. Unlike traditional One-Way broadcast media (like TV and print newspapers), modern web platforms deliver interactive Two-Way communication where visitors provide real-time feedback.",
    simplifiedExplanation: "Think about TV: the news anchor talks, and you can't talk back—that is One-Way communication. But on the web, you read an article, leave a comment, like, and share—that is interactive Two-Way communication!",
    aiPrompt: "Can you distinguish between one-way broadcast media and interactive two-way web communication?",
    contentCards: [
      {
        type: "concept",
        title: "Comparison of Digital Media Characteristics (Ministry Textbook p. 84):",
        points: [
          "📄 Text: Precise, searchable, highly compressed, ideal for formal instructions and legal terms.",
          "🖼️ Images: 'A picture is worth a thousand words'; delivers instantaneous visual and emotional engagement.",
          "🎙️ Audio: Ideal for multitasking (driving, cooking); communicates tone of voice without visual overload.",
          "🎬 Video: The richest media format; integrates visual motion, narration, and sound for maximum retention."
        ]
      }
    ],
    keyTerms: [
      {
        term: "One-way Communication",
        en: "One-way Communication",
        definition: "A linear communication model where information flows strictly from the sender to the audience with no immediate feedback loop.",
        example: "Traditional terrestrial television broadcasts, AM/FM radio, and printed magazines.",
        examTip: "Exam question: Traditional TV is one-way broadcast, whereas websites are interactive two-way channels."
      },
      {
        term: "Two-way Communication",
        en: "Two-way Communication",
        definition: "An interactive communication process where sender and receiver dynamically exchange messages, feedback, and collaborative reactions.",
        example: "Social media commenting threads, interactive web applications, and live chat platforms.",
        examTip: "The defining operational paradigm of modern web platforms and social services."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which of the following exemplifies traditional 'One-Way Communication'?",
        options: [
          "An interactive post on Facebook",
          "Traditional terrestrial television news broadcast",
          "A live Zoom video conference",
          "An online e-commerce shopping website"
        ],
        correctIndex: 1,
        explanation: "Traditional TV broadcasts transmit signals unidirectionally from the studio to passive viewers without direct feedback."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Which digital medium is considered the richest and most engaging because it combines visual imagery, motion, and audio?",
        options: ["Digital Video", "Plain text only", "A single audio beep", "A static photograph"],
        correctIndex: 0,
        explanation: "Digital video stimulates multiple sensory channels simultaneously, maximizing engagement and retention."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Modern websites and social networks are characterized by interactive, two-way communication.",
        isTrue: true,
        explanation: "True; Receivers can respond, comment, share, and interact with web publishers in real time."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Written text is completely useless in the digital era and should be entirely replaced by video files everywhere.",
        isTrue: false,
        explanation: "False; Text remains indispensable for search indexing, legal accuracy, accessibility, and documentation."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Communication where information flows in a single direction without recipient feedback is _____ Communication.",
        missingWord: "One-way",
        hint: "One-way",
        options: ["One-way", "Two-way", "Multi-way", "Wireless"],
        explanation: "One-way communication transmits messages linearly without an interactive feedback mechanism."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Interactive dialogue where sender and receiver continuously exchange responses is _____ Communication.",
        missingWord: "Two-way",
        hint: "Two-way",
        options: ["Two-way", "One-way", "Silent", "Analog"],
        explanation: "Two-way communication powers the interactive feedback loops of the modern web."
      }
    ]
  },

  'ch4-l1-c2': {
    title: "Vector vs Bitmap Graphics & Data Compression Techniques",
    lessonTitle: "Media Characteristics & Digital Optimization",
    summary: "Resolution-independent Vector graphics (SVG) vs pixel-based Bitmaps (JPEG, PNG), and Lossy vs Lossless data compression algorithms.",
    narration: "Web graphics fall into two fundamental categories: Bitmap (Raster) images, composed of a fixed grid of colored pixels—such as JPEG for photographs and PNG for transparent graphics. Scaling bitmaps causes pixelation. In contrast, Vector graphics (like SVG) use mathematical equations (points, curves, and vectors) to draw shapes, allowing infinite scaling without ever losing sharpness. To accelerate web page loading, developers use Lossless compression (like PNG/ZIP) to preserve every byte, or Lossy compression (like JPEG/MP3) to discard imperceptible data for massive file size reductions.",
    simplifiedExplanation: "Bitmap is like a mosaic of tiny colored tiles: if you zoom in close, you see blurry square blocks! Vector is like a mathematical blueprint: whether printed on a postage stamp or a skyscraper billboard, its lines stay razor sharp! Lossy compression throws away tiny details your eyes won't miss to make files 10 times smaller!",
    aiPrompt: "Why are vector SVG graphics superior to bitmap images for company logos and icons?",
    contentCards: [
      {
        type: "concept",
        title: "Graphics Formats & Compression (Ministry Textbook p. 88):",
        points: [
          "🖼️ Bitmap (Raster): Pixel grid (JPEG, PNG, GIF). Realistic photographic color gradients; loses quality when scaled up.",
          "📐 Vector Graphics: Mathematical coordinate formulas (SVG). Infinitely scalable with zero quality loss; ideal for logos and icons.",
          "📦 Lossless Compression: Reduces file size while perfectly preserving 100% of original data (PNG, ZIP, FLAC).",
          "✂️ Lossy Compression: Permanently discards redundant perceptual data for dramatic file size compression (JPEG, MP3, MP4)."
        ]
      }
    ],
    keyTerms: [
      {
        term: "Vector Graphics",
        en: "Vector Graphics",
        definition: "Digital imagery created from geometric primitives (points, lines, curves, and polygons) defined by mathematical formulas rather than a grid of pixels.",
        example: "An SVG company logo that scales crisply from a tiny smartwatch screen to a giant stadium billboard.",
        examTip: "Resolution-independent; never pixelates or loses sharpness upon magnification."
      },
      {
        term: "Lossy vs Lossless Compression",
        en: "Lossy vs Lossless",
        definition: "Lossless compression reconstructs the original data perfectly without loss. Lossy compression discards less perceptible details to achieve much smaller file sizes.",
        example: "PNG uses lossless compression for sharp diagrams; JPEG uses lossy compression for compact web photos.",
        examTip: "Lossy is ideal for web media where bandwidth savings outweigh imperceptible data loss."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which graphics format uses mathematical formulas allowing illustrations and logos to scale infinitely without pixelation?",
        options: ["Vector Graphics (e.g. SVG)", "Bitmap (Raster) Graphics (e.g. BMP)", "Analog Film", "Thermal Paper"],
        correctIndex: 0,
        explanation: "Vector graphics use mathematical geometry to maintain perfect sharpness at any scale."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Which compression type discards imperceptible perceptual audio or visual data to achieve dramatic file size reduction?",
        options: ["Lossy Compression", "Lossless Compression", "Zero Compression", "Binary Inversion"],
        correctIndex: 0,
        explanation: "Lossy algorithms (like JPEG and MP3) discard unneeded perceptual data for substantial size reduction."
      },
      {
        id: "q2",
        level: "true_false",
        question: "When a raster bitmap image (like a JPEG) is significantly enlarged, it becomes pixelated and blurry.",
        isTrue: true,
        explanation: "True; Bitmaps have a fixed pixel resolution; zooming in exposes the individual pixel blocks."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Lossless compression permanently erases 50% of the original pixels to save hard drive space.",
        isTrue: false,
        explanation: "False; Lossless compression preserves 100% of original data with zero quality loss."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Graphics built from mathematical curves that never pixelate when scaled are _____ Graphics.",
        missingWord: "Vector",
        hint: "Vector / Geometric",
        options: ["Vector", "Raster", "Pixel", "Bitmap"],
        explanation: "Vector graphics use coordinate math to remain resolution-independent."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Data compression that reconstructs the original file with zero data loss is _____ Compression.",
        missingWord: "Lossless",
        hint: "Without loss",
        options: ["Lossless", "Lossy", "Destructive", "Fragmented"],
        explanation: "Lossless compression guarantees full mathematical data integrity upon decompression."
      }
    ]
  },

  'ch4-l1-exam': {
    title: "🏆 Final Challenge: Lesson (4-1) Mastery Exam",
    lessonTitle: "Media Characteristics & Digital Optimization",
    summary: "Comprehensive exam testing digital media characteristics, vector vs bitmap graphics, and compression formats.",
    narration: "Welcome to the Lesson 4-1 Mastery Challenge! Test your knowledge of media affordances, vector mathematics, and audio-video compression codecs to earn your gold trophy!",
    examQuestions: [
      {
        question: "What is the primary technical distinction between Vector and Bitmap graphics?",
        options: [
          "Vector graphics use mathematical geometry and scale infinitely without quality loss; Bitmaps use fixed pixel grids that pixelate when scaled",
          "Bitmaps can only be viewed in black and white",
          "Vector graphics can only be printed on paper and cannot be displayed on screens",
          "Bitmaps require zero file storage space"
        ],
        correctIndex: 0,
        explanation: "Vector formats use scalable mathematical equations, whereas Bitmaps are constrained by fixed pixel dimensions."
      },
      {
        question: "Why do web developers use Lossy compression for photographic content on websites?",
        options: [
          "It dramatically reduces file size and accelerates page load times while preserving acceptable visual quality",
          "It permanently disables all website hyperlinks",
          "It increases the battery life of the web server",
          "It prevents users from taking screenshots"
        ],
        correctIndex: 0,
        explanation: "Lossy compression strikes an optimal balance between fast bandwidth transmission and human perceptual quality."
      },
      {
        question: "Which of the following is an example of an interactive Two-Way communication medium?",
        options: ["A collaborative social media platform or web discussion forum", "A printed billboard banner", "An FM radio musical broadcast", "A printed sales receipt"],
        correctIndex: 0,
        explanation: "Interactive social forums permit audiences to actively participate and submit instant feedback."
      },
      {
        question: "Which image format supports vector scalability and is widely used for web icons and logos?",
        options: ["SVG", "BMP", "TIFF", "RAW"],
        correctIndex: 0,
        explanation: "SVG (Scalable Vector Graphics) is the standard XML-based vector format for modern web browsers."
      },
      {
        question: "Which compression format preserves 100% of image pixel fidelity and supports transparent backgrounds?",
        options: ["PNG", "JPEG", "MP3", "MPEG"],
        correctIndex: 0,
        explanation: "PNG utilizes lossless deflate compression and features an alpha channel for clean image transparency."
      }
    ]
  },

  // ==========================================
  // Lesson 4-2: User Persona & Information Architecture
  // ==========================================
  'ch4-l2-c1': {
    title: "User Persona, Information Architecture & CRAP Principles",
    lessonTitle: "User Persona & Information Architecture",
    summary: "Crafting realistic User Personas (demographics, motivations, pain points), structuring intuitive Information Architecture, and the CRAP design foundation.",
    narration: "Great web design begins with empathy: Designers construct a User Persona—a research-backed semi-fictional archetype representing the target audience's demographics, professional motivations, and technical pain points. Next, designers organize Information Architecture: structuring navigation menus and hierarchical content so users locate answers effortlessly. Visual layout is governed by the four CRAP principles: Contrast, Repetition, Alignment, and Proximity.",
    simplifiedExplanation: "Imagine designing a toy app: You don't design for yourself; you design for 'Little Adam, 7 years old, can't read long words, loves big bright buttons!' That is a User Persona. Information architecture is organizing the toy store shelves so games are easy to find!",
    aiPrompt: "How does creating a User Persona prevent designers from building self-centered websites?",
    contentCards: [
      {
        type: "concept",
        title: "User Personas and Information Architecture (Ministry Textbook p. 92):",
        points: [
          "👤 User Persona: A detailed fictional user profile representing a key audience segment (Goals, Frustrations, Behaviors).",
          "🗺️ Information Architecture (IA): The structural organization, labeling, and categorization of website content.",
          "🎨 CRAP Principles: The four core visual design rules: Contrast, Repetition, Alignment, and Proximity."
        ]
      }
    ],
    keyTerms: [
      {
        term: "User Persona",
        en: "User Persona",
        definition: "A realistic, research-based archetype representing the needs, goals, behaviors, and pain points of a specific group of target users.",
        example: "'Doctor Sarah, 38 years old, extremely busy, needs to review patient lab results in under 5 seconds on a smartphone.'",
        examTip: "Guides all design decisions to remain user-centered rather than designer-centered."
      },
      {
        term: "Information Architecture (IA)",
        en: "Information Architecture",
        definition: "The structural design of shared information environments; the art of organizing and labeling websites to support usability and findability.",
        example: "A clear website navigation hierarchy: Home → Courses → High School → Term 1 → Chapter 1.",
        examTip: "Focuses on categorization, labeling, and intuitive navigation flow."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "What is a User Persona in modern web and product design?",
        options: [
          "A research-based fictional archetype representing the goals and pain points of target users",
          "A computer virus that steals passwords",
          "A graphic designer's personal selfie photograph",
          "A programming error inside JavaScript"
        ],
        correctIndex: 0,
        explanation: "User Personas synthesize user research into memorable profiles that guide design choices."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Organizing and labeling website pages and menus so users can find information effortlessly is called:",
        options: ["Information Architecture (IA)", "Quantum Processing", "Data Destruction", "Hardware Overclocking"],
        correctIndex: 0,
        explanation: "Information Architecture organizes content taxonomy, navigation, and labeling for findability."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Building a website based on User Personas helps prevent designers from creating interfaces that satisfy only their own personal preferences.",
        isTrue: true,
        explanation: "True; Personas anchor the development team in the actual needs and limitations of end users."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Information Architecture focuses solely on computer hardware components like power cords and fans.",
        isTrue: false,
        explanation: "False; Information Architecture focuses on logical content structure, labeling, and navigation paths."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "A semi-fictional profile modeling the target audience's needs and behaviors is a User _____.",
        missingWord: "Persona",
        hint: "Persona / Character",
        options: ["Persona", "Manual", "Cable", "Driver"],
        explanation: "A User Persona represents target audience archetypes."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Organizing website navigation menus and content hierarchies is Information _____.",
        missingWord: "Architecture",
        hint: "Architecture / Structure",
        options: ["Architecture", "Electricity", "Compilation", "Fragmentation"],
        explanation: "Information Architecture structures digital content for optimal findability."
      }
    ]
  },

  'ch4-l2-c2': {
    title: "PARC Visual Principles & User-Centered Design (UCD)",
    lessonTitle: "User Persona & Information Architecture",
    summary: "Proximity, Alignment, Repetition, and Contrast (PARC / CRAP) and the iterative User-Centered Design (UCD) process.",
    narration: "Visual clarity is achieved by mastering the four PARC / CRAP principles: Proximity groups related elements together to indicate relationships. Alignment ensures every visual element shares a clean invisible baseline with other elements on the canvas. Repetition establishes consistency through cohesive color palettes, button styles, and fonts. Contrast creates dynamic visual hierarchy by highlighting primary calls to action. These principles operationalize User-Centered Design (UCD), an iterative cycle of Research, Design, Prototyping, and Usability Testing.",
    simplifiedExplanation: "Imagine a messy desk: Proximity groups your pens in one cup and notebooks in a stack. Alignment straightens everything along the desk edge. Repetition uses matching blue folders. And Contrast sticks a bright yellow sticky note on the most urgent assignment! That is PARC design!",
    aiPrompt: "Can you explain how the Proximity principle guides user visual perception?",
    contentCards: [
      {
        type: "concept",
        title: "The PARC Visual Design Rules (Ministry Textbook p. 96):",
        points: [
          "🧲 Proximity: Group related elements together so white space reveals logical relationships.",
          "📐 Alignment: Ensure every item aligns along a deliberate visual grid axis; never place elements arbitrarily.",
          "🔁 Repetition: Repeat design tokens (colors, font families, badge shapes) to foster visual unity.",
          "⚡ Contrast: Make primary action buttons boldly distinct from backgrounds to guide user attention.",
          "🔄 User-Centered Design (UCD): Iterative lifecycle: User Research → Wireframing → Prototyping → Usability Testing."
        ]
      }
    ],
    keyTerms: [
      {
        term: "CRAP / PARC Principles",
        en: "CRAP / PARC Principles",
        definition: "The four foundational principles of visual interface design: Contrast, Repetition, Alignment, and Proximity.",
        example: "Using a bright amber primary button against a navy dark background (Contrast) aligned with the form edge (Alignment).",
        examTip: "Coined by Robin Williams; standard framework for graphic and web layout clarity."
      },
      {
        term: "User-Centered Design (UCD)",
        en: "User-Centered Design",
        definition: "An iterative design process in which designers focus on users and their needs in each phase of the design process through research and usability testing.",
        example: "Testing early wireframe prototypes with actual high school students before coding the final educational app.",
        examTip: "Grounded in user empathy and continuous validation."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which visual design principle dictates grouping related items close together to communicate that they belong together?",
        options: ["Proximity", "Random scattering", "Contrast", "Pixelation"],
        correctIndex: 0,
        explanation: "Proximity leverages spatial distance to signal logical relationships between interface elements."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Making a primary 'Call to Action' button bright emerald green against a dark background is an example of:",
        options: ["Contrast", "Proximity", "Alignment", "Repetition"],
        correctIndex: 0,
        explanation: "Contrast creates strong visual distinction to draw user focus to key interactive elements."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Alignment requires that visual elements are placed randomly across the screen without adhering to any grid or baseline.",
        isTrue: false,
        explanation: "False; Alignment requires elements to share visual edges or centerlines to produce clean, orderly compositions."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "The Repetition principle fosters visual harmony by reusing consistent colors, typography, and button styles across all pages.",
        isTrue: true,
        explanation: "True; Repetition unifies disparate views into a coherent, recognizable digital product brand."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Spatial grouping of related items to indicate conceptual connection is the principle of _____.",
        missingWord: "Proximity",
        hint: "Proximity / Closeness",
        options: ["Proximity", "Contrast", "Repetition", "Randomness"],
        explanation: "Proximity organizes elements through spatial clustering."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The design approach that centers every phase around user needs is User-Centered _____.",
        missingWord: "Design",
        hint: "Design / UCD",
        options: ["Design", "Manufacturing", "Destruction", "Coding"],
        explanation: "User-Centered Design prioritizes user needs throughout product lifecycles."
      }
    ]
  },

  'ch4-l2-exam': {
    title: "🏆 Final Challenge: Lesson (4-2) Mastery Exam",
    lessonTitle: "User Persona & Information Architecture",
    summary: "Comprehensive exam testing User Personas, Information Architecture, PARC / CRAP visual principles, and UCD workflows.",
    narration: "Welcome to the Lesson 4-2 Mastery Challenge! Test your deep understanding of User Personas, Information Architecture, and the CRAP visual principles to claim your gold trophy!",
    examQuestions: [
      {
        question: "What is the primary role of a User Persona in digital product design?",
        options: [
          "It provides a concrete fictional profile synthesizing user goals, motivations, and pain points to guide design decisions",
          "It calculates corporate payroll taxes",
          "It generates automated code documentation in C++",
          "It replaces the computer operating system"
        ],
        correctIndex: 0,
        explanation: "User Personas ground product decisions in empirical human user requirements."
      },
      {
        question: "Which of the following represents the four CRAP visual design principles?",
        options: [
          "Contrast, Repetition, Alignment, Proximity",
          "Color, Routing, Access, Protocol",
          "Coding, Rendering, Audio, Processing",
          "Cache, RAM, Architecture, Power"
        ],
        correctIndex: 0,
        explanation: "The CRAP / PARC design framework stands for Contrast, Repetition, Alignment, and Proximity."
      },
      {
        question: "How does the principle of Proximity improve visual usability?",
        options: [
          "By placing related elements close together and separating unrelated elements with whitespace",
          "By using only black and white colors",
          "By making all text identical in size",
          "By removing navigation bars"
        ],
        correctIndex: 0,
        explanation: "Proximity uses spatial distance to establish immediate visual relationships between content."
      },
      {
        question: "What is Information Architecture (IA)?",
        options: [
          "The systematic categorization, labeling, and structural hierarchy of content across a website",
          "The electrical wiring inside a laptop",
          "The physical architecture of server room buildings",
          "The speed of a computer's central processor"
        ],
        correctIndex: 0,
        explanation: "Information Architecture organizes digital information taxonomies to facilitate intuitive navigation."
      },
      {
        question: "Reusing identical button shapes, typography styles, and color palettes across all website pages illustrates:",
        options: ["Repetition", "Proximity", "Destruction", "Randomness"],
        correctIndex: 0,
        explanation: "Repetition creates visual rhythm, predictability, and cohesive branding across digital interfaces."
      }
    ]
  },

  // ==========================================
  // Lesson 4-3: Website Evaluation Methods
  // ==========================================
  'ch4-l3-c1': {
    title: "Qualitative vs Quantitative Website Evaluation & A/B Testing",
    lessonTitle: "Website Evaluation Methods",
    summary: "Qualitative research (discovering 'Why' through usability observation and interviews) vs Quantitative metrics (measuring 'What' via analytics, bounce rates, and A/B testing).",
    narration: "How do we know if a website's design is truly successful? Web professionals combine two evaluation approaches: Qualitative Evaluation uncovers the 'Why' behind user behavior through recorded usability testing sessions, interviews, and cognitive walkthroughs. Quantitative Evaluation measures the 'What' and 'How many' through analytics metrics like bounce rates, time on page, and A/B Testing—where two versions of a webpage (Version A vs Version B) are compared to measure which achieves higher conversion rates.",
    simplifiedExplanation: "Imagine you own a clothes shop: Quantitative evaluation is counting how many people bought shirts (numbers!). Qualitative evaluation is sitting down and asking a customer: 'Why did you find the changing room hard to locate?' Both together give you the full truth!",
    aiPrompt: "What is the difference between qualitative usability testing and quantitative web analytics?",
    contentCards: [
      {
        type: "concept",
        title: "Qualitative vs Quantitative Evaluation (Ministry Textbook p. 100):",
        points: [
          "🗣️ Qualitative Evaluation: Explores user thoughts, motivations, and frustrations (Usability Observation, Think-Aloud Interviews).",
          "📊 Quantitative Evaluation: Measures numerical metrics (Pageviews, Conversion Rates, Bounce Rates, Task Completion Time).",
          "⚖️ A/B Testing: Split testing comparing two design variants (e.g. green vs blue button) with real traffic to measure conversion impact.",
          "🔗 Triangulation: Combining qualitative insights with quantitative metrics to gain bulletproof evidence."
        ]
      }
    ],
    keyTerms: [
      {
        term: "Qualitative Evaluation",
        en: "Qualitative Evaluation",
        definition: "An evaluation methodology that gathers non-numerical insights about human user experiences, emotions, and underlying behavioral reasons.",
        example: "Watching a student struggle to find the quiz button and asking them to think aloud about what confused them.",
        examTip: "Answers the question 'Why did the user do that?'"
      },
      {
        term: "A/B Testing (Split Testing)",
        en: "A/B Testing",
        definition: "A controlled statistical experiment where two variants of a webpage (A and B) are shown to users at random to determine which performs better.",
        example: "Showing 50% of visitors an orange 'Register' button and 50% a green button to measure which gets more clicks.",
        examTip: "Golden rule: Isolate and test only ONE single variable at a time!"
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which evaluation method involves observing real users interact with a website and asking them to explain 'why' they experienced difficulty?",
        options: ["Qualitative Usability Testing", "Quantitative Server Logging", "Automated Load Testing", "Compiler Error Checking"],
        correctIndex: 0,
        explanation: "Qualitative testing directly observes human user behavior to understand underlying subjective challenges."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "What testing methodology compares two variations of a web page with live users to measure which achieves a higher conversion rate?",
        options: ["A/B Testing (Split Testing)", "Stress Testing", "Smoke Testing", "Regression Testing"],
        correctIndex: 0,
        explanation: "A/B testing splits real traffic between variants to statistically determine the superior design."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Quantitative analytics tell you exactly 'what' happened (e.g. 40% bounce rate), while qualitative research reveals 'why' it happened.",
        isTrue: true,
        explanation: "True; Quantitative data provides numerical metrics, whereas qualitative research reveals human context and motivations."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "In an A/B test, developers should change 20 different variables simultaneously to test them all at once.",
        isTrue: false,
        explanation: "False; A/B testing requires isolating a single variable so you know precisely what caused the performance shift."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Testing two webpage variants (A and B) to compare performance is _____ Testing.",
        missingWord: "A/B",
        hint: "A/B",
        options: ["A/B", "X/Y", "Zero", "Beta"],
        explanation: "A/B testing compares two variations to measure conversion effectiveness."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Research gathering in-depth subjective user feedback and observation is _____ Evaluation.",
        missingWord: "Qualitative",
        hint: "Qualitative / Descriptive",
        options: ["Qualitative", "Quantitative", "Mechanical", "Electronic"],
        explanation: "Qualitative evaluation explores experiential and behavioral motivations."
      }
    ]
  },

  'ch4-l3-c2': {
    title: "Heuristic Evaluation & Triangulation of Evidence",
    lessonTitle: "Website Evaluation Methods",
    summary: "Jakob Nielsen's 10 Usability Heuristics, expert reviews, and the Triangulation of Evidence combining diverse data sources.",
    narration: "Beyond testing with users, design teams employ Heuristic Evaluation: usability experts review an interface against Jakob Nielsen's 10 recognized Usability Heuristics—such as Visibility of System Status (giving immediate feedback), Match between System and Real World, User Control & Freedom (providing an Undo button), and Consistency. To avoid bias, organizations practice Triangulation of Evidence: combining heuristic audits, usability testing, and web analytics to validate improvements with certainty.",
    simplifiedExplanation: "Heuristics are like common-sense golden rules: if you tap a button, it should show a loading spinner so you know it worked! If you make a mistake, there should be an 'Undo' button! Triangulation means checking three different maps so you are 100% sure you aren't lost!",
    aiPrompt: "Why is an 'Undo' or cancel feature essential according to Nielsen's Usability Heuristics?",
    contentCards: [
      {
        type: "concept",
        title: "Heuristics and Evidence Triangulation (Ministry Textbook p. 104):",
        points: [
          "🔍 Heuristic Evaluation: Usability experts audit an interface against established principles (e.g. Nielsen's 10 Heuristics).",
          "📢 Visibility of System Status: The system should always keep users informed through appropriate, timely feedback.",
          "↩️ User Control and Freedom: Provide clear 'emergency exits' (like Undo, Redo, Cancel) when users make accidental errors.",
          "🔺 Triangulation of Evidence: Synthesizing expert audits + user testing + quantitative analytics for robust design decisions."
        ]
      }
    ],
    keyTerms: [
      {
        term: "Heuristic Evaluation",
        en: "Heuristic Evaluation",
        definition: "A usability inspection method where one or more evaluators compare an interface against recognized usability principles (heuristics).",
        example: "An expert noting: 'This form violates the Error Prevention heuristic because it lacks a confirmation modal before deleting files.'",
        examTip: "Fast, cost-effective expert review developed by Jakob Nielsen."
      },
      {
        term: "Triangulation of Evidence",
        en: "Triangulation of Evidence",
        definition: "Using multiple data sources or research methods (e.g. analytics + user testing + heuristic review) to validate findings with high certainty.",
        example: "Analytics shows high drop-off on checkout; user testing shows confusion with coupon codes; expert audit confirms bad button contrast.",
        examTip: "Ensures conclusions do not rely on a single biased metric."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "What usability heuristic requires an application to provide clear 'Undo' or 'Cancel' mechanisms when users make accidental mistakes?",
        options: ["User Control and Freedom", "System Status Obscurity", "Monochrome Styling", "Hardware Acceleration"],
        correctIndex: 0,
        explanation: "User Control and Freedom provides users with an emergency exit without having to navigate extended dialogs."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Synthesizing web analytics, user testing observations, and expert heuristic reviews together represents:",
        options: ["Triangulation of Evidence", "Single-point Bias", "Data Elimination", "Hardware Recycling"],
        correctIndex: 0,
        explanation: "Triangulation cross-verifies findings from multiple distinct evaluation methods to ensure valid conclusions."
      },
      {
        id: "q2",
        level: "true_false",
        question: "A loading progress bar that informs users how much of an upload is complete illustrates the 'Visibility of System Status' heuristic.",
        isTrue: true,
        explanation: "True; It keeps users informed about ongoing operations through timely feedback."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Heuristic evaluations can only be conducted by computers and can never involve human UX specialists.",
        isTrue: false,
        explanation: "False; Heuristic evaluation is an expert inspection performed by trained human usability specialists."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Auditing an interface against established usability rules is a _____ Evaluation.",
        missingWord: "Heuristic",
        hint: "Heuristic / Rule-based",
        options: ["Heuristic", "Mechanical", "Physical", "Binary"],
        explanation: "Heuristic evaluation inspects interfaces using standardized UX heuristics."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Cross-validating findings using multiple independent research methods is _____ of Evidence.",
        missingWord: "Triangulation",
        hint: "Triangulation",
        options: ["Triangulation", "Isolation", "Rejection", "Cancellation"],
        explanation: "Triangulation of evidence combines qualitative and quantitative methodologies."
      }
    ]
  },

  'ch4-l3-exam': {
    title: "🏆 Final Challenge: Lesson (4-3) Mastery Exam",
    lessonTitle: "Website Evaluation Methods",
    summary: "Comprehensive exam testing qualitative research, quantitative analytics, A/B testing, and heuristic evaluations.",
    narration: "Welcome to the Lesson 4-3 Mastery Challenge! Demonstrate your mastery of usability testing, statistical A/B experimentation, and heuristic auditing to earn your gold trophy!",
    examQuestions: [
      {
        question: "What is the primary role of A/B Testing in website optimization?",
        options: [
          "It statistically compares two variants of a page with live users to identify which version achieves superior conversion",
          "It permanently disables all website styling",
          "It replaces the computer CPU",
          "It formats the database hard drives"
        ],
        correctIndex: 0,
        explanation: "A/B testing evaluates real user behavior across two variants to determine optimal design performance."
      },
      {
        question: "Why is the Triangulation of Evidence essential in website evaluations?",
        options: [
          "It combines multiple diverse data sources (analytics, usability testing, and expert audits) to avoid single-method bias",
          "It forces users to pay double for website visits",
          "It prevents web pages from rendering on mobile devices",
          "It deletes server log files"
        ],
        correctIndex: 0,
        explanation: "Triangulation ensures conclusions are corroborated across qualitative and quantitative evidence."
      },
      {
        question: "Which usability heuristic states that the interface must communicate current system status through immediate, relevant feedback?",
        options: ["Visibility of System Status", "Invisible Operations", "Random Errors", "Complex Navigation"],
        correctIndex: 0,
        explanation: "Visibility of System Status ensures users always know what is happening via loading bars, status text, and spinners."
      },
      {
        question: "What is the critical scientific rule when setting up an A/B test?",
        options: [
          "Isolate and modify only one single variable at a time between Variant A and Variant B",
          "Modify 50 different things simultaneously so users are confused",
          "Conduct the test without any visitors",
          "Turn off the web server during the test"
        ],
        correctIndex: 0,
        explanation: "Single variable isolation guarantees that observed metric differences are attributable to that specific change."
      },
      {
        question: "Which evaluation approach uncovers the underlying 'Why' behind user frustrations through direct observation and think-aloud interviews?",
        options: ["Qualitative Evaluation", "Automated Ping Requests", "RAM Diagnostics", "CPU Overclocking"],
        correctIndex: 0,
        explanation: "Qualitative usability evaluations provide rich contextual insights into human cognitive thought processes."
      }
    ]
  },

  // ==========================================
  // Lesson 4-4: The Iterative Improvement Process (PDCA)
  // ==========================================
  'ch4-l4-c1': {
    title: "The PDCA Continuous Improvement Cycle & Feedback Loops",
    lessonTitle: "The Iterative Improvement Process (PDCA)",
    summary: "The 4 cyclical phases of continuous quality management: Plan (goals & hypotheses), Do (implement changes), Check (measure data & KPIs), and Act (standardize or iterate).",
    narration: "A website is never 'finished' upon launch; it is a living system requiring continuous refinement through the PDCA Cycle (Plan-Do-Check-Act): In the Plan phase, teams identify performance gaps and formulate testable improvement hypotheses. In the Do phase, developers execute the change (such as launching an A/B test). In the Check phase, analytics measure whether key metrics improved. In the Act phase, successful changes are standardized across the site, and the cycle begins anew.",
    simplifiedExplanation: "PDCA is a continuous improvement loop: Plan (I want to get higher test scores, so I plan to study 30 minutes every day). Do (I actually study for 2 weeks). Check (I take a quiz to see if my grade improved). Act (My grade jumped from 70% to 95%, so this is my permanent study habit now!)",
    aiPrompt: "Can you name the four cyclical steps of the PDCA continuous improvement cycle?",
    contentCards: [
      {
        type: "concept",
        title: "The 4 Steps of the PDCA Cycle (Ministry Textbook p. 108):",
        points: [
          "📋 Plan: Identify bottlenecks, establish measurable KPIs (e.g. increase signups from 40% to 50%), and plan the design intervention.",
          "🛠️ Do: Implement the design change on a small scale (e.g. launch an A/B test variant with a simplified form).",
          "🔍 Check: Analyze quantitative telemetry and qualitative feedback to determine if the hypothesis succeeded.",
          "🔄 Act: Standardize the winning variant if successful, or iterate with a new hypothesis if target KPIs were not met."
        ]
      }
    ],
    keyTerms: [
      {
        term: "PDCA Cycle",
        en: "PDCA Cycle",
        definition: "An iterative four-step management framework (Plan-Do-Check-Act) utilized for the continuous improvement of processes, products, and websites.",
        example: "Plan new registration layout → Deploy A/B variant → Measure conversion lift → Adopt winning design permanently.",
        examTip: "Also known as the Deming Cycle. Continuous, repeating circle; it never terminates."
      },
      {
        term: "Continuous Improvement",
        en: "Continuous Improvement",
        definition: "An ongoing institutional effort to enhance products, services, or processes through small, incremental, data-driven modifications over time.",
        example: "Weekly optimizations to website load speeds, button contrast, and checkout forms.",
        examTip: "Focuses on sustained, data-guided incremental refinements rather than massive rare overhauls."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "What are the four sequential steps that make up the PDCA continuous improvement cycle?",
        options: [
          "Plan → Do → Check → Act",
          "Print → Delete → Copy → Archive",
          "Program → Design → Compile → Attack",
          "Pause → Delay → Cancel → Abort"
        ],
        correctIndex: 0,
        explanation: "PDCA represents the cyclical process: Plan, Do, Check, and Act."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "In which PDCA phase do teams analyze telemetry metrics to verify whether the design change achieved its goal?",
        options: ["Check Phase", "Plan Phase", "Do Phase", "Cancel Phase"],
        correctIndex: 0,
        explanation: "The Check phase compares post-implementation performance metrics against target baseline goals."
      },
      {
        id: "q2",
        level: "true_false",
        question: "The PDCA cycle concludes and terminates permanently as soon as a website is uploaded to a web hosting server for the first time.",
        isTrue: false,
        explanation: "False; PDCA is an infinite continuous improvement cycle that repeats throughout the entire product lifecycle."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "In the 'Act' phase of PDCA, successful validated improvements are standardized and adopted as the new operational baseline.",
        isTrue: true,
        explanation: "True; The Act phase standardizes winning changes and identifies the next area for improvement."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The global continuous improvement model is the _____ Cycle (Plan-Do-Check-Act).",
        missingWord: "PDCA",
        hint: "PDCA",
        options: ["PDCA", "HTML", "HTTP", "JSON"],
        explanation: "The PDCA cycle governs iterative quality optimization."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The first step of the PDCA cycle where goals and hypotheses are formulated is the _____ Phase.",
        missingWord: "Plan",
        hint: "Plan / Planning",
        options: ["Plan", "Do", "Check", "Act"],
        explanation: "The Plan phase establishes baseline metrics, problem definitions, and hypotheses."
      }
    ]
  },

  'ch4-l4-c2': {
    title: "A/B Testing Single Variable Rules & Improvement Culture",
    lessonTitle: "The Iterative Improvement Process (PDCA)",
    summary: "Single-variable scientific isolation in A/B testing, statistical sample sizes, and building a data-driven culture of iterative optimization.",
    narration: "To execute the PDCA cycle with scientific rigor, organizations enforce the Single-Variable Rule in A/B Testing: when testing a page, only one specific element (such as button color, headline copy, or form length) is varied between Version A and Version B. If multiple elements are altered simultaneously, it becomes impossible to determine which specific change caused the performance variance. Embracing an iterative culture ensures web applications continuously evolve based on empirical data rather than personal opinions.",
    simplifiedExplanation: "Imagine testing whether a plant grows faster with more water: you can't give it more water, different soil, and change the sunlight all on the same day, because then you won't know which one helped! In web design, change only one thing at a time so you know exactly what made users happier!",
    aiPrompt: "Why is isolating a single variable mandatory during A/B split testing?",
    contentCards: [
      {
        type: "concept",
        title: "Rigorous A/B Testing Rules (Ministry Textbook p. 112):",
        points: [
          "🎯 Single-Variable Isolation: Modify exactly ONE design element (e.g. form layout) to ensure causal certainty.",
          "👥 Statistical Significance: Run tests across sufficient sample volumes to ensure results are not random chance.",
          "📈 Data-Driven Culture: Replace subjective managerial opinions (HiPPO) with measurable empirical user data.",
          "🔄 Infinite Evolution: Every completed test informs the next planning cycle in the PDCA roadmap."
        ]
      }
    ],
    keyTerms: [
      {
        term: "Single-Variable Rule",
        en: "Single-Variable Rule",
        definition: "The scientific testing principle requiring that only one isolated element is changed between experimental test variants to establish clear causality.",
        example: "Testing green vs blue checkout buttons while keeping the headline, copy, and price completely identical.",
        examTip: "Essential in A/B testing to identify the exact cause of conversion rate fluctuations."
      },
      {
        term: "Data-Driven Decision Making",
        en: "Data-Driven Culture",
        definition: "An organizational practice of making strategic design choices based on empirical analytics and verified testing rather than subjective intuition.",
        example: "Keeping the simplified registration form because A/B data showed a 22% increase in completed signups.",
        examTip: "Transforms design from subjective guesswork into an empirical, measurable science."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Why must designers change only ONE single variable between Version A and Version B during an A/B test?",
        options: [
          "To know with scientific certainty which specific change caused the increase or decrease in user conversions",
          "Because computers can only render one color per day",
          "Because changing two things will crash the internet",
          "Because web browsers cannot process more than one line of text"
        ],
        correctIndex: 0,
        explanation: "Isolating one variable establishes direct causal attribution between the design modification and the metric outcome."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Adopting a 'Data-Driven Culture' in web development means design decisions are guided by:",
        options: [
          "Empirical analytics data, testing metrics, and user evidence",
          "The personal favorite color of the company manager",
          "Random astrology forecasts",
          "The oldest design manual available"
        ],
        correctIndex: 0,
        explanation: "Data-driven culture relies on objective measurement, telemetry, and validation."
      },
      {
        id: "q2",
        level: "true_false",
        question: "If you change the button color, the headline text, and the font family all at once in an A/B test, you can easily know which one boosted sales.",
        isTrue: false,
        explanation: "False; Changing multiple variables creates confounding factors, making it impossible to identify which modification drove the change."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Iterative improvement encourages small, data-verified incremental improvements that compound into massive product quality gains over time.",
        isTrue: true,
        explanation: "True; Incremental, data-guided enhancements build sustained, high-quality digital experiences."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Testing only one isolated design variation at a time is the Single-_____ Rule.",
        missingWord: "Variable",
        hint: "Single Variable",
        options: ["Variable", "Function", "Server", "Keyboard"],
        explanation: "The single-variable rule isolates experimental factors."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Making strategic product choices based on verified metrics is a Data-_____ Culture.",
        missingWord: "Driven",
        hint: "Driven / Guided by data",
        options: ["Driven", "Free", "Less", "Isolated"],
        explanation: "A data-driven culture utilizes empirical user metrics to guide iterations."
      }
    ]
  },

  'ch4-l4-exam': {
    title: "🏆 Final Challenge: Lesson (4-4) Mastery Exam & First Term Grand Finale",
    lessonTitle: "The Iterative Improvement Process (PDCA)",
    summary: "Grand finale comprehensive exam testing PDCA continuous improvement cycles, A/B testing rules, and web design optimization.",
    narration: "Welcome to the Grand Finale Challenge of Lesson 4-4 and the entire First Term curriculum! Demonstrate your comprehensive mastery of continuous improvement, PDCA cycles, and empirical web optimization to earn your crowning gold trophy!",
    examQuestions: [
      {
        question: "What does the PDCA acronym stand for in quality management and website optimization?",
        options: [
          "Plan → Do → Check → Act",
          "Process → Design → Code → Audit",
          "Protocol → Domain → Client → Application",
          "Packet → Data → Connection → Authentication"
        ],
        correctIndex: 0,
        explanation: "PDCA stands for the iterative cycle: Plan, Do, Check, and Act."
      },
      {
        question: "Why is website optimization described as a continuous cycle that never terminates?",
        options: [
          "Because user behaviors, browser technologies, and organizational goals continuously evolve, requiring ongoing refinement",
          "Because web hosting servers delete all files every midnight",
          "Because HTML is rewritten every week",
          "Because computers cannot store files for more than one month"
        ],
        correctIndex: 0,
        explanation: "Web applications are living systems that require continuous optimization in response to telemetry and shifting user needs."
      },
      {
        question: "What is the primary scientific requirement when conducting an A/B split test?",
        options: [
          "Modifying only one single isolated variable between Version A and Version B to ensure clear causal attribution",
          "Changing every single graphic and paragraph simultaneously",
          "Showing the test page only to people in one room",
          "Running the test for only 30 seconds"
        ],
        correctIndex: 0,
        explanation: "Isolating a single variable ensures measurable conversion differences are attributable solely to that change."
      },
      {
        question: "In the PDCA cycle, what occurs during the 'Act' phase when a tested change demonstrates positive metrics?",
        options: [
          "The successful modification is standardized and integrated permanently across the production environment",
          "The website is shut down permanently",
          "All previous data is erased",
          "The company switches to radio broadcasting"
        ],
        correctIndex: 0,
        explanation: "The Act phase standardizes validated improvements and sets the new baseline for subsequent cycles."
      },
      {
        question: "What is the primary advantage of Data-Driven Decision Making over subjective managerial intuition (HiPPO)?",
        options: [
          "Decisions are grounded in empirical user telemetry, statistically proven outcomes, and measurable business KPIs",
          "It makes websites 100% free to host",
          "It eliminates the need for software developers",
          "It guarantees that websites will never need maintenance"
        ],
        correctIndex: 0,
        explanation: "Data-driven decision making removes subjective bias, relying on verified empirical user interactions."
      }
    ]
  }
};
