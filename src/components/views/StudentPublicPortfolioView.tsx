import React, { useState } from 'react';
import { UserRole } from '../../types';
import { ASSETS } from '../../data/mockData';

interface StudentPublicPortfolioViewProps {
  currentRole: UserRole;
  searchQuery?: string;
  onDownloadCv?: () => void;
  onSharePortfolio?: () => void;
}

interface PortfolioProject {
  id: string;
  title: string;
  category: 'Full-Stack Web' | 'Jaringan & Infrastruktur' | 'UI/UX Design' | 'Cybersecurity';
  description: string;
  techStack: string[];
  thumbnail: string;
  repoUrl?: string;
  demoUrl?: string;
  verifiedBy: string;
  company: string;
  impactMetric: string;
}

const FEATURED_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: 'Microservice API Gateway & Auth Subsystem Telkom',
    category: 'Full-Stack Web',
    description: 'Pengembangan arsitektur backend REST API berbasis Node.js TypeScript dengan implementasi enkripsi JWT, rate limiting Redis, dan integrasi database PostgreSQL berskala enterprise.',
    techStack: ['TypeScript', 'Express.js', 'PostgreSQL', 'Docker', 'JWT', 'Redis'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&auto=format&fit=crop',
    repoUrl: 'https://github.com/dimas-dev/telkom-auth-service',
    demoUrl: 'https://api-gateway.telkom-intern.dev',
    verifiedBy: 'Bayu Pratama, S.T. (Lead Architect Telkom)',
    company: 'PT Telkom Indonesia (Persero) Tbk',
    impactMetric: 'Latency < 45ms, 99.9% Uptime',
  },
  {
    id: 'proj-2',
    title: 'Redistribusi Jaringan Fiber Optic & Switch Core Cisco',
    category: 'Jaringan & Infrastruktur',
    description: 'Peremajaan infrastruktur kabel optik backbone gedung Astra International, pengelasan serat optik (fusion splicing) dengan redaman 0.015 dB, dan segmentasi 12 VLAN departemen.',
    techStack: ['Fiber Optic', 'Cisco Catalyst', 'VLAN Trunking', 'MikroTik', 'K3'],
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=700&auto=format&fit=crop',
    repoUrl: 'https://github.com/vokasi-net/astra-topology-config',
    verifiedBy: 'Ratna Kusuma, S.Kom (IT Infrastructure Astra)',
    company: 'PT Astra International Tbk',
    impactMetric: 'Bandwidth meningkat 400%',
  },
  {
    id: 'proj-3',
    title: 'Livin by Mandiri: Modern Mobile Remittance Flow Redesign',
    category: 'UI/UX Design',
    description: 'Perancangan ulang alur pengiriman dana valuta asing aplikasi Livin by Mandiri. Meliputi user research, wireframing, high-fidelity design system berstandar WCAG AAA, dan prototype interaktif.',
    techStack: ['Figma', 'Design System', 'Accessibility WCAG', 'Prototyping'],
    thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=700&auto=format&fit=crop',
    demoUrl: 'https://figma.com/@mandiri-design/livin-remittance-v2',
    verifiedBy: 'Dewi Lestari, S.Ds (Head of UX Mandiri)',
    company: 'Bank Mandiri (Persero) Tbk',
    impactMetric: 'User Task Success Rate 94%',
  },
];

const SKILL_MATRIX = [
  { name: 'TypeScript & JavaScript Modern', level: 'Advanced (Mahir)', percentage: 92, verified: true },
  { name: 'Node.js Express & REST API Architecture', level: 'Advanced (Mahir)', percentage: 90, verified: true },
  { name: 'Relational Database (PostgreSQL & SQL)', level: 'Advanced (Mahir)', percentage: 88, verified: true },
  { name: 'Docker Containerization & CI/CD Basics', level: 'Intermediate (Menengah)', percentage: 78, verified: true },
  { name: 'React.js & Tailwind CSS Frontend', level: 'Advanced (Mahir)', percentage: 86, verified: true },
  { name: 'Git Version Control & Code Review', level: 'Advanced (Mahir)', percentage: 95, verified: true },
  { name: 'Prosedur K3 Lingkungan Kerja Industri', level: 'Advanced (Mahir)', percentage: 96, verified: true },
];

export const StudentPublicPortfolioView: React.FC<StudentPublicPortfolioViewProps> = ({
  currentRole,
  searchQuery = '',
  onDownloadCv,
  onSharePortfolio,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewProject, setPreviewProject] = useState<PortfolioProject | null>(null);

  const filteredProjects = FEATURED_PROJECTS.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.techStack.some((t) => t.toLowerCase().includes(q));
    const matchCat = selectedFilter === 'ALL' || p.category === selectedFilter;
    return matchSearch && matchCat;
  });

  const handleCopyLink = () => {
    navigator.clipboard?.writeText('https://aktara.id/portfolio/dimas-prasetyo');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
    if (onSharePortfolio) onSharePortfolio();
  };

  return (
    <div className="space-y-6 animate-fade-in text-white pb-12">
      {/* Toast Copied */}
      {copiedLink && (
        <div className="fixed top-6 right-6 z-[120] animate-bounce-short bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-3 backdrop-blur-md">
          <span className="material-symbols-outlined text-[22px] text-emerald-200">link</span>
          <span className="text-[13px] font-bold tracking-wide">
            Tautan publik portofolio siswa berhasil disalin ke clipboard!
          </span>
        </div>
      )}

      {/* Hero Banner Card */}
      <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-[#0c1024]">
        <div className="p-6 md:p-8 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={ASSETS.dimasAvatar}
                alt="Dimas Prasetyo"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-cyan-400/60 shadow-2xl shadow-cyan-950/60"
              />
              <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#0c1024] text-[13px] text-black font-black" title="Siswa Terverifikasi">
                ✓
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider mb-1.5">
                <span className="material-symbols-outlined text-[15px]">style</span>
                <span>Modul 8.12 • E-Portfolio Publik & Showcase Keahlian Vokasi</span>
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-black text-white tracking-tight leading-tight">
                Dimas Prasetyo Nugroho
              </h2>
              <p className="text-[13px] sm:text-[14px] text-blue-300 font-semibold mt-0.5">
                Full-Stack Software Engineer • Rekayasa Perangkat Lunak (RPL) • SMK Negeri 1 Jakarta
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-white/60 mt-2 font-medium">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Nilai Akhir Magang: 94.2 (Grade A+)
                </span>
                <span>•</span>
                <span>Mitra: PT Telkom Indonesia (Persero) Tbk</span>
                <span>•</span>
                <span>Presensi: 98.5%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/20 rounded-xl text-[12px] font-bold cursor-pointer transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px] text-cyan-400">share</span>
              <span>Bagikan Link Portofolio</span>
            </button>

            {onDownloadCv && (
              <button
                type="button"
                onClick={onDownloadCv}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-[12px] font-bold shadow-lg shadow-blue-950/60 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[17px]">download</span>
                <span>Unduh CV Digital (PDF)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns (Projects & Skills) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Featured Projects Showcase (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-[18px] font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-cyan-400">featured_play_list</span>
                <span>Proyek Unggulan & Artefak Kerja Magang</span>
              </h3>
              <p className="text-[12px] text-white/50">
                Pekerjaan nyata berskala industri yang telah divalidasi pembimbing lapangan.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
              {['ALL', 'Full-Stack Web', 'Jaringan & Infrastruktur', 'UI/UX Design'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedFilter === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white/[0.05] text-white/60 hover:text-white'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards List */}
          <div className="space-y-4">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="glass-card rounded-2xl border border-white/10 p-5 hover:border-blue-500/40 transition-all duration-200 group flex flex-col md:flex-row gap-5"
              >
                {/* Project Image */}
                <div className="md:w-56 h-40 rounded-xl overflow-hidden shrink-0 relative bg-slate-900">
                  <img
                    src={proj.thumbnail}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-black/60 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                    {proj.category}
                  </span>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                    {proj.impactMetric}
                  </span>
                </div>

                {/* Project Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[16px] font-bold text-white group-hover:text-blue-300 transition-colors">
                      {proj.title}
                    </h4>
                    <p className="text-[12px] text-white/60 mt-1.5 leading-relaxed line-clamp-2">
                      {proj.description}
                    </p>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proj.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/[0.04] text-white/70 border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Verification by Mentor */}
                  <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10 text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold truncate">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      <span className="truncate">{proj.verifiedBy}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-lg text-white/80 hover:text-white transition-colors"
                          title="Lihat Repositori Git"
                        >
                          <span className="material-symbols-outlined text-[16px]">code</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setPreviewProject(proj)}
                        className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/30 rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Rincian Proyek
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Verified Skills & Testimonials (1 col) */}
        <div className="space-y-5">
          {/* Skill Matrix */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="text-[16px] font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <span className="material-symbols-outlined text-[19px] text-purple-400">psychology</span>
              <span>Matriks Penguasaan SKKNI</span>
            </h3>

            <div className="space-y-3">
              {SKILL_MATRIX.map((sk, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-white/90">{sk.name}</span>
                    <span className="text-cyan-400 font-mono font-bold">{sk.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full rounded-full"
                      style={{ width: `${sk.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-[11px] text-purple-200">
              ✓ Seluruh kompetensi di atas telah dinilai dan diverifikasi langsung oleh Pembimbing Industri & Tim Asesor LSP SMK.
            </div>
          </div>

          {/* Industry Endorsement Quote */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-[#0e1328]">
            <div className="flex items-center gap-2 text-emerald-400 text-[12px] font-bold">
              <span className="material-symbols-outlined text-[18px]">format_quote</span>
              <span>Surat Rekomendasi Industri</span>
            </div>

            <p className="text-[12px] text-white/80 leading-relaxed italic">
              "Dimas memiliki etos kerja dan kemampuan problem-solving yang luar biasa di divisi Digital Platform Telkom. Kecepatannya dalam memahami arsitektur microservice dan implementasi standar keamanan sangat layak diproyeksikan untuk langsung diserap sebagai Junior Backend Engineer."
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center font-bold text-cyan-300 text-[12px]">
                BP
              </div>
              <div>
                <p className="text-[12px] font-bold text-white">Bayu Pratama, S.T.</p>
                <p className="text-[10px] text-white/50">Lead Software Architect • PT Telkom Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL FOR PROJECT */}
      {previewProject && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewProject(null);
          }}
          className="fixed inset-0 bg-black/85 z-[120] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
        >
          <div className="glass-card bg-[#0b0f24]/95 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-blue-500/30 text-white relative">
            <div className="flex justify-between items-start pb-3 border-b border-white/10">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {previewProject.category}
                </span>
                <h3 className="text-[18px] font-bold text-white mt-1">{previewProject.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="p-1.5 text-white/50 hover:text-white rounded-xl cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-[13px]">
              <div className="h-48 rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                <img src={previewProject.thumbnail} alt={previewProject.title} className="w-full h-full object-cover" />
              </div>

              <p className="text-white/80 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                {previewProject.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Mitra Penempatan</span>
                  <p className="font-bold text-white mt-0.5">{previewProject.company}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Verifikasi Mentor</span>
                  <p className="font-bold text-emerald-400 mt-0.5">{previewProject.verifiedBy}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10 mt-5">
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[12px] font-bold cursor-pointer"
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
