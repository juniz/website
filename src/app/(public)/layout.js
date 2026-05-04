import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getHeaderSettings } from '@/app/actions/public';

export default async function PublicLayout({ children }) {
  const headerSettings = await getHeaderSettings();

  return (
    <>
      <Navbar data={headerSettings} />
      <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
        {children}
      </main>
      <Footer data={headerSettings} />
    </>
  );
}

