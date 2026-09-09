import { useState } from 'react';
import { Plus, Play } from 'lucide-react';
import type { MediaItem } from '../types';
import { UnifiedLightbox } from './UnifiedLightbox';
import { AddMediaModal } from './AddMediaModal';

interface StudioSectionProps {
  studio: MediaItem[];
  isAdmin: boolean;
  onAddMedia: (item: MediaItem) => void;
  uniqueCountries: string[];
}

export function StudioSection({ studio, isAdmin, onAddMedia, uniqueCountries }: StudioSectionProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; initialIndex: number; items: MediaItem[] }>({
    isOpen: false,
    initialIndex: 0,
    items: []
  });

  const openLightbox = (items: MediaItem[], itemToOpen: MediaItem) => {
    const initialIndex = items.findIndex(i => i.id === itemToOpen.id);
    setLightboxState({
      isOpen: true,
      initialIndex: Math.max(0, initialIndex),
      items
    });
  };

  return (
    <div className="w-full flex flex-col pt-6 pb-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-800">استوديو الصور والفيديوهات الخام</h2>
          
          {isAdmin && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة وسائط
            </button>
          )}
        </div>

        {studio.length === 0 ? (
          <div className="text-center text-slate-500 py-12">لا توجد وسائط خام في الاستوديو حتى الآن.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {studio.map(item => (
              <div 
                key={item.id} 
                className="group cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                onClick={() => openLightbox(studio, item)}
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm">
                        <Play className="w-6 h-6 text-white" fill="white" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex flex-col justify-center">
                  <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{item.country}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UnifiedLightbox 
        isOpen={lightboxState.isOpen}
        items={lightboxState.items}
        initialIndex={lightboxState.initialIndex}
        onClose={() => setLightboxState(prev => ({ ...prev, isOpen: false }))}
      />

      <AddMediaModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddMedia}
        countries={uniqueCountries}
        title="إضافة وسائط للاستوديو"
      />
    </div>
  );
}
