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
## SearchableSelect.tsx

```typescript
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<Props> = ({ options, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    handleClose();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0) {
        handleSelect(filteredOptions[highlightedIndex].value);
      } else {
        handleOpen();
      }
    } else if (event.key === 'Escape') {
      handleClose();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, 0));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="searchable-select" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="select-input" onClick={handleOpen}>
        {placeholder}
      </div>
      {isOpen && (
        <div className="dropdown">
          <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search..." />
          <ul>
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                className={index === highlightedIndex ? 'highlighted' : ''}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
```

## index.css

```css
.searchable-select {
  position: relative;
  width: 200px;
}

.select-input {
  padding: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown input[type="text"] {
  width: 100%;
  padding: 8px;
  border: none;
  border-bottom: 1px solid #ccc;
}

.dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown li {
  padding: 8px;
  cursor: pointer;
}

.dropdown li:hover,
.dropdown li.highlighted {
  background-color: #eee;
}
``` 


### Tokens: {'input_tokens': 199, 'output_tokens': 1056}
### Execution time: 31.660104990005493
