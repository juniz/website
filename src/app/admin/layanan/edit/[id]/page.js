import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import LayananForm from '../../LayananForm';

export const metadata = {
  title: 'Edit Layanan — Admin RS Bhayangkara',
};

async function getService(id) {
  const res = await api.get(`/services/${id}`);
  if (!res.success) return null;
  
  const data = res.data.data || res.data;
  
  // Map camelCase backend ke snake_case yang diharapkan LayananForm lama
  return {
    ...data,
    icon_name: data.iconName,
    color_code: data.colorCode,
    bg_color_code: data.bgColorCode,
    count_info: data.countInfo,
    is_active: data.isActive,
    sort_order: data.sortOrder
  };
}

export default async function EditLayananPage({ params }) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  return <LayananForm mode="edit" service={service} />;
}
