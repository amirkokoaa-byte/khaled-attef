const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  'interface HeaderProps {\n  bannerImages: (string | BannerImage)[];',
  'interface HeaderProps {\n  bannerImages: (string | BannerImage)[];\n  bannerInterval?: number;'
);

code = code.replace(
  'export function Header({ bannerImages, profileImage, profileImageFull, isAdmin, onUpdateBanners, onUpdateProfile }: HeaderProps) {',
  'export function Header({ bannerImages, bannerInterval = 5000, profileImage, profileImageFull, isAdmin, onUpdateBanners, onUpdateProfile, onUpdateBannerInterval }: HeaderProps & { onUpdateBannerInterval: (interval: number) => void }) {'
);

code = code.replace(
  '    const interval = setInterval(() => {\n      setCurrentIndex((prev) => (prev + 1) % normalizedBanners.length);\n    }, 5000);',
  '    const interval = setInterval(() => {\n      setCurrentIndex((prev) => (prev + 1) % normalizedBanners.length);\n    }, bannerInterval);\n'
);

code = code.replace(
  '  }, [normalizedBanners.length]);',
  '  }, [normalizedBanners.length, bannerInterval]);'
);

code = code.replace(
  '<ManageBannersModal \n        isOpen={isManageModalOpen}',
  '<ManageBannersModal \n        isOpen={isManageModalOpen}\n        bannerInterval={bannerInterval}'
);

code = code.replace(
  '        onSave={(banners) => {\n          onUpdateBanners(banners);',
  '        onSave={(banners, interval) => {\n          onUpdateBanners(banners);\n          onUpdateBannerInterval(interval);'
);

fs.writeFileSync('src/components/Header.tsx', code);
