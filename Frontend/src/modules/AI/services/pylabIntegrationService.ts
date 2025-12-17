import axios from 'axios';

const PYLAB_API_URL = process.env.REACT_APP_PYLAB_API_URL || 'http://localhost:8000';

export const pylabIntegrationService = {
  async executeCode(code: string, model: string) {
    const response = await axios.post(`${PYLAB_API_URL}/execute`, { code, model });

    return (response as any).data as any;
  },

  async getModels() {
    const response = await axios.get(`${PYLAB_API_URL}/models`);

    return (response as any).data as any;
  },

  async getStatus() {
    const response = await axios.get(`${PYLAB_API_URL}/status`);

    return (response as any).data as any;
  },

  async analyzeText(text: string, options: unknown) {
    const response = await axios.post(`${PYLAB_API_URL}/analyze`, { text, ...options });

    return (response as any).data as any;
  },

  async generateImage(prompt: string, options: unknown) {
    const response = await axios.post(`${PYLAB_API_URL}/generate-image`, { prompt, ...options });

    return (response as any).data as any;
  } ;
