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
```typescript
// Select.tsx
import React, { useState, useRef, useEffect, KeyboardEvent, FocusEvent } from 'react';
import './index.css';

interface SelectProps {
  options: string[];
  onSelect: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      if (!isOpen) {
        setIsOpen(true);
      } else if (highlightedIndex >= 0) {
        onSelect(filteredOptions[highlightedIndex]);
        setIsOpen(false);
        selectRef.current?.focus();
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      selectRef.current?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
      );
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
    selectRef.current?.focus();
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!selectRef.current?.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedItem = listRef.current.children[highlightedIndex] as HTMLLIElement;
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, highlightedIndex]);

  return (
    <div
      className="select-container"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      ref={selectRef}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      <div className="select-input" onClick={toggleDropdown}>
        Select an option
      </div>
      {isOpen && (
        <div className="select-dropdown">
          <input
            type="text"
            className="select-search"
            value={searchTerm}
            onChange={handleInputChange}
            ref={inputRef}
            aria-label="Search options"
          />
          <ul className="select-list" ref={listRef} role="listbox">
            {filteredOptions.map((option, index) => (
              <li
                key={option}
                className={`select-option ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
```

```css
/* index.css */
.select-container {
  position: relative;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: sans-serif;
}

.select-input {
  padding: 8px;
  cursor: pointer;
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  z-index: 10;
}

.select-search {
  width: 100%;
  padding: 8px;
  border: none;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}

.select-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

.select-option {
  padding: 8px;
  cursor: pointer;
}

.select-option.highlighted {
  background-color: #f0f0f0;
}
```


### Tokens: {'input_tokens': 201, 'output_tokens': 1337}
### Execution time: 31.817430019378662
