const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Header/Footer/Login/Register HTML spans
  newContent = newContent.replace(/<span className="text-brand-primary">s<\/span>Bloom Studio/g, '<span className="text-brand-primary">s</span>BLOOM');
  newContent = newContent.replace(/<span>s<\/span>Bloom Studio/g, '<span>s</span>BLOOM');

  // Text occurrences
  newContent = newContent.replace(/sBloom Studio/g, 'sBLOOM');
  newContent = newContent.replace(/sBloom/g, 'sBLOOM');

  // Sidebar specifics
  if (file.includes('DashboardSidebar.tsx')) {
    newContent = newContent.replace(/Studio\n          <\/div>/g, 'BLOOM\n          </div>');
  }

  if (file.includes('EditorDashboardLayout.tsx')) {
    newContent = newContent.replace(/Editor Studio/g, 'Editor Panel');
  }

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log('Updated', file);
  }
});

console.log(`Successfully updated ${changedFiles} files to sBLOOM.`);
