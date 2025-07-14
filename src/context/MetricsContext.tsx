import React, { createContext, useContext, useEffect, useState } from "react";
import {
  detectDataType,
  getAggregateMetrics,
  getMetricsData,
  getUniqueMetrics,
} from "../utils/metricParser";
import {
  aggregateParams,
  MetricData,
  MetricsContextType,
  MetricWithStats,
  outpatientAggregateParams,
  outpatientPossibleParams,
  possibleParams,
} from "./types";

const MetricsContext = createContext<MetricsContextType | undefined>(
  {} as MetricsContextType
);

export const MetricsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metrics, setMetrics] = useState<MetricWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const [aggregateMetrics, setAggregateMetrics] = useState<MetricWithStats[]>(
    []
  );
  const [uploadedMetricsData, setUploadedMetricsData] = useState<
    MetricData[] | null
  >(null);
  const [dataType, setDataType] = useState<"Inpatient" | "Outpatient">(
    "Outpatient"
  );

  const filteredMetrics =
    selectedParams.length > 0
      ? metrics.filter((metric) => {
          // For outpatient data, exclude individual In Basket and Notes metrics
          // since we want to show only the aggregated versions
          if (dataType === "Outpatient") {
            return selectedParams.some((param) => {
              // Exclude individual In Basket and Notes metrics
              if (
                metric.metric.includes("In Basket") ||
                metric.metric.includes("Notes")
              ) {
                return false;
              }
              // Include Orders and Communications metrics
              return metric.metric === param;
            });
          } else {
            // For inpatient data, use exact matching
            return selectedParams.includes(metric.metric);
          }
        })
      : metrics;

  const totalCount = filteredMetrics.reduce(
    (sum, metric) => sum + metric.count,
    0
  );

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the metrics data (either uploaded or default)
      const metricsData = await getMetricsData(uploadedMetricsData);

      // Detect data type
      const detectedDataType = detectDataType(metricsData);
      setDataType(detectedDataType);

      // Set appropriate parameters based on data type
      const appropriateParams =
        detectedDataType === "Inpatient"
          ? possibleParams.map((param) => param.title)
          : outpatientPossibleParams.map((param) => param.title);
      setSelectedParams(appropriateParams);

      const [uniqueMetrics, aggregate] = await Promise.all([
        Promise.resolve(getUniqueMetrics(metricsData)),
        getAggregateMetrics(
          detectedDataType === "Inpatient"
            ? aggregateParams
            : outpatientAggregateParams,
          metricsData
        ),
      ]);

      setMetrics(uniqueMetrics);
      setAggregateMetrics(aggregate);
    } catch (err) {
      setError("Failed to fetch metrics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadData = async (data: MetricData[]) => {
    // Set the uploaded data in state - useEffect will handle processing
    setUploadedMetricsData(data);
  };

  const clearData = () => {
    setUploadedMetricsData(null);
    // useEffect will trigger fetchMetrics when uploadedMetricsData changes
  };

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedMetricsData]);

  const value = {
    metrics,
    loading,
    error,
    selectedParams,
    aggregateMetrics,
    setSelectedParams,
    refreshMetrics: fetchMetrics,
    filteredMetrics,
    totalCount,
    uploadData,
    clearData,
    dataType,
  };

  return (
    <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error("useMetrics must be used within a MetricsProvider");
  }
  return context;
};
export { possibleParams };
