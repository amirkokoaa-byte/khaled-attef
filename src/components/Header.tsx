import { useAppContext } from "../context";
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, Loader2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageViewer } from './ImageViewer';
import { LiveClock } from './LiveClock';
import { handleMediaUpload } from '../lib/upload';
import { ImageCropper } from './ImageCropper';
import { BannerImage, BannerEffect } from '../types';
import { ManageBannersModal } from './ManageBannersModal';

interface HeaderProps {
  bannerImages: (string | BannerImage)[];
  bannerInterval?: number;
  profileImage: string;
  profileImageFull?: string;
  isAdmin: boolean;
  onUpdateBanners: (banners: (string | BannerImage)[]) => void;
  onUpdateProfile: (url: string, fullUrl?: string) => void;
}

// Normalize banners to always be objects
const normalizeBanners = (banners: (string | BannerImage)[]): BannerImage[] => {
  return banners.map((b, i) => {
    if (typeof b === 'string') {
      return { id: `legacy-${i}`, url: b, effect: 'Fade' };
    }
    return b;
  });
};

const getVariants = (effect: BannerEffect) => {
  switch (effect) {
    case 'Slide':
      return {
        initial: { x: '100%' },
        animate: { x: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
        exit: { x: '-100%', transition: { duration: 0.8, ease: 'easeInOut' } }
      };
    case 'Parallax':
      return {
        initial: { opacity: 0, scale: 1.2, x: 50 },
        animate: { opacity: 1, scale: 1, x: 0, transition: { duration: 1.2, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 1.1, x: -50, transition: { duration: 1.2, ease: 'easeIn' } }
      };
    case 'Intro':
      return {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1, transition: { duration: 1, ease: 'backOut' } },
        exit: { opacity: 0, scale: 1.2, transition: { duration: 1, ease: 'backIn' } }
      };
    case 'Love it':
      return {
        initial: { opacity: 0, scale: 0.5, rotate: -15 },
        animate: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1, type: 'spring', bounce: 0.4 } },
        exit: { opacity: 0, scale: 1.5, rotate: 15, transition: { duration: 0.8 } }
      };
    case 'Fade':
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 1 } },
        exit: { opacity: 0, transition: { duration: 1 } }
      };
  }
};

export function Header({ bannerImages, bannerInterval = 5000, profileImage, profileImageFull, isAdmin, onUpdateBanners, onUpdateProfile, onUpdateBannerInterval }: HeaderProps & { onUpdateBannerInterval: (interval: number) => void }) {
  const { t } = useAppContext();
  const [viewerImage, setViewerImage] = useState<{src: string, alt: string} | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState('');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [showBannerCropper, setShowBannerCropper] = useState(false);
  const [cropBannerImage, setCropBannerImage] = useState('');
  const [originalBannerFile, setOriginalBannerFile] = useState<File | null>(null);
  
  const profileInputRef = useRef<HTMLInputElement>(null);

  const normalizedBanners = normalizeBanners(bannerImages || []);

  // Auto-slider effect: change every 5 seconds (5000 ms)
  useEffect(() => {
    if (normalizedBanners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % normalizedBanners.length);
    }, bannerInterval);

    return () => clearInterval(interval);
  }, [normalizedBanners.length, bannerInterval]);

  const activeBanner = normalizedBanners.length > 0 
    ? normalizedBanners[currentIndex] 
    : { id: 'fallback', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000', effect: 'Fade' as BannerEffect };

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

      const handleDirectBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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


  return (
    <>
      <header className={`relative w-full mb-12 md:mb-16 bg-slate-900`}>
        {/* Banner Slider */}
        <div className="w-full h-48 md:h-64 lg:h-[22rem] overflow-hidden relative group border-b border-slate-800">
          <AnimatePresence initial={false}>
            <motion.img 
              key={activeBanner.id}
              src={activeBanner.url}
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              variants={getVariants(activeBanner.effect)}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setViewerImage({ src: activeBanner.fullUrl || activeBanner.url, alt: "Banner" })}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors duration-300 pointer-events-none z-10" />
          
          {/* Banner Controls */}
          {isAdmin && (
            <div className="absolute bottom-4 left-4 z-20 flex gap-2">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={bannerInputRef} 
                onChange={handleDirectBannerSelect} 
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
            </div>
          )}
          
          {/* Interactive Navigation Dots with Tooltips */}
          {normalizedBanners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {normalizedBanners.map((banner, idx) => (
                <div key={banner.id} className="relative group/dot flex flex-col items-center">
                  {/* Tooltip */}
                  <div className="absolute -top-8 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-slate-950 text-white text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-xl border border-slate-700">
                      {banner.effect}
                    </div>
                  </div>
                  {/* Dot / Thumbnail */}
                  <button
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                      idx === currentIndex 
                        ? 'w-10 h-3 shadow-[0_0_8px_rgba(99,102,241,0.8)] border-indigo-400' 
                        : 'w-3 h-3 border-transparent hover:scale-125'
                    } border-2`}
                  >
                    <img src={banner.url} alt="dot" className="w-full h-full object-cover" />
                    {idx !== currentIndex && <div className="absolute inset-0 bg-black/40 group-hover/dot:bg-transparent transition-colors" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Picture & Clock */}
        <div className="relative flex justify-center mt-[-4rem] md:mt-[-5.5rem] z-30 px-4 md:px-8">
          <div className="absolute left-4 md:left-8 top-20 md:top-24 hidden md:block">
            <LiveClock />
          </div>
          
          <div className="relative group">
            <div 
              className="magnetic w-32 h-32 md:w-44 md:h-44 rounded-2xl p-1.5 bg-slate-800 shadow-2xl cursor-pointer hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden border border-slate-700"
              onClick={() => setViewerImage({ src: profileImageFull || profileImage, alt: "Profile" })}
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
                  onChange={handleProfileSelect} 
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
          onCancel={() => { setShowCropper(false); setOriginalFile(null); }}
          aspectRatio={1}
        />
      )}

      <ManageBannersModal 
        isOpen={isManageModalOpen}
        bannerInterval={bannerInterval}
        onClose={() => setIsManageModalOpen(false)}
        banners={normalizedBanners}
        onSave={(banners, interval) => {
          onUpdateBanners(banners);
          onUpdateBannerInterval(interval);
          setCurrentIndex(0); // Reset index
        }}
      />
    </>
  );
}
