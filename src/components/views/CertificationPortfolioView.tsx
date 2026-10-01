import React, { useState } from 'react';
import { StudentCertificate, UserRole } from '../../types';

interface CertificationPortfolioViewProps {
  certificates: StudentCertificate[];
  currentRole: UserRole;
  searchQuery?: string;
  onGenerateCertificate?: (studentId: string) => void;
  onDownloadPDF?: (certificate: StudentCertificate) => void;
}

export const CertificationPortfolioView: React.FC<CertificationPortfolioViewProps> = ({
  certificates,
  currentRole,
  searchQuery = '',
  onGenerateCertificate,
  onDownloadPDF,
}) => {
  const [selectedCert, setSelectedCert] = useState<StudentCertificate | null>(certificates[0] || null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const filtered = certificates.filter((c) => {
    const matchSearch =
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industryPartnerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const isSchoolAdmin = currentRole === 'school_admin' || currentRole === 'super_admin';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
              <span>Modul 8.12 • Sertifikasi Digital & Verifikasi QR Publik</span>
            </div>
            <h2 className="text-[24px] font-black text-white tracking-tight">
              Sertifikat Kompetensi & Portofolio Siswa
            </h2>
            <p className="text-[13px] text-white/60 mt-1 max-w-2xl">
              Penerbitan otomatis sertifikat tanda tamat magang ber-nomor unik resmi, lampiran transkrip kompetensi SKKNI, dan kode QR verifikasi publik anti-pemalsuan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSchoolAdmin && onGenerateCertificate && (
              <button
                onClick={() => onGenerateCertificate('all_qualified')}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-2xl text-[13px] shadow-lg shadow-amber-950/50 transition-all cursor-pointer flex items-center gap-2 active:scale-98"
              >
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>Terbitkan Sertifikat Baru</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Certificate List (1 col) */}
        <div className="lg:col-span-1 space-y-3">
          {filtered.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className={`glass-card rounded-2xl p-4 border transition-all cursor-pointer ${
                selectedCert?.id === cert.id
                  ? 'border-amber-500/80 bg-amber-500/10 shadow-xl shadow-amber-950/50'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-[14px]">{cert.studentName}</h4>
                  <p className="text-[11px] text-amber-300 font-mono mt-0.5">{cert.certificateNumber}</p>
                  <p className="text-[11px] text-white/50">{cert.industryPartnerName}</p>
                </div>

                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-white/50">
                <span>Nilai: <strong className="text-emerald-400 font-mono">{cert.finalScore} ({cert.finalGrade})</strong></span>
                <span>Selesai: {cert.completionDate}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Digital Preview (2 cols) */}
        <div className="lg:col-span-2">
          {selectedCert ? (
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-black/40 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Decorative Corner Seals */}
              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-black">
                    <span className="material-symbols-outlined text-[28px]">award_star</span>
                  </div>
                  <div>
                    <h3 className="font-black text-white text-[18px] tracking-tight uppercase">
                      Sertifikat Praktik Kerja Lapangan
                    </h3>
                    <p className="text-[11px] text-amber-400/80 font-mono">
                      No: {selectedCert.certificateNumber}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                  <span>Verifikasi QR</span>
                </button>
              </div>

              {/* Certificate Body Text */}
              <div className="text-center py-4 space-y-3">
                <p className="text-[12px] text-white/60 uppercase tracking-widest font-semibold">
                  Diberikan dengan predikat sangat baik kepada:
                </p>
                <h2 className="text-[26px] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200">
                  {selectedCert.studentName}
                </h2>
                <p className="text-[13px] text-white/80 max-w-xl mx-auto leading-relaxed">
                  Telah sukses menyelesaikan Program Praktik Kerja Industri (PKL) pada kompetensi keahlian{' '}
                  <strong className="text-amber-300">{selectedCert.programTitle}</strong> di{' '}
                  <strong className="text-white">{selectedCert.industryPartnerName}</strong>, selesai pada{' '}
                  <span className="font-mono text-white/80">{selectedCert.completionDate}</span> dengan predikat kelulusan{' '}
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold">
                    Grade {selectedCert.finalGrade} ({selectedCert.finalScore})
                  </span>.
                </p>
              </div>

              {/* Transcript of Competencies */}
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-2">
                <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Lampiran Transkrip Unit Kompetensi SKKNI:
                </p>
                <div className="space-y-1.5 text-[12px]">
                  {selectedCert.competenciesAchieved.map((competency, i) => (
                    <div key={i} className="py-1 border-b border-white/5 last:border-0">
                      <span className="text-white/80">{competency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-500/20 text-center text-[12px]">
                <div>
                  <p className="text-white/40 text-[11px]">Pembimbing Industri (DUDI)</p>
                  <p className="font-bold text-white mt-4">{selectedCert.industryPartnerName}</p>
                  <p className="text-[10px] text-white/50">Mitra Industri</p>
                </div>
                <div>
                  <p className="text-white/40 text-[11px]">Kepala Sekolah (SMK)</p>
                  <p className="font-bold text-white mt-4">{selectedCert.schoolName}</p>
                  <p className="text-[10px] text-white/50">Sekolah</p>
                </div>
              </div>

              {/* Download PDF action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (onDownloadPDF) onDownloadPDF(selectedCert);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl text-[12px] shadow-lg shadow-amber-950/50 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Unduh Sertifikat PDF Resmi</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 border border-white/10 text-center text-white/40">
              <p>Pilih sertifikat untuk melihat pratinjau digital.</p>
            </div>
          )}
        </div>
      </div>

      {/* QR Verification Modal */}
      {showVerifyModal && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-amber-500/40 bg-[#0d111e] max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">qr_code_scanner</span>
            </div>

            <h3 className="font-black text-white text-[18px]">Verifikasi Sertifikat Publik</h3>
            <p className="text-[12px] text-white/60">
              Pindai kode QR ini atau bagikan tautan verifikasi resmi untuk membuktikan keaslian sertifikat di sistem AKTARA.
            </p>

            {/* Simulated QR Box */}
            <div className="p-4 rounded-2xl bg-white mx-auto w-48 h-48 flex flex-col items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[100px] text-black">qr_code_2</span>
              <span className="text-[9px] font-mono font-bold text-black/70">AKTARA-VERIFIED-V2</span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-[11px] font-mono text-amber-300 break-all">
              {selectedCert.qrVerificationUrl}
            </div>

            <button
              onClick={() => setShowVerifyModal(false)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-[12px] transition-all cursor-pointer"
            >
              Tutup Jendela
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
