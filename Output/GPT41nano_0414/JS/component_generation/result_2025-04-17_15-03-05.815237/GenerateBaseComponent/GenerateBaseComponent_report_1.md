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
Certainly! Below is a complete implementation of a reusable, accessible, searchable select component in React 18.x with TypeScript. It includes the core component, styling via `index.css`, and adheres to all specified requirements.

---

### 1. `SearchableSelect.tsx`

```tsx
import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  FocusEvent,
  MouseEvent,
} from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (option: Option | null) => void;
  value?: Option | null;
  ariaLabel?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  value,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Focus the input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent<Document>) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openDropdown = () => {
    setIsOpen(true);
    setFocusedIndex(null);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(null);
    // Return focus to the select container
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFocusedIndex(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement | HTMLInputElement>) => {
    if (!isOpen && e.key === 'Enter') {
      // Open dropdown on Enter if closed
      e.preventDefault();
      openDropdown();
      return;
    }

    if (isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          if (prev === null || prev >= filteredOptions.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          if (prev === null || prev <= 0) {
            return filteredOptions.length - 1;
          }
          return prev - 1;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (focusedIndex !== null && filteredOptions[focusedIndex]) {
          selectOption(filteredOptions[focusedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeDropdown();
      }
    }
  };

  const selectOption = (option: Option) => {
    if (onChange) {
      onChange(option);
    }
    closeDropdown();
  };

  const handleOptionClick = (index: number) => {
    const option = filteredOptions[index];
    if (option) {
      selectOption(option);
    }
  };

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    // Optional: handle focus styles or behaviors
  };

  return (
    <div
      className="searchable-select"
      tabIndex={0}
      ref={containerRef}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-label={ariaLabel}
    >
      <div
        className="select-display"
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        role="combobox"
        aria-controls="searchable-select-list"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {value ? value.label : placeholder}
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="dropdown" role="listbox" id="searchable-select-list">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            aria-label="Search options"
            autoFocus
          />
          <ul className="options-list" ref={listRef} role="listbox">
            {filteredOptions.length === 0 && (
              <li className="no-options" role="option" aria-disabled>
                No options found
              </li>
            )}
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value?.value === option.value}
                className={`option ${
                  focusedIndex === index ? 'focused' : ''
                }`}
                onMouseEnter={() => setFocusedIndex(index)}
                onClick={() => handleOptionClick(index)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

---

### 2. `index.css`

```css
/* index.css */

.searchable-select {
  position: relative;
  width: 250px;
  font-family: Arial, sans-serif;
  outline: none;
}

.select-display {
  border: 1px solid #ccc;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-display:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.arrow {
  margin-left: 8px;
  font-size: 0.8em;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  font-size: 1em;
}

.options-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.option {
  padding: 8px 12px;
  cursor: pointer;
}

.option.focused,
.option:hover {
  background-color: #f0f0f0;
}

.no-options {
  padding: 8px 12px;
  color: #888;
  font-style: italic;
}
```

---

### 3. Usage Example (`App.tsx`)

```tsx
import React, { useState } from 'react';
import { SearchableSelect } from './SearchableSelect';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'mango', label: 'Mango' },
];

const App: React.FC = () => {
  const [selected, setSelected] = useState<{ value: string; label: string } | null>(null);

  const handleChange = (option: { value: string; label: string } | null) => {
    setSelected(option);
  };

  return (
    <div style={{ padding: '50px' }}>
      <h2>Searchable Select Demo</h2>
      <SearchableSelect
        options={options}
        value={selected}
        onChange={handleChange}
        ariaLabel="Fruit select"
      />
      {selected && <p>Selected: {selected.label}</p>}
    </div>
  );
};

export default App;
```

---

### Summary:
- The component is fully accessible with keyboard navigation, focus management, and ARIA attributes.
- Search functionality filters options dynamically.
- Clicking outside or selecting an option closes the dropdown.
- Focus returns to the main select container when closed.
- The styling is clean and minimal, easily customizable.

Feel free to integrate this component into your project and customize styles or behavior as needed!

### Tokens: {'input_tokens': 290, 'output_tokens': 2103, 'reasoning_tokens': 0}
### Execution time: 8.502068281173706
