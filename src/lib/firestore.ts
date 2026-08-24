import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  TeamRegistration, 
  Alumni, 
  ProblemStatement, 
  EventDate, 
  VideoItem, 
  Announcement,
  ResultItem,
  ResultsConfig,
  SamplePPTResource,
  ParticipationMetrics,
  SlideshowImage
} from '@/types';
import { 
  ALUMNI_DATA, 
  PROBLEM_STATEMENTS_DATA, 
  IMPORTANT_DATES_DATA, 
  VIDEO_DATA, 
  ANNOUNCEMENTS_DATA 
} from '@/data/placeholder';

// Production Firebase is always enabled with central sih-crre backend
const isFirebaseConfigured = () => true;

// Initial Registrations dataset for seeding
const INITIAL_REGISTRATIONS: TeamRegistration[] = [
  {
    id: 'SIH-2026-1001',
    teamName: 'InnovateX CRR',
    leaderName: 'K. Sai Teja',
    leaderEmail: 'saiteja@sircrrcoestd.in',
    leaderPhone: '+91 98765 43210',
    department: 'Computer Science & Engineering',
    year: '4th Year',
    problemStatementId: 'SIH1284',
    problemStatementTitle: 'AI-Driven Smart Water Quality Monitoring',
    facultyMentor: 'Dr. V. S. N. Murthy (HOD CSE)',
    members: [
      { name: 'K. Sai Teja', email: 'saiteja@sircrrcoestd.in', phone: '+91 9876543210', rollNumber: '21B91A0501', department: 'CSE', year: '4th Year', isLeader: true },
      { name: 'P. Anusha', email: 'anusha@sircrrcoestd.in', phone: '+91 9876543211', rollNumber: '21B91A0502', department: 'CSE', year: '4th Year' },
    ],
    status: 'approved',
    submittedAt: '2026-08-10T10:30:00.000Z'
  }
];

// Initial Results dataset for seeding
const INITIAL_RESULTS: ResultItem[] = [
  {
    id: 'SIH-2026-1001',
    teamId: 'SIH-2026-1001',
    teamName: 'InnovateX CRR',
    problemStatement: 'AI-Driven Smart Water Quality Monitoring',
    problemStatementId: 'SIH1284',
    branch: 'Computer Science & Engineering',
    score: 95.5,
    rank: 1,
    status: 'Winner',
    remarks: 'Outstanding IoT hardware prototype and real-time dashboard implementation.',
    members: [
      { name: 'K. Sai Teja', email: 'saiteja@sircrrcoestd.in', phone: '+91 9876543210', rollNumber: '21B91A0501', department: 'CSE', year: '4th Year', isLeader: true },
      { name: 'P. Anusha', email: 'anusha@sircrrcoestd.in', phone: '+91 9876543211', rollNumber: '21B91A0502', department: 'CSE', year: '4th Year' }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'SIH-2026-1002',
    teamId: 'SIH-2026-1002',
    teamName: 'CyberShields CRR',
    problemStatement: 'Automated Vulnerability Detection in Government Web Portals',
    problemStatementId: 'SIH1290',
    branch: 'Information Technology',
    score: 92.0,
    rank: 2,
    status: 'Runner-up',
    remarks: 'Excellent security audit framework and automated zero-day exploit scanner.',
    members: [
      { name: 'M. Rahul', email: 'rahul@sircrrcoestd.in', phone: '+91 9876543212', rollNumber: '21B91A1205', department: 'IT', year: '4th Year', isLeader: true }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: 'SIH-2026-1003',
    teamId: 'SIH-2026-1003',
    teamName: 'AgriTech Innovators',
    problemStatement: 'Smart Crop Disease Identification using Drone Imaging',
    problemStatementId: 'SIH1305',
    branch: 'Electronics & Communication Engineering',
    score: 89.5,
    rank: 3,
    status: 'Finalist',
    remarks: 'High accuracy AI model running on edge microcontrollers for offline farming.',
    members: [
      { name: 'V. Divya', email: 'divya@sircrrcoestd.in', phone: '+91 9876543213', rollNumber: '22B91A0410', department: 'ECE', year: '3rd Year', isLeader: true }
    ],
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_RESULTS_CONFIG: ResultsConfig = {
  published: false,
  publishedAt: undefined,
  publishedBy: undefined
};

const INITIAL_SAMPLE_PPT: SamplePPTResource = {
  fileName: 'SIH_Internal_Hackathon_PPT_Template.pptx',
  downloadURL: '/templates/SIH_Internal_Hackathon_PPT_Template.pptx',
  storagePath: 'resources/sample-ppt/SIH_Internal_Hackathon_PPT_Template.pptx',
  fileSize: 2457600,
  uploadedAt: new Date().toISOString(),
  uploadedBy: 'Admin Committee',
  version: '1.0',
  published: true
};

const INITIAL_METRICS: ParticipationMetrics = {
  teamsParticipated: '50+',
  studentsInvolved: '300+',
  innovativeSolutions: '45+',
  sihAlumni: '120+'
};

// ==========================================
// 1. REGISTRATIONS COLLECTION API
// ==========================================
export const getRegistrations = async (): Promise<TeamRegistration[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'registrations'));
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TeamRegistration));
    }
    // Seed initial registration if Firestore collection is empty
    for (const reg of INITIAL_REGISTRATIONS) {
      await setDoc(doc(db, 'registrations', reg.id), reg);
    }
    return INITIAL_REGISTRATIONS;
  } catch (err) {
    console.error('Error fetching registrations from Firestore:', err);
    return INITIAL_REGISTRATIONS;
  }
};

export const subscribeRegistrations = (callback: (registrations: TeamRegistration[]) => void) => {
  try {
    return onSnapshot(collection(db, 'registrations'), (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TeamRegistration));
        callback(list);
      } else {
        callback(INITIAL_REGISTRATIONS);
      }
    }, (err) => {
      console.error('Error in subscribeRegistrations snapshot:', err);
    });
  } catch (err) {
    console.error('Error establishing subscribeRegistrations listener:', err);
    return () => {};
  }
};

export const createRegistration = async (registrationData: Omit<TeamRegistration, 'id' | 'submittedAt' | 'status'>): Promise<TeamRegistration> => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const regId = `SIH-2026-${randomNum}`;
  const newRegistration: TeamRegistration = {
    ...registrationData,
    id: regId,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'registrations', regId), newRegistration);
    console.log('Registration written to Firestore collection "registrations":', regId);
  } catch (err) {
    console.error('Error writing registration to Firestore:', err);
  }

  return newRegistration;
};

export const updateRegistrationStatus = async (id: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> => {
  try {
    await updateDoc(doc(db, 'registrations', id), { status });
  } catch (err) {
    console.error('Firestore update error:', err);
  }
};

export const updateRegistrationAttendance = async (id: string, attendance: 'present' | 'absent'): Promise<void> => {
  try {
    await updateDoc(doc(db, 'registrations', id), { attendance });
  } catch (err) {
    console.error('Firestore attendance update error:', err);
  }
};

export const updateRegistrationPPT = async (id: string, pptUrl: string, pptFileName: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'registrations', id), { pptUrl, pptFileName });
  } catch (err) {
    console.error('Firestore PPT update error:', err);
  }
};

export const deleteRegistration = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'registrations', id));
  } catch (err) {
    console.error('Firestore delete error:', err);
  }
};

// ==========================================
// 2. ALUMNI COLLECTION API
// ==========================================
let alumniInitialized = false;

export const getAlumni = async (): Promise<Alumni[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'alumni'));
    if (!snapshot.empty) {
      alumniInitialized = true;
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Alumni));
    }
    if (!alumniInitialized) {
      alumniInitialized = true;
      for (const item of ALUMNI_DATA) {
        await setDoc(doc(db, 'alumni', item.id), item);
      }
      return ALUMNI_DATA;
    }
    return [];
  } catch (err) {
    console.error('Firestore alumni query failed:', err);
    return ALUMNI_DATA;
  }
};

export const subscribeAlumni = (callback: (alumni: Alumni[]) => void) => {
  try {
    return onSnapshot(collection(db, 'alumni'), async (snapshot) => {
      if (!snapshot.empty) {
        alumniInitialized = true;
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Alumni));
        callback(list);
      } else if (!alumniInitialized) {
        alumniInitialized = true;
        for (const item of ALUMNI_DATA) {
          await setDoc(doc(db, 'alumni', item.id), item);
        }
        callback(ALUMNI_DATA);
      } else {
        callback([]);
      }
    }, (err) => {
      console.error('Error in subscribeAlumni snapshot:', err);
    });
  } catch (err) {
    console.error('Error establishing subscribeAlumni listener:', err);
    return () => {};
  }
};

export const saveAlumni = async (alumni: Alumni): Promise<void> => {
  try {
    alumniInitialized = true;
    await setDoc(doc(db, 'alumni', alumni.id), alumni);
  } catch (err) {
    console.error('Firestore saveAlumni error:', err);
  }
};

export const deleteAlumni = async (id: string): Promise<void> => {
  try {
    alumniInitialized = true;
    await deleteDoc(doc(db, 'alumni', id));
  } catch (err) {
    console.error('Firestore deleteAlumni error:', err);
  }
};

// ==========================================
// 3. PROBLEM STATEMENTS COLLECTION API
// ==========================================
let psInitialized = false;

export const getProblemStatements = async (): Promise<ProblemStatement[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'problemStatements'));
    if (!snapshot.empty) {
      psInitialized = true;
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProblemStatement));
    }
    if (!psInitialized) {
      psInitialized = true;
      for (const ps of PROBLEM_STATEMENTS_DATA) {
        await setDoc(doc(db, 'problemStatements', ps.id), ps);
      }
      return PROBLEM_STATEMENTS_DATA;
    }
    return [];
  } catch (err) {
    console.error('Firestore problemStatements query failed:', err);
    return PROBLEM_STATEMENTS_DATA;
  }
};

export const subscribeProblemStatements = (callback: (psList: ProblemStatement[]) => void) => {
  try {
    return onSnapshot(collection(db, 'problemStatements'), async (snapshot) => {
      if (!snapshot.empty) {
        psInitialized = true;
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProblemStatement));
        callback(list);
      } else if (!psInitialized) {
        psInitialized = true;
        for (const ps of PROBLEM_STATEMENTS_DATA) {
          await setDoc(doc(db, 'problemStatements', ps.id), ps);
        }
        callback(PROBLEM_STATEMENTS_DATA);
      } else {
        callback([]);
      }
    }, (err) => {
      console.error('Error in subscribeProblemStatements snapshot:', err);
    });
  } catch (err) {
    console.error('Error establishing subscribeProblemStatements listener:', err);
    return () => {};
  }
};

export const saveProblemStatement = async (ps: ProblemStatement): Promise<void> => {
  try {
    psInitialized = true;
    await setDoc(doc(db, 'problemStatements', ps.id), ps);
  } catch (err) {
    console.error('Firestore saveProblemStatement error:', err);
  }
};

export const deleteProblemStatement = async (id: string): Promise<void> => {
  try {
    psInitialized = true;
    await deleteDoc(doc(db, 'problemStatements', id));
  } catch (err) {
    console.error('Firestore deleteProblemStatement error:', err);
  }
};

// ==========================================
// 4. EVENT DATES COLLECTION API (FIRESTORE CENTRALIZED)
// ==========================================
let datesInitialized = false;

export const getEventDates = async (): Promise<EventDate[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'eventDates'));
    if (!snapshot.empty) {
      datesInitialized = true;
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as EventDate));
    }
    if (!datesInitialized) {
      datesInitialized = true;
      for (const evt of IMPORTANT_DATES_DATA) {
        await setDoc(doc(db, 'eventDates', evt.id), evt);
      }
      return IMPORTANT_DATES_DATA;
    }
    return [];
  } catch (err) {
    console.error('Firestore eventDates query error:', err);
    return IMPORTANT_DATES_DATA;
  }
};

export const subscribeEventDates = (callback: (events: EventDate[]) => void) => {
  try {
    return onSnapshot(collection(db, 'eventDates'), async (snapshot) => {
      if (!snapshot.empty) {
        datesInitialized = true;
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as EventDate));
        callback(list);
      } else if (!datesInitialized) {
        datesInitialized = true;
        for (const evt of IMPORTANT_DATES_DATA) {
          await setDoc(doc(db, 'eventDates', evt.id), evt);
        }
        callback(IMPORTANT_DATES_DATA);
      } else {
        callback([]);
      }
    }, (err) => {
      console.error('Error in subscribeEventDates snapshot:', err);
    });
  } catch (err) {
    console.error('Error establishing subscribeEventDates listener:', err);
    return () => {};
  }
};

export const saveEventDate = async (event: EventDate): Promise<void> => {
  try {
    datesInitialized = true;
    await setDoc(doc(db, 'eventDates', event.id), event);
  } catch (err) {
    console.error('Firestore saveEventDate error:', err);
  }
};

export const deleteEventDate = async (id: string): Promise<void> => {
  try {
    datesInitialized = true;
    await deleteDoc(doc(db, 'eventDates', id));
  } catch (err) {
    console.error('Firestore deleteEventDate error:', err);
  }
};

// ==========================================
// 5. ANNOUNCEMENTS COLLECTION API (FIRESTORE CENTRALIZED)
// ==========================================
let announcementsInitialized = false;

export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'announcements'));
    if (!snapshot.empty) {
      announcementsInitialized = true;
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Announcement));
    }
    if (!announcementsInitialized) {
      announcementsInitialized = true;
      for (const ann of ANNOUNCEMENTS_DATA) {
        await setDoc(doc(db, 'announcements', ann.id), ann);
      }
      return ANNOUNCEMENTS_DATA;
    }
    return [];
  } catch (err) {
    console.error('Firestore announcements query error:', err);
    return ANNOUNCEMENTS_DATA;
  }
};

export const subscribeAnnouncements = (callback: (announcements: Announcement[]) => void) => {
  try {
    return onSnapshot(collection(db, 'announcements'), async (snapshot) => {
      if (!snapshot.empty) {
        announcementsInitialized = true;
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Announcement));
        callback(list);
      } else if (!announcementsInitialized) {
        announcementsInitialized = true;
        for (const ann of ANNOUNCEMENTS_DATA) {
          await setDoc(doc(db, 'announcements', ann.id), ann);
        }
        callback(ANNOUNCEMENTS_DATA);
      } else {
        callback([]);
      }
    }, (err) => {
      console.error('Error in subscribeAnnouncements snapshot:', err);
    });
  } catch (err) {
    console.error('Error establishing subscribeAnnouncements listener:', err);
    return () => {};
  }
};

export const saveAnnouncement = async (announcement: Announcement): Promise<void> => {
  try {
    announcementsInitialized = true;
    await setDoc(doc(db, 'announcements', announcement.id), announcement);
  } catch (err) {
    console.error('Firestore saveAnnouncement error:', err);
  }
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    announcementsInitialized = true;
    await deleteDoc(doc(db, 'announcements', id));
  } catch (err) {
    console.error('Firestore deleteAnnouncement error:', err);
  }
};

// ==========================================
// 6. MAIN VIDEO API (FIRESTORE CENTRALIZED)
// ==========================================
export const getMainVideo = async (): Promise<VideoItem> => {
  try {
    const docSnap = await getDoc(doc(db, 'videoMain', 'main'));
    if (docSnap.exists()) {
      const data = docSnap.data() as VideoItem;
      if (data.videoUrl && data.videoUrl.includes('dQw4w9WgXcQ')) {
        const sanitized = { ...data, videoUrl: VIDEO_DATA.videoUrl };
        await setDoc(doc(db, 'videoMain', 'main'), sanitized);
        return sanitized;
      }
      return data;
    }
    await setDoc(doc(db, 'videoMain', 'main'), VIDEO_DATA);
    return VIDEO_DATA;
  } catch (err) {
    console.error('Firestore getMainVideo error:', err);
    return VIDEO_DATA;
  }
};

export const subscribeMainVideo = (callback: (video: VideoItem) => void) => {
  try {
    return onSnapshot(doc(db, 'videoMain', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as VideoItem;
        if (data.videoUrl && data.videoUrl.includes('dQw4w9WgXcQ')) {
          const sanitized = { ...data, videoUrl: VIDEO_DATA.videoUrl };
          callback(sanitized);
        } else {
          callback(data);
        }
      } else {
        callback(VIDEO_DATA);
      }
    }, (err) => {
      console.error('Error in subscribeMainVideo snapshot:', err);
    });
  } catch (err) {
    console.error('Error establishing subscribeMainVideo listener:', err);
    return () => {};
  }
};

export const saveMainVideo = async (video: VideoItem): Promise<void> => {
  try {
    await setDoc(doc(db, 'videoMain', 'main'), video);
  } catch (err) {
    console.error('Firestore saveMainVideo error:', err);
  }
};

// ==========================================
// 7. RESULTS & RESULTS CONFIG API
// ==========================================
let resultsInitialized = false;

export const getResults = async (): Promise<ResultItem[]> => {
  try {
    const q = query(collection(db, 'results'), orderBy('rank', 'asc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      resultsInitialized = true;
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ResultItem));
    }
    if (!resultsInitialized) {
      resultsInitialized = true;
      for (const res of INITIAL_RESULTS) {
        await setDoc(doc(db, 'results', res.id), res);
      }
      return INITIAL_RESULTS;
    }
    return [];
  } catch (err) {
    console.error('Firestore getResults error:', err);
    return INITIAL_RESULTS;
  }
};

export const saveResult = async (result: ResultItem): Promise<void> => {
  const updatedResult = { ...result, updatedAt: new Date().toISOString() };
  try {
    resultsInitialized = true;
    await setDoc(doc(db, 'results', result.id), updatedResult);
  } catch (err) {
    console.error('Firestore saveResult error:', err);
  }
};

export const deleteResult = async (id: string): Promise<void> => {
  try {
    resultsInitialized = true;
    await deleteDoc(doc(db, 'results', id));
  } catch (err) {
    console.error('Firestore deleteResult error:', err);
  }
};

export const getResultsConfig = async (): Promise<ResultsConfig> => {
  try {
    const docSnap = await getDoc(doc(db, 'resultsConfig', 'main'));
    if (docSnap.exists()) {
      return docSnap.data() as ResultsConfig;
    }
    await setDoc(doc(db, 'resultsConfig', 'main'), INITIAL_RESULTS_CONFIG);
    return INITIAL_RESULTS_CONFIG;
  } catch (err) {
    console.error('Firestore getResultsConfig error:', err);
    return INITIAL_RESULTS_CONFIG;
  }
};

export const updateResultsConfig = async (config: ResultsConfig): Promise<void> => {
  try {
    await setDoc(doc(db, 'resultsConfig', 'main'), config);
  } catch (err) {
    console.error('Firestore updateResultsConfig error:', err);
  }
};

export const subscribeResultsConfig = (callback: (config: ResultsConfig) => void) => {
  try {
    return onSnapshot(doc(db, 'resultsConfig', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as ResultsConfig);
      } else {
        callback(INITIAL_RESULTS_CONFIG);
      }
    }, (err) => {
      console.error('Error in subscribeResultsConfig snapshot:', err);
    });
  } catch (err) {
    console.error('Error establishing subscribeResultsConfig listener:', err);
    return () => {};
  }
};

export const subscribeResults = (callback: (results: ResultItem[]) => void) => {
  try {
    const q = query(collection(db, 'results'), orderBy('rank', 'asc'));
    return onSnapshot(q, async (snapshot) => {
      if (!snapshot.empty) {
        resultsInitialized = true;
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ResultItem));
        callback(list);
      } else if (!resultsInitialized) {
        resultsInitialized = true;
        for (const res of INITIAL_RESULTS) {
          await setDoc(doc(db, 'results', res.id), res);
        }
        callback(INITIAL_RESULTS);
      } else {
        callback([]);
      }
    }, (err) => {
      console.error('Error in subscribeResults snapshot:', err);
    });
  } catch (err) {
    console.error('Error establishing subscribeResults listener:', err);
    return () => {};
  }
};

// ==========================================
// 8. SAMPLE PPT RESOURCE MANAGEMENT API
// ==========================================
export const getSamplePPT = async (): Promise<SamplePPTResource | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'resources', 'samplePPT'));
    if (docSnap.exists()) {
      return docSnap.data() as SamplePPTResource;
    }
    await setDoc(doc(db, 'resources', 'samplePPT'), INITIAL_SAMPLE_PPT);
    return INITIAL_SAMPLE_PPT;
  } catch (err) {
    console.error('Firestore getSamplePPT error:', err);
    return INITIAL_SAMPLE_PPT;
  }
};

export const saveSamplePPT = async (pptData: SamplePPTResource): Promise<void> => {
  try {
    await setDoc(doc(db, 'resources', 'samplePPT'), pptData);
  } catch (err) {
    console.error('Firestore saveSamplePPT error:', err);
  }
};

export const deleteSamplePPT = async (): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'resources', 'samplePPT'));
  } catch (err) {
    console.error('Firestore deleteSamplePPT error:', err);
  }
};

export const subscribeSamplePPT = (callback: (ppt: SamplePPTResource | null) => void) => {
  try {
    return onSnapshot(doc(db, 'resources', 'samplePPT'), (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as SamplePPTResource);
      } else {
        callback(INITIAL_SAMPLE_PPT);
      }
    }, (err) => {
      console.error('Error in subscribeSamplePPT snapshot:', err);
    });
  } catch (err) {
    console.error('Error establishing subscribeSamplePPT listener:', err);
    return () => {};
  }
};

// ==========================================
// 9. PARTICIPATION METRICS API
// ==========================================
export const getParticipationMetrics = async (): Promise<ParticipationMetrics> => {
  try {
    const docSnap = await getDoc(doc(db, 'metrics', 'main'));
    if (docSnap.exists()) {
      return docSnap.data() as ParticipationMetrics;
    }
    await setDoc(doc(db, 'metrics', 'main'), INITIAL_METRICS);
    return INITIAL_METRICS;
  } catch (err) {
    console.error('Firestore getParticipationMetrics error:', err);
    return INITIAL_METRICS;
  }
};

export const saveParticipationMetrics = async (metrics: ParticipationMetrics): Promise<void> => {
  try {
    await setDoc(doc(db, 'metrics', 'main'), metrics);
  } catch (err) {
    console.error('Firestore saveParticipationMetrics error:', err);
  }
};

export const subscribeParticipationMetrics = (callback: (metrics: ParticipationMetrics) => void) => {
  try {
    return onSnapshot(doc(db, 'metrics', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as ParticipationMetrics);
      } else {
        callback(INITIAL_METRICS);
      }
    }, (err) => {
      console.error('Error in subscribeParticipationMetrics snapshot:', err);
    });
  } catch (err) {
    console.error('Error establishing subscribeParticipationMetrics listener:', err);
    return () => {};
  }
};

// ==========================================
// 10. HOMEPAGE SLIDESHOW IMAGES API
// ==========================================
const INITIAL_SLIDESHOW_IMAGES: SlideshowImage[] = [
  {
    id: 'slide-1',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
    title: 'Sir C.R. Reddy CoE Campus & Innovation Hub',
    caption: 'State-of-the-art research laboratories, computer centers, and student hackathon spaces.',
    createdAt: new Date().toISOString(),
    order: 1
  },
  {
    id: 'slide-2',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
    title: 'Smart India Hackathon Evaluation & Pitching',
    caption: 'Student teams presenting prototype solutions to domain experts and ministry evaluators.',
    createdAt: new Date().toISOString(),
    order: 2
  },
  {
    id: 'slide-3',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    title: 'Collaborative Teamwork & Hardware Prototyping',
    caption: 'Interdisciplinary teams assembling IoT circuits and AI algorithms.',
    createdAt: new Date().toISOString(),
    order: 3
  }
];

let slideshowInitialized = false;

export const getSlideshowImages = async (): Promise<SlideshowImage[]> => {
  try {
    const snapshot = await getDocs(collection(db, 'slideshowImages'));
    if (!snapshot.empty) {
      slideshowInitialized = true;
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SlideshowImage));
    }
    if (!slideshowInitialized) {
      slideshowInitialized = true;
      for (const slide of INITIAL_SLIDESHOW_IMAGES) {
        await setDoc(doc(db, 'slideshowImages', slide.id), slide);
      }
      return INITIAL_SLIDESHOW_IMAGES;
    }
    return [];
  } catch (err) {
    console.error('Firestore getSlideshowImages error:', err);
    return INITIAL_SLIDESHOW_IMAGES;
  }
};

export const subscribeSlideshowImages = (callback: (images: SlideshowImage[]) => void) => {
  try {
    return onSnapshot(collection(db, 'slideshowImages'), async (snapshot) => {
      if (!snapshot.empty) {
        slideshowInitialized = true;
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SlideshowImage));
        callback(list);
      } else if (!slideshowInitialized) {
        slideshowInitialized = true;
        for (const slide of INITIAL_SLIDESHOW_IMAGES) {
          await setDoc(doc(db, 'slideshowImages', slide.id), slide);
        }
        callback(INITIAL_SLIDESHOW_IMAGES);
      } else {
        callback([]);
      }
    }, (err) => {
      console.error('Error in subscribeSlideshowImages snapshot:', err);
    });
  } catch (err) {
    console.error('Error establishing subscribeSlideshowImages listener:', err);
    return () => {};
  }
};

export const saveSlideshowImage = async (image: SlideshowImage): Promise<void> => {
  try {
    slideshowInitialized = true;
    await setDoc(doc(db, 'slideshowImages', image.id), image);
  } catch (err) {
    console.error('Firestore saveSlideshowImage error:', err);
  }
};

export const deleteSlideshowImage = async (id: string): Promise<void> => {
  try {
    slideshowInitialized = true;
    await deleteDoc(doc(db, 'slideshowImages', id));
  } catch (err) {
    console.error('Firestore deleteSlideshowImage error:', err);
  }
};
