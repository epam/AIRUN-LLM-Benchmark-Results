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
// SearchableSelect.tsx
import React, { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

interface SearchableSelectProps {
  options: Option[];
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  onChange,
  placeholder = "Select..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        containerRef.current.focus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    onChange && onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
    containerRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      } else {
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          e.preventDefault();
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
      }
    } else if (e.key === "Escape") {
      if (isOpen) {
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        containerRef.current?.focus();
      }
    } else if (e.key === "ArrowDown") {
      if (isOpen) {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev + 1;
          return nextIndex >= filteredOptions.length ? 0 : nextIndex;
        });
      }
    } else if (e.key === "ArrowUp") {
      if (isOpen) {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const nextIndex = prev - 1;
          return nextIndex < 0 ? filteredOptions.length - 1 : nextIndex;
        });
      }
    }
  };

  return (
    <div
      className="select-container"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={containerRef}
    >
      <div
        className="selected-value"
        onClick={handleToggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <div className="dropdown">
          <input
            type="text"
            ref={searchInputRef}
            className="input-search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={(e) => {
              if (
                e.key === "ArrowDown" ||
                e.key === "ArrowUp" ||
                e.key === "Enter" ||
                e.key === "Escape"
              ) {
                e.stopPropagation();
              }
            }}
          />
          <ul role="listbox" className="options-list">
            {filteredOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={selectedOption?.value === option.value}
                className={`option ${
                  index === highlightedIndex ? "option--highlighted" : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => handleOptionSelect(option)}
              >
                {option.label}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="option no-option" role="option">
                No options found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { SearchableSelect } from "./SearchableSelect";
import "./index.css";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" }
];

const App = () => {
  return (
    <div className="app">
      <h1>Searchable Select Demo</h1>
      <SearchableSelect
        options={options}
        onChange={(value) => console.log("Selected:", value)}
        placeholder="Choose an option"
      />
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);

// index.css
.app {
  font-family: Arial, sans-serif;
  margin: 40px;
}

.select-container {
  position: relative;
  display: inline-block;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  width: 200px;
}

.selected-value {
  padding: 4px;
}

.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-search {
  width: calc(100% - 16px);
  margin: 8px;
  padding: 4px;
  box-sizing: border-box;
}

.options-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 150px;
  overflow-y: auto;
}

.option {
  padding: 8px;
  cursor: pointer;
}

.option--highlighted {
  background-color: #f0f0f0;
}

.no-option {
  padding: 8px;
  color: #888;
}

### Tokens: {'input_tokens': 198, 'output_tokens': 4237, 'reasoning_tokens': 2624}
### Execution time: 21.67955183982849
