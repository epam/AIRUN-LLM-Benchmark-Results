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
Below is a self-contained, production-ready implementation of an accessible, searchable select on React 18 + TypeScript.  
Copy the three files into your project and import `SearchableSelect` wherever you need a single-value, searchable dropdown.

──────────────── File: SearchableSelect.tsx
```tsx
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
  ForwardedRef,
  forwardRef,
} from 'react';
import './index.css';

export interface Option<T = string> {
  value: T;
  label: string;
}

export interface SearchableSelectProps<T = string> {
  /** List of items that can be chosen */
  options: Option<T>[];

  /** Currently selected value (controlled) */
  value?: T;

  /** Fired whenever user picks a new item */
  onChange: (value: T) => void;

  /** Placeholder text when nothing is chosen */
  placeholder?: string;

  /** Optional additional CSS class */
  className?: string;

  /** Component disabled flag */
  disabled?: boolean;
}

/**
 * Accessible, single-select, searchable dropdown.
 */
function SearchableSelectInner<T = string>(
  {
    options,
    value,
    onChange,
    placeholder = 'Select…',
    className = '',
    disabled = false,
  }: SearchableSelectProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  /* ---------- Refs ---------- */
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  // allow consumer to forward ref to the container
  useEffect(() => {
    if (typeof ref === 'function') ref(containerRef.current);
    else if (ref) ref.current = containerRef.current;
  }, [ref]);

  /* ---------- State ---------- */
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState<number>(-1);

  /* ---------- Derived data ---------- */
  const selected = useMemo(
    () => options.find((o) => o.value === value) || null,
    [value, options],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [options, query]);

  /* ---------- Helpers ---------- */
  const listboxId = useId();
  const optionId = (idx: number) => `${listboxId}-option-${idx}`;

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setHighlighted(-1);
    // ensure focus returns to the toggle
    toggleRef.current?.focus();
  }, []);

  const open = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  const toggle = useCallback(() => {
    isOpen ? close() : open();
  }, [isOpen, open, close]);

  const commitSelection = useCallback(
    (idx: number) => {
      const chosen = filtered[idx];
      if (chosen) {
        onChange(chosen.value);
        close();
      }
    },
    [filtered, onChange, close],
  );

  /* ---------- Event handlers ---------- */
  const onContainerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggle();
        break;
      case 'ArrowDown':
        e.preventDefault();
        open();
        // fall through after opening
        break;
      default:
    }
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlighted((h) => Math.min(filtered.length - 1, h + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlighted((h) => Math.max(0, h - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlighted >= 0) commitSelection(highlighted);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      default:
    }
  };

  /* ---------- Outside click & Escape listener ---------- */
  useEffect(() => {
    if (!isOpen) return;

    const onClick = (ev: MouseEvent) => {
      if (!containerRef.current?.contains(ev.target as Node)) close();
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') close();
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close]);

  /* ---------- Auto-focus search field on open ---------- */
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  /* ---------- Render ---------- */
  return (
    <div
      ref={containerRef}
      className={`searchable-select ${className} ${
        disabled ? 'disabled' : ''
      }`}
    >
      {/* Toggle / Combobox */}
      <div
        ref={toggleRef}
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-owns={listboxId}
        tabIndex={disabled ? -1 : 0}
        className="select-toggle"
        onClick={toggle}
        onKeyDown={onContainerKeyDown}
      >
        {selected ? selected.label : <span className="placeholder">{placeholder}</span>}
        <span className="chevron" aria-hidden />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="dropdown" role="presentation">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlighted(0);
            }}
            onKeyDown={onInputKeyDown}
            aria-label="Search"
            className="search-input"
          />

          <ul
            id={listboxId}
            role="listbox"
            aria-activedescendant={
              highlighted >= 0 ? optionId(highlighted) : undefined
            }
          >
            {filtered.length === 0 && (
              <li role="option" className="no-result" aria-disabled>
                No results
              </li>
            )}

            {filtered.map((opt, idx) => {
              const isActive = idx === highlighted;
              return (
                <li
                  key={String(opt.value)}
                  id={optionId(idx)}
                  role="option"
                  aria-selected={value === opt.value}
                  className={`option ${isActive ? 'active' : ''} ${
                    value === opt.value ? 'selected' : ''
                  }`}
                  onMouseEnter={() => setHighlighted(idx)}
                  onClick={() => commitSelection(idx)}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export const SearchableSelect = forwardRef(SearchableSelectInner) as <
  T = string,
>(
  props: SearchableSelectProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof SearchableSelectInner>;
```

──────────────── File: index.css
```css
/* Container */
.searchable-select {
  position: relative;
  font-family: system-ui, sans-serif;
  min-width: 200px;
}

.searchable-select.disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* Toggle (closed state) */
.select-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border: 1px solid #bbb;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.select-toggle:focus {
  outline: 2px solid #2684ff;
  outline-offset: 2px;
}

.placeholder {
  color: #888;
}

.chevron {
  margin-left: 8px;
  border: solid #666;
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
}

/* Dropdown */
.dropdown {
  position: absolute;
  z-index: 10;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  border: 1px solid #bbb;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Search field inside dropdown */
.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 8px;
  border: none;
  border-bottom: 1px solid #ddd;
}

.search-input:focus {
  outline: none;
}

/* Option list */
ul[role='listbox'] {
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.option,
.no-result {
  padding: 6px 8px;
  cursor: pointer;
}

.option.active {
  background: #2684ff;
  color: #fff;
}

.option.selected:not(.active) {
  background: #f0f5ff;
}

.no-result {
  cursor: default;
  color: #888;
}
```

──────────────── Example usage
```tsx
import { SearchableSelect, Option } from './SearchableSelect';

const cities: Option[] = [
  { value: 'ldn', label: 'London' },
  { value: 'ber', label: 'Berlin' },
  { value: 'nyc', label: 'New York' },
  { value: 'tok', label: 'Tokyo' },
];

function Demo() {
  const [city, setCity] = useState<string | undefined>();

  return (
    <SearchableSelect
      options={cities}
      value={city}
      onChange={setCity}
      placeholder="Choose a city"
    />
  );
}
```

Key accessibility & UX features implemented:

• Full keyboard support: Enter/Space to open/close, Arrow keys to navigate, Enter to select, Esc to close.  
• Roving-focus with `aria-activedescendant`, `role="combobox"`, `role="listbox"`, `role="option"`.  
• Focus is automatically returned to the combobox when the dropdown closes.  
• Clicking outside or pressing Escape dismisses the menu.  
• Clean, strongly-typed code with no TODOs; component is completely reusable.

### Tokens: {'input_tokens': 289, 'output_tokens': 3309, 'reasoning_tokens': 896}
### Execution time: 335.99899983406067
