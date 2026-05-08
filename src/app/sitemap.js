export default function sitemap() {
  const baseUrl = 'https://rsbhayangkaranganjuk.com';

  // Halaman-halaman statis utama
  const routes = [
    '',
    '/about',
    '/doctors',
    '/news',
    '/faq',
    '/contact',
    '/schedule',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
