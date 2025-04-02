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
// Select.tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './index.css';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  onChange: (option: Option) => void;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ options, onChange, placeholder = "Select an option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    );
    setHighlightedIndex(-1);
  }, [search, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0) {
        selectOption(filteredOptions[highlightedIndex]);
      } else {
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const selectOption = (option: Option) => {
    onChange(option);
    setIsOpen(false);
    setSearch('');
    inputRef.current?.blur();
  };

  return (
    <div className="select-container" ref={containerRef}>
      <div
        className="select-display"
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            toggleDropdown();
          }
        }}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {search || placeholder}
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="select-dropdown">
          <input
            type="text"
            className="select-search"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            aria-label="Search"
          />
          <ul className="select-list" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  className={`select-option ${index === highlightedIndex ? 'highlighted' : ''
                    }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectOption(option)}
                  role="option"
                  aria-selected={index === highlightedIndex}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="select-no-options">No options found</li>
            )}
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
  font-family: Arial, sans-serif;
}

.select-display {
  border: 1px solid #ccc;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-display:focus {
  outline: none;
  border-color: #007BFF;
}

.arrow {
  margin-left: 8px;
}

.select-dropdown {
  position: absolute;
  width: 100%;
  border: 1px solid #ccc;
  border-top: none;
  background: #fff;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.select-search {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid #ccc;
}

.select-search:focus {
  outline: none;
  border-color: #007BFF;
}

.select-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.select-option {
  padding: 8px 12px;
  cursor: pointer;
}

.select-option.highlighted,
.select-option:hover {
  background-color: #007BFF;
  color: #fff;
}

.select-no-options {
  padding: 8px 12px;
  color: #999;
}
```

### Tokens: {'input_tokens': 168, 'output_tokens': 1915, 'reasoning_tokens': 640}
### Execution time: 10.425794124603271
