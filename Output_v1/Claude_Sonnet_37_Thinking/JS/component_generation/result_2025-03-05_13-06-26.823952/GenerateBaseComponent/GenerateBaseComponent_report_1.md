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
### Thoughts:
Let's approach this systematically. I need to create a searchable select component in React 18.x with TypeScript that supports accessibility features.

Here's what I'll be creating:
1. A `SearchableSelect` component file (`SearchableSelect.tsx`)
2. A CSS file (`index.css`)

Let's start with the component structure:

```tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (selectedOption: Option | null) => void;
  value?: Option | null;
  className?: string;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  value = null,
  className = '',
  disabled = false,
}) => {
  // State and refs go here
  
  // Component logic here
  
  // Render function here
};

export default SearchableSelect;
```

Now, let's think about the state and refs we'll need:

- `isOpen`: To track if the dropdown is open
- `searchValue`: To track the search input value
- `filteredOptions`: To store the filtered options based on search
- `highlightedIndex`: To track the currently highlighted option for keyboard navigation
- `selectRef`: To reference the select component for focus management
- `dropdownRef`: To reference the dropdown for detecting clicks outside

Let's add these to our component:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [searchValue, setSearchValue] = useState('');
const [highlightedIndex, setHighlightedIndex] = useState(-1);
const selectRef = useRef<HTMLDivElement>(null);
const dropdownRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLInputElement>(null);

// Compute filtered options based on search value
const filteredOptions = options.filter(option =>
  option.label.toLowerCase().includes(searchValue.toLowerCase())
);
```

Now, let's implement the key handlers for keyboard navigation and selection:

```tsx
const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
  if (disabled) return;

  switch (event.key) {
    case 'Enter':
      if (!isOpen) {
        setIsOpen(true);
        setSearchValue('');
        // If we're opening the dropdown, prevent form submission
        event.preventDefault();
      } else if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        // Select the highlighted option
        onChange(filteredOptions[highlightedIndex]);
        setIsOpen(false);
        setSearchValue('');
        setHighlightedIndex(-1);
        event.preventDefault();
      }
      break;
    
    case 'Escape':
      if (isOpen) {
        setIsOpen(false);
        setSearchValue('');
        setHighlightedIndex(-1);
        selectRef.current?.focus();
        event.preventDefault();
      }
      break;
    
    case 'ArrowDown':
      if (isOpen) {
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        event.preventDefault();
      } else {
        setIsOpen(true);
        setSearchValue('');
        event.preventDefault();
      }
      break;
    
    case 'ArrowUp':
      if (isOpen) {
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        event.preventDefault();
      }
      break;
    
    default:
      break;
  }
};
```

Next, let's handle clicks outside the dropdown to close it:

```tsx
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      isOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setSearchValue('');
      setHighlightedIndex(-1);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [isOpen]);
```

Now, let's implement the render function to display our component:

```tsx
return (
  <div 
    className={`searchable-select ${className} ${disabled ? 'disabled' : ''}`}
    ref={selectRef}
    tabIndex={disabled ? -1 : 0}
    onKeyDown={handleKeyDown}
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    aria-controls="searchable-select-listbox"
    role="combobox"
  >
    <div 
      className="select-value" 
      onClick={() => {
        if (!disabled) {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSearchValue('');
            setHighlightedIndex(-1);
          }
        }
      }}
    >
      {value ? value.label : placeholder}
    </div>
    
    {isOpen && (
      <div className="dropdown" ref={dropdownRef}>
        <div className="search-container">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setHighlightedIndex(-1);
            }}
            placeholder="Search..."
            autoFocus
            aria-autocomplete="list"
            aria-controls="searchable-select-listbox"
          />
        </div>
        
        <ul 
          className="options-list"
          id="searchable-select-listbox"
          role="listbox"
          aria-label="Options"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                className={`option ${index === highlightedIndex ? 'highlighted' : ''} ${
                  value && value.value === option.value ? 'selected' : ''
                }`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setSearchValue('');
                  setHighlightedIndex(-1);
                  selectRef.current?.focus();
                }}
                role="option"
                aria-selected={value && value.value === option.value}
                id={`option-${option.value}`}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="no-options">No options found</li>
          )}
        </ul>
      </div>
    )}
  </div>
);
```

Now, let's focus on the CSS file (`index.css`):

```css
.searchable-select {
  position: relative;
  width: 100%;
  max-width: 300px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  outline: none;
}

.searchable-select:focus {
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.searchable-select.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-value {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  min-height: 20px;
  transition: border-color 0.2s;
}

.searchable-select:not(.disabled) .select-value:hover {
  border-color: #aaa;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 4px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-container {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #0077ff;
}

.options-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 240px;
  overflow-y: auto;
}

.option {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.option:hover {
  background-color: #f5f5f5;
}

.option.highlighted {
  background-color: #e6f7ff;
}

.option.selected {
  background-color: #f0f7ff;
  font-weight: 500;
}

.no-options {
  padding: 10px;
  color: #999;
  text-align: center;
  font-style: italic;
}
```

Let's review the requirements to make sure I've covered everything:

1. ✅ Use TypeScript to create the component.
2. ✅ Search feature in the dropdown.
3. ✅ Navigable via keyboard and select items on Enter key.
4. ✅ Dropdown list opens when Enter is pressed.
5. ✅ Focus returns to the select component after closing the dropdown.
6. ✅ Dropdown closes upon:
   - ✅ Selecting an item (via keyboard or mouse)
   - ✅ Pressing Esc
   - ✅ Clicking outside
7. ✅ Provided index.css file.
8. ✅ No TODOs in the code.

I think I've covered all the requirements. Let me merge all the component code together for the final solution:

The `SearchableSelect.tsx` file would be:

```tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (selectedOption: Option | null) => void;
  value?: Option | null;
  className?: string;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  value = null,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute filtered options based on search value
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
        if (!isOpen) {
          setIsOpen(true);
          setSearchValue('');
          // If we're opening the dropdown, prevent form submission
          event.preventDefault();
        } else if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          // Select the highlighted option
          onChange(filteredOptions[highlightedIndex]);
          setIsOpen(false);
          setSearchValue('');
          setHighlightedIndex(-1);
          event.preventDefault();
        }
        break;
      
      case 'Escape':
        if (isOpen) {
          setIsOpen(false);
          setSearchValue('');
          setHighlightedIndex(-1);
          selectRef.current?.focus();
          event.preventDefault();
        }
        break;
      
      case 'ArrowDown':
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          event.preventDefault();
        } else {
          setIsOpen(true);
          setSearchValue('');
          event.preventDefault();
        }
        break;
      
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
          event.preventDefault();
        }
        break;
      
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchValue('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus the search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div 
      className={`searchable-select ${className} ${disabled ? 'disabled' : ''}`}
      ref={selectRef}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="searchable-select-listbox"
      role="combobox"
    >
      <div 
        className="select-value" 
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setSearchValue('');
              setHighlightedIndex(-1);
            }
          }
        }}
      >
        {value ? value.label : placeholder}
      </div>
      
      {isOpen && (
        <div className="dropdown" ref={dropdownRef}>
          <div className="search-container">
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setHighlightedIndex(-1);
              }}
              placeholder="Search..."
              autoFocus
              aria-autocomplete="list"
              aria-controls="searchable-select-listbox"
            />
          </div>
          
          <ul 
            className="options-list"
            id="searchable-select-listbox"
            role="listbox"
            aria-label="Options"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  className={`option ${index === highlightedIndex ? 'highlighted' : ''} ${
                    value && value.value === option.value ? 'selected' : ''
                  }`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchValue('');
                    setHighlightedIndex(-1);
                    selectRef.current?.focus();
                  }}
                  role="option"
                  aria-selected={value && value.value === option.value}
                  id={`option-${option.value}`}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="no-options">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
```

I think this component covers all the requirements and provides a good accessible searchable select implementation with keyboard navigation support.

### Answer:
```tsx
// SearchableSelect.tsx
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './index.css';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (selectedOption: Option | null) => void;
  value?: Option | null;
  className?: string;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  value = null,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
        if (!isOpen) {
          setIsOpen(true);
          setSearchValue('');
          event.preventDefault();
        } else if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          onChange(filteredOptions[highlightedIndex]);
          setIsOpen(false);
          setSearchValue('');
          setHighlightedIndex(-1);
          event.preventDefault();
        }
        break;
      
      case 'Escape':
        if (isOpen) {
          setIsOpen(false);
          setSearchValue('');
          setHighlightedIndex(-1);
          selectRef.current?.focus();
          event.preventDefault();
        }
        break;
      
      case 'ArrowDown':
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          event.preventDefault();
        } else {
          setIsOpen(true);
          setSearchValue('');
          event.preventDefault();
        }
        break;
      
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
          event.preventDefault();
        }
        break;
      
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchValue('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div 
      className={`searchable-select ${className} ${disabled ? 'disabled' : ''}`}
      ref={selectRef}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="searchable-select-listbox"
      role="combobox"
    >
      <div 
        className="select-value" 
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setSearchValue('');
              setHighlightedIndex(-1);
            }
          }
        }}
      >
        {value ? value.label : placeholder}
      </div>
      
      {isOpen && (
        <div className="dropdown" ref={dropdownRef}>
          <div className="search-container">
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setHighlightedIndex(-1);
              }}
              placeholder="Search..."
              autoFocus
              aria-autocomplete="list"
              aria-controls="searchable-select-listbox"
            />
          </div>
          
          <ul 
            className="options-list"
            id="searchable-select-listbox"
            role="listbox"
            aria-label="Options"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  className={`option ${index === highlightedIndex ? 'highlighted' : ''} ${
                    value && value.value === option.value ? 'selected' : ''
                  }`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchValue('');
                    setHighlightedIndex(-1);
                    selectRef.current?.focus();
                  }}
                  role="option"
                  aria-selected={value && value.value === option.value}
                  id={`option-${option.value}`}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="no-options">No options found</li>
            )}
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
  width: 100%;
  max-width: 300px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  outline: none;
}

.searchable-select:focus {
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.searchable-select.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-value {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  min-height: 20px;
  transition: border-color 0.2s;
}

.searchable-select:not(.disabled) .select-value:hover {
  border-color: #aaa;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 4px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-container {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #0077ff;
}

.options-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 240px;
  overflow-y: auto;
}

.option {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.option:hover {
  background-color: #f5f5f5;
}

.option.highlighted {
  background-color: #e6f7ff;
}

.option.selected {
  background-color: #f0f7ff;
  font-weight: 500;
}

.no-options {
  padding: 10px;
  color: #999;
  text-align: center;
  font-style: italic;
}
```

### Tokens: {'input_tokens': 244, 'output_tokens': 6603}
### Execution time: 70.9950258731842
