import NewsPageClient from './NewsPageClient';
import { getNews } from '@/lib/data/news';
import { getPageSEO } from '@/app/actions/public';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const seo = await getPageSEO('/news');
  
  return {
    title: seo?.meta_title || 'Berita & Informasi — RS Bhayangkara Nganjuk',
    description: seo?.meta_description || 'Artikel terbaru seputar kesehatan, pengumuman layanan, dan program RS Bhayangkara Nganjuk.',
    keywords: seo?.meta_keywords || ['berita rs bhayangkara nganjuk', 'info kesehatan'],
    openGraph: {
      title: seo?.meta_title,
      description: seo?.meta_description,
      images: [{ url: seo?.og_image || '/og-news.jpg' }],
    },
  };
}

export default async function NewsPage() {
  const [news, seo] = await Promise.all([
    getNews(),
    getPageSEO('/news')
  ]);

  if (seo && seo.isActive === false) {
    notFound();
  }

  return <NewsPageClient initialNews={news} />;
}
