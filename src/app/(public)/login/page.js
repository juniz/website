import LoginPageClient from './LoginPageClient';

export const metadata = {
  title: 'Admin Login | RS Bhayangkara',
  description: 'Login ke panel administrasi RS Bhayangkara Nganjuk.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <>
      <style>{`
        header[role="banner"], 
        footer { 
          display: none !important; 
        }
        #main-content {
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
      <LoginPageClient />
    </>
  );
}
