import React, { useState } from 'react';
import { UserRole } from '../../types';
import { ASSETS } from '../../data/mockData';

interface StudentProfileCustomizationViewProps {
  currentRole: UserRole;
  onSaveProfile?: (updatedData: any) => void;
  onExportCv?: () => void;
}

const AVATAR_PRESETS = [
  { id: 'av-1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop', label: 'Dimas (Laki-laki 1)' },
  { id: 'av-2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop', label: 'Alya (Perempuan 1)' },
  { id: 'av-3', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop', label: 'Bima (Laki-laki 2)' },
  { id: 'av-4', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop', label: 'Citra (Perempuan 2)' },
  { id: 'av-5', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop', label: 'Eko (Laki-laki 3)' },
  { id: 'av-6', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop', label: 'Nadia (Perempuan 3)' },
];

const THEME_COVERS = [
  { id: 'cov-1', name: 'Cyber Indigo', gradient: 'from-blue-900 via-indigo-950 to-slate-950' },
  { id: 'cov-2', name: 'Emerald Tech', gradient: 'from-emerald-950 via-teal-950 to-slate-950' },
  { id: 'cov-3', name: 'Deep Violet', gradient: 'from-purple-950 via-indigo-950 to-slate-950' },
  { id: 'cov-4', name: 'Sunset Amber', gradient: 'from-amber-950 via-rose-950 to-slate-950' },
  { id: 'cov-5', name: 'Midnight Obsidian', gradient: 'from-slate-900 via-[#0d1329] to-black' },
];

export const StudentProfileCustomizationView: React.FC<StudentProfileCustomizationViewProps> = ({
  onSaveProfile,
  onExportCv,
}) => {
  // Student Profile Editable State
  const [profile, setProfile] = useState({
    name: 'Dimas Prasetyo Nugroho',
    nisn: '0068492019',
    nis: '20241088',
    department: 'Rekayasa Perangkat Lunak (RPL)',
    school: 'SMK Negeri 1 Jakarta',
    classroom: 'XII RPL 1',
    birthPlace: 'Jakarta',
    birthDate: '2008-05-15',
    gender: 'Laki-laki',
    bloodType: 'O',
    phone: '0812-9876-5432',
    email: 'dimas.prasetyo@student.smkn1jakarta.sch.id',
    address: 'Jl. Budi Utomo No. 12, Sawah Besar, Jakarta Pusat 10710',
    bio: 'Siswa SMK yang berfokus pada rekayasa perangkat lunak modern, perancangan arsitektur RESTful API dengan TypeScript/Node.js, dan optimasi database PostgreSQL. Sangat antusias dalam problem solving dan continuous learning di industri teknologi.',
    careerInterest: 'Full-Stack Software Engineer & Cloud Backend Specialist',
    linkedin: 'linkedin.com/in/dimas-prasetyo-smk',
    github: 'github.com/dimas-dev-tech',
    portfolioUrl: 'https://dimasprasetyo.dev',
    avatar: ASSETS.dimasAvatar,
    selectedCover: THEME_COVERS[0].id,
    emergencyContact: {
      name: 'Bambang Nugroho',
      relation: 'Orang Tua / Ayah',
      phone: '0812-9876-5432',
      address: 'Jl. Budi Utomo No. 12, Jakarta Pusat',
    },
    companyPlacement: {
      company: 'PT Telkom Indonesia (Persero) Tbk',
      division: 'Digital Platform & Software Engineering Hub',
      industryMentor: 'Bayu Pratama, S.T.',
      schoolMentor: 'Hendra Setiawan, S.Pd., M.T.',
      period: 'Semester Genap 2025/2026 (6 Bulan)',
      status: 'Aktif Magang (Ready 100%)',
    },
  });

  // Skills List State
  const [skills, setSkills] = useState<string[]>([
    'TypeScript',
    'React.js',
    'Node.js Express',
    'PostgreSQL',
    'RESTful API',
    'Docker Containers',
    'Git & GitHub',
    'Tailwind CSS',
    'Figma UI/UX',
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // UI Modals & Alerts
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTabSection, setActiveTabSection] = useState<'biodata' | 'skills' | 'placement' | 'emergency'>('biodata');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (skills.includes(newSkillInput.trim())) {
      showToast('Keahlian tersebut sudah ada dalam daftar.');
      return;
    }
    setSkills([...skills, newSkillInput.trim()]);
    setNewSkillInput('');
    showToast('Keahlian baru berhasil ditambahkan.');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...profile,
      skills,
    };
    if (onSaveProfile) {
      onSaveProfile(updated);
    }
    showToast('Perubahan profil berhasil disimpan dan diperbarui di portal magang!');
  };

  const activeCoverObj = THEME_COVERS.find((c) => c.id === profile.selectedCover) || THEME_COVERS[0];

  return (
    <div className="space-y-6 animate-fade-in text-white pb-12">
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

      {/* Hero Header & Cover Card */}
      <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
        {/* Cover Background */}
        <div className={`h-48 md:h-56 bg-gradient-to-r ${activeCoverObj.gradient} relative p-6 flex flex-col justify-between border-b border-white/10`}>
          {/* Top badges & Cover Theme Switcher */}
          <div className="flex items-center justify-between z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/15 text-blue-300 text-[11px] font-bold backdrop-blur-md">
              <span className="material-symbols-outlined text-[15px]">badge</span>
              <span>Modul 8.5 • Profil & Portofolio Personal Peserta Didik</span>
            </div>

            {/* Cover Themes Dropdown / Chips */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/15 backdrop-blur-md">
              <span className="text-[11px] text-white/60 font-semibold px-2 hidden sm:inline">Tema Sampul:</span>
              {THEME_COVERS.map((cov) => (
                <button
                  key={cov.id}
                  type="button"
                  onClick={() => {
                    setProfile({ ...profile, selectedCover: cov.id });
                    showToast(`Tema sampul diubah ke ${cov.name}`);
                  }}
                  className={`w-6 h-6 rounded-lg border transition-all cursor-pointer ${
                    profile.selectedCover === cov.id
                      ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-110'
                      : 'border-white/20 opacity-70 hover:opacity-100'
                  } bg-gradient-to-br ${cov.gradient}`}
                  title={cov.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 z-10">
            {onExportCv && (
              <button
                type="button"
                onClick={onExportCv}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[12px] font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Cetak CV Vokasi</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Card Summary (Overlapping Avatar) */}
        <div className="px-6 md:px-8 pb-6 pt-0 bg-[#0c1024]/90">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar with Camera Trigger */}
            <div className="relative group self-start">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-[#0c1024] shadow-2xl bg-slate-900 relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(true)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 cursor-pointer backdrop-blur-[2px]"
                  title="Ganti Foto Profil"
                >
                  <span className="material-symbols-outlined text-[26px]">photo_camera</span>
                  <span className="text-[10px] font-bold mt-1">Ubah Foto</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarPickerOpen(true)}
                className="absolute bottom-1 right-1 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg border border-white/20 transition-all cursor-pointer flex items-center justify-center"
                title="Ganti Foto"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-950/60 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 ring-1 ring-blue-400/40"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>

          {/* Name & Identity Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[24px] sm:text-[28px] font-black text-white tracking-tight">
                {profile.name}
              </h2>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Peserta Magang Aktif</span>
              </span>
            </div>

            <p className="text-[14px] text-blue-300 font-semibold mt-0.5">
              {profile.department} • {profile.classroom} • {profile.school}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-white/60 mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-400">pin</span>
                <span>NISN: <strong className="text-white font-mono">{profile.nisn}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-purple-400">domain</span>
                <span>Mitra: <strong className="text-white">{profile.companyPlacement.company}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">badge</span>
                <span>Mentor: <strong className="text-white">{profile.companyPlacement.industryMentor}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation for Profile Sections */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto hide-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTabSection('biodata')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTabSection === 'biodata'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
              : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">person</span>
          <span>Biodata & Kontak Siswa</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('skills')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTabSection === 'skills'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
              : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span>Keahlian & Tautan Portofolio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('placement')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTabSection === 'placement'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
              : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">domain</span>
          <span>Data Penempatan & Pembimbing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTabSection('emergency')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTabSection === 'emergency'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
              : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">contact_emergency</span>
          <span>Kontak Darurat Orang Tua</span>
        </button>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* TAB 1: BIODATA & KONTAK */}
        {activeTabSection === 'biodata' && (
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
            <div>
              <h3 className="text-[18px] font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-blue-400">person</span>
                <span>Informasi Biodata Pribadi Siswa</span>
              </h3>
              <p className="text-[12px] text-white/50 mt-0.5">
                Pastikan identitas nama, kontak, dan domisili terisi sesuai dengan data sah Kependudukan & Dapodik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[13px]">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Nama Lengkap Siswa <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* NISN & NIS (Read-only verified) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    NISN (Terverifikasi)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={profile.nisn}
                    className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-white/70 text-[13px] font-mono cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    NIS Siswa
                  </label>
                  <input
                    type="text"
                    value={profile.nis}
                    onChange={(e) => setProfile({ ...profile, nis: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={profile.birthPlace}
                    onChange={(e) => setProfile({ ...profile, birthPlace: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Jenis Kelamin & Golongan Darah */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Jenis Kelamin
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0e142e] border border-white/15 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                    Golongan Darah
                  </label>
                  <select
                    value={profile.bloodType}
                    onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0e142e] border border-white/15 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
              </div>

              {/* No WhatsApp & Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Nomor WhatsApp Siswa <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                    chat
                  </span>
                  <input
                    type="tel"
                    required
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Alamat Email Siswa <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Alamat Tempat Tinggal */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Alamat Tempat Tinggal (Domisili)
                </label>
                <textarea
                  rows={2}
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full p-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>

              {/* Bio Singkat */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Ringkasan / Bio Singkat Karier Vokasi
                </label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Ceritakan latar belakang ketertarikan teknologi dan fokus kompetensi kamu..."
                  className="w-full p-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SKILLS & PORTOFOLIO */}
        {activeTabSection === 'skills' && (
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
            <div>
              <h3 className="text-[18px] font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-purple-400">psychology</span>
                <span>Keahlian Teknis & Tautan Portofolio Digital</span>
              </h3>
              <p className="text-[12px] text-white/50 mt-0.5">
                Tambahkan daftar penguasaan teknologi pemrograman, jaringan, atau desain untuk referensi pembimbing industri.
              </p>
            </div>

            {/* Career Interest */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Spesialisasi / Minat Karier Vokasi
              </label>
              <input
                type="text"
                value={profile.careerInterest}
                onChange={(e) => setProfile({ ...profile, careerInterest: e.target.value })}
                placeholder="Contoh: Backend Software Engineer & Cloud DevOps"
                className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Skills Tags Manager */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-2">
                Daftar Keterampilan / Tools yang Dikuasai:
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-500/30 text-[12px] font-bold"
                  >
                    <span>{sk}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(sk)}
                      className="p-0.5 hover:bg-purple-500/40 rounded-full transition-colors cursor-pointer"
                      title="Hapus Keahlian"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
              </div>

              {/* Add New Skill Input */}
              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Ketik keahlian baru (misal: Kubernetes, Vue, K3)..."
                  className="flex-1 px-3.5 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[12px] font-bold transition-all cursor-pointer"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Portfolio Links */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-blue-400">link</span>
                <span>Tautan Portofolio & Kode Sumber</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
                    GitHub / GitLab
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[17px]">
                      code
                    </span>
                    <input
                      type="text"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
                    LinkedIn
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[17px]">
                      badge
                    </span>
                    <input
                      type="text"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
                    Website Portofolio
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[17px]">
                      language
                    </span>
                    <input
                      type="text"
                      value={profile.portfolioUrl}
                      onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATA PENEMPATAN & PEMBIMBING */}
        {activeTabSection === 'placement' && (
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
            <div>
              <h3 className="text-[18px] font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-cyan-400">domain</span>
                <span>Data Penempatan Industri & Pembimbing Lapangan</span>
              </h3>
              <p className="text-[12px] text-white/50 mt-0.5">
                Informasi resmi kemitraan DUDI dan penugasan guru pembimbing sekolah SMK Negeri 1 Jakarta.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-[11px] font-bold uppercase text-white/50 block">Mitra DUDI Tempat Magang</span>
                <p className="text-[16px] font-black text-white">{profile.companyPlacement.company}</p>
                <p className="text-[12px] text-cyan-300 font-semibold">{profile.companyPlacement.division}</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  ✓ {profile.companyPlacement.status}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-[11px] font-bold uppercase text-white/50 block">Periode & Durasi Magang</span>
                <p className="text-[16px] font-black text-white">{profile.companyPlacement.period}</p>
                <p className="text-[12px] text-white/60">Senin - Jumat (08:00 - 17:00 WIB)</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold">
                  Standar Jam Kerja Vokasi
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] font-bold uppercase text-white/50 block mb-1">Mentor Lapangan Industri</span>
                <p className="text-[15px] font-bold text-white">{profile.companyPlacement.industryMentor}</p>
                <p className="text-[12px] text-white/50">Lead Software Architect & IT Specialist</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] font-bold uppercase text-white/50 block mb-1">Guru Pembimbing Sekolah</span>
                <p className="text-[15px] font-bold text-white">{profile.companyPlacement.schoolMentor}</p>
                <p className="text-[12px] text-white/50">Guru Kejuruan SMK Negeri 1 Jakarta</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KONTAK DARURAT */}
        {activeTabSection === 'emergency' && (
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
            <div>
              <h3 className="text-[18px] font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-rose-400">contact_emergency</span>
                <span>Kontak Darurat Orang Tua / Wali Siswa</span>
              </h3>
              <p className="text-[12px] text-white/50 mt-0.5">
                Kontak yang dapat dihubungi oleh pihak sekolah atau industri sewaktu-waktu terjadi kondisi darurat atau izin khusus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[13px]">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Nama Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={profile.emergencyContact.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      emergencyContact: { ...profile.emergencyContact, name: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Hubungan Keluarga
                </label>
                <input
                  type="text"
                  value={profile.emergencyContact.relation}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      emergencyContact: { ...profile.emergencyContact, relation: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Nomor Telepon Darurat
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                    phone
                  </span>
                  <input
                    type="tel"
                    value={profile.emergencyContact.phone}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        emergencyContact: { ...profile.emergencyContact, phone: e.target.value },
                      })
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Alamat Tinggal Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={profile.emergencyContact.address}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      emergencyContact: { ...profile.emergencyContact, address: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 glass-card rounded-2xl border border-white/10">
          <span className="text-[12px] text-white/60">
            Perubahan profil akan langsung disinkronkan ke kartu kehadiran dan direktori pembimbing.
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-950/60 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 ring-1 ring-blue-400/40"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Simpan Semua Perubahan</span>
          </button>
        </div>
      </form>

      {/* AVATAR PICKER MODAL */}
      {isAvatarPickerOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAvatarPickerOpen(false);
          }}
          className="fixed inset-0 bg-black/85 z-[120] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
        >
          <div className="glass-card bg-[#0b0f24]/95 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-blue-500/30 text-white relative">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <h3 className="text-[18px] font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-cyan-400">photo_library</span>
                <span>Pilih Foto Profil Siswa</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAvatarPickerOpen(false)}
                className="p-1.5 text-white/50 hover:text-white rounded-xl cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-[12px] text-white/60">
                Pilih foto avatar resmi peserta didik untuk kartu pelajar digital dan logbook magang:
              </p>

              <div className="grid grid-cols-3 gap-3">
                {AVATAR_PRESETS.map((av) => {
                  const isSelected = profile.avatar === av.url;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setProfile({ ...profile, avatar: av.url });
                        setIsAvatarPickerOpen(false);
                        showToast(`Foto profil berhasil diperbarui!`);
                      }}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all p-1 cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105 bg-cyan-950/30'
                          : 'border-white/10 hover:border-white/40 bg-white/[0.02] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-24 object-cover rounded-xl" />
                      <span className="text-[10px] font-medium text-white/80 truncate w-full text-center">
                        {av.label}
                      </span>
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-[12px] text-black font-bold">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/10">
                <label className="block text-[11px] font-bold text-white/60 mb-1">
                  Atau masukkan URL Foto Kustom:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[12px] focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          setProfile({ ...profile, avatar: val });
                          setIsAvatarPickerOpen(false);
                          showToast('Foto profil kustom berhasil diterapkan!');
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10 mt-5">
              <button
                type="button"
                onClick={() => setIsAvatarPickerOpen(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[12px] font-semibold transition-colors cursor-pointer"
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
