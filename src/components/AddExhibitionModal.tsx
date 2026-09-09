import { useState } from 'react';
import { X, Plus, Image as ImageIcon, Video } from 'lucide-react';
import type { ExhibitionItem, MediaItem } from '../types';

interface AddExhibitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: ExhibitionItem) => void;
}

export function AddExhibitionModal({ isOpen, onClose, onAdd }: AddExhibitionModalProps) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !country.trim()) return;

    // Parse media URLs separated by newline or comma
    const urls = mediaUrls.split(/[\n,]/).map(u => u.trim()).filter(Boolean);
    const media: MediaItem[] = urls.map((url, index) => ({
      id: Date.now().toString() + index,
      type: url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image', // Simple detection
      url: url,
      thumbnailUrl: url,
      title: `${name} - ${index + 1}`,
      country: country.trim()
    }));

    onAdd({
      id: Date.now().toString(),
      name: name.trim(),
      country: country.trim(),
      media
    });

    setName('');
    setCountry('');
    setMediaUrls('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">إضافة معرض جديد</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">اسم المعرض</label>
            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">دولة المعرض</label>
            <input required type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              روابط الوسائط (صور أو فيديوهات)
              <span className="text-xs text-slate-500 block">افصل بين الروابط بسطر جديد أو فاصلة</span>
            </label>
            <textarea 
              rows={4}
              value={mediaUrls} 
              onChange={(e) => setMediaUrls(e.target.value)} 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
              dir="ltr" 
              placeholder="https://image1.jpg&#10;https://video1.mp4" 
            />
          </div>

          <button type="submit" className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة المعرض
          </button>
        </form>
      </div>
    </div>
  );
}
