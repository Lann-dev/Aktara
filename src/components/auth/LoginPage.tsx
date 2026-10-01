import React, { useState } from 'react';
import { UserRole, AuthUser } from '../../types';
import { ROLES_ARRAY, ROLES_CONFIG, normalizeRole } from '../../data/rolesData';
import { ASSETS } from '../../data/mockData';
import { SupabaseAuthService, DB_USER_PROFILES } from '../../services/authService';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  initialRole = 'school_admin',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState(ROLES_CONFIG[initialRole]?.defaultEmail || 'admin@smkn1jakarta.sch.id');
  const [password, setPassword] = useState('aktara@2024');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mismatchData, setMismatchData] = useState<{
    dbRole?: UserRole;
    selectedRole?: UserRole;
    tenantName?: string;
  } | null>(null);

  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showSecurityInspector, setShowSecurityInspector] = useState(false);
  const [showFlowDiagram, setShowFlowDiagram] = useState(false);

  // Handle role helper change from dropdown or demo buttons
  const handleSelectRole = (roleKey: UserRole) => {
    setSelectedRole(roleKey);
    const cfg = ROLES_CONFIG[roleKey];
    if (cfg) {
      setEmail(cfg.defaultEmail);
      setPassword('aktara@2024');
      setErrorMessage('');
      setMismatchData(null);
    }
    setIsDropdownOpen(false);
  };

  const currentRoleCfg = ROLES_CONFIG[selectedRole] || ROLES_CONFIG.school_admin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setMismatchData(null);
    setAuthStep('');

    if (!email.trim()) {
      setErrorMessage('Invalid email/password');
      return;
    }

    if (!password) {
      setErrorMessage('Invalid email/password');
      return;
    }

    setIsLoading(true);

    try {
      /**
       * AUTHENTICATION FLOW PIPELINE:
       * 1. Supabase Auth (Verify credentials)
       * 2. Authentication successful check
       * 3. Get authenticated user
       * 4. Get user roles (Database query)
       * 5. Validate selected role (Compare frontend selection with DB role)
       * 6. Determine tenant (Retrieve associated tenant/organization)
       * 7. Redirect to authenticated role workspace
       */
      const authResult = await SupabaseAuthService.authenticateWithRoleValidation(
        email,
        password,
        selectedRole,
        (step) => {
          if (step === 'auth') setAuthStep('Memverifikasi Supabase Auth...');
          else if (step === 'get_user') setAuthStep('Mengekstrak authenticated user...');
          else if (step === 'get_roles') setAuthStep('Mengambil user roles dari database...');
          else if (step === 'validate_role') setAuthStep('Memvalidasi role yang dipilih...');
          else if (step === 'determine_tenant') setAuthStep('Menentukan tenant organisasi...');
          else if (step === 'redirect') setAuthStep('Mengalihkan ke dashboard...');
        }
      );

      setIsLoading(false);
      setAuthStep('');

      if (!authResult.success) {
        // Handle failures: "Invalid email/password" or "Role tidak sesuai dengan akun."
        setErrorMessage(authResult.error || 'Invalid email/password');
        if (authResult.errorCode === 'ROLE_MISMATCH') {
          setMismatchData({
            dbRole: authResult.dbRole,
            selectedRole: authResult.selectedRole,
            tenantName: authResult.tenantName,
          });
        }
        return;
      }

      if (authResult.user) {
        authResult.user.rememberMe = rememberMe;
        onLoginSuccess(authResult.user);
      }
    } catch (err: any) {
      setIsLoading(false);
      setAuthStep('');
      setErrorMessage(err?.message || 'Invalid email/password');
    }
  };

  // Quick fix button when mismatch occurs: auto-sync selector to authoritative database role
  const handleResolveMismatch = () => {
    if (mismatchData?.dbRole) {
      setSelectedRole(mismatchData.dbRole);
      setErrorMessage('');
      setMismatchData(null);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setForgotPasswordOpen(false);
      setResetEmail('');
    }, 2500);
  };

  return (
    <div className="login-page min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic ambient radial glows */}
      {/* Main Container */}
      <div className="w-full max-w-lg my-auto relative z-10 animate-fade-in py-6">
        {/* Brand Header Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-950/60 border border-blue-500/30 p-2 shadow-2xl backdrop-blur-xl mb-3 shadow-blue-950/40 ring-1 ring-blue-500/20">
            <img
              src={ASSETS.logo}
              alt="AKTARA Logo"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-[28px] font-black text-white tracking-tight leading-tight flex items-center justify-center gap-2">
            Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-slate-100">AKTARA</span>
          </h1>
          <p className="text-[13px] text-slate-400 mt-1.5 max-w-sm mx-auto">
            Platform Manajemen Magang & Praktik Kerja Lapangan Vokasi Terintegrasi
          </p>

          {/* Security Rule Notice Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-[11px] text-blue-300 font-medium">
            <span className="material-symbols-outlined text-[14px] text-blue-400">verified_user</span>
            <span>Supabase Auth & Database Role Validation Active</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card glass-card rounded-3xl p-6 sm:p-8">
          {/* Security Mismatch Alert Banner */}
          {errorMessage && (
            <div
              id="login-error-alert"
              className="mb-5 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-100 text-[13px] shadow-lg animate-fade-in"
            >
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[22px] text-rose-400 shrink-0 mt-0.5">
                  gpp_bad
                </span>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <p className="font-bold text-[14px] text-rose-200">{errorMessage}</p>
                  
                  {mismatchData && (
                    <div className="mt-2.5 pt-2.5 border-t border-rose-500/30 text-[12px] space-y-1.5 text-rose-200/90">
                      <div className="flex justify-between items-center bg-black/30 p-2 rounded-xl border border-rose-500/20">
                        <span className="text-slate-400">Role yang Anda pilih (UX Helper):</span>
                        <span className="font-bold text-amber-300">
                          {ROLES_CONFIG[mismatchData.selectedRole || '']?.title || mismatchData.selectedRole}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-black/30 p-2 rounded-xl border border-rose-500/20">
                        <span className="text-slate-400">Role akun di Database:</span>
                        <span className="font-black text-emerald-300">
                          {ROLES_CONFIG[mismatchData.dbRole || '']?.title || mismatchData.dbRole}
                        </span>
                      </div>
                      {mismatchData.tenantName && (
                        <div className="flex justify-between items-center bg-black/30 p-2 rounded-xl border border-rose-500/20">
                          <span className="text-slate-400">Tenant Terverifikasi:</span>
                          <span className="font-medium text-white truncate max-w-[200px]">
                            {mismatchData.tenantName}
                          </span>
                        </div>
                      )}

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={handleResolveMismatch}
                          className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-[12px] shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                          <span>
                            Ubah Selector ke {ROLES_CONFIG[mismatchData.dbRole || '']?.title} & Masuk
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector Custom Dropdown (UX Helper) */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Role Selector <span className="text-blue-400 font-normal text-[10px]">(UX Helper Saja)</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Divalidasi DB</span>
              </div>

              {/* Selected Trigger Button */}
              <button
                type="button"
                id="role-selector-trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3.5 py-2.5 bg-slate-800/60 hover:bg-slate-800 active:bg-slate-750 border border-slate-700 focus:border-blue-500 rounded-2xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {currentRoleCfg.icon}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-white truncate">
                        {currentRoleCfg.title}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-700/80 text-slate-300 border border-slate-600 uppercase">
                        {currentRoleCfg.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentRoleCfg.shortDesc}
                    </p>
                  </div>
                </div>

                <span
                  className={`material-symbols-outlined text-slate-400 group-hover:text-white transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu Items */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-2 z-40 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl p-1.5 max-h-72 overflow-y-auto hide-scrollbar backdrop-blur-2xl animate-fade-in divide-y divide-slate-800">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Pilih Role Target (UX Helper)
                    </div>
                    {ROLES_ARRAY.map((role) => {
                      const isSelected = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          id={`role-option-${role.id}`}
                          onClick={() => handleSelectRole(role.id)}
                          className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600/25 border border-blue-500/40 text-white'
                              : 'hover:bg-slate-800/60 text-slate-300'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {role.icon}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[13px] font-bold text-white truncate">
                                {role.title}
                              </span>
                              <span className="text-[9px] font-medium text-slate-400 uppercase">
                                {role.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                              {role.shortDesc}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="material-symbols-outlined text-blue-400 text-[18px] shrink-0 mt-1">
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

            {/* Email / NISN / NIP Input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Alamat Email / NISN / NIP
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px] pointer-events-none">
                  mail
                </span>
                <input
                  type="text"
                  required
                  id="login-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@smkn1jakarta.sch.id"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700 focus:border-blue-500 focus:bg-slate-900 rounded-2xl text-[13px] text-white placeholder:text-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input with Toggle Show/Hide */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-semibold cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px] pointer-events-none">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  id="login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700 focus:border-blue-500 focus:bg-slate-900 rounded-2xl text-[13px] text-white placeholder:text-slate-500 outline-none transition-all"
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[12px] text-slate-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  id="login-remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md bg-slate-800 border-slate-600 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-blue-600"
                />
                <span>Ingat saya di perangkat ini</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-[14px] rounded-2xl shadow-xl shadow-blue-950/60 border border-blue-400/30 cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-75 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span className="text-[13px] font-medium tracking-wide text-white">
                    {authStep || 'Memproses Otentikasi...'}
                  </span>
                </>
              ) : (
                <>
                  <span>Masuk ke Portal AKTARA</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Role Switcher & Flow Inspector */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Akses Cepat Pengujian Role
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFlowDiagram(!showFlowDiagram)}
                  className="text-[10px] text-sky-400 hover:text-sky-300 font-semibold cursor-pointer flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">account_tree</span>
                  <span>{showFlowDiagram ? 'Tutup Flow' : 'Lihat Flow'}</span>
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => setShowSecurityInspector(!showSecurityInspector)}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">security</span>
                  <span>{showSecurityInspector ? 'Tutup Uji' : 'Uji Mismatch'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {ROLES_ARRAY.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleSelectRole(r.id)}
                  className={`px-2 py-1.5 rounded-xl text-[11px] font-medium border flex items-center gap-1.5 transition-all truncate cursor-pointer ${
                    selectedRole === r.id
                      ? 'bg-blue-600/30 border-blue-500/50 text-white font-bold'
                      : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                  }`}
                  title={`${r.title} - ${r.shortDesc}`}
                >
                  <span className="material-symbols-outlined text-[14px] text-blue-400 shrink-0">
                    {r.icon}
                  </span>
                  <span className="truncate">{r.title}</span>
                </button>
              ))}
            </div>

            {/* Authentication Flow Diagram Visualization */}
            {showFlowDiagram && (
              <div className="mt-4 p-4 rounded-2xl bg-[#090d1f] border border-sky-500/30 text-[12px] space-y-3 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-sky-300 font-bold">
                    <span className="material-symbols-outlined text-[18px]">schema</span>
                    <span>Authentication Flow Architecture</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono">
                    Supabase RBAC
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px] text-slate-200">
                  <div className="p-1.5 rounded bg-slate-800/50 flex items-center gap-2">
                    <span className="text-sky-400 font-bold">/login</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-slate-300">Enter email & password</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-blue-300">Select role (UX helper)</span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-800/50 flex items-center gap-2">
                    <span className="text-blue-400 font-bold">Supabase Auth</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-amber-300">Authentication successful?</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pl-2 text-[10px]">
                    <div className="p-1.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300">
                      ❌ Gagal: <span className="font-bold">Invalid email/password</span>
                    </div>
                    <div className="p-1.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      ✓ Sukses: Get authenticated user
                    </div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-800/50 flex items-center gap-2">
                    <span className="text-blue-400 font-bold">Get user roles</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-amber-300">Validate selected role</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pl-2 text-[10px]">
                    <div className="p-1.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300">
                      ❌ Mismatch: <span className="font-bold">Role tidak sesuai dengan akun.</span>
                    </div>
                    <div className="p-1.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      ✓ Match: Determine tenant & Redirect
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Security Mismatch Tester Box */}
            {showSecurityInspector && (
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[12px] space-y-2.5 animate-fade-in">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Simulasi Uji Keamanan (Security Guard Test)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Coba skenario mismatch di bawah untuk membuktikan bahwa frontend role selector tidak dipercayai secara membabi-buta, dan login akan ditolak jika berbeda dengan role database:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('school_admin'); // UX helper: Admin Sekolah
                      setEmail('alex.mercer@siswa.smkn1jakarta.sch.id'); // Database: Siswa
                      setPassword('aktara@2024');
                      setErrorMessage('');
                      setMismatchData(null);
                    }}
                    className="p-2 text-left bg-black/40 hover:bg-black/60 border border-amber-500/30 rounded-xl text-[11px] cursor-pointer transition-all"
                  >
                    <span className="font-bold text-amber-300 block">Uji 1: Siswa coba jadi Admin</span>
                    <span className="text-slate-400 text-[10px]">
                      Selector: Admin Sekolah • Akun DB: Siswa
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('teacher_mentor'); // UX helper: Guru Pembimbing
                      setEmail('superadmin@aktara.id'); // Database: Super Admin
                      setPassword('aktara@2024');
                      setErrorMessage('');
                      setMismatchData(null);
                    }}
                    className="p-2 text-left bg-black/40 hover:bg-black/60 border border-amber-500/30 rounded-xl text-[11px] cursor-pointer transition-all"
                  >
                    <span className="font-bold text-amber-300 block">Uji 2: Admin coba jadi Guru</span>
                    <span className="text-slate-400 text-[10px]">
                      Selector: Guru • Akun DB: Super Admin
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-[11px] text-slate-400 space-y-1">
          <p>© 2026 AKTARA Vocational Suite • Terakreditasi Kemendikbudristek RI</p>
          <p className="text-[10px] text-slate-500">
            Sistem Informasi Magang & Praktik Kerja Lapangan Vokasi Terpadu
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="glass-card rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-700 text-white bg-[#0f172a]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">lock_reset</span>
                <h3 className="text-[16px] font-bold text-white">Reset Kata Sandi</h3>
              </div>
              <button
                onClick={() => setForgotPasswordOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {resetSent ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
                </div>
                <h4 className="font-bold text-white">Tautan Reset Terkirim!</h4>
                <p className="text-[12px] text-slate-400">
                  Instruksi pemulihan kata sandi telah dikirimkan ke email Anda. Silakan periksa kotak masuk atau spam.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  Masukkan alamat email yang terdaftar di akun AKTARA Anda. Kami akan mengirimkan tautan verifikasi untuk membuat kata sandi baru.
                </p>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Akun
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="nama@sekolah.sch.id"
                    className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-[13px] text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[13px] font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-950/50 cursor-pointer"
                  >
                    Kirim Tautan Reset
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
