export interface TeamMember {
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  department: string;
  year: string;
  isLeader?: boolean;
}

export interface TeamRegistration {
  id: string; // e.g. SIH-2026-1082
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  department: string;
  year: string;
  problemStatementId: string;
  problemStatementTitle: string;
  facultyMentor?: string;
  members: TeamMember[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  pptUrl?: string;
  pptFileName?: string;
  notes?: string;
}

export interface Alumni {
  id: string;
  name: string;
  photoUrl: string;
  department: string;
  graduationYear: string;
  sihYear: string;
  teamName: string;
  problemStatement: string;
  achievement: string;
  description: string;
  currentRole?: string;
  company?: string;
}

export interface ProblemStatement {
  id: string;
  psId: string; // e.g. SIH1284
  title: string;
  organization: string;
  category: 'Software' | 'Hardware';
  domain: string;
  description: string;
  datasetUrl?: string;
  keyRequirements?: string[];
}

export interface EventDate {
  id: string;
  title: string;
  date: string;
  location: string;
  isTBD: boolean;
  status: 'Upcoming' | 'Active' | 'Completed' | 'TBD';
  category: 'Registration' | 'Submission' | 'Internal Hackathon' | 'Evaluation' | 'Results';
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube URL or Firebase Storage URL
  thumbnailUrl: string;
  source: 'youtube' | 'storage';
  isMain: boolean;
  duration?: string;
  uploadedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  link?: string;
  tag: 'Notice' | 'Important' | 'Result' | 'Schedule';
  isUrgent: boolean;
  active: boolean;
}

export interface ResultItem {
  id: string; // Team ID e.g. SIH-2026-1001
  teamId: string;
  teamName: string;
  problemStatement: string;
  problemStatementId?: string;
  branch: string; // Department
  score: number;
  rank: number;
  status: 'Winner' | 'Runner-up' | 'Finalist' | 'Qualified' | 'Not Qualified';
  remarks?: string;
  members: TeamMember[];
  updatedAt: string;
  updatedBy?: string;
}

export interface ResultsConfig {
  published: boolean;
  publishedAt?: string;
  publishedBy?: string;
}

export interface SamplePPTResource {
  fileName: string;
  downloadURL: string;
  storagePath: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  version: string;
  published: boolean;
}
