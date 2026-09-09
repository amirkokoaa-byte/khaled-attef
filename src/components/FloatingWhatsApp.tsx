import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
}

export function FloatingWhatsApp({ phoneNumber }: FloatingWhatsAppProps) {
  if (!phoneNumber) return null;

  // Format number: remove +, spaces, dashes
  const formattedNumber = phoneNumber.replace(/[\s\-\+]/g, '');
  const whatsappUrl = `https://wa.me/${formattedNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-[100] bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
      title="تواصل عبر واتساب"
    >
      <MessageCircle className="w-8 h-8" />
      <div className="absolute left-full ml-4 whitespace-nowrap bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
        تواصل معي
        {/* Triangle pointer */}
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-[6px] border-transparent border-r-slate-800" />
      </div>
    </a>
  );
}
