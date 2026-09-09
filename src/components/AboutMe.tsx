import React, { useState } from 'react';
import { Mail, Phone, Globe, Facebook, Briefcase, MapPin, Building2, Clock, Map, Linkedin, Edit2 } from 'lucide-react';
import type { PortfolioData } from '../types';
import { EditAboutMeModal } from './EditAboutMeModal';

interface AboutMeProps {
  data: PortfolioData['aboutMe'];
  isAdmin: boolean;
  onUpdate: (data: PortfolioData['aboutMe']) => void;
}

export function AboutMe({ data, isAdmin, onUpdate }: AboutMeProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fallback for legacy data
  const jobs = data.jobs && data.jobs.length > 0 ? data.jobs : [{ title: data.jobTitle, duration: data.yearsOfExperience }];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8" dir="rtl">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
        
        {/* Header Name & Title */}
        <div className="text-center p-8 md:p-10 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 relative">
          {isAdmin && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-4 left-4 p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold shadow-sm border border-indigo-100"
            >
              <Edit2 className="w-4 h-4" />
              تعديل البيانات
            </button>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            {data.name}
          </h1>
          <p className="text-xl text-indigo-600 font-medium">
            {jobs[0]?.title}
          </p>
        </div>

        <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Professional Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              البيانات المهنية
            </h2>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">جهة العمل</p>
                  <p className="font-medium text-slate-800">{data.company || 'مستقل'}</p>
                </div>
              </div>

              {jobs.map((job, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{job.title}</p>
                    <p className="font-medium text-slate-800">{job.duration || 'غير محدد'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-indigo-500" />
              معلومات التواصل
            </h2>
            
            <div className="space-y-5">
              {data.phoneNumbers.map((phone, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">رقم الهاتف {index + 1}</p>
                    <p className="font-medium text-slate-800" dir="ltr">{phone}</p>
                  </div>
                </div>
              ))}

              {data.emails.map((email, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">البريد الإلكتروني {index + 1}</p>
                    <a href={`mailto:${email}`} className="font-medium text-sky-600 hover:underline" dir="ltr">{email}</a>
                  </div>
                </div>
              ))}

              <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100 flex-wrap">
                {data.facebookLink && (
                  <a href={data.facebookLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex-1 min-w-[3rem] flex justify-center group" title="فيسبوك">
                    <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {data.linkedInLink && (
                  <a href={data.linkedInLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors flex-1 min-w-[3rem] flex justify-center group" title="لينكد إن">
                    <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {data.websiteLink && (
                  <a href={data.websiteLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors flex-1 min-w-[3rem] flex justify-center group" title="الموقع الإلكتروني">
                    <Globe className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {data.mapLink && (
                  <a href={data.mapLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors flex-1 min-w-[3rem] flex justify-center group" title="الموقع على الخريطة">
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
