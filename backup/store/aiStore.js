import axios from "axios";
import create from "zustand";

const useAIStore = create((set) => ({
  integrations: [],
  prompts: [],
  isLoading: false,
  error: null,

  fetchIntegrations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/ai/integrations");
      set({ integrations: response.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Erro ao carregar integrações IA",
        isLoading: false,
      });
    }
  },

  fetchPrompts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/ai/prompts");
      set({ prompts: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Erro ao carregar prompts",
        isLoading: false,
      });
    }
  },

  createPrompt: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post("/api/ai/prompts", data);
      set((state) => ({
        prompts: [...state.prompts, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Erro ao criar prompt",
        isLoading: false,
      });
      throw error;
    }
  },

  deletePrompt: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/ai/prompts/id`);
      set((state) => ({
        prompts: state.prompts.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Erro ao deletar prompt",
        isLoading: false,
      });
    }
  },
}));

export default useAIStore;
