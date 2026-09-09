const fs = require('fs');
let code = fs.readFileSync('src/components/ImageCropper.tsx', 'utf8');

// Add state
code = code.replace(
  'const [zoom, setZoom] = useState(1);',
  'const [zoom, setZoom] = useState(1);\n  const [isFreeCrop, setIsFreeCrop] = useState(false);'
);

// Update aspect ratio in Cropper component
code = code.replace(
  'aspect={aspectRatio}',
  'aspect={isFreeCrop ? undefined : aspectRatio}'
);

// Add the toggle switch
const toggleHTML = `
          {aspectRatio && aspectRatio !== 1 && (
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isFreeCrop}
                  onChange={(e) => setIsFreeCrop(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="mr-3 text-sm font-medium text-slate-300">
                  عرض الصورة بالكامل (إلغاء تقييد الأبعاد)
                </span>
              </label>
            </div>
          )}
          <div className="flex gap-3 justify-end">`;

code = code.replace(
  '<div className="flex gap-3 justify-end">',
  toggleHTML
);

fs.writeFileSync('src/components/ImageCropper.tsx', code);
