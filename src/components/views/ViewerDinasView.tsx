import React, { useState } from 'react';

interface ViewerDinasViewProps {
  onExportReport?: () => void;
  searchQuery?: string;
  isReadOnly?: boolean;
}

export const ViewerDinasView: React.FC<ViewerDinasViewProps> = ({
  onExportReport,
  searchQuery = '',
  isReadOnly = true,
}) => {
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = [
    { area: 'Jakarta Pusat', smkCount: 28, studentsActive: 1240, placementRate: 98.4, dudiPartners: 210, compliance: '99.2%', issues: 0 },
    { area: 'Jakarta Selatan', smkCount: 36, studentsActive: 1680, placementRate: 97.1, dudiPartners: 320, compliance: '98.5%', issues: 1 },
    { area: 'Jakarta Barat', smkCount: 32, studentsActive: 1420, placementRate: 95.8, dudiPartners: 240, compliance: '96.8%', issues: 1 },
    { area: 'Jakarta Timur', smkCount: 30, studentsActive: 1350, placementRate: 96.5, dudiPartners: 215, compliance: '97.4%', issues: 0 },
    { area: 'Jakarta Utara', smkCount: 16, studentsActive: 710, placementRate: 94.2, dudiPartners: 110, compliance: '95.0%', issues: 0 },
  ];

  const problemReports = [
    { id: 'PR-01', school: 'SMK Negeri 26 Jakarta', industry: 'PT. Konstruksi Presisi', type: 'Siswa Sakit / Izin &gt; 5 Hari', status: 'Ditangani Sekolah', date: '28 Agu 2026' },
    { id: 'PR-02', school: 'SMK Negeri 4 Jakarta', industry: 'Bengkel Mandiri Motor', type: 'Penyesuaian Jam Kerja Lembur', status: 'Selesai Dimediasi', date: '25 Agu 2026' },
  ];

  const competencies = [
    { field: 'Rekayasa Perangkat Lunak & IT', index: 88.5, absorption: '92% Bekerja / Wirausaha' },
    { field: 'Teknik Kendaraan Ringan Otomotif', index: 85.2, absorption: '89% Bekerja di Industri' },
    { field: 'Desain Komunikasi Visual & Animasi', index: 83.7, absorption: '86% Agensi & Freelance' },
    { field: 'Manajemen Perkantoran & Bisnis', index: 86.1, absorption: '90% Korporasi' },
  ];

  const filteredRegions = regions.filter(r =>
    (selectedRegion === 'All' || r.area === selectedRegion) &&
    (r.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
     r.smkCount.toString().includes(searchQuery))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dinas Banner with Read-Only Notice */}
      <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden border border-sky-500/30 bg-gradient-to-r from-sky-950/30 via-indigo-950/20 to-[#0e1122]/80">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Dashboard Eksekutif Dinas Pendidikan • /dinas/dashboard
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">visibility</span>
                Mode Pantau (Read-Only)
              </span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Agregat Kinerja Magang Vokasi Wilayah
            </h2>
            <p className="text-[14px] text-white/70 max-w-2xl mt-1">
              Data analitik terpadu penyerapan siswa magang SMK di industri, kepatuhan kurikulum, evaluasi kemitraan DUDI, dan pelaporan kendala di DKI Jakarta.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExportReport}
              className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-sky-900/40 cursor-pointer transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Unduh Laporan Eksekutif (PDF/XLS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Exact Required Viewer / Dinas KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 - Regional Internship Stats */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[12px] font-bold text-white/50 uppercase">Regional Stats</span>
            <span className="p-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-xl material-symbols-outlined text-[18px]">
              public
            </span>
          </div>
          <div>
            <p className="text-[28px] font-black text-white leading-none">6,400</p>
            <p className="text-[11px] text-sky-400 font-semibold mt-2">Siswa di 5 Wilayah Kota</p>
          </div>
        </div>

        {/* KPI 2 - School Compliance */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[12px] font-bold text-white/50 uppercase">School Compliance</span>
            <span className="p-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl material-symbols-outlined text-[18px]">
              verified_user
            </span>
          </div>
          <div>
            <p className="text-[28px] font-black text-emerald-400 leading-none">97.8%</p>
            <p className="text-[11px] text-emerald-400/80 font-semibold mt-2">142 SMK Patuh Kurikulum</p>
          </div>
        </div>

        {/* KPI 3 - Industry Engagement */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[12px] font-bold text-white/50 uppercase">Industry Engagement</span>
            <span className="p-2 bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-xl material-symbols-outlined text-[18px]">
              apartment
            </span>
          </div>
          <div>
            <p className="text-[28px] font-black text-white leading-none">1,095 DUDI</p>
            <p className="text-[11px] text-violet-300 font-semibold mt-2">MoU Magang Aktif</p>
          </div>
        </div>

        {/* KPI 4 - Problem Reports */}
        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 bg-amber-950/15 glass-card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[12px] font-bold text-amber-300/80 uppercase">Problem Reports</span>
            <span className="p-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl material-symbols-outlined text-[18px]">
              report
            </span>
          </div>
          <div>
            <p className="text-[28px] font-black text-amber-300 leading-none">2 Kasus</p>
            <p className="text-[11px] text-amber-400 font-semibold mt-2">Semua dalam mediasi</p>
          </div>
        </div>

        {/* KPI 5 - Summary Analytics */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 glass-card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[12px] font-bold text-white/50 uppercase">Penyerapan Kerja</span>
            <span className="p-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl material-symbols-outlined text-[18px]">
              trending_up
            </span>
          </div>
          <div>
            <p className="text-[28px] font-black text-emerald-400 leading-none">89.4%</p>
            <p className="text-[11px] text-white/60 font-semibold mt-2">Indeks Serapan Pasca-PKL</p>
          </div>
        </div>
      </div>

      {/* Regional Table & Competency Index */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-white/10 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-[17px] font-bold text-white mb-1">Distribusi Penyerapan Per Wilayah Kota/Kabupaten</h3>
              <p className="text-[12px] text-white/50">Cakupan penempatan siswa magang di seluruh Suku Dinas Pendidikan</p>
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white/[0.06] border border-white/12 text-[12px] text-white rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-sky-500/40 outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#131127] text-white">Semua Wilayah</option>
              <option value="Jakarta Pusat" className="bg-[#131127] text-white">Jakarta Pusat</option>
              <option value="Jakarta Selatan" className="bg-[#131127] text-white">Jakarta Selatan</option>
              <option value="Jakarta Barat" className="bg-[#131127] text-white">Jakarta Barat</option>
              <option value="Jakarta Timur" className="bg-[#131127] text-white">Jakarta Timur</option>
              <option value="Jakarta Utara" className="bg-[#131127] text-white">Jakarta Utara</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] text-white/80">
              <thead className="border-b border-white/10 text-white/40 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Wilayah</th>
                  <th className="py-2.5 px-3 text-center">Jumlah SMK</th>
                  <th className="py-2.5 px-3 text-center">Siswa Magang</th>
                  <th className="py-2.5 px-3 text-center">Mitra Industri</th>
                  <th className="py-2.5 px-3 text-center">Kepatuhan</th>
                  <th className="py-2.5 px-3 text-right">Penempatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRegions.map((r, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{r.area}</td>
                    <td className="py-3 px-3 text-center text-white/70">{r.smkCount}</td>
                    <td className="py-3 px-3 text-center font-semibold text-white">{r.studentsActive}</td>
                    <td className="py-3 px-3 text-center text-white/70">{r.dudiPartners}</td>
                    <td className="py-3 px-3 text-center font-semibold text-sky-300">{r.compliance}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                        {r.placementRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h3 className="text-[17px] font-bold text-white mb-1">Indeks Kompetensi Bidang</h3>
          <p className="text-[12px] text-white/50 mb-4">Relevansi kurikulum dengan kebutuhan pasar industri</p>

          <div className="space-y-4">
            {competencies.map((comp, idx) => (
              <div key={idx} className="p-3 bg-white/[0.03] rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-[13px] font-bold text-white">{comp.field}</h4>
                  <span className="text-[12px] font-bold text-sky-400">{comp.index}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-1.5 rounded-full" style={{ width: `${comp.index}%` }}></div>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium">{comp.absorption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Reports Feed (Read-Only) */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[17px] font-bold text-white">Problem Reports & Kendala Lapangan</h3>
            <p className="text-[12px] text-white/50">Laporan insiden magang yang diteruskan sekolah ke dinas</p>
          </div>
          <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            {problemReports.length} Laporan Termediasi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px] text-white/80">
            <thead className="border-b border-white/10 text-white/40 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">No. Laporan</th>
                <th className="py-2.5 px-3">Sekolah</th>
                <th className="py-2.5 px-3">Mitra Industri</th>
                <th className="py-2.5 px-3">Kategori Kendala</th>
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3 text-right">Status Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {problemReports.map((pr) => (
                <tr key={pr.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-sky-300">{pr.id}</td>
                  <td className="py-3 px-3 font-semibold text-white">{pr.school}</td>
                  <td className="py-3 px-3 text-white/70">{pr.industry}</td>
                  <td className="py-3 px-3 text-amber-300 font-medium">{pr.type}</td>
                  <td className="py-3 px-3 text-white/50">{pr.date}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {pr.status}
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
