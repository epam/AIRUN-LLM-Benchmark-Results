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
Here's the implementation of a searchable select component with accessibility support in React 18.x using TypeScript:

SearchableSelect.tsx:

```typescript
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  onChange: (selectedOption: Option | null) => void;
  placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  onChange,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

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

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
    selectRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        if (!isOpen) {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        selectRef.current?.focus();
        break;
      case 'ArrowDown':
        if (isOpen && listRef.current) {
          event.preventDefault();
          const firstOption = listRef.current.querySelector('li');
          (firstOption as HTMLElement)?.focus();
        }
        break;
    }
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent, option: Option) => {
    switch (event.key) {
      case 'Enter':
        handleSelect(option);
        break;
      case 'Escape':
        setIsOpen(false);
        selectRef.current?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevSibling = (event.target as HTMLElement).previousElementSibling;
        if (prevSibling) {
          (prevSibling as HTMLElement).focus();
        } else {
          inputRef.current?.focus();
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        const nextSibling = (event.target as HTMLElement).nextElementSibling;
        if (nextSibling) {
          (nextSibling as HTMLElement).focus();
        }
        break;
    }
  };

  return (
    <div
      className="searchable-select"
      ref={selectRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="select-header" onClick={handleToggle}>
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <div className="select-dropdown">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul ref={listRef}>
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => handleOptionKeyDown(e, option)}
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
```

index.css:

```css
.searchable-select {
  position: relative;
  width: 200px;
}

.select-header {
  border: 1px solid #ccc;
  padding: 8px;
  cursor: pointer;
  background-color: #fff;
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  background-color: #fff;
  z-index: 1;
}

.select-dropdown input {
  width: 100%;
  padding: 8px;
  border: none;
  border-bottom: 1px solid #ccc;
}

.select-dropdown ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}

.select-dropdown li {
  padding: 8px;
  cursor: pointer;
}

.select-dropdown li:hover,
.select-dropdown li:focus {
  background-color: #f0f0f0;
}
```

### Tokens: {'input_tokens': 215, 'output_tokens': 1484}
### Execution time: 23.27209496498108
