const fs = require('fs');
let code = fs.readFileSync('src/components/AdminAuth.tsx', 'utf8');

// Ensure Trash2 is imported
if (!code.includes('Trash2')) {
  code = code.replace(
    'import { Settings, X, LogOut, KeyRound, Phone, Users, Eye, Image as ImageIcon, Camera, Loader2 } from \'lucide-react\';',
    'import { Settings, X, LogOut, KeyRound, Phone, Users, Eye, Image as ImageIcon, Camera, Loader2, Trash2 } from \'lucide-react\';'
  );
}

// Compute normalized banners for rendering
const computeBannersCode = `  const currentBanners = data.bannerImages || [data.bannerImage];
  const normalizedBanners = currentBanners.map((b: any, idx: number) => {
    if (typeof b === 'string') {
      return { id: \`legacy-\${idx}\`, url: b, fullUrl: b, effect: 'Fade' as BannerEffect };
    }
    return b;
  });

  const handleDeleteBanner = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      const newBanners = normalizedBanners.filter((b: any) => b.id !== id);
      onUpdateData({ ...data, bannerImages: newBanners });
    }
  };
`;

code = code.replace(
  '  const dataURLtoFile = (dataurl: string, filename: string): File => {',
  computeBannersCode + '\n  const dataURLtoFile = (dataurl: string, filename: string): File => {'
);

const newQuickImageHTML = `                  <div className="pt-4 border-t border-slate-800 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-medium">{t("إدارة الصور السريعة", "Quick Image Management")}</h4>
                    </div>

                    {/* Profile Image */}
                    <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                      <img src={data.profileImage} className="w-12 h-12 rounded-full object-cover border border-slate-600" alt="Profile" />
                      <div className="flex-1">
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
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-lg transition-colors text-xs font-bold"
                        >
                          {isUploadingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                          {t("تغيير الصورة الشخصية", "Change Profile Image")}
                        </button>
                      </div>
                    </div>

                    {/* Timeline Banners */}
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-300 font-medium">صور الغلاف ({normalizedBanners.length})</span>
                        <input 
                          type="file" accept="image/*"
                          className="hidden" 
                          ref={bannerInputRef} 
                          onChange={handleBannerSelect} 
                        />
                        <button 
                          type="button" 
                          onClick={() => bannerInputRef.current?.click()}
                          disabled={isUploadingBanner}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-600 rounded-lg transition-colors text-xs font-bold"
                        >
                          {isUploadingBanner ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                          {t("إضافة", "Add")}
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {normalizedBanners.map((banner: any) => (
                          <div key={banner.id} className="relative w-16 h-12 rounded-md overflow-hidden border border-slate-700 group">
                            <img src={banner.url} className="w-full h-full object-cover" alt="Banner" />
                            <button 
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="absolute inset-0 bg-red-500/80 hidden group-hover:flex items-center justify-center text-white backdrop-blur-sm transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>`;

// We replace the quick image block
code = code.replace(
  /<div className="pt-4 border-t border-slate-800 space-y-4">[\s\S]*?<\/button>\n                    <\/div>\n                  <\/div>/,
  newQuickImageHTML
);

fs.writeFileSync('src/components/AdminAuth.tsx', code);
