export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Terms {
  version: string;
  points: string[];
}

export interface ConsentResult {
  id: string;
  session_id: string;
  pasien_type: 'baru' | 'lama';
  created_at?: string;
}

export interface Patient {
  no_rkm_medis: string;
  nm_pasien: string;
  no_ktp: string;
  tgl_lahir: string;
  // potentially other fields returned by SIMRS
}

export interface Schedule {
  kd_dokter: string;
  nm_dokter: string;
  kd_poli: string;
  nm_poli: string;
  jam_mulai: string;
  jam_selesai: string;
  kuota: number;
  registrasi: number;
}

export interface BookingResult {
  no_reg: string;
  no_rawat?: string;
  tgl_registrasi?: string;
  [key: string]: any;
}

export interface QrStatusResult {
  status: 'pending' | 'scanned' | 'transferred' | 'expired' | 'error';
  [key: string]: any;
}

export interface DoctorSchedule {
  id: string | number;
  date: string;
  time: string;
  totalQuota: number;
  filledQuota: number;
  doctorId: string | number;
  doctorName: string;
  specialization: string;
  specializationCode: string;
  doctor?: {
    name: string;
    specialization: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  isActive: boolean;
  ogImage: string | null;
  route: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  is_active: boolean;
  og_image: string | null;
  [key: string]: any;
}

export interface Service {
  id: string | number;
  name: string;
  slug: string;
  iconName: string;
  colorCode: string;
  bgColorCode: string;
  countInfo: string;
  isActive: boolean;
  is_active?: boolean;
  icon_name?: string;
  color_code?: string;
  bg_color_code?: string;
  count_info?: string;
}

export interface Testimonial {
  id: string | number;
  patient_name: string;
  patient_role: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  avatar_url?: string;
  isActive?: boolean;
  is_active?: boolean;
}

export interface NewsArticle {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  coverBg: string;
  author: string;
  date: string;
  read_time: string;
  image?: string | null;
  [key: string]: any;
}


export interface Partner {
  id: string | number;
  name: string;
  logoUrl?: string;
  imageUrl?: string;
  logo_url?: string | null;
  link?: string;
  website_url?: string;
  sortOrder?: number;
  sort_order?: number;
  isActive?: boolean;
  is_active?: boolean;
}

export interface FAQ {
  id: string | number;
  question: string;
  answer: string;
  isActive: boolean;
  is_active?: boolean;
  sortOrder: number;
  sort_order?: number;
}

export interface AboutProfile {
  header_title: string | null;
  header_subtitle: string | null;
  paragraph_1: string | null;
  paragraph_2: string | null;
  accreditation_title: string | null;
  accreditation_body: string | null;
  accreditation_valid: string | null;
  accreditation_certificate_url: string | null;
}

export interface AboutStat {
  id: string | number;
  label: string;
  value: string;
  iconName: string;
  icon_name?: string;
}

export interface AboutVisiMisi {
  id: string | number;
  visi: string;
  misi: string;
}

export interface AboutValue {
  id: string | number;
  title: string;
  description: string;
}

export interface AboutMilestone {
  id: string | number;
  year: string;
  event: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface AboutContact {
  id: string | number;
  icon: string;
  text: string;
  sort_order?: number;
}

export interface AboutData {
  profile: AboutProfile | null;
  stats: AboutStat[] | null;
  visiMisi: AboutVisiMisi | null;
  values: AboutValue[] | null;
  milestones: AboutMilestone[] | null;
  contact: AboutContact[] | null;
}

export interface Pejabat {
  id: string | number;
  name: string;
  position: string;
  imageUrl: string;
  slug: string;
  isActive: boolean;
  [key: string]: any;
}

export interface Facility {
  id: string | number;
  title: string;
  description: string;
  category?: string;
  imageUrl?: string | null;
  image_url?: string | null;
  sortOrder?: number;
  sort_order?: number;
  isActive?: boolean;
  is_active?: boolean;
}

export interface Doctor {
  id: string | number;
  name: string;
  specialization: string;
  isAvailable: boolean;
  specializationCode: string;
  availability: 'today' | 'tomorrow' | 'unavailable';
  avatarBg: string;
  avatarColor: string;
  experience: string;
  education: string;
  bio: string;
  todaySchedule: string | null;
  image?: string | null;
  [key: string]: any;
}


