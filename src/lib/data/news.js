import { createClient } from '@/utils/supabase/static';
import { formatDateId } from './shared';

export { formatDateId };

export async function getNews() {
  const supabase = createClient();
  const { data: news } = await supabase.from('news').select('*').order('date', { ascending: false });
  const items = news || [];
  
  return items.map(n => ({
    ...n,
    categoryBg: n.category === 'Pengumuman' ? 'var(--color-warning-100)' : 'var(--color-primary-100)',
    categoryColor: n.category === 'Pengumuman' ? 'var(--color-warning-800)' : 'var(--color-primary-800)',
    coverBg: n.category === 'Pengumuman' ? 'var(--color-warning-200)' : 'var(--color-primary-200)',
  }));
}

export async function getNewsBySlug(slug) {
  const supabase = createClient();
  const { data } = await supabase.from('news').select('*').eq('slug', slug).single();
  return data;
}
