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
**React Select Component Development: My Approach**

Alright, let's break this down. My goal is to craft a reusable, accessible, and type-safe searchable select component using React 18 and TypeScript. I'll stick to established React patterns, focusing on hooks like `useState`, `useEffect`, `useRef`, and `useCallback` for state management, side effects, and optimized event handling. No need for exotic React 18 features here, but it'll be compatible.

**Foundation: TypeScript, Structure, and CSS**

First things first, TypeScript is non-negotiable. I'll define precise types for props, state, and any complex data structures to ensure code quality and maintainability. The component will have a dedicated CSS file (`index.css`) for clear separation of concerns.

**Core Functionality: Search and Select**

This component needs two key features: a searchable dropdown and single item selection. Users will type in an input field, which will filter the options in the dropdown accordingly. Selecting an option will update the input field with the selected value and internally update the component's state.

**A11y: Making It Usable by Everyone**

Accessibility is paramount. This means implementing comprehensive ARIA attributes to make the component navigable by screen readers and other assistive technologies.

*   **Keyboard Navigation:** I'll implement Tab, arrow keys, Enter, and Escape key handling to fully support keyboard-based interactions.
*   **Focus Management:** It's critical to ensure focus returns to the input field after closing the dropdown.
*   **ARIA Attributes:** I'll use `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, and `aria-activedescendant` for proper communication with assistive technologies. The `aria-activedescendant` attribute will link to the currently highlighted item, which will keep the user context within the input field.

**Dropdown Behavior: Smooth and Intuitive**

The dropdown should close seamlessly:

*   **On Selection:** After a click or pressing Enter.
*   **On Escape:** Implementing an effect listener on the document.
*   **On Click Outside:** I'll use a custom `useClickOutside` hook or document event listeners to close the dropdown when clicking outside its bounds.
*   **On Enter:** Handle this within the `onKeyDown` handler on the input element.

**Code Quality: Clean, Reusable, and Robust**

The code will be clean, following standard React functional component conventions and hooks. I plan to use generics and well-defined interfaces for flexibility. No TODOs will be left; I aim for a production-ready component.

**Component Structure: The Blueprint**

Here's my planned structure:

1.  **`SearchableSelect.tsx`:** The main component.
    *   Props: `options`, `value`, `onChange`, `placeholder`.
    *   State: `isOpen`, `searchTerm`, `highlightedIndex`.
    *   Refs: `containerRef`, `inputRef`, `listRef`.
    *   Derived State: `filteredOptions`.
    *   Effects: Close dropdown on click outside and when Escape is pressed. Scrolling highlighted item into view.
    *   Handlers: Input change, input focus, keyboard events, option clicks.

2.  **`index.css`:** The stylesheet. Styles for the container, input, and different states.
3.  **`index.ts`:** An export entry point for easy import.

**Implementation Plan: Step-by-Step**

1.  File structure: Create the component folder.
2.  Types: Define `OptionType` and `SearchableSelectProps`.
3.  Skeleton: Set up the JSX structure.
4.  State: Initialize the state variables.
5.  Filtering: Implement the filtering logic.
6.  Rendering: Map over the filtered options.
7.  Input Handlers: Handle input change and click events.
8.  Keyboard Navigation: Implement keydown logic.
9.  Click Outside Hook: Integrate the click-outside handler.
10. Accessibility (ARIA): Add ARIA attributes.
11. Focus Management: Make sure the input regains focus.
12. Styling: Add and make it look clean.
13. Final Polish: Review the component thoroughly.

**Key Considerations**

I will use `useCallback` for event handlers to prevent unnecessary re-renders. The `handleInputBlur` logic is tricky and I will prefer a `mousedown` listener for click-outside detection, as it fires before `blur`.

*   For `aria-activedescendant`, I'll generate unique IDs for each option item.
*   I will set `inputValue` state to the selected option'

### Answer:
Of course. Here is the implementation of a production-ready, accessible, and searchable select component in React and TypeScript.

### File Structure

First, let's set up the file structure for our component.

```
/src
└── /components
    └── /SearchableSelect
        ├── SearchableSelect.tsx
        ├── index.css
        └── index.ts
```

---

### `SearchableSelect.tsx`

This file contains the core logic and JSX for the component. It handles state, keyboard navigation, accessibility attributes, and user interactions.

```typescript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

/**
 * Defines the structure for each option in the select dropdown.
 */
export interface OptionType {
  value: string;
  label: string;
}

/**
 * Defines the props for the SearchableSelect component.
 */
export interface SearchableSelectProps {
  options: OptionType[];
  value: OptionType | null;
  onChange: (value: OptionType | null) => void;
  placeholder?: string;
  id?: string; // Recommended for accessibility (e.g., for <label htmlFor={id}>)
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  id = 'searchable-select',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter options based on the search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Closes the dropdown, resets search and highlight, and focuses the input.
   */
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }, []);

  /**
   * Handles selecting an option, updating state, and closing the dropdown.
   */
  const handleSelectOption = (option: OptionType) => {
    onChange(option);
    closeDropdown();
  };

  // Effect to handle clicks outside the component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeDropdown]);

  // Effect to scroll the highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedItem = listRef.current.children[highlightedIndex] as HTMLLIElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          block: 'nearest',
          inline: 'start',
        });
      }
    }
  }, [isOpen, highlightedIndex]);

  /**
   * Handles all keyboard interactions for accessibility and functionality.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          }
        } else {
          setIsOpen(true);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setHighlightedIndex((prevIndex) =>
          Math.min(prevIndex + 1, filteredOptions.length - 1)
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        break;

      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;

      case 'Tab':
        if (isOpen) {
          closeDropdown();
        }
        break;
    }
  };

  const listId = `${id}-listbox`;
  const getOptionId = (index: number) => `${id}-option-${index}`;

  return (
    <div
      className="searchable-select-container"
      ref={containerRef}
      // A combobox is a composite widget that combines a text input with a listbox.
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-owns={isOpen ? listId : undefined}
    >
      <input
        id={id}
        ref={inputRef}
        type="text"
        className="searchable-select-input"
        value={isOpen ? searchTerm : value?.label || ''}
        onChange={(e) => {
          if (!isOpen) setIsOpen(true);
          setSearchTerm(e.target.value);
          setHighlightedIndex(0);
        }}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        // Manages focus within the listbox without moving DOM focus away from the input.
        aria-activedescendant={highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined}
        // Links the input to the listbox.
        aria-controls={listId}
        aria-autocomplete="list"
      />
      {isOpen && (
        <ul
          id={listId}
          ref={listRef}
          className="searchable-select-dropdown"
          // Identifies the element as a listbox.
          role="listbox"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                id={getOptionId(index)}
                key={option.value}
                className={`searchable-select-option ${
                  index === highlightedIndex ? 'highlighted' : ''
                } ${value?.value === option.value ? 'selected' : ''}`}
                onClick={() => handleSelectOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                // Identifies each item as an option in the listbox.
                role="option"
                // Indicates whether the option is currently selected.
                aria-selected={value?.value === option.value}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="searchable-select-option-none">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};
```

---

### `index.css`

This file provides the necessary styling for the component, including states like `highlighted` and `selected`.

```css
/* Main container for positioning the dropdown */
.searchable-select-container {
  position: relative;
  font-family: Arial, sans-serif;
  width: 300px;
}

/* Input field styling */
.searchable-select-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  cursor: pointer;
}

.searchable-select-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Dropdown list styling */
.searchable-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

/* Individual option styling */
.searchable-select-option {
  padding: 10px;
  cursor: pointer;
  user-select: none;
}

/* Styling for the message when no options are found */
.searchable-select-option-none {
  padding: 10px;
  color: #888;
  font-style: italic;
}

/* Highlighted state (via keyboard or mouse hover) */
.searchable-select-option.highlighted {
  background-color: #f0f0f0;
}

/* Selected state */
.searchable-select-option.selected {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

/* Ensure highlighted and selected states can coexist visually */
.searchable-select-option.selected.highlighted {
  background-color: #0056b3;
}
```

---

### `index.ts`

This file serves as the entry point for the component, making it easy to import and use elsewhere in an application.

```typescript
export * from './SearchableSelect';
```

This solution provides a complete, reusable, and accessible searchable select component that meets all the specified requirements. It uses modern React hooks, is fully typed with TypeScript, and follows best practices for accessibility and code quality.

### Tokens: {'input_tokens': 293, 'output_tokens': 5226, 'reasoning_tokens': 2850}
### Execution time: 55.99549603462219
