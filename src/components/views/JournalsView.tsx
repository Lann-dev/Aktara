import React, { useState, useEffect } from 'react';
import { DailyJournalEntry, UserRole } from '../../types';

interface JournalsViewProps {
  journals: DailyJournalEntry[];
  currentRole: UserRole;
  searchQuery?: string;
  onOpenAddJournalModal?: () => void;
  onApproveJournal?: (journalId: string, feedback: string) => void;
  onRejectJournal?: (journalId: string, feedback: string) => void;
}

export const JournalsView: React.FC<JournalsViewProps> = ({
  journals,
  currentRole,
  searchQuery = '',
  onOpenAddJournalModal,
  onApproveJournal,
  onRejectJournal,
}) => {
  const [selectedJournal, setSelectedJournal] = useState<DailyJournalEntry | null>(null);
  const [mentorComment, setMentorComment] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'approved' | 'pending' | 'rejected'>('ALL');
  const [toastNotice, setToastNotice] = useState<{ type: 'success' | 'warning'; message: string } | null>(null);

  const filteredJournals = journals.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.activityDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Automatically select the first pending or first available journal
  useEffect(() => {
    if (!selectedJournal && filteredJournals.length > 0) {
      const pendingOne = filteredJournals.find((j) => j.status === 'pending') || filteredJournals[0];
      setSelectedJournal(pendingOne);
      setMentorComment(pendingOne.industryFeedback || '');
    } else if (selectedJournal) {
      // Keep selected journal in sync if journals array updates
      const updated = journals.find((j) => j.id === selectedJournal.id);
      if (updated && (updated.status !== selectedJournal.status || updated.industryFeedback !== selectedJournal.industryFeedback)) {
        setSelectedJournal(updated);
      }
    }
  }, [filteredJournals, journals, selectedJournal]);

  const isStudent = currentRole === 'student';
  const isMentor = currentRole === 'industry_mentor' || currentRole === 'teacher_mentor' || currentRole === 'mentor';
  const isReadOnly = currentRole === 'viewer_dinas';
  const canValidate = !isReadOnly && (isMentor || currentRole === 'school_admin' || currentRole === 'super_admin');

  // Approve Handler
  const handleApprove = () => {
    if (!selectedJournal) return;
    const feedbackText = mentorComment.trim() || 'Jurnal aktivitas harian disetujui & capaian kompetensi diverifikasi oleh pembimbing.';
    
    // Update local state immediately
    setSelectedJournal({
      ...selectedJournal,
      status: 'approved',
      industryFeedback: feedbackText,
    });

    setToastNotice({
      type: 'success',
      message: `Jurnal "${selectedJournal.title}" berhasil disetujui dan divalidasi!`,
    });
    setTimeout(() => setToastNotice(null), 3500);

    if (onApproveJournal) {
      onApproveJournal(selectedJournal.id, feedbackText);
    }
  };

  // Reject / Revision Handler
  const handleReject = () => {
    if (!selectedJournal) return;
    const feedbackText = mentorComment.trim() || 'Mohon perbaiki uraian aktivitas teknis dan lampirkan bukti hasil kerja (foto/repo).';

    // Update local state immediately
    setSelectedJournal({
      ...selectedJournal,
      status: 'rejected',
      industryFeedback: feedbackText,
    });

    setToastNotice({
      type: 'warning',
      message: `Permintaan revisi jurnal "${selectedJournal.title}" berhasil dikirimkan ke siswa.`,
    });
    setTimeout(() => setToastNotice(null), 3500);

    if (onRejectJournal) {
      onRejectJournal(selectedJournal.id, feedbackText);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Toast Notification */}
      {toastNotice && (
        <div
          className={`fixed top-6 right-6 z-[120] animate-bounce-short text-white px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-md ${
            toastNotice.type === 'success'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400/40'
              : 'bg-gradient-to-r from-amber-600 to-rose-600 border-amber-400/40'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {toastNotice.type === 'success' ? 'verified' : 'edit_notifications'}
          </span>
          <span className="text-[13px] font-bold tracking-wide">{toastNotice.message}</span>
          <button
            onClick={() => setToastNotice(null)}
            className="ml-2 p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-[#0c1024]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">menu_book</span>
              <span>Modul 8.7 • Logbook & Jurnal Kegiatan Harian</span>
            </div>
            <h2 className="text-[24px] md:text-[28px] font-black text-white tracking-tight">
              Jurnal Aktivitas & Bukti Kinerja Harian
            </h2>
            <p className="text-[13px] text-white/60 mt-1 max-w-2xl leading-relaxed">
              Pencatatan jam kerja, rincian tugas terhubung standar kompetensi SKKNI, lampiran bukti (evidence foto/file/repo), serta verifikasi berkala pembimbing industri dan sekolah.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isStudent && onOpenAddJournalModal && (
              <button
                onClick={onOpenAddJournalModal}
                className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-[13px] shadow-lg shadow-violet-900/40 transition-all cursor-pointer flex items-center gap-2 active:scale-98"
              >
                <span className="material-symbols-outlined text-[20px]">post_add</span>
                <span>Tulis Jurnal Hari Ini</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto hide-scrollbar">
          {(['ALL', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                  : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {st === 'ALL' ? 'Semua Jurnal' : st === 'pending' ? 'Menunggu Approval' : st === 'approved' ? 'Disetujui' : 'Revisi'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journals Timeline / Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {filteredJournals.map((jrn) => (
            <div
              key={jrn.id}
              onClick={() => {
                setSelectedJournal(jrn);
                setMentorComment(jrn.industryFeedback || '');
              }}
              className={`glass-card rounded-2xl p-5 border transition-all cursor-pointer ${
                selectedJournal?.id === jrn.id
                  ? 'border-violet-500/80 bg-violet-500/10 shadow-xl shadow-violet-950/50 ring-1 ring-violet-500/40'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-300 font-mono font-bold text-[12px]">
                    {jrn.date}
                  </span>
                  <span className="text-white/40 text-[12px]">
                    {jrn.startTime} - {jrn.endTime} ({jrn.totalHours} Jam)
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border self-start sm:self-center ${
                    jrn.status === 'approved'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : jrn.status === 'pending'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {jrn.status === 'approved' ? '✓ Disetujui Mentor' : jrn.status === 'pending' ? '⏳ Menunggu Review' : '⚠️ Perlu Revisi'}
                </span>
              </div>

              <h4 className="font-bold text-white text-[15px] mt-2.5">{jrn.title}</h4>
              <p className="text-[13px] text-white/70 mt-1 line-clamp-2">{jrn.activityDescription}</p>

              {/* Related Competencies Chips */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {jrn.relatedCompetencies.map((comp, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-white/60 text-[11px] font-medium"
                  >
                    🎯 {comp}
                  </span>
                ))}
              </div>

              {/* Attachments / Evidence preview */}
              {jrn.evidenceAttachments && jrn.evidenceAttachments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-violet-300">
                  <span className="material-symbols-outlined text-[16px]">attachment</span>
                  <span>{jrn.evidenceAttachments.length} Bukti Evidence Terlampir (Foto / Repo)</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Journal Review & Evidence Panel (1 col) */}
        <div className="lg:col-span-1">
          {selectedJournal ? (
            <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4 sticky top-24">
              {/* 1: Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-white text-[15px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-violet-400">fact_check</span>
                  Detail Evaluasi Jurnal
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    selectedJournal.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : selectedJournal.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {selectedJournal.status === 'approved'
                    ? 'Disetujui'
                    : selectedJournal.status === 'pending'
                    ? 'Menunggu'
                    : 'Revisi'}
                </span>
              </div>

              {/* 2: Siswa Pelapor */}
              <div>
                <span className="text-[11px] font-bold text-white/40 uppercase block mb-1">Siswa Pelapor:</span>
                <p className="text-[14px] font-bold text-white">{selectedJournal.studentName}</p>
                <p className="text-[12px] text-white/60">
                  {selectedJournal.date} ({selectedJournal.startTime} - {selectedJournal.endTime}) • {selectedJournal.totalHours} Jam
                </p>
              </div>

              {/* 3: Uraian Aktivitas */}
              <div>
                <span className="text-[11px] font-bold text-white/40 uppercase block mb-1">Uraian Aktivitas:</span>
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-[13px] text-white/80 leading-relaxed">
                  {selectedJournal.activityDescription}
                </div>
              </div>

              {/* 4: Evidence Link List */}
              {selectedJournal.evidenceAttachments && selectedJournal.evidenceAttachments.length > 0 ? (
                <div>
                  <span className="text-[11px] font-bold text-white/40 uppercase block mb-1.5">Bukti Kinerja (Evidence):</span>
                  <div className="space-y-2">
                    {selectedJournal.evidenceAttachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-between text-[12px] text-violet-300 hover:bg-violet-500/20 transition-all"
                      >
                        <span className="truncate font-semibold">{att.name}</span>
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-white/40 italic p-2 bg-white/[0.02] rounded-lg border border-white/5">
                  Tidak ada berkas bukti terlampir pada jurnal ini.
                </div>
              )}

              {/* 5: Mentor Feedback & Actions */}
              {canValidate && (
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-white/70 block">
                      Catatan & Masukan Pembimbing:
                    </label>
                    {selectedJournal.industryFeedback && (
                      <span className="text-[10px] text-violet-300 font-medium">Tersimpan</span>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={mentorComment}
                    onChange={(e) => setMentorComment(e.target.value)}
                    placeholder="Berikan catatan evaluasi teknis, koreksi tugas, atau apresiasi..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[12px] text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 placeholder:text-white/30 resize-none transition-all"
                  />

                  {/* Action Buttons: Setujui Jurnal & Minta Revisi */}
                  <div className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-400 text-white font-bold rounded-xl text-[13px] shadow-lg shadow-emerald-950/60 hover:shadow-emerald-500/25 ring-1 ring-emerald-400/40 hover:ring-emerald-300 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] group"
                    >
                      <span className="material-symbols-outlined text-[19px] transition-transform duration-200 group-hover:scale-110">
                        check_circle
                      </span>
                      <span>Setujui Jurnal</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReject}
                      className="py-3 px-5 bg-gradient-to-r from-rose-950/40 via-rose-900/30 to-amber-950/40 hover:from-rose-600 hover:to-rose-700 text-rose-300 hover:text-white font-bold rounded-xl text-[13px] border border-rose-500/40 hover:border-rose-400 shadow-md shadow-rose-950/50 hover:shadow-rose-600/30 ring-1 ring-rose-500/30 hover:ring-rose-400 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] group"
                    >
                      <span className="material-symbols-outlined text-[19px] transition-transform duration-200 group-hover:scale-110">
                        edit_note
                      </span>
                      <span>Minta Revisi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 border border-white/10 text-center text-white/40">
              <span className="material-symbols-outlined text-[40px] text-white/20 mb-2">menu_book</span>
              <p className="text-[13px]">Klik salah satu jurnal untuk meninjau rincian tugas dan bukti evidence.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
