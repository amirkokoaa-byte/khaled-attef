import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import type { MediaItem } from '../types';

interface EditMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MediaItem;
  onSave: (updatedItem: MediaItem) => void;
}

export function EditMediaModal({ isOpen, onClose, item, onSave }: EditMediaModalProps) {
  const [title, setTitle] = useState(item.title);
  const [subtitle, setSubtitle] = useState(item.subtitle || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800">تعديل بيانات العمل</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">عنوان العمل (Title)</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">وصف فرعي / الوظيفة (Subtitle)</label>
            <input 
              type="text" 
              value={subtitle} 
              onChange={e => setSubtitle(e.target.value)} 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="مثال: تصوير إعلاني، أو مصمم شعار..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
              إلغاء
            </button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
