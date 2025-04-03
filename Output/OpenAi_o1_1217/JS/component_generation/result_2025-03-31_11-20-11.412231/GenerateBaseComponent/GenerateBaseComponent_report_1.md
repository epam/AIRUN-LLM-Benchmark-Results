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
Below is an example implementation of a reusable, accessible, and searchable select component using React 18 and TypeScript. It also includes a sample “index.css” file for basic styling.

-----------------------------------------------------------------------------------
SearchableSelect.tsx
-----------------------------------------------------------------------------------
import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  FocusEvent,
  ChangeEvent,
} from "react";
import "./index.css";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  label?: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  options,
  onChange,
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedValue, setSelectedValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openDropdown = () => {
    setIsOpen(true);
    setHighlightedIndex(-1);
    // Focus on the input when opening
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    setSearchTerm("");
    // Return focus to the main button
    containerRef.current?.focus();
  };

  const handleToggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const handleSelectOption = (value: string) => {
    setSelectedValue(value);
    onChange(value);
    closeDropdown();
  };

  const handleKeyDownButton = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleDropdown();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      openDropdown();
      setHighlightedIndex(0);
    }
  };

  const handleKeyDownList = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= filteredOptions.length ? 0 : nextIndex;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const nextIndex = prevIndex - 1;
        return nextIndex < 0 ? filteredOptions.length - 1 : nextIndex;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        const option = filteredOptions[highlightedIndex];
        handleSelectOption(option.value);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown();
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };

  // Reset highlight when search changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  const ButtonContent = selectedValue
    ? options.find((o) => o.value === selectedValue)?.label || placeholder
    : placeholder;

  return (
    <div
      ref={containerRef}
      className="searchable-select-container"
      tabIndex={0}
      onKeyDown={handleKeyDownButton}
      onFocus={(e: FocusEvent<HTMLDivElement>) => {
        // If focus is gained by tabbing in, do nothing until user presses enter
        if (isOpen) {
          inputRef.current?.focus();
        }
      }}
      role="button"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-label={label || "Searchable select"}
    >
      {label && <label className="searchable-select-label">{label}</label>}

      <div className="searchable-select-value">
        {ButtonContent}
      </div>

      {isOpen && (
        <div className="searchable-select-dropdown" role="listbox">
          <div className="searchable-select-search">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDownList}
              className="searchable-select-input"
              placeholder="Search..."
              aria-label="Search"
            />
          </div>
          <ul className="searchable-select-options">
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={highlightedIndex === index}
                className={`searchable-select-option ${
                  highlightedIndex === index ? "highlighted" : ""
                }`}
                onMouseDown={() => handleSelectOption(option.value)}
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

-----------------------------------------------------------------------------------
index.css
-----------------------------------------------------------------------------------
.searchable-select-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  width: 200px;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  user-select: none;
  background: #fff;
}

.searchable-select-label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
}

.searchable-select-value {
  display: inline-block;
  width: 100%;
}

.searchable-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 999;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  width: 100%;
}

.searchable-select-search {
  padding: 8px;
  border-bottom: 1px solid #ccc;
}

.searchable-select-input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.searchable-select-options {
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.searchable-select-option {
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  background: #fff;
}

.searchable-select-option:hover,
.searchable-select-option.highlighted {
  background: #f0f0f0;
}

.searchable-select-option:last-of-type {
  border-bottom: none;
}

-----------------------------------------------------------------------------------
Example Usage
-----------------------------------------------------------------------------------
import React, { useState } from "react";
import { SearchableSelect } from "./SearchableSelect";

const App: React.FC = () => {
  const [value, setValue] = useState("");

  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Durian", value: "durian" },
    { label: "Elderberry", value: "elderberry" },
  ];

  return (
    <div style={{ padding: 16 }}>
      <SearchableSelect
        label="Select Fruit"
        options={options}
        onChange={(val) => setValue(val)}
        placeholder="Pick a fruit"
      />
      <p>Selected Value: {value}</p>
    </div>
  );
};

export default App;

-----------------------------------------------------------------------------------

Explanation:
• The main component (SearchableSelect) is fully typed with TypeScript.  
• Accessibility is supported through ARIA attributes and keyboard interactions:
  – Press “Enter” or “Space” to open/close dropdown when focused on the container.  
  – Use Up and Down Arrow keys to move through options, pressing “Enter” to select.  
  – Press “Escape” to close the dropdown.  
• The dropdown closes automatically when an option is selected or when the user clicks outside the component.  
• The search input filters the available options in real time.  
• Focus returns to the main container (select element) when the dropdown closes, ensuring keyboard users can continue navigation seamlessly.

### Tokens: {'input_tokens': 289, 'output_tokens': 2962, 'reasoning_tokens': 960}
### Execution time: 65.08559107780457
