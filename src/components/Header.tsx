import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ImageViewer } from './ImageViewer';
import { LiveClock } from './LiveClock';
import { handleMediaUpload } from '../lib/upload';
import { ImageCropper } from './ImageCropper';

interface HeaderProps {
  bannerImages: string[];
  profileImage: string;
  isAdmin: boolean;
  onUpdateBanners: (urls: string[]) => void;
  onUpdateProfile: (url: string) => void;
}

export function Header({ bannerImages, profileImage, isAdmin, onUpdateBanners, onUpdateProfile }: HeaderProps) {
  const [viewerImage, setViewerImage] = useState<{src: string, alt: string} | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState('');
  const [cropType, setCropType] = useState<'profile' | 'banner'>('profile');

  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Auto-slider effect: change every 60 seconds (60,000 ms)
  useEffect(() => {
    if (!bannerImages || bannerImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 60000);

    return () => clearInterval(interval);
  }, [bannerImages]);

  const activeBanner = bannerImages && bannerImages.length > 0 
    ? bannerImages[currentIndex] 
    : 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000'; // fallback

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result as string);
      setCropType(type);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  const handleCropDone = async (croppedDataUrl: string) => {
    setShowCropper(false);
    const file = dataURLtoFile(croppedDataUrl, `${cropType}.jpg`);

    try {
      if (cropType === 'profile') {
        setIsUploadingProfile(true);
        const url = await handleMediaUpload(file, 'image');
        onUpdateProfile(url);
      } else {
        setIsUploadingBanner(true);
        const url = await handleMediaUpload(file, 'image');
        onUpdateBanners([...bannerImages, url]);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الرفع');
    } finally {
      setIsUploadingProfile(false);
      setIsUploadingBanner(false);
    }
  };

  return (
    <>
      <header className={`relative w-full mb-12 md:mb-16 bg-slate-900`}>
        {/* Banner */}
        <div className="w-full h-48 md:h-64 lg:h-[22rem] overflow-hidden relative group border-b border-slate-800">
          <img 
            key={activeBanner} // Force re-render for animation if needed
            src={activeBanner} 
            alt="Banner" 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer animate-in fade-in duration-1000"
            onClick={() => setViewerImage({ src: activeBanner, alt: "Banner" })}
          />
          <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors duration-300 pointer-events-none" />
          
          {/* Banner Controls */}
          {isAdmin && (
            <div className="absolute bottom-4 left-4 z-20">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={bannerInputRef} 
                onChange={(e) => handleFileSelect(e, 'banner')} 
              />
              <button type="button" 
                onClick={(e) => { e.stopPropagation(); bannerInputRef.current?.click(); }}
                disabled={isUploadingBanner}
                className="magnetic bg-slate-800/90 hover:bg-slate-700 text-indigo-400 px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm font-bold text-sm flex items-center gap-2 transition-all border border-slate-600"
              >
                {isUploadingBanner ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                إضافة صور للغلاف
              </button>
            </div>
          )}
          
          {/* Dots indicator for slider */}
          {bannerImages && bannerImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 pointer-events-none">
              {bannerImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-indigo-500 w-4 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Profile Picture & Clock */}
        <div className="relative flex justify-center mt-[-4rem] md:mt-[-5.5rem] z-20 px-4 md:px-8">
          <div className="absolute left-4 md:left-8 top-20 md:top-24 ">
            <LiveClock />
          </div>
          
          <div className="relative group">
            <div 
              className="magnetic w-32 h-32 md:w-44 md:h-44 rounded-2xl p-1.5 bg-slate-800 shadow-2xl cursor-pointer hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden border border-slate-700"
              onClick={() => setViewerImage({ src: profileImage, alt: "Profile" })}
            >
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:opacity-90"
              />
              {isUploadingProfile && (
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center rounded-xl backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
              )}
            </div>
            
            {/* Profile Edit Button */}
            {isAdmin && (
              <div className="absolute -bottom-3 -right-3 z-30">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={profileInputRef} 
                  onChange={(e) => handleFileSelect(e, 'profile')} 
                />
                <button type="button" 
                  onClick={(e) => { e.stopPropagation(); profileInputRef.current?.click(); }}
                  disabled={isUploadingProfile}
                  className="magnetic bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 border border-indigo-500"
                  title="تغيير الصورة الشخصية"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <ImageViewer 
          isOpen={viewerImage !== null} 
          src={viewerImage?.src || ''} 
          alt={viewerImage?.alt || ''}
          onClose={() => setViewerImage(null)} 
        />
      </header>

      {showCropper && (
        <ImageCropper 
          imageSrc={cropImage}
          onCropDone={handleCropDone}
          onCancel={() => setShowCropper(false)}
          aspectRatio={cropType === 'profile' ? 1 : 21/9}
        />
      )}
    </>
  );
}
