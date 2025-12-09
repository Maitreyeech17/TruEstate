import { Search } from "lucide-react";
import React from "react";
import "./SearchBar.css";

function SearchBar({ value, onChange, onSearch }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="searchbar-wrapper">
      <Search className="searchbar-icon" />
      <input
        type="text"
        placeholder="Name, phone no..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
}

export default SearchBar;
