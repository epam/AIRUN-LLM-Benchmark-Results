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
# Searchable Select Component with Accessibility Support

I'll create a fully accessible, searchable select component using React 18 and TypeScript. Here's the implementation:

## SearchableSelect.tsx

```tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './index.css';

export interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (selectedOption: Option | null) => void;
  value?: Option | null;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  value = null,
  className = '',
  id,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Scroll to highlighted option
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionsRef.current && optionRefs.current[highlightedIndex]) {
      const optionElement = optionRefs.current[highlightedIndex];
      if (optionElement) {
        optionElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Reset search term when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        // Focus the input when opening
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleOptionSelect = (option: Option) => {
    onChange(option);
    setIsOpen(false);
    // Return focus to the select component
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        } else {
          handleToggleDropdown();
        }
        event.preventDefault();
        break;
      case 'Escape':
        if (isOpen) {
          setIsOpen(false);
          // Return focus to the select component
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
          event.preventDefault();
        }
        break;
      case 'ArrowDown':
        if (isOpen) {
          setHighlightedIndex((prevIndex) => 
            prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex
          );
          event.preventDefault();
        } else {
          handleToggleDropdown();
          event.preventDefault();
        }
        break;
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
          event.preventDefault();
        }
        break;
      case 'Home':
        if (isOpen && filteredOptions.length > 0) {
          setHighlightedIndex(0);
          event.preventDefault();
        }
        break;
      case 'End':
        if (isOpen && filteredOptions.length > 0) {
          setHighlightedIndex(filteredOptions.length - 1);
          event.preventDefault();
        }
        break;
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setHighlightedIndex(0); // Reset highlighted index when search changes
  };

  // Generate a unique ID if none is provided
  const selectId = id || `searchable-select-${Math.random().toString(36).substr(2, 9)}`;
  const listboxId = `${selectId}-listbox`;

  return (
    <div
      ref={containerRef}
      className={`searchable-select ${className} ${disabled ? 'disabled' : ''}`}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={listboxId}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      role="combobox"
      id={selectId}
    >
      <div 
        className="select-control" 
        onClick={handleToggleDropdown}
        aria-label={placeholder}
      >
        <input
          ref={inputRef}
          type="text"
          className="select-input"
          placeholder={value ? value.label : placeholder}
          value={isOpen ? searchTerm : value ? value.label : ''}
          onChange={handleSearchChange}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOpen) handleToggleDropdown();
          }}
          readOnly={!isOpen}
          disabled={disabled}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && highlightedIndex >= 0
              ? `${selectId}-option-${highlightedIndex}`
              : undefined
          }
        />
        <div className="select-arrow">
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div 
          ref={optionsRef}
          className="select-options"
          role="listbox"
          id={listboxId}
          aria-label="Options"
        >
          {filteredOptions.length === 0 ? (
            <div className="no-options">No options found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                ref={(el) => (optionRefs.current[index] = el)}
                className={`select-option ${
                  highlightedIndex === index ? 'highlighted' : ''
                } ${value?.value === option.value ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
                role="option"
                id={`${selectId}-option-${index}`}
                aria-selected={value?.value === option.value}
                tabIndex={-1}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
```

## index.css

```css
.searchable-select {
  position: relative;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  color: #333;
  outline: none;
}

.searchable-select.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  padding: 0;
  min-height: 38px;
  transition: all 0.2s ease;
}

.searchable-select:focus-within .select-control {
  border-color: #2684ff;
  box-shadow: 0 0 0 1px #2684ff;
}

.select-input {
  flex: 1;
  border: none;
  padding: 8px 12px;
  background: transparent;
  font-size: inherit;
  color: inherit;
  width: 100%;
  outline: none;
  cursor: inherit;
}

.select-input::placeholder {
  color: #757575;
}

.select-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  color: #757575;
}

.select-arrow svg {
  fill: currentColor;
}

.select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.select-option {
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
}

.select-option:hover {
  background-color: #f5f5f5;
}

.select-option.highlighted {
  background-color: #ebf5ff;
}

.select-option.selected {
  background-color: #e6f7ff;
  font-weight: 500;
}

.no-options {
  padding: 8px 12px;
  color: #757575;
  font-style: italic;
}

/* Scrollbar styling */
.select-options::-webkit-scrollbar {
  width: 8px;
}

.select-options::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.select-options::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.select-options::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
```

## Example Usage

```tsx
import React, { useState } from 'react';
import { SearchableSelect, Option } from './SearchableSelect';

const options: Option[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'grape', label: 'Grape' },
  { value: 'watermelon', label: 'Watermelon' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'mango', label: 'Mango' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'peach', label: 'Peach' },
];

const App: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  return (
    <div style={{ width: '300px', margin: '50px auto' }}>
      <h2>Select a Fruit</h2>
      <SearchableSelect
        options={options}
        value={selectedOption}
        onChange={setSelectedOption}
        placeholder="Choose a fruit"
      />
      {selectedOption && (
        <p>You selected: {selectedOption.label}</p>
      )}
    </div>
  );
};

export default App;
```

## Component Features

This searchable select component includes:

1. **Accessibility Support**:
   - Full keyboard navigation (arrow keys, Enter, Escape, Home, End)
   - ARIA attributes for screen readers
   - Focus management
   - Proper roles and states

2. **Search Functionality**:
   - Real-time filtering of options
   - Highlighted search results
   - "No options found" message when search has no results

3. **Keyboard Navigation**:
   - Arrow keys to navigate options
   - Enter to select an option or open/close dropdown
   - Escape to close dropdown
   - Home/End to jump to first/last option

4. **Dropdown Behavior**:
   - Closes when an item is selected
   - Closes when clicking outside
   - Closes on Escape key
   - Opens on Enter key when focused
   - Returns focus to the select component when closed

5. **Styling**:
   - Clean, modern design
   - Visual feedback for hover, focus, and selection states
   - Scrollable dropdown for many options
   - Custom scrollbar styling

The component is fully typed with TypeScript and follows React best practices for a production-ready implementation.

### Tokens: {'input_tokens': 313, 'output_tokens': 3762}
### Execution time: 46.521764039993286
