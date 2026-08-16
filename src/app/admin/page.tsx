'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  getRegistrations, 
  updateRegistrationStatus, 
  deleteRegistration, 
  getAlumni, 
  saveAlumni, 
  deleteAlumni,
  getProblemStatements,
  saveProblemStatement,
  deleteProblemStatement,
  getAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  getEventDates,
  saveEventDate,
  getMainVideo,
  saveMainVideo
} from '@/lib/firestore';
import { 
  TeamRegistration, 
  Alumni, 
  ProblemStatement, 
  Announcement, 
  EventDate, 
  VideoItem 
} from '@/types';
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
  Edit2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'registrations' | 'alumni' | 'problems' | 'video' | 'announcements' | 'dates'>('registrations');

  // Data States
  const [registrations, setRegistrations] = useState<TeamRegistration[]>([]);
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventDate[]>([]);
  const [videoData, setVideoData] = useState<VideoItem | null>(null);

  // Filters & Search
  const [regSearch, setRegSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'pending' | 'approved' | 'rejected'>('ALL');
  const [selectedReg, setSelectedReg] = useState<TeamRegistration | null>(null);

  // Modal States for Add/Edit
  const [editingAlumni, setEditingAlumni] = useState<Partial<Alumni> | null>(null);
  const [editingPs, setEditingPs] = useState<Partial<ProblemStatement> | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Partial<Announcement> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<EventDate> | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllAdminData();
    }
  }, [isAuthenticated]);

  const loadAllAdminData = async () => {
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
    const vid = await getMainVideo();
    setVideoData(vid);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode.length >= 4) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin passcode. Default demo passcode is "admin123".');
    }
  };

  // Actions
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

  const exportCSV = () => {
    if (registrations.length === 0) return;
    const headers = ['Registration ID', 'Team Name', 'Leader Name', 'Leader Email', 'Leader Phone', 'Department', 'Year', 'PS ID', 'PS Title', 'Status', 'Submitted At'];
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
      r.submittedAt
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
      date: editingEvent.date || 'TBA 2026',
      location: editingEvent.location || 'Sir C.R. Reddy CoE Campus',
      isTBD: editingEvent.isTBD || false,
      status: editingEvent.status || 'Upcoming',
      category: (editingEvent.category as any) || 'Internal Hackathon'
    };
    await saveEventDate(newEvt);
    setEditingEvent(null);
    loadAllAdminData();
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-lg border-2 border-college-gold p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-college-navy text-college-gold flex items-center justify-center mx-auto border-2 border-college-gold">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-college-navy">Admin Portal Authentication</h2>
              <p className="text-xs text-slate-600">Sir C.R. Reddy College of Engineering · SIH 2026 Internal Portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <KeyRound className="w-4 h-4 text-college-gold" /> Enter Admin Passcode
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter passcode (Default: admin123)"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-college-navy outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-college-navy hover:bg-college-blue text-white py-3 rounded text-xs font-bold tracking-wider transition-colors shadow-md border border-college-gold/30"
              >
                ACCESS ADMIN DASHBOARD →
              </button>
            </form>

            <div className="text-[11px] text-slate-500 text-center bg-slate-50 p-2.5 rounded border border-slate-200">
              🔒 Protected Portal for College Steering Committee & Departmental Coordinators.
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
        <div className="bg-college-dark text-white p-6 rounded-lg border-b-4 border-college-gold shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-college-gold tracking-widest uppercase">
              SIH 2026 INTERNAL HACKATHON
            </div>
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-white mt-1">
              College Steering Dashboard
            </h1>
            <p className="text-slate-300 text-xs mt-1">
              Managing Team Registrations, Screening Approvals, Problem Statements & Media.
            </p>
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold transition-colors shadow-xs"
          >
            <LogOut className="w-4 h-4" /> Logout Session
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-slate-500 text-xs font-semibold">Total Teams Registered</div>
              <div className="font-serif font-bold text-2xl text-college-navy mt-1">{registrations.length}</div>
            </div>
            <div className="w-10 h-10 rounded bg-blue-50 text-college-navy flex items-center justify-center border border-blue-200">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-slate-500 text-xs font-semibold">Total Participants</div>
              <div className="font-serif font-bold text-2xl text-college-navy mt-1">{totalParticipants}</div>
            </div>
            <div className="w-10 h-10 rounded bg-purple-50 text-purple-900 flex items-center justify-center border border-purple-200">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-slate-500 text-xs font-semibold">Pending Screening</div>
              <div className="font-serif font-bold text-2xl text-amber-600 mt-1">{pendingCount}</div>
            </div>
            <div className="w-10 h-10 rounded bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-slate-500 text-xs font-semibold">Approved Teams</div>
              <div className="font-serif font-bold text-2xl text-emerald-600 mt-1">{approvedCount}</div>
            </div>
            <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm">
          <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50">
            {[
              { id: 'registrations', label: 'Team Registrations', icon: Users },
              { id: 'alumni', label: 'Alumni Showcase', icon: ShieldCheck },
              { id: 'problems', label: 'Problem Statements', icon: BookOpen },
              { id: 'video', label: 'About SIH Video', icon: Film },
              { id: 'announcements', label: 'Notice Board', icon: Bell },
              { id: 'dates', label: 'Important Dates', icon: Calendar },
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
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
                    className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-medium"
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
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-college-navy">{reg.id}</td>
                        <td className="p-3 font-bold text-slate-800">{reg.teamName}</td>
                        <td className="p-3">{reg.leaderName} ({reg.leaderPhone})</td>
                        <td className="p-3">{reg.department}</td>
                        <td className="p-3 font-mono">{reg.problemStatementId}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            reg.status === 'approved' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : reg.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {reg.status !== 'approved' && (
                            <button
                              onClick={() => handleStatusChange(reg.id, 'approved')}
                              className="p-1.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                              title="Approve Team"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {reg.status !== 'rejected' && (
                            <button
                              onClick={() => handleStatusChange(reg.id, 'rejected')}
                              className="p-1.5 rounded bg-red-100 hover:bg-red-200 text-red-800"
                              title="Reject Team"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteRegistration(reg.id)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-red-600 hover:text-white text-slate-500"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ALUMNI CRUD */}
          {activeTab === 'alumni' && (
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-college-navy">SIH Alumni Records</h3>
                <button
                  onClick={() => setEditingAlumni({ name: '', department: 'Computer Science & Engineering', graduationYear: '2024', sihYear: '2023', teamName: '', problemStatement: '', achievement: 'Grand Finale Winner' })}
                  className="inline-flex items-center gap-1 bg-college-navy text-white px-3.5 py-2 rounded text-xs font-bold hover:bg-college-blue"
                >
                  <Plus className="w-4 h-4 text-college-gold" /> Add Alumni Record
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alumniList.map(item => (
                  <div key={item.id} className="p-4 border border-slate-200 rounded flex justify-between items-start bg-slate-50">
                    <div>
                      <h4 className="font-bold text-sm text-college-navy">{item.name}</h4>
                      <p className="text-xs text-slate-600">{item.department} ({item.graduationYear}) | SIH {item.sihYear}</p>
                      <p className="text-[11px] text-college-accent mt-1 font-semibold">Team: {item.teamName}</p>
                      <p className="text-[11px] text-amber-800 font-medium">Achievement: {item.achievement}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingAlumni(item)}
                        className="text-college-navy hover:text-college-blue p-1"
                        title="Edit Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAlumni(item.id).then(loadAllAdminData)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROBLEM STATEMENTS CRUD */}
          {activeTab === 'problems' && (
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-college-navy">Problem Statements Catalog</h3>
                <button
                  onClick={() => setEditingPs({ psId: 'SIH1500', title: '', organization: '', category: 'Software', domain: 'Smart Education', description: '' })}
                  className="inline-flex items-center gap-1 bg-college-navy text-white px-3.5 py-2 rounded text-xs font-bold hover:bg-college-blue"
                >
                  <Plus className="w-4 h-4 text-college-gold" /> Add Problem Statement
                </button>
              </div>

              <div className="space-y-3">
                {problems.map(ps => (
                  <div key={ps.id} className="p-4 border border-slate-200 rounded flex justify-between items-start bg-slate-50">
                    <div>
                      <div className="font-mono text-xs font-bold text-college-gold bg-college-dark px-2 py-0.5 rounded inline-block">
                        PS ID: {ps.psId}
                      </div>
                      <h4 className="font-bold text-sm text-college-navy mt-1">{ps.title}</h4>
                      <p className="text-xs text-slate-600">{ps.organization} | Category: {ps.category} | Domain: {ps.domain}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPs(ps)}
                        className="text-college-navy hover:text-college-blue p-1"
                        title="Edit Problem Statement"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProblemStatement(ps.id).then(loadAllAdminData)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Problem Statement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT SIH VIDEO MANAGEMENT */}
          {activeTab === 'video' && videoData && (
            <div className="p-6 space-y-4 max-w-xl">
              <h3 className="font-serif font-bold text-base text-college-navy">About SIH Video Configuration</h3>
              <p className="text-xs text-slate-500">
                This video is embedded directly inside the <strong>About SIH</strong> section across the website.
              </p>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Video Title</label>
                  <input
                    type="text"
                    value={videoData.title}
                    onChange={e => setVideoData({ ...videoData, title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Video URL (YouTube Embed or Storage Link)</label>
                  <input
                    type="text"
                    value={videoData.videoUrl}
                    onChange={e => setVideoData({ ...videoData, videoUrl: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-700">Video Description</label>
                  <textarea
                    rows={3}
                    value={videoData.description}
                    onChange={e => setVideoData({ ...videoData, description: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <button
                  onClick={() => saveMainVideo(videoData).then(() => alert('Video configuration updated! It is now live in the About SIH section.'))}
                  className="bg-college-navy text-white px-5 py-2.5 rounded font-bold text-xs hover:bg-college-blue"
                >
                  Save Video Configuration
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: NOTICE BOARD CRUD */}
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

          {/* TAB 6: IMPORTANT DATES CRUD */}
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

        {/* MODAL: Edit/Add Alumni */}
        {editingAlumni && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <form onSubmit={handleSaveAlumni} className="bg-white max-w-lg w-full rounded-lg border-2 border-college-gold p-6 space-y-4 text-xs">
              <h3 className="font-serif font-bold text-lg text-college-navy border-b border-slate-200 pb-2">
                {editingAlumni.id ? 'Edit Alumni Record' : 'Add New Alumni Record'}
              </h3>
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
                <button type="submit" className="px-5 py-2 bg-college-navy text-white rounded font-bold">Save Alumni</button>
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
                  <h3 className="font-serif font-bold text-lg text-college-navy mt-1">
                    Team: {selectedReg.teamName}
                  </h3>
                </div>
                <button onClick={() => setSelectedReg(null)} className="text-slate-400 font-bold text-base">✕</button>
              </div>

              <div className="space-y-2">
                <div><strong>Leader:</strong> {selectedReg.leaderName} ({selectedReg.leaderEmail} | {selectedReg.leaderPhone})</div>
                <div><strong>Department:</strong> {selectedReg.department} ({selectedReg.year})</div>
                <div><strong>Problem Statement:</strong> [{selectedReg.problemStatementId}] {selectedReg.problemStatementTitle}</div>
                {selectedReg.facultyMentor && <div><strong>Faculty Mentor:</strong> {selectedReg.facultyMentor}</div>}
                {selectedReg.pptFileName && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded font-semibold text-slate-800 flex items-center justify-between">
                    <span>📄 Submitted PPT: <strong className="font-mono text-college-navy">{selectedReg.pptFileName}</strong></span>
                    {selectedReg.pptUrl && (
                      <a 
                        href={selectedReg.pptUrl} 
                        download={selectedReg.pptFileName} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-college-navy underline hover:text-college-gold text-xs font-bold"
                      >
                        Download PPT
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-3">
                <strong className="block mb-2 font-serif text-college-navy">Team Members ({selectedReg.members?.length || 0}):</strong>
                <ul className="space-y-1 bg-slate-50 p-3 rounded border border-slate-200 font-mono">
                  {selectedReg.members?.map((m, idx) => (
                    <li key={idx}>
                      #{idx + 1}: {m.name} ({m.rollNumber}) - {m.department} {m.isLeader ? '[Leader]' : ''}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button onClick={() => setSelectedReg(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded font-bold">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
