import React, { useCallback, useMemo, useRef, useState } from 'react';

type Validator<T> = (value: unknown, values: T) => string | undefined;

type RuleValue<T> = number | { value: number; message: string };
type PatternRule = RegExp | { value: RegExp; message: string };

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

export type ValidationRules<T> = Partial<Record<keyof T, FieldValidationRules<T>>>;

export interface FormConfig<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T, helpers: FormHelpers<T>) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSubmit?: boolean;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface FormHelpers<T> {
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void;
  setValues: (newValues: Partial<T>) => void;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof T, string>>>>;
  resetForm: () => void;
  validateField: (field: keyof T) => string | undefined;
  validateForm: () => boolean;
}

const validateBasicField = <T,>(value: unknown, rules: FieldValidationRules<T>): string | undefined => {
  if (rules.required) {
    const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
    if (isEmpty) return typeof rules.required === 'string' ? rules.required : 'Este campo é obrigatório';
  }

  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(value))) {
      return typeof rules.email === 'string' ? rules.email : 'Email inválido';
    }
  }

  if (rules.minLength !== undefined) {
    const minLength = typeof rules.minLength === 'number' ? rules.minLength : rules.minLength.value;
    const message = typeof rules.minLength === 'number' ? `Mínimo de ${minLength} caracteres` : rules.minLength.message;
    if (String(value).length < minLength) {
      return message;
    }
  }

  if (rules.maxLength !== undefined) {
    const maxLength = typeof rules.maxLength === 'number' ? rules.maxLength : rules.maxLength.value;
    const message = typeof rules.maxLength === 'number' ? `Máximo de ${maxLength} caracteres` : rules.maxLength.message;
    if (String(value).length > maxLength) {
      return message;
    }
  }

  if (rules.pattern) {
    const pattern = rules.pattern instanceof RegExp ? rules.pattern : rules.pattern.value;
    const message = rules.pattern instanceof RegExp ? 'Formato inválido' : rules.pattern.message;
    if (!pattern.test(String(value))) {
      return message;
    }
  }

  if (rules.min !== undefined) {
    const min = typeof rules.min === 'number' ? rules.min : rules.min.value;
    const message = typeof rules.min === 'number' ? `Valor mínimo: ${min}` : rules.min.message;
    if (Number(value) < min) {
      return message;
    }
  }

  if (rules.max !== undefined) {
    const max = typeof rules.max === 'number' ? rules.max : rules.max.value;
    const message = typeof rules.max === 'number' ? `Valor máximo: ${max}` : rules.max.message;
    if (Number(value) > max) {
      return message;
    }
  }

  return undefined;
};

export const useForm = <T extends Record<string, unknown>>(config: FormConfig<T>) => {
  const { initialValues, validationRules = {}, onSubmit, validateOnChange = true, validateOnBlur = true, resetOnSubmit = false } = config;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [dirty, setDirty] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValuesRef = useRef(initialValues);

  const validateSingleField = useCallback(
    (field: keyof T, value?: unknown): string | undefined => {
      const fieldValue = value !== undefined ? value : values[field];
      const rules = validationRules[field];
      if (!rules) return undefined;

      const basicError = validateBasicField(fieldValue, rules);
      if (basicError) return basicError;

      if (rules.custom) {
        return rules.custom(fieldValue, values as T);
      }
      return undefined;
    },
    [values, validationRules],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    (Object.keys(validationRules) as Array<keyof T>).forEach((field) => {
      const error = validateSingleField(field);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  }, [validationRules, validateSingleField]);

  const setFieldValue = useCallback((field: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value } as T));
    const isDirtyField = value !== initialValuesRef.current[field];
    setDirty((prev) => ({ ...prev, [field]: isDirtyField }));
    if (validateOnChange) {
      const error = validateSingleField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }, [validateOnChange, validateSingleField]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean = true) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
    if (validateOnBlur && isTouched) {
      const error = validateSingleField(field);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  }, [validateOnBlur, validateSingleField]);

  const setFormValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues } as T));
    const newDirty: Partial<Record<keyof T, boolean>> = {};
    (Object.keys(newValues) as Array<keyof T>).forEach((field) => {
      newDirty[field] = newValues[field] !== initialValuesRef.current[field];
    });
    setDirty((prev) => ({ ...prev, ...newDirty }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setDirty({});
    setIsSubmitting(false);
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const allTouched: Partial<Record<keyof T, boolean>> = {};
    (Object.keys(values) as Array<keyof T>).forEach((field) => {
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
          validateForm,
        };
        await onSubmit(values as T, helpers);
        if (resetOnSubmit) resetForm();
      } catch (_error) {
        // Silencia erro para não quebrar UX do formulário
      }
    }
    setIsSubmitting(false);
  }, [values, validateForm, onSubmit, resetOnSubmit, setFieldValue, setFieldError, setFieldTouched, setFormValues, resetForm, validateSingleField]);

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
    [values, errors, touched, dirty, isSubmitting],
  );

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
    [setFieldValue, setFieldError, setFieldTouched, setFormValues, resetForm, validateSingleField, validateForm],
  );

  return {
    ...formState,
    ...helpers,
    handleSubmit,
  };
};

export default useForm;
