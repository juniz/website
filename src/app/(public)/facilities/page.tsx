import { getPageSEO, getPublicFacilities } from '@/app/actions/public';
import FacilitiesPageClient from './FacilitiesPageClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('/facilities');
  return {
    title: seo?.meta_title || 'Fasilitas & Layanan Unggulan — RS Bhayangkara Nganjuk',
    description: seo?.meta_description || 'Daftar fasilitas medis dan layanan kesehatan unggulan di RS Bhayangkara Nganjuk.',
    keywords: seo?.meta_keywords || ['fasilitas rumah sakit', 'layanan kesehatan', 'nganjuk'],
    openGraph: {
      title: seo?.meta_title || 'Fasilitas & Layanan Unggulan — RS Bhayangkara Nganjuk',
      description: seo?.meta_description || 'Daftar fasilitas medis dan layanan kesehatan unggulan di RS Bhayangkara Nganjuk.',
      images: seo?.og_image ? [{ url: seo.og_image }] : [],
    },
  };
}

export default async function FacilitiesPage() {
  const facilities = await getPublicFacilities();

  return <FacilitiesPageClient facilities={facilities} />;
}
