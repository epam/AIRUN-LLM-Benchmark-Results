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
import './index.css';

export interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);
  
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

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
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleOptionSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
    if (selectRef.current) {
      selectRef.current.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
        if (!isOpen) {
          setIsOpen(true);
        } else if (filteredOptions.length > 0) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        event.preventDefault();
        break;
      case 'Escape':
        if (isOpen) {
          setIsOpen(false);
          if (selectRef.current) {
            selectRef.current.focus();
          }
        }
        event.preventDefault();
        break;
      case 'ArrowDown':
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          event.preventDefault();
        } else {
          setIsOpen(true);
          event.preventDefault();
        }
        break;
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
          event.preventDefault();
        }
        break;
      case ' ':
        if (!isOpen) {
          setIsOpen(true);
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  const handleSearchInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || 
        event.key === 'Enter' || event.key === 'Escape') {
      handleKeyDown(event as unknown as KeyboardEvent<HTMLDivElement>);
    }
  };

  useEffect(() => {
    if (isOpen && optionsRef.current && highlightedIndex >= 0) {
      const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div 
      className={`searchable-select ${className} ${disabled ? 'disabled' : ''}`}
      ref={selectRef}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-disabled={disabled}
      role="combobox"
      id={id}
    >
      <div 
        className="select-trigger" 
        onClick={handleToggle}
        aria-label={placeholder}
      >
        <span className="select-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`select-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      
      {isOpen && (
        <div className="select-dropdown">
          <div className="search-container">
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchInputKeyDown}
              aria-autocomplete="list"
              aria-controls="options-list"
            />
          </div>
          
          <div 
            className="options-container" 
            ref={optionsRef}
            role="listbox"
            id="options-list"
            aria-label="Options"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`option ${value === option.value ? 'selected' : ''} ${
                    index === highlightedIndex ? 'highlighted' : ''
                  }`}
                  onClick={() => handleOptionSelect(option)}
                  role="option"
                  aria-selected={value === option.value}
                  id={`option-${option.value}`}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="no-options">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
```

```css
/* index.css */
.searchable-select {
  position: relative;
  width: 100%;
  max-width: 300px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  outline: none;
}

.searchable-select.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  min-height: 20px;
}

.searchable-select:focus .select-trigger {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.searchable-select.disabled .select-trigger {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.select-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
}

.select-arrow {
  font-size: 10px;
  transition: transform 0.2s ease;
  color: #666;
}

.select-arrow.open {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin-top: 4px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #4a90e2;
}

.options-container {
  overflow-y: auto;
  max-height: 240px;
}

.option {
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.option:hover {
  background-color: #f5f5f5;
}

.option.selected {
  background-color: #e6f7ff;
  font-weight: 500;
}

.option.highlighted {
  background-color: #f0f0f0;
}

.no-options {
  padding: 10px 14px;
  color: #999;
  text-align: center;
  font-style: italic;
}
```

### Tokens: {'input_tokens': 215, 'output_tokens': 2605}
### Execution time: 30.62668514251709
