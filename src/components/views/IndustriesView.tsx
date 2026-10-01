import React, { useState, useMemo } from 'react';
import { IndustryMaster, IndustryUnitMaster, UserRole } from '../../types';

interface IndustriesViewProps {
  industries: IndustryMaster[];
  currentRole?: UserRole;
  searchQuery?: string;
  onAddIndustry?: () => void;
  onUpdateIndustryStatus?: (id: string, status: 'active' | 'inactive') => void;
  onExportIndustries?: () => void;
}

export const IndustriesView: React.FC<IndustriesViewProps> = ({
  industries,
  currentRole = 'super_admin',
  searchQuery: initialSearch = '',
  onAddIndustry,
  onUpdateIndustryStatus,
  onExportIndustries,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [expandedIndustryId, setExpandedIndustryId] = useState<string | null>(null);
  const [detailModalIndustry, setDetailModalIndustry] = useState<IndustryMaster | null>(null);
  const [newUnitModalIndustry, setNewUnitModalIndustry] = useState<IndustryMaster | null>(null);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitHead, setNewUnitHead] = useState('');
  const [newUnitAddress, setNewUnitAddress] = useState('');

  const isReadOnly = currentRole === 'viewer_dinas';

  // Extract unique sectors
  const sectorsList = useMemo(() => {
    const set = new Set<string>();
    industries.forEach((ind) => {
      if (ind.sector) set.add(ind.sector);
    });
    return Array.from(set);
  }, [industries]);

  // Filtered industries
  const filteredIndustries = useMemo(() => {
    return industries.filter((ind) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        ind.name.toLowerCase().includes(q) ||
        ind.sector.toLowerCase().includes(q) ||
        ind.city.toLowerCase().includes(q) ||
        ind.mouNumber.toLowerCase().includes(q) ||
        (ind.units && ind.units.some((u) => u.name.toLowerCase().includes(q) || u.unitHead.toLowerCase().includes(q)));

      const matchSector = selectedSector === 'all' || ind.sector === selectedSector;
      const matchStatus = selectedStatus === 'all' || ind.status === selectedStatus;

      return matchSearch && matchSector && matchStatus;
    });
  }, [industries, searchTerm, selectedSector, selectedStatus]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalIndustries = industries.length;
    const activeIndustries = industries.filter((i) => i.status === 'active').length;
    const totalQuota = industries.reduce((acc, i) => acc + (i.quotaTotal || 0), 0);
    const usedQuota = industries.reduce((acc, i) => acc + (i.quotaUsed || 0), 0);
    const totalUnits = industries.reduce((acc, i) => acc + (i.units?.length || 0), 0);
    const avgRating =
      industries.length > 0
        ? (industries.reduce((acc, i) => acc + (i.rating || 4.8), 0) / industries.length).toFixed(2)
        : '4.90';

    return {
      totalIndustries,
      activeIndustries,
      totalQuota,
      usedQuota,
      totalUnits,
      avgRating,
      occupancyRate: totalQuota > 0 ? Math.round((usedQuota / totalQuota) * 100) : 0,
    };
  }, [industries]);

  const getSectorIcon = (sector: string) => {
    const s = sector.toLowerCase();
    if (s.includes('telecom') || s.includes('cloud') || s.includes('digital') || s.includes('it') || s.includes('software')) {
      return 'hub';
    }
    if (s.includes('auto') || s.includes('manufactur') || s.includes('mesin')) {
      return 'precision_manufacturing';
    }
    if (s.includes('bank') || s.includes('finan') || s.includes('fintech')) {
      return 'account_balance';
    }
    if (s.includes('health') || s.includes('pharma') || s.includes('med')) {
      return 'local_hospital';
    }
    if (s.includes('media') || s.includes('creative') || s.includes('design')) {
      return 'palette';
    }
    return 'domain';
  };

  const getSectorGradient = (sector: string) => {
    const s = sector.toLowerCase();
    if (s.includes('telecom') || s.includes('cloud') || s.includes('digital') || s.includes('it')) {
      return 'from-blue-600 to-indigo-600';
    }
    if (s.includes('auto') || s.includes('manufactur')) {
      return 'from-amber-600 to-orange-600';
    }
    if (s.includes('bank') || s.includes('finan')) {
      return 'from-emerald-600 to-teal-600';
    }
    return 'from-purple-600 to-indigo-600';
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Top Banner Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-[#0c1024]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[15px]">domain</span>
              <span>Modul 8.2 • Jaringan Kemitraan DUDI Nasional</span>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-black text-white tracking-tight">
              Direktori & Manajemen Mitra Industri (DUDI)
            </h2>
            <p className="text-[14px] text-white/70 mt-1 max-w-3xl leading-relaxed">
              Pusat tata kelola kemitraan Dunia Usaha dan Dunia Industri nasional, kuota penerimaan magang, unit kerja penempatan teknis, sertifikasi industri, evaluasi legalitas MoU, dan koordinasi pembimbing lapangan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onExportIndustries && (
              <button
                type="button"
                onClick={onExportIndustries}
                className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/15 rounded-2xl text-[13px] font-bold cursor-pointer transition-all flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] text-blue-400">download</span>
                <span>Ekspor Direktori</span>
              </button>
            )}

            {!isReadOnly && onAddIndustry && (
              <button
                type="button"
                id="btn-add-industry-main"
                onClick={onAddIndustry}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-[13px] font-bold shadow-lg shadow-blue-950/60 hover:shadow-blue-900/70 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-200 flex items-center gap-2 ring-1 ring-blue-400/40"
              >
                <span className="material-symbols-outlined text-[18px]">add_business</span>
                <span>Tambah Mitra DUDI</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Mitra */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Mitra DUDI Aktif</span>
            <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 material-symbols-outlined text-[20px]">
              domain
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-white">{metrics.totalIndustries}</span>
              <span className="text-[12px] text-emerald-400 font-bold">({metrics.activeIndustries} Aktif)</span>
            </div>
            <p className="text-[12px] text-white/50 mt-0.5">MoU Kerjasama Nasional Vokasi</p>
          </div>
        </div>

        {/* Quota Terpakai */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Kapasitas Kuota PKL</span>
            <span className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 material-symbols-outlined text-[20px]">
              group_add
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[30px] font-black text-indigo-400">{metrics.usedQuota}</span>
              <span className="text-[13px] text-white/50 font-medium">/ {metrics.totalQuota} Siswa</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(metrics.occupancyRate, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-indigo-300 font-semibold mt-1.5 flex justify-between">
              <span>Tingkat Keterisian Kuota</span>
              <span>{metrics.occupancyRate}%</span>
            </p>
          </div>
        </div>

        {/* Unit Kerja Divisi */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Unit / Divisi Kerja</span>
            <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 material-symbols-outlined text-[20px]">
              corporate_fare
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[30px] font-black text-amber-300">{metrics.totalUnits}</span>
            <span className="text-[12px] text-white/60 ml-2 font-medium">Divisi Penempatan</span>
            <p className="text-[12px] text-white/50 mt-1">Siap menerima peserta didik SMK</p>
          </div>
        </div>

        {/* Rating Kepuasan */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between glass-card-hover">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-bold text-white/50 uppercase tracking-wider">Kepuasan Kemitraan</span>
            <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 material-symbols-outlined text-[20px]">
              stars
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[30px] font-black text-emerald-400">{metrics.avgRating}</span>
              <span className="text-[13px] text-white/50">/ 5.0</span>
              <div className="flex text-amber-400 ml-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-[16px]">
                    star
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[12px] text-white/50 mt-1">Rata-rata evaluasi pembimbing & sekolah</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & View Toggle */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama PT, sektor, kota, no. MoU, atau divisi..."
            className="w-full pl-10 pr-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/40 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns & View Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sector Filter */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="all" className="bg-[#0f172a] text-white">Semua Sektor Industri</option>
            {sectorsList.map((sec) => (
              <option key={sec} value={sec} className="bg-[#0f172a] text-white">
                {sec}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            <option value="all" className="bg-[#0f172a] text-white">Semua Status</option>
            <option value="active" className="bg-[#0f172a] text-white">Aktif (MoU Berlaku)</option>
            <option value="inactive" className="bg-[#0f172a] text-white">Non-Aktif / Perlu MoU</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
              }`}
              title="Tampilan Grid Kartu"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'text-white/50 hover:text-white'
              }`}
              title="Tampilan Tabel Data"
            >
              <span className="material-symbols-outlined text-[18px]">table_rows</span>
            </button>
          </div>
        </div>
      </div>

      {/* Industries Content: Grid or Table */}
      {filteredIndustries.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10 my-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/40">
            <span className="material-symbols-outlined text-[36px]">domain_disabled</span>
          </div>
          <h3 className="text-[18px] font-bold text-white">Tidak ada mitra DUDI yang cocok</h3>
          <p className="text-[13px] text-white/50 max-w-md mx-auto mt-1">
            Silakan sesuaikan kata kunci pencarian atau ubah filter sektor dan status kemitraan.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSector('all');
              setSelectedStatus('all');
            }}
            className="mt-4 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-[12px] font-bold rounded-xl transition-colors cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredIndustries.map((ind) => {
            const isExpanded = expandedIndustryId === ind.id;
            const quotaPercent = ind.quotaTotal > 0 ? Math.round(((ind.quotaUsed || 0) / ind.quotaTotal) * 100) : 0;
            const sectorIcon = getSectorIcon(ind.sector);
            const gradientClass = getSectorGradient(ind.sector);

            return (
              <div
                key={ind.id}
                className="glass-card rounded-2xl border border-white/10 p-5 flex flex-col justify-between hover:border-blue-500/40 transition-all duration-200 group"
              >
                <div>
                  {/* Card Header: Icon, Name, Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white shadow-lg shrink-0`}
                      >
                        <span className="material-symbols-outlined text-[24px]">{sectorIcon}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[16px] font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                          {ind.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-white/60 mt-0.5">
                          <span className="material-symbols-outlined text-[13px] text-blue-400">location_on</span>
                          <span>{ind.city}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 border ${
                        ind.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {ind.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  {/* Sektor Badge */}
                  <div className="mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.04] text-white/80 border border-white/10 inline-block max-w-full truncate">
                      {ind.sector}
                    </span>
                  </div>

                  {/* MoU Info */}
                  <div className="bg-white/[0.03] p-3 rounded-xl border border-white/10 space-y-1.5 text-[11px] mb-4">
                    <div className="flex justify-between items-center text-white/60">
                      <span>Nomor MoU:</span>
                      <span className="font-mono text-white/90 font-medium truncate max-w-[180px]">{ind.mouNumber}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/60">
                      <span>Masa Berlaku:</span>
                      <span className="text-amber-300 font-semibold">{ind.mouValidUntil}</span>
                    </div>
                  </div>

                  {/* Quota Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-[12px] mb-1.5">
                      <span className="text-white/60 font-medium">Kuota Penerimaan:</span>
                      <span className="font-bold text-white">
                        {ind.quotaUsed} / {ind.quotaTotal} Siswa{' '}
                        <span className="text-[11px] text-blue-400">({quotaPercent}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          quotaPercent >= 90
                            ? 'bg-rose-500'
                            : quotaPercent >= 70
                            ? 'bg-amber-500'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${Math.min(quotaPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Unit Kerja Accordion / Mini List */}
                  {ind.units && ind.units.length > 0 && (
                    <div className="border-t border-white/10 pt-3 mb-3">
                      <button
                        type="button"
                        onClick={() => setExpandedIndustryId(isExpanded ? null : ind.id)}
                        className="w-full flex justify-between items-center text-[12px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
                          <span>{ind.units.length} Unit / Divisi Kerja</span>
                        </span>
                        <span className="material-symbols-outlined text-[16px] transition-transform duration-200">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="mt-2.5 space-y-2 animate-fade-in">
                          {ind.units.map((unit) => (
                            <div
                              key={unit.id}
                              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] space-y-1"
                            >
                              <div className="flex justify-between items-start font-semibold text-white">
                                <span className="text-blue-200">{unit.name}</span>
                                <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                  {unit.activeInterns} Siswa
                                </span>
                              </div>
                              <div className="flex justify-between text-white/50 text-[10px]">
                                <span>Head: {unit.unitHead}</span>
                                <span>{unit.mentorCount} Pembimbing</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setDetailModalIndustry(ind)}
                    className="flex-1 py-2 px-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-xl text-[12px] font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-400">info</span>
                    <span>Detail Lengkap</span>
                  </button>

                  {!isReadOnly && onUpdateIndustryStatus && (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateIndustryStatus(ind.id, ind.status === 'active' ? 'inactive' : 'active')
                      }
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        ind.status === 'active'
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                      }`}
                      title={ind.status === 'active' ? 'Nonaktifkan Mitra' : 'Aktifkan Mitra'}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {ind.status === 'active' ? 'pause_circle' : 'play_circle'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] text-white/80">
              <thead className="border-b border-white/10 text-white/40 text-[10px] uppercase tracking-wider bg-white/[0.02]">
                <tr>
                  <th className="py-3 px-4">Nama Perusahaan & Sektor</th>
                  <th className="py-3 px-4">Kota / Lokasi</th>
                  <th className="py-3 px-4">No. MoU & Validitas</th>
                  <th className="py-3 px-4 text-center">Kuota PKL</th>
                  <th className="py-3 px-4 text-center">Unit Divisi</th>
                  <th className="py-3 px-4 text-center">Rating</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredIndustries.map((ind) => (
                  <tr key={ind.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getSectorGradient(
                            ind.sector
                          )} flex items-center justify-center text-white shrink-0`}
                        >
                          <span className="material-symbols-outlined text-[18px]">{getSectorIcon(ind.sector)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{ind.name}</p>
                          <p className="text-[11px] text-white/50 truncate max-w-xs">{ind.sector}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/70">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-blue-400">location_on</span>
                        <span>{ind.city}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono text-[11px] text-white/80 truncate max-w-[160px]">{ind.mouNumber}</p>
                      <p className="text-[10px] text-amber-300">s/d {ind.mouValidUntil}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-white">
                        {ind.quotaUsed} / {ind.quotaTotal}
                      </span>
                      <span className="block text-[10px] text-blue-400">
                        {Math.round(((ind.quotaUsed || 0) / (ind.quotaTotal || 1)) * 100)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.06] text-white border border-white/10">
                        {ind.units?.length || 0} Unit
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-emerald-400 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-amber-400">star</span>
                        <span>{ind.rating || 4.9}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                          ind.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {ind.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailModalIndustry(ind)}
                          className="p-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-lg text-blue-300 transition-colors cursor-pointer"
                          title="Lihat Detail Profil & Unit Kerja"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        {!isReadOnly && onUpdateIndustryStatus && (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateIndustryStatus(ind.id, ind.status === 'active' ? 'inactive' : 'active')
                            }
                            className="p-1.5 bg-white/[0.06] hover:bg-white/[0.12] rounded-lg text-amber-300 transition-colors cursor-pointer"
                            title="Ganti Status Aktif/Nonaktif"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {ind.status === 'active' ? 'pause' : 'play_arrow'}
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL DRAWER */}
      {detailModalIndustry && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailModalIndustry(null);
          }}
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in overflow-y-auto"
        >
          <div className="glass-card bg-[#0e1228]/95 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-white/15 text-white my-8 relative">
            <div className="flex justify-between items-start pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getSectorGradient(
                    detailModalIndustry.sector
                  )} flex items-center justify-center text-white shadow-lg`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {getSectorIcon(detailModalIndustry.sector)}
                  </span>
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-white">{detailModalIndustry.name}</h3>
                  <p className="text-[12px] text-white/60">{detailModalIndustry.sector}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalIndustry(null)}
                className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-[13px]">
              {/* Overview Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Kota Wilayah</span>
                  <p className="font-bold text-white mt-0.5">{detailModalIndustry.city}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Kapasitas Kuota</span>
                  <p className="font-bold text-indigo-400 mt-0.5">
                    {detailModalIndustry.quotaUsed} / {detailModalIndustry.quotaTotal} Siswa
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Status MoU</span>
                  <p className="font-bold text-emerald-400 mt-0.5">
                    {detailModalIndustry.status === 'active' ? 'Aktif Terverifikasi' : 'Non-Aktif'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/50">Rating Kemitraan</span>
                  <p className="font-bold text-amber-300 mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    <span>{detailModalIndustry.rating || 4.9} / 5.0</span>
                  </p>
                </div>
              </div>

              {/* MoU Document Specs */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20">
                <h4 className="font-bold text-blue-300 text-[13px] flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Legalitas & Kerjasama Vokasi (MoU)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px] text-white/70">
                  <div>
                    <span className="text-white/40">Nomor Registrasi MoU:</span>{' '}
                    <span className="font-mono font-medium text-white">{detailModalIndustry.mouNumber}</span>
                  </div>
                  <div>
                    <span className="text-white/40">Masa Berlaku Perjanjian:</span>{' '}
                    <span className="font-semibold text-amber-300">{detailModalIndustry.mouValidUntil}</span>
                  </div>
                </div>
              </div>

              {/* Units / Divisi List */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-white text-[14px] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-blue-400">corporate_fare</span>
                    <span>Daftar Unit Kerja & Divisi Magang ({detailModalIndustry.units?.length || 0})</span>
                  </h4>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {detailModalIndustry.units && detailModalIndustry.units.length > 0 ? (
                    detailModalIndustry.units.map((unit) => (
                      <div
                        key={unit.id}
                        className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all text-[12px]"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-white text-[13px]">{unit.name}</h5>
                            <p className="text-white/50 text-[11px] mt-0.5 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">pin_drop</span>
                              <span>{unit.address}</span>
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {unit.activeInterns} Siswa Magang
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-white/5 text-[11px] text-white/60">
                          <span>
                            Kepala Unit / PIC: <strong className="text-white">{unit.unitHead}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Pembimbing Industri: <strong className="text-white">{unit.mentorCount} Mentor</strong>
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/40 italic p-3 text-center">Belum ada unit kerja terdaftar.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/10 mt-6">
              <button
                type="button"
                onClick={() => setDetailModalIndustry(null)}
                className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-xl font-semibold text-[13px] cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
