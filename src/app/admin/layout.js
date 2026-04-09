import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Bell, Search, Settings } from 'lucide-react';
import './admin-theme.css';

export const metadata = {
  title: 'Admin Panel | RS Bhayangkara',
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-white grid grid-cols-[var(--sidebar-width)_1fr] admin-layout-root">
      {/* Sidebar - Desktop */}
      <AdminSidebar userEmail={user.email} />

      {/* Main Content Area */}
      <div className="flex flex-col min-w-0 overflow-hidden relative border-l border-gray-100">
        {/* Sticky Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[13px] font-medium text-gray-900">
              <span className="text-gray-400">RS Bhayangkara</span>
              <span className="text-gray-300">/</span>
              <span className="font-bold">Dashboard</span>
            </div>
          </div>
          
          {/* Centered Search Bar */}
          <div className="flex-1 max-w-md px-8">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-azure-primary transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Cari..." 
                className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-azure-primary/20 focus:border-azure-primary transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 admin-scrollable">
          <div className="max-w-7xl mx-auto space-y-10 stagger-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
