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
// SearchableSelect.tsx
import React, { useState, useRef, useEffect, KeyboardEvent, MouseEvent } from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, onChange, placeholder = 'Select an option' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isOpen) {
      setIsOpen(true);
    } else if (e.key === 'Enter' && isOpen) {
      if (highlightedIndex !== -1 && filteredOptions[highlightedIndex]) {
        selectOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const selectOption = (option: Option) => {
    setSelectedOption(option);
    onChange(option.value);
    closeDropdown();
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
    if (selectRef.current) {
      selectRef.current.focus();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside as any);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as any);
    };
  }, []);

  return (
    <div 
      ref={selectRef} 
      tabIndex={0} 
      className="searchable-select" 
      onKeyDown={handleKeyDown}
      onClick={() => setIsOpen(!isOpen)}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="options-list"
    >
      <div className="select-selected">
        {selectedOption ? selectedOption.label : placeholder}
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="select-items" id="options-list" role="listbox">
          <input 
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="search-input"
            aria-label="Search options"
          />
          {filteredOptions.map((option, index) => (
            <div 
              key={option.value} 
              className={`option ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => selectOption(option)}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              {option.label}
            </div>
          ))}
        </div>
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
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
}

.select-selected {
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow {
  font-size: 10px;
}

.select-items {
  position: absolute;
  background-color: white;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 99;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
}

.search-input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ccc;
}

.option {
  padding: 8px;
  cursor: pointer;
}

.option:hover, .option.highlighted {
  background-color: #f1f1f1;
}

.option[aria-selected="true"] {
  background-color: #e0e0e0;
}
```

### Tokens: {'input_tokens': 196, 'output_tokens': 1146}
### Execution time: 20.836624145507812
