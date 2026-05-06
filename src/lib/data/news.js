import { api } from '@/lib/api';
import { formatDateId } from './shared';

export { formatDateId };

export async function getNews() {
  const result = await api.get('/news');
  
  // Karena backend ada TransformInterceptor, data asli ada di dalam property 'data'
  const items = result.success ? (result.data.data || result.data) : [];
  
  return items.map(n => ({
    ...n,
    categoryBg: n.category === 'Pengumuman' ? 'var(--color-warning-100)' : 'var(--color-primary-100)',
    categoryColor: n.category === 'Pengumuman' ? 'var(--color-warning-800)' : 'var(--color-primary-800)',
    coverBg: n.category === 'Pengumuman' ? 'var(--color-warning-200)' : 'var(--color-primary-200)',
  }));
}

export async function getNewsBySlug(slug) {
  const result = await api.get(`/news/slug/${slug}`);
  return result.success ? (result.data.data || result.data) : null;
}
