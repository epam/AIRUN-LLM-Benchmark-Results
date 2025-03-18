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
import './index.css';

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  onChange: (value: Option) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  onChange,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex((prevIndex) =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          selectOption(filteredOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.focus();
        break;
      default:
        break;
    }
  };

  const selectOption = (option: Option) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleOptionMouseEnter = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <div className="searchable-select" ref={dropdownRef}>
      <input
        type="text"
        className="searchable-select-input"
        placeholder={placeholder}
        value={selectedOption ? selectedOption.label : searchTerm}
        onClick={() => {
          setIsOpen(true);
          setSearchTerm('');
        }}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
          setFocusedIndex(-1);
        }}
        onKeyDown={handleInputKeyDown}
        ref={inputRef}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        role="combobox"
        aria-autocomplete="list"
      />
      {isOpen && (
        <ul className="searchable-select-dropdown" role="listbox">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                className={`searchable-select-option ${
                  index === focusedIndex ? 'focused' : ''
                }`}
                onClick={() => selectOption(option)}
                onMouseEnter={() => handleOptionMouseEnter(index)}
                role="option"
                aria-selected={selectedOption?.value === option.value}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="searchable-select-no-options">No options found</li>
          )}
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
  width: 250px;
}

.searchable-select-input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.searchable-select-dropdown {
  position: absolute;
  width: 100%;
  max-height: 200px;
  margin-top: 2px;
  background: white;
  border: 1px solid #ccc;
  overflow-y: auto;
  z-index: 1;
  list-style-type: none;
  padding: 0;
}

.searchable-select-option {
  padding: 8px;
  cursor: pointer;
}

.searchable-select-option.focused,
.searchable-select-option:hover {
  background-color: #f0f0f0;
}

.searchable-select-no-options {
  padding: 8px;
  color: #999;
}
```

### Tokens: {'input_tokens': 168, 'output_tokens': 1701, 'reasoning_tokens': 576}
### Execution time: 18.968148231506348
