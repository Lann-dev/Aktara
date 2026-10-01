-- ======================================================================
-- AKTARA VOCATIONAL INTERNSHIP MANAGEMENT PLATFORM
-- PostgreSQL Database Schema & Row-Level Security (RLS) Policies
-- ======================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ======================================================================
-- 2. ENUMS & CONSTANTS
-- ======================================================================
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM (
        'SUPER_ADMIN',
        'SCHOOL_ADMIN',
        'SCHOOL_MENTOR',
        'STUDENT',
        'INDUSTRY_ADMIN',
        'INDUSTRY_MENTOR',
        'VIEWER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE program_status_type AS ENUM ('DRAFT', 'OPEN', 'RUNNING', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status_type AS ENUM ('DRAFT', 'SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'PLACED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status_type AS ENUM ('PRESENT', 'LATE', 'EXCUSED', 'ABSENT', 'HOLIDAY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE journal_status_type AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVISION_REQUIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE competency_level_type AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE competency_status_type AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED', 'NEEDS_IMPROVEMENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ======================================================================
-- 3. CORE USERS & ROLES
-- ======================================================================

-- 3.1 Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code user_role_type UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Users Table (Synced with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    title VARCHAR(150),
    department VARCHAR(150),
    nip_or_nisn VARCHAR(50),
    phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 User Roles Mapping (Supports Multi-Role)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- ======================================================================
-- 4. ORGANIZATIONS (SCHOOLS & INDUSTRIES)
-- ======================================================================

-- 4.1 Schools Table
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    npsn VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    principal_name VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.2 School Members (Staff / Teachers belonging to a School)
CREATE TABLE IF NOT EXISTS public.school_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    position VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, user_id)
);

-- 4.3 Industries (DUDI Partners)
CREATE TABLE IF NOT EXISTS public.industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    mou_number VARCHAR(100),
    mou_valid_until DATE,
    quota_total INT DEFAULT 0,
    quota_used INT DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 4.50,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.4 Industry Units / Branches / Departments
CREATE TABLE IF NOT EXISTS public.industry_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    unit_head VARCHAR(255),
    active_interns INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.5 Industry Members (Corporate Mentors & Admins)
CREATE TABLE IF NOT EXISTS public.industry_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.industry_units(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    position VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(industry_id, user_id)
);

-- ======================================================================
-- 5. ACADEMIC & VOCATIONAL STRUCTURE
-- ======================================================================

-- 5.1 Program Majors (Program Keahlian SMK)
CREATE TABLE IF NOT EXISTS public.program_majors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    curriculum VARCHAR(100) DEFAULT 'Kurikulum Merdeka',
    duration_months INT DEFAULT 6,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.2 Students Master Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    major_id UUID REFERENCES public.program_majors(id) ON DELETE SET NULL,
    nisn VARCHAR(30) UNIQUE NOT NULL,
    nis VARCHAR(30) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    gender VARCHAR(20),
    blood_type VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.3 Student Profiles & Onboarding Readiness
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID UNIQUE NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    emergency_contact JSONB DEFAULT '{}'::jsonb,
    documents JSONB DEFAULT '{"parentPermissionLetter": false, "integrityPact": false, "bpjsKetenagakerjaan": false, "cvPortfolio": false, "medicalCertificate": false}'::jsonb,
    orientation_checklist JSONB DEFAULT '{"k3SafetyInduction": false, "companyRulesBriefing": false, "professionalEthics": false, "curriculumTargetSync": false}'::jsonb,
    readiness_percentage INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'In Progress',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.4 Internship Programs / Cohorts
CREATE TABLE IF NOT EXISTS public.internship_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    major_id UUID REFERENCES public.program_majors(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    status program_status_type DEFAULT 'OPEN',
    duration VARCHAR(50) DEFAULT '6 Bulan',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    capacity INT DEFAULT 50,
    enrolled INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.5 Program Mentors Assignment
CREATE TABLE IF NOT EXISTS public.program_mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.internship_programs(id) ON DELETE CASCADE,
    mentor_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(program_id, mentor_user_id)
);

-- ======================================================================
-- 6. APPLICATIONS & PLACEMENTS (GANESA ID MATCHING)
-- ======================================================================

-- 6.1 Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.internship_programs(id) ON DELETE CASCADE,
    industry_id UUID NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.industry_units(id) ON DELETE SET NULL,
    ganesa_match_score NUMERIC(5,2) DEFAULT 0.00,
    ganesa_fit_details JSONB DEFAULT '{}'::jsonb,
    status application_status_type DEFAULT 'SUBMITTED',
    submission_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.2 Placements Table
CREATE TABLE IF NOT EXISTS public.placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID UNIQUE REFERENCES public.applications(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.internship_programs(id) ON DELETE CASCADE,
    industry_id UUID NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.industry_units(id) ON DELETE SET NULL,
    school_mentor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    industry_mentor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'TRANSFERRED', 'TERMINATED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.3 Placement History (Audit of reassignment / changes)
CREATE TABLE IF NOT EXISTS public.placement_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES public.placements(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    previous_placement TEXT,
    new_placement TEXT NOT NULL,
    changed_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================================
-- 7. COMPETENCIES & TRACKING
-- ======================================================================

-- 7.1 Competencies Table (SKKNI & Curriculum Standard)
CREATE TABLE IF NOT EXISTS public.competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    major_id UUID REFERENCES public.program_majors(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level competency_level_type DEFAULT 'BASIC',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.2 Competency Versions
CREATE TABLE IF NOT EXISTS public.competency_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competency_id UUID NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
    version_number VARCHAR(20) NOT NULL,
    standard_name VARCHAR(100) DEFAULT 'SKKNI 2024',
    effective_year INT DEFAULT 2024,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.3 Program Competencies (Target competencies per program)
CREATE TABLE IF NOT EXISTS public.program_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.internship_programs(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
    target_score INT DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(program_id, competency_id)
);

-- 7.4 Student Competencies Mastery Tracking
CREATE TABLE IF NOT EXISTS public.student_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
    percentage INT DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
    status competency_status_type DEFAULT 'NOT_STARTED',
    verified_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, competency_id)
);

-- 7.5 Competency Evidence (Artifacts uploaded by student)
CREATE TABLE IF NOT EXISTS public.competency_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_competency_id UUID NOT NULL REFERENCES public.student_competencies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size_bytes BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================================
-- 8. ATTENDANCE & JOURNALS
-- ======================================================================

-- 8.1 Attendance Logs Table (Enforces single log per placement per day)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES public.placements(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    location_name VARCHAR(255),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    photo_url TEXT,
    status attendance_status_type DEFAULT 'PRESENT',
    verified_by_mentor BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(placement_id, attendance_date)
);

-- 8.2 Daily Journals Table
CREATE TABLE IF NOT EXISTS public.journals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES public.placements(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    journal_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_hours NUMERIC(4, 2) DEFAULT 8.00,
    title VARCHAR(255) NOT NULL,
    activity_description TEXT NOT NULL,
    related_competencies JSONB DEFAULT '[]'::jsonb,
    status journal_status_type DEFAULT 'PENDING',
    industry_feedback TEXT,
    teacher_feedback TEXT,
    reviewed_by_industry_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8.3 Journal Evidence Attachments
CREATE TABLE IF NOT EXISTS public.journal_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_id UUID NOT NULL REFERENCES public.journals(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('photo', 'document', 'link')),
    name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================================
-- 9. SUPERVISIONS & ISSUES
-- ======================================================================

-- 9.1 Supervisions Table
CREATE TABLE IF NOT EXISTS public.supervisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    industry_id UUID NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'On-site Visit' CHECK (type IN ('On-site Visit', 'Virtual Sync', 'Emergency Call')),
    findings TEXT,
    issues TEXT,
    action_plan TEXT,
    due_date DATE,
    resolution_status VARCHAR(30) DEFAULT 'Open' CHECK (resolution_status IN ('Open', 'In Progress', 'Resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9.2 Supervision Actions & Students Linked
CREATE TABLE IF NOT EXISTS public.supervision_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supervision_id UUID NOT NULL REFERENCES public.supervisions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================================
-- 10. ASSESSMENTS & RUBRICS
-- ======================================================================

-- 10.1 Assessment Templates
CREATE TABLE IF NOT EXISTS public.assessment_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    major_id UUID REFERENCES public.program_majors(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    weights JSONB DEFAULT '{"technical": 40, "softSkills": 20, "discipline": 15, "communication": 10, "teamwork": 10, "k3Safety": 5}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10.2 Assessment Items
CREATE TABLE IF NOT EXISTS public.assessment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.assessment_templates(id) ON DELETE CASCADE,
    aspect_name VARCHAR(100) NOT NULL,
    max_score INT DEFAULT 100,
    weight_pct INT NOT NULL,
    evaluator_role VARCHAR(50) DEFAULT 'INDUSTRY_MENTOR'
);

-- 10.3 Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID UNIQUE NOT NULL REFERENCES public.placements(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.assessment_templates(id) ON DELETE SET NULL,
    technical_skill_score NUMERIC(5,2) DEFAULT 0,
    soft_skill_score NUMERIC(5,2) DEFAULT 0,
    discipline_score NUMERIC(5,2) DEFAULT 0,
    communication_score NUMERIC(5,2) DEFAULT 0,
    teamwork_score NUMERIC(5,2) DEFAULT 0,
    safety_k3_score NUMERIC(5,2) DEFAULT 0,
    industry_mentor_score NUMERIC(5,2) DEFAULT 0,
    teacher_mentor_score NUMERIC(5,2) DEFAULT 0,
    final_numerical_score NUMERIC(5,2) DEFAULT 0,
    final_grade VARCHAR(5) DEFAULT 'B',
    status VARCHAR(30) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending Industry', 'Pending School', 'Locked_Finalized')),
    industry_mentor_feedback TEXT,
    teacher_mentor_feedback TEXT,
    finalized_at TIMESTAMPTZ,
    finalized_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10.4 Assessment Scores (Detailed itemized breakdown)
CREATE TABLE IF NOT EXISTS public.assessment_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.assessment_items(id) ON DELETE CASCADE,
    given_score NUMERIC(5,2) NOT NULL,
    evaluator_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================================
-- 11. CERTIFICATES & VERIFICATION
-- ======================================================================

-- 11.1 Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number VARCHAR(100) UNIQUE NOT NULL,
    student_id UUID UNIQUE NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    placement_id UUID REFERENCES public.placements(id) ON DELETE SET NULL,
    program_id UUID REFERENCES public.internship_programs(id) ON DELETE SET NULL,
    completion_date DATE NOT NULL,
    total_internship_hours INT DEFAULT 800,
    final_score NUMERIC(5,2) NOT NULL,
    final_grade VARCHAR(5) NOT NULL,
    verification_token VARCHAR(100) UNIQUE NOT NULL,
    qr_verification_url TEXT NOT NULL,
    file_url TEXT,
    status VARCHAR(30) DEFAULT 'ISSUED' CHECK (status IN ('DRAFT', 'ISSUED', 'REVOKED')),
    competencies_achieved JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11.2 Certificate Verifications Log
CREATE TABLE IF NOT EXISTS public.certificate_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id UUID NOT NULL REFERENCES public.certificates(id) ON DELETE CASCADE,
    verifier_ip VARCHAR(50),
    user_agent TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================================
-- 12. NOTIFICATIONS & AUDIT LOGS
-- ======================================================================

-- 12.1 Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info' CHECK (type IN ('info', 'alert', 'success', 'warning', 'action_required')),
    category VARCHAR(50) DEFAULT 'system',
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12.2 Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_email VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    tenant_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'WARNING', 'FAILED')),
    details TEXT NOT NULL,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================================
-- 13. INDEXES FOR HIGH QUERY PERFORMANCE
-- ======================================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON public.students(school_id);
CREATE INDEX IF NOT EXISTS idx_placements_student_id ON public.placements(student_id);
CREATE INDEX IF NOT EXISTS idx_placements_industry_id ON public.placements(industry_id);
CREATE INDEX IF NOT EXISTS idx_placements_school_mentor ON public.placements(school_mentor_id);
CREATE INDEX IF NOT EXISTS idx_placements_industry_mentor ON public.placements(industry_mentor_id);
CREATE INDEX IF NOT EXISTS idx_attendance_placement_date ON public.attendance(placement_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_journals_placement_date ON public.journals(placement_id, journal_date);
CREATE INDEX IF NOT EXISTS idx_student_competencies_student ON public.student_competencies(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ======================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ======================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
    SELECT r.code::text 
    FROM public.user_roles ur 
    JOIN public.roles r ON ur.role_id = r.id 
    WHERE ur.user_id = auth.uid() 
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_school_id()
RETURNS UUID AS $$
    SELECT school_id FROM public.school_members WHERE user_id = auth.uid()
    UNION
    SELECT school_id FROM public.students WHERE user_id = auth.uid()
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_industry_id()
RETURNS UUID AS $$
    SELECT industry_id FROM public.industry_members WHERE user_id = auth.uid()
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Public & Authenticated Read Policies
CREATE POLICY "Allow public read on basic master data" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Allow public read on industries" ON public.industries FOR SELECT USING (true);
CREATE POLICY "Allow public read on industry units" ON public.industry_units FOR SELECT USING (true);

-- User Profile Read
CREATE POLICY "Users can read own profile or admin can read all" ON public.users
FOR SELECT USING (
    auth.uid() = id OR 
    public.get_current_user_role() IN ('SUPER_ADMIN', 'VIEWER') OR
    EXISTS (SELECT 1 FROM public.school_members sm WHERE sm.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.industry_members im WHERE im.user_id = auth.uid())
);

-- Students Isolation Policy
CREATE POLICY "Students RLS" ON public.students
FOR SELECT USING (
    user_id = auth.uid() OR
    school_id = public.get_current_school_id() OR
    public.get_current_user_role() IN ('SUPER_ADMIN', 'VIEWER') OR
    EXISTS (
        SELECT 1 FROM public.placements p 
        WHERE p.student_id = public.students.id 
        AND (p.industry_id = public.get_current_industry_id() OR p.industry_mentor_id = auth.uid() OR p.school_mentor_id = auth.uid())
    )
);

-- Attendance Isolation Policy
CREATE POLICY "Attendance RLS" ON public.attendance
FOR ALL USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
    placement_id IN (
        SELECT id FROM public.placements 
        WHERE school_mentor_id = auth.uid() 
           OR industry_mentor_id = auth.uid()
           OR industry_id = public.get_current_industry_id()
    ) OR
    public.get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'VIEWER')
);

-- Journals Isolation Policy
CREATE POLICY "Journals RLS" ON public.journals
FOR ALL USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()) OR
    placement_id IN (
        SELECT id FROM public.placements 
        WHERE school_mentor_id = auth.uid() 
           OR industry_mentor_id = auth.uid()
           OR industry_id = public.get_current_industry_id()
    ) OR
    public.get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'VIEWER')
);

-- Notifications Policy
CREATE POLICY "Users only see own notifications" ON public.notifications
FOR ALL USING (user_id = auth.uid());

-- Audit Logs Policy (Super Admin & School Admin)
CREATE POLICY "Audit logs visible to admins" ON public.audit_logs
FOR SELECT USING (public.get_current_user_role() IN ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'VIEWER'));

-- Certificate Verification Public Read
CREATE POLICY "Public verify certificates" ON public.certificates FOR SELECT USING (true);
