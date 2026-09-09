const fs = require('fs');
let code = fs.readFileSync('src/components/ManageBannersModal.tsx', 'utf8');

code = code.replace(
  'interface ManageBannersModalProps {\n  isOpen: boolean;',
  'interface ManageBannersModalProps {\n  isOpen: boolean;\n  bannerInterval?: number;'
);

code = code.replace(
  '  onSave: (banners: BannerImage[]) => void;\n}',
  '  onSave: (banners: BannerImage[], interval: number) => void;\n}'
);

code = code.replace(
  'export function ManageBannersModal({ isOpen, onClose, banners, onSave }: ManageBannersModalProps) {',
  'export function ManageBannersModal({ isOpen, onClose, banners, bannerInterval = 5000, onSave }: ManageBannersModalProps) {'
);

code = code.replace(
  'const [localBanners, setLocalBanners] = useState<BannerImage[]>(banners);',
  'const [localBanners, setLocalBanners] = useState<BannerImage[]>(banners);\n  const [localInterval, setLocalInterval] = useState(bannerInterval / 1000); // in seconds'
);

// Add the interval input to the modal
const intervalHTML = `
          {localBanners.length > 1 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-white font-medium text-sm">{t("المدة بين كل صورة والأخرى", "Duration between images")}</h4>
                <p className="text-slate-400 text-xs mt-1">{t("بالثواني", "In seconds")}</p>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min={1} 
                  max={20} 
                  step={0.5} 
                  value={localInterval}
                  onChange={(e) => setLocalInterval(parseFloat(e.target.value))}
                  className="w-32 accent-indigo-500"
                />
                <span className="text-white font-bold w-12 text-center bg-slate-900 py-1 rounded-md border border-slate-700">{localInterval}s</span>
              </div>
            </div>
          )}
          
          {localBanners.length === 0 ? (
`;

code = code.replace(
  '{localBanners.length === 0 ? (',
  intervalHTML
);

code = code.replace(
  'onClick={() => { onSave(localBanners); onClose(); }}',
  'onClick={() => { onSave(localBanners, localInterval * 1000); onClose(); }}'
);

fs.writeFileSync('src/components/ManageBannersModal.tsx', code);
