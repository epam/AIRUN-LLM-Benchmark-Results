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

## Run 5:
### Answer:
```typescript
import React, { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

const SearchableSelect = ({ options, onChange, placeholder, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const newFilteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredOptions(newFilteredOptions);
    } else {
      setFilteredOptions(options);
    }
  }, [debouncedSearchTerm, options]);

  const handleOpen = () => {
    setIsOpen(true);
    selectRef.current?.focus();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    onChange(selectedValue);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "Enter") {
      if (!isOpen) {
        handleOpen();
      } else {
        handleClose();
      }
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <div className="searchable-select">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <select
        ref={selectRef}
        value={value}
        onChange={handleSelect}
        onKeyDown={handleKeyDown}
        onBlur={handleClose}
        open={isOpen}
      >
        {filteredOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchableSelect;
```

```css
.searchable-select {
  position: relative;
  width: 100%;
}

.searchable-select input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.searchable-select select {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  z-index: 99;
}

.searchable-select select option {
  padding: 10px;
}

.searchable-select select option:hover {
  background-color: #eee;
}
```
### Tokens: {'prompt_tokens': 200, 'completion_tokens': 778, 'total_tokens': 978}
### Execution time: 5.769068241119385
