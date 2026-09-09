import { useState, useEffect } from 'react';

export function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = time.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex flex-col items-end text-sm sm:text-base font-medium text-slate-800 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-slate-200">
      <span dir="rtl">{formattedDate}</span>
      <span dir="ltr">{formattedTime}</span>
    </div>
  );
}
