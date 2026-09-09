const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const uploadBannerCode = `  const handleDirectBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          effect: 'Fade' // default
        });
      }
      onUpdateBanners([...normalizedBanners, ...newBanners]);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الرفع');
    } finally {
      setIsUploadingBanner(false);
    }
    e.target.value = '';
  };
`;

code = code.replace(
  'const handleProfileSelect =',
  uploadBannerCode + '\n  const handleProfileSelect ='
);

const buttonsCode = `<div className="absolute bottom-4 left-4 z-20 flex gap-2">
              <input 
                type="file" 
                accept="image/*" 
                multiple
                className="hidden" 
                ref={bannerInputRef} 
                onChange={handleDirectBannerUpload} 
              />
              <button type="button" 
                onClick={(e) => { e.stopPropagation(); bannerInputRef.current?.click(); }}
                disabled={isUploadingBanner}
                className="magnetic bg-slate-800/90 hover:bg-slate-700 text-indigo-400 px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm font-bold text-sm flex items-center gap-2 transition-all border border-slate-600"
              >
                {isUploadingBanner ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                {t("إضافة صور", "Add Images")}
              </button>
              <button type="button" 
                onClick={(e) => { e.stopPropagation(); setIsManageModalOpen(true); }}
                className="magnetic bg-slate-800/90 hover:bg-slate-700 text-indigo-400 px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm font-bold text-sm flex items-center gap-2 transition-all border border-slate-600"
              >
                <Settings className="w-4 h-4" />
                {t("إدارة الغلاف", "Manage Banner")}
              </button>
            </div>`;

code = code.replace(
  /<div className="absolute bottom-4 left-4 z-20">[\s\S]*?<\/div>/,
  buttonsCode
);

fs.writeFileSync('src/components/Header.tsx', code);
