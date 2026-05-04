-- =========================================
-- SITE SETTINGS & CONTENT MANAGEMENT MIGRATION
-- Created: 2026-04-13
-- =========================================

-- Enable moddatetime if not already enabled (redundant but safe)
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- =========================================
-- 1. SITE SETTINGS (Generic Key-Value)
-- =========================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "key" text UNIQUE NOT NULL,
    "value" jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Trigger for updated_at
CREATE TRIGGER handle_updated_at_site_settings 
BEFORE UPDATE ON public.site_settings 
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public settings are viewable by everyone." ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin can modify site_settings." ON public.site_settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =========================================
-- 2. PAGE SEO (Per-route Meta)
-- =========================================
CREATE TABLE IF NOT EXISTS public.page_seo (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    route text UNIQUE NOT NULL, -- e.g. '/', '/about', '/doctors'
    meta_title text,
    meta_description text,
    meta_keywords text[],
    og_image text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Trigger for updated_at
CREATE TRIGGER handle_updated_at_page_seo 
BEFORE UPDATE ON public.page_seo 
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SEO tags are viewable by everyone." ON public.page_seo FOR SELECT USING (true);
CREATE POLICY "Admin can modify page_seo." ON public.page_seo FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =========================================
-- 3. SERVICES (Layanan)
-- =========================================
CREATE TABLE IF NOT EXISTS public.services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    description text,
    count_info text, -- e.g. "6 dokter spesialis"
    icon_name text, -- e.g. "heart", "users"
    color_code text, -- e.g. "#E24B4A"
    bg_color_code text, -- e.g. "#FCEBEB"
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Trigger
CREATE TRIGGER handle_updated_at_services BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are viewable by everyone." ON public.services FOR SELECT USING (true);
CREATE POLICY "Admin can modify services." ON public.services FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =========================================
-- 4. FACILITIES (Fasilitas)
-- =========================================
CREATE TABLE IF NOT EXISTS public.facilities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    image_url text,
    category text, -- e.g. "Unggulan", "Rawat Inap"
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Trigger
CREATE TRIGGER handle_updated_at_facilities BEFORE UPDATE ON public.facilities FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Facilities are viewable by everyone." ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Admin can modify facilities." ON public.facilities FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =========================================
-- 5. TESTIMONIALS (Ulasan)
-- =========================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name text NOT NULL,
    patient_role text, -- e.g. "Pasien Poli Jantung"
    content text NOT NULL,
    rating integer DEFAULT 5,
    avatar_url text,
    is_visible boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Trigger
CREATE TRIGGER handle_updated_at_testimonials BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials are viewable by everyone." ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admin can modify testimonials." ON public.testimonials FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =========================================
-- 6. FAQS (Tanya Jawab)
-- =========================================
CREATE TABLE IF NOT EXISTS public.faqs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question text NOT NULL,
    answer text NOT NULL,
    category text DEFAULT 'Umum',
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Trigger
CREATE TRIGGER handle_updated_at_faqs BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQs are viewable by everyone." ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Admin can modify faqs." ON public.faqs FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =========================================
-- 7. PARTNERS (Partner Asuransi)
-- =========================================
CREATE TABLE IF NOT EXISTS public.partners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    logo_url text,
    "type" text DEFAULT 'Insurance', -- e.g. "Insurance", "Corporate"
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Trigger
CREATE TRIGGER handle_updated_at_partners BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners are viewable by everyone." ON public.partners FOR SELECT USING (true);
CREATE POLICY "Admin can modify partners." ON public.partners FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =========================================
-- 8. CONTACT MESSAGES (Inbox)
-- =========================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text,
    phone text,
    subject text,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send contact messages." ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view all messages." ON public.contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can update/delete messages." ON public.contact_messages FOR ALL USING (auth.role() = 'authenticated');


-- =========================================
-- SEED INITIAL DATA
-- =========================================

-- Seed Site Settings
INSERT INTO public.site_settings ("key", "value") VALUES
('header', '{
    "logo_text": "RS Bhayangkara",
    "logo_subtext": "Nganjuk",
    "address": "Jl. Ahmad Yani No. 1, Nganjuk, Jawa Timur 64418",
    "phone": "(0358) XXXXXX",
    "business_hours": "IGD: 24 Jam · Poli: Sen–Jum 07.00–21.00",
    "navigation": [
        {"label": "Beranda", "href": "/"},
        {"label": "Profil", "href": "/about"},
        {"label": "Dokter", "href": "/doctors"},
        {"label": "Jadwal", "href": "/schedule"},
        {"label": "Berita", "href": "/news"}
    ]
}'::jsonb),
('hero', '{
    "accreditation": "Terakreditasi Madya — RS Bhayangkara Nganjuk",
    "title": "Kesehatan Anda,",
    "title_accent": "Prioritas Kami",
    "subtitle": "Layanan kesehatan terpercaya dengan dokter spesialis berpengalaman dan teknologi medis terkini untuk masyarakat Nganjuk dan sekitarnya.",
    "cta_primary": {"label": "Daftar Online", "href": "/register"},
    "cta_secondary": {"label": "Lihat Jadwal", "href": "/schedule"},
    "image_url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2053",
    "stats": [
        {"label": "Dokter Spesialis", "value": "32+"},
        {"label": "Poli Klinik", "value": "10"},
        {"label": "IGD Siaga", "value": "24/7"}
    ],
    "trust_indicators": [
        {"label": "BPJS Kesehatan", "icon": "🏥"},
        {"label": "Data Terlindungi", "icon": "🔒"},
        {"label": "Akreditasi KARS", "icon": "⭐"}
    ]
}'::jsonb),
('footer', '{
    "about_text": "Rumah sakit terakreditasi Madya yang melayani masyarakat Nganjuk dengan standar medis terpercaya.",
    "social_links": [
        {"platform": "Instagram", "url": "#"},
        {"platform": "Facebook", "url": "#"}
    ]
}'::jsonb)
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";

-- Seed SEO
INSERT INTO public.page_seo (route, meta_title, meta_description, meta_keywords) VALUES
('/', 'RS Bhayangkara Nganjuk — Layanan Kesehatan Terpercaya', 'Rumah sakit terakreditasi dengan 32+ dokter spesialis di Nganjuk. Daftar online, cek jadwal dokter, dan layanan IGD 24 jam.', ARRAY['rumah sakit Nganjuk', 'RS Bhayangkara Nganjuk', 'dokter spesialis', 'IGD 24 jam']),
('/about', 'Tentang Kami — RS Bhayangkara Nganjuk', 'Profil dan visi misi Rumah Sakit Bhayangkara Nganjuk.', ARRAY['profil RS Bhayangkara', 'vis misi']),
('/doctors', 'Cari Dokter Spesialis — RS Bhayangkara Nganjuk', 'Temukan dokter spesialis terbaik kami untuk kebutuhan kesehatan Anda.', ARRAY['dokter spesialis nganjuk', 'cari dokter']),
('/schedule', 'Jadwal Dokter — RS Bhayangkara Nganjuk', 'Cek jadwal praktek dokter spesialis RS Bhayangkara Nganjuk.', ARRAY['jadwal dokter nganjuk']),
('/news', 'Berita & Artikel Kesehatan — RS Bhayangkara Nganjuk', 'Informasi kesehatan terbaru dan berita seputar rumah sakit.', ARRAY['berita kesehatan', 'info rs'])
ON CONFLICT (route) DO NOTHING;

-- Seed Services
INSERT INTO public.services (slug, name, count_info, icon_name, color_code, bg_color_code, sort_order) VALUES
('jantung', 'Poli Jantung', '6 dokter spesialis', 'heart', '#E24B4A', '#FCEBEB', 1),
('anak', 'Poli Anak', '4 dokter spesialis', 'users', '#185FA5', '#E6F1FB', 2),
('bedah', 'Poli Bedah', '5 dokter spesialis', 'activity', '#378ADD', '#E6F1FB', 3),
('radiologi', 'Radiologi', 'CT Scan & Rontgen', 'monitor', '#534AB7', '#EEECFB', 4),
('saraf', 'Poli Saraf', '3 dokter spesialis', 'zap', '#1D9E75', '#E1F5EE', 5),
('kandungan', 'Poli Kandungan', '5 dokter spesialis', 'shield', '#EF9F27', '#FAEEDA', 6),
('mata', 'Poli Mata', '2 dokter spesialis', 'eye', '#0F6E56', '#E1F5EE', 7),
('tht', 'Poli THT', '2 dokter spesialis', 'ear', '#185FA5', '#E6F1FB', 8),
('ortopedi', 'Poli Ortopedi', '3 dokter spesialis', 'bone', '#5F5E5A', '#F1EFE8', 9),
('igd', 'IGD 24 Jam', 'Selalu siaga', 'ambulance', '#E24B4A', '#FCEBEB', 10)
ON CONFLICT (slug) DO NOTHING;

-- Seed FAQs
INSERT INTO public.faqs (question, answer, category, sort_order) VALUES

-- =========================================
-- 9. STORAGE BUCKETS & POLICIES
-- =========================================

-- Create site-assets bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public access to site-assets
CREATE POLICY "Public Access to site-assets"
ON storage.objects FOR SELECT
USING ( bucket_id = 'site-assets' );

-- Policy: Allow authenticated users to upload to site-assets
CREATE POLICY "Authenticated users can upload to site-assets"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'site-assets' AND auth.role() = 'authenticated' );

-- Policy: Allow authenticated users to update/delete in site-assets
CREATE POLICY "Authenticated users can manage site-assets"
ON storage.objects FOR ALL
USING ( bucket_id = 'site-assets' AND auth.role() = 'authenticated' );
