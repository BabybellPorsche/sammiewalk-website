const fs = require('fs');
const path = require('path');

const colors = ['slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
const pattern = new RegExp(`\\\\b(bg|text|border|ring|fill|stroke)-(${colors.join('|')})-[0-9]{2,3}\\\\b`, 'g');

const results = {};

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.match(/\.(tsx|ts|jsx|js)$/)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(m => {
          results[m] = (results[m] || 0) + 1;
        });
      }
    }
  }
}

walk('./src');
console.log(JSON.stringify(results, null, 2));
