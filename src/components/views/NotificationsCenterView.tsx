import React, { useState } from 'react';
import { NotificationItem, NavTab } from '../../types';

interface NotificationsCenterViewProps {
  notifications: NotificationItem[];
  onMarkAllAsRead?: () => void;
  onNavigateTab?: (tab: NavTab) => void;
  onClearNotifications?: () => void;
}

export const NotificationsCenterView: React.FC<NotificationsCenterViewProps> = ({
  notifications: initialNotifications,
  onMarkAllAsRead,
  onNavigateTab,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filterType, setFilterType] = useState<'ALL' | 'UNREAD' | 'JOURNAL' | 'ATTENDANCE' | 'SYSTEM'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (onMarkAllAsRead) onMarkAllAsRead();
    showToast('Semua notifikasi berhasil ditandai telah dibaca.');
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDeleteItem = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast('Notifikasi berhasil dihapus.');
  };

  const handleActionClick = (notif: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (!onNavigateTab) return;

    const titleLower = notif.title.toLowerCase();
    const msgLower = notif.message.toLowerCase();

    if (titleLower.includes('jurnal') || msgLower.includes('jurnal') || msgLower.includes('logbook')) {
      onNavigateTab('journals');
    } else if (titleLower.includes('presensi') || msgLower.includes('presensi') || msgLower.includes('absen')) {
      onNavigateTab('attendance');
    } else if (titleLower.includes('nilai') || msgLower.includes('asesmen') || msgLower.includes('rubrik')) {
      onNavigateTab('assessments');
    } else if (titleLower.includes('sertifikat') || msgLower.includes('sertifikat')) {
      onNavigateTab('certificate');
    } else if (titleLower.includes('supervisi') || msgLower.includes('supervisi')) {
      onNavigateTab('supervision');
    } else {
      onNavigateTab('dashboard');
    }
  };

  const filtered = notifications.filter((n) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q || n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);

    if (filterType === 'UNREAD') return matchSearch && !n.read;
    if (filterType === 'JOURNAL')
      return matchSearch && (n.title.toLowerCase().includes('jurnal') || n.message.toLowerCase().includes('jurnal'));
    if (filterType === 'ATTENDANCE')
      return matchSearch && (n.title.toLowerCase().includes('presensi') || n.message.toLowerCase().includes('presensi'));
    if (filterType === 'SYSTEM')
      return matchSearch && !n.title.toLowerCase().includes('jurnal') && !n.title.toLowerCase().includes('presensi');

    return matchSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

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

      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-indigo-950/30 to-[#0c1024]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">notifications_active</span>
              <span>Modul 8.13 • Pusat Notifikasi & Agenda Interaktif</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Pusat Pemberitahuan & Aktivitas Terpadu
            </h2>
            <p className="text-[14px] text-white/70 mt-1 max-w-2xl leading-relaxed">
              Pemberitahuan resmi terkait validasi jurnal harian, log presensi GPS, tenggat waktu supervisi industri, penilaian akhir kompetensi, serta penerbitan sertifikat digital.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-4 py-2.5 bg-white/[0.08] hover:bg-white/[0.15] text-amber-300 border border-amber-500/30 rounded-2xl text-[12px] font-bold cursor-pointer transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">done_all</span>
              <span>Tandai Semua Terbaca</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar & Metrics */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari notifikasi..."
            className="w-full pl-10 pr-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/40 text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'Semua', count: notifications.length },
            { id: 'UNREAD', label: 'Belum Dibaca', count: unreadCount },
            { id: 'JOURNAL', label: 'Jurnal & Tugas' },
            { id: 'ATTENDANCE', label: 'Presensi & GPS' },
            { id: 'SYSTEM', label: 'Sistem & Sertifikat' },
          ].map((flt) => (
            <button
              key={flt.id}
              type="button"
              onClick={() => setFilterType(flt.id as any)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterType === flt.id
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-sm'
                  : 'bg-white/[0.04] text-white/60 hover:text-white'
              }`}
            >
              <span>{flt.label}</span>
              {flt.count !== undefined && flt.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-black font-black">
                  {flt.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
          <span className="material-symbols-outlined text-[44px] text-white/20 mb-2">notifications_off</span>
          <h3 className="text-[16px] font-bold text-white">Tidak ada pemberitahuan pada filter ini</h3>
          <p className="text-[12px] text-white/50 max-w-sm mx-auto mt-1">
            Seluruh tugas dan informasi penting telah ditinjau atau tidak ada item yang sesuai dengan pencarian.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => {
            const isUnread = !notif.read;
            const titleLower = notif.title.toLowerCase();
            const isWarning = titleLower.includes('revisi') || titleLower.includes('peringatan');
            const isSuccess = titleLower.includes('setujui') || titleLower.includes('terbit') || titleLower.includes('berhasil');

            return (
              <div
                key={notif.id}
                className={`glass-card rounded-2xl p-4 md:p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  isUnread
                    ? 'border-amber-500/40 bg-amber-500/10 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/20'
                    : 'border-white/10 bg-white/[0.02] opacity-85 hover:opacity-100 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isWarning
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : isSuccess
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isWarning
                        ? 'warning'
                        : isSuccess
                        ? 'verified'
                        : 'notifications'}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                        {notif.title}
                      </h4>
                      {isUnread && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400 text-black uppercase">
                          Baru
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-white/70 mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-white/40 font-mono mt-1.5 block">
                      {notif.time || 'Hari ini'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleActionClick(notif)}
                    className="px-3.5 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/30 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Buka Halaman</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleRead(notif.id)}
                    className="p-1.5 bg-white/[0.05] hover:bg-white/[0.12] rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer"
                    title={isUnread ? 'Tandai sudah dibaca' : 'Tandai belum dibaca'}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isUnread ? 'check' : 'mark_email_unread'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(notif.id)}
                    className="p-1.5 bg-white/[0.05] hover:bg-rose-500/20 text-white/40 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="Hapus notifikasi"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
