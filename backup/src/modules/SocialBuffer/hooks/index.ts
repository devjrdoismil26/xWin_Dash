// Exportações dos stores especializados
export { useAccountsStore } from './useAccountsStore';
export { usePostsStore } from './usePostsStore';
export { useSchedulesStore } from './useSchedulesStore';

// Exportações dos stores de analytics (refatorados)
export * from './analytics';

// Exportações dos stores de hashtags (novos)
export * from './hashtags';

// Exportações dos stores de links (novos)
export * from './links';

// Exportações dos stores de media (novos)
export * from './media';

// Exportações dos stores de engagement (novos)
export * from './engagement';

// Exportação do store orquestrador principal
export { useSocialBufferStore } from './useSocialBufferStore';

// Exportação do hook de UI (novo)
export { useSocialBufferUI } from './useSocialBufferUI';

// Exportações dos tipos dos stores
export type {
  AccountsState,
  AccountsActions,
  AccountsStore
} from './useAccountsStore';

export type {
  PostsState,
  PostsActions,
  PostsStore
} from './usePostsStore';

export type {
  SchedulesState,
  SchedulesActions,
  SchedulesStore
} from './useSchedulesStore';

export type {
  AnalyticsState,
  AnalyticsActions,
  AnalyticsStore
} from './useAnalyticsStore';

// Exportação do store principal (será criado posteriormente)
// export { useSocialBufferStore } from './useSocialBufferStore';
// export default useSocialBufferStore;
