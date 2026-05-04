-- ============================================================
-- Add certificate upload to about_profile
-- Created: 2026-04-15
-- Best Practices:
--   - ALTER TABLE ... ADD COLUMN IF NOT EXISTS (safe re-run)
--   - Nullable text column for URL — no NOT NULL constraint
--     because existing rows shouldn't break
-- ============================================================

ALTER TABLE public.about_profile
    ADD COLUMN IF NOT EXISTS accreditation_certificate_url text;
