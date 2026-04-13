import '@/components/admin/admin.css';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

export const metadata = {
  title: {
    default: 'Admin Panel — RS Bhayangkara Nganjuk',
    template: '%s — Admin RS Bhayangkara',
  },
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Supabase stores name in user_metadata, NextAuth stored it directly in user.name.
  // We'll construct a compatible user object for the components.
  const appUser = {
    name: user.user_metadata?.name || user.email?.split('@')[0],
    email: user.email,
  };

  return (
    <div className="admin-shell">
      <AdminSidebar user={appUser} />
      <div className="admin-main">
        <AdminTopbar user={appUser} />
        <main id="admin-content" className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
