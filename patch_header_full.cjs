const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Add originalFile state
code = code.replace(
  'const [cropImage, setCropImage] = useState(\'\');',
  'const [cropImage, setCropImage] = useState(\'\');\n  const [originalFile, setOriginalFile] = useState<File | null>(null);'
);

// Store originalFile in handleProfileSelect
code = code.replace(
  'const file = e.target.files?.[0];\n    if (!file) return;\n\n    const reader = new FileReader();',
  'const file = e.target.files?.[0];\n    if (!file) return;\n\n    setOriginalFile(file);\n    const reader = new FileReader();'
);

// Update handleCropDone to upload both
const newHandleCropDone = `
  const handleCropDone = async (croppedDataUrl: string) => {
    setShowCropper(false);
    if (!originalFile) return;

    const file = dataURLtoFile(croppedDataUrl, 'profile.jpg');
    try {
      setIsUploadingProfile(true);
      const [croppedUrl, fullUrl] = await Promise.all([
        handleMediaUpload(file, 'image'),
        handleMediaUpload(originalFile, 'image')
      ]);
      onUpdateProfile(croppedUrl, fullUrl);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الرفع');
    } finally {
      setIsUploadingProfile(false);
      setOriginalFile(null);
    }
  };
`;

code = code.replace(
  /const handleCropDone = async \(croppedDataUrl: string\) => \{[\s\S]*?setIsUploadingProfile\(false\);\n    \}\n  \};/,
  newHandleCropDone
);

// Update HeaderProps
code = code.replace(
  'onUpdateProfile: (url: string) => void;',
  'onUpdateProfile: (url: string, fullUrl?: string) => void;'
);

// Also fix onCancel in ImageCropper in Header.tsx
code = code.replace(
  'onCancel={() => setShowCropper(false)}',
  'onCancel={() => { setShowCropper(false); setOriginalFile(null); }}'
);

fs.writeFileSync('src/components/Header.tsx', code);
