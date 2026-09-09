import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors z-50"
      >
        <X className="w-6 h-6" />
      </button>
      <img 
        src={src} 
        alt={alt} 
        className="max-w-full max-h-[90vh] object-contain p-4 select-none animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
