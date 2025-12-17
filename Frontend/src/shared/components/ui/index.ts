/**
 * Módulo de Re-exportação - UI Components
 *
 * @description
 * Arquivo de re-exportação centralizada para todos os componentes de UI.
 * Facilita imports mais limpos e mantém compatibilidade com diferentes
 * padrões de importação.
 *
 * @example
 * ```tsx
 * // Import usando este módulo
 * import { Button, Input, Card } from '@/shared/components/ui';
 * import { LoadingSpinner, TableSkeleton } from '@/shared/components/ui';
 * import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/ui';
 * ```
 *
 * @module components/ui
 * @since 1.0.0
 */

// Componentes básicos de UI
export { default as ApplicationLogo } from "./ApplicationLogo";
export { default as Avatar } from "./Avatar";
export { default as Badge } from "./Badge";
export { default as Button } from "./Button";
export { default as Card } from "./Card";
export { default as Checkbox } from "./Checkbox";

// Componentes de formulário
export { default as Input } from "./Input";
export { default as InputError } from "./InputError";
export { default as InputLabel } from "./InputLabel";
export { default as Textarea } from "./Textarea";
export { default as FileInput } from "./FileInput";
export { default as Select } from "./Select";
export { default as Switch } from "./Switch";
export { default as TagInput } from "./TagInput";

// Componentes de layout
export { default as Modal } from "./Modal";
export { default as Tabs } from "./Tabs";
export { default as Separator } from "./Separator";
export { default as Resizable } from "./Resizable";

// Componentes de feedback
export { default as Toast } from "./Toast";
export { default as useToast } from "./useToast";
export { default as Tooltip } from "./Tooltip";
// Loading components consolidated into LoadingStates.tsx
export { LoadingSpinner, LoadingSkeleton, useLoadingState, TableLoadingSkeleton, CardLoadingSkeleton, DashboardSkeleton, TableSkeleton, ChatSkeleton, FormSkeleton, CardGridSkeleton, ProfileSkeleton, CalendarSkeleton,  } from "./LoadingStates";
export { default as GlobalLoader } from "./GlobalLoader";
export { default as GlobalError } from "./GlobalError";

// Componentes de navegação
export { default as Pagination } from "./Pagination";
export { default as Dropdown } from "./Dropdown";
export { default as ToggleGroup } from "./ToggleGroup";
export { default as NavLink } from "./NavLink";
export { default as ResponsiveNavLink } from "./ResponsiveNavLink";

// Componentes de dados
export { default as Table } from "./Table";
export { default as SortableHeader } from "./SortableHeader";

// Dialog
export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,  } from "./Dialog";

// Componentes de scroll
export { ScrollArea, ScrollBar } from "./ScrollArea";

// Tema
// export { ThemeProvider, useTheme } from './ThemeProvider';
// export { default as ThemeToggle } from './ThemeToggle';

// Drag and drop
export { default as DragDropProvider, DraggableItem } from "./DragDropProvider";

// Design tokens
export { ComponentVariant, ComponentSize, VARIANT_COLORS, SIZE_CLASSES, BADGE_VARIANTS, getVariantClasses, getSizeClasses,  } from "./design-tokens";

// Layout components
export { default as ModuleLayout } from "./ModuleLayout";
export { default as PageHeader } from "./PageHeader";
