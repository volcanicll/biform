import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFormState } from './useFormState';

describe('useFormState', () => {
  it('setFieldValue updates values and fires onChange', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useFormState({ onChange }));
    act(() => result.current.setFieldValue('name', 'Bob'));
    expect(result.current.values.name).toBe('Bob');
    expect(onChange).toHaveBeenCalledWith({ name: 'Bob' });
  });

  it('validate runs registered rules and reports validity + errors', () => {
    const { result } = renderHook(() => useFormState());
    act(() => result.current.registerField('email', [{ required: true, message: '必填' }]));

    let valid = true;
    act(() => {
      valid = result.current.validate();
    });
    expect(valid).toBe(false);
    expect(result.current.errors.email).toBe('必填');

    act(() => result.current.setFieldValue('email', 'a@b.com'));
    act(() => {
      valid = result.current.validate();
    });
    expect(valid).toBe(true);
    expect(result.current.errors.email).toBeUndefined();
  });

  it('handleSubmit calls onSubmit only when valid', () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useFormState({ onSubmit }));
    act(() => result.current.registerField('x', [{ required: true }]));
    act(() => result.current.handleSubmit());
    expect(onSubmit).not.toHaveBeenCalled();

    act(() => result.current.setFieldValue('x', '1'));
    act(() => result.current.handleSubmit());
    expect(onSubmit).toHaveBeenCalledWith({ x: '1' });
  });

  it('validateOn=change sets field error live', () => {
    const { result } = renderHook(() => useFormState({ validateOn: 'change' }));
    act(() => result.current.registerField('pw', [{ min: 6, message: '太短' }]));
    act(() => result.current.setFieldValue('pw', '123'));
    expect(result.current.errors.pw).toBe('太短');
  });

  it('top-level validate prop contributes errors', () => {
    const { result } = renderHook(() =>
      useFormState({ validate: () => ({ global: '出错了' }) }),
    );
    let valid = true;
    act(() => {
      valid = result.current.validate();
    });
    expect(valid).toBe(false);
    expect(result.current.errors.global).toBe('出错了');
  });
});
