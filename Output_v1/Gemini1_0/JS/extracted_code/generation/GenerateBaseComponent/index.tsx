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