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
**SearchableSelect.tsx**
```typescript
import React, { useState, useRef, useEffect } from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [focusedOption, setFocusedOption] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleEnterKey = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else if (focusedOption !== -1) {
      onChange(options[focusedOption].value);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        handleEnterKey();
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        setFocusedOption((prevFocusedOption) => {
          if (prevFocusedOption < options.length - 1) {
            return prevFocusedOption + 1;
          }
          return 0;
        });
        break;
      case 'ArrowUp':
        setFocusedOption((prevFocusedOption) => {
          if (prevFocusedOption > 0) {
            return prevFocusedOption - 1;
          }
          return options.length - 1;
        });
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div ref={selectRef} className="searchable-select">
      <input
        ref={inputRef}
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      />
      {isOpen && (
        <ul ref={listRef} className="options-list">
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              className={`option ${focusedOption === index ? 'focused' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
```

**index.css**
```css
.searchable-select {
  position: relative;
}

.searchable-select input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.searchable-select input:focus {
  outline: none;
  border-color: #aaa;
}

.options-list {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.option {
  padding: 10px;
  cursor: pointer;
}

.option.focused {
  background-color: #f0f0f0;
}

.option:hover {
  background-color: #f0f0f0;
}
```
Note: You can adjust the styles as per your requirement.

### Tokens: {'input_tokens': 201, 'output_tokens': 871}
### Execution time: 13.413550853729248
