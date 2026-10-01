import React, { useState } from 'react';
import { SchoolMaster, IndustryMaster, DepartmentMaster, UserRole } from '../../types';
import { ErdLogicalModelView } from './ErdLogicalModelView';

interface MasterDataViewProps {
  schools: SchoolMaster[];
  industries: IndustryMaster[];
  departments: DepartmentMaster[];
  currentRole: UserRole;
  searchQuery?: string;
  onUpdateSchoolStatus?: (id: string, status: 'active' | 'inactive') => void;
  onUpdateIndustryStatus?: (id: string, status: 'active' | 'inactive') => void;
  onAddSchool?: () => void;
  onAddIndustry?: () => void;
  onAddDepartment?: () => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  schools,
  industries,
  departments,
  currentRole,
  searchQuery = '',
  onUpdateSchoolStatus,
  onUpdateIndustryStatus,
  onAddSchool,
  onAddIndustry,
  onAddDepartment,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'schools' | 'industries' | 'departments' | 'erd_model'>('schools');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredSchools = schools.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredIndustries = industries.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.sector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredDepts = departments.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const isReadOnly = currentRole === 'viewer_dinas';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">database</span>
              <span>Modul 8.2 • Master Data Management</span>
            </div>
            <h2 className="text-[24px] font-black text-white tracking-tight">
              Master Data & Tata Kelola Kelembagaan
            </h2>
            <p className="text-[13px] text-white/60 mt-1 max-w-2xl">
              Pengelolaan terpadu sekolah vokasi, mitra industri (DUDI), unit kerja, program keahlian, dan periode pemagangan dengan proteksi preservasi riwayat (soft archive).
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isReadOnly && (
              <button
                onClick={() => {
                  if (activeSubTab === 'schools' && onAddSchool) onAddSchool();
                  else if (activeSubTab === 'industries' && onAddIndustry) onAddIndustry();
                  else if (activeSubTab === 'departments' && onAddDepartment) onAddDepartment();
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-[13px] shadow-lg shadow-violet-900/40 transition-all cursor-pointer flex items-center gap-2 active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Tambah {activeSubTab === 'schools' ? 'Sekolah' : activeSubTab === 'industries' ? 'Mitra Industri' : 'Program Keahlian'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveSubTab('schools')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'schools'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40 border border-violet-500/40'
                : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">school</span>
            <span>Sekolah (SMK)</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20">{schools.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('industries')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'industries'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40 border border-violet-500/40'
                : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">domain</span>
            <span>Mitra Industri & Unit</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20">{industries.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('departments')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'departments'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40 border border-violet-500/40'
                : 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">category</span>
            <span>Program Keahlian (Dept)</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-white/20">{departments.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('erd_model')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'erd_model'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-500/40'
                : 'bg-white/[0.04] text-blue-300 hover:bg-white/[0.08]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_tree</span>
            <span>11. ERD Data Model</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-500/20 text-blue-200">Baseline</span>
          </button>
        </div>
      </div>

      {/* Filter Status Bar */}
      <div className="flex items-center justify-between text-[12px] px-2">
        <div className="flex items-center gap-2 text-white/60">
          <span>Filter Status Riwayat:</span>
          {(['all', 'active', 'inactive'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'bg-white/[0.03] text-white/50 hover:text-white'
              }`}
            >
              {st === 'all' ? 'Semua Status' : st === 'active' ? 'Aktif' : 'Nonaktif (Arsip)'}
            </button>
          ))}
        </div>
        <div className="text-white/40 text-[11px]">
          Sistem preservasi data: penghapusan dinonaktifkan untuk menjaga histori verifikasi sertifikat.
        </div>
      </div>

      {/* 1. Schools List */}
      {activeSubTab === 'schools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchools.map((sch) => (
            <div
              key={sch.id}
              className="glass-card rounded-2xl p-5 border border-white/10 hover:border-violet-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">school</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-[14px] leading-tight">{sch.name}</h4>
                      <p className="text-[11px] text-white/50 font-mono mt-0.5">NPSN: {sch.npsn}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      sch.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {sch.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-[12px] text-white/70">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-white/40">location_on</span>
                    <span className="truncate">{sch.address}, {sch.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-white/40">person</span>
                    <span>Kepala: {sch.principalName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
                  <div className="p-2 rounded-xl bg-white/[0.02]">
                    <p className="text-[14px] font-black text-white">{sch.studentCount}</p>
                    <p className="text-[10px] text-white/40">Siswa</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.02]">
                    <p className="text-[14px] font-black text-white">{sch.mentorCount}</p>
                    <p className="text-[10px] text-white/40">Guru</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.02]">
                    <p className="text-[14px] font-black text-violet-300">{sch.partnerCount}</p>
                    <p className="text-[10px] text-white/40">Mitra DUDI</p>
                  </div>
                </div>
              </div>

              {!isReadOnly && onUpdateSchoolStatus && (
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-white/40">Ubah Status Keaktifan:</span>
                  <button
                    onClick={() => onUpdateSchoolStatus(sch.id, sch.status === 'active' ? 'inactive' : 'active')}
                    className="text-violet-300 hover:text-violet-200 font-bold underline cursor-pointer"
                  >
                    {sch.status === 'active' ? 'Nonaktifkan' : 'Aktifkan Kembali'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 2. Industries List */}
      {activeSubTab === 'industries' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIndustries.map((ind) => (
            <div
              key={ind.id}
              className="glass-card rounded-2xl p-5 border border-white/10 hover:border-violet-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-300 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">domain</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-[14px] leading-tight">{ind.name}</h4>
                      <p className="text-[11px] text-white/50 mt-0.5">{ind.sector}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                      ind.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {ind.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-white/60 space-y-1">
                  <div className="flex justify-between">
                    <span>No. MoU:</span>
                    <span className="text-white/80">{ind.mouNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Berlaku s/d:</span>
                    <span className="text-emerald-300">{ind.mouValidUntil}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">
                    Unit Kerja ({ind.units.length}):
                  </p>
                  <div className="space-y-1.5">
                    {ind.units.map((u) => (
                      <div
                        key={u.id}
                        className="p-2 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-[11px]"
                      >
                        <span className="text-white/80 truncate font-semibold">{u.name}</span>
                        <span className="text-violet-300 font-bold shrink-0">{u.activeInterns} Siswa</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!isReadOnly && onUpdateIndustryStatus && (
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-white/40">Status:</span>
                  <button
                    onClick={() => onUpdateIndustryStatus(ind.id, ind.status === 'active' ? 'inactive' : 'active')}
                    className="text-violet-300 hover:text-violet-200 font-bold underline cursor-pointer"
                  >
                    {ind.status === 'active' ? 'Nonaktifkan' : 'Aktifkan Kembali'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. Departments List */}
      {activeSubTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDepts.map((d) => (
            <div
              key={d.id}
              className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-mono font-bold text-violet-400 px-2 py-0.5 rounded-md bg-violet-500/15 border border-violet-500/30">
                    {d.code}
                  </span>
                  <span className="text-[10px] text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    {d.curriculum}
                  </span>
                </div>

                <h4 className="font-bold text-white text-[14px] leading-snug">{d.name}</h4>
                
                <div className="mt-4 space-y-2 text-[12px] text-white/70">
                  <div className="flex justify-between">
                    <span className="text-white/50">Target Kompetensi:</span>
                    <span className="font-bold text-white">{d.competencyCount} Standar SKKNI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Siswa Aktif:</span>
                    <span className="font-bold text-violet-300">{d.activeStudents} Siswa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Durasi:</span>
                    <span className="font-bold text-white">{d.durationMonths} Bulan</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/40 flex items-center justify-between">
                <span>Status: Aktif</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Kurikulum Siap
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. ERD - Logical Data Model Baseline */}
      {activeSubTab === 'erd_model' && (
        <ErdLogicalModelView />
      )}
    </div>
  );
};
