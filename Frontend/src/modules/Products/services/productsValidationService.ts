// =========================================
// PRODUCTS VALIDATION SERVICE - VALIDAÇÃO CENTRALIZADA
// =========================================
// Serviço para validação de dados de produtos
// Máximo: 200 linhas

import { Product, ProductFormData, ProductVariation, ProductVariationFormData, ProductImage, ProductImageFormData, ProductReview, ProductReviewFormData, ProductBundle, ProductBundleFormData, ProductInventory, InventoryAlert } from '../types';

// =========================================
// INTERFACES DE VALIDAÇÃO
// =========================================

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[]; }

interface ValidationRule<T> {
  field: keyof T;
  validator: (value: unknown, data: T) => string | null;
  required?: boolean;
}

// =========================================
// VALIDAÇÃO DE PRODUTOS
// =========================================

const productValidationRules: ValidationRule<ProductFormData>[] = [
  {
    field: 'name',
    required: true,
    validator: (value: unknown) => {
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        return 'Nome do produto é obrigatório';
      }
      if (value.trim().length < 3) {
        return 'Nome deve ter pelo menos 3 caracteres';
      }
      if (value.trim().length > 100) {
        return 'Nome deve ter no máximo 100 caracteres';
      }
      return null;
    } ,
  {
    field: 'description',
    validator: (value: unknown) => {
      if (value && typeof value === 'string' && value.length > 1000) {
        return 'Descrição deve ter no máximo 1000 caracteres';
      }
      return null;
    } ,
  {
    field: 'price',
    required: true,
    validator: (value: unknown) => {
      if (value === null || value === undefined) {
        return 'Preço é obrigatório';
      }
      const numValue = Number(value);

      if (isNaN(numValue)) {
        return 'Preço deve ser um número válido';
      }
      if (numValue < 0) {
        return 'Preço não pode ser negativo';
      }
      if (numValue > 999999.99) {
        return 'Preço não pode ser maior que R$ 999.999,99';
      }
      return null;
    } ,
  {
    field: 'category',
    required: true,
    validator: (value: unknown) => {
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        return 'Categoria é obrigatória';
      }
      return null;
    } ,
  {
    field: 'sku',
    validator: (value: unknown) => {
      if (value && typeof value === 'string') {
        if (value.length < 3) {
          return 'SKU deve ter pelo menos 3 caracteres';
        }
        if (value.length > 50) {
          return 'SKU deve ter no máximo 50 caracteres';
        }
        if (!/^[A-Z0-9-_]+$/.test(value)) {
          return 'SKU deve conter apenas letras maiúsculas, números, hífens e underscores';
        } return null;
    } ,
  {
    field: 'tags',
    validator: (value: unknown) => {
      if (value && Array.isArray(value)) {
        if (value.length > 10) {
          return 'Máximo de 10 tags permitidas';
        }
        for (const tag of value) {
          if (typeof tag !== 'string' || tag.trim().length === 0) {
            return 'Todas as tags devem ser strings não vazias';
          }
          if (tag.length > 30) {
            return 'Cada tag deve ter no máximo 30 caracteres';
          } }
      return null;
    } ];

export const validateProductData = (data: ProductFormData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const rule of productValidationRules) {
    const value = data[rule.field];
    
    if (rule.required && (value === null || value === undefined || value === '')) {
      errors.push(`${String(rule.field)} é obrigatório`);

      continue;
    }

    if (value !== null && value !== undefined && value !== '') {
      const error = rule.validator(value, data);

      if (error) {
        errors.push(error);

      } }

  // Validações específicas de negócio
  if (data.price && (data as any).price > 0 && (data as any).price < 1) {
    warnings.push('Preço muito baixo, verifique se está correto');

  }

  if (data.tags && (data as any).tags.length > 5) {
    warnings.push('Muitas tags podem afetar a performance da busca');

  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings};
};

// =========================================
// VALIDAÇÃO DE VARIAÇÕES
// =========================================

const variationValidationRules: ValidationRule<ProductVariationFormData>[] = [
  {
    field: 'name',
    required: true,
    validator: (value: unknown) => {
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        return 'Nome da variação é obrigatório';
      }
      if (value.trim().length < 2) {
        return 'Nome deve ter pelo menos 2 caracteres';
      }
      if (value.trim().length > 100) {
        return 'Nome deve ter no máximo 100 caracteres';
      }
      return null;
    } ,
  {
    field: 'price',
    required: true,
    validator: (value: unknown) => {
      if (value === null || value === undefined) {
        return 'Preço é obrigatório';
      }
      const numValue = Number(value);

      if (isNaN(numValue)) {
        return 'Preço deve ser um número válido';
      }
      if (numValue < 0) {
        return 'Preço não pode ser negativo';
      }
      return null;
    } ,
  {
    field: 'sku',
    required: true,
    validator: (value: unknown) => {
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        return 'SKU é obrigatório';
      }
      if (value.length < 3) {
        return 'SKU deve ter pelo menos 3 caracteres';
      }
      if (value.length > 50) {
        return 'SKU deve ter no máximo 50 caracteres';
      }
      return null;
    } ,
  {
    field: 'inventory',
    validator: (value: unknown) => {
      if (value !== null && value !== undefined) {
        const numValue = Number(value);

        if (isNaN(numValue)) {
          return 'Estoque deve ser um número válido';
        }
        if (numValue < 0) {
          return 'Estoque não pode ser negativo';
        }
        if (numValue > 999999) {
          return 'Estoque não pode ser maior que 999.999';
        } return null;
    } ];

export const validateVariationData = (data: ProductVariationFormData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const rule of variationValidationRules) {
    const value = data[rule.field];
    
    if (rule.required && (value === null || value === undefined || value === '')) {
      errors.push(`${String(rule.field)} é obrigatório`);

      continue;
    }

    if (value !== null && value !== undefined && value !== '') {
      const error = rule.validator(value, data);

      if (error) {
        errors.push(error);

      } }

  return {
    isValid: errors.length === 0,
    errors,
    warnings};
};

// =========================================
// VALIDAÇÃO DE IMAGENS
// =========================================

export const validateImageFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validação de tipo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF');

  }

  // Validação de tamanho
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    errors.push('Arquivo muito grande. Máximo 5MB');

  }

  // Validação de dimensões (se possível)
  if (file.size > 2 * 1024 * 1024) { // 2MB
    warnings.push('Arquivo grande pode afetar o carregamento');

  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings};
};

export const validateImageData = (data: ProductImageFormData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (data.alt && (data as any).alt.length > 100) {
    errors.push('Texto alternativo deve ter no máximo 100 caracteres');

  }

  if (data.caption && (data as any).caption.length > 200) {
    errors.push('Legenda deve ter no máximo 200 caracteres');

  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings};
};

// =========================================
// VALIDAÇÃO DE REVIEWS
// =========================================

const reviewValidationRules: ValidationRule<ProductReviewFormData>[] = [
  {
    field: 'rating',
    required: true,
    validator: (value: unknown) => {
      if (value === null || value === undefined) {
        return 'Rating é obrigatório';
      }
      const numValue = Number(value);

      if (isNaN(numValue)) {
        return 'Rating deve ser um número válido';
      }
      if (numValue < 1 || numValue > 5) {
        return 'Rating deve estar entre 1 e 5';
      }
      return null;
    } ,
  {
    field: 'title',
    required: true,
    validator: (value: unknown) => {
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        return 'Título é obrigatório';
      }
      if (value.trim().length < 5) {
        return 'Título deve ter pelo menos 5 caracteres';
      }
      if (value.trim().length > 100) {
        return 'Título deve ter no máximo 100 caracteres';
      }
      return null;
    } ,
  {
    field: 'comment',
    required: true,
    validator: (value: unknown) => {
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        return 'Comentário é obrigatório';
      }
      if (value.trim().length < 10) {
        return 'Conteúdo deve ter pelo menos 10 caracteres';
      }
      if (value.trim().length > 1000) {
        return 'Conteúdo deve ter no máximo 1000 caracteres';
      }
      return null;
    } ];

export const validateReviewData = (data: ProductReviewFormData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const rule of reviewValidationRules) {
    const value = data[rule.field];
    
    if (rule.required && (value === null || value === undefined || value === '')) {
      errors.push(`${String(rule.field)} é obrigatório`);

      continue;
    }

    if (value !== null && value !== undefined && value !== '') {
      const error = rule.validator(value, data);

      if (error) {
        errors.push(error);

      } }

  return {
    isValid: errors.length === 0,
    errors,
    warnings};
};

// =========================================
// VALIDAÇÃO DE BUNDLES
// =========================================

export const validateBundleData = (data: ProductBundleFormData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data.name || (data as any).name.trim().length === 0) {
    errors.push('Nome do bundle é obrigatório');

  } else if (data.name.trim().length < 3) {
    errors.push('Nome deve ter pelo menos 3 caracteres');

  } else if (data.name.trim().length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');

  }

  if (!data.products || (data as any).products.length === 0) {
    errors.push('Bundle deve conter pelo menos um produto');

  } else if (data.products.length > 10) {
    warnings.push('Muitos produtos no bundle podem afetar a performance');

  }

  if (data.discount_value !== undefined) {
    if (data.discount_value <= 0) {
      errors.push('Valor do desconto deve ser maior que zero');

    }
    if (data.discount_type === 'percentage' && data.discount_value > 100) {
      errors.push('Desconto percentual não pode ser maior que 100%');

    } return {
    isValid: errors.length === 0,
    errors,
    warnings};
};

// =========================================
// VALIDAÇÃO DE INVENTORY
// =========================================

export const validateInventoryData = (data: Partial<ProductInventory>): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (data.quantity !== undefined) {
    if (data.quantity < 0) {
      errors.push('Quantidade não pode ser negativa');

    }
    if (data.quantity > 999999) {
      errors.push('Quantidade não pode ser maior que 999.999');

    } if (data.min_stock !== undefined) {
    if (data.min_stock < 0) {
      errors.push('Estoque mínimo não pode ser negativo');

    } if (data.max_stock !== undefined) {
    if (data.max_stock < 0) {
      errors.push('Estoque máximo não pode ser negativo');

    } if (data.min_stock !== undefined && (data as any).max_stock !== undefined) {
    if (data.min_stock > (data as any).max_stock) {
      errors.push('Estoque mínimo não pode ser maior que o máximo');

    } if (data.quantity !== undefined && (data as any).min_stock !== undefined) {
    if (data.quantity < (data as any).min_stock) {
      warnings.push('Quantidade atual está abaixo do estoque mínimo');

    } return {
    isValid: errors.length === 0,
    errors,
    warnings};
};

// =========================================
// VALIDAÇÃO DE ALERTAS DE INVENTORY
// =========================================

export const validateInventoryAlert = (data: InventoryAlert): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data.type || (data as any).type.trim().length === 0) {
    errors.push('Tipo de alerta é obrigatório');

  }

  if (data.threshold !== undefined) {
    if (data.threshold < 0) {
      errors.push('Threshold não pode ser negativo');

    } if (data.message && (data as any).message.length > 200) {
    errors.push('Mensagem deve ter no máximo 200 caracteres');

  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings};
};

// =========================================
// VALIDAÇÃO GERAL
// =========================================

export const validateAll = (data: unknown, type: 'product' | 'variation' | 'image' | 'review' | 'bundle' | 'inventory' | 'alert'): ValidationResult => {
  switch (type) {
    case 'product':
      return validateProductData(data as ProductFormData);

    case 'variation':
      return validateVariationData(data as ProductVariationFormData);

    case 'image':
      return validateImageData(data as ProductImageFormData);

    case 'review':
      return validateReviewData(data as ProductReviewFormData);

    case 'bundle':
      return validateBundleData(data as ProductBundleFormData);

    case 'inventory':
      return validateInventoryData(data as Partial<ProductInventory>);

    case 'alert':
      return validateInventoryAlert(data as InventoryAlert);

    default:
      return {
        isValid: false,
        errors: ['Tipo de validação não suportado'],
        warnings: []};

  } ;

export default {
  validateProductData,
  validateVariationData,
  validateImageFile,
  validateImageData,
  validateReviewData,
  validateBundleData,
  validateInventoryData,
  validateInventoryAlert,
  validateAll};
