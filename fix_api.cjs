const fs = require('fs');
let code = fs.readFileSync('src/lib/api.ts', 'utf8');
code = code.replace(
  'const errorMessage = errorData.details ? :  : errorData.error;',
  'const errorMessage = errorData.details ? errorData.error + \": \" + errorData.details : errorData.error;'
);
fs.writeFileSync('src/lib/api.ts', code);
