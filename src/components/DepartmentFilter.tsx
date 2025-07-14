import React, { useState } from "react";
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

  const handleDepartmentToggle = (department: string) => {
    if (selectedDepartments.includes(department)) {
      setSelectedDepartments(
        selectedDepartments.filter((d) => d !== department)
      );
    } else {
      setSelectedDepartments([...selectedDepartments, department]);
    }
  };

  const handleSelectAll = () => {
    setSelectedDepartments(filteredDepartments);
  };

  const handleClearAll = () => {
    setSelectedDepartments([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDepartments = departments.filter((department) =>
    department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCount = selectedDepartments.length;
  const totalCount = departments.length;
  const filteredCount = filteredDepartments.length;

  // Check if all filtered departments are selected
  const allFilteredSelected = filteredDepartments.every((department) =>
    selectedDepartments.includes(department)
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
              {selectedCount === totalCount
                ? searchTerm
                  ? `All "${searchTerm}" (${selectedCount} of ${totalCount})`
                  : "All Departments"
                : searchTerm
                ? `"${searchTerm}" - ${selectedCount} of ${totalCount} Departments`
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
                  {searchTerm
                    ? `All "${searchTerm}" (${filteredCount})`
                    : "All"}
                </button>
                <button
                  className="department-action-btn"
                  onClick={handleClearAll}
                  disabled={selectedCount === 0}
                >
                  Clear
                </button>
                <button
                  className="department-close-btn"
                  onClick={() => setIsDropdownOpen(false)}
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
                className="department-search-input"
              />
            </div>

            <div className="department-list">
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <label key={department} className="department-option">
                    <input
                      type="checkbox"
                      checked={selectedDepartments.includes(department)}
                      onChange={() => handleDepartmentToggle(department)}
                    />
                    <span className="department-name">{department}</span>
                  </label>
                ))
              ) : (
                <div className="no-results">No departments found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
