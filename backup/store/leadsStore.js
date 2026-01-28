import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useLeadsStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // State
        leads: [],
        segments: [],
        tags: [],
        customFields: [],
        activities: [],
        currentLead: null,
        filters: {},
        loading: false,
        error: null,

        // Actions
        setLeads: (leads) => set({ leads }),
        addLead: (lead) => set((state) => ({
          leads: [...state.leads, lead]
        })),
        updateLead: (id, updates) => set((state) => ({
          leads: state.leads.map(l => l.id === id ? { ...l, ...updates } : l)
        })),
        deleteLead: (id) => set((state) => ({
          leads: state.leads.filter(l => l.id !== id)
        })),
        setCurrentLead: (lead) => set({ currentLead: lead }),

        setSegments: (segments) => set({ segments }),
        addSegment: (segment) => set((state) => ({
          segments: [...state.segments, segment]
        })),
        updateSegment: (id, updates) => set((state) => ({
          segments: state.segments.map(s => s.id === id ? { ...s, ...updates } : s)
        })),
        deleteSegment: (id) => set((state) => ({
          segments: state.segments.filter(s => s.id !== id)
        })),

        setTags: (tags) => set({ tags }),
        addTag: (tag) => set((state) => ({
          tags: [...state.tags, tag]
        })),
        updateTag: (id, updates) => set((state) => ({
          tags: state.tags.map(t => t.id === id ? { ...t, ...updates } : t)
        })),
        deleteTag: (id) => set((state) => ({
          tags: state.tags.filter(t => t.id !== id)
        })),

        setCustomFields: (fields) => set({ customFields: fields }),
        addCustomField: (field) => set((state) => ({
          customFields: [...state.customFields, field]
        })),
        updateCustomField: (id, updates) => set((state) => ({
          customFields: state.customFields.map(f => f.id === id ? { ...f, ...updates } : f)
        })),
        deleteCustomField: (id) => set((state) => ({
          customFields: state.customFields.filter(f => f.id !== id)
        })),

        setActivities: (activities) => set({ activities }),
        addActivity: (activity) => set((state) => ({
          activities: [...state.activities, activity]
        })),

        setFilters: (filters) => set({ filters }),
        updateFilter: (key, value) => set((state) => ({
          filters: { ...state.filters, [key]: value }
        })),
        clearFilters: () => set({ filters: {} }),

        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        // Reset
        reset: () => set({
          leads: [],
          segments: [],
          tags: [],
          customFields: [],
          activities: [],
          currentLead: null,
          filters: {},
          loading: false,
          error: null
        })
      }),
      {
        name: 'leads-store',
        partialize: (state) => ({
          leads: state.leads,
          segments: state.segments,
          tags: state.tags,
          customFields: state.customFields
        })
      }
    ),
    {
      name: 'leads-store'
    }
  )
);

export default useLeadsStore;