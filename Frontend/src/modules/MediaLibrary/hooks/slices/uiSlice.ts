export interface UISlice {
  selectedMedia: string[];
  searchQuery: string;
  currentView: 'grid' | 'list' | 'timeline';
  pagination: {
    current_page: number;
  per_page: number;
  total: number;
  last_page: number; };

  setSearchQuery?: (e: any) => void;
  setCurrentView?: (e: any) => void;
  selectMedia?: (e: any) => void;
  deselectMedia?: (e: any) => void;
  selectAllMedia??: (e: any) => void;
  clearSelection??: (e: any) => void;
  toggleMediaSelection?: (e: any) => void;
  setPage?: (e: any) => void;
  setPerPage?: (e: any) => void;
  nextPage??: (e: any) => void;
  prevPage??: (e: any) => void;
  clearFilters??: (e: any) => void;
}

export const createUISlice = (set: unknown, get: unknown): UISlice => ({
  selectedMedia: [],
  searchQuery: '',
  currentView: 'grid',
  pagination: {
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1
  },

  setSearchQuery: (query: unknown) => set({ searchQuery: query }),
  setCurrentView: (view: unknown) => set({ currentView: view }),
  
  selectMedia: (mediaId: unknown) => set((state: unknown) => ({
    selectedMedia: [...state.selectedMedia, mediaId]
  })),
  
  deselectMedia: (mediaId: unknown) => set((state: unknown) => ({
    selectedMedia: state.selectedMedia.filter((id: string) => id !== mediaId)
  })),
  
  selectAllMedia: () => set((state: unknown) => ({
    selectedMedia: state.media.map((m: unknown) => m.id)
  })),
  
  clearSelection: () => set({ selectedMedia: [] }),
  
  toggleMediaSelection: (mediaId: unknown) => set((state: unknown) => ({
    selectedMedia: state.selectedMedia.includes(mediaId)
      ? state.selectedMedia.filter((id: string) => id !== mediaId)
      : [...state.selectedMedia, mediaId]
  })),
  
  setPage: (page: unknown) => set((state: unknown) => ({
    pagination: { ...state.pagination, current_page: page } )),
  
  setPerPage: (perPage: unknown) => set((state: unknown) => ({
    pagination: { ...state.pagination, per_page: perPage } )),
  
  nextPage: () => set((state: unknown) => ({
    pagination: {
      ...state.pagination,
      current_page: Math.min(state.pagination.current_page + 1, state.pagination.last_page)
  } )),
  
  prevPage: () => set((state: unknown) => ({
    pagination: {
      ...state.pagination,
      current_page: Math.max(state.pagination.current_page - 1, 1)
  } )),
  
  clearFilters: () => set({
    searchQuery: '',
    currentFolder: null,
    selectedMedia: []
  })
  });
