import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useEmailMarketingStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // State
        campaigns: [],
        templates: [],
        segments: [],
        subscribers: [],
        currentCampaign: null,
        currentTemplate: null,
        loading: false,
        error: null,

        // Actions
        setCampaigns: (campaigns) => set({ campaigns }),
        addCampaign: (campaign) => set((state) => ({
          campaigns: [...state.campaigns, campaign]
        })),
        updateCampaign: (id, updates) => set((state) => ({
          campaigns: state.campaigns.map(c => c.id === id ? { ...c, ...updates } : c)
        })),
        deleteCampaign: (id) => set((state) => ({
          campaigns: state.campaigns.filter(c => c.id !== id)
        })),
        setCurrentCampaign: (campaign) => set({ currentCampaign: campaign }),

        setTemplates: (templates) => set({ templates }),
        addTemplate: (template) => set((state) => ({
          templates: [...state.templates, template]
        })),
        updateTemplate: (id, updates) => set((state) => ({
          templates: state.templates.map(t => t.id === id ? { ...t, ...updates } : t)
        })),
        deleteTemplate: (id) => set((state) => ({
          templates: state.templates.filter(t => t.id !== id)
        })),
        setCurrentTemplate: (template) => set({ currentTemplate: template }),

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

        setSubscribers: (subscribers) => set({ subscribers }),
        addSubscriber: (subscriber) => set((state) => ({
          subscribers: [...state.subscribers, subscriber]
        })),
        updateSubscriber: (id, updates) => set((state) => ({
          subscribers: state.subscribers.map(s => s.id === id ? { ...s, ...updates } : s)
        })),
        deleteSubscriber: (id) => set((state) => ({
          subscribers: state.subscribers.filter(s => s.id !== id)
        })),

        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        // Reset
        reset: () => set({
          campaigns: [],
          templates: [],
          segments: [],
          subscribers: [],
          currentCampaign: null,
          currentTemplate: null,
          loading: false,
          error: null
        })
      }),
      {
        name: 'email-marketing-store',
        partialize: (state) => ({
          campaigns: state.campaigns,
          templates: state.templates,
          segments: state.segments
        })
      }
    ),
    {
      name: 'email-marketing-store'
    }
  )
);

export default useEmailMarketingStore;