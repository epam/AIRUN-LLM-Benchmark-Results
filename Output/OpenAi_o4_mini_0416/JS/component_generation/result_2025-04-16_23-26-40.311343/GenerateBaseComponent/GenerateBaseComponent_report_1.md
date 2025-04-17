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
Below is a self‑contained, TypeScript‑based React 18 searchable select component plus a minimal CSS file. It supports single selection, keyboard navigation (Enter/Escape/Arrow keys), toggles with Enter, closes on outside click, and returns focus correctly.  

---  
File: SearchableSelect.tsx  
```tsx
import React, {
  useState,
  useRef,
  useEffect,
  useId,
  KeyboardEvent,
  ChangeEvent,
} from 'react';

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  /**
   * Selected option (controlled). If omitted, component manages its own selection.
   */
  value?: Option | null;
  /**
   * Called when an option is selected. If omitted, component will still
   * manage internal selection state.
   */
  onChange?: (option: Option) => void;
  /**
   * Placeholder text when nothing is selected.
   */
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<Option | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Controlled vs uncontrolled selected value
  const selected = value ?? internalValue;

  // Filtered list based on search term
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Unique IDs for ARIA attributes
  const idBase = useId();
  const listboxId = `${idBase}-listbox`;

  // Focus management on open/close
  useEffect(() => {
    if (isOpen) {
      // Reset search and highlight
      setSearchTerm('');
      setHighlightedIndex(0);
      // Focus the search input
      window.requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } else {
      // Return focus to control
      window.requestAnimationFrame(() => {
        controlRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [isOpen]);

  const openDropdown = () => setIsOpen(true);
  const closeDropdown = () => setIsOpen(false);
  const toggleDropdown = () => setIsOpen(open => !open);

  const handleControlKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleDropdown();
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(0);
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(idx =>
          Math.min(idx + 1, filteredOptions.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(idx => Math.max(idx - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
    }
  };

  const selectOption = (option: Option) => {
    if (onChange) {
      onChange(option);
    } else {
      setInternalValue(option);
    }
    closeDropdown();
  };

  const highlightedOptionId =
    filteredOptions.length > 0
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined;

  return (
    <div className="searchable-select" ref={containerRef}>
      <div
        className="searchable-select__control"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        tabIndex={0}
        ref={controlRef}
        onKeyDown={handleControlKeyDown}
        onClick={toggleDropdown}
      >
        {selected?.label ?? placeholder}
      </div>

      {isOpen && (
        <div className="searchable-select__dropdown">
          <input
            type="text"
            className="searchable-select__search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            role="searchbox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={highlightedOptionId}
            ref={inputRef}
          />

          <ul
            className="searchable-select__options-list"
            role="listbox"
            id={listboxId}
          >
            {filteredOptions.map((opt, idx) => {
              const isHighlighted = idx === highlightedIndex;
              const isSelected = selected?.value === opt.value;
              const optionId = `${listboxId}-option-${idx}`;
              return (
                <li
                  id={optionId}
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={
                    'searchable-select__option' +
                    (isHighlighted
                      ? ' searchable-select__option--highlighted'
                      : '') +
                    (isSelected
                      ? ' searchable-select__option--selected'
                      : '')
                  }
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => selectOption(opt)}
                >
                  {opt.label}
                </li>
              );
            })}
            {filteredOptions.length === 0 && (
              <li className="searchable-select__option--no-results">
                No results
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
```

---  
File: index.css  
```css
.searchable-select {
  position: relative;
  display: inline-block;
  width: 250px;
  font-family: sans-serif;
}

.searchable-select__control {
  padding: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  user-select: none;
}

.searchable-select__control:focus {
  outline: none;
  border-color: #007bff;
}

.searchable-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 2px;
  border: 1px solid #ccc;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.searchable-select__search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
}

.searchable-select__options-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.searchable-select__option {
  padding: 8px;
  cursor: pointer;
}

.searchable-select__option--highlighted,
.searchable-select__option:hover {
  background-color: #007bff;
  color: #fff;
}

.searchable-select__option--selected {
  font-weight: bold;
}

.searchable-select__option--no-results {
  padding: 8px;
  color: #777;
  cursor: default;
}
```

Usage example (in your App.tsx):
```tsx
import React, { useState } from 'react';
import SearchableSelect from './SearchableSelect';
import './index.css';

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  // …
];

export default function App() {
  const [selected, setSelected] = useState<{label: string; value: string} | null>(null);

  return (
    <div style={{ padding: 40 }}>
      <SearchableSelect
        options={OPTIONS}
        value={selected}
        onChange={setSelected}
        placeholder="Choose a fruit"
      />
      {selected && <p>Selected: {selected.label}</p>}
    </div>
  );
}
```

This component is fully keyboard‑accessible, closes on outside clicks or Escape, and returns focus to the main control when it closes. Feel free to adjust styling or extend typing to make `Option.value` generic.

### Tokens: {'input_tokens': 289, 'output_tokens': 7629, 'reasoning_tokens': 5568}
### Execution time: 46.70519304275513
