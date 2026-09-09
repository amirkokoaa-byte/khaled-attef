import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import type { PortfolioData, Job } from '../types';

interface EditAboutMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData['aboutMe'];
  onSave: (data: PortfolioData['aboutMe']) => void;
}

export function EditAboutMeModal({ isOpen, onClose, data, onSave }: EditAboutMeModalProps) {
  const [formData, setFormData] = useState({
    name: data.name,
    company: data.company,
    facebookLink: data.facebookLink,
    websiteLink: data.websiteLink,
    linkedInLink: data.linkedInLink || '',
    mapLink: data.mapLink || ''
  });

  const [jobs, setJobs] = useState<Job[]>(
    data.jobs && data.jobs.length > 0 
      ? data.jobs 
      : [{ title: data.jobTitle, duration: data.yearsOfExperience }]
  );

  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(data.phoneNumbers || ['']);
  const [emails, setEmails] = useState<string[]>(data.emails || ['']);
  const [whatsappNumber, setWhatsappNumber] = useState<string>(data.whatsappNumber || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...data,
      ...formData,
      jobs,
      jobTitle: jobs[0]?.title || '', // Fallback for legacy
      yearsOfExperience: jobs[0]?.duration || '', // Fallback for legacy
      phoneNumbers: phoneNumbers.filter(p => p.trim() !== ''),
      emails: emails.filter(e => e.trim() !== ''),
      whatsappNumber
    });
    onClose();
  };

  const handleAddJob = () => {
    setJobs([...jobs, { title: '', duration: '' }]);
  };

  const handleRemoveJob = (index: number) => {
    setJobs(jobs.filter((_, i) => i !== index));
  };

  const updateJob = (index: number, field: keyof Job, value: string) => {
    const newJobs = [...jobs];
    newJobs[index] = { ...newJobs[index], [field]: value };
    setJobs(newJobs);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" dir="rtl">
      <div className="bg-white text-slate-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-slate-800">تعديل البيانات الشخصية</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الاسم</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الشركة / مكان العمل</label>
              <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-slate-800">المسميات الوظيفية</h4>
              <button type="button" onClick={handleAddJob} className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1">
                <Plus className="w-4 h-4" /> إضافة وظيفة
              </button>
            </div>
            
            <div className="space-y-3">
              {jobs.map((job, index) => (
                <div key={index} className="flex gap-2 items-start bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      placeholder="المسمى الوظيفي" 
                      value={job.title} 
                      onChange={e => updateJob(index, 'title', e.target.value)} 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                      required 
                    />
                    <input 
                      type="text" 
                      placeholder="المدة (مثال: 10 سنوات) - اختياري" 
                      value={job.duration} 
                      onChange={e => updateJob(index, 'duration', e.target.value)} 
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                    />
                  </div>
                  {jobs.length > 1 && (
                    <button type="button" onClick={() => handleRemoveJob(index)} className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 rounded-md mt-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-800 border-b pb-2">بيانات الاتصال</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                  <span>أرقام الهواتف</span>
                  <button type="button" onClick={() => setPhoneNumbers([...phoneNumbers, ''])} className="text-indigo-600 text-xs font-bold">+ إضافة رقم</button>
                </label>
                <div className="space-y-2">
                  {phoneNumbers.map((phone, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" value={phone} onChange={e => {
                        const newPhones = [...phoneNumbers];
                        newPhones[idx] = e.target.value;
                        setPhoneNumbers(newPhones);
                      }} className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-left" dir="ltr" placeholder="+20 100..." />
                      {phoneNumbers.length > 1 && (
                        <button type="button" onClick={() => setPhoneNumbers(phoneNumbers.filter((_, i) => i !== idx))} className="text-red-500 p-2">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">رقم الواتساب (اختياري)</label>
                <input type="text" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-left" dir="ltr" placeholder="20100..." />
                <p className="text-xs text-slate-500 mt-1">اكتب الرقم مع كود الدولة وبدون علامة + أو مسافات</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                  <span>البريد الإلكتروني</span>
                  <button type="button" onClick={() => setEmails([...emails, ''])} className="text-indigo-600 text-xs font-bold">+ إضافة بريد</button>
                </label>
                <div className="space-y-2">
                  {emails.map((email, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="email" value={email} onChange={e => {
                        const newEmails = [...emails];
                        newEmails[idx] = e.target.value;
                        setEmails(newEmails);
                      }} className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-left" dir="ltr" placeholder="email@example.com" />
                      {emails.length > 1 && (
                        <button type="button" onClick={() => setEmails(emails.filter((_, i) => i !== idx))} className="text-red-500 p-2">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-800 border-b pb-2">الروابط ووسائل التواصل</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">فيسبوك (URL)</label>
                <input type="url" value={formData.facebookLink} onChange={e => setFormData({...formData, facebookLink: e.target.value})} className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">الموقع الإلكتروني (URL)</label>
                <input type="url" value={formData.websiteLink} onChange={e => setFormData({...formData, websiteLink: e.target.value})} className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">لينكد إن (URL)</label>
                <input type="url" value={formData.linkedInLink} onChange={e => setFormData({...formData, linkedInLink: e.target.value})} className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">رابط الموقع على الخريطة (Google Maps)</label>
                <input type="url" value={formData.mapLink} onChange={e => setFormData({...formData, mapLink: e.target.value})} className="w-full px-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-left" dir="ltr" placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
              إلغاء
            </button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
