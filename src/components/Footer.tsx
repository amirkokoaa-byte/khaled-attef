import { useAppContext } from "../context";
import { Eye } from "lucide-react";
interface FooterProps {
  visitorCount?: number;
}

export function Footer({ visitorCount }: FooterProps) {
  const { t } = useAppContext();
  return (
    <footer className="w-full py-8 mt-12 bg-slate-950 border-t border-slate-900">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4">
        {visitorCount !== undefined && (
          <div className="flex items-center gap-2 text-slate-300 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium">{t("عدد الزيارات:", "Visitor Count:")} {visitorCount}</span>
          </div>
        )}
        <p className="text-slate-400 font-medium" dir="rtl">
          {t("مع تحيات المطور A . L", "Designed by A . L")}
        </p>
      </div>
    </footer>
  );
}
