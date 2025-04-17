Your task is to create a general component on React 18.x.
You should create a searchable select component with accessibility support.

Please follow these instructions:

1. Technology Requirements:
   - Implement using React 18.x
   - Use TypeScript for all component code
   - Include an index.css file for styling

2. Core Component Functionality:
   - Create a searchable dropdown select component
   - Implement search functionality within the dropdown
   - Support single item selection

3. Accessibility Requirements:
   - Ensure full keyboard navigation throughout the component
   - Support selection of items using the Enter key
   - Toggle dropdown visibility using the Enter key
   - Return focus to the select component when dropdown closes

4. Dropdown Behavior:
   - Close dropdown when an item is selected (via keyboard or mouse)
   - Close dropdown when the Escape key is pressed
   - Close dropdown when clicking outside the component
   - Open dropdown on Enter key press when component is focused

5. Code Quality Standards:
   - Produce production-ready, clean code
   - Include proper TypeScript typing throughout
   - Avoid TODO comments or placeholder code
   - Ensure component is reusable across different contexts
## Run 1:
### Answer:
Below you’ll find a compact, production‑ready implementation of a reusable, accessible, searchable single‑select component built with React 18 and TypeScript.

SearchableSelect.tsx
```tsx
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  KeyboardEvent,
  FC,
} from 'react';
import './index.css';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface Option {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  /** List of selectable options */
  options: Option[];
  /** Controlled value (optional)                                            */
  value?: string;
  /** Initial value for uncontrolled mode                                    */
  defaultValue?: string;
  /** Placeholder text shown when nothing is selected                        */
  placeholder?: string;
  /** Change handler (fires on every new selection)                          */
  onChange?: (option: Option) => void;
  /** Disable the whole component                                            */
  disabled?: boolean;
  /** Optional extra class name(s)                                           */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const KEY = {
  ENTER: 'Enter',
  ESC: 'Escape',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
} as const;

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export const SearchableSelect: FC<SearchableSelectProps> = ({
  options,
  value,
  defaultValue,
  placeholder = 'Select…',
  onChange,
  disabled = false,
  className = '',
}) => {
  /* --------------------------------- state -------------------------------- */
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlighted, setHighlighted] = useState<number>(-1);
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );

  /* ---------------------------------- refs -------------------------------- */
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useRef(
    `searchable-select-${Math.random().toString(36).slice(2, 10)}`,
  );

  /* --------------------------- derived variables -------------------------- */
  const selectedValue = value ?? internalValue;
  const selectedOption = options.find(o => o.value === selectedValue);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const l = search.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(l));
  }, [options, search]);

  /* ----------------------------- side effects ----------------------------- */
  /* Re‑focus search field whenever dropdown opens */
  useEffect(() => {
    if (isOpen) {
      // Wait until input is rendered
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  /* Keep highlighted index in bounds after filtering */
  useEffect(() => {
    if (filteredOptions.length === 0) {
      setHighlighted(-1);
      return;
    }
    setHighlighted(i => {
      if (i < 0) return 0;
      if (i >= filteredOptions.length) return filteredOptions.length - 1;
      return i;
    });
  }, [filteredOptions]);

  /* Close on click outside */
  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        close();
      }
    };

    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  /* ---------------------------- helper methods ---------------------------- */
  const open = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSearch('');
    setHighlighted(-1);
    rootRef.current?.focus();
  };

  const toggle = () => {
    isOpen ? close() : open();
  };

  const commit = (option: Option) => {
    if (value === undefined) setInternalValue(option.value);
    onChange?.(option);
    close();
  };

  /* ---------------------------- event handlers ---------------------------- */
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case KEY.ENTER: {
        if (!isOpen) {
          e.preventDefault();
          open();
        } else {
          e.preventDefault();
          if (highlighted >= 0 && highlighted < filteredOptions.length) {
            commit(filteredOptions[highlighted]);
          }
        }
        break;
      }

      case KEY.DOWN: {
        if (!isOpen) {
          e.preventDefault();
          open();
        } else {
          e.preventDefault();
          setHighlighted(i =>
            filteredOptions.length
              ? (i + 1) % filteredOptions.length
              : -1,
          );
        }
        break;
      }

      case KEY.UP: {
        if (!isOpen) return;
        e.preventDefault();
        setHighlighted(i =>
          filteredOptions.length
            ? (i - 1 + filteredOptions.length) % filteredOptions.length
            : -1,
        );
        break;
      }

      case KEY.ESC: {
        if (!isOpen) return;
        e.preventDefault();
        close();
        break;
      }
      default:
        break;
    }
  };

  /* ----------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ----------------------------------------------------------------------- */

  const classes = [
    'searchable-select',
    disabled && 'searchable-select--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={rootRef}
      tabIndex={disabled ? -1 : 0}
      className={classes}
      role="combobox"
      aria-haspopup="listbox"
      aria-controls={listboxId.current}
      aria-expanded={isOpen}
      onKeyDown={handleKeyDown}
      onClick={toggle}
    >
      <div className="searchable-select__value">
        {selectedOption ? (
          selectedOption.label
        ) : (
          <span className="searchable-select__placeholder">
            {placeholder}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="searchable-select__dropdown" onClick={e => e.stopPropagation()}>
          <input
            ref={inputRef}
            className="searchable-select__search"
            type="text"
            role="searchbox"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <ul
            id={listboxId.current}
            role="listbox"
            className="searchable-select__list"
          >
            {filteredOptions.length === 0 && (
              <li className="searchable-select__no-options">No options</li>
            )}

            {filteredOptions.map((o, idx) => {
              const isSel = o.value === selectedValue;
              const isHigh = idx === highlighted;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={isHigh}
                  className={[
                    'searchable-select__option',
                    isSel && 'searchable-select__option--selected',
                    isHigh && 'searchable-select__option--highlighted',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onMouseEnter={() => setHighlighted(idx)}
                  onMouseDown={e => e.preventDefault()} // keep focus
                  onClick={() => commit(o)}
                >
                  {o.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
```

index.css
```css
/* ---------- root ---------- */
.searchable-select {
  position: relative;
  display: inline-block;
  min-width: 220px;
  font-family: system-ui, sans-serif;
  cursor: pointer;
}
.searchable-select:focus {
  outline: none;
}
.searchable-select--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* ---------- closed control ---------- */
.searchable-select__value {
  padding: 8px 12px;
  border: 1px solid #bbb;
  border-radius: 4px;
  background: #fff;
}
.searchable-select__placeholder {
  color: #999;
}

/* ---------- dropdown ---------- */
.searchable-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  border: 1px solid #bbb;
  border-top: none;
  background: #fff;
}

/* search input */
.searchable-select__search {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border: none;
  border-bottom: 1px solid #eee;
  outline: none;
}

/* list / options */
.searchable-select__list {
  max-height: 220px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
}
.searchable-select__no-options {
  padding: 8px 12px;
  color: #999;
}
.searchable-select__option {
  padding: 8px 12px;
}
.searchable-select__option:hover {
  background: #f5f5f5;
}
.searchable-select__option--highlighted {
  background: #2684ff;
  color: #fff;
}
.searchable-select__option--selected {
  font-weight: 600;
}
.searchable-select__option--selected.searchable-select__option--highlighted {
  color: #fff;
}
```

Highlights of the component
• Fully typed, reusable API (uncontrolled or controlled usage).  
• Real‑time search with filtered rendering.  
• Complete keyboard support: open/close (Enter / Esc), navigation (↑ / ↓), selection (Enter).  
• Focus management respects accessibility guidelines.  
• Closes on outside click, Escape key, or selection.  
• Clean, namespaced styles in `index.css` (easy to override).

### Tokens: {'input_tokens': 289, 'output_tokens': 6516, 'reasoning_tokens': 4288}
### Execution time: 57.36586117744446
