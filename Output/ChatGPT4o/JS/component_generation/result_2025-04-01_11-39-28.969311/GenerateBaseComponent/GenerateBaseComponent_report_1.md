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
Here's a production-ready, accessible, and reusable searchable select component built with React 18.x and TypeScript. It includes full keyboard navigation, proper focus management, and clean styling via an external CSS file.

📁 File Structure:
```
SearchableSelect/
├── SearchableSelect.tsx
├── index.css
```

---

🔹 `SearchableSelect.tsx`

```tsx
import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useCallback,
  useMemo,
} from 'react';
import './index.css';

type Option = {
  label: string;
  value: string;
};

type SearchableSelectProps = {
  options: Option[];
  placeholder?: string;
  onChange: (selected: Option) => void;
  value?: Option;
  id?: string;
  className?: string;
};

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = 'Select...',
  onChange,
  value,
  id,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleDocumentClick = useCallback(
    (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    },
    [containerRef]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [handleDocumentClick]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter') {
        setIsOpen(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, filteredOptions.length - 1)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          const selected = filteredOptions[highlightedIndex];
          onChange(selected);
          setIsOpen(false);
          setSearchTerm('');
          setHighlightedIndex(-1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleOptionClick = (option: Option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(0);
  };

  const selectedLabel = value?.label || '';

  return (
    <div
      id={id}
      className={`searchable-select ${className}`}
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      role="combobox"
      aria-owns={`${id}-listbox`}
      aria-controls={`${id}-listbox`}
    >
      <div
        className="select-display"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }}
      >
        {selectedLabel || placeholder}
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="dropdown">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search..."
            aria-label="Search options"
          />
          <ul
            className="options-list"
            role="listbox"
            id={`${id}-listbox`}
            ref={listRef}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={value?.value === option.value}
                  className={`option-item ${
                    index === highlightedIndex ? 'highlighted' : ''
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="no-options">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
```

---

🔹 `index.css`

```css
.searchable-select {
  position: relative;
  width: 250px;
  font-family: sans-serif;
  outline: none;
}

.select-display {
  border: 1px solid #ccc;
  padding: 8px 12px;
  background-color: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-display:focus {
  outline: 2px solid #007bff;
}

.arrow {
  margin-left: 8px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 1000;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}

.options-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.option-item {
  padding: 8px 12px;
  cursor: pointer;
}

.option-item:hover,
.option-item.highlighted {
  background-color: #007bff;
  color: white;
}

.no-options {
  padding: 8px 12px;
  color: #888;
}
```

---

✅ Features Implemented:

- ✅ Searchable dropdown with filtering
- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Mouse selection
- ✅ Focus management
- ✅ Click outside to close
- ✅ Accessible ARIA roles and attributes
- ✅ Fully typed with TypeScript
- ✅ Reusable and customizable

---

🧪 Usage Example:

```tsx
import React, { useState } from 'react';
import { SearchableSelect } from './SearchableSelect/SearchableSelect';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Grapes', value: 'grapes' },
];

export const App = () => {
  const [selected, setSelected] = useState<{ label: string; value: string } | undefined>();

  return (
    <div>
      <h1>Searchable Select Demo</h1>
      <SearchableSelect
        id="fruit-select"
        options={options}
        value={selected}
        onChange={setSelected}
        placeholder="Choose a fruit"
      />
    </div>
  );
};
```

Let me know if you’d like unit tests or multi-select support added!

### Tokens: {'input_tokens': 290, 'output_tokens': 1790, 'reasoning_tokens': 0}
### Execution time: 15.337203979492188
