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
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        if (isOpen) {
          if (highlightedIndex >= 0) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          } else {
            handleToggleDropdown();
          }
        } else {
          handleToggleDropdown();
        }
        break;
      case 'ArrowDown':
        if (isOpen) {
          setHighlightedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        } else {
          handleToggleDropdown();
        }
        break;
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex(prev => Math.max(prev - 1, 0));
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="searchable-select" ref={selectRef} tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="select-input" onClick={handleToggleDropdown}>
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <div className="dropdown">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search..."
            autoFocus
          />
          <ul>
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelectOption(option)}
                className={highlightedIndex === index ? 'highlighted' : ''}
                onMouseEnter={() => setHighlightedIndex(index)}
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

```css
/* index.css */
.searchable-select {
  position: relative;
  width: 200px;
}

.select-input {
  border: 1px solid #ccc;
  padding: 8px;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  background: white;
  z-index: 1000;
}

.dropdown input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown li {
  padding: 8px;
  cursor: pointer;
}

.dropdown li.highlighted {
  background-color: #f0f0f0;
}
```

### Tokens: {'input_tokens': 199, 'output_tokens': 916}
### Execution time: 17.714824199676514
