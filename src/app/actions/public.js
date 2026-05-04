import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * Fetch Header/Footer Settings
 */
export async function getHeaderSettings() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'header').single();
  return data?.value || {};
}

/**
 * Fetch Hero Settings
 */
export async function getHeroSettings() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero').single();
  return data?.value || {};
}

/**
 * Fetch SEO for a route
 */
export async function getPageSEO(route) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from('page_seo').select('*').eq('route', route).single();
  return data;
}

/**
 * Fetch Services (Layanan)
 */
export async function getPublicServices() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return data || [];
}

/**
 * Fetch Testimonials
 */
export async function getPublicTestimonials() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(6);
  return data || [];
}

/**
 * Fetch FAQs
 */
export async function getPublicFAQs() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });
  return data || [];
}

