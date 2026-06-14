import { useMemo } from 'react';
import { usePlatform } from '@/core/platform';
import { useFormState } from './useFormState';
import { FormContext } from './FormContext';
import { FormItem } from './FormItem';
import type { FormProps, FormComponent, FormContextValue } from './types';
import { PcForm } from './pc';
import { MobileForm } from './mobile';

/**
 * Adaptive Form — sets up form state + context, then renders the PC or mobile
 * shell. `Form.Item` (static property) wires each control into the form via
 * cloning. Layout is forced to vertical on mobile.
 */
function FormImpl(props: FormProps) {
  const {
    platform: override,
    layout = 'horizontal',
    initialValues,
    onSubmit,
    onChange,
    validate,
    validateOn,
    disabled = false,
    className,
    children,
  } = props;

  const { platform, unstable } = usePlatform(override);
  const effective = unstable ? 'pc' : platform;

  const formState = useFormState({ initialValues, onSubmit, onChange, validate, validateOn, disabled });

  const contextValue = useMemo<FormContextValue>(
    () => ({
      values: formState.values,
      errors: formState.errors,
      disabled: formState.disabled,
      validateOn: formState.validateOn,
      layout,
      setFieldValue: formState.setFieldValue,
      setFieldError: formState.setFieldError,
      registerField: formState.registerField,
      unregisterField: formState.unregisterField,
    }),
    [formState, layout],
  );

  const shell =
    effective === 'mobile' ? (
      <MobileForm className={className} onSubmit={formState.handleSubmit}>
        {children}
      </MobileForm>
    ) : (
      <PcForm layout={layout} className={className} onSubmit={formState.handleSubmit}>
        {children}
      </PcForm>
    );

  return <FormContext.Provider value={contextValue}>{shell}</FormContext.Provider>;
}

FormImpl.displayName = 'Form';
FormImpl.Item = FormItem;

export const Form = FormImpl as FormComponent;
