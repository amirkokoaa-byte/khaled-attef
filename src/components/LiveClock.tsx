import { useState, useEffect } from 'react';
import { useAppContext } from '../context';

export function LiveClock() {
  const { lang } = useAppContext();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';

  const formattedDate = time.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = time.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex flex-row items-center gap-3 text-sm sm:text-base font-bold text-slate-200 bg-slate-800/80 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-slate-700">
      <span dir={lang === 'ar' ? 'rtl' : 'ltr'}>{formattedDate}</span>
      <span className="w-px h-4 bg-slate-600"></span>
      <span dir="ltr">{formattedTime}</span>
    </div>
  );
}
