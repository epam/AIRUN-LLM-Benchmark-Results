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
Let's create a searchable select component with accessibility support for React 18.x using TypeScript. I'll break down this task into steps:

1. Define the component interface (props)
2. Create the main SearchableSelect component
3. Implement keyboard navigation and accessibility features
4. Style the component with CSS
5. Handle dropdown behavior as specified

Let's start:

### 1. Define the Component Interface

```typescript
interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
```

### 2. Create the SearchableSelect Component

Here's the main component structure:

```tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './index.css';

export interface Option {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected option's label
  const selectedOption = options.find(option => option.value === value);
  
  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    }
  };

  // Handle item selection
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    // Return focus to the select component
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex].value);
        } else {
          toggleDropdown();
        }
        e.preventDefault();
        break;
      case 'Escape':
        if (isOpen) {
          setIsOpen(false);
          // Return focus to the select component
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        } else {
          setIsOpen(true);
        }
        e.preventDefault();
        break;
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        }
        e.preventDefault();
        break;
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1); // Reset highlighted index when search changes
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current && 
        !selectRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll to highlighted item
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
      const highlighted = dropdownRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div 
      className={`searchable-select ${className} ${disabled ? 'disabled' : ''}`}
      ref={selectRef}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-owns="search-select-options"
      aria-disabled={disabled}
    >
      <div 
        className="select-control"
        onClick={toggleDropdown}
      >
        <input
          ref={inputRef}
          type="text"
          className="select-input"
          placeholder={value ? '' : placeholder}
          value={isOpen ? searchTerm : selectedOption?.label || ''}
          onChange={handleSearchChange}
          readOnly={!isOpen}
          disabled={disabled}
          aria-autocomplete="list"
          aria-controls="search-select-options"
        />
        <div className="select-arrow">
          <svg 
            viewBox="0 0 20 20" 
            width="16" 
            height="16" 
            aria-hidden="true"
          >
            <path 
              d="M10 14l-5-5 1.41-1.41L10 11.17l3.59-3.58L15 9z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div 
          className="select-options"
          id="search-select-options"
          role="listbox"
          ref={dropdownRef}
        >
          {filteredOptions.length === 0 ? (
            <div className="no-options">No options found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={`select-option ${option.value === value ? 'selected' : ''} ${
                  index === highlightedIndex ? 'highlighted' : ''
                }`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={option.value === value}
                data-index={index}
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

### 3. CSS Styling (index.css)

Let's define the CSS for our component:

```css
.searchable-select {
  position: relative;
  width: 100%;
  min-width: 200px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
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
  padding: 6px 8px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.searchable-select:focus-within .select-control {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.select-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  padding: 4px 0;
}

.select-input:disabled {
  cursor: not-allowed;
}

.select-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: transform 0.2s ease;
}

.searchable-select[aria-expanded="true"] .select-arrow {
  transform: rotate(180deg);
}

.select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.select-option {
  padding: 8px 12px;
  cursor: pointer;
}

.select-option:hover {
  background-color: #f5f5f5;
}

.select-option.highlighted {
  background-color: #e6f7ff;
}

.select-option.selected {
  background-color: #f0f0f0;
  font-weight: 500;
}

.select-option.selected.highlighted {
  background-color: #e6f7ff;
}

.no-options {
  padding: 8px 12px;
  color: #999;
  font-style: italic;
}

/* Scrollbar styling */
.select-options::-webkit-scrollbar {
  width: 8px;
}

.select-options::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.select-options::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

.select-options::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
```

### Checking Requirement Compliance

Let's make sure my implementation meets all the requirements:

1. ✅ **Technology Requirements**:
   - ✅ Implemented using React 18.x (using modern React hooks and features)
   - ✅ Used TypeScript for all component code
   - ✅ Included an index.css file for styling

2. ✅ **Core Component Functionality**:
   - ✅ Created a searchable dropdown select component
   - ✅ Implemented search functionality within the dropdown
   - ✅ Support single item selection

3. ✅ **Accessibility Requirements**:
   - ✅ Ensured full keyboard navigation throughout the component
   - ✅ Support selection of items using the Enter key
   - ✅ Toggle dropdown visibility using the Enter key
   - ✅ Return focus to the select component when dropdown closes

4. ✅ **Dropdown Behavior**:
   - ✅ Close dropdown when an item is selected (via keyboard or mouse)
   - ✅ Close dropdown when the Escape key is pressed
   - ✅ Close dropdown when clicking outside the component
   - ✅ Open dropdown on Enter key press when component is focused

5. ✅ **Code Quality Standards**:
   - ✅ Production-ready, clean code
   - ✅ Includes proper TypeScript typing throughout
   - ✅ No TODO comments or placeholder code
   - ✅ Component is reusable across different contexts

All requirements have been met. The component provides a fully accessible, searchable select dropdown with keyboard navigation and proper focus management.

Let me quickly review again for any issues:

- The component handles opening/closing the dropdown appropriately
- Keyboard navigation works for all specified cases
- Focus is returned to the select component when the dropdown closes
- Search functionality filters the options properly
- Proper ARIA attributes are used for accessibility
- TypeScript typing is comprehensive
- CSS styling is clean and provides visual feedback for different states

Everything looks good!

### Answer:
# Searchable Select Component with Accessibility Support

I've created a fully accessible searchable dropdown select component for React 18 using TypeScript. The component provides search functionality, keyboard navigation, and ARIA attributes for accessibility.

## Component Files

### SearchableSelect.tsx
```tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './index.css';

export interface Option {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected option's label
  const selectedOption = options.find(option => option.value === value);
  
  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    }
  };

  // Handle item selection
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    // Return focus to the select component
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex].value);
        } else {
          toggleDropdown();
        }
        e.preventDefault();
        break;
      case 'Escape':
        if (isOpen) {
          setIsOpen(false);
          // Return focus to the select component
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        } else {
          setIsOpen(true);
        }
        e.preventDefault();
        break;
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        }
        e.preventDefault();
        break;
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1); // Reset highlighted index when search changes
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current && 
        !selectRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll to highlighted item
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
      const highlighted = dropdownRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div 
      className={`searchable-select ${className} ${disabled ? 'disabled' : ''}`}
      ref={selectRef}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-owns="search-select-options"
      aria-disabled={disabled}
    >
      <div 
        className="select-control"
        onClick={toggleDropdown}
      >
        <input
          ref={inputRef}
          type="text"
          className="select-input"
          placeholder={value ? '' : placeholder}
          value={isOpen ? searchTerm : selectedOption?.label || ''}
          onChange={handleSearchChange}
          readOnly={!isOpen}
          disabled={disabled}
          aria-autocomplete="list"
          aria-controls="search-select-options"
        />
        <div className="select-arrow">
          <svg 
            viewBox="0 0 20 20" 
            width="16" 
            height="16" 
            aria-hidden="true"
          >
            <path 
              d="M10 14l-5-5 1.41-1.41L10 11.17l3.59-3.58L15 9z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div 
          className="select-options"
          id="search-select-options"
          role="listbox"
          ref={dropdownRef}
        >
          {filteredOptions.length === 0 ? (
            <div className="no-options">No options found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={`select-option ${option.value === value ? 'selected' : ''} ${
                  index === highlightedIndex ? 'highlighted' : ''
                }`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={option.value === value}
                data-index={index}
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

### index.css
```css
.searchable-select {
  position: relative;
  width: 100%;
  min-width: 200px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
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
  padding: 6px 8px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.searchable-select:focus-within .select-control {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.select-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  padding: 4px 0;
}

.select-input:disabled {
  cursor: not-allowed;
}

.select-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: transform 0.2s ease;
}

.searchable-select[aria-expanded="true"] .select-arrow {
  transform: rotate(180deg);
}

.select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.select-option {
  padding: 8px 12px;
  cursor: pointer;
}

.select-option:hover {
  background-color: #f5f5f5;
}

.select-option.highlighted {
  background-color: #e6f7ff;
}

.select-option.selected {
  background-color: #f0f0f0;
  font-weight: 500;
}

.select-option.selected.highlighted {
  background-color: #e6f7ff;
}

.no-options {
  padding: 8px 12px;
  color: #999;
  font-style: italic;
}

/* Scrollbar styling */
.select-options::-webkit-scrollbar {
  width: 8px;
}

.select-options::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.select-options::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

.select-options::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
```

## Component Features

### Accessibility Support
- Full keyboard navigation (arrow keys, Enter, Escape)
- ARIA attributes for screen readers
- Focus management (returns focus after selection/closing)
- Proper roles and states for all interactive elements

### Searchable Functionality
- Real-time filtering as user types
- Clear search when dropdown closes
- Visual indication of search results

### UI/UX
- Highlighted states for keyboard navigation
- Visual feedback for hover, focus, and selection
- Smooth scrolling to bring highlighted items into view
- Close dropdown behavior on selection, Escape key, or outside click

## Usage Example

```tsx
import React, { useState } from 'react';
import { SearchableSelect } from './SearchableSelect';

const ExampleUsage = () => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'durian', label: 'Durian' },
    { value: 'elderberry', label: 'Elderberry' }
  ];

  return (
    <div style={{ width: 300 }}>
      <h2>Fruit Selector</h2>
      <SearchableSelect
        options={options}
        value={selectedValue}
        onChange={setSelectedValue}
        placeholder="Select a fruit"
      />
      <p>Selected fruit: {selectedValue || 'None'}</p>
    </div>
  );
};

export default ExampleUsage;
```

This component meets all the requirements including full keyboard navigation, accessibility support, search functionality, and proper dropdown behavior.

### Tokens: {'input_tokens': 342, 'output_tokens': 6336}
### Execution time: 74.32154417037964
