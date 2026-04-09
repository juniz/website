import NewsPageClient from './NewsPageClient';

export const metadata = {
  title: 'Berita & Informasi Kesehatan',
  description:
    'Artikel terbaru seputar kesehatan, pengumuman layanan, dan program RS Bhayangkara Nganjuk.',
  keywords: ['berita rs bhayangkara nganjuk', 'informasi kesehatan nganjuk', 'artikel kesehatan'],
};

import { getNews } from '@/lib/data/news';

export default async function NewsPage() {
  const news = await getNews();
  return <NewsPageClient initialNews={news} />;
}
