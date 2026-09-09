const fs = require('fs');
let code = fs.readFileSync('src/components/ManageBannersModal.tsx', 'utf8');

// Add ImageCropper import
code = code.replace(
  'import { handleMediaUpload } from \'../lib/upload\';',
  'import { handleMediaUpload } from \'../lib/upload\';\nimport { ImageCropper } from \'./ImageCropper\';'
);

// Add states
code = code.replace(
  'const [isUploading, setIsUploading] = useState(false);',
  'const [isUploading, setIsUploading] = useState(false);\n  const [showCropper, setShowCropper] = useState(false);\n  const [cropImage, setCropImage] = useState(\'\');\n  const [originalFile, setOriginalFile] = useState<File | null>(null);'
);

// Add dataURLtoFile helper
const dataURLtoFileHelper = `
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    let arr = dataurl.split(','),
      mimeMatch = arr[0].match(/:(.*?);/),
      mime = mimeMatch ? mimeMatch[1] : 'image/jpeg',
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
`;

code = code.replace(
  'const fileInputRef = useRef<HTMLInputElement>(null);',
  'const fileInputRef = useRef<HTMLInputElement>(null);\n' + dataURLtoFileHelper
);

// Replace handleFileSelect
const newHandleFileSelect = `  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  const handleCropDone = async (croppedDataUrl: string) => {
    setShowCropper(false);
    if (!originalFile) return;

    const croppedFile = dataURLtoFile(croppedDataUrl, 'banner.jpg');
    try {
      setIsUploading(true);
      const [croppedUrl, fullUrl] = await Promise.all([
        handleMediaUpload(croppedFile, 'image'),
        handleMediaUpload(originalFile, 'image')
      ]);

      const newBanner: BannerImage = {
        id: Date.now().toString(),
        url: croppedUrl,
        fullUrl: fullUrl,
        effect: 'Fade' as BannerEffect
      };

      setLocalBanners(prev => [...prev, newBanner]);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الرفع');
    } finally {
      setIsUploading(false);
      setOriginalFile(null);
    }
  };
`;

code = code.replace(
  /const handleFileSelect = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?e\.target\.value = '';\n  \};/,
  newHandleFileSelect
);

// Remove multiple
code = code.replace(
  /accept="image\/\*"\s*multiple/,
  'accept="image/*"'
);

// Add cropper component at the end
const cropperElement = `
      {showCropper && (
        <ImageCropper 
          imageSrc={cropImage}
          onCropDone={handleCropDone}
          onCancel={() => { setShowCropper(false); setOriginalFile(null); }}
          aspectRatio={21 / 9}
        />
      )}
`;
code = code.replace(
  /<\/div>\n    <\/div>\n  \);/,
  `</div>\n    </div>\n    ${cropperElement}\n  );`
);

fs.writeFileSync('src/components/ManageBannersModal.tsx', code);
