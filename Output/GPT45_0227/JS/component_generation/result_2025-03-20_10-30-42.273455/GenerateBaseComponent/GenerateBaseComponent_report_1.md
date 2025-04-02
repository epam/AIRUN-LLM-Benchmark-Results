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
Here's a complete, production-ready implementation of a searchable select component in React 18.x with TypeScript, accessibility support, and keyboard navigation.

### Project Structure:
```
src/
├── components/
│   └── SearchableSelect/
│       ├── SearchableSelect.tsx
│       └── index.css
```

---

### SearchableSelect.tsx
```tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './index.css';

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (selected: Option) => void;
  selected?: Option;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  selected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
    setSearchTerm('');
    setHighlightedIndex(-1);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
    containerRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (option: Option) => {
      onChange(option);
      closeDropdown();
    },
    [onChange, closeDropdown]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        } else if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeDropdown();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % filteredOptions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => (prev <= 0 ? filteredOptions.length - 1 : prev - 1));
      }
    },
    [isOpen, highlightedIndex, filteredOptions, handleSelect, closeDropdown]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    },
    [closeDropdown]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClickOutside]);

  return (
    <div
      className="searchable-select"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      role="combobox"
    >
      <div className="selected-value" onClick={toggleDropdown}>
        {selected ? selected.label : placeholder}
      </div>

      {isOpen && (
        <div className="dropdown">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search..."
            aria-label="Search options"
          />
          <ul className="options-list" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  className={`option-item ${
                    highlightedIndex === index ? 'highlighted' : ''
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={selected?.value === option.value}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="no-options">No options found</li>
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

### index.css
```css
.searchable-select {
  position: relative;
  width: 250px;
  font-family: Arial, sans-serif;
  outline: none;
}

.selected-value {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  outline: none;
}

.options-list {
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.option-item {
  padding: 8px 12px;
  cursor: pointer;
}

.option-item.highlighted,
.option-item:hover {
  background-color: #f0f0f0;
}

.no-options {
  padding: 8px 12px;
  color: #888;
}
```

---

### Usage Example:
```tsx
import React, { useState } from 'react';
import SearchableSelect from './components/SearchableSelect/SearchableSelect';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
];

const App: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(undefined);

  return (
    <div>
      <h1>Searchable Select Example</h1>
      <SearchableSelect
        options={options}
        selected={selectedOption}
        onChange={setSelectedOption}
        placeholder="Choose a fruit"
      />
    </div>
  );
};

export default App;
```

---

### Accessibility & Keyboard Navigation:
- **Enter**: Opens/closes dropdown, selects highlighted option.
- **Arrow Up/Down**: Navigates through options.
- **Escape**: Closes dropdown and returns focus to select component.
- **Click outside**: Closes dropdown.

This implementation meets all your specified requirements, ensuring accessibility, keyboard navigation, clean TypeScript typing, and reusability.

### Tokens: {'input_tokens': 290, 'output_tokens': 1654, 'reasoning_tokens': 0}
### Execution time: 230.4001579284668
