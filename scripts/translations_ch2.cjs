/**
 * Chapter 2 English Curriculum Data:
 * Cybersecurity (الأمن السيبراني)
 * Lessons 2-1, 2-2, 2-3
 */

module.exports = {
  // ==========================================
  // Lesson 2-1: Data Encryption & Security Fundamentals
  // ==========================================
  'ch2-l1-c1': {
    title: "Information Security Goals & The CIA Triad",
    lessonTitle: "Data Encryption & Security Fundamentals",
    summary: "The global security benchmark: Confidentiality (secrecy), Integrity (data accuracy & tamper prevention), and Availability (system uptime).",
    narration: "Welcome to Chapter 2 on Cybersecurity! Information security stands upon three universal pillars known as the CIA Triad: Confidentiality ensures sensitive information is shielded from unauthorized access through encryption. Integrity guarantees that data has not been altered or tampered with in transit or storage. And Availability ensures that critical systems remain resilient and accessible whenever authorized users need them.",
    simplifiedExplanation: "Imagine a digital vault: Confidentiality is the locked door so strangers can't peek inside. Integrity is a wax seal proving nobody tampered with the documents. And Availability means the bank door is unlocked and ready whenever you need your money!",
    aiPrompt: "Can you name the three pillars of the CIA Triad and explain why each is essential?",
    contentCards: [
      {
        type: "concept",
        title: "The Three Pillars of the CIA Security Triad (Ministry Textbook p. 36):",
        points: [
          "🔒 Confidentiality: Restricts access to authorized personnel via encryption and multi-factor authentication.",
          "🛡️ Integrity: Guarantees data accuracy and detects tampering using cryptographic hashing and digital signatures.",
          "⚡ Availability: Ensures systems withstand DDoS attacks and hardware failures through redundancy and backups."
        ]
      }
    ],
    keyTerms: [
      {
        term: "CIA Triad",
        en: "CIA Triad",
        definition: "The fundamental information security model composed of Confidentiality, Integrity, and Availability.",
        example: "A banking application ensuring balances remain confidential, are never altered maliciously, and remain accessible 24/7.",
        examTip: "Standard exam question: The 3 pillars are Confidentiality, Integrity, and Availability."
      },
      {
        term: "Data Integrity",
        en: "Data Integrity",
        definition: "Guarantees that data remains accurate, complete, and protected against unauthorized modification in transit or at rest.",
        example: "Using cryptographic hash algorithms (like SHA-256) to verify that an operating system download has not been infected.",
        examTip: "Integrity is verified mathematically using hash checksums and digital certificates."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which pillar of the CIA Triad ensures data has not been modified or tampered with in transit?",
        options: ["Confidentiality", "Integrity", "Availability", "Storage"],
        correctIndex: 1,
        explanation: "Integrity guarantees data accuracy and protection against unauthorized modification."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Ensuring an online banking portal operates 24/7 without unexpected downtime represents which pillar?",
        options: ["Availability", "Confidentiality", "Encryption", "Speculation"],
        correctIndex: 0,
        explanation: "Availability ensures authorized users have timely, reliable access to services and assets."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Confidentiality in cybersecurity means making data publicly accessible to all internet users without restrictions.",
        isTrue: false,
        explanation: "False; Confidentiality restricts data access exclusively to authorized entities."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "The CIA Triad serves as the foundational benchmark for designing and auditing cybersecurity policies.",
        isTrue: true,
        explanation: "True; It is the universal cornerstone framework across the cybersecurity industry."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The security pillar preventing unauthorized entities from viewing confidential data is _____.",
        missingWord: "Confidentiality",
        hint: "Confidentiality",
        options: ["Confidentiality", "Capacity", "Connectivity", "Concurrency"],
        explanation: "Confidentiality protects sensitive data against unauthorized eavesdropping and exposure."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "In the CIA Triad, the letter 'A' represents system _____.",
        missingWord: "Availability",
        hint: "System uptime and readiness",
        options: ["Availability", "Authentication", "Authorization", "Auditing"],
        explanation: "Availability guarantees systems remain operational and accessible when requested."
      }
    ]
  },

  'ch2-l1-c2': {
    title: "Symmetric vs Asymmetric Encryption (Symmetric vs Asymmetric)",
    lessonTitle: "Data Encryption & Security Fundamentals",
    summary: "Single-key symmetric cryptography (AES) for speed vs dual public/private key asymmetric cryptography (RSA) for secure key exchange.",
    narration: "Cryptographic encryption scrambles human-readable plaintext into unreadable ciphertext. In Symmetric Encryption (such as AES), the same secret key encrypts and decrypts the data—making it lightning fast for large files, but vulnerable to the key exchange problem. In Asymmetric Encryption (such as RSA), two mathematically linked keys are used: a Public Key that anyone can use to encrypt messages, and a secret Private Key held solely by the recipient to decrypt them.",
    simplifiedExplanation: "Symmetric encryption is like a padlock with two identical keys: if someone steals the key in the mail, they can open the lock! Asymmetric encryption is a public mailbox: anyone can drop a letter in through the public slot, but only you have the private key to unlock the box!",
    aiPrompt: "What is the key difference between symmetric and asymmetric cryptography?",
    contentCards: [
      {
        type: "concept",
        title: "Comparison of Cryptographic Paradigms (Ministry Textbook p. 39):",
        points: [
          "🔑 Symmetric Encryption: Single shared key for encryption & decryption (e.g. AES). High computational speed; requires secure key exchange.",
          "🗝️ Asymmetric Encryption: Dual-key pair (Public Key to encrypt, Private Key to decrypt; e.g. RSA). Solves key distribution; computationally heavier.",
          "🌐 Hybrid SSL/TLS Architecture: Asymmetric encryption securely exchanges a symmetric session key, which then encrypts the web traffic at high speed!"
        ]
      }
    ],
    keyTerms: [
      {
        term: "Symmetric Encryption",
        en: "Symmetric Encryption",
        definition: "A cryptographic algorithm that uses the exact same secret key to both encrypt plaintext and decrypt ciphertext.",
        example: "AES-256 encrypting an entire hard drive using your single master password.",
        examTip: "Extremely fast; its main challenge is safely sharing the secret key across untrusted channels."
      },
      {
        term: "Asymmetric Encryption",
        en: "Asymmetric Encryption",
        definition: "A cryptographic system using pairs of mathematically linked keys: a public key for encryption and a private key for decryption.",
        example: "RSA encryption used during HTTPS handshakes to establish a secure browser connection.",
        examTip: "Also known as Public-Key Cryptography. Solves the secret key exchange dilemma."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "Which cryptographic paradigm uses the exact same secret key for both encrypting and decrypting information?",
        options: ["Symmetric Encryption", "Asymmetric Encryption", "Public Key Cryptography", "Quantum Entanglement"],
        correctIndex: 0,
        explanation: "Symmetric encryption relies on a single shared secret key for encryption and decryption."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "In asymmetric cryptography, which key must remain strictly confidential and never be shared with anyone?",
        options: ["Private Key", "Public Key", "Network SSID", "MAC Address"],
        correctIndex: 0,
        explanation: "The Private Key must remain strictly confidential because it is the only key capable of decrypting ciphertext."
      },
      {
        id: "q2",
        level: "true_false",
        question: "In Asymmetric encryption, anyone can use the recipient's Public Key to encrypt a message intended for them.",
        isTrue: true,
        explanation: "True; The Public Key is published openly so any sender can encrypt confidential messages."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Symmetric encryption is computationally much slower than asymmetric encryption when processing gigabytes of data.",
        isTrue: false,
        explanation: "False; Symmetric encryption is orders of magnitude faster, making it the standard for bulk data transfer."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Cryptography using a single shared secret key is termed _____ Encryption.",
        missingWord: "Symmetric",
        hint: "Symmetric / Single key",
        options: ["Symmetric", "Asymmetric", "Public", "Analog"],
        explanation: "Symmetric cryptography relies on an identical shared secret key."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "In asymmetric encryption, the key freely distributed to senders is the _____ Key.",
        missingWord: "Public",
        hint: "Publicly visible",
        options: ["Public", "Private", "Master", "Hardware"],
        explanation: "The Public Key is openly shared to permit anyone to encrypt messages for the private key holder."
      }
    ]
  },

  'ch2-l1-exam': {
    title: "🏆 Final Challenge: Lesson (2-1) Mastery Exam",
    lessonTitle: "Data Encryption & Security Fundamentals",
    summary: "Comprehensive exam testing the CIA Triad, symmetric cryptography, and asymmetric key exchange.",
    narration: "Welcome to the Lesson 2-1 Mastery Exam! Demonstrate your thorough knowledge of cryptographic algorithms, public-private keypairs, and the CIA Triad to claim your gold trophy!",
    examQuestions: [
      {
        question: "Which pillar of the CIA Triad protects against unauthorized data eavesdropping and interception?",
        options: ["Confidentiality", "Availability", "Redundancy", "Replication"],
        correctIndex: 0,
        explanation: "Confidentiality ensures that sensitive information is accessible solely to authorized users."
      },
      {
        question: "How does modern HTTPS web browsing combine symmetric and asymmetric cryptography?",
        options: [
          "It uses asymmetric encryption to exchange a secret key, then uses symmetric encryption for fast data transmission",
          "It bans all encryption completely",
          "It uses only plain text without keys",
          "It changes the user's password every second"
        ],
        correctIndex: 0,
        explanation: "Hybrid cryptography leverages asymmetric speed for key exchange and symmetric speed for payload throughput."
      },
      {
        question: "What is the primary cryptographic advantage of Asymmetric Encryption (Public Key Cryptography)?",
        options: [
          "It eliminates the need to transmit secret decryption keys across insecure networks",
          "It requires zero mathematical calculations",
          "It functions without computer processors",
          "It works only when computers are turned off"
        ],
        correctIndex: 0,
        explanation: "Asymmetric cryptography solves the key distribution problem because the private key never leaves the owner's machine."
      },
      {
        question: "Which of the following guarantees that a digital document has not been altered after being signed?",
        options: ["Digital Signatures & Cryptographic Hashing (Integrity)", "Increasing computer screen brightness", "Compressing files into ZIP format", "Changing the file name"],
        correctIndex: 0,
        explanation: "Digital signatures and cryptographic hashes verify data integrity and detect any post-signing alterations."
      },
      {
        question: "Which component of the CIA Triad is compromised when a Denial of Service (DoS) attack crashes a web server?",
        options: ["Availability", "Confidentiality", "Integrity", "Accounting"],
        correctIndex: 0,
        explanation: "DoS attacks exhaust system resources, rendering services unavailable to legitimate authorized users."
      }
    ]
  },

  // ==========================================
  // Lesson 2-2: Network Security & Defense In Depth
  // ==========================================
  'ch2-l2-c1': {
    title: "Network Security Elements: Firewalls, VPN & The DMZ",
    lessonTitle: "Network Security & Defense In Depth",
    summary: "Packet filtering firewalls, stateful inspection, Virtual Private Networks (VPN), and Demilitarized Zone (DMZ) server isolation.",
    narration: "Network security safeguards data moving across digital conduits: A Firewall inspects incoming and outgoing network traffic, filtering packets based on IP addresses, port numbers, and connection states. To securely publish public-facing servers (such as web or email servers), organizations isolate them in a Demilitarized Zone (DMZ)—a neutral perimeter subnet situated between the untrusted internet and the trusted internal corporate network. Virtual Private Networks (VPN) create encrypted tunnels across public networks.",
    simplifiedExplanation: "A Firewall is like security guards at a gated community inspecting visitors. The DMZ is like the front reception lobby where delivery people drop packages: visitors can enter the lobby, but they are locked out of the private family bedrooms!",
    aiPrompt: "Why do organizations place public web servers in a DMZ instead of the internal network?",
    contentCards: [
      {
        type: "concept",
        title: "Network Security Perimeter Elements (Ministry Textbook p. 43):",
        points: [
          "🛡️ Firewall: Inspects data packets based on access control rules (ACLs), IP addresses, and TCP/UDP ports.",
          "🌐 Demilitarized Zone (DMZ): A dedicated subnet hosting public servers (Web, Mail, DNS) isolated from internal LANs.",
          "🔒 VPN (Virtual Private Network): Encrypted tunneling that provides secure remote access over public internet infrastructure."
        ]
      },
      {
        type: "teacherTip",
        title: "💡 Exam Tip:",
        text: "If a web server inside a DMZ is compromised, the internal corporate network remains protected behind an inner firewall!"
      }
    ],
    keyTerms: [
      {
        term: "Firewall",
        en: "Firewall",
        definition: "A network security device that monitors and filters incoming and outgoing network traffic based on predefined security rules.",
        example: "Blocking all inbound traffic on port 23 (Telnet) while permitting port 443 (HTTPS).",
        examTip: "Can be software-based (host OS) or dedicated enterprise hardware appliances."
      },
      {
        term: "Demilitarized Zone (DMZ)",
        en: "Demilitarized Zone",
        definition: "A physical or logical perimeter subnetwork that exposes an organization's external-facing services to an untrusted network while protecting the internal LAN.",
        example: "Placing the public school web server in a DMZ so hackers cannot access the student grading database on the internal LAN.",
        examTip: "Separated from the internet by an external firewall, and from the internal LAN by an internal firewall."
      },
      {
        term: "Virtual Private Network (VPN)",
        en: "Virtual Private Network",
        definition: "An encrypted connection over the Internet from a device to a network, ensuring sensitive data travels through a secure tunnel.",
        example: "An employee connecting securely from a hotel Wi-Fi network to the hospital internal medical records database.",
        examTip: "Provides encryption, authentication, and IP masking across public networks."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "What is the primary architectural purpose of a Demilitarized Zone (DMZ) in network design?",
        options: [
          "To isolate external-facing public servers so an attacker cannot compromise the private internal corporate network",
          "To speed up the internet connection for video games",
          "To eliminate the need for computer electricity",
          "To permanently delete all employee emails"
        ],
        correctIndex: 0,
        explanation: "A DMZ buffers public-facing servers between the internet and the internal LAN, containing breaches."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Which technology creates an encrypted, authenticated tunnel across public untrusted internet infrastructure?",
        options: ["Virtual Private Network (VPN)", "Packet Sniffer", "Dial-up modem", "Hub"],
        correctIndex: 0,
        explanation: "VPNs encapsulate and encrypt traffic to provide secure remote communication over untrusted networks."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Placing a public web server directly inside the core internal corporate LAN is considered a safe cybersecurity best practice.",
        isTrue: false,
        explanation: "False; Public servers must reside in an isolated DMZ to prevent external attacks from breaching internal assets."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "A firewall can filter network packets according to IP addresses and destination port numbers.",
        isTrue: true,
        explanation: "True; Firewalls enforce Access Control Lists based on source/destination IPs, ports, and protocols."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The isolated perimeter subnet hosting public web and email servers is the _____.",
        missingWord: "DMZ",
        hint: "Demilitarized Zone",
        options: ["DMZ", "CPU", "RAM", "URL"],
        explanation: "The DMZ provides security isolation for external-facing web and mail servers."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The network device that inspects traffic packets and enforces security access rules is a _____.",
        missingWord: "Firewall",
        hint: "Firewall",
        options: ["Firewall", "Keyboard", "Scanner", "Monitor"],
        explanation: "A firewall filters unauthorized incoming and outgoing packet streams."
      }
    ]
  },

  'ch2-l2-c2': {
    title: "Defense in Depth & The Zero Trust Architecture",
    lessonTitle: "Network Security & Defense In Depth",
    summary: "Multi-layered defense strategies, the principle of least privilege, and the modern Zero Trust model ('Never Trust, Always Verify').",
    narration: "Modern cybersecurity recognizes that single security perimeters can be breached. Therefore, organizations employ Defense in Depth: layering multiple defensive safeguards—firewalls, endpoint antivirus, multi-factor authentication, data encryption, and employee awareness training. Furthermore, the modern paradigm has evolved to Zero Trust: 'Never Trust, Always Verify.' Under Zero Trust, no user or device is trusted by default, even if they reside physically inside the internal corporate office.",
    simplifiedExplanation: "Imagine a castle: it doesn't just have one wall; it has a moat, a drawbridge, thick outer walls, locked courtyard gates, and guards inside every hallway! Even if you are inside the castle, guards check your badge at every door. That is Defense in Depth and Zero Trust!",
    aiPrompt: "What is the core motto of the Zero Trust security architecture?",
    contentCards: [
      {
        type: "concept",
        title: "Layered Defense and Zero Trust (Ministry Textbook p. 46):",
        points: [
          "🏰 Defense in Depth: Implementing concentric layers of technical, administrative, and physical security controls.",
          "🛡️ Zero Trust Architecture: Grounded in the core principle: 'Never Trust, Always Verify'.",
          "🔑 Least Privilege: Granting users the minimum necessary permissions required to fulfill their specific job duties.",
          "📱 Multi-Factor Authentication (MFA): Requiring two or more distinct authentication factors (password + phone code) before granting access."
        ]
      }
    ],
    keyTerms: [
      {
        term: "Defense in Depth",
        en: "Defense in Depth",
        definition: "A cybersecurity strategy that leverages multiple distinct security measures and layers to protect an organization's assets.",
        example: "Combining perimeter firewalls, host antivirus, disk encryption, and employee phishing training.",
        examTip: "Ensures that if one defensive layer fails, subsequent layers thwart the attacker."
      },
      {
        term: "Zero Trust",
        en: "Zero Trust",
        definition: "A strategic security model that assumes every transaction, user, and network device is potentially hostile, requiring continuous explicit verification.",
        example: "Requiring biometric verification and security posture checks whenever an employee accesses financial spreadsheets from internal desks.",
        examTip: "Core principle: 'Never Trust, Always Verify' across all network segments."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "What is the fundamental operational doctrine of the Zero Trust security architecture?",
        options: ["Never Trust, Always Verify", "Trust everyone inside the building", "Disable all passwords", "Rely entirely on a single firewall"],
        correctIndex: 0,
        explanation: "Zero Trust mandates continuous authentication and verification regardless of user location."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Granting an employee only the minimal permissions necessary to perform their specific daily tasks embodies the principle of:",
        options: ["Least Privilege", "Maximum Access", "Open Administration", "Random Assignment"],
        correctIndex: 0,
        explanation: "The Principle of Least Privilege limits access rights to the bare minimum required for routine duties."
      },
      {
        id: "q2",
        level: "true_false",
        question: "Under the Zero Trust framework, any device located physically inside the corporate office is automatically trusted without authentication.",
        isTrue: false,
        explanation: "False; Zero Trust eliminates implicit trust, requiring continuous authentication for internal and external devices alike."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Defense in Depth ensures that a single point of failure does not compromise the security of the entire organization.",
        isTrue: true,
        explanation: "True; Multi-layered security ensures backup defensive barriers stop intruders if one perimeter fails."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "The security architecture based on 'Never Trust, Always Verify' is _____ Trust.",
        missingWord: "Zero",
        hint: "Zero / No trust",
        options: ["Zero", "Full", "Static", "Open"],
        explanation: "Zero Trust removes implicit trust from digital network infrastructure."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Deploying concentric layers of defenses across a network is Defense in _____.",
        missingWord: "Depth",
        hint: "Depth / Layered",
        options: ["Depth", "Width", "Length", "Surface"],
        explanation: "Defense in Depth implements layered security safeguards across people, technology, and operations."
      }
    ]
  },

  'ch2-l2-exam': {
    title: "🏆 Final Challenge: Lesson (2-2) Mastery Exam",
    lessonTitle: "Network Security & Defense In Depth",
    summary: "Comprehensive exam on firewalls, DMZ architecture, defense in depth, and zero trust models.",
    narration: "Welcome to the Lesson 2-2 Mastery Challenge! Test your deep understanding of network boundaries, firewall filtering, DMZ segmentation, and Zero Trust architectures to earn your gold trophy!",
    examQuestions: [
      {
        question: "What is the primary role of a Demilitarized Zone (DMZ)?",
        options: [
          "To isolate public-facing internet servers (Web/Mail) from the internal private corporate network",
          "To store backup paper documents",
          "To cool down computer hardware",
          "To format employee hard drives"
        ],
        correctIndex: 0,
        explanation: "A DMZ buffers internet-exposed servers so that a breach does not grant direct access to internal corporate networks."
      },
      {
        question: "The core motto defining the modern Zero Trust architecture is:",
        options: ["Never Trust, Always Verify", "Trust all internal connections", "Passwords are unnecessary", "Firewalls are obsolete"],
        correctIndex: 0,
        explanation: "Zero Trust assumes hostile threats exist inside and outside the perimeter, requiring continuous verification."
      },
      {
        question: "How does Defense in Depth safeguard an enterprise?",
        options: [
          "By deploying multiple complementary layers of security so if one layer fails, others halt the threat",
          "By buying the single most expensive firewall on the market",
          "By completely unplugging computers from all electrical outlets",
          "By removing authentication passwords"
        ],
        correctIndex: 0,
        explanation: "Defense in Depth creates multi-layered barriers across perimeter, network, host, application, and data tiers."
      },
      {
        question: "Which tool encrypts all communications between a remote telecommuting worker and the corporate office?",
        options: ["Virtual Private Network (VPN)", "Public Wi-Fi without encryption", "Web browser history", "Ethernet splitter"],
        correctIndex: 0,
        explanation: "A VPN establishes an encrypted, authenticated tunnel across untrusted public internet connections."
      },
      {
        question: "The Principle of Least Privilege states that:",
        options: [
          "Users must be granted only the minimal permissions essential to execute their designated duties",
          "Every employee must be granted full administrator access to all servers",
          "Passwords should never be changed",
          "Software updates should be postponed indefinitely"
        ],
        correctIndex: 0,
        explanation: "Least Privilege reduces the attack surface by limiting user and process capabilities to the bare essential scope."
      }
    ]
  },

  // ==========================================
  // Lesson 2-3: Incident Response & Risk Assessment
  // ==========================================
  'ch2-l3-c1': {
    title: "Security Incidents & The 6-Stage NIST Incident Response Lifecycle",
    lessonTitle: "Incident Response & Risk Assessment",
    summary: "The 6 systematic phases of cybersecurity incident management: Preparation, Detection & Analysis, Containment, Eradication, Recovery, and Post-Incident Lessons Learned.",
    narration: "A security incident occurs when an organization's confidentiality, integrity, or availability is compromised. Organizations follow the standardized 6-stage Incident Response Lifecycle defined by NIST: Phase 1 is Preparation (establishing policies and CSIRT teams). Phase 2 is Detection & Analysis (identifying suspicious activity). Phase 3 is Containment (isolating infected machines to stop spread). Phase 4 is Eradication (removing malware and closing vulnerabilities). Phase 5 is Recovery (restoring systems from clean backups). And Phase 6 is Lessons Learned (documenting findings to prevent recurrence).",
    simplifiedExplanation: "Imagine a fire in a building: Preparation is having fire extinguishers. Detection is the smoke alarm ringing. Containment is closing fire doors so it doesn't spread. Eradication is firefighters spraying water to put it out. Recovery is cleaning up and returning home. And Lessons Learned is investigating why the fire started so it never happens again!",
    aiPrompt: "Can you list the 6 stages of the NIST Cybersecurity Incident Response Lifecycle?",
    contentCards: [
      {
        type: "concept",
        title: "The 6 NIST Incident Response Stages (Ministry Textbook p. 50):",
        points: [
          "1️⃣ Preparation: Building response plans, tools, and training the CSIRT incident response team.",
          "2️⃣ Detection & Analysis: Monitoring SIEM alerts and confirming malicious breach indicators.",
          "3️⃣ Containment: Quarantining infected servers to prevent lateral movement across the network.",
          "4️⃣ Eradication: Purging malware artifacts, revoking compromised credentials, and patching flaws.",
          "5️⃣ Recovery: Validating clean system restore from trusted backups and returning to production.",
          "6️⃣ Lessons Learned: Post-mortem meeting analyzing what occurred and updating defensive playbooks."
        ]
      },
      {
        type: "teacherTip",
        title: "💡 Exam Tip:",
        text: "Containment isolates the damage; Eradication removes the root threat; Recovery restores business operations!"
      }
    ],
    keyTerms: [
      {
        term: "Security Incident",
        en: "Security Incident",
        definition: "An adverse event in an information system or network that threatens the confidentiality, integrity, or availability of organizational assets.",
        example: "A ransomware infection encrypting accounting databases or an unauthorized hacker exfiltrating patient data.",
        examTip: "Requires a systematic, procedural response rather than ad-hoc panic."
      },
      {
        term: "Containment Phase",
        en: "Containment Phase",
        definition: "The critical incident response phase focused on limiting the scope and impact of an active breach by isolating affected assets.",
        example: "Disconnecting infected workstations from the corporate network cable to stop ransomware from spreading.",
        examTip: "Occurs immediately after breach confirmation to stop lateral infection."
      },
      {
        term: "Lessons Learned",
        en: "Lessons Learned",
        definition: "The post-incident analysis phase where responders review the timeline, effectiveness of the response, and update policies to prevent recurrence.",
        example: "Holding a debriefing meeting to document how phishing slipped past filters and deploying stronger email defenses.",
        examTip: "The final 6th phase of the lifecycle; feeds back directly into Phase 1 (Preparation)."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "During a ransomware outbreak, which phase focuses on immediately isolating infected machines to stop malware spreading?",
        options: ["Containment Phase", "Preparation Phase", "Marketing Phase", "Accounting Phase"],
        correctIndex: 0,
        explanation: "Containment limits the blast radius and stops lateral spread of infections across the network."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "What is the final stage of the incident response lifecycle where responders analyze root causes to prevent future attacks?",
        options: ["Post-Incident Lessons Learned", "Initial Infection", "Password Reset", "Server Decommission"],
        correctIndex: 0,
        explanation: "Lessons Learned evaluates the incident post-mortem and integrates defensive improvements."
      },
      {
        id: "q2",
        level: "true_false",
        question: "The Eradication phase focuses on restoring systems back into production from backups before removing the malware.",
        isTrue: false,
        explanation: "False; Eradication must thoroughly purge all malware artifacts BEFORE recovery to prevent re-infection."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Preparation is the first stage of the incident response lifecycle, undertaken before any cyber incident occurs.",
        isTrue: true,
        explanation: "True; Preparation establishes response playbooks, tools, and team training in advance."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Isolating infected network nodes to prevent malware proliferation is the _____ phase.",
        missingWord: "Containment",
        hint: "Contains the infection",
        options: ["Containment", "Preparation", "Installation", "Purchase"],
        explanation: "Containment isolates active breaches to prevent lateral movement."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Completely eliminating malware and patching exploited vulnerabilities occurs in the _____ phase.",
        missingWord: "Eradication",
        hint: "Eradicates the threat",
        options: ["Eradication", "Detection", "Presentation", "Execution"],
        explanation: "Eradication removes root malicious components from compromised environments."
      }
    ]
  },

  'ch2-l3-c2': {
    title: "Cyber Risk Assessment & Prioritization Matrix",
    lessonTitle: "Incident Response & Risk Assessment",
    summary: "Risk calculation formula (Risk = Threat × Vulnerability × Impact), quantitative/qualitative matrices, and risk treatment strategies.",
    narration: "Cyber Risk Management is the process of identifying, evaluating, and mitigating digital threats. Risk is mathematically assessed as a function of three variables: Threat (the potential malicious agent or event), Vulnerability (a security flaw or weakness in the system), and Impact (the financial or operational damage if breached). Organizations map risks onto a Risk Matrix evaluating Likelihood vs Impact, and select from four treatment strategies: Mitigation, Transfer, Avoidance, or Acceptance.",
    simplifiedExplanation: "Think about rain: The Threat is the rain storm. The Vulnerability is a hole in your roof. The Impact is your furniture getting ruined. Risk is the combination of all three! You can fix the hole (Mitigate), buy insurance (Transfer), or stay inside (Avoid)!",
    aiPrompt: "What are the three factors that determine Cyber Risk?",
    contentCards: [
      {
        type: "concept",
        title: "Risk Calculation and Treatment Strategies (Ministry Textbook p. 54):",
        points: [
          "📐 Risk Formula: Risk = Threat × Vulnerability × Impact (Damage magnitude).",
          "📊 Risk Priority Matrix: Evaluates Likelihood (probability) vs Consequence (severity).",
          "🛡️ 4 Risk Treatment Options:",
          "  • Mitigate: Deploy technical controls (e.g. firewalls, patches) to reduce risk.",
          "  • Transfer: Shift financial impact to a third party (e.g. cyber insurance).",
          "  • Avoid: Terminate the risky activity entirely (e.g. shut down vulnerable legacy service).",
          "  • Accept: Retain low residual risk when mitigation cost exceeds potential loss."
        ]
      }
    ],
    keyTerms: [
      {
        term: "Cyber Risk",
        en: "Cyber Risk",
        definition: "The probability of exposure or loss resulting from a cyber attack or data breach on an organization.",
        example: "The risk that unpatched web servers could allow hackers to steal customer credit card records.",
        examTip: "Determined by combining Threat Likelihood with Business Impact."
      },
      {
        term: "Vulnerability",
        en: "Vulnerability",
        definition: "A flaw or weakness in software code, hardware architecture, or operational procedures that an attacker can exploit.",
        example: "A missing security patch in Windows operating systems that permits remote code execution.",
        examTip: "Without a vulnerability, a threat cannot execute a breach."
      }
    ],
    questionPool: [
      {
        id: "q1",
        level: "mcq",
        question: "In cybersecurity risk management, what is the fundamental formula used to evaluate Risk?",
        options: [
          "Risk = Threat × Vulnerability × Impact",
          "Risk = Speed × Distance ÷ Time",
          "Risk = Cost + Profit × Sales",
          "Risk = RAM + CPU × Hard Drive"
        ],
        correctIndex: 0,
        explanation: "Risk is evaluated by assessing the presence of a threat exploiting a vulnerability and the severity of resulting impact."
      },
      {
        id: "q1_alt",
        level: "mcq",
        question: "Purchasing a cyber insurance policy to cover financial losses from potential data breaches exemplifies:",
        options: ["Risk Transfer", "Risk Mitigation", "Risk Ignorance", "Risk Creation"],
        correctIndex: 0,
        explanation: "Risk Transfer shifts financial liability to an external insurance carrier."
      },
      {
        id: "q2",
        level: "true_false",
        question: "A vulnerability is a software or hardware weakness that can be exploited by an adversary to gain unauthorized access.",
        isTrue: true,
        explanation: "True; Vulnerabilities are weaknesses in systems, code, or controls."
      },
      {
        id: "q2_alt",
        level: "true_false",
        question: "Risk Mitigation means closing an entire company down to avoid using any digital technology.",
        isTrue: false,
        explanation: "False; Mitigation implements technical and administrative safeguards (like firewalls) to reduce risk to acceptable levels."
      },
      {
        id: "q3",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "A software flaw or architectural weakness that an adversary can exploit is a _____.",
        missingWord: "Vulnerability",
        hint: "Flaw / Weakness",
        options: ["Vulnerability", "Perimeter", "Monitor", "Bandwidth"],
        explanation: "A vulnerability is an exploitable flaw in an information system."
      },
      {
        id: "q3_alt",
        level: "timed_fill",
        timeLimit: 25,
        prompt: "Complete the term:",
        questionTemplate: "Deploying security controls such as patches and firewalls to reduce risk is Risk _____.",
        missingWord: "Mitigation",
        hint: "Mitigation / Reduction",
        options: ["Mitigation", "Rejection", "Creation", "Multiplication"],
        explanation: "Risk mitigation deploys safeguards to minimize likelihood and impact."
      }
    ]
  },

  'ch2-l3-exam': {
    title: "🏆 Final Challenge: Lesson (2-3) Mastery Exam",
    lessonTitle: "Incident Response & Risk Assessment",
    summary: "Comprehensive exam testing incident response phases, containment, eradication, and risk assessment methodologies.",
    narration: "Welcome to the Lesson 2-3 Mastery Challenge! Conclude Chapter 2 by demonstrating your mastery of incident response lifecycles and cybersecurity risk matrices!",
    examQuestions: [
      {
        question: "What is the primary objective of the Containment phase in cybersecurity incident handling?",
        options: [
          "To isolate compromised systems and prevent the attack from spreading laterally across the network",
          "To purchase new laptop hardware",
          "To draft employee contracts",
          "To publish promotional advertisements"
        ],
        correctIndex: 0,
        explanation: "Containment isolates compromised assets to halt ongoing lateral movement and limit breach damage."
      },
      {
        question: "Which of the following correctly lists the 6 NIST incident response lifecycle phases in order?",
        options: [
          "Preparation → Detection & Analysis → Containment → Eradication → Recovery → Lessons Learned",
          "Recovery → Eradication → Containment → Detection → Preparation → Lessons Learned",
          "Detection → Preparation → Recovery → Containment → Eradication → Audit",
          "Containment → Recovery → Preparation → Detection → Eradication → Archive"
        ],
        correctIndex: 0,
        explanation: "NIST standard order: Preparation, Detection & Analysis, Containment, Eradication, Recovery, and Lessons Learned."
      },
      {
        question: "Cyber Risk is mathematically calculated as the product of:",
        options: [
          "Threat × Vulnerability × Impact",
          "Electricity × Voltage ÷ Amps",
          "Storage × Memory + Clock Speed",
          "Number of users ÷ Bandwidth"
        ],
        correctIndex: 0,
        explanation: "Risk represents the likelihood of an active threat exploiting an existing vulnerability multiplied by potential impact."
      },
      {
        question: "What risk treatment strategy involves purchasing cyber insurance to cover potential ransomware extortion costs?",
        options: ["Risk Transfer", "Risk Avoidance", "Risk Mitigation", "Risk Acceptance"],
        correctIndex: 0,
        explanation: "Risk Transfer passes financial liability and indemnification to a third-party insurer."
      },
      {
        question: "Why is the 'Lessons Learned' phase considered critical for continuous cybersecurity posture improvement?",
        options: [
          "It analyzes root causes and updates defenses to ensure the exact same breach cannot recur",
          "It assigns blame and fires employees",
          "It turns off all computer networks permanently",
          "It deletes all log files"
        ],
        correctIndex: 0,
        explanation: "Lessons Learned analyzes response effectiveness and institutionalizes defensive improvements to prevent recurrence."
      }
    ]
  }
};
