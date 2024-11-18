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
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  name,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        selectRef.current?.focus();
      } else if (event.key === "Enter") {
        const selectedOption = filteredOptions.find(
          (option) => option.value === value
        );
        if (selectedOption) {
          onChange(selectedOption.value);
          setIsOpen(false);
          selectRef.current?.focus();
        }
      } else if (event.key === "ArrowDown") {
        const nextIndex =
          filteredOptions.findIndex((option) => option.value === value) + 1;
        if (nextIndex < filteredOptions.length) {
          setValue(filteredOptions[nextIndex].value);
        }
      } else if (event.key === "ArrowUp") {
        const prevIndex =
          filteredOptions.findIndex((option) => option.value === value) - 1;
        if (prevIndex >= 0) {
          setValue(filteredOptions[prevIndex].value);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, filteredOptions, value, onChange]);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    );
  }, [debouncedSearchTerm, options]);

  const setValue = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="searchable-select">
      <label htmlFor={name}>{label}</label>
      <div className="select-wrapper" onClick={toggleOpen}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={disabled}
        />
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 5L10.5 9.5L11.92 8.08L7.42 3.58L2.92 8.08L4.34 9.5L6 5Z"
            fill="#888"
          />
        </svg>
      </div>
      {isOpen && (
        <ul className="options-list">
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              className={option.value === value ? "active" : ""}
              onClick={() => setValue(option.value)}
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

```css
.searchable-select {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.select-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.select-wrapper:hover {
  border-color: #888;
}

.select-wrapper input {
  width: 100%;
  padding: 5px;
  border: none;
  outline: none;
}

.select-wrapper svg {
  width: 12px;
  height: 12px;
  fill: #888;
}

.options-list {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.options-list li {
  padding: 5px 10px;
  cursor: pointer;
}

.options-list li:hover {
  background-color: #f5f5f5;
}

.options-list li.active {
  background-color: #888;
  color: #fff;
}
```
### Tokens: {'prompt_tokens': 226, 'completion_tokens': 1339, 'total_tokens': 1565}
### Execution time: 9.116852045059204

