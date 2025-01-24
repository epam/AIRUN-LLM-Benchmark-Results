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
index.css
----------
.searchable-select-container {
  position: relative;
  display: inline-block;
  font-family: sans-serif;
}

.searchable-select-label {
  margin-bottom: 4px;
  display: block;
}

.searchable-select-toggle {
  width: 200px;
  padding: 8px;
  cursor: pointer;
}

.searchable-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background: #fff;
  border: 1px solid #ccc;
  z-index: 999;
  box-sizing: border-box;
}

.searchable-select-search {
  width: 100%;
  box-sizing: border-box;
  padding: 8px;
  border: none;
  outline: none;
}

.searchable-select-list {
  max-height: 150px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.searchable-select-list-item {
  width: 100%;
  padding: 8px;
  cursor: pointer;
}

.searchable-select-list-item:hover,
.searchable-select-list-item.highlighted {
  background-color: #f0f0f0;
}

--------------------------------------------------------------------------------

SearchableSelect.tsx
--------------------
import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  FocusEvent,
  MouseEvent
} from "react";

type SearchableSelectProps = {
  label?: string;
  items: string[];
  onChange?: (value: string) => void;
};

export function SearchableSelect({ label, items, onChange }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent<Document>) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setHighlightedIndex(0);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else if (toggleButtonRef.current) {
      toggleButtonRef.current.focus();
    }
  }, [isOpen]);

  function toggleDropdown() {
    setIsOpen(prev => !prev);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev < filteredItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev > 0 ? prev - 1 : filteredItems.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        selectItem(filteredItems[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  }

  function selectItem(item: string) {
    setSelectedItem(item);
    if (onChange) {
      onChange(item);
    }
    setIsOpen(false);
  }

  function handleItemClick(item: string) {
    selectItem(item);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setHighlightedIndex(0);
  }

  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  }

  return (
    <div
      className="searchable-select-container"
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      ref={containerRef}
    >
      {label && <label className="searchable-select-label">{label}</label>}
      <button
        ref={toggleButtonRef}
        className="searchable-select-toggle"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
      >
        {selectedItem || "Select..."}
      </button>
      {isOpen && (
        <div className="searchable-select-dropdown">
          <input
            ref={searchInputRef}
            className="searchable-select-search"
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search"
          />
          <ul role="listbox" className="searchable-select-list">
            {filteredItems.map((item, index) => (
              <li
                key={item}
                onClick={() => handleItemClick(item)}
                className={
                  "searchable-select-list-item" +
                  (index === highlightedIndex ? " highlighted" : "")
                }
                role="option"
                aria-selected={selectedItem === item}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

### Tokens: {'input_tokens': 198, 'output_tokens': 2593, 'reasoning_tokens': 1344}
### Execution time: 30.59890103340149
