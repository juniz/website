-- Enable moddatetime extension for automatic updated_at timestamp updates
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- =========================================
-- DOCTORS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialization text NOT NULL,
  image text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Trigger for update_at
CREATE TRIGGER handle_updated_at_doctors 
BEFORE UPDATE ON public.doctors 
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.doctors 
  FOR SELECT USING (true);
CREATE POLICY "Admin can modify doctors." ON public.doctors 
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- =========================================
-- SCHEDULES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "time" text NOT NULL,
  "date" date NOT NULL,
  total_quota integer DEFAULT 20 NOT NULL,
  filled_quota integer DEFAULT 0 NOT NULL,
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Index for doctor relation and querying speed
CREATE INDEX IF NOT EXISTS schedules_doctor_id_idx ON public.schedules(doctor_id);
CREATE INDEX IF NOT EXISTS schedules_date_idx ON public.schedules("date");

-- Trigger for update_at
CREATE TRIGGER handle_updated_at_schedules 
BEFORE UPDATE ON public.schedules 
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Schedules are viewable by everyone." ON public.schedules 
  FOR SELECT USING (true);
CREATE POLICY "Admin can modify schedules." ON public.schedules 
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- =========================================
-- REGISTRATIONS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  dob date NOT NULL,
  phone text NOT NULL,
  insurance text NOT NULL,
  bpjs_number text,
  complaint text,
  status text DEFAULT 'Pending' NOT NULL,
  schedule_id uuid NOT NULL REFERENCES public.schedules(id) ON DELETE RESTRICT,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes for querying by schedule or sorting by latest
CREATE INDEX IF NOT EXISTS registrations_schedule_id_idx ON public.registrations(schedule_id);
CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON public.registrations(created_at DESC);

-- Trigger for update_at
CREATE TRIGGER handle_updated_at_registrations 
BEFORE UPDATE ON public.registrations 
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patients can register online." ON public.registrations 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view all registrations." ON public.registrations 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can update/delete registrations." ON public.registrations 
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can delete registrations." ON public.registrations 
  FOR DELETE USING (auth.role() = 'authenticated');


-- =========================================
-- NEWS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  category text NOT NULL,
  image text,
  "date" timestamptz DEFAULT now() NOT NULL,
  author text DEFAULT 'Tim RS Bhayangkara' NOT NULL,
  read_time text DEFAULT '3 menit baca' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Index for searching articles by creation date (blog archive style)
CREATE INDEX IF NOT EXISTS news_date_idx ON public.news("date" DESC);

-- Trigger for update_at
CREATE TRIGGER handle_updated_at_news 
BEFORE UPDATE ON public.news 
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "News are viewable by everyone." ON public.news 
  FOR SELECT USING (true);
CREATE POLICY "Admin can modify news." ON public.news 
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- End of migration

