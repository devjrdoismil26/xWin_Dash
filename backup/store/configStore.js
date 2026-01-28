import axios from "axios";
import create from "zustand";

const useConfigStore = create((set) => ({
  configs: [],
  isLoading: false,
  error: null,

  fetchConfigs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("/api/configs");
      set({ configs: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Erro ao carregar configs",
        isLoading: false,
      });
    }
  },

  updateConfig: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/api/configs/id`, data);
      set((state) => ({
        configs: state.configs.map((c) => (c.id === id ? response.data : c)),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Erro ao atualizar config",
        isLoading: false,
      });
      throw error;
    }
  },

  // Verificar configuração da API Gemini
  checkGeminiConfig: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.post("/api/configs/check-gemini");
      return response.data.isValid;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Erro ao verificar API Gemini",
        isLoading: false,
      });
      return false;
    }
  },

  // Verificar configuração do SMTP
  checkSMTPConfig: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.post("/api/configs/check-smtp");
      return response.data.isValid;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Erro ao verificar configuração SMTP",
        isLoading: false,
      });
      return false;
    }
  },
}));

export default useConfigStore;
