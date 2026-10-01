import React, { useState } from 'react';
import { AttendanceRecord, UserRole } from '../../types';

interface AttendanceViewProps {
  attendanceLogs: AttendanceRecord[];
  currentRole: UserRole;
  searchQuery?: string;
  onOpenCheckInModal?: () => void;
  onValidateRecord?: (recordId: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendanceLogs,
  currentRole,
  searchQuery = '',
  onOpenCheckInModal,
  onValidateRecord,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'Present' | 'Late' | 'Excused' | 'Absent' | 'Holiday'>('ALL');

  const filteredLogs = attendanceLogs.filter((log) => {
    const matchSearch =
      (log.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatusFilter === 'ALL' || log.status === selectedStatusFilter;
    return matchSearch && matchStatus;
  });

  const isStudent = currentRole === 'student';
  const isMentor = currentRole === 'industry_mentor' || currentRole === 'teacher_mentor' || currentRole === 'mentor';
  const isReadOnly = currentRole === 'viewer_dinas';

  // Stats calculation
  const total = attendanceLogs.length;
  const presentCount = attendanceLogs.filter((l) => l.status === 'Present').length;
  const lateCount = attendanceLogs.filter((l) => l.status === 'Late').length;
  const excusedCount = attendanceLogs.filter((l) => l.status === 'Excused').length;
  const absentCount = attendanceLogs.filter((l) => l.status === 'Absent').length;
  const attendanceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">event_available</span>
              <span>Modul 8.6 • Presensi Harian & GPS Geofencing</span>
            </div>
            <h2 className="text-[24px] font-black text-white tracking-tight">
              Presensi & Rekapitulasi Kehadiran
            </h2>
            <p className="text-[13px] text-white/60 mt-1 max-w-2xl">
              Pencatatan presensi real-time dengan validasi koordinat GPS geofencing industri, status Hadir/Izin/Sakit/Alfa/Libur, dan verifikasi mentor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isStudent && onOpenCheckInModal && (
              <button
                onClick={onOpenCheckInModal}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl text-[13px] shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center gap-2 active:scale-98"
              >
                <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                <span>Presensi GPS Sekarang</span>
              </button>
            )}
          </div>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-4 border-t border-white/10">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <span className="text-[20px] font-black text-emerald-400">{attendanceRate}%</span>
            <p className="text-[11px] text-white/40 font-semibold mt-0.5">Tingkat Kehadiran</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[20px] font-black text-emerald-300">{presentCount}</span>
            <p className="text-[11px] text-emerald-400/80 font-semibold mt-0.5">Hadir Tepat Waktu</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[20px] font-black text-amber-300">{lateCount}</span>
            <p className="text-[11px] text-amber-400/80 font-semibold mt-0.5">Terlambat</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
            <span className="text-[20px] font-black text-blue-300">{excusedCount}</span>
            <p className="text-[11px] text-blue-400/80 font-semibold mt-0.5">Izin / Sakit</p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
            <span className="text-[20px] font-black text-rose-300">{absentCount}</span>
            <p className="text-[11px] text-rose-400/80 font-semibold mt-0.5">Alfa (Tanpa Keterangan)</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar text-[12px]">
        {(['ALL', 'Present', 'Late', 'Excused', 'Absent', 'Holiday'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedStatusFilter === st
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/30 border border-cyan-500/30'
                : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08]'
            }`}
          >
            {st === 'ALL' ? 'Semua Riwayat' : st === 'Present' ? 'Hadir' : st === 'Late' ? 'Terlambat' : st === 'Excused' ? 'Izin/Sakit' : st === 'Absent' ? 'Alfa' : 'Libur'}
          </button>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-white/80">
            <thead className="bg-white/[0.04] text-white/50 text-[11px] uppercase tracking-wider font-bold border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                {!isStudent && <th className="px-6 py-4">Nama Siswa</th>}
                <th className="px-6 py-4">Check-In</th>
                <th className="px-6 py-4">Check-Out</th>
                <th className="px-6 py-4">Lokasi & GPS</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Verifikasi Mentor</th>
                {!isReadOnly && isMentor && <th className="px-6 py-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-white">{log.date}</td>
                  {!isStudent && (
                    <td className="px-6 py-4 font-bold text-white">{log.studentName || 'Alex Mercer'}</td>
                  )}
                  <td className="px-6 py-4 text-emerald-400 font-mono font-bold">{log.checkInTime}</td>
                  <td className="px-6 py-4 text-white/70 font-mono">{log.checkOutTime || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[12px]">
                      <span className="material-symbols-outlined text-[15px] text-cyan-400">location_on</span>
                      <span className="truncate max-w-[200px]">{log.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${
                        log.status === 'Present'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : log.status === 'Late'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : log.status === 'Excused'
                          ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {log.verifiedByMentor ? (
                      <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">pending</span>
                        Menunggu Review
                      </span>
                    )}
                  </td>
                  {!isReadOnly && isMentor && (
                    <td className="px-6 py-4 text-right">
                      {!log.verifiedByMentor && onValidateRecord && (
                        <button
                          onClick={() => onValidateRecord(log.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          Validasi
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
