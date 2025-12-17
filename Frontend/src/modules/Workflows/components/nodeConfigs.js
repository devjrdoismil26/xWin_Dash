// ========================================
// WORKFLOW NODE CONFIGURATIONS
// ========================================
// Mapeamento completo dos tipos de nós disponíveis no backend
// Baseado nos 42 executores disponíveis

export const nodeConfigs = {
  // ===== TRIGGERS =====
  triggers: {
    webhook: {
      type: 'webhook',
      name: 'Webhook',
      description: 'Trigger workflow via HTTP webhook',
      icon: 'Webhook',
      category: 'triggers',
      inputs: [],
      outputs: ['data'],
      config: {
        path: { type: 'string', required: true, default: '/webhook' },
        method: { type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'POST' },
        authentication: { type: 'select', options: ['none', 'basic', 'bearer'], default: 'none' },
        headers: { type: 'object', default: {} }
      }
    },
    schedule: {
      type: 'schedule',
      name: 'Schedule',
      description: 'Trigger workflow on schedule',
      icon: 'Clock',
      category: 'triggers',
      inputs: [],
      outputs: ['data'],
      config: {
        cron: { type: 'string', required: true, default: '0 0 * * *' },
        timezone: { type: 'string', default: 'UTC' }
      }
    },
    manual: {
      type: 'manual',
      name: 'Manual Trigger',
      description: 'Manual workflow trigger',
      icon: 'Play',
      category: 'triggers',
      inputs: [],
      outputs: ['data'],
      config: {}
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
      inputs: ['data'],
      outputs: ['text'],
      config: {
        provider: { type: 'select', options: ['openai', 'gemini', 'claude'], required: true },
        model: { type: 'string', required: true, default: 'gpt-3.5-turbo' },
        prompt: { type: 'text', required: true },
        maxTokens: { type: 'number', default: 1000 },
        temperature: { type: 'number', min: 0, max: 2, default: 0.7 }
      }
    },
    generateImage: {
      type: 'ai_generate_image',
      name: 'AI Generate Image',
      description: 'Generate image using AI',
      icon: 'Image',
      category: 'ai',
      inputs: ['data'],
      outputs: ['image'],
      config: {
        provider: { type: 'select', options: ['openai', 'stability', 'midjourney'], required: true },
        prompt: { type: 'text', required: true },
        size: { type: 'select', options: ['256x256', '512x512', '1024x1024'], default: '512x512' },
        quality: { type: 'select', options: ['standard', 'hd'], default: 'standard' }
      }
    },
    analyzeText: {
      type: 'ai_analyze_text',
      name: 'AI Analyze Text',
      description: 'Analyze text using AI',
      icon: 'Search',
      category: 'ai',
      inputs: ['data'],
      outputs: ['analysis'],
      config: {
        provider: { type: 'select', options: ['openai', 'gemini'], required: true },
        analysisType: { type: 'select', options: ['sentiment', 'emotion', 'intent', 'summary'], required: true },
        text: { type: 'text', required: true }
      }
    },
    textAnalysis: {
      type: 'ai_text_analysis',
      name: 'AI Text Analysis',
      description: 'Advanced text analysis',
      icon: 'FileText',
      category: 'ai',
      inputs: ['data'],
      outputs: ['analysis'],
      config: {
        provider: { type: 'select', options: ['openai', 'gemini'], required: true },
        analysisTypes: { type: 'array', options: ['sentiment', 'emotion', 'intent', 'summary', 'keywords'], default: ['sentiment'] },
        text: { type: 'text', required: true }
      }
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
      inputs: ['data'],
      outputs: ['result'],
      config: {
        platform: { type: 'select', options: ['facebook', 'instagram', 'twitter', 'linkedin'], required: true },
        action: { type: 'select', options: ['post', 'like', 'follow', 'comment'], required: true },
        content: { type: 'text', required: true },
        schedule: { type: 'datetime' }
      }
    },
    publishImmediately: {
      type: 'publish_social_post_immediately',
      name: 'Publish Social Post',
      description: 'Publish social media post immediately',
      icon: 'Send',
      category: 'social',
      inputs: ['data'],
      outputs: ['post'],
      config: {
        platform: { type: 'select', options: ['facebook', 'instagram', 'twitter', 'linkedin'], required: true },
        content: { type: 'text', required: true },
        media: { type: 'file', multiple: true },
        hashtags: { type: 'array' }
      }
    },
    schedulePost: {
      type: 'schedule_social_post',
      name: 'Schedule Social Post',
      description: 'Schedule social media post',
      icon: 'Calendar',
      category: 'social',
      inputs: ['data'],
      outputs: ['scheduled'],
      config: {
        platform: { type: 'select', options: ['facebook', 'instagram', 'twitter', 'linkedin'], required: true },
        content: { type: 'text', required: true },
        scheduleTime: { type: 'datetime', required: true },
        media: { type: 'file', multiple: true }
      }
    },
    getInsights: {
      type: 'get_social_post_insights',
      name: 'Get Social Insights',
      description: 'Get social media post insights',
      icon: 'BarChart3',
      category: 'social',
      inputs: ['data'],
      outputs: ['insights'],
      config: {
        platform: { type: 'select', options: ['facebook', 'instagram', 'twitter', 'linkedin'], required: true },
        postId: { type: 'string', required: true },
        metrics: { type: 'array', options: ['likes', 'shares', 'comments', 'reach', 'impressions'], default: ['likes', 'shares'] }
      }
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
      inputs: ['data'],
      outputs: ['sent'],
      config: {
        to: { type: 'email', required: true },
        subject: { type: 'string', required: true },
        body: { type: 'text', required: true },
        from: { type: 'email' },
        cc: { type: 'email', multiple: true },
        bcc: { type: 'email', multiple: true },
        attachments: { type: 'file', multiple: true }
      }
    },
    emailCampaign: {
      type: 'email_campaign',
      name: 'Email Campaign',
      description: 'Send email campaign',
      icon: 'Users',
      category: 'communication',
      inputs: ['data'],
      outputs: ['campaign'],
      config: {
        template: { type: 'select', required: true },
        recipients: { type: 'array', required: true },
        subject: { type: 'string', required: true },
        personalization: { type: 'object' }
      }
    },
    whatsapp: {
      type: 'send_whatsapp_message',
      name: 'WhatsApp Message',
      description: 'Send WhatsApp message',
      icon: 'MessageCircle',
      category: 'communication',
      inputs: ['data'],
      outputs: ['sent'],
      config: {
        to: { type: 'string', required: true },
        message: { type: 'text', required: true },
        media: { type: 'file' }
      }
    },
    discord: {
      type: 'discord_message',
      name: 'Discord Message',
      description: 'Send Discord message',
      icon: 'MessageSquare',
      category: 'communication',
      inputs: ['data'],
      outputs: ['sent'],
      config: {
        channel: { type: 'string', required: true },
        message: { type: 'text', required: true },
        embed: { type: 'object' }
      }
    },
    slack: {
      type: 'slack_message',
      name: 'Slack Message',
      description: 'Send Slack message',
      icon: 'Slack',
      category: 'communication',
      inputs: ['data'],
      outputs: ['sent'],
      config: {
        channel: { type: 'string', required: true },
        message: { type: 'text', required: true },
        blocks: { type: 'array' }
      }
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
      inputs: ['data'],
      outputs: ['transformed'],
      config: {
        transformation: { type: 'select', options: ['map', 'filter', 'reduce', 'custom'], required: true },
        mapping: { type: 'object' },
        customScript: { type: 'text' }
      }
    },
    merge: {
      type: 'merge_data',
      name: 'Merge Data',
      description: 'Merge multiple data sources',
      icon: 'GitMerge',
      category: 'data',
      inputs: ['data1', 'data2'],
      outputs: ['merged'],
      config: {
        mergeType: { type: 'select', options: ['concat', 'merge', 'join'], required: true },
        key: { type: 'string' },
        strategy: { type: 'select', options: ['left', 'right', 'inner', 'outer'], default: 'inner' }
      }
    },
    extract: {
      type: 'extract_data',
      name: 'Extract Data',
      description: 'Extract data from source',
      icon: 'Download',
      category: 'data',
      inputs: ['data'],
      outputs: ['extracted'],
      config: {
        source: { type: 'select', options: ['json', 'xml', 'csv', 'html'], required: true },
        path: { type: 'string', required: true },
        format: { type: 'select', options: ['object', 'array', 'string'], default: 'object' }
      }
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
      inputs: ['data'],
      outputs: ['response'],
      config: {
        url: { type: 'url', required: true },
        method: { type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], required: true },
        headers: { type: 'object' },
        body: { type: 'text' },
        authentication: { type: 'select', options: ['none', 'basic', 'bearer', 'api-key'], default: 'none' }
      }
    },
    customWebhook: {
      type: 'custom_webhook',
      name: 'Custom Webhook',
      description: 'Custom webhook integration',
      icon: 'Webhook',
      category: 'integrations',
      inputs: ['data'],
      outputs: ['response'],
      config: {
        url: { type: 'url', required: true },
        method: { type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], default: 'POST' },
        headers: { type: 'object' },
        body: { type: 'text' },
        retryAttempts: { type: 'number', default: 3 }
      }
    },
    zapierWebhook: {
      type: 'zapier_webhook',
      name: 'Zapier Webhook',
      description: 'Zapier webhook integration',
      icon: 'Zap',
      category: 'integrations',
      inputs: ['data'],
      outputs: ['response'],
      config: {
        webhookUrl: { type: 'url', required: true },
        data: { type: 'object', required: true }
      }
    },
    googleSheets: {
      type: 'google_sheets',
      name: 'Google Sheets',
      description: 'Google Sheets integration',
      icon: 'Table',
      category: 'integrations',
      inputs: ['data'],
      outputs: ['result'],
      config: {
        action: { type: 'select', options: ['read', 'write', 'append', 'update'], required: true },
        spreadsheetId: { type: 'string', required: true },
        range: { type: 'string', required: true },
        values: { type: 'array' }
      }
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
      inputs: ['data'],
      outputs: ['lead'],
      config: {
        name: { type: 'string', required: true },
        email: { type: 'email', required: true },
        phone: { type: 'string' },
        company: { type: 'string' },
        source: { type: 'string' },
        tags: { type: 'array' }
      }
    },
    updateLead: {
      type: 'update_lead',
      name: 'Update Lead',
      description: 'Update existing lead',
      icon: 'UserEdit',
      category: 'leads',
      inputs: ['data'],
      outputs: ['updated'],
      config: {
        leadId: { type: 'string', required: true },
        fields: { type: 'object', required: true }
      }
    },
    leadFieldMatches: {
      type: 'lead_field_matches',
      name: 'Lead Field Matches',
      description: 'Check if lead field matches condition',
      icon: 'CheckCircle',
      category: 'leads',
      inputs: ['data'],
      outputs: ['matches'],
      config: {
        field: { type: 'string', required: true },
        operator: { type: 'select', options: ['equals', 'contains', 'starts_with', 'ends_with'], required: true },
        value: { type: 'string', required: true }
      }
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
      inputs: ['data'],
      outputs: ['campaign'],
      config: {
        name: { type: 'string', required: true },
        platform: { type: 'select', options: ['facebook', 'google', 'instagram'], required: true },
        budget: { type: 'number', required: true },
        objective: { type: 'select', options: ['awareness', 'traffic', 'conversions'], required: true }
      }
    },
    adjustBudget: {
      type: 'adjust_budget',
      name: 'Adjust Budget',
      description: 'Adjust campaign budget',
      icon: 'DollarSign',
      category: 'campaigns',
      inputs: ['data'],
      outputs: ['adjusted'],
      config: {
        campaignId: { type: 'string', required: true },
        newBudget: { type: 'number', required: true },
        action: { type: 'select', options: ['increase', 'decrease', 'set'], required: true }
      }
    },
    pauseCampaign: {
      type: 'pause_campaign',
      name: 'Pause Campaign',
      description: 'Pause advertising campaign',
      icon: 'Pause',
      category: 'campaigns',
      inputs: ['data'],
      outputs: ['paused'],
      config: {
        campaignId: { type: 'string', required: true },
        reason: { type: 'string' }
      }
    },
    adsToolCampaignStatus: {
      type: 'ads_tool_campaign_status',
      name: 'ADS Tool Campaign Status',
      description: 'Check campaign status in ADS tool',
      icon: 'Activity',
      category: 'campaigns',
      inputs: ['data'],
      outputs: ['status'],
      config: {
        campaignId: { type: 'string', required: true },
        platform: { type: 'select', options: ['facebook', 'google', 'instagram'], required: true }
      }
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
      inputs: ['data'],
      outputs: ['true', 'false'],
      config: {
        condition: { type: 'string', required: true },
        operator: { type: 'select', options: ['equals', 'not_equals', 'greater_than', 'less_than', 'contains'], required: true },
        value: { type: 'string', required: true }
      }
    },
    loop: {
      type: 'loop',
      name: 'Loop',
      description: 'Loop through collection',
      icon: 'Repeat',
      category: 'control',
      inputs: ['data'],
      outputs: ['item', 'index'],
      config: {
        collection: { type: 'string', required: true },
        maxIterations: { type: 'number', default: 100 }
      }
    },
    delay: {
      type: 'delay',
      name: 'Delay',
      description: 'Add delay to workflow',
      icon: 'Clock',
      category: 'control',
      inputs: ['data'],
      outputs: ['data'],
      config: {
        delaySeconds: { type: 'number', required: true, min: 1, default: 60 }
      }
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
      inputs: ['data'],
      outputs: ['media'],
      config: {
        file: { type: 'file', required: true },
        destination: { type: 'select', options: ['local', 's3', 'cloudinary'], required: true },
        folder: { type: 'string' }
      }
    },
    mediaProcessing: {
      type: 'media_processing',
      name: 'Media Processing',
      description: 'Process media files',
      icon: 'Image',
      category: 'media',
      inputs: ['data'],
      outputs: ['processed'],
      config: {
        operation: { type: 'select', options: ['resize', 'compress', 'convert', 'watermark'], required: true },
        parameters: { type: 'object' }
      }
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
      inputs: ['data'],
      outputs: ['flow'],
      config: {
        flowId: { type: 'string', required: true },
        customerData: { type: 'object' }
      }
    },
    assignAuraChat: {
      type: 'assign_aura_chat',
      name: 'Assign Aura Chat',
      description: 'Assign chat to Aura agent',
      icon: 'UserCheck',
      category: 'aura',
      inputs: ['data'],
      outputs: ['assigned'],
      config: {
        chatId: { type: 'string', required: true },
        agentId: { type: 'string', required: true }
      }
    },
    closeAuraChat: {
      type: 'close_aura_chat',
      name: 'Close Aura Chat',
      description: 'Close Aura chat session',
      icon: 'XCircle',
      category: 'aura',
      inputs: ['data'],
      outputs: ['closed'],
      config: {
        chatId: { type: 'string', required: true },
        reason: { type: 'string' }
      }
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
      inputs: ['data'],
      outputs: ['report'],
      config: {
        reportType: { type: 'select', options: ['performance', 'conversion', 'engagement'], required: true },
        dateRange: { type: 'object', required: true },
        metrics: { type: 'array', required: true }
      }
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
      inputs: ['data'],
      outputs: ['triggered'],
      config: {
        targetWorkflowId: { type: 'string', required: true },
        payload: { type: 'object' }
      }
    }
  }
};

// ===== NODE CATEGORIES =====
export const nodeCategories = {
  triggers: {
    name: 'Triggers',
    description: 'Start your workflow',
    color: '#10B981',
    icon: 'Zap'
  },
  ai: {
    name: 'AI & ML',
    description: 'Artificial Intelligence',
    color: '#8B5CF6',
    icon: 'Bot'
  },
  social: {
    name: 'Social Media',
    description: 'Social media automation',
    color: '#3B82F6',
    icon: 'Share2'
  },
  communication: {
    name: 'Communication',
    description: 'Email, SMS, messaging',
    color: '#F59E0B',
    icon: 'Mail'
  },
  data: {
    name: 'Data Processing',
    description: 'Transform and process data',
    color: '#06B6D4',
    icon: 'Database'
  },
  integrations: {
    name: 'Integrations',
    description: 'External services',
    color: '#84CC16',
    icon: 'Globe'
  },
  leads: {
    name: 'Lead Management',
    description: 'Manage leads and contacts',
    color: '#EF4444',
    icon: 'Users'
  },
  campaigns: {
    name: 'Campaigns',
    description: 'Advertising campaigns',
    color: '#F97316',
    icon: 'Target'
  },
  control: {
    name: 'Control Flow',
    description: 'Workflow control logic',
    color: '#6366F1',
    icon: 'GitBranch'
  },
  media: {
    name: 'Media',
    description: 'Media processing',
    color: '#EC4899',
    icon: 'Image'
  },
  aura: {
    name: 'Aura',
    description: 'Aura AI integration',
    color: '#14B8A6',
    icon: 'MessageCircle'
  },
  analytics: {
    name: 'Analytics',
    description: 'Reports and insights',
    color: '#8B5CF6',
    icon: 'BarChart3'
  },
  workflow: {
    name: 'Workflow',
    description: 'Workflow control',
    color: '#6B7280',
    icon: 'Workflow'
  }
};

// ===== NODE TYPE MAPPING =====
export const nodeTypeMapping = {
  // Flatten all node types for easy access
  ...Object.values(nodeConfigs.triggers).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.ai).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.social).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.communication).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.data).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.integrations).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.leads).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.campaigns).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.control).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.media).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.aura).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.analytics).reduce((acc, node) => ({ ...acc, [node.type]: node }), {}),
  ...Object.values(nodeConfigs.workflow).reduce((acc, node) => ({ ...acc, [node.type]: node }), {})
};

// ===== UTILITY FUNCTIONS =====
export const getNodeConfig = (nodeType) => {
  return nodeTypeMapping[nodeType] || null;
};

export const getNodesByCategory = (category) => {
  return nodeConfigs[category] || {};
};

export const getAllNodeTypes = () => {
  return Object.keys(nodeTypeMapping);
};

export const getNodeCategories = () => {
  return Object.keys(nodeCategories);
};

export const validateNodeConfig = (nodeType, config) => {
  const nodeConfig = getNodeConfig(nodeType);
  if (!nodeConfig) return { valid: false, errors: ['Invalid node type'] };

  const errors = [];
  const { config: requiredConfig } = nodeConfig;

  Object.entries(requiredConfig).forEach(([key, fieldConfig]) => {
    if (fieldConfig.required && (!config[key] || config[key] === '')) {
      errors.push(`${key} is required`);
    }
  });

  return { valid: errors.length === 0, errors };
};

export default nodeConfigs;