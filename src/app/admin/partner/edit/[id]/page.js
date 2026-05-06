import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import PartnerForm from '../../PartnerForm';

export const metadata = {
  title: 'Edit Partner — Admin RS Bhayangkara',
};

async function getPartner(id) {
  const res = await api.get(`/partners/${id}`);
  if (!res.success) return null;
  
  const data = res.data.data || res.data;
  
  // Map camelCase backend ke snake_case yang diharapkan PartnerForm
  return {
    ...data,
    logo_url: data.logoUrl,
    sort_order: data.sortOrder,
    is_active: data.isActive,
    website_url: data.link
  };
}

export default async function EditPartnerPage({ params }) {
  const { id } = await params;
  const partner = await getPartner(id);
  if (!partner) notFound();

  return <PartnerForm mode="edit" partner={partner} />;
}
