const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/synapsecoresystem';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  notes: {
    explanation: String,
    practical: String,
    summary: String,
  },
  category: {
    type: String,
    enum: ['Security', 'Hacking', 'Networks', 'Compliance', 'Forensics', 'Administration', 'AI Automation', 'Web Development', 'Cloud Security'],
    required: true,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  price: {
    type: Number,
    default: 0,
    min: 4700,
    max: 20000,
  },
  duration: String,
  thumbnail: String,
  modules: [
    {
      title: String,
      description: String,
      notes: String,
      order: Number,
      lessons: [
        {
          title: String,
          description: String,
          notes: String,
          videos: [
            {
              url: String,
              type: { type: String, enum: ['recorded', 'live', 'zoom'], default: 'recorded' },
              title: String,
              scheduledAt: Date,
              duration: Number,
            },
          ],
          duration: Number,
          order: Number,
          downloads: [
            {
              label: String,
              url: String,
              fileType: { type: String, enum: ['pdf', 'zip', 'source', 'slides', 'other'], default: 'other' },
            },
          ],
          quiz: { quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' } },
          assignment: {
            title: String,
            description: String,
            dueInDays: Number,
            points: { type: Number, default: 100 },
          },
          discussionEnabled: { type: Boolean, default: false },
          subtitles: [
            { lang: { type: String, default: 'en' }, label: String, url: String },
          ],
          playground: { type: new mongoose.Schema({ enabled: { type: Boolean, default: false }, kind: { type: String, default: '' } }, { _id: false }) },
          aiTutor: { type: new mongoose.Schema({ enabled: { type: Boolean, default: false } }, { _id: false }) },
          completed: { type: Boolean, default: false },
        },
      ],
      quiz: { quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' } },
      assignment: {
        title: String,
        description: String,
        dueInDays: Number,
        points: { type: Number, default: 100 },
      },
      unlockRule: {
        type: String,
        enum: ['immediate', 'videoComplete', 'quizPass', 'assignmentSubmit'],
        default: 'videoComplete',
      },
    },
  ],
  quizzes: [
    {
      title: String,
      description: String,
      questions: [
        {
          question: String,
          options: [String],
          correctAnswer: Number,
          explanation: String,
        },
      ],
      passingScore: { type: Number, default: 70 },
    },
  ],
  certificate: {
    enabled: { type: Boolean, default: true },
    template: String,
    requireQuizAvg: { type: Number, default: 70 },
    requireFinalProject: { type: Boolean, default: false },
  },
  instructor: {
    name: String,
    bio: String,
    avatar: String,
  },
  instructors: [
    {
      name: String,
      bio: String,
      avatar: String,
    },
  ],
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  scope: { type: String, enum: ['lesson', 'module', 'course'], default: 'module' },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
    },
  ],
  passingScore: { type: Number, default: 70 },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);

// Helper to build lessons for a course from its notes (explanation/practical are long-form text)
function buildModules(notes, instructor) {
  const intro = notes.explanation || '';
  const labs = notes.practical || '';
  const wrap = notes.summary || '';

  const lesson = (title, text, withQuiz, withAssignment, withDiscussion) => ({
    title,
    description: text.slice(0, 200),
    notes: text,
    videos: [
      { url: 'https://videos.synapsecore.com/placeholder.mp4', type: 'recorded', title: `${title} — Lecture`, duration: 45 },
    ],
    duration: 45,
    downloads: [
      { label: 'Lesson Slides (PDF)', url: 'https://files.synapsecore.com/slides.pdf', fileType: 'slides' },
      { label: 'Lab Files (ZIP)', url: 'https://files.synapsecore.com/lab.zip', fileType: 'zip' },
    ],
    assignment: withAssignment
      ? { title: `${title} Assignment`, description: `Apply the concepts from ${title} in a hands-on task.`, dueInDays: 7, points: 100 }
      : undefined,
    discussionEnabled: Boolean(withDiscussion),
    playground: { enabled: false, kind: '' },
    aiTutor: { enabled: true },
    completed: false,
  });

  return [
    {
      title: 'Module 1 — Foundations',
      description: 'Core concepts and theory.',
      notes: intro.slice(0, 800),
      order: 1,
      unlockRule: 'immediate',
      lessons: [
        lesson('Lesson 1 — Introduction', intro, false, false, true),
        lesson('Lesson 2 — Core Concepts', intro.slice(0, 1200), true, false, true),
      ],
      assignment: { title: 'Module 1 Project', description: 'Consolidate module learning into a short report.', dueInDays: 10, points: 150 },
    },
    {
      title: 'Module 2 — Hands-On Labs',
      description: 'Practical exercises and tooling.',
      notes: labs.slice(0, 800),
      order: 2,
      unlockRule: 'quizPass',
      lessons: [
        lesson('Lesson 3 — Lab Setup', labs, false, false, true),
        lesson('Lesson 4 — Guided Exercise', labs.slice(0, 1200), true, true, false),
      ],
    },
    {
      title: 'Module 3 — Capstone & Assessment',
      description: 'Final project and evaluation.',
      notes: wrap.slice(0, 800),
      order: 3,
      unlockRule: 'videoComplete',
      lessons: [
        lesson('Lesson 5 — Capstone Briefing', wrap, false, true, false),
      ],
      assignment: { title: 'Final Project', description: 'Complete the end-to-end capstone for this course.', dueInDays: 21, points: 300 },
    },
  ];
}

function buildQuiz(courseTitle) {
  return {
    title: `${courseTitle} — Knowledge Check`,
    description: 'End-of-course assessment covering core learning objectives.',
    scope: 'module',
    passingScore: 70,
    questions: [
      {
        question: `Which statement best describes a key principle taught in ${courseTitle}?`,
        options: [
          'Security is a one-time configuration',
          'Defense in depth uses overlapping controls',
          'Complexity improves safety',
          'Defaults are always secure',
        ],
        correctAnswer: 1,
        explanation: 'Defense in depth layers multiple controls so a single failure does not compromise the system.',
      },
      {
        question: 'Why is documentation important in security work?',
        options: [
          'It slows attackers down',
          'It is only for compliance',
          'It enables repeatable, auditable processes',
          'It replaces tooling',
        ],
        correctAnswer: 2,
        explanation: 'Documented processes are repeatable, auditable, and support incident response and compliance.',
      },
    ],
  };
}

const courseDefs = [
  // Security
  {
    title: 'Foundations of Cybersecurity',
    category: 'Security',
    level: 'Beginner',
    price: 8500,
    duration: '6 weeks',
    description: 'Master the core principles of cybersecurity: CIA triad, threat modeling, risk management, and security policies. Learn to think like a defender and build a security-first mindset.',
    notes: {
      explanation: `This course provides a rigorous academic foundation in cybersecurity principles, beginning with the historical evolution of information security from the 1960s to modern-day zero trust. Students will study the CIA triad in depth: confidentiality through encryption standards such as AES-256 and RSA-2048; integrity via cryptographic hashing (SHA-256, HMAC) and digital signatures; and availability through redundancy, load balancing, and DDoS mitigation strategies. The course covers defense-in-depth architecture, where multiple overlapping controls create resilient systems, and examines real-world case studies including the 2017 Equifax breach, the 2020 SolarWinds supply-chain attack, and the 2023 MOVEit exploitation. Students will learn quantitative and qualitative risk assessment methodologies including NIST SP 800-30, FAIR, and OCTAVE, and will apply these to develop threat models using STRIDE and PASTA frameworks. Governance topics include policy development, compliance mapping to ISO 27001 and NIST CSF, and the role of international bodies such as NIST, ENISA, and the ITU in shaping cybersecurity standards. The course also introduces foundational concepts in cryptography, network security, identity and access management, and security operations, preparing students for advanced study in specialized domains.`,
      practical: `Week 1: Set up a secure home lab using VirtualBox or VMware with Kali Linux and Metasploitable2. Perform reconnaissance using Nmap with various scan types: \`nmap -sS -sV -O -p- 192.168.1.0/24\`. Analyze captured traffic with Wireshark, filtering for suspicious DNS queries and HTTP credentials. Week 2: Use John the Ripper to crack password hashes: \`john --format=raw-md5 hashes.txt\`. Perform a brute-force attack on a simulated SSH service using Hydra: \`hydra -l admin -P rockyou.txt ssh://192.168.1.100\`. Week 3: Build a SIEM dashboard in ELK Stack or Graylog. Ingest logs from a Windows 10 VM and create detection rules for failed login attempts and privilege escalation. Week 4: Conduct a full vulnerability assessment using OpenVAS: \`omp -u admin -w admin --xml='<get_version/>'\`. Document findings in a professional report format. Week 5: Implement encryption tools: generate RSA keys with \`openssl genrsa -out private.pem 2048\`, encrypt files with \`gpg --symmetric --cipher-algo AES256 file.txt\`, and verify integrity with SHA-256 checksums. Week 6: Perform a tabletop incident response exercise simulating a ransomware attack. Document the lifecycle from initial access to eradication and recovery, including communication protocols and regulatory reporting requirements.`,
      summary: `Upon completion, students will possess a comprehensive understanding of cybersecurity as both a technical and managerial discipline. They will be able to conduct risk assessments using recognized frameworks, design defense-in-depth architectures, analyze network traffic for indicators of compromise, and evaluate cryptographic solutions for confidentiality and integrity. Graduates will understand the legal and ethical boundaries of security work, including the Computer Fraud and Abuse Act (CFAA) in the United States and the NDPR in Nigeria. They will be prepared for entry-level roles in security operations, GRC (Governance, Risk, and Compliance), and advisory positions. The course also provides a solid foundation for pursuing industry certifications such as CompTIA Security+, ISC2 SSCP, and EC-Council CEH. Ultimately, students will think like security professionals, continuously questioning assumptions, validating trust boundaries, and applying a structured methodology to protect information assets.`,
    },
    instructor: { name: 'Aisha Bello', bio: 'CISSP, 10+ years in SOC operations', avatar: 'https://i.pravatar.cc/150?u=aisha' },
  },
  {
    title: 'Enterprise Security Architecture',
    category: 'Security',
    level: 'Advanced',
    price: 18000,
    duration: '10 weeks',
    description: 'Design zero-trust architectures, implement security controls across hybrid environments, and lead enterprise security strategy.',
    notes: {
      explanation: `This advanced course examines the design, implementation, and evaluation of enterprise-scale security architectures in complex hybrid environments. Students begin with the historical shift from perimeter-based security to zero trust, studying the NIST SP 800-207 zero trust architecture (ZTA) model and its seven pillars: identity, device, network, application, data, visibility, and analytics. The course covers identity and access management at scale, including federated identity with SAML 2.0 and OIDC, privileged access management (PAM), and just-in-time (JIT) access provisioning. Students explore Secure Access Service Edge (SASE) architectures, examining how SD-WAN, cloud access security broker (CASB), and zero trust network access (ZTNA) converge to protect distributed workforces. Data protection strategies include encryption at rest and in transit, data loss prevention (DLP), tokenization, and homomorphic encryption concepts. The course also covers security orchestration, automation, and response (SOAR) platforms, security incident and event management (SIEM) at enterprise scale, and the integration of threat intelligence platforms (TIPs) with security operations. Students will evaluate vendor solutions, design reference architectures, and present business cases to executive stakeholders.`,
      practical: `Week 1: Configure Azure AD with conditional access policies, MFA, and device compliance rules. Set up Azure AD Privileged Identity Management (PIM) for just-in-time admin access. Week 2: Deploy a software-defined perimeter using OpenZiti or Twingate. Configure service tunnels and micro-segmentation rules. Week 3: Build a SIEM correlation rule set in Splunk or Elastic Security. Create rules for brute-force detection, lateral movement, and data exfiltration. Week 4: Implement network segmentation using VLANs and firewall rules on pfSense. Test isolation between development, production, and DMZ zones using penetration testing tools. Week 5: Design a disaster recovery plan for a simulated enterprise. Implement backup strategies using Veeam or AWS Backup, and perform a failover test. Week 6: Conduct a tabletop exercise simulating a sophisticated APT attack. Document detection points, containment strategies, and communication protocols. Week 7: Build a security metrics dashboard showing MTTR, detection rate, and compliance posture. Present findings to a simulated executive board. Week 8: Write a comprehensive security architecture document for a fictional organization, including network diagrams, data flow diagrams, and control matrices.`,
      summary: `Graduates will be able to design, evaluate, and communicate enterprise security strategies that balance protection with business enablement. They will understand zero trust principles deeply enough to implement them incrementally in real organizations, manage trade-offs between security and usability, and justify security investments to non-technical executives. Students will gain hands-on experience with enterprise security tools including SIEM, SOAR, PAM, and CASB platforms. They will be prepared for senior roles such as Security Architect, CISO advisor, or Enterprise Security Consultant. The course emphasizes that security is not a product but a process, and that successful architecture requires continuous adaptation to evolving threats, regulatory requirements, and business objectives.`,
    },
    instructor: { name: 'Dr. Emeka Okafor', bio: 'CISM, CISA, ex-Bank CISO', avatar: 'https://i.pravatar.cc/150?u=emeka' },
  },

  // Hacking
  {
    title: 'Ethical Hacking Fundamentals',
    category: 'Hacking',
    level: 'Beginner',
    price: 9500,
    duration: '8 weeks',
    description: 'Learn penetration testing methodology, reconnaissance, scanning, exploitation, and reporting. Prepare for CEH practical concepts.',
    notes: {
      explanation: `This course provides a comprehensive academic introduction to ethical hacking and penetration testing, grounded in the legal, ethical, and professional frameworks that govern security research. Students study the full penetration testing lifecycle as defined by PTES (Penetration Testing Execution Standard) and NIST SP 800-115, including pre-engagement interactions, intelligence gathering, threat modeling, vulnerability analysis, exploitation, post-exploitation, and reporting. The course covers the legal landscape including the Computer Fraud and Abuse Act (CFAA), the UK Computer Misuse Act, and Nigerian Cybercrime Act 2015, emphasizing the critical importance of written authorization before any testing activity. Technical topics include network scanning with Nmap using all scan types and timing templates, service enumeration with Nmap scripting engine (NSE), vulnerability scanning with Nessus and OpenVAS, web application testing using Burp Suite Professional, and exploitation using Metasploit Framework. Students learn about the OWASP Top 10 2021, including broken access control, cryptographic failures, and injection vulnerabilities, and how to identify them in real applications. The course also covers social engineering tactics, physical security assessment methodology, and the art of writing clear, actionable penetration test reports that management and technical teams can understand.`,
      practical: `Week 1: Set up a professional Kali Linux lab with VirtualBox. Configure isolated host-only networks. Install and configure Burp Suite, Nmap, Metasploit, and Wireshark. Week 2: Perform passive and active reconnaissance on a target network. Use OSINT tools like theHarvester, Maltego, and Shodan. Document findings in a reconnaissance report. Week 3: Conduct comprehensive Nmap scans: \`nmap -sS -sV -sC -O -p- target.com\`. Analyze results, identify open ports and services, and research potential vulnerabilities. Week 4: Test web applications for SQL injection using sqlmap: \`sqlmap -u "http://target.com/page?id=1" --dbs\`. Discover and exploit cross-site scripting (XSS) in DVWA. Week 5: Exploit vulnerabilities using Metasploit: \`msfconsole\`, \`use exploit/windows/smb/ms17_010_eternalblue\`, \`set RHOSTS 192.168.1.50\`, \`exploit\`. Practice post-exploitation with Mimikatz for credential harvesting. Week 6: Perform password attacks using Hashcat: \`hashcat -m 0 -a 0 hashes.txt rockyou.txt\`. Conduct a Kerberoasting attack with Impacket. Week 7: Write a professional penetration test report including executive summary, technical findings, risk ratings, and remediation recommendations. Week 8: Complete a full-scope penetration test of a vulnerable VM (e.g., OWASP Juice Shop or TryHackMe), from initial recon to final report.`,
      summary: `Graduates will be able to conduct authorized penetration tests across network, web application, and social engineering domains. They will understand the legal and ethical boundaries of security testing, including when and how to obtain proper authorization, and will be able to document findings in reports that satisfy PCI-DSS, HIPAA, and other regulatory requirements. Students will gain proficiency with industry-standard tools including Kali Linux, Nmap, Burp Suite, Metasploit, and Hashcat, and will understand how these tools fit into a structured testing methodology. The course prepares students for the EC-Council CEH and practical OSCP certifications. Graduates will be valuable assets to organizations seeking to identify and remediate security vulnerabilities before malicious actors can exploit them.`,
    },
    instructor: { name: 'Tunde Bakare', bio: 'CEH, OSCP, bug bounty hunter', avatar: 'https://i.pravatar.cc/150?u=tunde' },
  },
  {
    title: 'Advanced Exploit Development',
    category: 'Hacking',
    level: 'Advanced',
    price: 19500,
    duration: '12 weeks',
    description: 'Deep dive into binary exploitation, reverse engineering, and custom exploit development for Windows and Linux.',
    notes: {
      explanation: `This advanced course provides a deep technical dive into binary exploitation, reverse engineering, and custom exploit development for modern operating systems. Students begin with computer architecture fundamentals: x86 and x64 instruction sets, memory layout (stack, heap, code segments), calling conventions (cdecl, stdcall, fastcall), and register usage. The course covers stack-based buffer overflows in detail, including how stack frames are constructed, how return addresses are overwritten, and how to bypass modern protections such as stack canaries (StackGuard, ProPolice), NX/DEP (No-Execute), and ASLR (Address Space Layout Randomization). Students learn return-oriented programming (ROP) to chain existing code snippets (gadgets) when injected shellcode is not executable, and return-to-libc attacks for systems with full RELRO. Heap exploitation topics include heap metadata corruption, unlink() attacks, fastbin poisoning, and the House of series techniques (House of Force, House of Spirit, House of Lore). The course covers fuzzing methodologies using AFL++, libFuzzer, and custom fuzzers to discover vulnerabilities in closed-source binaries. Students also study patch diffing to identify security fixes, kernel exploitation basics, and sandbox escape techniques. Throughout, the course emphasizes responsible disclosure, vulnerability coordination, and the development of detection signatures to help defenders.`,
      practical: `Week 1: Set up a Windows 10 and Ubuntu 22.04 lab with GDB, GDB-Peda, and IDA Free. Analyze a simple vulnerable C program: compile with \`gcc -fno-stack-protector -z execstack vulnerable.c -o vulnerable\`. Use GDB to inspect the stack before and during overflow. Week 2: Exploit a simple stack buffer overflow. Create a pattern with \`msf-pattern_create -l 100\`, find the offset with \`msf-pattern_offset\`, and overwrite the return address with a jump to shellcode. Week 3: Bypass a non-executable stack by ret2libc. Find the address of \`system()\` and \`/bin/sh\` in libc using \`readelf -s /lib/i386-linux-gnu/libc.so.6 | grep system\`. Week 4: Bypass ASLR by leaking a libc address from the stack or GOT (Global Offset Table). Use a partial overwrite to defeat ASLR on 32-bit systems. Week 5: Perform heap exploitation on CTF challenges. Use the fastbin dup technique to achieve arbitrary write. Understand heap chunk metadata and the malloc free list structure. Week 6: Write a custom fuzzer in Python to crash a target binary. Use AFL++ to instrument the binary and discover unique crashes. Triage crashes with !exploitable or crashwalk. Week 7: Perform static analysis on a packed malware sample using Detect It Easy (DIE) and unpack it with x64dbg. Extract configuration data and C2 addresses. Week 8: Analyze a real-world CVE (e.g., CVE-2021-44228 Log4Shell) from initial advisory through patch diffing and exploit development. Write a detection rule for the vulnerability.`,
      summary: `Graduates will possess deep technical skills in binary exploitation, reverse engineering, and vulnerability research. They will understand low-level computer architecture, memory corruption vulnerabilities, and modern exploit mitigations well enough to evaluate software security, discover new vulnerabilities, and develop proof-of-concept exploits. Students will gain proficiency with industry-standard tools including IDA Pro, Ghidra, GDB, x64dbg, WinDbg, and fuzzing frameworks. They will be prepared for advanced security roles such as vulnerability researcher, exploit developer, or malware analyst, and will have a strong foundation for certifications such as SANS GREM and Offensive Security OSED. The course emphasizes responsible disclosure, and students will understand how to work with vendors, coordinate with CERT/CC, and develop detection signatures to protect the broader community.`,
    },
    instructor: { name: 'Chidinma Eze', bio: 'RE, exploit dev, 8 years infosec', avatar: 'https://i.pravatar.cc/150?u=chidinma' },
  },

  // Networks
  {
    title: 'Network Security Essentials',
    category: 'Networks',
    level: 'Beginner',
    price: 7800,
    duration: '6 weeks',
    description: 'Understand TCP/IP, firewalls, IDS/IPS, VPNs, and secure network design. Configure and harden network infrastructure.',
    notes: {
      explanation: `This course provides a rigorous academic and practical foundation in network security, covering the theoretical underpinnings of computer networking and the practical skills required to secure modern infrastructure. Students begin with the OSI and TCP/IP models, examining each layer for security implications. The physical layer covers cable security, port security, and physical access controls. The data link layer covers VLANs, ARP spoofing, MAC flooding, and Dynamic ARP Inspection (DAI). The network layer covers IPsec, routing protocol security (OSPF, BGP authentication), and firewall architectures. The transport layer covers TLS 1.3, SSL/TLS attack vectors including POODLE, BEAST, and Heartbleed, and the proper configuration of cipher suites. The application layer covers DNS security (DNSSEC, DNS over HTTPS), email security (SPF, DKIM, DMARC), and web application firewalls. The course examines firewall technologies in depth: stateful inspection, application-layer firewalls, next-generation firewalls (NGFW), and web application firewalls (WAF). Students study intrusion detection and prevention systems (IDS/IPS), including signature-based, anomaly-based, and behavior-based detection methodologies, with hands-on configuration of Snort and Suricata. Virtual private networks are covered extensively, including IPsec site-to-site tunnels, SSL/TLS remote access, and WireGuard. The course concludes with network monitoring and logging, teaching students to use flow data (NetFlow, sFlow), packet capture, and SIEM integration for security analytics.`,
      practical: `Week 1: Configure a home lab with GNS3 or EVE-NG. Build a topology with a router, two switches, a firewall, and three end devices. Configure inter-VLAN routing and trunking. Week 2: Perform ARP spoofing with Ettercap: \`ettercap -T -q -i eth0\`. Detect the attack using \`arp -a\` monitoring and implement DAI on a Cisco switch. Week 3: Configure a pfSense firewall with NAT, port forwarding, and VLANs. Create firewall rules to block all traffic by default and allow only necessary services. Test rule effectiveness with Nmap scans from an external host. Week 4: Install and configure Snort IDS: \`snort -T -c /etc/snort/snort.conf -i eth0\`. Write custom rules to detect SSH brute-force attempts and SQL injection payloads in HTTP traffic. Week 5: Set up IPsec tunnels between two pfSense instances using IKEv2. Configure strong encryption suites and test tunnel stability with \`tcpdump\`. Set up OpenVPN for remote access: generate certificates with Easy-RSA and configure road-warrior mode. Week 6: Set up WireGuard on Linux routers: generate keys with \`wg genkey\`, configure \`wg0.conf\`, and establish encrypted tunnels. Measure performance impact with \`iperf3\`. Week 7: Analyze network traffic with Wireshark. Capture and dissect a TLS 1.3 handshake, identify cipher suite negotiation, and extract certificate details. Detect anomalies such as unexpected certificate authorities or expired certificates. Week 8: Build a comprehensive network security monitoring solution using Elastic Stack. Ingest Zeek logs and Suricata alerts, create Kibana dashboards for traffic analysis, and set up alerting for suspicious activity patterns.`,
      summary: `Graduates will possess both theoretical knowledge and practical skills in network security, capable of designing, implementing, and monitoring secure network infrastructures. They will understand security implications at every layer of the networking stack and will be able to configure firewalls, IDS/IPS, VPNs, and network monitoring tools. Students will gain hands-on experience with industry-standard platforms including Cisco IOS, pfSense, Snort, Suricata, Wireshark, and the Elastic Stack. They will be prepared for roles such as Network Security Engineer, SOC Analyst, or Security Consultant, and will have a strong foundation for certifications including CompTIA Network+, Security+, Cisco CCNA Security, and SANS GSEC. The course emphasizes that network security is not just about technology but also about process, policy, and continuous monitoring in an evolving threat landscape.`,
    },
    instructor: { name: 'Musa Ibrahim', bio: 'CCIE, network security engineer', avatar: 'https://i.pravatar.cc/150?u=musa' },
  },
  {
    title: 'Cloud & Hybrid Network Security',
    category: 'Networks',
    level: 'Advanced',
    price: 17000,
    duration: '9 weeks',
    description: 'Secure AWS/Azure/GCP networking, implement zero-trust network access, and defend cloud-native infrastructure.',
    notes: {
      explanation: `This advanced course explores the unique security challenges of cloud and hybrid network architectures, where traditional perimeter-based security models break down. Students study the AWS, Azure, and GCP networking models in depth: AWS VPCs with public and private subnets, route tables, network ACLs, and security groups; Azure VNets with NSGs, Azure Firewall, and Azure Bastion; GCP VPCs with firewall rules, Cloud Router, and Cloud NAT. The course examines the shared responsibility model in detail, clarifying which security controls the cloud provider manages and which the customer must implement. Students learn about cloud-native security services including AWS GuardDuty, Azure Sentinel, GCP Security Command Center, and third-party CSPM tools. Zero trust network access (ZTNA) is covered extensively, with students evaluating solutions from Zscaler, Palo Alto Prisma Access, and Cloudflare Zero Trust. The course covers DNS security in the cloud, including Route 53 Resolver DNS Firewall, Azure DNS Private Resolver, and GCP Cloud DNS policies. Students also study DDoS protection at multiple layers: AWS Shield Advanced, Azure DDoS Protection, and Cloudflare Magic Transit. The course examines hybrid connectivity options including site-to-site VPNs, dedicated interconnects (AWS Direct Connect, Azure ExpressRoute, GCP Cloud Interconnect), and software-defined WAN (SD-WAN) with integrated security. Throughout, students apply risk assessment methodologies to cloud environments and design architectures that meet compliance requirements including PCI-DSS, HIPAA, and GDPR.`,
      practical: `Week 1: Deploy a multi-tier AWS architecture with public and private subnets. Configure security groups with least-privilege rules. Test connectivity and document the attack surface. Week 2: Harden an Azure VNet with NSGs, Azure Firewall, and Azure Bastion. Implement forced tunneling and inspect outbound traffic with Azure Firewall logs. Week 3: Set up Cloudflare Zero Trust for a simulated workforce. Configure access policies based on device posture, identity provider integration, and application-specific rules. Week 4: Implement DDoS protection using AWS Shield Advanced and Cloudflare. Simulate a SYN flood attack using hping3 and demonstrate mitigation effectiveness. Week 5: Configure hybrid connectivity with AWS Site-to-Site VPN and Direct Connect. Monitor traffic with VPC Flow Logs and Traffic Mirroring. Analyze captured traffic in Wireshark. Week 6: Deploy a GCP architecture with VPC Service Controls, Cloud NAT, and firewall policies. Test egress restrictions and verify that data exfiltration is prevented. Week 7: Build a cloud network monitoring solution using native cloud tools and open-source alternatives. Create dashboards for traffic analysis, anomaly detection, and compliance reporting. Week 8: Design and present a comprehensive cloud security architecture for a multi-cloud enterprise, including network diagrams, control matrices, and incident response playbooks.`,
      summary: `Graduates will be able to design, implement, and manage secure cloud and hybrid network architectures across AWS, Azure, and GCP. They will understand the shared responsibility model and will be able to implement compensating controls for cloud-specific risks including misconfigurations, insecure APIs, and data exposure. Students will gain hands-on experience with cloud-native security services and third-party ZTNA solutions, and will be able to evaluate and recommend appropriate security controls based on organizational requirements and regulatory obligations. The course prepares students for cloud security certifications including AWS Security Specialty, Azure Security Engineer, and CCSP. Graduates will be well-suited for roles such as Cloud Security Engineer, Cloud Network Architect, or Security Consultant focused on multi-cloud environments.`,
    },
    instructor: { name: 'Fatima Yusuf', bio: 'AWS/Azure security specialist', avatar: 'https://i.pravatar.cc/150?u=fatima' },
  },

  // Compliance
  {
    title: 'GDPR & Data Protection Compliance',
    category: 'Compliance',
    level: 'Beginner',
    price: 7200,
    duration: '5 weeks',
    description: 'Navigate GDPR, NDPR, and global privacy laws. Build compliant data handling processes and avoid costly fines.',
    notes: {
      explanation: `This course provides a comprehensive examination of data protection laws and privacy compliance frameworks that govern how organizations collect, process, store, and transfer personal data. Students begin with the historical context of privacy rights, from the Universal Declaration of Human Rights to the modern regulatory landscape. The General Data Protection Regulation (GDPR) is studied in depth, covering its territorial scope, definitions of personal data and special category data, lawful bases for processing (consent, contract, legal obligation, vital interests, public task, legitimate interests), and the rights of data subjects (access, rectification, erasure, restriction, portability, objection, and rights related to automated decision-making). Students examine the roles of data controllers, processors, and sub-processors, and the joint controller obligations under Article 26. The course covers Data Protection Impact Assessments (DPIA), Privacy by Design and by Default principles, and the requirements for Data Protection Officers (DPO). Breach notification obligations under Article 33 (72-hour notification to supervisory authority) and Article 34 (communication to data subjects) are analyzed with real-world case studies including British Airways (\u00A320M fine), Marriott (\u00A318.4M fine), and Meta (\u20AC1.2B fine). The course also examines the Nigeria Data Protection Act (NDPA) 2023, comparing its provisions with GDPR and highlighting local implementation requirements. Additional frameworks studied include CCPA/CPRA, PIPL (China), and LGPD (Brazil), giving students a global perspective on privacy compliance.`,
      practical: `Week 1: Perform a data mapping exercise for a simulated organization. Identify all personal data flows, lawful bases, retention periods, and transfer mechanisms. Document findings in a Record of Processing Activities (RoPA). Week 2: Conduct a privacy audit of a website. Evaluate cookie consent mechanisms, privacy policy completeness, data collection practices, and third-party processor agreements against GDPR requirements. Week 3: Process a simulated Data Subject Access Request (DSAR). Locate all personal data for the requester across multiple systems, redact third-party data, and produce a response within the statutory timeframe. Week 4: Conduct a DPIA for a new HR monitoring system. Identify risks to data subjects, evaluate necessity and proportionality, and document mitigation measures. Week 5: Simulate a data breach scenario. Classify the severity, assess the need for regulatory notification, draft communication to the supervisory authority, and prepare customer notifications. Week 6: Review and redraft a privacy policy and terms of service to ensure GDPR and NDPR compliance. Include all required disclosures, data subject rights, and contact information. Week 7: Map vendor relationships to third-party processors. Draft Data Processing Agreements (DPAs) that meet Article 28 requirements, including audit rights, security obligations, and sub-processor governance. Week 8: Develop a comprehensive privacy compliance program including policies, procedures, training materials, and a governance framework for ongoing compliance.`,
      summary: `Graduates will possess a thorough understanding of global privacy regulations and will be able to implement and manage data protection compliance programs. They will be able to conduct DPIAs, respond to data subject requests, manage vendor relationships through DPAs, and lead breach response efforts in accordance with regulatory requirements. Students will understand the differences between GDPR, NDPR, and other major privacy frameworks, enabling them to advise organizations operating in multiple jurisdictions. The course prepares students for the role of Data Protection Officer (DPO) or Privacy Compliance Manager, and provides a strong foundation for certifications including the IAPP CIPP/E, CIPM, and CIPT. Graduates will be equipped to help organizations avoid costly fines, build customer trust through transparent data practices, and navigate the complex intersection of technology, law, and ethics in the digital age.`,
    },
    instructor: { name: 'Ngozi Adeyemi', bio: 'DPO, privacy law consultant', avatar: 'https://i.pravatar.cc/150?u=ngozi' },
  },
  {
    title: 'ISO 27001 & SOC 2 Implementation',
    category: 'Compliance',
    level: 'Advanced',
    price: 16000,
    duration: '10 weeks',
    description: 'Implement ISMS, prepare for ISO 27001 certification, and design SOC 2 Trust Service Criteria controls.',
    notes: {
      explanation: `This advanced course provides an in-depth study of information security management systems (ISMS) and service organization control reporting, preparing students to lead certification projects in real organizations. The ISO 27001 component covers the ISMS lifecycle in detail: establishing the scope and context of the organization (Clause 4), leadership and commitment from top management (Clause 5), planning including risk assessment and treatment (Clause 6), support including resources, competence, awareness, communication, and documented information (Clause 7), operation of the ISMS (Clause 8), performance evaluation through monitoring, measurement, analysis, internal audit, and management review (Clause 9), and continual improvement (Clause 10). Students study Annex A controls in depth, organized into four themes: organizational (information security policies, organization of information security, human resource security, asset management), people (secure development and support processes, supplier relationships), physical (physical security perimeters, equipment security), and technological (access control, cryptography, systems security, network security, supplier relationships, incident management). The SOC 2 component covers the Trust Service Criteria (TSC): security (common criteria), availability, processing integrity, confidentiality, and privacy. Students learn to map controls to criteria, design evidence-based control matrices, and prepare for attestation examinations. The course examines the differences between Type I (design suitability) and Type II (operating effectiveness) reports, and teaches students how to prepare organizations for both. Real-world case studies include ISO 27001 certification journeys and SOC 2 examinations across SaaS, fintech, and healthcare organizations.`,
      practical: `Week 1: Define the scope of an ISMS for a simulated SaaS company. Conduct a stakeholder analysis, identify legal and regulatory requirements, and document the context of the organization. Week 2: Perform a comprehensive risk assessment using OCTAVE or ISO 27005. Identify assets, threats, vulnerabilities, and impacts. Calculate risk levels and prioritize treatment plans. Week 3: Select and implement Annex A controls. Create a Statement of Applicability (SoA) with justifications for included and excluded controls. Document control objectives and implementation statements. Week 4: Design and execute an internal audit program. Create audit checklists, conduct interviews, review evidence, and produce audit reports with findings and corrective action requests. Week 5: Map ISO 27001 controls to SOC 2 criteria. Build a cross-reference matrix showing how each Annex A control satisfies one or more Trust Service Criteria. Week 6: Prepare a Type I SOC 2 report. Write control narratives, describe the system, and document control design for a service organization. Week 7: Conduct a gap assessment against both ISO 27001 and SOC 2. Identify remediation priorities, create an implementation roadmap, and present findings to executive leadership. Week 8: Simulate a certification audit. Role-play as both auditee and auditor. Present evidence, respond to findings, and develop a corrective action plan.`,
      summary: `Graduates will be able to lead ISO 27001 implementation projects and SOC 2 examination preparations from initial scoping through certification. They will understand the ISMS lifecycle deeply enough to maintain and continually improve security management systems, and will be able to design control frameworks that satisfy both ISO 27001 and SOC 2 requirements simultaneously. Students will gain practical experience with risk assessment methodologies, control selection and implementation, internal auditing, and certification body interactions. The course prepares students for professional roles including ISMS Manager, Information Security Consultant, Compliance Manager, and Auditor. Graduates will also be well-prepared for certifications including ISO 27001 Lead Implementer, ISO 27001 Lead Auditor, and AICPA SOC 2 Practitioner. The skills learned are directly applicable to organizations of all sizes seeking to demonstrate security commitment to customers, regulators, and partners.`,
    },
    instructor: { name: 'Mr. Kolade', bio: 'Lead Auditor, ISO 27001, SOC 2', avatar: 'https://i.pravatar.cc/150?u=kolade' },
  },

  // Forensics
  {
    title: 'Digital Forensics Fundamentals',
    category: 'Forensics',
    level: 'Beginner',
    price: 8900,
    duration: '7 weeks',
    description: 'Collect, preserve, and analyze digital evidence. Learn forensic tools, chain of custody, and courtroom testimony.',
    notes: {
      explanation: `This course provides a rigorous academic and practical foundation in digital forensics, the scientific method of collecting, preserving, analyzing, and presenting digital evidence in a manner admissible in court. Students study the forensic methodology framework: identification, preservation, collection, examination, analysis, and presentation. The course covers the legal foundations of digital forensics, including search and seizure law, chain of custody requirements, rules of evidence (Federal Rules of Evidence in the US, Evidence Act in Nigeria), and the role of the expert witness. Students examine file system structures in depth: FAT32, NTFS, ext4, and APFS, understanding how deleted files are marked for overwriting, how slack space and unallocated clusters preserve remnants of old data, and how forensic tools recover this information. The course covers memory forensics including the structure of virtual memory, process address spaces, and how malware hides in memory. Students learn about network forensics, including the capture and analysis of network traffic, reconstruction of communication sessions, and attribution of network activity. The course also examines mobile device forensics, covering logical and physical extraction from Android and iOS devices, and the challenges of encrypted devices. Students study anti-forensic techniques including data wiping, steganography, file encryption, and timestamp manipulation, learning to detect when these techniques have been used.`,
      practical: `Week 1: Set up a forensic workstation with Kali Linux or Remnux. Install and configure Autopsy, volatility, and FTK Imager. Create a forensic image of a USB drive using \`dd if=/dev/sdb of=evidence.img bs=4M conv=noerror,sync\`. Verify the image with MD5 checksums. Week 2: Analyze a forensic image in Autopsy. Recover deleted files, examine file system metadata (timestamps, permissions, alternate data streams), and search for keywords using regular expressions. Week 3: Perform memory forensics with Volatility 3. Analyze a memory dump from an infected Windows machine: \`vol -f memory.raw windows.pslist\` to identify suspicious processes, \`windows.malfind\` to detect injected code, and \`windows.dlllist\` to examine loaded modules. Week 4: Conduct network forensics with Wireshark. Reconstruct a complete HTTP session including POST data. Extract transferred files, identify suspicious DNS queries, and detect covert channels in ICMP traffic. Week 5: Perform email forensics. Analyze email headers to trace the origin of a phishing message. Examine SPF, DKIM, and DMARC results. Extract attachments and analyze embedded URLs. Week 6: Conduct a browser forensics examination. Analyze SQLite databases, cookies, cache, and download history from Chrome and Firefox profiles. Reconstruct browsing sessions and identify visited URLs. Week 7: Write a comprehensive forensic report documenting the examination process, findings, and conclusions. Include hash values, timestamps, and evidence screenshots. Format the report for potential use in legal proceedings. Week 8: Complete a full digital investigation of a simulated crime scene, from initial acquisition through courtroom testimony simulation.`,
      summary: `Graduates will be able to conduct digital forensic investigations following legally sound methodologies that will withstand scrutiny in court. They will understand file system structures, memory organization, and network protocols well enough to recover and interpret digital evidence. Students will gain hands-on proficiency with industry-standard forensic tools including Autopsy, Volatility, Wireshark, and FTK, and will understand the limitations and anti-forensic countermeasures that may be encountered. The course prepares students for entry-level digital forensic roles in law enforcement, government agencies, or private sector incident response. Graduates will also have a strong foundation for certifications including GCFA, CCF, and CEH. The emphasis on legal procedures ensures that graduates understand the admissibility requirements for digital evidence and can serve as competent expert witnesses when required.`,
    },
    instructor: { name: 'Inspector Adaobi N.', bio: 'Digital forensic investigator', avatar: 'https://i.pravatar.cc/150?u=adaobi' },
  },
  {
    title: 'Malware Analysis & Incident Response',
    category: 'Forensics',
    level: 'Advanced',
    price: 19000,
    duration: '11 weeks',
    description: 'Analyze ransomware, Trojans, and APT malware. Build YARA rules, reverse-engineer binaries, and lead incident response.',
    notes: {
      explanation: `This advanced course provides a comprehensive study of malware analysis, reverse engineering, and incident response, preparing students to investigate, contain, and remediate sophisticated cyber threats. The malware analysis component begins with taxonomy and classification: viruses, worms, Trojans, ransomware, spyware, adware, rootkits, bootkits, fileless malware, and advanced persistent threat (APT) toolkits. Students study the malware lifecycle: initial access, execution, persistence, privilege escalation, defense evasion, credential access, discovery, lateral movement, collection, exfiltration, and impact. Static analysis techniques include file fingerprinting with hashlib and ssdeep, string extraction with FLOSS, header analysis with PEview, and import/export table examination to identify suspicious APIs. Dynamic analysis covers sandboxing with Cuckoo Sandbox, process monitoring with Process Monitor, network traffic capture, and registry modification tracking. Students learn to detect anti-analysis techniques including VM detection, debugger detection, timing attacks, and packing. The incident response component covers the NIST SP 800-61 incident response lifecycle: preparation, detection and analysis, containment/eradication/recovery, and post-incident activity. Students study threat intelligence frameworks including MITRE ATT&CK, Diamond Model of Intrusion Analysis, and the Cyber Kill Chain. They learn to extract indicators of compromise (IoCs) including IP addresses, domains, file hashes, mutex names, and registry keys, and to convert these into detection rules for SIEM and EDR platforms.`,
      practical: `Week 1: Set up an isolated malware analysis lab with REMnux, Flare VM, and INetSim. Configure network isolation and ensure malware cannot escape the lab environment. Week 2: Perform static analysis on a Windows executable. Use PEview to examine the PE header, FLOSS to extract obfuscated strings, and Dependency Walker to identify imported APIs. Determine if the binary is packed. Week 3: Perform dynamic analysis using Cuckoo Sandbox. Submit a suspicious file, analyze the behavioral report, identify injected processes, modified registry keys, and network connections. Week 4: Reverse engineer a simple malware sample using Ghidra. Identify the main function, locate the payload, and understand the command-and-control communication protocol. Week 5: Create YARA rules to detect malware families. Test rules against a malware corpus and tune for false positive reduction. Deploy rules in a SIEM environment. Week 6: Respond to a simulated ransomware incident. Isolate affected systems, preserve evidence, identify the ransomware variant, and determine the attack vector. Document containment and eradication steps. Week 7: Build a threat hunting hypothesis using MITRE ATT&CK. Search SIEM logs for techniques including T1059 (Command and Scripting Interpreter), T1078 (Valid Accounts), and T1047 (Windows Management Instrumentation). Week 8: Write a comprehensive incident report including timeline reconstruction, IoC extraction, remediation steps, and improvement recommendations. Present findings to a simulated executive board.`,
      summary: `Graduates will be able to analyze malware using both static and dynamic techniques, reverse engineer binaries to understand behavior, and create detection rules that protect organizations from similar threats. They will be able to lead incident response efforts from initial detection through recovery, following structured methodologies that minimize damage and preserve evidence. Students will gain hands-on experience with industry-standard tools including Ghidra, IDA Free, x64dbg, Cuckoo Sandbox, REMnux, and YARA. They will understand how to extract and operationalize threat intelligence using MITRE ATT&CK and the Diamond Model. The course prepares students for roles such as Malware Analyst, Incident Responder, Threat Hunter, or DFIR Consultant, and provides a strong foundation for certifications including SANS GREM, GCFA, and OSCE. Graduates will be equipped to protect organizations from advanced threats and to respond effectively when defenses are breached.`,
    },
    instructor: { name: 'Dr. Kemi Balogun', bio: 'Malware researcher, DFIR expert', avatar: 'https://i.pravatar.cc/150?u=kemi' },
  },

  // Administration
  {
    title: 'Security Operations Center (SOC) Administration',
    category: 'Administration',
    level: 'Beginner',
    price: 9200,
    duration: '7 weeks',
    description: 'Run a modern SOC: ticketing, alert triage, escalation, metrics, and toolchain management.',
    notes: {
      explanation: `This course provides a comprehensive study of Security Operations Center (SOC) operations, from foundational concepts to advanced management techniques. Students examine the evolution of SOC models from centralized, on-premise operations to modern, cloud-native, and hybrid SOCs operating on a 24/7/365 basis. The course covers SOC organizational structures in depth: SOC Tier 1 (alert triage and initial response), SOC Tier 2 (incident investigation and escalation), SOC Tier 3 (threat hunting and research), and SOC Tier 4 (engineering, tool development, and automation). Students study the MITRE ATT&CK framework as a threat-informed detection and hunting methodology, learning to map organizational risk to specific techniques and develop detection coverage matrices. Key performance indicators (KPIs) and key risk indicators (KRIs) are examined in detail, including mean time to detect (MTTD), mean time to respond (MTTR), alert volume and accuracy, and analyst utilization. The course covers threat intelligence integration, including the use of STIX/TAXII for structured threat data exchange, TAXII server configuration, and the integration of commercial and open-source threat feeds into SIEM platforms. Students learn about Security Orchestration, Automation, and Response (SOAR) platforms, including use case development, playbook design, and the metrics used to measure automation success. The course also covers service level agreements (SLAs), escalation procedures, and communication protocols with stakeholders including legal, PR, and executive teams. Students examine the business context of SOC operations, including budget justification, vendor selection, and the metrics used to demonstrate security ROI to the C-suite.`,
      practical: `Week 1: Design a SOC organizational chart and define roles and responsibilities for each tier. Create runbooks for common alert types including phishing, malware, DDoS, and data exfiltration. Week 2: Configure a SIEM platform (Splunk, Elastic, or QRadar) with sample logs. Create correlation rules for brute-force detection, lateral movement, and data exfiltration. Tune rules to reduce false positives. Week 3: Perform alert triage on simulated SOC alerts. Classify alerts by severity, investigate using SIEM queries and endpoint telemetry, and determine escalation paths. Document findings in a ticketing system. Week 4: Configure threat intelligence feeds in a TAXII client. Parse STIX 2.1 indicators and create SIEM detection rules. Evaluate feed quality by measuring detection rate and false positive rate. Week 5: Design SOAR playbooks for common incident types. Map automation opportunities and calculate potential time savings. Implement a simple playbook using Python or a commercial SOAR platform. Week 6: Build a SOC metrics dashboard showing MTTD, MTTR, alert volume, analyst productivity, and threat coverage. Present the dashboard to simulated stakeholders. Week 7: Conduct a tabletop exercise simulating a ransomware attack. Walk through detection, containment, eradication, and recovery phases. Document decisions and identify process improvements. Week 8: Develop a comprehensive SOC strategy document including technology roadmap, staffing plan, budget proposal, and maturity assessment.`,
      summary: `Graduates will be able to manage and operate a modern SOC, from daily alert triage to strategic planning and executive communication. They will understand the roles and responsibilities of each SOC tier and will be able to design effective organizational structures, runbooks, and escalation procedures. Students will gain hands-on experience with SIEM platforms, threat intelligence integration, and SOAR automation, and will be able to measure and improve SOC performance using industry-standard KPIs. The course prepares students for roles such as SOC Manager, SOC Analyst, Threat Intelligence Analyst, or Security Operations Consultant. Graduates will be equipped to build high-performing security teams, implement threat-informed detection strategies, and demonstrate the business value of security operations to executive stakeholders. The skills learned are directly applicable to organizations of all sizes, from startups building their first SOC to enterprises optimizing mature operations.`,
    },
    instructor: { name: 'Yusuf Aliyu', bio: 'SOC manager, 12 years experience', avatar: 'https://i.pravatar.cc/150?u=yusuf' },
  },
  {
    title: 'Security Leadership & Program Management',
    category: 'Administration',
    level: 'Advanced',
    price: 15000,
    duration: '8 weeks',
    description: 'Build and lead security teams, manage budgets, drive culture change, and align security with business goals.',
    notes: {
      explanation: `This advanced course prepares cybersecurity professionals for leadership roles, focusing on the strategic, managerial, and business skills required to build and lead world-class security organizations. Students examine the evolution of the CISO role from technical expert to business strategist, studying how successful security leaders align security initiatives with organizational objectives, manage risk at the enterprise level, and communicate effectively with boards of directors. The course covers security strategy development, including the creation of security visions, mission statements, and multi-year roadmaps that balance protection with business enablement. Students learn budget management and financial justification, including ROI calculations for security investments, total cost of ownership (TCO) analysis, and the use of risk matrices to prioritize spending. Stakeholder management is examined in depth, with students learning to translate technical security concepts into business language that resonates with executives, board members, investors, and customers. The course covers security culture and behavior change, examining how to move beyond compliance-checkbox approaches to build genuine security awareness and accountability throughout the organization. Students study security program maturity models including CMMI, BSIMM, and the NIST Cybersecurity Framework, and learn to conduct maturity assessments that drive improvement initiatives. The course also covers crisis leadership, business continuity planning, and the communication protocols required during major security incidents. Additional topics include vendor and third-party risk management, M&A due diligence from a security perspective, and the regulatory landscape affecting security leadership including SEC disclosure requirements and the EU Cyber Resilience Act.`,
      practical: `Week 1: Develop a three-year security strategy for a simulated mid-size enterprise. Conduct a current-state assessment, define target-state objectives, and create an implementation roadmap with milestones and resource requirements. Week 2: Build a security budget proposal including headcount, technology, services, and training. Calculate ROI for proposed investments using risk reduction metrics and cost avoidance estimates. Present to a simulated executive finance committee. Week 3: Design a security awareness and culture change program. Develop training content, phishing simulation campaigns, and metrics to measure behavior change over time. Week 4: Conduct a board-level security briefing. Translate technical risk into business impact, present key metrics, and recommend board-level security initiatives. Practice handling difficult questions from non-technical directors. Week 5: Manage a simulated major security incident as CISO. Coordinate technical response, communications with legal and PR teams, regulatory reporting, and customer notifications. Document decisions and lessons learned. Week 6: Evaluate security vendors and negotiate contracts. Assess SaaS security platforms, MSSP services, and consulting engagements. Develop RFP evaluation criteria and scorecards. Week 7: Perform a third-party risk assessment of a critical vendor. Review SOC 2 reports, security questionnaires, and penetration test results. Recommend risk acceptance, mitigation, or termination. Week 8: Complete a capstone project presenting a comprehensive security program transformation plan, including strategy, budget, organizational design, metrics, and a 90-day action plan.`,
      summary: `Graduates will possess the strategic, managerial, and communication skills required to lead enterprise security programs at the highest level. They will understand how to develop and execute security strategies that align with business objectives, manage security budgets and demonstrate ROI, and communicate effectively with boards of directors, investors, and customers. Students will gain practical experience with security maturity models, vendor management, crisis leadership, and organizational change management. The course prepares students for executive roles including CISO, VP of Security, CSO, or Security Program Director, and provides a strong foundation for board-level advisory positions. Graduates will be equipped to build high-performing security teams, drive cultural change, and position security as a business enabler rather than a cost center. The emphasis on real-world simulations ensures that graduates are prepared for the complex, fast-paced decision-making required at the executive level.`,
    },
    instructor: { name: 'Oluwaseun Adeyinka', bio: 'CISO, security leader', avatar: 'https://i.pravatar.cc/150?u=oluwaseun' },
  },

  // AI Automation
  {
    title: 'AI-Powered Security Automation',
    category: 'AI Automation',
    level: 'Intermediate',
    price: 14000,
    duration: '9 weeks',
    description: 'Automate threat detection, response playbooks, and security operations using AI/ML and SOAR platforms.',
    notes: {
      explanation: `This advanced course examines the application of artificial intelligence and machine learning to cybersecurity operations, with a focus on threat detection, automated response, and security orchestration. Students begin with machine learning fundamentals: supervised, unsupervised, and reinforcement learning paradigms, feature engineering for security data, and model evaluation metrics including precision, recall, F1 score, and AUC-ROC. The course applies these concepts to security use cases: anomaly detection for user and entity behavior analytics (UEBA), supervised classification for malware detection and phishing identification, clustering for incident grouping, and natural language processing for threat intelligence extraction. Students study deep learning architectures including CNNs for image-based malware classification, RNNs and transformers for sequence-based log analysis, and autoencoders for unsupervised anomaly detection. The course covers security automation and orchestration platforms (SOAR) including Palo Alto Cortex XSOAR, Splunk SOAR, and open-source alternatives like TheHive and Cortex. Students learn to design and implement playbooks that automate repetitive security tasks including alert enrichment, containment actions, and threat intelligence lookups. The ethical implications of AI in security are examined, including adversarial machine learning, model poisoning attacks, and the importance of explainable AI (XAI) for security decisions. Students also study the limitations of AI in security, including false positive rates, concept drift in threat landscapes, and the continued need for human analyst oversight.`,
      practical: `Week 1: Set up a machine learning environment with Python, scikit-learn, and TensorFlow. Load and preprocess the CIC-IDS2017 dataset. Engineer features from network flow data and train a Random Forest classifier for intrusion detection. Week 2: Train an unsupervised anomaly detection model using Isolation Forest on Windows event logs. Identify anomalous process executions and compare results with labeled malware data. Week 3: Build a phishing URL classifier using gradient boosting. Extract features from URLs including length, special character count, domain age, and lexical features. Achieve >95% accuracy on a test dataset. Week 4: Implement a UEBA system using Elastic Machine Learning. Create anomaly detection jobs for unusual login times, impossible travel, and lateral movement patterns. Tune sensitivity and investigate generated alerts. Week 5: Design and implement a SOAR playbook in TheHive. Automate alert enrichment using VirusTotal, Shodan, and WHOIS lookups. Implement containment actions including endpoint isolation and email quarantine. Week 6: Train a deep learning model for malware classification using PE file headers and section data. Use a CNN architecture and evaluate against a malware corpus. Explain model predictions using SHAP values. Week 7: Deploy an AI-powered triage bot that categorizes incoming security alerts by severity and recommends response actions. Integrate with Slack for analyst notification and feedback collection. Week 8: Present a capstone project: design and implement an end-to-end AI-assisted security operations solution, demonstrating measurable improvements in detection rate or response time.`,
      summary: `Graduates will be able to apply machine learning and AI techniques to real-world security problems, building models that detect anomalies, classify threats, and automate security operations. They will understand the strengths and limitations of AI in security, including the need for human oversight, the risks of adversarial attacks on ML models, and the importance of explainable AI for trust and compliance. Students will gain hands-on experience with ML frameworks, SOAR platforms, and security data sources, and will be able to design and implement AI-assisted security tools that reduce manual workload and improve detection capabilities. The course prepares students for emerging roles at the intersection of AI and security, including AI Security Engineer, ML Security Researcher, and Security Automation Architect. Graduates will be well-positioned to contribute to the cutting edge of security innovation as AI continues to transform the industry.`,
    },
    instructor: { name: 'Dr. Tariq Nasir', bio: 'AI/ML security researcher', avatar: 'https://i.pravatar.cc/150?u=tariq' },
  },
  {
    title: 'Intelligent Process Automation for Business',
    category: 'AI Automation',
    level: 'Beginner',
    price: 12000,
    duration: '8 weeks',
    description: 'Automate repetitive business processes using AI agents, RPA, and intelligent workflows.',
    notes: {
      explanation: `This course provides a comprehensive introduction to business process automation using artificial intelligence, robotic process automation (RPA), and intelligent workflow design. Students study the history and evolution of automation from basic scripting to modern AI agents, examining how automation has transformed industries including manufacturing, finance, healthcare, and cybersecurity. The course covers process mining and discovery techniques, teaching students how to identify automation opportunities by analyzing event logs, process flows, and operational data. Students learn workflow design principles including BPMN (Business Process Model and Notation), swimlane diagrams, and process mapping methodologies. The course examines RPA platforms including UiPath, Automation Anywhere, and Blue Prism, comparing their capabilities, licensing models, and best use cases. Students study AI agent frameworks including LangChain, AutoGPT, and CrewAI, learning how to build intelligent agents that can reason, plan, and execute complex tasks. The course covers integration patterns for enterprise tools including Slack, Microsoft Teams, Salesforce, ServiceNow, and email systems, teaching students to build workflows that span multiple applications and data sources. Natural language processing is applied to business use cases including email triage, customer support ticket classification, and document summarization. The course also examines change management for automation initiatives, including stakeholder communication, training programs, and the metrics used to measure automation success and business impact. Students study the ethical implications of automation, including job displacement concerns, algorithmic bias, and the importance of human-in-the-loop design for high-stakes decisions.`,
      practical: `Week 1: Identify and document five business processes suitable for automation. Create process maps, calculate time and cost savings, and prioritize based on business impact and technical feasibility. Week 2: Build an RPA bot using UiPath Community Edition or Power Automate. Automate the extraction of data from invoices and entry into an ERP system. Test error handling and logging. Week 3: Design an onboarding workflow that spans HR systems, IT provisioning, security training assignments, and access management. Implement conditional logic for different employee types and locations. Week 4: Build an AI email triage bot using Python and OpenAI API. Classify incoming support emails by department, urgency, and sentiment. Route emails to appropriate teams and draft suggested responses. Week 5: Create a workflow that integrates with Slack and Microsoft Teams. Build a bot that answers frequently asked questions, retrieves documents from a knowledge base, and escalates complex issues to human agents. Week 6: Automate a report generation and distribution workflow. Extract data from multiple sources, generate formatted reports using Jinja2 or similar templating, and distribute via email and Slack on a scheduled basis. Week 7: Implement exception handling and human-in-the-loop review for automation workflows. Build a review dashboard where human operators can approve, reject, or modify automated decisions. Week 8: Develop a comprehensive automation strategy for a simulated organization, including process assessment, technology selection, implementation roadmap, and ROI projections. Present to executive stakeholders.`,
      summary: `Graduates will be able to identify automation opportunities, design intelligent workflows, and implement solutions using RPA platforms and AI agent frameworks. They will understand process mining, workflow design principles, and enterprise integration patterns, and will be able to build automations that span multiple applications and data sources. Students will gain hands-on experience with UiPath, Power Automate, LangChain, and enterprise communication platforms, and will be able to measure and communicate the business impact of automation initiatives. The course prepares students for roles such as Automation Developer, RPA Engineer, AI Automation Specialist, or Business Process Consultant. Graduates will be equipped to drive efficiency improvements, reduce operational costs, and free knowledge workers from repetitive tasks to focus on higher-value activities. The emphasis on practical implementation ensures that graduates can deliver working automation solutions from day one.`,
    },
    instructor: { name: 'Blessing Eze', bio: 'Automation architect', avatar: 'https://i.pravatar.cc/150?u=blessing' },
  },

  // Web Development
  {
    title: 'Full-Stack Web Development Bootcamp',
    category: 'Web Development',
    level: 'Beginner',
    price: 13000,
    duration: '12 weeks',
    description: 'Build modern web applications with React, Next.js, Node.js, and databases. Deploy production-ready apps.',
    notes: {
      explanation: `This comprehensive bootcamp provides an academic and practical foundation in modern full-stack web development, covering the complete software development lifecycle from requirements gathering through deployment and maintenance. Students begin with foundational web technologies: HTML5 semantic markup, CSS3 with Flexbox and Grid layouts, and modern JavaScript (ES6+) including promises, async/await, destructuring, and modules. The course then covers React in depth, including component architecture, state management with useState and useReducer, side effects with useEffect, React Router for client-side navigation, and performance optimization with React.memo, useMemo, and useCallback. Students advance to Next.js, learning the App Router, server and client components, server actions, API routes, middleware, and the Image and Font optimization systems. The backend component covers Node.js runtime architecture, Express.js framework design patterns, RESTful API design principles including resource naming, HTTP method usage, status codes, and versioning strategies. Database design covers MongoDB with Mongoose ODM, including schema design, validation, indexing, and aggregation pipelines. Authentication and authorization are covered extensively, including session-based auth, JWT tokens, password hashing with bcrypt, and integration with NextAuth.js. Deployment topics include Vercel and AWS Amplify configuration, environment variable management, CI/CD pipelines with GitHub Actions, and monitoring with Sentry and Vercel Analytics. The course also covers testing strategies including unit tests with Jest and React Testing Library, and end-to-end tests with Playwright.`,
      practical: `Week 1: Build a responsive portfolio website using HTML5, CSS3 Grid, and vanilla JavaScript. Deploy to Vercel or Netlify. Implement responsive design with mobile-first CSS and media queries. Week 2: Create a React application with functional components and hooks. Build a todo application with CRUD operations, local storage persistence, and optimistic UI updates. Week 3: Build a Next.js application with the App Router. Implement server components, client components, and server actions. Create dynamic routes with slug-based page generation. Week 4: Design and implement a RESTful API with Express.js and MongoDB. Create endpoints for a resource (e.g., products) with full CRUD operations, input validation with Zod, and error handling middleware. Week 5: Implement authentication in a Next.js application using NextAuth.js. Configure credentials provider, JWT sessions, and protected routes. Implement role-based access control. Week 6: Build a full-stack SaaS dashboard with React, Next.js, and MongoDB. Implement data tables with sorting and filtering, charts with Recharts, and dark mode with Tailwind CSS. Week 7: Set up CI/CD with GitHub Actions. Automate testing, building, and deployment. Configure preview deployments for pull requests. Add error monitoring with Sentry. Week 8: Complete a capstone project: design, build, and deploy a production-ready full-stack application of your choice. Include comprehensive documentation, tests, and a live demo.`,
      summary: `Graduates will possess practical full-stack development skills using modern technologies including React, Next.js, Node.js, and MongoDB. They will be able to build responsive user interfaces, design RESTful APIs, implement authentication and authorization, and deploy applications to production. Students will understand software development best practices including code organization, testing strategies, CI/CD pipelines, and performance optimization. The course prepares students for entry-level positions as Full-Stack Developer, Frontend Developer, Backend Developer, or Software Engineer, and provides a strong foundation for continuing education in specialized areas such as mobile development, DevOps, or security engineering. Graduates will be able to contribute to development teams immediately, with a portfolio of projects demonstrating their skills and an understanding of the complete web development lifecycle.`,
    },
    instructor: { name: 'Chinedu Okafor', bio: 'Senior full-stack engineer', avatar: 'https://i.pravatar.cc/150?u=chinedu' },
  },
  {
    title: 'Advanced Web Security & Secure Coding',
    category: 'Web Development',
    level: 'Advanced',
    price: 17000,
    duration: '8 weeks',
    description: 'Harden web applications against OWASP Top 10, implement secure coding practices, and perform security testing.',
    notes: {
      explanation: `This advanced course provides a deep, structured examination of web application security, secure coding practices, and security testing methodologies, preparing developers to build applications that resist modern attack techniques. The course begins with the OWASP Top 10 2021, studied in depth: broken access control (IDOR, privilege escalation, CORS misconfiguration), cryptographic failures (weak algorithms, improper key management, insecure randomness), injection attacks (SQL injection, NoSQL injection, command injection, LDAP injection, SSRF), insecure design (missing security controls, flawed business logic), security misconfiguration (default credentials, verbose error messages, unnecessary features), vulnerable and outdated components (dependency confusion, CVE exploitation, SBOM management), identification and authentication failures (session fixation, credential stuffing, weak password policies), software and data integrity failures (insecure deserialization, CI/CD pipeline compromise), security logging and monitoring failures (insufficient logging, inadequate incident response), and server-side request forgery. Students learn secure coding practices including input validation and sanitization, parameterized queries, prepared statements, output encoding, Content Security Policy (CSP), HTTP security headers (HSTS, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy), and CORS configuration. The course covers authentication architecture including session management, JWT security (algorithm confusion, none algorithm, signature bypass), OAuth 2.0 and OIDC security considerations, and multi-factor authentication implementation. Security testing methodologies include threat modeling with STRIDE, static application security testing (SAST) with Semgrep and SonarQube, dynamic application security testing (DAST) with OWASP ZAP and Burp Suite, and interactive application security testing (IAST). Students also examine secure deployment and runtime protection techniques.`,
      practical: `Week 1: Set up a vulnerable application (DVWA or OWASP Juice Shop) and OWASP ZAP. Configure ZAP for automated scanning and learn to interpret results, distinguishing true positives from false positives. Week 2: Exploit SQL injection vulnerabilities using both manual techniques and sqlmap: \`sqlmap -u "http://target.com/api?id=1" --dbs --batch\`. Implement parameterized queries in a Node.js/Express application to fix the vulnerability. Week 3: Identify and exploit IDOR vulnerabilities in a REST API. Use Burp Suite to manipulate object references and access unauthorized data. Implement proper authorization checks in the application. Week 4: Implement security headers in a Next.js application: \`next.config.js\` headers for CSP, HSTS, X-Frame-Options, and Permissions-Policy. Test header effectiveness using securityheaders.com. Week 5: Build a secure authentication system with NextAuth.js. Implement credential hashing with bcrypt, session security, rate limiting, and account lockout. Test against credential stuffing and brute-force attacks. Week 6: Perform SAST using Semgrep on a codebase. Identify insecure deserialization, hardcoded secrets, and XSS vulnerabilities. Fix findings and create custom rules for organization-specific patterns. Week 7: Implement a comprehensive security testing pipeline in GitHub Actions. Run SAST with Semgrep, dependency scanning with npm audit, container scanning with Trivy, and DAST with OWASP ZAP. Fail the build on high-severity findings. Week 8: Complete a security audit of a production application. Document findings with CVSS scores, proof-of-concept exploits, and detailed remediation guidance. Present security roadmap to engineering leadership.`,
      summary: `Graduates will be able to build secure web applications, identify vulnerabilities in existing code, and implement comprehensive security testing pipelines. They will understand the OWASP Top 10 deeply enough to recognize, exploit, and remediate each vulnerability class, and will be able to implement defense-in-depth strategies including secure headers, input validation, parameterized queries, and proper authentication architecture. Students will gain hands-on experience with security testing tools including OWASP ZAP, Burp Suite, Semgrep, and SonarQube, and will be able to integrate security into CI/CD pipelines. The course prepares students for roles such as Application Security Engineer, Secure Code Reviewer, DevSecOps Engineer, or Penetration Tester specializing in web applications. Graduates will be equipped to write code that is secure by design, review code for security vulnerabilities, and help development teams build security into their software development lifecycle.`,
    },
    instructor: { name: 'Zainab Lawal', bio: 'AppSec engineer, bug bounty hunter', avatar: 'https://i.pravatar.cc/150?u=zainab' },
  },

  // Cloud Security
  {
    title: 'Cloud Security Fundamentals (AWS/Azure/GCP)',
    category: 'Cloud Security',
    level: 'Beginner',
    price: 11000,
    duration: '7 weeks',
    description: 'Secure cloud infrastructure, manage identity and access, and protect data in multi-cloud environments.',
    notes: {
      explanation: `This course provides a comprehensive academic and practical foundation in cloud security, covering the security challenges, architectures, and best practices for protecting infrastructure, applications, and data in AWS, Azure, and GCP environments. Students begin with the cloud computing foundational concepts: the NIST SP 800-145 definitions of cloud service models (IaaS, PaaS, SaaS) and deployment models (public, private, hybrid, community), and the shared responsibility model as applied by each major cloud provider. The course examines identity and access management in depth, including AWS IAM (users, groups, roles, policies, permission boundaries, IAM Identity Center), Azure Active Directory (entra ID) with conditional access, identity protection, and privileged identity management, and GCP Identity and Access Management with organization policies, service accounts, and workload identity federation. Students study encryption in the cloud: encryption at rest using AWS KMS, Azure Key Vault, and GCP Cloud KMS; encryption in transit with TLS 1.3; and customer-managed encryption keys (CMEK) versus provider-managed keys. The course covers logging and monitoring: AWS CloudTrail, Azure Monitor, GCP Cloud Audit Logs, and the integration of these logs with SIEM platforms for security analytics. Students examine compliance in the cloud, mapping cloud services to regulatory requirements including PCI-DSS, HIPAA, GDPR, and SOC 2. The course also covers data protection strategies including DLP, data classification, rights management, and secure data transfer between cloud services. Students learn about cloud security posture management (CSPM) tools including AWS Security Hub, Azure Policy, GCP Security Command Center, and third-party tools like Prisma Cloud and Wiz.`,
      practical: `Week 1: Set up AWS, Azure, and GCP free-tier accounts. Configure IAM users, groups, and roles following least-privilege principles. Enable MFA and configure password policies. Week 2: Implement encryption at rest for S3 buckets, Azure Blob Storage, and GCP Cloud Storage. Configure CMEK with customer-managed keys. Test access controls and verify encryption in storage properties. Week 3: Configure CloudTrail, Azure Monitor, and GCP Audit Logs. Create log ingestion pipelines to a centralized SIEM. Write queries to detect suspicious API activity including unauthorized access attempts and privilege escalation. Week 4: Design a multi-cloud network architecture with VPCs, subnets, security groups, and network firewalls. Implement private endpoints for database access and restrict public exposure. Week 5: Implement DLP policies in AWS Macie and Microsoft Purview. Classify sensitive data including PII, PHI, and financial data. Test policies with sample data and review findings. Week 6: Configure automated compliance scanning using AWS Security Hub and Azure Policy. Remediate findings including open security groups, unencrypted storage, and overprivileged IAM roles. Week 7: Set up a CI/CD pipeline with security scanning. Integrate SAST, DAST, container scanning, and IaC scanning into GitHub Actions. Implement shift-left security practices. Week 8: Build a comprehensive cloud security dashboard showing compliance posture, threat detection metrics, encryption coverage, and access review status. Present a security roadmap to simulated stakeholders.`,
      summary: `Graduates will possess a thorough understanding of cloud security principles and will be able to implement comprehensive security controls across AWS, Azure, and GCP. They will understand the shared responsibility model deeply enough to identify and address security gaps in cloud architectures, and will be able to design IAM policies, encryption strategies, and monitoring solutions that meet enterprise and regulatory requirements. Students will gain hands-on experience with native cloud security services and third-party CSPM tools, and will be able to conduct cloud security assessments and implement remediation strategies. The course prepares students for cloud security certifications including AWS Security Specialty, Azure Security Engineer Associate, and CCSP. Graduates will be well-suited for roles such as Cloud Security Engineer, Cloud Security Architect, or DevSecOps Engineer, and will be equipped to help organizations securely adopt and operate cloud services.`,
    },
    instructor: { name: 'Nnamdi Eke', bio: 'AWS/Azure security consultant', avatar: 'https://i.pravatar.cc/150?u=nnamdi' },
  },
  {
    title: 'Advanced Cloud Security & DevSecOps',
    category: 'Cloud Security',
    level: 'Advanced',
    price: 18500,
    duration: '10 weeks',
    description: 'Implement DevSecOps pipelines, infrastructure-as-code security, container security, and cloud threat detection.',
    notes: {
      explanation: `This advanced course examines cloud-native security, DevSecOps practices, and the security challenges of modern cloud-native application architectures including containers, Kubernetes, and infrastructure-as-code. Students begin with DevSecOps culture and principles: shifting security left in the software development lifecycle, breaking down silos between development, operations, and security teams, and measuring security outcomes alongside velocity and reliability metrics. The course covers infrastructure-as-code (IaC) security in depth, examining Terraform, CloudFormation, and Pulumi templates for common misconfigurations including public S3 buckets, unencrypted databases, overpermissive IAM roles, and missing network segmentation. Students learn to use tfsec, Checkov, and tfsec for static analysis of IaC templates, and to implement policy-as-code using Open Policy Agent (OPA) and Sentinel. Container security covers the full container lifecycle: image scanning with Trivy and Grype, runtime security with Falco, Kubernetes security with Pod Security Standards (PSS), OPA Gatekeeper, and Kyverno. Students study Kubernetes RBAC, network policies, secrets management with HashiCorp Vault, and service mesh security with Istio. The course examines CI/CD pipeline security, including supply chain attacks, dependency confusion, and the use of SLSA (Supply-chain Levels for Software Artifacts) frameworks. Students learn to implement signed commits, reproducible builds, and artifact provenance. Cloud security posture management (CSPM) and cloud workload protection platforms (CWPP) are examined, with students learning to automate compliance enforcement and runtime threat detection. The course also covers serverless security, including function-level permissions, injection vulnerabilities in serverless functions, and event-driven security monitoring.`,
      practical: `Week 1: Set up a DevSecOps pipeline with GitHub Actions. Implement SAST with Semgrep, dependency scanning with Snyk, and container scanning with Trivy. Configure branch protection rules requiring security checks before merge. Week 2: Write Terraform modules for AWS resources including VPCs, EC2 instances, and RDS databases. Run Checkov and tfsec on the modules. Fix identified misconfigurations and implement least-privilege IAM policies. Week 3: Build and push a Docker image to a container registry. Scan the image with Trivy. Implement multi-stage builds to reduce attack surface. Configure Docker Content Trust for image signing. Week 4: Deploy a Kubernetes cluster with Minikube or kind. Configure Pod Security Standards, RBAC, and network policies. Deploy Falco for runtime threat detection and generate alerts for suspicious activity. Week 5: Implement secrets management with HashiCorp Vault. Store and retrieve database credentials and API keys. Configure dynamic secrets for databases and rotate credentials automatically. Week 6: Build a complete CI/CD pipeline with integrated security. Include IaC scanning, SAST, DAST with OWASP ZAP, container scanning, and deployment to a staging environment with automated security testing. Week 7: Implement OPA Gatekeeper policies for Kubernetes. Enforce constraints including allowed registries, required resource limits, and prohibited privileged containers. Test policy enforcement with admission controller responses. Week 8: Design and implement a comprehensive DevSecOps architecture for a simulated organization, including toolchain selection, policy definitions, metrics, and a maturity assessment. Present to simulated engineering and security leadership.`,
      summary: `Graduates will be able to implement DevSecOps practices that integrate security throughout the software development lifecycle, from code commit to production deployment. They will understand IaC security, container security, Kubernetes security, and CI/CD pipeline security well enough to build and operate secure cloud-native platforms. Students will gain hands-on experience with industry-standard tools including Terraform, Checkov, Trivy, Falco, Vault, and OPA, and will be able to design policy-as-code frameworks that enforce security at scale. The course prepares students for advanced roles such as DevSecOps Engineer, Cloud Security Architect, Platform Security Engineer, or Security Engineer at cloud-native organizations. Graduates will be equipped to lead organizational transformations toward DevSecOps, reducing security risk while maintaining or improving development velocity. The skills learned are directly applicable to organizations embracing cloud-native architectures and seeking to embed security into their engineering culture.`,
    },
    instructor: { name: 'Amina Tukur', bio: 'Cloud security architect', avatar: 'https://i.pravatar.cc/150?u=amina' },
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Course.deleteMany({});
    await Quiz.deleteMany({});
    console.log('Cleared existing courses and quizzes');

    const inserted = [];

    for (const def of courseDefs) {
      const quiz = await Quiz.create({ ...buildQuiz(def.title), courseId: null });

      const modules = buildModules(def.notes, def.instructor).map((m) => ({
        ...m,
        // Reference the reusable quiz on the first module for demonstration
        quiz: { quizId: quiz._id },
      }));

      const course = await Course.create({
        title: def.title,
        description: def.description,
        notes: def.notes,
        category: def.category,
        level: def.level,
        price: def.price,
        duration: def.duration,
        thumbnail: def.instructor.avatar,
        modules,
        quizzes: [
          {
            title: `${def.title} (legacy inline quiz)`,
            description: 'Backward-compatible inline quiz.',
            questions: buildQuiz(def.title).questions,
            passingScore: 70,
          },
        ],
        certificate: {
          enabled: true,
          requireQuizAvg: 70,
          requireFinalProject: true,
        },
        instructor: def.instructor,
        instructors: [def.instructor],
        published: true,
        featured: def.price >= 15000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      quiz.courseId = course._id;
      await quiz.save();

      inserted.push(course);
      console.log(`Inserted: ${course.title} | ${course.category} | ₦${course.price} | modules: ${modules.length}`);
    }

    console.log(`\nCourse seeding complete. ${inserted.length} courses seeded.`);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
