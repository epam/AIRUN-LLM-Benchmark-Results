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
This solution provides a robust and accessible searchable select component for React 18.x using TypeScript. It adheres to all specified requirements, including core functionality, comprehensive accessibility, and proper dropdown behavior.

The component is structured to be reusable and maintainable, with clear separation of concerns and adherence to modern React practices.

---

### Project Structure

```
src/
├── App.tsx
├── App.css (optional, for general app styling)
└── components/
    └── SearchableSelect/
        ├── SearchableSelect.tsx
        ├── index.css
        └── types.ts
```

---

### 1. `src/components/SearchableSelect/types.ts`

This file defines the TypeScript interfaces for the component's options and props.

```typescript
// src/components/SearchableSelect/types.ts

/**
 * Represents a single option in the searchable select component.
 */
export interface Option {
  label: string; // The display text for the option
  value: string | number; // The unique value associated with the option
}

/**
 * Props for the SearchableSelect component.
 */
export interface SearchableSelectProps {
  /**
   * An array of available options to display in the dropdown.
   */
  options: Option[];
  /**
   * The currently selected option. `null` if no option is selected.
   */
  value: Option | null;
  /**
   * Callback function triggered when an option is selected.
   * @param selectedOption The newly selected option, or `null` if cleared.
   */
  onChange: (selectedOption: Option | null) => void;
  /**
   * Optional placeholder text for the input field when no option is selected.
   * Defaults to 'Select an option'.
   */
  placeholder?: string;
}
```

---

### 2. `src/components/SearchableSelect/SearchableSelect.tsx`

This is the main component file, implementing all the logic and rendering.

```typescript
// src/components/SearchableSelect/SearchableSelect.tsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Option, SearchableSelectProps } from './types';
import './index.css'; // Import component-specific styling

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // activeOption tracks the option currently highlighted by keyboard navigation
  const [activeOption, setActiveOption] = useState<Option | null>(null);

  // Refs for DOM elements to manage focus and click-outside detection
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Memoized list of options filtered by the search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) {
      return options;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return options.filter(option =>
      option.label.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [options, searchTerm]);

  // Effect to manage the active option when the dropdown opens or filtered options change
  useEffect(() => {
    if (isOpen) {
      // If there's a selected value and it's in the filtered list, make it active.
      // Otherwise, make the first filtered option active.
      const initialActive = value && filteredOptions.some(opt => opt.value === value.value)
        ? value
        : filteredOptions[0] || null;
      setActiveOption(initialActive);
    } else {
      setActiveOption(null); // Clear active option when dropdown is closed
    }
  }, [isOpen, value, filteredOptions]);

  // Effect to scroll the active option into view when it changes
  useEffect(() => {
    if (isOpen && activeOption && listboxRef.current) {
      const activeElement = listboxRef.current.querySelector<HTMLLIElement>(
        `#option-${activeOption.value}`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }, [activeOption, isOpen]);

  // Handles selecting an option (either by click or Enter key)
  const selectOption = useCallback((option: Option | null) => {
    onChange(option); // Notify parent component of the selection
    setSearchTerm(option ? option.label : ''); // Update input to show selected label
    setIsOpen(false); // Close the dropdown
    inputRef.current?.focus(); // Return focus to the input field
  }, [onChange]);

  // Handles changes in the input field (for searching)
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true); // Open dropdown if typing
    setActiveOption(null); // Reset active option when typing to allow new search results to be highlighted
  }, []);

  // Handles focus on the input field
  const handleInputFocus = useCallback(() => {
    setIsOpen(true); // Open dropdown when input is focused
    // When input is focused, if there's a selected value, show its label for editing/searching.
    // Otherwise, the search term will be empty, allowing new input.
    setSearchTerm(value ? value.label : '');
  }, [value]);

  // Handles keyboard navigation and actions (Enter, Escape, Arrow keys, Tab)
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault(); // Prevent default form submission or other browser behavior
        if (isOpen) {
          if (activeOption) {
            selectOption(activeOption); // Select the highlighted option
          } else if (filteredOptions.length > 0) {
            // If no active option but options are filtered, select the first one
            selectOption(filteredOptions[0]);
          } else {
            // If no options to select, just close the dropdown
            setIsOpen(false);
            inputRef.current?.focus();
          }
        } else {
          // If dropdown is closed, open it
          setIsOpen(true);
          // When opening with Enter, set search term to selected value's label for immediate editing
          setSearchTerm(value ? value.label : '');
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false); // Close the dropdown
        setSearchTerm(value ? value.label : ''); // Reset search term to selected value's label
        inputRef.current?.focus(); // Return focus to the input
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true); // Open dropdown if closed
          setSearchTerm(value ? value.label : ''); // Show selected label when opening with arrow
          return;
        }
        if (filteredOptions.length > 0) {
          const currentIndex = activeOption
            ? filteredOptions.findIndex(opt => opt.value === activeOption.value)
            : -1; // If no active, start before the first
          const nextIndex = (currentIndex + 1) % filteredOptions.length;
          setActiveOption(filteredOptions[nextIndex]);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true); // Open dropdown if closed
          setSearchTerm(value ? value.label : ''); // Show selected label when opening with arrow
          return;
        }
        if (filteredOptions.length > 0) {
          const currentIndex = activeOption
            ? filteredOptions.findIndex(opt => opt.value === activeOption.value)
            : filteredOptions.length; // If no active, start after the last to wrap around
          const prevIndex = (currentIndex - 1 + filteredOptions.length) % filteredOptions.length;
          setActiveOption(filteredOptions[prevIndex]);
        }
        break;
      case 'Tab':
        // Allow default tab behavior but ensure dropdown closes
        setIsOpen(false);
        setSearchTerm(value ? value.label : ''); // Reset search term to selected value's label
        break;
      default:
        // If a single character key is pressed and dropdown is closed, open it and start searching
        if (!isOpen && e.key.length === 1 && e.key.match(/[a-zA-Z0-9 ]/)) {
          setIsOpen(true);
          setSearchTerm(e.key); // Start search with the pressed key
          inputRef.current?.focus();
        }
        break;
    }
  }, [isOpen, activeOption, filteredOptions, selectOption, value]);

  // Effect to handle clicks outside the component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(value ? value.label : ''); // Reset search term to selected value's label
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [value]); // Re-run if `value` changes to ensure `searchTerm` reset is correct

  // Determines the value displayed in the input field
  const displayInputValue = useMemo(() => {
    return isOpen ? searchTerm : (value ? value.label : '');
  }, [isOpen, searchTerm, value]);

  // Determines the placeholder for the input field
  const inputPlaceholder = useMemo(() => {
    return value && !isOpen ? value.label : placeholder;
  }, [value, isOpen, placeholder]);

  return (
    <div
      className="searchable-select-container"
      ref={containerRef}
      onKeyDown={handleKeyDown} // Attach keyboard handler to the container
      role="combobox" // ARIA role for a combobox widget
      aria-haspopup="listbox" // Indicates that a listbox popup is available
      aria-expanded={isOpen} // Indicates whether the popup is currently expanded
      aria-controls="select-listbox" // Links to the ID of the listbox element
      aria-activedescendant={activeOption ? `option-${activeOption.value}` : undefined} // Points to the ID of the currently active option
    >
      <div
        className="select-control"
        onClick={() => {
          setIsOpen(prev => !prev); // Toggle dropdown visibility
          // If opening, set search term to the current selected value's label
          if (!isOpen && value) {
            setSearchTerm(value.label);
          }
          inputRef.current?.focus(); // Focus the input field
        }}
      >
        <input
          type="text"
          className="select-input"
          value={displayInputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={inputPlaceholder}
          aria-label={value ? `Selected: ${value.label}` : placeholder} // Accessible label for screen readers
          aria-autocomplete="list" // Indicates that the input provides autocompletion suggestions
          aria-controls="select-listbox" // Links to the ID of the listbox element
          ref={inputRef}
          // When dropdown is closed and a value is selected, make input read-only
          // This prevents accidental typing but still allows focus and opening.
          readOnly={!isOpen && !!value}
        />
        <span className={`select-arrow ${isOpen ? 'open' : ''}`} aria-hidden="true"></span>
      </div>

      {isOpen && (
        <ul
          id="select-listbox" // Unique ID for ARIA linking
          role="listbox" // ARIA role for a listbox
          className="select-options"
          ref={listboxRef}
          tabIndex={-1} // Make listbox not directly tabbable, but accessible via aria-activedescendant
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                id={`option-${option.value}`} // Unique ID for aria-activedescendant
                role="option" // ARIA role for a listbox option
                aria-selected={option.value === value?.value} // Indicates if this option is currently selected
                className={`select-option ${option.value === activeOption?.value ? 'active' : ''}`}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setActiveOption(option)} // Highlight on hover
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="select-no-results" role="option" aria-disabled="true">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
```

---

### 3. `src/components/SearchableSelect/index.css`

This file provides the basic styling for the component.

```css
/* src/components/SearchableSelect/index.css */

.searchable-select-container {
  position: relative;
  width: 300px; /* Default width, can be overridden by parent */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  outline: none; /* Remove default outline, manage focus visually */
}

.select-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  background-color: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  min-height: 40px; /* Ensure consistent height */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

/* Visual focus indicator for the control when its children are focused */
.select-control:focus-within {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.select-input {
  flex-grow: 1; /* Allows input to take available space */
  border: none;
  outline: none;
  font-size: inherit; /* Inherit font size from parent */
  padding: 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer; /* Indicate it's clickable */
  color: #333; /* Default text color */
}

/* Style for when input is readOnly (displaying selected value) */
.select-input[readOnly] {
  cursor: pointer; /* Keep pointer cursor to indicate clickability */
}

.select-input::placeholder {
  color: #6c757d; /* Placeholder text color */
}

.select-arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #666; /* Down arrow */
  transition: transform 0.2s ease;
  margin-left: 10px;
  flex-shrink: 0; /* Prevent arrow from shrinking */
}

.select-arrow.open {
  transform: rotate(180deg); /* Up arrow when open */
}

.select-options {
  position: absolute;
  top: 100%; /* Position directly below the control */
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  border-top: none; /* No top border as it connects to the control */
  border-radius: 0 0 4px 4px; /* Rounded corners only at the bottom */
  background-color: #fff;
  list-style: none; /* Remove bullet points */
  padding: 0;
  margin: 0;
  max-height: 200px; /* Max height for scrollable list */
  overflow-y: auto; /* Enable vertical scrolling */
  z-index: 1000; /* Ensure it's above other content */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  box-sizing: border-box;
}

.select-option {
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #333;
}

.select-option:hover,
.select-option.active {
  background-color: #f0f0f0; /* Highlight on hover or keyboard active */
}

.select-option[aria-selected="true"] {
  background-color: #e9ecef; /* Slightly different background for selected item */
  font-weight: bold; /* Bold text for selected item */
  color: #007bff; /* Highlight selected text color */
}

.select-no-results {
  padding: 10px 12px;
  color: #6c757d; /* Muted color for no results message */
  text-align: center;
  cursor: default; /* No pointer cursor */
}
```

---

### 4. Example Usage (`src/App.tsx`)

This file demonstrates how to use the `SearchableSelect` component in a React application.

```typescript
// src/App.tsx
import React, { useState } from 'react';
import SearchableSelect from './components/SearchableSelect/SearchableSelect';
import { Option } from './components/SearchableSelect/types';
import './App.css'; // Optional: for general app styling

// Sample data for the select components
const fruitOptions: Option[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
  { label: 'Honeydew', value: 'honeydew' },
  { label: 'Kiwi', value: 'kiwi' },
  { label: 'Lemon', value: 'lemon' },
  { label: 'Mango', value: 'mango' },
  { label: 'Nectarine', value: 'nectarine' },
  { label: 'Orange', value: 'orange' },
  { label: 'Papaya', value: 'papaya' },
  { label: 'Quince', value: 'quince' },
  { label: 'Raspberry', value: 'raspberry' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Tangerine', value: 'tangerine' },
  { label: 'Ugli Fruit', value: 'ugli-fruit' },
  { label: 'Vanilla Bean', value: 'vanilla-bean' },
  { label: 'Watermelon', value: 'watermelon' },
  { label: 'Xigua', value: 'xigua' },
  { label: 'Yellow Passion Fruit', value: 'yellow-passion-fruit' },
  { label: 'Zucchini', value: 'zucchini' },
];

const vegetableOptions: Option[] = [
  { label: 'Carrot', value: 'carrot' },
  { label: 'Broccoli', value: 'broccoli' },
  { label: 'Spinach', value: 'spinach' },
  { label: 'Potato', value: 'potato' },
  { label: 'Tomato', value: 'tomato' },
  { label: 'Onion', value: 'onion' },
  { label: 'Bell Pepper', value: 'bell-pepper' },
  { label: 'Cucumber', value: 'cucumber' },
  { label: 'Eggplant', value: 'eggplant' },
  { label: 'Garlic', value: 'garlic' },
  { label: 'Kale', value: 'kale' },
  { label: 'Lettuce', value: 'lettuce' },
  { label: 'Mushroom', value: 'mushroom' },
  { label: 'Peas', value: 'peas' },
  { label: 'Pumpkin', value: 'pumpkin' },
  { label: 'Radish', value: 'radish' },
  { label: 'Sweet Potato', value: 'sweet-potato' },
];

function App() {
  const [selectedFruit, setSelectedFruit] = useState<Option | null>(null);
  const [selectedVegetable, setSelectedVegetable] = useState<Option | null>(null);

  return (
    <div className="App" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Searchable Select Component Examples</h1>

      <section>
        <h2>Select a Fruit:</h2>
        <SearchableSelect
          options={fruitOptions}
          value={selectedFruit}
          onChange={setSelectedFruit}
          placeholder="Search for a fruit..."
        />
        {selectedFruit && (
          <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
            Selected Fruit: <strong>{selectedFruit.label}</strong> (Value: {selectedFruit.value})
          </p>
        )}
      </section>

      <section>
        <h2>Select a Vegetable:</h2>
        <SearchableSelect
          options={vegetableOptions}
          value={selectedVegetable}
          onChange={setSelectedVegetable}
          placeholder="Search for a vegetable..."
        />
        {selectedVegetable && (
          <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
            Selected Vegetable: <strong>{selectedVegetable.label}</strong> (Value: {selectedVegetable.value})
          </p>
        )}
      </section>

      <div style={{ height: '300px', border: '1px dashed #ccc', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
        <p>This is a spacer to test click outside behavior and scrolling.</p>
      </div>
    </div>
  );
}

export default App;
```

---

### How to Run

1.  **Create a React project:**
    If you don't have one, create a new React project using Vite (recommended for React 18+):
    ```bash
    npm create vite@latest my-searchable-select -- --template react-ts
    cd my-searchable-select
    npm install
    ```
    Or using Create React App (older, but still works):
    ```bash
    npx create-react-app my-searchable-select --template typescript
    cd my-searchable-select
    npm start
    ```

2.  **Copy the files:**
    *   Create the `src/components/SearchableSelect` directory.
    *   Place `types.ts`, `SearchableSelect.tsx`, and `index.css` into this directory.
    *   Replace the content of `src/App.tsx` with the example usage provided above.

3.  **Start the development server:**
    ```bash
    npm run dev  # For Vite
    npm start    # For Create React App
    ```

4.  Open your browser to `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA) to see the component in action.

---

### Key Features and Accessibility Notes

*   **Search Functionality:** The input field allows users to type and filter the options dynamically.
*   **Single Selection:** Only one item can be selected at a time.
*   **Keyboard Navigation:**
    *   **Tab:** Focuses on the component. Pressing Tab again (when dropdown is closed) moves focus to the next element. When dropdown is open, Tab closes it and moves focus.
    *   **Enter:**
        *   When component is focused and dropdown is closed: Opens the dropdown.
        *   When dropdown is open and an option is highlighted: Selects the highlighted option and closes the dropdown.
        *   When dropdown is open and no option is highlighted (e.g., after typing a search term): Selects the first filtered option if available.
    *   **Escape:** Closes the dropdown and returns focus to the input.
    *   **ArrowUp/ArrowDown:** Navigates through the options in the dropdown. If the dropdown is closed, pressing an arrow key will open it.
    *   **Typing:** If the component is focused and a character key is pressed, the dropdown opens, and the typed character is used to start the search.
*   **Focus Management:** Focus is consistently returned to the input field after selection, closing the dropdown, or opening it.
*   **Click Outside:** Clicking anywhere outside the component closes the dropdown.
*   **ARIA Attributes:**
    *   `role="combobox"`: Identifies the component as a combobox.
    *   `aria-haspopup="listbox"`: Indicates that the combobox has a listbox popup.
    *   `aria-expanded`: Dynamically updates to `true` when the dropdown is open and `false` when closed.
    *   `aria-controls="select-listbox"`: Links the combobox input to the ID of the listbox element.
    *   `aria-activedescendant`: Crucial for screen readers, this attribute on the combobox points to the `id` of the currently highlighted (`active`) option in the list, allowing screen readers to announce it as the user navigates with arrow keys.
    *   `role="listbox"`: Identifies the dropdown `ul` as a listbox.
    *   `role="option"`: Identifies each `li` element as an option within the listbox.
    *   `id="option-{value}"`: Unique ID for each option, used by `aria-activedescendant`.
    *   `aria-selected`: Set to `true` for the currently selected option.
    *   `aria-label` and `aria-autocomplete="list"` on the input enhance its accessibility.
*   **Visual Cues:** Active (keyboard-highlighted) and selected options have distinct visual styles. The arrow icon rotates to indicate dropdown state.
*   **Read-Only Input:** When the dropdown is closed and a value is selected, the input becomes `readOnly`. This prevents accidental typing over the selected value but still allows the input to be focused and clicked to open the dropdown for searching. When the dropdown is open, it becomes editable for searching.

### Tokens: {'input_tokens': 293, 'output_tokens': 13495, 'reasoning_tokens': 6863}
### Execution time: 58.93568420410156
