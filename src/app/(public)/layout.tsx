import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MaintenancePage from '@/components/MaintenancePage';
import { getHeaderSettings, getMaintenanceSettings, getAllPageStatus } from '@/app/actions/public';

interface PublicLayoutProps {
  children: ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const [headerSettings, maintenance, pageStatuses] = await Promise.all([
    getHeaderSettings(),
    getMaintenanceSettings(),
    getAllPageStatus()
  ]);

  if (maintenance?.isMaintenance) {
    return <MaintenancePage data={maintenance} contact={headerSettings} />;
  }

  return (
    <>
      <Navbar data={headerSettings} pageStatuses={pageStatuses as any} />
      <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
        {children}
      </main>
      <Footer data={headerSettings} pageStatuses={pageStatuses as any} />
    </>
  );
}
