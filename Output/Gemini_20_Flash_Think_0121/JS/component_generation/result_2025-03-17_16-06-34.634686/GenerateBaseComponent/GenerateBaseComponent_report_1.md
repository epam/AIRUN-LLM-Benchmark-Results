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
```tsx
// SearchableSelect.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactElement,
} from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onSelect: (option: Option | null) => void;
  initialValue?: Option | null;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = 'Select an option',
  onSelect,
  initialValue = null,
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState<Option | null>(initialValue);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onSelect(selectedOption);
  }, [selectedOption, onSelect]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDropdown = useCallback(() => {
    setIsOpen(true);
    setHighlightedIndex(-1); // Reset highlight on open
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0); // Focus after render
  }, []);

  const handleCloseDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm(''); // Clear search term on close
    setHighlightedIndex(-1);
    selectButtonRef.current?.focus(); // Return focus to button
  }, []);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      handleCloseDropdown();
    } else {
      handleOpenDropdown();
    }
  }, [isOpen, handleOpenDropdown, handleCloseDropdown]);

  const handleOptionSelect = useCallback(
    (option: Option) => {
      setSelectedOption(option);
      handleCloseDropdown();
    },
    [handleCloseDropdown]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        toggleDropdown();
      }
    },
    [toggleDropdown]
  );

  const handleDropdownKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        handleCloseDropdown();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex((prevIndex) =>
          Math.min(prevIndex + 1, filteredOptions.length - 1)
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, -1));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
      }
    },
    [isOpen, filteredOptions, highlightedIndex, handleOptionSelect, handleCloseDropdown]
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && selectButtonRef.current && !selectButtonRef.current.contains(event.target as Node)) {
        handleCloseDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleCloseDropdown]);

  return (
    <div className="searchable-select" ref={dropdownRef}>
      <button
        ref={selectButtonRef}
        className="select-button"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="options-list"
        type="button" // Prevent button from submitting forms
      >
        {selectedOption ? selectedOption.label : placeholder}
      </button>

      {isOpen && (
        <div
          className="dropdown"
          role="listbox"
          id="options-list"
          onKeyDown={handleDropdownKeyDown}
        >
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search options"
          />
          <ul className="options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  className={`option ${index === highlightedIndex ? 'highlighted' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                  aria-selected={index === highlightedIndex}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="option no-options">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
```

```css
/* index.css */
.searchable-select {
  position: relative;
  display: inline-block;
}

.select-button {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  width: 200px; /* Adjust as needed */
  text-align: left;
}

.select-button:focus {
  outline: 2px solid #007bff; /* Example focus style */
  outline-offset: 2px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  width: 200px; /* Match button width */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 100%;
  padding: 8px;
  border: none;
  border-bottom: 1px solid #eee;
  outline: none;
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px; /* Adjust as needed */
  overflow-y: auto;
}

.option {
  padding: 8px 15px;
  cursor: pointer;
}

.option:hover, .option.highlighted {
  background-color: #f0f0f0;
}

.option.highlighted {
  background-color: #e0e0e0;
}

.option.no-options {
  color: #777;
  text-align: center;
}
```

**Explanation:**

**SearchableSelect.tsx:**

- **Component Structure:**
    - `useState` is used for managing:
        - `isOpen`: Dropdown visibility.
        - `searchTerm`: Search input value.
        - `highlightedIndex`: Index of the highlighted option for keyboard navigation.
        - `selectedOption`: Currently selected option.
    - `useRef` is used for:
        - `selectButtonRef`:  Referencing the button to focus back after closing.
        - `searchInputRef`: Referencing the search input to focus when opening.
        - `dropdownRef`: Referencing the dropdown container to handle outside clicks.

- **Functionality:**
    - **Filtering:** `filteredOptions` is derived using `options.filter` based on `searchTerm`.
    - **Dropdown Toggle:** `toggleDropdown`, `handleOpenDropdown`, `handleCloseDropdown` manage the dropdown's visibility and focus.
    - **Option Selection:** `handleOptionSelect` updates `selectedOption` and closes the dropdown.
    - **Keyboard Navigation:**
        - `handleKeyDown` on the button toggles the dropdown on Enter.
        - `handleDropdownKeyDown` on the dropdown handles:
            - `Escape`: Closes the dropdown.
            - `ArrowDown/ArrowUp`: Navigates through options and updates `highlightedIndex`.
            - `Enter`: Selects the highlighted option.
    - **Click Outside Handling:** `useEffect` with `handleClickOutside` closes the dropdown when clicking outside the component.
    - **Accessibility Attributes:**
        - Button: `aria-haspopup`, `aria-expanded`, `aria-controls`.
        - Dropdown: `role="listbox"`, `id="options-list"`.
        - Options: `role="option"`, `aria-selected`.

- **Typescript:**
    - `Option` interface defines the structure of options.
    - `SearchableSelectProps` interface defines the component's props with proper types.

**index.css:**

- Basic styling for the component elements to make it visually functional. You can customize this further to match your design requirements.

**How to use:**

```tsx
import SearchableSelect from './SearchableSelect';
import React, { useState } from 'react';

const App: React.FC = () => {
  const optionList = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
  ];
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);

  const handleSelect = (option: Option | null) => {
    setSelectedValue(option);
    console.log('Selected Option:', option);
  };

  return (
    <div>
      <h1>Searchable Select Example</h1>
      <SearchableSelect
        options={optionList}
        placeholder="Choose an option"
        onSelect={handleSelect}
        initialValue={selectedValue}
      />
      {selectedValue && <p>You selected: {selectedValue.label}</p>}
    </div>
  );
};

export default App;
```

This implementation fulfills all the requirements: React 18, TypeScript, searchable select, accessibility (keyboard navigation, ARIA attributes), dropdown behavior, and clean code. You can further enhance the styling and features as needed.

### Tokens: {'input_tokens': 291, 'output_tokens': 2606}
### Execution time: 15.280658960342407
