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

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  onChange: (option: Option | null) => void;
  value: Option | null;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
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

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleSelect = (option: Option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleToggle();
    }
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div 
      ref={selectRef} 
      className="searchable-select" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
      onFocus={() => setIsOpen(true)}
    >
      <div className="select-input" onClick={handleToggle}>
        {value ? value.label : 'Select...'}
      </div>
      {isOpen && (
        <div className="dropdown">
          <input 
            type="text" 
            className="search-input" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search..."
          />
          <ul className="options-list">
            {filteredOptions.map(option => (
              <li 
                key={option.value} 
                className="option" 
                onClick={() => handleSelect(option)} 
                onKeyDown={(event) => event.key === 'Enter' && handleSelect(option)}
                tabIndex={0}
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
  display: inline-block;
  width: 200px;
}

.select-input {
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  user-select: none;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  background: white;
  z-index: 100;
}

.search-input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 150px;
  overflow-y: auto;
}

.option {
  padding: 10px;
  cursor: pointer;
}

.option:hover,
.option:focus {
  background-color: #e6e6e6;
}
```

### Tokens: {'input_tokens': 199, 'output_tokens': 855, 'reasoning_tokens': 0}
### Execution time: 13.310420036315918
