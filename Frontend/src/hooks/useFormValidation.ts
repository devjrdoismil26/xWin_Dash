/**
 * Sistema de Validação Unificado - xWin Dash
 *
 * @description
 * Este módulo fornece um hook para validação consistente em todos os formulários
 * da aplicação. Utiliza Yup para validação de schemas e fornece helpers para
 * gerenciamento de erros, validação de campos e formulários completos.
 *
 * Funcionalidades principais:
 * - Validação de campos individuais e formulários completos
 * - Schemas pré-definidos para casos comuns (email, phone, password, etc.)
 * - Schemas específicos para módulos (lead, campaign, product, user, settings)
 * - Integração com sistema de tradução
 * - Gerenciamento de erros de validação
 * - Estados de validação (isValidating, isValid)
 *
 * @module hooks/useFormValidation
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { useFormValidation, commonSchemas } from '@/hooks/useFormValidation';
 * import * as yup from 'yup';
 *
 * const schema = yup.object({
 *   email: commonSchemas.email,
 *   password: commonSchemas.password
 * });

 *
 * const { validateForm, errors, isValid } = useFormValidation(schema);

 *
 * const handleSubmit = async (data: unknown) => {
 *   const valid = await validateForm(data);

 *   if (valid) {
 *     // Formulário válido
 *   }
 *};

 * ```
 */

import { useState, useCallback } from 'react';
import { useT } from './useTranslation';
import * as yup from "yup";

/**
 * Interface para regra de validação de campo
 *
 * @description
 * Define regras de validação que podem ser aplicadas a um campo do formulário.
 *
 * @example
 * ```ts
 * const rules: ValidationRule ={ *   required: true,
 *   email: true,
 *   minLength: 8,
 *   maxLength: 100,
 *   pattern: /^[A-Z]/,
 *   custom: (value: unknown) => {
 *     if (value === 'invalid') {
 *       return 'Valor inválido';
 *      }
 *     return null;
 *   }
 *};

 * ```
 */
export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null; }

/**
 * Interface para campo de formulário
 *
 * @description
 * Define um campo de formulário com seu nome e regras de validação opcionais.
 *
 * @example
 * ```ts
 * const field: FormField ={ *   name: 'email',
 *   rules: { required: true, email: true  }
 *};

 * ```
 */
export interface FormField {
  name: string;
  rules?: ValidationRule; }

/**
 * Interface para erro de validação
 *
 * @description
 * Estrutura para erros de validação retornados pelo sistema.
 *
 * @example
 * ```ts
 * const error: ValidationError = {
 *   field: 'email',
 *   message: 'Email inválido'
 *};

 * ```
 */
export interface ValidationError {
  field: string;
  message: string; }

/**
 * Interface de retorno do hook useFormValidation
 *
 * @description
 * Retorna estado e funções para gerenciamento de validação de formulários.
 *
 * @example
 * ```tsx
 * const {
 *   errors,
 *   isValid,
 *   isValidating,
 *   validateField,
 *   validateForm,
 *   clearErrors
 * } = useFormValidation(schema);

 * ```
 */
export interface UseFormValidationReturn {
  errors: Record<string, string>;
  isValid: boolean;
  isValidating: boolean;
  validateField: (field: string, value: unknown) => Promise<boolean>;
  validateForm: (data: Record<string, any>) => Promise<boolean>;
  clearErrors??: (e: any) => void;
  clearFieldError?: (e: any) => void;
  setError?: (e: any) => void;
  getFieldError: (field: string) => string | undefined;
  hasError: (field: string) => boolean; }

/**
 * Schemas pré-definidos para casos comuns
 *
 * @description
 * Schemas Yup pré-configurados para validação de campos comuns como email,
 * telefone, nome, senha, etc. Podem ser reutilizados em diferentes formulários.
 *
 * @constant {Record<string, yup.StringSchema | yup.NumberSchema | yup.DateSchema>}
 *
 * @example
 * ```ts
 * const schema = yup.object({
 *   email: commonSchemas.email,
 *   phone: commonSchemas.phone,
 *   password: commonSchemas.password
 * });

 * ```
 */
export const commonSchemas = {
  email: yup.string().email("forms.emailInvalid").required("forms.required"),

  phone: yup
    .string()
    .matches(
      /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/,
      "forms.phoneInvalid",
    ),

  name: yup
    .string()
    .min(2, "forms.minLength")
    .max(100, "forms.maxLength")
    .required("forms.required"),

  company: yup.string().min(2, "forms.minLength").max(200, "forms.maxLength"),

  website: yup.string().url("Deve ser uma URL válida"),

  password: yup
    .string()
    .min(8, "forms.minLength")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Deve conter ao menos uma letra maiúscula, uma minúscula e um número",
    )
    .required("forms.required"),

  required: yup.string().required("forms.required"),

  optional: yup.string(),

  number: yup.number().typeError("Deve ser um número"),

  positiveNumber: yup
    .number()
    .positive("Deve ser um número positivo")
    .typeError("Deve ser um número"),

  date: yup.date().typeError("Data inválida"),

  futureDate: yup
    .date()
    .min(new Date(), "Data deve ser futura")
    .typeError("Data inválida"),};

/**
 * Hook principal para validação de formulários
 *
 * @description
 * Hook que fornece validação de formulários usando schemas Yup, gerenciamento
 * de erros e integração com sistema de tradução.
 *
 * @param {yup.ObjectSchema<any>} [schema] - Schema Yup para validação do formulário
 * @param {Object} [options] - Opções de configuração do hook
 * @param {boolean} [options.validateOnChange=true] - Se deve validar ao alterar campo
 * @param {boolean} [options.validateOnBlur=true] - Se deve validar ao sair do campo
 * @returns {UseFormValidationReturn} Objeto com estado e funções de validação
 *
 * @example
 * ```tsx
 * import * as yup from 'yup';
 * import { useFormValidation, commonSchemas } from '@/hooks/useFormValidation';
 *
 * const schema = yup.object({
 *   email: commonSchemas.email,
 *   password: commonSchemas.password
 * });

 *
 * const { validateForm, errors, isValid } = useFormValidation(schema);

 *
 * const handleSubmit = async (data: unknown) => {
 *   const valid = await validateForm(data);

 *   if (valid) {
 *     await submitData(data);

 *   }
 *};

 * ```
 */
export const useFormValidation = (
  schema?: yup.ObjectSchema<Record<string, any>>,
  options?: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
  },
): UseFormValidationReturn => {
  const { t } = useT();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isValidating, setIsValidating] = useState(false);

  /**
   * Traduz mensagens de erro usando o sistema de tradução
   *
   * @description
   * Verifica se o erro já está traduzido ou tenta traduzi-lo usando
   * a chave de tradução fornecida.
   *
   * @private
   * @param {string} error - Mensagem de erro ou chave de tradução
   * @param {Record<string, any>} [params] - Parâmetros para tradução
   * @returns {string} Mensagem de erro traduzida
   */
  const translateError = useCallback(
    (error: string, params?: Record<string, any>) => {
      // Se o erro já está traduzido (não contém pontos), retorna como está
      if (!error.includes(".")) {
        return error;
      }

      try {
        const typedParams = params as Record<string, string | number> | undefined;
        return t(error, typedParams);

      } catch {
        return error;
      } ,
    [t],);

  /**
   * Valida um campo individual do formulário
   *
   * @description
   * Valida um campo específico usando o schema Yup configurado.
   * Remove o erro do campo se a validação passar.
   *
   * @param {string} field - Nome do campo a ser validado
   * @param {any} value - Valor do campo a ser validado
   * @returns {Promise<boolean>} Promise que resolve com true se válido, false caso contrário
   *
   * @example
   * ```tsx
   * const { validateField } = useFormValidation(schema);

   *
   * const handleEmailChange = async (email: string) => {
   *   await validateField('email', email);

   *};

   * ```
   */
  const validateField = useCallback(
    async (field: string, value: unknown): Promise<boolean> => {
      if (!schema) return true;

      try {
        setIsValidating(true);

        await schema.validateAt(field, { [field]: value });

        // Remove erro se validação passou
        setErrors((prev: unknown) => {
          const newErrors = { ...prev};

          delete (newErrors as any)[field];
          return newErrors;
        });

        return true;
      } catch (error: unknown) {
        const yupError = error as yup.ValidationError;
        const translatedMessage = translateError(
          yupError.message || "Erro de validação",
          yupError.params as Record<string, any> | undefined,);

        setErrors((prev: unknown) => ({
          ...prev,
          [field]: translatedMessage,
        }));

        return false;
      } finally {
        setIsValidating(false);

      } ,
    [schema, translateError],);

  /**
   * Valida o formulário completo
   *
   * @description
   * Valida todos os campos do formulário usando o schema Yup configurado.
   * Retorna true se todos os campos forem válidos, false caso contrário.
   *
   * @param {Record<string, any>} data - Dados do formulário a serem validados
   * @returns {Promise<boolean>} Promise que resolve com true se válido, false caso contrário
   *
   * @example
   * ```tsx
   * const { validateForm, errors } = useFormValidation(schema);

   *
   * const handleSubmit = async (formData: unknown) => {
   *   const isValid = await validateForm(formData);

   *   if (isValid) {
   *     // Formulário válido, enviar dados
   *   } else {
   *     // Exibir erros
   *   }
   *};

   * ```
   */
  const validateForm = useCallback(
    async (data: Record<string, any>): Promise<boolean> => {
      if (!schema) return true;

      try {
        setIsValidating(true);

        await schema.validate(data, { abortEarly: false });

        setErrors({});

        return true;
      } catch (error: unknown) {
        const yupError = error as yup.ValidationError;
        const newErrors: Record<string, string> = {};

        if (yupError.inner && Array.isArray(yupError.inner)) {
          yupError.inner.forEach((err: yup.ValidationError) => {
            if (err.path) {
              newErrors[err.path] = translateError(
                err.message || "Erro de validação",
                err.params as Record<string, any> | undefined,);

            } );

        }

        setErrors(newErrors);

        return false;
      } finally {
        setIsValidating(false);

      } ,
    [schema, translateError],);

  /**
   * Limpa todos os erros do formulário
   *
   * @description
   * Remove todos os erros de validação do formulário.
   *
   * @example
   * ```tsx
   * const { clearErrors } = useFormValidation(schema);

   * clearErrors();

   * ```
   */
  const clearErrors = useCallback(() => {
    setErrors({});

  }, []);

  /**
   * Limpa o erro de um campo específico
   *
   * @description
   * Remove o erro de validação de um campo específico.
   *
   * @param {string} field - Nome do campo
   *
   * @example
   * ```tsx
   * const { clearFieldError } = useFormValidation(schema);

   * clearFieldError('email');

   * ```
   */
  const clearFieldError = useCallback((field: string) => {
    setErrors((prev: unknown) => {
      const newErrors = { ...prev};

      delete (newErrors as any)[field];
      return newErrors;
    });

  }, []);

  const setError = useCallback((field: string, message: string) => {
    setErrors((prev: unknown) => ({
      ...prev,
      [field]: message,
    }));

  }, []);

  const getFieldError = useCallback(
    (field: string) => {
      return errors[field];
    },
    [errors],);

  const hasError = useCallback(
    (field: string) => {
      return !!errors[field];
    },
    [errors],);

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
    hasError,};
};

/**
 * Hook simplificado para formulários com schema específico
 *
 * @description
 * Hook que configura useFormValidation com validação on change e on blur
 * habilitadas por padrão para um schema específico.
 *
 * @param {yup.ObjectSchema<Record<string, any>>} schema - Schema Yup para validação
 * @returns {UseFormValidationReturn} Objeto com estado e funções de validação
 *
 * @example
 * ```tsx
 * import * as yup from 'yup';
 * import { useFormWithSchema } from '@/hooks/useFormValidation';
 *
 * const schema = yup.object({
 *   email: yup.string().email().required(),
 *   password: yup.string().min(8).required()
 * });

 *
 * const { validateForm, errors } = useFormWithSchema(schema);

 * ```
 */
export const useFormWithSchema = (schema: yup.ObjectSchema<Record<string, any>>,
) => {
  return useFormValidation(schema, {
    validateOnChange: true,
    validateOnBlur: true,
  });};

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
    end_date: yup
      .date()
      .min(yup.ref("start_date"), "Data final deve ser posterior à inicial")
      .required("forms.required"),
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
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "forms.mustMatch")
      .required("forms.required"),
    role: commonSchemas.required,
  }),

  settings: yup.object({
    company_name: commonSchemas.name,
    email: commonSchemas.email,
    phone: commonSchemas.phone,
    website: commonSchemas.website,
    timezone: commonSchemas.required,
    language: commonSchemas.required,
  }),};

export default useFormValidation;
