import { api } from '@/lib/api';
import { MessageSquareQuote, Plus, Edit2, Star, User } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export const metadata = {
  title: 'Manajemen Testimoni',
};

async function getTestimonials() {
  const res = await api.get('/testimonials');
  
  if (!res.success) {
    console.error('Error fetching testimonials:', res.error);
    return [];
  }

  const items = res.data.data || res.data || [];
  
  // Map camelCase backend ke snake_case yang diharapkan UI
  return items.map(t => ({
    ...t,
    patient_name: t.name,
    patient_role: t.role,
    avatar_url: t.avatarUrl,
    is_visible: t.isActive
  }));
}

export default async function TestimonialsAdminPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Testimoni</h1>
          <p className="text-sm text-gray-500">Kelola ulasan dan pengalaman pasien.</p>
        </div>
        <Link href="/admin/testimoni/tambah" className="admin-btn admin-btn-primary" style={{ gap: '8px' }}>
          <Plus size={18} />
          Tambah Testimoni
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((testi) => (
          <div key={testi.id} className="admin-card group relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold overflow-hidden">
                  {testi.avatar_url ? (
                    <img src={getImageUrl(testi.avatar_url)} alt={testi.patient_name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{testi.patient_name}</h3>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest">{testi.patient_role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-bold">{testi.rating}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 italic line-clamp-3 mb-4">
              "{testi.content}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <Badge color={testi.is_visible ? 'success' : 'neutral'}>
                {testi.is_visible ? 'Ditampilkan' : 'Disembunyikan'}
              </Badge>
              <Link 
                href={`/admin/testimoni/edit/${testi.id}`}
                className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
              >
                <Edit2 size={16} />
              </Link>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="col-span-full py-20 admin-card flex flex-col items-center justify-center text-gray-400 gap-3">
            <MessageSquareQuote size={48} strokeWidth={1} />
            <p>Belum ada testimoni pasien.</p>
          </div>
        )}
      </div>
    </div>
  );
}
