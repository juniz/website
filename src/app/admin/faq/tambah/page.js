import { api } from '@/lib/api';
import FAQForm from '../FAQForm';

export const metadata = {
  title: 'Tambah FAQ — Admin RS Bhayangkara',
};

async function getExistingCategories() {
  const res = await api.get('/faqs');
  if (!res.success) return [];
  
  const items = res.data.data || res.data || [];
  return [...new Set(items.map((d) => d.category).filter(Boolean))];
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
