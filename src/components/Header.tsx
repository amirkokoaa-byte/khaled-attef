import { useState } from 'react';
import { ImageViewer } from './ImageViewer';
import { LiveClock } from './LiveClock';

interface HeaderProps {
  bannerImage: string;
  profileImage: string;
}

export function Header({ bannerImage, profileImage }: HeaderProps) {
  const [viewerImage, setViewerImage] = useState<{src: string, alt: string} | null>(null);

  return (
    <header className="relative w-full bg-slate-50 mb-12 md:mb-16">
      {/* Banner */}
      <div 
        className="w-full h-48 md:h-64 lg:h-[22rem] cursor-pointer overflow-hidden relative group"
        onClick={() => setViewerImage({ src: bannerImage, alt: "Banner" })}
      >
        <img 
          src={bannerImage} 
          alt="Banner" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      {/* Clock Widget overlay on top right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <LiveClock />
      </div>

      {/* Profile Picture */}
      <div className="relative flex justify-center mt-[-4rem] md:mt-[-5.5rem] z-20">
        <div 
          className="w-32 h-32 md:w-44 md:h-44 rounded-2xl p-1.5 bg-white shadow-xl cursor-pointer group hover:-translate-y-1 transition-transform duration-300"
          onClick={() => setViewerImage({ src: profileImage, alt: "Profile" })}
        >
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:opacity-90"
          />
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
