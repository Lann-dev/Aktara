import React, { useState, useMemo } from 'react';
import { StudentItem, UserRole } from '../../types';
import { MENTOR_STUDENTS } from '../../data/mockData';

interface StudentsViewProps {
  currentRole: UserRole;
  searchQuery?: string;
  onSelectStudent?: (studentName: string) => void;
  onExportStudents?: () => void;
  onAddNewStudent?: () => void;
}

const AVATAR_OPTIONS = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop', label: 'Dimas / Siswa Laki-laki 1' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop', label: 'Alya / Siswi Perempuan 1' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop', label: 'Bima / Siswa Laki-laki 2' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop', label: 'Citra / Siswi Perempuan 2' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop', label: 'Eko / Siswa Laki-laki 3' },
  { id: 'av-6', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop', label: 'Nadia / Siswi Perempuan 3' },
];

export const StudentsView: React.FC<StudentsViewProps> = ({
  currentRole,
  searchQuery = '',
  onSelectStudent,
  onExportStudents,
  onAddNewStudent,
}) => {
  const [students, setStudents] = useState<StudentItem[]>(MENTOR_STUDENTS);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentItem | null>(null);

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nisn: '',
    department: 'Rekayasa Perangkat Lunak (RPL)',
    classroom: 'XII RPL 1',
    company: 'PT Telkom Indonesia (Persero) Tbk',
    mentor: 'Bayu Pratama, S.T.',
    teacherMentor: 'Hendra Setiawan, S.Pd., M.T.',
    avatar: AVATAR_OPTIONS[0].url,
    agreeTerms: true,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const isReadOnly = currentRole === 'viewer_dinas';

  // Extract unique departments
  const departments = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => set.add(s.department));
    return Array.from(set);
  }, [students]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = students.length;
    const activeCount = students.filter((s) => s.status === 'Active').length;
    const avgAttendance =
      total > 0 ? Math.round(students.reduce((acc, s) => acc + s.attendanceRate, 0) / total) : 95;
    const avgCompetency =
      total > 0 ? Math.round(students.reduce((acc, s) => acc + s.competencyProgress, 0) / total) : 75;

    return {
      total,
      activeCount,
      avgAttendance,
      avgCompetency,
    };
  }, [students]);

  // Filtered Students
  const effectiveSearch = localSearch || searchQuery;
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = effectiveSearch.toLowerCase();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.company.toLowerCase().includes(q) ||
        s.mentor.toLowerCase().includes(q);

      const matchDept = selectedDept === 'ALL' || s.department.includes(selectedDept);
      const matchStatus = selectedStatus === 'ALL' || s.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchDept && matchStatus;
    });
  }, [students, effectiveSearch, selectedDept, selectedStatus]);

  // Trigger Notification Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Form submission handler
  const handleSubmitAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Nama lengkap siswa wajib diisi';
    }
    if (!formData.nisn.trim()) {
      errors.nisn = 'NISN wajib diisi (10 digit)';
    } else if (!/^\d{8,12}$/.test(formData.nisn.trim())) {
      errors.nisn = 'Format NISN harus berupa angka (8-12 digit)';
    }
    if (!formData.company.trim()) {
      errors.company = 'Perusahaan mitra penempatan wajib dipilih';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Create new student record
    const newStudent: StudentItem = {
      id: `stud-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      avatar: formData.avatar,
      department: formData.department,
      company: formData.company,
      mentor: formData.mentor,
      attendanceRate: 100,
      journalsSubmitted: 0,
      journalsTotal: 24,
      competencyProgress: 0,
      status: 'Active',
    };

    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Peserta didik baru "${newStudent.name}" berhasil didaftarkan ke ${newStudent.company}!`);
    setIsAddModalOpen(false);

    // Reset Form
    setFormData({
      name: '',
      nisn: '',
      department: 'Rekayasa Perangkat Lunak (RPL)',
      classroom: 'XII RPL 1',
      company: 'PT Telkom Indonesia (Persero) Tbk',
      mentor: 'Bayu Pratama, S.T.',
      teacherMentor: 'Hendra Setiawan, S.Pd., M.T.',
      avatar: AVATAR_OPTIONS[0].url,
      agreeTerms: true,
    });
    setFormErrors({});
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[120] animate-bounce-short bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-3 backdrop-blur-md">
          <span className="material-symbols-outlined text-[22px] text-emerald-200">check_circle</span>
          <span className="text-[13px] font-bold tracking-wide">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-[#0c1024]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">group</span>
              <span>Modul 8.5 • Direktori & Pelacakan Progres Siswa Magang</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Direktori & Pemantauan Peserta Magang Vokasi
            </h2>
            <p className="text-[14px] text-white/70 mt-1 max-w-3xl leading-relaxed">
              Tata kelola peserta didik magang <strong className="text-white">SMK Negeri 1 Jakarta</strong>, pemantauan kehadiran presensi GPS, kepatuhan pengisian logbook harian, serta capaian target unit kompetensi industri (SKKNI).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onExportStudents && (
              <button
                type="button"
                onClick={onExportStudents}
                className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/15 rounded-2xl text-[13px] font-bold cursor-pointer transition-all flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] text-blue-400">download</span>
                <span>Ekspor Rekap Siswa</span>
              </button>
            )}

            {!isReadOnly && (
              <button
                type="button"
                id="btn-add-student-main"
                onClick={() => {
                  setIsAddModalOpen(true);
                  if (onAddNewStudent) {
                    onAddNewStudent();
                  }
                }}
                className="relative px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white rounded-2xl text-[13px] font-bold shadow-xl shadow-blue-950/60 hover:shadow-cyan-500/25 hover:scale-[1.03] active:scale-[0.98] cursor-pointer transition-all duration-300 flex items-center gap-2.5 ring-2 ring-blue-400/50 hover:ring-cyan-300/80 group overflow-hidden"
              >
                <span className="material-symbols-outlined text-[19px] transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110">
                  person_add
                </span>
                <span className="tracking-wide">Tambah Siswa</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white border border-white/30 ml-1">
                  Baru
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Total Siswa Magang</span>
            <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 material-symbols-outlined text-[20px]">
              group
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-white">{metrics.total}</span>
              <span className="text-[12px] text-emerald-400 font-bold">({metrics.activeCount} Aktif On-Site)</span>
            </div>
            <p className="text-[12px] text-white/50 mt-0.5">Peserta magang terdaftar di DUDI</p>
          </div>
        </div>

        {/* Kehadiran Rata-rata */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Rata-rata Presensi</span>
            <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 material-symbols-outlined text-[20px]">
              event_available
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-emerald-400">{metrics.avgAttendance}%</span>
              <span className="text-[12px] text-white/60">Disiplin Tinggi</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.avgAttendance}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-300 font-semibold mt-1.5 flex justify-between">
              <span>GPS Geofence Terverifikasi</span>
              <span>100% Valid</span>
            </p>
          </div>
        </div>

        {/* Capaian Kompetensi */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Capaian Kompetensi</span>
            <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 material-symbols-outlined text-[20px]">
              verified
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-purple-400">{metrics.avgCompetency}%</span>
              <span className="text-[12px] text-white/60 font-medium">SKKNI</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.avgCompetency}%` }}
              />
            </div>
            <p className="text-[11px] text-purple-300 font-semibold mt-1.5">
              Standar Dunia Kerja & Industri
            </p>
          </div>
        </div>

        {/* Kepatuhan Jurnal */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Kepatuhan Jurnal</span>
            <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 material-symbols-outlined text-[20px]">
              menu_book
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[30px] font-black text-amber-300">96.8%</span>
            <span className="text-[12px] text-white/60 ml-2 font-medium">Pengisian Rutin</span>
            <p className="text-[12px] text-white/50 mt-1">Diverifikasi pembimbing harian</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
            search
          </span>
          <input
            id="search-students-input"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Cari nama siswa, jurusan, perusahaan mitra..."
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
          {/* Department Filter */}
          <select
            id="filter-student-dept"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer max-w-[200px] truncate"
          >
            <option value="ALL" className="bg-[#0f172a] text-white">Semua Jurusan</option>
            {departments.map((d) => (
              <option key={d} value={d} className="bg-[#0f172a] text-white">
                {d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="filter-student-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0f172a] text-white">Semua Status</option>
            <option value="Active" className="bg-[#0f172a] text-white">Active (Sedang Magang)</option>
            <option value="Completed" className="bg-[#0f172a] text-white">Completed (Selesai)</option>
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

      {/* Content: Grid or Table */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10 my-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/40">
            <span className="material-symbols-outlined text-[36px]">group_off</span>
          </div>
          <h3 className="text-[18px] font-bold text-white">Tidak ada peserta didik yang cocok</h3>
          <p className="text-[13px] text-white/50 max-w-md mx-auto mt-1">
            Silakan sesuaikan kata kunci pencarian atau daftarkan peserta didik baru melalui tombol Tambah Siswa.
          </p>
          <button
            onClick={() => {
              setLocalSearch('');
              setSelectedDept('ALL');
              setSelectedStatus('ALL');
            }}
            className="mt-4 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((student) => (
            <div
              key={student.id}
              className="glass-card rounded-2xl border border-white/10 p-5 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-200 group"
            >
              <div>
                {/* Header: Avatar, Name, Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-xl object-cover border border-white/15 shadow-md"
                    />
                    <div className="min-w-0">
                      <h4 className="text-[15px] font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                        {student.name}
                      </h4>
                      <p className="text-[11px] text-blue-300 truncate font-medium">{student.department}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    {student.status}
                  </span>
                </div>

                {/* Company & Mentor Info */}
                <div className="bg-white/[0.03] p-3 rounded-xl border border-white/10 space-y-1.5 text-[11px] mb-4">
                  <div className="flex items-center gap-1.5 text-white/90 font-medium">
                    <span className="material-symbols-outlined text-[15px] text-blue-400">domain</span>
                    <span className="truncate">{student.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60">
                    <span className="material-symbols-outlined text-[15px] text-indigo-400">badge</span>
                    <span className="truncate">Mentor: {student.mentor}</span>
                  </div>
                </div>

                {/* Bars: Attendance & Competencies */}
                <div className="space-y-2.5 mb-4">
                  <div>
                    <div className="flex justify-between items-center text-[11px] font-medium text-white/60 mb-1">
                      <span>Tingkat Presensi:</span>
                      <span className="text-emerald-400 font-bold">{student.attendanceRate}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${student.attendanceRate}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[11px] font-medium text-white/60 mb-1">
                      <span>Target Kompetensi:</span>
                      <span className="text-purple-400 font-bold">{student.competencyProgress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${student.competencyProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Journal Counts */}
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between items-center text-[11px] text-white/60">
                  <span>Logbook Jurnal Terkirim:</span>
                  <span className="font-bold text-white">
                    {student.journalsSubmitted} / {student.journalsTotal} Jurnal
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/10 mt-4">
                <button
                  type="button"
                  onClick={() => setSelectedStudentDetail(student)}
                  className="flex-1 py-2 px-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-xl text-[12px] font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px] text-blue-400">visibility</span>
                  <span>Rincian Profil</span>
                </button>

                {onSelectStudent && (
                  <button
                    type="button"
                    onClick={() => onSelectStudent(student.name)}
                    className="p-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-xl text-blue-300 hover:text-white transition-colors cursor-pointer"
                    title="Buka Logbook & Nilai"
                  >
                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] text-white/80">
              <thead className="border-b border-white/10 text-white/40 text-[10px] uppercase tracking-wider bg-white/[0.02]">
                <tr>
                  <th className="py-3 px-4">Nama Siswa & Jurusan</th>
                  <th className="py-3 px-4">Mitra DUDI & Mentor</th>
                  <th className="py-3 px-4 text-center">Presensi</th>
                  <th className="py-3 px-4 text-center">Kompetensi</th>
                  <th className="py-3 px-4 text-center">Jurnal</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-9 h-9 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <p className="font-bold text-white">{student.name}</p>
                          <p className="text-[11px] text-blue-300">{student.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white/90">{student.company}</div>
                      <div className="text-[11px] text-white/50">Mentor: {student.mentor}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-emerald-400">{student.attendanceRate}%</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-purple-400">{student.competencyProgress}%</span>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-white">
                      {student.journalsSubmitted} / {student.journalsTotal}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentDetail(student)}
                          className="p-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-lg text-blue-300 transition-colors cursor-pointer"
                          title="Lihat Profil"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        {onSelectStudent && (
                          <button
                            type="button"
                            onClick={() => onSelectStudent(student.name)}
                            className="p-1.5 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg text-blue-200 transition-colors cursor-pointer"
                            title="Buka Logbook"
                          >
                            <span className="material-symbols-outlined text-[16px]">menu_book</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL DRAWER */}
      {selectedStudentDetail && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedStudentDetail(null);
          }}
          className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div className="glass-card bg-[#0e1228]/95 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-white/15 text-white my-8 relative">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentDetail.avatar}
                  alt={selectedStudentDetail.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-white/15 shadow-lg"
                />
                <div>
                  <h3 className="text-[18px] font-bold text-white">{selectedStudentDetail.name}</h3>
                  <p className="text-[12px] text-blue-300 font-medium">{selectedStudentDetail.department}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Perusahaan Mitra</span>
                  <p className="font-bold text-white mt-0.5">{selectedStudentDetail.company}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Mentor Lapangan</span>
                  <p className="font-bold text-white mt-0.5">{selectedStudentDetail.mentor}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Tingkat Kehadiran</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{selectedStudentDetail.attendanceRate}%</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Capaian Kompetensi</span>
                  <p className="font-bold text-purple-400 mt-0.5">{selectedStudentDetail.competencyProgress}%</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-2">
                <h4 className="font-bold text-blue-300 text-[12px] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Status Verifikasi Administrasi Vokasi</span>
                </h4>
                <p className="text-[12px] text-white/70">
                  Siswa terdaftar resmi dalam program PKL Semester Genap 2025/2026 SMK Negeri 1 Jakarta. Seluruh berkas pakta integritas dan asuransi K3 industri telah tervalidasi.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10 mt-6">
              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl font-semibold text-[13px] cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH SISWA BARU */}
      {isAddModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
          className="fixed inset-0 bg-black/85 z-[110] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div className="glass-card bg-[#0b0f24]/95 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-blue-500/30 text-white my-8 relative">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <span className="material-symbols-outlined text-[24px]">person_add</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase border border-blue-500/30">
                    Modul 8.5 • Pendaftaran Siswa
                  </div>
                  <h3 className="text-[20px] font-black text-white mt-1">Tambah Peserta Didik Magang</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitAddStudent} className="mt-5 space-y-4 text-[13px]">
              {/* Row 1: Nama & NISN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Nama Lengkap Siswa <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                      badge
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Rizky Pratama"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                      }}
                      className="w-full pl-10 pr-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/30 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-rose-400 text-[11px] mt-1 font-semibold">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    NISN (Nomor Induk) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                      pin
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      placeholder="Contoh: 0078492019"
                      value={formData.nisn}
                      onChange={(e) => {
                        setFormData({ ...formData, nisn: e.target.value });
                        if (formErrors.nisn) setFormErrors({ ...formErrors, nisn: '' });
                      }}
                      className="w-full pl-10 pr-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/30 text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  {formErrors.nisn && (
                    <p className="text-rose-400 text-[11px] mt-1 font-semibold">{formErrors.nisn}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Jurusan & Kelas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Konsentrasi Keahlian / Jurusan <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0e142e] border border-white/15 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                  >
                    <option value="Rekayasa Perangkat Lunak (RPL)">Rekayasa Perangkat Lunak (RPL)</option>
                    <option value="Teknik Komputer & Jaringan (TKJ)">Teknik Komputer & Jaringan (TKJ)</option>
                    <option value="Desain Komunikasi Visual (DKV)">Desain Komunikasi Visual (DKV)</option>
                    <option value="Teknik Kendaraan Ringan Otomotif (TKRO)">Teknik Kendaraan Ringan Otomotif (TKRO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Rombel / Kelas
                  </label>
                  <select
                    value={formData.classroom}
                    onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0e142e] border border-white/15 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                  >
                    <option value="XII RPL 1">XII RPL 1</option>
                    <option value="XII RPL 2">XII RPL 2</option>
                    <option value="XII TKJ 1">XII TKJ 1</option>
                    <option value="XII TKJ 2">XII TKJ 2</option>
                    <option value="XII DKV 1">XII DKV 1</option>
                    <option value="XII TKRO 1">XII TKRO 1</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Perusahaan Mitra & Mentor Industri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Perusahaan Mitra DUDI Penempatan <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.company}
                    onChange={(e) => {
                      const comp = e.target.value;
                      let defaultMentor = 'Bayu Pratama, S.T.';
                      if (comp.includes('Astra')) defaultMentor = 'Ratna Kusuma, S.Kom';
                      if (comp.includes('Mandiri')) defaultMentor = 'Dewi Lestari, S.Ds';
                      if (comp.includes('Bukalapak')) defaultMentor = 'Ir. Rahmat Hidayat';
                      setFormData({ ...formData, company: comp, mentor: defaultMentor });
                      if (formErrors.company) setFormErrors({ ...formErrors, company: '' });
                    }}
                    className="w-full px-3 py-2.5 bg-[#0e142e] border border-white/15 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                  >
                    <option value="PT Telkom Indonesia (Persero) Tbk">PT Telkom Indonesia (Persero) Tbk</option>
                    <option value="PT Astra International Tbk">PT Astra International Tbk</option>
                    <option value="Bank Mandiri (Persero) Tbk">Bank Mandiri (Persero) Tbk</option>
                    <option value="PT Bukalapak.com Tbk">PT Bukalapak.com Tbk</option>
                    <option value="Auto2000 Astra Otomotif">Auto2000 Astra Otomotif</option>
                  </select>
                  {formErrors.company && (
                    <p className="text-rose-400 text-[11px] mt-1 font-semibold">{formErrors.company}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Mentor Lapangan DUDI
                  </label>
                  <input
                    type="text"
                    value={formData.mentor}
                    onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                    placeholder="Nama Mentor Industri"
                    className="w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Row 4: Guru Pembimbing Sekolah */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Guru Pembimbing Sekolah SMK Negeri 1 Jakarta
                </label>
                <select
                  value={formData.teacherMentor}
                  onChange={(e) => setFormData({ ...formData, teacherMentor: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0e142e] border border-white/15 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                >
                  <option value="Hendra Setiawan, S.Pd., M.T.">Hendra Setiawan, S.Pd., M.T. (Jurusan RPL)</option>
                  <option value="Sri Wahyuni, S.Kom">Sri Wahyuni, S.Kom (Jurusan TKJ)</option>
                  <option value="Drs. H. Mulyono, M.Pd.">Drs. H. Mulyono, M.Pd. (Kepala Program Magang)</option>
                </select>
              </div>

              {/* Row 5: Pilihan Foto Profil / Avatar */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-2">
                  Pilih Foto Profil Siswa
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((av) => {
                    const isSelected = formData.avatar === av.url;
                    return (
                      <button
                        type="button"
                        key={av.id}
                        onClick={() => setFormData({ ...formData, avatar: av.url })}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                            : 'border-white/10 hover:border-white/40 opacity-70 hover:opacity-100'
                        }`}
                        title={av.label}
                      >
                        <img src={av.url} alt={av.label} className="w-full h-12 object-cover rounded-lg" />
                        {isSelected && (
                          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full flex items-center justify-center text-[10px] text-black font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pakta Integritas Checkbox */}
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/25 flex items-start gap-3 mt-2">
                <input
                  type="checkbox"
                  id="check-agree-terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="check-agree-terms" className="text-[12px] text-white/80 cursor-pointer leading-relaxed">
                  Menyetujui pendaftaran penempatan magang resmi siswa sesuai <strong className="text-blue-300">MoU Industri & Standar K3 Vokasi</strong>. Siswa akan otomatis mendapatkan akses presensi GPS dan logbook digital.
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-xl font-bold text-[13px] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!formData.agreeTerms}
                  className={`px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                    formData.agreeTerms
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-blue-900/50 hover:scale-[1.02]'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Daftarkan Siswa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
