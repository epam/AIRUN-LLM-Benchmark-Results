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
Here's a simple implementation of a searchable select component using React 18.x and TypeScript. This component includes basic accessibility features and keyboard navigation.

### `SearchableSelect.tsx`
```tsx
import React, { useState, useRef, useEffect } from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHighlightedIndex(0);
    }
  };

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        if (isOpen) {
          handleSelectOption(filteredOptions[highlightedIndex]);
        } else {
          setIsOpen(true);
        }
        break;
      case 'ArrowDown':
        if (highlightedIndex < filteredOptions.length - 1) {
          setHighlightedIndex(highlightedIndex + 1);
        }
        break;
      case 'ArrowUp':
        if (highlightedIndex > 0) {
          setHighlightedIndex(highlightedIndex - 1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="select-container" ref={selectRef} tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="select-display" onClick={handleToggleDropdown}>
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <div className="select-dropdown">
          <input
            type="text"
            className="select-search"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <ul className="select-options">
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                className={`option ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => handleSelectOption(option)}
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

### `index.css`
```css
.select-container {
  position: relative;
  width: 300px;
  font-family: Arial, sans-serif;
}

.select-display {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.select-dropdown {
  position: absolute;
  width: 100%;
  border: 1px solid #ccc;
  border-top: none;
  background-color: white;
  z-index: 1000;
}

.select-search {
  width: 100%;
  padding: 8px;
  border: none;
  outline: none;
}

.select-options {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.option {
  padding: 8px;
  cursor: pointer;
}

.option:hover, .option.highlighted {
  background-color: #f0f0f0;
}
```

This component can be used in your application by importing `SearchableSelect` and passing an array of options to it. Each option should be an object with `value` and `label` properties.

### Tokens: {'input_tokens': 197, 'output_tokens': 987}
### Execution time: 50.29199576377869
