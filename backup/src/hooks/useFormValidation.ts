/**
 * Sistema de Validação Unificado - xWin Dash
 * Hook para validação consistente em todos os formulários
 */

import { useState, useCallback } from 'react';
import { useT } from './useTranslation';
import * as yup from 'yup';

export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormField {
  name: string;
  rules?: ValidationRule;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface UseFormValidationReturn {
  errors: Record<string, string>;
  isValid: boolean;
  isValidating: boolean;
  validateField: (field: string, value: any) => Promise<boolean>;
  validateForm: (data: Record<string, any>) => Promise<boolean>;
  clearErrors: () => void;
  clearFieldError: (field: string) => void;
  setError: (field: string, message: string) => void;
  getFieldError: (field: string) => string | undefined;
  hasError: (field: string) => boolean;
}

// Schemas pré-definidos para casos comuns
export const commonSchemas = {
  email: yup.string()
    .email('forms.emailInvalid')
    .required('forms.required'),
    
  phone: yup.string()
    .matches(
      /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/,
      'forms.phoneInvalid'
    ),
    
  name: yup.string()
    .min(2, 'forms.minLength')
    .max(100, 'forms.maxLength')
    .required('forms.required'),
    
  company: yup.string()
    .min(2, 'forms.minLength')
    .max(200, 'forms.maxLength'),
    
  website: yup.string()
    .url('Deve ser uma URL válida'),
    
  password: yup.string()
    .min(8, 'forms.minLength')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Deve conter ao menos uma letra maiúscula, uma minúscula e um número'
    )
    .required('forms.required'),
    
  required: yup.string().required('forms.required'),
  
  optional: yup.string(),
  
  number: yup.number().typeError('Deve ser um número'),
  
  positiveNumber: yup.number()
    .positive('Deve ser um número positivo')
    .typeError('Deve ser um número'),
    
  date: yup.date().typeError('Data inválida'),
  
  futureDate: yup.date()
    .min(new Date(), 'Data deve ser futura')
    .typeError('Data inválida'),
};

export const useFormValidation = (
  schema?: yup.ObjectSchema<any>,
  options?: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
  }
): UseFormValidationReturn => {
  const { t } = useT();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const translateError = useCallback((error: string, params?: Record<string, any>) => {
    // Se o erro já está traduzido (não contém pontos), retorna como está
    if (!error.includes('.')) {
      return error;
    }
    
    try {
      return t(error, params);
    } catch {
      return error;
    }
  }, [t]);

  const validateField = useCallback(async (field: string, value: any): Promise<boolean> => {
    if (!schema) return true;

    try {
      setIsValidating(true);
      await schema.validateAt(field, { [field]: value });
      
      // Remove erro se validação passou
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      
      return true;
    } catch (error: any) {
      const translatedMessage = translateError(error.message, error.params);
      setErrors(prev => ({
        ...prev,
        [field]: translatedMessage
      }));
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [schema, translateError]);

  const validateForm = useCallback(async (data: Record<string, any>): Promise<boolean> => {
    if (!schema) return true;

    try {
      setIsValidating(true);
      await schema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      
      if (error.inner) {
        error.inner.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path] = translateError(err.message, err.params);
          }
        });
      }
      
      setErrors(newErrors);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [schema, translateError]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  const getFieldError = useCallback((field: string) => {
    return errors[field];
  }, [errors]);

  const hasError = useCallback((field: string) => {
    return !!errors[field];
  }, [errors]);

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValid,
    isValidating,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    setError,
    getFieldError,
    hasError,
  };
};

// Hook para formulários com schema específico
export const useFormWithSchema = (schema: yup.ObjectSchema<any>) => {
  return useFormValidation(schema, {
    validateOnChange: true,
    validateOnBlur: true,
  });
};

// Schemas específicos para módulos
export const moduleSchemas = {
  lead: yup.object({
    name: commonSchemas.name,
    email: commonSchemas.email,
    phone: commonSchemas.phone,
    company: commonSchemas.company,
    website: commonSchemas.website,
    source: commonSchemas.required,
    status: commonSchemas.required,
    score: yup.number().min(0).max(100),
    notes: yup.string().max(1000),
  }),

  campaign: yup.object({
    name: commonSchemas.name,
    objective: commonSchemas.required,
    budget: commonSchemas.positiveNumber.required(),
    start_date: commonSchemas.futureDate,
    end_date: yup.date()
      .min(yup.ref('start_date'), 'Data final deve ser posterior à inicial')
      .required('forms.required'),
    target_audience: commonSchemas.required,
  }),

  product: yup.object({
    name: commonSchemas.name,
    description: yup.string().min(10).max(2000).required(),
    price: commonSchemas.positiveNumber.required(),
    category: commonSchemas.required,
    sku: yup.string().required(),
    stock: yup.number().min(0).integer(),
  }),

  user: yup.object({
    name: commonSchemas.name,
    email: commonSchemas.email,
    password: commonSchemas.password,
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], 'forms.mustMatch')
      .required('forms.required'),
    role: commonSchemas.required,
  }),

  settings: yup.object({
    company_name: commonSchemas.name,
    email: commonSchemas.email,
    phone: commonSchemas.phone,
    website: commonSchemas.website,
    timezone: commonSchemas.required,
    language: commonSchemas.required,
  }),
};

export default useFormValidation;
