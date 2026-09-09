const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('bannerInterval')) {
  code = code.replace(
    'bannerImages?: (string | BannerImage)[];',
    'bannerImages?: (string | BannerImage)[];\n  bannerInterval?: number;'
  );
  fs.writeFileSync('src/types.ts', code);
}
