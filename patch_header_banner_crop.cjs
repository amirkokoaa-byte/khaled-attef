const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Add states for Banner Cropping
code = code.replace(
  'const [cropImage, setCropImage] = useState(\'\');\n  const [originalFile, setOriginalFile] = useState<File | null>(null);',
  'const [cropImage, setCropImage] = useState(\'\');\n  const [originalFile, setOriginalFile] = useState<File | null>(null);\n  const [showBannerCropper, setShowBannerCropper] = useState(false);\n  const [cropBannerImage, setCropBannerImage] = useState(\'\');\n  const [originalBannerFile, setOriginalBannerFile] = useState<File | null>(null);'
);

// Replace handleDirectBannerUpload logic
const newHandleBannerUpload = `  const handleDirectBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalBannerFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setCropBannerImage(reader.result as string);
      setShowBannerCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  const handleBannerCropDone = async (croppedDataUrl: string) => {
    setShowBannerCropper(false);
    if (!originalBannerFile) return;

    const croppedFile = dataURLtoFile(croppedDataUrl, 'banner.jpg');
    try {
      setIsUploadingBanner(true);
      const [croppedUrl, fullUrl] = await Promise.all([
        handleMediaUpload(croppedFile, 'image'),
        handleMediaUpload(originalBannerFile, 'image')
      ]);

      const newBanner: BannerImage = {
        id: Date.now().toString(),
        url: croppedUrl,
        fullUrl: fullUrl,
        effect: 'Fade' as BannerEffect
      };

      onUpdateBanners([...normalizedBanners, newBanner]);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الرفع');
    } finally {
      setIsUploadingBanner(false);
      setOriginalBannerFile(null);
    }
  };
`;

code = code.replace(
  /const handleDirectBannerUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?e\.target\.value = '';\n  \};/,
  newHandleBannerUpload
);

// Replace the onChange handler on banner input
code = code.replace(
  'onChange={handleDirectBannerUpload}',
  'onChange={handleDirectBannerSelect}'
);
// Remove multiple from banner input
code = code.replace(
  /<input \s*type="file" \s*accept="image\/\*" \s*multiple/,
  '<input \n                type="file" \n                accept="image/*" '
);

// Add ImageCropper for Banner
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
  /\{showCropper && \([\s\S]*?\}\)/,
  `$&${cropperElement}`
);

// Also we need to make sure the viewer opens the fullUrl.
// In Header.tsx: onClick={() => setViewerImage({ src: activeBanner.url, alt: "Banner" })}
code = code.replace(
  /onClick=\{\(\) => setViewerImage\(\{ src: activeBanner\.url, alt: "Banner" \}\)\}/,
  'onClick={() => setViewerImage({ src: activeBanner.fullUrl || activeBanner.url, alt: "Banner" })}'
);


fs.writeFileSync('src/components/Header.tsx', code);
