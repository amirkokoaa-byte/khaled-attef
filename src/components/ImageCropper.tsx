import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageCropperProps {
  imageSrc: string;
  onCropDone: (croppedImageUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export function ImageCropper({ imageSrc, onCropDone, onCancel, aspectRatio = 1 }: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return;

    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Convert canvas to blob/data URL
      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      onCropDone(croppedImageUrl);
    } catch (e) {
      console.error(e);
      alert('فشل قص الصورة');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-800 flex flex-col h-[80vh]">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900">
          <h3 className="font-bold text-white">قص الصورة</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative flex-1 w-full bg-slate-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-white text-sm">تكبير:</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors font-medium"
            >
              إلغاء
            </button>
            <button
              onClick={createCroppedImage}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition-colors font-bold"
            >
              <Check className="w-4 h-4" />
              تأكيد وحفظ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
