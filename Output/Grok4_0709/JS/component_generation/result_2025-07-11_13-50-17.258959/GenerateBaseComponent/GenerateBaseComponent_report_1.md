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
```typescript
// src/Select.tsx
import React, { useState, useRef, useEffect } from 'react';
import './index.css';

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an item',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedValue = value !== undefined ? value : internalSelected;
  const selectedOption = options.find((o) => o.value === selectedValue);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
      setSearchTerm('');
      setHighlightedIndex(-1);
    } else {
      buttonRef.current?.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on focus outside
  useEffect(() => {
    if (!isOpen) return;
    const handleFocusIn = (event: FocusEvent) => {
      if (
        dropdownRef.current?.contains(event.target as Node) ||
        buttonRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const selectOption = (option: Option) => {
    if (value === undefined) {
      setInternalSelected(option.value);
    }
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    const newFiltered = options.filter((o) =>
      o.label.toLowerCase().includes(newTerm.toLowerCase())
    );
    setHighlightedIndex(newFiltered.length > 0 ? 0 : -1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        selectOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const max = filteredOptions.length - 1;
        if (max < 0) return -1;
        if (e.key === 'ArrowDown') {
          return prev < 0 ? 0 : Math.min(prev + 1, max);
        } else {
          return prev < 0 ? max : Math.max(prev - 1, 0);
        }
      });
    }
  };

  return (
    <div className={`select-wrapper ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        className="select-button"
        onClick={toggleDropdown}
        onKeyDown={handleButtonKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="select-listbox"
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span className="select-arrow">▼</span>
      </button>
      {isOpen && (
        <div ref={dropdownRef} className="dropdown">
          <input
            ref={searchRef}
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..."
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={true}
            aria-controls="select-listbox"
            aria-activedescendant={
              highlightedIndex >= 0 ? `option-${filteredOptions[highlightedIndex].value}` : undefined
            }
          />
          <ul id="select-listbox" role="listbox" className="options-list">
            {filteredOptions.length === 0 ? (
              <li className="no-options">No options found</li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`option-${option.value}`}
                  role="option"
                  aria-selected={selectedValue === option.value}
                  className={`option-item ${index === highlightedIndex ? 'highlighted' : ''}`}
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

```css
/* src/index.css */
.select-wrapper {
  position: relative;
  display: inline-block;
}

.select-button {
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  min-width: 200px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-arrow {
  margin-left: 8px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 1000;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.search-input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #eee;
}

.options-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.option-item {
  padding: 8px 12px;
  cursor: pointer;
}

.option-item:hover,
.option-item.highlighted {
  background-color: #f0f0f0;
}

.no-options {
  padding: 8px 12px;
  color: #999;
  text-align: center;
}
```

### Tokens: {'input_tokens': 288, 'output_tokens': 1687, 'reasoning_tokens': 8184}
### Execution time: 260.55132389068604
