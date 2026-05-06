import { api } from '@/lib/api';
import { notFound } from 'next/navigation';
import FAQForm from '../../FAQForm';

export const metadata = {
  title: 'Edit FAQ — Admin RS Bhayangkara',
};

export default async function EditFAQPage({ params }) {
  const { id } = await params;
  
  const [faqRes, allFaqsRes] = await Promise.all([
    api.get(`/faqs/${id}`),
    api.get('/faqs')
  ]);

  const faq = faqRes.success ? (faqRes.data.data || faqRes.data) : null;
  const allFaqs = allFaqsRes.success ? (allFaqsRes.data.data || allFaqsRes.data) : [];
  
  const categories = [...new Set(allFaqs.map((f) => f.category).filter(Boolean))];

  if (!faq) notFound();

  return (
    <FAQForm
      mode="edit"
      faq={faq}
      existingCategories={categories}
    />
  );
}
