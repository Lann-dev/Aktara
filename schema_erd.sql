-- ============================================================================
-- AKTARA VOCATIONAL SUITE • 11.2 CORE TABLES LOGICAL DATA MODEL BASELINE
-- Normalized PostgreSQL / Supabase Schema (UUID PKs & UTC Timestamps)
-- 34 Core Operational Tables
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- or auth_provider reference
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL
);

-- 3. user_roles
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    school_id UUID, -- nullable
    industry_id UUID, -- nullable
    CONSTRAINT uq_user_role_scope UNIQUE (user_id, role_id, school_id, industry_id)
);

-- 4. schools
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    npsn VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(32) NOT NULL DEFAULT 'SMK',
    address TEXT,
    province VARCHAR(64) NOT NULL,
    city VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

-- 5. school_members
CREATE TABLE IF NOT EXISTS school_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    member_type VARCHAR(32) NOT NULL, -- principal, teacher_mentor, school_admin
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    CONSTRAINT uq_school_member UNIQUE (school_id, user_id)
);

-- 6. industries
CREATE TABLE IF NOT EXISTS industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    industry_type VARCHAR(128) NOT NULL,
    address TEXT,
    city VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

-- 7. industry_units
CREATE TABLE IF NOT EXISTS industry_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    address TEXT,
    capacity INT NOT NULL DEFAULT 5,
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

-- 8. industry_members
CREATE TABLE IF NOT EXISTS industry_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    member_type VARCHAR(32) NOT NULL, -- hr_admin, lead_mentor, mentor
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    CONSTRAINT uq_industry_member UNIQUE (industry_id, user_id)
);

-- 11. program_majors (Defined early for FK dependencies)
CREATE TABLE IF NOT EXISTS program_majors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL -- nullable if national
);

-- 9. students
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    nisn VARCHAR(32) UNIQUE NOT NULL,
    nis VARCHAR(32) NOT NULL,
    grade VARCHAR(16) NOT NULL,
    major_id UUID NOT NULL REFERENCES program_majors(id) ON DELETE RESTRICT,
    graduation_year INT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

-- 10. student_profiles
CREATE TABLE IF NOT EXISTS student_profiles (
    student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    birth_date DATE NOT NULL,
    gender VARCHAR(16) NOT NULL,
    emergency_contact JSONB NOT NULL,
    address TEXT,
    photo_url TEXT
);

-- 12. internship_programs
CREATE TABLE IF NOT EXISTS internship_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(32) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    capacity INT NOT NULL DEFAULT 30
);

-- 13. program_mentors
CREATE TABLE IF NOT EXISTS program_mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES internship_programs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentor_type VARCHAR(32) NOT NULL, -- school_teacher, industry_mentor
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    CONSTRAINT uq_program_mentor UNIQUE (program_id, user_id)
);

-- 14. applications
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES internship_programs(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status VARCHAR(32) NOT NULL DEFAULT 'Submitted',
    notes TEXT,
    CONSTRAINT uq_program_student UNIQUE (program_id, student_id)
);

-- 15. placements
CREATE TABLE IF NOT EXISTS placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES internship_programs(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES industry_units(id) ON DELETE SET NULL,
    industry_mentor_id UUID NOT NULL REFERENCES users(id),
    school_mentor_id UUID NOT NULL REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

-- 16. placement_history
CREATE TABLE IF NOT EXISTS placement_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
    old_industry_id UUID REFERENCES industries(id) ON DELETE SET NULL,
    old_unit_id UUID REFERENCES industry_units(id) ON DELETE SET NULL,
    old_mentor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT NOT NULL,
    changed_by UUID NOT NULL REFERENCES users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. competencies
CREATE TABLE IF NOT EXISTS competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    major_id UUID NOT NULL REFERENCES program_majors(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

-- 18. competency_versions
CREATE TABLE IF NOT EXISTS competency_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    version_no VARCHAR(32) NOT NULL,
    definition TEXT NOT NULL,
    level_scheme JSONB NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    CONSTRAINT uq_competency_version UNIQUE (competency_id, version_no)
);

-- 19. program_competencies
CREATE TABLE IF NOT EXISTS program_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES internship_programs(id) ON DELETE CASCADE,
    competency_version_id UUID NOT NULL REFERENCES competency_versions(id) ON DELETE CASCADE,
    weight DECIMAL(4,2) NOT NULL DEFAULT 1.00,
    target_level VARCHAR(32) NOT NULL DEFAULT 'Intermediate',
    required BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT uq_program_comp_ver UNIQUE (program_id, competency_version_id)
);

-- 20. student_competencies
CREATE TABLE IF NOT EXISTS student_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
    program_competency_id UUID NOT NULL REFERENCES program_competencies(id) ON DELETE CASCADE,
    current_level VARCHAR(32) NOT NULL DEFAULT 'Basic',
    progress_pct INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'In Progress',
    validated_at TIMESTAMPTZ,
    CONSTRAINT uq_student_comp UNIQUE (placement_id, program_competency_id)
);

-- 21. attendance
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in TIME NOT NULL,
    check_out TIME,
    status VARCHAR(32) NOT NULL DEFAULT 'Present',
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    notes TEXT,
    verified_by UUID REFERENCES users(id),
    CONSTRAINT uq_placement_date UNIQUE (placement_id, attendance_date)
);

-- 22. journals
CREATE TABLE IF NOT EXISTS journals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
    journal_date DATE NOT NULL,
    activity_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ
);

-- 23. journal_evidence
CREATE TABLE IF NOT EXISTS journal_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_id UUID NOT NULL REFERENCES journals(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type VARCHAR(32) NOT NULL,
    caption VARCHAR(255)
);

-- 24. competency_evidence
CREATE TABLE IF NOT EXISTS competency_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_competency_id UUID NOT NULL REFERENCES student_competencies(id) ON DELETE CASCADE,
    journal_id UUID REFERENCES journals(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    description TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ
);

-- 25. supervisions
CREATE TABLE IF NOT EXISTS supervisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES users(id),
    supervision_date DATE NOT NULL,
    mode VARCHAR(32) NOT NULL DEFAULT 'On-site Visit',
    summary TEXT NOT NULL,
    risk_level VARCHAR(32) NOT NULL DEFAULT 'Low',
    status VARCHAR(32) NOT NULL DEFAULT 'Scheduled'
);

-- 26. supervision_actions
CREATE TABLE IF NOT EXISTS supervision_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supervision_id UUID NOT NULL REFERENCES supervisions(id) ON DELETE CASCADE,
    action_item TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id),
    due_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Open',
    completed_at TIMESTAMPTZ
);

-- 27. assessment_templates
CREATE TABLE IF NOT EXISTS assessment_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES internship_programs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(32) NOT NULL DEFAULT 'v1.0',
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

-- 28. assessment_items
CREATE TABLE IF NOT EXISTS assessment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES assessment_templates(id) ON DELETE CASCADE,
    competency_id UUID REFERENCES competencies(id) ON DELETE SET NULL,
    code VARCHAR(64) NOT NULL,
    category VARCHAR(128) NOT NULL,
    indicator TEXT NOT NULL,
    max_score DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    weight DECIMAL(4,2) NOT NULL DEFAULT 1.00
);

-- 29. assessments
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES assessment_templates(id) ON DELETE CASCADE,
    assessor_id UUID NOT NULL REFERENCES users(id),
    assessor_type VARCHAR(32) NOT NULL, -- industry_mentor, school_teacher
    score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'Draft',
    submitted_at TIMESTAMPTZ,
    finalized_at TIMESTAMPTZ
);

-- 30. assessment_scores
CREATE TABLE IF NOT EXISTS assessment_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    assessment_item_id UUID NOT NULL REFERENCES assessment_items(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    note TEXT,
    CONSTRAINT uq_assessment_item_score UNIQUE (assessment_id, assessment_item_id)
);

-- 31. certificates
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    placement_id UUID NOT NULL UNIQUE REFERENCES placements(id) ON DELETE CASCADE,
    certificate_no VARCHAR(128) UNIQUE NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    verification_token VARCHAR(255) UNIQUE NOT NULL,
    file_url TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'active'
);

-- 32. certificate_verifications
CREATE TABLE IF NOT EXISTS certificate_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id UUID NOT NULL REFERENCES certificates(id) ON DELETE CASCADE,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    verifier_ip_hash VARCHAR(64)
);

-- 33. notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 34. audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(128) NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- PERFORMANCE & INTEGRITY INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_students_user ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_major ON students(major_id);
CREATE INDEX IF NOT EXISTS idx_placements_student ON placements(student_id);
CREATE INDEX IF NOT EXISTS idx_placements_program ON placements(program_id);
CREATE INDEX IF NOT EXISTS idx_placements_industry ON placements(industry_id);
CREATE INDEX IF NOT EXISTS idx_attendance_placement_date ON attendance(placement_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_journals_placement_date ON journals(placement_id, journal_date);
CREATE INDEX IF NOT EXISTS idx_student_competencies_placement ON student_competencies(placement_id);
CREATE INDEX IF NOT EXISTS idx_supervisions_placement ON supervisions(placement_id);
CREATE INDEX IF NOT EXISTS idx_assessments_placement ON assessments(placement_id);
CREATE INDEX IF NOT EXISTS idx_certificates_token ON certificates(verification_token);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read_at);
