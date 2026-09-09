const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Add handleDeleteStudioItem to App.tsx
if (!appCode.includes('handleDeleteStudioItem')) {
  appCode = appCode.replace(
    'const handleAddStudioItem = (item: MediaItem) => updateDataAndSync({ ...data, studio: [item, ...data.studio] });',
    'const handleAddStudioItem = (item: MediaItem) => updateDataAndSync({ ...data, studio: [item, ...data.studio] });\n  const handleDeleteStudioItem = (id: string) => updateDataAndSync({ ...data, studio: data.studio.filter(item => item.id !== id) });'
  );
  appCode = appCode.replace(
    'onAddMedia={handleAddStudioItem}',
    'onAddMedia={handleAddStudioItem}\n              onDeleteMedia={handleDeleteStudioItem}'
  );
  fs.writeFileSync('src/App.tsx', appCode);
}

// Update StudioSection.tsx
let studioCode = fs.readFileSync('src/components/StudioSection.tsx', 'utf8');
if (!studioCode.includes('onDeleteMedia')) {
  // Add icon import
  studioCode = studioCode.replace(
    "import { Plus, Play } from 'lucide-react';",
    "import { Plus, Play, Trash2 } from 'lucide-react';"
  );
  
  // Add prop
  studioCode = studioCode.replace(
    'onAddMedia: (item: MediaItem) => void;',
    'onAddMedia: (item: MediaItem) => void;\n  onDeleteMedia: (id: string) => void;'
  );
  
  studioCode = studioCode.replace(
    'export function StudioSection({ studio, isAdmin, onAddMedia, uniqueCountries }: StudioSectionProps) {',
    'export function StudioSection({ studio, isAdmin, onAddMedia, onDeleteMedia, uniqueCountries }: StudioSectionProps) {'
  );
  
  // Add delete handler
  studioCode = studioCode.replace(
    'const openLightbox = (items: MediaItem[], itemToOpen: MediaItem) => {',
    `const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      onDeleteMedia(id);
    }
  };

  const openLightbox = (items: MediaItem[], itemToOpen: MediaItem) => {`
  );
  
  // Add trash button
  const newStudioCard = `
              <div 
                key={item.id} 
                className="group cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col relative"
                onClick={() => openLightbox(studio, item)}
              >
                {isAdmin && (
                  <button 
                    onClick={(e) => handleDelete(e, item.id)}
                    className="absolute top-2 left-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-all"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}`;
                
  studioCode = studioCode.replace(
    /<div \s*key=\{item\.id\} \s*className="group cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"\s*onClick=\{\(\) => openLightbox\(studio, item\)\}\s*>/,
    newStudioCard
  );
  
  fs.writeFileSync('src/components/StudioSection.tsx', studioCode);
}
