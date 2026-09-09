import { useAppContext } from "../context";
import React, { useState } from 'react';
import { Mail, Phone, Globe, Facebook, Briefcase, MapPin, Building2, Clock, Map, Linkedin, Edit2, MessageCircle } from 'lucide-react';
import type { PortfolioData } from '../types';
import { EditAboutMeModal } from './EditAboutMeModal';

interface AboutMeProps {
  data: PortfolioData['aboutMe'];
  isAdmin: boolean;
  onUpdate: (data: PortfolioData['aboutMe']) => void;
}

export function AboutMe({ data, isAdmin, onUpdate }: AboutMeProps) {
  const { t } = useAppContext();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fallback for legacy data
  const jobs = data.jobs && data.jobs.length > 0 ? data.jobs : [{ title: data.jobTitle, duration: data.yearsOfExperience }];

  const formatWhatsAppLink = (phone: string) => {
    // If admin set a specific WA number, you might want to use it globally, 
    // but here we use the clicked phone number itself.
    const clean = phone.replace(/[\s\-\+]/g, '');
    return `https://wa.me/${clean}`;
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-slate-800 rounded-3xl shadow-xl border border-slate-700 overflow-hidden relative">
        
        {/* Header Name & Title */}
        <div className="text-center p-8 md:p-10 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-700 relative">
          {isAdmin && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="magnetic absolute top-4 left-4 p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold shadow-sm border border-indigo-500/20"
            >
              <Edit2 className="w-4 h-4" />
              {t('تعديل البيانات', 'Edit Info')}
            </button>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {data.name}
          </h1>
          <p className="text-xl text-indigo-400 font-medium">
            {jobs[0]?.title}
          </p>
        </div>

        <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Professional Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 border-b border-slate-700 pb-3">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              {t('البيانات المهنية', 'Professional Info')}
            </h2>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">{t('جهة العمل', 'Company')}</p>
                  <p className="font-medium text-slate-200">{data.company || t('مستقل', 'Freelance')}</p>
                </div>
              </div>

              {jobs.map((job, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{job.title}</p>
                    <p className="font-medium text-slate-200">{job.duration || t('غير محدد', 'Not specified')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 border-b border-slate-700 pb-3">
              <MapPin className="w-5 h-5 text-indigo-400" />
              {t('معلومات التواصل', 'Contact Info')}
            </h2>
            
            <div className="space-y-5">
              {data.phoneNumbers.map((phone, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{t('رقم الهاتف', 'Phone Number')} {index + 1}</p>
                    <a 
                      href={formatWhatsAppLink(phone)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="magnetic font-medium text-slate-200 hover:text-emerald-400 transition-colors flex items-center gap-2" 
                      dir="ltr"
                      title={t('تواصل عبر واتساب', 'Contact via WhatsApp')}
                    >
                      <MessageCircle className="w-4 h-4 opacity-0 hover:opacity-100 transition-opacity" />
                      {phone}
                    </a>
                  </div>
                </div>
              ))}

              {data.emails.map((email, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{t('البريد الإلكتروني', 'Email')} {index + 1}</p>
                    <a href={`mailto:${email}`} className="font-medium text-sky-400 hover:text-sky-300 hover:underline" dir="ltr">{email}</a>
                  </div>
                </div>
              ))}

              <div className="flex gap-4 mt-8 pt-6 border-t border-slate-700 flex-wrap">
                {data.facebookLink && (
                  <a href={data.facebookLink} target="_blank" rel="noopener noreferrer" className="magnetic p-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-colors flex-1 min-w-[3rem] flex justify-center group" title="Facebook">
                    <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {data.linkedInLink && (
                  <a href={data.linkedInLink} target="_blank" rel="noopener noreferrer" className="magnetic p-3 bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600/20 transition-colors flex-1 min-w-[3rem] flex justify-center group" title="LinkedIn">
                    <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {data.websiteLink && (
                  <a href={data.websiteLink} target="_blank" rel="noopener noreferrer" className="magnetic p-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors flex-1 min-w-[3rem] flex justify-center group" title="Website">
                    <Globe className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {data.mapLink && (
                  <a href={data.mapLink} target="_blank" rel="noopener noreferrer" className="magnetic p-3 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-colors flex-1 min-w-[3rem] flex justify-center group" title="Location">
                    <Map className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditAboutMeModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        data={data} 
        onSave={onUpdate} 
      />
    </section>
  );
}
