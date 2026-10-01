import React from 'react';
import { UserRole, NavTab, AuthUser } from '../types';
import { ROLES_CONFIG, normalizeRole, ROLE_NAVIGATIONS, getFullRoute } from '../data/rolesData';
import { ASSETS } from '../data/mockData';

interface SidebarProps {
  currentRole: UserRole;
  currentUser?: AuthUser | null;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenNewPlacement: () => void;
  onLogout?: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentUser,
  activeTab,
  onTabChange,
  onOpenNewPlacement,
  onLogout,
  mobileOpen,
  onCloseMobile,
}) => {
  const normalized = normalizeRole(currentRole);
  const roleCfg = ROLES_CONFIG[normalized] || ROLES_CONFIG.school_admin;
  const isReadOnly = normalized === 'viewer_dinas';

  const navItems = ROLE_NAVIGATIONS[normalized] || ROLE_NAVIGATIONS.school_admin;

  const handleNavClick = (tabId: NavTab) => {
    onTabChange(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity duration-200"
        />
      )}

      <aside
        id="main-sidebar"
        className={`app-sidebar fixed top-0 left-0 bottom-0 w-[250px] bg-white text-slate-600 flex flex-col py-4 px-3 space-y-2 z-50 transition-transform duration-200 ease-out border-r border-slate-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center gap-3 px-3 mb-2 pt-1">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-blue-950/60 flex items-center justify-center border border-blue-500/30 shadow-md backdrop-blur-md">
            <img
              src={ASSETS.logo}
              alt="AKTARA Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-[18px] font-bold text-slate-900 leading-tight">
              AKTARA
            </h1>
            <p className="text-[10px] font-semibold text-slate-500 uppercase truncate">
              {roleCfg.title}
            </p>
          </div>
        </div>

        {/* User Card in Sidebar */}
        <div className="mx-1 mb-2 p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-600 bg-slate-800">
            <img
              src={currentUser?.avatar || roleCfg.avatar}
              alt={currentUser?.name || roleCfg.defaultName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-bold text-white truncate leading-tight">
              {currentUser?.name || roleCfg.defaultName}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentUser?.organization || roleCfg.organization}
            </p>
          </div>
        </div>

        {/* Action Button tailored to role or Read-Only banner for Viewer Dinas */}
        <div className="px-1 mb-2">
          {isReadOnly ? (
              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-700 text-[11px] font-semibold uppercase">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Mode Read-Only</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Akses hanya lihat</p>
            </div>
          ) : (
            <button
              id="sidebar-new-placement-btn"
              onClick={onOpenNewPlacement}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-700 active:scale-[0.98] text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-[13px] font-bold transition-all shadow-lg shadow-blue-950/50 cursor-pointer border border-blue-400/30"
            >
              <span className="material-symbols-outlined text-[18px]">
                {normalized === 'student'
                  ? 'edit_note'
                  : normalized === 'industry_mentor'
                  ? 'fact_check'
                  : normalized === 'teacher_mentor'
                  ? 'add_location_alt'
                  : normalized === 'super_admin'
                  ? 'add_circle'
                  : normalized === 'industry_admin'
                  ? 'person_add'
                  : 'add'}
              </span>
              <span className="truncate">
                {normalized === 'student'
                  ? 'Tulis Jurnal Harian'
                  : normalized === 'industry_mentor'
                  ? 'Review Validasi'
                  : normalized === 'teacher_mentor'
                  ? 'Catat Supervisi'
                  : normalized === 'super_admin'
                  ? 'Tambah Sekolah / DUDI'
                  : normalized === 'industry_admin'
                  ? 'Tambah Mentor'
                  : 'Tambah Penempatan'}
              </span>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-1 px-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`app-sidebar-link w-full relative flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'is-active bg-emerald-50 text-emerald-800 font-semibold border border-transparent'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-blue-400 to-cyan-400 shadow-sm shadow-cyan-400/80" />
                )}
                <div className="flex items-center gap-3 truncate">
                  <span
                    className={`material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-blue-500/25 text-blue-200 border border-blue-500/40">
                    {item.badge}
                  </span>
                ) : item.id === 'notifications' ? (
                  <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-amber-400 text-black shadow-sm">
                    3
                  </span>
                ) : item.id === 'certificate' ? (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    QR
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Footer Navigation & Logout */}
        <div className="pt-2 border-t border-slate-800 space-y-1 px-1 mt-auto">
          {onLogout && (
            <button
              id="sidebar-logout-btn"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] font-semibold tracking-wide text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-rose-400">logout</span>
              <span>Keluar (Logout)</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
