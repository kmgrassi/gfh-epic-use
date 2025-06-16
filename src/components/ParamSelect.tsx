import React, { useEffect, useRef, useState } from "react";
import { possibleParams } from "../context/types";

interface ParamSelectProps {
  selectedParams: string[];
  onParamsChange: (params: string[]) => void;
}

export const ParamSelect: React.FC<ParamSelectProps> = ({
  selectedParams,
  onParamsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (metric: string) => {
    if (selectedParams.includes(metric)) {
      onParamsChange(selectedParams.filter((param) => param !== metric));
    } else {
      onParamsChange([...selectedParams, metric]);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="param-select" ref={dropdownRef}>
      <label htmlFor="param-select">Select Parameters:</label>
      <div className="param-select-trigger" onClick={toggleDropdown}>
        <div className="selected-count">
          {selectedParams.length}{" "}
          {selectedParams.length === 1 ? "parameter" : "parameters"} selected
        </div>
        <div className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</div>
      </div>

      {isOpen && (
        <div className="param-select-dropdown">
          {possibleParams.map((metric) => (
            <div
              key={metric.title}
              className={`param-option ${
                selectedParams.includes(metric.title) ? "selected" : ""
              }`}
              onClick={() => handleSelect(metric.title)}
            >
              <span className="param-option-text">{metric.title}</span>
              {selectedParams.includes(metric.title) && (
                <span className="param-option-check">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
