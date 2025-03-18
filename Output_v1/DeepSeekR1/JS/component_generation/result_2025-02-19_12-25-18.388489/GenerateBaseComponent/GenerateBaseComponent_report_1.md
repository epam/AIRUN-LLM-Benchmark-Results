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
Okay, I need to create a searchable select component in React 18 with TypeScript, ensuring accessibility and keyboard navigation. Let me break down the requirements.

First, the component should have a searchable dropdown. So, I'll need an input field that filters the options as the user types. Then, the dropdown must open when the user presses Enter on the select component. That means the select isn't a native <select> but a custom button or div that triggers the dropdown.

Accessibility is important, so I should use ARIA roles like combobox, listbox, and option. Also, keyboard navigation: using arrow keys to move through options, Enter to select, Esc to close. When the dropdown closes, focus should return to the select button. Clicking outside should close the dropdown, so I'll need a click event listener that detects outside clicks.

For state management, I'll need states for whether the dropdown is open, the search query, the selected value, and the currently highlighted option index. Using useState hooks makes sense here.

The component should accept options as a prop, which is an array of objects with value and label. The search will filter these options based on the label.

Handling keyboard events: when the dropdown is closed, pressing Enter opens it. When open, arrow keys change the highlighted index, Enter selects the item, Esc closes. I'll use onKeyDown handlers for these.

Clicking outside the component should close the dropdown. I can use a useRef to track the component's DOM node and add a mousedown event listener to the document. If the click is outside, set isOpen to false.

Focus management: when the dropdown closes, focus should return to the select button. I'll need a ref for the button and call focus() when the dropdown closes.

Styling: I'll create an index.css with basic styles for the container, button, dropdown, options, and highlighted items. Include transitions for smooth opening/closing.

Testing for edge cases: empty options, no matching search results, ensuring the highlighted index resets when the dropdown opens or the search changes.

Putting it all together, the component will have a button that toggles the dropdown, an input for searching when open, and a list of filtered options. Each option will be a div with appropriate ARIA roles and event handlers.

I should also make sure that the component is controlled, so it takes a value prop and an onChange handler. The selected value is displayed on the button when closed.

TypeScript interfaces: define the Option type and the component's props, including options, value, and onChange.

Now, structuring the code. The main component will be SearchableSelect. Use useRef for the component container and the button. useEffect for adding/removing the click outside listener. The options are filtered based on the search query, and mapped into the dropdown list.

In the CSS, position the dropdown absolutely below the button, with max-height and overflow for scrolling. Highlight the selected option with a different background.

Finally, ensure all the requirements are met: search, keyboard nav, accessibility, focus management, and closing behaviors.
</think>

**src/SearchableSelect.tsx:**
```tsx
import { useState, useEffect, useRef, KeyboardEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
}

export function SearchableSelect({ options, value, onChange }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isOpen) {
      setIsOpen(true);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    } else if (isOpen) {
      if (e.key === 'ArrowDown') {
        setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredOptions[highlightedIndex]) {
        onChange(filteredOptions[highlightedIndex].value);
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
  };

  const selectedLabel = options.find(option => option.value === value)?.label || 'Select...';

  return (
    <div className="select-container" ref={containerRef}>
      <button
        ref={buttonRef}
        className="select-button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedLabel}
      </button>

      {isOpen && (
        <div className="dropdown">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
          />
          <ul className="options-list" role="listbox">
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={`option ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

**src/index.css:**
```css
.select-container {
  position: relative;
  width: 300px;
  font-family: Arial, sans-serif;
}

.select-button {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  text-align: left;
  cursor: pointer;
}

.select-button:focus {
  outline: 2px solid #0066cc;
}

.dropdown {
  position: absolute;
  width: 100%;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1;
}

.search-input {
  width: calc(100% - 16px);
  padding: 8px;
  margin: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.options-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.option {
  padding: 8px 12px;
  cursor: pointer;
}

.option:hover, .option.highlighted {
  background-color: #f0f0f0;
}

.option[aria-selected="true"] {
  background-color: #e0e0e0;
  font-weight: bold;
}
```

### Tokens: {'input_tokens': 192, 'output_tokens': 1787}
### Execution time: 50.094902992248535
