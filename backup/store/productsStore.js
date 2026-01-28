import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useProductsStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // State
        products: [],
        landingPages: [],
        leadCaptureForms: [],
        currentProduct: null,
        currentLandingPage: null,
        loading: false,
        error: null,

        // Actions
        setProducts: (products) => set({ products }),
        addProduct: (product) => set((state) => ({
          products: [...state.products, product]
        })),
        updateProduct: (id, updates) => set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
        })),
        deleteProduct: (id) => set((state) => ({
          products: state.products.filter(p => p.id !== id)
        })),
        setCurrentProduct: (product) => set({ currentProduct: product }),

        setLandingPages: (landingPages) => set({ landingPages }),
        addLandingPage: (landingPage) => set((state) => ({
          landingPages: [...state.landingPages, landingPage]
        })),
        updateLandingPage: (id, updates) => set((state) => ({
          landingPages: state.landingPages.map(lp => lp.id === id ? { ...lp, ...updates } : lp)
        })),
        deleteLandingPage: (id) => set((state) => ({
          landingPages: state.landingPages.filter(lp => lp.id !== id)
        })),
        setCurrentLandingPage: (landingPage) => set({ currentLandingPage: landingPage }),

        setLeadCaptureForms: (forms) => set({ leadCaptureForms: forms }),
        addLeadCaptureForm: (form) => set((state) => ({
          leadCaptureForms: [...state.leadCaptureForms, form]
        })),
        updateLeadCaptureForm: (id, updates) => set((state) => ({
          leadCaptureForms: state.leadCaptureForms.map(f => f.id === id ? { ...f, ...updates } : f)
        })),
        deleteLeadCaptureForm: (id) => set((state) => ({
          leadCaptureForms: state.leadCaptureForms.filter(f => f.id !== id)
        })),

        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        // Reset
        reset: () => set({
          products: [],
          landingPages: [],
          leadCaptureForms: [],
          currentProduct: null,
          currentLandingPage: null,
          loading: false,
          error: null
        })
      }),
      {
        name: 'products-store',
        partialize: (state) => ({
          products: state.products,
          landingPages: state.landingPages,
          leadCaptureForms: state.leadCaptureForms
        })
      }
    ),
    {
      name: 'products-store'
    }
  )
);

export default useProductsStore;