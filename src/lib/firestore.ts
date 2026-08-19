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
  ParticipationMetrics
} from '@/types';
import { 
  ALUMNI_DATA, 
  PROBLEM_STATEMENTS_DATA, 
  IMPORTANT_DATES_DATA, 
  VIDEO_DATA, 
  ANNOUNCEMENTS_DATA 
} from '@/data/placeholder';

// Check if live Firebase credentials are present
const isFirebaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'demo-project'
  );
};

// Helper to interact with local storage fallback
const getLocalData = <T>(key: string, initialData: T): T => {
  if (typeof window === 'undefined') return initialData;
  try {
    const item = localStorage.getItem(`sih_2026_${key}`);
    return item ? JSON.parse(item) : initialData;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return initialData;
  }
};

const setLocalData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`sih_2026_${key}`, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Initial Registrations dataset for fallback
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
      { name: 'K. Sai Teja', email: 'saiteja@sircrrcoestd.in', phone: '9876543210', rollNumber: '21B91A0501', department: 'CSE', year: '4th Year', isLeader: true },
      { name: 'P. Anusha', email: 'anusha@sircrrcoestd.in', phone: '9876543211', rollNumber: '21B91A0502', department: 'CSE', year: '4th Year' },
    ],
    status: 'approved',
    submittedAt: '2026-08-10T10:30:00.000Z'
  }
];

// ==========================================
// REGISTRATIONS COLLECTION API (Firestore + Fallback)
// ==========================================
export const getRegistrations = async (): Promise<TeamRegistration[]> => {
  if (isFirebaseConfigured()) {
    try {
      const q = query(collection(db, 'registrations'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TeamRegistration));
      }
    } catch (err) {
      console.warn('Firestore registrations query failed, using fallback database:', err);
    }
  }
  return getLocalData('registrations', INITIAL_REGISTRATIONS);
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

  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, 'registrations', regId), newRegistration);
      console.log('Registration written to Firestore collection "registrations":', regId);
    } catch (err) {
      console.error('Error writing registration to Firestore:', err);
    }
  }

  // Update local fallback store as well for immediate UI sync
  const current = getLocalData('registrations', INITIAL_REGISTRATIONS);
  const updated = [newRegistration, ...current];
  setLocalData('registrations', updated);

  return newRegistration;
};

export const updateRegistrationStatus = async (id: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await updateDoc(doc(db, 'registrations', id), { status });
    } catch (err) {
      console.error('Firestore update error:', err);
    }
  }

  const current = getLocalData('registrations', INITIAL_REGISTRATIONS);
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  setLocalData('registrations', updated);
};

export const updateRegistrationPPT = async (id: string, pptUrl: string, pptFileName: string): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await updateDoc(doc(db, 'registrations', id), { pptUrl, pptFileName });
    } catch (err) {
      console.error('Firestore PPT update error:', err);
    }
  }

  const current = getLocalData('registrations', INITIAL_REGISTRATIONS);
  const updated = current.map(item => item.id === id ? { ...item, pptUrl, pptFileName } : item);
  setLocalData('registrations', updated);
};

export const deleteRegistration = async (id: string): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'registrations', id));
    } catch (err) {
      console.error('Firestore delete error:', err);
    }
  }

  const current = getLocalData('registrations', INITIAL_REGISTRATIONS);
  const updated = current.filter(item => item.id !== id);
  setLocalData('registrations', updated);
};

// ==========================================
// ALUMNI COLLECTION API
// ==========================================
export const getAlumni = async (): Promise<Alumni[]> => {
  if (isFirebaseConfigured()) {
    try {
      const snapshot = await getDocs(collection(db, 'alumni'));
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Alumni));
      }
    } catch (err) {
      console.warn('Firestore alumni query failed, using fallback:', err);
    }
  }
  return getLocalData('alumni', ALUMNI_DATA);
};

export const saveAlumni = async (alumni: Alumni): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, 'alumni', alumni.id), alumni);
    } catch (err) {
      console.error('Firestore saveAlumni error:', err);
    }
  }
  const current = getLocalData('alumni', ALUMNI_DATA);
  const index = current.findIndex(a => a.id === alumni.id);
  let updated: Alumni[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = alumni;
  } else {
    updated = [alumni, ...current];
  }
  setLocalData('alumni', updated);
};

export const deleteAlumni = async (id: string): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'alumni', id));
    } catch (err) {
      console.error('Firestore deleteAlumni error:', err);
    }
  }
  const current = getLocalData('alumni', ALUMNI_DATA);
  const updated = current.filter(a => a.id !== id);
  setLocalData('alumni', updated);
};

// ==========================================
// PROBLEM STATEMENTS COLLECTION API
// ==========================================
export const getProblemStatements = async (): Promise<ProblemStatement[]> => {
  if (isFirebaseConfigured()) {
    try {
      const snapshot = await getDocs(collection(db, 'problemStatements'));
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProblemStatement));
      }
    } catch (err) {
      console.warn('Firestore problemStatements query failed, using fallback:', err);
    }
  }
  return getLocalData('problem_statements', PROBLEM_STATEMENTS_DATA);
};

export const saveProblemStatement = async (ps: ProblemStatement): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, 'problemStatements', ps.id), ps);
    } catch (err) {
      console.error('Firestore saveProblemStatement error:', err);
    }
  }
  const current = getLocalData('problem_statements', PROBLEM_STATEMENTS_DATA);
  const index = current.findIndex(p => p.id === ps.id);
  let updated: ProblemStatement[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = ps;
  } else {
    updated = [ps, ...current];
  }
  setLocalData('problem_statements', updated);
};

export const deleteProblemStatement = async (id: string): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'problemStatements', id));
    } catch (err) {
      console.error('Firestore deleteProblemStatement error:', err);
    }
  }
  const current = getLocalData('problem_statements', PROBLEM_STATEMENTS_DATA);
  const updated = current.filter(p => p.id !== id);
  setLocalData('problem_statements', updated);
};

// ==========================================
// EVENTS & ANNOUNCEMENTS API
// ==========================================
export const getEventDates = async (): Promise<EventDate[]> => {
  return getLocalData('events', IMPORTANT_DATES_DATA);
};

export const saveEventDate = async (event: EventDate): Promise<void> => {
  const current = getLocalData('events', IMPORTANT_DATES_DATA);
  const index = current.findIndex(e => e.id === event.id);
  let updated: EventDate[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = event;
  } else {
    updated = [event, ...current];
  }
  setLocalData('events', updated);
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
  return getLocalData('announcements', ANNOUNCEMENTS_DATA);
};

export const saveAnnouncement = async (announcement: Announcement): Promise<void> => {
  const current = getLocalData('announcements', ANNOUNCEMENTS_DATA);
  const index = current.findIndex(a => a.id === announcement.id);
  let updated: Announcement[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = announcement;
  } else {
    updated = [announcement, ...current];
  }
  setLocalData('announcements', updated);
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  const current = getLocalData('announcements', ANNOUNCEMENTS_DATA);
  const updated = current.filter(a => a.id !== id);
  setLocalData('announcements', updated);
};

export const getMainVideo = async (): Promise<VideoItem> => {
  return getLocalData('video_main', VIDEO_DATA);
};

export const saveMainVideo = async (video: VideoItem): Promise<void> => {
  setLocalData('video_main', video);
};

// ==========================================
// RESULTS & RESULTS CONFIG API
// ==========================================

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
      { name: 'K. Sai Teja', email: 'saiteja@sircrrcoestd.in', phone: '9876543210', rollNumber: '21B91A0501', department: 'CSE', year: '4th Year', isLeader: true },
      { name: 'P. Anusha', email: 'anusha@sircrrcoestd.in', phone: '9876543211', rollNumber: '21B91A0502', department: 'CSE', year: '4th Year' }
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
      { name: 'M. Rahul', email: 'rahul@sircrrcoestd.in', phone: '9876543212', rollNumber: '21B91A1205', department: 'IT', year: '4th Year', isLeader: true }
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
      { name: 'V. Divya', email: 'divya@sircrrcoestd.in', phone: '9876543213', rollNumber: '22B91A0410', department: 'ECE', year: '3rd Year', isLeader: true }
    ],
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_RESULTS_CONFIG: ResultsConfig = {
  published: false,
  publishedAt: undefined,
  publishedBy: undefined
};

export const getResults = async (): Promise<ResultItem[]> => {
  if (isFirebaseConfigured()) {
    try {
      const q = query(collection(db, 'results'), orderBy('rank', 'asc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ResultItem));
      }
    } catch (err) {
      console.warn('Firestore results query failed, using local store:', err);
    }
  }
  return getLocalData('results', INITIAL_RESULTS);
};

export const saveResult = async (result: ResultItem): Promise<void> => {
  const updatedResult = { ...result, updatedAt: new Date().toISOString() };
  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, 'results', result.id), updatedResult);
    } catch (err) {
      console.error('Firestore saveResult error:', err);
    }
  }
  const current = getLocalData('results', INITIAL_RESULTS);
  const idx = current.findIndex(r => r.id === result.id);
  let updated: ResultItem[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = updatedResult;
  } else {
    updated = [...current, updatedResult];
  }
  setLocalData('results', updated);
};

export const deleteResult = async (id: string): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'results', id));
    } catch (err) {
      console.error('Firestore deleteResult error:', err);
    }
  }
  const current = getLocalData('results', INITIAL_RESULTS);
  const updated = current.filter(r => r.id !== id);
  setLocalData('results', updated);
};

export const getResultsConfig = async (): Promise<ResultsConfig> => {
  if (isFirebaseConfigured()) {
    try {
      const docSnap = await getDoc(doc(db, 'resultsConfig', 'main'));
      if (docSnap.exists()) {
        return docSnap.data() as ResultsConfig;
      }
    } catch (err) {
      console.warn('Firestore getResultsConfig failed, using fallback:', err);
    }
  }
  return getLocalData('resultsConfig', INITIAL_RESULTS_CONFIG);
};

export const updateResultsConfig = async (config: ResultsConfig): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, 'resultsConfig', 'main'), config);
    } catch (err) {
      console.error('Firestore updateResultsConfig error:', err);
    }
  }
  setLocalData('resultsConfig', config);
};

// Real-time listener for public results configuration
export const subscribeResultsConfig = (callback: (config: ResultsConfig) => void) => {
  if (isFirebaseConfigured()) {
    try {
      return onSnapshot(doc(db, 'resultsConfig', 'main'), (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as ResultsConfig);
        } else {
          callback(getLocalData('resultsConfig', INITIAL_RESULTS_CONFIG));
        }
      });
    } catch (err) {
      console.warn('Firestore real-time subscription failed, using polling fallback:', err);
    }
  }
  
  // Fallback: initial call + storage event listener
  callback(getLocalData('resultsConfig', INITIAL_RESULTS_CONFIG));
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'sih_2026_resultsConfig') {
      callback(getLocalData('resultsConfig', INITIAL_RESULTS_CONFIG));
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
};

// Real-time listener for results items
export const subscribeResults = (callback: (results: ResultItem[]) => void) => {
  if (isFirebaseConfigured()) {
    try {
      const q = query(collection(db, 'results'), orderBy('rank', 'asc'));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ResultItem));
          callback(list);
        } else {
          callback(getLocalData('results', INITIAL_RESULTS));
        }
      });
    } catch (err) {
      console.warn('Firestore real-time results subscription failed:', err);
    }
  }

  callback(getLocalData('results', INITIAL_RESULTS));
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'sih_2026_results') {
      callback(getLocalData('results', INITIAL_RESULTS));
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
};

// ==========================================
// SAMPLE PPT RESOURCE MANAGEMENT API
// ==========================================

const INITIAL_SAMPLE_PPT: SamplePPTResource = {
  fileName: 'SIH_Internal_Hackathon_PPT_Template.pptx',
  downloadURL: '/templates/SIH_Internal_Hackathon_PPT_Template.pptx',
  storagePath: 'resources/sample-ppt/SIH_Internal_Hackathon_PPT_Template.pptx',
  fileSize: 2457600, // ~2.4 MB
  uploadedAt: new Date().toISOString(),
  uploadedBy: 'Admin Committee',
  version: '1.0',
  published: true
};

export const getSamplePPT = async (): Promise<SamplePPTResource | null> => {
  if (isFirebaseConfigured()) {
    try {
      const docSnap = await getDoc(doc(db, 'resources', 'samplePPT'));
      if (docSnap.exists()) {
        return docSnap.data() as SamplePPTResource;
      }
    } catch (err) {
      console.warn('Firestore getSamplePPT error:', err);
    }
  }
  return getLocalData('samplePPT', INITIAL_SAMPLE_PPT);
};

export const saveSamplePPT = async (pptData: SamplePPTResource): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, 'resources', 'samplePPT'), pptData);
    } catch (err) {
      console.error('Firestore saveSamplePPT error:', err);
    }
  }
  setLocalData('samplePPT', pptData);
};

export const deleteSamplePPT = async (): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await deleteDoc(doc(db, 'resources', 'samplePPT'));
    } catch (err) {
      console.error('Firestore deleteSamplePPT error:', err);
    }
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sih_2026_samplePPT');
  }
};

export const subscribeSamplePPT = (callback: (ppt: SamplePPTResource | null) => void) => {
  if (isFirebaseConfigured()) {
    try {
      return onSnapshot(doc(db, 'resources', 'samplePPT'), (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as SamplePPTResource);
        } else {
          callback(getLocalData('samplePPT', INITIAL_SAMPLE_PPT));
        }
      });
    } catch (err) {
      console.warn('Firestore samplePPT real-time listener error:', err);
    }
  }

  callback(getLocalData('samplePPT', INITIAL_SAMPLE_PPT));
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'sih_2026_samplePPT') {
      callback(getLocalData('samplePPT', INITIAL_SAMPLE_PPT));
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
};

// ==========================================
// PARTICIPATION METRICS API
// ==========================================
const INITIAL_METRICS: ParticipationMetrics = {
  teamsParticipated: '50+',
  studentsInvolved: '300+',
  innovativeSolutions: '45+',
  sihAlumni: '120+'
};

export const getParticipationMetrics = async (): Promise<ParticipationMetrics> => {
  if (isFirebaseConfigured()) {
    try {
      const docSnap = await getDoc(doc(db, 'metrics', 'main'));
      if (docSnap.exists()) {
        return docSnap.data() as ParticipationMetrics;
      }
    } catch (err) {
      console.warn('Firestore getParticipationMetrics error:', err);
    }
  }
  return getLocalData('metrics', INITIAL_METRICS);
};

export const saveParticipationMetrics = async (metrics: ParticipationMetrics): Promise<void> => {
  if (isFirebaseConfigured()) {
    try {
      await setDoc(doc(db, 'metrics', 'main'), metrics);
    } catch (err) {
      console.error('Firestore saveParticipationMetrics error:', err);
    }
  }
  setLocalData('metrics', metrics);
};

export const subscribeParticipationMetrics = (callback: (metrics: ParticipationMetrics) => void) => {
  if (isFirebaseConfigured()) {
    try {
      return onSnapshot(doc(db, 'metrics', 'main'), (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as ParticipationMetrics);
        } else {
          callback(getLocalData('metrics', INITIAL_METRICS));
        }
      });
    } catch (err) {
      console.warn('Firestore metrics real-time listener error:', err);
    }
  }

  callback(getLocalData('metrics', INITIAL_METRICS));
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'sih_2026_metrics') {
      callback(getLocalData('metrics', INITIAL_METRICS));
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
};

