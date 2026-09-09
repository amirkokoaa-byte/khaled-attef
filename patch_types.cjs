const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('profileImageFull')) {
  code = code.replace(
    'profileImage: string;',
    'profileImage: string;\n  profileImageFull?: string;'
  );
  fs.writeFileSync('src/types.ts', code);
}
