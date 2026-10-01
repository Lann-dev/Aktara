import React, { useState } from 'react';
import { CompetencyScore, UserRole } from '../../types';

interface CompetencyTrackingViewProps {
  competencies: CompetencyScore[];
  currentRole: UserRole;
  searchQuery?: string;
  onValidateCompetency?: (compId: string, status: 'Achieved' | 'In Progress' | 'Needs Improvement') => void;
}

export const CompetencyTrackingView: React.FC<CompetencyTrackingViewProps> = ({
  competencies,
  currentRole,
  searchQuery = '',
  onValidateCompetency,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'Achieved' | 'In Progress' | 'Needs Improvement' | 'Not Started'>('ALL');

  const filtered = competencies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatusFilter === 'ALL' || c.status === selectedStatusFilter;
    return matchSearch && matchStatus;
  });

  const isMentor = currentRole === 'industry_mentor' || currentRole === 'teacher_mentor' || currentRole === 'mentor';
  const isReadOnly = currentRole === 'viewer_dinas';

  // Average progress calculation
  const totalPercentage = competencies.reduce((acc, curr) => acc + curr.percentage, 0);
  const avgProgress = competencies.length > 0 ? Math.round(totalPercentage / competencies.length) : 0;
  const achievedCount = competencies.filter((c) => c.status === 'Achieved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">task_alt</span>
              <span>Modul 8.8 • Standar & Pelacakan Kompetensi Vokasi</span>
            </div>
            <h2 className="text-[24px] font-black text-white tracking-tight">
              Matriks Capaian Kompetensi SKKNI
            </h2>
            <p className="text-[13px] text-white/60 mt-1 max-w-2xl">
              Pemantauan target unit kompetensi per program keahlian, keterhubungan dengan bukti tugas (evidence), dan validasi level kemahiran oleh industri & guru pembimbing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-right">
            <span className="text-[11px] text-white/50 block font-bold uppercase">Rata-Rata Capaian</span>
            <span className="text-[22px] font-black text-indigo-300 flex items-center gap-1.5 justify-end">
              <span className="material-symbols-outlined text-[24px]">verified</span>
              {avgProgress}% ({achievedCount}/{competencies.length} Tuntas)
            </span>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto hide-scrollbar">
          {(['ALL', 'Achieved', 'In Progress', 'Needs Improvement', 'Not Started'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                selectedStatusFilter === st
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30 border border-indigo-500/30'
                  : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08]'
              }`}
            >
              {st === 'ALL' ? 'Semua Target' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((comp, idx) => (
          <div
            key={comp.id || idx}
            className="glass-card rounded-2xl p-5 border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                  {comp.category}
                </span>

                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                    comp.status === 'Achieved'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : comp.status === 'In Progress'
                      ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                      : comp.status === 'Needs Improvement'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-white/5 text-white/40 border-white/10'
                  }`}
                >
                  {comp.status || 'In Progress'}
                </span>
              </div>

              <h4 className="font-bold text-white text-[15px] mt-3 leading-snug">{comp.name}</h4>

              {/* Progress Bar & Level */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/50">Tingkat Kemahiran: <strong className="text-white">{comp.level}</strong></span>
                  <span className="font-bold text-indigo-300">{comp.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full transition-all"
                    style={{ width: `${comp.percentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Evidence & Verifier */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-[11px] text-white/60">
                {comp.verifiedBy && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Divalidasi: {comp.verifiedBy}</span>
                  </div>
                )}
                {comp.evidenceUrl && (
                  <a
                    href={comp.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-indigo-300 hover:underline pt-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    <span>Tautan Bukti Evidence Kinerja</span>
                  </a>
                )}
              </div>
            </div>

            {/* Validation quick action for Mentor */}
            {!isReadOnly && isMentor && onValidateCompetency && (
              <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => onValidateCompetency(comp.id || comp.name, 'Achieved')}
                  className="flex-1 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold rounded-lg text-[11px] cursor-pointer text-center"
                >
                  Setujui Capaian
                </button>
                <button
                  onClick={() => onValidateCompetency(comp.id || comp.name, 'Needs Improvement')}
                  className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg text-[11px] border border-amber-500/30 cursor-pointer"
                >
                  Revisi
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
