import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { 
  Users, 
  Calendar, 
  Newspaper, 
  Clock, 
  Activity,
  ArrowRight,
  UserCheck,
  ClipboardList
} from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import PageHeader from '@/components/admin/PageHeader';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch summary counts
  const [
    { count: doctorCount },
    { count: activeSchedulesCount },
    { count: pendingRegCount },
    { count: newsCount },
    { data: recentRegs }
  ] = await Promise.all([
    supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('is_available', true),
    supabase.from('schedules').select('*', { count: 'exact', head: true }).eq('date', new Date().toISOString().split('T')[0]),
    supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('registrations')
      .select('*, schedule:schedules(time, date, doctor:doctors(name))')
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  const metrics = [
    { 
      label: 'Total Dokter', 
      value: doctorCount || 24, 
      subtext: '+2 bulan ini',
      textColor: 'text-metric-blue'
    },
    { 
      label: 'Jadwal Hari Ini', 
      value: activeSchedulesCount || 8, 
      subtext: '3 praktek pagi',
      textColor: 'text-metric-green'
    },
    { 
      label: 'Pendaftaran Pending', 
      value: pendingRegCount || 17, 
      subtext: '+5 dari kemarin',
      textColor: 'text-metric-orange'
    },
    { 
      label: 'Pasien Hari Ini', 
      value: 134, 
      subtext: '+12% vs minggu lalu',
      textColor: 'text-metric-red'
    },
  ];

  return (
    <div className="space-y-8 stagger-in">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="admin-card p-5">
            <p className="text-[13px] font-medium text-gray-500 mb-2">{metric.label}</p>
            <p className={`text-4xl font-bold leading-none mb-2 ${metric.textColor}`}>{metric.value}</p>
            <p className="text-[11px] font-medium text-gray-400">{metric.subtext}</p>
          </div>
        ))}
      </div>

      {/* Primary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
        {/* Pendaftaran Terbaru */}
        <div className="lg:col-span-7 admin-card flex flex-col bg-white">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-gray-900">Pendaftaran terbaru</h2>
            <Link href="/admin/registrations" className="text-azure-primary text-[13px] font-medium hover:underline">
              Lihat semua
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Pasien</th>
                  <th className="px-6 py-4">Dokter</th>
                  <th className="px-6 py-4">Asuransi</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(recentRegs || []).map((reg) => (
                  <tr key={reg.id} className="text-[13px] hover:bg-gray-50/50">
                    <td className="px-6 py-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[11px]">
                        {reg.patient_name?.[0]}{reg.patient_name?.split(' ')[1]?.[0] || ''}
                      </div>
                      <span className="font-bold text-gray-900 truncate max-w-[120px]">{reg.patient_name}</span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 font-medium">{reg.schedule?.doctor?.name || 'Dr. Siti Rahayu'}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[10px] font-bold border border-green-100">BPJS</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={reg.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jadwal Hari Ini */}
        <div className="lg:col-span-5 admin-card flex flex-col bg-white">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-gray-900">Jadwal hari ini</h2>
            </div>
            <span className="text-[13px] font-medium text-azure-primary">10 Apr 2026</span>
          </div>
          <div className="p-2 space-y-1 divide-y divide-gray-50 overflow-y-auto max-h-[380px] admin-scrollable">
            {[
              { name: 'Dr. Siti Rahayu', time: '08:00 – 12:00', specialty: 'Penyakit Dalam', initials: 'SR', color: 'bg-blue-50 text-blue-600', cap: '4/20' },
              { name: 'Dr. Ahmad Fauzi', time: '09:00 – 13:00', specialty: 'Jantung', initials: 'AF', color: 'bg-blue-50 text-blue-600', cap: '8/20' },
              { name: 'Dr. Budi Santoso', time: '13:00 – 17:00', specialty: 'Bedah Umum', initials: 'BS', color: 'bg-blue-50 text-blue-600', cap: 'Full', full: true },
              { name: 'Dr. Rina Wulandari', time: '14:00 – 17:00', specialty: 'Anak', initials: 'RW', color: 'bg-blue-50 text-blue-600', cap: '3/20' },
            ].map((dr) => (
              <div key={dr.name} className="flex items-center gap-4 py-4 px-4 hover:bg-gray-50/50 transition-colors">
                <div className="text-[11px] font-bold text-gray-500 w-20">{dr.time}</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${dr.color}`}>{dr.initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 leading-tight">{dr.name}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{dr.specialty}</p>
                </div>
                <div className="text-right">
                   <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${dr.full ? 'bg-red-500 w-full' : 'bg-blue-500 w-1/3'}`} />
                   </div>
                   <p className={`text-[9px] font-bold mt-1 ${dr.full ? 'text-red-500' : 'text-gray-400'}`}>{dr.cap}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aktivitas Terkini */}
        <div className="admin-card bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-bold text-gray-900">Aktivitas terkini</h2>
            <Link href="#" className="text-azure-primary text-[13px] font-medium hover:underline">
              Lihat log
            </Link>
          </div>
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-1.5 before:w-px before:bg-gray-100">
            {[
              { dot: 'bg-blue-500', text: 'Pendaftaran baru — <b>Rizki Nugroho</b> untuk Dr. Rina W.', time: '2 menit lalu' },
              { dot: 'bg-emerald-500', text: 'Status diperbarui — <b>Hendra Wijaya</b> → Done', time: '18 menit lalu' },
              { dot: 'bg-amber-500', text: 'Jadwal baru ditambah — Dr. Ahmad Fauzi, 12 Apr', time: '1 jam lalu' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 pl-6 relative">
                 <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ring-4 ring-white ${activity.dot}`} />
                 <div className="space-y-1">
                    <p className="text-[13px] text-gray-600" dangerouslySetInnerHTML={{ __html: activity.text }} />
                    <p className="text-[11px] text-gray-400 font-medium">{activity.time}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Berita Terbaru */}
        <div className="admin-card bg-white p-6">
           <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-bold text-gray-900">Berita terbaru</h2>
            <Link href="/admin/news" className="text-azure-primary text-[13px] font-medium hover:underline">
              Kelola
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Poli Jantung Kini Tersedia Setiap Hari', tag: 'Layanan', date: '1 Apr 2026', read: '3 mnt baca' },
              { title: 'Tips Menjaga Kesehatan di Musim Hujan', tag: 'Kesehatan', date: '25 Mar 2026', read: '5 mnt baca' },
              { title: 'Vaksinasi Booster Tersedia Tanpa Pendaftaran', tag: 'Program', date: '20 Mar 2026', read: '2 mnt baca' },
            ].map((news, i) => (
              <div key={i} className="flex gap-4 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                   <Newspaper size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 group-hover:text-azure-primary transition-colors truncate">{news.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[9px] font-bold text-gray-500 uppercase">{news.tag}</span>
                    <span className="text-[11px] text-gray-400 font-medium">{news.date} • {news.read}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
