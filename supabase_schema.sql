-- ======================================================================================
-- AKTARA VOCATIONAL SUITE — POSTGRESQL & SUPABASE DATABASE SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Phase 1: Authentication, Authoritative RBAC, Multi-Tenant Isolation & Role Policies
-- ======================================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ROLES TABLE
CREATE TABLE IF NOT EXISTS public.roles (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.roles (code, name, description) VALUES
('SUPER_ADMIN', 'Super Administrator', 'Akses platform-wide pusat kementerian dan tata kelola global'),
('SCHOOL_ADMIN', 'Admin Sekolah', 'Kelola program magang, siswa, dan penempatan sekolah'),
('SCHOOL_MENTOR', 'Guru Pembimbing', 'Monitor dan supervisi siswa yang dibimbing di sekolah'),
('STUDENT', 'Siswa', 'Aktivitas magang, presensi GPS, jurnal harian, dan portofolio'),
('INDUSTRY_ADMIN', 'Admin Industri', 'Kelola kemitraan industri, unit kerja, dan mentor industri'),
('INDUSTRY_MENTOR', 'Pembimbing Industri', 'Validasi presensi, review jurnal, dan asesmen kompetensi'),
('VIEWER_DINAS', 'Viewer / Dinas', 'Akses analitik agregat regional read-only (tanpa mutasi)')
ON CONFLICT (code) DO NOTHING;

-- 3. TENANTS (SCHOOLS / INDUSTRIES / GOVERNMENT)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('MINISTRY', 'SCHOOL', 'INDUSTRY', 'EDUCATION_AGENCY')),
    code VARCHAR(50) UNIQUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER PROFILES
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    nip_or_nisn VARCHAR(50),
    phone VARCHAR(30),
    department VARCHAR(100),
    title VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. USER ROLES (MANY-TO-MANY RELATIONSHIP SUPPORTING MULTI-ROLE USERS)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role_code VARCHAR(50) NOT NULL REFERENCES public.roles(code) ON DELETE RESTRICT,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    school_id UUID,
    industry_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_code, tenant_id)
);

-- 6. INTERNSHIP PROGRAMS & COHORTS
CREATE TABLE IF NOT EXISTS public.internship_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'RUNNING' CHECK (status IN ('DRAFT', 'OPEN', 'RUNNING', 'COMPLETED')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    capacity INT DEFAULT 50,
    enrolled_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PLACEMENTS
CREATE TABLE IF NOT EXISTS public.placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.internship_programs(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    industry_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    school_mentor_id UUID REFERENCES public.users(id),
    industry_mentor_id UUID REFERENCES public.users(id),
    status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ATTENDANCE (PRESENSI GPS)
CREATE TABLE IF NOT EXISTS public.attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES public.placements(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIME NOT NULL,
    check_out_time TIME,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_name TEXT,
    status VARCHAR(20) DEFAULT 'Present' CHECK (status IN ('Present', 'Late', 'Excused', 'Absent')),
    verified_by_mentor BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. DAILY JOURNALS (LOGBOOK)
CREATE TABLE IF NOT EXISTS public.journals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES public.placements(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    hours INT DEFAULT 8,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    mentor_feedback TEXT,
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. COMPETENCIES & ASSESSMENTS
CREATE TABLE IF NOT EXISTS public.competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES public.internship_programs(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(30) DEFAULT 'Intermediate',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES public.placements(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL REFERENCES public.users(id),
    evaluator_role VARCHAR(50) NOT NULL,
    score_technical DECIMAL(5,2) NOT NULL,
    score_softskills DECIMAL(5,2) NOT NULL,
    score_discipline DECIMAL(5,2) NOT NULL,
    final_grade VARCHAR(5) NOT NULL,
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ======================================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current authenticated user has a specific role
CREATE OR REPLACE FUNCTION public.current_user_has_role(required_role VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role_code = required_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Get current user's school_id
CREATE OR REPLACE FUNCTION public.current_user_school_id()
RETURNS UUID AS $$
DECLARE
    tenant_uuid UUID;
BEGIN
    SELECT tenant_id INTO tenant_uuid
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role_code IN ('SCHOOL_ADMIN', 'SCHOOL_MENTOR')
    LIMIT 1;
    RETURN tenant_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Get current user's industry_id
CREATE OR REPLACE FUNCTION public.current_user_industry_id()
RETURNS UUID AS $$
DECLARE
    tenant_uuid UUID;
BEGIN
    SELECT tenant_id INTO tenant_uuid
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role_code IN ('INDUSTRY_ADMIN', 'INDUSTRY_MENTOR')
    LIMIT 1;
    RETURN tenant_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- SUPER_ADMIN POLICIES (Platform-Wide Access) ---
CREATE POLICY super_admin_all_access_users ON public.users
    FOR ALL TO authenticated
    USING (public.current_user_has_role('SUPER_ADMIN'));

CREATE POLICY super_admin_all_access_placements ON public.placements
    FOR ALL TO authenticated
    USING (public.current_user_has_role('SUPER_ADMIN'));

CREATE POLICY super_admin_all_access_journals ON public.journals
    FOR ALL TO authenticated
    USING (public.current_user_has_role('SUPER_ADMIN'));

-- --- SCHOOL_ADMIN POLICIES (School Tenant Isolation) ---
CREATE POLICY school_admin_select_placements ON public.placements
    FOR SELECT TO authenticated
    USING (school_id = public.current_user_school_id() OR public.current_user_has_role('SUPER_ADMIN'));

CREATE POLICY school_admin_insert_placements ON public.placements
    FOR INSERT TO authenticated
    WITH CHECK (school_id = public.current_user_school_id());

CREATE POLICY school_admin_update_placements ON public.placements
    FOR UPDATE TO authenticated
    USING (school_id = public.current_user_school_id());

-- --- STUDENT POLICIES (Self Record Isolation) ---
CREATE POLICY student_select_own_profile ON public.users
    FOR SELECT TO authenticated
    USING (id = auth.uid() OR public.current_user_has_role('SUPER_ADMIN') OR public.current_user_has_role('SCHOOL_ADMIN'));

CREATE POLICY student_update_own_profile ON public.users
    FOR UPDATE TO authenticated
    USING (id = auth.uid());

CREATE POLICY student_select_own_placements ON public.placements
    FOR SELECT TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY student_insert_own_attendance ON public.attendances
    FOR INSERT TO authenticated
    WITH CHECK (student_id = auth.uid());

CREATE POLICY student_select_own_attendance ON public.attendances
    FOR SELECT TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY student_insert_own_journals ON public.journals
    FOR INSERT TO authenticated
    WITH CHECK (student_id = auth.uid());

CREATE POLICY student_select_own_journals ON public.journals
    FOR SELECT TO authenticated
    USING (student_id = auth.uid());

-- --- INDUSTRY_MENTOR POLICIES (Assigned Interns Validation) ---
CREATE POLICY industry_mentor_select_assigned_placements ON public.placements
    FOR SELECT TO authenticated
    USING (industry_mentor_id = auth.uid() OR industry_id = public.current_user_industry_id());

CREATE POLICY industry_mentor_update_attendances ON public.attendances
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.placements p
            WHERE p.id = attendances.placement_id
            AND (p.industry_mentor_id = auth.uid() OR p.industry_id = public.current_user_industry_id())
        )
    );

CREATE POLICY industry_mentor_update_journals ON public.journals
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.placements p
            WHERE p.id = journals.placement_id
            AND (p.industry_mentor_id = auth.uid() OR p.industry_id = public.current_user_industry_id())
        )
    );

-- --- VIEWER_DINAS POLICIES (Strictly Read-Only Aggregate Access) ---
-- No INSERT, UPDATE, or DELETE policies created for VIEWER_DINAS
CREATE POLICY viewer_dinas_select_all_placements ON public.placements
    FOR SELECT TO authenticated
    USING (public.current_user_has_role('VIEWER_DINAS'));

CREATE POLICY viewer_dinas_select_all_programs ON public.internship_programs
    FOR SELECT TO authenticated
    USING (public.current_user_has_role('VIEWER_DINAS'));

CREATE POLICY viewer_dinas_select_all_tenants ON public.tenants
    FOR SELECT TO authenticated
    USING (public.current_user_has_role('VIEWER_DINAS'));
