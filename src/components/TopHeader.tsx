import React, { useState } from 'react';
import { UserRole, AuthUser } from '../types';
import { ROLES_ARRAY, ROLES_CONFIG, normalizeRole } from '../data/rolesData';

interface TopHeaderProps {
  currentRole: UserRole;
  currentUser?: AuthUser | null;
  mobileSidebarOpen: boolean;
  onRoleChange: (role: UserRole) => void;
  onToggleMobileSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNotifications: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  onLogout?: () => void;
  unreadCount: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentRole,
  currentUser,
  mobileSidebarOpen,
  onRoleChange,
  onToggleMobileSidebar,
  searchQuery,
  onSearchChange,
  onOpenNotifications,
  onOpenHelp,
  onOpenSettings,
  onLogout,
  unreadCount,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const normalized = normalizeRole(currentRole);
  const roleCfg = ROLES_CONFIG[normalized] || ROLES_CONFIG.school_admin;

  // Determine user's authorized database roles
  const userAssignedRoles: UserRole[] = currentUser?.availableRoles && currentUser.availableRoles.length > 0
    ? currentUser.availableRoles.map(normalizeRole)
    : [normalized];
  const hasMultipleRoles = userAssignedRoles.length > 1;

  return (
    <header
      id="top-navbar"
      className="app-topbar bg-white text-slate-900 sticky top-0 z-40 border-b border-slate-200 h-[58px] w-full flex-shrink-0"
    >
      <div className="flex justify-between items-center h-full px-4 md:px-6 w-full max-w-[1440px] mx-auto gap-4">
        {/* Left: Mobile Toggle & Tenant Information */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onToggleMobileSidebar}
            aria-controls="main-sidebar"
            aria-expanded={mobileSidebarOpen}
            className="md:hidden p-2 text-slate-300 hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          {/* Role / Tenant Badge */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-bold text-emerald-800 leading-none">
                AKTARA
              </span>
              <span className="app-role-badge hidden sm:inline-block">
                {roleCfg.title}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {currentUser?.organization || roleCfg.organization}
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="app-search hidden lg:flex items-center bg-slate-50 px-3 py-1.5 rounded-lg w-72 xl:w-96 border border-slate-200 focus-within:border-emerald-700 transition-colors">
          <span className="material-symbols-outlined text-slate-400 mr-2 text-[18px]">
            search
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Cari dalam peran ${roleCfg.title}...`}
            className="bg-transparent border-none outline-none text-[12px] w-full placeholder-slate-400 text-white p-0 focus:ring-0"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-slate-400 hover:text-white text-[13px] p-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Right Actions: Role Selector Dropdown, Notifications, Profile & Logout */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick RBAC Role Dropdown Switcher */}
          <div className="relative">
            <button
              id="top-role-selector-btn"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              aria-expanded={roleMenuOpen}
              aria-haspopup="menu"
              className="app-role-selector flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-[12px] font-medium cursor-pointer transition-colors"
              title="Ganti Peran Pengguna (RBAC Switcher)"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-700">
                {roleCfg.icon}
              </span>
              <span className="hidden md:inline">{roleCfg.title}</span>
              <span className="material-symbols-outlined text-[16px] text-slate-400">
                arrow_drop_down
              </span>
            </button>

            {roleMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setRoleMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 z-40 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl p-1.5 max-h-84 overflow-y-auto hide-scrollbar backdrop-blur-2xl animate-fade-in space-y-1">
                  {hasMultipleRoles && (
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[14px]">badge</span>
                        <span>Role Terotorisasi Akun Ini</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Akun Anda memiliki {userAssignedRoles.length} role terdaftar di database.
                      </p>
                    </div>
                  )}

                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {hasMultipleRoles ? 'Pilih Role Aktif' : 'Ganti Role Akses (RBAC)'}
                  </div>

                  {ROLES_ARRAY.map((r) => {
                    const isSelected = normalized === r.id;
                    const isUserAssigned = userAssignedRoles.includes(r.id);

                    return (
                      <button
                        key={r.id}
                        type="button"
                        id={`role-select-${r.id}`}
                        onClick={() => {
                          onRoleChange(r.id);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/25 text-white font-bold border border-blue-500/40'
                            : isUserAssigned
                            ? 'bg-slate-800/50 hover:bg-slate-800 text-slate-200'
                            : 'hover:bg-slate-800/40 text-slate-400'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">{r.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[12px] font-bold truncate leading-tight">{r.title}</p>
                            {isUserAssigned && (
                              <span className="text-[8px] font-bold px-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                                DB
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{r.shortDesc}</p>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-blue-400 text-[16px]">
                            check
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Notifications Button */}
          <button
            id="top-notifications-btn"
            onClick={onOpenNotifications}
            className="p-2 text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors rounded-xl relative cursor-pointer"
            title="Notifikasi"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#070d1e]"></span>
            )}
          </button>

          {/* User Profile Avatar with dropdown */}
          <div className="relative">
            <button
              id="top-profile-avatar-btn"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/40 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-600 bg-slate-800">
                <img
                  src={currentUser?.avatar || roleCfg.avatar}
                  alt={currentUser?.name || roleCfg.defaultName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>

            {profileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 z-40 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl p-2.5 backdrop-blur-2xl animate-fade-in space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                    <p className="text-[13px] font-bold text-white leading-tight">
                      {currentUser?.name || roleCfg.defaultName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {currentUser?.email || roleCfg.defaultEmail}
                    </p>
                    <div className="mt-2 inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      {roleCfg.title}
                    </div>
                  </div>

                  <div className="space-y-1 text-[12px] pt-1">
                    <button
                      onClick={() => {
                        onOpenSettings();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-400">
                        manage_accounts
                      </span>
                      <span>Pengaturan Akun</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenHelp();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-slate-400">
                        help
                      </span>
                      <span>Bantuan & Panduan</span>
                    </button>

                    {onLogout && (
                      <button
                        id="profile-logout-btn"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full px-3 py-2 rounded-xl text-left text-rose-300 hover:bg-rose-500/20 flex items-center gap-2 cursor-pointer transition-colors border-t border-slate-800 font-semibold"
                      >
                        <span className="material-symbols-outlined text-[18px] text-rose-400">
                          logout
                        </span>
                        <span>Keluar / Ganti Akun</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
