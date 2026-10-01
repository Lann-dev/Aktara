-- ======================================================================
-- AKTARA VOCATIONAL INTERNSHIP MANAGEMENT PLATFORM
-- Database Seed Script for Development / Testing (seed.sql)
-- ======================================================================

-- 1. Insert Roles
INSERT INTO public.roles (id, code, name, description) VALUES
('11111111-1111-1111-1111-111111111101', 'SUPER_ADMIN', 'Super Admin Sistem', 'Akses penuh seluruh tenant, audit, dan manajemen global'),
('11111111-1111-1111-1111-111111111102', 'SCHOOL_ADMIN', 'Admin Sekolah / Hubin SMK', 'Pengelola program magang, kuota sekolah, dan monitoring siswa'),
('11111111-1111-1111-1111-111111111103', 'SCHOOL_MENTOR', 'Guru Pembimbing Sekolah', 'Pembimbing lapangan sekolah, supervisi, dan validasi kompetensi'),
('11111111-1111-1111-1111-111111111104', 'STUDENT', 'Siswa Peserta Magang (SMK)', 'Peserta magang, presensi GPS, jurnal harian, dan portofolio'),
('11111111-1111-1111-1111-111111111105', 'INDUSTRY_ADMIN', 'Admin Mitra Industri (DUDI)', 'Pengelola kuota industri, penerimaan penempatan, dan PIC kemitraan'),
('11111111-1111-1111-1111-111111111106', 'INDUSTRY_MENTOR', 'Mentor / Instruktur DUDI', 'Pembimbing teknis industri, approval jurnal harian, dan penilaian'),
('11111111-1111-1111-1111-111111111107', 'VIEWER', 'Pengawas Dinas / Auditor', 'Akses analitik agregat, audit kepatuhan, dan pelaporan')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. Insert Users
INSERT INTO public.users (id, email, name, avatar_url, title, department, nip_or_nisn, phone, status) VALUES
('22222222-2222-2222-2222-222222222201', 'admin@aktara.test', 'Dr. Arya Wirawan, M.Kom', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Super Administrator Platform', 'Direktorat Mitras DUDI', '198503152010011005', '+62 811-2345-6789', 'active'),
('22222222-2222-2222-2222-222222222202', 'school.admin@aktara.test', 'Drs. Bambang Sudarmono, M.Pd', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Kepala Program & Hubin SMK', 'Hubungan Industri & BKK', '197608122005011003', '+62 812-9876-5432', 'active'),
('22222222-2222-2222-2222-222222222203', 'mentor@aktara.test', 'Sri Wahyuni, S.Kom, Gr.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Guru Pembimbing Praktik Vokasi', 'Rekayasa Perangkat Lunak', '198809202015022001', '+62 813-1122-3344', 'active'),
('22222222-2222-2222-2222-222222222204', 'student@aktara.test', 'Dimas Prasetyo Nugroho', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'Siswa Magang (RPL 1)', 'Rekayasa Perangkat Lunak', '0068492019', '+62 857-4433-2211', 'active'),
('22222222-2222-2222-2222-222222222205', 'student2@aktara.test', 'Alya Putri Maharani', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Siswi Magang (TKJ 2)', 'Teknik Komputer Jaringan', '0068492020', '+62 858-5544-3322', 'active'),
('22222222-2222-2222-2222-222222222206', 'student3@aktara.test', 'Rizky Maulana', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Siswa Magang (DKV 1)', 'Desain Komunikasi Visual', '0068492021', '+62 859-6655-4433', 'active'),
('22222222-2222-2222-2222-222222222207', 'industry.admin@aktara.test', 'Hendro Wicaksono, S.T.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'Head of People & Talents', 'Human Resources Division', 'DUDI-IND-2021-001', '+62 821-3344-5566', 'active'),
('22222222-2222-2222-2222-222222222208', 'industry.mentor@aktara.test', 'Bayu Pratama, S.Kom', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'Senior Software Engineer / Tech Lead', 'Engineering & Product Unit', 'TECH-LEAD-088', '+62 822-7788-9900', 'active'),
('22222222-2222-2222-2222-222222222209', 'viewer@aktara.test', 'Dra. Endang Sulistyowati, M.M.', 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150', 'Pengawas Vokasi Wilayah', 'Balai Pengawasan Pendidikan', '196804101994032002', '+62 811-9988-7766', 'active')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, title = EXCLUDED.title, department = EXCLUDED.department;

-- 3. Link Users to Roles
INSERT INTO public.user_roles (user_id, role_id, is_primary) VALUES
('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', true),
('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102', true),
('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111103', true),
('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111104', true),
('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111104', true),
('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111104', true),
('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111105', true),
('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111106', true),
('22222222-2222-2222-2222-222222222209', '11111111-1111-1111-1111-111111111107', true)
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 4. Schools & School Members
INSERT INTO public.schools (id, npsn, name, province, city, address, principal_name, phone, status) VALUES
('33333333-3333-3333-3333-333333333301', '20101234', 'SMK Negeri 1 Jakarta Pusat', 'DKI Jakarta', 'Jakarta Pusat', 'Jl. Budi Utomo No. 7, Sawah Besar', 'Dr. Purwanto, M.Pd.', '+62 21 3840234', 'active'),
('33333333-3333-3333-3333-333333333302', '20205678', 'SMK Negeri 2 Bandung', 'Jawa Barat', 'Bandung', 'Jl. Cihampelas No. 2, Bandung', 'Hj. Nenden Lilis, M.Pd.', '+62 22 4235678', 'active'),
('33333333-3333-3333-3333-333333333303', '20509988', 'SMK Telkom Malang', 'Jawa Timur', 'Malang', 'Jl. Danau Ranau, Sawojajar', 'Rahmat Dwi Djatmiko, S.Kom.', '+62 341 712500', 'active')
ON CONFLICT (npsn) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address;

INSERT INTO public.school_members (school_id, user_id, position) VALUES
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', 'Koordinator BKK & Hubin'),
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', 'Guru Pembimbing Prakerin')
ON CONFLICT (school_id, user_id) DO NOTHING;

-- 5. Industries & Units
INSERT INTO public.industries (id, name, sector, city, address, mou_number, mou_valid_until, quota_total, quota_used, rating, status) VALUES
('44444444-4444-4444-4444-444444444401', 'PT Telkom Indonesia (Persero) Tbk', 'Teknologi Informasi & Komunikasi', 'Jakarta Selatan', 'The Telkom Hub, Jl. Gatot Subroto Kav. 52', 'MOU-TLK-2024-001', '2026-12-31', 45, 32, 4.90, 'active'),
('44444444-4444-4444-4444-444444444402', 'PT Astra International Tbk', 'Manufaktur Otomotif & Mesin', 'Jakarta Utara', 'Jl. Gaya Motor Raya No. 8, Sunter II', 'MOU-AST-2024-089', '2025-10-30', 30, 20, 4.85, 'active'),
('44444444-4444-4444-4444-444444444403', 'PT Bank Mandiri (Persero) Tbk', 'Fintech & Perbankan Digital', 'Jakarta Selatan', 'Plaza Mandiri, Jl. Jend. Gatot Subroto Kav. 36', 'MOU-MND-2024-112', '2026-08-15', 25, 18, 4.80, 'active'),
('44444444-4444-4444-4444-444444444404', 'PT Tokopedia (GoTo Group)', 'E-Commerce & Internet', 'Jakarta Selatan', 'Tokopedia Tower Ciputra World 2', 'MOU-GTO-2024-045', '2025-12-31', 20, 15, 4.95, 'active')
ON CONFLICT (id) DO UPDATE SET quota_total = EXCLUDED.quota_total, quota_used = EXCLUDED.quota_used;

INSERT INTO public.industry_units (id, industry_id, name, address, unit_head, active_interns, status) VALUES
('44444444-4444-4444-4444-444444444411', '44444444-4444-4444-4444-444444444401', 'Divisi Digital Product & Cloud Engineering', 'Telkom Landmark Tower Lt. 18', 'Bayu Pratama, S.Kom', 12, 'active'),
('44444444-4444-4444-4444-444444444412', '44444444-4444-4444-4444-444444444401', 'Network Operation Center (NOC) & Infra', 'Telkom STO Gambir', 'Agus Salim, M.T.', 8, 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.industry_members (industry_id, unit_id, user_id, position) VALUES
('44444444-4444-4444-4444-444444444401', '44444444-4444-4444-4444-444444444411', '22222222-2222-2222-2222-222222222207', 'Head of People & Talents DUDI'),
('44444444-4444-4444-4444-444444444401', '44444444-4444-4444-4444-444444444411', '22222222-2222-2222-2222-222222222208', 'Lead Engineering Mentor')
ON CONFLICT (industry_id, user_id) DO NOTHING;

-- 6. Program Majors
INSERT INTO public.program_majors (id, code, name, curriculum, duration_months, status) VALUES
('55555555-5555-5555-5555-555555555501', 'RPL-01', 'Rekayasa Perangkat Lunak & Game', 'Kurikulum Merdeka 2024', 6, 'active'),
('55555555-5555-5555-5555-555555555502', 'TKJ-02', 'Teknik Jaringan Komputer & Telekomunikasi', 'Kurikulum Merdeka 2024', 6, 'active'),
('55555555-5555-5555-5555-555555555503', 'DKV-03', 'Desain Komunikasi Visual & Animasi', 'Kurikulum Merdeka 2024', 6, 'active'),
('55555555-5555-5555-5555-555555555504', 'OTKP-04', 'Manajemen Perkantoran & Layanan Bisnis', 'Kurikulum Merdeka 2024', 6, 'active')
ON CONFLICT (code) DO NOTHING;

-- 7. Students & Profiles
INSERT INTO public.students (id, user_id, school_id, major_id, nisn, nis, class_name, gender, blood_type) VALUES
('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222204', '33333333-3333-3333-3333-333333333301', '55555555-5555-5555-5555-555555555501', '0068492019', '212210045', 'XII RPL 1', 'Laki-laki', 'O'),
('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222205', '33333333-3333-3333-3333-333333333301', '55555555-5555-5555-5555-555555555502', '0068492020', '212210046', 'XII TKJ 2', 'Perempuan', 'A'),
('66666666-6666-6666-6666-666666666603', '22222222-2222-2222-2222-222222222206', '33333333-3333-3333-3333-333333333301', '55555555-5555-5555-5555-555555555503', '0068492021', '212210047', 'XII DKV 1', 'Laki-laki', 'B')
ON CONFLICT (nisn) DO NOTHING;

INSERT INTO public.student_profiles (student_id, emergency_contact, documents, orientation_checklist, readiness_percentage, status) VALUES
('66666666-6666-6666-6666-666666666601', '{"name": "Ir. Joko Prasetyo", "relation": "Ayah Kandung", "phone": "+62 812-3344-5566", "address": "Jl. Melati No. 12, Jakarta"}'::jsonb, '{"parentPermissionLetter": true, "integrityPact": true, "bpjsKetenagakerjaan": true, "cvPortfolio": true, "medicalCertificate": true}'::jsonb, '{"k3SafetyInduction": true, "companyRulesBriefing": true, "professionalEthics": true, "curriculumTargetSync": true}'::jsonb, 100, 'Ready For Placement'),
('66666666-6666-6666-6666-666666666602', '{"name": "Dra. Siti Aminah", "relation": "Ibu Kandung", "phone": "+62 813-9988-7766", "address": "Jl. Anggrek No. 5, Jakarta"}'::jsonb, '{"parentPermissionLetter": true, "integrityPact": true, "bpjsKetenagakerjaan": true, "cvPortfolio": true, "medicalCertificate": false}'::jsonb, '{"k3SafetyInduction": true, "companyRulesBriefing": true, "professionalEthics": false, "curriculumTargetSync": true}'::jsonb, 75, 'In Progress'),
('66666666-6666-6666-6666-666666666603', '{"name": "Agus Maulana", "relation": "Ayah Kandung", "phone": "+62 815-4433-2211", "address": "Jl. Mawar No. 8, Jakarta"}'::jsonb, '{"parentPermissionLetter": true, "integrityPact": true, "bpjsKetenagakerjaan": false, "cvPortfolio": true, "medicalCertificate": false}'::jsonb, '{"k3SafetyInduction": false, "companyRulesBriefing": true, "professionalEthics": false, "curriculumTargetSync": false}'::jsonb, 40, 'In Progress')
ON CONFLICT (student_id) DO NOTHING;

-- 8. Internship Programs
INSERT INTO public.internship_programs (id, school_id, major_id, title, academic_year, status, duration, start_date, end_date, capacity, enrolled, description) VALUES
('77777777-7777-7777-7777-777777777701', '33333333-3333-3333-3333-333333333301', '55555555-5555-5555-5555-555555555501', 'Program Prakerin Unggulan DUDI Telkom Group 2024/2025', '2024/2025 Ganjil', 'RUNNING', '6 Bulan (800 JP)', '2024-07-15', '2024-12-20', 35, 32, 'Penempatan intensif pengembangan software berbasis React, Node.js, Cloud Services, dan DevOps di Telkom Group.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.program_mentors (program_id, mentor_user_id) VALUES
('77777777-7777-7777-7777-777777777701', '22222222-2222-2222-2222-222222222203')
ON CONFLICT (program_id, mentor_user_id) DO NOTHING;

-- 9. Applications & Placements
INSERT INTO public.applications (id, student_id, program_id, industry_id, unit_id, ganesa_match_score, ganesa_fit_details, status, submission_date) VALUES
('88888888-8888-8888-8888-888888888801', '66666666-6666-6666-6666-666666666601', '77777777-7777-7777-7777-777777777701', '44444444-4444-4444-4444-444444444401', '44444444-4444-4444-4444-444444444411', 94.50, '{"logicScore": 96, "problemSolving": 92, "curriculumSync": 95, "recommendation": "Sangat Direkomendasikan"}'::jsonb, 'PLACED', '2024-06-10')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.placements (id, application_id, student_id, program_id, industry_id, unit_id, school_mentor_id, industry_mentor_id, start_date, end_date, status) VALUES
('99999999-9999-9999-9999-999999999901', '88888888-8888-8888-8888-888888888801', '66666666-6666-6666-6666-666666666601', '77777777-7777-7777-7777-777777777701', '44444444-4444-4444-4444-444444444401', '44444444-4444-4444-4444-444444444411', '22222222-2222-2222-2222-222222222203', '22222222-2222-2222-2222-222222222208', '2024-07-15', '2024-12-20', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.placement_history (placement_id, action, previous_placement, new_placement, changed_by_user_id, reason) VALUES
('99999999-9999-9999-9999-999999999901', 'Penempatan Disetujui & Diterbitkan', 'Calon Peserta Magang SMK', 'PT Telkom Indonesia - Divisi Digital Product', '22222222-2222-2222-2222-222222222202', 'Lolos seleksi uji kompetensi GANESA ID dan kuota DUDI terpenuhi.')
ON CONFLICT (id) DO NOTHING;

-- 10. Competencies & Student Competencies
INSERT INTO public.competencies (id, major_id, code, name, category, level, description) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '55555555-5555-5555-5555-555555555501', 'KOMP-RPL-01', 'Frontend Component Architecture (React/TypeScript)', 'Core Programming', 'ADVANCED', 'Mampu merancang komponen antarmuka modular, clean state, dan responsive design sesuai standar industri'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', '55555555-5555-5555-5555-555555555501', 'KOMP-RPL-02', 'RESTful API & Database Integration', 'Backend & Database', 'ADVANCED', 'Mengintegrasikan API endpoint aman, migrasi skema PostgreSQL, dan optimasi query data'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', '55555555-5555-5555-5555-555555555501', 'KOMP-RPL-03', 'Version Control & Git Collaboration', 'DevOps & Tooling', 'INTERMEDIATE', 'Branching strategy, pull request workflow, code review, dan resolve merge conflict'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa04', '55555555-5555-5555-5555-555555555501', 'KOMP-RPL-04', 'K3 & Workplace Ergonomics', 'Safety & Compliance', 'BASIC', 'Penerapan keselamatan kerja, postur ergonomis perangkat digital, dan kepatuhan SOP perusahaan')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.student_competencies (student_id, competency_id, percentage, status, verified_by_user_id, verified_at, notes) VALUES
('66666666-6666-6666-6666-666666666601', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', 95, 'ACHIEVED', '22222222-2222-2222-2222-222222222208', NOW() - INTERVAL '3 days', 'Kualitas slicing UI presisi dan penanganan state sangat baik.'),
('66666666-6666-6666-6666-666666666601', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', 88, 'ACHIEVED', '22222222-2222-2222-2222-222222222208', NOW() - INTERVAL '5 days', 'Mampu menghubungkan Supabase Client dan query CRUD secara mandiri.'),
('66666666-6666-6666-6666-666666666601', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', 90, 'ACHIEVED', '22222222-2222-2222-2222-222222222208', NOW() - INTERVAL '10 days', 'Sangat rapi dalam commit message dan workflow pull request.'),
('66666666-6666-6666-6666-666666666601', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa04', 100, 'ACHIEVED', '22222222-2222-2222-2222-222222222208', NOW() - INTERVAL '20 days', 'Lulus uji induksi K3 dengan nilai sempurna.')
ON CONFLICT (student_id, competency_id) DO NOTHING;

-- 11. Attendance Records
INSERT INTO public.attendance (placement_id, student_id, attendance_date, check_in_time, check_out_time, location_name, latitude, longitude, status, verified_by_mentor, notes) VALUES
('99999999-9999-9999-9999-999999999901', '66666666-6666-6666-6666-666666666601', CURRENT_DATE, '07:54:00', '17:05:00', 'Telkom Landmark Tower - Jakarta', -6.2297280, 106.8164470, 'PRESENT', true, 'Presensi tepat waktu di dalam radius geofence kantor.'),
('99999999-9999-9999-9999-999999999901', '66666666-6666-6666-6666-666666666601', CURRENT_DATE - INTERVAL '1 day', '07:58:00', '17:15:00', 'Telkom Landmark Tower - Jakarta', -6.2297300, 106.8164500, 'PRESENT', true, 'Hadir dan bertugas di sprint engineering.'),
('99999999-9999-9999-9999-999999999901', '66666666-6666-6666-6666-666666666601', CURRENT_DATE - INTERVAL '2 days', '08:02:00', '17:00:00', 'Telkom Landmark Tower - Jakarta', -6.2297250, 106.8164400, 'PRESENT', true, 'Hadir tepat waktu.')
ON CONFLICT (placement_id, attendance_date) DO NOTHING;

-- 12. Journals & Evidence
INSERT INTO public.journals (id, placement_id, student_id, journal_date, start_time, end_time, total_hours, title, activity_description, status, industry_feedback, teacher_feedback, reviewed_by_industry_user_id, reviewed_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', '99999999-9999-9999-9999-999999999901', '66666666-6666-6666-6666-666666666601', CURRENT_DATE - INTERVAL '1 day', '08:00:00', '17:00:00', 8.00, 'Pengembangan Arsitektur Komponen Realtime Dashboard', 'Menyelesaikan modul sinkronisasi database Supabase PostgreSQL, membuat typed service helper, dan menghubungkan state presensi GPS siswa ke tabel attendance.', 'APPROVED', 'Pekerjaan sangat rapi dan struktur service layer mengikuti standar industri.', 'Tetap jaga kedisiplinan belajar dan komunikasi tim.', '22222222-2222-2222-2222-222222222208', NOW() - INTERVAL '1 day'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', '99999999-9999-9999-9999-999999999901', '66666666-6666-6666-6666-666666666601', CURRENT_DATE, '08:00:00', '17:00:00', 8.00, 'Implementasi Row Level Security (RLS) & Audit Trails', 'Menyusun aturan keamanan RLS di PostgreSQL agar tiap sekolah dan DUDI terisolasi secara multi-tenant serta mencatat histori perubahan nilai ke audit_logs.', 'PENDING', NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.journal_evidence (journal_id, type, name, file_url) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'link', 'Pull Request GitHub #142 - Service Layer', 'https://github.com/aktara/internship-core/pull/142'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'photo', 'Dokumentasi Slicing UI & Query Test.png', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800')
ON CONFLICT (id) DO NOTHING;

-- 13. Supervisions
INSERT INTO public.supervisions (id, teacher_mentor_id, industry_id, visit_date, type, findings, issues, action_plan, due_date, resolution_status) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccc01', '22222222-2222-2222-2222-222222222203', '44444444-4444-4444-4444-444444444401', CURRENT_DATE - INTERVAL '7 days', 'On-site Visit', 'Siswa beradaptasi sangat cepat dengan kultur kerja tech company. Penguasaan Git dan React melebihi ekspektasi awal.', 'Akses repository staging sempat terkendala sertifikat VPN.', 'Mentor industri telah mendaftarkan IP whitelist dan akses VPN siswa telah aktif normal.', CURRENT_DATE + INTERVAL '7 days', 'Resolved')
ON CONFLICT (id) DO NOTHING;

-- 14. Assessments & Scores
INSERT INTO public.assessments (id, placement_id, student_id, technical_skill_score, soft_skill_score, discipline_score, communication_score, teamwork_score, safety_k3_score, industry_mentor_score, teacher_mentor_score, final_numerical_score, final_grade, status, industry_mentor_feedback, teacher_mentor_feedback, finalized_at, finalized_by_user_id) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddd01', '99999999-9999-9999-9999-999999999901', '66666666-6666-6666-6666-666666666601', 94.00, 91.00, 96.00, 90.00, 93.00, 98.00, 93.80, 92.50, 93.28, 'A', 'Locked_Finalized', 'Dimas memiliki potensi luar biasa sebagai Junior Full-stack Engineer. Sangat direkomendasikan untuk program hiring setelah lulus SMK.', 'Pertahankan prestasi membanggakan ini, teladan bagi adik tingkat.', NOW() - INTERVAL '2 days', '22222222-2222-2222-2222-222222222208')
ON CONFLICT (id) DO NOTHING;

-- 15. Certificates & Verification
INSERT INTO public.certificates (id, certificate_number, student_id, placement_id, program_id, completion_date, total_internship_hours, final_score, final_grade, verification_token, qr_verification_url, status, competencies_achieved) VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'AKTARA/CERT/2024/XII/00482', '66666666-6666-6666-6666-666666666601', '99999999-9999-9999-9999-999999999901', '77777777-7777-7777-7777-777777777701', '2024-12-20', 800, 93.28, 'A', 'AKT-VOKASI-99482-SECURE-TOKEN-2024', 'https://aktara.kemdikbud.go.id/verify/AKT-VOKASI-99482', 'ISSUED', '[{"code": "KOMP-RPL-01", "name": "Frontend Component Architecture", "grade": "A+"}, {"code": "KOMP-RPL-02", "name": "RESTful API & Database Integration", "grade": "A"}, {"code": "KOMP-RPL-03", "name": "Git Collaboration & CI/CD", "grade": "A"}]'::jsonb)
ON CONFLICT (certificate_number) DO NOTHING;

-- 16. Notifications
INSERT INTO public.notifications (user_id, title, message, type, category, read) VALUES
('22222222-2222-2222-2222-222222222204', 'Jurnal Harian Disetujui Mentor DUDI', 'Jurnal aktivitas Anda tanggal kemarin telah diverifikasi dan disetujui oleh Bayu Pratama (Senior Tech Lead).', 'success', 'journal', false),
('22222222-2222-2222-2222-222222222204', 'Sertifikat Digital Telah Terbit', 'Selamat! Sertifikat Magang Industri No. AKTARA/CERT/2024/XII/00482 telah diterbitkan dengan nilai akhir A (93.28).', 'alert', 'certificate', false),
('22222222-2222-2222-2222-222222222202', 'Laporan Supervisi SMK 1 Masuk', 'Guru Pembimbing Sri Wahyuni telah mengunggah hasil monitoring supervisi untuk penempatan PT Telkom Indonesia.', 'info', 'supervision', true),
('22222222-2222-2222-2222-222222222208', 'Pengajuan Review Jurnal Baru', 'Siswa Dimas Prasetyo mengajukan 1 jurnal baru dengan bukti lampiran link Pull Request GitHub untuk divalidasi.', 'action_required', 'journal', false)
ON CONFLICT (id) DO NOTHING;

-- 17. Audit Logs
INSERT INTO public.audit_logs (actor_name, actor_email, actor_role, tenant_name, action, module, status, details, ip_address) VALUES
('Dr. Arya Wirawan', 'admin@aktara.test', 'SUPER_ADMIN', 'Mitras DUDI Kemendikbud', 'SYSTEM_AUDIT_VERIFIED', 'Master Data', 'SUCCESS', 'Verifikasi berkas kemitraan MoU DUDI PT Telkom Indonesia Tbk periode 2024-2026', '180.252.164.22'),
('Drs. Bambang Sudarmono', 'school.admin@aktara.test', 'SCHOOL_ADMIN', 'SMK Negeri 1 Jakarta', 'PLACEMENT_ISSUED', 'Penempatan', 'SUCCESS', 'Penerbitan surat penempatan magang resmi siswa Dimas Prasetyo ke DUDI Telkom Group', '114.122.38.105'),
('Bayu Pratama, S.Kom', 'industry.mentor@aktara.test', 'INDUSTRY_MENTOR', 'PT Telkom Indonesia', 'ASSESSMENT_FINALIZED_LOCKED', 'Penilaian', 'SUCCESS', 'Penguncian nilai akhir magang (Nilai 93.28 - Predikat A) dan rekomendasi kelulusan', '103.111.201.44')
ON CONFLICT (id) DO NOTHING;
