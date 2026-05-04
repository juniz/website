/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Default 1 MB — naikkan ke 11 MB agar sertifikat (maks 10 MB) bisa diupload
      bodySizeLimit: '11mb',
    },
  },

  images: {
    remotePatterns: [
      {
        // Supabase Storage — izinkan Next.js mengoptimalkan gambar dari bucket
        protocol: 'http',
        hostname: '192.168.3.210',
        port: '8001',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
