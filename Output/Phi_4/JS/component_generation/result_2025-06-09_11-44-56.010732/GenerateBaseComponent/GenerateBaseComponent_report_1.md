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
To create a searchable select component with accessibility support in React 18.x using TypeScript, we'll follow the outlined requirements. Below is a complete implementation of the component, including the necessary CSS for styling.

### Project Structure

```
searchable-select/
│
├── src/
│   ├── components/
│   │   └── SearchableSelect.tsx
│   ├── index.css
│   └── App.tsx
│
└── package.json
```

### `index.css`

```css
/* index.css */
body {
  font-family: Arial, sans-serif;
}

.searchable-select {
  position: relative;
  width: 200px;
}

.searchable-select input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.searchable-select ul {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  background: white;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 1000;
}

.searchable-select li {
  padding: 8px;
  cursor: pointer;
}

.searchable-select li:hover,
.searchable-select li:focus {
  background-color: #f0f0f0;
}
```

### `SearchableSelect.tsx`

```tsx
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, FocusEvent } from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  onChange: (value: string) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setFilteredOptions(
      options.filter(option => option.label.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const handleSelectOption = (option: Option) => {
    setSelectedValue(option.value);
    setInputValue(option.label);
    setIsOpen(false);
    onChange(option.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (isOpen) {
        if (filteredOptions.length > 0) {
          handleSelectOption(filteredOptions[0]);
        }
      } else {
        setIsOpen(true);
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (filteredOptions.findIndex(option => option.label === inputValue) + 1) % filteredOptions.length;
      setInputValue(filteredOptions[nextIndex].label);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (filteredOptions.findIndex(option => option.label === inputValue) - 1 + filteredOptions.length) % filteredOptions.length;
      setInputValue(filteredOptions[prevIndex].label);
    }
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={selectRef} className="searchable-select">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        aria-expanded={isOpen}
        aria-controls="dropdown-list"
        aria-autocomplete="list"
        aria-activedescendant={isOpen && filteredOptions.length > 0 ? `option-${filteredOptions.findIndex(option => option.label === inputValue)}` : undefined}
      />
      {isOpen && (
        <ul id="dropdown-list">
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              id={`option-${index}`}
              role="option"
              aria-selected={option.label === inputValue}
              onClick={() => handleSelectOption(option)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSelectOption(option);
                }
              }}
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

### `App.tsx`

```tsx
import React from 'react';
import SearchableSelect from './components/SearchableSelect';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4' },
];

const App: React.FC = () => {
  const handleSelectChange = (value: string) => {
    console.log('Selected:', value);
  };

  return (
    <div>
      <h1>Searchable Select Component</h1>
      <SearchableSelect options={options} onChange={handleSelectChange} />
    </div>
  );
};

export default App;
```

### Explanation

- **Component Structure**: The `SearchableSelect` component is designed to be reusable and accessible. It uses a `ref` to detect clicks outside the component to close the dropdown.
- **Accessibility**: The component supports keyboard navigation, including arrow keys for navigation, Enter for selection, and Escape to close the dropdown. ARIA attributes are used to enhance accessibility.
- **Styling**: Basic CSS is provided to style the component, ensuring it is visually clear and functional.
- **Functionality**: The component filters options based on user input and allows selection via both mouse and keyboard.

This implementation should meet the requirements for a production-ready, accessible, and reusable searchable select component in React with TypeScript.

### Tokens: {'input_tokens': 287, 'output_tokens': 1397}
### Execution time: 16.873696088790894
