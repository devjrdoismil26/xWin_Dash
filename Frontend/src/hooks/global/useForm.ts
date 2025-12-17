/**
 * Hook de Formulário - Gerenciamento de Formulários
 *
 * @description
 * Este módulo fornece um hook completo para gerenciamento de formulários React,
 * incluindo validação, estado de campos (touched, dirty), erros e helpers.
 *
 * Funcionalidades principais:
 * - Gerenciamento de valores de formulário
 * - Validação de campos com regras configuráveis
 * - Estado de touched (campo foi tocado) e dirty (campo foi alterado)
 * - Validação on change e on blur
 * - Helpers para manipulação de campos
 * - Reset de formulário
 * - Estado de submissão
 *
 * @module hooks/global/useForm
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * interface FormData {
  *   email: string;
  *   password: string;
  *
  [key: string]: unknown; }
 *
 * const form = useForm<FormData>({
 *   initialValues: { email: '', password: '' },
 *   validationRules: {
 *     email: { required: true, email: true },
 *     password: { required: true, minLength: 8 }
 *   },
 *   onSubmit: async (values: unknown) => {
 *     await login(values);

 *   }
 * });

 *
 * return (
         *   <form onSubmit={ form.handleSubmit } />
 *     <input
 *       value={ form.values.email }
 *       onChange={ (e: unknown) => form.setFieldValue('email', e.target.value) }
 *       onBlur={ () => form.setFieldTouched('email') }
 *     />
 *     {form.errors.email && <span>{form.errors.email}</span>}
 *   </form>
 *);

 * ```
 */

import React, { useCallback, useMemo, useRef, useState } from "react";

/**
 * Tipo para função de validação customizada
 *
 * @template T - Tipo dos valores do formulário
 */
type Validator<T> = (value: unknown, values: T) => string | undefined;

/**
 * Tipo para valor de regra com mensagem opcional
 */
type RuleValue<T> = number | { value: number; message: string};

/**
 * Tipo para regra de padrão (regex)
 */
type PatternRule = RegExp | { value: RegExp; message: string};

/**
 * Interface para regras de validação de campo
 *
 * @description
 * Define regras de validação que podem ser aplicadas a um campo do formulário.
 *
 * @template T - Tipo dos valores do formulário
 *
 * @example
 * ```ts
 * const rules: FieldValidationRules<FormData> ={ *   required: true,
 *   email: true,
 *   minLength: 8,
 *   maxLength: 100,
 *   pattern: /^[A-Z]/,
 *   custom: (value: unknown, values: unknown) => {
 *     if (value !== values.password) {
 *       return 'Senhas não coincidem';
 *      }
 *   }
 *};

 * ```
 */
export interface FieldValidationRules<T> {
  required?: boolean | string;
  email?: boolean | string;
  minLength?: RuleValue<T>;
  maxLength?: RuleValue<T>;
  pattern?: PatternRule;
  min?: RuleValue<T>;
  max?: RuleValue<T>;
  custom?: Validator<T>;
}

/**
 * Tipo para regras de validação de todos os campos do formulário
 *
 * @template T - Tipo dos valores do formulário
 */
export type ValidationRules<T> = Partial<
  Record<keyof T, FieldValidationRules<T>>
>;

/**
 * Interface de configuração do formulário
 *
 * @description
 * Configuração inicial para o hook useForm, incluindo valores iniciais,
 * regras de validação e callbacks.
 *
 * @template T - Tipo dos valores do formulário
 *
 * @example
 * ```ts
 * const config: FormConfig<FormData> = {
 *   initialValues: { email: '', password: '' },
 *   validationRules: { email: { required: true } ,
 *   onSubmit: async (values: unknown) => await submit(values),
 *   validateOnChange: true,
 *   validateOnBlur: true,
 *   resetOnSubmit: false
 *};

 * ```
 */
export interface FormConfig<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T, helpers: FormHelpers<T>) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSubmit?: boolean;
}

/**
 * Interface de estado do formulário
 *
 * @description
 * Estado atual do formulário, incluindo valores, erros, touched, dirty e status.
 *
 * @template T - Tipo dos valores do formulário
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

/**
 * Interface de helpers do formulário
 *
 * @description
 * Funções utilitárias fornecidas pelo hook useForm para manipulação
 * de campos e validação.
 *
 * @template T - Tipo dos valores do formulário
 */
export interface FormHelpers<T> {
  setFieldValue?: (e: any) => void;
  setFieldError?: (e: any) => void;
  setFieldTouched?: (e: any) => void;
  setValues?: (e: any) => void;
  setErrors: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof T, string>>>
  >;
  resetForm??: (e: any) => void;
  validateField: (field: keyof T) => string | undefined;
  validateForm: () => boolean;
}

/**
 * Valida um campo básico usando regras de validação
 *
 * @description
 * Valida um valor de campo aplicando todas as regras configuradas,
 * retornando a primeira mensagem de erro encontrada ou undefined se válido.
 *
 * @template T - Tipo dos valores do formulário
 * @param {any} value - Valor a ser validado
 * @param {FieldValidationRules<T>} rules - Regras de validação a serem aplicadas
 * @returns {string | undefined} Mensagem de erro ou undefined se válido
 *
 * @private
 */
const validateBasicField = <T>(
  value: unknown,
  rules: FieldValidationRules<T>,
): string | undefined => {
  if (rules.required) {
    const isEmpty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (isEmpty)
      return typeof rules.required === "string"
        ? rules.required
        : "Este campo é obrigatório";
  }

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(value))) {
      return typeof rules.email === "string" ? rules.email : "Email inválido";
    } if (rules.minLength !== undefined) {
    const minLength =
      typeof rules.minLength === "number"
        ? rules.minLength
        : rules.minLength.value;
    const message =
      typeof rules.minLength === "number"
        ? `Mínimo de ${minLength} caracteres`
        : rules.minLength.message;
    if (String(value).length < minLength) {
      return message;
    } if (rules.maxLength !== undefined) {
    const maxLength =
      typeof rules.maxLength === "number"
        ? rules.maxLength
        : rules.maxLength.value;
    const message =
      typeof rules.maxLength === "number"
        ? `Máximo de ${maxLength} caracteres`
        : rules.maxLength.message;
    if (String(value).length > maxLength) {
      return message;
    } if (rules.pattern) {
    const pattern =
      rules.pattern instanceof RegExp ? rules.pattern : rules.pattern.value;
    const message =
      rules.pattern instanceof RegExp
        ? "Formato inválido"
        : rules.pattern.message;
    if (!pattern.test(String(value))) {
      return message;
    } if (rules.min !== undefined) {
    const min = typeof rules.min === "number" ? rules.min : rules.min.value;
    const message =
      typeof rules.min === "number"
        ? `Valor mínimo: ${min}`
        : rules.min.message;
    if (Number(value) < min) {
      return message;
    } if (rules.max !== undefined) {
    const max = typeof rules.max === "number" ? rules.max : rules.max.value;
    const message =
      typeof rules.max === "number"
        ? `Valor máximo: ${max}`
        : rules.max.message;
    if (Number(value) > max) {
      return message;
    } return undefined;};

/**
 * Hook principal para gerenciamento de formulários
 *
 * @description
 * Hook que fornece gerenciamento completo de formulários React, incluindo
 * valores, validação, erros, touched, dirty e helpers para manipulação.
 *
 * @template T - Tipo dos valores do formulário (deve ser um objeto)
 * @param {FormConfig<T>} config - Configuração do formulário
 * @returns {FormState<T> & FormHelpers<T> & { handleSubmit: (e?: React.FormEvent) => Promise<void> } Objeto com estado, helpers e handleSubmit
 *
 * @example
 * ```tsx
 * interface FormData {
  *   email: string;
  *   password: string;
  *
  [key: string]: unknown; }
 *
 * const form = useForm<FormData>({
 *   initialValues: { email: '', password: '' },
 *   validationRules: {
 *     email: { required: true, email: true },
 *     password: { required: true, minLength: 8 }
 *   },
 *   onSubmit: async (values: unknown) => {
 *     await login(values);

 *   }
 * });

 *
 * // Usar no componente
 * <form onSubmit={ form.handleSubmit } />
 *   <input
 *     value={ form.values.email }
 *     onChange={ (e: unknown) => form.setFieldValue('email', e.target.value) }
 *     onBlur={ () => form.setFieldTouched('email') }
 *   />
 *   {form.touched.email && form.errors.email && (
 *     <span>{form.errors.email}</span>
 *   )}
 *   <button type="submit" disabled={ form.isSubmitting } />
 *     Enviar
 *   </button>
 * </form>
 * ```
 */
export const useForm = <T extends Record<string, any>>(
  config: FormConfig<T>,
) => {
  const {
    initialValues,
    validationRules = {},
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
    resetOnSubmit = false,
  } = config;

  const [values, setValues] = useState<T>(initialValues);

  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const [dirty, setDirty] = useState<Partial<Record<keyof T, boolean>>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValuesRef = useRef(initialValues);

  const validateSingleField = useCallback(
    (field: keyof T, value?: string): string | undefined => {
      const fieldValue = value !== undefined ? value : (values as Record<string, any>)[field as string];
      const rules = (validationRules as Record<string, FieldValidationRules<T> | undefined>)[field as string];
      if (!rules) return undefined;

      const basicError = validateBasicField(fieldValue, rules);

      if (basicError) return basicError;

      if (rules.custom) {
        return rules.custom(fieldValue, values as T);

      }
      return undefined;
    },
    [values, validationRules],);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    let isValid = true;
    (Object.keys(validationRules) as Array<keyof T>).forEach((field) => {
      const error = validateSingleField(field);

      if (error) {
        (newErrors as any)[field] = error;
        isValid = false;
      } );

    setErrors(newErrors);

    return isValid;
  }, [validationRules, validateSingleField]);

  const setFieldValue = useCallback(
    (field: keyof T, value: unknown) => {
      setValues((prev: unknown) => ({ ...prev, [field]: value }) as T);

      const isDirtyField = value !== initialValuesRef.current[field];
      setDirty((prev: unknown) => ({ ...prev, [field]: isDirtyField }));

      if (validateOnChange) {
        const error = validateSingleField(field, value);

        setErrors((prev: unknown) => ({ ...prev, [field]: error }));

      } ,
    [validateOnChange, validateSingleField],);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev: unknown) => ({ ...prev, [field]: error }));

  }, []);

  const setFieldTouched = useCallback(
    (field: keyof T, isTouched: boolean = true) => {
      setTouched((prev: unknown) => ({ ...prev, [field]: isTouched }));

      if (validateOnBlur && isTouched) {
        const error = validateSingleField(field);

        setErrors((prev: unknown) => ({ ...prev, [field]: error }));

      } ,
    [validateOnBlur, validateSingleField],);

  const setFormValues = useCallback((newValues: Partial<T>) => {
    setValues((prev: unknown) => ({ ...prev, ...newValues }) as T);

    const newDirty: Partial<Record<keyof T, boolean>> = {};

    (Object.keys(newValues) as Array<keyof T>).forEach((field: unknown) => {
      newDirty[field] = newValues[field] !== initialValuesRef.current[field];
    });

    setDirty((prev: unknown) => ({ ...prev, ...newDirty }));

  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);

    setErrors({});

    setTouched({});

    setDirty({});

    setIsSubmitting(false);

    initialValuesRef.current = initialValues;
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      setIsSubmitting(true);

      const allTouched: Partial<Record<keyof T, boolean>> = {};

      (Object.keys(values) as Array<keyof T>).forEach((field: unknown) => {
        allTouched[field] = true;
      });

      setTouched(allTouched);

      const isValid = validateForm();

      if (isValid) {
        try {
          const helpers: FormHelpers<T> = {
            setFieldValue,
            setFieldError,
            setFieldTouched,
            setErrors,
            setValues: setFormValues,
            resetForm,
            validateField: validateSingleField,
            validateForm,};

          await onSubmit(values as T, helpers);

          if (resetOnSubmit) resetForm();

        } catch (_error) {
          // Silencia erro para não quebrar UX do formulário
        } setIsSubmitting(false);

    },
    [
      values,
      validateForm,
      onSubmit,
      resetOnSubmit,
      setFieldValue,
      setFieldError,
      setFieldTouched,
      setFormValues,
      resetForm,
      validateSingleField,
    ],);

  const formState = useMemo<FormState<T>>(
    () => ({
      values: values as T,
      errors,
      touched,
      dirty,
      isSubmitting,
      isValid: Object.keys(errors).length === 0,
      isDirty: Object.values(dirty).some(Boolean),
    }),
    [values, errors, touched, dirty, isSubmitting],);

  const helpers = useMemo<FormHelpers<T>>(
    () => ({
      setFieldValue,
      setFieldError,
      setFieldTouched,
      setErrors,
      setValues: setFormValues,
      resetForm,
      validateField: validateSingleField,
      validateForm,
    }),
    [
      setFieldValue,
      setFieldError,
      setFieldTouched,
      setFormValues,
      resetForm,
      validateSingleField,
      validateForm,
    ],);

  return {
    ...formState,
    ...helpers,
    handleSubmit,};
};

export default useForm;
