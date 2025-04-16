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
Below is a **production-ready, accessible, and reusable SearchableSelect component** in React 18.x with TypeScript. It includes full keyboard navigation, proper ARIA attributes, and all the behaviors you specified. Styling is provided in a separate `index.css` file.

---

### `SearchableSelect.tsx`

```tsx
import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  FocusEvent,
  MouseEvent,
} from 'react';

export interface SelectOption {
  label: string;
  value: string;
  [key: string]: any;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className,
  disabled = false,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Filtered options based on search
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Open dropdown and focus input
  const openDropdown = () => {
    if (!disabled) {
      setIsOpen(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  // Close dropdown and return focus to button
  const closeDropdown = () => {
    setIsOpen(false);
    setSearch('');
    setHighlightedIndex(-1);
    buttonRef.current?.focus();
  };

  // Handle outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
    // eslint-disable-next-line
  }, [isOpen]);

  // Keyboard navigation for input
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        selectOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  };

  // Keyboard navigation for button
  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      openDropdown();
      setHighlightedIndex(0);
    }
  };

  // Select option
  const selectOption = (option: SelectOption) => {
    onChange(option.value);
    closeDropdown();
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setHighlightedIndex(0);
  };

  // Handle option mouse events
  const handleOptionMouseEnter = (idx: number) => {
    setHighlightedIndex(idx);
  };

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;
    const list = document.getElementById('searchable-select-listbox');
    const item = document.getElementById(
      `searchable-select-option-${highlightedIndex}`
    );
    if (list && item) {
      const listRect = list.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top < listRect.top) {
        item.scrollIntoView({ block: 'nearest' });
      } else if (itemRect.bottom > listRect.bottom) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Handle focus loss: close dropdown if focus leaves component
  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget as Node)
    ) {
      closeDropdown();
    }
  };

  return (
    <div
      className={`searchable-select-container${className ? ' ' + className : ''}`}
      ref={containerRef}
      tabIndex={-1}
      onBlur={handleBlur}
      aria-disabled={disabled}
    >
      <button
        type="button"
        className="searchable-select-button"
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="searchable-select-listbox"
        aria-label={ariaLabel || placeholder}
        ref={buttonRef}
        disabled={disabled}
      >
        <span className={`searchable-select-value${!selectedOption ? ' placeholder' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="searchable-select-arrow" aria-hidden="true">
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="searchable-select-dropdown">
          <input
            ref={inputRef}
            className="searchable-select-input"
            type="text"
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Search..."
            aria-label="Search options"
            autoFocus
          />
          <ul
            className="searchable-select-list"
            id="searchable-select-listbox"
            role="listbox"
            aria-activedescendant={
              highlightedIndex >= 0
                ? `searchable-select-option-${highlightedIndex}`
                : undefined
            }
          >
            {filteredOptions.length === 0 ? (
              <li className="searchable-select-option no-options" aria-disabled="true">
                No options
              </li>
            ) : (
              filteredOptions.map((option, idx) => (
                <li
                  key={option.value}
                  id={`searchable-select-option-${idx}`}
                  className={`searchable-select-option${
                    idx === highlightedIndex ? ' highlighted' : ''
                  }${option.value === value ? ' selected' : ''}`}
                  role="option"
                  aria-selected={option.value === value}
                  tabIndex={-1}
                  onMouseEnter={() => handleOptionMouseEnter(idx)}
                  onMouseDown={(e) => {
                    // Prevent input blur before click
                    e.preventDefault();
                  }}
                  onClick={() => selectOption(option)}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
```

---

### `index.css`

```css
.searchable-select-container {
  position: relative;
  display: inline-block;
  min-width: 220px;
  font-family: inherit;
}

.searchable-select-button {
  width: 100%;
  text-align: left;
  background: #fff;
  border: 1px solid #bbb;
  border-radius: 4px;
  padding: 8px 36px 8px 12px;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  transition: border 0.2s;
  min-height: 40px;
  position: relative;
}

.searchable-select-button:focus {
  border-color: #2684ff;
  box-shadow: 0 0 0 2px #2684ff33;
}

.searchable-select-button[disabled] {
  background: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}

.searchable-select-value.placeholder {
  color: #888;
}

.searchable-select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 0.8em;
}

.searchable-select-dropdown {
  position: absolute;
  z-index: 1000;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #bbb;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  margin-top: 2px;
  padding: 8px 0 0 0;
}

.searchable-select-input {
  width: 95%;
  margin: 0 2.5%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 8px;
  outline: none;
  box-sizing: border-box;
}

.searchable-select-input:focus {
  border-color: #2684ff;
}

.searchable-select-list {
  max-height: 180px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.searchable-select-option {
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.searchable-select-option.selected {
  background: #e6f0ff;
  font-weight: 500;
}

.searchable-select-option.highlighted {
  background: #f0f6ff;
}

.searchable-select-option.no-options {
  color: #aaa;
  cursor: default;
  background: none;
}
```

---

### **Usage Example**

```tsx
import React, { useState } from 'react';
import { SearchableSelect, SelectOption } from './SearchableSelect';
import './index.css';

const options: SelectOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grape', value: 'grape' },
  { label: 'Mango', value: 'mango' },
];

export default function App() {
  const [value, setValue] = useState<string | undefined>();

  return (
    <div style={{ padding: 40 }}>
      <SearchableSelect
        options={options}
        value={value}
        onChange={setValue}
        placeholder="Choose a fruit"
        ariaLabel="Fruit select"
      />
    </div>
  );
}
```

---

**This component is:**
- Fully accessible (ARIA, keyboard, focus management)
- Reusable and type-safe
- Handles all specified behaviors
- Clean, production-ready code

Let me know if you need unit tests or further customization!

### Tokens: {'input_tokens': 290, 'output_tokens': 2659, 'reasoning_tokens': 0}
### Execution time: 48.63825821876526
