import { api } from '@/lib/api';

/**
 * Helper to extract data from NestJS wrapped response
 */
const extractData = (res) => res.success ? (res.data.data || res.data) : [];
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
  return extractSingle(res);
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
