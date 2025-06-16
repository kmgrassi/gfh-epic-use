import fs from "fs";
import path from "path";

interface MetricData {
  "EMP CID": string;
  "SER CID": string;
  "Clinician Name": string;
  "Clinician Type": string;
  "Login Service Area": string;
  "Login Department": string;
  Specialty: string;
  "User Type": string;
  "Reporting Period Start Date": string;
  "Reporting Period End Date": string;
  Metric: string;
  Numerator: number;
  Denominator: number;
  Value: number;
  "Metric ID": number;
}

export const loadMetricsFile = (): MetricData[] => {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "SignalDownload_25-05-May.json"
    );
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading metrics file:", error);
    return [];
  }
};

export const getUniqueMetrics = (): string[] => {
  const metricsData = loadMetricsFile();
  const uniqueMetrics = new Set<string>();

  metricsData.forEach((entry) => {
    if (entry.Metric) {
      uniqueMetrics.add(entry.Metric);
    }
  });

  return Array.from(uniqueMetrics).sort();
};

// Example usage:
// const uniqueMetrics = getUniqueMetrics();
// console.log('Unique Metrics:', uniqueMetrics);
