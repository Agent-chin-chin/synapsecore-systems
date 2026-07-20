const mongoose = require('mongoose');
const config = require('../lib/config');

async function init() {
  await seedCourses();
}

const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    notes: Object,
    category: String,
    level: String,
    price: Number,
    duration: String,
    thumbnail: String,
    modules: Array,
    quizzes: Array,
    certificate: Object,
    instructor: Object,
    rating: Number,
    enrollmentCount: Number,
    completionRate: Number,
    published: Boolean,
    featured: Boolean,
    createdAt: Date,
    updatedAt: Date,
  },
  { collection: 'courses' }
);

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

const TARGET_COURSE_COUNT = 50;

const courseCatalog = [
  { title: 'Cybersecurity Foundations', category: 'Security', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Learn the essential cybersecurity concepts, threat types, and defensive controls that every security team needs.' },
  { title: 'Network Security Essentials', category: 'Security', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Understand network architecture, secure segmentation, and the basics of firewalls and intrusion detection.' },
  { title: 'Endpoint Security Best Practices', category: 'Security', level: 'Intermediate', price: 16000, duration: '5 weeks', description: 'Secure endpoints using EDR, patch management, and policy-based defense.' },
  { title: 'Cloud Security Fundamentals', category: 'Security', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Protect cloud infrastructure, data, and identity in public cloud environments.' },
  { title: 'Identity and Access Management', category: 'Security', level: 'Intermediate', price: 16000, duration: '5 weeks', description: 'Manage user access, roles, and multi-factor authentication for modern environments.' },
  { title: 'Zero Trust Security Strategy', category: 'Security', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Design and implement zero trust controls across devices, applications, and networks.' },
  { title: 'Threat Intelligence Fundamentals', category: 'Security', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Collect and operationalize threat intelligence to improve detection and response.' },
  { title: 'Incident Response Planning', category: 'Security', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Build incident response playbooks, communication plans, and escalation workflows.' },
  { title: 'Security Operations Center Fundamentals', category: 'Security', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Understand SOC processes, alert triage, and monitoring pipelines.' },
  { title: 'Risk Management and Governance', category: 'Security', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Use risk frameworks and governance controls to prioritize security work.' },
  { title: 'Ethical Hacking Foundations', category: 'Hacking', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Learn ethical hacking methodology, scope definition, and responsible disclosure.' },
  { title: 'Web Application Penetration Testing', category: 'Hacking', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Test web applications for injection, authentication, and business logic flaws.' },
  { title: 'Network Penetration Testing', category: 'Hacking', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Execute reconnaissance, exploitation, and reporting for network security tests.' },
  { title: 'Wireless Security Testing', category: 'Hacking', level: 'Intermediate', price: 16000, duration: '5 weeks', description: 'Assess wireless networks for weak encryption, rogue APs, and protocol attacks.' },
  { title: 'Mobile App Security Testing', category: 'Hacking', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Analyze mobile applications for data storage, authorization, and backend security issues.' },
  { title: 'API Security Testing', category: 'Hacking', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Identify API vulnerabilities and secure RESTful and GraphQL endpoints.' },
  { title: 'Social Engineering Awareness', category: 'Hacking', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Recognize phishing, impersonation, and human manipulation techniques.' },
  { title: 'Vulnerability Assessment Techniques', category: 'Hacking', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Perform vulnerability scanning, validation, and prioritization effectively.' },
  { title: 'Red Team Exercises', category: 'Hacking', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Plan and execute adversary simulation exercises against enterprise targets.' },
  { title: 'Secure Coding for Developers', category: 'Hacking', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Write secure code, validate input, and prevent injection vulnerabilities.' },
  { title: 'TCP/IP and Network Protocols', category: 'Networks', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Master TCP/IP fundamentals, packet analysis, and core networking concepts.' },
  { title: 'Secure Network Architecture', category: 'Networks', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Design segmented, resilient networks for security and availability.' },
  { title: 'Firewall and VPN Deployment', category: 'Networks', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Deploy firewalls, VPNs, and access controls for secure connectivity.' },
  { title: 'Intrusion Detection and Prevention', category: 'Networks', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Implement IDS/IPS systems and tune alerts for meaningful detections.' },
  { title: 'Secure Wireless Networking', category: 'Networks', level: 'Intermediate', price: 16000, duration: '5 weeks', description: 'Secure wireless design and monitoring for enterprise deployments.' },
  { title: 'Network Traffic Analysis', category: 'Networks', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Analyze network traffic for anomalies, threats, and investigations.' },
  { title: 'Cloud Network Security', category: 'Networks', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Protect cloud network architecture and hybrid connectivity from emerging threats.' },
  { title: 'SD-WAN Security Design', category: 'Networks', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Secure SD-WAN deployments with policy-based routing and segmentation.' },
  { title: 'Secure Remote Access Design', category: 'Networks', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Implement secure remote access without exposing internal systems.' },
  { title: 'Network Automation for Security', category: 'Networks', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Automate network security workflows using scripts and orchestration.' },
  { title: 'GDPR and Data Privacy Essentials', category: 'Compliance', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Understand GDPR requirements and protect personal data effectively.' },
  { title: 'ISO 27001 Implementation', category: 'Compliance', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Implement an ISO 27001 information security management system.' },
  { title: 'PCI DSS Compliance Fundamentals', category: 'Compliance', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Secure cardholder data and meet payment industry requirements.' },
  { title: 'NIST Cybersecurity Framework', category: 'Compliance', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Use NIST CSF to identify, protect, detect, respond, and recover.' },
  { title: 'Security Policy Development', category: 'Compliance', level: 'Intermediate', price: 16000, duration: '5 weeks', description: 'Create security policies and standards aligned with business needs.' },
  { title: 'Audit Readiness and Reporting', category: 'Compliance', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Prepare for audits and deliver compliance evidence efficiently.' },
  { title: 'Data Protection Controls', category: 'Compliance', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Apply technical and procedural controls to safeguard sensitive data.' },
  { title: 'Regulatory Risk Management', category: 'Compliance', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Describe regulatory risk and manage it through controls and governance.' },
  { title: 'Cybersecurity Governance', category: 'Compliance', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Build governance structures that support security strategy and compliance.' },
  { title: 'Compliance Automation Strategy', category: 'Compliance', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Automate compliance controls, evidence collection, and reporting.' },
  { title: 'Digital Forensics Investigation', category: 'Forensics', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Learn evidence collection, file system analysis, and investigative process.' },
  { title: 'Memory Forensics Techniques', category: 'Forensics', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Analyze memory artifacts to uncover malware and attacker activity.' },
  { title: 'File System Forensic Analysis', category: 'Forensics', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Investigate file system metadata to reconstruct incident activity.' },
  { title: 'Malware Forensic Investigation', category: 'Forensics', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Blend malware analysis with forensics to determine root cause and impact.' },
  { title: 'Incident Evidence Collection', category: 'Forensics', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Collect and preserve evidence while maintaining chain of custody.' },
  { title: 'Endpoint Forensics Fundamentals', category: 'Forensics', level: 'Beginner', price: 0, duration: '4 weeks', description: 'Capture endpoint artifacts and analyze log data during investigations.' },
  { title: 'Cloud Forensics Workflow', category: 'Forensics', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Investigate cloud incident data using provider tools and best practices.' },
  { title: 'Security Operations Automation', category: 'Administration', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Automate security operations and incident workflows.' },
  { title: 'Privileged Access Management', category: 'Administration', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Secure, audit, and manage privileged accounts across systems.' },
  { title: 'Secure DevOps Practices', category: 'Administration', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Integrate security into CI/CD and development workflows.' },
  { title: 'Identity Lifecycle Management', category: 'Administration', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Manage identity onboarding, access review, and deprovisioning securely.' },
  { title: 'System Hardening and Patch Management', category: 'Administration', level: 'Intermediate', price: 16000, duration: '6 weeks', description: 'Harden systems and deploy patches to reduce attack surface.' },
  { title: 'Infrastructure Defense Fundamentals', category: 'Administration', level: 'Advanced', price: 28000, duration: '8 weeks', description: 'Protect infrastructure with monitoring, segmentation, and resilience.' },
];

const instructorPool = [
  { name: 'Amina Yusuf', avatar: '👩‍🏫', bio: 'Cybersecurity instructor with hands-on red team experience.' },
  { name: 'Samuel Okoro', avatar: '👨‍🏫', bio: 'Network security expert focused on effective defensive controls.' },
  { name: 'Deborah Nwankwo', avatar: '👩‍🏫', bio: 'Compliance and audit specialist helping learners pass security certifications.' },
  { name: 'Chinedu Eze', avatar: '👨‍🏫', bio: 'Digital forensics professional with real incident response experience.' },
  { name: 'Fatima Bello', avatar: '👩‍🏫', bio: 'Ethical hacking instructor who builds practical, usable labs.' },
  { name: 'Emeka Obi', avatar: '👨‍🏫', bio: 'Security operations leader teaching defensive operations and automation.' },
];

function buildLessons(courseIndex, moduleIndex, topic) {
  return Array.from({ length: 3 }, (_, lessonIndex) => ({
    title: `Lesson ${lessonIndex + 1}: Core concept ${lessonIndex + 1}`,
    description: `Step-by-step video training for lesson ${lessonIndex + 1}.`,
    notes: `This lesson covers a practical ${topic.toLowerCase()} concept and prepares you for the next module.`,
    videoUrl: `https://cdn.synapsecore.example/courses/course-${courseIndex}/module-${moduleIndex}/lesson-${lessonIndex + 1}.mp4`,
    duration: 12 + lessonIndex * 4,
    order: lessonIndex + 1,
    completed: false,
  }));
}

function buildModuleNotes(moduleIndex, topic) {
  return `Module ${moduleIndex + 1} includes practical exercises that reinforce ${topic.toLowerCase()} concepts.`;
}

function buildModules(courseIndex, topic) {
  return Array.from({ length: 3 }, (_, moduleIndex) => ({
    title: `Module ${moduleIndex + 1}: Core topic ${moduleIndex + 1}`,
    description: `A focused review of module ${moduleIndex + 1} concepts and lab exercises.`,
    notes: buildModuleNotes(moduleIndex, topic),
    order: moduleIndex + 1,
    lessons: buildLessons(courseIndex, moduleIndex, topic),
  }));
}

function buildCourseNotes(title, level) {
  return {
    explanation: `This ${level.toLowerCase()} course explains ${title.toLowerCase()} through structured modules, real-world examples, and hands-on practice.`,
    practical: `Each module includes practical exercises and use cases to make ${title.toLowerCase()} immediately actionable.`,
    summary: `After completing this course, learners will understand the key principles of ${title.toLowerCase()} and how to apply them in live environments.`,
  };
}

function createCourse(courseIndex, courseData) {
  const instructor = instructorPool[courseIndex % instructorPool.length];

  return {
    title: courseData.title,
    description: courseData.description,
    notes: buildCourseNotes(courseData.title, courseData.level),
    category: courseData.category,
    level: courseData.level,
    price: courseData.price,
    duration: courseData.duration,
    thumbnail: `/images/courses/${courseData.category.toLowerCase()}-${(courseIndex % 10) + 1}.jpg`,
    modules: buildModules(courseIndex, courseData.title),
    quizzes: [
      {
        title: `${courseData.title} Assessment`,
        description: `A short knowledge check for ${courseData.title.toLowerCase()}.`,
        questions: [
          {
            question: `What is a core principle of ${courseData.title.toLowerCase()}?`,
            options: ['Principle A', 'Principle B', 'Principle C', 'Principle D'],
            correctAnswer: 1,
            explanation: 'Principle B is the correct security concept for this case.',
          },
        ],
        passingScore: 70,
      },
    ],
    certificate: {
      enabled: true,
      template: `${courseData.title.toLowerCase().replace(/\s+/g, '-')}-certificate`,
    },
    instructor,
    rating: 4.5,
    enrollmentCount: 0,
    completionRate: 0,
    published: true,
    featured: courseIndex <= 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function seedCourses() {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      dbName: 'synapsecoresystem',
      bufferCommands: false,
    });

    const existingCount = await Course.countDocuments({ published: true });
    console.log(`Existing published courses: ${existingCount}`);

    if (existingCount === TARGET_COURSE_COUNT) {
      console.log(`There are already ${TARGET_COURSE_COUNT} published courses. No new courses were created.`);
      process.exit(0);
    }

    if (existingCount > 0) {
      await Course.deleteMany({ published: true });
      console.log(`Removed ${existingCount} published courses to rebuild a curated set of ${TARGET_COURSE_COUNT}.`);
    }

    const coursesToCreate = courseCatalog.map((courseData, index) => createCourse(index + 1, courseData));
    await Course.insertMany(coursesToCreate);

    console.log(`Seeded ${coursesToCreate.length} learner courses successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed learner courses:', error);
    process.exit(1);
  }
}

init();
