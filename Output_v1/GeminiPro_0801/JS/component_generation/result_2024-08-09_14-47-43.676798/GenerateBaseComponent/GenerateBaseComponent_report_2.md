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

## Run 2:
### Answer:
```tsx
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
}

const Select: React.FC<Props> = ({ options, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleSelect = (option: Option) => {
    onChange(option.value);
    handleClose();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFocusedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prevIndex) =>
          prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
        break;
      case 'Enter':
        if (isOpen && focusedIndex > -1) {
          e.preventDefault();
          handleSelect(filteredOptions[focusedIndex]);
        } else {
          handleOpen();
        }
        break;
      case 'Escape':
        handleClose();
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="select-container" ref={selectRef} onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="select-input" onClick={handleOpen}>
        {value ? (
          options.find((option) => option.value === value)?.label
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className="arrow-down"></span>
      </div>
      {isOpen && (
        <ul className="dropdown">
          <li className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
            />
          </li>
          {filteredOptions.map((option, index) => (
            <li
              key={option.value}
              className={`option ${focusedIndex === index ? 'focused' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
```

```css
.select-container {
  position: relative;
  display: inline-block;
  width: 200px; /* Adjust width as needed */
  cursor: pointer;
}

.select-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.placeholder {
  color: #999;
}

.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #333;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-box {
  padding: 10px;
}

.search-box input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.option {
  padding: 10px;
}

.option:hover,
.option.focused {
  background-color: #eee;
}
```


### Tokens: {'input_tokens': 199, 'output_tokens': 1267}
### Execution time: 25.737260103225708
