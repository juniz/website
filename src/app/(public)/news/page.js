import NewsPageClient from './NewsPageClient';
import { getNews } from '@/lib/data/news';
import { getPageSEO } from '@/app/actions/public';
import { notFound } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';

export async function generateMetadata() {
  const seo = await getPageSEO('/news');
  const title = seo?.meta_title || 'Berita & Informasi — RS Bhayangkara Nganjuk';
  const description = seo?.meta_description || 'Artikel terbaru seputar kesehatan, pengumuman layanan, dan program RS Bhayangkara Nganjuk.';
  const ogImageUrl = seo?.og_image ? getImageUrl(seo.og_image) : 'https://rsbhayangkaranganjuk.com/og-news.jpg';

  return {
    title: { absolute: title },
    description,
    keywords: seo?.meta_keywords || [],
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
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
