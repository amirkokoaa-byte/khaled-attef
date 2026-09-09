const fs = require('fs');
let code = fs.readFileSync('src/components/AdminAuth.tsx', 'utf8');

// Add states for Banner Cropping
code = code.replace(
  'const [cropImage, setCropImage] = useState(\'\');',
  'const [cropImage, setCropImage] = useState(\'\');\n  const [showBannerCropper, setShowBannerCropper] = useState(false);\n  const [cropBannerImage, setCropBannerImage] = useState(\'\');\n  const [originalBannerFile, setOriginalBannerFile] = useState<File | null>(null);'
);

// Replace handleBannerUpload logic
const newHandleBannerUpload = `  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const currentBanners = data.bannerImages || [data.bannerImage];
      const normalizedBanners = currentBanners.map((b: any, idx: number) => {
        if (typeof b === 'string') {
          return { id: \`legacy-\${idx}\`, url: b, fullUrl: b, effect: 'Fade' as BannerEffect };
        }
        return b;
      });

      onUpdateData({
        ...data,
        bannerImages: [...normalizedBanners, newBanner]
      });
      alert('تم رفع صور الغلاف بنجاح');
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
  /const handleBannerUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?e\.target\.value = '';\n  \};/,
  newHandleBannerUpload
);

// Replace the onChange handler on banner input
code = code.replace(
  'onChange={handleBannerUpload}',
  'onChange={handleBannerSelect}'
);
// Remove multiple from banner input
code = code.replace(
  /type="file"\s*accept="image\/\*"\s*multiple/,
  'type="file" accept="image/*"'
);

// Add ImageCropper for Banner (using aspect ratio 16/9, or undefined if we want free crop? The user says "any part". So maybe undefined/null to allow free aspect ratio, or a fixed wide ratio. Let's use 21/9 for banners). Actually, react-easy-crop defaults to 4/3 if no aspect ratio is given, or we can use 2.33 for 21:9. Let's use `aspectRatio={21 / 9}`. Wait, if we use 21/9, we can enforce a timeline look. Let's do `aspectRatio={21 / 9}`. 
// Also wait, ImageCropper requires aspectRatio. Let's use `aspectRatio={21/9}`.
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

fs.writeFileSync('src/components/AdminAuth.tsx', code);
