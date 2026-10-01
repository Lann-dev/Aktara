export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'teacher_mentor'
  | 'student'
  | 'industry_admin'
  | 'industry_mentor'
  | 'viewer_dinas'
  | 'admin'
  | 'mentor';

export type NavTab = 
  | 'dashboard'
  | 'schools'
  | 'industries'
  | 'users'
  | 'roles'
  | 'competencies'
  | 'programs'
  | 'audit_logs'
  | 'settings'
  | 'students'
  | 'applications'
  | 'placements'
  | 'mentors'
  | 'supervision'
  | 'assessments'
  | 'reports'
  | 'attendance'
  | 'journals'
  | 'evidence'
  | 'notifications'
  | 'profile'
  | 'onboarding'
  | 'internship'
  | 'certificate'
  | 'portfolio'
  | 'company_profile'
  | 'units'
  | 'tenants'
  | 'analytics'
  | 'supervisors'
  | 'industry_partners'
  | 'support'
  | 'erd';

export interface RoleRouteConfig {
  baseRoute: string;
  defaultTab: NavTab;
  allowedTabs: NavTab[];
}

export interface RoleConfig {
  id: UserRole;
  title: string;
  shortDesc: string;
  icon: string;
  category: 'Platform' | 'Sekolah' | 'Industri' | 'Pemerintah';
  defaultEmail: string;
  defaultName: string;
  organization: string;
  badgeColor: string;
  avatar: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole; // Authoritative active database role
  dbRole: UserRole; // Verified from database
  availableRoles?: UserRole[]; // Multiple database-assigned roles for this user
  tenantId: string; // Determined from database
  tenantName: string; // Determined from database
  avatar: string;
  organization: string;
  department?: string;
  title?: string;
  rememberMe?: boolean;
  sessionToken?: string;
  nipOrNisn?: string;
  authenticatedAt?: string;
}

export interface DbUserProfile {
  id: string;
  email: string;
  passwordHash?: string;
  role: UserRole; // Primary Authoritative Role in Database
  roles?: UserRole[]; // Multiple roles assigned in user_roles table
  tenantId: string;
  tenantName: string;
  name: string;
  avatar: string;
  department?: string;
  title?: string;
  nipOrNisn?: string;
  status: 'active' | 'inactive';
}

export interface LoginAuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
  errorCode?: 'INVALID_CREDENTIALS' | 'ROLE_MISMATCH' | 'USER_NOT_FOUND' | 'ACCOUNT_DISABLED' | 'NETWORK_ERROR' | 'TENANT_INACTIVE';
  dbRole?: UserRole;
  availableRoles?: UserRole[];
  selectedRole?: UserRole;
  tenantName?: string;
  requiresRoleSelection?: boolean;
}

export interface ProgramCohort {
  id: string;
  title: string;
  department: string;
  academicYear: string;
  status: 'DRAFT' | 'OPEN' | 'RUNNING' | 'COMPLETED';
  duration: string;
  startDate: string;
  endDate: string;
  enrolled: number;
  capacity: number;
  description?: string;
  competencyCount?: number;
}

export interface StudentItem {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  department: string;
  company: string;
  mentor: string;
  attendanceRate: number;
  journalsSubmitted: number;
  journalsTotal: number;
  competencyProgress: number;
  status: 'Active' | 'Pending Review' | 'Completed';
  schoolMentor?: string;
}

export interface PendingAction {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentInitials?: string;
  department: string;
  type: 'Journal Entry' | 'Weekly Attendance' | 'Competency Assessment';
  submittedTime: string;
  details: {
    title?: string;
    description?: string;
    hours?: number;
    tasks?: string[];
    date?: string;
    skillsMastered?: string[];
  };
  status: 'pending' | 'approved' | 'rejected';
}

export interface CompetencyScore {
  id?: string;
  name: string;
  percentage: number;
  level: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  status?: 'Not Started' | 'In Progress' | 'Achieved' | 'Needs Improvement';
  verifiedBy?: string;
  verifiedAt?: string;
  evidenceUrl?: string;
}

export interface FeedbackItem {
  id: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  timeAgo: string;
  comment: string;
  relatedTask?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId?: string;
  studentName?: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  status: 'Present' | 'Late' | 'Excused' | 'Absent' | 'Holiday';
  verifiedByMentor: boolean;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'alert' | 'success' | 'warning';
  category?: 'attendance' | 'journal' | 'assessment' | 'supervision' | 'placement' | 'system';
  actionUrl?: string;
}

// 8.1 Audit Log Item
export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  actorRole: UserRole;
  tenantName: string;
  action: string;
  module: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
  ipAddress: string;
}

// 8.2 Master Data Types
export interface SchoolMaster {
  id: string;
  name: string;
  npsn: string;
  province: string;
  city: string;
  address: string;
  principalName: string;
  phone: string;
  status: 'active' | 'inactive';
  studentCount: number;
  mentorCount: number;
  partnerCount: number;
}

export interface IndustryMaster {
  id: string;
  name: string;
  sector: string;
  city: string;
  mouNumber: string;
  mouValidUntil: string;
  status: 'active' | 'inactive';
  quotaTotal: number;
  quotaUsed: number;
  rating: number;
  units: IndustryUnitMaster[];
}

export interface IndustryUnitMaster {
  id: string;
  industryId: string;
  name: string;
  address: string;
  unitHead: string;
  mentorCount: number;
  activeInterns: number;
  status: 'active' | 'inactive';
}

export interface DepartmentMaster {
  id: string;
  code: string;
  name: string;
  curriculum: 'Kurikulum Merdeka' | 'Kurikulum 2013' | 'SKKNI 2024';
  durationMonths: number;
  competencyCount: number;
  activeStudents: number;
  status: 'active' | 'inactive';
}

// 8.4 Student Placement & Matching with GANESA ID Fit
export interface PlacementApplication {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentNis: string;
  department: string;
  targetCompany: string;
  targetUnit: string;
  submissionDate: string;
  ganesaMatchScore: number; // 0-100% GANESA ID Vocational Compatibility
  ganesaFitDetails: {
    technicalScore: number;
    psychometricScore: number;
    cultureFitScore: number;
    recommendedRole: string;
  };
  status: 'Draft' | 'Submitted' | 'In Review' | 'Approved' | 'Rejected' | 'Placed';
  schoolMentor?: string;
  industryMentor?: string;
  placementHistory: PlacementHistoryEntry[];
}

export interface PlacementHistoryEntry {
  id: string;
  date: string;
  action: string;
  previousPlacement?: string;
  newPlacement: string;
  changedBy: string;
  reason: string;
}

// 8.5 Student Onboarding Profile & Readiness
export interface StudentOnboardingProfile {
  studentId: string;
  studentName: string;
  nisn: string;
  nis: string;
  gender: 'Laki-laki' | 'Perempuan';
  bloodType: 'A' | 'B' | 'AB' | 'O' | 'Rh+';
  phone: string;
  emergencyContact: {
    name: string;
    relationship: 'Orang Tua' | 'Wali' | 'Kerabat';
    phone: string;
    address: string;
  };
  documents: {
    parentPermissionLetter: boolean;
    integrityPact: boolean;
    bpjsKetenagakerjaan: boolean;
    cvPortfolio: boolean;
    medicalCertificate: boolean;
  };
  orientationChecklist: {
    k3SafetyInduction: boolean;
    companyRulesBriefing: boolean;
    professionalEthics: boolean;
    curriculumTargetSync: boolean;
  };
  readinessPercentage: number;
  status: 'Ready' | 'In Progress' | 'Incomplete';
}

// 8.7 Daily Journal Extended
export interface DailyJournalEntry {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  title: string;
  activityDescription: string;
  relatedCompetencies: string[];
  evidenceAttachments: {
    type: 'photo' | 'document' | 'link';
    name: string;
    url: string;
  }[];
  status: 'pending' | 'approved' | 'rejected' | 'revision_required';
  industryFeedback?: string;
  teacherFeedback?: string;
  reviewedByIndustryMentor?: string;
  reviewedAt?: string;
}

// 8.9 Supervision Log & Schedule
export interface SupervisionSchedule {
  id: string;
  teacherMentorId: string;
  teacherName: string;
  industryId: string;
  industryName: string;
  visitDate: string;
  type: 'On-site Visit' | 'Virtual Sync' | 'Emergency Call';
  studentNames: string[];
  status: 'Scheduled' | 'Completed' | 'Pending Follow-up';
  findings: string;
  issues: string;
  actionPlan: string;
  dueDate: string;
  resolutionStatus: 'Open' | 'In Progress' | 'Resolved';
}

// 8.10 Assessment Extended Rubrics
export interface StudentAssessment {
  id: string;
  placementId: string;
  studentId: string;
  studentName: string;
  department: string;
  companyName: string;
  // Multi-aspect rubrics
  technicalSkillScore: number; // 40% weight
  softSkillScore: number; // 20% weight
  disciplineScore: number; // 15% weight
  communicationScore: number; // 10% weight
  teamworkScore: number; // 10% weight
  safetyK3Score: number; // 5% weight
  
  industryMentorScore: number; // 60% combined
  teacherMentorScore: number; // 40% combined
  finalNumericalScore: number; // 0 - 100
  finalGrade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C';
  status: 'Draft' | 'Pending Industry' | 'Pending School' | 'Locked_Finalized';
  industryMentorFeedback: string;
  teacherMentorFeedback: string;
  finalizedAt?: string;
  finalizedBy?: string;
}

// 8.12 Certificate & Portfolio
export interface StudentCertificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  nisn: string;
  schoolName: string;
  industryPartnerName: string;
  programTitle: string;
  completionDate: string;
  totalInternshipHours: number;
  finalScore: number;
  finalGrade: string;
  qrVerificationUrl: string;
  isGenerated: boolean;
  competenciesAchieved: string[];
  downloadUrl?: string;
}

// ============================================================================
// 11. ERD – LOGICAL DATA MODEL (Normalized Entity Map & DDL Baseline)
// ============================================================================

export interface ErdEntityColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  fkRef?: string;
  isNullable?: boolean;
  description: string;
}

export interface ErdEntityDefinition {
  id: string;
  name: string;
  group: 'USERS' | 'SCHOOLS' | 'STUDENTS' | 'COMPETENCIES' | 'OPERATIONS' | 'ASSESSMENTS' | 'CERTIFICATES' | 'SYSTEM';
  parentEntity?: string;
  childEntities?: string[];
  description: string;
  columns: ErdEntityColumn[];
}

export interface ErdRelation {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  relationType: '1:1' | '1:N' | 'N:M';
  description: string;
}

export interface ErdCoreTableSummary {
  entity: string;
  keyFields: string;
  group: 'USERS' | 'SCHOOLS' | 'STUDENTS' | 'COMPETENCIES' | 'OPERATIONS' | 'ASSESSMENTS' | 'CERTIFICATES' | 'SYSTEM';
  description: string;
  totalFields: number;
}
