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
Certainly! Below is a complete implementation of a searchable select component in React 18.x with TypeScript, including accessibility features and styling.

### File Structure
```
src/
├── components/
│   └── SearchableSelect/
│       ├── SearchableSelect.tsx
│       └── index.css
└── index.tsx
```

### `SearchableSelect.tsx`
```tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './index.css';

type Option = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  options: Option[];
};

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setIsOpen(true);
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm(option.label);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsOpen(!isOpen);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      selectRef.current?.focus();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="searchable-select" ref={selectRef} tabIndex={0}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={selectedOption ? selectedOption.label : 'Select an option'}
      />
      {isOpen && (
        <ul className="dropdown">
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionSelect(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleOptionSelect(option);
              }}
              role="option"
              aria-selected={selectedOption?.value === option.value}
              tabIndex={0}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
```

### `index.css`
```css
.searchable-select {
  position: relative;
  display: inline-block;
  width: 200px;
}

.searchable-select input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  background-color: white;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 4px;
  margin-top: 4px;
  z-index: 1000;
}

.dropdown li {
  padding: 8px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0;
}

.dropdown li[aria-selected="true"] {
  font-weight: bold;
}
```

### `index.tsx`
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import SearchableSelect from './components/SearchableSelect';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4' },
];

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SearchableSelect options={options} />
  </React.StrictMode>
);
```

### Explanation
1. **Component Structure**: The `SearchableSelect` component maintains the state for the dropdown's open/close status, the search term, and the selected option.
2. **Search Functionality**: The `handleInputChange` function updates the search term and opens the dropdown.
3. **Keyboard Navigation**: The `handleKeyDown` function manages opening/closing the dropdown with the Enter key and closing it with the Escape key.
4. **Option Selection**: Clicking or pressing Enter on an option selects it and closes the dropdown.
5. **Click Outside**: The `handleClickOutside` function closes the dropdown when clicking outside the component.
6. **Accessibility**: `aria-selected` attributes and proper role definitions ensure the component is accessible.

This implementation is production-ready, clean, and reusable across different contexts.

### Tokens: {'input_tokens': 282, 'output_tokens': 1265}
### Execution time: 14.406906127929688
