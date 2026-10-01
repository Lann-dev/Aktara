import { RoleConfig, AuthUser, UserRole, NavTab } from '../types';
import { ASSETS } from './mockData';

export interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: string;
  pathSuffix?: string;
  badge?: string | number;
}

export const ROLE_ROUTES: Record<UserRole, string> = {
  super_admin: '/admin/dashboard',
  school_admin: '/school/dashboard',
  teacher_mentor: '/school/mentor/dashboard',
  student: '/student/dashboard',
  industry_admin: '/industry/dashboard',
  industry_mentor: '/industry/mentor/dashboard',
  viewer_dinas: '/viewer/dashboard',
  admin: '/school/dashboard',
  mentor: '/industry/mentor/dashboard',
};

export const ROLE_NAVIGATIONS: Record<UserRole, NavItemConfig[]> = {
  super_admin: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', pathSuffix: '' },
    { id: 'schools', label: 'Schools', icon: 'school', pathSuffix: '/schools' },
    { id: 'industries', label: 'Industries', icon: 'domain', pathSuffix: '/industries' },
    { id: 'users', label: 'Users', icon: 'manage_accounts', pathSuffix: '/users' },
    { id: 'roles', label: 'Roles', icon: 'admin_panel_settings', pathSuffix: '/roles' },
    { id: 'competencies', label: 'Competencies', icon: 'verified', pathSuffix: '/competencies' },
    { id: 'programs', label: 'Programs', icon: 'folder_special', pathSuffix: '/programs' },
    { id: 'audit_logs', label: 'Audit Logs', icon: 'security', pathSuffix: '/audit-logs' },
    { id: 'erd', label: 'Database & ERD', icon: 'schema', pathSuffix: '/erd' },
    { id: 'settings', label: 'Settings', icon: 'settings', pathSuffix: '/settings' },
  ],
  school_admin: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', pathSuffix: '' },
    { id: 'students', label: 'Students', icon: 'group', pathSuffix: '/students' },
    { id: 'programs', label: 'Internship Programs', icon: 'folder_special', pathSuffix: '/programs' },
    { id: 'applications', label: 'Applications', icon: 'how_to_reg', pathSuffix: '/applications', badge: '12' },
    { id: 'placements', label: 'Placements', icon: 'work_history', pathSuffix: '/placements' },
    { id: 'industries', label: 'Industries', icon: 'domain', pathSuffix: '/industries' },
    { id: 'mentors', label: 'Mentors', icon: 'badge', pathSuffix: '/mentors' },
    { id: 'supervision', label: 'Supervision', icon: 'domain_verification', pathSuffix: '/supervision' },
    { id: 'assessments', label: 'Assessments', icon: 'assignment', pathSuffix: '/assessments' },
    { id: 'reports', label: 'Reports', icon: 'analytics', pathSuffix: '/reports' },
    { id: 'audit_logs', label: 'Audit Logs', icon: 'security', pathSuffix: '/audit-logs' },
    { id: 'erd', label: 'Database & ERD', icon: 'schema', pathSuffix: '/erd' },
  ],
  teacher_mentor: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', pathSuffix: '' },
    { id: 'students', label: 'My Students', icon: 'group', pathSuffix: '/students' },
    { id: 'attendance', label: 'Attendance', icon: 'event_available', pathSuffix: '/attendance' },
    { id: 'journals', label: 'Journals', icon: 'menu_book', pathSuffix: '/journals', badge: '4' },
    { id: 'evidence', label: 'Evidence', icon: 'photo_library', pathSuffix: '/evidence' },
    { id: 'competencies', label: 'Competencies', icon: 'assessment', pathSuffix: '/competencies' },
    { id: 'supervision', label: 'Supervision', icon: 'calendar_month', pathSuffix: '/supervision' },
    { id: 'assessments', label: 'Assessment', icon: 'rate_review', pathSuffix: '/assessments' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications', pathSuffix: '/notifications', badge: '2' },
  ],
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', pathSuffix: '' },
    { id: 'profile', label: 'My Profile', icon: 'account_circle', pathSuffix: '/profile' },
    { id: 'internship', label: 'My Internship', icon: 'business_center', pathSuffix: '/internship' },
    { id: 'attendance', label: 'Attendance', icon: 'event_available', pathSuffix: '/attendance' },
    { id: 'journals', label: 'Daily Journal', icon: 'menu_book', pathSuffix: '/journals' },
    { id: 'evidence', label: 'Evidence', icon: 'attachment', pathSuffix: '/evidence' },
    { id: 'competencies', label: 'Competencies', icon: 'verified', pathSuffix: '/competencies' },
    { id: 'assessments', label: 'Assessment', icon: 'assignment', pathSuffix: '/assessments' },
    { id: 'certificate', label: 'Certificate', icon: 'workspace_premium', pathSuffix: '/certificate' },
    { id: 'portfolio', label: 'Portfolio', icon: 'style', pathSuffix: '/portfolio' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications', pathSuffix: '/notifications', badge: '3' },
  ],
  industry_admin: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', pathSuffix: '' },
    { id: 'company_profile', label: 'Company Profile', icon: 'domain', pathSuffix: '/profile' },
    { id: 'units', label: 'Industry Units', icon: 'apartment', pathSuffix: '/units' },
    { id: 'mentors', label: 'Industry Mentors', icon: 'supervisor_account', pathSuffix: '/mentors' },
    { id: 'students', label: 'Students', icon: 'group', pathSuffix: '/students' },
    { id: 'attendance', label: 'Attendance', icon: 'event_available', pathSuffix: '/attendance' },
    { id: 'journals', label: 'Journals', icon: 'menu_book', pathSuffix: '/journals' },
    { id: 'competencies', label: 'Competencies', icon: 'task_alt', pathSuffix: '/competencies' },
    { id: 'assessments', label: 'Assessments', icon: 'assignment_turned_in', pathSuffix: '/assessments' },
    { id: 'reports', label: 'Reports', icon: 'summarize', pathSuffix: '/reports' },
  ],
  industry_mentor: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', pathSuffix: '' },
    { id: 'students', label: 'My Students', icon: 'group', pathSuffix: '/students' },
    { id: 'attendance', label: 'Attendance', icon: 'event_available', pathSuffix: '/attendance' },
    { id: 'journals', label: 'Journal Review', icon: 'fact_check', pathSuffix: '/journals', badge: '8' },
    { id: 'evidence', label: 'Evidence Review', icon: 'receipt_long', pathSuffix: '/evidence', badge: '5' },
    { id: 'competencies', label: 'Competencies', icon: 'verified', pathSuffix: '/competencies' },
    { id: 'assessments', label: 'Assessment', icon: 'assignment', pathSuffix: '/assessments' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications', pathSuffix: '/notifications', badge: '4' },
  ],
  viewer_dinas: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', pathSuffix: '' },
    { id: 'schools', label: 'Schools', icon: 'school', pathSuffix: '/schools' },
    { id: 'industries', label: 'Industries', icon: 'domain', pathSuffix: '/industries' },
    { id: 'programs', label: 'Programs', icon: 'folder_special', pathSuffix: '/programs' },
    { id: 'students', label: 'Students', icon: 'group', pathSuffix: '/students' },
    { id: 'reports', label: 'Reports', icon: 'analytics', pathSuffix: '/reports' },
    { id: 'audit_logs', label: 'Audit Logs', icon: 'security', pathSuffix: '/audit-logs' },
  ],
  admin: [],
  mentor: [],
};

// Aliases for admin and mentor
ROLE_NAVIGATIONS.admin = ROLE_NAVIGATIONS.school_admin;
ROLE_NAVIGATIONS.mentor = ROLE_NAVIGATIONS.industry_mentor;

export function getFullRoute(role: UserRole, tab: NavTab): string {
  const normalized = normalizeRole(role);
  const base = ROLE_ROUTES[normalized] || '/school/dashboard';
  if (tab === 'dashboard') return base;
  const navs = ROLE_NAVIGATIONS[normalized] || [];
  const found = navs.find((n) => n.id === tab);
  if (found && found.pathSuffix) {
    const rootRoute = base.replace(/\/dashboard$/, '');
    return `${rootRoute}${found.pathSuffix}`;
  }
  return `${base}/${tab}`;
}

export function parseRouteToRoleAndTab(pathOrHash: string): { role: UserRole; tab: NavTab } | null {
  const raw = pathOrHash.replace(/^#\/?/, '').replace(/^\//, '');
  if (!raw || raw === 'login') return null;

  if (raw.startsWith('admin')) {
    if (raw.includes('schools')) return { role: 'super_admin', tab: 'schools' };
    if (raw.includes('industries')) return { role: 'super_admin', tab: 'industries' };
    if (raw.includes('users')) return { role: 'super_admin', tab: 'users' };
    if (raw.includes('roles')) return { role: 'super_admin', tab: 'roles' };
    if (raw.includes('competencies')) return { role: 'super_admin', tab: 'competencies' };
    if (raw.includes('programs')) return { role: 'super_admin', tab: 'programs' };
    if (raw.includes('audit-logs') || raw.includes('audit_logs')) return { role: 'super_admin', tab: 'audit_logs' };
    if (raw.includes('erd')) return { role: 'super_admin', tab: 'erd' };
    if (raw.includes('settings')) return { role: 'super_admin', tab: 'settings' };
    return { role: 'super_admin', tab: 'dashboard' };
  }

  if (raw.startsWith('school/mentor')) {
    if (raw.includes('students')) return { role: 'teacher_mentor', tab: 'students' };
    if (raw.includes('attendance')) return { role: 'teacher_mentor', tab: 'attendance' };
    if (raw.includes('journals')) return { role: 'teacher_mentor', tab: 'journals' };
    if (raw.includes('evidence')) return { role: 'teacher_mentor', tab: 'evidence' };
    if (raw.includes('competencies')) return { role: 'teacher_mentor', tab: 'competencies' };
    if (raw.includes('supervision')) return { role: 'teacher_mentor', tab: 'supervision' };
    if (raw.includes('assessments')) return { role: 'teacher_mentor', tab: 'assessments' };
    if (raw.includes('notifications')) return { role: 'teacher_mentor', tab: 'notifications' };
    return { role: 'teacher_mentor', tab: 'dashboard' };
  }

  if (raw.startsWith('school')) {
    if (raw.includes('students')) return { role: 'school_admin', tab: 'students' };
    if (raw.includes('programs')) return { role: 'school_admin', tab: 'programs' };
    if (raw.includes('applications')) return { role: 'school_admin', tab: 'applications' };
    if (raw.includes('placements')) return { role: 'school_admin', tab: 'placements' };
    if (raw.includes('industries')) return { role: 'school_admin', tab: 'industries' };
    if (raw.includes('mentors')) return { role: 'school_admin', tab: 'mentors' };
    if (raw.includes('supervision')) return { role: 'school_admin', tab: 'supervision' };
    if (raw.includes('assessments')) return { role: 'school_admin', tab: 'assessments' };
    if (raw.includes('reports')) return { role: 'school_admin', tab: 'reports' };
    if (raw.includes('erd')) return { role: 'school_admin', tab: 'erd' };
    return { role: 'school_admin', tab: 'dashboard' };
  }

  if (raw.startsWith('student')) {
    if (raw.includes('profile')) return { role: 'student', tab: 'profile' };
    if (raw.includes('internship')) return { role: 'student', tab: 'internship' };
    if (raw.includes('attendance')) return { role: 'student', tab: 'attendance' };
    if (raw.includes('journals')) return { role: 'student', tab: 'journals' };
    if (raw.includes('evidence')) return { role: 'student', tab: 'evidence' };
    if (raw.includes('competencies')) return { role: 'student', tab: 'competencies' };
    if (raw.includes('assessments')) return { role: 'student', tab: 'assessments' };
    if (raw.includes('certificate')) return { role: 'student', tab: 'certificate' };
    if (raw.includes('portfolio')) return { role: 'student', tab: 'portfolio' };
    if (raw.includes('notifications')) return { role: 'student', tab: 'notifications' };
    return { role: 'student', tab: 'dashboard' };
  }

  if (raw.startsWith('industry/mentor')) {
    if (raw.includes('students')) return { role: 'industry_mentor', tab: 'students' };
    if (raw.includes('attendance')) return { role: 'industry_mentor', tab: 'attendance' };
    if (raw.includes('journals')) return { role: 'industry_mentor', tab: 'journals' };
    if (raw.includes('evidence')) return { role: 'industry_mentor', tab: 'evidence' };
    if (raw.includes('competencies')) return { role: 'industry_mentor', tab: 'competencies' };
    if (raw.includes('assessments')) return { role: 'industry_mentor', tab: 'assessments' };
    if (raw.includes('notifications')) return { role: 'industry_mentor', tab: 'notifications' };
    return { role: 'industry_mentor', tab: 'dashboard' };
  }

  if (raw.startsWith('industry')) {
    if (raw.includes('profile')) return { role: 'industry_admin', tab: 'company_profile' };
    if (raw.includes('units')) return { role: 'industry_admin', tab: 'units' };
    if (raw.includes('mentors')) return { role: 'industry_admin', tab: 'mentors' };
    if (raw.includes('students')) return { role: 'industry_admin', tab: 'students' };
    if (raw.includes('attendance')) return { role: 'industry_admin', tab: 'attendance' };
    if (raw.includes('journals')) return { role: 'industry_admin', tab: 'journals' };
    if (raw.includes('competencies')) return { role: 'industry_admin', tab: 'competencies' };
    if (raw.includes('assessments')) return { role: 'industry_admin', tab: 'assessments' };
    if (raw.includes('reports')) return { role: 'industry_admin', tab: 'reports' };
    return { role: 'industry_admin', tab: 'dashboard' };
  }

  if (raw.startsWith('viewer')) {
    if (raw.includes('schools')) return { role: 'viewer_dinas', tab: 'schools' };
    if (raw.includes('industries')) return { role: 'viewer_dinas', tab: 'industries' };
    if (raw.includes('programs')) return { role: 'viewer_dinas', tab: 'programs' };
    if (raw.includes('students')) return { role: 'viewer_dinas', tab: 'students' };
    if (raw.includes('reports')) return { role: 'viewer_dinas', tab: 'reports' };
    return { role: 'viewer_dinas', tab: 'dashboard' };
  }

  return null;
}

export const ROLES_CONFIG: Record<string, RoleConfig> = {
  super_admin: {
    id: 'super_admin',
    title: 'Super Admin',
    shortDesc: 'Kelola seluruh platform',
    icon: 'admin_panel_settings',
    category: 'Platform',
    defaultEmail: 'superadmin@aktara.id',
    defaultName: 'Bambang Wicaksono, M.Kom',
    organization: 'Kementerian / Platform Pusat AKTARA',
    badgeColor: 'from-blue-600/20 to-slate-700/30 text-blue-200 border-blue-500/40',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  school_admin: {
    id: 'school_admin',
    title: 'Admin Sekolah',
    shortDesc: 'Kelola program dan siswa sekolah',
    icon: 'school',
    category: 'Sekolah',
    defaultEmail: 'admin@smkn1jakarta.sch.id',
    defaultName: 'Drs. H. Mulyono',
    organization: 'SMK Negeri 1 Jakarta',
    badgeColor: 'from-blue-500/20 to-indigo-600/20 text-blue-300 border-blue-500/40',
    avatar: ASSETS.adminAvatar,
  },
  teacher_mentor: {
    id: 'teacher_mentor',
    title: 'Guru Pembimbing',
    shortDesc: 'Monitor siswa yang dibimbing',
    icon: 'supervisor_account',
    category: 'Sekolah',
    defaultEmail: 'guru.hendra@smkn1jakarta.sch.id',
    defaultName: 'Hendra Setiawan, S.Pd., M.T.',
    organization: 'SMK Negeri 1 Jakarta (Dept. RPL & TKJ)',
    badgeColor: 'from-sky-500/20 to-blue-600/20 text-sky-300 border-sky-500/40',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  student: {
    id: 'student',
    title: 'Siswa',
    shortDesc: 'Kelola aktivitas magang Anda',
    icon: 'badge',
    category: 'Sekolah',
    defaultEmail: 'alex.mercer@siswa.smkn1jakarta.sch.id',
    defaultName: 'Alex Mercer (NIS: 20241088)',
    organization: 'SMK Negeri 1 Jakarta (Kelas XII RPL 1)',
    badgeColor: 'from-slate-700/40 to-blue-900/40 text-slate-200 border-slate-600/50',
    avatar: ASSETS.studentAvatar,
  },
  industry_admin: {
    id: 'industry_admin',
    title: 'Admin Industri',
    shortDesc: 'Kelola data dan pembimbing industri',
    icon: 'domain',
    category: 'Industri',
    defaultEmail: 'hrd.corp@teknologimaju.co.id',
    defaultName: 'Ratna Kusuma Dewi, S.Psi',
    organization: 'PT. Teknologi Maju (Head of People & Culture)',
    badgeColor: 'from-blue-800/30 to-slate-800/40 text-blue-200 border-blue-600/40',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  industry_mentor: {
    id: 'industry_mentor',
    title: 'Pembimbing Industri',
    shortDesc: 'Validasi aktivitas dan kompetensi siswa',
    icon: 'verified_user',
    category: 'Industri',
    defaultEmail: 'budi.santoso@teknologimaju.co.id',
    defaultName: 'Budi Santoso',
    organization: 'PT. Teknologi Maju (Lead Engineering Mentor)',
    badgeColor: 'from-sky-600/20 to-slate-700/30 text-sky-200 border-sky-500/40',
    avatar: ASSETS.mentorAvatar,
  },
  viewer_dinas: {
    id: 'viewer_dinas',
    title: 'Viewer / Dinas',
    shortDesc: 'Lihat dashboard agregat',
    icon: 'insights',
    category: 'Pemerintah',
    defaultEmail: 'pengawas.vokasi@disdik.dki.go.id',
    defaultName: 'Dr. Ir. Suryadi Pratama, M.Sc',
    organization: 'Dinas Pendidikan Provinsi DKI Jakarta',
    badgeColor: 'from-slate-700/30 to-blue-800/30 text-slate-300 border-slate-600/40',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
};

export const ROLES_ARRAY: RoleConfig[] = [
  ROLES_CONFIG.super_admin,
  ROLES_CONFIG.school_admin,
  ROLES_CONFIG.teacher_mentor,
  ROLES_CONFIG.student,
  ROLES_CONFIG.industry_admin,
  ROLES_CONFIG.industry_mentor,
  ROLES_CONFIG.viewer_dinas,
];

export function normalizeRole(role: UserRole | string): UserRole {
  if (role === 'admin') return 'school_admin';
  if (role === 'mentor') return 'industry_mentor';
  if (ROLES_CONFIG[role]) return role as UserRole;
  return 'school_admin';
}

export function getDefaultUserForRole(role: UserRole): AuthUser {
  const normalized = normalizeRole(role);
  const cfg = ROLES_CONFIG[normalized] || ROLES_CONFIG.school_admin;
  return {
    id: `user-${normalized}`,
    name: cfg.defaultName,
    email: cfg.defaultEmail,
    role: normalized,
    dbRole: normalized,
    tenantId: `tenant-${normalized}`,
    tenantName: cfg.organization,
    avatar: cfg.avatar,
    organization: cfg.organization,
    title: cfg.title,
    rememberMe: true,
  };
}
