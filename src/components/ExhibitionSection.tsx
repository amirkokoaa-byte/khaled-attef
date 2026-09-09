import { useAppContext } from "../context";
import { useState, useMemo } from 'react';
import { Plus, Play } from 'lucide-react';
import type { ExhibitionItem, MediaItem } from '../types';
import { UnifiedLightbox } from './UnifiedLightbox';
import { AddExhibitionModal } from './AddExhibitionModal';

interface ExhibitionSectionProps {
  exhibitions: ExhibitionItem[];
  selectedCountry: string;
  isAdmin: boolean;
  onAddExhibition: (item: ExhibitionItem) => void;
}

export function ExhibitionSection({ exhibitions, selectedCountry, isAdmin, onAddExhibition }: ExhibitionSectionProps) {
  const { t } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; initialIndex: number; items: MediaItem[] }>({
    isOpen: false,
    initialIndex: 0,
    items: []
  });

  // Filter exhibitions by selected country
  const filteredExhibitions = useMemo(() => {
    if (selectedCountry === 'الكل') return exhibitions;
    return exhibitions.filter(ex => ex.country === selectedCountry);
  }, [exhibitions, selectedCountry]);

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
          <h2 className="text-2xl font-bold text-slate-800">
            {selectedCountry === 'الكل' ? 'جميع المعارض' : `معارض ${selectedCountry}`}
          </h2>
          
          {isAdmin && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة معرض
            </button>
          )}
        </div>

        {filteredExhibitions.length === 0 ? (
          <div className="text-center text-slate-500 py-12">لا توجد معارض لعرضها هنا.</div>
        ) : (
          <div className="space-y-12">
            {filteredExhibitions.map(exhibition => (
              <div key={exhibition.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-indigo-800">{exhibition.name}</h3>
                    <p className="text-slate-500 font-medium mt-1">{exhibition.country}</p>
                  </div>
                  <div className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                    {exhibition.media.length} وسائط
                  </div>
                </div>

                {exhibition.media.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {exhibition.media.map(item => (
                      <div 
                        key={item.id} 
                        className="group cursor-pointer rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col relative aspect-square"
                        onClick={() => openLightbox(exhibition.media, item)}
                      >
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    لا توجد وسائط مضافة لهذا المعرض
                  </div>
                )}
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

      <AddExhibitionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddExhibition}
      />
    </div>
  );
}
