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
// SearchableSelect.tsx
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: Option;
  onChange: (option: Option) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: Option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen) {
        const option = filteredOptions[highlightedIndex];
        if (option) {
          handleOptionSelect(option);
        }
      } else {
        setIsOpen(true);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex((prevIndex) =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
        );
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && containerRef.current) {
      containerRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      className="searchable-select"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={containerRef}
    >
      <div className="searchable-select__selected" onClick={handleToggleDropdown}>
        {value ? value.label : 'Select an option'}
      </div>
      {isOpen && (
        <div className="searchable-select__dropdown">
          <input
            type="text"
            className="searchable-select__search-input"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setHighlightedIndex(0); }}
            ref={searchInputRef}
            aria-label="Search options"
          />
          <ul className="searchable-select__options" role="listbox">
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                className={`searchable-select__option ${
                  index === highlightedIndex ? 'highlighted' : ''
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleOptionSelect(option)}
                role="option"
                aria-selected={value?.value === option.value}
              >
                {option.label}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="searchable-select__no-options">No options found</li>
            )}
          </ul>
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
  display: inline-block;
  width: 200px;
  outline: none;
}

.searchable-select__selected {
  padding: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.searchable-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  border: 1px solid #ccc;
}

.searchable-select__search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
}

.searchable-select__options {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 150px;
  overflow-y: auto;
}

.searchable-select__option {
  padding: 8px;
  cursor: pointer;
}

.searchable-select__option.highlighted,
.searchable-select__option:hover {
  background-color: #eee;
}

.searchable-select__no-options {
  padding: 8px;
  color: #999;
}
```

### Tokens: {'input_tokens': 168, 'output_tokens': 3407, 'reasoning_tokens': 2176}
### Execution time: 146.6553030014038
