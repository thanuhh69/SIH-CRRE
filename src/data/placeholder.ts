import { Alumni, ProblemStatement, EventDate, VideoItem, Announcement } from '@/types';

export const HERO_DATA = {
  collegeName: 'SIR C.R. REDDY COLLEGE OF ENGINEERING',
  collegeStatus: '(AUTONOMOUS)',
  accreditation: 'Approved by AICTE | Affiliated to JNTUK | Accredited by NBA & NAAC',
  location: 'Eluru, Andhra Pradesh',
  title: 'SMART INDIA HACKATHON 2026',
  subtitle: 'SIH Internal Hackathon',
  tagline: 'Innovation begins with identifying real-world problems and building meaningful solutions.',
};

export const ANNOUNCEMENTS_DATA: Announcement[] = [
  {
    id: 'ann-1',
    title: '📢 SIH Internal Hackathon 2026 will be held on 15th & 16th September 2026. Team registrations are now open!',
    date: '2026-08-10',
    link: '/register',
    tag: 'Notice',
    isUrgent: true,
    active: true,
  },
  {
    id: 'ann-2',
    title: '💡 View Official SIH 2026 Problem Statements directly on the national Smart India Hackathon portal.',
    date: '2026-08-08',
    link: 'https://sih.gov.in/sih2026PS',
    tag: 'Important',
    isUrgent: false,
    active: true,
  },
  {
    id: 'ann-3',
    title: '🏆 Total Prize Pool of ₹44,000 announced for Software and Hardware internal hackathon winners!',
    date: '2026-08-05',
    link: '/register',
    tag: 'Important',
    isUrgent: false,
    active: true,
  },
];

export const JOURNEY_STATS = [
  { label: 'Teams Participated', value: 'XX+' },
  { label: 'Students Involved', value: 'XX+' },
  { label: 'Innovative Solutions', value: 'XX+' },
  { label: 'SIH Alumni', value: 'XX+' },
];

export const ALUMNI_DATA: Alumni[] = [
  {
    id: 'alm-1',
    name: 'K. Sai Teja',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    department: 'Computer Science & Engineering',
    graduationYear: '2024',
    sihYear: '2023',
    teamName: 'InnovateX CRR',
    problemStatement: 'AI-Based Crop Disease Detection System',
    achievement: 'National Winner - Grand Finale 2023',
    description: 'Developed an edge AI algorithm for real-time leaf pathology detection for the Ministry of Agriculture.',
    currentRole: 'Software Development Engineer',
    company: 'TCS Innovation Labs',
  },
  {
    id: 'alm-2',
    name: 'P. Haritha Varma',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    department: 'Electronics & Communication Engg',
    graduationYear: '2024',
    sihYear: '2023',
    teamName: 'CircuitBreakers',
    problemStatement: 'Smart Grid Fault Localization Hardware',
    achievement: '1st Runner Up - SIH 2023',
    description: 'Built a low-power IoT telemetry node for remote high-voltage power grid fault pinpointing.',
    currentRole: 'Embedded Systems Specialist',
    company: 'Bosch India',
  },
  {
    id: 'alm-3',
    name: 'M. Rahul Chowdary',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    department: 'Information Technology',
    graduationYear: '2025',
    sihYear: '2024',
    teamName: 'CyberGuardians',
    problemStatement: 'Blockchain-Based Credential Verification',
    achievement: 'Internal Hackathon 1st Rank',
    description: 'Pioneered an institutional decentralized diploma verification portal with instant zero-knowledge validation.',
    currentRole: 'Student Lead',
    company: 'Sir C.R. Reddy CoE Coding Club',
  },
  {
    id: 'alm-4',
    name: 'V. Sneha Latha',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    department: 'Artificial Intelligence & Data Science',
    graduationYear: '2025',
    sihYear: '2024',
    teamName: 'DataVision',
    problemStatement: 'Automated Traffic Flow Optimizer',
    achievement: 'SIH 2024 Finalist',
    description: 'Implemented computer vision analytics for adaptive smart signal timing at major city junctions.',
    currentRole: 'AI Research Intern',
    company: 'IIIT Hyderabad',
  },
];

export const VIDEO_DATA: VideoItem = {
  id: 'vid-main',
  title: 'SIH Journey & Internal Hackathon Highlights',
  description: 'Glimpses of innovation, mentorship, pitching sessions, and project evaluation at Sir C.R. Reddy College of Engineering.',
  videoUrl: 'https://www.youtube.com/watch?v=J---aiyznGQ',
  thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
  source: 'youtube',
  isMain: true,
  duration: '03:45',
  uploadedAt: '2026-08-01',
};

export const OFFICIAL_SIH_PORTAL_URL = 'https://sih.gov.in/sih2026PS';

export const PRIZE_DATA = {
  totalPool: '₹44,000',
  software: [
    { rank: '1st Place', amount: '₹10,000', medal: '🥇' },
    { rank: '2nd Place', amount: '₹7,000', medal: '🥈' },
    { rank: '3rd Place', amount: '₹5,000', medal: '🥉' },
  ],
  hardware: [
    { rank: '1st Place', amount: '₹10,000', medal: '🥇' },
    { rank: '2nd Place', amount: '₹7,000', medal: '🥈' },
    { rank: '3rd Place', amount: '₹5,000', medal: '🥉' },
  ],
};

export const IMPORTANT_DATES_DATA: EventDate[] = [
  {
    id: 'evt-1',
    title: 'Registration Opens',
    date: '1st September 2026',
    location: 'Online Portal',
    isTBD: false,
    status: 'Active',
    category: 'Registration',
  },
  {
    id: 'evt-2',
    title: 'Registration & Abstract Deadline',
    date: '12th September 2026',
    location: 'Online Portal',
    isTBD: false,
    status: 'Upcoming',
    category: 'Registration',
  },
  {
    id: 'evt-3',
    title: 'SIH Internal Hackathon 2026',
    date: '15th & 16th September 2026',
    location: 'College Campus (Auditorium & Labs)',
    isTBD: false,
    status: 'Upcoming',
    category: 'Internal Hackathon',
  },
  {
    id: 'evt-4',
    title: 'Results Announcement & SIH Nomination',
    date: '18th September 2026',
    location: 'College Notice Board & Website',
    isTBD: false,
    status: 'Upcoming',
    category: 'Results',
  },
];

export const PROBLEM_STATEMENTS_DATA: ProblemStatement[] = [
  {
    id: 'ps-1',
    psId: 'SIH1284',
    title: 'AI-Driven Smart Water Quality Monitoring & Early Contamination Warning',
    organization: 'Ministry of Jal Shakti',
    category: 'Hardware',
    domain: 'Environment & Renewable Energy',
    description: 'Design a low-cost IoT sensor array with automated edge anomaly detection to continuously monitor turbidity, pH, dissolved oxygen, and heavy metal concentrations in rural water bodies.',
    keyRequirements: [
      'Solar powered IoT node with battery backup',
      'LoRaWAN / GSM telemetry module',
      'Real-time alert dashboard for district water officers',
      'ML model for predicting seasonal contamination trends'
    ]
  },
  {
    id: 'ps-2',
    psId: 'SIH1290',
    title: 'Blockchain-Based Fraud-Proof Academic Marksheet & Degree Verification',
    organization: 'Ministry of Education',
    category: 'Software',
    domain: 'Smart Education & Governance',
    description: 'Build a decentralized platform enabling autonomous universities to issue tamper-proof digital credentials verified instantly by employers using public key cryptography.',
    keyRequirements: [
      'Ethereum / Polygon EVM smart contract backend',
      'Zero-knowledge proof privacy layer for student PII',
      'Web QR scanner for instant off-line validation',
      'Seamless API adapter for existing university SIS'
    ]
  },
  {
    id: 'ps-3',
    psId: 'SIH1305',
    title: 'Intelligent Traffic Signal Management System Using Computer Vision',
    organization: 'Ministry of Road Transport and Highways',
    category: 'Software',
    domain: 'Smart Transportation & Infrastructure',
    description: 'Develop a camera-based dynamic signal timer algorithm that measures real-time traffic density at intersections and prioritizes emergency vehicles automatically.',
    keyRequirements: [
      'YOLOv8 / OpenCV pipeline for vehicle detection & classification',
      'Emergency ambulance siren audio signal fusion',
      'Sub-50ms latency edge deployment on Jetson Nano / Raspberry Pi',
      'Centralized municipality analytics map'
    ]
  },
  {
    id: 'ps-4',
    psId: 'SIH1312',
    title: 'Autonomous Pest & Disease Identification App for Regional Agriculture',
    organization: 'Department of Agriculture & Farmers Welfare',
    category: 'Software',
    domain: 'Agriculture & Rural Development',
    description: 'An offline-capable mobile application assisting farmers in identifying crop diseases from leaf photographs with voice-guided treatment recommendations in Telugu and English.',
    keyRequirements: [
      'Quantized MobileNetV3 / TensorFlow Lite engine',
      'Offline regional language text-to-speech audio assistant',
      'Bio-pesticide dosage calculator and nearby dealer locator',
      'Low bandwidth image compression protocol'
    ]
  },
  {
    id: 'ps-5',
    psId: 'SIH1320',
    title: 'Smart Energy Consumption Auditing & Defect Identification in Microgrids',
    organization: 'Ministry of Power',
    category: 'Hardware',
    domain: 'Robotics & Industrial Automation',
    description: 'A modular power distribution box monitoring power factor, voltage spikes, and harmonic distortion to prevent transformer overheating in college campus networks.',
    keyRequirements: [
      'Multi-channel current transformer interface',
      'MQTT publisher with MQTT-SN backup over Zigbee',
      'Predictive thermal breakdown alerts',
      'Compliance report auto-generation module'
    ]
  },
  {
    id: 'ps-6',
    psId: 'SIH1344',
    title: 'Cyber Threat Intelligence & Phishing Prevention Gateway for Universities',
    organization: 'Indian Cyber Crime Coordination Centre (I4C)',
    category: 'Software',
    domain: 'Cyber Security & Defence',
    description: 'Create an automated institutional email & URL scanner that detects sophisticated spear-phishing attacks targeting faculty and students using transformer NLP models.',
    keyRequirements: [
      'Browser extension and DNS proxy integration',
      'Fine-tuned RoBERTa phishing classification pipeline',
      'Real-time honeypot alert dashboard',
      'Automated IOC (Indicator of Compromise) sharing network'
    ]
  }
];
