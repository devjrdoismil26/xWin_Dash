/**
 * Accessibility System - Sistema de Acessibilidade WCAG 2.1 AA/AAA
 *
 * @description
 * Sistema completo de acessibilidade que implementa padr?es WCAG 2.1 AA/AAA
 * para garantir que a aplica??o seja acess?vel a todos os usu?rios, incluindo
 * aqueles que utilizam leitores de tela, navega??o por teclado e outras
 * tecnologias assistivas.
 *
 * Funcionalidades principais:
 * - Gerenciamento de prefer?ncias de acessibilidade
 * - Detec??o autom?tica de prefer?ncias do sistema (alto contraste, movimento reduzido)
 * - An?ncios para leitores de tela (ARIA live regions)
 * - Gerenciamento de foco (trap focus, restore focus)
 * - Suporte a navega??o por teclado
 * - Atributos ARIA din?micos
 * - Skip links para navega??o r?pida
 *
 * @module components/ui/AccessibilitySystem
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { AccessibilityProvider, useAccessibility } from '@/shared/components/ui/AccessibilitySystem';
 *
 * // Provider global
 * <AccessibilityProvider />
 *   <App / />
 * </AccessibilityProvider>
 *
 * // Hook para usar
 * const { preferences, announceToScreenReader } = useAccessibility();

 * announceToScreenReader('P?gina carregada com sucesso');

 * ```
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  KeyboardEvent,
  FocusEvent,
} from "react";
import { cn } from '@/lib/utils';

// ===== ACCESSIBILITY TYPES =====
export interface AccessibilityPreferences {
  screenReader: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  focusVisible: boolean;
  keyboardOnly: boolean;
  autoAnnouncements: boolean;
  skipLinks: boolean; }

export interface AriaProps {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-pressed"?: boolean;
  "aria-checked"?: boolean;
  "aria-selected"?: boolean;
  "aria-hidden"?: boolean;
  "aria-live"?: "off" | "polite" | "assertive";
  "aria-atomic"?: boolean;
  "aria-relevant"?: string;
  role?: string;
  tabIndex?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

// ===== CONTEXT =====
interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  updatePreferences?: (e: any) => void;
  announceToScreenReader?: (e: any) => void;
  focusManagement: {
    trapFocus: (element: HTMLElement) => () => void;
  restoreFocus??: (e: any) => void;
  setFocusedElement?: (e: any) => void;
  getFocusedElement: () => HTMLElement | null; };

}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

// ===== PROVIDER =====
interface AccessibilityProviderProps {
  children: React.ReactNode; }

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children,
   }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    screenReader: false,
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    focusVisible: true,
    keyboardOnly: false,
    autoAnnouncements: true,
    skipLinks: true,
  });

  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(
    null,);

  const announceRef = useRef<HTMLDivElement>(null);

  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Detect accessibility preferences
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect high contrast
    const checkHighContrast = () => {
      const isHighContrast = window.matchMedia(
        "(prefers-contrast: high)",
      ).matches;
      setPreferences((prev: unknown) => ({ ...prev, highContrast: isHighContrast }));};

    // Detect reduced motion
    const checkReducedMotion = () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setPreferences((prev: unknown) => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
      }));};

    // Detect screen reader
    const checkScreenReader = () => {
      // Multiple detection methods
      const hasAriaSupport = "speechSynthesis" in window;
      const hasVoiceOver = /VoiceOver/i.test(navigator.userAgent);

      const hasJAWS = /JAWS/i.test(navigator.userAgent);

      const hasNVDA = /NVDA/i.test(navigator.userAgent);

      const isScreenReader =
        hasVoiceOver ||
        hasJAWS ||
        hasNVDA ||
        (hasAriaSupport && window.navigator.userAgent.includes("Chrome"));

      setPreferences((prev: unknown) => ({ ...prev, screenReader: isScreenReader }));};

    // Detect keyboard-only navigation
    const checkKeyboardOnly = () => {
      let isKeyboardUser = false;

      const handleKeyDown = () => {
        isKeyboardUser = true;
        document.removeEventListener("keydown", handleKeyDown);

        document.addEventListener("mousedown", handleMouseDown);

        setPreferences((prev: unknown) => ({ ...prev, keyboardOnly: true }));};

      const handleMouseDown = () => {
        isKeyboardUser = false;
        document.removeEventListener("mousedown", handleMouseDown);

        document.addEventListener("keydown", handleKeyDown);

        setPreferences((prev: unknown) => ({ ...prev, keyboardOnly: false }));};

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);

        document.removeEventListener("mousedown", handleMouseDown);};
};

    checkHighContrast();

    checkReducedMotion();

    checkScreenReader();

    const cleanupKeyboard = checkKeyboardOnly();

    // Media query listeners
    const contrastQuery = window.matchMedia("(prefers-contrast: high)");

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    contrastQuery.addEventListener("change", checkHighContrast);

    motionQuery.addEventListener("change", checkReducedMotion);

    return () => {
      contrastQuery.removeEventListener("change", checkHighContrast);

      motionQuery.removeEventListener("change", checkReducedMotion);

      cleanupKeyboard?.();};

  }, []);

  // Apply accessibility preferences to DOM
  useEffect(() => {
    const html = document.documentElement;

    // High contrast
    if (preferences.highContrast) {
      html.classList.add("high-contrast");

    } else {
      html.classList.remove("high-contrast");

    }

    // Reduced motion
    if (preferences.reducedMotion) {
      html.classList.add("reduce-motion");

    } else {
      html.classList.remove("reduce-motion");

    }

    // Large text
    if (preferences.largeText) {
      html.classList.add("large-text");

    } else {
      html.classList.remove("large-text");

    }

    // Focus visible
    if (preferences.focusVisible) {
      html.classList.add("focus-visible");

    } else {
      html.classList.remove("focus-visible");

    } , [preferences]);

  // Screen reader announcements
  const announceToScreenReader = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (!preferences.autoAnnouncements || !announceRef.current) return;

      const announcement = document.createElement("div");

      announcement.setAttribute("aria-live", priority);

      announcement.setAttribute("aria-atomic", "true");

      announcement.className = "sr-only";
      announcement.textContent = message;

      announceRef.current.appendChild(announcement);

      // Remove after announcement
      setTimeout(() => {
        if (announceRef.current?.contains(announcement)) {
          announceRef.current.removeChild(announcement);

        } , 1000);

    },
    [preferences.autoAnnouncements],);

  // Focus management
  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',);

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();

            lastElement?.focus();

          } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();

            firstElement?.focus();

          } }

      if (e.key === "Escape") {
        restoreFocus();

      } ;

    // Store current focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus first element
    firstElement?.focus();

    // Add event listener
    const handleKeyDownNative = handleKeyDown as any as (e: Event) => void;
    element.addEventListener("keydown", handleKeyDownNative);

    // Return cleanup function
    return () => {
      element.removeEventListener("keydown", handleKeyDownNative);};

  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();

      previousFocusRef.current = null;
    } , []);

  const updatePreferences = useCallback(
    (updates: Partial<AccessibilityPreferences>) => {
      setPreferences((prev: unknown) => ({ ...prev, ...updates }));

    },
    [],);

  const contextValue: AccessibilityContextType = {
    preferences,
    updatePreferences,
    announceToScreenReader,
    focusManagement: {
      trapFocus,
      restoreFocus,
      setFocusedElement,
      getFocusedElement: () => focusedElement,
    },};

  return (
            <AccessibilityContext.Provider value={ contextValue } />
      {children}
      {/* Screen reader announcements */}
      <div
        ref={ announceRef }
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
     >
          {/* Skip links */}
      {preferences.skipLinks && (
        <div className=" ">$2</div><a href="#main-content" className="skip-link" />
            Pular para o conte?do principal
          </a>
          <a href="#main-navigation" className="skip-link" />
            Pular para a navega??o
          </a>
      </div>
    </>
  )}
    </AccessibilityContext.Provider>);};

// ===== HOOK =====
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);

  if (context === undefined) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider",);

  }
  return context;};

// ===== ACCESSIBLE COMPONENTS =====

// Focus Manager
interface FocusManagerProps {
  children: React.ReactNode;
  trap?: boolean;
  restoreOnUnmount?: boolean;
  className?: string; }

export const FocusManager: React.FC<FocusManagerProps> = ({ children,
  trap = false,
  restoreOnUnmount = true,
  className = "",
   }) => {
  const { focusManagement } = useAccessibility();

  const containerRef = useRef<HTMLDivElement>(null);

  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (trap && containerRef.current) {
      cleanupRef.current = focusManagement.trapFocus(containerRef.current);

    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();

      }
      if (restoreOnUnmount) {
        focusManagement.restoreFocus();

      } ;

  }, [trap, restoreOnUnmount, focusManagement]);

  return (
        <>
      <div ref={containerRef} className={className  }>
      </div>{children}
    </div>);};

// Screen Reader Only Text
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string; }

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ children,
  as: Component = "span",
  className = "",
   }) => {
  return <Component className={cn("sr-only", className) } >{children}</Component>;};

// Accessible Button
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  ariaProps?: AriaProps;
  loading?: boolean;
  loadingText?: string;
  announce?: boolean;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  ariaProps = {} as any,
  loading = false,
  loadingText = "Carregando...",
  announce = false,
  onClick,
  className = "",
  ...props
}) => {
  const { announceToScreenReader } = useAccessibility();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (announce) {
        announceToScreenReader("Bot?o ativado");

      }
      onClick?.(e);

    },
    [onClick, announce, announceToScreenReader],);

  return (
            <button
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        "transition-all duration-200",
        className,
      )} onClick={ handleClick }
      aria-busy={ loading }
      disabled={ loading || props.disabled }
      {...ariaProps}
      { ...props } />
      {loading ? (
        <>
          <ScreenReaderOnly>{loadingText}</ScreenReaderOnly>
          <span aria-hidden="true">{children}</span>
      </>
    </>
  ) : (
        children
      )}
    </button>);};

// Accessible Input
interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  showRequiredIndicator?: boolean;
}

export const AccessibleInput: React.FC<AccessibleInputProps> = ({ label,
  error,
  description,
  required = false,
  showRequiredIndicator = true,
  className = "",
  id,
  ...props
   }) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
            <div className=" ">$2</div><label
        htmlFor={ inputId }
        className="block text-sm font-medium text-gray-700 dark:text-gray-300" />
        {label}
        {required && showRequiredIndicator && (
          <span className="text-red-500 ml-1" aria-label="obrigat?rio">
          *
        </span>
      </span>
    </>
  )}
      </label>

      {description && (
        <p
          id={ descriptionId }
          className="text-sm text-gray-600 dark:text-gray-400" />
          {description}
        </p>
      )}

      <input
        id={ inputId }
        className={cn(
          "block w-full rounded-md border-gray-300 dark:border-gray-600",
          "focus:border-blue-500 focus:ring-blue-500 focus:ring-1",
          "dark:bg-gray-800 dark:text-white",
          "transition-colors duration-200",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )} aria-required={ required }
        aria-invalid={ !!error }
        aria-describedby={ cn(descriptionId, errorId).trim() || undefined }
        { ...props }>
          {error && (
        <p
          id={ errorId }
          className="text-sm text-red-600 dark:text-red-400"
          role="alert" />
          {error}
        </p>
      )}
    </div>);};

// Accessible Modal
interface AccessibleModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose??: (e: any) => void;
  title: string;
  description?: string;
  className?: string; }

export const AccessibleModal: React.FC<AccessibleModalProps> = ({ children,
  isOpen,
  onClose,
  title,
  description,
  className = "",
   }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
  const descriptionId = description
    ? `modal-description-${Math.random().toString(36).substr(2, 9)}`
    : undefined;

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Focus modal
      modalRef.current?.focus();

    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";};

  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();

      } ;

    if (isOpen) {
      document.addEventListener("keydown", handleEscape as any);

    }

    return () => {
      document.removeEventListener("keydown", handleEscape as any);};

  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
        <>
      <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ titleId }
      aria-describedby={ descriptionId  }>
      </div>{/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={ onClose }
        aria-hidden="true"
     >
          {/* Modal */}
      <FocusManager trap restoreOnUnmount />
        <div
          ref={ modalRef }
          className={cn(
            "relative bg-white dark:bg-gray-800 rounded-lg shadow-xl",
            "max-w-md w-full mx-4 p-6",
            "focus:outline-none",
            className,
          )} tabIndex={ -1  }>
        </div><h2 id={titleId} className="text-lg font-semibold mb-4" />
            {title}
          </h2>

          {description && (
            <p
              id={ descriptionId }
              className="text-sm text-gray-600 dark:text-gray-400 mb-4" />
              {description}
            </p>
          )}

          {children}

          <button
            onClick={ onClose }
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Fechar modal" />
            <span className="sr-only">Fechar</span>?
          </button></div></FocusManager>
    </div>);};

// Live Region for announcements
interface LiveRegionProps {
  children: React.ReactNode;
  priority?: "polite" | "assertive" | "off";
  atomic?: boolean;
  relevant?: "additions" | "removals" | "text" | "all"; }

export const LiveRegion: React.FC<LiveRegionProps> = ({ children,
  priority = "polite",
  atomic = true,
  relevant = "all",
   }) => {
  return (
            <div
      aria-live={ priority }
      aria-atomic={ atomic }
      aria-relevant={ relevant }
      className="sr-only">
            {children}
          </div>);};

// Components are already exported individually above

// Default export for compatibility
export default AccessibilityProvider;
