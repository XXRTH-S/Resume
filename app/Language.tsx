'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import thai from './thai.json';

type Language = 'en' | 'th';
const translations: Record<string, string> = thai;
const LanguageContext = createContext({ language: 'en' as Language, toggleLanguage: () => {}, t: (text: string) => text });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  useEffect(() => {
    try { if (localStorage.getItem('portfolio-language') === 'th') setLanguage('th'); } catch {}
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  function toggleLanguage() {
    const next = language === 'en' ? 'th' : 'en';
    setLanguage(next);
    try { localStorage.setItem('portfolio-language', next); } catch {}
  }
  function t(text: string) { return language === 'th' ? translations[text] ?? text : text; }
  return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
