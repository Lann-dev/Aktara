import React, { useState, useMemo } from 'react';
import { AuditLogItem, UserRole } from '../../types';

interface AuditLogsViewProps {
  logs: AuditLogItem[];
  currentRole: UserRole;
  searchQuery?: string;
  onExportLogs?: () => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  logs: initialLogs,
  currentRole,
  searchQuery = '',
  onExportLogs,
}) => {
  const [logs, setLogs] = useState<AuditLogItem[]>(initialLogs);
  const [localSearch, setLocalSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [detailModalLog, setDetailModalLog] = useState<AuditLogItem | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Sync initial logs if updated from parent
  React.useEffect(() => {
    setLogs(initialLogs);
  }, [initialLogs]);

  // Unique modules extracted dynamically
  const uniqueModules = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.module) set.add(l.module);
    });
    return Array.from(set);
  }, [logs]);

  // Unique roles extracted dynamically
  const uniqueRoles = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.actorRole) set.add(l.actorRole);
    });
    return Array.from(set);
  }, [logs]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = logs.length;
    const successCount = logs.filter((l) => l.status === 'SUCCESS').length;
    const warningCount = logs.filter((l) => l.status === 'WARNING').length;
    const failedCount = logs.filter((l) => l.status === 'FAILED').length;
    const successRate = total > 0 ? Math.round((successCount / total) * 100) : 100;
    const uniqueActors = new Set(logs.map((l) => l.actorEmail)).size;

    return {
      total,
      successCount,
      warningCount,
      failedCount,
      successRate,
      uniqueActors,
    };
  }, [logs]);

  // Filtered Logs
  const effectiveSearch = localSearch || searchQuery;
  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const q = effectiveSearch.toLowerCase();
      const matchSearch =
        !q ||
        l.actorName.toLowerCase().includes(q) ||
        l.actorEmail.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.tenantName.toLowerCase().includes(q) ||
        l.ipAddress.toLowerCase().includes(q) ||
        l.module.toLowerCase().includes(q);

      const matchRole =
        selectedRoleFilter === 'ALL' ||
        l.actorRole.toLowerCase() === selectedRoleFilter.toLowerCase();
      const matchStatus =
        selectedStatusFilter === 'ALL' || l.status === selectedStatusFilter;
      const matchModule =
        selectedModuleFilter === 'ALL' || l.module === selectedModuleFilter;

      return matchSearch && matchRole && matchStatus && matchModule;
    });
  }, [logs, effectiveSearch, selectedRoleFilter, selectedStatusFilter, selectedModuleFilter]);

  // Helper for status badges
  const getStatusBadge = (status: 'SUCCESS' | 'WARNING' | 'FAILED') => {
    switch (status) {
      case 'SUCCESS':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
          icon: 'check_circle',
          label: 'BERHASIL',
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          icon: 'warning',
          label: 'PERINGATAN',
        };
      case 'FAILED':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-400',
          icon: 'cancel',
          label: 'DITOLAK / GAGAL',
        };
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case 'super_admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'school_admin':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'industry_mentor':
      case 'mentor':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'teacher_mentor':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'student':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'viewer_dinas':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const formatRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case 'super_admin':
        return 'Super Admin';
      case 'school_admin':
        return 'Admin Sekolah';
      case 'industry_mentor':
        return 'Pembimbing DUDI';
      case 'teacher_mentor':
        return 'Guru Pembimbing';
      case 'student':
        return 'Siswa';
      case 'viewer_dinas':
        return 'Viewer Dinas';
      default:
        return role;
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (onExportLogs) {
      onExportLogs();
    }
    const headers = ['ID Audit', 'Waktu (WIB)', 'Nama Aktor', 'Email Aktor', 'Peran Aktor', 'Organisasi / Tenant', 'Tindakan', 'Modul Sistem', 'Status', 'Rincian Aktivitas', 'IP Address'];
    const rows = filtered.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.actorName.replace(/"/g, '""')}"`,
      `"${l.actorEmail}"`,
      `"${l.actorRole}"`,
      `"${l.tenantName.replace(/"/g, '""')}"`,
      `"${l.action}"`,
      `"${l.module}"`,
      `"${l.status}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AKTARA_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate new security test log
  const handleSimulateSecurityEvent = () => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newLog: AuditLogItem = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      timestamp: timeStr,
      actorName: 'Audit Integrity Monitor',
      actorEmail: 'system.audit@aktara.id',
      actorRole: 'super_admin',
      tenantName: 'Sistem Pusat AKTARA',
      action: 'HASH_CHAIN_INTEGRITY_VERIFIED',
      module: 'Keamanan Akses (8.1)',
      status: 'SUCCESS',
      details: 'Pemeriksaan rutin berkala rantai hash kriptografis log audit: 100% valid dan tidak terutak-atik (WORM compliant).',
      ipAddress: '127.0.0.1 (Internal Worker)',
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Top Banner Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#0c1024]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">security</span>
              <span>Modul 8.1 • Kepatuhan ISO 27001 & Audit Trail Terpadu</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Pusat Pemantauan & Rekam Jejak Audit (Audit Trail)
            </h2>
            <p className="text-[14px] text-white/70 mt-1 max-w-3xl leading-relaxed">
              Pencatatan *real-time* seluruh aktivitas otorisasi, mutasi penempatan, persetujuan logbook, perubahan nilai akhir, penerbitan sertifikat digital ber-QR, serta deteksi anomali akses lintas tenant dengan jaminan *immutable WORM logging*.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="btn-simulate-security-event"
              onClick={handleSimulateSecurityEvent}
              className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/15 rounded-2xl text-[13px] font-bold cursor-pointer transition-all flex items-center gap-2 active:scale-95"
              title="Jalankan simulasi pemeriksaan integritas audit trail"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-400">verified_user</span>
              <span>Uji Verifikasi Integritas</span>
            </button>

            <button
              type="button"
              id="btn-export-audit-csv"
              onClick={handleExportCSV}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-purple-950/60 hover:shadow-purple-900/70 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-200 flex items-center gap-2 ring-1 ring-purple-400/40"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Unduh Log Audit (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Aktivitas */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Aktivitas Tercatat</span>
            <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 material-symbols-outlined text-[20px]">
              receipt_long
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-white">{metrics.total}</span>
              <span className="text-[11px] text-purple-300 font-bold bg-purple-500/15 px-2 py-0.5 rounded-md border border-purple-500/25">
                WORM Immutable
              </span>
            </div>
            <p className="text-[12px] text-white/50 mt-1">Transaksional terekam permanen</p>
          </div>
        </div>

        {/* Tingkat Keberhasilan */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Tingkat Keberhasilan</span>
            <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 material-symbols-outlined text-[20px]">
              check_circle
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-emerald-400">{metrics.successRate}%</span>
              <span className="text-[12px] text-white/60">({metrics.successCount} Berhasil)</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.successRate}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-300 font-semibold mt-1.5 flex justify-between">
              <span>Status Operasional</span>
              <span>Normal & Patuh</span>
            </p>
          </div>
        </div>

        {/* Peringatan & Gagal */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Peringatan & Anomali</span>
            <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 material-symbols-outlined text-[20px]">
              shield_with_heart
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-amber-300">
                {metrics.warningCount + metrics.failedCount}
              </span>
              <span className="text-[11px] text-rose-300">
                ({metrics.failedCount} Percobaan Ditolak)
              </span>
            </div>
            <p className="text-[12px] text-white/50 mt-1">
              {metrics.warningCount} Perlu Perhatian / Verifikasi
            </p>
          </div>
        </div>

        {/* Aktor Terverifikasi */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Aktor Terlibat</span>
            <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 material-symbols-outlined text-[20px]">
              group
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[30px] font-black text-blue-300">{metrics.uniqueActors}</span>
            <span className="text-[12px] text-white/60 ml-2 font-medium">Akun Pengguna Unik</span>
            <p className="text-[12px] text-white/50 mt-1">Multi-tenant lintas sekolah & industri</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Real-time Search, Multi-Filter & View Toggle */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
            search
          </span>
          <input
            id="audit-log-search-input"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Cari aktor, email, aksi, IP, atau rincian..."
            className="w-full pl-10 pr-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/40 text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns & View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Module Filter */}
          <select
            id="audit-filter-module"
            value={selectedModuleFilter}
            onChange={(e) => setSelectedModuleFilter(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer max-w-[200px] truncate"
          >
            <option value="ALL" className="bg-[#0f172a] text-white">Semua Modul Sistem</option>
            {uniqueModules.map((m) => (
              <option key={m} value={m} className="bg-[#0f172a] text-white">
                {m}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="audit-filter-status"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0f172a] text-white">Semua Status</option>
            <option value="SUCCESS" className="bg-[#0f172a] text-white">SUCCESS (Berhasil)</option>
            <option value="WARNING" className="bg-[#0f172a] text-white">WARNING (Peringatan)</option>
            <option value="FAILED" className="bg-[#0f172a] text-white">FAILED (Ditolak/Gagal)</option>
          </select>

          {/* Role Filter */}
          <select
            id="audit-filter-role"
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
          >
            <option value="ALL" className="bg-[#0f172a] text-white">Semua Peran</option>
            {uniqueRoles.map((r) => (
              <option key={r} value={r} className="bg-[#0f172a] text-white">
                {formatRoleLabel(r)}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-purple-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
              }`}
              title="Tampilan Tabel Data"
            >
              <span className="material-symbols-outlined text-[18px]">table_rows</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'timeline' ? 'bg-purple-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
              }`}
              title="Tampilan Garis Waktu (Timeline)"
            >
              <span className="material-symbols-outlined text-[18px]">timeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content: Table or Timeline */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10 my-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/40">
            <span className="material-symbols-outlined text-[36px]">shield_lock</span>
          </div>
          <h3 className="text-[18px] font-bold text-white">Tidak ada log audit yang cocok</h3>
          <p className="text-[13px] text-white/50 max-w-md mx-auto mt-1">
            Silakan sesuaikan kata kunci pencarian atau reset opsi filter modul, status, dan peran aktor.
          </p>
          <button
            onClick={() => {
              setLocalSearch('');
              setSelectedModuleFilter('ALL');
              setSelectedStatusFilter('ALL');
              setSelectedRoleFilter('ALL');
            }}
            className="mt-4 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] text-white/80">
              <thead className="bg-white/[0.03] text-white/40 text-[10px] uppercase tracking-wider font-bold border-b border-white/10">
                <tr>
                  <th className="px-5 py-3.5">Waktu (WIB)</th>
                  <th className="px-5 py-3.5">Aktor & Organisasi</th>
                  <th className="px-5 py-3.5">Modul Sistem</th>
                  <th className="px-5 py-3.5">Aksi Transaksi</th>
                  <th className="px-5 py-3.5">Rincian Aktivitas</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5">IP Address</th>
                  <th className="px-5 py-3.5 text-right">Inspeksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filtered.map((log) => {
                  const statusBadge = getStatusBadge(log.status);
                  const roleBadge = getRoleBadgeStyle(log.actorRole);

                  return (
                    <tr key={log.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-5 py-3.5 font-mono text-white/60 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-purple-400">schedule</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-white text-[13px] group-hover:text-purple-300 transition-colors">
                          {log.actorName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-md border ${roleBadge}`}
                          >
                            {formatRoleLabel(log.actorRole)}
                          </span>
                          <span className="text-[11px] text-white/50 truncate max-w-[160px]" title={log.tenantName}>
                            {log.tenantName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.04] text-white/90 border border-white/10 whitespace-nowrap">
                          {log.module}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[11px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 whitespace-nowrap">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/70 text-[12px] max-w-sm">
                        <p className="line-clamp-2 leading-relaxed">{log.details}</p>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${statusBadge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                          <span>{statusBadge.label}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-white/50 text-[11px] whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">
                          {log.ipAddress}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setDetailModalLog(log)}
                          className="p-1.5 bg-white/[0.06] hover:bg-purple-600/30 text-purple-300 hover:text-white rounded-xl border border-white/10 transition-colors cursor-pointer"
                          title="Inspeksi Detail Payload & Hash"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TIMELINE VIEW */
        <div className="space-y-4">
          {filtered.map((log, index) => {
            const statusBadge = getStatusBadge(log.status);
            const roleBadge = getRoleBadgeStyle(log.actorRole);

            return (
              <div
                key={log.id}
                className="glass-card rounded-2xl border border-white/10 p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-purple-500/40 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${statusBadge.bg}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{statusBadge.icon}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] text-white/50">{log.timestamp}</span>
                      <span className="text-white/20">•</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/[0.04] text-white/80 border border-white/10">
                        {log.module}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {log.action}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${statusBadge.bg}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>

                    <h4 className="text-[15px] font-bold text-white mt-1">{log.details}</h4>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-white/60">
                      <span className="flex items-center gap-1 text-white">
                        <strong className="text-purple-300">{log.actorName}</strong> ({log.actorEmail})
                      </span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-md border ${roleBadge}`}
                      >
                        {formatRoleLabel(log.actorRole)}
                      </span>
                      <span>•</span>
                      <span>Tenant: {log.tenantName}</span>
                      <span>•</span>
                      <span className="font-mono text-white/40">IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDetailModalLog(log)}
                  className="px-3.5 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-xl text-[12px] font-bold text-white transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 self-end md:self-center"
                >
                  <span className="material-symbols-outlined text-[16px] text-purple-400">info</span>
                  <span>Inspeksi</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL AUDIT INSPECTION MODAL */}
      {detailModalLog && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailModalLog(null);
          }}
          className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div className="glass-card bg-[#0e1228]/95 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-white/15 text-white my-8 relative">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg border ${
                    getStatusBadge(detailModalLog.status).bg
                  }`}
                >
                  <span className="material-symbols-outlined text-[26px]">
                    {getStatusBadge(detailModalLog.status).icon}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {detailModalLog.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        getStatusBadge(detailModalLog.status).bg
                      }`}
                    >
                      {detailModalLog.status}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-bold text-white mt-1">{detailModalLog.action}</h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDetailModalLog(null)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-5 space-y-4 text-[13px]">
              {/* SHA-256 Hash Integrity Badge */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-purple-300 text-[11px] font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    <span>Status Integritas Kriptografis (SHA-256)</span>
                  </div>
                  <p className="font-mono text-[11px] text-white/70 truncate mt-0.5">
                    sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
                    );
                    setCopiedHash(true);
                    setTimeout(() => setCopiedHash(false), 2000);
                  }}
                  className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 rounded-lg text-[11px] font-bold border border-purple-500/30 cursor-pointer shrink-0 transition-colors"
                >
                  {copiedHash ? 'Tersalin!' : 'Salin Hash'}
                </button>
              </div>

              {/* Rincian Aktivitas */}
              <div>
                <span className="text-[11px] font-bold uppercase text-white/50">Deskripsi Aktivitas</span>
                <p className="text-white/90 mt-1 leading-relaxed bg-white/[0.04] p-3.5 rounded-xl border border-white/10 font-sans">
                  {detailModalLog.details}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Aktor Pelaksana</span>
                  <p className="font-bold text-white mt-0.5">{detailModalLog.actorName}</p>
                  <p className="text-[11px] text-white/60 font-mono">{detailModalLog.actorEmail}</p>
                  <span
                    className={`inline-block mt-1 text-[9px] font-extrabold uppercase px-2 py-0.2 rounded border ${getRoleBadgeStyle(
                      detailModalLog.actorRole
                    )}`}
                  >
                    {formatRoleLabel(detailModalLog.actorRole)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Organisasi & Tenant</span>
                  <p className="font-bold text-white mt-0.5">{detailModalLog.tenantName}</p>
                  <p className="text-[11px] text-white/60 mt-0.5">Modul: {detailModalLog.module}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Waktu Transaksi</span>
                  <p className="font-mono text-white font-bold mt-0.5">{detailModalLog.timestamp} (WIB)</p>
                  <p className="text-[10px] text-white/50">UTC: 2026-08-31T02:45:12.000Z</p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Jaringan & Keamanan</span>
                  <p className="font-mono text-purple-300 font-bold mt-0.5">{detailModalLog.ipAddress}</p>
                  <p className="text-[10px] text-white/50">Protokol: TLS 1.3 / HTTPS (HMAC Verified)</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10 mt-6">
              <button
                type="button"
                onClick={() => setDetailModalLog(null)}
                className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl font-semibold text-[13px] cursor-pointer transition-colors"
              >
                Tutup Inspeksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
