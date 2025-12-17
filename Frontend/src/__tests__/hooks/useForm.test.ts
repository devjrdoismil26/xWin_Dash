import { renderHook, act } from '@testing-library/react';
import { useForm } from '@/hooks/useForm';

describe('useForm', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => 
      useForm({ name: '', email: '' }));

    expect(result.current.values).toEqual({ name: '', email: '' });

  });

  it('should update field value', () => {
    const { result } = renderHook(() => useForm({ name: '' }));

    act(() => {
      result.current.setFieldValue('name', 'John');

    });

    expect(result.current.values.name).toBe('John');

  });

  it('should validate fields', () => {
    const validate = (values: unknown) => {
      const errors: unknown = {};

      if (!values.email) errors.email = 'Required';
      return errors;};

    const { result } = renderHook(() => 
      useForm({ email: '' }, { validate }));

    act(() => {
      result.current.handleSubmit(() => {});

    });

    expect(result.current.errors.email).toBe('Required');

  });

  it('should reset form', () => {
    const { result } = renderHook(() => useForm({ name: 'John' }));

    act(() => {
      result.current.setFieldValue('name', 'Jane');

      result.current.reset();

    });

    expect(result.current.values.name).toBe('John');

  });

});
