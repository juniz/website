import { api } from '@/lib/api';

/**
 * Helper to extract data from NestJS wrapped response
 */
const extractData = (res) => {
  if (!res.success) return [];
  const d = res.data?.data || res.data;
  // Handle case where it's { data: [], meta: {} }
  if (d && !Array.isArray(d) && Array.isArray(d.data)) return d.data;
  return Array.isArray(d) ? d : [];
};
const extractSingle = (res) => res.success ? (res.data.data || res.data) : null;

/**
 * Fetch Header/Footer Settings
 */
export async function getHeaderSettings() {
  const res = await api.get('/settings/key/header');
  return extractSingle(res)?.value || {};
}

/**
 * Fetch Hero Settings
 */
export async function getHeroSettings() {
  const res = await api.get('/settings/key/hero');
  return extractSingle(res)?.value || {};
}

/**
 * Fetch Maintenance Mode Settings
 */
export async function getMaintenanceSettings() {
  const res = await api.get('/settings/key/maintenance');
  return extractSingle(res)?.value || { isMaintenance: false };
}

/**
 * Fetch all page statuses (active/inactive)
 */
export async function getAllPageStatus() {
  const res = await api.get('/seo');
  const items = extractData(res);
  return items.map(s => ({
    route: s.route,
    isActive: s.isActive ?? true
  }));
}

/**
 * Fetch SEO for a route
 */
export async function getPageSEO(route) {
  const res = await api.get(`/seo/route?path=${encodeURIComponent(route)}`);
  const s = extractSingle(res);
  if (!s) return null;

  return {
    ...s,
    meta_title: s.title,
    meta_description: s.description,
    meta_keywords: s.keywords ? s.keywords.split(',').map(k => k.trim()) : [],
    is_active: s.isActive ?? true,
    og_image: s.ogImage || null,
  };
}

/**
 * Fetch Services (Layanan)
 */
export async function getPublicServices() {
  const res = await api.get('/services');
  const items = extractData(res);
  
  return items.map(s => ({
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
export async function getPublicTestimonials() {
  const res = await api.get('/testimonials');
  const items = extractData(res);
  
  return items.map(t => ({
    ...t,
    avatar_url: t.avatarUrl,
    is_active: t.isActive,
  })).slice(0, 6);
}

/**
 * Fetch Partners (Mitra Rumah Sakit)
 */
export async function getPublicPartners() {
  try {
    const res = await api.get('/partners?isActive=true');
    const items = extractData(res);

    return items
      .map(p => ({
        id:          p.id,
        name:        p.name,
        logo_url:    p.logoUrl || p.imageUrl || p.logo_url || null,
        website_url: p.link    || p.website_url || '',
        sort_order:  p.sortOrder ?? p.sort_order ?? 0,
        is_active:   p.isActive ?? p.is_active ?? true,
      }))
      .filter(p => p.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  } catch (err) {
    console.error('Error fetching partners:', err);
    return [];
  }
}

/**
 * Fetch FAQs
 */
export async function getPublicFAQs() {
  const res = await api.get('/faqs');
  const items = extractData(res);
  
  return items.map(f => ({
    ...f,
    is_active: f.isActive,
    sort_order: f.sortOrder,
  }));
}

/**
 * Fetch all About data combined
 */
export async function getPublicAboutData() {
  try {
    const [
      resProfile,
      resStats,
      resVisiMisi,
      resValues,
      resMilestones,
      resContact,
    ] = await Promise.all([
      api.get('/about/profile'),
      api.get('/about/stats'),
      api.get('/about/visi-misi'),
      api.get('/about/values'),
      api.get('/about/milestones'),
      api.get('/about/contact'),
    ]);

    const profileData = extractSingle(resProfile);
    const profile = profileData ? {
      header_title: profileData.headerTitle,
      header_subtitle: profileData.headerSubtitle,
      paragraph_1: profileData.paragraph1,
      paragraph_2: profileData.paragraph2,
      accreditation_title: profileData.accreditationTitle,
      accreditation_body: profileData.accreditationBody,
      accreditation_valid: profileData.accreditationValid,
      accreditation_certificate_url: profileData.accreditationCertificateUrl
    } : null;

    const stats = extractData(resStats).map(s => ({
      ...s,
      icon_name: s.iconName
    }));

    const visiMisi = extractSingle(resVisiMisi);

    const values = extractData(resValues);
    const milestones = extractData(resMilestones);
    const contact = extractData(resContact);

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
export async function getPublicPejabat() {
  try {
    const res = await api.get('/pejabat?isActive=true&limit=50');
    return extractData(res);
  } catch (err) {
    console.error('Error fetching public pejabat:', err);
    return [];
  }
}
