/**
 * Hook useTranslation - Sistema de Tradução e Internacionalização
 *
 * @description
 * Sistema completo de tradução e internacionalização (i18n) para a aplicação.
 * Fornece o Provider TranslationProvider, hooks useTranslation e useT para
 * tradução de textos, e gerenciamento de idioma (português, inglês, etc.).
 *
 * Funcionalidades principais:
 * - Múltiplos idiomas suportados (pt, en, etc.)
 * - Tradução de chaves aninhadas (ex: 'common.save')
 * - Substituição de parâmetros em traduções
 * - Persistência de idioma preferido no localStorage
 * - Context API para acesso global
 * - Hooks useTranslation e useT para uso simples
 *
 * @module hooks/useTranslation
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { TranslationProvider, useTranslation } from '@/hooks/useTranslation';
 *
 * <TranslationProvider />
 *   <App / />
 * </TranslationProvider>
 *
 * const { t, language, setLanguage } = useTranslation();

 * <p>{t('common.save')}</p>
 * ```
 */

import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { translations, Language, Translation } from '../i18n/translations';

interface TranslationContextType {
  language: Language;
  setLanguage?: (e: any) => void;
  t: Translation;
  translate: (key: string, params?: Record<string, string | number>) => string;
  changeLanguage??: (e: any) => void;
  currentLanguage?: Language; }

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined,);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children,
   }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("xwin-language");

    return (stored as Language) || "pt";
  });

  useEffect(() => {
    localStorage.setItem("xwin-language", language);

    document.documentElement.lang = language;
  }, [language]);

  const translate = (
    key: string,
    params?: Record<string, string | number>,
  ): string => {
    const keys = key.split(".");

    let value: unknown = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    if (!value) {
      return key;
    }

    if (typeof value !== "string") {
      return key;
    }

    if (params) {
      return value.replace(/\{(\w+)\}/g, (match: string, param: string) => {
        return params[param]?.toString() || match;
      });

    }

    return value;};

  const value = {
    language,
    setLanguage,
    t: translations[language],
    translate,
    changeLanguage: setLanguage,
    currentLanguage: language,};

  return (
            <TranslationContext.Provider value={ value } />
      {children}
    </TranslationContext.Provider>);};

export const useTranslation = () => {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");

  }
  return context;};

// Hook simplificado para componentes que só precisam da função de tradução
export const useT = () => {
  const { translate, t } = useTranslation();

  return { t: translate, translations: t};
};

export default useTranslation;
