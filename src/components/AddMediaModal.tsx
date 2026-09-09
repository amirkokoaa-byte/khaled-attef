import React, { useState, useRef } from 'react';
import { X, Plus, Image as ImageIcon, Video, UploadCloud, Link as LinkIcon, Loader2 } from 'lucide-react';
import type { MediaItem } from '../types';
import { handleMediaUpload } from '../lib/upload';
import { ImageCropper } from './ImageCropper';

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
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [itemTitle, setItemTitle] = useState('');
  const [country, setCountry] = useState(countries[0] || 'مصر');
  const [newCountry, setNewCountry] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Cropper state
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageForCrop, setTempImageForCrop] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageForCrop(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

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

  const handleCropDone = (croppedDataUrl: string) => {
    const croppedFile = dataURLtoFile(croppedDataUrl, 'thumbnail.jpg');
    setFile(croppedFile);
    setPreviewUrl(croppedDataUrl);
    setShowCropper(false);
    setTempImageForCrop('');
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImageForCrop('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
      setPreviewUrl('');
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
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50">
            <h3 className="font-bold text-white">{title}</h3>
            <button onClick={onClose} disabled={isUploading} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div className="flex gap-4 mb-2 border-b border-slate-800 pb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="mediaType" checked={type === 'image'} onChange={() => { setType('image'); setFile(null); setPreviewUrl(''); }} className="text-indigo-500 focus:ring-indigo-500" />
                <ImageIcon className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">صورة</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="mediaType" checked={type === 'video'} onChange={() => { setType('video'); setFile(null); setPreviewUrl(''); }} className="text-indigo-500 focus:ring-indigo-500" />
                <Video className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">فيديو</span>
              </label>
            </div>

            <div className="flex gap-4 mb-2">
              <button
                type="button"
                onClick={() => setInputType('url')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${inputType === 'url' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
              >
                <LinkIcon className="w-4 h-4" /> رابط
              </button>
              <button
                type="button"
                onClick={() => setInputType('file')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${inputType === 'file' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
              >
                <UploadCloud className="w-4 h-4" /> رفع ملف
              </button>
            </div>

            {inputType === 'url' ? (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {type === 'image' ? 'رابط الصورة (URL)' : 'رابط الفيديو (URL)'}
                </label>
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" dir="ltr" placeholder="https://..." />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">اختيار ملف</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept={type === 'image' ? "image/*" : "video/*"}
                  onChange={handleFileSelect} 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                />
                {previewUrl && type === 'image' && (
                  <div className="mt-3 relative w-32 h-32 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                {previewUrl && type === 'video' && (
                  <div className="mt-3 text-sm text-emerald-400 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    تم اختيار الفيديو بنجاح
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">عنوان العمل</label>
              <input required type="text" value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">الدولة</label>
              <div className="flex gap-2">
                <select 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="other">دولة أخرى...</option>
                </select>
              </div>
              {country === 'other' && (
                <input required type="text" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} placeholder="اسم الدولة الجديدة" className="w-full mt-2 px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              )}
            </div>

            {error && <p className="text-red-400 text-sm text-center font-medium bg-red-500/10 border border-red-500/20 p-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={isUploading} className="magnetic w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-70">
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              {isUploading ? 'جاري الرفع...' : 'إضافة'}
            </button>
          </form>
        </div>
      </div>

      {showCropper && (
        <ImageCropper
          imageSrc={tempImageForCrop}
          onCropDone={handleCropDone}
          onCancel={handleCropCancel}
          aspectRatio={4/3}
        />
      )}
    </>
  );
}
