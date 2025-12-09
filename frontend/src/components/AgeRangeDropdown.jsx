import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import "./AgeRangeDropdown.css";

function AgeRangeDropdown({ ageRange, setAgeRange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const ageRanges = ["18-25", "26-35", "36-45", "46-60", "60+"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // display text for button
  const displayText =
    ageRange?.length > 0 ? `Age: ${ageRange.join(", ")}` : "Age Range";

  const handleSelect = (range) => {
    // if already selected → remove it
    if (ageRange.includes(range)) {
      setAgeRange(ageRange.filter((r) => r !== range));
    } else {
      setAgeRange([...ageRange, range]);
    }
  };

  return (
    <div className={`age-range-dropdown ${isOpen ? "open" : ""}`} ref={dropdownRef}>
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        <span>{displayText}</span>
        <ChevronDown className="chevron" />
      </button>

      {isOpen && (
        <div className="dropdown-items">
          {ageRanges.map((range) => (
            <button
              key={range}
              onClick={() => handleSelect(range)}
              className={`dropdown-item ${ageRange.includes(range) ? "selected" : ""}`}
            >
              <span>{range}</span>
              {ageRange.includes(range) && <Check className="check-icon" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgeRangeDropdown;
