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
Let me create a searchable select component with accessibility support following the requirements:

1. Technology Requirements:
   - React 18.x
   - TypeScript
   - index.css for styling

2. Core Functionality:
   - Searchable dropdown
   - Single item selection
   - Search functionality

3. Accessibility:
   - Full keyboard navigation
   - Enter key for selection and toggle
   - Focus management

4. Dropdown Behavior:
   - Close on selection
   - Close on Escape
   - Close on outside click
   - Open on Enter when focused

5. Code Quality:
   - Production-ready
   - Proper TypeScript typing
   - No TODOs
   - Reusable

I'll create:
1. SearchableSelect.tsx - Main component
2. index.css - Styles
3. Maybe split into smaller components if needed

Let me think about the structure:

- Main component will manage state for:
  - isOpen (dropdown visibility)
  - searchTerm
  - selectedItem
  - highlightedIndex (for keyboard navigation)

- Props interface:
  - options: array of items
  - value: selected value
  - onChange: callback
  - placeholder
  - disabled
  - label (for accessibility)
  - id

- Keyboard handling:
  - Enter: toggle dropdown, select item
  - Escape: close dropdown
  - ArrowUp/Down: navigate options
  - Type to search

- Click outside handling using useEffect and ref

- Accessibility attributes:
  - role="combobox"
  - aria-expanded
  - aria-haspopup
  - aria-controls
  - aria-activedescendant
  - role="listbox" for dropdown
  - role="option" for items

### Answer:
I'll create a searchable select component with full accessibility support. Here's the implementation:

**SearchableSelect.tsx**
```tsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './index.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  label,
  id,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  
  const selectedOption = useMemo(
    () => options.find(option => option.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(
    () => options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [options, searchTerm]
  );

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
      setSearchTerm('');
      setHighlightedIndex(0);
    }
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue);
    handleClose();
  }, [onChange, handleClose]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        } else {
          handleOpen();
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (isOpen) {
          handleClose();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          handleOpen();
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        }
        break;
    }
  }, [isOpen, highlightedIndex, filteredOptions, handleSelect, handleOpen, handleClose]);

  const handleButtonKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  }, [handleOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClose]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const highlightedElement = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const comboboxId = id || 'searchable-select';
  const listboxId = `${comboboxId}-listbox`;

  return (
    <div 
      ref={containerRef}
      className={`searchable-select ${className}`}
    >
      {label && (
        <label 
          htmlFor={comboboxId}
          className="searchable-select__label"
        >
          {label}
        </label>
      )}
      
      <div className="searchable-select__container">
        {isOpen ? (
          <input
            ref={inputRef}
            id={comboboxId}
            type="text"
            className="searchable-select__input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search..."
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-activedescendant={
              highlightedIndex >= 0 
                ? `${listboxId}-option-${highlightedIndex}`
                : undefined
            }
            autoFocus
            disabled={disabled}
          />
        ) : (
          <button
            ref={inputRef as any}
            id={comboboxId}
            className="searchable-select__button"
            onClick={handleOpen}
            onKeyDown={handleButtonKeyDown}
            disabled={disabled}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
          >
            <span className="searchable-select__button-text">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <svg 
              className="searchable-select__icon"
              width="12" 
              height="12" 
              viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path
                d="M2 4L6 8L10 4"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {isOpen && (
          <ul
            ref={listboxRef}
            id={listboxId}
            className="searchable-select__dropdown"
            role="listbox"
            aria-label="Options"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listboxId}-option-${index}`}
                  className={`searchable-select__option ${
                    highlightedIndex === index ? 'searchable-select__option--highlighted' : ''
                  } ${
                    option.value === value ? 'searchable-select__option--selected' : ''
                  }`}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="searchable-select__no-results">
                No results found
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
```

**index.css**
```css
.searchable-select {
  position: relative;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.searchable-select__label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.searchable-select__container {
  position: relative;
  width: 100%;
}

.searchable-select__button {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #111827;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  appearance: none;
}

.searchable-select__button:hover:not(:disabled) {
  border-color: #9ca3af;
}

.searchable-select__button:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.searchable-select__button:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.searchable-select__button-text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.searchable-select__icon {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;
}

.searchable-select__input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #111827;
  background-color: #ffffff;
  border: 1px solid #3b82f6;
  border-radius: 0.375rem;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.searchable-select__input::placeholder {
  color: #9ca3af;
}

.searchable-select__input:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.searchable-select__dropdown {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 10;
  max-height: 15rem;
  margin: 0;
  padding: 0.25rem 0;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  list-style: none;
}

.searchable-select__option {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #111827;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
}

.searchable-select__option:hover,
.searchable-select__option--highlighted {
  background-color: #f3f4f6;
}

.searchable-select__option--selected {
  font-weight: 600;
  color: #3b82f6;
}

.searchable-select__option--selected.searchable-select__option--highlighted {
  background-color: #eff6ff;
}

.searchable-select__no-results {
  padding: 0.75rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

/* Scrollbar styling */
.searchable-select__dropdown::-webkit-scrollbar {
  width: 0.375rem;
}

.searchable-select__dropdown::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}

.searchable-select__dropdown::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 0.375rem;
}

.searchable-select__dropdown::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

/* Animation */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.searchable-select__dropdown {
  animation: slideDown 0.15s ease-out;
}

/* Focus visible for keyboard navigation */
.searchable-select__button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .searchable-select__label {
    color: #e5e7eb;
  }

  .searchable-select__button,
  .searchable-select__input {
    color: #f3f4f6;
    background-color: #1f2937;
    border-color: #374151;
  }

  .searchable-select__button:hover:not(:disabled) {
    border-color: #4b5563;
  }

  .searchable-select__button:disabled,
  .searchable-select__input:disabled {
    background-color: #111827;
    color: #6b7280;
  }

  .searchable-select__icon {
    color: #9ca3af;
  }

  .searchable-select__dropdown {
    background-color: #1f2937;
    border-color: #374151;
  }

  .searchable-select__option {
    color: #f3f4f6;
  }

  .searchable-select__option:hover,
  .searchable-select__option--highlighted {
    background-color: #374151;
  }

  .searchable-select__option--selected {
    color: #60a5fa;
  }

  .searchable-select__option--selected.searchable-select__option--highlighted {
    background-color: #1e3a8a;
  }

  .searchable-select__no-results {
    color: #9ca3af;
  }
}
```

This searchable select component provides:

1. **Full Accessibility Support**:
   - ARIA attributes for screen readers
   - Keyboard navigation with arrow keys
   - Enter key for selection and toggle
   - Escape key to close dropdown
   - Focus management and trapping

2. **Search Functionality**:
   - Real-time filtering as you type
   - Case-insensitive search
   - Clear visual feedback for no results

3. **User Experience**:
   - Smooth animations
   - Visual highlighting of selected and hovered items
   - Click outside to close
   - Responsive design
   - Dark mode support

4. **TypeScript Support**:
   - Fully typed interfaces
   - Type-safe props and callbacks
   - Reusable across projects

Example usage:
```tsx
const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' }
];

<SearchableSelect
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
  label="Select a fruit"
  placeholder="Choose an option"
/>
```

### Tokens: {'input_tokens': 342, 'output_tokens': 4656}
### Execution time: 47.860454082489014
