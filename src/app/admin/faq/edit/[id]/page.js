import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import FAQForm from '../../FAQForm';

export const metadata = {
  title: 'Edit FAQ — Admin RS Bhayangkara',
};

async function getFAQData(id) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: faq }, { data: categoryRows }] = await Promise.all([
    supabase.from('faqs').select('*').eq('id', id).single(),
    supabase.from('faqs').select('category').order('category', { ascending: true }),
  ]);

  return {
    faq,
    categories: [...new Set((categoryRows || []).map((d) => d.category).filter(Boolean))],
  };
}

export default async function EditFAQPage({ params }) {
  const { id } = await params;
  const { faq, categories } = await getFAQData(id);

  if (!faq) notFound();

  return (
    <FAQForm
      mode="edit"
      faq={faq}
      existingCategories={categories}
    />
  );
}
