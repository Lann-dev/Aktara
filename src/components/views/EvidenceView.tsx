import React, { useState, useMemo } from 'react';
import { UserRole } from '../../types';
import { ASSETS } from '../../data/mockData';

export interface EvidenceItem {
  id: string;
  studentName: string;
  studentAvatar: string;
  department: string;
  company: string;
  title: string;
  category: 'PHOTO' | 'CODE' | 'DESIGN' | 'DOCUMENT' | 'CERTIFICATE';
  description: string;
  fileUrl: string;
  thumbnailUrl: string;
  fileSize: string;
  submittedAt: string;
  verifiedByMentor: string | null;
  status: 'VERIFIED' | 'PENDING' | 'REVISION';
  feedback?: string;
  tags: string[];
}

const INITIAL_EVIDENCES: EvidenceItem[] = [
  {
    id: 'ev-01',
    studentName: 'Dimas Prasetyo Nugroho',
    studentAvatar: ASSETS.dimasAvatar,
    department: 'Rekayasa Perangkat Lunak (RPL)',
    company: 'PT Telkom Indonesia (Persero) Tbk',
    title: 'Repositori Microservice API Authentication & Supabase Realtime',
    category: 'CODE',
    description: 'Implementasi backend REST API menggunakan Node.js TypeScript dan sinkronisasi data WebSocket secara realtime.',
    fileUrl: 'https://github.com/dimas-dev/telkom-intern-auth-api',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop',
    fileSize: '14.2 MB (Git Repo)',
    submittedAt: '2026-08-30 14:20 WIB',
    verifiedByMentor: 'Bayu Pratama, S.T. (Mentor Industri)',
    status: 'VERIFIED',
    feedback: 'Arsitektur clean code sangat baik, implementasi JWT token dan rate limiter telah sesuai standar keamanan Telkom.',
    tags: ['TypeScript', 'Express.js', 'PostgreSQL', 'API Auth'],
  },
  {
    id: 'ev-02',
    studentName: 'Alya Putri',
    studentAvatar: ASSETS.alyaAvatar,
    department: 'Teknik Komputer & Jaringan (TKJ)',
    company: 'PT Astra International Tbk',
    title: 'Dokumentasi Terminasi Fiber Optic & Konfigurasi Cisco Core Switch',
    category: 'PHOTO',
    description: 'Dokumentasi foto proses pengelasan kabel serat optik (fusion splicing) dan perapihan patch cord di Server Room Lantai 4.',
    fileUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop',
    fileSize: '4.8 MB (High-Res JPG)',
    submittedAt: '2026-08-29 11:15 WIB',
    verifiedByMentor: 'Ratna Kusuma, S.Kom (Mentor Industri)',
    status: 'VERIFIED',
    feedback: 'Redaman optik berhasil dijaga di bawah 0.02 dB. Penerapan standar keselamatan kerja K3 dipatuhi dengan sangat baik.',
    tags: ['Fiber Optic', 'Cisco Switch', 'Server Rack', 'K3 Industri'],
  },
  {
    id: 'ev-03',
    studentName: 'Citra Dewi',
    studentAvatar: ASSETS.citraAvatar,
    department: 'Desain Komunikasi Visual (DKV)',
    company: 'Bank Mandiri (Persero) Tbk',
    title: 'UI Kit & Design System Komponen Fitur Transaksi Livin by Mandiri',
    category: 'DESIGN',
    description: 'Komponen desain antarmuka responsif Figma, color palette aksesibilitas WCAG AAA, dan prototype interaktif flow transfer valuta asing.',
    fileUrl: 'https://figma.com/@citradewi/mandiri-uikit',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop',
    fileSize: '82.4 MB (Figma Project)',
    submittedAt: '2026-08-28 16:45 WIB',
    verifiedByMentor: 'Dewi Lestari, S.Ds (Mentor Industri)',
    status: 'VERIFIED',
    feedback: 'Sangat rapi dalam penggunaan auto-layout dan atomic design token. Siap dioper ke tim frontend engineer.',
    tags: ['Figma', 'UI/UX', 'Design System', 'Accessibility'],
  },
  {
    id: 'ev-04',
    studentName: 'Bima Sakti',
    studentAvatar: ASSETS.bimaAvatar,
    department: 'Rekayasa Perangkat Lunak (RPL)',
    company: 'PT Telkom Indonesia (Persero) Tbk',
    title: 'Dokumen Laporan Analisis Kerentanan & Penetrasi Keamanan Web',
    category: 'DOCUMENT',
    description: 'Laporan teknis hasil audit keamanan web internal menggunakan OWASP ZAP dan rekomendasi patch mitigasi SQL injection.',
    fileUrl: 'https://storage.aktara.id/reports/bima-vuln-assessment.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop',
    fileSize: '3.1 MB (PDF Terenkripsi)',
    submittedAt: '2026-08-31 09:30 WIB',
    verifiedByMentor: null,
    status: 'PENDING',
    feedback: 'Menunggu review akhir dari tim Cyber Security PT Telkom.',
    tags: ['Cybersecurity', 'OWASP ZAP', 'Pen-testing', 'Audit Keamanan'],
  },
  {
    id: 'ev-05',
    studentName: 'Eko Wahyudi',
    studentAvatar: ASSETS.ekoAvatar,
    department: 'Teknik Komputer & Jaringan (TKJ)',
    company: 'PT Astra International Tbk',
    title: 'Dokumentasi Troubleshooting Gateway Router & Mikrotik Hotspot',
    category: 'PHOTO',
    description: 'Dokumentasi perbaikan konektivitas jaringan kantor cabang Astra dan pemisahan VLAN tamu dengan jaringan manajemen.',
    fileUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop',
    fileSize: '5.2 MB (JPG)',
    submittedAt: '2026-08-27 10:00 WIB',
    verifiedByMentor: 'Ratna Kusuma, S.Kom',
    status: 'VERIFIED',
    feedback: 'Bagus, konfigurasi firewall filter rule sudah tepat mencegah unauthorized ping.',
    tags: ['MikroTik', 'VLAN', 'Routing', 'Firewall'],
  },
  {
    id: 'ev-06',
    studentName: 'Dimas Prasetyo Nugroho',
    studentAvatar: ASSETS.dimasAvatar,
    department: 'Rekayasa Perangkat Lunak (RPL)',
    company: 'PT Telkom Indonesia (Persero) Tbk',
    title: 'Sertifikat Kelulusan Internal: Cloud Practitioner & Docker Basics',
    category: 'CERTIFICATE',
    description: 'Sertifikat kelulusan program internal onboarding engineering Telkom Landmark Tower dengan nilai akhir 96.0.',
    fileUrl: 'https://storage.aktara.id/certs/cert-telkom-cloud-dimas.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop',
    fileSize: '1.8 MB (PDF)',
    submittedAt: '2026-08-25 15:00 WIB',
    verifiedByMentor: 'Bayu Pratama, S.T.',
    status: 'VERIFIED',
    feedback: 'Tersertifikasi kompeten dalam deployment microservice container.',
    tags: ['Docker', 'Cloud Native', 'Sertifikasi DUDI'],
  },
];

const PRESET_THUMBNAILS = [
  { label: 'Source Code / Git', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop' },
  { label: 'Jaringan & Fiber Optic', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop' },
  { label: 'UI/UX & Desain', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop' },
  { label: 'Laporan Teknis / Audit', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop' },
  { label: 'Perangkat Hardware', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop' },
  { label: 'Sertifikat Industri', url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop' },
];

interface EvidenceViewProps {
  currentRole: UserRole;
  searchQuery?: string;
  onUploadEvidence?: () => void;
  onExportPortfolio?: () => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  currentRole,
  searchQuery = '',
  onUploadEvidence,
  onExportPortfolio,
}) => {
  const [evidences, setEvidences] = useState<EvidenceItem[]>(INITIAL_EVIDENCES);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDept] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedEvidenceDetail, setSelectedEvidenceDetail] = useState<EvidenceItem | null>(null);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false);
  const [portfolioProgress, setPortfolioProgress] = useState(0);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'CODE' as EvidenceItem['category'],
    studentName: 'Dimas Prasetyo Nugroho',
    department: 'Rekayasa Perangkat Lunak (RPL)',
    company: 'PT Telkom Indonesia (Persero) Tbk',
    description: '',
    fileUrl: '',
    thumbnailUrl: PRESET_THUMBNAILS[0].url,
    tagsInput: 'TypeScript, PostgreSQL, REST API',
  });
  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>({});

  const isMentor = currentRole === 'industry_mentor' || currentRole === 'teacher_mentor' || currentRole === 'mentor';
  const isReadOnly = currentRole === 'viewer_dinas';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = evidences.length;
    const verifiedCount = evidences.filter((e) => e.status === 'VERIFIED').length;
    const pendingCount = evidences.filter((e) => e.status === 'PENDING').length;
    const codeCount = evidences.filter((e) => e.category === 'CODE').length;

    return {
      total,
      verifiedCount,
      pendingCount,
      codeCount,
    };
  }, [evidences]);

  // Filtered
  const effectiveSearch = localSearch || searchQuery;
  const filtered = useMemo(() => {
    return evidences.filter((e) => {
      const q = effectiveSearch.toLowerCase();
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.studentName.toLowerCase().includes(q) ||
        e.company.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q));

      const matchCat = selectedCategory === 'ALL' || e.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || e.status === selectedStatus;
      const matchDept = selectedDept === 'ALL' || e.department.includes(selectedDept);

      return matchSearch && matchCat && matchStatus && matchDept;
    });
  }, [evidences, effectiveSearch, selectedCategory, selectedStatus, selectedDept]);

  const getCategoryBadge = (cat: EvidenceItem['category']) => {
    switch (cat) {
      case 'CODE':
        return { label: 'Source Code', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: 'terminal' };
      case 'PHOTO':
        return { label: 'Dokumentasi Foto', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: 'photo_camera' };
      case 'DESIGN':
        return { label: 'Desain & UI/UX', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: 'palette' };
      case 'DOCUMENT':
        return { label: 'Laporan Teknis', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: 'description' };
      case 'CERTIFICATE':
        return { label: 'Sertifikat', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30', icon: 'workspace_premium' };
    }
  };

  const handleVerifyEvidence = (id: string, status: 'VERIFIED' | 'REVISION') => {
    setEvidences((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status,
              verifiedByMentor: status === 'VERIFIED' ? 'Bayu Pratama, S.T. (Divalidasi)' : e.verifiedByMentor,
            }
          : e
      )
    );
    if (selectedEvidenceDetail && selectedEvidenceDetail.id === id) {
      setSelectedEvidenceDetail((prev) =>
        prev
          ? {
              ...prev,
              status,
              verifiedByMentor: status === 'VERIFIED' ? 'Bayu Pratama, S.T. (Divalidasi)' : prev.verifiedByMentor,
            }
          : null
      );
    }
    showToast(status === 'VERIFIED' ? 'Bukti berhasil divalidasi!' : 'Catatan revisi dikirimkan ke siswa.');
  };

  // Submit Upload Evidence Handler
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!uploadForm.title.trim()) {
      errors.title = 'Judul artefak/bukti kerja wajib diisi';
    }
    if (!uploadForm.description.trim()) {
      errors.description = 'Deskripsi pekerjaan teknis wajib diisi';
    }

    if (Object.keys(errors).length > 0) {
      setUploadErrors(errors);
      return;
    }

    const tagsArray = uploadForm.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newEvidence: EvidenceItem = {
      id: `ev-${Date.now().toString().slice(-4)}`,
      title: uploadForm.title.trim(),
      category: uploadForm.category,
      studentName: uploadForm.studentName,
      studentAvatar:
        uploadForm.studentName.includes('Dimas')
          ? ASSETS.dimasAvatar
          : uploadForm.studentName.includes('Alya')
          ? ASSETS.alyaAvatar
          : uploadForm.studentName.includes('Bima')
          ? ASSETS.bimaAvatar
          : uploadForm.studentName.includes('Citra')
          ? ASSETS.citraAvatar
          : ASSETS.ekoAvatar,
      department: uploadForm.department,
      company: uploadForm.company,
      description: uploadForm.description.trim(),
      fileUrl: uploadForm.fileUrl.trim() || 'https://github.com/vokasi-smkn1/portfolio-artifact',
      thumbnailUrl: uploadForm.thumbnailUrl,
      fileSize: '4.5 MB (Uploaded Artifact)',
      submittedAt: 'Baru saja',
      verifiedByMentor: null,
      status: 'PENDING',
      feedback: 'Menunggu peninjauan dari mentor industri.',
      tags: tagsArray.length > 0 ? tagsArray : ['Vokasi', 'Industri'],
    };

    setEvidences((prev) => [newEvidence, ...prev]);
    showToast(`Bukti artefak "${newEvidence.title}" berhasil diunggah!`);
    setIsUploadModalOpen(false);

    // Reset Form
    setUploadForm({
      title: '',
      category: 'CODE',
      studentName: 'Dimas Prasetyo Nugroho',
      department: 'Rekayasa Perangkat Lunak (RPL)',
      company: 'PT Telkom Indonesia (Persero) Tbk',
      description: '',
      fileUrl: '',
      thumbnailUrl: PRESET_THUMBNAILS[0].url,
      tagsInput: 'TypeScript, PostgreSQL, REST API',
    });
    setUploadErrors({});
  };

  // Start Portfolio Export Simulation
  const handleStartExportPortfolio = () => {
    setIsGeneratingPortfolio(true);
    setPortfolioProgress(15);

    const step1 = setTimeout(() => setPortfolioProgress(45), 400);
    const step2 = setTimeout(() => setPortfolioProgress(80), 900);
    const step3 = setTimeout(() => {
      setPortfolioProgress(100);
      setIsGeneratingPortfolio(false);
      showToast('Bundel Portofolio Magang Siswa (ZIP & E-Portfolio PDF) berhasil diunduh!');
    }, 1400);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
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
              <span className="material-symbols-outlined text-[15px]">photo_library</span>
              <span>Modul 8.8 • Repositori Bukti Portofolio & Artefak Kerja</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Galeri Bukti Aktivitas & Portofolio Siswa (Evidence & Artifacts)
            </h2>
            <p className="text-[14px] text-white/70 mt-1 max-w-3xl leading-relaxed">
              Repositori bukti autentik pekerjaan siswa selama magang di industri: foto dokumentasi lapangan, repositori *source code git*, diagram arsitektur sistem, dan laporan teknis yang diverifikasi langsung oleh mentor DUDI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Button 1: Unduh / Buka Portofolio */}
            <button
              type="button"
              onClick={() => {
                setIsPortfolioModalOpen(true);
                if (onExportPortfolio) onExportPortfolio();
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-900/50 via-blue-900/40 to-slate-900/60 hover:from-indigo-800/60 hover:to-blue-800/60 text-indigo-200 hover:text-white border border-indigo-500/40 hover:border-indigo-400 rounded-2xl text-[13px] font-bold shadow-lg shadow-indigo-950/50 hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2.5 ring-1 ring-indigo-400/30 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px] text-cyan-400 transition-transform duration-200 group-hover:scale-110">
                folder_special
              </span>
              <span>Unduh Portofolio</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
                ZIP/PDF
              </span>
            </button>

            {/* Button 2: Unggah Bukti Baru */}
            {!isReadOnly && (
              <button
                type="button"
                id="btn-upload-evidence-main"
                onClick={() => {
                  setIsUploadModalOpen(true);
                  if (onUploadEvidence) onUploadEvidence();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white rounded-2xl text-[13px] font-bold shadow-xl shadow-blue-950/60 hover:shadow-cyan-500/25 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center gap-2.5 ring-2 ring-blue-400/50 hover:ring-cyan-300/80 cursor-pointer group overflow-hidden"
              >
                <span className="material-symbols-outlined text-[19px] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                  cloud_upload
                </span>
                <span>Unggah Bukti Baru</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white border border-white/30">
                  Baru
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Artefak */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Total Berkas Bukti</span>
            <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 material-symbols-outlined text-[20px]">
              folder_zip
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-white">{metrics.total}</span>
              <span className="text-[12px] text-emerald-400 font-bold">({metrics.verifiedCount} Terverifikasi)</span>
            </div>
            <p className="text-[12px] text-white/50 mt-0.5">Artefak kerja siswa di industri</p>
          </div>
        </div>

        {/* Verifikasi DUDI */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Tingkat Verifikasi</span>
            <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 material-symbols-outlined text-[20px]">
              verified
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-emerald-400">
                {metrics.total > 0 ? Math.round((metrics.verifiedCount / metrics.total) * 100) : 100}%
              </span>
              <span className="text-[12px] text-white/60">Disetujui Mentor</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.total > 0 ? (metrics.verifiedCount / metrics.total) * 100 : 100}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-300 font-semibold mt-1.5 flex justify-between">
              <span>Status Artefak</span>
              <span>Siap Asesmen Akhir</span>
            </p>
          </div>
        </div>

        {/* Menunggu Review */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Menunggu Review</span>
            <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 material-symbols-outlined text-[20px]">
              pending_actions
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[30px] font-black text-amber-300">{metrics.pendingCount}</span>
            <span className="text-[12px] text-white/60 ml-2 font-medium">Berkas Baru</span>
            <p className="text-[12px] text-white/50 mt-1">Menunggu validasi pembimbing</p>
          </div>
        </div>

        {/* Kode & Proyek */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Source Code & Desain</span>
            <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 material-symbols-outlined text-[20px]">
              terminal
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[30px] font-black text-purple-400">{metrics.codeCount}</span>
            <span className="text-[12px] text-white/60 ml-2 font-medium">Repositori Aktif</span>
            <p className="text-[12px] text-white/50 mt-1">Git, Figma, dan Laporan</p>
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
            id="search-evidence-input"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Cari judul berkas, nama siswa, tag teknologi..."
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
          {/* Category Filter */}
          <select
            id="filter-evidence-cat"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0f172a] text-white">Semua Kategori</option>
            <option value="PHOTO" className="bg-[#0f172a] text-white">Dokumentasi Foto</option>
            <option value="CODE" className="bg-[#0f172a] text-white">Source Code & API</option>
            <option value="DESIGN" className="bg-[#0f172a] text-white">Desain & UI/UX</option>
            <option value="DOCUMENT" className="bg-[#0f172a] text-white">Laporan Teknis</option>
            <option value="CERTIFICATE" className="bg-[#0f172a] text-white">Sertifikat</option>
          </select>

          {/* Status Filter */}
          <select
            id="filter-evidence-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0f172a] text-white">Semua Status</option>
            <option value="VERIFIED" className="bg-[#0f172a] text-white">VERIFIED (Disetujui)</option>
            <option value="PENDING" className="bg-[#0f172a] text-white">PENDING (Review)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
              }`}
              title="Tampilan Galeri Kartu"
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

      {/* Content: Gallery Grid or Table */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10 my-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/40">
            <span className="material-symbols-outlined text-[36px]">photo_library</span>
          </div>
          <h3 className="text-[18px] font-bold text-white">Tidak ada artefak bukti yang cocok</h3>
          <p className="text-[13px] text-white/50 max-w-md mx-auto mt-1">
            Silakan sesuaikan kata kunci pencarian atau unggah berkas bukti baru melalui tombol Unggah Bukti Baru.
          </p>
          <button
            onClick={() => {
              setLocalSearch('');
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
            }}
            className="mt-4 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GALLERY GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const catBadge = getCategoryBadge(item.category);
            const isVerified = item.status === 'VERIFIED';

            return (
              <div
                key={item.id}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-blue-500/40 transition-all duration-200 group shadow-lg"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1228] via-transparent to-transparent opacity-80" />

                    {/* Category & Status Overlays */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border flex items-center gap-1 backdrop-blur-md ${catBadge.color}`}
                      >
                        <span className="material-symbols-outlined text-[12px]">{catBadge.icon}</span>
                        <span>{catBadge.label}</span>
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border backdrop-blur-md ${
                          isVerified
                            ? 'bg-emerald-500/30 text-emerald-200 border-emerald-500/50'
                            : 'bg-amber-500/30 text-amber-200 border-amber-500/50'
                        }`}
                      >
                        {isVerified ? 'VERIFIED' : 'PENDING REVIEW'}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/80">
                      <span className="font-mono text-[10px] bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                        {item.fileSize}
                      </span>
                      <span className="text-[10px] text-white/60">{item.submittedAt}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h4 className="text-[15px] font-bold text-white group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-[12px] text-white/60 line-clamp-2 mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] text-white/70 border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Student Info */}
                    <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-white/10 text-[11px]">
                      <img
                        src={item.studentAvatar}
                        alt={item.studentName}
                        className="w-7 h-7 rounded-lg object-cover border border-white/10"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{item.studentName}</p>
                        <p className="text-[10px] text-blue-300 truncate">{item.company}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEvidenceDetail(item)}
                    className="flex-1 py-1.5 px-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-xl text-[12px] font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-400">visibility</span>
                    <span>Inspeksi Bukti</span>
                  </button>

                  {isMentor && !isVerified && (
                    <button
                      type="button"
                      onClick={() => handleVerifyEvidence(item.id, 'VERIFIED')}
                      className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 rounded-xl text-[12px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Setujui Bukti"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Validasi</span>
                    </button>
                  )}
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
                  <th className="py-3 px-4">Judul Artefak Bukti</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Siswa & DUDI</th>
                  <th className="py-3 px-4">Tanggal Unggah</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((item) => {
                  const catBadge = getCategoryBadge(item.category);
                  const isVerified = item.status === 'VERIFIED';

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white max-w-sm truncate">{item.title}</div>
                        <div className="text-[11px] text-white/50 font-mono">{item.fileSize}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border inline-flex items-center gap-1 ${catBadge.color}`}
                        >
                          <span className="material-symbols-outlined text-[12px]">{catBadge.icon}</span>
                          <span>{catBadge.label}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{item.studentName}</div>
                        <div className="text-[11px] text-blue-300">{item.company}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-white/60">
                        {item.submittedAt}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            isVerified
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedEvidenceDetail(item)}
                          className="p-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-lg text-blue-300 transition-colors cursor-pointer"
                          title="Inspeksi Bukti"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL DRAWER */}
      {selectedEvidenceDetail && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedEvidenceDetail(null);
          }}
          className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div className="glass-card bg-[#0e1228]/95 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-white/15 text-white my-8 relative">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border inline-flex items-center gap-1 ${
                    getCategoryBadge(selectedEvidenceDetail.category).color
                  }`}
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {getCategoryBadge(selectedEvidenceDetail.category).icon}
                  </span>
                  <span>{getCategoryBadge(selectedEvidenceDetail.category).label}</span>
                </span>
                <h3 className="text-[18px] font-bold text-white mt-1.5">{selectedEvidenceDetail.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvidenceDetail(null)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-[13px]">
              {/* Preview image */}
              <div className="rounded-xl overflow-hidden border border-white/10 bg-slate-900 max-h-64 flex items-center justify-center">
                <img
                  src={selectedEvidenceDetail.thumbnailUrl}
                  alt={selectedEvidenceDetail.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase text-white/50">Deskripsi Pekerjaan</span>
                <p className="text-white/80 mt-1 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/10">
                  {selectedEvidenceDetail.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Siswa Pengunggah</span>
                  <p className="font-bold text-white mt-0.5">{selectedEvidenceDetail.studentName}</p>
                  <p className="text-[11px] text-blue-300">{selectedEvidenceDetail.company}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Waktu & Ukuran</span>
                  <p className="font-mono text-white mt-0.5">{selectedEvidenceDetail.submittedAt}</p>
                  <p className="text-[11px] text-white/50">{selectedEvidenceDetail.fileSize}</p>
                </div>
              </div>

              {selectedEvidenceDetail.feedback && (
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-[11px] font-bold uppercase text-emerald-300 block mb-1">
                    Catatan Evaluasi Pembimbing Industri
                  </span>
                  <p className="text-white/80 text-[12px] italic">"{selectedEvidenceDetail.feedback}"</p>
                  {selectedEvidenceDetail.verifiedByMentor && (
                    <span className="text-[10px] text-emerald-400 font-semibold mt-1.5 block">
                      ✓ {selectedEvidenceDetail.verifiedByMentor}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center gap-2 pt-4 border-t border-white/10 mt-6">
              <a
                href={selectedEvidenceDetail.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-xl font-bold text-[12px] cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                <span>Buka Berkas Eksternal</span>
              </a>

              <div className="flex items-center gap-2">
                {isMentor && selectedEvidenceDetail.status !== 'VERIFIED' && (
                  <button
                    type="button"
                    onClick={() => handleVerifyEvidence(selectedEvidenceDetail.id, 'VERIFIED')}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-[12px] cursor-pointer transition-colors shadow-lg"
                  >
                    Setujui & Validasi
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedEvidenceDetail(null)}
                  className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl font-semibold text-[12px] cursor-pointer transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: PORTOFOLIO BUNDLE & EXPORT */}
      {isPortfolioModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget && !isGeneratingPortfolio) setIsPortfolioModalOpen(false);
          }}
          className="fixed inset-0 bg-black/85 z-[110] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div className="glass-card bg-[#0b0f24]/95 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-indigo-500/30 text-white my-8 relative">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <span className="material-symbols-outlined text-[24px]">folder_special</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase border border-indigo-500/30">
                    Modul 8.8 • Bundel Portofolio Magang
                  </div>
                  <h3 className="text-[20px] font-black text-white mt-1">
                    Kompilasi & Unduh Portofolio Siswa
                  </h3>
                </div>
              </div>
              {!isGeneratingPortfolio && (
                <button
                  type="button"
                  onClick={() => setIsPortfolioModalOpen(false)}
                  className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>

            <div className="mt-5 space-y-5 text-[13px]">
              <p className="text-white/70 leading-relaxed">
                Bundel portofolio mengkompilasi seluruh artefak kerja siswa yang telah diverifikasi oleh mentor DUDI, laporan pengujian kompetensi, dan lembar pengesahan resmi SMK Negeri 1 Jakarta.
              </p>

              {/* Verified Artifacts Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-[10px] font-bold uppercase text-white/50 block">Berkas Terverifikasi</span>
                  <span className="text-[22px] font-black text-emerald-400 mt-0.5 block">
                    {metrics.verifiedCount} Berkas
                  </span>
                  <span className="text-[10px] text-emerald-300 font-semibold">100% Siap Uji</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-[10px] font-bold uppercase text-white/50 block">Kategori Lengkap</span>
                  <span className="text-[22px] font-black text-cyan-400 mt-0.5 block">5 Modul</span>
                  <span className="text-[10px] text-cyan-300 font-semibold">Code, Desain, Foto</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                  <span className="text-[10px] font-bold uppercase text-white/50 block">Ukuran Paket</span>
                  <span className="text-[22px] font-black text-purple-400 mt-0.5 block">112 MB</span>
                  <span className="text-[10px] text-purple-300 font-semibold">Arsip Terkompresi</span>
                </div>
              </div>

              {/* Included Artifacts List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 block">
                  Daftar Berkas yang Disertakan:
                </span>
                <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 hide-scrollbar">
                  {evidences
                    .filter((e) => e.status === 'VERIFIED')
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-[12px]"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="material-symbols-outlined text-[16px] text-emerald-400">
                            check_circle
                          </span>
                          <span className="font-semibold text-white truncate">{item.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-white/50 shrink-0 ml-2">{item.fileSize}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Progress Simulation Bar */}
              {isGeneratingPortfolio && (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 animate-pulse">
                  <div className="flex justify-between items-center text-[12px] font-bold text-indigo-300">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                      Mengompilasi Berkas & Menandatangani Digital...
                    </span>
                    <span>{portfolioProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${portfolioProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
                <button
                  type="button"
                  disabled={isGeneratingPortfolio}
                  onClick={() => setIsPortfolioModalOpen(false)}
                  className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl font-bold text-[13px] transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isGeneratingPortfolio}
                    onClick={handleStartExportPortfolio}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white rounded-xl font-bold text-[13px] shadow-lg shadow-indigo-950/60 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    <span>Unduh Arsip Lengkap (.ZIP)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: UPLOAD EVIDENCE BARU */}
      {isUploadModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsUploadModalOpen(false);
          }}
          className="fixed inset-0 bg-black/85 z-[110] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div className="glass-card bg-[#0b0f24]/95 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-blue-500/30 text-white my-8 relative">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase border border-blue-500/30">
                    Modul 8.8 • Pengunggahan Artefak Bukti
                  </div>
                  <h3 className="text-[20px] font-black text-white mt-1">
                    Unggah Bukti Kinerja & Portofolio Siswa
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-5 space-y-4 text-[13px]">
              {/* Row 1: Title & Category */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Judul Bukti Kinerja / Nama Berkas <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Implementasi Load Balancing NGINX & Docker Swarm"
                  value={uploadForm.title}
                  onChange={(e) => {
                    setUploadForm({ ...uploadForm, title: e.target.value });
                    if (uploadErrors.title) setUploadErrors({ ...uploadErrors, title: '' });
                  }}
                  className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/30 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                {uploadErrors.title && (
                  <p className="text-rose-400 text-[11px] mt-1 font-semibold">{uploadErrors.title}</p>
                )}
              </div>

              {/* Row 2: Kategori & Siswa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Kategori Bukti Artefak <span className="text-cyan-400">*</span>
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        category: e.target.value as EvidenceItem['category'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#0e142e] border border-white/15 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                  >
                    <option value="CODE">Source Code & Git Repository</option>
                    <option value="PHOTO">Dokumentasi Foto Lapangan</option>
                    <option value="DESIGN">Desain Antarmuka & UI/UX</option>
                    <option value="DOCUMENT">Laporan Teknis / Audit</option>
                    <option value="CERTIFICATE">Sertifikat Kelulusan Industri</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Siswa Pengunggah
                  </label>
                  <select
                    value={uploadForm.studentName}
                    onChange={(e) => {
                      const name = e.target.value;
                      let dept = 'Rekayasa Perangkat Lunak (RPL)';
                      let comp = 'PT Telkom Indonesia (Persero) Tbk';
                      if (name.includes('Alya') || name.includes('Eko')) {
                        dept = 'Teknik Komputer & Jaringan (TKJ)';
                        comp = 'PT Astra International Tbk';
                      } else if (name.includes('Citra')) {
                        dept = 'Desain Komunikasi Visual (DKV)';
                        comp = 'Bank Mandiri (Persero) Tbk';
                      }
                      setUploadForm({
                        ...uploadForm,
                        studentName: name,
                        department: dept,
                        company: comp,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#0e142e] border border-white/15 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                  >
                    <option value="Dimas Prasetyo Nugroho">Dimas Prasetyo Nugroho (RPL - PT Telkom)</option>
                    <option value="Alya Putri">Alya Putri (TKJ - PT Astra)</option>
                    <option value="Bima Sakti">Bima Sakti (RPL - PT Telkom)</option>
                    <option value="Citra Dewi">Citra Dewi (DKV - Bank Mandiri)</option>
                    <option value="Eko Wahyudi">Eko Wahyudi (TKJ - PT Astra)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Uraian Pekerjaan */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Uraian Pekerjaan / Langkah Kerja Teknis <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan aktivitas yang dikerjakan, alat yang digunakan, dan hasil keluaran..."
                  value={uploadForm.description}
                  onChange={(e) => {
                    setUploadForm({ ...uploadForm, description: e.target.value });
                    if (uploadErrors.description) setUploadErrors({ ...uploadErrors, description: '' });
                  }}
                  className="w-full p-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/30 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none leading-relaxed"
                />
                {uploadErrors.description && (
                  <p className="text-rose-400 text-[11px] mt-1 font-semibold">{uploadErrors.description}</p>
                )}
              </div>

              {/* Row 4: URL Berkas / Link Repositori */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Tautan Berkas / URL Repositori / Google Drive
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                    link
                  </span>
                  <input
                    type="url"
                    placeholder="https://github.com/... atau https://drive.google.com/..."
                    value={uploadForm.fileUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, fileUrl: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/30 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Row 5: Pilihan Gambar Ilustrasi / Thumbnail Pratinjau */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-2">
                  Pilih Gambar Pratinjau Artefak:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_THUMBNAILS.map((th, i) => {
                    const isSelected = uploadForm.thumbnailUrl === th.url;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setUploadForm({ ...uploadForm, thumbnailUrl: th.url })}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                            : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                        }`}
                        title={th.label}
                      >
                        <img src={th.url} alt={th.label} className="w-full h-11 object-cover rounded-lg" />
                        {isSelected && (
                          <span className="absolute bottom-1 right-1 w-3 h-3 bg-cyan-400 rounded-full flex items-center justify-center text-[8px] text-black font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Tags */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Tags Teknologi / Standar Kompetensi (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Cisco, Fiber Optic, Docker, K3"
                  value={uploadForm.tagsInput}
                  onChange={(e) => setUploadForm({ ...uploadForm, tagsInput: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/30 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-5">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl font-bold text-[13px] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold text-[13px] shadow-lg shadow-blue-950/60 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                  <span>Simpan & Teruskan ke Mentor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
