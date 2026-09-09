import { useState } from 'react';
import { X, Plus, Image as ImageIcon, Video } from 'lucide-react';
import type { MediaItem } from '../types';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: MediaItem) => void;
  countries: string[];
  title: string;
}

export function AddMediaModal({ isOpen, onClose, onAdd, countries, title }: AddMediaModalProps) {
  const [type, setType] = useState<'image' | 'video'>('image');
  const [url, setUrl] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [country, setCountry] = useState(countries[0] || 'مصر');
  const [newCountry, setNewCountry] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !itemTitle.trim()) return;

    const finalCountry = newCountry.trim() || country;

    onAdd({
      id: Date.now().toString(),
      type,
      url: url.trim(),
      thumbnailUrl: url.trim(), // In a real app, generate video thumb. For now, use URL or a placeholder.
      title: itemTitle.trim(),
      country: finalCountry
    });

    setUrl('');
    setItemTitle('');
    setNewCountry('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="flex gap-4 mb-4 border-b border-slate-100 pb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={type === 'image'} onChange={() => setType('image')} className="text-indigo-600 focus:ring-indigo-500" />
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium">صورة</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={type === 'video'} onChange={() => setType('video')} className="text-indigo-600 focus:ring-indigo-500" />
              <Video className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium">فيديو</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">عنوان العمل</label>
            <input required type="text" value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {type === 'image' ? 'رابط الصورة (URL)' : 'رابط الفيديو (URL)'}
            </label>
            <input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" dir="ltr" placeholder="https://..." />
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

          <button type="submit" className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة
          </button>
        </form>
      </div>
    </div>
  );
}
