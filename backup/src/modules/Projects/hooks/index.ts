/**
 * Exportações centralizadas dos hooks do módulo Projects
 */

// Hooks principais
export { useProjects } from './useProjects';
// useProjectsAdvanced refatorado em hooks modulares
// export { useProjectsAdvanced } from './useProjectsAdvanced';
export { useProjectsStandardized } from './useProjectsStandardized';

// Re-exportações para conveniência
export type {
  UseProjectsReturn,
  UseProjectsState,
  UseProjectsActions
} from './useProjects';