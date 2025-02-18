Your task is to create a general component on React 18.x.
You should create a searchable select component with accessibility support.

When completing the task, ensure to adhere to the instructions below:
- Use TypeScript to create the component.
- It should have a search feature in the dropdown.
- It should be navigable via keyboard and select items on the Enter key.
- The dropdown list should open when Enter is pressed.
- After closing the dropdown, focus should return to the select component.
- The dropdown should close upon selecting an item (via keyboard or mouse), pressing Esc, or clicking outside.
- Provide an index.css file.
- The generated code should not contain any TODOs.
- Simply return the codebase without additional comments.

## Run 1:
### Answer:
<think>
Okay, I need to create a searchable select component in React 18 with TypeScript, ensuring accessibility. Let's break down the requirements.

First, the component needs a search input. When the user types, it should filter the options. The dropdown should open on Enter key press when focused. Keyboard navigation is essential—using arrow keys to move through options and Enter to select. Also, after closing, focus should return to the select input. The dropdown should close on selection, Esc key, or clicking outside.

I'll start by setting up the component structure. Use useState hooks for managing the selected value, the search query, whether the dropdown is open, and the highlighted index. Refs will be needed for the input and dropdown elements to handle focus and click outside detection.

For accessibility, the component should have proper ARIA roles and attributes. The input should have role="combobox" and aria-autocomplete="list". The dropdown list will be a ul with role="listbox", and each option as a li with role="option".

Handling keyboard events: onKeyDown for the input. When the user presses Enter, toggle the dropdown. Arrow keys up and down change the highlighted index. Enter selects the highlighted option. Esc closes the dropdown.

Clicking outside should close the dropdown. I'll use a useEffect hook with a event listener on the document to detect clicks outside the component.

Filtering the options based on the search query. Convert the query and option labels to lowercase for case-insensitive matching.

Styling with index.css: position the dropdown absolutely below the input. Highlight the focused option with a different background. Handle visibility with classes.

Testing the component: ensure that all interactions work as expected—keyboard navigation, search filtering, focus management, and closing behaviors.

Putting it all together, the component will manage state internally, accept options as a prop, and call an onChange callback when a selection is made. TypeScript interfaces will define the props and option types.

Finally, export the component and provide the CSS styles. Make sure there are no TODOs and all requirements are met.
</think>

**src/components/SearchSelect.tsx:**
```tsx
import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchSelectProps {
  options: Option[];
  onChange: (value: string) => void;
}

export const SearchSelect = ({ options, onChange }: SearchSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.focus();
        break;
    }
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onChange(value);
    setIsOpen(false);
    setSearchQuery(options.find(opt => opt.value === value)?.label || '');
    inputRef.current?.focus();
  };

  return (
    <div className="search-select" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="dropdown-list"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleInputKeyDown}
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <ul
          id="dropdown-list"
          role="listbox"
          className="dropdown"
          tabIndex={-1}
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === selectedValue}
              className={`option ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

**src/index.css:**
```css
.search-select {
  position: relative;
  width: 300px;
}

.search-select input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
}

.search-select .dropdown {
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  margin-top: 4px;
  list-style: none;
  padding: 0;
  background: white;
  z-index: 1000;
}

.search-select .option {
  padding: 8px;
  cursor: pointer;
}

.search-select .option.highlighted,
.search-select .option:hover {
  background-color: #f0f0f0;
}

.search-select .option[aria-selected="true"] {
  background-color: #e0e0e0;
}
```

### Tokens: {'input_tokens': 192, 'output_tokens': 1357}
### Execution time: 77.45860981941223
