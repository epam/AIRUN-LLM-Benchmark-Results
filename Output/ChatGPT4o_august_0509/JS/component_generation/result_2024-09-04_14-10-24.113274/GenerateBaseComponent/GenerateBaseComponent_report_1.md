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
// SelectComponent.tsx
import React, { useState, useRef, useEffect } from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SelectComponentProps {
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const SelectComponent: React.FC<SelectComponentProps> = ({ options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleSelectOption = (option: Option) => {
    setSelectedValue(option.label);
    onChange(option.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        if (isOpen) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        } else {
          handleToggleDropdown();
        }
        break;
      case 'ArrowDown':
        setHighlightedIndex((prevIndex) =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  return (
    <div
      className="select-container"
      ref={selectRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className="select-display"
        onClick={handleToggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selectedValue || placeholder || 'Select an option'}
      </div>
      {isOpen && (
        <div className="dropdown">
          <input
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={inputRef}
            aria-label="Search options"
          />
          <ul className="options-list" role="listbox">
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                className={`option-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => handleSelectOption(option)}
                role="option"
                aria-selected={index === highlightedIndex}
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

export default SelectComponent;
```

```css
/* index.css */
.select-container {
  position: relative;
  width: 200px;
  font-family: Arial, sans-serif;
}

.select-display {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  z-index: 1000;
  margin-top: 4px;
}

.search-input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
}

.options-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 150px;
  overflow-y: auto;
}

.option-item {
  padding: 8px;
  cursor: pointer;
}

.option-item:hover,
.option-item.highlighted {
  background-color: #f0f0f0;
}

.option-item[aria-selected="true"] {
  background-color: #e0e0e0;
}
```

### Tokens: {'input_tokens': 199, 'output_tokens': 1110}
### Execution time: 11.662399053573608
