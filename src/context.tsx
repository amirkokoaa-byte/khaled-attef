import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';
type Theme = 'default' | 'navy';

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  t: (arText: string, enText: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('app-lang') as Language) || 'ar';
    }
    return 'ar';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('app-theme') as Theme) || 'default';
    }
    return 'default';
  });

  useEffect(() => {
    localStorage.setItem('app-lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const t = (arText: string, enText: string) => {
    return lang === 'ar' ? arText : enText;
  };

  return (
    <AppContext.Provider value={{ lang, setLang, theme, setTheme, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
