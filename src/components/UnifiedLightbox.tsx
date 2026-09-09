import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Download, Play } from 'lucide-react';
import type { MediaItem } from '../types';

interface UnifiedLightboxProps {
  items: MediaItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function UnifiedLightbox({ items, initialIndex, isOpen, onClose }: UnifiedLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, initialIndex]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleDownload = async (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = item.title || `download-${item.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed, opening in new tab', err);
      window.open(item.url, '_blank');
    }
  };

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={onClose} dir="rtl">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
        {/* Left side download */}
        <button
          onClick={(e) => handleDownload(e, currentItem)}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md transition-colors"
        >
          <Download className="w-5 h-5" />
          <span className="text-sm font-medium">تحميل</span>
        </button>

        {/* Right side close */}
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all z-50"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all z-50"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative w-full h-full max-w-6xl mx-auto flex flex-col items-center justify-center p-4 md:p-12" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {currentItem.type === 'image' ? (
            <img
              src={currentItem.url}
              alt={currentItem.title}
              className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-300 rounded-lg shadow-2xl"
            />
          ) : (
            <video
              src={currentItem.url}
              controls
              autoPlay
              className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-300 rounded-lg shadow-2xl"
            />
          )}
        </div>
        
        {/* Title */}
        <div className="absolute bottom-6 md:bottom-8 bg-black/60 backdrop-blur-md px-6 py-2.5 rounded-full text-white text-lg font-medium shadow-xl">
          {currentItem.title}
        </div>
        
        {/* Counter */}
        {items.length > 1 && (
          <div className="absolute bottom-6 left-6 md:left-8 text-white/50 text-sm font-medium tracking-widest" dir="ltr">
            {currentIndex + 1} / {items.length}
          </div>
        )}
      </div>
    </div>
  );
}
