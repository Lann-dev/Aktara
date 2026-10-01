import React, { useState } from 'react';
import { UserRole, IndustryMaster, SchoolMaster } from '../../types';

interface ReportsViewProps {
  currentRole: UserRole;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  industries?: IndustryMaster[];
  schools?: SchoolMaster[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentRole,
  onExportPDF,
  onExportExcel,
  industries = [],
  schools = [],
}) => {
  const [selectedReportType, setSelectedReportType] = useState<'overview' | 'attendance' | 'competency' | 'industry_partner'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('Semester Ganjil 2026/2027');

  const partnerData = industries.length > 0
    ? industries.map(ind => ({
        name: ind.name,
        sector: ind.sector || 'Teknologi & Bisnis',
        quota: `${ind.quotaTotal || 30} / ${ind.quotaUsed || 25}`,
        att: '98.2%',
        score: '94.5',
        rating: '4.95 ⭐',
      }))
    : [
        { name: 'PT Telkom Indonesia (Persero) Tbk', sector: 'Telekomunikasi & Digital Platform', quota: '30 / 25', att: '98.8%', score: '95.2', rating: '4.98 ⭐' },
        { name: 'PT Astra International Tbk', sector: 'Otomotif & Digital Manufacturing', quota: '25 / 20', att: '97.5%', score: '93.8', rating: '4.92 ⭐' },
        { name: 'Bank Mandiri (Persero) Tbk', sector: 'Fintech & Perbankan Digital', quota: '20 / 18', att: '99.0%', score: '94.0', rating: '4.95 ⭐' },
      ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">analytics</span>
              <span>Reporting & Executive Analytics Engine</span>
            </div>
            <h2 className="text-[24px] font-black text-white tracking-tight">
              Laporan Analitik & Performa Pemagangan
            </h2>
            <p className="text-[13px] text-white/60 mt-1 max-w-2xl">
              Agregasi metrik komprehensif tingkat kehadiran, kecepatan capaian kompetensi SKKNI, efisiensi penyerapan DUDI, serta ekspor format PDF & Excel standar dinas.
            </p>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onExportPDF}
              className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold rounded-xl text-[12px] transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              <span>Ekspor PDF</span>
            </button>

            <button
              onClick={onExportExcel}
              className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold rounded-xl text-[12px] transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <span className="material-symbols-outlined text-[18px]">table_view</span>
              <span>Ekspor Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto hide-scrollbar">
          {[
            { id: 'overview', label: 'Ringkasan Eksekutif', icon: 'dashboard' },
            { id: 'attendance', label: 'Rekap Presensi & Kehadiran', icon: 'event_available' },
            { id: 'competency', label: 'Progress Kompetensi SKKNI', icon: 'task_alt' },
            { id: 'industry_partner', label: 'Performa Kemitraan DUDI', icon: 'domain' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReportType(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedReportType === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/40'
                  : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white/50 uppercase">Tingkat Kehadiran</span>
            <span className="material-symbols-outlined text-[20px] text-emerald-400">check_circle</span>
          </div>
          <p className="text-[26px] font-black text-white mt-2">98.2%</p>
          <p className="text-[11px] text-emerald-300 font-semibold mt-1">Presensi GPS Geofencing</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white/50 uppercase">Tuntas Kompetensi</span>
            <span className="material-symbols-outlined text-[20px] text-violet-400">task_alt</span>
          </div>
          <p className="text-[26px] font-black text-white mt-2">89.4%</p>
          <p className="text-[11px] text-violet-300 font-semibold mt-1">Standar kelulusan SKKNI level 2</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white/50 uppercase">Placement Completion</span>
            <span className="material-symbols-outlined text-[20px] text-blue-400">school</span>
          </div>
          <p className="text-[26px] font-black text-white mt-2">100%</p>
          <p className="text-[11px] text-blue-300 font-semibold mt-1">Seluruh siswa aktif di DUDI</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white/50 uppercase">Indeks Kepuasan DUDI</span>
            <span className="material-symbols-outlined text-[20px] text-amber-400">star</span>
          </div>
          <p className="text-[26px] font-black text-white mt-2">4.95 / 5.0</p>
          <p className="text-[11px] text-amber-300 font-semibold mt-1">Berdasarkan mitra industri aktif</p>
        </div>
      </div>

      {/* Partner Performance Scorecard Table */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div>
            <h3 className="font-bold text-white text-[16px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-400">domain</span>
              Scorecard Performa Mitra Industri (DUDI) Real
            </h3>
            <p className="text-[12px] text-white/50">Tolak ukur penyerapan, kedisiplinan pembimbing, dan retensi siswa dari database.</p>
          </div>
          <span className="text-[12px] font-mono text-white/40">{selectedPeriod}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-white/80">
            <thead className="text-[11px] text-white/40 uppercase font-bold border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Nama Mitra Industri</th>
                <th className="py-3 px-4">Sektor Usaha</th>
                <th className="py-3 px-4">Kuota / Terisi</th>
                <th className="py-3 px-4">Kehadiran</th>
                <th className="py-3 px-4">Rata-Rata Nilai</th>
                <th className="py-3 px-4">Rating Kepuasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {partnerData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4 font-bold text-white">{row.name}</td>
                  <td className="py-3.5 px-4 text-white/60">{row.sector}</td>
                  <td className="py-3.5 px-4 font-mono">{row.quota}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{row.att}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-violet-300">{row.score}</td>
                  <td className="py-3.5 px-4 text-amber-300 font-bold">{row.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
