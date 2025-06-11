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
**A Deep Dive into Building a Searchable Select Component**

Alright, let's break this down. My goal here is to create a robust and accessible React 18.x searchable select component, complete with TypeScript typing and proper styling. I'll need to create a fully functional, production-ready component that meets all the specified requirements.

**Core Functionality:**

The heart of this component is a searchable dropdown select. It needs an input field to display the selected value or a placeholder, along with a dropdown list of options. Crucially, there will be an input field *within* the dropdown to enable searching.  I'm envisioning the following components:

*   **SearchableSelect (Container):** The main wrapper.
*   **InputDisplay (shows selected value or placeholder, acts as a button)**: What the user sees and interacts with to trigger the dropdown.
*   **Dropdown (conditionally rendered):** The list of options. It's only shown when `isOpen` is true.
    *   **SearchInput (for filtering options):**  Enables searching within the options.
    *   **OptionList**: Holds the list of options.
        *   **OptionItem (clickable and keyboard navigable):**  Each selectable option.

**State Management:**

I need to keep track of a few key pieces of information:

*   `isOpen`: A boolean to control whether the dropdown is visible.
*   `selectedValue`:  This will hold the currently selected option (an object with `value` and `label`).
*   `searchTerm`:  A string for the current search query.
*   `highlightedIndex`:  An integer to keep track of which option is currently "highlighted" for keyboard navigation.
*   `options`: This will be the array of all available options, passed in as a prop.
*   `filteredOptions`:  An array of options that are filtered based on the current `searchTerm`. I'll use `useMemo` to efficiently manage this based on the `options` and `searchTerm` props.

**Props:**

I'll need to define a clear interface for the props:

*   `options`: The array of available options (`{ value: string; label: string; }[]`).
*   `value`:  For a controlled component, the currently selected option.
*   `onChange`:  A callback function that's called when the selected option changes.
*   `placeholder`: A string for the placeholder text in the trigger/input display.
*   `id`:  A unique string for this select component (used for ARIA attributes and associating with external labels).
*   `label`: An optional string for an external label element (not rendered directly by the component).
*   `disabled`:  An optional boolean to disable the component.
*   `noOptionsMessage`: An optional string to display if there are no search results.

**Accessibility is Key:**

Accessibility is paramount. This component must be fully navigable and usable with a keyboard. I'll need to implement the following keyboard interactions:

*   `Tab`: To focus the component.
*   `ArrowDown` / `ArrowUp`: To navigate through the options in the dropdown.
*   `Enter`:  To select an item *or* to toggle the dropdown's visibility (when focused).
*   `Escape`:  To close the dropdown.
*   When dropdown closes focus should be returned to the main input (trigger).

For ARIA attributes, I'll ensure:

*   `aria-haspopup="listbox"`, `aria-expanded={isOpen}`, `aria-controls="dropdown-list-id"` on the main input/button.
*   `role="listbox"` on the `ul` element for options.
*   `role="option"` on each `li` element.
*   `aria-selected={isSelected}` on each option.
*   `aria-activedescendant` on the listbox, pointing to the ID of the highlighted option.
*   Each option `li` needs a unique ID.
*   Search input: An `aria-label`.

**Behavior:**

*   Selecting an item or pressing `Enter` on a highlighted item should select it *and* close the dropdown.
*   Clicking outside the component should close the dropdown.
*   If the trigger has focus pressing `Enter`, the dropdown should open.

**Implementation Plan:**

1.  **Define Types:** I'll start by defining the `Option` interface and the prop types using TypeScript interfaces.
2.  **Basic Structure:** Create the `SearchableSelect.tsx` file and a corresponding `index.css`. The component will initially render the trigger and conditionally render the dropdown.
3.  **State Management:** I'

### Answer:
Okay, I will create the `SearchableSelect` component with the specified features and accessibility support.

Here's the plan:
1.  Define TypeScript interfaces for `Option` and `SearchableSelectProps`.
2.  Create the `SearchableSelect` functional component.
3.  Implement state management using `useState` for `isOpen`, `searchTerm`, and `highlightedIndex`.
4.  Use `useMemo` to calculate `filteredOptions`.
5.  Use `useRef` for DOM elements to manage focus and interactions (trigger, search input, list container, option items).
6.  Implement core functionalities:
    *   Displaying selected value or placeholder.
    *   Toggling dropdown visibility.
    *   Rendering options list.
    *   Search/filtering functionality.
    *   Single item selection.
7.  Implement dropdown behaviors:
    *   Close on item selection (mouse/keyboard).
    *   Close on `Escape` key.
    *   Close on click outside.
8.  Ensure accessibility:
    *   Full keyboard navigation (`Tab`, `Enter`, `Space`, `ArrowUp`, `ArrowDown`, `Escape`).
    *   ARIA attributes (`aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `role="listbox"`, `role="option"`, `aria-selected`, etc.).
    *   Focus management (return focus to trigger on close, focus search input on open).
9.  Provide styling via `index.css`.
10. Ensure code quality, reusability, and proper typing.

Let's start with the TypeScript file `SearchableSelect.tsx` and the CSS file `index.css`.

**`SearchableSelect.tsx`:**
```tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './index.css';

export interface Option {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  id: string;
  options: Option[];
  value: Option | null;
  onChange: (selectedOption: Option | null) => void;
  placeholder?: string;
  disabled?: boolean;
  noOptionsMessage?: string;
  // label?: string; // For external <label htmlFor={id}>, not rendered by component
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  noOptionsMessage = 'No options found',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  const listboxId = `${id}-listbox`;
  const getOptionId = (index: number) => `${id}-option-${index}`;

  const filteredOptions = useMemo(() => {
    if (!searchTerm) {
      return options;
    }
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm(''); // Reset search term on close
    triggerRef.current?.focus();
  }, []);

  const handleSelectOption = useCallback((option: Option) => {
    onChange(option);
    closeDropdown();
  }, [onChange, closeDropdown]);

  // Effect for click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          closeDropdown();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  // Effect for managing focus and initial highlight when dropdown opens/closes
  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
      optionRefs.current = optionRefs.current.slice(0, filteredOptions.length); // Ensure refs array matches options

      let initialHighlight = -1;
      if (searchTerm) {
        if (filteredOptions.length > 0) initialHighlight = 0;
      } else {
        if (value) {
          const idx = filteredOptions.findIndex(opt => opt.value === value.value);
          if (idx !== -1) {
            initialHighlight = idx;
          } else if (filteredOptions.length > 0) {
            initialHighlight = 0;
          }
        } else if (filteredOptions.length > 0) {
          initialHighlight = 0;
        }
      }
      setHighlightedIndex(initialHighlight);

    } else {
      setHighlightedIndex(-1); // Reset highlight when closed
    }
  }, [isOpen, searchTerm, filteredOptions, value]); // Removed `options` as `filteredOptions` covers it

  // Effect for scrolling highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
      const optionElement = optionRefs.current[highlightedIndex];
      optionElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, highlightedIndex, filteredOptions.length]);


  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(prev => !prev);
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          // If already open, let search input handle arrows, or move focus
          searchInputRef.current?.focus();
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

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex !== -1 && filteredOptions[highlightedIndex]) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (filteredOptions.length > 0) {
          setHighlightedIndex(prev => (prev + 1) % filteredOptions.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (filteredOptions.length > 0) {
          setHighlightedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
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

  return (
    <div className="searchable-select-container" ref={containerRef}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={`searchable-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        // aria-labelledby (if an external label exists, it should point to this id)
      >
        {value ? value.label : <span className="placeholder">{placeholder}</span>}
        <span className="searchable-select-arrow" />
      </button>

      {isOpen && (
        <div className="searchable-select-dropdown">
          <input
            ref={searchInputRef}
            type="text"
            className="searchable-select-search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchInputKeyDown}
            aria-label="Search options"
            aria-autocomplete="list"
            aria-controls={listboxId}
          />
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            className="searchable-select-options-list"
            tabIndex={-1} // Make it focusable only programmatically or via script
            aria-activedescendant={highlightedIndex !== -1 ? getOptionId(highlightedIndex) : undefined}
            // aria-labelledby={id} // Listbox is labelled by the trigger button
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={getOptionId(index)}
                  ref={el => (optionRefs.current[index] = el)}
                  role="option"
                  className={`searchable-select-option ${index === highlightedIndex ? 'highlighted' : ''} ${value?.value === option.value ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  aria-selected={value?.value === option.value}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="searchable-select-no-options" role="status">
                {noOptionsMessage}
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

**`index.css`:**
```css
/* index.css for SearchableSelect component */
.searchable-select-container {
  position: relative;
  display: inline-block;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  min-width: 200px; /* Ensure a minimum width */
}

.searchable-select-trigger {
  box-sizing: border-box;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  width: 100%; 
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
}

.searchable-select-trigger:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.searchable-select-trigger:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
  color: #6c757d;
  opacity: 0.65;
}

.searchable-select-trigger .placeholder {
  color: #6c757d;
}

.searchable-select-arrow {
  margin-left: 8px;
  border-style: solid;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  transition: transform 0.2s ease-in-out;
  color: #333; /* Arrow color */
}

.searchable-select-trigger.open .searchable-select-arrow {
  transform: rotate(-135deg);
  margin-top: 2px; /* Adjust position slightly when open */
}

.searchable-select-dropdown {
  position: absolute;
  top: calc(100% + 4px); /* Small gap between trigger and dropdown */
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  z-index: 1000;
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  box-sizing: border-box;
}

.searchable-select-search-input {
  box-sizing: border-box;
  width: calc(100% - 16px); /* Account for margin */
  padding: 8px;
  margin: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 0.95rem;
}

.searchable-select-search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.1rem rgba(0, 123, 255, 0.25);
}

.searchable-select-options-list {
  list-style: none;
  padding: 0;
  margin: 0 0 4px 0; /* Small bottom margin */
}

.searchable-select-option {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.searchable-select-option.highlighted {
  background-color: #007bff;
  color: white;
}

.searchable-select-option.selected {
  /* Style for selected item, not necessarily highlighted */
  /* font-weight: bold; */ /* Can be redundant if highlighted style is strong */
}

.searchable-select-option.selected.highlighted {
  /* Ensure highlighted style takes precedence or combines well */
  background-color: #0056b3; /* Darker blue when selected and highlighted */
  color: white;
}


.searchable-select-no-options {
  padding: 8px 12px;
  color: #6c757d;
  text-align: center;
  font-style: italic;
  font-size: 0.9rem;
}
```

**Explanation and Notes:**

1.  **`SearchableSelect.tsx`:**
    *   **Props & State:** Defines `Option`, `SearchableSelectProps`, and manages internal state (`isOpen`, `searchTerm`, `highlightedIndex`).
    *   **Refs:** Uses `useRef` for direct DOM manipulation (focus, click outside detection, scrolling). `optionRefs` is an array to hold refs to each option item for scrolling.
    *   **`filteredOptions`:** `useMemo` efficiently calculates options based on the search term.
    *   **`closeDropdown` & `handleSelectOption`:** `useCallback` memoizes these functions to prevent unnecessary re-renders of child components if they were passed down (though not strictly necessary here as they are mostly internal).
    *   **Effects:**
        *   `useEffect` for click outside detection.
        *   `useEffect` for managing focus (to search input on open) and setting the initial highlighted item based on `value` or first available option.
        *   `useEffect` for scrolling the `highlightedIndex` item into view.
    *   **Keyboard Handlers:** `handleTriggerKeyDown` and `handleSearchInputKeyDown` manage all keyboard interactions as per requirements.
    *   **ARIA Attributes:**
        *   Trigger button: `aria-haspopup`, `aria-expanded`, `aria-controls`.
        *   Search input: `aria-label`, `aria-autocomplete`, `aria-controls`.
        *   Listbox (`ul`): `role="listbox"`, `aria-activedescendant`.
        *   Option (`li`): `role="option"`, `aria-selected`, unique `id`.
    *   **Focus Management:** Focus is moved to the search input when the dropdown opens and back to the trigger button when it closes.
    *   **IDs:** Unique IDs are generated for ARIA relationships using the provided `id` prop.

2.  **`index.css`:**
    *   Provides basic styling for the component, including the trigger, dropdown, search input, options list, and individual options.
    *   Includes styles for `placeholder`, `disabled` state, `highlighted` and `selected` options.
    *   Adds a simple CSS arrow indicator that changes direction when the dropdown is open.
    *   Includes basic focus styling.

This component should meet all the specified requirements for functionality, accessibility, and code quality. It's reusable and uses TypeScript for type safety.

### Tokens: {'input_tokens': 293, 'output_tokens': 14481, 'reasoning_tokens': 10387}
### Execution time: 157.38844108581543
