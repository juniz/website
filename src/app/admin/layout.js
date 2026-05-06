import '@/components/admin/admin.css';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth-utils';
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
  const token = await getAuthToken();

  if (!token) {
    redirect('/login');
  }

  // Fetch user profile from NestJS
  const result = await api.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!result.success) {
    // If token is invalid or expired, clear it and redirect to login
    const cookieStore = await cookies();
    cookieStore.delete('token');
    redirect('/login');
  }

  // Karena backend ada TransformInterceptor, data asli ada di dalam property 'data'
  const user = result.data.data || result.data;

  return (
    <div className="admin-shell">
      <AdminSidebar user={user} />
      <div className="admin-main">
        <AdminTopbar user={user} />
        <main id="admin-content" className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
