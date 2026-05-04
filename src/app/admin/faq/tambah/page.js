import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import FAQForm from '../FAQForm';

export const metadata = {
  title: 'Tambah FAQ — Admin RS Bhayangkara',
};

async function getExistingCategories() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from('faqs')
    .select('category')
    .order('category', { ascending: true });

  if (!data) return [];
  return [...new Set(data.map((d) => d.category).filter(Boolean))];
}

export default async function TambahFAQPage({ searchParams }) {
  const categories = await getExistingCategories();
  const params = await searchParams;
  const defaultCategory = params?.category || '';

  return (
    <FAQForm
      mode="create"
      existingCategories={categories}
      defaultCategory={defaultCategory}
    />
  );
}
