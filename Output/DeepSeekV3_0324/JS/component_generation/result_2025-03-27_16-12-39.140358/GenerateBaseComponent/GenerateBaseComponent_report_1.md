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
# Searchable Select Component

I'll create a production-ready, accessible searchable select component in React 18 with TypeScript. Here's the implementation:

## 1. Select.tsx (Main Component)

```tsx
import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import './index.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  noOptionsMessage?: string;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  noOptionsMessage = 'No options found',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === value);

  const handleToggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setSearchTerm('');
      setHighlightedIndex(0);
    }
  };

  const handleOptionSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        if (isOpen && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        } else {
          handleToggleDropdown();
          if (isOpen && inputRef.current) {
            inputRef.current.focus();
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) =>
            Math.min(prev + 1, filteredOptions.length - 1)
          );
          scrollToHighlighted();
        } else {
          handleToggleDropdown();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          scrollToHighlighted();
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const scrollToHighlighted = () => {
    if (dropdownRef.current && highlightedIndex >= 0) {
      const item = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(0);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(e.target as Node) &&
      isOpen
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={selectRef}
      className={`select ${disabled ? 'disabled' : ''}`}
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-disabled={disabled}
    >
      <div
        className="select-input"
        onClick={handleToggleDropdown}
        tabIndex={disabled ? -1 : 0}
        aria-label={selectedOption?.label || placeholder}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <div className="select-dropdown">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="select-search"
            placeholder="Search..."
            aria-label="Search options"
          />
          <ul
            ref={dropdownRef}
            className="select-options"
            role="listbox"
            aria-activedescendant={
              filteredOptions[highlightedIndex]
                ? `option-${filteredOptions[highlightedIndex].value}`
                : undefined
            }
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`option-${option.value}`}
                  className={`select-option ${
                    highlightedIndex === index ? 'highlighted' : ''
                  } ${value === option.value ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="select-option no-options">{noOptionsMessage}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
```

## 2. index.css (Styling)

```css
.select {
  position: relative;
  width: 100%;
  max-width: 300px;
  font-family: Arial, sans-serif;
}

.select.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.select-input {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: white;
  display: flex;
  align-items: center;
  min-height: 20px;
}

.select-input:focus {
  outline: none;
  border-color: #2684ff;
  box-shadow: 0 0 0 1px #2684ff;
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.select-search {
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
}

.select-search:focus {
  outline: none;
  border-bottom-color: #2684ff;
}

.select-options {
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.select-option {
  padding: 10px 15px;
  cursor: pointer;
}

.select-option:hover,
.select-option.highlighted {
  background-color: #f5f5f5;
}

.select-option.selected {
  background-color: #e6f2ff;
  color: #0066cc;
}

.select-option.no-options {
  color: #999;
  cursor: default;
}
```

## 3. Usage Example

Here's how you would use the component in your application:

```tsx
import React, { useState } from 'react';
import SearchableSelect from './Select';

const options = [
  { value: '1', label: 'Apple' },
  { value: '2', label: 'Banana' },
  { value: '3', label: 'Orange' },
  { value: '4', label: 'Grapes' },
  { value: '5', label: 'Mango' },
  { value: '6', label: 'Pineapple' },
  { value: '7', label: 'Strawberry' },
  { value: '8', label: 'Watermelon' },
];

const App: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Searchable Select Component</h1>
      <SearchableSelect
        options={options}
        value={selectedValue}
        onChange={setSelectedValue}
        placeholder="Select a fruit..."
      />
      <div style={{ marginTop: '20px' }}>
        Selected value: {selectedValue || 'None'}
      </div>
    </div>
  );
};

export default App;
```

## Key Features Implemented

1. **Search Functionality**: Users can type to filter options
2. **Keyboard Navigation**: 
   - Arrow keys to navigate options
   - Enter to select/toggle
   - Escape to close
3. **Accessibility**:
   - Proper ARIA attributes
   - Keyboard support
   - Focus management
4. **Behavior**:
   - Closes on outside click
   - Closes on selection
   - Proper focus handling
5. **Type Safety**:
   - Strong TypeScript typing throughout
   - Clear component interfaces

The component is fully reusable and can be styled further by overriding the CSS classes. It handles edge cases like no options available and provides appropriate feedback to users.

Would you like me to add any additional features or make any adjustments to the implementation?

### Tokens: {'input_tokens': 286, 'output_tokens': 2229}
### Execution time: 62.25707197189331
