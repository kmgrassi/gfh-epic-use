// eslint-disable react-hooks/exhaustive-deps
import React, { useEffect, useState } from "react";
import { useDepartment } from "../context/DepartmentContext";

export const DepartmentFilter: React.FC = () => {
  const {
    departments,
    selectedDepartments,

    setSelectedDepartments,
    isFiltering,
  } = useDepartment();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingSelections, setPendingSelections] = useState<string[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);

  // Debounce search term
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update pending selections when search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      // When searching, only show departments that match the search
      // Keep the selection state for departments that are in the filtered list
      const filteredPendingSelections = pendingSelections.filter((dept) =>
        dept.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setPendingSelections(filteredPendingSelections);
    } else if (searchTerm === "") {
      // When search is cleared, restore all previously selected departments
      setPendingSelections(selectedDepartments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, searchTerm, selectedDepartments]);

  // Initialize pending selections when dropdown opens
  React.useEffect(() => {
    if (isDropdownOpen) {
      setPendingSelections(selectedDepartments);
    }
  }, [isDropdownOpen, selectedDepartments]);

  const handleDepartmentToggle = (department: string) => {
    if (pendingSelections.includes(department)) {
      setPendingSelections(pendingSelections.filter((d) => d !== department));
    } else {
      setPendingSelections([...pendingSelections, department]);
    }
  };

  const handleSelectAll = () => {
    // When selecting all, select all departments that are currently visible (filtered)
    setPendingSelections(filteredDepartments);
  };

  const handleClearAll = () => {
    // When clearing all, clear all departments that are currently visible (filtered)
    setPendingSelections([]);
  };

  const handleSubmit = async () => {
    setIsApplyingFilter(true);

    // Add a small delay to show the loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSelectedDepartments(pendingSelections);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setIsApplyingFilter(false);
  };

  const handleCancel = () => {
    setPendingSelections(selectedDepartments);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDepartments = departments.filter((department) =>
    department.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const selectedCount = selectedDepartments.length;
  const totalCount = departments.length;
  const filteredCount = filteredDepartments.length;
  const pendingCount = pendingSelections.length;

  // Count how many of the filtered departments are actually selected
  const selectedFilteredCount = filteredDepartments.filter((department) =>
    selectedDepartments.includes(department)
  ).length;

  // Check if all filtered departments are selected in pending selections
  const allFilteredSelected = filteredDepartments.every((department) =>
    pendingSelections.includes(department)
  );

  if (departments.length === 0) {
    return null;
  }

  return (
    <div className="department-filter">
      <div className="filter-dropdown">
        <button
          className={`dropdown-button ${isFiltering ? "loading" : ""}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isFiltering}
        >
          {isFiltering ? (
            <>
              <span className="loading-spinner"></span>
              Filtering...
            </>
          ) : (
            <>
              {debouncedSearchTerm
                ? selectedFilteredCount === filteredCount
                  ? `All "${debouncedSearchTerm}" (${selectedFilteredCount} of ${totalCount})`
                  : `"${debouncedSearchTerm}" - ${selectedFilteredCount} of ${filteredCount} shown, ${selectedCount} total`
                : selectedCount === totalCount
                ? "All Departments"
                : `${selectedCount} of ${totalCount} Departments`}
              <span
                className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
              >
                ▼
              </span>
            </>
          )}
        </button>

        {isDropdownOpen && !isFiltering && (
          <div className="dropdown-menu department-menu">
            <div className="department-header">
              <span className="department-title">Departments</span>
              <div className="department-actions">
                <button
                  className="department-action-btn"
                  onClick={handleSelectAll}
                  disabled={allFilteredSelected || filteredCount === 0}
                >
                  {debouncedSearchTerm
                    ? `All "${debouncedSearchTerm}" (${filteredCount})`
                    : "All"}
                </button>
                <button
                  className="department-action-btn"
                  onClick={handleClearAll}
                  disabled={pendingCount === 0}
                >
                  Clear
                </button>
                <button
                  className="department-close-btn"
                  onClick={handleCancel}
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="department-search">
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`department-search-input ${
                  isSearching ? "loading" : ""
                }`}
              />
              {isSearching ? (
                <div className="search-status">
                  <span className="loading-spinner"></span> Searching...
                </div>
              ) : (
                searchTerm !== debouncedSearchTerm && (
                  <div className="search-status">Searching...</div>
                )
              )}
            </div>

            <div className="department-apply-section">
              <button
                className={`department-submit-btn ${
                  isApplyingFilter ? "loading" : ""
                }`}
                onClick={handleSubmit}
                disabled={pendingCount === 0 || isApplyingFilter}
              >
                {isApplyingFilter ? (
                  <>
                    <span className="loading-spinner"></span>
                    Applying Filter...
                  </>
                ) : debouncedSearchTerm ? (
                  `Apply "${debouncedSearchTerm}" Filter (${pendingCount} selected)`
                ) : (
                  `Apply Filter (${pendingCount} selected)`
                )}
              </button>
            </div>

            <div className="department-list">
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <label key={department} className="department-option">
                    <input
                      type="checkbox"
                      checked={pendingSelections.includes(department)}
                      onChange={() => handleDepartmentToggle(department)}
                    />
                    <span className="department-name">{department}</span>
                  </label>
                ))
              ) : (
                <div className="no-results">
                  {debouncedSearchTerm
                    ? `No departments found for "${debouncedSearchTerm}"`
                    : "No departments found"}
                </div>
              )}
            </div>

            <div className="department-footer">
              <div className="department-summary">
                {debouncedSearchTerm
                  ? `${selectedFilteredCount} of ${filteredCount} shown selected (${selectedCount} total)`
                  : `${pendingCount} of ${totalCount} departments selected`}
              </div>
              <div className="department-buttons">
                <button
                  className="department-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
