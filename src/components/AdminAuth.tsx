import React, { useState } from 'react';
import { Settings, X, LogOut, KeyRound, Phone, Users, Eye } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { PortfolioData } from '../types';

interface AdminAuthProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  data: PortfolioData;
  onUpdateData: (data: PortfolioData) => void;
}

export function AdminAuth({ isAdmin, setIsAdmin, data, onUpdateData }: AdminAuthProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  
  const [whatsappNumber, setWhatsappNumber] = useState(data.aboutMe.whatsappNumber || '');
  const [baseVisitorCount, setBaseVisitorCount] = useState(data.baseVisitorCount?.toString() || '0');

  const [storedPassword, setStoredPassword] = useLocalStorage('admin-password-v1', '0000');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === storedPassword) {
      setIsAdmin(true);
      setIsOpen(false);
      setPassword('');
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length > 0) {
      setStoredPassword(newPassword);
      setNewPassword('');
      alert('تم تغيير كلمة المرور بنجاح');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData({
      ...data,
      aboutMe: {
        ...data.aboutMe,
        whatsappNumber
      },
      baseVisitorCount: parseInt(baseVisitorCount) || 0
    });
    alert('تم حفظ الإعدادات');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-16 md:left-20 z-50 p-2.5 bg-slate-800/90 text-white rounded-full shadow-lg backdrop-blur-md border border-slate-700"
        title="إعدادات المدير"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-slate-900 rounded-2xl shadow-xl w-full max-w-sm overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-800">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
              <h3 className="font-bold text-white">
                {isAdmin ? 'إعدادات المدير' : 'تسجيل الدخول'}
              </h3>
              <button onClick={() => { setIsOpen(false); setError(''); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {!isAdmin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">كلمة المرور</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center tracking-widest text-lg"
                      placeholder="••••"
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  <button
                    type="submit"
                    className="magnetic w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    دخول
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Stats Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                      <Users className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{data.visitorCount || 0}</div>
                      <div className="text-xs text-slate-400">الزوار الفعليين</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                      <Eye className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{data.mediaViewCount || 0}</div>
                      <div className="text-xs text-slate-400">مشاهدات الأعمال</div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4 border-t border-slate-800 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        رقم الواتساب
                      </label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-left"
                        dir="ltr"
                        placeholder="e.g. 201234567890"
                      />
                      <p className="text-xs text-slate-500 mt-1">أدخل الرقم متضمناً كود الدولة بدون + أو مسافات</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        تعديل رقم الزوار (يضاف للرقم الفعلي)
                      </label>
                      <input
                        type="number"
                        value={baseVisitorCount}
                        onChange={(e) => setBaseVisitorCount(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-left"
                        dir="ltr"
                      />
                    </div>

                    <button
                      type="submit"
                      className="magnetic w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                    >
                      حفظ الإعدادات
                    </button>
                  </form>

                  <form onSubmit={handleChangePassword} className="space-y-4 border-t border-slate-800 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        تغيير كلمة المرور
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center tracking-widest text-lg"
                          placeholder="••••"
                        />
                        <button
                          type="submit"
                          className="magnetic bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                        >
                          تغيير
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="border-t border-slate-800 pt-4">
                    <button
                      onClick={handleLogout}
                      className="magnetic w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 py-2.5 rounded-xl font-bold transition-colors border border-red-500/30"
                    >
                      <LogOut className="w-5 h-5" />
                      تسجيل خروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
