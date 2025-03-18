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
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (highlightedIndex >= filteredOptions.length) {
      setHighlightedIndex(filteredOptions.length - 1);
    }
  }, [filteredOptions, highlightedIndex]);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setSearch('');
      setHighlightedIndex(-1);
    }
  };

  const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleDropdown();
        break;
      default:
        break;
    }
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      default:
        break;
    }
  };

  const selectOption = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearch('');
    buttonRef.current?.focus();
  };

  const handleOptionMouseEnter = (index: number) => {
    setHighlightedIndex(index);
  };

  const handleOptionClick = (option: Option) => {
    selectOption(option);
  };

  return (
    <div className="select-container" ref={containerRef}>
      <button
        type="button"
        className="select-button"
        onClick={toggleDropdown}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        ref={buttonRef}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="dropdown">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            ref={searchRef}
            aria-label="Search"
          />
          <ul
            className="options-list"
            role="listbox"
            ref={listRef}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  className={`option-item ${
                    index === highlightedIndex ? 'highlighted' : ''
                  }`}
                  onMouseEnter={() => handleOptionMouseEnter(index)}
                  onClick={() => handleOptionClick(option)}
                  role="option"
                  aria-selected={selectedOption?.value === option.value}
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

export default SearchableSelect;
```

```css
/* index.css */
.select-container {
  position: relative;
  width: 200px;
  font-family: Arial, sans-serif;
}

.select-button {
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background-color: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
}

.select-button:focus {
  outline: none;
  border-color: #007BFF;
}

.arrow {
  float: right;
}

.dropdown {
  position: absolute;
  width: 100%;
  border: 1px solid #ccc;
  border-top: none;
  background-color: #fff;
  z-index: 1000;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ccc;
}

.search-input:focus {
  outline: none;
  border-color: #007BFF;
}

.options-list {
  max-height: 150px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
}

.option-item {
  padding: 8px 12px;
  cursor: pointer;
}

.option-item.highlighted,
.option-item:hover {
  background-color: #007BFF;
  color: #fff;
}

.no-options {
  padding: 8px 12px;
  color: #999;
}
```

### Tokens: {'input_tokens': 168, 'output_tokens': 2031, 'reasoning_tokens': 576}
### Execution time: 11.976155996322632
