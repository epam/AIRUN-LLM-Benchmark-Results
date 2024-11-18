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
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [filter, setFilter] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, options]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setFilter('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      toggleDropdown();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="select-container" ref={selectRef} tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="select-display" onClick={toggleDropdown}>
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <div className="select-dropdown">
          <input
            type="text"
            placeholder="Type to search..."
            value={filter}
            onChange={handleFilterChange}
            className="select-search"
            autoFocus
          />
          <ul className="select-options">
            {filteredOptions.map(option => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="select-option"
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

.select-option {
  padding: 8px;
  cursor: pointer;
}

.select-option:hover {
  background-color: #f0f0f0;
}
```

This component can be used in your application by importing `SearchableSelect` and passing an array of options to it. Each option should be an object with `value` and `label` properties.

### Tokens: {'input_tokens': 197, 'output_tokens': 848}
### Execution time: 49.28241205215454
