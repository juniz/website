'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Newspaper, 
  Users, 
  Calendar, 
  ClipboardList, 
  LogOut,
  Activity
} from 'lucide-react';
import { doLogout } from '@/app/actions/auth';

const menuGroups = [
  {
    title: 'Platform',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Inventory', href: '/admin/doctors', icon: Users },
      { name: 'Schedule', href: '/admin/schedules', icon: Calendar, hasDot: true },
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Registrations', href: '/admin/registrations', icon: ClipboardList, hasDot: true },
      { name: 'News Feed', href: '/admin/news', icon: Newspaper },
    ]
  }
];

export default function AdminSidebar({ userEmail }) {
  const pathname = usePathname();

  return (
    <aside className="w-(--sidebar-width) bg-[#FDFDFF] flex flex-col h-screen sticky top-0 border-r border-[#F1F3F7] z-50 overflow-hidden">
      {/* Brand Header — Minimalist Luxury Context */}
      <div className="pt-10 pb-8 pl-10 pr-6 mb-4">
        <div className="flex items-center gap-3.5 group cursor-default">
          <div className="w-9 h-9 shrink-0 rounded-[12px] bg-[#2D5BFF] flex items-center justify-center text-white shadow-[0_8px_16px_rgba(45,91,255,0.15)] ring-1 ring-white/20 transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-105">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 transition-all duration-300">
            <h1 className="font-['Outfit',_sans-serif] font-extrabold text-[#091E42] text-[15px] tracking-[-0.02em] leading-none mb-1.5 flex items-center gap-1.5">
              Panel
              <span className="w-1 h-1 rounded-full bg-[#2D5BFF] animate-pulse" />
            </h1>
            <p className="text-[10px] text-[#8692A6] font-bold uppercase tracking-[0.1em] opacity-80 font-['Plus_Jakarta_Sans',sans-serif]">Institutional OS</p>
          </div>
        </div>
      </div>

      {/* Navigation Space */}
      <nav className="flex-1 pl-9 pr-4 space-y-12 overflow-y-auto pt-2 admin-scrollable font-['Plus_Jakarta_Sans',sans-serif]">
        {menuGroups.map((group, gIdx) => (
          <div key={group.title} className="space-y-2">
            <p className="text-[10px] font-extrabold text-[#B0B7C3] uppercase tracking-[0.15em] px-3 mb-4 select-none">
              {group.title}
            </p>
            <div className="space-y-2.5">
              {group.items.map((item, iIdx) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{ transitionDelay: `${(gIdx * 3 + iIdx) * 50}ms` }}
                    className={`
                      group relative flex items-center gap-3.5 px-3 py-3 rounded-[12px] group/item transition-all duration-300
                      ${isActive 
                        ? 'bg-[#F0F4FF] text-[#2D5BFF] shadow-[0_4px_12px_rgba(45,91,255,0.06)]' 
                        : 'text-[#6B778C] hover:bg-[#F4F5F7] hover:text-[#091E42]'}
                    `}
                  >
                    <div className={`p-1.5 rounded-[10px] transition-all duration-300 ${isActive ? 'bg-white shadow-sm' : 'group-hover/item:bg-white group-hover/item:shadow-sm'}`}>
                       <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className="group-hover/item:scale-110 transition-transform" />
                    </div>
                    <span className={`text-[13px] font-bold tracking-[-0.01em] ${isActive ? 'translate-x-0.5' : 'group-hover/item:translate-x-0.5'} transition-transform`}>
                      {item.name}
                    </span>
                    
                    {item.hasDot && (
                      <span className={`absolute right-3.5 w-[5px] h-[5px] rounded-full ${isActive ? 'bg-[#2D5BFF]' : 'bg-[#D0D5DD]'} shadow-sm`} />
                    )}
                    
                    {isActive && (
                      <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#2D5BFF] rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Identity Sphere */}
      <div className="ml-9 mr-4 mb-8 p-1.5 bg-[#F8F9FB] rounded-[20px] border border-[#F1F3F7] font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex items-center gap-3 p-3 bg-white rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-white">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-[14px] bg-linear-to-br from-[#2D5BFF] to-[#1E40AF] flex items-center justify-center text-[13px] font-black text-white shadow-lg overflow-hidden transition-transform duration-500 group-hover:rotate-12">
              {userEmail ? (userEmail[0] + userEmail[1]).toUpperCase() : 'AD'}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#4FA96E] border-[2.5px] border-white rounded-full shadow-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-black text-[#091E42] truncate tracking-tight">{userEmail?.split('@')[0] || 'Administrator'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="px-1 py-0.5 bg-[#E6F1FB] text-[#2D5BFF] text-[8px] font-black uppercase tracking-wider rounded-md border border-[#D0E4F7]">System Root</span>
            </div>
          </div>
        </div>
        
        <form action={doLogout} className="mt-1.5 px-1.5 pb-1">
          <button
            type="submit"
            className="flex items-center justify-center gap-2.5 w-full py-3 text-[10px] font-extrabold text-[#8692A6] hover:text-[#EF4444] hover:bg-[#FFF1F2] rounded-xl transition-all border border-transparent hover:border-[#FEE2E2] group"
          >
            <LogOut size={13} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
            TERMINATE SESSION
          </button>
        </form>
      </div>
    </aside>
  );
}
