const fs = require('fs');
const path = require('path');

const directory = './mijntoolbox'; // Of waar je HTML-bestanden staan

function fixHrefInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix dubbele slashes behalve na http:
  content = content.replace(/(href="[^"]*?)([^:])\/\/+/g, '$1$2/');

  // Fix foutieve verwijzing naar tooloverzicht/tooloverzicht.html
  content = content.replace(/mijntoolbox\/tooloverzicht\/tooloverzicht\.html/g, 'mijntoolbox/tooloverzicht.html');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Aangepast: ${filePath}`);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.html')) {
      fixHrefInFile(fullPath);
    }
  });
}

walkDir(directory);
