const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Add handleDeleteExhibition to App.tsx
if (!appCode.includes('handleDeleteExhibition')) {
  appCode = appCode.replace(
    'const handleAddExhibition = (item: ExhibitionItem) => updateDataAndSync({ ...data, exhibitions: [item, ...data.exhibitions] });',
    'const handleAddExhibition = (item: ExhibitionItem) => updateDataAndSync({ ...data, exhibitions: [item, ...data.exhibitions] });\n  const handleDeleteExhibition = (id: string) => updateDataAndSync({ ...data, exhibitions: data.exhibitions.filter(item => item.id !== id) });'
  );
  appCode = appCode.replace(
    'onAddExhibition={handleAddExhibition}',
    'onAddExhibition={handleAddExhibition}\n              onDeleteExhibition={handleDeleteExhibition}'
  );
  fs.writeFileSync('src/App.tsx', appCode);
}

// Update ExhibitionSection.tsx
let exCode = fs.readFileSync('src/components/ExhibitionSection.tsx', 'utf8');
if (!exCode.includes('onDeleteExhibition')) {
  // Add icon import
  exCode = exCode.replace(
    "import { Plus, Play } from 'lucide-react';",
    "import { Plus, Play, Trash2 } from 'lucide-react';"
  );
  
  // Add prop
  exCode = exCode.replace(
    'onAddExhibition: (item: ExhibitionItem) => void;',
    'onAddExhibition: (item: ExhibitionItem) => void;\n  onDeleteExhibition: (id: string) => void;'
  );
  
  exCode = exCode.replace(
    'export function ExhibitionSection({ exhibitions, selectedCountry, isAdmin, onAddExhibition }: ExhibitionSectionProps) {',
    'export function ExhibitionSection({ exhibitions, selectedCountry, isAdmin, onAddExhibition, onDeleteExhibition }: ExhibitionSectionProps) {'
  );
  
  // Add delete handler
  exCode = exCode.replace(
    'const openLightbox = (items: MediaItem[], itemToOpen: MediaItem) => {',
    `const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا المعرض بالكامل؟')) {
      onDeleteExhibition(id);
    }
  };

  const openLightbox = (items: MediaItem[], itemToOpen: MediaItem) => {`
  );
  
  // Add trash button
  const newExCard = `
              <div key={exhibition.id} className="mb-12 last:mb-0 relative group/exhibition">
                {isAdmin && (
                  <div className="absolute top-0 left-0 z-20 opacity-100 md:opacity-0 md:group-hover/exhibition:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => handleDelete(e, exhibition.id)}
                      className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-all shadow-sm"
                      title="حذف المعرض"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}`;
                
  exCode = exCode.replace(
    /<div key=\{exhibition\.id\} className="mb-12 last:mb-0">/,
    newExCard
  );
  
  fs.writeFileSync('src/components/ExhibitionSection.tsx', exCode);
}
