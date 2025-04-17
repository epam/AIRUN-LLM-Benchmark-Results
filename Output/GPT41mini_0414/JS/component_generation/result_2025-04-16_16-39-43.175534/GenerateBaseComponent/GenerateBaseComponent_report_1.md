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
```tsx
// Select.tsx
import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  FocusEvent,
} from "react";
import "./index.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  id,
  name,
  disabled = false,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Filter options based on search term (case insensitive)
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find selected option label
  const selectedOption = options.find((opt) => opt.value === value);

  // Open dropdown and reset highlight on open
  const openDropdown = () => {
    if (disabled) return;
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  // Close dropdown and reset search and highlight
  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
    // Return focus to input (the "select" control)
    inputRef.current?.focus();
  };

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    if (disabled) return;
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  // Handle keyboard navigation and selection
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          setHighlightedIndex((prev) => {
            const next = prev + 1;
            return next >= filteredOptions.length ? 0 : next;
          });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          setHighlightedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? filteredOptions.length - 1 : next;
          });
        }
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen) {
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            const option = filteredOptions[highlightedIndex];
            onChange(option.value);
            closeDropdown();
          }
        } else {
          openDropdown();
        }
        break;
      case "Escape":
        if (isOpen) {
          e.preventDefault();
          closeDropdown();
        }
        break;
      default:
        break;
    }
  };

  // Handle input change for search
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(0);
    if (!isOpen) {
      openDropdown();
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          closeDropdown();
        }
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const listbox = listboxRef.current;
      const item = listbox.children[highlightedIndex] as HTMLElement | undefined;
      if (item) {
        const itemTop = item.offsetTop;
        const itemBottom = itemTop + item.offsetHeight;
        const listTop = listbox.scrollTop;
        const listBottom = listTop + listbox.clientHeight;
        if (itemTop < listTop) {
          listbox.scrollTop = itemTop;
        } else if (itemBottom > listBottom) {
          listbox.scrollTop = itemBottom - listbox.clientHeight;
        }
      }
    }
  }, [highlightedIndex, isOpen]);

  // Handle option click
  const onOptionClick = (index: number) => {
    const option = filteredOptions[index];
    onChange(option.value);
    closeDropdown();
  };

  // Accessibility: id for listbox and input
  const listboxId = id ? `${id}-listbox` : undefined;
  const inputId = id ? `${id}-input` : undefined;

  return (
    <div
      className={`select-container${disabled ? " disabled" : ""}`}
      ref={containerRef}
    >
      <input
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen && highlightedIndex >= 0
            ? `${id}-option-${highlightedIndex}`
            : undefined
        }
        aria-haspopup="listbox"
        aria-disabled={disabled}
        id={inputId}
        name={name}
        ref={inputRef}
        className="select-input"
        placeholder={selectedOption ? selectedOption.label : placeholder}
        value={isOpen ? searchTerm : selectedOption?.label ?? ""}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        onFocus={() => {
          // Do not open dropdown on focus automatically
        }}
        autoComplete="off"
        disabled={disabled}
      />
      <button
        type="button"
        aria-label={isOpen ? "Close dropdown" : "Open dropdown"}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="select-toggle-button"
        onClick={toggleDropdown}
        tabIndex={-1}
        disabled={disabled}
      >
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 8 10 12 14 8" />
        </svg>
      </button>
      {isOpen && (
        <ul
          className="select-listbox"
          role="listbox"
          id={listboxId}
          ref={listboxRef}
          tabIndex={-1}
        >
          {filteredOptions.length === 0 && (
            <li className="select-no-options" role="option" aria-disabled="true">
              No options found
            </li>
          )}
          {filteredOptions.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;
            return (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`select-option${
                  isHighlighted ? " highlighted" : ""
                }${isSelected ? " selected" : ""}`}
                onMouseDown={(e) => {
                  // Prevent input blur before click handler
                  e.preventDefault();
                }}
                onClick={() => onOptionClick(index)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
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
  width: 250px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #222;
}

.select-container.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.select-input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 32px 8px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline-offset: 2px;
  outline-color: transparent;
  font-size: 14px;
}

.select-input:focus {
  border-color: #2684ff;
  outline-color: #2684ff;
  outline-style: solid;
  outline-width: 2px;
}

.select-toggle-button {
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-toggle-button:focus {
  outline: 2px solid #2684ff;
  outline-offset: 2px;
}

.select-listbox {
  position: absolute;
  z-index: 1000;
  margin-top: 4px;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0;
  list-style: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.select-option {
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
}

.select-option.highlighted {
  background-color: #2684ff;
  color: white;
}

.select-option.selected {
  font-weight: 600;
}

.select-option.highlighted.selected {
  background-color: #0052cc;
}

.select-option:hover {
  background-color: #2684ff;
  color: white;
}

.select-no-options {
  padding: 8px 12px;
  color: #999;
  cursor: default;
  user-select: none;
}
```


### Tokens: {'input_tokens': 290, 'output_tokens': 2297, 'reasoning_tokens': 0}
### Execution time: 76.6510398387909
