const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = '.'; // Change if needed
const BASE_URL = 'http://127.0.0.1:5500/';

// Map for pretty names in breadcrumb
const prettyNames = {
  'home.html': 'Home',
  'tooloverzicht.html': 'Tooloverzicht',
  'ict-internet.html': 'ICT & Internet',
  'gezondheid-welzijn.html': 'Gezondheid & Welzijn',
  'tijd-datum.html': 'Tijd & Datum',
  'techniek-energie.html': 'Techniek & Energie',
  'school-onderwijs.html': 'School & Onderwijs',
  'wiskunde-rekenen.html': 'Wiskunde & Rekenen',
  'financieel-belastingen.html': 'Financieel & Belastingen',
  'horeca.html': 'Horeca',
  'zakelijk.html': 'Zakelijk',
  'consument.html': 'Consument',
  'eenheden-omrekenen.html': 'Eenheden omrekenen',
  // Add more if needed
};

function toPretty(name) {
  return prettyNames[name] || name.replace(/-/g, ' ').replace('.html', '').replace(/\b\w/g, l => l.toUpperCase());
}

function buildBreadcrumb(filePath) {
  // Get relative path from project root
  let rel = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');
  let parts = rel.split('/');
  // Remove leading folders not in URL
  let crumbParts = [];
  let urlParts = [];
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    if (part === 'Tooloverzicht') part = 'tooloverzicht';
    urlParts.push(part);
    if (part.endsWith('.html')) {
      crumbParts.push({
        name: toPretty(part),
        url: BASE_URL + urlParts.join('/'),
        isLast: true
      });
    } else {
      crumbParts.push({
        name: toPretty(part),
        url: BASE_URL + urlParts.join('/') + '/' + part + '.html',
        isLast: false
      });
    }
  }
  // Fix for root files
  if (crumbParts.length === 1) crumbParts[0].url = BASE_URL + parts[0];

  // Build HTML
  let html = `<nav style="padding:0px" aria-label="Breadcrumb" class="breadcrumb">\n<ul>\n`;
  crumbParts.forEach((c, idx) => {
    if (idx < crumbParts.length - 1) {
      html += `<li><a href="${c.url}">${c.name} -&gt;&nbsp;</a></li>\n`;
    } else {
      html += `<li><a href="${c.url}">${c.name}</a></li>\n`;
    }
  });
  html += `</ul>\n</nav>\n`;
  return html;
}

function addBreadcrumbToFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('class="breadcrumb"')) return; // Already has breadcrumb

  const breadcrumb = buildBreadcrumb(filePath);

  // Insert after first <div class="container">
  const containerDiv = '<div class="container">';
  const idx = content.indexOf(containerDiv);
  if (idx === -1) return;

  const before = content.slice(0, idx + containerDiv.length);
  const after = content.slice(idx + containerDiv.length);

  const newContent = before + '\n' + breadcrumb + after;
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Breadcrumb added to', filePath);
}

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (f.endsWith('.html')) {
      addBreadcrumbToFile(full);
    }
  });
}

walk(PROJECT_ROOT);
console.log('Done!');