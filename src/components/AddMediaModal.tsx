import React, { useState, useRef } from 'react';
import { X, Plus, Image as ImageIcon, Video, UploadCloud, Link as LinkIcon, Loader2 } from 'lucide-react';
import type { MediaItem } from '../types';
import { handleMediaUpload } from '../lib/upload';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: MediaItem) => void;
  countries: string[];
  title: string;
}

export function AddMediaModal({ isOpen, onClose, onAdd, countries, title }: AddMediaModalProps) {
  const [type, setType] = useState<'image' | 'video'>('image');
  const [inputType, setInputType] = useState<'url' | 'file'>('url');
  
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [itemTitle, setItemTitle] = useState('');
  const [country, setCountry] = useState(countries[0] || 'مصر');
  const [newCountry, setNewCountry] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (inputType === 'url' && !url.trim()) {
      setError('يرجى إدخال الرابط');
      return;
    }
    if (inputType === 'file' && !file) {
      setError('يرجى اختيار ملف');
      return;
    }
    if (!itemTitle.trim()) {
      setError('يرجى إدخال العنوان');
      return;
    }

    const finalCountry = newCountry.trim() || country;

    try {
      setIsUploading(true);
      let finalUrl = url.trim();
      
      if (inputType === 'file' && file) {
        finalUrl = await handleMediaUpload(file, type);
      }

      onAdd({
        id: Date.now().toString(),
        type,
        url: finalUrl,
        thumbnailUrl: finalUrl,
        title: itemTitle.trim(),
        country: finalCountry
      });

      setUrl('');
      setFile(null);
      setItemTitle('');
      setNewCountry('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الرفع');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} disabled={isUploading} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="flex gap-4 mb-2 border-b border-slate-100 pb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="mediaType" checked={type === 'image'} onChange={() => setType('image')} className="text-indigo-600 focus:ring-indigo-500" />
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium">صورة</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="mediaType" checked={type === 'video'} onChange={() => setType('video')} className="text-indigo-600 focus:ring-indigo-500" />
              <Video className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium">فيديو</span>
            </label>
          </div>

          <div className="flex gap-4 mb-2">
            <button
              type="button"
              onClick={() => setInputType('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${inputType === 'url' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
            >
              <LinkIcon className="w-4 h-4" /> رابط
            </button>
            <button
              type="button"
              onClick={() => setInputType('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${inputType === 'file' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
            >
              <UploadCloud className="w-4 h-4" /> رفع ملف
            </button>
          </div>

          {inputType === 'url' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {type === 'image' ? 'رابط الصورة (URL)' : 'رابط الفيديو (URL)'}
              </label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" dir="ltr" placeholder="https://..." />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">اختيار ملف</label>
              <input 
                type="file" 
                ref={fileInputRef}
                accept={type === 'image' ? "image/*" : "video/*"}
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 text-sm" 
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">عنوان العمل</label>
            <input required type="text" value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الدولة</label>
            <div className="flex gap-2">
              <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="other">دولة أخرى...</option>
              </select>
            </div>
            {country === 'other' && (
              <input required type="text" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} placeholder="اسم الدولة الجديدة" className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            )}
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</p>}

          <button type="submit" disabled={isUploading} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-70">
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {isUploading ? 'جاري الرفع...' : 'إضافة'}
          </button>
        </form>
      </div>
    </div>
  );
}
