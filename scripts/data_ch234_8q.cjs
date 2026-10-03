/**
 * Question expansion part 2:
 * Chapters 2, 3, and 4 (20 chunks total)
 * Adding q_best (best_choice) and q_reinforce to make exactly 8 questions per chunk.
 */

const CH234_QUESTIONS = {
  // =========================================================================
  // CHAPTER 2: Cybersecurity (6 chunks)
  // =========================================================================
  'ch2-l1-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية صحيحة عن التشفير، ولكن أي منها يمثل المقارنة الأصح والأشمل بين التشفير المتماثل والتشفير غير المتماثل؟",
        options: [
          "التشفير المتماثل يستخدم للحروف فقط بينما غير المتماثل يستخدم للأرقام في البطاقات الائتمانية.",
          "التشفير غير المتماثل لا يحتاج لأي مفاتيح رياضية سرية أثناء تبادل البيانات.",
          "المتماثل يستخدم مفتاحاً سرياً واحداً مشتركاً للتشفير وفك التشفير ويمتاز بالسرعة الفائقة، بينما غير المتماثل يستخدم زوج مفاتيح (عام للتشفير وخاص لفك التشفير) ويحل معضلة تبادل المفاتيح بأمان عبر الشبكات المفتوحة.",
          "التشفير المتماثل أكثر أماناً في كافة الظروف ولا يمكن اختراقه أبداً مقارنة بغير المتماثل."
        ],
        correctIndex: 2,
        explanation: "الخيار (ج) هو المقارنة الأكاديمية الشاملة: يوضح طبيعة المفاتيح في كل نوع، الفارق في السرعة، وميزة غير المتماثل الحاسمة في حل معضلة توزيع المفاتيح بأمان."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "في نموذج أمن المعلومات الأساسي (CIA Triad)، يرمز حرف 'I' إلى مبدأ:",
        options: [
          "الهوية (Identity)",
          "النزاهة وسلامة البيانات (Integrity) من التعديل غير المصرح به",
          "التفتيش والمراقبة (Inspection)",
          "التفاعل والتواصل (Interaction)"
        ],
        correctIndex: 1,
        explanation: "نموذج CIA يتألف من: السرية (Confidentiality)، النزاهة وسلامة البيانات (Integrity)، والتوافر (Availability)."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements about encryption are true, but which one represents the MOST accurate and comprehensive comparison between symmetric and asymmetric encryption?",
        options: [
          "Symmetric encryption handles text characters while asymmetric is restricted to credit card digits.",
          "Asymmetric encryption does not require any mathematical private keys during key exchange.",
          "Symmetric uses a single shared secret key for both encryption and decryption with high computational speed, while asymmetric uses a mathematically linked keypair (public to encrypt, private to decrypt) solving the critical key-exchange challenge over untrusted networks.",
          "Symmetric encryption is universally more secure under all conditions and unbreakable compared to asymmetric."
        ],
        correctIndex: 2,
        explanation: "Option C provides the complete textbook comparison: single shared key vs public/private keypair, speed advantages, and key-distribution security."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "In the foundational Information Security triad (CIA Triad), the letter 'I' stands for:",
        options: [
          "Identity",
          "Integrity (safeguarding data from unauthorized modification)",
          "Inspection",
          "Interaction"
        ],
        correctIndex: 1,
        explanation: "The CIA Triad comprises Confidentiality (secrecy), Integrity (trustworthy accuracy), and Availability (accessibility)."
      }
    ]
  },

  'ch2-l1-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية تصف استخدامات المفاتيح، ولكن ما هو التوصيف الأصح والأشمل لكيفية عمل 'التوقيع الرقمي' وتحقيقه لخاصية عدم الإنكار (Non-Repudiation)؟",
        options: [
          "قيام المرسل بكتابة اسمه بخط يده ومسحه ضوئياً ثم إرفاقه كصورة في نهاية الملف.",
          "تشفير الرسالة بالكامل باستخدام كلمة مرور مشتركة يعرفها الطرفان فقط.",
          "قيام المرسل بتوليد بصمة تجزئة (Hash) للرسالة وتشفيرها بمفتاحه الخاص، ليتسنى للمستقبل فكها بمفتاح المرسل العام وإثبات مصدرها وصحتها وسلامتها من أي تلاعب دون إمكانية إنكارها.",
          "إرسال إشعار استلام رسمي من خلال مزود خدمة البريد الإلكتروني."
        ],
        correctIndex: 2,
        explanation: "التوقيع الرقمي يعتمد على تجزئة الرسالة (Hashing) ثم تشفير البصمة بالمفتاح الخاص للمرسل، مما يثبت الهوية والنزاهة وعدم الإنكار قطيعاً."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "الجهة المسؤولة رسمياً عن إصدار الشهادات الرقمية والتحقق من هوية ملاك المواقع على الإنترنت تُعرف باسم سلطة ____ (CA).",
        options: ["الشهادات", "الاتصالات", "الحماية", "المراقبة"],
        missingWord: "الشهادات",
        hint: "Certificate Authority تترجم سلطة...",
        explanation: "سلطة الشهادات (Certificate Authority - CA) هي الطرف الثالث الموثوق الذي يوقع الشهادات الرقمية للتحقق من هوية المواقع."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following describe cryptographic mechanisms, but which one represents the MOST accurate and comprehensive explanation of how a 'Digital Signature' achieves Non-Repudiation?",
        options: [
          "The sender handwriting their name, scanning it, and attaching the graphic image to the document.",
          "Encrypting the full document body with a pre-shared password known to both parties.",
          "The sender generates a cryptographic hash of the message and encrypts that digest using their Private Key; recipients decrypt it using the sender's Public Key, conclusively proving author authenticity, message integrity, and undeniable origin.",
          "Requesting a certified delivery receipt from the email service provider."
        ],
        correctIndex: 2,
        explanation: "Option C explains the exact technical workflow: hashing the payload, encrypting the hash with the sender's private key, and enabling public verification."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "The recognized trusted third-party organization that validates entity identity and issues SSL/TLS certificates is known as the Certificate ____ (CA).",
        options: ["Authority", "Agency", "Auditor", "Administrator"],
        missingWord: "Authority",
        hint: "The 'A' in CA.",
        explanation: "A Certificate Authority (CA) verifies website ownership and digitally signs public key certificates."
      }
    ]
  },

  'ch2-l2-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع الخيارات التالية تمثل أدواراً أمنية، ولكن ما هو الغرض الأصح والأشمل لعزل الخوادم العامة (مثل خادم الويب) داخل المنطقة منزوعة السلاح (DMZ)؟",
        options: [
          "زيادة سرعة استجابة خادم الويب للزوار القادمين من الشبكة الخارجية.",
          "منع موظفي الشركة من تصفح منصات الفيديو والتواصل الاجتماعي أثناء ساعات الدوام.",
          "وضع الخوادم المتاحة للجمهور في شبكة فرعية وسيطة معزولة بحيث إذا تعرضت للاختراق من الإنترنت لا يتمكن المهاجم من النفاذ المباشر إلى الشبكة الداخلية الحساسة وقواعد بيانات الشركة.",
          "تقليل استهلاك الطاقة الكهربائية لأجهزة الراوتر والجدران النارية."
        ],
        correctIndex: 2,
        explanation: "الهدف الاستراتيجي للـ DMZ هو توفير حاجز أمني وسيط يعزل الخوادم المعرضة للإنترنت عن الشبكة الداخلية الحساسة (Internal Intranet)."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "يفحص جدار الحماية ذو الحالة (Stateful Inspection Firewall) حزم البيانات من خلال:",
        options: [
          "فحص حجم الملفات المرفقة فقط",
          "تتبع حالة الاتصال النشطة وسياق جلسة العمل ومقارنتها بقواعد الحماية المحددة بدلاً من فحص الحزمة منفردة",
          "قراءة محتوى النصوص والبريد الإلكتروني كلمة بكلمة يدوياً",
          "إغلاق كافة المنافذ في عطلات نهاية الأسبوع تلقائياً"
        ],
        correctIndex: 1,
        explanation: "جدار الحماية ذو الحالة يحتفظ بجدول حالة الاتصالات النشطة، مما يمنع الحزم الخبيثة الموجهة عشوائياً بدون طلب مسبق."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following represent defensive practices, but which one represents the MOST accurate and comprehensive architectural purpose of a Demilitarized Zone (DMZ)?",
        options: [
          "Accelerating packet throughput for external web traffic visitors.",
          "Restricting internal staff from accessing recreational streaming websites during working hours.",
          "Isolating publicly accessible internet-facing servers within a segregated perimeter subnetwork so that if a public server is compromised, the attacker is blocked from direct access to the sensitive internal corporate intranet and databases.",
          "Conserving electrical wattage on edge router hardware."
        ],
        correctIndex: 2,
        explanation: "Option C captures the fundamental perimeter architecture: a sacrificial buffer zone containing public servers while safeguarding internal intranet assets."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "A Stateful Inspection Firewall evaluates incoming data packets by:",
        options: [
          "Checking file size byte counts exclusively",
          "Tracking the dynamic state and context of established connection sessions against security rules rather than inspecting packets in isolation",
          "Reading plain text email contents manually line by line",
          "Closing all TCP ports automatically on weekend nights"
        ],
        correctIndex: 1,
        explanation: "Stateful inspection monitors connection states in a state table, recognizing legitimate return traffic and dropping unsolicited malicious probes."
      }
    ]
  },

  'ch2-l2-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية صحيحة حول أدوات حماية الشبكات، ولكن ما هو الفارق الجوهري الأصح والأشمل بين نظام IDS ونظام IPS في الدفاع السيبراني؟",
        options: [
          "نظام IDS يعمل على الحواسيب المحمولة بينما نظام IPS يعمل على الهواتف الذكية فقط.",
          "نظام IDS برنامج مجاني مفتوح المصدر بينما نظام IPS يتطلب اشتراكاً شهرياً دائماً.",
          "نظام IDS يكتفي برصد حركة المرور وتحليلها وإرسال تنبيهات للمسؤول عند اكتشاف هجوم دون إيقافه (Passive Monitoring)، بينما نظام IPS يتصل مباشرة في مسار الشبكة (In-line) ويتدخل فورياً لحجب وحظر حركة المرور الخبيثة وإيقاف الهجوم (Active Prevention).",
          "نظام IDS مخصص لرسائل البريد الإلكتروني بينما IPS مخصص للمواقع الحكومية فقط."
        ],
        correctIndex: 2,
        explanation: "الفارق الجوهري هو أن IDS نظام مراقبة سلبي ينبه فقط (Detection)، بينما IPS نظام حماية نشط مدمج يتدخل لمنع الهجوم وإغلاق المنفذ (Prevention)."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "في تقنيات اكتشاف الهجمات، يتميز الكشف المعتمد على الشذوذ (Anomaly-based Detection) بقدرته الفريدة على:",
        options: [
          "مطابقة التواقيع القديمة المحفوظة في ملف التحديثات فقط",
          "اكتشاف الهجمات والتهديدات الجديدة غير المعروفة مسبقاً (Zero-day) عبر رصد أي انحراف عن السلوك الطبيعي المعتاد للشبكة",
          "تسريع اتصال الإنترنت في أوقات الذروة",
          "فحص كلمات المرور المكتوبة بخط اليد"
        ],
        correctIndex: 1,
        explanation: "الكشف المعتمد على الشذوذ يبني نموذجاً للسلوك الطبيعي للشبكة، مما يجعله قادراً على كشف ثغرات اليوم الصفري (Zero-day) التي ليس لها توقيع سابق."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements about network sensors are true, but which one represents the MOST accurate and comprehensive distinction between IDS and IPS?",
        options: [
          "IDS runs on desktop laptops while IPS runs exclusively on mobile edge routers.",
          "IDS is open-source freeware while IPS requires proprietary enterprise licensing.",
          "An IDS passively monitors network traffic out-of-band and alerts administrators upon suspicious detection without altering packets, whereas an IPS sits in-line directly in the traffic flow and actively terminates malicious connections in real time to prevent breaches.",
          "IDS inspects email headers while IPS inspects government websites only."
        ],
        correctIndex: 2,
        explanation: "Option C defines the fundamental distinction: passive monitoring/alerting (IDS) versus active in-line drop/prevention (IPS)."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "In threat detection architectures, Anomaly-based Detection is uniquely superior in its capability to:",
        options: [
          "Match known malware signatures recorded in legacy virus definition lists",
          "Uncover novel zero-day attacks by detecting statistical deviations from standard baseline network behavior",
          "Speed up cellular download bandwidth during peak business hours",
          "Check handwritten user passwords on access cards"
        ],
        correctIndex: 1,
        explanation: "Because anomaly detection flags departures from normal baselines, it can identify brand-new zero-day exploits before vendor signatures exist."
      }
    ]
  },

  'ch2-l3-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع الإجراءات التالية جزء من التعامل مع الهجمات السيبرانية، ولكن ما هو التوصيف والترتيب الأصح والأشمل للمراحل الست المعتمدة عالمياً في دورة الاستجابة للحوادث السيبرانية؟",
        options: [
          "الإيقاف، الإبلاغ، فرمتة الأجهزة، شراء حواسيب جديدة، الإعلان في الصحف، المراقبة.",
          "التحقيق الجنائي، رفع الدعاوى القضائية، استبدال كلمات المرور، إعادة التشغيل، المراقبة.",
          "الاستعداد والتأهب (Preparation)، ثم الاكتشاف والتحليل (Detection & Analysis)، ثم الاحتواء (Containment)، ثم الاستئصال وإزالة التهديد (Eradication)، ثم التعافي واستعادة العمليات (Recovery)، وأخيراً استخلاص الدروس المستفادة (Lessons Learned).",
          "فصل كابل الإنترنت والكهرباء والانتظار حتى انتهاء الهجوم تلقائياً."
        ],
        correctIndex: 2,
        explanation: "الخيار (ج) يمثل الإطار الأكاديمي القياسي (NIST / SANS) لإدارة الحوادث السيبرانية المعتمد في كتاب الوزارة."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "مرحلة ____ في دورة الاستجابة للحوادث تهدف إلى عزل الأنظمة المصابة فوراً لمنع انتشار التهديد والبرمجيات الخبيثة لباقي الشبكة.",
        options: ["الاحتواء", "التعافي", "الاستعداد", "الاستئصال"],
        missingWord: "الاحتواء",
        hint: "عزل المشكلة في نطاق ضيق.",
        explanation: "الاحتواء (Containment) هو الإجراء العاجل لمنع تفاقم الضرر وانتشار البرمجية الخبيثة."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following steps relate to incident management, but which one represents the MOST accurate and comprehensive sequence of the standard 6 stages of the Incident Response Lifecycle?",
        options: [
          "Powering off, reporting, wiping hard drives, purchasing new workstations, press releases, monitoring.",
          "Forensic litigation, lawsuit filing, password rotation, rebooting servers, monitoring.",
          "Preparation, Detection & Analysis, Containment (limiting spread), Eradication (rooting out threats), Recovery (restoring operations safely), and Lessons Learned (post-incident review).",
          "Pulling power cords and waiting for the malware to de-escalate on its own."
        ],
        correctIndex: 2,
        explanation: "Option C details the internationally recognized NIST/SANS incident handling framework certified in the Ministry syllabus."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "The critical stage in incident response focused on isolating compromised hosts to halt lateral propagation of malware is ____.",
        options: ["Containment", "Recovery", "Preparation", "Eradication"],
        missingWord: "Containment",
        hint: "Keeping the infection locked within a boundary.",
        explanation: "Containment isolates compromised nodes via network segmentation to prevent lateral infection across the enterprise."
      }
    ]
  },

  'ch2-l3-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية تصف مفاهيم أمنية، ولكن أي منها يمثل العلاقة الأصح والأشمل رياضياً ومفاهيمياً بين الخطر (Risk) والتهديد (Threat) والثغرة (Vulnerability)؟",
        options: [
          "الخطر والتهديد والثغرة هي مسميات مترادفة تماماً لشيء واحد في الأمن السيبراني.",
          "الثغرة تحدث بسبب الموظفين فقط بينما التهديد يأتي من البرمجيات الخارجية دائماً.",
          "الخطر هو نتاج احتمالية استغلال تهديد خارجي (Threat) لثغرة أمنية داخلية قائمة (Vulnerability)، مضروباً في حجم الأثر السلبي أو الضرر المتوقع على أصول المنشأة (Risk = Threat × Vulnerability × Impact).",
          "التهديد هو التكلفة المالية للبرامج المضادة بينما الخطر هو وقت تعطل الشبكة."
        ],
        correctIndex: 2,
        explanation: "الخيار (ج) هو المعادلة العلمية الأصح: لا يوجد خطر حقيقي بدون وجود ثغرة قابلة للاستغلال من قِبل تهديد ملموس مقترناً بحجم الأثر الناتج."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "يسمى النشاط الأمني المصرح به رسمياً والذي يقوم فيه خبراء بمحاكاة هجمات حقيقية لاكتشاف الثغرات وتصحيحها قبل استغلالها من المهاجمين بـ:",
        options: [
          "الهندسة الاجتماعية الضارة",
          "اختبار الاختراق الأخلاقي (Ethical Penetration Testing)",
          "تشفير قواعد البيانات العشوائي",
          "التثبيت التلقائي للبرمجيات"
        ],
        correctIndex: 1,
        explanation: "اختبار الاختراق الأخلاقي يهدف لاكتشاف نقاط الضعف العملية عبر هجوم محاكى ومصرح به لحماية الأنظمة استباقياً."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements touch on security concepts, but which one represents the MOST accurate and comprehensive definition of the mathematical relationship between Risk, Threat, and Vulnerability?",
        options: [
          "Risk, Threat, and Vulnerability are identical synonymous buzzwords in cybersecurity.",
          "Vulnerabilities originate from internal employees while Threats exclusively originate from software code.",
          "Risk is the probabilistic intersection where an active Threat exploits an existing unpatched Vulnerability, weighted by the quantifiable operational Impact on the enterprise (Risk = Threat × Vulnerability × Impact).",
          "Threat is the fiscal cost of anti-virus subscriptions while Risk is network latency."
        ],
        correctIndex: 2,
        explanation: "Option C defines the standard risk equation: Risk exists only when a viable threat intersects with an unpatched vulnerability producing negative impact."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "The authorized security practice where cybersecurity specialists simulate real-world cyberattacks to uncover and remediate flaws proactively is:",
        options: [
          "Malicious social engineering",
          "Ethical Penetration Testing (Pen Testing)",
          "Random database cipher scrambling",
          "Unattended software deployment"
        ],
        correctIndex: 1,
        explanation: "Penetration Testing actively assesses defenses by ethically simulating adversary methods under strict rules of engagement."
      }
    ]
  },

  // =========================================================================
  // CHAPTER 3: Web Applications (6 chunks)
  // =========================================================================
  'ch3-l1-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية صحيحة عن مكونات مواقع الويب، ولكن ما هو التوصيف الأصح والأشمل للبنية ثلاثية الطبقات (3-Tier Architecture) ومسؤولية كل طبقة؟",
        options: [
          "طبقة للماوس، وطبقة للشاشة، وطبقة للوحة المفاتيح.",
          "طبقة للألوان والتصميم، وطبقة للخطوط، وطبقة لملفات الصور التوضيحية.",
          "طبقة العرض Presentation (واجهة العميل بالمتصفح)، وطبقة منطق التطبيق Application Logic (معالجة الأوامر وقواعد العمل بالخادم)، وطبقة البيانات Data Tier (تخزين واسترجاع قواعد البيانات وتأمينها).",
          "طبقة لأجهزة أندرويد، وطبقة لأجهزة أبل، وطبقة للحواسيب الشخصية."
        ],
        correctIndex: 2,
        explanation: "البنية ثلاثية الطبقات هي المعيار الصناعي: فصل العرض (Frontend) عن المنطق والمعالجة (Backend) عن إدارة قواعد البيانات (Database)."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "ما الفائدة المعمارية الأهم لفصل طبقة منطق التطبيق عن طبقة قاعدة البيانات في بنية 3-Tier؟",
        options: [
          "تقليل حجم ملفات HTML فقط",
          "تحسين الأمان وقابلية التوسع (Scalability) وتيسير صيانة وتحديث كل طبقة دون التأثير على الطبقات الأخرى",
          "جعل الموقع يعمل بالكامل بدون اتصال بالإنترنت",
          "الاستغناء عن كتابة كود التنسيق CSS نهائياً"
        ],
        correctIndex: 1,
        explanation: "الفصل بين الطبقات يمنح مرونة عالية في الترقية وسرعة الصيانة وعزل بيانات العملاء الحساسة عن الوصول المباشر."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following describe web architecture elements, but which one represents the MOST accurate and comprehensive description of the 3-Tier Architecture and its layer responsibilities?",
        options: [
          "A hardware tier for the mouse, a tier for the display monitor, and a tier for the keyboard.",
          "A tier for visual colors, a tier for typography, and a tier for media assets.",
          "The Presentation Tier (client browser interface), the Application Logic Tier (business rules and backend server compute), and the Data Tier (relational/NoSQL database storage, queries, and security).",
          "A mobile tier for Android, a tier for iOS, and a desktop PC tier."
        ],
        correctIndex: 2,
        explanation: "Option C defines 3-Tier architecture: modular decoupling of user interface (Tier 1), business logic (Tier 2), and persistence (Tier 3)."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "What is the primary architectural benefit of decoupling the Application Logic Tier from the Data Tier in 3-Tier applications?",
        options: [
          "Shrinking static HTML file sizes slightly",
          "Enhancing system security, modular scalability, and enabling independent updates to business logic without breaking database schemas",
          "Enabling the website to function completely without any internet connection",
          "Eliminating the need to write CSS style sheets"
        ],
        correctIndex: 1,
        explanation: "Decoupling enables independent horizontal scaling, easier code maintenance, and prevents direct client exposure to database engines."
      }
    ]
  },

  'ch3-l1-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية تصف تصفح المواقع، ولكن ما هو الفارق الأصح والأشمل بين بروتوكول HTTP وبروتوكول HTTPS في نقل بيانات الويب؟",
        options: [
          "بروتوكول HTTPS مخصص لعرض مقاطع الفيديو عالية الدقة فقط بينما HTTP للنصوص البسيطة.",
          "بروتوكول HTTP يعمل على شبكات الجوال بينما HTTPS يعمل على شبكات الألياف الضوئية فقط.",
          "بروتوكول HTTP ينقل البيانات كنصوص صريحة قابلة للتنصت والاعتراض، بينما HTTPS يدمج بروتوكول التشفير الآمن (TLS/SSL) لضمان سرية البيانات وسلامتها والتحقق من هوية الموقع الرقمية.",
          "بروتوكول HTTPS يجعل سرعة تحميل صفحات الإنترنت أضعاف بروتوكول HTTP دائماً."
        ],
        correctIndex: 2,
        explanation: "الخيار (ج) هو الفارق الأمني الجوهري: إضافة التشفير عبر TLS/SSL في HTTPS يمنع هجمات الوسيط (Man-in-the-Middle) ويحمي كلمات المرور والبيانات."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "رمز حالة الاستجابة في بروتوكول HTTP الذي يدل على أن الصفحة المطلوبة غير موجودة على الخادم هو رقم ____.",
        options: ["404", "200", "500", "301"],
        missingWord: "404",
        hint: "رمز الخطأ الشهير للملف غير الموجود.",
        explanation: "رمز 404 Not Found يعني أن الخادم استقبل الطلب ولكن لم يجد المسار المطلوب."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following describe web protocols, but which one represents the MOST accurate and comprehensive distinction between HTTP and HTTPS?",
        options: [
          "HTTPS is designed for high-resolution video streams while HTTP is for plain text.",
          "HTTP operates on mobile cellular towers while HTTPS operates on fiber-optic modems only.",
          "HTTP transmits data packets in cleartext vulnerable to eavesdropping and interception, whereas HTTPS incorporates cryptographic TLS/SSL layers ensuring confidentiality, data integrity, and server authentication.",
          "HTTPS always triples the network transfer bandwidth speed compared to HTTP."
        ],
        correctIndex: 2,
        explanation: "Option C explains the cryptographic reality: HTTPS encapsulates HTTP traffic inside TLS/SSL encryption, mitigating Man-in-the-Middle sniffing."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "The standard HTTP response status code signifying that the requested resource could not be found on the server is ____.",
        options: ["404", "200", "500", "301"],
        missingWord: "404",
        hint: "The world-famous 'Not Found' client error code.",
        explanation: "HTTP 404 indicates that the server successfully communicated but the specific URI path could not be located."
      }
    ]
  },

  'ch3-l2-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع البدائل التالية تصف وسوم لغة HTML، ولكن ما هو المبرر البرمجي الأصح والأشمل لاستخدام وسوم HTML5 الدلالية (مثل `<header>`, `<nav>`, `<article>`, `<main>`) بدلاً من مجرد استخدام `<div>` لكل شيء؟",
        options: [
          "وسوم HTML5 الدلالية تضيف تلقائياً ألواناً وظلالاً وتأثيرات حركية جميلة دون الحاجة لكود CSS.",
          "وسوم `<div>` أصبحت ملغاة قانونياً ولا تعمل في المتصفحات الحديثة إطلاقاً.",
          "تعزيز دلالة المعنى لبنية الصفحة مما يدعم فهرسة محركات البحث (SEO)، ويحسن وصول برمجيات ذوي الاحتياجات الخاصة (Accessibility)، ويسهل صيانة وفهم الشيفرة البرمجية للمطورين.",
          "تقليل استهلاك الذاكرة العشوائية للحاسوب بمقدار النصف عند تصفح الصفحة."
        ],
        correctIndex: 2,
        explanation: "الوسوم الدلالية (Semantic Tags) لا تمنح تنسيقاً مرئياً تلقائياً، ولكنها توضح للمتصفح ومحركات البحث وقارئات الشاشة المعنى الحقيقي لكل جزء من الصفحة."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "الوسم المناسب دلالياً في لغة HTML5 لاحتواء روابط التنقل الرئيسية بين صفحات الموقع هو وسم:",
        options: ["`<aside>`", "`<nav>`", "`<section>`", "`<footer>`"],
        correctIndex: 1,
        explanation: "وسم `<nav>` مخصص دلالياً لحاويات روابط التنقل الرئيسية (Navigation)."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following describe HTML markup tags, but which one represents the MOST accurate and comprehensive architectural justification for employing Semantic HTML5 elements (`<header>`, `<nav>`, `<article>`, `<main>`) instead of generic `<div>` tags?",
        options: [
          "Semantic tags automatically render pre-styled gradients and animations without requiring CSS.",
          "Generic `<div>` tags have been legally deprecated and fail to render in modern browsers.",
          "Imbuing page structure with meaningful semantics, which significantly boosts Search Engine Optimization (SEO), enhances assistive screen-reader accessibility (A11y), and improves developer maintainability.",
          "Reducing workstation RAM consumption by half during web browsing."
        ],
        correctIndex: 2,
        explanation: "Semantic elements communicate content roles to user agents, search web spiders, and assistive accessibility technologies."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "The semantically correct HTML5 tag designated for encapsulating major site navigation link blocks is:",
        options: ["`<aside>`", "`<nav>`", "`<section>`", "`<footer>`"],
        correctIndex: 1,
        explanation: "The `<nav>` element is specifically intended for blocks containing navigational links."
      }
    ]
  },

  'ch3-l2-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع الخيارات التالية تمثل أدوات تنسيق في CSS، ولكن ما هو المبدأ الأصح والأشمل لـ 'التصميم المتجاوب' (Responsive Web Design)؟",
        options: [
          "تكبير الخطوط تلقائياً فقط عند الضغط على زر التكبير في لوحة المفاتيح.",
          "إنشاء موقعين منفصلين تماماً بروابط مختلفة واحد مخصص للجوال وآخر مخصص للحاسوب المكتبي.",
          "بناء صفحة ويب مرنة واحدة تتكيف أحجام عناصرها وتخطيطها بسلاسة مع كافة أبعاد الشاشات والأجهزة المختلفة باستخدام استعلامات الوسائط (Media Queries) والشبكات والتخطيطات المرنة.",
          "منع فتح الموقع على أي شاشة يقل عرضها عن 1000 بكسل لحماية التنسيق."
        ],
        correctIndex: 2,
        explanation: "التصميم المتجاوب يعني كود واحد وموقع واحد يتأقلم تلقائياً مع شاشة الهاتف والتابلت والحاسوب عبر Media Queries وشبكات CSS المرنة."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "في لغة CSS3، يُستخدم نموذج تخطيط ____ لتوزيع ومحاذاة العناصر بمرونة عالية في بُعد واحد (إما صف أو عمود).",
        options: ["Flexbox", "Grid", "Table", "Float"],
        missingWord: "Flexbox",
        hint: "الصندوق المرن أحادي البعد.",
        explanation: "نموذج Flexbox ممتاز في تنظيم ومحاذاة العناصر في بعد واحد (One-dimensional layout)."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following represent styling practices, but which one represents the MOST accurate and comprehensive principle of Responsive Web Design?",
        options: [
          "Enlarging typography font sizes only when a user presses keyboard zoom keys.",
          "Building two completely separate websites under different domains for phones and desktops.",
          "Engineering a unified dynamic codebase whose layouts, imagery, and typography fluidly adapt across all device viewports using CSS Media Queries, flexible fluid grids, and modern layout models.",
          "Blocking client connections if screen widths measure under 1000 pixels."
        ],
        correctIndex: 2,
        explanation: "Option C defines responsive design: a single responsive codebase fluidly adjusting to smartphones, tablets, and monitors via media queries and fluid grids."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "In modern CSS3 layout design, the ____ module is specifically optimized for distributing and aligning items along a single dimension (either a row or a column).",
        options: ["Flexbox", "Grid", "Table", "Float"],
        missingWord: "Flexbox",
        hint: "The flexible box layout model.",
        explanation: "Flexbox provides 1-dimensional alignment along a primary axis (row or column)."
      }
    ]
  },

  'ch3-l3-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية صحيحة عن شجرة عناصر DOM في المتصفح، ولكن ما هو التوصيف الأصح والأشمل لعلاقة JavaScript بـ DOM؟",
        options: [
          "تقوم JavaScript بحفظ نسخة من شجرة DOM في قاعدة بيانات MySQL على الخادم كل دقيقة.",
          "لغة JavaScript تحل محل لغة HTML في بناء البنية الهيكلية الأولية من نقطة الصفر دائماً.",
          "تمثل DOM واجهة برمجية تمثل صفحة الويب كشجرة كائنات تفاعلية في ذاكرة المتصفح، مما يمكن JavaScript من قراءة عناصر الصفحة وتعديل نصوصها وتنسيقاتها والاستجابة لنقرات وأحداث المستخدم ديناميكياً.",
          "شجرة DOM وظيفتها حماية أكواد الجافاسكريبت من السرقة والتشفير."
        ],
        correctIndex: 2,
        explanation: "شجرة DOM هي الجسر الذي يربط بين هيكل الصفحة وكود JavaScript؛ فتحول وسوم HTML إلى كائنات برمجية قابلة للتعديل اللحظي عند وقوع الأحداث (Events)."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "الدالة الأكثر شيوعاً في JavaScript للوصول المباشر لعنصر محدد في الصفحة عبر قيمة معرّفه الفريد (ID) هي:",
        options: [
          "`console.log()`",
          "`document.getElementById()`",
          "`window.alert()`",
          "`localStorage.setItem()`"
        ],
        correctIndex: 1,
        explanation: "`document.getElementById('id')` تُرجع مرجعاً برمجياً مباشراً للعنصر ذي المعرف المحدد للتعديل عليه."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following statements about the Document Object Model (DOM) are valid, but which one represents the MOST accurate and comprehensive description of JavaScript's relationship with the DOM?",
        options: [
          "JavaScript backs up DOM nodes into remote MySQL database tables once every sixty seconds.",
          "JavaScript replaces HTML by generating all initial semantic structure from scratch on load.",
          "The DOM is an in-memory object-oriented API representation of the HTML document, empowering JavaScript to inspect, manipulate, insert, or delete nodes and dynamically respond to user events without page reloads.",
          "The DOM's primary task is encrypting JavaScript strings against reverse engineering."
        ],
        correctIndex: 2,
        explanation: "Option C defines the DOM API: a live object tree in browser memory where JavaScript listens to events and updates styles, attributes, and nodes dynamically."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "The most widely used standard JavaScript DOM method to directly query a single unique HTML element by its specific ID attribute is:",
        options: [
          "`console.log()`",
          "`document.getElementById()`",
          "`window.alert()`",
          "`localStorage.setItem()`"
        ],
        correctIndex: 1,
        explanation: "`document.getElementById()` retrieves a reference to the element matching the specified unique ID."
      }
    ]
  },

  'ch3-l3-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية تصف الاتصال بين المتصفح والخادم، ولكن ما هي الميزة الأصح والأشمل لاستخدام دالة `fetch()` والاتصال غير المتزامن (AJAX) في تطبيقات الويب الحديثة؟",
        options: [
          "إمكانية فتح صفحات الويب دون الحاجة لوجود اشتراك إنترنت منزلي.",
          "إغلاق نافذة المتصفح تلقائياً فور انتهاء تحميل البيانات المالية الحساسة.",
          "تبادل البيانات مع الخوادم السحابية في الخلفية وتحديث أجزاء محددة من الصفحة بمرونة دون الحاجة لإعادة تحميل (Reload/Refresh) الصفحة بالكامل، مما يوفر تجربة سريعة وسلسة للمستخدم.",
          "تشغيل ملفات الفيديو بدقة فائقة دون الحاجة لبطاقة رسوميات."
        ],
        correctIndex: 2,
        explanation: "جوهر الاتصال غير المتزامن (Asynchronous Fetch / AJAX) هو جلب البيانات وتحديث واجهة المستخدم في الخلفية دون إعادة تحميل الصفحة كاملاً."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "صيغة تبادل البيانات النصية الأكثر انتشاراً واعتماداً بين خوادم الويب وتطبيقات العميل هي صيغة ____.",
        options: ["JSON", "XML", "CSV", "TXT"],
        missingWord: "JSON",
        hint: "JavaScript Object Notation.",
        explanation: "صيغة JSON هي المعيار العالمي لتبادل البيانات في واجهات البرمجية (Web APIs) لخفتها وسهولة قراءتها."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following describe client-server interactions, but which one represents the MOST accurate and comprehensive advantage of using asynchronous `fetch()` (AJAX) in modern web applications?",
        options: [
          "Enabling end-users to browse dynamic online websites without an internet service provider.",
          "Automatically closing browser windows once confidential banking queries finish.",
          "Exchanging payload data with backend servers asynchronously in the background and surgically updating targeted UI components without triggering a jarring full page reload.",
          "Streaming 4K video streams without requiring hardware graphics acceleration."
        ],
        correctIndex: 2,
        explanation: "Option C captures the essence of asynchronous programming: non-blocking background network requests updating page state seamlessly."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "The lightweight, text-based data interchange format universally utilized by RESTful APIs and browser clients is ____.",
        options: ["JSON", "XML", "CSV", "TXT"],
        missingWord: "JSON",
        hint: "JavaScript Object Notation acronym.",
        explanation: "JSON (JavaScript Object Notation) is the ubiquitous standard data format for web APIs."
      }
    ]
  },

  // =========================================================================
  // CHAPTER 4: Web Design & Media (8 chunks)
  // =========================================================================
  'ch4-l1-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع البدائل التالية تصف أنواع الصور الرقمية، ولكن ما هي المقارنة الأصح والأشمل علمياً بين الصور النقطية (Raster) والصور المتجهة (Vector) في تصميم الويب؟",
        options: [
          "الصور النقطية تظهر باللونين الأبيض والأسود فقط بينما الصور المتجهة ملونة دائماً.",
          "الصور المتجهة مخصصة للطباعة الورقية فقط بينما الصور النقطية مخصصة للشاشات الرقمية.",
          "الصور النقطية تتكون من شبكة بكسلات ثابتة وتفقد حدتها وتتشوه عند التكبير (مثل JPG و PNG)، بينما الصور المتجهة تعتمد على معادلات رياضية هندسية وتحافظ على وضوحها التام عند أي نسبة تكبير (مثل SVG).",
          "الصور النقطية حجم ملفاتها يكون صفراً دائماً في ذاكرة التخزين."
        ],
        correctIndex: 2,
        explanation: "الفارق العلمي الحاسم: النقطية شبكة بكسلات تتشوه بالتكبير، بينما المتجهة معادلات رياضية هندسية لا تفقد حدتها إطلاقاً."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "أي امتدادات الصور التالية يعتبر مثالاً على الصور المتجهة (Vector) المدعومة والمثالية للشعارات والأيقونات في الويب؟",
        options: ["JPG", "PNG", "SVG", "BMP"],
        correctIndex: 2,
        explanation: "صيغة SVG (Scalable Vector Graphics) هي صيغة الصور المتجهة المعتمدة في الويب؛ حيث تحافظ على حدتها في جميع الشاشات وحجمها خفيف."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following describe digital graphic formats, but which one represents the MOST accurate and comprehensive scientific comparison between Raster and Vector imagery?",
        options: [
          "Raster images are strictly monochrome grayscale while vector images are full-color.",
          "Vector graphics are designed exclusively for physical paper printers while raster is for web.",
          "Raster images are composed of fixed pixel grids that pixelate and lose fidelity when scaled up (e.g., JPG, PNG), whereas Vector graphics are generated from mathematical coordinate formulas that scale infinitely without any loss of sharpness (e.g., SVG).",
          "Raster file sizes always measure zero kilobytes in browser cache."
        ],
        correctIndex: 2,
        explanation: "Option C explains the fundamental mathematical distinction: fixed pixel arrays (raster) versus resolution-independent geometric formulas (vector)."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "Which of the following graphic file extensions is a native XML-based Vector format ideal for responsive icons and logos on the web?",
        options: ["JPG", "PNG", "SVG", "BMP"],
        correctIndex: 2,
        explanation: "SVG (Scalable Vector Graphics) renders resolution-independent shapes directly in the browser DOM."
      }
    ]
  },

  'ch4-l1-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع المبادئ التالية مهمة في تصميم المواقع، ولكن ما هي المبادئ الأربعة الأصح والأشمل التي بنيت عليها معايير إتاحة الويب العالمية لذوي الاحتياجات الخاصة (مبادئ WCAG - POUR)؟",
        options: [
          "البساطة، التكلفة المنخفضة، تقليل الإعلانات، وزيادة الأرباح التجارية.",
          "السرعة، والتشفير الأمني، والتوافق مع الهواتف الذكية، والتحديث التلقائي.",
          "سهولة الإدراك الحسي (Perceivable)، وقابلية التشغيل والتنقل (Operable)، وسهولة الفهم والاستيعاب (Understandable)، والمتانة والتوافق مع التقنيات المساعدة (Robust).",
          "الألوان الفاقعة، والخطوط الكبيرة، والمؤثرات الصوتية، وكثرة الروابط التفاعلية."
        ],
        correctIndex: 2,
        explanation: "مبادئ WCAG الأربعة العالمية تُختصر في كلمة POUR: قابل للإدراك، قابل للتشغيل، مفهوم، ومتين."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "إضافة النص البديل `alt` لصور صفحات الويب يساعد بشكل حاسم برمجيات قارئ ____ في تمكين فاقدي البصر من معرفة محتوى الصورة.",
        options: ["الشاشة", "الباركود", "الأقراص", "البصمة"],
        missingWord: "الشاشة",
        hint: "برنامج ينطق محتوى الشاشة للمكفوفين.",
        explanation: "قارئ الشاشة (Screen Reader) يقرأ خاصية `alt` لتمكين المكفوفين من فهم محتوى الصورة ورسالتها."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following are good design considerations, but which one represents the MOST accurate and comprehensive set of the 4 core pillars of the Web Content Accessibility Guidelines (WCAG - POUR)?",
        options: [
          "Simplicity, minimal operational costs, ad reduction, and commercial profit maximization.",
          "Network speed, encryption security, mobile compatibility, and automated updating.",
          "Perceivable (information presented in ways users can perceive), Operable (interface components navigateable by all), Understandable (clear language and predictable interactions), and Robust (compatible with assistive technologies).",
          "Vibrant colors, large typography, audio chimes, and hyperlinked navigation."
        ],
        correctIndex: 2,
        explanation: "Option C defines the foundational POUR principles established by W3C: Perceivable, Operable, Understandable, and Robust."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "Providing descriptive `alt` attributes on web images is critical because assistive ____ readers convert visual imagery into synthesized speech for visually impaired users.",
        options: ["screen", "barcode", "disk", "fingerprint"],
        missingWord: "screen",
        hint: "Software that vocalizes GUI screens.",
        explanation: "Screen readers rely on `alt` attribute text to vocalize image context to visually impaired users."
      }
    ]
  },

  'ch4-l2-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية تصف مجالات تصميم الويب، ولكن ما هو الفارق الأصح والأشمل بين تجربة المستخدم (UX) وواجهة المستخدم (UI)؟",
        options: [
          "واجهة المستخدم تختص بكتابة كود الخادم بينما تجربة المستخدم تختص بمديري الشركات فقط.",
          "تجربة المستخدم تطبق على الحواسيب المحمولة بينما واجهة المستخدم تطبق على الهواتف الذكية.",
          "واجهة المستخدم (UI) تركز على المظهر البصري ونقاط الاتصال الجمالية (كالأزرار والخطوط والألوان والأيقونات)، بينما تجربة المستخدم (UX) تهتم برحلة المستخدم الكلية وشعوره وسهولة وصوله لهدفه برضا وكفاءة وانسيابية.",
          "واجهة المستخدم تهتم بالأمن السيبراني بينما تجربة المستخدم تهتم بالتسويق الإلكتروني فقط."
        ],
        correctIndex: 2,
        explanation: "UI هو ما يراه ويتفاعل معه المستخدم بصرياً (المظهر والجماليات)، بينما UX هو كيف يشعر المستخدم خلال رحلته كاملة (السهولة، الرضا، والكفاءة)."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "تسمى الشخصية التخيلية المبنية على أبحاث واقعية للمستخدمين لتمثيل الشريحة المستهدفة واحتياجاتها وسلوكياتها أثناء عملية التصميم بـ:",
        options: [
          "روبوت المحادثة الآلي",
          "شخصية المستخدم (User Persona)",
          "المشرف الأكاديمي للموقع",
          "ممثل الدعم الفني"
        ],
        correctIndex: 1,
        explanation: "شخصية المستخدم (User Persona) هي تمثيل تركيبي للشريحة المستهدفة يساعد فريق التصميم على اتخاذ قرارات تلبي احتياجات الجمهور الحقيقي."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following describe digital design disciplines, but which one represents the MOST accurate and comprehensive distinction between User Experience (UX) and User Interface (UI)?",
        options: [
          "UI handles backend database servers while UX is exclusively reserved for corporate executives.",
          "UX applies to desktop monitors while UI applies to mobile touchscreens.",
          "UI focuses on the visual presentation and interactive touchpoints (typography, buttons, color harmony, layouts), whereas UX encompasses the holistic user journey, psychological friction, usability, and effortless fulfillment of user goals.",
          "UI governs cybersecurity while UX is purely promotional marketing."
        ],
        correctIndex: 2,
        explanation: "Option C defines the true relationship: UI is the visual and sensory medium; UX is the cognitive journey, utility, and satisfaction of the interaction."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "A fictional yet data-driven composite profile representing the target audience's demographics, goals, and behavioral patterns in UX design is called a:",
        options: [
          "Conversational chatbot",
          "User Persona",
          "Academic webmaster",
          "Customer support agent"
        ],
        correctIndex: 1,
        explanation: "A User Persona synthesizes research into an archetypal representation guiding empathy-driven design decisions."
      }
    ]
  },

  'ch4-l2-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية تمثل إرشادات لتنسيق الصفحات، ولكن ما هي الحزمة الأصح والأشمل للمبادئ الأربعة الأساسية في نظرية التصميم البصري (مبادئ CRAP)؟",
        options: [
          "الألوان الفاتحة، والإطارات السميكة، والظلال الداكنة، والخطوط المنحنية المائلة.",
          "الصور الكبيرة، والروابط السريعة، وتنوع الخطوط العشوائي، وكثرة الأزرار الملونة.",
          "التباين (Contrast لإبراز الأهمية)، والتكرار (Repetition لتوحيد الهوية)، والمحاذاة (Alignment لترتيب وتوازن العناصر)، والتقارب (Proximity لربط العناصر المترابطة معاً).",
          "البساطة المطلقة، وسرعة التحميل، والتجاوب مع الشاشات، وتأمين كلمات المرور."
        ],
        correctIndex: 2,
        explanation: "مبادئ CRAP الأربعة الشهيرة لروبن ويليامز في التصميم هي: Contrast (التباين)، Repetition (التكرار)، Alignment (المحاذاة)، وProximity (التقارب)."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "مبدأ ____ في نظرية CRAP ينص على وضع العناصر المترابطة وظيفياً بالقرب من بعضها جغرافياً لتقرأ كوحدة واحدة متكاملة.",
        options: ["التقارب", "التباين", "المحاذاة", "التكرار"],
        missingWord: "التقارب",
        hint: "ترجمة كلمة Proximity.",
        explanation: "مبدأ التقارب (Proximity) يقلل الفوضى البصرية ويساعد العين على إدراك العلاقات المنطقية بين العناصر."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following are visual composition guidelines, but which one represents the MOST accurate and comprehensive formulation of the 4 CRAP Design Principles?",
        options: [
          "Pastel colors, heavy drop shadows, rounded borders, and slanted decorative fonts.",
          "Oversized hero images, jump links, randomized fonts, and rainbow button palettes.",
          "Contrast (creating visual hierarchy and focal points), Repetition (establishing visual consistency and rhythm), Alignment (connecting elements along clean visual axes), and Proximity (grouping related elements together to reduce clutter).",
          "Extreme minimalism, fast bandwidth loading, responsive viewport scaling, and password security."
        ],
        correctIndex: 2,
        explanation: "Option C defines Robin Williams' famous CRAP framework: Contrast, Repetition, Alignment, and Proximity."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "The CRAP principle stating that conceptually related items should be grouped close together to be perceived as a cohesive visual unit is ____.",
        options: ["Proximity", "Contrast", "Alignment", "Repetition"],
        missingWord: "Proximity",
        hint: "Physical closeness in visual layout.",
        explanation: "Proximity organizes spatial relationships so related elements form intuitive perceptual chunks."
      }
    ]
  },

  'ch4-l3-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع المقاييس التالية تستخدم في تقييم أداء المواقع، ولكن ما هو التوصيف الأصح والأشمل لـ 'معدل الارتداد' (Bounce Rate) ودلالته في تجربة المستخدم؟",
        options: [
          "سرعة ارتداد نبضات الشبكة بين الراوتر والخادم بالمللي ثانية (Ping).",
          "نسبة الزوار الذين ينقرون على زر الرجوع للخلف في المتصفح ثلاث مرات متتالية.",
          "النسبة المئوية للزوار الذين يدخلون الموقع ثم يغادرونه بعد مشاهدة صفحة واحدة فقط دون التفاعل مع أي روابط، وارتفاعه غالباً ما يشير إلى عدم ملاءمة المحتوى أو بطء التحميل أو سوء تجربة المستخدم.",
          "عدد السلع والمنتجات التي يرجعها المشترون في متجر إلكتروني بعد شرائها."
        ],
        correctIndex: 2,
        explanation: "معدل الارتداد (Bounce Rate) يقيس مغادرة الزوار من أول صفحة دون تفاعل؛ مما يعطي مؤشراً تحليلياً قوياً على مشكلات الجذب أو التصميم."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "في اختبارات قابلية الاستخدام (Usability Testing)، يعتمد الباحثون في تقييم الموقع بشكل أساسي على:",
        options: [
          "توقعات الذكاء الاصطناعي دون أي مشاركة بشرية",
          "ملاحظة وتسجيل سلوك مستخدمين حقيقيين أثناء قيامهم بمهام محددة على الموقع لرصد الصعوبات الواقعية التي تواجههم",
          "سؤال المبرمج الذي أنشأ الموقع عن رأيه الشخصي في جودة عمله",
          "احتساب عدد الأكواد البرمجية المكتوبة في ملفات المشروع"
        ],
        correctIndex: 1,
        explanation: "اختبارات قابلية الاستخدام توفر بيانات نوعية حقيقية عبر مراقبة المستخدم الفعلي أثناء تنفيذه مهام واقعية داخل الموقع."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following metrics appear in analytics dashboards, but which one represents the MOST accurate and comprehensive definition of 'Bounce Rate' and its UX implications?",
        options: [
          "The millisecond ping latency required for ICMP packets to bounce back from a server.",
          "The percentage of users who tap their browser back button three times consecutively.",
          "The percentage of single-page sessions where visitors exit the site from the entrance page without triggering any further interactions or navigating deeper, often indicating mismatched user intent, poor layout, or slow load times.",
          "The volume of returned ecommerce parcels processed by logistics warehouses."
        ],
        correctIndex: 2,
        explanation: "Option C defines Bounce Rate: single-page abandonment without downstream interaction, pointing to usability friction or irrelevant content."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "In qualitative Usability Testing sessions, UX evaluators assess interface efficacy primarily by:",
        options: [
          "Generating synthetic AI projections without human test subjects",
          "Directly observing and recording representative users as they execute specific tasks to pinpoint real-world friction and cognitive hurdles",
          "Asking the lead developer for a subjective evaluation of their own code",
          "Counting the total line count of project source files"
        ],
        correctIndex: 1,
        explanation: "Usability testing observes real humans attempting realistic tasks to uncover genuine UX roadblocks."
      }
    ]
  },

  'ch4-l3-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية تصف فحص الواجهات، ولكن ما هو التوصيف الأصح والأشمل لأسلوب 'التقييم الاستكشافي' (Heuristic Evaluation) في تقييم قابلية الاستخدام؟",
        options: [
          "فحص الموقع عبر برامج مكافحة الفيروسات التلقائية للتأكد من خلوه من البرمجيات الخبيثة.",
          "إجراء استطلاع رأي عام لمتابعي منصات التواصل الاجتماعي عن أجمل لون للخلفية.",
          "مراجعة منهجية خبيرة يقوم بها متخصصون في تجربة الاستخدام لفحص عناصر الواجهة وتدفقاتها ومقارنتها بقواعد ومبادئ استرشادية معترف بها عالمياً (مثل مبادئ نيلسن لقابلية الاستخدام).",
          "قياس قدرة خوادم الويب على تحمل الضغط الميداني عند دخول آلاف الزوار في نفس اللحظة."
        ],
        correctIndex: 2,
        explanation: "التقييم الاستكشافي هو تدقيق خبير (Expert Review) يقيس التوافق مع قواعد نيلسن العشر مثل: وضوح حالة النظام، ومنع الأخطاء، والاتساق."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "إظهار مؤشر تقدم دائري (Loading Spinner) للمستخدم أثناء انتظار معالجة البيانات يجسد المبدأ الاستكشافي لإتاحة رؤية حالة ____.",
        options: ["النظام", "الشبكة", "المعالج", "الشاشة"],
        missingWord: "النظام",
        hint: "Visibility of System Status.",
        explanation: "مبدأ رؤية حالة النظام (Visibility of System Status) يضمن إعلام المستخدم بما يجري في الوقت المناسب لمنع القلق والإحباط."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following describe evaluation techniques, but which one represents the MOST accurate and comprehensive definition of 'Heuristic Evaluation'?",
        options: [
          "Automated vulnerability scanning with antivirus software to check for malicious web scripts.",
          "Publishing informal social media polls asking followers to vote on aesthetic background shades.",
          "A structured inspection method where usability experts systematically evaluate user interface flows against established, empirical usability heuristics (such as Jakob Nielsen's 10 Heuristics).",
          "Stress-testing backend server compute clusters under heavy concurrent HTTP floods."
        ],
        correctIndex: 2,
        explanation: "Option C defines Heuristic Evaluation: an expert review comparing an interface against validated usability rules (consistency, error prevention, feedback)."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "Displaying an animated progress spinner while processing backend queries directly fulfills the heuristic principle: Visibility of ____ Status.",
        options: ["System", "Network", "Processor", "Screen"],
        missingWord: "System",
        hint: "The first Nielsen usability heuristic.",
        explanation: "Visibility of System Status keeps users informed through timely feedback, preventing repeated clicks and uncertainty."
      }
    ]
  },

  'ch4-l4-c1': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية تصف أساليب التطوير، ولكن ما هو التوصيف الأصح والأشمل للمراحل الخمس المتتابعة والمتكررة في منهجية 'التفكير التصميمي' (Design Thinking) لحل المشكلات؟",
        options: [
          "التفكير، البرمجة، التسويق، البيع، وتحصيل الأرباح التجارية.",
          "الشراء، والتركيب، والتجربة العشوائية، والمراقبة، ثم الصيانة الدورية.",
          "التعاطف مع المستخدم (Empathize)، ثم تحديد المشكلة بدقة (Define)، ثم توليد الأفكار الإبداعية (Ideate)، ثم بناء النماذج الأولية السريعة (Prototype)، ثم الاختبار والتحسين (Test).",
          "التخطيط المالي، والتوظيف، والتنفيذ، والدفع، والتوثيق الورقي."
        ],
        correctIndex: 2,
        explanation: "المراحل الخمس الرسمية للتفكير التصميمي (Design Thinking) المعتمدة في المنهج هي: Empathize ← Define ← Ideate ← Prototype ← Test."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "الحرف 'C' في دورة التحسين المستمر للجودة (دورة PDCA) يرمز لمرحلة:",
        options: [
          "إنشاء الحساب (Create)",
          "الفحص والتحقق من النتائج ومقارنتها بالأهداف (Check)",
          "كتابة الشيفرة البرمجية (Code)",
          "ضغط ملفات النظام (Compress)"
        ],
        correctIndex: 1,
        explanation: "دورة PDCA تتألف من: التخطيط (Plan)، التنفيذ (Do)، الفحص والتحقق (Check)، والتصرف والتحسين (Act)."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following describe development models, but which one represents the MOST accurate and comprehensive sequence of the 5 iterative stages of Design Thinking?",
        options: [
          "Thinking, coding, marketing, selling, and collecting commercial revenues.",
          "Purchasing, installing, trial testing, monitoring, and scheduled maintenance.",
          "Empathize (researching user needs), Define (synthesizing core problem statements), Ideate (generating diverse creative solutions), Prototype (building quick low-fidelity mockups), and Test (validating with real users).",
          "Financial budgeting, hiring, executing, invoicing, and paper documentation."
        ],
        correctIndex: 2,
        explanation: "Option C details Stanford d.school's canonical 5 stages of Design Thinking: Empathize, Define, Ideate, Prototype, and Test."
      },
      {
        id: "q_reinforce",
        level: "mcq",
        question: "The letter 'C' in the iterative continuous quality improvement cycle (PDCA Cycle) stands for:",
        options: [
          "Create",
          "Check (measuring outcomes and comparing results against baseline goals)",
          "Code",
          "Compress"
        ],
        correctIndex: 1,
        explanation: "The PDCA cycle consists of Plan, Do, Check (measuring data against expectations), and Act."
      }
    ]
  },

  'ch4-l4-c2': {
    ar: [
      {
        id: "q_best",
        level: "best_choice",
        question: "جميع العبارات التالية تصف مقارنة تصميمات الويب، ولكن ما هو المبدأ المنهجي الأصح والأشمل لـ 'اختبارات A/B' والسبب في اشتراط عزل متغير واحد فقط؟",
        options: [
          "توفير تكلفة استضافة السيرفرات باختبار صفحة واحدة فقط كل شهر للموقع بالكامل.",
          "إرضاء كافة أذواق الزوار بإنشاء أزرار متعددة الألوان والأشكال العشوائية في نفس الصفحة.",
          "تقسيم الزوار عشوائياً وبالتساوي بين نسختين متطابقتين تماماً باستثناء عنصر واحد فقط (مثل لون أو نص زر الشراء)، لعزل وتحديد الأثر السببي الحقيقي لهذا المتغير إحصائياً على معدل التحويل وتجنب التداخل المضلل.",
          "اختيار التصميم الذي يفضله مدير الشركة شخصياً دون النظر للأرقام والبيانات الإحصائية."
        ],
        correctIndex: 2,
        explanation: "قاعدة عزل المتغير الواحد (Single-Variable Isolation) هي جوهر اختبار A/B؛ فلو غيرنا النص واللون والموقع معاً، لن نعرف إحصائياً أي عامل هو الذي حقق الزيادة أو النقص."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "في اختبارات A/B، تُسمى النسخة الأصلية الحالية المعتمدة مسبقاً بالمجموعة ____، بينما النسخة المعدلة بالمجموعة التجريبية.",
        options: ["الضابطة", "العشوائية", "الثانوية", "النهائية"],
        missingWord: "الضابطة",
        hint: "The Control Group بالعربية.",
        explanation: "المجموعة الضابطة (Control Group A) هي النسخة الأصلية التي يُقاس التغيير بالمقارنة معها."
      }
    ],
    en: [
      {
        id: "q_best",
        level: "best_choice",
        question: "All of the following describe split-testing methods, but which one represents the MOST accurate and comprehensive scientific principle of A/B Testing and the necessity of single-variable isolation?",
        options: [
          "Reducing cloud hosting costs by limiting experimentation to one landing page per quarter.",
          "Appealing to diverse visitor tastes by rendering randomized button colors across the same screen.",
          "Randomly dividing live traffic between two identical page variants differing by only a single isolated element (e.g., CTA button text or color), enabling clean statistical causation analysis on conversion rates without confounding variables.",
          "Selecting whichever aesthetic mockup the company CEO prefers subjectively."
        ],
        correctIndex: 2,
        explanation: "Option C explains the scientific rule of single-variable isolation: altering only one factor isolates exact causal impact on user conversion."
      },
      {
        id: "q_reinforce",
        level: "timed_fill",
        questionTemplate: "In A/B testing terminology, the original baseline version currently deployed is termed the ____ group, while the modified variant is the experimental group.",
        options: ["Control", "Random", "Secondary", "Final"],
        missingWord: "Control",
        hint: "The scientific baseline standard.",
        explanation: "The Control group (Version A) serves as the experimental baseline against which the modified variant (Version B) is measured."
      }
    ]
  }
};

module.exports = { CH234_QUESTIONS };
