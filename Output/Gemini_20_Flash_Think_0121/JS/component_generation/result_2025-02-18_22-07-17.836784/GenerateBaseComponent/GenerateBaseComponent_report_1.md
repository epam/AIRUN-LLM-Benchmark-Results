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
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const selectRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = () => {
    setIsOpen(true);
    setSearchTerm('');
    setHighlightedIndex(-1);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
    selectRef.current?.focus();
  };

  const handleOptionSelect = useCallback(
    (optionValue: string) => {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      handleClose();
    },
    [onChange]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (!isOpen) {
        handleOpen();
      } else if (highlightedIndex !== -1) {
        handleOptionSelect(filteredOptions[highlightedIndex].value);
      }
    } else if (event.key === 'Escape') {
      handleClose();
    } else if (isOpen) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex((prevIndex) =>
          filteredOptions.length > 0 ? Math.min(prevIndex + 1, filteredOptions.length - 1) : -1
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, -1));
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !selectRef.current?.contains(event.target as Node) && !listRef.current?.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClose]);

  return (
    <div className="searchable-select">
      <button
        ref={selectRef}
        className="select-button"
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby="searchable-select-label"
        role="combobox"
        onKeyDown={handleKeyDown}
      >
        <span id="searchable-select-label" className="select-placeholder">
          {selectedValue ? options.find(opt => opt.value === selectedValue)?.label : placeholder}
        </span>
        <span className="arrow-down" aria-hidden="true"></span>
      </button>
      {isOpen && (
        <div className="dropdown" role="listbox" ref={listRef}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            aria-controls="options-list"
            aria-activedescendant={highlightedIndex !== -1 ? `option-${highlightedIndex}` : undefined}
          />
          <ul className="options-list" id="options-list" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  id={`option-${index}`}
                  className={`option ${highlightedIndex === index ? 'highlighted' : ''}`}
                  role="option"
                  onClick={() => handleOptionSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="option disabled" role="option" aria-disabled="true">No options found</li>
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
.searchable-select {
  position: relative;
  display: inline-block;
}

.select-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  width: 200px;
  text-align: left;
  cursor: pointer;
}

.select-button:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.select-placeholder {
  flex-grow: 1;
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid black;
  margin-left: 8px;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  background-color: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input {
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
  outline: none;
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
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

.option.disabled {
  color: #999;
  cursor: default;
}

.option.disabled:hover {
  background-color: transparent;
}
```

```typescript
export { SearchableSelect };
```

### Tokens: {'input_tokens': 201, 'output_tokens': 1866}
### Execution time: 12.57378888130188
