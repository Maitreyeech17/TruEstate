import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import TransactionTable from './components/TransactionTable';
import Pagination from './components/Pagination';
import SortDropdown from './components/SortDropdown';
import StatsBoxes from './components/StatsBoxes';
import LoadingSpinner from './components/LoadingSpinner';
import { getTransactions, getFilterOptions } from './services/api';
import './App.css';
import React from "react";

function App() {
  // State management
  const [transactions, setTransactions] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    categories: [],
    genders: [],
    paymentMethods: [],
    tags: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
  const [ageRange, setAgeRange] = useState([]);


  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Sort and pagination states
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await getFilterOptions();
        if (response.success) {
          setFilterOptions(response.data);
        }
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    loadFilterOptions();
  }, []);

  // Fetch transactions whenever filters/sort/page changes
  useEffect(() => {
    fetchTransactions();
  }, [
    search,
    selectedRegions,
    selectedCategories,
    selectedTags,
    selectedGender,
    selectedPaymentMethods,
    ageRange,
    dateRange,
    sortBy,
    currentPage
  ]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        sort: sortBy
      };

      // Add search
      if (search.trim()) params.search = search.trim();

      // Add multi-select filters
      if (selectedRegions.length > 0) params.regions = selectedRegions.join(',');
      if (selectedCategories.length > 0) params.categories = selectedCategories.join(',');
      if (selectedTags.length > 0) params.tags = selectedTags.join(',');
      if (selectedGender.length > 0) params.gender = selectedGender.join(',');
      if (selectedPaymentMethods.length > 0) params.paymentMethods = selectedPaymentMethods.join(',');

      // Add age ranges (multi select)
if (ageRange.length > 0) {
  const mins = [];
  const maxs = [];

  ageRange.forEach((range) => {
    if (range === "60+") {
      mins.push(60);
    } else {
      const [min, max] = range.split("-").map(Number);
      mins.push(min);
      maxs.push(max);
    }
  });

  params.ageMin = Math.min(...mins); // lowest range selected
  params.ageMax = maxs.length > 0 ? Math.max(...maxs) : null; // highest max or null
}


      // Add date range
      if (dateRange.start) params.dateStart = dateRange.start;
      if (dateRange.end) params.dateEnd = dateRange.end;

      const response = await getTransactions(params);

      if (response.success) {
        setTransactions(response.data);
        setPagination(response.pagination);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedRegions([]);
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedGender([]);
    setSelectedPaymentMethods([]);
    setAgeRange([]);

    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = search || 
    selectedRegions.length > 0 || 
    selectedCategories.length > 0 || 
    selectedTags.length > 0 || 
    selectedGender.length > 0 || 
    selectedPaymentMethods.length > 0 || 
    ageRange.min || 
    ageRange.max || 
    dateRange.start || 
    dateRange.end;

  return (
    <div className="app-container">
      <div className="app-layout">
        {/* Main Content */}
        <main className="app-main">
          {/* Header Row */}
          <div className="header-section">
            <div className="header-content">
              <h1 className="header-title">Sales Management System</h1>
              <div className="header-search">
                <SearchBar 
                  value={search} 
                  onChange={setSearch}
                  onSearch={() => setCurrentPage(1)}
                />
              </div>
            </div>
          </div>

          {/* Filter Panel Row */}
          <div className="filter-section">
            <div className="filter-content">
              <div className="filter-left">
                <FilterPanel
                  filterOptions={filterOptions}
                  selectedRegions={selectedRegions}
                  setSelectedRegions={setSelectedRegions}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  selectedGender={selectedGender}
                  setSelectedGender={setSelectedGender}
                  selectedPaymentMethods={selectedPaymentMethods}
                  setSelectedPaymentMethods={setSelectedPaymentMethods}
                  ageRange={ageRange}
                  setAgeRange={setAgeRange}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  onReset={handleResetFilters}
                  hasActiveFilters={hasActiveFilters}
                  onApply={() => setCurrentPage(1)}
                />
              </div>

              <div className="filter-right">
                <SortDropdown 
                  value={sortBy} 
                  onChange={(val) => {
                    setSortBy(val);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="content-area">
            {/* Stats Boxes */}
            <StatsBoxes transactions={transactions} />

            {/* Error State */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <LoadingSpinner />
            ) : transactions.length === 0 ? (
              /* Empty State */
              <div className="empty-state">
                <p className="empty-text">No transactions found</p>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="clear-filters-btn"
                  >
                    Clear filters to see all transactions
                  </button>
                )}
              </div>
            ) : (
              /* Transaction Table */
              <>
                <TransactionTable transactions={transactions} />
                
                {/* Pagination */}
                <div className="pagination-wrapper">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;