import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Badge from '@/components/ui/Badge';
import { Clock, Calendar, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default async function AdminSchedulesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: schedules } = await supabase
    .from('schedules')
    .select('*, doctor:doctors(name, specialization)')
    .order('date', { ascending: true });

  const items = schedules || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Praktik</h1>
          <p className="text-sm text-gray-500">Kelola jam operasional dan kuota harian dokter.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus size={18} />
          Atur Jadwal Baru
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Dokter & Poli</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Waktu & Tanggal</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Kuota (Terisi/Total)</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  Belum ada jadwal yang diatur.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const doc = item.doctor;
                const dateStr = new Date(item.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short'
                });
                const percentage = (item.filled_quota / item.total_quota) * 100;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{doc?.name || 'Dokter tidak ditemukan'}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase">{doc?.specialization}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {dateStr}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <Clock size={12} />
                        {item.time} WIB
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 min-w-[120px]">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className={percentage >= 100 ? 'text-red-600' : 'text-primary-600'}>
                            {item.filled_quota} / {item.total_quota} Terisi
                          </span>
                          <span className="text-gray-400">{Math.round(percentage)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${percentage >= 100 ? 'bg-red-500' : 'bg-primary-500'}`} 
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
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
