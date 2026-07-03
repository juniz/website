import { api } from '@/lib/api';
import { PageSEO, Service, Testimonial, Partner, FAQ, AboutData, AboutProfile, AboutStat, AboutVisiMisi, AboutValue, AboutMilestone, AboutContact, Pejabat, Facility } from '@/types/api';

/**
 * Helper to extract data from NestJS wrapped response
 */
const extractData = (res: any): any[] => {
  if (!res.success) return [];
  const d = res.data?.data || res.data;
  // Handle case where it's { data: [], meta: {} }
  if (d && !Array.isArray(d) && Array.isArray(d.data)) return d.data;
  return Array.isArray(d) ? d : [];
};

const extractSingle = (res: any): any => res.success ? (res.data.data || res.data) : null;

/**
 * Fetch Header/Footer Settings
 */
export async function getHeaderSettings(): Promise<any> {
  const res = await api.get<any>('/settings/key/header');
  return extractSingle(res)?.value || {};
}

/**
 * Fetch Hero Settings
 */
export async function getHeroSettings(): Promise<any> {
  const res = await api.get<any>('/settings/key/hero');
  return extractSingle(res)?.value || {};
}

/**
 * Fetch Maintenance Mode Settings
 */
export async function getMaintenanceSettings(): Promise<any> {
  const res = await api.get<any>('/settings/key/maintenance');
  return extractSingle(res)?.value || { isMaintenance: false };
}

/**
 * Fetch all page statuses (active/inactive)
 */
export async function getAllPageStatus(): Promise<{ route: string; isActive: boolean }[]> {
  const res = await api.get<any>('/seo');
  const items = extractData(res);
  return items.map((s: any) => ({
    route: s.route,
    isActive: s.isActive ?? true
  }));
}

/**
 * Fetch SEO for a route
 */
export async function getPageSEO(route: string): Promise<PageSEO | null> {
  const res = await api.get<any>(`/seo/route?path=${encodeURIComponent(route)}`);
  const s = extractSingle(res);
  if (!s) return null;

  return {
    ...s,
    meta_title: s.title,
    meta_description: s.description,
    meta_keywords: s.keywords ? s.keywords.split(',').map((k: string) => k.trim()) : [],
    is_active: s.isActive ?? true,
    og_image: s.ogImage || null,
  } as PageSEO;
}

/**
 * Fetch Services (Layanan)
 */
export async function getPublicServices(): Promise<Service[]> {
  const res = await api.get<any>('/services');
  const items = extractData(res);
  
  return items.map((s: any): Service => ({
    ...s,
    name: s.name,
    slug: s.slug,
    icon_name: s.iconName,
    color_code: s.colorCode,
    bg_color_code: s.bgColorCode,
    count_info: s.countInfo,
    is_active: s.isActive,
  }));
}

/**
 * Fetch Testimonials
 */
export async function getPublicTestimonials(): Promise<Testimonial[]> {
  const res = await api.get<any>('/testimonials');
  const items = extractData(res);
  
  return items.map((t: any): Testimonial => ({
    ...t,
    avatar_url: t.avatarUrl,
    is_active: t.isActive,
  })).slice(0, 6);
}

/**
 * Fetch Partners (Mitra Rumah Sakit)
 */
export async function getPublicPartners(): Promise<Partner[]> {
  try {
    const res = await api.get<any>('/partners?isActive=true');
    const items = extractData(res);

    return items
      .map((p: any): Partner => ({
        id:          p.id,
        name:        p.name,
        logo_url:    p.logoUrl || p.imageUrl || p.logo_url || null,
        website_url: p.link    || p.website_url || '',
        sort_order:  p.sortOrder ?? p.sort_order ?? 0,
        is_active:   p.isActive ?? p.is_active ?? true,
      }))
      .filter((p: Partner) => p.is_active)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  } catch (err) {
    console.error('Error fetching partners:', err);
    return [];
  }
}

/**
 * Fetch FAQs
 */
export async function getPublicFAQs(): Promise<FAQ[]> {
  const res = await api.get<any>('/faqs');
  const items = extractData(res);
  
  return items.map((f: any): FAQ => ({
    ...f,
    is_active: f.isActive,
    sort_order: f.sortOrder,
  }));
}

/**
 * Fetch all About data combined
 */
export async function getPublicAboutData(): Promise<AboutData> {
  try {
    const [
      resProfile,
      resStats,
      resVisiMisi,
      resValues,
      resMilestones,
      resContact,
    ] = await Promise.all([
      api.get<any>('/about/profile'),
      api.get<any>('/about/stats'),
      api.get<any>('/about/visi-misi'),
      api.get<any>('/about/values'),
      api.get<any>('/about/milestones'),
      api.get<any>('/about/contact'),
    ]);

    const profileData = extractSingle(resProfile);
    const profile: AboutProfile | null = profileData ? {
      header_title: profileData.headerTitle,
      header_subtitle: profileData.headerSubtitle,
      paragraph_1: profileData.paragraph1,
      paragraph_2: profileData.paragraph2,
      accreditation_title: profileData.accreditationTitle,
      accreditation_body: profileData.accreditationBody,
      accreditation_valid: profileData.accreditationValid,
      accreditation_certificate_url: profileData.accreditationCertificateUrl
    } : null;

    const stats: AboutStat[] = extractData(resStats).map((s: any) => ({
      ...s,
      icon_name: s.iconName
    }));

    const visiMisi: AboutVisiMisi | null = extractSingle(resVisiMisi);

    const values: AboutValue[] = extractData(resValues);
    const milestones: AboutMilestone[] = extractData(resMilestones);
    const contact: AboutContact[] = extractData(resContact);

    return { 
      profile, 
      stats: stats.length ? stats : null, 
      visiMisi, 
      values: values.length ? values : null, 
      milestones: milestones.length ? milestones : null, 
      contact: contact.length ? contact : null 
    };
  } catch (err) {
    console.error('Error fetching public about data:', err);
    return { profile: null, stats: null, visiMisi: null, values: null, milestones: null, contact: null };
  }
}

/**
 * Fetch Public Pejabat (Struktural)
 */
export async function getPublicPejabat(): Promise<Pejabat[]> {
  try {
    const res = await api.get<any>('/pejabat?isActive=true&limit=50');
    return extractData(res);
  } catch (err) {
    console.error('Error fetching public pejabat:', err);
    return [];
  }
}

/**
 * Fetch Single Pejabat by Slug
 */
export async function getPublicPejabatBySlug(slug: string): Promise<Pejabat | null> {
  try {
    const res = await api.get<any>(`/pejabat/slug/${slug}`);
    return extractSingle(res);
  } catch (err) {
    console.error(`Error fetching public pejabat by slug ${slug}:`, err);
    return null;
  }
}

/**
 * Fetch Facilities
 */
export async function getPublicFacilities(): Promise<Facility[]> {
  try {
    const res = await api.get<any>('/facilities', { cache: 'force-cache', next: { revalidate: 3600 } });
    const items = extractData(res);
    return items.map((f: any): Facility => ({
      id: f.id,
      title: f.title,
      description: f.description,
      category: f.category || 'Umum',
      image_url: f.imageUrl || null,
      sort_order: f.sortOrder || 0,
      is_active: f.isActive ?? true,
    })).filter((f: Facility) => f.is_active).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  } catch (err) {
    console.error('Error fetching public facilities:', err);
    return [];
  }
}
