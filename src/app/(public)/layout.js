import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
