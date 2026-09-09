import React, { useState } from 'react';
import { Settings, X, LogOut, KeyRound, Phone, Users, Eye, Image as ImageIcon, Camera, Loader2, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { PortfolioData, BannerImage, BannerEffect } from '../types';
import { handleMediaUpload } from '../lib/upload';
import { ImageCropper } from './ImageCropper';
import { useAppContext } from '../context';

interface AdminAuthProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  data: PortfolioData;
  onUpdateData: (data: PortfolioData) => void;
}

export function AdminAuth({ isAdmin, setIsAdmin, data, onUpdateData }: AdminAuthProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  
  
  const [whatsappNumber, setWhatsappNumber] = useState(data.aboutMe.whatsappNumber || '');
  const [baseVisitorCount, setBaseVisitorCount] = useState((data.baseVisitorCount || 0).toString());
  const { t } = useAppContext();

  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState('');
  const [showBannerCropper, setShowBannerCropper] = useState(false);
  const [cropBannerImage, setCropBannerImage] = useState('');
  const [originalBannerFile, setOriginalBannerFile] = useState<File | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const bannerInputRef = React.useRef<HTMLInputElement>(null);
  const profileInputRef = React.useRef<HTMLInputElement>(null);

  const currentBanners = data.bannerImages || [data.bannerImage];
  const normalizedBanners = currentBanners.map((b: any, idx: number) => {
    if (typeof b === 'string') {
      return { id: `legacy-${idx}`, url: b, fullUrl: b, effect: 'Fade' as BannerEffect };
    }
    return b;
  });

  const handleDeleteBanner = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      const newBanners = normalizedBanners.filter((b: any) => b.id !== id);
      onUpdateData({ ...data, bannerImages: newBanners });
    }
  };

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

    const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          return { id: `legacy-${idx}`, url: b, fullUrl: b, effect: 'Fade' as BannerEffect };
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


  const [storedPassword, setStoredPassword] = useLocalStorage('admin-password-v1', '0000');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === storedPassword) {
      setIsAdmin(true);
      setIsOpen(false);
      setPassword('');
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length > 0) {
      setStoredPassword(newPassword);
      setNewPassword('');
      alert('تم تغيير كلمة المرور بنجاح');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData({
      ...data,
      aboutMe: {
        ...data.aboutMe,
        whatsappNumber
      },
      baseVisitorCount: parseInt(baseVisitorCount) || 0
    });
    alert('تم حفظ الإعدادات');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-16 md:left-20 z-50 p-2.5 bg-slate-800/90 text-white rounded-full shadow-lg backdrop-blur-md border border-slate-700"
        title="إعدادات المدير"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-800">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
              <h3 className="font-bold text-white">
                {isAdmin ? 'إعدادات المدير' : 'تسجيل الدخول'}
              </h3>
              <button onClick={() => { setIsOpen(false); setError(''); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {!isAdmin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">كلمة المرور</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center tracking-widest text-lg"
                      placeholder="••••"
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <button
                    type="submit"
                    className="magnetic w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    دخول
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Stats Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                      <Users className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{data.visitorCount || 0}</div>
                      <div className="text-xs text-slate-400">الزوار الفعليين</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                      <Eye className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{data.mediaViewCount || 0}</div>
                      <div className="text-xs text-slate-400">مشاهدات الأعمال</div>
                    </div>
                  </div>

                  
                                    <div className="pt-4 border-t border-slate-800 space-y-4">
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
                              className="absolute inset-0 bg-red-500/80 flex opacity-100 md:opacity-0 md:group-hover:opacity-100 items-center justify-center text-white backdrop-blur-sm transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4 border-t border-slate-800 pt-4">

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        رقم الواتساب
                      </label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-left"
                        dir="ltr"
                        placeholder="e.g. 201234567890"
                      />
                      <p className="text-xs text-slate-500 mt-1">أدخل الرقم متضمناً كود الدولة بدون + أو مسافات</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        تعديل رقم الزوار (يضاف للرقم الفعلي)
                      </label>
                      <input
                        type="number"
                        value={baseVisitorCount}
                        onChange={(e) => setBaseVisitorCount(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-left"
                        dir="ltr"
                      />
                    </div>

                    <button
                      type="submit"
                      className="magnetic w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                    >
                      حفظ الإعدادات
                    </button>
                  </form>

                  <form onSubmit={handleChangePassword} className="space-y-4 border-t border-slate-800 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        تغيير كلمة المرور
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center tracking-widest text-lg"
                          placeholder="••••"
                        />
                        <button
                          type="submit"
                          className="magnetic bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                        >
                          تغيير
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="border-t border-slate-800 pt-4">
                    <button
                      onClick={handleLogout}
                      className="magnetic w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 py-2.5 rounded-xl font-bold transition-colors border border-red-500/30"
                    >
                      <LogOut className="w-5 h-5" />
                      تسجيل خروج
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
      
      {showBannerCropper && (
        <ImageCropper 
          imageSrc={cropBannerImage}
          onCropDone={handleBannerCropDone}
          onCancel={() => { setShowBannerCropper(false); setOriginalBannerFile(null); }}
          aspectRatio={21 / 9}
        />
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

  );
}
