import React, { useState, useMemo } from 'react';
import { ProgramCohort } from '../../types';

interface AdminProgramsViewProps {
  programs: ProgramCohort[];
  onCreateProgram: () => void;
  onViewApps: (prog: ProgramCohort) => void;
  onViewCompetencies: (prog: ProgramCohort) => void;
  onViewPlacements: (prog: ProgramCohort) => void;
  searchQuery?: string;
  isReadOnly?: boolean;
}

export const AdminProgramsView: React.FC<AdminProgramsViewProps> = ({
  programs,
  onCreateProgram,
  onViewApps,
  onViewCompetencies,
  onViewPlacements,
  searchQuery = '',
  isReadOnly = false,
}) => {
  const [activeSection, setActiveSection] = useState<'cohorts' | 'departments' | 'timeline'>('cohorts');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedProgramDetail, setSelectedProgramDetail] = useState<ProgramCohort | null>(null);

  // Extract unique academic years & departments
  const academicYears = useMemo(() => {
    const set = new Set<string>();
    programs.forEach((p) => {
      if (p.academicYear) set.add(p.academicYear);
    });
    return Array.from(set);
  }, [programs]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    programs.forEach((p) => {
      if (p.department) set.add(p.department);
    });
    return Array.from(set);
  }, [programs]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalPrograms = programs.length;
    const runningPrograms = programs.filter((p) => p.status === 'RUNNING').length;
    const openPrograms = programs.filter((p) => p.status === 'OPEN').length;
    const totalEnrolled = programs.reduce((acc, p) => acc + (p.enrolled || 0), 0);
    const totalCapacity = programs.reduce((acc, p) => acc + (p.capacity || 0), 0);
    const avgCompetency =
      programs.length > 0
        ? Math.round(programs.reduce((acc, p) => acc + (p.competencyCount || 0), 0) / programs.length)
        : 16;
    const occupancyRate = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

    return {
      totalPrograms,
      runningPrograms,
      openPrograms,
      totalEnrolled,
      totalCapacity,
      avgCompetency,
      occupancyRate,
    };
  }, [programs]);

  // Department Allocation Stats
  const departmentStats = useMemo(() => {
    const depts = [
      {
        code: 'RPL',
        name: 'Rekayasa Perangkat Lunak',
        capacity: 50,
        enrolled: 48,
        partners: ['PT Telkom Indonesia (Persero) Tbk', 'Bank Mandiri (Persero) Tbk'],
        color: 'from-blue-600 to-indigo-600',
        textColor: 'text-blue-400',
        icon: 'terminal',
        competencies: 'Software Engineering, Full-Stack Web, REST API, Cloud Database',
      },
      {
        code: 'TKJ',
        name: 'Teknik Komputer & Jaringan',
        capacity: 45,
        enrolled: 42,
        partners: ['PT Astra International Tbk', 'PT Telkom Indonesia (Persero) Tbk'],
        color: 'from-indigo-600 to-purple-600',
        textColor: 'text-indigo-400',
        icon: 'lan',
        competencies: 'Network Administration, Cisco Switching, Fiber Optic, Linux Server',
      },
      {
        code: 'DKV',
        name: 'Desain Komunikasi Visual',
        capacity: 30,
        enrolled: 26,
        partners: ['Bank Mandiri (Persero) Tbk', 'Studio Kreatif Digital'],
        color: 'from-purple-600 to-pink-600',
        textColor: 'text-purple-400',
        icon: 'palette',
        competencies: 'UI/UX Design, Motion Graphics, Branding Identity, Figma Prototyping',
      },
      {
        code: 'TKRO',
        name: 'Teknik Kendaraan Ringan Otomotif',
        capacity: 50,
        enrolled: 50,
        partners: ['PT Astra International Tbk (Auto2000)', 'Bengkel Resmi DUDI'],
        color: 'from-amber-600 to-orange-600',
        textColor: 'text-amber-400',
        icon: 'directions_car',
        competencies: 'Engine Diagnostic Scanner, EFI Tuning, Automatic Transmission, Brake Safety',
      },
    ];
    return depts;
  }, []);

  // Filter programs based on selected filters and search
  const effectiveSearch = localSearch || searchQuery;
  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const q = effectiveSearch.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.duration.toLowerCase().includes(q);

      const matchYear = selectedYear === 'All Years' || p.academicYear === selectedYear;
      const matchStatus = selectedStatus === 'All Statuses' || p.status === selectedStatus;
      const matchDept = selectedDept === 'All Departments' || p.department.includes(selectedDept);

      return matchSearch && matchYear && matchStatus && matchDept;
    });
  }, [programs, effectiveSearch, selectedYear, selectedStatus, selectedDept]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
          label: 'Sedang Berjalan',
        };
      case 'OPEN':
        return {
          bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400',
          label: 'Pendaftaran Buka',
        };
      case 'COMPLETED':
        return {
          bg: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          dot: 'bg-slate-400',
          label: 'Selesai',
        };
      default:
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          label: 'Draft',
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Top Banner Header Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-[#0c1024]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">folder_special</span>
              <span>Modul 8.3 • Kurikulum Magang & Manajemen Kohort Vokasi</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Internship Programs & Cohort Management
            </h2>
            <p className="text-[14px] text-white/70 mt-1 max-w-3xl leading-relaxed">
              Pusat tata kelola program pemagangan terpadu <strong className="text-white">SMK Negeri 1 Jakarta</strong>, penyelarasan kurikulum berbasis industri (DUDI), penetapan alokasi kuota per konsentrasi keahlian, alur seleksi & penempatan, serta kalender siklus magang 2026/2027.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isReadOnly && (
              <button
                type="button"
                id="create-program-top-btn"
                onClick={onCreateProgram}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-violet-950/60 hover:shadow-violet-900/70 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-200 flex items-center gap-2 ring-1 ring-violet-400/40"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Buat Batch / Program Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* View Mode Sub-tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto hide-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSection('cohorts')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'cohorts'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40 border border-violet-500/40'
                : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">format_list_bulleted</span>
            <span>Daftar Batch Program ({programs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('departments')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'departments'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40 border border-violet-500/40'
                : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">pie_chart</span>
            <span>Alokasi Kuota per Konsentrasi Keahlian</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('timeline')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'timeline'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40 border border-violet-500/40'
                : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">calendar_month</span>
            <span>Kalender Siklus & Milestone Magang</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Program */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Total Program Kohort</span>
            <span className="p-2.5 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 material-symbols-outlined text-[20px]">
              folder_special
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-white">{metrics.totalPrograms}</span>
              <span className="text-[12px] text-emerald-400 font-bold">({metrics.runningPrograms} Berjalan)</span>
            </div>
            <p className="text-[12px] text-white/50 mt-0.5">Program aktif SMK Negeri 1 Jakarta</p>
          </div>
        </div>

        {/* Siswa Terdaftar */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Siswa Terdaftar (Enrolled)</span>
            <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 material-symbols-outlined text-[20px]">
              group
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-blue-400">{metrics.totalEnrolled}</span>
              <span className="text-[13px] text-white/50 font-medium">/ {metrics.totalCapacity} Siswa</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(metrics.occupancyRate, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-blue-300 font-semibold mt-1.5 flex justify-between">
              <span>Okupansi Kuota Kelas</span>
              <span>{metrics.occupancyRate}%</span>
            </p>
          </div>
        </div>

        {/* Status Pendaftaran */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Pendaftaran Terbuka</span>
            <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 material-symbols-outlined text-[20px]">
              how_to_reg
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[30px] font-black text-emerald-300">{metrics.openPrograms}</span>
            <span className="text-[12px] text-white/60 ml-2 font-medium">Batch Siap Dilamar</span>
            <p className="text-[12px] text-white/50 mt-1">Siswa dapat mengajukan magang</p>
          </div>
        </div>

        {/* Target Kompetensi */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Standar Kompetensi</span>
            <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 material-symbols-outlined text-[20px]">
              verified
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[30px] font-black text-amber-300">{metrics.avgCompetency}</span>
            <span className="text-[12px] text-white/60 ml-2 font-medium">Unit / Program</span>
            <p className="text-[12px] text-white/50 mt-1">Tersinkronisasi SKKNI & DUDI</p>
          </div>
        </div>
      </div>

      {/* SUB-SECTION 1: BATCH COHORTS LIST */}
      {activeSection === 'cohorts' && (
        <div className="space-y-6">
          {/* Control Bar: Search, Filters & View Toggle */}
          <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                search
              </span>
              <input
                id="search-internship-programs-input"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Cari nama program, jurusan, durasi..."
                className="w-full pl-10 pr-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/40 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500/50"
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
              {/* Academic Year Filter */}
              <select
                id="program-filter-academic-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
              >
                <option value="All Years" className="bg-[#0f172a] text-white">Semua Tahun Ajaran</option>
                {academicYears.map((yr) => (
                  <option key={yr} value={yr} className="bg-[#0f172a] text-white">
                    {yr}
                  </option>
                ))}
              </select>

              {/* Department Filter */}
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer max-w-[200px] truncate"
              >
                <option value="All Departments" className="bg-[#0f172a] text-white">Semua Jurusan</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="bg-[#0f172a] text-white">
                    {dept}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                id="program-filter-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer"
              >
                <option value="All Statuses" className="bg-[#0f172a] text-white">Semua Status</option>
                <option value="RUNNING" className="bg-[#0f172a] text-white">RUNNING (Berjalan)</option>
                <option value="OPEN" className="bg-[#0f172a] text-white">OPEN (Pendaftaran)</option>
                <option value="COMPLETED" className="bg-[#0f172a] text-white">COMPLETED (Selesai)</option>
                <option value="DRAFT" className="bg-[#0f172a] text-white">DRAFT</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-violet-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
                  }`}
                  title="Tampilan Grid Kartu"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'table' ? 'bg-violet-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
                  }`}
                  title="Tampilan Tabel Data"
                >
                  <span className="material-symbols-outlined text-[18px]">table_rows</span>
                </button>
              </div>
            </div>
          </div>

          {/* Program Content: Grid or Table */}
          {filtered.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-white/10 my-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/40">
                <span className="material-symbols-outlined text-[36px]">folder_off</span>
              </div>
              <h3 className="text-[18px] font-bold text-white">Tidak ada program yang sesuai kriteria</h3>
              <p className="text-[13px] text-white/50 max-w-md mx-auto mt-1">
                Silakan sesuaikan kata kunci pencarian atau ubah opsi filter tahun ajaran, jurusan, dan status program.
              </p>
              <button
                onClick={() => {
                  setLocalSearch('');
                  setSelectedYear('All Years');
                  setSelectedStatus('All Statuses');
                  setSelectedDept('All Departments');
                }}
                className="mt-4 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filtered.map((prog) => {
                const fillPercentage = Math.round(((prog.enrolled || 0) / (prog.capacity || 1)) * 100);
                const statusConfig = getStatusBadge(prog.status);

                return (
                  <div
                    key={prog.id}
                    id={`program-card-${prog.id}`}
                    className="glass-card rounded-2xl border border-white/10 shadow-xl overflow-hidden flex flex-col glass-card-hover transition-all group hover:border-violet-500/40"
                  >
                    {/* Card Header & Body */}
                    <div className="p-6 border-b border-white/10 flex-1">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="min-w-0">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/[0.06] text-violet-300 border border-violet-500/20 mb-1.5">
                            {prog.academicYear} • {prog.department}
                          </span>
                          <h3 className="text-[18px] font-bold text-white group-hover:text-violet-300 transition-colors leading-snug">
                            {prog.title}
                          </h3>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shrink-0 flex items-center gap-1.5 ${statusConfig.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                          <span>{prog.status}</span>
                        </span>
                      </div>

                      <p className="text-[13px] text-white/60 line-clamp-2 mt-2 leading-relaxed">
                        {prog.description}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-[12px]">
                        <div>
                          <p className="font-semibold text-white/50 text-[11px] uppercase tracking-wider mb-0.5">
                            Periode Magang
                          </p>
                          <p className="text-white flex items-center font-medium truncate">
                            <span className="material-symbols-outlined text-[15px] mr-1 text-violet-400">
                              calendar_today
                            </span>
                            <span>{prog.duration}</span>
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold text-white/50 text-[11px] uppercase tracking-wider mb-0.5">
                            Target SKKNI
                          </p>
                          <p className="text-amber-300 flex items-center font-semibold">
                            <span className="material-symbols-outlined text-[15px] mr-1">verified</span>
                            <span>{prog.competencyCount || 16} Unit</span>
                          </p>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <p className="font-semibold text-white/50 text-[11px] uppercase tracking-wider mb-0.5">
                            Okupansi Kuota
                          </p>
                          <p className="text-white font-semibold">
                            {prog.enrolled}/{prog.capacity}{' '}
                            <span className="text-[11px] text-violet-300">({fillPercentage}%)</span>
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            fillPercentage >= 95
                              ? 'bg-rose-500'
                              : fillPercentage >= 75
                              ? 'bg-gradient-to-r from-violet-500 to-indigo-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons Bar */}
                    <div className="p-3.5 bg-white/[0.02] flex flex-wrap items-center justify-between gap-2 mt-auto">
                      <button
                        type="button"
                        id={`program-btn-view-apps-${prog.id}`}
                        onClick={() => onViewApps(prog)}
                        className="flex-1 py-2 px-3 text-[12px] font-bold text-white/80 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all flex items-center justify-center border border-white/10 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] mr-1 text-blue-400">group</span>
                        <span>Pelamar ({prog.enrolled})</span>
                      </button>

                      <button
                        type="button"
                        id={`program-btn-competencies-${prog.id}`}
                        onClick={() => onViewCompetencies(prog)}
                        className="flex-1 py-2 px-3 text-[12px] font-bold text-white/80 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all flex items-center justify-center border border-white/10 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] mr-1 text-amber-400">assignment</span>
                        <span>Kompetensi</span>
                      </button>

                      <button
                        type="button"
                        id={`program-btn-placements-${prog.id}`}
                        onClick={() => onViewPlacements(prog)}
                        className="flex-1 py-2 px-3 text-[12px] font-bold text-violet-200 hover:text-white bg-violet-600/20 hover:bg-violet-600/40 rounded-xl transition-all flex items-center justify-center border border-violet-500/30 cursor-pointer"
                      >
                        <span>Penempatan</span>
                        <span className="material-symbols-outlined ml-1 text-[16px]">arrow_forward</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedProgramDetail(prog)}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl border border-white/10 transition-colors cursor-pointer"
                        title="Detail Lengkap Program"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
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
                      <th className="py-3 px-4">Nama Program & Jurusan</th>
                      <th className="py-3 px-4">Tahun Ajaran</th>
                      <th className="py-3 px-4">Periode Magang</th>
                      <th className="py-3 px-4 text-center">Kapasitas Siswa</th>
                      <th className="py-3 px-4 text-center">SKKNI</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((prog) => {
                      const fillPercentage = Math.round(((prog.enrolled || 0) / (prog.capacity || 1)) * 100);
                      const statusConfig = getStatusBadge(prog.status);

                      return (
                        <tr key={prog.id} className="hover:bg-white/[0.04] transition-colors">
                          <td className="py-3 px-4">
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate max-w-sm">{prog.title}</p>
                              <p className="text-[11px] text-violet-300 truncate">{prog.department}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-white/80">
                            {prog.academicYear}
                          </td>
                          <td className="py-3 px-4 text-white/70">
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px] text-violet-400">calendar_today</span>
                              <span>{prog.duration}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="font-bold text-white">
                              {prog.enrolled} / {prog.capacity}
                            </span>
                            <span className="block text-[10px] text-violet-400">({fillPercentage}%)</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              {prog.competencyCount || 16} Unit
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${statusConfig.bg}`}
                            >
                              {prog.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => onViewApps(prog)}
                                className="p-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-lg text-blue-300 transition-colors cursor-pointer"
                                title="Lihat Pelamar"
                              >
                                <span className="material-symbols-outlined text-[16px]">group</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => onViewCompetencies(prog)}
                                className="p-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-lg text-amber-300 transition-colors cursor-pointer"
                                title="Kelola Standar Kompetensi"
                              >
                                <span className="material-symbols-outlined text-[16px]">assignment</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => onViewPlacements(prog)}
                                className="p-1.5 bg-violet-500/20 hover:bg-violet-500/40 rounded-lg text-violet-200 transition-colors cursor-pointer"
                                title="Penempatan DUDI"
                              >
                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedProgramDetail(prog)}
                                className="p-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-lg text-white/70 transition-colors cursor-pointer"
                                title="Detail Program"
                              >
                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-SECTION 2: ALOKASI KUOTA JURUSAN */}
      {activeSection === 'departments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {departmentStats.map((dept) => {
              const percent = Math.round((dept.enrolled / dept.capacity) * 100);
              return (
                <div
                  key={dept.code}
                  className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col justify-between hover:border-violet-500/40 transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-white shadow-lg`}
                        >
                          <span className="material-symbols-outlined text-[24px]">{dept.icon}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
                            Konsentrasi Keahlian {dept.code}
                          </span>
                          <h4 className="text-[18px] font-bold text-white">{dept.name}</h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/[0.06] text-white border border-white/10">
                        {dept.capacity} Siswa
                      </span>
                    </div>

                    {/* Kuota Bar */}
                    <div className="bg-white/[0.03] p-4 rounded-xl border border-white/10 mb-4">
                      <div className="flex justify-between items-center text-[12px] mb-1.5">
                        <span className="text-white/60">Tingkat Penempatan Siswa:</span>
                        <span className="font-bold text-white">
                          {dept.enrolled} / {dept.capacity} Siswa ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${dept.color}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Competency Targets */}
                    <div className="text-[12px] mb-3">
                      <span className="text-white/50 font-bold uppercase text-[10px] block mb-1">
                        Capaian Target SKKNI & Industri
                      </span>
                      <p className="text-white/80 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                        {dept.competencies}
                      </p>
                    </div>

                    {/* Top Partners */}
                    <div className="text-[12px]">
                      <span className="text-white/50 font-bold uppercase text-[10px] block mb-1">
                        Mitra DUDI Rekanan Utama
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {dept.partners.map((partner) => (
                          <span
                            key={partner}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.06] text-white/90 border border-white/10"
                          >
                            {partner}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 mt-5 flex justify-between items-center text-[12px]">
                    <span className="text-white/50">Kurikulum Merdeka 2026/2027</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDept(dept.name);
                        setActiveSection('cohorts');
                      }}
                      className="text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Batch {dept.code}</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: TIMELINE SIKLUS MAGANG */}
      {activeSection === 'timeline' && (
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[20px] font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-violet-400">timeline</span>
                Garis Waktu Siklus Magang Tahun Ajaran 2026/2027
              </h3>
              <p className="text-[13px] text-white/50 mt-0.5">
                Alur tahapan komprehensif mulai dari pendaftaran hingga penerbitan sertifikat resmi ber-QR.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Siklus Aktif: Semester Genap
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              {
                step: '01',
                title: 'Sosialisasi & Pendaftaran Batch',
                date: 'Desember 2025 - Januari 2026',
                status: 'Selesai',
                statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                desc: 'Siswa memilih program pemagangan dan mengunggah berkas portofolio serta CV.',
                icon: 'how_to_reg',
              },
              {
                step: '02',
                title: 'Matching GANESA ID & Seleksi Mitra',
                date: '10 - 20 Januari 2026',
                status: 'Selesai',
                statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                desc: 'Pencocokan kompetensi siswa dengan kuota kebutuhan teknis industri secara otomatis.',
                icon: 'auto_awesome',
              },
              {
                step: '03',
                title: 'Pembekalan Pra-Magang & K3 Industri',
                date: '25 - 31 Januari 2026',
                status: 'Selesai',
                statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                desc: 'Pelatihan budaya kerja industri, etika profesional, dan standar keselamatan K3.',
                icon: 'school',
              },
              {
                step: '04',
                title: 'Onboarding & Pelaksanaan On-Site',
                date: 'Februari - Mei 2026',
                status: 'Sedang Berjalan',
                statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                desc: 'Siswa bertugas di unit industri, presensi geofence, pengisian logbook harian.',
                icon: 'business',
              },
              {
                step: '05',
                title: 'Supervisi Lapangan & Monitoring',
                date: 'Maret & April 2026',
                status: 'Sedang Berjalan',
                statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                desc: 'Kunjungan berkala guru pembimbing sekolah ke DUDI dan verifikasi jurnal berkala.',
                icon: 'location_on',
              },
              {
                step: '06',
                title: 'Ujian Sertifikasi & Penarikan Siswa',
                date: 'Juni 2026',
                status: 'Akan Datang',
                statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                desc: 'Uji kompetensi SKKNI industri, penilaian akhir mentor, dan penerbitan sertifikat digital ber-QR.',
                icon: 'workspace_premium',
              },
            ].map((milestone) => (
              <div
                key={milestone.step}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-[12px] font-black text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                      FASE {milestone.step}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${milestone.statusColor}`}
                    >
                      {milestone.status}
                    </span>
                  </div>
                  <h4 className="text-[15px] font-bold text-white flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-[18px] text-violet-300">
                      {milestone.icon}
                    </span>
                    <span>{milestone.title}</span>
                  </h4>
                  <p className="text-[11px] text-amber-300 font-semibold mb-2">
                    {milestone.date}
                  </p>
                  <p className="text-[12px] text-white/60 leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAIL PROGRAM MODAL */}
      {selectedProgramDetail && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedProgramDetail(null);
          }}
          className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div className="glass-card bg-[#0e1228]/95 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-white/15 text-white my-8 relative">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {selectedProgramDetail.academicYear} • {selectedProgramDetail.department}
                </span>
                <h3 className="text-[20px] font-bold text-white mt-1.5">{selectedProgramDetail.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProgramDetail(null)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-[13px]">
              <div>
                <span className="text-[11px] font-bold uppercase text-white/50">Deskripsi Kurikulum Program</span>
                <p className="text-white/80 mt-1 leading-relaxed bg-white/[0.03] p-3.5 rounded-xl border border-white/10">
                  {selectedProgramDetail.description}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Tahun Ajaran</span>
                  <p className="font-bold text-white mt-0.5">{selectedProgramDetail.academicYear}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Kapasitas Kuota</span>
                  <p className="font-bold text-violet-400 mt-0.5">
                    {selectedProgramDetail.enrolled} / {selectedProgramDetail.capacity} Siswa
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Target Kompetensi</span>
                  <p className="font-bold text-amber-300 mt-0.5">
                    {selectedProgramDetail.competencyCount || 16} Unit SKKNI
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Status Kohort</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{selectedProgramDetail.status}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20">
                <h4 className="font-bold text-violet-300 text-[13px] flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  <span>Jadwal & Garis Waktu Pelaksanaan Magang</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px] text-white/70">
                  <div>
                    <span className="text-white/40">Durasi Periode:</span>{' '}
                    <span className="font-medium text-white">{selectedProgramDetail.duration}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Tanggal Pelaksanaan:</span>{' '}
                    <span className="font-semibold text-white">
                      {selectedProgramDetail.startDate} s/d {selectedProgramDetail.endDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10 mt-6">
              <button
                type="button"
                onClick={() => {
                  const p = selectedProgramDetail;
                  setSelectedProgramDetail(null);
                  onViewApps(p);
                }}
                className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-xl font-bold text-[12px] cursor-pointer transition-colors"
              >
                Lihat Pelamar
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = selectedProgramDetail;
                  setSelectedProgramDetail(null);
                  onViewPlacements(p);
                }}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold text-[12px] cursor-pointer transition-colors shadow-lg"
              >
                Penempatan DUDI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
