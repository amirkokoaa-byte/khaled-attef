import { useAppContext } from "../context";
import React, { useState, useMemo, useRef } from 'react';
import { LayoutGrid, List, Play, Plus, Edit2, Trash2, Info } from 'lucide-react';
import type { MediaItem } from '../types';
import { UnifiedLightbox } from './UnifiedLightbox';
import { AddMediaModal } from './AddMediaModal';
import { EditMediaModal } from './EditMediaModal';

interface PortfolioSectionProps {
  gallery: MediaItem[];
  selectedCountry: string;
  isAdmin: boolean;
  onAddMedia: (item: MediaItem) => void;
  onEditMedia: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
  uniqueCountries: string[];
}

interface MediaCardProps {
  item: MediaItem;
  viewMode: 'grid' | 'list';
  onClick: () => void;
  isAdmin: boolean;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  item, 
  viewMode, 
  onClick, 
  isAdmin, 
  onEdit, 
  onDelete 
}) => {
  const [metadata, setMetadata] = useState(item.metadata || '');
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!metadata && item.type === 'image') {
      const target = e.target as HTMLImageElement;
      setMetadata(`${target.naturalWidth}x${target.naturalHeight}`);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className={`group bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative ${
        viewMode === 'list' ? 'flex flex-row h-32 md:h-40' : 'flex flex-col'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`magnetic relative overflow-hidden cursor-pointer ${viewMode === 'list' ? 'w-1/3 min-w-[120px] h-full' : 'w-full aspect-[4/3]'}`}
        onClick={onClick}
      >
        <img 
          src={item.thumbnailUrl} 
          alt={item.title} 
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isHovered && item.type === 'video' ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {/* Smart Hover Preview Video */}
        {item.type === 'video' && (
          <video
            ref={videoRef}
            src={item.url}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {item.type === 'video' && !isHovered && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm">
              <Play className="w-6 h-6 text-white" fill="white" />
            </div>
          </div>
        )}
      </div>
      
      <div className={`p-4 flex flex-col justify-center ${viewMode === 'list' ? 'w-2/3' : 'w-full'}`}>
        <h4 className="text-lg font-bold text-white transition-colors">{item.title}</h4>
        {item.subtitle && <p className="text-sm text-indigo-400 font-medium">{item.subtitle}</p>}
        <p className="text-sm text-slate-400 mt-1">{item.type === 'video' ? 'فيديو' : 'صورة'}</p>
        
        {metadata && (
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500 font-mono bg-slate-900 w-fit px-2 py-1 rounded">
            <Info className="w-3 h-3" />
            {metadata}
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="absolute top-2 left-2 flex gap-1 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={onEdit}
            className="magnetic p-1.5 bg-slate-800/90 hover:bg-slate-700 text-indigo-400 rounded-md shadow-sm backdrop-blur-sm transition-colors border border-slate-600"
            title="تعديل"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="magnetic p-1.5 bg-slate-800/90 hover:bg-slate-700 text-red-400 rounded-md shadow-sm backdrop-blur-sm transition-colors border border-slate-600"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function PortfolioSection({ gallery, selectedCountry, isAdmin, onAddMedia, onEditMedia, onDeleteMedia, uniqueCountries }: PortfolioSectionProps) {
  const { t } = useAppContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MediaItem | null>(null);
  
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

  const handleEdit = (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    setItemToEdit(item);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا العمل؟')) {
      onDeleteMedia(id);
    }
  };

  return (
    <div className="w-full flex flex-col pt-6 pb-12 space-y-10" dir="rtl">
      {/* 1. Continuous Auto-Scrolling Banner (Marquee) - Always shows all items */}
      <div className="w-full overflow-hidden bg-slate-950 py-4 relative group shadow-inner">
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
        
        {gallery.length > 0 ? (
          <div className="flex w-fit animate-marquee hover:[animation-play-state:paused]">
            {[...gallery, ...gallery, ...gallery].map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="magnetic w-48 h-32 md:w-64 md:h-40 flex-shrink-0 mx-2 rounded-xl overflow-hidden cursor-pointer relative group/item border border-slate-800"
                onClick={() => openLightbox(gallery, item)}
              >
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  {item.type === 'video' ? <Play className="w-10 h-10 text-white" /> : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 text-center py-8">لا توجد أعمال لعرضها.</div>
        )}
      </div>

      {/* 2. Controls & Gallery Area */}
      <div className="container mx-auto px-4 mt-4">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">
              {selectedCountry === 'الكل' ? 'جميع الأعمال' : `أعمال ${selectedCountry}`}
            </h2>
            {isAdmin && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="magnetic flex items-center gap-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors border border-indigo-500/20"
              >
                <Plus className="w-4 h-4" />
                إضافة عمل
              </button>
            )}
          </div>
          
          {/* Grid/List Toggle */}
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`magnetic p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-700 shadow-sm text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
              title="عرض كشبكة"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`magnetic p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-700 shadow-sm text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
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
            Object.entries(groupedGallery).map(([country, items]: [string, MediaItem[]]) => (
              <div key={country} className="space-y-6">
                <h3 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
                  <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                  {country}
                </h3>
                
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
                    : "flex flex-col space-y-4"
                }>
                  {items.map(item => (
                    <MediaCard 
                      key={item.id} 
                      item={item} 
                      viewMode={viewMode} 
                      onClick={() => openLightbox(items, item)} 
                      isAdmin={isAdmin}
                      onEdit={(e) => handleEdit(e, item)}
                      onDelete={(e) => handleDelete(e, item.id)}
                    />
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

      {itemToEdit && (
        <EditMediaModal
          isOpen={true}
          onClose={() => setItemToEdit(null)}
          item={itemToEdit}
          onSave={onEditMedia}
        />
      )}
    </div>
  );
}
