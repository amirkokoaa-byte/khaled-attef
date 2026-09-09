const fs = require('fs');
let code = fs.readFileSync('src/components/AdminAuth.tsx', 'utf8');

const cropperElement = `
      {showBannerCropper && (
        <ImageCropper 
          imageSrc={cropBannerImage}
          onCropDone={handleBannerCropDone}
          onCancel={() => { setShowBannerCropper(false); setOriginalBannerFile(null); }}
          aspectRatio={21 / 9}
        />
      )}
`;

code = code.replace(
  '{showCropper && (',
  `${cropperElement}\n      {showCropper && (`
);

fs.writeFileSync('src/components/AdminAuth.tsx', code);
