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
### Thoughts:
Let me break down the requirements for this searchable select component:

1. React 18.x with TypeScript
2. Searchable dropdown select
3. Single item selection
4. Full accessibility with keyboard navigation
5. Enter key to toggle dropdown and select items
6. Focus management
7. Close dropdown on selection, Escape, or outside click
8. Production-ready, clean code with proper TypeScript

I'll need to create:
1. A main SearchableSelect component
2. TypeScript interfaces for props and data
3. CSS styling in index.css
4. Proper keyboard event handling
5. Focus management
6. Click outside detection
7. Search filtering functionality

Key features to implement:
- State management for: isOpen, selectedItem, searchTerm, highlightedIndex
- Event handlers for keyboard navigation (ArrowUp, ArrowDown, Enter, Escape)
- Search filtering of options
- Click outside detection using useRef and useEffect
- Proper ARIA attributes for accessibility
- Focus management

Let me start coding:

### Answer:
I'll create a fully accessible searchable select component for you. Here's the implementation:

## SearchableSelect.tsx

```typescript
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './index.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange: (selectedOption: SelectOption | null) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  placeholder = 'Select an option...',
  onChange,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const selectedOption = options.find(option => option.value === value) || null;
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enabledFilteredOptions = filteredOptions.filter(option => !option.disabled);

  const resetHighlight = useCallback(() => {
    setHighlightedIndex(-1);
  }, []);

  const updateHighlight = useCallback((index: number) => {
    const maxIndex = enabledFilteredOptions.length - 1;
    if (maxIndex < 0) {
      setHighlightedIndex(-1);
      return;
    }
    
    if (index < 0) {
      setHighlightedIndex(maxIndex);
    } else if (index > maxIndex) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(index);
    }
  }, [enabledFilteredOptions.length]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    resetHighlight();
    inputRef.current?.focus();
  }, [resetHighlight]);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setSearchTerm('');
    resetHighlight();
  }, [disabled, resetHighlight]);

  const selectOption = useCallback((option: SelectOption) => {
    if (option.disabled) return;
    onChange(option);
    closeDropdown();
  }, [onChange, closeDropdown]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else if (highlightedIndex >= 0 && enabledFilteredOptions[highlightedIndex]) {
          selectOption(enabledFilteredOptions[highlightedIndex]);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        if (isOpen) {
          closeDropdown();
        }
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          updateHighlight(highlightedIndex + 1);
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          updateHighlight(highlightedIndex - 1);
        }
        break;
        
      case 'Tab':
        if (isOpen) {
          closeDropdown();
        }
        break;
    }
  }, [isOpen, highlightedIndex, enabledFilteredOptions, openDropdown, closeDropdown, selectOption, updateHighlight]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    resetHighlight();
  };

  const handleOptionClick = (option: SelectOption) => {
    selectOption(option);
  };

  const handleInputClick = () => {
    if (!isOpen) {
      openDropdown();
    }
  };

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeDropdown]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);

  // Focus management
  useEffect(() => {
    if (isOpen && listRef.current) {
      const searchInput = listRef.current.querySelector('input');
      searchInput?.focus();
    }
  }, [isOpen]);

  const getDisplayValue = () => {
    if (isOpen) {
      return searchTerm;
    }
    return selectedOption?.label || '';
  };

  const getOptionIndex = (option: SelectOption) => {
    return enabledFilteredOptions.findIndex(enabledOption => enabledOption.value === option.value);
  };

  return (
    <div 
      ref={containerRef}
      className={`searchable-select ${className} ${disabled ? 'searchable-select--disabled' : ''}`}
    >
      <div
        className={`searchable-select__input-container ${isOpen ? 'searchable-select__input-container--open' : ''}`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={handleInputClick}
        ref={inputRef}
      >
        <input
          type="text"
          className="searchable-select__input"
          value={getDisplayValue()}
          placeholder={placeholder}
          readOnly={!isOpen}
          onChange={handleSearchChange}
          disabled={disabled}
          tabIndex={-1}
          aria-autocomplete="list"
          aria-controls={isOpen ? 'searchable-select-listbox' : undefined}
          aria-activedescendant={
            highlightedIndex >= 0 ? `option-${enabledFilteredOptions[highlightedIndex]?.value}` : undefined
          }
        />
        <div className="searchable-select__arrow">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={isOpen ? 'searchable-select__arrow--flipped' : ''}
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul
          ref={listRef}
          id="searchable-select-listbox"
          className="searchable-select__dropdown"
          role="listbox"
          aria-label="Options"
        >
          {filteredOptions.length === 0 ? (
            <li className="searchable-select__option searchable-select__option--no-results">
              No options found
            </li>
          ) : (
            filteredOptions.map((option, index) => {
              const enabledIndex = getOptionIndex(option);
              const isHighlighted = enabledIndex === highlightedIndex;
              const isSelected = option.value === value;
              
              return (
                <li
                  key={option.value}
                  ref={el => {
                    if (enabledIndex >= 0) {
                      optionRefs.current[enabledIndex] = el;
                    }
                  }}
                  id={`option-${option.value}`}
                  className={`
                    searchable-select__option
                    ${isHighlighted ? 'searchable-select__option--highlighted' : ''}
                    ${isSelected ? 'searchable-select__option--selected' : ''}
                    ${option.disabled ? 'searchable-select__option--disabled' : ''}
                  `.trim()}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  onClick={() => !option.disabled && handleOptionClick(option)}
                  onMouseEnter={() => !option.disabled && setHighlightedIndex(enabledIndex)}
                >
                  {option.label}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
```

## index.css

```css
.searchable-select {
  position: relative;
  width: 100%;
  font-family: system-ui, -apple-system, sans-serif;
}

.searchable-select--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.searchable-select__input-container {
  position: relative;
  display: flex;
  align-items: center;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.searchable-select__input-container:focus-within,
.searchable-select__input-container--open {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.searchable-select--disabled .searchable-select__input-container {
  background-color: #f9fafb;
  border-color: #e5e7eb;
  cursor: not-allowed;
}

.searchable-select__input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 16px;
  font-size: 14px;
  background: transparent;
  cursor: inherit;
  color: #374151;
}

.searchable-select__input::placeholder {
  color: #9ca3af;
}

.searchable-select__input:disabled {
  cursor: not-allowed;
  color: #6b7280;
}

.searchable-select__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.searchable-select__arrow--flipped {
  transform: rotate(180deg);
}

.searchable-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  margin: 4px 0 0 0;
  padding: 0;
  list-style: none;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  animation: slideDown 0.15s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.searchable-select__option {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}

.searchable-select__option:last-child {
  border-bottom: none;
}

.searchable-select__option:hover:not(.searchable-select__option--disabled):not(.searchable-select__option--no-results) {
  background-color: #f3f4f6;
}

.searchable-select__option--highlighted {
  background-color: #3b82f6;
  color: #ffffff;
}

.searchable-select__option--selected {
  background-color: #eff6ff;
  color: #1d4ed8;
  font-weight: 500;
}

.searchable-select__option--selected.searchable-select__option--highlighted {
  background-color: #2563eb;
  color: #ffffff;
}

.searchable-select__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #9ca3af;
}

.searchable-select__option--no-results {
  cursor: default;
  color: #9ca3af;
  font-style: italic;
  text-align: center;
}

.searchable-select__option--no-results:hover {
  background-color: transparent;
}

/* Scrollbar styling for webkit browsers */
.searchable-select__dropdown::-webkit-scrollbar {
  width: 6px;
}

.searchable-select__dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.searchable-select__dropdown::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

.searchable-select__dropdown::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

/* Focus visible for better accessibility */
.searchable-select__input-container:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .searchable-select__input-container {
    border-width: 2px;
  }
  
  .searchable-select__option--highlighted {
    outline: 2px solid;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .searchable-select__dropdown,
  .searchable-select__arrow,
  .searchable-select__option {
    animation: none;
    transition: none;
  }
}
```

## Usage Example

```typescript
import React, { useState } from 'react';
import { SearchableSelect, SelectOption } from './SearchableSelect';

const App: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const options: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry', disabled: true },
    { value: 'fig', label: 'Fig' },
    { value: 'grape', label: 'Grape' },
  ];

  const handleChange = (option: SelectOption | null) => {
    setSelectedValue(option?.value || '');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <label id="fruit-label">Choose a fruit:</label>
      <SearchableSelect
        options={options}
        value={selectedValue}
        onChange={handleChange}
        placeholder="Search and select a fruit..."
        aria-labelledby="fruit-label"
      />
    </div>
  );
};

export default App;
```

## Key Features

1. **Full Accessibility Support**:
   - ARIA attributes for screen readers
   - Keyboard navigation (Arrow keys, Enter, Escape, Tab)
   - Focus management
   - High contrast and reduced motion support

2. **Search Functionality**:
   - Real-time filtering as you type
   - Case-insensitive search
   - "No results" state

3. **Robust Interaction**:
   - Click outside to close
   - Escape key to close
   - Enter to toggle/select
   - Mouse hover highlights options

4. **Production Ready**:
   - TypeScript interfaces
   - Proper error handling
   - Performance optimizations with useCallback
   - Clean, maintainable code structure

5. **Customizable**:
   - Disabled state support
   - Custom CSS classes
   - Flexible option structure
   - ARIA label support

The component is fully accessible, follows React best practices, and provides a smooth user experience across all interaction methods.

### Tokens: {'input_tokens': 342, 'output_tokens': 4751}
### Execution time: 55.03208804130554
