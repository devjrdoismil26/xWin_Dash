/**
 * Módulo de Re-exportação - Shared Components
 *
 * @description
 * Arquivo de re-exportação centralizada para todos os componentes compartilhados.
 * Facilita imports mais limpos e mantém compatibilidade.
 *
 * @example
 * ```tsx
 * import { Card, Button } from '@/shared/components/ui';
 * ```
 */

// Re-export UI components
export * from './ui';

// Re-export other shared components
export * from './guards';
export * from './Notifications';
export * from './Routes';
export * from './Navigation';
export * from './ErrorBoundary';
export * from './LazyWrappers';
