import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import FasilitasForm from '../../FasilitasForm';

export const metadata = {
  title: 'Edit Fasilitas — Admin RS Bhayangkara',
};

async function getFacility(id) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from('facilities').select('*').eq('id', id).single();
  return data;
}

export default async function EditFasilitasPage({ params }) {
  const { id } = await params;
  const facility = await getFacility(id);
  if (!facility) notFound();

  return <FasilitasForm mode="edit" facility={facility} />;
}
