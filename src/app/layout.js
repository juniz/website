import { Inter, Figtree } from 'next/font/google';
import './globals.css';


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
      </body>
    </html>
  );
}
