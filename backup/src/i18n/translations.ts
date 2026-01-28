/**
 * Sistema de Internacionalização - xWin Dash
 * Tradução unificada para todos os módulos
 */

export type Language = 'pt' | 'en';

export interface Translation {
  // === NAVEGAÇÃO E LAYOUT ===
  navigation: {
    dashboard: string;
    leads: string;
    campaigns: string;
    analytics: string;
    settings: string;
    profile: string;
    logout: string;
    search: string;
    notifications: string;
    help: string;
  };

  // === AÇÕES COMUNS ===
  actions: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    create: string;
    update: string;
    view: string;
    export: string;
    import: string;
    duplicate: string;
    archive: string;
    restore: string;
    send: string;
    schedule: string;
    pause: string;
    resume: string;
    refresh: string;
    filter: string;
    sort: string;
    search: string;
    clear: string;
    confirm: string;
    loading: string;
    submit: string;
    back: string;
    next: string;
    previous: string;
    close: string;
  };

  // === FORMULÁRIOS ===
  forms: {
    required: string;
    optional: string;
    invalid: string;
    emailInvalid: string;
    phoneInvalid: string;
    minLength: string;
    maxLength: string;
    mustMatch: string;
    saving: string;
    saved: string;
    error: string;
    success: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    website: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    description: string;
    notes: string;
    tags: string;
    category: string;
    status: string;
    priority: string;
    date: string;
    time: string;
    title: string;
    content: string;
    subject: string;
    message: string;
  };

  // === STATUS E ESTADOS ===
  status: {
    active: string;
    inactive: string;
    pending: string;
    completed: string;
    cancelled: string;
    draft: string;
    published: string;
    archived: string;
    processing: string;
    failed: string;
    success: string;
    warning: string;
    error: string;
    online: string;
    offline: string;
    connected: string;
    disconnected: string;
  };

  // === MÓDULOS ESPECÍFICOS ===
  leads: {
    title: string;
    create: string;
    edit: string;
    score: string;
    source: string;
    qualification: string;
    temperature: string;
    followUp: string;
    activity: string;
    timeline: string;
    convert: string;
    segment: string;
    import: string;
    export: string;
    bulk: string;
    filters: string;
    advanced: string;
  };

  campaigns: {
    title: string;
    create: string;
    edit: string;
    performance: string;
    metrics: string;
    audience: string;
    budget: string;
    schedule: string;
    creative: string;
    optimization: string;
    reports: string;
    ab_test: string;
    targeting: string;
  };

  analytics: {
    title: string;
    dashboard: string;
    reports: string;
    insights: string;
    metrics: string;
    conversion: string;
    performance: string;
    trends: string;
    comparison: string;
    forecast: string;
    export: string;
    realtime: string;
  };

  ai: {
    title: string;
    generate: string;
    enhance: string;
    analyze: string;
    optimize: string;
    suggestions: string;
    automation: string;
    models: string;
    training: string;
    prompt: string;
    response: string;
    history: string;
    usage: string;
  };

  // === MENSAGENS E FEEDBACKS ===
  messages: {
    welcome: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    confirm_delete: string;
    unsaved_changes: string;
    operation_success: string;
    operation_failed: string;
    loading: string;
    no_data: string;
    search_no_results: string;
    permission_denied: string;
    session_expired: string;
    network_error: string;
    try_again: string;
  };

  // === TEMPO E DATAS ===
  time: {
    now: string;
    today: string;
    yesterday: string;
    tomorrow: string;
    this_week: string;
    last_week: string;
    this_month: string;
    last_month: string;
    this_year: string;
    last_year: string;
    minutes_ago: string;
    hours_ago: string;
    days_ago: string;
  };
}

export const translations: Record<Language, Translation> = {
  pt: {
    navigation: {
      dashboard: 'Dashboard',
      leads: 'Leads',
      campaigns: 'Campanhas',
      analytics: 'Analytics',
      settings: 'Configurações',
      profile: 'Perfil',
      logout: 'Sair',
      search: 'Buscar',
      notifications: 'Notificações',
      help: 'Ajuda',
    },
    actions: {
      save: 'Salvar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Excluir',
      create: 'Criar',
      update: 'Atualizar',
      view: 'Visualizar',
      export: 'Exportar',
      import: 'Importar',
      duplicate: 'Duplicar',
      archive: 'Arquivar',
      restore: 'Restaurar',
      send: 'Enviar',
      schedule: 'Agendar',
      pause: 'Pausar',
      resume: 'Retomar',
      refresh: 'Atualizar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      search: 'Buscar',
      clear: 'Limpar',
      confirm: 'Confirmar',
      loading: 'Carregando...',
      submit: 'Enviar',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      close: 'Fechar',
    },
    forms: {
      required: 'Campo obrigatório',
      optional: 'Opcional',
      invalid: 'Valor inválido',
      emailInvalid: 'E-mail inválido',
      phoneInvalid: 'Telefone inválido',
      minLength: 'Mínimo de {min} caracteres',
      maxLength: 'Máximo de {max} caracteres',
      mustMatch: 'Os campos devem coincidir',
      saving: 'Salvando...',
      saved: 'Salvo com sucesso',
      error: 'Erro ao salvar',
      success: 'Sucesso',
      name: 'Nome',
      email: 'E-mail',
      phone: 'Telefone',
      company: 'Empresa',
      website: 'Website',
      address: 'Endereço',
      city: 'Cidade',
      state: 'Estado',
      country: 'País',
      zipCode: 'CEP',
      description: 'Descrição',
      notes: 'Observações',
      tags: 'Tags',
      category: 'Categoria',
      status: 'Status',
      priority: 'Prioridade',
      date: 'Data',
      time: 'Hora',
      title: 'Título',
      content: 'Conteúdo',
      subject: 'Assunto',
      message: 'Mensagem',
    },
    status: {
      active: 'Ativo',
      inactive: 'Inativo',
      pending: 'Pendente',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      draft: 'Rascunho',
      published: 'Publicado',
      archived: 'Arquivado',
      processing: 'Processando',
      failed: 'Falhado',
      success: 'Sucesso',
      warning: 'Aviso',
      error: 'Erro',
      online: 'Online',
      offline: 'Offline',
      connected: 'Conectado',
      disconnected: 'Desconectado',
    },
    leads: {
      title: 'Gestão de Leads',
      create: 'Novo Lead',
      edit: 'Editar Lead',
      score: 'Pontuação',
      source: 'Origem',
      qualification: 'Qualificação',
      temperature: 'Temperatura',
      followUp: 'Acompanhamento',
      activity: 'Atividade',
      timeline: 'Linha do Tempo',
      convert: 'Converter',
      segment: 'Segmentar',
      import: 'Importar Leads',
      export: 'Exportar Leads',
      bulk: 'Ações em Lote',
      filters: 'Filtros',
      advanced: 'Avançado',
    },
    campaigns: {
      title: 'Campanhas Publicitárias',
      create: 'Nova Campanha',
      edit: 'Editar Campanha',
      performance: 'Performance',
      metrics: 'Métricas',
      audience: 'Audiência',
      budget: 'Orçamento',
      schedule: 'Agendamento',
      creative: 'Criativo',
      optimization: 'Otimização',
      reports: 'Relatórios',
      ab_test: 'Teste A/B',
      targeting: 'Segmentação',
    },
    analytics: {
      title: 'Analytics e Relatórios',
      dashboard: 'Dashboard',
      reports: 'Relatórios',
      insights: 'Insights',
      metrics: 'Métricas',
      conversion: 'Conversão',
      performance: 'Performance',
      trends: 'Tendências',
      comparison: 'Comparação',
      forecast: 'Previsão',
      export: 'Exportar',
      realtime: 'Tempo Real',
    },
    ai: {
      title: 'Inteligência Artificial',
      generate: 'Gerar',
      enhance: 'Melhorar',
      analyze: 'Analisar',
      optimize: 'Otimizar',
      suggestions: 'Sugestões',
      automation: 'Automação',
      models: 'Modelos',
      training: 'Treinamento',
      prompt: 'Prompt',
      response: 'Resposta',
      history: 'Histórico',
      usage: 'Uso',
    },
    messages: {
      welcome: 'Bem-vindo ao xWin Dash',
      success: 'Operação realizada com sucesso',
      error: 'Ocorreu um erro',
      warning: 'Atenção',
      info: 'Informação',
      confirm_delete: 'Tem certeza que deseja excluir?',
      unsaved_changes: 'Há alterações não salvas',
      operation_success: 'Operação concluída',
      operation_failed: 'Operação falhou',
      loading: 'Carregando...',
      no_data: 'Nenhum dado encontrado',
      search_no_results: 'Nenhum resultado encontrado',
      permission_denied: 'Permissão negada',
      session_expired: 'Sessão expirada',
      network_error: 'Erro de conexão',
      try_again: 'Tente novamente',
    },
    time: {
      now: 'Agora',
      today: 'Hoje',
      yesterday: 'Ontem',
      tomorrow: 'Amanhã',
      this_week: 'Esta semana',
      last_week: 'Semana passada',
      this_month: 'Este mês',
      last_month: 'Mês passado',
      this_year: 'Este ano',
      last_year: 'Ano passado',
      minutes_ago: 'há {minutes} minutos',
      hours_ago: 'há {hours} horas',
      days_ago: 'há {days} dias',
    },
  },
  en: {
    navigation: {
      dashboard: 'Dashboard',
      leads: 'Leads',
      campaigns: 'Campaigns',
      analytics: 'Analytics',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      search: 'Search',
      notifications: 'Notifications',
      help: 'Help',
    },
    actions: {
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      update: 'Update',
      view: 'View',
      export: 'Export',
      import: 'Import',
      duplicate: 'Duplicate',
      archive: 'Archive',
      restore: 'Restore',
      send: 'Send',
      schedule: 'Schedule',
      pause: 'Pause',
      resume: 'Resume',
      refresh: 'Refresh',
      filter: 'Filter',
      sort: 'Sort',
      search: 'Search',
      clear: 'Clear',
      confirm: 'Confirm',
      loading: 'Loading...',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
    },
    forms: {
      required: 'Required field',
      optional: 'Optional',
      invalid: 'Invalid value',
      emailInvalid: 'Invalid email',
      phoneInvalid: 'Invalid phone',
      minLength: 'Minimum {min} characters',
      maxLength: 'Maximum {max} characters',
      mustMatch: 'Fields must match',
      saving: 'Saving...',
      saved: 'Saved successfully',
      error: 'Error saving',
      success: 'Success',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      website: 'Website',
      address: 'Address',
      city: 'City',
      state: 'State',
      country: 'Country',
      zipCode: 'ZIP Code',
      description: 'Description',
      notes: 'Notes',
      tags: 'Tags',
      category: 'Category',
      status: 'Status',
      priority: 'Priority',
      date: 'Date',
      time: 'Time',
      title: 'Title',
      content: 'Content',
      subject: 'Subject',
      message: 'Message',
    },
    status: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      draft: 'Draft',
      published: 'Published',
      archived: 'Archived',
      processing: 'Processing',
      failed: 'Failed',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      online: 'Online',
      offline: 'Offline',
      connected: 'Connected',
      disconnected: 'Disconnected',
    },
    leads: {
      title: 'Lead Management',
      create: 'New Lead',
      edit: 'Edit Lead',
      score: 'Score',
      source: 'Source',
      qualification: 'Qualification',
      temperature: 'Temperature',
      followUp: 'Follow Up',
      activity: 'Activity',
      timeline: 'Timeline',
      convert: 'Convert',
      segment: 'Segment',
      import: 'Import Leads',
      export: 'Export Leads',
      bulk: 'Bulk Actions',
      filters: 'Filters',
      advanced: 'Advanced',
    },
    campaigns: {
      title: 'Ad Campaigns',
      create: 'New Campaign',
      edit: 'Edit Campaign',
      performance: 'Performance',
      metrics: 'Metrics',
      audience: 'Audience',
      budget: 'Budget',
      schedule: 'Schedule',
      creative: 'Creative',
      optimization: 'Optimization',
      reports: 'Reports',
      ab_test: 'A/B Test',
      targeting: 'Targeting',
    },
    analytics: {
      title: 'Analytics & Reports',
      dashboard: 'Dashboard',
      reports: 'Reports',
      insights: 'Insights',
      metrics: 'Metrics',
      conversion: 'Conversion',
      performance: 'Performance',
      trends: 'Trends',
      comparison: 'Comparison',
      forecast: 'Forecast',
      export: 'Export',
      realtime: 'Real-time',
    },
    ai: {
      title: 'Artificial Intelligence',
      generate: 'Generate',
      enhance: 'Enhance',
      analyze: 'Analyze',
      optimize: 'Optimize',
      suggestions: 'Suggestions',
      automation: 'Automation',
      models: 'Models',
      training: 'Training',
      prompt: 'Prompt',
      response: 'Response',
      history: 'History',
      usage: 'Usage',
    },
    messages: {
      welcome: 'Welcome to xWin Dash',
      success: 'Operation completed successfully',
      error: 'An error occurred',
      warning: 'Warning',
      info: 'Information',
      confirm_delete: 'Are you sure you want to delete?',
      unsaved_changes: 'There are unsaved changes',
      operation_success: 'Operation completed',
      operation_failed: 'Operation failed',
      loading: 'Loading...',
      no_data: 'No data found',
      search_no_results: 'No results found',
      permission_denied: 'Permission denied',
      session_expired: 'Session expired',
      network_error: 'Network error',
      try_again: 'Try again',
    },
    time: {
      now: 'Now',
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      this_week: 'This week',
      last_week: 'Last week',
      this_month: 'This month',
      last_month: 'Last month',
      this_year: 'This year',
      last_year: 'Last year',
      minutes_ago: '{minutes} minutes ago',
      hours_ago: '{hours} hours ago',
      days_ago: '{days} days ago',
    },
  },
};

export default translations;
