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
Okay, I will create a searchable select component with React 18.x and TypeScript, focusing on accessibility and the specified behaviors.

Here's the implementation:

**1. `SearchableSelect.tsx` (Component Code):**

```typescript
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useId,
  KeyboardEvent,
} from 'react';
import './index.css';

// Custom hook for detecting clicks outside an element
function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export interface OptionType {
  value: string | number;
  label: string;
}

export interface SearchableSelectProps {
  id?: string; // ID for the trigger button, for external <label htmlFor>
  options: OptionType[];
  value: OptionType['value'] | null;
  onChange: (value: OptionType['value'] | null) => void;
  placeholder?: string;
  label?: string; // Aria-label for the trigger button
  disabled?: boolean;
  notFoundContent?: React.ReactNode; // Content for when no options match search
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  disabled = false,
  notFoundContent = 'No options found',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);

  // Generate unique IDs for ARIA attributes
  const internalIdBase = useId();
  const triggerButtonId = id || `${internalIdBase}-trigger`;
  const listboxId = `${internalIdBase}-listbox`;
  const getOptionId = (index: number) => `${internalIdBase}-option-${index}`;

  // Refs for various elements
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Memoize the currently selected option object
  const currentSelectedOption = useMemo(() => {
    return options.find(opt => opt.value === value) || null;
  }, [options, value]);

  // Memoize filtered options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) {
      return options;
    }
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Effect to manage the size of optionRefs array based on filteredOptions
  useEffect(() => {
    optionRefs.current = new Array(filteredOptions.length).fill(null);
  }, [filteredOptions]);

  // Effect to manage focusedOptionIndex when dropdown opens/closes or options filter
  useEffect(() => {
    if (isOpen) {
      // When dropdown opens or filtered options change, set focus to the first item or none
      setFocusedOptionIndex(filteredOptions.length > 0 ? 0 : -1);
    } else {
      // Clear focus when dropdown is closed
      setFocusedOptionIndex(-1);
    }
  }, [isOpen, filteredOptions]);

  // Effect to focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Effect to scroll the focused option into view
  useEffect(() => {
    if (isOpen && focusedOptionIndex >= 0 && focusedOptionIndex < filteredOptions.length) {
      const optionElement = optionRefs.current[focusedOptionIndex];
      optionElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isOpen, focusedOptionIndex, filteredOptions]); // filteredOptions dependency ensures this runs if list changes

  // Callback to close the dropdown and reset states
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm(''); // Clear search term
    // focusedOptionIndex is reset by the useEffect [isOpen, filteredOptions]
    triggerRef.current?.focus(); // Return focus to the trigger button
  }, []);

  // Hook to close dropdown on click outside
  useOnClickOutside(containerRef, () => {
    if (isOpen) {
      closeDropdown();
    }
  });

  // Callback to handle option selection
  const handleOptionSelect = useCallback((option: OptionType) => {
    onChange(option.value);
    closeDropdown();
  }, [onChange, closeDropdown]);

  // Keyboard handling for the trigger button
  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ': // Space key
        e.preventDefault();
        setIsOpen(prevIsOpen => !prevIsOpen);
        // If opening, focusedOptionIndex will be set by useEffect [isOpen, filteredOptions]
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          // Dropdown opens, search input gets focus via useEffect [isOpen].
          // Then useEffect [isOpen, filteredOptions] sets focusedOptionIndex to 0.
          // User then uses arrows from search input to navigate.
        }
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          closeDropdown();
        }
        break;
      default:
        break;
    }
  };

  // Keyboard handling for the search input
  const handleSearchInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // If no options, arrow keys should not cause errors or change focus
    if (filteredOptions.length === 0 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedOptionIndex(prev => {
          const nextIndex = prev + 1;
          return nextIndex >= filteredOptions.length ? 0 : nextIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedOptionIndex(prev => {
          const nextIndex = prev - 1;
          return nextIndex < 0 ? filteredOptions.length - 1 : nextIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedOptionIndex >= 0 && focusedOptionIndex < filteredOptions.length) {
          handleOptionSelect(filteredOptions[focusedOptionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
      default:
        break;
    }
  };
  
  // Mouse hover handler for options to update focused index
  const handleOptionMouseEnter = (index: number) => {
    setFocusedOptionIndex(index);
  };

  return (
    <div className="searchable-select-container" ref={containerRef}>
      <button
        ref={triggerRef}
        id={triggerButtonId}
        type="button"
        className={`searchable-select-trigger ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={label} // If label is undefined, button's text content will be its accessible name
      >
        <span className="searchable-select-trigger-value">
          {currentSelectedOption ? currentSelectedOption.label : placeholder}
        </span>
        <span className="searchable-select-arrow" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && !disabled && (
        <div className="searchable-select-dropdown">
          <input
            ref={searchInputRef}
            type="text"
            className="searchable-select-search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchInputKeyDown}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={focusedOptionIndex >= 0 ? getOptionId(focusedOptionIndex) : undefined}
            aria-label="Search options" // Provides an accessible name for the search input
          />
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            className="searchable-select-options-list"
            tabIndex={-1} // Not focusable itself, focus managed by aria-activedescendant
            aria-labelledby={triggerButtonId} // Labelled by the main trigger button
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value} // Assuming option.value is unique for keys
                  id={getOptionId(index)}
                  ref={el => { optionRefs.current[index] = el; }}
                  role="option"
                  aria-selected={value === option.value}
                  className={`searchable-select-option ${index === focusedOptionIndex ? 'focused' : ''} ${value === option.value ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                  onMouseEnter={() => handleOptionMouseEnter(index)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="searchable-select-no-options" role="status"> 
                {notFoundContent}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
```

**2. `index.css` (Styling):**

```css
/* index.css */
.searchable-select-container {
  position: relative;
  font-family: Arial, sans-serif;
  width: 250px; /* Default width, can be overridden by parent or specific styles */
  box-sizing: border-box;
}

.searchable-select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;
  box-sizing: border-box;
  line-height: 1.5; /* Ensure consistent height */
}

.searchable-select-trigger:focus,
.searchable-select-trigger:focus-visible { /* Modern focus styling */
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.searchable-select-trigger.disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
  opacity: 0.65;
}

.searchable-select-trigger-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
  padding-right: 8px; /* Space before arrow */
}

.searchable-select-arrow {
  flex-shrink: 0;
  user-select: none; /* Prevent text selection of arrow */
}

.searchable-select-dropdown {
  position: absolute;
  top: calc(100% + 4px); /* Position below the trigger with a small gap */
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Ensure it's above other content */
  max-height: 200px; /* Prevent overly long dropdowns */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.searchable-select-search-input {
  width: calc(100% - 16px); /* Full width minus horizontal margins */
  padding: 8px;
  margin: 8px; /* Margin around search input */
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 0.95rem;
}

.searchable-select-search-input:focus,
.searchable-select-search-input:focus-visible {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.1rem rgba(0, 123, 255, 0.25);
}

.searchable-select-options-list {
  list-style: none;
  margin: 0;
  padding: 0 0 4px 0; /* Padding at bottom of list */
  overflow-y: auto; /* Scrollable list */
  flex-grow: 1; /* Takes remaining space in dropdown */
}

.searchable-select-option {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.searchable-select-option:hover {
  background-color: #f0f0f0; /* Hover style for mouse users */
}

.searchable-select-option.focused {
  background-color: #007bff; /* Keyboard focus style */
  color: #fff;
}

.searchable-select-option.selected {
  /* Style for the selected item in the list, if needed for visual distinction */
  /* background-color: #e6f2ff; */ /* Example: light blue */
  /* font-weight: bold; */ /* Example: bold */
}

/* If an option is both focused (by keyboard) and selected, focused style takes precedence */
.searchable-select-option.focused.selected {
  background-color: #0056b3; /* Darker blue if focused and also selected */
  color: #fff;
}

.searchable-select-no-options {
  padding: 8px 12px;
  color: #6c757d;
  font-style: italic;
  text-align: center;
  cursor: default;
}
```

**Explanation and Features:**

1.  **Technology:**
    *   React 18.x (using functional components and hooks like `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useId`).
    *   TypeScript for all component code, including prop types (`OptionType`, `SearchableSelectProps`).
    *   `index.css` for styling.

2.  **Core Functionality:**
    *   **Searchable Dropdown:** An input field appears in the dropdown to filter options.
    *   **Search Implementation:** Filters options based on `searchTerm` (case-insensitive).
    *   **Single Item Selection:** Supports selecting one item. The selected item's label is displayed in the trigger. `onChange` callback is invoked with the selected item's `value`.

3.  **Accessibility Requirements:**
    *   **Keyboard Navigation:**
        *   `Tab` to focus the trigger button.
        *   `Enter` or `Space` on the trigger toggles the dropdown.
        *   `ArrowDown`/`ArrowUp` on the trigger (when closed) opens the dropdown and focuses the search input (list focus defaults to the first item).
        *   Inside the dropdown (search input focused):
            *   `ArrowDown`/`ArrowUp` navigates through filtered options.
            *   `Enter` selects the highlighted option.
            *   `Escape` closes the dropdown.
    *   **ARIA Attributes:**
        *   `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` on the trigger button.
        *   `aria-label` on the trigger button (from `label` prop or defaults to content).
        *   `role="listbox"` on the `ul` element.
        *   `role="option"` and `aria-selected` on each `li` element.
        *   `aria-activedescendant` on the search input, pointing to the ID of the currently focused option.
        *   `aria-autocomplete="list"` on the search input.
        *   `aria-label="Search options"` on the search input for clarity.
        *   `role="status"` on the "no options found" message for screen reader announcements.
    *   **Focus Management:**
        *   When the dropdown opens, focus moves to the search input.
        *   When the dropdown closes (item selection, Escape, click outside), focus returns to the trigger button.

4.  **Dropdown Behavior:**
    *   Closes when an item is selected (via keyboard `Enter` or mouse click).
    *   Closes when the `Escape` key is pressed.
    *   Closes when clicking outside the component (using the `useOnClickOutside` custom hook).
    *   Opens on `Enter` or `Space` key press when the trigger button is focused.

5.  **Code Quality:**
    *   Clean, production-ready code structure.
    *   Proper TypeScript typing for props, state, and internal variables.
    *   No TODO comments or placeholder code.
    *   Reusable: The component is designed with props for customization (`id`, `options`, `value`, `onChange`, `placeholder`, `label`, `disabled`, `notFoundContent`).

This component should meet all the specified requirements. You can use it in your React application by importing `SearchableSelect` and providing the necessary props.

### Tokens: {'input_tokens': 293, 'output_tokens': 4533}
### Execution time: 206.0536379814148
