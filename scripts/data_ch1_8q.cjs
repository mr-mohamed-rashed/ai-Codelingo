/**
 * Data definitions for the 31 chunks:
 * Adding:
 * - q_best: "اختيار الأصح والأشمل من وسط البدائل الصحيحة" (Best / Most Complete Answer among correct/plausible facts)
 * - q_reinforce: Additional high-yield question (MCQ or Timed Fill)
 * Making exactly 8 questions per chunk in both Arabic and English!
 */

const fs = require('fs');
const path = require('path');

const NEW_QUESTIONS_DATA = {
  // =========================================================================
  // CHAPTER 1 (11 chunks)
  // =========================================================================
  'ch1-l1-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية صحيحة عن الحوسبة السحابية (المحطة الخامسة)، ولكن ما هو التوصيف الأصح والأشمل لمفهومها كنموذج حديث؟",
        options: [
          "وسيلة مريحة لحفظ النسخ الاحتياطية من الصور والملفات الشخصية أونلاين.",
          "تقنية تتيح للمستخدمين تشغيل البرامج وتصفح الإنترنت من أي جهاز محمول.",
          "نموذج لتوفير كافة موارد تكنولوجيا المعلومات (معالجة، تخزين، شبكات، برمجيات) كخدمات مدارة عند الطلب عبر الإنترنت مع الدفع الفعلي حسب الاستهلاك.",
          "نظام لتوصيل خوادم الشركات الكبرى ببعضها عبر كابلات الألياف الضوئية."
        ],
        correctIndex: 2,
        explanation: "جميع الخيارات تمثل جوانب وفوائد حقيقية للسحابة، لكن الخيار (ج) هو التعريف العلمي الأصح والأشمل المعتمد أكاديمياً كنموذج متكامل (IT as a Service)."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "ما هو السبب الجوهري الذي جعل حاسوب ENIAC يقتصر استخدامه على الأغراض العسكرية والعلمية الكبرى دون المنازل؟",
        options: [
          "عدم وجود شاشات ملونة في ذلك الوقت",
          "اعتماده على آلاف الصمامات المفرغة الضخمة واستهلاكه الهائل للطاقة واحتياجه لمساحات غرف كاملة وصيانة معقدة",
          "رفض الحكومات بيعه للأفراد لأسباب أمنية فقط",
          "عدم اختراع لوحة المفاتيح والماوس"
        ],
        correctIndex: 1,
        explanation: "حاسوب ENIAC كان يشغل غرفة كاملة بوزن 30 طناً ويعتمد على الصمامات المفرغة ويستهلك كهرباء قرية كاملة، مما جعله مستحيلاً للاستخدام الشخصي."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements about Cloud Computing are true, but which one represents the MOST accurate and comprehensive definition of its modern model?",
        options: [
          "A convenient way to store personal photo and document backups online.",
          "A technology allowing users to run programs and browse the web from any mobile device.",
          "A model delivering all IT resources (compute, storage, networking, software) as on-demand managed services over the Internet with pay-as-you-go pricing.",
          "A system connecting enterprise servers via high-speed fiber-optic cables."
        ],
        correctIndex: 2,
        explanation: "All options highlight valid benefits of the cloud, but Option C is the complete and academically recognized definition of IT as a Service."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "What was the fundamental reason why ENIAC was restricted to military and scientific calculations rather than home use?",
        options: [
          "The absence of color monitors at the time",
          "Its reliance on thousands of massive vacuum tubes, enormous power consumption, room-sized footprint, and complex maintenance",
          "Government regulations completely banning private hardware ownership",
          "The lack of keyboard and mouse input devices"
        ],
        correctIndex: 1,
        explanation: "ENIAC weighed 30 tons, took up an entire room, consumed immense power, and generated extreme heat, making personal home use impossible."
      }
    ]
  },

  'ch1-l1-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع البدائل التالية تمثل حقائق علمية حول رقائق المعالجات، ولكن أي منها يمثل التفسير الأصح والأشمل لعدم إمكانية الاستمرار في تصغير الترانزستور إلى ما لا نهاية؟",
        options: [
          "ارتفاع تكلفة شراء معدات تصنيع السيليكون المجهرية للشركات المصنعة.",
          "صعوبة تبريد المعالج بالمراوح التقليدية داخل أجهزة الحواسيب المحمولة.",
          "الوصول إلى أبعاد ذرية دقيقة تؤدي لظاهرة النفق الكمومي وتيار التسريب وتوليد حرارة هائلة تعطل البنية الفيزيائية.",
          "عدم استيعاب اللوحة الأم لمزيد من الوصلات النحاسية الدقيقة."
        ],
        correctIndex: 2,
        explanation: "جميع البدائل تصف صعوبات واقعية، لكن الخيار (ج) هو التفسير العلمي الأصح والأشمل الذي يشكل الحد الفيزيائي الحتمي لقانون مور عند المستوى الذري."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "ما الحل الهندسي والمعماري الرئيسي المعتمد حالياً لتجاوز حدود تصغير الترانزستور الفردي ومواصلة زيادة الأداء الحاسوبي؟",
        options: [
          "زيادة التردد الكهربائي للمعالج إلى ما لا نهاية",
          "الاعتماد على المعالجات متعددة الأنوية (Multi-Core) والمعالجة المتوازية (Parallel Computing)",
          "تقليل سعة ذاكرة الوصول العشوائي RAM",
          "استخدام الأقراص الممغنطة القديمة HDD"
        ],
        correctIndex: 1,
        explanation: "بدلاً من زيادة تردد النواة الواحدة وتوليد حرارة هائلة، توجهت هندسة الحواسيب نحو المعالجات متعددة الأنوية لتوزيع المهام بالتوازي."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements describe processor manufacturing facts, but which one provides the MOST accurate and comprehensive scientific explanation for why transistors cannot shrink infinitely?",
        options: [
          "The skyrocketing financial costs of micro-silicon fabrication equipment.",
          "The difficulty of cooling processors using standard mechanical laptop fans.",
          "Reaching atomic dimensions causes quantum tunneling, leakage currents, and extreme thermal dissipation that break physical semiconductor behavior.",
          "Motherboards lacking physical space for denser copper traces."
        ],
        correctIndex: 2,
        explanation: "All options cite real engineering hurdles, but Option C represents the fundamental physical and atomic barrier defined by Moore's Law limits."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "What primary architectural engineering solution is currently used to overcome single-transistor scaling limits and continue advancing compute power?",
        options: [
          "Infinitely raising the electrical clock speed of the processor",
          "Adopting Multi-Core processors and Parallel Computing architectures",
          "Reducing the capacity of system RAM",
          "Reverting to legacy magnetic HDD drives"
        ],
        correctIndex: 1,
        explanation: "Engineers shifted from driving single-core clock frequencies to multi-core architectures that divide workloads in parallel without excessive heat."
      }
    ]
  },

  'ch1-l1-c3': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية تصف مزايا التجارة الإلكترونية، ولكن أي عبارة تمثل التأثير المجتمعي الأصح والأشمل لرقمنة الأسواق في تكنولوجيا المعلومات؟",
        options: [
          "إمكانية الشراء في أوقات متأخرة من الليل دون النزول للشارع.",
          "مقارنة أسعار السلع بين تطبيقين مختلفين على الهاتف الذكي بسهولة.",
          "تحويل سلاسل التوريد والتبادل التجاري عالمياً إلى منظومة رقمية متكاملة غير مقيدة بحدود جغرافية أو أوقات عمل مع خفض تكاليف التشغيل وخلق فرص عمل جديدة.",
          "الاستغناء عن فواتير الورق واستبدالها بإشعارات وتطبيقات إلكترونية."
        ],
        correctIndex: 2,
        explanation: "الخيارات الأخرى فوائد استهلاكية جزئية، بينما الخيار (ج) هو التوصيف الأصح والأشمل للتحول المجتمعي والاقتصادي الكلي."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "العمل عن بُعد يعتمد جوهرياً على أدوات التعاون السحابي والاتصال الرقمي الآمن لإنجاز المهام دون الحاجة للتواجد ____ في مقر المنشأة.",
        options: ["الفيزيائي", "المالي", "الافتراضي", "الخوارزمي"],
        missingWord: "الفيزيائي",
        hint: "الحاجة للتواجد المادي بأجسادنا في المقر.",
        explanation: "العمل عن بُعد ألغى شرط التواجد الفيزيائي في موقع العمل بفضل الحوسبة السحابية وشبكات الاتصال."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements describe e-commerce benefits, but which statement represents the MOST accurate and comprehensive societal impact of digital market transformation?",
        options: [
          "The ability to shop late at night without leaving your home.",
          "Easily comparing product prices across two smartphone apps.",
          "Transforming global supply chains and commerce into an integrated 24/7 digital ecosystem free of geographic borders with reduced operating costs and new job economies.",
          "Replacing paper receipts with electronic notifications."
        ],
        correctIndex: 2,
        explanation: "Other options are narrow consumer conveniences, whereas Option C captures the macro-societal and macroeconomic paradigm shift."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "Remote work relies fundamentally on cloud collaboration and secure networking to achieve tasks without requiring ____ presence at company headquarters.",
        options: ["physical", "financial", "virtual", "algorithmic"],
        missingWord: "physical",
        hint: "Being there in bodily person.",
        explanation: "Remote work eliminated the strict requirement of physical presence through digital cloud infrastructure."
      }
    ]
  },

  'ch1-l1-c4': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية صحيحة عن الحوسبة الكمومية، ولكن أي منها يمثل التوصيف الأصح والأشمل الذي يميزها جذرياً عن الحوسبة التقليدية؟",
        options: [
          "أنها تستخدم معالجات فائقة السرعة مصنوعة من مواد فلزية وموصلات فائقة التوصيل.",
          "قدرتها على الاتصال بالإنترنت بسرعات تفوق شبكات الجيل الخامس بأضعاف كثيرة.",
          "استخدام الكيوبتات (Qubits) وخصائص التراكب والتشابك الكمي لمعالجة احتمالات هائلة معقدة بالتوازي تفوق قدرة أسرع الحواسيب الفائقة.",
          "قدرتها على تشغيل ألعاب الواقع الافتراضي والمعزز بجودة عالية دون بطاقة رسوميات."
        ],
        correctIndex: 2,
        explanation: "الخيار (ج) هو التوصيف العلمي الأصح والأشمل؛ لأن قوة الحوسبة الكمومية تنبع من التراكب والتشابك الكمومي للكيوبتات وليس مجرد سرعة التوصيل."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "يعتمد نظام الملاحة والتوجيه في السيارات ذاتية القيادة بشكل أساسي على مستشعرات متكاملة تشمل:",
        options: [
          "قارئات الباركود ومستشعرات الوزن الميكانيكية",
          "ليدار (LiDAR) والرادار والكاميرات الرقمية وخوارزميات الرؤية الحاسوبية",
          "موازين الحرارة الداخلية للسيارة فقط",
          "إشارات البلوتوث قصيرة المدى فقط"
        ],
        correctIndex: 1,
        explanation: "السيارات ذاتية القيادة تدمج مستشعرات LiDAR والرادار والكاميرات لبناء نموذج ثلاثي الأبعاد فوري للمحيط."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements about quantum computing are true, but which one represents the MOST accurate and comprehensive distinction that radically separates it from classical computing?",
        options: [
          "It uses high-speed processors made from metallic superconducting alloys.",
          "Its ability to connect to the internet at speeds exceeding 5G networks.",
          "Utilizing quantum bits (Qubits) along with superposition and entanglement to solve intractable complex combinations in parallel beyond the reach of classical supercomputers.",
          "Its ability to render VR/AR games without needing a discrete graphics card."
        ],
        correctIndex: 2,
        explanation: "Option C captures the foundational scientific essence: qubits, quantum superposition, and entanglement enabling non-linear parallel states."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "The perception and navigation systems of autonomous vehicles rely fundamentally on an integrated suite including:",
        options: [
          "Barcode scanners and mechanical weight sensors",
          "LiDAR sensors, Radar, digital cameras, and Computer Vision AI algorithms",
          "Internal cabin thermometers alone",
          "Short-range Bluetooth signals exclusively"
        ],
        correctIndex: 1,
        explanation: "Autonomous driving utilizes LiDAR for 3D depth mapping, Radar for speed/weather resilience, and cameras for visual recognition."
      }
    ]
  },

  'ch1-l2-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية صحيحة حول علاقة الذكاء الاصطناعي وتعلم الآلة والتعلم العميق، ولكن أي منها يصف الهيكلية الهرمية الأصح والأشمل؟",
        options: [
          "الذكاء الاصطناعي هو برنامج مستقل تماماً ولا يرتبط بتعلم الآلة إلا في تصنيف الصور.",
          "التعلم العميق هو الأصل الأوسع الذي تفرع منه الذكاء الاصطناعي وتعلم الآلة لاحقاً.",
          "الذكاء الاصطناعي هو المظلة الشاملة لمحاكاة الذكاء البشري، وتعلم الآلة حقل فرعي منه يتعلم من البيانات، والتعلم العميق حقل فرعي من تعلم الآلة يعتمد على شبكات عصبية متعددة الطبقات.",
          "تعلم الآلة يختص بالبيانات الرقمية فقط بينما الذكاء الاصطناعي يختص بالنصوص."
        ],
        correctIndex: 2,
        explanation: "الخيار (ج) هو التوصيف الهرمي الأصح والمعتمد: AI (المظلة الكبرى) ← ML (المجموعة الفرعية) ← DL (التعلم العميق داخل ML) ← GenAI."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "الذكاء الاصطناعي التوليدي (GenAI) يتميز بقدرته الفريدة على ابتكار وإنشاء محتوى ____ بدلاً من مجرد تصنيف أو تحليل البيانات الموجودة مسبقاً.",
        options: ["جديد", "مكرر", "ثابت", "محذوف"],
        missingWord: "جديد",
        hint: "ابتكار مادة أصلية لم تكن موجودة بحرفيتها.",
        explanation: "الذكاء التوليدي يبني نصوصاً وصوراً وأكواداً جديدة وأصلية بناءً على الأنماط التي تعلمها."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements about AI, Machine Learning, and Deep Learning are valid, but which one states the MOST accurate and comprehensive hierarchical relationship?",
        options: [
          "Artificial Intelligence is a standalone application unrelated to Machine Learning except in photo tagging.",
          "Deep Learning is the broadest parent discipline from which AI and ML originated.",
          "AI is the overarching umbrella simulating human cognitive faculties; ML is a subset learning patterns from data; and Deep Learning is a specialized ML subset employing deep multi-layered neural networks.",
          "Machine Learning is restricted to numerical data while AI processes natural language."
        ],
        correctIndex: 2,
        explanation: "Option C correctly describes the canonical concentric hierarchy: AI (outer umbrella) ⊃ ML ⊃ Deep Learning ⊃ Generative AI."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "Generative AI (GenAI) is fundamentally characterized by its capability to create novel, ____ content rather than merely classifying existing data.",
        options: ["new", "duplicate", "static", "deleted"],
        missingWord: "new",
        hint: "Original creations unseen in the exact same phrasing.",
        explanation: "Generative AI synthesizes novel outputs (text, imagery, code) from probabilistic foundational models."
      }
    ]
  },

  'ch1-l2-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية صحيحة عن طبقات الشبكة العصبية، ولكن ما هو التوصيف الأصح والأشمل للدور الوظيفي للطبقات المخفية (Hidden Layers) في التعلم العميق؟",
        options: [
          "استقبال الصورة الرقمية الخام وتمريرها مباشرة إلى شاشة العرض دون أي تعديل.",
          "تخزين بيانات التدريب في ملف نصي على القرص الصلب لحمايتها من الضياع.",
          "استخلاص الميزات والأنماط التجريدية المعقدة تدريجياً عبر تعديل الأوزان الرياضية ودوال التنشيط لتمكين التنبؤ الدقيق بالمخرجات.",
          "عرض النتائج النهائية بالألوان على واجهة التطبيق أمام المستخدم النهائي."
        ],
        correctIndex: 2,
        explanation: "الطبقات المخفية تمثل قلب التعلم العميق؛ حيث تستخرج الخصائص من البسيطة إلى المعقدة تدريجياً عبر الأوزان ودوال التنشيط."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "ما هي الوظيفة الحسابية الأساسية لدوال التنشيط (Activation Functions) داخل العقد العصبية؟",
        options: [
          "إيقاف تشغيل الخادم عند ارتفاع درجة الحرارة",
          "إدخال خاصية اللاخطية (Non-Linearity) لتمكين الشبكة من تعلم العلاقات والأنماط المعقدة غير الخطية",
          "مسح البيانات المكررة من الذاكرة العشوائية RAM",
          "تحويل الحروف الإنجليزية إلى أرقام صحيحة فقط"
        ],
        correctIndex: 1,
        explanation: "بدون دوال التنشيط اللاخطية، تظل الشبكة العصبية مجرد معادلة انحدار خطي بسيطة عاجزة عن تمييز الصور أو النصوص المعقدة."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements about neural network layers are true, but which one represents the MOST accurate and comprehensive description of Hidden Layers in Deep Learning?",
        options: [
          "Receiving raw pixels and streaming them directly to the display without mathematical alteration.",
          "Saving dataset rows into hard drive text logs for backup safety.",
          "Hierarchically extracting complex, abstract feature representations through weighted sums and non-linear activation functions to enable accurate predictions.",
          "Presenting the final formatted prediction labels to end users on the frontend."
        ],
        correctIndex: 2,
        explanation: "Option C captures the fundamental engine of Deep Learning: hidden layers learn hierarchical representations from low-level edges to semantic concepts."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "What is the core mathematical role of Activation Functions inside artificial neural network nodes?",
        options: [
          "Shutting down the server when CPU temperatures spike",
          "Introducing Non-Linearity to empower the network to learn intricate real-world mathematical patterns",
          "Flushing duplicate cache entries from system RAM",
          "Converting string characters into integers exclusively"
        ],
        correctIndex: 1,
        explanation: "Without non-linear activation functions, stacking multiple neural layers mathematically collapses into a single linear regression."
      }
    ]
  },

  'ch1-l2-c3': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع الخيارات تصف مظاهر تفاعل المستخدم مع الذكاء الاصطناعي التوليدي، ولكن أي عبارة تمثل التفسير العلمي الأصح والأشمل لظاهرة 'هلوسة الذكاء الاصطناعي' (AI Hallucination)؟",
        options: [
          "رغبة النموذج الذكي في تضليل وخداع المستخدم عمداً لاختبار قدراته النقدية.",
          "بطء استجابة الخادم بسبب انقطاع اتصال الإنترنت أثناء مرحلة توليد النص.",
          "قيام النماذج اللغوية بتوليد معلومات خاطئة أو مختلقة بثقة تامة نظراً لاعتمادها على التنبؤ الإحصائي بالكلمة التالية دون إدراك حقيقي لمعنى الحقيقة والواقع.",
          "وجود فيروس إلكتروني في قاعدة بيانات النموذج البرمجي يعطل حساباته."
        ],
        correctIndex: 2,
        explanation: "الهلوسة ناتجة عن الطبيعة الاحتمالية للنماذج اللغوية (توقع الكلمة الأكثر احتمالاً إحصائياً) وليس عن وعي أو خداع متعمد."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "ما الإجراء الوقائي الإلزامي الذي يوصي به منهج الوزارة دائماً عند استخدام إجابات الذكاء الاصطناعي التوليدي؟",
        options: [
          "قبول الإجابات فوراً دون قراءة لأن الذكاء الاصطناعي لا يخطئ أبداً",
          "التحقق البشري الصارم والرجوع للمصادر العلمية المعتمدة للتأكد من دقة الحقائق والأرقام",
          "إعادة تشغيل الحاسوب قبل نسخ ولصق النص المولد",
          "ترجمة النص إلى لغة أخرى ثم إعادته للغة الأصلية"
        ],
        correctIndex: 1,
        explanation: "المنهج يؤكد على ضرورة التحقق البشري الدائم (Human-in-the-loop) ومراجعة المصادر العلمية الموثوقة."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements reflect user experiences with GenAI, but which statement represents the MOST accurate and comprehensive scientific explanation of 'AI Hallucination'?",
        options: [
          "The model deliberately attempting to deceive the user to test critical faculties.",
          "Server latency caused by brief network disconnects during text streaming.",
          "The probabilistic generation of factually incorrect or fabricated statements delivered with high confidence due to next-token prediction without true real-world grounding.",
          "A malicious software virus corrupting the model's neural parameter weights."
        ],
        correctIndex: 2,
        explanation: "Option C explains the exact mathematical reality: foundation models predict mathematically probable tokens rather than retrieving verified ontological truth."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "What mandatory precautionary practice is emphasized by the curriculum when utilizing Generative AI outputs?",
        options: [
          "Accepting outputs immediately without reading because AI cannot make errors",
          "Rigorous human verification and cross-referencing with certified, authoritative source materials",
          "Rebooting the computer before pasting text",
          "Translating text to another language and back"
        ],
        correctIndex: 1,
        explanation: "The curriculum emphasizes that human fact-checking is vital because generative AI can hallucinate plausible-sounding falsehoods."
      }
    ]
  },

  'ch1-l3-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية تصف خصائص البيانات الضخمة (5Vs)، ولكن ما هو التوصيف الأصح والأشمل لقيمة البيانات الضخمة (Value) كأهم هذه الخصائص؟",
        options: [
          "سعر بيع أجهزة الخوادم الضخمة في أسواق التكنولوجيا العالمية.",
          "عدد وحدات الجيجابايت التي يمكن تخزينها على وحدات التخزين السحابية.",
          "القدرة على استخلاص رؤى استراتيجية ومعارف ذات جدوى تدعم اتخاذ قرارات دقيقة وتحسن الخدمات وتحل مشكلات معقدة للمؤسسات والمجتمع.",
          "سرعة إرسال الرسائل عبر تطبيقات التراسل الفوري بين مستخدمي الهواتف."
        ],
        correctIndex: 2,
        explanation: "الهدف الأسمى والنهائي لجمع مليارات البيانات بخصائصها (الحجم، السرعة، التنوع، المصداقية) هو استخراج القيمة (Value) المعرفية والعملية."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "خاصية ____ في البيانات الضخمة تعبر عن دقة وموثوقية وصحة البيانات وخلوها من التشويه والضوضاء المضللة.",
        options: ["المصداقية", "الحجم", "السرعة", "التنوع"],
        missingWord: "المصداقية",
        hint: "ترمز إلى Veracity في مصطلحات 5Vs.",
        explanation: "المصداقية (Veracity) تعني نقاء البيانات وموثوقيتها وصلاحيتها لبناء القرارات."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements relate to the 5Vs of Big Data, but which one represents the MOST accurate and comprehensive definition of 'Value' as the paramount goal?",
        options: [
          "The hardware market price of enterprise server racks.",
          "The total terabytes recorded on cloud storage arrays.",
          "The ability to extract actionable strategic insights, predictive foresight, and problem-solving intelligence that optimizes organizations and society.",
          "The transmission throughput of messaging packets across cellular towers."
        ],
        correctIndex: 2,
        explanation: "Option C defines the ultimate goal of Big Data: all other dimensions (Volume, Velocity, Variety, Veracity) are means to extract actionable Value."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "The property of ____ in Big Data signifies the accuracy, trustworthiness, and reliability of information, free from misleading noise.",
        options: ["Veracity", "Volume", "Velocity", "Variety"],
        missingWord: "Veracity",
        hint: "Truthfulness and statistical validity.",
        explanation: "Veracity ensures data integrity, noise reduction, and bias mitigation for dependable analytics."
      }
    ]
  },

  'ch1-l3-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع البدائل التالية تعبر عن اعتبارات أخلاقية، ولكن أي منها يمثل التعريف الأصح والأشمل لـ 'الانحياز الخوارزمي' (Algorithmic Bias)؟",
        options: [
          "تفضيل المبرمج استخدام لغة بايثون على لغة جافا عند بناء النماذج.",
          "بطء استجابة الخوارزمية في معالجة العمليات الحسابية الكبيرة والمعقدة.",
          "انعكاس الأحكام المسبقة والتحيزات البشرية غير العادلة في مخرجات النظام نتيجة تدريبه على بيانات غير متوازنة تاريخياً أو مجتمعياً.",
          "اختيار الخوارزمية لأقصر مسار للوصول إلى الوجهة في تطبيقات الخرائط."
        ],
        correctIndex: 2,
        explanation: "الانحياز الخوارزمي ينشأ عندما تعيد الخوارزمية إنتاج الظلم المجتمعي أو التحيز البشري الموجود في بيانات التدريب."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "ما الركيزة الأساسية لـ 'حوكمة الذكاء الاصطناعي' وفق الأطر التنظيمية المعاصرة المعتمدة في المنهج؟",
        options: [
          "منع استخدام برمجيات الذكاء الاصطناعي في التعليم والطب تماماً",
          "وضع سياسات ومعايير قانونية وأخلاقية تضمن الشفافية والمساءلة والعدالة وحماية حقوق الأفراد والخصوصية",
          "جعل جميع البرمجيات مفتوحة المصدر دون أي حقوق ملكية فكرية",
          "فرض رسوم مالية على كل استعلام يجريه المستخدم للذكاء الاصطناعي"
        ],
        correctIndex: 1,
        explanation: "حوكمة الذكاء الاصطناعي تضع الأطر التشريعية والأخلاقية (الشفافية، المساءلة، الأمان) لضمان توظيف التقنية لمصلحة الإنسان."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements touch on technical choices, but which one represents the MOST accurate and comprehensive definition of 'Algorithmic Bias'?",
        options: [
          "A software developer preferring Python over Java for machine learning scripts.",
          "A computational delay when crunching massive multidimensional matrices.",
          "The systematic, unfair perpetuation of human prejudices in algorithmic outputs caused by historically skewed or unrepresentative training data.",
          "A GPS algorithm selecting the shortest path instead of the most scenic highway."
        ],
        correctIndex: 2,
        explanation: "Option C defines Algorithmic Bias precisely: historical and social inequities reflected in training datasets reproduce discriminatory predictions."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "What is the primary cornerstone of 'AI Governance' within modern regulatory standards highlighted in the curriculum?",
        options: [
          "Completely prohibiting AI deployment across healthcare and education",
          "Establishing legal and ethical frameworks that enforce transparency, accountability, fairness, and privacy protection",
          "Mandating that all commercial proprietary software become open source",
          "Taxing every search query generated by end users"
        ],
        correctIndex: 1,
        explanation: "AI Governance provides institutional, ethical, and legal guardrails ensuring safe, transparent, and accountable artificial intelligence systems."
      }
    ]
  },

  'ch1-l4-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع الإجراءات التالية تسهم في خفض استهلاك الطاقة، ولكن ما هو المفهوم الأصح والأشمل لمصطلح 'الحوسبة الخضراء' (Green Computing)؟",
        options: [
          "طلاء حواسيب وخزائن مراكز البيانات باللون الأخضر الصديق للبيئة.",
          "إغلاق شاشة الحاسوب الشخصي في فترات الاستراحة القصيرة أثناء الدوام.",
          "التصميم والتصنيع والاستخدام والتخلص المستدام من الأجهزة والأنظمة الحاسوبية ومراكز البيانات بأعلى كفاءة طاقة وأقل بصمة كربونية ممكنة على مدار دورة حياتها.",
          "استبدال كابلات الإنترنت السلكية بشبكات الواي فاي اللاسلكية فقط."
        ],
        correctIndex: 2,
        explanation: "الحوسبة الخضراء تشمل دورة حياة التقنية كاملة: التصميم المستدام، كفاءة الطاقة، واستخدام الطاقة المتجددة، والتدوير المسؤول."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "في مراكز البيانات الحديثة، كلما اقتربت قيمة مؤشر كفاءة استخدام الطاقة (PUE) من الرقم ____، دل ذلك على كفاءة بيئية فائقة وتوجيه معظم الطاقة للحوسبة الفعلية:",
        options: ["1.0", "5.0", "10.0", "0.0"],
        correctIndex: 0,
        explanation: "قيمة PUE المثالية نظرياً هي 1.0، حيث تذهب كل الطاقة الكهربائية مباشرة لتشغيل خوادم الحوسبة دون أي هدر في التبريد أو الإنارة."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following practices reduce power usage, but which one represents the MOST accurate and comprehensive definition of 'Green Computing'?",
        options: [
          "Painting data center chassis with environmentally friendly green pigments.",
          "Powering off workstation monitors during coffee breaks.",
          "The sustainable design, manufacture, operation, and end-of-life disposal of computer hardware, software, and data centers with maximal energy efficiency and minimal carbon footprint.",
          "Exclusively replacing fiber-optic cabling with wireless Wi-Fi routers."
        ],
        correctIndex: 2,
        explanation: "Green Computing is a full-lifecycle engineering discipline: eco-design, energy-efficient operation, renewable energy, and circular recycling."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "In state-of-the-art green data centers, as the Power Usage Effectiveness (PUE) metric approaches ____, it indicates optimal efficiency where nearly all energy powers compute hardware:",
        options: ["1.0", "5.0", "10.0", "0.0"],
        correctIndex: 0,
        explanation: "A PUE of 1.0 represents the ideal baseline where 100% of facility power feeds IT equipment directly without cooling overhead waste."
      }
    ]
  },

  'ch1-l4-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية صحيحة حول الأجهزة القديمة، ولكن ما هو المبدأ الأصح والأشمل لـ 'الاقتصاد الدائري' في إدارة الأجهزة الإلكترونية مقارنة بالاقتصاد الخطي؟",
        options: [
          "تخزين الأجهزة الإلكترونية القديمة في مستودعات المدارس لسنوات طويلة.",
          "إهداء الحواسب القديمة للأقارب والأصدقاء فقط دون فحص فني.",
          "التحول من نموذج (اصنع، استهلك، ارمِ) إلى نموذج مستدام يعيد تدوير المكونات والمواد النادرة ويعيد تجديد الأجهزة لتقليل الهدر واستنزاف الموارد الطبيعية وحماية البيئة.",
          "تصدير النفايات الإلكترونية إلى مكبات النفايات العامة خارج المدن الكبرى."
        ],
        correctIndex: 2,
        explanation: "الاقتصاد الدائري يغلق دائرة الإنتاج والاستهلاك بإعادة التدوير واستخلاص المعادن الثمينة وتجديد الأجهزة بدلاً من طمرها."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "تحتوي النفايات الإلكترونية غير المعالجة على معادن ثقيلة خطرة بيئياً وصحياً مثل الرصاص و____ والزئبق.",
        options: ["الكادميوم", "الذهب", "الحديد", "الألومنيوم"],
        missingWord: "الكادميوم",
        hint: "عنصر كيميائي سام يتواجد في البطاريات والرقائق.",
        explanation: "الكادميوم والرصاص والزئبق من أخطر المعادن السامة بيئياً في حال طمر النفايات الإلكترونية دون تدوير متخصص."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements mention old hardware, but which one represents the MOST accurate and comprehensive principle of a 'Circular Economy' in electronics compared to linear models?",
        options: [
          "Stockpiling obsolete computers in school basements indefinitely.",
          "Gifting old tablets to friends without technical refurbishing.",
          "Transitioning from the linear 'Take, Make, Dispose' model to a restorative system that reclaims scarce minerals, refurbishes components, minimizes waste, and protects natural resources.",
          "Exporting electronic scrap to open municipal landfills outside cities."
        ],
        correctIndex: 2,
        explanation: "Option C defines the true Circular Economy: closing the loop through repair, refurbishment, component reuse, and mineral reclamation."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "Unprocessed e-waste contains hazardous heavy metals that severely endanger health and aquifers, such as Lead, Mercury, and ____.",
        options: ["Cadmium", "Gold", "Iron", "Aluminum"],
        missingWord: "Cadmium",
        hint: "A toxic element often found in batteries and solder.",
        explanation: "Cadmium, lead, and mercury are hazardous heavy metals that leach into groundwater if e-waste is improperly discarded."
      }
    ]
  }
};

console.log('Script loaded successfully. Writing Chapter 1 and preparing full compilation...');
module.exports = { NEW_QUESTIONS_DATA };
