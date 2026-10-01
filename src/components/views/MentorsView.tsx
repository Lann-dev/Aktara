import React, { useState, useMemo } from 'react';
import { UserRole } from '../../types';

export interface MentorProfile {
  id: string;
  name: string;
  type: 'industry_mentor' | 'teacher_mentor';
  title: string;
  organization: string;
  department?: string;
  email: string;
  phone: string;
  assignedStudents: {
    id: string;
    name: string;
    department: string;
    company: string;
    progress: number;
    status: 'Active' | 'Completed' | 'Pending';
  }[];
  activeStatus: 'active' | 'inactive';
  journalsReviewed: number;
  supervisionsCompleted: number;
  rating: number;
}

const INITIAL_MENTOR_PROFILES: MentorProfile[] = [
  {
    id: 'men-01',
    name: 'Bayu Pratama, S.T.',
    type: 'industry_mentor',
    title: 'Lead Software Architect & Engineering Mentor',
    organization: 'PT Telkom Indonesia (Persero) Tbk',
    department: 'Digital Platform & Software Engineering Hub',
    email: 'bayu.pratama@telkom.co.id',
    phone: '+62 812-3456-7890',
    assignedStudents: [
      { id: 'stud-01', name: 'Dimas Prasetyo Nugroho', department: 'RPL', company: 'PT Telkom Indonesia', progress: 85, status: 'Active' },
      { id: 'stud-03', name: 'Bima Sakti', department: 'RPL', company: 'PT Telkom Indonesia', progress: 60, status: 'Active' },
    ],
    activeStatus: 'active',
    journalsReviewed: 44,
    supervisionsCompleted: 6,
    rating: 4.95,
  },
  {
    id: 'men-02',
    name: 'Ratna Kusuma, S.Kom',
    type: 'industry_mentor',
    title: 'Senior IT Infrastructure Specialist',
    organization: 'PT Astra International Tbk',
    department: 'Digital IT Enterprise & Network Systems',
    email: 'ratna.kusuma@astra.co.id',
    phone: '+62 813-8899-2211',
    assignedStudents: [
      { id: 'stud-02', name: 'Alya Putri', department: 'TKJ', company: 'PT Astra International', progress: 75, status: 'Active' },
    ],
    activeStatus: 'active',
    journalsReviewed: 28,
    supervisionsCompleted: 4,
    rating: 4.9,
  },
  {
    id: 'men-03',
    name: 'Dewi Lestari, S.Ds',
    type: 'industry_mentor',
    title: 'Lead UI/UX Product Designer',
    organization: 'Bank Mandiri (Persero) Tbk',
    department: 'Digital Banking UI/UX & Creative Lab',
    email: 'dewi.lestari@bankmandiri.co.id',
    phone: '+62 817-5544-3322',
    assignedStudents: [
      { id: 'stud-04', name: 'Citra Dewi', department: 'DKV', company: 'Bank Mandiri', progress: 80, status: 'Active' },
    ],
    activeStatus: 'active',
    journalsReviewed: 23,
    supervisionsCompleted: 3,
    rating: 4.88,
  },
  {
    id: 'men-04',
    name: 'Hendra Setiawan, S.Pd., M.T.',
    type: 'teacher_mentor',
    title: 'Guru Pembimbing Kejuruan RPL',
    organization: 'SMK Negeri 1 Jakarta',
    department: 'Rekayasa Perangkat Lunak',
    email: 'guru.hendra@smkn1jakarta.sch.id',
    phone: '+62 811-9876-5432',
    assignedStudents: [
      { id: 'stud-01', name: 'Dimas Prasetyo Nugroho', department: 'RPL', company: 'PT Telkom Indonesia', progress: 85, status: 'Active' },
      { id: 'stud-03', name: 'Bima Sakti', department: 'RPL', company: 'PT Telkom Indonesia', progress: 60, status: 'Active' },
    ],
    activeStatus: 'active',
    journalsReviewed: 52,
    supervisionsCompleted: 8,
    rating: 4.92,
  },
  {
    id: 'men-05',
    name: 'Sri Wahyuni, S.Kom',
    type: 'teacher_mentor',
    title: 'Guru Pembimbing Kejuruan TKJ',
    organization: 'SMK Negeri 1 Jakarta',
    department: 'Teknik Komputer & Jaringan',
    email: 'sri.wahyuni@smkn1jakarta.sch.id',
    phone: '+62 812-7766-5544',
    assignedStudents: [
      { id: 'stud-02', name: 'Alya Putri', department: 'TKJ', company: 'PT Astra International', progress: 75, status: 'Active' },
    ],
    activeStatus: 'active',
    journalsReviewed: 36,
    supervisionsCompleted: 6,
    rating: 4.85,
  },
  {
    id: 'men-06',
    name: 'Ir. Rahmat Hidayat',
    type: 'industry_mentor',
    title: 'Head of Network Operations',
    organization: 'PT Telkom Indonesia (Persero) Tbk',
    department: 'Network Operations & Fiber Infrastructure',
    email: 'rahmat.hidayat@telkom.co.id',
    phone: '+62 815-3322-1100',
    assignedStudents: [],
    activeStatus: 'active',
    journalsReviewed: 18,
    supervisionsCompleted: 2,
    rating: 4.8,
  },
];

interface MentorsViewProps {
  currentRole: UserRole;
  searchQuery?: string;
  onAddMentor?: () => void;
  onAssignStudents?: (mentorId: string) => void;
  onExportMentors?: () => void;
}

export const MentorsView: React.FC<MentorsViewProps> = ({
  currentRole,
  searchQuery = '',
  onAddMentor,
  onAssignStudents,
  onExportMentors,
}) => {
  const [mentors, setMentors] = useState<MentorProfile[]>(INITIAL_MENTOR_PROFILES);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'industry_mentor' | 'teacher_mentor'>('all');
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedMentorDetail, setSelectedMentorDetail] = useState<MentorProfile | null>(null);

  const isReadOnly = currentRole === 'viewer_dinas';

  // Extract unique organizations
  const organizations = useMemo(() => {
    const set = new Set<string>();
    mentors.forEach((m) => set.add(m.organization));
    return Array.from(set);
  }, [mentors]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = mentors.length;
    const industryCount = mentors.filter((m) => m.type === 'industry_mentor').length;
    const teacherCount = mentors.filter((m) => m.type === 'teacher_mentor').length;
    const totalAssignedStudents = mentors.reduce((acc, m) => acc + m.assignedStudents.length, 0);
    const avgRatio = total > 0 ? (totalAssignedStudents / total).toFixed(1) : '0';

    return {
      total,
      industryCount,
      teacherCount,
      totalAssignedStudents,
      avgRatio,
    };
  }, [mentors]);

  // Filtered Mentors
  const effectiveSearch = localSearch || searchQuery;
  const filtered = useMemo(() => {
    return mentors.filter((m) => {
      const q = effectiveSearch.toLowerCase();
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.organization.toLowerCase().includes(q) ||
        (m.department && m.department.toLowerCase().includes(q)) ||
        m.email.toLowerCase().includes(q);

      const matchType = selectedType === 'all' || m.type === selectedType;
      const matchOrg = selectedOrg === 'all' || m.organization === selectedOrg;

      return matchSearch && matchType && matchOrg;
    });
  }, [mentors, effectiveSearch, selectedType, selectedOrg]);

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Top Banner Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-[#0c1024]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">badge</span>
              <span>Modul 8.2 & 8.9 • Pembimbing Lapangan DUDI & Guru Pembimbing</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Direktori & Manajemen Pembimbing (Mentors)
            </h2>
            <p className="text-[14px] text-white/70 mt-1 max-w-3xl leading-relaxed">
              Pusat koordinasi mentor industri (DUDI) dan guru pembimbing sekolah SMK Negeri 1 Jakarta, pemantauan beban siswa bimbingan, rekam jejak verifikasi jurnal, serta fasilitasi supervisi lapangan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onExportMentors && (
              <button
                type="button"
                onClick={onExportMentors}
                className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/15 rounded-2xl text-[13px] font-bold cursor-pointer transition-all flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] text-blue-400">download</span>
                <span>Ekspor Direktori</span>
              </button>
            )}

            {!isReadOnly && onAddMentor && (
              <button
                type="button"
                id="btn-add-mentor-main"
                onClick={onAddMentor}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-blue-950/60 hover:shadow-blue-900/70 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-200 flex items-center gap-2 ring-1 ring-blue-400/40"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>Tambah Pembimbing</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pembimbing */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Total Pembimbing</span>
            <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 material-symbols-outlined text-[20px]">
              supervisor_account
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-white">{metrics.total}</span>
              <span className="text-[12px] text-emerald-400 font-bold">Aktif Bertugas</span>
            </div>
            <p className="text-[12px] text-white/50 mt-0.5">Pendamping siswa magang</p>
          </div>
        </div>

        {/* Pembimbing Industri */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Mentor Industri (DUDI)</span>
            <span className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 material-symbols-outlined text-[20px]">
              domain
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[30px] font-black text-indigo-400">{metrics.industryCount}</span>
            <span className="text-[12px] text-white/60 ml-2 font-medium">Mentor Lapangan</span>
            <p className="text-[12px] text-white/50 mt-1">Telkom, Astra, Bank Mandiri, dsb.</p>
          </div>
        </div>

        {/* Guru Pembimbing */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Guru Pembimbing Sekolah</span>
            <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 material-symbols-outlined text-[20px]">
              school
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[30px] font-black text-emerald-300">{metrics.teacherCount}</span>
            <span className="text-[12px] text-white/60 ml-2 font-medium">Tenaga Pendidik</span>
            <p className="text-[12px] text-white/50 mt-1">SMK Negeri 1 Jakarta</p>
          </div>
        </div>

        {/* Rasio Siswa */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Rasio Bimbingan</span>
            <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 material-symbols-outlined text-[20px]">
              diversity_3
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-amber-300">1 : {metrics.avgRatio}</span>
              <span className="text-[12px] text-white/60 font-medium">Siswa</span>
            </div>
            <p className="text-[12px] text-white/50 mt-1">Rasio optimal pengawasan vokasi</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & View Toggle */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
            search
          </span>
          <input
            id="search-mentors-input"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Cari nama pembimbing, organisasi, jurusan..."
            className="w-full pl-10 pr-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/40 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns & View Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Type Filter */}
          <select
            id="filter-mentor-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="all" className="bg-[#0f172a] text-white">Semua Tipe Pembimbing</option>
            <option value="industry_mentor" className="bg-[#0f172a] text-white">Mentor Industri (DUDI)</option>
            <option value="teacher_mentor" className="bg-[#0f172a] text-white">Guru Pembimbing Sekolah</option>
          </select>

          {/* Org Filter */}
          <select
            id="filter-mentor-org"
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer max-w-[200px] truncate"
          >
            <option value="all" className="bg-[#0f172a] text-white">Semua Institusi / Mitra</option>
            {organizations.map((org) => (
              <option key={org} value={org} className="bg-[#0f172a] text-white">
                {org}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
              }`}
              title="Tampilan Grid Kartu"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
              }`}
              title="Tampilan Tabel Data"
            >
              <span className="material-symbols-outlined text-[18px]">table_rows</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mentors Content: Grid or Table */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10 my-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/40">
            <span className="material-symbols-outlined text-[36px]">person_off</span>
          </div>
          <h3 className="text-[18px] font-bold text-white">Tidak ada data pembimbing yang cocok</h3>
          <p className="text-[13px] text-white/50 max-w-md mx-auto mt-1">
            Silakan sesuaikan kata kunci pencarian atau ubah filter tipe pembimbing dan institusi.
          </p>
          <button
            onClick={() => {
              setLocalSearch('');
              setSelectedType('all');
              setSelectedOrg('all');
            }}
            className="mt-4 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((mentor) => {
            const isIndustry = mentor.type === 'industry_mentor';
            const badgeColor = isIndustry
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            const badgeLabel = isIndustry ? 'Mentor Industri' : 'Guru Pembimbing';

            return (
              <div
                key={mentor.id}
                className="glass-card rounded-2xl border border-white/10 p-5 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-200 group"
              >
                <div>
                  {/* Header: Avatar, Name, Type */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-[18px] shadow-lg shrink-0 ${
                          isIndustry
                            ? 'bg-gradient-to-br from-indigo-600 to-blue-600'
                            : 'bg-gradient-to-br from-emerald-600 to-teal-600'
                        }`}
                      >
                        {mentor.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[15px] font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                          {mentor.name}
                        </h4>
                        <p className="text-[11px] text-white/60 truncate">{mentor.title}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 border ${badgeColor}`}
                    >
                      {badgeLabel}
                    </span>
                  </div>

                  {/* Organization & Dept */}
                  <div className="bg-white/[0.03] p-3 rounded-xl border border-white/10 space-y-1 text-[11px] mb-4">
                    <div className="flex items-center gap-1.5 text-white/80 font-medium">
                      <span className="material-symbols-outlined text-[15px] text-blue-400">
                        {isIndustry ? 'domain' : 'school'}
                      </span>
                      <span className="truncate">{mentor.organization}</span>
                    </div>
                    {mentor.department && (
                      <div className="text-white/50 text-[10px] pl-5 truncate">
                        {mentor.department}
                      </div>
                    )}
                  </div>

                  {/* Assigned Students */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-white/60 mb-2">
                      <span>Siswa Bimbingan Aktif:</span>
                      <span className="text-blue-300 font-bold">
                        {mentor.assignedStudents.length} Siswa
                      </span>
                    </div>

                    {mentor.assignedStudents.length > 0 ? (
                      <div className="space-y-1.5">
                        {mentor.assignedStudents.map((st) => (
                          <div
                            key={st.id}
                            className="p-2 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-between text-[11px]"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="material-symbols-outlined text-[14px] text-emerald-400">person</span>
                              <span className="font-medium text-white truncate max-w-[150px]">{st.name}</span>
                            </div>
                            <span className="text-[10px] font-mono text-white/50">{st.department}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-white/40 italic p-2 bg-white/[0.02] rounded-lg border border-white/5 text-center">
                        Belum ada siswa bimbingan yang dialokasikan
                      </p>
                    )}
                  </div>

                  {/* Stats & Rating */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-white/10 text-white/60">
                    <div>
                      <span>Review Jurnal:</span>{' '}
                      <strong className="text-white">{mentor.journalsReviewed}</strong>
                    </div>
                    <div>
                      <span>Supervisi:</span>{' '}
                      <strong className="text-white">{mentor.supervisionsCompleted} kali</strong>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/10 mt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedMentorDetail(mentor)}
                    className="flex-1 py-2 px-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-xl text-[12px] font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-400">visibility</span>
                    <span>Detail Profil</span>
                  </button>

                  <a
                    href={`mailto:${mentor.email}`}
                    className="p-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
                    title="Kirim Email"
                  >
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] text-white/80">
              <thead className="border-b border-white/10 text-white/40 text-[10px] uppercase tracking-wider bg-white/[0.02]">
                <tr>
                  <th className="py-3 px-4">Nama Pembimbing</th>
                  <th className="py-3 px-4">Peran & Tipe</th>
                  <th className="py-3 px-4">Institusi / Mitra</th>
                  <th className="py-3 px-4 text-center">Siswa Bimbingan</th>
                  <th className="py-3 px-4 text-center">Review Jurnal</th>
                  <th className="py-3 px-4 text-center">Supervisi</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((mentor) => (
                  <tr key={mentor.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{mentor.name}</div>
                      <div className="text-[11px] text-white/50">{mentor.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                          mentor.type === 'industry_mentor'
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {mentor.type === 'industry_mentor' ? 'Industri' : 'Guru'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white/90">{mentor.organization}</div>
                      <div className="text-[11px] text-white/50 truncate max-w-xs">{mentor.department}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-white">
                      {mentor.assignedStudents.length} Siswa
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-white/80">
                      {mentor.journalsReviewed}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-white/80">
                      {mentor.supervisionsCompleted} Kali
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedMentorDetail(mentor)}
                        className="p-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-lg text-blue-300 transition-colors cursor-pointer"
                        title="Lihat Detail Profil"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL DRAWER */}
      {selectedMentorDetail && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedMentorDetail(null);
          }}
          className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div className="glass-card bg-[#0e1228]/95 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-white/15 text-white my-8 relative">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-[18px] shadow-lg ${
                    selectedMentorDetail.type === 'industry_mentor'
                      ? 'bg-gradient-to-br from-indigo-600 to-blue-600'
                      : 'bg-gradient-to-br from-emerald-600 to-teal-600'
                  }`}
                >
                  {selectedMentorDetail.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white">{selectedMentorDetail.name}</h3>
                  <p className="text-[12px] text-white/60">{selectedMentorDetail.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMentorDetail(null)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Institusi</span>
                  <p className="font-bold text-white mt-0.5">{selectedMentorDetail.organization}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Departemen</span>
                  <p className="font-bold text-white mt-0.5">{selectedMentorDetail.department || '-'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Email</span>
                  <p className="font-mono text-white mt-0.5 truncate">{selectedMentorDetail.email}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Telepon</span>
                  <p className="font-mono text-white mt-0.5">{selectedMentorDetail.phone}</p>
                </div>
              </div>

              {/* Daftar Siswa Bimbingan */}
              <div>
                <h4 className="font-bold text-white text-[13px] mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-400">group</span>
                  <span>Siswa yang Dibimbing ({selectedMentorDetail.assignedStudents.length})</span>
                </h4>
                {selectedMentorDetail.assignedStudents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedMentorDetail.assignedStudents.map((st) => (
                      <div
                        key={st.id}
                        className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex justify-between items-center text-[12px]"
                      >
                        <div>
                          <p className="font-bold text-white">{st.name}</p>
                          <p className="text-[11px] text-white/50">
                            {st.department} • {st.company}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Progress {st.progress}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/40 italic p-3 text-center">Belum ada siswa bimbingan.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10 mt-6">
              <button
                type="button"
                onClick={() => setSelectedMentorDetail(null)}
                className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl font-semibold text-[13px] cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
