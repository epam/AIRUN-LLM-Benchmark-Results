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
```tsx
// index.tsx
import React, { useState, useRef, useEffect } from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  onSelect: (option: Option) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        if (isOpen && highlightedIndex !== null && filteredOptions[highlightedIndex]) {
          onSelect(filteredOptions[highlightedIndex]);
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        if (isOpen && highlightedIndex !== null && highlightedIndex > 0) {
          setHighlightedIndex(highlightedIndex - 1);
        }
        break;
      case 'ArrowDown':
        if (isOpen && highlightedIndex !== null && highlightedIndex < filteredOptions.length - 1) {
          setHighlightedIndex(highlightedIndex + 1);
        } else if (isOpen && highlightedIndex === null) {
          setHighlightedIndex(0);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (option: Option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="searchable-select" onKeyDown={handleKeyDown} tabIndex={0}>
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />
      {isOpen && (
        <ul className="options-list">
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`option ${highlightedIndex === index ? 'highlighted' : ''}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
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
  width: 200px;
}

.search-input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.options-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;
}

.option {
  padding: 8px;
  cursor: pointer;
}

.option:hover,
.option.highlighted {
  background-color: #f0f0f0;
}
```

### Tokens: {'input_tokens': 200, 'output_tokens': 820}
### Execution time: 8.741105318069458
