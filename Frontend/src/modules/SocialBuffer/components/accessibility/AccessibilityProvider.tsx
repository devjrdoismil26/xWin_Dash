// =========================================
// ACCESSIBILITY PROVIDER - SOCIAL BUFFER
// =========================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// =========================================
// INTERFACES
// =========================================

interface AccessibilityContextType {
  // Estado de acessibilidade
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  // Configurações
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorScheme: 'light' | 'dark' | 'high-contrast';
  focusVisible: boolean;
  // Ações
  setReducedMotion?: (e: any) => void;
  setHighContrast?: (e: any) => void;
  setLargeText?: (e: any) => void;
  setScreenReader?: (e: any) => void;
  setKeyboardNavigation?: (e: any) => void;
  setFontSize?: (e: any) => void;
  setColorScheme?: (e: any) => void;
  // Utilitários
  announceToScreenReader?: (e: any) => void;
  focusElement?: (e: any) => void;
  trapFocus?: (e: any) => void;
  releaseFocus??: (e: any) => void; }

interface AccessibilityProviderProps {
  children: React.ReactNode; }

// =========================================
// CONTEXT
// =========================================

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// =========================================
// PROVIDER
// =========================================

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children    }) => {
  // ===== ESTADO =====
  
  const [reducedMotion, setReducedMotion] = useState(false);

  const [highContrast, setHighContrast] = useState(false);

  const [largeText, setLargeText] = useState(false);

  const [screenReader, setScreenReader] = useState(false);

  const [keyboardNavigation, setKeyboardNavigation] = useState(false);

  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>('medium');

  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'high-contrast'>('light');

  const [focusVisible, setFocusVisible] = useState(false);

  // ===== DETECÇÃO AUTOMÁTICA =====

  useEffect(() => {
    // Detectar preferências do sistema
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)')};

    // Detectar screen reader
    const detectScreenReader = () => {
      const hasScreenReader = 
        window.navigator.userAgent.includes('NVDA') ||
        window.navigator.userAgent.includes('JAWS') ||
        window.navigator.userAgent.includes('VoiceOver') ||
        document.querySelector('[aria-live]')! !== null;
      
      setScreenReader(hasScreenReader);};

    // Detectar navegação por teclado
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setKeyboardNavigation(true);

        setFocusVisible(true);

      } ;

    const handleMouseDown = () => {
      setKeyboardNavigation(false);

      setFocusVisible(false);};

    // Configurar listeners
    mediaQueries.reducedMotion.addEventListener('change', (e: unknown) => setReducedMotion(e.matches));

    mediaQueries.highContrast.addEventListener('change', (e: unknown) => setHighContrast(e.matches));

    mediaQueries.colorScheme.addEventListener('change', (e: unknown) => 
      setColorScheme(e.matches ? 'dark' : 'light'));

    document.addEventListener('keydown', handleKeyDown);

    document.addEventListener('mousedown', handleMouseDown);

    // Inicializar valores
    setReducedMotion(mediaQueries.reducedMotion.matches);

    setHighContrast(mediaQueries.highContrast.matches);

    setColorScheme(mediaQueries.colorScheme.matches ? 'dark' : 'light');

    detectScreenReader();

    // Cleanup
    return () => {
      mediaQueries.reducedMotion.removeEventListener('change', (e: unknown) => setReducedMotion(e.matches));

      mediaQueries.highContrast.removeEventListener('change', (e: unknown) => setHighContrast(e.matches));

      mediaQueries.colorScheme.removeEventListener('change', (e: unknown) => 
        setColorScheme(e.matches ? 'dark' : 'light'));

      document.removeEventListener('keydown', handleKeyDown);

      document.removeEventListener('mousedown', handleMouseDown);};

  }, []);

  // ===== APLICAR ESTILOS DE ACESSIBILIDADE =====

  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar classes CSS baseadas no estado
    root.classList.toggle('reduced-motion', reducedMotion);

    root.classList.toggle('high-contrast', highContrast);

    root.classList.toggle('large-text', largeText);

    root.classList.toggle('screen-reader', screenReader);

    root.classList.toggle('keyboard-navigation', keyboardNavigation);

    root.classList.toggle('focus-visible', focusVisible);

    // Aplicar tamanho da fonte
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');

    root.classList.add(`font-${fontSize}`);

    // Aplicar esquema de cores
    root.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');

    root.classList.add(`theme-${colorScheme}`);

    // Aplicar estilos inline para contraste alto
    if (highContrast) {
      root.style.setProperty('--text-color', '#000000');

      root.style.setProperty('--bg-color', '#ffffff');

      root.style.setProperty('--border-color', '#000000');

    } else {
      root.style.removeProperty('--text-color');

      root.style.removeProperty('--bg-color');

      root.style.removeProperty('--border-color');

    } , [reducedMotion, highContrast, largeText, screenReader, keyboardNavigation, focusVisible, fontSize, colorScheme]);

  // ===== UTILITÁRIOS =====

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!screenReader) return;

    const announcement = document.createElement('div');

    announcement.setAttribute('aria-live', priority);

    announcement.setAttribute('aria-atomic', 'true');

    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remover após um tempo
    setTimeout(() => {
      document.body.removeChild(announcement);

    }, 1000);

  }, [screenReader]);

  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector)! as HTMLElement;
    if (element) {
      element.focus();

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } , []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();

          e.preventDefault();

        } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();

          e.preventDefault();

        } };

    container.addEventListener('keydown', handleTabKey);

    // Focar no primeiro elemento
    firstElement?.focus();

    // Retornar função de cleanup
    return () => {
      container.removeEventListener('keydown', handleTabKey);};

  }, []);

  const releaseFocus = useCallback(() => {
    // Implementar lógica para liberar foco se necessário
  }, []);

  // ===== CONTEXT VALUE =====

  const contextValue: AccessibilityContextType = {
    // Estado
    reducedMotion,
    highContrast,
    largeText,
    screenReader,
    keyboardNavigation,
    fontSize,
    colorScheme,
    focusVisible,
    
    // Ações
    setReducedMotion,
    setHighContrast,
    setLargeText,
    setScreenReader,
    setKeyboardNavigation,
    setFontSize,
    setColorScheme,
    
    // Utilitários
    announceToScreenReader,
    focusElement,
    trapFocus,
    releaseFocus};

  return (
            <AccessibilityContext.Provider value={ contextValue } />
      {children}
    </AccessibilityContext.Provider>);};

// =========================================
// HOOK
// =========================================

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');

  }
  return context;};

// =========================================
// COMPONENTES DE ACESSIBILIDADE
// =========================================

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string; }

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children, className = ''    }) => {
  return (
            <a
      href={ href }
      className={`skip-link ${className} `}
      onFocus={(e: unknown) => {
        e.currentTarget.style.position = 'absolute';
        e.currentTarget.style.top = '0';
        e.currentTarget.style.left = '0';
        e.currentTarget.style.zIndex = '9999';
        e.currentTarget.style.padding = '8px 16px';
        e.currentTarget.style.backgroundColor = '#000';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.textDecoration = 'none';
      } onBlur={(e: unknown) => {
        e.currentTarget.style.position = 'absolute';
        e.currentTarget.style.top = '-9999px';
        e.currentTarget.style.left = '-9999px';
      } >
      {children}
    </a>);};

interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  className?: string; }

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, active, className = ''    }) => {
  const { trapFocus } = useAccessibility();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active && containerRef.current) {
      const cleanup = trapFocus(containerRef.current);

      return cleanup;
    } , [active, trapFocus]);

  return (
        <>
      <div ref={containerRef} className={`focus-trap ${className} `}>
      </div>{children}
    </div>);};

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string; }

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ children, className = ''    }) => {
  return (
        <>
      <span className={`sr-only ${className} `} aria-hidden="false">
      </span>{children}
    </span>);};

interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string; }

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ children, className = ''    }) => {
  return (
        <>
      <span className={`visually-hidden ${className} `} aria-hidden="true">
      </span>{children}
    </span>);};

// =========================================
// HOOKS ESPECIALIZADOS
// =========================================

export const useAnnouncement = () => {
  const { announceToScreenReader } = useAccessibility();

  return useCallback((message: string, priority?: 'polite' | 'assertive') => {
    announceToScreenReader(message, priority);

  }, [announceToScreenReader]);};

export const useFocusManagement = () => {
  const { focusElement, trapFocus, releaseFocus } = useAccessibility();

  return {
    focusElement,
    trapFocus,
    releaseFocus};
};

export const useKeyboardNavigation = () => {
  const { keyboardNavigation, setKeyboardNavigation } = useAccessibility();

  return {
    isKeyboardNavigation: keyboardNavigation,
    setKeyboardNavigation};
};

// =========================================
// CSS PARA ACESSIBILIDADE
// =========================================

export const accessibilityStyles = `
  /* Screen reader only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);

    white-space: nowrap;
    border: 0;
  }

  /* Visually hidden */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);

    white-space: nowrap;
    border: 0;
  }

  /* Skip link */
  .skip-link {
    position: absolute;
    top: -9999px;
    left: -9999px;
    z-index: 9999;
    padding: 8px 16px;
    background-color: #000;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
  }

  .skip-link:focus {
    position: absolute;
    top: 0;
    left: 0;
  }

  /* Focus styles */
  .focus-visible *:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }

  .keyboard-navigation *:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }

  /* Reduced motion */
  .reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* High contrast */
  .high-contrast {
    --text-color: #000000;
    --bg-color: #ffffff;
    --border-color: #000000;
  }

  /* Large text */
  .large-text {
    font-size: 1.2em;
  }

  .font-small {
    font-size: 0.875rem;
  }

  .font-medium {
    font-size: 1rem;
  }

  .font-large {
    font-size: 1.125rem;
  }

  .font-extra-large {
    font-size: 1.25rem;
  }

  /* Color schemes */
  .theme-light {
    --text-color: #1f2937;
    --bg-color: #ffffff;
    --border-color: #d1d5db;
  }

  .theme-dark {
    --text-color: #f9fafb;
    --bg-color: #111827;
    --border-color: #374151;
  }

  .theme-high-contrast {
    --text-color: #000000;
    --bg-color: #ffffff;
    --border-color: #000000;
  }
`;

export default AccessibilityProvider;
