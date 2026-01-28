/**
 * Funções de validação para o ADStool
 */

/**
 * Valida se string não está vazia
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Valida se string tem tamanho mínimo
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Valida se string tem tamanho máximo
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Valida email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida se é número positivo
 */
export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

/**
 * Valida se é número não negativo
 */
export const isNonNegativeNumber = (value: number): boolean => {
  return !isNaN(value) && value >= 0;
};

/**
 * Valida se valor está dentro de range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Valida se data é válida
 */
export const isValidDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
};

/**
 * Valida se data está no futuro
 */
export const isFutureDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
};

/**
 * Valida se data está no passado
 */
export const isPastDate = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
};

/**
 * Valida se data está entre duas datas
 */
export const isDateBetween = (
  date: string | Date, 
  startDate: string | Date, 
  endDate: string | Date
): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const startObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const endObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  return dateObj >= startObj && dateObj <= endObj;
};

/**
 * Valida plataforma de anúncios
 */
export const isValidPlatform = (platform: string): boolean => {
  const validPlatforms = [
    'google_ads',
    'facebook_ads',
    'linkedin_ads',
    'twitter_ads',
    'tiktok_ads'
  ];
  return validPlatforms.includes(platform);
};

/**
 * Valida status de campanha
 */
export const isValidCampaignStatus = (status: string): boolean => {
  const validStatuses = ['active', 'paused', 'deleted', 'pending', 'draft'];
  return validStatuses.includes(status);
};

/**
 * Valida status de conta
 */
export const isValidAccountStatus = (status: string): boolean => {
  const validStatuses = ['active', 'paused', 'suspended', 'pending', 'disconnected'];
  return validStatuses.includes(status);
};

/**
 * Valida objetivo de campanha
 */
export const isValidCampaignObjective = (objective: string): boolean => {
  const validObjectives = [
    'awareness',
    'traffic',
    'engagement',
    'leads',
    'app_promotion',
    'sales',
    'conversions'
  ];
  return validObjectives.includes(objective);
};

/**
 * Valida tipo de criativo
 */
export const isValidCreativeType = (type: string): boolean => {
  const validTypes = [
    'image',
    'video',
    'carousel',
    'collection',
    'story',
    'text',
    'html5'
  ];
  return validTypes.includes(type);
};

/**
 * Valida orçamento diário
 */
export const isValidDailyBudget = (budget: number): boolean => {
  return isPositiveNumber(budget) && budget >= 1 && budget <= 1000000;
};

/**
 * Valida orçamento total
 */
export const isValidTotalBudget = (budget: number): boolean => {
  return isPositiveNumber(budget) && budget >= 1 && budget <= 10000000;
};

/**
 * Valida percentual
 */
export const isValidPercentage = (percentage: number): boolean => {
  return isNonNegativeNumber(percentage) && percentage <= 100;
};

/**
 * Valida array não vazio
 */
export const isNonEmptyArray = (array: any[]): boolean => {
  return Array.isArray(array) && array.length > 0;
};

/**
 * Valida objeto não vazio
 */
export const isNonEmptyObject = (obj: any): boolean => {
  return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
};

/**
 * Valida se string contém apenas letras e números
 */
export const isAlphanumeric = (value: string): boolean => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(value);
};

/**
 * Valida se string contém apenas letras
 */
export const isAlpha = (value: string): boolean => {
  const alphaRegex = /^[a-zA-Z]+$/;
  return alphaRegex.test(value);
};

/**
 * Valida se string contém apenas números
 */
export const isNumeric = (value: string): boolean => {
  const numericRegex = /^[0-9]+$/;
  return numericRegex.test(value);
};

/**
 * Valida CPF
 */
export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

/**
 * Valida CNPJ
 */
export const isValidCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  
  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  if (firstDigit !== parseInt(cleanCNPJ.charAt(12))) return false;
  
  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  if (secondDigit !== parseInt(cleanCNPJ.charAt(13))) return false;
  
  return true;
};

/**
 * Valida telefone brasileiro
 */
export const isValidBrazilianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

/**
 * Valida CEP brasileiro
 */
export const isValidBrazilianCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/[^\d]/g, '');
  return cleanCEP.length === 8;
};
