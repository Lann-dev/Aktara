import { ErdEntityDefinition, ErdRelation, ErdCoreTableSummary } from '../types';

// ============================================================================
// 11.2 CORE TABLES SUMMARY (Exact Specification from Section 11.2)
// ============================================================================
export const ERD_CORE_TABLES_SUMMARY: ErdCoreTableSummary[] = [
  {
    entity: 'users',
    keyFields: 'id UUID PK; email; password_hash/auth_provider; full_name; phone; status; created_at; updated_at',
    group: 'USERS',
    description: 'Tabel sentral akun dan kredensial autentikasi platform untuk seluruh role pengguna.',
    totalFields: 8,
  },
  {
    entity: 'roles',
    keyFields: 'id UUID PK; code UNIQUE; name',
    group: 'USERS',
    description: 'Master data peran otorisasi RBAC (super_admin, school_admin, teacher_mentor, student, dll).',
    totalFields: 3,
  },
  {
    entity: 'user_roles',
    keyFields: 'id UUID PK; user_id FK; role_id FK; school_id FK nullable; industry_id FK nullable',
    group: 'USERS',
    description: 'Pemetaan hak akses multi-role pengguna ke tenant sekolah atau mitra industri.',
    totalFields: 5,
  },
  {
    entity: 'schools',
    keyFields: 'id UUID PK; npsn; name; level; address; province; city; status',
    group: 'SCHOOLS',
    description: 'Master data institusi sekolah menengah kejuruan (SMK) / lembaga vokasi.',
    totalFields: 8,
  },
  {
    entity: 'school_members',
    keyFields: 'id UUID PK; school_id FK; user_id FK; member_type; status',
    group: 'SCHOOLS',
    description: 'Hubungan kepengurusan dan kepegawaian civitas sekolah (Kepsek, Guru, Staff TU).',
    totalFields: 5,
  },
  {
    entity: 'industries',
    keyFields: 'id UUID PK; code; legal_name; brand_name; industry_type; address; city; status',
    group: 'USERS',
    description: 'Master data perusahaan / korporasi / Dunia Usaha & Dunia Industri (DUDI) mitra vokasi.',
    totalFields: 8,
  },
  {
    entity: 'industry_units',
    keyFields: 'id UUID PK; industry_id FK; name; address; capacity; status',
    group: 'USERS',
    description: 'Divisi, departemen, workshop bengkel, atau unit cabang penempatan kerja magang.',
    totalFields: 6,
  },
  {
    entity: 'industry_members',
    keyFields: 'id UUID PK; industry_id FK; user_id FK; member_type; status',
    group: 'USERS',
    description: 'Akun personalia industri (HRD Administrator, Pembimbing Lapangan/Mentor).',
    totalFields: 5,
  },
  {
    entity: 'students',
    keyFields: 'id UUID PK; user_id FK; school_id FK; nisn; nis; grade; major_id FK; graduation_year; status',
    group: 'STUDENTS',
    description: 'Data pokok siswa kejuruan peserta program magang vokasi terdaftar.',
    totalFields: 9,
  },
  {
    entity: 'student_profiles',
    keyFields: 'student_id PK/FK; birth_date; gender; emergency_contact; address; photo_url',
    group: 'STUDENTS',
    description: 'Data pribadi komprehensif siswa termasuk kontak darurat dan biodata K3.',
    totalFields: 6,
  },
  {
    entity: 'program_majors',
    keyFields: 'id UUID PK; code; name; school_id FK nullable',
    group: 'SCHOOLS',
    description: 'Master data Program Keahlian / Konsentrasi Keahlian Jurusan SMK.',
    totalFields: 4,
  },
  {
    entity: 'internship_programs',
    keyFields: 'id UUID PK; school_id FK; name; academic_year; start_date; end_date; status; capacity',
    group: 'SCHOOLS',
    description: 'Kohort program Praktik Kerja Lapangan (PKL) yang dibuka per periode ajaran.',
    totalFields: 8,
  },
  {
    entity: 'program_mentors',
    keyFields: 'id UUID PK; program_id FK; user_id FK; mentor_type; status',
    group: 'SCHOOLS',
    description: 'Penugasan guru pembimbing sekolah atau instruktur DUDI ke dalam program magang.',
    totalFields: 5,
  },
  {
    entity: 'applications',
    keyFields: 'id UUID PK; program_id FK; student_id FK; applied_at; status; notes',
    group: 'OPERATIONS',
    description: 'Pengajuan pendaftaran siswa magang beserta status seleksi dan verifikasi.',
    totalFields: 6,
  },
  {
    entity: 'placements',
    keyFields: 'id UUID PK; program_id FK; student_id FK; industry_id FK; unit_id FK; industry_mentor_id FK; school_mentor_id FK; start_date; end_date; status',
    group: 'OPERATIONS',
    description: 'Entitas sentral operasional magang yang menghubungkan siswa, DUDI, unit, dan pembimbing.',
    totalFields: 9,
  },
  {
    entity: 'placement_history',
    keyFields: 'id UUID PK; placement_id FK; old_industry_id; old_unit_id; old_mentor_id; reason; changed_by; changed_at',
    group: 'OPERATIONS',
    description: 'Log riwayat mutasi / perpindahan siswa magang antar industri atau pergantian mentor.',
    totalFields: 8,
  },
  {
    entity: 'competencies',
    keyFields: 'id UUID PK; code; name; description; major_id FK; status',
    group: 'COMPETENCIES',
    description: 'Master standar capaian kompetensi kejuruan berbasis SKKNI / Kurikulum Merdeka.',
    totalFields: 6,
  },
  {
    entity: 'competency_versions',
    keyFields: 'id UUID PK; competency_id FK; version_no; definition; level_scheme; effective_from; effective_to',
    group: 'COMPETENCIES',
    description: 'Versi definisi capaian dan skema level rubrik kompetensi yang berlaku.',
    totalFields: 7,
  },
  {
    entity: 'program_competencies',
    keyFields: 'id UUID PK; program_id FK; competency_version_id FK; weight; target_level; required',
    group: 'COMPETENCIES',
    description: 'Paket target kompetensi wajib yang harus dicapai siswa dalam suatu program magang.',
    totalFields: 6,
  },
  {
    entity: 'student_competencies',
    keyFields: 'id UUID PK; placement_id FK; program_competency_id FK; current_level; progress_pct; status; validated_at',
    group: 'COMPETENCIES',
    description: 'Progres pencapaian dan status validasi penguasaan kompetensi setiap siswa.',
    totalFields: 7,
  },
  {
    entity: 'attendance',
    keyFields: 'id UUID PK; placement_id FK; attendance_date; check_in; check_out; status; latitude nullable; longitude nullable; notes; verified_by',
    group: 'OPERATIONS',
    description: 'Presensi harian siswa dengan validasi geofence GPS dan verifikasi mentor.',
    totalFields: 10,
  },
  {
    entity: 'journals',
    keyFields: 'id UUID PK; placement_id FK; journal_date; activity_title; description; start_time; end_time; status; reviewed_by; reviewed_at',
    group: 'OPERATIONS',
    description: 'Logbook aktivitas harian kerja siswa magang yang direviu mentor.',
    totalFields: 10,
  },
  {
    entity: 'journal_evidence',
    keyFields: 'id UUID PK; journal_id FK; file_url; file_type; caption',
    group: 'OPERATIONS',
    description: 'Berkas bukti fisik dokumentasi foto/video/dokumen aktivitas jurnal harian.',
    totalFields: 5,
  },
  {
    entity: 'competency_evidence',
    keyFields: 'id UUID PK; student_competency_id FK; journal_id FK nullable; file_url; description; verified_by; verified_at',
    group: 'COMPETENCIES',
    description: 'Portofolio bukti artefak karya/tugas untuk validasi capaian kompetensi siswa.',
    totalFields: 7,
  },
  {
    entity: 'supervisions',
    keyFields: 'id UUID PK; placement_id FK; mentor_id FK; supervision_date; mode; summary; risk_level; status',
    group: 'OPERATIONS',
    description: 'Monitoring berkala (On-site / Online) oleh guru pembimbing ke tempat magang.',
    totalFields: 8,
  },
  {
    entity: 'supervision_actions',
    keyFields: 'id UUID PK; supervision_id FK; action_item; owner_id FK; due_date; status; completed_at',
    group: 'OPERATIONS',
    description: 'Tindak lanjut (action item) perbaikan dari temuan kendala saat supervisi.',
    totalFields: 7,
  },
  {
    entity: 'assessment_templates',
    keyFields: 'id UUID PK; program_id FK; name; version; status',
    group: 'ASSESSMENTS',
    description: 'Master template instrumen penilaian magang terstandar per program.',
    totalFields: 5,
  },
  {
    entity: 'assessment_items',
    keyFields: 'id UUID PK; template_id FK; competency_id FK nullable; code; category; indicator; max_score; weight',
    group: 'ASSESSMENTS',
    description: 'Indikator butir rubrik penilaian (aspek teknis, soft skill, K3, kedisiplinan).',
    totalFields: 8,
  },
  {
    entity: 'assessments',
    keyFields: 'id UUID PK; placement_id FK; template_id FK; assessor_id FK; assessor_type; score; status; submitted_at; finalized_at',
    group: 'ASSESSMENTS',
    description: 'Rekapitulasi berkas penilaian gabungan dari mentor industri dan pembimbing sekolah.',
    totalFields: 9,
  },
  {
    entity: 'assessment_scores',
    keyFields: 'id UUID PK; assessment_id FK; assessment_item_id FK; score; note',
    group: 'ASSESSMENTS',
    description: 'Nilai per butir indikator rubrik yang diberikan penilai beserta catatan evaluasi.',
    totalFields: 5,
  },
  {
    entity: 'certificates',
    keyFields: 'id UUID PK; placement_id FK; certificate_no UNIQUE; issued_at; verification_token UNIQUE; file_url; status',
    group: 'CERTIFICATES',
    description: 'Sertifikat kompetensi kelulusan magang ber-QR Code dengan verifikasi publik.',
    totalFields: 7,
  },
  {
    entity: 'certificate_verifications',
    keyFields: 'id UUID PK; certificate_id FK; verified_at; verifier_ip_hash nullable',
    group: 'CERTIFICATES',
    description: 'Log pelacakan publik saat QR sertifikat dipindai oleh pihak luar / perekrut.',
    totalFields: 4,
  },
  {
    entity: 'notifications',
    keyFields: 'id UUID PK; user_id FK; type; title; body; read_at; created_at',
    group: 'SYSTEM',
    description: 'Notifikasi sistem in-app & push alerting untuk reviu logbook, jadwal, & approval.',
    totalFields: 7,
  },
  {
    entity: 'audit_logs',
    keyFields: 'id UUID PK; actor_user_id FK; action; entity_type; entity_id; old_data JSONB; new_data JSONB; created_at',
    group: 'SYSTEM',
    description: 'Catatan audit keamanan & integritas data forensik (immutable change tracker).',
    totalFields: 8,
  },
];

// ============================================================================
// 11. DETAILED ENTITY DEFINITIONS FOR ALL 34 TABLES
// ============================================================================
export const ERD_ENTITIES: ErdEntityDefinition[] = [
  // 1. users
  {
    id: 'users',
    name: 'USERS',
    group: 'USERS',
    description: 'Tabel sentral autentikasi dan profil pengguna platform terpadu (Super Admin, Admin Sekolah, Guru, Siswa, Mentor Industri, dsb).',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key identitas unik pengguna' },
      { name: 'email', type: 'VARCHAR(255) UNIQUE', isNullable: false, description: 'Alamat email aktif untuk autentikasi' },
      { name: 'password_hash', type: 'VARCHAR(255)', isNullable: false, description: 'Hash kredensial kata sandi / ID token auth_provider' },
      { name: 'full_name', type: 'VARCHAR(255)', isNullable: false, description: 'Nama lengkap pengguna beserta gelar' },
      { name: 'phone', type: 'VARCHAR(32)', isNullable: true, description: 'Nomor telepon seluler / WhatsApp aktif' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status akun: active, inactive, suspended' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Waktu pembuatan akun dalam UTC' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Waktu pembaruan akun terakhir dalam UTC' },
    ],
  },
  // 2. roles
  {
    id: 'roles',
    name: 'ROLES',
    group: 'USERS',
    description: 'Master data hak akses dan peran kewenangan RBAC (Role-Based Access Control) dalam sistem.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key peran RBAC' },
      { name: 'code', type: 'VARCHAR(64) UNIQUE', isNullable: false, description: 'Kode role unik (super_admin, school_admin, teacher_mentor, student, dll)' },
      { name: 'name', type: 'VARCHAR(128)', isNullable: false, description: 'Label nama tampilan peran' },
    ],
  },
  // 3. user_roles
  {
    id: 'user_roles',
    name: 'USER_ROLES',
    group: 'USERS',
    parentEntity: 'users',
    description: 'Tabel relasi many-to-many antara USERS dan ROLES dengan konteks tenant institusi sekolah / DUDI.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key relasi user role' },
      { name: 'user_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'Foreign Key ke USERS' },
      { name: 'role_id', type: 'UUID', isFk: true, fkRef: 'roles.id', isNullable: false, description: 'Foreign Key ke ROLES' },
      { name: 'school_id', type: 'UUID', isFk: true, fkRef: 'schools.id', isNullable: true, description: 'Foreign Key ke SCHOOLS (nullable jika bukan admin/guru sekolah)' },
      { name: 'industry_id', type: 'UUID', isFk: true, fkRef: 'industries.id', isNullable: true, description: 'Foreign Key ke INDUSTRIES (nullable jika bukan pihak DUDI)' },
    ],
  },
  // 4. schools
  {
    id: 'schools',
    name: 'SCHOOLS',
    group: 'SCHOOLS',
    description: 'Master data institusi Sekolah Menengah Kejuruan (SMK) / Lembaga Vokasi tenant.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key institusi sekolah' },
      { name: 'npsn', type: 'VARCHAR(32) UNIQUE', isNullable: false, description: 'Nomor Pokok Sekolah Nasional' },
      { name: 'name', type: 'VARCHAR(255)', isNullable: false, description: 'Nama resmi sekolah (SMK Negeri / Swasta)' },
      { name: 'level', type: 'VARCHAR(32)', isNullable: false, description: 'Jenjang pendidikan (SMK 3 Tahun / SMK 4 Tahun)' },
      { name: 'address', type: 'TEXT', isNullable: true, description: 'Alamat lengkap gedung sekolah' },
      { name: 'province', type: 'VARCHAR(64)', isNullable: false, description: 'Provinsi sekolah berada' },
      { name: 'city', type: 'VARCHAR(128)', isNullable: false, description: 'Kabupaten / Kota domisili' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: active, inactive' },
    ],
  },
  // 5. school_members
  {
    id: 'school_members',
    name: 'SCHOOL_MEMBERS',
    group: 'SCHOOLS',
    parentEntity: 'schools',
    description: 'Hubungan kepemilikan tenant kelembagaan sekolah (Kepsek, Guru Pembimbing, Staf Tata Usaha).',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key keanggotaan sekolah' },
      { name: 'school_id', type: 'UUID', isFk: true, fkRef: 'schools.id', isNullable: false, description: 'Foreign Key ke SCHOOLS' },
      { name: 'user_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'Foreign Key ke USERS' },
      { name: 'member_type', type: 'VARCHAR(32)', isNullable: false, description: 'Jenis: principal, teacher_mentor, school_admin, staff' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status keanggotaan (active / inactive)' },
    ],
  },
  // 6. industries
  {
    id: 'industries',
    name: 'INDUSTRIES',
    group: 'USERS',
    description: 'Master data Dunia Usaha Dunia Industri (DUDI) mitra vokasi resmi.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key mitra industri' },
      { name: 'code', type: 'VARCHAR(64) UNIQUE', isNullable: false, description: 'Kode unik registrasi industri' },
      { name: 'legal_name', type: 'VARCHAR(255)', isNullable: false, description: 'Nama badan hukum resmi (PT / CV / Yayasan)' },
      { name: 'brand_name', type: 'VARCHAR(255)', isNullable: false, description: 'Nama merek dagang / brand populer' },
      { name: 'industry_type', type: 'VARCHAR(128)', isNullable: false, description: 'Sektor / jenis industri (Teknologi Informasi, Otomotif, Manufaktur, dsb)' },
      { name: 'address', type: 'TEXT', isNullable: true, description: 'Alamat kantor operasional' },
      { name: 'city', type: 'VARCHAR(128)', isNullable: false, description: 'Kota / Kabupaten domisili kantor' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status kemitraan: active, inactive' },
    ],
  },
  // 7. industry_units
  {
    id: 'industry_units',
    name: 'INDUSTRY_UNITS',
    group: 'USERS',
    parentEntity: 'industries',
    description: 'Divisi, departemen, workshop bengkel, atau unit cabang penempatan kerja magang.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key unit divisi industri' },
      { name: 'industry_id', type: 'UUID', isFk: true, fkRef: 'industries.id', isNullable: false, description: 'Foreign Key ke INDUSTRIES' },
      { name: 'name', type: 'VARCHAR(128)', isNullable: false, description: 'Nama divisi / unit kerja' },
      { name: 'address', type: 'TEXT', isNullable: true, description: 'Lokasi cabang atau gedung unit kerja' },
      { name: 'capacity', type: 'INT', isNullable: false, description: 'Kapasitas maksimal siswa magang' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status unit (active / inactive)' },
    ],
  },
  // 8. industry_members
  {
    id: 'industry_members',
    name: 'INDUSTRY_MEMBERS',
    group: 'USERS',
    parentEntity: 'industries',
    description: 'Akun personalia industri (HRD Administrator, Pembimbing Lapangan/Mentor).',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key keanggotaan industri' },
      { name: 'industry_id', type: 'UUID', isFk: true, fkRef: 'industries.id', isNullable: false, description: 'Foreign Key ke INDUSTRIES' },
      { name: 'user_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'Foreign Key ke USERS' },
      { name: 'member_type', type: 'VARCHAR(32)', isNullable: false, description: 'Jenis peran: hr_admin, lead_mentor, mentor' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: active, inactive' },
    ],
  },
  // 9. students
  {
    id: 'students',
    name: 'STUDENTS',
    group: 'STUDENTS',
    parentEntity: 'schools',
    description: 'Data pokok siswa kejuruan peserta program magang vokasi terdaftar.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key identitas siswa' },
      { name: 'user_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'Foreign Key ke akun USERS' },
      { name: 'school_id', type: 'UUID', isFk: true, fkRef: 'schools.id', isNullable: false, description: 'Foreign Key ke institusi SCHOOLS' },
      { name: 'nisn', type: 'VARCHAR(32) UNIQUE', isNullable: false, description: 'Nomor Induk Siswa Nasional resmi' },
      { name: 'nis', type: 'VARCHAR(32)', isNullable: false, description: 'Nomor Induk Siswa lokal sekolah' },
      { name: 'grade', type: 'VARCHAR(16)', isNullable: false, description: 'Tingkat kelas (XII, XI, XIII)' },
      { name: 'major_id', type: 'UUID', isFk: true, fkRef: 'program_majors.id', isNullable: false, description: 'Foreign Key ke PROGRAM_MAJORS' },
      { name: 'graduation_year', type: 'INT', isNullable: false, description: 'Tahun perkiraan kelulusan' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: active, intern, graduated, dropped' },
    ],
  },
  // 10. student_profiles
  {
    id: 'student_profiles',
    name: 'STUDENT_PROFILES',
    group: 'STUDENTS',
    parentEntity: 'students',
    description: 'Data pribadi komprehensif siswa termasuk kontak darurat dan biodata K3.',
    columns: [
      { name: 'student_id', type: 'UUID', isPk: true, isFk: true, fkRef: 'students.id', isNullable: false, description: 'Primary Key & Foreign Key ke STUDENTS' },
      { name: 'birth_date', type: 'DATE', isNullable: false, description: 'Tanggal lahir siswa' },
      { name: 'gender', type: 'VARCHAR(16)', isNullable: false, description: 'Jenis kelamin (L / P)' },
      { name: 'emergency_contact', type: 'JSONB', isNullable: false, description: 'Objek kontak darurat (nama, relasi, nomor telepon)' },
      { name: 'address', type: 'TEXT', isNullable: true, description: 'Alamat tempat tinggal domisili' },
      { name: 'photo_url', type: 'TEXT', isNullable: true, description: 'URL foto resmi profil siswa' },
    ],
  },
  // 11. program_majors
  {
    id: 'program_majors',
    name: 'PROGRAM_MAJORS',
    group: 'SCHOOLS',
    description: 'Master data Program Keahlian / Konsentrasi Keahlian Jurusan SMK.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key jurusan' },
      { name: 'code', type: 'VARCHAR(32) UNIQUE', isNullable: false, description: 'Kode jurusan (RPL, TKJ, TKRO, DKV, TP)' },
      { name: 'name', type: 'VARCHAR(255)', isNullable: false, description: 'Nama lengkap konsentrasi keahlian' },
      { name: 'school_id', type: 'UUID', isFk: true, fkRef: 'schools.id', isNullable: true, description: 'Foreign Key ke SCHOOLS (nullable jika standar nasional)' },
    ],
  },
  // 12. internship_programs
  {
    id: 'internship_programs',
    name: 'INTERNSHIP_PROGRAMS',
    group: 'SCHOOLS',
    parentEntity: 'schools',
    description: 'Kohort program Praktik Kerja Lapangan (PKL) yang dibuka per periode ajaran.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key program magang' },
      { name: 'school_id', type: 'UUID', isFk: true, fkRef: 'schools.id', isNullable: false, description: 'Foreign Key ke SCHOOLS' },
      { name: 'name', type: 'VARCHAR(255)', isNullable: false, description: 'Judul Kohort Program Magang' },
      { name: 'academic_year', type: 'VARCHAR(32)', isNullable: false, description: 'Tahun Ajaran Akademik (2026/2027)' },
      { name: 'start_date', type: 'DATE', isNullable: false, description: 'Tanggal mulai pelaksanaan' },
      { name: 'end_date', type: 'DATE', isNullable: false, description: 'Tanggal selesai pelaksanaan' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: DRAFT, OPEN, RUNNING, COMPLETED' },
      { name: 'capacity', type: 'INT', isNullable: false, description: 'Kapasitas maksimal siswa per batch' },
    ],
  },
  // 13. program_mentors
  {
    id: 'program_mentors',
    name: 'PROGRAM_MENTORS',
    group: 'SCHOOLS',
    parentEntity: 'internship_programs',
    description: 'Penugasan guru pembimbing sekolah atau instruktur DUDI ke dalam program magang.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key penugasan mentor program' },
      { name: 'program_id', type: 'UUID', isFk: true, fkRef: 'internship_programs.id', isNullable: false, description: 'Foreign Key ke INTERNSHIP_PROGRAMS' },
      { name: 'user_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'Foreign Key ke USERS (Guru / Mentor)' },
      { name: 'mentor_type', type: 'VARCHAR(32)', isNullable: false, description: 'Jenis mentor: school_teacher, industry_mentor' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status penugasan: active, inactive' },
    ],
  },
  // 14. applications
  {
    id: 'applications',
    name: 'APPLICATIONS',
    group: 'OPERATIONS',
    parentEntity: 'internship_programs',
    description: 'Pengajuan pendaftaran siswa magang beserta status seleksi dan verifikasi.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key pendaftaran magang' },
      { name: 'program_id', type: 'UUID', isFk: true, fkRef: 'internship_programs.id', isNullable: false, description: 'Foreign Key ke INTERNSHIP_PROGRAMS' },
      { name: 'student_id', type: 'UUID', isFk: true, fkRef: 'students.id', isNullable: false, description: 'Foreign Key ke STUDENTS' },
      { name: 'applied_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Waktu pengajuan berkas pendaftaran (UTC)' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: Submitted, Under Review, Approved, Rejected' },
      { name: 'notes', type: 'TEXT', isNullable: true, description: 'Catatan admin / panitia seleksi' },
    ],
  },
  // 15. placements
  {
    id: 'placements',
    name: 'PLACEMENTS',
    group: 'OPERATIONS',
    parentEntity: 'internship_programs',
    description: 'Entitas sentral operasional magang yang menghubungkan siswa, DUDI, unit, dan pembimbing.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key penempatan magang aktif' },
      { name: 'program_id', type: 'UUID', isFk: true, fkRef: 'internship_programs.id', isNullable: false, description: 'Foreign Key ke INTERNSHIP_PROGRAMS' },
      { name: 'student_id', type: 'UUID', isFk: true, fkRef: 'students.id', isNullable: false, description: 'Foreign Key ke STUDENTS' },
      { name: 'industry_id', type: 'UUID', isFk: true, fkRef: 'industries.id', isNullable: false, description: 'Foreign Key ke INDUSTRIES mitra' },
      { name: 'unit_id', type: 'UUID', isFk: true, fkRef: 'industry_units.id', isNullable: true, description: 'Foreign Key ke INDUSTRY_UNITS divisi kerja' },
      { name: 'industry_mentor_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'Foreign Key ke USERS (Mentor Industri)' },
      { name: 'school_mentor_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'Foreign Key ke USERS (Guru Pembimbing)' },
      { name: 'start_date', type: 'DATE', isNullable: false, description: 'Tanggal mulai efektif magang' },
      { name: 'end_date', type: 'DATE', isNullable: false, description: 'Tanggal selesai penempatan' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: active, completed, withdrawn, transferred' },
    ],
  },
  // 16. placement_history
  {
    id: 'placement_history',
    name: 'PLACEMENT_HISTORY',
    group: 'OPERATIONS',
    parentEntity: 'placements',
    description: 'Log riwayat mutasi / perpindahan siswa magang antar industri atau pergantian mentor.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key riwayat mutasi' },
      { name: 'placement_id', type: 'UUID', isFk: true, fkRef: 'placements.id', isNullable: false, description: 'Foreign Key ke PLACEMENTS' },
      { name: 'old_industry_id', type: 'UUID', isFk: true, fkRef: 'industries.id', isNullable: true, description: 'ID industri lama sebelum mutasi' },
      { name: 'old_unit_id', type: 'UUID', isFk: true, fkRef: 'industry_units.id', isNullable: true, description: 'ID unit kerja lama' },
      { name: 'old_mentor_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: true, description: 'ID mentor lama yang digantikan' },
      { name: 'reason', type: 'TEXT', isNullable: false, description: 'Alasan mutasi atau rotasi penempatan' },
      { name: 'changed_by', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'User ID pejabat yang melakukan otorisasi mutasi' },
      { name: 'changed_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Waktu mutasi dicatat (UTC)' },
    ],
  },
  // 17. competencies
  {
    id: 'competencies',
    name: 'COMPETENCIES',
    group: 'COMPETENCIES',
    description: 'Master standar capaian kompetensi kejuruan berbasis SKKNI / Kurikulum Merdeka.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key kompetensi' },
      { name: 'code', type: 'VARCHAR(64) UNIQUE', isNullable: false, description: 'Kode kompetensi (cth: RPL.01, OTO.03)' },
      { name: 'name', type: 'VARCHAR(255)', isNullable: false, description: 'Nama unit capaian kompetensi' },
      { name: 'description', type: 'TEXT', isNullable: true, description: 'Deskripsi capaian unjuk kerja' },
      { name: 'major_id', type: 'UUID', isFk: true, fkRef: 'program_majors.id', isNullable: false, description: 'Foreign Key ke PROGRAM_MAJORS' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: active, inactive, deprecated' },
    ],
  },
  // 18. competency_versions
  {
    id: 'competency_versions',
    name: 'COMPETENCY_VERSIONS',
    group: 'COMPETENCIES',
    parentEntity: 'competencies',
    description: 'Versi definisi capaian dan skema level rubrik kompetensi yang berlaku.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key versi kompetensi' },
      { name: 'competency_id', type: 'UUID', isFk: true, fkRef: 'competencies.id', isNullable: false, description: 'Foreign Key ke COMPETENCIES' },
      { name: 'version_no', type: 'VARCHAR(32)', isNullable: false, description: 'Nomor versi (v2026.1, v2025.2)' },
      { name: 'definition', type: 'TEXT', isNullable: false, description: 'Teks definisi detail capaian versi terkait' },
      { name: 'level_scheme', type: 'JSONB', isNullable: false, description: 'Skema tingkatan level (Basic, Intermediate, Advanced)' },
      { name: 'effective_from', type: 'DATE', isNullable: false, description: 'Tanggal mulai berlaku' },
      { name: 'effective_to', type: 'DATE', isNullable: true, description: 'Tanggal akhir masa berlaku' },
    ],
  },
  // 19. program_competencies
  {
    id: 'program_competencies',
    name: 'PROGRAM_COMPETENCIES',
    group: 'COMPETENCIES',
    parentEntity: 'internship_programs',
    description: 'Paket target kompetensi wajib yang harus dicapai siswa dalam suatu program magang.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key program competency mapping' },
      { name: 'program_id', type: 'UUID', isFk: true, fkRef: 'internship_programs.id', isNullable: false, description: 'Foreign Key ke INTERNSHIP_PROGRAMS' },
      { name: 'competency_version_id', type: 'UUID', isFk: true, fkRef: 'competency_versions.id', isNullable: false, description: 'Foreign Key ke COMPETENCY_VERSIONS' },
      { name: 'weight', type: 'DECIMAL(4,2)', isNullable: false, description: 'Bobot kontribusi kompetensi (0.00 - 1.00)' },
      { name: 'target_level', type: 'VARCHAR(32)', isNullable: false, description: 'Target minimum: Intermediate / Advanced' },
      { name: 'required', type: 'BOOLEAN', isNullable: false, description: 'Apakah bersifat mandatory untuk kelulusan' },
    ],
  },
  // 20. student_competencies
  {
    id: 'student_competencies',
    name: 'STUDENT_COMPETENCIES',
    group: 'COMPETENCIES',
    parentEntity: 'placements',
    description: 'Progres pencapaian dan status validasi penguasaan kompetensi setiap siswa.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key progres kompetensi siswa' },
      { name: 'placement_id', type: 'UUID', isFk: true, fkRef: 'placements.id', isNullable: false, description: 'Foreign Key ke PLACEMENTS' },
      { name: 'program_competency_id', type: 'UUID', isFk: true, fkRef: 'program_competencies.id', isNullable: false, description: 'Foreign Key ke PROGRAM_COMPETENCIES' },
      { name: 'current_level', type: 'VARCHAR(32)', isNullable: false, description: 'Tingkat saat ini (Novice, Basic, Competent, Master)' },
      { name: 'progress_pct', type: 'INT', isNullable: false, description: 'Persentase pencapaian (0 - 100%)' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: In Progress, Submitted, Validated' },
      { name: 'validated_at', type: 'TIMESTAMPTZ', isNullable: true, description: 'Waktu validasi oleh mentor (UTC)' },
    ],
  },
  // 21. attendance
  {
    id: 'attendance',
    name: 'ATTENDANCE',
    group: 'OPERATIONS',
    parentEntity: 'placements',
    description: 'Presensi harian siswa dengan validasi geofence GPS dan verifikasi mentor.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key presensi' },
      { name: 'placement_id', type: 'UUID', isFk: true, fkRef: 'placements.id', isNullable: false, description: 'Foreign Key ke PLACEMENTS' },
      { name: 'attendance_date', type: 'DATE', isNullable: false, description: 'Tanggal kehadiran' },
      { name: 'check_in', type: 'TIME', isNullable: false, description: 'Waktu jam masuk presensi' },
      { name: 'check_out', type: 'TIME', isNullable: true, description: 'Waktu jam pulang presensi' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: Present, Late, Sick, Permission, Absent' },
      { name: 'latitude', type: 'DECIMAL(10,7)', isNullable: true, description: 'Titik koordinat latitude GPS' },
      { name: 'longitude', type: 'DECIMAL(10,7)', isNullable: true, description: 'Titik koordinat longitude GPS' },
      { name: 'notes', type: 'TEXT', isNullable: true, description: 'Keterangan izin atau alasan dinas luar' },
      { name: 'verified_by', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: true, description: 'User ID mentor yang memverifikasi kehadiran' },
    ],
  },
  // 22. journals
  {
    id: 'journals',
    name: 'JOURNALS',
    group: 'OPERATIONS',
    parentEntity: 'placements',
    description: 'Logbook aktivitas harian kerja siswa magang yang direviu mentor.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key entri jurnal logbook' },
      { name: 'placement_id', type: 'UUID', isFk: true, fkRef: 'placements.id', isNullable: false, description: 'Foreign Key ke PLACEMENTS' },
      { name: 'journal_date', type: 'DATE', isNullable: false, description: 'Tanggal pelaksanaan aktivitas' },
      { name: 'activity_title', type: 'VARCHAR(255)', isNullable: false, description: 'Judul ringkas pekerjaan / modul tugas' },
      { name: 'description', type: 'TEXT', isNullable: false, description: 'Uraian detail tahapan teknis pekerjaan' },
      { name: 'start_time', type: 'TIME', isNullable: false, description: 'Jam mulai aktivitas' },
      { name: 'end_time', type: 'TIME', isNullable: false, description: 'Jam berakhir aktivitas' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: pending, approved, revision_requested' },
      { name: 'reviewed_by', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: true, description: 'User ID mentor peninjau' },
      { name: 'reviewed_at', type: 'TIMESTAMPTZ', isNullable: true, description: 'Waktu reviu disetujui (UTC)' },
    ],
  },
  // 23. journal_evidence
  {
    id: 'journal_evidence',
    name: 'JOURNAL_EVIDENCE',
    group: 'OPERATIONS',
    parentEntity: 'journals',
    description: 'Berkas bukti fisik dokumentasi foto/video/dokumen aktivitas jurnal harian.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key bukti dokumentasi jurnal' },
      { name: 'journal_id', type: 'UUID', isFk: true, fkRef: 'journals.id', isNullable: false, description: 'Foreign Key ke JOURNALS' },
      { name: 'file_url', type: 'TEXT', isNullable: false, description: 'URL file gambar atau dokumen pendukung di cloud storage' },
      { name: 'file_type', type: 'VARCHAR(32)', isNullable: false, description: 'Tipe file (image/jpeg, application/pdf)' },
      { name: 'caption', type: 'VARCHAR(255)', isNullable: true, description: 'Keterangan deskripsi gambar' },
    ],
  },
  // 24. competency_evidence
  {
    id: 'competency_evidence',
    name: 'COMPETENCY_EVIDENCE',
    group: 'COMPETENCIES',
    parentEntity: 'student_competencies',
    description: 'Portofolio bukti artefak karya/tugas untuk validasi capaian kompetensi siswa.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key bukti kompetensi' },
      { name: 'student_competency_id', type: 'UUID', isFk: true, fkRef: 'student_competencies.id', isNullable: false, description: 'Foreign Key ke STUDENT_COMPETENCIES' },
      { name: 'journal_id', type: 'UUID', isFk: true, fkRef: 'journals.id', isNullable: true, description: 'Foreign Key ke entri JOURNALS terkait (nullable)' },
      { name: 'file_url', type: 'TEXT', isNullable: false, description: 'URL repositori / berkas karya tugas' },
      { name: 'description', type: 'TEXT', isNullable: true, description: 'Penjelasan pencapaian karya' },
      { name: 'verified_by', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: true, description: 'User ID mentor validator' },
      { name: 'verified_at', type: 'TIMESTAMPTZ', isNullable: true, description: 'Waktu validasi artefak (UTC)' },
    ],
  },
  // 25. supervisions
  {
    id: 'supervisions',
    name: 'SUPERVISIONS',
    group: 'OPERATIONS',
    parentEntity: 'placements',
    description: 'Monitoring berkala (On-site / Online) oleh guru pembimbing ke tempat magang.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key log supervisi guru' },
      { name: 'placement_id', type: 'UUID', isFk: true, fkRef: 'placements.id', isNullable: false, description: 'Foreign Key ke PLACEMENTS' },
      { name: 'mentor_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'Foreign Key ke USERS (Guru Pembimbing)' },
      { name: 'supervision_date', type: 'DATE', isNullable: false, description: 'Tanggal kunjungan supervisi' },
      { name: 'mode', type: 'VARCHAR(32)', isNullable: false, description: 'Metode supervisi (On-site Visit, Online Call)' },
      { name: 'summary', type: 'TEXT', isNullable: false, description: 'Rangkuman hasil observasi dan wawancara' },
      { name: 'risk_level', type: 'VARCHAR(32)', isNullable: false, description: 'Tingkat risiko: Low, Medium, High' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: Scheduled, Completed, Follow-up Needed' },
    ],
  },
  // 26. supervision_actions
  {
    id: 'supervision_actions',
    name: 'SUPERVISION_ACTIONS',
    group: 'OPERATIONS',
    parentEntity: 'supervisions',
    description: 'Tindak lanjut (action item) perbaikan dari temuan kendala saat supervisi.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key butir aksi tindak lanjut' },
      { name: 'supervision_id', type: 'UUID', isFk: true, fkRef: 'supervisions.id', isNullable: false, description: 'Foreign Key ke SUPERVISIONS' },
      { name: 'action_item', type: 'TEXT', isNullable: false, description: 'Uraian instruksi tindakan perbaikan' },
      { name: 'owner_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'Penanggung jawab eksekusi (Guru / Siswa / DUDI)' },
      { name: 'due_date', type: 'DATE', isNullable: false, description: 'Batas akhir target penyelesaian' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: Open, In Progress, Resolved' },
      { name: 'completed_at', type: 'TIMESTAMPTZ', isNullable: true, description: 'Waktu selesai diselesaikan (UTC)' },
    ],
  },
  // 27. assessment_templates
  {
    id: 'assessment_templates',
    name: 'ASSESSMENT_TEMPLATES',
    group: 'ASSESSMENTS',
    parentEntity: 'internship_programs',
    description: 'Master template instrumen penilaian magang terstandar per program.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key template instrumen penilaian' },
      { name: 'program_id', type: 'UUID', isFk: true, fkRef: 'internship_programs.id', isNullable: false, description: 'Foreign Key ke INTERNSHIP_PROGRAMS' },
      { name: 'name', type: 'VARCHAR(255)', isNullable: false, description: 'Nama instrumen (cth: Rubrik PKL SMK 2026)' },
      { name: 'version', type: 'VARCHAR(32)', isNullable: false, description: 'Versi instrumen (v1.0, v2.1)' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status template: active, draft, archived' },
    ],
  },
  // 28. assessment_items
  {
    id: 'assessment_items',
    name: 'ASSESSMENT_ITEMS',
    group: 'ASSESSMENTS',
    parentEntity: 'assessment_templates',
    description: 'Indikator butir rubrik penilaian (aspek teknis, soft skill, K3, kedisiplinan).',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key butir indikator penilaian' },
      { name: 'template_id', type: 'UUID', isFk: true, fkRef: 'assessment_templates.id', isNullable: false, description: 'Foreign Key ke ASSESSMENT_TEMPLATES' },
      { name: 'competency_id', type: 'UUID', isFk: true, fkRef: 'competencies.id', isNullable: true, description: 'Foreign Key ke COMPETENCIES terkait (nullable jika soft skills)' },
      { name: 'code', type: 'VARCHAR(64)', isNullable: false, description: 'Kode indikator penilaian (TECH.01, SOFT.02)' },
      { name: 'category', type: 'VARCHAR(128)', isNullable: false, description: 'Kategori: Technical Skill, Soft Skill, Discipline, K3 Safety' },
      { name: 'indicator', type: 'TEXT', isNullable: false, description: 'Deskripsi unjuk kerja yang diobservasi' },
      { name: 'max_score', type: 'DECIMAL(5,2)', isNullable: false, description: 'Skor maksimum (cth: 100.00)' },
      { name: 'weight', type: 'DECIMAL(4,2)', isNullable: false, description: 'Bobot kontribusi (0.05 - 0.40)' },
    ],
  },
  // 29. assessments
  {
    id: 'assessments',
    name: 'ASSESSMENTS',
    group: 'ASSESSMENTS',
    parentEntity: 'placements',
    description: 'Rekapitulasi berkas penilaian gabungan dari mentor industri dan pembimbing sekolah.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key berkas penilaian' },
      { name: 'placement_id', type: 'UUID', isFk: true, fkRef: 'placements.id', isNullable: false, description: 'Foreign Key ke PLACEMENTS' },
      { name: 'template_id', type: 'UUID', isFk: true, fkRef: 'assessment_templates.id', isNullable: false, description: 'Foreign Key ke ASSESSMENT_TEMPLATES' },
      { name: 'assessor_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'Foreign Key ke USERS (Penilai)' },
      { name: 'assessor_type', type: 'VARCHAR(32)', isNullable: false, description: 'Tipe penilai: industry_mentor, school_teacher' },
      { name: 'score', type: 'DECIMAL(5,2)', isNullable: false, description: 'Nilai agregat angka rata-rata' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: Draft, Submitted, Finalized' },
      { name: 'submitted_at', type: 'TIMESTAMPTZ', isNullable: true, description: 'Waktu formulir dikirimkan (UTC)' },
      { name: 'finalized_at', type: 'TIMESTAMPTZ', isNullable: true, description: 'Waktu nilai dikunci permanen (UTC)' },
    ],
  },
  // 30. assessment_scores
  {
    id: 'assessment_scores',
    name: 'ASSESSMENT_SCORES',
    group: 'ASSESSMENTS',
    parentEntity: 'assessments',
    description: 'Nilai per butir indikator rubrik yang diberikan penilai beserta catatan evaluasi.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key detail skor butir rubrik' },
      { name: 'assessment_id', type: 'UUID', isFk: true, fkRef: 'assessments.id', isNullable: false, description: 'Foreign Key ke ASSESSMENTS' },
      { name: 'assessment_item_id', type: 'UUID', isFk: true, fkRef: 'assessment_items.id', isNullable: false, description: 'Foreign Key ke ASSESSMENT_ITEMS' },
      { name: 'score', type: 'DECIMAL(5,2)', isNullable: false, description: 'Nilai angka butir unjuk kerja' },
      { name: 'note', type: 'TEXT', isNullable: true, description: 'Catatan spesifik kelebihan/kekurangan siswa' },
    ],
  },
  // 31. certificates
  {
    id: 'certificates',
    name: 'CERTIFICATES',
    group: 'CERTIFICATES',
    parentEntity: 'placements',
    description: 'Sertifikat kompetensi kelulusan magang ber-QR Code dengan verifikasi publik.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key sertifikat digital' },
      { name: 'placement_id', type: 'UUID', isFk: true, fkRef: 'placements.id', isNullable: false, description: 'Foreign Key ke PLACEMENTS (1:1)' },
      { name: 'certificate_no', type: 'VARCHAR(128) UNIQUE', isNullable: false, description: 'Nomor seri resmi sertifikat kelulusan' },
      { name: 'issued_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Tanggal dan waktu penerbitan sertifikat (UTC)' },
      { name: 'verification_token', type: 'VARCHAR(255) UNIQUE', isNullable: false, description: 'Token cryptographic anti-pemalsuan untuk validasi publik' },
      { name: 'file_url', type: 'TEXT', isNullable: true, description: 'URL unduh dokumen PDF sertifikat resmi' },
      { name: 'status', type: 'VARCHAR(32)', isNullable: false, description: 'Status: active, revoked, reprinted' },
    ],
  },
  // 32. certificate_verifications
  {
    id: 'certificate_verifications',
    name: 'CERTIFICATE_VERIFICATIONS',
    group: 'CERTIFICATES',
    parentEntity: 'certificates',
    description: 'Log pelacakan publik saat QR sertifikat dipindai oleh pihak luar / perekrut.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key log verifikasi QR' },
      { name: 'certificate_id', type: 'UUID', isFk: true, fkRef: 'certificates.id', isNullable: false, description: 'Foreign Key ke CERTIFICATES' },
      { name: 'verified_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Waktu scan verifikasi dilakukan (UTC)' },
      { name: 'verifier_ip_hash', type: 'VARCHAR(64)', isNullable: true, description: 'Hash IP peninjau untuk proteksi audit anti-bot' },
    ],
  },
  // 33. notifications
  {
    id: 'notifications',
    name: 'NOTIFICATIONS',
    group: 'SYSTEM',
    description: 'Notifikasi sistem in-app & push alerting untuk reviu logbook, jadwal, & approval.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key notifikasi' },
      { name: 'user_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: false, description: 'Foreign Key penerima pesan ke USERS' },
      { name: 'type', type: 'VARCHAR(64)', isNullable: false, description: 'Kategori tipe: journal_approval, supervision_reminder, assessment_due' },
      { name: 'title', type: 'VARCHAR(255)', isNullable: false, description: 'Judul pemberitahuan' },
      { name: 'body', type: 'TEXT', isNullable: false, description: 'Isi teks penjelasan notifikasi' },
      { name: 'read_at', type: 'TIMESTAMPTZ', isNullable: true, description: 'Waktu notifikasi dibaca (nullable jika belum)' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Waktu pengiriman pesan (UTC)' },
    ],
  },
  // 34. audit_logs
  {
    id: 'audit_logs',
    name: 'AUDIT_LOGS',
    group: 'SYSTEM',
    description: 'Catatan audit keamanan & integritas data forensik (immutable change tracker).',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key log audit sistem' },
      { name: 'actor_user_id', type: 'UUID', isFk: true, fkRef: 'users.id', isNullable: true, description: 'Foreign Key pelaku tindakan ke USERS' },
      { name: 'action', type: 'VARCHAR(128)', isNullable: false, description: 'Aksi transaksi: INSERT, UPDATE, DELETE, FINALIZED' },
      { name: 'entity_type', type: 'VARCHAR(128)', isNullable: false, description: 'Nama entitas yang diubah (cth: assessments, placements)' },
      { name: 'entity_id', type: 'UUID', isNullable: false, description: 'ID record entitas terkait' },
      { name: 'old_data', type: 'JSONB', isNullable: true, description: 'Snapshot payload sebelum perubahan' },
      { name: 'new_data', type: 'JSONB', isNullable: true, description: 'Snapshot payload sesudah perubahan' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Waktu perubahan dicatat (UTC)' },
    ],
  },
];

// ============================================================================
// RELATIONAL MAPPING & FOREIGN KEYS
// ============================================================================
export const ERD_RELATIONS: ErdRelation[] = [
  { fromTable: 'user_roles', fromColumn: 'user_id', toTable: 'users', toColumn: 'id', relationType: 'N:M', description: 'Multi-role user assignment' },
  { fromTable: 'user_roles', fromColumn: 'role_id', toTable: 'roles', toColumn: 'id', relationType: '1:N', description: 'Role definition reference' },
  { fromTable: 'user_roles', fromColumn: 'school_id', toTable: 'schools', toColumn: 'id', relationType: '1:N', description: 'School scope context' },
  { fromTable: 'user_roles', fromColumn: 'industry_id', toTable: 'industries', toColumn: 'id', relationType: '1:N', description: 'Industry scope context' },
  
  { fromTable: 'school_members', fromColumn: 'school_id', toTable: 'schools', toColumn: 'id', relationType: '1:N', description: 'School institution membership' },
  { fromTable: 'school_members', fromColumn: 'user_id', toTable: 'users', toColumn: 'id', relationType: '1:1', description: 'User personnel account' },
  
  { fromTable: 'industry_units', fromColumn: 'industry_id', toTable: 'industries', toColumn: 'id', relationType: '1:N', description: 'Industry branch / workshop division' },
  { fromTable: 'industry_members', fromColumn: 'industry_id', toTable: 'industries', toColumn: 'id', relationType: '1:N', description: 'Industry employer membership' },
  { fromTable: 'industry_members', fromColumn: 'user_id', toTable: 'users', toColumn: 'id', relationType: '1:1', description: 'Industry staff account' },
  
  { fromTable: 'students', fromColumn: 'user_id', toTable: 'users', toColumn: 'id', relationType: '1:1', description: 'Student login identity' },
  { fromTable: 'students', fromColumn: 'school_id', toTable: 'schools', toColumn: 'id', relationType: '1:N', description: 'Student school of origin' },
  { fromTable: 'students', fromColumn: 'major_id', toTable: 'program_majors', toColumn: 'id', relationType: '1:N', description: 'Student vocational major' },
  { fromTable: 'student_profiles', fromColumn: 'student_id', toTable: 'students', toColumn: 'id', relationType: '1:1', description: 'Student biodata extension' },
  
  { fromTable: 'internship_programs', fromColumn: 'school_id', toTable: 'schools', toColumn: 'id', relationType: '1:N', description: 'School hosting internship cohort' },
  { fromTable: 'program_mentors', fromColumn: 'program_id', toTable: 'internship_programs', toColumn: 'id', relationType: '1:N', description: 'Program mentor assignment' },
  { fromTable: 'program_mentors', fromColumn: 'user_id', toTable: 'users', toColumn: 'id', relationType: '1:N', description: 'Mentor user record' },
  
  { fromTable: 'applications', fromColumn: 'program_id', toTable: 'internship_programs', toColumn: 'id', relationType: '1:N', description: 'Program application pipeline' },
  { fromTable: 'applications', fromColumn: 'student_id', toTable: 'students', toColumn: 'id', relationType: '1:N', description: 'Student applicant' },
  
  { fromTable: 'placements', fromColumn: 'program_id', toTable: 'internship_programs', toColumn: 'id', relationType: '1:N', description: 'Active placement program cohort' },
  { fromTable: 'placements', fromColumn: 'student_id', toTable: 'students', toColumn: 'id', relationType: '1:1', description: 'Placed student intern' },
  { fromTable: 'placements', fromColumn: 'industry_id', toTable: 'industries', toColumn: 'id', relationType: '1:N', description: 'Host industry company' },
  { fromTable: 'placements', fromColumn: 'unit_id', toTable: 'industry_units', toColumn: 'id', relationType: '1:N', description: 'Assigned workshop unit' },
  { fromTable: 'placements', fromColumn: 'industry_mentor_id', toTable: 'users', toColumn: 'id', relationType: '1:N', description: 'Direct industry mentor' },
  { fromTable: 'placements', fromColumn: 'school_mentor_id', toTable: 'users', toColumn: 'id', relationType: '1:N', description: 'Supervising school teacher' },
  
  { fromTable: 'placement_history', fromColumn: 'placement_id', toTable: 'placements', toColumn: 'id', relationType: '1:N', description: 'Placement mutation audit trail' },
  
  { fromTable: 'competencies', fromColumn: 'major_id', toTable: 'program_majors', toColumn: 'id', relationType: '1:N', description: 'Major competency standards' },
  { fromTable: 'competency_versions', fromColumn: 'competency_id', toTable: 'competencies', toColumn: 'id', relationType: '1:N', description: 'Competency rubric revision' },
  { fromTable: 'program_competencies', fromColumn: 'program_id', toTable: 'internship_programs', toColumn: 'id', relationType: '1:N', description: 'Program target competencies' },
  { fromTable: 'program_competencies', fromColumn: 'competency_version_id', toTable: 'competency_versions', toColumn: 'id', relationType: '1:N', description: 'Target version rubric' },
  
  { fromTable: 'student_competencies', fromColumn: 'placement_id', toTable: 'placements', toColumn: 'id', relationType: '1:N', description: 'Student placement progress' },
  { fromTable: 'student_competencies', fromColumn: 'program_competency_id', toTable: 'program_competencies', toColumn: 'id', relationType: '1:N', description: 'Target program competency' },
  
  { fromTable: 'attendance', fromColumn: 'placement_id', toTable: 'placements', toColumn: 'id', relationType: '1:N', description: 'Daily attendance logs' },
  { fromTable: 'attendance', fromColumn: 'verified_by', toTable: 'users', toColumn: 'id', relationType: '1:N', description: 'Attendance mentor sign-off' },
  
  { fromTable: 'journals', fromColumn: 'placement_id', toTable: 'placements', toColumn: 'id', relationType: '1:N', description: 'Daily logbook entries' },
  { fromTable: 'journals', fromColumn: 'reviewed_by', toTable: 'users', toColumn: 'id', relationType: '1:N', description: 'Journal reviewer sign-off' },
  { fromTable: 'journal_evidence', fromColumn: 'journal_id', toTable: 'journals', toColumn: 'id', relationType: '1:N', description: 'Logbook photo / artifact attachments' },
  
  { fromTable: 'competency_evidence', fromColumn: 'student_competency_id', toTable: 'student_competencies', toColumn: 'id', relationType: '1:N', description: 'Competency portfolio evidence' },
  { fromTable: 'competency_evidence', fromColumn: 'journal_id', toTable: 'journals', toColumn: 'id', relationType: '1:N', description: 'Linked daily journal entry' },
  
  { fromTable: 'supervisions', fromColumn: 'placement_id', toTable: 'placements', toColumn: 'id', relationType: '1:N', description: 'Supervision visit on placement' },
  { fromTable: 'supervisions', fromColumn: 'mentor_id', toTable: 'users', toColumn: 'id', relationType: '1:N', description: 'Visiting teacher supervisor' },
  { fromTable: 'supervision_actions', fromColumn: 'supervision_id', toTable: 'supervisions', toColumn: 'id', relationType: '1:N', description: 'Supervision remedial action item' },
  
  { fromTable: 'assessment_templates', fromColumn: 'program_id', toTable: 'internship_programs', toColumn: 'id', relationType: '1:N', description: 'Program assessment blueprint' },
  { fromTable: 'assessment_items', fromColumn: 'template_id', toTable: 'assessment_templates', toColumn: 'id', relationType: '1:N', description: 'Rubric criteria item' },
  { fromTable: 'assessments', fromColumn: 'placement_id', toTable: 'placements', toColumn: 'id', relationType: '1:N', description: 'Assessment placement evaluation' },
  { fromTable: 'assessments', fromColumn: 'template_id', toTable: 'assessment_templates', toColumn: 'id', relationType: '1:N', description: 'Applied evaluation template' },
  { fromTable: 'assessments', fromColumn: 'assessor_id', toTable: 'users', toColumn: 'id', relationType: '1:N', description: 'Assessor mentor / teacher' },
  { fromTable: 'assessment_scores', fromColumn: 'assessment_id', toTable: 'assessments', toColumn: 'id', relationType: '1:N', description: 'Detailed rubric scores' },
  { fromTable: 'assessment_scores', fromColumn: 'assessment_item_id', toTable: 'assessment_items', toColumn: 'id', relationType: '1:N', description: 'Evaluated criteria item' },
  
  { fromTable: 'certificates', fromColumn: 'placement_id', toTable: 'placements', toColumn: 'id', relationType: '1:1', description: 'Issued completion certificate' },
  { fromTable: 'certificate_verifications', fromColumn: 'certificate_id', toTable: 'certificates', toColumn: 'id', relationType: '1:N', description: 'QR verification scan log' },
  
  { fromTable: 'notifications', fromColumn: 'user_id', toTable: 'users', toColumn: 'id', relationType: '1:N', description: 'User alert notifications' },
  { fromTable: 'audit_logs', fromColumn: 'actor_user_id', toTable: 'users', toColumn: 'id', relationType: '1:N', description: 'System operator change log' },
];

// ============================================================================
// 11.2 FULL POSTGRESQL / SUPABASE DDL (All 34 Core Tables)
// ============================================================================
export const SQL_SCHEMA_DDL = `-- ============================================================================
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
`;
