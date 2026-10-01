import React from 'react';
import { UserRole, AuthUser } from '../../types';
import { ROLES_CONFIG, normalizeRole, ROLE_ROUTES } from '../../data/rolesData';

interface UnauthorizedViewProps {
  currentUser: AuthUser;
  attemptedRoute?: string;
  onBackToDashboard: () => void;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({
  currentUser,
  attemptedRoute,
  onBackToDashboard,
}) => {
  const currentRoleNormalized = normalizeRole(currentUser.role);
  const roleCfg = ROLES_CONFIG[currentRoleNormalized] || ROLES_CONFIG.school_admin;
  const authorizedDashboard = ROLE_ROUTES[currentRoleNormalized] || '/school/dashboard';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      {/* 403 Access Denied Glass Card */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 max-w-lg w-full border border-rose-500/30 bg-[#0e1122]/90 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-950/50">
          <span className="material-symbols-outlined text-[36px]">block</span>
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
          HTTP 403 Forbidden • Access Denied
        </div>

        <h2 className="text-[22px] font-black text-white tracking-tight leading-snug">
          Anda tidak memiliki akses ke halaman ini.
        </h2>

        <p className="text-[13px] text-white/60 mt-2 leading-relaxed">
          Akun Anda terdaftar dengan role <strong className="text-violet-300">{roleCfg.title}</strong> pada tenant <strong className="text-white">{currentUser.tenantName}</strong>. Hak akses Anda dibatasi oleh kebijakan keamanan Row Level Security (RLS) dan Server Authorization Middleware.
        </p>

        {attemptedRoute && (
          <div className="mt-4 p-2.5 rounded-xl bg-black/40 border border-white/10 text-left font-mono text-[11px] space-y-1 text-white/70">
            <div className="flex justify-between text-white/40 text-[10px]">
              <span>RESOURCE DITUJU:</span>
              <span className="text-rose-400">UNAUTHORIZED</span>
            </div>
            <p className="text-rose-300 truncate">{attemptedRoute}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            id="back-to-dashboard-btn"
            onClick={onBackToDashboard}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-[13px] shadow-lg shadow-violet-900/40 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Kembali ke Dashboard ({roleCfg.title})</span>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-white/40 flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[14px] text-emerald-400">verified</span>
          <span>Sistem Proteksi RBAC AKTARA Terverifikasi</span>
        </div>
      </div>
    </div>
  );
};
