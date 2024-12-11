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
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

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

  return (
    <div ref={selectRef} className="select-container">
      <div className="select-input" onClick={() => setIsOpen(!isOpen)} onKeyDown={handleKeyDown} tabIndex={0}>
        {selectedOption ? selectedOption.label : 'Select an option'}
      </div>
      {isOpen && (
        <div className="dropdown">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
          />
          <ul>
            {filteredOptions.map(option => (
              <li key={option.value} onClick={() => handleSelect(option)} tabIndex={0}>
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

// index.css
/*
.select-container {
  position: relative;
}

.select-input {
  border: 1px solid #ccc;
  padding: 8px;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 1;
}

.dropdown input {
  width: 100%;
  padding: 8px;
  border: none;
}

.dropdown ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.dropdown li {
  padding: 8px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0;
}
*/
```

### Tokens: {'input_tokens': 188, 'output_tokens': 628}
### Execution time: 9.54128885269165
