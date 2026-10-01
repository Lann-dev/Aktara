import React from 'react';
import { FeedbackItem, PlacementApplication, AttendanceRecord, DailyJournalEntry, CompetencyScore } from '../../types';

interface StudentDashboardViewProps {
  onCheckIn: () => void;
  onAddJournal: () => void;
  onViewAllCompetencies: () => void;
  onViewAllFeedback: () => void;
  feedbacks: FeedbackItem[];
  isCheckedIn: boolean;
  lastCheckInTime: string;
  currentUser?: { name: string; email: string; role: string };
  applications?: PlacementApplication[];
  attendanceLogs?: AttendanceRecord[];
  journalEntries?: DailyJournalEntry[];
  competencies?: CompetencyScore[];
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  onCheckIn,
  onAddJournal,
  onViewAllCompetencies,
  onViewAllFeedback,
  feedbacks = [],
  isCheckedIn,
  lastCheckInTime,
  currentUser = { name: 'Dimas Prasetyo Nugroho', email: 'dimas.prasetyo@siswa.smkn1jakarta.sch.id', role: 'student' },
  applications = [],
  attendanceLogs = [],
  journalEntries = [],
  competencies = [],
}) => {
  const activeApp = applications.find(a => a.status === 'Placed') || {
    targetCompany: 'PT Telkom Indonesia (Persero) Tbk',
    targetUnit: 'Digital Platform & Software Engineering Hub',
    industryMentor: 'Bayu Pratama, S.T.',
    schoolMentor: 'Sri Wahyuni, S.Kom, Gr.',
    department: 'Rekayasa Perangkat Lunak (RPL)',
  };

  const presentCount = attendanceLogs.filter(a => a.status === 'Present').length;
  const totalAtt = attendanceLogs.length || 1;
  const attendanceRatePct = Math.round((presentCount / totalAtt) * 100);

  const approvedJournals = journalEntries.filter(j => j.status === 'approved').length;
  const totalJournals = journalEntries.length;

  const avgCompetency = competencies.length > 0 
    ? Math.round(competencies.reduce((acc, c) => acc + c.percentage, 0) / competencies.length)
    : 85;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section (Placement Context) */}
      <section id="student-placement-hero">
        <div className="glass-card rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          {/* Abstract Gradient Header with pattern overlay */}
          <div className="h-24 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-800 w-full relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 11px)',
              }}
            ></div>
          </div>

          <div className="px-6 pb-6 pt-4 relative">
            {/* Company Logo Overlap */}
            <div className="absolute -top-10 bg-[#131127] p-1 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md">
              <div className="h-16 w-16 bg-white/[0.06] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-violet-400 text-[32px]">
                  business
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h2 className="text-[12px] font-bold text-white/50 uppercase tracking-wider mb-1">
                  Tempat Praktik Kerja Lapangan (DUDI)
                </h2>
                <h3 className="text-[24px] font-bold text-white mb-2 leading-tight">
                  {activeApp.targetCompany}
                </h3>
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center text-[13px] text-white/70">
                    <span className="material-symbols-outlined text-[16px] mr-1.5 text-cyan-400">
                      domain
                    </span>
                    Pembimbing Industri:{' '}
                    <span className="font-semibold text-white ml-1">{activeApp.industryMentor || 'Bayu Pratama, S.T.'}</span>
                  </div>
                  <div className="flex items-center text-[13px] text-white/70">
                    <span className="material-symbols-outlined text-[16px] mr-1.5 text-violet-400">
                      school
                    </span>
                    Guru Pembimbing:{' '}
                    <span className="font-semibold text-white ml-1">{activeApp.schoolMentor || 'Sri Wahyuni, S.Kom, Gr.'}</span>
                  </div>
                  <div className="flex items-center text-[13px] text-white/70">
                    <span className="material-symbols-outlined text-[16px] mr-1.5 text-emerald-400">
                      flag
                    </span>
                    Fase:{' '}
                    <span className="font-semibold text-emerald-300 ml-1">Pelaksanaan PKL (Bulan Ke-2 / 6)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-lg shadow-violet-900/20">
                  <span className="w-2 h-2 rounded-full bg-violet-400 mr-2 animate-pulse"></span>
                  Active Internship • /student/dashboard
                </span>
                <span className="text-[11px] text-white/50">SMK Negeri 1 Jakarta • {currentUser.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Grid (8 cols on left, 4 cols on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: KPIs & Competency Progress Rings (Spans 8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Top 3 KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* KPI 1 - Attendance */}
            <div className="glass-card rounded-2xl border border-white/10 shadow-xl p-5 glass-card-hover">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-[15px] font-semibold text-white/70">Attendance</h4>
                <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center justify-center backdrop-blur-md">
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[34px] font-bold text-white">{attendanceRatePct}%</span>
                <span className="text-[13px] text-emerald-300 font-bold flex items-center">
                  <span className="material-symbols-outlined text-[15px]">arrow_upward</span> {presentCount}/{totalAtt} Hadir
                </span>
              </div>
            </div>

            {/* KPI 2 - Journals */}
            <div className="glass-card rounded-2xl border border-white/10 shadow-xl p-5 glass-card-hover">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-[15px] font-semibold text-white/70">Journals</h4>
                <div className="p-2 bg-violet-500/20 border border-violet-500/30 rounded-xl text-violet-300 flex items-center justify-center backdrop-blur-md">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[34px] font-bold text-white">{approvedJournals}/{totalJournals || 24}</span>
                <span className="text-[13px] text-white/60 font-medium">Disetujui</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min(((approvedJournals || 1) / (totalJournals || 24)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* KPI 3 - Competencies */}
            <div className="glass-card rounded-2xl border border-white/10 shadow-xl p-5 glass-card-hover">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-[15px] font-semibold text-white/70">Competencies</h4>
                <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 flex items-center justify-center backdrop-blur-md">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[34px] font-bold text-white">{avgCompetency}%</span>
                <span className="text-[13px] text-white/60 font-medium">Mastered</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-1.5 rounded-full" style={{ width: `${avgCompetency}%` }}></div>
              </div>
            </div>
          </div>

          {/* Circular Radial Competency Progress Visualization */}
          <div className="glass-card rounded-2xl border border-white/10 shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[16px] font-bold text-white">Competency Progress SKKNI</h3>
              <button
                id="student-view-all-competencies-btn"
                onClick={onViewAllCompetencies}
                className="text-[12px] font-bold text-violet-400 hover:text-violet-300 cursor-pointer transition-colors"
              >
                Lihat Semua
              </button>
            </div>

            {/* Circular Progress Gauge Rings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2">
              {(competencies.length > 0 ? competencies.slice(0, 4) : [
                { name: 'Database & SQL', percentage: 95 },
                { name: 'React State Lifecycle', percentage: 90 },
                { name: 'K3 & Cyber Security', percentage: 92 },
                { name: 'Komunikasi Kerja', percentage: 80 },
              ]).map((c, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-white/10"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.2"
                      />
                      <path
                        className="text-violet-500"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray={`${c.percentage}, 100`}
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[14px] font-bold text-white">{c.percentage}%</span>
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-white/70 text-center line-clamp-2">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Action Cards (Spans 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Action 1: Check-in / Presensi */}
          <div className="glass-card rounded-2xl border border-white/10 shadow-xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300">
                  <span className="material-symbols-outlined text-[22px]">location_on</span>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white">Presensi GPS Geofencing</h4>
                  <p className="text-[11px] text-white/50">Radius 50m DUDI Telkom Tower</p>
                </div>
              </div>

              {isCheckedIn ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-[12px] font-semibold flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Sudah Presensi Hari Ini ({lastCheckInTime})</span>
                </div>
              ) : (
                <p className="text-[13px] text-white/70 mb-4">
                  Lakukan check-in kehadiran harian saat tiba di lokasi kantor mitra industri.
                </p>
              )}
            </div>

            <button
              id="student-check-in-action-btn"
              onClick={onCheckIn}
              disabled={isCheckedIn}
              className={`w-full py-3 rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 ${
                isCheckedIn
                  ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40 border border-emerald-500/30'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isCheckedIn ? 'done_all' : 'fingerprint'}
              </span>
              <span>{isCheckedIn ? 'Presensi Tercatat' : 'Check In Sekarang (GPS)'}</span>
            </button>
          </div>

          {/* Action 2: Daily Journal Logbook */}
          <div className="glass-card rounded-2xl border border-white/10 shadow-xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-violet-500/20 border border-violet-500/30 rounded-xl text-violet-300">
                  <span className="material-symbols-outlined text-[22px]">edit_note</span>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white">Logbook Jurnal Harian</h4>
                  <p className="text-[11px] text-white/50">Dokumentasi tugas & bukti foto/link</p>
                </div>
              </div>

              <p className="text-[13px] text-white/70 mb-4">
                Catat aktivitas magang, integrasi API, dan capaian keterampilan untuk disetujui mentor.
              </p>
            </div>

            <button
              id="student-add-journal-action-btn"
              onClick={onAddJournal}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-950/40 border border-violet-500/30 active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Tambah Jurnal Harian</span>
            </button>
          </div>

          {/* Feedback from Mentors */}
          <div className="glass-card rounded-2xl border border-white/10 shadow-xl p-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[15px] font-bold text-white">Feedback Pembimbing</h4>
              <button
                onClick={onViewAllFeedback}
                className="text-[11px] font-bold text-violet-400 hover:text-violet-300 cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {(feedbacks.length > 0 ? feedbacks : []).map((fb) => (
                <div key={fb.id} className="p-3 bg-white/[0.03] rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-bold text-white">{fb.authorName}</span>
                    <span className="text-[10px] text-white/40">{fb.timeAgo}</span>
                  </div>
                  <p className="text-[12px] text-white/70 italic">{fb.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
