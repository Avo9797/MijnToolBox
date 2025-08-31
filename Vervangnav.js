const fs = require('fs');
const path = require('path');

// 📁 CHANGE this to your folder containing HTML files
const htmlFolder = 'C:\\Users\\rutge\\Documents\\GitHub\\MijnToolBox\\Mijntoolbox';

function replaceInNav(content) {
  return content.replace(/<nav[\s\S]*?<\/nav>/gi, navBlock => {
    return navBlock.replace(/Ict Internet/g, 'ICT & Internet')
  });
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = replaceInNav(content);

  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  }
}

function walkDirectory(dir) {
  fs.readdirSync(dir).forEach(item => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      walkDirectory(fullPath); // recursively go into subfolders
    } else if (item.endsWith('.html')) {
      processFile(fullPath);
    }
  });
}

// 🚀 Start the script
if (!fs.existsSync(htmlFolder)) {
  console.error('❌ Folder does not exist:', htmlFolder);
  process.exit(1);
}

walkDirectory(htmlFolder);
