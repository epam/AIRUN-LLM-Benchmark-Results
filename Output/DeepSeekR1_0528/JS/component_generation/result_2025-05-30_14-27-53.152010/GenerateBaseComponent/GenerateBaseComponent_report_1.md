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
We are going to create a SearchableSelect component that meets the requirements.
 Steps:
 1. We'll use React 18 with TypeScript.
 2. We'll create a component that has an input for searching and a dropdown list.
 3. We'll manage state for:
    - isOpen (boolean for dropdown visibility)
    - inputValue (the current search string)
    - selectedOption (the currently selected option, if any)
    - filteredOptions (the list of options to show based on inputValue)
 4. We'll use a ref for the component to handle clicks outside.
 5. We'll implement keyboard navigation (arrow keys, enter, escape) and accessibility attributes (aria-*).
 6. We'll use useEffect for closing the dropdown when clicking outside and for setting up event listeners.

 Let's break down the component:

 Props:
   - options: Array of objects with at least a value and a label.
   - value: The currently selected value (for controlled component).
   - onChange: Function to call when a new option is selected.

 We'll make the component controlled.

 Implementation:

 We'll have:
   - A container div that holds the input and the dropdown.
   - The input for search and to trigger the dropdown.
   - A list (ul) for the dropdown options.

 Accessibility:
   - The input will have role="combobox" and aria-autocomplete="list".
   - The dropdown list will have role="listbox".
   - Each option will have role="option".

 Keyboard events:
   - Down arrow: move to next option (if dropdown is open, else open it)
   - Up arrow: move to previous option
   - Enter: select the highlighted option and close the dropdown (or open the dropdown if closed and focused on input)
   - Escape: close the dropdown without selecting and return focus to input.

 We'll track the currently highlighted index (for keyboard navigation) and update it on arrow keys.

 We'll also handle:
   - Clicking on an option: select and close.
   - Clicking outside: close the dropdown.

 We'll use a ref for the container to detect outside clicks.

 We'll also use a ref for the input to return focus when the dropdown closes.

 We'll write the component in a way that it can be reused.

 Let's create the files:

 1. SearchableSelect.tsx: the main component.
 2. index.css: for styling.

 We'll use functional component with hooks.

 Note: We are not using any external libraries for the dropdown, we'll build from scratch.

 Let's code accordingly.

### Answer:
I'll create a reusable, accessible searchable select component in React 18 with TypeScript. Here's the implementation:

**File Structure:**
```
src/
  components/
    SearchableSelect/
      SearchableSelect.tsx
      index.css
      index.ts
```

**1. SearchableSelect.tsx:**
```tsx
import React, { 
  useState, 
  useEffect, 
  useRef, 
  KeyboardEvent, 
  FocusEvent 
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
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  noOptionsMessage = 'No options found'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset search term and focus when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setFocusedIndex(null);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key === 'Enter') {
      setIsOpen(true);
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = focusedIndex === null 
        ? 0 
        : Math.min(focusedIndex + 1, filteredOptions.length - 1);
      setFocusedIndex(nextIndex);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = focusedIndex === null 
        ? filteredOptions.length - 1 
        : Math.max(focusedIndex - 1, 0);
      setFocusedIndex(prevIndex);
    }

    if (e.key === 'Enter' && isOpen && focusedIndex !== null) {
      e.preventDefault();
      handleSelect(filteredOptions[focusedIndex].value);
    }
  };

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    // Don't close if blur was caused by clicking on an option
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div 
      className="searchable-select" 
      ref={containerRef}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-owns="searchable-select-options"
    >
      <input
        ref={inputRef}
        type="text"
        className="searchable-select__input"
        value={isOpen ? searchTerm : selectedOption?.label || ''}
        placeholder={placeholder}
        onFocus={handleInputFocus}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        aria-autocomplete="list"
        aria-controls="searchable-select-options"
      />
      
      {isOpen && (
        <ul 
          id="searchable-select-options"
          className="searchable-select__options"
          role="listbox"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                className={`searchable-select__option ${
                  value === option.value ? 'selected' : ''
                } ${index === focusedIndex ? 'focused' : ''}`}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="searchable-select__no-options">{noOptionsMessage}</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
```

**2. index.css:**
```css
.searchable-select {
  position: relative;
  width: 100%;
  max-width: 300px;
  font-family: Arial, sans-serif;
}

.searchable-select__input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.searchable-select__input:focus {
  outline: 2px solid #0066ff;
  outline-offset: -1px;
}

.searchable-select__options {
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  margin: 4px 0 0;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  list-style: none;
  z-index: 1000;
}

.searchable-select__option {
  padding: 8px 12px;
  cursor: pointer;
}

.searchable-select__option:hover,
.searchable-select__option.focused {
  background-color: #f0f0f0;
}

.searchable-select__option.selected {
  background-color: #e0e0e0;
  font-weight: bold;
}

.searchable-select__no-options {
  padding: 8px 12px;
  color: #666;
  font-style: italic;
}
```

**3. index.ts:**
```tsx
export { default } from './SearchableSelect';
export type { SelectOption } from './SearchableSelect';
```

**Key Features and Implementation Details:**

1. **TypeScript Typing:**
   - Strongly typed props using `SelectOption` interface
   - Controlled component pattern with `value` and `onChange`
   - Generic placeholder and no-options messages

2. **Accessibility Features:**
   - Proper ARIA roles (`combobox`, `listbox`, `option`)
   - Keyboard navigation (Arrow keys, Enter, Escape)
   - Focus management with `useRef`
   - Screen reader support through ARIA attributes
   - Focus returns to input after closing

3. **Dropdown Behavior:**
   - Closes on selection (mouse/keyboard)
   - Closes on Escape key
   - Closes on outside clicks
   - Closes on blur (with exception for option clicks)
   - Opens on Enter key when focused

4. **Search Functionality:**
   - Case-insensitive filtering
   - Real-time search as user types
   - Maintains selection state while searching

5. **Component Design:**
   - Controlled component pattern
   - Reusable across different contexts
   - Customizable messages via props
   - Clean CSS with BEM-like naming
   - No external dependencies

**Usage Example:**
```tsx
import SearchableSelect, { SelectOption } from './components/SearchableSelect';

const options: SelectOption[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

function App() {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  return (
    <SearchableSelect
      options={options}
      value={selectedValue}
      onChange={setSelectedValue}
      placeholder="Select an option"
    />
  );
}
```

This implementation meets all requirements with:
- Full keyboard navigation support
- Screen reader accessibility
- Controlled component pattern
- Type-safe implementation
- Customizable styling
- Reusable component design
- No external dependencies
- Production-ready code quality

### Tokens: {'input_tokens': 286, 'output_tokens': 2515}
### Execution time: 23.732321977615356
