// ========================================
// WORKFLOW NODE TYPES
// ========================================
// Mapeamento completo dos tipos de nós baseado nos executores do backend

import { nodeConfigs, nodeTypeMapping } from './nodeConfigs';

// ===== NODE TYPES BY CATEGORY =====
export const nodeTypes = {
  // ===== TRIGGERS =====
  triggers: {
    webhook: {
      type: 'webhook',
      name: 'Webhook',
      description: 'Trigger workflow via HTTP webhook',
      icon: 'Webhook',
      category: 'triggers',
      color: '#10B981',
      inputs: [],
      outputs: ['data'],
      config: nodeConfigs.triggers.webhook.config
    },
    schedule: {
      type: 'schedule',
      name: 'Schedule',
      description: 'Trigger workflow on schedule',
      icon: 'Clock',
      category: 'triggers',
      color: '#10B981',
      inputs: [],
      outputs: ['data'],
      config: nodeConfigs.triggers.schedule.config
    },
    manual: {
      type: 'manual',
      name: 'Manual Trigger',
      description: 'Manual workflow trigger',
      icon: 'Play',
      category: 'triggers',
      color: '#10B981',
      inputs: [],
      outputs: ['data'],
      config: nodeConfigs.triggers.manual.config
    }
  },

  // ===== AI & ANALYTICS =====
  ai: {
    generateText: {
      type: 'ai_generate_text',
      name: 'AI Generate Text',
      description: 'Generate text using AI',
      icon: 'Bot',
      category: 'ai',
      color: '#8B5CF6',
      inputs: ['data'],
      outputs: ['text'],
      config: nodeConfigs.ai.generateText.config
    },
    generateImage: {
      type: 'ai_generate_image',
      name: 'AI Generate Image',
      description: 'Generate image using AI',
      icon: 'Image',
      category: 'ai',
      color: '#8B5CF6',
      inputs: ['data'],
      outputs: ['image'],
      config: nodeConfigs.ai.generateImage.config
    },
    analyzeText: {
      type: 'ai_analyze_text',
      name: 'AI Analyze Text',
      description: 'Analyze text using AI',
      icon: 'Search',
      category: 'ai',
      color: '#8B5CF6',
      inputs: ['data'],
      outputs: ['analysis'],
      config: nodeConfigs.ai.analyzeText.config
    },
    textAnalysis: {
      type: 'ai_text_analysis',
      name: 'AI Text Analysis',
      description: 'Advanced text analysis',
      icon: 'FileText',
      category: 'ai',
      color: '#8B5CF6',
      inputs: ['data'],
      outputs: ['analysis'],
      config: nodeConfigs.ai.textAnalysis.config
    }
  },

  // ===== SOCIAL MEDIA =====
  social: {
    automation: {
      type: 'social_media_automation',
      name: 'Social Media Automation',
      description: 'Automate social media actions',
      icon: 'Share2',
      category: 'social',
      color: '#3B82F6',
      inputs: ['data'],
      outputs: ['result'],
      config: nodeConfigs.social.automation.config
    },
    publishImmediately: {
      type: 'publish_social_post_immediately',
      name: 'Publish Social Post',
      description: 'Publish social media post immediately',
      icon: 'Send',
      category: 'social',
      color: '#3B82F6',
      inputs: ['data'],
      outputs: ['post'],
      config: nodeConfigs.social.publishImmediately.config
    },
    schedulePost: {
      type: 'schedule_social_post',
      name: 'Schedule Social Post',
      description: 'Schedule social media post',
      icon: 'Calendar',
      category: 'social',
      color: '#3B82F6',
      inputs: ['data'],
      outputs: ['scheduled'],
      config: nodeConfigs.social.schedulePost.config
    },
    getInsights: {
      type: 'get_social_post_insights',
      name: 'Get Social Insights',
      description: 'Get social media post insights',
      icon: 'BarChart3',
      category: 'social',
      color: '#3B82F6',
      inputs: ['data'],
      outputs: ['insights'],
      config: nodeConfigs.social.getInsights.config
    }
  },

  // ===== EMAIL & COMMUNICATION =====
  communication: {
    email: {
      type: 'send_email',
      name: 'Send Email',
      description: 'Send email message',
      icon: 'Mail',
      category: 'communication',
      color: '#F59E0B',
      inputs: ['data'],
      outputs: ['sent'],
      config: nodeConfigs.communication.email.config
    },
    emailCampaign: {
      type: 'email_campaign',
      name: 'Email Campaign',
      description: 'Send email campaign',
      icon: 'Users',
      category: 'communication',
      color: '#F59E0B',
      inputs: ['data'],
      outputs: ['campaign'],
      config: nodeConfigs.communication.emailCampaign.config
    },
    whatsapp: {
      type: 'send_whatsapp_message',
      name: 'WhatsApp Message',
      description: 'Send WhatsApp message',
      icon: 'MessageCircle',
      category: 'communication',
      color: '#F59E0B',
      inputs: ['data'],
      outputs: ['sent'],
      config: nodeConfigs.communication.whatsapp.config
    },
    discord: {
      type: 'discord_message',
      name: 'Discord Message',
      description: 'Send Discord message',
      icon: 'MessageSquare',
      category: 'communication',
      color: '#F59E0B',
      inputs: ['data'],
      outputs: ['sent'],
      config: nodeConfigs.communication.discord.config
    },
    slack: {
      type: 'slack_message',
      name: 'Slack Message',
      description: 'Send Slack message',
      icon: 'Slack',
      category: 'communication',
      color: '#F59E0B',
      inputs: ['data'],
      outputs: ['sent'],
      config: nodeConfigs.communication.slack.config
    }
  },

  // ===== DATA PROCESSING =====
  data: {
    transform: {
      type: 'transform_data',
      name: 'Transform Data',
      description: 'Transform data structure',
      icon: 'RefreshCw',
      category: 'data',
      color: '#06B6D4',
      inputs: ['data'],
      outputs: ['transformed'],
      config: nodeConfigs.data.transform.config
    },
    merge: {
      type: 'merge_data',
      name: 'Merge Data',
      description: 'Merge multiple data sources',
      icon: 'GitMerge',
      category: 'data',
      color: '#06B6D4',
      inputs: ['data1', 'data2'],
      outputs: ['merged'],
      config: nodeConfigs.data.merge.config
    },
    extract: {
      type: 'extract_data',
      name: 'Extract Data',
      description: 'Extract data from source',
      icon: 'Download',
      category: 'data',
      color: '#06B6D4',
      inputs: ['data'],
      outputs: ['extracted'],
      config: nodeConfigs.data.extract.config
    }
  },

  // ===== INTEGRATIONS =====
  integrations: {
    apiCall: {
      type: 'api_call',
      name: 'API Call',
      description: 'Make HTTP API call',
      icon: 'Globe',
      category: 'integrations',
      color: '#84CC16',
      inputs: ['data'],
      outputs: ['response'],
      config: nodeConfigs.integrations.apiCall.config
    },
    customWebhook: {
      type: 'custom_webhook',
      name: 'Custom Webhook',
      description: 'Custom webhook integration',
      icon: 'Webhook',
      category: 'integrations',
      color: '#84CC16',
      inputs: ['data'],
      outputs: ['response'],
      config: nodeConfigs.integrations.customWebhook.config
    },
    zapierWebhook: {
      type: 'zapier_webhook',
      name: 'Zapier Webhook',
      description: 'Zapier webhook integration',
      icon: 'Zap',
      category: 'integrations',
      color: '#84CC16',
      inputs: ['data'],
      outputs: ['response'],
      config: nodeConfigs.integrations.zapierWebhook.config
    },
    googleSheets: {
      type: 'google_sheets',
      name: 'Google Sheets',
      description: 'Google Sheets integration',
      icon: 'Table',
      category: 'integrations',
      color: '#84CC16',
      inputs: ['data'],
      outputs: ['result'],
      config: nodeConfigs.integrations.googleSheets.config
    }
  },

  // ===== LEAD MANAGEMENT =====
  leads: {
    createLead: {
      type: 'create_lead',
      name: 'Create Lead',
      description: 'Create new lead',
      icon: 'UserPlus',
      category: 'leads',
      color: '#EF4444',
      inputs: ['data'],
      outputs: ['lead'],
      config: nodeConfigs.leads.createLead.config
    },
    updateLead: {
      type: 'update_lead',
      name: 'Update Lead',
      description: 'Update existing lead',
      icon: 'UserEdit',
      category: 'leads',
      color: '#EF4444',
      inputs: ['data'],
      outputs: ['updated'],
      config: nodeConfigs.leads.updateLead.config
    },
    leadFieldMatches: {
      type: 'lead_field_matches',
      name: 'Lead Field Matches',
      description: 'Check if lead field matches condition',
      icon: 'CheckCircle',
      category: 'leads',
      color: '#EF4444',
      inputs: ['data'],
      outputs: ['matches'],
      config: nodeConfigs.leads.leadFieldMatches.config
    }
  },

  // ===== CAMPAIGN MANAGEMENT =====
  campaigns: {
    createADSCampaign: {
      type: 'create_ads_campaign',
      name: 'Create ADS Campaign',
      description: 'Create advertising campaign',
      icon: 'Target',
      category: 'campaigns',
      color: '#F97316',
      inputs: ['data'],
      outputs: ['campaign'],
      config: nodeConfigs.campaigns.createADSCampaign.config
    },
    adjustBudget: {
      type: 'adjust_budget',
      name: 'Adjust Budget',
      description: 'Adjust campaign budget',
      icon: 'DollarSign',
      category: 'campaigns',
      color: '#F97316',
      inputs: ['data'],
      outputs: ['adjusted'],
      config: nodeConfigs.campaigns.adjustBudget.config
    },
    pauseCampaign: {
      type: 'pause_campaign',
      name: 'Pause Campaign',
      description: 'Pause advertising campaign',
      icon: 'Pause',
      category: 'campaigns',
      color: '#F97316',
      inputs: ['data'],
      outputs: ['paused'],
      config: nodeConfigs.campaigns.pauseCampaign.config
    },
    adsToolCampaignStatus: {
      type: 'ads_tool_campaign_status',
      name: 'ADS Tool Campaign Status',
      description: 'Check campaign status in ADS tool',
      icon: 'Activity',
      category: 'campaigns',
      color: '#F97316',
      inputs: ['data'],
      outputs: ['status'],
      config: nodeConfigs.campaigns.adsToolCampaignStatus.config
    }
  },

  // ===== CONTROL FLOW =====
  control: {
    ifElse: {
      type: 'if_else',
      name: 'If/Else',
      description: 'Conditional branching',
      icon: 'GitBranch',
      category: 'control',
      color: '#6366F1',
      inputs: ['data'],
      outputs: ['true', 'false'],
      config: nodeConfigs.control.ifElse.config
    },
    loop: {
      type: 'loop',
      name: 'Loop',
      description: 'Loop through collection',
      icon: 'Repeat',
      category: 'control',
      color: '#6366F1',
      inputs: ['data'],
      outputs: ['item', 'index'],
      config: nodeConfigs.control.loop.config
    },
    delay: {
      type: 'delay',
      name: 'Delay',
      description: 'Add delay to workflow',
      icon: 'Clock',
      category: 'control',
      color: '#6366F1',
      inputs: ['data'],
      outputs: ['data'],
      config: nodeConfigs.control.delay.config
    }
  },

  // ===== MEDIA PROCESSING =====
  media: {
    uploadMedia: {
      type: 'upload_media',
      name: 'Upload Media',
      description: 'Upload media file',
      icon: 'Upload',
      category: 'media',
      color: '#EC4899',
      inputs: ['data'],
      outputs: ['media'],
      config: nodeConfigs.media.uploadMedia.config
    },
    mediaProcessing: {
      type: 'media_processing',
      name: 'Media Processing',
      description: 'Process media files',
      icon: 'Image',
      category: 'media',
      color: '#EC4899',
      inputs: ['data'],
      outputs: ['processed'],
      config: nodeConfigs.media.mediaProcessing.config
    }
  },

  // ===== AURA INTEGRATION =====
  aura: {
    startAuraUraFlow: {
      type: 'start_aura_ura_flow',
      name: 'Start Aura URA Flow',
      description: 'Start Aura URA conversation flow',
      icon: 'MessageCircle',
      category: 'aura',
      color: '#14B8A6',
      inputs: ['data'],
      outputs: ['flow'],
      config: nodeConfigs.aura.startAuraUraFlow.config
    },
    assignAuraChat: {
      type: 'assign_aura_chat',
      name: 'Assign Aura Chat',
      description: 'Assign chat to Aura agent',
      icon: 'UserCheck',
      category: 'aura',
      color: '#14B8A6',
      inputs: ['data'],
      outputs: ['assigned'],
      config: nodeConfigs.aura.assignAuraChat.config
    },
    closeAuraChat: {
      type: 'close_aura_chat',
      name: 'Close Aura Chat',
      description: 'Close Aura chat session',
      icon: 'XCircle',
      category: 'aura',
      color: '#14B8A6',
      inputs: ['data'],
      outputs: ['closed'],
      config: nodeConfigs.aura.closeAuraChat.config
    }
  },

  // ===== ANALYTICS =====
  analytics: {
    analyticsReport: {
      type: 'analytics_report',
      name: 'Analytics Report',
      description: 'Generate analytics report',
      icon: 'BarChart3',
      category: 'analytics',
      color: '#8B5CF6',
      inputs: ['data'],
      outputs: ['report'],
      config: nodeConfigs.analytics.analyticsReport.config
    }
  },

  // ===== WORKFLOW CONTROL =====
  workflow: {
    triggerWorkflow: {
      type: 'trigger_workflow',
      name: 'Trigger Workflow',
      description: 'Trigger another workflow',
      icon: 'Play',
      category: 'workflow',
      color: '#6B7280',
      inputs: ['data'],
      outputs: ['triggered'],
      config: nodeConfigs.workflow.triggerWorkflow.config
    }
  }
};

// ===== FLATTENED NODE TYPES =====
export const allNodeTypes = {
  ...Object.values(nodeTypes.triggers).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.ai).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.social).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.communication).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.data).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.integrations).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.leads).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.campaigns).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.control).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.media).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.aura).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.analytics).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeTypes.workflow).reduce((acc, node) => ({ ...acc, [node.type]: node }), {})
};

// ===== UTILITY FUNCTIONS =====
export const getNodeType = (nodeType) => {
  return allNodeTypes[nodeType] || null;
};

export const getNodeTypesByCategory = (category) => {
  return nodeTypes[category] || {};
};

export const getAllNodeTypes = () => {
  return Object.keys(allNodeTypes);
};

export const getNodeCategories = () => {
  return Object.keys(nodeTypes);
};

export const getNodeTypeCount = () => {
  return Object.keys(allNodeTypes).length;
};

export const getNodeTypesByInput = (inputType) => {
  return Object.values(allNodeTypes).filter(node => 
    node.inputs.includes(inputType)
  );
};

export const getNodeTypesByOutput = (outputType) => {
  return Object.values(allNodeTypes).filter(node => 
    node.outputs.includes(outputType)
  );
};

export default nodeTypes;