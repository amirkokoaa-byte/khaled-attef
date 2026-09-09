import { useState, useMemo } from 'react';
import { LayoutGrid, List, Play, Plus } from 'lucide-react';
import type { MediaItem } from '../types';
import { UnifiedLightbox } from './UnifiedLightbox';
import { AddMediaModal } from './AddMediaModal';

interface PortfolioSectionProps {
  gallery: MediaItem[];
  selectedCountry: string;
  isAdmin: boolean;
  onAddMedia: (item: MediaItem) => void;
  uniqueCountries: string[];
}

export function PortfolioSection({ gallery, selectedCountry, isAdmin, onAddMedia, uniqueCountries }: PortfolioSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lightboxState, setLightboxState] = useState<{ isOpen: boolean; initialIndex: number; items: MediaItem[] }>({
    isOpen: false,
    initialIndex: 0,
    items: []
  });

  // Filter gallery items by selected country
  const filteredGallery = useMemo(() => {
    if (selectedCountry === 'الكل') return gallery;
    return gallery.filter(item => item.country === selectedCountry);
  }, [gallery, selectedCountry]);

  // Group filtered gallery by country
  const groupedGallery = useMemo(() => {
    return filteredGallery.reduce((acc, item) => {
      if (!acc[item.country]) acc[item.country] = [];
      acc[item.country].push(item);
      return acc;
    }, {} as Record<string, MediaItem[]>);
  }, [filteredGallery]);

  const openLightbox = (items: MediaItem[], itemToOpen: MediaItem) => {
    const initialIndex = items.findIndex(i => i.id === itemToOpen.id);
    setLightboxState({
      isOpen: true,
      initialIndex: Math.max(0, initialIndex),
      items
    });
  };

  return (
    <div className="w-full flex flex-col pt-6 pb-12 space-y-10" dir="rtl">
      {/* 1. Continuous Auto-Scrolling Banner (Marquee) - Always shows all items */}
      <div className="w-full overflow-hidden bg-slate-900 py-4 relative group shadow-inner">
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
        
        {gallery.length > 0 ? (
          <div className="flex w-fit animate-marquee hover:[animation-play-state:paused]">
            {/* We duplicate the array to make the scrolling seamless */}
            {[...gallery, ...gallery, ...gallery].map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="w-48 h-32 md:w-64 md:h-40 flex-shrink-0 mx-2 rounded-xl overflow-hidden cursor-pointer relative group/item"
                onClick={() => openLightbox(gallery, item)}
              >
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {item.type === 'video' ? <Play className="w-10 h-10 text-white" /> : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-400 text-center py-8">لا توجد أعمال لعرضها.</div>
        )}
      </div>

      {/* 2. Controls & Gallery Area */}
      <div className="container mx-auto px-4 mt-4">
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-800">
              {selectedCountry === 'الكل' ? 'جميع الأعمال' : `أعمال ${selectedCountry}`}
            </h2>
            {isAdmin && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                إضافة عمل
              </button>
            )}
          </div>
          
          {/* Grid/List Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
              title="عرض كشبكة"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
              title="عرض كقائمة"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery Grouped by Country */}
        <div className="space-y-12">
          {Object.entries(groupedGallery).length === 0 ? (
            <div className="text-center text-slate-500 py-12">لا توجد أعمال لعرضها هنا.</div>
          ) : (
            Object.entries(groupedGallery).map(([country, items]) => (
              <div key={country} className="space-y-6">
                <h3 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
                  <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                  {country}
                </h3>
                
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
                    : "flex flex-col space-y-4"
                }>
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className={`group cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 ${
                        viewMode === 'list' ? 'flex flex-row h-32 md:h-40' : 'flex flex-col'
                      }`}
                      onClick={() => openLightbox(items, item)}
                    >
                      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3 min-w-[120px] h-full' : 'w-full aspect-[4/3]'}`}>
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm">
                              <Play className="w-6 h-6 text-white" fill="white" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className={`p-4 flex flex-col justify-center ${viewMode === 'list' ? 'w-2/3' : 'w-full'}`}>
                        <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{item.type === 'video' ? 'فيديو' : 'صورة'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
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
        title="إضافة عمل جديد"
      />
    </div>
  );
}
