const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'src', 'app', '(public)');

const filesToFix = [
  'about/page.js',
  'doctors/page.js',
  'faq/page.js',
  'news/page.js',
  'register/page.js',
  'schedule/page.js'
];

filesToFix.forEach(f => {
  const filePath = path.join(publicDir, f);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('seo.isActive === false')) {
      content = content.replace(/seo\.isActive === false/g, 'seo.is_active === false');
      fs.writeFileSync(filePath, content);
      console.log('Fixed', filePath);
    }
  }
});
