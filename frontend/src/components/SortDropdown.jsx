import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from 'lucide-react';
import './SortDropdown.css';

function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'name', label: 'Customer Name (A-Z)' },
    { value: 'date', label: 'Date (Newest First)' },
    { value: 'quantity', label: 'Quantity (High to Low)' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = sortOptions.find(opt => opt.value === value);

  return (
    <div className={`sort-dropdown ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <span>Sort by: {selectedOption?.label}</span>
        <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="dropdown-items">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={value === option.value ? 'selected' : ''}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortDropdown;
