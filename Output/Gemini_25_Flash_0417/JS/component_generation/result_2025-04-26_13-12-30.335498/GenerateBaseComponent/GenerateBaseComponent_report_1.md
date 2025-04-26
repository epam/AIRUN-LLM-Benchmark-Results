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
Okay, let's create a `SearchableSelect` component in React with TypeScript, focusing on accessibility and the specified functionality.

We'll create three files:
1.  `SearchableSelect.tsx`: The main component code.
2.  `index.css`: Basic styling.
3.  `types.ts`: For shared TypeScript types.

---

**1. `types.ts`**

```typescript
// src/types.ts

export interface Option {
  value: string | number;
  label: string;
}
```

---

**2. `index.css`**

```css
/* src/index.css */

/* Basic reset for demonstration */
body {
  font-family: sans-serif;
  margin: 20px;
  background-color: #f4f4f4;
}

/* Component Container */
.searchable-select-container {
  position: relative;
  width: 250px; /* Adjust as needed */
  display: inline-block;
  font-size: 1rem;
}

/* Trigger Button/Display */
.searchable-select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  outline: none;
  min-height: 40px; /* Ensure consistent height */
  box-sizing: border-box;
}

.searchable-select-trigger:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.searchable-select-trigger.placeholder {
  color: #888;
}

.searchable-select-trigger .arrow {
  margin-left: 10px;
  border: solid #333;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  transition: transform 0.3s ease;
}

.searchable-select-trigger[aria-expanded="true"] .arrow {
  transform: rotate(-135deg);
  margin-top: 5px; /* Adjust slightly for rotation */
}


/* Dropdown List */
.searchable-select-dropdown {
  position: absolute;
  top: 100%; /* Position below the trigger */
  left: 0;
  right: 0;
  z-index: 1000; /* Ensure it's above other content */
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-height: 200px; /* Limit height and enable scrolling */
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Search Input */
.searchable-select-dropdown input[type="text"] {
  width: calc(100% - 20px); /* Adjust for padding */
  padding: 10px;
  border: none;
  border-bottom: 1px solid #eee;
  outline: none;
  box-sizing: border-box;
  font-size: 1rem;
}

.searchable-select-dropdown input[type="text"]:focus {
    border-color: #007bff;
}


/* Option Item */
.searchable-select-option {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  outline: none; /* Remove default outline */
}

.searchable-select-option:hover {
  background-color: #f0f0f0;
}

/* Highlighted Option (for keyboard navigation) */
.searchable-select-option.highlighted {
  background-color: #e9e9e9;
}

/* Selected Option */
.searchable-select-option[aria-selected="true"] {
  background-color: #007bff;
  color: #fff;
}

/* No Results/Options Message */
.searchable-select-message {
  padding: 10px 15px;
  color: #888;
  text-align: center;
}
```

---

**3. `SearchableSelect.tsx`**

```typescript
// src/SearchableSelect.tsx

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Option } from './types'; // Assuming types.ts is in the same directory
import './index.css'; // Assuming index.css is in the same directory

interface SearchableSelectProps {
  options: Option[];
  value: Option['value'] | null;
  onSelect: (value: Option['value']) => void;
  placeholder?: string;
  label?: string; // Optional label for accessibility
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLUListElement>(null);
  // Use a Map to store refs for each option dynamically
  const optionRefs = useRef(new Map<string | number, HTMLLIElement>());

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) {
      return options;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return options.filter(option =>
      option.label.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [options, searchTerm]);

  // Find the selected option object
  const selectedOption = useMemo(() => {
    return options.find(option => option.value === value);
  }, [options, value]);

  // --- Accessibility & Keyboard Navigation ---

  // Generate a unique ID for the listbox
  const listboxId = useMemo(() => `searchable-select-listbox-${Math.random().toString(36).substr(2, 9)}`, []);

  // Generate IDs for options
  const getOptionId = useCallback((optionValue: Option['value']) => {
    return `${listboxId}-option-${optionValue}`;
  }, [listboxId]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const { key } = event;

    if (key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
      setHighlightedIndex(-1);
      triggerRef.current?.focus(); // Return focus to trigger
      event.preventDefault(); // Prevent default escape behavior
      return;
    }

    if (!isOpen) {
      // If closed, only Enter opens it
      if (key === 'Enter' || key === ' ') {
        setIsOpen(true);
        event.preventDefault(); // Prevent form submission if inside a form
      }
      return; // Ignore other keys when closed
    }

    // If open, handle navigation keys
    switch (key) {
      case 'ArrowDown':
        event.preventDefault(); // Prevent scrolling the page
        setHighlightedIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % filteredOptions.length;
          return nextIndex;
        });
        break;
      case 'ArrowUp':
        event.preventDefault(); // Prevent scrolling the page
        setHighlightedIndex(prevIndex => {
          const nextIndex = (prevIndex - 1 + filteredOptions.length) % filteredOptions.length;
          return nextIndex;
        });
        break;
      case 'Enter':
        event.preventDefault(); // Prevent form submission
        if (highlightedIndex !== -1 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case ' ': // Space key also selects
         event.preventDefault();
         if (highlightedIndex !== -1 && filteredOptions[highlightedIndex]) {
            handleOptionSelect(filteredOptions[highlightedIndex]);
         }
         break;
      default:
        // If a printable character is typed, focus the search input
        if (key.length === 1 && key.match(/[a-z0-9]/i)) {
             searchInputRef.current?.focus();
        }
        break;
    }
  }, [isOpen, filteredOptions, highlightedIndex]); // Added filteredOptions to dependencies

  // Handle option selection
  const handleOptionSelect = useCallback((option: Option) => {
    onSelect(option.value);
    setIsOpen(false);
    setSearchTerm(''); // Clear search on select
    setHighlightedIndex(-1); // Reset highlight
    triggerRef.current?.focus(); // Return focus to trigger
  }, [onSelect]);

  // --- Effects ---

  // Effect to handle outside clicks
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(''); // Clear search on close
        setHighlightedIndex(-1); // Reset highlight
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Effect to focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      // Use a small timeout to ensure the input is rendered before focusing
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Effect to reset highlighted index when search term changes
  useEffect(() => {
    setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
  }, [searchTerm, filteredOptions.length]); // Depend on searchTerm and filteredOptions length

  // Effect to scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex !== -1 && filteredOptions[highlightedIndex]) {
      const highlightedOption = filteredOptions[highlightedIndex];
      const optionElement = optionRefs.current.get(highlightedOption.value);
      if (optionElement) {
        optionElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, filteredOptions]); // Depend on highlightedIndex and filteredOptions

  // --- Render ---

  const triggerLabel = selectedOption ? selectedOption.label : placeholder;
  const isPlaceholder = !selectedOption;

  // Determine aria-activedescendant
  const activeDescendantId = (isOpen && highlightedIndex !== -1 && filteredOptions[highlightedIndex])
    ? getOptionId(filteredOptions[highlightedIndex].value)
    : undefined;

  return (
    <div
      className="searchable-select-container"
      ref={rootRef}
      onKeyDown={handleKeyDown} // Handle keyboard events on the container
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-label={label || placeholder} // Use label or placeholder for accessibility
      aria-activedescendant={activeDescendantId} // Set active descendant
    >
      {/* Trigger Button/Display */}
      <div
        ref={triggerRef}
        className={`searchable-select-trigger ${isPlaceholder ? 'placeholder' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0} // Make it focusable
        role="button" // Explicitly define role as button
        aria-labelledby={label ? undefined : undefined} // If label prop is used, aria-label on container is sufficient
        aria-describedby={selectedOption ? getOptionId(selectedOption.value) : undefined} // Optional: point to selected option ID
      >
        <span>{triggerLabel}</span>
        <span className="arrow"></span>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <ul
          id={listboxId}
          ref={optionsListRef}
          className="searchable-select-dropdown"
          role="listbox"
          // aria-labelledby={label ? undefined : undefined} // If label prop is used, aria-label on container is sufficient
        >
          {/* Search Input */}
          <li>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent click from closing dropdown
              role="searchbox"
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-label="Search options" // Label for the search input
            />
          </li>

          {/* Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const isSelected = value === option.value;
              const isHighlighted = highlightedIndex === index;
              const optionId = getOptionId(option.value);

              return (
                <li
                  key={option.value} // Use value as key
                  id={optionId}
                  ref={el => {
                    if (el) {
                      optionRefs.current.set(option.value, el);
                    } else {
                      optionRefs.current.delete(option.value);
                    }
                  }}
                  className={`searchable-select-option ${isHighlighted ? 'highlighted' : ''}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.label}
                </li>
              );
            })
          ) : (
            <li className="searchable-select-message">
              {searchTerm ? 'No results found' : 'No options available'}
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

**How to Use:**

1.  Save the files as `src/types.ts`, `src/index.css`, and `src/SearchableSelect.tsx` (or adjust paths as needed).
2.  Import and use the component in your application:

```typescript
// Example usage in App.tsx or another component

import React, { useState } from 'react';
import SearchableSelect from './SearchableSelect'; // Adjust path
import { Option } from './types'; // Adjust path
import './index.css'; // Import the CSS

const options: Option[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'grape', label: 'Grape' },
  { value: 'lemon', label: 'Lemon' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'watermelon', label: 'Watermelon' },
];

function App() {
  const [selectedFruit, setSelectedFruit] = useState<Option['value'] | null>(null);

  return (
    <div>
      <h1>Searchable Select Example</h1>
      <SearchableSelect
        options={options}
        value={selectedFruit}
        onSelect={setSelectedFruit}
        placeholder="Select a fruit"
        label="Fruit Selector" // Optional label for accessibility
      />

      {selectedFruit && (
        <p style={{ marginTop: '20px' }}>
          Selected fruit: <strong>{options.find(opt => opt.value === selectedFruit)?.label}</strong>
        </p>
      )}

       <p style={{ marginTop: '40px' }}>
         Tab to the select, press Enter to open, use Arrow keys to navigate, Enter or Space to select, Escape to close.
       </p>
    </div>
  );
}

export default App;
```

---

**Explanation:**

1.  **`types.ts`**: Defines the simple `Option` interface.
2.  **`index.css`**: Provides basic styling for the component elements. Includes styles for hover, highlighted, and selected states, as well as the dropdown positioning and scrollbar.
3.  **`SearchableSelect.tsx`**:
    *   **State**: Manages `isOpen`, `searchTerm`, and `highlightedIndex`. `value` is controlled via props.
    *   **Refs**: `rootRef` for outside click detection, `triggerRef` for focus management, `searchInputRef` for focusing the search input, `optionsListRef` (less critical but good practice), and `optionRefs` (a `Map`) to hold references to each rendered option `<li>` for scrolling.
    *   **`useMemo`**: `filteredOptions` is memoized to avoid re-calculating the filtered list on every render unless `options` or `searchTerm` changes. `selectedOption` is also memoized. `listboxId` is generated once. `getOptionId` is memoized.
    *   **`useEffect`**:
        *   Handles adding/removing the global `mousedown` listener for closing the dropdown on outside clicks.
        *   Focuses the search input when `isOpen` becomes true (with a small timeout to ensure the element exists).
        *   Resets `highlightedIndex` to 0 (or -1 if no results) when the search term or filtered options change.
        *   Scrolls the highlighted option into view when `highlightedIndex` changes.
    *   **`useCallback`**: Memoizes event handlers (`handleKeyDown`, `handleOptionSelect`, `getOptionId`) to maintain referential stability, which can be beneficial for performance, especially if these were passed down to child components (though not strictly necessary in this structure).
    *   **`handleKeyDown`**: Implements the core keyboard navigation logic (Arrow keys, Enter, Escape, Space). It prevents default browser behavior for these keys when the component is focused and open. It also handles opening the dropdown with Enter/Space when the trigger is focused and closed. If a character key is pressed while open, it attempts to focus the search input.
    *   **`handleOptionSelect`**: Handles both mouse clicks and Enter/Space key selections. It calls the `onSelect` prop, closes the dropdown, clears the search, resets the highlight, and returns focus to the trigger.
    *   **Accessibility (ARIA)**:
        *   The main container has `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` (pointing to the listbox ID), and `aria-label`.
        *   The trigger `div` has `role="button"` and `tabIndex={0}` to make it focusable and announceable as a button.
        *   The dropdown `ul` has `role="listbox"` and an `id`.
        *   The search input has `role="searchbox"`, `aria-autocomplete="list"`, `aria-controls`, and `aria-label`.
        *   Each option `li` has `role="option"`, a unique `id`, and `aria-selected`.
        *   The `aria-activedescendant` attribute on the container is updated to point to the `id` of the currently `highlighted` option, allowing screen readers to announce the highlighted item during keyboard navigation without moving the actual focus.
    *   **Rendering**: Conditionally renders the dropdown based on `isOpen`. Maps `filteredOptions` to `<li>` elements, applying classes for styling and ARIA attributes. Includes messages for no results or no options.

This implementation provides a robust, accessible, and reusable searchable select component following your requirements.

### Tokens: {'input_tokens': 293, 'output_tokens': 4811}
### Execution time: 36.55384707450867
