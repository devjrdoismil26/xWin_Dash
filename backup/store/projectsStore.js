import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useProjectsStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // State
        projects: [],
        members: [],
        currentProject: null,
        selectedProject: null,
        loading: false,
        error: null,

        // Actions
        setProjects: (projects) => set({ projects }),
        addProject: (project) => set((state) => ({
          projects: [...state.projects, project]
        })),
        updateProject: (id, updates) => set((state) => ({
          projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
        })),
        deleteProject: (id) => set((state) => ({
          projects: state.projects.filter(p => p.id !== id)
        })),
        setCurrentProject: (project) => set({ currentProject: project }),
        setSelectedProject: (project) => set({ selectedProject: project }),

        setMembers: (members) => set({ members }),
        addMember: (member) => set((state) => ({
          members: [...state.members, member]
        })),
        updateMember: (id, updates) => set((state) => ({
          members: state.members.map(m => m.id === id ? { ...m, ...updates } : m)
        })),
        removeMember: (id) => set((state) => ({
          members: state.members.filter(m => m.id !== id)
        })),

        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        // Reset
        reset: () => set({
          projects: [],
          members: [],
          currentProject: null,
          selectedProject: null,
          loading: false,
          error: null
        })
      }),
      {
        name: 'projects-store',
        partialize: (state) => ({
          projects: state.projects,
          selectedProject: state.selectedProject
        })
      }
    ),
    {
      name: 'projects-store'
    }
  )
);

export default useProjectsStore;