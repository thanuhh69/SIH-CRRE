import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  TeamRegistration, 
  Alumni, 
  ProblemStatement, 
  EventDate, 
  VideoItem, 
  Announcement 
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
