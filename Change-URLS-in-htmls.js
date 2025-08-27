const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/http:\/\/127\.0\.0\.1:5500\/Mijntoolbox\/footer\.html/g, 'http://127.0.0.1:5500/mijntoolbox/footer.html')
    .replace(/http:\/\/127\.0\.0\.1:5500\/Mijntoolbox\/header\.html/g, 'http://127.0.0.1:5500/mijntoolbox/header.html')
    .replace(/http:\/\/127\.0\.0\.1:5500\/style.css/g, 'http://127.0.0.1:5500/mijntoolbox/style.css');
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.html')) {
      replaceInFile(fullPath);
    }
  });
}

// Start from current directory
walkDir(__dirname);