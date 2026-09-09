import { useState, useRef } from 'react';
import { Settings, X, LogOut, KeyRound } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AdminAuthProps {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

export function AdminAuth({ isAdmin, setIsAdmin }: AdminAuthProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  
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

  const handleLogout = () => {
    setIsAdmin(false);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 p-2.5 bg-white/80 hover:bg-white text-slate-700 rounded-full shadow-md backdrop-blur-md transition-all hover:scale-110"
        title="إعدادات المدير"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {isAdmin ? 'إعدادات المدير' : 'تسجيل الدخول'}
              </h3>
              <button onClick={() => { setIsOpen(false); setError(''); }} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {!isAdmin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center tracking-widest text-lg"
                      placeholder="••••"
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-colors"
                  >
                    دخول
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        تغيير كلمة المرور
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-center tracking-widest text-lg"
                          placeholder="••••"
                        />
                        <button
                          type="submit"
                          className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                        >
                          حفظ
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="border-t border-slate-100 pt-4">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2.5 rounded-xl font-bold transition-colors border border-red-200"
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
