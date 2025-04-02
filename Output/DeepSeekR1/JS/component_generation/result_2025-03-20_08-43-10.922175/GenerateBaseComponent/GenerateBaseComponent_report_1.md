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
Okay, I need to create a searchable select component in React 18 with TypeScript, ensuring accessibility. Let's start by breaking down the requirements.

First, the component needs a searchable dropdown. So, there's an input field where the user can type to filter options. Then, a list of options that can be selected. Since it's single-select, selecting an option should update the displayed value.

Accessibility is crucial here. Keyboard navigation: users should be able to navigate options with arrow keys, select with Enter, and close with Escape. Also, focus management—when the dropdown closes, focus should return to the input.

For the dropdown behavior, clicking outside should close it. I'll need a useEffect that adds a click event listener to the document and checks if the click is outside the component. Also, Escape key should close it, so another event listener for keydown events.

TypeScript typings are important. The component should accept options as a prop, each with a value and label. The selected value can be a string or null. The component should be controlled, so it needs onChange and value props.

Styling: I'll create an index.css with styles for the container, input, dropdown, and options. Use classes for open state and highlighted items. Maybe a focus state for keyboard navigation.

Structure: The main component will be a div container with relative positioning. Inside, an input element for the search and the selected value. When the input is focused or clicked, the dropdown opens. The dropdown is a list of filtered options based on the search query.

Handling keyboard events: When the dropdown is open, arrow keys should move the highlighted index. Enter selects the option and closes the dropdown. Escape closes without selecting. When the dropdown is closed, Enter opens it.

I'll use useState hooks for isOpen, searchQuery, highlightedIndex. Use useRef for the container and dropdown elements to handle click outside and focus management.

Filtering the options: whenever the searchQuery changes, filter the options that include the query string, case-insensitive.

For accessibility, roles like combobox, listbox, and option should be used. aria-activedescendant will track the highlighted option. aria-expanded on the input indicates if the dropdown is open.

Testing the component: Not part of the code, but in a real scenario, I'd write unit tests with React Testing Library to check keyboard interactions, search filtering, and accessibility attributes.

Potential issues: Making sure the event listeners are added and removed correctly in useEffect to prevent memory leaks. Also, handling the case when options are empty after filtering.

Now, structuring the code. The component will be a function component with props for options, value, and onChange. Internal states manage the open state, search, and highlighted index. Refs for DOM elements. Effects for click outside and keydown events.

In the JSX, the input has a value based on the selected option's label or the search query when filtering. The dropdown list renders the filtered options, each with an onClick handler. The highlighted index is used to style the active option.

Finally, the CSS styles position the dropdown absolutely below the input, with basic styling for options, hover states, and visibility based on the isOpen state.

I need to make sure all the requirements are covered: keyboard nav, accessibility attributes, correct event handling, and proper TypeScript types. Also, the component should be reusable, so props allow passing different options and handling selection externally.

### Answer:
I'll help you create a comprehensive searchable select component that meets all the requirements. Here's the implementation:

1. First, let's create the component file (SearchableSelect.tsx):

```tsx
import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  useMemo,
  useCallback,
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
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const selectedOption = useMemo(() => {
    return options.find(option => option.value === value) || null;
  }, [options, value]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) {
        if (event.key === 'Enter') {
          setIsOpen(true);
          inputRef.current?.focus();
        }
        return;
      }

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.focus();
          break;
        case 'ArrowDown':
          setHighlightedIndex(prev =>
            Math.min(prev + 1, filteredOptions.length - 1)
          );
          break;
        case 'ArrowUp':
          setHighlightedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          if (filteredOptions[highlightedIndex]) {
            onChange(filteredOptions[highlightedIndex].value);
            setIsOpen(false);
            setSearchQuery('');
          }
          break;
      }
    },
    [isOpen, filteredOptions, highlightedIndex, onChange]
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
    }
  }, [isOpen, filteredOptions]);

  return (
    <div
      ref={containerRef}
      className="select-container"
      onKeyDown={handleKeyDown}
    >
      <div
        className="select-input"
        onClick={() => {
          setIsOpen(prev => !prev);
          inputRef.current?.focus();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : selectedOption?.label || ''}
          placeholder={placeholder}
          readOnly={!isOpen}
          onChange={e => setSearchQuery(e.target.value)}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="dropdown-list"
          aria-activedescendant={
            isOpen ? `option-${highlightedIndex}` : undefined
          }
        />
      </div>

      {isOpen && (
        <ul
          id="dropdown-list"
          className="dropdown-list"
          role="listbox"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              id={`option-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={`dropdown-item ${
                index === highlightedIndex ? 'highlighted' : ''
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                setSearchQuery('');
              }}
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

2. Now let's create the index.css file:

```css
.select-container {
  position: relative;
  width: 300px;
  font-family: Arial, sans-serif;
}

.select-input input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.select-input input:focus {
  outline: 2px solid #0066cc;
  outline-offset: -1px;
}

.dropdown-list {
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  margin: 4px 0 0;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  list-style: none;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  color: #333;
}

.dropdown-item.highlighted {
  background-color: #f0f0f0;
}

.dropdown-item:hover {
  background-color: #e6e6e6;
}

.dropdown-item[aria-selected="true"] {
  background-color: #0066cc;
  color: white;
}
```

Key features of this implementation:

1. Accessibility:
- Proper ARIA roles (combobox, listbox, option)
- Keyboard navigation (Arrow keys, Enter, Escape)
- Focus management
- Screen reader support

2. Behavior:
- Click outside to close
- Escape key to close
- Search filtering
- Proper option highlighting
- Mouse and keyboard interaction support

3. Type Safety:
- Strict TypeScript types for options and props
- Proper event typing
- Memoized values for performance

4. Reusability:
- Controlled component pattern
- Generic option structure
- Customizable placeholder
- External styling via CSS classes

To use the component:

```tsx
import { SearchableSelect, SelectOption } from './SearchableSelect';

const options: SelectOption[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  // ... more options
];

function App() {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  return (
    <SearchableSelect
      options={options}
      value={selectedValue}
      onChange={setSelectedValue}
      placeholder="Search options..."
    />
  );
}
```

This implementation follows all specified requirements and provides:
- Full keyboard navigation
- ARIA-compliant markup
- Type-safe implementation
- Proper focus management
- Search filtering
- Clean, reusable component structure
- Production-ready code quality
- Comprehensive styling with CSS
- Click-outside detection
- Escape key handling
- Mobile-friendly interactions

### Tokens: {'input_tokens': 286, 'output_tokens': 2344}
### Execution time: 31.59869909286499
