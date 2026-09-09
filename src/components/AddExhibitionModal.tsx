import React, { useState, useRef } from 'react';
import { X, Plus, UploadCloud, Link as LinkIcon, Loader2 } from 'lucide-react';
import type { ExhibitionItem, MediaItem } from '../types';
import { handleMediaUpload } from '../lib/upload';

interface AddExhibitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: ExhibitionItem) => void;
}

export function AddExhibitionModal({ isOpen, onClose, onAdd }: AddExhibitionModalProps) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [inputType, setInputType] = useState<'url' | 'file'>('file');
  const [mediaUrls, setMediaUrls] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !country.trim()) return;
    if (inputType === 'url' && !mediaUrls.trim()) {
      setError('يرجى إدخال الروابط');
      return;
    }
    if (inputType === 'file' && files.length === 0) {
      setError('يرجى اختيار ملفات');
      return;
    }

    try {
      setIsUploading(true);
      let media: MediaItem[] = [];

      if (inputType === 'url') {
        const urls = mediaUrls.split(/[\n,]/).map(u => u.trim()).filter(Boolean);
        media = urls.map((url, index) => ({
          id: Date.now().toString() + index,
          type: url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image', // Simple detection
          url: url,
          thumbnailUrl: url,
          title: `${name.trim()} - ${index + 1}`,
          country: country.trim()
        }));
      } else {
        // Upload all selected files concurrently
        const uploadPromises = files.map(async (file, index) => {
          const type = file.type.startsWith('video') ? 'video' : 'image';
          const url = await handleMediaUpload(file, type);
          return {
            id: Date.now().toString() + index,
            type,
            url,
            thumbnailUrl: url,
            title: `${name.trim()} - ${index + 1}`,
            country: country.trim()
          };
        });

        media = await Promise.all(uploadPromises);
      }

      onAdd({
        id: Date.now().toString(),
        name: name.trim(),
        country: country.trim(),
        media
      });

      setName('');
      setCountry('');
      setMediaUrls('');
      setFiles([]);
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الرفع');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white text-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">إضافة معرض جديد</h3>
          <button onClick={onClose} disabled={isUploading} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">اسم المعرض</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">دولة المعرض</label>
            <input required type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="flex gap-4 mb-2">
            <button
              type="button"
              onClick={() => setInputType('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${inputType === 'file' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
            >
              <UploadCloud className="w-4 h-4" /> رفع ملفات
            </button>
            <button
              type="button"
              onClick={() => setInputType('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${inputType === 'url' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
            >
              <LinkIcon className="w-4 h-4" /> روابط
            </button>
          </div>

          {inputType === 'url' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                روابط الوسائط (صور أو فيديوهات)
                <span className="text-xs text-slate-500 block">افصل بين الروابط بسطر جديد أو فاصلة</span>
              </label>
              <textarea 
                rows={4}
                value={mediaUrls} 
                onChange={(e) => setMediaUrls(e.target.value)} 
                className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                dir="ltr" 
                placeholder="https://image1.jpg&#10;https://video1.mp4" 
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">اختيار ملفات</label>
              <input 
                type="file" 
                multiple
                accept="image/*,video/*"
                ref={fileInputRef}
                onChange={(e) => setFiles(Array.from(e.target.files || []))} 
                className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 text-sm" 
              />
              {files.length > 0 && (
                <p className="text-xs text-indigo-600 mt-2 font-medium">تم تحديد {files.length} ملفات</p>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</p>}

          <button type="submit" disabled={isUploading} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-70">
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {isUploading ? 'جاري الرفع...' : 'إضافة المعرض'}
          </button>
        </form>
      </div>
    </div>
  );
}
