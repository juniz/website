-- ============================================================
-- About Page Content Management
-- Created: 2026-04-15
-- Best Practices Applied:
--   - schema-: UUID primary keys, proper data types, timestamptz
--   - security-: RLS enabled on all tables, minimal privilege policies
--   - query-: B-tree indexes on frequently filtered columns
--   - schema-: moddatetime trigger for auto updated_at
-- ============================================================

-- ============================================================
-- 1. ABOUT_PROFILE — Single-row hospital profile card
--    Stores: paragraph text (up to 2), accreditation badge info
-- ============================================================
CREATE TABLE IF NOT EXISTS public.about_profile (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    paragraph_1         text NOT NULL DEFAULT '',
    paragraph_2         text NOT NULL DEFAULT '',
    accreditation_title text NOT NULL DEFAULT 'TERAKREDITASI MADYA',
    accreditation_body  text NOT NULL DEFAULT 'Komisi Akreditasi Rumah Sakit (KARS)',
    accreditation_valid text NOT NULL DEFAULT 'Berlaku s.d 2027',
    header_title        text NOT NULL DEFAULT 'Tentang Kami',
    header_subtitle     text NOT NULL DEFAULT 'Melayani masyarakat Nganjuk dengan sepenuh hati sejak 1985',
    updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Trigger: auto-update updated_at
CREATE TRIGGER handle_updated_at_about_profile
    BEFORE UPDATE ON public.about_profile
    FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.about_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_profile_select_public"
    ON public.about_profile FOR SELECT USING (true);
CREATE POLICY "about_profile_write_authed"
    ON public.about_profile FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Seed with current hardcoded data
INSERT INTO public.about_profile (
    paragraph_1, paragraph_2,
    accreditation_title, accreditation_body, accreditation_valid,
    header_title, header_subtitle
) VALUES (
    'RS Bhayangkara Nganjuk adalah rumah sakit umum di bawah naungan Kepolisian Negara Republik Indonesia yang telah melayani masyarakat Nganjuk dan sekitarnya sejak tahun 1985. Dengan status terakreditasi Madya dari KARS, kami berkomitmen memberikan layanan kesehatan berstandar tinggi untuk seluruh lapisan masyarakat.',
    'Didukung oleh lebih dari 32 dokter spesialis dan ratusan tenaga kesehatan profesional, RS Bhayangkara Nganjuk terus berinovasi untuk menghadirkan pengalaman layanan medis yang nyaman, cepat, dan terpercaya.',
    'TERAKREDITASI MADYA',
    'Komisi Akreditasi Rumah Sakit (KARS)',
    'Berlaku s.d 2027',
    'Tentang Kami',
    'Melayani masyarakat Nganjuk dengan sepenuh hati sejak 1985'
);

-- ============================================================
-- 2. ABOUT_STATS — Key statistics bar (4 items by default)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.about_stats (
    id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
    value      text    NOT NULL,              -- e.g. "40+"
    label      text    NOT NULL,              -- e.g. "Tahun Melayani"
    icon_name  text    NOT NULL DEFAULT 'award', -- award | bed | users | grid
    sort_order integer NOT NULL DEFAULT 0,
    is_active  boolean NOT NULL DEFAULT true,
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index: sort_order is used in ORDER BY on every page render
CREATE INDEX IF NOT EXISTS about_stats_sort_idx ON public.about_stats (sort_order ASC);

CREATE TRIGGER handle_updated_at_about_stats
    BEFORE UPDATE ON public.about_stats
    FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

ALTER TABLE public.about_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_stats_select_public"  ON public.about_stats FOR SELECT USING (true);
CREATE POLICY "about_stats_write_authed"   ON public.about_stats FOR ALL
    USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO public.about_stats (value, label, icon_name, sort_order) VALUES
    ('40+', 'Tahun Melayani',   'award', 1),
    ('120', 'Tempat Tidur',     'bed',   2),
    ('32+', 'Dokter Spesialis', 'users', 3),
    ('10',  'Poli Klinik',      'grid',  4);

-- ============================================================
-- 3. ABOUT_VISI_MISI — Vision & Mission content
-- ============================================================
CREATE TABLE IF NOT EXISTS public.about_visi_misi (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    visi       text NOT NULL DEFAULT '',
    misi       text[] NOT NULL DEFAULT '{}', -- Array of mission bullet points
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER handle_updated_at_about_visi_misi
    BEFORE UPDATE ON public.about_visi_misi
    FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

ALTER TABLE public.about_visi_misi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_visi_misi_select_public" ON public.about_visi_misi FOR SELECT USING (true);
CREATE POLICY "about_visi_misi_write_authed"  ON public.about_visi_misi FOR ALL
    USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO public.about_visi_misi (visi, misi) VALUES (
    'Menjadi rumah sakit terakreditasi paripurna yang unggul, profesional, dan terpercaya di Jawa Timur pada tahun 2030.',
    ARRAY[
        'Memberikan pelayanan medis bermutu tinggi',
        'Mengembangkan SDM yang profesional dan berkarakter',
        'Menerapkan sistem manajemen berbasis digital',
        'Menjadi mitra kesehatan masyarakat Nganjuk'
    ]
);

-- ============================================================
-- 4. ABOUT_VALUES — Core hospital values cards
-- ============================================================
CREATE TABLE IF NOT EXISTS public.about_values (
    id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
    title      text    NOT NULL,
    description text   NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    is_active  boolean NOT NULL DEFAULT true,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS about_values_sort_idx ON public.about_values (sort_order ASC);

CREATE TRIGGER handle_updated_at_about_values
    BEFORE UPDATE ON public.about_values
    FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

ALTER TABLE public.about_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_values_select_public" ON public.about_values FOR SELECT USING (true);
CREATE POLICY "about_values_write_authed"  ON public.about_values FOR ALL
    USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO public.about_values (title, description, sort_order) VALUES
    ('Profesional', 'Tenaga medis bersertifikat dan terus mengikuti perkembangan ilmu kedokteran terkini.', 1),
    ('Terpercaya',  'Diakreditasi KARS Madya; standar mutu dan keselamatan pasien selalu diutamakan.',       2),
    ('Peduli',      'Melayani seluruh lapisan masyarakat, termasuk pemegang BPJS Kesehatan.',                3),
    ('Inovatif',    'Teknologi medis modern dan sistem digital untuk kenyamanan pasien.',                     4);

-- ============================================================
-- 5. ABOUT_MILESTONES — Hospital timeline / history
-- ============================================================
CREATE TABLE IF NOT EXISTS public.about_milestones (
    id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
    year       varchar(4) NOT NULL,   -- e.g. "1985"
    event      text    NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    is_active  boolean NOT NULL DEFAULT true,
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Partial index: only active milestones are ever displayed
CREATE INDEX IF NOT EXISTS about_milestones_active_sort_idx
    ON public.about_milestones (sort_order ASC)
    WHERE is_active = true;

CREATE TRIGGER handle_updated_at_about_milestones
    BEFORE UPDATE ON public.about_milestones
    FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

ALTER TABLE public.about_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_milestones_select_public" ON public.about_milestones FOR SELECT USING (true);
CREATE POLICY "about_milestones_write_authed"  ON public.about_milestones FOR ALL
    USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO public.about_milestones (year, event, sort_order) VALUES
    ('1985', 'Rumah sakit didirikan sebagai fasilitas kesehatan kepolisian',      1),
    ('1999', 'Dibuka untuk masyarakat umum — akreditasi pertama',                 2),
    ('2010', 'Ekspansi gedung rawat inap — kapasitas 120 tempat tidur',           3),
    ('2018', 'Akreditasi KARS Madya — standar layanan meningkat signifikan',      4),
    ('2023', 'Pembukaan unit Radiologi CT Scan & laboratorium modern',            5),
    ('2025', 'Peluncuran sistem pendaftaran online & rekam medis digital',        6);

-- ============================================================
-- 6. ABOUT_CONTACT — Contact info items shown on sidebar
-- ============================================================
CREATE TABLE IF NOT EXISTS public.about_contact (
    id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
    icon       text    NOT NULL DEFAULT '📍', -- emoji icon
    text       text    NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS about_contact_sort_idx ON public.about_contact (sort_order ASC);

CREATE TRIGGER handle_updated_at_about_contact
    BEFORE UPDATE ON public.about_contact
    FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

ALTER TABLE public.about_contact ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about_contact_select_public" ON public.about_contact FOR SELECT USING (true);
CREATE POLICY "about_contact_write_authed"  ON public.about_contact FOR ALL
    USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

INSERT INTO public.about_contact (icon, text, sort_order) VALUES
    ('📍', 'Nganjuk, Jawa Timur 64418',             1),
    ('📞', '(0358) XXXXXX',                          2),
    ('🕐', 'IGD: 24 Jam · Poli: Sen–Jum 07.00–21.00', 3);
