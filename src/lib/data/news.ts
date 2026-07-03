import { api } from '@/lib/api';
import { formatDateId } from './shared';
import { NewsArticle } from '@/types/api';

export { formatDateId };

export async function getNews(): Promise<NewsArticle[]> {
  const result = await api.get<any>('/news');
  
  // Karena backend ada TransformInterceptor, data asli ada di dalam property 'data'
  const rawData: any = result.success ? (result.data as any)?.data || result.data : [];
  const items: any[] = Array.isArray(rawData) ? rawData : (rawData?.data || []);
  
  return items.map((n: any): NewsArticle => ({
    ...n,
    categoryBg: n.category === 'Pengumuman' ? 'var(--color-warning-100)' : 'var(--color-primary-100)',
    categoryColor: n.category === 'Pengumuman' ? 'var(--color-warning-800)' : 'var(--color-primary-800)',
    coverBg: n.category === 'Pengumuman' ? 'var(--color-warning-200)' : 'var(--color-primary-200)',
  }));
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  const result = await api.get<any>(`/news/slug/${slug}`);
  return result.success ? ((result.data as any)?.data || result.data) : null;
}
