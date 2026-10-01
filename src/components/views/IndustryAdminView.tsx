import React from 'react';
import { IndustryMaster, SchoolMaster } from '../../types';

interface IndustryAdminViewProps {
  onAddMentor?: () => void;
  onAdjustQuota?: () => void;
  onNavigateToPlacements?: () => void;
  onNavigateToAttendance?: () => void;
  onNavigateToAssessments?: () => void;
  onNavigateToSchools?: () => void;
  onNavigateToMentors?: () => void;
  searchQuery?: string;
  industries?: IndustryMaster[];
  schools?: SchoolMaster[];
}

export const IndustryAdminView: React.FC<IndustryAdminViewProps> = ({
  onAddMentor,
  onAdjustQuota,
  onNavigateToPlacements,
  onNavigateToAttendance,
  onNavigateToAssessments,
  onNavigateToSchools,
  onNavigateToMentors,
  searchQuery = '',
  industries = [],
  schools = [],
}) => {
  const activeIndustry = industries[0] || {
    name: 'PT Telkom Indonesia (Persero) Tbk',
    location: 'Telkom Landmark Tower, Jakarta Selatan',
    quotaTotal: 30,
    quotaUsed: 25,
  };

  const mentors = [
    { name: 'Bayu Pratama, S.T.', title: 'Lead Software Architect', dept: 'Digital Platform & Software Engineering Hub', activeStudents: 5, capacity: 6, status: 'Active' },
    { name: 'Ratna Kusuma, S.Kom', title: 'Senior Cloud & Network Engineer', dept: 'Cloud Infrastructure & Telecommunication', activeStudents: 4, capacity: 4, status: 'Full' },
    { name: 'Dewi Lestari, S.Ds', title: 'Principal UI/UX Product Designer', dept: 'Digital Experience & Creative Media', activeStudents: 3, capacity: 5, status: 'Active' },
    { name: 'Hendra Gunawan, M.T.', title: 'DevOps & Cyber Security Lead', dept: 'Security Operations & Infrastructure', activeStudents: 2, capacity: 3, status: 'Active' },
  ];

  const smkPartners = schools.map((s, idx) => ({
    name: s.name,
    studentsCount: idx === 0 ? 15 : idx === 1 ? 8 : 7,
    mouNumber: `MOU-TELKOM/${s.npsn || 'SMK'}/2025`,
    expiry: 'Desember 2027',
  }));

  const filteredMentors = mentors.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Industry Admin Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden border border-orange-500/30 bg-gradient-to-r from-orange-950/30 via-rose-950/20 to-[#0e1122]/80">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40">
                Industry Admin Dashboard • /industry/dashboard
              </span>
              <span className="text-white/40 text-[12px]">• {activeIndustry.name}</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Manajemen Program PKL Industri DUDI
            </h2>
            <p className="text-[14px] text-white/70 max-w-2xl mt-1">
              Kelola kuota penerimaan magang, penugasan pembimbing industri (mentor), absensi, evaluasi siswa, dan kerjasama SMK berbasis database real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAdjustQuota}
              className="px-4 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] text-orange-300 border border-orange-500/30 rounded-2xl text-[13px] font-bold cursor-pointer transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Atur Kuota Divisi</span>
            </button>
            <button
              onClick={onAddMentor}
              className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-orange-900/40 cursor-pointer transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Tambah Mentor Industri</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Exact Required Industry Admin KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1 - Active Interns */}
        <div
          onClick={onNavigateToPlacements}
          className="glass-card rounded-2xl p-4 border border-white/10 glass-card-hover flex flex-col justify-between cursor-pointer transition-all hover:border-orange-500/50 group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[12px] font-bold text-white/50 group-hover:text-white uppercase transition-colors">Active Interns</span>
            <span className="p-1.5 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-lg material-symbols-outlined text-[18px]">
              group
            </span>
          </div>
          <div>
            <p className="text-[26px] font-black text-white leading-tight">{activeIndustry.quotaUsed || 25} Siswa</p>
            <p className="text-[11px] text-orange-300 font-semibold mt-1 flex items-center gap-1">
              <span>Dari {smkPartners.length || 3} SMK Mitra</span>
              <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </p>
          </div>
        </div>

        {/* KPI 2 - Total Mentors */}
        <div
          onClick={onNavigateToMentors || onAddMentor}
          className="glass-card rounded-2xl p-4 border border-white/10 glass-card-hover flex flex-col justify-between cursor-pointer transition-all hover:border-rose-500/50 group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[12px] font-bold text-white/50 group-hover:text-white uppercase transition-colors">Total Mentors</span>
            <span className="p-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg material-symbols-outlined text-[18px]">
              badge
            </span>
          </div>
          <div>
            <p className="text-[26px] font-black text-white leading-tight">{mentors.length} Mentor</p>
            <p className="text-[11px] text-rose-300 font-semibold mt-1 flex items-center gap-1">
              <span>4 Divisi Teknis</span>
              <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </p>
          </div>
        </div>

        {/* KPI 3 - Active Programs / Quota */}
        <div
          onClick={onAdjustQuota}
          className="glass-card rounded-2xl p-4 border border-white/10 glass-card-hover flex flex-col justify-between cursor-pointer transition-all hover:border-amber-500/50 group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[12px] font-bold text-white/50 group-hover:text-white uppercase transition-colors">Programs / Quota</span>
            <span className="p-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg material-symbols-outlined text-[18px]">
              pie_chart
            </span>
          </div>
          <div>
            <p className="text-[26px] font-black text-amber-300 leading-tight">{activeIndustry.quotaUsed || 25} / {activeIndustry.quotaTotal || 30}</p>
            <p className="text-[11px] text-amber-400 font-semibold mt-1 flex items-center gap-1">
              <span>83.3% Terisi (5 Sisa)</span>
              <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </p>
          </div>
        </div>

        {/* KPI 4 - Attendance Overview */}
        <div
          onClick={onNavigateToAttendance}
          className="glass-card rounded-2xl p-4 border border-white/10 glass-card-hover flex flex-col justify-between cursor-pointer transition-all hover:border-emerald-500/50 group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[12px] font-bold text-white/50 group-hover:text-white uppercase transition-colors">Attendance</span>
            <span className="p-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg material-symbols-outlined text-[18px]">
              how_to_reg
            </span>
          </div>
          <div>
            <p className="text-[26px] font-black text-emerald-400 leading-tight">98.2%</p>
            <p className="text-[11px] text-emerald-400/80 font-semibold mt-1 flex items-center gap-1">
              <span>Presensi GPS On-Site</span>
              <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </p>
          </div>
        </div>

        {/* KPI 5 - Pending Assessments */}
        <div
          onClick={onNavigateToAssessments}
          className="glass-card rounded-2xl p-4 border border-violet-500/30 glass-card-hover flex flex-col justify-between bg-violet-950/15 cursor-pointer transition-all hover:border-violet-400 group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[12px] font-bold text-violet-300/80 group-hover:text-violet-200 uppercase transition-colors">Pending Review</span>
            <span className="p-1.5 bg-violet-500/20 text-violet-300 border border-violet-500/40 rounded-lg material-symbols-outlined text-[18px]">
              assignment_turned_in
            </span>
          </div>
          <div>
            <p className="text-[26px] font-black text-violet-300 leading-tight">2 Nilai</p>
            <p className="text-[11px] text-violet-300/80 font-semibold mt-1 flex items-center gap-1">
              <span>Mid-Term Evaluation</span>
              <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </p>
          </div>
        </div>

        {/* KPI 6 - Partner Schools */}
        <div
          onClick={onNavigateToSchools}
          className="glass-card rounded-2xl p-4 border border-white/10 glass-card-hover flex flex-col justify-between cursor-pointer transition-all hover:border-cyan-500/50 group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[12px] font-bold text-white/50 group-hover:text-white uppercase transition-colors">Partner Schools</span>
            <span className="p-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg material-symbols-outlined text-[18px]">
              handshake
            </span>
          </div>
          <div>
            <p className="text-[26px] font-black text-white leading-tight">{smkPartners.length || 3} SMK</p>
            <p className="text-[11px] text-cyan-300 font-semibold mt-1 flex items-center gap-1">
              <span>MoU Aktif Legal</span>
              <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
            </p>
          </div>
        </div>
      </div>

      {/* Mentors and Partners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registered Mentors */}
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-[17px] font-bold text-white">Daftar Mentor Internal</h3>
              <p className="text-[12px] text-white/50">Pembimbing teknis yang menangani siswa SMK</p>
            </div>
          </div>

          <div className="space-y-3">
            {filteredMentors.map((m, idx) => (
              <div key={idx} className="p-3.5 bg-white/[0.04] rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-white">{m.name}</h4>
                  <p className="text-[11px] text-orange-300 font-medium">{m.title} • {m.dept}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    m.status === 'Full' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {m.activeStudents}/{m.capacity} Siswa
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Schools */}
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-[17px] font-bold text-white">Kerjasama Sekolah Vokasi (MoU)</h3>
              <p className="text-[12px] text-white/50">Institusi mitra penyalur siswa magang</p>
            </div>
          </div>

          <div className="space-y-3">
            {smkPartners.map((smk, idx) => (
              <div key={idx} className="p-3.5 bg-white/[0.04] rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-white">{smk.name}</h4>
                  <p className="text-[11px] text-white/50 font-mono">{smk.mouNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-white">{smk.studentsCount} Siswa Diterima</p>
                  <p className="text-[11px] text-emerald-400 font-medium">Berlaku s/d {smk.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
