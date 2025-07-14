import React, { useEffect, useState } from "react";

interface ProviderSearchProps {
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
  debounceMs?: number;
  isFiltering?: boolean;
}

export const ProviderSearch: React.FC<ProviderSearchProps> = ({
  onSearchChange,
  placeholder = "Search providers by name...",
  debounceMs = 1000,
  isFiltering = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Debounce the search term
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsDebouncing(true);
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
        setIsDebouncing(false);
      }, debounceMs);

      return () => clearTimeout(timer);
    }
  }, [searchTerm, debouncedSearchTerm, debounceMs]);

  // Call the parent's onSearchChange with the debounced value
  useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleClear = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setIsDebouncing(false);
  };

  const showLoading = isDebouncing || isFiltering;

  return (
    <div className="provider-search">
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className={`search-input ${showLoading ? "loading" : ""}`}
        />
        {showLoading && (
          <div className="search-loading-indicator">
            <span className="loading-spinner small"></span>
          </div>
        )}
        {searchTerm && !showLoading && (
          <button onClick={handleClear} className="clear-button">
            ✕
          </button>
        )}
      </div>
      {showLoading && (
        <div className="search-status">
          {isDebouncing ? "Typing..." : "Filtering providers..."}
        </div>
      )}
    </div>
  );
};
