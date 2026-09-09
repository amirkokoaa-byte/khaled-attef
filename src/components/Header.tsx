import React, { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ImageViewer } from './ImageViewer';
import { LiveClock } from './LiveClock';
import { handleMediaUpload } from '../lib/upload';
import { useAppContext } from '../context';

interface HeaderProps {
  bannerImages: string[];
  profileImage: string;
  isAdmin: boolean;
  onUpdateBanners: (urls: string[]) => void;
  onUpdateProfile: (url: string) => void;
}

export function Header({ bannerImages, profileImage, isAdmin, onUpdateBanners, onUpdateProfile }: HeaderProps) {
  const { theme } = useAppContext();
  const [viewerImage, setViewerImage] = useState<{src: string, alt: string} | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

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

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploadingProfile(true);
      const url = await handleMediaUpload(file, 'image');
      onUpdateProfile(url);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع الصورة');
    } finally {
      setIsUploadingProfile(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    try {
      setIsUploadingBanner(true);
      const uploadPromises = files.map(file => handleMediaUpload(file, 'image'));
      const urls = await Promise.all(uploadPromises);
      onUpdateBanners([...bannerImages, ...urls]); // Append new banners
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء رفع الصور');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  return (
    <header className={`relative w-full mb-12 md:mb-16 ${theme === 'navy' ? 'bg-gray-100' : 'bg-slate-50'}`}>
      {/* Banner */}
      <div className="w-full h-48 md:h-64 lg:h-[22rem] overflow-hidden relative group">
        <img 
          key={activeBanner} // Force re-render for animation if needed
          src={activeBanner} 
          alt="Banner" 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer animate-in fade-in duration-1000"
          onClick={() => setViewerImage({ src: activeBanner, alt: "Banner" })}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
        
        {/* Banner Controls */}
        {isAdmin && (
          <div className="absolute bottom-4 left-4 z-20">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={bannerInputRef} 
              onChange={handleBannerUpload} 
            />
            <button 
              onClick={(e) => { e.stopPropagation(); bannerInputRef.current?.click(); }}
              disabled={isUploadingBanner}
              className="bg-white/90 hover:bg-white text-indigo-700 px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm font-bold text-sm flex items-center gap-2 transition-all"
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
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Clock Widget overlay on top right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <LiveClock />
      </div>

      {/* Profile Picture */}
      <div className="relative flex justify-center mt-[-4rem] md:mt-[-5.5rem] z-20">
        <div className="relative group">
          <div 
            className="w-32 h-32 md:w-44 md:h-44 rounded-2xl p-1.5 bg-white shadow-xl cursor-pointer hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden"
            onClick={() => setViewerImage({ src: profileImage, alt: "Profile" })}
          >
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:opacity-90"
            />
            {isUploadingProfile && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
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
                onChange={handleProfileUpload} 
              />
              <button 
                onClick={(e) => { e.stopPropagation(); profileInputRef.current?.click(); }}
                disabled={isUploadingProfile}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110"
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
  );
}
