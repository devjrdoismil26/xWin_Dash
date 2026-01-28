/**
 * Funções de formatação para dados do ADStool
 */

/**
 * Formata valores monetários
 */
export const formatCurrency = (value: number, currency: string = 'BRL'): string => {
  if (isNaN(value)) return 'R$ 0,00';
  
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(value);
};

/**
 * Formata números com separadores de milhares
 */
export const formatNumber = (value: number): string => {
  if (isNaN(value)) return '0';
  
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Formata percentuais
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  if (isNaN(value)) return '0%';
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formata datas
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Data inválida';
  
  const options: Intl.DateTimeFormatOptions = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' }
  }[format];
  
  return new Intl.DateTimeFormat('pt-BR', options).format(dateObj);
};

/**
 * Formata duração em segundos para formato legível
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours}h ${minutes}m`;
};

/**
 * Formata tamanho de arquivo
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formata status de campanha
 */
export const formatCampaignStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'Ativa',
    'paused': 'Pausada',
    'deleted': 'Excluída',
    'pending': 'Pendente',
    'draft': 'Rascunho'
  };
  
  return statusMap[status] || status;
};

/**
 * Formata status de conta
 */
export const formatAccountStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'Ativa',
    'paused': 'Pausada',
    'suspended': 'Suspensa',
    'pending': 'Pendente',
    'disconnected': 'Desconectada'
  };
  
  return statusMap[status] || status;
};

/**
 * Formata plataforma
 */
export const formatPlatform = (platform: string): string => {
  const platformMap: Record<string, string> = {
    'google_ads': 'Google Ads',
    'facebook_ads': 'Facebook Ads',
    'linkedin_ads': 'LinkedIn Ads',
    'twitter_ads': 'Twitter Ads',
    'tiktok_ads': 'TikTok Ads'
  };
  
  return platformMap[platform] || platform;
};

/**
 * Formata objetivo de campanha
 */
export const formatCampaignObjective = (objective: string): string => {
  const objectiveMap: Record<string, string> = {
    'awareness': 'Conscientização',
    'traffic': 'Tráfego',
    'engagement': 'Engajamento',
    'leads': 'Leads',
    'app_promotion': 'Promoção de App',
    'sales': 'Vendas',
    'conversions': 'Conversões'
  };
  
  return objectiveMap[objective] || objective;
};
