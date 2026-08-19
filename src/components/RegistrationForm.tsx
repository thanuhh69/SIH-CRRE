'use client';

import { createRegistration, getProblemStatements, subscribeSamplePPT } from '@/lib/firestore';
import { ProblemStatement, TeamMember, TeamRegistration, SamplePPTResource } from '@/types';
import { 
  CheckCircle2, 
  Users, 
  User, 
  Mail, 
  Phone, 
  Building, 
  BookOpen, 
  FileCode, 
  Plus, 
  Trash2, 
  Printer, 
  Sparkles, 
  ShieldCheck,
  AlertCircle,
  Download,
  FileText
} from 'lucide-react';
import PptUploadSection from '@/components/PptUploadSection';
import confetti from 'canvas-confetti';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Information Technology',
  'Electrical & Electronics Engineering',
  'Artificial Intelligence & Data Science',
  'Mechanical Engineering',
  'Civil Engineering',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function RegistrationForm() {
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>([]);
  const [loading, setLoading] = useState(false);
  const [submittedRegistration, setSubmittedRegistration] = useState<TeamRegistration | null>(null);
  const [samplePPT, setSamplePPT] = useState<SamplePPTResource | null>(null);

  // Form State
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderRollNumber, setLeaderRollNumber] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [year, setYear] = useState(YEARS[2]);
  const [selectedPsId, setSelectedPsId] = useState('');
  const [facultyMentor, setFacultyMentor] = useState('');

  // PPT Upload State
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [pptFileUrl, setPptFileUrl] = useState<string | null>(null);
  const [pptError, setPptError] = useState<string | null>(null);

  // Team Members State (Minimum leader + optional 5 extra members)
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    getProblemStatements().then(data => {
      setProblemStatements(data);
      if (data.length > 0) setSelectedPsId(data[0].psId);
    });

    const unsubscribe = subscribeSamplePPT((ppt) => {
      setSamplePPT(ppt);
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
    setMembers(members.filter((_, idx) => idx !== index));
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPptError(null);

    if (!teamName || !leaderName || !leaderEmail || !leaderPhone || !leaderRollNumber) {
      alert('Please fill in all mandatory Team Leader fields.');
      return;
    }

    if (!pptFile) {
      setPptError('Please select and upload your Problem Statement PPT (.ppt or .pptx) before submitting.');
      const element = document.getElementById('ppt-upload-section');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const selectedPs = problemStatements.find(p => p.psId === selectedPsId);
    const psTitle = selectedPs ? selectedPs.title : 'Selected Problem Statement';

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
      // Upload PPT file to Storage / base64 fallback
      let uploadedUrl = pptFileUrl || '';
      if (pptFile) {
        const { uploadFileWithFallback } = await import('@/lib/storage');
        uploadedUrl = await uploadFileWithFallback(pptFile, 'registration-files');
      }

      const result = await createRegistration({
        teamName,
        leaderName,
        leaderEmail,
        leaderPhone,
        department,
        year,
        problemStatementId: selectedPsId,
        problemStatementTitle: psTitle,
        facultyMentor,
        members: fullMembersList,
        pptUrl: uploadedUrl,
        pptFileName: pptFile.name,
      });

      setSubmittedRegistration(result);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        // Safe fallback if confetti isn't supported
      }
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedRegistration) {
    return (
      <div className="max-w-3xl mx-auto my-12 bg-white rounded-lg border-2 border-college-gold p-6 md:p-10 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-200">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
            OFFICIAL RECEIPT CONFIRMED
          </span>
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-college-navy mt-3">
            Registration Successful!
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Sir C.R. Reddy College of Engineering – SIH Internal Hackathon 2026
          </p>
        </div>

        {/* Unique Registration Badge */}
        <div className="bg-college-dark text-white p-6 rounded-lg border-2 border-college-gold text-left space-y-3 relative overflow-hidden">
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
              <span className="text-slate-400">Department:</span>
              <p className="text-slate-200">{submittedRegistration.department} ({submittedRegistration.year})</p>
            </div>
            <div>
              <span className="text-slate-400">Problem Statement ID:</span>
              <p className="text-college-gold font-mono font-semibold">{submittedRegistration.problemStatementId}</p>
            </div>
            {submittedRegistration.pptFileName && (
              <div className="md:col-span-2 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-slate-400">Uploaded Problem Statement PPT:</span>
                <span className="text-college-gold font-mono font-bold text-xs truncate">
                  📄 {submittedRegistration.pptFileName}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2 text-left">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Important Notice:</span> Please save your Registration ID (
            <strong className="font-mono">{submittedRegistration.id}</strong>) for all future correspondence, project abstract submission, and campus evaluation rounds.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 bg-college-navy text-white px-6 py-2.5 rounded font-bold text-xs hover:bg-college-blue transition-colors border border-college-gold/30"
          >
            <Printer className="w-4 h-4 text-college-gold" />
            <span>PRINT / SAVE REGISTRATION PASS</span>
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
              {samplePPT && samplePPT.published ? (
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300 pt-1">
                  <span><strong>Latest Version:</strong> {samplePPT.version}</span>
                  <span>•</span>
                  <span className="truncate max-w-[200px]"><strong>File:</strong> {samplePPT.fileName}</span>
                  {samplePPT.uploadedAt && (
                    <>
                      <span>•</span>
                      <span><strong>Updated:</strong> {new Date(samplePPT.uploadedAt).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              ) : null}
            </div>

            {samplePPT && samplePPT.published ? (
              <a
                href={samplePPT.downloadURL}
                download={samplePPT.fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 bg-college-gold hover:bg-college-goldLight text-college-dark px-4 py-2.5 rounded font-bold text-xs shadow-md transition-all border border-amber-300 hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>📥 DOWNLOAD SAMPLE PPT</span>
              </a>
            ) : (
              <div className="shrink-0 bg-slate-800 text-slate-400 px-4 py-2.5 rounded text-xs font-mono border border-slate-700">
                Sample PPT Currently Unavailable
              </div>
            )}
          </div>
        </div>
        
        {/* Section 1: Team & Leader Basic Info */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-college-navy border-b border-slate-200 pb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-college-gold" /> 1. Team & Leader Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Team Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. InnovateX CRR"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy focus:border-college-navy outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Team Leader Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Full Name as per college records"
                value={leaderName}
                onChange={e => setLeaderName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy focus:border-college-navy outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Team Leader Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="student@sircrrcoestd.in"
                value={leaderEmail}
                onChange={e => setLeaderEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy focus:border-college-navy outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Team Leader Phone <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={leaderPhone}
                onChange={e => setLeaderPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy focus:border-college-navy outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Roll Number / Reg No <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 21B91A0501"
                value={leaderRollNumber}
                onChange={e => setLeaderRollNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy focus:border-college-navy outline-none font-mono"
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Faculty Mentor (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. V. S. N. Murthy"
                value={facultyMentor}
                onChange={e => setFacultyMentor(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Problem Statement Selection */}
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-base text-college-navy border-b border-slate-200 pb-2 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-college-gold" /> 2. Selected Problem Statement
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Choose Problem Statement <span className="text-red-600">*</span>
            </label>
            <select
              value={selectedPsId}
              onChange={e => setSelectedPsId(e.target.value)}
              className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-college-navy outline-none bg-white font-medium text-slate-900"
            >
              {problemStatements.map(p => (
                <option key={p.id} value={p.psId}>
                  [{p.psId}] {p.title} ({p.organization} - {p.category})
                </option>
              ))}
            </select>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={member.name}
                  onChange={e => handleMemberChange(index, 'name', e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
                />
                <input
                  type="email"
                  required
                  placeholder="Email ID"
                  value={member.email}
                  onChange={e => handleMemberChange(index, 'email', e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Roll Number"
                  value={member.rollNumber}
                  onChange={e => handleMemberChange(index, 'rollNumber', e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded bg-white font-mono"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Section 4: Upload Your Problem Statement PPT (Final section before submission) */}
        <div id="ppt-upload-section" className="space-y-2">
          <PptUploadSection
            initialFileName={pptFile?.name}
            onFileSelected={(file, tempUrl) => {
              setPptFile(file);
              setPptFileUrl(tempUrl);
              setPptError(null);
            }}
          />
          {pptError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 font-medium">
              {pptError}
            </div>
          )}
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
