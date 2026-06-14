import { createContext, useContext } from 'react';
import type { FormContextValue } from './types';

/**
 * null means "no Form ancestor"; {@link useFormContext} throws in that case so
 * a misplaced `Form.Item` fails loudly rather than silently doing nothing.
 */
export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error('Form.Item must be used inside a <Form>.');
  }
  return ctx;
}
