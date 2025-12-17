/**
 * Componente KeyboardShortcuts - Sistema de Atalhos de Teclado
 *
 * @description
 * Sistema completo de atalhos de teclado globais e contextuais. Fornece o Provider
 * `KeyboardShortcutsProvider`, hook `useKeyboardShortcuts`, componente `ShortcutHelp`,
 * `ShortcutDisplay`, hook `useShortcut` e componente `ShortcutContext` para atalhos
 * específicos de contexto. Suporta normalização de teclas (Mac/Windows), categorias,
 * atalhos globais e contextuais, e modal de ajuda com busca.
 *
 * @example
 * ```tsx
 * import { KeyboardShortcutsProvider, useShortcut } from '@/shared/components/ui/KeyboardShortcuts';
 *
 * <KeyboardShortcutsProvider />
 *   <App / />
 * </KeyboardShortcutsProvider>
 *
 * const MyComponent = () => {
 *   useShortcut({
 *     keys: ['meta', 'k'],
 *     description: 'Abrir busca',
 *     action: () => openSearch()
 *   });

 *};

 * ```
 *
 * @module components/ui/KeyboardShortcuts
 * @since 1.0.0
 */
import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useRef,
  useCallback,
  ReactNode 
} from 'react';
import { cn } from '@/lib/utils';

/**
 * Interface de um atalho de teclado
 *
 * @description
 * Estrutura completa de um atalho de teclado.
 *
 * @interface Shortcut
 * @property {string} id - ID único do atalho
 * @property {string[]} keys - Sequência de teclas (ex: ['meta', 'k'])
 * @property {string} description - Descrição do atalho
 * @property {() => void} action - Função executada ao pressionar o atalho
 * @property {string} [category] - Categoria do atalho (para organização)
 * @property {boolean} [global] - Se funciona globalmente ou apenas em contexto
 * @property {boolean} [preventDefault] - Se deve prevenir comportamento padrão
 * @property {boolean} [enabled] - Se o atalho está habilitado
 */
export interface Shortcut {
  id: string;
  keys: string[];
  // ['cmd', 'k'] or ['ctrl', 'shift', 'n']
  description: string;
  action??: (e: any) => void;
  category?: string;
  global?: boolean;
  // If true, works globally, if false only in context
  preventDefault?: boolean;
  enabled?: boolean; }

export interface ShortcutCategory {
  id: string;
  name: string;
  description?: string;
  shortcuts: Shortcut[]; }

/**
 * Modificadores de tecla disponíveis
 *
 * @description
 * Tipo que define os modificadores de tecla suportados.
 *
 * @typedef {('ctrl' | 'cmd' | 'alt' | 'shift' | 'meta')} KeyModifier
 */
export type KeyModifier = 'ctrl' | 'cmd' | 'alt' | 'shift' | 'meta';

/**
 * Tipo do contexto de atalhos de teclado
 *
 * @description
 * Interface que define o valor do contexto de atalhos, incluindo estado e ações.
 *
 * @interface KeyboardShortcutsContextType
 * @property {Shortcut[]} shortcuts - Array de atalhos registrados
 * @property {ShortcutCategory[]} categories - Array de categorias de atalhos
 * @property {boolean} isHelpVisible - Se o modal de ajuda está visível
 * @property {(shortcut: Shortcut) => () => void} registerShortcut - Função para registrar atalho
 * @property {(id: string) => void} unregisterShortcut - Função para desregistrar atalho
 * @property {(category: ShortcutCategory) => () => void} registerCategory - Função para registrar categoria
 * @property {() => void} toggleHelp - Função para alternar modal de ajuda
 * @property {(keys: string[]) => boolean} executeShortcut - Função para executar atalho manualmente
 */
interface KeyboardShortcutsContextType {
  shortcuts: Shortcut[];
  categories: ShortcutCategory[];
  isHelpVisible: boolean;
  registerShortcut: (shortcut: Shortcut) => () => void;
  unregisterShortcut?: (e: any) => void;
  registerCategory: (category: ShortcutCategory) => () => void;
  toggleHelp??: (e: any) => void;
  executeShortcut: (keys: string[]) => boolean; }

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

// ===== UTILITIES =====
const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

export const normalizeKeys = (keys: string[]): string[] => {
  return (keys || []).map(key => {
    // Normalize modifier keys
    if (key === 'cmd' || key === 'meta') return isMac ? 'meta' : 'ctrl';
    if (key === 'ctrl' && isMac) return 'meta';
    return key.toLowerCase();

  }).sort((a: unknown, b: unknown) => {
    // Sort modifiers first, then regular keys
    const modifiers = ['ctrl', 'meta', 'alt', 'shift'];
    const aIsModifier = modifiers.includes(a);

    const bIsModifier = modifiers.includes(b);

    if (aIsModifier && !bIsModifier) return -1;
    if (!aIsModifier && bIsModifier) return 1;
    
    return a.localeCompare(b);

  });};

export const formatShortcut = (keys: string[]): string => {
  const symbols: Record<string, string> = {
    'meta': isMac ? '⌘' : 'Ctrl',
    'ctrl': 'Ctrl',
    'alt': isMac ? '⌥' : 'Alt',
    'shift': isMac ? '⇧' : 'Shift',
    'enter': '↵',
    'backspace': '⌫',
    'delete': '⌦',
    'escape': 'Esc',
    'space': '␣',
    'tab': '⇥',
    'arrowup': '↑',
    'arrowdown': '↓',
    'arrowleft': '←',
    'arrowright': '→',};

  return (keys || []).map(key => symbols[key] || key.toUpperCase()).join(isMac ? '' : '+');};

const getKeyFromEvent = (e: KeyboardEvent): string[] => {
  const keys: string[] = [] as unknown[];
  
  if (e.ctrlKey) keys.push('ctrl');

  if (e.metaKey) keys.push('meta');

  if (e.altKey) keys.push('alt');

  if (e.shiftKey) keys.push('shift');

  // Add the main key (not a modifier)
  if (!['Control', 'Meta', 'Alt', 'Shift'].includes(e.key)) {
    keys.push(e.key.toLowerCase());

  }
  
  return normalizeKeys(keys);};

/**
 * Props do componente KeyboardShortcutsProvider
 *
 * @description
 * Propriedades que podem ser passadas para o componente KeyboardShortcutsProvider.
 *
 * @interface KeyboardShortcutsProviderProps
 * @property {React.ReactNode} children - Componentes filhos que terão acesso ao contexto
 */
interface KeyboardShortcutsProviderProps {
  /** Componentes filhos que terão acesso ao contexto */
children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente KeyboardShortcutsProvider
 *
 * @description
 * Provider que disponibiliza o contexto de atalhos de teclado para componentes filhos.
 * Registra atalhos globais padrão (busca, ajuda, novo item, salvar, refresh, navegação)
 * e gerencia listeners de teclado para executar atalhos.
 *
 * @component
 * @param {KeyboardShortcutsProviderProps} props - Props do componente
 * @returns {JSX.Element} Provider com contexto de atalhos de teclado
 */
export const KeyboardShortcutsProvider: React.FC<KeyboardShortcutsProviderProps> = ({ children    }) => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  const [categories, setCategories] = useState<ShortcutCategory[]>([]);

  const [isHelpVisible, setIsHelpVisible] = useState(false);

  const pressedKeys = useRef<Set<string>>(new Set());

  // Register global shortcuts
  useEffect(() => {
    // Global shortcuts
    const globalShortcuts: Shortcut[] = [
      {
        id: 'global-search',
        keys: ['meta', 'k'],
        description: 'Busca global',
        action: () => {
          // Trigger global search
          const searchEvent = new CustomEvent('global-search');

          window.dispatchEvent(searchEvent);

        },
        global: true,
        category: 'global',
      },
      {
        id: 'help',
        keys: ['meta', 'shift', '/'],
        description: 'Mostrar atalhos',
        action: () => toggleHelp(),
        global: true,
        category: 'global',
      },
      {
        id: 'new-item',
        keys: ['meta', 'n'],
        description: 'Novo item',
        action: () => {
          const newEvent = new CustomEvent('new-item');

          window.dispatchEvent(newEvent);

        },
        global: true,
        category: 'global',
      },
      {
        id: 'save',
        keys: ['meta', 's'],
        description: 'Salvar',
        action: () => {
          const saveEvent = new CustomEvent('save');

          window.dispatchEvent(saveEvent);

        },
        global: true,
        category: 'global',
        preventDefault: true,
      },
      {
        id: 'refresh',
        keys: ['meta', 'r'],
        description: 'Atualizar',
        action: () => {
          window.location.reload();

        },
        global: true,
        category: 'global',
        preventDefault: true,
      },
    ];

    // Module-specific shortcuts
    const navigationShortcuts: Shortcut[] = [
      {
        id: 'nav-dashboard',
        keys: ['g', 'd'],
        description: 'Ir para Dashboard',
        action: () => {
          const navEvent = new CustomEvent('navigate', { detail: '/dashboard' });

          window.dispatchEvent(navEvent);

        },
        global: true,
        category: 'navigation',
      },
      {
        id: 'nav-analytics',
        keys: ['g', 'a'],
        description: 'Ir para Analytics',
        action: () => {
          const navEvent = new CustomEvent('navigate', { detail: '/analytics' });

          window.dispatchEvent(navEvent);

        },
        global: true,
        category: 'navigation',
      },
      {
        id: 'nav-campaigns',
        keys: ['g', 'c'],
        description: 'Ir para Campanhas',
        action: () => {
          const navEvent = new CustomEvent('navigate', { detail: '/campaigns' });

          window.dispatchEvent(navEvent);

        },
        global: true,
        category: 'navigation',
      },
      {
        id: 'nav-leads',
        keys: ['g', 'l'],
        description: 'Ir para Leads',
        action: () => {
          const navEvent = new CustomEvent('navigate', { detail: '/leads' });

          window.dispatchEvent(navEvent);

        },
        global: true,
        category: 'navigation',
      },
      {
        id: 'nav-settings',
        keys: ['g', 's'],
        description: 'Ir para Configurações',
        action: () => {
          const navEvent = new CustomEvent('navigate', { detail: '/settings' });

          window.dispatchEvent(navEvent);

        },
        global: true,
        category: 'navigation',
      },
    ];

    // Register default shortcuts
    globalShortcuts.forEach(shortcut => registerShortcut(shortcut));

    navigationShortcuts.forEach(shortcut => registerShortcut(shortcut));

    // Register default categories
    registerCategory({
      id: 'global',
      name: 'Global',
      description: 'Atalhos globais do sistema',
      shortcuts: globalShortcuts,
    });

    registerCategory({
      id: 'navigation',
      name: 'Navegação',
      description: 'Atalhos para navegação entre módulos',
      shortcuts: navigationShortcuts,
    });

    return () => {
      // Cleanup is handled by unregister functions};

  }, []);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return;
      }

      const currentKeys = getKeyFromEvent(e);

      // Update pressed keys
      currentKeys.forEach(key => pressedKeys.current.add(key));

      // Try to execute shortcut
      const executed = executeShortcut(Array.from(pressedKeys.current));

      if (executed) {
        const shortcut = shortcuts.find(s => 
          normalizeKeys(s.keys).join(',') === normalizeKeys(Array.from(pressedKeys.current)).join(','));

        if (shortcut?.preventDefault) {
          e.preventDefault();

        } };

    const handleKeyUp = (e: KeyboardEvent) => {
      const currentKeys = getKeyFromEvent(e);

      // Clear pressed keys when modifiers are released
      if (['Control', 'Meta', 'Alt', 'Shift'].includes(e.key)) {
        pressedKeys.current.clear();

      } else {
        // Remove the released key
        currentKeys.forEach(key => pressedKeys.current.delete(key));

      } ;

    // Clear on window blur
    const handleBlur = () => {
      pressedKeys.current.clear();};

    document.addEventListener('keydown', handleKeyDown);

    document.addEventListener('keyup', handleKeyUp);

    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      document.removeEventListener('keyup', handleKeyUp);

      window.removeEventListener('blur', handleBlur);};

  }, [shortcuts]);

  // Register shortcut
  const registerShortcut = useCallback((shortcut: Shortcut) => {
    setShortcuts(prev => {
      // Remove existing shortcut with same ID
      const filtered = (prev || []).filter(s => s.id !== shortcut.id);

      return [...filtered, { ...shortcut, enabled: shortcut.enabled !== false }];
    });

    // Return unregister function
    return () => unregisterShortcut(shortcut.id);

  }, []);

  // Unregister shortcut
  const unregisterShortcut = useCallback((id: string) => {
    setShortcuts(prev => (prev || []).filter(s => s.id !== id));

  }, []);

  // Register category
  const registerCategory = useCallback((category: ShortcutCategory) => {
    setCategories(prev => {
      const filtered = (prev || []).filter(c => c.id !== category.id);

      return [...filtered, category];
    });

    // Return unregister function
    return () => {
      setCategories(prev => (prev || []).filter(c => c.id !== category.id));};

  }, []);

  // Toggle help
  const toggleHelp = useCallback(() => {
    setIsHelpVisible(prev => !prev);

  }, []);

  // Execute shortcut
  const executeShortcut = useCallback((keys: string[]): boolean => {
    const normalizedKeys = normalizeKeys(keys);

    const keyString = normalizedKeys.join(',');

    const shortcut = shortcuts.find(s => 
      s.enabled !== false && 
      normalizeKeys(s.keys).join(',') === keyString);

    if (shortcut) {
      shortcut.action();

      return true;
    }

    return false;
  }, [shortcuts]);

  const contextValue: KeyboardShortcutsContextType = {
    shortcuts,
    categories,
    isHelpVisible,
    registerShortcut,
    unregisterShortcut,
    registerCategory,
    toggleHelp,
    executeShortcut,};

  return (
            <KeyboardShortcutsContext.Provider value={ contextValue } />
      {children}
      {isHelpVisible && <ShortcutHelp />}
    </KeyboardShortcutsContext.Provider>);};

// ===== HOOK =====
export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext);

  if (context === undefined) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');

  }
  return context;};

// ===== COMPONENTS =====

// Shortcut Help Modal
const ShortcutHelp: React.FC = () => {
  const { categories, toggleHelp } = useKeyboardShortcuts();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleHelp();

      } ;

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);

  }, [toggleHelp]);

  return (
            <div className=" ">$2</div><div className="{/* Header */}">$2</div>
        <div className=" ">$2</div><h2 className="text-xl font-semibold text-gray-900 dark:text-white" />
            Atalhos de Teclado
          </h2>
          <button
            onClick={ toggleHelp }
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Fechar" />
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" / /></svg></button>
        </div>

        {/* Content */}
        <div className=" ">$2</div><div className="{(categories || []).map(category => (">$2</div>
              <div key={category.id} className="space-y-4">
           
        </div><div>
           
        </div><h3 className="text-lg font-medium text-gray-900 dark:text-white" />
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400" />
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="{(category.shortcuts || []).map(shortcut => (">$2</div>
                    <div
                      key={ shortcut.id }
                      className="flex items-center justify-between py-2 px-3 rounded-md bg-gray-50 dark:bg-gray-700">
           
        </div><span className="{shortcut.description}">$2</span>
                      </span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500" />
                        {formatShortcut(shortcut.keys)}
                      </kbd>
      </div>
    </>
  ))}
                </div>
            ))}
          </div>

        {/* Footer */}
        <div className=" ">$2</div><p className="text-sm text-gray-600 dark:text-gray-400 text-center" />
            Pressione <kbd className="px-1 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded">Esc</kbd> para fechar
          </p></div></div>);};

// Shortcut display component
interface ShortcutDisplayProps {
  keys: string[];
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties; }

export const ShortcutDisplay: React.FC<ShortcutDisplayProps> = ({ keys, className = ''    }) => { return (
            <kbd className={cn(
      'px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded',
      'dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500',
      className
    ) } />
      {formatShortcut(keys)}
    </kbd>);};

// Hook for registering shortcuts in components
export const useShortcut = (shortcut: Omit<Shortcut, 'id'> & { id?: string }) => {
  const { registerShortcut } = useKeyboardShortcuts();

  const id = shortcut.id || `shortcut-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const unregister = registerShortcut({
      ...shortcut,
      id,
    });

    return unregister;
  }, [shortcut.keys.join(','), shortcut.description, shortcut.enabled]);};

/**
 * Props do componente ShortcutContext
 *
 * @description
 * Propriedades que podem ser passadas para o componente ShortcutContext.
 *
 * @interface ShortcutContextProps
 * @property {React.ReactNode} children - Componentes filhos
 * @property {Omit<Shortcut, 'id'>[]} shortcuts - Array de atalhos contextuais
 * @property { id: string; name: string; description?: string } [category] - Categoria opcional para os atalhos
 */
interface ShortcutContextProps {
  /** Componentes filhos */
children: ReactNode;
  /** Array de atalhos contextuais */
shortcuts: Omit<Shortcut, 'id'>[];
  /** Categoria opcional para os atalhos */
category?: {
id: string;
  name: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties; };

}

/**
 * Componente ShortcutContext - Provider de Atalhos Contextuais
 *
 * @description
 * Provider para registrar atalhos de teclado específicos de um contexto.
 * Os atalhos registrados aqui funcionam apenas dentro deste contexto e são
 * desregistrados quando o componente é desmontado.
 *
 * @component
 * @param {ShortcutContextProps} props - Props do componente
 * @returns {JSX.Element} Provider com atalhos contextuais
 */
export const ShortcutContext: React.FC<ShortcutContextProps> = ({ children, 
  shortcuts: contextShortcuts,
  category 
   }) => {
  const { registerShortcut, registerCategory } = useKeyboardShortcuts();

  useEffect(() => {
    // Register shortcuts
    const unregisterFns = (contextShortcuts || []).map((shortcut: unknown, index: unknown) => {
      const id = `context-${category?.id || 'default'}-${index}`;
      return registerShortcut({
        ...shortcut,
        id,
        global: false, // Context shortcuts are not global
      });

    });

    // Register category if provided
    let unregisterCategory?: (e: any) => void) | undefined;
    if (category) {
      const categoryShortcuts = (contextShortcuts || []).map((shortcut: unknown, index: unknown) => ({
        ...shortcut,
        id: `context-${category.id}-${index}`,
      }));

      unregisterCategory = registerCategory({
        ...category,
        shortcuts: categoryShortcuts,
      });

    }

    return () => {
      unregisterFns.forEach(fn => fn());

      unregisterCategory?.();};

  }, [contextShortcuts, category]);

  return <>{children}</>;};

// Components are already exported individually above

// Default export for compatibility
export default KeyboardShortcutsProvider;
