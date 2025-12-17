/**
 * M?dulo de Re-exporta??o - Tabs Components
 *
 * @description
 * Arquivo de re-exporta??o centralizada para componentes de tabs.
 * Facilita imports mais limpos e mant?m compatibilidade com diferentes
 * padr?es de importa??o.
 *
 * @example
 * ```tsx
 * // Import usando este m?dulo
 * import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
 * ```
 *
 * @note
 * Este arquivo exporta componentes de './Tabs'. Certifique-se de que o
 * arquivo Tabs.tsx existe antes de usar este m?dulo.
 *
 * @module components/ui/tabs
 * @since 1.0.0
 */

// Re-export Tabs components for compatibility
export { default as Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
