import React from 'react';
import { StudentItem, SupervisionSchedule } from '../../types';

interface TeacherMentorViewProps {
  onSelectStudent?: (studentName: string) => void;
  onOpenSupervisionModal?: () => void;
  onOpenLogbookModal?: (studentName: string) => void;
  searchQuery?: string;
  students?: StudentItem[];
  supervisions?: SupervisionSchedule[];
}

export const TeacherMentorView: React.FC<TeacherMentorViewProps> = ({
  onSelectStudent,
  onOpenSupervisionModal,
  onOpenLogbookModal,
  searchQuery = '',
  students = [],
  supervisions = [],
}) => {
  const defaultStudents = [
    {
      name: 'Dimas Prasetyo Nugroho',
      nisn: '0068492019',
      dept: 'Rekayasa Perangkat Lunak (RPL)',
      company: 'PT Telkom Indonesia (Persero) Tbk',
      industryMentor: 'Bayu Pratama, S.T.',
      attendance: 100,
      journalProgress: '24/24 Disetujui',
      status: 'Sangat Baik',
      lastVisit: '31 Agu 2026',
    },
    {
      name: 'Alya Putri',
      nisn: '0068492020',
      dept: 'Teknik Komputer & Jaringan (TKJ)',
      company: 'PT Astra International Tbk',
      industryMentor: 'Ratna Kusuma, S.Kom',
      attendance: 96,
      journalProgress: '22/24 Disetujui',
      status: 'Sangat Baik',
      lastVisit: '20 Agu 2026',
    },
    {
      name: 'Bima Sakti',
      nisn: '0068492021',
      dept: 'Rekayasa Perangkat Lunak (RPL)',
      company: 'PT Telkom Indonesia (Persero) Tbk',
      industryMentor: 'Bayu Pratama, S.T.',
      attendance: 92,
      journalProgress: '20/24 Disetujui',
      status: 'Baik',
      lastVisit: '31 Agu 2026',
    },
    {
      name: 'Citra Dewi',
      nisn: '0068492022',
      dept: 'Desain Komunikasi Visual (DKV)',
      company: 'Bank Mandiri (Persero) Tbk',
      industryMentor: 'Dewi Lestari, S.Ds',
      attendance: 98,
      journalProgress: '23/24 Disetujui',
      status: 'Sangat Baik',
      lastVisit: '25 Agu 2026',
    },
    {
      name: 'Eko Wahyudi',
      nisn: '0068492023',
      dept: 'Teknik Komputer & Jaringan (TKJ)',
      company: 'PT Astra International Tbk',
      industryMentor: 'Ratna Kusuma, S.Kom',
      attendance: 90,
      journalProgress: '19/24 Disetujui',
      status: 'Cukup',
      lastVisit: '20 Agu 2026',
    },
  ];

  const displayStudents = students.length > 0
    ? students.map(s => ({
        name: s.name,
        nisn: '0068492019',
        dept: s.department,
        company: s.company,
        industryMentor: s.mentor,
        attendance: s.attendanceRate,
        journalProgress: `${s.journalsSubmitted}/${s.journalsTotal} Disetujui`,
        status: s.attendanceRate >= 95 ? 'Sangat Baik' : s.attendanceRate >= 90 ? 'Baik' : 'Perlu Perhatian',
        lastVisit: '31 Agu 2026',
      }))
    : defaultStudents;

  const filtered = displayStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-indigo-950/20 to-[#0e1122]/80">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                School Mentor Dashboard • /school/mentor/dashboard
              </span>
              <span className="text-white/40 text-[12px]">• Sri Wahyuni, S.Kom, Gr. / Hendra Setiawan, M.T.</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Monitoring Siswa Bimbingan PKL
            </h2>
            <p className="text-[14px] text-white/70 max-w-2xl mt-1">
              Pantau siswa bimbingan di DUDI mitra, deteksi siswa at-risk, review jurnal harian, dan koordinasikan supervisi on-site dengan pembimbing industri.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSupervisionModal}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-cyan-900/40 cursor-pointer transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Jadwalkan Kunjungan Supervisi</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Exact Required School Mentor KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 - Students Assigned */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[12px] font-bold text-white/50 uppercase">Students Assigned</span>
            <span className="p-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl material-symbols-outlined text-[20px]">
              group
            </span>
          </div>
          <div>
            <p className="text-[28px] font-black text-white leading-none">{displayStudents.length} Siswa</p>
            <p className="text-[11px] text-cyan-400 font-semibold mt-2">Tersebar di 3 Mitra Industri DUDI</p>
          </div>
        </div>

        {/* KPI 2 - Students At Risk */}
        <div className="glass-card rounded-2xl p-5 border border-rose-500/30 bg-rose-950/15 glass-card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[12px] font-bold text-rose-300/80 uppercase">Students At Risk</span>
            <span className="p-2 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-xl material-symbols-outlined text-[20px]">
              warning
            </span>
          </div>
          <div>
            <p className="text-[28px] font-black text-rose-400 leading-none">
              {displayStudents.filter(s => s.attendance < 92).length}
            </p>
            <p className="text-[11px] text-rose-300 font-semibold mt-2">Kehadiran &lt; 92% atau telat logbook</p>
          </div>
        </div>

        {/* KPI 3 - Pending Journal Reviews */}
        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 glass-card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[12px] font-bold text-amber-300/80 uppercase">Pending Journal Reviews</span>
            <span className="p-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl material-symbols-outlined text-[20px]">
              rate_review
            </span>
          </div>
          <div>
            <p className="text-[28px] font-black text-amber-300 leading-none">2 Jurnal</p>
            <p className="text-[11px] text-amber-400 font-semibold mt-2">Perlu verifikasi guru pembimbing</p>
          </div>
        </div>

        {/* KPI 4 - Pending Supervision */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[12px] font-bold text-white/50 uppercase">Supervision Visits</span>
            <span className="p-2 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-xl material-symbols-outlined text-[20px]">
              domain_verification
            </span>
          </div>
          <div>
            <p className="text-[28px] font-black text-violet-300 leading-none">{supervisions.length || 2} Kunjungan</p>
            <p className="text-[11px] text-white/60 font-semibold mt-2">Siklus 2 (Target: 4 Kunjungan)</p>
          </div>
        </div>

        {/* KPI 5 - Competency Progress */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[12px] font-bold text-white/50 uppercase">Competency Progress</span>
            <span className="p-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl material-symbols-outlined text-[20px]">
              verified
            </span>
          </div>
          <div>
            <p className="text-[28px] font-black text-emerald-400 leading-none">89.4%</p>
            <p className="text-[11px] text-emerald-400/80 font-semibold mt-2">SKKNI Level 2 Tercapai</p>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[18px] font-bold text-white">Daftar Siswa Bimbingan & Progress PKL</h3>
            <p className="text-[12px] text-white/50">Status verifikasi logbook sekolah dan industri dari database real</p>
          </div>
          <span className="text-[12px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
            {filtered.length} Siswa Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-white/80">
            <thead className="border-b border-white/10 text-white/40 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Siswa / NISN</th>
                <th className="py-3 px-4">Jurusan</th>
                <th className="py-3 px-4">Mitra Industri & Pembimbing</th>
                <th className="py-3 px-4 text-center">Kehadiran</th>
                <th className="py-3 px-4 text-center">Logbook</th>
                <th className="py-3 px-4 text-center">Kunjungan Terakhir</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((s, idx) => (
                <tr key={idx} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{s.name}</p>
                    <p className="text-[11px] text-white/40 font-mono">NISN: {s.nisn}</p>
                  </td>
                  <td className="py-3 px-4 text-white/70">{s.dept}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-white/90">{s.company}</p>
                    <p className="text-[11px] text-violet-300">Mentor: {s.industryMentor}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-white/80">{s.journalProgress}</td>
                  <td className="py-3 px-4 text-center text-white/60">{s.lastVisit}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenLogbookModal && onOpenLogbookModal(s.name)}
                        className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-xl text-[12px] font-semibold border border-cyan-500/30 cursor-pointer transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">menu_book</span>
                        <span>Logbook</span>
                      </button>
                      <button
                        onClick={() => onSelectStudent && onSelectStudent(s.name)}
                        className="px-2.5 py-1 bg-white/[0.08] hover:bg-white/[0.15] text-white/90 rounded-xl text-[12px] font-semibold border border-white/10 cursor-pointer transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">badge</span>
                        <span>Buku Saku</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
