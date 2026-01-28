/**
 * Hook de Tradução - xWin Dash
 * Sistema unificado de i18n para todos os componentes
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { translations, Language, Translation } from '../i18n/translations';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
  translate: (key: string, params?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('xwin-language');
    return (stored as Language) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('xwin-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const translate = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }
    
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match: string, param: string) => {
        return params[param]?.toString() || match;
      });
    }
    
    return value;
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
    translate,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Hook simplificado para componentes que só precisam da função de tradução
export const useT = () => {
  const { translate, t } = useTranslation();
  return { t: translate, translations: t };
};

export default useTranslation;
