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
// Select.tsx
import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import './index.css';

interface SelectProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  getOptionLabel: (option: T) => string;
  placeholder?: string;
  searchPlaceholder?: string;
  noOptionsMessage?: string;
}

const Select = <T,>({
  options,
  value,
  onChange,
  getOptionLabel,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  noOptionsMessage = 'No options found',
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const filteredOptions = options.filter((option) =>
    getOptionLabel(option).toLowerCase().includes(searchText.toLowerCase())
  );

    const handleOutsideClick = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setSearchText('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
      if (!isOpen) {
          setHighlightedIndex(-1);
          setSearchText("");
          if (selectRef.current) {
              selectRef.current.focus();
          }
      } else {
          if (inputRef.current) {
              inputRef.current.focus();
          }
      }
  }, [isOpen]);

    useEffect(() => {
        if (isOpen && dropdownRef.current && highlightedIndex > -1) {
            const element = dropdownRef.current.children[highlightedIndex] as HTMLLIElement;
            if(element) {
                element.scrollIntoView({ block: 'nearest' });
            }
        }

    }, [highlightedIndex, isOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: T) => {
    onChange(option);
    setIsOpen(false);
    setSearchText('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      toggleDropdown();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchText('');
    }
  };

    const handleDropdownKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlightedIndex((prevIndex) =>
                Math.min(prevIndex + 1, filteredOptions.length - 1)
            );
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (highlightedIndex > -1) {
                handleOptionClick(filteredOptions[highlightedIndex]);
            }
        } else if (event.key === 'Escape') {
            setIsOpen(false);
            setSearchText('');
        }
    };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setHighlightedIndex(-1);
  };

  return (
    <div className="select-container" ref={selectRef} tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="select-value" onClick={toggleDropdown}>
        {value ? getOptionLabel(value) : placeholder}
        <span className={`select-arrow ${isOpen ? 'select-arrow-up' : 'select-arrow-down'}`}></span>
      </div>
      {isOpen && (
        <div className="select-dropdown">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={handleSearchChange}
            className="select-search"
            ref={inputRef}
          />
          <ul className="select-options" ref={dropdownRef} onKeyDown={handleDropdownKeyDown} tabIndex={-1}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={index}
                  className={`select-option ${index === highlightedIndex ? 'highlighted' : ''}`}
                  onClick={() => handleOptionClick(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {getOptionLabel(option)}
                </li>
              ))
            ) : (
              <li className="select-no-options">{noOptionsMessage}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
```

```css
/* index.css */
.select-container {
  position: relative;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
}

.select-value {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-arrow {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #000; /* Default arrow pointing down */
    transition: transform 0.3s ease;
}

.select-arrow-up {
    transform: rotate(180deg);
}

.select-arrow-down {
    transform: rotate(0deg);
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: white;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
}

.select-search {
  width: calc(100% - 16px);
  padding: 8px;
  margin: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.select-options {
  list-style: none;
  padding: 0;
  margin: 0;
    outline: none;
}

.select-option {
  padding: 8px 12px;
  cursor: pointer;
}

.select-option:hover, .highlighted {
  background-color: #f0f0f0;
}

.select-no-options {
  padding: 8px 12px;
  color: #999;
}
```

```typescript
// Example usage in App.tsx (or any other parent component)
import React, { useState } from 'react';
import Select from './Select'; // Adjust the import path as necessary
import './index.css';

interface Option {
    id: number;
    name: string;
}

const App: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const options: Option[] = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
        { id: 3, name: 'Option 3' },
        { id: 4, name: 'Another Option' },
        { id: 5, name: 'Last Option' },
    ];

    const handleSelectChange = (option: Option | null) => {
        setSelectedOption(option);
    };

    return (
        <div>
            <Select
                options={options}
                value={selectedOption}
                onChange={handleSelectChange}
                getOptionLabel={(option) => option.name}
                placeholder="Choose an option"
                searchPlaceholder="Search options..."
                noOptionsMessage="No options available."
            />
            {selectedOption && <p>Selected: {selectedOption.name}</p>}
        </div>
    );
};

export default App;

```


### Tokens: {'input_tokens': 201, 'output_tokens': 2141}
### Execution time: 19.669811964035034
