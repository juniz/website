import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Badge from '@/components/ui/Badge';
import { getInitials } from '@/lib/data/shared';
import { UserPlus, MoreVertical, Trash2, Edit } from 'lucide-react';
import Button from '@/components/ui/Button';

export default async function AdminDoctorsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: doctors } = await supabase
    .from('doctors')
    .select('*')
    .order('name', { ascending: true });

  const docs = doctors || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Dokter</h1>
          <p className="text-sm text-gray-500">Daftar dokter spesialis dan status ketersediaan.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <UserPlus size={18} />
          Tambah Dokter
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Profil Dokter</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Spesialisasi</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {docs.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  Belum ada data dokter.
                </td>
              </tr>
            ) : (
              docs.map((doc) => {
                const initials = getInitials(doc.name);
                return (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">ID: {doc.id.split('-')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {doc.specialization}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={doc.is_available ? 'success' : 'danger'} dot>
                        {doc.is_available ? 'Aktif' : 'Non-aktif'}
                      </Badge>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
