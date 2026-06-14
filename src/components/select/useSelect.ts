import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type RefObject } from 'react';
import { useControlled } from '@/hooks/useControlled';
import { useId } from '@/hooks/useId';
import type { SelectOption, UseSelectProps } from './types';

export interface UseSelectReturn {
  value: string | undefined;
  selectedOption: SelectOption | undefined;
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  options: SelectOption[];
  filteredOptions: SelectOption[];
  highlightedIndex: number;
  selectOption: (option: SelectOption) => void;
  clear: () => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  /** Spread onto the trigger element (combobox pattern). */
  triggerProps: {
    ref: RefObject<HTMLDivElement>;
    role: 'combobox';
    'aria-expanded': boolean;
    'aria-haspopup': 'listbox';
    'aria-controls'?: string;
    'aria-activedescendant'?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-disabled': boolean;
    onClick: (event: MouseEvent) => void;
    onKeyDown: (event: KeyboardEvent) => void;
  };
  /** Spread onto the listbox container. */
  listboxProps: {
    ref: RefObject<HTMLUListElement>;
    id: string;
    role: 'listbox';
    tabIndex: -1;
  };
  /** Per-option props (id, role, aria, mouse handlers). */
  getOptionProps: (index: number) => {
    id: string;
    role: 'option';
    'aria-selected': boolean;
    'aria-disabled': boolean;
    onMouseDown: (event: MouseEvent) => void;
    onMouseEnter: () => void;
  };
  refs: { trigger: RefObject<HTMLDivElement>; listbox: RefObject<HTMLUListElement> };
  idBase: string;
}

/**
 * Headless select logic — platform-agnostic, written ONCE.
 *
 * Owns open state, highlighted index, value selection, search filtering, all
 * keyboard navigation (Arrow/Home/End/Enter/Escape/Tab) and every WAI-ARIA
 * attribute. The PC dropdown and the mobile bottom-sheet consume the same bag;
 * only markup and placement differ.
 */
export function useSelect(props: UseSelectProps): UseSelectReturn {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    options,
    enableSearch,
    ariaLabel,
    ariaDescribedby,
    onOpenChange,
  } = props;

  const [valueRaw, setValue] = useControlled<string>({
    controlled: valueProp,
    default: defaultValue,
  });
  const value = valueRaw ?? undefined;
  const [open, setOpenState] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchValue, setSearchValue] = useState('');

  const triggerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const idBase = useId('select');

  // Keep latest callbacks/options in refs so keyboard handlers read fresh values.
  const onChangeRef = useRef(onChange);
  const onOpenChangeRef = useRef(onOpenChange);
  const optionsRef = useRef(options);
  useEffect(() => {
    onChangeRef.current = onChange;
    onOpenChangeRef.current = onOpenChange;
    optionsRef.current = options;
  });

  const filteredOptions = useMemo(() => {
    if (!enableSearch || searchValue.trim() === '') return options;
    const q = searchValue.trim().toLowerCase();
    return options.filter((o) => String(o.label).toLowerCase().includes(q));
  }, [options, enableSearch, searchValue]);

  const filteredRef = useRef(filteredOptions);
  filteredRef.current = filteredOptions;

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  const listboxId = `${idBase}-listbox`;
  const optionId = (index: number) => `${idBase}-option-${index}`;

  const setOpen = (next: boolean | ((prev: boolean) => boolean)) => {
    setOpenState((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      if (resolved !== prev) onOpenChangeRef.current?.(resolved);
      return resolved;
    });
  };

  const closeMenu = () => {
    setOpen(false);
    if (enableSearch) setSearchValue('');
  };

  const openMenu = () => {
    setOpen(true);
    const list = filteredRef.current;
    const idx = list.findIndex((o) => o.value === value);
    setHighlightedIndex(idx);
  };

  const selectOption = (option: SelectOption) => {
    if (option.disabled) return;
    setValue(option.value);
    onChangeRef.current?.(option.value, option);
    closeMenu();
    triggerRef.current?.focus();
  };

  const clear = () => {
    setValue(undefined);
    onChangeRef.current?.(undefined, undefined);
    setHighlightedIndex(-1);
  };

  const moveHighlight = (step: number) => {
    const list = filteredRef.current;
    if (list.length === 0) return;
    setHighlightedIndex((prev) => {
      if (prev < 0) {
        // No current highlight: ArrowDown → first enabled, ArrowUp → last enabled.
        if (step > 0) {
          const first = list.findIndex((o) => !o.disabled);
          return first === -1 ? -1 : first;
        }
        for (let i = list.length - 1; i >= 0; i--) {
          if (!list[i]?.disabled) return i;
        }
        return -1;
      }
      let idx = prev;
      for (let i = 0; i < list.length; i++) {
        idx = (idx + step + list.length) % list.length;
        if (!list[idx]?.disabled) return idx;
      }
      return prev;
    });
  };

  const selectHighlighted = () => {
    const list = filteredRef.current;
    const opt = highlightedIndex >= 0 ? list[highlightedIndex] : undefined;
    if (opt && !opt.disabled) selectOption(opt);
  };

  const handleTriggerClick = () => {
    if (open) closeMenu();
    else openMenu();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) openMenu();
        else moveHighlight(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) openMenu();
        else moveHighlight(-1);
        break;
      case 'Home':
        if (open) {
          event.preventDefault();
          const first = filteredRef.current.findIndex((o) => !o.disabled);
          setHighlightedIndex(first);
        }
        break;
      case 'End':
        if (open) {
          event.preventDefault();
          for (let i = filteredRef.current.length - 1; i >= 0; i--) {
            if (!filteredRef.current[i]?.disabled) {
              setHighlightedIndex(i);
              break;
            }
          }
        }
        break;
      case 'Enter':
        if (open) {
          event.preventDefault();
          selectHighlighted();
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          closeMenu();
        }
        break;
      case 'Tab':
        if (open) closeMenu();
        break;
      default:
        break;
    }
  };

  const triggerProps = {
    ref: triggerRef,
    role: 'combobox' as const,
    'aria-expanded': open,
    'aria-haspopup': 'listbox' as const,
    'aria-controls': open ? listboxId : undefined,
    'aria-activedescendant': open && highlightedIndex >= 0 ? optionId(highlightedIndex) : undefined,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-disabled': false,
    onClick: handleTriggerClick,
    onKeyDown: handleTriggerKeyDown,
  };

  const listboxProps = {
    ref: listboxRef,
    id: listboxId,
    role: 'listbox' as const,
    tabIndex: -1 as const,
  };

  const getOptionProps = (index: number) => {
    const opt = filteredOptions[index];
    return {
      id: optionId(index),
      role: 'option' as const,
      'aria-selected': value === opt?.value,
      'aria-disabled': !!opt?.disabled,
      onMouseDown: (event: MouseEvent) => {
        // preventDefault keeps focus on the trigger (no blur churn).
        event.preventDefault();
        if (opt && !opt.disabled) selectOption(opt);
      },
      onMouseEnter: () => {
        if (opt && !opt.disabled) setHighlightedIndex(index);
      },
    };
  };

  return {
    value,
    selectedOption,
    open,
    setOpen,
    options,
    filteredOptions,
    highlightedIndex,
    selectOption,
    clear,
    searchValue,
    setSearchValue,
    triggerProps,
    listboxProps,
    getOptionProps,
    refs: { trigger: triggerRef, listbox: listboxRef },
    idBase,
  };
}
