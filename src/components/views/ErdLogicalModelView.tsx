import React, { useState } from 'react';
import { ERD_ENTITIES, ERD_RELATIONS, ERD_CORE_TABLES_SUMMARY, SQL_SCHEMA_DDL } from '../../data/erdData';
import { ErdCoreTableSummary } from '../../types';

interface ErdLogicalModelViewProps {
  onBack?: () => void;
}

export const ErdLogicalModelView: React.FC<ErdLogicalModelViewProps> = ({ onBack }) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>('placements');
  const [activeGroup, setActiveGroup] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'core_tables' | 'entity_map' | 'data_dictionary' | 'relations' | 'sql_ddl'>('core_tables');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedEntity, setCopiedEntity] = useState<string | null>(null);

  const groups = ['ALL', 'USERS', 'SCHOOLS', 'STUDENTS', 'COMPETENCIES', 'OPERATIONS', 'ASSESSMENTS', 'CERTIFICATES', 'SYSTEM'];

  // Filter 11.2 Core Tables Summary
  const filteredCoreTables = ERD_CORE_TABLES_SUMMARY.filter((table) => {
    const matchGroup = activeGroup === 'ALL' || table.group === activeGroup;
    const matchSearch =
      table.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.keyFields.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGroup && matchSearch;
  });

  // Filter Detailed Entities
  const filteredEntities = ERD_ENTITIES.filter((entity) => {
    const matchGroup = activeGroup === 'ALL' || entity.group === activeGroup;
    const matchSearch =
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.columns.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchGroup && matchSearch;
  });

  const selectedEntity = ERD_ENTITIES.find((e) => e.id === selectedEntityId) || ERD_ENTITIES[0];

  const relatedForeignKeys = ERD_RELATIONS.filter(
    (r) => r.fromTable === selectedEntity.id || r.toTable === selectedEntity.id
  );

  const copyToClipboard = async (text: string): Promise<boolean> => {
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      // Fallback below
    }

    if (!ok) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.setAttribute('readonly', '');
        document.body.appendChild(textarea);
        textarea.select();
        ok = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (e) {
        console.error('Clipboard copy fallback error:', e);
      }
    }
    return ok;
  };

  const handleCopySql = async () => {
    await copyToClipboard(SQL_SCHEMA_DDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopySingleTable = async (table: ErdCoreTableSummary) => {
    const text = `${table.entity} \t ${table.keyFields}`;
    await copyToClipboard(text);
    setCopiedEntity(table.entity);
    setTimeout(() => setCopiedEntity(null), 2000);
  };

  const renderKeyFields = (keyFieldsStr: string) => {
    const parts = keyFieldsStr.split(';').map((p) => p.trim());
    return (
      <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
        {parts.map((part, idx) => {
          const isPK = part.includes('PK');
          const isFK = part.includes('FK');
          const isUnique = part.includes('UNIQUE');
          const isNullable = part.includes('nullable');

          let badgeStyle = 'bg-slate-800/80 text-slate-300 border-slate-700';
          if (isPK) {
            badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
          } else if (isFK) {
            badgeStyle = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
          } else if (isUnique) {
            badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
          } else if (isNullable) {
            badgeStyle = 'bg-slate-700/50 text-slate-400 border-slate-600/40 italic';
          }

          return (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded-md border text-[11px] inline-flex items-center gap-1 ${badgeStyle}`}
            >
              {isPK && <span className="text-[10px] text-amber-400 font-sans font-black">🔑</span>}
              {isFK && <span className="text-[10px] text-indigo-400 font-sans font-bold">🔗</span>}
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Top Banner Card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden bg-slate-900/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[14px]">account_tree</span>
              <span>Modul 11 • ERD Logical Data Model Baseline</span>
            </div>
            <h2 className="text-[24px] font-black text-white tracking-tight">
              11.2 Core Tables & Logical Data Model Specification
            </h2>
            <p className="text-[13px] text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Arsitektur database relasional lengkap (<span className="text-blue-300 font-bold">34 Core Tables</span>) dengan standarisasi Primary Key <span className="text-blue-300 font-mono font-bold">UUID v4</span>, integritas referensial Foreign Key, dan pencatatan waktu <span className="text-blue-300 font-mono font-bold">TIMESTAMPTZ (UTC)</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onBack && (
              <button
                type="button"
                id="btn-erd-back"
                onClick={onBack}
                className="px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white border border-slate-600/80 font-bold rounded-xl text-[13px] shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-95 duration-150 ring-1 ring-slate-500/30 hover:ring-blue-400/40"
                aria-label="Kembali ke Dashboard Utama"
              >
                <span className="material-symbols-outlined text-[18px] text-blue-400">arrow_back</span>
                <span>Kembali ke Dashboard</span>
              </button>
            )}
            <button
              type="button"
              id="btn-erd-copy-sql"
              onClick={handleCopySql}
              className={`px-4 py-2.5 font-bold rounded-xl text-[13px] shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-95 duration-150 border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-950/60 ring-2 ring-emerald-400/50'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white border-blue-500/40 shadow-blue-950/50 hover:shadow-blue-900/60 ring-1 ring-blue-400/40'
              }`}
              aria-label="Salin DDL SQL 34 Tabel Database"
            >
              <span className={`material-symbols-outlined text-[18px] ${copied ? 'text-white' : 'text-blue-200'}`}>
                {copied ? 'check_circle' : 'content_copy'}
              </span>
              <span>{copied ? 'SQL DDL 34 Tabel Berhasil Disalin!' : 'Salin DDL SQL (34 Tabel)'}</span>
            </button>
          </div>
        </div>

        {/* View Mode Sub-tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('core_tables')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'core_tables'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40 border border-blue-500/40'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">dataset</span>
            <span>11.2 Core Tables Summary</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-500/30 text-blue-200 font-mono">
              34
            </span>
          </button>

          <button
            onClick={() => setActiveTab('entity_map')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'entity_map'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40 border border-blue-500/40'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_tree</span>
            <span>11.1 Entity Map Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('data_dictionary')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'data_dictionary'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40 border border-blue-500/40'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">table_rows</span>
            <span>Data Dictionary & Columns</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-500/20 text-blue-200">
              {ERD_ENTITIES.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('relations')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'relations'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40 border border-blue-500/40'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sync_alt</span>
            <span>Relational Mapping & FKs</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-blue-500/20 text-blue-200">
              {ERD_RELATIONS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sql_ddl')}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'sql_ddl'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/40 border border-blue-500/40'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>PostgreSQL / Supabase DDL</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 md:pb-0">
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => setActiveGroup(grp)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeGroup === grp
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-900/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Cari entitas, key fields, atau kolom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-[13px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 11.2 CORE TABLES SUMMARY VIEW                                      */}
      {/* ========================================================================= */}
      {activeTab === 'core_tables' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-slate-200">
                11.2 Core Tables Catalog
              </span>
              <span className="text-[12px] text-slate-400">
                (Menampilkan {filteredCoreTables.length} dari {ERD_CORE_TABLES_SUMMARY.length} entitas tabel)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1"><span className="text-amber-400 font-bold">🔑</span> PK</span>
              <span className="inline-flex items-center gap-1"><span className="text-indigo-400 font-bold">🔗</span> FK</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-[12px] uppercase text-slate-400 tracking-wider font-bold">
                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                    <th className="py-3.5 px-4 w-48">Entity</th>
                    <th className="py-3.5 px-4">Key Fields</th>
                    <th className="py-3.5 px-4 w-32">Module Group</th>
                    <th className="py-3.5 px-4 w-28 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-[13px]">
                  {filteredCoreTables.map((item, index) => (
                    <tr
                      key={item.entity}
                      className="hover:bg-blue-500/[0.04] transition-colors group"
                    >
                      {/* Index Number */}
                      <td className="py-3.5 px-4 text-center font-mono text-[12px] text-slate-400">
                        {index + 1}
                      </td>

                      {/* Entity Name */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 font-bold group-hover:text-blue-300">
                            {item.entity}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedEntityId(item.entity);
                              setActiveTab('data_dictionary');
                            }}
                            title="Buka Data Dictionary"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-300 text-[14px]"
                          >
                            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans font-normal mt-0.5 line-clamp-1">
                          {item.description}
                        </div>
                      </td>

                      {/* Key Fields */}
                      <td className="py-3.5 px-4">
                        {renderKeyFields(item.keyFields)}
                      </td>

                      {/* Module Group */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-slate-800 border border-slate-700 text-slate-300">
                          {item.group}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleCopySingleTable(item)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-200 rounded-lg text-[11px] font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-1 mx-auto"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {copiedEntity === item.entity ? 'check' : 'content_copy'}
                          </span>
                          <span>{copiedEntity === item.entity ? 'Tersalin' : 'Copy'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: 11.1 ENTITY MAP VISUALIZER                                         */}
      {/* ========================================================================= */}
      {activeTab === 'entity_map' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main Hierarchy Tree */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400">account_tree</span>
                  <span>11.1 Hierarchical Logical Entity Map</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Klik entitas untuk melihat schema detail
                </span>
              </div>

              {/* Hierarchy Tree Blocks */}
              <div className="space-y-6 font-mono text-[13px]">
                {/* 1. USERS CLUSTER */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-blue-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedEntityId('users')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[13px] transition-all cursor-pointer flex items-center gap-2 ${
                        selectedEntityId === 'users'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      <span>USERS</span>
                    </button>
                    <span className="text-[11px] text-slate-400">Root Authentication & Roles</span>
                  </div>

                  <div className="pl-6 border-l-2 border-blue-500/30 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-slate-500">├──</span>
                      <button
                        onClick={() => setSelectedEntityId('user_roles')}
                        className={`px-2.5 py-1 rounded-md text-[12px] cursor-pointer ${
                          selectedEntityId === 'user_roles' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        USER_ROLES
                      </button>
                      <span className="text-slate-500">──</span>
                      <button
                        onClick={() => setSelectedEntityId('roles')}
                        className={`px-2.5 py-1 rounded-md text-[12px] cursor-pointer ${
                          selectedEntityId === 'roles' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        ROLES
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-slate-500">├──</span>
                      <button
                        onClick={() => setSelectedEntityId('school_members')}
                        className={`px-2.5 py-1 rounded-md text-[12px] cursor-pointer ${
                          selectedEntityId === 'school_members' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        SCHOOL_MEMBERS
                      </button>
                      <span className="text-slate-500">──</span>
                      <button
                        onClick={() => setSelectedEntityId('schools')}
                        className={`px-2.5 py-1 rounded-md text-[12px] cursor-pointer ${
                          selectedEntityId === 'schools' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        SCHOOLS
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-slate-500">└──</span>
                      <button
                        onClick={() => setSelectedEntityId('industry_members')}
                        className={`px-2.5 py-1 rounded-md text-[12px] cursor-pointer ${
                          selectedEntityId === 'industry_members' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        INDUSTRY_MEMBERS
                      </button>
                      <span className="text-slate-500">──</span>
                      <button
                        onClick={() => setSelectedEntityId('industries')}
                        className={`px-2.5 py-1 rounded-md text-[12px] cursor-pointer ${
                          selectedEntityId === 'industries' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        INDUSTRIES
                      </button>
                      <span className="text-slate-500">──</span>
                      <button
                        onClick={() => setSelectedEntityId('industry_units')}
                        className={`px-2.5 py-1 rounded-md text-[12px] cursor-pointer ${
                          selectedEntityId === 'industry_units' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        INDUSTRY_UNITS
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. SCHOOLS & INTERNSHIP COHORT CLUSTER */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedEntityId('schools')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[13px] transition-all cursor-pointer flex items-center gap-2 ${
                        selectedEntityId === 'schools'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">school</span>
                      <span>SCHOOLS</span>
                    </button>
                    <span className="text-[11px] text-slate-400">Institutional Tenants & Programs</span>
                  </div>

                  <div className="pl-6 border-l-2 border-emerald-500/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">└──</span>
                      <button
                        onClick={() => setSelectedEntityId('internship_programs')}
                        className={`px-2.5 py-1 rounded-md text-[12px] font-bold cursor-pointer ${
                          selectedEntityId === 'internship_programs' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        INTERNSHIP_PROGRAMS
                      </button>
                    </div>

                    <div className="pl-6 border-l-2 border-emerald-500/20 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-500">├──</span>
                        <button
                          onClick={() => setSelectedEntityId('program_competencies')}
                          className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                            selectedEntityId === 'program_competencies' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          PROGRAM_COMPETENCIES
                        </button>
                        <span className="text-slate-500">──</span>
                        <button
                          onClick={() => setSelectedEntityId('competencies')}
                          className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                            selectedEntityId === 'competencies' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          COMPETENCIES
                        </button>
                        <span className="text-slate-500">──</span>
                        <button
                          onClick={() => setSelectedEntityId('competency_versions')}
                          className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                            selectedEntityId === 'competency_versions' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          COMPETENCY_VERSIONS
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-500">├──</span>
                        <button
                          onClick={() => setSelectedEntityId('program_mentors')}
                          className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                            selectedEntityId === 'program_mentors' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          PROGRAM_MENTORS
                        </button>
                        <span className="text-slate-500">──</span>
                        <button
                          onClick={() => setSelectedEntityId('users')}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-800/60 text-slate-400 hover:text-white"
                        >
                          USERS
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-slate-500">├──</span>
                        <button
                          onClick={() => setSelectedEntityId('applications')}
                          className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                            selectedEntityId === 'applications' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          APPLICATIONS
                        </button>
                        <span className="text-slate-500">──</span>
                        <button
                          onClick={() => setSelectedEntityId('students')}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-800/60 text-slate-400 hover:text-white"
                        >
                          STUDENTS
                        </button>
                      </div>

                      {/* PLACEMENTS SUBTREE */}
                      <div className="flex flex-col gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">└──</span>
                          <button
                            onClick={() => setSelectedEntityId('placements')}
                            className={`px-3 py-1 rounded-md text-[12px] font-bold border cursor-pointer ${
                              selectedEntityId === 'placements'
                                ? 'bg-amber-600 text-white border-amber-400'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                            }`}
                          >
                            PLACEMENTS (Core Operational)
                          </button>
                        </div>

                        <div className="pl-6 border-l-2 border-amber-500/30 space-y-1.5 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">├──</span>
                            <button
                              onClick={() => setSelectedEntityId('attendance')}
                              className={`px-2 py-0.5 rounded cursor-pointer ${
                                selectedEntityId === 'attendance' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              ATTENDANCE (Geofence Logs)
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">├──</span>
                            <button
                              onClick={() => setSelectedEntityId('journals')}
                              className={`px-2 py-0.5 rounded cursor-pointer ${
                                selectedEntityId === 'journals' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              JOURNALS
                            </button>
                            <span className="text-slate-500">──</span>
                            <button
                              onClick={() => setSelectedEntityId('journal_evidence')}
                              className={`px-2 py-0.5 rounded cursor-pointer ${
                                selectedEntityId === 'journal_evidence' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              JOURNAL_EVIDENCE
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">├──</span>
                            <button
                              onClick={() => setSelectedEntityId('student_competencies')}
                              className={`px-2 py-0.5 rounded cursor-pointer ${
                                selectedEntityId === 'student_competencies' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              STUDENT_COMPETENCIES
                            </button>
                            <span className="text-slate-500">──</span>
                            <button
                              onClick={() => setSelectedEntityId('competency_evidence')}
                              className={`px-2 py-0.5 rounded cursor-pointer ${
                                selectedEntityId === 'competency_evidence' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              COMPETENCY_EVIDENCE
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">├──</span>
                            <button
                              onClick={() => setSelectedEntityId('supervisions')}
                              className={`px-2 py-0.5 rounded cursor-pointer ${
                                selectedEntityId === 'supervisions' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              SUPERVISIONS
                            </button>
                            <span className="text-slate-500">──</span>
                            <button
                              onClick={() => setSelectedEntityId('supervision_actions')}
                              className={`px-2 py-0.5 rounded cursor-pointer ${
                                selectedEntityId === 'supervision_actions' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              SUPERVISION_ACTIONS
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">├──</span>
                            <button
                              onClick={() => setSelectedEntityId('assessments')}
                              className={`px-2 py-0.5 rounded cursor-pointer ${
                                selectedEntityId === 'assessments' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              ASSESSMENTS
                            </button>
                            <span className="text-slate-500">──</span>
                            <button
                              onClick={() => setSelectedEntityId('assessment_scores')}
                              className={`px-2 py-0.5 rounded cursor-pointer ${
                                selectedEntityId === 'assessment_scores' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              ASSESSMENT_SCORES
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">└──</span>
                            <button
                              onClick={() => setSelectedEntityId('placement_history')}
                              className={`px-2 py-0.5 rounded cursor-pointer ${
                                selectedEntityId === 'placement_history' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              PLACEMENT_HISTORY
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. STUDENTS & VERIFICATION CLUSTER */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedEntityId('students')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[13px] transition-all cursor-pointer flex items-center gap-2 ${
                        selectedEntityId === 'students'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">badge</span>
                      <span>STUDENTS</span>
                    </button>
                    <span className="text-[11px] text-slate-400">Student Profile Extensions</span>
                  </div>

                  <div className="pl-6 border-l-2 border-purple-500/30 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">├──</span>
                      <button
                        onClick={() => setSelectedEntityId('student_profiles')}
                        className={`px-2.5 py-1 rounded-md text-[12px] cursor-pointer ${
                          selectedEntityId === 'student_profiles' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        STUDENT_PROFILES (1:1 PK/FK)
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">└──</span>
                      <button
                        onClick={() => setSelectedEntityId('program_majors')}
                        className={`px-2.5 py-1 rounded-md text-[12px] cursor-pointer ${
                          selectedEntityId === 'program_majors' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        PROGRAM_MAJORS
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. CERTIFICATES & AUDIT CLUSTER */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedEntityId('certificates')}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[13px] transition-all cursor-pointer flex items-center gap-2 ${
                          selectedEntityId === 'certificates'
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>CERTIFICATES</span>
                      </button>
                      <span className="text-slate-500">──</span>
                      <button
                        onClick={() => setSelectedEntityId('certificate_verifications')}
                        className={`px-2.5 py-1 rounded-md text-[12px] cursor-pointer ${
                          selectedEntityId === 'certificate_verifications' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        CERTIFICATE_VERIFICATIONS
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400">QR Verification & Anti-fraud</span>
                  </div>
                </div>

                {/* 5. SYSTEM & AUDIT LOGS */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedEntityId('notifications')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[12px] cursor-pointer ${
                        selectedEntityId === 'notifications' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      NOTIFICATIONS
                    </button>
                    <button
                      onClick={() => setSelectedEntityId('audit_logs')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[12px] cursor-pointer ${
                        selectedEntityId === 'audit_logs' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      AUDIT_LOGS (JSONB)
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">System Logs & Event Tracking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Selected Entity Inspector */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/80 shadow-xl space-y-4 sticky top-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {selectedEntity.group}
                  </span>
                  <h4 className="text-[20px] font-black text-white font-mono mt-1">
                    {selectedEntity.name}
                  </h4>
                </div>
                <button
                  onClick={() => setActiveTab('data_dictionary')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold"
                >
                  Lihat Dictionary
                </button>
              </div>

              <p className="text-[13px] text-slate-300 leading-relaxed">
                {selectedEntity.description}
              </p>

              {/* Columns Quick Preview */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Struktur Kolom ({selectedEntity.columns.length})
                </div>
                <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                  {selectedEntity.columns.map((col) => (
                    <div
                      key={col.name}
                      className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[12px] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5 font-mono">
                        {col.isPk && <span className="text-amber-400 text-[11px] font-bold">PK</span>}
                        {col.isFk && <span className="text-indigo-400 text-[11px] font-bold">FK</span>}
                        <span className="text-slate-200 font-bold">{col.name}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {col.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Foreign Key Relations */}
              {relatedForeignKeys.length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    Relasi Terhubung ({relatedForeignKeys.length})
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    {relatedForeignKeys.map((rel, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-slate-950/40 border border-slate-800/60 flex items-center justify-between font-mono"
                      >
                        <div className="flex items-center gap-1 text-slate-300">
                          <span className="text-blue-400">{rel.fromTable}.{rel.fromColumn}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-emerald-400">{rel.toTable}.{rel.toColumn}</span>
                        </div>
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 font-bold">
                          {rel.relationType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DATA DICTIONARY & COLUMN SPECS                                      */}
      {/* ========================================================================= */}
      {activeTab === 'data_dictionary' && (
        <div className="space-y-6">
          {/* Entity Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
            {filteredEntities.map((entity) => (
              <button
                key={entity.id}
                onClick={() => setSelectedEntityId(entity.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedEntity.id === entity.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30 border border-blue-400/50'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {entity.name}
              </button>
            ))}
          </div>

          {/* Detailed Entity Data Dictionary Card */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/80 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {selectedEntity.group}
                  </span>
                  <h3 className="text-[22px] font-black text-white font-mono">
                    {selectedEntity.name}
                  </h3>
                </div>
                <p className="text-[13px] text-slate-300 mt-1">
                  {selectedEntity.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-slate-400 font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                  {selectedEntity.columns.length} Total Columns
                </span>
              </div>
            </div>

            {/* Columns Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase text-slate-400 tracking-wider font-bold">
                    <th className="py-3 px-4 w-12 text-center">Key</th>
                    <th className="py-3 px-4 w-48">Column Name</th>
                    <th className="py-3 px-4 w-44">Data Type</th>
                    <th className="py-3 px-4 w-28 text-center">Nullable</th>
                    <th className="py-3 px-4 w-52">Foreign Key Ref</th>
                    <th className="py-3 px-4">Functional Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[13px]">
                  {selectedEntity.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-800/40 transition-colors">
                      {/* Key Indicators */}
                      <td className="py-3 px-4 text-center">
                        {col.isPk && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                            PK
                          </span>
                        )}
                        {col.isFk && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">
                            FK
                          </span>
                        )}
                        {!col.isPk && !col.isFk && <span className="text-slate-600">—</span>}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {col.name}
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4 font-mono text-[12px] text-blue-300">
                        {col.type}
                      </td>

                      {/* Nullable */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            col.isNullable
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {col.isNullable ? 'YES' : 'NO'}
                        </span>
                      </td>

                      {/* FK Ref */}
                      <td className="py-3 px-4 font-mono text-[12px] text-indigo-300">
                        {col.fkRef ? col.fkRef : <span className="text-slate-600">—</span>}
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 text-slate-300 text-[12px]">
                        {col.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: RELATIONAL MAPPING & FK MATRIX                                      */}
      {/* ========================================================================= */}
      {activeTab === 'relations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">sync_alt</span>
              <span>Foreign Key Mapping & Cardinality Matrix</span>
            </h3>
            <span className="text-[12px] text-slate-400">
              Total {ERD_RELATIONS.length} Relasi Kunci Antartabel
            </span>
          </div>

          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase text-slate-400 tracking-wider font-bold">
                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                    <th className="py-3.5 px-4 w-52">Source (Child Table.FK)</th>
                    <th className="py-3.5 px-4 w-28 text-center">Type</th>
                    <th className="py-3.5 px-4 w-52">Target (Parent Table.PK)</th>
                    <th className="py-3.5 px-4">Deskripsi Relasi Bisnis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[13px]">
                  {ERD_RELATIONS.map((rel, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-[12px] text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                        {rel.fromTable}.{rel.fromColumn}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] font-bold text-amber-300">
                          {rel.relationType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        {rel.toTable}.{rel.toColumn}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 text-[12px]">
                        {rel.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: POSTGRESQL / SUPABASE DDL CODE                                      */}
      {/* ========================================================================= */}
      {activeTab === 'sql_ddl' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">code</span>
                <span>PostgreSQL / Supabase Schema DDL Script</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                UUID v4 & UTC Ready
              </span>
            </div>

            <button
              onClick={handleCopySql}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-[12px] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Tersalin' : 'Salin Script'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl font-mono text-[12px] overflow-x-auto text-slate-300 leading-relaxed max-h-[600px]">
            <pre className="text-emerald-400/90 whitespace-pre">{SQL_SCHEMA_DDL}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
