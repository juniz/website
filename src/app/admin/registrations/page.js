import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import StatusBadge from '@/components/admin/StatusBadge';
import PageHeader from '@/components/admin/PageHeader';
import { Filter, Search, Phone, MoreHorizontal, FileDown } from 'lucide-react';

export default async function AdminRegistrationsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      *,
      schedule:schedules (
        time,
        date,
        doctor:doctors (name, specialization)
      )
    `)
    .order('created_at', { ascending: false });

  const regs = registrations || [];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Antrean Pasien"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' }, 
          { label: 'Registrasi', href: '/admin/registrations' }
        ]}
        action={
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all active:scale-95">
              <FileDown size={14} />
              Export CSV
            </button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari pasien atau BPJS..." 
            className="pl-10 pr-4 py-2.5 bg-gray-50 border-gray-200 focus:bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-azure-primary/20 focus:border-azure-primary w-full transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-azure-primary/20">
            <option>Semua Status</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Done</option>
            <option>Cancelled</option>
          </select>
          <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-azure-primary hover:border-azure-primary transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identitas Pasien</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dokter & Jadwal</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metode</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {regs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm italic">
                    Belum ada pendaftaran masuk.
                  </td>
                </tr>
              ) : (
                regs.map((reg) => {
                  const sched = reg.schedule;
                  const doc = sched?.doctor;
                  
                  return (
                    <tr key={reg.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 text-sm">{reg.patient_name}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1 font-mono">
                          <Phone size={10} />
                          {reg.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {doc ? (
                          <>
                            <p className="text-gray-800 font-semibold text-xs">{doc.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{sched.date} · {sched.time}</p>
                          </>
                        ) : (
                          <span className="text-gray-300 italic text-xs">Jadwal dihapus</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${reg.insurance === 'BPJS' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                          {reg.insurance}
                        </div>
                        {reg.bpjs_number && (
                          <p className="text-[9px] text-gray-400 font-mono mt-1">{reg.bpjs_number}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={reg.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-azure-primary hover:bg-azure-surface rounded-lg transition-all">
                          <MoreHorizontal size={18} />
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
    </div>
  );
}
