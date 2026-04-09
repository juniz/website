import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Badge from '@/components/ui/Badge';
import { formatDateId } from '@/lib/data/shared';
import { Trash2, Edit, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

export default async function AdminNewsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false });

  const articles = news || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Berita</h1>
          <p className="text-sm text-gray-500">Kelola artikel, pengumuman, dan tips kesehatan.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus size={18} />
          Tambah Berita
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Judul Artikel</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  Belum ada berita yang diterbitkan.
                </td>
              </tr>
            ) : (
              articles.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1">Oleh: {item.author}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{item.category}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDateId(item.date)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
