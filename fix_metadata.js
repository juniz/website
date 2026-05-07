const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'src', 'app', '(public)');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Match the generateMetadata function
  const metadataRegex = /export async function generateMetadata\(\) \{\s*const seo = await getPageSEO\(['"]([^'"]+)['"]\);\s*return \{([\s\S]*?)\};\s*\}/;
  
  const match = content.match(metadataRegex);
  if (match) {
    const route = match[1];
    
    // Check if getImageUrl is imported, if not add it
    if (!content.includes('getImageUrl')) {
      const lastImportIndex = content.lastIndexOf('import ');
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport) + "\nimport { getImageUrl } from '@/lib/utils';" + content.slice(endOfLastImport);
    }

    // Extract default values from the original return block
    const defaultTitleMatch = match[2].match(/title:\s*seo\?\.meta_title\s*\|\|\s*['"]([^'"]+)['"]/);
    const defaultDescMatch = match[2].match(/description:\s*seo\?\.meta_description\s*\|\|\s*['"]([^'"]+)['"]/);
    const defaultOgMatch = match[2].match(/images:\s*\[\{\s*url:\s*seo\?\.og_image\s*\|\|\s*['"]([^'"]+)['"]/);
    
    const defaultTitle = defaultTitleMatch ? defaultTitleMatch[1] : '';
    const defaultDesc = defaultDescMatch ? defaultDescMatch[1] : '';
    const defaultOg = defaultOgMatch ? defaultOgMatch[1] : '';

    const newMetadata = `export async function generateMetadata() {
  const seo = await getPageSEO('${route}');
  const title = seo?.meta_title || '${defaultTitle}';
  const description = seo?.meta_description || '${defaultDesc}';
  const ogImageUrl = seo?.og_image ? getImageUrl(seo.og_image) : 'https://rsbhayangkara-nganjuk.id${defaultOg}';

  return {
    title: { absolute: title },
    description,
    keywords: seo?.meta_keywords || [],
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
  };
}`;
    
    content = content.replace(metadataRegex, newMetadata);
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
  }
}

// Manually specify files to avoid messing up things that require params like [id]/page.js
const filesToFix = [
  'about/page.js',
  'doctors/page.js',
  'faq/page.js',
  'news/page.js',
  'register/page.js',
  'schedule/page.js'
];

filesToFix.forEach(f => {
  const p = path.join(publicDir, f);
  if (fs.existsSync(p)) {
    processFile(p);
  }
});
