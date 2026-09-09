import { Building2 } from 'lucide-react';
import { useAppContext } from '../context';

export function AboutCompany() {
  const { t } = useAppContext();

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="bg-slate-800 rounded-3xl shadow-xl border border-slate-700 overflow-hidden relative p-8 md:p-10 text-center">
        <div className="mx-auto w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          {t("نبذة عن الشركة", "About the Company")}
        </h2>
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium">
          {t(
            "تأسست شركة سوفت روز كشركة مساهمة برأس مال مصرى 100% فى عام 1974 حتى تطورت شركة سوفت روز لتصبح من أقوى العلامات التجارية فى مصر والشرق الاوسط",
            "Soft Rose Company was established as an Egyptian joint stock company with 100% Egyptian capital in 1974, until it developed to become one of the strongest brands in Egypt and the Middle East."
          )}
        </p>
      </div>
    </section>
  );
}
