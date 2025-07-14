import React from "react";

interface DataTypeHeaderProps {
  dataType: "Inpatient" | "Outpatient";
}

export const DataTypeHeader: React.FC<DataTypeHeaderProps> = ({ dataType }) => {
  const getDataTypeColor = () => {
    return dataType === "Inpatient" ? "#4caf50" : "#ff9800";
  };

  const getDataTypeIcon = () => {
    return dataType === "Inpatient" ? "🏥" : "🏢";
  };

  return (
    <div className="data-type-header">
      <div
        className="data-type-badge"
        style={{
          backgroundColor: getDataTypeColor(),
          color: "white",
        }}
      >
        <span className="data-type-icon">{getDataTypeIcon()}</span>
        <span className="data-type-text">{dataType}</span>
      </div>
    </div>
  );
};
