// build-structure.js
// Node.js script: builds all folders/files from header.html, using index.html as template

const fs = require('fs');
const path = require('path');

const HEADER_FILE = 'header.html';
const TEMPLATE_FILE = 'index.html';

if (!fs.existsSync(HEADER_FILE)) {
  console.error('header.html not found!');
  process.exit(1);
}
if (!fs.existsSync(TEMPLATE_FILE)) {
  console.error('index.html not found!');
  process.exit(1);
}

const headerHtml = fs.readFileSync(HEADER_FILE, 'utf8');

// Find all href="http://127.0.0.1:5500/....html"
const hrefRegex = /href="http:\/\/127\.0\.0\.1:5500\/([^"]+\.html)"/g;

const allPaths = new Set();
let match;
while ((match = hrefRegex.exec(headerHtml)) !== null) {
  allPaths.add(match[1]);
}

// Create folders and files
for (const relPath of allPaths) {
  const fullPath = path.join('.', relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created folder:', dir);
  }
  if (!fs.existsSync(fullPath)) {
    fs.copyFileSync(TEMPLATE_FILE, fullPath);
    console.log('Created file:', fullPath);
  }
}

console.log('All folders and files created!');