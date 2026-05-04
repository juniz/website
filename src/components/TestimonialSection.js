import { Quote, Star } from 'lucide-react';

export default function TestimonialSection({ data = [] }) {
  if (data.length === 0) return null;

  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <div className="section-header text-center mx-auto" style={{ maxWidth: '600px', marginBottom: '3rem' }}>
          <h2 className="section-title">Apa Kata Pasien Kami?</h2>
          <p className="section-subtitle">
            Pengalaman nyata dari mereka yang telah mempercayakan kesehatannya kepada RS Bhayangkara Nganjuk.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {data.map((item) => (
            <div 
              key={item.id} 
              className="p-6 rounded-2xl border border-gray-100 bg-gray-50/30 flex flex-col gap-4 relative"
            >
              <div className="absolute top-6 right-6 text-primary-100">
                <Quote size={40} fill="currentColor" stroke="none" />
              </div>
              
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < item.rating ? "currentColor" : "none"} 
                    stroke={i < item.rating ? "none" : "currentColor"} 
                  />
                ))}
              </div>

              <p className="text-gray-600 text-sm italic leading-relaxed z-10">
                "{item.content}"
              </p>

              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600 text-sm">
                  {item.avatar_url ? (
                    <img src={item.avatar_url} alt={item.patient_name} className="w-full h-full object-cover rounded-full" />
                  ) : item.patient_name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.patient_name}</h4>
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest">{item.patient_role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
