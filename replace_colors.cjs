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

  // 1. Replace bg-[#F7F9FC] with bg-white
  newContent = newContent.replace(/bg-\[#F7F9FC\]/g, 'bg-white');

  // 2. Replace brand-red with brand-primary
  newContent = newContent.replace(/brand-red/g, 'brand-primary');

  // 3. ProfileSettings role colors
  if (file.includes('ProfileSettings.tsx')) {
    // Replace focus:ring-[#FF5E00]/20 with focus:ring-brand-primary/20
    newContent = newContent.replace(/\[#FF5E00\]/g, 'brand-primary');
    // Replace teal-600 with brand-primary
    newContent = newContent.replace(/teal-600/g, 'brand-primary');
  }

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log('Updated', file);
  }
});

console.log(`Successfully updated ${changedFiles} files.`);
