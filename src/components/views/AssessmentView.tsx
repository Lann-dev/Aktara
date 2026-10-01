import React, { useState } from 'react';
import { StudentAssessment, UserRole } from '../../types';

interface AssessmentViewProps {
  assessments: StudentAssessment[];
  currentRole: UserRole;
  searchQuery?: string;
  onLockFinalizeAssessment?: (assessmentId: string) => void;
  onUpdateScore?: (assessmentId: string, scores: Partial<StudentAssessment>) => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  assessments,
  currentRole,
  searchQuery = '',
  onLockFinalizeAssessment,
  onUpdateScore,
}) => {
  const [selectedAssessment, setSelectedAssessment] = useState<StudentAssessment | null>(assessments[0] || null);

  const filtered = assessments.filter((a) => {
    const matchSearch =
      a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const isMentor = currentRole === 'industry_mentor' || currentRole === 'teacher_mentor' || currentRole === 'mentor' || currentRole === 'school_admin';
  const isReadOnly = currentRole === 'viewer_dinas';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">assignment_turned_in</span>
              <span>Modul 8.10 • Rubrik Penilaian Terbobot & Finalisasi Nilai</span>
            </div>
            <h2 className="text-[24px] font-black text-white tracking-tight">
              Penilaian Multi-Aspek & Konfigurasi Skor Akhir
            </h2>
            <p className="text-[13px] text-white/60 mt-1 max-w-2xl">
              Integrasi rubrik berbobot: Technical Skill (40%), Soft Skill (20%), Kedisiplinan (15%), Komunikasi (10%), Teamwork (10%), dan K3 (5%) dengan pembobotan Industri (60%) & Guru (40%).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-right">
              <span className="text-[11px] text-white/40 block font-bold uppercase">Pembobotan Sinergi</span>
              <span className="text-[14px] font-black text-white">
                <span className="text-purple-300">DUDI 60%</span> : <span className="text-cyan-300">Sekolah 40%</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Assessment Cards (1 col) */}
        <div className="lg:col-span-1 space-y-3">
          {filtered.map((asm) => (
            <div
              key={asm.id}
              onClick={() => setSelectedAssessment(asm)}
              className={`glass-card rounded-2xl p-4 border transition-all cursor-pointer ${
                selectedAssessment?.id === asm.id
                  ? 'border-violet-500/80 bg-violet-500/10 shadow-xl shadow-violet-950/50'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-[14px]">{asm.studentName}</h4>
                  <p className="text-[11px] text-violet-300 font-medium">{asm.department}</p>
                  <p className="text-[11px] text-white/50">{asm.companyName}</p>
                </div>

                <div className="text-right">
                  <span className="text-[18px] font-black text-emerald-400 font-mono">
                    {asm.finalNumericalScore}
                  </span>
                  <span className="text-[11px] text-white/40 block font-bold">Grade: {asm.finalGrade}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    asm.status === 'Locked_Finalized'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {asm.status === 'Locked_Finalized' ? '🔒 Terkunci & Sah' : '📝 Draft Penilaian'}
                </span>
                <span className="text-white/40">Klik untuk rincian rubrik</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Assessment Detailed Rubric & Lock (2 cols) */}
        <div className="lg:col-span-2">
          {selectedAssessment ? (
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white text-[18px]">{selectedAssessment.studentName}</h3>
                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {selectedAssessment.department}
                    </span>
                  </div>
                  <p className="text-[12px] text-white/50 mt-0.5">Penempatan: {selectedAssessment.companyName}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] text-white/50 block font-bold uppercase">Nilai Akhir</span>
                    <span className="text-[22px] font-black text-emerald-300 font-mono">
                      {selectedAssessment.finalNumericalScore} ({selectedAssessment.finalGrade})
                    </span>
                  </div>
                </div>
              </div>

              {/* Multi-aspect Rubric Bars */}
              <div className="space-y-3.5">
                <h4 className="text-[13px] font-bold text-white/80 uppercase tracking-wider">
                  Rincian 6 Indikator Rubrik Berbobot:
                </h4>

                {[
                  { label: 'Technical Skill & Problem Solving', weight: '40%', score: selectedAssessment.technicalSkillScore, color: 'from-violet-500 to-indigo-400' },
                  { label: 'Soft Skill & Inisiatif Mandiri', weight: '20%', score: selectedAssessment.softSkillScore, color: 'from-purple-500 to-pink-400' },
                  { label: 'Kedisiplinan & Presensi Kerja', weight: '15%', score: selectedAssessment.disciplineScore, color: 'from-emerald-500 to-teal-400' },
                  { label: 'Komunikasi & Presentasi Teknis', weight: '10%', score: selectedAssessment.communicationScore, color: 'from-blue-500 to-cyan-400' },
                  { label: 'Kerja Sama Tim (Teamwork & Agile)', weight: '10%', score: selectedAssessment.teamworkScore, color: 'from-cyan-500 to-sky-400' },
                  { label: 'Kepatuhan K3 & Keselamatan Kerja', weight: '5%', score: selectedAssessment.safetyK3Score, color: 'from-amber-500 to-orange-400' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between text-[12px] mb-1.5 font-semibold">
                      <span className="text-white/80">{item.label} <strong className="text-violet-400">({item.weight})</strong></span>
                      <span className="font-mono text-white">{item.score} / 100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mentors Feedback Comments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-[12px] space-y-1">
                  <span className="text-purple-300 font-bold block">Evaluasi Pembimbing Industri (DUDI):</span>
                  <p className="text-white/80 italic">"{selectedAssessment.industryMentorFeedback}"</p>
                  <p className="text-[10px] text-white/40 pt-1">Skor DUDI: <strong>{selectedAssessment.industryMentorScore}</strong> (Bobot 60%)</p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-[12px] space-y-1">
                  <span className="text-cyan-300 font-bold block">Evaluasi Guru Pembimbing Sekolah:</span>
                  <p className="text-white/80 italic">"{selectedAssessment.teacherMentorFeedback}"</p>
                  <p className="text-[10px] text-white/40 pt-1">Skor Guru: <strong>{selectedAssessment.teacherMentorScore}</strong> (Bobot 40%)</p>
                </div>
              </div>

              {/* Lock / Finalize Button (Req 8.10) */}
              {!isReadOnly && isMentor && (
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-[11px] text-white/40">
                    {selectedAssessment.status === 'Locked_Finalized' ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                        Nilai telah dikunci permanen pada {selectedAssessment.finalizedAt}
                      </span>
                    ) : (
                      'Setelah disetujui bersama, nilai akan dikunci untuk penerbitan sertifikat.'
                    )}
                  </div>

                  {selectedAssessment.status !== 'Locked_Finalized' && onLockFinalizeAssessment && (
                    <button
                      onClick={() => onLockFinalizeAssessment(selectedAssessment.id)}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-[13px] shadow-lg shadow-emerald-950/40 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                      <span>Kunci & Sahkan Nilai Akhir</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 border border-white/10 text-center text-white/40">
              <p>Pilih siswa untuk melihat rubrik penilaian.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
