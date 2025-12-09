import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import "./MultiSelectDropdown.css";

function MultiSelectDropdown({ label, options, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const displayText =
    selected.length > 0 ? `${label} (${selected.length})` : label;

  return (
    <div className={`multi-select-dropdown ${isOpen ? "open" : ""}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-button"
      >
        <span>{displayText}</span>
        <ChevronDown className="chevron" />
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="dropdown-items">
          {options.length === 0 ? (
            <div className="no-options">No options available</div>
          ) : (
            options.map((option) => (
              <button
                key={option}
                onClick={() => handleToggle(option)}
                className={`dropdown-item ${selected.includes(option) ? "selected" : ""}`}
              >
                <span>{option}</span>
                {selected.includes(option) && <Check className="check-icon" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MultiSelectDropdown;
