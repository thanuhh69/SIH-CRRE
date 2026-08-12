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
  LogOut 
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

  // Forms Modal state for CRUD
  const [editingAlumni, setEditingAlumni] = useState<Partial<Alumni> | null>(null);
  const [editingPs, setEditingPs] = useState<Partial<ProblemStatement> | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Partial<Announcement> | null>(null);

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
    
    const headers = ['Registration ID', 'Team Name', 'Leader Name', 'Email', 'Phone', 'Department', 'Year', 'PS ID', 'PS Title', 'PPT File', 'Status', 'Submitted At'];
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
      `"${r.pptFileName || 'N/A'}"`,
      r.status,
      r.submittedAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SIH_2026_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Computed metrics
  const totalTeams = registrations.length;
  const totalParticipants = registrations.reduce((acc, r) => acc + (r.members ? r.members.length : 1), 0);
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.teamName.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.leaderName.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.department.toLowerCase().includes(regSearch.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="bg-white rounded-lg border-2 border-college-gold p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-college-navy text-college-gold flex items-center justify-center mx-auto border-2 border-college-gold">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="font-serif font-bold text-2xl text-college-navy">Admin Portal Login</h1>
              <p className="text-slate-500 text-xs">
                Sir C.R. Reddy CoE – SIH 2026 Management System
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Administrator Passcode / Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Enter admin passcode (e.g. admin123)"
                    value={passcode}
                    onChange={e => setPasscode(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy outline-none font-mono"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  Demo Passcode: <span className="font-bold text-college-navy">admin123</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-college-navy hover:bg-college-blue text-white font-bold text-xs py-3 rounded shadow transition-colors border border-college-gold/30"
              >
                LOG IN TO DASHBOARD
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top Admin Header */}
      <header className="bg-college-dark text-white px-6 py-4 border-b-4 border-college-gold flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-college-navy border border-college-gold flex items-center justify-center text-college-gold font-bold text-sm">
            CRR
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-white">SIH 2026 Admin Dashboard</h1>
            <div className="text-[11px] text-college-gold">Sir C.R. Reddy College of Engineering (Autonomous)</div>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-semibold"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Teams</div>
              <div className="font-serif font-extrabold text-3xl text-college-navy mt-1">{totalTeams}</div>
            </div>
            <div className="w-12 h-12 rounded bg-blue-50 text-college-navy flex items-center justify-center border border-blue-200">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Participants</div>
              <div className="font-serif font-extrabold text-3xl text-college-accent mt-1">{totalParticipants}</div>
            </div>
            <div className="w-12 h-12 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Screening</div>
              <div className="font-serif font-extrabold text-3xl text-amber-600 mt-1">{pendingCount}</div>
            </div>
            <div className="w-12 h-12 rounded bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Approved Teams</div>
              <div className="font-serif font-extrabold text-3xl text-emerald-600 mt-1">{approvedCount}</div>
            </div>
            <div className="w-12 h-12 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Admin Management Navigation Tabs */}
        <div className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm">
          <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50">
            {[
              { id: 'registrations', label: 'Team Registrations', icon: Users },
              { id: 'alumni', label: 'Alumni Showcase', icon: ShieldCheck },
              { id: 'problems', label: 'Problem Statements', icon: BookOpen },
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
                  onClick={() => setEditingAlumni({ name: '', department: 'Computer Science & Engineering', graduationYear: '2024', sihYear: '2023', teamName: '', problemStatement: '', achievement: '' })}
                  className="inline-flex items-center gap-1 bg-college-navy text-white px-3 py-1.5 rounded text-xs font-bold"
                >
                  <Plus className="w-4 h-4 text-college-gold" /> Add Alumni Record
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alumniList.map(item => (
                  <div key={item.id} className="p-4 border border-slate-200 rounded flex justify-between items-start bg-slate-50">
                    <div>
                      <h4 className="font-bold text-sm text-college-navy">{item.name}</h4>
                      <p className="text-xs text-slate-600">{item.department} | SIH {item.sihYear}</p>
                      <p className="text-[11px] text-college-accent mt-1 font-semibold">Achievement: {item.achievement}</p>
                    </div>
                    <button
                      onClick={() => deleteAlumni(item.id).then(loadAllAdminData)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                  onClick={() => setEditingPs({ psId: 'SIH-NEW', title: '', organization: '', category: 'Software', domain: '', description: '' })}
                  className="inline-flex items-center gap-1 bg-college-navy text-white px-3 py-1.5 rounded text-xs font-bold"
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
                      <p className="text-xs text-slate-600">{ps.organization} | Category: {ps.category}</p>
                    </div>
                    <button
                      onClick={() => deleteProblemStatement(ps.id).then(loadAllAdminData)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VIDEO MANAGEMENT */}
          {activeTab === 'video' && videoData && (
            <div className="p-6 space-y-4 max-w-xl">
              <h3 className="font-serif font-bold text-base text-college-navy">Main Promotional Video Settings</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Video Title</label>
                  <input
                    type="text"
                    value={videoData.title}
                    onChange={e => setVideoData({ ...videoData, title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Video URL (YouTube or Storage)</label>
                  <input
                    type="text"
                    value={videoData.videoUrl}
                    onChange={e => setVideoData({ ...videoData, videoUrl: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
                <button
                  onClick={() => saveMainVideo(videoData).then(() => alert('Video settings saved!'))}
                  className="bg-college-navy text-white px-4 py-2 rounded font-bold text-xs"
                >
                  Save Video Configuration
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="p-6 space-y-4">
              <h3 className="font-serif font-bold text-base text-college-navy">College Notice Board Notices</h3>
              <div className="space-y-3">
                {announcements.map(ann => (
                  <div key={ann.id} className="p-3 border border-slate-200 rounded flex justify-between items-center bg-slate-50 text-xs">
                    <span className="font-medium text-slate-800">{ann.title}</span>
                    <button
                      onClick={() => deleteAnnouncement(ann.id).then(loadAllAdminData)}
                      className="text-red-600 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
