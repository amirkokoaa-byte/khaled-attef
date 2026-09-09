const fs = require('fs');
let code = fs.readFileSync('src/components/AdminAuth.tsx', 'utf8');

const imports = `import { Settings, X, LogOut, KeyRound, Phone, Users, Eye, Image as ImageIcon, Camera, Loader2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { PortfolioData, BannerImage, BannerEffect } from '../types';
import { handleMediaUpload } from '../lib/upload';
import { ImageCropper } from './ImageCropper';
import { useAppContext } from '../context';
`;
code = code.replace(/import { Settings.*?\n.*?\n.*?\n/s, imports);

// Add states inside the component
const statesCode = `
  const [whatsappNumber, setWhatsappNumber] = useState(data.aboutMe.whatsappNumber || '');
  const [baseVisitorCount, setBaseVisitorCount] = useState((data.baseVisitorCount || 0).toString());
  const { t } = useAppContext();

  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  const profileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingBanner(true);
    try {
      const newBanners: BannerImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await handleMediaUpload(files[i], 'image');
        newBanners.push({
          id: Date.now().toString() + i,
          url,
          effect: 'Fade' as BannerEffect
        });
      }
      
      const currentBanners = data.bannerImages || [data.bannerImage];
      const normalizedBanners = currentBanners.map((b: any, idx: number) => {
        if (typeof b === 'string') {
          return { id: \`legacy-\${idx}\`, url: b, effect: 'Fade' as BannerEffect };
        }
        return b;
      });

      onUpdateData({
        ...data,
        bannerImages: [...normalizedBanners, ...newBanners]
      });
      alert('تم رفع صور الغلاف بنجاح');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الرفع');
    } finally {
      setIsUploadingBanner(false);
    }
    e.target.value = '';
  };

  const handleProfileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleProfileCropDone = async (croppedDataUrl: string) => {
    setShowCropper(false);
    if (!originalFile) return;

    const croppedFile = dataURLtoFile(croppedDataUrl, 'profile.jpg');
    try {
      setIsUploadingProfile(true);
      // Upload both
      const [croppedUrl, fullUrl] = await Promise.all([
        handleMediaUpload(croppedFile, 'image'),
        handleMediaUpload(originalFile, 'image')
      ]);

      onUpdateData({
        ...data,
        profileImage: croppedUrl,
        profileImageFull: fullUrl
      });
      alert('تم تغيير الصورة الشخصية بنجاح');
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
  /const \[whatsappNumber.*?useState.*?;\n.*?const \[baseVisitorCount.*?useState.*?;/s,
  statesCode
);

const renderFields = `
                  <div className="pt-4 border-t border-slate-800 space-y-4">
                    <h4 className="text-white font-medium mb-2">{t("إدارة الصور السريعة", "Quick Image Management")}</h4>
                    
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        className="hidden" 
                        ref={bannerInputRef} 
                        onChange={handleBannerUpload} 
                      />
                      <button 
                        type="button" 
                        onClick={() => bannerInputRef.current?.click()}
                        disabled={isUploadingBanner}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 rounded-xl transition-colors text-sm font-bold"
                      >
                        {isUploadingBanner ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                        {t("إضافة صورة للتايم لاين", "Add Timeline Image")}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={profileInputRef} 
                        onChange={handleProfileSelect} 
                      />
                      <button 
                        type="button" 
                        onClick={() => profileInputRef.current?.click()}
                        disabled={isUploadingProfile}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl transition-colors text-sm font-bold"
                      >
                        {isUploadingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                        {t("تغيير الصورة الشخصية", "Change Profile Image")}
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4 border-t border-slate-800 pt-4">
`;

code = code.replace(
  /<form onSubmit=\{handleSaveSettings\} className="space-y-4 border-t border-slate-800 pt-4">/,
  renderFields
);

const renderCropper = `
          </div>
        </div>
      )}
      {showCropper && (
        <ImageCropper 
          imageSrc={cropImage}
          onCropDone={handleProfileCropDone}
          onCancel={() => { setShowCropper(false); setOriginalFile(null); }}
          aspectRatio={1}
        />
      )}
    </>
`;

code = code.replace(
  /          <\/div>\n        <\/div>\n      \)}\n    <\/>/s,
  renderCropper
);

fs.writeFileSync('src/components/AdminAuth.tsx', code);
