'use client';

import React, { useState, useEffect } from 'react';
import { createRegistration, subscribeSamplePPT } from '@/lib/firestore';
import { TeamMember, TeamRegistration, SamplePPTResource } from '@/types';
import { getCloudinaryDownloadUrl } from '@/lib/storage';
import { 
  CheckCircle2, 
  User, 
  Plus, 
  Trash2, 
  Printer, 
  ShieldCheck,
  AlertCircle,
  Download,
  FileText,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_SAMPLE_PPT: SamplePPTResource = {
  fileName: 'SIH2025-IDEA-Presentation-Format.pptx',
  downloadURL: 'https://sih.gov.in/letters/SIH2025-IDEA-Presentation-Format.pptx',
  storagePath: 'sih-crre/registration-files/SIH2025-IDEA-Presentation-Format.pptx',
  fileSize: 262144,
  uploadedAt: new Date().toISOString(),
  uploadedBy: 'Admin Committee',
  version: '1.0',
  published: true
};

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Information Technology',
  'Electrical & Electronics Engineering',
  'Artificial Intelligence & Data Science',
  'Artificial Intelligence & Machine Learning',
  'Cyber Security',
  'Mechanical Engineering',
  'Civil Engineering',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [submittedRegistration, setSubmittedRegistration] = useState<TeamRegistration | null>(null);
  const [samplePPT, setSamplePPT] = useState<SamplePPTResource | null>(DEFAULT_SAMPLE_PPT);

  // Form State
  const [teamName, setTeamName] = useState('');
  const [problemStatementId, setProblemStatementId] = useState('');
  const [problemStatementTitle, setProblemStatementTitle] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderRollNumber, setLeaderRollNumber] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [year, setYear] = useState(YEARS[2]);

  // Team Members State (Minimum leader + optional 5 extra members)
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeSamplePPT((ppt) => {
      if (ppt && ppt.published) {
        setSamplePPT(ppt);
      } else {
        setSamplePPT(DEFAULT_SAMPLE_PPT);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddMember = () => {
    if (members.length >= 5) {
      alert('Maximum team size allowed in SIH is 6 members (Leader + 5 Members).');
      return;
    }
    setMembers([
      ...members,
      { name: '', email: '', phone: '', rollNumber: '', department: DEPARTMENTS[0], year: YEARS[2] }
    ]);
  };

  const handleRemoveMember = (index: number) => {
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName || !problemStatementId || !problemStatementTitle || !leaderName || !leaderEmail || !leaderPhone || !leaderRollNumber) {
      alert('Please fill in all mandatory fields: Team Name, SIH Problem Statement ID, Problem Statement Title, and Team Leader details.');
      return;
    }

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name || !m.email || !m.phone || !m.rollNumber) {
        alert(`Please fill in all mandatory details (Full Name, Email, Mobile Number, Roll Number) for Member #${i + 2}.`);
        return;
      }
    }

    const fullMembersList: TeamMember[] = [
      {
        name: leaderName,
        email: leaderEmail,
        phone: leaderPhone,
        rollNumber: leaderRollNumber,
        department,
        year,
        isLeader: true,
      },
      ...members
    ];

    setLoading(true);

    try {
      const result = await createRegistration({
        teamName,
        problemStatementId,
        problemStatementTitle,
        leaderName,
        leaderEmail,
        leaderPhone,
        department,
        year,
        members: fullMembersList,
      });

      setSubmittedRegistration(result);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        // Safe fallback if confetti isn't supported
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed. Please check network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success Confirmation Screen
  if (submittedRegistration) {
    return (
      <div className="bg-white rounded-lg border border-slate-300 shadow-college-lg p-6 md:p-10 space-y-6 text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
            Registration Successful
          </span>
          <h2 className="font-serif font-extrabold text-2xl md:text-3xl text-college-navy">
            Team Registration Confirmed!
          </h2>
          <p className="text-slate-600 text-xs md:text-sm max-w-xl mx-auto">
            Your team registration has been recorded into the Sir C.R. Reddy CoE Internal Hackathon 2026 database.
          </p>
        </div>

        {/* Confirmation Details Card */}
        <div className="bg-gradient-to-b from-college-dark via-slate-900 to-college-dark text-white p-6 rounded-lg border-2 border-college-gold/60 max-w-xl mx-auto shadow-xl text-left space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-xs font-mono text-college-gold font-bold">REGISTRATION ID</span>
            <span className="font-mono text-xl font-extrabold text-college-goldLight tracking-wider">
              {submittedRegistration.id}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Team Name:</span>
              <p className="font-bold text-white text-sm">{submittedRegistration.teamName}</p>
            </div>
            <div>
              <span className="text-slate-400">Team Leader:</span>
              <p className="font-bold text-white text-sm">{submittedRegistration.leaderName}</p>
            </div>
            <div>
              <span className="text-slate-400">Total Team Members:</span>
              <p className="text-white font-semibold">{submittedRegistration.members?.length || 1} Members</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2 text-left max-w-xl mx-auto">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Next Steps for Hackathon Screening:</p>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 text-amber-800">
              <li>Save your Registration ID: <strong>{submittedRegistration.id}</strong></li>
              <li>Prepare your 8-slide pitch presentation using the official college SIH template.</li>
              <li>Report to campus evaluation venue on 15th September 2026.</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 bg-college-navy text-white px-6 py-2.5 rounded font-bold text-xs hover:bg-college-blue transition-colors shadow-md border border-college-gold/30"
          >
            <Printer className="w-4 h-4 text-college-gold" />
            <span>PRINT CONFIRMATION SLIP</span>
          </button>

          <button
            onClick={() => {
              setSubmittedRegistration(null);
              setTeamName('');
              setLeaderName('');
              setLeaderEmail('');
              setLeaderPhone('');
              setLeaderRollNumber('');
              setMembers([]);
            }}
            className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-2.5 rounded font-bold text-xs hover:bg-slate-200 transition-colors border border-slate-300"
          >
            <span>REGISTER ANOTHER TEAM</span>
          </button>
        </div>
      </div>
    );
  }

  const activePPT = DEFAULT_SAMPLE_PPT;

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-college-lg overflow-hidden">
      {/* Form Header */}
      <div className="bg-college-dark text-white p-6 md:p-8 border-b-4 border-college-gold">
        <div className="flex items-center gap-2 text-college-gold text-xs font-bold font-mono tracking-widest uppercase mb-1">
          <ShieldCheck className="w-4 h-4" /> OFFICIAL COLLEGE FORM
        </div>
        <h2 className="font-serif font-bold text-2xl md:text-3xl text-white">
          SIH Internal Hackathon 2026 – Team Registration
        </h2>
        <p className="text-slate-300 text-xs md:text-sm mt-1">
          Register your team to participate in the campus internal evaluation round.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        
        {/* OFFICIAL PRESENTATION TEMPLATE BANNER */}
        <div className="bg-gradient-to-r from-college-navy via-slate-900 to-college-blue text-white p-5 rounded-lg border-2 border-college-gold/40 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-college-gold text-xs font-bold font-mono uppercase tracking-wider">
                <FileText className="w-4 h-4" /> OFFICIAL PRESENTATION TEMPLATE
              </div>
              <p className="text-xs text-slate-200">
                Download the official SIH Internal Hackathon presentation template before preparing your team presentation.
              </p>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300 pt-1">
                <span><strong>Version:</strong> {activePPT.version || '1.0'}</span>
                <span>•</span>
                <span className="truncate max-w-[220px]"><strong>File:</strong> {activePPT.fileName}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.open('https://sih.gov.in/letters/SIH2025-IDEA-Presentation-Format.pptx', '_blank');
              }}
              className="shrink-0 inline-flex items-center gap-2 bg-college-gold hover:bg-college-goldLight text-college-dark px-4 py-2.5 rounded font-bold text-xs shadow-md transition-all border border-amber-300 hover:scale-105 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>📥 DOWNLOAD SAMPLE PPT</span>
            </button>
          </div>
        </div>

        {/* Section 1: Team Identity Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-6 h-6 rounded-full bg-college-gold text-college-dark flex items-center justify-center font-bold text-xs">1</span>
            <h3 className="font-serif font-bold text-base text-college-navy uppercase tracking-wide">
              Team Identity Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cyber Crusaders"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-college-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                SIH Problem Statement ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SIH1234"
                value={problemStatementId}
                onChange={e => setProblemStatementId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-college-navy font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Problem Statement Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter the complete problem statement title"
                value={problemStatementTitle}
                onChange={e => setProblemStatementTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-college-navy"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Team Leader Information */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <span className="w-6 h-6 rounded-full bg-college-navy text-white flex items-center justify-center font-bold text-xs">2</span>
            <h3 className="font-serif font-bold text-base text-college-navy uppercase tracking-wide">
              Team Leader Details (Member #1 - Primary Contact)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sowmya Gadi"
                value={leaderName}
                onChange={e => setLeaderName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-college-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. leader@sircrrcoestd.in"
                value={leaderEmail}
                onChange={e => setLeaderEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-college-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number (WhatsApp) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9014521289"
                value={leaderPhone}
                onChange={e => setLeaderPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-college-navy font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 21B91A0501"
                value={leaderRollNumber}
                onChange={e => setLeaderRollNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-college-navy font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department <span className="text-red-600">*</span>
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy outline-none bg-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Year of Study <span className="text-red-600">*</span>
              </label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy outline-none bg-white"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Dynamic Additional Team Members */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-serif font-bold text-base text-college-navy flex items-center gap-2">
              <User className="w-5 h-5 text-college-gold" /> 3. Additional Team Members ({members.length}/5)
            </h3>
            <button
              type="button"
              onClick={handleAddMember}
              className="inline-flex items-center gap-1 bg-college-navy text-white hover:bg-college-blue px-3 py-1.5 rounded text-xs font-bold transition-colors"
            >
              <Plus className="w-4 h-4 text-college-gold" />
              <span>Add Member</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 italic">
            * Official SIH guidelines recommend 6 total members (including 1 female member).
          </p>

          {members.map((member, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded border border-slate-300 relative space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-college-navy font-mono">
                  Member #{index + 2}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="text-red-600 hover:text-red-800 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={member.name}
                    onChange={e => handleMemberChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-college-navy"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Email ID <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@sircrrcoestd.in"
                    value={member.email}
                    onChange={e => handleMemberChange(index, 'email', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-college-navy"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={member.phone}
                    onChange={e => handleMemberChange(index, 'phone', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white outline-none focus:ring-1 focus:ring-college-navy"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                    Roll Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 21B91A0502"
                    value={member.rollNumber}
                    onChange={e => handleMemberChange(index, 'rollNumber', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-mono outline-none focus:ring-1 focus:ring-college-navy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-slate-500">
            By submitting this form, you confirm that all details are accurate per Sir C.R. Reddy CoE guidelines.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-college-gold via-amber-500 to-college-gold text-college-dark font-extrabold px-8 py-3.5 rounded text-xs tracking-wider shadow-lg hover:brightness-110 transition-all border border-amber-300 disabled:opacity-50"
          >
            {loading ? (
              <span>PROCESSING REGISTRATION...</span>
            ) : (
              <>
                <span>SUBMIT TEAM REGISTRATION</span>
                <Sparkles className="w-4 h-4 text-college-dark" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
