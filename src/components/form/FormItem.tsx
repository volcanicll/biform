import { cloneElement, useEffect, useMemo, type ReactElement } from 'react';
import { useId } from '@/hooks/useId';
import { usePlatform } from '@/core/platform';
import { useFormContext } from './FormContext';
import type { FormItemProps } from './types';
import { PcFormItem } from './pc';
import { MobileFormItem } from './mobile';

/** Infer the value prop name from the child component (Switch/Checkbox use `checked`). */
function inferValuePropName(child: ReactElement): string {
  const type = child.type as { displayName?: string };
  if (type?.displayName === 'Switch' || type?.displayName === 'Checkbox') return 'checked';
  return 'value';
}

/**
 * Adaptive `Form.Item` — registers the field, clones the single control to
 * inject value/onChange/status/aria, and renders the platform-specific layout
 * (PC: label-column + control; mobile: stacked label + control).
 */
export function FormItem(props: FormItemProps): ReactElement | null {
  const {
    name,
    label,
    required,
    rules,
    help,
    valuePropName,
    trigger = 'onChange',
    platform: override,
    className,
    children,
  } = props;

  const ctx = useFormContext();
  const errorId = useId('formitem');
  const { platform, unstable } = usePlatform(override);
  const effective = unstable ? 'pc' : platform;

  // Register/unregister the field with its rules.
  useEffect(() => {
    ctx.registerField(name, rules);
    return () => ctx.unregisterField(name);
  }, [ctx, name, rules]);

  const value = ctx.values[name];
  const error = ctx.errors[name];
  const resolvedValueProp = valuePropName ?? inferValuePropName(children);

  const childProps = useMemo(() => {
    const next: Record<string, unknown> = {
      [resolvedValueProp]: value,
      [trigger]: (...args: unknown[]) => ctx.setFieldValue(name, args[0]),
      status: error ? 'error' : undefined,
      ariaDescribedby: error ? errorId : undefined,
      disabled: ctx.disabled || undefined,
    };
    return next;
  }, [resolvedValueProp, trigger, value, error, errorId, ctx, name]);

  const cloned = cloneElement(children, childProps as Partial<typeof children>);

  const view = (
    <>
      {effective === 'mobile' ? (
        <MobileFormItem
          label={label}
          required={required}
          error={error}
          errorId={errorId}
          help={help}
          className={className}
        >
          {cloned}
        </MobileFormItem>
      ) : (
        <PcFormItem
          label={label}
          required={required}
          error={error}
          errorId={errorId}
          help={help}
          layout={ctx.layout}
          className={className}
        >
          {cloned}
        </PcFormItem>
      )}
    </>
  );
  return view;
}

FormItem.displayName = 'FormItem';
