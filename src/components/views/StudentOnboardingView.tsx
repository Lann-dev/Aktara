import React, { useState } from 'react';
import { StudentOnboardingProfile, UserRole } from '../../types';

interface StudentOnboardingViewProps {
  onboardingData: StudentOnboardingProfile;
  currentRole: UserRole;
  onUpdateDocument?: (docKey: keyof StudentOnboardingProfile['documents']) => void;
  onUpdateOrientation?: (orientKey: keyof StudentOnboardingProfile['orientationChecklist']) => void;
  onSaveProfile?: () => void;
}

export const StudentOnboardingView: React.FC<StudentOnboardingViewProps> = ({
  onboardingData,
  currentRole,
  onUpdateDocument,
  onUpdateOrientation,
  onSaveProfile,
}) => {
  const [profile, setProfile] = useState<StudentOnboardingProfile>(onboardingData);
  const isStudent = currentRole === 'student';
  const isReadOnly = currentRole === 'viewer_dinas';

  const toggleDoc = (key: keyof StudentOnboardingProfile['documents']) => {
    if (isReadOnly) return;
    const updated = {
      ...profile,
      documents: {
        ...profile.documents,
        [key]: !profile.documents[key],
      },
    };
    setProfile(updated);
    if (onUpdateDocument) onUpdateDocument(key);
  };

  const toggleOrient = (key: keyof StudentOnboardingProfile['orientationChecklist']) => {
    if (isReadOnly) return;
    const updated = {
      ...profile,
      orientationChecklist: {
        ...profile.orientationChecklist,
        [key]: !profile.orientationChecklist[key],
      },
    };
    setProfile(updated);
    if (onUpdateOrientation) onUpdateOrientation(key);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
              <span>Modul 8.5 • Student Onboarding & Readiness Protocol</span>
            </div>
            <h2 className="text-[24px] font-black text-white tracking-tight">
              Onboarding & Kesiapan Pra-Pemagangan
            </h2>
            <p className="text-[13px] text-white/60 mt-1 max-w-2xl">
              Verifikasi dokumen persyaratan, kontak darurat, induksi K3, dan etika kerja industri sebelum siswa resmi diterjunkan ke lokasi DUDI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right">
              <span className="text-[11px] text-white/50 block font-bold uppercase">Status Kesiapan</span>
              <span className="text-[20px] font-black text-emerald-300 flex items-center gap-1.5 justify-end">
                <span className="material-symbols-outlined text-[22px]">verified</span>
                {profile.readinessPercentage}% SIAP
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student & Emergency Contact Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-[16px] flex items-center gap-2 pb-3 border-b border-white/10">
              <span className="material-symbols-outlined text-[18px] text-violet-400">person</span>
              Profil Siswa
            </h3>

            <div className="space-y-3 text-[13px]">
              <div>
                <span className="text-white/40 text-[11px] block">Nama Lengkap:</span>
                <span className="font-bold text-white">{profile.studentName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-white/40 text-[11px] block">NISN:</span>
                  <span className="font-mono text-white/80">{profile.nisn}</span>
                </div>
                <div>
                  <span className="text-white/40 text-[11px] block">Golongan Darah:</span>
                  <span className="font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20 inline-block mt-0.5">
                    {profile.bloodType}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-white/40 text-[11px] block">No. Telepon Siswa:</span>
                <span className="font-mono text-white/80">{profile.phone}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact (Req 8.5) */}
          <div className="glass-card rounded-3xl p-6 border border-rose-500/20 bg-rose-950/10 shadow-xl space-y-4">
            <h3 className="font-bold text-rose-300 text-[16px] flex items-center gap-2 pb-3 border-b border-rose-500/20">
              <span className="material-symbols-outlined text-[18px] text-rose-400">emergency</span>
              Kontak Darurat (Emergency Contact)
            </h3>

            <div className="space-y-3 text-[13px]">
              <div>
                <span className="text-white/40 text-[11px] block">Nama Kontak Wali:</span>
                <span className="font-bold text-white">{profile.emergencyContact.name} ({profile.emergencyContact.relationship})</span>
              </div>
              <div>
                <span className="text-white/40 text-[11px] block">Nomor Telepon Darurat:</span>
                <span className="font-bold text-rose-300 font-mono text-[14px]">
                  {profile.emergencyContact.phone}
                </span>
              </div>
              <div>
                <span className="text-white/40 text-[11px] block">Alamat Domisili Wali:</span>
                <span className="text-white/70 text-[12px]">{profile.emergencyContact.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Required Documents & Orientation Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Documents Checklist */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <h3 className="font-bold text-white text-[16px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-violet-400">description</span>
                  Kelengkapan Dokumen Persyaratan
                </h3>
                <p className="text-[12px] text-white/50">Dokumen wajib diserahkan sebelum penugasan hari pertama.</p>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                5 / 5 Terverifikasi
              </span>
            </div>

            <div className="space-y-3">
              {[
                { key: 'parentPermissionLetter', label: 'Surat Izin Resmi Orang Tua / Wali', desc: 'Ditandatangani di atas meterai 10.000' },
                { key: 'integrityPact', label: 'Pakta Integritas Tata Tertib Pemagangan', desc: 'Komitmen etika kerja dan kepatuhan K3' },
                { key: 'bpjsKetenagakerjaan', label: 'Bukti Kepesertaan BPJS Ketenagakerjaan', desc: 'Perlindungan jaminan kecelakaan kerja (JKK)' },
                { key: 'cvPortfolio', label: 'Curriculum Vitae (CV) & Portofolio Siswa', desc: 'Ringkasan project dan hasil karya keahlian' },
                { key: 'medicalCertificate', label: 'Surat Keterangan Sehat dari Fasilitas Kesehatan', desc: 'Pemeriksaan fisik dan bebas narkoba' },
              ].map((doc) => {
                const isChecked = profile.documents[doc.key as keyof StudentOnboardingProfile['documents']];
                return (
                  <div
                    key={doc.key}
                    onClick={() => toggleDoc(doc.key as keyof StudentOnboardingProfile['documents'])}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[20px] ${isChecked ? 'text-emerald-400' : 'text-white/30'}`}>
                        {isChecked ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <div>
                        <p className={`font-bold text-[13px] ${isChecked ? 'text-white' : 'text-white/70'}`}>{doc.label}</p>
                        <p className="text-[11px] text-white/40">{doc.desc}</p>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${isChecked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/40'}`}>
                      {isChecked ? 'LENGKAP' : 'BELUM'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orientation / Pembekalan Checklist */}
          <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <h3 className="font-bold text-white text-[16px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-400">school</span>
                  Checklist Pembekalan & Orientasi DUDI
                </h3>
                <p className="text-[12px] text-white/50">Materi pembekalan pra-magang bersama pembimbing sekolah dan DUDI.</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: 'k3SafetyInduction', label: 'Induksi Keselamatan & Kesehatan Kerja (K3)', icon: 'health_and_safety' },
                { key: 'companyRulesBriefing', label: 'Sosialisasi Aturan & Kerahasiaan Perusahaan (NDA)', icon: 'gavel' },
                { key: 'professionalEthics', label: 'Etika Komunikasi Profesional & Budaya Kerja 5R', icon: 'handshake' },
                { key: 'curriculumTargetSync', label: 'Sinkronisasi Target Capaian SKKNI & Rubrik Jurnal', icon: 'checklist' },
              ].map((item) => {
                const isChecked = profile.orientationChecklist[item.key as keyof StudentOnboardingProfile['orientationChecklist']];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleOrient(item.key as keyof StudentOnboardingProfile['orientationChecklist'])}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-white/[0.02] border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[20px] ${isChecked ? 'text-amber-400' : 'text-white/30'}`}>
                        {item.icon}
                      </span>
                      <span className={`font-bold text-[13px] ${isChecked ? 'text-white' : 'text-white/70'}`}>{item.label}</span>
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${isChecked ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-white/40'}`}>
                      {isChecked ? 'SELESAI' : 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
