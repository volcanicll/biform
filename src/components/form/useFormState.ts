import { useCallback, useRef, useState, type FormEvent } from 'react';
import type { ValidationRule, ValidateTrigger } from './types';

export interface UseFormStateParams {
  initialValues?: Record<string, unknown>;
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
  onChange?: (values: Record<string, unknown>) => void;
  validate?: (values: Record<string, unknown>) => Record<string, string | undefined>;
  validateOn?: ValidateTrigger;
  disabled?: boolean;
}

export interface UseFormStateReturn {
  values: Record<string, unknown>;
  errors: Record<string, string | undefined>;
  disabled: boolean;
  validateOn: ValidateTrigger;
  setFieldValue: (name: string, value: unknown) => void;
  setFieldError: (name: string, error?: string) => void;
  registerField: (name: string, rules?: ValidationRule[]) => void;
  unregisterField: (name: string) => void;
  validate: () => boolean;
  handleSubmit: (event?: FormEvent) => void;
}

/** Run a single rule against a value; returns an error message or undefined. */
function runRule(value: unknown, rule: ValidationRule): string | undefined {
  const isEmpty =
    value === null ||
    value === undefined ||
    value === '' ||
    (typeof value === 'string' && value.trim() === '');

  if (rule.required && isEmpty) return rule.message ?? '该项为必填';
  if (isEmpty) return undefined;

  if (rule.min !== undefined && typeof value === 'string' && value.length < rule.min) {
    return rule.message ?? `不能少于 ${rule.min} 个字符`;
  }
  if (rule.max !== undefined && typeof value === 'string' && value.length > rule.max) {
    return rule.message ?? `不能多于 ${rule.max} 个字符`;
  }
  if (rule.pattern && !rule.pattern.test(String(value))) {
    return rule.message ?? '格式不正确';
  }
  if (rule.validator) return rule.validator(value);
  return undefined;
}

/**
 * Headless form orchestration — platform-agnostic.
 *
 * Owns values/errors state, field registration, per-field + whole-form
 * validation, and submit handling. Zero dependencies; designed so any of our
 * form controls (which share value/onChange/status/ariaDescribedby) plug in via
 * `Form.Item` cloning.
 */
export function useFormState(params: UseFormStateParams = {}): UseFormStateReturn {
  const {
    initialValues,
    onSubmit,
    onChange,
    validate: validateProp,
    validateOn = 'submit',
    disabled = false,
  } = params;

  const [values, setValues] = useState<Record<string, unknown>>(initialValues ?? {});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const fieldsRef = useRef(new Map<string, ValidationRule[] | undefined>());

  // Keep latest callbacks in refs so stable setters don't go stale.
  const onChangeRef = useRef(onChange);
  const onSubmitRef = useRef(onSubmit);
  const validatePropRef = useRef(validateProp);
  const validateOnRef = useRef<ValidateTrigger>(validateOn);
  onChangeRef.current = onChange;
  onSubmitRef.current = onSubmit;
  validatePropRef.current = validateProp;
  validateOnRef.current = validateOn;

  const validateField = useCallback((name: string, value: unknown): string | undefined => {
    const rules = fieldsRef.current.get(name) ?? [];
    for (const rule of rules) {
      const err = runRule(value, rule);
      if (err) return err;
    }
    return undefined;
  }, []);

  const setFieldError = useCallback((name: string, error?: string) => {
    setErrors((prev) => (prev[name] === error ? prev : { ...prev, [name]: error }));
  }, []);

  const setFieldValue = useCallback(
    (name: string, value: unknown) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value };
        onChangeRef.current?.(next);
        return next;
      });
      if (validateOnRef.current === 'change') {
        setFieldError(name, validateField(name, value));
      }
    },
    [setFieldError, validateField],
  );

  const registerField = useCallback((name: string, rules?: ValidationRule[]) => {
    fieldsRef.current.set(name, rules);
  }, []);

  const unregisterField = useCallback((name: string) => {
    fieldsRef.current.delete(name);
  }, []);

  const validate = useCallback((): boolean => {
    const nextErrors: Record<string, string | undefined> = {};
    let valid = true;
    fieldsRef.current.forEach((rules, name) => {
      const err = validateField(name, values[name]);
      nextErrors[name] = err;
      if (err) valid = false;
    });
    const propErrors = validatePropRef.current?.(values);
    if (propErrors) {
      for (const key of Object.keys(propErrors)) {
        const msg = propErrors[key];
        if (msg) {
          nextErrors[key] = msg;
          valid = false;
        }
      }
    }
    setErrors(nextErrors);
    return valid;
  }, [validateField, values]);

  const handleSubmit = useCallback(
    (event?: FormEvent) => {
      event?.preventDefault();
      if (validate()) {
        onSubmitRef.current?.(values);
      }
    },
    [validate, values],
  );

  return {
    values,
    errors,
    disabled,
    validateOn,
    setFieldValue,
    setFieldError,
    registerField,
    unregisterField,
    validate,
    handleSubmit,
  };
}
