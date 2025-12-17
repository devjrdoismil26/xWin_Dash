/**
 * Tipos para o sistema de engagement
 */

export interface EngagementState {
  data: EngagementData[];
  monitoring: EngagementMonitoring[];
  alerts: EngagementAlert[];
  interactions: Interaction[];
  analysis: EngagementAnalysis | null;
  insights: EngagementInsights | null;
  forecast: EngagementForecast | null;
  loading: boolean;
  error: string | null; }

export interface EngagementActions {
  fetchEngagement: (params: EngagementParams) => Promise<void>;
  startMonitoring: (postId: string) => Promise<void>;
  stopMonitoring: (postId: string) => Promise<void>;
  getInteractions: (postId: string) => Promise<void>;
  analyzeEngagement: (postId: string) => Promise<void>;
  generateInsights: (postIds: string[]) => Promise<void>;
  getForecast: (postId: string) => Promise<void>;
  clearError??: (e: any) => void;
  reset??: (e: any) => void; }

export type EngagementStore = EngagementState & EngagementActions;
