'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  getRegistrations, 
  subscribeRegistrations,
  updateRegistrationStatus, 
  updateRegistrationAttendance,
  updateRegistrationPPT,
  deleteRegistration, 
  getAlumni, 
  subscribeAlumni,
  saveAlumni, 
  deleteAlumni,
  getProblemStatements,
  subscribeProblemStatements,
  saveProblemStatement,
  deleteProblemStatement,
  getAnnouncements,
  subscribeAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  getEventDates,
  subscribeEventDates,
  saveEventDate,
  deleteEventDate,
  getSlideshowImages,
  subscribeSlideshowImages,
  saveSlideshowImage,
  deleteSlideshowImage,
  getResults,
  subscribeResults,
  saveResult,
  deleteResult,
  getResultsConfig,
  subscribeResultsConfig,
  updateResultsConfig,
  getSamplePPT,
  subscribeSamplePPT,
  saveSamplePPT,
  deleteSamplePPT,
  getParticipationMetrics,
  subscribeParticipationMetrics,
  saveParticipationMetrics,
  purgeDemoRecords
} from '@/lib/firestore';
import { 
  TeamRegistration, 
  Alumni, 
  ProblemStatement, 
  Announcement, 
  EventDate, 
  SlideshowImage,
  ResultItem,
  ResultsConfig,
  SamplePPTResource,
  ParticipationMetrics
} from '@/types';
import { uploadFileWithFallback, getCloudinaryDownloadUrl } from '@/lib/storage';
import { 
  Lock, 
  KeyRound, 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download, 
  Trash2, 
  Eye, 
  Search, 
  Plus, 
  Film, 
  Bell, 
  Calendar, 
  BookOpen, 
  ShieldCheck, 
  LogOut,
  Edit2,
  Upload,
  ImageIcon,
  Trophy,
  FileText,
  Check,
  Globe,
  AlertTriangle,
  Mail,
  RefreshCw,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboardPage() {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'registrations' | 'results' | 'resources' | 'metrics' | 'alumni' | 'problems' | 'slideshow' | 'announcements' | 'dates'
  >('registrations');

  // Data States
  const [registrations, setRegistrations] = useState<TeamRegistration[]>([]);
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventDate[]>([]);
  const [slideshowImages, setSlideshowImages] = useState<SlideshowImage[]>([]);

  // New Slide Form State
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideCaption, setNewSlideCaption] = useState('');
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [isUploadingSlide, setIsUploadingSlide] = useState(false);

  // Participation Metrics State
  const [metricsForm, setMetricsForm] = useState<ParticipationMetrics>({
    teamsParticipated: '50+',
    studentsInvolved: '300+',
    innovativeSolutions: '45+',
    sihAlumni: '120+'
  });
  const [metricsSaved, setMetricsSaved] = useState(false);

  // Results State
  const [resultsList, setResultsList] = useState<ResultItem[]>([]);
  const [resultsConfig, setResultsConfig] = useState<ResultsConfig>({ published: false });
  const [editingResult, setEditingResult] = useState<Partial<ResultItem> | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Sample PPT Resource State
  const [samplePPT, setSamplePPT] = useState<SamplePPTResource | null>(null);
  const [pptUploading, setPptUploading] = useState(false);
  const [pptError, setPptError] = useState<string | null>(null);

  // Filters & Search
  const [regSearch, setRegSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'pending' | 'approved' | 'rejected'>('ALL');
  const [selectedReg, setSelectedReg] = useState<TeamRegistration | null>(null);

  // Modal States for Add/Edit
  const [editingAlumni, setEditingAlumni] = useState<Partial<Alumni> | null>(null);
  const [editingPs, setEditingPs] = useState<Partial<ProblemStatement> | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Partial<Announcement> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<EventDate> | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isAdminUploadingPPT, setIsAdminUploadingPPT] = useState(false);

  const handleAdminPPTUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedReg) return;
    setIsAdminUploadingPPT(true);
    try {
      const url = await uploadFileWithFallback(file, 'registration-files');
      await updateRegistrationPPT(selectedReg.id, url, file.name);
      setSelectedReg(prev => prev ? { ...prev, pptUrl: url, pptFileName: file.name } : null);
      loadAllAdminData();
      alert(`PPT presentation for Team ${selectedReg.teamName} uploaded successfully to Cloudinary!`);
    } catch (err) {
      console.error('Error uploading PPT in admin:', err);
      alert('Failed to upload presentation file.');
    } finally {
      setIsAdminUploadingPPT(false);
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Load initial data
    loadAllAdminData();

    // Set up real-time subscribers for instant cross-device updates
    const unsubRegs = subscribeRegistrations((list) => setRegistrations(list));
    const unsubAlumni = subscribeAlumni((list) => setAlumniList(list));
    const unsubPs = subscribeProblemStatements((list) => setProblems(list));
    const unsubAnns = subscribeAnnouncements((list) => setAnnouncements(list));
    const unsubEvts = subscribeEventDates((list) => setEvents(list));
    const unsubSlides = subscribeSlideshowImages((list) => setSlideshowImages(list));
    const unsubRes = subscribeResults((list) => setResultsList(list));
    const unsubCfg = subscribeResultsConfig((cfg) => setResultsConfig(cfg));
    const unsubPpt = subscribeSamplePPT((ppt) => setSamplePPT(ppt));
    const unsubMet = subscribeParticipationMetrics((met) => setMetricsForm(met));

    return () => {
      unsubRegs();
      unsubAlumni();
      unsubPs();
      unsubAnns();
      unsubEvts();
      unsubSlides();
      unsubRes();
      unsubCfg();
      unsubPpt();
      unsubMet();
    };
  }, [currentUser]);

  const loadAllAdminData = async () => {
    await purgeDemoRecords();
    const regs = await getRegistrations();
    setRegistrations(regs);

    const alm = await getAlumni();
    setAlumniList(alm);

    const ps = await getProblemStatements();
    setProblems(ps);

    const anns = await getAnnouncements();
    setAnnouncements(anns);

    const evts = await getEventDates();
    setEvents(evts);

    const slides = await getSlideshowImages();
    setSlideshowImages(slides);

    const res = await getResults();
    setResultsList(res);

    const cfg = await getResultsConfig();
    setResultsConfig(cfg);

    const ppt = await getSamplePPT();
    setSamplePPT(ppt);

    const met = await getParticipationMetrics();
    setMetricsForm(met);
  };

  const handleSaveMetrics = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMetrics: ParticipationMetrics = {
      teamsParticipated: metricsForm.teamsParticipated || '50+',
      studentsInvolved: metricsForm.studentsInvolved || '300+',
      innovativeSolutions: metricsForm.innovativeSolutions || '45+',
      sihAlumni: metricsForm.sihAlumni || '120+',
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser?.email || 'Admin Committee'
    };
    try {
      await saveParticipationMetrics(updatedMetrics);
      setMetricsForm(updatedMetrics);
      setMetricsSaved(true);
      setTimeout(() => setMetricsSaved(false), 4000);
    } catch (err) {
      console.error('Error saving metrics:', err);
      alert('Failed to update metrics.');
    }
  };

  // Firebase Email/Password Auth Handlers
  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setResetMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.warn('Firebase auth login failed, checking fallback credentials:', err.message);
      // Demo Admin Fallback for offline/local testing
      if ((email === 'admin@sircrrcoestd.in' || email === 'admin@crr.edu') && password === 'admin123') {
        // Mock fake auth object
        setCurrentUser({ email, uid: 'admin-local-uid' } as any);
      } else {
        setAuthError('Invalid credentials. Please verify your Admin Email & Password.');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError('Please enter your Admin Email address above to receive a password reset link.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage(`Password reset email sent to ${email}. Please check your inbox.`);
      setAuthError(null);
    } catch (err: any) {
      setResetMessage(`Demo Mode: If your email is registered in Firebase Auth, reset instructions have been triggered.`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setCurrentUser(null);
  };

  // Photo Upload Handler for Alumni
  const handleAlumniPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAlumni) return;
    setIsUploadingPhoto(true);
    try {
      const photoUrl = await uploadFileWithFallback(file, 'alumni');
      setEditingAlumni(prev => prev ? { ...prev, photoUrl } : null);
    } catch (err) {
      console.error('Error uploading alumni photo:', err);
      alert('Failed to process image file.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Registration Actions
  const handleStatusChange = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    await updateRegistrationStatus(id, status);
    loadAllAdminData();
  };

  const handleDeleteRegistration = async (id: string) => {
    if (confirm(`Are you sure you want to delete registration ${id}?`)) {
      await deleteRegistration(id);
      loadAllAdminData();
    }
  };

  // Populate Result from Registration
  const handlePopulateResultFromReg = (reg: TeamRegistration) => {
    setEditingResult({
      id: reg.id,
      teamId: reg.id,
      teamName: reg.teamName,
      problemStatement: reg.problemStatementTitle,
      problemStatementId: reg.problemStatementId,
      branch: reg.department,
      score: 85,
      rank: resultsList.length + 1,
      status: 'Qualified',
      remarks: 'Evaluated during Internal Screening Round',
      members: reg.members,
      updatedAt: new Date().toISOString()
    });
    setActiveTab('results');
  };

  // Save Result Handler
  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult?.teamId?.trim()) {
      alert('Please enter or select a Team ID / Registration Code.');
      return;
    }
    if (!editingResult?.teamName?.trim()) {
      alert('Please enter the Team Name.');
      return;
    }

    try {
      const itemToSave: ResultItem = {
        id: editingResult.teamId.trim(),
        teamId: editingResult.teamId.trim(),
        teamName: editingResult.teamName.trim(),
        problemStatement: editingResult.problemStatement?.trim() || 'SIH Project',
        problemStatementId: editingResult.problemStatementId?.trim() || 'SIH1000',
        branch: editingResult.branch?.trim() || 'Computer Science & Engineering',
        score: Number(editingResult.score) || 0,
        rank: Number(editingResult.rank) || 1,
        status: (editingResult.status as any) || 'Qualified',
        remarks: editingResult.remarks?.trim() || '',
        members: editingResult.members || [],
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.email || 'Admin Committee'
      };

      await saveResult(itemToSave);
      setResultsList(prev => [...prev.filter(r => r.id !== itemToSave.id), itemToSave]);
      setEditingResult(null);
      await loadAllAdminData();
      alert('Team result & score record saved successfully!');
    } catch (err) {
      console.error('Error saving result record:', err);
      alert('Failed to save result record.');
    }
  };

  // Toggle Result Publication
  const handleTogglePublishResults = async (publish: boolean) => {
    const newConfig: ResultsConfig = {
      published: publish,
      publishedAt: publish ? new Date().toISOString() : undefined,
      publishedBy: publish ? (currentUser?.email || 'Admin Committee') : undefined
    };
    await updateResultsConfig(newConfig);
    setResultsConfig(newConfig);
    setShowPublishModal(false);
  };

  // PPT Resource File Validation & Upload
  const handlePPTFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPptError(null);
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isPpt = fileName.endsWith('.ppt') || fileName.endsWith('.pptx');

    if (!isPpt) {
      setPptError('Invalid file type! Only .ppt or .pptx presentation files are allowed.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setPptError('File size exceeds maximum limit of 25MB.');
      return;
    }

    setPptUploading(true);
    try {
      const downloadURL = await uploadFileWithFallback(file, 'resources');
      
      // Calculate version
      const oldVersion = samplePPT?.version ? parseFloat(samplePPT.version) : 0.9;
      const newVersion = (oldVersion + 0.1).toFixed(1);

      const pptData: SamplePPTResource = {
        fileName: file.name,
        downloadURL,
        storagePath: `resources/sample-ppt/${file.name}`,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUser?.email || 'Admin Committee',
        version: newVersion,
        published: true
      };

      await saveSamplePPT(pptData);
      setSamplePPT(pptData);
    } catch (err) {
      console.error('PPT Upload Error:', err);
      setPptError('Failed to upload presentation file.');
    } finally {
      setPptUploading(false);
    }
  };

  const handleTogglePublishPPT = async (publish: boolean) => {
    if (!samplePPT) return;
    const updated = { ...samplePPT, published: publish };
    await saveSamplePPT(updated);
    setSamplePPT(updated);
  };

  const handleDeletePPT = async () => {
    if (confirm('Are you sure you want to delete the Sample PPT resource? Students will no longer be able to download it.')) {
      await deleteSamplePPT();
      setSamplePPT(null);
    }
  };

  // Save Modal Handlers
  const handleSaveAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlumni?.name) return;
    const newAlumni: Alumni = {
      id: editingAlumni.id || `ALM-${Date.now()}`,
      name: editingAlumni.name || '',
      photoUrl: editingAlumni.photoUrl || '',
      department: editingAlumni.department || 'Computer Science & Engineering',
      graduationYear: editingAlumni.graduationYear || '2024',
      sihYear: editingAlumni.sihYear || '2023',
      teamName: editingAlumni.teamName || 'Innovators CRR',
      problemStatement: editingAlumni.problemStatement || 'SIH Innovation Project',
      achievement: editingAlumni.achievement || 'Grand Finale Finalist',
      description: editingAlumni.description || editingAlumni.achievement || 'SIH Winner',
      currentRole: editingAlumni.currentRole || 'Software Engineer',
      company: editingAlumni.company || 'Tech Corp'
    };
    await saveAlumni(newAlumni);
    setEditingAlumni(null);
    loadAllAdminData();
  };

  const handleSavePs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPs?.title || !editingPs?.psId) return;
    const newPs: ProblemStatement = {
      id: editingPs.id || `PS-${Date.now()}`,
      psId: editingPs.psId || 'SIH1000',
      title: editingPs.title || '',
      organization: editingPs.organization || 'Ministry of Education',
      category: (editingPs.category as any) || 'Software',
      domain: editingPs.domain || 'Smart Education',
      description: editingPs.description || '',
      keyRequirements: editingPs.keyRequirements || ['Prototype Model', 'Documentation']
    };
    await saveProblemStatement(newPs);
    setEditingPs(null);
    loadAllAdminData();
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement?.title) return;
    const newAnn: Announcement = {
      id: editingAnnouncement.id || `ANN-${Date.now()}`,
      title: editingAnnouncement.title || '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      link: editingAnnouncement.link || '/register',
      tag: (editingAnnouncement.tag as any) || 'Notice',
      isUrgent: editingAnnouncement.isUrgent || false,
      active: true
    };
    await saveAnnouncement(newAnn);
    setEditingAnnouncement(null);
    loadAllAdminData();
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.title) return;
    const newEvt: EventDate = {
      id: editingEvent.id || `EVT-${Date.now()}`,
      title: editingEvent.title || '',
      date: editingEvent.date || '15th & 16th September 2026',
      location: editingEvent.location || 'Sir C.R. Reddy CoE Campus',
      isTBD: editingEvent.isTBD || false,
      status: editingEvent.status || 'Upcoming',
      category: (editingEvent.category as any) || 'Internal Hackathon'
    };
    await saveEventDate(newEvt);
    setEditingEvent(null);
    loadAllAdminData();
  };

  // Attendance Toggle Handler
  const handleToggleAttendance = async (regId: string, currentAttendance?: 'present' | 'absent') => {
    const nextAttendance: 'present' | 'absent' = currentAttendance === 'present' ? 'absent' : 'present';
    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, attendance: nextAttendance } : r));
    await updateRegistrationAttendance(regId, nextAttendance);
  };

  // Slideshow Management Handlers
  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideTitle || !newSlideUrl) {
      alert('Please provide a title and an image URL or upload an image file.');
      return;
    }
    const newSlide: SlideshowImage = {
      id: `slide-${Date.now()}`,
      url: newSlideUrl,
      title: newSlideTitle,
      caption: newSlideCaption || '',
      createdAt: new Date().toISOString(),
      order: slideshowImages.length + 1
    };
    try {
      await saveSlideshowImage(newSlide);
      setSlideshowImages(prev => [...prev.filter(s => s.id !== newSlide.id), newSlide]);
      setNewSlideTitle('');
      setNewSlideCaption('');
      setNewSlideUrl('');
      alert('Homepage slideshow image added successfully!');
    } catch (err) {
      console.error('Error saving slide:', err);
      alert('Failed to save slideshow image.');
    }
  };

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingSlide(true);
    try {
      const url = await uploadFileWithFallback(file, 'slideshow-images');
      setNewSlideUrl(url);
    } catch (err) {
      console.error('Slide upload error:', err);
      alert('Failed to upload slide image.');
    } finally {
      setIsUploadingSlide(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (confirm('Are you sure you want to delete this slideshow image from the homepage?')) {
      setSlideshowImages(prev => prev.filter(s => s.id !== id));
      await deleteSlideshowImage(id);
    }
  };

  const exportCSV = () => {
    if (registrations.length === 0) return;
    const headers = ['Registration ID', 'Team Name', 'Leader Name', 'Leader Email', 'Leader Phone', 'Department', 'Year', 'PS ID', 'PS Title', 'Status', 'Submitted At', 'PPT File Name', 'Cloudinary PPT URL'];
    const rows = registrations.map(r => [
      r.id,
      `"${r.teamName}"`,
      `"${r.leaderName}"`,
      r.leaderEmail,
      r.leaderPhone,
      `"${r.department}"`,
      r.year,
      r.problemStatementId,
      `"${r.problemStatementTitle}"`,
      r.status,
      r.submittedAt,
      `"${r.pptFileName || ''}"`,
      `"${r.pptUrl ? getCloudinaryDownloadUrl(r.pptUrl, r.pptFileName) : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SIH_2026_Registrations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered registrations list
  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.teamName.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.leaderName.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.department.toLowerCase().includes(regSearch.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalParticipants = registrations.reduce((acc, r) => acc + 1 + (r.members?.length || 0), 0);
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;

  // Unauthenticated Login View
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-white text-center space-y-3">
            <div className="w-10 h-10 border-4 border-college-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono">Verifying Admin Session...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4 py-16">
          <div className="bg-white max-w-md w-full rounded-xl border-2 border-college-gold p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-college-navy text-college-gold flex items-center justify-center mx-auto border-2 border-college-gold shadow-md">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-college-navy">SIH Internal Hackathon</h2>
              <h3 className="font-bold text-sm text-college-gold uppercase tracking-widest font-mono">Admin Portal</h3>
              <p className="text-xs text-slate-600">Sir C. R. Reddy College of Engineering (Autonomous)</p>
            </div>

            <form onSubmit={handleFirebaseLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-4 h-4 text-college-gold" /> Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@sircrrcoestd.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-college-navy outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <KeyRound className="w-4 h-4 text-college-gold" /> Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-college-navy outline-none font-mono"
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {resetMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{resetMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-college-navy hover:bg-college-blue text-white py-3 rounded text-xs font-bold tracking-wider transition-colors shadow-md border border-college-gold/30"
              >
                SECURE ADMIN LOGIN →
              </button>

              <div className="flex justify-between items-center text-xs pt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-college-navy hover:text-college-gold font-bold underline"
                >
                  Forgot Password?
                </button>
                <span className="text-slate-400 font-mono text-[10px]">Demo Login: admin@sircrrcoestd.in / admin123</span>
              </div>
            </form>

            <div className="text-[11px] text-slate-500 text-center bg-slate-50 p-3 rounded border border-slate-200">
              🔒 Protected Firebase Authenticated Portal for Steering Committee & Departmental Coordinators.
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Header Dashboard Banner */}
        <div className="bg-college-dark text-white p-6 rounded-xl border-b-4 border-college-gold shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-college-gold tracking-widest uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> SIH 2026 INTERNAL HACKATHON
            </div>
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-white mt-1">
              College Steering & Admin Dashboard
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <p className="text-slate-300 text-xs">
                Authenticated Admin: <strong className="font-mono text-college-gold">{currentUser.email || 'Admin'}</strong>
              </p>
              <span className="text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                ☁️ Cloudinary API Active (dwzv8izif)
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold transition-colors shadow-xs"
          >
            <LogOut className="w-4 h-4" /> Logout Session
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm">
            <div className="text-slate-500 text-[11px] font-semibold">Total Teams</div>
            <div className="font-serif font-bold text-2xl text-college-navy mt-1">{registrations.length}</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm">
            <div className="text-slate-500 text-[11px] font-semibold">Total Participants</div>
            <div className="font-serif font-bold text-2xl text-purple-900 mt-1">{totalParticipants}</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm">
            <div className="text-slate-500 text-[11px] font-semibold">Pending Screening</div>
            <div className="font-serif font-bold text-2xl text-amber-600 mt-1">{pendingCount}</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm">
            <div className="text-slate-500 text-[11px] font-semibold">Approved Teams</div>
            <div className="font-serif font-bold text-2xl text-emerald-600 mt-1">{approvedCount}</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm">
            <div className="text-slate-500 text-[11px] font-semibold">Evaluated Results</div>
            <div className="font-serif font-bold text-2xl text-college-gold mt-1">{resultsList.length}</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm">
            <div className="text-slate-500 text-[11px] font-semibold">Results Status</div>
            <div className={`text-xs font-bold mt-2 px-2 py-0.5 rounded inline-block ${
              resultsConfig.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {resultsConfig.published ? 'PUBLISHED' : 'DRAFT / HIDDEN'}
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-sm">
          <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50">
            {[
              { id: 'registrations', label: 'Registrations', icon: Users },
              { id: 'results', label: 'Results Management', icon: Trophy },
              { id: 'resources', label: 'Sample PPT Resource', icon: FileText },
              { id: 'metrics', label: 'Participation Metrics', icon: Sparkles },
              { id: 'alumni', label: 'Alumni Showcase', icon: ShieldCheck },
              { id: 'problems', label: 'Problem Statements', icon: BookOpen },
              { id: 'slideshow', label: 'Homepage Slideshow', icon: ImageIcon },
              { id: 'announcements', label: 'Notice Board', icon: Bell },
              { id: 'dates', label: 'Important Dates', icon: Calendar },
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                    active
                      ? 'border-college-navy bg-white text-college-navy'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-college-gold" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: REGISTRATIONS TABLE */}
          {activeTab === 'registrations' && (
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search ID, team, leader..."
                      value={regSearch}
                      onChange={e => setRegSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded outline-none"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as any)}
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded outline-none font-bold bg-white"
                  >
                    <option value="ALL">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <button
                  onClick={exportCSV}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded text-xs font-bold transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" /> Export CSV Data
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 font-serif font-bold text-college-navy border-b border-slate-200">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Team Name</th>
                      <th className="p-3">Leader</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">PS ID</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Attendance</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          No team registrations found matching your query.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map(reg => (
                        <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono font-bold text-college-gold">{reg.id}</td>
                          <td className="p-3 font-bold text-college-navy">{reg.teamName}</td>
                          <td className="p-3">{reg.leaderName}</td>
                          <td className="p-3 text-slate-600">{reg.department}</td>
                          <td className="p-3 font-mono text-slate-600">{reg.problemStatementId}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              reg.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                              reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {reg.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleAttendance(reg.id, reg.attendance)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider border transition-all cursor-pointer ${
                                reg.attendance === 'present'
                                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                              }`}
                              title="Click to toggle Present / Absent attendance"
                            >
                              {reg.attendance === 'present' ? '✓ PRESENT' : '✗ ABSENT'}
                            </button>
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            {(reg.pptFileName || reg.pptUrl) ? (
                              reg.pptUrl && !reg.pptUrl.startsWith('local-file://') ? (
                                <a
                                  href={getCloudinaryDownloadUrl(reg.pptUrl, reg.pptFileName)}
                                  download={reg.pptFileName || `${reg.teamName}_PPT`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                  title="Download Team Presentation PPT from Cloudinary"
                                >
                                  <FileText className="w-3.5 h-3.5" /> PPT
                                </a>
                              ) : (
                                <button
                                  onClick={() => setSelectedReg(reg)}
                                  className="bg-amber-700 hover:bg-amber-800 text-white px-2 py-1 rounded text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                  title="PPT needs Cloudinary upload. Click to open team modal & upload."
                                >
                                  <FileText className="w-3.5 h-3.5" /> Upload PPT
                                </button>
                              )
                            ) : null}
                            <button
                              onClick={() => setSelectedReg(reg)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-[11px] font-bold"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5 inline" /> View
                            </button>
                            <button
                              onClick={() => handlePopulateResultFromReg(reg)}
                              className="bg-college-gold hover:bg-amber-600 text-college-dark px-2 py-1 rounded text-[11px] font-bold"
                              title="Add / Edit Evaluation Result"
                            >
                              <Trophy className="w-3.5 h-3.5 inline" /> Score
                            </button>
                            <button
                              onClick={() => handleStatusChange(reg.id, 'approved')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[11px] font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(reg.id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-[11px] font-bold"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: RESULTS MANAGEMENT SYSTEM */}
          {activeTab === 'results' && (
            <div className="p-6 space-y-6">
              <div className="bg-slate-900 text-white p-5 rounded-lg border-2 border-college-gold flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-college-gold" />
                    <h3 className="font-serif font-bold text-lg text-white">Results Publication & Score Engine</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Manage team scores, assign national ranks, preview draft results, and toggle public disclosure.
                  </p>
                  {resultsConfig.publishedAt && (
                    <span className="text-[11px] font-mono text-college-gold block mt-1">
                      Last Published: {new Date(resultsConfig.publishedAt).toLocaleString()} by {resultsConfig.publishedBy}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {resultsConfig.published ? (
                    <button
                      onClick={() => handleTogglePublishResults(false)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-xs font-bold transition-colors border border-amber-400"
                    >
                      Unpublish Results (Hide from Public)
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPublishModal(true)}
                      className="bg-college-gold hover:bg-college-goldLight text-college-dark px-4 py-2 rounded text-xs font-bold transition-colors shadow-md border border-amber-300"
                    >
                      Publish Results to Website →
                    </button>
                  )}

                  <a
                    href="/results"
                    target="_blank"
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded text-xs font-bold border border-white/20 flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4 text-college-gold" /> Preview Portal
                  </a>
                </div>
              </div>

              {/* Add New / Edit Result Form Button */}
              <div className="flex justify-between items-center">
                <h4 className="font-serif font-bold text-base text-college-navy">Evaluated Team Standings</h4>
                <button
                  onClick={() => setEditingResult({
                    teamId: `SIH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    teamName: '',
                    problemStatement: '',
                    branch: 'Computer Science & Engineering',
                    score: 90,
                    rank: resultsList.length + 1,
                    status: 'Qualified',
                    remarks: '',
                    members: []
                  })}
                  className="inline-flex items-center gap-1 bg-college-navy text-white px-3.5 py-2 rounded text-xs font-bold hover:bg-college-blue"
                >
                  <Plus className="w-4 h-4 text-college-gold" /> Add / Enter Team Result
                </button>
              </div>

              {/* Results List Table */}
              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 font-serif font-bold text-college-navy border-b border-slate-200">
                    <tr>
                      <th className="p-3 text-center">Rank</th>
                      <th className="p-3">Team ID</th>
                      <th className="p-3">Team Name</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {resultsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No team evaluation results entered yet.
                        </td>
                      </tr>
                    ) : (
                      resultsList.sort((a,b) => a.rank - b.rank).map((res) => (
                        <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 text-center font-bold text-sm">
                            <span className={`inline-block w-6 h-6 rounded-full text-white text-xs font-bold leading-6 text-center ${
                              res.rank === 1 ? 'bg-amber-500' : res.rank === 2 ? 'bg-slate-600' : res.rank === 3 ? 'bg-amber-800' : 'bg-slate-800'
                            }`}>
                              {res.rank}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-college-gold">{res.teamId}</td>
                          <td className="p-3 font-bold text-college-navy">{res.teamName}</td>
                          <td className="p-3 text-slate-600">{res.branch}</td>
                          <td className="p-3 font-bold text-sm text-college-navy">{res.score} / 100</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              res.status === 'Winner' ? 'bg-emerald-100 text-emerald-800' :
                              res.status === 'Runner-up' ? 'bg-blue-100 text-blue-800' :
                              res.status === 'Finalist' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => setEditingResult(res)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded text-[11px] font-bold"
                            >
                              <Edit2 className="w-3.5 h-3.5 inline" /> Edit Result
                            </button>
                            <button
                              onClick={() => deleteResult(res.id).then(loadAllAdminData)}
                              className="bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded text-[11px] font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SAMPLE PPT RESOURCE MANAGEMENT */}
          {activeTab === 'resources' && (
            <div className="p-6 space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-lg border-2 border-college-gold space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                      <FileText className="w-6 h-6 text-college-gold" /> REGISTRATION RESOURCES – SAMPLE PPT MANAGEMENT
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Upload and manage the official SIH Internal Hackathon presentation template for team leaders.
                    </p>
                  </div>

                  {samplePPT && (
                    <span className={`px-3 py-1 rounded font-mono text-xs font-bold ${
                      samplePPT.published ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {samplePPT.published ? 'STATUS: PUBLISHED' : 'STATUS: UNPUBLISHED'}
                    </span>
                  )}
                </div>
              </div>

              {/* Sample PPT Management Card */}
              <div className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
                {samplePPT ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-500 font-semibold uppercase">Current Active Presentation Template</div>
                        <div className="font-bold text-sm text-college-navy font-mono flex items-center gap-2">
                          <FileText className="w-4 h-4 text-college-gold" />
                          {samplePPT.fileName}
                        </div>
                        <div className="text-[11px] text-slate-600 font-mono space-x-3">
                          <span><strong>Version:</strong> {samplePPT.version}</span>
                          <span>•</span>
                          <span><strong>Size:</strong> {(samplePPT.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                          <span>•</span>
                          <span><strong>Uploaded:</strong> {new Date(samplePPT.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <a
                        href={getCloudinaryDownloadUrl(samplePPT.downloadURL, samplePPT.fileName)}
                        download={samplePPT.fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-college-navy hover:bg-college-blue text-white px-3.5 py-2 rounded text-xs font-bold shrink-0 flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4 text-college-gold" /> Download
                      </a>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <label className="bg-college-navy hover:bg-college-blue text-white px-4 py-2 rounded text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-college-gold" />
                        <span>{pptUploading ? 'Uploading New PPT...' : 'Replace PPT Template'}</span>
                        <input
                          type="file"
                          accept=".ppt,.pptx"
                          onChange={handlePPTFileUpload}
                          className="hidden"
                          disabled={pptUploading}
                        />
                      </label>

                      {samplePPT.published ? (
                        <button
                          onClick={() => handleTogglePublishPPT(false)}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-xs font-bold"
                        >
                          Unpublish Template
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTogglePublishPPT(true)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded text-xs font-bold"
                        >
                          Publish Template for Students
                        </button>
                      )}

                      <button
                        onClick={handleDeletePPT}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded text-xs font-bold border border-red-200"
                      >
                        Delete PPT
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-amber-50 text-college-gold flex items-center justify-center mx-auto border border-amber-200">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-college-navy">No Sample PPT Uploaded Yet</h4>
                      <p className="text-xs text-slate-500 mt-1">Upload the official .ppt or .pptx presentation template to make it available on the registration page.</p>
                    </div>

                    <label className="inline-flex items-center gap-2 bg-college-navy hover:bg-college-blue text-white px-5 py-2.5 rounded text-xs font-bold cursor-pointer transition-colors shadow-md border border-college-gold/30">
                      <Upload className="w-4 h-4 text-college-gold" />
                      <span>{pptUploading ? 'Uploading Template...' : 'Upload Sample PPT (.ppt / .pptx)'}</span>
                      <input
                        type="file"
                        accept=".ppt,.pptx"
                        onChange={handlePPTFileUpload}
                        className="hidden"
                        disabled={pptUploading}
                      />
                    </label>
                  </div>
                )}

                {pptError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{pptError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: PARTICIPATION METRICS MANAGEMENT */}
          {activeTab === 'metrics' && (
            <div className="p-6 space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-lg border-2 border-college-gold flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-college-gold" /> HOME PAGE PARTICIPATION METRICS
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Manage the dynamic statistics shown in the "Our SIH Journey" section on the main website homepage.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveMetrics} className="bg-white border-2 border-slate-300 rounded-xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-college-navy mb-1">
                      Teams Participated (e.g. 50+)
                    </label>
                    <input
                      type="text"
                      required
                      value={metricsForm.teamsParticipated}
                      onChange={e => setMetricsForm({ ...metricsForm, teamsParticipated: e.target.value })}
                      className="w-full p-2.5 text-sm border border-slate-300 rounded font-mono font-bold text-college-navy focus:ring-2 focus:ring-college-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-college-navy mb-1">
                      Students Involved (e.g. 300+)
                    </label>
                    <input
                      type="text"
                      required
                      value={metricsForm.studentsInvolved}
                      onChange={e => setMetricsForm({ ...metricsForm, studentsInvolved: e.target.value })}
                      className="w-full p-2.5 text-sm border border-slate-300 rounded font-mono font-bold text-college-navy focus:ring-2 focus:ring-college-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-college-navy mb-1">
                      Innovative Solutions (e.g. 45+)
                    </label>
                    <input
                      type="text"
                      required
                      value={metricsForm.innovativeSolutions}
                      onChange={e => setMetricsForm({ ...metricsForm, innovativeSolutions: e.target.value })}
                      className="w-full p-2.5 text-sm border border-slate-300 rounded font-mono font-bold text-college-navy focus:ring-2 focus:ring-college-gold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-college-navy mb-1">
                      SIH Alumni (e.g. 120+)
                    </label>
                    <input
                      type="text"
                      required
                      value={metricsForm.sihAlumni}
                      onChange={e => setMetricsForm({ ...metricsForm, sihAlumni: e.target.value })}
                      className="w-full p-2.5 text-sm border border-slate-300 rounded font-mono font-bold text-college-navy focus:ring-2 focus:ring-college-gold outline-none"
                    />
                  </div>
                </div>

                {metricsSaved && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Participation metrics successfully saved and updated on the Home Page!</span>
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t">
                  <button
                    type="submit"
                    className="bg-college-navy hover:bg-college-blue text-white px-6 py-2.5 rounded text-xs font-bold shadow-md transition-colors border border-college-gold/30 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-college-gold" />
                    <span>Save & Update Home Page Metrics</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: ALUMNI SHOWCASE CRUD */}
          {activeTab === 'alumni' && (
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-college-navy">Past SIH Winners & Alumni Records</h3>
                <button
                  onClick={() => setEditingAlumni({ name: '', department: 'Computer Science & Engineering', graduationYear: '2024', sihYear: '2023', teamName: '', achievement: 'National Winner' })}
                  className="inline-flex items-center gap-1 bg-college-navy text-white px-3.5 py-2 rounded text-xs font-bold hover:bg-college-blue"
                >
                  <Plus className="w-4 h-4 text-college-gold" /> Add Alumni Record
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alumniList.map(alm => (
                  <div key={alm.id} className="p-4 border border-slate-200 rounded flex justify-between items-start bg-slate-50">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-200 border overflow-hidden shrink-0">
                        {alm.photoUrl ? (
                          <img src={alm.photoUrl} alt={alm.name} className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                            {alm.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-college-navy">{alm.name}</h4>
                        <p className="text-xs text-slate-600">{alm.department} ({alm.graduationYear})</p>
                        <span className="text-[11px] text-college-gold font-mono font-bold">SIH {alm.sihYear} · {alm.achievement}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingAlumni(alm)}
                        className="text-college-navy hover:bg-white p-1 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAlumni(alm.id).then(loadAllAdminData)}
                        className="text-red-600 hover:bg-white p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROBLEM STATEMENTS CRUD */}
          {activeTab === 'problems' && (
            <div className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-amber-50 border-2 border-college-gold p-4 rounded-xl shadow-xs">
                <div>
                  <h4 className="font-serif font-bold text-sm text-college-navy flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-college-gold" /> Official SIH 2026 Problem Statements Portal
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Students exploring problem statements on the website are automatically redirected to the official government portal: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px] text-amber-900 font-bold">https://sih.gov.in/sih2026PS</code>
                  </p>
                </div>
                <a
                  href="https://sih.gov.in/sih2026PS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-college-navy hover:bg-college-blue text-white px-4 py-2 rounded-lg text-xs font-bold shrink-0 transition-colors border border-college-gold/30 shadow-sm"
                >
                  <span>Open SIH PS Portal ↗</span>
                </a>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-college-navy">Campus SIH Problem Statements Reference Library</h3>
                <button
                  onClick={() => setEditingPs({ psId: `SIH${Math.floor(1000 + Math.random() * 9000)}`, title: '', organization: 'Ministry of Education', category: 'Software', domain: 'Smart Education', description: '' })}
                  className="inline-flex items-center gap-1 bg-college-navy text-white px-3.5 py-2 rounded text-xs font-bold hover:bg-college-blue"
                >
                  <Plus className="w-4 h-4 text-college-gold" /> Add Reference Problem Statement
                </button>
              </div>

              <div className="space-y-3">
                {problems.map(ps => (
                  <div key={ps.id} className="p-4 border border-slate-200 rounded flex justify-between items-center bg-slate-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-college-dark text-college-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded">{ps.psId}</span>
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">{ps.category}</span>
                        <h4 className="font-bold text-sm text-college-navy">{ps.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{ps.organization} • {ps.domain}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPs(ps)}
                        className="text-college-navy hover:bg-white p-1 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProblemStatement(ps.id).then(loadAllAdminData)}
                        className="text-red-600 hover:bg-white p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: HOMEPAGE SLIDESHOW MANAGEMENT */}
          {activeTab === 'slideshow' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-5 rounded-lg border-2 border-college-gold">
                <div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-college-gold" />
                    <h3 className="font-serif font-bold text-lg text-white">Homepage Photo Slideshow Banner Manager</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Upload, view, and manage photos displayed on the college-themed homepage slideshow banner.
                  </p>
                </div>
              </div>

              {/* Upload & Add New Slide Form */}
              <form onSubmit={handleAddSlide} className="bg-slate-50 p-5 rounded-lg border border-slate-300 space-y-4 max-w-2xl">
                <h4 className="font-serif font-bold text-sm text-college-navy flex items-center gap-2">
                  <Plus className="w-4 h-4 text-college-gold" /> Add New Homepage Slideshow Image
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Slide Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. SIH Hackathon Inauguration & Hardware Expo"
                      value={newSlideTitle}
                      onChange={e => setNewSlideTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded outline-none bg-white focus:ring-2 focus:ring-college-navy"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Slide Caption (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Student teams showcasing IoT prototypes to evaluators."
                      value={newSlideCaption}
                      onChange={e => setNewSlideCaption(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded outline-none bg-white focus:ring-2 focus:ring-college-navy"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="block font-bold text-slate-700">Image Source (Upload File or Enter URL) *</label>
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={newSlideUrl}
                      onChange={e => setNewSlideUrl(e.target.value)}
                      className="flex-grow px-3 py-2 border border-slate-300 rounded outline-none bg-white focus:ring-2 focus:ring-college-navy"
                    />
                    <label className="inline-flex items-center justify-center gap-1.5 bg-college-navy hover:bg-college-blue text-white px-4 py-2 rounded font-bold cursor-pointer shrink-0 transition-colors">
                      <Upload className="w-4 h-4 text-college-gold" />
                      <span>{isUploadingSlide ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlideImageUpload}
                        className="hidden"
                        disabled={isUploadingSlide}
                      />
                    </label>
                  </div>
                  {newSlideUrl && (
                    <div className="mt-2 p-2 bg-white rounded border border-slate-200 flex items-center gap-3">
                      <img src={newSlideUrl} alt="Preview" className="w-16 h-12 object-cover rounded border" />
                      <span className="text-[11px] font-mono text-emerald-700 font-bold">✓ Image URL Ready</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-college-gold hover:bg-amber-600 text-college-dark px-6 py-2.5 rounded font-extrabold text-xs shadow-md transition-all border border-amber-400"
                >
                  Publish Slide to Homepage →
                </button>
              </form>

              {/* Active Slides Grid */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-college-navy">Active Homepage Slides ({slideshowImages.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slideshowImages.map((slide, idx) => (
                    <div key={slide.id} className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="relative h-40 bg-black">
                          <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 bg-college-navy text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                            Slide #{idx + 1}
                          </span>
                        </div>
                        <div className="p-4 space-y-1">
                          <h5 className="font-serif font-bold text-sm text-college-navy">{slide.title}</h5>
                          {slide.caption && <p className="text-xs text-slate-600 leading-tight">{slide.caption}</p>}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
                        <span className="text-[10px] text-slate-400 font-mono">ID: {slide.id}</span>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="text-red-600 hover:text-red-800 font-bold inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2 py-1 rounded border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Slide
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: NOTICE BOARD */}
          {activeTab === 'announcements' && (
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-college-navy">College Notice Board Notices</h3>
                <button
                  onClick={() => setEditingAnnouncement({ title: '', tag: 'Notice', link: '/register', isUrgent: false, active: true })}
                  className="inline-flex items-center gap-1 bg-college-navy text-white px-3.5 py-2 rounded text-xs font-bold hover:bg-college-blue"
                >
                  <Plus className="w-4 h-4 text-college-gold" /> Add Notice
                </button>
              </div>

              <div className="space-y-3">
                {announcements.map(ann => (
                  <div key={ann.id} className="p-4 border border-slate-200 rounded flex justify-between items-center bg-slate-50">
                    <div>
                      <div className="flex items-center gap-2">
                        {ann.isUrgent && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">URGENT</span>}
                        <span className="bg-college-dark text-college-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded">{ann.tag}</span>
                        <h4 className="font-bold text-sm text-college-navy">{ann.title}</h4>
                      </div>
                      {ann.link && <p className="text-xs text-slate-600 mt-1 font-mono">Target Link: {ann.link}</p>}
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">Posted: {ann.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingAnnouncement(ann)}
                        className="text-college-navy hover:bg-white p-1 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(ann.id).then(loadAllAdminData)}
                        className="text-red-600 hover:bg-white p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: IMPORTANT DATES */}
          {activeTab === 'dates' && (
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-college-navy">Important Dates & Schedule Timeline</h3>
                <button
                  onClick={() => setEditingEvent({ title: '', date: '', location: 'Sir C.R. Reddy CoE Campus', status: 'Upcoming', category: 'Internal Hackathon' })}
                  className="inline-flex items-center gap-1 bg-college-navy text-white px-3.5 py-2 rounded text-xs font-bold hover:bg-college-blue"
                >
                  <Plus className="w-4 h-4 text-college-gold" /> Add Important Date
                </button>
              </div>

              <div className="space-y-3">
                {events.map(evt => (
                  <div key={evt.id} className="p-4 border border-slate-200 rounded flex justify-between items-center bg-slate-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${evt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {evt.status}
                        </span>
                        <h4 className="font-bold text-sm text-college-navy">{evt.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">Location: {evt.location}</p>
                      <span className="text-xs font-mono font-bold text-college-gold mt-1 block">Date: {evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingEvent(evt)}
                        className="text-college-navy hover:bg-white p-1 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL: Edit/Add Result */}
        {editingResult && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <form onSubmit={handleSaveResult} className="bg-white max-w-lg w-full rounded-lg border-2 border-college-gold p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif font-bold text-lg text-college-navy border-b border-slate-200 pb-2">
                Enter / Edit Team Result & Score
              </h3>

              {registrations.length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                  <label className="font-bold text-college-navy block">Quick Select Registered Team (Auto-Fills Details):</label>
                  <select
                    value={editingResult.teamId || ''}
                    onChange={e => {
                      const selectedId = e.target.value;
                      const matched = registrations.find(r => r.id === selectedId);
                      if (matched) {
                        setEditingResult({
                          ...editingResult,
                          teamId: matched.id,
                          teamName: matched.teamName,
                          branch: matched.department,
                          problemStatement: matched.problemStatementTitle,
                          problemStatementId: matched.problemStatementId,
                          members: matched.members
                        });
                      } else {
                        setEditingResult({ ...editingResult, teamId: selectedId });
                      }
                    }}
                    className="w-full p-2 border border-slate-300 rounded bg-white font-mono text-xs font-semibold text-slate-800"
                  >
                    <option value="">-- Choose Registered Team or Type Below --</option>
                    {registrations.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.id} - {r.teamName} ({r.department})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold">Team ID / Reg Code *</label>
                  <input
                    required
                    placeholder="e.g. SIH-2026-3128"
                    value={editingResult.teamId || ''}
                    onChange={e => {
                      const id = e.target.value;
                      const matched = registrations.find(r => r.id.toLowerCase() === id.toLowerCase());
                      if (matched) {
                        setEditingResult({
                          ...editingResult,
                          teamId: id,
                          teamName: matched.teamName,
                          branch: matched.department,
                          problemStatement: matched.problemStatementTitle,
                          problemStatementId: matched.problemStatementId,
                          members: matched.members
                        });
                      } else {
                        setEditingResult({ ...editingResult, teamId: id });
                      }
                    }}
                    className="w-full p-2 border rounded font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold">Team Name *</label>
                  <input
                    required
                    placeholder="e.g. InnovateX CRR"
                    value={editingResult.teamName || ''}
                    onChange={e => setEditingResult({ ...editingResult, teamName: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-bold">Department / Branch *</label>
                  <input required value={editingResult.branch || ''} onChange={e => setEditingResult({ ...editingResult, branch: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="font-bold">National Rank *</label>
                  <input type="number" min={1} required value={editingResult.rank || 1} onChange={e => setEditingResult({ ...editingResult, rank: parseInt(e.target.value) })} className="w-full p-2 border rounded font-mono font-bold" />
                </div>
                <div>
                  <label className="font-bold">Score (Out of 100)</label>
                  <input type="number" min={0} max={100} step={0.5} required value={editingResult.score || 0} onChange={e => setEditingResult({ ...editingResult, score: parseFloat(e.target.value) })} className="w-full p-2 border rounded font-mono font-bold text-college-navy" />
                </div>
                <div>
                  <label className="font-bold">Result Status</label>
                  <select value={editingResult.status || 'Qualified'} onChange={e => setEditingResult({ ...editingResult, status: e.target.value as any })} className="w-full p-2 border rounded bg-white font-bold">
                    <option value="Winner">Winner (Rank 1)</option>
                    <option value="Runner-up">Runner-up (Rank 2)</option>
                    <option value="Finalist">Finalist (Rank 3)</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Not Qualified">Not Qualified</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold">Problem Statement Title</label>
                <input value={editingResult.problemStatement || ''} onChange={e => setEditingResult({ ...editingResult, problemStatement: e.target.value })} className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="font-bold">Judges Remarks / Notes</label>
                <textarea rows={2} value={editingResult.remarks || ''} onChange={e => setEditingResult({ ...editingResult, remarks: e.target.value })} className="w-full p-2 border rounded" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditingResult(null)} className="px-4 py-2 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-college-navy text-white rounded font-bold hover:bg-college-blue">Save Result Record</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: Publish Results Confirmation */}
        {showPublishModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-xl border-2 border-college-gold p-6 space-y-4 text-xs shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-serif font-bold text-lg text-college-navy">Confirm Result Publication</h3>
                <p className="text-slate-600 leading-relaxed">
                  Are you sure you want to publish the results?
                  Once published, the results will become visible to students and the public on the Results Portal.
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button onClick={() => setShowPublishModal(false)} className="px-4 py-2 bg-slate-100 rounded font-bold">Cancel</button>
                <button onClick={() => handleTogglePublishResults(true)} className="px-5 py-2 bg-college-gold text-college-dark font-bold rounded hover:bg-college-goldLight">Yes, Publish Results Now</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Edit/Add Alumni */}
        {editingAlumni && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <form onSubmit={handleSaveAlumni} className="bg-white max-w-lg w-full rounded-lg border-2 border-college-gold p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif font-bold text-lg text-college-navy border-b border-slate-200 pb-2">
                {editingAlumni.id ? 'Edit Alumni Record' : 'Add New Alumni Record'}
              </h3>

              {/* Photo Upload Section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <label className="block font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-college-gold" />
                  <span>Alumni Profile Photo</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {editingAlumni.photoUrl ? (
                    <div className="relative w-16 h-16 rounded border border-slate-300 overflow-hidden shrink-0 shadow-xs">
                      <img src={editingAlumni.photoUrl} alt="Alumni Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setEditingAlumni({ ...editingAlumni, photoUrl: '' })}
                        className="absolute top-0 right-0 bg-red-600 text-white text-[9px] p-0.5"
                        title="Remove Photo"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  <div className="space-y-1.5 w-full">
                    <label className="inline-flex items-center gap-1.5 bg-college-navy hover:bg-college-blue text-white px-3 py-1.5 rounded cursor-pointer text-xs font-bold transition-colors">
                      <Upload className="w-3.5 h-3.5 text-college-gold" />
                      <span>{isUploadingPhoto ? 'Uploading Photo...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAlumniPhotoUpload}
                        className="hidden"
                        disabled={isUploadingPhoto}
                      />
                    </label>

                    <div className="text-[10px] text-slate-500">OR paste image URL directly:</div>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={editingAlumni.photoUrl || ''}
                      onChange={e => setEditingAlumni({ ...editingAlumni, photoUrl: e.target.value })}
                      className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required placeholder="Alumni Full Name" value={editingAlumni.name || ''} onChange={e => setEditingAlumni({ ...editingAlumni, name: e.target.value })} className="p-2 border rounded" />
                <input required placeholder="Department" value={editingAlumni.department || ''} onChange={e => setEditingAlumni({ ...editingAlumni, department: e.target.value })} className="p-2 border rounded" />
                <input required placeholder="Graduation Year (e.g. 2024)" value={editingAlumni.graduationYear || ''} onChange={e => setEditingAlumni({ ...editingAlumni, graduationYear: e.target.value })} className="p-2 border rounded" />
                <input required placeholder="SIH Year (e.g. 2023)" value={editingAlumni.sihYear || ''} onChange={e => setEditingAlumni({ ...editingAlumni, sihYear: e.target.value })} className="p-2 border rounded" />
                <input required placeholder="Team Name" value={editingAlumni.teamName || ''} onChange={e => setEditingAlumni({ ...editingAlumni, teamName: e.target.value })} className="p-2 border rounded" />
                <input required placeholder="Achievement (e.g. National Winner)" value={editingAlumni.achievement || ''} onChange={e => setEditingAlumni({ ...editingAlumni, achievement: e.target.value })} className="p-2 border rounded" />
              </div>
              <input placeholder="Problem Statement Title" value={editingAlumni.problemStatement || ''} onChange={e => setEditingAlumni({ ...editingAlumni, problemStatement: e.target.value })} className="w-full p-2 border rounded" />
              <input placeholder="Current Company / Organization" value={editingAlumni.company || ''} onChange={e => setEditingAlumni({ ...editingAlumni, company: e.target.value })} className="w-full p-2 border rounded" />
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditingAlumni(null)} className="px-4 py-2 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" disabled={isUploadingPhoto} className="px-5 py-2 bg-college-navy text-white rounded font-bold hover:bg-college-blue disabled:opacity-50">Save Alumni</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: Edit/Add Problem Statement */}
        {editingPs && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <form onSubmit={handleSavePs} className="bg-white max-w-lg w-full rounded-lg border-2 border-college-gold p-6 space-y-4 text-xs">
              <h3 className="font-serif font-bold text-lg text-college-navy border-b border-slate-200 pb-2">
                {editingPs.id ? 'Edit Problem Statement' : 'Add New Problem Statement'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required placeholder="PS ID (e.g. SIH1284)" value={editingPs.psId || ''} onChange={e => setEditingPs({ ...editingPs, psId: e.target.value })} className="p-2 border rounded font-mono" />
                <select value={editingPs.category || 'Software'} onChange={e => setEditingPs({ ...editingPs, category: e.target.value as any })} className="p-2 border rounded bg-white">
                  <option value="Software">Software</option>
                  <option value="Hardware">Hardware</option>
                </select>
              </div>
              <input required placeholder="Problem Statement Title" value={editingPs.title || ''} onChange={e => setEditingPs({ ...editingPs, title: e.target.value })} className="w-full p-2 border rounded" />
              <input required placeholder="Ministry / Organization" value={editingPs.organization || ''} onChange={e => setEditingPs({ ...editingPs, organization: e.target.value })} className="w-full p-2 border rounded" />
              <input required placeholder="Domain (e.g. Smart Education, Agriculture)" value={editingPs.domain || ''} onChange={e => setEditingPs({ ...editingPs, domain: e.target.value })} className="w-full p-2 border rounded" />
              <textarea rows={3} required placeholder="Description" value={editingPs.description || ''} onChange={e => setEditingPs({ ...editingPs, description: e.target.value })} className="w-full p-2 border rounded" />
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditingPs(null)} className="px-4 py-2 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-college-navy text-white rounded font-bold">Save PS</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: Edit/Add Announcement */}
        {editingAnnouncement && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <form onSubmit={handleSaveAnnouncement} className="bg-white max-w-md w-full rounded-lg border-2 border-college-gold p-6 space-y-4 text-xs">
              <h3 className="font-serif font-bold text-lg text-college-navy border-b border-slate-200 pb-2">
                {editingAnnouncement.id ? 'Edit Notice' : 'Add New Notice'}
              </h3>
              <input required placeholder="Notice Title" value={editingAnnouncement.title || ''} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })} className="w-full p-2 border rounded" />
              <div className="grid grid-cols-2 gap-2">
                <select value={editingAnnouncement.tag || 'Notice'} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, tag: e.target.value as any })} className="p-2 border rounded bg-white font-bold">
                  <option value="Notice">Notice</option>
                  <option value="Important">Important</option>
                  <option value="Result">Result</option>
                  <option value="Schedule">Schedule</option>
                </select>
                <input placeholder="Action Link URL" value={editingAnnouncement.link || ''} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, link: e.target.value })} className="p-2 border rounded font-mono" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="urgent" checked={editingAnnouncement.isUrgent || false} onChange={e => setEditingAnnouncement({ ...editingAnnouncement, isUrgent: e.target.checked })} />
                <label htmlFor="urgent" className="font-bold text-red-600">Mark as Urgent Notice</label>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditingAnnouncement(null)} className="px-4 py-2 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-college-navy text-white rounded font-bold">Save Notice</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: Edit/Add Event Date */}
        {editingEvent && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <form onSubmit={handleSaveEvent} className="bg-white max-w-md w-full rounded-lg border-2 border-college-gold p-6 space-y-4 text-xs">
              <h3 className="font-serif font-bold text-lg text-college-navy border-b border-slate-200 pb-2">
                {editingEvent.id ? 'Edit Event Date' : 'Add Important Date'}
              </h3>
              <input required placeholder="Event Title" value={editingEvent.title || ''} onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} className="w-full p-2 border rounded" />
              <input required placeholder="Date String (e.g. Sept 25, 2026)" value={editingEvent.date || ''} onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} className="w-full p-2 border rounded font-mono" />
              <input placeholder="Location (e.g. Main Auditorium)" value={editingEvent.location || ''} onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })} className="w-full p-2 border rounded" />
              <select value={editingEvent.status || 'Upcoming'} onChange={e => setEditingEvent({ ...editingEvent, status: e.target.value as any })} className="w-full p-2 border rounded bg-white font-bold">
                <option value="Upcoming">Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="TBD">TBD</option>
              </select>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditingEvent(null)} className="px-4 py-2 bg-slate-100 rounded font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-college-navy text-white rounded font-bold">Save Date</button>
              </div>
            </form>
          </div>
        )}

        {/* Registration Detail Modal */}
        {selectedReg && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white max-w-xl w-full rounded-lg border-2 border-college-gold p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <span className="font-mono font-bold text-college-gold bg-college-dark px-2 py-0.5 rounded">
                    {selectedReg.id}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-college-navy mt-1">{selectedReg.teamName}</h3>
                </div>
                <button onClick={() => setSelectedReg(null)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                <div><strong>Leader:</strong> {selectedReg.leaderName}</div>
                <div><strong>Email:</strong> {selectedReg.leaderEmail}</div>
                <div><strong>Phone:</strong> {selectedReg.leaderPhone}</div>
                <div><strong>Department:</strong> {selectedReg.department} ({selectedReg.year})</div>
                <div><strong>PS ID:</strong> <span className="font-mono font-bold text-college-gold">{selectedReg.problemStatementId}</span></div>
                <div><strong>Faculty Mentor:</strong> {selectedReg.facultyMentor || 'N/A'}</div>
              </div>

              <div>
                <strong>Problem Statement Title:</strong>
                <p className="p-2 bg-slate-50 rounded border border-slate-200 mt-1">{selectedReg.problemStatementTitle}</p>
              </div>

              {selectedReg.pptFileName ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="font-bold text-amber-900 block">Uploaded Presentation:</span>
                    <span className="font-mono text-xs text-amber-800">{selectedReg.pptFileName}</span>
                    {selectedReg.pptUrl?.startsWith('local-file://') && (
                      <span className="text-[11px] font-bold text-red-600 block mt-0.5">
                        ⚠️ File was saved in local fallback mode. Please re-upload to Cloudinary below.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {selectedReg.pptUrl && !selectedReg.pptUrl.startsWith('local-file://') && (
                      <a
                        href={getCloudinaryDownloadUrl(selectedReg.pptUrl, selectedReg.pptFileName)}
                        download={selectedReg.pptFileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-college-navy text-white px-3 py-1.5 rounded font-bold text-[11px] flex items-center gap-1 hover:bg-college-blue transition-colors shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PPT
                      </a>
                    )}

                    <label className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-white" />
                      <span>{isAdminUploadingPPT ? 'Uploading...' : 'Re-upload PPT'}</span>
                      <input
                        type="file"
                        accept=".ppt,.pptx"
                        onChange={handleAdminPPTUpload}
                        disabled={isAdminUploadingPPT}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                  <span className="text-slate-500 font-italic">No PPT presentation uploaded yet for this team.</span>
                  <label className="bg-college-navy hover:bg-college-blue text-white px-3 py-1.5 rounded font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-college-gold" />
                    <span>{isAdminUploadingPPT ? 'Uploading...' : 'Upload PPT'}</span>
                    <input
                      type="file"
                      accept=".ppt,.pptx"
                      onChange={handleAdminPPTUpload}
                      disabled={isAdminUploadingPPT}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div>
                <strong className="block mb-2">Team Members ({selectedReg.members?.length || 0}):</strong>
                <div className="space-y-1.5">
                  {selectedReg.members?.map((m, idx) => (
                    <div key={idx} className="p-2 bg-slate-100 rounded flex justify-between items-center">
                      <div>
                        <span className="font-bold">{m.name}</span> {m.isLeader && <span className="text-[9px] bg-college-gold text-college-dark font-bold px-1 rounded">LEADER</span>}
                        <span className="text-[11px] text-slate-500 block">{m.email} • {m.phone}</span>
                      </div>
                      <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border">{m.rollNumber} ({m.department})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <button
                  onClick={() => handlePopulateResultFromReg(selectedReg)}
                  className="bg-college-gold text-college-dark px-4 py-2 rounded font-bold flex items-center gap-1"
                >
                  <Trophy className="w-4 h-4" /> Enter Team Result
                </button>

                <div className="flex gap-2">
                  <button onClick={() => setSelectedReg(null)} className="px-4 py-2 bg-slate-100 rounded font-bold">Close</button>
                  <button onClick={() => handleDeleteRegistration(selectedReg.id).then(() => setSelectedReg(null))} className="px-4 py-2 bg-red-600 text-white rounded font-bold">Delete Registration</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
