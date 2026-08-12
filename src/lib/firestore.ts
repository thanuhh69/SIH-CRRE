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

// Initial Registrations dataset
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
      { name: 'M. Kalyan', email: 'kalyan@sircrrcoestd.in', phone: '9876543212', rollNumber: '21B91A0503', department: 'ECE', year: '3rd Year' },
      { name: 'R. Divya', email: 'divya@sircrrcoestd.in', phone: '9876543213', rollNumber: '22B91A0504', department: 'IT', year: '3rd Year' },
    ],
    status: 'approved',
    submittedAt: '2026-08-10T10:30:00.000Z'
  },
  {
    id: 'SIH-2026-1002',
    teamName: 'CyberGuardians',
    leaderName: 'M. Rahul Chowdary',
    leaderEmail: 'rahul@sircrrcoestd.in',
    leaderPhone: '+91 91234 56789',
    department: 'Information Technology',
    year: '3rd Year',
    problemStatementId: 'SIH1290',
    problemStatementTitle: 'Blockchain-Based Fraud-Proof Academic Marksheet',
    facultyMentor: 'Prof. G. Rama Krishna',
    members: [
      { name: 'M. Rahul Chowdary', email: 'rahul@sircrrcoestd.in', phone: '9123456789', rollNumber: '22B91A1201', department: 'IT', year: '3rd Year', isLeader: true },
      { name: 'S. Bhavana', email: 'bhavana@sircrrcoestd.in', phone: '9123456790', rollNumber: '22B91A1202', department: 'IT', year: '3rd Year' },
    ],
    status: 'pending',
    submittedAt: '2026-08-11T14:15:00.000Z'
  }
];

// REGISTRATIONS API
export const getRegistrations = async (): Promise<TeamRegistration[]> => {
  return getLocalData('registrations', INITIAL_REGISTRATIONS);
};

export const createRegistration = async (registrationData: Omit<TeamRegistration, 'id' | 'submittedAt' | 'status'>): Promise<TeamRegistration> => {
  const current = await getRegistrations();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newRegistration: TeamRegistration = {
    ...registrationData,
    id: `SIH-2026-${randomNum}`,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  const updated = [newRegistration, ...current];
  setLocalData('registrations', updated);
  return newRegistration;
};

export const updateRegistrationStatus = async (id: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> => {
  const current = await getRegistrations();
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  setLocalData('registrations', updated);
};

export const updateRegistrationPPT = async (id: string, pptUrl: string, pptFileName: string): Promise<void> => {
  const current = await getRegistrations();
  const updated = current.map(item => item.id === id ? { ...item, pptUrl, pptFileName } : item);
  setLocalData('registrations', updated);
};

export const deleteRegistration = async (id: string): Promise<void> => {
  const current = await getRegistrations();
  const updated = current.filter(item => item.id !== id);
  setLocalData('registrations', updated);
};

// ALUMNI API
export const getAlumni = async (): Promise<Alumni[]> => {
  return getLocalData('alumni', ALUMNI_DATA);
};

export const saveAlumni = async (alumni: Alumni): Promise<void> => {
  const current = await getAlumni();
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
  const current = await getAlumni();
  const updated = current.filter(a => a.id !== id);
  setLocalData('alumni', updated);
};

// PROBLEM STATEMENTS API
export const getProblemStatements = async (): Promise<ProblemStatement[]> => {
  return getLocalData('problem_statements', PROBLEM_STATEMENTS_DATA);
};

export const saveProblemStatement = async (ps: ProblemStatement): Promise<void> => {
  const current = await getProblemStatements();
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
  const current = await getProblemStatements();
  const updated = current.filter(p => p.id !== id);
  setLocalData('problem_statements', updated);
};

// EVENTS / DATES API
export const getEventDates = async (): Promise<EventDate[]> => {
  return getLocalData('events', IMPORTANT_DATES_DATA);
};

export const saveEventDate = async (event: EventDate): Promise<void> => {
  const current = await getEventDates();
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

// ANNOUNCEMENTS API
export const getAnnouncements = async (): Promise<Announcement[]> => {
  return getLocalData('announcements', ANNOUNCEMENTS_DATA);
};

export const saveAnnouncement = async (announcement: Announcement): Promise<void> => {
  const current = await getAnnouncements();
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
  const current = await getAnnouncements();
  const updated = current.filter(a => a.id !== id);
  setLocalData('announcements', updated);
};

// VIDEOS API
export const getMainVideo = async (): Promise<VideoItem> => {
  return getLocalData('video_main', VIDEO_DATA);
};

export const saveMainVideo = async (video: VideoItem): Promise<void> => {
  setLocalData('video_main', video);
};
