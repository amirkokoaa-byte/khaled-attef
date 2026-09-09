const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

code = code.replace(
  'profileImage: string;',
  'profileImage: string;\n  profileImageFull?: string;'
);

code = code.replace(
  'export function Header({ bannerImages, profileImage, isAdmin, onUpdateBanners, onUpdateProfile }: HeaderProps) {',
  'export function Header({ bannerImages, profileImage, profileImageFull, isAdmin, onUpdateBanners, onUpdateProfile }: HeaderProps) {'
);

code = code.replace(
  'onClick={() => setViewerImage({ src: profileImage, alt: "Profile" })}',
  'onClick={() => setViewerImage({ src: profileImageFull || profileImage, alt: "Profile" })}'
);

// We need to keep the local handleCropDone working. When a user updates from the header, it only updates the cropped one.
// We don't have to change the Header's upload logic because the user asked to ADD it in the settings. But maybe we can just make both work?
// Let's also make sure we pass the fullUrl from the header if possible.
// In Header.tsx:
// const file = e.target.files?.[0]; 
// Then we have handleCropDone, which we can change to upload BOTH if it's the header button too. 
// But let's stick to the prompt.
fs.writeFileSync('src/components/Header.tsx', code);
