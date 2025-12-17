import { lazy } from 'react';

export const AIListPage = lazy(() => 
  import('./pages/AIListPage').then(m => ({ default: m.AIListPage })));

export const AIDetailPage = lazy(() => 
  import('./pages/AIDetailPage').then(m => ({ default: m.AIDetailPage })));

export const AIAnalyticsPage = lazy(() => 
  import('./pages/AIAnalyticsPage').then(m => ({ default: m.AIAnalyticsPage })));

export { AIMetricsCards } from './components/AIMetricsCards';
export { AITable } from './components/AITable';
export { AIFiltersPanel } from './components/AIFiltersPanel';
export { AIFormModal } from './components/AIFormModal';

export { useAI } from './hooks/useAI';

export { default as aiService } from './services/aiService';

export type {
  AIGeneration,
  AIProvider,
  AIModel,
} from './types';

export const AI_MODULE_INFO = {
  name: 'AI',
  version: '2.0.0',
  refactored: true,
  pages: ['AIListPage', 'AIDetailPage', 'AIAnalyticsPage'],
  components: ['AIMetricsCards', 'AITable', 'AIFiltersPanel', 'AIFormModal'],
  hooks: ['useAIRefactored'],};

export default {
  AIListPage,
  AIDetailPage,
  AIAnalyticsPage,
  useAIRefactored,
  aiService,
  AI_MODULE_INFO,};
