'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  ShieldCheck, 
  Image as ImageIcon,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function AddDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tambah Tenaga Medis</h1>
            <p className="text-sm text-slate-500 mt-1">Daftarkan dokter baru ke dalam direktori rumah sakit.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => router.back()}>Batalkan</Button>
          <Button variant="primary" className="shadow-lg shadow-primary-500/20 px-8">Simpan Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Section 1: Identitas Dasar */}
        <div className="admin-card overflow-hidden">
          <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-50 flex items-center gap-3">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <ShieldCheck size={16} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Identitas & Sertifikasi</h3>
          </div>
          
          <div className="p-8">
            {/* Symmetric Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
               <Input 
                 label="Nama Lengkap" 
                 placeholder="dr. Contoh Nama, Sp.A" 
                 icon={Users}
                 helperText="Gunakan gelar lengkap sesuai STR."
               />
               <Input 
                 label="Spesialisasi" 
                 placeholder="Anak / Penyakit Dalam / Bedah" 
                 icon={Stethoscope}
                 helperText="Pilih poli yang sesuai."
               />
               <Input 
                 label="Nomor STR" 
                 placeholder="1234567890" 
                 icon={ShieldCheck}
               />
               <Input 
                 label="Lokasi Praktik" 
                 placeholder="Gedung A, Lt. 2, Ruang 204" 
                 icon={MapPin}
               />
            </div>
          </div>
        </div>

        {/* Section 2: Ketersediaan & Media */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-2 admin-card p-8 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-1.5 bg-teal-100 text-teal-600 rounded-lg">
                  <Clock size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Status & Operasional</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Status Keaktifan</p>
                  <label className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/30 cursor-pointer hover:bg-slate-50 transition-colors group">
                     <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center p-1 group-hover:border-primary-400 transition-colors">
                        <div className="w-full h-full rounded-full bg-primary-500 scale-100" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">Dokter Aktif</p>
                        <p className="text-[10px] text-slate-400 mt-1">Tersedia untuk pendaftaran online.</p>
                     </div>
                  </label>
                </div>

                <div className="space-y-4 pt-6 md:pt-0">
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                    <CheckCircle2 size={16} />
                    Verifikasi Semua Input
                  </button>
                  <p className="text-[10px] text-slate-400 text-center italic leading-relaxed">
                    Data akan diperiksa oleh sistem sebelum diunggah ke database publik.
                  </p>
                </div>
              </div>
           </div>

           <div className="admin-card p-8 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/20 border-dashed border-2 border-slate-200">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300">
                <ImageIcon size={32} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Foto Profil</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed px-4">Unggah foto format JPG/PNG, maksimal 2MB.</p>
              </div>
              <Button variant="ghost" size="sm" className="bg-white border-slate-200">Pilih Berkas</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
