/**
 * Store principal do módulo EmailMarketing
 * Gerenciamento de estado global com Zustand e TypeScript
 */
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import emailMarketingService from '../services/emailMarketingService';

// Interfaces para tipos
interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  template_id?: string;
  segment_id?: string;
  send_date?: string;
  created_at: string;
  updated_at: string;
  metrics?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'html' | 'text' | 'responsive';
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EmailSegment {
  id: string;
  name: string;
  description?: string;
  criteria: any;
  subscriber_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EmailList {
  id: string;
  name: string;
  description?: string;
  subscriber_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EmailSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribed_at: string;
  tags?: string[];
}

interface AutomationFlow {
  id: string;
  name: string;
  trigger: string;
  conditions: any;
  actions: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EmailMarketingMetrics {
  total_campaigns: number;
  total_templates: number;
  total_segments: number;
  total_subscribers: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
}

interface EmailMarketingState {
  // Estado dos dados
  campaigns: EmailCampaign[];
  templates: EmailTemplate[];
  segments: EmailSegment[];
  emailLists: EmailList[];
  subscribers: EmailSubscriber[];
  automationFlows: AutomationFlow[];
  metrics: EmailMarketingMetrics | null;
  
  // Estado da UI
  loading: boolean;
  error: string | null;
  currentView: string;
  realTimeEnabled: boolean;
  lastRefresh: Date | null;
}

interface EmailMarketingActions {
  // Ações para campanhas
  fetchCampaigns: (params?: any) => Promise<void>;
  createCampaign: (campaignData: Partial<EmailCampaign>) => Promise<any>;
  updateCampaign: (id: string, campaignData: Partial<EmailCampaign>) => Promise<any>;
  deleteCampaign: (id: string) => Promise<void>;
  duplicateCampaign: (id: string) => Promise<any>;
  sendCampaign: (id: string) => Promise<any>;
  pauseCampaign: (id: string) => Promise<any>;
  resumeCampaign: (id: string) => Promise<any>;
  
  // Ações para templates
  fetchTemplates: (params?: any) => Promise<void>;
  createTemplate: (templateData: Partial<EmailTemplate>) => Promise<any>;
  updateTemplate: (id: string, templateData: Partial<EmailTemplate>) => Promise<any>;
  deleteTemplate: (id: string) => Promise<void>;
  duplicateTemplate: (id: string) => Promise<any>;
  previewTemplate: (id: string) => Promise<any>;
  
  // Ações para segmentos
  fetchSegments: (params?: any) => Promise<void>;
  createSegment: (segmentData: Partial<EmailSegment>) => Promise<any>;
  updateSegment: (id: string, segmentData: Partial<EmailSegment>) => Promise<any>;
  deleteSegment: (id: string) => Promise<void>;
  duplicateSegment: (id: string) => Promise<any>;
  getSegmentSubscribers: (id: string) => Promise<any>;
  
  // Ações para listas
  fetchEmailLists: (params?: any) => Promise<void>;
  createEmailList: (listData: Partial<EmailList>) => Promise<any>;
  updateEmailList: (id: string, listData: Partial<EmailList>) => Promise<any>;
  deleteEmailList: (id: string) => Promise<void>;
  
  // Ações para subscribers
  fetchSubscribers: (params?: any) => Promise<void>;
  createSubscriber: (subscriberData: Partial<EmailSubscriber>) => Promise<any>;
  updateSubscriber: (id: string, subscriberData: Partial<EmailSubscriber>) => Promise<any>;
  deleteSubscriber: (id: string) => Promise<void>;
  unsubscribeSubscriber: (id: string) => Promise<any>;
  
  // Ações para automação
  fetchAutomationFlows: (params?: any) => Promise<void>;
  createAutomationFlow: (flowData: Partial<AutomationFlow>) => Promise<any>;
  updateAutomationFlow: (id: string, flowData: Partial<AutomationFlow>) => Promise<any>;
  deleteAutomationFlow: (id: string) => Promise<void>;
  activateAutomationFlow: (id: string) => Promise<any>;
  deactivateAutomationFlow: (id: string) => Promise<any>;
  
  // Ações para métricas
  fetchMetrics: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  
  // Ações de UI
  setCurrentView: (view: string) => void;
  setRealTimeEnabled: (enabled: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  
  // Métodos utilitários
  getTotalCampaigns: () => number;
  getTotalTemplates: () => number;
  getTotalSegments: () => number;
  getTotalEmailLists: () => number;
  getTotalSubscribers: () => number;
  getActiveCampaigns: () => EmailCampaign[];
  getDraftCampaigns: () => EmailCampaign[];
  getSentCampaigns: () => EmailCampaign[];
  getActiveTemplates: () => EmailTemplate[];
  getActiveSegments: () => EmailSegment[];
  getActiveSubscribers: () => EmailSubscriber[];
}

type EmailMarketingStore = EmailMarketingState & EmailMarketingActions;

const useEmailMarketingStore = create<EmailMarketingStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Estado inicial
        campaigns: [],
        templates: [],
        segments: [],
        emailLists: [],
        subscribers: [],
        automationFlows: [],
        metrics: null,
        loading: false,
        error: null,
        currentView: 'overview',
        realTimeEnabled: false,
        lastRefresh: null,

        // Ações para campanhas
        fetchCampaigns: async (params: any = {}) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.getCampaigns(params);
            set((state) => {
              state.campaigns = data.data || [];
              state.loading = false;
              state.lastRefresh = new Date();
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
          }
        },

        createCampaign: async (campaignData: Partial<EmailCampaign>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.createCampaign(campaignData);
            set((state) => {
              state.campaigns.push(data.data);
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        updateCampaign: async (id: string, campaignData: Partial<EmailCampaign>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.updateCampaign(id, campaignData);
            set((state) => {
              const index = state.campaigns.findIndex(campaign => campaign.id === id);
              if (index !== -1) {
                state.campaigns[index] = { ...state.campaigns[index], ...data.data };
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        deleteCampaign: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            await emailMarketingService.deleteCampaign(id);
            set((state) => {
              state.campaigns = state.campaigns.filter(campaign => campaign.id !== id);
              state.loading = false;
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        duplicateCampaign: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.duplicateCampaign(id);
            set((state) => {
              state.campaigns.push(data.data);
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        sendCampaign: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.sendCampaign(id);
            set((state) => {
              const index = state.campaigns.findIndex(campaign => campaign.id === id);
              if (index !== -1) {
                state.campaigns[index].status = 'sending';
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        pauseCampaign: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.pauseCampaign(id);
            set((state) => {
              const index = state.campaigns.findIndex(campaign => campaign.id === id);
              if (index !== -1) {
                state.campaigns[index].status = 'paused';
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        resumeCampaign: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.resumeCampaign(id);
            set((state) => {
              const index = state.campaigns.findIndex(campaign => campaign.id === id);
              if (index !== -1) {
                state.campaigns[index].status = 'sending';
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        // Ações para templates
        fetchTemplates: async (params: any = {}) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.getTemplates(params);
            set((state) => {
              state.templates = data.data || [];
              state.loading = false;
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
          }
        },

        createTemplate: async (templateData: Partial<EmailTemplate>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.createTemplate(templateData);
            set((state) => {
              state.templates.push(data.data);
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        updateTemplate: async (id: string, templateData: Partial<EmailTemplate>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.updateTemplate(id, templateData);
            set((state) => {
              const index = state.templates.findIndex(template => template.id === id);
              if (index !== -1) {
                state.templates[index] = { ...state.templates[index], ...data.data };
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        deleteTemplate: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            await emailMarketingService.deleteTemplate(id);
            set((state) => {
              state.templates = state.templates.filter(template => template.id !== id);
              state.loading = false;
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        duplicateTemplate: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.duplicateTemplate(id);
            set((state) => {
              state.templates.push(data.data);
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        previewTemplate: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.previewTemplate(id);
            set((state) => {
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        // Ações para segmentos
        fetchSegments: async (params: any = {}) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.getSegments(params);
            set((state) => {
              state.segments = data.data || [];
              state.loading = false;
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
          }
        },

        createSegment: async (segmentData: Partial<EmailSegment>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.createSegment(segmentData);
            set((state) => {
              state.segments.push(data.data);
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        updateSegment: async (id: string, segmentData: Partial<EmailSegment>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.updateSegment(id, segmentData);
            set((state) => {
              const index = state.segments.findIndex(segment => segment.id === id);
              if (index !== -1) {
                state.segments[index] = { ...state.segments[index], ...data.data };
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        deleteSegment: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            await emailMarketingService.deleteSegment(id);
            set((state) => {
              state.segments = state.segments.filter(segment => segment.id !== id);
              state.loading = false;
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        duplicateSegment: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.duplicateSegment(id);
            set((state) => {
              state.segments.push(data.data);
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        getSegmentSubscribers: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.getSegmentSubscribers(id);
            set((state) => {
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        // Ações para listas
        fetchEmailLists: async (params: any = {}) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.getEmailLists(params);
            set((state) => {
              state.emailLists = data.data || [];
              state.loading = false;
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
          }
        },

        createEmailList: async (listData: Partial<EmailList>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.createEmailList(listData);
            set((state) => {
              state.emailLists.push(data.data);
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        updateEmailList: async (id: string, listData: Partial<EmailList>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.updateEmailList(id, listData);
            set((state) => {
              const index = state.emailLists.findIndex(list => list.id === id);
              if (index !== -1) {
                state.emailLists[index] = { ...state.emailLists[index], ...data.data };
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        deleteEmailList: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            await emailMarketingService.deleteEmailList(id);
            set((state) => {
              state.emailLists = state.emailLists.filter(list => list.id !== id);
              state.loading = false;
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        // Ações para subscribers
        fetchSubscribers: async (params: any = {}) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.getSubscribers(params);
            set((state) => {
              state.subscribers = data.data || [];
              state.loading = false;
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
          }
        },

        createSubscriber: async (subscriberData: Partial<EmailSubscriber>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.createSubscriber(subscriberData);
            set((state) => {
              state.subscribers.push(data.data);
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        updateSubscriber: async (id: string, subscriberData: Partial<EmailSubscriber>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.updateSubscriber(id, subscriberData);
            set((state) => {
              const index = state.subscribers.findIndex(subscriber => subscriber.id === id);
              if (index !== -1) {
                state.subscribers[index] = { ...state.subscribers[index], ...data.data };
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        deleteSubscriber: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            await emailMarketingService.deleteSubscriber(id);
            set((state) => {
              state.subscribers = state.subscribers.filter(subscriber => subscriber.id !== id);
              state.loading = false;
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        unsubscribeSubscriber: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.unsubscribeSubscriber(id);
            set((state) => {
              const index = state.subscribers.findIndex(subscriber => subscriber.id === id);
              if (index !== -1) {
                state.subscribers[index].status = 'unsubscribed';
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        // Ações para automação
        fetchAutomationFlows: async (params: any = {}) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.getAutomationFlows(params);
            set((state) => {
              state.automationFlows = data.data || [];
              state.loading = false;
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
          }
        },

        createAutomationFlow: async (flowData: Partial<AutomationFlow>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.createAutomationFlow(flowData);
            set((state) => {
              state.automationFlows.push(data.data);
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        updateAutomationFlow: async (id: string, flowData: Partial<AutomationFlow>) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.updateAutomationFlow(id, flowData);
            set((state) => {
              const index = state.automationFlows.findIndex(flow => flow.id === id);
              if (index !== -1) {
                state.automationFlows[index] = { ...state.automationFlows[index], ...data.data };
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        deleteAutomationFlow: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            await emailMarketingService.deleteAutomationFlow(id);
            set((state) => {
              state.automationFlows = state.automationFlows.filter(flow => flow.id !== id);
              state.loading = false;
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        activateAutomationFlow: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.activateAutomationFlow(id);
            set((state) => {
              const index = state.automationFlows.findIndex(flow => flow.id === id);
              if (index !== -1) {
                state.automationFlows[index].is_active = true;
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        deactivateAutomationFlow: async (id: string) => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.deactivateAutomationFlow(id);
            set((state) => {
              const index = state.automationFlows.findIndex(flow => flow.id === id);
              if (index !== -1) {
                state.automationFlows[index].is_active = false;
              }
              state.loading = false;
            });
            return data;
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
            throw error;
          }
        },

        // Ações para métricas
        fetchMetrics: async () => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.getMetrics();
            set((state) => {
              state.metrics = data.data;
              state.loading = false;
              state.lastRefresh = new Date();
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
          }
        },

        refreshMetrics: async () => {
          set((state) => {
            state.loading = true;
            state.error = null;
          });
          
          try {
            const data = await emailMarketingService.getMetrics();
            set((state) => {
              state.metrics = data.data;
              state.loading = false;
              state.lastRefresh = new Date();
            });
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
              state.loading = false;
            });
          }
        },

        // Ações de UI
        setCurrentView: (view: string) => {
          set((state) => {
            state.currentView = view;
          });
        },

        setRealTimeEnabled: (enabled: boolean) => {
          set((state) => {
            state.realTimeEnabled = enabled;
          });
        },

        setError: (error: string | null) => {
          set((state) => {
            state.error = error;
          });
        },

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },

        setLoading: (loading: boolean) => {
          set((state) => {
            state.loading = loading;
          });
        },

        // Métodos utilitários
        getTotalCampaigns: () => {
          const { campaigns } = get();
          return campaigns.length;
        },

        getTotalTemplates: () => {
          const { templates } = get();
          return templates.length;
        },

        getTotalSegments: () => {
          const { segments } = get();
          return segments.length;
        },

        getTotalEmailLists: () => {
          const { emailLists } = get();
          return emailLists.length;
        },

        getTotalSubscribers: () => {
          const { subscribers } = get();
          return subscribers.length;
        },

        getActiveCampaigns: () => {
          const { campaigns } = get();
          return campaigns.filter(campaign => campaign.status === 'sending' || campaign.status === 'sent');
        },

        getDraftCampaigns: () => {
          const { campaigns } = get();
          return campaigns.filter(campaign => campaign.status === 'draft');
        },

        getSentCampaigns: () => {
          const { campaigns } = get();
          return campaigns.filter(campaign => campaign.status === 'sent');
        },

        getActiveTemplates: () => {
          const { templates } = get();
          return templates.filter(template => template.is_active);
        },

        getActiveSegments: () => {
          const { segments } = get();
          return segments.filter(segment => segment.is_active);
        },

        getActiveSubscribers: () => {
          const { subscribers } = get();
          return subscribers.filter(subscriber => subscriber.status === 'active');
        },
      })),
      {
        name: 'email-marketing-store',
        partialize: (state) => ({
          campaigns: state.campaigns,
          templates: state.templates,
          segments: state.segments,
          emailLists: state.emailLists,
          subscribers: state.subscribers,
          automationFlows: state.automationFlows,
          metrics: state.metrics,
          currentView: state.currentView,
          realTimeEnabled: state.realTimeEnabled,
          lastRefresh: state.lastRefresh
        })
      }
    ),
    {
      name: 'email-marketing-store'
    }
  )
);

export default useEmailMarketingStore;
