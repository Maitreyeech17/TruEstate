import React from "react";
import "./FilterPanel.css";
import { RefreshCw } from 'lucide-react';
import MultiSelectDropdown from './MultiSelectDropdown';
import DateRangeDropdown from './DateRangeDropdown';
import AgeRangeDropdown from './AgeRangeDropdown';

function FilterPanel({
  filterOptions,
  selectedRegions,
  setSelectedRegions,
  selectedCategories,
  setSelectedCategories,
  selectedTags,
  setSelectedTags,
  selectedGender,
  setSelectedGender,
  selectedPaymentMethods,
  setSelectedPaymentMethods,
  ageRange,
  setAgeRange,
  dateRange,
  setDateRange,
  onReset,
  hasActiveFilters,
  onApply
}) {
  return (
    <div className="filter-panel-container">
      <div className="filter-panel-left">
        {/* Refresh Button */}
        <button
          onClick={onReset}
          className="filter-panel-button"
          title="Reset filters"
        >
          <RefreshCw className="filter-panel-icon" />
        </button>

        {/* Customer Region */}
        <MultiSelectDropdown
          label="Customer Region"
          options={filterOptions.regions}
          selected={selectedRegions}
          onChange={setSelectedRegions}
        />

        {/* Gender */}
        <MultiSelectDropdown
          label="Gender"
          options={filterOptions.genders}
          selected={selectedGender}
          onChange={setSelectedGender}
        />

        {/* Age Range */}
        <MultiSelectDropdown
  label="Age Range"
  options={["18-25", "26-35", "36-45", "46-60", "60+"]}
  selected={ageRange}
  onChange={setAgeRange}
/>


        {/* Product Category */}
        <MultiSelectDropdown
          label="Product Category"
          options={filterOptions.categories}
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />

        {/* Tags */}
        <MultiSelectDropdown
          label="Tags"
          options={filterOptions.tags}
          selected={selectedTags}
          onChange={setSelectedTags}
        />

        {/* Payment Method */}
        <MultiSelectDropdown
          label="Payment Method"
          options={filterOptions.paymentMethods}
          selected={selectedPaymentMethods}
          onChange={setSelectedPaymentMethods}
        />

        {/* Date Range */}
        <DateRangeDropdown
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
    </div>
  );
}

export default FilterPanel;
