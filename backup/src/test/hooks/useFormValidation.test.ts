import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFormValidation } from '@/hooks/useFormValidation';

describe('useFormValidation', () => {
  const mockValidationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format'
    },
    password: {
      required: true,
      minLength: 8,
      message: 'Password must be at least 8 characters'
    },
    confirmPassword: {
      required: true,
      validate: (value: string, formData: any) => value === formData.password,
      message: 'Passwords do not match'
    }
  };

  it('initializes with empty form data and no errors', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    expect(result.current.formData).toEqual({});
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
    expect(result.current.isDirty).toBe(false);
  });

  it('updates form data correctly', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    act(() => {
      result.current.setField('email', 'test@example.com');
    });

    expect(result.current.formData.email).toBe('test@example.com');
    expect(result.current.isDirty).toBe(true);
  });

  it('validates required fields', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    act(() => {
      result.current.setField('email', '');
      result.current.validateField('email');
    });

    expect(result.current.errors.email).toBe('This field is required');
    expect(result.current.isValid).toBe(false);
  });

  it('validates email pattern', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    act(() => {
      result.current.setField('email', 'invalid-email');
      result.current.validateField('email');
    });

    expect(result.current.errors.email).toBe('Invalid email format');
    expect(result.current.isValid).toBe(false);
  });

  it('validates minimum length', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    act(() => {
      result.current.setField('password', '123');
      result.current.validateField('password');
    });

    expect(result.current.errors.password).toBe('Password must be at least 8 characters');
    expect(result.current.isValid).toBe(false);
  });

  it('validates custom validation function', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    act(() => {
      result.current.setField('password', 'password123');
      result.current.setField('confirmPassword', 'different123');
      result.current.validateField('confirmPassword');
    });

    expect(result.current.errors.confirmPassword).toBe('Passwords do not match');
    expect(result.current.isValid).toBe(false);
  });

  it('clears errors when field becomes valid', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    // First, create an error
    act(() => {
      result.current.setField('email', 'invalid-email');
      result.current.validateField('email');
    });

    expect(result.current.errors.email).toBe('Invalid email format');

    // Then fix the error
    act(() => {
      result.current.setField('email', 'valid@example.com');
      result.current.validateField('email');
    });

    expect(result.current.errors.email).toBeUndefined();
  });

  it('validates all fields at once', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    act(() => {
      result.current.setField('email', 'invalid-email');
      result.current.setField('password', '123');
      result.current.validateAll();
    });

    expect(result.current.errors.email).toBe('Invalid email format');
    expect(result.current.errors.password).toBe('Password must be at least 8 characters');
    expect(result.current.isValid).toBe(false);
  });

  it('returns true for isValid when all fields are valid', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    act(() => {
      result.current.setField('email', 'test@example.com');
      result.current.setField('password', 'password123');
      result.current.setField('confirmPassword', 'password123');
      result.current.validateAll();
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  it('resets form data and errors', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    // Set some data and errors
    act(() => {
      result.current.setField('email', 'test@example.com');
      result.current.setField('password', '123');
      result.current.validateAll();
    });

    expect(result.current.isDirty).toBe(true);
    expect(result.current.errors.password).toBeDefined();

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.formData).toEqual({});
    expect(result.current.errors).toEqual({});
    expect(result.current.isDirty).toBe(false);
    expect(result.current.isValid).toBe(true);
  });

  it('sets multiple fields at once', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    act(() => {
      result.current.setFields({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(result.current.formData.email).toBe('test@example.com');
    expect(result.current.formData.password).toBe('password123');
    expect(result.current.isDirty).toBe(true);
  });

  it('handles async validation', async () => {
    const asyncValidationRules = {
      username: {
        required: true,
        asyncValidate: async (value: string) => {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 100));
          return value.length >= 3 ? null : 'Username must be at least 3 characters';
        }
      }
    };

    const { result } = renderHook(() => useFormValidation(asyncValidationRules));

    act(() => {
      result.current.setField('username', 'ab');
    });

    await act(async () => {
      await result.current.validateField('username');
    });

    expect(result.current.errors.username).toBe('Username must be at least 3 characters');
  });

  it('tracks field touched state', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    expect(result.current.touched).toEqual({});

    act(() => {
      result.current.setField('email', 'test@example.com');
    });

    expect(result.current.touched.email).toBe(true);
  });

  it('handles field blur events', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    act(() => {
      result.current.handleBlur('email');
    });

    expect(result.current.touched.email).toBe(true);
  });

  it('handles field change events', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    expect(result.current.formData.email).toBe('test@example.com');
    expect(result.current.touched.email).toBe(true);
  });

  it('provides field props for form inputs', () => {
    const { result } = renderHook(() => useFormValidation(mockValidationRules));

    const fieldProps = result.current.getFieldProps('email');

    expect(fieldProps).toHaveProperty('value');
    expect(fieldProps).toHaveProperty('onChange');
    expect(fieldProps).toHaveProperty('onBlur');
    expect(fieldProps).toHaveProperty('error');
    expect(fieldProps).toHaveProperty('touched');
  });
});
