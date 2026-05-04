import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import LayananForm from '../../LayananForm';

export const metadata = {
  title: 'Edit Layanan — Admin RS Bhayangkara',
};

async function getService(id) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from('services').select('*').eq('id', id).single();
  return data;
}

export default async function EditLayananPage({ params }) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  return <LayananForm mode="edit" service={service} />;
}
