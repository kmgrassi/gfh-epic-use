import React, { useRef } from "react";
import { MetricData } from "../context/types";

interface FileUploadProps {
  onDataUploaded: (data: MetricData[]) => void;
  loading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onDataUploaded, 
  loading = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/json") {
      alert("Please select a JSON file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);
        
        let metricsData: MetricData[];

        // Check if it's the new nested structure with UserWebMetadata and Data
        if (jsonData.UserWebMetadata && jsonData.Data) {
          // Extract the metrics data from the Data property
          metricsData = jsonData.Data;
          
          // Validate that Data is an array
          if (!Array.isArray(metricsData)) {
            throw new Error("Data property must be an array of metric data");
          }
          
          console.log("Uploaded file metadata:", jsonData.UserWebMetadata);
        } 
        // Check if it's a direct array (legacy format)
        else if (Array.isArray(jsonData)) {
          metricsData = jsonData;
        }
        // Invalid structure
        else {
          throw new Error("JSON must be either an array of metric data or an object with UserWebMetadata and Data properties");
        }

        // Basic validation of the first item to ensure it has expected properties
        if (metricsData.length > 0) {
          const firstItem = metricsData[0];
          const requiredFields = [
            "EMP CID", "SER CID", "Clinician Name", "Clinician Type",
            "Metric", "Value", "Metric ID"
          ];
          
          const missingFields = requiredFields.filter(field => !(field in firstItem));
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
          }
        }

        onDataUploaded(metricsData);
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert(`Error parsing JSON file: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    };

    reader.onerror = () => {
      alert("Error reading file");
    };

    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <button 
        className="upload-button"
        onClick={handleUploadClick}
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload JSON Data"}
      </button>
      <p className="upload-instructions">
        Select a JSON file with metric data to analyze<br/>
        Supports both direct arrays and nested data with UserWebMetadata
      </p>
    </div>
  );
};