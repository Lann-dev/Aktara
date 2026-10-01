import React, { useState } from 'react';
import { PlacementApplication, UserRole } from '../../types';

interface PlacementsViewProps {
  applications: PlacementApplication[];
  currentRole: UserRole;
  searchQuery?: string;
  onApproveApplication?: (appId: string) => void;
  onRejectApplication?: (appId: string) => void;
  onOpenNewPlacementModal?: () => void;
  onViewDetails?: (app: PlacementApplication) => void;
}

export const PlacementsView: React.FC<PlacementsViewProps> = ({
  applications,
  currentRole,
  searchQuery = '',
  onApproveApplication,
  onRejectApplication,
  onOpenNewPlacementModal,
}) => {
  const [selectedApp, setSelectedApp] = useState<PlacementApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Submitted' | 'In Review' | 'Approved' | 'Placed'>('ALL');

  const filtered = applications.filter((app) => {
    const matchSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.targetCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const isReadOnly = currentRole === 'viewer_dinas';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              <span>Modul 8.4 • Matching & Penempatan Berbasis AI GANESA ID</span>
            </div>
            <h2 className="text-[24px] font-black text-white tracking-tight">
              Penempatan & Pencocokan Siswa ke Industri
            </h2>
            <p className="text-[13px] text-white/60 mt-1 max-w-2xl">
              Seleksi dan rekomendasi penempatan berbasis kesesuaian program keahlian, uji kompetensi, dan skor psikometrik vokasi GANESA ID lengkap dengan riwayat perubahan audit trail.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isReadOnly && onOpenNewPlacementModal && (
              <button
                onClick={onOpenNewPlacementModal}
                className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-[13px] shadow-lg shadow-violet-900/40 transition-all cursor-pointer flex items-center gap-2 active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">add_task</span>
                <span>Registrasi Penempatan Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto hide-scrollbar">
          {(['ALL', 'Submitted', 'In Review', 'Approved', 'Placed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30 border border-violet-500/30'
                  : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08]'
              }`}
            >
              {st === 'ALL' ? 'Semua Pengajuan' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Main List and History Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placements Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`glass-card rounded-2xl p-5 border transition-all cursor-pointer relative ${
                selectedApp?.id === app.id
                  ? 'border-violet-500/80 bg-violet-500/10 shadow-xl shadow-violet-950/50'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  {app.studentAvatar ? (
                    <img
                      src={app.studentAvatar}
                      alt={app.studentName}
                      className="w-12 h-12 rounded-xl object-cover border border-white/15 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-violet-600/30 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300">
                      {app.studentName.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-[15px]">{app.studentName}</h4>
                      <span className="text-[11px] text-white/40 font-mono">NIS: {app.studentNis}</span>
                    </div>
                    <p className="text-[12px] text-violet-300 font-medium">{app.department}</p>
                  </div>
                </div>

                {/* GANESA Match Score Badge */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">auto_awesome</span>
                    <span className="text-[12px] font-black">{app.ganesaMatchScore}% GANESA Match</span>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${
                      app.status === 'Placed'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : app.status === 'In Review'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>

              {/* Target Company & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/10 text-[12px]">
                <div className="flex items-center gap-2 text-white/80">
                  <span className="material-symbols-outlined text-[16px] text-orange-400">domain</span>
                  <span className="font-semibold">{app.targetCompany}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <span className="material-symbols-outlined text-[16px] text-violet-400">apartment</span>
                  <span>Unit: {app.targetUnit}</span>
                </div>
              </div>

              {/* Mentors Row */}
              <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/5">
                <span>Guru: {app.schoolMentor || 'Belum Ditugaskan'}</span>
                <span>Mentor DUDI: {app.industryMentor || 'Menunggu Verifikasi'}</span>
                <span className="text-violet-400 font-bold hover:underline">
                  Lihat Riwayat & Rekomendasi →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Application Detail & Placement History (1 col) */}
        <div className="lg:col-span-1">
          {selectedApp ? (
            <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-white text-[16px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-violet-400">fact_check</span>
                  Detail Evaluasi GANESA ID
                </h3>
                <span className="text-[11px] text-emerald-400 font-bold font-mono">
                  {selectedApp.ganesaMatchScore}% MATCH
                </span>
              </div>

              {/* GANESA Radar Breakdown */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">
                  Matriks Kecocokan Kompetensi:
                </p>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/70">Kesesuaian Skill Teknis:</span>
                    <span className="font-bold text-white">{selectedApp.ganesaFitDetails.technicalScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full"
                      style={{ width: `${selectedApp.ganesaFitDetails.technicalScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/70">Profil Psikometrik & Kerja:</span>
                    <span className="font-bold text-white">{selectedApp.ganesaFitDetails.psychometricScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${selectedApp.ganesaFitDetails.psychometricScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/70">Budaya Perusahaan (Culture Fit):</span>
                    <span className="font-bold text-white">{selectedApp.ganesaFitDetails.cultureFitScore}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                      style={{ width: `${selectedApp.ganesaFitDetails.cultureFitScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-[11px]">
                  <span className="text-white/40">Rekomendasi Penugasan: </span>
                  <span className="font-bold text-amber-300">{selectedApp.ganesaFitDetails.recommendedRole}</span>
                </div>
              </div>

              {/* Placement History / Audit Trail (Mandatory Req 8.4) */}
              <div>
                <p className="text-[12px] font-bold text-white/80 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-violet-400">history</span>
                  Riwayat Perubahan Penempatan
                </p>

                <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10 pl-5">
                  {selectedApp.placementHistory.map((hist) => (
                    <div key={hist.id} className="relative text-[11px]">
                      <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-violet-400 ring-4 ring-[#070913]"></div>
                      <p className="font-bold text-white/90">{hist.action}</p>
                      <p className="text-white/60 mt-0.5">{hist.newPlacement}</p>
                      <div className="flex items-center justify-between text-[10px] text-white/40 mt-1">
                        <span>Oleh: {hist.changedBy}</span>
                        <span>{hist.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons for Approver */}
              {!isReadOnly && selectedApp.status !== 'Placed' && (
                <div className="pt-4 border-t border-white/10 flex gap-2">
                  {onApproveApplication && (
                    <button
                      onClick={() => onApproveApplication(selectedApp.id)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[12px] shadow-lg shadow-emerald-950/40 transition-all cursor-pointer text-center"
                    >
                      Setujui Penempatan
                    </button>
                  )}
                  {onRejectApplication && (
                    <button
                      onClick={() => onRejectApplication(selectedApp.id)}
                      className="px-3 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded-xl text-[12px] border border-rose-500/30 transition-all cursor-pointer"
                    >
                      Tolak
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 border border-white/10 text-center text-white/40">
              <span className="material-symbols-outlined text-[40px] text-white/20 mb-2">touch_app</span>
              <p className="text-[13px]">Pilih pengajuan siswa di samping untuk melihat analisis kecocokan GANESA ID dan riwayat penempatan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
