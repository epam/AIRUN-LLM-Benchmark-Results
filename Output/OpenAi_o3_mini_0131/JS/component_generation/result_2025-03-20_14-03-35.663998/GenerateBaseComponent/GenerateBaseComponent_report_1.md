Your task is to create a general component on React 18.x.
You should create a searchable select component with accessibility support.

Please follow these instructions:

1. Technology Requirements:
   - Implement using React 18.x
   - Use TypeScript for all component code
   - Include an index.css file for styling

2. Core Component Functionality:
   - Create a searchable dropdown select component
   - Implement search functionality within the dropdown
   - Support single item selection

3. Accessibility Requirements:
   - Ensure full keyboard navigation throughout the component
   - Support selection of items using the Enter key
   - Toggle dropdown visibility using the Enter key
   - Return focus to the select component when dropdown closes

4. Dropdown Behavior:
   - Close dropdown when an item is selected (via keyboard or mouse)
   - Close dropdown when the Escape key is pressed
   - Close dropdown when clicking outside the component
   - Open dropdown on Enter key press when component is focused

5. Code Quality Standards:
   - Produce production-ready, clean code
   - Include proper TypeScript typing throughout
   - Avoid TODO comments or placeholder code
   - Ensure component is reusable across different contexts
## Run 1:
### Answer:
Below is an example of a production-ready, reusable searchable select component written in React 18.x using TypeScript. It supports full keyboard navigation and meets the outlined accessibility and behavior requirements. You can copy these files into your project.

──────────────────────────────────────────────
File: SearchableSelect.tsx
──────────────────────────────────────────────
import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import './index.css';

export interface Option {
  label: string;
  value: string;
}

export interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onSelect: (option: Option) => void;
  selected?: Option;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = 'Select...',
  onSelect,
  selected,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  const openDropdown = () => {
    setIsOpen(true);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setQuery('');
    setHighlightedIndex(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelect = (option: Option) => {
    onSelect(option);
    closeDropdown();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else {
        if (filteredOptions.length > 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        openDropdown();
      } else {
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (isOpen) {
        closeDropdown();
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHighlightedIndex(0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          closeDropdown();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="searchable-select" ref={containerRef}>
      <div className="select-input-wrapper">
        <input
          type="text"
          ref={inputRef}
          className="select-input"
          placeholder={selected ? selected.label : placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={openDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls="select-listbox"
          role="combobox"
          readOnly={isOpen ? undefined : true} // When not open, make input readOnly so that Enter opens drop-down.
        />
      </div>
      {isOpen && (
        <ul role="listbox" id="select-listbox" className="select-dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={selected?.value === option.value}
                className={`select-option ${
                  index === highlightedIndex ? 'highlighted' : ''
                }`}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="select-option no-results" role="option">
              No results found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

──────────────────────────────────────────────
File: index.css
──────────────────────────────────────────────
.searchable-select {
  position: relative;
  width: 250px;
  font-family: Arial, sans-serif;
}

.select-input-wrapper {
  width: 100%;
}

.select-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.select-dropdown {
  position: absolute;
  z-index: 1000;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.select-option {
  padding: 8px;
  cursor: pointer;
}

.select-option:hover,
.select-option.highlighted {
  background-color: #f0f0f0;
}

.select-option.no-results {
  text-align: center;
  color: #999;
}

──────────────────────────────────────────────
Usage Example:

import React, { useState } from 'react';
import { SearchableSelect, Option } from './SearchableSelect';

function App() {
  const options: Option[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Elderberry', value: 'elderberry' }
  ];

  const [selectedOption, setSelectedOption] = useState<Option | undefined>(undefined);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <h1>Searchable Select Demo</h1>
      <SearchableSelect
        options={options}
        selected={selectedOption}
        onSelect={handleSelect}
        placeholder="Select a fruit..."
      />
    </div>
  );
}

export default App;

──────────────────────────────────────────────
This component is fully accessible:  
• It supports keyboard navigation (ArrowUp, ArrowDown, Enter, and Escape).  
• It toggles the dropdown on focus and with Enter.  
• It closes the dropdown on option selection, when Escape is pressed, or when clicking outside.  
• The focus is returned to the input element after closing the dropdown.  

You can integrate this component into any React 18.x project with TypeScript.

### Tokens: {'input_tokens': 289, 'output_tokens': 1913, 'reasoning_tokens': 320}
### Execution time: 22.95095205307007
