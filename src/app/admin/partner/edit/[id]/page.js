import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import PartnerForm from '../../PartnerForm';

export const metadata = {
  title: 'Edit Partner — Admin RS Bhayangkara',
};

async function getPartner(id) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from('partners').select('*').eq('id', id).single();
  return data;
}

export default async function EditPartnerPage({ params }) {
  const { id } = await params;
  const partner = await getPartner(id);
  if (!partner) notFound();

  return <PartnerForm mode="edit" partner={partner} />;
}
