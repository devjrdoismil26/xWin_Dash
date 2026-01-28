import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useWorkflowsStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // State
        workflows: [],
        nodes: [],
        connections: [],
        executions: [],
        currentWorkflow: null,
        selectedNode: null,
        isExecuting: false,
        loading: false,
        error: null,

        // Actions
        setWorkflows: (workflows) => set({ workflows }),
        addWorkflow: (workflow) => set((state) => ({
          workflows: [...state.workflows, workflow]
        })),
        updateWorkflow: (id, updates) => set((state) => ({
          workflows: state.workflows.map(w => w.id === id ? { ...w, ...updates } : w)
        })),
        deleteWorkflow: (id) => set((state) => ({
          workflows: state.workflows.filter(w => w.id !== id)
        })),
        setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),

        setNodes: (nodes) => set({ nodes }),
        addNode: (node) => set((state) => ({
          nodes: [...state.nodes, node]
        })),
        updateNode: (id, updates) => set((state) => ({
          nodes: state.nodes.map(n => n.id === id ? { ...n, ...updates } : n)
        })),
        deleteNode: (id) => set((state) => ({
          nodes: state.nodes.filter(n => n.id !== id)
        })),
        setSelectedNode: (node) => set({ selectedNode: node }),

        setConnections: (connections) => set({ connections }),
        addConnection: (connection) => set((state) => ({
          connections: [...state.connections, connection]
        })),
        updateConnection: (id, updates) => set((state) => ({
          connections: state.connections.map(c => c.id === id ? { ...c, ...updates } : c)
        })),
        deleteConnection: (id) => set((state) => ({
          connections: state.connections.filter(c => c.id !== id)
        })),

        setExecutions: (executions) => set({ executions }),
        addExecution: (execution) => set((state) => ({
          executions: [...state.executions, execution]
        })),

        setIsExecuting: (isExecuting) => set({ isExecuting }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        // Reset
        reset: () => set({
          workflows: [],
          nodes: [],
          connections: [],
          executions: [],
          currentWorkflow: null,
          selectedNode: null,
          isExecuting: false,
          loading: false,
          error: null
        })
      }),
      {
        name: 'workflows-store',
        partialize: (state) => ({
          workflows: state.workflows,
          nodes: state.nodes,
          connections: state.connections
        })
      }
    ),
    {
      name: 'workflows-store'
    }
  )
);

export default useWorkflowsStore;