// =========================================
// I18N PROVIDER - SOCIAL BUFFER
// =========================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// =========================================
// INTERFACES
// =========================================

interface Translation {
  [key: string]: string | Translation; }

interface Locale {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
  thousands: string;
  currency: string; };

}

interface I18nContextType {
  // Estado
  currentLocale: string;
  availableLocales: Locale[];
  translations: Translation;
  isLoading: boolean;
  error: string | null;
  // Ações
  setLocale?: (e: any) => void;
  loadTranslations: (locale: string) => Promise<void>;
  addTranslations?: (e: any) => void;
  // Utilitários
  t: (key: string, params?: Record<string, any>) => string;
  formatDate: (date: Date, format?: string) => string;
  formatTime: (date: Date, format?: string) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatPlural: (count: number, singular: string, plural: string) => string; }

interface I18nProviderProps {
  children: React.ReactNode;
  defaultLocale?: string;
  fallbackLocale?: string;
  translations?: Record<string, Translation>;
  customLocales?: Locale[]; }

// =========================================
// LOCALES PREDEFINIDOS
// =========================================

const defaultLocales: Locale[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: 'USD'
    } ,
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: 'BRL'
    } ,
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: 'EUR'
    } ,
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currency: 'EUR'
    } ,
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: 'EUR'
    } ,
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: 'SAR'
    } ];

// =========================================
// TRADUÇÕES PREDEFINIDAS
// =========================================

const defaultTranslations: Record<string, Translation> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      export: 'Export',
      import: 'Import',
      refresh: 'Refresh',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      open: 'Open',
      yes: 'Yes',
      no: 'No',
      ok: 'OK'
    },
    socialBuffer: {
      title: 'Social Buffer',
      description: 'Manage your social media presence',
      dashboard: 'Dashboard',
      posts: 'Posts',
      schedules: 'Schedules',
      hashtags: 'Hashtags',
      links: 'Links',
      media: 'Media',
      analytics: 'Analytics',
      engagement: 'Engagement',
      accounts: 'Accounts',
      settings: 'Settings'
    },
    posts: {
      title: 'Posts',
      create: 'Create Post',
      edit: 'Edit Post',
      delete: 'Delete Post',
      publish: 'Publish',
      schedule: 'Schedule',
      draft: 'Draft',
      published: 'Published',
      scheduled: 'Scheduled',
      failed: 'Failed',
      content: 'Content',
      platform: 'Platform',
      status: 'Status',
      createdAt: 'Created At',
      publishedAt: 'Published At',
      scheduledAt: 'Scheduled At'
    },
    accounts: {
      title: 'Accounts',
      connect: 'Connect Account',
      disconnect: 'Disconnect',
      connected: 'Connected',
      disconnected: 'Disconnected',
      platform: 'Platform',
      followers: 'Followers',
      posts: 'Posts',
      lastActivity: 'Last Activity'
    },
    analytics: {
      title: 'Analytics',
      metrics: 'Metrics',
      engagement: 'Engagement',
      reach: 'Reach',
      impressions: 'Impressions',
      clicks: 'Clicks',
      shares: 'Shares',
      likes: 'Likes',
      comments: 'Comments',
      period: 'Period',
      today: 'Today',
      week: 'Week',
      month: 'Month',
      year: 'Year'
    } ,
  pt: {
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      cancel: 'Cancelar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      create: 'Criar',
      update: 'Atualizar',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      export: 'Exportar',
      import: 'Importar',
      refresh: 'Atualizar',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      close: 'Fechar',
      open: 'Abrir',
      yes: 'Sim',
      no: 'Não',
      ok: 'OK'
    },
    socialBuffer: {
      title: 'Social Buffer',
      description: 'Gerencie sua presença nas redes sociais',
      dashboard: 'Dashboard',
      posts: 'Posts',
      schedules: 'Agendamentos',
      hashtags: 'Hashtags',
      links: 'Links',
      media: 'Mídia',
      analytics: 'Analytics',
      engagement: 'Engajamento',
      accounts: 'Contas',
      settings: 'Configurações'
    },
    posts: {
      title: 'Posts',
      create: 'Criar Post',
      edit: 'Editar Post',
      delete: 'Excluir Post',
      publish: 'Publicar',
      schedule: 'Agendar',
      draft: 'Rascunho',
      published: 'Publicado',
      scheduled: 'Agendado',
      failed: 'Falhou',
      content: 'Conteúdo',
      platform: 'Plataforma',
      status: 'Status',
      createdAt: 'Criado em',
      publishedAt: 'Publicado em',
      scheduledAt: 'Agendado para'
    },
    accounts: {
      title: 'Contas',
      connect: 'Conectar Conta',
      disconnect: 'Desconectar',
      connected: 'Conectado',
      disconnected: 'Desconectado',
      platform: 'Plataforma',
      followers: 'Seguidores',
      posts: 'Posts',
      lastActivity: 'Última Atividade'
    },
    analytics: {
      title: 'Analytics',
      metrics: 'Métricas',
      engagement: 'Engajamento',
      reach: 'Alcance',
      impressions: 'Impressões',
      clicks: 'Cliques',
      shares: 'Compartilhamentos',
      likes: 'Curtidas',
      comments: 'Comentários',
      period: 'Período',
      today: 'Hoje',
      week: 'Semana',
      month: 'Mês',
      year: 'Ano'
    } };

// =========================================
// CONTEXT
// =========================================

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// =========================================
// PROVIDER
// =========================================

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  defaultLocale = 'en',
  fallbackLocale = 'en',
  translations = {} as any,
  customLocales = [] as unknown[]
}) => {
  const [currentLocale, setCurrentLocale] = useState(defaultLocale);

  const [availableLocales] = useState<Locale[]>([...defaultLocales, ...customLocales]);

  const [translationsState, setTranslations] = useState<Translation>({});

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ===== INICIALIZAÇÃO =====

  useEffect(() => {
    const savedLocale = localStorage.getItem('social-buffer-locale');

    const locale = savedLocale || defaultLocale;
    
    setCurrentLocale(locale);

    loadTranslations(locale);

  }, [defaultLocale]);

  // ===== CARREGAR TRADUÇÕES =====

  const loadTranslations = useCallback(async (locale: string) => {
    setIsLoading(true);

    setError(null);

    try {
      // Carregar traduções padrão
      const defaultTranslation = defaultTranslations[locale] || defaultTranslations[fallbackLocale];
      
      // Carregar traduções customizadas
      const customTranslation = translations[locale] || {};

      // Mesclar traduções
      const mergedTranslations = {
        ...defaultTranslation,
        ...customTranslation};

      setTranslations(mergedTranslations);

      // Aplicar locale ao documento
      document.documentElement.lang = locale;
      document.documentElement.dir = availableLocales.find(l => l.code === locale)?.direction || 'ltr';
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load translations');

    } finally {
      setIsLoading(false);

    } , [fallbackLocale, translations, availableLocales]);

  // ===== ADICIONAR TRADUÇÕES =====

  const addTranslations = useCallback((locale: string, newTranslations: Translation) => {
    setTranslations(prev => ({
      ...prev,
      ...newTranslations
    }));

  }, []);

  // ===== TRADUZIR =====

  const t = useCallback((key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');

    let value: unknown = translationsState;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback para inglês se não encontrar a tradução
        value = defaultTranslations[fallbackLocale];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Retornar a chave se não encontrar tradução
          } break;
      } if (typeof value !== 'string') {
      return key;
    }
    
    // Substituir parâmetros
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: unknown, param: unknown) => {
        return params[param] || match;
      });

    }
    
    return value;
  }, [translationsState, fallbackLocale]);

  // ===== FORMATAR DATA =====

  const formatDate = useCallback((date: Date, format?: string): string => {
    const locale = availableLocales.find(l => l.code === currentLocale);

    const dateFormat = format || locale?.dateFormat || 'MM/dd/yyyy';
    
    try {
      return new Intl.DateTimeFormat(currentLocale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);

    } catch {
      return date.toLocaleDateString();

    } , [currentLocale, availableLocales]);

  // ===== FORMATAR HORA =====

  const formatTime = useCallback((date: Date, format?: string): string => {
    const locale = availableLocales.find(l => l.code === currentLocale);

    const timeFormat = format || locale?.timeFormat || 'HH:mm';
    
    try {
      return new Intl.DateTimeFormat(currentLocale, {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);

    } catch {
      return date.toLocaleTimeString();

    } , [currentLocale, availableLocales]);

  // ===== FORMATAR NÚMERO =====

  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return new Intl.NumberFormat(currentLocale, options).format(number);

    } catch {
      return number.toString();

    } , [currentLocale]);

  // ===== FORMATAR MOEDA =====

  const formatCurrency = useCallback((amount: number, currency?: string): string => {
    const locale = availableLocales.find(l => l.code === currentLocale);

    const currencyCode = currency || locale?.numberFormat.currency || 'USD';
    
    try {
      return new Intl.NumberFormat(currentLocale, {
        style: 'currency',
        currency: currencyCode
      }).format(amount);

    } catch {
      return `${currencyCode} ${amount}`;
    } , [currentLocale, availableLocales]);

  // ===== FORMATAR PLURAL =====

  const formatPlural = useCallback((count: number, singular: string, plural: string): string => {
    try {
      const rules = new Intl.PluralRules(currentLocale);

      const rule = rules.select(count);

      switch (rule) {
        case 'one':
          return singular;
        default:
          return plural;
      } catch {
      return count === 1 ? singular : plural;
    } , [currentLocale]);

  // ===== CONTEXT VALUE =====

  const contextValue: I18nContextType = {
    currentLocale,
    availableLocales,
    translations: translationsState,
    isLoading,
    error,
    setLocale: (locale: string) => {
      setCurrentLocale(locale);

      loadTranslations(locale);

      localStorage.setItem('social-buffer-locale', locale);

    },
    loadTranslations,
    addTranslations,
    t,
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
    formatPlural};

  return (
            <I18nContext.Provider value={ contextValue } />
      {children}
    </I18nContext.Provider>);};

// =========================================
// HOOK
// =========================================

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');

  }
  return context;};

// =========================================
// COMPONENTES DE I18N
// =========================================

interface LocaleSelectorProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LocaleSelector: React.FC<LocaleSelectorProps> = ({ className = ''    }) => {
  const { currentLocale, availableLocales, setLocale } = useI18n();

  return (
        <>
      <div className={`locale-selector ${className} `}>
      </div><label htmlFor="locale-select" className="block text-sm font-medium mb-2" />
        Idioma
      </label>
      <select
        id="locale-select"
        value={ currentLocale }
        onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setLocale(e.target.value) }
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {(availableLocales || []).map((locale: unknown) => (
          <option key={locale.code} value={ locale.code } />
            {locale.nativeName}
          </option>
        ))}
      </select>
    </div>);};

interface TransProps {
  i18nKey: string;
  params?: Record<string, any>;
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties; }

export const Trans: React.FC<TransProps> = ({ i18nKey, params, fallback, className = ''    }) => {
  const { t } = useI18n();

  const translation = t(i18nKey, params);

  const displayText = translation !== i18nKey ? translation : (fallback || i18nKey);

  return <span className={className } >{displayText}</span>;};

// =========================================
// HOOKS ESPECIALIZADOS
// =========================================

export const useTranslation = () => {
  const { t } = useI18n();

  return t;};

export const useFormatting = () => {
  const { formatDate, formatTime, formatNumber, formatCurrency, formatPlural } = useI18n();

  return {
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
    formatPlural};
};

export const useLocale = () => {
  const { currentLocale, availableLocales, setLocale } = useI18n();

  return {
    currentLocale,
    availableLocales,
    setLocale};
};

// =========================================
// UTILITÁRIOS
// =========================================

export const createTranslation = (translations: Translation) => {
  return translations;};

export const mergeTranslations = (...translations: Translation[]): Translation => {
  return translations.reduce((acc: unknown, translation: unknown) => ({
    ...acc,
    ...translation
  }), {});};

export default I18nProvider;
