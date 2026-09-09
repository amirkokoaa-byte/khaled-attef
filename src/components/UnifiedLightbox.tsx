import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Download, Play } from 'lucide-react';
import type { MediaItem } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

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
      
      // Increment media view count
      if (db) {
        const docRef = doc(db, 'siteData', 'portfolio-data-v1');
        updateDoc(docRef, {
          mediaViewCount: increment(1)
        }).catch(err => {
          if (err.message?.includes('offline')) {
            console.warn("Firebase is offline. Media view count not updated.");
          } else {
            console.error("Failed to increment media view:", err);
          }
        });
      }
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

  const applyWatermarkAndDownload = async (item: MediaItem) => {
    try {
      if (item.type === 'video') {
        // Direct download for video
        const response = await fetch(item.url);
        const blob = await response.blob();
        triggerDownload(blob, item.title || `download-${item.id}.mp4`);
        return;
      }

      // Watermark image
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Important for CORS
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = item.url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Watermark settings
      const text = `Khaled Attef - ${new Date().toLocaleDateString('en-GB')}`;
      const fontSize = Math.max(20, img.width * 0.03); // Responsive font size
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      
      // Add subtle shadow for better visibility on light backgrounds
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Draw watermark in bottom right corner with padding
      const padding = fontSize;
      ctx.fillText(text, img.width - padding, img.height - padding);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          triggerDownload(blob, item.title || `download-${item.id}.jpg`);
        }
      }, 'image/jpeg', 0.95);

    } catch (err) {
      console.error('Watermark/Download failed, opening in new tab', err);
      window.open(item.url, '_blank');
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleDownload = (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    applyWatermarkAndDownload(item);
  };

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md" onClick={onClose} dir="rtl">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50">
        {/* Left side download */}
        <button
          onClick={(e) => handleDownload(e, currentItem)}
          className="magnetic flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-md transition-colors border border-white/10"
        >
          <Download className="w-5 h-5" />
          <span className="text-sm font-medium">تحميل الصورة بحقوق الملكية</span>
        </button>

        {/* Right side close */}
        <button
          onClick={onClose}
          className="magnetic bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="magnetic absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all z-50 border border-white/10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="magnetic absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all z-50 border border-white/10"
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
        <div className="absolute bottom-6 md:bottom-8 bg-slate-900/80 backdrop-blur-md px-6 py-2.5 rounded-full text-white text-lg font-medium shadow-xl border border-slate-700/50">
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
