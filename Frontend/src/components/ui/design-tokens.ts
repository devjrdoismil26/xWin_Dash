/**
 * Design Tokens Unificados - xWin Dash
 * Sistema centralizado de variantes, tamanhos, cores e transições
 */

// ===== TRANSIÇÕES E ANIMAÇÕES =====
export const ENHANCED_TRANSITIONS = {
  // Transições base
  base: 'transition-all duration-200 ease-in-out',
  fast: 'transition-all duration-150 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
  
  // Transições específicas por componente
  button: 'transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]',
  card: 'transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1',
  modal: 'transition-all duration-300 ease-in-out',
  input: 'transition-all duration-200 ease-in-out focus:scale-[1.01]',
  
  // Micro-interações
  bounce: 'transition-transform duration-150 ease-in-out hover:scale-110 active:scale-95',
  glow: 'transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-current/25',
  slide: 'transition-transform duration-200 ease-in-out hover:translate-x-1',
  
  // Animações de estado
  loading: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
  fade: 'transition-opacity duration-300 ease-in-out',
  
  // Transições de página
  pageEnter: 'animate-in fade-in slide-in-from-right-4 duration-300',
  pageExit: 'animate-out fade-out slide-out-to-left-4 duration-200',
} as const;

// ===== EFEITOS VISUAIS =====
export const VISUAL_EFFECTS = {
  // Sombras melhoradas
  shadows: {
    sm: 'shadow-sm hover:shadow-md',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl',
    glow: 'shadow-lg shadow-current/20 hover:shadow-xl hover:shadow-current/30',
  },
  
  // Bordas e outlines
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
    glow: 'focus:outline-none focus:ring-4 focus:ring-current/20',
    subtle: 'focus:outline-none focus:ring-1 focus:ring-current/30',
  },
  
  // Estados visuais
  states: {
    hover: 'hover:brightness-110 hover:saturate-110',
    active: 'active:brightness-90 active:saturate-90',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale',
    loading: 'opacity-75 cursor-wait',
  },
} as const;

// ===== VARIANTES UNIFICADAS =====
export type ComponentVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'destructive' 
  | 'outline' 
  | 'ghost' 
  | 'link';

// ===== TAMANHOS UNIFICADOS =====
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

// ===== MAPEAMENTO DE CORES =====
export const VARIANT_COLORS = {
  default: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-300',
    hover: 'hover:bg-gray-200',
    focus: 'focus:ring-gray-500',
  },
  primary: {
    bg: 'bg-blue-600',
    text: 'text-white',
    border: 'border-blue-600',
    hover: 'hover:bg-blue-700',
    focus: 'focus:ring-blue-500',
  },
  secondary: {
    bg: 'bg-gray-200',
    text: 'text-gray-800',
    border: 'border-gray-300',
    hover: 'hover:bg-gray-300',
    focus: 'focus:ring-gray-500',
  },
  success: {
    bg: 'bg-green-600',
    text: 'text-white',
    border: 'border-green-600',
    hover: 'hover:bg-green-700',
    focus: 'focus:ring-green-500',
  },
  warning: {
    bg: 'bg-yellow-600',
    text: 'text-white',
    border: 'border-yellow-600',
    hover: 'hover:bg-yellow-700',
    focus: 'focus:ring-yellow-500',
  },
  destructive: {
    bg: 'bg-red-600',
    text: 'text-white',
    border: 'border-red-600',
    hover: 'hover:bg-red-700',
    focus: 'focus:ring-red-500',
  },
  outline: {
    bg: 'bg-transparent',
    text: 'text-gray-700',
    border: 'border-gray-300',
    hover: 'hover:bg-gray-50',
    focus: 'focus:ring-gray-500',
  },
  ghost: {
    bg: 'bg-transparent',
    text: 'text-gray-700',
    border: 'border-transparent',
    hover: 'hover:bg-gray-100',
    focus: 'focus:ring-gray-500',
  },
  link: {
    bg: 'bg-transparent',
    text: 'text-blue-600',
    border: 'border-transparent',
    hover: 'hover:underline',
    focus: 'focus:ring-blue-500',
  },
} as const;

// ===== MAPEAMENTO DE TAMANHOS =====
export const SIZE_CLASSES = {
  // Para botões e inputs
  button: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  },
  input: {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
    xl: 'h-14 px-5 text-lg',
  },
  // Para ícones e loaders
  icon: {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  },
  // Para texto
  text: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  },
  // Para badges
  badge: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
    xl: 'px-4 py-1 text-sm',
  },
  // Para cards
  card: {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
} as const;

// ===== MAPEAMENTO DE BADGES =====
export const BADGE_VARIANTS = {
  default: 'bg-gray-100 text-gray-600',
  primary: 'bg-blue-600/10 text-blue-600',
  secondary: 'bg-gray-600/10 text-gray-600',
  success: 'bg-green-600/10 text-green-600',
  warning: 'bg-yellow-600/10 text-yellow-600',
  destructive: 'bg-red-600/10 text-red-600',
  outline: 'border border-gray-300 text-gray-700',
  ghost: 'text-gray-700',
  link: 'text-blue-600',
} as const;

// ===== UTILITÁRIOS =====
export const getVariantClasses = (variant: ComponentVariant, type: 'solid' | 'outline' | 'ghost' | 'card' = 'solid') => {
  const colors = VARIANT_COLORS[variant];
  
  switch (type) {
    case 'outline':
      return `${colors.border} border ${colors.text} bg-transparent ${colors.hover}`;
    case 'ghost':
      return `${colors.text} bg-transparent ${colors.hover}`;
    case 'card':
      return variant === 'default' 
        ? 'bg-white border-gray-200' 
        : `${colors.bg} ${colors.text} ${colors.border}`;
    default:
      return `${colors.bg} ${colors.text} ${colors.hover}`;
  }
};

export const getSizeClasses = (size: ComponentSize, component: keyof typeof SIZE_CLASSES) => {
  return SIZE_CLASSES[component][size];
};

// ===== MAPEAMENTO DE ESTADOS DE ERRO =====
export const ERROR_VARIANTS = {
  network: { variant: 'primary' as ComponentVariant, icon: 'WifiOff' },
  validation: { variant: 'warning' as ComponentVariant, icon: 'AlertCircle' },
  permission: { variant: 'destructive' as ComponentVariant, icon: 'XCircle' },
  notFound: { variant: 'default' as ComponentVariant, icon: 'AlertTriangle' },
  server: { variant: 'destructive' as ComponentVariant, icon: 'Bug' },
  generic: { variant: 'default' as ComponentVariant, icon: 'AlertCircle' },
} as const;
