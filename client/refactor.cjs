const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;
  
  // Tailwind Arbitrary values
  content = content.replace(/\[#005a8d\]/g, 'primary');
  content = content.replace(/\[#004a75\]/g, 'primary-hover');
  content = content.replace(/\[#0ea5e9\]/g, 'primary-light');
  
  // Literal JS Strings for Recharts
  content = content.replace(/'#005a8d'/g, "'var(--primary)'");
  content = content.replace(/'#004a75'/g, "'var(--primary-hover)'");
  content = content.replace(/'#0ea5e9'/g, "'var(--primary-light)'");

  if (orig !== content) {
    fs.writeFileSync(file, content);
    changedCount++;
  }
});
console.log('Replaced colors in ' + changedCount + ' files.');
