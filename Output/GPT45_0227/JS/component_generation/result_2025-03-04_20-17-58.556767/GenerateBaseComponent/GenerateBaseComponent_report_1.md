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
**SearchableSelect.tsx**
```tsx
import React, { useState, useRef, useEffect } from 'react';
import './index.css';

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, placeholder = 'Select...', onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleDropdown = () => {
    setIsOpen(prev => !prev);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm('');
    if (onChange) {
      onChange(option.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isOpen) {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      } else if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleSelectOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % filteredOptions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      containerRef.current?.focus();
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className="searchable-select"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      <div className="selected-value" onClick={handleToggleDropdown}>
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <div className="dropdown">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search..."
            aria-label="Search options"
          />
          <ul className="options-list" role="listbox">
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                className={`option-item ${highlightedIndex === index ? 'highlighted' : ''}`}
                onClick={() => handleSelectOption(option)}
                role="option"
                aria-selected={selectedOption?.value === option.value}
              >
                {option.label}
              </li>
            ))}
            {filteredOptions.length === 0 && <li className="no-options">No options found</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
```

**index.css**
```css
.searchable-select {
  position: relative;
  width: 250px;
  font-family: Arial, sans-serif;
  outline: none;
}

.selected-value {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff;
}

.dropdown {
  position: absolute;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  outline: none;
}

.options-list {
  max-height: 150px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.option-item {
  padding: 8px 12px;
  cursor: pointer;
}

.option-item:hover,
.option-item.highlighted {
  background-color: #f0f0f0;
}

.no-options {
  padding: 8px 12px;
  color: #888;
}
```

### Tokens: {'input_tokens': 199, 'output_tokens': 1197, 'reasoning_tokens': 0}
### Execution time: 38.85068225860596
