import { Inter, Figtree } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://rsbhayangkaranganjuk.com'),
  title: {
    default: 'RS Bhayangkara Nganjuk — Layanan Kesehatan Terpercaya',
    template: '%s — RS Bhayangkara Nganjuk',
  },
  description:
    'Rumah sakit terakreditasi dengan 32+ dokter spesialis di Nganjuk. ' +
    'Daftar online, cek jadwal dokter, dan layanan IGD 24 jam.',
  keywords: [
    'rumah sakit Nganjuk',
    'RS Bhayangkara Nganjuk',
    'dokter spesialis Nganjuk',
    'IGD 24 jam Nganjuk',
    'jadwal dokter Nganjuk',
    'daftar online rumah sakit',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'RS Bhayangkara Nganjuk',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${figtree.variable}`}
      data-scroll-behavior="smooth"
    >
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        {children}
        <Toaster position="top-center" richColors />
      {/* impeccable-live-start */}
<script src="http://localhost:8401/live.js?token=9b0faddb-2574-4f17-ab0b-a2cedece0d80"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
