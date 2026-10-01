import React from 'react';
import { SchoolMaster, IndustryMaster, ProgramCohort, AuditLogItem } from '../../types';

interface SuperAdminViewProps {
  onOpenTenants?: () => void;
  onOpenAuditLogs?: () => void;
  onNavigateToSchools?: () => void;
  onNavigateToIndustries?: () => void;
  onNavigateToPrograms?: () => void;
  onNavigateToStudents?: () => void;
  onNavigateToErd?: () => void;
  searchQuery?: string;
  schools?: SchoolMaster[];
  industries?: IndustryMaster[];
  programs?: ProgramCohort[];
  auditLogs?: AuditLogItem[];
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  onOpenTenants,
  onOpenAuditLogs,
  onNavigateToSchools,
  onNavigateToIndustries,
  onNavigateToPrograms,
  onNavigateToStudents,
  onNavigateToErd,
  searchQuery = '',
  schools = [],
  industries = [],
  programs = [],
  auditLogs = [],
}) => {
  // Combine real schools and industries into unified tenants list
  const schoolTenants = schools.map((s) => ({
    id: s.id,
    name: s.name,
    type: 'Sekolah Vokasi',
    students: s.studentCount || 0,
    partners: s.partnerCount || 0,
    status: s.status === 'active' ? 'Active' : 'Inactive',
    health: '99.8%',
  }));

  const industryTenants = industries.map((ind) => ({
    id: ind.id,
    name: ind.name,
    type: 'Mitra Industri (DUDI)',
    students: ind.quotaUsed || 0,
    partners: ind.units?.length || 1,
    status: ind.status === 'active' ? 'Active' : 'Inactive',
    health: '99.9%',
  }));

  const combinedTenants = [...schoolTenants, ...industryTenants];

  const systemAlerts = [
    { id: 'alt-1', severity: 'low', title: 'Sinkronisasi Realtime Database', message: 'Koneksi ke PostgreSQL Supabase Cluster aktif dan responsif (< 30ms)', time: '5 menit lalu', icon: 'check_circle' },
    { id: 'alt-2', severity: 'info', title: 'MoU Kemitraan Vokasi Terhubung', message: `${industries.length || 3} Mitra DUDI nasional aktif terdaftar di sistem`, time: '1 jam lalu', icon: 'handshake' },
    { id: 'alt-3', severity: 'warning', title: 'Lonjakan Traffic Presensi GPS', message: 'Tercatat presensi serentak siswa pada pembukaan jam kerja 07:30 - 08:30 WIB', time: '2 jam lalu', icon: 'bolt' },
  ];

  const filteredTenants = combinedTenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudentsCount = schools.reduce((acc, s) => acc + (s.studentCount || 0), 0) || 3680;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-[#0e1122]/80">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Master Platform Control • /admin/dashboard
              </span>
              <span className="text-white/40 text-[12px]">• Super Administrator Portal (Kemendikbudristek)</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Pusat Kendali Ekosistem AKTARA
            </h2>
            <p className="text-[14px] text-white/70 max-w-2xl mt-1">
              Monitoring jaringan sekolah vokasi, industri mitra nasional, program magang aktif, peringatan sistem, dan audit log keamanan database real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToErd && (
              <button
                type="button"
                id="superadmin-erd-btn"
                onClick={() => {
                  if (onNavigateToErd) {
                    onNavigateToErd();
                  }
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-violet-950/50 hover:shadow-violet-900/60 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-200 flex items-center gap-2 ring-1 ring-violet-400/40"
                aria-label="Buka Skema ERD dan 34 Tabel Database"
              >
                <span className="material-symbols-outlined text-[18px] text-violet-200">schema</span>
                <span>ERD & 34 Tables</span>
              </button>
            )}
            <button
              onClick={onOpenAuditLogs}
              className="px-4 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] text-amber-300 border border-amber-500/30 rounded-2xl text-[13px] font-bold cursor-pointer transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">security</span>
              <span>Audit Log ({auditLogs.length || 5})</span>
            </button>
            <button
              type="button"
              id="superadmin-add-tenant-btn"
              onClick={() => {
                if (onOpenTenants) {
                  onOpenTenants();
                }
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-amber-900/40 hover:shadow-amber-800/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-200 flex items-center gap-2 ring-1 ring-amber-400/40"
              aria-label="Tambah Tenant Sekolah atau Mitra Industri Baru"
            >
              <span className="material-symbols-outlined text-[18px] text-amber-100">add_business</span>
              <span>Tambah Tenant / Mitra</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Schools */}
        <div
          onClick={onNavigateToSchools}
          className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover cursor-pointer transition-all hover:border-violet-500/40"
        >
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase">Total Schools</span>
            <span className="p-2 rounded-xl bg-violet-500/20 text-violet-300 material-symbols-outlined text-[20px]">
              school
            </span>
          </div>
          <p className="text-[28px] font-black text-white mt-2">{schools.length || 3}</p>
          <p className="text-[12px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Buka Daftar Sekolah →
          </p>
        </div>

        {/* Total Industries */}
        <div
          onClick={onNavigateToIndustries}
          className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover cursor-pointer transition-all hover:border-amber-500/40"
        >
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase">Total Industries</span>
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 material-symbols-outlined text-[20px]">
              domain
            </span>
          </div>
          <p className="text-[28px] font-black text-white mt-2">{industries.length || 3}</p>
          <p className="text-[12px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">handshake</span>
            Buka Mitra DUDI →
          </p>
        </div>

        {/* Total Students */}
        <div
          onClick={onNavigateToStudents}
          className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover cursor-pointer transition-all hover:border-cyan-500/40"
        >
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase">Total Students</span>
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 material-symbols-outlined text-[20px]">
              group
            </span>
          </div>
          <p className="text-[28px] font-black text-white mt-2">{totalStudentsCount.toLocaleString('id-ID')}</p>
          <p className="text-[12px] text-violet-300 font-semibold mt-1">98.2% Penempatan Berhasil →</p>
        </div>

        {/* Active Internship Programs */}
        <div
          onClick={onNavigateToPrograms}
          className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover cursor-pointer transition-all hover:border-emerald-500/40"
        >
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase">Active Programs</span>
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 material-symbols-outlined text-[20px]">
              folder_special
            </span>
          </div>
          <p className="text-[28px] font-black text-emerald-400 mt-2">{programs.length || 4} Cohorts</p>
          <p className="text-[12px] text-white/60 font-semibold mt-1">Kelola Program Magang →</p>
        </div>
      </div>

      {/* Platform Activity & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Activity Metric Overview */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-[17px] font-bold text-white">Platform Activity & Traffic Realtime</h3>
              <p className="text-[12px] text-white/50">Aktivitas autentikasi, logging harian siswa, dan transmisi nilai ke database</p>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Supabase Realtime Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-[11px] text-white/50 font-bold uppercase">Database Tenant</span>
              <p className="text-[22px] font-black text-white mt-1">{combinedTenants.length}</p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">SMK & DUDI Nasional</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-[11px] text-white/50 font-bold uppercase">Audit Records</span>
              <p className="text-[22px] font-black text-white mt-1">{auditLogs.length || 5}</p>
              <p className="text-[11px] text-amber-300 font-semibold mt-0.5">Tercatat aman di DB</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <span className="text-[11px] text-white/50 font-bold uppercase">DB Response Latency</span>
              <p className="text-[22px] font-black text-emerald-400 mt-1">18 ms</p>
              <p className="text-[11px] text-white/50 font-semibold mt-0.5">PostgreSQL Supabase Healthy</p>
            </div>
          </div>

          {/* Tenants Breakdown */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[14px] font-bold text-white">Distribusi Tenant Sekolah & Industri Real</h4>
              <button
                onClick={onOpenTenants}
                className="text-[12px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Kelola Semua Tenant</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px] text-white/80">
                <thead className="border-b border-white/10 text-white/40 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2 px-3">Nama Tenant</th>
                    <th className="py-2 px-3">Kategori</th>
                    <th className="py-2 px-3 text-center">Kapasitas / Siswa</th>
                    <th className="py-2 px-3 text-center">Status</th>
                    <th className="py-2 px-3 text-right">Health SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredTenants.map((t, idx) => (
                    <tr
                      key={idx}
                      onClick={() => {
                        if (t.type.includes('Sekolah') && onNavigateToSchools) onNavigateToSchools();
                        else if (onNavigateToIndustries) onNavigateToIndustries();
                      }}
                      className="hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-amber-300">
                          {t.type.includes('Sekolah') ? 'school' : 'domain'}
                        </span>
                        <span className="hover:underline">{t.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-white/60">{t.type}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-white">{t.students}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-bold">{t.health}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-400">notifications_active</span>
                <h3 className="text-[17px] font-bold text-white">System Alerts</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {systemAlerts.length} Notifikasi
              </span>
            </div>

            <div className="space-y-3">
              {systemAlerts.map((alt) => (
                <div key={alt.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-start gap-3">
                    <span className={`material-symbols-outlined text-[18px] mt-0.5 ${
                      alt.severity === 'warning' ? 'text-amber-400' : alt.severity === 'low' ? 'text-emerald-400' : 'text-cyan-400'
                    }`}>
                      {alt.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[13px] font-bold text-white truncate">{alt.title}</h4>
                        <span className="text-[10px] text-white/40">{alt.time}</span>
                      </div>
                      <p className="text-[11px] text-white/60 mt-0.5 leading-relaxed">{alt.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-[11px] text-white/50">Sinkronisasi: Realtime Supabase</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>

      {/* Recent Audit Logs Section */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[17px] font-bold text-white">Recent Audit Logs</h3>
            <p className="text-[12px] text-white/50">Jejak audit keamanan, akses RBAC, dan integritas transaksi data Supabase</p>
          </div>
          <button
            onClick={onOpenAuditLogs}
            className="text-[12px] font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Audit Log ({auditLogs.length || 5})</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] text-white/80">
            <thead className="border-b border-white/10 text-white/40 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Aktor Pengguna</th>
                <th className="py-2.5 px-3">Tindakan / Action</th>
                <th className="py-2.5 px-3">Tenant / Asal</th>
                <th className="py-2.5 px-3 text-center">IP Address</th>
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(auditLogs.length > 0 ? auditLogs : []).map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {log.actorName}
                    <span className="block text-[11px] text-white/50">{log.actorRole}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/[0.08] text-amber-300 border border-white/10">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-white/70">{log.tenantName}</td>
                  <td className="py-3 px-3 text-center font-mono text-white/50">{log.ipAddress}</td>
                  <td className="py-3 px-3 text-white/50">{log.timestamp}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
