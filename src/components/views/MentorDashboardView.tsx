import React from 'react';
import { PendingAction, StudentItem } from '../../types';

interface MentorDashboardViewProps {
  pendingActions: PendingAction[];
  students: StudentItem[];
  onReviewAction: (action: PendingAction) => void;
  onViewDetailedGrid: () => void;
  onViewAllActions: () => void;
  searchQuery: string;
}

export const MentorDashboardView: React.FC<MentorDashboardViewProps> = ({
  pendingActions,
  students,
  onReviewAction,
  onViewDetailedGrid,
  onViewAllActions,
  searchQuery,
}) => {
  // Filter actions based on search
  const filteredActions人力 = pendingActions.filter(
    (act) =>
      act.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = pendingActions.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-indigo-950/20 to-[#0e1122]/80">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Industry Mentor Dashboard • /industry/mentor/dashboard
              </span>
              <span className="text-white/40 text-[12px]">• Bayu Pratama, S.T. (Lead Software Architect)</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Monitoring & Validasi Siswa Magang Industri
            </h2>
            <p className="text-[14px] text-white/70 max-w-2xl mt-1">
              Validasi logbook harian, konfirmasi presensi kerja, verifikasi pencapaian unit kompetensi, dan berikan evaluasi kinerja berkala.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onViewDetailedGrid}
              className="px-4 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] text-purple-300 border border-purple-500/30 rounded-2xl text-[13px] font-bold cursor-pointer transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
              <span>Matriks Penilaian Cepat</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Exact Required Industry Mentor KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 - Interns Supervised */}
        <div
          id="mentor-kpi-students"
          className="glass-card rounded-2xl border border-white/10 p-5 shadow-xl flex flex-col justify-between glass-card-hover"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[12px] font-bold text-white/50 uppercase">Interns Supervised</h3>
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
              <span className="material-symbols-outlined text-[18px]">groups</span>
            </div>
          </div>
          <div>
            <p className="text-[28px] font-black text-white leading-none">{students.length || 5} Siswa</p>
            <p className="text-[11px] text-violet-300 font-semibold mt-2">SMK Negeri 1 Jakarta</p>
          </div>
        </div>

        {/* KPI 2 - Today Attendance */}
        <div
          id="mentor-kpi-attendance"
          className="glass-card rounded-2xl border border-white/10 p-5 shadow-xl flex flex-col justify-between glass-card-hover"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[12px] font-bold text-white/50 uppercase">Today Attendance</h3>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </div>
          </div>
          <div>
            <p className="text-[28px] font-black text-emerald-400 leading-none">{students.length || 5} / {students.length || 5}</p>
            <p className="text-[11px] text-emerald-400/80 font-semibold mt-2">100% Hadir Tepat Waktu</p>
          </div>
        </div>

        {/* KPI 3 - Pending Journal Approvals */}
        <div
          id="mentor-kpi-journals"
          className="glass-card rounded-2xl border border-pink-500/30 bg-pink-950/15 p-5 shadow-xl flex flex-col justify-between glass-card-hover"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[12px] font-bold text-pink-300/80 uppercase">Pending Journals</h3>
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-300">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </div>
          </div>
          <div>
            <p className="text-[28px] font-black text-pink-300 leading-none">
              {pendingCount}
            </p>
            <p className="text-[11px] text-pink-300 font-semibold mt-2">Perlu Persetujuan Mentor</p>
          </div>
        </div>

        {/* KPI 4 - Pending Competency Validations */}
        <div
          id="mentor-kpi-competencies"
          className="glass-card rounded-2xl border border-white/10 p-5 shadow-xl flex flex-col justify-between glass-card-hover"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[12px] font-bold text-white/50 uppercase">Competency Validations</h3>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>
          <div>
            <p className="text-[28px] font-black text-cyan-300 leading-none">42 Valid</p>
            <p className="text-[11px] text-cyan-400 font-semibold mt-2">SKKNI Level 2 Terverifikasi</p>
          </div>
        </div>

        {/* KPI 5 - Quick Evaluation */}
        <div
          id="mentor-kpi-evaluations"
          className="glass-card rounded-2xl border border-amber-500/30 p-5 shadow-xl flex flex-col justify-between glass-card-hover"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[12px] font-bold text-amber-300/80 uppercase">Quick Evaluation</h3>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <span className="material-symbols-outlined text-[18px]">stars</span>
            </div>
          </div>
          <div>
            <p className="text-[28px] font-black text-amber-300 leading-none">94.8 / 100</p>
            <p className="text-[11px] text-amber-400 font-semibold mt-2">Rata-Rata Nilai Kinerja</p>
          </div>
        </div>
      </div>

      {/* Bento Grid: Pending Actions (2 cols) & Student Progress (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pending Actions Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/10 shadow-xl flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-[16px] font-bold text-white">Pending Actions</h2>
            <button
              id="mentor-view-all-actions-btn"
              onClick={onViewAllActions}
              className="text-[12px] font-bold text-violet-400 hover:text-violet-300 cursor-pointer transition-colors"
            >
              View All ({filteredActions人力.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/10">
                  <th className="px-6 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-white/60">
                    Student
                  </th>
                  <th className="px-6 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-white/60">
                    Type
                  </th>
                  <th className="px-6 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-white/60">
                    Submitted
                  </th>
                  <th className="px-6 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-white/60 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredActions人力.map((act) => {
                  const isAttendance更加 = act.type === 'Weekly Attendance';

                  return (
                    <tr
                      key={act.id}
                      id={`pending-action-row-${act.id}`}
                      className="hover:bg-white/[0.04] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {act.studentAvatar ? (
                            <img
                              src={act.studentAvatar}
                              alt={act.studentName}
                              className="w-9 h-9 rounded-full object-cover bg-white/10 border border-white/20"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center text-[12px] font-bold">
                              {act.studentInitials || 'ST'}
                            </div>
                          )}
                          <div>
                            <p className="text-[14px] font-semibold text-white">
                              {act.studentName}
                            </p>
                            <p className="text-[12px] text-white/50">{act.department}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold border ${
                            isAttendance更加
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                          }`}
                        >
                          {act.type}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-[13px] text-white/60">{act.submittedTime}</td>

                      <td className="px-6 py-4 text-right">
                        {act.status === 'approved' ? (
                          <span className="text-[12px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-xl">
                            Approved ✓
                          </span>
                        ) : (
                          <button
                            id={`action-btn-review-${act.id}`}
                            onClick={() => onReviewAction(act)}
                            className="text-[13px] font-semibold text-violet-300 hover:text-white bg-violet-500/20 hover:bg-violet-500/30 transition-all border border-violet-500/30 rounded-xl px-3.5 py-1.5 cursor-pointer active:scale-95"
                          >
                            {isAttendance更加 ? 'Validate' : 'Review'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Student Competency Progress (Dynamic Real Students) */}
        <div className="glass-card rounded-2xl border border-white/10 shadow-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-white mb-6">Competency Progress</h2>
            <div className="space-y-6">
              {students.map((student, idx) => (
                <div key={student.id || idx}>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[14px] font-medium text-white">{student.name}</p>
                    <span className="text-[12px] font-semibold text-violet-300">{student.competencyProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                      style={{ width: `${student.competencyProgress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            id="mentor-view-detailed-grid-btn"
            onClick={onViewDetailedGrid}
            className="mt-6 w-full text-center py-2.5 text-[14px] font-semibold text-violet-300 border border-white/12 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl transition-all cursor-pointer active:scale-98 backdrop-blur-md"
          >
            View Detailed Grid
          </button>
        </div>
      </div>
    </div>
  );
};
