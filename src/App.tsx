import { useState, useEffect } from 'react';
import { UserRole, NavTab, ProgramCohort, PendingAction, FeedbackItem, NotificationItem, AuthUser, AuditLogItem } from './types';
import {
  INITIAL_PROGRAMS,
  MENTOR_STUDENTS,
  INITIAL_PENDING_ACTIONS,
  STUDENT_FEEDBACKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SCHOOLS,
  INITIAL_INDUSTRIES,
  INITIAL_DEPARTMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_ONBOARDING_PROFILES,
  INITIAL_ATTENDANCE_LOGS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_COMPETENCIES,
  INITIAL_SUPERVISION_SCHEDULES,
  INITIAL_ASSESSMENTS,
  INITIAL_CERTIFICATES,
} from './data/mockData';
import { normalizeRole, ROLES_CONFIG } from './data/rolesData';
import { SupabaseAuthService, DB_USER_PROFILES } from './services/authService';
import { DbService } from './services/dbService';
import { LoginPage } from './components/auth/LoginPage';
import { FeedbackToast } from './components/ui/FeedbackToast';
import { LoadingSkeleton } from './components/ui/LoadingSkeleton';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { AdminOverviewView } from './components/views/AdminOverviewView';
import { AdminProgramsView } from './components/views/AdminProgramsView';
import { MentorDashboardView } from './components/views/MentorDashboardView';
import { StudentDashboardView } from './components/views/StudentDashboardView';
import { SuperAdminView } from './components/views/SuperAdminView';
import { TeacherMentorView } from './components/views/TeacherMentorView';
import { IndustryAdminView } from './components/views/IndustryAdminView';
import { ViewerDinasView } from './components/views/ViewerDinasView';
import { MasterDataView } from './components/views/MasterDataView';
import { IndustriesView } from './components/views/IndustriesView';
import { MentorsView } from './components/views/MentorsView';
import { PlacementsView } from './components/views/PlacementsView';
import { StudentOnboardingView } from './components/views/StudentOnboardingView';
import { StudentProfileCustomizationView } from './components/views/StudentProfileCustomizationView';
import { AttendanceView } from './components/views/AttendanceView';
import { StudentsView } from './components/views/StudentsView';
import { EvidenceView } from './components/views/EvidenceView';
import { JournalsView } from './components/views/JournalsView';
import { CompetencyTrackingView } from './components/views/CompetencyTrackingView';
import { SupervisionView } from './components/views/SupervisionView';
import { AssessmentView } from './components/views/AssessmentView';
import { ReportsView } from './components/views/ReportsView';
import { CertificationPortfolioView } from './components/views/CertificationPortfolioView';
import { StudentPublicPortfolioView } from './components/views/StudentPublicPortfolioView';
import { NotificationsCenterView } from './components/views/NotificationsCenterView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { ErdLogicalModelView } from './components/views/ErdLogicalModelView';
import {
  NewPlacementModal,
  CreateProgramModal,
  ReviewActionModal,
  AddJournalModal,
  CheckInModal,
  CompetencyGridModal,
  NotificationsModal,
  AddTenantModal,
  StudentLogbookModal,
  ScheduleSupervisionModal,
  AddIndustryMentorModal,
  AdjustQuotaModal,
} from './components/modals/ActionModals';

export default function App() {
  // Authoritative user profile initialized from verified DB record
  const initialDbUser = DB_USER_PROFILES.find((u) => u.role === 'school_admin') || DB_USER_PROFILES[1];

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    return {
      id: initialDbUser.id,
      name: initialDbUser.name,
      email: initialDbUser.email,
      role: initialDbUser.role,
      dbRole: initialDbUser.role,
      tenantId: initialDbUser.tenantId,
      tenantName: initialDbUser.tenantName,
      avatar: initialDbUser.avatar,
      organization: initialDbUser.tenantName,
      department: initialDbUser.department,
      title: initialDbUser.title,
      rememberMe: true,
    };
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(initialDbUser.role);

  // Loading & Database state
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Navigation state
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Business Data state for 8.1 - 8.13 Functional Modules (Populated from DbService)
  const [programs, setPrograms] = useState<ProgramCohort[]>(INITIAL_PROGRAMS);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>(INITIAL_PENDING_ACTIONS);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(STUDENT_FEEDBACKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [schools, setSchools] = useState(INITIAL_SCHOOLS);
  const [industries, setIndustries] = useState(INITIAL_INDUSTRIES);
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [onboardingData, setOnboardingData] = useState(INITIAL_ONBOARDING_PROFILES['stud-5']);
  const [attendanceLogs, setAttendanceLogs] = useState(INITIAL_ATTENDANCE_LOGS);
  const [journalEntries, setJournalEntries] = useState(INITIAL_JOURNAL_ENTRIES);
  const [competencies, setCompetencies] = useState(INITIAL_COMPETENCIES);
  const [supervisionSchedules, setSupervisionSchedules] = useState(INITIAL_SUPERVISION_SCHEDULES);
  const [assessments, setAssessments] = useState(INITIAL_ASSESSMENTS);
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Student specific check-in state
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [lastCheckInTime, setLastCheckInTime] = useState('08:00 AM');

  // Modal visibility states
  const [newPlacementModalOpen, setNewPlacementModalOpen] = useState(false);
  const [createProgramModalOpen, setCreateProgramModalOpen] = useState(false);
  const [selectedActionToReview, setSelectedActionToReview] = useState<PendingAction | null>(null);
  const [addJournalModalOpen, setAddJournalModalOpen] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [competencyModalOpen, setCompetencyModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [addTenantModalOpen, setAddTenantModalOpen] = useState(false);
  const [studentLogbookModalOpen, setStudentLogbookModalOpen] = useState(false);
  const [selectedStudentForLogbook, setSelectedStudentForLogbook] = useState<string>('Dimas Prasetyo Nugroho');
  const [scheduleSupervisionModalOpen, setScheduleSupervisionModalOpen] = useState(false);
  const [addIndustryMentorModalOpen, setAddIndustryMentorModalOpen] = useState(false);
  const [adjustQuotaModalOpen, setAdjustQuotaModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Asynchronously query database via DbService
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoadingData(false);
      return;
    }

    let isMounted = true;

    async function loadData() {
      setIsLoadingData(true);
      try {
        const [
          schoolsData,
          industriesData,
          departmentsData,
          programsData,
          applicationsData,
          onboardingRes,
          attendanceData,
          journalsData,
          competenciesData,
          supervisionData,
          assessmentsData,
          certificatesData,
          notificationsData,
          auditLogsData,
        ] = await Promise.all([
          DbService.getSchools(),
          DbService.getIndustries(),
          DbService.getDepartments(),
          DbService.getPrograms(currentUser.tenantId),
          DbService.getApplications(),
          DbService.getStudentOnboarding(currentUser.id),
          DbService.getAttendanceLogs(currentRole === 'student' ? currentUser.id : undefined),
          DbService.getJournals(currentRole === 'student' ? currentUser.id : undefined),
          DbService.getCompetencies(currentRole === 'student' ? currentUser.id : undefined),
          DbService.getSupervisionSchedules(),
          DbService.getAssessments(),
          DbService.getCertificates(),
          DbService.getNotifications(currentUser.id),
          DbService.getAuditLogs(),
        ]);

        if (isMounted) {
          setSchools(schoolsData);
          setIndustries(industriesData);
          setDepartments(departmentsData);
          setPrograms(programsData);
          setApplications(applicationsData);
          setOnboardingData(onboardingRes);
          setAttendanceLogs(attendanceData);
          setJournalEntries(journalsData);
          setCompetencies(competenciesData);
          setSupervisionSchedules(supervisionData);
          setAssessments(assessmentsData);
          setCertificates(certificatesData);
          setNotifications(notificationsData);
          setAuditLogs(auditLogsData);
        }
      } catch (err) {
        console.warn('DbService load error:', err);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, currentUser.id, currentUser.tenantId, currentRole]);

  // Listen to hash for #login or direct login route simulation
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#login') {
        setIsAuthenticated(false);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Helper for quick toast banner
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    window.location.hash = '';
    const roleCfg = ROLES_CONFIG[user.role] || ROLES_CONFIG.school_admin;
    triggerToast(`Selamat Datang, ${user.name}! Masuk sebagai ${roleCfg.title} (${user.tenantName}).`);
  };

  const handleLogout = () => {
    SupabaseAuthService.clearSession();
    setIsAuthenticated(false);
    window.location.hash = '#login';
    triggerToast('Anda telah keluar dari sesi AKTARA.');
  };

  const handleRoleChange = (newRole: UserRole) => {
    const normalized = normalizeRole(newRole);
    // Find authoritative DB profile for this role
    const dbProfile = DB_USER_PROFILES.find((u) => u.role === normalized) || DB_USER_PROFILES[0];
    const updatedUser: AuthUser = {
      id: dbProfile.id,
      name: dbProfile.name,
      email: dbProfile.email,
      role: dbProfile.role,
      dbRole: dbProfile.role,
      tenantId: dbProfile.tenantId,
      tenantName: dbProfile.tenantName,
      avatar: dbProfile.avatar,
      organization: dbProfile.tenantName,
      department: dbProfile.department,
      title: dbProfile.title,
      rememberMe: true,
    };
    setCurrentRole(normalized);
    setCurrentUser(updatedUser);
    setActiveTab('dashboard');
    const roleCfg = ROLES_CONFIG[normalized] || ROLES_CONFIG.school_admin;
    triggerToast(`Beralih akun terverifikasi ke ${roleCfg.title} (${dbProfile.tenantName})`);
  };

  // Domain Action Handlers with Supabase Real Mutations
  const handleRegisterPlacement = (data: any) => {
    triggerToast(`Penempatan baru dibuat untuk ${data.studentName || 'Siswa'} di ${data.company}`);
  };

  const handleCreateCohort = (newProg: Partial<ProgramCohort>) => {
    setPrograms([newProg as ProgramCohort, ...programs]);
    triggerToast(`Berhasil membuat program baru: ${newProg.title}`);
  };

  const handleApproveAction = async (actionId: string, feedbackComment: string) => {
    await DbService.reviewJournal(actionId, 'approved', feedbackComment || 'Disetujui mentor');
    setPendingActions((prev) =>
      prev.map((act) => (act.id === actionId ? { ...act, status: 'approved' } : act))
    );

    if (feedbackComment) {
      const newFb: FeedbackItem = {
        id: `fb-${Date.now()}`,
        authorName: currentUser.name || 'Bayu Pratama',
        authorRole: 'Lead Industry Mentor',
        authorInitials: 'BP',
        timeAgo: 'Baru saja',
        comment: `"${feedbackComment}"`,
      };
      setFeedbacks([newFb, ...feedbacks]);
    }
    triggerToast('Aktivitas disetujui & divalidasi ke database PostgreSQL');
  };

  const handleRejectAction = async (actionId: string, feedbackComment: string) => {
    await DbService.reviewJournal(actionId, 'rejected', feedbackComment || 'Perlu perbaikan');
    setPendingActions((prev) =>
      prev.map((act) => (act.id === actionId ? { ...act, status: 'rejected' } : act))
    );
    triggerToast('Revisi jurnal diminta dengan catatan mentor');
  };

  const handleAddJournal = async (journalData: any) => {
    const today = new Date().toISOString().split('T')[0];
    await DbService.submitJournal({
      studentId: currentUser.id || 'stud-5',
      studentName: currentUser.name || 'Dimas Prasetyo',
      date: today,
      startTime: '08:00',
      endTime: '17:00',
      totalHours: Number(journalData.hours) || 8,
      title: journalData.title,
      activityDescription: journalData.description,
      relatedCompetencies: ['Frontend Component Architecture (React/TypeScript)'],
      evidenceAttachments: [],
    });

    const newAct: PendingAction = {
      id: `act-${Date.now()}`,
      studentId: 'stud-5',
      studentName: currentUser.name || 'Dimas Prasetyo',
      department: 'Rekayasa Perangkat Lunak',
      type: 'Journal Entry',
      submittedTime: 'Baru saja',
      details: {
        title: journalData.title,
        description: journalData.description,
        hours: journalData.hours,
        date: 'Hari ini',
      },
      status: 'pending',
    };
    setPendingActions([newAct, ...pendingActions]);
    triggerToast('Jurnal harian berhasil disubmit ke database PostgreSQL');
  };

  const handleConfirmCheckIn = async () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await DbService.recordCheckIn({
      studentId: currentUser.id || 'stud-5',
      latitude: -6.229728,
      longitude: 106.816447,
      locationName: 'The Telkom Landmark Tower, Jakarta',
      notes: 'Presensi GPS terverifikasi geofence',
    });
    setIsCheckedIn(true);
    setLastCheckInTime(timeStr);
    triggerToast(`Presensi GPS berhasil tercatat ke database PostgreSQL pada ${timeStr}`);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const normalizedRole = normalizeRole(currentRole);

  // If not authenticated, render Login Page with all 7 roles
  if (!isAuthenticated) {
    return (
      <>
        {toastMessage && (
          <div className="toast-enter fixed left-4 right-4 top-4 z-[120] sm:left-auto sm:right-4 sm:w-96 sm:max-w-[calc(100vw-2rem)]">
            <FeedbackToast title={toastMessage} onDismiss={() => setToastMessage(null)} />
          </div>
        )}
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          initialRole={currentRole}
        />
      </>
    );
  }

  return (
    <div className="app-shell min-h-screen flex flex-col font-sans relative selection:bg-emerald-500/20">
      {/* Background radial glows for rich Frosted Glass atmosphere */}
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-enter fixed left-4 right-4 top-4 z-[120] sm:left-auto sm:right-4 sm:w-96 sm:max-w-[calc(100vw-2rem)]">
          <FeedbackToast title={toastMessage} onDismiss={() => setToastMessage(null)} />
        </div>
      )}

      {/* Persistent Left Sidebar */}
      <Sidebar
        currentRole={normalizedRole}
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onLogout={handleLogout}
        onOpenNewPlacement={() => {
          if (normalizedRole === 'student') {
            setAddJournalModalOpen(true);
          } else {
            setNewPlacementModalOpen(true);
          }
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Canvas Area */}
      <div className="app-content flex-1 flex flex-col w-full min-h-screen relative z-10">
        {/* Top Header */}
        <TopHeader
          currentRole={normalizedRole}
          currentUser={currentUser}
          mobileSidebarOpen={mobileSidebarOpen}
          onRoleChange={handleRoleChange}
          onToggleMobileSidebar={() => setMobileSidebarOpen((open) => !open)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNotifications={() => setNotificationsModalOpen(true)}
          onOpenHelp={() => triggerToast('Buku Panduan Platform AKTARA Kemendikbudristek')}
          onOpenSettings={() => triggerToast('Panel Pengaturan & Integrasi Tenant')}
          onLogout={handleLogout}
          unreadCount={unreadCount}
        />

        {/* Scrollable Main Content by RBAC */}
        <main className="app-main flex-1 p-4 md:p-6 max-w-[1440px] mx-auto w-full" aria-busy={isLoadingData}>
          {isLoadingData ? <LoadingSkeleton /> : (
          <div key={`${normalizedRole}-${activeTab}`} className="view-enter">
          {/* 1. Super Admin View */}
          {normalizedRole === 'super_admin' && activeTab === 'dashboard' && (
            <SuperAdminView
              onOpenTenants={() => setAddTenantModalOpen(true)}
              onOpenAuditLogs={() => setActiveTab('audit_logs')}
              onNavigateToSchools={() => setActiveTab('schools')}
              onNavigateToIndustries={() => setActiveTab('industries')}
              onNavigateToPrograms={() => setActiveTab('programs')}
              onNavigateToStudents={() => setActiveTab('students')}
              onNavigateToErd={() => {
                setActiveTab('erd');
                triggerToast('Membuka Spesifikasi ERD & 34 Core Tables PostgreSQL');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              searchQuery={searchQuery}
              schools={schools}
              industries={industries}
              programs={programs}
              auditLogs={auditLogs}
            />
          )}

          {/* 2. Admin Sekolah (Overview & Programs) */}
          {normalizedRole === 'school_admin' && activeTab === 'dashboard' && (
            <AdminOverviewView
              programs={programs}
              onNavigateToPrograms={() => setActiveTab('programs')}
              onNavigateToStudents={() => setActiveTab('students')}
              onNavigateToPlacements={() => setActiveTab('placements')}
              onNavigateToAttendance={() => setActiveTab('attendance')}
              onNavigateToJournals={() => setActiveTab('journals')}
              onNavigateToCompetencies={() => setActiveTab('competencies')}
              onNavigateToSupervision={() => setActiveTab('supervision')}
              onNavigateToErd={() => setActiveTab('erd')}
              onOpenNewPlacement={() => setNewPlacementModalOpen(true)}
              onOpenExport={() => triggerToast('Mengekspor analitik semester SMK Negeri 1 Jakarta...')}
              searchQuery={searchQuery}
              schools={schools}
              industries={industries}
              attendanceLogs={attendanceLogs}
              journalEntries={journalEntries}
              competencies={competencies}
            />
          )}

          {/* 2. Program Magang & Batch Kohort (Modul 8.3) */}
          {activeTab === 'programs' && (
            <AdminProgramsView
              programs={programs}
              onCreateProgram={() => setCreateProgramModalOpen(true)}
              onViewApps={(prog) => triggerToast(`Melihat pengajuan siswa untuk ${prog.title}`)}
              onViewCompetencies={() => setCompetencyModalOpen(true)}
              onViewPlacements={(prog) => {
                setActiveTab('placements');
                triggerToast(`Menuju alokasi penempatan industri untuk ${prog.title}`);
              }}
              searchQuery={searchQuery}
              isReadOnly={normalizedRole === 'viewer_dinas'}
            />
          )}

          {/* Dedicated Students Directory & Monitoring (Modul 8.5) */}
          {activeTab === 'students' && (
            <StudentsView
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onSelectStudent={(name) => {
                setSelectedStudentForLogbook(name);
                setActiveTab('profile');
                triggerToast(`Membuka profil & portofolio magang: ${name}`);
              }}
              onExportStudents={() => triggerToast('Mengekspor rekapitulasi data siswa magang (.xlsx)...')}
              onAddNewStudent={() => triggerToast('Form Pendaftaran Peserta Didik Magang Baru')}
            />
          )}

          {/* 3. Guru Pembimbing (Teacher Mentor) */}
          {normalizedRole === 'teacher_mentor' && activeTab === 'dashboard' && (
            <TeacherMentorView
              onSelectStudent={(name) => {
                setSelectedStudentForLogbook(name);
                setActiveTab('profile');
              }}
              onOpenSupervisionModal={() => setScheduleSupervisionModalOpen(true)}
              onOpenLogbookModal={(name) => {
                setSelectedStudentForLogbook(name);
                setStudentLogbookModalOpen(true);
              }}
              searchQuery={searchQuery}
              students={MENTOR_STUDENTS}
              supervisions={supervisionSchedules}
            />
          )}

          {/* 4. Siswa (Student Portal) */}
          {normalizedRole === 'student' && activeTab === 'dashboard' && (
            <StudentDashboardView
              onCheckIn={() => setCheckInModalOpen(true)}
              onAddJournal={() => setAddJournalModalOpen(true)}
              onViewAllCompetencies={() => setCompetencyModalOpen(true)}
              onViewAllFeedback={() => triggerToast('Melihat semua catatan evaluasi mentor')}
              feedbacks={feedbacks}
              isCheckedIn={isCheckedIn}
              lastCheckInTime={lastCheckInTime}
              currentUser={currentUser}
              applications={applications}
              attendanceLogs={attendanceLogs}
              journalEntries={journalEntries}
              competencies={competencies}
            />
          )}

          {/* 5. Admin Industri */}
          {normalizedRole === 'industry_admin' && activeTab === 'dashboard' && (
            <IndustryAdminView
              onAddMentor={() => setAddIndustryMentorModalOpen(true)}
              onAdjustQuota={() => setAdjustQuotaModalOpen(true)}
              onNavigateToPlacements={() => setActiveTab('placements')}
              onNavigateToAttendance={() => setActiveTab('attendance')}
              onNavigateToAssessments={() => setActiveTab('assessments')}
              onNavigateToSchools={() => setActiveTab('schools')}
              onNavigateToMentors={() => setActiveTab('mentors')}
              searchQuery={searchQuery}
              industries={industries}
              schools={schools}
            />
          )}

          {/* 6. Pembimbing Industri (Industry Mentor) */}
          {normalizedRole === 'industry_mentor' && activeTab === 'dashboard' && (
            <MentorDashboardView
              pendingActions={pendingActions}
              students={MENTOR_STUDENTS}
              onReviewAction={(act) => setSelectedActionToReview(act)}
              onViewDetailedGrid={() => setCompetencyModalOpen(true)}
              onViewAllActions={() => triggerToast('Menampilkan seluruh antrean validasi')}
              searchQuery={searchQuery}
            />
          )}

          {/* 7. Viewer / Dinas Pendidikan */}
          {normalizedRole === 'viewer_dinas' && activeTab === 'dashboard' && (
            <ViewerDinasView
              onExportReport={() => triggerToast('Mengekspor laporan agregat Dinas Pendidikan')}
              searchQuery={searchQuery}
            />
          )}

          {/* 8. Database ERD & Logical Data Model (11.1 & 11.2) */}
          {activeTab === 'erd' && (
            <ErdLogicalModelView
              onBack={() => {
                setActiveTab('dashboard');
                triggerToast('Kembali ke Dashboard Super Admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* 9. Functional Modules Routing (8.1 - 8.13) */}
          
          {/* Dedicated Industries Management Page (8.2) */}
          {activeTab === 'industries' && (
            <IndustriesView
              industries={industries}
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onAddIndustry={() => setAddTenantModalOpen(true)}
              onUpdateIndustryStatus={(id, status) => {
                setIndustries((prev) => prev.map((ind) => (ind.id === id ? { ...ind, status } : ind)));
                triggerToast(`Status mitra industri diperbarui: ${status === 'active' ? 'Aktif' : 'Non-Aktif'}`);
              }}
              onExportIndustries={() => triggerToast('Mengekspor data direktori kemitraan DUDI (.xlsx / PDF)')}
            />
          )}

          {/* Dedicated Mentors Management Page (8.2 & 8.9) */}
          {activeTab === 'mentors' && (
            <MentorsView
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onAddMentor={() => triggerToast('Form Pendaftaran Pembimbing DUDI / Sekolah Baru')}
              onAssignStudents={(mentorId) => triggerToast(`Alokasi siswa bimbingan untuk mentor ${mentorId}`)}
              onExportMentors={() => triggerToast('Mengekspor direktori pembimbing DUDI & sekolah (XLS/PDF)...')}
            />
          )}

          {/* Master Data (8.2): Schools, Departments, Roles, Users */}
          {(activeTab === 'schools' || activeTab === 'roles' || activeTab === 'units' || activeTab === 'users' || activeTab === 'tenants') && (
            <MasterDataView
              schools={schools}
              industries={industries}
              departments={departments}
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onUpdateSchoolStatus={(id, status) => {
                setSchools((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
                triggerToast(`Status sekolah diperbarui menjadi: ${status}`);
              }}
              onUpdateIndustryStatus={(id, status) => {
                setIndustries((prev) => prev.map((ind) => (ind.id === id ? { ...ind, status } : ind)));
                triggerToast(`Status mitra industri diperbarui: ${status}`);
              }}
              onAddSchool={() => triggerToast('Form Pendaftaran Sekolah Vokasi Baru')}
              onAddIndustry={() => setAddTenantModalOpen(true)}
              onAddDepartment={() => triggerToast('Form Penambahan Program Keahlian Baru')}
            />
          )}

          {/* Student Placement & Matching GANESA ID (8.4) */}
          {(activeTab === 'placements' || activeTab === 'applications') && (
            <PlacementsView
              applications={applications}
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onApproveApplication={(appId) => {
                setApplications((prev) =>
                  prev.map((a) =>
                    a.id === appId
                      ? {
                          ...a,
                          status: 'Placed',
                          placementHistory: [
                            {
                              id: `hist-${Date.now()}`,
                              action: 'Penempatan Disetujui & Diterbitkan',
                              changedBy: currentUser.name,
                              date: 'Hari ini',
                              newPlacement: `${a.targetCompany} - ${a.targetUnit}`,
                              reason: 'Persetujuan penempatan',
                            },
                            ...a.placementHistory,
                          ],
                        }
                      : a
                  )
                );
                triggerToast('Penempatan siswa berhasil disetujui & tercatat di riwayat.');
              }}
              onRejectApplication={(appId) => {
                setApplications((prev) =>
                  prev.map((a) => (a.id === appId ? { ...a, status: 'In Review' } : a))
                );
                triggerToast('Pengajuan penempatan dikembalikan untuk penyesuaian.');
              }}
              onOpenNewPlacementModal={() => setNewPlacementModalOpen(true)}
            />
          )}

          {/* Student Profile & Portfolio Customization (Modul 8.5) */}
          {activeTab === 'profile' && (
            <StudentProfileCustomizationView
              currentRole={normalizedRole}
              onSaveProfile={(updated) => {
                triggerToast(`Profil vokasi "${updated.name}" berhasil disimpan & diperbarui!`);
              }}
              onExportCv={() => triggerToast('Mencetak ringkasan CV & portofolio digital siswa (PDF)...')}
            />
          )}

          {/* Student Onboarding & Readiness Protocol (8.5) */}
          {(activeTab === 'onboarding' || activeTab === 'company_profile') && (
            <StudentOnboardingView
              onboardingData={onboardingData}
              currentRole={normalizedRole}
              onUpdateDocument={(docKey) => {
                setOnboardingData((prev) => ({
                  ...prev,
                  documents: {
                    ...prev.documents,
                    [docKey]: !prev.documents[docKey],
                  },
                }));
                triggerToast('Status verifikasi dokumen berhasil diperbarui.');
              }}
              onUpdateOrientation={(orientKey) => {
                setOnboardingData((prev) => ({
                  ...prev,
                  orientationChecklist: {
                    ...prev.orientationChecklist,
                    [orientKey]: !prev.orientationChecklist[orientKey],
                  },
                }));
                triggerToast('Status pembekalan orientasi berhasil diperbarui.');
              }}
            />
          )}

          {/* Attendance Tracking & GPS Geofence (8.6) */}
          {activeTab === 'attendance' && (
            <AttendanceView
              attendanceLogs={attendanceLogs}
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onOpenCheckInModal={() => setCheckInModalOpen(true)}
              onValidateRecord={(recordId) => {
                setAttendanceLogs((prev) =>
                  prev.map((l) => (l.id === recordId ? { ...l, verifiedByMentor: true } : l))
                );
                triggerToast('Presensi siswa berhasil divalidasi oleh pembimbing.');
              }}
            />
          )}

          {/* Daily Journal (8.7) */}
          {activeTab === 'journals' && (
            <JournalsView
              journals={journalEntries}
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onOpenAddJournalModal={() => setAddJournalModalOpen(true)}
              onApproveJournal={(journalId, feedback) => {
                setJournalEntries((prev) =>
                  prev.map((j) =>
                    j.id === journalId
                      ? {
                          ...j,
                          status: 'approved',
                          industryFeedback: feedback || 'Disetujui pembimbing industri',
                        }
                      : j
                  )
                );
                triggerToast('Jurnal disetujui & masukan telah dicatat.');
              }}
              onRejectJournal={(journalId, feedback) => {
                setJournalEntries((prev) =>
                  prev.map((j) =>
                    j.id === journalId
                      ? {
                          ...j,
                          status: 'rejected',
                          industryFeedback: feedback || 'Perlu perbaikan deskripsi tugas',
                        }
                      : j
                  )
                );
                triggerToast('Revisi jurnal diminta dengan catatan mentor.');
              }}
            />
          )}

          {/* Evidence & Artifacts Gallery (8.8) */}
          {activeTab === 'evidence' && (
            <EvidenceView
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onUploadEvidence={() => triggerToast('Form Unggah Bukti & Artefak Magang Baru')}
              onExportPortfolio={() => triggerToast('Mengunduh portofolio bukti magang siswa (ZIP/PDF)...')}
            />
          )}

          {/* Competency Framework & Tracking (8.8) */}
          {activeTab === 'competencies' && (
            <CompetencyTrackingView
              competencies={competencies}
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onValidateCompetency={(compId, status) => {
                setCompetencies((prev) =>
                  prev.map((c) =>
                    c.id === compId || c.name === compId
                      ? {
                          ...c,
                          status,
                          percentage: status === 'Achieved' ? 100 : c.percentage,
                          verifiedBy: `${currentUser.name} (${currentUser.title || 'Pembimbing'})`,
                          verifiedAt: new Date().toISOString().split('T')[0],
                        }
                      : c
                  )
                );
                triggerToast(`Capaian kompetensi diperbarui ke: ${status}`);
              }}
            />
          )}

          {/* Teacher Supervision & Monitoring (8.9) */}
          {activeTab === 'supervision' && (
            <SupervisionView
              schedules={supervisionSchedules}
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onAddSchedule={() => triggerToast('Form Penjadwalan Supervisi On-site / Virtual')}
              onResolveIssue={(scheduleId) => {
                setSupervisionSchedules((prev) =>
                  prev.map((s) =>
                    s.id === scheduleId ? { ...s, resolutionStatus: 'Resolved' } : s
                  )
                );
                triggerToast('Status kendala siswa berhasil diselesaikan.');
              }}
            />
          )}

          {/* Assessment & Weighted Rubrics (8.10) */}
          {activeTab === 'assessments' && (
            <AssessmentView
              assessments={assessments}
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onLockFinalizeAssessment={(assessmentId) => {
                setAssessments((prev) =>
                  prev.map((a) =>
                    a.id === assessmentId
                      ? {
                          ...a,
                          status: 'Locked_Finalized',
                          finalizedAt: new Date().toLocaleString(),
                          finalizedBy: `${currentUser.name} & Guru Pembimbing`,
                        }
                      : a
                  )
                );
                triggerToast('Nilai akhir berhasil dikunci & disahkan.');
              }}
            />
          )}

          {/* Reports & Analytics Engine (8.11) */}
          {activeTab === 'reports' && (
            <ReportsView
              currentRole={normalizedRole}
              onExportPDF={() => triggerToast('Menghasilkan Dokumen PDF Laporan Resmi Kemendikbud...')}
              onExportExcel={() => triggerToast('Mengekspor spreadsheet laporan agregat (.xlsx)...')}
              industries={industries}
              schools={schools}
            />
          )}

          {/* Digital Certification & Public QR Portfolio (8.12) */}
          {/* Digital Certification (8.12) */}
          {activeTab === 'certificate' && (
            <CertificationPortfolioView
              certificates={certificates}
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onGenerateCertificate={() => {
                triggerToast('Menerbitkan sertifikat digital ber-QR verifikasi untuk siswa berstatus tuntas...');
              }}
              onDownloadPDF={(cert) => {
                triggerToast(`Mengunduh berkas PDF Sertifikat Resmi No. ${cert.certificateNumber}`);
              }}
            />
          )}

          {/* Student Public Portfolio Showcase (8.12) */}
          {activeTab === 'portfolio' && (
            <StudentPublicPortfolioView
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onDownloadCv={() => triggerToast('Mencetak CV Digital & Ringkasan Portofolio (PDF)...')}
              onSharePortfolio={() => triggerToast('Tautan portofolio disalin ke clipboard!')}
            />
          )}

          {/* Audit Logs Trail (8.1) */}
          {activeTab === 'audit_logs' && (
            <AuditLogsView
              logs={auditLogs}
              currentRole={normalizedRole}
              searchQuery={searchQuery}
              onExportLogs={() => triggerToast('Mengekspor log audit aktivitas sistem (CSV)...')}
            />
          )}

          {/* Notifications Center View (8.13) */}
          {activeTab === 'notifications' && (
            <NotificationsCenterView
              notifications={notifications}
              onMarkAllAsRead={() => {
                setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                triggerToast('Semua notifikasi ditandai telah dibaca.');
              }}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                triggerToast(`Membuka menu ${tab}`);
              }}
              onClearNotifications={() => {
                setNotifications([]);
                triggerToast('Daftar notifikasi dibersihkan.');
              }}
            />
          )}

          {/* Student Specific Internship Tab fallback */}
          {activeTab === 'internship' && (
            <AdminProgramsView
              programs={programs}
              onCreateProgram={() => setCreateProgramModalOpen(true)}
              onViewApps={(prog) => triggerToast(`Pengajuan siswa untuk ${prog.title}`)}
              onViewCompetencies={() => setCompetencyModalOpen(true)}
              onViewPlacements={(prog) => triggerToast(`Penempatan industri untuk ${prog.title}`)}
              searchQuery={searchQuery}
              isReadOnly={true}
            />
          )}
          </div>
          )}
        </main>
      </div>

      {/* Action Dialog Modals */}
      <NewPlacementModal
        isOpen={newPlacementModalOpen}
        onClose={() => setNewPlacementModalOpen(false)}
        onSubmit={handleRegisterPlacement}
      />

      <CreateProgramModal
        isOpen={createProgramModalOpen}
        onClose={() => setCreateProgramModalOpen(false)}
        onSubmit={handleCreateCohort}
      />

      <ReviewActionModal
        isOpen={Boolean(selectedActionToReview)}
        onClose={() => setSelectedActionToReview(null)}
        action={selectedActionToReview}
        onApprove={handleApproveAction}
        onReject={handleRejectAction}
      />

      <AddJournalModal
        isOpen={addJournalModalOpen}
        onClose={() => setAddJournalModalOpen(false)}
        onSubmit={handleAddJournal}
      />

      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        onConfirm={handleConfirmCheckIn}
        alreadyCheckedIn={isCheckedIn}
      />

      <CompetencyGridModal
        isOpen={competencyModalOpen}
        onClose={() => setCompetencyModalOpen(false)}
      />

      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications(notifications.map((n) => ({ ...n, read: true })))
        }
      />

      <AddTenantModal
        isOpen={addTenantModalOpen}
        onClose={() => setAddTenantModalOpen(false)}
        onSubmit={(tenant) => {
          if (tenant.type === 'school') {
            const newSchool = {
              id: `sch-${Date.now()}`,
              name: tenant.name,
              npsn: tenant.code || '2010' + Math.floor(1000 + Math.random() * 9000),
              province: tenant.province || 'DKI Jakarta',
              city: tenant.city || 'Jakarta Pusat',
              address: tenant.address || 'Jl. Pendidikan Kejuruan No. 12',
              principalName: tenant.contactName || 'Dr. H. Bambang Sutrisno, M.Pd.',
              phone: tenant.phone || '021-3840123',
              status: 'active' as const,
              studentCount: Number(tenant.quota) || 450,
              mentorCount: 20,
              partnerCount: 12,
            };
            setSchools([newSchool, ...schools]);
          } else {
            const newIndustry = {
              id: `ind-${Date.now()}`,
              name: tenant.name,
              sector: tenant.category || 'Technology & IT',
              city: tenant.city || 'Jakarta Selatan',
              mouNumber: tenant.code || `MOU-DUDI-${Date.now().toString().slice(-4)}`,
              mouValidUntil: '2028-12-31',
              status: 'active' as const,
              quotaTotal: Number(tenant.quota) || 30,
              quotaUsed: 0,
              rating: 5.0,
              units: [
                {
                  id: `unit-${Date.now()}-1`,
                  industryId: `ind-${Date.now()}`,
                  name: 'Divisi Rekayasa & Operasional Digital',
                  address: tenant.address || 'Gedung Pusat Cyber, Jakarta',
                  unitHead: tenant.contactName || 'Rangga Wicaksono, S.T.',
                  mentorCount: 4,
                  activeInterns: 0,
                  status: 'active' as const,
                },
              ],
            };
            setIndustries([newIndustry, ...industries]);
          }

          // Automatically record security audit trail in Super Admin
          const newLog: AuditLogItem = {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            actorName: currentUser.name || 'Kemendikbudristek Super Admin',
            actorEmail: currentUser.email || 'superadmin@kemdikbud.go.id',
            actorRole: 'super_admin',
            tenantName: tenant.name,
            action: 'PROVISION_TENANT',
            module: 'Tenant Management',
            status: 'SUCCESS',
            details: `Pendaftaran tenant baru "${tenant.name}" (${tenant.type === 'school' ? 'SMK' : 'Mitra DUDI'}) berhasil diverifikasi.`,
            ipAddress: '180.252.164.88',
          };
          setAuditLogs([newLog, ...auditLogs]);

          triggerToast(`Tenant baru "${tenant.name}" (${tenant.type === 'school' ? 'Institusi SMK' : 'Mitra Industri'}) berhasil didaftarkan ke sistem.`);
        }}
      />

      <StudentLogbookModal
        isOpen={studentLogbookModalOpen}
        onClose={() => setStudentLogbookModalOpen(false)}
        studentName={selectedStudentForLogbook}
        onVerifyJournal={(jId) => {
          triggerToast(`Jurnal #${jId} untuk ${selectedStudentForLogbook} berhasil divalidasi pembimbing.`);
        }}
      />

      <ScheduleSupervisionModal
        isOpen={scheduleSupervisionModalOpen}
        onClose={() => setScheduleSupervisionModalOpen(false)}
        onSubmit={(schedule) => {
          setSupervisionSchedules([
            {
              id: `sup-${Date.now()}`,
              teacherMentorId: currentUser.id,
              teacherName: currentUser.name,
              industryId: industries.find((industry) => industry.name === schedule.partner)?.id || currentUser.tenantId,
              industryName: schedule.partner,
              visitDate: schedule.visitDate,
              type: schedule.type,
              studentNames: schedule.students.split(',').map((name: string) => name.trim()).filter(Boolean),
              status: schedule.status,
              findings: '',
              issues: '',
              actionPlan: schedule.agenda,
              dueDate: schedule.visitDate,
              resolutionStatus: 'Open',
            },
            ...supervisionSchedules,
          ]);
          triggerToast(`Jadwal supervisi ke ${schedule.partner} (${schedule.type}) berhasil diterbitkan.`);
        }}
      />

      <AddIndustryMentorModal
        isOpen={addIndustryMentorModalOpen}
        onClose={() => setAddIndustryMentorModalOpen(false)}
        onSubmit={(mentor) => {
          triggerToast(`Mentor industri "${mentor.name}" (${mentor.position} - ${mentor.unit}) berhasil didaftarkan.`);
        }}
      />

      <AdjustQuotaModal
        isOpen={adjustQuotaModalOpen}
        onClose={() => setAdjustQuotaModalOpen(false)}
        onSubmit={(quotaData) => {
          triggerToast(`Kapasitas penerimaan magang berhasil diperbarui untuk ${quotaData.length} unit.`);
        }}
      />
    </div>
  );
}
