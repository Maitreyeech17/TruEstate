import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import React from 'react';
import './DateRangeDropdown.css'; // separate CSS file

function DateRangeDropdown({ dateRange, setDateRange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasValue = dateRange.start || dateRange.end;
  const displayText =
    hasValue
      ? `${dateRange.start || 'Start'} → ${dateRange.end || 'End'}`
      : 'Date Range';

  return (
    <div className="date-range-dropdown" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-button ${hasValue ? 'selected' : ''}`}
      >
        <span>{displayText}</span>
        <ChevronDown className={`dropdown-chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="dropdown-panel">
          <div className="calendar-inputs">
            <div>
              <label>Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div>
              <label>End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
          <button
            className="clear-button"
            onClick={() => setDateRange({ start: '', end: '' })}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default DateRangeDropdown;
