import React, { useState } from 'react';
import { SupervisionSchedule, UserRole } from '../../types';

interface SupervisionViewProps {
  schedules: SupervisionSchedule[];
  currentRole: UserRole;
  searchQuery?: string;
  onAddSchedule?: () => void;
  onResolveIssue?: (scheduleId: string) => void;
}

export const SupervisionView: React.FC<SupervisionViewProps> = ({
  schedules,
  currentRole,
  searchQuery = '',
  onAddSchedule,
  onResolveIssue,
}) => {
  const [selectedSchedule, setSelectedSchedule] = useState<SupervisionSchedule | null>(null);

  const filtered = schedules.filter((s) => {
    const matchSearch =
      s.industryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentNames.some((st) => st.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  const isTeacher = currentRole === 'teacher_mentor' || currentRole === 'school_admin';
  const isReadOnly = currentRole === 'viewer_dinas';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">domain_verification</span>
              <span>Modul 8.9 • Supervisi & Monitoring Guru Pembimbing</span>
            </div>
            <h2 className="text-[24px] font-black text-white tracking-tight">
              Jadwal & Catatan Supervisi Industri
            </h2>
            <p className="text-[13px] text-white/60 mt-1 max-w-2xl">
              Perencanaan visitasi on-site dan sinkronisasi virtual guru pembimbing sekolah, pencatatan temuan issue kendala siswa, dan rencana tindak lanjut terukur.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isReadOnly && isTeacher && onAddSchedule && (
              <button
                onClick={onAddSchedule}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-[13px] shadow-lg shadow-cyan-950/40 transition-all cursor-pointer flex items-center gap-2 active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
                <span>Jadwalkan Kunjungan Baru</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supervision Schedules List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((sup) => (
            <div
              key={sup.id}
              onClick={() => setSelectedSchedule(sup)}
              className={`glass-card rounded-2xl p-5 border transition-all cursor-pointer ${
                selectedSchedule?.id === sup.id
                  ? 'border-cyan-500/80 bg-cyan-500/10 shadow-xl shadow-cyan-950/50'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[12px]">
                    {sup.visitDate}
                  </span>
                  <span className="text-white/60 text-[12px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-cyan-400">
                      {sup.type === 'On-site Visit' ? 'directions_car' : 'videocam'}
                    </span>
                    {sup.type}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border self-start sm:self-center ${
                    sup.resolutionStatus === 'Resolved'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : sup.resolutionStatus === 'In Progress'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {sup.resolutionStatus === 'Resolved' ? 'Tindak Lanjut Tuntas' : sup.resolutionStatus === 'In Progress' ? 'Proses Tindak Lanjut' : 'Issue Terbuka'}
                </span>
              </div>

              <h4 className="font-bold text-white text-[15px] mt-3">{sup.industryName}</h4>
              <p className="text-[12px] text-white/60 mt-0.5">Guru Pembimbing: <strong className="text-white">{sup.teacherName}</strong></p>

              {/* Student chips */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {sup.studentNames.map((st, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[11px] text-white/80 font-medium">
                    👤 {st}
                  </span>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 text-[12px] text-white/70">
                <p className="line-clamp-2"><strong className="text-white/40">Temuan:</strong> {sup.findings}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Supervision Detail & Action Plan Panel (1 col) */}
        <div className="lg:col-span-1">
          {selectedSchedule ? (
            <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-white text-[15px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-cyan-400">summarize</span>
                  Detail Catatan Supervisi
                </h3>
                <span className="text-[11px] font-mono text-cyan-300">{selectedSchedule.visitDate}</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-white/40 uppercase block mb-1">Mitra Industri:</span>
                <p className="text-[14px] font-bold text-white">{selectedSchedule.industryName}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-white/40 uppercase block mb-1">Catatan & Temuan Guru:</span>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[12px] text-white/80 leading-relaxed">
                  {selectedSchedule.findings}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-rose-400 uppercase block mb-1">Kendala / Issue Siswa:</span>
                <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-[12px] text-rose-200">
                  {selectedSchedule.issues}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase block mb-1">Action Plan & Solusi:</span>
                <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-[12px] text-amber-200 space-y-1">
                  <p>{selectedSchedule.actionPlan}</p>
                  <p className="text-[10px] text-amber-400/70 font-mono font-bold">Batas Waktu: {selectedSchedule.dueDate}</p>
                </div>
              </div>

              {!isReadOnly && selectedSchedule.resolutionStatus !== 'Resolved' && onResolveIssue && (
                <div className="pt-3 border-t border-white/10">
                  <button
                    onClick={() => onResolveIssue(selectedSchedule.id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[12px] shadow-lg shadow-emerald-950/40 transition-all cursor-pointer text-center"
                  >
                    Tandai Masalah Telah Selesai
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 border border-white/10 text-center text-white/40">
              <span className="material-symbols-outlined text-[40px] text-white/20 mb-2">calendar_month</span>
              <p className="text-[13px]">Klik salah satu jadwal supervisi untuk melihat catatan temuan dan rencana tindak lanjut.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
