const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const handleUpdateBanners = (banners: any[]) => updateDataAndSync({ ...data, bannerImages: banners });',
  'const handleUpdateBanners = (banners: any[]) => updateDataAndSync({ ...data, bannerImages: banners });\n  const handleUpdateBannerInterval = (interval: number) => updateDataAndSync({ ...data, bannerInterval: interval });'
);

code = code.replace(
  '        onUpdateBanners={handleUpdateBanners}\n        onUpdateProfile={handleUpdateProfile}',
  '        onUpdateBanners={handleUpdateBanners}\n        onUpdateProfile={handleUpdateProfile}\n        bannerInterval={data.bannerInterval}\n        onUpdateBannerInterval={handleUpdateBannerInterval}'
);

fs.writeFileSync('src/App.tsx', code);
