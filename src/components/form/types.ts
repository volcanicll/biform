import type { FormEvent, ReactNode, ReactElement } from 'react';

/** A single validation rule for a field. Validators are synchronous in v0.1. */
export interface ValidationRule {
  required?: boolean;
  /** Minimum length (string) or value (number). */
  min?: number;
  /** Maximum length (string) or value (number). */
  max?: number;
  pattern?: RegExp;
  /** Custom synchronous validator; return an error message or undefined. */
  validator?: (value: unknown) => string | undefined;
  /** Message used when the rule fails (validator overrides). */
  message?: string;
}

export type ValidateTrigger = 'submit' | 'change' | 'blur';
export type FormLayout = 'horizontal' | 'vertical' | 'inline';

export interface FormProps {
  initialValues?: Record<string, unknown>;
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
  onChange?: (values: Record<string, unknown>) => void;
  /** Top-level validator returning a map of field errors. */
  validate?: (values: Record<string, unknown>) => Record<string, string | undefined>;
  validateOn?: ValidateTrigger;
  /** PC layout (mobile always renders vertical). Default 'horizontal'. */
  layout?: FormLayout;
  disabled?: boolean;
  /** Per-component platform override. */
  platform?: 'pc' | 'mobile';
  className?: string;
  children: ReactNode;
}

export interface FormItemProps {
  name: string;
  label?: ReactNode;
  /** Show the required marker (does not add a rule — use `rules` for that). */
  required?: boolean;
  rules?: ValidationRule[];
  /** Extra help text shown when there is no error. */
  help?: ReactNode;
  /** Which child prop carries the value (default 'value'; 'checked' for Switch/Checkbox). */
  valuePropName?: string;
  /** Which child event fires on change. Default 'onChange'. */
  trigger?: string;
  /** Per-component platform override. */
  platform?: 'pc' | 'mobile';
  className?: string;
  /** The single form control to wrap. */
  children: ReactElement;
}

export interface FormContextValue {
  values: Record<string, unknown>;
  errors: Record<string, string | undefined>;
  disabled: boolean;
  validateOn: ValidateTrigger;
  layout: FormLayout;
  setFieldValue: (name: string, value: unknown) => void;
  setFieldError: (name: string, error?: string) => void;
  registerField: (name: string, rules?: ValidationRule[]) => void;
  unregisterField: (name: string) => void;
}

export interface FormShellProps {
  layout?: FormLayout;
  disabled?: boolean;
  className?: string;
  onSubmit: (event: FormEvent) => void;
  children: ReactNode;
}

export interface FormItemViewProps {
  label?: ReactNode;
  required?: boolean;
  error?: string;
  errorId: string;
  help?: ReactNode;
  layout?: FormLayout;
  className?: string;
  children: ReactNode;
}

export interface FormComponent {
  (props: FormProps): ReactElement | null;
  Item: (props: FormItemProps) => ReactElement | null;
  displayName?: string;
}
