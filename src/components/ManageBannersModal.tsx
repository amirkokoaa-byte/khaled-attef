import { useAppContext } from "../context";
import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, Trash2 } from 'lucide-react';
import { BannerImage, BannerEffect } from '../types';
import { handleMediaUpload } from '../lib/upload';
import { ImageCropper } from './ImageCropper';

interface ManageBannersModalProps {
  isOpen: boolean;
  bannerInterval?: number;
  onClose: () => void;
  banners: BannerImage[];
  onSave: (banners: BannerImage[], interval: number) => void;
}

const EFFECTS: BannerEffect[] = ['Fade', 'Slide', 'Intro', 'Parallax', 'Love it'];

export function ManageBannersModal({ isOpen, onClose, banners, bannerInterval = 5000, onSave }: ManageBannersModalProps) {
  const { t } = useAppContext();
  const [localBanners, setLocalBanners] = useState<BannerImage[]>(banners);
  const [localInterval, setLocalInterval] = useState(bannerInterval / 1000); // in seconds
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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


  if (!isOpen) return null;

  const handleEffectChange = (id: string, newEffect: BannerEffect) => {
    setLocalBanners(prev => prev.map(b => b.id === id ? { ...b, effect: newEffect } : b));
  };

  const handleRemove = (id: string) => {
    setLocalBanners(prev => prev.filter(b => b.id !== id));
  };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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


  return (
    <>
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-slate-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-800 animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="font-bold text-white text-lg">{t("إدارة صور غلاف التايم لاين", "Manage Timeline Banners")}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {localBanners.length > 1 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-medium text-sm">{t("المدة بين كل صورة والأخرى", "Duration between images")}</h4>
                <p className="text-slate-400 text-xs mt-1">{t("بالثواني", "In seconds")}</p>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min={1} 
                  max={20} 
                  step={0.5} 
                  value={localInterval}
                  onChange={(e) => setLocalInterval(parseFloat(e.target.value))}
                  className="w-32 accent-indigo-500"
                />
                <span className="text-white font-bold w-12 text-center bg-slate-900 py-1 rounded-md border border-slate-700">{localInterval}s</span>
              </div>
            </div>
          )}
          
          {localBanners.length === 0 ? (

            <p className="text-slate-400 text-center py-8">{t("لا يوجد صور حالياً.", "No images currently.")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localBanners.map(banner => (
                <div key={banner.id} className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex flex-col gap-3">
                  <div className="h-32 w-full rounded-lg overflow-hidden bg-slate-950 relative">
                    <img src={banner.url} alt="Banner" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleRemove(banner.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">{t("تأثير الانتقال (Transition Effect)", "Transition Effect")}</label>
                    <select 
                      value={banner.effect} 
                      onChange={(e) => handleEffectChange(banner.id, e.target.value as BannerEffect)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
                    >
                      {EFFECTS.map(eff => (
                        <option key={eff} value={eff}>{eff}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-wrap gap-3 justify-between items-center">
          <div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 rounded-xl transition-colors font-medium text-sm"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {isUploading ? t('جاري الرفع...', 'Uploading...') : t('رفع صور جديدة', 'Upload New Images')}
            </button>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors font-medium text-sm"
            >
              إلغاء
            </button>
            <button 
              onClick={() => { onSave(localBanners, localInterval * 1000); onClose(); }}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-bold text-sm shadow-lg shadow-indigo-500/20"
            >
              {t('حفظ التغييرات', 'Save Changes')}
            </button>
          </div>
        </div>

      </div>
    </div>
    
      {showCropper && (
        <ImageCropper 
          imageSrc={cropImage}
          onCropDone={handleCropDone}
          onCancel={() => { setShowCropper(false); setOriginalFile(null); }}
          aspectRatio={21 / 9}
        />
      )}

    </>
  );
}
