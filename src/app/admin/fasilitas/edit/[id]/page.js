import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import FasilitasForm from '../../FasilitasForm';

export const metadata = {
  title: 'Edit Fasilitas — Admin RS Bhayangkara',
};

async function getFacility(id) {
  const res = await api.get(`/facilities/${id}`);
  if (!res.success) return null;
  
  const data = res.data.data || res.data;
  
  // Map camelCase backend ke snake_case yang diharapkan FasilitasForm
  return {
    ...data,
    image_url: data.imageUrl,
    is_active: data.isActive,
    sort_order: data.sortOrder
  };
}

export default async function EditFasilitasPage({ params }) {
  const { id } = await params;
  const facility = await getFacility(id);
  if (!facility) notFound();

  return <FasilitasForm mode="edit" facility={facility} />;
}
