import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'vi' | 'en';

interface LanguageContextType {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  toggleLang: () => void;
  t: <T = string>(vi: T, en: T) => T;
}

const STORAGE_KEY = 'cotu_heritage_lang_v1';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'vi') return saved;
    } catch {
      // ignore storage errors
    }
    return 'vi';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore storage errors
    }
  }, [lang]);

  const setLang = (newLang: AppLanguage) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const t = <T = string,>(vi: T, en: T): T => {
    return lang === 'en' ? en : vi;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

